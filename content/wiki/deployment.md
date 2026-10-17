---
kind: "node"
id: "deployment"
title: "静态发布与产物证明"
category: "Software"
description: "用产物身份贯通构建、测试与静态交付，避免验证对象和发布对象错位。"
tags: ["Deployment","可复现构建与经过验证的交付","Artifact","Attestation","静态托管","CI"]
icon: "/assets/inventory/wiki-icons/chest_minecart.png"
parentIds: ["testing"]
status: "untracked"
frame: "goal"
details: "用产物身份贯通构建、测试与静态交付，避免验证对象和发布对象错位。"
learningPoints: ["站内文章导读","把源码、构建与发布对象连起来","尽量只构建一次","内容文件也是发布契约的一部分"]
relatedBlogs: [{"id":"software-static-delivery","title":"静态发布也需要来源证明：让通过测试的文件成为最终产物"}]
relatedPapers: []
aliases: ["部署","静态交付","Deployment","Artifact","Attestation","静态托管","CI"]
domainId: "software"
relatedRss: []
sources: [{"id":"blog-software-static-delivery","kind":"blog","title":"静态发布也需要来源证明：让通过测试的文件成为最终产物","url":"#blog/software-static-delivery","locator":"站内已审阅文章；保留 AI 辅助来源标记","excerpt":"用产物身份贯通构建、测试与静态交付，避免验证对象和发布对象错位。"},{"id":"software-static-delivery-reference-0","kind":"external","title":"GitHub Docs · Use artifact attestations","url":"https://docs.github.com/en/actions/how-tos/secure-your-work/use-artifact-attestations/use-artifact-attestations","locator":"站内文章引用；未在本轮重新联网核实","excerpt":"原始规范或研究链接，结论适用范围以原文为准。"}]
relatedNodeIds: ["testing","fde-delivery","rss-delivery"]
updated: "2026-10-17"
provenance: "agent-source-synthesis"
iconKey: "chest_minecart"
iconReason: "运输矿车对应交付已验证产物"
iconLabel: "运输矿车"
---
# 静态发布与产物证明

## 概念与适用边界

交付包括构建、验证与发布三个阶段。静态产物可以先在本地检查，发布则改变线上状态；当分支绑定自动部署时，推送也具有发布效果。

## 站内文章导读

一个网站在本地通过测试，上传后却无法读取正文，可能不是代码突然变坏，而是发布的根本不是同一份产物。遗漏公共目录、重复构建使用不同环境、缓存继续引用旧脚本，都能打断“测试通过”与“用户可用”之间的联系。

本文结合 GitHub 产物来源证明文档，研究静态网站的交付链。这里只提出设计与验证步骤，不修改当前远程部署。运输矿车代表运送同一份货物：经过检查的箱子，最终也应该是被交付的那个箱子。

出处：blog-software-static-delivery

## 把源码、构建与发布对象连起来

源码提交说明代码身份，构建记录说明由什么环境生成，产物摘要说明文件是否一致。来源证明可以帮助建立这些关联，但不能自动保证代码没有漏洞、内容优质或许可完整。

因此验证来源证明时，还要确认预期仓库和工作流等身份条件，而不是只看到“有签名”就信任。签名来自谁、声明了什么，和签名本身是否有效，同样重要。

出处：blog-software-static-delivery

## 尽量只构建一次

若测试阶段构建一份，发布阶段又重新安装依赖并构建另一份，测试证据就不再直接对应上传对象。更清楚的流程是构建、验证、保存不可变产物，再把该产物交给发布步骤。

```text
固定输入 → 构建产物 A
→ 检查 A → 记录 A 的摘要
→ 发布 A → 读取并核对关键资源
```

这个设计不要求立刻搭建大型平台。即使手工部署，也可以保留压缩包摘要和文件清单，避免凭目录名字认定“应该是最新的”。

出处：blog-software-static-delivery

## 内容文件也是发布契约的一部分

代码打包器可能只处理模块依赖，而 Markdown、图标、PDF worker 和游戏文件仍依赖额外复制。入口正常不能证明这些资源齐全。清单应区分首屏必需、阅读时加载与游戏入口加载，逐类验证。

外部论文不宜为了“构建全绿”偷偷换成占位说明。资源缺失应报告明确错误，或保留合法的原始链接。用户选择阅读全文时，需要知道得到的是原文、笔记还是仅有元数据。

出处：blog-software-static-delivery

## 缓存策略要允许版本过渡

带内容哈希的脚本可以长期缓存，入口与内容索引则需要合适的更新策略。删除旧脚本过早，可能让仍持有旧入口的用户访问失败；完全不更新入口，又会让新内容长期不可见。

这里没有一个适用于所有托管平台的万能配置。先观察入口、脚本和内容的缓存头与实际版本，再设计发布顺序及回退。不要把所有访问问题都归结为“浏览器清缓存”。

出处：blog-software-static-delivery

## 交付验证应从用户路径出发

至少检查首页、博客深链、正文读取、图标请求、论文 worker 与独立游戏入口。记录具体 URL、状态码和返回类型；一个本应是 JSON 的地址返回 HTML 首页，即使状态是 200，也属于错误。

对个人知识系统，可靠交付的目标并不复杂：来源清楚、产物一致、失败可解释、回退有据。先把这条链打通，再考虑增加更多自动化，才不会把尚未理解的错误更快地重复发布。

出处：blog-software-static-delivery

## 相关知识

[[testing]] · [[fde-delivery]] · [[rss-delivery]]

[[index]]
