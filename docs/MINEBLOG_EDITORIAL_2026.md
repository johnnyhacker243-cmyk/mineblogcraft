# MineBlog 日更系列重编记录

本次保留世界选择菜单、暗色阅读框、像素字体、返回与搜索交互，只重做内容组织、主题图标与必要的段落适配。原有《Mineblogcraft 的诞生》保留在 10 月 11 日，系列外独立存在。

## 日期与作者边界

- 系列覆盖 **2026-09-20—2026-10-10**，每天一篇，按 AI → Security → Software 轮换，各 7 篇。
- createTime 是用户要求的栏目编排日期，不伪称文章在当时已经写成、实验或公开发布。页面明确显示“栏目日期”。
- updatedAt 与来源 checkedAt 为本次真实修订和查阅日期 **2026-10-15**。已知来源发布日期不得晚于该篇栏目日期；持续更新的官方文档只标查阅日，不编造发布日期。
- 保持原有 AI 辅助编辑草稿身份，不把外部论文或厂商成绩改写为 YTC 的亲身实验。论文摘要层面的介绍明确保留预印本及待复现边界。
- 21 篇在本地可预览；仍为 draft，不自动进入公开 feed.xml，不执行推送或部署。正式署名和发布由作者审阅后决定。

## 日程、问题与物品

图标是同一获授权 Minecraft Java 1.21.1 客户端中的**未修改原版物品 PNG**。列表和正文共用每篇唯一的 image 字段，不再全部回退为草方块。

| 栏目日期   | 方向     | 文章                                                                                                           | 原版物品   | 选择理由                           |
| ---------- | -------- | -------------------------------------------------------------------------------------------------------------- | ---------- | ---------------------------------- |
| 2026-09-20 | AI       | [Agent 的长任务难题：怎样把“继续做”变成可靠交付](../public/content/blogs/ai-from-llm-to-agent.md)              | 红石中继器 | 阶段衔接、受控执行与任务节奏       |
| 2026-09-21 | Security | [MCP 授权边界：工具连通以后，谁有权做什么](../public/content/blogs/network-security-foundation.md)             | 铁剑       | 具有行动能力的工具需要明确权限边界 |
| 2026-09-22 | Software | [React 19.3 的视图过渡：动画不能替状态管理做决定](../public/content/blogs/software-react-state.md)             | 末影珍珠   | 页面位置切换与连续的导航体验       |
| 2026-09-23 | AI       | [长上下文不是长期记忆：Agent 怎样保存任务状态](../public/content/blogs/ai-transformer.md)                      | 书与笔     | 可更新、可追溯的任务记录           |
| 2026-09-24 | Security | [Passkey 的安全边界：没有密码，为什么仍要设计找回流程](../public/content/blogs/security-http.md)               | 不死图腾   | 账户恢复与最后一道保护             |
| 2026-09-25 | Software | [Vite 8 的统一构建链：升级前先写清楚输出契约](../public/content/blogs/software-api-contract.md)                | 烈焰粉     | 构建动力与工具链转换               |
| 2026-09-26 | AI       | [Qwen3-VL 与多模态 RAG：检索命中之后，证据还差哪一步](../public/content/blogs/ai-rag-evidence.md)              | 指南针     | 将问题定位到可追溯的知识来源       |
| 2026-09-27 | Security | [给 RSS 和 Agent 抓取器设边界：HTTPS 为什么挡不住 SSRF](../public/content/blogs/security-asset-discovery.md)   | 钓鱼竿     | 从外部获取资料必须限制可触达的范围 |
| 2026-09-28 | Software | [TypeScript 7 的原生编译器：类型更快，数据边界仍要自己守](../public/content/blogs/software-repository.md)      | 命名牌     | 用明确类型和身份标注数据对象       |
| 2026-09-29 | AI       | [读 MCP 2026 工具规范：Schema 能管参数，不能替你授权](../public/content/blogs/ai-tool-contract.md)             | 红石粉     | 工具之间的结构化信号与协议连接     |
| 2026-09-30 | Security | [npm Trusted Publishing：短期身份为什么仍然需要发布边界](../public/content/blogs/security-vulnerability.md)    | 拴绳       | 把发布权限绑定到指定仓库和工作流   |
| 2026-10-01 | Software | [Node.js 26 的 Temporal：先分清日期、瞬间与时区](../public/content/blogs/software-testing.md)                  | 时钟       | 时间语义与日期边界                 |
| 2026-10-02 | AI       | [从 LR-LoRA 到 LoRA-TSD：微调比较为什么必须控制变量](../public/content/blogs/ai-lora.md)                       | 青金石     | 以有限资源进行针对性能力调整       |
| 2026-10-03 | Security | [GitHub Actions 安全扫描：没有告警，能否说明工作流安全](../public/content/blogs/security-ids.md)               | 紫水晶碎片 | 从细微信号中发现工作流风险         |
| 2026-10-04 | Software | [OpenTelemetry 的进程上下文：为什么一次构建会散成多条 Trace](../public/content/blogs/software-architecture.md) | 望远镜     | 跨进程追踪与观察完整执行链         |
| 2026-10-05 | AI       | [Agent 评估不能只判回答：怎样检查它真正完成了任务](../public/content/blogs/ai-evaluation.md)                   | 红石比较器 | 比较可观察结果与验收目标           |
| 2026-10-06 | Security | [React 安全更新怎样读：RSC 漏洞、Trusted Types 与实际暴露面](../public/content/blogs/security-response.md)     | 铁胸甲     | 分层防护与明确的浏览器安全边界     |
| 2026-10-07 | Software | [Vitest 5 的 Trace View：把偶发失败变成可解释的时间线](../public/content/blogs/software-rss-pipeline.md)       | 光灵箭     | 标出失败位置与可追踪的交互目标     |
| 2026-10-08 | AI       | [Agent 提示注入防护：别让读到的文字变成执行权限](../public/content/blogs/ai-input-boundary.md)                 | 成书       | 外部文档承载资料而不是行动指令     |
| 2026-10-09 | Security | [SBOM 不是安全证书：从组件清单走向可行动的风险判断](../public/content/blogs/security-supply-chain.md)          | 收纳袋     | 把依赖、版本和关系整理成可检查清单 |
| 2026-10-10 | Software | [静态发布也需要来源证明：让通过测试的文件成为最终产物](../public/content/blogs/software-static-delivery.md)    | 运输矿车   | 把同一份已验证产物运送到发布端     |

## 来源与研究范围

技术事实优先来自维护者的发布说明、协议规范、原作者论文与官方实现。正文主要是原创的机制解释、场景推演、取舍及验证设计，没有转载原文全文或制造实验数字。版本发布不代表本项目升级到该版本。

- **2026-09-20 Agent 的长任务难题：怎样把“继续做”变成可靠交付**：[Harness design for long-running application development](https://www.anthropic.com/engineering/harness-design-long-running-apps)（2026-03-24；查阅 2026-10-15）
- **2026-09-21 MCP 授权边界：工具连通以后，谁有权做什么**：[MCP 2026-07-28 · Security Best Practices](https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/security_best_practices)（2026-07-28；查阅 2026-10-15）
- **2026-09-22 React 19.3 的视图过渡：动画不能替状态管理做决定**：[React 19.3 · 官方发布说明](https://react.dev/blog/2026/09/09/react-19-3)（2026-09-09；查阅 2026-10-15）
- **2026-09-23 长上下文不是长期记忆：Agent 怎样保存任务状态**：[Managed Agents · Anthropic 工程实践](https://www.anthropic.com/engineering/managed-agents)（2026-04-08；查阅 2026-10-15）
- **2026-09-24 Passkey 的安全边界：没有密码，为什么仍要设计找回流程**：[WebAuthn Level 3 · 2026-05-15 候选推荐草案](https://www.w3.org/TR/2026/CRD-webauthn-3-20260515/)（2026-05-15；查阅 2026-10-15）
- **2026-09-25 Vite 8 的统一构建链：升级前先写清楚输出契约**：[Announcing Vite 8 · 官方发布说明](https://vite.dev/blog/announcing-vite8.html)（2026-03-12；查阅 2026-10-15）
- **2026-09-26 Qwen3-VL 与多模态 RAG：检索命中之后，证据还差哪一步**：[Qwen3-VL-Embedding 与 Qwen3-VL-Reranker · 2026 技术报告](https://arxiv.org/abs/2601.04720)（2026-01-08；查阅 2026-10-15）；[QwenLM · Qwen3-VL-Embedding 官方实现与使用说明](https://github.com/QwenLM/Qwen3-VL-Embedding)（持续更新；查阅 2026-10-15）
- **2026-09-27 给 RSS 和 Agent 抓取器设边界：HTTPS 为什么挡不住 SSRF**：[OWASP · Server-Side Request Forgery Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html)（持续更新；查阅 2026-10-15）
- **2026-09-28 TypeScript 7 的原生编译器：类型更快，数据边界仍要自己守**：[Announcing TypeScript 7.0 · Microsoft 官方博客](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/)（2026-07-08；查阅 2026-10-15）
- **2026-09-29 读 MCP 2026 工具规范：Schema 能管参数，不能替你授权**：[MCP 2026-07-28 · Tools 规范](https://modelcontextprotocol.io/specification/2026-07-28/server/tools)（2026-07-28；查阅 2026-10-15）
- **2026-09-30 npm Trusted Publishing：短期身份为什么仍然需要发布边界**：[npm Docs · Trusted publishing for npm packages](https://docs.npmjs.com/trusted-publishers/)（持续更新；查阅 2026-10-15）
- **2026-10-01 Node.js 26 的 Temporal：先分清日期、瞬间与时区**：[Node.js v26.0.0 · 官方发布说明](https://nodejs.org/en/blog/release/v26.0.0/)（2026-05-05；查阅 2026-10-15）
- **2026-10-02 从 LR-LoRA 到 LoRA-TSD：微调比较为什么必须控制变量**：[Parameter-Efficient Fine-Tuning with Learnable Rank · 2026 预印本](https://arxiv.org/abs/2606.04325)（2026-06-03；查阅 2026-10-15）；[LoRA-TSD: Tangent-Space Spectral Descent · 2026 预印本](https://arxiv.org/abs/2609.02734)（2026-09-02；查阅 2026-10-15）；[LoRA Without Regret · Thinking Machines Lab](https://thinkingmachines.ai/blog/lora/)（2025-09-29；查阅 2026-10-15）
- **2026-10-03 GitHub Actions 安全扫描：没有告警，能否说明工作流安全**：[Unpacking Security Scanners for GitHub Actions Workflows · 2026 研究预印本](https://arxiv.org/abs/2601.14455)（2026-01-20；查阅 2026-10-15）
- **2026-10-04 OpenTelemetry 的进程上下文：为什么一次构建会散成多条 Trace**：[Help us stabilize environment variable context propagation · OpenTelemetry](https://opentelemetry.io/blog/2026/environment-variable-context-propagation/)（2026-09-11；查阅 2026-10-15）
- **2026-10-05 Agent 评估不能只判回答：怎样检查它真正完成了任务**：[Demystifying evals for AI agents · Anthropic](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)（2026-01-09；查阅 2026-10-15）
- **2026-10-06 React 安全更新怎样读：RSC 漏洞、Trusted Types 与实际暴露面**：[React · Critical Security Vulnerability in React Server Components](https://react.dev/blog/2025/12/03/critical-security-vulnerability-in-react-server-components)（2025-12-03；查阅 2026-10-15）；[React 19.3 · Trusted Types 兼容说明](https://react.dev/blog/2026/09/09/react-19-3)（2026-09-09；查阅 2026-10-15）
- **2026-10-07 Vitest 5 的 Trace View：把偶发失败变成可解释的时间线**：[Vitest 5 · 官方发布说明](https://vitest.dev/blog/vitest-5)（2026-09-03；查阅 2026-10-15）
- **2026-10-08 Agent 提示注入防护：别让读到的文字变成执行权限**：[How we contain Claude across products · Anthropic](https://www.anthropic.com/engineering/how-we-contain-claude)（2026-05-25；查阅 2026-10-15）
- **2026-10-09 SBOM 不是安全证书：从组件清单走向可行动的风险判断**：[CycloneDX · Specification Overview](https://cyclonedx.org/specification/overview/)（持续更新；查阅 2026-10-15）
- **2026-10-10 静态发布也需要来源证明：让通过测试的文件成为最终产物**：[GitHub Docs · Use artifact attestations](https://docs.github.com/en/actions/how-tos/secure-your-work/use-artifact-attestations/use-artifact-attestations)（持续更新；查阅 2026-10-15）

## 数据与适配

- 元数据：src/data/blogs.json；正文：public/content/blogs/*.md。保留全部稳定 ID 与 #blog/ID 深链，尽管部分历史 ID 的字面名称仍是旧主题。
- 新增字段：seriesIndex、dateMeaning、updatedAt、iconKey、iconLabel、iconReason；来源增加 publishedAt（可选）、checkedAt。
- config/blogIcons.json 记录物品与出处；scripts/import-blog-icons.py 从明确指定且校验 SHA-1 的本地客户端导入。PNG 与来源哈希仍在 Git 忽略范围，未新增下载源或重绘素材。
- WorldCard 和 BlogReader 共用 WorldCover；列表日期行替换重复标题，显示日期、方向与系列编号。
- BlogMarkdown 只解析文字段落、标题、列表、引用和围栏代码。保留缩进、合并同段换行、分组代码，不执行 HTML，不加载正文中的远程图片或脚本。参考链接仅来自受控元数据。
- Wiki 只更新有关博客引用与标题；移除与新选题失配的旧关联，不改变节点、连线、详情和其他论文/RSS 关联。不是为了凑数把新文章挂到 Nmap 或数学方程等不相关节点。

## 本地资源重建

从 ASSET_LICENSES.md 指定的同一客户端运行：

```powershell
python scripts/import-blog-icons.py --jar '<获授权的1.21.1.jar路径>'
python scripts/update-content-font.py --assets '<该客户端的assets目录>'
npm run test:blog-content
npm run test:content
npm run build
```

没有新增依赖。新图标与字体在本地导入并通过浏览器验证；本任务未更新云端素材或发布清单。将来获准部署时，需要连同新增物品及扩展字体一起准备资源，不能假设当前远端已有这些文件。

## 验证记录

本次实际运行结果：生产构建通过；`npm run test:content` 共 23 项通过，其中 5 项专门验证本次博客重编。自动检查覆盖连续日期、领域轮换、草稿状态、图标映射、来源时间、正文结构与重复长段落、Wiki 引用，以及 Markdown 的代码缩进与不可信文本边界。正文长度和结构只是防漏检查，不代替逐篇编辑审阅。

内置浏览器已逐篇打开全部 21 篇，确认正文加载、原版 16×16 物品请求成功、列表与正文图标一致、章节和来源存在。主题搜索 Qwen3-VL 可定位对应文章。普通窗口 1280×720 观察了正文、代码缩进和滚动；另在 1366×768、1920×1080、2560×1440 验证列表可用内容区居中、阅读区与返回按钮不重叠，测试后已恢复默认窗口尺寸。浏览器检查未见错误或警告。

截图保存在 Git 忽略的 tests/screenshots/blog-editorial-list.png、blog-editorial-reader.png。浏览器验证重点是实际物品加载、列表与正文一致、中文段落、代码缩进、来源和返回搜索行为。


## 2026-10-17 用户确认审阅与发布

用户明确要求将全部博客改为已审阅。22 篇文章均记录 reviewStatus=reviewed、reviewedAt=2026-10-17；21 篇 AI 辅助编辑文章改为 published，保留 AI 辅助来源和原系列日期，以独立 publishedAt=2026-10-17 记录本次公开日期。原有文章保留原发布日期。JSON 与 Markdown 状态同步，RSS 纳入全部 22 篇；此前草稿状态和数量仅描述历史阶段。

feed.xml 引用独立 feed.css，浏览器展示复用作者介绍的 grass-border.png 与 dirt.png（64px 平铺和深色遮罩）。仍为标准 RSS 2.0 XML，阅读器无需识别样式；没有改造 MineRSS 外部资讯模块。
