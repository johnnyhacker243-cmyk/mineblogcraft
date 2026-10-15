# 内容接入与 RSS 实施记录

## 实施计划与范围

保留 Vite / React / TypeScript 与所有 Minecraft 界面。Repository 是目录和正文的唯一读取边界；搜索服务处理匹配，页面不直接读内容文件。MineWorld、Status、全景与人物功能保留。

提供的 preview ZIP 实际只有两条博客草稿元数据、两条 Wiki 概念和一份格式示例，没有 21 篇正文、33 篇论文或 21 个 RSS。没有将空文件当作完整内容导入。本次按照用户后续授权补充有来源的技术编辑草稿和真实外部文献。来源证据与不确定性保留，不杜撰个人经历。

修改：现有目录 JSON、Blog/Paper/RSS Repository、阅读适配、Wiki 搜索与关联导航、RSS 页面、RSS 构建脚本与 package scripts。

新增：taxonomy、21 个 Blog Markdown、32 个研究阅读引导（另保留原 NIDS 授权全文）、RSS 配置与快照、解析/抓取/验证/OPML 脚本、回归测试、RAG 检索边界。

风险：外部 Feed 可迁移或暂时失败；文献原作者与版权不能改写；新博客未经作者审阅；静态快照不是实时服务监控；字形图集不能丢失新字符；Wiki 引用需可验证；不能触发自动部署。本次不改 CI、不 push、不部署。

## 内容数量与质量边界

| 模块 | 本次建设 | 保留内容 |
|---|---|---|
| Blog | 21 篇技术编辑草稿，AI / Security / Software 各 7 | 原有《Mineblogcraft 的诞生》1 篇 |
| Research | 33 篇外部文献，三方向各 11，保留真实作者 | 原有扩散方程示例 1 篇，标明非发表论文 |
| RSS | 21 个真实 Feed，三方向各 7 | 替换空地址、虚构在线状态的演示数据 |
| Wiki | 34 个知识概念，50 条 Blog 关联、66 条 Paper 关联 | Modeling 分支与已有关系保留 |

新博客 `status: draft`、`provenance: ai-assisted-editorial-draft`：可供本地审阅，不进入公开 feed.xml。日期为草稿创建日期，不冒充个人已发表日期。原博客仅更新已过时的模块实现状态。

Research 采用 `origin: external | example | original` 与 `readingMode: metadata | note | fulltext`。最初 32 篇新条目是书目、主题说明与阅读问题；2026-10-15 已补上完整原 PDF 书内阅读（见 PAPER_FULLTEXT.md），原阅读引导归档为 noteContent；年采用 arXiv 首次提交年或核实的出版年。原 NIDS-FGPA 保留 CC BY 4.0 授权全文与图表。没有把外部作者改成 YTC，没有伪造实验结果。

软件工程包括 Raft、MapReduce、逻辑时钟、日志结构文件系统，避免目录全部偏向 AI 代码模型。Security 兼顾网络检测、隐私、模型供应链与红队；仍建议以后由作者补充网络协议、Web 防御的真实实践与阅读记录。

## 数据流

```text
src/data/taxonomy.json
src/data/blogs.json → BlogRepository → 按需读取 public/content/blogs/*.md → 世界列表 / 阅读器
src/data/papers.json → PaperRepository → PDFRepository / document JSON → 原书籍阅读器
src/data/wiki.json → WikiRepository → WikiSearchService → 进度树 / 关联内容
config/rssSources.json + rssAllowlist.json
  → fetch-rss.mjs → rss-core.mjs → public/data/rss/{sources,items}.json
  → RSSRepository → 原服务器列表 / 同风格摘要阅读列表
已发布 Blog + Markdown 元数据 → generate-rss.mjs → public/feed.xml
公开订阅清单 → public/data/rss/subscriptions.opml
```

所有关联保持稳定 ID；显示标题来自目录。概念节点不会直接使用博客标题。别名参与搜索，命中后仍高亮、定位，不替换原进度树交互。

Wiki 的 34 个节点均已补充具体概念解释与三条学习要点，不再保留通用占位描述。关联 Blog、Paper、RSS 均可点击打开；切换时使用 hash 路由，并修复浏览器历史事件造成的主菜单闪回。

## RSS 课程要求对应

- 发布方：RSS 2.0，title/link/guid/pubDate/description，中文与特殊字符转义，倒序，XML 解析器验证。草稿排除，已发布 Markdown 与目录元数据一致才生成。
- 订阅方：构建阶段抓取 RSS 2.0 / Atom，浏览器只读取同域快照，按来源与时间查看摘要，点击打开原文。
- 配置区分 `feedUrl` / `siteUrl`；不把普通首页当 RSS；来源经过实际解析才标 verified。
- 安全：HTTPS、明确域名 allowlist、禁止私网地址与凭据 URL；重定向每步检查；4 并发、15 秒超时、8 MB 上限、100 个解析候选 / 30 个保存条目。拒绝实际 DTD/ENTITY；CDATA 的惰性文本不执行。
- 外部正文只转为文本；不执行 HTML/script、不运行链接、不作为 Agent 指令或 Prompt。保留最多 600 字符摘要，不转载全文。
- 来源条目 ID 使用来源 ID + guid / Atom id / link 的 SHA-256；同源 ID 与链接去重；缺失发布日期为 null，不伪造当前时间。
- 超时、HTTP、解析、体积等错误分别记录；失败或空 Feed 保留该源上次成功条目，标 stale / unverified。ONLINE 是上次成功抓取，不是实时在线。
- OPML 可下载导出。导入脚本生成去重后的待审配置，不静默扩大网络 allowlist。
- `fetch-report.json` 记录运行 ID、耗时、来源、结果与错误，不记录凭据。`VALIDATION_REPORT.md` 提供校验结果。
- 本地已读状态不上传；隐私模式存储不可用时仍可阅读；40 条逐批加载，避免一次渲染全部长摘要。

## 操作方法

```sh
npm run dev
npm run test:content
npm run content:validate
npm run rss:validate
npm run build                  # 使用已经验证的快照，断网也可构建
npm run build:with-feeds       # 构建前刷新外部订阅，再验证与构建；不会部署
npm run rss:fetch              # 手动刷新
npm run rss:fetch -- --offline # 保留缓存、离线生成清单
npm run rss:import -- path/to/subscriptions.opml
```

发布新博客：作者审阅正文与来源，将 JSON 和 Markdown 的 status 同步改为 published，填写真实发布日期，再验证。`BLOG_BASE_URL` 可覆盖本站 Feed 的绝对地址；默认沿用已配置网站域名，仅生成本地文件。

新增论文：填入真实作者、来源、类型与阅读模式；全文需确认授权并提供完整文件，不能仅把阅读模式改为 fulltext。新增 Wiki 关系后运行内容验证，检查前置关系无环与引用存在。

原版物品图标按语义选择：指南针用于资产发现与验证，盾牌用于防御，红石中继器用于工具调用和接口编排，工作台用于架构与工程，书/附魔书用于知识与研究，钟用于时间方法，纸用于协议与数学内容。所有图标复用项目已有原版资源。

## 扩展接口

后续 API 实现替换对应 Repository，无需重做 UI。RSS 可以由可信服务定时生成相同 Schema；内容层保留 domainId、来源与更新时间，不让页面承担抓取任务。`KnowledgeRetrievalService.retrieveKnowledge` 只返回知识片段、评分和关联 ID，为 RAG 提供可追踪证据；本次没有接大模型、数据库或后台。

## 字体与资产

本地 `scripts/update-content-font.py --assets 原版assets目录` 只扩展获授权本地 Unifont 子集，所有游戏资产仍忽略提交。阅读器对未知外部字形有逐字回退，避免字符静默消失。没有上传或重新分发游戏贴图；云端原资源清单保持原样。

## 2026-10-15 收尾验证

- `npm run test:content`：9 项通过，涵盖 RSS/Atom、去重、缺失链接、日期、CDATA、危险 URL/DTD、失败缓存及中英文搜索。
- `npm run build`：内容校验、RSS XML/OPML 校验、ClassiCube 原资源校验、TypeScript、Vite 构建通过。
- OPML 导入实测：导出清单重新导入产生 0 个重复候选；测试生成的空提案已移除。
- 浏览器人工交互：22 个博客世界；真实外部论文书目与阅读引导；原 NIDS 154 页全文读取/跳页；Wiki 中文别名与三类关联跳转；RSS 分类 7 个/方向、中文“漏洞”检索 8 条、40→80 分批加载、空搜索、已读反馈与筛选后禁用无效连接。
- 分辨率：1366×768、1920×1080、2560×1440；保存截图至忽略提交的 `tests/screenshots/content-*.jpg`，书籍和服务器列表保持比例，修复书架 tooltip 撑出横向滚动的问题。
- 本次浏览器验收通过 CUA 执行；历史 Playwright 脚本已按新内容规模调整，本次没有将它们声明为已完整重跑。
- 图标检查无缺失，当前验收页面 console error 为 0。`git diff --check` 通过。未 push、未发布、未修改 CI。

RSS 快照来自 2026-10-14 的实际联网抓取，21 个源均成功解析、合计 406 条；本次本地构建复用了该快照，没有将它冒充为实时在线监控。更新使用 `npm run build:with-feeds`。
