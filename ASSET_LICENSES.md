# 素材来源与使用范围

## ClassiCube Web 接入（2026-10-13 / 14）

MineWorld 使用官方仓库 https://github.com/ClassiCube/ClassiCube 的独立预编译 Web 客户端，来自官方 CDN `https://cdn.classicube.net/client/latest/ClassiCube.js`，游戏核心字节未修改。代码分发按照上游 BSD 三条款及其依赖声明，完整 `license.txt` 复制为 `public/vendor/classicube/LICENSE.txt`，同产物一起保留。研究快照在忽略目录；不冒充自己编写游戏引擎。

Web 默认材质 `public/static/default.zip` 来自 `https://www.classicube.net/static/default.zip`，按官方 `doc/hosting-webclient.md` 明确给出的下载并自托管方法接入；不是用户本地 Mojang JAR 的提取资源。客户端、材质与许可证来源、字节大小和 SHA-256 记录在 `public/vendor/classicube/PROVENANCE.json`。该记录不将代码 BSD 许可扩张到其他游戏素材；原有 Minecraft 本地素材提交范围保持不变。

2026-10-10：当前主 Logo 换成用户明确指定的 `gptphotos/我的世界风格石质博客标志.png`，未经图像处理直接复制为 `public/assets/logo/blog-logo.png`。这是用户提供的自定义素材，本次获得的是在该本地项目中使用的授权；未核实其公共再分发许可。原版 Logo 文件仍保留用于研究对照，当前不显示。

## Minecraft 原版资源

用户在本聊天中允许读取其合法持有的客户端，并提供了准确路径。目标资源来自：

- `C:\Users\36451\AppData\Roaming\.minecraft\versions\1.21.1\1.21.1.jar`
- 该版本 JSON 指向的 `assets` 索引，以及 `.minecraft/assets/objects` 中的明确对象。
- JAR SHA-1：`30c73b1c5da787909b2f73340419fdf13b9def88`。
- 核验索引：[Mojang 官方 1.21.1 asset index](https://piston-meta.mojang.com/v1/packages/00551f206ccb65cb965fd0aebc14d22cda282db7/17.json)。仅下载索引元数据做核验，游戏图像及声音均从本地读取。

使用了 Logo、Java Edition、普通/高亮/禁用按钮、两枚图标、三张位图字库与映射、Splash 列表、六张全景、覆盖纹理及 `random/click.ogg`。版权所有者为 Mojang / Microsoft；本项目没有获得开源或公共再分发授权。用户许可的范围是本地研究原型，不能据此上传公网或分发素材。游戏资源、截图和本地分析目录均已从 Git 默认跟踪中排除，但本地 `dist/` 仍含这些资源，不可直接公开发布。

本地 JAR 内全景为 1×1 占位文件，实际图像从该版本的资源对象读取。PCL 的共享索引文件并非原始索引全文，但本次使用的八项对象哈希均与 Mojang 官方 1.21.1 索引相同；复制后再次核对哈希。完整记录在 `public/assets/CLIENT_PROVENANCE.json`。

1.21.10 和其他版本未作为素材来源。没有从第三方 GitHub 示例或 mcasset.cloud 下载游戏图像。

## Monocraft

[IdreesInc/Monocraft 官方仓库](https://github.com/IdreesInc/Monocraft)，SIL Open Font License 1.1。字体保存在 `public/assets/fonts/Monocraft.ttf`，完整许可证随附为 `OFL.txt`。用于简化次级页面及位图字体错误时的后备显示，主菜单使用客户端位图字体。

## 开发工具与研究资料

React、Vite、Three.js、TypeScript、Playwright 和 Prettier 通过 npm 安装，具体版本锁定在 `package-lock.json`；各自许可证随包保留。CFR 0.152 来自[工具作者网站](https://www.benf.org/other/cfr/)，MIT 授权，仅用于本地阅读获授权客户端的几个 UI 类，不随网页加载。Yarn、mappings.dev 和官方更新说明用于技术核查；参考项目只阅读技术说明，没有复制其素材或代码。

此文件是本次素材记录，不能代替未来发布时的授权审查。

## MineResearch（2026-10-11）

从同一获授权的本地 1.21.1 客户端提取 written_book、writable_book、gui/book、enchanting_table_book 图集，以及 page_backward/page_forward 普通与高亮 GUI Sprite。复用客户端字库、菜单按钮和点击音效。所有原版图像、字形与来源记录位于忽略目录，不纳入 Git，也未获得公开再分发授权。

用户明确授权先编写示例论文；`public/papers/paper001.md` 与三个公式/示意 SVG 为本项目原创内容，可纳入代码检查点。论文明确标注为原创示例、非发表论文；不冒充真实成果或实验数据。经典数学公式的参考来源见 RESEARCH_MODULE.md，没有复制第三方论文图片。

书本动画精修时，依据用户允许补充过渡资产的要求，增加原创 `public/papers/transition/plain-cover.svg`，使用棕色像素书皮语言；它不是 Mojang 原版纹理，也不是 AI 生成图片。纸边与阴影由 CSS 构建。最终阅读页仍复用本地原版纹理。

## MineRSS（2026-10-11）

新增本地原版纹理：item/empty_armor_slot_shield.png、item/enchanted_book.png、gui/sprites/server_list/ping_5.png 和 ping_1.png，来源为同一用户授权的 1.21.1 客户端。用户指定的「暮色湖畔的村庄与紫色传送门.png」仅完整复制供本地背景显示，没有重绘或修改；其授权范围不能据此推定为公开再分发。纹理、字体和背景副本全部忽略。RSS 静态源描述与标签来自用户给定内容，未采集第三方文章。

## 博客世界列表（2026-10-11）

同一用户授权的 1.21.1 客户端新增固定提取 `textures/gui/menu_list_background.png`、`header_separator.png` 和 `footer_separator.png`。草方块封面复用本地原版顶面和侧面纹理。中文图集增加本地博客正文及菜单字形；资源与来源哈希仍保留在忽略的 inventory 目录。博客正文依据用户给定题纲及本项目实际开发记录撰写，可供用户修改；没有额外第三方文章素材。

## 作者物品栏（2026-10-10）

同一获授权原版 1.21.1 客户端新增提取创造模式面板/标签、原版槽位、土/草/蓝冰/工作台纹理、书/红石/指南针/钻石镐、宽臂 Steve、两个钻石盔甲图集和橡木告示牌实体纹理。边框、槽位、告示牌正面/侧边仅裁切原版像素，没有 AI 重绘。新增资源全部位于忽略的 `public/assets/inventory/`，逐项 SHA-1 记录在该目录 `PROVENANCE.json`。

中文来自本地资源对象 `minecraft/font/unifont.zip`，SHA-1 `666999116c467f10622db1527a06ddc0a6efad2a`，只读取指定对象文件；提取当前页面的字形，图集与元数据仍保留本地。没有以读取客户端许可推定整个字体包或游戏纹理可以公开再分发。

导入脚本与模型转换代码纳入 Git，原版资源、字形和研究类文件不纳入 Git。作者内容为用户指定占位信息，不是已经核实的个人经历。还原范围见 `PROFILE_FIDELITY.md`。

## NIDS-FGPA 开放获取论文（2026-10-11）

JiaMing Wang、Kai Yang、MinJing Li (2024)，PLOS ONE 19(10): e0308639。原文 https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0308639 ，出版方 XML 明确链接 https://creativecommons.org/licenses/by/4.0/ 。正文、图表及公式依据 CC BY 4.0 导入；保留作者、出处、许可链接与改动说明，未暗示作者或出版方认可本站。

`public/papers/nids-fgpa/` 中的结构化正文、160 个图像、署名说明与来源/哈希记录可以随本地代码检查点提交。改变的是 JATS/HTML 布局到像素双页的排版，未翻译原文；原图字节未修改。原始 XML 忽略。附加数据集、补充材料没有采集。本许可只适用于上述论文，不适用于游戏素材；附魔书图标依旧为用户授权读取的本地原版游戏纹理，被 Git 忽略。

MineResearch 藏书架新增本地原版素材：`block/bookshelf.png`、`block/oak_planks.png`、`block/spruce_planks.png`、`block/enchanting_table_top.png`、`block/enchanting_table_side.png`、`block/enchanting_table_bottom.png`，复用 `entity/enchanting_table_book.png` 与 `item/enchanted_book.png`。书页反馈声来自同版本资产索引中的 `minecraft/sounds/item/book/open_flip1.ogg`。均由用户授权的 1.21.1 本地客户端读取，输出位于被忽略的 `public/assets/inventory/`，不会加入 Git 提交；并非自由再分发素材。附魔台几何与动作是前端参考实现。

MineWiki 使用本地 Minecraft Java 1.21.1 原版 `gui/advancements/` 窗口/背景、`gui/sprites/advancements/` 页签与三类节点框；新增纸、时钟、铁剑与中继器图标。窗口裁取和边缘切片只为本地前端阅读适配，导出在被忽略的 `public/assets/inventory/`。字体和音效沿用已授权本地客户端，未再分发至 GitHub。具体清单及视觉限制见 WIKI_MODULE.md。

## MineStatus 本地状态附魔台

使用 1.21.1 原版附魔窗口、词条及等级图标、钻石剑、青金石和附魔书图集；通过 scripts/import-inventory.py 从已授权客户端导入。窗口边框仅裁切原像素，书本由代码几何渲染。派生 PNG、原始纹理与位图字体仍保留本地、排除 Git，不作为可自由再分发素材。无需新增第三方美术资源。

## Mojang 入场加载素材

入场加载使用本地授权1.21.1客户端的 gui/title/mojangstudios.png，拼接左右图集为显示图片，源像素未重绘。原图及派生图保留本地且不提交；这是原权利人的商标与游戏素材，读取授权不代表公开再分发授权。说明见 STARTUP_LOADING.md。

## MineWorld 本地素材

MineWorld 从已授权1.21.1客户端读取石砖/雕纹石砖、深色橡木、铜块、海晶灯、玻璃、黑曜石、动态下界传送门、铁砧、红石块、石英和树叶纹理，复用书架/工作台/附魔台/附魔书与位图字体。纹理保留本地且被Git忽略；建筑、简化展示物几何与位图标牌由项目代码组合生成。没有下载第三方地图或写实模型。原版素材权利归原权利人，读取许可不意味着公开再分发许可。

## 完整原论文与 PDF.js

新增论文使用原站或公开学术存档直读，不将 32 份原 PDF 加入 Git、public 或 dist。27 篇 arXiv 与 Raft 作者站点保留原许可/出处；四篇经典论文的公开存档逐字节等同原作者文件，元数据同时保留规范来源与哈希。可访问不等于允许本站重新托管。

PDF.js 使用 Mozilla 官方 npm 包 pdfjs-dist 6.4.299（Apache-2.0）。scripts/prepare-pdf-assets.mjs 从安装包复制 worker、CMaps、标准字体、WASM 编解码器及各自 LICENSE；生成目录 public/pdfjs 被 Git 忽略，但本地构建包含所需文件和许可声明。正文仅渲染，不执行 PDF 脚本或动作。未替换原版书本或附魔书贴图。详见 PAPER_FULLTEXT.md。

论文网络故障修复新增私有本地缓存 `.local-reference/paper-pdfs/`，只供现阶段本地阅读使用。缓存被 Git 忽略且不在 public，Vite 插件仅开发模式启用，不将这些原文加入生产静态构建，也不改变原许可或重新分发范围。

## MineBlog 日更主题物品

2026-10-15 重编 21 篇学习笔记，按 `config/blogIcons.json` 从同一获授权 Minecraft Java 1.21.1 客户端提取 21 种未修改的物品 PNG。使用中继器、铁剑、末影珍珠、书与笔、不死图腾、烈焰粉、指南针、钓鱼竿、命名牌、红石、拴绳、时钟、青金石、紫水晶碎片、望远镜、比较器、铁胸甲、光灵箭、成书、收纳袋与运输矿车。提取脚本验证客户端 SHA-1；图片、逐项来源哈希与扩展字形图集均留在忽略的 `public/assets/inventory/`，不提交或额外发布。没有生成或重绘游戏图标。正文为带原始资料出处的 AI 辅助编辑草稿，外部研究保留原作者归属，不冒充个人实验。详见 `docs/MINEBLOG_EDITORIAL_2026.md`。


## MineRSS 原版主题物品（2026-10-16）

`config/rssIcons.json` 记录 21 个原版物品、贴图路径及选择理由。`scripts/import-rss-icons.py` 校验本地 1.21.1 客户端 SHA-1 后逐字节提取 PNG；输出及来源哈希位于忽略的 `public/assets/inventory/rss-icons/`，不提交 Git。原版资源权利仍属原权利人，不因本地读取或部署而改变许可。部署继续沿用已有运行资源清单，GitHub 仅保存哈希元数据及代码，未上传原始客户端。详见 `docs/MINERSS_CURATION_2026.md`。


## MineWorld 暂停菜单适配

保留官方 ClassiCube.js 及其原始 SHA-256，不覆盖上游文件。`scripts/prepare-mineworld-client.mjs` 为用户要求的无暂停菜单体验生成独立派生脚本，只禁用暂停菜单入口与相应 Escape 吞键标志；派生脚本被 Git 忽略，在本地/云端构建中可重复生成，继续附带现有 ClassiCube LICENSE.txt。原版游戏素材许可不因该代码适配而改变。


## MineBlog 世界进入图标

悬停进入图标直接使用本地获授权 Minecraft Java 1.21.1 客户端的 `gui/sprites/world_list/join.png` 与 `join_highlighted.png`，逐字节提取，未重绘。`scripts/import-inventory.py` 记录两项映射；输出 `public/assets/inventory/world-join*.png` 继续被 Git 忽略，仅在已有部署资源清单记录大小与哈希。
