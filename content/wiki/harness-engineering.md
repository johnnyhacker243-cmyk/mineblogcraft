---
kind: "node"
id: "harness-engineering"
title: "长程运行框架工程"
description: "Doc2Harness 用隔离构建与确定性测试评估代码智能体运行框架的长程工程能力，而非仅看下游任务成功率。 · 预印本"
category: "Software"
tags: ["Harness","评测","系统工程","预印本"]
parentIds: ["architecture"]
status: "untracked"
frame: "task"
details: "Doc2Harness 用隔离构建与确定性测试评估代码智能体运行框架的长程工程能力，而非仅看下游任务成功率。 · 预印本"
learningPoints: ["文档要求如何转成框架契约", "隔离构建排除了哪些环境偶然性", "框架测试与下游任务成绩的区别"]
relatedBlogs: []
relatedPapers: [{"id":"arxiv-2610.20344","title":"Doc2Harness: Benchmarking LLMs on Long-Horizon Harness Engineering of Coding Agents"}]
relatedRss: []
sources: [{"id":"paper-arxiv-2610.20344","kind":"paper","title":"Doc2Harness: Benchmarking LLMs on Long-Horizon Harness Engineering of Coding Agents","url":"#paper/arxiv-2610.20344","locator":"原始 PDF，共 17 页；下方摘要不是全文审读结论","excerpt":"Agents driven by large language models are increasingly deployed on long-horizon tasks, where they use tools and modify real workspaces. How well they perform depends as much on the harness around the model as on the model itself. Existing benchmarks measure downstream task success under a fixed harness, leaving harness engineering itself unexplored. We propose Doc2Harness, a two-stage benchmark that evaluates long-horizon harness engineering directly. In Stage 1, a build model operating inside a fixed builder harness receives an interface-only contract skeleton and a development document that consolidates behavior across twelve frontier harnesses, and then constructs a complete candidate harness in an isolated container. In Stage 2, the frozen candidate harness runs in containers separate from the construction environment, one per test case, and is driven end to end by a scripted mock model. We score each test case using four observable channels, namely the requests sent to the model, the files on disk, the process exit code, and the command output; positive controls rule out vacuous passes. Across nineteen frontier models, each evaluated with three independent builds on 328 test cases, GPT-6 Astra achieves the highest pass rate at 53.05%, while the weakest model reaches 27.44%, a gap of roughly twenty-six percentage points. Even the strongest model fails nearly half of the test cases, and failures cluster around how cross-cutting functionality is split across modules. To our knowledge, Doc2Harness provides the first deterministic benchmark for measuring long-horizon harness engineering."}]
relatedNodeIds: ["architecture"]
updated: "2026-10-17"
provenance: "agent-source-synthesis"
aliases: ["Harness","评测","系统工程"]
iconKey: "lead"
iconLabel: "拴绳"
iconReason: "拴绳对应长任务的约束和执行环境"
icon: "/assets/inventory/wiki-icons/lead.png"
---
# 长程运行框架工程

## 研究问题

Doc2Harness 用隔离构建与确定性测试评估代码智能体运行框架的长程工程能力，而非仅看下游任务成功率。 · 预印本

出处：paper-arxiv-2610.20344

## 研究资料与阅读入口

《Doc2Harness: Benchmarking LLMs on Long-Horizon Harness Engineering of Coding Agents》；作者：Yuyao Ge, Shenghua Liu, Peizhong Gao, Chendi Ge, Chenxu Liu, Yiwei Wang, Lingrui Mei, Baolong Bi, Jiayu Yao, Jiafeng Guo, Xueqi Cheng；年份：2026。目录标注为预印本，不能据此声称已通过同行评审。站内已提供完整原文；本页根据目录导读和原摘要建立知识入口，不将原文中的实验结果冒充本站实测。

出处：paper-arxiv-2610.20344

## 方法辨析与阅读重点

代码智能体运行框架承担长任务中的工具、状态和执行环境组织。Doc2Harness 用隔离构建与确定性测试评价框架工程本身，区别于只观察一个下游任务是否成功。测试应能定位框架契约是否满足，而非依赖完成声明。

以上为基于该节点所引站内论文摘要的 Agent 整理；结果、证明及数值条件须回到原文核对。

## 原摘要与核对边界

Agents driven by large language models are increasingly deployed on long-horizon tasks, where they use tools and modify real workspaces. How well they perform depends as much on the harness around the model as on the model itself. Existing benchmarks measure downstream task success under a fixed harness, leaving harness engineering itself unexplored. We propose Doc2Harness, a two-stage benchmark that evaluates long-horizon harness engineering directly. In Stage 1, a build model operating inside a fixed builder harness receives an interface-only contract skeleton and a development document that consolidates behavior across twelve frontier harnesses, and then constructs a complete candidate harness in an isolated container. In Stage 2, the frozen candidate harness runs in containers separate from the construction environment, one per test case, and is driven end to end by a scripted mock model. We score each test case using four observable channels, namely the requests sent to the model, the files on disk, the process exit code, and the command output; positive controls rule out vacuous passes. Across nineteen frontier models, each evaluated with three independent builds on 328 test cases, GPT-6 Astra achieves the highest pass rate at 53.05%, while the weakest model reaches 27.44%, a gap of roughly twenty-six percentage points. Even the strongest model fails nearly half of the test cases, and failures cluster around how cross-cutting functionality is split across modules. To our knowledge, Doc2Harness provides the first deterministic benchmark for measuring long-horizon harness engineering.

出处：paper-arxiv-2610.20344

## 相关知识

[[architecture]]

[[index]]
