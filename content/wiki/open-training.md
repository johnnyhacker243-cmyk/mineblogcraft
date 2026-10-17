---
kind: "node"
id: "open-training"
title: "开放模型训练配方"
description: "OLMo 2 技术报告，公开模型、数据、训练配方与中间检查点，讨论训练稳定性及后训练方法。 · 预印本"
category: "AI"
tags: ["OLMo","开放模型","预训练","预印本"]
parentIds: ["machine-learning"]
status: "untracked"
frame: "task"
details: "OLMo 2 技术报告，公开模型、数据、训练配方与中间检查点，讨论训练稳定性及后训练方法。 · 预印本"
learningPoints: ["数据与中间检查点公开到何种粒度", "训练稳定性如何被记录", "预训练与后训练分别贡献什么"]
relatedBlogs: []
relatedPapers: [{"id":"arxiv-2501.00656","title":"2 OLMo 2 Furious"}]
relatedRss: []
sources: [{"id":"paper-arxiv-2501.00656","kind":"paper","title":"2 OLMo 2 Furious","url":"#paper/arxiv-2501.00656","locator":"原始 PDF，共 58 页；下方摘要不是全文审读结论","excerpt":"We present OLMo 2, the next generation of our fully open language models. OLMo 2 includes a family of dense autoregressive language models at 7B, 13B and 32B scales with fully released artifacts -- model weights, full training data, training code and recipes, training logs and thousands of intermediate checkpoints. In this work, we describe our modified model architecture and training recipe, focusing on techniques for achieving better training stability and improved per-token efficiency. Our updated pretraining data mixture introduces a new, specialized data mix called Dolmino Mix 1124, which significantly improves model capabilities across many downstream task benchmarks when introduced via late-stage curriculum training (i.e. specialized data during the annealing phase of pretraining). Finally, we incorporate best practices from Tülu 3 to develop OLMo 2-Instruct, focusing on permissive data and extending our final-stage reinforcement learning with verifiable rewards (RLVR). Our OLMo 2 base models sit at the Pareto frontier of performance to training compute, often matching or outperforming open-weight only models like Llama 3.1, Qwen 2.5, and Gemma 2 while using fewer FLOPs and with fully transparent training data, code, and recipe. Our fully open OLMo 2-Instruct models are competitive with open-weight only models of comparable size and even some proprietary models like GPT-3.5 Turbo and GPT 4o Mini."}]
relatedNodeIds: ["machine-learning"]
updated: "2026-10-17"
provenance: "agent-source-synthesis"
aliases: ["OLMo","开放模型","预训练"]
iconKey: "wheat_seeds"
iconLabel: "小麦种子"
iconReason: "种子对应可追溯数据和训练过程"
icon: "/assets/inventory/wiki-icons/wheat_seeds.png"
---
# 开放模型训练配方

## 研究问题

OLMo 2 技术报告，公开模型、数据、训练配方与中间检查点，讨论训练稳定性及后训练方法。 · 预印本

出处：paper-arxiv-2501.00656

## 研究资料与阅读入口

《2 OLMo 2 Furious》；作者：Team OLMo, Pete Walsh, Luca Soldaini, Dirk Groeneveld, Kyle Lo, Shane Arora, Akshita Bhagia, Yuling Gu, Shengyi Huang, Matt Jordan, Nathan Lambert, Dustin Schwenk, Oyvind Tafjord, Taira Anderson, David Atkinson, Faeze Brahman, Christopher Clark, Pradeep Dasigi, Nouha Dziri, Allyson Ettinger, Michal Guerquin, David Heineman, Hamish Ivison, Pang Wei Koh, Jiacheng Liu, Saumya Malik, William Merrill, Lester James V. Miranda, Jacob Morrison, Tyler Murray, Crystal Nam, Jake Poznanski, Valentina Pyatkin, Aman Rangapur, Michael Schmitz, Sam Skjonsberg, David Wadden, Christopher Wilhelm, Michael Wilson, Luke Zettlemoyer, Ali Farhadi, Noah A. Smith, Hannaneh Hajishirzi；年份：2024。目录标注为预印本，不能据此声称已通过同行评审。站内已提供完整原文；本页根据目录导读和原摘要建立知识入口，不将原文中的实验结果冒充本站实测。

出处：paper-arxiv-2501.00656

## 方法辨析与阅读重点

OLMo 2 技术报告不仅给出模型，也公开数据、训练配方和中间检查点。理解开放训练的价值，需要看外部研究者能够核对哪些步骤，而不是只比较最终分数。训练稳定性与后训练策略应在对应阶段分别讨论。

以上为基于该节点所引站内论文摘要的 Agent 整理；结果、证明及数值条件须回到原文核对。

## 原摘要与核对边界

We present OLMo 2, the next generation of our fully open language models. OLMo 2 includes a family of dense autoregressive language models at 7B, 13B and 32B scales with fully released artifacts -- model weights, full training data, training code and recipes, training logs and thousands of intermediate checkpoints. In this work, we describe our modified model architecture and training recipe, focusing on techniques for achieving better training stability and improved per-token efficiency. Our updated pretraining data mixture introduces a new, specialized data mix called Dolmino Mix 1124, which significantly improves model capabilities across many downstream task benchmarks when introduced via late-stage curriculum training (i.e. specialized data during the annealing phase of pretraining). Finally, we incorporate best practices from Tülu 3 to develop OLMo 2-Instruct, focusing on permissive data and extending our final-stage reinforcement learning with verifiable rewards (RLVR). Our OLMo 2 base models sit at the Pareto frontier of performance to training compute, often matching or outperforming open-weight only models like Llama 3.1, Qwen 2.5, and Gemma 2 while using fewer FLOPs and with fully transparent training data, code, and recipe. Our fully open OLMo 2-Instruct models are competitive with open-weight only models of comparable size and even some proprietary models like GPT-3.5 Turbo and GPT 4o Mini.

出处：paper-arxiv-2501.00656

## 相关知识

[[machine-learning]]

[[index]]
