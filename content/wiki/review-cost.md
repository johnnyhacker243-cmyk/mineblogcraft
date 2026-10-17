---
kind: "node"
id: "review-cost"
title: "维护性与审查成本"
description: "预注册观察研究：考察代码可维护性与智能体审查成本的关联，区分文件规模、变更规模和相关性解释。 · 预印本"
category: "Software"
tags: ["代码质量","代码审查","成本","预印本"]
parentIds: ["architecture"]
status: "untracked"
frame: "task"
details: "预注册观察研究：考察代码可维护性与智能体审查成本的关联，区分文件规模、变更规模和相关性解释。 · 预印本"
learningPoints: ["维护性度量与成本如何定义", "文件和变更规模怎样控制", "预注册观察研究支持哪种结论"]
relatedBlogs: []
relatedPapers: [{"id":"arxiv-2610.21914","title":"CodeHealth Predicts the Token Cost of Agentic Code Review: A Pre-Registered Study of 465 Agent-Authored Pull Requests"}]
relatedRss: []
sources: [{"id":"paper-arxiv-2610.21914","kind":"paper","title":"CodeHealth Predicts the Token Cost of Agentic Code Review: A Pre-Registered Study of 465 Agent-Authored Pull Requests","url":"#paper/arxiv-2610.21914","locator":"原始 PDF，共 32 页；下方摘要不是全文审读结论","excerpt":"Context: Organizations increasingly delegate code review to multi-agent large language model (LLM) pipelines billed per token. Low code quality raises human maintenance effort, but its effect on agent review cost has not been measured.\n  Objective: We test whether baseline CodeHealth predicts the token cost of agentic review and fix beyond pull request (PR) footprint.\n  Method: In a pre-registered observational study, we sampled 465 agent-authored PRs from 246 repositories in AIDev, jointly stratified by CodeHealth and footprint under repository caps. A frozen five-agent review-and-fix pipeline processed every PR with three different LLMs. Per LLM, we fitted a mixed model of log tokens on CodeHealth and log PR footprint, with a repository random intercept.\n  Results: For all three LLMs the CodeHealth coefficient was negative, with 95% CI excluding zero; each CodeHealth point was associated with 3.5% to 6.1% lower token cost. CodeHealth was unrelated to PR footprint, so PR size does not explain the association. Two of three registered smells predicted fix cost; batch fixing left median CodeHealth unchanged. Exploratory analyses located the association in the review stage, where agents iterated more on unhealthy code without writing more comments. Adjusting for the size of the scored files absorbed the association, which we interpret as mediation by file size.\n  Conclusions: A quality metric calibrated against human maintainability also predicts the inference cost of multi-agent review and fix. The effect is modest per point and not carried by PR size, so the refactoring case extends to agent-reviewed code when it changes structure and file size, not only the score.\n  Data Availability: https://doi.org/10.5281/zenodo.22127920"}]
relatedNodeIds: ["architecture"]
updated: "2026-10-17"
provenance: "agent-source-synthesis"
aliases: ["代码质量","代码审查","成本"]
iconKey: "emerald"
iconLabel: "绿宝石"
iconReason: "绿宝石对应审查成本及其度量"
icon: "/assets/inventory/wiki-icons/emerald.png"
---
# 维护性与审查成本

## 研究问题

预注册观察研究：考察代码可维护性与智能体审查成本的关联，区分文件规模、变更规模和相关性解释。 · 预印本

出处：paper-arxiv-2610.21914

## 研究资料与阅读入口

《CodeHealth Predicts the Token Cost of Agentic Code Review: A Pre-Registered Study of 465 Agent-Authored Pull Requests》；作者：Lo Gullstrand Heander, Markus Borg, Emma Söderberg, Christofer Rydenfält；年份：2026。目录标注为预印本，不能据此声称已通过同行评审。站内已提供完整原文；本页根据目录导读和原摘要建立知识入口，不将原文中的实验结果冒充本站实测。

出处：paper-arxiv-2610.21914

## 方法辨析与阅读重点

CodeHealth 研究将维护性与智能体审查的 token 成本联系起来，并预先登记分析方案。观察到关联不能直接说明改善一个指标就必然降低成本；文件大小、变更大小和样本选择都可能影响解释。

以上为基于该节点所引站内论文摘要的 Agent 整理；结果、证明及数值条件须回到原文核对。

## 原摘要与核对边界

Context: Organizations increasingly delegate code review to multi-agent large language model (LLM) pipelines billed per token. Low code quality raises human maintenance effort, but its effect on agent review cost has not been measured.
  Objective: We test whether baseline CodeHealth predicts the token cost of agentic review and fix beyond pull request (PR) footprint.
  Method: In a pre-registered observational study, we sampled 465 agent-authored PRs from 246 repositories in AIDev, jointly stratified by CodeHealth and footprint under repository caps. A frozen five-agent review-and-fix pipeline processed every PR with three different LLMs. Per LLM, we fitted a mixed model of log tokens on CodeHealth and log PR footprint, with a repository random intercept.
  Results: For all three LLMs the CodeHealth coefficient was negative, with 95% CI excluding zero; each CodeHealth point was associated with 3.5% to 6.1% lower token cost. CodeHealth was unrelated to PR footprint, so PR size does not explain the association. Two of three registered smells predicted fix cost; batch fixing left median CodeHealth unchanged. Exploratory analyses located the association in the review stage, where agents iterated more on unhealthy code without writing more comments. Adjusting for the size of the scored files absorbed the association, which we interpret as mediation by file size.
  Conclusions: A quality metric calibrated against human maintainability also predicts the inference cost of multi-agent review and fix. The effect is modest per point and not carried by PR size, so the refactoring case extends to agent-reviewed code when it changes structure and file size, not only the score.
  Data Availability: https://doi.org/10.5281/zenodo.22127920

出处：paper-arxiv-2610.21914

## 相关知识

[[architecture]]

[[index]]
