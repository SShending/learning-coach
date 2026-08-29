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
└── Vault Curator  维护、生命周期、修复与导出
```

| Skill | 主要职责 |
| --- | --- |
| **Ask Coach** | 跨 Topic 决定学什么/复习什么/练什么，global review priority，Topic 关联与 bottleneck，候选 Topic，Coach State，Learning Strategy synthesis |
| **Topic Coach** | Topic 边界判断、教学、练习、评估、reasoning diagnosis、Topic roadmap/currentFocus/nextStep、evidence/mastery/gaps、本 Topic review、notes/sessions |
| **Learning View** | 只读展示 authoritative state |
| **Vault Curator** | 结构检查、修复、merge/split/rename、forget/archive、export |

用户说“我想学 X”**不等于 X 自动成为一个 Topic**。Topic Coach 在初始化时判断这个学习区域更适合作为 Concept、roadmap milestone / Concept cluster、已有 Topic 的扩展，还是拥有独立可观察 target capability 的新 Topic。

## Plugin Package

Learning Coach 作为**一个 multi-Skill Plugin**分发。Plugin 通过 `.app.json` 声明 canonical GitHub app dependency；当前 alpha 不要求 PAT、private key、tunnel，也不要求自建 MCP server。

在本地 Codex personal marketplace 中测试安装：

```bash
git clone https://github.com/SShending/learning-coach.git
cd learning-coach
bash scripts/install_personal_plugin.sh
```

完整安装与验证契约见 [Releasing Learning Coach](docs/releasing.md)。

## 共享 Contracts 与 Progressive Disclosure

系统共用 contract 位于 `references/`，各 Skill 只在当前 operation 需要时加载对应分支：

```text
references/
├── vault-format.md
├── github-operations.md
├── github/
│   ├── read-authority.md
│   ├── topic-write.md
│   ├── advisory-write.md
│   └── structural-write.md
├── knowledge-grounding.md
├── coach-state.md
├── vault.schema.json
└── schemas/
```

Topic Coach 还会按任务加载 `topic-lifecycle.md`、`assessment-and-evidence.md`、`assumption-aware-diagnosis.md` 等 Topic-local references。

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

Learning Coach 只支持**当前 manifest-based Learning Vault schema**：

```text
.learning-vault/
├── vault.json                     Vault manifest / topology
├── learning-strategy.json         跨 Topic meta-learning strategy
└── coach-state.json               可选 durable portfolio advisory memory

topics/<topic-id>/
├── state.json                     authoritative Topic learner state
├── README.md                      derived projection
├── notes/
└── sessions/
```

Learning Vault 的 authority 是**一组 domain-owned documents**。普通 Topic 学习只更新对应 Topic authority。Ask Coach 只在必要时更新 Coach State 或有跨 Topic evidence 支撑的 Learning Strategy。Learning View 永远不写。

旧的、不受支持的 Vault layout 不会在运行时被猜测解析；应先独立升级到当前格式，再进入正常学习流程。

详细协议见 [Vault Format](references/vault-format.md)、[GitHub Operations](references/github-operations.md)、[Coach State](references/coach-state.md) 与 [Ask Coach Advisory Model](skills/ask-coach/references/advisory-model.md)。

## 使用

### 学习或继续一个 Topic

```text
Use Topic Coach.
Resume agent-memory.
```

### 跨 Topic 决定接下来做什么

```text
Use Ask Coach.
我今天有 45 分钟。根据 Learning Vault，告诉我应该学什么、复习什么、练什么、连接什么或暂缓什么。
```

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

Topic Coach 正常 stateful learning 需要 read + write；Learning View 只读；Ask Coach 始终需要可读 authority，只能写自己的 cross-Topic authority；Vault Curator 只有在明确维护/生命周期操作时才写。

## 开发

完整 preflight：

```text
python scripts/validate_vault_schemas.py
python scripts/check_skill_architecture.py
python scripts/check_plugin_release.py
```

GitHub Actions 会在 Skills、shared contracts、scripts、当前有效文档和 Plugin metadata 变化时运行这些检查。历史 ADR 保留当时的架构表述。

## 许可证

Copyright 2026 SShending.

本项目采用 [Apache License 2.0](LICENSE) 许可。
