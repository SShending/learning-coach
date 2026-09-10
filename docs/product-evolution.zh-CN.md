# Learning Coach 产品迭代记录

本文件记录用户能感知的功能变化、改变的原因、使用影响与验证边界。它是产品变化的索引；当前行为以各 Skill 和共享协议为准，操作方法见[使用手册](user-guide.zh-CN.md)。

从 2026-09-08 开始持续维护。下方较早条目是依据仓库提交与版本文件整理的精选历史，不是从首版开始的完整发布日志。产品版本表示源码包版本，不代表已在所有宿主或公开 marketplace 发布。

## 2026-09-10 · alpha.24 之后 · Learning Acceleration 与跨 Topic 复用闭环

状态：实现已完成并由相关 PR 集成；读取 main 时，以各 PR 的实际合并状态为准。本轮不改变 Plugin package version、Vault schema 或五个 Skill 的职责边界。

依据：[PR #26](https://github.com/SShending/learning-coach/pull/26) 引入 Topic Coach learning acceleration；[PR #30](https://github.com/SShending/learning-coach/pull/30) 集成 Learning Notes、Ask Coach、Vault Curator 与 Learning View 的配套策略；[PR #31](https://github.com/SShending/learning-coach/pull/31) 增加 reuse-aware Ask Coach；[PR #32](https://github.com/SShending/learning-coach/pull/32) 补齐 Topic Coach 对 cross-Topic connection 的消费链路。

### 为什么改与功能变化

- Topic Coach 在适用时优化长期学习成本：优先有真实复用价值的 foundation，限制 prerequisite 无限展开；新知识有有效旧模型时用 `invariant + delta`，没有有效旧模型时建立新的 primitive。
- Learning Notes 倾向保存可复用 mental model，而不是逐项 glossary；Vault Curator 只在同一 governing mechanism / retrieval target 下做 consolidation；Learning View 区分 exposure、demonstrated capability、reuse potential 与 demonstrated transfer。
- Ask Coach 可以发现并持久化长期有价值的 cross-Topic connections，并在排序时区分两种相反作用：缺失的共享 foundation 可能因 downstream reuse 提升优先级；已证明的 foundation 则成为 reuse credit，使相关下游 Topic 更便宜。推荐顺序是 advisory，不是固定课程。
- Topic Coach 在恢复当前 Topic、且跨 Topic 复用确实可能减少重复教学时，可读取与当前 Topic 直接相关的 active connection；connection 只作为检索提示。Topic Coach 必须回读关联 Topic 的权威 evidence，确认共享 foundation 足够 demonstrated 后才能跳过重复解释，并把教学集中到当前 Topic 的 delta / transfer。
- 跨 Topic reuse 不复制 evidence/mastery，不自动删除当前 Topic roadmap capability，也不让 Topic Coach 接管 portfolio 排序；Ask Coach 仍负责“学哪个”，Topic Coach 仍负责“当前 Topic 内怎么学”。

### 使用影响

用户不需要严格遵守 Ask Coach 给出的 Topic 顺序。按推荐顺序通常可以提高复用效率；如果用户主动跳到下游 Topic，Topic Coach 只在真正 blocking 时补最近、最小的 prerequisite，然后返回用户选择的 Topic。

本轮同时修正文档中的 Knowledge Inbox 路径：当前 authoritative layout 是根目录 `inbox/state.json` 与 `inbox/items/`，和 `topics/` 同级；旧 `.learning-vault/inbox*` 路径不再是当前 authority。

### 验证与限制

- Learning Acceleration 已有 Topic Coach、Ask Coach、Vault Curator、Learning View 的声明式行为回归与静态 contract checker；PR #32 再增加 Topic Coach cross-Topic reuse 的五个回归场景，并将专用 checker 接入 CI。
- 真实 Learning Vault 验证已证明 Ask Coach 可以发现、保存、展示并利用 cross-Topic connections；这不等于所有宿主都已运行完整 semantic behavior harness。
- 声明式 fixture 与静态 checker 仍不能替代真实代理执行。尤其是“是否在恰当时机读取 connection、是否正确选择 source evidence、是否实际减少重复教学”应继续通过真实学习 session 观察。
- 当前 connection schema 没有单独的 source/target 方向字段；在没有出现可靠性问题前保留现状，不为理论完整性升级 schema。

## 2026-09-09 · 3.0.0-alpha.24 · Knowledge Inbox 回流与根目录拓扑

状态：功能已合并至 main；本条同步源码包版本与使用手册，不表示已在 marketplace 发布。

依据：[PR #24](https://github.com/SShending/learning-coach/pull/24) / [f1a7478](https://github.com/SShending/learning-coach/commit/f1a74784919be28c30b48bbc0d2434b6467a02b0) 定义 learning-memory buffer 与 resurfacing；[PR #25](https://github.com/SShending/learning-coach/pull/25) / [67c28fd](https://github.com/SShending/learning-coach/commit/67c28fd0ad49759fc4c5592aea3143b242e27715) 完成根目录 Inbox 拓扑。

### 为什么改与功能变化

- Knowledge Inbox 从仅供保存、整理的碎片收件箱扩展为 learning-memory buffer：Topic Coach / Ask Coach 在已有具体任务中判断是否取回相关片段，Inbox 自身不主动推送。
- Resurfacing 先读元数据，通常只展开 1–3 个相关正文；宽泛标签或 Topic 名称重合不足以触发取回，片段本身不构成 mastery/evidence。
- Learning View 保持只读且不推荐；没有新增 embedding、检索计数、回流日志或 schema 字段。
- 当前索引为根目录 `inbox/state.json`，正文为 `inbox/items/*.md`。`inbox/` 与 `topics/` 在文件系统同级，`.learning-vault/` 保留控制状态；Inbox 仍是检索材料，不是 Topic learner state。

### 使用影响

旧 `.learning-vault/inbox.json` 与 `.learning-vault/inbox/*.md` 路径不再被当前 schema 接受。由 Vault Curator 按结构迁移协议先复制并验证目标文件，再切换 manifest 的 `knowledgeInbox.statePath`；保留条目 ID、内容、状态、时间、来源和幂等记录。更新插件后通过新会话确认加载版本。

### 验证与限制

- 新增五个 resurfacing 行为夹具，覆盖具体任务匹配、宽泛标签拒绝、元数据优先与上下文上限、Ask Coach 显式使用及 Learning View 只读边界；`check_inbox_resurfacing.py` 已接入 CI。
- Schema 回归覆盖根目录绑定、拒绝旧隐藏绑定与旧正文路径，并保留独立的非法状态检查。
- 合并后的 [main CI（67c28fd）](https://github.com/SShending/learning-coach/actions/runs/34357345700) 已通过 schema、skill architecture、Inbox resurfacing、plugin release 与 installer syntax 检查。本次版本同步也需通过同一组检查，结果以本次提交的 Actions 为准。
- 行为夹具与静态检查不等于真实宿主执行；GitHub 连接、首次初始化、实际片段回流及跨 Skill promotion 仍需真实宿主验证。

## 2026-09-09 · 3.0.0-alpha.23 · Knowledge Inbox 初版

状态：初版已提交（[9adfaf9](https://github.com/SShending/learning-coach/commit/9adfaf9)）；以下保留初版行为与当时验证记录。后续 schema smoke 修复见 [ecf933f](https://github.com/SShending/learning-coach/commit/ecf933f)，回流与拓扑变化见 alpha.24。

### 为什么改

聊天中会出现一些值得以后找回的知识，但它们既不值得立即开始系统学习，也不应被误记成 Topic 进度或 mastery 证据。把它们塞进 Topic notes 会让 Topic 变成杂物桶；把每次聊天写成 session 又会留下过多历史噪声。

### 功能变化

- 增加轻量 `Knowledge Inbox` Skill，负责明确捕获、查看、去重和整理知识碎片。
- 在同一个私有 Learning Vault 中增加可选的 `.learning-vault/inbox/` 条目目录及其索引；不新增第二个仓库或本地数据库。
- Inbox 条目只表示“以后可能值得检索”，不创建 Topic、不记录 mastery/evidence，也不保存原始聊天记录。
- 条目可以链接到已有 Topic；正式提升为 Topic note 时交给 Topic Coach，验证目标笔记后再更新 Inbox 状态。
- README 示例要求首次使用时明确 `<owner>/<repository>`，之后由宿主或 Project 复用已选仓库，避免把用户地址硬编码在插件中。

### 验证与限制

- 已更新 schema、authority routing、Skill 架构检查、Plugin release 检查和 Knowledge Inbox 的触发/行为回归夹具。
- `check_skill_architecture.py` 与 `check_plugin_release.py` 已通过。
- `validate_vault_schemas.py` 在当前环境因缺少 Python `jsonschema` 依赖未能执行；这不是 schema 失败结论，需在带依赖的环境补跑。
- 当前仍需真实宿主验证 GitHub 连接、首次 Inbox 初始化和 Topic-note promotion 的跨 Skill 交接。

## 如何维护

每次改变用户行为时，在同一个改动中补充条目，并更新手册对应章节：

1. **状态与依据**：标记未发布或已实现；填写真实版本、日期、提交或 PR。尚无提交链接时保留未发布状态，不编造版本。
2. **问题与变化**：用具体的前后行为说明，不把提交标题简单复制为功能说明。
3. **使用影响**：说明调用方式、权限、兼容性、迁移或重载要求；没有变化时可省略。
4. **验证与限制**：区分格式/架构检查、可执行测试、独立场景推演和真实环境验证。
5. **示例隐私**：只使用独立编写的虚构材料，不复制真实 Learning Vault，即使替换姓名也不使用。

修复现有描述时更正原条目；新增行为则写新条目。纯文档调整可单列文档条目，不自动提高插件版本。未实现想法放入文末“候选方向”，不提前写成可用能力。贡献者应遵循[发布规范](releasing.md)决定版本变化。

## 2026-09-08 · 产品文档（本次变更）

- 建立本迭代记录与[中文使用手册](user-guide.zh-CN.md)，为 README 增加固定入口。
- 手册使用虚构学习者“小岚”，贯穿历史、Agent、摄影三条学习线，展示证据、连续性、跨主题安排与时间视图。
- 写清当前时间视图由 LLM 执行规则，专用聚合脚本仍未实现；日常流程不将 Work 或本地 Vault clone 设为前提。
- 修正 Project 配置文档中已经过时的迁移目录与 Curator 升级职责描述。
- 当时不改变 Vault schema、权限或四个 Skill 的运行职责。文档相对链接、历史提交引用与仓库 preflight 已检查；这不是新的运行时版本。

## 2026-09-08 · 3.0.0-alpha.22 · 学习捕获与时间视图

状态：已实现并提交至产品仓库。[变更 58bd4c5](https://github.com/SShending/learning-coach/commit/58bd4c5aa9f5cb4483793419a6a5d419e1768fd3)。

### 为什么改

有意义的探索可能没有新 mastery 证据，但仍需要保留恢复学习的上下文。另一方面，“学过、聊过、项目做完了”不能自动转化为独立能力。原有只读展示也缺少统一的日期筛选规则。

### 功能变化

| 功能 | 之前 | 现在 |
| --- | --- | --- |
| Topic Coach 收尾 | 有持久化检查点，结果分类不够明确 | Learning Capture / Persistence Triage 分类到 evidence、note、unassessed、session，或交接跨主题策略/外部项目 |
| 未评估探索 | 容易只停留在对话，或误被当作能力进步 | 有新覆盖或恢复价值时保存；普通同焦点说明仍可不写 |
| 辅助完成 | 依赖已有证据原则判断 | 明确生成代码、深入提问和辅助完成本身不证明独立应用 |
| Learning View | 查看当前整体状态和指定切片 | 增加 today、yesterday、this week、last 7 days、日期区间 |
| 时间与历史 | 没有统一时间视图协议 | 区分观察、会话创建、笔记更新和写入时间，说明补录与历史不足 |

### 如何使用

```text
Use Learning View. 今天学了什么？按 Asia/Shanghai 展示已有记录。
Use Learning View. 过去 7 天只看 photo-basics 的活动与证据。
```

Learning Capture 是 Topic Coach 内部协议，不需要新增命令。Learning View 仍只读，动态聚合现有记录；没有增加每日学习数据库。跨 Topic 策略仍归 Ask Coach，项目内容不会因为分类就自动写入外部仓库。

本次没有改变 Vault schema。插件文件更新后，已加载的旧会话不应被假定自动切换规则；通过新会话确认加载版本。

### 验证与限制

- 增加 21 个行为回归场景，以及时间查询的触发示例；行为 JSON 是声明式场景，不是完整代理执行器。
- 补充架构检查，验证回归资源、时间视图零写入约束和既有权威字段边界；CI 会响应 evals 的变更。
- Schema、架构、插件包与 Skill 格式检查通过；[该提交的 GitHub CI](https://github.com/SShending/learning-coach/actions/runs/34178678629)通过。
- 独立场景推演检查了时间边界、补录、历史缺失、辅助完成、无评估探索与跨主题交接。审核后补清未知观察日期只能保存带说明的补录上下文，不能伪造 `observedAt`。
- 时间聚合目前仍由 LLM 按规则完成，没有专用执行脚本。当前状态不构成完整历史日志，不能保证计算任意时期的 mastery 增幅。

## 2026-08-30—31 · alpha.21 之后的持久化加固

状态：已实现；这一组提交沿用 `3.0.0-alpha.21` 的包版本，并非另一个虚构版本。

依据：[持久化检查点 8535196](https://github.com/SShending/learning-coach/commit/8535196)、[行为场景 7bea140](https://github.com/SShending/learning-coach/commit/7bea140)、[检查接入 24f1424](https://github.com/SShending/learning-coach/commit/24f1424)。

- 明确每轮结束前作持久化决定；有重要状态变化时不只留在对话，也不为未来批处理无限延后。
- 教学进入新焦点前，应更新已经过时的 currentFocus 与下一步。
- 未回答的问题不记为失败；同焦点的小澄清不需要反复改写焦点。
- 增加五个持久化回归场景，说明“有变化应保存”和“普通接触不强制写入”两侧边界。

验证边界：新增场景是声明式回归资产；架构检查不能替代真实代理行为验证。

## 2026-08-30 · 3.0.0-alpha.21 · 主动发现笔记候选

依据：[行为修改 d8911a3](https://github.com/SShending/learning-coach/commit/d8911a3)、[版本 bfe0f2a](https://github.com/SShending/learning-coach/commit/bfe0f2a)。

之前的笔记规则容易在“已经决定写笔记”后才被加载。改为在形成可复用模型、重要纠错或结束一段积累后，先做轻量候选检查，再按质量规则决定是否创建或更新。

用户影响：值得保留的理解更容易被检查到，但不会把每个知识点变成笔记，也不要求每次改变 mastery 都写笔记。

## 2026-08-30 · 3.0.0-alpha.20 · 笔记质量与粒度

依据：[笔记策略 a37ab32](https://github.com/SShending/learning-coach/commit/a37ab32)、[版本 e6cf789](https://github.com/SShending/learning-coach/commit/e6cf789)。

- 建立笔记的价值判断：是否持久、可复用、对学习者有针对性、能压缩恢复成本。
- 一篇笔记围绕一个未来可检索的核心问题；同一想法已有笔记时优先修订。
- 普通定义、一次问答和单个错误不自动产出笔记。

用户影响：笔记服务未来检索，不追求数量；它既不是逐轮摘要，也不是 mastery 的替代证据。

## 2026-08-29 · 3.0.0-alpha.19 · 学习状态与笔记解耦

依据：[持久化边界 773d34e](https://github.com/SShending/learning-coach/commit/773d34e)、[版本 a7640f8](https://github.com/SShending/learning-coach/commit/a7640f8)。

明确学习状态变化应持久化，笔记只是可能的输出之一。是否值得写长久笔记，不应成为保存证据、焦点或下一步的前置条件。

用户影响：可以只保存一条证据或一个准确的继续动作，而不用先制作笔记。

## 2026-08-29 · 3.0.0-alpha.17 · 当前格式与按需加载

依据：[架构整理 1ad5e51](https://github.com/SShending/learning-coach/commit/1ad5e51)。

围绕当时的 manifest-based Vault 格式整理四个 Skill 与共享协议，按操作加载需要的引用文件。当前运行不猜测旧格式，也不把升级逻辑塞进普通学习流程。

用户影响：学习、组合规划、只读展示和结构维护具有明确边界；遇到不支持的格式应单独升级。更早的架构决策保留在 [ADR 目录](adr/)，不作为当前安装手册。

## 候选方向：讨论中，尚未承诺实现

| 方向 | 期望解决的问题 | 实现前需要明确 | 当前可用替代 |
| --- | --- | --- | --- |
| 只读时间聚合脚本 | 日期换算、关联和去重由可执行测试保证一致性 | 普通 Chat 是否能读取脚本并执行；如何由宿主交付数据；无脚本时的路径 | 当前 LLM Temporal Views |
| 程序化写入校验 | 减少非法引用、重复更新、并发覆盖和部分写入问题 | GitHub 工具边界、更新原子性、冲突及失败恢复 | 当前按 Topic 划分的写入协议与结果核验 |

这些候选不意味着需要新增服务、收费依赖、每日数据库或强制使用 Work。只有完成兼容性验证并明确用户收益后，才转入实施记录。