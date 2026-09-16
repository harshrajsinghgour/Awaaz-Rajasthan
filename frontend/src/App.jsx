import { useEffect, useMemo, useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "";

const categories = [
  "होम", "राजस्थान", "जयपुर", "जोधपुर", "उदयपुर", "कोटा", "अपराध", "राजनीति", "खेल", "देश", "दुनिया"
];

const fallbackNews = [
  {
    id: 1,
    category: "राजस्थान",
    title: "राजस्थान की बड़ी खबरें: दिनभर की प्रमुख घटनाओं पर एक नज़र",
    excerpt: "प्रदेश के अलग-अलग जिलों से सामने आई महत्वपूर्ण खबरों और अपडेट्स का संक्षिप्त विवरण।",
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80",
    time: "अभी"
  },
  {
    id: 2,
    category: "जयपुर",
    title: "जयपुर में विकास कार्यों को लेकर नई तैयारियां",
    excerpt: "शहर से जुड़े महत्वपूर्ण प्रोजेक्ट्स और नागरिक सुविधाओं पर प्रशासन की नई योजना।",
    image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=900&q=80",
    time: "आज"
  },
  {
    id: 3,
    category: "खेल",
    title: "खेल जगत की बड़ी अपडेट, खिलाड़ियों ने दिखाया शानदार प्रदर्शन",
    excerpt: "आज के प्रमुख खेल समाचार और प्रतियोगिताओं से जुड़ी अहम जानकारी।",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=900&q=80",
    time: "आज"
  },
  {
    id: 4,
    category: "देश",
    title: "देशभर की प्रमुख खबरें और जरूरी अपडेट",
    excerpt: "देश के अलग-अलग हिस्सों से दिन की महत्वपूर्ण खबरें एक जगह।",
    image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=900&q=80",
    time: "आज"
  }
];

function App() {
  const [activeCategory, setActiveCategory] = useState("होम");
  const [news, setNews] = useState(fallbackNews);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (!API_BASE) return;
    let cancelled = false;

    fetch(`${API_BASE}/api/news?limit=12`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        const items = Array.isArray(data) ? data : data.news || data.data || [];
        if (!cancelled && items.length) {
          setNews(items.map((item, index) => ({
            id: item._id || item.id || index,
            category: item.category || "राजस्थान",
            title: item.title || item.headline || "ताज़ा खबर",
            excerpt: item.excerpt || item.summary || "",
            image: item.image || item.imageUrl || fallbackNews[index % fallbackNews.length].image,
            time: item.createdAt ? new Date(item.createdAt).toLocaleDateString("hi-IN") : "अभी"
          })));
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const filteredNews = useMemo(() => {
    const term = search.trim().toLowerCase();
    return news.filter((item) => {
      const categoryMatch = activeCategory === "होम" || item.category === activeCategory;
      const searchMatch = !term || `${item.title} ${item.excerpt} ${item.category}`.toLowerCase().includes(term);
      return categoryMatch && searchMatch;
    });
  }, [activeCategory, news, search]);

  const featured = filteredNews[0] || news[0];
  const sideNews = filteredNews.slice(1, 4);

  return (
    <div className={`app-container ${darkMode ? "theme-dark" : ""}`}>
      <div className="top-strip">
        <div className="container top-strip-inner">
          <span>राजस्थान की हर खबर, सबसे पहले</span>
          <span className="top-date">{new Date().toLocaleDateString("hi-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</span>
        </div>
      </div>

      <header className="site-header">
        <div className="container header-main">
          <button className="icon-btn mobile-menu-btn" aria-label="मेन्यू" onClick={() => setMenuOpen(!menuOpen)}>☰</button>

          <a className="brand" href="#" onClick={(e) => { e.preventDefault(); setActiveCategory("होम"); setSearch(""); }}>
            <span className="brand-mark"><span>आ</span></span>
            <span className="brand-copy">
              <strong>आवाज़ राजस्थान</strong>
              <small>RAJASTHAN NEWS</small>
            </span>
          </a>

          <div className="header-actions">
            <button className="icon-btn" aria-label="सर्च" onClick={() => setSearchOpen(!searchOpen)}>⌕</button>
            <button className="icon-btn" aria-label="थीम" onClick={() => setDarkMode(!darkMode)}>{darkMode ? "☀" : "◐"}</button>
          </div>
        </div>

        <nav className={`category-nav ${menuOpen ? "open" : ""}`}>
          <div className="container nav-scroll">
            {categories.map((category) => (
              <button
                key={category}
                className={activeCategory === category ? "active" : ""}
                onClick={() => { setActiveCategory(category); setMenuOpen(false); }}
              >
                {category}
              </button>
            ))}
          </div>
        </nav>
      </header>

      {searchOpen && (
        <div className="search-panel">
          <div className="container search-inner">
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="खबर खोजें..."
              aria-label="खबर खोजें"
            />
            <button onClick={() => { setSearch(""); setSearchOpen(false); }}>×</button>
          </div>
        </div>
      )}

      <div className="breaking-bar">
        <div className="container breaking-inner">
          <span className="breaking-label">BREAKING</span>
          <div className="breaking-track">राजस्थान की ताज़ा खबरें और महत्वपूर्ण अपडेट पढ़ें — आवाज़ राजस्थान के साथ जुड़े रहें</div>
        </div>
      </div>

      <main className="container main-content">
        <section className="ad-slot top-ad">
          <span>विज्ञापन</span>
        </section>

        <div className="section-heading">
          <div>
            <span className="eyebrow">ताज़ा अपडेट</span>
            <h1>{activeCategory === "होम" ? "आज की प्रमुख खबरें" : activeCategory}</h1>
          </div>
          <span className="live-dot"><i /> LIVE UPDATES</span>
        </div>

        {featured && (
          <section className="news-layout">
            <article className="featured-card">
              <div className="image-wrap">
                <img src={featured.image} alt={featured.title} />
                <span className="category-badge">{featured.category}</span>
              </div>
              <div className="featured-body">
                <span className="news-time">{featured.time}</span>
                <h2>{featured.title}</h2>
                <p>{featured.excerpt}</p>
                <button className="read-more">पूरी खबर पढ़ें <span>→</span></button>
              </div>
            </article>

            <div className="side-list">
              {sideNews.map((item) => (
                <article className="side-card" key={item.id}>
                  <img src={item.image} alt="" />
                  <div>
                    <span>{item.category} · {item.time}</span>
                    <h3>{item.title}</h3>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        <section className="content-grid">
          <div className="news-column">
            <div className="section-heading compact">
              <div>
                <span className="eyebrow">लेटेस्ट</span>
                <h2>ताज़ा खबरें</h2>
              </div>
            </div>

            {filteredNews.slice(1).map((item) => (
              <article className="news-row" key={item.id}>
                <img src={item.image} alt="" />
                <div>
                  <span className="news-meta">{item.category} • {item.time}</span>
                  <h3>{item.title}</h3>
                  <p>{item.excerpt}</p>
                </div>
              </article>
            ))}

            {!filteredNews.length && (
              <div className="empty-state">इस कैटेगरी या सर्च के लिए कोई खबर नहीं मिली।</div>
            )}
          </div>

          <aside className="sidebar">
            <div className="ad-slot sidebar-ad"><span>विज्ञापन</span></div>
            <div className="sidebar-card">
              <div className="sidebar-title"><span>लोकप्रिय</span><b>आज की चर्चा</b></div>
              {news.slice(0, 5).map((item, index) => (
                <div className="popular-item" key={item.id}>
                  <strong>{String(index + 1).padStart(2, "0")}</strong>
                  <span>{item.title}</span>
                </div>
              ))}
            </div>
          </aside>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-grid">
          <div>
            <div className="footer-brand">आवाज़ राजस्थान</div>
            <p>राजस्थान की खबरों का आपका भरोसेमंद डिजिटल प्लेटफॉर्म।</p>
          </div>
          <div>
            <h4>श्रेणियां</h4>
            <p>राजस्थान · जयपुर · जोधपुर · उदयपुर · खेल</p>
          </div>
          <div>
            <h4>संपर्क</h4>
            <p>न्यूज़ डेस्क · विज्ञापन · फीडबैक</p>
          </div>
        </div>
        <div className="copyright">© {new Date().getFullYear()} आवाज़ राजस्थान. सर्वाधिकार सुरक्षित।</div>
      </footer>
    </div>
  );
}

export default App;