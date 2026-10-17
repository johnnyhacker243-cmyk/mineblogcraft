---
kind: "node"
id: "ssm-duality"
title: "注意力与状态空间对偶"
description: "Mamba-2 原论文：借助结构化状态空间对偶性，解释注意力与状态空间模型的联系及高效算法。 · 预印本"
category: "AI"
tags: ["Mamba-2","SSM","模型架构","预印本"]
parentIds: ["deep-learning"]
status: "untracked"
frame: "task"
details: "Mamba-2 原论文：借助结构化状态空间对偶性，解释注意力与状态空间模型的联系及高效算法。 · 预印本"
learningPoints: ["对偶关系成立的结构条件", "状态更新与注意力计算的对应", "效率比较采用哪些运行条件"]
relatedBlogs: []
relatedPapers: [{"id":"arxiv-2405.21060","title":"Transformers are SSMs: Generalized Models and Efficient Algorithms Through Structured State Space Duality"}]
relatedRss: []
sources: [{"id":"paper-arxiv-2405.21060","kind":"paper","title":"Transformers are SSMs: Generalized Models and Efficient Algorithms Through Structured State Space Duality","url":"#paper/arxiv-2405.21060","locator":"原始 PDF，共 52 页；下方摘要不是全文审读结论","excerpt":"While Transformers have been the main architecture behind deep learning's success in language modeling, state-space models (SSMs) such as Mamba have recently been shown to match or outperform Transformers at small to medium scale. We show that these families of models are actually quite closely related, and develop a rich framework of theoretical connections between SSMs and variants of attention, connected through various decompositions of a well-studied class of structured semiseparable matrices. Our state space duality (SSD) framework allows us to design a new architecture (Mamba-2) whose core layer is an a refinement of Mamba's selective SSM that is 2-8X faster, while continuing to be competitive with Transformers on language modeling."}]
relatedNodeIds: ["deep-learning"]
updated: "2026-10-17"
provenance: "agent-source-synthesis"
aliases: ["Mamba-2","SSM","模型架构"]
iconKey: "amethyst_shard"
iconLabel: "紫水晶碎片"
iconReason: "紫水晶对应结构化状态表征"
icon: "/assets/inventory/wiki-icons/amethyst_shard.png"
---
# 注意力与状态空间对偶

## 研究问题

Mamba-2 原论文：借助结构化状态空间对偶性，解释注意力与状态空间模型的联系及高效算法。 · 预印本

出处：paper-arxiv-2405.21060

## 研究资料与阅读入口

《Transformers are SSMs: Generalized Models and Efficient Algorithms Through Structured State Space Duality》；作者：Tri Dao, Albert Gu；年份：2024。目录标注为预印本，不能据此声称已通过同行评审。站内已提供完整原文；本页根据目录导读和原摘要建立知识入口，不将原文中的实验结果冒充本站实测。

出处：paper-arxiv-2405.21060

## 方法辨析与阅读重点

Mamba-2 从结构化状态空间对偶性讨论注意力与状态空间模型的联系。阅读重点是表示和算法结构，而不是把两种模型笼统视为同一个实现。效率结论应同时检查序列长度、硬件、精度和并行策略。

以上为基于该节点所引站内论文摘要的 Agent 整理；结果、证明及数值条件须回到原文核对。

## 原摘要与核对边界

While Transformers have been the main architecture behind deep learning's success in language modeling, state-space models (SSMs) such as Mamba have recently been shown to match or outperform Transformers at small to medium scale. We show that these families of models are actually quite closely related, and develop a rich framework of theoretical connections between SSMs and variants of attention, connected through various decompositions of a well-studied class of structured semiseparable matrices. Our state space duality (SSD) framework allows us to design a new architecture (Mamba-2) whose core layer is an a refinement of Mamba's selective SSM that is 2-8X faster, while continuing to be competitive with Transformers on language modeling.

出处：paper-arxiv-2405.21060

## 相关知识

[[deep-learning]]

[[index]]
