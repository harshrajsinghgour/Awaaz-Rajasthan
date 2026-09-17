import { useEffect, useMemo, useRef, useState } from "react";

const API_BASE = (import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || "").replace(/\/$/, "");
const E_PAPER_URL = import.meta.env.VITE_E_PAPER_URL || "/epaper";
const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY || "";

const CATEGORIES = ["होम","राजस्थान","जयपुर","जोधपुर","उदयपुर","कोटा","अजमेर","भीलवाड़ा","बीकानेर","अलवर","अपराध","राजनीति","खेल","देश","दुनिया","मनोरंजन","बिजनेस"];
const DISTRICTS = ["जयपुर","जोधपुर","उदयपुर","कोटा","अजमेर","भीलवाड़ा","बीकानेर","अलवर"];
const FALLBACK = [
  { id:"f1", category:"राजस्थान", title:"राजस्थान की बड़ी खबरें और दिनभर के महत्वपूर्ण अपडेट्स", excerpt:"प्रदेश के अलग-अलग जिलों से सामने आई प्रमुख खबरें और जनहित से जुड़ी जानकारी एक जगह।", image:"https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1400&q=82", time:"अभी", location:"राजस्थान" },
  { id:"f2", category:"जयपुर", title:"जयपुर से जुड़ी महत्वपूर्ण खबर और शहर के नए अपडेट", excerpt:"शहर की नागरिक सुविधाओं और प्रमुख गतिविधियों से जुड़े ताजा अपडेट।", image:"https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=900&q=82", time:"10 मिनट पहले", location:"जयपुर" },
  { id:"f3", category:"खेल", title:"खेल जगत की प्रमुख खबरें और आज के अहम अपडेट", excerpt:"प्रतियोगिताओं और खेल जगत से जुड़ी महत्वपूर्ण जानकारी।", image:"https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=900&q=82", time:"25 मिनट पहले", location:"राजस्थान" },
  { id:"f4", category:"देश", title:"देशभर की प्रमुख खबरें और जरूरी राष्ट्रीय अपडेट", excerpt:"देश के अलग-अलग हिस्सों से दिन की महत्वपूर्ण खबरें।", image:"https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=900&q=82", time:"40 मिनट पहले", location:"भारत" },
  { id:"f5", category:"अपराध", title:"पुलिस और प्रशासन से जुड़े महत्वपूर्ण अपडेट", excerpt:"स्थानीय घटनाओं और आधिकारिक अपडेट का संक्षिप्त विवरण।", image:"https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=900&q=82", time:"1 घंटा पहले", location:"राजस्थान" }
];

const icon = name => {
  const paths = {
    menu:<><path d="M4 6h16M4 12h16M4 18h16"/></>,
    search:<><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/></>,
    bell:<><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></>,
    home:<><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></>,
    fire:<><path d="M12 22c4.5 0 7-3 7-7 0-4.1-2.6-6.4-4.5-9.4-.4 2.3-1.5 3.6-2.7 4.5.1-3.2-1.5-5.8-3.4-7.1.1 3.7-4 6.2-4 11.3 0 4.6 3.2 7.7 7.6 7.7Z"/></>,
    bookmark:<><path d="M6 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18l-6-3-6 3z"/></>,
    share:<><circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m8.3 10.8 7.4-4.5M8.3 13.2l7.4 4.5"/></>,
    arrow:<><path d="M5 12h13M13 6l6 6-6 6"/></>,
    close:<><path d="m6 6 12 12M18 6 6 18"/></>,
    location:<><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
    clock:<><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>
  };
  return <span className="svg-icon"><svg viewBox="0 0 24 24">{paths[name]}</svg></span>;
};

function normalize(item,index){
  const fallback=FALLBACK[index % FALLBACK.length];
  return { id:item._id || item.id || `api-${index}`, category:item.category || "राजस्थान", title:item.title || "ताज़ा खबर", excerpt:item.excerpt || item.summary || item.description || "", image:item.image || item.imageUrl || item.thumbnail || fallback.image, time:item.createdAt ? new Date(item.createdAt).toLocaleString("hi-IN",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"}) : item.time || "अभी", location:item.location || item.city || "राजस्थान", author:item.author || item.reporter || "आवाज़ राजस्थान", content:item.content || "" };
}

function AdSlot({position="home_top",className=""}){
  const [ad,setAd]=useState(null);
  const impression=useRef(false);
  useEffect(()=>{
    if(!API_BASE)return;
    let cancelled=false;
    fetch(`${API_BASE}/api/ads?position=${encodeURIComponent(position)}&device=${window.innerWidth<768?"mobile":"desktop"}`,{headers:{Accept:"application/json"}})
      .then(r=>r.ok?r.json():Promise.reject())
      .then(data=>{const list=Array.isArray(data)?data:(data.ads||data.data||[]);if(!cancelled&&list[0])setAd(list[0]);})
      .catch(()=>{});
    return()=>{cancelled=true;};
  },[position]);
  useEffect(()=>{
    const id=ad?._id||ad?.id;
    if(!API_BASE||!id||impression.current)return;
    impression.current=true;
    fetch(`${API_BASE}/api/ads/${id}/impression`,{method:"POST"}).catch(()=>{});
  },[ad]);
  if(!ad)return <div className={`ad-slot ${className}`}><span>विज्ञापन</span></div>;
  const image=ad.image||ad.imageUrl||ad.banner;
  const href=ad.link||"#";
  return <a className={`ad-slot ad-live ${className}`} href={href} target="_blank" rel="noreferrer" onClick={()=>fetch(`${API_BASE}/api/ads/${ad._id||ad.id}/click`,{method:"POST"}).catch(()=>{})}>{image?<img src={image} alt={ad.title||"विज्ञापन"}/>:<span>{ad.title||"विज्ञापन"}</span>}</a>;
}

export default function AppProduction(){
  const [news,setNews]=useState(FALLBACK);
  const [category,setCategory]=useState("होम");
  const [query,setQuery]=useState("");
  const [searchOpen,setSearchOpen]=useState(false);
  const [menuOpen,setMenuOpen]=useState(false);
  const [saved,setSaved]=useState(()=>{try{return JSON.parse(localStorage.getItem("awaaz-bookmarks")||"[]");}catch{return [];}});
  const [savedOnly,setSavedOnly]=useState(false);
  const [article,setArticle]=useState(null);
  const [notifyOpen,setNotifyOpen]=useState(false);
  const [notifyState,setNotifyState]=useState("idle");
  const [toast,setToast]=useState("");

  useEffect(()=>{
    document.documentElement.lang="hi";
    if(!API_BASE)return;
    let cancelled=false;
    fetch(`${API_BASE}/api/news?limit=100`,{headers:{Accept:"application/json"}}).then(r=>r.ok?r.json():Promise.reject()).then(data=>{
      const list=Array.isArray(data)?data:(data.news||data.data||data.articles||[]);
      if(!cancelled&&list.length)setNews(list.map(normalize));
    }).catch(()=>{});
    return()=>{cancelled=true;};
  },[]);
  useEffect(()=>{localStorage.setItem("awaaz-bookmarks",JSON.stringify(saved));},[saved]);
  useEffect(()=>{if(!toast)return;const t=setTimeout(()=>setToast(""),2200);return()=>clearTimeout(t);},[toast]);

  const filtered=useMemo(()=>{
    const q=query.trim().toLowerCase();
    return news.filter(n=>{
      const cat=category==="होम"||n.category===category||n.location===category;
      const match=!q||[n.title,n.excerpt,n.category,n.location].join(" ").toLowerCase().includes(q);
      const keep=!savedOnly||saved.includes(String(n.id));
      return cat&&match&&keep;
    });
  },[news,category,query,savedOnly,saved]);

  const featured=filtered[0]||null;
  const secondary=filtered.slice(1,4);
  const latest=filtered.slice(featured?1:0);

  function selectCategory(value){setCategory(value);setSavedOnly(false);setMenuOpen(false);window.scrollTo({top:0,behavior:"smooth"});}
  function toggleSave(id){const key=String(id);setSaved(prev=>prev.includes(key)?prev.filter(x=>x!==key):[...prev,key]);setToast(saved.includes(key)?"खबर सेव से हटाई गई":"खबर सेव हो गई");}
  async function share(item){const url=`${window.location.origin}${window.location.pathname}#news-${encodeURIComponent(item.id)}`;try{if(navigator.share)await navigator.share({title:item.title,text:item.excerpt,url});else{await navigator.clipboard.writeText(url);setToast("लिंक कॉपी हो गया");}}catch{}}
  async function openArticle(item){
    setArticle(item);window.history.replaceState(null,"",`#news-${encodeURIComponent(item.id)}`);window.scrollTo({top:0,behavior:"smooth"});
    if(!API_BASE||String(item.id).startsWith("f"))return;
    try{const r=await fetch(`${API_BASE}/api/news/${encodeURIComponent(item.id)}`,{headers:{Accept:"application/json"}});if(!r.ok)return;const d=await r.json();const n=d.news||d.data||d.article||d;setArticle(prev=>prev?{...prev,...normalize(n,0)}:prev);}catch{}
  }
  function closeArticle(){setArticle(null);window.history.replaceState(null,"",window.location.pathname+window.location.search);}
  async function enableNotifications(){
    if(!("Notification" in window)||!("serviceWorker" in navigator)){setNotifyState("error");setToast("इस डिवाइस पर नोटिफिकेशन उपलब्ध नहीं है");return;}
    setNotifyState("loading");
    try{
      const permission=await Notification.requestPermission();if(permission!=="granted")throw new Error("permission");
      const reg=await navigator.serviceWorker.register("/sw.js");
      if(VAPID_PUBLIC_KEY&&"PushManager" in window){
        const pad="=".repeat((4-VAPID_PUBLIC_KEY.length%4)%4);const raw=atob((VAPID_PUBLIC_KEY+pad).replace(/-/g,"+").replace(/_/g,"/"));
        const key=Uint8Array.from([...raw],c=>c.charCodeAt(0));const sub=await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:key});
        if(API_BASE)await fetch(`${API_BASE}/api/notifications/subscribe`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(sub)});
      }
      setNotifyState("on");setToast("नोटिफिकेशन चालू हो गए");
    }catch{setNotifyState("error");setToast("नोटिफिकेशन सेट नहीं हो सके");}
  }

  return <div className="app">
    <div className="utility-bar"><div className="container utility-inner"><span>राजस्थान की हर खबर, सबसे पहले</span><span>{new Date().toLocaleDateString("hi-IN",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</span></div></div>
    <header className="header">
      <div className="container header-main">
        <button className="header-btn menu-button" aria-label="मेन्यू" onClick={()=>setMenuOpen(v=>!v)}>{icon("menu")}</button>
        <button className="brand" aria-label="आवाज़ राजस्थान होम" onClick={()=>selectCategory("होम")}><span className="brand-seal"><span>आ</span><i>R</i></span><span className="brand-text"><b>आवाज़ राजस्थान</b><small>RAJASTHAN NEWS NETWORK</small></span></button>
        <div className="header-actions"><button className="header-btn" aria-label="सर्च" onClick={()=>setSearchOpen(v=>!v)}>{icon("search")}</button><button className="header-btn notification-button" aria-label="नोटिफिकेशन" onClick={()=>setNotifyOpen(v=>!v)}>{icon("bell")}<em className={notifyState==="on"?"on":""}>{notifyState==="on"?"✓":"3"}</em></button></div>
        {notifyOpen&&<div className="notification-pop"><b>नवीनतम अपडेट</b><p>आवाज़ राजस्थान की महत्वपूर्ण खबरों की सूचना सीधे अपने डिवाइस पर पाएं।</p><button onClick={enableNotifications}>{notifyState==="on"?"नोटिफिकेशन चालू हैं":notifyState==="loading"?"सेट हो रहा है…":"नोटिफिकेशन चालू करें"}</button></div>}
      </div>
      <div className={`nav-wrap ${menuOpen?"nav-open":""}`}><div className="container nav">{CATEGORIES.map(c=><button key={c} className={category===c&&!savedOnly?"active":""} onClick={()=>selectCategory(c)}>{c}</button>)}<button className={savedOnly?"active saved-tab":"saved-tab"} onClick={()=>{setSavedOnly(true);setMenuOpen(false);}}>{icon("bookmark")} सेव खबरें</button></div></div>
    </header>
    {searchOpen&&<div className="search-panel"><div className="container search-box">{icon("search")}<input autoFocus value={query} onChange={e=>setQuery(e.target.value)} placeholder="खबर, शहर या विषय खोजें..."/><button aria-label="बंद करें" onClick={()=>{setQuery("");setSearchOpen(false)}}>{icon("close")}</button></div></div>}
    <div className="breaking"><div className="container breaking-inner"><span className="breaking-label"><i/>BREAKING</span><div className="breaking-news"><span>राजस्थान</span><b>ताज़ा खबरों और महत्वपूर्ण अपडेट्स के लिए आवाज़ राजस्थान के साथ जुड़े रहें</b></div><button aria-label="सर्च" onClick={()=>setSearchOpen(true)}>{icon("search")}</button></div></div>
    <main><section className="hero-shell container">
      <AdSlot position="home_top" className="top-ad"/>
      <div className="section-head"><div><span className="section-kicker">आज की खबरें</span><h1>{savedOnly?"सेव की गई खबरें":category==="होम"?"राजस्थान की प्रमुख खबरें":category}</h1></div><span className="live-status"><i/> LIVE UPDATES</span></div>
      {featured?<div className="lead-grid">
        <article className="lead-card" onClick={()=>openArticle(featured)}><div className="lead-image"><img src={featured.image} alt="" loading="eager"/><span className="image-label">{featured.category}</span><span className="photo-credit">आवाज़ राजस्थान</span></div><div className="lead-content"><div className="meta-line"><span>{icon("clock")} {featured.time}</span><span>{icon("location")} {featured.location}</span></div><h2>{featured.title}</h2><p>{featured.excerpt}</p><div className="card-bottom"><button className="read-button" onClick={e=>{e.stopPropagation();openArticle(featured)}}>पूरी खबर पढ़ें {icon("arrow")}</button><button className={saved.includes(String(featured.id))?"round-action saved":"round-action"} aria-label="सेव" onClick={e=>{e.stopPropagation();toggleSave(featured.id)}}>{icon("bookmark")}</button></div></div></article>
        <div className="secondary-list">{secondary.map(item=><article className="secondary-card" key={item.id} onClick={()=>openArticle(item)}><img src={item.image} alt="" loading="lazy"/><div><span>{item.category} · {item.time}</span><h3>{item.title}</h3><p>{item.location}</p></div></article>)}</div>
      </div>:<div className="empty-large"><span>📰</span><h2>इस खोज के लिए खबर नहीं मिली</h2><p>कोई दूसरा शब्द, शहर या कैटेगरी चुनकर देखें।</p><button onClick={()=>{setQuery("");setSavedOnly(false);setCategory("होम")}}>सभी खबरें देखें</button></div>}
      <div className="district-row"><div className="district-title"><span>जिले</span><b>लोकल खबरें</b></div><div className="district-scroll">{DISTRICTS.map(d=><button key={d} onClick={()=>selectCategory(d)}>{icon("location")}{d}</button>)}</div></div>
      <div className="content-layout"><section className="latest-section"><div className="section-head compact"><div><span className="section-kicker">लेटेस्ट</span><h2>ताज़ा खबरें</h2></div><button className="text-button" onClick={()=>selectCategory("होम")}>सभी देखें {icon("arrow")}</button></div><div className="latest-list">{latest.map(item=><article className="news-row" key={item.id} onClick={()=>openArticle(item)}><div className="row-image"><img src={item.image} alt="" loading="lazy"/><span>{item.category}</span></div><div className="row-body"><div className="meta-line"><span>{item.time}</span><span>{item.location}</span></div><h3>{item.title}</h3><p>{item.excerpt}</p><div className="row-actions"><button className={saved.includes(String(item.id))?"saved":""} aria-label="सेव" onClick={e=>{e.stopPropagation();toggleSave(item.id)}}>{icon("bookmark")}</button><button aria-label="शेयर" onClick={e=>{e.stopPropagation();share(item)}}>{icon("share")}</button></div></div></article>)}{!latest.length&&<div className="empty-state">अभी इस सेक्शन में कोई खबर उपलब्ध नहीं है।</div>}</div></section>
      <aside className="sidebar"><AdSlot position="sidebar" className="side-ad"/><div className="widget"><div className="widget-head"><div><span className="section-kicker">TRENDING</span><h3>आज की चर्चा</h3></div><span className="fire">{icon("fire")}</span></div>{news.slice(0,5).map((item,i)=><button className="trend-item" key={item.id} onClick={()=>openArticle(item)}><b>{String(i+1).padStart(2,"0")}</b><span>{item.title}</span></button>)}</div><div className="widget quick-widget"><div className="widget-head"><div><span className="section-kicker">स्पेशल</span><h3>ई-पेपर</h3></div></div><div className="epaper"><div className="paper-lines"><i/><i/><i/><i/><i/></div><div><b>आज का ई-पेपर</b><span>मुख्य पृष्ठ और प्रमुख खबरें</span></div><a href={E_PAPER_URL}>देखें {icon("arrow")}</a></div></div></aside></div>
    </section></main>
    <footer className="footer"><div className="container footer-main"><div className="footer-brand"><span className="brand-seal small"><span>आ</span><i>R</i></span><div><b>आवाज़ राजस्थान</b><small>RAJASTHAN NEWS NETWORK</small></div></div><p>राजस्थान की खबरों का आपका भरोसेमंद डिजिटल न्यूज़ प्लेटफॉर्म। स्थानीय खबरों से लेकर देश-दुनिया की प्रमुख खबरें, एक ही जगह।</p><div className="footer-links"><button>हमारे बारे में</button><button>संपर्क करें</button><button>विज्ञापन</button><button>प्राइवेसी</button><button>डिस्क्लेमर</button></div></div><div className="copyright">© {new Date().getFullYear()} आवाज़ राजस्थान · सर्वाधिकार सुरक्षित</div></footer>
    <nav className="mobile-bottom"><button className={category==="होम"&&!savedOnly?"active":""} onClick={()=>selectCategory("होम")}>{icon("home")}<span>होम</span></button><button onClick={()=>setSearchOpen(true)}>{icon("search")}<span>सर्च</span></button><button onClick={()=>selectCategory("राजस्थान")}>{icon("fire")}<span>ताज़ा</span></button><button className={savedOnly?"active":""} onClick={()=>{setSavedOnly(true);setCategory("होम")}}>{icon("bookmark")}<span>सेव</span></button></nav>
    {article&&<div className="article-overlay" role="dialog" aria-modal="true"><div className="article-modal"><button className="modal-close" aria-label="बंद करें" onClick={closeArticle}>{icon("close")}</button><img className="article-cover" src={article.image} alt=""/><div className="article-content"><span className="article-category">{article.category}</span><h1>{article.title}</h1><div className="article-meta"><span>{icon("clock")} {article.time}</span><span>{icon("location")} {article.location}</span><span>रिपोर्ट: {article.author}</span></div><p className="article-lead">{article.excerpt}</p>{article.content?<div className="article-body">{String(article.content).split(/\n+/).filter(Boolean).map((p,i)=><p key={i}>{p}</p>)}</div>:<div className="article-placeholder">पूरी खबर की विस्तृत सामग्री यहां प्रदर्शित होगी।</div>}<div className="article-tools"><button className={saved.includes(String(article.id))?"saved":""} onClick={()=>toggleSave(article.id)}>{icon("bookmark")} {saved.includes(String(article.id))?"सेव है":"सेव करें"}</button><button onClick={()=>share(article)}>{icon("share")} शेयर</button></div></div></div></div>}
    {toast&&<div className="toast">{toast}</div>}
  </div>;
}
