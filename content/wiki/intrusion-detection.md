---
kind: "node"
id: "intrusion-detection"
title: "Intrusion Detection"
category: "Security"
description: "基于网络流量与事件识别异常"
tags: ["Intrusion Detection","基于网络流量与事件识别异常"]
icon: "/assets/inventory/wiki-icons/spectral_arrow.png"
parentIds: ["vulnerability-scanning"]
status: "untracked"
frame: "goal"
details: "入侵检测根据网络流量或事件特征识别异常。数据划分与部署分布会影响指标，准确率需要与误报、漏报和时延共同解释。"
learningPoints: ["核对数据集、标签与特征来源","避免同源流量泄漏到测试集","记录分布变化和部署条件的限制"]
relatedBlogs: []
relatedPapers: []
aliases: ["入侵检测","NIDS"]
domainId: "security"
relatedRss: []
sources: []
relatedNodeIds: ["vulnerability-scanning","federated-poisoning","federated-nids","rss-threats"]
updated: "2026-10-17"
provenance: "legacy-concept-note"
iconKey: "spectral_arrow"
iconReason: "光灵箭对应标记异常与检测证据"
iconLabel: "光灵箭"
---
# Intrusion Detection

## 概念与适用边界

入侵检测根据网络流量或事件特征识别异常。数据划分与部署分布会影响指标，准确率需要与误报、漏报和时延共同解释。

## 资料边界

这是从既有 Wiki 保留的基础概念说明。当前收录的博客、论文和 RSS 中没有足够直接证据展开该节点；不补造个人实践、公式推导或研究结果。后续补充资料后再扩展。

## 相关知识

[[vulnerability-scanning]] · [[federated-poisoning]] · [[federated-nids]] · [[rss-threats]]

[[index]]
