# Awesome DeepSeek Harness (DSH) Plugin [![Awesome](https://awesome.re/badge.svg)](https://awesome.re) ![awesome · DSH plugin](https://awesome-dsh-plugin.com/badge.svg) ![plugin count](https://img.shields.io/endpoint?url=https%3A%2F%2Fawesome-dsh-plugin.com%2Fcount.json)

[![Awesome DSH Plugin](https://awesome-dsh-plugin.com/banner-en.png)](https://awesome-dsh-plugin.com)

English | [中文](README.zh.md)

> A curated list of plugins for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (`dsh`).

DeepSeek Harness is DeepSeek's open-source agent harness — a runnable coding agent (Web and headless), built on a framework where everything is a plugin: models, tools, sandboxes, session storage, UI, even the agent loop itself. Plugins can extend the official coding agent, swap out its core parts, or assemble something entirely different.

This list collects community plugins that are installable via `dsh plugin add` (each declares a `dsh.bundle` manifest). [PRs welcome](#contributing).

> 🛒 **Recommended: [dsh-market](https://github.com/dsh-market/dsh-market#readme)** (optional) — the plugin market inside DeepSeek Harness, with every plugin on this list. Simple, friendly UI: one-click plugin install and upgrade, one-click theme switching:

```sh
dsh plugin --profile web add dshmarket
```

<a href="https://raw.githubusercontent.com/dsh-market/dsh-market/main/assets/demo-en.png"><img src="https://raw.githubusercontent.com/dsh-market/dsh-market/main/assets/demo-en.png" width="320" alt="dsh-market plugin browser inside DeepSeek Harness Settings: searchable plugin cards with one-click Install, category filters and a Themes tab"></a>

<sub><i>The plugin market inside Settings — click to enlarge.</i></sub>

> 💡 Prefer chat? [dsh-find-plugin](https://github.com/awesome-dsh-plugin/dsh-find-plugin#readme) lets your agent find plugins for you (`dsh plugin --profile web add dsh-find-plugin`).

> 💬 **Every plugin page takes comments.** Ask the author a question, say what you used it for, or warn the next reader — [see an example](https://awesome-dsh-plugin.com/p/00080000/dsh-project-memory/). Threads live in this repository's [GitHub Discussions](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/discussions), so there is no account to make beyond the GitHub one you have. Nothing loads until you ask for it.

> ℹ️ **On desktop clients.** This list is client-agnostic. A plugin is listed because it follows the official protocol — it declares a `dsh.bundle` manifest and installs with `dsh plugin add` — not because it adapts to any particular client.
>
> We're talking with `anywhere-labs/deepseek-harness-desktop` about working together again; we'll update this note as that progresses. Whatever comes of it, the listing rule stays as it is: adapting to any particular client is not a condition of being listed, and no plugin will be removed or demoted for not doing so.
>
> Clients worth a look: [dsh-desktop](https://github.com/dataelement/dsh-desktop) and [deepseek-harness-desktop](https://github.com/hairyf/deepseek-harness-desktop) — both ship dsh-market built in, so everything on this list is one click away. Any other good third-party client works too.

> [!WARNING]
> Installing a plugin runs third-party code on your machine with your own permissions — it can read your files, use your credentials, and reach the network. Tool approvals don't sandbox plugin code. Being on this list is not a security review: check the source before you install, and try unfamiliar plugins somewhere that doesn't hold your keys. See the full disclaimer at the bottom of this page.

<details>
<summary><b>What it takes to be listed here</b></summary>

An entry is added when the plugin installs with `dsh plugin add`, does what its one-line description says, sits in the right category, and is maintained. Every submission is checked against its own source before merging — if a description claims "46 tools", someone counts them.

That is the whole bar. **This list doesn't rank plugins or judge their quality, and we don't want to.** Plenty of good software will never appear here, and a slot here proves nothing beyond meeting those rules. They exist so that whatever you pick installs and behaves the way the line said it would.

A listing isn't permanent either: entries whose repos go away, stop being maintained, or turn out to be broken get removed. Full criteria and the review checklist: [how submissions are reviewed](contributing.md#how-submissions-are-reviewed--收录如何评审).

</details>

## Contents

<!-- BEGIN TOC -->
- [Plugins](#plugins)
  - [Tools & Capabilities](#tools--capabilities)
- [Badge](#badge)
- [Disclaimer](#disclaimer)
<!-- END TOC -->

## Plugins

<!-- BEGIN PLUGINS -->
### Tools & Capabilities

- [lemonxiny55/dsh-code-index](https://github.com/lemonxiny55/dsh-code-index) - Semantic repo index: tree-sitter symbol search across 6 languages, plus a bounded repo map ranked by import-graph PageRank that auto-updates in the system prompt.
<!-- END PLUGINS -->

## Contributing

PRs welcome. **This page is generated — don't edit it by hand.** Add one file at `data/plugins/<owner>__<repo>.yml` instead:

```yaml
url: https://github.com/owner/repo
name: owner/repo
category: ui
description:
  en: One-line description ending with a period.
  zh: 一句话描述，以句号结尾。
```

One file per plugin means two submissions never touch the same file, so PRs stop conflicting with each other. That single YAML file is the whole submission — both READMEs are regenerated automatically on `main` after your PR merges. (Running `node scripts/generate-readme.mjs` locally to preview is fine, and committing the result is still accepted, but neither is required.)

Your repo must:

- declare a **`dsh.bundle`** manifest in `package.json` — `dsh.client` alone is not installable, and this is checked automatically on every PR
- be at least **1 day old** with **10 or more commits** — brand-new repos can resubmit once they clear this
- carry the [`dsh-plugin`](https://github.com/topics/dsh-plugin) topic

Themes & skins: entries under **Themes & Appearance** power the Themes tab in `dsh-market` — one-click install/switch for users.

Full rules, examples, and the screenshots format: [contributing.md](contributing.md).

## Badge

Listed here? Show it off:

![Awesome DSH Plugin](https://awesome-dsh-plugin.com/badge.svg)

```markdown
[![Awesome DSH Plugin](https://awesome-dsh-plugin.com/badge.svg)](https://awesome-dsh-plugin.com)
```

## Disclaimer

This is a community-maintained index. Plugins are developed and maintained by their respective authors; listing here is not an endorsement, and no guarantees are made about any plugin's safety, quality, or maintenance. Installing a plugin runs third-party code on your machine — review the source and install at your own risk. This project is not affiliated with DeepSeek.

Issues here are for the list and its website only. Problems inside the plugin market UI go to [dsh-market](https://github.com/dsh-market/dsh-market/issues); problems with `dsh` itself go to [deepseek-harness](https://github.com/deepseek-ai/deepseek-harness/issues); a bug in a plugin goes to that plugin's own repository.
