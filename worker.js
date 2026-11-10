const HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0,viewport-fit=cover">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Emby 一键导入">
<meta name="theme-color" content="#FDF2F7">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/manifest.json">
<title>Emby 一键导入</title>
<style>
  :root{
    --s1:4px; --s2:8px; --s3:12px; --s4:16px; --s5:24px; --s6:32px; --s7:48px;
    --bg:#FCF6F7; --surface:#FFFFFF; --ink:#2A1D21; --muted:#7C5A66;
    --accent:#DB2777; --accent-ink:#FFFFFF; --accent-deep:#BE185D;
    --hairline:rgba(42,29,33,.14); --hairline-strong:rgba(42,29,33,.24);
    --field:#F7EEF1; --accent-soft:rgba(219,39,119,.10); --accent-soft-hover:rgba(219,39,119,.18);
    --focus-ring:rgba(219,39,119,.16);
    --green:#16A34A; --red:#DC2626;
    --radius:20px; --radius-sm:14px; --radius-tile:18px;
    --shadow:0 12px 32px rgba(42,29,33,.10), 0 2px 8px rgba(42,29,33,.06);
    --shadow-tile-hover:0 10px 24px rgba(42,29,33,.10);
    --m-in:140ms; --m-out:200ms; --m-press:90ms; --ease:cubic-bezier(.2,.8,.2,1);
  }
  @media (prefers-color-scheme:dark){
    :root{
      --bg:#1D0A16; --surface:#26101B; --ink:#FDF2F7; --muted:#C9A8B4;
      --accent:#F472B6; --accent-ink:#1D0A16; --accent-deep:#EC4899;
      --hairline:rgba(253,242,247,.16); --hairline-strong:rgba(253,242,247,.30);
      --field:rgba(255,255,255,.06); --accent-soft:rgba(244,114,182,.14); --accent-soft-hover:rgba(244,114,182,.22);
      --focus-ring:rgba(244,114,182,.25);
      --shadow:0 12px 32px rgba(0,0,0,.45), 0 2px 8px rgba(0,0,0,.30);
      --shadow-tile-hover:0 10px 24px rgba(0,0,0,.5);
    }
  }
  *{margin:0;padding:0;box-sizing:border-box}
  html{overflow-x:hidden}
  body{font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display','PingFang SC','Hiragino Sans GB',sans-serif;color:var(--ink);background:var(--bg);min-height:100vh;padding:calc(28px + env(safe-area-inset-top)) 16px calc(96px + env(safe-area-inset-bottom));-webkit-font-smoothing:antialiased;overflow-x:hidden}
  ::selection{background:#F9A8D4;color:#2A1D21}
  @media (prefers-color-scheme:dark){ ::selection{background:#9D174D;color:#FDF2F7} }
  :focus-visible{outline:2px solid var(--accent);outline-offset:2px}
  .wrap{max-width:560px;margin:0 auto;position:relative;z-index:1}
  /* 底部切换栏：一键导入 / 分流同步（固定底栏，内容底边已留出 96px） */
  #view-import[hidden], #view-routing[hidden]{display:none}
  .tabbar{position:fixed;left:0;right:0;bottom:0;z-index:50;background:var(--surface);border-top:1px solid var(--hairline);padding-bottom:env(safe-area-inset-bottom)}
  .tabbar-inner{display:flex;width:100%;max-width:560px;margin:0 auto}
  .tabbar button{flex:1;border:none;background:none;padding:9px 0 8px;font-size:12px;font-weight:600;color:var(--muted);cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:2px;font-family:inherit}
  .tabbar button .tab-ic{font-size:20px;line-height:1}
  .tabbar button.active{color:var(--accent)}
  .hero{margin:4px 2px 32px}
  h1{font-size:34px;font-weight:800;letter-spacing:-.5px;line-height:1.2}
  h1 .accent-word{color:var(--accent)}
  .sub{font-size:16px;line-height:1.65;color:var(--ink);margin-top:12px;max-width:44ch}
  .card{background:var(--surface);border-radius:var(--radius);padding:20px;box-shadow:var(--shadow)}
  @media (prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}}
  label{display:block;font-size:13px;font-weight:500;color:var(--muted);margin:14px 0 6px}
  label:first-child{margin-top:0}
  input,select,textarea{width:100%;min-height:48px;padding:12px 14px;font-size:16px;border:1.5px solid var(--hairline);border-radius:var(--radius-sm);background:var(--field);color:var(--ink);outline:none;caret-color:var(--accent);transition:border-color var(--m-in) var(--ease),box-shadow var(--m-in) var(--ease),background-color var(--m-in) var(--ease)}
  input:focus,select:focus,textarea:focus{border-color:var(--accent);background:var(--surface);box-shadow:0 0 0 3px var(--focus-ring)}
  input::placeholder,textarea::placeholder{color:var(--muted);opacity:1}
  .pw-row{display:flex;gap:8px}
  .pw-row input{flex:1}
  .pw-row button,.mini-btn{flex:none;padding:0 16px;border:none;border-radius:var(--radius-sm);background:var(--field);color:var(--accent);font-size:14px;font-weight:600;cursor:pointer;transition:background-color var(--m-in) var(--ease),transform var(--m-press) var(--ease)}
  .pw-row button:hover,.mini-btn:hover{background:var(--accent-soft)}
  .pw-row button:active,.mini-btn:active{transform:scale(.985)}
  .mini-btn.danger{color:var(--red)}
  .mini-btn.danger:hover{background:rgba(220,38,38,.08)}
  .paste-btn{width:100%;min-height:48px;padding:13px;border:none;border-radius:var(--radius-sm);background:var(--accent);color:var(--accent-ink);font-size:16px;font-weight:700;cursor:pointer;margin-bottom:12px;transition:transform var(--m-in) var(--ease),background-color var(--m-in) var(--ease)}
  @media (hover:hover){ .paste-btn:hover{background:var(--accent-deep);transform:translateY(-1px)} }
  .paste-btn:active{transform:translateY(1px) scale(.985)}
  .paste-btn.secondary{background:var(--field);color:var(--accent)}
  #manualPaste{display:none;margin-bottom:12px}
  .saved-row{display:flex;gap:8px}
  .saved-row select{flex:1;min-width:0}
  .saved-note{font-size:13px;color:var(--muted);margin-top:8px;line-height:1.5}
  .route-row{border:1px solid var(--hairline);border-radius:var(--radius-sm);background:var(--field);padding:10px 12px;margin-bottom:8px}
  .route-row.unchecked{opacity:.55}
  .route-top{display:flex;align-items:center;gap:8px;margin-bottom:8px}
  .route-top input[type="checkbox"]{width:18px;height:18px;min-height:0;flex:none;accent-color:var(--accent);cursor:pointer;padding:0}
  .route-name{flex:1;min-width:0;min-height:36px;padding:8px 10px;font-size:14px}
  .route-del{flex:none;width:28px;height:28px;border:none;border-radius:50%;background:transparent;color:var(--muted);font-size:15px;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0}
  .route-del:hover{background:rgba(220,38,38,.1);color:var(--red)}
  .route-url{width:100%;min-height:40px;font-size:15px}
  .route-actions{display:flex;gap:8px;margin-top:4px}
  .route-actions .mini-btn{flex:1;min-height:40px;white-space:nowrap;padding:0 10px}
  .route-count{font-size:13px;color:var(--muted);margin-top:8px;line-height:1.5}
  #speedSection{display:none;margin-top:16px}
  #speedSection.show{display:block}
  .speed-head{display:flex;align-items:baseline;gap:8px;margin-bottom:4px}
  .speed-head h3{font-size:16px;font-weight:700}
  .speed-head span{font-size:13px;color:var(--muted)}
  .speed-summary{display:flex;gap:16px;margin:10px 0 4px}
  .speed-summary .sv b{display:block;font-size:18px;font-weight:800}
  .speed-summary .sv span{font-size:12px;color:var(--muted)}
  .speed-row{display:flex;align-items:center;gap:10px;padding:10px 2px;border-top:1px solid var(--hairline);cursor:pointer}
  .speed-row:first-of-type{border-top:none}
  .speed-rank{flex:none;width:22px;text-align:center;font-size:14px;font-weight:700;color:var(--muted)}
  .speed-rank.fast{color:var(--green)}
  .speed-info{flex:1;min-width:0}
  .speed-name{font-size:15px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .speed-host{font-size:13px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .speed-ms{flex:none;text-align:right}
  .speed-ms b{font-size:16px;font-weight:800}
  .speed-ms span{display:block;font-size:12px;font-weight:600}
  .speed-ms .good{color:var(--green)}
  .speed-ms .mid{color:#D97706}
  .speed-ms .bad{color:var(--red)}
  .speed-ms .na{color:var(--muted)}
  .speed-note{font-size:13px;color:var(--muted);margin-top:8px;line-height:1.5}
  #manualPaste textarea{resize:vertical;font-family:inherit;margin-bottom:8px;min-height:96px}
  #apps{margin:32px 2px 0}
  .apps-title{font-size:24px;font-weight:800;letter-spacing:-.3px;line-height:1.25}
  .apps-sub{font-size:14px;color:var(--muted);margin-top:6px;margin-bottom:16px}
  #routing{margin:32px 2px 0}
  .rt-sec-label{font-size:13px;font-weight:600;color:var(--muted);margin:18px 4px 8px}
  /* 分流同步教程（可折叠，默认收起） */
  .rt-howto{border:1px solid var(--hairline);border-radius:var(--radius-sm);background:var(--surface);padding:12px 14px;margin:4px 0 2px}
  .rt-howto summary{cursor:pointer;font-weight:700;font-size:15px;color:var(--ink);list-style:none}
  .rt-howto summary::-webkit-details-marker{display:none}
  .rt-howto ol{margin:12px 0 0;padding-left:20px;font-size:14px;line-height:1.75;color:var(--ink)}
  .rt-howto ol li{margin-bottom:8px}
  .rt-howto ol li:last-child{margin-bottom:0}
  .rt-howto code{font-family:ui-monospace,Menlo,Consolas,monospace;font-size:13px;background:var(--field);padding:1px 5px;border-radius:5px}
  .rt-manage-row{display:flex;align-items:center;gap:12px;width:100%;border:none;background:none;padding:13px 4px;cursor:pointer;font-size:16px;color:var(--accent);font-weight:600;text-align:left}
  .rt-manage-row+.rt-manage-row{border-top:1px solid var(--hairline)}
  .rt-manage-row:active{background:var(--accent-soft)}
  .rt-manage-ico{flex:none;width:24px;text-align:center;font-size:17px}
  .rt-manage-text{flex:1;min-width:0}
  .rt-group{border-top:1px solid var(--hairline)}
  .rt-group:first-child{border-top:none}
  .rt-group-head{display:flex;align-items:flex-start;gap:8px;padding:12px 2px;cursor:pointer;min-height:56px}
  .rt-group-head:active{background:var(--accent-soft)}
  .rt-gico{flex:none;width:24px;text-align:center;font-size:19px;line-height:1.5}
  .rt-gico.direct{color:var(--green)}
  .rt-gmain{flex:1;min-width:0}
  .rt-gline1{font-size:17px;font-weight:700;line-height:1.4}
  .rt-gline1 .rt-garrow{color:var(--muted);font-weight:400;margin:0 6px}
  .rt-gline1 .rt-gpol{color:var(--muted);font-weight:500}
  .rt-gcapsule{display:inline-flex;align-items:center;gap:4px;border:none;border-radius:999px;background:var(--field);color:var(--accent);font-size:13px;font-weight:700;padding:4px 10px;margin-top:6px;cursor:pointer}
  .rt-gkw{font-size:12px;color:var(--muted);margin-top:6px}
  .rt-gside{flex:none;display:flex;flex-direction:column;align-items:flex-end;align-self:flex-start;padding-top:2px}
  .rt-gstatus{font-size:12px;color:var(--muted)}
  .rt-gside .rt-chev{margin-top:10px}
  .rt-chev{flex:none;color:var(--muted);font-size:14px;transition:transform var(--m-in) var(--ease)}
  .rt-group.open .rt-chev{transform:rotate(90deg)}
  .rt-hosts{display:none;border-top:1px solid var(--hairline);padding:6px 4px 10px}
  .rt-group.open .rt-hosts{display:block}
  .rt-gdetail{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:11px 0;border-top:1px solid var(--hairline);font-size:15px}
  .rt-gdetail>span{color:var(--muted)}
  .rt-gdetail button{border:none;background:none;color:var(--ink);font-size:15px;font-weight:600;cursor:pointer;padding:4px 0}
  .rt-gtext{flex:1;min-width:0;min-height:38px;padding:8px 10px;font-size:14px;text-align:right}
  .rt-gnote{font-size:13px;color:var(--muted);line-height:1.6;padding:10px 0 2px;border-top:1px solid var(--hairline)}
  .rt-gkw-edit{display:flex;align-items:center;gap:10px;padding:11px 0;border-top:1px solid var(--hairline);font-size:15px}
  .rt-gkw-edit>span{flex:none;color:var(--muted)}
  .rt-gkw-input{flex:1;min-width:0;min-height:38px;padding:8px 10px;font-size:14px}
  .rt-edit-link{display:flex;align-items:center;gap:10px;width:100%;border:none;border-top:1px solid var(--hairline);background:none;padding:13px 4px;cursor:pointer;font-size:16px;color:var(--accent);font-weight:600;text-align:left}
  .rt-edit-link:active{background:var(--accent-soft)}
  .rt-batch-row{display:flex;align-items:center;gap:10px;padding:11px 0;border-top:1px solid var(--hairline);font-size:14px}
  .rt-batch-row:first-child{border-top:none}
  .rt-batch-row input[type=checkbox]{width:18px;height:18px;min-height:0;flex:none;accent-color:var(--accent);padding:0}
  .rt-batch-info{flex:1;min-width:0}
  .rt-batch-name{font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .rt-batch-host{font-size:12px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .rt-lib-row{display:flex;align-items:center;gap:10px;padding:11px 0;border-top:1px solid var(--hairline);cursor:pointer}
  .rt-lib-row:first-child{border-top:none}
  .rt-host{display:flex;align-items:center;gap:8px;padding:9px 0;border-top:1px solid var(--hairline)}
  .rt-host:first-child{border-top:none}
  .rt-host-info{flex:1;min-width:0}
  .rt-host-name{font-size:14px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .rt-host-label{font-size:12px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .rt-badge{flex:none;border:none;border-radius:999px;padding:5px 10px;font-size:12px;font-weight:700;cursor:pointer;background:var(--accent-soft);color:var(--accent)}
  .rt-badge.direct{color:var(--green);background:rgba(22,163,74,.12)}
  .rt-badge.auto{opacity:.65}
  .rt-type{flex:none;border:1px solid var(--hairline-strong);border-radius:999px;padding:4px 9px;font-size:11px;font-weight:700;cursor:pointer;background:var(--surface);color:var(--accent)}
  .rt-kw{width:100%;min-height:36px;font-size:14px;margin-top:8px}
  .rt-kw-label{font-size:12px;color:var(--muted);margin-top:8px;display:block}
  .rt-tools{display:flex;flex-wrap:wrap;gap:8px;margin-top:4px}
  .rt-tool{display:flex;align-items:center;gap:6px;border:1px solid var(--hairline);border-radius:999px;padding:8px 12px;font-size:14px;font-weight:600;cursor:pointer;background:var(--field)}
  .rt-tool input{width:16px;height:16px;min-height:0;accent-color:var(--accent);padding:0}
  .rt-tool.off{opacity:.5}
  .rt-file{display:flex;align-items:center;gap:8px;padding:9px 0;border-top:1px solid var(--hairline);font-size:14px}
  .rt-file:first-child{border-top:none}
  .rt-file-name{flex:1;min-width:0;font-weight:600;font-size:13px;line-height:1.35;word-break:break-all}
  .rt-file-meta{font-size:12px;color:var(--muted);flex:none}
  .rt-empty{font-size:14px;color:var(--muted);padding:12px 0;line-height:1.6}
  .rt-sync{border-top:1px solid var(--hairline);margin-top:14px;padding-top:12px}
  .rt-sync-row{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:8px 0;border-top:1px solid var(--hairline);font-size:14px}
  .rt-sync-row:first-child{border-top:none}
  .rt-sync-row>span{color:var(--muted)}
  .rt-sync-row>b{font-weight:600;text-align:right}
  .rt-sync-row select{width:auto;min-height:38px;padding:8px 10px;font-size:14px}
  .rt-import-link{display:flex;align-items:center;gap:8px;padding:9px 0;border-top:1px solid var(--hairline);font-size:14px}
  .rt-import-link:first-child{border-top:none}
  .rt-modal{position:fixed;inset:0;background:rgba(20,8,14,.5);z-index:60;display:flex;align-items:flex-end;justify-content:center}
  .rt-modal-card{background:var(--surface);border-radius:18px 18px 0 0;width:100%;max-width:560px;max-height:88vh;overflow:auto;padding:18px 18px 24px}
  .rt-modal-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:6px}
  .rt-modal-head b{font-size:18px}
  .rt-ed-group{border:1px solid var(--hairline);border-radius:var(--radius-sm);background:var(--field);padding:12px 14px;margin-bottom:10px}
  .rt-ed-top{display:flex;align-items:center;gap:8px;margin-bottom:4px}
  .rt-ed-name{flex:1;min-width:0;font-weight:700;font-size:16px;min-height:40px;padding:8px 12px}
  .rt-ed-top .mini-btn{padding:0 10px;min-height:32px}
  .rt-ed-enable{display:flex;align-items:center;gap:4px;font-size:13px;color:var(--muted);cursor:pointer;flex:none}
  .rt-ed-enable input{width:16px;height:16px;min-height:0;accent-color:var(--accent);padding:0}
  .rt-ed-row{display:flex;align-items:center;gap:10px;padding:8px 0;border-top:1px solid var(--hairline)}
  .rt-ed-row>span{flex:none;width:60px;color:var(--muted);font-size:14px}
  .rt-ed-row select{flex:1;min-width:0;min-height:40px;padding:8px 10px;font-size:14px}
  .rt-ed-row input[type=text]{flex:1;min-width:0;min-height:40px;padding:8px 12px;font-size:14px}
  .rt-seg{display:flex;flex:1;border:1.5px solid var(--hairline-strong);border-radius:999px;overflow:hidden;background:var(--surface)}
  .rt-seg button{flex:1;border:none;background:transparent;padding:8px 6px;font-size:12px;font-weight:700;color:var(--muted);cursor:pointer}
  .rt-seg button.on{background:var(--accent);color:var(--accent-ink)}
  .grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
  .tile{position:relative;display:flex;flex-direction:column;align-items:center;text-align:center;background:var(--surface);border:1px solid var(--hairline);border-radius:var(--radius-tile);padding:12px 6px 10px;cursor:pointer;min-width:0;overflow:hidden;transition:transform var(--m-in) var(--ease),box-shadow var(--m-in) var(--ease),border-color var(--m-in) var(--ease)}
  @media (hover:hover){ .tile:hover{transform:translateY(-2px);border-color:var(--hairline-strong);box-shadow:var(--shadow-tile-hover)} }
  .tile:active{transform:translateY(1px) scale(.985)}
  .tile.disabled{opacity:.38;cursor:not-allowed}
  .ico{width:40px;height:40px;border-radius:11px;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:700;color:#fff;flex:none}
  .ico img{width:44px;height:44px;border-radius:12px;object-fit:cover;display:block}
  .tinfo{width:100%;min-width:0;margin-top:9px}
  .tname{font-size:15px;font-weight:700;letter-spacing:-.2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .tsub{font-size:13px;color:var(--muted);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .copy{position:absolute;top:6px;right:6px;width:22px;height:22px;border:none;border-radius:50%;background:var(--accent-soft);color:var(--accent);font-size:11px;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0;transition:background-color var(--m-in) var(--ease),transform var(--m-press) var(--ease),color var(--m-in) var(--ease)}
  .copy:hover{background:var(--accent-soft-hover)}
  .copy:active{transform:scale(.9)}
  .copy.done{color:var(--green);background:rgba(22,163,74,.12)}
  .toast{position:fixed;left:50%;bottom:40px;transform:translateX(-50%) translateY(20px);background:var(--ink);color:var(--bg);padding:11px 20px;border-radius:999px;font-size:14px;font-weight:600;opacity:0;pointer-events:none;transition:opacity .25s,transform .25s;z-index:99;box-shadow:0 8px 24px rgba(0,0,0,.25)}
  .toast.show{opacity:1;transform:translateX(-50%) translateY(0)}
  .foot{text-align:center;font-size:13px;color:var(--muted);margin-top:8px;line-height:1.5}
</style>
</head>
<body>
<div class="wrap">
  <!-- 一键导入页 -->
  <div id="view-import">
  <header class="hero">
    <h1>Emby <span class="accent-word">一键导入</span></h1>
    <p class="sub">填一次服务器信息，14 个播放器都能一键导入。信息只在你手机本地生成链接，不会上传到任何服务器。</p>
  </header>

  <div class="card" id="formCard">
    <button type="button" class="paste-btn" id="btnPaste">📋 粘贴识别剪贴板</button>
    <div id="manualPaste">
      <textarea id="pasteText" rows="4" placeholder="粘贴账号信息到这里，例如：地址 用户名 密码，或开户成功的那段消息…"></textarea>
      <button type="button" class="paste-btn secondary" id="btnParse">识别并填入</button>
    </div>
    <label>已保存的服务器</label>
    <div class="saved-row">
      <select id="savedSelect"><option value="">— 选择已保存的服务器 —</option></select>
      <button type="button" id="btnSaveServer" class="mini-btn">💾 保存</button>
      <button type="button" id="btnDelServer" class="mini-btn danger">删除</button>
    </div>
    <p class="saved-note">保存后地址、用户名、密码都存在本机浏览器里，下次直接选，不上传。</p>
    <label>服务器名称</label>
    <input id="name" type="text" placeholder="例如：我的 Emby" autocomplete="off">
    <label>Emby 线路 <span id="routeCount" style="font-weight:400"></span></label>
    <div id="routesList"></div>
    <div class="route-actions">
      <button type="button" id="btnAddRoute" class="mini-btn">＋ 添加线路</button>
      <button type="button" id="btnSpeed" class="mini-btn">⚡ 线路测速</button>
    </div>
    <p class="route-count">勾选的线路会一起写进导入链接（支持的播放器带备用线路）；主线路是勾选的第一条。粘贴开户通知可自动识别多条线路。</p>
    <div id="speedSection" class="card" style="box-shadow:none;border:1px solid var(--hairline);margin-top:16px">
      <div class="speed-head"><h3>线路测速</h3><span id="speedStatus"></span></div>
      <div class="speed-summary" id="speedSummary"></div>
      <div id="speedRows"></div>
      <div class="route-actions" style="margin-top:12px">
        <button type="button" id="btnUseFastest" class="mini-btn" style="display:none">⚡ 用最快线路</button>
        <button type="button" id="btnRetryFailed" class="mini-btn" style="display:none">↻ 只重测失败</button>
        <button type="button" id="btnCopySpeed" class="mini-btn" style="display:none">复制结果</button>
      </div>
      <p class="speed-note">每条线路测 3 次取最快；https 线路从本机直接测，http 线路经服务器节点测（浏览器不允许 https 页面直接测 http）。延迟仅供参考，快慢排序更有意义。</p>
    </div>
    <label>用户名</label>
    <input id="username" type="text" placeholder="Emby 用户名" autocomplete="off" autocapitalize="off">
    <label>密码</label>
    <div class="pw-row">
      <input id="password" type="password" placeholder="Emby 密码" autocomplete="new-password">
      <button type="button" id="togglePw">显示</button>
    </div>
  </div>
  <section id="apps" aria-label="一键导入"></section>
  </div><!-- /view-import -->

  <!-- 分流同步页 -->
  <div id="view-routing" hidden>
  <section id="routing" aria-label="分流同步">
    <h2 class="apps-title">分流同步</h2>
    <p class="apps-sub">从已保存的服务器线路生成代理规则，按关键词分组</p>
    <details class="rt-howto">
      <summary>📖 怎么用分流同步</summary>
      <ol>
        <li><b>先保存服务器。</b>在一键导入页填好 Emby 服务器并保存，分流规则就是从已保存服务器的线路里按域名生成的。</li>
        <li><b>看分组。</b>线路按名字里的关键词自动分进四组：直连（名字带 直连 / 直链 / direct）、代理（代理 / 中转 / 加速 / relay / proxy）、CF 线路（cf / cloudflare / 优选 / 官方）、兜底（没命中关键词的都进这里，后缀匹配）。每组显示策略和命中了几个域名。</li>
        <li><b>改分组。</b>点开一组就能改：关键词框里直接输词，比如在代理组里输 <code>美国 日本 新加坡</code>，名字带这些词的线路就进代理组；策略框里填你代理软件里的策略组名，比如 Surge 里的 <code>新加坡手动</code>、<code>美国</code>，填 Proxy 就是通用代理；点 <code>DOMAIN ⇄</code> 胶囊切换精确还是后缀匹配。</li>
        <li><b>单条线路。</b>点某条域名后的策略徽章，在这组策略和直连之间切换；点 <code>DOMAIN / DOMAIN-SUFFIX</code> 胶囊改这条的匹配方式，只影响这条域名。</li>
        <li><b>生成规则。</b>勾选要用的软件，点「⬇ 下载全部」或每行单独下载 / 复制，然后导入到对应的代理软件：Surge 导入 <code>.sgmodule</code>（通用 Proxy 时在模块里改 EmbyProxy 参数）；Shadowrocket 导入 <code>.sgmodule</code>；Egern 导入 YAML 规则文件；Loon 导入 <code>.plugin</code>（在插件详情里选策略组）；Quantumult X 导入 <code>.list</code>；Stash / Clash 把 YAML 当规则集导入。</li>
        <li><b>同步到 Gist（可选）。</b>在 GitHub 建一个带 <code>gist</code> 权限的令牌，粘贴到页面下方的令牌框，点「同步到 Gist」，规则会写进一个私有 Gist；同步成功后「一键导入（Gist）」区会给出每个文件的地址，复制到代理软件里直接导入（GitHub 约 5 分钟缓存）。</li>
        <li><b>隐私。</b>同步到 Gist 的只有域名，不含账号密码；令牌只存在本机浏览器，只发给 api.github.com；保存的服务器和密码从不上传。</li>
      </ol>
    </details>
    <div class="rt-sec-label">线路管理</div>
    <div class="card">
      <button type="button" id="btnRtBatch" class="rt-manage-row"><span class="rt-manage-ico">☰</span><span class="rt-manage-text">批量管理线路 / 调整策略组</span><span class="rt-chev">›</span></button>
      <button type="button" id="btnRtSpeedAll" class="rt-manage-row"><span class="rt-manage-ico">📶</span><span class="rt-manage-text">整库线路测速</span><span class="rt-chev">›</span></button>
    </div>
    <div class="rt-sec-label">分流方式</div>
    <div class="card">
      <div id="rtGroups"></div>
      <button type="button" id="btnRtEditGroups" class="rt-edit-link"><span>⚙️</span><span>编辑分组（关键词 / 策略 / 顺序）</span></button>
    </div>
    <p class="route-count">单线路设置优先，其余按分组顺序匹配。点行看域名，点胶囊切换精确 / 后缀。Loon 非直连统一走 PROXY。</p>
    <div class="card" style="margin-top:12px">
      <label>生成哪些软件 <span id="rtToolCount" style="font-weight:400"></span></label>
      <div class="rt-tools" id="rtTools"></div>
      <div class="route-actions" style="margin-top:12px">
        <button type="button" id="btnRtDownload" class="mini-btn">⬇ 下载全部</button>
        <button type="button" id="btnRtCopy" class="mini-btn">复制全部</button>
      </div>
      <div id="rtFiles" style="margin-top:4px"></div>
      <div class="rt-sync">
        <div class="rt-sync-row"><span>域名</span><b id="rtDomainCount">0 个</b></div>
        <div class="rt-sync-row"><span>本地更新时间</span><b id="rtLocalTime">—</b></div>
        <div class="rt-sync-row"><span>Gist 更新时间</span><b id="rtGistTime">还没上传 Gist</b></div>
        <div class="rt-sync-row"><span>同步到</span>
          <select id="rtSyncDest">
            <option value="both">本地 + Gist</option>
            <option value="local">仅本地</option>
            <option value="gist">仅 Gist</option>
          </select>
        </div>
        <button type="button" id="btnRtSync" class="paste-btn" style="margin-top:12px;margin-bottom:0">↻ 立即同步</button>
        <p class="saved-note">策略可填任意策略组名（如 新加坡手动、美国）：通用 Proxy 时 Surge 模块用 EmbyProxy 参数，导入后在模块里就能改；填了具体名字时会直接用那个名字。Loon 插件在插件详情里选策略组；Shadowrocket / Egern 直接使用各分组和「兜底」里填的策略。</p>
      </div>
      <div id="rtImport" style="display:none">
        <label>一键导入（Gist）</label>
        <div id="rtImportLinks"></div>
        <p class="saved-note">导入或复制地址前先同步上传，成功后才提供链接。只上传域名，不含账号密码；GitHub 约 5 分钟缓存。</p>
      </div>
      <label>自动同步到 Gist</label>
      <input id="rtGistToken" type="password" placeholder="GitHub 令牌（需要 gist 权限）" autocomplete="new-password" autocapitalize="off">
      <div class="saved-row" style="margin-top:8px">
        <input id="rtGistId" type="text" placeholder="Gist ID（首次同步后自动填入）" autocomplete="off" autocapitalize="off">
        <button type="button" id="btnRtGist" class="mini-btn">同步到 Gist</button>
      </div>
      <label style="display:flex;align-items:center;gap:8px;margin-top:12px;cursor:pointer">
        <input type="checkbox" id="rtGistAuto" style="width:18px;height:18px;min-height:0;flex:none;accent-color:var(--accent);padding:0"> 保存服务器时自动同步
      </label>
      <p class="saved-note" id="rtGistStatus">令牌只存在本机浏览器，只发给 api.github.com，不经过本站服务器。没有令牌时先在 GitHub 创建一个带 gist 权限的令牌。</p>
    </div>
  </section>
  </div><!-- /view-routing -->

  <!-- 分组编辑 / 批量管理 / 整库测速弹窗（固定定位，不属于任一视图） -->
  <div id="rtGroupModal" class="rt-modal" style="display:none" role="dialog" aria-label="编辑分组">
    <div class="rt-modal-card">
      <div class="rt-modal-head">
        <b>编辑分组</b>
        <button type="button" id="btnRtGroupDone" class="mini-btn">完成</button>
      </div>
      <p class="saved-note" style="margin-top:0">单线路设置优先，其余按分组顺序匹配。点行看域名，点胶囊切换精确 / 后缀。Loon 非直连统一走 PROXY。</p>
      <div id="rtGroupEditor"></div>
    </div>
  </div>

  <div id="rtBatchModal" class="rt-modal" style="display:none" role="dialog" aria-label="批量管理线路">
    <div class="rt-modal-card">
      <div class="rt-modal-head">
        <b>批量管理线路</b>
        <button type="button" id="btnRtBatchDone" class="mini-btn">完成</button>
      </div>
      <p class="saved-note" style="margin-top:0">全部已保存服务器 + 当前表单的线路。勾选后批量改策略；点单个策略也可单独改。策略按域名保存，同域名线路共用。</p>
      <div class="route-actions" style="margin-top:0">
        <button type="button" id="btnRtBatchAll" class="mini-btn">全选</button>
        <button type="button" id="btnRtBatchDirect" class="mini-btn">设为直连</button>
        <button type="button" id="btnRtBatchProxy" class="mini-btn">设为代理</button>
        <button type="button" id="btnRtBatchAuto" class="mini-btn">恢复自动</button>
      </div>
      <div id="rtBatchList" style="margin-top:6px"></div>
      <div class="route-actions" style="margin-top:14px">
        <button type="button" id="btnRtBatchEditGroups" class="mini-btn">⚙️ 编辑分组</button>
      </div>
    </div>
  </div>

  <div id="rtSpeedModal" class="rt-modal" style="display:none" role="dialog" aria-label="整库线路测速">
    <div class="rt-modal-card">
      <div class="rt-modal-head">
        <b>整库线路测速</b>
        <button type="button" id="btnRtSpeedDone" class="mini-btn">完成</button>
      </div>
      <div class="speed-head"><span id="rtSpeedStatus"></span></div>
      <div class="speed-summary" id="rtSpeedSummary"></div>
      <div id="rtSpeedRows"></div>
      <div class="route-actions" style="margin-top:12px">
        <button type="button" id="btnRtSpeedFastest" class="mini-btn" style="display:none">⚡ 用最快线路</button>
        <button type="button" id="btnRtSpeedCopy" class="mini-btn" style="display:none">复制结果</button>
      </div>
      <p class="speed-note">测全部已保存服务器的线路，每条测 3 次取最快；点一行把该线路切进表单（只勾选它）。</p>
    </div>
  </div>

  <p class="foot">密码只在本地拼进链接 · 不上传 · 不保存到服务器</p>
  <p class="foot">💗 感谢奥斯卡卡的鼎力协助</p>

</div>

<!-- 底部切换栏：一键导入 / 分流同步 -->
<nav class="tabbar" aria-label="页面切换">
  <div class="tabbar-inner">
    <button type="button" data-view="import" class="active" aria-current="page"><span class="tab-ic">⬇️</span><span>一键导入</span></button>
    <button type="button" data-view="routing"><span class="tab-ic">🔀</span><span>分流同步</span></button>
  </div>
</nav>

<div class="toast" id="toast"></div>

<!-- 策略名候选（可手动填任意策略组名；国家来自用户的 Surge 策略组） -->
<datalist id="rtPolicyList">
  <option value="DIRECT"></option>
  <option value="Proxy"></option>
  <option value="新加坡"></option>
  <option value="新加坡手动"></option>
  <option value="日本"></option>
  <option value="日本手动"></option>
  <option value="韩国"></option>
  <option value="韩国手动"></option>
  <option value="香港"></option>
  <option value="台湾"></option>
  <option value="美国"></option>
  <option value="中国"></option>
  <option value="便宜流量"></option>
</datalist>
<datalist id="rtQxList">
  <option value="跟随策略"></option>
  <option value="DIRECT"></option>
  <option value="Proxy"></option>
  <option value="新加坡"></option>
  <option value="新加坡手动"></option>
  <option value="日本"></option>
  <option value="日本手动"></option>
  <option value="韩国"></option>
  <option value="韩国手动"></option>
  <option value="香港"></option>
  <option value="台湾"></option>
  <option value="美国"></option>
  <option value="中国"></option>
  <option value="便宜流量"></option>
</datalist>

<script>
var APPS = [
  { id:'senplayer', icon:'data:image/jpeg;base64,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', name:'SenPlayer', color:'#007AFF', emoji:'▶️',
    build:function(p, routes){ var u='senplayer://importserver?type=emby&name='+enc(p.name)+'&address='+enc(p.address)+'&username='+enc(p.username)+'&password='+enc(p.password); (routes||[]).slice(1).forEach(function(r,i){ u+='&address='+enc(r.url)+'&backup='+enc(routeName(r,i+1)+'|'+r.url); }); return u; } },
  { id:'rex', icon:'data:image/jpeg;base64,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', name:'Rex', color:'#FF3B30', emoji:'🦖',
    build:function(p, routes){ var u='rex://import?type=emby&scheme='+p.scheme+'&host='+enc(p.hostPath)+'&port='+p.port+'&username='+enc(p.username)+'&password='+enc(p.password)+'&title='+enc(p.name); (routes||[]).slice(1).forEach(function(r,i){ u+='&line'+(i+1)+'='+enc(r.url)+'&line'+(i+1)+'title='+enc(routeName(r,i+1)); }); return u; } },
  { id:'eplayerx', icon:'data:image/jpeg;base64,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', name:'EplayerX', color:'#5856D6', emoji:'🎬',
    build:function(p, routes){ var u='https://eplayerx.com/add-or-update?type=emby&href='+enc(p.address)+'&username='+enc(p.username)+'&password='+enc(p.password); var ex=(routes||[]).slice(1); if(ex.length) u+='&backupHref='+enc(ex.map(function(r,i){ return r.url+';'+routeName(r,i+1); }).join(',')); if(p.name) u+='&remark='+enc(p.name); return u; } },
  { id:'vidora', icon:'data:image/jpeg;base64,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', name:'Vidora', color:'#34C759', emoji:'📺',
    build:function(p, routes){ var u='vidora://emby/import?server_url='+enc(p.origin)+'&server_path='+enc(p.path)+'&username='+enc(p.username)+'&password='+enc(p.password)+'&name='+enc(p.name)+'&primary_endpoint_name='+enc('直连')+'&server_remark='+enc(p.name)+'&match_enabled=true&auto_connect=false&allow_insecure_https=false&prefer_original_path=false&playback_reminder_enabled=false&playback_reminder_interval_days=20'; (routes||[]).slice(1).forEach(function(r,i){ u+='&backup='+enc(routeName(r,i+1)+'|'+r.url); }); return u; } },
  { id:'noctra', icon:'data:image/jpeg;base64,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', name:'Noctra', sub:'核对后导入',
    build:function(p){ return 'noctra://server/import?provider=emby&url='+enc(p.address)+'&username='+enc(p.username)+'&password='+enc(p.password)+'&name='+enc(p.name); } },
  { id:'rodel', icon:'data:image/png;base64,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', name:'小幻影视', sub:'仅 Windows',
    build:function(p){ return 'rodelplayer://import?type=emby&title='+enc(p.name)+'&scheme='+p.scheme+'&host='+enc(p.host)+'&port='+p.port+(p.path?'&path='+enc(p.path.replace(/^\\//,'')):'')+'&username='+enc(p.username)+'&password='+enc(p.password); } },
  { id:'hills', icon:'data:image/jpeg;base64,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', name:'Hills',
    build:function(p){ return 'hills://import?type=emby&address='+enc(p.address)+'&scheme='+p.scheme+'&host='+enc(p.host)+'&port='+p.port+'&username='+enc(p.username)+'&password='+enc(p.password); } },
  { id:'filebar', icon:'data:image/jpeg;base64,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', name:'FileBar',
    build:function(p){ return 'filebar://emby/import?server_url='+enc(p.origin)+'&server_path='+enc(p.path)+'&username='+enc(p.username)+'&password='+enc(p.password)+'&name='+enc(p.name); } },
  { id:'vidhub', icon:'data:image/jpeg;base64,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', name:'VidHub', color:'#34C759', emoji:'▶️',
    build:function(p, routes){ var u='vidhub://import?type=emby&address='+enc(p.address)+'&scheme='+p.scheme+'&host='+enc(p.host)+'&port='+p.port+'&username='+enc(p.username)+'&password='+enc(p.password); (routes||[]).slice(1).forEach(function(r,i){ u+='&line'+(i+1)+'='+enc(r.url)+'&line'+(i+1)+'title='+enc(routeName(r,i+1)); }); return u; } },
  { id:'lenna', icon:'data:image/jpeg;base64,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', name:'Lenna', color:'#FF9500', emoji:'▶️',
    build:function(p){ return 'lenna://emby/import?server_url='+enc(p.origin)+'&server_path='+enc(p.path)+'&username='+enc(p.username)+'&password='+enc(p.password)+'&name='+enc(p.name); } },
  { id:'afusekt', icon:'data:image/jpeg;base64,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', name:'Afusekt', color:'#FF2D55', emoji:'▶️',
    build:function(p){ return 'afusekt://media.server?address='+enc(p.address)+'&account='+enc(p.username)+'&password='+enc(p.password)+'&type=emby'; } },
  { id:'streama', icon:'data:image/jpeg;base64,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', name:'Streama', color:'#000000', emoji:'▶️',
    build:function(p){ return 'streama://importserver?type=emby&name='+enc(p.name)+'&address='+enc(p.address)+'&username='+enc(p.username)+'&password='+enc(p.password); } },
  { id:'capyplayer', icon:'data:image/jpeg;base64,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', name:'CapyPlayer', color:'#A67C52', emoji:'▶️',
    build:function(p){ var j={serverType:'emby',host:p.host,port:+p.port,https:p.scheme==='https'}; if(p.username)j.username=p.username; if(p.password)j.password=p.password; if(p.path)j.path=p.path; return 'com.feifeiduck.capyplayer://add-resource?data='+b64u(JSON.stringify(j)); } },
  { id:'denplayer', icon:'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAQDAwMDAgQDAwMEBAQFBgoGBgUFBgwICQcKDgwPDg4MDQ0PERYTDxAVEQ0NExoTFRcYGRkZDxIbHRsYHRYYGRj/2wBDAQQEBAYFBgsGBgsYEA0QGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBj/wAARCACAAIADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD7+ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAqjq+s6ToGkTarrep2mnWMI3SXN3KsUaD3ZiBVm6uYLOxmu7mRYoYUaSR26KoGST9ADX5nfGz9pPWfEviu5vrNY2O9ho8M6h4tPgzhZvLPytO+M7j90EY9mlcaVz7qufj98LLVIpZfEUgt5jiK5NlOsUh/2HZAG/DNb2kfFD4f65tGneLNNZm+6k0vksfwfBr8+fC37NP7Q3xz8HW/jfX/Fipa3Sefp6+JNRneSdD910jVWESEdDgZGDjBBrC179nf8AaS8AbpR4a1XULaPnz9EuBfoQO+wfOPxSnoFj9T0kjljEkbq6MMhlOQfxp1fkToPx3+JfhO6EcOr3ULxnBQu8DD2wCP5V7F4X/bl8b6cY49at1v416+dGr5/FdrfrRYLH6KUV8o+Ff25PA+pukOvaa9k56vFJgf8AfLgf+hV7Z4d+N/wy8TQxvYeKLSNn6Jcny8f8C+7+tLlYj0Kioba7tby3W4tLiKeJukkTh1P4jivNP2g/iB4n+GfwG1Xxb4R0Y6nqUDRxgeUZVt1Y4MzKOSq8Z+uTwKQHL/tNfF3xB8PvDmheFfADQyeNvE9+lhp0ZCs0aswUybTkfeZVBIx949qtfszfFrWPiX8OtQ07xk0aeMPD19JpuqxBQhYqxCyFRgDJVlOBjK+9eL/sq6R4b+KnxHk+M/jb4lx+MPHtrHmLRmjMI0gMCu8I2N+ASqsg8tcnGWORT/agj0T4M/F9fit8N/iD/wAI9461UKbzw5HAZ01IZCmYqMiPOBneNrkZHzZy7DPuOiuQ+FviLX/Fvwc8O+JPFGjvpGr39kk9zZOhQxsc/wAJ5GRhsHpmuvpCCiiigDi/i9FfT/ALxpDpm77W+iXYjC9SfJbp79a/H+wgtda+Jmm2OsXCwWV3qFtbXErHAjhZ0RjnsAma/bJ0SSNo5FVlYYKsMgj0Nfnh+0H+xj4q0vxHe+J/hZprazo1wzStpUJzcWueSqqf9YnPGMnHBHGS0NH6D2ttb2dlFaWkSQwQoIookGFRVGAAPQACvEv2j/iqPBng8eF9HuSmu6vGVMiHDWtv0Z/Zm5Vf+BHtXxJ4U/ao/aA+EksHhvWbh7+2s1ES6X4ls2EsaLwFEnyyAADAyTisLXPjo/jnxje+IvFlvcQ3t5JvZoT5kcajhUUcEKowAOf1ppBY6O4t7a7g8u7ghnjx92ZA4x+Ne7fDr9jHwV4y+Ga674sTVdFvtQxNZJps3lmGHHys6OGUluuMDAx3Jrhv2fNK8F/Eb4mQJqniLSV06y23ElncXKxSXjZ+WJUYgsMjLYHQY/ir9CFwqBVAAxgY4H4U5MGfnh8Vf2ItS8D+F73xNovxF0y7061Te0GrW7W0zEnCorR7lZiSABha+bJdB8ZeHZftEVrfwbf+W1m5dfzQ/wA6+0f2g/ikPGnjI+HNHud2haVIV3IflurgcNJ7qvKr/wACPcV5h4Z8Oan4q8WWPh/RYfNvbyTy09EHVnY9lUAkn0FNLQZ5B4W+O/xI8J3oNhr85ZT8ys5R/wASpB/Ovqr4Oftm6rrerQ6F4q0p9RZ/lCwKGuGGOSmABJgc7SM+9fRafAP4VXPgCy8La/4M0fW4raPa13eWq+fI55aTzBh1JJJ4bjgdq+Sf2g/2TZPhfpsnxQ+Ed/qA03TXFzdac0rNPp4ByJ4JR8zIpwSD8yj5skA4m/cR13x50HQPhn4u8F/tT/CW2hh05L9Iddh01RHFcwSHazFBgKzDfGwOPmKE4IzW9+yz4Cj+JHijxB+0j4+08X2qazqUo0NLtNy2tsh2q6KeMgAIp7BCR97Ncd+yd8bJvGPxD1HwB4zt7a9i1+Jp5o5o1MM10oyzmMjaDIq/MAMFlBxzX3PbW1tZ2cVpZ28VvbxKEjiiQIiKOgAHAHsKHoHkS0UUVIgooooAK8w+LPxv8L/Cm08m+huNS1VoTcLYWo/1cYOPMlfpGmeAT1PQV6Re3cFhptxfXThIII2lkY/wqoJJ/IGvy3+JXxI8TfGPxpa+A/DKG4n13Uknudp2tfXchxDG7dobeMqir0GHc8mmkNI2fid+174h+IFvcaTdeCvB81gQUjF5pwvWUHuHlPB9wBXzVdGCa5eVbfyS3OyIAIPoP/r1+l3w6/Yk+Efhnw/B/wAJpYv4v1lkBuJ7qaSO2V+4iiQj5R6tuJ68dK9Ei/Zn+AcH3PhR4ZP+/a7/AOZNFwPyEKKGBIBxyCe1dv4c+MnxT8IWEth4f+IGuWdnLGYntGuzLEVIwQEfIXjuuCK/VKL9n/4HwHdH8J/CAx66XEf5ir0XwV+DsA/dfCzwav8A3B4D/wCy0XC5+UmnfFXUIMLqNja3C9C0L+W35civq39lj41fBPS9TeLXtan03xZqky2dv9utm8lEZgFjSVcrl2xknH8I7c/WY+D/AMJR0+F/g7/wTW//AMRU1p8K/hfY38N9Y/DjwnbXMDiSKeHSIFeNwchlYJkEHkGnzBc1PEE0qQQxqxVHJ3Ed8dqo6XDHqEF3pN7EtxZXELRywycqyt8rA+xBIro54ILmHyp4w6nnB9fWo4rS3tIXW3jCZ6nOSfxpBc/Jr4ZxS+A/209D0qGRkGneKP7OBbuguDEAfqABX65DpX5MfGVT4Z/bo8QXEY8v7P4oS8XHGN0qS/8As1frMpBXIOQeaGDFooopCCiiigDl/iUkknwZ8WpExVzo14FI9fIevy+/ZSnjX9r7wRLOA+67kUZ7M1vKAa/VXxLafb/BurWOM+fZzRY/3o2H9a/JH9nu5/sz9qfwJIx27dbt4m/4E/ln/wBCqkNH6+AjaMelLn9eKaOFA9OKXjgn1qRH5bfEX9qT4pwftS6t4n0XxXqUGk6TqskFroyTEWkltDIUKSRfdYuFJLHnLcEYFfp9pOpW+s6DY6vaEm3vLeO5iJ7q6hh+hFfjP8TvD134d+MvjDRLyNhNaaveRkEdcysyn8VZSPqK/UWw8T6Ro3wH0jwfPqd3FqyeHoNPklsU3vay/ZVQsGJA3KeevUUpNLc3o4erXly0otvyOb+OX7WngT4SC40PSDH4m8Vplf7OtZQIbVvW4lGdv+4Mt/u9a+QPBHj39pP48/tFaXrXh/XtXe5s7yKST7E7W+mabBvBYSIDs2lcgq2536c1zWp/sx/Eezid9NutJ1gqScRztFJJ74kGNx6n5uvem+C/j38cvgWy+ELG9FlaWkm46Jq2nxvGCTknICvg/wB4Nz2NKM1LZmlfBV8P/Fg0frTwKQ8giuS+F/jN/iH8G/DXjaWxFjJq+nxXclsGLCNmHzAE8kZBwfTFdaelUch+Vv7YNqdO/bA8SzKMeatrdA+5t4+fzU1+ovh28/tDwhpd+DkXFnDNn/ejU/1r82v26rIW/wC08ZwP+PrRbVz7keYn/sor9BvhHe/2j8A/BV7nJl0KyYn38hM02NnZUUUUhBRRRQAjAMhVhkHgivxr8PO3hz9pGwY/IdP8Sxj6bLsf4V+yp6V+OXxbtW8O/tQeM4ANptNfuZF+nnFx/MU0NH7AGUeY3PRiP1pRID3rPgvIr7TLS/jIZLmFJlI7hlDD+dSBh2OKLAeIfHP4VfDPVfEdh4z1LwlbXPiOaRUa8MjqrrEAQZIwwR2HygFgTgd8CuT8zjA5xX0N4l8P2nifRTp947RlW3xTR/ejbGM4PUeo715JffDDxZZTEWsMGoRZ4e3kCkj3VsEfrXHXhNu62PuOHMfhKVD2U5KM7630v21/Q5VJWRgykgj0rh/i38ML34x6Paafo1rA/idJkSyuHwmELASB2/uBcufdOOTz7BY/DXxhdzhJNNW0UnmS4lVQPwBJP5V6n4N8C2PhRGuXl+16hIu1pyuAi/3UHYep6mppU58yZ15zmeCVCVNSU5NWSWvzv5bmx4T8PWfhHwJo3hbTv+PTSrKGyiOMbljQLk+5xn8a1mPFNL1zvi/xl4f8F+FLzxB4j1SDT9PtULSzynp6Ko6sx6BRyTXekfnlj4A/byuYZf2i9OiQgvDocAf2zLMw/Qivuv4FwS237NHgKGcEONBs8594lP8AWvzL8Vaprf7R/wC1Uf7LtJVm16+js7SBuTb2ygKCxH92NS7HpndX606Rptto2gWOkWa7bazt47aIeiIoVf0AoYMuUUUVIgooooADyMV+W/7aPhKbwz+1fqep+QVs9dt4dRibszbRHIPruQ/99Cv1Irxb9pH4D2nxw+HUVpazw2XiLTGabTbuQfISw+aJyOdjYHPYgHnkFoDO/Zt+I1h8Qv2d9AC3iNquk2yabexE/MrxLtUn2ZArA98n0NesgyA4Ktmvyhez+Nf7PHjWWV7TW/C96v7tpxHut7hAem7BjlTPPf8AA12q/tqfGkWghfUNBdgMeadPUMfyYD9KpWK0P0r8wqMuVX/eOKjmv7W1hM81zFGgHLs2B+fSvy6vf2lfjz4olNvZ+K79WfgRaRaJG34eWm79aZbfCz9pT4lyrPN4X8aaokh4n1Z5I4z+M7AflT0C5+iOt/Hz4ReGlb+1/H+iQuvWJLgTSf8AfMe4/pXl/iP9uX4Q6UHTR4Nc1yQdPItRAh/4FKQf/Ha+f/Dv7B3xl1XDa5qPh3QIz1WW5a5kH/AY1K/+PV6z4c/4J6eF7cxyeK/iDq1+erw6dbR2y/Tcxc/oKV0FzgPF37e/i6+R4fCHhHTdJU5Anv5WupB77RsX+deNxr8d/wBpPxbGkUeteJ5VbCuR5dnaA984EUQ/U+9foP4U/ZK+A3hN45oPBEGqXKEET6xK92f++WOz/wAdr2Sx0+w0yxjstNsreztoxhILeNY0QeyqABSuK54L+zb+zHpPwU059d1meDVvGF5F5c12i/urOM8mKHPPOBuc4JxjAHX6DooqRBRRRQAUUUUAFFFFAENza215bPb3dvFPC4w0cqB1Ye4PBrnG+Gfw4efzn+H/AIWaTrvOlQFs/XZXU0UAUdP0XR9Jj8vStKsrFOm21gSIf+OgVewKKKACiiigAooooAKKKKACiiigD//Z', name:'DenPlayer', color:'#EC4899', emoji:'🎬',
    build:function(p){ return 'denplayer://emby/import?server_url='+enc(p.address)+'&server_path=&username='+enc(p.username)+'&password='+enc(p.password)+'&name='+enc(p.name); } },
];
function enc(s){ return encodeURIComponent(s||''); }
function routeName(r, idx){ var n=(r&&r.name||'').trim(); return n || ('线路'+(idx+1)); }
function b64u(s){ return btoa(String.fromCharCode.apply(null,new TextEncoder().encode(s))).replace(/\\+/g,'-').replace(/\\//g,'_').replace(/=/g,''); }
function $(id){ return document.getElementById(id); }
function toast(m){ var t=$('toast'); t.textContent=m; t.classList.add('show'); clearTimeout(t._t); t._t=setTimeout(function(){ t.classList.remove('show'); },2000); }

function parseAddr(raw){
  var a=(raw||'').trim();
  if(!a) return null;
  if(!/^https?:\\/\\//i.test(a)) a='https://'+a;
  var u;
  try{ u=new URL(a); }catch(e){ return null; }
  var scheme=u.protocol.replace(':','');
  var port=u.port || (scheme==='https' ? '443' : '80');
  var path=u.pathname && u.pathname!=='/' ? u.pathname.replace(/\\/$/,'') : '';
  return { scheme:scheme, host:u.hostname, port:port, hostPath:u.hostname+path, address:u.origin+path, origin:u.origin, path:path };
}

function escapeHtml(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

// ---- 多线路 ----
var LS_ROUTES='embyimp_routes';
var routes=[]; // [{name, url, checked}]
function loadRoutesState(){
  try{
    var l=JSON.parse(localStorage.getItem(LS_ROUTES)||'null');
    if(Array.isArray(l) && l.length){
      routes=l.map(function(r){ return { name:(r&&r.name)||'', url:(r&&r.url)||'', checked:r&&r.checked!==false }; }).filter(function(r){ return r.url; });
      if(routes.length) return;
    }
  }catch(e){}
  var old=localStorage.getItem('embyimp_address')||'';
  routes=old?[{name:'', url:old, checked:true}]:[{name:'', url:'', checked:true}];
}
function saveRoutesLocal(){
  try{ localStorage.setItem(LS_ROUTES, JSON.stringify(routes)); }catch(e){}
}
function getCheckedRoutes(){
  return routes.filter(function(r){ return r.checked && r.url && r.url.trim(); }).map(function(r){ return { name:(r.name||'').trim(), url:r.url.trim() }; });
}
function renderRoutes(){
  var box=$('routesList');
  box.innerHTML='';
  routes.forEach(function(r, i){
    var row=document.createElement('div');
    row.className='route-row'+(r.checked?'':' unchecked');
    row.innerHTML='<div class="route-top">'
      +'<input type="checkbox" '+(r.checked?'checked':'')+' aria-label="导入时包含此线路">'
      +'<input type="text" class="route-name" placeholder="线路名，如 主线路" value="'+escapeHtml(r.name||'')+'">'
      +'<button type="button" class="route-del" title="删除此线路">✕</button>'
      +'</div>'
      +'<input type="url" class="route-url" placeholder="https://…" value="'+escapeHtml(r.url||'')+'" autocapitalize="off" spellcheck="false">';
    var cb=row.querySelector('input[type="checkbox"]');
    var nm=row.querySelector('.route-name');
    var ur=row.querySelector('.route-url');
    var del=row.querySelector('.route-del');
    cb.onchange=function(){ r.checked=cb.checked; saveRoutesLocal(); renderRoutes(); render(); };
    nm.oninput=function(){ r.name=nm.value; saveRoutesLocal(); render(); renderRouting(); };
    ur.oninput=function(){ r.url=ur.value; saveRoutesLocal(); render(); renderRouting(); };
    del.onclick=function(){
      if(routes.length<=1){ toast('至少保留一条线路'); return; }
      routes.splice(i,1); saveRoutesLocal(); renderRoutes(); render();
    };
    box.appendChild(row);
  });
  var n=getCheckedRoutes().length;
  $('routeCount').textContent=routes.length>1 ? ('（共 '+routes.length+' 条，已勾选 '+n+' 条）') : '';
  renderRouting();
}
function setRoutes(list){
  routes=(list||[]).map(function(r){ return { name:(r&&r.name)||'', url:(r&&r.url)||'', checked:r&&r.checked!==false }; }).filter(function(r){ return r.url; });
  if(!routes.length) routes=[{name:'', url:'', checked:true}];
  saveRoutesLocal();
  renderRoutes();
  render();
}
$('btnAddRoute').onclick=function(){
  routes.push({name:'', url:'', checked:true});
  saveRoutesLocal(); renderRoutes();
  var rows=$('routesList').querySelectorAll('.route-url');
  if(rows.length) rows[rows.length-1].focus();
};

// ---- 多线路识别 ----
var ROUTE_LABELS=['主线路','备用线路','主用线路','线路1','线路2','线路3','线路4','线路5','线路 1','线路 2','线路 3','线路 4','线路 5','国内直连','国际代理','直连线路','代理线路','电信线路','联通线路','移动线路','香港线路','美国线路','日本线路','新加坡线路','韩国线路','台湾线路','海外线路','国内线路'];
function cleanRouteName(s){
  var t=(s||'').replace(/^[|｜:：=,，、\\s]+/, '').replace(/[|｜:：=,，、\\s]+$/, '').trim();
  t=t.replace(/^(地址|线路地址|服务器地址|Emby地址)[|｜:：\\s]*/, '');
  return t;
}
function parseRoutes(text){
  var out=[];
  if(!text) return out;
  var seen={};
  function push(name, url){
    url=(url||'').replace(/[。,.，、;；）\\)\\]]+$/, '').trim();
    if(!/^https?:\\/\\//i.test(url)) return;
    if(seen[url]) return;
    seen[url]=1;
    out.push({name:(name||'').trim(), url:url});
  }
  var lines=text.replace(/\\r\\n?/g,'\\n').split('\\n');
  var pendingLabel='';
  lines.forEach(function(raw){
    var line=raw.trim();
    if(!line) return;
    var labelOnly=line.replace(/[|｜:：=,，、\\s]+$/,'').trim();
    if(!/https?:\\/\\//i.test(line) && ROUTE_LABELS.indexOf(labelOnly)>=0){ pendingLabel=labelOnly; return; }
    var urls=line.match(/https?:\\/\\/[^\\s\\u4e00-\\u9fa5"'<>]+/g)||[];
    if(!urls.length){ pendingLabel=''; return; }
    urls.forEach(function(u){
      var before=line.slice(0, line.indexOf(u));
      var name='';
      var m=before.match(/([^\\s|｜:：=,，、]+)\\s*[|｜:：=,，、\\s]*$/);
      if(m) name=cleanRouteName(m[1]);
      if(!name && pendingLabel) name=pendingLabel;
      push(name, u);
    });
    pendingLabel='';
  });
  return out;
}

// ---- 线路测速 ----
var speedResults=[]; // [{index, name, url, ms|null, error, via}]
var SPEED_TIMEOUT=5000;
function probeURL(routeUrl){
  var base=routeUrl.replace(/\\/+$/,'');
  return [base+'/System/Info/Public', base+'/'];
}
async function measureDirect(url, timeout){
  var ctrl=new AbortController();
  var to=setTimeout(function(){ ctrl.abort(); }, timeout);
  var t0=performance.now();
  try{
    await fetch(url, { mode:'no-cors', cache:'no-store', signal:ctrl.signal });
    return { ms:Math.round(performance.now()-t0) };
  }catch(e){
    return { error: (e&&e.name==='AbortError') ? '超时' : '无法连接' };
  }finally{ clearTimeout(to); }
}
async function measureViaWorker(url, timeout){
  var ctrl=new AbortController();
  var to=setTimeout(function(){ ctrl.abort(); }, timeout+2000);
  try{
    var res=await fetch('/speed?url='+encodeURIComponent(url), { signal:ctrl.signal });
    var j=await res.json();
    if(j && j.ok) return { ms:j.ms };
    return { error:(j&&j.error)||'测速失败' };
  }catch(e){
    return { error:'测速服务不可用' };
  }finally{ clearTimeout(to); }
}
async function testOneRoute(route, idx){
  var probes=probeURL(route.url);
  var best=null, lastErr='无法连接', via='device';
  for(var a=0;a<3 && best==null;a++){
    for(var pi=0;pi<probes.length;pi++){
      var r=await measureDirect(probes[pi], SPEED_TIMEOUT);
      if(r.ms!=null){ best=r.ms; break; }
      lastErr=r.error||'无法连接';
      if(lastErr==='超时') break;
    }
    if(lastErr==='超时') break;
  }
  if(best==null){
    for(var pi2=0;pi2<probes.length;pi2++){
      var r2=await measureViaWorker(probes[pi2], SPEED_TIMEOUT);
      if(r2.ms!=null){ best=r2.ms; via='edge'; break; }
      lastErr=r2.error||lastErr;
      if(lastErr==='超时') break;
    }
  }
  return { index:idx, name:route.name, url:route.url, ms:best, error:best==null?lastErr:undefined, via:via };
}
function speedGrade(ms){
  if(ms==null) return { label:'不可用', cls:'na' };
  if(ms<300) return { label:'快', cls:'good' };
  if(ms<800) return { label:'一般', cls:'mid' };
  return { label:'慢', cls:'bad' };
}
function renderSpeed(){
  var box=$('speedSection');
  var rows=$('speedRows');
  var sum=$('speedSummary');
  if(!speedResults.length){ box.classList.remove('show'); return; }
  box.classList.add('show');
  var ok=speedResults.filter(function(r){ return r.ms!=null; });
  var sorted=speedResults.slice().sort(function(a,b){ return (a.ms==null?1e9:a.ms)-(b.ms==null?1e9:b.ms); });
  var fastest=ok.length?Math.min.apply(null, ok.map(function(r){ return r.ms; })):null;
  var median=null;
  if(ok.length){
    var msList=ok.map(function(r){ return r.ms; }).sort(function(a,b){ return a-b; });
    median=msList[Math.floor(msList.length/2)];
  }
  sum.innerHTML='<div class="sv"><b>'+ok.length+'/'+speedResults.length+'</b><span>可用线路</span></div>'
    +(fastest!=null?'<div class="sv"><b>'+fastest+'ms</b><span>最快</span></div>':'')
    +(median!=null?'<div class="sv"><b>'+median+'ms</b><span>中位延迟</span></div>':'');
  rows.innerHTML='';
  sorted.forEach(function(r, rank){
    var g=speedGrade(r.ms);
    var row=document.createElement('div');
    row.className='speed-row';
    var host='';
    try{ host=new URL(r.url).host; }catch(e){ host=r.url; }
    row.innerHTML='<div class="speed-rank'+(rank===0&&r.ms!=null?' fast':'')+'">'+(r.ms!=null?(rank+1):'—')+'</div>'
      +'<div class="speed-info"><div class="speed-name">'+escapeHtml(routeName(r, r.index))+'</div><div class="speed-host">'+escapeHtml(host)+(r.via==='edge'?' · 节点测':'')+'</div></div>'
      +'<div class="speed-ms">'+(r.ms!=null?'<b>'+r.ms+'ms</b><span class="'+g.cls+'">'+g.label+(fastest!=null&&r.ms>fastest?' · +'+(r.ms-fastest)+'ms':'')+'</span>':'<b>—</b><span class="na">'+escapeHtml(r.error||'不可用')+'</span>')+'</div>';
    row.onclick=function(){ useRouteAsPrimary(r.index); };
    row.title='点此只用这条线路';
    rows.appendChild(row);
  });
  $('btnUseFastest').style.display=ok.length?'':'none';
  $('btnRetryFailed').style.display=(speedResults.length-ok.length)>0?'':'none';
  $('btnCopySpeed').style.display=ok.length?'':'none';
}
function useRouteAsPrimary(idx){
  var res=null;
  for(var k=0;k<speedResults.length;k++){ if(speedResults[k].index===idx){ res=speedResults[k]; break; } }
  var pos=-1;
  if(res){
    for(var i=0;i<routes.length;i++){ if(routes[i].url===res.url){ pos=i; break; } }
  }
  if(pos<0) pos=idx;
  var r=routes[pos];
  if(!r) return;
  routes.forEach(function(x){ x.checked=false; });
  r.checked=true;
  routes.splice(pos,1);
  routes.unshift(r);
  saveRoutesLocal(); renderRoutes(); render();
  toast('已切换到：'+(r.name||r.url));
}
async function runSpeedTest(onlyFailed){
  var targets=[];
  routes.forEach(function(r, i){
    if(!r.checked || !r.url) return;
    if(onlyFailed){
      var failed=false;
      for(var k=0;k<speedResults.length;k++){ if(speedResults[k].index===i && speedResults[k].ms==null){ failed=true; break; } }
      if(!failed) return;
    }
    targets.push({ route:r, index:i });
  });
  if(!targets.length){ toast('没有可测的线路'); return; }
  $('speedStatus').textContent='测速中…';
  if(!onlyFailed) speedResults=[];
  renderSpeed();
  var done=0;
  await Promise.all(targets.map(async function(t){
    var res=await testOneRoute(t.route, t.index);
    var ex=-1;
    for(var k=0;k<speedResults.length;k++){ if(speedResults[k].index===t.index){ ex=k; break; } }
    if(ex>=0) speedResults[ex]=res; else speedResults.push(res);
    done++;
    $('speedStatus').textContent='测速中 '+done+'/'+targets.length;
    renderSpeed();
  }));
  $('speedStatus').textContent='完成';
  renderSpeed();
}
$('btnSpeed').onclick=function(){ runSpeedTest(false); };
$('btnUseFastest').onclick=function(){
  var ok=speedResults.filter(function(r){ return r.ms!=null; }).sort(function(a,b){ return a.ms-b.ms; });
  if(ok.length) useRouteAsPrimary(ok[0].index);
};
$('btnRetryFailed').onclick=function(){ runSpeedTest(true); };
$('btnCopySpeed').onclick=function(){
  var ok=speedResults.filter(function(r){ return r.ms!=null; }).sort(function(a,b){ return a.ms-b.ms; });
  var lines=['Emby 线路测速结果'];
  ok.forEach(function(r,i){ lines.push((i+1)+'. '+routeName(r,r.index)+'（'+r.url+'）'+r.ms+'ms'); });
  speedResults.filter(function(r){ return r.ms==null; }).forEach(function(r){ lines.push('✗ '+routeName(r,r.index)+'（'+r.url+'）'+(r.error||'不可用')); });
  var text=lines.join('\\n');
  if(navigator.clipboard && navigator.clipboard.writeText){ navigator.clipboard.writeText(text).then(function(){ toast('测速结果已复制'); }, function(){ fallbackCopy(text); toast('测速结果已复制'); }); }
  else { fallbackCopy(text); toast('测速结果已复制'); }
};

function collect(){
  var routes=getCheckedRoutes();
  if(!routes.length) return null;
  var p=parseAddr(routes[0].url);
  if(!p) return null;
  return { name:$('name').value.trim()||'Emby', address:p.address, scheme:p.scheme, host:p.host, port:p.port, hostPath:p.hostPath, origin:p.origin, path:p.path,
           username:$('username').value.trim(), password:$('password').value, routes:routes };
}

function render(){
  var p=collect();
  var box=$('apps');
  box.innerHTML='<h2 class="apps-title">一键导入</h2><p class="apps-sub">点格子直接导入，右上角 ⧉ 复制链接</p><div class="grid" id="appGrid"></div>';
  var grid=$('appGrid');
  APPS.forEach(function(app, idx){
    var manual=!!app.manual;
    var disabled=!!app.disabled;
    var link=manual ? app.build(p, p&&p.routes) : (p ? app.build(p, p.routes) : '');
    var tile=document.createElement('div');
    tile.className='tile'+((disabled || (!manual && !link))?' disabled':'');
    tile.setAttribute('tabindex','0'); tile.setAttribute('role','button');
    tile.setAttribute('aria-label', app.name+' 一键导入');
    var icoHtml = app.icon ? '<div class="ico"><img src="'+app.icon+'" alt="'+app.name+'"></div>' : '<div class="ico" style="background:'+app.color+'">'+app.emoji+'</div>';
    tile.innerHTML=icoHtml
      +'<div class="tinfo"><div class="tname">'+app.name+'</div><div class="tsub">'+(app.sub||'一键导入')+'</div></div>'
      +((manual||disabled)?'':'<button class="copy" title="复制链接">⧉</button>');
    tile.onclick=function(){
      if(disabled){ toast(app.name+' 暂不可用'); return; }
      if(!link){ toast('请先填写 Emby 地址'); return; }
      toast('正在打开 '+app.name+'…');
      window.location.href=link;
    };
    tile.addEventListener('keydown',function(e){
      if(e.key==='Enter'||e.key===' '){ e.preventDefault(); tile.onclick(); }
    });
    var cp=tile.querySelector('.copy');
    if(cp){
      cp.onclick=function(e){
        e.stopPropagation();
        if(!link) return;
        var done=function(){
          toast(app.name+' 链接已复制');
          cp.textContent='✓'; cp.classList.add('done');
          setTimeout(function(){ cp.textContent='⧉'; cp.classList.remove('done'); },1500);
        };
        if(navigator.clipboard && navigator.clipboard.writeText){ navigator.clipboard.writeText(link).then(done, function(){ fallbackCopy(link); done(); }); }
        else { fallbackCopy(link); done(); }
      };
    }
    grid.appendChild(tile);
  });
}
function fallbackCopy(text){
  var ta=document.createElement('textarea');
  ta.value=text; ta.style.position='fixed'; ta.style.opacity='0';
  document.body.appendChild(ta); ta.select();
  try{ document.execCommand('copy'); }catch(e){}
  document.body.removeChild(ta);
}

// ---- 剪贴板识别 ----
function parseClipboard(text){
  var out = { routes:[], username:'', password:'' };
  if(!text) return out;
  out.routes = parseRoutes(text);
  var um = text.match(/用户名称\\s*[|｜:：]\\s*([^\\s\\n]+)/) || text.match(/用户名\\s*[|｜:：]\\s*([^\\s\\n]+)/);
  if(um) out.username = um[1];
  var pm = text.match(/用户密码\\s*[|｜:：]\\s*([^\\s\\n]+)/) || text.match(/(?:^|[^\\u4e00-\\u9fa5])密码\\s*[|｜:：]\\s*([^\\s\\n]+)/);
  if(pm) out.password = pm[1];
  if(!out.username || !out.password){
    var lines = text.trim().split(/\\n+/);
    for(var i=0;i<lines.length;i++){
      var toks = lines[i].trim().split(/\\s+/);
      if(toks.length>=3 && /^https?:\\/\\//i.test(toks[0])){
        if(!out.routes.length) out.routes=[{name:'', url:toks[0]}];
        if(!out.username) out.username = toks[1];
        if(!out.password) out.password = toks[2];
        break;
      }
    }
  }
  return out;
}
function applyParsed(text){
  var r = parseClipboard(text);
  var filled = [];
  if(r.routes.length){ setRoutes(r.routes); filled.push(r.routes.length+' 条线路'); }
  if(r.username){ $('username').value=r.username; localStorage.setItem('embyimp_username', r.username); filled.push('用户名'); }
  if(r.password){ $('password').value=r.password; filled.push('密码'); }
  render();
  if(filled.length){ toast('已填入：'+filled.join('、')); $('manualPaste').style.display='none'; }
  else { $('manualPaste').style.display='block'; $('pasteText').value=text; toast('没识别到，检查一下内容'); }
}
$('btnPaste').onclick = async function(){
  var text = '';
  try { text = await navigator.clipboard.readText(); } catch(e) { text = ''; }
  if(!text){
    $('manualPaste').style.display='block';
    $('pasteText').focus();
    toast('剪贴板读取被拦截，请手动粘贴');
    return;
  }
  applyParsed(text);
};
$('btnParse').onclick = function(){ applyParsed($('pasteText').value); };

// ---- 已保存的服务器（localStorage，多条，含密码；新格式存 routes，旧格式自动迁移） ----
var LS_SERVERS='embyimp_servers';
function migrateServer(s){
  if(!s) return null;
  if(Array.isArray(s.routes) && s.routes.length){
    return { name:s.name||'Emby', routes:s.routes.map(function(r){ return { name:(r&&r.name)||'', url:(r&&r.url)||'', checked:r&&r.checked!==false }; }).filter(function(r){ return r.url; }), username:s.username||'', password:s.password||'', updatedAt:s.updatedAt||0 };
  }
  if(s.address){
    return { name:s.name||'Emby', routes:[{name:'', url:s.address, checked:true}], username:s.username||'', password:s.password||'', updatedAt:s.updatedAt||0 };
  }
  return null;
}
function getServers(){ try{ var l=JSON.parse(localStorage.getItem(LS_SERVERS)||'[]'); if(!Array.isArray(l)) return []; return l.map(migrateServer).filter(function(s){ return s && s.routes.length; }); }catch(e){ return []; } }
function setServers(l){ try{ localStorage.setItem(LS_SERVERS, JSON.stringify(l)); }catch(e){ toast('保存失败：浏览器存储已满'); } }
function serverAddr(s){ return s.routes && s.routes[0] ? s.routes[0].url : ''; }
function refreshSaved(keep){
  var sel=$('savedSelect'); var list=getServers();
  var cur=(keep!=null?keep:sel.value);
  sel.innerHTML='<option value="">— 选择已保存的服务器 —</option>';
  list.forEach(function(s,i){
    var o=document.createElement('option');
    o.value=String(i);
    o.textContent=(s.name||'Emby')+' · '+serverAddr(s)+(s.routes.length>1 ? '（'+s.routes.length+' 线路）' : '');
    sel.appendChild(o);
  });
  if(cur!=='' && cur!=null && list[Number(cur)]) sel.value=String(cur);
  renderRouting();
}
function fillForm(s){
  $('name').value=s.name||'';
  setRoutes(s.routes);
  $('username').value=s.username||'';
  $('password').value=s.password||'';
  localStorage.setItem('embyimp_name',$('name').value);
  localStorage.setItem('embyimp_username',$('username').value);
  render();
}
$('savedSelect').onchange=function(){
  var s=getServers()[Number(this.value)];
  if(!s) return;
  fillForm(s);
  toast('已填入：'+(s.name||serverAddr(s)));
};
$('btnSaveServer').onclick=function(){
  var rs=getCheckedRoutes();
  var user=$('username').value.trim();
  if(!rs.length||!user){ toast('先填线路和用户名'); return; }
  var entry={ name:$('name').value.trim()||'Emby', routes:rs, username:user, password:$('password').value, updatedAt:Date.now() };
  var list=getServers(); var idx=-1;
  for(var i=0;i<list.length;i++){ if(serverAddr(list[i])===serverAddr(entry)&&list[i].username===entry.username){ idx=i; break; } }
  if(idx>=0){ list[idx]=entry; } else { list.unshift(entry); if(list.length>200) list.length=200; }
  setServers(list);
  refreshSaved(idx>=0?idx:0);
  toast(idx>=0?'已更新':'已保存');
  rtMaybeAutoSync();
};
$('btnDelServer').onclick=function(){
  var v=$('savedSelect').value;
  if(v===''){ toast('先选一个已保存的服务器'); return; }
  var list=getServers(); var s=list[Number(v)];
  list.splice(Number(v),1);
  setServers(list);
  refreshSaved();
  toast('已删除：'+(s&&s.name||''));
  rtMaybeAutoSync();
};

// ---- 分流规则同步（从已保存服务器取域名，按关键词分组，生成各软件规则 + Gist 同步） ----
var LS_RT_OVERRIDES='embyimp_routing_overrides'; // {host:{policy:'DIRECT'|'PROXY', type:'DOMAIN'|'DOMAIN-SUFFIX'}}
var LS_RT_GROUPS='embyimp_routing_groups'; // [{id,name,enabled,policy,qx,keywords,match}]，兜底固定最后；旧格式 {id:[keywords]} 自动迁移
var LS_GIST_TOKEN='embyimp_gist_token';
var LS_GIST_ID='embyimp_gist_id';
var LS_GIST_OWNER='embyimp_gist_owner';
var LS_GIST_AUTO='embyimp_gist_auto';
var LS_GIST_UPDATED='embyimp_gist_updated';
var LS_RT_LOCAL='embyimp_rt_local_updated';
var LS_RT_DEST='embyimp_rt_sync_dest';
var LS_RT_TOOLS='embyimp_routing_tools';
function RT_DEFAULT_GROUPS(){
  return [
    {id:'direct', name:'直连', enabled:true, policy:'DIRECT', qx:'follow', keywords:['直连','直链','direct'], match:'DOMAIN'},
    {id:'proxy', name:'代理', enabled:true, policy:'PROXY', qx:'follow', keywords:['代理','中转','加速','relay','proxy'], match:'DOMAIN'},
    {id:'cf', name:'CF 线路', enabled:true, policy:'PROXY', qx:'follow', keywords:['cf','cloudflare','优选','官方'], match:'DOMAIN'},
    {id:'fallback', name:'兜底', enabled:true, policy:'PROXY', qx:'follow', keywords:[], match:'DOMAIN-SUFFIX'},
  ];
}
// 6 个软件，7 份文件：Stash / Clash 共用一个条目，生成两份同内容 YAML。
// Surge/Shadowrocket 是 .sgmodule（模块），Loon 是 .plugin（插件），Egern 是 YAML 规则，QX 是 .list，Stash/Clash 是 Clash payload YAML。
var RT_TOOLS=[
  {id:'surge', name:'Surge', files:['emby-proxy-surge.sgmodule'], fmt:'surge', hint:'模块，带 EmbyProxy 参数'},
  {id:'shadowrocket', name:'Shadowrocket', files:['emby-proxy.sgmodule'], fmt:'sgmodule', hint:'模块'},
  {id:'egern', name:'Egern', files:['emby-proxy-egern.yaml'], fmt:'egern', hint:'YAML 规则'},
  {id:'loon', name:'Loon', files:['emby-proxy.plugin'], fmt:'plugin', hint:'插件，详情里选策略组'},
  {id:'qx', name:'Quantumult X', files:['emby-proxy-qx.list'], fmt:'qx', hint:'规则列表'},
  {id:'stashclash', name:'Stash / Clash', files:['emby-proxy-stash.yaml','emby-proxy-clash.yaml'], fmt:'yaml', hint:'YAML，两份'},
];
var rtExpanded={}; // groupId -> bool
var rtLastSig='';
var rtLastContentSig='';

// 策略名可手动填：DIRECT（直连）、Proxy（通用代理）或任意策略组名（如 新加坡手动、美国）。
// 存的是规范值：'DIRECT' / 'PROXY' / 自定义名原文；显示时 PROXY 写作 Proxy。
// 国家/策略名候选（图里用户的 Surge 策略组）：新加坡、新加坡手动、日本、日本手动、韩国、韩国手动、香港、台湾、美国、中国、便宜流量。
function rtNormPolicy(v, def){
  var s=String(v==null?'':v).trim();
  if(!s) return def||'PROXY';
  var low=s.toLowerCase();
  if(low==='direct') return 'DIRECT';
  if(low==='proxy') return 'PROXY';
  return s;
}
function rtNormQx(v){
  var s=String(v==null?'':v).trim();
  if(!s) return 'follow';
  var low=s.toLowerCase();
  if(low==='follow'||low==='跟随'||low==='跟随策略') return 'follow';
  if(low==='direct') return 'DIRECT';
  if(low==='proxy') return 'PROXY';
  return s;
}
function rtPolicyLabel(p){
  if(p==='DIRECT') return 'DIRECT';
  if(p==='PROXY') return 'Proxy';
  return p||'Proxy';
}

function rtGetGroups(){
  var raw=null;
  try{ raw=JSON.parse(localStorage.getItem(LS_RT_GROUPS)||'null'); }catch(e){}
  var defs=RT_DEFAULT_GROUPS();
  if(Array.isArray(raw) && raw.length){
    var byId={}; defs.forEach(function(g){ byId[g.id]=g; });
    var out=[];
    raw.forEach(function(g){
      if(!g||!g.id||!byId[g.id]) return;
      var d=byId[g.id];
      out.push({
        id:g.id,
        name:(typeof g.name==='string'&&g.name.trim())?g.name.trim():d.name,
        enabled:g.enabled!==false,
        policy:rtNormPolicy(g.policy, d.policy),
        qx:rtNormQx(g.qx),
        keywords:Array.isArray(g.keywords)?g.keywords.filter(function(s){ return typeof s==='string'&&s.trim(); }):d.keywords.slice(),
        match:g.match==='DOMAIN-SUFFIX'?'DOMAIN-SUFFIX':'DOMAIN'
      });
    });
    defs.forEach(function(d){ if(!out.some(function(g){ return g.id===d.id; })) out.push(d); });
    var fb=out.filter(function(g){ return g.id==='fallback'; })[0];
    out=out.filter(function(g){ return g.id!=='fallback'; });
    if(fb) out.push(fb);
    return out;
  }
  // 旧格式 {groupId:[keywords]}：只迁移关键词，其余取默认值
  var custom={};
  if(raw && typeof raw==='object' && !Array.isArray(raw)) custom=raw;
  return defs.map(function(g){
    var kw=custom[g.id];
    if(Array.isArray(kw)) g.keywords=kw.filter(function(s){ return typeof s==='string'&&s.trim(); });
    return g;
  });
}
function rtSaveGroups(groups){
  try{ localStorage.setItem(LS_RT_GROUPS, JSON.stringify(groups)); }catch(e){}
  renderRouting(true);
}
function rtMatchGroup(label, groups){
  var s=(label||'').toLowerCase();
  for(var i=0;i<groups.length;i++){
    var g=groups[i];
    if(g.id==='fallback'||!g.enabled) continue;
    for(var j=0;j<g.keywords.length;j++){
      var kw=String(g.keywords[j]||'').toLowerCase().trim();
      if(kw && s.indexOf(kw)>=0) return g;
    }
  }
  return groups[groups.length-1]; // 兜底
}
function rtCollectHosts(){
  var map={};
  function add(serverName, route){
    var p=parseAddr(route.url);
    if(!p || !p.host) return;
    var host=p.host;
    var label=(route.name||'').trim() || serverName || '';
    if(!map[host]) map[host]={host:host, label:label, server:serverName||'', route:(route.name||'').trim()};
    else if(!map[host].label && label) map[host].label=label;
  }
  getServers().forEach(function(s){ (s.routes||[]).forEach(function(r){ add(s.name, r); }); });
  getCheckedRoutes().forEach(function(r){ add($('name').value.trim()||'Emby', r); });
  return Object.keys(map).sort().map(function(k){ return map[k]; });
}
function rtGetOverrides(){
  try{ return JSON.parse(localStorage.getItem(LS_RT_OVERRIDES)||'{}')||{}; }catch(e){ return {}; }
}
function rtSaveOverrides(o){ try{ localStorage.setItem(LS_RT_OVERRIDES, JSON.stringify(o)); }catch(e){} }
function rtResolve(host, group, overrides){
  var ov=overrides[host.host]||{};
  var policy=ov.policy||group.policy;
  var type=ov.type||group.match;
  var qxPolicy=group.qx==='follow'?policy:group.qx;
  return { policy:policy, type:type, qxPolicy:qxPolicy, overridden:!!(ov.policy||ov.type) };
}
function rtGetTools(){
  try{
    var t=JSON.parse(localStorage.getItem(LS_RT_TOOLS)||'null');
    if(Array.isArray(t)&&t.length){
      var ok=t.filter(function(id){ return RT_TOOLS.some(function(x){ return x.id===id; }); });
      if(ok.length) return ok;
    }
  }catch(e){}
  return RT_TOOLS.map(function(x){ return x.id; });
}
function rtSaveTools(ids){ try{ localStorage.setItem(LS_RT_TOOLS, JSON.stringify(ids)); }catch(e){} }
function rtBuildEntries(){
  var groups=rtGetGroups();
  var hosts=rtCollectHosts();
  var overrides=rtGetOverrides();
  var entries=[];
  hosts.forEach(function(h){
    var g=rtMatchGroup((h.label||'')+' '+(h.server||''), groups);
    var r=rtResolve(h, g, overrides);
    entries.push({ host:h.host, label:h.label, server:h.server, group:g, policy:r.policy, type:r.type, qxPolicy:r.qxPolicy, overridden:r.overridden });
  });
  // 按分组顺序，再按域名排序
  var order={}; groups.forEach(function(g,i){ order[g.id]=i; });
  entries.sort(function(a,b){ var d=order[a.group.id]-order[b.group.id]; return d!==0?d:(a.host<b.host?-1:a.host>b.host?1:0); });
  return { groups:groups, entries:entries };
}
// 各格式的策略写法：
// Surge 模块只能用内部策略，代理走 %EmbyProxy% 参数（用户在模块设置里改）；
// Shadowrocket 模块直接用 PROXY；Loon 插件非直连统一 PROXY（插件详情里选策略组）；
// Egern 的策略组名是 Proxy（首字母大写）；QX 用分组的 QX 设置（跟随则与分组策略一致）。
function rtPolicyFor(fmt, e){
  var p=e.policy;
  if(p==='DIRECT') return 'DIRECT';
  // 通用 Proxy：Surge 用 %EmbyProxy% 参数（模块里可改），Egern 写作 Proxy；
  // 自定义策略名（如 新加坡手动、美国）按原样写进规则；Loon 非直连统一 PROXY。
  if(fmt==='surge') return p==='PROXY'?'%EmbyProxy%':p;
  if(fmt==='egern') return p==='PROXY'?'Proxy':p;
  if(fmt==='loon') return 'PROXY';
  if(fmt==='qx'){
    var q=e.qxPolicy||p;
    if(q==='DIRECT') return 'DIRECT';
    if(q==='PROXY') return 'PROXY';
    return q;
  }
  return p==='PROXY'?'PROXY':p;
}
function rtBuildRules(tool, entries){
  var fmt=tool.fmt;
  var lines=[];
  if(fmt==='yaml'){ // Clash / Stash：payload 列表
    lines.push('payload:');
    entries.forEach(function(e){ lines.push('  - '+e.type+','+e.host+','+rtPolicyFor('yaml',e)); });
    return lines.join('\\n')+'\\n';
  }
  if(fmt==='qx'){
    entries.forEach(function(e){
      var kw=e.type==='DOMAIN-SUFFIX' ? 'host-suffix' : 'host';
      lines.push(kw+','+e.host+','+rtPolicyFor('qx',e));
    });
    return lines.join('\\n')+'\\n';
  }
  if(fmt==='egern'){ // Egern：rules 列表，每条带自己的策略
    lines.push('# Emby 分流规则（由 Emby 一键导入生成）');
    lines.push('rules:');
    entries.forEach(function(e){
      var key=e.type==='DOMAIN-SUFFIX' ? 'domain_suffix' : 'domain';
      lines.push('  - '+key+':');
      lines.push('      match: '+e.host);
      lines.push('      policy: '+rtPolicyFor('egern',e));
    });
    return lines.join('\\n')+'\\n';
  }
  if(fmt==='sgmodule' || fmt==='surge'){ // Surge / Shadowrocket 模块
    lines.push('#!name=Emby Proxy');
    lines.push('#!desc=Emby 分流规则（由 Emby 一键导入生成）');
    if(fmt==='surge') lines.push('#!arguments=EmbyProxy=PROXY');
    lines.push('');
    lines.push('[Rule]');
    entries.forEach(function(e){ lines.push(e.type+','+e.host+','+rtPolicyFor(fmt,e)); });
    return lines.join('\\n')+'\\n';
  }
  if(fmt==='plugin'){ // Loon 插件
    lines.push('#!name=Emby Proxy');
    lines.push('#!desc=Emby 分流规则（由 Emby 一键导入生成）');
    lines.push('');
    lines.push('[Rule]');
    entries.forEach(function(e){ lines.push(e.type+','+e.host+','+rtPolicyFor('loon',e)); });
    return lines.join('\\n')+'\\n';
  }
  entries.forEach(function(e){ lines.push(e.type+','+e.host+','+e.policy); });
  return lines.join('\\n')+'\\n';
}
function rtBuildAllFiles(){
  var entries=rtBuildEntries().entries;
  var out=[];
  RT_TOOLS.forEach(function(t){
    var content=rtBuildRules(t, entries);
    t.files.forEach(function(fn){ out.push({ toolId:t.id, name:fn, tool:t, content:content }); });
  });
  return out;
}
function rtSelectedFiles(){
  var sel=rtGetTools();
  return rtBuildAllFiles().filter(function(f){ return sel.indexOf(f.toolId)>=0; });
}
function rtCyclePolicy(host){
  var ov=rtGetOverrides();
  var cur=ov[host.host]||{};
  var effective=cur.policy||host.group.policy;
  // 在分组策略和 DIRECT 之间切换（分组是 DIRECT 时切到通用 Proxy）
  var next;
  if(effective===host.group.policy){
    next=host.group.policy==='DIRECT'?'PROXY':'DIRECT';
  } else {
    next=host.group.policy;
  }
  if(next===host.group.policy) delete cur.policy; else cur.policy=next;
  if(!cur.policy && !cur.type) delete ov[host.host]; else ov[host.host]=cur;
  rtSaveOverrides(ov);
  renderRouting(true);
}
function rtToggleType(host){
  var ov=rtGetOverrides();
  var cur=ov[host.host]||{};
  var effective=cur.type||host.group.match;
  var next=effective==='DOMAIN'?'DOMAIN-SUFFIX':'DOMAIN';
  if(next===host.group.match) delete cur.type; else cur.type=next;
  if(!cur.policy && !cur.type) delete ov[host.host]; else ov[host.host]=cur;
  rtSaveOverrides(ov);
  renderRouting(true);
}
// 分组级切换：胶囊切精确/后缀，展开里的策略/QX 策略点值切换
function rtToggleGroupMatch(g){
  var groups=rtGetGroups();
  for(var i=0;i<groups.length;i++){
    if(groups[i].id===g.id){ groups[i].match=groups[i].match==='DOMAIN'?'DOMAIN-SUFFIX':'DOMAIN'; break; }
  }
  rtSaveGroups(groups);
}
// 分组策略 / QX 策略现在是文本输入（见展开行与编辑器），不再用点按切换；保留按名保存的入口
function rtSetGroupPolicy(g, value){
  var groups=rtGetGroups();
  for(var i=0;i<groups.length;i++){
    if(groups[i].id===g.id){ groups[i].policy=rtNormPolicy(value, groups[i].policy); break; }
  }
  rtSaveGroups(groups);
}
function rtSetGroupQx(g, value){
  var groups=rtGetGroups();
  for(var i=0;i<groups.length;i++){
    if(groups[i].id===g.id){ groups[i].qx=rtNormQx(value); break; }
  }
  rtSaveGroups(groups);
}
// 全库线路：已保存服务器的全部线路 + 当前表单勾选的线路，按 URL 去重
function rtCollectRoutes(){
  var out=[], seen={};
  function add(serverName, route){
    var p=parseAddr(route.url);
    if(!p || !p.host) return;
    var url=route.url.trim();
    if(seen[url]) return;
    seen[url]=1;
    out.push({ server:serverName||'', name:(route.name||'').trim(), url:url, host:p.host,
      label:(route.name||'').trim()||serverName||'' });
  }
  getServers().forEach(function(s){ (s.routes||[]).forEach(function(r){ add(s.name, r); }); });
  getCheckedRoutes().forEach(function(r){ add($('name').value.trim()||'Emby', r); });
  return out;
}
function rtRouteGroup(r, groups, overrides){
  var g=rtMatchGroup((r.label||'')+' '+(r.server||''), groups);
  var res=rtResolve({host:r.host}, g, overrides);
  return { group:g, policy:res.policy, overridden:res.overridden };
}
// ---- 批量管理线路 ----
var rtBatchSel={}; // url -> true
function rtRenderBatch(){
  var list=$('rtBatchList');
  var routes=rtCollectRoutes();
  var groups=rtGetGroups(), overrides=rtGetOverrides();
  list.innerHTML='';
  if(!routes.length){
    list.innerHTML='<p class="rt-empty">还没有线路。先在上面填 Emby 线路并点「💾 保存」。</p>';
    return;
  }
  routes.forEach(function(r){
    var res=rtRouteGroup(r, groups, overrides);
    var row=document.createElement('div');
    row.className='rt-batch-row';
    var cb=document.createElement('input');
    cb.type='checkbox'; cb.checked=!!rtBatchSel[r.url];
    cb.onchange=function(){ if(cb.checked) rtBatchSel[r.url]=1; else delete rtBatchSel[r.url]; };
    var info=document.createElement('div');
    info.className='rt-batch-info';
    info.innerHTML='<div class="rt-batch-name">'+escapeHtml(r.label||r.host)+'</div>'
      +'<div class="rt-batch-host">'+escapeHtml(r.host)+(r.server?' · '+escapeHtml(r.server):'')+'</div>';
    var pol=document.createElement('button');
    pol.type='button'; pol.className='rt-badge'+(res.policy==='DIRECT'?' direct':'')+(res.overridden?'':' auto');
    pol.textContent=rtPolicyLabel(res.policy);
    pol.title='点此切换直连 / 分组策略';
    pol.onclick=function(){ rtCyclePolicy({host:r.host, group:res.group}); rtRenderBatch(); };
    row.appendChild(cb); row.appendChild(info); row.appendChild(pol);
    list.appendChild(row);
  });
}
function rtBatchSetPolicy(policy){ // 'DIRECT' | 'PROXY' | null（恢复自动）
  var urls=Object.keys(rtBatchSel);
  if(!urls.length){ toast('先勾选线路'); return; }
  var routes=rtCollectRoutes();
  var groups=rtGetGroups();
  var ov=rtGetOverrides();
  var n=0;
  urls.forEach(function(u){
    var r=null;
    for(var i=0;i<routes.length;i++){ if(routes[i].url===u){ r=routes[i]; break; } }
    if(!r) return;
    var g=rtMatchGroup((r.label||'')+' '+(r.server||''), groups);
    var cur=ov[r.host]||{};
    if(policy==null || policy===g.policy) delete cur.policy; else cur.policy=policy;
    if(!cur.policy && !cur.type) delete ov[r.host]; else ov[r.host]=cur;
    n++;
  });
  rtSaveOverrides(ov);
  renderRouting(true);
  rtRenderBatch();
  toast('已对 '+n+' 条线路'+(policy==null?'恢复自动':(policy==='DIRECT'?'设为直连':'设为代理')));
}
function rtOpenBatch(){
  rtBatchSel={};
  rtRenderBatch();
  $('rtBatchModal').style.display='flex';
}
$('btnRtBatch').onclick=function(){ rtOpenBatch(); };
$('btnRtBatchDone').onclick=function(){ $('rtBatchModal').style.display='none'; };
$('rtBatchModal').addEventListener('click', function(e){
  if(e.target===$('rtBatchModal')) $('rtBatchModal').style.display='none';
});
$('btnRtBatchAll').onclick=function(){
  var routes=rtCollectRoutes();
  var all=routes.length && routes.every(function(r){ return rtBatchSel[r.url]; });
  rtBatchSel={};
  if(!all) routes.forEach(function(r){ rtBatchSel[r.url]=1; });
  rtRenderBatch();
};
$('btnRtBatchDirect').onclick=function(){ rtBatchSetPolicy('DIRECT'); };
$('btnRtBatchProxy').onclick=function(){ rtBatchSetPolicy('PROXY'); };
$('btnRtBatchAuto').onclick=function(){ rtBatchSetPolicy(null); };
$('btnRtBatchEditGroups').onclick=function(){
  $('rtBatchModal').style.display='none';
  $('rtGroupModal').style.display='flex';
  rtRenderGroupEditor();
};
// ---- 整库线路测速 ----
var rtLibSpeedResults=[]; // [{name, url, ms|null, error, via}]
function rtLoadRouteIntoForm(url){
  var list=getServers();
  for(var i=0;i<list.length;i++){
    var s=list[i], found=false;
    for(var j=0;j<s.routes.length;j++){ if(s.routes[j].url===url){ found=true; break; } }
    if(found){
      fillForm(s);
      routes.forEach(function(r){ r.checked=(r.url===url); });
      saveRoutesLocal(); renderRoutes(); render();
      toast('已切换到：'+(s.name||url));
      return;
    }
  }
  for(var k=0;k<routes.length;k++){
    if(routes[k].url===url){
      routes.forEach(function(r){ r.checked=false; });
      routes[k].checked=true;
      saveRoutesLocal(); renderRoutes(); render();
      toast('已切换到：'+(routes[k].name||url));
      return;
    }
  }
}
function rtRenderLibSpeed(){
  var rows=$('rtSpeedRows'), sum=$('rtSpeedSummary');
  var ok=rtLibSpeedResults.filter(function(r){ return r.ms!=null; });
  var sorted=rtLibSpeedResults.slice().sort(function(a,b){ return (a.ms==null?1e9:a.ms)-(b.ms==null?1e9:b.ms); });
  var fastest=ok.length?Math.min.apply(null, ok.map(function(r){ return r.ms; })):null;
  var median=null;
  if(ok.length){
    var msList=ok.map(function(r){ return r.ms; }).sort(function(a,b){ return a-b; });
    median=msList[Math.floor(msList.length/2)];
  }
  sum.innerHTML='<div class="sv"><b>'+ok.length+'/'+rtLibSpeedResults.length+'</b><span>可用线路</span></div>'
    +(fastest!=null?'<div class="sv"><b>'+fastest+'ms</b><span>最快</span></div>':'')
    +(median!=null?'<div class="sv"><b>'+median+'ms</b><span>中位延迟</span></div>':'');
  rows.innerHTML='';
  sorted.forEach(function(r, rank){
    var g=speedGrade(r.ms);
    var row=document.createElement('div');
    row.className='rt-lib-row';
    var host='';
    try{ host=new URL(r.url).host; }catch(e){ host=r.url; }
    row.innerHTML='<div class="speed-rank'+(rank===0&&r.ms!=null?' fast':'')+'">'+(r.ms!=null?(rank+1):'—')+'</div>'
      +'<div class="speed-info"><div class="speed-name">'+escapeHtml(r.name||host)+'</div><div class="speed-host">'+escapeHtml(host)+(r.via==='edge'?' · 节点测':'')+'</div></div>'
      +'<div class="speed-ms">'+(r.ms!=null?'<b>'+r.ms+'ms</b><span class="'+g.cls+'">'+g.label+(fastest!=null&&r.ms>fastest?' · +'+(r.ms-fastest)+'ms':'')+'</span>':'<b>—</b><span class="na">'+escapeHtml(r.error||'不可用')+'</span>')+'</div>';
    row.onclick=function(){
      $('rtSpeedModal').style.display='none';
      rtLoadRouteIntoForm(r.url);
    };
    row.title='点此只用这条线路';
    rows.appendChild(row);
  });
  $('btnRtSpeedFastest').style.display=ok.length?'':'none';
  $('btnRtSpeedCopy').style.display=ok.length?'':'none';
}
async function rtRunLibrarySpeed(){
  var targets=rtCollectRoutes();
  if(!targets.length){ toast('库里还没有线路'); return; }
  rtLibSpeedResults=[];
  $('rtSpeedStatus').textContent='测速中…';
  rtRenderLibSpeed();
  var done=0;
  await Promise.all(targets.map(async function(t, i){
    var res=await testOneRoute({name:t.label||t.host, url:t.url}, i);
    rtLibSpeedResults.push(res);
    done++;
    $('rtSpeedStatus').textContent='测速中 '+done+'/'+targets.length;
    rtRenderLibSpeed();
  }));
  $('rtSpeedStatus').textContent='完成';
  rtRenderLibSpeed();
}
$('btnRtSpeedAll').onclick=function(){
  $('rtSpeedModal').style.display='flex';
  rtRunLibrarySpeed();
};
$('btnRtSpeedDone').onclick=function(){ $('rtSpeedModal').style.display='none'; };
$('rtSpeedModal').addEventListener('click', function(e){
  if(e.target===$('rtSpeedModal')) $('rtSpeedModal').style.display='none';
});
$('btnRtSpeedFastest').onclick=function(){
  var ok=rtLibSpeedResults.filter(function(r){ return r.ms!=null; }).sort(function(a,b){ return a.ms-b.ms; });
  if(!ok.length) return;
  $('rtSpeedModal').style.display='none';
  rtLoadRouteIntoForm(ok[0].url);
};
$('btnRtSpeedCopy').onclick=function(){
  var ok=rtLibSpeedResults.filter(function(r){ return r.ms!=null; }).sort(function(a,b){ return a.ms-b.ms; });
  var lines=['Emby 整库线路测速结果'];
  ok.forEach(function(r,i){ lines.push((i+1)+'. '+(r.name||r.url)+'（'+r.url+'）'+r.ms+'ms'); });
  rtLibSpeedResults.filter(function(r){ return r.ms==null; }).forEach(function(r){ lines.push('✗ '+(r.name||r.url)+'（'+r.url+'）'+(r.error||'不可用')); });
  var text=lines.join('\\n');
  if(navigator.clipboard && navigator.clipboard.writeText){ navigator.clipboard.writeText(text).then(function(){ toast('测速结果已复制'); }, function(){ fallbackCopy(text); toast('测速结果已复制'); }); }
  else { fallbackCopy(text); toast('测速结果已复制'); }
};
function rtTouchLocal(){ try{ localStorage.setItem(LS_RT_LOCAL, String(Date.now())); }catch(e){} }
function rtGetLocalTime(){ try{ var v=Number(localStorage.getItem(LS_RT_LOCAL)||'0'); return v||0; }catch(e){ return 0; } }
function rtGetGistTime(){ try{ var v=Number(localStorage.getItem(LS_GIST_UPDATED)||'0'); return v||0; }catch(e){ return 0; } }
function rtFmtTime(ts){
  var d=new Date(ts);
  function p(n){ return (n<10?'0':'')+n; }
  return d.getFullYear()+'-'+p(d.getMonth()+1)+'-'+p(d.getDate())+' '+p(d.getHours())+':'+p(d.getMinutes());
}
function rtCountServers(entries){
  var seen={};
  entries.forEach(function(e){ if(e.server) seen[e.server]=1; });
  return Object.keys(seen).length;
}
function renderRouting(force){
  var data=rtBuildEntries();
  var contentSig=JSON.stringify(data.entries.map(function(e){ return [e.host,e.group.id,e.policy,e.type,e.qxPolicy]; }));
  var sig=contentSig+'|'+rtGetTools().join(',');
  if(!force && sig===rtLastSig) return;
  rtLastSig=sig;
  if(contentSig!==rtLastContentSig){
    rtLastContentSig=contentSig;
    if(data.entries.length) rtTouchLocal();
  }
  var groups=data.groups, entries=data.entries;
  var box=$('rtGroups');
  box.innerHTML='';
  groups.forEach(function(g){
    var list=entries.filter(function(e){ return e.group.id===g.id; });
    var grp=document.createElement('div');
    grp.className='rt-group'+(rtExpanded[g.id]?' open':'');
    var isDirect=g.id==='direct';
    var status=list.length ? (list.length+' 个域名') : '未命中';
    var head=document.createElement('div');
    head.className='rt-group-head';
    var ico=document.createElement('span');
    ico.className='rt-gico'+(isDirect?' direct':'');
    ico.textContent=isDirect?'→':'🌐';
    var main=document.createElement('div');
    main.className='rt-gmain';
    var line1=document.createElement('div');
    line1.className='rt-gline1';
    line1.innerHTML='<b>'+escapeHtml(g.name)+'</b><span class="rt-garrow">→</span><span class="rt-gpol">'+escapeHtml(rtPolicyLabel(g.policy))+'</span>';
    main.appendChild(line1);
    var cap=document.createElement('button');
    cap.type='button'; cap.className='rt-gcapsule';
    cap.textContent=g.match+' ⇄';
    cap.title='点此切换精确 / 后缀';
    cap.onclick=function(e){ e.stopPropagation(); rtToggleGroupMatch(g); };
    main.appendChild(cap);
    if(g.keywords.length){
      var kw=document.createElement('div');
      kw.className='rt-gkw';
      kw.textContent='关键词 '+g.keywords.join(' / ');
      main.appendChild(kw);
    }
    var side=document.createElement('div');
    side.className='rt-gside';
    var st=document.createElement('span');
    st.className='rt-gstatus'; st.textContent=status;
    var chev=document.createElement('span');
    chev.className='rt-chev'; chev.textContent='›';
    side.appendChild(st); side.appendChild(chev);
    head.appendChild(ico); head.appendChild(main); head.appendChild(side);
    head.onclick=function(){ rtExpanded[g.id]=!rtExpanded[g.id]; renderRouting(true); };
    grp.appendChild(head);
    var hostsEl=document.createElement('div');
    hostsEl.className='rt-hosts';
    if(!list.length){
      hostsEl.innerHTML='<p class="rt-empty">暂无域名命中此分组。</p>';
    }
    list.forEach(function(h){
      var row=document.createElement('div');
      row.className='rt-host';
      var info=document.createElement('div');
      info.className='rt-host-info';
      info.innerHTML='<div class="rt-host-name">'+escapeHtml(h.host)+(h.overridden?' <span style="color:var(--accent);font-size:11px">已自定义</span>':'')+'</div>'
        +'<div class="rt-host-label">'+escapeHtml(h.label||h.server||'')+'</div>';
      var pol=document.createElement('button');
      pol.type='button'; pol.className='rt-badge'+(h.policy==='DIRECT'?' direct':'')+((rtGetOverrides()[h.host]||{}).policy?'':' auto');
      pol.textContent=rtPolicyLabel(h.policy);
      pol.title='点此切换直连 / 分组策略';
      pol.onclick=function(){ rtCyclePolicy(h); };
      var typ=document.createElement('button');
      typ.type='button'; typ.className='rt-type';
      typ.textContent=h.type;
      typ.title='点此切换精确 / 后缀';
      typ.onclick=function(){ rtToggleType(h); };
      row.appendChild(info); row.appendChild(pol); row.appendChild(typ);
      hostsEl.appendChild(row);
    });
    // 策略 / QX 策略：可手动填的文本输入（带候选：DIRECT、Proxy、各国/策略名），失焦/回车即保存
    var polRow=document.createElement('div');
    polRow.className='rt-gdetail';
    var polIn=document.createElement('input');
    polIn.type='text'; polIn.className='rt-gtext';
    polIn.setAttribute('list','rtPolicyList');
    polIn.setAttribute('autocomplete','off'); polIn.setAttribute('autocapitalize','off'); polIn.setAttribute('spellcheck','false');
    polIn.value=rtPolicyLabel(g.policy);
    polIn.placeholder='策略名，如 Proxy';
    polIn.onchange=function(){ rtSetGroupPolicy(g, polIn.value); };
    polRow.appendChild(Object.assign(document.createElement('span'), { textContent:'策略' }));
    polRow.appendChild(polIn);
    hostsEl.appendChild(polRow);
    var qxRow=document.createElement('div');
    qxRow.className='rt-gdetail';
    var qxIn=document.createElement('input');
    qxIn.type='text'; qxIn.className='rt-gtext';
    qxIn.setAttribute('list','rtQxList');
    qxIn.setAttribute('autocomplete','off'); qxIn.setAttribute('autocapitalize','off'); qxIn.setAttribute('spellcheck','false');
    qxIn.value=g.qx==='follow'?'':rtPolicyLabel(g.qx);
    qxIn.placeholder='跟随「'+rtPolicyLabel(g.policy)+'」';
    qxIn.onchange=function(){ rtSetGroupQx(g, qxIn.value); };
    qxRow.appendChild(Object.assign(document.createElement('span'), { textContent:'QX 策略' }));
    qxRow.appendChild(qxIn);
    hostsEl.appendChild(qxRow);
    // 关键词输入框：直接在组里改，失焦/回车即保存并重新分组
    var kwEdit=document.createElement('div');
    kwEdit.className='rt-gkw-edit';
    kwEdit.appendChild(Object.assign(document.createElement('span'), { textContent:'关键词' }));
    var kwInput=document.createElement('input');
    kwInput.type='text'; kwInput.className='rt-gkw-input';
    kwInput.value=g.keywords.join(' ');
    kwInput.placeholder='空格分隔，如 美国 日本 新加坡';
    kwInput.setAttribute('autocomplete','off'); kwInput.setAttribute('autocapitalize','off'); kwInput.setAttribute('spellcheck','false');
    kwInput.onchange=function(){
      var groups=rtGetGroups();
      for(var i=0;i<groups.length;i++){
        if(groups[i].id===g.id){
          groups[i].keywords=kwInput.value.split(/[\\s,，、]+/).map(function(s){ return s.trim(); }).filter(Boolean);
          break;
        }
      }
      rtSaveGroups(groups);
    };
    kwEdit.appendChild(kwInput);
    hostsEl.appendChild(kwEdit);
    if(!g.keywords.length){
      var note=document.createElement('div');
      note.className='rt-gnote';
      note.textContent='ⓘ 这个分组还没有关键词，所以不会匹配到任何域名。';
      hostsEl.appendChild(note);
    }
    grp.appendChild(hostsEl);
    box.appendChild(grp);
  });
  // 同步状态
  $('rtDomainCount').textContent=entries.length+' 个（来自 '+rtCountServers(entries)+' 个服务器）';
  var lt=rtGetLocalTime();
  $('rtLocalTime').textContent=lt?rtFmtTime(lt):'—';
  var gt=rtGetGistTime();
  $('rtGistTime').textContent=gt?rtFmtTime(gt):'还没上传 Gist';
  // 工具选择
  var toolsBox=$('rtTools');
  toolsBox.innerHTML='';
  var sel=rtGetTools();
  $('rtToolCount').textContent=sel.length+' / '+RT_TOOLS.length+' 个';
  RT_TOOLS.forEach(function(t){
    var on=sel.indexOf(t.id)>=0;
    var lab=document.createElement('label');
    lab.className='rt-tool'+(on?'':' off');
    lab.title=t.hint||'';
    var cb=document.createElement('input');
    cb.type='checkbox'; cb.checked=on;
    cb.onchange=function(){
      var cur=rtGetTools();
      if(cb.checked){ if(cur.indexOf(t.id)<0) cur.push(t.id); }
      else { cur=cur.filter(function(x){ return x!==t.id; }); }
      if(!cur.length){ cb.checked=true; toast('至少选一个'); return; }
      rtSaveTools(cur);
      renderRouting(true);
    };
    lab.appendChild(cb);
    lab.appendChild(document.createTextNode(t.name));
    toolsBox.appendChild(lab);
  });
  // 文件列表
  var files=rtSelectedFiles();
  var filesBox=$('rtFiles');
  filesBox.innerHTML='';
  files.forEach(function(f){
    var row=document.createElement('div');
    row.className='rt-file';
    var nm=document.createElement('span');
    nm.className='rt-file-name'; nm.textContent=f.name;
    var meta=document.createElement('span');
    meta.className='rt-file-meta'; meta.textContent=entries.length+' 条规则';
    var cp=document.createElement('button');
    cp.type='button'; cp.className='mini-btn'; cp.textContent='复制';
    cp.onclick=function(){
      if(navigator.clipboard && navigator.clipboard.writeText){ navigator.clipboard.writeText(f.content).then(function(){ toast(f.name+' 已复制'); }, function(){ fallbackCopy(f.content); toast(f.name+' 已复制'); }); }
      else { fallbackCopy(f.content); toast(f.name+' 已复制'); }
    };
    var dl=document.createElement('button');
    dl.type='button'; dl.className='mini-btn'; dl.textContent='下载';
    dl.onclick=function(){ rtDownloadFile(f); };
    row.appendChild(nm); row.appendChild(meta); row.appendChild(cp); row.appendChild(dl);
    filesBox.appendChild(row);
  });
  rtRenderImportLinks();
}
function rtRenderImportLinks(){
  var box=$('rtImport');
  var links=$('rtImportLinks');
  var gid=$('rtGistId').value.trim();
  var owner='';
  try{ owner=localStorage.getItem(LS_GIST_OWNER)||''; }catch(e){}
  if(!gid || !owner || !rtGetGistTime()){ box.style.display='none'; links.innerHTML=''; return; }
  box.style.display='';
  links.innerHTML='';
  rtSelectedFiles().forEach(function(f){
    var url='https://gist.githubusercontent.com/'+encodeURIComponent(owner)+'/'+encodeURIComponent(gid)+'/raw/'+encodeURIComponent(f.name);
    var row=document.createElement('div');
    row.className='rt-import-link';
    var nm=document.createElement('span');
    nm.className='rt-file-name'; nm.textContent=f.name;
    var cp=document.createElement('button');
    cp.type='button'; cp.className='mini-btn'; cp.textContent='复制地址';
    cp.onclick=function(){
      if(navigator.clipboard && navigator.clipboard.writeText){ navigator.clipboard.writeText(url).then(function(){ toast('地址已复制'); }, function(){ fallbackCopy(url); toast('地址已复制'); }); }
      else { fallbackCopy(url); toast('地址已复制'); }
    };
    row.appendChild(nm); row.appendChild(cp);
    links.appendChild(row);
  });
}
function rtDownloadFile(f){
  var blob=new Blob([f.content], {type:'text/plain;charset=utf-8'});
  var a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download=f.name;
  document.body.appendChild(a); a.click();
  setTimeout(function(){ URL.revokeObjectURL(a.href); a.remove(); }, 500);
}
$('btnRtDownload').onclick=function(){
  var files=rtSelectedFiles();
  if(!rtBuildEntries().entries.length){ toast('没有可生成的规则'); return; }
  files.forEach(function(f, i){ setTimeout(function(){ rtDownloadFile(f); }, i*350); });
  rtTouchLocal();
  toast('已开始下载 '+files.length+' 个规则文件');
  renderRouting(true);
};
$('btnRtCopy').onclick=function(){
  var files=rtSelectedFiles();
  if(!rtBuildEntries().entries.length){ toast('没有可生成的规则'); return; }
  var text=files.map(function(f){ return '# '+f.name+'\\n'+f.content; }).join('\\n');
  if(navigator.clipboard && navigator.clipboard.writeText){ navigator.clipboard.writeText(text).then(function(){ toast('全部规则已复制'); }, function(){ fallbackCopy(text); toast('全部规则已复制'); }); }
  else { fallbackCopy(text); toast('全部规则已复制'); }
};
$('btnRtSync').onclick=function(){
  var dest=$('rtSyncDest').value;
  if(!rtBuildEntries().entries.length){ toast('没有可生成的规则'); return; }
  if(dest==='local'||dest==='both'){
    var files=rtSelectedFiles();
    files.forEach(function(f,i){ setTimeout(function(){ rtDownloadFile(f); }, i*350); });
    rtTouchLocal();
    toast('已开始下载 '+files.length+' 个规则文件');
  }
  if(dest==='gist'||dest==='both'){
    rtGistSync();
  }
  renderRouting(true);
};
$('rtSyncDest').addEventListener('change', function(){ try{ localStorage.setItem(LS_RT_DEST, this.value); }catch(e){} });
async function rtGistSync(){
  var token=$('rtGistToken').value.trim();
  var gid=$('rtGistId').value.trim();
  if(!token){ toast('先填 GitHub 令牌'); $('rtGistToken').focus(); return; }
  if(!rtBuildEntries().entries.length){ toast('没有可生成的规则'); return; }
  var files=rtSelectedFiles();
  var gistFiles={};
  files.forEach(function(f){ gistFiles[f.name]={content:f.content}; });
  $('rtGistStatus').textContent='正在同步到 Gist…';
  try{
    var res=await fetch(gid?('https://api.github.com/gists/'+encodeURIComponent(gid)):'https://api.github.com/gists', {
      method:gid?'PATCH':'POST',
      headers:{'Authorization':'Bearer '+token,'Accept':'application/vnd.github+json','Content-Type':'application/json'},
      body:JSON.stringify({description:'Emby 分流规则（emby-import 生成）', public:false, files:gistFiles})
    });
    var j=await res.json();
    if(!res.ok) throw new Error((j&&j.message)||('HTTP '+res.status));
    if(j.id){ $('rtGistId').value=j.id; try{ localStorage.setItem(LS_GIST_ID, j.id); }catch(e){} }
    if(j.owner && j.owner.login){ try{ localStorage.setItem(LS_GIST_OWNER, j.owner.login); }catch(e){} }
    try{ localStorage.setItem(LS_GIST_UPDATED, String(Date.now())); }catch(e){}
    $('rtGistStatus').textContent='已同步到 Gist：'+(j.html_url||'')+'（'+rtFmtTime(Date.now())+'）';
    toast('已同步到 Gist');
    renderRouting(true);
  }catch(e){
    $('rtGistStatus').textContent='同步失败：'+(e.message||e)+'。检查令牌是否有 gist 权限、Gist ID 是否正确。';
    toast('同步失败');
  }
}
$('btnRtGist').onclick=rtGistSync;
$('rtGistToken').addEventListener('input', function(){ try{ localStorage.setItem(LS_GIST_TOKEN, this.value); }catch(e){} });
$('rtGistId').addEventListener('input', function(){ try{ localStorage.setItem(LS_GIST_ID, this.value); }catch(e){} });
$('rtGistAuto').addEventListener('change', function(){ try{ localStorage.setItem(LS_GIST_AUTO, this.checked?'1':'0'); }catch(e){} });
function rtMaybeAutoSync(){
  var auto=false;
  try{ auto=localStorage.getItem(LS_GIST_AUTO)==='1'; }catch(e){}
  if(!auto) return;
  if(!$('rtGistToken').value.trim()) return;
  rtGistSync();
}
(function rtInitGist(){
  try{
    var t=localStorage.getItem(LS_GIST_TOKEN); if(t) $('rtGistToken').value=t;
    var g=localStorage.getItem(LS_GIST_ID); if(g) $('rtGistId').value=g;
    $('rtGistAuto').checked=localStorage.getItem(LS_GIST_AUTO)==='1';
    var d=localStorage.getItem(LS_RT_DEST); if(d) $('rtSyncDest').value=d;
  }catch(e){}
})();

// ---- 分组编辑器 ----
function rtEdRow(labelText, el){
  var row=document.createElement('div');
  row.className='rt-ed-row';
  var lab=document.createElement('span');
  lab.textContent=labelText;
  row.appendChild(lab);
  row.appendChild(el);
  return row;
}
function rtRenderGroupEditor(){
  var groups=rtGetGroups();
  var box=$('rtGroupEditor');
  box.innerHTML='';
  groups.forEach(function(g, idx){
    var isFallback=g.id==='fallback';
    var card=document.createElement('div');
    card.className='rt-ed-group';
    var top=document.createElement('div');
    top.className='rt-ed-top';
    var nameIn=document.createElement('input');
    nameIn.type='text'; nameIn.className='rt-ed-name'; nameIn.value=g.name;
    nameIn.onchange=function(){
      var v=nameIn.value.trim();
      if(!v){ nameIn.value=g.name; return; }
      var cur=rtGetGroups();
      cur[idx].name=v;
      rtSaveGroups(cur);
      rtRenderGroupEditor();
    };
    top.appendChild(nameIn);
    if(!isFallback){
      var enLab=document.createElement('label');
      enLab.className='rt-ed-enable';
      var enCb=document.createElement('input');
      enCb.type='checkbox'; enCb.checked=g.enabled!==false;
      enCb.onchange=function(){
        var cur=rtGetGroups();
        cur[idx].enabled=enCb.checked;
        rtSaveGroups(cur);
        rtRenderGroupEditor();
      };
      enLab.appendChild(enCb);
      enLab.appendChild(document.createTextNode('启用'));
      top.appendChild(enLab);
      var up=document.createElement('button');
      up.type='button'; up.className='mini-btn'; up.textContent='↑';
      up.disabled=idx===0;
      up.onclick=function(){
        if(idx===0) return;
        var cur=rtGetGroups();
        var tmp=cur[idx-1]; cur[idx-1]=cur[idx]; cur[idx]=tmp;
        rtSaveGroups(cur);
        rtRenderGroupEditor();
      };
      var down=document.createElement('button');
      down.type='button'; down.className='mini-btn'; down.textContent='↓';
      down.disabled=idx>=groups.length-2;
      down.onclick=function(){
        var cur=rtGetGroups();
        if(idx>=cur.length-2) return;
        var tmp=cur[idx+1]; cur[idx+1]=cur[idx]; cur[idx]=tmp;
        rtSaveGroups(cur);
        rtRenderGroupEditor();
      };
      top.appendChild(up); top.appendChild(down);
    } else {
      var fbTag=document.createElement('span');
      fbTag.className='rt-ed-enable'; fbTag.textContent='兜底';
      top.appendChild(fbTag);
    }
    card.appendChild(top);
    card.appendChild(rtEdRow('策略', (function(){
      var inp=document.createElement('input');
      inp.type='text'; inp.setAttribute('list','rtPolicyList');
      inp.setAttribute('autocomplete','off'); inp.setAttribute('autocapitalize','off'); inp.setAttribute('spellcheck','false');
      inp.value=rtPolicyLabel(g.policy);
      inp.placeholder='策略名，如 Proxy / 新加坡手动';
      inp.onchange=function(){
        var cur=rtGetGroups();
        cur[idx].policy=rtNormPolicy(inp.value, cur[idx].policy);
        rtSaveGroups(cur);
        rtRenderGroupEditor();
      };
      return inp;
    })()));
    card.appendChild(rtEdRow('QX', (function(){
      var inp=document.createElement('input');
      inp.type='text'; inp.setAttribute('list','rtQxList');
      inp.setAttribute('autocomplete','off'); inp.setAttribute('autocapitalize','off'); inp.setAttribute('spellcheck','false');
      inp.value=g.qx==='follow'?'':rtPolicyLabel(g.qx);
      inp.placeholder='跟随策略';
      inp.onchange=function(){
        var cur=rtGetGroups();
        cur[idx].qx=rtNormQx(inp.value);
        rtSaveGroups(cur);
        rtRenderGroupEditor();
      };
      return inp;
    })()));
    if(!isFallback){
      card.appendChild(rtEdRow('关键词', (function(){
        var inp=document.createElement('input');
        inp.type='text'; inp.value=g.keywords.join(' ');
        inp.placeholder='空格分隔，例如：直连 直链 direct';
        inp.onchange=function(){
          var kws=inp.value.split(/[,，、\\s]+/).map(function(s){ return s.trim(); }).filter(Boolean);
          var cur=rtGetGroups();
          cur[idx].keywords=kws;
          rtSaveGroups(cur);
          rtRenderGroupEditor();
        };
        return inp;
      })()));
    }
    card.appendChild(rtEdRow('匹配', (function(){
      var seg=document.createElement('div');
      seg.className='rt-seg';
      ['DOMAIN','DOMAIN-SUFFIX'].forEach(function(m){
        var b=document.createElement('button');
        b.type='button'; b.textContent=m;
        if(g.match===m) b.className='on';
        b.onclick=function(){
          var cur=rtGetGroups();
          cur[idx].match=m;
          rtSaveGroups(cur);
          rtRenderGroupEditor();
        };
        seg.appendChild(b);
      });
      return seg;
    })()));
    box.appendChild(card);
  });
}
$('btnRtEditGroups').onclick=function(){
  rtRenderGroupEditor();
  $('rtGroupModal').style.display='flex';
};
$('btnRtGroupDone').onclick=function(){
  $('rtGroupModal').style.display='none';
  renderRouting(true);
};
$('rtGroupModal').addEventListener('click', function(e){
  if(e.target===$('rtGroupModal')) $('rtGroupModal').style.display='none';
});

// 记住名称/用户名（不记密码）；线路单独存 embyimp_routes
['name','username'].forEach(function(k){
  var v=localStorage.getItem('embyimp_'+k);
  if(v) $(k).value=v;
  $(k).addEventListener('input', function(){ localStorage.setItem('embyimp_'+k, $(k).value); render(); });
});
$('password').addEventListener('input', render);
loadRoutesState();
renderRoutes();
refreshSaved();
$('togglePw').onclick=function(){
  var pw=$('password');
  var show=pw.type==='password';
  pw.type=show?'text':'password';
  this.textContent=show?'隐藏':'显示';
};
render();
renderRouting(true);

// ---- 底部切换栏：一键导入 / 分流同步（两个视图，同一页内切换） ----
var LS_VIEW='embyimp_view';
function setView(v, push){
  var isRt=v==='routing';
  $('view-import').hidden=isRt;
  $('view-routing').hidden=!isRt;
  document.querySelectorAll('.tabbar button').forEach(function(b){
    var on=b.dataset.view===v;
    b.classList.toggle('active', on);
    if(on) b.setAttribute('aria-current','page'); else b.removeAttribute('aria-current');
  });
  try{ localStorage.setItem(LS_VIEW, v); }catch(e){}
  if(push!==false){ try{ history.replaceState(null,'','#'+v); }catch(e){} }
  if(isRt) renderRouting(true);
  window.scrollTo(0,0);
}
document.querySelectorAll('.tabbar button').forEach(function(b){
  b.onclick=function(){ setView(b.dataset.view); };
});
// 初始视图：#routing 优先，其次上次停留的视图，否则一键导入
var startView='import';
try{
  if(location.hash==='#routing') startView='routing';
  else if(location.hash==='#import') startView='import';
  else if(localStorage.getItem(LS_VIEW)==='routing') startView='routing';
}catch(e){}
setView(startView, false);

</script>
</body>
</html>
`;
const ICON180 = "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";
const ICON192 = "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";
const ICON512 = "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";
const MANIFEST = {"name": "Emby 一键导入", "short_name": "Emby导入", "description": "填一次服务器信息，点格子直接唤起客户端导入 Emby 服务器。", "start_url": "/", "display": "standalone", "background_color": "#FDF2F7", "theme_color": "#FDF2F7", "icons": [{"src": "/icon-192.png", "sizes": "192x192", "type": "image/png"}, {"src": "/icon-512.png", "sizes": "512x512", "type": "image/png"}]};

function b64ToBytes(b){ const s=atob(b); const u=new Uint8Array(s.length); for(let i=0;i<s.length;i++)u[i]=s.charCodeAt(i); return u; }
export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname === '/health') return new Response('emby-import ok', { status: 200 });
    if (url.pathname === '/speed') {
      // 线路测速代理：只允许测 Emby 公开接口 /System/Info/Public 或根路径，只等响应头，不读响应体。
      const target = url.searchParams.get('url') || '';
      const cors = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'Access-Control-Allow-Origin': '*' };
      try {
        const u = new URL(target);
        if (u.protocol !== 'http:' && u.protocol !== 'https:') throw new Error('bad protocol');
        if (!(u.pathname.endsWith('/System/Info/Public') || u.pathname.endsWith('/'))) throw new Error('bad path');
        const t0 = Date.now();
        const ctrl = new AbortController();
        const to = setTimeout(() => ctrl.abort(), 5000);
        const res = await fetch(u.toString(), { method: 'GET', signal: ctrl.signal, redirect: 'manual' });
        clearTimeout(to);
        return new Response(JSON.stringify({ ok: true, ms: Date.now() - t0, status: res.status }), { headers: cors });
      } catch (e) {
        return new Response(JSON.stringify({ ok: false, error: (e && e.name === 'AbortError') ? '超时' : '无法连接' }), { headers: cors });
      }
    }
    if (url.pathname === '/manifest.json') return new Response(JSON.stringify(MANIFEST), { headers: { 'Content-Type': 'application/manifest+json', 'Cache-Control': 'no-store' } });
    if (url.pathname === '/apple-touch-icon.png') return new Response(b64ToBytes(ICON180), { headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=86400' } });
    if (url.pathname === '/icon-192.png') return new Response(b64ToBytes(ICON192), { headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=86400' } });
    if (url.pathname === '/icon-512.png') return new Response(b64ToBytes(ICON512), { headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=86400' } });
    return new Response(HTML, { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } });
  }
};
