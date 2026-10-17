---
kind: "node"
id: "vector-database"
title: "Vector Database"
category: "AI"
description: "检索向量与元数据过滤"
tags: ["Vector Database","检索向量与元数据过滤"]
icon: "/assets/inventory/wiki-icons/ender_eye.png"
parentIds: ["rag"]
status: "untracked"
frame: "goal"
details: "向量检索系统存储嵌入与元数据，并按距离或相似度召回候选。嵌入模型版本、距离定义和过滤条件需要一致，检索命中不能单独证明内容正确。"
learningPoints: ["保存文本段落、来源与嵌入版本","检查召回与过滤后的实际证据","在重建索引和内容更新之间保持一致性"]
relatedBlogs: []
relatedPapers: []
aliases: ["向量数据库"]
domainId: "ai"
relatedRss: []
sources: []
relatedNodeIds: ["rag"]
updated: "2026-10-17"
provenance: "legacy-concept-note"
iconKey: "ender_eye"
iconReason: "末影之眼对应向量空间中的邻近定位"
iconLabel: "末影之眼"
---
# Vector Database

## 概念与适用边界

向量检索系统存储嵌入与元数据，并按距离或相似度召回候选。嵌入模型版本、距离定义和过滤条件需要一致，检索命中不能单独证明内容正确。

## 资料边界

这是从既有 Wiki 保留的基础概念说明。当前收录的博客、论文和 RSS 中没有足够直接证据展开该节点；不补造个人实践、公式推导或研究结果。后续补充资料后再扩展。

## 相关知识

[[rag]]

[[index]]
