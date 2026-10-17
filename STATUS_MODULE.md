# 当前实现（2026-10-17）

状态来源为 scripts/generate-status.mjs 生成的 /data/site-status.json，构建成功后写入 dist/data/site-status.json。包含 8 个内容入口、22 篇已发布博客、33 篇论文、89 个 Wiki 节点、21 个 RSS 源和 314 条摘要。数据从当前内容文件计算；检查命令失败时不生成成功报告。构建时间使用 ISO 时间点，界面明确显示 UTC+8；提交号和 CI run_id 对应当前产物。页面称为“构建记录”，不声称持续监控在线服务。

下文为早期实现记录，保留历史背景，已由当前实现替代。

# MineStatus：系统附魔台

首页 Quit Game 已替换为 MineStatus，保留原按钮位置、纹理及点击音效。

## 界面与资源

左侧使用有铰链的 Three.js 附魔书，钻石剑与青金石放在原版输入格中；右侧使用三条原版附魔选项。点击词条时，同一窗口的下方区域显示详情，区域高度固定，避免界面跳动。悬停和键盘聚焦均显示像素 Tooltip；Esc 优先关闭详情，再返回首页。

原版资源均从用户授权的 Minecraft Java 1.21.1 客户端提取，保留本地并由 .gitignore 排除：

- gui/container/enchanting_table.png：窗口边框裁片，保持原像素。
- gui/sprites/container/enchanting_table/enchantment_slot.png、enchantment_slot_highlighted.png：三个状态词条。
- 同目录 level_1.png、level_2.png、level_3.png：附魔等级标记。
- entity/enchanting_table_book.png：书皮、内页纹理。
- item/diamond_sword.png、item/lapis_lazuli.png：输入材料。
- 现有原版 GUI slot、位图字体、按钮和点击音效。

书本几何复用既有 EnchantmentTable，通过 bookOnly 模式隐藏台座、调整摄像机。它是基于原比例和贴图的 Web 模型，不是原版客户端渲染器的逐帧复刻；当前未加入魔法粒子或新的音效。

## 组件与动画

MineStatusPage → EnchantBook / StatusItem / StatusPanel / StatusTooltip。

- 窗口淡入并上移：800ms。
- 书本浮动：振幅0.6模型单位，角频率1.7rad/s。
- 书页连续翻动：角频率1.3rad/s。
- 鼠标偏转经过缓动，避免突然抖动。
- 钻石剑每5秒出现一次轻微紫色光影。
- 遵循系统减少动态效果设置及项目减少动态效果设置；页面隐藏时暂停书本渲染，离开时清理资源。
- 使用固定逻辑宽440与340逻辑高度预算，按窗口统一缩放，步进0.25。

## 数据与真实性

src/data/status.json → StatusRepository.getStatus(signal) → 页面。

SiteStatus 包含 mode、website（name/status/response/version/lastUpdate）、modules（name/status）、environment（frontend/backend/monitoring）。静态仓库返回独立数据副本，支持取消；页面预留加载失败反馈。

当前 mode 为 static-demo。ONLINE、Normal、版本及更新时间均来自用户指定的演示数据，**不是实时检查结果**。页面明确显示“静态示例 · 未接监控”，不伪造运行天数、服务器响应时间或后端就绪状态。实际运行方式为本地 React 前端，后端与监控均未接入。状态页版本是本任务指定的 v1.0；主菜单既有品牌版本1.22.1未更改。

## 验证

npm run build；npm run test:status；npm test；npm run test:research-shelf。

MineStatus 实际 Chromium 测试：1366×768、1920×1080、2560×1440。检查资源/控制台、视口内完整布局、展开详情框的位置与尺寸不变、鼠标提示、Enter/Space/Esc、返回和再次进入。截图位于 tests/screenshots/status-*.png，测试结果位于 tests/status-results.json。

这是上述视口尺寸测试，不宣称执行了浏览器F11全屏操作。截图分析后已放大书本与文字，并修复详情字号增大导致窗口约2px移动的问题。

## 后续真实监控接口

新增 ApiStatusRepository 实现同一个 getStatus(signal)，读取未来 /api/status，页面组件不用读取 JSON 或更改布局。实时响应应返回采集时间、数据有效期及各模块独立状态；超时/过期显示 unknown，而不能继续显示 ONLINE。部署后由可信监控服务采集健康检查和版本，前端只消费公开的汇总信息。后端、凭证、数据库和部署均不在本阶段实现。

可继续优化：依照原版 BookModel 精确校准书脊/封面UV；接入真实状态后的离线和过期视觉；保持克制地增加原版附魔粒子。

## 文字重影修复

MineStatus 的位图文字现在显式关闭偏移阴影，同时关闭该页面继承的 CSS text-shadow。保留字体、颜色和布局；其他模块的文字阴影不受影响。浏览器回归覆盖三种桌面分辨率，并检查详情字形仅包含一种绘制颜色，确保没有第二层阴影。修复截图：tests/screenshots/status-website-no-shadow.png。
