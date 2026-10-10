# 素材来源与使用范围

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

## 作者物品栏（2026-10-10）

同一获授权原版 1.21.1 客户端新增提取创造模式面板/标签、原版槽位、土/草/蓝冰/工作台纹理、书/红石/指南针/钻石镐、宽臂 Steve、两个钻石盔甲图集和橡木告示牌实体纹理。边框、槽位、告示牌正面/侧边仅裁切原版像素，没有 AI 重绘。新增资源全部位于忽略的 `public/assets/inventory/`，逐项 SHA-1 记录在该目录 `PROVENANCE.json`。

中文来自本地资源对象 `minecraft/font/unifont.zip`，SHA-1 `666999116c467f10622db1527a06ddc0a6efad2a`，只读取指定对象文件；提取当前页面的字形，图集与元数据仍保留本地。没有以读取客户端许可推定整个字体包或游戏纹理可以公开再分发。

导入脚本与模型转换代码纳入 Git，原版资源、字形和研究类文件不纳入 Git。作者内容为用户指定占位信息，不是已经核实的个人经历。还原范围见 `PROFILE_FIDELITY.md`。
