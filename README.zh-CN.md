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

## Learning Loop

```text
提出问题
   |
定位知识点
   |
解释、预测、实践
   |
在学习者真正展示能力时记录证据
   |
只有长期学习状态发生变化时才更新 Learning Vault
   |
下次继续学习
```

Learning Coach 不会在每次解释后强制测验，也不会保存每一段对话。只有形成长期学习状态变化时才持久化。

Learning Coach 是一个可移植的 Agent Skill。Skill 定义学习流程，Learning Vault 保存长期学习状态。正常运行需要宿主同时提供对私人 Learning Vault 的读取和写入能力。

---

## 使用方法

### 推荐方式：ChatGPT Project

对于大多数用户，最简单的方式是在 ChatGPT 中创建一个 Learning Coach Project。

步骤：

1. 创建一个新的 ChatGPT Project。
2. 添加 Learning Coach 使用说明。
3. 上传：

```text
skills/learning-coach/
```

4. 连接一个私有 GitHub 仓库作为 Learning Vault，并提供仓库读取和写入能力。

Vault 会保存：

- 学习目标
- 知识点
- 掌握证据
- 复习历史
- 下一步行动

开始学习：

```text
使用 Learning Coach。

初始化我的 Learning Vault。

我的目标：
深入理解 Agent Memory，并最终实现一个最小可测试的记忆型 Agent。
```

之后可以直接：

```text
继续我的学习。
```

或：

```text
继续 agent-memory 学习。
```

Learning Coach 会恢复之前的学习状态，并从当前最有价值的下一步继续。

---

## 支持 Skill 的 Agent 环境

如果你的 Agent 环境支持 Skill：

1. 加载 Learning Coach Skill。
2. 提供对私人 Learning Vault 的读取和写入能力。
3. 使用：

```text
使用 Learning Coach。
```

不同 Agent 可以通过不同方式提供运行能力。

---

## Learning Vault

创建一个私有 GitHub 仓库：

```text
learning-vault
```

Learning Coach 会保存长期学习状态：

```text
.learning-vault/
└── vault.json
```

不会保存：

- 原始聊天记录
- 密钥或凭证
- 隐藏推理
- 不必要的个人信息

### 访问契约

Learning Coach 将 Learning Vault 视为权威学习状态：

- **可读 + 可写：** 完整运行 Learning Coach；
- **仅可读：** 只能查看已有学习状态，不能推进 learning cycle 或产生新的 learner state；
- **仅可写但不可读：** 不支持，Learning Coach 不会盲写；
- **不可读：** Learning Coach 无法开始或恢复学习。

如果写入能力存在，学习者可以明确选择“这段不记录”。这与宿主本身没有写入能力是两种不同情况。

---

## Prompt Templates

开始新的学习路径：

```text
使用 Learning Coach。

我的学习目标：
<想学习的内容>

我的目标产出：
<希望最终实现或达到的结果>

当前水平：
<已有理解>

请从 Learning Vault 创建或恢复我的学习路径。
```

继续已有学习：

```text
使用 Learning Coach。

继续学习：
<主题>

检查我的当前进度，并选择下一步最有价值的学习任务。
```

接管已经进行中的学习：

```text
使用 Learning Coach。

我已经在学习：
<主题>

请根据我已经学过、实现过或能够解释的内容，重建当前学习状态。区分“接触过”和“已经证明掌握”，识别仍未评估的部分，并从下一步最有价值的学习任务继续。
```

完整流程见 [Capturing Existing Learning](docs/capturing-existing-learning.md)。

更新学习进展：

```text
使用 Learning Coach。

我完成了：
<实现 / 实验 / 解释>

请根据证据评估我的理解，并在形成长期学习状态变化后更新 Learning Vault。
```

---

## Companion Skills

Learning Coach 可以通过额外 Skill 扩展 Learning Vault 管理能力。

### Vault Curator

Vault Curator 负责 Learning Vault 的维护与生命周期操作，包括：

- 检查 Vault 健康状态和结构一致性
- 合并或拆分 Topic、整合重复 Concept
- 清理或归档学习结构
- 修复失效引用
- 在明确确认后忘记选定的存储内容
- 基于明确白名单准备公开导出

建议在完成重要学习阶段后，或 Vault 本身需要维护时运行 Vault Curator。

---

## 开发

本仓库主要作为 Agent Skill 包使用。

更多配置说明请参考：

- [ChatGPT Project Setup](docs/chatgpt-project.md)

## 许可证

Copyright 2026 SShending.

本项目采用 [Apache License 2.0](LICENSE) 许可。
