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
