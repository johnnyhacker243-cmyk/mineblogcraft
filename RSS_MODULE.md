# MineRSS 信息世界

## 第二轮视觉升级（2026-10-11）

保留背景、六个源、条目三列结构、数据接口和底部两枚按钮。左上新增现有 `/assets/logo/blog-logo.png`，未重绘；居中 MineRSS 标题扩大两倍，字形阴影从默认深灰改为黑色，副标题保留。背景遮罩从 #0008 加深至 #0009。

1920×1080 实测对比：

| 项目 | 修改前 | 修改后 |
| --- | --- | --- |
| 左上 Logo | 无 | 540×180，位置 36,30 |
| 标题画布高度 | 27 | 54 |
| 服务器内容宽度 | 1170 | 框体 1440（屏宽 75%），内部 1428 |
| 列表外框 | 全屏横向暗色带，上下细线 | 居中黑色半透明框，灰白像素边框 |
| 单条目高度 | 132 | 186（+40.9%） |
| 物品图标尺寸 | 84×84 | 120×120 |
| 文字纵向间距 | 9 | 15 |

放大条目后采用内部滚动，所有源仍在列表内，框外按钮固定可见。1366×768 框宽 960（70.3%）；1920×1080 为 1440（75%）；2560×1440 为 1920（75%）。标题、Logo、列表互不重叠。浏览器测试通过了三种分辨率的几何断言、滚动查看最后一条、两枚按钮、键盘和提示，控制台/资源错误为空；最终构建通过。

修改组件：MineRSSScreen 增加 Logo 与黑色标题阴影；InventoryText 增加可选 shadowColor，默认保留旧颜色；rss.css 统一调整框体、条目、图标、间距与遮罩；rss.mjs 增加布局量化和滚动验证。资源保持原有草方块、末影珍珠、盾牌槽位轮廓、红石粉、工作台、附魔书、Ping、按钮和原背景，没有增加生成图或第三方素材。

已实际检查默认和滚动截图。修改前截图 `tests/screenshots/rss-before-upgrade-1920x1080.png`、`rss-before-upgrade-1366x768.png`；修改后为 `rss-1920x1080.png`、`rss-1366x768.png`、`rss-2560x1440.png` 及 `rss-scrolled-*`。后文初版尺寸记录保留作历史对照。

## 当前功能与数据

首页 Multiplayer 改为 MineRSS，原版按钮尺寸与纹理不变。页面采用多人服务器列表式结构：左侧物品图标、中间名称/描述/标签、右侧 ONLINE 与更新时间/原版 Ping 图标。点击或 Enter/Space 可选择服务器，白色边框显示选择和键盘焦点。底部只保留连接信息源与返回；连接按钮显示「RSS管理功能将在未来版本开放」，Escape 先关闭提示，再返回首页。

六个信息源分别为 AI Research Server、OpenAI Laboratory、Cyber Security Server、Security Research World、Open Source World、Software Engineering Hub。当前没有访问真实 RSS，也没有取得远程连通性、Ping、更新时间或文章数量；全部 ONLINE、2026-10-11 和信号图标均为静态样例，页面顶部明确说明。sourceUrl 留空，名称仅用于演示分组，不代表已建立合作或真实服务器。

RSSServer 字段：id、name、icon、description、category、tags: string[]、sourceUrl、lastUpdate、status: online/offline。日期采用 YYYY-MM-DD。RSSArticle 预留 id、sourceId、title、url、publishedAt；静态 getLatest 返回空数组，不编造最新文章。

## 组件结构

```text
src/data/rssSources.json             静态源数据
src/models/RSSServer.ts              RSSServer / RSSArticle / RSSQuery
src/services/RSSRepository.ts        Repository 接口、Static 实现、RSSService
src/screens/MineRSSScreen.tsx        加载、列表、提示与返回
src/components/rss/RSSServerRow.tsx  服务器条目与状态
src/components/rss/RSSServerIcon.tsx 原版物品图标
src/styles/rss.css                  独立布局、遮罩及 GUI Scale
tests/interactions/rss.mjs          浏览器验证
```

页面不直接读取 JSON。RSSService 接受可注入的 RSSRepository，预留 getSources(signal)、getLatest(signal)；源搜索与 category 过滤在服务层预留，当前没有在 UI 增加搜索/分类工具。加载使用 AbortSignal 与过期结果检查，卸载后不写回状态。

## 后续 RSS / API / 数据库

未来实现 ApiRSSRepository，从 `/api/rss/sources` 和 `/api/rss/latest` 读取并校验数据，替换服务构造依赖即可。真实 RSS XML 解析、定时抓取、更新时间、新文章数量和数据库持久化应在后续服务端完成，避免浏览器跨域与密钥问题；本轮不搭建后端。可按 sourceId 汇总未读数量，扩展 RSSQuery 做服务端分类/搜索，保持页面条目结构不变。

## 背景与原版资源

用户指定 `gptphotos/暮色湖畔的村庄与紫色传送门.png`，完整字节复制到本地 `public/assets/rss/background.png`。使用 center/cover 铺满，叠加黑色菜单遮罩；宽高比不同的窗口会自然裁切两边或上下，不拉伸、不修改图片像素。源图和副本 SHA-256 相同。

来自用户授权 Minecraft 1.21.1 客户端的纹理：

- block/grass_block_top.png、grass_block_side.png：草方块。
- item/ender_pearl.png、redstone.png、enchanted_book.png：末影珍珠、红石粉、附魔书。
- block/crafting_table_top.png、crafting_table_side.png：工作台。
- item/empty_armor_slot_shield.png：原版盾牌槽位轮廓图标。1.21.1 没有普通 item/shield.png，本轮没有冒充完整盾牌实体渲染。
- gui/sprites/server_list/ping_5.png、ping_1.png：静态信号示意。
- 原有 widget/button、button_highlighted、button_disabled 九宫格纹理及本地 Unifont 字形图集。

游戏素材及背景副本均被 .gitignore 排除，只提交代码、数据和说明。资源来源及哈希见本地 inventory/PROVENANCE.json；读取许可不代表公开再分发许可。本页是按要求定制的信息服务器界面，没有同尺寸游戏截图，因此不宣称整屏原版 1:1。

## 实际验证与截图

运行 `npm run build`、`npm run test:rss`、`npm test`。RSS 浏览器测试验证六个源、两枚按钮、字形与图标加载、选择状态、键盘、提示关闭、返回、背景字节一致性，以及 1366×768 / 1920×1080 / 2560×1440 的居中与无重叠。GUI Scale 分别为 2 / 3 / 4，列表宽度 780 / 1170 / 1560；小窗口与提示出现时使用游戏式列表滚动，不遮住底部按钮。

实际结果见 `tests/rss-results.json`、`tests/results.json`。截图：`tests/screenshots/rss-1366x768.png`、`rss-1920x1080.png`、`rss-2560x1440.png`、`rss-management-notice.png`。截图保留本地。
