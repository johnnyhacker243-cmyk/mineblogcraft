# Minecraft Java Edition 1.21.1 视觉与行为核查

2026-10-10 更新：用户主动要求切换自定义石质博客 Logo，并固定黄色标语为 `Created by BingWang`。当前 Logo 是完整自带副标题的透明图片，不再显示原版 Java Edition。这属于授权的品牌修改；以下原版 Logo 坐标表和 2026-10-09 截图是此前还原阶段的历史基准，不代表当前自定义 Logo 的尺寸。新画面保存在 `tests/screenshots/custom-brand-1920x1080.png` 和 `custom-brand-1280x720.png`。

日期：2026-10-09（Asia/Shanghai）。本报告不使用还原度百分比。

## 参考及证据边界

先阅读以下资料，再编写工程；用户提供 1.21.1 后进一步读取本地资源和特定 UI 类，核实常数及方法行为。

- [Yarn TitleScreen](https://maven.fabricmc.net/docs/yarn-1.21.1%2Bbuild.1/net/minecraft/client/gui/screen/TitleScreen.html)、[TitleScreen 映射](https://mappings.dev/1.21.1/net/minecraft/client/gui/screens/TitleScreen.html)：菜单入口、初始化和渐显结构。
- [Screen](https://mappings.dev/1.21.1/net/minecraft/client/gui/screens/Screen.html)、[Window](https://mappings.dev/1.21.1/com/mojang/blaze3d/platform/Window.html)：逻辑 GUI 尺寸和整数 Scale。实际方法体通过本地类核查。
- [CubeMap](https://mappings.dev/1.21.1/net/minecraft/client/renderer/CubeMap.html)、[RotatingCubeMapRenderer](https://maven.fabricmc.net/docs/yarn-1.21.1%2Bbuild.1/net/minecraft/client/gui/RotatingCubeMapRenderer.html)：六面顶点/UV、透视及旋转。对应本地 `gen`、`gfb`。
- [LogoRenderer](https://mappings.dev/1.21.1/net/minecraft/client/gui/components/LogoRenderer.html)、[SplashTextRenderer](https://maven.fabricmc.net/docs/yarn-1.21.1%2Bbuild.1/net/minecraft/client/gui/screen/SplashTextRenderer.html)：纹理裁切和标语动画，对应 `fjd`、`fjq`。
- [Button](https://mappings.dev/1.21.1/net/minecraft/client/gui/components/Button.html)、[1.20.2 官方 GUI Sprite 改动](https://feedback.minecraft.net/hc/en-us/articles/19703470383757-Minecraft-Java-Edition-1-20-2)、[1.21.1 nine-slice 元数据](https://mcasset.cloud/1.21.1/assets/minecraft/textures/gui/sprites/widget/button.png.mcmeta)：200×20、border 3、中心和边缘重复铺设。
- [wcze 全景实现](https://github.com/wcze/minecraft-panorama)、[minecraft-html](https://github.com/jerosajose/minecraft-html)、[Monocraft](https://github.com/IdreesInc/Monocraft)：技术对照。未照搬其渲染器；示例的按帧旋转不适合作为原版速度证据。

真实客户端同尺寸截图尚未取得。网上检索结果混有其他版本，未把它们当成 1.21.1 精确视觉基准。下面的“差值”是浏览器 DOM 测量与从本地方法体建立的坐标公式之间的差值，**不是与游戏截图的像素差值**。不能据此宣布视觉完全一致。

## 1920×1080 基准

默认 Auto GUI Scale = 4，逻辑尺寸 480×270，DPR=1，浏览器缩放 100%。

|项目|原版逻辑坐标/尺寸|Web 实测物理像素|坐标差值|
|---|---|---|---|
|Logo|x=112,y=30,w=256,h=44|448,120,1024,176|0|
|Java Edition|176,67,128,14|704,268,512,56|0|
|Splash 锚点|363,69；-20°|1452,276；-20°|锚点 0，轮廓未做游戏像素对照|
|Singleplayer|140,115,200,20|560,460,800,80|0|
|Multiplayer|140,139,200,20|560,556,800,80|按布局公式一致|
|Realms|140,163,200,20|560,652,800,80|按布局公式一致|
|底部按钮行|左端116,y=199,w=248,h=20|464,796,992,80|0|
|版本信息|x=2,y=height−10|x=8,y=1040|0（Canvas 内容基线已修正）|

Options 宽 98，位于中心−100；Quit 宽 98，位于中心+2；语言为中心−124，辅助功能为中心+104。相邻主按钮纵向步长 24；最后一主按钮与底行相距 36 个 GUI 单位。

## 多分辨率测量

|窗口|Auto Scale|逻辑尺寸|首按钮理论 x,y|首按钮 Web x,y|
|---|---:|---|---|---|
|1280×720|3|427×240|338.7354,324|338.7344,324|
|1366×768|3|456×256|383.4386,336|383.4453,336|
|1600×900|3|534×300|500.3745,369|500.3750,369|
|1920×1080|4|480×270|560,460|560,460|
|2560×1440|6|427×240|677.4707,648|677.4688,648|

非整除分辨率按 `ceil(framebuffer/Scale)` 求逻辑尺寸，然后对 X/Y 分别投影；并非全页面 transform。首按钮坐标和尺寸的最大实测偏差约 0.0135 像素，来自 CSS 子像素量化。浏览器对像素纹理、Canvas 和游戏 OpenGL 的最终采样仍可能不同。

## 分项完成情况与剩余差异

|检查项|已完成及证据|剩余差异 / 原因 / 下一步|
|---|---|---|
|A/B Logo 位置、比例、轮廓|使用目标 JAR 原版 1024×256 纹理；按256×64纹理坐标仅显示256×44；副标题相同裁切方式|CSS 双线性采样与客户端采样仍需同尺寸截图验证；未实现低概率 Minceraft 彩蛋|
|C Splash|原版字库，中心+123、y69、−20°；`(1.8−abs(sin(t×2π)×0.1))×100/(文字宽度+32)`；每次页面会话选一次|支持443/446条原版标语；三条缺少已加载字形被排除；未实现节日和玩家名特例；需补全 Unifont 及客户端选择逻辑|
|D/E 主按钮|原版三状态 sprite；200×20、border3 的 CSS border-image repeat；位置及间距由客户端公式确定|CSS 九宫格最后一个重复片段的采样可能与游戏不同；须局部截图逐像素验证|
|F 下方两按钮|Options左、Quit右；98×20；正确84单位下行偏移|按下状态添加瞬时亮度反馈，未确认原版有此额外状态，可在对照后移除|
|G 图标|原版15×15图标、20×20按钮，正确左右关系；已修正2.5到2单位的图标偏移|在线Realms通知、邀请及账号相关状态未模拟；本原型无账户连接|
|H 底部信息|1.21.1版本与原版版权字符串；2单位边距；y=height−10|版权在游戏中可打开署名界面，本原型只显示文字；次级界面不追求完全复刻|
|I 全景画面|真实六面试炼密室资源；85°垂直FOV；10°俯仰；原版覆盖纹理；四次微偏移混合|Three.js的sRGB混合、GPU采样和原版不保证相同；未额外增加景深、暗角、颗粒、电影滤镜或任意模糊|
|J 旋转|每游戏tick0.1°，默认20tick/s，即2°/秒；保持客户端矩阵旋转符号；帧率无关|没有游戏同时间视频可比较初始帧、时钟和渐显开始时刻；隐藏标签暂停是浏览器性能策略|
|K 字体与阴影|2413个本地位图字形；按透明像素宽度计算advance；1单位阴影；按钮基线修正|缺少统一字体的全部Unicode覆盖；Splash旋转后的Canvas光栅化仍与游戏存在潜在差异|
|L 默认浏览器样式|移除默认margin、圆角、outline；真实按钮保留语义和焦点；无现代悬停缩放|range是简化设置页的原生控件；不同DPR、系统缩放和GPU未全覆盖|
|渐显|背景前1秒，GUI后1秒渐显，总2秒|没有游戏的资源加载遮罩和启动过程；动画起点跟随网页挂载|
|音效|本地1.21.1 click.ogg；用户动作后播放；音量、静音、错误停止|未校准到客户端相同输出设备的响度/延迟；未播放音乐，未伪称做听感验收|

## 实际浏览器验证与迭代

1. 依赖安装，Vite 启动，实际 Playwright Chromium 访问127.0.0.1；TypeScript/Vite 构建通过。
2. 首轮截图发现：非ASCII Splash缺字；按钮Canvas居中导致基线半单位偏移；非整除窗口存在逻辑投影误差；Logo原始纹理需要裁切而非拉伸。已分别补齐字库、修正基线、分轴投影、裁切图像，并重新截图。
3. 修正后七个主菜单入口及返回、键盘Tab/Enter/Space/Escape、背景暂停、音量控件通过。正常资源路径记录的console/pageerror及HTTP失败请求均为空。
4. 强制中止一面纹理请求、模拟WebGL不可用后，均进入明确静态后备画面。失败场景允许一次底层错误提示，不会持续重试刷屏。
5. 八个朝向实际离屏WebGL渲染图用于方向和接缝检查；未见明显倒置、镜像、几何断裂。按三维相邻边做256点采样，12条边的平均RGB绝对差为1.036（0–255尺度），这是**原版六张图边缘连续性检查，不是整页还原准确率**。
6. 单次资源生命周期检查：绘制后纹理6、几何6，dispose后均为0。隐藏页面停止rAF的实现已核查；未进行长时间内存浸泡测试、普通桌面硬件FPS测量或全GPU兼容性测试。

证据：`tests/results.json`、`tests/panorama-results.json`、`tests/seam-results.json`；实际图片在 `tests/screenshots/`。截图中的动态全景帧不同，不适合直接把整图像素差解释为GUI误差。

P0运行和菜单交互已通过；P1原版素材、几何、字形及运动行为已有实现和局部验证。下一轮最有价值的工作是取得用户实际客户端1920×1080、GUI Scale4、英文界面截图，逐区域比较Logo、按钮、文字、图标，然后同旋转相位比较全景采样与亮度。当前无法完成这一高精度视觉验收步骤，未虚构原版截图或一致率。
