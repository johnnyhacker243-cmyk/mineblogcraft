---
kind: "node"
id: "review-evidence"
title: "AI 代码审查证据"
description: "通过从业者调查比较人工与 AI 合并请求的信任和证据要求，讨论验证责任与不确定性。 · 预印本"
category: "Software"
tags: ["代码审查","人机协作","证据","预印本"]
parentIds: ["testing"]
status: "untracked"
frame: "task"
details: "通过从业者调查比较人工与 AI 合并请求的信任和证据要求，讨论验证责任与不确定性。 · 预印本"
learningPoints: ["调查测量的是信任还是正确性", "人工与 AI 补丁需要哪些证据", "不确定性与验证责任如何表达"]
relatedBlogs: []
relatedPapers: [{"id":"arxiv-2610.21144","title":"Plausible Is Not Enough: Trust and Evidence in AI-Authored Pull Request Review"}]
relatedRss: []
sources: [{"id":"paper-arxiv-2610.21144","kind":"paper","title":"Plausible Is Not Enough: Trust and Evidence in AI-Authored Pull Request Review","url":"#paper/arxiv-2610.21144","locator":"原始 PDF，共 31 页；下方摘要不是全文审读结论","excerpt":"Code review is where AI-authored pull requests (AIPRs) must earn reviewer trust before integration, yet it is unclear whether reviewers apply the same criteria used for human-authored pull requests (HPRs). We surveyed 239 practitioners from 31 countries using matched HPR and AIPR questions to compare trust, evidence requirements, and verification practices within respondents. Most respondents (64.9%) reported lower initial trust in AIPRs. They relied less on author track record and subsystem familiarity, emphasizing instead human prompter expertise and bounded change size. For approval, respondents more often considered their own reasoning through critical cases sufficient for AIPRs than HPRs (55.2% versus 28.5%), while relying less on test coverage. Overall, 61.1% reported higher evidence requirements for AIPRs, and the share who would block approval under residual uncertainty increased from 19.4% for HPRs to 43.9% for AIPRs. Respondents prioritized test inspection, project context, and local execution, and more often selected partial reimplementation to verify non-trivial logic. Unclear ownership was also more likely to pause AIPR review (29.3% versus 14.6%). Open-ended responses pointed to the difficulty of validating plausible code without reliable context and human accountability. These findings frame AIPR review as an evidence-ownership problem, not merely a correctness check. Reviewers need to connect generated changes to validated behavior and responsible maintainers. Review tools and agentic workflows should expose provenance, distinguish generated claims from human-validated evidence, and make uncertainty visible before approval."}]
relatedNodeIds: ["testing"]
updated: "2026-10-17"
provenance: "agent-source-synthesis"
aliases: ["代码审查","人机协作","证据"]
iconKey: "spyglass"
iconLabel: "望远镜"
iconReason: "望远镜对应可复查的补丁验证证据"
icon: "/assets/inventory/wiki-icons/spyglass.png"
---
# AI 代码审查证据

## 研究问题

通过从业者调查比较人工与 AI 合并请求的信任和证据要求，讨论验证责任与不确定性。 · 预印本

出处：paper-arxiv-2610.21144

## 研究资料与阅读入口

《Plausible Is Not Enough: Trust and Evidence in AI-Authored Pull Request Review》；作者：Md Shamimur Rahman, Khairul Alam, Banani Roy, Chanchal K. Roy；年份：2026。目录标注为预印本，不能据此声称已通过同行评审。站内已提供完整原文；本页根据目录导读和原摘要建立知识入口，不将原文中的实验结果冒充本站实测。

出处：paper-arxiv-2610.21144

## 方法辨析与阅读重点

AI 编写的补丁看起来可信，不等于证据足够。该研究通过从业者调查讨论人工与 AI 合并请求的信任要求；调查反映实践者判断，不能替代漏洞检测或补丁正确性实验。验收责任仍需要绑定可复查的验证材料。

以上为基于该节点所引站内论文摘要的 Agent 整理；结果、证明及数值条件须回到原文核对。

## 原摘要与核对边界

Code review is where AI-authored pull requests (AIPRs) must earn reviewer trust before integration, yet it is unclear whether reviewers apply the same criteria used for human-authored pull requests (HPRs). We surveyed 239 practitioners from 31 countries using matched HPR and AIPR questions to compare trust, evidence requirements, and verification practices within respondents. Most respondents (64.9%) reported lower initial trust in AIPRs. They relied less on author track record and subsystem familiarity, emphasizing instead human prompter expertise and bounded change size. For approval, respondents more often considered their own reasoning through critical cases sufficient for AIPRs than HPRs (55.2% versus 28.5%), while relying less on test coverage. Overall, 61.1% reported higher evidence requirements for AIPRs, and the share who would block approval under residual uncertainty increased from 19.4% for HPRs to 43.9% for AIPRs. Respondents prioritized test inspection, project context, and local execution, and more often selected partial reimplementation to verify non-trivial logic. Unclear ownership was also more likely to pause AIPR review (29.3% versus 14.6%). Open-ended responses pointed to the difficulty of validating plausible code without reliable context and human accountability. These findings frame AIPR review as an evidence-ownership problem, not merely a correctness check. Reviewers need to connect generated changes to validated behavior and responsible maintainers. Review tools and agentic workflows should expose provenance, distinguish generated claims from human-validated evidence, and make uncertainty visible before approval.

出处：paper-arxiv-2610.21144

## 相关知识

[[testing]]

[[index]]
