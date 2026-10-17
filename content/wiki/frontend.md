---
kind: "node"
id: "frontend"
title: "界面与个人网站"
description: "记录一个Minecraft风格个人技术博客的设计与开发过程"
category: "Software"
tags: ["软件工程","前端","React","Frontend","Minecraft","Web","AI","Software Engineering"]
icon: "/assets/inventory/wiki-icons/painting.png"
parentIds: []
status: "untracked"
frame: "goal"
details: "记录一个Minecraft风格个人技术博客的设计与开发过程"
learningPoints: ["项目起源","技术架构","设计参考","当前功能"]
relatedBlogs: [{"id":"mineblogcraft-birth","title":"Mineblogcraft 的诞生"}]
relatedPapers: []
aliases: ["Minecraft","Web","AI","Software Engineering"]
domainId: "software"
relatedRss: []
sources: [{"id":"blog-mineblogcraft-birth","kind":"blog","title":"Mineblogcraft 的诞生","url":"#blog/mineblogcraft-birth","locator":"站内已审阅文章；保留 AI 辅助来源标记","excerpt":"记录一个Minecraft风格个人技术博客的设计与开发过程"}]
relatedNodeIds: ["backend","react-state"]
updated: "2026-10-17"
provenance: "agent-source-synthesis"
iconKey: "painting"
iconReason: "画对应用户可见界面及其状态"
iconLabel: "画"
---
# 界面与个人网站

## 概念与适用边界

前端把数据和交互状态转化为用户界面。可访问性、输入反馈、错误提示和不同窗口尺寸都是功能的一部分；视觉一致性不能代替数据与状态正确。

## 项目起源

Mineblogcraft 是一个属于我的数字世界。这次开发把 Minecraft 游戏界面作为个人技术博客的入口：学习新的知识，就挖下来；有新的想法，就建起来。

出处：blog-mineblogcraft-birth

## 技术架构

前端使用 Vite、React、TypeScript 和 Three.js。主菜单使用六面旋转全景，作者页面用三维 Steve 展示玩家档案。按钮、方块及像素字体来自获授权的本地 Minecraft 1.21.1 客户端，原版素材保留本地。
博客数据存放在静态 JSON 中，由 BlogRepository 提供读取接口，BlogService 负责搜索。页面只依赖服务，未来可以换成 API 数据源。

出处：blog-mineblogcraft-birth

## 设计参考

首页参考 Minecraft 主菜单；作者介绍参考创造模式背包；博客入口参考单人游戏的世界选择界面；文章阅读采用暂停菜单式暗色半透明背景。每篇文章都是一个知识世界。

出处：blog-mineblogcraft-birth

## 当前功能

已实现游戏式首页、作者介绍、博客世界列表、文章阅读及静态 RSS。博客列表支持标题、简介、标签与分类搜索。Wiki 知识树、Research 书籍系统与外部 RSS 阅读器现已实现；新内容持续整理中。

出处：blog-mineblogcraft-birth

## 未来规划

继续完善 Wiki 与 Research 内容，将学习记录、项目实践和资料整理融入方块世界。后续再研究 AI 辅助与知识管理功能，以及数据库和后台接口；本阶段只开发本地前端。

欢迎来到我的技术世界。

出处：blog-mineblogcraft-birth

## 相关知识

[[backend]] · [[react-state]]

[[index]]
