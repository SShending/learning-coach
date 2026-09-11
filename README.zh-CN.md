<div align="center">

# Learning Coach

**一个多 Skill 学习系统：把可持续的能力状态保存在私有 GitHub Learning Vault 中。**

[English](README.md) | 简体中文

</div>

<p align="center">
  <img src="assets/learning-coach-overview.png" alt="Learning Coach 将学习过程保存到私人 GitHub Vault" width="100%">
</p>

---

## 产品文档

- [使用手册](docs/user-guide.zh-CN.md)：从开始学习到复习、跨主题安排、研究 handoff 与时间视图，使用历史、Agent、摄影的全虚构示例。
- [产品迭代记录](docs/product-evolution.zh-CN.md)：已实现变化、使用影响、验证边界与讨论中的方向。

## 产品与 Skills

**Learning Coach** 表示整个产品 / repository / Plugin，不再是某一个 Skill 的名字。

```text
Learning Coach
├── Ask Coach       跨 Topic 的学习组合规划
├── Knowledge Inbox 不进入系统学习的聊天知识收件箱
├── Topic Coach     单个 Topic 内的教学、练习、评估和状态更新
├── Research Coach  按需触发的研究判断、Idea Vault 工作与学习需求 handoff
├── Learning View   只读展示
└── Vault Curator   维护、生命周期、修复与导出
```

| Skill | 主要职责 |
| --- | --- |
| **Ask Coach** | 跨 Topic 决定学什么/复习什么/练什么，global review priority，Topic 关联与 bottleneck，候选 Topic，Coach State，Learning Strategy synthesis，以及把 Research Coach 给出的 bounded capability demand 转成学习优先级 |
| **Knowledge Inbox** | 明确保存、查看、去重和整理聊天中的可复用知识碎片；不创建 Topic，不记录 mastery 证据 |
| **Topic Coach** | Topic 边界判断、教学、练习、评估、reasoning diagnosis、Topic roadmap/currentFocus/nextStep、evidence/mastery/gaps、本 Topic review、notes/sessions；当用户明确进入 research intent 时只做轻量 handoff |
| **Research Coach** | 明确 research intent 下的 Idea Vault 读取/更新、new-vs-existing idea triage、hypothesis/novelty/experiment reasoning、epistemic bottleneck，以及 Research -> Learning capability demand |
| **Learning View** | 只读展示 authoritative state |
| **Vault Curator** | 结构检查、修复、merge/split/rename、forget/archive、export |

用户说“我想学 X”**不等于 X 自动成为一个 Topic**。Topic Coach 在初始化时判断这个学习区域更适合作为 Concept、roadmap milestone / Concept cluster、已有 Topic 的扩展，还是拥有独立可观察 target capability 的新 Topic。

Research Coach **不会常驻普通学习 context**。只有当用户明确问“这能不能研究”“看看 Idea Vault”“这个 idea 是否有 novelty”“下一步该怎么验证”等 research intent 时才进入。学习中出现一个有趣观察，可以被轻量提示为 research candidate，但不会自动写入 Idea Vault。

## Plugin Package

Learning Coach 作为**一个 multi-Skill Plugin**分发。Plugin 通过 `.app.json` 声明 canonical GitHub app dependency；当前 alpha 不要求 PAT、private key、tunnel，也不要求自建 MCP server。

```text
learning-coach/
├── .codex-plugin/plugin.json
├── .app.json
├── skills/
│   ├── ask-coach/
│   ├── topic-coach/
│   ├── research-coach/
│   ├── knowledge-inbox/
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
│   ├── structural-write.md
│   └── inbox-write.md
├── knowledge-grounding.md
├── coach-state.md
├── vault.schema.json
└── schemas/
```

Topic Coach 会按任务加载 `topic-lifecycle.md`、`assessment-and-evidence.md`、`assumption-aware-diagnosis.md` 等 Topic-local references。Research Coach 同样只在当前 research request 需要时加载 Idea Vault contract、research triage 或 research-learning handoff reference。

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

## Learning Vault 与 Idea Vault

Learning Coach 只支持**当前 manifest-based Learning Vault schema**：

```text
.learning-vault/
├── vault.json                     Vault manifest / topology
├── learning-strategy.json         跨 Topic meta-learning strategy
└── coach-state.json               可选 durable portfolio advisory memory

inbox/
├── state.json                     可选 Knowledge Inbox 索引
└── items/                         Knowledge Inbox 条目正文

topics/<topic-id>/
├── state.json                     authoritative Topic learner state
├── README.md                      derived projection
├── notes/
└── sessions/
```

这个根目录布局刻意把 `.learning-vault/` 留给隐藏的 control-plane 状态；用户拥有、可复用的知识放在可见的 `inbox/`，正式进入系统学习的内容放在 `topics/`。`inbox/` 与 `topics/` 在文件系统上同级，但 Inbox 条目仍只是 retrieval material，不是 mastery evidence 或 Topic state。

Learning Vault 的 authority 是**一组 domain-owned documents**。普通 Topic 学习只更新对应 Topic authority。Knowledge Inbox 只保存用户明确要求或确认的碎片。Ask Coach 只在必要时更新 Coach State 或有跨 Topic evidence 支撑的 Learning Strategy。Learning View 永远不写。

当用户使用 Idea Vault 时，它是**独立的外部 research authority**。Research Coach 只在明确研究任务和当前授权下读取/更新。Idea 的 maturity/evidence/health/novelty 不会因为存在就变成 learner mastery/evidence/gaps；反过来 Topic mastery 也不会变成 research evidence。Research -> Learning 是 bounded runtime handoff，不是 schema merge。

旧的、不受支持的 Learning Vault layout 不会在运行时被猜测解析；应先独立升级到当前格式，再进入正常学习流程。

详细协议见 [Vault Format](references/vault-format.md)、[GitHub Operations](references/github-operations.md)、[Coach State](references/coach-state.md)、[Ask Coach Advisory Model](skills/ask-coach/references/advisory-model.md) 与 [Research / Learning Handoff](skills/research-coach/references/learning-handoff.md)。

## 使用

### 学习或继续一个 Topic

```text
Use Topic Coach.
Resume agent-memory.
```

### 连接 Learning Vault

第一次使用时，应明确告诉插件要使用哪个私有 GitHub 仓库。填写仓库标识，
不要填写本地路径，也不要发送令牌：

```text
我的 Learning Vault 是 <owner>/<private-learning-vault>。
本次对话使用它；先检查仓库为私有且符合当前 Vault 格式，暂时不要创建 Topic。
```

插件不能安全地把某个用户的仓库写死在公共包里。如果宿主或 Project 已经
记住了选中的仓库，之后只有在目标不明确时才需要再次说明。

### 不开始系统学习，只保存一条聊天知识

```text
Use Knowledge Inbox。
我的 Learning Vault 是 <owner>/<private-learning-vault>。
收集本次 session 中值得留下的 notes。先展示建议保留的 notes，得到确认后再保存。不要创建 Topic、声称我已掌握，也不要保存原始聊天记录。
```

### 跨 Topic 决定接下来做什么

```text
Use Ask Coach.
我今天有 45 分钟。根据 Learning Vault，告诉我应该学什么、复习什么、练什么、连接什么或暂缓什么。
```

### 学习中明确产生了值得研究的问题

```text
Use Research Coach.
我怀疑 memory granularity 会影响 memory bank 变大后的 interference。
先检查我的 Idea Vault：它是已有 idea 的 refinement，还是值得单独建 idea？接下来最小的 decisive validation 是什么？
```

如果研究分析暴露出 capability requirement，Research Coach 只输出 bounded capability demand；Ask Coach 再对照 Learning Vault evidence 与 cross-Topic reuse，决定是否真的值得补；最后由 Topic Coach 执行学习。

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

Topic Coach 正常 stateful learning 需要 read + write；Knowledge Inbox 的明确捕获/整理需要 read + write；Learning View 只读；Ask Coach 始终需要可读 Learning Vault authority，只能写自己的 cross-Topic authority；Vault Curator 只有在明确维护/生命周期操作时才写。Research Coach 会单独检查外部 Idea Vault 的当前权限，并且不会把 read access 当成 write authorization。

## 开发

完整 preflight：

```text
python scripts/validate_vault_schemas.py
python scripts/check_skill_architecture.py
python scripts/check_inbox_resurfacing.py
python scripts/check_plugin_release.py
```

GitHub Actions 会在 Skills、shared contracts、scripts、当前有效文档和 Plugin metadata 变化时运行这些检查。历史 ADR 保留当时的架构表述。

## 许可证

Copyright 2026 SShending.

本项目采用 [Apache License 2.0](LICENSE) 许可。
