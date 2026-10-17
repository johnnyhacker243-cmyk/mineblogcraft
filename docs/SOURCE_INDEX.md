# 源码导航

## 页面与入口

| 位置 | 用途 |
| --- | --- |
| src/main.tsx → components/StartupApplication.tsx | 应用入口与启动加载 |
| src/components/MinecraftTitleScreen.tsx | 全景、导航、音乐与页面切换 |
| src/screens/ | 博客、RSS、论文、Wiki、状态页面 |
| src/components/MinecraftInventory.tsx、config/profile-config.ts | 作者页及品牌内容 |
| src/MineWorld/ | 游戏加载、消息校验与嵌入客户端 |
| src/components/PageErrorBoundary.tsx | 内容页异常恢复 |
| src/services/、models/、utils/ | 数据读取、搜索、模型、分页及图形辅助 |
| src/styles/ | 各页面像素 UI 样式 |

## 内容与资源

| 位置 | 用途 |
| --- | --- |
| public/content/blogs/、src/data/blogs.json | Markdown 博文与文章目录元数据 |
| config/rssSources.json、public/data/rss/ | RSS 配置、构建时保存的摘要与访问记录 |
| src/data/papers.json、config/researchSelection.json、config/paperFulltextSources.json | 论文目录、选题元数据与全文来源配置 |
| public/papers/ | 结构化原文、许可记录、PDF 校验目录；PDF 文件由脚本准备 |
| content/wiki/ | Wiki Markdown 源文件与写作规则 |
| src/data/wiki.json | 构建生成的 Wiki 索引；修改上方 Markdown 后重建 |
| cloud-assets.json、ASSET_LICENSES.md | 未纳入 Git 的运行素材哈希清单与权利范围 |
| public/vendor/classicube/ | 固定版本开源客户端及原许可证；不要手动修改上游文件 |

## 工具与检查

- scripts/：资源还原、内容生成、采集、校验、发布与源码打包工具。
- tests/*.test.mjs：内容、安全边界和发布规则自动检查。
- tests/interactions/：真实浏览器交互、Wiki 稳定性与错误恢复检查；截图只保存在本地。
- .opencode/skills/：基于资料的 Wiki 问答与论文收集工作流。
- .github/workflows/：既有腾讯云自动发布；.gitlab-ci.yml：极狐上的构建校验。

已有模块文档保留原路径，便于检查历史决策。当前实现与已知范围以 docs/FINAL_ACCEPTANCE.md、docs/WIKI_BLACKOUT_FIX.md 和实际代码为准。源码交付步骤见 docs/GITLAB_SOURCE_DELIVERY.md。
