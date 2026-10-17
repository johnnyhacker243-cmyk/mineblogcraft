---
kind: "node"
id: "agent-computer-interface"
title: "代码智能体交互接口"
description: "SWE-agent 原论文：为语言模型设计仓库浏览、编辑和测试接口，分析工具交互方式对自动修复的影响。 · 预印本"
category: "Software"
tags: ["SWE-agent","ACI","程序修复","预印本"]
parentIds: ["api"]
status: "untracked"
frame: "task"
details: "SWE-agent 原论文：为语言模型设计仓库浏览、编辑和测试接口，分析工具交互方式对自动修复的影响。 · 预印本"
learningPoints: ["浏览编辑测试接口怎样组织", "错误反馈如何帮助恢复", "接口收益是否通过消融分离"]
relatedBlogs: []
relatedPapers: [{"id":"arxiv-2405.15793","title":"SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering"}]
relatedRss: []
sources: [{"id":"paper-arxiv-2405.15793","kind":"paper","title":"SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering","url":"#paper/arxiv-2405.15793","locator":"原始 PDF，共 118 页；下方摘要不是全文审读结论","excerpt":"Language model (LM) agents are increasingly being used to automate complicated tasks in digital environments. Just as humans benefit from powerful software applications, such as integrated development environments, for complex tasks like software engineering, we posit that LM agents represent a new category of end users with their own needs and abilities, and would benefit from specially-built interfaces to the software they use. We investigate how interface design affects the performance of language model agents. As a result of this exploration, we introduce SWE-agent: a system that facilitates LM agents to autonomously use computers to solve software engineering tasks. SWE-agent's custom agent-computer interface (ACI) significantly enhances an agent's ability to create and edit code files, navigate entire repositories, and execute tests and other programs. We evaluate SWE-agent on SWE-bench and HumanEvalFix, achieving state-of-the-art performance on both with a pass@1 rate of 12.5% and 87.7%, respectively, far exceeding the previous state-of-the-art achieved with non-interactive LMs. Finally, we provide insight on how the design of the ACI can impact agents' behavior and performance."}]
relatedNodeIds: ["api"]
updated: "2026-10-17"
provenance: "agent-source-synthesis"
aliases: ["SWE-agent","ACI","程序修复"]
iconKey: "repeater"
iconLabel: "红石中继器"
iconReason: "中继器对应浏览编辑测试的工具接口"
icon: "/assets/inventory/wiki-icons/repeater.png"
---
# 代码智能体交互接口

## 研究问题

SWE-agent 原论文：为语言模型设计仓库浏览、编辑和测试接口，分析工具交互方式对自动修复的影响。 · 预印本

出处：paper-arxiv-2405.15793

## 研究资料与阅读入口

《SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering》；作者：John Yang, Carlos E. Jimenez, Alexander Wettig, Kilian Lieret, Shunyu Yao, Karthik Narasimhan, Ofir Press；年份：2024。目录标注为预印本，不能据此声称已通过同行评审。站内已提供完整原文；本页根据目录导读和原摘要建立知识入口，不将原文中的实验结果冒充本站实测。

出处：paper-arxiv-2405.15793

## 方法辨析与阅读重点

SWE-agent 研究仓库浏览、编辑和测试工具的交互设计如何影响自动修复。工具接口不仅暴露能力，也决定模型看到哪些反馈、怎样定位上下文与修正错误。接口改进应以任务和消融证据衡量。

以上为基于该节点所引站内论文摘要的 Agent 整理；结果、证明及数值条件须回到原文核对。

## 原摘要与核对边界

Language model (LM) agents are increasingly being used to automate complicated tasks in digital environments. Just as humans benefit from powerful software applications, such as integrated development environments, for complex tasks like software engineering, we posit that LM agents represent a new category of end users with their own needs and abilities, and would benefit from specially-built interfaces to the software they use. We investigate how interface design affects the performance of language model agents. As a result of this exploration, we introduce SWE-agent: a system that facilitates LM agents to autonomously use computers to solve software engineering tasks. SWE-agent's custom agent-computer interface (ACI) significantly enhances an agent's ability to create and edit code files, navigate entire repositories, and execute tests and other programs. We evaluate SWE-agent on SWE-bench and HumanEvalFix, achieving state-of-the-art performance on both with a pass@1 rate of 12.5% and 87.7%, respectively, far exceeding the previous state-of-the-art achieved with non-interactive LMs. Finally, we provide insight on how the design of the ACI can impact agents' behavior and performance.

出处：paper-arxiv-2405.15793

## 相关知识

[[api]]

[[index]]
