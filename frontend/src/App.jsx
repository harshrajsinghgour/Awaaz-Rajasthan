import React, { useState } from "react";

import {
  Menu,
  Search,
  X,
  Home,
  MapPin,
  Newspaper,
  Play,
  BookOpen,
  Bell,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Clock3,
  Share2,
  Bookmark,
  BookmarkCheck,
  MessageCircle,
  Eye,
  User,
  Radio,
  FileText,
  Video,
  CalendarDays,
  TrendingUp,
  Map,
  Building2,
  GraduationCap,
  BriefcaseBusiness,
  Trophy,
  CloudSun,
  MoreHorizontal,
  Instagram,
  Facebook,
  Youtube,
  Send,
  Settings,
  Phone,
  Mail,
  ExternalLink,
  Flame,
  Zap,
  NewspaperIcon,
  CircleUserRound
} from "lucide-react";

/*
========================================================
                 AWAAZ RAJASTHAN
              PROFESSIONAL NEWS PORTAL
========================================================

  PART 4-A
  - React imports
  - Icons
  - Main news data
  - District data
  - Category data
========================================================
*/


/* =====================================================
   BRAND CONFIGURATION
===================================================== */

const BRAND = {
  name: "आवाज़ राजस्थान",
  englishName: "AWAAZ RAJASTHAN",
  tagline: "आपकी आवाज़, आपका राजस्थान",

  colors: {
    red: "#c90000",
    darkRed: "#9f0000",
    navy: "#07182d",
    dark: "#050b14",
    gold: "#d7a63b",
    white: "#ffffff",
    light: "#f5f6f8",
    text: "#111827",
    muted: "#667085",
    border: "#e5e7eb"
  }
};


/* =====================================================
   MAIN NEWS DATA
===================================================== */

const NEWS_DATA = [
  {
    id: 1,
    category: "राजस्थान",
    title:
      "राजस्थान में मौसम ने बदला मिजाज, कई जिलों में बारिश का अलर्ट",
    shortTitle:
      "राजस्थान में बदला मौसम, कई जिलों में बारिश का अलर्ट",
    location: "जयपुर",
    time: "10 मिनट पहले",
    author: "आवाज़ राजस्थान डेस्क",
    image:
      "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=1200&q=85",
    views: "12.4K",
    featured: true,
    breaking: true
  },

  {
    id: 2,
    category: "राजस्थान",
    title:
      "जयपुर में ट्रैफिक व्यवस्था को लेकर बड़ा बदलाव, नई व्यवस्था लागू",
    shortTitle:
      "जयपुर में ट्रैफिक व्यवस्था में बड़ा बदलाव",
    location: "जयपुर",
    time: "25 मिनट पहले",
    author: "जयपुर ब्यूरो",
    image:
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=900&q=80",
    views: "8.7K"
  },

  {
    id: 3,
    category: "शिक्षा",
    title:
      "राजस्थान के विद्यार्थियों के लिए महत्वपूर्ण अपडेट, परीक्षा को लेकर नई सूचना",
    shortTitle:
      "विद्यार्थियों के लिए महत्वपूर्ण परीक्षा अपडेट",
    location: "राजस्थान",
    time: "42 मिनट पहले",
    author: "एजुकेशन डेस्क",
    image:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80",
    views: "15.2K"
  },

  {
    id: 4,
    category: "राजनीति",
    title:
      "राजस्थान की राजनीति में आज का दिन अहम, नेताओं की बैठकों का दौर जारी",
    shortTitle:
      "राजस्थान की राजनीति में आज का दिन अहम",
    location: "जयपुर",
    time: "1 घंटा पहले",
    author: "राजनीति डेस्क",
    image:
      "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=900&q=80",
    views: "10.8K"
  },

  {
    id: 5,
    category: "रोजगार",
    title:
      "सरकारी नौकरी की तैयारी कर रहे युवाओं के लिए नई भर्तियों को लेकर अपडेट",
    shortTitle:
      "युवाओं के लिए नई भर्तियों को लेकर बड़ा अपडेट",
    location: "राजस्थान",
    time: "1 घंटा पहले",
    author: "रोजगार डेस्क",
    image:
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=80",
    views: "18.1K"
  },

  {
    id: 6,
    category: "अपराध",
    title:
      "पुलिस की बड़ी कार्रवाई, मामले में कई महत्वपूर्ण सुराग सामने आए",
    shortTitle:
      "पुलिस की बड़ी कार्रवाई, कई सुराग मिले",
    location: "भीलवाड़ा",
    time: "2 घंटे पहले",
    author: "क्राइम रिपोर्टर",
    image:
      "https://images.unsplash.com/photo-1453873531674-2151bcd01707?auto=format&fit=crop&w=900&q=80",
    views: "7.4K"
  },

  {
    id: 7,
    category: "खेल",
    title:
      "राजस्थान के खिलाड़ियों का शानदार प्रदर्शन, प्रतियोगिता में जीते कई पदक",
    shortTitle:
      "राजस्थान के खिलाड़ियों का शानदार प्रदर्शन",
    location: "उदयपुर",
    time: "2 घंटे पहले",
    author: "स्पोर्ट्स डेस्क",
    image:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=900&q=80",
    views: "6.9K"
  },

  {
    id: 8,
    category: "देश",
    title:
      "देशभर में आज की प्रमुख खबरें, जानिए दिनभर के बड़े अपडेट",
    shortTitle:
      "देशभर की आज की प्रमुख खबरें",
    location: "नई दिल्ली",
    time: "3 घंटे पहले",
    author: "नेशनल डेस्क",
    image:
      "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=900&q=80",
    views: "21.3K"
  },

  {
    id: 9,
    category: "बिजनेस",
    title:
      "बाजार में आज उतार-चढ़ाव, निवेशकों की नजर महत्वपूर्ण आंकड़ों पर",
    shortTitle:
      "बाजार में आज उतार-चढ़ाव",
    location: "मुंबई",
    time: "3 घंटे पहले",
    author: "बिजनेस डेस्क",
    image:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=900&q=80",
    views: "9.8K"
  },

  {
    id: 10,
    category: "लाइफस्टाइल",
    title:
      "बदलती लाइफस्टाइल में सेहत का रखें ध्यान, विशेषज्ञों ने बताए जरूरी उपाय",
    shortTitle:
      "लाइफस्टाइल में सेहत का रखें ध्यान",
    location: "जयपुर",
    time: "4 घंटे पहले",
    author: "लाइफस्टाइल डेस्क",
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=900&q=80",
    views: "5.6K"
  }
];


/* =====================================================
   BREAKING NEWS DATA
===================================================== */

const BREAKING_NEWS = [
  "राजस्थान में मौसम ने बदला मिजाज, कई जिलों में बारिश का अलर्ट",
  "सरकारी नौकरी की तैयारी कर रहे युवाओं के लिए महत्वपूर्ण अपडेट",
  "जयपुर में ट्रैफिक व्यवस्था को लेकर बड़ा बदलाव",
  "राजस्थान के विद्यार्थियों के लिए परीक्षा से जुड़ी नई सूचना",
  "प्रदेश में आज की बड़ी राजनीतिक बैठक पर सभी की नजर"
];


/* =====================================================
   DISTRICT DATA
===================================================== */

const DISTRICTS = [
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
  "जालौर",
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


/* =====================================================
   CATEGORY DATA
===================================================== */

const CATEGORIES = [
  {
    id: "rajasthan",
    name: "राजस्थान",
    icon: MapPin
  },
  {
    id: "national",
    name: "देश",
    icon: Building2
  },
  {
    id: "politics",
    name: "राजनीति",
    icon: TrendingUp
  },
  {
    id: "crime",
    name: "अपराध",
    icon: Bell
  },
  {
    id: "education",
    name: "शिक्षा",
    icon: GraduationCap
  },
  {
    id: "jobs",
    name: "रोजगार",
    icon: BriefcaseBusiness
  },
  {
    id: "sports",
    name: "खेल",
    icon: Trophy
  },
  {
    id: "business",
    name: "बिजनेस",
    icon: TrendingUp
  },
  {
    id: "weather",
    name: "मौसम",
    icon: CloudSun
  },
  {
    id: "lifestyle",
    name: "लाइफस्टाइल",
    icon: User
  }
];


/* =====================================================
   QUICK FEATURES
===================================================== */

const QUICK_FEATURES = [
  {
    id: "live",
    title: "लाइव टीवी",
    subtitle: "अभी देखें",
    icon: Radio
  },
  {
    id: "epaper",
    title: "ई-पेपर",
    subtitle: "आज का अखबार",
    icon: Newspaper
  },
  {
    id: "district",
    title: "जिला खबरें",
    subtitle: "अपने जिले की खबर",
    icon: Map
  },
  {
    id: "video",
    title: "वीडियो",
    subtitle: "ताजा वीडियो",
    icon: Video
  },
  {
    id: "jobs",
    title: "सरकारी नौकरी",
    subtitle: "भर्ती अपडेट",
    icon: BriefcaseBusiness
  },
  {
    id: "education",
    title: "शिक्षा",
    subtitle: "एजुकेशन अपडेट",
    icon: GraduationCap
  }
];


/* =====================================================
   TOP MENU ITEMS
===================================================== */

const MENU_ITEMS = [
  {
    id: "home",
    title: "होम",
    icon: Home
  },
  {
    id: "rajasthan",
    title: "राजस्थान",
    icon: MapPin
  },
  {
    id: "district",
    title: "जिला समाचार",
    icon: Map
  },
  {
    id: "live",
    title: "लाइव टीवी",
    icon: Radio
  },
  {
    id: "epaper",
    title: "ई-पेपर",
    icon: Newspaper
  },
  {
    id: "videos",
    title: "वीडियो",
    icon: Video
  },
  {
    id: "jobs",
    title: "सरकारी नौकरी",
    icon: BriefcaseBusiness
  },
  {
    id: "education",
    title: "शिक्षा",
    icon: GraduationCap
  }
];


/* =====================================================
   UTILITY DATA
===================================================== */

const TODAY = new Intl.DateTimeFormat("hi-IN", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric"
}).format(new Date());


/* =====================================================
   APP START
===================================================== */

function App() {

  const [activeSection, setActiveSection] = useState("home");

  const [selectedNews, setSelectedNews] = useState(null);

  const [searchOpen, setSearchOpen] = useState(false);

  const [searchText, setSearchText] = useState("");

  const [menuOpen, setMenuOpen] = useState(false);

  const [districtOpen, setDistrictOpen] = useState(false);

  const [selectedDistrict, setSelectedDistrict] = useState("जयपुर");

  const [bookmarkedNews, setBookmarkedNews] = useState([]);

  const [showAllDistricts, setShowAllDistricts] =
    useState(false);

  const [toast, setToast] = useState("");

  /*
  ======================================================
    TOAST MESSAGE
  ======================================================
  */

  const showToast = (message) => {
    setToast(message);

    window.setTimeout(() => {
      setToast("");
    }, 2200);
  };


  /*
  ======================================================
    BOOKMARK
  ======================================================
  */

  const toggleBookmark = (id) => {

    setBookmarkedNews((previous) => {

      if (previous.includes(id)) {

        showToast("खबर बुकमार्क से हटा दी गई");

        return previous.filter(
          (item) => item !== id
        );
      }

      showToast("खबर बुकमार्क कर दी गई");

      return [...previous, id];
    });
  };


  /*
  ======================================================
    OPEN NEWS
  ======================================================
  */

  const openNews = (news) => {

    setSelectedNews(news);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };


  /*
  ======================================================
    CLOSE NEWS
  ======================================================
  */

  const closeNews = () => {
    setSelectedNews(null);
  };


  /*
  ======================================================
    NAVIGATION
  ======================================================
  */

  const navigateTo = (section) => {

    setActiveSection(section);

    setMenuOpen(false);

    setDistrictOpen(false);

    setSelectedNews(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };


  /*
  ======================================================
    SEARCH FILTER
  ======================================================
  */

  const filteredNews = NEWS_DATA.filter((news) => {

    if (!searchText.trim()) {
      return true;
    }

    const search = searchText
      .toLowerCase()
      .trim();

    return (
      news.title.toLowerCase().includes(search) ||
      news.category.toLowerCase().includes(search) ||
      news.location.toLowerCase().includes(search)
    );
  });


  /*
  ======================================================
    CURRENT PAGE TITLE
  ======================================================
  */

  const getPageTitle = () => {

    switch (activeSection) {

      case "rajasthan":
        return "राजस्थान";

      case "district":
        return "जिला समाचार";

      case "live":
        return "लाइव टीवी";

      case "epaper":
        return "ई-पेपर";

      case "videos":
        return "वीडियो";

      case "jobs":
        return "सरकारी नौकरी";

      case "education":
        return "शिक्षा";

      default:
        return "ताजा खबरें";
    }
  };


  /*
  ======================================================
    MAIN RETURN
  ======================================================
  */

  return (
    <div className="awaaz-app">

        {/* =====================================================
          TOP HEADER
      ===================================================== */}

      <header className="site-header">

        <div className="header-inner">

          {/* MENU BUTTON */}
          <button
            type="button"
            className="header-icon-button menu-button"
            aria-label="मेन्यू खोलें"
            onClick={() => setMenuOpen(true)}
          >
            <Menu size={23} strokeWidth={2.4} />
          </button>


          {/* BRAND LOGO */}
          <button
            type="button"
            className="brand-area"
            aria-label="आवाज़ राजस्थान होम"
            onClick={() => navigateTo("home")}
          >

            <div className="brand-logo-wrap">

              <div className="brand-logo-placeholder">
                <span className="brand-logo-top">
                  AWAAZ
                </span>

                <span className="brand-logo-main">
                  आवाज़
                </span>

                <span className="brand-logo-bottom">
                  RAJASTHAN
                </span>

              </div>

            </div>

            <div className="brand-text">

              <div className="brand-title">
                आवाज़ राजस्थान
              </div>

              <div className="brand-tagline">
                आपकी आवाज़, आपका राजस्थान
              </div>

            </div>

          </button>


          {/* HEADER ACTIONS */}
          <div className="header-actions">

            {/* SEARCH */}
            <button
              type="button"
              className="header-icon-button"
              aria-label="खोजें"
              onClick={() => setSearchOpen(true)}
            >
              <Search
                size={22}
                strokeWidth={2.4}
              />
            </button>


            {/* NOTIFICATION */}
            <button
              type="button"
              className="header-icon-button notification-button"
              aria-label="नोटिफिकेशन"
              onClick={() =>
                showToast("अभी कोई नया नोटिफिकेशन नहीं है")
              }
            >
              <Bell
                size={21}
                strokeWidth={2.4}
              />

              <span className="notification-dot"></span>

            </button>

          </div>

        </div>


        {/* =================================================
            DESKTOP CATEGORY NAVIGATION
        ================================================= */}

        <nav className="desktop-navigation">

          <div className="desktop-navigation-inner">

            <button
              type="button"
              className={
                activeSection === "home"
                  ? "nav-link active"
                  : "nav-link"
              }
              onClick={() => navigateTo("home")}
            >
              <Home size={17} />
              <span>होम</span>
            </button>


            <button
              type="button"
              className={
                activeSection === "rajasthan"
                  ? "nav-link active"
                  : "nav-link"
              }
              onClick={() => navigateTo("rajasthan")}
            >
              <MapPin size={17} />
              <span>राजस्थान</span>
            </button>


            <button
              type="button"
              className="nav-link"
              onClick={() => setDistrictOpen(true)}
            >
              <Map size={17} />
              <span>जिला समाचार</span>
            </button>


            <button
              type="button"
              className={
                activeSection === "national"
                  ? "nav-link active"
                  : "nav-link"
              }
              onClick={() => navigateTo("national")}
            >
              <Building2 size={17} />
              <span>देश</span>
            </button>


            <button
              type="button"
              className={
                activeSection === "politics"
                  ? "nav-link active"
                  : "nav-link"
              }
              onClick={() => navigateTo("politics")}
            >
              <TrendingUp size={17} />
              <span>राजनीति</span>
            </button>


            <button
              type="button"
              className={
                activeSection === "education"
                  ? "nav-link active"
                  : "nav-link"
              }
              onClick={() => navigateTo("education")}
            >
              <GraduationCap size={17} />
              <span>शिक्षा</span>
            </button>


            <button
              type="button"
              className={
                activeSection === "jobs"
                  ? "nav-link active"
                  : "nav-link"
              }
              onClick={() => navigateTo("jobs")}
            >
              <BriefcaseBusiness size={17} />
              <span>रोजगार</span>
            </button>


            <button
              type="button"
              className={
                activeSection === "sports"
                  ? "nav-link active"
                  : "nav-link"
              }
              onClick={() => navigateTo("sports")}
            >
              <Trophy size={17} />
              <span>खेल</span>
            </button>


            <button
              type="button"
              className={
                activeSection === "live"
                  ? "nav-link active"
                  : "nav-link"
              }
              onClick={() => navigateTo("live")}
            >
              <Radio size={17} />
              <span>लाइव</span>
            </button>


            <button
              type="button"
              className="nav-link more-nav-link"
              onClick={() => setMenuOpen(true)}
            >
              <MoreHorizontal size={18} />
              <span>और</span>
            </button>

          </div>

        </nav>

      </header>


      {/* =====================================================
          BREAKING NEWS TICKER
      ===================================================== */}

      <section className="breaking-news-section">

        <div className="breaking-news-inner">


          {/* BREAKING LABEL */}
          <div className="breaking-label">

            <span className="breaking-pulse"></span>

            <Flame
              size={16}
              fill="currentColor"
            />

            <span>
              ब्रेकिंग न्यूज़
            </span>

          </div>


          {/* NEWS TICKER */}
          <div className="breaking-ticker">

            <div className="breaking-ticker-track">

              {BREAKING_NEWS.map(
                (headline, index) => (

                  <button
                    type="button"
                    className="breaking-item"
                    key={`breaking-${index}`}
                    onClick={() =>
                      openNews(
                        NEWS_DATA[index % NEWS_DATA.length]
                      )
                    }
                  >

                    <span className="breaking-number">
                      {index + 1}
                    </span>

                    <span className="breaking-headline">
                      {headline}
                    </span>

                  </button>

                )
              )}

            </div>

          </div>


          {/* TICKER CONTROLS */}
          <div className="breaking-controls">

            <button
              type="button"
              aria-label="पिछली खबर"
              onClick={() =>
                showToast("पिछली ब्रेकिंग खबर")
              }
            >
              <ChevronLeft size={17} />
            </button>

            <button
              type="button"
              aria-label="अगली खबर"
              onClick={() =>
                showToast("अगली ब्रेकिंग खबर")
              }
            >
              <ChevronRight size={17} />
            </button>

          </div>

        </div>

      </section>


      {/* =====================================================
          DATE + LIVE STATUS STRIP
      ===================================================== */}

      <div className="top-info-strip">

        <div className="top-info-inner">

          <div className="today-date">
            <CalendarDays size={15} />
            <span>{TODAY}</span>
          </div>


          <div className="live-status">

            <span className="live-status-dot"></span>

            <span>
              लाइव अपडेट
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}


/* =====================================================
   EXPORT
===================================================== */

export default App;
