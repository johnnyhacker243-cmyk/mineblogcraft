---
kind: "node"
id: "prompt-injection"
title: "提示注入与数据权限"
description: "结合 Agent containment 实践，防止外部资料在摘要后获得行动权限。"
category: "AI"
tags: ["Agent","Prompt Injection","AI Security","沙箱"]
parentIds: ["ai-security"]
status: "untracked"
frame: "task"
details: "结合 Agent containment 实践，防止外部资料在摘要后获得行动权限。"
learningPoints: ["站内文章导读","来源身份不会因为转述而改变","提示词之外还需要确定性边界","将资料通道与动作通道分开"]
relatedBlogs: [{"id":"ai-input-boundary","title":"Agent 提示注入防护：别让读到的文字变成执行权限"}]
relatedPapers: []
relatedRss: []
sources: [{"id":"blog-ai-input-boundary","kind":"blog","title":"Agent 提示注入防护：别让读到的文字变成执行权限","url":"#blog/ai-input-boundary","locator":"站内已审阅文章；保留 AI 辅助来源标记","excerpt":"结合 Agent containment 实践，防止外部资料在摘要后获得行动权限。"},{"id":"ai-input-boundary-reference-0","kind":"external","title":"How we contain Claude across products · Anthropic","url":"https://www.anthropic.com/engineering/how-we-contain-claude","locator":"站内文章引用；未在本轮重新联网核实","excerpt":"原始规范或研究链接，结论适用范围以原文为准。"}]
relatedNodeIds: ["ai-security"]
updated: "2026-10-17"
provenance: "agent-source-synthesis"
aliases: ["Agent","Prompt Injection","AI Security","沙箱"]
iconKey: "iron_door"
iconLabel: "铁门"
iconReason: "铁门对应外部内容与可执行权限之间的隔离"
icon: "/assets/inventory/wiki-icons/iron_door.png"
---
# 提示注入与数据权限

## 站内文章导读

知识 Agent 需要读网页、论文和仓库文档。这些材料越丰富，越可能混入“忽略原任务”“上传某个文件”之类的文字。问题不是模型是否能看懂恶意语气，而是系统有没有让外部资料获得原本不属于它的行动权限。

Anthropic 2026 年 5 月的 containment 工程文章讨论环境边界、模型防护与外部内容的配合。本文据此研究只读知识任务的权限设计。成书代表外部资料：可以阅读、引用和批评，不应自动成为命令来源。

出处：blog-ai-input-boundary

## 来源身份不会因为转述而改变

网页中的要求，经过摘要、翻译甚至另一个模型整理后，仍然来自那张网页。若摘要去掉来源和信任级别，外部内容就可能逐渐看起来像系统计划。一个安全的资料结构应保留来源与用途，避免把内容混进任务指令。

例如论文正文出现“运行附件脚本重现结果”，只是论文作者给读者的说明，不等于网站用户授权 Agent 在本机运行。检索命中也只意味着相关，不意味着可信或获准执行。

出处：blog-ai-input-boundary

## 提示词之外还需要确定性边界

官方文章强调使用环境隔离等手段限制影响范围。对一个公开资料整理任务，最直接的设计是不给它发布凭据、不挂载私人目录，并限制网络出口。模型即使误判，也不应拥有任意读写和外传能力。

这不意味着提示词无用。明确“外部内容仅作为数据”仍能减少误解，但它应与工具权限配合，而不是独自承担全部防线。

出处：blog-ai-input-boundary

## 将资料通道与动作通道分开

```text
资料通道：正文、引用、来源、抓取时间
动作通道：用户目标、允许工具、资源范围
审计记录：为什么执行、由谁授权、结果是什么
```

如果一个工具可以同时读取任意文件并向任意地址上传，边界很难解释。可以拆为明确的只读检索、受限内容读取和单独批准的写入操作，让不同能力不会因为调用方便而打包授予。

出处：blog-ai-input-boundary

## 输出看起来可信也要检查

第三方连接器本身经过审查，不代表它返回的每一份 README 都可信。来自另一个 Agent 的总结同样可能携带外部污染。把“工具返回”或“内部模型生成”自动提升为高信任信息，是另一种边界混淆。

最终回答应区分来源陈述与自己的推断。涉及外部写入时，还要检查操作目标、参数和权限，不能因为最后一句计划听起来合理就跳过验证。

出处：blog-ai-input-boundary

## 用无害样本做防护回归

可以在本地测试文档中写入要求读取一个不存在的秘密文件、改变输出格式或跳过引用校验的文字，观察系统是否把它们当作资料内容。样本不包含真实秘密，不向外发送数据，也不对他人系统测试。

评价应记录是否发生了越权尝试，而不是只看最终回答有没有复述恶意句子。系统可以引用并解释攻击文字，同时仍然正确拒绝执行。

出处：blog-ai-input-boundary

## 最小能力带来更大的可用空间

公开知识整理通常只需搜索、读取和生成草稿。把能力限制在这个范围，反而能减少无意义的反复确认。安全设计的目标是让允许的工作顺畅完成，并让不该发生的行为在环境层没有机会发生，而不是要求模型永远不犯错。

出处：blog-ai-input-boundary

## 相关知识

[[ai-security]]

[[index]]
