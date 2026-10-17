---
kind: "node"
id: "rl-diversity"
title: "后训练与解法多样性"
description: "用质量多样性搜索建立解题策略档案，在强化学习后训练中同时关注正确率与正确解法的多样性。 · 预印本"
category: "AI"
tags: ["强化学习","GRPO","后训练","预印本"]
parentIds: ["machine-learning"]
status: "untracked"
frame: "task"
details: "用质量多样性搜索建立解题策略档案，在强化学习后训练中同时关注正确率与正确解法的多样性。 · 预印本"
learningPoints: ["档案怎样表示不同的正确策略", "回放与强化学习损失怎样组合", "多解覆盖与单次准确率是否一致"]
relatedBlogs: []
relatedPapers: [{"id":"arxiv-2610.22290","title":"EliteReplay: Preserving Diverse Solutions in RL Post-Training via Quality-Diversity Search"}]
relatedRss: []
sources: [{"id":"paper-arxiv-2610.22290","kind":"paper","title":"EliteReplay: Preserving Diverse Solutions in RL Post-Training via Quality-Diversity Search","url":"#paper/arxiv-2610.22290","locator":"原始 PDF，共 20 页；下方摘要不是全文审读结论","excerpt":"Reinforcement learning has become a common post-training technique to improve the accuracy of LLMs on verifiable tasks. However, such training can narrow the set of solutions the model can produce. Several approaches have attempted to address this behavior-sharpening effect, but they often optimize metrics that do not reflect the diversity of correct solutions. Ideally, we want a model that can produce multiple good solutions, not only a single reliable one. We propose EliteReplay, a post-training recipe that pairs GRPO with an \"elite\" archive built by quality-diversity search. Before training, we use the frozen base model to collect solutions that span distinct approaches; during training, GRPO is combined with a replay loss on this archive. The result is a post-trained model that improves accuracy while preserving more of the base model's solution diversity. On multiple text-to-SQL tasks, EliteReplay achieves a higher pass@128 than all baselines, producing up to 77% more distinct correct strategies than the strongest baselines. It preserves most of the base model's correct strategies, outperforming existing methods in strategy retention. This diversity translates into practical benefits on ambiguous questions, where EliteReplay covers both interpretations nearly twice as often as the strongest baseline on AmbiQT."}]
relatedNodeIds: ["machine-learning"]
updated: "2026-10-17"
provenance: "agent-source-synthesis"
aliases: ["强化学习","GRPO","后训练"]
iconKey: "firework_star"
iconLabel: "烟火之星"
iconReason: "烟火之星对应多样的有效解法"
icon: "/assets/inventory/wiki-icons/firework_star.png"
---
# 后训练与解法多样性

## 研究问题

用质量多样性搜索建立解题策略档案，在强化学习后训练中同时关注正确率与正确解法的多样性。 · 预印本

出处：paper-arxiv-2610.22290

## 研究资料与阅读入口

《EliteReplay: Preserving Diverse Solutions in RL Post-Training via Quality-Diversity Search》；作者：Hanane Nour Moussa, Doeun Lee, Sachin Kumar；年份：2026。目录标注为预印本，不能据此声称已通过同行评审。站内已提供完整原文；本页根据目录导读和原摘要建立知识入口，不将原文中的实验结果冒充本站实测。

出处：paper-arxiv-2610.22290

## 方法辨析与阅读重点

正确率提高时，模型仍可能只剩少数稳定解法。EliteReplay 先由冻结基座模型建立质量与多样性兼顾的策略档案，再把 GRPO 与档案回放损失结合。区分输出措辞变化与正确策略多样性，是理解这一研究的关键。

以上为基于该节点所引站内论文摘要的 Agent 整理；结果、证明及数值条件须回到原文核对。

## 原摘要与核对边界

Reinforcement learning has become a common post-training technique to improve the accuracy of LLMs on verifiable tasks. However, such training can narrow the set of solutions the model can produce. Several approaches have attempted to address this behavior-sharpening effect, but they often optimize metrics that do not reflect the diversity of correct solutions. Ideally, we want a model that can produce multiple good solutions, not only a single reliable one. We propose EliteReplay, a post-training recipe that pairs GRPO with an "elite" archive built by quality-diversity search. Before training, we use the frozen base model to collect solutions that span distinct approaches; during training, GRPO is combined with a replay loss on this archive. The result is a post-trained model that improves accuracy while preserving more of the base model's solution diversity. On multiple text-to-SQL tasks, EliteReplay achieves a higher pass@128 than all baselines, producing up to 77% more distinct correct strategies than the strongest baselines. It preserves most of the base model's correct strategies, outperforming existing methods in strategy retention. This diversity translates into practical benefits on ambiguous questions, where EliteReplay covers both interpretations nearly twice as often as the strongest baseline on AmbiQT.

出处：paper-arxiv-2610.22290

## 相关知识

[[machine-learning]]

[[index]]
