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

Markdown 分页使用 240 字形逻辑单位行宽、每页 19 行；图片占 6 行。书页文字以 0.6 倍字形比例显示，行高 8 逻辑像素。支持标题、普通文本、空行与本地图片，双页不足时补空页。放大版阅读器中本示例共 8 页。没有引入 HTML 执行、PDF 阅读器或在线 LaTeX 渲染；公式通过本地 SVG 图片显示。

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
| 1366×768 | 3 | 1140×540 |
| 1920×1080 | 4.25 | 1615×765 |
| 2560×1440 | 5.75 | 2185×1035 |

截图分析后调整了标题末尾孤字换行，并提高窗口模式书籍比例；复测确认文字和按钮没有超出视口。禁用翻页箭头按游戏习惯隐藏，测试使用包含隐藏元素的查询验证边界。

本地截图（不提交）：`tests/screenshots/research-catalog-1920x1080.png`、`research-book-opening.png`、`research-book-1366x768.png`、`research-book-1920x1080.png`、`research-book-2560x1440.png`、`research-formula-pages.png`。

启动：`npm run dev -- --host 127.0.0.1`，打开首页后点击 MineResearch。新机器仍需导入获授权客户端资源，才能获得本机完整画面。

## 大幅放大与真实论文接入

书籍与打开动画共享 380×180 的逻辑展开尺寸，每页 190×180。阅读 Scale 按窗口宽度 94% 与高度 94% 的约束计算，使用 0.25 档位；目录继续沿用旧的整数 GUI Scale。上述三种桌面尺寸下书宽约占 83%–85%，返回按钮与来源链接仍留在视口内。真实论文信息页与正文统一使用随项目提供的 OFL 像素字体 Monocraft，正文可选择复制；中文示例继续使用本地位图字形。

新增真实论文为 JiaMing Wang、Kai Yang、MinJing Li 的 NIDS-FGPA（PLOS ONE，2024，DOI 10.1371/journal.pone.0308639），保留英文原文，没有翻译或改署名。来源和许可：[出版方原文](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0308639)、[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)。本地内容为 301 个结构块，含正文、摘要、43 项参考文献、10 幅图、8 张表与原始公式。当前自动分页为 154 页。

出版方共提供 160 项不同图像，逐一检查实际图像尺寸及 SHA-256。159 项在书页作为独立图像或行内公式展示；e136 已在原始表格图片内完整显示，无须另外重复。图表按宽高比完整适配，保留题注，可以点击查看原图；Escape 关闭原图并继续当前双页。页码框用于直接定位，输入奇/偶数页均定位到该页所属的双页。窗口变化及输入焦点不会将书本滚出屏幕。

`PaperDocument` version 1 将内容统一为段落/图片：段落包含纯文字与行内公式图像 runs；图片保留原始宽高、标签和题注。`document-pagination.ts` 用实际加载的像素字体测量单词宽度，自动换行和分页，避免标题落在页底、整张图被截断。图片长题注可以继续到下一页；它不是原 PDF 的逐页排版。外部文本使用 React 节点渲染，不接受 HTML；`parsePaperDocument` 校验格式、图片尺寸及本地路径。

### 接入下一篇论文

明确拥有 CC BY 4.0 的 PLOS ONE 论文，可执行：

```powershell
python scripts/import-plos-paper.py --doi 10.1371/journal.pone.0308639 --slug nids-fgpa
python scripts/import-inventory.py --jar '你的原版1.21.1客户端.jar'
npm run build
npm run test:research-paper
```

导入器核验许可、DOI 与资源归属，只下载指定论文的出版方资源；缓存后重复运行不必再次下载。生成 `document.json`、`provenance.json`、原图，并更新 `src/data/papers.json`。原始 XML 本地保留且被忽略。目录图标统一改为原版附魔书。

其他期刊、作者 Markdown 或未来 API 可以产生同样的 `PaperDocument`，设置论文 `format: "document"` 和内容 URL；仓库接口和页面无需修改。普通 Markdown 仍可用旧入口。当前自动导入器只支持 PLOS ONE 的 JATS 与明确 CC BY 4.0，尚不是任意 PDF 自动解析器；扫描 PDF 或特殊附件需要单独的提取适配。补充材料和原始研究数据不包含在此次导入内。

最新验证：`npm run build`、`npm run test:research`、`npm run test:research-paper`。长文测试遍历所有双页，检查文字横向溢出、图片加载、图片哈希、页码焦点、原图关闭及三种窗口比例；结果记录在 `tests/research-paper-results.json`。截图新增 `research-real-paper-1366x768.png`、`research-real-paper-1920x1080.png`、`research-real-paper-2560x1440.png`、`research-real-paper-text.png`、`research-real-paper-figure.png`、`research-real-paper-original-image.png`。

## 论文藏书架与附魔检索台（2026-10-11）

目录保留原页面标题、入口和返回流程。中央改为原版云杉木板背板、橡木边框及层板、书架侧边组成的陈列架。每条记录是一本附魔书，长英文标题默认缩为冒号前短名；完整标题、作者、年份、简介和分类在鼠标悬停或键盘聚焦时显示。中央陈列采用三层、每层两个藏书位，左右各三块完整原版书架方块；至少六条论文记录无需滚动即可显示。超过六条后允许目录滚动，不复制虚构论文填满架子。

`EnchantmentTable.tsx` 用 Three.js 构建 16×12×16 附魔台和带左右铰链的书页，加载原版上下及侧面纹理、原版附魔台书籍图集。按经过时间实现浮动、翻页和轻微开合，鼠标偏转平滑计算。隐藏页面暂停绘制，卸载释放纹理、材质、几何体、观察器和渲染器；WebGL 或贴图不可用时保留原版台面静态后备。书的运动为网页近似实现，未声称完整复刻游戏模型的 UV 与全部动画参数。

`EnchantmentSearch.tsx` 固定在页面左下角，管理热点悬停、键盘聚焦与输入状态。默认隐藏搜索框；鼠标移入台面或按钮获焦后在上方显现。点击台面直接聚焦输入。输入时实时检索，Enter 提供确认反馈；保留关键词时搜索框继续可见，清空后可再次隐去。结果数通过状态区域公告，结果按相关性陈列，未匹配书本淡化保留。

声音使用已授权本地客户端资源 `minecraft/sounds/item/book/open_flip1.ogg`，SHA-1 `234d6a686516c264a370ea834b87d47ae7334ef7`。由 AudioManager 在主动聚焦、点击或 Enter 时播放，音量为设置音量的 35%，600ms 防重复；静音及错误处理保留。悬停不自动播放，避免未经交互播放或频繁提示。

搜索由独立 `PaperSearchService` 负责，不在页面读取 JSON。标准化 NFKC、大小写与标点后按多词查询，每个词都需要匹配。字段基础权重为标题 100、分类及关键词/可选 tags 65、作者 55、简介 30；完整匹配、包含匹配优先，再尝试滑动窗口编辑距离。长度 3–4 的词允许一次编辑，较长词允许两次编辑；极短词仅做包含匹配，减少噪声。数学建模、人工智能、网络安全、数据挖掘、软件工程和智能体提供字段别名，只有论文真实分类或标签包含相应概念才扩展别名。索引用 WeakMap 缓存，输入限制 100 字符；当前适合本地小型目录，非拼音或语义搜索。

未来由 API 版 PaperRepository 提供相同 ResearchPaper 元数据；搜索服务可以替换为异步后端适配器或 Worker，返回 `{ paper, score }`，继续复用陈列与结果反馈。当前没有添加后端或数据库。

排版突变修复：目录独立保存 `catalogScale`，阅读器保留其放大比例。点击论文不再改变背景目录的字体、按钮及陈列架尺寸，动画结束才隐藏目录。打开和返回的实测边界框必须一致。

验证入口：`npm run test:research-shelf`，测试标题/作者/分类/关键词/简介检索、英文错字、别名、相关性排序、空结果、清空、鼠标与键盘操作、打开/返回布局稳定及 1366×768、1920×1080、2560×1440。截图位于 `tests/screenshots/research-shelf-*.png`；原有书本过渡、翻页、异常和缩放回归使用 `npm run test:research`。


## 藏书架主体比例修正（2026-10-11）

移除此前裁切、拉伸的书架边框。`PaperList` 新增独立框架、左右完整书架列及三层中央陈列；每侧使用三张不裁切的正方形原版 bookshelf 纹理。中央每层两项，层高与侧边方块一致，使用木板层板和深色凹槽区分层次。目录按 430×272 的逻辑空间与窗口约 94% 的约束，以 0.25 档位缩放，书架成为页面主体；读取论文仍使用独立书籍比例，不改变目录布局。

现有数据只有两篇，其余四个位置明确标注“待收录”，不假造已发表论文。测试通过网络拦截注入六条临时测试记录，确认六篇实际记录在 1366×768 下也无需滚动、无裁切；该测试数据不会写入论文目录。新增真实论文时自动占用空位。附魔台保留用户认可的模型、动作、音效与搜索交互，仅将定位改为页面左下角。

验证 `npm run test:research-shelf` 检查三层两列、两侧六张正方形完整贴图、左下角定位、六条记录容量、搜索与打开布局稳定；三种分辨率实际截图仍保存在 `tests/screenshots/research-shelf-1366x768.png`、`research-shelf-1920x1080.png`、`research-shelf-2560x1440.png`。
