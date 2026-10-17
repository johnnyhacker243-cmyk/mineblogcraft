---
kind: "node"
id: "mcp-capabilities"
title: "MCP 文件能力边界"
description: "分析 MCP 工具声明与宿主文件权限之间的落差，通过分层筛查和动态验证研究文件系统能力滥用。 · 预印本"
category: "Security"
tags: ["MCP","最小权限","工具安全","预印本"]
parentIds: ["mcp-authorization"]
status: "untracked"
frame: "task"
details: "分析 MCP 工具声明与宿主文件权限之间的落差，通过分层筛查和动态验证研究文件系统能力滥用。 · 预印本"
learningPoints: ["声明范围与进程权限的差距", "路径检查能否被参数间接绕过", "沙箱是否真正限制了文件访问"]
relatedBlogs: []
relatedPapers: [{"id":"arxiv-2610.22301","title":"My Credentials, Please: Detecting Filesystem Capability Laundering in MCP Servers at Scale"}]
relatedRss: []
sources: [{"id":"paper-arxiv-2610.22301","kind":"paper","title":"My Credentials, Please: Detecting Filesystem Capability Laundering in MCP Servers at Scale","url":"#paper/arxiv-2610.22301","locator":"原始 PDF，共 21 页；下方摘要不是全文审读结论","excerpt":"The Model Context Protocol (MCP) standardizes how AI agents invoke external tools. MCP servers expose tools through a declared contract consisting of a name, description, and argument schema. In typical local deployments, client-side approval of a tool call grants the underlying server process broad host filesystem permissions rather than restricting it to the declared operation. We study the resulting vulnerability class, filesystem capability laundering, where attacker-steered arguments cause a tool to access sensitive host files outside its declared contract and deployment scope. We analyze this capability gap across three layers: server-category screening (L1), per-tool contract analysis (L2), and bypassable path-validation checks (L3). We design MCP-FSD to catalog MCP servers, infer least-privilege boundaries per tool, plant credential fixtures outside those boundaries, and evaluate exploitability and sandbox containment via paired dynamic execution. Across 21,097 MCP servers from nine registries, 787 of 4,806 triaged servers (16.4%) exhibit filesystem capabilities despite non-filesystem functional classifications. Dynamic three-case validation confirms 150 vulnerable instances under tested sandbox policies. Coordinated disclosure yielded 13 security advisories, including two CVEs in Anthropic's Git MCP Server."}]
relatedNodeIds: ["mcp-authorization"]
updated: "2026-10-17"
provenance: "agent-source-synthesis"
aliases: ["MCP","最小权限","工具安全"]
iconKey: "iron_door"
iconLabel: "铁门"
iconReason: "铁门对应宿主文件权限的实际约束"
icon: "/assets/inventory/wiki-icons/iron_door.png"
---
# MCP 文件能力边界

## 研究问题

分析 MCP 工具声明与宿主文件权限之间的落差，通过分层筛查和动态验证研究文件系统能力滥用。 · 预印本

出处：paper-arxiv-2610.22301

## 研究资料与阅读入口

《My Credentials, Please: Detecting Filesystem Capability Laundering in MCP Servers at Scale》；作者：Zeqian Huang, Mingyue Tang, Aonan Guan, Qiming Sun, Pengzhou He；年份：2026。目录标注为预印本，不能据此声称已通过同行评审。站内已提供完整原文；本页根据目录导读和原摘要建立知识入口，不将原文中的实验结果冒充本站实测。

出处：paper-arxiv-2610.22301

## 方法辨析与阅读重点

工具声明描述用户以为批准的操作，服务进程实际持有的宿主文件权限可能远大于这个声明。论文把类别筛查、单工具契约分析和路径校验放在分层流程中，再用边界之外的凭据样本及成对动态执行检查可利用性。工具可连接不等于权限已被约束。

以上为基于该节点所引站内论文摘要的 Agent 整理；结果、证明及数值条件须回到原文核对。

## 原摘要与核对边界

The Model Context Protocol (MCP) standardizes how AI agents invoke external tools. MCP servers expose tools through a declared contract consisting of a name, description, and argument schema. In typical local deployments, client-side approval of a tool call grants the underlying server process broad host filesystem permissions rather than restricting it to the declared operation. We study the resulting vulnerability class, filesystem capability laundering, where attacker-steered arguments cause a tool to access sensitive host files outside its declared contract and deployment scope. We analyze this capability gap across three layers: server-category screening (L1), per-tool contract analysis (L2), and bypassable path-validation checks (L3). We design MCP-FSD to catalog MCP servers, infer least-privilege boundaries per tool, plant credential fixtures outside those boundaries, and evaluate exploitability and sandbox containment via paired dynamic execution. Across 21,097 MCP servers from nine registries, 787 of 4,806 triaged servers (16.4%) exhibit filesystem capabilities despite non-filesystem functional classifications. Dynamic three-case validation confirms 150 vulnerable instances under tested sandbox policies. Coordinated disclosure yielded 13 security advisories, including two CVEs in Anthropic's Git MCP Server.

出处：paper-arxiv-2610.22301

## 相关知识

[[mcp-authorization]]

[[index]]
