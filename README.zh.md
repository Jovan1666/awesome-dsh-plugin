# Awesome DeepSeek Harness (DSH) Plugin [![Awesome](https://awesome.re/badge.svg)](https://awesome.re) ![awesome · DSH plugin](https://awesome-dsh-plugin.com/badge.svg) ![插件数量](https://img.shields.io/endpoint?url=https%3A%2F%2Fawesome-dsh-plugin.com%2Fcount.json&label=%E6%8F%92%E4%BB%B6)

[![Awesome DSH Plugin](https://awesome-dsh-plugin.com/banner-zh.png)](https://awesome-dsh-plugin.com/zh/)

[English](README.md) | 中文

> [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)（`dsh`）插件精选列表。

DeepSeek Harness 是 DeepSeek 开源的 agent harness——既是可直接运行的 Coding Agent（提供 Web 与 headless 两种形式），底层又是一套「一切皆插件」的框架：模型、工具、沙箱、会话存储、UI、乃至 Agent Loop 本身都是插件。插件既可以扩展官方 Coding Agent，也可以替换其核心部件，甚至组装出完全不同的东西。

本列表收录可通过 `dsh plugin add` 安装的社区插件（均声明了 `dsh.bundle` manifest）。欢迎 [PR](#贡献)。

> 🛒 **推荐安装 [dsh-market](https://github.com/dsh-market/dsh-market#readme)**（可选）——DeepSeek Harness 里的插件市场，本列表的插件都在里面。界面简单好上手，一键安装、升级插件，一键切换主题：

```sh
dsh plugin --profile web add dshmarket
```

<a href="https://raw.githubusercontent.com/dsh-market/dsh-market/main/assets/demo-zh.png"><img src="https://raw.githubusercontent.com/dsh-market/dsh-market/main/assets/demo-zh.png" width="320" alt="dsh-market 插件市场界面：设置页内的插件卡片列表，支持搜索、分类筛选、一键安装，以及主题 Tab"></a>

<sub><i>设置页里的插件市场——点击查看大图。</i></sub>

> 💡 更喜欢对话式？装 [dsh-find-plugin](https://github.com/awesome-dsh-plugin/dsh-find-plugin#readme)，想要什么插件直接问 agent（`dsh plugin --profile web add dsh-find-plugin`）。

> 💬 **每个插件页都能评论了。** 向作者提问、说说你拿它做了什么、或者给后来者提个醒——[看个例子](https://awesome-dsh-plugin.com/p/00080000/dsh-project-memory/)。讨论存在本仓库的 [GitHub Discussions](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/discussions) 里，除了你已有的 GitHub 账号之外不需要注册任何东西。不点开就不会加载。

> ℹ️ **关于桌面客户端。** 本列表与客户端无关：一个插件被收录，是因为它遵守官方协议——声明 `dsh.bundle` manifest、可通过 `dsh plugin add` 安装——而不是因为它适配了某个特定客户端。
>
> 我们正在与 `anywhere-labs/deepseek-harness-desktop` 沟通重新合作的事，有进展会在这里同步。无论结果如何，收录标准不变：适配任何单一客户端都不是收录条件，也不会有插件因为没有适配某个客户端而被移除或降权。
>
> 值得一试的客户端：[dsh-desktop](https://github.com/dataelement/dsh-desktop) 与 [deepseek-harness-desktop](https://github.com/hairyf/deepseek-harness-desktop)——两者均内嵌 dsh-market，本列表的插件一键即达。其他优秀的第三方客户端同样可以。

> [!WARNING]
> 安装插件等于在你的机器上跑第三方代码，权限和你本人一样大——能读你的文件、用你的凭据、访问网络，工具审批管不到插件自己的代码。收录不等于做过安全审查：装之前先看一眼源码，不熟的插件尽量放在没有密钥、没有重要资料的环境里试。完整免责声明见页面底部。

<details>
<summary><b>什么样的插件会被收录</b></summary>

一个条目被加进来，是因为它能用 `dsh plugin add` 装上、做的事与那一行描述一致、分类没放错、且仍在维护。每份投稿在合并前都会对着源码核一遍——描述里写「46 个工具」，就真的会有人去数。

标准就这些。**本列表不给插件排名，也不评判优劣，我们也无意这么做。** 很多优秀的软件永远不会出现在这里，而出现在这里也仅说明它符合上述规则，不说明别的。这些规则只为一件事存在：让你挑中的插件能装上，并且确实做描述里写的那件事。

收录也不是永久的：仓库消失、停止维护、或被发现有明显缺陷的条目会被移除。完整标准与评审清单见[收录如何评审](contributing.md#how-submissions-are-reviewed--收录如何评审)。

</details>

## 目录

<!-- BEGIN TOC -->
- [插件](#插件)
  - [🛠️ 工具与能力](#-工具与能力)
- [徽章](#徽章)
- [免责声明](#免责声明)
<!-- END TOC -->

## 插件

<!-- BEGIN PLUGINS -->
### 🛠️ 工具与能力

- [lemonxiny55/dsh-code-index](https://github.com/lemonxiny55/dsh-code-index) — 语义仓库索引：基于 tree-sitter 的符号索引、带排名的符号搜索，以及注入系统提示词的限量自动更新仓库地图。
<!-- END PLUGINS -->

## 贡献

欢迎提 PR 收录你的插件。**本页面由脚本生成，请不要手工编辑。** 改为新增一个 `data/plugins/<owner>__<repo>.yml` 文件：

```yaml
url: https://github.com/owner/repo
name: owner/repo
category: ui
description:
  en: One-line description ending with a period.
  zh: 一句话描述，以句号结尾。
```

一个插件一个文件，两份投稿永远不会碰同一个文件，PR 之间不再互相冲突。这一个 YAML 文件就是完整投稿——你的 PR 合并后，两个 README 会在 `main` 上自动重新生成。（想本地预览可以跑 `node scripts/generate-readme.mjs`，把结果一起提交也照样接受，但都不是必须的。）

你的仓库需要满足：

- `package.json` 声明 **`dsh.bundle`** —— 只有 `dsh.client` 无法安装；每个 PR 都会自动校验这一项
- 仓库**创建满 1 天**且**提交数 ≥ 10** —— 刚建的仓库达标后可以重新提交
- 已添加 [`dsh-plugin`](https://github.com/topics/dsh-plugin) topic

主题/皮肤类插件：放进**主题与外观**分类，会自动出现在 [dsh-market](https://github.com/dsh-market/dsh-market) 插件市场的**主题 Tab**，用户可一键安装、切换。

完整规则、示例与截图格式见[贡献指南](contributing.md)。

## 徽章

插件已被收录？欢迎在你的 README 里挂上徽章：

[![Awesome DSH Plugin](https://awesome-dsh-plugin.com/badge.svg)](https://awesome-dsh-plugin.com)

```markdown
[![Awesome DSH Plugin](https://awesome-dsh-plugin.com/badge.svg)](https://awesome-dsh-plugin.com)
```

## 免责声明

本项目是社区维护的索引。插件由各自作者开发与维护，收录不构成背书，亦不对任何插件的安全性、质量或维护状态作出保证。安装插件即在你的机器上运行第三方代码——请自行审阅源码、风险自担。本项目与 DeepSeek 无隶属关系。

本仓库的 issue 只处理清单与网站本身。插件市场界面里的问题请提到 [dsh-market](https://github.com/dsh-market/dsh-market/issues)；`dsh` 本体的问题请提到 [deepseek-harness](https://github.com/deepseek-ai/deepseek-harness/issues)；某个插件的 bug 请到该插件自己的仓库提。
