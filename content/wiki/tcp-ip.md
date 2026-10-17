---
kind: "node"
id: "tcp-ip"
title: "TCP/IP"
description: "TCP/IP：梳理网络协议分层及通信过程。"
category: "Security"
tags: ["网络安全","协议","TCP/IP"]
icon: "/assets/inventory/wiki-icons/ender_pearl.png"
parentIds: ["network"]
status: "untracked"
frame: "task"
details: "IP 提供寻址与转发，TCP 在其上管理连接、字节流与可靠传输。TCP 不定义应用消息边界，也不替代 TLS 或应用层认证。"
learningPoints: ["解释序列号、确认与重传的作用","区分连接失败和应用响应错误","识别代理、防火墙和负载均衡的影响"]
relatedBlogs: []
relatedPapers: []
aliases: ["TCP/IP","传输协议"]
domainId: "security"
relatedRss: []
sources: []
relatedNodeIds: ["network","http","asset-discovery"]
updated: "2026-10-17"
provenance: "legacy-concept-note"
iconKey: "ender_pearl"
iconReason: "末影珍珠对应端点之间的传输与到达"
iconLabel: "末影珍珠"
---
# TCP/IP

## 概念与适用边界

IP 提供寻址与转发，TCP 在其上管理连接、字节流与可靠传输。TCP 不定义应用消息边界，也不替代 TLS 或应用层认证。

## 资料边界

这是从既有 Wiki 保留的基础概念说明。当前收录的博客、论文和 RSS 中没有足够直接证据展开该节点；不补造个人实践、公式推导或研究结果。后续补充资料后再扩展。

## 相关知识

[[network]] · [[http]] · [[asset-discovery]]

[[index]]
