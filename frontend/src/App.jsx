import React, { useMemo, useState } from "react";

import {
  Home,
  Search,
  Menu,
  X,
  MapPin,
  ChevronRight,
  ChevronLeft,
  Bell,
  Bookmark,
  Share2,
  Clock3,
  Eye,
  Play,
  Video,
  Newspaper,
  Radio,
  Grid3X3,
  MoreHorizontal,
  ArrowRight,
  TrendingUp,
  CloudSun,
  Sun,
  CalendarDays,
  User,
  Settings,
  Info,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  Send,
  CheckCircle2,
  Flame,
  NewspaperIcon,
  Globe2,
  ShieldCheck,
  BriefcaseBusiness,
  GraduationCap,
  HeartPulse,
  Trophy,
  Landmark,
  Plane,
  ShoppingBag,
  Mic,
  Volume2,
  RefreshCw,
  ExternalLink,
  AlertCircle,
  BookmarkCheck,
  Image as ImageIcon
} from "lucide-react";


/* =========================================================
   BRAND CONFIGURATION
========================================================= */

const BRAND = {
  name: "आवाज़ राजस्थान",
  englishName: "Awaaz Rajasthan",
  tagline: "आपकी आवाज़, आपका राजस्थान",
  description:
    "राजस्थान की हर बड़ी खबर, हर जिले की आवाज़ और देश-दुनिया की ताज़ा जानकारी।",
  primary: "#c90000",
  dark: "#071a35",
  navy: "#071a35",
  gold: "#e7b51d"
};


/* =========================================================
   DISTRICTS
========================================================= */

const districts = [
  "अजमेर",
  "अलवर",
  "बांसवाड़ा",
  "बारां",
  "बाड़मेर",
  "भरतपुर",
  "भीलवाड़ा",
  "बीकानेर",
  "बूंदी",
  "चित्तौड़गढ़",
  "चूरू",
  "दौसा",
  "धौलपुर",
  "डूंगरपुर",
  "हनुमानगढ़",
  "जयपुर",
  "जैसलमेर",
  "जालोर",
  "झालावाड़",
  "झुंझुनूं",
  "जोधपुर",
  "करौली",
  "कोटा",
  "नागौर",
  "पाली",
  "प्रतापगढ़",
  "राजसमंद",
  "सवाई माधोपुर",
  "सीकर",
  "सिरोही",
  "श्रीगंगानगर",
  "टोंक",
  "उदयपुर"
];


/* =========================================================
   NAVIGATION
========================================================= */

const topCategories = [
  {
    id: "home",
    label: "होम",
    icon: Home
  },
  {
    id: "rajasthan",
    label: "राजस्थान",
    icon: Landmark
  },
  {
    id: "districts",
    label: "जिले",
    icon: MapPin
  },
  {
    id: "politics",
    label: "राजनीति",
    icon: BriefcaseBusiness
  },
  {
    id: "crime",
    label: "अपराध",
    icon: ShieldCheck
  }
];


const moreCategories = [
  {
    id: "national",
    label: "देश",
    icon: Landmark
  },
  {
    id: "international",
    label: "विदेश",
    icon: Globe2
  },
  {
    id: "education",
    label: "शिक्षा",
    icon: GraduationCap
  },
  {
    id: "health",
    label: "स्वास्थ्य",
    icon: HeartPulse
  },
  {
    id: "sports",
    label: "खेल",
    icon: Trophy
  },
  {
    id: "business",
    label: "व्यापार",
    icon: ShoppingBag
  },
  {
    id: "entertainment",
    label: "मनोरंजन",
    icon: Radio
  },
  {
    id: "technology",
    label: "टेक्नोलॉजी",
    icon: Grid3X3
  },
  {
    id: "tourism",
    label: "पर्यटन",
    icon: Plane
  }
];


/* =========================================================
   NEWS DATA
========================================================= */

const newsData = [
  {
    id: 1,
    category: "राजस्थान",
    district: "जयपुर",
    title:
      "राजस्थान में पर्यटन को मिलेगा नया आयाम, सरकार ने जारी की बड़ी योजना",
    description:
      "राज्य में पर्यटन सुविधाओं के विस्तार और नए पर्यटन स्थलों को विकसित करने के लिए सरकार ने नई योजना की घोषणा की है।",
    image:
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80",
    time: "2 घंटे पहले",
    views: "12.4K",
    trending: true
  },

  {
    id: 2,
    category: "राजनीति",
    district: "जयपुर",
    title:
      "राजस्थान की राजनीति में बड़ा घटनाक्रम, नेताओं की अहम बैठक आज",
    description:
      "राजधानी जयपुर में आज होने वाली महत्वपूर्ण बैठक पर सभी की नजरें टिकी हुई हैं।",
    image:
      "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1200&q=80",
    time: "1 घंटे पहले",
    views: "8.7K",
    trending: true
  },

  {
    id: 3,
    category: "राजस्थान",
    district: "उदयपुर",
    title:
      "उदयपुर बना देश का पसंदीदा पर्यटन शहर, पर्यटकों की संख्या में रिकॉर्ड बढ़ोतरी",
    description:
      "झीलों की नगरी उदयपुर में इस वर्ष बड़ी संख्या में देशी और विदेशी पर्यटक पहुंचे।",
    image:
      "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80",
    time: "3 घंटे पहले",
    views: "11.2K"
  },

  {
    id: 4,
    category: "अपराध",
    district: "जयपुर",
    title:
      "जयपुर में पुलिस की बड़ी कार्रवाई, कई मामलों में आरोपियों से पूछताछ",
    description:
      "राजधानी में पुलिस ने अलग-अलग मामलों में कार्रवाई करते हुए कई संदिग्धों को हिरासत में लिया।",
    image:
      "https://images.unsplash.com/photo-1453873531674-2151bcd01707?auto=format&fit=crop&w=1200&q=80",
    time: "4 घंटे पहले",
    views: "7.1K"
  },

  {
    id: 5,
    category: "शिक्षा",
    district: "कोटा",
    title:
      "कोटा में विद्यार्थियों के लिए नई सुविधा, शिक्षा व्यवस्था में बड़ा बदलाव",
    description:
      "विद्यार्थियों की सुविधा और बेहतर शिक्षा व्यवस्था के लिए नई पहल शुरू की जा रही है।",
    image:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80",
    time: "5 घंटे पहले",
    views: "6.3K"
  },

  {
    id: 6,
    category: "मौसम",
    district: "जोधपुर",
    title:
      "राजस्थान में मौसम ने बदला मिजाज, कई जिलों में बारिश का अलर्ट",
    description:
      "मौसम विभाग ने राज्य के कई जिलों के लिए बारिश और तेज हवाओं को लेकर अलर्ट जारी किया है।",
    image:
      "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=1200&q=80",
    time: "6 घंटे पहले",
    views: "9.8K"
  },

  {
    id: 7,
    category: "देश",
    district: "",
    title:
      "देशभर में कई महत्वपूर्ण फैसले, आज की प्रमुख खबरों पर एक नजर",
    description:
      "देशभर से दिन की महत्वपूर्ण खबरें और बड़े अपडेट लगातार सामने आ रहे हैं।",
    image:
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80",
    time: "7 घंटे पहले",
    views: "5.9K"
  },

  {
    id: 8,
    category: "खेल",
    district: "जयपुर",
    title:
      "राजस्थान के खिलाड़ियों का शानदार प्रदर्शन, प्रतियोगिता में जीते कई पदक",
    description:
      "राजस्थान के खिलाड़ियों ने राष्ट्रीय स्तर की प्रतियोगिता में शानदार प्रदर्शन किया।",
    image:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80",
    time: "8 घंटे पहले",
    views: "4.6K"
  }
];


/* =========================================================
   QUICK FEATURES
========================================================= */

const quickFeatures = [
  {
    id: "epaper",
    title: "ई-पेपर",
    subtitle: "आज का अखबार",
    icon: Newspaper,
    color: "red"
  },
  {
    id: "live",
    title: "लाइव टीवी",
    subtitle: "सीधे देखें",
    icon: Video,
    color: "blue"
  },
  {
    id: "videos",
    title: "वीडियो",
    subtitle: "ताज़ा वीडियो",
    icon: Play,
    color: "orange"
  },
  {
    id: "district",
    title: "जिला समाचार",
    subtitle: "अपने जिले की खबर",
    icon: MapPin,
    color: "pink"
  },
  {
    id: "photos",
    title: "फोटो गैलरी",
    subtitle: "तस्वीरें देखें",
    icon: ImageIcon,
    color: "green"
  },
  {
    id: "weather",
    title: "मौसम",
    subtitle: "आज का मौसम",
    icon: CloudSun,
    color: "yellow"
  },
  {
    id: "jobs",
    title: "रोजगार",
    subtitle: "नौकरी अपडेट",
    icon: BriefcaseBusiness,
    color: "purple"
  },
  {
    id: "results",
    title: "रिजल्ट",
    subtitle: "परीक्षा परिणाम",
    icon: CheckCircle2,
    color: "teal"
  }
];


/* =========================================================
   VIDEOS
========================================================= */

const videos = [
  {
    id: 1,
    title: "राजस्थान की बड़ी खबरें एक नजर में",
    duration: "03:24",
    image:
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 2,
    title: "राजस्थान का लोक संगीत और संस्कृति",
    duration: "04:12",
    image:
      "https://images.unsplash.com/photo-1533130061792-64b345e4a833?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 3,
    title: "जयपुर की खास खबरें",
    duration: "02:48",
    image:
      "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=900&q=80"
  }
];


/* =========================================================
   UTILITY
========================================================= */

function formatDate() {
  return new Intl.DateTimeFormat("hi-IN", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(new Date());
}


/* =========================================================
   APP
========================================================= */

export default function App() {
  const [activePage, setActivePage] = useState("home");

  const [searchOpen, setSearchOpen] = useState(false);

  const [searchText, setSearchText] = useState("");

  const [menuOpen, setMenuOpen] = useState(false);

  const [notificationOpen, setNotificationOpen] = useState(false);

  const [selectedDistrict, setSelectedDistrict] = useState("");

  const [selectedArticle, setSelectedArticle] = useState(null);

  const [bookmarked, setBookmarked] = useState([]);

  const [toast, setToast] = useState("");

  const [darkMode, setDarkMode] = useState(false);


  /* =======================================================
     FILTERED SEARCH
  ======================================================= */

  const searchedNews = useMemo(() => {
    if (!searchText.trim()) {
      return newsData;
    }

    const query = searchText.toLowerCase();

    return newsData.filter((item) => {
      return (
        item.title.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.district.toLowerCase().includes(query)
      );
    });
  }, [searchText]);


  /* =======================================================
     BOOKMARK
  ======================================================= */

  function toggleBookmark(id) {
    setBookmarked((previous) => {
      if (previous.includes(id)) {
        showToast("खबर बुकमार्क से हटा दी गई");
        return previous.filter((item) => item !== id);
      }

      showToast("खबर बुकमार्क कर दी गई");
      return [...previous, id];
    });
  }


  /* =======================================================
     TOAST
  ======================================================= */

  function showToast(message) {
    setToast(message);

    setTimeout(() => {
      setToast("");
    }, 2500);
  }


  /* =======================================================
     NAVIGATION
  ======================================================= */

  function navigate(page) {
    setActivePage(page);
    setSelectedArticle(null);
    setMenuOpen(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }


  /* =======================================================
     OPEN ARTICLE
  ======================================================= */

  function openArticle(article) {
    setSelectedArticle(article);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }


  /* =======================================================
     SHARE
  ======================================================= */

  async function shareArticle(article) {
    const shareData = {
      title: article.title,
      text: `${article.title} — ${BRAND.name}`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(
          `${article.title} ${window.location.href}`
        );

        showToast("लिंक कॉपी कर दिया गया");
      }
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <div className={darkMode ? "app dark-mode" : "app"}>

      {/* ==================================================
          TOP DESKTOP BRAND BAR
      ================================================== */}

      <header className="site-header">

        <div className="top-header">

          <div className="header-container">

            <button
              className="mobile-menu-button"
              onClick={() => setMenuOpen(true)}
              aria-label="मेन्यू"
            >
              <Menu size={23} />
            </button>


            <div
              className="brand-area"
              onClick={() => navigate("home")}
            >

              <img
                src="/logo.png"
                alt="आवाज़ राजस्थान"
                className="brand-logo"
              />

              <div className="brand-text">

                <div className="brand-name">
                  आवाज़ <span>राजस्थान</span>
                </div>

                <div className="brand-tagline">
                  — आपकी आवाज़, आपका राजस्थान —
                </div>

              </div>

            </div>


            <div className="header-right">

              <div className="header-date">
                <CalendarDays size={15} />
                <span>{formatDate()}</span>
              </div>


              <button
                className="header-icon-button"
                onClick={() => setNotificationOpen(!notificationOpen)}
                aria-label="सूचनाएं"
              >
                <Bell size={21} />

                <span className="notification-dot"></span>
              </button>


              <button
                className="header-icon-button"
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label="खोजें"
              >
                {searchOpen ? <X size={22} /> : <Search size={22} />}
              </button>


              <button
                className="header-menu-button"
                onClick={() => setMenuOpen(true)}
              >
                <Menu size={22} />
                <span>मेन्यू</span>
              </button>

            </div>

          </div>

        </div>


        {/* =================================================
            SEARCH BAR
        ================================================= */}

        {searchOpen && (
          <div className="search-panel">

            <div className="search-container">

              <Search size={20} />

              <input
                autoFocus
                type="text"
                placeholder="खबर, शहर, जिला या विषय खोजें..."
                value={searchText}
                onChange={(event) =>
                  setSearchText(event.target.value)
                }
              />

              {searchText && (
                <button
                  onClick={() => setSearchText("")}
                  className="clear-search"
                >
                  <X size={18} />
                </button>
              )}

            </div>

          </div>
        )}


        {/* =================================================
            NOTIFICATION PANEL
        ================================================= */}

        {notificationOpen && (
          <div className="notification-panel">

            <div className="notification-header">
              <strong>ताज़ा सूचनाएं</strong>

              <button
                onClick={() => setNotificationOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="notification-item">
              <div className="notification-icon">
                <Flame size={18} />
              </div>

              <div>
                <strong>ब्रेकिंग न्यूज़</strong>
                <p>राजस्थान से बड़ी खबरें लगातार अपडेट हो रही हैं।</p>
              </div>
            </div>

            <div className="notification-item">
              <div className="notification-icon">
                <CloudSun size={18} />
              </div>

              <div>
                <strong>मौसम अपडेट</strong>
                <p>कई जिलों में बारिश का अलर्ट जारी।</p>
              </div>
            </div>

          </div>
        )}


        {/* =================================================
            BREAKING TICKER
        ================================================= */}

        <div className="breaking-bar">

          <div className="breaking-inner">

            <div className="breaking-label">
              <Flame size={17} />
              <span>ब्रेकिंग न्यूज़</span>
            </div>

            <div className="ticker-content">

              <span>
                राजस्थान में मानसून को लेकर मौसम विभाग का बड़ा अपडेट...
              </span>

              <span>
                जयपुर में नई विकास परियोजनाओं को मिली मंजूरी...
              </span>

              <span>
                राजस्थान के कई जिलों में बारिश का अलर्ट...
              </span>

            </div>

            <button className="ticker-arrow">
              <ChevronRight size={18} />
            </button>

          </div>

        </div>


        {/* =================================================
            PRIMARY NAVIGATION
        ================================================= */}

        <nav className="main-navigation">

          <div className="navigation-container">

            {topCategories.map((item) => {

              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  className={
                    activePage === item.id
                      ? "nav-item active"
                      : "nav-item"
                  }
                  onClick={() => navigate(item.id)}
                >

                  <Icon size={17} />

                  <span>{item.label}</span>

                </button>
              );
            })}


            <button
              className="nav-item"
              onClick={() => navigate("national")}
            >
              <Globe2 size={17} />
              <span>देश-दुनिया</span>
            </button>


            <button
              className="nav-item"
              onClick={() => setMenuOpen(true)}
            >
              <MoreHorizontal size={18} />
              <span>अन्य</span>
            </button>

          </div>

        </nav>

      </header>


      {/* ==================================================
          MAIN CONTENT
      ================================================== */}

      <main className="main-content">

        {selectedArticle ? (

          <ArticlePage
            article={selectedArticle}
            bookmarked={bookmarked.includes(selectedArticle.id)}
            onBack={() => setSelectedArticle(null)}
            onBookmark={() => toggleBookmark(selectedArticle.id)}
            onShare={() => shareArticle(selectedArticle)}
            onOpenArticle={openArticle}
          />

        ) : activePage === "home" ? (

          <HomePage
            news={searchedNews}
            bookmarked={bookmarked}
            onBookmark={toggleBookmark}
            onShare={shareArticle}
            onOpenArticle={openArticle}
            onNavigate={navigate}
            onDistrict={setSelectedDistrict}
            selectedDistrict={selectedDistrict}
          />

        ) : activePage === "districts" ? (

          <DistrictPage
            selectedDistrict={selectedDistrict}
            setSelectedDistrict={setSelectedDistrict}
            onOpenArticle={openArticle}
            onNavigate={navigate}
          />

        ) : activePage === "epaper" ? (

          <EPaperPage />

        ) : activePage === "live" ? (

          <LivePage />

        ) : activePage === "videos" ? (

          <VideosPage
            videos={videos}
          />

        ) : activePage === "photos" ? (

          <PhotosPage />

        ) : activePage === "weather" ? (

          <WeatherPage />

        ) : (

          <CategoryPage
            category={activePage}
            news={newsData}
