---
kind: "node"
id: "rss-privacy"
title: "隐私与可验证计算"
description: "从本地快照整理隐私保护、零知识证明与形式化验证的外部研究线索。"
category: "Security"
tags: ["隐私", "零知识证明", "形式化验证", "RSS"]
parentIds: ["mcp-authorization"]
status: "untracked"
frame: "task"
details: "区分计算正确性、隐私保护与实现成本；外部摘要不是本站实测。"
learningPoints: ["先核对发布方、文章日期与快照抓取日期", "技术指标和事件叙述需要回到原文，不把厂商摘要当作已复现实验", "把可复用概念与产品发布、营销及短期新闻分开"]
relatedBlogs: []
relatedPapers: []
relatedRss: ["arxiv-ai", "microsoft-research", "amazon-science"]
sources: [{"id": "rss-1b2325aaf2d8afe2c048f7fb", "kind": "rss", "title": "IneqAgent: Agentic Inequality Proving in Lean with Symbolic Computation", "url": "https://arxiv.org/abs/2610.20681", "locator": "arXiv · Artificial Intelligence · 2026-10-16T04:00:00.000Z · 快照 2026-10-16T11:58:12.680Z", "excerpt": "arXiv:2610.20681v1 Announce Type: new Abstract: Formal inequality proving requires mathematical reasoning and exact computation, often connected through intermediate lemmas and goal reformulations. We introduce IneqAgent, an agentic framework combining LLM reasoning with symbolic computation for inequality proving in Lean4. Lemma-level Monte Carlo Tree Search coordinates lemma construction, goal reformulation, and symbolic backend selection. Complementary sum-of-squares, Bernstein, and successive difference-substitution backends produce exact certificates for local Lean proof generation. The a", "sourceId": "arxiv-ai"}, {"id": "rss-dd41f81f45fee6d9c2dfe8c8", "kind": "rss", "title": "When Correctness Feedback Erases Evidence: Phase-Separated Completeness Auditing in Verus", "url": "https://arxiv.org/abs/2610.20676", "locator": "arXiv · Artificial Intelligence · 2026-10-16T04:00:00.000Z · 快照 2026-10-16T11:58:12.680Z", "excerpt": "arXiv:2610.20676v1 Announce Type: new Abstract: Correctness feedback suppresses the very evidence that specification-completeness auditing is designed to uncover: programs that satisfy a written contract but violate intended behavior. We demonstrate this objective reversal on 12 Verus/Rust tasks across four model families under matched call budgets. Independent no-feedback discovery more than doubles certified-witness yield relative to IntentShield's corrective-feedback loop (59.0% versus 27.1%). A format-matched iterative control places the larger share of this gap in feedback content, not in", "sourceId": "arxiv-ai"}, {"id": "rss-33dd453a5d6cf4fc8605973e", "kind": "rss", "title": "Proof-based general-purpose computing with Magnetar", "url": "https://www.microsoft.com/en-us/research/blog/proof-based-general-purpose-computing-with-magnetar/", "locator": "Microsoft Research · 2026-10-15T16:00:00.000Z · 快照 2026-10-16T11:58:12.680Z", "excerpt": "Zero-knowledge proofs can verify computing results without rerunning workloads or exposing sensitive data. Magnetar helps bring them into the mainstream with support for standard programming languages, major speed gains, and quantum-resistant security. The post Proof-based general-purpose computing with Magnetar appeared first on Microsoft Research .", "sourceId": "microsoft-research"}, {"id": "rss-54caea957a9ad622bd99dae5", "kind": "rss", "title": "Developing provably correct Rust code with Verus", "url": "https://www.amazon.science/blog/developing-provably-correct-rust-code-with-verus", "locator": "Amazon Science · 2026-08-31T15:35:33.000Z · 快照 2026-10-16T11:58:12.680Z", "excerpt": "How the Verus \"program verifier\", which automatically checks code against a mathematical specification of its functionality, helps increase security assurance in software projects.", "sourceId": "amazon-science"}]
relatedNodeIds: ["mcp-authorization", "rag-privacy", "private-ann"]
updated: "2026-10-17"
provenance: "agent-source-synthesis"
aliases: ["Zero Knowledge", "Magnetar", "Verus", "形式化证明"]
iconKey: "ender_eye"
iconLabel: "末影之眼"
iconReason: "末影之眼对应隐私保护下的可验证观察"
icon: "/assets/inventory/wiki-icons/ender_eye.png"
---
# 隐私与可验证计算

## 阅读边界

区分计算正确性、隐私保护与实现成本；外部摘要不是本站实测。

## 具体线索

IneqAgent: Agentic Inequality Proving in Lean with Symbolic Computation

arXiv:2610.20681v1 Announce Type: new Abstract: Formal inequality proving requires mathematical reasoning and exact computation, often connected through intermediate lemmas and goal reformulations. We introduce IneqAgent, an agentic framework combining LLM reasoning with symbolic computation for inequality proving in Lean4. Lemma-level Monte Carlo Tree Search coordinates lemma construction, goal reformulation, and symbolic backend selection. Complementary sum-of-squares, Bernstein, and successive difference-substitution backends produce exact certificates for local Lean proof generation. The a

When Correctness Feedback Erases Evidence: Phase-Separated Completeness Auditing in Verus

arXiv:2610.20676v1 Announce Type: new Abstract: Correctness feedback suppresses the very evidence that specification-completeness auditing is designed to uncover: programs that satisfy a written contract but violate intended behavior. We demonstrate this objective reversal on 12 Verus/Rust tasks across four model families under matched call budgets. Independent no-feedback discovery more than doubles certified-witness yield relative to IntentShield's corrective-feedback loop (59.0% versus 27.1%). A format-matched iterative control places the larger share of this gap in feedback content, not in

Proof-based general-purpose computing with Magnetar

Zero-knowledge proofs can verify computing results without rerunning workloads or exposing sensitive data. Magnetar helps bring them into the mainstream with support for standard programming languages, major speed gains, and quantum-resistant security. The post Proof-based general-purpose computing with Magnetar appeared first on Microsoft Research .

Developing provably correct Rust code with Verus

How the Verus "program verifier", which automatically checks code against a mathematical specification of its functionality, helps increase security assurance in software projects.

## 相关知识

[[mcp-authorization]] · [[rag-privacy]] · [[private-ann]] · [[index]]
