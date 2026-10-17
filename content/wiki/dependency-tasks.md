---
kind: "node"
id: "dependency-tasks"
title: "代码演化依赖图"
description: "把真实代码演化中的多次合并请求组织成可执行依赖图，以测试依据衡量代码智能体的部分进展。 · 预印本"
category: "Software"
tags: ["代码演化","Agent","依赖图","基准","预印本"]
parentIds: ["architecture"]
status: "untracked"
frame: "task"
details: "把真实代码演化中的多次合并请求组织成可执行依赖图，以测试依据衡量代码智能体的部分进展。 · 预印本"
learningPoints: ["历史变更怎样形成依赖图", "部分进展对应哪些测试证据", "训练任务与评测任务是否隔离"]
relatedBlogs: []
relatedPapers: [{"id":"arxiv-2610.22039","title":"WEAVE: Weaving Real-World Code Evolution into Dependency-Structured Tasks for Benchmarking and Training Code Agents"}]
relatedRss: []
sources: [{"id":"paper-arxiv-2610.22039","kind":"paper","title":"WEAVE: Weaving Real-World Code Evolution into Dependency-Structured Tasks for Benchmarking and Training Code Agents","url":"#paper/arxiv-2610.22039","locator":"原始 PDF，共 22 页；下方摘要不是全文审读结论","excerpt":"Real-world software engineering rarely consists of isolated changes. Features, migrations, and systematic fixes often unfold across multiple pull requests (PRs), requiring coordinated modifications across a repository. Yet most executable repository-level benchmarks retain a single issue or PR as the task unit, while existing multi-PR settings rely on coarse aggregation and structure-agnostic evaluation. This mismatch obscures dependencies among changes and limits progress measurement and learning signals for long-horizon code agents. We introduce WEAVE, a framework that transforms verified PR histories into executable, dependency-structured tasks. WEAVE leverages repository-calibrated typed change loci to organize related PRs into bounded DAGs and instantiate each as a unified executable task. We further introduce Graph Credit, a deterministic, test-grounded metric that measures dependency-consistent partial progress and supports dense, verifiable rewards for reinforcement learning. Experiments on task construction, agent evaluation, supervised fine-tuning, and reinforcement learning show that WEAVE yields coherent executable tasks, enables more faithful progress measurement than flat scoring, and provides effective supervision and verifiable rewards for training code agents."}]
relatedNodeIds: ["architecture"]
updated: "2026-10-17"
provenance: "agent-source-synthesis"
aliases: ["代码演化","Agent","依赖图","基准"]
iconKey: "chain"
iconLabel: "锁链"
iconReason: "锁链对应工程任务之间的依赖"
icon: "/assets/inventory/wiki-icons/chain.png"
---
# 代码演化依赖图

## 研究问题

把真实代码演化中的多次合并请求组织成可执行依赖图，以测试依据衡量代码智能体的部分进展。 · 预印本

出处：paper-arxiv-2610.22039

## 研究资料与阅读入口

《WEAVE: Weaving Real-World Code Evolution into Dependency-Structured Tasks for Benchmarking and Training Code Agents》；作者：Weihao Li, Zihang Xu, Zhongqiu Wang, Songwei Yu, Wenqiang Zhu, Yuechen Luo, Jingxuan Xu, Yanan Wu, Haoyang Huang, Ken Deng；年份：2026。目录标注为预印本，不能据此声称已通过同行评审。站内已提供完整原文；本页根据目录导读和原摘要建立知识入口，不将原文中的实验结果冒充本站实测。

出处：paper-arxiv-2610.22039

## 方法辨析与阅读重点

真实代码演化往往是相互依赖的多次变更，而不是独立的一张任务单。WEAVE 将历史合并请求组织成依赖结构，并以可执行测试衡量部分进展。阅读时应检查依赖图的真实性，以及局部完成是否被误计为整体成功。

以上为基于该节点所引站内论文摘要的 Agent 整理；结果、证明及数值条件须回到原文核对。

## 原摘要与核对边界

Real-world software engineering rarely consists of isolated changes. Features, migrations, and systematic fixes often unfold across multiple pull requests (PRs), requiring coordinated modifications across a repository. Yet most executable repository-level benchmarks retain a single issue or PR as the task unit, while existing multi-PR settings rely on coarse aggregation and structure-agnostic evaluation. This mismatch obscures dependencies among changes and limits progress measurement and learning signals for long-horizon code agents. We introduce WEAVE, a framework that transforms verified PR histories into executable, dependency-structured tasks. WEAVE leverages repository-calibrated typed change loci to organize related PRs into bounded DAGs and instantiate each as a unified executable task. We further introduce Graph Credit, a deterministic, test-grounded metric that measures dependency-consistent partial progress and supports dense, verifiable rewards for reinforcement learning. Experiments on task construction, agent evaluation, supervised fine-tuning, and reinforcement learning show that WEAVE yields coherent executable tasks, enables more faithful progress measurement than flat scoring, and provides effective supervision and verifiable rewards for training code agents.

出处：paper-arxiv-2610.22039

## 相关知识

[[architecture]]

[[index]]
