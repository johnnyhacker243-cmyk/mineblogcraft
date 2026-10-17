---
kind: "node"
id: "graph-rag"
title: "图谱与全局检索"
description: "GraphRAG 原论文：以实体图谱和社区摘要回答面向整个语料库的全局问题，补充局部片段检索。 · 预印本"
category: "AI"
tags: ["GraphRAG","RAG","知识图谱","预印本"]
parentIds: ["rag"]
status: "untracked"
frame: "task"
details: "GraphRAG 原论文：以实体图谱和社区摘要回答面向整个语料库的全局问题，补充局部片段检索。 · 预印本"
learningPoints: ["局部事实问题与全局主题问题的差异", "实体图与社区摘要承担什么角色", "汇总答案如何回到原始来源"]
relatedBlogs: []
relatedPapers: [{"id":"arxiv-2404.16130","title":"From Local to Global: A Graph RAG Approach to Query-Focused Summarization"}]
relatedRss: []
sources: [{"id":"paper-arxiv-2404.16130","kind":"paper","title":"From Local to Global: A Graph RAG Approach to Query-Focused Summarization","url":"#paper/arxiv-2404.16130","locator":"原始 PDF，共 26 页；下方摘要不是全文审读结论","excerpt":"The use of retrieval-augmented generation (RAG) to retrieve relevant information from an external knowledge source enables large language models (LLMs) to answer questions over private and/or previously unseen document collections. However, RAG fails on global questions directed at an entire text corpus, such as \"What are the main themes in the dataset?\", since this is inherently a query-focused summarization (QFS) task, rather than an explicit retrieval task. Prior QFS methods, meanwhile, do not scale to the quantities of text indexed by typical RAG systems. To combine the strengths of these contrasting methods, we propose GraphRAG, a graph-based approach to question answering over private text corpora that scales with both the generality of user questions and the quantity of source text. Our approach uses an LLM to build a graph index in two stages: first, to derive an entity knowledge graph from the source documents, then to pregenerate community summaries for all groups of closely related entities. Given a question, each community summary is used to generate a partial response, before all partial responses are again summarized in a final response to the user. For a class of global sensemaking questions over datasets in the 1 million token range, we show that GraphRAG leads to substantial improvements over a conventional RAG baseline for both the comprehensiveness and diversity of generated answers."}]
relatedNodeIds: ["rag"]
updated: "2026-10-17"
provenance: "agent-source-synthesis"
aliases: ["GraphRAG","RAG","知识图谱"]
iconKey: "map"
iconLabel: "地图"
iconReason: "地图对应全局实体关系与社区摘要"
icon: "/assets/inventory/wiki-icons/map.png"
---
# 图谱与全局检索

## 研究问题

GraphRAG 原论文：以实体图谱和社区摘要回答面向整个语料库的全局问题，补充局部片段检索。 · 预印本

出处：paper-arxiv-2404.16130

## 研究资料与阅读入口

《From Local to Global: A Graph RAG Approach to Query-Focused Summarization》；作者：Darren Edge, Ha Trinh, Newman Cheng, Joshua Bradley, Alex Chao, Apurva Mody, Steven Truitt, Dasha Metropolitansky, Robert Osazuwa Ness, Jonathan Larson；年份：2024。目录标注为预印本，不能据此声称已通过同行评审。站内已提供完整原文；本页根据目录导读和原摘要建立知识入口，不将原文中的实验结果冒充本站实测。

出处：paper-arxiv-2404.16130

## 方法辨析与阅读重点

局部片段检索擅长回答具体事实，却可能遗漏跨语料的整体主题。GraphRAG 通过实体关系图与社区摘要组织资料，服务面向全局的查询。图谱及社区摘要仍需追溯到来源，不能把生成摘要本身视为原始事实。

以上为基于该节点所引站内论文摘要的 Agent 整理；结果、证明及数值条件须回到原文核对。

## 原摘要与核对边界

The use of retrieval-augmented generation (RAG) to retrieve relevant information from an external knowledge source enables large language models (LLMs) to answer questions over private and/or previously unseen document collections. However, RAG fails on global questions directed at an entire text corpus, such as "What are the main themes in the dataset?", since this is inherently a query-focused summarization (QFS) task, rather than an explicit retrieval task. Prior QFS methods, meanwhile, do not scale to the quantities of text indexed by typical RAG systems. To combine the strengths of these contrasting methods, we propose GraphRAG, a graph-based approach to question answering over private text corpora that scales with both the generality of user questions and the quantity of source text. Our approach uses an LLM to build a graph index in two stages: first, to derive an entity knowledge graph from the source documents, then to pregenerate community summaries for all groups of closely related entities. Given a question, each community summary is used to generate a partial response, before all partial responses are again summarized in a final response to the user. For a class of global sensemaking questions over datasets in the 1 million token range, we show that GraphRAG leads to substantial improvements over a conventional RAG baseline for both the comprehensiveness and diversity of generated answers.

出处：paper-arxiv-2404.16130

## 相关知识

[[rag]]

[[index]]
