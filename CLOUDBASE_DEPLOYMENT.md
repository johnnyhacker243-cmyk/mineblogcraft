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

原版贴图、字体、音效等本地资源由 Vite 从 public 复制进 dist；GitHub 不包含这些被忽略的文件。目前没有配置 GitHub 自动部署，不能仅从远程仓库构建获得完整素材。授权凭据由官方工具保存在本机，不写入本项目、Git 或文档。

## 验证与限制

本次重新构建成功，427 个发布文件上传成功。线上浏览器实际打开了加载动画、主菜单、Blog 世界列表/正文、MineRSS、MineWiki 的 Nmap 搜索、MineResearch 真实论文及翻页、MineStatus、作者介绍（玩家模型和贴图可见）。

打开 MineWorld 时，自动审批服务返回 429 限流，操作未执行，因此本次没有完成 MineWorld 的线上复测。上一阶段已有本地浏览器验证记录，不能替代本次线上验证。

腾讯云测试域名首次访问可能显示“确定访问”提醒。该地址用于开发测试，不等同于已绑定独立域名的正式站点；没有修改此提示或关闭平台安全控制。当前没有接入真实运行监控，MineStatus 仍为明确标注的静态示例。

恢复旧版本应在现有应用的部署版本记录中选择对应版本；本次未执行回滚。用户已有旧站本地代码。

截图保存在本地 `.local-reference/cloudbase-live-home.jpg`，不提交游戏截图。
