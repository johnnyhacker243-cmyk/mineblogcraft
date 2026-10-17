---
kind: "node"
id: "continual-learning"
title: "持续学习与遗忘"
description: "研究微调中的灾难性遗忘，通过限制权重更新的奇异子空间保护已有能力。 · 预印本"
category: "AI"
tags: ["持续学习","微调","遗忘","预印本"]
parentIds: ["deep-learning"]
status: "untracked"
frame: "task"
details: "研究微调中的灾难性遗忘，通过限制权重更新的奇异子空间保护已有能力。 · 预印本"
learningPoints: ["受保护的奇异方向怎样选取", "学习效果与遗忘之间的权衡", "子空间刷新及模型规模的影响"]
relatedBlogs: []
relatedPapers: [{"id":"arxiv-2610.22293","title":"Towards Continual Learning: Mitigating Forgetting With Subspace Tuning"}]
relatedRss: []
sources: [{"id":"paper-arxiv-2610.22293","kind":"paper","title":"Towards Continual Learning: Mitigating Forgetting With Subspace Tuning","url":"#paper/arxiv-2610.22293","locator":"原始 PDF，共 31 页；下方摘要不是全文审读结论","excerpt":"Large language models (LLMs) acquire new skills through fine-tuning, but it can destroy capabilities they already have: catastrophic forgetting remains a central obstacle to continual learning in LLMs. Recent works connect forgetting to how far, and along which directions, fine-tuning moves the weights. On-policy methods such as reinforcement learning and on-policy distillation avoid updating the principal singular directions of weight matrices and thus forget less. In contrast, SFT concentrates updates along these directions and is susceptible to catastrophic forgetting. In this work, we introduce Subspace Tuning (SST), which restricts each weight update to the bottom singular subspace, eliminating changes along the principal directions. SST is optimizer-agnostic and composes well with fine-tuning recipes including SFT and self-distillation. SST combines tight subspace protection, dense gradient estimation, and a simple refresh mechanism, enabling stronger learning than prior orthogonal fine-tuning methods. With these mechanisms, protecting as much as 99\\% of the weight subspace substantially improves retention while preserving strong target-task performance. This behavior strengthens with model and data size and nearly eliminates forgetting in the large-model regime. SST also keeps the model close to its base distribution, inducing $2$--$4\\times$ less KL drift than the baseline recipes. Overall, SST advances the learning--forgetting Pareto frontier, making it a practical default for fine-tuning pre-trained language models."}]
relatedNodeIds: ["deep-learning"]
updated: "2026-10-17"
provenance: "agent-source-synthesis"
aliases: ["持续学习","微调","遗忘"]
iconKey: "netherite_ingot"
iconLabel: "下界合金锭"
iconReason: "下界合金锭对应调整模型时保护已有能力"
icon: "/assets/inventory/wiki-icons/netherite_ingot.png"
---
# 持续学习与遗忘

## 研究问题

研究微调中的灾难性遗忘，通过限制权重更新的奇异子空间保护已有能力。 · 预印本

出处：paper-arxiv-2610.22293

## 研究资料与阅读入口

《Towards Continual Learning: Mitigating Forgetting With Subspace Tuning》；作者：Arnav Chavan, Kusha Sareen, Rishabh Tiwari, Abhranil Chandra, Johan Obando-Ceron, Kurt Keutzer, Scott Niekum, Inderjit S Dhillon, Devvrit Khatri；年份：2026。目录标注为预印本，不能据此声称已通过同行评审。站内已提供完整原文；本页根据目录导读和原摘要建立知识入口，不将原文中的实验结果冒充本站实测。

出处：paper-arxiv-2610.22293

## 方法辨析与阅读重点

微调既要学习新任务，也要控制既有能力的遗忘。Subspace Tuning 把更新限制在权重矩阵的低位奇异子空间，保护主要方向，并研究如何与不同优化器及微调配方组合。应同时报告新任务收益、旧能力保留与分布漂移，而不能只看新任务分数。

以上为基于该节点所引站内论文摘要的 Agent 整理；结果、证明及数值条件须回到原文核对。

## 原摘要与核对边界

Large language models (LLMs) acquire new skills through fine-tuning, but it can destroy capabilities they already have: catastrophic forgetting remains a central obstacle to continual learning in LLMs. Recent works connect forgetting to how far, and along which directions, fine-tuning moves the weights. On-policy methods such as reinforcement learning and on-policy distillation avoid updating the principal singular directions of weight matrices and thus forget less. In contrast, SFT concentrates updates along these directions and is susceptible to catastrophic forgetting. In this work, we introduce Subspace Tuning (SST), which restricts each weight update to the bottom singular subspace, eliminating changes along the principal directions. SST is optimizer-agnostic and composes well with fine-tuning recipes including SFT and self-distillation. SST combines tight subspace protection, dense gradient estimation, and a simple refresh mechanism, enabling stronger learning than prior orthogonal fine-tuning methods. With these mechanisms, protecting as much as 99\% of the weight subspace substantially improves retention while preserving strong target-task performance. This behavior strengthens with model and data size and nearly eliminates forgetting in the large-model regime. SST also keeps the model close to its base distribution, inducing $2$--$4\times$ less KL drift than the baseline recipes. Overall, SST advances the learning--forgetting Pareto frontier, making it a practical default for fine-tuning pre-trained language models.

出处：paper-arxiv-2610.22293

## 相关知识

[[deep-learning]]

[[index]]
