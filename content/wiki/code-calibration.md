---
kind: "node"
id: "code-calibration"
title: "代码模型不确定性"
description: "系统比较代码模型的不确定性信号、校准方法与选择性预测，强调高置信分数不等于可靠接受决策。 · 预印本"
category: "Software"
tags: ["代码模型","校准","缺陷检测","预印本"]
parentIds: ["testing"]
status: "untracked"
frame: "task"
details: "系统比较代码模型的不确定性信号、校准方法与选择性预测，强调高置信分数不等于可靠接受决策。 · 预印本"
learningPoints: ["置信分数与真实正确率的关系", "风险和覆盖率如何共同变化", "校准能否迁移到不同代码任务"]
relatedBlogs: []
relatedPapers: [{"id":"arxiv-2610.21248","title":"Beyond Confidence: Rethinking Uncertainty Calibration in Deep Code Models"}]
relatedRss: []
sources: [{"id":"paper-arxiv-2610.21248","kind":"paper","title":"Beyond Confidence: Rethinking Uncertainty Calibration in Deep Code Models","url":"#paper/arxiv-2610.21248","locator":"原始 PDF，共 12 页；下方摘要不是全文审读结论","excerpt":"Deep learning models have shown significant promise in code-related tasks. While confidence calibration techniques have been proposed to improve model reliability, their effectiveness in real-world tasks with strict accuracy requirements remains uncertain. In this paper, we investigate two key questions: first, whether existing measurement metrics, including confidence scores and uncertainty metrics, are effective for guiding selective prediction; and second, whether existing calibration techniques can improve these metrics to better identify cases where model predictions are likely to succeed or fail.\n  We conduct a systematic study on defect prediction and vulnerability detection using seven code models, evaluating thirteen uncertainty signals and three widely used post-hoc calibration methods. Our analysis reveals three major findings: (1) even strong uncertainty signals can remain poorly calibrated and provide limited separation at the high-confidence end, constraining selective prediction in practice; (2) standard post-hoc calibrators often improve calibration scores but do not consistently translate into better selective prediction behavior; and (3) commonly used calibration metrics can disagree with selective prediction performance, underscoring the need to evaluate both jointly. Moreover, our findings motivate a decision-oriented view of reliability in deep code models, where calibrated scores must be evaluated together with selective-prediction quality and retained-region risk before they can support accept--defer deployment."}]
relatedNodeIds: ["testing"]
updated: "2026-10-17"
provenance: "agent-source-synthesis"
aliases: ["代码模型","校准","缺陷检测"]
iconKey: "clock_00"
iconLabel: "时钟"
iconReason: "钟对应选择性接受与风险预算"
icon: "/assets/inventory/wiki-icons/clock_00.png"
---
# 代码模型不确定性

## 研究问题

系统比较代码模型的不确定性信号、校准方法与选择性预测，强调高置信分数不等于可靠接受决策。 · 预印本

出处：paper-arxiv-2610.21248

## 研究资料与阅读入口

《Beyond Confidence: Rethinking Uncertainty Calibration in Deep Code Models》；作者：Ravishka Rathnasuriya, Wei Yang；年份：2026。目录标注为预印本，不能据此声称已通过同行评审。站内已提供完整原文；本页根据目录导读和原摘要建立知识入口，不将原文中的实验结果冒充本站实测。

出处：paper-arxiv-2610.21248

## 方法辨析与阅读重点

代码模型给出的高置信分数不等于可以可靠地接受结果。该研究比较不确定性信号、校准方法与选择性预测。判断校准是否有用，需要观察拒绝或转交低可靠样本后，保留样本的风险与覆盖率是否符合目标。

以上为基于该节点所引站内论文摘要的 Agent 整理；结果、证明及数值条件须回到原文核对。

## 原摘要与核对边界

Deep learning models have shown significant promise in code-related tasks. While confidence calibration techniques have been proposed to improve model reliability, their effectiveness in real-world tasks with strict accuracy requirements remains uncertain. In this paper, we investigate two key questions: first, whether existing measurement metrics, including confidence scores and uncertainty metrics, are effective for guiding selective prediction; and second, whether existing calibration techniques can improve these metrics to better identify cases where model predictions are likely to succeed or fail.
  We conduct a systematic study on defect prediction and vulnerability detection using seven code models, evaluating thirteen uncertainty signals and three widely used post-hoc calibration methods. Our analysis reveals three major findings: (1) even strong uncertainty signals can remain poorly calibrated and provide limited separation at the high-confidence end, constraining selective prediction in practice; (2) standard post-hoc calibrators often improve calibration scores but do not consistently translate into better selective prediction behavior; and (3) commonly used calibration metrics can disagree with selective prediction performance, underscoring the need to evaluate both jointly. Moreover, our findings motivate a decision-oriented view of reliability in deep code models, where calibrated scores must be evaluated together with selective-prediction quality and retained-region risk before they can support accept--defer deployment.

出处：paper-arxiv-2610.21248

## 相关知识

[[testing]]

[[index]]
