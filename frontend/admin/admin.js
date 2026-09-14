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
