# Emby 一键导入站

填一次 Emby 服务器地址、用户名、密码，一键导入到 5 个播放器 App：SenPlayer、Rex、EplayerX、Vidora、Reflix。

## 它是什么

开 Emby 账号最烦的就是每个 App 都要手动输一遍地址账号密码。这个站就干一件事：

1. 填一次（或者点「📋 粘贴识别剪贴板」，把开户消息粘贴进来自动识别）
2. 点对应 App 的「一键导入」，App 自动打开并填好服务器
3. 每个 App 旁边还有「复制链接」，可以把导入链接发给别人

纯前端单页：密码只在你自己的浏览器里用，不上传、不保存；关掉页面就没了。服务器名称、地址、用户名会记在浏览器本地，下次不用重填。

## 支持的 App

| App | 状态 | 导入方式 |
| --- | --- | --- |
| SenPlayer | ✅ 已确认 | `senplayer://importserver?...` |
| Rex | ✅ 已确认 | `rex://import?...` |
| EplayerX | ✅ 已确认 | `https://eplayerx.com/add-or-update?...`（通用链接） |
| Vidora | ✅ 已确认 | `vidora://emby/import?...` |
| Reflix | ⚠️ 未确认 | 暂用 `reflix://importserver`（通用格式），只能打开 App、不能直接导入 |

Reflix 的官方格式还没找到：它 App 里如果有像 Vidora 那样的导入教程，截图发出来，我按那个改（也欢迎直接提 PR）。

## 自己部署（喂饭教程）

三种方法，任选一种。都不需要服务器，Cloudflare 免费套餐就够。

### 准备工作

- 一个 Cloudflare 账号（免费注册：https://dash.cloudflare.com/sign-up）
- （可选）一个已经托管在 Cloudflare 的域名。没有也行，部署完会送一个 `xxx.workers.dev` 的免费域名

### 方法一：网页后台上传（最简单，不用装任何东西）

1. 登录 https://dash.cloudflare.com
2. 左侧菜单点 **Workers 和 Pages**
3. 点右上角 **创建**，选 **Worker**，随便起个名字（比如 `emby-import`），点 **部署**
4. 点 **编辑代码**，把本仓库 `worker.js` 里的内容**全部复制**，粘贴进去覆盖原来的代码
5. 点右上角 **部署**（Deploy）
6. 回到 Worker 页面，点 **访问**（或直接打开给你的 `https://xxx.workers.dev` 地址），能打开就是成功了

想用自己的域名：

7. 在 Worker 页面点 **设置** → **域**（自定义域和路由）→ **添加** → **自定义域**，输入你的域名（比如 `embyimport.example.com`），保存。等 DNS 生效就能用。

### 方法二：Wrangler 命令行

电脑上装好 Node.js（https://nodejs.org，装 LTS 版就行），然后：

```bash
# 1. 装 Wrangler（Cloudflare 官方命令行工具）
npm install -g wrangler

# 2. 登录 Cloudflare（会打开浏览器点一下授权）
wrangler login

# 3. 下载本仓库代码
git clone https://github.com/James-bot2/doufu-emby-import.git
cd doufu-emby-import

# 4. 部署
wrangler deploy
```

部署成功会打印出访问地址。绑定自定义域名：

```bash
wrangler custom-domains add embyimport.example.com
```

### 方法三：API（curl）

适合写脚本自动化部署。先在 Cloudflare 后台建一个 API Token（权限：Account → Workers Scripts → Edit），再：

```bash
export CF_TOKEN="你的 token"
export CF_ACCT="你的 Account ID"
curl -X PUT -H "Authorization: Bearer $CF_TOKEN" \
  "https://api.cloudflare.com/client/v4/accounts/$CF_ACCT/workers/scripts/emby-import" \
  -F "metadata={\"main_module\":\"worker.js\",\"compatibility_date\":\"2025-11-04\",\"bindings\":[]};type=application/json" \
  -F "worker.js=@worker.js;type=application/javascript+module"
```

返回 `"success":true` 就是成功了。绑定域名：

```bash
curl -X PUT -H "Authorization: Bearer $CF_TOKEN" \
  "https://api.cloudflare.com/client/v4/accounts/$CF_ACCT/workers/domains" \
  -H "Content-Type: application/json" \
  -d '{"hostname":"embyimport.example.com","service":"emby-import","environment":"production"}'
```

## 自己改代码

仓库里真正要改的只有 `index.html`，`worker.js` 是由它生成的。

### 文件说明

| 文件 | 作用 |
| --- | --- |
| `index.html` | 页面源码，改这里 |
| `worker.js` | 生成的 Worker 代码（把 `index.html` 包了一层），改完 `index.html` 要重新生成 |
| `icons.json` | 4 个 App 图标的 base64 原数据 |
| `wrangler.toml` | Wrangler 部署配置 |
| `SKILL.md` | 给 AI 助手看的开发文档（链接格式、部署细节都在里面） |

### 改完重新生成 worker.js

```bash
python3 - << 'EOF'
html = open('index.html', encoding='utf-8').read()
esc = html.replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${')
worker = "const HTML = `" + esc + "`;\n\nexport default {\n  async fetch(request) {\n    const url = new URL(request.url);\n    if (url.pathname === '/health') return new Response('emby-import ok', { status: 200 });\n    return new Response(HTML, { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } });\n  }\n};\n"
open('worker.js', 'w', encoding='utf-8').write(worker)
EOF
node --check worker.js   # 检查语法
```

然后按上面任意一种方法重新部署。

### 常见改动

- **换图标**：把新图标缩到 128px 存成 JPEG，转 base64，替换 `icons.json` 和 `index.html` 里对应的 data URI。
- **加一个新 App**：在 `index.html` 的 App 列表里加一项（名字、图标、链接生成函数）。
- **改某个 App 的导入链接格式**：在 `index.html` 的 `render()` 里找到对应的生成函数，按官方格式改。
- **Reflix 图标还是 🍿 emoji**：等有人发来 Reflix 的官方图标再替换。

## 剪贴板识别规则

点「📋 粘贴识别剪贴板」后，页面会这样解析剪贴板内容：

- 地址 = 第一个 `http(s)` 链接（开户消息里有多条线路时取第一条）
- 用户名 = `用户名称 | xxx`
- 密码 = `用户密码 | xxx`（`安全密码` 不会认错）
- 或者一行三个：`地址 用户名 密码`（空格分隔）

比如 `https://demo.emby.example:443 demo demo1234`，或者整段开户成功的消息，都能直接识别填好。

浏览器不让读剪贴板时会弹出手动粘贴框，粘进去点「识别并填入」就行。

## 隐私

- 密码不上传、不保存，只在浏览器里拼链接用
- 名称、地址、用户名存在浏览器 localStorage，只在你自己的设备上
- 本仓库不含任何真实服务器地址、账号、密码

## License

MIT
