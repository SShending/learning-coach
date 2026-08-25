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

Learning Coach 现在将学习、展示和维护拆成三个独立职责：

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
- **Vault Curator**：在需要时检查、修复和重构 Vault。

因此用户不再需要为了查看学习状态而下载两个仓库、打开 `workbench.html` 再手动选择 `vault.json`。Learning View 可以直接读取已连接的 Learning Vault，并在当前 Agent 界面中整理和展示。

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

```text
.learning-vault/
└── vault.json                     权威 learner state

topics/<topic-id>/
├── README.md                      当前 Topic 的人类可读投影
├── notes/                         长期理解
└── sessions/                      隐私最小化的学习 checkpoint
```

`vault.json` 始终是 source of truth。Topic README 只是 derived projection。如果二者冲突，以 `vault.json` 为准。

---

## Companion Skills

### Learning View

Learning View 是 Learning Vault 的 read-only presentation layer。

它支持：

- Vault Overview：查看所有 Topic；
- Topic View：查看一个 Topic 的目标、Roadmap、能力状态、gap、notes 和 next step；
- Roadmap View：重点查看 milestone 状态；
- Focused Slice：只看 notes、gaps、unassessed、evidence 等指定部分。

它优先使用当前 Agent 环境原生的 Markdown、表格或 rich UI，而不是要求用户运行独立前端。

### Vault Curator

Vault Curator 负责：

- Vault 健康检查；
- 引用和结构修复；
- Topic merge / split；
- Concept 整合；
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

## 许可证

Copyright 2026 SShending.

本项目采用 [Apache License 2.0](LICENSE) 许可。
