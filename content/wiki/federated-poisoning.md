---
kind: "node"
id: "federated-poisoning"
title: "联邦微调与投毒"
description: "围绕联邦微调构建可复现实验流程，分别分析标签泄露、数据投毒、后门与防御的边界。 · 预印本"
category: "Security"
tags: ["联邦学习","隐私","数据投毒","预印本"]
parentIds: ["intrusion-detection"]
status: "untracked"
frame: "task"
details: "围绕联邦微调构建可复现实验流程，分别分析标签泄露、数据投毒、后门与防御的边界。 · 预印本"
learningPoints: ["标签泄露与数据投毒的目标差异", "参与方及聚合方各自的控制范围", "防御是否保留正常任务效用"]
relatedBlogs: []
relatedPapers: [{"id":"arxiv-2610.21547","title":"Federated Art Chase: Privacy Leakage and Data Poisoning in Federated Fine-Tuning"}]
relatedRss: []
sources: [{"id":"paper-arxiv-2610.21547","kind":"paper","title":"Federated Art Chase: Privacy Leakage and Data Poisoning in Federated Fine-Tuning","url":"#paper/arxiv-2610.21547","locator":"原始 PDF，共 27 页；下方摘要不是全文审读结论","excerpt":"Federated learning (FL) is increasingly used to adapt a pretrained, centrally fine-tuned model to data that remain on user devices, beyond training a model from scratch. In this report, prepared for the 4th Federated Machine Learning International Summer School, we study the privacy and integrity of this approach with a reproducible pipeline. An ImageNet-pretrained MobileNetV4-Conv-Small model is fine-tuned centrally on ten Quick, Draw! classes (97.50% test accuracy) and then adapted with head-only FedAvg over ten non-IID clients, which raises client training accuracy from 90.34% to 91.49% while preserving global accuracy. We evaluate four adversarial scenarios. First, from a single one-step client update, an honest-but-curious server recovers the complete private label set, but its reconstructions follow class prototypes rather than the private drawings (mean SSIM 0.130). Second, from a one-round FedAvg aggregate, label-count recovery falls from 87.5% with one client to 75.0% with five and ten clients, below the 80.0% of an uninformed uniform guess. Third, under FedAvg, a backdoor injected by 30%, 50%, and 100% of the clients reaches an attack success rate (ASR) of 21.9%, 31.3%, and 54.7% at a cost of at most 0.8 percentage points of clean accuracy, whereas label flipping is effective only when most of the source-class data are relabeled. Fourth, FLTrust with a root set retained from centralized fine-tuning lowers the backdoor ASR to 1.8% and 4.0% at 30% and 50% malicious clients and the label-flipping ASR from 12.6% to 0.8% without measurable clean-accuracy loss, but provides no protection when every client is malicious. The report closes with a live session in which participants draw, fine-tune, and poison the model through Indigma's FedMaestro orchestrator. Code and executed notebooks, runnable on Google Colab, are at https://github.com/Indigma-Innovations/fl-summer-school."}]
relatedNodeIds: ["intrusion-detection"]
updated: "2026-10-17"
provenance: "agent-source-synthesis"
aliases: ["联邦学习","隐私","数据投毒"]
iconKey: "spider_eye"
iconLabel: "蜘蛛眼"
iconReason: "蜘蛛眼对应污染训练信号的风险"
icon: "/assets/inventory/wiki-icons/spider_eye.png"
---
# 联邦微调与投毒

## 研究问题

围绕联邦微调构建可复现实验流程，分别分析标签泄露、数据投毒、后门与防御的边界。 · 预印本

出处：paper-arxiv-2610.21547

## 研究资料与阅读入口

《Federated Art Chase: Privacy Leakage and Data Poisoning in Federated Fine-Tuning》；作者：Vasileios Perifanis, Nikolaos Pavlidis；年份：2026。目录标注为预印本，不能据此声称已通过同行评审。站内已提供完整原文；本页根据目录导读和原摘要建立知识入口，不将原文中的实验结果冒充本站实测。

出处：paper-arxiv-2610.21547

## 方法辨析与阅读重点

数据留在参与方并不等于联邦微调没有隐私或完整性风险。研究通过可复现实验流程分别观察标签泄露、投毒、后门与防御。它们属于不同威胁目标，应逐一说明攻击者控制范围、评价指标和防御代价。

以上为基于该节点所引站内论文摘要的 Agent 整理；结果、证明及数值条件须回到原文核对。

## 原摘要与核对边界

Federated learning (FL) is increasingly used to adapt a pretrained, centrally fine-tuned model to data that remain on user devices, beyond training a model from scratch. In this report, prepared for the 4th Federated Machine Learning International Summer School, we study the privacy and integrity of this approach with a reproducible pipeline. An ImageNet-pretrained MobileNetV4-Conv-Small model is fine-tuned centrally on ten Quick, Draw! classes (97.50% test accuracy) and then adapted with head-only FedAvg over ten non-IID clients, which raises client training accuracy from 90.34% to 91.49% while preserving global accuracy. We evaluate four adversarial scenarios. First, from a single one-step client update, an honest-but-curious server recovers the complete private label set, but its reconstructions follow class prototypes rather than the private drawings (mean SSIM 0.130). Second, from a one-round FedAvg aggregate, label-count recovery falls from 87.5% with one client to 75.0% with five and ten clients, below the 80.0% of an uninformed uniform guess. Third, under FedAvg, a backdoor injected by 30%, 50%, and 100% of the clients reaches an attack success rate (ASR) of 21.9%, 31.3%, and 54.7% at a cost of at most 0.8 percentage points of clean accuracy, whereas label flipping is effective only when most of the source-class data are relabeled. Fourth, FLTrust with a root set retained from centralized fine-tuning lowers the backdoor ASR to 1.8% and 4.0% at 30% and 50% malicious clients and the label-flipping ASR from 12.6% to 0.8% without measurable clean-accuracy loss, but provides no protection when every client is malicious. The report closes with a live session in which participants draw, fine-tune, and poison the model through Indigma's FedMaestro orchestrator. Code and executed notebooks, runnable on Google Colab, are at https://github.com/Indigma-Innovations/fl-summer-school.

出处：paper-arxiv-2610.21547

## 相关知识

[[intrusion-detection]]

[[index]]
