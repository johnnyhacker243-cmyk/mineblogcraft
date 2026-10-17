---
kind: "node"
id: "expert-distillation"
title: "多任务专家蒸馏"
description: "先训练各项视觉能力专家，再用技能引导的在策略蒸馏整合能力，研究多任务干扰与奖励偏差。 · 预印本"
category: "AI"
tags: ["VLM","蒸馏","多模态","预印本"]
parentIds: ["deep-learning"]
status: "untracked"
frame: "task"
details: "先训练各项视觉能力专家，再用技能引导的在策略蒸馏整合能力，研究多任务干扰与奖励偏差。 · 预印本"
learningPoints: ["技能拆分与专家训练的依据", "在策略蒸馏如何选择学习信号", "整合后各子任务是否分别保留能力"]
relatedBlogs: []
relatedPapers: [{"id":"arxiv-2610.22217","title":"Skill-Decoupled On-Policy Expert Distillation for Unified Vision-Language Models"}]
relatedRss: []
sources: [{"id":"paper-arxiv-2610.22217","kind":"paper","title":"Skill-Decoupled On-Policy Expert Distillation for Unified Vision-Language Models","url":"#paper/arxiv-2610.22217","locator":"原始 PDF，共 33 页；下方摘要不是全文审读结论","excerpt":"Reinforcement learning (RL) can elicit specialized visual capabilities in vision-language models (VLMs), yet jointly optimizing heterogeneous objectives often introduces cross-capability gradient conflicts. Training experts independently mitigates this interference, but direct reward optimization may entangle specialized knowledge with reward-hacking biases. This paper proposes Skill-Decoupled On-Policy Expert Distillation (SCOPED), which trains capability-specific experts and extracts explicit skills through reward-guided reflection. During on-policy distillation, these skills guide expert supervision while remaining unavailable to the unified student, encouraging it to internalize procedural knowledge without explicit skills at inference time. Across eight multimodal benchmarks, SCOPED consistently outperforms the backbone and mixed-capability RL, demonstrating the effectiveness of skill-decoupled on-policy expert distillation for integrating independently acquired capabilities. Further analyses reveal interference during joint capability optimization and suggest that skill augmentation promotes more consistent expert trajectories, greater attention to task-relevant visual evidence, and better preservation of specialized expertise in the unified student. All code and data are available at https://github.com/NEUIR/SCOPED."}]
relatedNodeIds: ["deep-learning"]
updated: "2026-10-17"
provenance: "agent-source-synthesis"
aliases: ["VLM","蒸馏","多模态"]
iconKey: "glass_bottle"
iconLabel: "玻璃瓶"
iconReason: "玻璃瓶对应从多个专家提取能力"
icon: "/assets/inventory/wiki-icons/glass_bottle.png"
---
# 多任务专家蒸馏

## 研究问题

先训练各项视觉能力专家，再用技能引导的在策略蒸馏整合能力，研究多任务干扰与奖励偏差。 · 预印本

出处：paper-arxiv-2610.22217

## 研究资料与阅读入口

《Skill-Decoupled On-Policy Expert Distillation for Unified Vision-Language Models》；作者：Yuqi Xiong, Chunyi Peng, Zhipeng Xu, Qing Yang, Zhenghao Liu, Zulong Chen, Yu Gu, Ge Yu；年份：2026。目录标注为预印本，不能据此声称已通过同行评审。站内已提供完整原文；本页根据目录导读和原摘要建立知识入口，不将原文中的实验结果冒充本站实测。

出处：paper-arxiv-2610.22217

## 方法辨析与阅读重点

多个视觉任务共享一个模型时可能互相干扰。研究先为不同技能训练专家，再用技能引导的在策略蒸馏整合到统一模型。需要区分技能保留、跨任务迁移以及奖励偏差，不能用一个汇总分数掩盖个别能力退化。

以上为基于该节点所引站内论文摘要的 Agent 整理；结果、证明及数值条件须回到原文核对。

## 原摘要与核对边界

Reinforcement learning (RL) can elicit specialized visual capabilities in vision-language models (VLMs), yet jointly optimizing heterogeneous objectives often introduces cross-capability gradient conflicts. Training experts independently mitigates this interference, but direct reward optimization may entangle specialized knowledge with reward-hacking biases. This paper proposes Skill-Decoupled On-Policy Expert Distillation (SCOPED), which trains capability-specific experts and extracts explicit skills through reward-guided reflection. During on-policy distillation, these skills guide expert supervision while remaining unavailable to the unified student, encouraging it to internalize procedural knowledge without explicit skills at inference time. Across eight multimodal benchmarks, SCOPED consistently outperforms the backbone and mixed-capability RL, demonstrating the effectiveness of skill-decoupled on-policy expert distillation for integrating independently acquired capabilities. Further analyses reveal interference during joint capability optimization and suggest that skill augmentation promotes more consistent expert trajectories, greater attention to task-relevant visual evidence, and better preservation of specialized expertise in the unified student. All code and data are available at https://github.com/NEUIR/SCOPED.

出处：paper-arxiv-2610.22217

## 相关知识

[[deep-learning]]

[[index]]
