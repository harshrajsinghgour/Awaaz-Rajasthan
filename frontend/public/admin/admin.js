const API=window.location.origin.replace(/\\/$/,"");
const $=id=>document.getElementById(id);
let me=null,news=[],ads=[],admins=[];
async function api(path,options={}){
  const opts={credentials:"include",...options};
  opts.headers={"Content-Type":"application/json",...(options.headers||{})};
  const r=await fetch(API+path,opts);let d={};try{d=await r.json()}catch{}
  if(!r.ok)throw new Error(d.message||"Request failed");return d;
}
function esc(v){return String(v??"").replace(/[&<>"']/g,s=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[s]));}
function toast(msg){const e=document.createElement("div");e.className="toast";e.textContent=msg;document.body.appendChild(e);setTimeout(()=>e.remove(),2200);}
async function boot(){try{me=(await api("/api/admin/me")).admin;showPanel();loadAll()}catch{showLogin()}}
function showLogin(){$("login").classList.remove("hidden");$("panel").classList.add("hidden")}
function showPanel(){$("login").classList.add("hidden");$("panel").classList.remove("hidden");document.querySelector('[data-tab="ads"]').style.display=me.role==="owner"?"":"none";document.querySelector('[data-tab="admins"]').style.display=me.role==="owner"?"":"none"}
$("loginForm").onsubmit=async e=>{e.preventDefault();$("loginError").textContent="";try{const r=await api("/api/admin/login",{method:"POST",body:JSON.stringify({email:$("email").value,password:$("password").value})});me=r.admin;showPanel();loadAll()}catch(err){$("loginError").textContent=err.message}};
$("logout").onclick=async()=>{await api("/api/admin/logout",{method:"POST"});location.reload()};
document.querySelectorAll(".tabs button").forEach(b=>b.onclick=()=>{document.querySelectorAll(".tabs button,.tab").forEach(x=>x.classList.remove("active"));b.classList.add("active");$(b.dataset.tab).classList.add("active")});
async function loadAll(){await loadDashboard();await loadNews();if(me.role==="owner"){await loadAds();await loadAdmins()}}
async function loadDashboard(){const r=await api("/api/admin/dashboard");$("stats").innerHTML=Object.entries(r.stats).map(([k,v])=>'<div class="stat"><small>'+esc(k)+'</small><b>'+Number(v).toLocaleString()+'</b></div>').join("")}
$("refresh").onclick=loadDashboard;
async function loadNews(){const r=await api("/api/admin/news");news=r.news;renderNews()}
function renderNews(){$("newsList").innerHTML=news.map(n=>'<div class="list-row"><div><b>'+esc(n.title)+'</b><small>'+esc(n.category)+' · '+esc(n.status)+' · views '+(n.views||0)+'</small></div><div><button onclick="editNews(\\''+n._id+'\\')">Edit</button><button class="danger" onclick="deleteNews(\\''+n._id+'\\')">Delete</button></div></div>').join("")||"<p>कोई खबर नहीं।</p>"}
$("newNews").onclick=()=>{$("newsForm").classList.remove("hidden");$("newsForm").reset();$("newsId").value=""};
$("cancelNews").onclick=()=>$("newsForm").classList.add("hidden");
$("newsForm").onsubmit=async e=>{e.preventDefault();const id=$("newsId").value,body={title:$("newsTitle").value,category:$("newsCategory").value,location:$("newsLocation").value,image:$("newsImage").value,excerpt:$("newsExcerpt").value,content:$("newsContent").value,status:$("newsStatus").value,featured:$("newsFeatured").checked,breaking:$("newsBreaking").checked};try{await api(id?"/api/admin/news/"+id:"/api/admin/news",{method:id?"PATCH":"POST",body:JSON.stringify(body)});$("newsForm").classList.add("hidden");toast("खबर सेव हो गई");loadNews();loadDashboard()}catch(err){toast(err.message)}};
window.editNews=id=>{const n=news.find(x=>x._id===id);if(!n)return;$("newsForm").classList.remove("hidden");$("newsId").value=id;$("newsTitle").value=n.title||"";$("newsCategory").value=n.category||"";$("newsLocation").value=n.location||"";$("newsImage").value=n.image||"";$("newsExcerpt").value=n.excerpt||"";$("newsContent").value=n.content||"";$("newsStatus").value=n.status||"draft";$("newsFeatured").checked=!!n.featured;$("newsBreaking").checked=!!n.breaking;scrollTo(0,0)};
window.deleteNews=async id=>{if(!confirm("यह खबर delete करें?"))return;try{await api("/api/admin/news/"+id,{method:"DELETE"});toast("Deleted");loadNews();loadDashboard()}catch(e){toast(e.message)}};

async function loadAds(){if(me.role!=="owner")return;const [a,s]=await Promise.all([api("/api/admin/ads"),api("/api/admin/ad-analytics")]);ads=a.ads;$("adTotals").innerHTML='<div class="stat"><small>Impressions</small><b>'+s.totals.impressions+'</b></div><div class="stat"><small>Clicks</small><b>'+s.totals.clicks+'</b></div><div class="stat"><small>CTR</small><b>'+s.ctr+'%</b></div>';$("adList").innerHTML=ads.map(a=>'<div class="list-row"><div><b>'+esc(a.title)+'</b><small>'+esc(a.position)+' · '+esc(a.device)+' · '+esc(a.status)+' · '+a.impressions+' impressions · '+a.clicks+' clicks</small></div><div><button onclick="editAd(\\''+a._id+'\\')">Edit</button><button class="danger" onclick="deleteAd(\\''+a._id+'\\')">Delete</button></div></div>').join("")||"<p>कोई विज्ञापन नहीं।</p>"}
$("newAd").onclick=()=>{$("adForm").classList.remove("hidden");$("adForm").reset();$("adId").value=""};
$("cancelAd").onclick=()=>$("adForm").classList.add("hidden");
$("adForm").onsubmit=async e=>{e.preventDefault();const id=$("adId").value,body={title:$("adTitle").value,image:$("adImage").value,link:$("adLink").value,position:$("adPosition").value,device:$("adDevice").value,status:$("adStatus").value};try{await api(id?"/api/admin/ads/"+id:"/api/admin/ads",{method:id?"PATCH":"POST",body:JSON.stringify(body)});$("adForm").classList.add("hidden");toast("विज्ञापन सेव हो गया");loadAds()}catch(err){toast(err.message)}};
window.editAd=id=>{const a=ads.find(x=>x._id===id);if(!a)return;$("adForm").classList.remove("hidden");$("adId").value=id;$("adTitle").value=a.title||"";$("adImage").value=a.image||"";$("adLink").value=a.link||"";$("adPosition").value=a.position||"home_top";$("adDevice").value=a.device||"all";$("adStatus").value=a.status||"active"};
window.deleteAd=async id=>{if(!confirm("यह विज्ञापन delete करें?"))return;try{await api("/api/admin/ads/"+id,{method:"DELETE"});toast("Deleted");loadAds()}catch(e){toast(e.message)}};

async function loadAdmins(){if(me.role!=="owner")return;const r=await api("/api/admin/admins");admins=r.admins;$("adminList").innerHTML=admins.map(a=>'<div class="list-row"><div><b>'+esc(a.name)+' · '+esc(a.email)+'</b><small>'+esc(a.role)+' · '+(a.active?"Active":"Disabled")+' · '+esc((a.permissions||[]).join(", "))+'</small></div><div><button onclick="editAdmin(\\''+a._id+'\\')">Edit</button><button class="danger" onclick="deleteAdmin(\\''+a._id+'\\')">Delete</button></div></div>').join("")}
$("newAdmin").onclick=()=>{$("adminForm").classList.remove("hidden");$("adminForm").reset();$("adminId").value=""};
$("cancelAdmin").onclick=()=>$("adminForm").classList.add("hidden");
$("adminForm").onsubmit=async e=>{e.preventDefault();const id=$("adminId").value,body={name:$("adminName").value,email:$("adminEmail").value,password:$("adminPassword").value,role:$("adminRole").value,permissions:$("adminPermissions").value.split(",").map(x=>x.trim()).filter(Boolean),active:$("adminActive").checked};if(!body.password)delete body.password;try{await api(id?"/api/admin/admins/"+id:"/api/admin/admins",{method:id?"PATCH":"POST",body:JSON.stringify(body)});$("adminForm").classList.add("hidden");toast("Admin saved");loadAdmins()}catch(err){toast(err.message)}};
window.editAdmin=id=>{const a=admins.find(x=>x._id===id);if(!a)return;$("adminForm").classList.remove("hidden");$("adminId").value=id;$("adminName").value=a.name||"";$("adminEmail").value=a.email||"";$("adminPassword").value="";$("adminRole").value=a.role==="owner"?"editor":a.role;$("adminPermissions").value=(a.permissions||[]).join(",");$("adminActive").checked=!!a.active};
window.deleteAdmin=async id=>{if(!confirm("Admin delete करें?"))return;try{await api("/api/admin/admins/"+id,{method:"DELETE"});toast("Deleted");loadAdmins()}catch(e){toast(e.message)}};
boot();