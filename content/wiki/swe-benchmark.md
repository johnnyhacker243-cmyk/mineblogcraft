---
kind: "node"
id: "swe-benchmark"
title: "长程工程基准"
description: "SWE-Bench Pro 面向多文件、长程软件工程问题，讨论真实任务构造、评估划分及模型失败模式。 · 预印本"
category: "Software"
tags: ["SWE-Bench","长程任务","评测","预印本"]
parentIds: ["testing"]
status: "untracked"
frame: "task"
details: "SWE-Bench Pro 面向多文件、长程软件工程问题，讨论真实任务构造、评估划分及模型失败模式。 · 预印本"
learningPoints: ["任务为何属于长程多文件问题", "评测划分怎样减少泄漏", "失败模式发生在定位修改还是验证"]
relatedBlogs: []
relatedPapers: [{"id":"arxiv-2509.16941","title":"SWE-Bench Pro: Can AI Agents Solve Long-Horizon Software Engineering Tasks?"}]
relatedRss: []
sources: [{"id":"paper-arxiv-2509.16941","kind":"paper","title":"SWE-Bench Pro: Can AI Agents Solve Long-Horizon Software Engineering Tasks?","url":"#paper/arxiv-2509.16941","locator":"原始 PDF，共 20 页；下方摘要不是全文审读结论","excerpt":"We introduce SWE-Bench Pro, a substantially more challenging benchmark that builds upon the best practices of SWE-BENCH [25], but is explicitly designed to capture realistic, complex, enterprise-level problems beyond the scope of SWE-BENCH. SWE-BENCH PRO contains 1,865 problems sourced from a diverse set of 41 actively maintained repositories spanning business applications, B2B services, and developer tools. The benchmark is partitioned into a public set with open access to problems sourced from 11 repositories, a held-out set of 12 repositories and a commercial set of 18 proprietary repositories where we have formal partnership agreements with early-stage startups. Problems in the held-out and the commercial set are not publicly accessible, but we release results on the commercial set. Our benchmark features long-horizon tasks that may require hours to days for a professional software engineer to complete, often involving patches across multiple files and substantial code modifications. All tasks are human-verified and augmented with sufficient context to ensure resolvability. To better understand these limitations, we cluster the failure modes observed in the collected agent trajectories for a clearer characterization of the error patterns exhibited by current models. Overall, SWE-BENCH PRO provides a contamination-resistant testbed that more faithfully captures the complexity and diversity of real-world software development, advancing the pursuit of truly autonomous software engineering agents at a professional level."}]
relatedNodeIds: ["testing"]
updated: "2026-10-17"
provenance: "agent-source-synthesis"
aliases: ["SWE-Bench","长程任务","评测"]
iconKey: "experience_bottle"
iconLabel: "附魔之瓶"
iconReason: "经验瓶对应真实多文件任务评估"
icon: "/assets/inventory/wiki-icons/experience_bottle.png"
---
# 长程工程基准

## 研究问题

SWE-Bench Pro 面向多文件、长程软件工程问题，讨论真实任务构造、评估划分及模型失败模式。 · 预印本

出处：paper-arxiv-2509.16941

## 研究资料与阅读入口

《SWE-Bench Pro: Can AI Agents Solve Long-Horizon Software Engineering Tasks?》；作者：Xiang Deng, Jeff Da, Edwin Pan, Yannis Yiming He, Charles Ide, Kanak Garg, Niklas Lauffer, Andrew Park, Nitin Pasari, Chetan Rane, Karmini Sampath, Maya Krishnan, Srivatsa Kundurthy, Sean Hendryx, Zifan Wang, Vijay Bharadwaj, Jeff Holm, Raja Aluri, Chen Bo Calvin Zhang, Noah Jacobson, Bing Liu, Brad Kenstler；年份：2025。目录标注为预印本，不能据此声称已通过同行评审。站内已提供完整原文；本页根据目录导读和原摘要建立知识入口，不将原文中的实验结果冒充本站实测。

出处：paper-arxiv-2509.16941

## 方法辨析与阅读重点

长程软件工程问题涉及多文件、多步依赖与失败恢复。SWE-Bench Pro 的研究问题是现有智能体在这类任务上的能力和失败模式。阅读时应检查任务来源、数据划分及评价环境，避免将单一基准结果泛化为所有工程能力。

以上为基于该节点所引站内论文摘要的 Agent 整理；结果、证明及数值条件须回到原文核对。

## 原摘要与核对边界

We introduce SWE-Bench Pro, a substantially more challenging benchmark that builds upon the best practices of SWE-BENCH [25], but is explicitly designed to capture realistic, complex, enterprise-level problems beyond the scope of SWE-BENCH. SWE-BENCH PRO contains 1,865 problems sourced from a diverse set of 41 actively maintained repositories spanning business applications, B2B services, and developer tools. The benchmark is partitioned into a public set with open access to problems sourced from 11 repositories, a held-out set of 12 repositories and a commercial set of 18 proprietary repositories where we have formal partnership agreements with early-stage startups. Problems in the held-out and the commercial set are not publicly accessible, but we release results on the commercial set. Our benchmark features long-horizon tasks that may require hours to days for a professional software engineer to complete, often involving patches across multiple files and substantial code modifications. All tasks are human-verified and augmented with sufficient context to ensure resolvability. To better understand these limitations, we cluster the failure modes observed in the collected agent trajectories for a clearer characterization of the error patterns exhibited by current models. Overall, SWE-BENCH PRO provides a contamination-resistant testbed that more faithfully captures the complexity and diversity of real-world software development, advancing the pursuit of truly autonomous software engineering agents at a professional level.

出处：paper-arxiv-2509.16941

## 相关知识

[[testing]]

[[index]]
