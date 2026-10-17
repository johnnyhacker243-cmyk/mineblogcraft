---
kind: "node"
id: "embedding-leakage"
title: "嵌入与身份泄漏"
description: "研究推荐系统的语言嵌入如何泄露物品身份，并分析辅助文本、用户重识别和效用之间的关系。 · 预印本"
category: "Security"
tags: ["嵌入隐私","推荐系统","重识别","预印本"]
parentIds: ["network"]
status: "untracked"
frame: "task"
details: "研究推荐系统的语言嵌入如何泄露物品身份，并分析辅助文本、用户重识别和效用之间的关系。 · 预印本"
learningPoints: ["攻击者拥有何种辅助信息", "物品身份恢复与用户重识别的关系", "隐私保护与推荐效用怎样权衡"]
relatedBlogs: []
relatedPapers: [{"id":"arxiv-2610.21713","title":"Encoded but Exposed: Language Embeddings can Reveal More Than They Should in Recommender Systems"}]
relatedRss: []
sources: [{"id":"paper-arxiv-2610.21713","kind":"paper","title":"Encoded but Exposed: Language Embeddings can Reveal More Than They Should in Recommender Systems","url":"#paper/arxiv-2610.21713","locator":"原始 PDF，共 10 页；下方摘要不是全文审读结论","excerpt":"Language embeddings are increasingly used in recommenders to represent item content, but their privacy risks remain poorly understood. We study whether item embeddings can reveal item identities when an adversary has access to auxiliary item text from external sources. We show that a simple cosine-similarity attack can recover item identities with high mean reciprocal rank across language models and candidate-set settings on two real-world datasets. Leakage is strongest when the adversary's partial information overlaps with the victim representation, but it also persists through semantic alignment between independently sourced descriptions. We further show that item leakage can propagate to user re-identification from sparse ratings. Finally, we evaluate obfuscated descriptions as a mitigation and find a clear leakage-utility tradeoff."}]
relatedNodeIds: ["network"]
updated: "2026-10-17"
provenance: "agent-source-synthesis"
aliases: ["嵌入隐私","推荐系统","重识别"]
iconKey: "ender_eye"
iconLabel: "末影之眼"
iconReason: "末影之眼对应向量表征中的身份线索"
icon: "/assets/inventory/wiki-icons/ender_eye.png"
---
# 嵌入与身份泄漏

## 研究问题

研究推荐系统的语言嵌入如何泄露物品身份，并分析辅助文本、用户重识别和效用之间的关系。 · 预印本

出处：paper-arxiv-2610.21713

## 研究资料与阅读入口

《Encoded but Exposed: Language Embeddings can Reveal More Than They Should in Recommender Systems》；作者：Linda Beková, Rodrigo Alves；年份：2026。目录标注为预印本，不能据此声称已通过同行评审。站内已提供完整原文；本页根据目录导读和原摘要建立知识入口，不将原文中的实验结果冒充本站实测。

出处：paper-arxiv-2610.21713

## 方法辨析与阅读重点

向量嵌入压缩了文本，但不自动保证匿名。该研究围绕推荐系统的物品身份恢复及用户重识别，考察辅助文本带来的信息。保护效果需要结合攻击者可获得的信息与推荐效用解释，不能仅凭数据已编码就声称隐私安全。

以上为基于该节点所引站内论文摘要的 Agent 整理；结果、证明及数值条件须回到原文核对。

## 原摘要与核对边界

Language embeddings are increasingly used in recommenders to represent item content, but their privacy risks remain poorly understood. We study whether item embeddings can reveal item identities when an adversary has access to auxiliary item text from external sources. We show that a simple cosine-similarity attack can recover item identities with high mean reciprocal rank across language models and candidate-set settings on two real-world datasets. Leakage is strongest when the adversary's partial information overlaps with the victim representation, but it also persists through semantic alignment between independently sourced descriptions. We further show that item leakage can propagate to user re-identification from sparse ratings. Finally, we evaluate obfuscated descriptions as a mitigation and find a clear leakage-utility tradeoff.

出处：paper-arxiv-2610.21713

## 相关知识

[[network]]

[[index]]
