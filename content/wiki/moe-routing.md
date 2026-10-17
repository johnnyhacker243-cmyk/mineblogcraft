---
kind: "node"
id: "moe-routing"
title: "MoE 专家路由"
description: "探索细粒度专家与共享专家之间的路由矛盾，以 MirrorMoE 研究按 token 抑制冗余专家的机制。 · 预印本"
category: "AI"
tags: ["MoE","路由","专家模型","预印本"]
parentIds: ["machine-learning"]
status: "untracked"
frame: "task"
details: "探索细粒度专家与共享专家之间的路由矛盾，以 MirrorMoE 研究按 token 抑制冗余专家的机制。 · 预印本"
learningPoints: ["共享专家怎样改变路由探索", "细粒度分割与激活预算是否匹配", "专家抑制的消融是否支持机制解释"]
relatedBlogs: []
relatedPapers: [{"id":"arxiv-2610.22353","title":"Rethinking Routing Exploration in Modern Mixture-of-Experts"}]
relatedRss: []
sources: [{"id":"paper-arxiv-2610.22353","kind":"paper","title":"Rethinking Routing Exploration in Modern Mixture-of-Experts","url":"#paper/arxiv-2610.22353","locator":"原始 PDF，共 20 页；下方摘要不是全文审读结论","excerpt":"Mixture-of-experts (MoE) models have become an important approach for scaling model parameters. Modern MoE architectures increasingly combine two design choices: fine-grained expert segmentation and shared experts. The former increases expressiveness by enabling more expert combinations at a fixed activation ratio, and the latter introduces experts that are active for every token. We identify an exploration dilemma between these designs: shared experts can make routing less exploratory by reducing the variability of token representations. This conflicts with the greater need for exploration induced by fine-grained expert segmentation due to the combinatorially enlarged routing space. Consequently, the additional expressiveness offered by fine-grained segmentation may not be fully realized in practice. MirrorMoE is proposed to reconcile this exploration dilemma by shrinking the exploration space through token-adaptive suppression of unnecessary experts. MirrorMoE consistently improves performance across model scales."}]
relatedNodeIds: ["machine-learning"]
updated: "2026-10-17"
provenance: "agent-source-synthesis"
aliases: ["MoE","路由","专家模型"]
iconKey: "comparator"
iconLabel: "红石比较器"
iconReason: "比较器对应 token 对专家的选择"
icon: "/assets/inventory/wiki-icons/comparator.png"
---
# MoE 专家路由

## 研究问题

探索细粒度专家与共享专家之间的路由矛盾，以 MirrorMoE 研究按 token 抑制冗余专家的机制。 · 预印本

出处：paper-arxiv-2610.22353

## 研究资料与阅读入口

《Rethinking Routing Exploration in Modern Mixture-of-Experts》；作者：Bingcong Li, Hao Ma, Michael Muehlebach, Niao He, Yi Ma；年份：2026。目录标注为预印本，不能据此声称已通过同行评审。站内已提供完整原文；本页根据目录导读和原摘要建立知识入口，不将原文中的实验结果冒充本站实测。

出处：paper-arxiv-2610.22353

## 方法辨析与阅读重点

细粒度专家增加可组合的选择，共享专家却可能减少 token 表征的差异，两个设计目标并不天然一致。MirrorMoE 的问题意识是按 token 收缩不必要的专家搜索空间，再观察路由探索与模型能力之间的关系。比较时应同时约束激活参数预算，避免只比较总参数量。

以上为基于该节点所引站内论文摘要的 Agent 整理；结果、证明及数值条件须回到原文核对。

## 原摘要与核对边界

Mixture-of-experts (MoE) models have become an important approach for scaling model parameters. Modern MoE architectures increasingly combine two design choices: fine-grained expert segmentation and shared experts. The former increases expressiveness by enabling more expert combinations at a fixed activation ratio, and the latter introduces experts that are active for every token. We identify an exploration dilemma between these designs: shared experts can make routing less exploratory by reducing the variability of token representations. This conflicts with the greater need for exploration induced by fine-grained expert segmentation due to the combinatorially enlarged routing space. Consequently, the additional expressiveness offered by fine-grained segmentation may not be fully realized in practice. MirrorMoE is proposed to reconcile this exploration dilemma by shrinking the exploration space through token-adaptive suppression of unnecessary experts. MirrorMoE consistently improves performance across model scales.

出处：paper-arxiv-2610.22353

## 相关知识

[[machine-learning]]

[[index]]
