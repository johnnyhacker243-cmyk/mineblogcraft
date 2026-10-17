---
kind: "node"
id: "rag-privacy"
title: "RAG 多查询隐私核算"
description: "梳理 RAG 从单次回答走向多次查询时的隐私核算，区分保护单位、核算范围与输出边界。 · 预印本"
category: "Security"
tags: ["RAG","差分隐私","隐私核算","预印本"]
parentIds: ["mcp-authorization"]
status: "untracked"
frame: "task"
details: "梳理 RAG 从单次回答走向多次查询时的隐私核算，区分保护单位、核算范围与输出边界。 · 预印本"
learningPoints: ["保护单位是记录、用户还是语料", "跨查询的信息暴露如何累积", "检索与生成的边界分别如何核算"]
relatedBlogs: []
relatedPapers: [{"id":"arxiv-2610.21245","title":"From One Query to Many: A Critical Survey of Privacy Accounting in RAG"}]
relatedRss: []
sources: [{"id":"paper-arxiv-2610.21245","kind":"paper","title":"From One Query to Many: A Critical Survey of Privacy Accounting in RAG","url":"#paper/arxiv-2610.21245","locator":"原始 PDF，共 11 页；下方摘要不是全文审读结论","excerpt":"Retrieval-augmented generation (RAG) enables large language models to leverage external knowledge but introduces privacy risks when the retrieved corpus contains sensitive information. Differential privacy (DP) offers formal protection, yet interpreting and comparing privacy guarantees across existing DP-RAG methods remains challenging. In particular, a privacy budget reported for a single response does not directly characterize privacy loss over repeated queries, and even identical values of $\\varepsilon$ may represent different guarantees depending on the protected data unit, accounting horizon, and observable outputs. This survey critically examines how privacy accounting evolves from single-query generation to multi-query RAG systems. We categorize existing approaches into query-time privatization, multi-query accounting, and one-time corpus privatization. We analyze their underlying assumptions and privacy--utility trade-offs. Rather than ranking methods by $\\varepsilon$ alone, we propose a framework that interprets a DP-RAG guarantee along three dimensions: privacy granularity, accounting scope, and release boundaries. We conclude that an $\\eps$ is a claim only together with the three slots: the protected unit, the accounting scope, and the release boundary."}]
relatedNodeIds: ["mcp-authorization"]
updated: "2026-10-17"
provenance: "agent-source-synthesis"
aliases: ["RAG","差分隐私","隐私核算"]
iconKey: "bundle"
iconLabel: "收纳袋"
iconReason: "收纳袋对应多次查询累积的信息暴露"
icon: "/assets/inventory/wiki-icons/bundle.png"
---
# RAG 多查询隐私核算

## 研究问题

梳理 RAG 从单次回答走向多次查询时的隐私核算，区分保护单位、核算范围与输出边界。 · 预印本

出处：paper-arxiv-2610.21245

## 研究资料与阅读入口

《From One Query to Many: A Critical Survey of Privacy Accounting in RAG》；作者：Zhiyuan Zhang；年份：2026。目录标注为预印本，不能据此声称已通过同行评审。站内已提供完整原文；本页根据目录导读和原摘要建立知识入口，不将原文中的实验结果冒充本站实测。

出处：paper-arxiv-2610.21245

## 方法辨析与阅读重点

多次检索与回答可能累积暴露信息。RAG 隐私核算需要先确定保护单位，再明确检索、生成与输出各阶段的核算范围。单次查询的保护声明不能直接扩展为无限次交互的保证。

以上为基于该节点所引站内论文摘要的 Agent 整理；结果、证明及数值条件须回到原文核对。

## 原摘要与核对边界

Retrieval-augmented generation (RAG) enables large language models to leverage external knowledge but introduces privacy risks when the retrieved corpus contains sensitive information. Differential privacy (DP) offers formal protection, yet interpreting and comparing privacy guarantees across existing DP-RAG methods remains challenging. In particular, a privacy budget reported for a single response does not directly characterize privacy loss over repeated queries, and even identical values of $\varepsilon$ may represent different guarantees depending on the protected data unit, accounting horizon, and observable outputs. This survey critically examines how privacy accounting evolves from single-query generation to multi-query RAG systems. We categorize existing approaches into query-time privatization, multi-query accounting, and one-time corpus privatization. We analyze their underlying assumptions and privacy--utility trade-offs. Rather than ranking methods by $\varepsilon$ alone, we propose a framework that interprets a DP-RAG guarantee along three dimensions: privacy granularity, accounting scope, and release boundaries. We conclude that an $\eps$ is a claim only together with the three slots: the protected unit, the accounting scope, and the release boundary.

出处：paper-arxiv-2610.21245

## 相关知识

[[mcp-authorization]]

[[index]]
