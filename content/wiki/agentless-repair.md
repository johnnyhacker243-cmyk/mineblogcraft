---
kind: "node"
id: "agentless-repair"
title: "定位修复验证流水线"
description: "Agentless 将定位、修复和补丁验证拆成固定流程，作为复杂软件工程智能体的简洁对照方案。 · 预印本"
category: "Software"
tags: ["Agentless","程序修复","补丁验证","预印本"]
parentIds: ["testing"]
status: "untracked"
frame: "task"
details: "Agentless 将定位、修复和补丁验证拆成固定流程，作为复杂软件工程智能体的简洁对照方案。 · 预印本"
learningPoints: ["固定流程的阶段输入输出", "补丁候选如何被独立验证", "复杂智能体相对基线增加了什么"]
relatedBlogs: []
relatedPapers: [{"id":"arxiv-2407.01489","title":"Agentless: Demystifying LLM-based Software Engineering Agents"}]
relatedRss: []
sources: [{"id":"paper-arxiv-2407.01489","kind":"paper","title":"Agentless: Demystifying LLM-based Software Engineering Agents","url":"#paper/arxiv-2407.01489","locator":"原始 PDF，共 25 页；下方摘要不是全文审读结论","excerpt":"Recent advancements in large language models (LLMs) have significantly advanced the automation of software development tasks, including code synthesis, program repair, and test generation. More recently, researchers and industry practitioners have developed various autonomous LLM agents to perform end-to-end software development tasks. These agents are equipped with the ability to use tools, run commands, observe feedback from the environment, and plan for future actions. However, the complexity of these agent-based approaches, together with the limited abilities of current LLMs, raises the following question: Do we really have to employ complex autonomous software agents? To attempt to answer this question, we build Agentless -- an agentless approach to automatically solve software development problems. Compared to the verbose and complex setup of agent-based approaches, Agentless employs a simplistic three-phase process of localization, repair, and patch validation, without letting the LLM decide future actions or operate with complex tools. Our results on the popular SWE-bench Lite benchmark show that surprisingly the simplistic Agentless is able to achieve both the highest performance (32.00%, 96 correct fixes) and low cost ($0.70) compared with all existing open-source software agents! Furthermore, we manually classified the problems in SWE-bench Lite and found problems with exact ground truth patch or insufficient/misleading issue descriptions. As such, we construct SWE-bench Lite-S by excluding such problematic issues to perform more rigorous evaluation and comparison. Our work highlights the current overlooked potential of a simple, interpretable technique in autonomous software development. We hope Agentless will help reset the baseline, starting point, and horizon for autonomous software agents, and inspire future work along this crucial direction."}]
relatedNodeIds: ["testing"]
updated: "2026-10-17"
provenance: "agent-source-synthesis"
aliases: ["Agentless","程序修复","补丁验证"]
iconKey: "iron_ingot"
iconLabel: "铁锭"
iconReason: "铁锭对应固定流程的简洁基线"
icon: "/assets/inventory/wiki-icons/iron_ingot.png"
---
# 定位修复验证流水线

## 研究问题

Agentless 将定位、修复和补丁验证拆成固定流程，作为复杂软件工程智能体的简洁对照方案。 · 预印本

出处：paper-arxiv-2407.01489

## 研究资料与阅读入口

《Agentless: Demystifying LLM-based Software Engineering Agents》；作者：Chunqiu Steven Xia, Yinlin Deng, Soren Dunn, Lingming Zhang；年份：2024。目录标注为预印本，不能据此声称已通过同行评审。站内已提供完整原文；本页根据目录导读和原摘要建立知识入口，不将原文中的实验结果冒充本站实测。

出处：paper-arxiv-2407.01489

## 方法辨析与阅读重点

Agentless 将定位、修复和补丁验证拆成固定流程，为复杂交互式智能体提供简洁对照。比较时不能只统计步骤数量：上下文选择、候选补丁和验证条件也会影响结果。简单基线有助于判断复杂度是否真正带来收益。

以上为基于该节点所引站内论文摘要的 Agent 整理；结果、证明及数值条件须回到原文核对。

## 原摘要与核对边界

Recent advancements in large language models (LLMs) have significantly advanced the automation of software development tasks, including code synthesis, program repair, and test generation. More recently, researchers and industry practitioners have developed various autonomous LLM agents to perform end-to-end software development tasks. These agents are equipped with the ability to use tools, run commands, observe feedback from the environment, and plan for future actions. However, the complexity of these agent-based approaches, together with the limited abilities of current LLMs, raises the following question: Do we really have to employ complex autonomous software agents? To attempt to answer this question, we build Agentless -- an agentless approach to automatically solve software development problems. Compared to the verbose and complex setup of agent-based approaches, Agentless employs a simplistic three-phase process of localization, repair, and patch validation, without letting the LLM decide future actions or operate with complex tools. Our results on the popular SWE-bench Lite benchmark show that surprisingly the simplistic Agentless is able to achieve both the highest performance (32.00%, 96 correct fixes) and low cost ($0.70) compared with all existing open-source software agents! Furthermore, we manually classified the problems in SWE-bench Lite and found problems with exact ground truth patch or insufficient/misleading issue descriptions. As such, we construct SWE-bench Lite-S by excluding such problematic issues to perform more rigorous evaluation and comparison. Our work highlights the current overlooked potential of a simple, interpretable technique in autonomous software development. We hope Agentless will help reset the baseline, starting point, and horizon for autonomous software agents, and inspire future work along this crucial direction.

出处：paper-arxiv-2407.01489

## 相关知识

[[testing]]

[[index]]
