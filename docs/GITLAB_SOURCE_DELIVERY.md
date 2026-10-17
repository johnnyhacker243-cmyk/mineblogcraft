# 极狐 GitLab 源码交付

## 包内与包外

源码包由 `git archive` 从一个明确提交导出，包含 React/TypeScript 代码、Markdown 内容、结构化数据、配置、锁定依赖清单、脚本、技能、测试、许可证记录及第三方开源客户端。没有将 `node_modules`、构建产物、日志、截图、个人研究缓存、密钥或原版 Minecraft 图像/音频原文件放入源码包。

“全部源码”不等于“包含所有第三方运行素材”。原版资源采用 `cloud-assets.json` 记录文件大小与 SHA-256。`npm run build:cloud` 从现有站点还原并校验这些资源，再生成站点。需要网络访问；原站不可用时必须从已授权的本地资源恢复，不能把资源缺失说成完整运行成功。许可边界见 ASSET_LICENSES.md。

## 从全新目录运行

使用 Node.js 22.12+、npm 及 Git。解压源码包后进入包含 package.json 的 mineblogcraft 目录：

```powershell
npm ci
npm run build:cloud
npm run test:content
npm run test:world
npm run dev
```

首次构建需要下载并核验运行素材及依法托管的论文原文；不要直接复制本机 node_modules。普通源码 ZIP 不包含 .git；构建工具在没有仓库元数据时允许生成本地报告，重新纳入 Git 后会记录真实提交号。论文 PDF 在生产和本地均有原文来源，本地缓存缺失不会清空论文库。

浏览器测试另需 `npx playwright install chromium`，并保持开发服务器运行。例如 `npm run test:wiki`、`npm run test:wiki-stability`；后者默认包含 60 轮竞争用例和三分钟持续测试。

## 自行上传极狐

用户负责创建极狐 GitLab 项目和上传。本轮不会替用户创建仓库、添加远端或推送。建议创建空项目，避免先初始化 README 与本地源码冲突。

若从 ZIP 开始，在解压目录运行 Git 初始化，使用自己已经配置的 Git 身份提交，再添加极狐项目页面提供的仓库地址并推送。不要使用其他人的账号、访问令牌或本机路径作为示例凭据。若远端已有提交，先拉取并核对内容，不要强制推送覆盖。

若希望保留既有历史，可直接在原 Git 仓库中添加单独的极狐 remote，自行推送 main；保留原 GitHub origin。请先检查仓库可见性和第三方资源许可。

项目带有 `.gitlab-ci.yml`，用于依赖安装、资源核验、构建和内容测试；不会向腾讯云重复部署。原 GitHub Actions 仍负责现有网站自动发布。GitLab 构建报告支持 CI_COMMIT_SHA / CI_PIPELINE_ID，不需要把腾讯云密钥上传到极狐验证流水线。

## 校验与导出

源码 ZIP 通过 `.source-commit` 保存导出时的提交号，构建报告在缺少 .git 时仍可使用该版本信息。先完成检查并保存本地提交，保持工作区干净，再运行：

```powershell
node scripts/package-source.mjs
```

交付文件位于忽略目录 deliverables/：源码 ZIP、对应 SHA-256 文件与 SOURCE_DELIVERY.json。可使用 `Get-FileHash -Algorithm SHA256 <源码ZIP路径>` 对照。不要将源码包或 node_modules 再提交进源码仓库。

若下载的是 GitHub 自动生成的 ZIP，也应先读本说明，按资源清单恢复运行素材。源码检查和已知漏洞查询不能保证所有环境永远没有缺陷；具体核验结果以交付时的实际记录为准。

## 本次交付核验（2026-10-17）

- 实际环境：Node.js 24.11.0、npm 11.6.1、Windows。
- npm 官方依赖审计：0 项已知漏洞；本地源码日期、链接与常见密钥模式检查通过。
- 工作目录与独立干净源码目录均完成构建；后者没有 .git、原有 node_modules 或清单中的 223 项素材，重新安装 152 个依赖包并还原校验 223 项资源后构建成功。
- 33 项内容测试、7 项游戏集成测试、8 项资源/发布边界测试通过。
- 从独立源码构建出的生产页面通过浏览器验收：标题、真实构建信息与数量、跨栏目导航、当前页面标记、移动端状态页及畸形博客链接恢复。
- 源码 ZIP 无 Git 元数据时的版本记录、极狐环境变量解析及 CI YAML 语法已在本地验证。没有实际运行极狐远端流水线，没有代用户上传仓库或重新部署网站。
- Vite 对可选 Wiki 分包有大小提示；它采用按需加载，该提示没有阻断构建。长期稳定性与黑屏修复记录见 WIKI_BLACKOUT_FIX.md。
