---
kind: "node"
id: "http"
title: "HTTP"
description: "HTTP：理解请求、响应、方法与状态码。"
category: "Security"
tags: ["网络安全","Web","HTTP"]
icon: "/assets/inventory/wiki-icons/lead.png"
parentIds: ["tcp-ip"]
status: "untracked"
frame: "task"
details: "HTTP 定义请求与响应的语义，包括方法、状态码、头部和内容。认证、授权、缓存与跨源读取是不同问题；HTTPS 保护传输但不自动修复应用权限错误。"
learningPoints: ["检查方法与状态码是否表达真实结果","区分身份认证、资源授权和 CORS","为私人数据设置适当缓存边界"]
relatedBlogs: []
relatedPapers: []
aliases: []
domainId: "security"
relatedRss: []
sources: []
relatedNodeIds: ["tcp-ip","vulnerability-scanning","passkey"]
updated: "2026-10-17"
provenance: "legacy-concept-note"
iconKey: "lead"
iconReason: "拴绳对应请求入口与认证边界"
iconLabel: "拴绳"
---
# HTTP

## 概念与适用边界

HTTP 定义请求与响应的语义，包括方法、状态码、头部和内容。认证、授权、缓存与跨源读取是不同问题；HTTPS 保护传输但不自动修复应用权限错误。

## 资料边界

这是从既有 Wiki 保留的基础概念说明。当前收录的博客、论文和 RSS 中没有足够直接证据展开该节点；不补造个人实践、公式推导或研究结果。后续补充资料后再扩展。

## 相关知识

[[tcp-ip]] · [[vulnerability-scanning]] · [[passkey]]

[[index]]
