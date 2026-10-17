---
kind: "node"
id: "backend"
title: "Backend"
description: "后端：理解业务服务、边界与接口协作。"
category: "Software"
tags: ["软件工程","后端","Backend"]
icon: "/assets/inventory/wiki-icons/hopper_minecart.png"
parentIds: ["frontend"]
status: "untracked"
frame: "task"
details: "后端负责处理请求、身份、业务约束和数据访问。接口应明确错误与权限边界；静态站点当前不需要后端，但 Repository 可以为未来接入保留稳定契约。"
learningPoints: ["区分协议错误、业务拒绝和系统失败","在服务端校验权限与输入","按实际需求引入服务，避免提前增加复杂度"]
relatedBlogs: []
relatedPapers: []
aliases: []
domainId: "software"
relatedRss: []
sources: []
relatedNodeIds: ["frontend","database","api"]
updated: "2026-10-17"
provenance: "legacy-concept-note"
iconKey: "hopper_minecart"
iconReason: "漏斗矿车对应请求处理和服务流转"
iconLabel: "漏斗矿车"
---
# Backend

## 概念与适用边界

后端负责处理请求、身份、业务约束和数据访问。接口应明确错误与权限边界；静态站点当前不需要后端，但 Repository 可以为未来接入保留稳定契约。

## 资料边界

这是从既有 Wiki 保留的基础概念说明。当前收录的博客、论文和 RSS 中没有足够直接证据展开该节点；不补造个人实践、公式推导或研究结果。后续补充资料后再扩展。

## 相关知识

[[frontend]] · [[database]] · [[api]]

[[index]]
