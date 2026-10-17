---
kind: "node"
id: "supply-chain"
title: "SBOM 与供应链证据"
category: "Security"
description: "从 CycloneDX 清单走向组件身份、实际暴露面与可复查的处置证据。"
tags: ["Supply Chain Security","源码、依赖、构建与发布的信任链","SBOM","CycloneDX","Supply Chain","依赖","漏洞"]
icon: "/assets/inventory/wiki-icons/chain.png"
parentIds: ["incident-response"]
status: "untracked"
frame: "goal"
details: "从 CycloneDX 清单走向组件身份、实际暴露面与可复查的处置证据。"
learningPoints: ["站内文章导读","清单先解决身份问题","漏洞命中需要结合部署判断","清单必须对应一次具体构建"]
relatedBlogs: [{"id":"security-supply-chain","title":"SBOM 不是安全证书：从组件清单走向可行动的风险判断"}]
relatedPapers: []
aliases: ["供应链安全","SBOM","CycloneDX","Supply Chain","依赖","漏洞"]
domainId: "security"
relatedRss: []
sources: [{"id":"blog-security-supply-chain","kind":"blog","title":"SBOM 不是安全证书：从组件清单走向可行动的风险判断","url":"#blog/security-supply-chain","locator":"站内已审阅文章；保留 AI 辅助来源标记","excerpt":"从 CycloneDX 清单走向组件身份、实际暴露面与可复查的处置证据。"},{"id":"security-supply-chain-reference-0","kind":"external","title":"CycloneDX · Specification Overview","url":"https://cyclonedx.org/specification/overview/","locator":"站内文章引用；未在本轮重新联网核实","excerpt":"原始规范或研究链接，结论适用范围以原文为准。"}]
relatedNodeIds: ["incident-response","trusted-publishing","agent-provenance"]
updated: "2026-10-17"
provenance: "agent-source-synthesis"
iconKey: "chain"
iconReason: "锁链对应依赖、身份和构建链条"
iconLabel: "锁链"
---
# SBOM 与供应链证据

## 概念与适用边界

供应链安全追踪源码、依赖、构建环境和产物之间的信任关系。锁文件、校验和与签名分别提供不同证据，不能用单一措施代替来源和权限检查。

## 站内文章导读

一份软件物料清单能告诉我们系统装了什么，但不能单独回答“现在是否安全”。同一组件在开发工具、浏览器脚本和服务器请求处理链中，暴露面不同；有漏洞编号，也不代表当前部署能触达相同路径。

本文阅读 CycloneDX 的规范概览，讨论小型前端项目怎样使用组件清单。规范是持续演进的资料，本文不凭当前页面臆造某个历史版本发布日期。收纳袋象征把组件整理到一起，袋里装得齐不等于每件东西都已经安全。

出处：blog-security-supply-chain

## 清单先解决身份问题

SBOM 可以表达组件、版本与依赖关系等信息。第一步是让报告中的名字对应到真正进入产物的对象，而不是看到 package.json 中有一个名字，就认为它必然出现在浏览器运行时。

开发依赖可能影响构建过程，运行依赖可能进入最终脚本，静态资源还可能来自独立导入步骤。只扫描一个目录，会遗漏部分供应链；把所有对象混在一起，又难以确定优先级。

出处：blog-security-supply-chain

## 漏洞命中需要结合部署判断

设想一个解析库存在特定输入触发的问题。应继续确认实际版本、输入是否可控、相关功能是否启用以及运行权限。这个分析用于确定处置顺序，不是用“理论上不可达”作为永不更新的借口。

```text
组件身份 → 版本与来源
→ 受影响条件 → 当前使用路径
→ 修复或缓解 → 复查证据
```

每个箭头都可能有信息缺口。缺口应标成待确认，不应自动填成“无风险”。扫描器无法识别使用方式时，需要结合代码和部署配置补足判断。

出处：blog-security-supply-chain

## 清单必须对应一次具体构建

同一个仓库的不同提交、锁文件和构建环境，可能产生不同产物。报告若没有关联构建身份，过几周就难以回答它到底描述哪一次发布。

可以保存提交 ID、锁文件摘要和产物摘要的关联。摘要证明对象是否相同，不证明组件没有漏洞；签名证明来源关系，也不是对代码行为作保证。把这些证据分开，才不容易过度解释某个绿色标记。

出处：blog-security-supply-chain

## 对静态知识站点的额外提醒

PDF 渲染器、XML 解析器和游戏客户端都值得纳入资源盘点，但它们的运行位置不同。XML 解析发生在构建阶段，PDF 展示发生在浏览器，游戏资源按独立入口加载。风险处置也应结合相应输入与权限。

原版材质和外部论文还涉及许可问题。许可证清单与漏洞清单可以关联，却不能互相替代；没有漏洞不意味着允许再分发，许可明确也不意味着可以执行文档中的脚本。

出处：blog-security-supply-chain

## 从一次清单走向持续复查

先建立固定构建下的组件清单，再为重要依赖记录更新来源和复查日期。版本变化后重新生成，并检查新增组件与权限。不要只在项目完成时生成一次，然后把它长期展示为“已安全”。

SBOM 的价值是让讨论有明确对象：哪一个组件、哪个版本、哪次构建、由什么证据判断。能推动实际修复与更新的清单，比条目很多却无人解释的报告更有用。

出处：blog-security-supply-chain

## 相关知识

[[incident-response]] · [[trusted-publishing]] · [[agent-provenance]]

[[index]]
