# MineRSS 来源与原版物品整理（2026-10-16）

保留多人游戏服务器列表、搜索、分类、文章列表、OPML 导入导出及订阅本站入口。21 个信息源按 AI、安全、软件工程各 7 个组织，侧重发布方直接提供的技术资料和中文可读资源，不将网站首页冒充 Feed。外部数据仅作文本显示。

## 本次验证

21/21 Feed 成功解析，得到 314 条摘要；每源最新两篇原文抽查，42/42 成功。此为当前执行网络的采样，不是中国大陆各运营商实测；地域、时段和网站策略可能影响访问。Meituan Feed 没有逐篇发布日期且原文元数据也没有提供，不以抓取日期或 URL 日期伪造文章时间。arXiv 明确标为预印本。

Spaces、Seebug、先知的原文抽查出现 403；Sophos Feed 返回 404；JetBrains 连续返回非 XML 内容。这些仅为本次网络证据，不据此断言被大陆屏蔽。已换成可成功读取的发布方。

## 来源与图标

| 来源 | 方向 | 原版物品 | Feed |
|---|---|---|---|
| 量子位 | ai | 指南针 | https://www.qbitai.com/feed |
| arXiv · Artificial Intelligence | ai | 附魔书 | https://rss.arxiv.org/rss/cs.AI |
| NVIDIA 技术博客 · 中文 | ai | 红石粉 | https://developer.nvidia.cn/blog/feed/ |
| Microsoft Research | ai | 末影之眼 | https://www.microsoft.com/en-us/research/feed/ |
| AWS Machine Learning | ai | 命令方块矿车 | https://aws.amazon.com/blogs/machine-learning/feed/ |
| Amazon Science | ai | 附魔之瓶 | https://www.amazon.science/index.rss |
| Microsoft Foundry Blog | ai | 红石中继器 | https://devblogs.microsoft.com/foundry/feed/ |
| Unit 42 · Palo Alto Networks | security | 望远镜 | https://unit42.paloaltonetworks.com/feed/ |
| PortSwigger Research | security | 铁剑 | https://portswigger.net/blog/rss |
| 绿盟科技技术博客 | security | 铁胸甲 | https://blog.nsfocus.net/feed/ |
| 安全客 | security | 追溯指针 | https://api.anquanke.com/data/v1/rss |
| Cisco Talos Intelligence | security | 光灵箭 | https://blog.talosintelligence.com/rss/ |
| Microsoft Security Blog | security | 不死图腾 | https://www.microsoft.com/en-us/security/blog/feed/ |
| Securelist · Kaspersky | security | 蜘蛛眼 | https://securelist.com/feed/ |
| 美团技术团队 | software | 铁镐 | https://tech.meituan.com/rss.xml |
| InfoQ 中文 | software | 书与笔 | https://www.infoq.cn/feed |
| PingCAP Engineering | software | 运输矿车 | https://www.pingcap.com/blog/feed/ |
| Cloudflare Engineering | software | 鞘翅 | https://blog.cloudflare.com/rss/ |
| Go 官方博客 | software | 钻石镐 | https://go.dev/blog/feed.atom |
| Spring Engineering | software | 酿造台 | https://spring.io/blog.atom |
| Rust Blog | software | 铁锭 | https://blog.rust-lang.org/feed.xml |

## 数据与运行

- config/rssSources.json 为唯一来源配置；rssIcons.json 为物品贴图、中文名称和选取理由。
- npm run rss:fetch：抓取 Feed → 严格解析 → 文本化摘要 → 逐源原文抽查 → 写入 public/data/rss。
- npm run rss:check-access：独立重新抽查；npm run rss:validate：校验及生成 VALIDATION_REPORT.md。
- 只允许清单内 HTTPS 公网地址，限制跳转、超时及大小，不执行脚本。失败保留同源旧快照并标记过期；不跨发布方继承缓存。
- RSS GUID 仅在明确作为合法绝对 URL 的 permalink 时用作缺失 link 的回退。发布日期与抓取日期分别保存；未来日期不参与最近更新。
- articleAccess/access-report.json 保存抽查证据；可替换成多地域探测结果，不能将本次网络检测命名为全国可用。
- RSSRepository 继续向 UI 提供统一模型；未来 API 只需遵循现有 sources/items 结构，无需改变 Minecraft 界面。

## 资源与部署

21 个图标来自本地获授权 Minecraft Java 1.21.1 客户端，验证客户端哈希，保留逐项来源及图像哈希。图标和字体仍被 Git 忽略；cloud-assets.json 仅记录部署所需资产哈希。字体 JSON 与图集使用相同版本查询参数，避免旧缓存造成缺字或错位。

发布先同步现有托管资源，再由 main 推送触发原有 GitHub Actions 完整部署；不新增后台或数据库。未更改 UI 布局、主题或 Minecraft 世界观。


## 自动发布的网络故障与修复

本次 GitHub Runner 上传 612 个文件时，最后一个文件报告 `User network is too slow` 并长时间串行重试。相同构建已从本机完整补齐到托管站点并核对提交号；新增 `prepare-cloudbase-publish.mjs` 根据线上 `deployment-files.json` 的 SHA-256 与大小清单，仅暂存变化文件。所有入口始终最后发布；不删远端文件。首次发布、无效清单或请求失败时回退为完整发布，不能将不完整清单视为成功。新清单随入口最后上传。工作流保留现有 main 版本检查和发布后 commit 校验，上传并发从默认 20 降为 10。

四项回归测试涵盖未变大文件跳过、变更/新增文件保留、入口强制发布、无效/越界/重复清单回退以及实际文件哈希。清单仅包含前端公开产物路径、大小和哈希，不含凭据。
