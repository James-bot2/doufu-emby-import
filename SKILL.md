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
- 2026-11-06: hold-to-burn reveal added (user: 「我非常喜欢这个交互」) — the form card hid behind an ash veil; holding 「🔥 按住点燃」 burned a radial hole from the center (GSAP tween + rAF fallback, flame-ring SVG + ember canvas). Same day the user cancelled it (「感觉很卡取消燃烧」) — laggy on their phone. The entire burn (veil, ignite, ring, canvas, GSAP) was removed; the form is back to always-visible and index.html is back to its pre-burn size. Performance on the user's device outranks theatre.
- 2026-11-06: footer thanks line added (user request): "💗 感谢奥斯卡卡的鼎力协助" under the trust line.
- 2026-11-06: Add to Home Screen (PWA) — pink play-triangle home-screen icon (PIL gradient), manifest.json + icon routes served by the Worker, standalone meta tags; `build.py` now builds worker.js (replaces the inline snippet). iOS caveat: standalone web apps have separate storage from Safari, so saved servers don't carry over.
- 2026-11-06: glamorous motion (user picked 「华丽动效版」) — drifting blobs, flowing gradients (title/badge/paste button), glowing paste button, staggered tile entrance (first render only), sheen sweep, floating pink sparkles, springy press; prefers-reduced-motion guard; CSS + decorative spans only, plus a first-render flag in render().
- 2026-11-06: motion made bolder — user said "没有啊" (couldn't see it; likely Safari cache + first version too subtle): sheen 5.5s→3.5s and brighter, sparkles 8→12 and bigger/brighter/faster, title gradient gained a violet stop, blobs drift faster. Live page verified to contain the motion code; user needs a force-refresh (Safari holds the old page).
- 2026-11-06: splash screen (user: 「一个小女孩在跑，点击她才弹出这个页面」) — full-screen pink splash, running anime girl (girl-running.jpg, 640px base64 ~80KB) bobbing over a scrolling dashed track, 「👆 点小女孩进入」 hint; tap fades the splash out and the main page pops in (entrances gated on body.in, tile cascade replays on entry).
- 2026-11-06: splash screen replaced by a GSAP 3D flip card (user correction: only the form should be hidden, not a second page) — the running girl is the front of the card, the form is the back; tap the girl to flip (GSAP rotationY 180, .8s; CSS fallback if the CDN fails), 「🙈 藏回小女孩」 flips back; pointer-follow 3D tilt (GSAP quickTo ±8°) like the react-bits box video the user sent. CSS fallback flip verified at 390px via headless-Chromium screenshot (form shows, tiles intact). GSAP path verified in a real browser (live page): click the girl → the form appears (paste button, saved servers, all 4 fields), click 「🙈 藏回小女孩」 → the girl returns; the form's lower half briefly fades in right after the flip (the field stagger) — expected, not a bug. Headless test was inconclusive (the headless shell's virtual-time freezes GSAP/CSS animations when GSAP is inlined — a test-env artifact, not a page bug).
- 2026-11-06: skill-guided redesign (user: 「根据你学的skill 重做页面 模版 配色 动画 交互」) — template: no badge, no blobs/sparkles, apps is a <section> (no nested cards); colors: one accent #DB2777, neutral whisper-blush ground, solid surfaces, verified contrasts; animation: flip+tilt is the one moment, scattered effects removed, hover layer + copy ✓ feedback; interaction: keyboard-accessible girl + tiles. Pink + girl + flip kept (brief wins). Built + locally verified at 390px (initial + flipped form). NOT deployed yet — the Cloudflare API token (doufu-muse-deploy) is not available in this session (env vars cleared); user is adding it via the secure connector link, then deploy + live verify.
- 2026-11-06 ~15:20: user said 「小女孩可以去掉」 — removed the running girl + the whole 3D flip card (front/back, GSAP CDN, tilt, load settle, tile entrance). The form card is now a plain card directly under the hero, always visible; no CDN dependency, no load animations, hover/press micro-interactions only. Backup of the flip version kept at ~/workspace/emby-import/index.html.with-girl.bak (girl-running.jpg still on disk) so it can be restored. Built + locally verified at 390px. NOT deployed yet — still waiting on the Cloudflare API token (custom.cloudflare connector).
