---
kind: "node"
id: "model-routing"
title: "弱强模型路由"
description: "以弱模型和强模型回答之间的分歧指导请求路由，分析无需真实标签时的成本与准确性权衡。 · 预印本"
category: "AI"
tags: ["模型路由","推理成本","弱到强","预印本"]
parentIds: ["llm"]
status: "untracked"
frame: "task"
details: "以弱模型和强模型回答之间的分歧指导请求路由，分析无需真实标签时的成本与准确性权衡。 · 预印本"
learningPoints: ["分歧信号与正确性标签的区别", "强模型作为代理的条件", "多次弱模型采样与一次升级的成本"]
relatedBlogs: []
relatedPapers: [{"id":"arxiv-2610.22245","title":"Disagreement-Guided Weak-to-Strong Routing"}]
relatedRss: []
sources: [{"id":"paper-arxiv-2610.22245","kind":"paper","title":"Disagreement-Guided Weak-to-Strong Routing","url":"#paper/arxiv-2610.22245","locator":"原始 PDF，共 34 页；下方摘要不是全文审读结论","excerpt":"Small language models are increasingly deployed on edge devices and robotic systems to meet cost and latency constraints, yet their limited capabilities can make reliable deployment challenging. Stronger models can provide assistance when needed, but deciding when to route a weak-model response to a stronger model often relies on signals of response correctness. In open-ended and agentic tasks, however, obtaining such signals can require costly ground-truth supervision that is difficult to obtain at scale. We revisit the foundations of weak-to-strong routing and ask whether routing decisions can instead be guided by signals that do not require ground-truth supervision. We first characterize the optimal weak-to-strong routing policy, while allowing for multiple weak-model responses generated through local inference. Building on this characterization, we derive a principled approximation to the optimal routing based on model-to-model comparison. In particular, we introduce a notion of model disagreement that can be measured directly from model-generated responses, without ground-truth supervision. Importantly, the approximation becomes increasingly accurate as the strong model becomes a better proxy for the ground-truth distribution. Across agentic and single-turn tasks, our approach effectively navigates the trade-off between routing cost and response accuracy without ground-truth supervision. Moreover, even when ground-truth correctness signals are available for training, disagreement-based routing can outperform methods trained directly to predict correctness"}]
relatedNodeIds: ["llm"]
updated: "2026-10-17"
provenance: "agent-source-synthesis"
aliases: ["模型路由","推理成本","弱到强"]
iconKey: "repeater"
iconLabel: "红石中继器"
iconReason: "中继器对应选择处理请求的模型"
icon: "/assets/inventory/wiki-icons/repeater.png"
---
# 弱强模型路由

## 研究问题

以弱模型和强模型回答之间的分歧指导请求路由，分析无需真实标签时的成本与准确性权衡。 · 预印本

出处：paper-arxiv-2610.22245

## 研究资料与阅读入口

《Disagreement-Guided Weak-to-Strong Routing》；作者：Sima Noorani, Shayan Kiyani, George Pappas, Hamed Hassani；年份：2026。目录标注为预印本，不能据此声称已通过同行评审。站内已提供完整原文；本页根据目录导读和原摘要建立知识入口，不将原文中的实验结果冒充本站实测。

出处：paper-arxiv-2610.22245

## 方法辨析与阅读重点

弱强模型路由需要判断何时值得支付更高成本。该研究使用模型回答之间的分歧作为不依赖真实标签的信号，并讨论强模型近似真实分布时的条件。分歧不是事实真值，路由策略要同时考察成本、准确性和适用任务。

以上为基于该节点所引站内论文摘要的 Agent 整理；结果、证明及数值条件须回到原文核对。

## 原摘要与核对边界

Small language models are increasingly deployed on edge devices and robotic systems to meet cost and latency constraints, yet their limited capabilities can make reliable deployment challenging. Stronger models can provide assistance when needed, but deciding when to route a weak-model response to a stronger model often relies on signals of response correctness. In open-ended and agentic tasks, however, obtaining such signals can require costly ground-truth supervision that is difficult to obtain at scale. We revisit the foundations of weak-to-strong routing and ask whether routing decisions can instead be guided by signals that do not require ground-truth supervision. We first characterize the optimal weak-to-strong routing policy, while allowing for multiple weak-model responses generated through local inference. Building on this characterization, we derive a principled approximation to the optimal routing based on model-to-model comparison. In particular, we introduce a notion of model disagreement that can be measured directly from model-generated responses, without ground-truth supervision. Importantly, the approximation becomes increasingly accurate as the strong model becomes a better proxy for the ground-truth distribution. Across agentic and single-turn tasks, our approach effectively navigates the trade-off between routing cost and response accuracy without ground-truth supervision. Moreover, even when ground-truth correctness signals are available for training, disagreement-based routing can outperform methods trained directly to predict correctness

出处：paper-arxiv-2610.22245

## 相关知识

[[llm]]

[[index]]
