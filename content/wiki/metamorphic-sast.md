---
kind: "node"
id: "metamorphic-sast"
title: "蜕变与差分安全测试"
description: "将大语言模型生成的程序变体与动态反馈结合，用蜕变关系和差分报告检验静态安全分析工具。 · 预印本"
category: "Security"
tags: ["SAST","动态分析","蜕变测试","预印本"]
parentIds: ["vulnerability-scanning"]
status: "untracked"
frame: "task"
details: "将大语言模型生成的程序变体与动态反馈结合，用蜕变关系和差分报告检验静态安全分析工具。 · 预印本"
learningPoints: ["程序变体遵守哪些蜕变关系", "动态反馈验证什么执行事实", "报告差异如何判定为真实问题"]
relatedBlogs: []
relatedPapers: [{"id":"arxiv-2610.21309","title":"Combining LLM and Dynamic Analysis for Universal Testing of Static Application Security Testing Tools"}]
relatedRss: []
sources: [{"id":"paper-arxiv-2610.21309","kind":"paper","title":"Combining LLM and Dynamic Analysis for Universal Testing of Static Application Security Testing Tools","url":"#paper/arxiv-2610.21309","locator":"原始 PDF，共 21 页；下方摘要不是全文审读结论","excerpt":"Static application security testing (SAST) tools help detect potential software vulnerabilities, but they themselves contain faults undermining reliability and usability. Automated testing can address these issues, yet current techniques suffer from limited program transformation diversity and lack mechanisms to verify generated variants, leading to reduced fault detection and high manual effort. We present LLM4SAST, the first universal framework detecting faults in SAST tools using large language models and dynamic feedback. Our key insight is leveraging LLMs to understand and transform code in diverse programming languages. We design novel metamorphic relations with transformations to guide variant generation, using an LLM to produce multi-language variants that satisfy these relations. To reduce erroneous variants and identify unique faults, we propose two heuristics: dynamic-feedback-driven selection and program-differencing-based clustering. For each metamorphic relation, a report-centric test oracle detects variants that fail tests and identifies underlying faults by differentially analyzing SAST reports of the seed program and its variants. LLM4SAST identified 66 unique faults across six SAST tools, with 32 confirmed or fixed after being reported to developers, demonstrating effectiveness. The proposed heuristics eliminate 47.8% of false positives, and LLM4SAST detects 3.4 times more faults while requiring only 39.8% of the variants compared to existing approaches."}]
relatedNodeIds: ["vulnerability-scanning"]
updated: "2026-10-17"
provenance: "agent-source-synthesis"
aliases: ["SAST","动态分析","蜕变测试"]
iconKey: "comparator"
iconLabel: "红石比较器"
iconReason: "比较器对应程序变体的差分检查"
icon: "/assets/inventory/wiki-icons/comparator.png"
---
# 蜕变与差分安全测试

## 研究问题

将大语言模型生成的程序变体与动态反馈结合，用蜕变关系和差分报告检验静态安全分析工具。 · 预印本

出处：paper-arxiv-2610.21309

## 研究资料与阅读入口

《Combining LLM and Dynamic Analysis for Universal Testing of Static Application Security Testing Tools》；作者：Huaien Zhang, Yu Pei, Hao Chen, Shin Hwei Tan；年份：2026。目录标注为预印本，不能据此声称已通过同行评审。站内已提供完整原文；本页根据目录导读和原摘要建立知识入口，不将原文中的实验结果冒充本站实测。

出处：paper-arxiv-2610.21309

## 方法辨析与阅读重点

评估静态检测器本身也是测试问题。此研究结合语言模型生成的程序变体和动态反馈，用蜕变关系及差分报告检查工具行为。关键是先说明哪些语义应保持、哪些报告变化是合理的，避免把任意输出差异都称为检测器错误。

以上为基于该节点所引站内论文摘要的 Agent 整理；结果、证明及数值条件须回到原文核对。

## 原摘要与核对边界

Static application security testing (SAST) tools help detect potential software vulnerabilities, but they themselves contain faults undermining reliability and usability. Automated testing can address these issues, yet current techniques suffer from limited program transformation diversity and lack mechanisms to verify generated variants, leading to reduced fault detection and high manual effort. We present LLM4SAST, the first universal framework detecting faults in SAST tools using large language models and dynamic feedback. Our key insight is leveraging LLMs to understand and transform code in diverse programming languages. We design novel metamorphic relations with transformations to guide variant generation, using an LLM to produce multi-language variants that satisfy these relations. To reduce erroneous variants and identify unique faults, we propose two heuristics: dynamic-feedback-driven selection and program-differencing-based clustering. For each metamorphic relation, a report-centric test oracle detects variants that fail tests and identifies underlying faults by differentially analyzing SAST reports of the seed program and its variants. LLM4SAST identified 66 unique faults across six SAST tools, with 32 confirmed or fixed after being reported to developers, demonstrating effectiveness. The proposed heuristics eliminate 47.8% of false positives, and LLM4SAST detects 3.4 times more faults while requiring only 39.8% of the variants compared to existing approaches.

出处：paper-arxiv-2610.21309

## 相关知识

[[vulnerability-scanning]]

[[index]]
