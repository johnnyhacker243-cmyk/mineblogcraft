---
kind: "node"
id: "timeseries-views"
title: "时间序列互补表征"
description: "结合折线图与归一化延迟嵌入两种互补表示，研究时间序列语言模型保留数值与时序结构的方式。 · 预印本"
category: "Modeling"
tags: ["时间序列","多模态","推理","预印本"]
parentIds: ["data-mining"]
status: "untracked"
frame: "task"
details: "结合折线图与归一化延迟嵌入两种互补表示，研究时间序列语言模型保留数值与时序结构的方式。 · 预印本"
learningPoints: ["幅值与时序结构分别由哪个视图保存", "归一化改变了哪些可辨识信息", "双视图收益是否来自互补性"]
relatedBlogs: []
relatedPapers: [{"id":"arxiv-2610.22327","title":"Twice Upon a Time: Complementary Representations for Time-Series Reasoning"}]
relatedRss: []
sources: [{"id":"paper-arxiv-2610.22327","kind":"paper","title":"Twice Upon a Time: Complementary Representations for Time-Series Reasoning","url":"#paper/arxiv-2610.22327","locator":"原始 PDF，共 24 页；下方摘要不是全文审读结论","excerpt":"Time Series Language Models (TSLMs) enable language-based understanding and reasoning over temporal data, yet a fundamental question remains: what information should their time-series representations preserve, and what variation should they factor out? Existing TSLMs typically expose the language model to a single representation, imposing a fixed inductive bias across downstream tasks. We instead introduce complementary representations as a design principle for time-series reasoning. Our model combines two visual views: line plots preserve absolute measurements and the observed coordinate frame, while normalized delay embeddings factor out positive amplitude rescaling and offsets while exposing temporal structure. Dedicated visual encoders integrate both views into a shared language model through visual tokens and multi-level feature fusion. Evaluation-time interventions verify that the two views exhibit distinct invariance profiles, while single-view ablations show that their combination is particularly beneficial beyond basic perception, with the large gains in prediction and reasoning. Built on Qwen3-VL-8B, our dual-view model improves overall TSRBench accuracy from 44.5% with line plots alone to 53.2%, substantially exceeding the strongest evaluated dedicated TSLM baseline at 36.7%. It further achieves 89.9% accuracy on TSExam and 86.8% numerical accuracy on multivariate ChatTS alignment. Together, these results demonstrate that complementary representations provide an effective design principle for general-purpose TSLMs, enabling models to exploit temporal structure without sacrificing access to the original measurement frame."}]
relatedNodeIds: ["data-mining"]
updated: "2026-10-17"
provenance: "agent-source-synthesis"
aliases: ["时间序列","多模态","推理"]
iconKey: "clock_00"
iconLabel: "时钟"
iconReason: "钟对应时间序列与坐标尺度"
icon: "/assets/inventory/wiki-icons/clock_00.png"
---
# 时间序列互补表征

## 研究问题

结合折线图与归一化延迟嵌入两种互补表示，研究时间序列语言模型保留数值与时序结构的方式。 · 预印本

出处：paper-arxiv-2610.22327

## 研究资料与阅读入口

《Twice Upon a Time: Complementary Representations for Time-Series Reasoning》；作者：Hedi Zisling, Liran Nochumsohn, Ilan Naiman, Mihir Parmar, Omri Azencot；年份：2026。目录标注为预印本，不能据此声称已通过同行评审。站内已提供完整原文；本页根据目录导读和原摘要建立知识入口，不将原文中的实验结果冒充本站实测。

出处：paper-arxiv-2610.22327

## 方法辨析与阅读重点

折线图保留原始量纲和观测坐标，归一化延迟嵌入强调时间结构并弱化幅值缩放及偏移。双视图不是简单增加输入数量，而是让互补的不变性共存。论文通过干预和单视图消融检验两类信息是否各自发挥作用。

以上为基于该节点所引站内论文摘要的 Agent 整理；结果、证明及数值条件须回到原文核对。

## 原摘要与核对边界

Time Series Language Models (TSLMs) enable language-based understanding and reasoning over temporal data, yet a fundamental question remains: what information should their time-series representations preserve, and what variation should they factor out? Existing TSLMs typically expose the language model to a single representation, imposing a fixed inductive bias across downstream tasks. We instead introduce complementary representations as a design principle for time-series reasoning. Our model combines two visual views: line plots preserve absolute measurements and the observed coordinate frame, while normalized delay embeddings factor out positive amplitude rescaling and offsets while exposing temporal structure. Dedicated visual encoders integrate both views into a shared language model through visual tokens and multi-level feature fusion. Evaluation-time interventions verify that the two views exhibit distinct invariance profiles, while single-view ablations show that their combination is particularly beneficial beyond basic perception, with the large gains in prediction and reasoning. Built on Qwen3-VL-8B, our dual-view model improves overall TSRBench accuracy from 44.5% with line plots alone to 53.2%, substantially exceeding the strongest evaluated dedicated TSLM baseline at 36.7%. It further achieves 89.9% accuracy on TSExam and 86.8% numerical accuracy on multivariate ChatTS alignment. Together, these results demonstrate that complementary representations provide an effective design principle for general-purpose TSLMs, enabling models to exploit temporal structure without sacrificing access to the original measurement frame.

出处：paper-arxiv-2610.22327

## 相关知识

[[data-mining]]

[[index]]
