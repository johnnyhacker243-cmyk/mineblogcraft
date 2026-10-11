# MineWorld 第一阶段：数字博物馆

首页地球图标现在进入 MineWorld。该世界由前端 Three.js 渲染，不运行 Minecraft 客户端，也不接后端。已有主菜单品牌、入口布局和加载动画保留。

## 建筑与参观动线

约100×100方块的平坦庭院，约65×67的博物馆主体。石砖门廊、雕纹柱、铜色山墙、深色橡木梁、玻璃大厅顶和海晶灯构成古典科技展馆。中央铜色地面引导参观。

|区域|位置|内容与交互|
|---|---|---|
|Main Hall|中央|入口、世界日志 MineBlog、作者档案|
|Knowledge Hall|左后|书架、阅读桌、附魔书；进入 MineWiki|
|Research Gallery|右后|玻璃展柜、成书展示；进入 MineResearch|
|Project Workshop|左前|工作台、红石装置、铁砧；明确提示项目展示待开放|
|Status Chamber|后方|书架、附魔台、浮动附魔书和微弱紫光；进入 MineStatus|
|Portal Room|右前|黑曜石和原版动态传送门纹理；进入 MineRSS|

参考 [The Story Museum Minecraft Museum](https://www.storymuseum.org.uk/digital-resources/minecraft-museum) 的庭院、附魔图书馆与分区参观方式，以及 [Minecraft Education 的 Museum Build 设计指南](https://education.minecraft.net/content/dam/education-edition/software-downloads/Minecraft_Education_Edition_Design_Guide_June_2021.pdf) 的展览式内容组织。仅研究动线和展示理念，没有下载或复制这些地图。建筑完全由本项目规则生成。

## 操作

- 点击“开始 / 继续探索”后请求鼠标锁定。
- WASD / 方向键平移；Shift 快走；鼠标观察。
- 浏览器不允许鼠标锁定时，可按住画面拖动观察。
- 距离交互台3个方块以内出现提示，按E打开对应模块；鼠标未锁定时也可点击提示。
- Esc 暂停并释放鼠标；暂停菜单可继续、回到入口、返回主菜单。
- 从展馆进入模块后，模块的返回按钮返回 MineWorld，保持位置和视角。重新进入展馆默认暂停，避免突然移动。
- 当前是平坦地图，不实现跳跃、战斗、挖矿、生物或多人。

## 架构

- src/config/world-config.ts：世界尺寸、出生点、镜头/移动参数和入口目标。
- MineWorldPage：暂停、邻近提示和模块导航。
- WorldViewport：鼠标、键盘、渲染循环、全景之外的独立三维场景。
- museum-scene.ts：方块建筑、贴图、光照、展示物和标牌。
- world-collision.ts：网格索引碰撞，圆形角色水平碰撞、分步运动与墙面滑动。

方块按材质批量 InstancedMesh 绘制；地面重复原纹理，不把整张贴图拉伸。玻璃顶和展柜使用原版透明纹理，书本展示物采用原版物品图标平面，不宣称是完整游戏物品模型。附魔台基座使用原版顶面/侧面，铁砧为简化几何。灯光使用海晶灯材质、方向光/环境光及克制的紫色局部光，未实现游戏光照传播。

离开时释放世界几何、材质、纹理、渲染器、鼠标锁定和事件；资源未加载完就离开时也会释放随后加载成功的场景。页面隐藏后暂停循环，输入状态清空。

## 本地素材

原版1.21.1客户端：stone_bricks、chiseled_stone_bricks、dark_oak_planks、copper_block、sea_lantern、glass、obsidian、nether_portal、anvil、redstone_block、quartz_block_side、oak_leaves、grass_block_top、bookshelf、crafting_table、enchanting_table、enchanted_book，以及已有位图字体和按钮音效。

素材来自用户授权的固定客户端文件，scripts/import-inventory.py 可重复导入；原图与派生字体保留本地、不提交 Git。新机器运行需要自行重新导入已获授权素材，不等于 GitHub 已包含完整美术资源。本阶段没有部署网站。

## 测试与截图

实际 Chromium 测试：1366×768、1920×1080、2560×1440。检查鼠标锁定、WASD步行、五个展区与Blog跳转、返回位置、墙面碰撞、重置、返回主菜单和无WebGL提示；碰撞单独测试较大步长无法穿墙、墙边滑动、边界。

npm run build；npm run test:world；npm test。

截图：tests/screenshots/world-entrance-*.png、world-main-hall.png、world-library.png、world-research.png、world-portal.png、world-status.png、world-workshop.png。
测试记录：tests/world-results.json。

首次截图分析后后移出生点，以显示完整门廊；补全玻璃展柜、简化铁砧造型、标牌位置和屋顶内侧显示。没有测试真实腾讯云发布或移动端触屏操作，也不报告未经测量的帧率。

## 后续

项目展览接入用户真实项目内容；逐步增加讲解NPC、建筑细节与彩蛋。需要优化时可引入面合并/遮挡裁剪，但不引入完整游戏引擎。新增入口通过 world-config 配置，新增展品从建筑生成逻辑扩展。
