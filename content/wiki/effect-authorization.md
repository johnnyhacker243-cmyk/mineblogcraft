---
kind: "node"
id: "effect-authorization"
title: "审批与执行效果绑定"
description: "检查智能体审批是否绑定真实执行效果，以规范化效果描述和可信展示研究替换、重放等授权风险。 · 预印本"
category: "Security"
tags: ["Agent","授权","MCP","可信展示","预印本"]
parentIds: ["mcp-authorization"]
status: "untracked"
frame: "task"
details: "检查智能体审批是否绑定真实执行效果，以规范化效果描述和可信展示研究替换、重放等授权风险。 · 预印本"
learningPoints: ["审批究竟绑定什么执行对象", "展示与执行之间能否发生替换", "重放如何破坏原授权语境"]
relatedBlogs: []
relatedPapers: [{"id":"arxiv-2610.21063","title":"Approve What, Exactly? Effect Binding and Trusted Rendering for Agent Step-Up Authorization"}]
relatedRss: []
sources: [{"id":"paper-arxiv-2610.21063","kind":"paper","title":"Approve What, Exactly? Effect Binding and Trusted Rendering for Agent Step-Up Authorization","url":"#paper/arxiv-2610.21063","locator":"原始 PDF，共 36 页；下方摘要不是全文审读结论","excerpt":"AI agents now pause for approval before they send money, delete files or email outsiders, and that approval is usually treated as a second factor. We argue it is one only when compromising the agent cannot produce it and when it names exactly what it approves, and we test both conditions. We define twelve attacks on the approval path, including decoy recipients, amount cancellation, card padding, label spoofing, enrollment squatting and threshold splitting, and run them against the Agent Payments Protocol (AP2), the Microsoft action-bound approval design and Model Context Protocol (MCP) elicitation. An audit of ten agent runtimes finds no third-party verifiable approval record, no flood limits where measurable, and post-approval argument changes in four of eight runtimes with measurable binding. As a reference defense we build ASU (Agent Step-Up), a gateway that renders the approval card from a canonical effect descriptor, has a passkey on the phone of the user sign its digest, and executes only the stored call. Tamarin proves its binding, single-use and key-level non-repudiation properties under three stated hypotheses (53 lemmas). Across 27,108 scripted trials and 609 AgentDojo attack pairs, ASU stops substitution, replay and grant stretching, and the trusted card cuts forged-narration attack success from 0.54 to 0.03. With 15 current language models as automated approvers, the trusted card raises the attack catch rate from 0.30 to 0.98, at the cost of refusing 16 percent of harmless near misses, mostly due to a placeholder artifact in our stimuli. A second device adds nothing measurable over a trusted on-host confirmation in these experiments, flooding still succeeds 0.45 to 0.60 of the time against a modeled approver, and approval cannot stop effects that policy already allows. Code, data and proofs: https://github.com/Sports-Vision-Inc/agent-step-up"}]
relatedNodeIds: ["mcp-authorization"]
updated: "2026-10-17"
provenance: "agent-source-synthesis"
aliases: ["Agent","授权","MCP","可信展示"]
iconKey: "lead"
iconLabel: "拴绳"
iconReason: "拴绳对应特定执行效果的授权门槛"
icon: "/assets/inventory/wiki-icons/lead.png"
---
# 审批与执行效果绑定

## 研究问题

检查智能体审批是否绑定真实执行效果，以规范化效果描述和可信展示研究替换、重放等授权风险。 · 预印本

出处：paper-arxiv-2610.21063

## 研究资料与阅读入口

《Approve What, Exactly? Effect Binding and Trusted Rendering for Agent Step-Up Authorization》；作者：Sai Varun Kodathala, Prashanth Pollishetty, Jaylen Cargill；年份：2026。目录标注为预印本，不能据此声称已通过同行评审。站内已提供完整原文；本页根据目录导读和原摘要建立知识入口，不将原文中的实验结果冒充本站实测。

出处：paper-arxiv-2610.21063

## 方法辨析与阅读重点

用户批准的文字描述必须与实际执行效果一致。该研究关注规范化效果描述、可信展示以及替换和重放风险。授权检查不能只绑定自然语言意图，还需让执行对象、参数和效果在审批前后保持对应。

以上为基于该节点所引站内论文摘要的 Agent 整理；结果、证明及数值条件须回到原文核对。

## 原摘要与核对边界

AI agents now pause for approval before they send money, delete files or email outsiders, and that approval is usually treated as a second factor. We argue it is one only when compromising the agent cannot produce it and when it names exactly what it approves, and we test both conditions. We define twelve attacks on the approval path, including decoy recipients, amount cancellation, card padding, label spoofing, enrollment squatting and threshold splitting, and run them against the Agent Payments Protocol (AP2), the Microsoft action-bound approval design and Model Context Protocol (MCP) elicitation. An audit of ten agent runtimes finds no third-party verifiable approval record, no flood limits where measurable, and post-approval argument changes in four of eight runtimes with measurable binding. As a reference defense we build ASU (Agent Step-Up), a gateway that renders the approval card from a canonical effect descriptor, has a passkey on the phone of the user sign its digest, and executes only the stored call. Tamarin proves its binding, single-use and key-level non-repudiation properties under three stated hypotheses (53 lemmas). Across 27,108 scripted trials and 609 AgentDojo attack pairs, ASU stops substitution, replay and grant stretching, and the trusted card cuts forged-narration attack success from 0.54 to 0.03. With 15 current language models as automated approvers, the trusted card raises the attack catch rate from 0.30 to 0.98, at the cost of refusing 16 percent of harmless near misses, mostly due to a placeholder artifact in our stimuli. A second device adds nothing measurable over a trusted on-host confirmation in these experiments, flooding still succeeds 0.45 to 0.60 of the time against a modeled approver, and approval cannot stop effects that policy already allows. Code, data and proofs: https://github.com/Sports-Vision-Inc/agent-step-up

出处：paper-arxiv-2610.21063

## 相关知识

[[mcp-authorization]]

[[index]]
