const HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0,viewport-fit=cover">
<title>Emby 一键导入</title>
<style>
  :root{--bg:#F2F2F7;--card:#FFF;--text:#1C1C1E;--text2:#8E8E93;--sep:rgba(60,60,67,.12);--accent:#007AFF;--green:#34C759;--red:#FF3B30;--radius:16px}
  @media (prefers-color-scheme:dark){
    :root{--bg:#000;--card:#1C1C1E;--text:#F5F5F7;--text2:#98989D;--sep:rgba(84,84,88,.4);--accent:#0A84FF}
  }
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display','PingFang SC',sans-serif;background:var(--bg);color:var(--text);min-height:100vh;padding:calc(20px + env(safe-area-inset-top)) 16px calc(28px + env(safe-area-inset-bottom));-webkit-font-smoothing:antialiased}
  .wrap{max-width:560px;margin:0 auto}
  h1{font-size:28px;font-weight:700;letter-spacing:-.5px}
  .sub{font-size:14px;color:var(--text2);margin:4px 0 18px}
  .card{background:var(--card);border-radius:var(--radius);padding:18px;margin-bottom:14px;box-shadow:0 1px 3px rgba(0,0,0,.05)}
  label{display:block;font-size:13px;color:var(--text2);margin:12px 0 5px}
  label:first-child{margin-top:0}
  input{width:100%;padding:11px 12px;font-size:16px;border:1px solid var(--sep);border-radius:10px;background:var(--bg);color:var(--text);outline:none}
  input:focus{border-color:var(--accent)}
  .pw-row{display:flex;gap:8px}
  .pw-row input{flex:1}
  .pw-row button{flex:none;padding:0 14px;border:1px solid var(--sep);border-radius:10px;background:var(--card);color:var(--accent);font-size:14px;cursor:pointer}
  .paste-btn{width:100%;padding:12px;border:none;border-radius:12px;background:var(--accent);color:#fff;font-size:16px;font-weight:600;cursor:pointer;margin-bottom:12px}
  .paste-btn.secondary{background:var(--bg);color:var(--accent);border:1px solid var(--sep)}
  #manualPaste{display:none;margin-bottom:12px}
  #manualPaste textarea{width:100%;padding:11px 12px;font-size:15px;border:1px solid var(--sep);border-radius:10px;background:var(--bg);color:var(--text);outline:none;resize:vertical;font-family:inherit;margin-bottom:8px}
  .app{display:flex;align-items:center;gap:12px;padding:13px 0;border-bottom:1px solid var(--sep)}
  .app:last-child{border-bottom:none}
  .ico{width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:700;color:#fff;flex:none}
  .ico img{width:44px;height:44px;border-radius:12px;object-fit:cover;display:block}
  .info{flex:1;min-width:0}
  .name{font-size:16px;font-weight:600}
  .link{font-size:11px;color:var(--text2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:3px;font-family:ui-monospace,Menlo,monospace}
  .btns{display:flex;flex-direction:column;gap:6px;flex:none}
  .btn{padding:8px 14px;border:none;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;white-space:nowrap}
  .btn-go{background:var(--accent);color:#fff}
  .btn-copy{background:var(--bg);color:var(--accent);border:1px solid var(--sep)}
  .btn:disabled{opacity:.4;cursor:not-allowed}
  .toast{position:fixed;left:50%;bottom:40px;transform:translateX(-50%) translateY(20px);background:rgba(28,28,30,.92);color:#fff;padding:10px 18px;border-radius:20px;font-size:14px;opacity:0;pointer-events:none;transition:all .25s;z-index:99}
  .toast.show{opacity:1;transform:translateX(-50%) translateY(0)}
</style>
</head>
<body>
<div class="wrap">
  <h1>Emby 一键导入</h1>
  <p class="sub">填一次服务器信息，点按钮直接唤起客户端导入。信息只在你手机本地生成链接，不会上传到任何服务器。</p>

  <div class="card">
    <button type="button" class="paste-btn" id="btnPaste">📋 粘贴识别剪贴板</button>
    <div id="manualPaste">
      <textarea id="pasteText" rows="4" placeholder="粘贴账号信息到这里，例如：地址 用户名 密码，或开户成功的那段消息…"></textarea>
      <button type="button" class="paste-btn secondary" id="btnParse">识别并填入</button>
    </div>
    <label>服务器名称</label>
    <input id="name" type="text" placeholder="例如：我的 Emby" autocomplete="off">
    <label>Emby 地址</label>
    <input id="address" type="url" placeholder="例如：https://emby.example.com" autocomplete="off" autocapitalize="off" spellcheck="false">
    <label>用户名</label>
    <input id="username" type="text" placeholder="Emby 用户名" autocomplete="off" autocapitalize="off">
    <label>密码</label>
    <div class="pw-row">
      <input id="password" type="password" placeholder="Emby 密码" autocomplete="off">
      <button type="button" id="togglePw">显示</button>
    </div>
  </div>

  <div class="card" id="apps"></div>

</div>
<div class="toast" id="toast"></div>

<script>
var APPS = [
  { id:'senplayer', icon:'data:image/jpeg;base64,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', name:'SenPlayer', color:'#007AFF', emoji:'▶️',
    build:function(p){ return 'senplayer://importserver?type=emby&name='+enc(p.name)+'&address='+enc(p.address)+'&username='+enc(p.username)+'&password='+enc(p.password); } },
  { id:'rex', icon:'data:image/jpeg;base64,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', name:'Rex', color:'#FF3B30', emoji:'🦖',
    build:function(p){ return 'rex://import?type=emby&scheme='+p.scheme+'&host='+enc(p.hostPath)+'&port='+p.port+'&username='+enc(p.username)+'&password='+enc(p.password)+'&title='+enc(p.name); } },
  { id:'eplayerx', icon:'data:image/jpeg;base64,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', name:'EplayerX', color:'#5856D6', emoji:'🎬',
    build:function(p){ return 'https://eplayerx.com/add-or-update?type=emby&href='+enc(p.address)+'&username='+enc(p.username)+'&password='+enc(p.password); } },
  { id:'vidora', icon:'data:image/jpeg;base64,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', name:'Vidora', color:'#34C759', emoji:'📺',
    build:function(p){ return 'vidora://emby/import?server_url='+enc(p.origin)+'&server_path='+enc(p.path)+'&username='+enc(p.username)+'&password='+enc(p.password)+'&name='+enc(p.name)+'&primary_endpoint_name='+enc('直连')+'&server_remark='+enc(p.name)+'&match_enabled=true&auto_connect=false&allow_insecure_https=false&prefer_original_path=false&playback_reminder_enabled=false&playback_reminder_interval_days=20'; } },
  { id:'noctra', icon:'data:image/jpeg;base64,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', name:'Noctra', color:'#33F09E', emoji:'🎞️',
    build:function(p){ return 'noctra://server/import?provider=emby&url='+enc(p.address)+'&username='+enc(p.username)+'&password='+enc(p.password)+'&name='+enc(p.name); } },
  { id:'reflix', name:'Reflix', color:'#FF9500', emoji:'🍿',
    build:function(p){ return 'reflix://importserver?type=emby&name='+enc(p.name)+'&address='+enc(p.address)+'&username='+enc(p.username)+'&password='+enc(p.password); } },
];
function enc(s){ return encodeURIComponent(s||''); }
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

function collect(){
  var p=parseAddr($('address').value);
  if(!p){ return null; }
  return { name:$('name').value.trim()||'Emby', address:p.address, scheme:p.scheme, host:p.host, port:p.port, hostPath:p.hostPath, origin:p.origin, path:p.path,
           username:$('username').value.trim(), password:$('password').value };
}

function render(){
  var p=collect();
  var box=$('apps');
  box.innerHTML='';
  APPS.forEach(function(app){
    var link=p ? app.build(p) : '';
    var row=document.createElement('div');
    row.className='app';
    var icoHtml = app.icon ? '<div class="ico"><img src="'+app.icon+'" alt="'+app.name+'"></div>' : '<div class="ico" style="background:'+app.color+'">'+app.emoji+'</div>';
    row.innerHTML=icoHtml
      +'<div class="info"><div class="name">'+app.name+'</div>'
      +'<div class="link">'+(link?link.replace(/^([a-z]+:\\/\\/[^?]{0,24}).*/,'$1…'):'请先填写 Emby 地址')+'</div></div>'
      +'<div class="btns"><button class="btn btn-go" '+(link?'':'disabled')+'>一键导入</button>'
      +'<button class="btn btn-copy" '+(link?'':'disabled')+'>复制链接</button></div>';
    var btns=row.querySelectorAll('button');
    btns[0].onclick=function(){
      if(!link) return;
      toast('正在打开 '+app.name+'…');
      window.location.href=link;
    };
    btns[1].onclick=function(){
      if(!link) return;
      var done=function(){ toast(app.name+' 链接已复制'); };
      if(navigator.clipboard && navigator.clipboard.writeText){ navigator.clipboard.writeText(link).then(done, function(){ fallbackCopy(link); done(); }); }
      else { fallbackCopy(link); done(); }
    };
    box.appendChild(row);
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
  var out = { address:'', username:'', password:'' };
  if(!text) return out;
  var m = text.match(/https?:\\/\\/[^\\s\\u4e00-\\u9fa5"'\\u3001\\uff0c]+/);
  if(m) out.address = m[0].replace(/[。,.，、;；]+$/, '');
  var um = text.match(/用户名称\\s*[|｜:：]\\s*([^\\s\\n]+)/) || text.match(/用户名\\s*[|｜:：]\\s*([^\\s\\n]+)/);
  if(um) out.username = um[1];
  var pm = text.match(/用户密码\\s*[|｜:：]\\s*([^\\s\\n]+)/) || text.match(/(?:^|[^\\u4e00-\\u9fa5])密码\\s*[|｜:：]\\s*([^\\s\\n]+)/);
  if(pm) out.password = pm[1];
  if(!out.username || !out.password){
    var lines = text.trim().split(/\\n+/);
    for(var i=0;i<lines.length;i++){
      var toks = lines[i].trim().split(/\\s+/);
      if(toks.length>=3 && /^https?:\\/\\//i.test(toks[0])){
        if(!out.address) out.address = toks[0];
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
  if(r.address){ $('address').value=r.address; localStorage.setItem('embyimp_address', r.address); filled.push('地址'); }
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

// 记住名称/地址/用户名（不记密码）
['name','address','username'].forEach(function(k){
  var v=localStorage.getItem('embyimp_'+k);
  if(v) $(k).value=v;
  $(k).addEventListener('input', function(){ localStorage.setItem('embyimp_'+k, $(k).value); render(); });
});
$('password').addEventListener('input', render);
$('togglePw').onclick=function(){
  var pw=$('password');
  var show=pw.type==='password';
  pw.type=show?'text':'password';
  this.textContent=show?'隐藏':'显示';
};
render();
</script>
</body>
</html>
`;

export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname === '/health') return new Response('emby-import ok', { status: 200 });
    return new Response(HTML, { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } });
  }
};
