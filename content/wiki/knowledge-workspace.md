---
kind: "node"
id: "knowledge-workspace"
title: "长文档知识工作空间"
description: "让智能体预先整理长文档为可复用的层级工作空间，以后续问答表现训练知识组织策略。 · 预印本"
category: "AI"
tags: ["Agent","长上下文","知识组织","RAG","预印本"]
parentIds: ["agent-memory"]
status: "untracked"
frame: "task"
details: "让智能体预先整理长文档为可复用的层级工作空间，以后续问答表现训练知识组织策略。 · 预印本"
learningPoints: ["构建者与回答者承担什么责任", "文件引用如何保留原始证据", "预处理成本能否被多次查询摊薄"]
relatedBlogs: []
relatedPapers: [{"id":"arxiv-2610.22273","title":"Librarian Agents: Training LLMs to Curate Long-Context Workspaces that Anticipate Future Queries"}]
relatedRss: []
sources: [{"id":"paper-arxiv-2610.22273","kind":"paper","title":"Librarian Agents: Training LLMs to Curate Long-Context Workspaces that Anticipate Future Queries","url":"#paper/arxiv-2610.22273","locator":"原始 PDF，共 24 页；下方摘要不是全文审读结论","excerpt":"Reasoning over long document contexts remains a challenge for large language models (LLMs). Standard retrieval methods are inherently reactive, bottlenecking agents with complex, cross-document reasoning at inference time, while precomputed structures like knowledge graphs often fall short because they rely on rigid heuristics. Instead, can we allow agents to perform anticipatory directed curation: learning to proactively reorganize unstructured corpora prior to inference to efficiently serve diverse future queries. We build on a key asymmetry in modern agentic harnesses (e.g., Claude Code): while LLM agents are adept at navigating existing filesystems to solve an immediate task, they are rarely trained to construct reusable workspaces for future use. To instantiate this capability, we introduce Librarian Agents, a framework in which a builder agent transforms raw documents into a hierarchical filesystem of synthetic files and reference links, which forms a workspace tailored for a downstream answering agent. We formulate workspace construction as a Markov decision process and optimize the builder policy via reinforcement learning to directly maximize downstream answering accuracy. Empirically, Librarian Agents outperforms the strongest retrieval and precomputation baselines by 33 percentage points on BrowseComp-Plus, amortizes upfront construction costs across repeated queries, and generalizes zero-shot to unseen domains on BRIGHT with a 31-point average accuracy improvement."}]
relatedNodeIds: ["agent-memory"]
updated: "2026-10-17"
provenance: "agent-source-synthesis"
aliases: ["Agent","长上下文","知识组织","RAG"]
iconKey: "book"
iconLabel: "书"
iconReason: "书对应可复用的层级知识组织"
icon: "/assets/inventory/wiki-icons/book.png"
---
# 长文档知识工作空间

## 研究问题

让智能体预先整理长文档为可复用的层级工作空间，以后续问答表现训练知识组织策略。 · 预印本

出处：paper-arxiv-2610.22273

## 研究资料与阅读入口

《Librarian Agents: Training LLMs to Curate Long-Context Workspaces that Anticipate Future Queries》；作者：Anikait Singh, Teresa Zhang, Yoonho Lee, Roshen Sanjay Nair, Aviral Kumar, Chelsea Finn；年份：2026。目录标注为预印本，不能据此声称已通过同行评审。站内已提供完整原文；本页根据目录导读和原摘要建立知识入口，不将原文中的实验结果冒充本站实测。

出处：paper-arxiv-2610.22273

## 方法辨析与阅读重点

Librarian Agents 把整理长文档本身视为可学习任务：构建者生成带引用的层级文件工作空间，回答者随后使用它。整理策略依据下游问答表现优化。预先组织知识需要付出构建成本，其价值应在重复查询和跨领域泛化中评估。

以上为基于该节点所引站内论文摘要的 Agent 整理；结果、证明及数值条件须回到原文核对。

## 原摘要与核对边界

Reasoning over long document contexts remains a challenge for large language models (LLMs). Standard retrieval methods are inherently reactive, bottlenecking agents with complex, cross-document reasoning at inference time, while precomputed structures like knowledge graphs often fall short because they rely on rigid heuristics. Instead, can we allow agents to perform anticipatory directed curation: learning to proactively reorganize unstructured corpora prior to inference to efficiently serve diverse future queries. We build on a key asymmetry in modern agentic harnesses (e.g., Claude Code): while LLM agents are adept at navigating existing filesystems to solve an immediate task, they are rarely trained to construct reusable workspaces for future use. To instantiate this capability, we introduce Librarian Agents, a framework in which a builder agent transforms raw documents into a hierarchical filesystem of synthetic files and reference links, which forms a workspace tailored for a downstream answering agent. We formulate workspace construction as a Markov decision process and optimize the builder policy via reinforcement learning to directly maximize downstream answering accuracy. Empirically, Librarian Agents outperforms the strongest retrieval and precomputation baselines by 33 percentage points on BrowseComp-Plus, amortizes upfront construction costs across repeated queries, and generalizes zero-shot to unseen domains on BRIGHT with a 31-point average accuracy improvement.

出处：paper-arxiv-2610.22273

## 相关知识

[[agent-memory]]

[[index]]
