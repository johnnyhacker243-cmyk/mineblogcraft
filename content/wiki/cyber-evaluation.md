---
kind: "node"
id: "cyber-evaluation"
title: "模型网络安全评测"
description: "CYBERSECEVAL 3 安全评估报告，按不同风险对象衡量语言模型的网络安全能力、滥用风险与缓解措施。 · 预印本"
category: "Security"
tags: ["安全评估","LLM","CyberSecEval","预印本"]
parentIds: ["ai-security"]
status: "untracked"
frame: "task"
details: "CYBERSECEVAL 3 安全评估报告，按不同风险对象衡量语言模型的网络安全能力、滥用风险与缓解措施。 · 预印本"
learningPoints: ["能力、滥用与防御评价如何分开", "任务权限与成功标准是否明确", "缓解措施适用于哪些具体场景"]
relatedBlogs: []
relatedPapers: [{"id":"arxiv-2408.01605","title":"CYBERSECEVAL 3: Advancing the Evaluation of Cybersecurity Risks and Capabilities in Large Language Models"}]
relatedRss: []
sources: [{"id":"paper-arxiv-2408.01605","kind":"paper","title":"CYBERSECEVAL 3: Advancing the Evaluation of Cybersecurity Risks and Capabilities in Large Language Models","url":"#paper/arxiv-2408.01605","locator":"原始 PDF，共 36 页；下方摘要不是全文审读结论","excerpt":"We are releasing a new suite of security benchmarks for LLMs, CYBERSECEVAL 3, to continue the conversation on empirically measuring LLM cybersecurity risks and capabilities. CYBERSECEVAL 3 assesses 8 different risks across two broad categories: risk to third parties, and risk to application developers and end users. Compared to previous work, we add new areas focused on offensive security capabilities: automated social engineering, scaling manual offensive cyber operations, and autonomous offensive cyber operations. In this paper we discuss applying these benchmarks to the Llama 3 models and a suite of contemporaneous state-of-the-art LLMs, enabling us to contextualize risks both with and without mitigations in place."}]
relatedNodeIds: ["ai-security"]
updated: "2026-10-17"
provenance: "agent-source-synthesis"
aliases: ["安全评估","LLM","CyberSecEval"]
iconKey: "iron_helmet"
iconLabel: "铁头盔"
iconReason: "铁头盔对应风险对象明确的安全评估"
icon: "/assets/inventory/wiki-icons/iron_helmet.png"
---
# 模型网络安全评测

## 研究问题

CYBERSECEVAL 3 安全评估报告，按不同风险对象衡量语言模型的网络安全能力、滥用风险与缓解措施。 · 预印本

出处：paper-arxiv-2408.01605

## 研究资料与阅读入口

《CYBERSECEVAL 3: Advancing the Evaluation of Cybersecurity Risks and Capabilities in Large Language Models》；作者：Shengye Wan, Cyrus Nikolaidis, Daniel Song, David Molnar, James Crnkovich, Jayson Grace, Manish Bhatt, Sahana Chennabasappa, Spencer Whitman, Stephanie Ding, Vlad Ionescu, Yue Li, Joshua Saxe；年份：2024。目录标注为预印本，不能据此声称已通过同行评审。站内已提供完整原文；本页根据目录导读和原摘要建立知识入口，不将原文中的实验结果冒充本站实测。

出处：paper-arxiv-2408.01605

## 方法辨析与阅读重点

CYBERSECEVAL 3 将网络安全能力、滥用风险及缓解措施作为不同评价对象。能力提高不必然等价于防御效果变好；实验应先明确场景、受保护对象、权限和成功判据。报告中的风险评价是特定任务设定下的结果。

以上为基于该节点所引站内论文摘要的 Agent 整理；结果、证明及数值条件须回到原文核对。

## 原摘要与核对边界

We are releasing a new suite of security benchmarks for LLMs, CYBERSECEVAL 3, to continue the conversation on empirically measuring LLM cybersecurity risks and capabilities. CYBERSECEVAL 3 assesses 8 different risks across two broad categories: risk to third parties, and risk to application developers and end users. Compared to previous work, we add new areas focused on offensive security capabilities: automated social engineering, scaling manual offensive cyber operations, and autonomous offensive cyber operations. In this paper we discuss applying these benchmarks to the Llama 3 models and a suite of contemporaneous state-of-the-art LLMs, enabling us to contextualize risks both with and without mitigations in place.

出处：paper-arxiv-2408.01605

## 相关知识

[[ai-security]]

[[index]]
