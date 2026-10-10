# 作者物品栏：实现与还原记录

## 最新本地调整：握持直角、状态条与单层边距

在确认镐柄垂直手正面后，按用户要求绕镐柄轴再旋转 90°；握点和柄轴方向保持不变，仅改变镐头及工具平面的朝向。

最新追加：在整个灰色展示框外侧下方居中增加原版菜单按钮“返回”，返回主菜单，并复用 AudioManager 播放已授权的本地点击声音；Tab、Enter、Space 与原有按钮行为一致。按钮使用整数 Scale 2（400×40），与展示框间隔 8px；整体仍保留一层方块的外边距。装饰分类栏加入工作台和下界之星，使用客户端纹理，共八项。血量、饱食度及快捷物品栏使用 GUI Scale + 1 的整数像素缩放（1920×1080 从 4 提升到 5），仍居中。网站介绍保留正文，去掉重复小标题以让出底部空间。

本轮调整已通过用户验收，并于 2026-10-10 获得提交仓库授权。桌面页面整体留出四周各 64 像素（一个平铺方块）的边距，面板按窗口展开；1920×1080 整体位置 64,64，尺寸 1792×952，内部仍使用 Scale 4。文本、纹理及槽位没有整体 CSS transform 缩放。

底部快捷栏上方添加原版 1.21.1 HUD 血量、饱食度容器/满值纹理，各十个图标，显示 20/20；这是作者页的静态游戏式展示，不代表游戏状态。简介文字压成标题加横排两句话，避免与状态条重叠。

按用户再次澄清，目标面是右手朝向用户的正面，而非手臂长轴方向的端面。木柄纹理轴 `(1,1,0)` 先绕 Z 旋转 45°，再绕 X 旋转 90°，对齐手的本地 `+Z` 正面法线；继承右臂骨骼旋转后仍保持垂直。测试计算轴与正面法线的点积，目标为 1。正视角下镐柄会因朝向镜头而缩短，侧视角可以看到伸出的柄。当前握持姿态仍为 Web 校准，不宣称达到同帧游戏像素一致。

草层与土层合并为同一背景绘制，使用相同暗化；首版草层位于遮罩上方、土层位于遮罩下方造成亮度不一致的问题已修复。游戏素材仍只在本地。

## 前一轮布局修订记录

按用户反馈，Logo 贴近面板左上方，六个原版代表物品标签靠最右侧：草方块、钻石镐、钻石剑、TNT、金苹果、末影珍珠。移除告示牌和原有图标/文字两排槽位；网站介绍直接放入扩展后的灰色面板。底部为一排九个原版 18×18 槽位：一把钻石镐，八组带原版像素数字“64”的钻石。

整体逻辑尺寸改为 390×250（主体 390×208）。1920×1080 使用 Scale 4，实际整体 1560×1000，位置 180,40；原版本整体为 1170×1020。背景仍平铺土方块，最上方一层使用原版草方块侧面及原版覆盖纹理的草色混合。字体子集现在为 301 个字形。

重新阅读本地 ItemInHandLayer：物品变换附着手臂骨骼，经过旋转和掌部位移。修订工具不再以纹理中心粘在手臂前方，而是将木柄纹素 `(5,11)` 作为握点，定位到手掌并调整三维朝向，使镐头伸向手掌外侧。当前姿态仍是校准后的 Web 实现，不宣称与游戏 ItemRenderer 的变换完全相同。

修复低头时整个人围绕脚部倾倒的问题：身体保持直立，头部绕颈部旋转，俯仰限制 ±25°。这是按用户反馈做的姿态修正，与首版对原版整体显示旋转的直接迁移不同。新增上下看、直立身体、工具握点、标签右对齐和钻石数量检查；结果见 `tests/profile-results.json`。截图已覆盖为本地修订版，新增 `profile-look-down.png`。

以下章节保留首版研究和差异记录，不代表当前修订布局。首版提交为 `bf65e2c`，本轮按用户要求不创建提交、不推送。

日期：2026-10-10。入口为主菜单原辅助功能图标，名称改为“作者介绍”；按 Escape 关闭。本页不提供导航、文章列表或可点击分类。

## 编码前研究

读取了用户授权的原版 1.21.1 客户端，SHA-1 为 `30c73b1c5da787909b2f73340419fdf13b9def88`。用本地 CFR 阅读 InventoryScreen、CreativeModeInventoryScreen、AbstractContainerScreen、GuiGraphics、PlayerModel、HumanoidModel、PlayerRenderer、EntityRenderDispatcher、HumanoidArmorLayer；沿用前一阶段对 Screen 的研究。源码和类文件仅保存在忽略的 `.local-reference/`。

用于确认类名和方法对应关系的资料：

- [InventoryScreen / 鼠标跟随方法](https://mappings.dev/1.21.1/net/minecraft/client/gui/screens/inventory/InventoryScreen.html)
- [CreativeModeInventoryScreen](https://mappings.dev/1.21.1/net/minecraft/client/gui/screens/inventory/CreativeModeInventoryScreen.html)
- [AbstractContainerScreen / HandledScreen](https://mappings.dev/1.21.1/net/minecraft/client/gui/screens/inventory/AbstractContainerScreen.html)
- [GuiGraphics / DrawContext](https://mappings.dev/1.21.1/net/minecraft/client/gui/GuiGraphics.html)
- [PlayerModel](https://mappings.dev/1.21.1/net/minecraft/client/model/PlayerModel.html)、[HumanoidModel](https://mappings.dev/1.21.1/net/minecraft/client/model/HumanoidModel.html)
- [PlayerRenderer](https://mappings.dev/1.21.1/net/minecraft/client/renderer/entity/player/PlayerRenderer.html)、[EntityRenderDispatcher](https://mappings.dev/1.21.1/net/minecraft/client/renderer/entity/EntityRenderDispatcher.html)、[HumanoidArmorLayer](https://mappings.dev/1.21.1/net/minecraft/client/renderer/entity/layers/HumanoidArmorLayer.html)

本地代码确认：创造物品栏 195×136，居中 `(窗口逻辑尺寸 - 面板尺寸) / 2`；标签 26×32、横向步长 27、顶部偏移 -28；槽位步长 18。普通背包人物显示区为面板偏移 `(26,8)..(75,78)`，创造模式人物显示区为 `(73,6)..(105,49)`。

鼠标跟随先计算人物区域中心与鼠标的逻辑偏移，使用 `atan(dx/40)`、`atan(dy/40)`；身体偏航系数 20°，总头部偏航系数 40°，头部俯仰系数 -20°，整体显示另有 X 轴旋转。Web 实现转换到 Three.js 坐标系，独立调整身体、头部 yaw/pitch，不使用 CSS 旋转人物。

## 本轮实现

- 复用原版 tab_items 面板角与边，裁切成可拉伸边框；原版 18×18 槽位和六种顶部标签。分类仅作展示。
- 玩家使用宽臂 Steve：头 8×8×8、身体 8×12×4、手臂和腿 4×12×4；原版 64×64 皮肤 UV。Java 模型由程序定义，不能直接当作 glTF 加载，所以将模型尺寸及纹理映射转换成 Three.js 几何体。
- 钻石外层采用 1 像素膨胀，护腿采用 0.5 像素膨胀，读取两个原版盔甲纹理。钻石镐从原版像素纹理生成具有厚度的几何体，随右臂与身体转动。
- 土方块平铺背景，人物区域铺草方块顶部纹理；图标使用原版方块/物品纹理，不使用 Emoji。
- 用户自有 Mineblogcraft Logo；作者资料采用用户给定占位文本，由 `src/config/profile-config.ts` 管理。
- 中文从客户端对应 Unifont 对象提取本页所需字形，包括 ASCII，共 303 个字形。生成的小图集代替整套 4096×4096 图集；改动中文后重新执行导入脚本。
- 告示牌使用 `textures/entity/signs/oak.png` 的正面及侧面像素；1.21.1 中没有本任务示例路径 `block/oak_sign.png`。

## 布局与差异

|对象|原版基准|当前作者页|原因/继续修复|
|---|---|---|---|
|主体|195×136|390×186 逻辑像素|按用户要求加入较长中文简介；布局扩展，不能称为原版整屏 1:1|
|标签|26×32、步长 27|相同|原版纹理，本页六个装饰标签，不复刻全部分类|
|物品槽|18×18|一排九个 18×18|移除多余库存行与装备栏|
|文字槽|原版无此模块|九个 40×20|为用户指定文字扩展槽位宽度|
|1920×1080 缩放|游戏可选 GUI Scale|作者页整数 Scale 3，整体 1170×1020，左上 375,30|作者页总高度更大，采用独立适配；与主菜单 Scale 4 分开|
|简介|原版没有作者资料|物品描述式暗色区域|属于用户指定内容设计；不假称原版布局|
|玩家光照|游戏实体着色器与 GUI 光照|Three.js 漫反射光照|颜色亮度未做同帧客户端像素校准|
|工具|原版 generated-item 边缘及持握变换|纹理逐像素厚度几何体与静态持握姿态|轮廓和原版像素相同，但边缘网格及手部变换不完全等同原版 ItemRenderer|
|方块图标|原版 ItemRenderer 投影|原版纹理的 CSS 三面投影|素材为原版，投影不是原版渲染管线|
|文字|默认字体按字形/provider 选择|本页统一客户端 Unifont 位图|中文有来源；英文形状与主菜单 ASCII 字体略不同|
|告示牌|实体模型与通常四行文字|原版纹理正面/侧面及五行介绍|本页展示介绍板，不是完整 SignRenderer 模型|

没有收到本任务提到的“物品栏图片二”或实际游戏同尺寸截图；只有入口图标截图。因此无法完成原版同帧高精度像素验收，也不宣称“GUI 100%还原”。接下来可用用户提供的客户端截图对齐面板、人物投影、光照和持握姿态。

## 验证与截图

命令：`npm run build`、`npm run test:profile`、`npm test`。实际运行结果分别见终端与 `tests/profile-results.json`、`tests/results.json`，不能以构建成功代替视觉验证。

作者页测试覆盖五种桌面分辨率、资源/控制台错误、九个物品槽/九个文字槽、真实 WebGL 几何体、鼠标左右 yaw、Escape 关闭与反复进入。通过包装 WebGL 分配/删除函数检查退出后纹理、缓冲区、程序释放情况。

释放测试区分应用资源与 Three.js 内部四张占位纹理：应用纹理、缓冲和程序显式删除；内部占位纹理由 `forceContextLoss()` 释放，测试实际检查 `isTexture()` 失效和上下文已丢失，不能单凭删除调用次数判定泄漏。另验证上下俯仰、WebGL 不可用及皮肤加载失败时的明确错误提示。

截图位于 `tests/screenshots/profile-1920x1080.png`、`profile-1366x768.png`、`profile-1280x720.png`，另有 1600×900、2560×1440 和左右转头截图。首轮看图后补上原版告示牌侧边纹理，调整截图鼠标位置以建立人物正面基准，再复测。

原版纹理、字形图集和截图全部忽略，不推送到 GitHub。新机器必须自行导入获授权的客户端资源。
