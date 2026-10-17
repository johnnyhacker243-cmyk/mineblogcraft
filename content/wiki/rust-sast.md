---
kind: "node"
id: "rust-sast"
title: "Rust 静态安全分析"
description: "评估真实 Rust 漏洞上的静态检测工具，并利用保持语义的程序变换测试检测器自身的可靠性。 · 预印本"
category: "Security"
tags: ["Rust","SAST","静态分析","预印本"]
parentIds: ["vulnerability-scanning"]
status: "untracked"
frame: "task"
details: "评估真实 Rust 漏洞上的静态检测工具，并利用保持语义的程序变换测试检测器自身的可靠性。 · 预印本"
learningPoints: ["真实漏洞样本覆盖什么类型", "语义保持变换是否改变检测结果", "工具配置与误报漏报如何记录"]
relatedBlogs: []
relatedPapers: [{"id":"arxiv-2610.21373","title":"Evaluating and Improving Static Application Security Testing Tools for Rust"}]
relatedRss: []
sources: [{"id":"paper-arxiv-2610.21373","kind":"paper","title":"Evaluating and Improving Static Application Security Testing Tools for Rust","url":"#paper/arxiv-2610.21373","locator":"原始 PDF，共 14 页；下方摘要不是全文审读结论","excerpt":"Rust has become a popular systems programming language in recent years because of its strong guarantees on memory and concurrency safety. Many types of system software have been re-implemented in Rust. However, Rust programs can still suffer from common memory and concurrency vulnerabilities due to unsafe code and misunderstandings of its complex mechanisms. To mitigate such vulnerabilities, developers often rely on static application security testing (SAST) tools. However, the effectiveness of existing Rust SAST tools on real-world vulnerabilities remains underexplored. In this paper, we first conduct an empirical evaluation of mainstream Rust SAST tools using security vulnerabilities identified in real-world Rust applications. We systematically assess their effectiveness, uncover common weaknesses, and analyze the root causes behind them. Motivated by the study, we propose TRUST, a large language model (LLM)-assisted automated testing framework. TRUST automatically analyzes the official Rust reference to derive and implement semantics-preserving transformations. It leverages these transformations to generate mutant programs for evaluating Rust SAST tools and uncovering potential faults within them. Overall, TRUST has revealed 46 faults across six popular SAST tools, 17 of which have been confirmed. In addition, our study yields ten empirical findings and four practical lessons that provide actionable guidance for developing more effective, robust, and maintainable Rust SAST tools."}]
relatedNodeIds: ["vulnerability-scanning"]
updated: "2026-10-17"
provenance: "agent-source-synthesis"
aliases: ["Rust","SAST","静态分析"]
iconKey: "iron_pickaxe"
iconLabel: "铁镐"
iconReason: "铁镐对应系统性检查真实缺陷"
icon: "/assets/inventory/wiki-icons/iron_pickaxe.png"
---
# Rust 静态安全分析

## 研究问题

评估真实 Rust 漏洞上的静态检测工具，并利用保持语义的程序变换测试检测器自身的可靠性。 · 预印本

出处：paper-arxiv-2610.21373

## 研究资料与阅读入口

《Evaluating and Improving Static Application Security Testing Tools for Rust》；作者：Huaien Zhang, Zhengjie Zhao, Yu Pei, Tian Dong, Minxue Pan, Shin Hwei Tan, Hao Chen；年份：2026。目录标注为预印本，不能据此声称已通过同行评审。站内已提供完整原文；本页根据目录导读和原摘要建立知识入口，不将原文中的实验结果冒充本站实测。

出处：paper-arxiv-2610.21373

## 方法辨析与阅读重点

Rust 静态安全分析的评价应落到真实漏洞及工具可理解的语义。保持语义的程序变换可以检验检测器是否对表面写法过敏，帮助揭示一个示例报告之外的稳定性问题。没有告警只能表明该工具在该输入和配置下未报告。

以上为基于该节点所引站内论文摘要的 Agent 整理；结果、证明及数值条件须回到原文核对。

## 原摘要与核对边界

Rust has become a popular systems programming language in recent years because of its strong guarantees on memory and concurrency safety. Many types of system software have been re-implemented in Rust. However, Rust programs can still suffer from common memory and concurrency vulnerabilities due to unsafe code and misunderstandings of its complex mechanisms. To mitigate such vulnerabilities, developers often rely on static application security testing (SAST) tools. However, the effectiveness of existing Rust SAST tools on real-world vulnerabilities remains underexplored. In this paper, we first conduct an empirical evaluation of mainstream Rust SAST tools using security vulnerabilities identified in real-world Rust applications. We systematically assess their effectiveness, uncover common weaknesses, and analyze the root causes behind them. Motivated by the study, we propose TRUST, a large language model (LLM)-assisted automated testing framework. TRUST automatically analyzes the official Rust reference to derive and implement semantics-preserving transformations. It leverages these transformations to generate mutant programs for evaluating Rust SAST tools and uncovering potential faults within them. Overall, TRUST has revealed 46 faults across six popular SAST tools, 17 of which have been confirmed. In addition, our study yields ten empirical findings and four practical lessons that provide actionable guidance for developing more effective, robust, and maintainable Rust SAST tools.

出处：paper-arxiv-2610.21373

## 相关知识

[[vulnerability-scanning]]

[[index]]
