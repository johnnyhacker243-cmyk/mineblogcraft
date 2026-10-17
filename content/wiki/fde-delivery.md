---
kind: "node"
id: "fde-delivery"
title: "需求发现与交付评测"
description: "以需求不完整的客户交付场景评估智能体，关注约束发现、利益相关方沟通和可运行系统的交付效果。 · 预印本"
category: "Software"
tags: ["需求工程","交付","部署","预印本"]
parentIds: ["deployment"]
status: "untracked"
frame: "task"
details: "以需求不完整的客户交付场景评估智能体，关注约束发现、利益相关方沟通和可运行系统的交付效果。 · 预印本"
learningPoints: ["显式需求与隐藏约束分别是什么", "信息发现成功能否转化为交付效果", "业务收益与沟通成本怎样计分"]
relatedBlogs: []
relatedPapers: [{"id":"arxiv-2610.22350","title":"FDE-Gym: The Last Mile of AI Delivery"}]
relatedRss: []
sources: [{"id":"paper-arxiv-2610.22350","kind":"paper","title":"FDE-Gym: The Last Mile of AI Delivery","url":"#paper/arxiv-2610.22350","locator":"原始 PDF，共 14 页；下方摘要不是全文审读结论","excerpt":"Existing agent benchmarks typically evaluate agents on well-specified tasks defined by issue reports, specifications, or task tickets. Real-world customer delivery is different: forward-deployed engineers (FDEs) must clarify ambiguous requirements, work in live systems, and uncover unstated constraints. We introduce FDE-Gym, a benchmark of 95 end-to-end delivery tasks from 20 customer scenarios across 18 sectors, each adapted by industry experts from real-world delivery projects. In simulated customer environments with scripted stakeholders and modifiable customer systems, agents interact with stakeholders and operate on production-like systems to deliver working solutions. FDE-Gym scores a delivery by how much it improves the customer's own success metric, normalized between 0 (unchanged system) and 1 (reference solution), with penalties for stakeholder interactions (messages, trial runs, and waiting time). An online platform lets humans practice FDE skills under the same grading criteria. We evaluate 13 model configurations from seven providers. In the realistic setting, where unstated constraints must be discovered, the best configuration achieves a mean FDE-Gym score of 0.56 and resolves only 14 of the 95 tasks (a score of at least 0.8 with no incident). Discovering unstated constraints is the primary bottleneck: performance drops sharply when models must uncover them without explicit guidance. Yet information discovery alone does not account for the gap: even on the 23 tasks where the best configuration obtains every key fact from stakeholders, it reaches a normalized business uplift of 0.8 or above on only 10. These results reveal a substantial gap between solving well-specified tasks and delivering effective AI systems for real customers."}]
relatedNodeIds: ["deployment"]
updated: "2026-10-17"
provenance: "agent-source-synthesis"
aliases: ["需求工程","交付","部署"]
iconKey: "compass_00"
iconLabel: "指南针"
iconReason: "指南针对应发现隐含需求"
icon: "/assets/inventory/wiki-icons/compass_00.png"
---
# 需求发现与交付评测

## 研究问题

以需求不完整的客户交付场景评估智能体，关注约束发现、利益相关方沟通和可运行系统的交付效果。 · 预印本

出处：paper-arxiv-2610.22350

## 研究资料与阅读入口

《FDE-Gym: The Last Mile of AI Delivery》；作者：Dongxu Yang, Hongda Yan, Renxin Wang, Baoli Zhang, Haojia Zuo, Ying Zhao, Youmin Chen, Xiaojian Liao, Congming Gao, Tianyang Jiang, Yixiao Chen, Qing Wang, Zhiguo Yu, Xiaqing Li, Yuhao Zhang, Jiawen Sun, Renzhe Xu, De Mi, Tiancheng Wu, Xianya Fu, Xuanlu Zhao, Bo Feng, Meixuan Ren, Guanming Lin, Ziheng Zhou, Xinhua Wang；年份：2026。目录标注为预印本，不能据此声称已通过同行评审。站内已提供完整原文；本页根据目录导读和原摘要建立知识入口，不将原文中的实验结果冒充本站实测。

出处：paper-arxiv-2610.22350

## 方法辨析与阅读重点

真实交付中的任务说明可能不完整。FDE-Gym 把与利益相关方澄清约束、修改系统以及交付效果放在同一评价流程中；知道信息与做出有效实现是不同能力。评价应对齐客户成功指标，并计入沟通、等待和试运行成本。

以上为基于该节点所引站内论文摘要的 Agent 整理；结果、证明及数值条件须回到原文核对。

## 原摘要与核对边界

Existing agent benchmarks typically evaluate agents on well-specified tasks defined by issue reports, specifications, or task tickets. Real-world customer delivery is different: forward-deployed engineers (FDEs) must clarify ambiguous requirements, work in live systems, and uncover unstated constraints. We introduce FDE-Gym, a benchmark of 95 end-to-end delivery tasks from 20 customer scenarios across 18 sectors, each adapted by industry experts from real-world delivery projects. In simulated customer environments with scripted stakeholders and modifiable customer systems, agents interact with stakeholders and operate on production-like systems to deliver working solutions. FDE-Gym scores a delivery by how much it improves the customer's own success metric, normalized between 0 (unchanged system) and 1 (reference solution), with penalties for stakeholder interactions (messages, trial runs, and waiting time). An online platform lets humans practice FDE skills under the same grading criteria. We evaluate 13 model configurations from seven providers. In the realistic setting, where unstated constraints must be discovered, the best configuration achieves a mean FDE-Gym score of 0.56 and resolves only 14 of the 95 tasks (a score of at least 0.8 with no incident). Discovering unstated constraints is the primary bottleneck: performance drops sharply when models must uncover them without explicit guidance. Yet information discovery alone does not account for the gap: even on the 23 tasks where the best configuration obtains every key fact from stakeholders, it reaches a normalized business uplift of 0.8 or above on only 10. These results reveal a substantial gap between solving well-specified tasks and delivering effective AI systems for real customers.

出处：paper-arxiv-2610.22350

## 相关知识

[[deployment]]

[[index]]
