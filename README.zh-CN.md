<div align="center">

# Learning Coach

**把零散的 AI 对话变成一棵持续生长的个人知识树，记录真正掌握的内容，并指导下一步学习。**

[English](README.md) | 简体中文

</div>

<p align="center">
  <img src="assets/learning-coach-overview.png" alt="Learning Coach 将学习过程保存到私人 GitHub Vault" width="100%">
</p>

---

## 让学习不再随对话结束

大多数 AI 助手只回答当前问题。对话结束后，你学到了什么、哪里存在误解、下一步应该学习什么，通常都会消失。

Learning Coach 将问题、解释、错误和实践结果转化为长期学习状态，并通过 GitHub-backed Learning Vault 保存。

> AI 不只应该记住你问过什么，还应该记住你真正学会了什么。

## Topic 结构

```text
Topic
├── Goal                  为什么学
├── Target Capability     最终可观察的目标能力
├── Roadmap               可动态调整的能力路径
├── Concepts              领域知识结构
├── Current Focus         当前正在学习什么
├── Evidence / Mastery    已经真正证明会什么
├── Gaps / Unassessed     已确认的困难与尚未评估的部分
├── Notes                 对话结束后仍值得重读的长期理解
└── Next Step             下一步具体行动
```

## 四个 Skill，共用一个 Vault

```text
                           Learning Vault
                                |
          +---------------------+---------------------+
          |                     |                     |
          v                     v                     v
   Learning View           Ask Coach             Vault Curator
   展示 / 查看             建议 / 排优先级         维护 / 修复
   read-only               read-only             read / write
          \                     |                    /
           \                    |                   /
            +-------------------+------------------+
                                |
                                v
                         Learning Coach
                         学习 / 评估
                         read + write
```

- **Learning Coach**：教学、练习、评估，并因为学习发生而更新 learner state。
- **Learning View**：只展示已有 learner state，不修改它。
- **Ask Coach**：基于已有 learner state，建议接下来学什么、复习什么、练什么、连接什么、暂缓什么、探索什么，不修改 learner state。
- **Vault Curator**：检查、修复、重构和迁移 Vault。

Ask Coach 补上的是跨 Topic 的“学习决策层”：它可以帮助决定今天学什么、哪些内容值得复习、哪个 bottleneck 最关键、Topics 之间如何迁移，以及是否值得新增一个 Topic。

---

## 推荐设置：ChatGPT Project

创建一个 ChatGPT Project，并按需上传：

```text
skills/learning-coach/   学习时需要
skills/learning-view/    推荐，用于只读学习状态展示
skills/ask-coach/        推荐，用于学习建议与优先级决策
skills/vault-curator/    可选，用于维护与修复
```

然后连接一个私有 GitHub 仓库作为 Learning Vault。

权限要求：

- Learning Coach：需要 read + write；
- Learning View：只需要 read；
- Ask Coach：只需要 read；
- Vault Curator：只读 review 只需要 read，实际 mutation 才需要 write。

详细说明见 [ChatGPT Project Setup](docs/chatgpt-project.md)。

### 开始或继续学习

```text
Use Learning Coach.

Resume agent-memory.
```

### 查看整体学习状态

```text
Use Learning View.

Show my current learning state.
```

### 问 Coach 今天应该做什么

```text
Use Ask Coach.

我今天有 45 分钟。根据我的 Learning Vault，告诉我应该学什么、复习什么、暂缓什么，以及现在是否值得新增一个 Topic。
```

Ask Coach 是严格 read-only 的。它不会因为一次建议就：

- 创建 evidence；
- 修改 mastery；
- 修改 roadmap / current focus / next step；
- 写入“遗忘分数”；
- 创建新 Topic。

如果你接受建议并决定开始学习、练习、测试记忆或创建 Topic，再切换到 Learning Coach。

常见问题包括：

- 今天最值得学什么？
- 哪些知识再不复习就容易遗忘？
- 哪些内容应该练习而不是继续看解释？
- 哪个 Topic 是当前最大的学习瓶颈？
- 我的 Topics 之间有什么联系？
- 哪些知识目前还是“孤岛”？
- 现在应该暂缓什么？
- 下一个最值得学习的新 Topic 是什么？
- 现在是否适合新增 Topic？
- 帮我做一次本周学习回顾和下周规划。

第一版不会伪装成能精确计算记忆概率。Ask Coach 使用基于 evidence age/type、result、assistance、contradiction、`nextReview`、prerequisite relevance 等信号的定性 **review urgency**。当前 schema 不保存 FSRS-style 的 memory stability / retrievability。

---

## Learning Vault

当前 schemaVersion 2 按 mutation domain 拆分 authority：

```text
.learning-vault/
├── vault.json                     权威 Vault manifest
├── learning-strategy.json         权威跨 Topic 学习策略
└── migrations/                    migration audit

topics/<topic-id>/
├── state.json                     权威 Topic learner state
├── README.md                      当前 Topic 的人类可读投影
├── notes/                         长期理解
└── sessions/                      隐私最小化的学习 checkpoint
```

V2 中，Learning Vault 作为一组具有明确 ownership 的文档共同构成 authority：

- `.learning-vault/vault.json` 负责 Vault membership、Topic binding、strategy binding 和 lifecycle metadata；
- manifest 绑定的 `topics/<topic-id>/state.json` 负责该 Topic 的 goal、roadmap、Concepts、evidence/mastery、gap、current focus、notes/sessions 索引和 next step；
- `.learning-vault/learning-strategy.json` 负责跨 Topic 的 Learning Strategy；
- Topic README 只是 derived projection，不会覆盖 Topic `state.json`。

Ask Coach 不会为了建议修改 V2 schema。priority、review urgency、cross-topic connection、bottleneck hypothesis 和 new-topic recommendation 都是 derived advisory computation，而不是新的 authoritative learner state。

详细协议见 [Vault Format](skills/learning-coach/references/vault-format.md)、[Ask Coach Advisory Model](skills/ask-coach/references/advisory-model.md)、[GitHub Operations](skills/learning-coach/references/github-operations.md) 和 [ADR 0016](docs/adr/0016-activate-sharded-learning-vault-schema-v2.md)。

---

## Companion Skills

### Learning View

Learning View 是 Learning Vault 的 read-only presentation layer，用于回答“我的 Vault 当前记录了什么？”

### Ask Coach

Ask Coach 是 read-only advisory layer，用于回答“基于这些状态，我现在应该做什么？”

它支持：

- today / next priority；
- review urgency；
- practice vs. more study；
- cross-Topic connections；
- bottleneck diagnosis；
- new Topic recommendation；
- deprioritization；
- weekly / periodic review。

### Vault Curator

Vault Curator 负责 Vault 健康检查、引用和结构修复、Topic merge/split、Concept 整合、schema migration、archive/forget 和 public export。

---

## Optional standalone viewer

`workbench.html` 保留为可选的本地 viewer prototype，但不再是核心使用路径。

---

## 开发

```text
skills/
├── learning-coach/
├── learning-view/
├── ask-coach/
└── vault-curator/
```

V1 与 V2 schema 分别保存在 `skills/learning-coach/references/schemas/` 下，顶层 `vault.schema.json` 负责把不同版本/文档类型路由到相应 validator。

## 许可证

Copyright 2026 SShending.

本项目采用 [Apache License 2.0](LICENSE) 许可。
