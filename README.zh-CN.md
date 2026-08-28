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

**Learning Coach** 表示整个产品 / repository / Plugin，不再是某一个 Skill 的名字。

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

用户说“我想学 X”**不等于 X 自动成为一个 Topic**。Topic Coach 在初始化时判断这个学习区域更适合作为 Concept、roadmap milestone / Concept cluster、已有 Topic 的扩展，还是拥有独立可观察 target capability 的新 Topic。

## Plugin Package

Learning Coach 作为**一个 multi-Skill Plugin**分发。Plugin 通过 `.app.json` 声明 canonical GitHub app dependency；当前 alpha 不要求 PAT、private key、tunnel，也不要求自建 MCP server。

```text
learning-coach/
├── .codex-plugin/plugin.json
├── .app.json
├── skills/
│   ├── ask-coach/
│   ├── topic-coach/
│   ├── learning-view/
│   └── vault-curator/
└── references/
```

在本地 Codex personal marketplace 中测试安装：

```bash
git clone https://github.com/SShending/learning-coach.git
cd learning-coach
bash scripts/install_personal_plugin.sh
```

这个 helper 会注册本地 Plugin；如果环境中可以找到 `codex` CLI，还会执行 `codex plugin add learning-coach@personal`。安装后新开一个 Codex thread/session，让 Plugin Skills 重新加载。完整安装与验证契约见 [Releasing Learning Coach](docs/releasing.md)。

## 共享 Contracts

系统共用的 persistence / knowledge contract 位于 repo 根目录：

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

## Repository 权限要求

权限要求按 Skill 区分：Topic Coach 正常 stateful learning 需要 read + write；Learning View 只读；Ask Coach 始终需要可读 authority，只能写自己的 cross-Topic authority；Vault Curator 只有在明确维护/生命周期操作时才写。

运行时行为见 [Pragmatic GitHub Runbook](docs/private-alpha-runbook.md)；需要手动按 Skill 配置的场景见 [ChatGPT Project Setup](docs/chatgpt-project.md)。

## 开发

完整 preflight：

```text
python scripts/validate_vault_schemas.py
python scripts/check_skill_architecture.py
python scripts/check_plugin_release.py
```

GitHub Actions 会在 Skills、shared contracts、scripts、当前有效文档和 Plugin metadata 变化时运行这些检查。历史 ADR 保留当时的架构表述，不会为了当前命名被机械重写。

## 许可证

Copyright 2026 SShending.

本项目采用 [Apache License 2.0](LICENSE) 许可。
