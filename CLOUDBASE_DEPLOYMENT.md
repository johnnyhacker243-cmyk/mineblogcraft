# CloudBase 测试托管

2026-10-12，经用户授权将 Mineblogcraft 上传到已有免费体验环境。

- 环境：`jonhyblog-d2ggh3rc306480701`，上海。
- 应用：`jonhyblog`，部署路径 `/`。
- 地址：https://jonhyblog-jonhyblog-d2ggh3rc306480701.webapps.tcloudbase.com/
- 更新前版本：`jonhyblog-001`。
- 本次版本：`jonhyblog-002`，构建记录 `2608551249`。
- 通过官方 CloudBase CLI 3.8.6 的 `app deploy` 上传本地预构建文件，使用应用版本管理；没有删除旧应用，也没有新增服务器、数据库或付费套餐。

## 后续手动发布

先本地构建，再部署 `dist`，不能直接上传 `public` 或整个源代码目录。

PowerShell：

```powershell
$env:BLOG_BASE_URL='https://jonhyblog-jonhyblog-d2ggh3rc306480701.webapps.tcloudbase.com/'
npm run build
Remove-Item Env:BLOG_BASE_URL

# 凭据过期时，用户本人通过官方设备授权页面确认。
npm exec --yes --package=@cloudbase/cli@3.8.6 -- tcb login --flow device

# 在项目根目录执行；指定配置文件绝对路径，上传目录只能是 dist。
$releaseConfig=(Resolve-Path 'cloudbase.release.json').Path
$releaseDirectory=(Resolve-Path 'dist').Path
npm exec --yes --package=@cloudbase/cli@3.8.6 -- tcb app deploy jonhyblog -e jonhyblog-d2ggh3rc306480701 --config-file $releaseConfig --cwd $releaseDirectory --framework static --output-dir ./ --deploy-path / --force --json
```

`--force` 跳过同名应用更新提示，用于已授权的版本更新，不是 Git 强制推送。安装/云端构建命令为空，因为上传的是已经构建的静态文件。

原版贴图、字体、音效等本地资源由 Vite 从 public 复制进 dist；GitHub 不包含这些被忽略的文件。授权凭据由官方工具保存在本机，不写入本项目、Git 或文档。

## GitHub 持续发布配置

用户已授权 CloudBase 访问 GitHub。现有应用 `jonhyblog` 已使用手动填写的仓库地址 `https://github.com/johnnyhacker243-cmyk/mineblogcraft.git`、`main` 分支完成云端克隆、构建和部署，版本 `jonhyblog-003`，构建记录 `2608549856`。云端日志确认恢复 131 个素材，Node.js 22.21.1、Vite 构建及上传成功。

GitHub 的 CloudBase OAuth 授权详情已确认包含私有仓库及仓库 Hook 权限。CloudBase 个人仓库下拉列表仍为空；手动地址入口实际可以克隆该私有仓库。保留私有仓库，不为部署改成公开仓库。

仓库 Webhook 列表为空，控制台未显示自动触发开关，因此使用 `.github/workflows/cloudbase-deploy.yml` 在推送 `main` 时触发 GitHub Actions。专用编程访问子账号 `mineblogcraft-deploy` 已关联 `MineblogcraftStaticDeploy` 策略，仓库加密 Actions Secrets `TCB_SECRET_ID`、`TCB_SECRET_KEY` 已配置。失效旧密钥已禁用；被撤销的临时密钥已按用户授权删除。密钥值不写入本地文件、源码或文档。

首次运行 `38234706696` 已通过构建、素材验证并上传完整网站，线上 `/deployment.json` 确认提交为 `60a6f282e09f824d5645ca1d6359bd27c615b61c`，浏览器主菜单正常。官方 `app deploy` 的附加 CloudApp 归档/版本记录步骤长时间未返回，因此停止该运行，持续发布改用同一官方工具的 `hosting deploy`，直接上传预构建文件。自动发布不产生新的 CloudApp 版本记录，版本来源以 Git 提交和 Actions 日志为准；再次推送的全流程验证待完成。

工作流使用只读 GitHub 权限、固定版本的官方 Actions、Node.js 22、CloudBase CLI 3.8.6。检查密钥后再构建；只有发布阶段读取腾讯云凭据。排队发布时跳过过时提交，上传的是完整 `dist`，入口和版本标识最后上传，不清除远端历史素材，也不会强推 Git。部署后读取 `/deployment.json` 校验 commit 与本次推送相同。该文件仅含公开版本标识，不含凭据。

发布权限记录在 `cloudbase-deploy-policy.json`：服务状态与环境套餐枚举为只读查询，环境操作限制到现有环境，COS 读写限制到该环境静态托管桶；不授予管理员、删除资源或购买权限。持续发布凭据的配置已经获得用户明确授权。未来轮换密钥时只更新上述两个加密 Secrets。

构建设置：Node.js 22，项目目录 `./`，安装命令 `npm ci`，构建命令 `npm run build:cloud`，构建产物 `dist`。环境变量 `BLOG_BASE_URL` 为上面的线上地址。

`cloud-assets.json` 只记录 131 个展示素材的路径、字节大小和 SHA-256，不包含素材文件。`scripts/cloud-assets.mjs` 从现有网站恢复缺失素材并核验完整性，然后才运行原有构建。构建产物会携带同一套素材，因此后续代码更新继续保留这些文件。缺失、损坏或下载失败会阻止部署，不能以缺图版本覆盖网站。该机制依赖现有托管中的素材仍可访问；若整个托管被清空，先从本地完整资源进行一次手动发布。

这条流水线自动更新 GitHub 中的代码和内容；被忽略的本地新素材不会凭空同步。替换或新增素材时，先运行 `node scripts/cloud-assets.mjs --manifest` 更新清单，使用本地完整 `dist` 手动发布素材，再推送清单与引用代码。不要把原版素材加入 Git。

验证：`node --test tests/cloud-assets.test.mjs` 覆盖正常、缺失、损坏和路径越界；独立无素材目录已实际恢复并校验全部 131 个文件；`npm run build:cloud` 已构建成功。

## 验证与限制

本次重新构建成功，427 个发布文件上传成功。线上浏览器实际打开了加载动画、主菜单、Blog 世界列表/正文、MineRSS、MineWiki 的 Nmap 搜索、MineResearch 真实论文及翻页、MineStatus、作者介绍（玩家模型和贴图可见）。

打开 MineWorld 时，自动审批服务返回 429 限流，操作未执行，因此本次没有完成 MineWorld 的线上复测。上一阶段已有本地浏览器验证记录，不能替代本次线上验证。

腾讯云测试域名首次访问可能显示“确定访问”提醒。该地址用于开发测试，不等同于已绑定独立域名的正式站点；没有修改此提示或关闭平台安全控制。当前没有接入真实运行监控，MineStatus 仍为明确标注的静态示例。

恢复旧版本应在现有应用的部署版本记录中选择对应版本；本次未执行回滚。用户已有旧站本地代码。

截图保存在本地 `.local-reference/cloudbase-live-home.jpg`，不提交游戏截图。
