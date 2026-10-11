# 首次入场：Mojang 红色加载界面

每次打开/刷新网页，先显示红色背景、白色 Mojang Studios Logo 和进度条；首页资源准备后淡出。站内模块切换不会重复播放。未使用会话缓存来跳过加载。

## 原版素材与参考

使用已获授权的 Minecraft Java 1.21.1 客户端内 assets/minecraft/textures/gui/title/mojangstudios.png。512×512 图集的上半部和下半部是 Logo 左右两半；导入脚本仅拼接源像素为1024×256，不重绘 Logo。原始图集与拼接图保留在本地 public/assets/inventory，被 Git 忽略；Mojang Studios 标志及素材归其原权利人所有。

结构参考：[Minecraft 1.21.1 LoadingOverlay 映射](https://mappings.dev/1.21.1/net/minecraft/client/gui/screens/LoadingOverlay.html)。此实现是 Web 加载覆盖层，使用原版素材和相近布局；进度对应 Web 资源，不能复制游戏资源重载过程或宣称逐帧一致。

## 实现

- index.html 内包含首屏覆盖层及其关键样式，因此无需等待 React 启动就能显示红色背景。
- StartupApplication 连接全景准备信号；StartupLoader 管理进度和退出。
- StartupAssets 预加载 Logo、按钮、菜单图标、位图字体、六面全景与遮罩。进度表示已结束的资源任务（含失败任务），不是网络字节百分比。
- 全景通过 onSettled 报告就绪或回退；其已有 WebGL/资源失败回退逻辑继续有效。
- 加载期间 root 为 inert，防止鼠标或键盘误触菜单；完成后移除覆盖层并解除 inert。
- 默认最少显示900ms，完成进度条停留120ms，随后1000ms淡出。一般资源已缓存时整体约2秒；慢资源按实际完成时间退出。
- 系统减少动态效果时淡出缩短为150ms；单图片等待8秒，总等待上限12秒，避免资源异常持续卡住。
- Logo 宽度为 min(75vw,100vh)，4:1比例居中；进度条与其等宽，位于屏幕高度83.25%。
- 时间参数位于 src/config/startup-config.ts；关键首屏CSS位于 index.html，调整淡出时间需同步对应CSS transition。

## 实际验证

构建与主菜单回归检查通过。npm run test:startup 使用 Chromium 验证：故意延迟全景时覆盖层持续存在、菜单不可交互；资源就绪后退出；刷新重播；模块切换不重播；Logo 红底与比例；减少动态效果；全景加载失败仍可进入备用主菜单。

截图：tests/screenshots/startup-1366x768.png、startup-1920x1080.png、startup-2560x1440.png。
测试结果：tests/startup-results.json。
