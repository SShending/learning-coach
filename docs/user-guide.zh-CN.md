# Learning Coach 使用手册

适用版本：`3.0.0-alpha.25` · 文档更新：2026-09-11

Learning Coach 帮助你持续学习多个主题：把目标、练习中表现出的能力、还没检验的部分，以及下一步该做什么，保存在你自己的私有 GitHub Learning Vault 中。换一次聊天后，教练可以根据这些记录继续，而不必依赖上一段对话仍在上下文里。它也可以在你明确进入研究语境时，通过 Research Coach 连接独立的 Idea Vault，但不会把研究状态和学习者能力状态混在一起。

**本手册的学习者“小岚”、三个主题、日期、回答和学习记录均为虚构演示。示例中的“栖川城市博物馆”与历史材料也是虚构的。它们不是任何真实用户的 Vault，也不是插件实际执行过的测试结果。** 示例输出展示预期行为，具体措辞与教学安排会随情境变化。

## 目录

- [1. 它解决什么问题](#1-它解决什么问题)
- [2. 六个入口如何选择](#2-六个入口如何选择)
- [3. 开始使用前](#3-开始使用前)
- [4. 建立第一个 Topic](#4-建立第一个-topic)
- [5. 一次学习如何留下有用记录](#5-一次学习如何留下有用记录)
- [6. 能力、证据与笔记](#6-能力证据与笔记)
- [7. 隔几天如何继续与复习](#7-隔几天如何继续与复习)
- [8. 多个主题如何安排](#8-多个主题如何安排)
- [9. 查看今天和最近的学习](#9-查看今天和最近的学习)
- [10. 维护与整理 Vault](#10-维护与整理-vault)
- [11. 补录已有学习](#11-补录已有学习)
- [12. Chat、Work 与脚本](#12-chatwork-与脚本)
- [13. 隐私、写入与故障处理](#13-隐私写入与故障处理)
- [14. 常用提示词](#14-常用提示词)

## 1. 它解决什么问题

| 常见困扰 | Learning Coach 的处理方式 | 能看到的结果 |
| --- | --- | --- |
| 上次聊得很深入，换个聊天却又从头讲 | 从 Vault 恢复目标、当前焦点、证据与下一步 | 教练能接着适合你的位置继续 |
| 看完了很多内容，不清楚自己是否真的会 | 区分接触过、独立解释、独立应用与迁移 | “已讨论”和“已展示能力”分别呈现 |
| 学了不少，但没有必要每次写长笔记 | 按学习结果选择 evidence、unassessed、session 或有价值的 note | 保留恢复学习所需的信息，避免堆积聊天摘要 |
| 同时有几个主题，来回切换 | Ask Coach 根据目标、前置知识、复习需求、跨 Topic 复用与时间安排注意力 | 给出当下的选择理由和具体交接 |
| 学习中冒出一个值得研究的假设，但不想让研究逻辑常驻每轮教学 | 只有明确 research intent 时调用 Research Coach；Research Coach 独立读取/更新 Idea Vault | 研究支线可以推进，又不会把普通学习变成持续 research monitoring |
| 想知道最近有什么进展 | Learning View 按日期展示已有记录 | 看见新证据、笔记更新、未评估探索与记录限制 |
| 长期使用后结构混乱、引用过时 | Vault Curator 检查并按明确操作维护 | 结构调整不会被当作能力提升 |

这些是产品的行为设计，不是对学习效果或研究质量的保证。教学、评估和研究判断仍可能出错；你可以纠正判断，并要求查看支持它的证据。

## 2. 六个入口如何选择

插件是一个产品，里面有六个 Skill。日常可以用自然语言表达意图；明确写出 Skill 名称有助于区分相近请求。

| 你的问题 | 使用哪个入口 | 是否可能保存 |
| --- | --- | --- |
| “继续摄影，带我练习主体运动的判断” | **Topic Coach** | 当前 Topic 的学习状态、证据、笔记和会话 |
| “今天只有 25 分钟，先学摄影还是历史？” | **Ask Coach** | 仅有长期价值的跨主题建议状态或有证据的学习策略 |
| “我怀疑某个机制会导致这个现象，这能不能研究？先看看 Idea Vault” | **Research Coach** | 只在明确授权下更新独立 Idea Vault；不会把研究要求直接写成 learner gap |
| “把这次聊天里的一个重要想法记下来，但我现在不想系统学” | **Knowledge Inbox** | 明确确认后保存一条碎片；不创建 Topic 或 mastery 证据，也不作为 Idea Vault 默认 staging |
| “让我看看本周学了什么” | **Learning View** | 永远只读 |
| “这两个主题是否重复？先检查一下” | **Vault Curator** | 检查只读；明确的维护操作才写入 |

“查看已保存的下一步”属于 Learning View；“重新决定下一步应该做什么”属于教练。“显示已有学习策略”属于 Learning View；“根据多个主题总结策略”属于 Ask Coach。

普通的研究相关知识问题仍属于 Topic Coach。例如“为什么 memory accumulation 会造成 retrieval interference？”如果目的是理解机制，就继续学习；当你明确问“这个现象能不能作为研究假设”“检查 novelty”“给它设计 decisive experiment”时，才进入 Research Coach。Research Coach 是 request-scoped 的，不会在后续普通学习中一直常驻。

## 3. 开始使用前

### 插件与 Vault 是不同层次

- **learning-coach 仓库/插件**保存规则、参考资料和测试。
- **Learning Vault**保存你的私有学习状态。不要把学习数据提交到产品的公开仓库。
- **Idea Vault（可选）**是独立的 research authority，保存研究方向、idea、survey、experiment 等研究生命周期状态；它不是 Learning Vault 的一个子目录或 learner-state schema。

当前 alpha 依赖宿主提供的 GitHub 工具访问你授权的仓库，不要求你把令牌、密码或私钥发进聊天。

### 安装与可用能力

本地 Codex 的 personal marketplace 安装流程见[安装与发布说明](releasing.md)。这条路径用于安装插件代码，不要求把你的 Learning Vault 或 Idea Vault clone 到电脑。

在其他 Chat 环境中，先确认六个 Skill、它们引用的共享/Skill-local 文件，以及需要的 GitHub 读写工具实际可用。本地安装不会自动证明另一处 Chat 已经加载同一版本。仅粘贴 Skill 名称也不会安装插件或获得工具权限。

正常持久化学习需要能读取并写入 Learning Vault。只有读权限时仍可查看状态；如果你愿意进行一次不保存的学习，需要明确说明。不要把“没有写权限”误当成“已经保存”。Research Coach 在操作外部 Idea Vault 前会单独检查该仓库的当前读写能力；能读不等于获准写。

### 第一次连接

可以这样开始，把占位符换成自己的私有仓库：

```text
我准备把 <owner>/<private-learning-vault> 用作 Learning Vault。
先检查访问能力和当前格式。如果确认是空仓库，初始化当前格式的 Vault。
先不要替我创建任何学习主题。
```

系统先读取 manifest，确认各主题的状态位置。已经存在但格式不受支持的仓库，需要单独升级，不能在学习时猜测解析。

如果只是保存聊天中的重要碎片，可以直接使用同一个 Vault：

```text
Use Knowledge Inbox。
我的 Learning Vault 是 <owner>/<private-learning-vault>。
收集本次 session 中值得留下的 notes。先展示建议保留的 notes，得到确认后再保存。不要创建 Topic、声称我已掌握，也不要保存原始聊天记录。
```

条目会进入 Vault 根部的 `inbox/`，与 `topics/` 并列；`.learning-vault/` 保留 manifest、Learning Strategy、Coach State 等控制面与跨 Topic 状态。Inbox 表示“以后可能值得检索”，不表示已经开始系统学习，也不表示它会自动晋升为 research idea。

如果要使用 Idea Vault，单独告诉 Research Coach 目标仓库即可；Research Coach 应先读取该仓库自己的 README / index，不能假定其结构，也不能把 Idea Vault 生命周期字段复制到 Learning Vault。

## 4. 建立第一个 Topic

虚构学习者小岚准备学习三件事：

| Topic | 可观察的目标能力 | 刻意收窄的边界 |
| --- | --- | --- |
| 摄影入门 `photo-basics` | 为静止与运动主体选择拍摄方案，并解释失败后的调整 | 先不学专业布光和复杂后期 |
| 历史 `local-history` | 比较虚构栖川城市的两份史料，区分材料记载、推断和待核实问题 | 先不追求通史覆盖或背诵大量年代 |
| Agent `museum-agent` | 解释博物馆导览助手的工具调用流程，独立验证回答是否有材料依据 | 先不做多智能体协作或生产部署 |

这些主题供演示使用，不建议一次把它们全部创建好。先选真正要推进的一个：

```text
Use Topic Coach.
我想学摄影，目标是在旅行中为静止和运动主体选择拍摄方案，
并能解释为什么没拍好。请帮我确定合适的 Topic 边界和学习路线，
然后从基础开始。不要因为我看过教程就默认我已经会了。
```

Topic Coach 应先判断它是否值得成为独立 Topic。比如“小岚还想学快门”通常可以放进摄影 Topic 的 Concept 或阶段，不必再建一个平行主题。

一个可能的路线是：

```text
识别拍摄目标 → 解释参数选择 → 独立拍摄与复盘 → 在新场景中调整
```

这里有三个不同层次：

- **Roadmap**：朝目标能力前进的阶段。
- **Current focus**：现在正在处理的具体问题。
- **Next step**：下次可以直接开始的动作及理由。

路线可以调整。阶段状态表示已有能力依据或当前安排，不表示看了多少页，也不换算成“课程完成 70%”。

## 5. 一次学习如何留下有用记录

假设小岚在摄影 Topic 中问了几轮问题，教练进行了讲解，并展示了一个设置方案。小岚还没有独立解释或实践。

有恢复价值的新探索，可以进入未评估范围或简短 session；不应因为教学发生了就给独立应用等级。若只是同一焦点下的普通说明与“好的”，没有新增恢复价值，也可以不写。

后来小岚独立比较了两个情境，说明选择理由。教练检查了回答的准确性与适用条件后，可以保存相应的解释证据；这仍不等于已经独立拍摄成功。

### Learning Capture 如何分类

每段有意义的学习结束、切换焦点或收尾时，Topic Coach 会判断哪些内容值得持久化。你无需另行调用一个 capture Skill。

| 发生了什么 | 合适的去向 | 不应推断什么 |
| --- | --- | --- |
| 独立回答、解释、纠错或实践 | evidence，按实际表现判断能力 | 一次有提示的成功不证明独立应用 |
| 形成以后值得回看的个人化理解 | 通过质量判断后建立或修订 note | 有笔记不等于已掌握 |
| 遇到相关内容但没有检验 | 有必要时更新 unassessed | 未评估不等于不会 |
| 探索过程或继续学习的上下文值得恢复 | 最小必要的 session checkpoint | 有一次会话不等于完成一个阶段 |
| 普通聊天中出现值得以后找回、但暂时不想系统学习的内容 | 明确调用 Knowledge Inbox 保存一条紧凑碎片 | 不创建 Topic，不记录 mastery，也不保存原始聊天 |
| 某种学习方法可能在多个主题中有效 | 保留当前主题的有用观察，交给 Ask Coach 综合 | Topic Coach 不直接写跨主题策略 |
| 明确提出“这个 observation/hypothesis 能不能研究”“检查 novelty/Idea Vault/experiment” | 以最小 provenance handoff 给 Research Coach | Topic Coach 不自己判断 Idea Vault lifecycle，不自动写 idea |
| 旅行相册设计等项目交付物 | 项目放在对应的外部位置；Vault 只保留可复用学习和必要指向 | 项目完成不自动证明学习者能力；分类不等于已获外部写入授权 |

这些去向可以关联，但不用每次各写一份。同一个观察重试保存时，应避免重复证据或重复会话。

强 research-looking observation 但没有明确 research intent 时，可以被简短提醒“这可能值得研究”，但不会自动触发 novelty search、experiment planning 或 Idea Vault 写入。

### 你随时可以停

```text
今天先到这里。保存已经发生的有意义学习，保留一个下次可继续的动作，
不要再出新题。
```

已经观察到的有用变化应在当前轮结束前保存。不回答最后一道题，不会被算作答错；结束本次学习也不会自动完成 Topic。

## 6. 能力、证据与笔记

### Mastery 表示什么

等级用于具体 Concept 的证据判断，不是对一个人的总评分，也不是主题的平均完成度。

| 等级 | 含义 | 虚构的 Agent 例子 |
| --- | --- | --- |
| 0 | 未评估或没有支持证据 | 看过导览助手演示，尚未解释或操作 |
| 1 | 能识别 | 在新流程记录中识别一次工具调用 |
| 2 | 能用自己的话解释 | 准确解释工具结果如何成为后续回答的依据 |
| 3 | 能独立应用 | 独立完成一次材料检索，并检查回答是否受材料支持 |
| 4 | 能迁移到有意义的新情境 | 换到不同资料组织方式，调整检索与验证方法并解释理由 |

具体等级取决于真实任务、准确性、帮助程度和已有证据，不是照表自动升级。你可以问：

```text
Use Learning View.
请展示 museum-agent 中这个能力判断的证据，说明当时是否获得提示，
以及它能支持什么、还不能支持什么。
```

### 三种“不确定”不要混在一起

- **Unassessed**：还没有足够证据。比如小岚还没比较过两份相互冲突的史料。
- **Known gap**：已经观察到具体困难。比如小岚在史料比较中把后人的推断当作原始记载，且已有具体回答证据。
- **Open question**：知识或命题自身尚不确定，而不是学习者表现不好。

Research Coach 再多一个必须守住的区分：**research requires X ≠ learner lacks X**。某个实验需要 causal inference、retrieval diagnosis 或 PyTorch，并不能直接证明学习者不会这些能力。Research Coach 只能把它作为 capability demand 交给 Ask Coach；Ask Coach 再读取 authoritative Learning Vault evidence 决定是复用、快速验证、补缺口还是暂不学习。

新表现与旧记录矛盾时，保留历史并重新审视当前依据。系统不应该为了让进度好看而删除不方便的证据。

### 笔记何时值得写

小岚发现自己在导览 Agent 的演示中，只检查回答是否流畅，没有检查引用材料。如果在实际学习中形成一个可复用的验证方法，它可能值得成为一篇短笔记。

笔记应能回答一个未来的检索问题，例如：“我下次验证导览回答时，怎样区分材料支持的内容与未经核实的补充？”它不必复制整段教学，也不应该不断追加成“所有 Agent 知识大全”。

同一中心想法已有笔记时，优先修订。一个通用定义、一轮普通问答，通常不需要专门笔记。

## 7. 隔几天如何继续与复习

```text
Use Topic Coach.
继续 photo-basics。先从 Vault 恢复当前焦点、已有证据和下一步，
再安排今天的小练习。
```

教练可以恢复已持久化的状态，不保证能恢复所有未保存的聊天。Skill 不必一直常驻每个对话；可靠的连续性来自 Vault 中实际保存的内容。

如果 manifest 绑定了 Coach State，并且当前 Topic 有可能复用其他 Topic 已掌握的基础，Topic Coach 可以读取与当前 Topic 直接相关的 active cross-Topic connection，把它当作“去哪里找可复用知识”的提示。它仍会回读关联 Topic 的权威 evidence；connection 本身不证明 mastery，也不会把另一个 Topic 的证据复制过来。

如果小岚之前已经准确解释过一个概念，复习可以先做检索或应用，再根据表现决定是否重讲：

```text
Use Topic Coach.
在 local-history 中复习上次练过的史料比较。
先让我尝试，不要先把完整答案展示出来；根据实际表现更新记录。
```

Topic Coach 负责当前 Topic 的复习和证据；“三个主题中哪一个最需要复习”由 Ask Coach 决定。

## 8. 多个主题如何安排

假设虚构状态为：摄影已有解释证据但缺实践；历史有一次近期的史料辨析困难；Agent 刚看过一个由教练完成的导览助手演示，尚未评估。

```text
Use Ask Coach.
我今天有 25 分钟，近期想完成一个虚构城市博物馆的导览练习。
请比较 photo-basics、local-history 和 museum-agent 的已有状态，
推荐一个现在最值得做的动作，说明依据，并交给对应 Topic Coach。
```

一种合理的示例建议是先安排一次短史料比较练习，因为它贴近近期目标，且有已观察到的具体困难。它不应只因为摄影笔记最多就优先摄影，也不能把临时排序写成每个 Topic 的下一步。

### 推荐顺序会利用复用，但不是强制课程

Ask Coach 可以保存和使用长期有价值的 cross-Topic connections。如果一个尚未掌握的基础同时阻塞多个近期 Topic，一次有边界的基础修复可能更值得先做；如果这个基础已经有足够 evidence，Ask Coach 则应把它当作 reuse credit，让下游 Topic 更接近自己的特有 delta，而不是再安排一遍基础教学。

例如：

```text
Topic A 已证明的 shared foundation
                ↓ reuse
Topic B = shared foundation + Topic-B-specific delta
```

这种顺序只是更低学习成本的建议，不是 gate。小岚即使选择先学 Topic B，Topic Coach 也应继续当前 Topic；只有某个前置能力真的阻塞时，才补最近、最小的必要基础，然后回到 Topic B。

### 三条学习线可以联系，但证据不互相冒用

在“栖川城市博物馆”这个虚构情境中，历史学习帮助小岚辨别史料记载与推断；Agent 学习关注导览回答如何引用、验证材料；摄影学习则关注如何拍摄清楚、可用于观察的图像。

Ask Coach 可以指出它们都涉及“依据是否足以支持判断”，并在关系长期有用时保存为 Coach State connection。但能辨析史料，不自动证明能实现 Agent；能独立拍照，也不自动证明会分析历史图像。Topic Coach 可以复用另一个 Topic 已证明的共同基础来减少重复解释，但迁移能力仍需要在新的任务中实际展示，再由当前 Topic Coach 评估。

### Research idea 可以反过来驱动学习，但不直接改 learner state

如果小岚明确进入 Research Coach，研究分析可能得到：

```text
Research goal
→ 当前 epistemic bottleneck
→ Required capabilities / knowledge
```

这一步只说明“研究下一步需要什么”。随后 Ask Coach 对照 Learning Vault：已经 demonstrated 的 foundation 直接复用；exposed-but-unassessed 的能力可先做 bounded verification；真实 known gap 才考虑修补；其余再与现有目标、复习压力、时间和 context-switch cost 一起排序。最终选中的 Topic-local action 才交给 Topic Coach。

因此 Research Coach 不需要一直待在 learning context 里，也不会把 Idea Vault 的 evidence/maturity/health 复制成 Topic mastery。

### Learning Strategy：记录方法在哪些条件下有效

假设小岚在摄影和 Agent 入门中，都有证据显示“先作判断，再对照结果并解释差异”帮助暴露了遗漏条件。Ask Coach 可以综合这两个不同 Topic 的证据，保存带条件、做法、观察效果与来源的策略。

只有一节课或一句“我喜欢看图”不够。策略不是“你永远是视觉型学习者”的标签。

### Coach State：保留有价值的建议背景

小岚考虑以后学视频剪辑，但当前目标是完成基础拍摄。Ask Coach 可以把视频剪辑保留为候选，并注明何时重新考虑。候选被记录或被接受，不等于 Topic 已创建；真正开始时再交 Topic Coach 确定边界。

当前 Research Coach V0 不把 Idea link / research driver 新增为 Coach State schema 字段；研究和学习之间的 capability demand 在请求时解析。只有真实使用证明长期 pointer 有必要后，才值得重新讨论 schema。

## 9. 查看今天和最近的学习

```text
Use Learning View.
以 Asia/Shanghai 时区查看 2026-09-07 的学习记录。
区分独立证据、笔记更新和仍未评估的探索。
```

以下是**虚构输出示意**。实际输出应附可追溯的记录来源；这里不提供任何真实 Vault 链接。

| Topic | 当天记录 | 能力含义 |
| --- | --- | --- |
| 摄影入门 | 独立解释了一个参数选择，保存解释证据 | 有解释表现；尚不能据此声称独立实践 |
| 历史 | 做了带提示的史料比较，留下下次继续的上下文 | 有学习活动；不自动提升至独立应用 |
| Agent | 修订了一篇既有回答依据检查笔记 | 是笔记更新；未记录新的能力证据 |

同一次学习可能同时有 session、evidence、note 和一次写入记录，不能把它们加起来算成四节课。

### 支持的时间范围

| 说法 | 规则 |
| --- | --- |
| 今天 / today | 当前时区的今天，截至当前时刻 |
| 昨天 / yesterday | 当前时区的前一个日历日 |
| 本周 / this week | 默认周一到今天；可以明确另一种周起点 |
| 过去 7 天 / last 7 days | 今天和前六个日历日，不是滚动 168 小时 |
| 日期区间 | 起止日期都包含；缺失或倒置时先明确范围 |

你可以限定 Topic，例如“过去 7 天只看 photo-basics”。时区优先使用你的明确要求，其次宿主已知时区；无法确定时说明采用 UTC。

### 记录时间并不都表示学习时间

- evidence 的 `observedAt`：观察到表现的时间。
- session 的 `createdAt`：会话记录创建时间，可能是补录。
- note 的 `updatedAt`：最新一次笔记更新时间，不能证明它那天首次创建。
- `appliedUpdates` 的时间：写入应用时间，不自动代表学习或 mastery 提升。

例如小岚 9 月 8 日补录 9 月 1 日的学习，应区分“今天补录”和“9 月 1 日发生的学习”。旧观察日期未知时，不拿今天补成观察日期。

没有记录时应说“这个范围内未找到已记录的活动”，而不是“你什么都没学”。当前状态不是完整历史日志，无法总是回答“上个月能力提高了几级”。读取不完整、时间缺失或历史不足时，视图应明确说明。

Learning View 不补写记录，不创建每日数据库，也不会因为查看时你说出一个新答案就更新能力。需要补录或评估时，切换 Topic Coach。

## 10. 维护与整理 Vault

```text
Use Vault Curator.
检查我的 Topic 边界、笔记引用和状态展示是否一致。
先列出有实际影响的问题，不修改任何文件。
```

假设虚构 Vault 后来同时存在“摄影入门”和“快门基础”，且范围明显重叠。Curator 可以提出合并或重新划分的方案，说明影响哪些记录、引用如何保留。经过所需授权后再执行；合并不提高或降低原来的 mastery。

你也可以请求归档、重命名、修复失效引用或准备公开导出。公开导出应经过内容选择和隐私检查，不等于把整个私有 Vault 发布出去。

“忘记某段记录”是存储维护，不表示学习从未发生。Git 历史可能仍保留旧内容；删除当前文件不等于清除所有历史副本。

Vault Curator 当前维护 Learning Vault，不负责维护外部 Idea Vault 的 research lifecycle；Idea Vault 的研究对象由 Research Coach 按其仓库 contract 处理。

## 11. 补录已有学习

```text
Use Topic Coach.
我之前学过一些摄影。下面是我愿意保存的简短材料和自己的解释。
请区分可观察的证据、仅接触过的内容、值得保留的笔记与未评估部分。
缺少证据的地方不要直接判定为不会，也不要仅凭我说“做过”就升级。
```

提供需要处理的材料或可访问的来源。系统不能保证自动找回没有提供、没有保存的其他聊天。

有教练协助完成的作品应保留帮助程度。项目本身放在项目位置，Vault 保存可复用理解和能力依据。不要为了补历史把整个聊天复制为笔记。

Research Coach 同样不应把旧聊天整体搬进 Idea Vault。需要补录研究 idea 时，应提炼 observation / hypothesis / mechanism / evidence / open question，并先检查是否属于已有 idea。

## 12. Chat、Work 与脚本

本手册不把 Work 作为日常学习的强制要求。能否在某个 Chat 环境持续记录，取决于那里是否提供完整 Skill 资源及所需 GitHub 读写能力；查看记录只要求读取能力。Research Coach 操作 Idea Vault 时，也取决于该环境是否实际暴露对应 repository capability。

**当前版本的 Temporal Views 由 LLM 读取 Vault 并按规则聚合，没有专用时间聚合执行脚本。** 仓库已有的检查脚本用于开发验证，不是用户每次学习必须运行的程序。

纯聚合脚本仍在讨论中：它可能提高时间计算与去重的一致性，但尚未作为产品功能实现。后续设计应保留没有脚本执行环境时的日常路径。不能假设 Chat 能读取本地插件文件，也不承诺某个宿主的额度规则；安装方式、工具能力和配额以实际环境为准。

## 13. 隐私、写入与故障处理

| 情况 | 预期处理 |
| --- | --- |
| 你说“这次不要保存” | 本次正常教学但不写入；不会拿自动 Capture 覆盖你的选择 |
| 有意义的学习完成，写入成功 | 核验后简短说明保存结果 |
| 写入失败或超时 | 重读检查是否已应用；未保存时明确说明，不假装成功 |
| 有另一个会话同时修改状态 | 根据最新状态重新构建，不能强制覆盖；有无法自行解决的语义冲突时再询问 |
| README 与 Topic state 不一致 | 以权威 state 为准；Learning View 只报告，修复交 Curator |
| 没有 Learning Vault 写能力 | 可以只读查看，不能悄悄开始无法保存的正常持久化循环；可由你选择不保存的交互 |
| Idea Vault 可读但不可写 | Research Coach 可以分析，但不能声称已经保存；需要给出明确 handoff |
| Vault 格式不受支持 | 停止对应正常持久化流程，明确需要独立升级/按该仓库 contract 处理 |

默认保留最小必要学习或研究状态，不保存原始聊天、隐藏推理、凭证和无关个人信息。持久化成功需要核验；“模型说记住了”不是保存结果的证明。

## 14. 常用提示词

**开始一个有边界的目标**

```text
Use Topic Coach. 我想学 <领域>，希望能独立完成 <可观察任务>。
请判断合适的 Topic 边界，从我的实际表现确定起点。
```

**继续学习**

```text
Use Topic Coach. 继续 <topic-id>，从 Vault 恢复状态后开始。
```

**只看记录**

```text
Use Learning View. 展示过去 7 天的学习活动与来源，区分证据、探索和笔记更新。
```

**保存普通聊天中的知识碎片**

```text
Use Knowledge Inbox。我的 Learning Vault 是 <owner>/<private-learning-vault>。
收集本次 session 中值得留下的 notes。先展示建议保留的 notes，得到确认后再保存。不要创建 Topic、声称我已掌握，也不要保存原始聊天记录。
```

**安排有限时间**

```text
Use Ask Coach. 我有 <时长>，近期目标是 <目标>。比较相关 Topic，考虑已有 cross-Topic connections 与可复用 foundation 后建议一个动作。
```

**把明确的研究问题交给 Research Coach**

```text
Use Research Coach。我的 Idea Vault 是 <owner>/<private-idea-vault>。
我怀疑 <observation/hypothesis>。先检查它与已有 direction/idea 的关系，
不要自动新建重复 idea；指出当前 epistemic bottleneck 和最小 decisive validation。
```

**让研究需求反过来安排学习**

```text
Use Research Coach. 我想推进 <idea>，先给出 bounded capability demand。
然后交给 Ask Coach 对照 Learning Vault，复用已经 demonstrated 的 foundation，
只推荐真正需要验证或补足的学习动作。
```

**纠正判断**

```text
Use Topic Coach. 这条证据把有提示完成写成了独立完成。
请核对帮助程度，保留历史并重新审视当前能力依据。
```

**收尾**

```text
今天停止学习。保存已经发生的有意义变化，保留下一步，不再提新问题。
```

**维护**

```text
Use Vault Curator. 先检查结构和引用，说明问题与影响，不立即修改。
```

## 进一步阅读

- [产品迭代记录](product-evolution.zh-CN.md)：已实现变化、来源与待验证方向。
- [ChatGPT Project 配置](chatgpt-project.md)：项目指令示例与共享资源。
- [安装与发布](releasing.md)：本地 personal marketplace 安装及发布检查。
- [Vault 数据模型](../references/vault-format.md)：权威文件、证据与引用规则。
- [Research / Learning Handoff](../skills/research-coach/references/learning-handoff.md)：研究需求如何进入学习规划，但不变成 learner gap。
- [Temporal Views 协议](../skills/learning-view/references/temporal-views.md)：时间边界与历史限制。

维护说明：功能行为变化时更新对应章节、适用版本和示例。示例始终使用独立编写的虚构材料；不要把真实 Learning Vault 或 Idea Vault 内容替换姓名后当作演示。