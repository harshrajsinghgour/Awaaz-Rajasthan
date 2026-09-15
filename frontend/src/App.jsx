import React, { useEffect, useMemo, useState } from "react";

import {
  ArrowLeft,
  ArrowRight,
  Bell,
  Bookmark,
  BookmarkCheck,
  Building2,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  CloudSun,
  Eye,
  Facebook,
  FileText,
  Flame,
  Home,
  Instagram,
  Map,
  MapPin,
  Menu,
  MessageCircle,
  MoreHorizontal,
  Newspaper,
  Phone,
  Play,
  Radio,
  Search,
  Send,
  Settings,
  Share2,
  Trophy,
  User,
  Video,
  X,
  Youtube,
  Zap,
  BriefcaseBusiness,
  GraduationCap,
  TrendingUp,
  ShieldAlert,
  Heart,
  Mail,
  ExternalLink,
  RefreshCw,
  Mic,
  Image as ImageIcon
} from "lucide-react";


/* =========================================================
   AWAAZ RAJASTHAN
   PROFESSIONAL NEWS PORTAL
   APP.JSX
   PART 1 / 20

   IMPORTANT:
   Part 1 से Part 20 तक सभी code इसी App.jsx file में
   क्रम से नीचे paste किए जाएंगे।

   DESIGN DIRECTION:
   - Professional Hindi News Portal
   - Red + Navy + White + Gold
   - Mobile First
   - Rajasthan Focused
   - Clean Editorial UI
   ========================================================= */


/* =========================================================
   BRAND CONFIGURATION
   ========================================================= */

const BRAND = {
  name: "आवाज़ राजस्थान",
  englishName: "AWAAZ RAJASTHAN",
  tagline: "आपकी आवाज़, आपका राजस्थान",

  colors: {
    primary: "#c90000",
    primaryDark: "#980000",
    navy: "#07182d",
    navyLight: "#102944",
    gold: "#d5a33a",
    white: "#ffffff",
    background: "#f5f6f8",
    surface: "#ffffff",
    text: "#111827",
    muted: "#667085",
    border: "#e5e7eb",
    success: "#16803c"
  }
};


/* =========================================================
   DEFAULT APP SETTINGS
   ========================================================= */

const APP_SETTINGS = {
  defaultDistrict: "जयपुर",
  defaultCategory: "home",
  newsPerSection: 6,
  mobileBottomNavigation: true,
  showBreakingNews: true,
  showDistrictNews: true,
  showQuickFeatures: true
};


/* =========================================================
   IMAGE FALLBACK
   ========================================================= */

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=85";


/* =========================================================
   PROFESSIONAL NEWS DATA
   ========================================================= */

const NEWS_DATA = [
  {
    id: 1,
    category: "राजस्थान",
    categoryId: "rajasthan",
    title:
      "राजस्थान में मौसम ने बदला मिजाज, कई जिलों में बारिश का अलर्ट",
    description:
      "प्रदेश के कई हिस्सों में मौसम में बदलाव देखने को मिला है। मौसम विभाग के अपडेट के बाद प्रशासन और आम लोगों की नजर मौसम की स्थिति पर बनी हुई है।",
    location: "जयपुर",
    time: "10 मिनट पहले",
    author: "आवाज़ राजस्थान डेस्क",
    image:
      "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=1400&q=85",
    views: "12.4K",
    featured: true,
    breaking: true
  },

  {
    id: 2,
    category: "राजस्थान",
    categoryId: "rajasthan",
    title:
      "जयपुर में ट्रैफिक व्यवस्था को लेकर बड़ा बदलाव, नई व्यवस्था लागू",
    description:
      "जयपुर शहर में यातायात व्यवस्था को बेहतर बनाने के लिए नई व्यवस्था को लेकर महत्वपूर्ण अपडेट सामने आया है।",
    location: "जयपुर",
    time: "25 मिनट पहले",
    author: "जयपुर ब्यूरो",
    image:
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1000&q=85",
    views: "8.7K",
    featured: false,
    breaking: false
  },

  {
    id: 3,
    category: "शिक्षा",
    categoryId: "education",
    title:
      "राजस्थान के विद्यार्थियों के लिए महत्वपूर्ण अपडेट, परीक्षा को लेकर नई सूचना",
    description:
      "विद्यार्थियों और अभिभावकों के लिए परीक्षा तथा शिक्षा व्यवस्था से जुड़ा महत्वपूर्ण अपडेट सामने आया है।",
    location: "राजस्थान",
    time: "42 मिनट पहले",
    author: "एजुकेशन डेस्क",
    image:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=85",
    views: "15.2K",
    featured: false,
    breaking: false
  },

  {
    id: 4,
    category: "राजनीति",
    categoryId: "politics",
    title:
      "राजस्थान की राजनीति में आज का दिन अहम, नेताओं की बैठकों का दौर जारी",
    description:
      "प्रदेश की राजनीति से जुड़े कई महत्वपूर्ण घटनाक्रमों पर आज सभी की नजर बनी हुई है। नेताओं के बीच बैठकों का दौर जारी है।",
    location: "जयपुर",
    time: "1 घंटा पहले",
    author: "राजनीति डेस्क",
    image:
      "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1000&q=85",
    views: "10.8K",
    featured: false,
    breaking: false
  },

  {
    id: 5,
    category: "रोजगार",
    categoryId: "jobs",
    title:
      "सरकारी नौकरी की तैयारी कर रहे युवाओं के लिए नई भर्तियों को लेकर अपडेट",
    description:
      "सरकारी नौकरी की तैयारी कर रहे उम्मीदवारों के लिए भर्ती और परीक्षा से जुड़े नए अपडेट सामने आए हैं।",
    location: "राजस्थान",
    time: "1 घंटा पहले",
    author: "रोजगार डेस्क",
    image:
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1000&q=85",
    views: "18.1K",
    featured: false,
    breaking: false
  },

  {
    id: 6,
    category: "अपराध",
    categoryId: "crime",
    title:
      "पुलिस की बड़ी कार्रवाई, मामले में कई महत्वपूर्ण सुराग सामने आए",
    description:
      "पुलिस की कार्रवाई के बाद मामले की जांच को लेकर कई महत्वपूर्ण जानकारी सामने आई है।",
    location: "भीलवाड़ा",
    time: "2 घंटे पहले",
    author: "क्राइम रिपोर्टर",
    image:
      "https://images.unsplash.com/photo-1453873531674-2151bcd01707?auto=format&fit=crop&w=1000&q=85",
    views: "7.4K",
    featured: false,
    breaking: false
  },

  {
    id: 7,
    category: "खेल",
    categoryId: "sports",
    title:
      "राजस्थान के खिलाड़ियों का शानदार प्रदर्शन, प्रतियोगिता में जीते कई पदक",
    description:
      "राजस्थान के खिलाड़ियों ने प्रतियोगिता में शानदार प्रदर्शन करते हुए प्रदेश का नाम रोशन किया।",
    location: "उदयपुर",
    time: "2 घंटे पहले",
    author: "स्पोर्ट्स डेस्क",
    image:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1000&q=85",
    views: "6.9K",
    featured: false,
    breaking: false
  },

  {
    id: 8,
    category: "देश",
    categoryId: "national",
    title:
      "देशभर में आज की प्रमुख खबरें, जानिए दिनभर के बड़े अपडेट",
    description:
      "देशभर में दिनभर के प्रमुख घटनाक्रम और महत्वपूर्ण अपडेट लगातार सामने आ रहे हैं।",
    location: "नई दिल्ली",
    time: "3 घंटे पहले",
    author: "नेशनल डेस्क",
    image:
      "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1000&q=85",
    views: "21.3K",
    featured: false,
    breaking: false
  },

  {
    id: 9,
    category: "बिजनेस",
    categoryId: "business",
    title:
      "बाजार में आज उतार-चढ़ाव, निवेशकों की नजर महत्वपूर्ण आंकड़ों पर",
    description:
      "बाजार की गतिविधियों और महत्वपूर्ण आर्थिक संकेतकों पर निवेशकों की नजर बनी हुई है।",
    location: "मुंबई",
    time: "3 घंटे पहले",
    author: "बिजनेस डेस्क",
    image:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1000&q=85",
    views: "9.8K",
    featured: false,
    breaking: false
  },

  {
    id: 10,
    category: "लाइफस्टाइल",
    categoryId: "lifestyle",
    title:
      "बदलती लाइफस्टाइल में सेहत का रखें ध्यान, विशेषज्ञों ने बताए जरूरी उपाय",
    description:
      "व्यस्त जीवनशैली के बीच स्वास्थ्य का ध्यान रखने के लिए विशेषज्ञों ने कई महत्वपूर्ण सुझाव साझा किए हैं।",
    location: "जयपुर",
    time: "4 घंटे पहले",
    author: "लाइफस्टाइल डेस्क",
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1000&q=85",
    views: "5.6K",
    featured: false,
    breaking: false
  },

  {
    id: 11,
    category: "राजस्थान",
    categoryId: "rajasthan",
    title:
      "प्रदेश के कई शहरों में विकास कार्यों को लेकर नई जानकारी सामने आई",
    description:
      "राजस्थान के विभिन्न शहरों में चल रहे विकास कार्यों को लेकर प्रशासन की ओर से नई जानकारी सामने आई है।",
    location: "अजमेर",
    time: "4 घंटे पहले",
    author: "राजस्थान ब्यूरो",
    image:
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1000&q=85",
    views: "5.1K",
    featured: false,
    breaking: false
  },

  {
    id: 12,
    category: "राजस्थान",
    categoryId: "rajasthan",
    title:
      "भीलवाड़ा और आसपास के क्षेत्रों से सामने आईं दिनभर की प्रमुख खबरें",
    description:
      "भीलवाड़ा सहित आसपास के क्षेत्रों से दिनभर के महत्वपूर्ण स्थानीय अपडेट सामने आए हैं।",
    location: "भीलवाड़ा",
    time: "5 घंटे पहले",
    author: "भीलवाड़ा संवाददाता",
    image:
      "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1000&q=85",
    views: "11.2K",
    featured: false,
    breaking: false
  }
];


/* =========================================================
   BREAKING NEWS
   ========================================================= */

const BREAKING_NEWS = [
  {
    id: 101,
    text: "राजस्थान में मौसम ने बदला मिजाज, कई जिलों में बारिश का अलर्ट"
  },
  {
    id: 102,
    text: "सरकारी नौकरी की तैयारी कर रहे युवाओं के लिए महत्वपूर्ण अपडेट"
  },
  {
    id: 103,
    text: "जयपुर में ट्रैफिक व्यवस्था को लेकर बड़ा बदलाव"
  },
  {
    id: 104,
    text: "राजस्थान के विद्यार्थियों के लिए परीक्षा से जुड़ी नई सूचना"
  },
  {
    id: 105,
    text: "प्रदेश में आज की बड़ी राजनीतिक बैठक पर सभी की नजर"
  }
];


/* =========================================================
   RAJASTHAN DISTRICTS
   ========================================================= */

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


/* =========================================================
   CATEGORY DATA
   ========================================================= */

const CATEGORIES = [
  {
    id: "rajasthan",
    title: "राजस्थान",
    icon: MapPin
  },
  {
    id: "national",
    title: "देश",
    icon: Building2
  },
  {
    id: "politics",
    title: "राजनीति",
    icon: TrendingUp
  },
  {
    id: "crime",
    title: "अपराध",
    icon: ShieldAlert
  },
  {
    id: "education",
    title: "शिक्षा",
    icon: GraduationCap
  },
  {
    id: "jobs",
    title: "रोजगार",
    icon: BriefcaseBusiness
  },
  {
    id: "sports",
    title: "खेल",
    icon: Trophy
  },
  {
    id: "business",
    title: "बिजनेस",
    icon: TrendingUp
  },
  {
    id: "weather",
    title: "मौसम",
    icon: CloudSun
  },
  {
    id: "lifestyle",
    title: "लाइफस्टाइल",
    icon: Heart
  }
];


/* =========================================================
   QUICK FEATURES
   ========================================================= */

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
    id: "videos",
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


/* =========================================================
   MAIN NAVIGATION
   ========================================================= */

const MAIN_NAVIGATION = [
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
    title: "जिला",
    icon: Map
  },
  {
    id: "live",
    title: "लाइव",
    icon: Radio
  },
  {
    id: "more",
    title: "और",
    icon: MoreHorizontal
  }
];


/* =========================================================
   MENU ITEMS
   ========================================================= */

const MENU_ITEMS = [
  {
    id: "home",
    title: "होम",
    subtitle: "मुख्य पेज",
    icon: Home
  },
  {
    id: "rajasthan",
    title: "राजस्थान",
    subtitle: "प्रदेश की खबरें",
    icon: MapPin
  },
  {
    id: "district",
    title: "जिला समाचार",
    subtitle: "अपने जिले की खबरें",
    icon: Map
  },
  {
    id: "national",
    title: "देश",
    subtitle: "देश की बड़ी खबरें",
    icon: Building2
  },
  {
    id: "politics",
    title: "राजनीति",
    subtitle: "राजनीतिक खबरें",
    icon: TrendingUp
  },
  {
    id: "crime",
    title: "अपराध",
    subtitle: "क्राइम न्यूज़",
    icon: ShieldAlert
  },
  {
    id: "education",
    title: "शिक्षा",
    subtitle: "एजुकेशन अपडेट",
    icon: GraduationCap
  },
  {
    id: "jobs",
    title: "रोजगार",
    subtitle: "सरकारी नौकरी व भर्ती",
    icon: BriefcaseBusiness
  },
  {
    id: "sports",
    title: "खेल",
    subtitle: "स्पोर्ट्स न्यूज़",
    icon: Trophy
  },
  {
    id: "business",
    title: "बिजनेस",
    subtitle: "बाजार और व्यापार",
    icon: TrendingUp
  },
  {
    id: "videos",
    title: "वीडियो",
    subtitle: "न्यूज़ वीडियो",
    icon: Video
  },
  {
    id: "live",
    title: "लाइव टीवी",
    subtitle: "लाइव अपडेट",
    icon: Radio
  },
  {
    id: "epaper",
    title: "ई-पेपर",
    subtitle: "आज का डिजिटल अखबार",
    icon: Newspaper
  }
];


/* =========================================================
   HELPER: CURRENT DATE
   ========================================================= */

const getTodayDate = () => {
  return new Intl.DateTimeFormat("hi-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(new Date());
};


/* =========================================================
   HELPER: SAFE IMAGE
   ========================================================= */

const handleImageError = (event) => {
  if (
    event.currentTarget.src !==
    FALLBACK_IMAGE
  ) {
    event.currentTarget.src =
      FALLBACK_IMAGE;
  }
};


/* =========================================================
   APP COMPONENT
   ========================================================= */

function App() {

  /* =======================================================
     MAIN NAVIGATION STATE
     ======================================================= */

  const [
    activeSection,
    setActiveSection
  ] = useState(
    APP_SETTINGS.defaultCategory
  );


  /* =======================================================
     SELECTED ARTICLE
     ======================================================= */

  const [
    selectedNews,
    setSelectedNews
  ] = useState(null);


  /* =======================================================
     MENU STATE
     ======================================================= */

  const [
    menuOpen,
    setMenuOpen
  ] = useState(false);


  /* =======================================================
     SEARCH STATE
     ======================================================= */

  const [
    searchOpen,
    setSearchOpen
  ] = useState(false);

  const [
    searchText,
    setSearchText
  ] = useState("");


  /* =======================================================
     DISTRICT STATE
     ======================================================= */

  const [
    selectedDistrict,
    setSelectedDistrict
  ] = useState(
    APP_SETTINGS.defaultDistrict
  );

  const [
    districtModalOpen,
    setDistrictModalOpen
  ] = useState(false);


  /* =======================================================
     BOOKMARK STATE
     ======================================================= */

  const [
    bookmarkedNews,
    setBookmarkedNews
  ] = useState([]);


  /* =======================================================
     TOAST STATE
     ======================================================= */

  const [
    toast,
    setToast
  ] = useState("");


  /* =======================================================
     DARK MODE STATE
     ======================================================= */

  const [
    darkMode,
    setDarkMode
  ] = useState(false);


  /* =======================================================
     MOBILE SEARCH
     ======================================================= */

  const [
    searchFocused,
    setSearchFocused
  ] = useState(false);


  /* =======================================================
     TOAST FUNCTION
     ======================================================= */

  const showToast = (message) => {

    setToast(message);

    window.clearTimeout(
      window.__awaazToastTimer
    );

    window.__awaazToastTimer =
      window.setTimeout(() => {
        setToast("");
      }, 2400);
  };


  /* =======================================================
     NAVIGATION FUNCTION
     ======================================================= */

  const navigateTo = (section) => {

    setActiveSection(section);

    setSelectedNews(null);

    setMenuOpen(false);

    setSearchOpen(false);

    setDistrictModalOpen(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };


  /* =======================================================
     OPEN ARTICLE
     ======================================================= */

  const openNews = (news) => {

    setSelectedNews(news);

    setMenuOpen(false);

    setSearchOpen(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };


  /* =======================================================
     CLOSE ARTICLE
     ======================================================= */

  const closeNews = () => {

    setSelectedNews(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };


  /* =======================================================
     BOOKMARK TOGGLE
     ======================================================= */

  const toggleBookmark = (newsId) => {

    setBookmarkedNews((previous) => {

      const exists =
        previous.includes(newsId);

      if (exists) {

        showToast(
          "खबर बुकमार्क से हटा दी गई"
        );

        return previous.filter(
          (id) => id !== newsId
        );
      }

      showToast(
        "खबर बुकमार्क कर दी गई"
      );

      return [
        ...previous,
        newsId
      ];
    });
  };


  /* =======================================================
     SHARE ARTICLE
     ======================================================= */

  const shareNews = async (news) => {

    const shareData = {
      title:
        news.title,
      text:
        `${news.title} — आवाज़ राजस्थान`,
      url:
        window.location.href
    };

    try {

      if (
        navigator.share
      ) {

        await navigator.share(
          shareData
        );

        return;
      }

      if (
        navigator.clipboard
      ) {

        await navigator.clipboard.writeText(
          window.location.href
        );

        showToast(
          "लिंक कॉपी हो गया"
        );

        return;
      }

      showToast(
        "शेयर विकल्प उपलब्ध नहीं है"
      );

    } catch (error) {

      if (
        error?.name !==
        "AbortError"
      ) {

        showToast(
          "शेयर नहीं किया जा सका"
        );
      }
    }
  };


  /* =======================================================
     SEARCH FILTER
     ======================================================= */

  const searchedNews = useMemo(() => {

    const query =
      searchText
        .trim()
        .toLowerCase();

    if (!query) {
      return NEWS_DATA;
    }

    return NEWS_DATA.filter(
      (news) => {

        return (
          news.title
            .toLowerCase()
            .includes(query) ||

          news.description
            .toLowerCase()
            .includes(query) ||

          news.category
            .toLowerCase()
            .includes(query) ||

          news.location
            .toLowerCase()
            .includes(query)
        );
      }
    );

  }, [searchText]);


  /* =======================================================
     CATEGORY FILTER
     ======================================================= */

  const categoryNews = useMemo(() => {

    if (
      activeSection ===
      "home"
    ) {

      return NEWS_DATA;
    }

    if (
      activeSection ===
      "district"
    ) {

      return NEWS_DATA.filter(
        (news) =>
          news.location ===
            selectedDistrict ||
          news.categoryId ===
            "rajasthan"
      );
    }

    return NEWS_DATA.filter(
      (news) =>
        news.categoryId ===
        activeSection
    );

  }, [
    activeSection,
    selectedDistrict
  ]);


  /* =======================================================
     LATEST NEWS
     ======================================================= */

  const latestNews =
    NEWS_DATA.slice(1, 8);


  /* =======================================================
     POPULAR NEWS
     ======================================================= */

  const popularNews =
    NEWS_DATA
      .slice()
      .sort(
        (a, b) =>
          parseFloat(
            b.views
          ) -
          parseFloat(
            a.views
          )
      )
      .slice(0, 6);


  /* =======================================================
     PAGE TITLE
     ======================================================= */

  const pageTitle = useMemo(() => {

    if (
      activeSection ===
      "home"
    ) {
      return "आज की बड़ी खबरें";
    }

    if (
      activeSection ===
      "district"
    ) {
      return "जिला समाचार";
    }

    const found =
      MENU_ITEMS.find(
        (item) =>
          item.id ===
          activeSection
      );

    return found
      ? found.title
      : "समाचार";

  }, [activeSection]);


  /* =======================================================
     BODY DARK MODE CLASS
     ======================================================= */

  useEffect(() => {

    document.body.classList.toggle(
      "awaaz-dark-mode",
      darkMode
    );

    return () => {

      document.body.classList.remove(
        "awaaz-dark-mode"
      );

    };

  }, [darkMode]);


  /* =======================================================
     KEYBOARD ESCAPE
     ======================================================= */

  useEffect(() => {

    const handleKeyDown =
      (event) => {

        if (
          event.key !==
          "Escape"
        ) {
          return;
        }

        setMenuOpen(false);

        setSearchOpen(false);

        setDistrictModalOpen(
          false
        );

        setSelectedNews(
          null
        );
      };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );

    };

  }, []);


  /* =======================================================
     PART 1 END
     =======================================================

     PART 2 यहाँ से इसी App.jsx में जारी होगा.

     IMPORTANT:
     इस file का closing return अभी नहीं दिया गया है।
     Part 2 को सीधे नीचे paste करना है।
     ======================================================= */
  /* =======================================================
     HEADER CONFIGURATION
     ======================================================= */

  const headerNavigation = [
    {
      id: "home",
      label: "होम",
      icon: Home
    },
    {
      id: "rajasthan",
      label: "राजस्थान",
      icon: MapPin
    },
    {
      id: "district",
      label: "जिला समाचार",
      icon: Map
    },
    {
      id: "national",
      label: "देश",
      icon: Building2
    },
    {
      id: "politics",
      label: "राजनीति",
      icon: TrendingUp
    },
    {
      id: "education",
      label: "शिक्षा",
      icon: GraduationCap
    },
    {
      id: "jobs",
      label: "रोजगार",
      icon: BriefcaseBusiness
    },
    {
      id: "sports",
      label: "खेल",
      icon: Trophy
    },
    {
      id: "live",
      label: "लाइव टीवी",
      icon: Radio
    }
  ];


  /* =======================================================
     HEADER
     ======================================================= */

  return (
    <div
      className={
        darkMode
          ? "awaaz-app awaaz-app-dark"
          : "awaaz-app"
      }
    >


      {/* ===================================================
          DESKTOP / MAIN HEADER
          =================================================== */}

      <header className="site-header">

        <div className="site-header-main">

          <div className="header-container">


            {/* =============================================
                LEFT MENU BUTTON
                ============================================= */}

            <button
              type="button"
              className="header-menu-button"
              aria-label="मेन्यू खोलें"
              onClick={() =>
                setMenuOpen(true)
              }
            >

              <Menu
                size={23}
                strokeWidth={2.4}
              />

            </button>


            {/* =============================================
                BRAND
                ============================================= */}

            <button
              type="button"
              className="brand-block"
              onClick={() =>
                navigateTo("home")
              }
              aria-label="आवाज़ राजस्थान होम"
            >

              <div className="brand-logo">

                {/*

                  बाद में यहाँ public/logo.png
                  का official Awaaz Rajasthan logo
                  लगाया जाएगा।

                  अभी temporary text logo रखा गया है
                  ताकि frontend बिना image के भी render हो।

                */}

                <div className="brand-logo-inner">

                  <span className="brand-logo-small">
                    AWAAZ
                  </span>

                  <span className="brand-logo-hindi">
                    आवाज़
                  </span>

                  <span className="brand-logo-small">
                    RAJASTHAN
                  </span>

                </div>

              </div>


              <div className="brand-copy">

                <strong>
                  आवाज़ राजस्थान
                </strong>

                <span>
                  आपकी आवाज़, आपका राजस्थान
                </span>

              </div>

            </button>


            {/* =============================================
                DESKTOP SEARCH
                ============================================= */}

            <div
              className={
                searchFocused
                  ? "header-search active"
                  : "header-search"
              }
            >

              <Search
                size={19}
                strokeWidth={2.2}
              />

              <input
                type="search"
                value={searchText}
                placeholder="खबर खोजें..."
                aria-label="खबर खोजें"
                onFocus={() =>
                  setSearchFocused(true)
                }
                onBlur={() =>
                  setSearchFocused(false)
                }
                onChange={(event) => {

                  setSearchText(
                    event.target.value
                  );

                }}
                onKeyDown={(event) => {

                  if (
                    event.key ===
                    "Enter"
                  ) {

                    setSearchOpen(true);

                  }

                }}
              />


              {searchText && (

                <button
                  type="button"
                  className="search-clear-button"
                  aria-label="खोज साफ करें"
                  onMouseDown={(event) =>
                    event.preventDefault()
                  }
                  onClick={() =>
                    setSearchText("")
                  }
                >

                  <X size={15} />

                </button>

              )}


              <button
                type="button"
                className="voice-search-button"
                aria-label="वॉइस सर्च"
                onClick={() => {

                  showToast(
                    "वॉइस सर्च जल्द उपलब्ध होगा"
                  );

                }}
              >

                <Mic size={17} />

              </button>

            </div>


            {/* =============================================
                HEADER ACTIONS
                ============================================= */}

            <div className="header-actions">


              {/* DATE */}
              <div className="header-date">

                <CalendarDays
                  size={15}
                />

                <span>
                  {getTodayDate()}
                </span>

              </div>


              {/* NOTIFICATION */}
              <button
                type="button"
                className="header-action-button notification-button"
                aria-label="नोटिफिकेशन"
                onClick={() =>
                  showToast(
                    "अभी कोई नया नोटिफिकेशन नहीं है"
                  )
                }
              >

                <Bell size={20} />

                <span className="notification-indicator"></span>

              </button>


              {/* DARK MODE */}
              <button
                type="button"
                className="header-action-button"
                aria-label={
                  darkMode
                    ? "लाइट मोड"
                    : "डार्क मोड"
                }
                onClick={() =>
                  setDarkMode(
                    (previous) =>
                      !previous
                  )
                }
              >

                <CloudSun
                  size={20}
                />

              </button>


              {/* MOBILE SEARCH */}
              <button
                type="button"
                className="header-action-button mobile-search-button"
                aria-label="खोजें"
                onClick={() =>
                  setSearchOpen(true)
                }
              >

                <Search size={20} />

              </button>

            </div>

          </div>

        </div>


        {/* =================================================
            DESKTOP NAVIGATION
            ================================================= */}

        <nav
          className="desktop-main-navigation"
          aria-label="मुख्य नेविगेशन"
        >

          <div className="navigation-container">


            {/* HOME */}
            {headerNavigation.map(
              (item) => {

                const NavigationIcon =
                  item.icon;

                const isActive =
                  activeSection ===
                  item.id;

                return (

                  <button
                    type="button"
                    key={item.id}
                    className={
                      isActive
                        ? "desktop-nav-item active"
                        : "desktop-nav-item"
                    }
                    onClick={() =>
                      navigateTo(
                        item.id
                      )
                    }
                  >

                    <NavigationIcon
                      size={17}
                      strokeWidth={
                        isActive
                          ? 2.5
                          : 2
                      }
                    />

                    <span>
                      {item.label}
                    </span>

                  </button>

                );

              }
            )}


            {/* MORE */}
            <button
              type="button"
              className="desktop-nav-item more-nav-item"
              onClick={() =>
                setMenuOpen(true)
              }
            >

              <MoreHorizontal
                size={19}
              />

              <span>
                और
              </span>

            </button>

          </div>

        </nav>

      </header>


      {/* ===================================================
          MOBILE TOP BRAND BAR
          =================================================== */}

      <div className="mobile-brand-bar">

        <button
          type="button"
          className="mobile-menu-button"
          aria-label="मेन्यू"
          onClick={() =>
            setMenuOpen(true)
          }
        >

          <Menu
            size={23}
          />

        </button>


        <button
          type="button"
          className="mobile-brand"
          onClick={() =>
            navigateTo("home")
          }
        >

          <div className="mobile-brand-logo">

            <span>
              AWAAZ
            </span>

            <strong>
              आवाज़
            </strong>

            <span>
              RAJASTHAN
            </span>

          </div>


          <div className="mobile-brand-name">

            <strong>
              आवाज़ राजस्थान
            </strong>

            <span>
              आपकी आवाज़, आपका राजस्थान
            </span>

          </div>

        </button>


        <div className="mobile-header-actions">

          <button
            type="button"
            aria-label="खोजें"
            onClick={() =>
              setSearchOpen(true)
            }
          >

            <Search
              size={21}
            />

          </button>


          <button
            type="button"
            aria-label="नोटिफिकेशन"
            onClick={() =>
              showToast(
                "अभी कोई नया नोटिफिकेशन नहीं है"
              )
            }
          >

            <Bell
              size={21}
            />

            <span></span>

          </button>

        </div>

      </div>


      {/* ===================================================
          MOBILE DATE STRIP
          =================================================== */}

      <div className="mobile-date-strip">

        <div>

          <CalendarDays
            size={14}
          />

          <span>
            {getTodayDate()}
          </span>

        </div>


        <div className="mobile-live-status">

          <span></span>

          <strong>
            LIVE
          </strong>

        </div>

      </div>
            {/* ===================================================
          BREAKING NEWS TICKER
          =================================================== */}

      {APP_SETTINGS.showBreakingNews && (

        <section
          className="breaking-news-wrapper"
          aria-label="ब्रेकिंग न्यूज़"
        >

          <div className="breaking-news-container">


            {/* =============================================
                BREAKING LABEL
                ============================================= */}

            <div className="breaking-news-label">

              <span className="breaking-live-dot"></span>

              <Flame
                size={16}
                strokeWidth={2.5}
              />

              <strong>
                ब्रेकिंग न्यूज़
              </strong>

            </div>


            {/* =============================================
                BREAKING NEWS CONTENT
                ============================================= */}

            <div className="breaking-news-content">

              <div className="breaking-news-track">

                {BREAKING_NEWS.map(
                  (breaking, index) => (

                    <button
                      type="button"
                      className="breaking-news-item"
                      key={breaking.id}
                      onClick={() => {

                        const news =
                          NEWS_DATA[
                            index %
                            NEWS_DATA.length
                          ];

                        openNews(news);

                      }}
                    >

                      <span className="breaking-news-bullet">
                        •
                      </span>

                      <span>
                        {breaking.text}
                      </span>

                    </button>

                  )
                )}

              </div>

            </div>


            {/* =============================================
                BREAKING CONTROLS
                ============================================= */}

            <div className="breaking-news-controls">

              <button
                type="button"
                aria-label="पिछली ब्रेकिंग खबर"
                onClick={() =>
                  showToast(
                    "पिछली खबर"
                  )
                }
              >

                <ChevronLeft
                  size={17}
                />

              </button>


              <button
                type="button"
                aria-label="अगली ब्रेकिंग खबर"
                onClick={() =>
                  showToast(
                    "अगली खबर"
                  )
                }
              >

                <ChevronRight
                  size={17}
                />

              </button>

            </div>

          </div>

        </section>

      )}


      {/* ===================================================
          MOBILE BREAKING NEWS
          =================================================== */}

      <div className="mobile-breaking-bar">

        <div className="mobile-breaking-label">

          <span className="breaking-live-dot"></span>

          <strong>
            BREAKING
          </strong>

        </div>


        <div className="mobile-breaking-content">

          <button
            type="button"
            onClick={() =>
              openNews(
                NEWS_DATA[0]
              )
            }
          >

            {NEWS_DATA[0].title}

          </button>

        </div>


        <button
          type="button"
          className="mobile-breaking-arrow"
          aria-label="ब्रेकिंग खबर खोलें"
          onClick={() =>
            openNews(
              NEWS_DATA[0]
            )
          }
        >

          <ChevronRight
            size={18}
          />

        </button>

      </div>


      {/* ===================================================
          LIVE INFORMATION STRIP
          =================================================== */}

      <section className="live-information-strip">

        <div className="live-information-container">


          {/* LIVE STATUS */}

          <div className="live-information-status">

            <span className="live-dot"></span>

            <strong>
              लाइव अपडेट
            </strong>

            <span className="live-status-text">
              खबरें लगातार अपडेट हो रही हैं
            </span>

          </div>


          {/* DATE */}

          <div className="live-information-date">

            <CalendarDays
              size={15}
            />

            <span>
              {getTodayDate()}
            </span>

          </div>


          {/* LOCATION */}

          <button
            type="button"
            className="live-information-location"
            onClick={() =>
              setDistrictModalOpen(true)
            }
          >

            <MapPin
              size={15}
            />

            <span>
              {selectedDistrict}
            </span>

            <ChevronDown
              size={14}
            />

          </button>

        </div>

      </section>


      {/* ===================================================
          MAIN PAGE CONTAINER
          =================================================== */}

      <main className="main-page-container">


        {/* =================================================
            PAGE BREADCRUMB
            ================================================= */}

        {!selectedNews && (

          <div className="page-breadcrumb">

            <button
              type="button"
              onClick={() =>
                navigateTo("home")
              }
            >

              <Home
                size={14}
              />

              <span>
                होम
              </span>

            </button>


            {activeSection !== "home" && (

              <>

                <ChevronRight
                  size={13}
                />

                <span>
                  {pageTitle}
                </span>

              </>

            )}

          </div>

        )}


        {/* =================================================
            MOBILE PAGE TITLE
            ================================================= */}

        {!selectedNews &&
          activeSection !== "home" && (

            <div className="mobile-page-heading">

              <div>

                <span className="mobile-page-heading-line"></span>

                <h1>
                  {pageTitle}
                </h1>

              </div>


              {activeSection ===
                "district" && (

                <button
                  type="button"
                  onClick={() =>
                    setDistrictModalOpen(
                      true
                    )
                  }
                >

                  <MapPin
                    size={15}
                  />

                  <span>
                    {selectedDistrict}
                  </span>

                  <ChevronDown
                    size={14}
                  />

                </button>

              )}

            </div>

          )}


        {/* =================================================
            SEARCH RESULT HEADER
            ================================================= */}

        {searchText.trim() &&
          !selectedNews && (

            <section className="search-result-preview">

              <div className="search-result-heading">

                <div>

                  <span>
                    खोज परिणाम
                  </span>

                  <h2>
                    “{searchText}”
                  </h2>

                </div>


                <button
                  type="button"
                  onClick={() =>
                    setSearchText("")
                  }
                >

                  <X
                    size={17}
                  />

                  <span>
                    साफ करें
                  </span>

                </button>

              </div>


              <div className="search-result-count">

                <Search
                  size={14}
                />

                <span>
                  {searchedNews.length} खबरें मिलीं
                </span>

              </div>

            </section>

          )}
              {/* ===================================================
          HERO NEWS SECTION
          =================================================== */}

      {!selectedNews &&
        activeSection === "home" && (
          <section className="hero-news-section">

            {/* =============================================
                HERO SECTION TOP LABEL
                ============================================= */}

            <div className="hero-section-top">

              <div className="section-heading-left">

                <span className="section-heading-line"></span>

                <div>

                  <div className="hero-heading-title-row">

                    <h1 className="hero-section-title">
                      आज की सबसे बड़ी खबर
                    </h1>

                    <span className="hero-heading-live">
                      <span></span>
                      ताज़ा
                    </span>

                  </div>

                  <p className="section-subtitle">
                    आवाज़ राजस्थान की नजर से प्रदेश और देश की महत्वपूर्ण खबरें
                  </p>

                </div>

              </div>


              <button
                type="button"
                className="hero-view-all-button"
                onClick={() =>
                  navigateTo("rajasthan")
                }
              >

                <span>
                  सभी खबरें
                </span>

                <ArrowRight
                  size={16}
                />

              </button>

            </div>


            {/* =============================================
                HERO GRID
                ============================================= */}

            <div className="hero-news-grid">


              {/* =========================================
                  MAIN HERO ARTICLE
                  ========================================= */}

              {NEWS_DATA
                .filter(
                  (news) =>
                    news.featured
                )
                .slice(0, 1)
                .map((news) => (

                  <article
                    className="hero-main-card"
                    key={`hero-main-${news.id}`}
                    onClick={() =>
                      openNews(news)
                    }
                  >

                    {/* IMAGE */}

                    <div className="hero-main-image">

                      <img
                        src={news.image}
                        alt={news.title}
                        onError={
                          handleImageError
                        }
                      />


                      {/* IMAGE OVERLAY */}

                      <div className="hero-image-overlay"></div>


                      {/* BREAKING LABEL */}

                      {news.breaking && (

                        <span className="hero-breaking-label">

                          <span></span>

                          BREAKING

                        </span>

                      )}


                      {/* CATEGORY */}

                      <span className="hero-image-category">

                        {news.category}

                      </span>


                      {/* IMAGE CONTENT */}

                      <div className="hero-image-content">

                        <div className="hero-image-meta">

                          <span>

                            <MapPin
                              size={13}
                            />

                            {news.location}

                          </span>


                          <span>

                            <Clock3
                              size={13}
                            />

                            {news.time}

                          </span>

                        </div>


                        <h2>
                          {news.title}
                        </h2>


                        <p>
                          {news.description}
                        </p>


                        <div className="hero-image-footer">

                          <span className="hero-author">

                            <span className="author-avatar">
                              AR
                            </span>

                            {news.author}

                          </span>


                          <span className="hero-read-button">

                            पढ़ें

                            <ArrowRight
                              size={15}
                            />

                          </span>

                        </div>

                      </div>

                    </div>


                    {/* HERO CARD BOTTOM */}

                    <div className="hero-main-bottom">

                      <div className="hero-bottom-stat">

                        <Eye
                          size={14}
                        />

                        <span>
                          {news.views} views
                        </span>

                      </div>


                      <button
                        type="button"
                        className={
                          bookmarkedNews.includes(
                            news.id
                          )
                            ? "hero-action active"
                            : "hero-action"
                        }
                        aria-label="बुकमार्क"
                        onClick={(event) => {

                          event.stopPropagation();

                          toggleBookmark(
                            news.id
                          );

                        }}
                      >

                        {bookmarkedNews.includes(
                          news.id
                        ) ? (

                          <BookmarkCheck
                            size={17}
                          />

                        ) : (

                          <Bookmark
                            size={17}
                          />

                        )}

                      </button>


                      <button
                        type="button"
                        className="hero-action"
                        aria-label="शेयर"
                        onClick={(event) => {

                          event.stopPropagation();

                          shareNews(news);

                        }}
                      >

                        <Share2
                          size={17}
                        />

                      </button>

                    </div>

                  </article>

                ))}


              {/* =========================================
                  SIDE HEADLINES
                  ========================================= */}

              <div className="hero-side-news">


                {/* SIDE NEWS HEADER */}

                <div className="hero-side-header">

                  <div>

                    <span className="side-header-kicker">
                      TOP STORIES
                    </span>

                    <h2>
                      अभी की बड़ी खबरें
                    </h2>

                  </div>


                  <span className="side-story-count">
                    {NEWS_DATA.length}
                  </span>

                </div>


                {/* SIDE NEWS LIST */}

                <div className="hero-side-list">

                  {NEWS_DATA
                    .filter(
                      (news) =>
                        !news.featured
                    )
                    .slice(0, 5)
                    .map(
                      (
                        news,
                        index
                      ) => (

                        <article
                          className="hero-side-card"
                          key={`hero-side-${news.id}`}
                          onClick={() =>
                            openNews(
                              news
                            )
                          }
                        >

                          {/* NUMBER */}

                          <div className="hero-side-number">

                            {String(
                              index + 1
                            ).padStart(
                              2,
                              "0"
                            )}

                          </div>


                          {/* THUMBNAIL */}

                          <div className="hero-side-image">

                            <img
                              src={
                                news.image
                              }
                              alt={
                                news.title
                              }
                              loading="lazy"
                              onError={
                                handleImageError
                              }
                            />

                          </div>


                          {/* CONTENT */}

                          <div className="hero-side-content">

                            <div className="hero-side-meta">

                              <span>
                                {
                                  news.category
                                }
                              </span>

                              <span>
                                •
                              </span>

                              <span>
                                {
                                  news.time
                                }
                              </span>

                            </div>


                            <h3>
                              {
                                news.title
                              }
                            </h3>


                            <div className="hero-side-footer">

                              <span>

                                <MapPin
                                  size={11}
                                />

                                {
                                  news.location
                                }

                              </span>


                              <span className="hero-side-arrow">

                                <ArrowRight
                                  size={14}
                                />

                              </span>

                            </div>

                          </div>

                        </article>

                      )
                    )}

                </div>


                {/* SIDE FOOTER */}

                <button
                  type="button"
                  className="hero-side-all-button"
                  onClick={() =>
                    navigateTo(
                      "rajasthan"
                    )
                  }
                >

                  <span>
                    सभी टॉप स्टोरी देखें
                  </span>

                  <ArrowRight
                    size={16}
                  />

                </button>

              </div>

            </div>


            {/* =============================================
                HERO QUICK STATS
                ============================================= */}

            <div className="hero-stats-bar">


              <div className="hero-stat-item">

                <div className="hero-stat-icon">
                  <Zap
                    size={18}
                  />
                </div>

                <div>

                  <strong>
                    ताज़ा अपडेट
                  </strong>

                  <span>
                    हर कुछ मिनट में नई खबरें
                  </span>

                </div>

              </div>


              <div className="hero-stat-divider"></div>


              <div className="hero-stat-item">

                <div className="hero-stat-icon">
                  <MapPin
                    size={18}
                  />
                </div>

                <div>

                  <strong>
                    राजस्थान पर फोकस
                  </strong>

                  <span>
                    33 जिलों से खबरें
                  </span>

                </div>

              </div>


              <div className="hero-stat-divider"></div>


              <div className="hero-stat-item">

                <div className="hero-stat-icon">
                  <Radio
                    size={18}
                  />
                </div>

                <div>

                  <strong>
                    लाइव कवरेज
                  </strong>

                  <span>
                    महत्वपूर्ण घटनाओं पर नजर
                  </span>

                </div>

              </div>


              <div className="hero-stat-divider"></div>


              <div className="hero-stat-item">

                <div className="hero-stat-icon">
                  <ShieldAlert
                    size={18}
                  />
                </div>

                <div>

                  <strong>
                    सत्यापित खबरें
                  </strong>

                  <span>
                    जिम्मेदार पत्रकारिता
                  </span>

                </div>

              </div>

            </div>

          </section>
        )}


      {/* ===================================================
          MOBILE HERO PRIORITY STRIP
          =================================================== */}

      {!selectedNews &&
        activeSection === "home" && (

          <section className="mobile-hero-priority">

            <div className="mobile-priority-header">

              <div>

                <span>
                  TODAY'S FOCUS
                </span>

                <h2>
                  आज का फोकस
                </h2>

              </div>


              <button
                type="button"
                onClick={() =>
                  navigateTo(
                    "rajasthan"
                  )
                }
              >

                सभी

                <ArrowRight
                  size={14}
                />

              </button>

            </div>


            <div className="mobile-priority-scroll">

              {NEWS_DATA
                .filter(
                  (news) =>
                    news.featured ||
                    news.breaking
                )
                .map((news) => (

                  <button
                    type="button"
                    className="mobile-priority-card"
                    key={`priority-${news.id}`}
                    onClick={() =>
                      openNews(news)
                    }
                  >

                    <div className="mobile-priority-image">

                      <img
                        src={
                          news.image
                        }
                        alt={
                          news.title
                        }
                        loading="lazy"
                        onError={
                          handleImageError
                        }
                      />


                      {news.breaking && (

                        <span>
                          BREAKING
                        </span>

                      )}

                    </div>


                    <div className="mobile-priority-content">

                      <small>
                        {news.category}
                      </small>

                      <strong>
                        {news.title}
                      </strong>

                      <div>

                        <MapPin
                          size={11}
                        />

                        <span>
                          {news.location}
                        </span>

                        <Clock3
                          size={11}
                        />

                        <span>
                          {news.time}
                        </span>

                      </div>

                    </div>

                  </button>

                ))}

            </div>

          </section>

        )}


      {/* ===================================================
          TRENDING NEWS STRIP
          =================================================== */}

      {!selectedNews &&
        activeSection === "home" && (

          <section className="trending-news-strip">

            <div className="trending-label">

              <TrendingUp
                size={17}
              />

              <strong>
                TRENDING
              </strong>

            </div>


            <div className="trending-news-scroll">

              {NEWS_DATA
                .slice(0, 8)
                .map(
                  (news, index) => (

                    <button
                      type="button"
                      className="trending-news-item"
                      key={`trend-${news.id}`}
                      onClick={() =>
                        openNews(news)
                      }
                    >

                      <span>
                        {index + 1}
                      </span>

                      <strong>
                        {news.title}
                      </strong>

                      <ArrowRight
                        size={13}
                      />

                    </button>

                  )
                )}

            </div>

          </section>

        )}
              {/* ===================================================
          LATEST NEWS SECTION
          =================================================== */}

      {!selectedNews && (

        <section className="latest-news-section">


          {/* =============================================
              SECTION HEADER
              ============================================= */}

          <div className="latest-news-header">

            <div className="section-heading-left">

              <span className="section-heading-line"></span>

              <div>

                <div className="latest-title-row">

                  <h2 className="section-title">
                    {activeSection === "home"
                      ? "ताज़ा खबरें"
                      : pageTitle}
                  </h2>

                  <span className="latest-live-label">

                    <span></span>

                    LIVE

                  </span>

                </div>

                <p className="section-subtitle">

                  {activeSection === "home"
                    ? "अभी-अभी सामने आई महत्वपूर्ण खबरें"
                    : `${pageTitle} से जुड़ी ताज़ा खबरें`}

                </p>

              </div>

            </div>


            {/* HEADER ACTION */}

            <button
              type="button"
              className="latest-refresh-button"
              onClick={() => {

                showToast(
                  "खबरें अपडेट की जा रही हैं..."
                );

                setTimeout(() => {

                  showToast(
                    "खबरें अपडेट हो गईं"
                  );

                }, 900);

              }}
            >

              <RefreshCw
                size={16}
              />

              <span>
                अपडेट
              </span>

            </button>

          </div>


          {/* =============================================
              CATEGORY FILTER
              ============================================= */}

          <div className="category-filter-wrapper">

            <div className="category-filter-scroll">

              <button
                type="button"
                className={
                  activeSection === "home"
                    ? "category-filter active"
                    : "category-filter"
                }
                onClick={() =>
                  navigateTo("home")
                }
              >

                <Home
                  size={15}
                />

                <span>
                  सभी
                </span>

              </button>


              {CATEGORIES.map(
                (category) => {

                  const CategoryIcon =
                    category.icon;

                  return (

                    <button
                      type="button"
                      key={`filter-${category.id}`}
                      className={
                        activeSection ===
                        category.id
                          ? "category-filter active"
                          : "category-filter"
                      }
                      onClick={() =>
                        navigateTo(
                          category.id
                        )
                      }
                    >

                      <CategoryIcon
                        size={15}
                      />

                      <span>
                        {category.title}
                      </span>

                    </button>

                  );

                }
              )}

            </div>

          </div>


          {/* =============================================
              MAIN NEWS LAYOUT
              ============================================= */}

          <div className="news-content-layout">


            {/* =========================================
                NEWS LIST
                ========================================= */}

            <div className="news-feed-column">


              {/* NEWS COUNT */}

              <div className="news-feed-topbar">

                <div className="news-count-text">

                  <span>
                    कुल खबरें
                  </span>

                  <strong>
                    {categoryNews.length}
                  </strong>

                </div>


                <div className="news-sort-wrapper">

                  <span>
                    क्रम:
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      showToast(
                        "नई खबरें पहले दिखाई जा रही हैं"
                      )
                    }
                  >

                    नवीनतम

                    <ChevronDown
                      size={14}
                    />

                  </button>

                </div>

              </div>


              {/* =========================================
                  NEWS CARDS
                  ========================================= */}

              <div className="professional-news-list">

                {categoryNews
                  .slice(
                    0,
                    APP_SETTINGS.newsPerSection
                  )
                  .map(
                    (news, index) => (

                      <article
                        className={
                          index === 0
                            ? "professional-news-card first"
                            : "professional-news-card"
                        }
                        key={`latest-${news.id}`}
                        onClick={() =>
                          openNews(news)
                        }
                      >


                        {/* CARD IMAGE */}

                        <div className="professional-news-image">

                          <img
                            src={
                              news.image
                            }
                            alt={
                              news.title
                            }
                            loading="lazy"
                            onError={
                              handleImageError
                            }
                          />


                          {/* CATEGORY */}

                          <span className="professional-news-category">

                            {news.category}

                          </span>


                          {/* BREAKING */}

                          {news.breaking && (

                            <span className="professional-news-breaking">

                              <span></span>

                              BREAKING

                            </span>

                          )}

                        </div>


                        {/* CARD CONTENT */}

                        <div className="professional-news-body">


                          {/* META */}

                          <div className="professional-news-meta">

                            <span>

                              <MapPin
                                size={12}
                              />

                              {news.location}

                            </span>


                            <span className="meta-divider">
                              •
                            </span>


                            <span>

                              <Clock3
                                size={12}
                              />

                              {news.time}

                            </span>

                          </div>


                          {/* TITLE */}

                          <h3>
                            {news.title}
                          </h3>


                          {/* DESCRIPTION */}

                          <p>
                            {news.description}
                          </p>


                          {/* FOOTER */}

                          <div className="professional-news-footer">

                            <div className="professional-author">

                              <span className="professional-author-avatar">
                                AR
                              </span>

                              <span>
                                {news.author}
                              </span>

                            </div>


                            <div className="professional-news-actions">

                              <span>

                                <Eye
                                  size={13}
                                />

                                {news.views}

                              </span>


                              <button
                                type="button"
                                className={
                                  bookmarkedNews.includes(
                                    news.id
                                  )
                                    ? "news-icon-action active"
                                    : "news-icon-action"
                                }
                                aria-label="बुकमार्क"
                                onClick={(event) => {

                                  event.stopPropagation();

                                  toggleBookmark(
                                    news.id
                                  );

                                }}
                              >

                                {bookmarkedNews.includes(
                                  news.id
                                ) ? (

                                  <BookmarkCheck
                                    size={16}
                                  />

                                ) : (

                                  <Bookmark
                                    size={16}
                                  />

                                )}

                              </button>


                              <button
                                type="button"
                                className="news-icon-action"
                                aria-label="शेयर"
                                onClick={(event) => {

                                  event.stopPropagation();

                                  shareNews(
                                    news
                                  );

                                }}
                              >

                                <Share2
                                  size={16}
                                />

                              </button>

                            </div>

                          </div>

                        </div>

                      </article>

                    )
                  )}

              </div>


              {/* =========================================
                  EMPTY STATE
                  ========================================= */}

              {categoryNews.length === 0 && (

                <div className="news-empty-state">

                  <div className="news-empty-icon">

                    <Newspaper
                      size={28}
                    />

                  </div>

                  <h3>
                    अभी कोई खबर उपलब्ध नहीं है
                  </h3>

                  <p>
                    इस कैटेगरी की खबरें जल्द अपडेट की जाएंगी।
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      navigateTo("home")
                    }
                  >

                    होम पर जाएं

                    <ArrowRight
                      size={15}
                    />

                  </button>

                </div>

              )}


              {/* =========================================
                  LOAD MORE
                  ========================================= */}

              {categoryNews.length >
                APP_SETTINGS.newsPerSection && (

                <div className="load-more-wrapper">

                  <button
                    type="button"
                    className="load-more-button"
                    onClick={() => {

                      showToast(
                        "और खबरें जल्द लोड होंगी"
                      );

                    }}
                  >

                    <RefreshCw
                      size={17}
                    />

                    <span>
                      और खबरें देखें
                    </span>

                    <ArrowRight
                      size={16}
                    />

                  </button>

                </div>

              )}

            </div>


            {/* =========================================
                RIGHT SIDEBAR
                ========================================= */}

            <aside className="news-sidebar">


              {/* =========================================
                  POPULAR NEWS
                  ========================================= */}

              <div className="sidebar-card popular-sidebar-card">

                <div className="sidebar-card-header">

                  <div>

                    <span className="sidebar-kicker">
                      MOST READ
                    </span>

                    <h2>
                      सबसे ज्यादा पढ़ी गई
                    </h2>

                  </div>


                  <Flame
                    size={20}
                  />

                </div>


                <div className="popular-news-list">

                  {popularNews
                    .slice(0, 5)
                    .map(
                      (
                        news,
                        index
                      ) => (

                        <button
                          type="button"
                          className="popular-news-item"
                          key={`popular-${news.id}`}
                          onClick={() =>
                            openNews(
                              news
                            )
                          }
                        >

                          <span className="popular-number">

                            {String(
                              index + 1
                            ).padStart(
                              2,
                              "0"
                            )}

                          </span>


                          <div className="popular-thumb">

                            <img
                              src={
                                news.image
                              }
                              alt={
                                news.title
                              }
                              loading="lazy"
                              onError={
                                handleImageError
                              }
                            />

                          </div>


                          <div className="popular-content">

                            <span>
                              {news.category}
                            </span>

                            <strong>
                              {news.title}
                            </strong>

                            <small>

                              <Eye
                                size={11}
                              />

                              {news.views}

                            </small>

                          </div>

                        </button>

                      )
                    )}

                </div>


                <button
                  type="button"
                  className="sidebar-view-all"
                  onClick={() =>
                    navigateTo("home")
                  }
                >

                  सभी लोकप्रिय खबरें

                  <ArrowRight
                    size={15}
                  />

                </button>

              </div>


              {/* =========================================
                  DISTRICT QUICK CARD
                  ========================================= */}

              <div className="sidebar-card district-sidebar-card">

                <div className="district-sidebar-top">

                  <div className="district-sidebar-icon">

                    <MapPin
                      size={20}
                    />

                  </div>


                  <div>

                    <span>
                      LOCAL NEWS
                    </span>

                    <h3>
                      {selectedDistrict}
                    </h3>

                  </div>

                </div>


                <p>
                  अपने जिले की ताज़ा और स्थानीय खबरें पढ़ें।
                </p>


                <button
                  type="button"
                  onClick={() => {

                    setDistrictModalOpen(
                      true
                    );

                  }}
                >

                  जिला बदलें

                  <ChevronDown
                    size={15}
                  />

                </button>

              </div>


              {/* =========================================
                  NEWSLETTER / ALERT CARD
                  ========================================= */}

              <div className="sidebar-card alert-sidebar-card">

                <div className="alert-sidebar-icon">

                  <Bell
                    size={20}
                  />

                </div>


                <span className="sidebar-kicker">
                  NEWS ALERT
                </span>


                <h3>
                  खबरों से अपडेट रहें
                </h3>


                <p>
                  महत्वपूर्ण खबरों की जानकारी सबसे पहले पाने के लिए नोटिफिकेशन ऑन करें।
                </p>


                <button
                  type="button"
                  onClick={() =>
                    showToast(
                      "न्यूज़ अलर्ट जल्द उपलब्ध होगा"
                    )
                  }
                >

                  अलर्ट चालू करें

                  <Bell
                    size={15}
                  />

                </button>

              </div>


            </aside>

          </div>

        </section>

      )}


      {/* ===================================================
          CATEGORY PAGE NEWS GRID
          =================================================== */}

      {!selectedNews &&
        activeSection !== "home" &&
        activeSection !== "district" && (

          <section className="category-page-section">

            <div className="category-page-intro">

              <div>

                <span className="category-page-kicker">
                  AWAAZ RAJASTHAN
                </span>

                <h2>
                  {pageTitle}
                </h2>

                <p>
                  {pageTitle} से जुड़ी सभी महत्वपूर्ण और ताज़ा खबरें एक ही जगह।
                </p>

              </div>


              <div className="category-page-total">

                <Newspaper
                  size={18}
                />

                <strong>
                  {categoryNews.length}
                </strong>

                <span>
                  खबरें
                </span>

              </div>

            </div>


            <div className="category-news-grid">

              {categoryNews.map(
                (news) => (

                  <article
                    className="category-news-card"
                    key={`category-${news.id}`}
                    onClick={() =>
                      openNews(news)
                    }
                  >

                    <div className="category-news-card-image">

                      <img
                        src={
                          news.image
                        }
                        alt={
                          news.title
                        }
                        loading="lazy"
                        onError={
                          handleImageError
                        }
                      />


                      <span>
                        {news.category}
                      </span>

                    </div>


                    <div className="category-news-card-body">

                      <div className="category-news-meta">

                        <span>

                          <MapPin
                            size={12}
                          />

                          {news.location}

                        </span>

                        <span>

                          <Clock3
                            size={12}
                          />

                          {news.time}

                        </span>

                      </div>


                      <h3>
                        {news.title}
                      </h3>


                      <p>
                        {news.description}
                      </p>


                      <div className="category-news-card-footer">

                        <span>
                          {news.author}
                        </span>

                        <span>
                          पढ़ें
                          <ArrowRight
                            size={14}
                          />
                        </span>

                      </div>

                    </div>

                  </article>

                )
              )}

            </div>

          </section>

        )}
        
      {/* ===================================================
          DISTRICT NEWS PAGE
          =================================================== */}

      {!selectedNews &&
        activeSection === "district" && (

          <section className="district-page-section">

            {/* =============================================
                DISTRICT PAGE HEADER
                ============================================= */}

            <div className="district-page-header">

              <div className="district-page-heading">

                <span className="district-page-kicker">
                  LOCAL RAJASTHAN
                </span>

                <h1>
                  जिला समाचार
                </h1>

                <p>
                  राजस्थान के हर जिले की स्थानीय और महत्वपूर्ण खबरें।
                </p>

              </div>


              {/* CURRENT DISTRICT */}

              <button
                type="button"
                className="district-current-selector"
                onClick={() =>
                  setDistrictModalOpen(true)
                }
              >

                <div className="district-current-icon">

                  <MapPin
                    size={21}
                  />

                </div>


                <div className="district-current-text">

                  <span>
                    आपका जिला
                  </span>

                  <strong>
                    {selectedDistrict}
                  </strong>

                </div>


                <ChevronDown
                  size={18}
                />

              </button>

            </div>


            {/* =============================================
                DISTRICT FEATURE BANNER
                ============================================= */}

            <div className="district-feature-banner">

              <div className="district-feature-background">

                <img
                  src={NEWS_DATA[11]?.image || FALLBACK_IMAGE}
                  alt="जिला समाचार"
                  onError={
                    handleImageError
                  }
                />

              </div>


              <div className="district-feature-overlay"></div>


              <div className="district-feature-content">

                <div className="district-feature-tag">

                  <MapPin
                    size={14}
                  />

                  <span>
                    LOCAL UPDATE
                  </span>

                </div>


                <h2>
                  {selectedDistrict} से जुड़ी ताज़ा खबरें
                </h2>


                <p>
                  अपने जिले की राजनीति, प्रशासन, शिक्षा, अपराध, रोजगार और स्थानीय घटनाओं से जुड़ी महत्वपूर्ण खबरें यहां पढ़ें।
                </p>


                <button
                  type="button"
                  onClick={() =>
                    showToast(
                      `${selectedDistrict} की लोकल खबरें अपडेट हो रही हैं`
                    )
                  }
                >

                  <span>
                    ताज़ा खबरें देखें
                  </span>

                  <ArrowRight
                    size={17}
                  />

                </button>

              </div>


              <div className="district-feature-location">

                <MapPin
                  size={15}
                />

                <span>
                  {selectedDistrict}, Rajasthan
                </span>

              </div>

            </div>


            {/* =============================================
                DISTRICT CATEGORY FILTERS
                ============================================= */}

            <div className="district-category-section">

              <div className="district-category-heading">

                <div>

                  <span>
                    {selectedDistrict}
                  </span>

                  <h2>
                    खबरों की श्रेणी
                  </h2>

                </div>


                <button
                  type="button"
                  onClick={() =>
                    setDistrictModalOpen(
                      true
                    )
                  }
                >

                  जिला बदलें

                  <ChevronRight
                    size={15}
                  />

                </button>

              </div>


              <div className="district-category-scroll">

                {[
                  {
                    id: "all",
                    title: "सभी खबरें",
                    icon: Newspaper
                  },
                  {
                    id: "politics",
                    title: "राजनीति",
                    icon: TrendingUp
                  },
                  {
                    id: "crime",
                    title: "अपराध",
                    icon: ShieldAlert
                  },
                  {
                    id: "education",
                    title: "शिक्षा",
                    icon: GraduationCap
                  },
                  {
                    id: "jobs",
                    title: "रोजगार",
                    icon: BriefcaseBusiness
                  },
                  {
                    id: "sports",
                    title: "खेल",
                    icon: Trophy
                  }
                ].map(
                  (category) => {

                    const DistrictCategoryIcon =
                      category.icon;

                    return (

                      <button
                        type="button"
                        key={
                          category.id
                        }
                        className={
                          category.id ===
                          "all"
                            ? "district-category-chip active"
                            : "district-category-chip"
                        }
                        onClick={() =>
                          showToast(
                            `${category.title} की खबरें`
                          )
                        }
                      >

                        <DistrictCategoryIcon
                          size={16}
                        />

                        <span>
                          {category.title}
                        </span>

                      </button>

                    );

                  }
                )}

              </div>

            </div>


            {/* =============================================
                DISTRICT LATEST NEWS
                ============================================= */}

            <div className="district-latest-section">

              <div className="district-latest-header">

                <div className="section-heading-left">

                  <span className="section-heading-line"></span>

                  <div>

                    <div className="district-latest-title-row">

                      <h2 className="section-title">
                        {selectedDistrict} की ताज़ा खबरें
                      </h2>

                      <span className="latest-live-label">

                        <span></span>

                        LIVE

                      </span>

                    </div>

                    <p className="section-subtitle">
                      स्थानीय स्तर पर सामने आ रही प्रमुख खबरें
                    </p>

                  </div>

                </div>


                <span className="district-news-date">

                  <CalendarDays
                    size={14}
                  />

                  आज

                </span>

              </div>


              <div className="district-latest-grid">

                {NEWS_DATA
                  .filter(
                    (news) =>
                      news.categoryId ===
                        "rajasthan" ||
                      news.location ===
                        selectedDistrict
                  )
                  .slice(0, 6)
                  .map(
                    (news, index) => (

                      <article
                        className={
                          index === 0
                            ? "district-large-news-card"
                            : "district-standard-news-card"
                        }
                        key={`district-latest-${news.id}`}
                        onClick={() =>
                          openNews({
                            ...news,
                            location:
                              selectedDistrict
                          })
                        }
                      >

                        <div className="district-latest-image">

                          <img
                            src={
                              news.image
                            }
                            alt={
                              news.title
                            }
                            loading="lazy"
                            onError={
                              handleImageError
                            }
                          />


                          <span className="district-latest-category">

                            {news.category}

                          </span>


                          {news.breaking && (

                            <span className="district-latest-breaking">

                              <span></span>

                              BREAKING

                            </span>

                          )}

                        </div>


                        <div className="district-latest-content">

                          <div className="district-news-meta">

                            <span>

                              <Clock3
                                size={12}
                              />

                              {news.time}

                            </span>


                            <span>

                              <Eye
                                size={12}
                              />

                              {news.views}

                            </span>

                          </div>


                          <h3>
                            {news.title}
                          </h3>


                          <p>
                            {news.description}
                          </p>


                          <div className="district-news-card-footer">

                            <span>

                              <MapPin
                                size={12}
                              />

                              {selectedDistrict}

                            </span>


                            <span className="district-card-read">

                              पढ़ें

                              <ArrowRight
                                size={14}
                              />

                            </span>

                          </div>

                        </div>

                      </article>

                    )
                  )}

              </div>

            </div>


            {/* =============================================
                ALL DISTRICTS GRID
                ============================================= */}

            <div className="all-districts-section">

              <div className="all-districts-heading">

                <div>

                  <span className="district-page-kicker">
                    RAJASTHAN MAP
                  </span>

                  <h2>
                    राजस्थान के सभी जिले
                  </h2>

                  <p>
                    किसी भी जिले को चुनकर वहां की स्थानीय खबरें देखें।
                  </p>

                </div>


                <Map
                  size={30}
                  strokeWidth={1.7}
                />

              </div>


              <div className="all-districts-grid">

                {DISTRICTS.map(
                  (district, index) => (

                    <button
                      type="button"
                      key={`all-district-${district}`}
                      className={
                        district ===
                        selectedDistrict
                          ? "all-district-card active"
                          : "all-district-card"
                      }
                      onClick={() => {

                        setSelectedDistrict(
                          district
                        );

                        showToast(
                          `${district} चुना गया`
                        );

                        window.scrollTo({
                          top: 0,
                          behavior:
                            "smooth"
                        });

                      }}
                    >

                      <span className="all-district-number">

                        {String(
                          index + 1
                        ).padStart(
                          2,
                          "0"
                        )}

                      </span>


                      <span className="all-district-pin">

                        <MapPin
                          size={15}
                        />

                      </span>


                      <span className="all-district-name">

                        {district}

                      </span>


                      <ChevronRight
                        size={14}
                        className="all-district-arrow"
                      />

                    </button>

                  )
                )}

              </div>

            </div>

          </section>

        )}


      {/* ===================================================
          DISTRICT SELECTOR MODAL
          =================================================== */}

      {districtModalOpen && (

        <div
          className="modal-overlay district-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="जिला चुनें"
          onMouseDown={(event) => {

            if (
              event.target ===
              event.currentTarget
            ) {

              setDistrictModalOpen(
                false
              );

            }

          }}
        >

          <div className="district-modal">


            {/* =============================================
                MODAL HEADER
                ============================================= */}

            <div className="district-modal-header">

              <div>

                <span className="district-modal-kicker">
                  LOCAL NEWS
                </span>

                <h2>
                  अपना जिला चुनें
                </h2>

                <p>
                  जिस जिले की खबरें पढ़ना चाहते हैं उसे चुनें।
                </p>

              </div>


              <button
                type="button"
                className="modal-close-button"
                aria-label="बंद करें"
                onClick={() =>
                  setDistrictModalOpen(
                    false
                  )
                }
              >

                <X
                  size={20}
                />

              </button>

            </div>


            {/* =============================================
                MODAL SEARCH
                ============================================= */}

            <div className="district-modal-search">

              <Search
                size={18}
              />

              <input
                type="search"
                placeholder="जिला खोजें..."
                aria-label="जिला खोजें"
                onChange={(event) => {

                  const value =
                    event.target.value
                      .trim()
                      .toLowerCase();

                  const buttons =
                    document.querySelectorAll(
                      ".district-modal-list button"
                    );

                  buttons.forEach(
                    (button) => {

                      const text =
                        button.textContent
                          .trim()
                          .toLowerCase();

                      button.style.display =
                        !value ||
                        text.includes(
                          value
                        )
                          ? ""
                          : "none";

                    }
                  );

                }}
              />

            </div>


            {/* =============================================
                POPULAR DISTRICTS
                ============================================= */}

            <div className="popular-districts">

              <span>
                लोकप्रिय
              </span>


              <div>

                {[
                  "जयपुर",
                  "जोधपुर",
                  "उदयपुर",
                  "कोटा",
                  "अजमेर",
                  "भीलवाड़ा"
                ].map(
                  (district) => (

                    <button
                      type="button"
                      key={`popular-${district}`}
                      className={
                        selectedDistrict ===
                        district
                          ? "popular-district active"
                          : "popular-district"
                      }
                      onClick={() => {

                        setSelectedDistrict(
                          district
                        );

                        setDistrictModalOpen(
                          false
                        );

                        showToast(
                          `${district} की खबरें चुनी गईं`
                        );

                      }}
                    >

                      {district}

                    </button>

                  )
                )}

              </div>

            </div>


            {/* =============================================
                DISTRICT LIST
                ============================================= */}

             <div className="district-modal-list">

              {DISTRICTS.map(
                (district, index) => (

                  <button
                    type="button"
                    key={`modal-district-${district}`}
                    className={
                      selectedDistrict ===
                      district
                        ? "district-modal-item active"
                        : "district-modal-item"
                    }
                    onClick={() => {

                      setSelectedDistrict(
                        district
                      );

                      setDistrictModalOpen(
                        false
                      );

                      showToast(
                        `${district} की खबरें चुनी गईं`
                      );

                    }}
                  >

                    <span className="modal-district-index">

                      {String(
                        index + 1
                      ).padStart(
                        2,
                        "0"
                      )}

                    </span>


                    <span className="modal-district-icon">

                      <MapPin
                        size={16}
                      />

                    </span>


                    <span className="modal-district-name">

                      {district}

                    </span>


                    {selectedDistrict ===
                      district && (

                      <span className="district-selected-check">

                        ✓

                      </span>

                    )}

                  </button>

                )
              )}

            </div>


            {/* =============================================
                MODAL FOOTER
                ============================================= */}

            <div className="district-modal-footer">

              <div>

                <MapPin
                  size={15}
                />

                <span>
                  आपका चयन:
                </span>

                <strong>
                  {selectedDistrict}
                </strong>

              </div>


              <button
                type="button"
                onClick={() => {

                  setDistrictModalOpen(
                    false
                  );

                  navigateTo(
                    "district"
                  );

                }}
              >

                जिला समाचार देखें

                <ArrowRight
                  size={15}
                />

              </button>

            </div>

          </div>

        </div>

      )}


      {/* ===================================================
          PART 6 END
          =================================================== */}
              {/* ===================================================
          CATEGORY FEATURED NEWS
          =================================================== */}

      {!selectedNews &&
        activeSection !== "home" &&
        activeSection !== "district" && (

          <section className="category-featured-section">


            {/* =============================================
                CATEGORY HERO
                ============================================= */}

            <div className="category-featured-hero">

              <div className="category-featured-hero-content">

                <span className="category-featured-kicker">
                  AWAAZ RAJASTHAN • SPECIAL COVERAGE
                </span>

                <h1>
                  {pageTitle}
                </h1>

                <p>
                  {getCategoryDescription(
                    activeSection
                  )}
                </p>


                <div className="category-featured-hero-meta">

                  <span>

                    <Newspaper
                      size={14}
                    />

                    ताज़ा खबरें

                  </span>


                  <span>

                    <Clock3
                      size={14}
                    />

                    लगातार अपडेट

                  </span>


                  <span>

                    <ShieldCheck
                      size={14}
                    />

                    सत्यापित जानकारी

                  </span>

                </div>

              </div>


              <div className="category-featured-hero-pattern">

                <div className="category-pattern-circle circle-one"></div>

                <div className="category-pattern-circle circle-two"></div>

                <div className="category-pattern-circle circle-three"></div>

                <Newspaper
                  size={90}
                  strokeWidth={1}
                />

              </div>

            </div>


            {/* =============================================
                FEATURED CATEGORY STORIES
                ============================================= */}

            <div className="category-featured-grid">

              {categoryNews
                .slice(0, 3)
                .map(
                  (news, index) => (

                    <article
                      key={`featured-category-${news.id}`}
                      className={
                        index === 0
                          ? "category-featured-main-card"
                          : "category-featured-small-card"
                      }
                      onClick={() =>
                        openNews(news)
                      }
                    >

                      <div className="category-featured-image">

                        <img
                          src={
                            news.image
                          }
                          alt={
                            news.title
                          }
                          loading="lazy"
                          onError={
                            handleImageError
                          }
                        />


                        <div className="category-featured-image-overlay"></div>


                        <span className="category-featured-label">

                          {index === 0
                            ? "मुख्य खबर"
                            : "ताज़ा खबर"}

                        </span>


                        {news.breaking && (

                          <span className="category-featured-breaking">

                            <span></span>

                            BREAKING

                          </span>

                        )}


                        <div className="category-featured-image-content">

                          <div className="category-featured-meta">

                            <span>
                              {news.category}
                            </span>

                            <span>
                              •
                            </span>

                            <span>
                              {news.time}
                            </span>

                          </div>


                          <h2>
                            {news.title}
                          </h2>


                          <div className="category-featured-location">

                            <MapPin
                              size={12}
                            />

                            <span>
                              {news.location}
                            </span>

                          </div>

                        </div>

                      </div>

                    </article>

                  )
                )}

            </div>


            {/* =============================================
                CATEGORY NEWS TABS
                ============================================= */}

            <div className="category-news-tabs">

              <div className="category-tabs-heading">

                <div>

                  <span>
                    NEWS DESK
                  </span>

                  <h2>
                    {pageTitle} की सभी खबरें
                  </h2>

                </div>


                <div className="category-tabs-total">

                  <span>
                    कुल
                  </span>

                  <strong>
                    {categoryNews.length}
                  </strong>

                  <span>
                    खबरें
                  </span>

                </div>

              </div>


              <div className="category-tab-buttons">

                {[
                  {
                    id: "latest",
                    label: "लेटेस्ट",
                    icon: Clock3
                  },
                  {
                    id: "popular",
                    label: "लोकप्रिय",
                    icon: Flame
                  },
                  {
                    id: "breaking",
                    label: "ब्रेकिंग",
                    icon: Zap
                  }
                ].map(
                  (tab) => {

                    const TabIcon =
                      tab.icon;

                    return (

                      <button
                        type="button"
                        key={tab.id}
                        className={
                          categoryTab ===
                          tab.id
                            ? "category-tab-button active"
                            : "category-tab-button"
                        }
                        onClick={() =>
                          setCategoryTab(
                            tab.id
                          )
                        }
                      >

                        <TabIcon
                          size={15}
                        />

                        <span>
                          {tab.label}
                        </span>

                      </button>

                    );

                  }
                )}

              </div>

            </div>


            {/* =============================================
                FILTERED CATEGORY NEWS
                ============================================= */}

            <div className="category-filtered-layout">


              {/* =========================================
                  MAIN CATEGORY FEED
                  ========================================= */}

              <div className="category-filtered-feed">

                {getFilteredCategoryNews(
                  categoryNews,
                  categoryTab
                )
                  .map(
                    (news, index) => (

                      <article
                        className="category-feed-card"
                        key={`category-feed-${news.id}`}
                        onClick={() =>
                          openNews(news)
                        }
                      >

                        {/* NUMBER */}

                        <div className="category-feed-number">

                          {String(
                            index + 1
                          ).padStart(
                            2,
                            "0"
                          )}

                        </div>


                        {/* IMAGE */}

                        <div className="category-feed-image">

                          <img
                            src={
                              news.image
                            }
                            alt={
                              news.title
                            }
                            loading="lazy"
                            onError={
                              handleImageError
                            }
                          />


                          {news.breaking && (

                            <span>

                              <span></span>

                              BREAKING

                            </span>

                          )}

                        </div>


                        {/* CONTENT */}

                        <div className="category-feed-content">

                          <div className="category-feed-meta">

                            <span className="category-feed-category">

                              {news.category}

                            </span>


                            <span>
                              •
                            </span>


                            <span>

                              <MapPin
                                size={11}
                              />

                              {news.location}

                            </span>


                            <span>
                              •
                            </span>


                            <span>

                              <Clock3
                                size={11}
                              />

                              {news.time}

                            </span>

                          </div>


                          <h3>
                            {news.title}
                          </h3>


                          <p>
                            {news.description}
                          </p>


                          <div className="category-feed-footer">

                            <div className="category-feed-author">

                              <span>
                                AR
                              </span>

                              <strong>
                                {news.author}
                              </strong>

                            </div>


                            <div className="category-feed-actions">

                              <span>

                                <Eye
                                  size={13}
                                />

                                {news.views}

                              </span>


                              <button
                                type="button"
                                aria-label="बुकमार्क"
                                className={
                                  bookmarkedNews.includes(
                                    news.id
                                  )
                                    ? "news-icon-action active"
                                    : "news-icon-action"
                                }
                                onClick={(event) => {

                                  event.stopPropagation();

                                  toggleBookmark(
                                    news.id
                                  );

                                }}
                              >

                                {bookmarkedNews.includes(
                                  news.id
                                ) ? (

                                  <BookmarkCheck
                                    size={15}
                                  />

                                ) : (

                                  <Bookmark
                                    size={15}
                                  />

                                )}

                              </button>


                              <button
                                type="button"
                                aria-label="शेयर"
                                className="news-icon-action"
                                onClick={(event) => {

                                  event.stopPropagation();

                                  shareNews(
                                    news
                                  );

                                }}
                              >

                                <Share2
                                  size={15}
                                />

                              </button>

                            </div>

                          </div>

                        </div>


                        {/* ARROW */}

                        <div className="category-feed-arrow">

                          <ArrowUpRight
                            size={18}
                          />

                        </div>

                      </article>

                    )
                  )}


                {/* EMPTY CATEGORY */}

                {categoryNews.length === 0 && (

                  <div className="category-empty-box">

                    <div>

                      <FileQuestion
                        size={34}
                      />

                    </div>

                    <h3>
                      इस सेक्शन में अभी खबरें नहीं हैं
                    </h3>

                    <p>
                      नई खबरें उपलब्ध होते ही यहां दिखाई जाएंगी।
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        navigateTo(
                          "home"
                        )
                      }
                    >

                      होम पर वापस जाएं

                      <ArrowRight
                        size={15}
                      />

                    </button>

                  </div>

                )}

              </div>


              {/* =========================================
                  CATEGORY SIDEBAR
                  ========================================= */}

              <aside className="category-right-sidebar">


                {/* =========================================
                    QUICK CATEGORY MENU
                    ========================================= */}

                <div className="category-sidebar-card">

                  <div className="category-sidebar-title">

                    <div>

                      <span>
                        EXPLORE
                      </span>

                      <h3>
                        अन्य सेक्शन
                      </h3>

                    </div>


                    <Grid2X2
                      size={19}
                    />

                  </div>


                  <div className="category-sidebar-links">

                    {CATEGORIES
                      .filter(
                        (category) =>
                          category.id !==
                          activeSection
                      )
                      .slice(0, 7)
                      .map(
                        (category) => {

                          const CategorySideIcon =
                            category.icon;

                          return (

                            <button
                              type="button"
                              key={`side-category-${category.id}`}
                              onClick={() =>
                                navigateTo(
                                  category.id
                                )
                              }
                            >

                              <span className="category-side-icon">

                                <CategorySideIcon
                                  size={15}
                                />

                              </span>


                              <span>
                                {category.title}
                              </span>


                              <ChevronRight
                                size={14}
                              />

                            </button>

                          );

                        }
                      )}

                  </div>

                </div>


                {/* =========================================
                    LATEST UPDATE CARD
                    ========================================= */}

                <div className="category-sidebar-card latest-update-card">

                  <div className="category-sidebar-title">

                    <div>

                      <span>
                        LIVE DESK
                      </span>

                      <h3>
                        ताज़ा अपडेट
                      </h3>

                    </div>


                    <span className="sidebar-live-pulse">
                      LIVE
                    </span>

                  </div>


                  <div className="latest-update-list">

                    {NEWS_DATA
                      .slice(0, 4)
                      .map(
                        (news) => (

                          <button
                            type="button"
                            key={`update-${news.id}`}
                            onClick={() =>
                              openNews(
                                news
                              )
                            }
                          >

                            <div className="latest-update-time">

                              <span></span>

                              <small>
                                {news.time}
                              </small>

                            </div>


                            <strong>
                              {news.title}
                            </strong>

                          </button>

                        )
                      )}

                  </div>

                </div>


                {/* =========================================
                    EDITORIAL TRUST CARD
                    ========================================= */}

                  <div className="category-sidebar-card editorial-card">

                  <div className="editorial-icon">

                    <ShieldCheck
                      size={23}
                    />

                  </div>


                  <span className="category-sidebar-kicker">
                    OUR PROMISE
                  </span>


                  <h3>
                    खबर पहले नहीं,
                    <br />
                    सही पहले।
                  </h3>


                  <p>
                    आवाज़ राजस्थान का उद्देश्य आपको तेज़, जिम्मेदार और भरोसेमंद समाचार उपलब्ध कराना है।
                  </p>


                  <button
                    type="button"
                    onClick={() =>
                      navigateTo(
                        "info"
                      )
                    }
                  >

                    हमारे बारे में

                    <ArrowRight
                      size={15}
                    />

                  </button>

                </div>


              </aside>

            </div>

          </section>

        )}


      {/* ===================================================
          SPECIAL CATEGORY QUICK SECTIONS
          =================================================== */}

      {!selectedNews &&
        activeSection === "home" && (

          <section className="home-category-sections">


            {/* =============================================
                RAJASTHAN NEWS
                ============================================= */}

            <div className="home-category-block">

              <div className="home-category-header">

                <div className="home-category-title">

                  <span className="home-category-accent"></span>

                  <div>

                    <span>
                      RAJASTHAN
                    </span>

                    <h2>
                      राजस्थान की खबरें
                    </h2>

                  </div>

                </div>


                <button
                  type="button"
                  onClick={() =>
                    navigateTo(
                      "rajasthan"
                    )
                  }
                >

                  सभी देखें

                  <ArrowRight
                    size={15}
                  />

                </button>

              </div>


              <div className="home-category-grid">

                {NEWS_DATA
                  .filter(
                    (news) =>
                      news.categoryId ===
                      "rajasthan"
                  )
                  .slice(0, 4)
                  .map(
                    (news, index) => (

                      <article
                        className={
                          index === 0
                            ? "home-category-card featured"
                            : "home-category-card"
                        }
                        key={`rajasthan-home-${news.id}`}
                        onClick={() =>
                          openNews(news)
                        }
                      >

                        <div className="home-category-card-image">

                          <img
                            src={
                              news.image
                            }
                            alt={
                              news.title
                            }
                            loading="lazy"
                            onError={
                              handleImageError
                            }
                          />

                          <span>
                            {news.category}
                          </span>

                        </div>


                        <div className="home-category-card-content">

                          <div>

                            <MapPin
                              size={11}
                            />

                            <span>
                              {news.location}
                            </span>

                            <Clock3
                              size={11}
                            />

                            <span>
                              {news.time}
                            </span>

                          </div>


                          <h3>
                            {news.title}
                          </h3>


                          <p>
                            {news.description}
                          </p>


                          <span className="home-category-read">

                            पूरी खबर पढ़ें

                            <ArrowRight
                              size={14}
                            />

                          </span>

                        </div>

                      </article>

                    )
                  )}

              </div>

            </div>


            {/* =============================================
                EDUCATION + JOBS SPLIT
                ============================================= */}

            <div className="home-dual-category-grid">


              {/* EDUCATION */}

              <div className="home-mini-category-block">

                <div className="home-mini-category-header">

                  <div>

                    <span>
                      EDUCATION
                    </span>

                    <h2>
                      शिक्षा
                    </h2>

                  </div>


                  <button
                    type="button"
                    onClick={() =>
                      navigateTo(
                        "education"
                      )
                    }
                  >

                    <ArrowUpRight
                      size={17}
                    />

                  </button>

                </div>


                <div className="home-mini-news-list">

                  {NEWS_DATA
                    .filter(
                      (news) =>
                        news.categoryId ===
                        "education"
                    )
                    .slice(0, 3)
                    .map(
                      (news) => (

                        <button
                          type="button"
                          key={`education-mini-${news.id}`}
                          onClick={() =>
                            openNews(
                              news
                            )
                          }
                        >

                          <div className="home-mini-news-image">

                            <img
                              src={
                                news.image
                              }
                              alt={
                                news.title
                              }
                              loading="lazy"
                              onError={
                                handleImageError
                              }
                            />

                          </div>


                          <div>

                            <span>
                              {news.time}
                            </span>

                            <strong>
                              {news.title}
                            </strong>

                          </div>


                          <ChevronRight
                            size={15}
                          />

                        </button>

                      )
                    )}

                </div>

              </div>


              {/* JOBS */}

              <div className="home-mini-category-block">

                <div className="home-mini-category-header">

                  <div>

                    <span>
                      CAREER
                    </span>

                    <h2>
                      रोजगार
                    </h2>

                  </div>


                  <button
                    type="button"
                    onClick={() =>
                      navigateTo(
                        "jobs"
                      )
                    }
                  >

                    <ArrowUpRight
                      size={17}
                    />

                  </button>

                </div>


                <div className="home-mini-news-list">

                  {NEWS_DATA
                    .filter(
                      (news) =>
                        news.categoryId ===
                        "jobs"
                    )
                    .slice(0, 3)
                    .map(
                      (news) => (

                        <button
                          type="button"
                          key={`jobs-mini-${news.id}`}
                          onClick={() =>
                            openNews(
                              news
                            )
                          }
                        >

                          <div className="home-mini-news-image">

                            <img
                              src={
                                news.image
                              }
                              alt={
                                news.title
                              }
                              loading="lazy"
                              onError={
                                handleImageError
                              }
                            />

                          </div>


                          <div>

                            <span>
                              {news.time}
                            </span>

                            <strong>
                              {news.title}
                            </strong>

                          </div>


                          <ChevronRight
                            size={15}
                          />

                        </button>

                      )
                    )}

                </div>

              </div>

            </div>

          </section>

        )}
              {/* ===================================================
          POLITICS + NATIONAL + SPORTS
          HOME SPECIAL COVERAGE
          =================================================== */}

      {!selectedNews &&
        activeSection === "home" && (

          <section className="home-special-coverage">


            {/* =================================================
                POLITICS SECTION
                ================================================= */}

            <div className="special-coverage-block">

              <div className="special-section-header">

                <div className="special-section-title">

                  <span className="special-section-marker"></span>

                  <div>

                    <span className="special-section-kicker">
                      POLITICS DESK
                    </span>

                    <h2>
                      राजनीति
                    </h2>

                  </div>

                </div>


                <button
                  type="button"
                  className="special-see-all"
                  onClick={() =>
                    navigateTo("politics")
                  }
                >

                  सभी खबरें

                  <ArrowRight
                    size={15}
                  />

                </button>

              </div>


              <div className="politics-news-layout">


                {/* MAIN POLITICS STORY */}

                <div className="politics-main-story">

                  {NEWS_DATA
                    .filter(
                      (news) =>
                        news.categoryId ===
                        "politics"
                    )
                    .slice(0, 1)
                    .map(
                      (news) => (

                        <article
                          key={`politics-main-${news.id}`}
                          onClick={() =>
                            openNews(news)
                          }
                        >

                          <div className="politics-main-image">

                            <img
                              src={
                                news.image
                              }
                              alt={
                                news.title
                              }
                              loading="lazy"
                              onError={
                                handleImageError
                              }
                            />


                            <div className="politics-image-overlay"></div>


                            <span className="politics-main-label">

                              राजनीति

                            </span>


                            <div className="politics-main-content">

                              <div className="politics-meta">

                                <span>

                                  <MapPin
                                    size={12}
                                  />

                                  {news.location}

                                </span>


                                <span>

                                  <Clock3
                                    size={12}
                                  />

                                  {news.time}

                                </span>

                              </div>


                              <h3>
                                {news.title}
                              </h3>


                              <p>
                                {news.description}
                              </p>


                              <span className="politics-read">

                                पूरी खबर पढ़ें

                                <ArrowRight
                                  size={14}
                                />

                              </span>

                            </div>

                          </div>

                        </article>

                      )
                    )}

                </div>


                {/* POLITICS LIST */}

                <div className="politics-side-list">

                  {NEWS_DATA
                    .filter(
                      (news) =>
                        news.categoryId ===
                        "politics"
                    )
                    .slice(1, 5)
                    .map(
                      (
                        news,
                        index
                      ) => (

                        <article
                          className="politics-list-card"
                          key={`politics-side-${news.id}`}
                          onClick={() =>
                            openNews(
                              news
                            )
                          }
                        >

                          <div className="politics-list-number">

                            {String(
                              index + 1
                            ).padStart(
                              2,
                              "0"
                            )}

                          </div>


                          <div className="politics-list-image">

                            <img
                              src={
                                news.image
                              }
                              alt={
                                news.title
                              }
                              loading="lazy"
                              onError={
                                handleImageError
                              }
                            />

                          </div>


                          <div className="politics-list-content">

                            <div>

                              <span>
                                {news.time}
                              </span>

                              <span>
                                •
                              </span>

                              <span>
                                {news.location}
                              </span>

                            </div>


                            <h3>
                              {news.title}
                            </h3>


                            <p>
                              {news.description}
                            </p>


                            <span className="politics-list-arrow">

                              <ArrowUpRight
                                size={15}
                              />

                            </span>

                          </div>

                        </article>

                      )
                    )}

                </div>

              </div>

            </div>


            {/* =================================================
                NATIONAL NEWS
                ================================================= */}

            <div className="special-coverage-block national-special-block">

              <div className="special-section-header">

                <div className="special-section-title">

                  <span className="special-section-marker"></span>

                  <div>

                    <span className="special-section-kicker">
                      NATIONAL DESK
                    </span>

                    <h2>
                      देश की बड़ी खबरें
                    </h2>

                  </div>

                </div>


                <button
                  type="button"
                  className="special-see-all"
                  onClick={() =>
                    navigateTo(
                      "national"
                    )
                  }
                >

                  सभी देखें

                  <ArrowRight
                    size={15}
                  />

                </button>

              </div>


              <div className="national-news-grid">

                {NEWS_DATA
                  .filter(
                    (news) =>
                      news.categoryId ===
                      "national"
                  )
                  .slice(0, 6)
                  .map(
                    (news, index) => (

                      <article
                        className={
                          index === 0
                            ? "national-news-card featured"
                            : "national-news-card"
                        }
                        key={`national-${news.id}`}
                        onClick={() =>
                          openNews(
                            news
                          )
                        }
                      >

                        <div className="national-news-image">

                          <img
                            src={
                              news.image
                            }
                            alt={
                              news.title
                            }
                            loading="lazy"
                            onError={
                              handleImageError
                            }
                          />


                          <span className="national-news-category">

                            {news.category}

                          </span>


                          {news.breaking && (

                            <span className="national-breaking">

                              <span></span>

                              BREAKING

                            </span>

                          )}

                        </div>


                        <div className="national-news-content">

                          <div className="national-news-meta">

                            <span>

                              <Clock3
                                size={11}
                              />

                              {news.time}

                            </span>


                            <span>

                              <Eye
                                size={11}
                              />

                              {news.views}

                            </span>

                          </div>


                          <h3>
                            {news.title}
                          </h3>


                          <p>
                            {news.description}
                          </p>


                          <div className="national-news-footer">

                            <span>

                              <MapPin
                                size={11}
                              />

                              {news.location}

                            </span>


                            <span>

                              पढ़ें

                              <ArrowRight
                                size={13}
                              />

                            </span>

                          </div>

                        </div>

                      </article>

                    )
                  )}

              </div>

            </div>


            {/* =================================================
                SPORTS SECTION
                ================================================= */}

            <div className="sports-special-block">

              <div className="sports-header">

                <div className="sports-title">

                  <div className="sports-title-icon">

                    <Trophy
                      size={22}
                    />

                  </div>


                  <div>

                    <span>
                      SPORTS DESK
                    </span>

                    <h2>
                      खेल जगत
                    </h2>

                  </div>

                </div>


                <button
                  type="button"
                  onClick={() =>
                    navigateTo(
                      "sports"
                    )
                  }
                >

                  और खेल खबरें

                  <ArrowRight
                    size={15}
                  />

                </button>

              </div>


              <div className="sports-news-grid">

                {NEWS_DATA
                  .filter(
                    (news) =>
                      news.categoryId ===
                      "sports"
                  )
                  .slice(0, 5)
                  .map(
                    (news, index) => (

                      <article
                        className={
                          index === 0
                            ? "sports-news-card sports-featured"
                            : "sports-news-card"
                        }
                        key={`sports-${news.id}`}
                        onClick={() =>
                          openNews(
                            news
                          )
                        }
                      >

                        <div className="sports-news-image">

                          <img
                            src={
                              news.image
                            }
                            alt={
                              news.title
                            }
                            loading="lazy"
                            onError={
                              handleImageError
                            }
                          />


                          <div className="sports-image-gradient"></div>


                          <span className="sports-category-label">

                            SPORTS

                          </span>


                          <div className="sports-news-overlay-content">

                            <div>

                              <span>
                                {news.time}
                              </span>

                              <span>
                                •
                              </span>

                              <span>
                                {news.location}
                              </span>

                            </div>


                            <h3>
                              {news.title}
                            </h3>


                            <span className="sports-read">

                              पढ़ें

                              <ArrowRight
                                size={14}
                              />

                            </span>

                          </div>

                        </div>

                      </article>

                    )
                  )}

              </div>

            </div>


            {/* =================================================
                MULTIMEDIA / VIDEO NEWS
                ================================================= */}

            <div className="multimedia-section">

              <div className="multimedia-header">

                <div className="multimedia-heading">

                  <div className="multimedia-icon">

                    <Play
                      size={18}
                      fill="currentColor"
                    />

                  </div>


                  <div>

                    <span>
                      AWAAZ MULTIMEDIA
                    </span>

                    <h2>
                      वीडियो न्यूज़
                    </h2>

                  </div>

                </div>


                <button
                  type="button"
                  onClick={() =>
                    setVideoModalOpen(
                      true
                    )
                  }
                >

                  सभी वीडियो

                  <ArrowRight
                    size={15}
                  />

                </button>

              </div>


              <div className="multimedia-grid">


                {/* =========================================
                    FEATURED VIDEO
                    ========================================= */}

                <article
                  className="featured-video-card"
                  onClick={() =>
                    setVideoModalOpen(
                      true
                    )
                  }
                >

                  <div className="video-thumbnail">

                    <img
                      src={
                        VIDEO_DATA[0]?.thumbnail ||
                        FALLBACK_IMAGE
                      }
                      alt={
                        VIDEO_DATA[0]?.title ||
                        "वीडियो न्यूज़"
                      }
                      loading="lazy"
                      onError={
                        handleImageError
                      }
                    />


                    <div className="video-overlay"></div>


                    <div className="video-play-button">

                      <Play
                        size={23}
                        fill="currentColor"
                      />

                    </div>


                    <span className="video-duration">
                      03:42
                    </span>


                    <div className="featured-video-content">

                      <span>
                        VIDEO REPORT
                      </span>

                      <h3>
                        {VIDEO_DATA[0]?.title ||
                          "आवाज़ राजस्थान की खास वीडियो रिपोर्ट"}
                      </h3>

                      <div>

                        <Eye
                          size={12}
                        />

                        <span>
                          {VIDEO_DATA[0]?.views ||
                            "12K"}
                        </span>

                        <Clock3
                          size={12}
                        />

                        <span>
                          अभी
                        </span>

                      </div>

                    </div>

                  </div>

                </article>


                {/* =========================================
                    SMALL VIDEOS
                    ========================================= */}

                 <div className="small-video-list">

                  {VIDEO_DATA
                    .slice(1, 5)
                    .map(
                      (video) => (

                        <article
                          className="small-video-card"
                          key={`video-${video.id}`}
                          onClick={() =>
                            setVideoModalOpen(
                              true
                            )
                          }
                        >

                          <div className="small-video-thumbnail">

                            <img
                              src={
                                video.thumbnail ||
                                FALLBACK_IMAGE
                              }
                              alt={
                                video.title
                              }
                              loading="lazy"
                              onError={
                                handleImageError
                              }
                            />


                            <div className="small-video-play">

                              <Play
                                size={14}
                                fill="currentColor"
                              />

                            </div>


                            <span>
                              {video.duration ||
                                "02:30"}
                            </span>

                          </div>


                          <div className="small-video-content">

                            <span>
                              {video.category ||
                                "वीडियो"}
                            </span>

                            <h3>
                              {video.title}
                            </h3>

                            <small>

                              <Eye
                                size={11}
                              />

                              {video.views ||
                                "2.4K"}

                            </small>

                          </div>

                        </article>

                      )
                    )}

                </div>

              </div>

            </div>


            {/* =================================================
                PHOTO STORIES
                ================================================= */}

            <div className="photo-story-section">

              <div className="photo-story-header">

                <div>

                  <span>
                    AWAAZ PHOTO STORIES
                  </span>

                  <h2>
                    तस्वीरों में खबर
                  </h2>

                </div>


                <button
                  type="button"
                  onClick={() =>
                    showToast(
                      "फोटो स्टोरी सेक्शन जल्द अपडेट होगा"
                    )
                  }
                >

                  सभी फोटो

                  <ArrowRight
                    size={15}
                  />

                </button>

              </div>


              <div className="photo-story-grid">

                {PHOTO_STORIES
                  .slice(0, 4)
                  .map(
                    (
                      photo,
                      index
                    ) => (

                      <article
                        className={
                          index === 0
                            ? "photo-story-card large"
                            : "photo-story-card"
                        }
                        key={`photo-story-${photo.id}`}
                        onClick={() =>
                          showToast(
                            "फोटो स्टोरी जल्द उपलब्ध होगी"
                          )
                        }
                      >

                        <div className="photo-story-image">

                          <img
                            src={
                              photo.image
                            }
                            alt={
                              photo.title
                            }
                            loading="lazy"
                            onError={
                              handleImageError
                            }
                          />


                          <div className="photo-story-overlay"></div>


                          <span className="photo-story-count">

                            <Images
                              size={13}
                            />

                            {photo.count ||
                              "12"}

                          </span>


                          <div className="photo-story-content">

                            <span>
                              PHOTO STORY
                            </span>

                            <h3>
                              {photo.title}
                            </h3>

                            <p>
                              {photo.description}
                            </p>

                          </div>

                        </div>

                      </article>

                    )
                  )}

              </div>

            </div>

          </section>

        )}
              {/* ===================================================
          CURRENT AFFAIRS SECTION
          =================================================== */}

      {!selectedNews &&
        activeSection === "current-affairs" && (

          <section className="current-affairs-page">


            {/* =============================================
                CURRENT AFFAIRS HERO
                ============================================= */}

            <div className="current-affairs-hero">

              <div className="current-affairs-hero-content">

                <span className="current-affairs-kicker">
                  AWAAZ RAJASTHAN • DAILY UPDATE
                </span>

                <h1>
                  करंट अफेयर्स
                </h1>

                <p>
                  देश-दुनिया और राजस्थान से जुड़ी आज की महत्वपूर्ण घटनाओं और अपडेट को एक जगह पढ़ें।
                </p>


                <div className="current-affairs-hero-meta">

                  <span>

                    <CalendarDays
                      size={14}
                    />

                    आज का अपडेट

                  </span>


                  <span>

                    <RefreshCw
                      size={14}
                    />

                    रोज़ अपडेट

                  </span>


                  <span>

                    <CheckCircle2
                      size={14}
                    />

                    महत्वपूर्ण तथ्य

                  </span>

                </div>

              </div>


              <div className="current-affairs-hero-visual">

                <div className="ca-visual-ring ring-one"></div>

                <div className="ca-visual-ring ring-two"></div>

                <div className="ca-visual-ring ring-three"></div>


                <div className="ca-visual-center">

                  <CalendarDays
                    size={42}
                    strokeWidth={1.4}
                  />

                  <span>
                    DAILY
                  </span>

                  <strong>
                    CURRENT
                  </strong>

                  <strong>
                    AFFAIRS
                  </strong>

                </div>

              </div>

            </div>


            {/* =============================================
                DATE / DAY BAR
                ============================================= */}

            <div className="current-affairs-date-bar">

              <div className="ca-date-left">

                <div className="ca-date-icon">

                  <CalendarDays
                    size={18}
                  />

                </div>


                <div>

                  <span>
                    आज की तारीख
                  </span>

                  <strong>
                    {getTodayHindiDate()}
                  </strong>

                </div>

              </div>


              <button
                type="button"
                onClick={() =>
                  showToast(
                    "आज के करंट अफेयर्स अपडेट हो रहे हैं"
                  )
                }
              >

                <RefreshCw
                  size={15}
                />

                अपडेट करें

              </button>

            </div>


            {/* =============================================
                CURRENT AFFAIRS CATEGORY TABS
                ============================================= */}

            <div className="ca-category-tabs-wrapper">

              <div className="ca-category-tabs">

                {[
                  {
                    id: "national",
                    title: "राष्ट्रीय",
                    icon: Flag
                  },
                  {
                    id: "international",
                    title: "अंतरराष्ट्रीय",
                    icon: Globe2
                  },
                  {
                    id: "rajasthan",
                    title: "राजस्थान",
                    icon: Map
                  },
                  {
                    id: "economy",
                    title: "अर्थव्यवस्था",
                    icon: IndianRupee
                  },
                  {
                    id: "science",
                    title: "विज्ञान",
                    icon: FlaskConical
                  },
                  {
                    id: "sports",
                    title: "खेल",
                    icon: Trophy
                  }
                ].map(
                  (tab) => {

                    const CATabIcon =
                      tab.icon;

                    return (

                      <button
                        type="button"
                        key={tab.id}
                        className={
                          currentAffairsTab ===
                          tab.id
                            ? "ca-category-tab active"
                            : "ca-category-tab"
                        }
                        onClick={() =>
                          setCurrentAffairsTab(
                            tab.id
                          )
                        }
                      >

                        <CATabIcon
                          size={16}
                        />

                        <span>
                          {tab.title}
                        </span>

                      </button>

                    );

                  }
                )}

              </div>

            </div>


            {/* =============================================
                CURRENT AFFAIRS MAIN CONTENT
                ============================================= */}

            <div className="current-affairs-content">


              {/* =========================================
                  LEFT — DAILY AFFAIRS
                  ========================================= */}

              <div className="ca-main-column">

                <div className="ca-section-heading">

                  <div>

                    <span>
                      DAILY BRIEFING
                    </span>

                    <h2>
                      आज के महत्वपूर्ण करंट अफेयर्स
                    </h2>

                  </div>


                  <span className="ca-live-badge">

                    <span></span>

                    LIVE

                  </span>

                </div>


                <div className="ca-news-list">

                  {getCurrentAffairsData(
                    currentAffairsTab
                  )
                    .map(
                      (
                        item,
                        index
                      ) => (

                        <article
                          className={
                            index === 0
                              ? "ca-news-card featured"
                              : "ca-news-card"
                          }
                          key={`ca-news-${item.id}`}
                        >

                          <div className="ca-news-number">

                            {String(
                              index + 1
                            ).padStart(
                              2,
                              "0"
                            )}

                          </div>


                          <div className="ca-news-content">

                            <div className="ca-news-meta">

                              <span className="ca-news-category">

                                {item.category ||
                                  "करंट अफेयर्स"}

                              </span>


                              <span>
                                •
                              </span>


                              <span>

                                <Clock3
                                  size={11}
                                />

                                {item.time ||
                                  "आज"}

                              </span>

                            </div>


                            <h3>
                              {item.title}
                            </h3>


                            <p>
                              {item.description}
                            </p>


                            <div className="ca-news-bottom">

                              <span>

                                <BookOpen
                                  size={12}
                                />

                                महत्वपूर्ण तथ्य

                              </span>


                              <button
                                type="button"
                                onClick={() =>
                                  openCurrentAffair(
                                    item
                                  )
                                }
                              >

                                विस्तार से पढ़ें

                                <ArrowRight
                                  size={14}
                                />

                              </button>

                            </div>

                          </div>


                          <div className="ca-news-image">

                            <img
                              src={
                                item.image ||
                                FALLBACK_IMAGE
                              }
                              alt={
                                item.title
                              }
                              loading="lazy"
                              onError={
                                handleImageError
                              }
                            />

                          </div>

                        </article>

                      )
                    )}

                </div>


                {/* =========================================
                    DAILY QUIZ PROMOTION
                    ========================================= */}

                <div className="ca-quiz-banner">

                  <div className="ca-quiz-icon">

                    <Brain
                      size={28}
                    />

                  </div>


                  <div className="ca-quiz-content">

                    <span>
                      DAILY CURRENT AFFAIRS QUIZ
                    </span>

                    <h3>
                      आज के करंट अफेयर्स से कितना याद है?
                    </h3>

                    <p>
                      महत्वपूर्ण घटनाओं पर आधारित क्विज़ देकर अपनी तैयारी जांचें।
                    </p>

                  </div>


                  <button
                    type="button"
                    onClick={() =>
                      navigateTo(
                        "quiz"
                      )
                    }
                  >

                    क्विज़ शुरू करें

                    <ArrowRight
                      size={16}
                    />

                  </button>

                </div>

              </div>


              {/* =========================================
                  RIGHT SIDEBAR
                  ========================================= */}

              <aside className="ca-sidebar">


                {/* =========================================
                    IMPORTANT TODAY
                    ========================================= */}

                <div className="ca-sidebar-card">

                  <div className="ca-sidebar-heading">

                    <div>

                      <span>
                        QUICK REVISION
                      </span>

                      <h3>
                        आज के मुख्य बिंदु
                      </h3>

                    </div>


                    <Zap
                      size={18}
                    />

                  </div>


                  <div className="ca-important-points">

                    {[
                      "राष्ट्रीय स्तर की प्रमुख घटनाएं",
                      "राजस्थान से जुड़े महत्वपूर्ण अपडेट",
                      "नई सरकारी योजनाएं एवं फैसले",
                      "अर्थव्यवस्था से जुड़े प्रमुख आंकड़े",
                      "खेल जगत की महत्वपूर्ण खबरें"
                    ].map(
                      (
                        point,
                        index
                      ) => (

                        <div
                          className="ca-important-point"
                          key={`important-${index}`}
                        >

                          <span>
                            {index + 1}
                          </span>

                          <p>
                            {point}
                          </p>

                        </div>

                      )
                    )}

                  </div>

                </div>


                {/* =========================================
                    CURRENT AFFAIRS STREAK
                    ========================================= */}

                <div className="ca-streak-card">

                  <div className="ca-streak-top">

                    <div className="ca-streak-icon">

                      <Flame
                        size={21}
                      />

                    </div>


                    <div>

                      <span>
                        YOUR STREAK
                      </span>

                      <h3>
                        Daily Reading
                      </h3>

                    </div>

                  </div>


                  <div className="ca-streak-number">

                    <strong>
                      7
                    </strong>

                    <span>
                      दिन
                    </span>

                  </div>


                  <div className="ca-streak-days">

                    {[
                      "M",
                      "T",
                      "W",
                      "T",
                      "F",
                      "S",
                      "S"
                    ].map(
                      (
                        day,
                        index
                      ) => (

                        <span
                          key={`streak-${index}`}
                          className={
                            index <
                            6
                              ? "completed"
                              : ""
                          }
                        >

                          {index <
                          6
                            ? "✓"
                            : day}

                        </span>

                      )
                    )}

                  </div>


                  <p>
                    लगातार करंट अफेयर्स पढ़कर अपनी तैयारी मजबूत करें।
                  </p>

                </div>


                {/* =========================================
                    SAVED AFFAIRS
                    ========================================= */}

                <div className="ca-sidebar-card">

                  <div className="ca-sidebar-heading">

                    <div>

                      <span>
                        MY NOTES
                      </span>

                      <h3>
                        सेव किए गए अपडेट
                      </h3>

                    </div>


                    <Bookmark
                      size={18}
                    />

                  </div>


                  <div className="ca-saved-empty">

                    <div>

                      <Bookmark
                        size={22}
                      />

                    </div>

                    <p>
                      महत्वपूर्ण करंट अफेयर्स को सेव करके बाद में दोबारा पढ़ें।
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        navigateTo(
                          "notes"
                        )
                      }
                    >

                      मेरे नोट्स

                      <ArrowRight
                        size={14}
                      />

                    </button>

                  </div>

                </div>


                {/* =========================================
                    EXAM FOCUS
                    ========================================= */}

                <div className="ca-exam-focus-card">

                  <div className="ca-exam-focus-icon">

                    <GraduationCap
                      size={21}
                    />

                  </div>


                  <span>
                    EXAM FOCUS
                  </span>


                  <h3>
                    प्रतियोगी परीक्षाओं के लिए उपयोगी
                  </h3>


                  <p>
                    RAS, UPSC, SSC, रेलवे और अन्य परीक्षाओं के लिए महत्वपूर्ण करंट अफेयर्स।
                  </p>


                  <button
                    type="button"
                    onClick={() =>
                      navigateTo(
                        "quiz"
                      )
                    }
                  >

                    तैयारी शुरू करें

                    <ArrowRight
                      size={14}
                    />

                  </button>

                </div>

              </aside>

            </div>


            {/* =============================================
                MONTHLY CURRENT AFFAIRS
                ============================================= */}

            <div className="monthly-ca-section">

              <div className="monthly-ca-header">

                <div>

                  <span>
                    ARCHIVE
                  </span>

                  <h2>
                    करंट अफेयर्स आर्काइव
                  </h2>

                  <p>
                    पिछले महीनों के महत्वपूर्ण करंट अफेयर्स पढ़ें।
                  </p>

                </div>


                <Archive
                  size={28}
                />

              </div>


              <div className="monthly-ca-grid">

                {[
                  "सितंबर 2026",
                  "अगस्त 2026",
                  "जुलाई 2026",
                  "जून 2026",
                  "मई 2026",
                  "अप्रैल 2026"
                ].map(
                  (
                    month,
                    index
                  ) => (

                    <button
                      type="button"
                      key={`month-${index}`}
                      onClick={() =>
                        showToast(
                          `${month} का करंट अफेयर्स जल्द उपलब्ध होगा`
                        )
                      }
                    >

                      <div className="monthly-ca-icon">

                        <CalendarDays
                          size={17}
                        />

                      </div>


                      <div>

                        <strong>
                          {month}
                        </strong>

                        <span>
                          करंट अफेयर्स
                        </span>

                      </div>


                      <ChevronRight
                        size={16}
                      />

                    </button>

                  )
                )}

              </div>

            </div>

          </section>

        )}


      {/* ===================================================
          CURRENT AFFAIR DETAIL MODAL
        =================================================== */}

      {selectedCurrentAffair && (

        <div
          className="modal-overlay ca-detail-overlay"
          role="dialog"
          aria-modal="true"
          onMouseDown={(event) => {

            if (
              event.target ===
              event.currentTarget
            ) {

              setSelectedCurrentAffair(
                null
              );

            }

          }}
        >

          <div className="ca-detail-modal">


            {/* HEADER */}

            <div className="ca-detail-header">

              <div>

                <span>
                  CURRENT AFFAIRS
                </span>

                <h2>
                  महत्वपूर्ण अपडेट
                </h2>

              </div>


              <button
                type="button"
                className="modal-close-button"
                onClick={() =>
                  setSelectedCurrentAffair(
                    null
                  )
                }
              >

                <X
                  size={20}
                />

              </button>

            </div>


            {/* IMAGE */}

            <div className="ca-detail-image">

              <img
                src={
                  selectedCurrentAffair.image ||
                  FALLBACK_IMAGE
                }
                alt={
                  selectedCurrentAffair.title
                }
                onError={
                  handleImageError
                }
              />

            </div>


            {/* CONTENT */}

            <div className="ca-detail-body">

              <div className="ca-detail-meta">

                <span>

                  {selectedCurrentAffair.category ||
                    "करंट अफेयर्स"}

                </span>


                <span>
                  •
                </span>


                <span>

                  <Clock3
                    size={12}
                  />

                  {selectedCurrentAffair.time ||
                    "आज"}

                </span>

              </div>


              <h2>
                {selectedCurrentAffair.title}
              </h2>


              <p>
                {selectedCurrentAffair.description}
              </p>


              <div className="ca-detail-fact-box">

                <div className="ca-detail-fact-icon">

                  <Lightbulb
                    size={20}
                  />

                </div>


                <div>

                  <span>
                    IMPORTANT FACT
                  </span>

                  <p>
                    इस घटना से संबंधित महत्वपूर्ण जानकारी को परीक्षा की दृष्टि से जरूर याद रखें।
                  </p>

                </div>

              </div>


              <div className="ca-detail-actions">

                <button
                  type="button"
                  onClick={() => {

                    showToast(
                      "करंट अफेयर सेव कर दिया गया"
                    );

                  }}
                >

                  <Bookmark
                    size={16}
                  />

                  सेव करें

                </button>


                <button
                  type="button"
                  onClick={() => {

                    shareNews(
                      selectedCurrentAffair
                    );

                  }}
                >

                  <Share2
                    size={16}
                  />

                  शेयर करें

                </button>

              </div>

            </div>

          </div>

        </div>

      )}


      {/* ===================================================
          PART 9 END
          =================================================== */}
        
