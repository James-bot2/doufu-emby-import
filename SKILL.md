---
name: emby-import
description: Build or maintain the Emby 一键导入站 — a single-page site where a user enters an Emby server address/username/password and gets one-click import links for SenPlayer, Rex, EplayerX, Vidora and Reflix. Covers the per-app import link formats (which are confirmed, which are not), the app icons, clipboard paste recognition, address parsing, privacy rules, and the Cloudflare Worker deploy + domain workflow.
---

# Emby 一键导入站

## Overview

A pure-frontend single page. The user fills in 服务器名称 / 地址 / 用户名 / 密码 and gets, for each of five player apps, a 「一键导入」 button (opens the app's import deep link) and a 「复制链接」 button.

- **Worker:** script `emby-import` (no bindings), custom domain only; workers.dev is off by default (404).
- **Local source (source of truth):** `~/workspace/emby-import/`
  - `index.html` — the page; edit this, never `worker.js` directly
  - `worker.js` — generated from `index.html` (HTML embedded as a template literal)
  - `icons.json` — base64 icon source (128px JPEG data URIs)

## Privacy rules (do not break these)

- **Password is never saved and never uploaded.** Everything runs client-side; the Worker only serves the static page.
- 服务器名称 / 地址 / 用户名 persist in browser localStorage (`embyimp_*` keys) so the user doesn't retype them next visit. Password does not.
- The page must never send the form data anywhere — no fetch/XHR of credentials, no analytics.

## Import link formats

All parameters are `encodeURIComponent`-ed. `address` is the full user-entered URL (may include a port and a path prefix like `/emby`).

### SenPlayer — ✅ confirmed

Source: ProxyHub_Emby source code.

```
senplayer://importserver?type=emby&name=<name>&address=<full URL>&username=<user>&password=<pass>
```

### Rex — ✅ confirmed

Source: ProxyHub_Emby source code. The address is split into scheme / host+path / port.

```
rex://import?type=emby&scheme=<scheme>&host=<host+path>&port=<port>&username=<user>&password=<pass>&title=<name>
```

Default port when the user omits one: `443` for https, `80` for http.

### EplayerX — ✅ confirmed

Source: format supplied by the user (2026-11-06). This is a **universal link** (https), not a custom scheme — the earlier `eplayerx://importserver` only opened the app without showing the add-server page. Supporting evidence: the macOS build (repo `liixing/eplayerx`, v1.2.35) registers scheme `eplayerx` only for callback-style paths (`trakt/callback`, `baidu-callback`, `guangya-callback`, `infuse-success/error`, `pending-emby`) plus an `AddServerDeepLink` type — there is no `importserver` route.

```
https://eplayerx.com/add-or-update?type=emby&href=<full URL>&username=<user>&password=<pass>
```

No `name` parameter.

### Vidora — ✅ confirmed

Source: user screenshotted the in-app "Emby 一键导入教程" (2026-11-06). Earlier attempts `vidora://importserver` and Rex-style `vidora://import` both opened the app but never showed the add-server page. No universal link exists (`vidora.app` doesn't resolve; the dev's support host `yunjie-li.github.io` serves no AASA).

```
vidora://emby/import?server_url=<origin>&server_path=<path prefix or empty>&username=<user>&password=<pass>&name=<name>&primary_endpoint_name=直连&server_remark=<name>&match_enabled=true&auto_connect=false&allow_insecure_https=false&prefer_original_path=false&playback_reminder_enabled=false&playback_reminder_interval_days=20
```

- `server_url` = origin only (`scheme://host:port`), `server_path` = the path prefix (e.g. `/emby`) or empty.
- The tutorial also documents an optional `payload` param (Base64URL-encoded JSON, takes priority over plain params; `backups:[{"remark":"直连","address":"https://…"}]`) and a clipboard template — neither is used by the site.

### Reflix — ❌ unresolved

Correct spelling is **Reflix** (App Store id 6621243955, "Reflix - Emby 播放器与追剧助手", dev 晶晶 许 / MagicGroot). Do not spell it "Refilx" — the earlier `refilx://` scheme was wrong and is why it didn't open at all.

Current site uses `reflix://importserver` (SenPlayer format): it opens the app but **cannot directly import**. No AASA on reflix.app (404; www.reflix.app 301s). Official format still unknown — the next step is the user finding Refilx's in-app import tutorial (like Vidora's) and sending a screenshot; update the format from that.

## Icons

Each app row shows the app's real icon, embedded as a base64 data URI (128px JPEG, ~16KB total for all four).

- Icons were matched against official App Store artwork via the iTunes Search API before embedding, to avoid misassignment:
  - SenPlayer (id 6443975850) = colorful play triangle
  - Rex (id 6801583759) = black C + star on pastel
  - EplayerX (id 6747369377) = green/cyan E-bars + play triangle on black
  - Vidora (id 6756205248) = white/pink "A" + cyan swoosh on black
- **Reflix has no icon yet** — its row still shows the 🍿 emoji placeholder. Swap it in when the user sends the icon image.
- `icons.json` is the base64 icon source. When replacing an icon, resize to 128px JPEG and update both `icons.json` and the data URI in `index.html`.

## Clipboard paste recognition

The 「📋 粘贴识别剪贴板」 button (`#btnPaste`) reads the clipboard via `navigator.clipboard.readText()` and fills address / username / password. If clipboard access is blocked (some in-app webviews), a manual paste box (`#manualPaste` with `#pasteText` + `#btnParse`) is shown instead.

`parseClipboard(text)` rules, in order:

1. **Address** = the first `http(s)` URL in the text (stops at whitespace or CJK characters; trailing punctuation stripped). In a multi-line account message this picks the first line, e.g. 线路00.
2. **Username** = `用户名称 | xxx` (or `用户名 | xxx`).
3. **Password** = `用户密码 | xxx`. The generic `密码 | xxx` fallback must NOT match `安全密码` — the regex requires the character before 密码 to be non-CJK (or start of text).
4. **Simple format**: a line of `地址 用户名 密码` (whitespace-separated, first token a URL) fills whatever fields are still empty.

Verified with Node against both real user examples:

- `https://demo.emby.example:443  demo demo1234` → address `https://demo.emby.example:443`, username `demo`, password `demo1234`
- The long 开户成功 message → address `https://line00.emby.example:8443` (线路00, not 01), username `demo`, password `demoPass123` (not 安全密码 `123456`)

After filling, the page re-renders the generated links and saves address/username to localStorage (password is not saved).

## Address parsing

`parseAddress()` handles: ports, path prefixes (e.g. `https://域名/emby`), and missing protocol (assumes https). It produces the `scheme` / `host` / `port` / `path` parts the Rex and Vidora formats need. Keep the user's raw input as the `address` value for SenPlayer/EplayerX (full URL).

## Edit → deploy workflow

1. Edit `index.html` only.
2. Regenerate `worker.js` from it (escape backslashes, backticks, `${` and wrap as a template literal):
   ```python
   html = open('index.html', encoding='utf-8').read()
   esc = html.replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${')
   worker = "const HTML = `" + esc + "`;\n\nexport default {\n  async fetch(request) {\n    const url = new URL(request.url);\n    if (url.pathname === '/health') return new Response('emby-import ok', { status: 200 });\n    return new Response(HTML, { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } });\n  }\n};\n"
   open('worker.js', 'w', encoding='utf-8').write(worker)
   ```
3. `node --check worker.js`.
4. Deploy via the Cloudflare API (script `emby-import`, module format, `compatibility_date: 2025-11-04`, no bindings):
   ```bash
   # metadata.json: {"main_module":"worker.js","compatibility_date":"2025-11-04","bindings":[]}
   curl -X PUT -H "Authorization: Bearer $CF_TOKEN" \
     "https://api.cloudflare.com/client/v4/accounts/$CF_ACCT/workers/scripts/emby-import" \
     -F "metadata=@meta.json;type=application/json" \
     -F "worker.js=@worker.js;type=application/javascript+module"
   ```
5. Verify live: `curl https://<你部署的域名>/` returns 200 and contains the changed feature (e.g. `btnPaste`, the new link format, the new icon's base64 marker). Verify the four confirmed link formats are present in the served page.

## Domain management quirks (learned the hard way)

- **Adding** a Worker custom domain via API works: `PUT /accounts/{id}/workers/domains` with `{"hostname","service":"emby-import","environment":"production"}`.
- **Deleting** a Worker custom domain via API does **not** work with this API token (`Method not allowed for this authentication scheme`) — same class of limitation as the workers.dev toggle. Delete it in the Cloudflare dashboard instead (browser task: Workers & Pages → emby-import → Settings → Domains → remove; confirm in the dialog).
- For some zones, adding a custom domain via API **fails when `zone_id` is passed** ("zone does not exist") and succeeds when omitted.
- Domain history: the original domain was replaced on 2026-11-06 (old domain removed via the dashboard, new one verified 200). Do not publish your own deployment URL in this repo.
- New Workers deployed via API have workers.dev **off by default** (verified 404).

## Change log

- 2026-11-06: launched; SenPlayer + Rex formats confirmed from ProxyHub_Emby source; EplayerX universal link + Vidora official format added from user material; Reflix unresolved; 4 real icons embedded.
- 2026-11-06: domain changed (old domain removed via dashboard).
- 2026-11-06: 「📋 粘贴识别剪贴板」 button added (clipboard parse + manual fallback; `安全密码` trap handled).
- 2026-11-06: bottom hint paragraph removed (user request).
