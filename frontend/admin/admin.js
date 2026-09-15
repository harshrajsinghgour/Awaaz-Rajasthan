"use strict";

/* =========================================================
   AAWAZ RAJASTHAN
   ADMIN PANEL JAVASCRIPT
   =========================================================

   Frontend:
   /frontend/admin/admin.js

   Backend:
   http://localhost:5000/api

   Admin API:
   /api/admin

   Main responsibilities:
   - Admin / Owner Login
   - Session Restore
   - Admin Authentication
   - Permission Handling
   - Dashboard
   - News Management UI
   - Admin Management
   - Profile Management
   - Password Change
   - Logout
   - Navigation
   - Search
   - Pagination
   - Modal
   - Confirmation Dialog
   - Toast Notifications
   - Loading States
   - Live TV / Live Blog / ePaper status
   - Site settings UI
   ========================================================= */


/* =========================================================
   GLOBAL CONFIGURATION
   ========================================================= */

const ADMIN_API_BASE_URL = (
  window.AAWAZ_API_URL ||
  "http://localhost:5000/api"
).replace(/\/$/, "");


/* ---------------------------------------------------------
   API ROOT
   --------------------------------------------------------- */

const ADMIN_API_ROOT =
  ADMIN_API_BASE_URL.replace(/\/api$/, "");


/* ---------------------------------------------------------
   Storage Keys
   --------------------------------------------------------- */

const ADMIN_TOKEN_KEY =
  "aawaz_admin_token";

const ADMIN_DATA_KEY =
  "aawaz_admin_data";


/* =========================================================
   GLOBAL ADMIN STATE
   ========================================================= */

const adminState = {

  /* -----------------------------------------
     Authentication
     ----------------------------------------- */

  token:
    localStorage.getItem(
      ADMIN_TOKEN_KEY
    ) || "",

  admin:
    null,


  /* -----------------------------------------
     Dashboard
     ----------------------------------------- */

  dashboard: {

    totalNews: 0,

    publishedNews: 0,

    draftNews: 0,

    contacts: 0

  },


  /* -----------------------------------------
     News
     ----------------------------------------- */

  news: [],

  selectedNews: new Set(),

  newsPage: 1,

  newsLimit: 10,

  newsTotal: 0,

  newsTotalPages: 1,

  newsSearch: "",

  newsCategory: "",

  newsStatus: "",

  newsSort: "latest",


  /* -----------------------------------------
     Admins
     ----------------------------------------- */

  admins: [],

  adminsPage: 1,

  adminsLimit: 10,

  adminsTotal: 0,

  adminsTotalPages: 1,

  adminsSearch: "",

  adminsRole: "",

  adminsStatus: "",


  /* -----------------------------------------
     Contacts
     ----------------------------------------- */

  contacts: [],

  contactsPage: 1,

  contactsLimit: 10,


  /* -----------------------------------------
     Users
     ----------------------------------------- */

  users: [],

  usersPage: 1,

  usersLimit: 10,


  /* -----------------------------------------
     Trending
     ----------------------------------------- */

  trending: [],

  trendingSearch: "",


  /* -----------------------------------------
     Current Section
     ----------------------------------------- */

  currentSection:
    "dashboard",


  /* -----------------------------------------
     Loading
     ----------------------------------------- */

  loading: false,


  /* -----------------------------------------
     Initialization
     ----------------------------------------- */

  initialized: false

};


/* =========================================================
   PERMISSIONS
   ========================================================= */

const ADMIN_PERMISSIONS = [

  "news.create",

  "news.edit",

  "news.delete",

  "news.publish",

  "breaking.manage",

  "trending.manage",

  "video.manage",

  "live-tv.manage",

  "live-blog.manage",

  "epaper.manage",

  "contact.manage",

  "users.manage",

  "site.settings",

  "admin.manage"

];


/* =========================================================
   CATEGORY LIST
   ========================================================= */

const NEWS_CATEGORIES = [

  "राजस्थान",

  "जयपुर",

  "जोधपुर",

  "उदयपुर",

  "कोटा",

  "अजमेर",

  "बीकानेर",

  "अलवर",

  "भरतपुर",

  "सीकर",

  "शिक्षा",

  "राजनीति",

  "अपराध",

  "खेल",

  "मनोरंजन",

  "बिजनेस",

  "स्वास्थ्य",

  "मौसम",

  "अन्य"

];


/* =========================================================
   DOM READY
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  async () => {

    try {

      initializeAdminPanel();

      await restoreAdminSession();

    } catch (error) {

      console.error(
        "Admin initialization error:",
        error
      );

      showAdminToast(
        "Admin Panel initialize नहीं हो पाया।",
        "error"
      );

    }

  }
);


/* =========================================================
   INITIALIZE ADMIN PANEL
   ========================================================= */

function initializeAdminPanel() {

  if (
    adminState.initialized
  ) {
    return;
  }

  adminState.initialized = true;


  /* -----------------------------------------
     Login
     ----------------------------------------- */

  initializeLogin();


  /* -----------------------------------------
     Navigation
     ----------------------------------------- */

  initializeNavigation();


  /* -----------------------------------------
     Header
     ----------------------------------------- */

  initializeHeader();


  /* -----------------------------------------
     Sidebar
     ----------------------------------------- */

  initializeSidebar();


  /* -----------------------------------------
     Modal
     ----------------------------------------- */

  initializeModal();


  /* -----------------------------------------
     Confirmation
     ----------------------------------------- */

  initializeConfirmation();


  /* -----------------------------------------
     Password Controls
     ----------------------------------------- */

  initializePasswordControls();


  /* -----------------------------------------
     News
     ----------------------------------------- */

  initializeNewsControls();


  /* -----------------------------------------
     Admin Management
     ----------------------------------------- */

  initializeAdminControls();


  /* -----------------------------------------
     Profile
     ----------------------------------------- */

  initializeProfileControls();


  /* -----------------------------------------
     Dashboard
     ----------------------------------------- */

  initializeDashboardControls();


  /* -----------------------------------------
     Other Sections
     ----------------------------------------- */

  initializeOtherSections();


  /* -----------------------------------------
     Footer
     ----------------------------------------- */

  initializeFooter();


  /* -----------------------------------------
     Keyboard
     ----------------------------------------- */

  initializeKeyboardShortcuts();


  /* -----------------------------------------
     Login Year
     ----------------------------------------- */

  const loginYear =
    document.getElementById(
      "admin-login-year"
    );

  if (loginYear) {

    loginYear.textContent =
      new Date().getFullYear();

  }

}


/* =========================================================
   STORAGE HELPERS
   ========================================================= */

function saveAdminSession(
  token,
  admin
) {

  if (token) {

    localStorage.setItem(
      ADMIN_TOKEN_KEY,
      token
    );

    adminState.token =
      token;

  }

  if (admin) {

    localStorage.setItem(
      ADMIN_DATA_KEY,
      JSON.stringify(admin)
    );

    adminState.admin =
      admin;

  }

}


/* ---------------------------------------------------------
   Clear Admin Session
   --------------------------------------------------------- */

function clearAdminSession() {

  localStorage.removeItem(
    ADMIN_TOKEN_KEY
  );

  localStorage.removeItem(
    ADMIN_DATA_KEY
  );

  adminState.token = "";

  adminState.admin = null;

}


/* ---------------------------------------------------------
   Get Stored Admin
   --------------------------------------------------------- */

function getStoredAdmin() {

  try {

    const data =
      localStorage.getItem(
        ADMIN_DATA_KEY
      );

    if (!data) {
      return null;
    }

    return JSON.parse(data);

  } catch (error) {

    console.warn(
      "Stored admin data invalid:",
      error
    );

    return null;

  }

}


/* =========================================================
   API REQUEST HELPER
   ========================================================= */

async function adminApiRequest(
  endpoint,
  options = {}
) {

  const requestOptions = {
    ...options
  };


  /* -----------------------------------------
     Headers
     ----------------------------------------- */

  const headers =
    new Headers(
      options.headers || {}
    );


  /* -----------------------------------------
     JSON Content-Type
     ----------------------------------------- */

  if (
    options.body &&
    !(options.body instanceof FormData)
  ) {

    headers.set(
      "Content-Type",
      "application/json"
    );

  }


  /* -----------------------------------------
     Admin Authorization
     ----------------------------------------- */

  const token =
    adminState.token ||
    localStorage.getItem(
      ADMIN_TOKEN_KEY
    );


  if (token) {

    headers.set(
      "Authorization",
      `Bearer ${token}`
    );

  }


  requestOptions.headers =
    headers;


  /* -----------------------------------------
     Fetch
     ----------------------------------------- */

  let response;

  try {

    response =
      await fetch(
        `${ADMIN_API_BASE_URL}${endpoint}`,
        requestOptions
      );

  } catch (error) {

    const networkError =
      new Error(
        "Backend server से connection नहीं हो पाया।"
      );

    networkError.originalError =
      error;

    throw networkError;

  }


  /* -----------------------------------------
     Response
     ----------------------------------------- */

  let data = {};

  const contentType =
    response.headers.get(
      "content-type"
    ) || "";


  if (
    contentType.includes(
      "application/json"
    )
  ) {

    try {

      data =
        await response.json();

    } catch (error) {

      data = {};

    }

  } else {

    try {

      const text =
        await response.text();

      data = {
        success:
          response.ok,

        message:
          text || ""
      };

    } catch (error) {

      data = {};

    }

  }


  /* -----------------------------------------
     HTTP Error
     ----------------------------------------- */

  if (!response.ok) {

    const error =
      new Error(
        data.message ||
        `Request failed (${response.status})`
      );


    error.status =
      response.status;


    error.data =
      data;


    /* ---------------------------------------
       Unauthorized
       --------------------------------------- */

    if (
      response.status === 401
    ) {

      handleAdminUnauthorized();

    }


    throw error;

  }


  return data;

}


/* =========================================================
   ADMIN UNAUTHORIZED HANDLER
   ========================================================= */

function handleAdminUnauthorized() {

  clearAdminSession();

  showAdminLoginScreen();

  showAdminLoginError(
    "आपका Admin session समाप्त हो गया है। कृपया दोबारा login करें।"
  );

}


/* =========================================================
   RESTORE ADMIN SESSION
   ========================================================= */

async function restoreAdminSession() {

  const token =
    localStorage.getItem(
      ADMIN_TOKEN_KEY
    );


  if (!token) {

    showAdminLoginScreen();

    return;

  }


  adminState.token =
    token;


  const storedAdmin =
    getStoredAdmin();


  if (storedAdmin) {

    adminState.admin =
      storedAdmin;

    updateAdminUI(
      storedAdmin
    );

  }


  try {

    showAdminLoading(
      "Session verify हो रहा है...",
      "Admin account की जानकारी check की जा रही है।"
    );


    const data =
      await adminApiRequest(
        "/admin/me"
      );


    if (
      data &&
      data.success &&
      data.admin
    ) {

      saveAdminSession(
        token,
        data.admin
      );


      updateAdminUI(
        data.admin
      );


      showAdminPanel();

      await loadDashboard();

    } else {

      throw new Error(
        data.message ||
        "Admin session invalid है।"
      );

    }

  } catch (error) {

    console.warn(
      "Admin session restore failed:",
      error.message
    );

    clearAdminSession();

    showAdminLoginScreen();

  } finally {

    hideAdminLoading();

  }

}


/* =========================================================
   LOGIN INITIALIZATION
   ========================================================= */

function initializeLogin() {

  const form =
    document.getElementById(
      "admin-login-form"
    );


  if (form) {

    form.addEventListener(
      "submit",
      handleAdminLogin
    );

  }


  const passwordToggle =
    document.getElementById(
      "toggle-login-password"
    );


  if (
    passwordToggle
  ) {

    passwordToggle.addEventListener(
      "click",
      () => {

        togglePassword(
          "admin-login-password",
          passwordToggle
        );

      }
    );

  }

}


/* =========================================================
   ADMIN LOGIN
   POST /api/admin/login
   ========================================================= */

async function handleAdminLogin(
  event
) {

  event.preventDefault();


  const form =
    event.currentTarget;


  const loginInput =
    document.getElementById(
      "admin-login-id"
    );


  const passwordInput =
    document.getElementById(
      "admin-login-password"
    );


  const loginButton =
    document.getElementById(
      "admin-login-button"
    );


  const loginValue =
    loginInput
      ? loginInput.value.trim()
      : "";


  const password =
    passwordInput
      ? passwordInput.value
      : "";


  hideAdminLoginError();


  if (!loginValue) {

    showAdminLoginError(
      "Admin ID या Email दर्ज करें।"
    );

    if (loginInput) {
      loginInput.focus();
    }

    return;

  }


  if (!password) {

    showAdminLoginError(
      "Password दर्ज करें।"
    );

    if (passwordInput) {
      passwordInput.focus();
    }

    return;

  }


  setButtonLoading(
    loginButton,
    true,
    "Login हो रहा है..."
  );


  try {

    const body = {

      adminId:
        loginValue,

      password:
        password

    };


    const data =
      await adminApiRequest(
        "/admin/login",
        {
          method: "POST",

          body:
            JSON.stringify(body)

        }
      );


    if (
      !data ||
      !data.success ||
      !data.token ||
      !data.admin
    ) {

      throw new Error(
        data?.message ||
        "Admin login failed."
      );

    }


    /* ---------------------------------------
       Save Session
       --------------------------------------- */

    saveAdminSession(
      data.token,
      data.admin
    );


    /* ---------------------------------------
       Update UI
       --------------------------------------- */

    updateAdminUI(
      data.admin
    );


    showAdminPanel();


    /* ---------------------------------------
       Dashboard Load
       --------------------------------------- */

    await loadDashboard();


    showAdminToast(
      `स्वागत है, ${data.admin.name || "Admin"}!`,
      "success"
    );


    /* ---------------------------------------
       Reset Form
       --------------------------------------- */

    if (passwordInput) {
      passwordInput.value = "";
    }

  } catch (error) {

    console.error(
      "Admin login error:",
      error
    );


    showAdminLoginError(
      error.message ||
      "Login नहीं हो पाया।"
    );

  } finally {

    setButtonLoading(
      loginButton,
      false,
      "Admin Login"
    );

  }

}


/* =========================================================
   LOGIN SCREEN
   ========================================================= */

function showAdminLoginScreen() {

  const loginScreen =
    document.getElementById(
      "admin-login-screen"
    );


  const adminPanel =
    document.getElementById(
      "admin-panel"
    );


  if (loginScreen) {

    loginScreen.hidden =
      false;

    loginScreen.style.display =
      "";

  }


  if (adminPanel) {

    adminPanel.hidden =
      true;

    adminPanel.style.display =
      "none";

  }

}


/* =========================================================
   ADMIN PANEL SCREEN
   ========================================================= */

function showAdminPanel() {

  const loginScreen =
    document.getElementById(
      "admin-login-screen"
    );


  const adminPanel =
    document.getElementById(
      "admin-panel"
    );


  if (loginScreen) {

    loginScreen.hidden =
      true;

    loginScreen.style.display =
      "none";

  }


  if (adminPanel) {

    adminPanel.hidden =
      false;

    adminPanel.style.display =
      "";

  }

}


/* =========================================================
   LOGIN ERROR
   ========================================================= */

function showAdminLoginError(
  message
) {

  const element =
    document.getElementById(
      "admin-login-error"
    );


  if (!element) {
    return;
  }


  element.textContent =
    message || "Login error";


  element.hidden =
    false;


  element.setAttribute(
    "aria-hidden",
    "false"
  );

}


/* ---------------------------------------------------------
   Hide Login Error
   --------------------------------------------------------- */

function hideAdminLoginError() {

  const element =
    document.getElementById(
      "admin-login-error"
    );


  if (!element) {
    return;
  }


  element.hidden =
    true;


  element.textContent =
    "";

}


/* =========================================================
   UPDATE ADMIN UI
   ========================================================= */

function updateAdminUI(
  admin
) {

  if (!admin) {
    return;
  }


  adminState.admin =
    admin;


  /* -----------------------------------------
     Name
     ----------------------------------------- */

  setText(
    "#sidebar-admin-name",
    admin.name || "Admin"
  );


  setText(
    "#header-admin-name",
    admin.name || "Admin"
  );


  setText(
    "#dashboard-admin-name",
    admin.name || "Admin"
  );


  setText(
    "#profile-name",
    admin.name || "Admin"
  );


  /* -----------------------------------------
     Email
     ----------------------------------------- */

  setText(
    "#profile-email",
    admin.email || "-"
  );


  /* -----------------------------------------
     Role
     ----------------------------------------- */

  const role =
    String(
      admin.role || "admin"
    ).toUpperCase();


  setText(
    "#sidebar-admin-role",
    role
  );


  setText(
    "#header-admin-role",
    role
  );


  setText(
    "#profile-role",
    role
  );


  /* -----------------------------------------
     Admin ID
     ----------------------------------------- */

  setText(
    "#profile-admin-id",
    admin.adminId || "-"
  );


  /* -----------------------------------------
     Status
     ----------------------------------------- */

  const statusElement =
    document.getElementById(
      "profile-account-status"
    );


  if (statusElement) {

    statusElement.textContent =
      admin.active
        ? "Active"
        : "Inactive";


    statusElement.classList.toggle(
      "text-success",
      Boolean(admin.active)
    );

  }


  /* -----------------------------------------
     Last Login
     ----------------------------------------- */

  setText(
    "#profile-last-login",
    formatAdminDate(
      admin.lastLoginAt
    )
  );


  /* -----------------------------------------
     Created
     ----------------------------------------- */

  setText(
    "#profile-created-at",
    formatAdminDate(
      admin.createdAt
    )
  );


  /* -----------------------------------------
     Avatar
     ----------------------------------------- */

  const initials =
    getInitials(
      admin.name ||
      admin.adminId ||
      "AR"
    );


  setText(
    "#sidebar-admin-avatar-text",
    initials
  );


  setText(
    "#header-admin-avatar",
    initials
  );


  setText(
    "#profile-avatar",
    initials
  );


  /* -----------------------------------------
     Owner / Admin UI
     ----------------------------------------- */

  applyRoleBasedUI(
    admin
  );

}


/* =========================================================
   ROLE BASED UI
   ========================================================= */

function applyRoleBasedUI(
  admin
) {

  if (!admin) {
    return;
  }


  const isOwner =
    admin.role === "owner";


  const permissions =
    Array.isArray(
      admin.permissions
    )
      ? admin.permissions
      : [];


  document
    .querySelectorAll(
      "[data-required-permission]"
    )
    .forEach(element => {

      const required =
        element.getAttribute(
          "data-required-permission"
        );


      const allowed =
        isOwner ||
        permissions.includes(
          required
        );


      element.hidden =
        !allowed;

    });


  /* -----------------------------------------
     Admin Management
     Owner only
     ----------------------------------------- */

  const adminSection =
    document.getElementById(
      "section-admins"
    );


  if (adminSection) {

    adminSection.dataset.ownerOnly =
      isOwner
        ? "true"
        : "false";

  }

}


/* =========================================================
   PART 1/20 END
   ========================================================= */
/* =========================================================
   NAVIGATION SYSTEM
   ========================================================= */

function initializeNavigation() {

  const navigationItems =
    document.querySelectorAll(
      "[data-section]"
    );


  navigationItems.forEach(
    item => {

      item.addEventListener(
        "click",
        event => {

          event.preventDefault();

          const section =
            item.getAttribute(
              "data-section"
            );


          if (!section) {
            return;
          }


          const permission =
            item.getAttribute(
              "data-permission"
            );


          if (
            permission &&
            !hasAdminPermission(
              permission
            )
          ) {

            showAdminToast(
              "आपके Admin account को इस section की permission नहीं है।",
              "warning"
            );

            return;

          }


          switchAdminSection(
            section
          );

        }
      );

    }
  );

}


/* =========================================================
   SWITCH ADMIN SECTION
   ========================================================= */

function switchAdminSection(
  sectionName
) {

  if (!sectionName) {
    return;
  }


  const section =
    document.querySelector(
      `[data-section-content="${sectionName}"]`
    );


  if (!section) {

    console.warn(
      `Admin section not found: ${sectionName}`
    );

    return;

  }


  /* -----------------------------------------
     Hide all sections
     ----------------------------------------- */

  document
    .querySelectorAll(
      "[data-section-content]"
    )
    .forEach(
      sectionElement => {

        sectionElement.classList.remove(
          "active"
        );

        sectionElement.hidden =
          true;

      }
    );


  /* -----------------------------------------
     Show selected section
     ----------------------------------------- */

  section.classList.add(
    "active"
  );

  section.hidden =
    false;


  /* -----------------------------------------
     Update navigation
     ----------------------------------------- */

  document
    .querySelectorAll(
      "[data-section]"
    )
    .forEach(
      navigationItem => {

        const target =
          navigationItem.getAttribute(
            "data-section"
          );


        navigationItem.classList.toggle(
          "active",
          target === sectionName
        );

        navigationItem.setAttribute(
          "aria-current",
          target === sectionName
            ? "page"
            : "false"
        );

      }
    );


  /* -----------------------------------------
     Update state
     ----------------------------------------- */

  adminState.currentSection =
    sectionName;


  /* -----------------------------------------
     Page information
     ----------------------------------------- */

  updateAdminPageHeading(
    sectionName
  );


  /* -----------------------------------------
     Close mobile sidebar
     ----------------------------------------- */

  closeAdminSidebar();


  /* -----------------------------------------
     Load section data
     ----------------------------------------- */

  loadSectionData(
    sectionName
  );


  /* -----------------------------------------
     Scroll to top
     ----------------------------------------- */

  const main =
    document.getElementById(
      "admin-main"
    );


  if (main) {

    main.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  }

}


/* =========================================================
   PAGE TITLES
   ========================================================= */

const ADMIN_SECTION_META = {

  dashboard: {

    title:
      "Dashboard",

    description:
      "राजस्थान न्यूज़ पोर्टल का पूरा overview यहाँ देखें।",

    breadcrumb:
      "Dashboard"

  },


  news: {

    title:
      "News Management",

    description:
      "न्यूज़ बनाएं, edit करें, publish करें और manage करें।",

    breadcrumb:
      "News"

  },


  breaking: {

    title:
      "Breaking News",

    description:
      "Breaking news को manage और publish करें।",

    breadcrumb:
      "Breaking News"

  },


  trending: {

    title:
      "Trending",

    description:
      "Trending news और popular content manage करें।",

    breadcrumb:
      "Trending"

  },


  video: {

    title:
      "Video",

    description:
      "News videos और video content manage करें।",

    breadcrumb:
      "Video"

  },


  "live-tv": {

    title:
      "Live TV",

    description:
      "आवाज राजस्थान LIVE की settings और status manage करें।",

    breadcrumb:
      "Live TV"

  },


  "live-blog": {

    title:
      "Live Blog",

    description:
      "Live Blog updates और coverage manage करें।",

    breadcrumb:
      "Live Blog"

  },


  epaper: {

    title:
      "ePaper",

    description:
      "राजस्थान ePaper files और publication manage करें।",

    breadcrumb:
      "ePaper"

  },


  contacts: {

    title:
      "Contacts",

    description:
      "पाठकों द्वारा भेजे गए contact messages देखें और manage करें।",

    breadcrumb:
      "Contacts"

  },


  users: {

    title:
      "Users",

    description:
      "Website users और उनके accounts manage करें।",

    breadcrumb:
      "Users"

  },


  admins: {

    title:
      "Admin Management",

    description:
      "Admin accounts, roles और permissions manage करें।",

    breadcrumb:
      "Admins"

  },


  settings: {

    title:
      "Site Settings",

    description:
      "Website की मुख्य settings और configuration manage करें।",

    breadcrumb:
      "Settings"

  },


  profile: {

    title:
      "My Profile",

    description:
      "अपने Admin profile और security settings manage करें।",

    breadcrumb:
      "Profile"

  }

};


/* =========================================================
   UPDATE PAGE HEADING
   ========================================================= */

function updateAdminPageHeading(
  sectionName
) {

  const meta =
    ADMIN_SECTION_META[
      sectionName
    ];


  if (!meta) {
    return;
  }


  setText(
    "#admin-page-title",
    meta.title
  );


  setText(
    "#admin-page-description",
    meta.description
  );


  setText(
    "#admin-breadcrumb",
    meta.breadcrumb
  );

}


/* =========================================================
   LOAD SECTION DATA
   ========================================================= */

async function loadSectionData(
  sectionName
) {

  try {

    switch (
      sectionName
    ) {

      case "dashboard":

        await loadDashboard();

        break;


      case "news":

        await loadNews();

        break;


      case "breaking":

        await loadBreakingNews();

        break;


      case "trending":

        await loadTrending();

        break;


      case "video":

        await loadVideos();

        break;


      case "live-tv":

        await loadLiveTV();

        break;


      case "live-blog":

        await loadLiveBlog();

        break;


      case "epaper":

        await loadEPaper();

        break;


      case "contacts":

        await loadContacts();

        break;


      case "users":

        await loadUsers();

        break;


      case "admins":

        await loadAdmins();

        break;


      case "settings":

        await loadSiteSettings();

        break;


      case "profile":

        loadProfile();

        break;


      default:

        break;

    }

  } catch (error) {

    console.error(
      `Failed loading section ${sectionName}:`,
      error
    );


    showAdminToast(
      error.message ||
      "Section data load नहीं हो पाया।",
      "error"
    );

  }

}


/* =========================================================
   SIDEBAR INITIALIZATION
   ========================================================= */

function initializeSidebar() {

  const mobileMenuButton =
    document.getElementById(
      "admin-mobile-menu-button"
    );


  const overlay =
    document.getElementById(
      "admin-sidebar-overlay"
    );


  const sidebar =
    document.getElementById(
      "admin-sidebar"
    );


  if (
    mobileMenuButton
  ) {

    mobileMenuButton.addEventListener(
      "click",
      event => {

        event.preventDefault();

        toggleAdminSidebar();

      }
    );

  }


  if (overlay) {

    overlay.addEventListener(
      "click",
      () => {

        closeAdminSidebar();

      }
    );

  }


  if (sidebar) {

    sidebar.addEventListener(
      "click",
      event => {

        const link =
          event.target.closest(
            "[data-section]"
          );


        if (
          link &&
          window.innerWidth <= 900
        ) {

          closeAdminSidebar();

        }

      }
    );

  }


  document.addEventListener(
    "keydown",
    event => {

      if (
        event.key === "Escape"
      ) {

        closeAdminSidebar();

      }

    }
  );

}


/* =========================================================
   TOGGLE SIDEBAR
   ========================================================= */

function toggleAdminSidebar() {

  const sidebar =
    document.getElementById(
      "admin-sidebar"
    );


  const overlay =
    document.getElementById(
      "admin-sidebar-overlay"
    );


  if (!sidebar) {
    return;
  }


  const isOpen =
    sidebar.classList.contains(
      "open"
    );


  if (isOpen) {

    closeAdminSidebar();

  } else {

    openAdminSidebar();

  }

}


/* =========================================================
   OPEN SIDEBAR
   ========================================================= */

function openAdminSidebar() {

  const sidebar =
    document.getElementById(
      "admin-sidebar"
    );


  const overlay =
    document.getElementById(
      "admin-sidebar-overlay"
    );


  if (sidebar) {

    sidebar.classList.add(
      "open"
    );

  }


  if (overlay) {

    overlay.classList.add(
      "active"
    );

  }


  document.body.classList.add(
    "admin-sidebar-open"
  );

}


/* =========================================================
   CLOSE SIDEBAR
   ========================================================= */

function closeAdminSidebar() {

  const sidebar =
    document.getElementById(
      "admin-sidebar"
    );


  const overlay =
    document.getElementById(
      "admin-sidebar-overlay"
    );


  if (sidebar) {

    sidebar.classList.remove(
      "open"
    );

  }


  if (overlay) {

    overlay.classList.remove(
      "active"
    );

  }


  document.body.classList.remove(
    "admin-sidebar-open"
  );

}


/* =========================================================
   HEADER INITIALIZATION
   ========================================================= */

function initializeHeader() {

  const profileButton =
    document.getElementById(
      "admin-header-profile-button"
    );


  const notificationButton =
    document.getElementById(
      "admin-notification-button"
    );


  if (profileButton) {

    profileButton.addEventListener(
      "click",
      event => {

        event.preventDefault();

        switchAdminSection(
          "profile"
        );

      }
    );

  }


  if (
    notificationButton
  ) {

    notificationButton.addEventListener(
      "click",
      event => {

        event.preventDefault();

        showAdminNotifications();

      }
    );

  }

}


/* =========================================================
   NOTIFICATION SYSTEM
   ========================================================= */

function showAdminNotifications() {

  const badge =
    document.getElementById(
      "admin-notification-badge"
    );


  if (badge) {

    badge.hidden =
      true;

  }


  showAdminModal({

    eyebrow:
      "Notifications",

    title:
      "Admin Notifications",

    icon:
      "🔔",

    body: `

      <div class="admin-notification-list">

        <div class="admin-notification-item">

          <strong>
            Admin Panel
          </strong>

          <p>
            आपका Admin session सुरक्षित रूप से active है।
          </p>

        </div>

        <div class="admin-notification-item">

          <strong>
            News Management
          </strong>

          <p>
            Dashboard से नई खबरें manage की जा सकती हैं।
          </p>

        </div>

      </div>

    `,

    showCancel:
      false,

    confirmText:
      "ठीक है"

  });

}


/* =========================================================
   MODAL INITIALIZATION
   ========================================================= */

function initializeModal() {

  const modal =
    document.getElementById(
      "admin-modal"
    );


  const closeButton =
    document.getElementById(
      "admin-modal-close"
    );


  const cancelButton =
    document.getElementById(
      "admin-modal-cancel"
    );


  if (closeButton) {

    closeButton.addEventListener(
      "click",
      () => {

        closeAdminModal();

      }
    );

  }


  if (cancelButton) {

    cancelButton.addEventListener(
      "click",
      () => {

        closeAdminModal();

      }
    );

  }


  if (modal) {

    modal.addEventListener(
      "click",
      event => {

        if (
          event.target === modal
        ) {

          closeAdminModal();

        }

      }
    );

  }

}


/* =========================================================
   SHOW ADMIN MODAL
   ========================================================= */

function showAdminModal(
  options = {}
) {

  const modal =
    document.getElementById(
      "admin-modal"
    );


  if (!modal) {
    return;
  }


  const icon =
    document.getElementById(
      "admin-modal-icon"
    );


  const eyebrow =
    document.getElementById(
      "admin-modal-eyebrow"
    );


  const title =
    document.getElementById(
      "admin-modal-title"
    );


  const body =
    document.getElementById(
      "admin-modal-body"
    );


  const footer =
    document.getElementById(
      "admin-modal-footer"
    );


  const cancelButton =
    document.getElementById(
      "admin-modal-cancel"
    );


  const confirmButton =
    document.getElementById(
      "admin-modal-confirm"
    );


  if (icon) {

    icon.textContent =
      options.icon || "ℹ️";

  }


  if (eyebrow) {

    eyebrow.textContent =
      options.eyebrow || "Admin";

  }


  if (title) {

    title.textContent =
      options.title || "Information";

  }


  if (body) {

    if (
      options.html !== undefined
    ) {

      body.innerHTML =
        options.html;

    } else {

      body.textContent =
        options.body || "";

    }

  }


  if (cancelButton) {

    cancelButton.hidden =
      options.showCancel === false;

    cancelButton.textContent =
      options.cancelText ||
      "Cancel";

  }


  if (confirmButton) {

    confirmButton.hidden =
      options.showConfirm === false;

    confirmButton.textContent =
      options.confirmText ||
      "Confirm";

  }


  if (footer) {

    footer.hidden =
      options.hideFooter === true;

  }


  modal.hidden =
    false;


  modal.classList.add(
    "active"
  );


  document.body.classList.add(
    "admin-modal-open"
  );


  /* -----------------------------------------
     Confirm callback
     ----------------------------------------- */

  if (confirmButton) {

    confirmButton.onclick =
      async () => {

        if (
          typeof options.onConfirm !==
          "function"
        ) {

          closeAdminModal();

          return;

        }


        try {

          setButtonLoading(
            confirmButton,
            true,
            "Processing..."
          );


          await options.onConfirm();

        } catch (error) {

          console.error(
            "Modal confirmation error:",
            error
          );


          showAdminToast(
            error.message ||
            "Action complete नहीं हुआ।",
            "error"
          );

        } finally {

          setButtonLoading(
            confirmButton,
            false,
            options.confirmText ||
            "Confirm"
          );

        }

      };

  }


  /* -----------------------------------------
     Focus
     ----------------------------------------- */

  if (confirmButton &&
      !confirmButton.hidden) {

    setTimeout(
      () => {

        confirmButton.focus();

      },
      50
    );

  }

}


/* =========================================================
   CLOSE ADMIN MODAL
   ========================================================= */

function closeAdminModal() {

  const modal =
    document.getElementById(
      "admin-modal"
    );


  if (!modal) {
    return;
  }


  modal.classList.remove(
    "active"
  );


  modal.hidden =
    true;


  document.body.classList.remove(
    "admin-modal-open"
  );

}


/* =========================================================
   CONFIRMATION DIALOG INITIALIZATION
   ========================================================= */

function initializeConfirmation() {

  const dialog =
    document.getElementById(
      "admin-confirm-dialog"
    );


  const cancelButton =
    document.getElementById(
      "admin-confirm-cancel"
    );


  if (cancelButton) {

    cancelButton.addEventListener(
      "click",
      () => {

        closeAdminConfirmation();

      }
    );

  }


  if (dialog) {

    dialog.addEventListener(
      "click",
      event => {

        if (
          event.target === dialog
        ) {

          closeAdminConfirmation();

        }

      }
    );

  }

}


/* =========================================================
   CONFIRMATION STATE
   ========================================================= */

let adminConfirmationCallback =
  null;


/* =========================================================
   SHOW CONFIRMATION
   ========================================================= */
function showAdminConfirmation(
  options = {}
) {

  const dialog =
    document.getElementById(
      "admin-confirm-dialog"
    );


  if (!dialog) {

    return new Promise(
      resolve => {

        const confirmed =
          window.confirm(
            options.message ||
            "क्या आप यह action करना चाहते हैं?"
          );

        resolve(
          confirmed
        );

      }
    );

  }


  const icon =
    document.getElementById(
      "admin-confirm-icon"
    );


  const title =
    document.getElementById(
      "admin-confirm-title"
    );


  const message =
    document.getElementById(
      "admin-confirm-message"
    );


  const submitButton =
    document.getElementById(
      "admin-confirm-submit"
    );


  const cancelButton =
    document.getElementById(
      "admin-confirm-cancel"
    );


  if (icon) {

    icon.textContent =
      options.icon ||
      "⚠️";

  }


  if (title) {

    title.textContent =
      options.title ||
      "Confirm Action";

  }


  if (message) {

    message.textContent =
      options.message ||
      "क्या आप यह action करना चाहते हैं?";

  }


  if (submitButton) {

    submitButton.textContent =
      options.confirmText ||
      "Confirm";

  }


  if (cancelButton) {

    cancelButton.textContent =
      options.cancelText ||
      "Cancel";

  }


  dialog.hidden =
    false;


  dialog.classList.add(
    "active"
  );


  document.body.classList.add(
    "admin-confirm-open"
  );


  return new Promise(
    resolve => {

      adminConfirmationCallback =
        resolve;


      if (submitButton) {

        submitButton.onclick =
          async () => {

            try {

              setButtonLoading(
                submitButton,
                true,
                "Processing..."
              );


              if (
                typeof options.onConfirm ===
                "function"
              ) {

                await options.onConfirm();

              }


              resolveAdminConfirmation(
                true
              );

            } catch (error) {

              console.error(
                "Confirmation action error:",
                error
              );


              showAdminToast(
                error.message ||
                "Action complete नहीं हुआ।",
                "error"
              );


              resolveAdminConfirmation(
                false
              );

            } finally {

              setButtonLoading(
                submitButton,
                false,
                options.confirmText ||
                "Confirm"
              );

            }

          };

      }

    }
  );

}


/* =========================================================
   RESOLVE CONFIRMATION
   ========================================================= */

function resolveAdminConfirmation(
  result
) {

  if (
    typeof adminConfirmationCallback ===
    "function"
  ) {

    adminConfirmationCallback(
      result
    );

  }


  adminConfirmationCallback =
    null;


  closeAdminConfirmation();

}

/* =========================================================
   CLOSE CONFIRMATION
   ========================================================= */

function closeAdminConfirmation() {

  const dialog =
    document.getElementById(
      "admin-confirm-dialog"
    );


  if (dialog) {

    dialog.classList.remove(
      "active"
    );

    dialog.hidden =
      true;

  }


  document.body.classList.remove(
    "admin-confirm-open"
  );


  adminConfirmationCallback =
    null;

}


/* =========================================================
   PASSWORD CONTROLS
   ========================================================= */

function initializePasswordControls() {

  const passwordPairs = [

    [
      "admin-login-password",
      "toggle-login-password"
    ],

    [
      "profile-current-password",
      "toggle-current-password"
    ],

    [
      "profile-new-password",
      "toggle-new-password"
    ],

    [
      "profile-confirm-password",
      "toggle-confirm-password"
    ]

  ];


  passwordPairs.forEach(
    pair => {

      const inputId =
        pair[0];

      const toggleId =
        pair[1];


      const toggle =
        document.getElementById(
          toggleId
        );


      if (!toggle) {
        return;
      }


      toggle.addEventListener(
        "click",
        event => {

          event.preventDefault();

          togglePassword(
            inputId,
            toggle
          );

        }
      );

    }
  );

}


/* =========================================================
   TOGGLE PASSWORD
   ========================================================= */

function togglePassword(
  inputId,
  button
) {

  const input =
    document.getElementById(
      inputId
    );


  if (!input) {
    return;
  }


  const isPassword =
    input.type ===
    "password";


  input.type =
    isPassword
      ? "text"
      : "password";


  if (button) {

    button.setAttribute(
      "aria-label",
      isPassword
        ? "Password hide करें"
        : "Password show करें"
    );


    button.setAttribute(
      "title",
      isPassword
        ? "Password hide करें"
        : "Password show करें"
    );


    const icon =
      button.querySelector(
       ("[data-password-icon]")
      );


    if (icon) {

      icon.textContent =
        isPassword
          ? "🙈"
          : "👁️";

    }

  }

}


/* =========================================================
   DASHBOARD QUICK ACTIONS
   ========================================================= */

function initializeDashboardControls() {

  const quickActions =
    document.getElementById(
      "quick-actions"
    );


  if (!quickActions) {
    return;
  }


  quickActions.addEventListener(
    "click",
    event => {

      const actionElement =
        event.target.closest(
          "[data-action]"
        );


      if (!actionElement) {
        return;
      }


      const action =
        actionElement.getAttribute(
          "data-action"
        );


      const permission =
        actionElement.getAttribute(
          "data-permission"
        );


      if (
        permission &&
        !hasAdminPermission(
          permission
        )
      ) {

        showAdminToast(
          "इस action की permission आपके account में नहीं है।",
          "warning"
        );

        return;

      }


      handleAdminAction(
        action
      );

    }
  );

}


/* =========================================================
   ADMIN ACTION ROUTER
   ========================================================= */

function handleAdminAction(
  action
) {

  switch (action) {

    case "create-news":

      switchAdminSection(
        "news"
      );

      setTimeout(
        () => {

          openNewsEditor();

        },
        100
      );

      break;


    case "manage-breaking":

      switchAdminSection(
        "breaking"
      );

      break;


    case "manage-live-tv":

      switchAdminSection(
        "live-tv"
      );

      break;


    case "manage-epaper":

      switchAdminSection(
        "epaper"
      );

      break;


    case "view-all-news":

      switchAdminSection(
        "news"
      );

      break;


    default:

      console.warn(
        `Unknown admin action: ${action}`
      );

      break;

  }

}


/* =========================================================
   FOOTER INITIALIZATION
   ========================================================= */

function initializeFooter() {

  const year =
    document.getElementById(
      "admin-footer-year"
    );


  if (year) {

    year.textContent =
      new Date().getFullYear();

  }

}


/* =========================================================
   KEYBOARD SHORTCUTS
   ========================================================= */

function initializeKeyboardShortcuts() {

  document.addEventListener(
    "keydown",
    event => {

      /* ---------------------------------------
         Ctrl + K
         --------------------------------------- */

      if (
        (event.ctrlKey ||
         event.metaKey) &&
        event.key.toLowerCase() === "k"
      ) {

        event.preventDefault();

        focusAdminSearch();

        return;

      }


      /* ---------------------------------------
         Escape
         --------------------------------------- */

      if (
        event.key === "Escape"
      ) {

        closeAdminModal();

        closeAdminConfirmation();

        closeAdminSidebar();

      }

    }
  );

}


/* =========================================================
   FOCUS ADMIN SEARCH
   ========================================================= */

function focusAdminSearch() {

  const searchInputs = [

    document.getElementById(
      "news-search"
    ),

    document.getElementById(
      "admin-search"
    ),

    document.querySelector(
      "[data-admin-search]"
    )

  ];


  const input =
    searchInputs.find(
      element =>
        element &&
        !element.hidden &&
        element.offsetParent !== null
    );


  if (input) {

    input.focus();

    input.select();

  }

}


/* =========================================================
   LOGOUT
   ========================================================= */

         async function handleAdminLogout() {

  const confirmed =
    await showAdminConfirmation({

      title:
        "Logout",

      message:
        "क्या आप Admin Panel से logout करना चाहते हैं?",

      icon:
        "🚪",

      confirmText:
        "Logout",

      cancelText:
        "Cancel"

    });


  if (!confirmed) {
    return;
  }


  try {

    /* ---------------------------------------
       Backend logout
       --------------------------------------- */

    await adminApiRequest(
      "/admin/logout",
      {
        method: "POST"
      }
    );

  } catch (error) {

    /*
      Backend logout fail होने पर भी
      local session clear करना जरूरी है।
    */

    console.warn(
      "Backend logout request failed:",
      error.message
    );

  } finally {

    clearAdminSession();

    showAdminLoginScreen();

    showAdminToast(
      "आप successfully logout हो गए हैं।",
      "success"
    );

  }

}


/* =========================================================
   LOGOUT BUTTON INITIALIZATION
   ========================================================= */

function initializeLogoutButton() {

  const button =
    document.getElementById(
      "admin-logout-button"
    );


  if (!button) {
    return;
  }


  button.addEventListener(
    "click",
    event => {

      event.preventDefault();

      handleAdminLogout();

    }
  );

}


/* =========================================================
   PROFILE CONTROLS
   ========================================================= */

function initializeProfileControls() {

  const passwordForm =
    document.getElementById(
      "profile-password-form"
    );


  if (passwordForm) {

    passwordForm.addEventListener(
      "submit",
      handlePasswordChange
    );

  }


  const logoutAllButton =
    document.getElementById(
      "logout-all-sessions-button"
    );


  if (logoutAllButton) {

    logoutAllButton.addEventListener(
      "click",
      handleLogoutAllSessions
    );

  }


  initializeLogoutButton();

}


/* =========================================================
   PASSWORD CHANGE
   ========================================================= */

async function handlePasswordChange(
  event
) {

  event.preventDefault();


  const currentPassword =
    document.getElementById(
      "profile-current-password"
    )?.value || "";


  const newPassword =
    document.getElementById(
      "profile-new-password"
    )?.value || "";


  const confirmPassword =
    document.getElementById(
      "profile-confirm-password"
    )?.value || "";


  const submitButton =
    event.submitter ||
    document.querySelector(
      "#profile-password-form button[type='submit']"
    );


  if (!currentPassword) {

    showAdminToast(
      "Current password दर्ज करें।",
      "warning"
    );

    return;

  }


  if (!newPassword) {

    showAdminToast(
      "New password दर्ज करें।",
      "warning"
    );

    return;

  }


  if (
    newPassword.length < 8
  ) {

    showAdminToast(
      "New password कम से कम 8 characters का होना चाहिए।",
      "warning"
    );

    return;

  }


  if (
    newPassword !==
    confirmPassword
  ) {

    showAdminToast(
      "New password और confirm password match नहीं कर रहे हैं।",
      "warning"
    );

    return;

  }


  if (
    currentPassword ===
    newPassword
  ) {

    showAdminToast(
      "New password current password से अलग होना चाहिए।",
      "warning"
    );

    return;

  }


  setButtonLoading(
    submitButton,
    true,
    "Password बदल रहा है..."
  );


  try {

    const data =
      await adminApiRequest(
        "/admin/change-password",
        {
          method: "POST",

          body:
            JSON.stringify({

              currentPassword,

              newPassword

            })

        }
      );


    if (
      !data ||
      data.success !== true
    ) {

      throw new Error(
        data?.message ||
        "Password change failed."
      );

    }


    showAdminToast(
      data.message ||
      "Password successfully बदल दिया गया है।",
      "success"
    );


    event.target.reset();

  } catch (error) {

    console.error(
      "Password change error:",
      error
    );


    showAdminToast(
      error.message ||
      "Password change नहीं हो पाया।",
      "error"
    );

  } finally {

    setButtonLoading(
      submitButton,
      false,
      "Change Password"
    );

  }

}


/* =========================================================
   LOGOUT ALL SESSIONS
   ========================================================= */

async function handleLogoutAllSessions() {

  const confirmed =
    await showAdminConfirmation({

      title:
        "Logout All Sessions",

      message:
        "क्या आप सभी active Admin sessions को logout करना चाहते हैं?",

      icon:
        "🔐",

      confirmText:
        "Logout All",

      cancelText:
        "Cancel"

    });


  if (!confirmed) {
    return;
  }


  try {

    const data =
      await adminApiRequest(
        "/admin/logout-all",
        {
          method: "POST"
        }
      );


    showAdminToast(
      data.message ||
      "सभी sessions logout कर दिए गए हैं।",
      "success"
    );


    clearAdminSession();

    showAdminLoginScreen();

  } catch (error) {

    console.error(
      "Logout all sessions error:",
      error
    );


    showAdminToast(
      error.message ||
      "Sessions logout नहीं हो सके।",
      "error"
    );

  }

}


/* =========================================================
   PROFILE LOAD
   ========================================================= */

function loadProfile() {

  if (
    adminState.admin
  ) {

    updateAdminUI(
      adminState.admin
    );

  }

}


/* =========================================================
   PART 2/20 END
   ========================================================= */
/* =========================================================
   NEWS MANAGEMENT
   ========================================================= */

/* ---------------------------------------------------------
   Initialize News Controls
   --------------------------------------------------------- */

function initializeNewsControls() {

  const refreshButton =
    document.getElementById(
      "news-refresh-button"
    );


  const createButton =
    document.getElementById(
      "create-news-button"
    );


  const searchInput =
    document.getElementById(
      "news-search"
    );


  const categoryFilter =
    document.getElementById(
      "news-category-filter"
    );


  const statusFilter =
    document.getElementById(
      "news-status-filter"
    );


  const sortFilter =
    document.getElementById(
      "news-sort-filter"
    );


  const selectAllCheckbox =
    document.getElementById(
      "news-select-all"
    );


  const selectAllButton =
    document.getElementById(
      "news-select-all-button"
    );


  const previousButton =
    document.getElementById(
      "news-prev-page"
    );


  const nextButton =
    document.getElementById(
      "news-next-page"
    );


  /* -----------------------------------------
     Refresh
     ----------------------------------------- */

  if (refreshButton) {

    refreshButton.addEventListener(
      "click",
      async () => {

        await loadNews();

      }
    );

  }


  /* -----------------------------------------
     Create News
     ----------------------------------------- */

  if (createButton) {

    createButton.addEventListener(
      "click",
      event => {

        event.preventDefault();

        if (
          !hasAdminPermission(
            "news.create"
          )
        ) {

          showAdminToast(
            "News create करने की permission नहीं है।",
            "warning"
          );

          return;

        }


        openNewsEditor();

      }
    );

  }


  /* -----------------------------------------
     Search
     ----------------------------------------- */

  if (searchInput) {

    let searchTimer =
      null;


    searchInput.addEventListener(
      "input",
      () => {

        clearTimeout(
          searchTimer
        );


        adminState.newsSearch =
          searchInput.value.trim();


        searchTimer =
          setTimeout(
            () => {

              adminState.newsPage =
                1;

              loadNews();

            },
            400
          );

      }
    );

  }


  /* -----------------------------------------
     Category Filter
     ----------------------------------------- */

  if (categoryFilter) {

    categoryFilter.addEventListener(
      "change",
      () => {

        adminState.newsCategory =
          categoryFilter.value;


        adminState.newsPage =
          1;


        loadNews();

      }
    );

  }


  /* -----------------------------------------
     Status Filter
     ----------------------------------------- */

  if (statusFilter) {

    statusFilter.addEventListener(
      "change",
      () => {

        adminState.newsStatus =
          statusFilter.value;


        adminState.newsPage =
          1;


        loadNews();

      }
    );

  }


  /* -----------------------------------------
     Sort Filter
     ----------------------------------------- */

  if (sortFilter) {

    sortFilter.addEventListener(
      "change",
      () => {

        adminState.newsSort =
          sortFilter.value;


        adminState.newsPage =
          1;


        loadNews();

      }
    );

  }


  /* -----------------------------------------
     Select All Checkbox
     ----------------------------------------- */

  if (selectAllCheckbox) {

    selectAllCheckbox.addEventListener(
      "change",
      () => {

        toggleSelectAllNews(
          selectAllCheckbox.checked
        );

      }
    );

  }


  /* -----------------------------------------
     Select All Button
     ----------------------------------------- */

  if (selectAllButton) {

    selectAllButton.addEventListener(
      "click",
      event => {

        event.preventDefault();

        const allSelected =
          adminState.news.length > 0 &&
          adminState.news.every(
            news =>
              adminState.selectedNews.has(
                getNewsId(news)
              )
          );


        toggleSelectAllNews(
          !allSelected
        );

      }
    );

  }


  /* -----------------------------------------
     Previous Page
     ----------------------------------------- */

  if (previousButton) {

    previousButton.addEventListener(
      "click",
      () => {

        if (
          adminState.newsPage <= 1
        ) {

          return;

        }


        adminState.newsPage--;

        loadNews();

      }
    );

  }


  /* -----------------------------------------
     Next Page
     ----------------------------------------- */

  if (nextButton) {

    nextButton.addEventListener(
      "click",
      () => {

        if (
          adminState.newsPage >=
          adminState.newsTotalPages
        ) {

          return;

        }


        adminState.newsPage++;

        loadNews();

      }
    );

  }


  /* -----------------------------------------
     Table Row Actions
     ----------------------------------------- */

  const tableBody =
    document.getElementById(
      "news-table-body"
    );


  if (tableBody) {

    tableBody.addEventListener(
      "click",
      handleNewsTableClick
    );


    tableBody.addEventListener(
      "change",
      handleNewsTableChange
    );

  }

}


/* =========================================================
   LOAD NEWS
   GET /api/news
   ========================================================= */

async function loadNews() {

  const tableBody =
    document.getElementById(
      "news-table-body"
    );


  if (!tableBody) {
    return;
  }


  showNewsLoading(
    true
  );


  hideNewsEmptyState();


  try {

    const params =
      new URLSearchParams();


    /* -----------------------------------------
       Pagination
       ----------------------------------------- */

    params.set(
      "page",
      String(
        adminState.newsPage
      )
    );


    params.set(
      "limit",
      String(
        adminState.newsLimit
      )
    );


    /* -----------------------------------------
       Search
       ----------------------------------------- */

    if (
      adminState.newsSearch
    ) {

      params.set(
        "search",
        adminState.newsSearch
      );

    }


    /* -----------------------------------------
       Category
       ----------------------------------------- */

    if (
      adminState.newsCategory
    ) {

      params.set(
        "category",
        adminState.newsCategory
      );

    }


    /* -----------------------------------------
       Status
       ----------------------------------------- */

    if (
      adminState.newsStatus
    ) {

      params.set(
        "status",
        adminState.newsStatus
      );

    }


    /* -----------------------------------------
       Sort
       ----------------------------------------- */

    if (
      adminState.newsSort
    ) {

      params.set(
        "sort",
        adminState.newsSort
      );

    }


    const data =
      await adminApiRequest(
        `/news?${params.toString()}`
      );


    const normalized =
      normalizeNewsResponse(
        data
      );


    adminState.news =
      normalized.items;


    adminState.newsTotal =
      normalized.total;


    adminState.newsTotalPages =
      normalized.totalPages;


    if (
      adminState.newsPage >
      adminState.newsTotalPages
    ) {

      adminState.newsPage =
        adminState.newsTotalPages;


      if (
        adminState.newsPage < 1
      ) {

        adminState.newsPage =
          1;

      }

    }


    renderNewsTable();

    updateNewsPagination();

    updateNewsResultCount();


  } catch (error) {

    console.error(
      "Load news error:",
      error
    );


    tableBody.innerHTML =
      "";


    showAdminToast(
      error.message ||
      "News load नहीं हो पाई।",
      "error"
    );


    showNewsEmptyState(
      "News data load नहीं हो पाया।"
    );

  } finally {

    showNewsLoading(
      false
    );

  }

}


/* =========================================================
   NORMALIZE NEWS RESPONSE
   ========================================================= */

function normalizeNewsResponse(
  data
) {

  let items = [];


  if (
    Array.isArray(data)
  ) {

    items =
      data;

  } else if (
    Array.isArray(
      data?.news
    )
  ) {

    items =
      data.news;

  } else if (
    Array.isArray(
      data?.data
    )
  ) {

    items =
      data.data;

  } else if (
    Array.isArray(
      data?.data?.news
    )
  ) {

    items =
      data.data.news;

  } else if (
    Array.isArray(
      data?.results
    )
  ) {

    items =
      data.results;

  }


  const total =
    Number(
      data?.total ??
      data?.count ??
      data?.pagination?.total ??
      items.length
    );


  const page =
    Number(
      data?.page ??
      data?.pagination?.page ??
      adminState.newsPage
    );


  const limit =
    Number(
      data?.limit ??
      data?.pagination?.limit ??
      adminState.newsLimit
    );


  const totalPages =
    Number(
      data?.totalPages ??
      data?.pagination?.totalPages ??
      Math.max(
        1,
        Math.ceil(
          total /
          Math.max(
            1,
            limit
          )
        )
      )
    );


  adminState.newsPage =
    page;


  return {

    items:
      Array.isArray(items)
        ? items
        : [],

    total:
      Number.isFinite(total)
        ? total
        : items.length,

    totalPages:
      Number.isFinite(totalPages) &&
      totalPages > 0
        ? totalPages
        : 1

  };

}


/* =========================================================
   RENDER NEWS TABLE
   ========================================================= */

function renderNewsTable() {

  const tableBody =
    document.getElementById(
      "news-table-body"
    );


  if (!tableBody) {
    return;
  }


  tableBody.innerHTML =
    "";


  if (
    !adminState.news.length
  ) {

    showNewsEmptyState(
      "कोई News नहीं मिली।"
    );

    updateNewsSelectAllState();

    return;

  }


  hideNewsEmptyState();


  adminState.news.forEach(
    news => {

      const row =
        createNewsTableRow(
          news
        );


      tableBody.appendChild(
        row
      );

    }
  );


  updateNewsSelectAllState();

}


/* =========================================================
   CREATE NEWS TABLE ROW
   ========================================================= */

function createNewsTableRow(
  news
) {

  const row =
    document.createElement(
      "tr"
    );


  const id =
    getNewsId(
      news
    );


  const selected =
    adminState.selectedNews.has(
      id
    );


  const title =
    escapeHTML(
      news.title ||
      "Untitled News"
    );


  const category =
    escapeHTML(
      news.category ||
      "राजस्थान"
    );


  const author =
    escapeHTML(
      news.author ||
      "आवाज राजस्थान ब्यूरो"
    );


  const status =
    getNewsStatus(
      news
    );


  const statusLabel =
    getNewsStatusLabel(
      status
    );


  const statusClass =
    getNewsStatusClass(
      status
    );


  const date =
    formatAdminDate(
      news.publishedAt ||
      news.createdAt ||
      news.updatedAt
    );


  const image =
    news.image ||
    "";


  const safeImage =
    escapeAttribute(
      image
    );


  row.dataset.newsId =
    id;


  row.innerHTML = `

    <td class="checkbox-column">

      <input
        type="checkbox"
        class="news-row-checkbox"
        data-news-id="${escapeAttribute(id)}"
        ${selected ? "checked" : ""}
        aria-label="Select news"
      />

    </td>


    <td>

      <div class="news-table-item">

        ${
          image
            ? `
              <div class="news-table-thumbnail">

                <img
                  src="${safeImage}"
                  alt=""
                  loading="lazy"
                  onerror="this.style.display='none'"
                />

              </div>
            `
            : `
              <div class="news-table-thumbnail news-thumbnail-placeholder">
                📰
              </div>
            `
        }


        <div class="news-table-content">

          <strong
            class="news-table-title"
            title="${escapeAttribute(
              news.title || ""
            )}"
          >
            ${title}
          </strong>


          ${
            news.summary
              ? `
                <span class="news-table-summary">
                  ${escapeHTML(
                    truncateText(
                      news.summary,
                      90
                    )
                  )}
                </span>
              `
              : ""
          }

        </div>

      </div>

    </td>


    <td>

      <span class="category-badge">

        ${category}

      </span>

    </td>


    <td>

      <span class="author-name">

        ${author}

      </span>

    </td>


    <td>

      <span
        class="status-badge ${statusClass}"
      >

        ${statusLabel}

      </span>

    </td>


    <td>

      <time
        datetime="${escapeAttribute(
          news.publishedAt ||
          news.createdAt ||
          ""
        )}"
      >

        ${escapeHTML(date)}

      </time>

    </td>


    <td class="actions-column">

      <div class="table-row-actions">

        <button
          type="button"
          class="table-action-button view-news-action"
          data-news-id="${escapeAttribute(id)}"
          title="View News"
          aria-label="View News"
        >
          👁
        </button>


        ${
          hasAdminPermission(
            "news.edit"
          )
            ? `
              <button
                type="button"
                class="table-action-button edit-news-action"
                data-news-id="${escapeAttribute(id)}"
                title="Edit News"
                aria-label="Edit News"
              >
                ✏️
              </button>
            `
            : ""
        }


        ${
          hasAdminPermission(
            "news.delete"
          )
            ? `
              <button
                type="button"
                class="table-action-button delete-news-action danger"
                data-news-id="${escapeAttribute(id)}"
                title="Delete News"
                aria-label="Delete News"
              >
                🗑
              </button>
            `
            : ""
        }

      </div>

    </td>

  `;


  return row;

}


/* =========================================================
   NEWS TABLE CLICK HANDLER
   ========================================================= */

function handleNewsTableClick(
  event
) {

  const actionButton =
    event.target.closest(
      "[data-news-id]"
    );


  if (!actionButton) {
    return;
  }


  const newsId =
    actionButton.getAttribute(
      "data-news-id"
    );


  if (!newsId) {
    return;
  }


  /* -----------------------------------------
     View
     ----------------------------------------- */

  if (
    actionButton.classList.contains(
      "view-news-action"
    )
  ) {

    viewNews(
      newsId
    );

    return;

  }


  /* -----------------------------------------
     Edit
     ----------------------------------------- */

  if (
    actionButton.classList.contains(
      "edit-news-action"
    )
  ) {

    if (
      !hasAdminPermission(
        "news.edit"
      )
    ) {

      showAdminToast(
        "News edit करने की permission नहीं है।",
        "warning"
      );

      return;

    }


    editNews(
      newsId
    );

    return;

  }


  /* -----------------------------------------
     Delete
     ----------------------------------------- */

  if (
    actionButton.classList.contains(
      "delete-news-action"
    )
  ) {

    if (
      !hasAdminPermission(
        "news.delete"
      )
    ) {

      showAdminToast(
        "News delete करने की permission नहीं है।",
        "warning"
      );

      return;

    }


    deleteNews(
      newsId
    );

    return;

  }

}


/* =========================================================
   NEWS CHECKBOX CHANGE
   ========================================================= */

function handleNewsTableChange(
  event
) {

  const checkbox =
    event.target.closest(
      ".news-row-checkbox"
    );


  if (!checkbox) {
    return;
  }


  const newsId =
    checkbox.getAttribute(
      "data-news-id"
    );


  if (!newsId) {
    return;
  }


  if (
    checkbox.checked
  ) {

    adminState.selectedNews.add(
      newsId
    );

  } else {

    adminState.selectedNews.delete(
      newsId
    );

  }


  updateNewsSelectAllState();

}


/* =========================================================
   SELECT ALL NEWS
   ========================================================= */

function toggleSelectAllNews(
  shouldSelect
) {

  const checkboxes =
    document.querySelectorAll(
      ".news-row-checkbox"
    );


  checkboxes.forEach(
    checkbox => {

      checkbox.checked =
        shouldSelect;


      const newsId =
        checkbox.getAttribute(
          "data-news-id"
        );


      if (!newsId) {
        return;
      }


      if (shouldSelect) {

        adminState.selectedNews.add(
          newsId
        );

      } else {

        adminState.selectedNews.delete(
          newsId
        );

      }

    }
  );


  updateNewsSelectAllState();

}


/* =========================================================
   UPDATE SELECT ALL STATE
   ========================================================= */

function updateNewsSelectAllState() {

  const selectAll =
    document.getElementById(
      "news-select-all"
    );


  const selectAllButton =
    document.getElementById(
      "news-select-all-button"
    );


  const checkboxes =
    document.querySelectorAll(
      ".news-row-checkbox"
    );


  if (
    !selectAll
  ) {

    return;

  }


  const total =
    checkboxes.length;


  const checked =
    Array.from(
      checkboxes
    ).filter(
      checkbox =>
        checkbox.checked
    ).length;


  selectAll.checked =
    total > 0 &&
    checked === total;


  selectAll.indeterminate =
    checked > 0 &&
    checked < total;


  if (
    selectAllButton
  ) {

    selectAllButton.textContent =
      total > 0 &&
      checked === total
        ? "Deselect All"
        : "Select All";

  }

}


/* =========================================================
   UPDATE NEWS PAGINATION
   ========================================================= */
function updateNewsPagination() {

  const info =
    document.getElementById(
      "news-pagination-info"
    );


  const pageNumber =
    document.getElementById(
      "news-page-number"
    );


  const previous =
    document.getElementById(
      "news-prev-page"
    );


  const next =
    document.getElementById(
      "news-next-page"
    );


  const total =
    adminState.newsTotal;


  const page =
    adminState.newsPage;


  const limit =
    adminState.newsLimit;


  const totalPages =
    Math.max(
      1,
      adminState.newsTotalPages
    );


  const from =
    total === 0
      ? 0
      : (
          (page - 1) *
          limit
        ) + 1;


  const to =
    total === 0
      ? 0
      : Math.min(
          page * limit,
          total
        );


  if (info) {

    info.textContent =
      total === 0
        ? "0 results"
        : `${from}-${to} of ${total} results`;

  }


  if (pageNumber) {

    pageNumber.textContent =
      `${page} / ${totalPages}`;

  }


  if (previous) {

    previous.disabled =
      page <= 1;

  }


  if (next) {

    next.disabled =
      page >= totalPages ||
      total === 0;

  }

}


/* =========================================================
   UPDATE NEWS RESULT COUNT
   ========================================================= */

function updateNewsResultCount() {

  const element =
    document.getElementById(
      "news-result-count"
    );


  if (!element) {
    return;
  }


  element.textContent =
    `${adminState.newsTotal} news`;

}


/* =========================================================
   NEWS LOADING STATE
   ========================================================= */

function showNewsLoading(
  isLoading
) {

  const loading =
    document.getElementById(
      "news-loading-state"
    );


  if (loading) {

    loading.hidden =
      !isLoading;

  }


  const table =
    document.getElementById(
      "news-table"
    );


  if (table) {

    table.setAttribute(
      "aria-busy",
      isLoading
        ? "true"
        : "false"
    );

  }

}


/* =========================================================
   NEWS EMPTY STATE
   ========================================================= */

function showNewsEmptyState(
  message
) {

  const empty =
    document.getElementById(
      "news-empty-state"
    );


  if (!empty) {
    return;
  }


  const paragraph =
    empty.querySelector(
      "p"
    );


  if (paragraph) {

    paragraph.textContent =
      message ||
      "कोई News नहीं मिली।";

  }


  empty.hidden =
    false;

}


/* ---------------------------------------------------------
   Hide News Empty State
   --------------------------------------------------------- */

function hideNewsEmptyState() {

  const empty =
    document.getElementById(
      "news-empty-state"
    );


  if (empty) {

    empty.hidden =
      true;

  }

}


/* =========================================================
   GET NEWS ID
   ========================================================= */

function getNewsId(
  news
) {

  if (!news) {
    return "";
  }


  return String(
    news._id ||
    news.id ||
    news.newsId ||
    ""
  );

}


/* =========================================================
   GET NEWS STATUS
   ========================================================= */

function getNewsStatus(
  news
) {

  if (!news) {
    return "draft";
  }


  if (
    news.scheduledAt &&
    new Date(
      news.scheduledAt
    ).getTime() >
    Date.now()
  ) {

    return "scheduled";

  }


  if (
    news.isPublished === true
  ) {

    return "published";

  }


  if (
    news.status === "published"
  ) {

    return "published";

  }


  if (
    news.status === "scheduled"
  ) {

    return "scheduled";

  }


  return "draft";

}


/* =========================================================
   NEWS STATUS LABEL
   ========================================================= */

function getNewsStatusLabel(
  status
) {

  switch (status) {

    case "published":

      return "Published";


    case "scheduled":

      return "Scheduled";


    case "draft":

      return "Draft";


    default:

      return "Draft";

  }

}


/* =========================================================
   NEWS STATUS CSS CLASS
   ========================================================= */

function getNewsStatusClass(
  status
) {

  switch (status) {

    case "published":

      return "status-published";


    case "scheduled":

      return "status-scheduled";


    case "draft":

      return "status-draft";


    default:

      return "status-draft";

  }

}


/* =========================================================
   NEWS PERMISSION CHECK
   ========================================================= */

function canManageNews(
  permission
) {

  return hasAdminPermission(
    permission
  );

}


/* =========================================================
   PART 3/20 END
   ========================================================= */
/* =========================================================
   NEWS EDITOR
   ========================================================= */

/* ---------------------------------------------------------
   Open News Editor
   --------------------------------------------------------- */

function openNewsEditor(news = null) {

  if (
    news &&
    !hasAdminPermission("news.edit")
  ) {

    showAdminToast(
      "News edit करने की permission नहीं है।",
      "warning"
    );

    return;
  }


  if (
    !news &&
    !hasAdminPermission("news.create")
  ) {

    showAdminToast(
      "नई News create करने की permission नहीं है।",
      "warning"
    );

    return;
  }


  adminState.editingNews =
    news || null;


  const modal =
    document.getElementById(
      "news-editor-modal"
    );


  if (!modal) {

    console.warn(
      "news-editor-modal नहीं मिला।"
    );

    return;
  }


  const title =
    document.getElementById(
      "news-editor-title"
    );


  if (title) {

    title.textContent =
      news
        ? "Edit News"
        : "Create News";

  }


  resetNewsEditor();


  if (news) {

    fillNewsEditor(
      news
    );

  }


  modal.hidden =
    false;


  modal.classList.add(
    "active"
  );


  document.body.classList.add(
    "admin-modal-open"
  );


  initializeNewsEditorFields();

}


/* ---------------------------------------------------------
   Close News Editor
   --------------------------------------------------------- */

function closeNewsEditor() {

  const modal =
    document.getElementById(
      "news-editor-modal"
    );


  if (!modal) {
    return;
  }


  modal.classList.remove(
    "active"
  );


  modal.hidden =
    true;


  document.body.classList.remove(
    "admin-modal-open"
  );


  adminState.editingNews =
    null;

}


/* ---------------------------------------------------------
   Reset News Editor
   --------------------------------------------------------- */

function resetNewsEditor() {

  const form =
    document.getElementById(
      "news-editor-form"
    );


  if (form) {

    form.reset();

  }


  const imagePreview =
    document.getElementById(
      "news-image-preview"
    );


  if (imagePreview) {

    imagePreview.innerHTML =
      "";

  }


  const imageInput =
    document.getElementById(
      "news-image"
    );


  if (imageInput) {

    imageInput.value =
      "";

  }


  const slugInput =
    document.getElementById(
      "news-slug"
    );


  if (slugInput) {

    slugInput.value =
      "";

  }


  const newsId =
    document.getElementById(
      "news-id"
    );


  if (newsId) {

    newsId.value =
      "";

  }

}


/* ---------------------------------------------------------
   Fill News Editor
   --------------------------------------------------------- */

function fillNewsEditor(
  news
) {

  if (!news) {
    return;
  }


  setInputValue(
    "news-id",
    news._id ||
    news.id ||
    ""
  );


  setInputValue(
    "news-title",
    news.title ||
    ""
  );


  setInputValue(
    "news-slug",
    news.slug ||
    ""
  );


  setInputValue(
    "news-category",
    news.category ||
    "राजस्थान"
  );


  setInputValue(
    "news-subcategory",
    news.subcategory ||
    ""
  );


  setInputValue(
    "news-location",
    news.location ||
    news.district ||
    ""
  );


  setInputValue(
    "news-author",
    news.author ||
    ""
  );


  setInputValue(
    "news-summary",
    news.summary ||
    ""
  );


  setInputValue(
    "news-content",
    news.content ||
    news.description ||
    ""
  );


  setInputValue(
    "news-tags",
    Array.isArray(news.tags)
      ? news.tags.join(", ")
      : (
          news.tags ||
          ""
        )
  );


  setInputValue(
    "news-status",
    news.status ||
    (
      news.isPublished
        ? "published"
        : "draft"
    )
  );


  setInputValue(
    "news-scheduled-at",
    news.scheduledAt
      ? formatDateTimeLocal(
          news.scheduledAt
        )
      : ""
  );


  if (news.image) {

    showNewsImagePreview(
      news.image
    );

  }


  updateNewsSlugPreview();

}


/* ---------------------------------------------------------
   Initialize News Editor Fields
   --------------------------------------------------------- */

function initializeNewsEditorFields() {

  const form =
    document.getElementById(
      "news-editor-form"
    );


  if (!form) {
    return;
  }


  if (
    form.dataset.initialized ===
    "true"
  ) {

    return;

  }


  form.dataset.initialized =
    "true";


  const titleInput =
    document.getElementById(
      "news-title"
    );


  const slugInput =
    document.getElementById(
      "news-slug"
    );


  const imageInput =
    document.getElementById(
      "news-image"
    );


  const closeButton =
    document.getElementById(
      "news-editor-close"
    );


  const cancelButton =
    document.getElementById(
      "news-editor-cancel"
    );


  /* -----------------------------------------
     Title to slug
     ----------------------------------------- */

  if (titleInput) {

    titleInput.addEventListener(
      "input",
      () => {

        if (
          !slugInput ||
          slugInput.dataset.manual ===
          "true"
        ) {

          return;

        }


        updateNewsSlugPreview();

      }
    );

  }


  /* -----------------------------------------
     Manual slug
     ----------------------------------------- */

  if (slugInput) {

    slugInput.addEventListener(
      "input",
      () => {

        slugInput.dataset.manual =
          slugInput.value.trim()
            ? "true"
            : "false";

      }
    );

  }


  /* -----------------------------------------
     Image
     ----------------------------------------- */

  if (imageInput) {

    imageInput.addEventListener(
      "change",
      handleNewsImageChange
    );

  }


  /* -----------------------------------------
     Close
     ----------------------------------------- */

  if (closeButton) {

    closeButton.addEventListener(
      "click",
      event => {

        event.preventDefault();

        closeNewsEditor();

      }
    );

  }


  /* -----------------------------------------
     Cancel
     ----------------------------------------- */

  if (cancelButton) {

    cancelButton.addEventListener(
      "click",
      event => {

        event.preventDefault();

        closeNewsEditor();

      }
    );

  }


  /* -----------------------------------------
     Submit
     ----------------------------------------- */

  form.addEventListener(
    "submit",
    handleNewsSubmit
  );

}


/* ---------------------------------------------------------
   Update News Slug
   --------------------------------------------------------- */

function updateNewsSlugPreview() {

  const titleInput =
    document.getElementById(
      "news-title"
    );


  const slugInput =
    document.getElementById(
      "news-slug"
    );


  if (
    !titleInput ||
    !slugInput
  ) {

    return;

  }


  if (
    slugInput.dataset.manual ===
    "true"
  ) {

    return;

  }


  slugInput.value =
    createNewsSlug(
      titleInput.value
    );

}


/* ---------------------------------------------------------
   Create News Slug
   --------------------------------------------------------- */

function createNewsSlug(
  text
) {

  if (!text) {
    return "";
  }


  return String(text)
    .toLowerCase()
    .trim()
    .replace(
      /[^\p{L}\p{N}\s-]/gu,
      ""
    )
    .replace(
      /\s+/g,
      "-"
    )
    .replace(
      /-+/g,
      "-"
    )
    .replace(
      /^-|-$/g,
      ""
    );

}


/* ---------------------------------------------------------
   Handle News Image Change
   --------------------------------------------------------- */

function handleNewsImageChange(
  event
) {

  const file =
    event.target.files?.[0];


  if (!file) {
    return;
  }


  const maxSize =
    5 * 1024 * 1024;


  if (
    file.size >
    maxSize
  ) {

    showAdminToast(
      "Image का size 5MB से कम होना चाहिए।",
      "warning"
    );


    event.target.value =
      "";


    return;

  }


  if (
    !file.type.startsWith(
      "image/"
    )
  ) {

    showAdminToast(
      "कृपया valid image file चुनें।",
      "warning"
    );


    event.target.value =
      "";


    return;

  }


  const reader =
    new FileReader();


  reader.onload =
    () => {

      showNewsImagePreview(
        reader.result
      );

    };


  reader.onerror =
    () => {

      showAdminToast(
        "Image preview नहीं बन पाया।",
        "error"
      );

    };


  reader.readAsDataURL(
    file
  );

}


/* ---------------------------------------------------------
   Show News Image Preview
   --------------------------------------------------------- */

function showNewsImagePreview(
  source
) {

  const preview =
    document.getElementById(
      "news-image-preview"
    );


  if (!preview) {
    return;
  }


  preview.innerHTML =
    "";


  if (!source) {
    return;
  }


  const image =
    document.createElement(
      "img"
    );


  image.src =
    source;


  image.alt =
    "News image preview";


  image.loading =
    "lazy";


  preview.appendChild(
    image
  );

}


/* =========================================================
   PART 4/25 END
   ========================================================= */
// ========================================
// ADMIN.JS
// PART 5 / 25
// NAVIGATION + SIDEBAR + HEADER
// ========================================


// ========================================
// ADMIN NAVIGATION
// ========================================

function initializeAdminNavigation() {
  const navButtons = document.querySelectorAll(
    "#admin-sidebar [data-section]"
  );

  navButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const sectionName = button.dataset.section;

      if (!sectionName) {
        return;
      }

      if (
        button.dataset.permission &&
        !hasAdminPermission(button.dataset.permission)
      ) {
        showAdminToast(
          "error",
          "अनुमति नहीं",
          "आपके Admin Account को इस सेक्शन की अनुमति नहीं है।"
        );
        return;
      }

      switchAdminSection(sectionName);
    });
  });
}


// ========================================
// SWITCH ADMIN SECTION
// ========================================

function switchAdminSection(sectionName) {
  if (!sectionName) {
    return;
  }

  const targetSection = document.querySelector(
    `#section-${sectionName}`
  );

  if (!targetSection) {
    console.warn(
      `Admin section not found: ${sectionName}`
    );
    return;
  }

  if (!adminState.isAuthenticated) {
    return;
  }

  adminState.currentSection = sectionName;

  document
    .querySelectorAll("#admin-content > section")
    .forEach((section) => {
      section.classList.remove("active");
      section.classList.add("hidden");
    });

  targetSection.classList.remove("hidden");
  targetSection.classList.add("active");

  updateAdminNavigationActiveState(sectionName);
  updateAdminBreadcrumb(sectionName);
  updateAdminPageHeader(sectionName);

  closeAdminSidebar();

  loadSectionData(sectionName);
}


// ========================================
// ACTIVE NAVIGATION STATE
// ========================================

function updateAdminNavigationActiveState(sectionName) {
  const navButtons = document.querySelectorAll(
    "#admin-sidebar [data-section]"
  );

  navButtons.forEach((button) => {
    const buttonSection = button.dataset.section;

    button.classList.toggle(
      "active",
      buttonSection === sectionName
    );

    button.setAttribute(
      "aria-current",
      buttonSection === sectionName
        ? "page"
        : "false"
    );
  });
}


// ========================================
// BREADCRUMB
// ========================================

function updateAdminBreadcrumb(sectionName) {
  const breadcrumb = document.getElementById(
    "admin-breadcrumb"
  );

  if (!breadcrumb) {
    return;
  }

  const sectionNames = {
    dashboard: "डैशबोर्ड",
    news: "न्यूज़ मैनेजमेंट",
    breaking: "ब्रेकिंग न्यूज़",
    trending: "ट्रेंडिंग न्यूज़",
    video: "वीडियो",
    "live-tv": "लाइव टीवी",
    "live-blog": "लाइव ब्लॉग",
    epaper: "ई-पेपर",
    contacts: "कॉन्टैक्ट्स",
    users: "यूज़र्स",
    admins: "एडमिन मैनेजमेंट",
    settings: "सेटिंग्स",
    profile: "प्रोफाइल"
  };

  breadcrumb.textContent =
    sectionNames[sectionName] ||
    sectionName;
}


// ========================================
// PAGE HEADER
// ========================================

function updateAdminPageHeader(sectionName) {
  const pageTitle = document.getElementById(
    "admin-page-title"
  );

  const pageDescription = document.getElementById(
    "admin-page-description"
  );

  const pageData = {
    dashboard: {
      title: "डैशबोर्ड",
      description:
        "आवाज राजस्थान न्यूज़ पोर्टल का ओवरव्यू"
    },

    news: {
      title: "न्यूज़ मैनेजमेंट",
      description:
        "राजस्थान की सभी न्यूज़ को मैनेज करें"
    },

    breaking: {
      title: "ब्रेकिंग न्यूज़",
      description:
        "ब्रेकिंग न्यूज़ को मैनेज और प्रकाशित करें"
    },

    trending: {
      title: "ट्रेंडिंग न्यूज़",
      description:
        "ट्रेंडिंग न्यूज़ और लोकप्रिय कंटेंट मैनेज करें"
    },

    video: {
      title: "वीडियो",
      description:
        "न्यूज़ वीडियो और वीडियो कंटेंट मैनेज करें"
    },

    "live-tv": {
      title: "लाइव टीवी",
      description:
        "आवाज राजस्थान LIVE टीवी सेटिंग्स मैनेज करें"
    },

    "live-blog": {
      title: "लाइव ब्लॉग",
      description:
        "रियल-टाइम लाइव ब्लॉग अपडेट मैनेज करें"
    },

    epaper: {
      title: "ई-पेपर",
      description:
        "डिजिटल ई-पेपर अपलोड और प्रकाशित करें"
    },

    contacts: {
      title: "कॉन्टैक्ट्स",
      description:
        "यूज़र्स द्वारा भेजे गए संपर्क संदेश मैनेज करें"
    },

    users: {
      title: "यूज़र्स",
      description:
        "वेबसाइट यूज़र्स और उनके अकाउंट मैनेज करें"
    },

    admins: {
      title: "एडमिन मैनेजमेंट",
      description:
        "Admin Accounts और permissions मैनेज करें"
    },

    settings: {
      title: "साइट सेटिंग्स",
      description:
        "वेबसाइट की मुख्य सेटिंग्स मैनेज करें"
    },

    profile: {
      title: "मेरा प्रोफाइल",
      description:
        "Admin Account और security settings"
    }
  };

  const data =
    pageData[sectionName] ||
    pageData.dashboard;

  if (pageTitle) {
    pageTitle.textContent = data.title;
  }

  if (pageDescription) {
    pageDescription.textContent =
      data.description;
  }
}


// ========================================
// LOAD SECTION DATA
// ========================================

async function loadSectionData(sectionName) {
  try {
    switch (sectionName) {
      case "dashboard":
        await loadDashboard();
        break;

      case "news":
        await loadNews();
        break;

      case "breaking":
        await loadBreakingNews();
        break;

      case "trending":
        await loadTrendingNews();
        break;

      case "video":
        await loadVideos();
        break;

      case "live-tv":
        await loadLiveTV();
        break;

      case "live-blog":
        await loadLiveBlog();
        break;

      case "epaper":
        await loadEPaper();
        break;

      case "contacts":
        await loadContacts();
        break;

      case "users":
        await loadUsers();
        break;

      case "admins":
        await loadAdmins();
        break;

      case "settings":
        await loadSettings();
        break;

      case "profile":
        await loadProfile();
        break;

      default:
        console.warn(
          `No loader available for section: ${sectionName}`
        );
    }
  } catch (error) {
    console.error(
      `Section loading error (${sectionName}):`,
      error
    );

    showAdminToast(
      "error",
      "लोडिंग समस्या",
      "इस सेक्शन का डेटा लोड नहीं हो पाया।"
    );
  }
}


// ========================================
// SIDEBAR MOBILE MENU
// ========================================

function initializeAdminSidebar() {
  const menuButton = document.getElementById(
    "admin-mobile-menu-button"
  );

  const sidebar = document.getElementById(
    "admin-sidebar"
  );

  const overlay = document.getElementById(
    "admin-sidebar-overlay"
  );

  if (menuButton) {
    menuButton.addEventListener(
      "click",
      toggleAdminSidebar
    );
  }

  if (overlay) {
    overlay.addEventListener(
      "click",
      closeAdminSidebar
    );
  }

  if (sidebar) {
    sidebar
      .querySelectorAll("[data-section]")
      .forEach((button) => {
        button.addEventListener("click", () => {
          if (window.innerWidth <= 1024) {
            closeAdminSidebar();
          }
        });
      });
  }
}


// ========================================
// TOGGLE SIDEBAR
// ========================================

function toggleAdminSidebar() {
  const sidebar = document.getElementById(
    "admin-sidebar"
  );

  const overlay = document.getElementById(
    "admin-sidebar-overlay"
  );

  if (!sidebar) {
    return;
  }

  sidebar.classList.toggle("open");

  if (overlay) {
    overlay.classList.toggle(
      "active",
      sidebar.classList.contains("open")
    );
  }

  document.body.classList.toggle(
    "admin-sidebar-open",
    sidebar.classList.contains("open")
  );
}


// ========================================
// CLOSE SIDEBAR
// ========================================

function closeAdminSidebar() {
  const sidebar = document.getElementById(
    "admin-sidebar"
  );

  const overlay = document.getElementById(
    "admin-sidebar-overlay"
  );

  if (sidebar) {
    sidebar.classList.remove("open");
  }

  if (overlay) {
    overlay.classList.remove("active");
  }

  document.body.classList.remove(
    "admin-sidebar-open"
  );
}


// ========================================
// HEADER PROFILE BUTTON
// ========================================

function initializeAdminHeader() {
  const profileButton = document.getElementById(
    "admin-header-profile-button"
  );

  if (profileButton) {
    profileButton.addEventListener(
      "click",
      () => {
        switchAdminSection("profile");
      }
    );
  }

  const notificationButton =
    document.getElementById(
      "admin-notification-button"
    );

  if (notificationButton) {
    notificationButton.addEventListener(
      "click",
      handleAdminNotifications
    );
  }
}


// ========================================
// ADMIN NOTIFICATIONS
// ========================================

function handleAdminNotifications() {
  const badge = document.getElementById(
    "admin-notification-badge"
  );

  if (badge) {
    badge.classList.add("hidden");
  }

  showAdminToast(
    "info",
    "Notifications",
    "फिलहाल कोई नई महत्वपूर्ण notification नहीं है।"
  );
}


// ========================================
// QUICK ACTIONS
// ========================================

function initializeQuickActions() {
  const actionButtons = document.querySelectorAll(
    "#quick-actions [data-action]"
  );

  actionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.action;

      handleQuickAction(action);
    });
  });
}


// ========================================
// QUICK ACTION HANDLER
// ========================================

function handleQuickAction(action) {
  if (!action) {
    return;
  }

  switch (action) {
    case "create-news":
      if (!hasAdminPermission("news.create")) {
        showAdminToast(
          "error",
          "अनुमति नहीं",
          "आपको न्यूज़ बनाने की अनुमति नहीं है।"
        );
        return;
      }

      openNewsEditor();
      break;

    case "manage-breaking":
      switchAdminSection("breaking");
      break;

    case "manage-live-tv":
      switchAdminSection("live-tv");
      break;

    case "manage-epaper":
      switchAdminSection("epaper");
      break;

    default:
      console.warn(
        `Unknown quick action: ${action}`
      );
  }
}


// ========================================
// FOOTER YEAR
// ========================================

function updateAdminFooterYear() {
  const footerYear = document.getElementById(
    "admin-footer-year"
  );

  if (footerYear) {
    footerYear.textContent =
      new Date().getFullYear();
  }
}


// ========================================
// RESPONSIVE SIDEBAR
// ========================================

function initializeAdminResponsive() {
  window.addEventListener(
    "resize",
    () => {
      if (window.innerWidth > 1024) {
        closeAdminSidebar();
      }
    }
  );
}


// ========================================
// INITIAL NAVIGATION
// ========================================

function openDefaultAdminSection() {
  const defaultSection =
    adminState.currentSection ||
    "dashboard";

  const sectionExists = document.querySelector(
    `#section-${defaultSection}`
  );

  if (sectionExists) {
    switchAdminSection(
      defaultSection
    );
  } else {
    switchAdminSection("dashboard");
  }
  }
// ========================================
// ADMIN.JS
// PART 6 / 25
// TOAST + LOADING + MODAL + CONFIRMATION
// ========================================


// ========================================
// TOAST CONTAINER
// ========================================

function getToastContainer() {
  let container = document.getElementById(
    "admin-toast-container"
  );

  if (!container) {
    container = document.createElement("div");
    container.id = "admin-toast-container";
    container.className = "admin-toast-container";

    document.body.appendChild(container);
  }

  return container;
}


// ========================================
// SHOW ADMIN TOAST
// ========================================

function showAdminToast(
  type = "info",
  title = "सूचना",
  message = ""
) {
  const container = getToastContainer();

  const toast = document.createElement("div");

  toast.className =
    `admin-toast admin-toast-${type}`;

  const icons = {
    success: "✓",
    error: "!",
    warning: "⚠",
    info: "i"
  };

  const icon =
    icons[type] || icons.info;

  toast.innerHTML = `
    <div class="admin-toast-icon">
      ${icon}
    </div>

    <div class="admin-toast-content">
      <strong class="admin-toast-title">
        ${escapeHTML(title)}
      </strong>

      <div class="admin-toast-message">
        ${escapeHTML(message)}
      </div>
    </div>

    <button
      type="button"
      class="admin-toast-close"
      aria-label="Close notification"
    >
      ×
    </button>
  `;

  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add("show");
  });

  const closeButton =
    toast.querySelector(
      ".admin-toast-close"
    );

  if (closeButton) {
    closeButton.addEventListener(
      "click",
      () => removeAdminToast(toast)
    );
  }

  const timeout =
    type === "error"
      ? 6000
      : 4000;

  setTimeout(() => {
    removeAdminToast(toast);
  }, timeout);

  return toast;
}


// ========================================
// REMOVE TOAST
// ========================================

function removeAdminToast(toast) {
  if (!toast) {
    return;
  }

  toast.classList.remove("show");

  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(
        toast
      );
    }
  }, 250);
}


// ========================================
// ESCAPE HTML
// ========================================

function escapeHTML(value) {
  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  const div =
    document.createElement("div");

  div.textContent = String(value);

  return div.innerHTML;
}


// ========================================
// LOADING OVERLAY
// ========================================

function showAdminLoading(
  title = "कृपया प्रतीक्षा करें",
  message = "डेटा प्रोसेस हो रहा है..."
) {
  const overlay =
    document.getElementById(
      "admin-loading-overlay"
    );

  if (!overlay) {
    return;
  }

  const titleElement =
    document.getElementById(
      "admin-loading-title"
    );

  const messageElement =
    document.getElementById(
      "admin-loading-message"
    );

  if (titleElement) {
    titleElement.textContent =
      title;
  }

  if (messageElement) {
    messageElement.textContent =
      message;
  }

  overlay.classList.remove(
    "hidden"
  );

  overlay.classList.add(
    "active"
  );

  overlay.setAttribute(
    "aria-hidden",
    "false"
  );
}


// ========================================
// HIDE LOADING OVERLAY
// ========================================

function hideAdminLoading() {
  const overlay =
    document.getElementById(
      "admin-loading-overlay"
    );

  if (!overlay) {
    return;
  }

  overlay.classList.remove(
    "active"
  );

  overlay.classList.add(
    "hidden"
  );

  overlay.setAttribute(
    "aria-hidden",
    "true"
  );
}


// ========================================
// ADMIN MODAL
// ========================================

function openAdminModal(options = {}) {
  const modal =
    document.getElementById(
      "admin-modal"
    );

  if (!modal) {
    return;
  }

  const icon =
    document.getElementById(
      "admin-modal-icon"
    );

  const eyebrow =
    document.getElementById(
      "admin-modal-eyebrow"
    );

  const title =
    document.getElementById(
      "admin-modal-title"
    );

  const body =
    document.getElementById(
      "admin-modal-body"
    );

  const footer =
    document.getElementById(
      "admin-modal-footer"
    );

  if (icon) {
    icon.textContent =
      options.icon || "ℹ";
  }

  if (eyebrow) {
    eyebrow.textContent =
      options.eyebrow || "ADMIN";
  }

  if (title) {
    title.textContent =
      options.title || "सूचना";
  }

  if (body) {
    if (
      options.html === true
    ) {
      body.innerHTML =
        options.body || "";
    } else {
      body.textContent =
        options.body || "";
    }
  }

  if (footer) {
    footer.innerHTML =
      options.footer || "";
  }

  modal.classList.remove(
    "hidden"
  );

  modal.classList.add(
    "active"
  );

  modal.setAttribute(
    "aria-hidden",
    "false"
  );

  document.body.classList.add(
    "admin-modal-open"
  );

  return modal;
}


// ========================================
// CLOSE ADMIN MODAL
// ========================================

function closeAdminModal() {
  const modal =
    document.getElementById(
      "admin-modal"
    );

  if (!modal) {
    return;
  }

  modal.classList.remove(
    "active"
  );

  modal.classList.add(
    "hidden"
  );

  modal.setAttribute(
    "aria-hidden",
    "true"
  );

  document.body.classList.remove(
    "admin-modal-open"
  );
}


// ========================================
// CONFIRMATION DIALOG
// ========================================

function showAdminConfirm(options = {}) {
  const dialog =
    document.getElementById(
      "admin-confirm-dialog"
    );

  if (!dialog) {
    return Promise.resolve(false);
  }

  const icon =
    document.getElementById(
      "admin-confirm-icon"
    );

  const title =
    document.getElementById(
      "admin-confirm-title"
    );

  const message =
    document.getElementById(
      "admin-confirm-message"
    );

  const cancelButton =
    document.getElementById(
      "admin-confirm-cancel"
    );

  const submitButton =
    document.getElementById(
      "admin-confirm-submit"
    );

  if (icon) {
    icon.textContent =
      options.icon || "!";
  }

  if (title) {
    title.textContent =
      options.title ||
      "क्या आप सुनिश्चित हैं?";
  }

  if (message) {
    message.textContent =
      options.message ||
      "इस कार्रवाई को जारी रखना है?";
  }

  if (cancelButton) {
    cancelButton.textContent =
      options.cancelText ||
      "रद्द करें";
  }

  if (submitButton) {
    submitButton.textContent =
      options.confirmText ||
      "जारी रखें";
  }

  dialog.classList.remove(
    "hidden"
  );

  dialog.classList.add(
    "active"
  );

  dialog.setAttribute(
    "aria-hidden",
    "false"
  );

  document.body.classList.add(
    "admin-dialog-open"
  );

  return new Promise((resolve) => {
    let finished = false;

    const finish = (result) => {
      if (finished) {
        return;
      }

      finished = true;

      cleanup();

      closeAdminConfirm();

      resolve(result);
    };

    const cleanup = () => {
      if (cancelButton) {
        cancelButton.removeEventListener(
          "click",
          onCancel
        );
      }

      if (submitButton) {
        submitButton.removeEventListener(
          "click",
          onConfirm
        );
      }

      dialog.removeEventListener(
        "click",
        onOutsideClick
      );
    };

    const onCancel = () => {
      finish(false);
    };

    const onConfirm = () => {
      finish(true);
    };

    const onOutsideClick =
      (event) => {
        if (
          event.target === dialog &&
          options.closeOnOutside !== false
        ) {
          finish(false);
        }
      };

    if (cancelButton) {
      cancelButton.addEventListener(
        "click",
        onCancel
      );
    }

    if (submitButton) {
      submitButton.addEventListener(
        "click",
        onConfirm
      );
    }

    dialog.addEventListener(
      "click",
      onOutsideClick
    );
  });
}


// ========================================
// CLOSE CONFIRMATION DIALOG
// ========================================

function closeAdminConfirm() {
  const dialog =
    document.getElementById(
      "admin-confirm-dialog"
    );

  if (!dialog) {
    return;
  }

  dialog.classList.remove(
    "active"
  );

  dialog.classList.add(
    "hidden"
  );

  dialog.setAttribute(
    "aria-hidden",
    "true"
  );

  document.body.classList.remove(
    "admin-dialog-open"
  );
}


// ========================================
// MODAL CLOSE BUTTONS
// ========================================

function initializeAdminDialogs() {
  const modalClose =
    document.getElementById(
      "admin-modal-close"
    );

  const modalCancel =
    document.getElementById(
      "admin-modal-cancel"
    );

  if (modalClose) {
    modalClose.addEventListener(
      "click",
      closeAdminModal
    );
  }

  if (modalCancel) {
    modalCancel.addEventListener(
      "click",
      closeAdminModal
    );
  }
}


// ========================================
// ESC KEY HANDLER
// ========================================

function initializeAdminEscapeHandler() {
  document.addEventListener(
    "keydown",
    (event) => {
      if (event.key !== "Escape") {
        return;
      }

      closeAdminModal();
      closeAdminConfirm();
      closeAdminSidebar();

      const newsEditor =
        document.getElementById(
          "news-editor-modal"
        );

      if (
        newsEditor &&
        newsEditor.classList.contains(
          "active"
        )
      ) {
        closeNewsEditor();
      }
    }
  );
}


// ========================================
// DISABLE BUTTON
// ========================================

function setButtonLoading(
  button,
  loading,
  loadingText = "प्रोसेस हो रहा है..."
) {
  if (!button) {
    return;
  }

  if (loading) {
    if (
      !button.dataset.originalText
    ) {
      button.dataset.originalText =
        button.textContent;
    }

    button.disabled = true;

    button.classList.add(
      "loading"
    );

    button.textContent =
      loadingText;
  } else {
    button.disabled = false;

    button.classList.remove(
      "loading"
    );

    if (
      button.dataset.originalText
    ) {
      button.textContent =
        button.dataset.originalText;

      delete button.dataset
        .originalText;
    }
  }
     }
// ========================================
// ADMIN.JS
// PART 7 / 25
// PERMISSIONS + ADMIN UI
// ========================================


// ========================================
// ADMIN PERMISSION CHECK
// ========================================

function hasAdminPermission(permission) {
  if (!permission) {
    return true;
  }

  const admin = adminState.admin;

  if (!admin) {
    return false;
  }

  // Owner को सभी permissions
  // automatically मिलती हैं।
  if (
    admin.role === "owner" ||
    admin.isOwner === true
  ) {
    return true;
  }

  const permissions =
    Array.isArray(admin.permissions)
      ? admin.permissions
      : [];

  return permissions.includes(
    permission
  );
}


// ========================================
// OWNER CHECK
// ========================================

function isAdminOwner() {
  const admin = adminState.admin;

  if (!admin) {
    return false;
  }

  return (
    admin.role === "owner" ||
    admin.isOwner === true
  );
}


// ========================================
// ROLE CHECK
// ========================================

function hasAdminRole(...roles) {
  const admin = adminState.admin;

  if (!admin) {
    return false;
  }

  return roles.includes(
    admin.role
  );
}


// ========================================
// APPLY PERMISSIONS TO SIDEBAR
// ========================================

function applyAdminPermissions() {
  const navButtons =
    document.querySelectorAll(
      "#admin-sidebar [data-permission]"
    );

  navButtons.forEach((button) => {
    const permission =
      button.dataset.permission;

    if (!permission) {
      return;
    }

    const allowed =
      hasAdminPermission(permission);

    if (!allowed) {
      button.classList.add(
        "permission-hidden"
      );

      button.setAttribute(
        "aria-hidden",
        "true"
      );

      button.setAttribute(
        "tabindex",
        "-1"
      );
    } else {
      button.classList.remove(
        "permission-hidden"
      );

      button.removeAttribute(
        "aria-hidden"
      );

      button.removeAttribute(
        "tabindex"
      );
    }
  });
}


// ========================================
// APPLY OWNER-ONLY CONTROLS
// ========================================

function applyOwnerControls() {
  const ownerElements =
    document.querySelectorAll(
      "[data-owner-only]"
    );

  const owner =
    isAdminOwner();

  ownerElements.forEach((element) => {
    if (owner) {
      element.classList.remove(
        "permission-hidden"
      );

      element.removeAttribute(
        "aria-hidden"
      );
    } else {
      element.classList.add(
        "permission-hidden"
      );

      element.setAttribute(
        "aria-hidden",
        "true"
      );
    }
  });
}


// ========================================
// UPDATE ADMIN IDENTITY
// ========================================

function updateAdminIdentity() {
  const admin =
    adminState.admin;

  if (!admin) {
    return;
  }

  const name =
    admin.name ||
    admin.fullName ||
    admin.username ||
    admin.adminId ||
    "Admin";

  const role =
    admin.role ||
    "admin";

  const adminId =
    admin.adminId ||
    admin.username ||
    "";

  updateElementText(
    "sidebar-admin-name",
    name
  );

  updateElementText(
    "sidebar-admin-role",
    formatAdminRole(role)
  );

  updateElementText(
    "header-admin-name",
    name
  );

  updateElementText(
    "header-admin-role",
    formatAdminRole(role)
  );

  updateElementText(
    "dashboard-admin-name",
    name
  );

  updateElementText(
    "profile-name",
    name
  );

  updateElementText(
    "profile-admin-id",
    adminId
  );

  updateElementText(
    "profile-role",
    formatAdminRole(role)
  );

  updateAdminAvatar(
    name
  );
}


// ========================================
// UPDATE ELEMENT TEXT
// ========================================

function updateElementText(
  elementId,
  value
) {
  const element =
    document.getElementById(
      elementId
    );

  if (!element) {
    return;
  }

  element.textContent =
    value === null ||
    value === undefined
      ? ""
      : String(value);
}


// ========================================
// FORMAT ADMIN ROLE
// ========================================

function formatAdminRole(role) {
  const roles = {
    owner: "Owner",
    admin: "Administrator",
    editor: "Editor",
    reporter: "Reporter"
  };

  return (
    roles[role] ||
    role ||
    "Admin"
  );
}


// ========================================
// UPDATE ADMIN AVATAR
// ========================================

function updateAdminAvatar(name) {
  const safeName =
    String(name || "A");

  const firstLetter =
    safeName
      .trim()
      .charAt(0)
      .toUpperCase() ||
    "A";

  updateElementText(
    "sidebar-admin-avatar-text",
    firstLetter
  );

  const headerAvatar =
    document.getElementById(
      "header-admin-avatar"
    );

  if (
    headerAvatar &&
    !headerAvatar.querySelector(
      "img"
    )
  ) {
    headerAvatar.textContent =
      firstLetter;
  }

  const profileAvatar =
    document.getElementById(
      "profile-avatar"
    );

  if (
    profileAvatar &&
    !profileAvatar.querySelector(
      "img"
    )
  ) {
    profileAvatar.textContent =
      firstLetter;
  }
}


// ========================================
// POPULATE PROFILE DATA
// ========================================

function populateAdminProfile() {
  const admin =
    adminState.admin;

  if (!admin) {
    return;
  }

  updateElementText(
    "profile-name",
    admin.name ||
      admin.fullName ||
      admin.username ||
      admin.adminId ||
      "Admin"
  );

  updateElementText(
    "profile-email",
    admin.email ||
      "-"
  );

  updateElementText(
    "profile-role",
    formatAdminRole(
      admin.role
    )
  );

  updateElementText(
    "profile-admin-id",
    admin.adminId ||
      admin.username ||
      "-"
  );

  updateElementText(
    "profile-account-status",
    admin.isActive === false
      ? "Inactive"
      : "Active"
  );

  updateElementText(
    "profile-last-login",
    formatDateTime(
      admin.lastLogin
    )
  );

  updateElementText(
    "profile-created-at",
    formatDateTime(
      admin.createdAt
    )
  );
}


// ========================================
// FORMAT DATE TIME
// ========================================

function formatDateTime(
  value
) {
  if (!value) {
    return "-";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "-";
  }

  return date.toLocaleString(
    "hi-IN",
    {
      dateStyle: "medium",
      timeStyle: "short"
    }
  );
}


// ========================================
// PERMISSION-BASED BUTTON STATE
// ========================================

function applyPermissionButtons() {
  const elements =
    document.querySelectorAll(
      "[data-permission]"
    );

  elements.forEach((element) => {
    const permission =
      element.dataset.permission;

    if (!permission) {
      return;
    }

    const allowed =
      hasAdminPermission(
        permission
      );

    if (
      element.tagName ===
      "BUTTON"
    ) {
      element.disabled =
        !allowed;
    }

    if (!allowed) {
      element.classList.add(
        "permission-disabled"
      );
    } else {
      element.classList.remove(
        "permission-disabled"
      );
    }
  });
}


// ========================================
// INITIALIZE PERMISSION SYSTEM
// ========================================

function initializeAdminPermissions() {
  applyAdminPermissions();
  applyOwnerControls();
  applyPermissionButtons();
  updateAdminIdentity();
  populateAdminProfile();
}


// ========================================
// ADMIN ACCESS GUARD
// ========================================

function requireAdminPermission(
  permission,
  callback
) {
  if (
    hasAdminPermission(
      permission
    )
  ) {
    if (
      typeof callback ===
      "function"
    ) {
      return callback();
    }

    return true;
  }

  showAdminToast(
    "error",
    "Access Denied",
    "आपके Admin Account को इस कार्रवाई की अनुमति नहीं है।"
  );

  return false;
}


// ========================================
// OWNER ACCESS GUARD
// ========================================

function requireOwner(
  callback
) {
  if (!isAdminOwner()) {
    showAdminToast(
      "error",
      "Owner Access Required",
      "यह सुविधा केवल Owner Account के लिए उपलब्ध है।"
    );

    return false;
  }

  if (
    typeof callback ===
    "function"
  ) {
    return callback();
  }

  return true;
}


// ========================================
// PERMISSION SUMMARY
// ========================================

function getAdminPermissionSummary() {
  const admin =
    adminState.admin;

  if (!admin) {
    return [];
  }

  if (isAdminOwner()) {
    return ["*"];
  }

  return Array.isArray(
    admin.permissions
  )
    ? [...admin.permissions]
    : [];
     }
// ========================================
// ADMIN.JS
// PART 8 / 25
// DASHBOARD LOADING + SYSTEM STATUS
// ========================================


// ========================================
// DASHBOARD STATE
// ========================================

if (!adminState.dashboard) {
  adminState.dashboard = {
    loading: false,
    loaded: false,
    stats: {},
    recentNews: []
  };
}


// ========================================
// LOAD DASHBOARD
// ========================================

async function loadDashboard() {
  if (!adminState.isAuthenticated) {
    return;
  }

  if (!adminState.dashboard) {
    adminState.dashboard = {
      loading: false,
      loaded: false,
      stats: {},
      recentNews: []
    };
  }

  adminState.dashboard.loading = true;

  try {
    await Promise.allSettled([
      loadDashboardStats(),
      loadDashboardRecentNews(),
      checkDashboardSystemStatus()
    ]);

    adminState.dashboard.loaded = true;
  } catch (error) {
    console.error(
      "Dashboard loading error:",
      error
    );
  } finally {
    adminState.dashboard.loading = false;
  }
}


// ========================================
// LOAD DASHBOARD STATS
// ========================================

async function loadDashboardStats() {
  try {
    const newsResponse =
      await adminAPIRequest(
        "/api/news?limit=100"
      );

    const newsData =
      normalizeAPIResponse(
        newsResponse
      );

    const news =
      extractArrayData(
        newsData,
        [
          "news",
          "items",
          "results"
        ]
      );

    const totalNews =
      newsData.total ??
      newsData.totalNews ??
      news.length;

    const publishedNews =
      news.filter(
        (item) =>
          item.isPublished === true
      ).length;

    const draftNews =
      news.filter(
        (item) =>
          item.isPublished !== true
      ).length;

    adminState.dashboard.stats = {
      totalNews,
      publishedNews,
      draftNews
    };

    updateDashboardStat(
      "stat-total-news",
      totalNews
    );

    updateDashboardStat(
      "stat-published-news",
      publishedNews
    );

    updateDashboardStat(
      "stat-draft-news",
      draftNews
    );

    return newsData;
  } catch (error) {
    console.error(
      "Dashboard news stats error:",
      error
    );

    updateDashboardStat(
      "stat-total-news",
      "-"
    );

    updateDashboardStat(
      "stat-published-news",
      "-"
    );

    updateDashboardStat(
      "stat-draft-news",
      "-"
    );

    return null;
  }
}


// ========================================
// LOAD RECENT NEWS
// ========================================

async function loadDashboardRecentNews() {
  const container =
    document.getElementById(
      "dashboard-recent-news"
    );

  if (!container) {
    return;
  }

  try {
    const response =
      await adminAPIRequest(
        "/api/news?limit=5&sort=-createdAt"
      );

    const data =
      normalizeAPIResponse(
        response
      );

    const news =
      extractArrayData(
        data,
        [
          "news",
          "items",
          "results"
        ]
      );

    adminState.dashboard.recentNews =
      news.slice(0, 5);

    renderDashboardRecentNews(
      adminState.dashboard.recentNews
    );

    return news;
  } catch (error) {
    console.error(
      "Recent news loading error:",
      error
    );

    renderDashboardRecentNews(
      []
    );

    return [];
  }
}


// ========================================
// RENDER RECENT NEWS
// ========================================

function renderDashboardRecentNews(
  news
) {
  const container =
    document.getElementById(
      "dashboard-recent-news"
    );

  const emptyState =
    document.getElementById(
      "recent-news-empty"
    );

  if (!container) {
    return;
  }

  container.innerHTML = "";

  if (
    !Array.isArray(news) ||
    news.length === 0
  ) {
    if (emptyState) {
      emptyState.classList.remove(
        "hidden"
      );
    }

    return;
  }

  if (emptyState) {
    emptyState.classList.add(
      "hidden"
    );
  }

  news.forEach((item) => {
    const row =
      document.createElement(
        "div"
      );

    row.className =
      "dashboard-recent-news-item";

    const title =
      item.title ||
      "बिना शीर्षक न्यूज़";

    const category =
      item.category ||
      "राजस्थान";

    const date =
      formatDateTime(
        item.createdAt ||
        item.updatedAt
      );

    row.innerHTML = `
      <div class="dashboard-news-info">
        <div class="dashboard-news-title">
          ${escapeHTML(title)}
        </div>

        <div class="dashboard-news-meta">
          <span>
            ${escapeHTML(category)}
          </span>

          <span>
            ${escapeHTML(date)}
          </span>
        </div>
      </div>

      <button
        type="button"
        class="admin-btn admin-btn-small"
        data-view-news-id="${escapeHTML(
          getObjectId(item)
        )}"
      >
        देखें
      </button>
    `;

    const viewButton =
      row.querySelector(
        "[data-view-news-id]"
      );

    if (viewButton) {
      viewButton.addEventListener(
        "click",
        () => {
          openNewsPreview(
            item
          );
        }
      );
    }

    container.appendChild(
      row
    );
  });
}


// ========================================
// UPDATE DASHBOARD STAT
// ========================================

function updateDashboardStat(
  elementId,
  value
) {
  const element =
    document.getElementById(
      elementId
    );

  if (!element) {
    return;
  }

  element.textContent =
    value === null ||
    value === undefined
      ? "-"
      : String(value);
}


// ========================================
// CHECK SYSTEM STATUS
// ========================================

async function checkDashboardSystemStatus() {
  const apiStatus =
    document.getElementById(
      "system-api-status"
    );

  const dbStatus =
    document.getElementById(
      "system-db-status"
    );

  const authStatus =
    document.getElementById(
      "system-auth-status"
    );

  const siteStatus =
    document.getElementById(
      "system-site-status"
    );

  setSystemStatus(
    apiStatus,
    "checking",
    "Checking..."
  );

  setSystemStatus(
    dbStatus,
    "checking",
    "Checking..."
  );

  setSystemStatus(
    authStatus,
    "checking",
    "Checking..."
  );

  setSystemStatus(
    siteStatus,
    "checking",
    "Checking..."
  );

  let apiOK = false;

  try {
    const response =
      await adminAPIRequest(
        "/api/admin/me"
      );

    apiOK =
      response &&
      response.success !== false;

    setSystemStatus(
      apiStatus,
      apiOK
        ? "online"
        : "offline",
      apiOK
        ? "Online"
        : "Offline"
    );

    setSystemStatus(
      authStatus,
      adminState.isAuthenticated
        ? "online"
        : "offline",
      adminState.isAuthenticated
        ? "Authenticated"
        : "Not authenticated"
    );
  } catch (error) {
    console.error(
      "API status error:",
      error
    );

    setSystemStatus(
      apiStatus,
      "offline",
      "Offline"
    );

    setSystemStatus(
      authStatus,
      "offline",
      "Not authenticated"
    );
  }

  try {
    const siteResponse =
      await fetch(
        `${getAPIBaseURL()}/api/site/live-tv`,
        {
          method: "GET",
          headers: {
            Accept:
              "application/json"
          }
        }
      );

    setSystemStatus(
      siteStatus,
      siteResponse.ok
        ? "online"
        : "offline",
      siteResponse.ok
        ? "Online"
        : "Offline"
    );
  } catch (error) {
    console.error(
      "Site status error:",
      error
    );

    setSystemStatus(
      siteStatus,
      "offline",
      "Offline"
    );
  }

  /*
   * Database status का अलग public/admin
   * endpoint अभी backend में उपलब्ध नहीं है।
   *
   * इसलिए DB को API health के आधार पर
   * indirect status दिया जा रहा है।
   */
  setSystemStatus(
    dbStatus,
    apiOK
      ? "online"
      : "offline",
    apiOK
      ? "Connected"
      : "Unavailable"
  );

  return {
    api: apiOK
  };
}


// ========================================
// SYSTEM STATUS UI
// ========================================

function setSystemStatus(
  element,
  status,
  text
) {
  if (!element) {
    return;
  }

  element.textContent =
    text || status;

  element.classList.remove(
    "online",
    "offline",
    "checking",
    "warning"
  );

  element.classList.add(
    status
  );

  element.dataset.status =
    status;
}


// ========================================
// REFRESH DASHBOARD
// ========================================

async function refreshDashboard() {
  showAdminLoading(
    "डैशबोर्ड अपडेट हो रहा है",
    "नवीनतम जानकारी प्राप्त की जा रही है..."
  );

  try {
    await loadDashboard();

    showAdminToast(
      "success",
      "अपडेट पूरा",
      "डैशबोर्ड सफलतापूर्वक अपडेट हो गया।"
    );
  } catch (error) {
    console.error(
      "Dashboard refresh error:",
      error
    );

    showAdminToast(
      "error",
      "अपडेट विफल",
      "डैशबोर्ड अपडेट नहीं हो पाया।"
    );
  } finally {
    hideAdminLoading();
  }
}


// ========================================
// DASHBOARD REFRESH BUTTON
// ========================================

function initializeDashboardControls() {
  const refreshButtons =
    document.querySelectorAll(
      "#section-dashboard [data-action='refresh'], " +
      "#section-dashboard #dashboard-refresh-button"
    );

  refreshButtons.forEach(
    (button) => {
      button.addEventListener(
        "click",
        refreshDashboard
      );
    }
  );
}


// ========================================
// GET OBJECT ID
// ========================================

function getObjectId(item) {
  if (!item) {
    return "";
  }

  if (typeof item._id === "string") {
    return item._id;
  }

  if (
    item._id &&
    typeof item._id === "object" &&
    item._id.$oid
  ) {
    return item._id.$oid;
  }

  if (
    typeof item.id === "string"
  ) {
    return item.id;
  }

  return "";
}


// ========================================
// EXTRACT ARRAY DATA
// ========================================

function extractArrayData(
  data,
  keys = []
) {
  if (Array.isArray(data)) {
    return data;
  }

  if (!data || typeof data !== "object") {
    return [];
  }

  for (const key of keys) {
    if (Array.isArray(data[key])) {
      return data[key];
    }
  }

  if (
    data.data &&
    Array.isArray(data.data)
  ) {
    return data.data;
  }

  if (
    data.result &&
    Array.isArray(data.result)
  ) {
    return data.result;
  }

  return [];
}


// ========================================
// NORMALIZE API RESPONSE
// ========================================

function normalizeAPIResponse(
  response
) {
  if (!response) {
    return {};
  }

  if (
    response.data &&
    typeof response.data ===
      "object"
  ) {
    return response.data;
  }

  return response;
}


// ========================================
// DASHBOARD VIEW ALL NEWS
// ========================================

function initializeDashboardNewsLink() {
  const buttons =
    document.querySelectorAll(
      "#dashboard-recent-news [data-view-all-news], " +
      "#section-dashboard [data-action='view-all-news']"
    );

  buttons.forEach((button) => {
    button.addEventListener(
      "click",
      () => {
        switchAdminSection(
          "news"
        );
      }
    );
  });
}
// ========================================
// ADMIN.JS
// PART 9 / 25
// DASHBOARD STATS + RECENT NEWS HELPERS
// ========================================


// ========================================
// CONTACT STATISTICS
// ========================================

async function loadDashboardContactStats() {
  const totalElement =
    document.getElementById(
      "stat-contacts"
    );

  if (!totalElement) {
    return;
  }

  try {
    const response =
      await adminAPIRequest(
        "/api/contact"
      );

    const data =
      normalizeAPIResponse(
        response
      );

    const contacts =
      extractArrayData(
        data,
        [
          "contacts",
          "items",
          "results"
        ]
      );

    const total =
      data.total ??
      data.totalContacts ??
      contacts.length;

    updateDashboardStat(
      "stat-contacts",
      total
    );

    return total;
  } catch (error) {
    console.error(
      "Contact statistics error:",
      error
    );

    updateDashboardStat(
      "stat-contacts",
      "-"
    );

    return 0;
  }
}


// ========================================
// REFRESH ALL DASHBOARD STATS
// ========================================

async function refreshDashboardStats() {
  const results =
    await Promise.allSettled([
      loadDashboardStats(),
      loadDashboardContactStats()
    ]);

  return results;
}


// ========================================
// CALCULATE NEWS COUNTS
// ========================================

function calculateNewsStatistics(
  news
) {
  if (
    !Array.isArray(news)
  ) {
    return {
      total: 0,
      published: 0,
      draft: 0,
      breaking: 0,
      trending: 0,
      featured: 0
    };
  }

  const published =
    news.filter(
      (item) =>
        item &&
        item.isPublished === true
    ).length;

  const draft =
    news.filter(
      (item) =>
        !item ||
        item.isPublished !== true
    ).length;

  const breaking =
    news.filter(
      (item) =>
        item &&
        item.isBreaking === true
    ).length;

  const trending =
    news.filter(
      (item) =>
        item &&
        item.isTrending === true
    ).length;

  const featured =
    news.filter(
      (item) =>
        item &&
        item.isFeatured === true
    ).length;

  return {
    total: news.length,
    published,
    draft,
    breaking,
    trending,
    featured
  };
}


// ========================================
// UPDATE DASHBOARD GREETING
// ========================================

function updateDashboardGreeting() {
  const element =
    document.getElementById(
      "dashboard-admin-name"
    );

  if (!element) {
    return;
  }

  const admin =
    adminState.currentAdmin ||
    adminState.admin ||
    null;

  const name =
    admin?.name ||
    admin?.fullName ||
    admin?.adminId ||
    "एडमिन";

  element.textContent =
    name;
}


// ========================================
// DASHBOARD DATE / TIME
// ========================================

function getDashboardDateTime() {
  const now =
    new Date();

  return formatDateTime(
    now.toISOString()
  );
}


// ========================================
// UPDATE DASHBOARD TIME
// ========================================

function updateDashboardTime() {
  const elements =
    document.querySelectorAll(
      "[data-dashboard-time]"
    );

  const value =
    getDashboardDateTime();

  elements.forEach(
    (element) => {
      element.textContent =
        value;
    }
  );
}


// ========================================
// DASHBOARD AUTO TIME
// ========================================

let dashboardTimeInterval =
  null;

function startDashboardClock() {
  if (
    dashboardTimeInterval
  ) {
    clearInterval(
      dashboardTimeInterval
    );
  }

  updateDashboardTime();

  dashboardTimeInterval =
    setInterval(
      updateDashboardTime,
      60000
    );
}

function stopDashboardClock() {
  if (
    dashboardTimeInterval
  ) {
    clearInterval(
      dashboardTimeInterval
    );

    dashboardTimeInterval =
      null;
  }
}


// ========================================
// NEWS PREVIEW
// ========================================

function openNewsPreview(
  news
) {
  if (!news) {
    showAdminToast(
      "error",
      "न्यूज़ उपलब्ध नहीं",
      "न्यूज़ की जानकारी प्राप्त नहीं हुई।"
    );

    return;
  }

  const title =
    news.title ||
    "बिना शीर्षक";

  const category =
    news.category ||
    "राजस्थान";

  const summary =
    news.summary ||
    "";

  const content =
    news.content ||
    "";

  const image =
    news.image ||
    "";

  const status =
    news.isPublished === true
      ? "प्रकाशित"
      : "ड्राफ्ट";

  const body = `
    <div class="admin-news-preview">

      ${
        image
          ? `
            <div class="admin-news-preview-image">
              <img
                src="${escapeHTML(image)}"
                alt="${escapeHTML(title)}"
                loading="lazy"
              >
            </div>
          `
          : ""
      }

      <div class="admin-news-preview-meta">
        <span>
          ${escapeHTML(category)}
        </span>

        <span>
          ${escapeHTML(status)}
        </span>
      </div>

      <h2 class="admin-news-preview-title">
        ${escapeHTML(title)}
      </h2>

      ${
        summary
          ? `
            <p class="admin-news-preview-summary">
              ${escapeHTML(summary)}
            </p>
          `
          : ""
      }

      ${
        content
          ? `
            <div class="admin-news-preview-content">
              ${escapeHTML(
                stripHTML(content)
              )}
            </div>
          `
          : ""
      }

    </div>
  `;

  openAdminModal({
    icon: "📰",
    eyebrow: "न्यूज़ प्रीव्यू",
    title: title,
    body: body,
    confirmText: "संपादन करें",
    cancelText: "बंद करें",
    onConfirm: () => {
      openNewsEditor(
        news
      );
    }
  });
}


// ========================================
// STRIP HTML
// ========================================

function stripHTML(
  value
) {
  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  const temporary =
    document.createElement(
      "div"
    );

  temporary.innerHTML =
    String(value);

  return (
    temporary.textContent ||
    temporary.innerText ||
    ""
  );
}


// ========================================
// DASHBOARD SECTION INITIALIZER
// ========================================

function initializeDashboardSection() {
  updateDashboardGreeting();
  initializeDashboardControls();
  initializeDashboardNewsLink();
  startDashboardClock();
}


// ========================================
// DASHBOARD DATA LOADED EVENT
// ========================================

function handleDashboardLoaded() {
  updateDashboardGreeting();
  updateDashboardTime();

  const dashboard =
    adminState.dashboard;

  if (
    dashboard &&
    Array.isArray(
      dashboard.recentNews
    )
  ) {
    renderDashboardRecentNews(
      dashboard.recentNews
    );
  }
}


// ========================================
// DASHBOARD QUICK REFRESH
// ========================================

async function quickRefreshDashboard() {
  try {
    await Promise.allSettled([
      loadDashboardStats(),
      loadDashboardRecentNews(),
      checkDashboardSystemStatus()
    ]);

    handleDashboardLoaded();
  } catch (error) {
    console.error(
      "Quick dashboard refresh error:",
      error
    );
  }
}


// ========================================
// DASHBOARD ERROR HANDLER
// ========================================

function handleDashboardError(
  error
) {
  console.error(
    "Dashboard error:",
    error
  );

  const message =
    error?.message ||
    "डैशबोर्ड लोड नहीं हो पाया।";

  showAdminToast(
    "error",
    "डैशबोर्ड त्रुटि",
    message
  );
}


// ========================================
// DASHBOARD CLEANUP
// ========================================

function cleanupDashboard() {
  stopDashboardClock();
}


// ========================================
// DASHBOARD VISIBILITY HANDLER
// ========================================

function handleDashboardVisibility() {
  const section =
    document.getElementById(
      "section-dashboard"
    );

  if (!section) {
    return;
  }

  const isActive =
    section.classList.contains(
      "active"
    ) ||
    !section.hidden;

  if (isActive) {
    startDashboardClock();
  } else {
    stopDashboardClock();
  }
}


// ========================================
// DASHBOARD INITIAL LOAD
// ========================================

async function initializeDashboardData() {
  if (
    !adminState.isAuthenticated
  ) {
    return;
  }

  initializeDashboardSection();

  try {
    await loadDashboard();

    await loadDashboardContactStats();

    handleDashboardLoaded();
  } catch (error) {
    handleDashboardError(
      error
    );
  }
}
// ========================================
// ADMIN.JS
// PART 10 / 25
// NEWS STATE + FILTER INITIALIZATION
// ========================================


// ========================================
// NEWS STATE
// ========================================

if (!adminState.news) {
  adminState.news = {
    items: [],
    filteredItems: [],
    selectedIds: [],
    search: "",
    category: "",
    status: "",
    sort: "newest",
    page: 1,
    limit: 10,
    total: 0,
    loading: false,
    loaded: false
  };
}


// ========================================
// NEWS CATEGORIES
// ========================================

const ADMIN_NEWS_CATEGORIES = [
  "राजस्थान",
  "जयपुर",
  "जोधपुर",
  "उदयपुर",
  "कोटा",
  "अजमेर",
  "बीकानेर",
  "अलवर",
  "भरतपुर",
  "सीकर",
  "शिक्षा",
  "राजनीति",
  "अपराध",
  "खेल",
  "मनोरंजन",
  "बिजनेस",
  "स्वास्थ्य",
  "मौसम",
  "अन्य"
];


// ========================================
// NEWS FILTER ELEMENTS
// ========================================

function getNewsFilterElements() {
  return {
    search:
      document.getElementById(
        "news-search"
      ),

    category:
      document.getElementById(
        "news-category-filter"
      ),

    status:
      document.getElementById(
        "news-status-filter"
      ),

    sort:
      document.getElementById(
        "news-sort-filter"
      )
  };
}


// ========================================
// INITIALIZE NEWS FILTERS
// ========================================

function initializeNewsFilters() {
  const filters =
    getNewsFilterElements();

  populateNewsCategoryFilter(
    filters.category
  );

  if (filters.search) {
    filters.search.addEventListener(
      "input",
      debounceAdminFunction(
        () => {
          adminState.news.search =
            filters.search.value
              .trim();

          adminState.news.page = 1;

          applyNewsFilters();
        },
        300
      )
    );
  }

  if (filters.category) {
    filters.category.addEventListener(
      "change",
      () => {
        adminState.news.category =
          filters.category.value;

        adminState.news.page = 1;

        applyNewsFilters();
      }
    );
  }

  if (filters.status) {
    filters.status.addEventListener(
      "change",
      () => {
        adminState.news.status =
          filters.status.value;

        adminState.news.page = 1;

        applyNewsFilters();
      }
    );
  }

  if (filters.sort) {
    filters.sort.addEventListener(
      "change",
      () => {
        adminState.news.sort =
          filters.sort.value;

        adminState.news.page = 1;

        applyNewsFilters();
      }
    );
  }
}


// ========================================
// POPULATE CATEGORY FILTER
// ========================================

function populateNewsCategoryFilter(
  select
) {
  if (!select) {
    return;
  }

  const currentValue =
    select.value;

  const existingOptions =
    Array.from(
      select.options
    ).map(
      (option) =>
        option.value
    );

  ADMIN_NEWS_CATEGORIES.forEach(
    (category) => {
      if (
        !existingOptions.includes(
          category
        )
      ) {
        const option =
          document.createElement(
            "option"
          );

        option.value =
          category;

        option.textContent =
          category;

        select.appendChild(
          option
        );
      }
    }
  );

  if (
    currentValue &&
    ADMIN_NEWS_CATEGORIES.includes(
      currentValue
    )
  ) {
    select.value =
      currentValue;
  }
}


// ========================================
// DEBOUNCE HELPER
// ========================================

function debounceAdminFunction(
  callback,
  delay = 300
) {
  let timer = null;

  return function (...args) {
    clearTimeout(
      timer
    );

    timer = setTimeout(
      () => {
        callback.apply(
          this,
          args
        );
      },
      delay
    );
  };
}


// ========================================
// NEWS FILTER APPLICATION
// ========================================

function applyNewsFilters() {
  const state =
    adminState.news;

  if (!state) {
    return;
  }

  let items =
    Array.isArray(
      state.items
    )
      ? [...state.items]
      : [];

  const search =
    String(
      state.search || ""
    )
      .trim()
      .toLowerCase();

  const category =
    state.category || "";

  const status =
    state.status || "";

  if (search) {
    items =
      items.filter(
        (item) => {
          const searchableText = [
            item.title,
            item.summary,
            item.content,
            item.category,
            item.district,
            item.location,
            item.author,
            ...(Array.isArray(
              item.tags
            )
              ? item.tags
              : [])
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

          return searchableText.includes(
            search
          );
        }
      );
  }

  if (category) {
    items =
      items.filter(
        (item) =>
          item.category ===
          category
      );
  }

  if (status) {
    items =
      items.filter(
        (item) =>
          getNewsStatus(
            item
          ) === status
      );
  }

  items =
    sortNewsItems(
      items,
      state.sort
    );

  state.filteredItems =
    items;

  state.total =
    items.length;

  renderNewsTable();

  updateNewsResultCount();

  updateNewsPagination();
}


// ========================================
// NEWS SORTING
// ========================================

function sortNewsItems(
  items,
  sort
) {
  if (
    !Array.isArray(items)
  ) {
    return [];
  }

  return items.sort(
    (a, b) => {
      const dateA =
        new Date(
          a.createdAt ||
          a.updatedAt ||
          0
        ).getTime();

      const dateB =
        new Date(
          b.createdAt ||
          b.updatedAt ||
          0
        ).getTime();

      if (
        sort === "oldest"
      ) {
        return dateA - dateB;
      }

      if (
        sort === "title-asc"
      ) {
        return String(
          a.title || ""
        ).localeCompare(
          String(
            b.title || ""
          ),
          "hi"
        );
      }

      if (
        sort === "title-desc"
      ) {
        return String(
          b.title || ""
        ).localeCompare(
          String(
            a.title || ""
          ),
          "hi"
        );
      }

      if (
        sort === "views"
      ) {
        return (
          Number(
            b.views || 0
          ) -
          Number(
            a.views || 0
          )
        );
      }

      return dateB - dateA;
    }
  );
}


// ========================================
// GET NEWS STATUS
// ========================================

function getNewsStatus(
  item
) {
  if (!item) {
    return "draft";
  }

  if (
    item.isPublished === true
  ) {
    return "published";
  }

  if (
    item.scheduledAt &&
    new Date(
      item.scheduledAt
    ).getTime() >
      Date.now()
  ) {
    return "scheduled";
  }

  return "draft";
}


// ========================================
// NEWS STATUS LABEL
// ========================================

function getNewsStatusLabel(
  status
) {
  const labels = {
    published: "प्रकाशित",
    draft: "ड्राफ्ट",
    scheduled: "शेड्यूल"
  };

  return (
    labels[status] ||
    "ड्राफ्ट"
  );
}


// ========================================
// NEWS STATE RESET
// ========================================

function resetNewsState() {
  adminState.news = {
    items: [],
    filteredItems: [],
    selectedIds: [],
    search: "",
    category: "",
    status: "",
    sort: "newest",
    page: 1,
    limit: 10,
    total: 0,
    loading: false,
    loaded: false
  };

  const filters =
    getNewsFilterElements();

  if (filters.search) {
    filters.search.value =
      "";
  }

  if (filters.category) {
    filters.category.value =
      "";
  }

  if (filters.status) {
    filters.status.value =
      "";
  }

  if (filters.sort) {
    filters.sort.value =
      "newest";
  }
}


// ========================================
// INITIALIZE NEWS SECTION
// ========================================

function initializeNewsSection() {
  initializeNewsFilters();

  const refreshButton =
    document.getElementById(
      "news-refresh-button"
    );

  if (refreshButton) {
    refreshButton.addEventListener(
      "click",
      () => {
        if (
          typeof loadNews ===
          "function"
        ) {
          loadNews(true);
        }
      }
    );
  }

  const createButton =
    document.getElementById(
      "create-news-button"
    );

  if (createButton) {
    createButton.addEventListener(
      "click",
      () => {
        if (
          typeof requireAdminPermission ===
          "function" &&
          !requireAdminPermission(
            "news.create"
          )
        ) {
          return;
        }

        if (
          typeof openNewsEditor ===
          "function"
        ) {
          openNewsEditor();
        }
      }
    );
  }
}


// ========================================
// NEWS FILTER CLEAR
// ========================================

function clearNewsFilters() {
  const filters =
    getNewsFilterElements();

  if (filters.search) {
    filters.search.value =
      "";
  }

  if (filters.category) {
    filters.category.value =
      "";
  }

  if (filters.status) {
    filters.status.value =
      "";
  }

  if (filters.sort) {
    filters.sort.value =
      "newest";
  }

  adminState.news.search =
    "";

  adminState.news.category =
    "";

  adminState.news.status =
    "";

  adminState.news.sort =
    "newest";

  adminState.news.page =
    1;

  applyNewsFilters();
}


// ========================================
// NEWS RESULT COUNT
// ========================================

function updateNewsResultCount() {
  const element =
    document.getElementById(
      "news-result-count"
    );

  if (!element) {
    return;
  }

  const total =
    adminState.news?.total ||
    0;

  element.textContent =
    `${total} न्यूज़`;
}


// ========================================
// NEWS LOADING STATE
// ========================================

function setNewsLoadingState(
  loading
) {
  const loadingState =
    document.getElementById(
      "news-loading-state"
    );

  const emptyState =
    document.getElementById(
      "news-empty-state"
    );

  const table =
    document.getElementById(
      "news-table"
    );

  if (loadingState) {
    loadingState.classList.toggle(
      "hidden",
      !loading
    );
  }

  if (loading) {
    if (emptyState) {
      emptyState.classList.add(
        "hidden"
      );
    }

    if (table) {
      table.classList.add(
        "is-loading"
      );
    }
  } else {
    if (table) {
      table.classList.remove(
        "is-loading"
      );
    }
  }
}


// ========================================
// NEWS SECTION VISIBILITY
// ========================================

function updateNewsEmptyState() {
  const emptyState =
    document.getElementById(
      "news-empty-state"
    );

  const loadingState =
    document.getElementById(
      "news-loading-state"
    );

  const items =
    adminState.news?.filteredItems ||
    [];

  if (!emptyState) {
    return;
  }

  if (
    loadingState &&
    !loadingState.classList.contains(
      "hidden"
    )
  ) {
    emptyState.classList.add(
      "hidden"
    );

    return;
  }

  emptyState.classList.toggle(
    "hidden",
    items.length !== 0
  );
      }
// ========================================
// ADMIN.JS
// PART 11 / 25
// NEWS FETCH + NORMALIZE + RENDER
// ========================================


// ========================================
// LOAD NEWS
// ========================================

async function loadNews(
  forceRefresh = false
) {
  if (
    !adminState.isAuthenticated
  ) {
    return;
  }

  const state =
    adminState.news;

  if (
    state.loading &&
    !forceRefresh
  ) {
    return;
  }

  state.loading = true;

  setNewsLoadingState(
    true
  );

  try {
    const response =
      await adminAPIRequest(
        "/api/news?limit=100"
      );

    const data =
      normalizeAPIResponse(
        response
      );

    const news =
      extractArrayData(
        data,
        [
          "news",
          "items",
          "results"
        ]
      );

    state.items =
      news.map(
        normalizeNewsItem
      );

    state.loaded =
      true;

    state.page =
      1;

    applyNewsFilters();

    return state.items;
  } catch (error) {
    console.error(
      "News loading error:",
      error
    );

    state.items = [];
    state.filteredItems = [];
    state.total = 0;

    renderNewsTable();

    updateNewsResultCount();

    updateNewsPagination();

    showAdminToast(
      "error",
      "न्यूज़ लोड नहीं हुई",
      error?.message ||
        "न्यूज़ डेटा प्राप्त करने में समस्या हुई।"
    );

    return [];
  } finally {
    state.loading =
      false;

    setNewsLoadingState(
      false
    );

    updateNewsEmptyState();
  }
}


// ========================================
// NORMALIZE NEWS ITEM
// ========================================

function normalizeNewsItem(
  item
) {
  if (!item) {
    return {
      _id: "",
      id: "",
      title: "",
      slug: "",
      summary: "",
      content: "",
      image: "",
      category: "",
      district: "",
      location: "",
      author: "",
      authorId: "",
      tags: [],
      isBreaking: false,
      isTrending: false,
      isFeatured: false,
      isPublished: false,
      views: 0,
      scheduledAt: null,
      createdAt: null,
      updatedAt: null
    };
  }

  const id =
    getObjectId(
      item
    );

  let author = "";

  if (
    typeof item.author ===
    "string"
  ) {
    author =
      item.author;
  } else if (
    item.author &&
    typeof item.author ===
      "object"
  ) {
    author =
      item.author.name ||
      item.author.fullName ||
      item.author.username ||
      "";
  }

  let tags =
    Array.isArray(
      item.tags
    )
      ? item.tags
      : [];

  tags =
    tags
      .map(
        (tag) =>
          String(tag).trim()
      )
      .filter(Boolean);

  return {
    ...item,

    _id:
      item._id || id,

    id:
      item.id || id,

    title:
      String(
        item.title || ""
      ),

    slug:
      String(
        item.slug || ""
      ),

    summary:
      String(
        item.summary || ""
      ),

    content:
      String(
        item.content || ""
      ),

    image:
      String(
        item.image || ""
      ),

    category:
      String(
        item.category ||
        "राजस्थान"
      ),

    district:
      String(
        item.district || ""
      ),

    location:
      String(
        item.location || ""
      ),

    author,

    authorId:
      getObjectId(
        item.authorId
      ) ||
      String(
        item.authorId || ""
      ),

    tags,

    isBreaking:
      item.isBreaking === true,

    isTrending:
      item.isTrending === true,

    isFeatured:
      item.isFeatured === true,

    isPublished:
      item.isPublished === true,

    views:
      Number(
        item.views || 0
      ),

    scheduledAt:
      item.scheduledAt ||
      null,

    createdAt:
      item.createdAt ||
      null,

    updatedAt:
      item.updatedAt ||
      null
  };
}


// ========================================
// RENDER NEWS TABLE
// ========================================

function renderNewsTable() {
  const tbody =
    document.getElementById(
      "news-table-body"
    );

  if (!tbody) {
    return;
  }

  tbody.innerHTML = "";

  const state =
    adminState.news;

  const items =
    Array.isArray(
      state.filteredItems
    )
      ? state.filteredItems
      : [];

  const page =
    Math.max(
      1,
      Number(
        state.page || 1
      )
    );

  const limit =
    Math.max(
      1,
      Number(
        state.limit || 10
      )
    );

  const start =
    (page - 1) *
    limit;

  const pageItems =
    items.slice(
      start,
      start + limit
    );

  if (
    pageItems.length === 0
  ) {
    updateNewsEmptyState();

    return;
  }

  pageItems.forEach(
    (item) => {
      const row =
        createNewsTableRow(
          item
        );

      tbody.appendChild(
        row
      );
    }
  );

  updateNewsEmptyState();
}


// ========================================
// CREATE NEWS TABLE ROW
// ========================================

function createNewsTableRow(
  item
) {
  const row =
    document.createElement(
      "tr"
    );

  const id =
    getObjectId(
      item
    );

  const title =
    item.title ||
    "बिना शीर्षक";

  const category =
    item.category ||
    "राजस्थान";

  const status =
    getNewsStatus(
      item
    );

  const statusLabel =
    getNewsStatusLabel(
      status
    );

  const date =
    formatDateTime(
      item.createdAt
    );

  const views =
    Number(
      item.views || 0
    );

  row.dataset.newsId =
    id;

  row.innerHTML = `
    <td class="news-select-cell">
      <input
        type="checkbox"
        class="news-row-checkbox"
        data-news-id="${escapeHTML(id)}"
        ${
          adminState.news.selectedIds.includes(
            id
          )
            ? "checked"
            : ""
        }
        aria-label="न्यूज़ चुनें"
      >
    </td>

    <td class="news-title-cell">
      <div class="news-table-title">
        ${escapeHTML(title)}
      </div>

      ${
        item.summary
          ? `
            <div class="news-table-summary">
              ${escapeHTML(
                truncateText(
                  stripHTML(
                    item.summary
                  ),
                  100
                )
              )}
            </div>
          `
          : ""
      }
    </td>

    <td>
      <span class="news-category-badge">
        ${escapeHTML(category)}
      </span>
    </td>

    <td>
      <span
        class="news-status-badge ${escapeHTML(
          status
        )}"
      >
        ${escapeHTML(
          statusLabel
        )}
      </span>
    </td>

    <td>
      ${escapeHTML(
        String(views)
      )}
    </td>

    <td>
      ${escapeHTML(
        date
      )}
    </td>

    <td class="news-actions-cell">
      <div class="news-row-actions">

        <button
          type="button"
          class="admin-btn admin-btn-small"
          data-news-action="view"
          data-news-id="${escapeHTML(id)}"
        >
          देखें
        </button>

        <button
          type="button"
          class="admin-btn admin-btn-small"
          data-news-action="edit"
          data-news-id="${escapeHTML(id)}"
          data-permission="news.update"
        >
          संपादित करें
        </button>

        <button
          type="button"
          class="admin-btn admin-btn-small admin-btn-danger"
          data-news-action="delete"
          data-news-id="${escapeHTML(id)}"
          data-permission="news.delete"
        >
          हटाएँ
        </button>

      </div>
    </td>
  `;

  initializeNewsRowEvents(
    row,
    item
  );

  return row;
}


// ========================================
// NEWS ROW EVENTS
// ========================================

function initializeNewsRowEvents(
  row,
  item
) {
  const checkbox =
    row.querySelector(
      ".news-row-checkbox"
    );

  if (checkbox) {
    checkbox.addEventListener(
      "change",
      () => {
        toggleNewsSelection(
          getObjectId(item),
          checkbox.checked
        );
      }
    );
  }

  const actionButtons =
    row.querySelectorAll(
      "[data-news-action]"
    );

  actionButtons.forEach(
    (button) => {
      button.addEventListener(
        "click",
        () => {
          const action =
            button.dataset.newsAction;

          handleNewsRowAction(
            action,
            item
          );
        }
      );
    }
  );
}


// ========================================
// HANDLE NEWS ACTION
// ========================================

function handleNewsRowAction(
  action,
  item
) {
  if (!item) {
    return;
  }

  if (
    action === "view"
  ) {
    openNewsPreview(
      item
    );

    return;
  }

  if (
    action === "edit"
  ) {
    if (
      !requireAdminPermission(
        "news.update"
      )
    ) {
      return;
    }

    openNewsEditor(
      item
    );

    return;
  }

  if (
    action === "delete"
  ) {
    if (
      !requireAdminPermission(
        "news.delete"
      )
    ) {
      return;
    }

    confirmDeleteNews(
      item
    );
  }
}


// ========================================
// TRUNCATE TEXT
// ========================================

function truncateText(
  text,
  maxLength = 100
) {
  const value =
    String(
      text || ""
    ).trim();

  if (
    value.length <=
    maxLength
  ) {
    return value;
  }

  return (
    value.substring(
      0,
      Math.max(
        0,
        maxLength - 3
      )
    ) + "..."
  );
}


// ========================================
// NEWS IMAGE URL
// ========================================

function getNewsImageURL(
  item
) {
  if (!item) {
    return "";
  }

  const image =
    item.image ||
    item.thumbnail ||
    item.imageUrl ||
    "";

  if (!image) {
    return "";
  }

  if (
    image.startsWith(
      "http://"
    ) ||
    image.startsWith(
      "https://"
    ) ||
    image.startsWith(
      "data:"
    ) ||
    image.startsWith(
      "blob:"
    )
  ) {
    return image;
  }

  
const baseURL =
  ADMIN_API_ROOT;
  if (
    image.startsWith("/")
  ) {
    return (
      baseURL + image
    );
  }

  return (
    baseURL +
    "/" +
    image
  );
}


// ========================================
// NEWS FEATURE LABELS
// ========================================

function getNewsFeatureLabels(
  item
) {
  const labels = [];

  if (
    item?.isBreaking === true
  ) {
    labels.push(
      "ब्रेकिंग"
    );
  }

  if (
    item?.isTrending === true
  ) {
    labels.push(
      "ट्रेंडिंग"
    );
  }

  if (
    item?.isFeatured === true
  ) {
    labels.push(
      "फीचर्ड"
    );
  }

  return labels;
}


// ========================================
// INITIALIZE NEWS DATA
// ========================================

function initializeNewsData() {
  if (
    !adminState.news
  ) {
    adminState.news = {
      items: [],
      filteredItems: [],
      selectedIds: [],
      search: "",
      category: "",
      status: "",
      sort: "newest",
      page: 1,
      limit: 10,
      total: 0,
      loading: false,
      loaded: false
    };
  }

  initializeNewsSection();
       }
// ========================================
// ADMIN.JS
// PART 12 / 25
// NEWS PAGINATION + SELECTION + VIEW
// ========================================


// ========================================
// UPDATE NEWS PAGINATION
// ========================================

function updateNewsPagination() {
  const state =
    adminState.news;

  if (!state) {
    return;
  }

  const total =
    Number(
      state.filteredItems?.length ||
      0
    );

  const limit =
    Math.max(
      1,
      Number(
        state.limit || 10
      )
    );

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        total / limit
      )
    );

  if (
    state.page >
    totalPages
  ) {
    state.page =
      totalPages;
  }

  if (
    state.page < 1
  ) {
    state.page = 1;
  }

  const pagination =
    document.getElementById(
      "news-pagination"
    );

  const info =
    document.getElementById(
      "news-pagination-info"
    );

  const previous =
    document.getElementById(
      "news-prev-page"
    );

  const next =
    document.getElementById(
      "news-next-page"
    );

  const pageNumber =
    document.getElementById(
      "news-page-number"
    );

  const start =
    total === 0
      ? 0
      : (
          (state.page - 1) *
            limit
        ) + 1;

  const end =
    Math.min(
      state.page * limit,
      total
    );

  if (info) {
    info.textContent =
      total === 0
        ? "0 में से 0"
        : `${start}-${end} में से ${total}`;
  }

  if (pageNumber) {
    pageNumber.textContent =
      `${state.page} / ${totalPages}`;
  }

  if (previous) {
    previous.disabled =
      state.page <= 1;
  }

  if (next) {
    next.disabled =
      state.page >= totalPages;
  }

  if (pagination) {
    pagination.classList.toggle(
      "hidden",
      total === 0
    );
  }
}


// ========================================
// GO TO NEWS PAGE
// ========================================

function goToNewsPage(
  page
) {
  const state =
    adminState.news;

  if (!state) {
    return;
  }

  const total =
    Number(
      state.filteredItems?.length ||
      0
    );

  const limit =
    Math.max(
      1,
      Number(
        state.limit || 10
      )
    );

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        total / limit
      )
    );

  const requestedPage =
    Number(page);

  if (
    !Number.isFinite(
      requestedPage
    )
  ) {
    return;
  }

  state.page =
    Math.min(
      Math.max(
        1,
        requestedPage
      ),
      totalPages
    );

  renderNewsTable();

  updateNewsPagination();

  scrollToNewsTable();
}


// ========================================
// PREVIOUS NEWS PAGE
// ========================================

function goToPreviousNewsPage() {
  const currentPage =
    Number(
      adminState.news?.page ||
      1
    );

  if (
    currentPage > 1
  ) {
    goToNewsPage(
      currentPage - 1
    );
  }
}


// ========================================
// NEXT NEWS PAGE
// ========================================

function goToNextNewsPage() {
  const state =
    adminState.news;

  if (!state) {
    return;
  }

  const total =
    Number(
      state.filteredItems?.length ||
      0
    );

  const limit =
    Math.max(
      1,
      Number(
        state.limit || 10
      )
    );

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        total / limit
      )
    );

  const currentPage =
    Number(
      state.page || 1
    );

  if (
    currentPage <
    totalPages
  ) {
    goToNewsPage(
      currentPage + 1
    );
  }
}


// ========================================
// SCROLL TO NEWS TABLE
// ========================================

function scrollToNewsTable() {
  const table =
    document.getElementById(
      "news-table"
    );

  if (!table) {
    return;
  }

  try {
    table.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  } catch (error) {
    table.scrollIntoView();
  }
}


// ========================================
// INITIALIZE NEWS PAGINATION
// ========================================

function initializeNewsPagination() {
  const previous =
    document.getElementById(
      "news-prev-page"
    );

  const next =
    document.getElementById(
      "news-next-page"
    );

  if (previous) {
    previous.addEventListener(
      "click",
      goToPreviousNewsPage
    );
  }

  if (next) {
    next.addEventListener(
      "click",
      goToNextNewsPage
    );
  }

  updateNewsPagination();
}


// ========================================
// NEWS SELECT ALL
// ========================================

function initializeNewsSelection() {
  const selectAll =
    document.getElementById(
      "news-select-all"
    );

  const selectAllButton =
    document.getElementById(
      "news-select-all-button"
    );

  if (selectAll) {
    selectAll.addEventListener(
      "change",
      () => {
        toggleSelectAllNews(
          selectAll.checked
        );
      }
    );
  }

  if (selectAllButton) {
    selectAllButton.addEventListener(
      "click",
      () => {
        const allSelected =
          areAllVisibleNewsSelected();

        toggleSelectAllNews(
          !allSelected
        );
      }
    );
  }
}


// ========================================
// TOGGLE NEWS SELECTION
// ========================================

function toggleNewsSelection(
  newsId,
  selected
) {
  if (!newsId) {
    return;
  }

  const state =
    adminState.news;

  if (!state) {
    return;
  }

  const index =
    state.selectedIds.indexOf(
      newsId
    );

  if (
    selected &&
    index === -1
  ) {
    state.selectedIds.push(
      newsId
    );
  }

  if (
    !selected &&
    index !== -1
  ) {
    state.selectedIds.splice(
      index,
      1
    );
  }

  updateNewsSelectionUI();
}


// ========================================
// SELECT ALL VISIBLE NEWS
// ========================================

function toggleSelectAllNews(
  selected
) {
  const state =
    adminState.news;

  if (!state) {
    return;
  }

  const items =
    getCurrentNewsPageItems();

  items.forEach(
    (item) => {
      const id =
        getObjectId(
          item
        );

      if (!id) {
        return;
      }

      const index =
        state.selectedIds.indexOf(
          id
        );

      if (
        selected &&
        index === -1
      ) {
        state.selectedIds.push(
          id
        );
      }

      if (
        !selected &&
        index !== -1
      ) {
        state.selectedIds.splice(
          index,
          1
        );
      }
    }
  );

  updateNewsSelectionUI();

  renderNewsTable();
}


// ========================================
// GET CURRENT NEWS PAGE ITEMS
// ========================================

function getCurrentNewsPageItems() {
  const state =
    adminState.news;

  if (!state) {
    return [];
  }

  const items =
    Array.isArray(
      state.filteredItems
    )
      ? state.filteredItems
      : [];

  const page =
    Math.max(
      1,
      Number(
        state.page || 1
      )
    );

  const limit =
    Math.max(
      1,
      Number(
        state.limit || 10
      )
    );

  const start =
    (page - 1) *
    limit;

  return items.slice(
    start,
    start + limit
  );
}


// ========================================
// CHECK ALL VISIBLE SELECTED
// ========================================

function areAllVisibleNewsSelected() {
  const items =
    getCurrentNewsPageItems();

  if (
    items.length === 0
  ) {
    return false;
  }

  return items.every(
    (item) =>
      adminState.news.selectedIds.includes(
        getObjectId(
          item
        )
      )
  );
}


// ========================================
// UPDATE SELECTION UI
// ========================================

function updateNewsSelectionUI() {
  const state =
    adminState.news;

  if (!state) {
    return;
  }

  const selectedCount =
    state.selectedIds.length;

  const selectAll =
    document.getElementById(
      "news-select-all"
    );

  const visibleItems =
    getCurrentNewsPageItems();

  const visibleSelected =
    visibleItems.filter(
      (item) =>
        state.selectedIds.includes(
          getObjectId(
            item
          )
        )
    ).length;

  if (selectAll) {
    selectAll.checked =
      visibleItems.length > 0 &&
      visibleSelected ===
        visibleItems.length;

    selectAll.indeterminate =
      visibleSelected > 0 &&
      visibleSelected <
        visibleItems.length;
  }

  const checkboxes =
    document.querySelectorAll(
      ".news-row-checkbox"
    );

  checkboxes.forEach(
    (checkbox) => {
      const id =
        checkbox.dataset.newsId ||
        "";

      checkbox.checked =
        state.selectedIds.includes(
          id
        );
    }
  );

  updateSelectedNewsCount(
    selectedCount
  );
}


// ========================================
// SELECTED NEWS COUNT
// ========================================

function updateSelectedNewsCount(
  count
) {
  const elements =
    document.querySelectorAll(
      "[data-selected-news-count]"
    );

  elements.forEach(
    (element) => {
      element.textContent =
        String(
          count || 0
        );
    }
  );
}


// ========================================
// CLEAR NEWS SELECTION
// ========================================

function clearNewsSelection() {
  if (
    !adminState.news
  ) {
    return;
  }

  adminState.news.selectedIds =
    [];

  updateNewsSelectionUI();

  renderNewsTable();
}


// ========================================
// GET SELECTED NEWS
// ========================================

function getSelectedNewsItems() {
  const selectedIds =
    adminState.news?.selectedIds ||
    [];

  const items =
    adminState.news?.items ||
    [];

  return items.filter(
    (item) =>
      selectedIds.includes(
        getObjectId(
          item
        )
      )
  );
}


// ========================================
// GET SELECTED NEWS IDS
// ========================================

function getSelectedNewsIds() {
  return [
    ...(adminState.news?.selectedIds ||
      [])
  ];
}


// ========================================
// NEWS TABLE KEYBOARD SUPPORT
// ========================================

function initializeNewsKeyboardSupport() {
  const table =
    document.getElementById(
      "news-table"
    );

  if (!table) {
    return;
  }

  table.addEventListener(
    "keydown",
    (event) => {
      if (
        event.key !==
        "Enter"
      ) {
        return;
      }

      const target =
        event.target;

      if (
        target.matches(
          "button"
        )
      ) {
        return;
      }

      const row =
        target.closest(
          "tr"
        );

      if (!row) {
        return;
      }

      const id =
        row.dataset.newsId;

      const item =
        adminState.news.items.find(
          (news) =>
            getObjectId(
              news
            ) === id
        );

      if (item) {
        openNewsPreview(
          item
        );
      }
    }
  );
}


// ========================================
// NEWS SECTION VIEW INITIALIZER
// ========================================

function initializeNewsViewControls() {
  initializeNewsPagination();

  initializeNewsSelection();

  initializeNewsKeyboardSupport();

  updateNewsSelectionUI();

  updateNewsPagination();
}


// ========================================
// NEWS DATA REFRESH AFTER CHANGE
// ========================================

async function refreshNewsAfterChange() {
  clearNewsSelection();

  if (
    typeof loadNews ===
    "function"
  ) {
    await loadNews(
      true
    );
  }

  if (
    typeof loadDashboardStats ===
    "function"
  ) {
    await loadDashboardStats();
  }
}


// ========================================
// FIND NEWS BY ID
// ========================================

function findNewsById(
  newsId
) {
  if (!newsId) {
    return null;
  }

  const items =
    adminState.news?.items ||
    [];

  return (
    items.find(
      (item) =>
        getObjectId(
          item
        ) ===
        String(newsId)
    ) || null
  );
}


// ========================================
// OPEN NEWS BY ID
// ========================================

function openNewsById(
  newsId
) {
  const item =
    findNewsById(
      newsId
    );

  if (!item) {
    showAdminToast(
      "error",
      "न्यूज़ नहीं मिली",
      "मांगी गई न्यूज़ उपलब्ध नहीं है।"
    );

    return;
  }

  openNewsPreview(
    item
  );
     }
// ========================================
// ADMIN.JS
// PART 13 / 25
// NEWS EDITOR FORM + VALIDATION
// ========================================


// ========================================
// NEWS EDITOR STATE
// ========================================

if (!adminState.newsEditor) {
  adminState.newsEditor = {
    mode: "create",
    editingId: null,
    imageFile: null,
    submitting: false
  };
}


// ========================================
// GET NEWS EDITOR ELEMENTS
// ========================================

function getNewsEditorElements() {
  return {
    modal:
      document.getElementById(
        "news-editor-modal"
      ),

    form:
      document.getElementById(
        "news-editor-form"
      ),

    id:
      document.getElementById(
        "news-id"
      ),

    title:
      document.getElementById(
        "news-title"
      ),

    slug:
      document.getElementById(
        "news-slug"
      ),

    summary:
      document.getElementById(
        "news-summary"
      ),

    content:
      document.getElementById(
        "news-content"
      ),

    category:
      document.getElementById(
        "news-category"
      ),

    district:
      document.getElementById(
        "news-district"
      ),

    location:
      document.getElementById(
        "news-location"
      ),

    author:
      document.getElementById(
        "news-author"
      ),

    tags:
      document.getElementById(
        "news-tags"
      ),

    image:
      document.getElementById(
        "news-image"
      ),

    imagePreview:
      document.getElementById(
        "news-image-preview"
      ),

    breaking:
      document.getElementById(
        "news-breaking"
      ),

    trending:
      document.getElementById(
        "news-trending"
      ),

    featured:
      document.getElementById(
        "news-featured"
      ),

    published:
      document.getElementById(
        "news-published"
      ),

    scheduledAt:
      document.getElementById(
        "news-scheduled-at"
      ),

    submit:
      document.getElementById(
        "news-editor-submit"
      ),

    cancel:
      document.getElementById(
        "news-editor-cancel"
      ),

    close:
      document.getElementById(
        "news-editor-close"
      )
  };
}


// ========================================
// OPEN NEWS EDITOR
// ========================================

function openNewsEditor(
  news = null
) {
  const elements =
    getNewsEditorElements();

  adminState.newsEditor =
    adminState.newsEditor || {
      mode: "create",
      editingId: null,
      imageFile: null,
      submitting: false
    };

  if (news) {
    adminState.newsEditor.mode =
      "edit";

    adminState.newsEditor.editingId =
      getObjectId(
        news
      );

    fillNewsEditor(
      news
    );
  } else {
    adminState.newsEditor.mode =
      "create";

    adminState.newsEditor.editingId =
      null;

    resetNewsEditor();
  }

  if (
    elements.modal
  ) {
    elements.modal.classList.add(
      "open"
    );

    elements.modal.classList.remove(
      "hidden"
    );

    elements.modal.setAttribute(
      "aria-hidden",
      "false"
    );
  } else {
    /*
     * यदि वर्तमान HTML में अलग editor modal
     * नहीं है, तो global admin modal का
     * उपयोग किया जाएगा।
     */
    openAdminModal({
      icon:
        news
          ? "✏️"
          : "📰",

      eyebrow:
        news
          ? "न्यूज़ संपादन"
          : "नई न्यूज़",

      title:
        news
          ? "न्यूज़ संपादित करें"
          : "नई न्यूज़ बनाने के लिए तैयार करें",

      body: `
        <p>
          न्यूज़ एडिटर के लिए
          <strong>news-editor-modal</strong>
          HTML संरचना उपलब्ध नहीं है।
        </p>

        <p>
          कृपया admin/index.html में
          न्यूज़ एडिटर फॉर्म जोड़ें।
        </p>
      `,

      confirmText:
        "बंद करें",

      cancelText:
        "रद्द करें"
    });
  }

  initializeNewsEditorFields();
}


// ========================================
// CLOSE NEWS EDITOR
// ========================================

function closeNewsEditor() {
  const elements =
    getNewsEditorElements();

  if (
    elements.modal
  ) {
    elements.modal.classList.remove(
      "open"
    );

    elements.modal.classList.add(
      "hidden"
    );

    elements.modal.setAttribute(
      "aria-hidden",
      "true"
    );
  }

  adminState.newsEditor =
    adminState.newsEditor || {};

  adminState.newsEditor.imageFile =
    null;

  adminState.newsEditor.editingId =
    null;

  adminState.newsEditor.mode =
    "create";
}


// ========================================
// RESET NEWS EDITOR
// ========================================

function resetNewsEditor() {
  const elements =
    getNewsEditorElements();

  if (
    elements.form
  ) {
    elements.form.reset();
  }

  if (
    elements.id
  ) {
    elements.id.value =
      "";
  }

  if (
    elements.slug
  ) {
    elements.slug.value =
      "";
  }

  if (
    elements.imagePreview
  ) {
    elements.imagePreview.innerHTML =
      "";
  }

  adminState.newsEditor =
    adminState.newsEditor || {};

  adminState.newsEditor.mode =
    "create";

  adminState.newsEditor.editingId =
    null;

  adminState.newsEditor.imageFile =
    null;

  updateNewsEditorSubmitButton();
}


// ========================================
// FILL NEWS EDITOR
// ========================================

function fillNewsEditor(
  news
) {
  if (!news) {
    return;
  }

  const elements =
    getNewsEditorElements();

  if (
    elements.id
  ) {
    elements.id.value =
      getObjectId(
        news
      );
  }

  if (
    elements.title
  ) {
    elements.title.value =
      news.title || "";
  }

  if (
    elements.slug
  ) {
    elements.slug.value =
      news.slug || "";
  }

  if (
    elements.summary
  ) {
    elements.summary.value =
      news.summary || "";
  }

  if (
    elements.content
  ) {
    elements.content.value =
      stripHTML(
        news.content || ""
      );
  }

  if (
    elements.category
  ) {
    elements.category.value =
      news.category || "";
  }

  if (
    elements.district
  ) {
    elements.district.value =
      news.district || "";
  }

  if (
    elements.location
  ) {
    elements.location.value =
      news.location || "";
  }

  if (
    elements.author
  ) {
    elements.author.value =
      news.author || "";
  }

  if (
    elements.tags
  ) {
    elements.tags.value =
      Array.isArray(
        news.tags
      )
        ? news.tags.join(
            ", "
          )
        : news.tags || "";
  }

  if (
    elements.breaking
  ) {
    elements.breaking.checked =
      news.isBreaking === true;
  }

  if (
    elements.trending
  ) {
    elements.trending.checked =
      news.isTrending === true;
  }

  if (
    elements.featured
  ) {
    elements.featured.checked =
      news.isFeatured === true;
  }

  if (
    elements.published
  ) {
    elements.published.checked =
      news.isPublished === true;
  }

  if (
    elements.scheduledAt
  ) {
    elements.scheduledAt.value =
      convertDateForInput(
        news.scheduledAt
      );
  }

  if (
    news.image
  ) {
    showNewsImagePreview(
      news.image
    );
  }

  updateNewsSlugPreview();
  updateNewsEditorSubmitButton();
}


// ========================================
// INITIALIZE NEWS EDITOR FIELDS
// ========================================

function initializeNewsEditorFields() {
  const elements =
    getNewsEditorElements();

  if (
    elements.title &&
    !elements.title.dataset.editorBound
  ) {
    elements.title.addEventListener(
      "input",
      () => {
        updateNewsSlugPreview();
      }
    );

    elements.title.dataset.editorBound =
      "true";
  }

  if (
    elements.image &&
    !elements.image.dataset.editorBound
  ) {
    elements.image.addEventListener(
      "change",
      handleNewsImageChange
    );

    elements.image.dataset.editorBound =
      "true";
  }

  if (
    elements.form &&
    !elements.form.dataset.editorBound
  ) {
    elements.form.addEventListener(
      "submit",
      handleNewsEditorSubmit
    );

    elements.form.dataset.editorBound =
      "true";
  }

  if (
    elements.cancel &&
    !elements.cancel.dataset.editorBound
  ) {
    elements.cancel.addEventListener(
      "click",
      closeNewsEditor
    );

    elements.cancel.dataset.editorBound =
      "true";
  }

  if (
    elements.close &&
    !elements.close.dataset.editorBound
  ) {
    elements.close.addEventListener(
      "click",
      closeNewsEditor
    );

    elements.close.dataset.editorBound =
      "true";
  }
}


// ========================================
// CREATE NEWS SLUG
// ========================================

function createNewsSlug(
  title
) {
  let slug =
    String(
      title || ""
    )
      .trim()
      .toLowerCase();

  slug =
    slug
      .replace(
        /[^\p{L}\p{N}\s-]/gu,
        ""
      )
      .replace(
        /\s+/g,
        "-"
      )
      .replace(
        /-+/g,
        "-"
      )
      .replace(
        /^-+|-+$/g,
        ""
      );

  return slug;
}


// ========================================
// UPDATE NEWS SLUG
// ========================================

function updateNewsSlugPreview() {
  const elements =
    getNewsEditorElements();

  if (
    !elements.title ||
    !elements.slug
  ) {
    return;
  }

  if (
    elements.slug.dataset.manual ===
    "true"
  ) {
    return;
  }

  elements.slug.value =
    createNewsSlug(
      elements.title.value
    );
}


// ========================================
// NEWS IMAGE CHANGE
// ========================================

function handleNewsImageChange(
  event
) {
  const file =
    event?.target?.files?.[0];

  if (!file) {
    adminState.newsEditor.imageFile =
      null;

    return;
  }

  if (
    !file.type.startsWith(
      "image/"
    )
  ) {
    showAdminToast(
      "error",
      "गलत फ़ाइल",
      "कृपया केवल image फ़ाइल चुनें।"
    );

    event.target.value =
      "";

    return;
  }

  const maxSize =
    5 * 1024 * 1024;

  if (
    file.size >
    maxSize
  ) {
    showAdminToast(
      "error",
      "फ़ाइल बहुत बड़ी है",
      "इमेज का आकार 5 MB से अधिक नहीं होना चाहिए।"
    );

    event.target.value =
      "";

    return;
  }

  adminState.newsEditor.imageFile =
    file;

  showNewsImagePreview(
    file
  );
}


// ========================================
// SHOW NEWS IMAGE PREVIEW
// ========================================

function showNewsImagePreview(
  source
) {
  const elements =
    getNewsEditorElements();

  if (
    !elements.imagePreview
  ) {
    return;
  }

  elements.imagePreview.innerHTML =
    "";

  if (
    !source
  ) {
    return;
  }

  const image =
    document.createElement(
      "img"
    );

  image.alt =
    "न्यूज़ इमेज प्रीव्यू";

  image.loading =
    "lazy";

  if (
    source instanceof
    File
  ) {
    const objectURL =
      URL.createObjectURL(
        source
      );

    image.src =
      objectURL;

    image.addEventListener(
      "load",
      () => {
        URL.revokeObjectURL(
          objectURL
        );
      },
      {
        once: true
      }
    );
  } else {
    image.src =
      getNewsImageURL({
        image:
          String(
            source
          )
      });
  }

  elements.imagePreview.appendChild(
    image
  );
}


// ========================================
// CONVERT DATE FOR INPUT
// ========================================

function convertDateForInput(
  value
) {
  if (!value) {
    return "";
  }

  const date =
    new Date(
      value
    );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "";
  }

  const offset =
    date.getTimezoneOffset();

  const localDate =
    new Date(
      date.getTime() -
        offset * 60000
    );

  return localDate
    .toISOString()
    .slice(
      0,
      16
    );
}


// ========================================
// NEWS EDITOR VALIDATION
// ========================================

function validateNewsEditor() {
  const elements =
    getNewsEditorElements();

  const errors = [];

  const title =
    elements.title?.value
      ?.trim() || "";

  const content =
    elements.content?.value
      ?.trim() || "";

  const category =
    elements.category?.value
      ?.trim() || "";

  if (
    title.length <
    5
  ) {
    errors.push(
      "शीर्षक कम से कम 5 अक्षरों का होना चाहिए।"
    );
  }

  if (
    title.length >
    250
  ) {
    errors.push(
      "शीर्षक 250 अक्षरों से अधिक नहीं होना चाहिए।"
    );
  }

  if (
    !content
  ) {
    errors.push(
      "न्यूज़ कंटेंट आवश्यक है।"
    );
  }

  if (
    !category
  ) {
    errors.push(
      "न्यूज़ श्रेणी चुनना आवश्यक है।"
    );
  }

  if (
    category &&
    !ADMIN_NEWS_CATEGORIES.includes(
      category
    )
  ) {
    errors.push(
      "चयनित न्यूज़ श्रेणी मान्य नहीं है।"
    );
  }

  return {
    valid:
      errors.length === 0,

    errors
  };
}


// ========================================
// GET NEWS FORM DATA
// ========================================

function getNewsEditorData() {
  const elements =
    getNewsEditorElements();

  const tags =
    elements.tags?.value
      ?.split(",")
      .map(
        (tag) =>
          tag.trim()
      )
      .filter(Boolean) ||
    [];

  return {
    title:
      elements.title?.value
        ?.trim() || "",

    slug:
      elements.slug?.value
        ?.trim() || "",

    summary:
      elements.summary?.value
        ?.trim() || "",

    content:
      elements.content?.value
        ?.trim() || "",

    category:
      elements.category?.value
        ?.trim() || "",

    district:
      elements.district?.value
        ?.trim() || "",

    location:
      elements.location?.value
        ?.trim() || "",

    author:
      elements.author?.value
        ?.trim() || "",

    tags,

    isBreaking:
      Boolean(
        elements.breaking?.checked
      ),

    isTrending:
      Boolean(
        elements.trending?.checked
      ),

    isFeatured:
      Boolean(
        elements.featured?.checked
      ),

    isPublished:
      Boolean(
        elements.published?.checked
      ),

    scheduledAt:
      elements.scheduledAt?.value ||
      ""
  };
}


// ========================================
// UPDATE EDITOR BUTTON
// ========================================

function updateNewsEditorSubmitButton() {
  const elements =
    getNewsEditorElements();

  if (
    !elements.submit
  ) {
    return;
  }

  const mode =
    adminState.newsEditor?.mode ||
    "create";

  elements.submit.textContent =
    mode === "edit"
      ? "न्यूज़ अपडेट करें"
      : "न्यूज़ प्रकाशित करें";
}


// ========================================
// NEWS EDITOR SUBMIT
// ========================================

async function handleNewsEditorSubmit(
  event
) {
  event.preventDefault();

  if (
    adminState.newsEditor
      ?.submitting
  ) {
    return;
  }

  const validation =
    validateNewsEditor();

  if (
    !validation.valid
  ) {
    showAdminToast(
      "error",
      "जानकारी अधूरी है",
      validation.errors[0]
    );

    return;
  }

  const data =
    getNewsEditorData();

  adminState.newsEditor.submitting =
    true;

  updateNewsEditorSubmitButton();

  try {
    if (
      adminState.newsEditor.mode ===
      "edit"
    ) {
      await updateNews(
        adminState.newsEditor.editingId,
        data
      );
    } else {
      await createNews(
        data
      );
    }
  } catch (error) {
    console.error(
      "News editor submit error:",
      error
    );
  } finally {
    adminState.newsEditor.submitting =
      false;

    updateNewsEditorSubmitButton();
  }
       }
// ========================================
// ADMIN.JS
// PART 14 / 25
// NEWS CREATE + UPDATE + DELETE API
// ========================================


// ========================================
// CREATE NEWS
// ========================================

async function createNews(
  newsData
) {
  if (
    !requireAdminPermission(
      "news.create"
    )
  ) {
    return null;
  }

  if (!newsData) {
    throw new Error(
      "न्यूज़ डेटा उपलब्ध नहीं है।"
    );
  }

  const payload =
    buildNewsPayload(
      newsData
    );

  try {
    showAdminLoading(
      "न्यूज़ बनाई जा रही है",
      "न्यूज़ डेटा सर्वर पर भेजा जा रहा है..."
    );

    const response =
      await sendNewsRequest(
        "/api/news",
        "POST",
        payload
      );

    const data =
      normalizeAPIResponse(
        response
      );

    showAdminToast(
      "success",
      "न्यूज़ सफलतापूर्वक बनाई गई",
      "नई न्यूज़ सेव कर दी गई है।"
    );

    closeNewsEditor();

    await refreshNewsAfterChange();

    return data;
  } catch (error) {
    console.error(
      "Create news error:",
      error
    );

    showNewsAPIError(
      error,
      "न्यूज़ बनाने"
    );

    throw error;
  } finally {
    hideAdminLoading();
  }
}


// ========================================
// UPDATE NEWS
// ========================================

async function updateNews(
  newsId,
  newsData
) {
  if (
    !requireAdminPermission(
      "news.update"
    )
  ) {
    return null;
  }

  if (!newsId) {
    throw new Error(
      "न्यूज़ ID उपलब्ध नहीं है।"
    );
  }

  if (!newsData) {
    throw new Error(
      "न्यूज़ डेटा उपलब्ध नहीं है।"
    );
  }

  const payload =
    buildNewsPayload(
      newsData
    );

  try {
    showAdminLoading(
      "न्यूज़ अपडेट हो रही है",
      "न्यूज़ की जानकारी सर्वर पर अपडेट की जा रही है..."
    );

    const response =
      await sendNewsRequest(
        `/api/news/${encodeURIComponent(
          newsId
        )}`,
        "PUT",
        payload
      );

    const data =
      normalizeAPIResponse(
        response
      );

    showAdminToast(
      "success",
      "न्यूज़ अपडेट हो गई",
      "न्यूज़ की जानकारी सफलतापूर्वक अपडेट कर दी गई है।"
    );

    closeNewsEditor();

    await refreshNewsAfterChange();

    return data;
  } catch (error) {
    console.error(
      "Update news error:",
      error
    );

    showNewsAPIError(
      error,
      "न्यूज़ अपडेट करने"
    );

    throw error;
  } finally {
    hideAdminLoading();
  }
}


// ========================================
// DELETE NEWS
// ========================================

async function deleteNews(
  newsId
) {
  if (
    !requireAdminPermission(
      "news.delete"
    )
  ) {
    return null;
  }

  if (!newsId) {
    throw new Error(
      "न्यूज़ ID उपलब्ध नहीं है।"
    );
  }

  try {
    showAdminLoading(
      "न्यूज़ हटाई जा रही है",
      "कृपया प्रतीक्षा करें..."
    );

    const response =
      await sendNewsRequest(
        `/api/news/${encodeURIComponent(
          newsId
        )}`,
        "DELETE"
      );

    const data =
      normalizeAPIResponse(
        response
      );

    showAdminToast(
      "success",
      "न्यूज़ हटा दी गई",
      "न्यूज़ सफलतापूर्वक हटा दी गई है।"
    );

    await refreshNewsAfterChange();

    return data;
  } catch (error) {
    console.error(
      "Delete news error:",
      error
    );

    showNewsAPIError(
      error,
      "न्यूज़ हटाने"
    );

    throw error;
  } finally {
    hideAdminLoading();
  }
}


// ========================================
// BUILD NEWS PAYLOAD
// ========================================

function buildNewsPayload(
  data
) {
  const payload = {
    title:
      String(
        data.title || ""
      ).trim(),

    slug:
      String(
        data.slug || ""
      ).trim(),

    summary:
      String(
        data.summary || ""
      ).trim(),

    content:
      String(
        data.content || ""
      ).trim(),

    category:
      String(
        data.category || ""
      ).trim(),

    district:
      String(
        data.district || ""
      ).trim(),

    location:
      String(
        data.location || ""
      ).trim(),

    author:
      String(
        data.author || ""
      ).trim(),

    tags:
      Array.isArray(
        data.tags
      )
        ? data.tags
        : [],

    isBreaking:
      data.isBreaking === true,

    isTrending:
      data.isTrending === true,

    isFeatured:
      data.isFeatured === true,

    isPublished:
      data.isPublished === true
  };

  if (
    data.scheduledAt
  ) {
    payload.scheduledAt =
      data.scheduledAt;
  }

  return payload;
}


// ========================================
// SEND NEWS REQUEST
// ========================================

async function sendNewsRequest(
  endpoint,
  method,
  payload = null
) {
  const options = {
    method,

    headers: {
      Accept:
        "application/json"
    }
  };

  /*
   * Image upload होने पर FormData भेजा जाएगा।
   * सामान्य डेटा के लिए JSON भेजा जाएगा।
   */

  const imageFile =
    adminState.newsEditor
      ?.imageFile;

  if (
    imageFile instanceof File
  ) {
    const formData =
      new FormData();

    if (payload) {
      Object.entries(
        payload
      ).forEach(
        ([key, value]) => {
          if (
            Array.isArray(
              value
            )
          ) {
            formData.append(
              key,
              JSON.stringify(
                value
              )
            );
          } else if (
            value !== undefined &&
            value !== null
          ) {
            formData.append(
              key,
              String(value)
            );
          }
        }
      );
    }

    formData.append(
      "image",
      imageFile
    );

    options.body =
      formData;
  } else {
    options.headers[
      "Content-Type"
    ] =
      "application/json";

    if (
      payload !== null &&
      payload !== undefined
    ) {
      options.body =
        JSON.stringify(
          payload
        );
    }
  }

  /*
   * Admin JWT/cookie वही adminAPIRequest
   * wrapper संभालेगा।
   */
  return adminAPIRequest(
    endpoint,
    options
  );
}


// ========================================
// DELETE CONFIRMATION
// ========================================

function confirmDeleteNews(
  news
) {
  if (!news) {
    return;
  }

  const id =
    getObjectId(
      news
    );

  if (!id) {
    showAdminToast(
      "error",
      "न्यूज़ ID नहीं मिली",
      "इस न्यूज़ की पहचान नहीं हो पाई।"
    );

    return;
  }

  showAdminConfirm({
    icon: "🗑️",

    title:
      "न्यूज़ हटाएँ?",

    message:
      `"${truncateText(
        news.title ||
          "बिना शीर्षक",
        100
      )}" को स्थायी रूप से हटाया जाएगा। क्या आप जारी रखना चाहते हैं?`,

    confirmText:
      "हटाएँ",

    cancelText:
      "रद्द करें",

    danger:
      true,

    onConfirm:
      async () => {
        await deleteNews(
          id
        );
      }
  });
}


// ========================================
// BULK DELETE NEWS
// ========================================

async function deleteSelectedNews() {
  if (
    !requireAdminPermission(
      "news.delete"
    )
  ) {
    return;
  }

  const ids =
    getSelectedNewsIds();

  if (
    ids.length === 0
  ) {
    showAdminToast(
      "warning",
      "कोई न्यूज़ चयनित नहीं",
      "पहले कम से कम एक न्यूज़ चुनें।"
    );

    return;
  }

  showAdminConfirm({
    icon: "🗑️",

    title:
      "चयनित न्यूज़ हटाएँ?",

    message:
      `${ids.length} चयनित न्यूज़ को हटाया जाएगा। यह कार्रवाई वापस नहीं की जा सकती।`,

    confirmText:
      "सभी हटाएँ",

    cancelText:
      "रद्द करें",

    danger:
      true,

    onConfirm:
      async () => {
        await performBulkNewsDelete(
          ids
        );
      }
  });
}


// ========================================
// PERFORM BULK DELETE
// ========================================

async function performBulkNewsDelete(
  ids
) {
  if (
    !Array.isArray(ids) ||
    ids.length === 0
  ) {
    return;
  }

  showAdminLoading(
    "न्यूज़ हटाई जा रही हैं",
    "कृपया प्रतीक्षा करें..."
  );

  let successCount =
    0;

  let failedCount =
    0;

  try {
    for (
      const id of ids
    ) {
      try {
        await sendNewsRequest(
          `/api/news/${encodeURIComponent(
            id
          )}`,
          "DELETE"
        );

        successCount++;
      } catch (
        error
      ) {
        failedCount++;

        console.error(
          `Bulk delete failed for ${id}:`,
          error
        );
      }
    }

    clearNewsSelection();

    await refreshNewsAfterChange();

    if (
      failedCount === 0
    ) {
      showAdminToast(
        "success",
        "न्यूज़ हट गईं",
        `${successCount} न्यूज़ सफलतापूर्वक हटा दी गईं।`
      );
    } else {
      showAdminToast(
        "warning",
        "आंशिक सफलता",
        `${successCount} न्यूज़ हट गईं और ${failedCount} न्यूज़ नहीं हट सकीं।`
      );
    }
  } finally {
    hideAdminLoading();
  }
}


// ========================================
// NEWS API ERROR
// ========================================

function showNewsAPIError(
  error,
  action
) {
  let message =
    error?.message ||
    `${action} में समस्या हुई।`;

  const status =
    error?.status ||
    error?.statusCode ||
    0;

  /*
   * वर्तमान backend में news CRUD
   * normal user auth से सुरक्षित है।
   * इसलिए admin token स्वीकार न होने पर
   * स्पष्ट संदेश दिया जाएगा।
   */

  if (
    status === 401 ||
    status === 403
  ) {
    message =
      "Admin Panel की अनुमति इस News API पर स्वीकार नहीं हुई। Backend में Admin authorization को News CRUD से जोड़ना आवश्यक है।";
  }

  showAdminToast(
    "error",
    `${action} में समस्या`,
    message
  );
}


// ========================================
// NEWS CRUD AUTH CHECK
// ========================================

function canUseNewsCRUD(
  permission
) {
  if (
    !adminState.isAuthenticated
  ) {
    showAdminToast(
      "error",
      "लॉगिन आवश्यक है",
      "News management के लिए पहले Admin Panel में लॉगिन करें।"
    );

    return false;
  }

  if (
    !permission
  ) {
    return true;
  }

  return requireAdminPermission(
    permission
  );
}


// ========================================
// NEWS EDITOR CLOSE AFTER SUCCESS
// ========================================

function closeNewsEditorAfterSuccess() {
  try {
    closeNewsEditor();
  } catch (
    error
  ) {
    console.error(
      "News editor close error:",
      error
    );
  }
}


// ========================================
// NEWS CRUD INITIALIZATION
// ========================================

function initializeNewsCRUDControls() {
  const bulkDeleteButton =
    document.querySelector(
      "[data-action='delete-selected-news']"
    );

  if (
    bulkDeleteButton
  ) {
    bulkDeleteButton.addEventListener(
      "click",
      deleteSelectedNews
    );
  }
}


// ========================================
// NEWS EDITOR PERMISSION STATE
// ========================================

function updateNewsEditorPermissions() {
  const createAllowed =
    hasAdminPermission(
      "news.create"
    );

  const updateAllowed =
    hasAdminPermission(
      "news.update"
    );

  const deleteAllowed =
    hasAdminPermission(
      "news.delete"
    );

  document
    .querySelectorAll(
      "[data-permission='news.create']"
    )
    .forEach(
      (element) => {
        element.disabled =
          !createAllowed;
      }
    );

  document
    .querySelectorAll(
      "[data-permission='news.update']"
    )
    .forEach(
      (element) => {
        element.disabled =
          !updateAllowed;
      }
    );

  document
    .querySelectorAll(
      "[data-permission='news.delete']"
    )
    .forEach(
      (element) => {
        element.disabled =
          !deleteAllowed;
      }
    );
     }
// ========================================
// ADMIN.JS
// PART 15 / 25
// BREAKING NEWS MANAGEMENT
// ========================================


// ========================================
// BREAKING NEWS STATE
// ========================================

if (!adminState.breaking) {
  adminState.breaking = {
    enabled: false,
    items: [],
    loading: false,
    loaded: false
  };
}


// ========================================
// LOAD BREAKING NEWS
// ========================================

async function loadBreakingNews(
  forceRefresh = false
) {
  if (
    !adminState.isAuthenticated
  ) {
    return;
  }

  const state =
    adminState.breaking;

  if (
    state.loading &&
    !forceRefresh
  ) {
    return;
  }

  state.loading = true;

  try {
    const response =
      await adminAPIRequest(
        "/api/news/breaking"
      );

    const data =
      normalizeAPIResponse(
        response
      );

    const news =
      extractArrayData(
        data,
        [
          "news",
          "breaking",
          "items",
          "results"
        ]
      );

    state.items =
      news.map(
        normalizeNewsItem
      );

    state.loaded =
      true;

    state.enabled =
      data.enabled === true ||
      data.breakingEnabled === true;

    renderBreakingNews();

    updateBreakingNewsStatus();

    return state.items;
  } catch (error) {
    console.error(
      "Breaking news loading error:",
      error
    );

    state.items = [];

    renderBreakingNews();

    showAdminToast(
      "error",
      "ब्रेकिंग न्यूज़ लोड नहीं हुई",
      error?.message ||
        "ब्रेकिंग न्यूज़ प्राप्त करने में समस्या हुई।"
    );

    return [];
  } finally {
    state.loading = false;
  }
}


// ========================================
// RENDER BREAKING NEWS
// ========================================

function renderBreakingNews() {
  const container =
    document.getElementById(
      "breaking-news-list"
    );

  const emptyState =
    document.getElementById(
      "breaking-empty-state"
    );

  if (!container) {
    return;
  }

  container.innerHTML = "";

  const items =
    adminState.breaking?.items ||
    [];

  if (
    items.length === 0
  ) {
    if (emptyState) {
      emptyState.classList.remove(
        "hidden"
      );
    }

    updateBreakingNewsCount(
      0
    );

    return;
  }

  if (emptyState) {
    emptyState.classList.add(
      "hidden"
    );
  }

  items.forEach(
    (item) => {
      const element =
        createBreakingNewsItem(
          item
        );

      container.appendChild(
        element
      );
    }
  );

  updateBreakingNewsCount(
    items.length
  );
}


// ========================================
// CREATE BREAKING NEWS ITEM
// ========================================

function createBreakingNewsItem(
  item
) {
  const element =
    document.createElement(
      "div"
    );

  const id =
    getObjectId(
      item
    );

  const title =
    item.title ||
    "बिना शीर्षक";

  const category =
    item.category ||
    "राजस्थान";

  const date =
    formatDateTime(
      item.createdAt
    );

  element.className =
    "breaking-news-item";

  element.dataset.newsId =
    id;

  element.innerHTML = `
    <div class="breaking-news-content">

      <div class="breaking-news-indicator">
        <span></span>
      </div>

      <div class="breaking-news-info">

        <h3>
          ${escapeHTML(
            title
          )}
        </h3>

        <div class="breaking-news-meta">
          <span>
            ${escapeHTML(
              category
            )}
          </span>

          <span>
            ${escapeHTML(
              date
            )}
          </span>
        </div>

      </div>

    </div>

    <div class="breaking-news-actions">

      <button
        type="button"
        class="admin-btn admin-btn-small"
        data-breaking-action="view"
      >
        देखें
      </button>

      <button
        type="button"
        class="admin-btn admin-btn-small"
        data-breaking-action="remove"
        data-permission="news.update"
      >
        हटाएँ
      </button>

    </div>
  `;

  const viewButton =
    element.querySelector(
      "[data-breaking-action='view']"
    );

  if (viewButton) {
    viewButton.addEventListener(
      "click",
      () => {
        openNewsPreview(
          item
        );
      }
    );
  }

  const removeButton =
    element.querySelector(
      "[data-breaking-action='remove']"
    );

  if (removeButton) {
    removeButton.addEventListener(
      "click",
      () => {
        removeBreakingNews(
          item
        );
      }
    );
  }

  return element;
}


// ========================================
// UPDATE BREAKING COUNT
// ========================================

function updateBreakingNewsCount(
  count
) {
  const element =
    document.getElementById(
      "breaking-item-count"
    );

  if (!element) {
    return;
  }

  element.textContent =
    String(
      count || 0
    );
}


// ========================================
// UPDATE BREAKING STATUS
// ========================================

function updateBreakingNewsStatus() {
  const toggle =
    document.getElementById(
      "breaking-enabled-toggle"
    );

  const description =
    document.getElementById(
      "breaking-status-description"
    );

  const enabled =
    adminState.breaking
      ?.enabled === true;

  if (toggle) {
    toggle.checked =
      enabled;
  }

  if (description) {
    description.textContent =
      enabled
        ? "ब्रेकिंग न्यूज़ सुविधा सक्रिय है।"
        : "ब्रेकिंग न्यूज़ सुविधा बंद है।";
  }
}


// ========================================
// REMOVE BREAKING NEWS
// ========================================

async function removeBreakingNews(
  news
) {
  if (!news) {
    return;
  }

  if (
    !requireAdminPermission(
      "news.update"
    )
  ) {
    return;
  }

  const id =
    getObjectId(
      news
    );

  if (!id) {
    showAdminToast(
      "error",
      "न्यूज़ ID नहीं मिली",
      "ब्रेकिंग न्यूज़ की पहचान नहीं हो पाई।"
    );

    return;
  }

  showAdminConfirm({
    icon: "⚠️",

    title:
      "ब्रेकिंग से हटाएँ?",

    message:
      `"${truncateText(
        news.title ||
          "बिना शीर्षक",
        100
      )}" को ब्रेकिंग न्यूज़ सूची से हटाया जाएगा।`,

    confirmText:
      "हटाएँ",

    cancelText:
      "रद्द करें",

    onConfirm:
      async () => {
        await updateBreakingFlag(
          id,
          false
        );
      }
  });
}


// ========================================
// UPDATE BREAKING FLAG
// ========================================

async function updateBreakingFlag(
  newsId,
  enabled
) {
  if (!newsId) {
    return;
  }

  try {
    showAdminLoading(
      enabled
        ? "ब्रेकिंग न्यूज़ में जोड़ा जा रहा है"
        : "ब्रेकिंग न्यूज़ से हटाया जा रहा है",
      "कृपया प्रतीक्षा करें..."
    );

    /*
     * वर्तमान backend में अलग breaking-update
     * route नहीं है।
     *
     * News PUT route मौजूद है, लेकिन वह
     * normal user auth से सुरक्षित है।
     *
     * इसलिए admin JWT से सीधे PUT करने पर
     * backend अनुमति न दे सकता है।
     */

    const news =
      findNewsById(
        newsId
      );

    if (!news) {
      throw new Error(
        "न्यूज़ उपलब्ध नहीं है।"
      );
    }

    const payload =
      buildNewsPayload({
        ...news,
        isBreaking:
          enabled
      });

    await sendNewsRequest(
      `/api/news/${encodeURIComponent(
        newsId
      )}`,
      "PUT",
      payload
    );

    news.isBreaking =
      enabled;

    showAdminToast(
      "success",
      enabled
        ? "ब्रेकिंग न्यूज़ सक्रिय"
        : "ब्रेकिंग न्यूज़ हटाई गई",
      enabled
        ? "न्यूज़ को ब्रेकिंग के रूप में सेट कर दिया गया।"
        : "न्यूज़ को ब्रेकिंग सूची से हटा दिया गया।"
    );

    await loadBreakingNews(
      true
    );
  } catch (error) {
    console.error(
      "Breaking flag update error:",
      error
    );

    showNewsAPIError(
      error,
      enabled
        ? "ब्रेकिंग न्यूज़ सक्रिय करने"
        : "ब्रेकिंग न्यूज़ हटाने"
    );
  } finally {
    hideAdminLoading();
  }
}


// ========================================
// TOGGLE BREAKING FEATURE
// ========================================

function initializeBreakingToggle() {
  const toggle =
    document.getElementById(
      "breaking-enabled-toggle"
    );

  if (!toggle) {
    return;
  }

  toggle.addEventListener(
    "change",
    async () => {
      const enabled =
        toggle.checked;

      /*
       * वर्तमान backend में global
       * breaking-enabled setting के लिए
       * कोई write endpoint उपलब्ध नहीं है।
       */

      toggle.checked =
        adminState.breaking
          ?.enabled === true;

      showAdminToast(
        "warning",
        "सेटिंग उपलब्ध नहीं",
        "Global Breaking News setting के लिए वर्तमान backend में write API उपलब्ध नहीं है।"
      );
    }
  );
}


// ========================================
// OPEN BREAKING NEWS CREATOR
// ========================================

function openBreakingNewsCreator() {
  if (
    !requireAdminPermission(
      "news.update"
    )
  ) {
    return;
  }

  switchAdminSection(
    "news"
  );

  showAdminToast(
    "info",
    "न्यूज़ चुनें",
    "News section में जाकर जिस न्यूज़ को ब्रेकिंग बनाना है, उसे संपादित करें।"
  );
}


// ========================================
// BREAKING REFRESH
// ========================================

async function refreshBreakingNews() {
  const button =
    document.getElementById(
      "breaking-refresh-button"
    );

  if (button) {
    setButtonLoading(
      button,
      true
    );
  }

  try {
    await loadBreakingNews(
      true
    );

    showAdminToast(
      "success",
      "अपडेट पूरा",
      "ब्रेकिंग न्यूज़ सूची अपडेट हो गई।"
    );
  } catch (error) {
    console.error(
      "Breaking refresh error:",
      error
    );
  } finally {
    if (button) {
      setButtonLoading(
        button,
        false
      );
    }
  }
}


// ========================================
// INITIALIZE BREAKING SECTION
// ========================================

function initializeBreakingSection() {
  initializeBreakingToggle();

  const refreshButton =
    document.getElementById(
      "breaking-refresh-button"
    );

  if (refreshButton) {
    refreshButton.addEventListener(
      "click",
      refreshBreakingNews
    );
  }

  const createButton =
    document.getElementById(
      "create-breaking-button"
    );

  if (createButton) {
    createButton.addEventListener(
      "click",
      openBreakingNewsCreator
    );
  }
}


// ========================================
// GET BREAKING NEWS
// ========================================

function getBreakingNewsItems() {
  return [
    ...(adminState.breaking?.items ||
      [])
  ];
     }
// ========================================
// ADMIN.JS
// PART 16 / 25
// TRENDING NEWS MANAGEMENT
// ========================================


// ========================================
// TRENDING NEWS STATE
// ========================================

if (!adminState.trending) {
  adminState.trending = {
    enabled: false,
    items: [],
    searchResults: [],
    loading: false,
    searchLoading: false,
    loaded: false
  };
}


// ========================================
// LOAD TRENDING NEWS
// ========================================

async function loadTrendingNews(
  forceRefresh = false
) {
  if (
    !adminState.isAuthenticated
  ) {
    return;
  }

  const state =
    adminState.trending;

  if (
    state.loading &&
    !forceRefresh
  ) {
    return;
  }

  state.loading = true;

  try {
    const response =
      await adminAPIRequest(
        "/api/news/trending"
      );

    const data =
      normalizeAPIResponse(
        response
      );

    const news =
      extractArrayData(
        data,
        [
          "news",
          "trending",
          "items",
          "results"
        ]
      );

    state.items =
      news.map(
        normalizeNewsItem
      );

    state.loaded =
      true;

    state.enabled =
      data.enabled === true ||
      data.trendingEnabled === true;

    renderTrendingNews();

    updateTrendingNewsStatus();

    return state.items;
  } catch (error) {
    console.error(
      "Trending news loading error:",
      error
    );

    state.items = [];

    renderTrendingNews();

    showAdminToast(
      "error",
      "ट्रेंडिंग न्यूज़ लोड नहीं हुई",
      error?.message ||
        "ट्रेंडिंग न्यूज़ प्राप्त करने में समस्या हुई।"
    );

    return [];
  } finally {
    state.loading = false;
  }
}


// ========================================
// RENDER TRENDING NEWS
// ========================================

function renderTrendingNews() {
  const container =
    document.getElementById(
      "trending-news-list"
    );

  const emptyState =
    document.getElementById(
      "trending-empty-state"
    );

  if (!container) {
    return;
  }

  container.innerHTML = "";

  const items =
    adminState.trending?.items ||
    [];

  if (
    items.length === 0
  ) {
    if (emptyState) {
      emptyState.classList.remove(
        "hidden"
      );
    }

    updateTrendingNewsCount(
      0
    );

    return;
  }

  if (emptyState) {
    emptyState.classList.add(
      "hidden"
    );
  }

  items.forEach(
    (item, index) => {
      const element =
        createTrendingNewsItem(
          item,
          index
        );

      container.appendChild(
        element
      );
    }
  );

  updateTrendingNewsCount(
    items.length
  );
}


// ========================================
// CREATE TRENDING NEWS ITEM
// ========================================

function createTrendingNewsItem(
  item,
  index
) {
  const element =
    document.createElement(
      "div"
    );

  const id =
    getObjectId(
      item
    );

  const title =
    item.title ||
    "बिना शीर्षक";

  const category =
    item.category ||
    "राजस्थान";

  const views =
    Number(
      item.views || 0
    );

  element.className =
    "trending-news-item";

  element.dataset.newsId =
    id;

  element.innerHTML = `
    <div class="trending-news-rank">
      ${index + 1}
    </div>

    <div class="trending-news-info">

      <h3>
        ${escapeHTML(
          title
        )}
      </h3>

      <div class="trending-news-meta">

        <span>
          ${escapeHTML(
            category
          )}
        </span>

        <span>
          ${formatNumber(
            views
          )} views
        </span>

      </div>

    </div>

    <div class="trending-news-actions">

      <button
        type="button"
        class="admin-btn admin-btn-small"
        data-trending-action="view"
      >
        देखें
      </button>

      <button
        type="button"
        class="admin-btn admin-btn-small"
        data-trending-action="remove"
        data-permission="news.update"
      >
        हटाएँ
      </button>

    </div>
  `;

  const viewButton =
    element.querySelector(
      "[data-trending-action='view']"
    );

  if (viewButton) {
    viewButton.addEventListener(
      "click",
      () => {
        openNewsPreview(
          item
        );
      }
    );
  }

  const removeButton =
    element.querySelector(
      "[data-trending-action='remove']"
    );

  if (removeButton) {
    removeButton.addEventListener(
      "click",
      () => {
        removeTrendingNews(
          item
        );
      }
    );
  }

  return element;
}


// ========================================
// NUMBER FORMATTER
// ========================================

function formatNumber(
  value
) {
  const number =
    Number(
      value || 0
    );

  if (
    !Number.isFinite(
      number
    )
  ) {
    return "0";
  }

  return new Intl.NumberFormat(
    "hi-IN"
  ).format(
    number
  );
}


// ========================================
// UPDATE TRENDING COUNT
// ========================================

function updateTrendingNewsCount(
  count
) {
  const element =
    document.getElementById(
      "trending-count"
    );

  if (!element) {
    return;
  }

  element.textContent =
    formatNumber(
      count
    );
}


// ========================================
// UPDATE TRENDING STATUS
// ========================================

function updateTrendingNewsStatus() {
  const countElement =
    document.getElementById(
      "trending-count"
    );

  if (
    countElement &&
    adminState.trending
  ) {
    countElement.textContent =
      formatNumber(
        adminState.trending.items
          .length
      );
  }
}


// ========================================
// REMOVE TRENDING NEWS
// ========================================

async function removeTrendingNews(
  news
) {
  if (!news) {
    return;
  }

  if (
    !requireAdminPermission(
      "news.update"
    )
  ) {
    return;
  }

  const id =
    getObjectId(
      news
    );

  if (!id) {
    showAdminToast(
      "error",
      "न्यूज़ ID नहीं मिली",
      "ट्रेंडिंग न्यूज़ की पहचान नहीं हो पाई।"
    );

    return;
  }

  showAdminConfirm({
    icon: "📈",

    title:
      "ट्रेंडिंग से हटाएँ?",

    message:
      `"${truncateText(
        news.title ||
          "बिना शीर्षक",
        100
      )}" को ट्रेंडिंग न्यूज़ से हटाया जाएगा।`,

    confirmText:
      "हटाएँ",

    cancelText:
      "रद्द करें",

    onConfirm:
      async () => {
        await updateTrendingFlag(
          id,
          false
        );
      }
  });
}


// ========================================
// UPDATE TRENDING FLAG
// ========================================

async function updateTrendingFlag(
  newsId,
  enabled
) {
  if (!newsId) {
    return;
  }

  try {
    showAdminLoading(
      enabled
        ? "ट्रेंडिंग न्यूज़ में जोड़ा जा रहा है"
        : "ट्रेंडिंग न्यूज़ से हटाया जा रहा है",
      "कृपया प्रतीक्षा करें..."
    );

    /*
     * वर्तमान backend में अलग
     * trending-update route नहीं है।
     *
     * इसलिए News PUT route का उपयोग किया जा रहा है।
     * ध्यान दें कि यह route normal user auth
     * middleware से सुरक्षित है।
     */

    const news =
      findNewsById(
        newsId
      );

    if (!news) {
      throw new Error(
        "न्यूज़ उपलब्ध नहीं है।"
      );
    }

    const payload =
      buildNewsPayload({
        ...news,
        isTrending:
          enabled
      });

    await sendNewsRequest(
      `/api/news/${encodeURIComponent(
        newsId
      )}`,
      "PUT",
      payload
    );

    news.isTrending =
      enabled;

    showAdminToast(
      "success",
      enabled
        ? "ट्रेंडिंग न्यूज़ सक्रिय"
        : "ट्रेंडिंग से हटाया गया",
      enabled
        ? "न्यूज़ को ट्रेंडिंग के रूप में सेट कर दिया गया।"
        : "न्यूज़ को ट्रेंडिंग सूची से हटा दिया गया।"
    );

    await loadTrendingNews(
      true
    );
  } catch (error) {
    console.error(
      "Trending flag update error:",
      error
    );

    showNewsAPIError(
      error,
      enabled
        ? "ट्रेंडिंग न्यूज़ सक्रिय करने"
        : "ट्रेंडिंग न्यूज़ हटाने"
    );
  } finally {
    hideAdminLoading();
  }
}


// ========================================
// TRENDING GLOBAL TOGGLE
// ========================================

function initializeTrendingToggle() {
  /*
   * HTML में global trending toggle
   * उपलब्ध नहीं है।
   *
   * Trending list को individual news
   * के isTrending field से नियंत्रित किया जाता है।
   */
}


// ========================================
// SEARCH TRENDING NEWS
// ========================================

async function searchTrendingNews(
  query
) {
  const state =
    adminState.trending;

  const search =
    String(
      query || ""
    ).trim();

  if (
    !search
  ) {
    state.searchResults = [];

    renderTrendingSearchResults();

    return [];
  }

  state.searchLoading =
    true;

  renderTrendingSearchLoading();

  try {
    const endpoint =
      `/api/news/search?q=${encodeURIComponent(
        search
      )}`;

    const response =
      await adminAPIRequest(
        endpoint
      );

    const data =
      normalizeAPIResponse(
        response
      );

    const results =
      extractArrayData(
        data,
        [
          "news",
          "results",
          "items"
        ]
      );

    state.searchResults =
      results
        .map(
          normalizeNewsItem
        )
        .filter(
          (item) =>
            !item.isTrending
        );

    renderTrendingSearchResults();

    return state.searchResults;
  } catch (error) {
    console.error(
      "Trending search error:",
      error
    );

    state.searchResults = [];

    renderTrendingSearchResults();

    showAdminToast(
      "error",
      "सर्च विफल",
      error?.message ||
        "न्यूज़ खोजने में समस्या हुई।"
    );

    return [];
  } finally {
    state.searchLoading =
      false;
  }
}


// ========================================
// SEARCH LOADING STATE
// ========================================

function renderTrendingSearchLoading() {
  const container =
    document.getElementById(
      "trending-search-results"
    );

  if (!container) {
    return;
  }

  container.innerHTML = `
    <div class="admin-inline-loading">
      न्यूज़ खोजी जा रही है...
    </div>
  `;
}


// ========================================
// RENDER SEARCH RESULTS
// ========================================

function renderTrendingSearchResults() {
  const container =
    document.getElementById(
      "trending-search-results"
    );

  if (!container) {
    return;
  }

  container.innerHTML = "";

  const results =
    adminState.trending
      ?.searchResults ||
    [];

  if (
    results.length === 0
  ) {
    return;
  }

  results.forEach(
    (item) => {
      const element =
        createTrendingSearchResult(
          item
        );

      container.appendChild(
        element
      );
    }
  );
}


// ========================================
// CREATE SEARCH RESULT
// ========================================

function createTrendingSearchResult(
  item
) {
  const element =
    document.createElement(
      "div"
    );

  const title =
    item.title ||
    "बिना शीर्षक";

  const id =
    getObjectId(
      item
    );

  element.className =
    "trending-search-result";

  element.dataset.newsId =
    id;

  element.innerHTML = `
    <div class="trending-search-result-info">

      <strong>
        ${escapeHTML(
          title
        )}
      </strong>

      <span>
        ${escapeHTML(
          item.category ||
            "राजस्थान"
        )}
      </span>

    </div>

    <button
      type="button"
      class="admin-btn admin-btn-small"
      data-trending-add="${escapeHTML(
        id
      )}"
      data-permission="news.update"
    >
      ट्रेंडिंग में जोड़ें
    </button>
  `;

  const button =
    element.querySelector(
      "[data-trending-add]"
    );

  if (button) {
    button.addEventListener(
      "click",
      () => {
        addTrendingNews(
          item
        );
      }
    );
  }

  return element;
}


// ========================================
// ADD TRENDING NEWS
// ========================================

async function addTrendingNews(
  news
) {
  if (!news) {
    return;
  }

  if (
    !requireAdminPermission(
      "news.update"
    )
  ) {
    return;
  }

  const id =
    getObjectId(
      news
    );

  if (!id) {
    showAdminToast(
      "error",
      "न्यूज़ ID नहीं मिली",
      "न्यूज़ की पहचान नहीं हो पाई।"
    );

    return;
  }

  await updateTrendingFlag(
    id,
    true
  );

  adminState.trending
    .searchResults =
    adminState.trending
      .searchResults
      .filter(
        (item) =>
          getObjectId(
            item
          ) !== id
      );

  renderTrendingSearchResults();
}


// ========================================
// TRENDING SEARCH INPUT
// ========================================

function initializeTrendingSearch() {
  const input =
    document.getElementById(
      "trending-news-search"
    );

  if (!input) {
    return;
  }

  const debouncedSearch =
    debounceAdminFunction(
      (value) => {
        searchTrendingNews(
          value
        );
      },
      400
    );

  input.addEventListener(
    "input",
    (event) => {
      debouncedSearch(
        event.target.value
      );
    }
  );

  input.addEventListener(
    "keydown",
    (event) => {
      if (
        event.key === "Enter"
      ) {
        event.preventDefault();

        searchTrendingNews(
          input.value
        );
      }
    }
  );
}


// ========================================
// SAVE TRENDING BUTTON
// ========================================

function initializeTrendingSaveButton() {
  const button =
    document.getElementById(
      "save-trending-button"
    );

  if (!button) {
    return;
  }

  button.addEventListener(
    "click",
    async () => {
      await loadTrendingNews(
        true
      );

      showAdminToast(
        "success",
        "ट्रेंडिंग सूची अपडेट",
        "वर्तमान ट्रेंडिंग न्यूज़ सूची अपडेट हो गई।"
      );
    }
  );
}


// ========================================
// ADD TRENDING BUTTON
// ========================================

function initializeAddTrendingButton() {
  const button =
    document.getElementById(
      "add-trending-news-button"
    );

  if (!button) {
    return;
  }

  button.addEventListener(
    "click",
    () => {
      const input =
        document.getElementById(
          "trending-news-search"
        );

      if (input) {
        input.focus();
      }
    }
  );
}


// ========================================
// TRENDING REFRESH BUTTON
// ========================================

function initializeTrendingRefresh() {
  const button =
    document.getElementById(
      "trending-refresh-button"
    );

  if (!button) {
    return;
  }

  button.addEventListener(
    "click",
    async () => {
      setButtonLoading(
        button,
        true
      );

      try {
        await loadTrendingNews(
          true
        );

        showAdminToast(
          "success",
          "अपडेट पूरा",
          "ट्रेंडिंग न्यूज़ सूची अपडेट हो गई।"
        );
      } finally {
        setButtonLoading(
          button,
          false
        );
      }
    }
  );
}


// ========================================
// INITIALIZE TRENDING SECTION
// ========================================

function initializeTrendingSection() {
  initializeTrendingToggle();

  initializeTrendingSearch();

  initializeTrendingSaveButton();

  initializeAddTrendingButton();

  initializeTrendingRefresh();
}


// ========================================
// GET TRENDING NEWS
// ========================================

function getTrendingNewsItems() {
  return [
    ...(adminState.trending?.items ||
      [])
  ];
}
// ========================================
// ADMIN.JS
// PART 17 / 25
// VIDEO MANAGEMENT
// ========================================


// ========================================
// VIDEO STATE
// ========================================

if (!adminState.video) {
  adminState.video = {
    items: [],
    filteredItems: [],
    loading: false,
    loaded: false,
    search: "",
    status: "all"
  };
}


// ========================================
// LOAD VIDEO DATA
// ========================================

async function loadVideoData(
  forceRefresh = false
) {
  if (
    !adminState.isAuthenticated
  ) {
    return;
  }

  const state =
    adminState.video;

  if (
    state.loading &&
    !forceRefresh
  ) {
    return;
  }

  state.loading = true;

  try {
    /*
     * वर्तमान backend में अलग video route
     * उपलब्ध नहीं है।
     *
     * इसलिए published/news data से video
     * संबंधित items खोजने की कोशिश की जाती है।
     */

    const response =
      await adminAPIRequest(
        "/api/news"
      );

    const data =
      normalizeAPIResponse(
        response
      );

    const news =
      extractArrayData(
        data,
        [
          "news",
          "items",
          "results"
        ]
      );

    state.items =
      news
        .map(
          normalizeNewsItem
        )
        .filter(
          isVideoNewsItem
        );

    state.loaded =
      true;

    applyVideoFilters();

    renderVideoList();

    return state.items;
  } catch (error) {
    console.error(
      "Video loading error:",
      error
    );

    state.items = [];
    state.filteredItems = [];

    renderVideoList();

    showAdminToast(
      "error",
      "वीडियो लोड नहीं हुए",
      error?.message ||
        "वीडियो डेटा प्राप्त करने में समस्या हुई।"
    );

    return [];
  } finally {
    state.loading = false;
  }
}


// ========================================
// CHECK VIDEO NEWS ITEM
// ========================================

function isVideoNewsItem(
  item
) {
  if (!item) {
    return false;
  }

  const type =
    String(
      item.type ||
      item.mediaType ||
      item.contentType ||
      ""
    ).toLowerCase();

  const videoUrl =
    item.video ||
    item.videoUrl ||
    item.youtubeUrl ||
    item.youtube ||
    item.media?.video;

  if (
    videoUrl
  ) {
    return true;
  }

  return (
    type === "video" ||
    type === "video-news" ||
    type === "youtube"
  );
}


// ========================================
// APPLY VIDEO FILTERS
// ========================================

function applyVideoFilters() {
  const state =
    adminState.video;

  let items =
    [
      ...(state.items || [])
    ];

  const search =
    String(
      state.search || ""
    )
      .trim()
      .toLowerCase();

  const status =
    state.status ||
    "all";

  if (search) {
    items =
      items.filter(
        (item) => {
          const title =
            String(
              item.title || ""
            ).toLowerCase();

          const summary =
            String(
              item.summary || ""
            ).toLowerCase();

          const category =
            String(
              item.category || ""
            ).toLowerCase();

          return (
            title.includes(
              search
            ) ||
            summary.includes(
              search
            ) ||
            category.includes(
              search
            )
          );
        }
      );
  }

  if (
    status !== "all"
  ) {
    items =
      items.filter(
        (item) => {
          const itemStatus =
            getVideoStatus(
              item
            );

          return (
            itemStatus ===
            status
          );
        }
      );
  }

  state.filteredItems =
    items;

  updateVideoResultCount(
    items.length
  );
}


// ========================================
// GET VIDEO STATUS
// ========================================

function getVideoStatus(
  item
) {
  if (!item) {
    return "draft";
  }

  if (
    item.isPublished === true
  ) {
    return "published";
  }

  return "draft";
}


// ========================================
// VIDEO STATUS LABEL
// ========================================

function getVideoStatusLabel(
  status
) {
  const labels = {
    published:
      "प्रकाशित",

    draft:
      "ड्राफ्ट",

    scheduled:
      "शेड्यूल"
  };

  return (
    labels[status] ||
    status ||
    "अज्ञात"
  );
}


// ========================================
// RENDER VIDEO LIST
// ========================================

function renderVideoList() {
  const container =
    document.getElementById(
      "video-list"
    );

  const emptyState =
    document.getElementById(
      "video-empty-state"
    );

  if (!container) {
    return;
  }

  container.innerHTML = "";

  const items =
    adminState.video
      ?.filteredItems ||
    [];

  if (
    items.length === 0
  ) {
    if (emptyState) {
      emptyState.classList.remove(
        "hidden"
      );
    }

    updateVideoResultCount(
      0
    );

    return;
  }

  if (emptyState) {
    emptyState.classList.add(
      "hidden"
    );
  }

  items.forEach(
    (item) => {
      const element =
        createVideoItem(
          item
        );

      container.appendChild(
        element
      );
    }
  );

  updateVideoResultCount(
    items.length
  );
}


// ========================================
// CREATE VIDEO ITEM
// ========================================

function createVideoItem(
  item
) {
  const element =
    document.createElement(
      "article"
    );

  const id =
    getObjectId(
      item
    );

  const title =
    item.title ||
    "बिना शीर्षक";

  const category =
    item.category ||
    "राजस्थान";

  const status =
    getVideoStatus(
      item
    );

  const image =
    getNewsImageURL(
      item
    );

  const videoUrl =
    getVideoURL(
      item
    );

  element.className =
    "video-item";

  element.dataset.videoId =
    id;

  element.innerHTML = `
    <div class="video-item-media">
      ${
        image
          ? `
            <img
              src="${escapeHTML(
                image
              )}"
              alt="${escapeHTML(
                title
              )}"
              loading="lazy"
            >
          `
          : `
            <div class="video-placeholder">
              ▶
            </div>
          `
      }

      ${
        videoUrl
          ? `
            <span class="video-play-badge">
              ▶
            </span>
          `
          : ""
      }
    </div>

    <div class="video-item-content">

      <div class="video-item-top">

        <span class="video-category">
          ${escapeHTML(
            category
          )}
        </span>

        <span class="video-status video-status-${escapeHTML(
          status
        )}">
          ${escapeHTML(
            getVideoStatusLabel(
              status
            )
          )}
        </span>

      </div>

      <h3>
        ${escapeHTML(
          title
        )}
      </h3>

      <p>
        ${escapeHTML(
          truncateText(
            item.summary ||
              item.content ||
              "",
            150
          )
        )}
      </p>

      <div class="video-item-actions">

        ${
          videoUrl
            ? `
              <button
                type="button"
                class="admin-btn admin-btn-small"
                data-video-action="watch"
              >
                वीडियो देखें
              </button>
            `
            : ""
        }

        <button
          type="button"
          class="admin-btn admin-btn-small"
          data-video-action="view"
        >
          विवरण
        </button>

      </div>

    </div>
  `;

  const watchButton =
    element.querySelector(
      "[data-video-action='watch']"
    );

  if (watchButton) {
    watchButton.addEventListener(
      "click",
      () => {
        openVideoURL(
          videoUrl
        );
      }
    );
  }

  const viewButton =
    element.querySelector(
      "[data-video-action='view']"
    );

  if (viewButton) {
    viewButton.addEventListener(
      "click",
      () => {
        openNewsPreview(
          item
        );
      }
    );
  }

  return element;
}


// ========================================
// GET VIDEO URL
// ========================================

function getVideoURL(
  item
) {
  if (!item) {
    return "";
  }

  return (
    item.videoUrl ||
    item.video ||
    item.youtubeUrl ||
    item.youtube ||
    item.media?.video ||
    ""
  );
}


// ========================================
// OPEN VIDEO URL
// ========================================

function openVideoURL(
  url
) {
  const videoURL =
    String(
      url || ""
    ).trim();

  if (!videoURL) {
    showAdminToast(
      "warning",
      "वीडियो उपलब्ध नहीं",
      "इस न्यूज़ के लिए वीडियो URL उपलब्ध नहीं है।"
    );

    return;
  }

  try {
    const parsed =
      new URL(
        videoURL,
        window.location.origin
      );

    const allowed =
      [
        "http:",
        "https:"
      ].includes(
        parsed.protocol
      );

    if (!allowed) {
      throw new Error(
        "Invalid video URL"
      );
    }

    window.open(
      parsed.href,
      "_blank",
      "noopener,noreferrer"
    );
  } catch (error) {
    showAdminToast(
      "error",
      "वीडियो URL गलत है",
      "वीडियो लिंक खोला नहीं जा सका।"
    );
  }
}


// ========================================
// UPDATE VIDEO RESULT COUNT
// ========================================

function updateVideoResultCount(
  count
) {
  const element =
    document.getElementById(
      "video-result-count"
    );

  if (!element) {
    return;
  }

  element.textContent =
    formatNumber(
      count
    );
}


// ========================================
// VIDEO SEARCH
// ========================================

function initializeVideoSearch() {
  const input =
    document.getElementById(
      "video-search"
    );

  if (!input) {
    return;
  }

  const searchHandler =
    debounceAdminFunction(
      (value) => {
        adminState.video.search =
          String(
            value || ""
          );

        applyVideoFilters();

        renderVideoList();
      },
      300
    );

  input.addEventListener(
    "input",
    (event) => {
      searchHandler(
        event.target.value
      );
    }
  );
}


// ========================================
// VIDEO STATUS FILTER
// ========================================

function initializeVideoStatusFilter() {
  const select =
    document.getElementById(
      "video-status-filter"
    );

  if (!select) {
    return;
  }

  select.addEventListener(
    "change",
    (event) => {
      adminState.video.status =
        event.target.value ||
        "all";

      applyVideoFilters();

      renderVideoList();
    }
  );
}


// ========================================
// VIDEO REFRESH
// ========================================

function initializeVideoRefresh() {
  const button =
    document.getElementById(
      "video-refresh-button"
    );

  if (!button) {
    return;
  }

  button.addEventListener(
    "click",
    async () => {
      setButtonLoading(
        button,
        true
      );

      try {
        await loadVideoData(
          true
        );

        showAdminToast(
          "success",
          "वीडियो अपडेट",
          "वीडियो सूची अपडेट हो गई।"
        );
      } catch (error) {
        console.error(
          "Video refresh error:",
          error
        );
      } finally {
        setButtonLoading(
          button,
          false
        );
      }
    }
  );
}


// ========================================
// CREATE VIDEO BUTTON
// ========================================

function initializeVideoCreateButton() {
  const button =
    document.getElementById(
      "create-video-button"
    );

  if (!button) {
    return;
  }

  button.addEventListener(
    "click",
    () => {
      if (
        !requireAdminPermission(
          "news.create"
        )
      ) {
        return;
      }

      switchAdminSection(
        "news"
      );

      showAdminToast(
        "info",
        "वीडियो न्यूज़",
        "वर्तमान backend में अलग video-create API उपलब्ध नहीं है। News editor से video URL वाले content को तैयार किया जा सकता है।"
      );
    }
  );
}


// ========================================
// INITIALIZE VIDEO SECTION
// ========================================

function initializeVideoSection() {
  initializeVideoSearch();

  initializeVideoStatusFilter();

  initializeVideoRefresh();

  initializeVideoCreateButton();
}


// ========================================
// GET VIDEO ITEMS
// ========================================

function getVideoItems() {
  return [
    ...(adminState.video
      ?.filteredItems ||
      [])
  ];
}
// ========================================
// ADMIN.JS
// PART 18 / 25
// LIVE TV MANAGEMENT
// ========================================


// ========================================
// LIVE TV STATE
// ========================================

if (!adminState.liveTV) {
  adminState.liveTV = {
    enabled: false,
    title: "",
    streamUrl: "",
    youtubeUrl: "",
    thumbnail: "",
    description: "",
    status: "offline",
    loading: false,
    saving: false,
    loaded: false
  };
}


// ========================================
// LOAD LIVE TV
// ========================================

async function loadLiveTV(
  forceRefresh = false
) {
  if (
    !adminState.isAuthenticated
  ) {
    return null;
  }

  const state =
    adminState.liveTV;

  if (
    state.loading &&
    !forceRefresh
  ) {
    return state;
  }

  state.loading = true;

  try {
    const response =
      await adminAPIRequest(
        "/api/site/live-tv"
      );

    const data =
      normalizeAPIResponse(
        response
      );

    const liveTV =
      data.liveTV ||
      data.data?.liveTV ||
      data.site?.liveTV ||
      data;

    state.enabled =
      liveTV?.enabled === true;

    state.title =
      liveTV?.title ||
      "आवाज राजस्थान LIVE";

    state.streamUrl =
      liveTV?.streamUrl ||
      liveTV?.url ||
      liveTV?.stream ||
      "";

    state.youtubeUrl =
      liveTV?.youtubeUrl ||
      liveTV?.youtubeURL ||
      liveTV?.youtube ||
      "";

    state.thumbnail =
      liveTV?.thumbnail ||
      liveTV?.poster ||
      "";

    state.description =
      liveTV?.description ||
      "";

    state.status =
      liveTV?.status ||
      "offline";

    state.loaded =
      true;

    populateLiveTVForm();

    updateLiveTVPreview();

    return state;
  } catch (error) {
    console.error(
      "Live TV loading error:",
      error
    );

    showAdminToast(
      "error",
      "Live TV लोड नहीं हुआ",
      error?.message ||
        "Live TV की जानकारी प्राप्त करने में समस्या हुई।"
    );

    return null;
  } finally {
    state.loading = false;
  }
}


// ========================================
// POPULATE LIVE TV FORM
// ========================================

function populateLiveTVForm() {
  const state =
    adminState.liveTV;

  const enabledToggle =
    document.getElementById(
      "live-tv-enabled-toggle"
    );

  const titleInput =
    document.getElementById(
      "live-tv-title"
    );

  const urlInput =
    document.getElementById(
      "live-tv-url"
    );

  const posterInput =
    document.getElementById(
      "live-tv-poster"
    );

  const descriptionInput =
    document.getElementById(
      "live-tv-description"
    );

  if (enabledToggle) {
    enabledToggle.checked =
      state.enabled === true;
  }

  if (titleInput) {
    titleInput.value =
      state.title || "";
  }

  if (urlInput) {
    urlInput.value =
      state.streamUrl ||
      state.youtubeUrl ||
      "";
  }

  if (posterInput) {
    posterInput.value =
      state.thumbnail || "";
  }

  if (descriptionInput) {
    descriptionInput.value =
      state.description || "";
  }

  updateLiveTVStatusDescription();
}


// ========================================
// GET LIVE TV FORM DATA
// ========================================

function getLiveTVFormData() {
  const enabledToggle =
    document.getElementById(
      "live-tv-enabled-toggle"
    );

  const titleInput =
    document.getElementById(
      "live-tv-title"
    );

  const urlInput =
    document.getElementById(
      "live-tv-url"
    );

  const posterInput =
    document.getElementById(
      "live-tv-poster"
    );

  const descriptionInput =
    document.getElementById(
      "live-tv-description"
    );

  return {
    enabled:
      enabledToggle
        ? enabledToggle.checked
        : adminState.liveTV
            .enabled,

    title:
      titleInput
        ? titleInput.value.trim()
        : adminState.liveTV
            .title,

    url:
      urlInput
        ? urlInput.value.trim()
        : adminState.liveTV
            .streamUrl,

    poster:
      posterInput
        ? posterInput.value.trim()
        : adminState.liveTV
            .thumbnail,

    description:
      descriptionInput
        ? descriptionInput.value.trim()
        : adminState.liveTV
            .description
  };
}


// ========================================
// UPDATE LIVE TV STATUS DESCRIPTION
// ========================================

function updateLiveTVStatusDescription() {
  const element =
    document.getElementById(
      "live-tv-status-description"
    );

  if (!element) {
    return;
  }

  const enabled =
    adminState.liveTV
      ?.enabled === true;

  const status =
    adminState.liveTV
      ?.status ||
    "offline";

  if (!enabled) {
    element.textContent =
      "Live TV सुविधा वर्तमान में बंद है।";
    return;
  }

  if (
    status === "live" ||
    status === "online"
  ) {
    element.textContent =
      "Live TV सक्रिय है और लाइव स्ट्रीम उपलब्ध बताई गई है।";
    return;
  }

  element.textContent =
    "Live TV सक्रिय है, लेकिन वर्तमान स्थिति offline है।";
}


// ========================================
// UPDATE LIVE TV PREVIEW STATUS
// ========================================

function updateLiveTVPreviewStatus() {
  const element =
    document.getElementById(
      "live-tv-preview-status"
    );

  if (!element) {
    return;
  }

  const state =
    adminState.liveTV;

  const status =
    state.status ||
    "offline";

  const enabled =
    state.enabled === true;

  let text =
    "Offline";

  if (
    enabled &&
    (
      status === "live" ||
      status === "online"
    )
  ) {
    text =
      "LIVE";
  } else if (
    enabled
  ) {
    text =
      "ON";
  }

  element.textContent =
    text;
}


// ========================================
// UPDATE LIVE TV PREVIEW
// ========================================

function updateLiveTVPreview() {
  const preview =
    document.getElementById(
      "live-tv-preview"
    );

  if (!preview) {
    updateLiveTVPreviewStatus();
    return;
  }

  const state =
    adminState.liveTV;

  const title =
    state.title ||
    "आवाज राजस्थान LIVE";

  const poster =
    state.thumbnail ||
    "";

  const stream =
    state.streamUrl ||
    state.youtubeUrl ||
    "";

  preview.innerHTML = `
    <div class="live-tv-preview-inner">

      ${
        poster
          ? `
            <img
              src="${escapeHTML(
                poster
              )}"
              alt="${escapeHTML(
                title
              )}"
              loading="lazy"
            >
          `
          : `
            <div class="live-tv-preview-placeholder">
              <span>▶</span>
              <strong>
                ${escapeHTML(
                  title
                )}
              </strong>
            </div>
          `
      }

      <div class="live-tv-preview-overlay">

        <span class="live-tv-preview-badge">
          ${
            state.enabled
              ? "LIVE TV"
              : "OFFLINE"
          }
        </span>

        <h3>
          ${escapeHTML(
            title
          )}
        </h3>

        ${
          stream
            ? `
              <button
                type="button"
                class="admin-btn admin-btn-small"
                data-live-tv-preview-action="open"
              >
                स्ट्रीम खोलें
              </button>
            `
            : ""
        }

      </div>

    </div>
  `;

  const openButton =
    preview.querySelector(
      "[data-live-tv-preview-action='open']"
    );

  if (openButton) {
    openButton.addEventListener(
      "click",
      () => {
        openLiveTVStream(
          stream
        );
      }
    );
  }

  updateLiveTVPreviewStatus();
}


// ========================================
// OPEN LIVE TV STREAM
// ========================================

function openLiveTVStream(
  url
) {
  const streamURL =
    String(
      url || ""
    ).trim();

  if (!streamURL) {
    showAdminToast(
      "warning",
      "स्ट्रीम उपलब्ध नहीं",
      "Live TV का stream URL उपलब्ध नहीं है।"
    );

    return;
  }

  try {
    const parsed =
      new URL(
        streamURL,
        window.location.origin
      );

    if (
      ![
        "http:",
        "https:"
      ].includes(
        parsed.protocol
      )
    ) {
      throw new Error(
        "Invalid protocol"
      );
    }

    window.open(
      parsed.href,
      "_blank",
      "noopener,noreferrer"
    );
  } catch (error) {
    showAdminToast(
      "error",
      "गलत URL",
      "Live TV का URL सही नहीं है।"
    );
  }
}


// ========================================
// VALIDATE LIVE TV
// ========================================

function validateLiveTVData(
  data
) {
  if (!data.title) {
    return {
      valid: false,
      message:
        "Live TV का title आवश्यक है।"
    };
  }

  if (
    data.url &&
    !isValidHTTPURL(
      data.url
    )
  ) {
    return {
      valid: false,
      message:
        "Live TV URL सही नहीं है।"
    };
  }

  if (
    data.poster &&
    !isValidHTTPURL(
      data.poster
    )
  ) {
    return {
      valid: false,
      message:
        "Poster URL सही नहीं है।"
    };
  }

  return {
    valid: true,
    message: ""
  };
}


// ========================================
// URL VALIDATOR
// ========================================

function isValidHTTPURL(
  value
) {
  try {
    const url =
      new URL(
        value
      );

    return (
      url.protocol ===
        "http:" ||
      url.protocol ===
        "https:"
    );
  } catch (
    error
  ) {
    return false;
  }
}


// ========================================
// SAVE LIVE TV
// ========================================

async function saveLiveTV() {
  if (
    !requireAdminPermission(
      "settings.update"
    )
  ) {
    return;
  }

  const data =
    getLiveTVFormData();

  const validation =
    validateLiveTVData(
      data
    );

  if (
    !validation.valid
  ) {
    showAdminToast(
      "warning",
      "जानकारी अधूरी है",
      validation.message
    );

    return;
  }

  /*
   * महत्वपूर्ण:
   * वर्तमान backend में GET /api/site/live-tv
   * उपलब्ध है, लेकिन Live TV update के लिए
   * कोई confirmed PUT/PATCH/POST route नहीं है।
   *
   * इसलिए यहां fake API endpoint नहीं बनाया गया है।
   */

  showAdminToast(
    "warning",
    "Save API उपलब्ध नहीं",
    "वर्तमान backend में Live TV settings को save करने की write API मौजूद नहीं है।"
  );
}


// ========================================
// LIVE TV TOGGLE
// ========================================

function initializeLiveTVToggle() {
  const toggle =
    document.getElementById(
      "live-tv-enabled-toggle"
    );

  if (!toggle) {
    return;
  }

  toggle.addEventListener(
    "change",
    () => {
      const enabled =
        toggle.checked;

      adminState.liveTV.enabled =
        enabled;

      updateLiveTVStatusDescription();

      updateLiveTVPreview();

      showAdminToast(
        "info",
        enabled
          ? "Live TV ON"
          : "Live TV OFF",
        "यह बदलाव अभी केवल admin panel में preview के लिए है। स्थायी save के लिए backend write API आवश्यक है।"
      );
    }
  );
}


// ========================================
// LIVE TV FORM INPUTS
// ========================================

function initializeLiveTVInputs() {
  const ids = [
    "live-tv-title",
    "live-tv-url",
    "live-tv-poster",
    "live-tv-description"
  ];

  ids.forEach(
    (id) => {
      const element =
        document.getElementById(
          id
        );

      if (!element) {
        return;
      }

      element.addEventListener(
        "input",
        () => {
          syncLiveTVPreviewFromForm();
        }
      );
    }
  );
}


// ========================================
// SYNC PREVIEW FROM FORM
// ========================================

function syncLiveTVPreviewFromForm() {
  const data =
    getLiveTVFormData();

  adminState.liveTV.title =
    data.title;

  adminState.liveTV.streamUrl =
    data.url;

  adminState.liveTV.thumbnail =
    data.poster;

  adminState.liveTV.description =
    data.description;

  updateLiveTVPreview();
}


// ========================================
// LIVE TV SAVE BUTTON
// ========================================

function initializeLiveTVSaveButton() {
  const button =
    document.getElementById(
      "save-live-tv-button"
    );

  if (!button) {
    return;
  }

  button.addEventListener(
    "click",
    async () => {
      setButtonLoading(
        button,
        true
      );

      try {
        await saveLiveTV();
      } finally {
        setButtonLoading(
          button,
          false
        );
      }
    }
  );
}


// ========================================
// LIVE TV REFRESH BUTTON
// ========================================

function initializeLiveTVRefreshButton() {
  const button =
    document.getElementById(
      "live-tv-refresh-button"
    );

  if (!button) {
    return;
  }

  button.addEventListener(
    "click",
    async () => {
      setButtonLoading(
        button,
        true
      );

      try {
        await loadLiveTV(
          true
        );

        showAdminToast(
          "success",
          "Live TV अपडेट",
          "Live TV की वर्तमान जानकारी अपडेट हो गई।"
        );
      } catch (
        error
      ) {
        console.error(
          "Live TV refresh error:",
          error
        );
      } finally {
        setButtonLoading(
          button,
          false
        );
      }
    }
  );
}


// ========================================
// INITIALIZE LIVE TV SECTION
// ========================================

function initializeLiveTVSection() {
  initializeLiveTVToggle();

  initializeLiveTVInputs();

  initializeLiveTVSaveButton();

  initializeLiveTVRefreshButton();
}


// ========================================
// GET LIVE TV STATE
// ========================================

function getLiveTVState() {
  return {
    ...adminState.liveTV
  };
     }
// ========================================
// ADMIN.JS
// PART 19 / 25
// LIVE BLOG MANAGEMENT
// ========================================


// ========================================
// LIVE BLOG STATE
// ========================================

if (!adminState.liveBlog) {
  adminState.liveBlog = {
    enabled: false,
    title: "",
    description: "",
    status: "offline",
    items: [],
    loading: false,
    publishing: false,
    loaded: false
  };
}


// ========================================
// LOAD LIVE BLOG
// ========================================

async function loadLiveBlog(
  forceRefresh = false
) {
  if (
    !adminState.isAuthenticated
  ) {
    return null;
  }

  const state =
    adminState.liveBlog;

  if (
    state.loading &&
    !forceRefresh
  ) {
    return state;
  }

  state.loading = true;

  try {
    const response =
      await adminAPIRequest(
        "/api/site/live-blog"
      );

    const data =
      normalizeAPIResponse(
        response
      );

    const liveBlog =
      data.liveBlog ||
      data.data?.liveBlog ||
      data;

    state.enabled =
      liveBlog?.enabled === true;

    state.title =
      liveBlog?.title ||
      "";

    state.description =
      liveBlog?.description ||
      "";

    state.status =
      liveBlog?.status ||
      "offline";

    const updates =
      liveBlog?.updates ||
      liveBlog?.items ||
      liveBlog?.posts ||
      [];

    state.items =
      Array.isArray(
        updates
      )
        ? updates
            .map(
              normalizeLiveBlogUpdate
            )
        : [];

    state.loaded =
      true;

    populateLiveBlogInfo();

    renderLiveBlogList();

    return state;
  } catch (error) {
    console.error(
      "Live Blog loading error:",
      error
    );

    /*
     * वर्तमान backend में Live Blog
     * static configuration के रूप में
     * उपलब्ध हो सकता है।
     */

    state.items = [];

    renderLiveBlogList();

    showAdminToast(
      "error",
      "Live Blog लोड नहीं हुआ",
      error?.message ||
        "Live Blog की जानकारी प्राप्त करने में समस्या हुई।"
    );

    return null;
  } finally {
    state.loading = false;
  }
}


// ========================================
// NORMALIZE LIVE BLOG UPDATE
// ========================================

function normalizeLiveBlogUpdate(
  item
) {
  if (!item) {
    return {
      id: "",
      text: "",
      type: "update",
      createdAt: null,
      author: ""
    };
  }

  return {
    ...item,

    id:
      getObjectId(
        item
      ),

    text:
      item.text ||
      item.content ||
      item.message ||
      item.body ||
      "",

    type:
      item.type ||
      item.updateType ||
      "update",

    createdAt:
      item.createdAt ||
      item.publishedAt ||
      item.updatedAt ||
      null,

    author:
      item.author?.name ||
      item.author ||
      item.authorName ||
      ""
  };
}


// ========================================
// POPULATE LIVE BLOG INFO
// ========================================

function populateLiveBlogInfo() {
  const state =
    adminState.liveBlog;

  const title =
    document.getElementById(
      "live-blog-current-title"
    );

  const description =
    document.getElementById(
      "live-blog-current-description"
    );

  const status =
    document.getElementById(
      "live-blog-current-status"
    );

  if (title) {
    title.textContent =
      state.title ||
      "Live Blog";
  }

  if (description) {
    description.textContent =
      state.description ||
      "Live Blog की वर्तमान जानकारी";
  }

  if (status) {
    status.textContent =
      getLiveBlogStatusLabel(
        state.status,
        state.enabled
      );
  }

  updateLiveBlogCount();
}


// ========================================
// LIVE BLOG STATUS LABEL
// ========================================

function getLiveBlogStatusLabel(
  status,
  enabled
) {
  if (
    enabled &&
    (
      status === "live" ||
      status === "online"
    )
  ) {
    return "LIVE";
  }

  if (
    enabled
  ) {
    return "सक्रिय";
  }

  if (
    status === "ended" ||
    status === "closed"
  ) {
    return "समाप्त";
  }

  return "ऑफलाइन";
}


// ========================================
// UPDATE LIVE BLOG COUNT
// ========================================

function updateLiveBlogCount() {
  const element =
    document.getElementById(
      "live-blog-count"
    );

  if (!element) {
    return;
  }

  element.textContent =
    formatNumber(
      adminState.liveBlog
        ?.items
        ?.length || 0
    );
}


// ========================================
// RENDER LIVE BLOG LIST
// ========================================

function renderLiveBlogList() {
  const container =
    document.getElementById(
      "live-blog-list"
    );

  const emptyState =
    document.getElementById(
      "live-blog-empty-state"
    );

  if (!container) {
    return;
  }

  container.innerHTML = "";

  const items =
    adminState.liveBlog
      ?.items ||
    [];

  if (
    items.length === 0
  ) {
    if (emptyState) {
      emptyState.classList.remove(
        "hidden"
      );
    }

    updateLiveBlogCount();

    return;
  }

  if (emptyState) {
    emptyState.classList.add(
      "hidden"
    );
  }

  items.forEach(
    (
      item,
      index
    ) => {
      const element =
        createLiveBlogUpdateElement(
          item,
          index
        );

      container.appendChild(
        element
      );
    }
  );

  updateLiveBlogCount();
}


// ========================================
// CREATE LIVE BLOG UPDATE ELEMENT
// ========================================

function createLiveBlogUpdateElement(
  item,
  index
) {
  const element =
    document.createElement(
      "article"
    );

  const type =
    getLiveBlogUpdateTypeLabel(
      item.type
    );

  const date =
    formatDateTime(
      item.createdAt
    );

  element.className =
    "live-blog-update-item";

  element.dataset.updateId =
    item.id ||
    `update-${index}`;

  element.innerHTML = `
    <div class="live-blog-update-marker">
      <span></span>
    </div>

    <div class="live-blog-update-content">

      <div class="live-blog-update-meta">

        <span class="live-blog-update-type">
          ${escapeHTML(
            type
          )}
        </span>

        <span>
          ${escapeHTML(
            date
          )}
        </span>

      </div>

      <div class="live-blog-update-text">
        ${escapeHTML(
          item.text ||
            ""
        )}
      </div>

      ${
        item.author
          ? `
            <div class="live-blog-update-author">
              ${escapeHTML(
                item.author
              )}
            </div>
          `
          : ""
      }

    </div>
  `;

  return element;
}


// ========================================
// LIVE BLOG UPDATE TYPE LABEL
// ========================================

function getLiveBlogUpdateTypeLabel(
  type
) {
  const labels = {
    update:
      "अपडेट",

    breaking:
      "ब्रेकिंग",

    headline:
      "मुख्य खबर",

    photo:
      "फोटो",

    video:
      "वीडियो",

    quote:
      "बयान",

    correction:
      "सुधार"
  };

  const key =
    String(
      type || "update"
    ).toLowerCase();

  return (
    labels[key] ||
    "अपडेट"
  );
}


// ========================================
// LIVE BLOG COMPOSER
// ========================================

function getLiveBlogComposerData() {
  const textInput =
    document.getElementById(
      "live-blog-update-text"
    );

  const typeInput =
    document.getElementById(
      "live-blog-update-type"
    );

  return {
    text:
      textInput
        ? textInput.value.trim()
        : "",

    type:
      typeInput
        ? typeInput.value
        : "update"
  };
}


// ========================================
// VALIDATE LIVE BLOG UPDATE
// ========================================

function validateLiveBlogUpdate(
  data
) {
  if (
    !data.text
  ) {
    return {
      valid: false,
      message:
        "Live Blog अपडेट का text लिखें।"
    };
  }

  if (
    data.text.length <
    2
  ) {
    return {
      valid: false,
      message:
        "Live Blog अपडेट बहुत छोटा है।"
    };
  }

  if (
    data.text.length >
    5000
  ) {
    return {
      valid: false,
      message:
        "Live Blog अपडेट 5000 characters से अधिक नहीं होना चाहिए।"
    };
  }

  return {
    valid: true,
    message: ""
  };
}


// ========================================
// PUBLISH LIVE BLOG UPDATE
// ========================================

async function publishLiveBlogUpdate() {
  if (
    !requireAdminPermission(
      "news.create"
    )
  ) {
    return;
  }

  const data =
    getLiveBlogComposerData();

  const validation =
    validateLiveBlogUpdate(
      data
    );

  if (
    !validation.valid
  ) {
    showAdminToast(
      "warning",
      "जानकारी अधूरी है",
      validation.message
    );

    return;
  }

  /*
   * महत्वपूर्ण:
   * वर्तमान backend में Live Blog update
   * publish करने की confirmed write API
   * उपलब्ध नहीं है।
   *
   * इसलिए कोई fake endpoint call नहीं किया गया।
   */

  showAdminToast(
    "warning",
    "Publish API उपलब्ध नहीं",
    "वर्तमान backend में Live Blog update publish करने की write API मौजूद नहीं है।"
  );
}


// ========================================
// CLEAR LIVE BLOG COMPOSER
// ========================================

function clearLiveBlogComposer() {
  const textInput =
    document.getElementById(
      "live-blog-update-text"
    );

  const typeInput =
    document.getElementById(
      "live-blog-update-type"
    );

  if (textInput) {
    textInput.value = "";
  }

  if (typeInput) {
    typeInput.value =
      "update";
  }
}


// ========================================
// CREATE LIVE BLOG BUTTON
// ========================================

function initializeLiveBlogCreateButton() {
  const button =
    document.getElementById(
      "create-live-blog-button"
    );

  if (!button) {
    return;
  }

  button.addEventListener(
    "click",
    () => {
      const composer =
        document.getElementById(
          "live-blog-composer"
        );

      if (composer) {
        composer.classList.remove(
          "hidden"
        );

        composer.scrollIntoView({
          behavior:
            "smooth",
          block:
            "center"
        });
      } else {
        showAdminToast(
          "info",
          "Live Blog",
          "Live Blog composer उपलब्ध नहीं है।"
        );
      }
    }
  );
}


// ========================================
// PUBLISH BUTTON
// ========================================

function initializeLiveBlogPublishButton() {
  const button =
    document.getElementById(
      "publish-live-blog-update"
    );

  if (!button) {
    return;
  }

  button.addEventListener(
    "click",
    async () => {
      setButtonLoading(
        button,
        true
      );

      try {
        await publishLiveBlogUpdate();
      } finally {
        setButtonLoading(
          button,
          false
        );
      }
    }
  );
}


// ========================================
// LIVE BLOG REFRESH
// ========================================

function initializeLiveBlogRefreshButton() {
  const button =
    document.getElementById(
      "live-blog-refresh-button"
    );

  if (!button) {
    return;
  }

  button.addEventListener(
    "click",
    async () => {
      setButtonLoading(
        button,
        true
      );

      try {
        await loadLiveBlog(
          true
        );

        showAdminToast(
          "success",
          "Live Blog अपडेट",
          "Live Blog की वर्तमान जानकारी अपडेट हो गई।"
        );
      } finally {
        setButtonLoading(
          button,
          false
        );
      }
    }
  );
}


// ========================================
// INITIALIZE LIVE BLOG SECTION
// ========================================

function initializeLiveBlogSection() {
  initializeLiveBlogCreateButton();

  initializeLiveBlogPublishButton();

  initializeLiveBlogRefreshButton();
}


// ========================================
// GET LIVE BLOG STATE
// ========================================

function getLiveBlogState() {
  return {
    ...adminState.liveBlog,

    items: [
      ...(adminState.liveBlog
        ?.items ||
        [])
    ]
  };
}


// ========================================
// LIVE BLOG CLEANUP
// ========================================

function resetLiveBlogComposer() {
  clearLiveBlogComposer();

  const composer =
    document.getElementById(
      "live-blog-composer"
    );

  if (composer) {
    composer.classList.add(
      "hidden"
    );
  }
       }
// ========================================
// ADMIN.JS
// PART 20 / 25
// E-PAPER MANAGEMENT
// ========================================


// ========================================
// E-PAPER STATE
// ========================================

if (!adminState.epaper) {
  adminState.epaper = {
    current: null,
    history: [],
    loading: false,
    uploading: false,
    loaded: false,
    selectedFile: null
  };
}


// ========================================
// LOAD E-PAPER DATA
// ========================================

async function loadEPaper(
  forceRefresh = false
) {
  if (
    !adminState.isAuthenticated
  ) {
    return null;
  }

  const state =
    adminState.epaper;

  if (
    state.loading &&
    !forceRefresh
  ) {
    return state;
  }

  state.loading = true;

  try {
    /*
     * वर्तमान backend में ePaper के लिए
     * dedicated GET API route उपलब्ध है या नहीं,
     * यह routes में confirmed नहीं है।
     *
     * इसलिए पहले संभावित public endpoints
     * को सुरक्षित तरीके से check किया जाता है।
     */

    const endpoints = [
      "/api/site/epaper",
      "/api/epaper"
    ];

    let response = null;
    let lastError = null;

    for (
      const endpoint of endpoints
    ) {
      try {
        response =
          await adminAPIRequest(
            endpoint
          );

        if (response) {
          break;
        }
      } catch (error) {
        lastError =
          error;
      }
    }

    if (!response) {
      throw (
        lastError ||
        new Error(
          "ePaper API उपलब्ध नहीं है।"
        )
      );
    }

    const data =
      normalizeAPIResponse(
        response
      );

    const epaper =
      data.epaper ||
      data.ePaper ||
      data.current ||
      data.data?.epaper ||
      data.data?.ePaper ||
      null;

    const history =
      data.history ||
      data.items ||
      data.epapers ||
      data.data?.history ||
      [];

    state.current =
      normalizeEPaper(
        epaper
      );

    state.history =
      Array.isArray(
        history
      )
        ? history.map(
            normalizeEPaper
          )
        : [];

    state.loaded =
      true;

    renderCurrentEPaper();

    renderEPaperHistory();

    return state;
  } catch (error) {
    console.error(
      "ePaper loading error:",
      error
    );

    state.current =
      null;

    state.history =
      [];

    renderCurrentEPaper();

    renderEPaperHistory();

    showAdminToast(
      "warning",
      "ePaper API उपलब्ध नहीं",
      "वर्तमान backend में ePaper की read API उपलब्ध नहीं है या endpoint अलग है।"
    );

    return null;
  } finally {
    state.loading = false;
  }
}


// ========================================
// NORMALIZE E-PAPER
// ========================================

function normalizeEPaper(
  item
) {
  if (!item) {
    return null;
  }

  return {
    ...item,

    id:
      getObjectId(
        item
      ),

    title:
      item.title ||
      item.name ||
      "राजस्थान ePaper",

    date:
      item.date ||
      item.publishDate ||
      item.publishedAt ||
      item.createdAt ||
      null,

    description:
      item.description ||
      "",

    fileUrl:
      item.fileUrl ||
      item.pdfUrl ||
      item.url ||
      item.file ||
      "",

    fileName:
      item.fileName ||
      item.filename ||
      "",

    isPublished:
      item.isPublished === true ||
      item.published === true,

    isFeatured:
      item.isFeatured === true ||
      item.featured === true,

    createdAt:
      item.createdAt ||
      null,

    updatedAt:
      item.updatedAt ||
      null
  };
}


// ========================================
// RENDER CURRENT E-PAPER
// ========================================

function renderCurrentEPaper() {
  const state =
    adminState.epaper;

  const current =
    state.current;

  const title =
    document.getElementById(
      "current-epaper-title"
    );

  const meta =
    document.getElementById(
      "current-epaper-meta"
    );

  const status =
    document.getElementById(
      "current-epaper-status"
    );

  const preview =
    document.getElementById(
      "epaper-preview-button"
    );

  const download =
    document.getElementById(
      "epaper-download-button"
    );

  if (!current) {
    if (title) {
      title.textContent =
        "कोई ePaper उपलब्ध नहीं";
    }

    if (meta) {
      meta.textContent =
        "अभी कोई प्रकाशित ePaper नहीं मिला।";
    }

    if (status) {
      status.textContent =
        "उपलब्ध नहीं";
    }

    if (preview) {
      preview.disabled =
        true;
    }

    if (download) {
      download.disabled =
        true;
    }

    return;
  }

  if (title) {
    title.textContent =
      current.title;
  }

  if (meta) {
    const date =
      current.date
        ? formatDateTime(
            current.date
          )
        : "तारीख उपलब्ध नहीं";

    meta.textContent =
      date;
  }

  if (status) {
    status.textContent =
      current.isPublished
        ? "प्रकाशित"
        : "ड्राफ्ट";
  }

  if (preview) {
    preview.disabled =
      !current.fileUrl;

    preview.onclick =
      () => {
        openEPaperURL(
          current.fileUrl
        );
      };
  }

  if (download) {
    download.disabled =
      !current.fileUrl;

    download.onclick =
      () => {
        downloadEPaper(
          current
        );
      };
  }
}


// ========================================
// RENDER E-PAPER HISTORY
// ========================================

function renderEPaperHistory() {
  const container =
    document.getElementById(
      "epaper-history-list"
    );

  if (!container) {
    return;
  }

  container.innerHTML = "";

  const history =
    adminState.epaper
      ?.history ||
    [];

  if (
    history.length === 0
  ) {
    container.innerHTML = `
      <div class="admin-empty-inline">
        ePaper history उपलब्ध नहीं है।
      </div>
    `;

    return;
  }

  history.forEach(
    (
      item,
      index
    ) => {
      const element =
        createEPaperHistoryItem(
          item,
          index
        );

      container.appendChild(
        element
      );
    }
  );
}


// ========================================
// CREATE E-PAPER HISTORY ITEM
// ========================================

function createEPaperHistoryItem(
  item,
  index
) {
  const element =
    document.createElement(
      "div"
    );

  const title =
    item.title ||
    "राजस्थान ePaper";

  const date =
    item.date
      ? formatDateTime(
          item.date
        )
      : "तारीख उपलब्ध नहीं";

  const status =
    item.isPublished
      ? "प्रकाशित"
      : "ड्राफ्ट";

  element.className =
    "epaper-history-item";

  element.dataset.epaperId =
    item.id ||
    `epaper-${index}`;

  element.innerHTML = `
    <div class="epaper-history-info">

      <strong>
        ${escapeHTML(
          title
        )}
      </strong>

      <span>
        ${escapeHTML(
          date
        )}
      </span>

      <span>
        ${escapeHTML(
          status
        )}
      </span>

    </div>

    <div class="epaper-history-actions">

      ${
        item.fileUrl
          ? `
            <button
              type="button"
              class="admin-btn admin-btn-small"
              data-epaper-action="preview"
            >
              देखें
            </button>

            <button
              type="button"
              class="admin-btn admin-btn-small"
              data-epaper-action="download"
            >
              डाउनलोड
            </button>
          `
          : ""
      }

    </div>
  `;

  const previewButton =
    element.querySelector(
      "[data-epaper-action='preview']"
    );

  if (previewButton) {
    previewButton.addEventListener(
      "click",
      () => {
        openEPaperURL(
          item.fileUrl
        );
      }
    );
  }

  const downloadButton =
    element.querySelector(
      "[data-epaper-action='download']"
    );

  if (downloadButton) {
    downloadButton.addEventListener(
      "click",
      () => {
        downloadEPaper(
          item
        );
      }
    );
  }

  return element;
}


// ========================================
// OPEN E-PAPER URL
// ========================================

function openEPaperURL(
  url
) {
  const fileURL =
    String(
      url || ""
    ).trim();

  if (!fileURL) {
    showAdminToast(
      "warning",
      "PDF उपलब्ध नहीं",
      "ePaper की PDF file उपलब्ध नहीं है।"
    );

    return;
  }

  try {
    const parsed =
      new URL(
        fileURL,
        window.location.origin
      );

    if (
      ![
        "http:",
        "https:"
      ].includes(
        parsed.protocol
      )
    ) {
      throw new Error(
        "Invalid URL"
      );
    }

    window.open(
      parsed.href,
      "_blank",
      "noopener,noreferrer"
    );
  } catch (error) {
    showAdminToast(
      "error",
      "गलत PDF URL",
      "ePaper PDF खोली नहीं जा सकी।"
    );
  }
}


// ========================================
// DOWNLOAD E-PAPER
// ========================================

function downloadEPaper(
  epaper
) {
  if (
    !epaper ||
    !epaper.fileUrl
  ) {
    showAdminToast(
      "warning",
      "PDF उपलब्ध नहीं",
      "डाउनलोड करने के लिए PDF उपलब्ध नहीं है।"
    );

    return;
  }

  const link =
    document.createElement(
      "a"
    );

  link.href =
    epaper.fileUrl;

  link.target =
    "_blank";

  link.rel =
    "noopener noreferrer";

  if (
    epaper.fileName
  ) {
    link.download =
      epaper.fileName;
  }

  document.body.appendChild(
    link
  );

  link.click();

  link.remove();
}


// ========================================
// E-PAPER FILE INPUT
// ========================================

function initializeEPaperFileInput() {
  const input =
    document.getElementById(
      "epaper-file"
    );

  const selected =
    document.getElementById(
      "epaper-selected-file"
    );

  const dropZone =
    document.getElementById(
      "epaper-file-drop-zone"
    );

  if (!input) {
    return;
  }

  input.addEventListener(
    "change",
    () => {
      handleEPaperFileSelection(
        input.files
          ?. [0]
      );
    }
  );

  if (dropZone) {
    dropZone.addEventListener(
      "dragover",
      (event) => {
        event.preventDefault();

        dropZone.classList.add(
          "drag-over"
        );
      }
    );

    dropZone.addEventListener(
      "dragleave",
      () => {
        dropZone.classList.remove(
          "drag-over"
        );
      }
    );

    dropZone.addEventListener(
      "drop",
      (event) => {
        event.preventDefault();

        dropZone.classList.remove(
          "drag-over"
        );

        const file =
          event.dataTransfer
            ?.files
            ?.[0];

        handleEPaperFileSelection(
          file
        );
      }
    );
  }

  if (selected) {
    selected.textContent =
      "";
  }
}


// ========================================
// HANDLE FILE SELECTION
// ========================================

function handleEPaperFileSelection(
  file
) {
  const selected =
    document.getElementById(
      "epaper-selected-file"
    );

  if (!file) {
    adminState.epaper.selectedFile =
      null;

    if (selected) {
      selected.textContent =
        "";
    }

    return;
  }

  const maxSize =
    20 * 1024 * 1024;

  const isPDF =
    file.type ===
      "application/pdf" ||
    file.name
      .toLowerCase()
      .endsWith(
        ".pdf"
      );

  if (!isPDF) {
    adminState.epaper.selectedFile =
      null;

    showAdminToast(
      "warning",
      "गलत फाइल",
      "केवल PDF file अपलोड करें।"
    );

    return;
  }

  if (
    file.size >
    maxSize
  ) {
    adminState.epaper.selectedFile =
      null;

    showAdminToast(
      "warning",
      "फाइल बहुत बड़ी है",
      "ePaper PDF का आकार 20 MB से अधिक नहीं होना चाहिए।"
    );

    return;
  }

  adminState.epaper.selectedFile =
    file;

  if (selected) {
    selected.textContent =
      `${file.name} (${formatFileSize(
        file.size
      )})`;
  }
}


// ========================================
// FORMAT FILE SIZE
// ========================================

function formatFileSize(
  bytes
) {
  const size =
    Number(
      bytes || 0
    );

  if (
    size <= 0
  ) {
    return "0 Bytes";
  }

  const units = [
    "Bytes",
    "KB",
    "MB",
    "GB"
  ];

  const index =
    Math.floor(
      Math.log(
        size
      ) /
        Math.log(
          1024
        )
    );

  const safeIndex =
    Math.min(
      index,
      units.length - 1
    );

  const value =
    size /
    Math.pow(
      1024,
      safeIndex
    );

  return `${value.toFixed(
    safeIndex === 0
      ? 0
      : 2
  )} ${
    units[
      safeIndex
    ]
  }`;
}


// ========================================
// GET E-PAPER FORM DATA
// ========================================

function getEPaperFormData() {
  const title =
    document.getElementById(
      "epaper-title"
    );

  const date =
    document.getElementById(
      "epaper-date"
    );

  const description =
    document.getElementById(
      "epaper-description"
    );

  const featured =
    document.getElementById(
      "epaper-featured"
    );

  return {
    title:
      title
        ? title.value.trim()
        : "",

    date:
      date
        ? date.value
        : "",

    description:
      description
        ? description.value.trim()
        : "",

    featured:
      featured
        ? featured.checked
        : false,

    file:
      adminState.epaper
        .selectedFile
  };
}


// ========================================
// VALIDATE E-PAPER FORM
// ========================================

function validateEPaperForm(
  data
) {
  if (
    !data.title
  ) {
    return {
      valid: false,
      message:
        "ePaper का title आवश्यक है।"
    };
  }

  if (
    data.title.length <
    2
  ) {
    return {
      valid: false,
      message:
        "ePaper title बहुत छोटा है।"
    };
  }

  if (
    !data.date
  ) {
    return {
      valid: false,
      message:
        "ePaper की तारीख चुनें।"
    };
  }

  if (!data.file) {
    return {
      valid: false,
      message:
        "ePaper PDF file चुनें।"
    };
  }

  return {
    valid: true,
    message: ""
  };
}


// ========================================
// UPLOAD E-PAPER
// ========================================

async function uploadEPaper() {
  if (
    !requireAdminPermission(
      "settings.update"
    )
  ) {
    return;
  }

  const data =
    getEPaperFormData();

  const validation =
    validateEPaperForm(
      data
    );

  if (
    !validation.valid
  ) {
    showAdminToast(
      "warning",
      "जानकारी अधूरी है",
      validation.message
    );

    return;
  }

  /*
   * वर्तमान backend में ePaper upload
   * route confirmed नहीं है।
   *
   * इसलिए यहां गलत/fake endpoint नहीं बनाया गया।
   */

  showAdminToast(
    "warning",
    "Upload API उपलब्ध नहीं",
    "वर्तमान backend में ePaper upload करने की confirmed API route उपलब्ध नहीं है।"
  );
}


// ========================================
// RESET E-PAPER FORM
// ========================================

function resetEPaperForm() {
  const form =
    document.getElementById(
      "epaper-upload-form"
    );

  if (form) {
    form.reset();
  }

  adminState.epaper.selectedFile =
    null;

  const selected =
    document.getElementById(
      "epaper-selected-file"
    );

  if (selected) {
    selected.textContent =
      "";
  }
}


// ========================================
// E-PAPER UPLOAD BUTTON
// ========================================

function initializeEPaperUploadButton() {
  const button =
    document.getElementById(
      "epaper-upload-button"
    );

  if (!button) {
    return;
  }

  button.addEventListener(
    "click",
    () => {
      const form =
        document.getElementById(
          "epaper-upload-form"
        );

      if (form) {
        form.scrollIntoView({
          behavior:
            "smooth",
          block:
            "center"
        });
      }
    }
  );
}


// ========================================
// E-PAPER FORM SUBMIT
// ========================================

function initializeEPaperForm() {
  const form =
    document.getElementById(
      "epaper-upload-form"
    );

  if (!form) {
    return;
  }

  form.addEventListener(
    "submit",
    async (event) => {
      event.preventDefault();

      const button =
        document.getElementById(
          "epaper-submit-button"
        );

      if (button) {
        setButtonLoading(
          button,
          true
        );
      }

      try {
        await uploadEPaper();
      } finally {
        if (button) {
          setButtonLoading(
            button,
            false
          );
        }
      }
    }
  );
}


// ========================================
// E-PAPER RESET BUTTON
// ========================================

function initializeEPaperResetButton() {
  const button =
    document.getElementById(
      "epaper-reset-button"
    );

  if (!button) {
    return;
  }

  button.addEventListener(
    "click",
    resetEPaperForm
  );
}


// ========================================
// E-PAPER REFRESH BUTTON
// ========================================

function initializeEPaperRefreshButton() {
  const button =
    document.getElementById(
      "epaper-refresh-button"
    );

  if (!button) {
    return;
  }

  button.addEventListener(
    "click",
    async () => {
      setButtonLoading(
        button,
        true
      );

      try {
        await loadEPaper(
          true
        );

        showAdminToast(
          "success",
          "ePaper अपडेट",
          "ePaper जानकारी अपडेट हो गई।"
        );
      } finally {
        setButtonLoading(
          button,
          false
        );
      }
    }
  );
}


// ========================================
// INITIALIZE E-PAPER SECTION
// ========================================

function initializeEPaperSection() {
  initializeEPaperFileInput();

  initializeEPaperUploadButton();

  initializeEPaperForm();

  initializeEPaperResetButton();

  initializeEPaperRefreshButton();
}


// ========================================
// GET E-PAPER STATE
// ========================================

function getEPaperState() {
  return {
    ...adminState.epaper,

    history: [
      ...(adminState.epaper
        ?.history ||
        [])
    ]
  };
       }
// ========================================
// ADMIN.JS
// PART 21 / 25
// CONTACTS MANAGEMENT
// ========================================


// ========================================
// CONTACTS STATE
// ========================================

if (!adminState.contacts) {
  adminState.contacts = {
    items: [],
    filteredItems: [],
    loading: false,
    loaded: false,
    search: "",
    status: "all",
    sort: "newest",
    page: 1,
    pageSize: 10,
    total: 0
  };
}


// ========================================
// LOAD CONTACTS
// ========================================

async function loadContacts(
  forceRefresh = false
) {
  if (
    !adminState.isAuthenticated
  ) {
    return [];
  }

  const state =
    adminState.contacts;

  if (
    state.loading &&
    !forceRefresh
  ) {
    return state.items;
  }

  state.loading = true;

  try {
    /*
     * वर्तमान backend में contact routes
     * उपलब्ध हैं, लेकिन GET route की exact
     * pagination schema अलग हो सकती है।
     *
     * पहले सामान्य contacts endpoint लिया जाता है।
     */

    const response =
      await adminAPIRequest(
        "/api/contact"
      );

    const data =
      normalizeAPIResponse(
        response
      );

    const contacts =
      extractArrayData(
        data,
        [
          "contacts",
          "items",
          "results",
          "data"
        ]
      );

    state.items =
      contacts.map(
        normalizeContact
      );

    state.total =
      state.items.length;

    state.loaded =
      true;

    applyContactFilters();

    renderContacts();

    updateContactStats();

    return state.items;
  } catch (error) {
    console.error(
      "Contacts loading error:",
      error
    );

    state.items = [];

    state.filteredItems = [];

    state.total = 0;

    renderContacts();

    updateContactStats();

    showAdminToast(
      "error",
      "Contacts लोड नहीं हुए",
      error?.message ||
        "संपर्क संदेश प्राप्त करने में समस्या हुई।"
    );

    return [];
  } finally {
    state.loading = false;
  }
}


// ========================================
// NORMALIZE CONTACT
// ========================================

function normalizeContact(
  item
) {
  if (!item) {
    return {
      id: "",
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      status: "new",
      createdAt: null,
      updatedAt: null
    };
  }

  return {
    ...item,

    id:
      getObjectId(
        item
      ),

    name:
      item.name ||
      item.fullName ||
      item.userName ||
      "अज्ञात",

    email:
      item.email ||
      "",

    phone:
      item.phone ||
      item.mobile ||
      "",

    subject:
      item.subject ||
      "",

    message:
      item.message ||
      item.content ||
      item.body ||
      "",

    status:
      String(
        item.status ||
        "new"
      ).toLowerCase(),

    createdAt:
      item.createdAt ||
      item.date ||
      null,

    updatedAt:
      item.updatedAt ||
      null
  };
}


// ========================================
// APPLY CONTACT FILTERS
// ========================================

function applyContactFilters() {
  const state =
    adminState.contacts;

  let items =
    [
      ...(state.items || [])
    ];

  const search =
    String(
      state.search || ""
    )
      .trim()
      .toLowerCase();

  const status =
    state.status ||
    "all";

  const sort =
    state.sort ||
    "newest";

  if (search) {
    items =
      items.filter(
        (item) => {
          const name =
            String(
              item.name || ""
            ).toLowerCase();

          const email =
            String(
              item.email || ""
            ).toLowerCase();

          const subject =
            String(
              item.subject || ""
            ).toLowerCase();

          const message =
            String(
              item.message || ""
            ).toLowerCase();

          const phone =
            String(
              item.phone || ""
            ).toLowerCase();

          return (
            name.includes(
              search
            ) ||
            email.includes(
              search
            ) ||
            subject.includes(
              search
            ) ||
            message.includes(
              search
            ) ||
            phone.includes(
              search
            )
          );
        }
      );
  }

  if (
    status !== "all"
  ) {
    items =
      items.filter(
        (item) =>
          item.status ===
          status
      );
  }

  items =
    sortContacts(
      items,
      sort
    );

  state.filteredItems =
    items;

  state.total =
    items.length;

  const maxPage =
    Math.max(
      1,
      Math.ceil(
        items.length /
          state.pageSize
      )
    );

  if (
    state.page >
    maxPage
  ) {
    state.page =
      maxPage;
  }

  updateContactResultCount();

  updateContactPagination();
}


// ========================================
// SORT CONTACTS
// ========================================

function sortContacts(
  items,
  sort
) {
  const list =
    [
      ...(items || [])
    ];

  list.sort(
    (a, b) => {
      const dateA =
        new Date(
          a.createdAt || 0
        ).getTime();

      const dateB =
        new Date(
          b.createdAt || 0
        ).getTime();

      if (
        sort ===
        "oldest"
      ) {
        return (
          dateA -
          dateB
        );
      }

      if (
        sort ===
        "name"
      ) {
        return String(
          a.name || ""
        ).localeCompare(
          String(
            b.name || ""
          ),
          "hi"
        );
      }

      return (
        dateB -
        dateA
      );
    }
  );

  return list;
}


// ========================================
// RENDER CONTACTS
// ========================================

function renderContacts() {
  const container =
    document.getElementById(
      "contacts-table-body"
    );

  if (!container) {
    return;
  }

  container.innerHTML = "";

  const state =
    adminState.contacts;

  const items =
    state.filteredItems ||
    [];

  const start =
    (
      state.page -
      1
    ) *
    state.pageSize;

  const end =
    start +
    state.pageSize;

  const pageItems =
    items.slice(
      start,
      end
    );

  if (
    pageItems.length ===
    0
  ) {
    container.innerHTML = `
      <tr>
        <td
          colspan="100"
          class="admin-table-empty"
        >
          कोई contact message नहीं मिला।
        </td>
      </tr>
    `;

    updateContactPagination();

    return;
  }

  pageItems.forEach(
    (item) => {
      const row =
        createContactRow(
          item
        );

      container.appendChild(
        row
      );
    }
  );

  updateContactPagination();
}


// ========================================
// CREATE CONTACT ROW
// ========================================

function createContactRow(
  item
) {
  const row =
    document.createElement(
      "tr"
    );

  const name =
    item.name ||
    "अज्ञात";

  const email =
    item.email ||
    "-";

  const subject =
    item.subject ||
    "कोई विषय नहीं";

  const status =
    getContactStatusLabel(
      item.status
    );

  const date =
    formatDateTime(
      item.createdAt
    );

  row.dataset.contactId =
    item.id;

  row.innerHTML = `
    <td>
      <div class="contact-user-name">
        ${escapeHTML(
          name
        )}
      </div>

      <div class="contact-user-email">
        ${escapeHTML(
          email
        )}
      </div>
    </td>

    <td>
      ${escapeHTML(
        truncateText(
          subject,
          70
        )
      )}
    </td>

    <td>
      <span
        class="contact-status contact-status-${escapeHTML(
          item.status
        )}"
      >
        ${escapeHTML(
          status
        )}
      </span>
    </td>

    <td>
      ${escapeHTML(
        date
      )}
    </td>

    <td>
      <button
        type="button"
        class="admin-btn admin-btn-small"
        data-contact-action="view"
      >
        देखें
      </button>
    </td>
  `;

  const viewButton =
    row.querySelector(
      "[data-contact-action='view']"
    );

  if (viewButton) {
    viewButton.addEventListener(
      "click",
      () => {
        openContactDetails(
          item
        );
      }
    );
  }

  return row;
}


// ========================================
// CONTACT STATUS LABEL
// ========================================

function getContactStatusLabel(
  status
) {
  const labels = {
    new:
      "नया",

    unread:
      "नया",

    read:
      "पढ़ा गया",

    resolved:
      "समाधान हुआ",

    pending:
      "लंबित",

    closed:
      "बंद"
  };

  const key =
    String(
      status ||
        "new"
    ).toLowerCase();

  return (
    labels[key] ||
    "अन्य"
  );
}


// ========================================
// UPDATE CONTACT STATS
// ========================================

function updateContactStats() {
  const items =
    adminState.contacts
      ?.items ||
    [];

  const total =
    items.length;

  const newCount =
    items.filter(
      (item) =>
        item.status ===
          "new" ||
        item.status ===
          "unread"
    ).length;

  const readCount =
    items.filter(
      (item) =>
        item.status ===
        "read"
    ).length;

  const resolvedCount =
    items.filter(
      (item) =>
        item.status ===
        "resolved"
    ).length;

  updateElementText(
    "contacts-total-count",
    formatNumber(
      total
    )
  );

  updateElementText(
    "contacts-new-count",
    formatNumber(
      newCount
    )
  );

  updateElementText(
    "contacts-read-count",
    formatNumber(
      readCount
    )
  );

  updateElementText(
    "contacts-resolved-count",
    formatNumber(
      resolvedCount
    )
  );

  const badge =
    document.getElementById(
      "contact-count-badge"
    );

  if (badge) {
    badge.textContent =
      formatNumber(
        newCount
      );

    badge.classList.toggle(
      "hidden",
      newCount === 0
    );
  }
}


// ========================================
// UPDATE CONTACT RESULT COUNT
// ========================================

function updateContactResultCount() {
  const element =
    document.getElementById(
      "contacts-result-count"
    );

  if (!element) {
    return;
  }

  element.textContent =
    formatNumber(
      adminState.contacts
        ?.filteredItems
        ?.length || 0
    );
}


// ========================================
// CONTACT PAGINATION
// ========================================

function updateContactPagination() {
  const state =
    adminState.contacts;

  const items =
    state.filteredItems ||
    [];

  const total =
    items.length;

  const from =
    total === 0
      ? 0
      : (
          (
            state.page -
            1
          ) *
          state.pageSize
        ) + 1;

  const to =
    Math.min(
      state.page *
        state.pageSize,
      total
    );

  updateElementText(
    "contacts-pagination-from",
    formatNumber(
      from
    )
  );

  updateElementText(
    "contacts-pagination-to",
    formatNumber(
      to
    )
  );

  updateElementText(
    "contacts-pagination-total",
    formatNumber(
      total
    )
  );

  const prev =
    document.getElementById(
      "contacts-prev-page"
    );

  const next =
    document.getElementById(
      "contacts-next-page"
    );

  const maxPage =
    Math.max(
      1,
      Math.ceil(
        total /
          state.pageSize
      )
    );

  if (prev) {
    prev.disabled =
      state.page <= 1;
  }

  if (next) {
    next.disabled =
      state.page >=
      maxPage;
  }

  const current =
    document.getElementById(
      "contacts-current-page"
    );

  if (current) {
    current.textContent =
      formatNumber(
        state.page
      );
  }
}


// ========================================
// CONTACT SEARCH
// ========================================

function initializeContactSearch() {
  const input =
    document.getElementById(
      "contacts-search"
    );

  if (!input) {
    return;
  }

  const handler =
    debounceAdminFunction(
      (value) => {
        adminState.contacts
          .search =
          String(
            value || ""
          );

        adminState.contacts
          .page = 1;

        applyContactFilters();

        renderContacts();
      },
      300
    );

  input.addEventListener(
    "input",
    (event) => {
      handler(
        event.target.value
      );
    }
  );
}


// ========================================
// CONTACT STATUS FILTER
// ========================================

function initializeContactStatusFilter() {
  const select =
    document.getElementById(
      "contacts-status-filter"
    );

  if (!select) {
    return;
  }

  select.addEventListener(
    "change",
    (event) => {
      adminState.contacts
        .status =
        event.target.value ||
        "all";

      adminState.contacts
        .page = 1;

      applyContactFilters();

      renderContacts();
    }
  );
}


// ========================================
// CONTACT SORT
// ========================================

function initializeContactSort() {
  const select =
    document.getElementById(
      "contacts-sort"
    );

  if (!select) {
    return;
  }

  select.addEventListener(
    "change",
    (event) => {
      adminState.contacts
        .sort =
        event.target.value ||
        "newest";

      adminState.contacts
        .page = 1;

      applyContactFilters();

      renderContacts();
    }
  );
}


// ========================================
// CONTACT PAGE NAVIGATION
// ========================================

function goToContactPage(
  page
) {
  const state =
    adminState.contacts;

  const total =
    state.filteredItems
      ?.length || 0;

  const maxPage =
    Math.max(
      1,
      Math.ceil(
        total /
          state.pageSize
      )
    );

  const target =
    Math.min(
      Math.max(
        Number(
          page
        ) || 1,
        1
      ),
      maxPage
    );

  state.page =
    target;

  renderContacts();
}


function goToPreviousContactPage() {
  goToContactPage(
    adminState.contacts
      .page - 1
  );
}


function goToNextContactPage() {
  goToContactPage(
    adminState.contacts
      .page + 1
  );
}


// ========================================
// OPEN CONTACT DETAILS
// ========================================

function openContactDetails(
  contact
) {
  if (!contact) {
    return;
  }

  const body = `
    <div class="contact-details">

      <div class="contact-detail-row">
        <strong>नाम</strong>
        <span>
          ${escapeHTML(
            contact.name ||
              "-"
          )}
        </span>
      </div>

      <div class="contact-detail-row">
        <strong>Email</strong>
        <span>
          ${escapeHTML(
            contact.email ||
              "-"
          )}
        </span>
      </div>

      <div class="contact-detail-row">
        <strong>फोन</strong>
        <span>
          ${escapeHTML(
            contact.phone ||
              "-"
          )}
        </span>
      </div>

      <div class="contact-detail-row">
        <strong>विषय</strong>
        <span>
          ${escapeHTML(
            contact.subject ||
              "-"
          )}
        </span>
      </div>

      <div class="contact-detail-row">
        <strong>स्थिति</strong>
        <span>
          ${escapeHTML(
            getContactStatusLabel(
              contact.status
            )
          )}
        </span>
      </div>

      <div class="contact-detail-message">
        <strong>संदेश</strong>

        <p>
          ${escapeHTML(
            contact.message ||
              "कोई संदेश उपलब्ध नहीं है।"
          )}
        </p>
      </div>

      <div class="contact-detail-date">
        ${escapeHTML(
          formatDateTime(
            contact.createdAt
          )
        )}
      </div>

    </div>
  `;

  openAdminModal({
    icon: "✉️",
    eyebrow:
      "Contact Message",
    title:
      contact.subject ||
      "संपर्क संदेश",
    body,
    confirmText:
      "बंद करें",
    showCancel:
      false
  });
}


// ========================================
// CONTACT REFRESH
// ========================================

function initializeContactRefresh() {
  const button =
    document.getElementById(
      "contacts-refresh-button"
    );

  if (!button) {
    return;
  }

  button.addEventListener(
    "click",
    async () => {
      setButtonLoading(
        button,
        true
      );

      try {
        await loadContacts(
          true
        );

        showAdminToast(
          "success",
          "Contacts अपडेट",
          "संपर्क संदेशों की सूची अपडेट हो गई।"
        );
      } finally {
        setButtonLoading(
          button,
          false
        );
      }
    }
  );
}


// ========================================
// INITIALIZE CONTACT SECTION
// ========================================

function initializeContactsSection() {
  initializeContactSearch();

  initializeContactStatusFilter();

  initializeContactSort();

  initializeContactRefresh();

  const previous =
    document.getElementById(
      "contacts-prev-page"
    );

  if (previous) {
    previous.addEventListener(
      "click",
      goToPreviousContactPage
    );
  }

  const next =
    document.getElementById(
      "contacts-next-page"
    );

  if (next) {
    next.addEventListener(
      "click",
      goToNextContactPage
    );
  }
}


// ========================================
// GET CONTACTS
// ========================================

function getContactItems() {
  return [
    ...(adminState.contacts
      ?.filteredItems ||
      [])
  ];
}
// ========================================
// ADMIN.JS
// PART 22 / 25
// USERS MANAGEMENT
// ========================================


// ========================================
// USERS STATE
// ========================================

if (!adminState.users) {
  adminState.users = {
    items: [],
    filteredItems: [],
    loading: false,
    loaded: false,
    search: "",
    role: "all",
    status: "all",
    page: 1,
    pageSize: 10,
    total: 0
  };
}


// ========================================
// LOAD USERS
// ========================================

async function loadUsers(
  forceRefresh = false
) {
  if (
    !adminState.isAuthenticated
  ) {
    return [];
  }

  const state =
    adminState.users;

  if (
    state.loading &&
    !forceRefresh
  ) {
    return state.items;
  }

  state.loading = true;

  try {
    /*
     * वर्तमान backend में अलग admin-user
     * management endpoint उपलब्ध नहीं है।
     *
     * इसलिए यहां normal public/user data
     * endpoint को बिना पुष्टि के इस्तेमाल
     * नहीं किया जा रहा है।
     *
     * जब backend में सुरक्षित owner-only
     * user-management routes जोड़े जाएंगे,
     * तब इस function में वही endpoint जोड़ा
     * जा सकता है।
     */

    state.items = [];

    state.filteredItems = [];

    state.total = 0;

    state.loaded = true;

    applyUserFilters();

    renderUsers();

    updateUserStats();

    showAdminToast(
      "info",
      "Users Management",
      "वर्तमान backend में users management के लिए सुरक्षित admin endpoint उपलब्ध नहीं है।"
    );

    return [];
  } catch (error) {
    console.error(
      "Users loading error:",
      error
    );

    showAdminToast(
      "error",
      "Users लोड नहीं हुए",
      error?.message ||
        "Users data प्राप्त करने में समस्या हुई।"
    );

    return [];
  } finally {
    state.loading = false;
  }
}


// ========================================
// NORMALIZE USER
// ========================================

function normalizeUser(
  item
) {
  if (!item) {
    return {
      id: "",
      name: "",
      email: "",
      phone: "",
      role: "user",
      status: "inactive",
      createdAt: null,
      updatedAt: null,
      lastLogin: null
    };
  }

  return {
    ...item,

    id:
      getObjectId(
        item
      ),

    name:
      item.name ||
      item.fullName ||
      item.username ||
      "अज्ञात",

    email:
      item.email ||
      "",

    phone:
      item.phone ||
      item.mobile ||
      "",

    role:
      String(
        item.role ||
        "user"
      ).toLowerCase(),

    status:
      String(
        item.status ||
        (
          item.isActive === false
            ? "inactive"
            : "active"
        )
      ).toLowerCase(),

    createdAt:
      item.createdAt ||
      null,

    updatedAt:
      item.updatedAt ||
      null,

    lastLogin:
      item.lastLogin ||
      item.lastLoginAt ||
      null
  };
}


// ========================================
// APPLY USER FILTERS
// ========================================

function applyUserFilters() {
  const state =
    adminState.users;

  let items =
    [
      ...(state.items || [])
    ];

  const search =
    String(
      state.search || ""
    )
      .trim()
      .toLowerCase();

  const role =
    state.role ||
    "all";

  const status =
    state.status ||
    "all";

  if (search) {
    items =
      items.filter(
        (item) => {
          const name =
            String(
              item.name || ""
            ).toLowerCase();

          const email =
            String(
              item.email || ""
            ).toLowerCase();

          const phone =
            String(
              item.phone || ""
            ).toLowerCase();

          const userRole =
            String(
              item.role || ""
            ).toLowerCase();

          return (
            name.includes(
              search
            ) ||
            email.includes(
              search
            ) ||
            phone.includes(
              search
            ) ||
            userRole.includes(
              search
            )
          );
        }
      );
  }

  if (
    role !== "all"
  ) {
    items =
      items.filter(
        (item) =>
          item.role ===
          role
      );
  }

  if (
    status !== "all"
  ) {
    items =
      items.filter(
        (item) =>
          item.status ===
          status
      );
  }

  state.filteredItems =
    items;

  state.total =
    items.length;

  const maxPage =
    Math.max(
      1,
      Math.ceil(
        items.length /
          state.pageSize
      )
    );

  if (
    state.page >
    maxPage
  ) {
    state.page =
      maxPage;
  }

  updateUserResultCount();

  updateUserPagination();
}


// ========================================
// RENDER USERS
// ========================================

function renderUsers() {
  const container =
    document.getElementById(
      "users-table-body"
    );

  if (!container) {
    return;
  }

  container.innerHTML = "";

  const state =
    adminState.users;

  const items =
    state.filteredItems ||
    [];

  const start =
    (
      state.page -
      1
    ) *
    state.pageSize;

  const end =
    start +
    state.pageSize;

  const pageItems =
    items.slice(
      start,
      end
    );

  if (
    pageItems.length ===
    0
  ) {
    container.innerHTML = `
      <tr>
        <td
          colspan="100"
          class="admin-table-empty"
        >
          Users का कोई रिकॉर्ड उपलब्ध नहीं है।
        </td>
      </tr>
    `;

    updateUserPagination();

    return;
  }

  pageItems.forEach(
    (item) => {
      container.appendChild(
        createUserRow(
          item
        )
      );
    }
  );

  updateUserPagination();
}


// ========================================
// CREATE USER ROW
// ========================================

function createUserRow(
  user
) {
  const row =
    document.createElement(
      "tr"
    );

  row.dataset.userId =
    user.id;

  const roleLabel =
    getUserRoleLabel(
      user.role
    );

  const statusLabel =
    getUserStatusLabel(
      user.status
    );

  row.innerHTML = `
    <td>
      <div class="admin-user-table-name">
        ${escapeHTML(
          user.name ||
            "अज्ञात"
        )}
      </div>

      <div class="admin-user-table-email">
        ${escapeHTML(
          user.email ||
            "-"
        )}
      </div>
    </td>

    <td>
      ${escapeHTML(
        roleLabel
      )}
    </td>

    <td>
      <span
        class="user-status user-status-${escapeHTML(
          user.status
        )}"
      >
        ${escapeHTML(
          statusLabel
        )}
      </span>
    </td>

    <td>
      ${escapeHTML(
        formatDateTime(
          user.createdAt
        )
      )}
    </td>

    <td>
      <button
        type="button"
        class="admin-btn admin-btn-small"
        data-user-action="view"
      >
        देखें
      </button>
    </td>
  `;

  const viewButton =
    row.querySelector(
      "[data-user-action='view']"
    );

  if (viewButton) {
    viewButton.addEventListener(
      "click",
      () => {
        openUserDetails(
          user
        );
      }
    );
  }

  return row;
}


// ========================================
// USER ROLE LABEL
// ========================================

function getUserRoleLabel(
  role
) {
  const labels = {
    user:
      "यूज़र",

    admin:
      "एडमिन",

    editor:
      "एडिटर",

    reporter:
      "रिपोर्टर",

    journalist:
      "पत्रकार",

    owner:
      "Owner"
  };

  return (
    labels[
      String(
        role ||
          "user"
      ).toLowerCase()
    ] ||
    String(
      role ||
        "यूज़र"
    )
  );
}


// ========================================
// USER STATUS LABEL
// ========================================

function getUserStatusLabel(
  status
) {
  const labels = {
    active:
      "सक्रिय",

    inactive:
      "निष्क्रिय",

    blocked:
      "ब्लॉक",

    suspended:
      "निलंबित",

    pending:
      "लंबित"
  };

  return (
    labels[
      String(
        status ||
          "inactive"
      ).toLowerCase()
    ] ||
    "अन्य"
  );
}


// ========================================
// UPDATE USER STATS
// ========================================

function updateUserStats() {
  const items =
    adminState.users
      ?.items ||
    [];

  const total =
    items.length;

  const active =
    items.filter(
      (item) =>
        item.status ===
        "active"
    ).length;

  const reporters =
    items.filter(
      (item) =>
        item.role ===
        "reporter"
    ).length;

  const currentMonth =
    new Date();

  const newThisMonth =
    items.filter(
      (item) => {
        if (
          !item.createdAt
        ) {
          return false;
        }

        const date =
          new Date(
            item.createdAt
          );

        return (
          date.getFullYear() ===
            currentMonth.getFullYear() &&
          date.getMonth() ===
            currentMonth.getMonth()
        );
      }
    ).length;

  updateElementText(
    "users-total-count",
    formatNumber(
      total
    )
  );

  updateElementText(
    "users-active-count",
    formatNumber(
      active
    )
  );

  updateElementText(
    "users-reporter-count",
    formatNumber(
      reporters
    )
  );

  updateElementText(
    "users-new-month-count",
    formatNumber(
      newThisMonth
    )
  );
}


// ========================================
// USER RESULT COUNT
// ========================================

function updateUserResultCount() {
  const element =
    document.getElementById(
      "users-result-count"
    );

  if (!element) {
    return;
  }

  element.textContent =
    formatNumber(
      adminState.users
        ?.filteredItems
        ?.length || 0
    );
}


// ========================================
// USER PAGINATION
// ========================================

function updateUserPagination() {
  const state =
    adminState.users;

  const items =
    state.filteredItems ||
    [];

  const total =
    items.length;

  const from =
    total === 0
      ? 0
      : (
          (
            state.page -
            1
          ) *
          state.pageSize
        ) + 1;

  const to =
    Math.min(
      state.page *
        state.pageSize,
      total
    );

  updateElementText(
    "users-pagination-from",
    formatNumber(
      from
    )
  );

  updateElementText(
    "users-pagination-to",
    formatNumber(
      to
    )
  );

  updateElementText(
    "users-pagination-total",
    formatNumber(
      total
    )
  );

  const maxPage =
    Math.max(
      1,
      Math.ceil(
        total /
          state.pageSize
      )
    );

  const previous =
    document.getElementById(
      "users-prev-page"
    );

  const next =
    document.getElementById(
      "users-next-page"
    );

  const current =
    document.getElementById(
      "users-current-page"
    );

  if (previous) {
    previous.disabled =
      state.page <= 1;
  }

  if (next) {
    next.disabled =
      state.page >=
      maxPage;
  }

  if (current) {
    current.textContent =
      formatNumber(
        state.page
      );
  }
}


// ========================================
// USER SEARCH
// ========================================

function initializeUserSearch() {
  const input =
    document.getElementById(
      "users-search"
    );

  if (!input) {
    return;
  }

  const handler =
    debounceAdminFunction(
      (value) => {
        adminState.users
          .search =
          String(
            value || ""
          );

        adminState.users
          .page = 1;

        applyUserFilters();

        renderUsers();
      },
      300
    );

  input.addEventListener(
    "input",
    (event) => {
      handler(
        event.target.value
      );
    }
  );
}


// ========================================
// USER ROLE FILTER
// ========================================

function initializeUserRoleFilter() {
  const select =
    document.getElementById(
      "users-role-filter"
    );

  if (!select) {
    return;
  }

  select.addEventListener(
    "change",
    (event) => {
      adminState.users
        .role =
        event.target.value ||
        "all";

      adminState.users
        .page = 1;

      applyUserFilters();

      renderUsers();
    }
  );
}


// ========================================
// USER STATUS FILTER
// ========================================

function initializeUserStatusFilter() {
  const select =
    document.getElementById(
      "users-status-filter"
    );

  if (!select) {
    return;
  }

  select.addEventListener(
    "change",
    (event) => {
      adminState.users
        .status =
        event.target.value ||
        "all";

      adminState.users
        .page = 1;

      applyUserFilters();

      renderUsers();
    }
  );
}


// ========================================
// USER PAGE NAVIGATION
// ========================================

function goToUserPage(
  page
) {
  const state =
    adminState.users;

  const total =
    state.filteredItems
      ?.length || 0;

  const maxPage =
    Math.max(
      1,
      Math.ceil(
        total /
          state.pageSize
      )
    );

  state.page =
    Math.min(
      Math.max(
        Number(
          page
        ) || 1,
        1
      ),
      maxPage
    );

  renderUsers();
}


function goToPreviousUserPage() {
  goToUserPage(
    adminState.users
      .page - 1
  );
}


function goToNextUserPage() {
  goToUserPage(
    adminState.users
      .page + 1
  );
}


// ========================================
// OPEN USER DETAILS
// ========================================

function openUserDetails(
  user
) {
  if (!user) {
    return;
  }

  const body = `
    <div class="user-details">

      <div class="contact-detail-row">
        <strong>नाम</strong>
        <span>
          ${escapeHTML(
            user.name ||
              "-"
          )}
        </span>
      </div>

      <div class="contact-detail-row">
        <strong>Email</strong>
        <span>
          ${escapeHTML(
            user.email ||
              "-"
          )}
        </span>
      </div>

      <div class="contact-detail-row">
        <strong>फोन</strong>
        <span>
          ${escapeHTML(
            user.phone ||
              "-"
          )}
        </span>
      </div>

      <div class="contact-detail-row">
        <strong>भूमिका</strong>
        <span>
          ${escapeHTML(
            getUserRoleLabel(
              user.role
            )
          )}
        </span>
      </div>

      <div class="contact-detail-row">
        <strong>स्थिति</strong>
        <span>
          ${escapeHTML(
            getUserStatusLabel(
              user.status
            )
          )}
        </span>
      </div>

      <div class="contact-detail-row">
        <strong>पंजीकरण</strong>
        <span>
          ${escapeHTML(
            formatDateTime(
              user.createdAt
            )
          )}
        </span>
      </div>

      <div class="contact-detail-row">
        <strong>अंतिम Login</strong>
        <span>
          ${escapeHTML(
            formatDateTime(
              user.lastLogin
            )
          )}
        </span>
      </div>

    </div>
  `;

  openAdminModal({
    icon: "👤",
    eyebrow:
      "User Details",
    title:
      user.name ||
      "यूज़र विवरण",
    body,
    confirmText:
      "बंद करें",
    showCancel:
      false
  });
}


// ========================================
// USER REFRESH
// ========================================

function initializeUserRefresh() {
  const button =
    document.getElementById(
      "users-refresh-button"
    );

  if (!button) {
    return;
  }

  button.addEventListener(
    "click",
    async () => {
      setButtonLoading(
        button,
        true
      );

      try {
        await loadUsers(
          true
        );
      } finally {
        setButtonLoading(
          button,
          false
        );
      }
    }
  );
}


// ========================================
// INITIALIZE USERS SECTION
// ========================================

function initializeUsersSection() {
  initializeUserSearch();

  initializeUserRoleFilter();

  initializeUserStatusFilter();

  initializeUserRefresh();

  const previous =
    document.getElementById(
      "users-prev-page"
    );

  if (previous) {
    previous.addEventListener(
      "click",
      goToPreviousUserPage
    );
  }

  const next =
    document.getElementById(
      "users-next-page"
    );

  if (next) {
    next.addEventListener(
      "click",
      goToNextUserPage
    );
  }
}


// ========================================
// GET USER ITEMS
// ========================================

function getUserItems() {
  return [
    ...(adminState.users
      ?.filteredItems ||
      [])
  ];
         }
// ========================================
// ADMIN.JS
// PART 23 / 25
// ADMIN MANAGEMENT
// ========================================


// ========================================
// ADMINS STATE
// ========================================

if (!adminState.admins) {
  adminState.admins = {
    items: [],
    filteredItems: [],
    permissions: [],
    loading: false,
    saving: false,
    loaded: false,
    search: "",
    role: "all",
    status: "all",
    page: 1,
    pageSize: 10,
    total: 0
  };
}


// ========================================
// OWNER CHECK
// ========================================

function isCurrentAdminOwner() {
  const admin =
    adminState.admin ||
    {};

  return (
    String(
      admin.role || ""
    ).toLowerCase() ===
    "owner"
  );
}


// ========================================
// LOAD ADMIN LIST
// ========================================

async function loadAdmins(
  forceRefresh = false
) {
  if (
    !adminState.isAuthenticated
  ) {
    return [];
  }

  if (
    !isCurrentAdminOwner()
  ) {
    showAdminToast(
      "warning",
      "Access Denied",
      "Admin management केवल Owner के लिए उपलब्ध है।"
    );

    return [];
  }

  const state =
    adminState.admins;

  if (
    state.loading &&
    !forceRefresh
  ) {
    return state.items;
  }

  state.loading = true;

  try {
    const response =
      await adminAPIRequest(
        "/api/admin/admins"
      );

    const data =
      normalizeAPIResponse(
        response
      );

    const admins =
      extractArrayData(
        data,
        [
          "admins",
          "items",
          "results",
          "data"
        ]
      );

    state.items =
      admins.map(
        normalizeAdminRecord
      );

    state.total =
      state.items.length;

    state.loaded =
      true;

    applyAdminFilters();

    renderAdmins();

    updateAdminStats();

    return state.items;
  } catch (error) {
    console.error(
      "Admin list loading error:",
      error
    );

    showAdminToast(
      "error",
      "Admins लोड नहीं हुए",
      error?.message ||
        "Admin सूची प्राप्त करने में समस्या हुई।"
    );

    return [];
  } finally {
    state.loading = false;
  }
}


// ========================================
// NORMALIZE ADMIN
// ========================================

function normalizeAdminRecord(
  item
) {
  if (!item) {
    return {
      id: "",
      adminId: "",
      name: "",
      email: "",
      role: "admin",
      permissions: [],
      isActive: true,
      status: "active",
      createdAt: null,
      updatedAt: null,
      lastLogin: null
    };
  }

  const active =
    item.isActive !== false &&
    item.status !==
      "inactive";

  return {
    ...item,

    id:
      getObjectId(
        item
      ),

    adminId:
      item.adminId ||
      item.username ||
      "",

    name:
      item.name ||
      item.fullName ||
      item.displayName ||
      item.adminId ||
      "Admin",

    email:
      item.email ||
      "",

    role:
      String(
        item.role ||
        "admin"
      ).toLowerCase(),

    permissions:
      Array.isArray(
        item.permissions
      )
        ? item.permissions
        : [],

    isActive:
      active,

    status:
      active
        ? "active"
        : "inactive",

    createdAt:
      item.createdAt ||
      null,

    updatedAt:
      item.updatedAt ||
      null,

    lastLogin:
      item.lastLogin ||
      item.lastLoginAt ||
      null
  };
}


// ========================================
// LOAD AVAILABLE PERMISSIONS
// ========================================

async function loadAdminPermissions(
  forceRefresh = false
) {
  if (
    !adminState.isAuthenticated ||
    !isCurrentAdminOwner()
  ) {
    return [];
  }

  const state =
    adminState.admins;

  if (
    state.permissions.length &&
    !forceRefresh
  ) {
    return state.permissions;
  }

  try {
    const response =
      await adminAPIRequest(
        "/api/admin/permissions"
      );

    const data =
      normalizeAPIResponse(
        response
      );

    let permissions =
      extractArrayData(
        data,
        [
          "permissions",
          "items",
          "data"
        ]
      );

    if (
      permissions.length ===
      0
    ) {
      if (
        Array.isArray(
          data
        )
      ) {
        permissions =
          data;
      } else if (
        Array.isArray(
          data?.permissions
        )
      ) {
        permissions =
          data.permissions;
      }
    }

    state.permissions =
      permissions;

    return permissions;
  } catch (error) {
    console.error(
      "Permissions loading error:",
      error
    );

    state.permissions =
      [];

    showAdminToast(
      "warning",
      "Permissions",
      "Permissions list प्राप्त नहीं हो सकी।"
    );

    return [];
  }
}


// ========================================
// APPLY ADMIN FILTERS
// ========================================

function applyAdminFilters() {
  const state =
    adminState.admins;

  let items =
    [
      ...(state.items || [])
    ];

  const search =
    String(
      state.search || ""
    )
      .trim()
      .toLowerCase();

  const role =
    state.role ||
    "all";

  const status =
    state.status ||
    "all";

  if (search) {
    items =
      items.filter(
        (item) => {
          const name =
            String(
              item.name || ""
            ).toLowerCase();

          const adminId =
            String(
              item.adminId || ""
            ).toLowerCase();

          const email =
            String(
              item.email || ""
            ).toLowerCase();

          const itemRole =
            String(
              item.role || ""
            ).toLowerCase();

          return (
            name.includes(
              search
            ) ||
            adminId.includes(
              search
            ) ||
            email.includes(
              search
            ) ||
            itemRole.includes(
              search
            )
          );
        }
      );
  }

  if (
    role !== "all"
  ) {
    items =
      items.filter(
        (item) =>
          item.role ===
          role
      );
  }

  if (
    status !== "all"
  ) {
    items =
      items.filter(
        (item) =>
          item.status ===
          status
      );
  }

  state.filteredItems =
    items;

  state.total =
    items.length;

  const maxPage =
    Math.max(
      1,
      Math.ceil(
        items.length /
          state.pageSize
      )
    );

  if (
    state.page >
    maxPage
  ) {
    state.page =
      maxPage;
  }

  updateAdminResultCount();

  updateAdminPagination();
}


// ========================================
// ADMIN STATS
// ========================================

function updateAdminStats() {
  const items =
    adminState.admins
      ?.items ||
    [];

  const owners =
    items.filter(
      (item) =>
        item.role ===
        "owner"
    ).length;

  const admins =
    items.filter(
      (item) =>
        item.role ===
        "admin"
    ).length;

  const active =
    items.filter(
      (item) =>
        item.isActive
    ).length;

  const inactive =
    items.filter(
      (item) =>
        !item.isActive
    ).length;

  updateElementText(
    "admins-owner-count",
    formatNumber(
      owners
    )
  );

  updateElementText(
    "admins-admin-count",
    formatNumber(
      admins
    )
  );

  updateElementText(
    "admins-active-count",
    formatNumber(
      active
    )
  );

  updateElementText(
    "admins-inactive-count",
    formatNumber(
      inactive
    )
  );
}


// ========================================
// RENDER ADMINS
// ========================================

function renderAdmins() {
  const container =
    document.getElementById(
      "admins-table-body"
    );

  if (!container) {
    return;
  }

  container.innerHTML = "";

  const state =
    adminState.admins;

  const items =
    state.filteredItems ||
    [];

  const start =
    (
      state.page -
      1
    ) *
    state.pageSize;

  const end =
    start +
    state.pageSize;

  const pageItems =
    items.slice(
      start,
      end
    );

  if (
    pageItems.length ===
    0
  ) {
    container.innerHTML = `
      <tr>
        <td
          colspan="100"
          class="admin-table-empty"
        >
          कोई Admin रिकॉर्ड नहीं मिला।
        </td>
      </tr>
    `;

    updateAdminPagination();

    return;
  }

  pageItems.forEach(
    (admin) => {
      container.appendChild(
        createAdminRow(
          admin
        )
      );
    }
  );

  updateAdminPagination();
}


// ========================================
// CREATE ADMIN ROW
// ========================================

function createAdminRow(
  admin
) {
  const row =
    document.createElement(
      "tr"
    );

  row.dataset.adminId =
    admin.id;

  const roleLabel =
    getAdminRoleLabel(
      admin.role
    );

  const statusLabel =
    admin.isActive
      ? "सक्रिय"
      : "निष्क्रिय";

  const isSelf =
    admin.id ===
    (
      adminState.admin
        ?.id ||
      ""
    );

  row.innerHTML = `
    <td>
      <div class="admin-user-table-name">
        ${escapeHTML(
          admin.name ||
            "Admin"
        )}
      </div>

      <div class="admin-user-table-email">
        ${escapeHTML(
          admin.adminId ||
            admin.email ||
            "-"
        )}
      </div>
    </td>

    <td>
      ${escapeHTML(
        roleLabel
      )}
    </td>

    <td>
      <span
        class="admin-status ${
          admin.isActive
            ? "admin-status-active"
            : "admin-status-inactive"
        }"
      >
        ${escapeHTML(
          statusLabel
        )}
      </span>
    </td>

    <td>
      ${escapeHTML(
        formatDateTime(
          admin.lastLogin
        )
      )}
    </td>

    <td>
      <div
        class="admin-action-group"
      >

        <button
          type="button"
          class="admin-btn admin-btn-small"
          data-admin-action="edit"
          data-admin-id="${escapeHTML(
            admin.id
          )}"
        >
          संपादित
        </button>

        <button
          type="button"
          class="admin-btn admin-btn-small"
          data-admin-action="toggle"
          data-admin-id="${escapeHTML(
            admin.id
          )}"
          ${
            admin.role ===
            "owner"
              ? "disabled"
              : ""
          }
        >
          ${
            admin.isActive
              ? "निष्क्रिय करें"
              : "सक्रिय करें"
          }
        </button>

        <button
          type="button"
          class="admin-btn admin-btn-small"
          data-admin-action="password"
          data-admin-id="${escapeHTML(
            admin.id
          )}"
        >
          Password
        </button>

        <button
          type="button"
          class="admin-btn admin-btn-small admin-btn-danger"
          data-admin-action="delete"
          data-admin-id="${escapeHTML(
            admin.id
          )}"
          ${
            admin.role ===
              "owner" ||
            isSelf
              ? "disabled"
              : ""
          }
        >
          Delete
        </button>

      </div>
    </td>
  `;

  const buttons =
    row.querySelectorAll(
      "[data-admin-action]"
    );

  buttons.forEach(
    (button) => {
      button.addEventListener(
        "click",
        () => {
          const action =
            button.dataset
              .adminAction;

          const id =
            button.dataset
              .adminId;

          handleAdminAction(
            action,
            id
          );
        }
      );
    }
  );

  return row;
}


// ========================================
// ADMIN ROLE LABEL
// ========================================

function getAdminRoleLabel(
  role
) {
  const labels = {
    owner:
      "Owner",

    admin:
      "Admin",

    editor:
      "Editor",

    reporter:
      "Reporter"
  };

  return (
    labels[
      String(
        role ||
          "admin"
      ).toLowerCase()
    ] ||
    String(
      role ||
        "Admin"
    )
  );
}


// ========================================
// ADMIN RESULT COUNT
// ========================================

function updateAdminResultCount() {
  updateElementText(
    "admins-result-count",
    formatNumber(
      adminState.admins
        ?.filteredItems
        ?.length || 0
    )
  );
}


// ========================================
// ADMIN PAGINATION
// ========================================

function updateAdminPagination() {
  const state =
    adminState.admins;

  const total =
    state.filteredItems
      ?.length || 0;

  const from =
    total === 0
      ? 0
      : (
          (
            state.page -
            1
          ) *
          state.pageSize
        ) + 1;

  const to =
    Math.min(
      state.page *
        state.pageSize,
      total
    );

  updateElementText(
    "admins-pagination-from",
    formatNumber(
      from
    )
  );

  updateElementText(
    "admins-pagination-to",
    formatNumber(
      to
    )
  );

  updateElementText(
    "admins-pagination-total",
    formatNumber(
      total
    )
  );

  const maxPage =
    Math.max(
      1,
      Math.ceil(
        total /
          state.pageSize
      )
    );

  const previous =
    document.getElementById(
      "admins-prev-page"
    );

  const next =
    document.getElementById(
      "admins-next-page"
    );

  const current =
    document.getElementById(
      "admins-current-page"
    );

  if (previous) {
    previous.disabled =
      state.page <= 1;
  }

  if (next) {
    next.disabled =
      state.page >=
      maxPage;
  }

  if (current) {
    current.textContent =
      formatNumber(
        state.page
      );
  }
}


// ========================================
// ADMIN SEARCH
// ========================================

function initializeAdminSearch() {
  const input =
    document.getElementById(
      "admins-search"
    );

  if (!input) {
    return;
  }

  const handler =
    debounceAdminFunction(
      (value) => {
        adminState.admins
          .search =
          String(
            value || ""
          );

        adminState.admins
          .page = 1;

        applyAdminFilters();

        renderAdmins();
      },
      300
    );

  input.addEventListener(
    "input",
    (event) => {
      handler(
        event.target.value
      );
    }
  );
}


// ========================================
// ADMIN ROLE FILTER
// ========================================

function initializeAdminRoleFilter() {
  const select =
    document.getElementById(
      "admins-role-filter"
    );

  if (!select) {
    return;
  }

  select.addEventListener(
    "change",
    (event) => {
      adminState.admins
        .role =
        event.target.value ||
        "all";

      adminState.admins
        .page = 1;

      applyAdminFilters();

      renderAdmins();
    }
  );
}


// ========================================
// ADMIN STATUS FILTER
// ========================================

function initializeAdminStatusFilter() {
  const select =
    document.getElementById(
      "admins-status-filter"
    );

  if (!select) {
    return;
  }

  select.addEventListener(
    "change",
    (event) => {
      adminState.admins
        .status =
        event.target.value ||
        "all";

      adminState.admins
        .page = 1;

      applyAdminFilters();

      renderAdmins();
    }
  );
}


// ========================================
// ADMIN REFRESH
// ========================================

function initializeAdminRefresh() {
  const button =
    document.getElementById(
      "admins-refresh-button"
    );

  if (!button) {
    return;
  }

  button.addEventListener(
    "click",
    async () => {
      if (
        !isCurrentAdminOwner()
      ) {
        showAdminToast(
          "warning",
          "Access Denied",
          "केवल Owner Admin सूची देख सकता है।"
        );

        return;
      }

      setButtonLoading(
        button,
        true
      );

      try {
        await loadAdminPermissions(
          true
        );

        await loadAdmins(
          true
        );
      } finally {
        setButtonLoading(
          button,
          false
        );
      }
    }
  );
}


// ========================================
// ADMIN PAGE NAVIGATION
// ========================================

function goToAdminPage(
  page
) {
  const state =
    adminState.admins;

  const total =
    state.filteredItems
      ?.length || 0;

  const maxPage =
    Math.max(
      1,
      Math.ceil(
        total /
          state.pageSize
      )
    );

  state.page =
    Math.min(
      Math.max(
        Number(
          page
        ) || 1,
        1
      ),
      maxPage
    );

  renderAdmins();
}


function goToPreviousAdminPage() {
  goToAdminPage(
    adminState.admins
      .page - 1
  );
}


function goToNextAdminPage() {
  goToAdminPage(
    adminState.admins
      .page + 1
  );
}


// ========================================
// HANDLE ADMIN ACTION
// ========================================

async function handleAdminAction(
  action,
  adminId
) {
  if (
    !isCurrentAdminOwner()
  ) {
    showAdminToast(
      "warning",
      "Access Denied",
      "यह कार्य केवल Owner कर सकता है।"
    );

    return;
  }

  const admin =
    findAdminById(
      adminId
    );

  if (!admin) {
    showAdminToast(
      "error",
      "Admin नहीं मिला",
      "चयनित Admin रिकॉर्ड उपलब्ध नहीं है।"
    );

    return;
  }

  switch (action) {
    case "edit":
      openAdminEditor(
        admin
      );
      break;

    case "toggle":
      await toggleManagedAdmin(
        admin
      );
      break;

    case "password":
      openAdminPasswordReset(
        admin
      );
      break;

    case "delete":
      await deleteManagedAdmin(
        admin
      );
      break;

    default:
      break;
  }
}


// ========================================
// FIND ADMIN
// ========================================

function findAdminById(
  adminId
) {
  return (
    adminState.admins
      ?.items ||
    []
  ).find(
    (item) =>
      String(
        item.id
      ) ===
      String(
        adminId
      )
  );
}


// ========================================
// CREATE ADMIN BUTTON
// ========================================

function initializeCreateAdminButton() {
  const button =
    document.getElementById(
      "create-admin-button"
    );

  if (!button) {
    return;
  }

  button.addEventListener(
    "click",
    () => {
      if (
        !isCurrentAdminOwner()
      ) {
        showAdminToast(
          "warning",
          "Access Denied",
          "नया Admin केवल Owner बना सकता है।"
        );

        return;
      }

      openAdminEditor(
        null
      );
    }
  );
}


// ========================================
// OPEN ADMIN EDITOR
// ========================================

async function openAdminEditor(
  admin = null
) {
  if (
    !isCurrentAdminOwner()
  ) {
    return;
  }

  await loadAdminPermissions();

  const isEdit =
    Boolean(
      admin
    );

  const permissions =
    adminState.admins
      ?.permissions ||
    [];

  const currentPermissions =
    admin?.permissions ||
    [];

  const permissionHTML =
    permissions
      .map(
        (permission) => {
          const value =
            typeof permission ===
            "string"
              ? permission
              : permission.key ||
                permission.name ||
                permission.value ||
                "";

          const label =
            typeof permission ===
            "string"
              ? permission
              : permission.label ||
                permission.title ||
                value;

          const checked =
            currentPermissions
              .includes(
                value
              );

          return `
            <label
              class="admin-permission-option"
            >
              <input
                type="checkbox"
                name="permissions"
                value="${escapeHTML(
                  value
                )}"
                ${
                  checked
                    ? "checked"
                    : ""
                }
              >

              <span>
                ${escapeHTML(
                  label
                )}
              </span>
            </label>
          `;
        }
      )
      .join("");

  const body = `
    <form
      id="managed-admin-form"
      class="admin-form"
      novalidate
    >

      <input
        type="hidden"
        id="managed-admin-id"
        value="${escapeHTML(
          admin?.id ||
            ""
        )}"
      >

      <div
        class="admin-form-group"
      >
        <label
          for="managed-admin-id-input"
        >
          Admin ID
        </label>

        <input
          type="text"
          id="managed-admin-id-input"
          name="adminId"
          autocomplete="off"
          required
          value="${escapeHTML(
            admin?.adminId ||
              ""
          )}"
          ${
            isEdit
              ? "readonly"
              : ""
          }
        >
      </div>

      <div
        class="admin-form-group"
      >
        <label
          for="managed-admin-name"
        >
          नाम
        </label>

        <input
          type="text"
          id="managed-admin-name"
          name="name"
          required
          value="${escapeHTML(
            admin?.name ||
              ""
          )}"
        >
      </div>

      <div
        class="admin-form-group"
      >
        <label
          for="managed-admin-email"
        >
          Email
        </label>

        <input
          type="email"
          id="managed-admin-email"
          name="email"
          value="${escapeHTML(
            admin?.email ||
              ""
          )}"
        >
      </div>

      <div
        class="admin-form-group"
      >
        <label
          for="managed-admin-role"
        >
          भूमिका
        </label>

        <select
          id="managed-admin-role"
          name="role"
          ${
            admin?.role ===
            "owner"
              ? "disabled"
              : ""
          }
        >
          <option
            value="admin"
            ${
              admin?.role ===
              "admin"
                ? "selected"
                : ""
            }
          >
            Admin
          </option>

          <option
            value="editor"
            ${
              admin?.role ===
              "editor"
                ? "selected"
                : ""
            }
          >
            Editor
          </option>

          <option
            value="reporter"
            ${
              admin?.role ===
              "reporter"
                ? "selected"
                : ""
            }
          >
            Reporter
          </option>
        </select>
      </div>

      <div
        class="admin-form-group"
      >
        <label>
          Permissions
        </label>

        <div
          class="admin-permissions-list"
        >
          ${
            permissionHTML ||
            `
              <p>
                Permissions उपलब्ध नहीं हैं।
              </p>
            `
          }
        </div>
      </div>

      ${
        !isEdit
          ? `
            <div
              class="admin-form-group"
            >
              <label
                for="managed-admin-password"
              >
                Password
              </label>

              <input
                type="password"
                id="managed-admin-password"
                name="password"
                autocomplete="new-password"
                required
              >
            </div>

            <div
              class="admin-form-group"
            >
              <label
                for="managed-admin-confirm-password"
              >
                Password दोबारा दर्ज करें
              </label>

              <input
                type="password"
                id="managed-admin-confirm-password"
                name="confirmPassword"
                autocomplete="new-password"
                required
              >
            </div>
          `
          : ""
      }

      <div
        id="managed-admin-form-error"
        class="admin-form-error"
        hidden
      ></div>

    </form>
  `;

  openAdminModal({
    icon: isEdit
      ? "✏️"
      : "👤",
    eyebrow:
      isEdit
        ? "Admin Update"
        : "New Admin",
    title:
      isEdit
        ? "Admin संपादित करें"
        : "नया Admin बनाएं",
    body,
    confirmText:
      isEdit
        ? "Save Changes"
        : "Create Admin",
    cancelText:
      "रद्द करें",
    onConfirm:
      async () => {
        return submitManagedAdminForm(
          admin
        );
      }
  });
}


// ========================================
// SUBMIT ADMIN FORM
// ========================================

async function submitManagedAdminForm(
  existingAdmin = null
) {
  const form =
    document.getElementById(
      "managed-admin-form"
    );

  if (!form) {
    return false;
  }

  const errorBox =
    document.getElementById(
      "managed-admin-form-error"
    );

  const adminIdInput =
    document.getElementById(
      "managed-admin-id-input"
    );

  const nameInput =
    document.getElementById(
      "managed-admin-name"
    );

  const emailInput =
    document.getElementById(
      "managed-admin-email"
    );

  const roleInput =
    document.getElementById(
      "managed-admin-role"
    );

  const passwordInput =
    document.getElementById(
      "managed-admin-password"
    );

  const confirmPasswordInput =
    document.getElementById(
      "managed-admin-confirm-password"
    );

  const adminId =
    adminIdInput
      ?.value
      ?.trim() ||
    "";

  const name =
    nameInput
      ?.value
      ?.trim() ||
    "";

  const email =
    emailInput
      ?.value
      ?.trim() ||
    "";

  const role =
    roleInput
      ?.value ||
    "admin";

  if (!name) {
    showAdminFormError(
      errorBox,
      "नाम आवश्यक है।"
    );

    return false;
  }

  if (
    !existingAdmin &&
    !adminId
  ) {
    showAdminFormError(
      errorBox,
      "Admin ID आवश्यक है।"
    );

    return false;
  }

  if (
    !existingAdmin &&
    !passwordInput?.value
  ) {
    showAdminFormError(
      errorBox,
      "Password आवश्यक है।"
    );

    return false;
  }

  if (
    passwordInput &&
    confirmPasswordInput &&
    passwordInput.value !==
      confirmPasswordInput.value
  ) {
    showAdminFormError(
      errorBox,
      "दोनों Password समान होने चाहिए।"
    );

    return false;
  }

  const permissionInputs =
    form.querySelectorAll(
      "input[name='permissions']:checked"
    );

  const permissions =
    Array.from(
      permissionInputs
    ).map(
      (input) =>
        input.value
    );

  const payload = {
    name,
    email,
    role,
    permissions
  };

  if (!existingAdmin) {
    payload.adminId =
      adminId;

    payload.password =
      passwordInput.value;
  }

  try {
    if (
      existingAdmin
    ) {
      await adminAPIRequest(
        `/api/admin/admins/${encodeURIComponent(
          existingAdmin.id
        )}`,
        {
          method: "PUT",
          body: JSON.stringify(
            payload
          )
        }
      );

      showAdminToast(
        "success",
        "Admin अपडेट",
        "Admin की जानकारी सफलतापूर्वक अपडेट हो गई।"
      );
    } else {
      await adminAPIRequest(
        "/api/admin/admins",
        {
          method: "POST",
          body: JSON.stringify(
            payload
          )
        }
      );

      showAdminToast(
        "success",
        "Admin बनाया गया",
        "नया Admin सफलतापूर्वक बनाया गया।"
      );
    }

    closeAdminModal();

    await loadAdmins(
      true
    );

    return true;
  } catch (error) {
    console.error(
      "Admin save error:",
      error
    );

    showAdminFormError(
      errorBox,
      error?.message ||
        "Admin save नहीं हो सका।"
    );

    return false;
  }
}


// ========================================
// FORM ERROR
// ========================================

function showAdminFormError(
  element,
  message
) {
  if (!element) {
    showAdminToast(
      "error",
      "Validation Error",
      message
    );

    return;
  }

  element.textContent =
    message;

  element.hidden =
    false;
}


// ========================================
// TOGGLE ADMIN ACTIVE STATUS
// ========================================
      
async function toggleManagedAdmin(
  admin
) {
  if (
    !admin ||
    admin.role ===
      "owner"
  ) {
    return;
  }

  const action =
    admin.isActive
      ? "deactivate"
      : "activate";

  const confirmed =
    await showAdminConfirm({
      icon:
        admin.isActive
          ? "⏸️"
          : "▶️",
      title:
        admin.isActive
          ? "Admin निष्क्रिय करें?"
          : "Admin सक्रिय करें?",
      message:
        admin.isActive
          ? `${admin.name} को निष्क्रिय करने की पुष्टि करें।`
          : `${admin.name} को फिर से सक्रिय करने की पुष्टि करें।`,
      confirmText:
        admin.isActive
          ? "निष्क्रिय करें"
          : "सक्रिय करें",
      cancelText:
        "रद्द करें"
    });

  if (!confirmed) {
    return;
  }

  try {
    await adminAPIRequest(
      `/api/admin/admins/${encodeURIComponent(
        admin.id
      )}/${action}`,
      {
        method: "PATCH"
      }
    );

    showAdminToast(
      "success",
      "Status अपडेट",
      admin.isActive
        ? "Admin निष्क्रिय कर दिया गया।"
        : "Admin सक्रिय कर दिया गया।"
    );

    await loadAdmins(
      true
    );
  } catch (error) {
    console.error(
      "Admin status error:",
      error
    );

    showAdminToast(
      "error",
      "Status अपडेट नहीं हुआ",
      error?.message ||
        "Admin status बदलने में समस्या हुई।"
    );
  }
}


// ========================================
// DELETE ADMIN
// ========================================

async function deleteManagedAdmin(
  admin
) {
  if (
    !admin ||
    admin.role ===
      "owner"
  ) {
    return;
  }

  if (
    admin.id ===
    (
      adminState.admin
        ?.id ||
      ""
    )
  ) {
    showAdminToast(
      "warning",
      "अनुमति नहीं",
      "आप अपने वर्तमान Admin account को यहां से delete नहीं कर सकते।"
    );

    return;
  }

  const confirmed =
    await showAdminConfirm({
      icon: "🗑️",
      title:
        "Admin Delete करें?",
      message:
        `${admin.name} का Admin account स्थायी रूप से delete किया जाएगा।`,
      confirmText:
        "Delete",
      cancelText:
        "रद्द करें",
      danger: true
    });

  if (!confirmed) {
    return;
  }

  try {
    await adminAPIRequest(
      `/api/admin/admins/${encodeURIComponent(
        admin.id
      )}`,
      {
        method: "DELETE"
      }
    );

    showAdminToast(
      "success",
      "Admin Delete",
      "Admin account सफलतापूर्वक delete हो गया।"
    );

    await loadAdmins(
      true
    );
  } catch (error) {
    console.error(
      "Admin delete error:",
      error
    );

    showAdminToast(
      "error",
      "Delete नहीं हुआ",
      error?.message ||
        "Admin delete करने में समस्या हुई।"
    );
  }
}


// ========================================
// ADMIN PASSWORD RESET
// ========================================

function openAdminPasswordReset(
  admin
) {
  if (
    !admin ||
    admin.role ===
      "owner"
  ) {
    showAdminToast(
      "warning",
      "अनुमति नहीं",
      "Owner का password यहां से reset नहीं किया जा सकता।"
    );

    return;
  }

  const body = `
    <form
      id="admin-password-reset-form"
      class="admin-form"
      novalidate
    >

      <input
        type="hidden"
        id="reset-admin-id"
        value="${escapeHTML(
          admin.id
        )}"
      >

      <p>
        <strong>
          ${escapeHTML(
            admin.name
          )}
        </strong>
        का नया password सेट करें।
      </p>

      <div
        class="admin-form-group"
      >
        <label
          for="reset-admin-password"
        >
          नया Password
        </label>

        <input
          type="password"
          id="reset-admin-password"
          autocomplete="new-password"
          required
        >
      </div>

      <div
        class="admin-form-group"
      >
        <label
          for="reset-admin-confirm-password"
        >
          Password दोबारा दर्ज करें
        </label>

        <input
          type="password"
          id="reset-admin-confirm-password"
          autocomplete="new-password"
          required
        >
      </div>

      <div
        id="reset-admin-error"
        class="admin-form-error"
        hidden
      ></div>

    </form>
  `;

  openAdminModal({
    icon: "🔐",
    eyebrow:
      "Password Reset",
    title:
      "Admin Password बदलें",
    body,
    confirmText:
      "Password Save करें",
    cancelText:
      "रद्द करें",
    onConfirm:
      async () => {
        return submitAdminPasswordReset();
      }
  });
}


// ========================================
// SUBMIT ADMIN PASSWORD RESET
// ========================================

async function submitAdminPasswordReset() {
  const id =
    document.getElementById(
      "reset-admin-id"
    )?.value;

  const password =
    document.getElementById(
      "reset-admin-password"
    )?.value ||
    "";

  const confirmPassword =
    document.getElementById(
      "reset-admin-confirm-password"
    )?.value ||
    "";

  const errorBox =
    document.getElementById(
      "reset-admin-error"
    );

  if (!id) {
    showAdminFormError(
      errorBox,
      "Admin ID उपलब्ध नहीं है।"
    );

    return false;
  }

  if (
    password.length <
    8
  ) {
    showAdminFormError(
      errorBox,
      "Password कम से कम 8 characters का होना चाहिए।"
    );

    return false;
  }

  if (
    password !==
    confirmPassword
  ) {
    showAdminFormError(
      errorBox,
      "दोनों Password समान होने चाहिए।"
    );

    return false;
  }

  try {
    await adminAPIRequest(
      `/api/admin/admins/${encodeURIComponent(
        id
      )}/password`,
      {
        method: "PUT",
        body: JSON.stringify({
          password
        })
      }
    );

    closeAdminModal();

    showAdminToast(
      "success",
      "Password अपडेट",
      "Admin password सफलतापूर्वक बदल दिया गया।"
    );

    return true;
  } catch (error) {
    console.error(
      "Admin password reset error:",
      error
    );

    showAdminFormError(
      errorBox,
      error?.message ||
        "Password update नहीं हो सका।"
    );

    return false;
  }
}


// ========================================
// INITIALIZE ADMINS SECTION
// ========================================

function initializeAdminsSection() {
  initializeAdminSearch();

  initializeAdminRoleFilter();

  initializeAdminStatusFilter();

  initializeAdminRefresh();

  initializeCreateAdminButton();

  const previous =
    document.getElementById(
      "admins-prev-page"
    );

  if (previous) {
    previous.addEventListener(
      "click",
      goToPreviousAdminPage
    );
  }

  const next =
    document.getElementById(
      "admins-next-page"
    );

  if (next) {
    next.addEventListener(
      "click",
      goToNextAdminPage
    );
  }
}


// ========================================
// GET ADMIN ITEMS
// ========================================

function getAdminItems() {
  return [
    ...(adminState.admins
      ?.filteredItems ||
      [])
  ];
         }
// ========================================
// ADMIN.JS
// PART 24 / 25
// SETTINGS + PROFILE + PASSWORD
// ========================================


// ========================================
// SETTINGS STATE
// ========================================

if (!adminState.settings) {
  adminState.settings = {
    loaded: false,
    loading: false,
    saving: false,
    data: {}
  };
}


// ========================================
// DEFAULT SITE SETTINGS
// ========================================

const DEFAULT_SITE_SETTINGS = {
  siteName:
    "आवाज राजस्थान",

  siteTagline:
    "राजस्थान की हर खबर, सबसे पहले",

  siteDescription:
    "राजस्थान केंद्रित प्रोफेशनल न्यूज़ वेबसाइट।",

  contactEmail:
    "",

  contactPhone:
    "",

  breakingEnabled:
    true,

  trendingEnabled:
    true,

  videoEnabled:
    true,

  liveTVEnabled:
    false,

  liveBlogEnabled:
    false,

  epaperEnabled:
    true,

  facebook:
    "",

  instagram:
    "",

  youtube:
    "",

  twitter:
    ""
};


// ========================================
// LOAD SETTINGS
// ========================================

async function loadSettings(
  forceRefresh = false
) {
  if (
    !adminState.isAuthenticated
  ) {
    return {};
  }

  const state =
    adminState.settings;

  if (
    state.loading
  ) {
    return state.data;
  }

  if (
    state.loaded &&
    !forceRefresh
  ) {
    populateSettingsForm(
      state.data
    );

    return state.data;
  }

  state.loading =
    true;

  try {
    /*
     * वर्तमान backend में settings के लिए
     * कोई confirmed GET route उपलब्ध नहीं है।
     *
     * इसलिए frontend default values रखता है।
     * बाद में backend में settings route
     * जोड़ने पर इसी function में endpoint
     * connect किया जा सकता है।
     */

    state.data = {
      ...DEFAULT_SITE_SETTINGS
    };

    state.loaded =
      true;

    populateSettingsForm(
      state.data
    );

    return state.data;
  } catch (error) {
    console.error(
      "Settings loading error:",
      error
    );

    showAdminToast(
      "error",
      "Settings लोड नहीं हुईं",
      error?.message ||
        "Site settings प्राप्त करने में समस्या हुई।"
    );

    return state.data;
  } finally {
    state.loading =
      false;
  }
}


// ========================================
// POPULATE SETTINGS FORM
// ========================================

function populateSettingsForm(
  settings
) {
  const data = {
    ...DEFAULT_SITE_SETTINGS,
    ...(settings || {})
  };

  setInputValue(
    "setting-site-name",
    data.siteName
  );

  setInputValue(
    "setting-site-tagline",
    data.siteTagline
  );

  setInputValue(
    "setting-site-description",
    data.siteDescription
  );

  setInputValue(
    "setting-contact-email",
    data.contactEmail
  );

  setInputValue(
    "setting-contact-phone",
    data.contactPhone
  );

  setCheckboxValue(
    "setting-breaking-enabled",
    data.breakingEnabled
  );

  setCheckboxValue(
    "setting-trending-enabled",
    data.trendingEnabled
  );

  setCheckboxValue(
    "setting-video-enabled",
    data.videoEnabled
  );

  setCheckboxValue(
    "setting-live-tv-enabled",
    data.liveTVEnabled
  );

  setCheckboxValue(
    "setting-live-blog-enabled",
    data.liveBlogEnabled
  );

  setCheckboxValue(
    "setting-epaper-enabled",
    data.epaperEnabled
  );

  setInputValue(
    "setting-facebook",
    data.facebook
  );

  setInputValue(
    "setting-instagram",
    data.instagram
  );

  setInputValue(
    "setting-youtube",
    data.youtube
  );

  setInputValue(
    "setting-twitter",
    data.twitter
  );
}


// ========================================
// READ SETTINGS FORM
// ========================================

function readSettingsForm() {
  return {
    siteName:
      getInputValue(
        "setting-site-name"
      ),

    siteTagline:
      getInputValue(
        "setting-site-tagline"
      ),

    siteDescription:
      getInputValue(
        "setting-site-description"
      ),

    contactEmail:
      getInputValue(
        "setting-contact-email"
      ),

    contactPhone:
      getInputValue(
        "setting-contact-phone"
      ),

    breakingEnabled:
      getCheckboxValue(
        "setting-breaking-enabled"
      ),

    trendingEnabled:
      getCheckboxValue(
        "setting-trending-enabled"
      ),

    videoEnabled:
      getCheckboxValue(
        "setting-video-enabled"
      ),

    liveTVEnabled:
      getCheckboxValue(
        "setting-live-tv-enabled"
      ),

    liveBlogEnabled:
      getCheckboxValue(
        "setting-live-blog-enabled"
      ),

    epaperEnabled:
      getCheckboxValue(
        "setting-epaper-enabled"
      ),

    facebook:
      getInputValue(
        "setting-facebook"
      ),

    instagram:
      getInputValue(
        "setting-instagram"
      ),

    youtube:
      getInputValue(
        "setting-youtube"
      ),

    twitter:
      getInputValue(
        "setting-twitter"
      )
  };
}


// ========================================
// SAVE SETTINGS
// ========================================

async function saveSettings() {
  if (
    !adminState.isAuthenticated
  ) {
    return false;
  }

  const settings =
    readSettingsForm();

  if (
    !settings.siteName
  ) {
    showAdminToast(
      "warning",
      "Site Name आवश्यक है",
      "कृपया Site Name दर्ज करें।"
    );

    return false;
  }

  /*
   * वर्तमान backend में settings update
   * endpoint confirmed नहीं है।
   *
   * इसलिए किसी काल्पनिक API endpoint को
   * call नहीं किया जा रहा है।
   */

  adminState.settings.data =
    settings;

  adminState.settings.loaded =
    true;

  showAdminToast(
    "warning",
    "Settings Save API उपलब्ध नहीं",
    "वर्तमान backend में site settings के लिए सुरक्षित update endpoint नहीं है।"
  );

  return false;
}


// ========================================
// RESET SETTINGS
// ========================================

function resetSettings() {
  const confirmed =
    window.confirm(
      "क्या आप settings को default values पर reset करना चाहते हैं?"
    );

  if (!confirmed) {
    return;
  }

  adminState.settings.data =
    {
      ...DEFAULT_SITE_SETTINGS
    };

  populateSettingsForm(
    adminState.settings.data
  );

  showAdminToast(
    "success",
    "Settings Reset",
    "Settings default values पर वापस आ गई हैं।"
  );
}


// ========================================
// SETTINGS BUTTONS
// ========================================

function initializeSettingsSection() {
  const saveButton =
    document.getElementById(
      "settings-save-button"
    );

  if (saveButton) {
    saveButton.addEventListener(
      "click",
      async () => {
        setButtonLoading(
          saveButton,
          true
        );

        try {
          await saveSettings();
        } finally {
          setButtonLoading(
            saveButton,
            false
          );
        }
      }
    );
  }

  const resetButton =
    document.getElementById(
      "settings-reset-button"
    );

  if (resetButton) {
    resetButton.addEventListener(
      "click",
      resetSettings
    );
  }
}


// ========================================
// PROFILE STATE
// ========================================

if (!adminState.profile) {
  adminState.profile = {
    loading: false,
    loaded: false
  };
}


// ========================================
// RENDER PROFILE
// ========================================

function renderAdminProfile() {
  const admin =
    adminState.admin ||
    {};

  updateElementText(
    "profile-name",
    admin.name ||
      admin.fullName ||
      admin.adminId ||
      "-"
  );

  updateElementText(
    "profile-email",
    admin.email ||
      "-"
  );

  updateElementText(
    "profile-role",
    getAdminRoleLabel(
      admin.role
    )
  );

  updateElementText(
    "profile-admin-id",
    admin.adminId ||
      "-"
  );

  updateElementText(
    "profile-account-status",
    admin.isActive === false
      ? "निष्क्रिय"
      : "सक्रिय"
  );

  updateElementText(
    "profile-last-login",
    formatDateTime(
      admin.lastLogin ||
        admin.lastLoginAt
    )
  );

  updateElementText(
    "profile-created-at",
    formatDateTime(
      admin.createdAt
    )
  );

  const avatar =
    document.getElementById(
      "profile-avatar"
    );

  if (avatar) {
    const name =
      admin.name ||
      admin.adminId ||
      "A";

    avatar.textContent =
      getInitials(
        name
      );
  }
}


// ========================================
// PROFILE INITIALIZATION
// ========================================

function initializeProfileSection() {
  renderAdminProfile();

  initializePasswordForm();

  initializeLogoutAllSessions();
}


// ========================================
// PASSWORD FORM
// ========================================

function initializePasswordForm() {
  const form =
    document.getElementById(
      "profile-password-form"
    );

  if (!form) {
    return;
  }

  form.addEventListener(
    "submit",
    async (event) => {
      event.preventDefault();

      await changeAdminPassword();
    }
  );
}


// ========================================
// CHANGE ADMIN PASSWORD
// ========================================

async function changeAdminPassword() {
  const currentPassword =
    getInputValue(
      "profile-current-password"
    );

  const newPassword =
    getInputValue(
      "profile-new-password"
    );

  const confirmPassword =
    getInputValue(
      "profile-confirm-password"
    );

  if (
    !currentPassword
  ) {
    showAdminToast(
      "warning",
      "Current Password",
      "वर्तमान password दर्ज करें।"
    );

    return false;
  }

  if (
    newPassword.length <
    8
  ) {
    showAdminToast(
      "warning",
      "Password कमजोर है",
      "नया password कम से कम 8 characters का होना चाहिए।"
    );

    return false;
  }

  if (
    newPassword !==
    confirmPassword
  ) {
    showAdminToast(
      "warning",
      "Password Match नहीं",
      "नया password और confirm password समान होना चाहिए।"
    );

    return false;
  }

  try {
    await adminAPIRequest(
      "/api/admin/change-password",
      {
        method: "POST",
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      }
    );

    const form =
      document.getElementById(
        "profile-password-form"
      );

    if (form) {
      form.reset();
    }

    showAdminToast(
      "success",
      "Password बदल गया",
      "आपका Admin password सफलतापूर्वक बदल दिया गया है।"
    );

    return true;
  } catch (error) {
    console.error(
      "Password change error:",
      error
    );

    showAdminToast(
      "error",
      "Password नहीं बदला",
      error?.message ||
        "Password बदलने में समस्या हुई।"
    );

    return false;
  }
}


// ========================================
// LOGOUT ALL SESSIONS
// ========================================

function initializeLogoutAllSessions() {
  const button =
    document.getElementById(
      "logout-all-sessions-button"
    );

  if (!button) {
    return;
  }

  button.addEventListener(
    "click",
    async () => {
      const confirmed =
        await showAdminConfirm({
          icon: "🔐",
          title:
            "सभी Sessions Logout करें?",
          message:
            "इससे आपके सभी दूसरे active Admin sessions logout हो जाएंगे।",
          confirmText:
            "Logout All",
          cancelText:
            "रद्द करें"
        });

      if (!confirmed) {
        return;
      }

      setButtonLoading(
        button,
        true
      );

      try {
        await adminAPIRequest(
          "/api/admin/logout-all",
          {
            method: "POST"
          }
        );

        /*
         * वर्तमान session भी backend द्वारा
         * invalidate हो सकता है।
         */

        clearAdminSession();

        showAdminToast(
          "success",
          "Sessions Logout",
          "सभी Admin sessions logout कर दिए गए हैं।"
        );

        setTimeout(
          () => {
            showAdminLoginScreen();
          },
          500
        );
      } catch (error) {
        console.error(
          "Logout all error:",
          error
        );

        showAdminToast(
          "error",
          "Logout नहीं हुआ",
          error?.message ||
            "सभी sessions logout करने में समस्या हुई।"
        );
      } finally {
        setButtonLoading(
          button,
          false
        );
      }
    }
  );
}


// ========================================
// ADMIN LOGOUT
// ========================================

async function logoutAdmin() {
  try {
    if (
      adminState.isAuthenticated
    ) {
      await adminAPIRequest(
        "/api/admin/logout",
        {
          method: "POST"
        }
      );
    }
  } catch (error) {
    console.warn(
      "Admin logout request failed:",
      error
    );
  } finally {
    clearAdminSession();

    showAdminLoginScreen();
  }
}


// ========================================
// LOGOUT BUTTON
// ========================================

function initializeAdminLogout() {
  const button =
    document.getElementById(
      "admin-logout-button"
    );

  if (!button) {
    return;
  }

  button.addEventListener(
    "click",
    async () => {
      const confirmed =
        await showAdminConfirm({
          icon: "🚪",
          title:
            "Logout करें?",
          message:
            "क्या आप Admin Panel से logout करना चाहते हैं?",
          confirmText:
            "Logout",
          cancelText:
            "रद्द करें"
        });

      if (!confirmed) {
        return;
      }

      setButtonLoading(
        button,
        true
      );

      try {
        await logoutAdmin();
      } finally {
        setButtonLoading(
          button,
          false
        );
      }
    }
  );
}


// ========================================
// SHOW LOGIN SCREEN
// ========================================

function showAdminLoginScreen() {
  const loginScreen =
    document.getElementById(
      "admin-login-screen"
    );

  const panel =
    document.getElementById(
      "admin-panel"
    );

  if (loginScreen) {
    loginScreen.classList.remove(
      "hidden"
    );

    loginScreen.removeAttribute(
      "hidden"
    );
  }

  if (panel) {
    panel.classList.add(
      "hidden"
    );

    panel.setAttribute(
      "hidden",
      "hidden"
    );
  }

  adminState.isAuthenticated =
    false;

  adminState.admin =
    null;
}


// ========================================
// SHOW ADMIN PANEL
// ========================================

function showAdminPanel() {
  const loginScreen =
    document.getElementById(
      "admin-login-screen"
    );

  const panel =
    document.getElementById(
      "admin-panel"
    );

  if (loginScreen) {
    loginScreen.classList.add(
      "hidden"
    );

    loginScreen.setAttribute(
      "hidden",
      "hidden"
    );
  }

  if (panel) {
    panel.classList.remove(
      "hidden"
    );

    panel.removeAttribute(
      "hidden"
    );
  }

  renderAdminProfile();

  updateAdminHeader();

  updateAdminNavigation();
}


// ========================================
// ADMIN ACCOUNT REFRESH
// ========================================

async function refreshAdminProfile() {
  try {
    const response =
      await adminAPIRequest(
        "/api/admin/me"
      );

    const data =
      normalizeAPIResponse(
        response
      );

    const admin =
      data?.admin ||
      data?.user ||
      data?.data ||
      data;

    if (admin) {
      adminState.admin =
        normalizeAdminRecord(
          admin
        );

      adminState.isAuthenticated =
        true;

      renderAdminProfile();

      updateAdminHeader();

      updateAdminNavigation();
    }

    return admin;
  } catch (error) {
    console.error(
      "Admin profile refresh error:",
      error
    );

    return null;
  }
}


// ========================================
// PROFILE PASSWORD TOGGLE
// ========================================

function initializeProfilePasswordToggles() {
  const selectors = [
    "profile-current-password",
    "profile-new-password",
    "profile-confirm-password"
  ];

  selectors.forEach(
    (id) => {
      const input =
        document.getElementById(
          id
        );

      if (!input) {
        return;
      }

      const wrapper =
        input.closest(
          ".admin-password-field"
        );

      if (!wrapper) {
        return;
      }

      const button =
        wrapper.querySelector(
          "[data-password-toggle]"
        );

      if (!button) {
        return;
      }

      button.addEventListener(
        "click",
        () => {
          const isPassword =
            input.type ===
            "password";

          input.type =
            isPassword
              ? "text"
              : "password";

          button.setAttribute(
            "aria-label",
            isPassword
              ? "Password छुपाएं"
              : "Password दिखाएं"
          );
        }
      );
    }
  );
}


// ========================================
// SETTINGS + PROFILE BOOTSTRAP
// ========================================

function initializeSettingsAndProfile() {
  initializeSettingsSection();

  initializeProfileSection();

  initializeProfilePasswordToggles();

  initializeAdminLogout();
}
/* =========================================================
   ADMIN.JS
   PART 25 / 25
   BOOTSTRAP • INITIALIZATION • EVENTS • RESIZE • KEYBOARD
   FINAL EXPORTS • DOM READY
   ========================================================= */

(function () {
  "use strict";

  /* =======================================================
     SECTION: GLOBAL EVENT BINDINGS
     ======================================================= */

  function bindGlobalEvents() {
    /*
     * Login form
     */
    const loginForm = document.getElementById("admin-login-form");

    if (loginForm) {
      loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        if (typeof handleAdminLogin === "function") {
          handleAdminLogin(event);
        }
      });
    }

    /*
     * Login password toggle
     */
    const toggleLoginPassword =
      document.getElementById("toggle-login-password");

    if (toggleLoginPassword) {
      toggleLoginPassword.addEventListener("click", function () {
        const passwordInput =
          document.getElementById("admin-login-password");

        if (!passwordInput) {
          return;
        }

        const isPassword =
          passwordInput.getAttribute("type") === "password";

        passwordInput.setAttribute(
          "type",
          isPassword ? "text" : "password"
        );

        const icon =
          toggleLoginPassword.querySelector("[data-password-icon]");

        if (icon) {
          icon.textContent = isPassword ? "🙈" : "👁";
        }
      });
    }

    /*
     * Logout
     */
    const logoutButton =
      document.getElementById("admin-logout-button");

    if (logoutButton) {
      logoutButton.addEventListener("click", function () {
        if (typeof handleAdminLogout === "function") {
          handleAdminLogout();
        }
      });
    }

    /*
     * Mobile sidebar
     */
    const mobileMenuButton =
      document.getElementById("admin-mobile-menu-button");

    if (mobileMenuButton) {
      mobileMenuButton.addEventListener("click", function () {
        if (typeof toggleAdminSidebar === "function") {
          toggleAdminSidebar();
        }
      });
    }

    /*
     * Sidebar overlay
     */
    const sidebarOverlay =
      document.getElementById("admin-sidebar-overlay");

    if (sidebarOverlay) {
      sidebarOverlay.addEventListener("click", function () {
        if (typeof closeAdminSidebar === "function") {
          closeAdminSidebar();
        }
      });
    }

    /*
     * Header profile
     */
    const headerProfileButton =
      document.getElementById("admin-header-profile-button");

    if (headerProfileButton) {
      headerProfileButton.addEventListener("click", function () {
        if (typeof navigateToAdminSection === "function") {
          navigateToAdminSection("profile");
        }
      });
    }

    /*
     * Notification button
     */
    const notificationButton =
      document.getElementById("admin-notification-button");

    if (notificationButton) {
      notificationButton.addEventListener("click", function () {
        if (typeof showAdminToast === "function") {
          showAdminToast(
            "अभी कोई नई सूचना उपलब्ध नहीं है।",
            "info"
          );
        }
      });
    }

    /*
     * Modal close
     */
    const modalClose =
      document.getElementById("admin-modal-close");

    if (modalClose) {
      modalClose.addEventListener("click", function () {
        if (typeof closeAdminModal === "function") {
          closeAdminModal();
        }
      });
    }

    /*
     * Modal cancel
     */
    const modalCancel =
      document.getElementById("admin-modal-cancel");

    if (modalCancel) {
      modalCancel.addEventListener("click", function () {
        if (typeof closeAdminModal === "function") {
          closeAdminModal(false);
        }
      });
    }

    /*
     * Confirm dialog cancel
     */
    const confirmCancel =
      document.getElementById("admin-confirm-cancel");

    if (confirmCancel) {
      confirmCancel.addEventListener("click", function () {
        if (typeof closeAdminConfirm === "function") {
          closeAdminConfirm(false);
        }
      });
    }

    /*
     * Confirm dialog submit
     */
    const confirmSubmit =
      document.getElementById("admin-confirm-submit");

    if (confirmSubmit) {
      confirmSubmit.addEventListener("click", function () {
        if (typeof closeAdminConfirm === "function") {
          closeAdminConfirm(true);
        }
      });
    }

    /*
     * Modal backdrop
     */
    const adminModal =
      document.getElementById("admin-modal");

    if (adminModal) {
      adminModal.addEventListener("click", function (event) {
        if (event.target === adminModal) {
          if (typeof closeAdminModal === "function") {
            closeAdminModal();
          }
        }
      });
    }

    /*
     * Confirmation backdrop
     */
    const confirmDialog =
      document.getElementById("admin-confirm-dialog");

    if (confirmDialog) {
      confirmDialog.addEventListener("click", function (event) {
        if (event.target === confirmDialog) {
          if (typeof closeAdminConfirm === "function") {
            closeAdminConfirm(false);
          }
        }
      });
    }
  }


  /* =======================================================
     SECTION: QUICK ACTIONS
     ======================================================= */

  function bindQuickActions() {
    const quickActions =
      document.getElementById("quick-actions");

    if (!quickActions) {
      return;
    }

    quickActions.addEventListener("click", function (event) {
      const button =
        event.target.closest("[data-action]");

      if (!button) {
        return;
      }

      const action =
        button.getAttribute("data-action");

      switch (action) {
        case "create-news":
          if (typeof openNewsEditor === "function") {
            openNewsEditor();
          }
          break;

        case "manage-breaking":
          if (typeof navigateToAdminSection === "function") {
            navigateToAdminSection("breaking");
          }
          break;

        case "manage-live-tv":
          if (typeof navigateToAdminSection === "function") {
            navigateToAdminSection("live-tv");
          }
          break;

        case "manage-epaper":
          if (typeof navigateToAdminSection === "function") {
            navigateToAdminSection("epaper");
          }
          break;

        default:
          break;
      }
    });
  }


  /* =======================================================
     SECTION: SECTION INITIALIZATION
     ======================================================= */

  function initializeSectionEvents() {
    /*
     * News
     */
    if (typeof initializeNewsEvents === "function") {
      initializeNewsEvents();
    }

    /*
     * Breaking
     */
    if (typeof initializeBreakingEvents === "function") {
      initializeBreakingEvents();
    }

    /*
     * Trending
     */
    if (typeof initializeTrendingEvents === "function") {
      initializeTrendingEvents();
    }

    /*
     * Video
     */
    if (typeof initializeVideoEvents === "function") {
      initializeVideoEvents();
    }

    /*
     * Live TV
     */
    if (typeof initializeLiveTVEvents === "function") {
      initializeLiveTVEvents();
    }

    /*
     * Live Blog
     */
    if (typeof initializeLiveBlogEvents === "function") {
      initializeLiveBlogEvents();
    }

    /*
     * ePaper
     */
    if (typeof initializeEPaperEvents === "function") {
      initializeEPaperEvents();
    }

    /*
     * Contacts
     */
    if (typeof initializeContactsEvents === "function") {
      initializeContactsEvents();
    }

    /*
     * Users
     */
    if (typeof initializeUsersEvents === "function") {
      initializeUsersEvents();
    }

    /*
     * Admins
     */
    if (typeof initializeAdminsEvents === "function") {
      initializeAdminsEvents();
    }

    /*
     * Settings
     */
    if (typeof initializeSettingsEvents === "function") {
      initializeSettingsEvents();
    }

    /*
     * Profile
     */
    if (typeof initializeProfileEvents === "function") {
      initializeProfileEvents();
    }
  }


  /* =======================================================
     SECTION: RESPONSIVE EVENTS
     ======================================================= */

  function handleAdminResize() {
    if (window.innerWidth > 1024) {
      if (typeof closeAdminSidebar === "function") {
        closeAdminSidebar();
      }
    }

    if (typeof updateAdminLayout === "function") {
      updateAdminLayout();
    }
  }


  /* =======================================================
     SECTION: KEYBOARD SHORTCUTS
     ======================================================= */

  function bindKeyboardShortcuts() {
    document.addEventListener("keydown", function (event) {
      /*
       * Escape
       */
      if (event.key === "Escape") {
        const modal =
          document.getElementById("admin-modal");

        const confirmDialog =
          document.getElementById("admin-confirm-dialog");

        if (
          confirmDialog &&
          !confirmDialog.classList.contains("hidden")
        ) {
          if (typeof closeAdminConfirm === "function") {
            closeAdminConfirm(false);
          }

          return;
        }

        if (
          modal &&
          !modal.classList.contains("hidden")
        ) {
          if (typeof closeAdminModal === "function") {
            closeAdminModal();
          }

          return;
        }

        if (typeof closeAdminSidebar === "function") {
          closeAdminSidebar();
        }
      }

      /*
       * Ctrl + K
       * Search shortcut
       */
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();

        const activeSection =
          document.querySelector(
            ".admin-section.active"
          );

        if (!activeSection) {
          return;
        }

        const searchInput =
          activeSection.querySelector(
            'input[type="search"], input[placeholder*="खोज"], input[placeholder*="Search"]'
          );

        if (searchInput) {
          searchInput.focus();
        }
      }
    });
  }


  /* =======================================================
     SECTION: FOOTER YEAR
     ======================================================= */

  function initializeFooterYear() {
    const footerYear =
      document.getElementById("admin-footer-year");

    if (footerYear) {
      footerYear.textContent =
        new Date().getFullYear();
    }

    const loginYear =
      document.getElementById("admin-login-year");

    if (loginYear) {
      loginYear.textContent =
        new Date().getFullYear();
    }
  }


  /* =======================================================
     SECTION: INITIAL DATA LOADING
     ======================================================= */

  async function loadInitialAdminData() {
    if (!adminState || !adminState.isAuthenticated) {
      return;
    }

    /*
     * Profile is already available from session.
     */
    if (typeof refreshAdminProfile === "function") {
      refreshAdminProfile();
    }

    /*
     * Dashboard
     */
    if (typeof loadDashboardData === "function") {
      await loadDashboardData();
    }

    /*
     * Load current section if required.
     */
    const currentSection =
      adminState.currentSection || "dashboard";

    if (
      typeof loadAdminSectionData === "function"
    ) {
      await loadAdminSectionData(currentSection);
    }
  }


  /* =======================================================
     SECTION: ADMIN APPLICATION BOOT
     ======================================================= */

  async function bootAdminApplication() {
    try {
      initializeFooterYear();

      bindGlobalEvents();

      bindQuickActions();

      bindKeyboardShortcuts();

      initializeSectionEvents();

      window.addEventListener(
        "resize",
        debounceAdminFunction(
          handleAdminResize,
          150
        )
      );

      /*
       * Restore saved section.
       */
      const savedSection =
        typeof getStoredAdminSection === "function"
          ? getStoredAdminSection()
          : "dashboard";

      /*
       * Check existing admin session.
       */
      let authenticated = false;

      if (
        typeof checkAdminAuthentication === "function"
      ) {
        authenticated =
          await checkAdminAuthentication();
      }

      if (!authenticated) {
        if (
          typeof showAdminLoginScreen === "function"
        ) {
          showAdminLoginScreen();
        }

        return;
      }

      /*
       * Authentication successful.
       */
      adminState.isAuthenticated = true;

      if (
        typeof showAdminPanel === "function"
      ) {
        showAdminPanel();
      }

      /*
       * Update permissions and header.
       */
      if (
        typeof updateAdminNavigation === "function"
      ) {
        updateAdminNavigation();
      }

      if (
        typeof updateAdminHeader === "function"
      ) {
        updateAdminHeader();
      }

      /*
       * Restore section.
       */
      if (
        typeof navigateToAdminSection === "function"
      ) {
        await navigateToAdminSection(
          savedSection || "dashboard"
        );
      }

      /*
       * Load initial data.
       */
      await loadInitialAdminData();

    } catch (error) {
      console.error(
        "Admin application boot error:",
        error
      );

      if (
        typeof showAdminToast === "function"
      ) {
        showAdminToast(
          "Admin Panel शुरू करते समय समस्या हुई।",
          "error"
        );
      }

      if (
        typeof showAdminLoginScreen === "function"
      ) {
        showAdminLoginScreen();
      }
    }
  }


  /* =======================================================
     SECTION: SAFETY CHECKS
     ======================================================= */

  function runAdminSafetyChecks() {
    const requiredElements = [
      "admin-login-screen",
      "admin-login-form",
      "admin-panel",
      "admin-content",
      "admin-modal",
      "admin-confirm-dialog",
      "admin-toast-container",
      "admin-loading-overlay"
    ];

    const missingElements = [];

    requiredElements.forEach(function (id) {
      if (!document.getElementById(id)) {
        missingElements.push(id);
      }
    });

    if (missingElements.length > 0) {
      console.warn(
        "Admin Panel: कुछ आवश्यक HTML elements नहीं मिले:",
        missingElements
      );
    }

    /*
     * adminState safety
     */
    if (
      typeof adminState === "undefined" ||
      !adminState
    ) {
      console.error(
        "Admin Panel: adminState उपलब्ध नहीं है।"
      );

      return false;
    }

    return true;
  }


  /* =======================================================
     SECTION: GLOBAL EXPORTS
     ======================================================= */

  /*
   * इन्हें window पर expose किया गया है ताकि
   * HTML inline actions या दूसरे modules से भी
   * आवश्यकता पड़ने पर इस्तेमाल किया जा सके।
   */

  window.AwaazRajasthanAdmin = {
    state:
      typeof adminState !== "undefined"
        ? adminState
        : null,

    boot:
      bootAdminApplication,

    login:
      typeof handleAdminLogin === "function"
        ? handleAdminLogin
        : null,

    logout:
      typeof handleAdminLogout === "function"
        ? handleAdminLogout
        : null,

    navigate:
      typeof navigateToAdminSection === "function"
        ? navigateToAdminSection
        : null,

    refresh:
      typeof loadAdminSectionData === "function"
        ? loadAdminSectionData
        : null
  };


  /* =======================================================
     SECTION: DOM CONTENT LOADED
     ======================================================= */

  if (
    document.readyState === "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      async function () {
        if (runAdminSafetyChecks()) {
          await bootAdminApplication();
        }
      },
      {
        once: true
      }
    );
  } else {
    /*
     * यदि script DOM बनने के बाद load हुई है।
     */
    if (runAdminSafetyChecks()) {
      bootAdminApplication();
    }
  }


  /* =======================================================
     SECTION: FINAL GLOBAL FALLBACKS
     ======================================================= */

  /*
   * कुछ functions HTML के inline onclick से call हो सकते हैं।
   * यदि वे पहले से window पर उपलब्ध नहीं हैं तो expose करें।
   */

  if (
    typeof handleAdminLogin === "function"
  ) {
    window.handleAdminLogin =
      handleAdminLogin;
  }

  if (
    typeof handleAdminLogout === "function"
  ) {
    window.handleAdminLogout =
      handleAdminLogout;
  }

  if (
    typeof navigateToAdminSection === "function"
  ) {
    window.navigateToAdminSection =
      navigateToAdminSection;
  }

  if (
    typeof openNewsEditor === "function"
  ) {
    window.openNewsEditor =
      openNewsEditor;
  }

  if (
    typeof showAdminToast === "function"
  ) {
    window.showAdminToast =
      showAdminToast;
  }

  if (
    typeof closeAdminModal === "function"
  ) {
    window.closeAdminModal =
      closeAdminModal;
  }

  if (
    typeof closeAdminConfirm === "function"
  ) {
    window.closeAdminConfirm =
      closeAdminConfirm;
  }


  /* =======================================================
     END OF ADMIN.JS
     PART 25 / 25
     ======================================================= */

})();
