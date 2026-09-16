#!/usr/bin/env node
/**
 * Fetch every listed plugin's README into data/readmes.json, consumed by
 * build-site.mjs to render real content on the detail pages.
 *
 * Monorepo subdir entries fetch the subdirectory's own README when present.
 * Each entry stores the markdown (truncated), plus raw/blob base URLs so the
 * builder can rewrite relative links and images to absolute GitHub URLs.
 *
 * The fetch itself needs no token — raw.githubusercontent.com serves these
 * files unauthenticated and off the API quota. Without a token the script still
 * exits 0 without touching the file, so a stray local run cannot rewrite the
 * committed data from a cold start.
 *
 * Usage: GITHUB_TOKEN=... node scripts/probe-readmes.mjs
 */
import fs from 'node:fs'
import LOCALES from '../site/locales.mjs'

const OUT_FILE = 'data/readmes.json'
// Fetching costs no API quota (see `raw` below), but it is still thousands of
// requests: the full sweep is the nightly PROBE_ALL run and a push-triggered
// run refreshes only what is new or stale. Same shape as probe-npm.mjs.
const RECHECK_DAYS = Number(process.env.PROBE_RECHECK_DAYS ?? 7)
const PROBE_ALL = process.env.PROBE_ALL === '1'
const CONCURRENCY = Number(process.env.PROBE_CONCURRENCY ?? (PROBE_ALL ? 4 : 8))
const MAX_BYTES = 48 * 1024

// The token is not needed to fetch anything any more — it stays required so a
// run nobody meant to make (a local invocation, a misconfigured CI) leaves the
// committed data alone instead of rewriting it from a cold start.
if (!process.env.GITHUB_TOKEN) {
  console.log('no GITHUB_TOKEN — keeping committed readme data as-is')
  process.exit(0)
}

const map = fs.existsSync(OUT_FILE) ? JSON.parse(fs.readFileSync(OUT_FILE, 'utf8')) : {}
const readme = fs.readFileSync(LOCALES[0].readme, 'utf8')
const urls = [...readme.matchAll(/^- \[.+?\]\((https:\/\/github\.com\/[^)]+)\) [—-] /gm)].map((m) => m[1])
const today = new Date().toISOString().slice(0, 10)

// crude language sniff: CJK-heavy → zh
const langOf = (md) => {
  const cjk = (md.match(/[一-鿿]/g) || []).length
  return cjk / Math.max(md.length, 1) > 0.03 ? 'zh' : 'en'
}

// counterpart filename candidates, tried in the same directory as the default README
const ZH_NAMES = ['README.zh.md', 'README.zh-CN.md', 'README_zh.md', 'README_zh-CN.md', 'README-zh.md', 'README.cn.md', 'README_CN.md', 'docs/README.zh.md', 'docs/i18n/README.zh-CN.md']
const EN_NAMES = ['README.en.md', 'README_EN.md', 'README-en.md', 'README.en-US.md', 'docs/README.en.md']

// `HEAD` is a valid ref on both hosts and resolves to the default branch, so
// neither the branch name nor the README's path has to be discovered first —
// which is what kept the old implementation on the contents API.
function pack(md, repo, path) {
  if (md.length > MAX_BYTES) md = md.slice(0, MAX_BYTES) + '\n\n…'
  const dir = path.split('/').slice(0, -1).join('/')
  const base = `https://raw.githubusercontent.com/${repo}/HEAD/${dir ? dir + '/' : ''}`
  const blobBase = `https://github.com/${repo}/blob/HEAD/${dir ? dir + '/' : ''}`
  return { md, htmlUrl: `https://github.com/${repo}/blob/HEAD/${path}`, base, blobBase, fetchedAt: today }
}

// The README's filename is not known in advance; the API used to resolve it.
// Trying the plausible names directly is cheaper now that fetching is free.
const MAIN_NAMES = [
  'README.md', 'readme.md', 'Readme.md', 'README.MD', 'README.markdown',
  'README.rst', 'README.txt', 'README',
  'docs/README.md', '.github/README.md',
]

/**
 * Fetch one file from raw.githubusercontent.com.
 *
 * Raw serves the same bytes as the contents API and **does not count against
 * the API quota at all** — the pattern probe-npm.mjs and scan-decay.mjs have
 * used since they were written. The contents API cost up to four REST calls per
 * repository, and the list outgrew what the Actions token can pay for: on
 * 2026-09-15 and 09-16 every nightly reported "3334 repo(s) failed the first
 * pass", leaving ~90% of detail pages stale — one entry had not refreshed since
 * 09-06.
 *
 * Returns the markdown, or null for a definite miss. Raw cannot tell "no
 * README" apart from "no repository", and the decay scan is where repository
 * existence is decided (from repo metadata, not from a file miss), so a miss
 * here is reported as a failure and leaves the previous README in place.
 */
async function raw(repo, path) {
  for (let attempt = 0; ; attempt++) {
    let res
    try {
      res = await fetch(`https://raw.githubusercontent.com/${repo}/HEAD/${path}`, {
        headers: { 'user-agent': 'awesome-dsh-plugin-readme-probe' },
        signal: AbortSignal.timeout(20000),
      })
    } catch {
      if (attempt >= 3) return null
      await new Promise((r) => setTimeout(r, 1500 * 2 ** attempt))
      continue
    }
    if (res.status === 404) return null
    if (!res.ok) {
      if (attempt >= 3) return null
      await new Promise((r) => setTimeout(r, 1500 * 2 ** attempt))
      continue
    }
    const md = await res.text()
    return md.length ? md : null
  }
}

async function probe(url) {
  const repoPath = url.replace('https://github.com/', '').replace(/\/$/, '')
  const repo = repoPath.split('/').slice(0, 2).join('/')
  const sub = repoPath.includes('/tree/') ? repoPath.split('/tree/')[1].replace(/^[^/]+\//, '') : null
  try {
    // A subdir entry prefers its own README, then falls back to the root one.
    const dirs = sub ? [`${sub}/`, ''] : ['']
    let found = null
    for (const dir of dirs) {
      for (const name of MAIN_NAMES) {
        const md = await raw(repo, `${dir}${name}`)
        if (md) { found = { md, path: `${dir}${name}` }; break }
      }
      if (found) break
    }
    if (!found) return null

    const main = pack(found.md, repo, found.path)
    const mainLang = langOf(main.md)
    const out = { [mainLang]: main, fetchedAt: today }

    // The other language, next to the default README. Raw answers a miss with a
    // 404 and costs nothing, so the candidates are tried rather than discovered
    // through a directory listing — and the listing was case-insensitive only
    // because it had to match what GitHub reported, which no longer applies.
    const dir = found.path.split('/').slice(0, -1).join('/')
    const names = mainLang === 'en' ? ZH_NAMES : EN_NAMES
    const otherLang = mainLang === 'en' ? 'zh' : 'en'
    for (const name of names) {
      const path = dir ? `${dir}/${name}` : name
      const md = await raw(repo, path)
      if (!md) continue
      // trust the sniff over the filename — some "zh" files are English stubs
      if (langOf(md) === otherLang) { out[otherLang] = pack(md, repo, path); break }
    }
    return out
  } catch {
    // A miss already returned above, so reaching here means the fetch itself
    // broke. Recorded as a failure, never as "ships no README": the two are
    // different facts, and only one of them justifies dropping a README that is
    // already published.
    return null
  }
}

const fresh = (entry) =>
  !PROBE_ALL
  && entry !== undefined
  && entry.fetchedAt
  && (Date.now() - new Date(entry.fetchedAt).getTime()) / 86400000 <= RECHECK_DAYS

const pending = urls.filter((url) => !fresh(map[url]))
console.log(`${urls.length} listed, ${pending.length} to fetch${PROBE_ALL ? ' (PROBE_ALL)' : ''}`)

const failed = []
let done = 0
for (let i = 0; i < pending.length; i += CONCURRENCY) {
  const batch = pending.slice(i, i + CONCURRENCY)
  const results = await Promise.all(batch.map(async (url) => [url, await probe(url)]))
  for (const [url, result] of results) {
    if (result === null) failed.push(url)
    else map[url] = result
  }
  done += batch.length
  if (done % 50 === 0 || done >= pending.length) console.log(`readmes ${done}/${pending.length}`)
}

// A failure leaves an existing entry on its last good README, which is fine.
// An entry added since the previous run has nothing to fall back on, and its
// page renders with no README at all — which is what happened to every plugin
// merged today. It stayed invisible because a failure and a hit looked the
// same from the outside: this pass issues roughly sixty requests a second,
// trips GitHub's secondary limit, and still printed a healthy count.
if (failed.length) {
  console.log(`${failed.length} repo(s) failed the first pass — retrying serially`)
  await new Promise((r) => setTimeout(r, 20000))
  const stillFailed = []
  for (const url of failed) {
    const result = await probe(url)
    if (result === null) stillFailed.push(url)
    else map[url] = result
    await new Promise((r) => setTimeout(r, 250))
  }
  failed.length = 0
  failed.push(...stillFailed)
}

// drop entries for URLs no longer listed
const listed = new Set(urls)
for (const k of Object.keys(map)) if (!listed.has(k)) delete map[k]

const sorted = Object.fromEntries(Object.entries(map).sort(([a], [b]) => a.localeCompare(b)))
fs.writeFileSync(OUT_FILE, JSON.stringify(sorted) + '\n')
// The "N ship no README" count is gone with the API call that produced it: raw
// cannot tell a repository with no README from one that is gone, and guessing
// would be worse than not reporting. Repository existence is the decay scan's
// job, where it comes from repo metadata rather than from a file miss.
console.log(`readmes.json written: ${Object.keys(sorted).length} repos`)

// Say what was not fetched. A count of successes cannot distinguish a repo
// with no README from one we never reached, and the entries that suffer are
// the newest — exactly the ones their author is looking at.
if (failed.length) {
  const fresh = failed.filter((u) => !(u in map))
  console.log(`${failed.length} repo(s) could not be fetched; ${fresh.length} have no previous data and will render without a README:`)
  for (const u of failed.slice(0, 20)) console.log(`  ${u}${u in map ? ' (kept previous)' : ' (NEW — page will show no README)'}`)
  if (failed.length > 20) console.log(`  … and ${failed.length - 20} more`)
}
