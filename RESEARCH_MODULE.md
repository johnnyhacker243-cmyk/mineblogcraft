# MineResearch 知识之书

首页第三个按钮进入 MineResearch。目录选择一本论文后，背景轻微变暗，合书从中央出现，停顿后左右展开；动画共 1.74 秒。用户启用减少动态效果时立即展示书页。翻页使用原版箭头，可用方向键操作；Escape 从书籍返回目录，再返回首页。

## 内容与数据

`src/data/papers.json` 保存 `id、title、author、year、description、category、keywords、cover、content、abstract、draft`。`content` 指向本地 Markdown；`draft` 在目录和书内显示示例标识。

用户授权先编写一篇示例。`public/papers/paper001.md` 是原创理论说明《基于扩散方程的时间比值法研究》，不是已发表论文，也没有虚构实验、引用或创新成果。YTC、2024 是用户题纲中的示例元数据。正文说明一维无限域热方程、相对阈值时间比、理论计算例子及适用限制；经典基本解参考 [MIT Gilbert Strang 热方程课程资料](https://math.mit.edu/classes/18.086/2006/am54.pdf)。三张 SVG 公式/示意图由本项目代码生成，没有复制资料图片。以后可直接替换为作者真实正文。

组件结构：

```text
MineResearchPage
├── PaperList
└── PaperBookViewer
    ├── BookAnimation
    └── PageRenderer
PaperRepository → papers.json / 本地 Markdown
book-pagination → BookPage[]
```

页面只依赖 `PaperRepository.getPapers()` 与 `getContent()`，不直接读取 JSON。未来实现相同接口的 API repository，分别调用论文目录与正文接口即可；不需要改书籍 UI。本阶段没有后台或数据库。

分页使用 104 逻辑像素行宽、每页 13 行；图片占 6 行。支持标题、普通文本、空行与本地图片，双页不足时补空页。本示例共 14 页。没有引入 HTML 执行、PDF 阅读器或在线 LaTeX 渲染；公式通过本地 SVG 图片显示。

## 原版资源与还原范围

来源为用户授权的本地 Minecraft Java 1.21.1 客户端，通过 `scripts/import-inventory.py` 精确提取：

- `textures/item/written_book.png`：目录成书图标。
- `textures/item/writable_book.png`：预留书与笔资源。
- `textures/gui/book.png`：纸张、页角和书页边缘。
- `textures/entity/enchanting_table_book.png`：打开动画棕色封面图集。
- `textures/gui/sprites/widget/page_backward.png`、`page_forward.png` 及对应高亮纹理：翻页按钮。
- 复用已有客户端位图字体、菜单按钮和点击声音。

原版 Java 书籍阅读器是单页；双页是依用户要求进行的 Web 扩展，由原版书页裁切/镜像组成。动画是 CSS 三维封面变换，不是游戏实体书籍渲染。过渡封面使用本项目补充的朴素棕色像素 SVG，原版封面图集保留为本地参考。没有获得同尺寸原版运行截图，不能宣称 1:1 复刻。原版纹理与字体均保留本地、被 Git 忽略，未因本地读取许可获得再分发授权。

## 书本过渡精修

`src/config/book-animation-config.ts` 集中定义阶段时长与透视距离。状态为 `idle → spawning → holding → opening → opened → reading`，分别经过暗化 180ms、出现 320ms、停顿 200ms、展开 900ms、衔接 140ms；总计 1740ms。缩放从 0.8 到 1.0，初始 X/Y 倾角为 5°/-7°，透视距离 700 逻辑像素；展开缓动为 cubic-bezier(.45,0,.18,1)。遮罩额外暗化约 33%。

`BookAnimation` 绘制合书、纸张边缘、中央书脊、左右独立封面与投影层；`PaperBookViewer` 控制阶段和计时器，并给原有 `PageRenderer` 外增加左右开合容器。纸张直接使用最终阅读 DOM，尺寸没有切换；镜像与旋转分别在两层中处理，避免左页翻到右侧或被背面剔除。`MineResearchPage` 将目录保留在遮罩后，设为 inert，展开时渐隐；阅读完成后隐藏。翻页与返回按钮在阅读状态才启用，Escape 可取消动画，卸载时清除所有计时器。窗口调整沿用原 GUI Scale。

新增 `public/papers/transition/plain-cover.svg` 为作者授权范围内补充的原创过渡资产：64×80 像素结构、棕色书皮、深色书脊和克制磨损，没有 AI 图像或第三方素材。纸张堆叠与投影由 CSS 绘制。原书页排版、正文与分页没有重做。

实际 Chromium 保存了 `research-book-closed.png`、`research-book-opening.png` 和三种尺寸的最终阅读截图。自动验证合书停顿、动画期间禁止翻页、目录保留、左右页贴合、衔接尺寸一致、取消后重开、动画期间缩放及减少动态效果。仍可进一步精修封面与纸张的立体遮挡、打开早期的封面交接和不同显卡下的阴影采样；目前为分层 CSS 动画，不是物理书本仿真。

## 实际验证

运行 `npm run build`、`npm test`、`npm run test:research` 均通过。研究模块测试使用实际 Chromium，覆盖打开动画、全部翻页、边界按钮、键盘、返回、减少动态效果和正文请求失败；正常流程控制台错误与失败请求为零。结果见 `tests/research-results.json`。

| 浏览器尺寸 | GUI Scale | 双页尺寸 |
| --- | --- | --- |
| 1366×768 | 3 | 876×540 |
| 1920×1080 | 4 | 1168×720 |
| 2560×1440 | 5 | 1460×900 |

截图分析后调整了标题末尾孤字换行，并提高窗口模式书籍比例；复测确认文字和按钮没有超出视口。禁用翻页箭头按游戏习惯隐藏，测试使用包含隐藏元素的查询验证边界。

本地截图（不提交）：`tests/screenshots/research-catalog-1920x1080.png`、`research-book-opening.png`、`research-book-1366x768.png`、`research-book-1920x1080.png`、`research-book-2560x1440.png`、`research-formula-pages.png`。

启动：`npm run dev -- --host 127.0.0.1`，打开首页后点击 MineResearch。新机器仍需导入获授权客户端资源，才能获得本机完整画面。
