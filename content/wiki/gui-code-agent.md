---
kind: "node"
id: "gui-code-agent"
title: "GUI 与代码协同智能体"
description: "在统一动作空间中训练图形界面操作与代码执行，研究桌面智能体的混合任务和步骤级优化。 · 预印本"
category: "AI"
tags: ["GUI","Agent","桌面自动化","预印本"]
parentIds: ["agent"]
status: "untracked"
frame: "task"
details: "在统一动作空间中训练图形界面操作与代码执行，研究桌面智能体的混合任务和步骤级优化。 · 预印本"
learningPoints: ["统一动作空间怎样表示两种操作", "混合任务的状态与产物如何构造", "步骤级优化和简单工具拼接的差异"]
relatedBlogs: []
relatedPapers: [{"id":"arxiv-2610.22234","title":"OS-Helix: Unifying GUI Interaction and Code Execution in Native Computer-Using Agents"}]
relatedRss: []
sources: [{"id":"paper-arxiv-2610.22234","kind":"paper","title":"OS-Helix: Unifying GUI Interaction and Code Execution in Native Computer-Using Agents","url":"#paper/arxiv-2610.22234","locator":"原始 PDF，共 47 页；下方摘要不是全文审读结论","excerpt":"Real desktop automation is neither purely visual nor purely programmatic. Agents must understand user-facing interfaces while efficiently manipulating files, scripts, and system state. However, native GUI/code coordination cannot be obtained by prompt-level tool composition. In our preliminary experiments, naively adding a code tool degrades a GUI agent, revealing that GUI/code routing must be internalized through training on high-quality hybrid data. We present OS-Helix, an end-to-end trained multimodal computer-using agent that unifies GUI actions and code execution in one action space. To construct the required supervision, we introduce application-artifact composition, pairing desktop applications with authentic file artifacts to instantiate executable Ubuntu states, and a decoupled instruction/evaluator generation pipeline that produces environment-grounded tasks whose final states can be verified regardless of the solution modality. We cold-start the policy with SFT on filtered hybrid data and further improve it through online RL in live desktop environments. For RL, we propose Step-balanced GSPO, which aggregates importance weight by action step rather than raw assistant tokens to prevent long code actions from dominating heterogeneous-action optimization. On OSWorld-Verified, OS-Helix-27B and OS-Helix-35B-A3B achieve relative improvements of 35.0% and 33.7% over their matched Qwen3.5 hybrid baselines, while OS-Helix-27B-RL further improves by 42.9% to reach 66.44% success. Ablations provide evidence consistent with contributions from learned GUI/code coordination, scalable verifiable supervision, and action step balanced optimization, while demonstrating cross-platform transfer on WindowsAgentArena. Our project homepage is at https://os-copilot.github.io/OS-Helix/."}]
relatedNodeIds: ["agent"]
updated: "2026-10-17"
provenance: "agent-source-synthesis"
aliases: ["GUI","Agent","桌面自动化"]
iconKey: "flint_and_steel"
iconLabel: "打火石"
iconReason: "打火石对应界面操作与代码动作切换"
icon: "/assets/inventory/wiki-icons/flint_and_steel.png"
---
# GUI 与代码协同智能体

## 研究问题

在统一动作空间中训练图形界面操作与代码执行，研究桌面智能体的混合任务和步骤级优化。 · 预印本

出处：paper-arxiv-2610.22234

## 研究资料与阅读入口

《OS-Helix: Unifying GUI Interaction and Code Execution in Native Computer-Using Agents》；作者：Bowen Yang, Kaiming Jin, Zichen Ding, Zhenyu Wu, Zehao Li, Zhoumianze Liu, Kanzhi Cheng, Fangzhi Xu, Yanan Sun, Qiushi Sun, Yu Qiao；年份：2026。目录标注为预印本，不能据此声称已通过同行评审。站内已提供完整原文；本页根据目录导读和原摘要建立知识入口，不将原文中的实验结果冒充本站实测。

出处：paper-arxiv-2610.22234

## 方法辨析与阅读重点

桌面任务同时包含可见界面与文件、脚本和系统状态。OS-Helix 在统一动作空间训练 GUI 与代码执行，并用应用和真实文件产物构造混合任务。直接给已有 GUI 智能体增加代码工具，不应被当成已经学会协调两类动作。

以上为基于该节点所引站内论文摘要的 Agent 整理；结果、证明及数值条件须回到原文核对。

## 原摘要与核对边界

Real desktop automation is neither purely visual nor purely programmatic. Agents must understand user-facing interfaces while efficiently manipulating files, scripts, and system state. However, native GUI/code coordination cannot be obtained by prompt-level tool composition. In our preliminary experiments, naively adding a code tool degrades a GUI agent, revealing that GUI/code routing must be internalized through training on high-quality hybrid data. We present OS-Helix, an end-to-end trained multimodal computer-using agent that unifies GUI actions and code execution in one action space. To construct the required supervision, we introduce application-artifact composition, pairing desktop applications with authentic file artifacts to instantiate executable Ubuntu states, and a decoupled instruction/evaluator generation pipeline that produces environment-grounded tasks whose final states can be verified regardless of the solution modality. We cold-start the policy with SFT on filtered hybrid data and further improve it through online RL in live desktop environments. For RL, we propose Step-balanced GSPO, which aggregates importance weight by action step rather than raw assistant tokens to prevent long code actions from dominating heterogeneous-action optimization. On OSWorld-Verified, OS-Helix-27B and OS-Helix-35B-A3B achieve relative improvements of 35.0% and 33.7% over their matched Qwen3.5 hybrid baselines, while OS-Helix-27B-RL further improves by 42.9% to reach 66.44% success. Ablations provide evidence consistent with contributions from learned GUI/code coordination, scalable verifiable supervision, and action step balanced optimization, while demonstrating cross-platform transfer on WindowsAgentArena. Our project homepage is at https://os-copilot.github.io/OS-Helix/.

出处：paper-arxiv-2610.22234

## 相关知识

[[agent]]

[[index]]
