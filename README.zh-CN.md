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

Roadmap 连接长期目标与下一步行动。它以能力为单位、由证据驱动，并会随新的 evidence、gap 或目标变化而调整，而不是固定课程目录。

## 三个 Skill，共用一个 Vault

Learning Coach 将学习、展示和维护拆成三个独立职责：

```text
                         Learning Vault
                              |
              +---------------+---------------+
              |               |               |
              v               v               v
       Learning Coach    Learning View     Vault Curator
       学习 / 评估        展示 / 查看        维护 / 修复
       read + write      read-only         read / write
```

- **Learning Coach**：因为学习发生而改变 learner state。
- **Learning View**：只展示已有 learner state，不修改它。
- **Vault Curator**：在需要时检查、修复、重构和迁移 Vault。

因此用户不需要为了查看学习状态而下载两个仓库、打开 `workbench.html` 再手动选择 JSON。Learning View 可以直接解析已连接的 Learning Vault，并在当前 Agent 界面中整理和展示。

---

## 推荐设置：ChatGPT Project

创建一个 ChatGPT Project，并按需上传：

```text
skills/learning-coach/   学习时需要
skills/learning-view/    推荐，用于只读学习状态展示
skills/vault-curator/    可选，用于维护与修复
```

然后连接一个私有 GitHub 仓库作为 Learning Vault。

权限要求：

- Learning Coach：需要 read + write；
- Learning View：只需要 read；
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

### 查看某个 Topic

```text
Use Learning View.

Show deepseek-harness.
```

### 查看 Roadmap

```text
Use Learning View.

Show the roadmap for agent-memory.
```

Learning View 不会：

- 创建 evidence；
- 修改 mastery；
- 新增 gap；
- 修改 roadmap；
- 创建 note；
- 写入 Vault。

它只负责把当前 Vault 已经记录的状态整理成容易理解的视图。

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

- `.learning-vault/vault.json` 只负责 Vault membership、Topic binding、strategy binding 和 lifecycle metadata；
- manifest 绑定的 `topics/<topic-id>/state.json` 负责该 Topic 的 goal、roadmap、Concepts、evidence/mastery、gap、current focus、notes/sessions 索引和 next step；
- `.learning-vault/learning-strategy.json` 负责跨 Topic 的 Learning Strategy；
- Topic README 只是 derived projection，不会覆盖 Topic `state.json`。

这样普通学习只需要替换当前 Topic 的 `state.json`，而不需要因为新增一条 evidence 就重写整个 Vault，从而减少 write amplification 和不同 Topic 之间的无意义 SHA 冲突。

现有 schemaVersion 1 Vault 仍然受支持，只有显式执行 deterministic migration 后才会切换到 V2。

详细协议见 [Vault Format](skills/learning-coach/references/vault-format.md)、[GitHub Operations](skills/learning-coach/references/github-operations.md) 和 [ADR 0016](docs/adr/0016-activate-sharded-learning-vault-schema-v2.md)。

---

## Companion Skills

### Learning View

Learning View 是 Learning Vault 的 read-only presentation layer。

它支持：

- Vault Overview：查看所有 Topic；
- Topic View：查看一个 Topic 的目标、Roadmap、能力状态、gap、notes 和 next step；
- Roadmap View：重点查看 milestone 状态；
- Focused Slice：只看 notes、gaps、unassessed、evidence 等指定部分。

V2 中，Learning View 会先读取 manifest，再读取实际需要的 Topic `state.json`，而不是假设一个大 `vault.json` 包含所有 Topic learner state。

### Vault Curator

Vault Curator 负责：

- Vault 健康检查；
- 引用和结构修复；
- Topic merge / split；
- Concept 整合；
- schema migration；
- archive / forget；
- public export。

---

## Optional standalone viewer

`workbench.html` 保留为可选的本地 viewer prototype，但不再是核心使用路径。

推荐路径是：

```text
Connected Learning Vault
        ↓
Learning View
        ↓
当前 Agent UI
```

---

## 开发

```text
skills/
├── learning-coach/
├── learning-view/
└── vault-curator/
```

V1 与 V2 schema 分别保存在 `skills/learning-coach/references/schemas/` 下，顶层 `vault.schema.json` 负责把不同版本/文档类型路由到相应 validator。

## 许可证

Copyright 2026 SShending.

本项目采用 [Apache License 2.0](LICENSE) 许可。
