# Mineblogcraft：极狐 GitLab 提交与腾讯云部署完整指南

编写日期：2026-10-17。适用环境：Windows、PowerShell、极狐 GitLab（中国）。

这份指南供项目所有者和协助操作的 ChatGPT 使用。当前任务只编写指导文件，没有创建极狐仓库、上传代码、配置云端密钥或重新部署网站。后续执行者应先核对实际状态，不能把本文的操作步骤当成已完成的结果。

## 1. 先确定要完成哪一种交付

**推荐方案 A：源码提交极狐，网站继续使用现有腾讯云 CloudBase，保留 GitHub 自动发布。**

如果老师要求“GitLab 仓库链接 + 可访问的网站”，通常完成方案 A 即可；最终仍需对照老师的原始要求确认。代码可以同时保存在 GitHub 和极狐，网站继续使用现在的网址。无需为提交仓库而迁移网站或重建项目。

**可选方案 B：源码提交极狐，并让极狐流水线接管腾讯云发布。**

只有明确需要“由极狐触发部署”时才执行。先完成方案 A，再按第 9 节迁移。现有 `.gitlab-ci.yml` 只校验源码，**不会部署网站**；不能把“GitLab 流水线通过”说成“GitLab 已部署腾讯云”。

## 2. 项目实际信息

| 项目 | 当前记录 |
| --- | --- |
| 项目名称 | Mineblogcraft |
| 原始工作目录 | `D:\我的世界网页博客开发测试` |
| 技术栈 | Vite、React、TypeScript、Three.js；前端静态网站 |
| GitHub 仓库 | https://github.com/johnnyhacker243-cmyk/mineblogcraft |
| 本地分支 | `main`，执行前重新核对 |
| 本指南依据的源码提交 | `1e010c4c774b588fc66736690f31a0726ac4766e` |
| 此前已核验的线上提交 | `96a5759568c11ec987a82e3dd2bf7aea3cebd834`；执行时重新查询 |
| 网站 | https://jonhyblog-jonhyblog-d2ggh3rc306480701.webapps.tcloudbase.com/ |
| 腾讯云环境 ID | `jonhyblog-d2ggh3rc306480701` |
| 地域 | `ap-shanghai` |
| 现有发布配置 | `.github/workflows/cloudbase-deploy.yml` |
| 极狐校验配置 | `.gitlab-ci.yml`，仅构建与测试 |
| 极狐仓库地址 | 尚未提供，必须从用户实际创建的项目页面复制 |
| 构建命令 | 首次 `npm ci`，然后 `npm run build:cloud` |
| 部署产物目录 | `dist/` |
| Node.js | 建议 22.12+；现有流水线使用 Node 22 系列 |

在编写本指南前，源码交付提交 `1e010c4` 比 GitHub 的 `origin/main` 多 1 个本地提交；它涉及源码交付与构建适配，尚未推送。本文随后如单独提交，本地提交数还会变化。因此，请以现场的 `git status` 和提交记录为准，不要假定本地、GitHub、极狐、线上四处版本天然一致。

主要功能包括个人介绍、MineBlog、RSS 阅读与本站订阅、论文阅读、Wiki 知识图谱、MineWorld、背景音乐。既有 Minecraft 风格必须保留，不重新搭建网站，不添加后端或数据库，不编造用户专业、邮箱、个人经历或文章。

## 3. 上传前准备与边界

需要用户自己的极狐账号、Git、Node.js/npm、可用网络。新建项目时确认老师能访问：公开仓库需先确认内容适合公开；私有仓库需按课程方式授予老师访问权限。

阅读这些项目文件：

- `AGENTS.md`：项目约定。
- `README.md`：运行说明。
- `docs/GITLAB_SOURCE_DELIVERY.md`：源码交付边界及既有验证记录。
- `docs/FINAL_ACCEPTANCE.md`：课程验收记录及限制。
- `ASSET_LICENSES.md`：第三方素材许可。
- `.gitignore`：禁止进入源码仓库的目录与资源。

上传源码不需要腾讯云密钥。不要把令牌、密码、`.env`、私钥、`node_modules/`、`dist/`、个人截图、研究缓存或未获授权的原版 Minecraft 图像/音频原文件加入 Git。不要为了让仓库“看起来完整”而删除 `.gitignore`。

项目通过 `cloud-assets.json` 记录 223 项运行素材的大小和 SHA-256，`build:cloud` 从现有站点恢复并校验。**源码完整不代表第三方运行媒体全部内嵌在仓库。** 保留现有云端资源；原站无法访问时，应恢复已授权资源或修复下载，不能绕过校验、伪造构建成功。资源许可边界见 `ASSET_LICENSES.md`。

## 4. 在极狐创建空项目

1. 登录自己的极狐 GitLab 实例。中国极狐 SaaS 的实际登录入口、学校专属实例地址，以用户实际账号为准，不要把宣传站网址误当 Git 仓库地址。
2. 选择“新建项目 / 创建空白项目”（界面名称可能因实例版本不同而变化）。
3. 项目名称可用 `Mineblogcraft`，路径可用 `mineblogcraft`；命名空间使用自己的账号或课程指定群组。
4. 设置合适的可见性。
5. **取消用 README 初始化仓库**，不要额外自动添加许可证或 `.gitignore`。本地已经有这些项目文件；不要随意给第三方资源套用新的开源许可证。
6. 创建后，复制页面“克隆”区域提供的 **HTTPS 仓库 URL**，通常以 `.git` 结尾。

后续每次出现 `$GitLabRepoUrl`，都必须先设置成这个真实 URL。本文不虚构你的极狐账号和仓库路径。

如果极狐项目已经有提交，先查看内容与历史，**不要继续按空仓库步骤直接覆盖**。把不含凭据的状态和错误交给 ChatGPT，先制定保留两边内容的方案。

## 5. 推荐：从现有本地仓库提交，保留历史

### 5.1 只读核对

打开 PowerShell，逐条执行；任何一步报错先处理，不要把整章命令一次性盲目粘贴。

```powershell
Set-Location -LiteralPath 'D:\我的世界网页博客开发测试'
git status --short --branch
git branch --show-current
git log -5 --oneline
git remote -v
git diff --stat
git diff --cached --stat
node --version
npm --version
git --version
```

预期当前分支为 `main`，原来的 `origin` 仍指向 GitHub。发现未提交改动时先查明来源；不要删除、覆盖或混入用户正在进行的工作。不要修改全局 Git 身份。

### 5.2 本地构建和检查

```powershell
npm ci
npm run build:cloud
npm run test:content
npm run test:world
node --test tests/cloud-assets.test.mjs tests/cloudbase-publish.test.mjs
node scripts/release-audit.mjs
git diff --check
git status --short
```

每项都应成功后再进入上传步骤。首次干净目录必须先恢复资源，不能只运行普通 `npm run build` 就断言项目无法运行。依赖锁定以 `package-lock.json` 为准，不要为消除安装提示而随意升级整套依赖。

需要重新做浏览器验收时：

```powershell
npx playwright install chromium
npm run dev
```

保持这个窗口运行，在浏览器打开终端实际显示的本地地址。在第二个 PowerShell 窗口进入同一项目目录，再运行：

```powershell
npm run test:wiki-stability
```

测试默认连接 `http://127.0.0.1:5173`。若开发服务器用了其他端口，先在第二个窗口设置实际地址，例如 `$env:TEST_BASE_URL = 'http://127.0.0.1:5174'`。结束后可 `Remove-Item Env:TEST_BASE_URL -ErrorAction SilentlyContinue`。

Wiki 稳定性测试默认包含竞争用例和持续测试，可能需要数分钟；Linux 软件渲染还可能更慢。不要因为暂时没有新输出就把测试删掉。手动检查主菜单、各栏目、论文原文、RSS 弹窗和 feed.xml、音乐开关及移动端导航。测试结果只代表实际覆盖范围，不承诺“绝对没有任何 bug”。

如需依赖漏洞查询，可单次指定 npm 官方源，避免本机镜像不支持审计接口；无需修改全局源配置：

```powershell
npm audit --registry=https://registry.npmjs.org
```

### 5.3 添加极狐远端，保留 GitHub origin

首先设置真实地址（执行时会提示输入，不含密码或令牌）：

```powershell
$GitLabRepoUrl = Read-Host '粘贴极狐项目的 HTTPS 克隆地址，不含令牌'
git ls-remote --heads "$GitLabRepoUrl"
```

空仓库可以没有分支输出，但命令本身必须成功。认证失败、网络失败和空仓库不同；不要忽略错误。

再次检查 `git remote -v`。如果不存在名为 `gitlab` 的远端，执行：

```powershell
git remote add gitlab "$GitLabRepoUrl"
git remote -v
```

如果已经有 `gitlab`，先核对其 URL。地址相同则复用；地址不同先查明原因，不要直接替换。**保留现有 GitHub origin，不使用 `git remote set-url origin` 把它改成极狐。**

完成前面的核对后，用户自行推送：

```powershell
git push gitlab main
```

这里不加 `-u`，让现有 `main` 的 GitHub 跟踪关系保持原样。之后向极狐同步继续明确使用 `git push gitlab main`。本步骤不会推送 GitHub，也不会触发现有 GitHub 自动部署。

### 5.4 HTTPS 身份认证

使用系统弹出的 Git 凭据管理器或极狐支持的认证流程。需要个人访问令牌时，由用户在自己的账号中创建、限定有效期；单纯 Git HTTPS 读写通常选择 `write_repository` 即可，具体遵循该实例策略。令牌由用户在凭据提示框中输入，不发给 ChatGPT，不写进远端 URL、脚本或截图。[极狐个人访问令牌说明](https://gitlab.cn/docs/jh/user/profile/personal_access_tokens/)

若账户已配置 SSH，也可使用项目页面提供的 SSH 克隆 URL；先验证该实例 SSH 身份，私钥始终留在用户设备。不要把生成新密钥、覆盖旧密钥当作默认修复动作。

### 5.5 核对上传是否真实成功

```powershell
git rev-parse HEAD
git ls-remote gitlab refs/heads/main
```

两处显示的完整提交号应一致。在极狐网页刷新，核对分支、最新提交、README、`src/`、`scripts/`、`tests/`、`package.json`、`package-lock.json`、`.gitlab-ci.yml` 都存在。仓库不能只有一个源码 ZIP。

如果上传后又新增本地提交，需要再次推送并重新核对，不能沿用上一次成功的截图。

## 6. 备选：从源码 ZIP 新建仓库

仅在不能使用原始本地仓库时选择。此方式保留代码快照，**不保留原 Git 历史**，新建提交号会与 GitHub 和原 ZIP 来源提交不同。

已有源码包：

```text
D:\我的世界网页博客开发测试\deliverables\Mineblogcraft-source-1e010c4.zip
```

对应 SHA-256：

```text
31a81db67ea395fa3a696983bc8fd5411a256c16040e001abe7e85da0cd24d73
```

核验：

```powershell
Get-FileHash -Algorithm SHA256 -LiteralPath 'D:\我的世界网页博客开发测试\deliverables\Mineblogcraft-source-1e010c4.zip'
```

将 ZIP 解压到**原项目目录之外的新文件夹**，进入包含 `package.json` 的 `mineblogcraft` 子目录；资源管理器启用显示隐藏项目，确认点号开头配置文件保留。不要在原仓库内部另建嵌套仓库。

先运行第 5.2 节检查，再初始化。以下命令只用于已确认没有 `.git`、不在其他仓库内部的独立目录：

```powershell
git init -b main
git status --short
```

若缺少提交身份，只设置当前仓库，由用户提供自己的名称和邮箱：

```powershell
$AuthorName = Read-Host '输入你自己的 Git 提交者名称'
$AuthorEmail = Read-Host '输入你自己的 Git 提交邮箱或平台提供的隐私邮箱'
git config --local user.name "$AuthorName"
git config --local user.email "$AuthorEmail"
```

已有正确身份则跳过。之后检查待提交内容，不允许私钥、令牌和被忽略的媒体混入：

```powershell
git add .
git diff --cached --stat
git diff --cached --check
git status --short
```

确认后提交并连接**空的**极狐仓库：

```powershell
git commit -m "Import Mineblogcraft source delivery"
$GitLabRepoUrl = Read-Host '粘贴极狐项目的 HTTPS 克隆地址，不含令牌'
git remote add origin "$GitLabRepoUrl"
git push -u origin main
```

这条路径的新仓库 `origin` 指向极狐，与第 5 节原仓库的 `origin` 含义不同。不要混用两套命令。在极狐核对代码文件和完整提交号。旧 ZIP 不包含本指南后来产生的文档提交；其代码版本就是文件名标注的 `1e010c4`。

## 7. 极狐流水线验收

项目根目录已有 `.gitlab-ci.yml`，使用 `node:22-bookworm`，依次执行依赖安装、资源恢复与构建、内容测试、游戏集成检查、资源/发布边界测试及发布审查。

推送后查看项目“构建 / CI/CD / 流水线”页面，核对本次提交对应的流水线和 `verify-source` 作业。需要可用的、兼容 Linux 容器的 Runner；实际启用方式、额度和费用以学校或极狐实例为准。

- `passed`：本次作业执行的检查通过；不等于已部署腾讯云。
- `pending`：检查是否有 Runner 在线、标签匹配、允许运行未标记作业、账户权限或额度；不等于代码出错。
- `failed`：先看首个失败步骤；下载超时、资源校验失败、测试失败应分别处理。
- 根本没有流水线：检查 `.gitlab-ci.yml` 是否在分支根目录、CI/CD 是否启用，并使用实例提供的 CI 配置校验功能。

当前配置不需要腾讯云密钥。不要为了“让流水线通过”添加无关密钥、注释测试、删除日期检查或伪造状态文件。

## 8. 方案 A：保留现有腾讯云网站

极狐源码核对完成后，即可把极狐仓库项目页地址和现有网站地址交给老师。GitHub 仍负责发布，极狐负责保存源码与运行校验；这是清楚且可验证的交付方式。

网站地址：

https://jonhyblog-jonhyblog-d2ggh3rc306480701.webapps.tcloudbase.com/

可在浏览器查看 `deployment.json` 的 `commit`，或只读查询：

```powershell
$SiteBase = 'https://jonhyblog-jonhyblog-d2ggh3rc306480701.webapps.tcloudbase.com/'
$VerifyUrl = $SiteBase + 'deployment.json?verify=' + [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()
Invoke-RestMethod -Uri $VerifyUrl
```

现场查询结果才是当前线上记录；不要把本文记载的旧提交号永远当成最新版本。如果从 ZIP 导入极狐，新提交号不同属正常现象，应记录它对应的来源版本。

若还需要把当前本地提交发布到网站，先明确本次确实要发布，再检查原始仓库的 GitHub 远端与差异，用户执行 `git push origin main`，等待 GitHub Actions 的 CloudBase 发布流程成功，并核对网站 `deployment.json`。**这一步会更新线上网站，不是上传极狐所必需的步骤。** 不要在 ZIP 新仓库中照抄这条命令期待触发 GitHub，因为那里 `origin` 指向极狐。

## 9. 方案 B：确需改为极狐负责部署时

本节是后续实施说明，当前项目尚未配置或验证极狐云端部署。建议让 ChatGPT 阅读现有 GitHub 工作流后生成可审阅的极狐配置，再由用户确认执行。不要直接把 GitHub YAML 改个文件名当成极狐流水线。

### 9.1 切换顺序

1. 确认极狐源码、构建与测试通过，用户有腾讯云现有环境权限，记录当前线上提交和回退基线。
2. 准备极狐发布配置，先设置为 `main` 分支手动触发，暂不发布；使用实例 CI 配置校验器校验。
3. 腾讯云密钥由用户在极狐项目“设置 → CI/CD → 变量”中添加 `TCB_SECRET_ID` 和 `TCB_SECRET_KEY`。使用能满足现有静态托管发布的最小权限，启用掩码及受保护变量，关闭不必要的变量展开；如实例支持隐藏变量也可启用。`main` 必须受保护，变量作用域与发布作业匹配。不要把值放入 YAML 或聊天。[GitLab CI/CD 变量说明](https://docs.gitlab.com/ci/variables/)
4. 到**原 GitHub 仓库**的 Actions 页面停用 `Deploy Mineblogcraft to CloudBase` 工作流，并确认此前运行已结束。在极狐里修改 `.github/` 文件不会停用 GitHub 上的旧工作流。
5. 确认只有一个发布方后，用户手动启动极狐发布作业。
6. 等待上传和 CDN 生效，核对线上 `deployment.json` 为该极狐提交，完成网页验收。
7. 首次稳定通过后，再决定是否把极狐改为 `main` 推送自动部署。需要恢复 GitHub 时，先停止极狐发布，核对 GitHub 源码版本，再重新启用原流程。

### 9.2 极狐发布作业必须保留的行为

让协助者以 `.github/workflows/cloudbase-deploy.yml` 为项目依据，迁移这些实际行为：

| 项目 | 迁移要求 |
| --- | --- |
| 构建环境 | Linux Runner，Node 22 系列；浏览器依赖可安装 |
| 安装与构建 | `npm ci`、`npm run build:cloud`；输出 `dist/` |
| 测试 | 保留内容、游戏、资源/发布边界检查和 `release-audit.mjs` |
| Wiki 回归 | 安装 Chromium 及 Linux 依赖；启动 Vite 生产预览，等待就绪，再运行 `tests/interactions/wiki-stability.mjs`；结束时关闭预览 |
| 网站基址 | `BLOG_BASE_URL` 使用实际公网网址，不能使用回环地址 |
| 版本变量 | `CI_COMMIT_SHA`、`CI_PROJECT_PATH`、`CI_PIPELINE_ID`，不能沿用 GitHub 专属变量 |
| 发布标记 | 在构建后生成 `dist/deployment.json`，记录真实极狐提交、项目路径、流水线号 |
| 串行发布 | 使用固定 `resource_group`，同一网站同时只允许一个发布作业 |
| 旧流水线保护 | 发布前查询极狐远端 `main`，必须等于 `CI_COMMIT_SHA`；发现已有新提交则阻止旧版本覆盖 |
| 凭据 | 只读受保护 CI 变量，禁止打印、禁止启用会泄露命令参数的调试追踪 |
| 产物衔接 | 若构建和部署分属不同作业，使用同一提交的构建产物；不能在部署时误用空目录或其他提交产物 |
| 发布验证 | 有限重试请求公网 `deployment.json`，直到提交号等于目标版本；失败必须报告未确认发布成功 |

当前 GitHub 已验证使用 CloudBase CLI `3.8.6`。迁移时可先沿用此版本，避免把 CI 迁移和 CLI 升级混成一次变更。以下是**Linux CI 中发布步骤的参考**，不是让用户直接在 PowerShell 中执行的完整流水线：

```bash
# 前提：已构建和测试；已生成 dist/deployment.json；已完成最新 main 检查。
# TCB_SECRET_ID / TCB_SECRET_KEY 必须来自受保护且掩码的 CI 变量。
npm install --global @cloudbase/cli@3.8.6
tcb login --apiKeyId "$TCB_SECRET_ID" --apiKey "$TCB_SECRET_KEY"
publish_root=$(mktemp -d)
node scripts/prepare-cloudbase-publish.mjs --source dist --output "$publish_root/site" --base "$BLOG_BASE_URL"
tcb hosting deploy "$publish_root/site" / -e jonhyblog-d2ggh3rc306480701 --entry index.html,mineworld/index.html,deployment.json,deployment-files.json --concurrency 10 --json
```

发布准备脚本的输出路径必须尚不存在；这里创建临时父目录，再使用未创建的 `site` 子目录。保留差异上传与入口文件最后上传逻辑，不删除远端旧资源。不要新增 `--prune` 或先清空托管目录。项目依赖现有托管素材，清空会影响恢复与线上旧版本。[CloudBase 静态托管 CLI 说明](https://docs.cloudbase.net/cli-v1/hosting)

不要照搬 GitHub 的 `gh api`、`GH_TOKEN`、`GITHUB_OUTPUT`、`RUNNER_TEMP`；极狐须使用自己的提交检查、临时路径和变量。不要把 `cloudbase.release.json` 或其他历史配置当成当前实际发布命令的替代品。

### 9.3 发布后的验收

1. 发布作业成功，且公网 `deployment.json` 的完整提交号与目标极狐提交一致。
2. 主菜单和个人介绍背景正常，音乐开关可操作；注意浏览器可能需要用户交互才允许有声播放。
3. 博客列表和正文、订阅弹窗、RSS 地址均使用正确公网域名。
4. `/feed.xml` 返回 RSS XML，文章链接是公网地址，浏览器展示与阅读器订阅均可检查。
5. MineRSS 数据和外链、论文列表与 PDF/原文、Wiki 搜索与节点详情正常。
6. Wiki 连续拖拽、切换节点、停留阅读后仍正常；保留已修复黑屏的回归覆盖。
7. MineWorld 和手机端导航正常；浏览器控制台无新出现的未处理错误，关键资源无新增失败请求。
8. 如果页面仍旧，先比较部署标记和缓存，再定位产物或发布目标；不要先删除全站文件。

## 10. 常见错误与处理

| 现象 | 处理 |
| --- | --- |
| 找不到 Git、Node 或 npm | 安装所需工具后重新打开终端，再核对版本；不要随意改系统策略 |
| PowerShell 禁止执行 npm.ps1 | 可用 `npm.cmd` / `npx.cmd` 执行对应命令，不必为此放宽全局执行策略 |
| 401 / Authentication failed | 检查账号、凭据管理器、令牌过期与权限；只在本机更新凭据 |
| 403 / protected branch | 核对本人项目角色、分支保护和令牌权限；不要直接取消所有保护 |
| non-fast-forward / rejected | 远端存在本地没有的提交；先抓取、查看差异并保留两边工作，禁止强制推送 |
| 上传后只有一个 ZIP | 解压后提交文件树；ZIP 本身不能替代可浏览、可构建的源码仓库 |
| 文件过大或包含隐私资料 | 检查待提交文件及历史；已跟踪的文件不会因新增 .gitignore 自动消失，先审查再处理 |
| 普通 build 报缺素材 | 在干净目录使用 `npm run build:cloud`；检查网络和原站素材，保留哈希核验 |
| 论文下载/字体下载失败 | 分清具体源、网络、HTTP 状态和重试结果；不能用空文件或首页 HTML 顶替 |
| npm audit 镜像接口 404 | 单次指定官方 registry；这与扫描发现漏洞是两件事 |
| CI 一直 pending | 检查 Runner、标签、分支限制、权限及额度 |
| CI 通过但网站没更新 | 当前极狐配置只验证；方案 A 由 GitHub 发布，方案 B 需独立发布作业 |
| 腾讯云登录或上传拒绝 | 检查对应环境、凭据权限、变量保护范围及现有服务状态，不公开密钥 |
| 网站主页面正常但 PDF/游戏损坏 | 检查是否发布了 dist、资源是否全部生成、子路径与真实响应类型是否正确 |

回退以保留历史为原则：先定位具体变更，使用针对该变更的 `git revert` 形成新提交，检查后推送唯一发布方。不要用 `reset --hard`、强制推送或删除云端文件作为默认修复。旧提交直接重新运行可能被“只发布最新 main”保护拦截；应按回退方案生成新的主分支提交。

## 11. 给老师的最终交付清单

- 极狐项目页面可以访问，源码文件树完整、最新提交正确；私有项目已授予老师必要权限。
- README 能指导全新目录安装依赖、恢复资源、构建和运行；锁文件、测试、许可证记录齐全。
- 按实际情况记录极狐流水线结果；没有 Runner 时如实说明已完成的本地核验，不伪称远端通过。
- 网站公网链接可访问，各主要功能经过验收；记录实际线上提交或其对应源码版本。
- 清楚说明当前由 GitHub 还是极狐负责发布，不能同时声称两套流程独立控制同一站点。
- 不提交任何账号密码或访问令牌；第三方素材提交范围与 `ASSET_LICENSES.md` 一致。
- 交付链接是“极狐项目页面 + 网站首页”，不要用本地路径、localhost 或 Git 克隆认证 URL 代替。

## 12. 可直接发给 ChatGPT 的接手提示词

复制下面整段，并附上本指南；能够访问本地文件的助手直接读取，普通 ChatGPT 则由用户提供它要求的非敏感文件和命令结果。

```text
请指导我把 Mineblogcraft 源码提交到中国极狐 GitLab，并核验现有腾讯云网站；按阶段指导，每次给出少量明确步骤、预期结果和下一步判断，等我反馈实际结果后再推进。

工作目录：D:\我的世界网页博客开发测试。
请先阅读我附上的《极狐GitLab提交与腾讯云部署完整指南》，以及项目 AGENTS.md、README.md、docs/GITLAB_SOURCE_DELIVERY.md、.gitlab-ci.yml、.github/workflows/cloudbase-deploy.yml 和 ASSET_LICENSES.md。无法访问本地文件时，请明确告诉我需要提供哪些非敏感文件或命令输出，不要假称已读取。

这是现有的 Vite/React/TypeScript/Three.js Minecraft 风格前端项目，不重建网站，不修改用户品牌、文章、个人信息，不添加后端和数据库。
GitHub：https://github.com/johnnyhacker243-cmyk/mineblogcraft
网站：https://jonhyblog-jonhyblog-d2ggh3rc306480701.webapps.tcloudbase.com/
腾讯云环境：jonhyblog-d2ggh3rc306480701，ap-shanghai。
源码交付基线：1e010c4；随后可能已有文档或其他提交，必须检查实际 Git 状态。
极狐地址尚未确定，请指导我创建空项目并从项目页面复制真实 URL，不要虚构账号或仓库。

默认方案是极狐保存源码和运行校验、GitHub 继续发布腾讯云。先说明这已能提供极狐仓库链接和现有网站链接；只有我明确选择切换部署时才让极狐接管腾讯云。当前 .gitlab-ci.yml 只校验，不部署。

优先使用原本地仓库，保留 GitHub origin，添加单独 gitlab 远端；不要覆盖原远端、强制推送、删除用户文件或修改全局 Git 身份。遇到远端已有历史或本地未提交改动，先检查再提出保留内容的处理方式。若从 ZIP 开始，要解释新仓库没有原 Git 历史以及提交号变化。

干净目录使用 npm ci 和 npm run build:cloud。源码不内嵌全部原版媒体，由清单恢复和校验 223 项资源；保留 .gitignore、许可说明和原云端资源。不要上传 node_modules、dist、密钥或未授权媒体原文件。

令牌、腾讯云密钥和密码由我在本机凭据窗口或平台变量设置中输入，不让我把值发到聊天，不写进代码或远端 URL。只指导必要权限与验证，不索要凭据截图。

提交后核对极狐 main 与本地完整提交号、网页文件树及真实流水线结果。部署如需切换，先准备配置、校验测试，再停用原 GitHub 发布并确认没有运行中的旧任务，最后手动启用极狐发布；保留串行与最新 main 检查、Wiki 黑屏回归和线上 deployment.json 校验。不要清空托管目录。

每个阶段都区分“尚未执行、已执行成功、执行失败、需要用户提供信息”。不能把流水线通过当成部署成功，也不能承诺源码绝对没有漏洞。最后提供我可以交给老师的真实极狐项目链接和网站链接。

现在请从只读核对本地状态，以及引导创建极狐空项目开始。
```

## 13. 本指南的验证范围

项目基线此前已完成干净源码构建、48 项测试及相关生产预览浏览器验收，详情见 `docs/GITLAB_SOURCE_DELIVERY.md`。这些是既有记录，不是本指南编写时重新运行全部测试的声明。极狐上传、远端 Runner 和极狐部署需要在用户自己的账号环境实际执行后才能确认。

本文提供的 CI 发布片段依据现有项目已使用的 GitHub 发布步骤；没有声称它已作为完整极狐流水线运行。后续迁移者必须生成完整 YAML、通过实例配置校验并进行一次实际手动发布和网页验收。
