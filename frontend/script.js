/* =========================================================
   AAWAZ RAJASTHAN - FRONTEND / BACKEND INTEGRATION
   Backend: http://localhost:5000/api
   ========================================================= */

"use strict";

const API_BASE_URL = (window.AAWAZ_API_URL || "http://localhost:5000/api").replace(/\/$/, "");
const API_ROOT = API_BASE_URL.replace(/\/api$/, "");

let currentNews = null;
let currentCategory = "";
let searchTimer = null;

const state = {
  news: [],
  breaking: [],
  trending: [],
  latest: [],
  user: null
};

/* =========================================================
   DOM READY
   ========================================================= */

document.addEventListener("DOMContentLoaded", async () => {
  initSplashScreen();
  initNavigation();
  initSearch();
  initLogin();
  initSocialSharing();
  initLiveTV();
  initEPaper();
  initForms();
  initMobileNavigation();
  initGeneralButtons();
  initKeyboardShortcuts();
  initInitialScreen();
  setCurrentYear();

  await restoreLogin();
  await loadSiteConfig();
  await loadHomepageNews();
});

/* =========================================================
   API HELPERS
   ========================================================= */

async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem("aawaz_token");
  const headers = new Headers(options.headers || {});

  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  let data = {};

  try {
    data = await response.json();
  } catch (_) {
    data = {
      success: false,
      message: "Server से सही response नहीं मिला।"
    };
  }

  if (!response.ok) {
    const error = new Error(
      data.message || `Request failed (${response.status})`
    );

    error.status = response.status;
    error.data = data;

    throw error;
  }

  return data;
}

function imageUrl(value) {
  if (!value) {
    return "https://picsum.photos/900/500?random=101";
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  if (value.startsWith("/")) {
    return `${API_ROOT}${value}`;
  }

  return `${API_ROOT}/${value}`;
}

function escapeHTML(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatDate(date) {
  if (!date) return "";

  const d = new Date(date);

  if (Number.isNaN(d.getTime())) {
    return "";
  }

  return d.toLocaleString("hi-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function relativeTime(date) {
  if (!date) return "";

  const time = new Date(date).getTime();

  if (Number.isNaN(time)) {
    return "";
  }

  const diff = Math.max(0, Date.now() - time);
  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) return "अभी";

  if (minutes < 60) {
    return `${minutes} मिनट पहले`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} घंटे पहले`;
  }

  const days = Math.floor(hours / 24);

  return `${days} दिन पहले`;
}

function newsId(news) {
  return news && (news._id || news.id);
}

/* =========================================================
   SPLASH
   ========================================================= */

function initSplashScreen() {
  const splash = document.querySelector(".splash-container");

  if (!splash) return;

  setTimeout(() => {
    splash.classList.add("hide");

    setTimeout(() => {
      splash.style.display = "none";
    }, 600);
  }, 1200);
}

/* =========================================================
   NAVIGATION / SCREENS
   ========================================================= */

function initNavigation() {
  document
    .querySelectorAll(".nav-item, .mob-nav-item")
    .forEach(item => {
      item.addEventListener("click", event => {
        event.preventDefault();

        let target =
          item.dataset.screen ||
          item.dataset.target ||
          item.getAttribute("href");

        target = target
          ? target.replace(/^#/, "")
          : "home-screen";

        const label = item.textContent.trim();

        if (
          target === "category-screen" &&
          label &&
          !["होम", "ई-पेपर", "वीडियो", "लाइव टीवी"].includes(label)
        ) {
          currentCategory = label;
          loadCategoryNews(label);
        }

        showScreen(target);
        updateActiveNavigation(target);

        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      });
    });

  document
    .querySelectorAll(".logo-area, .logo-button")
    .forEach(logo => {
      logo.addEventListener("click", () => {
        showScreen("home-screen");
        updateActiveNavigation("home-screen");

        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      });
    });

  document.querySelectorAll(".see-more").forEach(button => {
    button.addEventListener("click", event => {
      event.preventDefault();

      const target =
        button.dataset.screen ||
        button.dataset.target ||
        "latest-screen";

      showScreen(target);
      updateActiveNavigation(target);
      loadLatestNews();
    });
  });

  document.querySelectorAll(".breadcrumb a").forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault();

      showScreen("home-screen");
      updateActiveNavigation("home-screen");
    });
  });
}

function showScreen(screenId) {
  let id = String(screenId || "home-screen").replace(/^#/, "");

  const aliases = {
    home: "home-screen",
    latest: "latest-screen",
    rajasthan: "rajasthan-screen",
    politics: "politics-screen",
    business: "business-screen",
    sports: "sports-screen",
    entertainment: "entertainment-screen",
    education: "education-screen",
    video: "video-screen",
    videos: "video-screen",
    live: "live-screen",
    "live-tv": "live-screen",
    epaper: "epaper-screen",
    "e-paper": "epaper-screen",
    contact: "contact-screen",
    category: "category-screen",
    detail: "detail-screen"
  };

  id = aliases[id] || id;

  let target = document.getElementById(id);

  if (!target) {
    target = createDynamicScreen(id);
  }

  if (!target) return;

  document
    .querySelectorAll(".page-screen")
    .forEach(screen => {
      screen.classList.remove("active-screen");
    });

  target.classList.add("active-screen");

  if (history.replaceState) {
    history.replaceState(null, "", `#${id}`);
  }

  if (id === "live-screen") {
    loadLiveTV();
  }

  if (id === "epaper-screen") {
    loadEPaper();
  }

  if (id === "video-screen") {
    loadVideoScreen();
  }

  if (id === "contact-screen") {
    initContactScreen();
  }

  if (id === "latest-screen") {
    loadLatestNews();
  }

  return target;
}

function createDynamicScreen(id) {
  const screen = document.createElement("section");

  screen.id = id;
  screen.className = "page-screen";

  screen.innerHTML = `
    <div class="container" style="padding:40px 20px">
      <div id="${id}-content"></div>
    </div>
  `;

  document.body.appendChild(screen);

  return screen;
}

function updateActiveNavigation(screenId) {
  const clean = String(screenId || "").replace(/^#/, "");

  document
    .querySelectorAll(".nav-item, .mob-nav-item")
    .forEach(item => {
      const target = (
        item.dataset.screen ||
        item.dataset.target ||
        item.getAttribute("href") ||
        ""
      ).replace(/^#/, "");

      item.classList.toggle("active", target === clean);
    });
}

function initInitialScreen() {
  const open = () => {
    const hash = window.location.hash.replace(/^#/, "");

    const id =
      hash && document.getElementById(hash)
        ? hash
        : "home-screen";

    showScreen(id);
    updateActiveNavigation(id);
  };

  if (document.readyState === "complete") {
    open();
  } else {
    window.addEventListener("load", open, {
      once: true
    });
  }
}

window.addEventListener("popstate", () => {
  const hash =
    window.location.hash.replace(/^#/, "") ||
    "home-screen";

  showScreen(hash);
  updateActiveNavigation(hash);
});

/* =========================================================
   SITE CONFIG
   ========================================================= */

async function loadSiteConfig() {
  try {
    const data = await apiRequest("/site/config");
    const config = data.config || {};

    document
      .querySelectorAll(".brand-title")
      .forEach(el => {
        if (config.siteName) {
          el.textContent = config.siteName;
        }
      });

    document
      .querySelectorAll(".brand-tagline")
      .forEach(el => {
        if (config.tagline) {
          el.textContent = config.tagline;
        }
      });

    if (config.logo) {
      document
        .querySelectorAll(".logo-box")
        .forEach(el => {
          el.style.backgroundImage =
            `url("${imageUrl(config.logo)}")`;

          el.style.backgroundSize = "cover";
        });
    }
  } catch (error) {
    console.warn(
      "Site config load नहीं हुआ:",
      error.message
    );
  }
}

/* =========================================================
   NEWS LOADING
   ========================================================= */

async function loadHomepageNews() {
  try {
    const [latest, breaking, trending] =
      await Promise.all([
        apiRequest("/news?limit=12&page=1"),
        apiRequest("/news/breaking?limit=8"),
        apiRequest("/news/trending?limit=8")
      ]);

    state.latest =
      latest.news ||
      latest.data ||
      [];

    state.breaking =
      breaking.news ||
      breaking.data ||
      [];

    state.trending =
      trending.news ||
      trending.data ||
      [];

    state.news = state.latest;

    renderHomepage(state.latest);
    renderBreaking(state.breaking);
    renderTrending(state.trending);
  } catch (error) {
    console.warn(
      "News API उपलब्ध नहीं है:",
      error.message
    );

    showToast(
      "समाचार server से connect नहीं हो पाया",
      "warning"
    );
  }
}

async function loadLatestNews() {
  try {
    const data = await apiRequest(
      "/news?limit=50&page=1"
    );

    const list =
      data.news ||
      data.data ||
      [];

    state.latest = list;
    state.news = list;

    renderLatestScreen(list);
  } catch (error) {
    showToast(error.message, "error");
  }
}

async function loadCategoryNews(category) {
  currentCategory = category;

  try {
    const data = await apiRequest(
      `/news/category/${encodeURIComponent(category)}?limit=50&page=1`
    );

    const list =
      data.news ||
      data.data ||
      [];

    state.news = list;

    renderCategoryScreen(
      category,
      list
    );

    showScreen("category-screen");
    updateActiveNavigation("category-screen");
  } catch (error) {
    showToast(error.message, "error");
  }
}

async function loadDistrictNews(district) {
  try {
    const data = await apiRequest(
      `/news/district/${encodeURIComponent(district)}?limit=50&page=1`
    );

    const list =
      data.news ||
      data.data ||
      [];

    state.news = list;

    renderCategoryScreen(
      district,
      list
    );

    showScreen("category-screen");
  } catch (error) {
    showToast(error.message, "error");
  }
}

async function performAPISearch(query) {
  try {
    const data = await apiRequest(
      `/news/search?q=${encodeURIComponent(query)}&limit=50&page=1`
    );

    const list =
      data.news ||
      data.data ||
      [];

    state.news = list;

    renderSearchResults(
      query,
      list
    );

    showScreen("search-screen");
  } catch (error) {
    showToast(error.message, "error");
  }
}
/* =========================================================
   NEWS RENDERING
   ========================================================= */

function renderHomepage(newsList = []) {
  const featured =
    newsList.find(item => item.isFeatured) ||
    newsList[0];

  const remaining = newsList.filter(
    item => item !== featured
  );

  renderFeaturedNews(featured);
  renderLatestSection(remaining.slice(0, 8));

  if (state.trending.length) {
    renderTrending(state.trending);
  }
}

function renderFeaturedNews(news) {
  if (!news) return;

  const selectors = [
    "#featured-news",
    ".featured-news",
    "#hero-news",
    ".hero-news"
  ];

  let container = null;

  for (const selector of selectors) {
    container = document.querySelector(selector);

    if (container) break;
  }

  if (!container) return;

  container.innerHTML = createFeaturedCard(news);
}

function renderLatestSection(newsList = []) {
  const selectors = [
    "#latest-news",
    ".latest-news",
    "#latest-news-list",
    ".latest-news-list"
  ];

  let container = null;

  for (const selector of selectors) {
    container = document.querySelector(selector);

    if (container) break;
  }

  if (!container) return;

  container.innerHTML = newsList.length
    ? newsList.map(createNewsCard).join("")
    : emptyNewsHTML("अभी कोई खबर उपलब्ध नहीं है।");

  bindNewsCards(container);
}

function renderLatestScreen(newsList = []) {
  let container =
    document.querySelector("#latest-screen .news-grid") ||
    document.querySelector("#latest-screen .news-list") ||
    document.querySelector("#latest-screen-content");

  if (!container) {
    const screen = document.getElementById(
      "latest-screen"
    );

    if (!screen) return;

    container = screen.querySelector(
      ".container"
    );

    if (!container) return;

    container.innerHTML = `
      <div class="section-header">
        <h2>ताज़ा खबरें</h2>
      </div>
      <div class="news-grid" id="latest-screen-content"></div>
    `;

    container =
      document.querySelector(
        "#latest-screen-content"
      );
  }

  container.innerHTML = newsList.length
    ? newsList.map(createNewsCard).join("")
    : emptyNewsHTML(
        "अभी कोई ताज़ा खबर उपलब्ध नहीं है।"
      );

  bindNewsCards(container);
}

function renderCategoryScreen(
  category,
  newsList = []
) {
  const screen =
    document.getElementById("category-screen");

  if (!screen) return;

  let container =
    screen.querySelector(".category-content");

  if (!container) {
    const wrapper =
      screen.querySelector(".container") ||
      screen;

    wrapper.innerHTML = `
      <div class="section-header">
        <h2 class="category-title"></h2>
      </div>

      <div
        class="news-grid category-content"
      ></div>
    `;

    container =
      screen.querySelector(".category-content");
  }

  const title =
    screen.querySelector(".category-title");

  if (title) {
    title.textContent = category;
  }

  container.innerHTML = newsList.length
    ? newsList.map(createNewsCard).join("")
    : emptyNewsHTML(
        `${escapeHTML(category)} में अभी कोई खबर उपलब्ध नहीं है।`
      );

  bindNewsCards(container);
}

function renderTrending(newsList = []) {
  const containers = [
    document.querySelector("#trending-news"),
    document.querySelector(".trending-news"),
    document.querySelector("#trending-list")
  ].filter(Boolean);

  containers.forEach(container => {
    container.innerHTML = newsList.length
      ? newsList
          .slice(0, 10)
          .map(
            (news, index) =>
              createTrendingCard(news, index + 1)
          )
          .join("")
      : emptyNewsHTML(
          "अभी Trending News उपलब्ध नहीं है।"
        );

    bindNewsCards(container);
  });
}

function renderBreaking(newsList = []) {
  const containers = [
    document.querySelector("#breaking-news"),
    document.querySelector(".breaking-news-list"),
    document.querySelector("#breaking-list")
  ].filter(Boolean);

  containers.forEach(container => {
    container.innerHTML = newsList.length
      ? newsList
          .map(
            news =>
              `<span class="breaking-item"
                 data-news-id="${escapeHTML(newsId(news))}">
                 ${escapeHTML(news.title)}
               </span>`
          )
          .join("")
      : `<span class="breaking-item">
           अभी कोई Breaking News नहीं है
         </span>`;

    container
      .querySelectorAll("[data-news-id]")
      .forEach(item => {
        item.addEventListener("click", () => {
          openNews(item.dataset.newsId);
        });
      });
  });
}

/* =========================================================
   NEWS CARD HTML
   ========================================================= */

function createFeaturedCard(news) {
  const id = newsId(news);

  return `
    <article
      class="featured-card news-card"
      data-news-id="${escapeHTML(id)}"
      tabindex="0"
    >
      <div class="news-image-wrapper">
        <img
          class="news-image"
          src="${escapeHTML(imageUrl(news.image))}"
          alt="${escapeHTML(news.title)}"
          loading="lazy"
          onerror="this.src='https://picsum.photos/900/500?random=202'"
        />

        ${
          news.isBreaking
            ? `<span class="news-badge breaking-badge">
                 BREAKING
               </span>`
            : ""
        }
      </div>

      <div class="news-card-body">
        <div class="news-meta">
          <span>${escapeHTML(news.category || "राजस्थान")}</span>
          <span>${relativeTime(news.publishedAt)}</span>
        </div>

        <h2>
          ${escapeHTML(news.title)}
        </h2>

        ${
          news.summary
            ? `<p>${escapeHTML(news.summary)}</p>`
            : ""
        }
      </div>
    </article>
  `;
}

function createNewsCard(news) {
  const id = newsId(news);

  return `
    <article
      class="news-card"
      data-news-id="${escapeHTML(id)}"
      tabindex="0"
    >
      <div class="news-image-wrapper">
        <img
          src="${escapeHTML(imageUrl(news.image))}"
          alt="${escapeHTML(news.title)}"
          loading="lazy"
          onerror="this.src='https://picsum.photos/600/350?random=203'"
        />

        ${
          news.isBreaking
            ? `<span class="news-badge breaking-badge">
                 BREAKING
               </span>`
            : ""
        }

        ${
          news.isFeatured
            ? `<span class="news-badge featured-badge">
                 FEATURED
               </span>`
            : ""
        }
      </div>

      <div class="news-card-body">
        <div class="news-meta">
          <span>
            ${escapeHTML(
              news.category || "राजस्थान"
            )}
          </span>

          ${
            news.district
              ? `<span>
                   ${escapeHTML(news.district)}
                 </span>`
              : ""
          }
        </div>

        <h3>
          ${escapeHTML(news.title)}
        </h3>

        ${
          news.summary
            ? `<p>
                 ${escapeHTML(news.summary)}
               </p>`
            : ""
        }

        <div class="news-footer">
          <span>
            ${relativeTime(news.publishedAt)}
          </span>

          <span>
            👁 ${Number(news.views || 0)}
          </span>
        </div>
      </div>
    </article>
  `;
}

function createTrendingCard(news, number) {
  const id = newsId(news);

  return `
    <article
      class="trending-card news-card"
      data-news-id="${escapeHTML(id)}"
      tabindex="0"
    >
      <div class="trending-number">
        ${number}
      </div>

      <div class="trending-image">
        <img
          src="${escapeHTML(imageUrl(news.image))}"
          alt="${escapeHTML(news.title)}"
          loading="lazy"
          onerror="this.src='https://picsum.photos/300/200?random=204'"
        />
      </div>

      <div class="trending-content">
        <span class="news-category">
          ${escapeHTML(
            news.category || "राजस्थान"
          )}
        </span>

        <h3>
          ${escapeHTML(news.title)}
        </h3>

        <small>
          ${relativeTime(news.publishedAt)}
        </small>
      </div>
    </article>
  `;
}

function emptyNewsHTML(message) {
  return `
    <div class="empty-news">
      <div class="empty-news-icon">📰</div>
      <p>${message}</p>
    </div>
  `;
}

function bindNewsCards(container = document) {
  container
    .querySelectorAll("[data-news-id]")
    .forEach(card => {
      if (card.dataset.bound === "true") {
        return;
      }

      card.dataset.bound = "true";

      card.addEventListener("click", event => {
        if (
          event.target.closest("button") ||
          event.target.closest("a")
        ) {
          return;
        }

        openNews(card.dataset.newsId);
      });

      card.addEventListener("keydown", event => {
        if (
          event.key === "Enter" ||
          event.key === " "
        ) {
          event.preventDefault();

          openNews(card.dataset.newsId);
        }
      });
    });
}

/* =========================================================
   NEWS DETAIL
   ========================================================= */

async function openNews(id) {
  if (!id) return;

  try {
    showLoading();

    const data = await apiRequest(
      `/news/${encodeURIComponent(id)}`
    );

    currentNews =
      data.news ||
      data.data ||
      null;

    if (!currentNews) {
      throw new Error("News नहीं मिली");
    }

    renderNewsDetail(currentNews);

    showScreen("detail-screen");

    updateActiveNavigation("detail-screen");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  } catch (error) {
    showToast(
      error.message || "News load नहीं हो पाई",
      "error"
    );
  } finally {
    hideLoading();
  }
}

function renderNewsDetail(news) {
  let screen =
    document.getElementById("detail-screen");

  if (!screen) {
    screen = createDynamicScreen(
      "detail-screen"
    );
  }

  let container =
    screen.querySelector(".detail-content");

  if (!container) {
    const wrapper =
      screen.querySelector(".container") ||
      screen;

    wrapper.innerHTML = `
      <div
        class="detail-content"
        id="detail-content"
      ></div>
    `;

    container =
      screen.querySelector(".detail-content");
  }

  container.innerHTML = `
    <article class="news-detail">

      <button
        class="back-button"
        type="button"
        onclick="history.back()"
      >
        ← वापस
      </button>

      ${
        news.isBreaking
          ? `<div class="detail-breaking">
               🔴 BREAKING NEWS
             </div>`
          : ""
      }

      <div class="detail-category">
        ${escapeHTML(
          news.category || "राजस्थान"
        )}
      </div>

      <h1 class="detail-title">
        ${escapeHTML(news.title)}
      </h1>

      <div class="detail-meta">
        <span>
          ${escapeHTML(
            news.author ||
              "आवाज राजस्थान ब्यूरो"
          )}
        </span>

        <span>
          ${formatDate(
            news.publishedAt
          )}
        </span>

        <span>
          👁 ${Number(news.views || 0)}
        </span>
      </div>

      ${
        news.image
          ? `<img
               class="detail-image"
               src="${escapeHTML(
                 imageUrl(news.image)
               )}"
               alt="${escapeHTML(news.title)}"
               onerror="this.style.display='none'"
             />`
          : ""
      }

      ${
        news.summary
          ? `<div class="detail-summary">
               ${escapeHTML(news.summary)}
             </div>`
          : ""
      }

      <div class="detail-body">
        ${formatNewsContent(news.content)}
      </div>

      ${
        news.location || news.district
          ? `<div class="detail-location">
               📍
               ${escapeHTML(
                 news.location ||
                   news.district ||
                   ""
               )}
             </div>`
          : ""
      }

      ${
        Array.isArray(news.tags) &&
        news.tags.length
          ? `
            <div class="news-tags">
              ${news.tags
                .map(
                  tag =>
                    `<span>
                       #${escapeHTML(tag)}
                     </span>`
                )
                .join("")}
            </div>
          `
          : ""
      }

      <div class="detail-actions">

        <button
          type="button"
          class="share-btn whatsapp"
          data-share="whatsapp"
        >
          WhatsApp
        </button>

        <button
          type="button"
          class="share-btn facebook"
          data-share="facebook"
        >
          Facebook
        </button>

        <button
          type="button"
          class="share-btn twitter"
          data-share="twitter"
        >
          X
        </button>

        <button
          type="button"
          class="share-btn copy"
          data-share="copy"
        >
          Link Copy
        </button>

      </div>

    </article>
  `;

  container
    .querySelectorAll("[data-share]")
    .forEach(button => {
      button.addEventListener(
        "click",
        () => {
          shareNews(
            news,
            button.dataset.share
          );
        }
      );
    });
}

function formatNewsContent(content = "") {
  if (!content) {
    return "<p>इस खबर की जानकारी उपलब्ध नहीं है।</p>";
  }

  /*
   * अगर backend HTML भेज रहा है तो उसे 그대로
   * render किया जा सकता है।
   *
   * Plain text होने पर line breaks को paragraph में
   * बदला जाएगा।
   */

  if (
    /<\/?(p|br|strong|b|em|i|ul|ol|li|h[1-6])\b/i.test(
      content
    )
  ) {
    return content;
  }

  return String(content)
    .split(/\n+/)
    .map(
      paragraph =>
        `<p>${escapeHTML(
          paragraph.trim()
        )}</p>`
    )
    .join("");
}

/* =========================================================
   SEARCH
   ========================================================= */

function initSearch() {
  const inputs = document.querySelectorAll(
    'input[type="search"], .search-input, #searchInput'
  );

  inputs.forEach(input => {
    input.addEventListener("input", () => {
      const query = input.value.trim();

      clearTimeout(searchTimer);

      if (!query) {
        closeSearchResults();
        return;
      }

      searchTimer = setTimeout(() => {
        performAPISearch(query);
      }, 450);
    });

    input.addEventListener("keydown", event => {
      if (event.key === "Enter") {
        event.preventDefault();

        const query = input.value.trim();

        if (query) {
          performAPISearch(query);
        }
      }

      if (event.key === "Escape") {
        input.value = "";
        closeSearchResults();
      }
    });
  });

  document
    .querySelectorAll(
      ".search-button, #searchButton"
    )
    .forEach(button => {
      button.addEventListener("click", () => {
        const input =
          document.querySelector(
            ".search-input"
          ) ||
          document.querySelector(
            "#searchInput"
          );

        const query =
          input?.value.trim() || "";

        if (query) {
          performAPISearch(query);
        }
      });
    });
}

function renderSearchResults(
  query,
  newsList = []
) {
  let screen =
    document.getElementById(
      "search-screen"
    );

  if (!screen) {
    screen = createDynamicScreen(
      "search-screen"
    );
  }

  let container =
    screen.querySelector(".search-content");

  if (!container) {
    const wrapper =
      screen.querySelector(".container") ||
      screen;

    wrapper.innerHTML = `
      <div class="section-header">
        <h2>
          Search Results
        </h2>

        <p class="search-query"></p>
      </div>

      <div
        class="news-grid search-content"
      ></div>
    `;

    container =
      screen.querySelector(
        ".search-content"
      );
  }

  const queryText =
    screen.querySelector(
      ".search-query"
    );

  if (queryText) {
    queryText.textContent =
      `"${query}" के लिए परिणाम`;
  }

  container.innerHTML = newsList.length
    ? newsList
        .map(createNewsCard)
        .join("")
    : emptyNewsHTML(
        `"${escapeHTML(query)}" के लिए कोई खबर नहीं मिली।`
      );

  bindNewsCards(container);
}

function closeSearchResults() {
  const screen =
    document.getElementById(
      "search-screen"
    );

  if (screen) {
    screen.classList.remove(
      "active-screen"
    );
  }
}

/* =========================================================
   CATEGORY BUTTONS
   ========================================================= */

document.addEventListener("click", event => {
  const categoryButton =
    event.target.closest(
      "[data-category]"
    );

  if (categoryButton) {
    event.preventDefault();

    const category =
      categoryButton.dataset.category;

    if (category) {
      loadCategoryNews(category);
    }
  }

  const districtButton =
    event.target.closest(
      "[data-district]"
    );

  if (districtButton) {
    event.preventDefault();

    const district =
      districtButton.dataset.district;

    if (district) {
      loadDistrictNews(district);
    }
  }
});

/* =========================================================
   COMMON GLOBAL NEWS FUNCTIONS
   ========================================================= */

window.openNews = openNews;
window.loadCategoryNews = loadCategoryNews;
window.loadDistrictNews = loadDistrictNews;
window.performAPISearch = performAPISearch;
window.showScreen = showScreen;

/* =========================================================
   LOADING INDICATOR
   ========================================================= */

function showLoading() {
  let loader =
    document.getElementById(
      "global-loader"
    );

  if (!loader) {
    loader = document.createElement("div");

    loader.id = "global-loader";

    loader.innerHTML = `
      <div class="loader-spinner"></div>
      <span>लोड हो रहा है...</span>
    `;

    loader.style.cssText = `
      position: fixed;
      inset: 0;
      z-index: 99999;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      background: rgba(255,255,255,.85);
      backdrop-filter: blur(4px);
      font-weight: 600;
    `;

    document.body.appendChild(loader);
  }

  loader.style.display = "flex";
}

function hideLoading() {
  const loader =
    document.getElementById(
      "global-loader"
    );

  if (loader) {
    loader.style.display = "none";
  }
}

/* =========================================================
   TOAST
   ========================================================= */

function showToast(
  message,
  type = "info"
) {
  let toastContainer =
    document.getElementById(
      "toast-container"
    );

  if (!toastContainer) {
    toastContainer =
      document.createElement("div");

    toastContainer.id =
      "toast-container";

    toastContainer.style.cssText = `
      position: fixed;
      right: 20px;
      bottom: 20px;
      z-index: 100000;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 360px;
    `;

    document.body.appendChild(
      toastContainer
    );
  }

  const toast =
    document.createElement("div");

  toast.className =
    `toast toast-${type}`;

  toast.textContent = message;

  toast.style.cssText = `
    padding: 13px 17px;
    border-radius: 8px;
    background: #222;
    color: #fff;
    box-shadow: 0 5px 25px rgba(0,0,0,.2);
    font-size: 14px;
    line-height: 1.4;
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform =
      "translateY(10px)";
    toast.style.transition =
      "all .3s ease";

    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}

window.showToast = showToast;
/* =========================================================
   LOGIN / AUTHENTICATION
   ========================================================= */

function initLogin() {
  const loginButtons = document.querySelectorAll(
    ".login-btn, #loginButton, [data-action='login']"
  );

  loginButtons.forEach(button => {
    button.addEventListener("click", event => {
      event.preventDefault();

      if (state.user) {
        showUserMenu();
      } else {
        openLoginModal();
      }
    });
  });

  const logoutButtons = document.querySelectorAll(
    ".logout-btn, #logoutButton, [data-action='logout']"
  );

  logoutButtons.forEach(button => {
    button.addEventListener("click", event => {
      event.preventDefault();
      logoutUser();
    });
  });

  document.addEventListener("submit", event => {
    const form = event.target;

    if (
      form.matches("#loginForm") ||
      form.matches(".login-form")
    ) {
      event.preventDefault();
      loginUser(form);
    }

    if (
      form.matches("#registerForm") ||
      form.matches(".register-form")
    ) {
      event.preventDefault();
      registerUser(form);
    }
  });
}

function openLoginModal() {
  let modal =
    document.getElementById("loginModal");

  if (!modal) {
    modal = document.createElement("div");

    modal.id = "loginModal";

    modal.innerHTML = `
      <div class="login-overlay">
        <div class="login-box">

          <button
            type="button"
            class="login-close"
            aria-label="Close"
          >
            ×
          </button>

          <h2>Login</h2>

          <p>
            आवाज राजस्थान में login करें
          </p>

          <form id="loginForm">

            <label>
              Email
              <input
                type="email"
                name="email"
                placeholder="Email address"
                required
                autocomplete="email"
              />
            </label>

            <label>
              Password
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
                autocomplete="current-password"
              />
            </label>

            <button
              type="submit"
              class="login-submit"
            >
              Login
            </button>

          </form>

          <div class="login-message"></div>

        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const closeButton =
      modal.querySelector(
        ".login-close"
      );

    closeButton.addEventListener(
      "click",
      closeLoginModal
    );

    modal
      .querySelector(".login-overlay")
      .addEventListener("click", event => {
        if (
          event.target.classList.contains(
            "login-overlay"
          )
        ) {
          closeLoginModal();
        }
      });
  }

  modal.style.display = "block";

  setTimeout(() => {
    modal.classList.add("show");
  }, 10);
}

function closeLoginModal() {
  const modal =
    document.getElementById(
      "loginModal"
    );

  if (!modal) return;

  modal.classList.remove("show");

  setTimeout(() => {
    modal.style.display = "none";
  }, 200);
}

async function loginUser(form) {
  const formData =
    new FormData(form);

  const email =
    String(
      formData.get("email") || ""
    ).trim();

  const password =
    String(
      formData.get("password") || ""
    );

  if (!email || !password) {
    showToast(
      "Email और password डालें।",
      "warning"
    );

    return;
  }

  const submitButton =
    form.querySelector(
      'button[type="submit"]'
    );

  const originalText =
    submitButton?.textContent ||
    "Login";

  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent =
      "Login हो रहा है...";
  }

  try {
    const data = await apiRequest(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify({
          email,
          password
        })
      }
    );

    if (!data.token) {
      throw new Error(
        "Server ने authentication token नहीं दिया।"
      );
    }

    localStorage.setItem(
      "aawaz_token",
      data.token
    );

    if (data.user) {
      localStorage.setItem(
        "aawaz_user",
        JSON.stringify(data.user)
      );

      state.user = data.user;
    }

    closeLoginModal();
    updateLoginUI();

    showToast(
      data.message ||
        "Login सफल रहा।",
      "success"
    );
  } catch (error) {
    showToast(
      error.message ||
        "Login failed",
      "error"
    );
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent =
        originalText;
    }
  }
}

async function registerUser(form) {
  const formData =
    new FormData(form);

  const name =
    String(
      formData.get("name") || ""
    ).trim();

  const email =
    String(
      formData.get("email") || ""
    ).trim();

  const password =
    String(
      formData.get("password") || ""
    );

  if (!name || !email || !password) {
    showToast(
      "सभी जरूरी fields भरें।",
      "warning"
    );

    return;
  }

  try {
    const data = await apiRequest(
      "/auth/register",
      {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          password
        })
      }
    );

    showToast(
      data.message ||
        "Registration सफल रहा। अब login करें।",
      "success"
    );

    form.reset();

    closeLoginModal();

    setTimeout(() => {
      openLoginModal();
    }, 300);
  } catch (error) {
    showToast(
      error.message ||
        "Registration failed",
      "error"
    );
  }
}

async function restoreLogin() {
  const token =
    localStorage.getItem(
      "aawaz_token"
    );

  if (!token) {
    state.user = null;
    updateLoginUI();
    return;
  }

  try {
    const data =
      await apiRequest(
        "/auth/me"
      );

    state.user =
      data.user || null;

    if (state.user) {
      localStorage.setItem(
        "aawaz_user",
        JSON.stringify(
          state.user
        )
      );
    }

    updateLoginUI();
  } catch (error) {
    localStorage.removeItem(
      "aawaz_token"
    );

    localStorage.removeItem(
      "aawaz_user"
    );

    state.user = null;

    updateLoginUI();

    console.warn(
      "Login restore failed:",
      error.message
    );
  }
}

function logoutUser() {
  localStorage.removeItem(
    "aawaz_token"
  );

  localStorage.removeItem(
    "aawaz_user"
  );

  state.user = null;

  updateLoginUI();

  showToast(
    "आप logout हो गए हैं।",
    "success"
  );
}

function updateLoginUI() {
  const buttons =
    document.querySelectorAll(
      ".login-btn, #loginButton, [data-action='login']"
    );

  buttons.forEach(button => {
    if (state.user) {
      button.textContent =
        state.user.name ||
        "Account";

      button.dataset.loggedIn =
        "true";
    } else {
      button.textContent =
        "Login";

      button.dataset.loggedIn =
        "false";
    }
  });
}

function showUserMenu() {
  if (!state.user) {
    openLoginModal();
    return;
  }

  const existing =
    document.getElementById(
      "userMenu"
    );

  if (existing) {
    existing.remove();
    return;
  }

  const menu =
    document.createElement("div");

  menu.id = "userMenu";

  menu.innerHTML = `
    <div class="user-menu-inner">

      <strong>
        ${escapeHTML(
          state.user.name || "User"
        )}
      </strong>

      <small>
        ${escapeHTML(
          state.user.email || ""
        )}
      </small>

      <span>
        Role:
        ${escapeHTML(
          state.user.role || "user"
        )}
      </span>

      <button
        type="button"
        class="logout-btn"
      >
        Logout
      </button>

    </div>
  `;

  document.body.appendChild(menu);

  menu
    .querySelector(".logout-btn")
    .addEventListener(
      "click",
      logoutUser
    );
}

/* =========================================================
   CONTACT FORM
   ========================================================= */

function initForms() {
  document.addEventListener(
    "submit",
    event => {
      const form =
        event.target;

      if (
        form.id === "contactForm" ||
        form.classList.contains(
          "contact-form"
        )
      ) {
        event.preventDefault();

        submitContactForm(form);
      }
    }
  );
}

function initContactScreen() {
  const form =
    document.querySelector(
      "#contactForm"
    );

  if (!form) return;

  if (form.dataset.initialized) {
    return;
  }

  form.dataset.initialized =
    "true";

  form.addEventListener(
    "submit",
    event => {
      event.preventDefault();

      submitContactForm(form);
    }
  );
}

async function submitContactForm(form) {
  const formData =
    new FormData(form);

  const payload = {
    name: String(
      formData.get("name") || ""
    ).trim(),

    email: String(
      formData.get("email") || ""
    ).trim(),

    mobile: String(
      formData.get("mobile") ||
      formData.get("phone") ||
      ""
    ).trim(),

    subject: String(
      formData.get("subject") || ""
    ).trim(),

    message: String(
      formData.get("message") || ""
    ).trim()
  };

  if (
    !payload.name ||
    !payload.email ||
    !payload.message
  ) {
    showToast(
      "नाम, Email और Message जरूरी हैं।",
      "warning"
    );

    return;
  }

  const submitButton =
    form.querySelector(
      'button[type="submit"]'
    );

  const originalText =
    submitButton?.textContent ||
    "Send";

  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent =
      "भेजा जा रहा है...";
  }

  try {
    const data =
      await apiRequest(
        "/contact",
        {
          method: "POST",
          body: JSON.stringify(
            payload
          )
        }
      );

    showToast(
      data.message ||
        "आपका message successfully भेज दिया गया है।",
      "success"
    );

    form.reset();
  } catch (error) {
    showToast(
      error.message ||
        "Message भेजने में समस्या हुई।",
      "error"
    );
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent =
        originalText;
    }
  }
}

/* =========================================================
   LIVE TV
   ========================================================= */

function initLiveTV() {
  document
    .querySelectorAll(
      ".live-tv-btn, #liveTVButton, [data-action='live-tv']"
    )
    .forEach(button => {
      button.addEventListener(
        "click",
        event => {
          event.preventDefault();

          showScreen(
            "live-screen"
          );

          loadLiveTV();
        }
      );
    });
}

async function loadLiveTV() {
  let screen =
    document.getElementById(
      "live-screen"
    );

  if (!screen) {
    screen = createDynamicScreen(
      "live-screen"
    );
  }

  let container =
    screen.querySelector(
      ".live-tv-content"
    );

  if (!container) {
    const wrapper =
      screen.querySelector(
        ".container"
      ) || screen;

    wrapper.innerHTML = `
      <div class="live-tv-content"></div>
    `;

    container =
      screen.querySelector(
        ".live-tv-content"
      );
  }

  container.innerHTML = `
    <div class="loading-box">
      Live TV load हो रहा है...
    </div>
  `;

  try {
    const data =
      await apiRequest(
        "/site/live-tv"
      );

    const liveTV =
      data.liveTV || {};

    if (!liveTV.enabled) {
      container.innerHTML = `
        <div class="live-offline">
          <h2>आवाज राजस्थान LIVE</h2>
          <p>
            Live TV अभी उपलब्ध नहीं है।
          </p>
        </div>
      `;

      return;
    }

    let videoHTML = "";

    if (liveTV.streamUrl) {
      videoHTML = `
        <video
          controls
          autoplay
          playsinline
          class="live-video"
          src="${escapeHTML(
            liveTV.streamUrl
          )}"
        ></video>
      `;
    } else if (liveTV.youtubeUrl) {
      const youtubeId =
        getYouTubeId(
          liveTV.youtubeUrl
        );

      if (youtubeId) {
        videoHTML = `
          <div class="live-video-wrapper">
            <iframe
              src="https://www.youtube.com/embed/${escapeHTML(
                youtubeId
              )}?autoplay=1"
              title="Awaaz Rajasthan Live TV"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowfullscreen
            ></iframe>
          </div>
        `;
      }
    }

    if (!videoHTML) {
      videoHTML = `
        <div class="live-offline">
          <h2>Live TV</h2>
          <p>
            Live stream अभी configure नहीं की गई है।
          </p>
        </div>
      `;
    }

    container.innerHTML = `
      <div class="live-tv-header">
        <span class="live-dot"></span>

        <h1>
          ${escapeHTML(
            liveTV.title ||
              "आवाज राजस्थान LIVE"
          )}
        </h1>

        <span class="live-status">
          ${escapeHTML(
            liveTV.status ||
              "LIVE"
          )}
        </span>
      </div>

      ${videoHTML}

      ${
        liveTV.thumbnail
          ? `<img
               class="live-thumbnail"
               src="${escapeHTML(
                 imageUrl(
                   liveTV.thumbnail
                 )
               )}"
               alt="Live TV"
             />`
          : ""
      }
    `;
  } catch (error) {
    container.innerHTML = `
      <div class="error-box">
        <h2>Live TV load नहीं हो पाया</h2>
        <p>
          ${escapeHTML(
            error.message
          )}
        </p>
      </div>
    `;
  }
}

/* =========================================================
   E-PAPER
   ========================================================= */

function initEPaper() {
  document
    .querySelectorAll(
      ".epaper-btn, #epaperButton, [data-action='epaper']"
    )
    .forEach(button => {
      button.addEventListener(
        "click",
        event => {
          event.preventDefault();

          showScreen(
            "epaper-screen"
          );

          loadEPaper();
        }
      );
    });
}

async function loadEPaper() {
  let screen =
    document.getElementById(
      "epaper-screen"
    );

  if (!screen) {
    screen =
      createDynamicScreen(
        "epaper-screen"
      );
  }

  let container =
    screen.querySelector(
      ".epaper-content"
    );

  if (!container) {
    const wrapper =
      screen.querySelector(
        ".container"
      ) || screen;

    wrapper.innerHTML = `
      <div class="epaper-content"></div>
    `;

    container =
      screen.querySelector(
        ".epaper-content"
      );
  }

  container.innerHTML = `
    <div class="loading-box">
      E-Paper load हो रहा है...
    </div>
  `;

  try {
    const data =
      await apiRequest(
        "/site/epaper"
      );

    const epaper =
      data.epaper || {};

    if (!epaper.enabled) {
      container.innerHTML = `
        <div class="epaper-unavailable">
          <h2>
            आवाज राजस्थान E-Paper
          </h2>

          <p>
            आज का E-Paper अभी उपलब्ध नहीं है।
          </p>
        </div>
      `;

      return;
    }

    container.innerHTML = `
      <div class="epaper-header">
        <h1>
          ${escapeHTML(
            epaper.title ||
              "आवाज राजस्थान E-Paper"
          )}
        </h1>

        <p>
          ${escapeHTML(
            epaper.date || ""
          )}
        </p>
      </div>

      ${
        epaper.thumbnail
          ? `
            <div class="epaper-preview">
              <img
                src="${escapeHTML(
                  imageUrl(
                    epaper.thumbnail
                  )
                )}"
                alt="E-Paper"
              />
            </div>
          `
          : ""
      }

      <div class="epaper-actions">

        ${
          epaper.pdfUrl
            ? `
              <a
                href="${escapeHTML(
                  epaper.pdfUrl
                )}"
                target="_blank"
                rel="noopener"
                class="epaper-view-btn"
              >
                📖 E-Paper पढ़ें
              </a>
            `
            : ""
        }

        ${
          epaper.pdfUrl &&
          epaper.downloadEnabled
            ? `
              <a
                href="${escapeHTML(
                  epaper.pdfUrl
                )}"
                download
                class="epaper-download-btn"
              >
                ⬇ Download PDF
              </a>
            `
            : ""
        }

      </div>
    `;
  } catch (error) {
    container.innerHTML = `
      <div class="error-box">
        <h2>
          E-Paper load नहीं हो पाया
        </h2>

        <p>
          ${escapeHTML(
            error.message
          )}
        </p>
      </div>
    `;
  }
}

/* =========================================================
   YOUTUBE HELPER
   ========================================================= */

function getYouTubeId(url = "") {
  try {
    const parsed =
      new URL(url);

    if (
      parsed.hostname.includes(
        "youtu.be"
      )
    ) {
      return parsed.pathname
        .replace("/", "")
        .split("?")[0];
    }

    if (
      parsed.hostname.includes(
        "youtube.com"
      )
    ) {
      return (
        parsed.searchParams.get(
          "v"
        ) ||
        parsed.pathname
          .split("/")
          .pop()
      );
    }
  } catch (_) {
    return "";
  }

  return "";
}

/* =========================================================
   VIDEO NEWS
   ========================================================= */

async function loadVideoScreen() {
  let screen =
    document.getElementById(
      "video-screen"
    );

  if (!screen) {
    screen =
      createDynamicScreen(
        "video-screen"
      );
  }

  let container =
    screen.querySelector(
      ".video-content"
    );

  if (!container) {
    const wrapper =
      screen.querySelector(
        ".container"
      ) || screen;

    wrapper.innerHTML = `
      <div class="section-header">
        <h1>Video News</h1>
      </div>

      <div class="video-content"></div>
    `;

    container =
      screen.querySelector(
        ".video-content"
      );
  }

  try {
    const data =
      await apiRequest(
        "/news?limit=50&page=1"
      );

    const newsList =
      data.news ||
      data.data ||
      [];

    const videos =
      newsList.filter(
        news =>
          news.video ||
          news.videoUrl ||
          news.youtubeUrl ||
          news.youtube
      );

    if (!videos.length) {
      container.innerHTML =
        emptyNewsHTML(
          "अभी Video News उपलब्ध नहीं है।"
        );

      return;
    }

    container.innerHTML =
      videos
        .map(createVideoCard)
        .join("");

    container
      .querySelectorAll(
        "[data-news-id]"
      )
      .forEach(card => {
        card.addEventListener(
          "click",
          () => {
            openNews(
              card.dataset.newsId
            );
          }
        );
      });
  } catch (error) {
    container.innerHTML = `
      <div class="error-box">
        ${escapeHTML(
          error.message
        )}
      </div>
    `;
  }
}

function createVideoCard(news) {
  return `
    <article
      class="video-card news-card"
      data-news-id="${escapeHTML(
        newsId(news)
      )}"
    >
      <div class="video-thumbnail">

        <img
          src="${escapeHTML(
            imageUrl(
              news.image
            )
          )}"
          alt="${escapeHTML(
            news.title
          )}"
          loading="lazy"
        />

        <span class="play-icon">
          ▶
        </span>

      </div>

      <div class="video-info">
        <span>
          ${escapeHTML(
            news.category ||
              "राजस्थान"
          )}
        </span>

        <h3>
          ${escapeHTML(
            news.title
          )}
        </h3>

        <small>
          ${relativeTime(
            news.publishedAt
          )}
        </small>
      </div>
    </article>
  `;
}

/*
=========================================================
   SOCIAL SHARING
   ========================================================= */
function initSocialSharing() {
  document.addEventListener(
    "click",
    event => {
      const button =
        event.target.closest(
          "[data-share]"
        );

      if (!button) return;

      if (!currentNews) {
        return;
      }

      shareNews(
        currentNews,
        button.dataset.share
      );
    }
  );
}

async function shareNews(
  news,
  platform
) {
  const id =
    newsId(news);

  const url =
    `${window.location.origin}${window.location.pathname}#detail-screen/${id}`;

  const title =
    news.title ||
    "आवाज राजस्थान";

  const encodedUrl =
    encodeURIComponent(url);

  const encodedTitle =
    encodeURIComponent(title);

  if (
    platform === "whatsapp"
  ) {
    window.open(
      `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      "_blank"
    );

    return;
  }

  if (
    platform === "facebook"
  ) {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      "_blank",
      "width=700,height=500"
    );

    return;
  }

  if (
    platform === "twitter" ||
    platform === "x"
  ) {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      "_blank",
      "width=700,height=500"
    );

    return;
  }

  if (
    platform === "copy"
  ) {
    try {
      await navigator.clipboard.writeText(
        url
      );

      showToast(
        "News link copy हो गया।",
        "success"
      );
    } catch (_) {
      showToast(
        "Link copy नहीं हो पाया।",
        "error"
      );
    }

    return;
  }

  if (
    navigator.share
  ) {
    try {
      await navigator.share({
        title,
        text: title,
        url
      });
    } catch (_) {
      // User cancelled share.
    }
  }
}

/* =========================================================
   MOBILE NAVIGATION
   ========================================================= */

function initMobileNavigation() {
  const toggle =
    document.querySelector(
      ".menu-toggle"
    ) ||
    document.querySelector(
      "#menuToggle"
    ) ||
    document.querySelector(
      ".hamburger"
    );

  const menu =
    document.querySelector(
      ".mobile-menu"
    ) ||
    document.querySelector(
      "#mobileMenu"
    ) ||
    document.querySelector(
      ".mobile-nav"
    );

  if (!toggle || !menu) {
    return;
  }

  toggle.addEventListener(
    "click",
    () => {
      menu.classList.toggle(
        "open"
      );

      toggle.classList.toggle(
        "active"
      );
    }
  );

  menu
    .querySelectorAll(
      "a, button"
    )
    .forEach(item => {
      item.addEventListener(
        "click",
        () => {
          menu.classList.remove(
            "open"
          );

          toggle.classList.remove(
            "active"
          );
        }
      );
    });
}

/* =========================================================
   GENERAL BUTTONS
   ========================================================= */

       function initGeneralButtons() {
  document.addEventListener(
    "click",
    event => {
      const button =
        event.target.closest(
          "[data-screen]"
        );

      if (
        !button ||
        button.closest(
          ".nav-item, .mob-nav-item"
        )
      ) {
        return;
      }

      const target =
        button.dataset.screen;

      if (!target) return;

      event.preventDefault();

      showScreen(target);
      updateActiveNavigation(
        target
      );
    }
  );

  document
    .querySelectorAll(
      "[data-action='home']"
    )
    .forEach(button => {
      button.addEventListener(
        "click",
        () => {
          showScreen(
            "home-screen"
          );
        }
      );
    });
}

/* =========================================================
   KEYBOARD SHORTCUTS
   ========================================================= */

function initKeyboardShortcuts() {
  document.addEventListener(
    "keydown",
    event => {
      if (
        event.key === "/" &&
        !isTypingElement(
          event.target
        )
      ) {
        event.preventDefault();

        const input =
          document.querySelector(
            ".search-input"
          ) ||
          document.querySelector(
            "#searchInput"
          );

        if (input) {
          input.focus();
        }
      }

      if (
        event.key === "Escape"
      ) {
        closeLoginModal();
      }
    }
  );
}

function isTypingElement(
  element
) {
  if (!element) return false;

  const tag =
    element.tagName?.toLowerCase();

  return (
    tag === "input" ||
    tag === "textarea" ||
    tag === "select" ||
    element.isContentEditable
  );
}

/* =========================================================
   YEAR
   ========================================================= */

function setCurrentYear() {
  const year =
    new Date().getFullYear();

  document
    .querySelectorAll(
      ".current-year, #currentYear, .footer-year"
    )
    .forEach(element => {
      element.textContent =
        year;
    });
}

/* =========================================================
   GLOBAL ERROR HANDLING
   ========================================================= */

window.addEventListener(
  "online",
  () => {
    showToast(
      "Internet connection वापस आ गया।",
      "success"
    );

    loadHomepageNews();
  }
);

window.addEventListener(
  "offline",
  () => {
    showToast(
      "Internet connection नहीं है।",
      "warning"
    );
  }
);

/* =========================================================
   GLOBAL FUNCTIONS
   ========================================================= */

window.loginUser = loginUser;
window.logoutUser = logoutUser;
window.openLoginModal =
  openLoginModal;
window.closeLoginModal =
  closeLoginModal;
window.loadLiveTV =
  loadLiveTV;
window.loadEPaper =
  loadEPaper;
window.loadLatestNews =
  loadLatestNews;
window.shareNews =
  shareNews;

/* =========================================================
   INITIAL API CONNECTION CHECK
   ========================================================= */

async function checkBackendConnection() {
  try {
    await apiRequest(
      "/../health"
    );

    return true;
  } catch (_) {
    return false;
  }
}

console.log(
  "📰 Awaaz Rajasthan frontend initialized"
);

console.log(
  "🔗 API:",
  API_BASE_URL
);
/* =========================================================
   PART 4/4
   FINAL COMPATIBILITY + UTILITY FUNCTIONS
   ========================================================= */

/* =========================================================
   BACKEND STATUS
   ========================================================= */

async function checkBackend() {
  try {
    const response = await fetch(
      `${API_ROOT}/api/health`
    );

    if (!response.ok) {
      throw new Error("Backend unavailable");
    }

    const data = await response.json();

    console.log(
      "✅ Backend connected:",
      data.message
    );

    return true;
  } catch (error) {
    console.warn(
      "⚠️ Backend connection failed:",
      error.message
    );

    return false;
  }
}

/* =========================================================
   NEWS REFRESH
   ========================================================= */

async function refreshNews() {
  const refreshButtons =
    document.querySelectorAll(
      ".refresh-news, #refreshNews, [data-action='refresh-news']"
    );

  refreshButtons.forEach(button => {
    button.disabled = true;
  });

  try {
    await loadHomepageNews();

    showToast(
      "News successfully refresh हो गई।",
      "success"
    );
  } catch (error) {
    showToast(
      "News refresh नहीं हो पाई।",
      "error"
    );
  } finally {
    refreshButtons.forEach(button => {
      button.disabled = false;
    });
  }
}

window.refreshNews = refreshNews;

/* =========================================================
   AUTO REFRESH BREAKING NEWS
   ========================================================= */

async function refreshBreakingNews() {
  try {
    const data =
      await apiRequest(
        "/news/breaking?limit=8"
      );

    state.breaking =
      data.news ||
      data.data ||
      [];

    renderBreaking(
      state.breaking
    );
  } catch (error) {
    console.warn(
      "Breaking News refresh failed:",
      error.message
    );
  }
}

/*
 * हर 2 मिनट में Breaking News check होगी।
 */
setInterval(
  refreshBreakingNews,
  120000
);

/* =========================================================
   AUTO REFRESH TRENDING
   ========================================================= */

async function refreshTrendingNews() {
  try {
    const data =
      await apiRequest(
        "/news/trending?limit=8"
      );

    state.trending =
      data.news ||
      data.data ||
      [];

    renderTrending(
      state.trending
    );
  } catch (error) {
    console.warn(
      "Trending refresh failed:",
      error.message
    );
  }
}

setInterval(
  refreshTrendingNews,
  300000
);

/* =========================================================
   NEWS IMAGE LAZY ERROR HANDLING
   ========================================================= */

document.addEventListener(
  "error",
  event => {
    const element =
      event.target;

    if (
      element &&
      element.tagName === "IMG"
    ) {
      if (
        !element.dataset.fallbackUsed
      ) {
        element.dataset.fallbackUsed =
          "true";

        element.src =
          "https://picsum.photos/600/350?random=999";
      }
    }
  },
  true
);

/* =========================================================
   CONTACT SCREEN HELPERS
   ========================================================= */

function openContactScreen() {
  showScreen(
    "contact-screen"
  );

  updateActiveNavigation(
    "contact-screen"
  );

  initContactScreen();

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

window.openContactScreen =
  openContactScreen;

/* =========================================================
   CATEGORY SHORTCUTS
   ========================================================= */

function openRajasthanNews() {
  loadCategoryNews(
    "राजस्थान"
  );
}

function openPoliticsNews() {
  loadCategoryNews(
    "राजनीति"
  );
}

function openSportsNews() {
  loadCategoryNews(
    "खेल"
  );
}

function openEntertainmentNews() {
  loadCategoryNews(
    "मनोरंजन"
  );
}

function openBusinessNews() {
  loadCategoryNews(
    "बिजनेस"
  );
}

function openEducationNews() {
  loadCategoryNews(
    "शिक्षा"
  );
}

function openHealthNews() {
  loadCategoryNews(
    "स्वास्थ्य"
  );
}

function openCrimeNews() {
  loadCategoryNews(
    "अपराध"
  );
}

function openWeatherNews() {
  loadCategoryNews(
    "मौसम"
  );
}

window.openRajasthanNews =
  openRajasthanNews;

window.openPoliticsNews =
  openPoliticsNews;

window.openSportsNews =
  openSportsNews;

window.openEntertainmentNews =
  openEntertainmentNews;

window.openBusinessNews =
  openBusinessNews;

window.openEducationNews =
  openEducationNews;

window.openHealthNews =
  openHealthNews;

window.openCrimeNews =
  openCrimeNews;

window.openWeatherNews =
  openWeatherNews;

/* =========================================================
   DISTRICT SHORTCUTS
   ========================================================= */

function openDistrict(district) {
  if (!district) return;

  loadDistrictNews(
    district
  );
}

window.openDistrict =
  openDistrict;

/* =========================================================
   SEARCH CLEAR
   ========================================================= */

function clearSearch() {
  document
    .querySelectorAll(
      'input[type="search"], .search-input, #searchInput'
    )
    .forEach(input => {
      input.value = "";
    });

  closeSearchResults();
}

document.addEventListener(
  "click",
  event => {
    const button =
      event.target.closest(
        ".clear-search, #clearSearch, [data-action='clear-search']"
      );

    if (!button) return;

    event.preventDefault();

    clearSearch();
  }
);

window.clearSearch =
  clearSearch;

/* =========================================================
   PRINT NEWS
   ========================================================= */

function printCurrentNews() {
  if (!currentNews) {
    showToast(
      "पहले कोई खबर खोलें।",
      "warning"
    );

    return;
  }

  const printWindow =
    window.open(
      "",
      "_blank",
      "width=900,height=700"
    );

  if (!printWindow) {
    showToast(
      "Popup blocked है। Browser में popup allow करें।",
      "warning"
    );

    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="hi">
    <head>
      <meta charset="UTF-8">

      <title>
        ${escapeHTML(
          currentNews.title
        )}
      </title>

      <style>
        body {
          font-family:
            Arial,
            "Noto Sans Devanagari",
            sans-serif;
          max-width: 850px;
          margin: 40px auto;
          padding: 20px;
          line-height: 1.8;
        }

        img {
          max-width: 100%;
          height: auto;
        }

        h1 {
          line-height: 1.4;
        }

        .meta {
          color: #666;
          margin-bottom: 20px;
        }

        @media print {
          body {
            margin: 0;
          }
        }
      </style>
    </head>

    <body>

      <h1>
        ${escapeHTML(
          currentNews.title
        )}
      </h1>

      <div class="meta">
        ${escapeHTML(
          currentNews.author ||
            "आवाज राजस्थान ब्यूरो"
        )}
        |
        ${formatDate(
          currentNews.publishedAt
        )}
      </div>

      ${
        currentNews.image
          ? `
            <img
              src="${escapeHTML(
                imageUrl(
                  currentNews.image
                )
              )}"
              alt=""
            />
          `
          : ""
      }

      ${
        currentNews.summary
          ? `
            <h3>
              ${escapeHTML(
                currentNews.summary
              )}
            </h3>
          `
          : ""
      }

      <div>
        ${formatNewsContent(
          currentNews.content
        )}
      </div>

    </body>
    </html>
  `);

  printWindow.document.close();

  printWindow.focus();

  setTimeout(() => {
    printWindow.print();
  }, 500);
}

document.addEventListener(
  "click",
  event => {
    const button =
      event.target.closest(
        ".print-news, #printNews, [data-action='print-news']"
      );

    if (!button) return;

    event.preventDefault();

    printCurrentNews();
  }
);

window.printCurrentNews =
  printCurrentNews;

/* =========================================================
   COPY CURRENT NEWS
   ========================================================= */

async function copyCurrentNewsLink() {
  if (!currentNews) {
    showToast(
      "पहले कोई खबर खोलें।",
      "warning"
    );

    return;
  }

  const id =
    newsId(currentNews);

  const url =
    `${window.location.origin}${window.location.pathname}#detail-screen/${id}`;

  try {
    await navigator.clipboard.writeText(
      url
    );

    showToast(
      "News link copy हो गया।",
      "success"
    );
  } catch (error) {
    showToast(
      "Link copy नहीं हो पाया।",
      "error"
    );
  }
}

window.copyCurrentNewsLink =
  copyCurrentNewsLink;

/* =========================================================
   BACK BUTTON
   ========================================================= */

function goBack() {
  if (
    currentNews &&
    document.getElementById(
      "detail-screen"
    )?.classList.contains(
      "active-screen"
    )
  ) {
    currentNews = null;

    showScreen(
      "home-screen"
    );

    return;
  }

  if (
    history.length > 1
  ) {
    history.back();
  } else {
    showScreen(
      "home-screen"
    );
  }
}

document.addEventListener(
  "click",
  event => {
    const button =
      event.target.closest(
        ".back-button, #backButton, [data-action='back']"
      );

    if (!button) return;

    event.preventDefault();

    goBack();
  }
);

window.goBack =
  goBack;

/* =========================================================
   CATEGORY MENU SUPPORT
   ========================================================= */

document.addEventListener(
  "click",
  event => {
    const item =
      event.target.closest(
        "[data-news-category]"
      );

    if (!item) return;

    event.preventDefault();

    const category =
      item.dataset.newsCategory;

    if (!category) return;

    loadCategoryNews(
      category
    );
  }
);

/* =========================================================
   DISTRICT MENU SUPPORT
   ========================================================= */

document.addEventListener(
  "click",
  event => {
    const item =
      event.target.closest(
        "[data-news-district]"
      );

    if (!item) return;

    event.preventDefault();

    const district =
      item.dataset.newsDistrict;

    if (!district) return;

    loadDistrictNews(
      district
    );
  }
);

/* =========================================================
   NEWS CARD HOVER / ACCESSIBILITY
   ========================================================= */

document.addEventListener(
  "keydown",
  event => {
    if (
      event.key !== "Enter" &&
      event.key !== " "
    ) {
      return;
    }

    const card =
      event.target.closest(
        ".news-card[data-news-id]"
      );

    if (!card) return;

    if (
      isTypingElement(
        event.target
      )
    ) {
      return;
    }

    event.preventDefault();

    openNews(
      card.dataset.newsId
    );
  }
);

/* =========================================================
   ONLINE / OFFLINE INDICATOR
   ========================================================= */

function updateConnectionStatus() {
  let indicator =
    document.getElementById(
      "connection-status"
    );

  if (!indicator) {
    indicator =
      document.createElement(
        "div"
      );

    indicator.id =
      "connection-status";

    indicator.style.cssText = `
      position: fixed;
      left: 50%;
      bottom: 15px;
      transform: translateX(-50%);
      z-index: 99998;
      padding: 8px 14px;
      border-radius: 20px;
      font-size: 13px;
      display: none;
    `;

    document.body.appendChild(
      indicator
    );
  }

  if (navigator.onLine) {
    indicator.style.display =
      "none";
  } else {
    indicator.textContent =
      "⚠️ Internet connection नहीं है";

    indicator.style.display =
      "block";
  }
}

window.addEventListener(
  "online",
  updateConnectionStatus
);

window.addEventListener(
  "offline",
  updateConnectionStatus
);

updateConnectionStatus();

/* =========================================================
   SERVICE INITIALIZATION
   ========================================================= */

async function initializeAwaazRajasthan() {
  console.log(
    "🚀 Awaaz Rajasthan initializing..."
  );

  const connected =
    await checkBackend();

  if (!connected) {
    console.warn(
      "Backend connect नहीं है।"
    );

    return;
  }

  console.log(
    "✅ Awaaz Rajasthan ready."
  );
}

/*
 * DOMContentLoaded के बाद backend check।
 */
if (
  document.readyState ===
  "loading"
) {
  document.addEventListener(
    "DOMContentLoaded",
    initializeAwaazRajasthan,
    {
      once: true
    }
  );
} else {
  initializeAwaazRajasthan();
}

/* =========================================================
   FINAL GLOBAL EXPORTS
   ========================================================= */

window.AwaazRajasthan = {
  apiBaseURL: API_BASE_URL,

  state,

  loadHomepageNews,
  loadLatestNews,
  loadCategoryNews,
  loadDistrictNews,

  performAPISearch,

  openNews,

  loadLiveTV,
  loadEPaper,

  loginUser,
  logoutUser,

  submitContactForm,

  shareNews,

  refreshNews,
  refreshBreakingNews,
  refreshTrendingNews,

  showScreen,
  goBack,

  printCurrentNews,
  copyCurrentNewsLink,

  checkBackend
};

console.log(
  "📰 Awaaz Rajasthan script.js loaded successfully."
);
