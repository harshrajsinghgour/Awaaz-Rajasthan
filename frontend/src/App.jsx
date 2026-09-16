import { useEffect, useMemo, useRef, useState } from "react";

const API_BASE = (import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || "").replace(/\/$/, "");
const E_PAPER_URL = import.meta.env.VITE_E_PAPER_URL || "/epaper";
const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY || "";

const categories = [
  "होम","राजस्थान","जयपुर","जोधपुर","उदयपुर","कोटा","अजमेर","भीलवाड़ा",
  "बीकानेर","अलवर","अपराध","राजनीति","खेल","देश","दुनिया","मनोरंजन","बिजनेस"
];

const districts = ["जयपुर","जोधपुर","उदयपुर","कोटा","अजमेर","भीलवाड़ा","बीकानेर","अलवर"];

const fallbackNews = [
  { id:"f1", category:"राजस्थान", title:"राजस्थान की बड़ी खबरें: दिनभर की प्रमुख घटनाओं और जरूरी अपडेट्स पर एक नज़र", excerpt:"प्रदेश के अलग-अलग जिलों से सामने आई महत्वपूर्ण खबरें, स्थानीय अपडेट और जनहित से जुड़ी जानकारी एक जगह।", image:"https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1400&q=82", time:"अभी", location:"राजस्थान" },
  { id:"f2", category:"जयपुर", title:"जयपुर में शहर से जुड़े महत्वपूर्ण विकास कार्यों पर नई तैयारियां", excerpt:"शहर की नागरिक सुविधाओं और प्रमुख प्रोजेक्ट्स से जुड़े ताजा अपडेट।", image:"https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=900&q=82", time:"10 मिनट पहले", location:"जयपुर" },
  { id:"f3", category:"खेल", title:"खेल जगत की बड़ी अपडेट, खिलाड़ियों ने दिखाया शानदार प्रदर्शन", excerpt:"आज की प्रमुख प्रतियोगिताओं और खेल जगत की अहम खबरें।", image:"https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=900&q=82", time:"25 मिनट पहले", location:"राजस्थान" },
  { id:"f4", category:"देश", title:"देशभर की प्रमुख खबरें और जरूरी राष्ट्रीय अपडेट", excerpt:"देश के अलग-अलग हिस्सों से दिन की महत्वपूर्ण खबरें।", image:"https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=900&q=82", time:"40 मिनट पहले", location:"भारत" },
  { id:"f5", category:"अपराध", title:"पुलिस और प्रशासन से जुड़े महत्वपूर्ण अपडेट सामने आए", excerpt:"स्थानीय स्तर पर हुई प्रमुख घटनाओं और आधिकारिक अपडेट का संक्षिप्त विवरण।", image:"https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=900&q=82", time:"1 घंटा पहले", location:"राजस्थान" },
  { id:"f6", category:"बिजनेस", title:"बाजार और कारोबार से जुड़ी आज की प्रमुख खबरें", excerpt:"व्यापार, बाजार और स्थानीय अर्थव्यवस्था से जुड़े जरूरी अपडेट।", image:"https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=900&q=82", time:"1 घंटा पहले", location:"भारत" }
];

const icons = {
  menu: <svg viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>,
  search: <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/></svg>,
  bell: <svg viewBox="0 0 24 24"><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></svg>,
  home: <svg viewBox="0 0 24 24"><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg>,
  fire: <svg viewBox="0 0 24 24"><path d="M12 22c4.5 0 7-3 7-7 0-4.1-2.6-6.4-4.5-9.4-.4 2.3-1.5 3.6-2.7 4.5.1-3.2-1.5-5.8-3.4-7.1.1 3.7-4 6.2-4 11.3 0 4.6 3.2 7.7 7.6 7.7Z"/></svg>,
  bookmark: <svg viewBox="0 0 24 24"><path d="M6 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18l-6-3-6 3z"/></svg>,
  share: <svg viewBox="0 0 24 24"><circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m8.3 10.8 7.4-4.5M8.3 13.2l7.4 4.5"/></svg>,
  arrow: <svg viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6"/></svg>,
  close: <svg viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18"/></svg>,
  clock: <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>,
  location: <svg viewBox="0 0 24 24"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg>,
  play: <svg viewBox="0 0 24 24"><path d="m9 6 10 6-10 6z"/></svg>
};

function Icon({name}) { return <span className="svg-icon">{icons[name]}</span>; }

function normalizeNews(item, index) {
  return {
    id: item._id || item.id || `api-${index}`,
    category: item.category || item.categoryName || "राजस्थान",
    title: item.title || item.headline || item.name || "ताज़ा खबर",
    excerpt: item.excerpt || item.summary || item.description || "",
    image: item.image || item.imageUrl || item.thumbnail || fallbackNews[index % fallbackNews.length].image,
    time: item.createdAt ? new Date(item.createdAt).toLocaleString("hi-IN", {day:"numeric", month:"short", hour:"2-digit", minute:"2-digit"}) : item.time || "अभी",
    location: item.location || item.city || "राजस्थान",
    author: item.author || item.reporter || "आवाज़ राजस्थान"
  };
}

function AdSlot({position="home_top", className=""}) {
  const [ad, setAd] = useState(null);
  const impressionSent = useRef(false);
  useEffect(() => {
    if (!API_BASE) return;
    fetch(`${API_BASE}/api/ads?position=${encodeURIComponent(position)}&device=${window.innerWidth < 768 ? "mobile" : "desktop"}`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => {
        const list = Array.isArray(data) ? data : data.ads || data.data || [];
        if (list[0]) setAd(list[0]);
      }).catch(() => {});
  }, [position]);
  useEffect(() => {
    const id = ad?._id || ad?.id;
    if (!API_BASE || !id || impressionSent.current) return;
    impressionSent.current = true;
    fetch(`${API_BASE}/api/ads/${id}/impression`, { method: "POST", credentials: "include" }).catch(() => {});
  }, [ad]);

  if (!ad) return <div className={`ad-slot ${className}`}><span>विज्ञापन</span></div>;
  const href = ad.link || ad.targetUrl || "#";
  const image = ad.image || ad.imageUrl || ad.banner;
  return <a className={`ad-slot ad-live ${className}`} href={href} target="_blank" rel="noreferrer" onClick={() => API_BASE && fetch(`${API_BASE}/api/ads/${ad._id || ad.id}/click`,{method:"POST"}).catch(()=>{})}>
    {image ? <img src={image} alt={ad.title || "विज्ञापन"} /> : <span>{ad.title || "विज्ञापन"}</span>}
  </a>;
}

function App() {
  const [activeCategory, setActiveCategory] = useState("होम");
  const [news, setNews] = useState(fallbackNews);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [article, setArticle] = useState(null);
  const [bookmarks, setBookmarks] = useState(() => { try { return JSON.parse(localStorage.getItem("awaaz-bookmarks") || "[]"); } catch { return []; } });
  const [notificationState, setNotificationState] = useState("idle");
  const [savedOnly, setSavedOnly] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    document.documentElement.lang = "hi";
    if (!API_BASE) return;
    let cancelled = false;
    fetch(`${API_BASE}/api/news?limit=50`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => {
        const list = Array.isArray(data) ? data : data.news || data.data || data.articles || [];
        if (!cancelled && list.length) setNews(list.map(normalizeNews));
      }).catch(() => {});
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    localStorage.setItem("awaaz-bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2200);
    return () => clearTimeout(timer);
  }, [toast]);

  const filteredNews = useMemo(() => {
    const term = search.trim().toLowerCase();
    return news.filter(item => {
      const cat = activeCategory === "होम" || item.category === activeCategory || item.location === activeCategory;
      const searchMatch = !term || [item.title,item.excerpt,item.category,item.location].join(" ").toLowerCase().includes(term);
      const saved = !savedOnly || bookmarks.includes(String(item.id));
      return cat && searchMatch && saved;
    });
  }, [activeCategory, news, search, savedOnly, bookmarks]);

  const featured = filteredNews[0] || (!search && !savedOnly && activeCategory === "होम" ? news[0] : null);
  const secondary = filteredNews.slice(1, 4);
  const latest = filteredNews.slice(featured ? 1 : 0);
  const trending = [...news].slice(0, 5);

  function selectCategory(category) {
    setActiveCategory(category);
    setSavedOnly(false);
    setMenuOpen(false);
    window.scrollTo({top:0, behavior:"smooth"});
  }

  function toggleBookmark(id) {
    const key = String(id);
    setBookmarks(prev => prev.includes(key) ? prev.filter(x => x !== key) : [...prev, key]);
    setToast(bookmarks.includes(key) ? "बुकमार्क हटाया गया" : "खबर सेव हो गई");
  }

  async function shareArticle(item) {
    const url = window.location.href.split("#")[0] + `#news-${item.id}`;
    try {
      if (navigator.share) await navigator.share({title:item.title, text:item.excerpt, url});
      else { await navigator.clipboard.writeText(url); setToast("लिंक कॉपी हो गया"); }
    } catch {}
  }

  function openArticle(item) {
    setArticle(item);
    window.history.replaceState(null, "", `#news-${item.id}`);
    window.scrollTo({top:0, behavior:"smooth"});
  }

  async function openArticle(item) {
    setArticle(item);
    window.history.replaceState(null, "", `#news-${encodeURIComponent(item.id)}`);
    window.scrollTo({top:0, behavior:"smooth"});

    if (!API_BASE || !item.id || String(item.id).startsWith("f")) return;
    const candidates = [
      `/api/news/${encodeURIComponent(item.id)}`,
      `/api/articles/${encodeURIComponent(item.id)}`
    ];
    for (const path of candidates) {
      try {
        const response = await fetch(`${API_BASE}${path}`, { credentials:"include", headers:{Accept:"application/json"} });
        if (!response.ok) continue;
        const payload = await response.json();
        const data = payload?.news || payload?.article || payload?.data || payload;
        if (data && typeof data === "object") {
          setArticle(prev => prev ? {
            ...prev,
            content: data.content || data.body || data.articleBody || data.text || data.description || prev.content,
            excerpt: data.excerpt || data.summary || data.description || prev.excerpt,
            image: data.image || data.imageUrl || data.thumbnail || prev.image,
            author: data.author || data.reporter || prev.author
          } : prev);
          break;
        }
      } catch {}
    }
  }

  function closeArticle() {
    setArticle(null);
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
  }

  async function subscribeNotifications() {
    if (!("Notification" in window) || !("serviceWorker" in navigator)) {
      setNotificationState("error");
      setToast("इस डिवाइस पर नोटिफिकेशन उपलब्ध नहीं है");
      return;
    }
    setNotificationState("loading");
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") throw new Error("permission");
      const registration = await navigator.serviceWorker.register("/sw.js");
      if (VAPID_PUBLIC_KEY && "PushManager" in window) {
        const padding = "=".repeat((4 - VAPID_PUBLIC_KEY.length % 4) % 4);
        const base64 = (VAPID_PUBLIC_KEY + padding).replace(/-/g, "+").replace(/_/g, "/");
        const raw = window.atob(base64);
        const key = Uint8Array.from([...raw].map(char => char.charCodeAt(0)));
        const subscription = await registration.pushManager.subscribe({ userVisibleOnly:true, applicationServerKey:key });
        if (API_BASE) {
          await fetch(`${API_BASE}/api/notifications/subscribe`, {
            method:"POST", credentials:"include",
            headers:{"Content-Type":"application/json",Accept:"application/json"},
            body:JSON.stringify(subscription)
          });
        }
      }
      setNotificationState("on");
      setToast("नोटिफिकेशन चालू हो गए");
    } catch {
      setNotificationState("error");
      setToast("नोटिफिकेशन सेट नहीं हो सके");
    }
  }

  return (
    <div className="app">
      <div className="utility-bar">
        <div className="container utility-inner">
          <span>राजस्थान की हर खबर, सबसे पहले</span>
          <span>{new Date().toLocaleDateString("hi-IN",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</span>
        </div>
      </div>

      <header className="header">
        <div className="container header-main">
          <button className="header-btn menu-button" onClick={() => setMenuOpen(v=>!v)} aria-label="मेन्यू"><Icon name="menu"/></button>
          <button className="brand" onClick={() => selectCategory("होम")} aria-label="आवाज़ राजस्थान होम">
            <span className="brand-seal"><span>आ</span><i>R</i></span>
            <span className="brand-text"><b>आवाज़ राजस्थान</b><small>RAJASTHAN NEWS NETWORK</small></span>
          </button>
          <div className="header-actions">
            <button className="header-btn" onClick={() => setSearchOpen(v=>!v)} aria-label="सर्च"><Icon name="search"/></button>
            <button className="header-btn notification-button" onClick={() => setNotificationOpen(v=>!v)} aria-label="नोटिफिकेशन"><Icon name="bell"/><em className={notificationState === "on" ? "on" : ""}>{notificationState === "on" ? "✓" : "3"}</em></button>
          </div>
          {notificationOpen && <div className="notification-pop"><b>नवीनतम अपडेट</b><p>आवाज़ राजस्थान की महत्वपूर्ण खबरों की सूचना सीधे आपके डिवाइस पर पाएं।</p><button onClick={subscribeNotifications}>{notificationState === "on" ? "नोटिफिकेशन चालू हैं" : notificationState === "loading" ? "सेट हो रहा है…" : "नोटिफिकेशन चालू करें"}</button>{notificationState === "error" && <small>ब्राउज़र की notification permission जांचें।</small>}</div>}
        </div>

        <div className={`nav-wrap ${menuOpen ? "nav-open" : ""}`}>
          <div className="container nav">
            {categories.map(category => <button key={category} className={activeCategory===category && !savedOnly ? "active":""} onClick={()=>selectCategory(category)}>{category}</button>)}
            <button className={savedOnly ? "active saved-tab":""} onClick={()=>{setSavedOnly(true);setMenuOpen(false);setActiveCategory("होम");}}><Icon name="bookmark"/> सेव खबरें</button>
          </div>
        </div>
      </header>

      {searchOpen && <div className="search-panel"><div className="container search-box"><Icon name="search"/><input autoFocus value={search} onChange={e=>setSearch(e.target.value)} placeholder="खबर, शहर या विषय खोजें..." /><button onClick={()=>{setSearch("");setSearchOpen(false)}}><Icon name="close"/></button></div></div>}

      <div className="breaking">
        <div className="container breaking-inner">
          <span className="breaking-label"><i></i BREAKING</span>
          <div className="breaking-news"><span>राजस्थान</span><b>ताज़ा खबरों और महत्वपूर्ण अपडेट्स के लिए आवाज़ राजस्थान के साथ जुड़े रहें</b></div>
          <button onClick={()=>setSearchOpen(true)}><Icon name="search"/></button>
        </div>
      </div>

      <main>
        <section className="hero-shell container">
          <AdSlot position="home_top" className="top-ad"/>
          <div className="section-head">
            <div><span className="section-kicker">आज की खबरें</span><h1>{savedOnly ? "सेव की गई खबरें" : activeCategory === "होम" ? "राजस्थान की प्रमुख खबरें" : activeCategory}</h1></div>
            <span className="live-status"><i></i> LIVE UPDATES</span>
          </div>

          {featured && <div className="lead-grid">
            <article className="lead-card" onClick={()=>openArticle(featured)}>
              <div className="lead-image"><img src={featured.image} alt="" loading="eager"/><span className="image-label">{featured.category}</span><span className="photo-credit">आवाज़ राजस्थान</span></div>
              <div className="lead-content">
                <div className="meta-line"><span><Icon name="clock"/> {featured.time}</span><span><Icon name="location"/> {featured.location}</span></div>
                <h2>{featured.title}</h2>
                <p>{featured.excerpt}</p>
                <div className="card-bottom"><button className="read-button">पूरी खबर पढ़ें <Icon name="arrow"/></button><button className={bookmarks.includes(String(featured.id)) ? "round-action saved":"round-action"} onClick={e=>{e.stopPropagation();toggleBookmark(featured.id)}} aria-label="सेव"><Icon name="bookmark"/></button></div>
              </div>
            </article>

            <div className="secondary-list">
              {secondary.map(item => <article className="secondary-card" key={item.id} onClick={()=>openArticle(item)}>
                <img src={item.image} alt="" loading="lazy"/>
                <div><span>{item.category} · {item.time}</span><h3>{item.title}</h3><p>{item.location}</p></div>
              </article>)}
            </div>
          </div>}

          {!featured && <div className="empty-large"><span>📰</span><h2>इस खोज के लिए खबर नहीं मिली</h2><p>कोई दूसरा शब्द, शहर या कैटेगरी चुनकर देखें।</p><button onClick={()=>{setSearch("");setSavedOnly(false);setActiveCategory("होम")}}>सभी खबरें देखें</button></div>}

          <div className="district-row">
            <div className="district-title"><span>जिले</span><b>लोकल खबरें</b></div>
            <div className="district-scroll">{districts.map(d=><button key={d} onClick={()=>selectCategory(d)}><Icon name="location"/>{d}</button>)}</div>
          </div>

          <div className="content-layout">
            <section className="latest-section">
              <div className="section-head compact"><div><span className="section-kicker">लेटेस्ट</span><h2>ताज़ा खबरें</h2></div><button className="text-button" onClick={()=>selectCategory("होम")}>सभी देखें <Icon name="arrow"/></button></div>
              <div className="latest-list">
                {latest.map(item => <article className="news-row" key={item.id} onClick={()=>openArticle(item)}>
                  <div className="row-image"><img src={item.image} alt="" loading="lazy"/><span>{item.category}</span></div>
                  <div className="row-body"><div className="meta-line"><span>{item.time}</span><span>{item.location}</span></div><h3>{item.title}</h3><p>{item.excerpt}</p><div className="row-actions"><button className={bookmarks.includes(String(item.id)) ? "saved":""} onClick={e=>{e.stopPropagation();toggleBookmark(item.id)}}><Icon name="bookmark"/></button><button onClick={e=>{e.stopPropagation();shareArticle(item)}}><Icon name="share"/></button></div></div>
                </article>)}
                {!latest.length && !featured && <div className="empty-state">अभी इस सेक्शन में कोई खबर उपलब्ध नहीं है।</div>}
              </div>
            </section>

            <aside className="sidebar">
              <AdSlot position="sidebar" className="side-ad"/>
              <div className="widget">
                <div className="widget-head"><div><span className="section-kicker">TRENDING</span><h3>आज की चर्चा</h3></div><span className="fire"><Icon name="fire"/></span></div>
                {trending.map((item,index)=><button className="trend-item" key={item.id} onClick={()=>openArticle(item)}><b>{String(index+1).padStart(2,"0")}</b><span>{item.title}</span></button>)}
              </div>
              <div className="widget quick-widget"><div className="widget-head"><div><span className="section-kicker">स्पेशल</span><h3>ई-पेपर</h3></div></div><div className="epaper"><div className="paper-lines"><i></i><i></i><i></i><i></i><i></i></div><div><b>आज का ई-पेपर</b><span>मुख्य पृष्ठ और प्रमुख खबरें</span></div><a href={E_PAPER_URL}>देखें <Icon name="arrow"/></a></div></div>
            </aside>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-main">
          <div className="footer-brand"><span className="brand-seal small"><span>आ</span><i>R</i></span><div><b>आवाज़ राजस्थान</b><small>RAJASTHAN NEWS NETWORK</small></div></div>
          <p>राजस्थान की खबरों का आपका भरोसेमंद डिजिटल न्यूज़ प्लेटफॉर्म। स्थानीय खबरों से लेकर देश-दुनिया की प्रमुख खबरें, एक ही जगह।</p>
          <div className="footer-links"><button>हमारे बारे में</button><button>संपर्क करें</button><button>विज्ञापन</button><button>प्राइवेसी</button><button>डिस्क्लेमर</button></div>
        </div>
        <div className="copyright">© {new Date().getFullYear()} आवाज़ राजस्थान · सर्वाधिकार सुरक्षित</div>
      </footer>

      <nav className="mobile-bottom">
        <button className={activeCategory==="होम" && !savedOnly ? "active":""} onClick={()=>selectCategory("होम")}><Icon name="home"/><span>होम</span></button>
        <button onClick={()=>{setSearchOpen(true);window.scrollTo({top:0,behavior:"smooth"})}}><Icon name="search"/><span>सर्च</span></button>
        <button onClick={()=>selectCategory("राजस्थान")}><Icon name="fire"/><span>ताज़ा</span></button>
        <button className={savedOnly ? "active":""} onClick={()=>{setSavedOnly(true);setActiveCategory("होम")}}><Icon name="bookmark"/><span>सेव</span></button>
      </nav>

      {article && <div className="article-overlay" role="dialog" aria-modal="true">
        <div className="article-modal">
          <button className="modal-close" onClick={closeArticle} aria-label="बंद करें"><Icon name="close"/></button>
          <img className="article-cover" src={article.image} alt="" />
          <div className="article-content">
            <span className="article-category">{article.category}</span>
            <h1>{article.title}</h1>
            <div className="article-meta"><span><Icon name="clock"/> {article.time}</span><span><Icon name="location"/> {article.location}</span><span>रिपोर्ट: {article.author}</span></div>
            <p className="article-lead">{article.excerpt}</p>
            {article.content ? <div className="article-body">{String(article.content).split(/\n+/).filter(Boolean).map((paragraph,index)=><p key={index}>{paragraph}</p>)}</div> : <div className="article-placeholder">पूरी खबर की सामग्री उपलब्ध होने पर यहां विस्तृत समाचार प्रदर्शित होगा।</div>}
            <div className="article-tools"><button className={bookmarks.includes(String(article.id)) ? "saved":""} onClick={()=>toggleBookmark(article.id)}><Icon name="bookmark"/> {bookmarks.includes(String(article.id)) ? "सेव है":"सेव करें"}</button><button onClick={()=>shareArticle(article)}><Icon name="share"/> शेयर</button></div>
          </div>
        </div>
      </div>}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

export default App;
