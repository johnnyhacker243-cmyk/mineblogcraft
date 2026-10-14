# MineWorld：ClassiCube 单机游戏入口

当前实现以用户最新需求替换原三维博物馆。首页地球按钮进入 `/mineworld`，经过像素加载屏进入 ClassiCube 的 Minecraft Classic 单机世界；不实现自己的渲染、移动、碰撞或地图引擎。

## 官方源码研究

研究仓库：https://github.com/ClassiCube/ClassiCube ，本地只读快照提交 `32439b1a4b992560d925552ad76c738a94047582` 保存在忽略目录 `.local-reference/ClassiCube/`。

- `src/main_impl.h`：程序参数解析，单个用户名参数启动单机游戏。
- `src/Game.c`、`src/World.c`、`src/Generator.c` 等：游戏循环、世界与生成逻辑，全部由上游处理。
- `src/webclient/Platform_Web.c`：Emscripten 浏览器平台和文件系统。
- `src/webclient/Window_Web.c`：画布尺寸、键鼠事件、原生鼠标锁定与全屏。
- `src/webclient/interop_web.js`：JavaScript 桥接、默认材质下载、IndexedDB 设置、浏览器音频。
- `misc/makefiles/web.mk`：`make web RELEASE=1`，需 Emscripten；当前源码构建默认生成 WebAssembly。官方预编译下载包是可独立运行的单文件 JavaScript，不能将研究源码提交号冒充该二进制的构建提交号。
- `doc/hosting-webclient.md`：官方自托管方法；`license.txt`：完整代码和依赖许可声明。

## Web 启动流程

React 入口 → 独立 iframe 启动页 → 校验默认材质可访问 → 设置 `Module.canvas` 和 `[username]` → 动态加载未修改的官方 `ClassiCube.js` → 下载 `/static/default.zip` → 恢复 IndexedDB 设置 → 上游 `main_phase2` → 原生世界生成、渲染与控制。

主站监听同源且来源为当前 iframe 的状态消息。加载期间显示 Generating World / Loading Minecraft / Preparing Game；资源缺失、脚本失败、上下文丢失和超时显示可重试提示。不伪造百分比。重试卸载旧 iframe；返回菜单时卸载整个游戏浏览上下文，停止其循环、输入和音频。

## 结构与配置

- `src/MineWorld/GameConfig.ts`：客户端路径、用户名、超时和最低加载展示时间，以及状态消息校验。
- `ClassiCubeLoader.ts`：状态、计时器和来源校验。
- `GameContainer.tsx`：隔离游戏全局变量、提供画布页容器。
- `LoadingScreen.tsx`、`MineWorldPage.tsx`、`mineworld.css`：像素加载屏、工具栏、全屏请求和返回。
- `public/vendor/classicube/index.html`、`bootstrap.js`：外层初始化和消息桥接；不修改游戏核心。
- `public/vendor/classicube/ClassiCube.js`：官方自托管预编译产物，3,899,294 字节。
- `public/static/default.zip`：官方 Web 默认材质，84,264 字节，路径保持上游默认值。
- `LICENSE.txt`、`PROVENANCE.json`：许可证、下载来源、文件大小与 SHA-256。
- `scripts/verify-classicube.mjs`：构建前核验客户端和材质完整性，防止缺资源版本发布。
- `scripts/create-mineworld-entry.mjs`：构建后创建 `dist/mineworld/index.html`；纯静态托管直接访问 `/mineworld/` 不依赖后端路由。

只有进入 MineWorld 才创建 iframe、加载游戏脚本与材质；首页不下载这约 4 MB 游戏资源。进入游戏后暂停主站全景渲染。画布像素尺寸随容器变化，不用 CSS 将 300×150 默认画布拉大。

## 操作和范围

WASD 移动、空格跳跃、鼠标观察、左键删除、右键放置、Esc 原生菜单。生成新世界、加载/保存地图与换材质使用 ClassiCube 自带菜单。顶部保留全屏和返回；浏览器可以拒绝全屏请求，此时显示说明。

这是 Minecraft Classic 兼容客户端，不是现代 Java Edition，也不需要 Minecraft 账号或单机服务器。主站不新增数据库、后端、地图、建筑、NPC 或模块联动。单机基础资源本地自托管；上游可按需请求皮肤/音效等可选外部资源。

## 资源来源与升级

官方接入说明：https://github.com/ClassiCube/ClassiCube/blob/master/doc/hosting-webclient.md

客户端 HTTPS 地址：https://cdn.classicube.net/client/latest/ClassiCube.js

材质地址：https://www.classicube.net/static/default.zip

按官方接入说明自托管这套 Web 材质；不是从用户 Mojang 客户端提取的贴图。核心脚本字节未更改，完整许可随发行文件保留。Git 包含这套独立游戏产物，云端构建不用安装编译器或每次下载 latest。

升级时显式下载官方产物、更新哈希记录、独立运行和集成复测，再提交。不要绕过完整性检查。未来自定义地图、皮肤、材质、多人参数通过外层配置和上游接口接入，不重写核心系统。

## 已执行验证与限制

2026-10-13 / 14，本地浏览器实际运行独立页面和主站页面：世界显示、WASD 坐标变化、视角变化、放置石块、删除石块、空格产生视点高度变化、Esc 原生菜单、主站返回、材质缺失提示及恢复后重试、刷新 `/mineworld`。1366×768、1920×1080、2560×1440 下画布分别随容器调整，截图位于 `.local-reference/classicube-*.jpg`。

内置浏览器拒绝原生 Pointer Lock，日志为 Chromium `UnknownError`；不能报告鼠标锁定验证通过。未写自制鼠标控制替代上游。外部桌面浏览器的鼠标锁定仍需实际复测；全屏请求也以浏览器实际许可为准。

`npm run test:world` 覆盖状态协议、启动阶段顺序、用户名参数、缺失材质、错误 MIME、脚本失败和二进制 MIME；`npm run build` 包含 TypeScript、Vite、资源哈希与静态入口生成。不要把单元测试当成游戏操作测试。

发布沿用已获授权的 GitHub main → CloudBase 自动发布配置。线上结果以 Actions 和 `/deployment.json` 为准，不能用本地截图代替线上验证。
