---
kind: "node"
id: "mcp-authorization"
title: "MCP 身份与对象授权"
description: "沿 MCP 调用链拆解身份、范围与对象授权，避免令牌转发越过资源边界。"
category: "Security"
tags: ["MCP","OAuth","授权","网络安全"]
parentIds: ["network"]
status: "untracked"
frame: "task"
details: "沿 MCP 调用链拆解身份、范围与对象授权，避免令牌转发越过资源边界。"
learningPoints: ["站内文章导读","令牌不是通用通行证","身份、范围与对象分别检查","工具描述不是执行策略"]
relatedBlogs: [{"id":"network-security-foundation","title":"MCP 授权边界：工具连通以后，谁有权做什么"}]
relatedPapers: []
relatedRss: []
sources: [{"id":"blog-network-security-foundation","kind":"blog","title":"MCP 授权边界：工具连通以后，谁有权做什么","url":"#blog/network-security-foundation","locator":"站内已审阅文章；保留 AI 辅助来源标记","excerpt":"沿 MCP 调用链拆解身份、范围与对象授权，避免令牌转发越过资源边界。"},{"id":"network-security-foundation-reference-0","kind":"external","title":"MCP 2026-07-28 · Security Best Practices","url":"https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/security_best_practices","locator":"站内文章引用；未在本轮重新联网核实","excerpt":"原始规范或研究链接，结论适用范围以原文为准。"}]
relatedNodeIds: ["network","mcp-capabilities","rag-privacy","private-ann","effect-authorization"]
updated: "2026-10-17"
provenance: "agent-source-synthesis"
aliases: ["MCP","OAuth","授权","网络安全"]
iconKey: "lead"
iconLabel: "拴绳"
iconReason: "拴绳对应身份通过之后的对象权限检查"
icon: "/assets/inventory/wiki-icons/lead.png"
---
# MCP 身份与对象授权

## 站内文章导读

给 Agent 接上一个文件或搜索工具，演示通常停在“调用成功”。真实系统更难回答的是：这次调用代表哪个用户，可以访问哪些记录，凭据究竟发给谁？工具越多，身份边界越容易被一个方便的转发逻辑抹平。

本文以 MCP 2026-07-28 的安全最佳实践为阅读对象，研究网络工具的授权设计，不涉及访问任何第三方目标。铁剑代表权限边界：工具有行动能力，也必须有明确限制。

出处：blog-network-security-foundation

## 令牌不是通用通行证

官方文档反对 token passthrough：MCP 服务不应接收并原样转发本来发给其他资源的令牌，令牌的资源受众需要验证。实质是避免身份凭据跨服务串用，而不是判断字符串是否“长得像 token”。

设想论文代理同时连接公开目录和私人笔记。即使两者由同一团队维护，目录访问令牌也不应自然获得笔记权限。调用链每一跳都应知道自己接受的凭据面向哪个资源，不能因为上游已经登录就放弃本层检查。

出处：blog-network-security-foundation

## 身份、范围与对象分别检查

身份回答“谁在调用”，scope 回答“允许哪类操作”，对象授权回答“允许操作哪条记录”。只检查 papers:read，仍可能让用户读取他人的未公开论文。仅隐藏前端按钮没有用，接口可以被直接调用。

```text
验证签发方、受众和有效期
→ 验证操作范围
→ 验证目标对象访问权
→ 执行并保留审计记录
```

这是检查链，不是可复制的认证实现。令牌格式和签名验证应使用成熟身份组件，不能自行做一次字符串比较就声称认证完成。

出处：blog-network-security-foundation

## 工具描述不是执行策略

描述中写“只读，请勿删除”，能帮助模型理解用途，却阻止不了服务端真正删除文件。只读应该落实在操作集合、挂载方式、数据库角色和网络权限上。模型提出越权参数时，服务应明确拒绝，而不是期待模型自行纠正。

权限还要按任务收缩。整理公开 RSS 摘要无需发布凭据；读取论文元数据不应默认拥有上传、覆盖全文的能力。能力是否存在，比提示词写得多严厉更值得检查。

出处：blog-network-security-foundation

## 日志要能追溯，也不能泄密

日志可保存请求标识、主体、工具名、资源和授权结果，不应记录完整令牌与私人正文。拒绝事件同样有价值：某个工具频繁请求不存在的权限，可能暴露配置错误，也可能说明任务范围被误解。

本地用例应覆盖过期凭据、错误受众、缺少范围、跨用户对象访问和撤销后的重试。它们应在操作发生前被拒绝，日志还能区分原因。这里提出验证方案，没有宣称已经完成生产服务的安全评估。

出处：blog-network-security-foundation

## 先建立边界，再增加能力

静态知识网站不必为了“以后接 Agent”提前引入登录和后端。可以先在接口契约中保留资源 ID、只读操作和数据来源。真正增加写入时，再设计独立身份与最小权限，避免演示凭据悄悄变成长期基础设施。

出处：blog-network-security-foundation

## 相关知识

[[network]] · [[mcp-capabilities]] · [[rag-privacy]] · [[private-ann]] · [[effect-authorization]]

[[index]]
