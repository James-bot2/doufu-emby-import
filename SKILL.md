---
name: emby-import
description: Build or maintain the Emby 一键导入站 — a single-page site where a user enters an Emby server (one or more routes/lines) + username/password and gets one-click import links for SenPlayer, Rex, EplayerX, Vidora and Reflix, plus Noctra (confirmed), 小幻影视 / Rodel Player (confirmed, Windows-only), Hills, FileBar, VidHub, Lenna, Afusekt, Streama, CapyPlayer and DenPlayer (user-supplied formats), a saved-servers list, and a route speed test. Infuse and Reflix were removed from the page for now (experimental formats didn't work — see their sections). Covers the per-app import link formats (which are confirmed, which are not), multi-route backup params, the speed test (client-side + Worker /speed proxy), the app icons, clipboard paste recognition, address parsing, privacy rules, and the Cloudflare Worker deploy + domain workflow.
---

# Emby 一键导入站

## Overview

A pure-frontend single page. The user fills in 服务器名称 / 线路 / 用户名 / 密码 and gets a 3-column grid of 14 tiles under a 「一键导入」 heading: tap a tile to import (opens the app's import deep link), tap the ⧉ in the tile's corner to copy the link. **Multi-route (2026-11-10):** the form takes one or more Emby routes (主线路/备用线路/…), each with a checkbox; the checked routes are written into the import links — SenPlayer, Rex, EplayerX, Vidora and VidHub carry the extra routes as backups (see their sections), the other 9 apps use the first checked route only. A **⚡ 线路测速** button measures every checked route (3 attempts, best time) and ranks them; tapping a result or 「用最快线路」 switches to that route alone. Design (2026-11-06 skill-guided redesign, per GSAP + taste-skill + impeccable; brief wins: pink + running girl + 3D flip kept): one .wrap, equal edges, no kicker badge (craft-floor ban), no background blobs/sparkles; hero h1 solid (Emby in ink, 一键导入 in solid accent) + lead with the hard fact (14 个播放器); apps is a <section> on the page ground with an h2 (no card wrapping the tiles — no nested cards); footer on the page ground; spacing scale 4/8/12/16/24/32/48, type h1 34 / h2 24 / body 16 / small 14 / labels 13 (500), nothing under 13px. Grid is 3 columns (`repeat(3,minmax(0,1fr))`, 2026-11-06, user: "图标3*3格式可不可以"): 14 tiles. Tiles are vertical (icon on top, name + subtitle centered below, copy button as a small absolute circle in the top-right corner) — a horizontal icon+name row cannot fit a multi-column grid at 390px (names truncated to "S…"/"E…"). At 3 columns each tile is ~99px wide: icon 40px, copy button 22px at top:6/right:6 (so it clears the icon), tile padding 12px 6px 10px; all names (longest "SenPlayer") fit without truncation — verified at 390px via headless-Chromium screenshot of the live page. Palette (verified contrasts): ONE accent, interface 90-95% neutral. Light: bg #FCF6F7 (whisper blush), surface #FFFFFF, ink #2A1D21 (15.2:1 on bg), muted #7C5A66 rose-tinted (5.6:1), accent #DB2777 (white on it 4.6:1, on surface 4.6:1), hairline 14% ink, field #F7EEF1; solid surfaces, no frosted glass; single elevation (soft shadow on cards, hairline on tiles). Dark: bg #1D0A16, surface #26101B, ink #FDF2F7, muted #C9A8B4, accent #F472B6 with dark text #1D0A16 on the button (7.16:1). No gradient text, no violet. Motion (2026-11-06 skill-guided redesign; girl/flip removed 2026-11-06 ~15:20, user: 「小女孩可以去掉」): hover layer ONLY (taste-skill tokens 140/200/90ms, ease cubic-bezier(.2,.8,.2,1)) — tiles lift 2px on hover + press scale .985, buttons step up 1px on hover + sink 1px on press, focus 2px accent ring, fields accent border + 3px soft ring; copy button swaps ⧉ → ✓ (green) for 1.5s. No load entrances, no GSAP (CDN removed), no flip/tilt. The form card is always visible directly under the hero. `prefers-reduced-motion` guard makes all motion instant. 3D flip card (2026-11-06, replaces the splash — user: 「不对 你这个是两个页面了 只有这个我画圈的才是我想要隐藏的」): ONE page; only the form card is hidden, as the BACK of a 3D card whose FRONT is the running anime girl (girl-running.jpg 640px inlined as base64, ~80KB) bobbing (runBob .55s) over a scrolling dashed track + 「👆 点小女孩填写服务器信息」 hint. Tap the girl → the card flips (GSAP rotationY 180, .8s, power3.inOut; CSS class fallback if the GSAP CDN fails) to reveal the form; a 「🙈 藏回小女孩」 button on the form flips it back. The card also tilts in 3D following the pointer (GSAP quickTo rotationX/Y ±8°, like the react-bits box video the user sent); pointer tilt is disabled under prefers-reduced-motion. Structure: .flip-scene (perspective 1200px) > .flip-tilt (preserve-3d) > .flip-inner (grid, both faces grid-area 1/1, preserve-3d) > front (.flip-front.card) + back (.flip-back.card#formCard, rotateY 180). Backdrop-filter is disabled on the flip faces (Safari 3D + backdrop-filter glitch); no CSS entrance on the flip card (would conflict with the back face's rotateY) — the load settle is a GSAP y-only tween on .flip-scene. The girl front and the tiles are keyboard-accessible (tabindex 0, role button, Enter/Space). The form's fields stagger in on flip (fromTo y:16 autoAlpha:0 → y:0 autoAlpha:1, .4s, stagger .035). Hero and apps grid stay visible the whole time; the form's IDs/handlers are untouched. GSAP 3.12.5 loaded from cdnjs; GSAP skills learned from greensock/gsap-skills and saved to ~/workspace/custom-skills/ (8 skills: gsap-core, gsap-utils, gsap-timeline, gsap-performance, gsap-plugins, gsap-react, gsap-scrolltrigger, gsap-frameworks). Lessons: (1) the glow blobs live inside a fixed `overflow:hidden` wrapper (`.bg-decor`); (2) the 2026-11-06 overflow was MISDIAGNOSED as the blobs at first — the real cause was the grid: `grid-template-columns:1fr 1fr` takes its minimum from the tiles' nowrap names (~190px min-content each), forcing the grid to ~394px inside a 318px card and cutting off the right column; the fix is `repeat(2,minmax(0,1fr))` + `min-width:0` on `.tile`. Verified at 390px via headless-Chromium screenshot of the live page (scrollWidth==innerWidth, grid 316px). Never declare an overflow fixed from desktop-width checks alone — the desktop browser here cannot emulate a 390px viewport. All functionality and element IDs are unchanged — the redesign is CSS + header HTML only. Tiles are dimmed and unclickable until an address is filled. Infuse and Reflix were removed from the page 2026-11-06 at the user's request ("先撤下来") — they were disabled first (`disabled:true` tiles), then their APPS entries were removed entirely. Their experimental EPX-style formats are documented in their sections below, so they can be re-added by restoring the APPS entry (the `render()` disabled-tile mechanism is still in the code).

- **Worker:** script `emby-import` (no bindings), custom domain only; workers.dev is off by default (404).
- **Local source (source of truth):** `~/workspace/emby-import/`
  - `index.html` — the page; edit this, never `worker.js` directly
  - `worker.js` — generated from `index.html` (HTML embedded as a template literal)
  - `icons.json` — base64 icon source (128px JPEG data URIs)

## Privacy rules (do not break these)

- **Password is never saved and never uploaded.** Everything runs client-side; the Worker only serves the static page.
- 服务器名称 / 线路 / 用户名 persist in browser localStorage (`embyimp_*` keys) so the user doesn't retype them next visit. Password does not.
- The page must never send the form data anywhere — no fetch/XHR of credentials, no analytics.
- Exception (user's explicit choice, 2026-11-06): the saved-servers list (`embyimp_servers` in localStorage) DOES store passwords, so a saved server can be recalled with one tap. This stays on the user's own device and is never uploaded. The single-value last-used keys (`embyimp_*`) still never store the password.
- **Speed test exception (2026-11-10):** the page fetches the user's own Emby server to measure latency — direct `fetch` (no-cors) to `<route>/System/Info/Public` (public endpoint, no auth) falling back to `/`, and for http routes (which a https page cannot fetch directly) a same-origin `/speed?url=…` Worker proxy that only fetches paths ending in `/System/Info/Public` or `/` and returns `{ok, ms, status}`. No username/password is ever sent in a speed-test request.

## Import link formats

All parameters are `encodeURIComponent`-ed. `address` is the full user-entered URL (may include a port and a path prefix like `/emby`).

### SenPlayer — ✅ confirmed

Source: ProxyHub_Emby source code.

```
senplayer://importserver?type=emby&name=<name>&address=<full URL>&username=<user>&password=<pass>
```

- **Multi-route (2026-11-10):** each extra checked route appends `&address=<url>&backup=<name|url>` (the backup value is `name|url`, URL-encoded as a whole; unnamed routes get `线路2`, `线路3`, …).

### Rex — ✅ confirmed

Source: ProxyHub_Emby source code. The address is split into scheme / host+path / port.

```
rex://import?type=emby&scheme=<scheme>&host=<host+path>&port=<port>&username=<user>&password=<pass>&title=<name>
```

Default port when the user omits one: `443` for https, `80` for http.

- **Multi-route (2026-11-10):** each extra checked route appends `&line<n>=<url>&line<n>title=<name>` (`n` from 1; unnamed routes get `线路2`, `线路3`, …).

### EplayerX — ✅ confirmed

Source: format supplied by the user (2026-11-06). This is a **universal link** (https), not a custom scheme — the earlier `eplayerx://importserver` only opened the app without showing the add-server page. Supporting evidence: the macOS build (repo `liixing/eplayerx`, v1.2.35) registers scheme `eplayerx` only for callback-style paths (`trakt/callback`, `baidu-callback`, `guangya-callback`, `infuse-success/error`, `pending-emby`) plus an `AddServerDeepLink` type — there is no `importserver` route.

```
https://eplayerx.com/add-or-update?type=emby&href=<full URL>&username=<user>&password=<pass>
```

No `name` parameter. Note: EplayerX is an https universal link, so the password in the query string can land in eplayerx.com's server logs (the other 13 apps use local custom schemes). The password was removed from the link on 2026-11-10 for that reason, but the user asked on 2026-11-10 to put it back for convenience — the link carries the password again.

- **Multi-route (2026-11-10):** extra checked routes are joined into one param: `&backupHref=<url1;name1,url2;name2>` (each `url;name`, comma-separated, whole value encoded). The link also carries `&remark=<server name>`.

### Vidora — ✅ confirmed

Source: user screenshotted the in-app "Emby 一键导入教程" (2026-11-06). Earlier attempts `vidora://importserver` and Rex-style `vidora://import` both opened the app but never showed the add-server page. No universal link exists (`vidora.app` doesn't resolve; the dev's support host `yunjie-li.github.io` serves no AASA).

```
vidora://emby/import?server_url=<origin>&server_path=<path prefix or empty>&username=<user>&password=<pass>&name=<name>&primary_endpoint_name=直连&server_remark=<name>&match_enabled=true&auto_connect=false&allow_insecure_https=false&prefer_original_path=false&playback_reminder_enabled=false&playback_reminder_interval_days=20
```

- `server_url` = origin only (`scheme://host:port`), `server_path` = the path prefix (e.g. `/emby`) or empty.
- The tutorial also documents an optional `payload` param (Base64URL-encoded JSON, takes priority over plain params; `backups:[{"remark":"直连","address":"https://…"}]`) and a clipboard template — neither is used by the site.
- **Multi-route (2026-11-10):** each extra checked route appends `&backup=<name|url>` (same `name|url` shape as SenPlayer).

### Reflix — ⏸️ removed from the page for now

Correct spelling is **Reflix** (App Store id 6621243955, "Reflix - Emby 播放器与追剧助手", dev 晶晶 许 / MagicGroot). Do not spell it "Refilx" — the earlier `refilx://` scheme was wrong and is why it didn't open at all.

`reflix://importserver` (SenPlayer format) **opens the app but cannot directly import**. Since 2026-11-06 the site tries the EplayerX-style format instead:

```
reflix://add-or-update?type=emby&href=<full URL>&username=<user>&password=<pass>
```

Removed from the page 2026-11-06 at the user's request ("先把reflix和infuse撤下来") — disabled first ("先禁用吧"), then the APPS entry was removed. The format was never confirmed on a device. To re-add: restore the APPS entry with `reflix://add-or-update?type=emby&href=<full URL>&username=<user>&password=<pass>` (href NOT encoded, like the EPX example) — or with `disabled:true` to show it dimmed first. If it only opens the app when re-tested, the format doesn't work — the next step is the user finding Reflix's in-app import tutorial (like Vidora's) and sending a screenshot. No AASA on reflix.app (404; www.reflix.app 301s).

### Infuse — ⏸️ removed from the page for now

Source: official Firecore API doc https://firecore.com/api (Infuse 8.4.7+, checked 2026-11-06). The documented URL schemes are only `infuse://x-callback-url/play?url=…` (play video), `infuse://x-callback-url/save?url=…` (bookmark video), and deep links to library items (`infuse://movie/{tmdb_id}`, `infuse://series/{tmdb_id}`). There is NO documented add-server / add-share action. At the user's suggestion the site tries the EplayerX-style format:

```
infuse://add-or-update?type=emby&href=<full URL>&username=<user>&password=<pass>
```

Note the `href` value is NOT percent-encoded — it is the raw address, exactly like the user's EPX example (`https://eplayerx.com/add-or-update?type=emby&href=https://www.baidu.com&username=111&password=222`, user-supplied 2026-11-06). The first attempt (2026-11-06) encoded href (`href=https%3A%2F%2F…`) and the user reported "打不开" — possibly Infuse's parser doesn't decode it. firecore.com has NO apple-app-site-association file (checked 2026-11-06, 404), so an `https://firecore.com/add-or-update` universal link cannot open Infuse — the custom-scheme form is the only option.

History: first tried 2026-11-06 (encoded href), user reported "打不开"; reverted to manual (`infuse://`) the same day, but that bare URL has an empty host and Safari rejects it with "网址无效" (user screenshot, 2026-11-06). Tile put back on the EPX-style format with raw href per the user's example. Removed from the page 2026-11-06 at the user's request ("先把reflix和infuse撤下来") — disabled first ("先禁用吧"), then the APPS entry was removed. The EPX-style format was never confirmed on a device. To re-add: restore the APPS entry with `infuse://add-or-update?type=emby&href=<full URL>&username=<user>&password=<pass>` (href NOT encoded, like the EPX example) — or with `disabled:true` to show it dimmed first. If it opens Infuse but doesn't import when re-tested, the format doesn't work; manual add is Settings → Add Files → Emby. Icon: Infuse (id 1136220934, Firecore, bundle `com.firecore.infuse`), official artwork verified via iTunes API, 128px JPEG base64.

### 小幻影视 (Rodel Player) — ✅ confirmed (Windows-only)

Source: official protocol doc https://player.richasy.net/zh/docs/reference/protocol-link/ (checked 2026-11-06). The app registers the `rodelplayer://` protocol; `rodelplayer://import?...` creates a connector config. **A confirmation dialog pops up before import** (unless the user enabled 「跳过协议导入确认」 in Settings). Imported configs are NOT validity-checked — wrong params create a connector that can't log in.

```
rodelplayer://import?type=emby&title=<name>&scheme=<scheme>&host=<host>&port=<port>&path=<path>&username=<user>&password=<pass>
```

- `type=emby`; `title` = server name (blank → auto-generated `Emby-YYYYMMDD_HHMMSS`); `scheme` = http/https; `host` = domain/IP; `port` = port (optional, defaults 80/443); `path` = reverse-proxy path WITHOUT leading slash (e.g. `emby`, not `/emby`); `username` required; `password` optional.
- **All query params must be URL-encoded** (doc's own emphasis) — the site encodes everything except nothing; note the site's `path` strips its leading `/` to match the doc example.
- Multi-line backup lines via `line{n}` + `line{n}title` exist in the doc but are NOT used by the site (single server entry only).
- **Windows-only**: 小幻影视 is a WinUI 3 / .NET 9 Windows app (Microsoft Store). There is no iOS version — on iPhone the tile does nothing. Tile subtitle says 「仅 Windows」.
- Icon: official site logo (player.richasy.net `/_next/static/media/logo.019f09p_0z6mc.png`, 256px RGBA PNG → 128px PNG base64, kept as PNG for transparency).

### Hills — ✅ user-supplied (from the chilledmelon portal)

Source: format + icon supplied by the user (2026-11-06), copied from the chilledmelon.com portal's one-click import template. The portal page itself requires login, so the list could not be pulled directly — the user sends each player's format + icon one by one.

```
hills://import?type=emby&address=<full URL>&scheme=<scheme>&host=<host>&port=<port>&username=<user>&password=<pass>
```

- The template carries BOTH `address` (full URL) and `scheme`/`host`/`port` — the site fills all of them from the parsed address, so whichever the app reads is present.
- Icon: user-supplied image (640px → 128px JPEG base64).

### FileBar — ✅ user-supplied (from the chilledmelon portal)

Source: format + icon supplied by the user (2026-11-06), copied from the chilledmelon.com portal's one-click import template. Same core shape as Vidora's format (origin + path split):

```
filebar://emby/import?server_url=<origin>&server_path=<path prefix or empty>&username=<user>&password=<pass>&name=<name>
```

- `server_url` = origin (scheme://host:port), `server_path` = path prefix (e.g. `/emby`) or empty.
- Icon: user-supplied image (640px → 128px JPEG base64).

### VidHub — ✅ user-supplied (from the chilledmelon portal)

Source: format + icon supplied by the user (2026-11-06), copied from the chilledmelon.com portal's one-click import template. Same address+scheme/host/port shape as Hills:

```
vidhub://import?type=emby&address=<full URL>&scheme=<scheme>&host=<host>&port=<port>&username=<user>&password=<pass>
```

- Icon: user-supplied image (640px → 128px JPEG base64; green/blue S swoosh). This is the VidHub at App Store id 1659622164 (bundle com.mac.utility.media.hub, "VidHub - 高清影片视频播放器") — NOT vidhub.app (id 6761185000, orange icon); the supplied icon matches the former's official artwork exactly.
- **Multi-route (2026-11-10):** same as Rex — each extra checked route appends `&line<n>=<url>&line<n>title=<name>` (`n` from 1).

### Lenna — ✅ user-supplied (from the chilledmelon portal)

Source: format + icon supplied by the user (2026-11-06), copied from the chilledmelon.com portal's one-click import template. Same core shape as Vidora's format (origin + path split):

```
lenna://emby/import?server_url=<origin>&server_path=<path prefix or empty>&username=<user>&password=<pass>&name=<name>
```

- The template shows an empty `server_path=` — that is what an empty path prefix produces; the site fills `p.path` (empty when there is no prefix).
- Icon: user-supplied image (640px → 128px JPEG base64; black chevron + yellow bar), matches official App Store artwork (id 6502967807, bundle com.uvov.Lenna).

### Afusekt — ✅ user-supplied (from the chilledmelon portal)

Source: format + icon supplied by the user (2026-11-06), copied from the chilledmelon.com portal's one-click import template:

```
afusekt://media.server?address=<full URL>&account=<user>&password=<pass>&type=emby
```

- Note: the username param is named `account`, not `username`.
- Icon: user-supplied image (640px → 128px JPEG base64; pink/purple gradient play triangle), matches official App Store artwork (id 6760249287, bundle com.attempt.Afusekt).

### Streama — ✅ user-supplied (from the chilledmelon portal)

Source: format + icon supplied by the user (2026-11-06), copied from the chilledmelon.com portal's one-click import template. SenPlayer shape:

```
streama://importserver?type=emby&name=<name>&address=<full URL>&username=<user>&password=<pass>
```

- Icon: user-supplied image (640px → 128px JPEG base64; black circle, white play triangle) — assigned by elimination: the other three images from the same batch matched their apps' official artwork exactly, so this one is Streama's. It does NOT match the App Store "Streama: IPTV Player & M3U" artwork (id 6757682425, black "Stre ama" text logo) — if the tile icon looks wrong, ask the user to confirm.

### CapyPlayer — ✅ confirmed (official docs)

Source: format + icon supplied by the user (2026-11-06); the user then sent the official docs (https://capyplayer.feifeiduck.com/en/dev/widget/deep_links), which supersede the printf example. Unlike every other app, the server goes in as base64url JSON, not query params:

```
com.feifeiduck.capyplayer://add-resource?data=<base64url of {"serverType":"emby","host":"<host>","port":<port>,"username":...,"password":...,"https":<bool>,"path":...}>
```

- Fields: `serverType` = "emby", `host` = hostname, `port` = number, `https` = boolean; `username`, `password`, `path` are OPTIONAL and only included when present (the docs' JS example adds them conditionally; `path` = e.g. `/emby`). The user's printf example only showed host/port/https — the docs show the full field set, so credentials DO import (no manual login needed).
- Encoding is **base64url** (RFC 4648: `-` for `+`, `_` for `/`, no `=` padding), NOT standard base64. Verified in Node against the docs' exact example vector (host 192.168.1.100, port 8096, admin/pass#word, https true) — output matches character-for-character.
- A `b64u()` helper (TextEncoder + btoa + base64url replacements) was added next to `enc()` for this.
- Icon: user-supplied capybara image (640px → 128px JPEG base64).

### DenPlayer — ✅ confirmed (user-supplied)

Source: format + icon supplied by the user (2026-11-08). `server_url` carries the FULL address (origin + path prefix), `server_path` is always empty:

```
denplayer://emby/import?server_url=<full address>&server_path=&username=<username>&password=<redacted>&name=<server name>
```

- All params are `encodeURIComponent`-ed. `server_url` = `p.address` (the full user-entered URL, including any `/emby` path prefix); `server_path` is a literal empty value in the template, not a placeholder.
- Icon: user-supplied clapperboard image (640px → 128px JPEG base64).

### Noctra — ✅ confirmed

Source: format supplied by the user (2026-11-06), already confirmed.

```
noctra://server/import?provider=emby&url=<full URL>&username=<user>&password=<pass>&name=<name>
```

- `url` = the full address (origin + path prefix, e.g. `https://host:443/emby`).
- Opening the link goes to Noctra's review page — the user taps 「导入所选」 to connect and save. Nothing is written silently.
- Password is only composed into the link in the browser, never uploaded or saved (same as the other apps).
- Icon: user-supplied current App Icon (1024px → 128px JPEG base64).

## Icons

Each app row shows the app's real icon, embedded as a base64 data URI (128px JPEG, ~4-5KB each after the 128px resize; Rodel's logo is PNG, ~13KB, kept for transparency).

- Icons were matched against official App Store artwork via the iTunes Search API before embedding, to avoid misassignment:
  - SenPlayer (id 6443975850) = colorful play triangle
  - Rex (id 6801583759) = black C + star on pastel
  - EplayerX (id 6747369377) = green/cyan E-bars + play triangle on black
  - Vidora (id 6756205248) = white/pink "A" + cyan swoosh on black
  - Infuse (id 1136220934) = official Firecore artwork, verified via iTunes API
  - Noctra = user-supplied current App Icon (1024px → 128px JPEG)
  - 小幻影视 = official site logo (256px RGBA PNG → 128px PNG, kept as PNG for transparency)
  - Hills = user-supplied icon image (640px → 128px JPEG)
  - FileBar = user-supplied icon image (640px → 128px JPEG)
  - VidHub = user-supplied icon image (640px → 128px JPEG; green/blue S)
  - Lenna = user-supplied icon image (640px → 128px JPEG; black chevron + yellow bar)
  - Afusekt = user-supplied icon image (640px → 128px JPEG; pink/purple play triangle)
  - Streama = user-supplied icon image (640px → 128px JPEG; black circle, assigned by elimination)
  - CapyPlayer = user-supplied capybara image (640px → 128px JPEG)
  - DenPlayer = user-supplied clapperboard image (640px → 128px JPEG)
- **Reflix has no icon yet** — its row still shows the 🍿 emoji placeholder. Swap it in when the user sends the icon image.
- `icons.json` is the base64 icon source. When replacing an icon, resize to 128px JPEG and update both `icons.json` and the data URI in `index.html`.

## Clipboard paste recognition

The 「📋 粘贴识别剪贴板」 button (`#btnPaste`) reads the clipboard via `navigator.clipboard.readText()` and fills address / username / password. If clipboard access is blocked (some in-app webviews), a manual paste box (`#manualPaste` with `#pasteText` + `#btnParse`) is shown instead.

`parseClipboard(text)` rules, in order:

1. **Routes** = ALL `http(s)` URLs in the text (stops at whitespace or CJK characters; trailing punctuation stripped; duplicates removed). Each URL takes its name from the text before it on the same line — `主线路：URL`, `备用线路 | URL`, `线路1 | URL` — or from a label on the line above it (`主线路` alone on a line, then the URL on the next line). A glued CJK suffix (`https://…com国内直连`) is cut at the host. The single-address label (`地址 …`) is stripped, so a lone address gets no name.
2. **Username** = `用户名称 | xxx` (or `用户名 | xxx`).
3. **Password** = `用户密码 | xxx`. The generic `密码 | xxx` fallback must NOT match `安全密码` — the regex requires the character before 密码 to be non-CJK (or start of text).
4. **Simple format**: a line of `地址 用户名 密码` (whitespace-separated, first token a URL) fills whatever fields are still empty.

Verified with Node against both real user examples:

- `https://demo.emby.example:443  demo demo1234` → address `https://demo.emby.example:443`, username `demo`, password `demo1234`
- The long 开户成功 message → address `https://line00.emby.example:8443` (线路00, not 01), username `demo`, password `demoPass123` (not 安全密码 `123456`)

After filling, the page re-renders the generated links and saves address/username to localStorage (password is not saved).

## Multi-route (2026-11-10)

The single 「Emby 地址」 input was replaced by a routes list. Each route row has a checkbox (include in import), a name field (e.g. 主线路 / 备用线路), a URL field, and a ✕ delete (at least one route is kept). 「＋ 添加线路」 appends a row. The first checked route is the primary — it supplies the address/scheme/host/port/path for every app; the checked extras are appended as backups only for the five apps that support them (SenPlayer `address=`+`backup=name|url`, Rex `line<n>`+`line<n>title`, EplayerX `backupHref=url;name,…`, Vidora `backup=name|url`, VidHub `line<n>`+`line<n>title`). The other 9 apps use the primary route only. Unchecking a route removes it from the links; the header shows `共 N 条，已勾选 M 条`.

- State: `routes` array `[{name, url, checked}]`, persisted to localStorage `embyimp_routes`; the old single-value `embyimp_address` is read once as the initial route if no routes are stored.
- `parseRoutes(text)` extracts routes + names (see Clipboard section); `parseClipboard` now returns `{routes, username, password}`.
- `collect()` returns the primary parsed address parts plus `routes` (checked only); each app's `build(p, routes)` takes the routes as a second argument. `routeName(r, idx)` returns the route's name or `线路<idx+1>`.
- Saved servers store routes (see Saved servers section); old entries are migrated on load.

## Speed test (2026-11-10)

「⚡ 线路测速」 tests every checked route and ranks them by latency.

- Each route is measured 3 times; the best (lowest) time wins. Probe order per attempt: `<route>/System/Info/Public` (Emby's public endpoint, no auth), then `<route>/` on failure. Only the response headers are awaited — the body is never read. Single-request timeout 5s; a first-attempt timeout gives up early.
- **https routes** are measured from the device: `fetch(url, {mode:'no-cors', cache:'no-store'})` — the opaque response still resolves when headers arrive, so the timing is real device-to-server latency. If direct measurement fails, it falls back to the Worker proxy.
- **http routes** cannot be fetched from an https page (mixed content), so they are measured through the Worker: `GET /speed?url=<encoded probe URL>`. The Worker (see build.py) only allows `http:`/`https:` URLs whose path ends in `/System/Info/Public` or `/`, fetches with a 5s timeout and `redirect: 'manual'`, and returns `{ok, ms, status}` or `{ok:false, error}`. It never receives credentials.
- Results panel (`#speedSection`): summary (可用线路 / 最快 / 中位延迟), rows ranked fastest-first with rank, route name, host, ms + grade (快 <300ms / 一般 <800ms / 慢 / 不可用 + `比最快慢 Xms`), and a `· 节点测` tag for Worker-measured routes. Tap any row to use only that route (it becomes the first checked route); 「⚡ 用最快线路」 does the same for the fastest; 「↻ 只重测失败」 re-runs only the failed routes; 「复制结果」 copies a ranked text summary. Rows show `正在测量…` progress via `测速中 n/m` in the header.
- Verified: Node tests for the Worker `/speed` endpoint (valid endpoint → ok+ms, root path → ok, ftp/non-Emby path → rejected, unreachable host → ok:false) and a headless-Chromium screenshot of the results panel at 390px.

## Rule sync / 分流同步 (2026-11-10)

A 「分流同步」 page reached from the bottom tab bar (the site is split into two views — see "Two pages" below). It turns the saved servers' routes into proxy rules, grouped by keywords, and exports them as files or to a private Gist. (From the Scripting Emby tool the user sent — its third feature, after multi-route + speed test.)

### Two pages (2026-11-10)

The site is two views in one page, switched by a fixed bottom tab bar (`.tabbar`, two buttons: ⬇️ 一键导入 / 🔀 分流同步， active tab in accent). **一键导入** (`#view-import`) holds the hero + form card + apps grid; **分流同步** (`#view-routing`, `hidden` by default) holds the routing section. The footer lines and the three routing modals (group editor, batch manage, library speed test) sit outside both views, so they work on either page. `setView(v)` toggles the views' `hidden`, updates the active tab + `aria-current`, remembers the choice in localStorage `embyimp_view`, updates the URL hash via `history.replaceState` (`#import` / `#routing`), re-runs `renderRouting(true)` when entering the routing view, and scrolls to the top. Initial view: `#routing` hash wins, else the stored view, else import. Body bottom padding is `calc(96px + safe-area)` so the fixed tab bar never covers content. Verified: 25 Node tests (structure, switching, hash, stored view, renderRouting call, scroll) + 390px screenshots of both views and the tab bar (active state on each).

### How-to tutorial (2026-11-10)

The routing page has a collapsible `<details class="rt-howto">` ("📖 怎么用分流同步", collapsed by default) right under the section subtitle, with 7 numbered steps: (1) save servers first on the import page; (2) read the four groups; (3) edit a group — keywords (type region names), policy (type your own policy-group name, e.g. 新加坡手动 / 美国）, match capsule; (4) per-host overrides; (5) generate + import the rule files per tool (Surge `.sgmodule` with the EmbyProxy parameter, Shadowrocket `.sgmodule`, Egern YAML, Loon `.plugin` with the policy group picked in plugin details, QX `.list`, Stash/Clash YAML as a rule set); (6) optional Gist sync (create a `gist`-scoped token, paste it in the page, sync to a private Gist, use the raw URLs); (7) privacy — only domains go to Gist, no usernames/passwords, the token stays in the browser and only goes to api.github.com, saved servers/passwords never upload. The same tutorial is in README.md under 分流同步. **Privacy rule for the tutorial: it contains no real addresses, no deployment domain, no tokens — only generic policy names (新加坡手动 / 美国） and the keyword examples (美国 日本 新加坡）. The scrub check before every push must confirm the tutorial has no real domain.**

- **Source:** all routes of all saved servers (`embyimp_servers`) plus the current form's checked routes, deduplicated by hostname (port and path stripped — rules match hosts only).
- **Groups (in match order, stored as an array in `embyimp_routing_groups`):** 直连 → DIRECT, keywords 直连/直链/direct; 代理 → Proxy, keywords 代理/中转/加速/relay/proxy; CF 线路 → Proxy, keywords cf/cloudflare/优选/官方； 兜底 → Proxy, no keywords (catch-all, always last). Matching is case-insensitive against the route name + server name. Each group has: name, enable toggle, policy (DIRECT / Proxy / any custom policy-group name — see below), QX policy (follow / DIRECT / Proxy / any custom name), keywords, match type (DOMAIN/DOMAIN-SUFFIX). Default match is DOMAIN for the first three groups, DOMAIN-SUFFIX for 兜底. Disabled groups are skipped in matching. The old storage format `{groupId:[keywords]}` is migrated automatically (keywords merged into the defaults).
- **Custom policy names (2026-11-10):** a group's 策略 is a free-text field, not a fixed DIRECT/Proxy choice — the user (and other users) have their own Surge policy-group names. Type any name (e.g. 新加坡手动， 日本手动， 美国， 香港）; the input offers a datalist (`#rtPolicyList` / `#rtQxList`) with DIRECT, Proxy and the countries from the user's Surge policy groups （新加坡， 新加坡手动， 日本， 日本手动， 韩国， 韩国手动， 香港， 台湾， 美国， 中国， 便宜流量）. Stored as `policy` (normalized: `direct` → `DIRECT`, `proxy` → `PROXY`, anything else kept verbatim) and `qx` (normalized: empty / 跟随 / 跟随策略 → `follow`, `direct` → `DIRECT`, `proxy` → `PROXY`, else verbatim). Display uses `rtPolicyLabel` (`DIRECT` → `DIRECT`, `PROXY` → `Proxy`, custom → the name). Rule generation (`rtPolicyFor`): DIRECT stays DIRECT everywhere; a generic PROXY uses the Surge `%EmbyProxy%` parameter / Egern `Proxy` / `PROXY` elsewhere; a custom name is written literally into Surge, Shadowrocket, Egern, QX (when following) and Stash/Clash rules, while Loon still maps every non-DIRECT to `PROXY` (the plugin's selected policy group). Old stored `PROXY` values keep the generic behavior.
- **Layout (2026-11-10, per the reference screenshot):** the section is split into labelled blocks — 「线路管理」 (two rows: 批量管理线路 / 调整策略组 and 整库线路测速）, then 「分流方式」 (the four groups as rows + an 编辑分组 link at the bottom), then the tools/files/sync card. Each group row shows: an icon (green → for 直连， 🌐 for the others), `name → policy` (e.g. 直连 → DIRECT), a status on the right (`未命中` when no host matches, otherwise `N 个域名`), a match capsule (`DOMAIN ⇄` / `DOMAIN-SUFFIX ⇄`, tap to toggle the group's match type), a 关键词 line (omitted for 兜底）, and a chevron. Tapping a row expands it: the matched host rows, then a 策略 row (a text input showing the group's policy — type any policy-group name, e.g. 新加坡手动， with the `#rtPolicyList` datalist; blur/Enter saves via `rtSetGroupPolicy`) and a QX 策略 row (a text input, empty = 跟随「<group policy>」; type a name to override, saved via `rtSetGroupQx`), and — for a group with no keywords — the note "ⓘ 这个分组还没有关键词，所以不会匹配到任何域名。"
- **Group editor:** 「⚙️ 编辑分组」 opens a bottom-sheet editor with one card per group: rename, enable toggle, ↑/↓ reorder (fallback stays last), policy text input (with the `#rtPolicyList` datalist), QX text input (with the `#rtQxList` datalist, empty = 跟随策略）, keywords (space-separated), and a DOMAIN / DOMAIN-SUFFIX segmented control. Changes save immediately to `embyimp_routing_groups`.
- **Inline keyword editing (2026-11-10):** each group's expanded view has a 关键词 input row (label 关键词 + a text field showing the group's current keywords, placeholder `空格分隔，如 美国 日本 新加坡`). Typing region names (e.g. 美国 日本 新加坡） and blurring/pressing Enter saves them to that group (`embyimp_routing_groups`) and re-matches hosts immediately — routes named with those words move into the group. Keywords split on spaces, commas and CJK separators (，、). The group editor modal edits the same data.
- **Batch manage （批量管理线路 / 调整策略组）:** opens a modal listing ALL routes (every saved server's routes + the current form's checked routes, deduplicated by URL). Each row has a checkbox, route name, host · server, and a policy badge (tap to switch that host's override between the group's policy and DIRECT; a group set to DIRECT switches to generic Proxy). Batch actions: 全选， 设为直连， 设为代理， 恢复自动 (applies to the checked rows; setting a route to its group's policy clears the override back to auto). Overrides are stored per host in `embyimp_routing_overrides`, so routes sharing a host share the setting. A ⚙️ 编辑分组 button at the bottom jumps to the group editor.
- **Library speed test （整库线路测速）:** measures every route from `rtCollectRoutes()` (same `testOneRoute` as the form's speed test — 3 attempts, best wins, https from the device, http via the Worker `/speed` proxy), shows the ranked results in a modal (rank, name, host, ms + grade, `· 节点测` tag). Tapping a row — or 「⚡ 用最快线路」 — loads that route's server into the form via `rtLoadRouteIntoForm(url)` (finds the saved server containing the URL, fills the form, checks only that route; falls back to checking only the matching form route). 「复制结果」 copies a ranked text summary.
- **Per-host override:** each host row shows its effective policy (DIRECT / Proxy / custom-name badge) and type (DOMAIN/DOMAIN-SUFFIX capsule). Tap the policy badge to switch between the group's policy and DIRECT (a DIRECT group switches to generic Proxy); tap the capsule to toggle DOMAIN ↔ DOMAIN-SUFFIX. Overrides persist in localStorage `embyimp_routing_overrides` keyed by host.
- **Output (6 tools, 7 files, toggleable, default all):**
  - Surge → `emby-proxy-surge.sgmodule` (module): header `#!name=Emby Proxy`, `#!desc=…`, `#!arguments=EmbyProxy=PROXY`, then `[Rule]` with `DOMAIN,host,DIRECT` for direct rules and `DOMAIN,host,%EmbyProxy%` for generic-proxy rules — the EmbyProxy parameter lets the user change the proxy policy inside the module after import. A group with a custom policy name (e.g. 新加坡手动） writes that name literally (`DOMAIN,host,新加坡手动`). (Surge module rules can only use internal policies literally, so the parameter placeholder is the workaround; Surge does text replacement of `%EmbyProxy%` before applying.)
  - Shadowrocket → `emby-proxy.sgmodule` (module): same header without arguments, `[Rule]` with literal `PROXY` for generic-proxy rules and the custom name literally for custom-policy groups.
  - Egern → `emby-proxy-egern.yaml`: a `rules:` list, each entry `- domain:` / `- domain_suffix:` with `match:` and `policy:` (`DIRECT`, or `Proxy` for generic-proxy, or the custom name literally — Egern's group name is capital-P `Proxy`).
  - Loon → `emby-proxy.plugin` (plugin): header `#!name=Emby Proxy` + `[Rule]` with `DIRECT`/`PROXY` — in a Loon plugin, PROXY means the user-selected policy group (picked in the plugin details); non-DIRECT rules all use PROXY, even for custom-policy groups.
  - Quantumult X → `emby-proxy-qx.list`: `host,host,DIRECT` / `host-suffix,host,PROXY`, using each group's QX policy (follow → the group's policy, so a custom group policy or a custom QX name is written literally).
  - Stash / Clash → `emby-proxy-stash.yaml` + `emby-proxy-clash.yaml` (same content): Clash payload YAML (`payload:` list of `- DOMAIN,host,DIRECT` / `- DOMAIN-SUFFIX,host,PROXY`, with custom policy names written literally).
  「⬇ 下载全部」 downloads each selected file (staggered 350ms); each file row also has its own 复制 / 下载; 「复制全部」 copies all selected files with `# filename` headers.
- **Sync status:** the section shows 域名 X 个（来自 N 个服务器）, 本地更新时间 (last time the rule content was regenerated), Gist 更新时间 (last successful Gist sync, or 还没上传 Gist), and a 同步到 selector （本地 + Gist / 仅本地 / 仅 Gist, stored in `embyimp_rt_sync_dest`). 「↻ 立即同步」 downloads the files (for 本地） and/or runs the Gist sync. Note under the button: 策略可填任意策略组名（如 新加坡手动、美国）：通用 Proxy 时 Surge 模块用 EmbyProxy 参数，导入后在模块里就能改；填了具体名字时会直接用那个名字。Loon 插件在插件详情里选策略组；Shadowrocket / Egern 直接使用各分组和「兜底」里填的策略。
- **Gist sync:** the page calls the GitHub Gist API directly from the browser (`POST /gists` to create, `PATCH /gists/{id}` to update, private Gist, one file per selected tool). The token is entered in the page and stored in localStorage `embyimp_gist_token`; the Gist ID in `embyimp_gist_id` (auto-filled after first sync); the owner login in `embyimp_gist_owner` (from the API response); the auto-sync toggle in `embyimp_gist_auto` (syncs when a server is saved or deleted). The token only ever goes to api.github.com, never to the site's own server. **The token needs the `gist` scope** — a repo-only PAT cannot create gists. After a successful sync, the 「一键导入（Gist）」 block shows the raw URL of each file (`https://gist.githubusercontent.com/<owner>/<gist-id>/raw/<filename>`) with a 复制地址 button — GitHub caches raw Gist content for ~5 minutes.
- **Refresh:** `renderRouting()` re-runs whenever routes change (`renderRoutes`, route name/url input) or saved servers change (`refreshSaved`), with a signature check to skip redundant rebuilds. An early `refreshSaved()` call that ran before the routing code was defined once crashed the page (RT_GROUPS undefined) — it was removed; the init block's own `refreshSaved()` covers it.
- Verified: 64 Node tests (default groups, old-format migration, matching incl. disabled/reordered groups, host collection, per-host overrides, per-format policy mapping, all 6 formats incl. suffix forms, old tool-id migration, Gist import links) + 42 Node tests for the four-group layout (route collection/dedupe, group match/policy/QX toggles, batch set/auto, batch list + group row rendering incl. expanded 策略/QX rows and the no-keywords note, load-route-into-form, Surge regression) + 24 Node tests for inline keyword editing (region routes move from fallback to proxy after typing 美国 日本 新加坡， re-rendered keywords/status, comma/CJK separators, direct-group input, Surge regression) + 50 Node tests for custom policy names (normalization, per-format literal output incl. Surge/Shadowrocket/Egern/QX/Clash, Loon still unified PROXY, QX follow + custom QX name, generic-PROXY backward compat, expanded + editor inputs incl. datalist, host-badge cycling with a custom group policy, old stored PROXY loads) + 11 Node tests for the group editor rendering the 策略/QX text inputs (values, datalists, typing saves) + headless-Chromium screenshots of the section, the expanded groups (incl. the custom-policy 代理 → 新加坡手动 row), the batch modal and the library-speed modal at 390px, plus a DOM dump confirming the editor modal opens with the 策略/QX inputs and country datalists. Deployed live and verified (200, page contains rtPolicyList/rtQxList/新加坡手动， /speed still ok).

## Saved servers (localStorage)

Added 2026-11-06 (user request). A 「已保存的服务器」 dropdown above the form, with 💾 保存 / 删除 buttons.

- Storage: `embyimp_servers` in localStorage — JSON array of `{name, routes, username, password, updatedAt}`, newest first, capped at 200 entries (raised from 20 on 2026-11-06 — 20 was an arbitrary cap, not a browser limit; localStorage holds ~5MB, hundreds of entries are fine). **2026-11-10: the entry format changed from `{name, address, …}` to `{name, routes:[{name, url, checked}], …}`**; `migrateServer()` converts old entries on load (`address` → a single checked route). The dropdown shows `name · first-route-url` plus `（N 线路）` when there is more than one.
- 💾 保存: saves the current form (requires at least one checked route + username). Same first-route+username updates the existing entry instead of duplicating.
- Select an entry: fills name/routes/username/password into the form and re-renders the links; also refreshes the single-value last-used keys.
- 删除: removes the selected entry.
- Passwords ARE stored here (plain text in the user's own browser localStorage) — the user's explicit choice, so saved servers can be recalled with one tap. Never upload this list anywhere.
- D1 alternative (considered 2026-11-06, not implemented): storing the list in Cloudflare D1 would remove the cap entirely, but passwords would leave the device and sit in the D1 database in plain text, and the site has no login — rows would need a per-device key (`embyimp_uid`, random UUID in localStorage) so different visitors don't see each other's servers. It still wouldn't sync across devices unless the user copies a sync code. Only worth it for cross-device sync.

## Address parsing

`parseAddress()` handles: ports, path prefixes (e.g. `https://域名/emby`), and missing protocol (assumes https). It produces the `scheme` / `host` / `port` / `path` parts the Rex and Vidora formats need. Keep the user's raw input as the `address` value for SenPlayer/EplayerX (full URL).

## Edit → deploy workflow

1. Edit `index.html` only.
2. Regenerate `worker.js` with `python3 build.py` (inlines index.html + the PWA icons/manifest; see the PWA section).
3. `node --check worker.js`.
4. Deploy via the Cloudflare API (script `emby-import`, module format, `compatibility_date: 2025-11-04`, no bindings):
   ```bash
   # metadata.json: {"main_module":"worker.js","compatibility_date":"2025-11-04","bindings":[]}
   curl -X PUT -H "Authorization: Bearer $CF_TOKEN" \
     "https://api.cloudflare.com/client/v4/accounts/$CF_ACCT/workers/scripts/emby-import" \
     -F "metadata=@meta.json;type=application/json" \
     -F "worker.js=@worker.js;type=application/javascript+module"
   ```
5. Verify live: `curl https://embyimport.example.com/` returns 200 and contains the changed feature (e.g. `btnPaste`, the new link format, the new icon's base64 marker). Verify the four confirmed link formats are present in the served page.

## GitHub sync (public repo https://github.com/James-bot2/doufu-emby-import)

- The repo is public and must contain only fake examples — never the real deploy domain, real server addresses, tokens or passwords. Before every push, grep the files for the real domain and scrub it (the repo SKILL.md once carried the real domain in the deploy workflow and domain history; it is scrubbed to `embyimport.example.com`).
- Push through the `custom.github` connector, never with a raw token. The helper `~/workspace/custom-connectors/custom.github/bin/gh_push_commit.py <repo-dir> <owner/repo> <branch> [commit-sha]` replicates one local commit via the Git Data API (same message, parent and contents; the pushed SHA differs from the local one). It aborts when the remote branch is not at the local commit's parent.
- The helper sets author and committer to the anonymous address `James-bot2 <181863722+James-bot2@users.noreply.github.com>`. The API otherwise defaults both to the token owner's real email, which once leaked into a public commit and had to be fixed with a replacement commit. Verify author and committer after every push.
- The local source of truth (`~/workspace/emby-import/`) is not a git repo; clone to /tmp, copy the changed files in, commit with the anonymous author, then push with the helper — and do the clone, commit and push in one turn, because /tmp is ephemeral.

## Add to Home Screen (PWA, 2026-11-06)

The site behaves like a standalone app when added to the home screen (user: "添加到桌面可以打包成软件那种吗").

- Head tags in index.html: `apple-mobile-web-app-capable`, `mobile-web-app-capable`, `apple-mobile-web-app-status-bar-style: black-translucent`, `apple-mobile-web-app-title`, `theme-color #FDF2F7`, `<link rel="apple-touch-icon" href="/apple-touch-icon.png">`, `<link rel="manifest" href="/manifest.json">`.
- The Worker serves the extra routes (no separate hosting): `/manifest.json` (name "Emby 一键导入", short_name "Emby导入", display standalone, pink theme/background), `/apple-touch-icon.png` (180px), `/icon-192.png`, `/icon-512.png`.
- Icons: generated with PIL (pink diagonal gradient #F472B6 → #DB2777 + white play triangle), stored as `apple-touch-icon.png` (180px), `icon-192.png`, `icon-512.png` in the repo dir; `build.py` base64-inlines them into worker.js.
- `build.py` replaces the old inline regeneration snippet: it reads index.html + the three PNGs and writes worker.js. Workflow is now: edit index.html (and icons if changed) → `python3 build.py` → `node --check worker.js` → deploy → verify live (page 200 + manifest.json 200 + icon routes 200).
- iOS caveat: a home-screen web app has SEPARATE storage from Safari — saved servers (localStorage `embyimp_servers`) do NOT carry over; the user must re-enter and re-save once inside the app version. No service worker, so it still needs internet on open.

## Domain management quirks (learned the hard way)

- **Adding** a Worker custom domain via API works: `PUT /accounts/{id}/workers/domains` with `{"hostname","service":"emby-import","environment":"production"}`.
- **Deleting** a Worker custom domain via API does **not** work with this API token (`Method not allowed for this authentication scheme`) — same class of limitation as the workers.dev toggle. Delete it in the Cloudflare dashboard instead (browser task: Workers & Pages → emby-import → Settings → Domains → remove; confirm in the dialog).
- For the `your-zone.example.org` zone, adding a custom domain via API **fails when `zone_id` is passed** ("zone does not exist") and succeeds when omitted.
- Domain history: `emby.example.org` (2026-11-06 launch) → replaced by `embyimport.example.com` (2026-11-06, user request); the old domain was removed via the dashboard and verified dead, the new one verified 200.
- New Workers deployed via API have workers.dev **off by default** (verified 404).

## Change log

- 2026-11-06: launched at `emby.example.org`; SenPlayer + Rex formats confirmed from ProxyHub_Emby source; EplayerX universal link + Vidora official format added from user material; Reflix unresolved; 4 real icons embedded.
- 2026-11-06: domain changed to `embyimport.example.com` (old domain removed via dashboard).
- 2026-11-06: 「📋 粘贴识别剪贴板」 button added (clipboard parse + manual fallback; `安全密码` trap handled).
- 2026-11-06: bottom hint paragraph removed (user request).
- 2026-11-06: Infuse added (manual — no import API per firecore.com/api; row opens `infuse://`, real icon embedded). Saved-servers feature added (`embyimp_servers`, up to 200 entries, passwords stored locally by user choice). Cap raised 20→200 on 2026-11-06; D1 discussed but not used — server-side storage would put passwords in the D1 database and needs a per-device key to keep visitors' servers separate (see Saved servers section).. GitHub NOT synced yet — user said to sync only when it is perfect.
- 2026-11-06: Infuse and Reflix switched to the EplayerX-style format (`<scheme>://add-or-update?type=emby&href=&username=&password=`), both marked 待验证 pending the user's tap-test. Same day: Infuse format reported "打不开" (unclear exactly what happened), reverted to manual (`infuse://`) — but bare `infuse://` has an empty host and Safari rejects it with "网址无效" (user screenshot). User then gave the exact EPX example (`https://eplayerx.com/add-or-update?type=emby&href=https://www.baidu.com&username=111&password=222`, href NOT encoded) and said Infuse is just a prefix change — tile put back on `infuse://add-or-update` with RAW href. firecore.com has no AASA file, so no https universal link can open Infuse. Both tiles disabled, then removed from the page 2026-11-06 at the user's request.
- 2026-11-06: visual redesign — gradient background + blurred blobs, frosted-glass cards, gradient badge/title/button, press-scale tiles, footer trust line; CSS + header HTML only, all IDs and JS logic untouched.
- 2026-11-06: FileBar added — user-supplied format `filebar://emby/import?server_url=&server_path=&username=&password=&name=` (from the chilledmelon portal template; same origin+path split as Vidora) + user-supplied icon.
- 2026-11-06: Hills added — user-supplied format `hills://import?type=emby&address=&scheme=&host=&port=&username=&password=` (from the chilledmelon portal template) + user-supplied icon.
- 2026-11-06: 小幻影视 (Rodel Player) added — official format `rodelplayer://import?type=emby&title=&scheme=&host=&port=&path=&username=&password=` (protocol doc; confirmation dialog before import; Windows-only, tile says 「仅 Windows」; logo from the official site).
- 2026-11-06: layout changed from one-row-per-app list to a 2-column grid under a 「一键导入」 heading (tap tile = import, ⧉ in the corner = copy link; tiles dim when no address is filled, Infuse tile always active).
- 2026-11-06: Noctra added (confirmed format `noctra://server/import?provider=emby&url=&username=&password=&name=`; review page, tap 「导入所选」 to save; icon from user-supplied App Icon).
- 2026-11-06: VidHub, Lenna, Afusekt, Streama added — user-supplied chilledmelon templates + icons (VidHub = `vidhub://import?...&address=&scheme=&host=&port=&username=&password=`; Lenna = `lenna://emby/import?server_url=&server_path=&username=&password=&name=`; Afusekt = `afusekt://media.server?address=&account=&password=&type=emby`; Streama = `streama://importserver?type=emby&name=&address=&username=&password=`). Icons verified against App Store artwork: VidHub = id 1659622164 (green S, not vidhub.app's orange icon), Lenna = id 6502967807, Afusekt = id 6760249287; Streama's icon assigned by elimination (does not match the App Store Streama artwork).
- 2026-11-06: CapyPlayer added — user-supplied format `com.feifeiduck.capyplayer://add-resource?data=<base64 JSON>` + user-supplied capybara icon. First implemented from the user's printf example (standard base64, no credentials — tile briefly said 「需手动登录」); then corrected from the official docs (https://capyplayer.feifeiduck.com/en/dev/widget/deep_links): encoding is base64url, and username/password/path are supported optional fields, so credentials import and the tile is back to 「一键导入」.
- 2026-11-08: DenPlayer added — user-supplied format `denplayer://emby/import?server_url=<full address>&server_path=&username=&password=&name=` + user-supplied clapperboard icon (640px → 128px JPEG). `server_url` is the full address, `server_path` always empty. Page is now 14 tiles; hero updated to 「14 个播放器」. Deployed live and verified (200, all 14 formats present).
- 2026-11-10: EplayerX password removed from its link (privacy fix), then reverted the same day at the user's request — the link carries the password again for convenience. The https-URL log risk is noted above.
- 2026-11-10: **多线路 + 线路测速** (from the Scripting Emby tool the user sent — its two best features). Multi-route: the address input became a routes list (checkbox + name + URL + ✕, 「＋ 添加线路」); paste recognition extracts ALL URLs with their names (主线路/备用线路/线路N, `名 | URL`, `名：URL`, label on the line above, glued CJK cut at the host); the 5 apps that support backups carry the extra routes (SenPlayer `backup=name|url`, Rex/VidHub `line<n>`+`line<n>title`, EplayerX `backupHref=url;name,…` + `remark=`, Vidora `backup=name|url`), the other 9 use the primary only. Speed test: 「⚡ 线路测速」 measures each checked route 3 times (best wins) via `/System/Info/Public` then `/`, https from the device (no-cors) and http via the new Worker `/speed` proxy (path-restricted, 5s timeout, no credentials); results ranked with grades, tap a row or 「用最快线路」 to switch, 「只重测失败」 and 「复制结果」 included. Saved servers now store `routes` (old `{address}` entries auto-migrate). Verified: 24 Node tests (parseRoutes, link builds, migration) + 7 Worker tests (/speed allow/deny) + 390px screenshots of the routes editor and results panel. Deployed live and verified (200, `/speed` returns ok+ms, page contains 线路测速/backupHref).
- 2026-11-10: **分流规则同步** (the Scripting tool's third feature, user picked 「下载 + Gist 同步」 after seeing its screenshot). New 「分流同步」 section: saved servers' hosts grouped by keywords into 直连/代理/CF 线路/兜底 (DIRECT/Proxy, DOMAIN or DOMAIN-SUFFIX); per-host policy + type override (tap badge/capsule, stored in `embyimp_routing_overrides`); editable group keywords (`embyimp_routing_groups`); generates 7 tools' rule files (Surge/Loon/Stash/QX/Shadowrocket/Egern/Clash) with per-file and bulk download/copy; Gist sync from the browser (private Gist, token + Gist ID in localStorage, auto-sync on save/delete) — token needs `gist` scope, a repo-only PAT cannot do it. Verified: Node tests (matching, hosts, all formats, overrides, keywords, tool selection) + 390px screenshots. Deployed live and verified (200, page contains 分流同步/emby-surge.list/Gist).
- 2026-11-10: **分流规则同步 v2（按原版截图对齐）** (user sent 3 more screenshots of the Scripting tool's 分流 page). Formats corrected to match the original: Surge/Shadowrocket are now `.sgmodule` modules (Surge with `#!arguments=EmbyProxy=PROXY` and `%EmbyProxy%` in proxy rules, Shadowrocket with literal PROXY), Loon is a `.plugin` (PROXY = user-selected group in plugin details), Egern is a YAML `rules:` list (policy `Proxy`); files renamed to `emby-proxy-*`; Stash/Clash merged into one entry producing two files (6 tools, 7 files). New 「编辑分组」 sheet: per-group name/enable/policy/QX/keywords/match + reorder. New sync status (domain count, local + Gist update times, 同步到 selector, 「立即同步」) and 「一键导入（Gist）」 raw-URL links after a successful sync. Old `{id:[keywords]}` group storage and old `stash`/`clash` tool ids migrate automatically. Verified: 64 Node tests + 390px screenshots (section + editor). Deployed live and verified (200, page contains emby-proxy-surge.sgmodule/emby-proxy.plugin/编辑分组/立即同步， /speed still ok).
- 2026-11-10: **分流方式四组布局（按原版分流页截图）** (user: 「把网页如图分成四组」). The routing section is now labelled blocks matching the reference: 「线路管理」 (two rows — 批量管理线路 / 调整策略组 opens a batch modal listing every route in the library with checkboxes + batch 设为直连/代理/恢复自动； 整库线路测速 measures all saved routes and shows ranked results, tap a row or 用最快线路 to load it into the form) and 「分流方式」 (the four groups as rows: icon, name → policy, 未命中/N 个域名 status, tappable DOMAIN ⇄ capsule, 关键词 line, chevron; expanded: host rows + 策略/QX 策略 rows + the no-keywords note for 兜底）, with 编辑分组 moved to the bottom of the 分流方式 card as a link. Verified: 42 Node tests + 390px screenshots (section, expanded groups, batch modal, library-speed modal). Deployed live and verified.- 2026-11-06: hold-to-burn reveal added (user: 「我非常喜欢这个交互」) — the form card hid behind an ash veil; holding 「🔥 按住点燃」 burned a radial hole from the center (GSAP tween + rAF fallback, flame-ring SVG + ember canvas). Same day the user cancelled it (「感觉很卡取消燃烧」) — laggy on their phone. The entire burn (veil, ignite, ring, canvas, GSAP) was removed; the form is back to always-visible and index.html is back to its pre-burn size. Performance on the user's device outranks theatre.
- 2026-11-10: **分组关键词直接改（代理组手动输入）** (user: 「代理那里可以手动编辑 输入（如 美国 日本 新加坡）」). Every group's expanded view now has a 关键词 input row — type region names (e.g. 美国 日本 新加坡） directly in the 代理 group, blur/Enter to save, and routes named with those words move into the group at once. Same storage (`embyimp_routing_groups`) and same data as the 编辑分组 modal. Verified: 24 Node tests + 390px screenshot of the expanded 代理 group with the input. Deployed live and verified.
- 2026-11-10: **策略可手动改写 + 各国策略名** (user sent their Surge 策略组 screenshot: 「这里可以改写策略的功能 比如我用的surge 有这些策略 其他人也会有不同的策略名称 所以改成可以手动编辑」「也把各个国家也添加上去如图2」). The 策略 and QX 策略 fields are now free-text inputs (in the expanded group view and in 编辑分组）, not fixed DIRECT/Proxy selects — type any policy-group name (e.g. 新加坡手动， 日本手动， 美国）. A datalist offers DIRECT, Proxy and the countries from the user's Surge policy groups （新加坡， 新加坡手动， 日本， 日本手动， 韩国， 韩国手动， 香港， 台湾， 美国， 中国， 便宜流量）. Rule generation writes a custom name literally into Surge, Shadowrocket, Egern, QX (when following) and Stash/Clash rules; generic Proxy still uses the Surge `%EmbyProxy%` parameter / Egern `Proxy` / `PROXY`; Loon still maps every non-DIRECT to PROXY. The per-host policy badge now switches between the group's policy and DIRECT. Verified: 50 Node tests (custom policy names) + 11 Node tests (editor rendering) + 390px screenshot (代理 → 新加坡手动， expanded 策略 input) + DOM dump confirming the editor modal opens with the inputs and datalists. Deployed live and verified (200, page contains rtPolicyList/rtQxList/新加坡手动， /speed still ok).
- 2026-11-10: **一键导入与分流同步分成两个页面** (user: 「把一键导入和 分流同步 分成两个页面 可以按下方按钮进行切换 都在一个页面太乱了」). The site is now two views in one page: 一键导入 (`#view-import`, hero + form + apps) and 分流同步 (`#view-routing`, the routing section), switched by a fixed bottom tab bar (⬇️ 一键导入 / 🔀 分流同步， active in accent). Footer and the three routing modals stay outside both views. `setView` toggles `hidden`, updates the active tab, remembers the choice in localStorage `embyimp_view`, updates the hash (`#import` / `#routing`), re-renders the routing view on entry, and scrolls to top. Body bottom padding raised to 96px + safe-area so the tab bar never covers content. Verified: 25 Node tests + 390px screenshots of both views and the tab bar. Deployed live and verified (200, page contains view-import/view-routing/tabbar, /speed still ok).
- 2026-11-10: **分流同步教程** (user: 「怎么用分流同步的教程也写上去了吗 记得保护隐私」). A collapsible 「📖 怎么用分流同步」 (`<details class="rt-howto">`, collapsed by default) at the top of the routing page with 7 steps: save servers first, read the four groups, edit a group (keywords / policy name / match capsule), per-host overrides, generate + import the rule files per tool, optional Gist sync, and the privacy note (only domains go to Gist, no accounts/passwords, token stays in the browser and only goes to api.github.com, saved servers/passwords never upload). The same tutorial is in README.md under 分流同步. **Privacy: the tutorial contains no real addresses, no deployment domain, no tokens — only generic policy names and keyword examples; the scrub check before every push must confirm that.** Verified: 390px screenshot of the expanded tutorial + privacy grep (no real domain/URL in the tutorial block). Deployed live and verified (200, page contains rt-howto/怎么用分流同步， /speed still ok).
- 2026-11-10: **密码自动填充修复** (user sent an iOS keychain popup: 「为啥Glass Panel的密码会自动写入 你检查一下」). Cause: the form has a 用户名 + 密码 pair, which the browser reads as a login form — and `autocomplete="off"` is **deliberately ignored by browsers on password fields** (they do this so password managers keep working), so iOS Safari offered a saved keychain credential (the user's Glass Panel password) into the Emby password field. The Emby password is not a website login (it's a server password used to build an import link), so it must never trigger login autofill. Fix: both `type="password"` fields (Emby 密码 and the Gist 令牌） now use `autocomplete="new-password"`, which tells the browser the field is not an existing login credential — saved passwords are no longer offered. Note: autofill behavior is the phone's browser + keychain, so it can only be fully confirmed on the user's device; if a credential for this site was ever saved by accident, delete it in iOS 设置 → 密码. Verified live (200, both password fields show `autocomplete="new-password"`, /speed still ok).- 2026-11-06: footer thanks line added (user request): "💗 感谢奥斯卡卡的鼎力协助" under the trust line.
- 2026-11-06: Add to Home Screen (PWA) — pink play-triangle home-screen icon (PIL gradient), manifest.json + icon routes served by the Worker, standalone meta tags; `build.py` now builds worker.js (replaces the inline snippet). iOS caveat: standalone web apps have separate storage from Safari, so saved servers don't carry over.
- 2026-11-06: glamorous motion (user picked 「华丽动效版」) — drifting blobs, flowing gradients (title/badge/paste button), glowing paste button, staggered tile entrance (first render only), sheen sweep, floating pink sparkles, springy press; prefers-reduced-motion guard; CSS + decorative spans only, plus a first-render flag in render().
- 2026-11-06: motion made bolder — user said "没有啊" (couldn't see it; likely Safari cache + first version too subtle): sheen 5.5s→3.5s and brighter, sparkles 8→12 and bigger/brighter/faster, title gradient gained a violet stop, blobs drift faster. Live page verified to contain the motion code; user needs a force-refresh (Safari holds the old page).
- 2026-11-06: splash screen (user: 「一个小女孩在跑，点击她才弹出这个页面」) — full-screen pink splash, running anime girl (girl-running.jpg, 640px base64 ~80KB) bobbing over a scrolling dashed track, 「👆 点小女孩进入」 hint; tap fades the splash out and the main page pops in (entrances gated on body.in, tile cascade replays on entry).
- 2026-11-06: splash screen replaced by a GSAP 3D flip card (user correction: only the form should be hidden, not a second page) — the running girl is the front of the card, the form is the back; tap the girl to flip (GSAP rotationY 180, .8s; CSS fallback if the CDN fails), 「🙈 藏回小女孩」 flips back; pointer-follow 3D tilt (GSAP quickTo ±8°) like the react-bits box video the user sent. CSS fallback flip verified at 390px via headless-Chromium screenshot (form shows, tiles intact). GSAP path verified in a real browser (live page): click the girl → the form appears (paste button, saved servers, all 4 fields), click 「🙈 藏回小女孩」 → the girl returns; the form's lower half briefly fades in right after the flip (the field stagger) — expected, not a bug. Headless test was inconclusive (the headless shell's virtual-time freezes GSAP/CSS animations when GSAP is inlined — a test-env artifact, not a page bug).
- 2026-11-06: skill-guided redesign (user: 「根据你学的skill 重做页面 模版 配色 动画 交互」) — template: no badge, no blobs/sparkles, apps is a <section> (no nested cards); colors: one accent #DB2777, neutral whisper-blush ground, solid surfaces, verified contrasts; animation: flip+tilt is the one moment, scattered effects removed, hover layer + copy ✓ feedback; interaction: keyboard-accessible girl + tiles. Pink + girl + flip kept (brief wins). Built + locally verified at 390px (initial + flipped form). NOT deployed yet — the Cloudflare API token (doufu-muse-deploy) is not available in this session (env vars cleared); user is adding it via the secure connector link, then deploy + live verify.
- 2026-11-06 ~15:20: user said 「小女孩可以去掉」 — removed the running girl + the whole 3D flip card (front/back, GSAP CDN, tilt, load settle, tile entrance). The form card is now a plain card directly under the hero, always visible; no CDN dependency, no load animations, hover/press micro-interactions only. Backup of the flip version kept at ~/workspace/emby-import/index.html.with-girl.bak (girl-running.jpg still on disk) so it can be restored. Built + locally verified at 390px. NOT deployed yet — still waiting on the Cloudflare API token (custom.cloudflare connector).
