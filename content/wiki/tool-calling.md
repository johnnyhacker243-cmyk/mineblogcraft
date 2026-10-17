---
kind: "node"
id: "tool-calling"
title: "MCP 工具与执行契约"
category: "AI"
description: "阅读 MCP 2026 工具规范，梳理 Schema、显式句柄、授权与幂等语义。"
tags: ["Tool Calling","受约束的结构化工具接口","MCP","JSON Schema","Agent"]
icon: "/assets/inventory/wiki-icons/iron_axe.png"
parentIds: ["agent"]
status: "untracked"
frame: "goal"
details: "阅读 MCP 2026 工具规范，梳理 Schema、显式句柄、授权与幂等语义。"
learningPoints: ["站内文章导读","Schema 应表达真实约束","合法参数仍然可能越权","状态需要显式身份"]
relatedBlogs: [{"id":"ai-tool-contract","title":"读 MCP 2026 工具规范：Schema 能管参数，不能替你授权"}]
relatedPapers: []
aliases: ["工具调用","MCP","Tool Calling","JSON Schema","Agent"]
domainId: "ai"
relatedRss: []
sources: [{"id":"blog-ai-tool-contract","kind":"blog","title":"读 MCP 2026 工具规范：Schema 能管参数，不能替你授权","url":"#blog/ai-tool-contract","locator":"站内已审阅文章；保留 AI 辅助来源标记","excerpt":"阅读 MCP 2026 工具规范，梳理 Schema、显式句柄、授权与幂等语义。"},{"id":"ai-tool-contract-reference-0","kind":"external","title":"MCP 2026-07-28 · Tools 规范","url":"https://modelcontextprotocol.io/specification/2026-07-28/server/tools","locator":"站内文章引用；未在本轮重新联网核实","excerpt":"原始规范或研究链接，结论适用范围以原文为准。"}]
relatedNodeIds: ["agent","mcp-authorization","mcp-capabilities","effect-authorization"]
updated: "2026-10-17"
provenance: "agent-source-synthesis"
iconKey: "iron_axe"
iconReason: "铁斧对应受约束的工具执行"
iconLabel: "铁斧"
---
# MCP 工具与执行契约

## 概念与适用边界

工具调用把模型提出的行动转成结构化请求。工具层负责验证名称、参数、授权范围与返回结果；不能把自由文本直接当作可执行命令。

## 站内文章导读

把自然语言意图转成工具调用，是 Agent 从聊天走向执行的关键一步。但“模型填出了一份 JSON”仍然不意味着调用可靠。参数可能合法却越权，工具可能成功返回却没有完成目标，重试还可能重复产生副作用。

本文阅读 MCP 2026-07-28 的工具规范，研究输入、输出与状态句柄的设计。红石粉代表结构化信号：连接清楚，才能知道动作从哪里来、结果传向哪里。

出处：blog-ai-tool-contract

## Schema 应表达真实约束

工具规范使用输入 Schema 描述参数，也提供输出结构约束。对于搜索工具，query、limit 与过滤条件应具有明确类型和范围；不要把所有参数压成一个字符串，再让服务端猜测模型本来想做什么。

下面只是领域契约示意，不是完整 MCP 消息：

```json
{
  "query": "RAG",
  "domain": "ai",
  "limit": 10
}
```

query 为空、limit 过大、domain 不存在时，应在执行前反馈清楚。良好错误帮助模型修正输入，却不应泄露内部路径或凭据。

出处：blog-ai-tool-contract

## 合法参数仍然可能越权

Schema 能说明 paperId 是字符串，不能说明当前用户有权读这篇论文。对象授权必须在服务执行时检查。类似地，readOnlyHint 一类描述信息不应该被误当成操作系统层面的只读限制。

把“允许调用”和“允许操作哪个对象”分开，工具才不会因为模型选中了一个正确格式的 ID 就越过访问边界。这与前一篇安全文章的授权链相互呼应。

出处：blog-ai-tool-contract

## 状态需要显式身份

本版本工具文档讨论显式句柄：跨调用状态不能只依赖隐含连接记忆。若创建一个阅读会话，应返回明确的会话 ID，后续调用携带它。句柄本身是名称还是能力，还要由身份和授权设计决定。

工具返回“会话已创建”，却没有可复用标识，模型只能反复猜测当前会话是哪一个。显式 ID 也方便取消、过期与审计，但不应把可猜测 ID 当成访问凭证。

出处：blog-ai-tool-contract

## 重试之前先问是否有副作用

搜索失败通常可以重试；发布文章超时则不同，远端可能已经成功。应先查询操作状态，或通过幂等键避免重复发布。工具名叫 publish 并不自动提供幂等保证，客户端需要知道其具体语义。

输出最好区分已接受、已完成和失败。Agent 最终应根据可检查的远端状态或产物回答，而不是把 HTTP 200、工具成功标记与用户目标完成混为一谈。

出处：blog-ai-tool-contract

## 一份值得保留的契约测试

准备缺少字段、未知字段、边界数值、错误句柄、已过期句柄和重复请求。先验证服务拒绝不合法调用，再检查合法调用返回可解释结果。工具输出中的外部文本仍视为数据，不允许它修改权限或覆盖用户目标。

对当前知识网站，先定义只读搜索与文章读取接口就足够。不需要为了研究 MCP 立刻接入执行服务器。清晰的参数、稳定身份和可验证结果，是未来接 Agent 时比工具数量更重要的基础。

出处：blog-ai-tool-contract

## 相关知识

[[agent]] · [[mcp-authorization]] · [[mcp-capabilities]] · [[effect-authorization]]

[[index]]
