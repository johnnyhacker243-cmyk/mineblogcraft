---
kind: "node"
id: "rss-identity"
title: "身份、钓鱼与会话威胁"
description: "整理本地 RSS 快照中 15 条相关线索，保留发布方与原文链接。"
category: "Security"
tags: ["RSS","外部摘要","身份、钓鱼与会话威胁"]
parentIds: ["passkey"]
status: "untracked"
frame: "task"
details: "整理本地 RSS 快照中 15 条相关线索，保留发布方与原文链接。"
learningPoints: ["先核对发布方、文章日期与快照抓取日期","技术指标和事件叙述需要回到原文，不把厂商摘要当作已复现实验","把可复用概念与产品发布、营销及短期新闻分开"]
relatedBlogs: []
relatedPapers: []
relatedRss: ["unit42","microsoft-security","aws-ml","talos","meituan"]
sources: [{"id":"rss-3490cc91887ab3d39a515b66","kind":"rss","title":"AI-Powered Espionage Campaign Targets Government Linux Infrastructure","url":"https://unit42.paloaltonetworks.com/ai-campaign-targets-linux-infrastructure/","locator":"Unit 42 · Palo Alto Networks · 2026-10-15T22:00:09.000Z · 快照 2026-10-16T11:58:12.680Z","excerpt":"Our analysis an AI-powered espionage campaign targeting government Linux infrastructure with custom malware, web shells, and advanced credential theft. The post AI-Powered Espionage Campaign Targets Government Linux Infrastructure appeared first on Unit 42 .","sourceId":"unit42"},{"id":"rss-22b36686d5a9058efc8b0331","kind":"rss","title":"The hidden network: Inside the phishing infrastructure ecosystem powering global cybercrime","url":"https://www.microsoft.com/en-us/security/blog/2026/10/14/the-hidden-network-inside-the-phishing-infrastructure-ecosystem-powering-global-cybercrime/","locator":"Microsoft Security Blog · 2026-10-14T13:00:00.000Z · 快照 2026-10-16T11:58:12.680Z","excerpt":"Microsoft uncovered a Chinese-language cybercriminal ecosystem, an interconnected network of phishing kit operators (tracked as Storm-2990), and an illicit marketplace (tracked as Storm-3119) selling tools and infrastructure for large-scale phishing. In collaboration with law enforcement agencies and other partners worldwide, Microsoft’s Digital Crimes Unit (DCU) facilitated a disruption of the ecosystem. The post The hidden network: Inside the phishing infrastructure ecosystem powering global cybercrime appeared first on Microsoft Security Blog .","sourceId":"microsoft-security"},{"id":"rss-440394cd561eebaa56f4c758","kind":"rss","title":"Building agents that transact with Anchor Browser and AgentCore payments","url":"https://aws.amazon.com/blogs/machine-learning/building-agents-that-transact-with-anchor-browser-and-agentcore-payments/","locator":"AWS Machine Learning · 2026-10-13T20:10:33.000Z · 快照 2026-10-16T11:58:12.680Z","excerpt":"Learn how the AWS Generative AI Innovation Center Partner Agent Factory and Anchor Browser built AI agents that autonomously pay for x402-protected web resources and APIs. Amazon Bedrock AgentCore payments checks budgets, signs transactions, and retries requests without exposing wallet credentials to the agent runtime.","sourceId":"aws-ml"},{"id":"rss-992a771e4de1b8c5756964ec","kind":"rss","title":"Share GPU clusters across teams with isolation and fairness using Amazon SageMaker HyperPod","url":"https://aws.amazon.com/blogs/machine-learning/share-gpu-clusters-across-teams-with-isolation-and-fairness-using-amazon-sagemaker-hyperpod/","locator":"AWS Machine Learning · 2026-10-08T16:20:04.000Z · 快照 2026-10-16T11:58:12.680Z","excerpt":"A reference architecture for securely sharing one Amazon SageMaker HyperPod EKS cluster across multiple teams, using AWS IAM Identity Center for authentication, per-team SageMaker Domains and Kubernetes namespaces for isolation, HyperPod Task Governance for fairness, and namespace-level cost allocation for chargeback.","sourceId":"aws-ml"},{"id":"rss-f631c0f04ce91112a75f2e8f","kind":"rss","title":"UAT-11985: AI-assisted event lures delivering real-time Google AitM phishing","url":"https://blog.talosintelligence.com/uat-11985/","locator":"Cisco Talos Intelligence · 2026-10-08T10:01:06.000Z · 快照 2026-10-16T11:58:12.680Z","excerpt":"Cisco Talos identified an APT spear-phishing campaign against individuals affiliated with Taiwan research organizations. The operation leveraged legitimate public event themes and impersonated reputable academic and policy institutions.","sourceId":"talos"},{"id":"rss-9e52a9e43e1aff72310ecadf","kind":"rss","title":"​​Secure what’s next: Your guide to Microsoft Security at Microsoft Ignite 2026","url":"https://www.microsoft.com/en-us/security/blog/2026/09/30/secure-whats-next-your-guide-to-microsoft-security-at-microsoft-ignite-2026/","locator":"Microsoft Security Blog · 2026-09-30T19:31:00.000Z · 快照 2026-10-16T11:58:12.680Z","excerpt":"This year at Microsoft Ignite, we spotlight our AI-first, end-to-end security platform designed to protect identities, devices, data, applications, clouds, infrastructure, and the AI agents now working alongside your teams. The post ​​Secure what’s next: Your guide to Microsoft Security at Microsoft Ignite 2026 appeared first on Microsoft Security Blog .","sourceId":"microsoft-security"},{"id":"rss-f0d9ff57cf8ad301164407ac","kind":"rss","title":"Phishing Abuses RMM Tools for Persistent Access","url":"https://www.microsoft.com/en-us/security/blog/2026/09/29/phishing-abuses-rmm-tools-persistent-access/","locator":"Microsoft Security Blog · 2026-09-29T21:39:27.000Z · 快照 2026-10-16T11:58:12.680Z","excerpt":"Microsoft observed phishing campaigns that abused MSP360 RMM to deploy ScreenConnect, creating redundant remote-access channels for follow-on activity The post Phishing Abuses RMM Tools for Persistent Access appeared first on Microsoft Security Blog .","sourceId":"microsoft-security"},{"id":"rss-973e73a992a9bddedc65ec29","kind":"rss","title":"​​Beyond source code: A path to the keys to the kingdom","url":"https://www.microsoft.com/en-us/security/blog/2026/09/29/beyond-source-code-a-path-to-the-keys-to-the-kingdom/","locator":"Microsoft Security Blog · 2026-09-29T16:00:00.000Z · 快照 2026-10-16T11:58:12.680Z","excerpt":"Explore how Storm-3068 turned a compromised identity into broader cloud access and the steps organizations can take to defend their identities, pipelines, and cloud infrastructure. The post ​​Beyond source code: A path to the keys to the kingdom appeared first on Microsoft Security Blog .","sourceId":"microsoft-security"},{"id":"rss-e51dafe291a232aa1da015f5","kind":"rss","title":"OperTraitors: How Kubernetes Operators Betray Your Security Posture","url":"https://unit42.paloaltonetworks.com/agentic-ai-kubernetes-operator-risks/","locator":"Unit 42 · Palo Alto Networks · 2026-09-29T10:00:48.000Z · 快照 2026-10-16T11:58:12.680Z","excerpt":"We introduce OperTraitor, a tool to audit privileges of Kubernetes operators, identify excessive RBAC risks, and secure non-human identities. The post OperTraitors: How Kubernetes Operators Betray Your Security Posture appeared first on Unit 42 .","sourceId":"unit42"},{"id":"rss-701a80b2cb3d01a0c7e27037","kind":"rss","title":"From Exposure to Lockdown: How AWS Neutralizes Compromised IAM Credentials through Managed Policies","url":"https://unit42.paloaltonetworks.com/detecting-exposed-aws-iam-credentials/","locator":"Unit 42 · Palo Alto Networks · 2026-09-21T10:00:13.000Z · 快照 2026-10-16T11:58:12.680Z","excerpt":"We explore how AWS neutralizes exposed IAM credentials using managed policies, detailing GitHub secret scanning and CloudTrail monitoring strategies. The post From Exposure to Lockdown: How AWS Neutralizes Compromised IAM Credentials through Managed Policies appeared first on Unit 42 .","sourceId":"unit42"},{"id":"rss-82966dd55a5fb7a7f7c3e739","kind":"rss","title":"A Vault with a Heap-View: The Uncomfortable Space Between AgentCore Harness and Identity","url":"https://unit42.paloaltonetworks.com/securing-aws-agentcore-harness-credentials/","locator":"Unit 42 · Palo Alto Networks · 2026-09-18T10:00:36.000Z · 快照 2026-10-16T11:58:12.680Z","excerpt":"Analysis of how default configurations in AWS AgentCore Harness allow prompt injection to exfiltrate credentials, and key steps to secure your agents. The post A Vault with a Heap-View: The Uncomfortable Space Between AgentCore Harness and Identity appeared first on Unit 42 .","sourceId":"unit42"},{"id":"rss-654051a91edbee3d95246a0e","kind":"rss","title":"Atomic macOS (AMOS) Stealer Activity","url":"https://unit42.paloaltonetworks.com/atomic-macos-amos-stealer-activity/","locator":"Unit 42 · Palo Alto Networks · 2026-09-16T10:00:06.000Z · 快照 2026-10-16T11:58:12.680Z","excerpt":"Modern macOS malware uses deceptive setup guides to steal credentials and sensitive user data. Learn how to identify and block these threats. The post Atomic macOS (AMOS) Stealer Activity appeared first on Unit 42 .","sourceId":"unit42"},{"id":"rss-9b778957656662e4101e3983","kind":"rss","title":"Unmasking Cloud Identities: From Behavioral Clustering to Automated Detection","url":"https://unit42.paloaltonetworks.com/behavioral-clustering-map-to-cloud-identities/","locator":"Unit 42 · Palo Alto Networks · 2026-09-14T10:00:01.000Z · 快照 2026-10-16T11:58:12.680Z","excerpt":"We designed a behavioral clustering model to map cloud identity roles from audit logs, enabling continuous threat detection using standard SQL queries. The post Unmasking Cloud Identities: From Behavioral Clustering to Automated Detection appeared first on Unit 42 .","sourceId":"unit42"},{"id":"rss-790f943690344e0748c5ab9a","kind":"rss","title":"The Machine With Many Faces: Post-Exploitation Identity Misuse in SPIFFE/SPIRE","url":"https://unit42.paloaltonetworks.com/kubernetes-spiffe-spire-identity-spoofing/","locator":"Unit 42 · Palo Alto Networks · 2026-09-10T10:00:43.000Z · 快照 2026-10-16T11:58:12.680Z","excerpt":"Learn how root access on a compromised K8s node allows attackers to utilize SPIFFE/SPIRE metadata to spoof and harvest co-located workload identities. The post The Machine With Many Faces: Post-Exploitation Identity Misuse in SPIFFE/SPIRE appeared first on Unit 42 .","sourceId":"unit42"},{"id":"rss-faee20a9511e72882fe4a4c0","kind":"rss","title":"美团智播——数字人直播技术创新与实践","url":"https://tech.meituan.com/2026/09/03/meituan-Digital-Human-practice.html","locator":"美团技术团队 · 原文日期未知 · 快照 2026-10-16T11:58:12.680Z","excerpt":"美团智播围绕 AI 主播「长得真→动得准→演得活→卖得好」构建了完整技术闭环：真人 1:1 复刻、换装换背景身份不跑偏；动作自然流畅，告别「木偶戏」；边说边动、音画一致；背后还有推理加速技术支撑万路并发开播，让普惠落地成为可能。","sourceId":"meituan"}]
relatedNodeIds: ["passkey"]
updated: "2026-10-17"
provenance: "agent-source-synthesis"
aliases: ["身份、钓鱼与会话威胁"]
iconKey: "lead"
iconLabel: "拴绳"
iconReason: "原版物品对应本主题的观察、验证或执行过程"
icon: "/assets/inventory/wiki-icons/lead.png"
---
# 身份、钓鱼与会话威胁

## 如何使用本页

以下内容只来自网站已保存的 RSS 标题和摘要，是外部发布方的表述，不等于站内独立验证。标题可能具有宣传性；没有摘要的条目仅提供线索，不能据标题推断机制、性能或事件事实。请打开原文核实时间、版本与范围。

## 快照中的具体线索

以下保留发布方的标题和摘要，不扩展为已核实结论；其余线索在来源与证据中逐项展开。

AI-Powered Espionage Campaign Targets Government Linux Infrastructure

Our analysis an AI-powered espionage campaign targeting government Linux infrastructure with custom malware, web shells, and advanced credential theft. The post AI-Powered Espionage Campaign Targets Government Linux Infrastructure appeared first on Unit 42 .

来源：Unit 42 · Palo Alto Networks · 2026-10-15T22:00:09.000Z · 快照 2026-10-16T11:58:12.680Z

The hidden network: Inside the phishing infrastructure ecosystem powering global cybercrime

Microsoft uncovered a Chinese-language cybercriminal ecosystem, an interconnected network of phishing kit operators (tracked as Storm-2990), and an illicit marketplace (tracked as Storm-3119) selling tools and infrastructure for large-scale phishing. In collaboration with law enforcement agencies and other partners worldwide, Microsoft’s Digital Crimes Unit (DCU) facilitated a disruption of the ecosystem. The post The hidden network: Inside the phishing infrastructure ecosystem powering global cybercrime appeared first on Microsoft Security Blog .

来源：Microsoft Security Blog · 2026-10-14T13:00:00.000Z · 快照 2026-10-16T11:58:12.680Z

Building agents that transact with Anchor Browser and AgentCore payments

Learn how the AWS Generative AI Innovation Center Partner Agent Factory and Anchor Browser built AI agents that autonomously pay for x402-protected web resources and APIs. Amazon Bedrock AgentCore payments checks budgets, signs transactions, and retries requests without exposing wallet credentials to the agent runtime.

来源：AWS Machine Learning · 2026-10-13T20:10:33.000Z · 快照 2026-10-16T11:58:12.680Z

Share GPU clusters across teams with isolation and fairness using Amazon SageMaker HyperPod

A reference architecture for securely sharing one Amazon SageMaker HyperPod EKS cluster across multiple teams, using AWS IAM Identity Center for authentication, per-team SageMaker Domains and Kubernetes namespaces for isolation, HyperPod Task Governance for fairness, and namespace-level cost allocation for chargeback.

来源：AWS Machine Learning · 2026-10-08T16:20:04.000Z · 快照 2026-10-16T11:58:12.680Z

UAT-11985: AI-assisted event lures delivering real-time Google AitM phishing

Cisco Talos identified an APT spear-phishing campaign against individuals affiliated with Taiwan research organizations. The operation leveraged legitimate public event themes and impersonated reputable academic and policy institutions.

来源：Cisco Talos Intelligence · 2026-10-08T10:01:06.000Z · 快照 2026-10-16T11:58:12.680Z

​​Secure what’s next: Your guide to Microsoft Security at Microsoft Ignite 2026

This year at Microsoft Ignite, we spotlight our AI-first, end-to-end security platform designed to protect identities, devices, data, applications, clouds, infrastructure, and the AI agents now working alongside your teams. The post ​​Secure what’s next: Your guide to Microsoft Security at Microsoft Ignite 2026 appeared first on Microsoft Security Blog .

来源：Microsoft Security Blog · 2026-09-30T19:31:00.000Z · 快照 2026-10-16T11:58:12.680Z

## 相关知识

[[passkey]]

[[index]]
