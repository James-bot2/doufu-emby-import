#!/usr/bin/env python3
"""Build worker.js for emby-import: inlines index.html + the PWA icons/manifest.

Run: python3 build.py   (from ~/workspace/emby-import/)
Then: node --check worker.js, deploy via the Cloudflare API (see SKILL.md).
"""
import base64, json

html = open('index.html', encoding='utf-8').read()
esc = html.replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${')

def b64(path):
    return base64.b64encode(open(path, 'rb').read()).decode()

manifest = {
    "name": "Emby 一键导入",
    "short_name": "Emby导入",
    "description": "填一次服务器信息，点格子直接唤起客户端导入 Emby 服务器。",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#FDF2F7",
    "theme_color": "#FDF2F7",
    "icons": [
        {"src": "/icon-192.png", "sizes": "192x192", "type": "image/png"},
        {"src": "/icon-512.png", "sizes": "512x512", "type": "image/png"},
    ],
}

worker = "const HTML = `" + esc + "`;\n"
worker += "const ICON180 = \"" + b64('apple-touch-icon.png') + "\";\n"
worker += "const ICON192 = \"" + b64('icon-192.png') + "\";\n"
worker += "const ICON512 = \"" + b64('icon-512.png') + "\";\n"
worker += "const MANIFEST = " + json.dumps(manifest, ensure_ascii=False) + ";\n"
worker += """
function b64ToBytes(b){ const s=atob(b); const u=new Uint8Array(s.length); for(let i=0;i<s.length;i++)u[i]=s.charCodeAt(i); return u; }
export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname === '/health') return new Response('emby-import ok', { status: 200 });
    if (url.pathname === '/manifest.json') return new Response(JSON.stringify(MANIFEST), { headers: { 'Content-Type': 'application/manifest+json', 'Cache-Control': 'no-store' } });
    if (url.pathname === '/apple-touch-icon.png') return new Response(b64ToBytes(ICON180), { headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=86400' } });
    if (url.pathname === '/icon-192.png') return new Response(b64ToBytes(ICON192), { headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=86400' } });
    if (url.pathname === '/icon-512.png') return new Response(b64ToBytes(ICON512), { headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=86400' } });
    return new Response(HTML, { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } });
  }
};
"""
open('worker.js', 'w', encoding='utf-8').write(worker)
print("worker.js built:", len(worker), "bytes")
