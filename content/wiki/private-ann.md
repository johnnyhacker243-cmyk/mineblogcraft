---
kind: "node"
id: "private-ann"
title: "私有近邻检索"
description: "Amora 通过分区图索引与私有信息检索，研究向量数据库近邻查询的隐私保护和通信开销。 · 预印本"
category: "Security"
tags: ["PIR","向量数据库","隐私检索","预印本"]
parentIds: ["mcp-authorization"]
status: "untracked"
frame: "task"
details: "Amora 通过分区图索引与私有信息检索，研究向量数据库近邻查询的隐私保护和通信开销。 · 预印本"
learningPoints: ["查询隐私保护了哪些参与方信息", "近似质量与图分区怎样关联", "通信量和隐私条件是否可比"]
relatedBlogs: []
relatedPapers: [{"id":"arxiv-2610.21174","title":"Amora: Communication-Efficient Private Approximate Nearest Neighbors Search"}]
relatedRss: []
sources: [{"id":"paper-arxiv-2610.21174","kind":"paper","title":"Amora: Communication-Efficient Private Approximate Nearest Neighbors Search","url":"#paper/arxiv-2610.21174","locator":"原始 PDF，共 15 页；下方摘要不是全文审读结论","excerpt":"Approximate nearest neighbors search (ANNS) over cloud-hosted vector databases raises a critical privacy concern: the query vector, which often encodes sensitive user intent, is exposed to the server. Private ANNS (PANNS) allows a client to retrieve nearest neighbors without revealing its query. The state-of-the-art single-server scheme, Pacmann (ICLR'25), achieves high accuracy via graph-based search with private information retrieval (PIR), but incurs substantial communication overhead because each PIR query retrieves only a single vertex. We present Amora, a communication-efficient PANNS system that applies SimplePIR to a partitioned graph index so that one PIR query is amortized over many vertices. To retrieve as much of the distance and neighbor information the search needs under a limited communication budget, Amora adopts a dual-PIR split layout with two heterogeneous PIR matrices that stay balanced in dimension: VecPIR retrieves inner products for an entire partition of vertices as their distance at once, while NbrPIR retrieves necessary neighbor lists at subgroup granularity for graph traversal. This layout shifts the cost model of PIR query from per-vertex to per-partition, which significantly reduces the communication overhead. To further improve efficiency by reducing the number of scans and query rounds in the PIR database, Amora introduces batch PIR to pack multiple queries into one matrix multiplication, centroid-based pruning to filter unpromising partitions, and TopCand exploration that seeds jump-style graph navigation with the closest vertices from each retrieved partition. We evaluate Amora on five datasets spanning 96 to 1024 dimensions and up to 10 million vectors. Compared to Pacmann, Amora reduces online communication by 93--99% while achieving higher search accuracy."}]
relatedNodeIds: ["mcp-authorization"]
updated: "2026-10-17"
provenance: "agent-source-synthesis"
aliases: ["PIR","向量数据库","隐私检索"]
iconKey: "ender_pearl"
iconLabel: "末影珍珠"
iconReason: "末影珍珠对应隐私保护下的近邻定位"
icon: "/assets/inventory/wiki-icons/ender_pearl.png"
---
# 私有近邻检索

## 研究问题

Amora 通过分区图索引与私有信息检索，研究向量数据库近邻查询的隐私保护和通信开销。 · 预印本

出处：paper-arxiv-2610.21174

## 研究资料与阅读入口

《Amora: Communication-Efficient Private Approximate Nearest Neighbors Search》；作者：Qiuhao Wang, Zuowei Chen, Xu Yang, Saiyu Qi, Yong Qi；年份：2026。目录标注为预印本，不能据此声称已通过同行评审。站内已提供完整原文；本页根据目录导读和原摘要建立知识入口，不将原文中的实验结果冒充本站实测。

出处：paper-arxiv-2610.21174

## 方法辨析与阅读重点

近邻检索不仅关心返回结果，也可能暴露查询意图。Amora 结合分区图索引和私有信息检索研究通信效率。比较时需要把近似检索质量、隐私威胁模型与通信开销放在同一实验条件下。

以上为基于该节点所引站内论文摘要的 Agent 整理；结果、证明及数值条件须回到原文核对。

## 原摘要与核对边界

Approximate nearest neighbors search (ANNS) over cloud-hosted vector databases raises a critical privacy concern: the query vector, which often encodes sensitive user intent, is exposed to the server. Private ANNS (PANNS) allows a client to retrieve nearest neighbors without revealing its query. The state-of-the-art single-server scheme, Pacmann (ICLR'25), achieves high accuracy via graph-based search with private information retrieval (PIR), but incurs substantial communication overhead because each PIR query retrieves only a single vertex. We present Amora, a communication-efficient PANNS system that applies SimplePIR to a partitioned graph index so that one PIR query is amortized over many vertices. To retrieve as much of the distance and neighbor information the search needs under a limited communication budget, Amora adopts a dual-PIR split layout with two heterogeneous PIR matrices that stay balanced in dimension: VecPIR retrieves inner products for an entire partition of vertices as their distance at once, while NbrPIR retrieves necessary neighbor lists at subgroup granularity for graph traversal. This layout shifts the cost model of PIR query from per-vertex to per-partition, which significantly reduces the communication overhead. To further improve efficiency by reducing the number of scans and query rounds in the PIR database, Amora introduces batch PIR to pack multiple queries into one matrix multiplication, centroid-based pruning to filter unpromising partitions, and TopCand exploration that seeds jump-style graph navigation with the closest vertices from each retrieved partition. We evaluate Amora on five datasets spanning 96 to 1024 dimensions and up to 10 million vectors. Compared to Pacmann, Amora reduces online communication by 93--99% while achieving higher search accuracy.

出处：paper-arxiv-2610.21174

## 相关知识

[[mcp-authorization]]

[[index]]
