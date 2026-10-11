# MineWiki：知识进度树

## 已实现

首页 Options... 替换为 MineWiki；其按钮位置与原版菜单尺寸保持一致。新增四个分支：AI（7）、Security（8）、Software（6）、Modeling（6），共 27 个知识目录节点。示例说明仅是知识条目骨架，学习状态统一为 `untracked`；没有把用户的掌握程度、学习经历、博客数量或论文数量编造为已完成记录。

参考 [AdvancementsScreen](https://maven.fabricmc.net/docs/yarn-1.21.1%2Bbuild.1/net/minecraft/client/gui/screen/advancement/AdvancementsScreen.html)、[AdvancementTab](https://maven.fabricmc.net/docs/yarn-1.21.1%2Bbuild.1/net/minecraft/client/gui/screen/advancement/AdvancementTab.html)、[AdvancementWidget](https://maven.fabricmc.net/docs/yarn-1.21.1%2Bbuild.1/net/minecraft/client/gui/screen/advancement/AdvancementWidget.html) 的窗口、分支、鼠标拖动与提示框结构。实际贴图来自用户授权的本地 Minecraft Java 1.21.1 客户端，没有从第三方下载游戏素材。

## 原版资源

- `gui/advancements/window.png`：本地裁取 252×140 窗口区域，保留角部及原版边缘，用 18/9/9/9 边缘切片扩展成网页可读的窗口。
- `gui/advancements/backgrounds/stone.png`、`nether.png`、`husbandry.png`：AI/Software、Security、Modeling 的平铺背景。
- `gui/sprites/advancements/tab_above_middle(_selected).png`：28×32 原版页签。标签文字是网页扩展；贴图自身没有拉成现代横向 Tab。
- `task_frame`、`goal_frame`、`challenge_frame` 的 obtained/unobtained 贴图：26×26 节点。示例节点使用未记录状态，搜索外框高亮不代表作者已完成进度。
- 指南针、附魔书、书、末影珍珠、红石、铁剑、纸、时钟、红石中继器、工作台；沿用本地原版位图中文字体和按钮声音。

`public/assets/inventory/` 仍被 Git 忽略。没有原版同尺寸截图进行像素差异验收，不能称作完全 1:1；窗口逻辑尺寸、标题标注、搜索与详情为网页阅读适配。

## 文件结构

- `src/screens/MineWikiPage.tsx`：目录读取、分支与搜索状态、比例、详情与 Escape 返回。
- `src/components/wiki/WikiTabs.tsx`：原版贴图页签，点击及左右方向键切换。
- `WikiTree.tsx`：SVG 直角双描边连线、Pointer Capture 拖拽、滚轮缩放、搜索聚焦。
- `WikiNode.tsx`：节点图标、标题、搜索状态与 Tooltip。
- `WikiDetailPanel.tsx`：右侧像素详情、学习要点、实际关联内容名称；关闭后焦点回到节点。
- `src/models/WikiNode.ts`、`src/data/wiki.json`：类型与静态目录。
- `src/services/WikiRepository.ts`、`WikiSearchService.ts`：数据及检索接口。
- `src/styles/wiki.css`：集中管理原版窗口、节点与详情布局。

## 数据与关系

`WikiNodeData` 包含 id/title/description/category/tags/icon/x/y/parentIds/status/frame/details/learningPoints/relatedBlogs/relatedPapers。位置采用逻辑坐标，多个 parentIds 支持多前置关系；不是固定网格。四个分支各自显示，横向空间可以大于窗口。参考路径如网络基础 → TCP/IP → 资产发现 → Nmap → 漏洞扫描 → 事件响应；这些是示例学习组织方式，非唯一顺序。

关联字段保存实际内容 id 和显示名称，仅展示关联资料，不伪造不存在的计数。AI Security 等关联真实 NIDS-FGPA，扩散方程关联已标注原创示例的论文，Frontend 关联已存在的博客。当前关联名称未加入跨模块跳转。

## 搜索与交互

`WikiSearchService.search(query, nodes)` 返回 `{node, score}[]`。标准化 NFKC、大小写及标点，支持多关键词全部匹配、包含匹配、中文标签、简介和关联内容名。权重为标题 100、分类/标签 65、简介 30、关联名称 20；英文单词长度 3–4 允许一次编辑，较长词允许两次编辑，中文长度至少 3 的近邻窗口允许一次编辑。没有语义模型或拼音检索。

查询全目录，最相关结果自动切换分支并聚焦其节点；匹配项加黄色外框，其余节点淡化。结果数为全目录计数，其他分支结果通过页签浏览。空查询恢复正常状态，零结果不会跳转新列表。每次输入只检索元数据，索引用 WeakMap 缓存。

拖动背景平移；滚轮以指针位置为中心缩放，范围 0.55–1.6。知识树背景可用方向键平移；节点 Enter/Space 打开详情。Escape 依次关闭详情、清空搜索、返回主菜单。返回与重置沿用原版按钮。

## 比例与测试

窗口使用 460×230 逻辑尺寸，整体按 480×334 的可用空间计算 0.25 档位 Scale。UI 保持固定逻辑关系，未自由拉伸节点排列。测试桌面尺寸：1366×768、1920×1080、2560×1440。

执行 `npm run build`、`npm run test:wiki` 和 `npm test`。Wiki 测试包括数据关系无环、字段查询、大小写/错字、四分支切换、拖动、滚轮、视图重置、跨分支定位、Tooltip、详情、键盘与返回。实际结果保存在 `tests/wiki-results.json`，截图在 `tests/screenshots/wiki-*.png`、`wiki-search-tooltip.png`、`wiki-detail.png`。

## 后续接入

API 版 WikiRepository 实现 `getAllNodes(signal)`，保持相同数据结构。服务器应校验唯一 id、分类、坐标范围、合法资源路径与前置关系无环。后端搜索适配器返回节点 id/score，前端解析后沿用高亮与定位；异步检索需增加取消请求与结果时序控制。当前无后端、数据库、登录或编辑后台。

下一步可以接入作者真实学习笔记、跨模块关联跳转、持久化学习状态、节点 URL 定位与更完整的原版截图对照。大规模目录可改用 Worker 检索并只绘制视野附近节点。
