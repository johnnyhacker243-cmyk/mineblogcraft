---
kind: "node"
id: "agent"
title: "Agent 长任务与恢复"
description: "从长任务 harness 研究出发，设计可恢复的任务账本、产物验收与失败预算。"
category: "AI"
tags: ["智能体","Agent","agent","harness","长任务","AI"]
icon: "/assets/inventory/wiki-icons/compass_00.png"
parentIds: ["llm"]
status: "untracked"
frame: "challenge"
details: "从长任务 harness 研究出发，设计可恢复的任务账本、产物验收与失败预算。"
learningPoints: ["站内文章导读","从回答质量转向交付条件","把进度放在模型之外","先打通一篇，再扩展二十篇"]
relatedBlogs: [{"id":"ai-from-llm-to-agent","title":"Agent 的长任务难题：怎样把“继续做”变成可靠交付"}]
relatedPapers: []
aliases: ["智能体","代理","agent","harness","长任务","AI"]
domainId: "ai"
relatedRss: []
sources: [{"id":"blog-ai-from-llm-to-agent","kind":"blog","title":"Agent 的长任务难题：怎样把“继续做”变成可靠交付","url":"#blog/ai-from-llm-to-agent","locator":"站内已审阅文章；保留 AI 辅助来源标记","excerpt":"从长任务 harness 研究出发，设计可恢复的任务账本、产物验收与失败预算。"},{"id":"ai-from-llm-to-agent-reference-0","kind":"external","title":"Harness design for long-running application development","url":"https://www.anthropic.com/engineering/harness-design-long-running-apps","locator":"站内文章引用；未在本轮重新联网核实","excerpt":"原始规范或研究链接，结论适用范围以原文为准。"}]
relatedNodeIds: ["llm","ai-security","tool-calling","agent-memory","gui-code-agent","rss-agent"]
updated: "2026-10-17"
provenance: "agent-source-synthesis"
iconKey: "compass_00"
iconReason: "指南针对应目标、状态与下一步行动"
iconLabel: "指南针"
---
# Agent 长任务与恢复

## 概念与适用边界

智能体将模型与观察、工具调用和反馈循环连接起来。程序负责检查工具权限、参数和执行结果；停止条件与失败恢复决定系统能否稳定完成任务。

## 站内文章导读

一个 Agent 能写出漂亮的计划，不代表它能在半小时后交付正确结果。连续处理多个文件时，它可能忘记验收条件、重复已经完成的工作，或者把“工具调用成功”当成“用户目标完成”。模型越来越强以后，组织工作的方法反而成为更明显的瓶颈。

本文从 Anthropic 2026 年 3 月的长任务 harness 工程文章出发，研究适合知识网站的任务外壳。案例属于设计推演，没有执行 Agent 对照实验，也不把厂商报告里的速度当作本站成绩。

出处：blog-ai-from-llm-to-agent

## 从回答质量转向交付条件

Harness 是包围模型的执行环境，规定任务如何进入、工具如何调用、进度如何保存、结果如何检查。官方案例将规划、生成和评价分开组织。值得借鉴的是职责边界，而不是照抄角色数量；简单任务也可能只需要一个执行器和一组确定性检查。

假设任务是补齐 21 篇博客。只说“继续写”很难判断进度；先列出日期连续、领域各七篇、引用可追溯、列表正文图标一致，就能检查具体遗漏。这些条件不能替代编辑判断，却能阻止低级错误被华丽文字掩盖。

出处：blog-ai-from-llm-to-agent

## 把进度放在模型之外

聊天记录适合交流，不适合成为唯一账本。可以为每篇文章保存阶段和证据，而不是只留一句“已完成”。

```json
{
  "id": "agent-harness",
  "stage": "review",
  "evidence": ["body.md", "sources.json"]
}
```

这里没有 completion: 100。文件存在不代表观点正确，review 仍要求审阅。恢复任务时先读账本和当前产物，再决定下一步，不靠重新总结所有对话猜测。

出处：blog-ai-from-llm-to-agent

## 先打通一篇，再扩展二十篇

先完成资料、正文、数据适配、浏览器显示全部打通的纵向样本。如果先批量生成再看页面，段落适配器的问题会被复制 21 次。评价还要检查实际产物：标题正常但图标请求失败，仍然是不完整交付；浏览器通过，也不能证明文章不存在概念错误。

代码检查、运行验证与人工阅读覆盖不同风险。让另一个模型评价可以增加视角，却不该成为唯一裁判，更不能让它自行认定自己完成了所有任务。

出处：blog-ai-from-llm-to-agent

## 停止条件与失败预算

长任务应设时间、调用次数和失败次数预算。同一来源连续超时后，保留错误证据，选择替代资料或报告缺口，比无限重试更有价值。会产生外部写入的步骤，还需要清楚的权限与撤销边界。

可靠性可以理解为可恢复性与可检查性的组合：中断后知道从哪里继续，交付时知道哪些条件已经被证明。红石中继器因此很贴题，它象征执行节奏和阶段衔接，不是一个万能大脑。

出处：blog-ai-from-llm-to-agent

## 一组可复现的验证设计

准备三个终态明确的小任务，分别在中途终止、制造一次工具超时、故意留下缺失文件。观察恢复后是否重复写入、是否保留失败证据、是否把不完整成果误报为完成。先记录这些行为，再比较更换模型有没有帮助，结论才有依据。

出处：blog-ai-from-llm-to-agent

## 相关知识

[[llm]] · [[ai-security]] · [[tool-calling]] · [[agent-memory]] · [[gui-code-agent]] · [[rss-agent]]

[[index]]
