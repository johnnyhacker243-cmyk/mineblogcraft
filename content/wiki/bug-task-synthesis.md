---
kind: "node"
id: "bug-task-synthesis"
title: "历史修复与任务合成"
description: "从历史缺陷修复中学习错误形成机制，将真实修复记录转化为可执行、可验证的软件工程评估任务。 · 预印本"
category: "Software"
tags: ["缺陷修复","测试生成","基准","预印本"]
parentIds: ["testing"]
status: "untracked"
frame: "task"
details: "从历史缺陷修复中学习错误形成机制，将真实修复记录转化为可执行、可验证的软件工程评估任务。 · 预印本"
learningPoints: ["历史修复怎样转换为可执行任务", "失败机制能否被测试稳定复现", "任务规模与真实性是否分别检验"]
relatedBlogs: []
relatedPapers: [{"id":"arxiv-2610.21359","title":"SWE-at-Scale: Scalable Issue Synthesis from Historical Bug Fixes"}]
relatedRss: []
sources: [{"id":"paper-arxiv-2610.21359","kind":"paper","title":"SWE-at-Scale: Scalable Issue Synthesis from Historical Bug Fixes","url":"#paper/arxiv-2610.21359","locator":"原始 PDF，共 15 页；下方摘要不是全文审读结论","excerpt":"As coding agents become increasingly capable, robust evaluation requires a broader and more diverse supply of verifiable software engineering (SWE) tasks. However, real-world tasks are constrained by the natural frequency of issue reporting and the substantial cost of manual curation. Furthermore, existing synthetic approaches rely primarily on the pretrained knowledge of large models coupled with heuristic prompting, often failing to capture the authentic, complex mechanics of software failures. To exponentially scale SWE task production, we introduce SWE-at-Scale, a framework that automatically synthesizes realistic issues by reverse-engineering real-world software fixes. Our key insight is that historical fixes encapsulate deep mechanistic knowledge of bug formation: inverting a fix transforms repair supervision into bug-induction supervision grounded in actual development scenarios. SWE-at-Scale transfers these learned bug patterns to novel code contexts, repeatedly sampling diverse bug typologies to construct executable SWE tasks. Extensive experiments show that SWE-at-Scale generates more diverse and realistic SWE tasks than current synthesis baselines while posing greater challenges to state-of-the-art coding agents. Notably, SWE-at-Scale can generate distinct bug types from a single code context, with bug diversity scaling robustly even up to 200 generations per file. Overall, SWE-at-Scale turns finite real-world fixes into reusable supervision for scalable synthesis of realistic, diverse, and challenging SWE tasks."}]
relatedNodeIds: ["testing"]
updated: "2026-10-17"
provenance: "agent-source-synthesis"
aliases: ["缺陷修复","测试生成","基准"]
iconKey: "writable_book"
iconLabel: "书与笔"
iconReason: "书与笔对应真实修复记录与复现任务"
icon: "/assets/inventory/wiki-icons/writable_book.png"
---
# 历史修复与任务合成

## 研究问题

从历史缺陷修复中学习错误形成机制，将真实修复记录转化为可执行、可验证的软件工程评估任务。 · 预印本

出处：paper-arxiv-2610.21359

## 研究资料与阅读入口

《SWE-at-Scale: Scalable Issue Synthesis from Historical Bug Fixes》；作者：Silin Chen, Zihan Zhang, Xiaodong Gu, Jiale Huang, Yuling Shi, Han Li, Zhao Shan, Chengcheng Wan, Zhensu Sun, Haibing Guan；年份：2026。目录标注为预印本，不能据此声称已通过同行评审。站内已提供完整原文；本页根据目录导读和原摘要建立知识入口，不将原文中的实验结果冒充本站实测。

出处：paper-arxiv-2610.21359

## 方法辨析与阅读重点

历史缺陷修复记录能够提供错误形成机制与修复证据，但转成评测任务时仍须构造可执行失败和成功条件。SWE-at-Scale 关注这一任务合成过程；合成数量与任务真实性应分别评价。

以上为基于该节点所引站内论文摘要的 Agent 整理；结果、证明及数值条件须回到原文核对。

## 原摘要与核对边界

As coding agents become increasingly capable, robust evaluation requires a broader and more diverse supply of verifiable software engineering (SWE) tasks. However, real-world tasks are constrained by the natural frequency of issue reporting and the substantial cost of manual curation. Furthermore, existing synthetic approaches rely primarily on the pretrained knowledge of large models coupled with heuristic prompting, often failing to capture the authentic, complex mechanics of software failures. To exponentially scale SWE task production, we introduce SWE-at-Scale, a framework that automatically synthesizes realistic issues by reverse-engineering real-world software fixes. Our key insight is that historical fixes encapsulate deep mechanistic knowledge of bug formation: inverting a fix transforms repair supervision into bug-induction supervision grounded in actual development scenarios. SWE-at-Scale transfers these learned bug patterns to novel code contexts, repeatedly sampling diverse bug typologies to construct executable SWE tasks. Extensive experiments show that SWE-at-Scale generates more diverse and realistic SWE tasks than current synthesis baselines while posing greater challenges to state-of-the-art coding agents. Notably, SWE-at-Scale can generate distinct bug types from a single code context, with bug diversity scaling robustly even up to 200 generations per file. Overall, SWE-at-Scale turns finite real-world fixes into reusable supervision for scalable synthesis of realistic, diverse, and challenging SWE tasks.

出处：paper-arxiv-2610.21359

## 相关知识

[[testing]]

[[index]]
