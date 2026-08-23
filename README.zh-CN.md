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

Learning Coach 将问题、解释、错误、实践结果转化为长期学习状态，并通过 GitHub-backed Learning Vault 保存。

> AI 不只应该记住你问过什么，还应该记住你真正学会了什么。

## 工作方式

```text
Learning Coach Skill
        +
Learning Vault
        |
        v
长期学习记忆
```

Learning Coach 是一个可移植的 Agent Skill。Skill 定义学习流程，Learning Vault 保存长期学习状态。

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

4. 连接一个私有 GitHub 仓库作为 Learning Vault。

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

如果你的 Agent 环境支持 Skill 安装：

1. 安装 Learning Coach Skill。
2. 连接 Learning Vault。
3. 使用：

```text
使用 Learning Coach。
```

Skill 会由宿主自动加载，并提供相同的学习流程。

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

---

## 示例

```text
帮我系统掌握 RAG，最终完成一个可以运行的小项目。

从 Learning Vault 继续 agent-memory，并选择当前最值得学习的下一步。

测试我最容易忘记的知识点，并根据表现更新掌握程度。
```

---

## 开发

本仓库主要作为 Agent Skill 包使用。更多开发信息请参考相关文档。

## 许可证

Copyright 2026 SShending.

本项目采用 [Apache License 2.0](LICENSE) 许可。
