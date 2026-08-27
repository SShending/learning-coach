<div align="center">

# Learning Coach

**一个多 Skill 学习系统：把可持续的能力状态保存在私有 GitHub Learning Vault 中。**

[English](README.md) | 简体中文

</div>

<p align="center">
  <img src="assets/learning-coach-overview.png" alt="Learning Coach 将学习过程保存到私人 GitHub Vault" width="100%">
</p>

---

## 产品与 Skills

**Learning Coach** 现在表示整个产品 / repository / package，不再是某一个 Skill 的名字。

```text
Learning Coach
├── Ask Coach      跨 Topic 的学习组合规划
├── Topic Coach    单个 Topic 内的教学、练习、评估和状态更新
├── Learning View  只读展示
└── Vault Curator  维护、生命周期、修复、迁移与导出
```

| Skill | 主要职责 |
| --- | --- |
| **Ask Coach** | 跨 Topic 决定学什么/复习什么/练什么，global review priority，Topic 关联与 bottleneck，候选 Topic，Coach State，Learning Strategy synthesis |
| **Topic Coach** | 用户选择学习方向后的 Topic 边界判断、教学、练习、评估、Topic roadmap/currentFocus/nextStep、evidence/mastery/gaps、本 Topic review、notes/sessions |
| **Learning View** | 只读展示 authoritative state |
| **Vault Curator** | 结构检查、修复、merge/split、migration、forget/archive、export |

规划层次刻意分开：

```text
Ask Coach
“接下来优先学 llm-evolution”
        |
        v
Topic Coach
“在 llm-evolution 内，下一步标出 pretraining/SFT 的 loss positions”
```

用户说“我想学 X”**不等于 X 自动成为一个 Topic**。Topic Coach 在初始化时判断这个学习区域更适合作为：

- 已有 Topic 内的 Concept；
- roadmap milestone / Concept cluster；
- 已有 Topic 的扩展或重构；
- 还是一个拥有独立、可观察 target capability 的新 Topic。

## 共享 Contracts

整个系统共用的 persistence / knowledge contract 不再挂在某个 Skill 目录下，而是位于 repo 根目录：

```text
references/
├── vault-format.md
├── github-operations.md
├── knowledge-grounding.md
├── coach-state.md
├── vault.schema.json
├── schemas/
└── migrations/
```

各个 Skill 按需要读取这些 shared contracts。一个资源对 Agent runtime **可访问**，并不意味着它的内容已经自动进入某次 LLM call 的 model-visible context。

## Topic Model

```text
Topic
├── Goal
├── Target Capability
├── Roadmap
├── Concepts
├── Current Focus
├── Evidence / Mastery
├── Gaps / Unassessed
├── Notes
└── Next Step
```

Topic roadmap、current focus、next step 是 Topic-local state，由 Topic Coach 负责。跨 Topic 的切换、全局 review 排序、新 Topic 推荐属于 Ask Coach。

## Learning Vault

schemaVersion 2 按 mutation domain 拆分 authority：

```text
.learning-vault/
├── vault.json                     Vault manifest / topology
├── learning-strategy.json         跨 Topic meta-learning strategy
├── coach-state.json               可选的 durable portfolio advisory memory
└── migrations/                    migration audit

topics/<topic-id>/
├── state.json                     authoritative Topic learner state
├── README.md                      derived projection
├── notes/
└── sessions/
```

Learning Vault 的 authority 是**一组 domain-owned documents**，不是单一大 JSON。普通 Topic 学习只更新对应 Topic authority。Ask Coach 只在必要时更新 Coach State 或有跨 Topic evidence 支撑的 Learning Strategy。Learning View 永远不写。

详细协议见 [Vault Format](references/vault-format.md)、[GitHub Operations](references/github-operations.md)、[Coach State](references/coach-state.md) 与 [Ask Coach Advisory Model](skills/ask-coach/references/advisory-model.md)。

## 使用

### 学习或继续一个 Topic

```text
Use Topic Coach.

Resume agent-memory.
```

或者先判断学习区域的正确粒度：

```text
Use Topic Coach.

我想系统学习 Agent Foundations。先判断合适的 Topic 边界、target capability 和 roadmap，然后从下一步开始。
```

### 跨 Topic 决定接下来做什么

```text
Use Ask Coach.

我今天有 45 分钟。根据 Learning Vault，告诉我应该学什么、复习什么、练什么、连接什么或暂缓什么。
```

Ask Coach 可以把耐久的候选 Topic / connection / hypothesis 保存到 Coach State，并在至少两个 Topic 的 evidence 支持时综合 Learning Strategy；它绝不修改 Topic mastery/evidence/roadmap/currentFocus/nextStep。

### 查看学习状态

```text
Use Learning View.
Show my current learning state.
```

### 维护 Vault

```text
Use Vault Curator.
Review my Learning Vault like a codebase. Do not mutate anything yet.
```

## ChatGPT / Agent 设置

使用四个 Skill 目录以及共享 contracts：

```text
skills/topic-coach/
skills/ask-coach/
skills/learning-view/
skills/vault-curator/
references/
```

权限要求按 Skill 区分：Topic Coach 正常学习需要 read + write；Learning View 只读；Ask Coach 始终需要 read，只能写自己的 cross-Topic authority；Vault Curator 只有在明确维护操作时才写。

详细设置见 [ChatGPT Project Setup](docs/chatgpt-project.md)。

## 开发

当前 package 结构：

```text
skills/
├── ask-coach/
├── topic-coach/
├── learning-view/
└── vault-curator/

references/          shared system contracts
scripts/             validator / migration tooling
docs/                architecture / operating docs
```

检查：

```text
python scripts/validate_vault_schemas.py
python scripts/check_skill_architecture.py
```

GitHub Actions 会在 Skills、shared contracts、schemas 和核心 setup 文档变化时同时运行 schema 与 Skill-routing consistency checks。

## 许可证

Copyright 2026 SShending.

本项目采用 [Apache License 2.0](LICENSE) 许可。
