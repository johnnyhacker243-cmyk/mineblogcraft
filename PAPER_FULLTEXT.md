# MineResearch 完整论文修复

## 问题与结果

此前 33 篇外部文献中只有 NIDS-FGPA 接入完整正文，其余 32 篇展示书目与阅读引导。现在这 32 篇改为完整原始 PDF，总计 885 个原文页面；NIDS-FGPA 原有 CC BY 4.0 正文及图表继续使用原阅读器。扩散方程演示内容仍明确为示例，未冒充真实发表论文。

原有藏书架、附魔检索、书本出现/打开动画、纸张纹理与翻页按钮保留。PDF 使用原排版呈现文字、公式、图表、附录和参考文献；没有用 AI 改写正文，也没有将作者换成本站作者。

## 读取与校验

`config/paperFulltextSources.json` 记录固定版本的原文地址、规范出版出处和已知许可信息。32 篇中 27 篇来自 arXiv，Raft 使用作者网站上的 18 页扩展版本。逻辑时钟、LFS、MapReduce、Sybil 使用已有公开研究资料存档：各文件 SHA-256 与原作者/出版机构 PDF 逐字节一致，地址固定到存档仓库的提交。引用仍指向规范原作者/出版页面。公开存档不是本站重新发布文件，也不代表获得重新分发授权。

`scripts/verify-paper-fulltexts.mjs` 下载到系统临时目录中的私有审计缓存，验证响应、PDF 签名、体积、标题、实际页数、首页/末页可解析和 SHA-256。若存档与已核验原文件哈希不同则失败；中途失败保留旧完整目录。只将元数据写入 `public/papers/fulltext-catalog.json`，PDF 原文件不进入 Git 或站点构建。普通校验可复用同地址的审计缓存，`--refresh` 强制重新联网，不冒充逐页人工审读。

浏览器通过 `PaperRepository → PDFRepository → PDFBookPages` 按需读取一篇 PDF，只渲染当前双页。PDF.js 和 worker/字体/编解码器延迟加载，不随首页下载论文。只渲染 PDF 图形，不调用 PDF 脚本、表单或外部动作。源地址经过 HTTPS/主机限制，学术存档限制仓库与固定提交，不使用匿名跨域代理。

## 阅读操作

- 使用原左右箭头或键盘方向键翻页。
- Page / Go 可跳转到原 PDF 的实际页码。
- 奇数末页右侧留白，不能翻到虚假的下一页。
- 点击任一原文页，以 2400 像素宽重新渲染原始页面，放大窗口可滚动阅读；Esc 返回书本。
- 页面下方保留原作者/DOI、许可和完整 PDF 链接。
- 网络失败明确显示重试，不退回阅读引导并伪装成全文。

## 运行与后续接入

`npm install` 后运行 `npm run dev` 或 `npm run build`，前置脚本会从安装包准备 PDF.js worker、字体与图像解码文件，不需要浏览器 CDN。PDF.js 6.4.299 要求 Node >=22.13 或 >=24，本机使用 Node 24。

`npm run papers:verify` 重新审核源文件并同步元数据；如需强制联网，执行 `node scripts/verify-paper-fulltexts.mjs --refresh` 后运行 `node scripts/apply-paper-fulltexts.mjs`。`npm run content:validate` 在构建阶段离线检查目录与页面记录一致。`npm run test:content` 包含完整原文、作者、可信 URL 与公开存档哈希回归。

新增论文时先核实作者、版本、完整 PDF 和来源许可，再添加源记录，运行审核与同步，确认浏览器跨域读取支持，最后检查正文图表和末页。无完整原文的条目应保留 metadata/note，不应声明 fulltext。未来数据库可以返回同样的 `format: pdf`、`pdf.url/pageCount/sha256/verifiedAt` 结构，不需要重做 UI。

当前完整原文需要联网，源站中断或跨域政策变化可能影响读取；本次没有实现离线论文缓存或重新托管受限原文。未增加后端、未部署、未推送。

## 本轮验收记录

- 32 份原始 PDF 的实际页数、首页/末页和 SHA-256 校验通过，共 885 页；四份公开研究存档与规范原文件逐字节一致。全部 34 条现有标题、作者、年份及规范出处保持不变。
- 12 项内容/RSS/搜索/PDF 回归检查通过。TypeScript、Vite 构建及内容、RSS、OPML、ClassiCube 校验通过。首次构建遇到 Windows 文件占用，重试完整构建已通过。
- 浏览器实际检查 MapReduce、Sybil、LFS、逻辑时钟、Attention、GPT-3 与 SWE-agent 等代表性论文。MapReduce 13 页的奇数末页留白正确；SWE-agent 第 117–118 页附录可渲染；Esc 退出放大、2400 像素单页重渲染与同模块切换论文通过。并非对 885 页逐页人工审校。
- 本轮最终截图为 1280×720 视口，保留原 GUI 缩放规则；截图存于忽略提交的 tests/screenshots/research-fulltext-*.png。浏览器验收页 console error 为 0。
- 本轮仅保存本地提交，不 push、不部署。
