# MineBlog 世界博客模块

## 页面与结构

首页原 Singleplayer 按钮改为 MineBlog，复用原版按钮的尺寸、纹理和状态。列表顶部为搜索框，中央为世界列表，底部只保留进入与返回。文章阅读页显示草方块、标题、日期和正文，暗色半透明区域可滚动，返回按钮始终可见。Escape 从文章返回列表，再按一次返回首页；列表支持点击选择、双击进入及 Enter/Space。

```text
src/data/blogs.json                 静态文章数据
src/models/BlogWorld.ts             统一数据类型
src/services/BlogRepository.ts      数据来源接口和静态实现
src/services/BlogService.ts         搜索规则与服务入口
src/screens/BlogWorldSelect.tsx     世界选择和阅读状态
src/components/blog/
  WorldSearch.tsx                   搜索输入
  WorldList.tsx / WorldCard.tsx      世界列表和条目
  WorldCover.tsx                    原版草方块 / 自定义封面
  BlogReader.tsx / BlogText.tsx      安全文本阅读和像素换行
src/styles/blog.css                游戏界面布局
scripts/generate-rss.mjs            RSSGenerator
public/feed.xml                    生成结果
tests/interactions/blog.mjs         浏览器验证
```

## 数据与搜索

BlogWorld 包含 `id`、`title`、`image`、`createTime`、`description`、`category`、`tags: string[]`、`content`。日期采用 YYYY-MM-DD，文章 ID 必须唯一。第一篇开发日志根据本项目实际开发过程和用户给定主题编写；Wiki、Research、AI 功能及数据库仍标注为规划。

页面只调用 BlogService，组件不直接导入 JSON。搜索不区分英文大小写，修剪前后空格，多词按 AND 匹配标题、简介、标签和分类。无结果时显示提示并取消失效选择；未选择世界时进入按钮禁用。异步搜索通过 AbortSignal 与过期响应检查避免旧请求覆盖新结果。

正文当前支持 `## 标题` 和普通段落，以 React 文本与字形画布渲染，不解析 HTML，也不执行文章指令。新增文章后运行字体导入脚本以补齐中文像素字形。

## RSS

`npm run rss` 从同一份 blogs.json 生成 RSS 2.0 的 title、link、guid、pubDate、description 和 category，XML 字段做转义。`npm run dev` 和 `npm run build` 自动生成。当前地址是本地 `http://127.0.0.1:5173/feed.xml`，条目链接采用 `/#blog/<id>`，可直接进入文章。日期按北京时间零点转为标准 RSS UTC 时间。

BLOG_BASE_URL 可覆盖链接基址；本轮没有部署，也没有设置公开域名。若直接启动 Vite 或开发时修改 JSON，需再运行 `npm run rss` 更新 feed.xml。

## 后续接口替换

实现 `BlogRepository.getBlogs(signal): Promise<BlogWorld[]>` 的 API 版本，向 `/api/blogs` 请求并校验返回数据，再替换 BlogService 的构造依赖；UI 和本地搜索规则不变。后台分页/大规模搜索以后可扩展服务方法，当前不搭建后端。RSS 将来由服务器用同一数据模型生成，数据库实现不属于本轮。

## 资源与视觉依据

原版素材来自用户授权的 Minecraft Java Edition 1.21.1 客户端，固定清单提取 `gui/menu_list_background.png`、`gui/header_separator.png`、`gui/footer_separator.png`、草方块与现有按钮纹理。1.21.1 没有一个通用的 block/grass_block.png，本页使用原版顶部/侧面纹理组成草方块。图片不公开再分发，仍受 .gitignore 和 ASSET_LICENSES.md 约束。

布局使用整数 GUI Scale，列表固定 350 逻辑像素，搜索框 200×20，按钮 200×20。1366×768 为 Scale 3；1920×1080 与 2560×1440 为 Scale 4。保留三维全景作为菜单背景，列表与文章叠加暗色层。

本次无法取得可访问的 mappings.dev 世界选择页面，也没有同尺寸的原版世界选择截图。因此依据本地原版纹理及游戏菜单结构实现，不能宣称完整原版像素级 1:1；条目高度因额外简介而扩展，阅读区域是博客扩展界面。

## 验证

运行 `npm run build`、`npm run test:blog` 和 `npm test`。博客测试覆盖三种桌面尺寸、四字段搜索、空结果与选择失效、按钮禁用、Enter/Space/Escape、双击进入、正文滚动、字形完整性、RSS XML 与直接链接、控制台及资源错误。实际测试结果见 `tests/blog-results.json` 和 `tests/results.json`。

截图保存在 `tests/screenshots/blog-worlds-1366x768.png`、`blog-worlds-1920x1080.png`、`blog-worlds-2560x1440.png` 及对应 `blog-reader-*`。首轮截图检查修复了首页全局 footer 样式影响阅读页的重叠问题，并将版权栏样式限定到 `.main-footer`。
