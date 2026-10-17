# Wiki 黑屏修复记录

日期：2026-10-17（Asia/Shanghai）。

## 已复现的根因

WikiTree 的 pointermove 通过函数式 setView 排队更新；更新函数读取 drag.current.panX 等字段。pointerup/pointercancel 会同步将 drag.current 清空。React 批量处理队列时，更新函数可能晚于松开事件执行，读取空值并抛出 `Cannot read properties of null (reading 'panX')`。

修复前用浏览器在一次任务内连续派发拖动移动事件并松开，可复现错误；#root 子节点数变为 0，Wiki 消失，只剩 body 的 #171717 背景，与用户反馈的整页黑屏一致。这不是“浏览时长达到某个阈值”的定时逻辑，持续操作会提高撞上该时序的机会。

## 修复

- 在 pointermove 同步捕获当前拖动记录与坐标。延后执行的更新函数只读独立快照，不再读取可能被后续事件清空的 ref。
- 缩放边界使用该次更新的最新视图状态。
- pointerup、pointercancel 和 lostpointercapture 均结束拖动，避免指针捕获丢失后残留拖动状态。
- 所有内容页增加 PageErrorBoundary。某页渲染异常时保留共享背景、导航与音乐，提供“重新打开页面”和“返回首页”。它作为恢复机制，不替代根因修复；回归测试要求 Wiki 不触发该恢复界面。

## 验证方法

`tests/interactions/wiki-stability.mjs` 覆盖原始批量事件竞争：60 轮松开/取消/丢失捕获；随后默认持续 3 分钟，循环切换知识分支、阅读详情、滚动、关闭、拖动与重置。记录 pageerror、浏览器崩溃、DOM/画布数和垃圾回收后的 JS 堆指标，最后验证仍能返回并打开博客。`STABILITY_MS` 可延长持续测试，`TEST_BASE_URL` 可切换线上地址。

`tests/interactions/page-recovery.mjs` 仅在测试浏览器中注入一次可控渲染异常，验证共享 UI 保留、重试重新挂载 Wiki、再次异常后返回首页及其他版块可用；不修改发布文件。

具体本地持续测试数据见 tests/wiki-stability-results.json。线上发布还需核对 deployment.json 的 commit，并在真实站点重新运行持续测试与主要模块回归。该记录描述已覆盖的故障与验证范围，不宣称所有环境永远没有其他缺陷。

本地实测：60 轮批量拖动结束事件通过；持续浏览 182225 毫秒、51 轮详情/分支操作，pageerror 与崩溃为 0，画布数量始终为 39。垃圾回收后的 JS 堆从约 12.35 MB 到 14.65 MB；这是本轮测量值，不据此宣称所有时长下没有内存泄漏。故障注入的重新打开与返回首页测试通过。发布工作流增加对生产构建的同一批量拖动竞争检查，失败时阻止上线。

Microsoft Edge 也执行了同一 60 轮批量事件回归，未出现页面错误，画布数量为 39，返回博客正常；结果见 tests/wiki-stability-msedge-results.json。
