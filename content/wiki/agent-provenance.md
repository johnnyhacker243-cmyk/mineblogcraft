---
kind: "node"
id: "agent-provenance"
title: "Agent 框架来源标记"
description: "研究智能体框架被复制并自动改写后，来源标记能否保留，以及水印检测面对主动规避的局限。 · 预印本"
category: "Security"
tags: ["来源追踪","Agent","水印","预印本"]
parentIds: ["supply-chain"]
status: "untracked"
frame: "task"
details: "研究智能体框架被复制并自动改写后，来源标记能否保留，以及水印检测面对主动规避的局限。 · 预印本"
learningPoints: ["自演化和主动规避如何改变标记", "来源检测的误报漏报条件", "可识别来源与合法授权的区别"]
relatedBlogs: []
relatedPapers: [{"id":"arxiv-2610.21458","title":"What Survives Self-Evolution: Provenance Marks in Copied Agent Harnesses"}]
relatedRss: []
sources: [{"id":"paper-arxiv-2610.21458","kind":"paper","title":"What Survives Self-Evolution: Provenance Marks in Copied Agent Harnesses","url":"#paper/arxiv-2610.21458","locator":"原始 PDF，共 28 页；下方摘要不是全文审读结论","excerpt":"Agent harnesses, the prompt and tool code around a base model, leak. Claude Code's 512,000 lines were mirrored within hours of a packaging error. A plagiarist can pass a leaked harness through a published self-evolver and ship the result as its own. We define this as a covert rewriting attack. No one targets a provenance mark, yet a large language model (LLM) proposer rewrites the file that carries it and a score keeps the better rewrites. We give the first measurement of marks under this attack, with three evolvers, five proposers and two environments. Published marks fail. KGW in the prompt survives GEPA's rewrites in 0 of 12 copies, AgentMark as released in 5 of 12. The proposer's habits decide survival, by two orders of magnitude across models, and selection protects a mark only when each decision sees enough games. We then build a mark for this attack. Its key is the order of near-tied entries of a table of where objects are found, built from public games, so deleting the table costs success, rewrites that keep its rows keep the order, and a customer reads the key from the agent's actions alone. On held-out games it is detected in 62 of 76 copies whose lineage rewrote its file. A scheme-aware plagiarist reshuffles the ties at no measurable cost, and a plagiarist who asks the proposer for more general code removes the key in 75-100% of rewrites."}]
relatedNodeIds: ["supply-chain"]
updated: "2026-10-17"
provenance: "agent-source-synthesis"
aliases: ["来源追踪","Agent","水印"]
iconKey: "name_tag"
iconLabel: "命名牌"
iconReason: "命名牌对应复制改写后的来源识别"
icon: "/assets/inventory/wiki-icons/name_tag.png"
---
# Agent 框架来源标记

## 研究问题

研究智能体框架被复制并自动改写后，来源标记能否保留，以及水印检测面对主动规避的局限。 · 预印本

出处：paper-arxiv-2610.21458

## 研究资料与阅读入口

《What Survives Self-Evolution: Provenance Marks in Copied Agent Harnesses》；作者：Jieyu Li, Jingya Li, Sheng Li, Xinpeng Zhang, Zhenxing Qian；年份：2026。目录标注为预印本，不能据此声称已通过同行评审。站内已提供完整原文；本页根据目录导读和原摘要建立知识入口，不将原文中的实验结果冒充本站实测。

出处：paper-arxiv-2610.21458

## 方法辨析与阅读重点

复制并自动改写 Agent 运行框架后，来源标记可能保留，也可能被主动规避。研究来源水印时应把检测到标记、判断复制关系和证明许可合规分开；来源识别并不能替代授权与代码审查。

以上为基于该节点所引站内论文摘要的 Agent 整理；结果、证明及数值条件须回到原文核对。

## 原摘要与核对边界

Agent harnesses, the prompt and tool code around a base model, leak. Claude Code's 512,000 lines were mirrored within hours of a packaging error. A plagiarist can pass a leaked harness through a published self-evolver and ship the result as its own. We define this as a covert rewriting attack. No one targets a provenance mark, yet a large language model (LLM) proposer rewrites the file that carries it and a score keeps the better rewrites. We give the first measurement of marks under this attack, with three evolvers, five proposers and two environments. Published marks fail. KGW in the prompt survives GEPA's rewrites in 0 of 12 copies, AgentMark as released in 5 of 12. The proposer's habits decide survival, by two orders of magnitude across models, and selection protects a mark only when each decision sees enough games. We then build a mark for this attack. Its key is the order of near-tied entries of a table of where objects are found, built from public games, so deleting the table costs success, rewrites that keep its rows keep the order, and a customer reads the key from the agent's actions alone. On held-out games it is detected in 62 of 76 copies whose lineage rewrote its file. A scheme-aware plagiarist reshuffles the ties at no measurable cost, and a plagiarist who asks the proposer for more general code removes the key in 75-100% of rewrites.

出处：paper-arxiv-2610.21458

## 相关知识

[[supply-chain]]

[[index]]
