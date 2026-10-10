# Mineblogcraft — Minecraft 风格个人博客前端

2026-10-10 自定义更新：按用户要求，主 Logo 使用 `gptphotos/我的世界风格石质博客标志.png` 的完整透明图片（运行副本为 `public/assets/logo/blog-logo.png`）。图片自带 `PERSONAL BLOG EDITION`，所以不再叠加原版 Java Edition。黄色标语固定为 `Created by BingWang`，配置入口为 `ui-config.ts` 的 `splash.text`；设为 `null` 可恢复随机选择。其余主菜单布局保留。

这是独立的本地 Web UI 研究项目，与 Mojang、Microsoft 没有官方关联。当前使用用户明确授权读取的本地 **1.21.1** 客户端素材；授权读取不等于取得公开再分发许可。没有部署公网，也没有实现博客或真实游戏功能。后续前端开发路线见 [DEVELOPMENT_PLAN.md](DEVELOPMENT_PLAN.md)，阶段性提交约定见 [AGENTS.md](AGENTS.md)。

## 启动

在本目录用 PowerShell 执行：

```powershell
npm ci
npm run dev
```

打开 <http://127.0.0.1:5173/>。服务器只监听本机。需要 Node.js 20.19+ 或 22.12+；此次实际环境为 Node 24.11.0、npm 11.6.1。

```powershell
npm run build
npx playwright install chromium
npm test
npm run test:panorama
```

测试需要开发服务器保持运行。`tests/inspect-seams.py` 使用 Python、Pillow、NumPy生成接缝指标及全景检查拼图。运行输出记录在 `tests/results.json`、`tests/panorama-results.json`、`tests/seam-results.json`。

## 技术栈和结构

实际安装：React / React DOM 19.3.0、TypeScript 5.9.3、Three.js 0.180.0、Vite 7.3.7、Playwright 1.64.0；锁定依赖见 `package-lock.json`。普通 CSS，没有后端或状态管理框架。

```text
src/components/  主菜单容器、全景、Logo、Splash、位图文字、按钮和底部信息
src/screens/     MainMenuScreen 与共享的简化次级菜单
src/config/      ui-config、assets-config、panorama-config
src/utils/       GUI Scale、逻辑坐标投影、位图字体、六面顶点及 UV
src/managers/    AudioManager
src/styles/      GUI、主菜单、后备 Monocraft 字体
public/assets/   本地导入的全景、GUI、Logo、字体、点击声音
scripts/         精确版本资源导入与官方资源哈希清单
tests/           浏览器测试、测量结果、实际截图
```

## 已实现

- 独立 Logo 组件及原版裁切接口；当前显示用户提供的 Mineblogcraft Logo。使用本地原版六面试炼密室全景、按钮三种贴图、语言和辅助功能图标。
- Three.js 的六面立方体，按本地客户端顶点/UV 与矩阵顺序绘制；85° FOV、10° 固定俯仰、默认 2°/秒旋转、四次微偏移混合。使用帧时间，隐藏页面停止动画，卸载释放资源。
- 原版 ASCII、欧洲及重音位图字形，按字形宽度绘制；一 GUI 像素阴影。主菜单文字不依赖系统字体。
- 两阶段启动渐显、-20° 倾斜及原版正弦脉冲；当前标语固定为 `Created by BingWang`，保留每次进入会话随机选择的配置接口。
- 游戏 GUI Scale 的 Auto/1–4 设置；Auto 按 320×240 下限选择整数 Scale，再用实际逻辑尺寸投影各元素，不对整个页面做 CSS 缩放。
- 七个入口、简化世界/服务器/Realms/退出画面、返回、Tab、Enter、Space、Escape。
- 音量、静音、动态背景、减少运动设置；原版本地点击声音只由主动点击触发。
- 纹理失败与 WebGL 不可用时使用静态后备画面。

语言面板目前只提供英语，世界/服务器创建按钮是明确禁用的示意功能。没有登录、联网 Realms、真实游戏或菜单音乐。

## 资源重新导入

本机资源已经导入，无须再次执行。移动源代码时，游戏资源和截图被 `.gitignore` 排除；不要把它们视为开源素材。对明确获得授权的原版客户端可执行：

```powershell
./scripts/import-client.ps1 -Jar 'C:\Users\36451\AppData\Roaming\.minecraft\versions\1.21.1\1.21.1.jar'
```

若 PCL 设置了独立的资源目录，可显式指定 `-AssetsDirectory '你的资源目录'`。脚本只读取指定 JAR、同名版本 JSON、关联资源索引和八个具体的资源对象，不扫描其他个人目录。核对原版客户端 SHA-1 和每个资源对象哈希；共享 `17.json` 与最初版本索引不同的情况，会逐项对照官方 1.21.1 哈希清单。

来源和限制见 `ASSET_LICENSES.md`，导入记录见 `public/assets/CLIENT_PROVENANCE.json`。本地类分析只保存在忽略的 `.local-reference/`，不进入 Web 构建。

自定义 Logo 也没有纳入 Git。新机器导入游戏资源后，还需将自己获准使用的 Logo 复制到 `public/assets/logo/blog-logo.png`；当前配置不叠加原版副标题。缺少上述本地素材时，克隆代码不能还原本机完整画面。

## 测试和截图

已在实际 Chromium 中完成截图分析、修改和复测。保存了：

- `tests/screenshots/main-1920x1080.png`
- `tests/screenshots/hover-1920x1080.png`
- `tests/screenshots/main-1366x768.png`
- `tests/screenshots/main-1280x720.png`
- 1600×900、2560×1440、静态后备截图以及 `panorama/` 内的八个朝向。

1920×1080 基准为 GUI Scale 4，逻辑窗口 480×270。主按钮实际位置 560,460，大小 800×80。所有五种分辨率的坐标、尺寸、理论值和差值记录在 `tests/results.json`。

**没有取得真实运行客户端的同尺寸截图，因此尚未完成同帧像素对照，不能宣称完美 1:1。** 原版素材与方法体可核实几何和行为，但 WebGL 色彩混合、纹理采样、按下反馈、声音响度及长期性能仍需进一步验证。详细分项说明见 `FIDELITY_REPORT.md`。

## 未来替换为 Minebogft

1. `src/config/assets-config.ts`：修改 `logo`、`subtitle`，替换素材；主 Logo 默认纹理比例 256×64，仅显示上部 256×44，副标题纹理比例 128×16，仅显示上部 128×14。原版实际图像为 4 倍分辨率。自制 Logo 可以使用相同透明画布结构。
2. `src/config/ui-config.ts`：修改品牌文字、Logo 尺寸和位置、`menu` 的标题/页面目标、后备 `splashes`、版本与底部信息。
3. `src/config/assets-config.ts` 的 `splashes` 可指向自制文本列表；`SplashText` 负责选择和动画。
4. 新页面扩展 `ScreenId` 与 `MinecraftTitleScreen` 的页面映射；主菜单按钮继续从 `menu` 读取配置。

当前主 Logo 显示 Mineblogcraft，版本文字为 `Mineblogcraft 1.22.1`，底部文字为 `Copyright BingWang YTC. Do not distribute!`；显示版本与素材来源版本相互独立。将来公开发布前必须重新审查素材、Logo、商标和声音授权。
