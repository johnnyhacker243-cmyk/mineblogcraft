---
kind: "node"
id: "federated-nids"
title: "联邦入侵检测与安全聚合"
description: "联邦学习、同态加密与工业物联网入侵检测 · 英文原文"
category: "Security"
tags: ["联邦学习","入侵检测","隐私保护","已发表研究"]
parentIds: ["intrusion-detection"]
status: "untracked"
frame: "task"
details: "联邦学习、同态加密与工业物联网入侵检测 · 英文原文"
learningPoints: ["联邦参与方与数据划分的设定", "安全聚合与梯度相似性如何配合", "检测性能和隐私代价是否分别评价"]
relatedBlogs: []
relatedPapers: [{"id":"nids-fgpa","title":"NIDS-FGPA: A federated learning network intrusion detection algorithm based on secure aggregation of gradient similarity models"}]
relatedRss: []
sources: [{"id":"paper-nids-fgpa","kind":"paper","title":"NIDS-FGPA: A federated learning network intrusion detection algorithm based on secure aggregation of gradient similarity models","url":"#paper/nids-fgpa","locator":"已有结构化原文","excerpt":"With the rapid development of Industrial Internet of Things (IIoT), network security issues have become increasingly severe, making intrusion detection one of the key technologies for ensuring IIoT security. However, existing intrusion detection systems face challenges such as incomplete data features, missing labels, parameter leakage, and high communication overhead. To address these challenges, this paper proposes a federated learning-based intrusion detection algorithm (NIDS-FGPA) that utilizes gradient similarity model aggregation. This algorithm leverages a federated learning architecture and combines it with Paillier homomorphic encryption technology to ensure the security of the training process. Additionally, the paper introduces the Gradient Similarity Model Aggregation (GSA) algorithm, which dynamically selects and weights updates from different models to reduce communication overhead. Finally, the paper designs a deep learning model based on two-dimensional convolutional neural networks and bidirectional gated recurrent units (2DCNN-BIGRU) to handle incomplete data features and missing labels in network traffic data. Experimental validation on the Edge-IIoTset and CIC IoT 2023 datasets achieves accuracies of 94.5% and 99.2%, respectively. The results demonstrate that the NIDS-FGPA model possesses the ability to identify and capture complex network attacks, significantly enhancing the overall security of the network."}]
relatedNodeIds: ["intrusion-detection"]
updated: "2026-10-17"
provenance: "agent-source-synthesis"
aliases: ["联邦学习","入侵检测","隐私保护"]
iconKey: "iron_chestplate"
iconLabel: "铁胸甲"
iconReason: "铁胸甲对应分布式防御与数据保护"
icon: "/assets/inventory/wiki-icons/iron_chestplate.png"
---
# 联邦入侵检测与安全聚合

## 研究问题

联邦学习、同态加密与工业物联网入侵检测 · 英文原文

出处：paper-nids-fgpa

## 研究资料与阅读入口

《NIDS-FGPA: A federated learning network intrusion detection algorithm based on secure aggregation of gradient similarity models》；作者：JiaMing Wang, Kai Yang, MinJing Li；年份：2024。目录收录的已发表外部研究。站内已提供完整原文；本页根据目录导读和原摘要建立知识入口，不将原文中的实验结果冒充本站实测。

出处：paper-nids-fgpa

## 方法辨析与阅读重点

NIDS-FGPA 的站内原文围绕工业物联网入侵检测，讨论联邦学习、同态加密与梯度相似性相关的安全聚合。阅读时分别检查检测能力、通信与计算代价，以及隐私保护依赖的假设；它们不能互相替代。

以上为基于该节点所引站内论文摘要的 Agent 整理；结果、证明及数值条件须回到原文核对。

## 原摘要与核对边界

With the rapid development of Industrial Internet of Things (IIoT), network security issues have become increasingly severe, making intrusion detection one of the key technologies for ensuring IIoT security. However, existing intrusion detection systems face challenges such as incomplete data features, missing labels, parameter leakage, and high communication overhead. To address these challenges, this paper proposes a federated learning-based intrusion detection algorithm (NIDS-FGPA) that utilizes gradient similarity model aggregation. This algorithm leverages a federated learning architecture and combines it with Paillier homomorphic encryption technology to ensure the security of the training process. Additionally, the paper introduces the Gradient Similarity Model Aggregation (GSA) algorithm, which dynamically selects and weights updates from different models to reduce communication overhead. Finally, the paper designs a deep learning model based on two-dimensional convolutional neural networks and bidirectional gated recurrent units (2DCNN-BIGRU) to handle incomplete data features and missing labels in network traffic data. Experimental validation on the Edge-IIoTset and CIC IoT 2023 datasets achieves accuracies of 94.5% and 99.2%, respectively. The results demonstrate that the NIDS-FGPA model possesses the ability to identify and capture complex network attacks, significantly enhancing the overall security of the network.

出处：paper-nids-fgpa

## 相关知识

[[intrusion-detection]]

[[index]]
