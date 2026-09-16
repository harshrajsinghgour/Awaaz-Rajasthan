/* ============================================================
   AAWAAZ RAJASTHAN
   SCRIPT.JS — PART 1/30

   CORE CONFIGURATION
   API CONFIGURATION
   GLOBAL STATE
   DOM HELPERS
   COMMON UTILITIES
   APPLICATION INITIALIZATION
============================================================ */


/* ============================================================
   STRICT MODE
============================================================ */

"use strict";


/* ============================================================
   APPLICATION CONFIGURATION
============================================================ */

const APP_CONFIG = {

    name: "Awaaz Rajasthan",

    shortName: "Awaaz Rajasthan",

    language: "hi-IN",

    country: "India",

    state: "Rajasthan",

    timezone: "Asia/Kolkata",

    version: "1.0.0",

    apiBaseUrl:
        window.APP_API_BASE_URL ||
        window.API_BASE_URL ||
        "",

    frontendUrl:
        window.location.origin,

    requestTimeout:
        15000,

    imagePlaceholder:
        "data:image/svg+xml;charset=UTF-8," +
        encodeURIComponent(
            `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
                <rect width="800" height="500" fill="#eeeeee"/>
                <text x="400" y="245"
                    text-anchor="middle"
                    font-family="Arial, sans-serif"
                    font-size="30"
                    fill="#9b9b9b">
                    Awaaz Rajasthan
                </text>
                <text x="400" y="285"
                    text-anchor="middle"
                    font-family="Arial, sans-serif"
                    font-size="18"
                    fill="#b5b5b5">
                    Image Not Available
                </text>
            </svg>`
        )

};


/* ============================================================
   API ENDPOINTS
============================================================ */

const API_ENDPOINTS = {

    news:
        "/api/news",

    latestNews:
        "/api/news/latest",

    trendingNews:
        "/api/news/trending",

    breakingNews:
        "/api/news/breaking",

    categories:
        "/api/categories",

    search:
        "/api/news/search",

    article:
        "/api/news",

    videos:
        "/api/videos",

    galleries:
        "/api/galleries",

    photos:
        "/api/photos",

    epapers:
        "/api/epapers",

    ads:
        "/api/ads",

    adImpression:
        "/api/ads",

    adClick:
        "/api/ads",

    contact:
        "/api/contact"

};


/* ============================================================
   APPLICATION STATE
============================================================ */

const AppState = {

    initialized:
        false,

    loading:
        false,

    currentPage:
        1,

    pageSize:
        10,

    totalPages:
        1,

    currentCategory:
        null,

    currentArticleId:
        null,

    currentSearchQuery:
        "",

    currentSearchPage:
        1,

    currentEpaperPage:
        1,

    currentEpaperZoom:
        1,

    menuOpen:
        false,

    searchOpen:
        false,

    lightboxOpen:
        false,

    modalOpen:
        false,

    online:
        navigator.onLine,

    newsCache:
        new Map(),

    categoryCache:
        null,

    breakingNews:
        [],

    latestNews:
        [],

    trendingNews:
        [],

    categories:
        [],

    videos:
        [],

    galleries:
        [],

    epapers:
        [],

    ads:
        [],

    lightboxImages:
        [],

    lightboxIndex:
        0

};


/* ============================================================
   DOM CACHE
============================================================ */

const DOM = {

    html:
        document.documentElement,

    body:
        document.body,

    app:
        document.querySelector("#app") ||
        document.querySelector(".app-container") ||
        document.body,

    header:
        document.querySelector(
            ".site-header, .main-header, header"
        ),

    navigation:
        document.querySelector(
            ".main-navigation, .main-nav, nav"
        ),

    mobileMenu:
        document.querySelector(
            ".mobile-menu, .mobile-navigation"
        ),

    searchInput:
        document.querySelector(
            "#searchInput, .search-input"
        ),

    searchForm:
        document.querySelector(
            "#searchForm, .search-form"
        ),

    breakingTicker:
        document.querySelector(
            ".breaking-news, .breaking-ticker"
        ),

    breakingTrack:
        document.querySelector(
            ".breaking-ticker-track, .ticker-track, .news-ticker-track"
        ),

    mainContent:
        document.querySelector(
            ".main-content, #mainContent, main"
        ),

    loadingOverlay:
        document.querySelector(
            ".loading-overlay"
        ),

    toastContainer:
        document.querySelector(
            ".toast-container"
        ),

    lightbox:
        document.querySelector(
            ".lightbox-overlay, .photo-lightbox"
        ),

    modal:
        document.querySelector(
            ".modal-overlay"
        ),

    scrollTopButton:
        document.querySelector(
            ".scroll-to-top, #scrollTop"
        )

};


/* ============================================================
   DOM REFRESH
   Useful when HTML is rendered dynamically
============================================================ */

function refreshDOMCache() {

    DOM.header =
        document.querySelector(
            ".site-header, .main-header, header"
        );

    DOM.navigation =
        document.querySelector(
            ".main-navigation, .main-nav, nav"
        );

    DOM.mobileMenu =
        document.querySelector(
            ".mobile-menu, .mobile-navigation"
        );

    DOM.searchInput =
        document.querySelector(
            "#searchInput, .search-input"
        );

    DOM.searchForm =
        document.querySelector(
            "#searchForm, .search-form"
        );

    DOM.breakingTicker =
        document.querySelector(
            ".breaking-news, .breaking-ticker"
        );

    DOM.breakingTrack =
        document.querySelector(
            ".breaking-ticker-track, .ticker-track, .news-ticker-track"
        );

    DOM.mainContent =
        document.querySelector(
            ".main-content, #mainContent, main"
        );

    DOM.loadingOverlay =
        document.querySelector(
            ".loading-overlay"
        );

    DOM.toastContainer =
        document.querySelector(
            ".toast-container"
        );

    DOM.lightbox =
        document.querySelector(
            ".lightbox-overlay, .photo-lightbox"
        );

    DOM.modal =
        document.querySelector(
            ".modal-overlay"
        );

    DOM.scrollTopButton =
        document.querySelector(
            ".scroll-to-top, #scrollTop"
        );

}


/* ============================================================
   SELECTOR HELPER
============================================================ */

function $(selector, parent = document) {

    return parent.querySelector(selector);

}


/* ============================================================
   SELECT ALL HELPER
============================================================ */

function $$(selector, parent = document) {

    return Array.from(
        parent.querySelectorAll(selector)
    );

}


/* ============================================================
   ELEMENT CREATOR
============================================================ */

function createElement(
    tag,
    options = {},
    children = []
) {

    const element =
        document.createElement(tag);


    if (options.className) {

        element.className =
            options.className;

    }


    if (options.id) {

        element.id =
            options.id;

    }


    if (options.text !== undefined) {

        element.textContent =
            options.text;

    }


    if (options.html !== undefined) {

        element.innerHTML =
            options.html;

    }


    if (options.attributes) {

        Object.entries(
            options.attributes
        ).forEach(
            ([name, value]) => {

                if (
                    value !== null &&
                    value !== undefined
                ) {

                    element.setAttribute(
                        name,
                        value
                    );

                }

            }
        );

    }


    if (options.dataset) {

        Object.entries(
            options.dataset
        ).forEach(
            ([name, value]) => {

                element.dataset[name] =
                    value;

            }
        );

    }


    if (options.style) {

        Object.assign(
            element.style,
            options.style
        );

    }


    if (!Array.isArray(children)) {

        children =
            [children];

    }


    children.forEach(
        child => {

            if (
                child instanceof Node
            ) {

                element.appendChild(
                    child
                );

            }

        }
    );


    return element;

}


/* ============================================================
   SAFE TEXT
============================================================ */

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    const div =
        document.createElement("div");

    div.textContent =
        String(value);

    return div.innerHTML;

}


/* ============================================================
   SAFE URL
============================================================ */

function safeURL(
    value,
    fallback = "#"
) {

    if (
        !value ||
        typeof value !== "string"
    ) {

        return fallback;

    }


    try {

        const url =
            new URL(
                value,
                window.location.origin
            );


        if (
            url.protocol === "http:" ||
            url.protocol === "https:"
        ) {

            return url.href;

        }


        return fallback;

    } catch (error) {

        return fallback;

    }

}


/* ============================================================
   IMAGE URL NORMALIZER
============================================================ */

function normalizeImageURL(
    value
) {

    if (
        !value ||
        typeof value !== "string"
    ) {

        return APP_CONFIG.imagePlaceholder;

    }


    const cleanValue =
        value.trim();


    if (!cleanValue) {

        return APP_CONFIG.imagePlaceholder;

    }


    return safeURL(
        cleanValue,
        APP_CONFIG.imagePlaceholder
    );

}


/* ============================================================
   TEXT NORMALIZER
============================================================ */

function normalizeText(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)
        .replace(/\s+/g, " ")
        .trim();

}


/* ============================================================
   DATE HELPER
============================================================ */

function formatDate(
    value,
    options = {}
) {

    if (!value) {

        return "";

    }


    const date =
        new Date(value);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "";

    }


    const formatter =
        new Intl.DateTimeFormat(
            APP_CONFIG.language,
            {
                day:
                    "2-digit",

                month:
                    options.month ||
                    "short",

                year:
                    "numeric",

                ...(options.time
                    ? {
                        hour:
                            "2-digit",

                        minute:
                            "2-digit"
                    }
                    : {})
            }
        );


    return formatter.format(date);

}


/* ============================================================
   RELATIVE TIME
============================================================ */

function getRelativeTime(value) {

    if (!value) {

        return "";

    }


    const date =
        new Date(value);

    const time =
        date.getTime();


    if (
        Number.isNaN(time)
    ) {

        return "";

    }


    const now =
        Date.now();

    const difference =
        now - time;


    if (difference < 0) {

        return formatDate(value);

    }


    const minute =
        60 * 1000;

    const hour =
        60 * minute;

    const day =
        24 * hour;


    if (difference < minute) {

        return "अभी";

    }


    if (difference < hour) {

        return `${Math.floor(
            difference / minute
        )} मिनट पहले`;

    }


    if (difference < day) {

        return `${Math.floor(
            difference / hour
        )} घंटे पहले`;

    }


    if (difference < 7 * day) {

        return `${Math.floor(
            difference / day
        )} दिन पहले`;

    }


    return formatDate(value);

}


/* ============================================================
   NUMBER FORMAT
============================================================ */

function formatNumber(value) {

    const number =
        Number(value);


    if (
        Number.isNaN(number)
    ) {

        return "0";

    }


    return new Intl.NumberFormat(
        "en-IN"
    ).format(number);

}


/* ============================================================
   DEBOUNCE
============================================================ */

function debounce(
    callback,
    delay = 300
) {

    let timer =
        null;


    return function (...args) {

        clearTimeout(timer);


        timer =
            setTimeout(
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


/* ============================================================
   THROTTLE
============================================================ */

function throttle(
    callback,
    delay = 200
) {

    let lastCall =
        0;


    return function (...args) {

        const now =
            Date.now();


        if (
            now - lastCall >=
            delay
        ) {

            lastCall =
                now;

            callback.apply(
                this,
                args
            );

        }

    };

}


/* ============================================================
   RANDOM ID
============================================================ */

function generateID(
    prefix = "awaaz"
) {

    return (
        prefix +
        "-" +
        Date.now().toString(36) +
        "-" +
        Math.random()
            .toString(36)
            .slice(2, 8)
    );

}


/* ============================================================
   LOCAL STORAGE SAFE GET
============================================================ */

function getStorage(
    key,
    fallback = null
) {

    try {

        const value =
            localStorage.getItem(
                key
            );


        if (value === null) {

            return fallback;

        }


        return JSON.parse(value);

    } catch (error) {

        return fallback;

    }

}


/* ============================================================
   LOCAL STORAGE SAFE SET
============================================================ */

function setStorage(
    key,
    value
) {

    try {

        localStorage.setItem(
            key,
            JSON.stringify(value)
        );

        return true;

    } catch (error) {

        return false;

    }

}


/* ============================================================
   LOCAL STORAGE REMOVE
============================================================ */

function removeStorage(
    key
) {

    try {

        localStorage.removeItem(
            key
        );

        return true;

    } catch (error) {

        return false;

    }

}


/* ============================================================
   API URL BUILDER
============================================================ */

function buildAPIURL(
    endpoint,
    params = {}
) {

    const base =
        APP_CONFIG.apiBaseUrl
            .replace(/\/+$/, "");


    const cleanEndpoint =
        String(endpoint || "")
            .replace(/^\/+/, "/");


    const url =
        new URL(
            `${base}${cleanEndpoint}`,
            window.location.origin
        );


    Object.entries(params)
        .forEach(
            ([key, value]) => {

                if (
                    value !== null &&
                    value !== undefined &&
                    value !== ""
                ) {

                    url.searchParams.set(
                        key,
                        value
                    );

                }

            }
        );


    return url.toString();

}


/* ============================================================
   REQUEST TIMEOUT
============================================================ */

function createTimeoutSignal(
    timeout =
        APP_CONFIG.requestTimeout
) {

    if (
        typeof AbortController ===
        "undefined"
    ) {

        return null;

    }


    const controller =
        new AbortController();


    setTimeout(
        () => {

            controller.abort();

        },
        timeout
    );


    return controller.signal;

}


/* ============================================================
   NETWORK STATUS
============================================================ */

function updateNetworkStatus(
    online
) {

    AppState.online =
        Boolean(online);


    DOM.body?.classList.toggle(
        "offline-mode",
        !AppState.online
    );


    window.dispatchEvent(
        new CustomEvent(
            "awaaz:network",
            {
                detail: {
                    online:
                        AppState.online
                }
            }
        )
    );

}


/* ============================================================
   GLOBAL ERROR HANDLER
============================================================ */

function handleGlobalError(
    error,
    context = "Application"
) {

    console.error(
        `[Awaaz Rajasthan] ${context}:`,
        error
    );

}


/* ============================================================
   INITIAL APPLICATION BOOTSTRAP
============================================================ */

function initializeApp() {

    if (
        AppState.initialized
    ) {

        return;

    }


    refreshDOMCache();


    AppState.initialized =
        true;


    updateNetworkStatus(
        navigator.onLine
    );


    window.dispatchEvent(
        new CustomEvent(
            "awaaz:ready",
            {
                detail: {
                    version:
                        APP_CONFIG.version
                }
            }
        )
    );


    console.info(
        `${APP_CONFIG.name} frontend initialized.`
    );

}


/* ============================================================
   DOM READY
============================================================ */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeApp,
        {
            once: true
        }
    );

} else {

    initializeApp();

}


/* ============================================================
   NETWORK EVENTS
============================================================ */

window.addEventListener(
    "online",
    () => {

        updateNetworkStatus(
            true
        );

    }
);


window.addEventListener(
    "offline",
    () => {

        updateNetworkStatus(
            false
        );

    }
);


/* ============================================================
   GLOBAL ERROR EVENTS
============================================================ */

window.addEventListener(
    "error",
    event => {

        handleGlobalError(
            event.error ||
            event.message,
            "Window Error"
        );

    }
);


window.addEventListener(
    "unhandledrejection",
    event => {

        handleGlobalError(
            event.reason,
            "Unhandled Promise Rejection"
        );

    }
);


/* ============================================================
   EXPORT GLOBAL APP OBJECT
============================================================ */

window.AwaazRajasthan = {

    config:
        APP_CONFIG,

    endpoints:
        API_ENDPOINTS,

    state:
        AppState,

    dom:
        DOM,

    utils: {

        $,

        $$,

        createElement,

        escapeHTML,

        safeURL,

        normalizeImageURL,

        normalizeText,

        formatDate,

        getRelativeTime,

        formatNumber,

        debounce,

        throttle,

        generateID,

        getStorage,

        setStorage,

        removeStorage,

        buildAPIURL

    }

};


/* ============================================================
   END OF PART 1/30
============================================================ */
/* ============================================================
   AAWAAZ RAJASTHAN
   SCRIPT.JS — PART 2/30

   API REQUEST ENGINE
   FETCH HELPERS
   RESPONSE NORMALIZATION
   ERROR HANDLING
   CACHE HELPERS
============================================================ */


/* ============================================================
   API REQUEST DEFAULTS
============================================================ */

const API_DEFAULTS = {

    method:
        "GET",

    headers: {

        "Accept":
            "application/json"

    },

    credentials:
        "include",

    cache:
        "no-store"

};


/* ============================================================
   API RESPONSE CACHE
============================================================ */

const API_CACHE = new Map();


/* ============================================================
   CACHE TTL
============================================================ */

const API_CACHE_TTL = {

    news:
        60 * 1000,

    latestNews:
        30 * 1000,

    breakingNews:
        20 * 1000,

    trendingNews:
        60 * 1000,

    categories:
        10 * 60 * 1000,

    videos:
        60 * 1000,

    galleries:
        60 * 1000,

    epapers:
        5 * 60 * 1000,

    ads:
        60 * 1000

};


/* ============================================================
   API ERROR CLASS
============================================================ */

class APIError extends Error {

    constructor(
        message,
        options = {}
    ) {

        super(message);

        this.name =
            "APIError";

        this.status =
            options.status || 0;

        this.code =
            options.code || "";

        this.data =
            options.data || null;

        this.url =
            options.url || "";

    }

}


/* ============================================================
   GET CACHE KEY
============================================================ */

function getCacheKey(
    url,
    options = {}
) {

    const method =
        String(
            options.method ||
            "GET"
        ).toUpperCase();


    return `${method}:${url}`;

}


/* ============================================================
   READ API CACHE
============================================================ */

function readAPICache(
    key,
    ttl
) {

    const cached =
        API_CACHE.get(key);


    if (!cached) {

        return null;

    }


    const age =
        Date.now() -
        cached.timestamp;


    if (
        age > ttl
    ) {

        API_CACHE.delete(
            key
        );

        return null;

    }


    return cached.data;

}


/* ============================================================
   WRITE API CACHE
============================================================ */

function writeAPICache(
    key,
    data
) {

    API_CACHE.set(
        key,
        {

            timestamp:
                Date.now(),

            data:
                data

        }
    );

}


/* ============================================================
   CLEAR API CACHE
============================================================ */

function clearAPICache(
    pattern = null
) {

    if (!pattern) {

        API_CACHE.clear();

        return;

    }


    for (
        const key of API_CACHE.keys()
    ) {

        if (
            key.includes(pattern)
        ) {

            API_CACHE.delete(
                key
            );

        }

    }

}


/* ============================================================
   RESPONSE JSON CHECK
============================================================ */

async function parseAPIResponse(
    response
) {

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

            return await response.json();

        } catch (error) {

            throw new APIError(
                "सर्वर से सही JSON response नहीं मिला।",
                {

                    status:
                        response.status,

                    code:
                        "INVALID_JSON"

                }
            );

        }

    }


    const text =
        await response.text();


    if (!text) {

        return null;

    }


    try {

        return JSON.parse(text);

    } catch (error) {

        return {

            success:
                response.ok,

            message:
                text

        };

    }

}


/* ============================================================
   EXTRACT API ERROR MESSAGE
============================================================ */

function getAPIErrorMessage(
    data,
    status
) {

    if (
        data &&
        typeof data === "object"
    ) {

        const possibleMessages = [

            data.message,

            data.error,

            data.msg,

            data.errorMessage,

            data.details

        ];


        for (
            const message
            of possibleMessages
        ) {

            if (
                typeof message ===
                "string" &&
                message.trim()
            ) {

                return message.trim();

            }

        }

    }


    if (
        status === 400
    ) {

        return "अनुरोध सही नहीं है।";

    }


    if (
        status === 401
    ) {

        return "आपको इस अनुरोध की अनुमति नहीं है।";

    }


    if (
        status === 403
    ) {

        return "इस कार्य की अनुमति नहीं है।";

    }


    if (
        status === 404
    ) {

        return "मांगी गई जानकारी नहीं मिली।";

    }


    if (
        status === 429
    ) {

        return "बहुत अधिक अनुरोध किए गए हैं। थोड़ी देर बाद पुनः प्रयास करें।";

    }


    if (
        status >= 500
    ) {

        return "सर्वर में समस्या है। कृपया थोड़ी देर बाद पुनः प्रयास करें।";

    }


    return "कुछ समस्या हुई। कृपया पुनः प्रयास करें।";

}


/* ============================================================
   CORE API REQUEST
============================================================ */

async function apiRequest(
    endpoint,
    options = {}
) {

    const {

        method =
            "GET",

        params =
            {},

        body =
            null,

        headers =
            {},

        timeout =
            APP_CONFIG.requestTimeout,

        useCache =
            false,

        cacheTTL =
            0,

        signal =
            null

    } = options;


    const url =
        buildAPIURL(
            endpoint,
            params
        );


    const requestHeaders = {

        ...API_DEFAULTS.headers,

        ...headers

    };


    const requestOptions = {

        ...API_DEFAULTS,

        method:
            method.toUpperCase(),

        headers:
            requestHeaders,

        credentials:
            "include"

    };


    if (
        signal
    ) {

        requestOptions.signal =
            signal;

    } else {

        const timeoutSignal =
            createTimeoutSignal(
                timeout
            );


        if (
            timeoutSignal
        ) {

            requestOptions.signal =
                timeoutSignal;

        }

    }


    if (
        body !== null &&
        method.toUpperCase() !==
            "GET"
    ) {

        if (
            body instanceof FormData
        ) {

            requestOptions.body =
                body;

        } else {

            requestHeaders[
                "Content-Type"
            ] =
                "application/json";


            requestOptions.body =
                JSON.stringify(
                    body
                );

        }

    }


    const cacheKey =
        getCacheKey(
            url,
            {
                method
            }
        );


    if (
        useCache &&
        cacheTTL > 0
    ) {

        const cached =
            readAPICache(
                cacheKey,
                cacheTTL
            );


        if (
            cached !== null
        ) {

            return cached;

        }

    }


    let response;


    try {

        response =
            await fetch(
                url,
                requestOptions
            );

    } catch (error) {

        if (
            error.name ===
            "AbortError"
        ) {

            throw new APIError(
                "सर्वर से response आने में अधिक समय लग रहा है।",
                {

                    code:
                        "TIMEOUT",

                    url:
                        url

                }
            );

        }


        throw new APIError(
            AppState.online
                ? "सर्वर से संपर्क नहीं हो सका।"
                : "इंटरनेट कनेक्शन उपलब्ध नहीं है।",
            {

                code:
                    "NETWORK_ERROR",

                url:
                    url

            }
        );

    }


    const data =
        await parseAPIResponse(
            response
        );


    if (
        !response.ok
    ) {

        throw new APIError(
            getAPIErrorMessage(
                data,
                response.status
            ),
            {

                status:
                    response.status,

                code:
                    "HTTP_ERROR",

                data:
                    data,

                url:
                    url

            }
        );

    }


    if (
        useCache &&
        cacheTTL > 0
    ) {

        writeAPICache(
            cacheKey,
            data
        );

    }


    return data;

}


/* ============================================================
   GET REQUEST
============================================================ */

async function apiGet(
    endpoint,
    params = {},
    options = {}
) {

    return apiRequest(
        endpoint,
        {

            ...options,

            method:
                "GET",

            params:
                params

        }
    );

}


/* ============================================================
   POST REQUEST
============================================================ */

async function apiPost(
    endpoint,
    body = {},
    options = {}
) {

    return apiRequest(
        endpoint,
        {

            ...options,

            method:
                "POST",

            body:
                body,

            useCache:
                false

        }
    );

}


/* ============================================================
   PUT REQUEST
============================================================ */

async function apiPut(
    endpoint,
    body = {},
    options = {}
) {

    return apiRequest(
        endpoint,
        {

            ...options,

            method:
                "PUT",

            body:
                body,

            useCache:
                false

        }
    );

}


/* ============================================================
   PATCH REQUEST
============================================================ */

async function apiPatch(
    endpoint,
    body = {},
    options = {}
) {

    return apiRequest(
        endpoint,
        {

            ...options,

            method:
                "PATCH",

            body:
                body,

            useCache:
                false

        }
    );

}


/* ============================================================
   DELETE REQUEST
============================================================ */

async function apiDelete(
    endpoint,
    options = {}
) {

    return apiRequest(
        endpoint,
        {

            ...options,

            method:
                "DELETE",

            useCache:
                false

        }
    );

}


/* ============================================================
   API DATA NORMALIZER
============================================================ */

function normalizeAPIData(
    response
) {

    if (
        response === null ||
        response === undefined
    ) {

        return [];

    }


    if (
        Array.isArray(response)
    ) {

        return response;

    }


    if (
        typeof response !==
        "object"
    ) {

        return [];

    }


    const possibleArrays = [

        response.data,

        response.items,

        response.results,

        response.news,

        response.articles,

        response.posts,

        response.records

    ];


    for (
        const value
        of possibleArrays
    ) {

        if (
            Array.isArray(value)
        ) {

            return value;

        }

    }


    return [];

}


/* ============================================================
   API PAGINATION NORMALIZER
============================================================ */

function normalizePagination(
    response
) {

    if (
        !response ||
        typeof response !==
            "object"
    ) {

        return {

            page:
                1,

            limit:
                AppState.pageSize,

            total:
                0,

            totalPages:
                1

        };

    }


    const pagination =
        response.pagination ||
        response.meta ||
        response.pageInfo ||
        {};


    const page =
        Number(
            pagination.page ||
            response.page ||
            1
        );


    const limit =
        Number(
            pagination.limit ||
            pagination.pageSize ||
            response.limit ||
            AppState.pageSize
        );


    const total =
        Number(
            pagination.total ||
            response.total ||
            0
        );


    let totalPages =
        Number(
            pagination.totalPages ||
            response.totalPages ||
            0
        );


    if (
        !totalPages &&
        total &&
        limit
    ) {

        totalPages =
            Math.ceil(
                total / limit
            );

    }


    return {

        page:
            Number.isFinite(page)
                ? page
                : 1,

        limit:
            Number.isFinite(limit)
                ? limit
                : AppState.pageSize,

        total:
            Number.isFinite(total)
                ? total
                : 0,

        totalPages:
            Number.isFinite(totalPages) &&
            totalPages > 0
                ? totalPages
                : 1

    };

}


/* ============================================================
   NEWS OBJECT NORMALIZER
============================================================ */

function normalizeNewsItem(
    item = {}
) {

    const image =
        item.image ||
        item.imageUrl ||
        item.thumbnail ||
        item.featuredImage ||
        item.coverImage ||
        item.photo ||
        "";


    const title =
        item.title ||
        item.headline ||
        item.name ||
        "समाचार";


    const id =
        item._id ||
        item.id ||
        item.slug ||
        "";


    const category =
        item.category ||
        item.categoryName ||
        item.section ||
        "";


    const publishedAt =
        item.publishedAt ||
        item.publishDate ||
        item.createdAt ||
        item.date ||
        "";


    return {

        ...item,

        id:
            String(id),

        title:
            normalizeText(title),

        image:
            normalizeImageURL(image),

        category:
            normalizeText(category),

        publishedAt:
            publishedAt,

        excerpt:
            normalizeText(
                item.excerpt ||
                item.summary ||
                item.description ||
                ""
            ),

        slug:
            normalizeText(
                item.slug ||
                ""
            )

    };

}


/* ============================================================
   NEWS LIST NORMALIZER
============================================================ */

function normalizeNewsList(
    response
) {

    return normalizeAPIData(
        response
    )
    .map(
        normalizeNewsItem
    )
    .filter(
        item =>
            item.id ||
            item.title
    );

}


/* ============================================================
   CACHE INVALIDATION AFTER CONTENT UPDATE
============================================================ */

function invalidateNewsCache() {

    clearAPICache(
        "/api/news"
    );

    clearAPICache(
        "/api/categories"
    );

    clearAPICache(
        "/api/videos"
    );

    clearAPICache(
        "/api/galleries"
    );

    AppState.newsCache.clear();

}


/* ============================================================
   RETRY HELPER
============================================================ */

async function retryRequest(
    requestFunction,
    options = {}
) {

    const retries =
        Number(
            options.retries ?? 2
        );


    const delay =
        Number(
            options.delay ?? 700
        );


    let lastError =
        null;


    for (
        let attempt = 0;
        attempt <= retries;
        attempt++
    ) {

        try {

            return await requestFunction();

        } catch (error) {

            lastError =
                error;


            if (
                attempt >= retries
            ) {

                break;

            }


            await new Promise(
                resolve =>
                    setTimeout(
                        resolve,
                        delay *
                        (attempt + 1)
                    )
            );

        }

    }


    throw lastError;

}


/* ============================================================
   EXPOSE API HELPERS
============================================================ */

window.AwaazRajasthan.api = {

    request:
        apiRequest,

    get:
        apiGet,

    post:
        apiPost,

    put:
        apiPut,

    patch:
        apiPatch,

    delete:
        apiDelete,

    retry:
        retryRequest,

    clearCache:
        clearAPICache,

    invalidateNewsCache:
        invalidateNewsCache,

    normalizeData:
        normalizeAPIData,

    normalizeNews:
        normalizeNewsItem,

    normalizeNewsList:
        normalizeNewsList,

    normalizePagination:
        normalizePagination

};


/* ============================================================
   END OF PART 2/30
============================================================ */
/* ============================================================
   AAWAAZ RAJASTHAN
   SCRIPT.JS — PART 3/30

   LOADING SYSTEM
   TOAST NOTIFICATIONS
   MODAL HELPERS
   NETWORK STATUS
   COMMON UI HELPERS
============================================================ */


/* ============================================================
   LOADING STATE
============================================================ */

let loadingCounter = 0;


/* ============================================================
   CREATE LOADING OVERLAY
============================================================ */

function ensureLoadingOverlay() {

    let overlay =
        document.querySelector(
            ".loading-overlay"
        );


    if (overlay) {

        return overlay;

    }


    overlay =
        createElement(
            "div",
            {

                className:
                    "loading-overlay",

                attributes: {

                    "aria-hidden":
                        "true"

                }

            }
        );


    const content =
        createElement(
            "div",
            {

                className:
                    "loading-overlay-content"

            }
        );


    const spinner =
        createElement(
            "div",
            {

                className:
                    "loading-spinner",

                attributes: {

                    "aria-hidden":
                        "true"

                }

            }
        );


    const text =
        createElement(
            "div",
            {

                className:
                    "loading-text",

                text:
                    "लोड हो रहा है..."

            }
        );


    content.appendChild(
        spinner
    );

    content.appendChild(
        text
    );

    overlay.appendChild(
        content
    );

    document.body.appendChild(
        overlay
    );


    return overlay;

}


/* ============================================================
   SHOW LOADING
============================================================ */

function showLoading(
    message = "लोड हो रहा है..."
) {

    loadingCounter++;


    const overlay =
        ensureLoadingOverlay();


    const text =
        overlay.querySelector(
            ".loading-text"
        );


    if (text) {

        text.textContent =
            message;

    }


    overlay.classList.add(
        "is-visible"
    );


    overlay.setAttribute(
        "aria-hidden",
        "false"
    );


    overlay.style.display =
        "flex";


    document.body.classList.add(
        "is-loading"
    );

}


/* ============================================================
   HIDE LOADING
============================================================ */

function hideLoading(
    force = false
) {

    if (force) {

        loadingCounter =
            0;

    } else {

        loadingCounter =
            Math.max(
                0,
                loadingCounter - 1
            );

    }


    if (
        loadingCounter > 0
    ) {

        return;

    }


    const overlay =
        document.querySelector(
            ".loading-overlay"
        );


    if (!overlay) {

        return;

    }


    overlay.classList.remove(
        "is-visible"
    );


    overlay.setAttribute(
        "aria-hidden",
        "true"
    );


    overlay.style.display =
        "none";


    document.body.classList.remove(
        "is-loading"
    );

}


/* ============================================================
   TOAST CONTAINER
============================================================ */

function ensureToastContainer() {

    let container =
        document.querySelector(
            ".toast-container"
        );


    if (container) {

        return container;

    }


    container =
        createElement(
            "div",
            {

                className:
                    "toast-container",

                attributes: {

                    "aria-live":
                        "polite",

                    "aria-atomic":
                        "true"

                }

            }
        );


    document.body.appendChild(
        container
    );


    return container;

}


/* ============================================================
   TOAST ICON
============================================================ */

function getToastIcon(
    type
) {

    const icons = {

        success:
            "✓",

        error:
            "!",

        warning:
            "⚠",

        info:
            "i"

    };


    return (
        icons[type] ||
        icons.info
    );

}


/* ============================================================
   SHOW TOAST
============================================================ */

function showToast(
    message,
    type = "info",
    duration = 3500
) {

    if (
        !message
    ) {

        return null;

    }


    const container =
        ensureToastContainer();


    const toast =
        createElement(
            "div",
            {

                className:
                    `toast ${type}`,

                attributes: {

                    role:
                        type === "error"
                            ? "alert"
                            : "status"

                }

            }
        );


    const icon =
        createElement(
            "span",
            {

                className:
                    "toast-icon",

                text:
                    getToastIcon(type),

                attributes: {

                    "aria-hidden":
                        "true"

                }

            }
        );


    const text =
        createElement(
            "div",
            {

                className:
                    "toast-message",

                text:
                    normalizeText(
                        message
                    )

            }
        );


    toast.appendChild(
        icon
    );

    toast.appendChild(
        text
    );


    container.appendChild(
        toast
    );


    requestAnimationFrame(
        () => {

            toast.classList.add(
                "show"
            );

        }
    );


    const timeout =
        Math.max(
            1200,
            Number(duration) || 3500
        );


    const timer =
        setTimeout(
            () => {

                removeToast(
                    toast
                );

            },
            timeout
        );


    toast.dataset.timer =
        String(timer);


    return toast;

}


/* ============================================================
   REMOVE TOAST
============================================================ */

function removeToast(
    toast
) {

    if (!toast) {

        return;

    }


    if (
        toast.dataset.timer
    ) {

        clearTimeout(
            Number(
                toast.dataset.timer
            )
        );

    }


    toast.classList.remove(
        "show"
    );


    setTimeout(
        () => {

            toast.remove();

        },
        220
    );

}


/* ============================================================
   SHORTCUT TOASTS
============================================================ */

function toastSuccess(
    message
) {

    return showToast(
        message,
        "success"
    );

}


function toastError(
    message
) {

    return showToast(
        message,
        "error"
    );

}


function toastWarning(
    message
) {

    return showToast(
        message,
        "warning"
    );

}


function toastInfo(
    message
) {

    return showToast(
        message,
        "info"
    );

}


/* ============================================================
   MODAL ELEMENT
============================================================ */

function ensureModal() {

    let modal =
        document.querySelector(
            ".modal-overlay"
        );


    if (modal) {

        return modal;

    }


    modal =
        createElement(
            "div",
            {

                className:
                    "modal-overlay",

                attributes: {

                    "aria-hidden":
                        "true",

                    role:
                        "dialog"

                }

            }
        );


    const dialog =
        createElement(
            "div",
            {

                className:
                    "modal-dialog"

            }
        );


    const closeButton =
        createElement(
            "button",
            {

                className:
                    "modal-close",

                text:
                    "×",

                attributes: {

                    type:
                        "button",

                    "aria-label":
                        "बंद करें"

                }

            }
        );


    const content =
        createElement(
            "div",
            {

                className:
                    "modal-content"

            }
        );


    dialog.appendChild(
        closeButton
    );

    dialog.appendChild(
        content
    );

    modal.appendChild(
        dialog
    );


    document.body.appendChild(
        modal
    );


    closeButton.addEventListener(
        "click",
        () => {

            closeModal();

        }
    );


    modal.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                modal
            ) {

                closeModal();

            }

        }
    );


    return modal;

}


/* ============================================================
   OPEN MODAL
============================================================ */

function openModal(
    content,
    options = {}
) {

    const modal =
        ensureModal();


    const dialog =
        modal.querySelector(
            ".modal-dialog"
        );


    const modalContent =
        modal.querySelector(
            ".modal-content"
        );


    if (
        !modalContent
    ) {

        return;

    }


    if (
        typeof content ===
        "string"
    ) {

        modalContent.innerHTML =
            content;

    } else if (
        content instanceof Node
    ) {

        modalContent.replaceChildren(
            content
        );

    } else {

        modalContent.textContent =
            "";

    }


    if (
        options.title
    ) {

        const title =
            createElement(
                "h2",
                {

                    className:
                        "modal-title",

                    text:
                        options.title

                }
            );


        modalContent.prepend(
            title
        );

    }


    if (
        options.width
    ) {

        dialog.style.maxWidth =
            options.width;

    } else {

        dialog.style.maxWidth =
            "";

    }


    modal.classList.add(
        "is-open"
    );


    modal.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.classList.add(
        "modal-open"
    );


    AppState.modalOpen =
        true;


    return modal;

}


/* ============================================================
   CLOSE MODAL
============================================================ */

function closeModal() {

    const modal =
        document.querySelector(
            ".modal-overlay"
        );


    if (!modal) {

        return;

    }


    modal.classList.remove(
        "is-open"
    );


    modal.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.classList.remove(
        "modal-open"
    );


    AppState.modalOpen =
        false;

}


/* ============================================================
   ESCAPE KEY HANDLER
============================================================ */

function handleEscapeKey(
    event
) {

    if (
        event.key !==
        "Escape"
    ) {

        return;

    }


    if (
        AppState.lightboxOpen
    ) {

        if (
            typeof closeLightbox ===
            "function"
        ) {

            closeLightbox();

        }

        return;

    }


    if (
        AppState.modalOpen
    ) {

        closeModal();

        return;

    }


    if (
        AppState.menuOpen
    ) {

        if (
            typeof closeMobileMenu ===
            "function"
        ) {

            closeMobileMenu();

        }

    }

}


document.addEventListener(
    "keydown",
    handleEscapeKey
);


/* ============================================================
   NETWORK STATUS UI
============================================================ */

function ensureNetworkStatus() {

    let element =
        document.querySelector(
            ".network-status"
        );


    if (element) {

        return element;

    }


    element =
        createElement(
            "div",
            {

                className:
                    "network-status",

                attributes: {

                    role:
                        "status",

                    "aria-live":
                        "polite"

                }

            }
        );


    document.body.appendChild(
        element
    );


    return element;

}


/* ============================================================
   UPDATE NETWORK UI
============================================================ */

function updateNetworkStatusUI(
    online
) {

    const status =
        ensureNetworkStatus();


    if (online) {

        status.textContent =
            "इंटरनेट कनेक्शन उपलब्ध है";

        status.classList.remove(
            "offline"
        );

        status.classList.add(
            "online"
        );

        status.setAttribute(
            "aria-hidden",
            "true"
        );

    } else {

        status.textContent =
            "इंटरनेट कनेक्शन उपलब्ध नहीं है";

        status.classList.remove(
            "online"
        );

        status.classList.add(
            "offline"
        );

        status.setAttribute(
            "aria-hidden",
            "false"
        );

    }

}


/* ============================================================
   NETWORK EVENTS EXTENSION
============================================================ */

window.addEventListener(
    "awaaz:network",
    event => {

        updateNetworkStatusUI(
            Boolean(
                event.detail?.online
            )
        );

    }
);


/* ============================================================
   SCROLL TO TOP
============================================================ */

function scrollToTop(
    behavior = "smooth"
) {

    window.scrollTo(
        {

            top:
                0,

            behavior:
                behavior

        }
    );

}


/* ============================================================
   SCROLL TO ELEMENT
============================================================ */

function scrollToElement(
    element,
    offset = 0
) {

    if (
        typeof element ===
        "string"
    ) {

        element =
            document.querySelector(
                element
            );

    }


    if (
        !element
    ) {

        return;

    }


    const rect =
        element.getBoundingClientRect();


    const top =
        window.scrollY +
        rect.top -
        Number(offset || 0);


    window.scrollTo(
        {

            top:
                Math.max(
                    0,
                    top
                ),

            behavior:
                "smooth"

        }
    );

}


/* ============================================================
   SCROLL BUTTON VISIBILITY
============================================================ */

function updateScrollTopButton() {

    const button =
        DOM.scrollTopButton ||
        document.querySelector(
            ".scroll-to-top, #scrollTop"
        );


    if (!button) {

        return;

    }


    const shouldShow =
        window.scrollY >
        450;


    button.classList.toggle(
        "visible",
        shouldShow
    );


    button.setAttribute(
        "aria-hidden",
        shouldShow
            ? "false"
            : "true"
    );

}


window.addEventListener(
    "scroll",
    throttle(
        updateScrollTopButton,
        100
    ),
    {
        passive: true
    }
);


/* ============================================================
   SCROLL BUTTON CLICK
============================================================ */

document.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                ".scroll-to-top, #scrollTop"
            );


        if (!button) {

            return;

        }


        event.preventDefault();

        scrollToTop();

    }
);


/* ============================================================
   IMAGE ERROR HANDLER
============================================================ */

document.addEventListener(
    "error",
    event => {

        const image =
            event.target;


        if (
            !image ||
            image.tagName !==
                "IMG"
        ) {

            return;

        }


        if (
            image.dataset.fallbackApplied
        ) {

            return;

        }


        image.dataset.fallbackApplied =
            "true";


        image.src =
            APP_CONFIG.imagePlaceholder;

    },
    true
);


/* ============================================================
   LAZY IMAGE INITIALIZATION
============================================================ */

function initializeLazyImages() {

    const images =
        $$(
            "img[data-src]"
        );


    if (
        !images.length
    ) {

        return;

    }


    if (
        "IntersectionObserver"
        in window
    ) {

        const observer =
            new IntersectionObserver(
                entries => {

                    entries.forEach(
                        entry => {

                            if (
                                !entry.isIntersecting
                            ) {

                                return;

                            }


                            const image =
                                entry.target;


                            const source =
                                image.dataset.src;


                            if (source) {

                                image.src =
                                    normalizeImageURL(
                                        source
                                    );

                            }


                            image.removeAttribute(
                                "data-src"
                            );


                            observer.unobserve(
                                image
                            );

                        }
                    );

                },
                {

                    rootMargin:
                        "250px 0px"

                }
            );


        images.forEach(
            image => {

                observer.observe(
                    image
                );

            }
        );


        return;

    }


    images.forEach(
        image => {

            image.src =
                normalizeImageURL(
                    image.dataset.src
                );

            image.removeAttribute(
                "data-src"
            );

        }
    );

}


/* ============================================================
   INITIALIZE UI HELPERS AFTER DOM READY
============================================================ */

window.addEventListener(
    "awaaz:ready",
    () => {

        refreshDOMCache();

        initializeLazyImages();

        updateScrollTopButton();

        updateNetworkStatusUI(
            navigator.onLine
        );

    },
    {
        once: true
    }
);


/* ============================================================
   EXPORT UI HELPERS
============================================================ */

window.AwaazRajasthan.ui = {

    showLoading,

    hideLoading,

    showToast,

    toastSuccess,

    toastError,

    toastWarning,

    toastInfo,

    openModal,

    closeModal,

    scrollToTop,

    scrollToElement,

    initializeLazyImages,

    updateNetworkStatusUI

};


/* ============================================================
   END OF PART 3/30
============================================================ */
/* ============================================================
   AAWAAZ RAJASTHAN
   SCRIPT.JS — PART 4/30

   MOBILE MENU
   DESKTOP NAVIGATION
   CATEGORY NAVIGATION
   HEADER INTERACTIONS
   STICKY HEADER
============================================================ */


/* ============================================================
   MOBILE MENU ELEMENTS
============================================================ */

function getMobileMenuElements() {

    const menu =
        document.querySelector(
            ".mobile-menu, .mobile-navigation, #mobileMenu"
        );


    const overlay =
        document.querySelector(
            ".mobile-menu-overlay, .menu-overlay"
        );


    const toggle =
        document.querySelector(
            ".menu-toggle, .mobile-menu-toggle, #menuToggle"
        );


    const close =
        document.querySelector(
            ".menu-close, .mobile-menu-close, #menuClose"
        );


    return {

        menu,

        overlay,

        toggle,

        close

    };

}


/* ============================================================
   CREATE MOBILE MENU OVERLAY
============================================================ */

function ensureMobileMenuOverlay() {

    let overlay =
        document.querySelector(
            ".mobile-menu-overlay, .menu-overlay"
        );


    if (overlay) {

        return overlay;

    }


    overlay =
        createElement(
            "div",
            {

                className:
                    "mobile-menu-overlay",

                attributes: {

                    "aria-hidden":
                        "true"

                }

            }
        );


    document.body.appendChild(
        overlay
    );


    overlay.addEventListener(
        "click",
        () => {

            closeMobileMenu();

        }
    );


    return overlay;

}


/* ============================================================
   OPEN MOBILE MENU
============================================================ */

function openMobileMenu() {

    const {

        menu,
        toggle

    } =
        getMobileMenuElements();


    if (!menu) {

        return;

    }


    const overlay =
        ensureMobileMenuOverlay();


    menu.classList.add(
        "is-open",
        "open",
        "active"
    );


    overlay.classList.add(
        "is-open",
        "open",
        "active"
    );


    menu.setAttribute(
        "aria-hidden",
        "false"
    );


    overlay.setAttribute(
        "aria-hidden",
        "false"
    );


    if (toggle) {

        toggle.classList.add(
            "active"
        );


        toggle.setAttribute(
            "aria-expanded",
            "true"
        );

    }


    document.body.classList.add(
        "menu-open"
    );


    AppState.menuOpen =
        true;

}


/* ============================================================
   CLOSE MOBILE MENU
============================================================ */

function closeMobileMenu() {

    const {

        menu,
        toggle

    } =
        getMobileMenuElements();


    const overlay =
        document.querySelector(
            ".mobile-menu-overlay, .menu-overlay"
        );


    if (menu) {

        menu.classList.remove(
            "is-open",
            "open",
            "active"
        );


        menu.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    if (overlay) {

        overlay.classList.remove(
            "is-open",
            "open",
            "active"
        );


        overlay.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    if (toggle) {

        toggle.classList.remove(
            "active"
        );


        toggle.setAttribute(
            "aria-expanded",
            "false"
        );

    }


    document.body.classList.remove(
        "menu-open"
    );


    AppState.menuOpen =
        false;

}


/* ============================================================
   TOGGLE MOBILE MENU
============================================================ */

function toggleMobileMenu() {

    if (
        AppState.menuOpen
    ) {

        closeMobileMenu();

    } else {

        openMobileMenu();

    }

}


/* ============================================================
   MENU TOGGLE EVENTS
============================================================ */

document.addEventListener(
    "click",
    event => {

        const toggle =
            event.target.closest(
                ".menu-toggle, .mobile-menu-toggle, #menuToggle"
            );


        if (!toggle) {

            return;

        }


        event.preventDefault();

        toggleMobileMenu();

    }
);


/* ============================================================
   MENU CLOSE EVENTS
============================================================ */

document.addEventListener(
    "click",
    event => {

        const close =
            event.target.closest(
                ".menu-close, .mobile-menu-close, #menuClose"
            );


        if (!close) {

            return;

        }


        event.preventDefault();

        closeMobileMenu();

    }
);


/* ============================================================
   CLOSE MENU AFTER NAVIGATION
============================================================ */

document.addEventListener(
    "click",
    event => {

        const link =
            event.target.closest(
                ".mobile-menu a, .mobile-navigation a"
            );


        if (!link) {

            return;

        }


        closeMobileMenu();

    }
);


/* ============================================================
   CLOSE MENU ON DESKTOP
============================================================ */

function handleResponsiveMenu() {

    if (
        window.innerWidth >= 768 &&
        AppState.menuOpen
    ) {

        closeMobileMenu();

    }

}


window.addEventListener(
    "resize",
    debounce(
        handleResponsiveMenu,
        150
    )
);


/* ============================================================
   CATEGORY NAVIGATION
============================================================ */

function getCategoryValue(
    element
) {

    if (!element) {

        return "";

    }


    return normalizeText(
        element.dataset.category ||
        element.dataset.slug ||
        element.getAttribute(
            "data-category"
        ) ||
        element.getAttribute(
            "data-slug"
        ) ||
        element.textContent
    );

}


/* ============================================================
   CATEGORY URL
============================================================ */

function buildCategoryURL(
    category
) {

    const cleanCategory =
        normalizeText(
            category
        );


    if (!cleanCategory) {

        return "#";

    }


    return `/category/${encodeURIComponent(
        cleanCategory
    )}`;

}


/* ============================================================
   SET ACTIVE CATEGORY
============================================================ */

function setActiveCategory(
    category
) {

    const cleanCategory =
        normalizeText(
            category
        );


    AppState.currentCategory =
        cleanCategory ||
        null;


    const categoryLinks =
        $$(
            "[data-category], [data-slug]"
        );


    categoryLinks.forEach(
        link => {

            const value =
                getCategoryValue(
                    link
                );


            const isActive =
                cleanCategory &&
                (
                    value ===
                        cleanCategory ||
                    value.toLowerCase() ===
                        cleanCategory.toLowerCase()
                );


            link.classList.toggle(
                "active",
                Boolean(isActive)
            );


            if (
                isActive
            ) {

                link.setAttribute(
                    "aria-current",
                    "page"
                );

            } else {

                link.removeAttribute(
                    "aria-current"
                );

            }

        }
    );

}


/* ============================================================
   CATEGORY CLICK
============================================================ */

async function handleCategoryClick(
    element
) {

    const category =
        getCategoryValue(
            element
        );


    if (!category) {

        return;

    }


    setActiveCategory(
        category
    );


    closeMobileMenu();


    window.dispatchEvent(
        new CustomEvent(
            "awaaz:category",
            {

                detail: {

                    category:
                        category

                }

            }
        )
    );


    if (
        typeof loadNewsByCategory ===
        "function"
    ) {

        try {

            await loadNewsByCategory(
                category,
                1
            );

        } catch (error) {

            handleGlobalError(
                error,
                "Category Navigation"
            );

        }

    }

}


/* ============================================================
   CATEGORY EVENT DELEGATION
============================================================ */

document.addEventListener(
    "click",
    event => {

        const element =
            event.target.closest(
                "[data-category], [data-slug]"
            );


        if (!element) {

            return;

        }


        const insideNavigation =
            element.closest(
                ".main-navigation, .main-nav, .mobile-menu, .mobile-navigation, .category-nav"
            );


        if (!insideNavigation) {

            return;

        }


        event.preventDefault();

        handleCategoryClick(
            element
        );

    }
);


/* ============================================================
   HEADER SCROLL STATE
============================================================ */

let lastScrollY =
    window.scrollY;


/* ============================================================
   UPDATE HEADER SCROLL STATE
============================================================ */

function updateHeaderScrollState() {

    const header =
        DOM.header ||
        document.querySelector(
            ".site-header, .main-header, header"
        );


    if (!header) {

        return;

    }


    const currentScrollY =
        window.scrollY;


    header.classList.toggle(
        "scrolled",
        currentScrollY > 20
    );


    if (
        currentScrollY >
        lastScrollY &&
        currentScrollY > 120
    ) {

        header.classList.add(
            "scroll-down"
        );

        header.classList.remove(
            "scroll-up"
        );

    } else if (
        currentScrollY <
        lastScrollY
    ) {

        header.classList.add(
            "scroll-up"
        );

        header.classList.remove(
            "scroll-down"
        );

    }


    lastScrollY =
        currentScrollY;

}


/* ============================================================
   HEADER SCROLL LISTENER
============================================================ */

window.addEventListener(
    "scroll",
    throttle(
        updateHeaderScrollState,
        80
    ),
    {
        passive: true
    }
);


/* ============================================================
   STICKY HEADER OBSERVER
============================================================ */

function initializeStickyHeader() {

    const header =
        DOM.header ||
        document.querySelector(
            ".site-header, .main-header, header"
        );


    if (!header) {

        return;

    }


    if (
        !header.classList.contains(
            "sticky"
        ) &&
        getComputedStyle(
            header
        ).position !==
            "sticky"
    ) {

        return;

    }


    updateHeaderScrollState();

}


/* ============================================================
   NAVIGATION KEYBOARD SUPPORT
============================================================ */

function initializeNavigationKeyboard() {

    const navigationItems =
        $$(
            ".main-navigation a, .main-nav a, .mobile-menu a, .mobile-navigation a"
        );


    navigationItems.forEach(
        item => {

            item.addEventListener(
                "keydown",
                event => {

                    if (
                        event.key !==
                        "Enter"
                    ) {

                        return;

                    }


                    item.click();

                }
            );

        }
    );

}


/* ============================================================
   DROPDOWN NAVIGATION
============================================================ */

function closeAllNavDropdowns(
    except = null
) {

    const dropdowns =
        $$(
            ".nav-dropdown.is-open, .nav-item.has-dropdown.is-open"
        );


    dropdowns.forEach(
        dropdown => {

            if (
                dropdown ===
                except
            ) {

                return;

            }


            dropdown.classList.remove(
                "is-open"
            );


            const trigger =
                dropdown.querySelector(
                    "[aria-expanded]"
                );


            if (trigger) {

                trigger.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }

        }
    );

}


/* ============================================================
   DROPDOWN TOGGLE
============================================================ */

function toggleNavDropdown(
    trigger
) {

    if (!trigger) {

        return;

    }


    const parent =
        trigger.closest(
            ".nav-item, .has-dropdown"
        );


    if (!parent) {

        return;

    }


    const isOpen =
        parent.classList.contains(
            "is-open"
        );


    closeAllNavDropdowns(
        isOpen
            ? null
            : parent
    );


    parent.classList.toggle(
        "is-open",
        !isOpen
    );


    trigger.setAttribute(
        "aria-expanded",
        isOpen
            ? "false"
            : "true"
    );

}


/* ============================================================
   DROPDOWN EVENTS
============================================================ */

document.addEventListener(
    "click",
    event => {

        const trigger =
            event.target.closest(
                ".nav-dropdown-toggle, .dropdown-toggle, [data-dropdown-toggle]"
            );


        if (!trigger) {

            return;

        }


        event.preventDefault();

        toggleNavDropdown(
            trigger
        );

    }
);


/* ============================================================
   CLOSE DROPDOWNS OUTSIDE
============================================================ */

document.addEventListener(
    "click",
    event => {

        if (
            event.target.closest(
                ".nav-item.has-dropdown, .nav-dropdown"
            )
        ) {

            return;

        }


        closeAllNavDropdowns();

    }
);


/* ============================================================
   MOBILE MENU BODY ESCAPE
============================================================ */

window.addEventListener(
    "orientationchange",
    () => {

        setTimeout(
            handleResponsiveMenu,
            100
        );

    }
);


/* ============================================================
   INITIALIZE NAVIGATION
============================================================ */

window.addEventListener(
    "awaaz:ready",
    () => {

        refreshDOMCache();

        ensureMobileMenuOverlay();

        initializeStickyHeader();

        initializeNavigationKeyboard();

    }
);


/* ============================================================
   EXPORT NAVIGATION API
============================================================ */

window.AwaazRajasthan.navigation = {

    openMobileMenu,

    closeMobileMenu,

    toggleMobileMenu,

    setActiveCategory,

    handleCategoryClick,

    buildCategoryURL,

    toggleNavDropdown,

    closeAllNavDropdowns

};


/* ============================================================
   END OF PART 4/30
============================================================ */
/* ============================================================
   AAWAAZ RAJASTHAN
   SCRIPT.JS — PART 5/30

   SEARCH SYSTEM
   SEARCH UI
   SEARCH QUERY
   SEARCH RESULTS
   SEARCH HISTORY
============================================================ */


/* ============================================================
   SEARCH CONFIGURATION
============================================================ */

const SEARCH_CONFIG = {

    minQueryLength:
        2,

    debounceDelay:
        350,

    resultsPerPage:
        10,

    historyKey:
        "awaaz_search_history",

    maxHistoryItems:
        8

};


/* ============================================================
   SEARCH STATE
============================================================ */

const SearchState = {

    open:
        false,

    query:
        "",

    page:
        1,

    totalPages:
        1,

    results:
        [],

    loading:
        false,

    history:
        getStorage(
            SEARCH_CONFIG.historyKey,
            []
        )

};


/* ============================================================
   GET SEARCH ELEMENTS
============================================================ */

function getSearchElements() {

    return {

        form:
            document.querySelector(
                "#searchForm, .search-form"
            ),

        input:
            document.querySelector(
                "#searchInput, .search-input"
            ),

        button:
            document.querySelector(
                "#searchButton, .search-button, .search-toggle"
            ),

        container:
            document.querySelector(
                ".search-container, .search-box"
            ),

        results:
            document.querySelector(
                "#searchResults, .search-results"
            ),

        overlay:
            document.querySelector(
                ".search-overlay"
            ),

        close:
            document.querySelector(
                ".search-close"
            )

    };

}


/* ============================================================
   CREATE SEARCH OVERLAY
============================================================ */

function ensureSearchOverlay() {

    let overlay =
        document.querySelector(
            ".search-overlay"
        );


    if (overlay) {

        return overlay;

    }


    overlay =
        createElement(
            "div",
            {

                className:
                    "search-overlay",

                attributes: {

                    "aria-hidden":
                        "true"

                }

            }
        );


    const panel =
        createElement(
            "div",
            {

                className:
                    "search-overlay-panel"

            }
        );


    const header =
        createElement(
            "div",
            {

                className:
                    "search-overlay-header"

            }
        );


    const title =
        createElement(
            "h2",
            {

                className:
                    "search-overlay-title",

                text:
                    "समाचार खोजें"

            }
        );


    const close =
        createElement(
            "button",
            {

                className:
                    "search-close",

                text:
                    "×",

                attributes: {

                    type:
                        "button",

                    "aria-label":
                        "खोज बंद करें"

                }

            }
        );


    header.appendChild(
        title
    );

    header.appendChild(
        close
    );


    const form =
        createElement(
            "form",
            {

                className:
                    "search-form",

                attributes: {

                    id:
                        "dynamicSearchForm"

                }

            }
        );


    const input =
        createElement(
            "input",
            {

                className:
                    "search-input",

                attributes: {

                    type:
                        "search",

                    name:
                        "q",

                    placeholder:
                        "समाचार खोजें...",

                    autocomplete:
                        "off",

                    "aria-label":
                        "समाचार खोजें"

                }

            }
        );


    const button =
        createElement(
            "button",
            {

                className:
                    "search-button",

                text:
                    "खोजें",

                attributes: {

                    type:
                        "submit"

                }

            }
        );


    form.appendChild(
        input
    );

    form.appendChild(
        button
    );


    const results =
        createElement(
            "div",
            {

                className:
                    "search-results",

                attributes: {

                    id:
                        "searchResults",

                    "aria-live":
                        "polite"

                }

            }
        );


    panel.appendChild(
        header
    );

    panel.appendChild(
        form
    );

    panel.appendChild(
        results
    );


    overlay.appendChild(
        panel
    );


    document.body.appendChild(
        overlay
    );


    close.addEventListener(
        "click",
        closeSearch
    );


    overlay.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                overlay
            ) {

                closeSearch();

            }

        }
    );


    form.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            const value =
                input.value;

            performSearch(
                value,
                1
            );

        }
    );


    return overlay;

}


/* ============================================================
   OPEN SEARCH
============================================================ */

function openSearch(
    initialQuery = ""
) {

    const overlay =
        ensureSearchOverlay();


    const input =
        overlay.querySelector(
            ".search-input"
        );


    overlay.classList.add(
        "is-open",
        "open",
        "active"
    );


    overlay.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.classList.add(
        "search-open"
    );


    SearchState.open =
        true;


    AppState.searchOpen =
        true;


    if (input) {

        input.value =
            initialQuery ||
            SearchState.query ||
            "";


        setTimeout(
            () => {

                input.focus();

                input.select();

            },
            50
        );

    }


    renderSearchHistory();

}


/* ============================================================
   CLOSE SEARCH
============================================================ */

function closeSearch() {

    const overlay =
        document.querySelector(
            ".search-overlay"
        );


    if (overlay) {

        overlay.classList.remove(
            "is-open",
            "open",
            "active"
        );


        overlay.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    document.body.classList.remove(
        "search-open"
    );


    SearchState.open =
        false;


    AppState.searchOpen =
        false;

}


/* ============================================================
   TOGGLE SEARCH
============================================================ */

function toggleSearch() {

    if (
        SearchState.open
    ) {

        closeSearch();

    } else {

        openSearch();

    }

}


/* ============================================================
   SEARCH BUTTON EVENT
============================================================ */

document.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                ".search-toggle, .search-button-toggle, #searchToggle"
            );


        if (!button) {

            return;

        }


        if (
            button.closest(
                ".search-overlay"
            )
        ) {

            return;

        }


        event.preventDefault();

        openSearch();

    }
);


/* ============================================================
   SEARCH HISTORY
============================================================ */

function getSearchHistory() {

    const history =
        getStorage(
            SEARCH_CONFIG.historyKey,
            []
        );


    if (
        !Array.isArray(history)
    ) {

        return [];

    }


    return history
        .map(
            item =>
                normalizeText(item)
        )
        .filter(Boolean)
        .slice(
            0,
            SEARCH_CONFIG.maxHistoryItems
        );

}


/* ============================================================
   SAVE SEARCH HISTORY
============================================================ */

function saveSearchHistory(
    query
) {

    const cleanQuery =
        normalizeText(
            query
        );


    if (
        cleanQuery.length <
        SEARCH_CONFIG.minQueryLength
    ) {

        return;

    }


    let history =
        getSearchHistory();


    history =
        history.filter(
            item =>
                item.toLowerCase() !==
                cleanQuery.toLowerCase()
        );


    history.unshift(
        cleanQuery
    );


    history =
        history.slice(
            0,
            SEARCH_CONFIG.maxHistoryItems
        );


    SearchState.history =
        history;


    setStorage(
        SEARCH_CONFIG.historyKey,
        history
    );

}


/* ============================================================
   REMOVE SEARCH HISTORY ITEM
============================================================ */

function removeSearchHistoryItem(
    query
) {

    const cleanQuery =
        normalizeText(
            query
        );


    const history =
        getSearchHistory()
            .filter(
                item =>
                    item.toLowerCase() !==
                    cleanQuery.toLowerCase()
            );


    SearchState.history =
        history;


    setStorage(
        SEARCH_CONFIG.historyKey,
        history
    );


    renderSearchHistory();

}


/* ============================================================
   CLEAR SEARCH HISTORY
============================================================ */

function clearSearchHistory() {

    SearchState.history =
        [];


    removeStorage(
        SEARCH_CONFIG.historyKey
    );


    renderSearchHistory();

}


/* ============================================================
   RENDER SEARCH HISTORY
============================================================ */

function renderSearchHistory() {

    const overlay =
        document.querySelector(
            ".search-overlay"
        );


    if (!overlay) {

        return;

    }


    const results =
        overlay.querySelector(
            ".search-results"
        );


    if (!results) {

        return;

    }


    const history =
        getSearchHistory();


    if (
        !history.length
    ) {

        results.innerHTML =
            `
            <div class="search-history-empty">
                <div class="search-history-icon">
                    🔍
                </div>
                <p>
                    अपने पसंदीदा समाचार खोजने के लिए ऊपर खोज करें।
                </p>
            </div>
            `;

        return;

    }


    const wrapper =
        createElement(
            "div",
            {

                className:
                    "search-history"

            }
        );


    const heading =
        createElement(
            "div",
            {

                className:
                    "search-history-header"

            }
        );


    const title =
        createElement(
            "strong",
            {

                text:
                    "हाल की खोजें"

            }
        );


    const clearButton =
        createElement(
            "button",
            {

                className:
                    "search-history-clear",

                text:
                    "साफ करें",

                attributes: {

                    type:
                        "button"

                }

            }
        );


    clearButton.addEventListener(
        "click",
        clearSearchHistory
    );


    heading.appendChild(
        title
    );

    heading.appendChild(
        clearButton
    );


    wrapper.appendChild(
        heading
    );


    const list =
        createElement(
            "div",
            {

                className:
                    "search-history-list"

            }
        );


    history.forEach(
        query => {

            const item =
                createElement(
                    "div",
                    {

                        className:
                            "search-history-item"

                    }
                );


            const searchButton =
                createElement(
                    "button",
                    {

                        className:
                            "search-history-query",

                        text:
                            query,

                        attributes: {

                            type:
                                "button",

                            "aria-label":
                                `खोजें ${query}`

                        }

                    }
                );


            searchButton.addEventListener(
                "click",
                () => {

                    performSearch(
                        query,
                        1
                    );

                }
            );


            const removeButton =
                createElement(
                    "button",
                    {

                        className:
                            "search-history-remove",

                        text:
                            "×",

                        attributes: {

                            type:
                                "button",

                            "aria-label":
                                `${query} हटाएं`

                        }

                    }
                );


            removeButton.addEventListener(
                "click",
                () => {

                    removeSearchHistoryItem(
                        query
                    );

                }
            );


            item.appendChild(
                searchButton
            );

            item.appendChild(
                removeButton
            );


            list.appendChild(
                item
            );

        }
    );


    wrapper.appendChild(
        list
    );


    results.replaceChildren(
        wrapper
    );

}


/* ============================================================
   SEARCH VALIDATION
============================================================ */

function validateSearchQuery(
    query
) {

    const cleanQuery =
        normalizeText(
            query
        );


    if (
        cleanQuery.length ===
        0
    ) {

        return {

            valid:
                false,

            message:
                "कृपया कुछ खोजें।",

            query:
                ""

        };

    }


    if (
        cleanQuery.length <
        SEARCH_CONFIG.minQueryLength
    ) {

        return {

            valid:
                false,

            message:
                "कृपया कम से कम 2 अक्षर दर्ज करें।",

            query:
                cleanQuery

        };

    }


    if (
        cleanQuery.length >
        150
    ) {

        return {

            valid:
                false,

            message:
                "खोज 150 अक्षरों से अधिक नहीं हो सकती।",

            query:
                cleanQuery.slice(
                    0,
                    150
                )

        };

    }


    return {

        valid:
            true,

        message:
            "",

        query:
            cleanQuery

    };

}


/* ============================================================
   SEARCH LOADING UI
============================================================ */

function renderSearchLoading() {

    const overlay =
        document.querySelector(
            ".search-overlay"
        );


    const results =
        overlay?.querySelector(
            ".search-results"
        );


    if (!results) {

        return;

    }


    results.innerHTML =
        `
        <div class="search-loading">
            <div class="loading-spinner"
                 aria-hidden="true">
            </div>
            <p>समाचार खोजे जा रहे हैं...</p>
        </div>
        `;

}


/* ============================================================
   SEARCH EMPTY UI
============================================================ */

function renderSearchEmpty(
    query
) {

    const overlay =
        document.querySelector(
            ".search-overlay"
        );


    const results =
        overlay?.querySelector(
            ".search-results"
        );


    if (!results) {

        return;

    }


    results.innerHTML =
        `
        <div class="search-empty">
            <div class="search-empty-icon">
                🔎
            </div>
            <h3>कोई समाचार नहीं मिला</h3>
            <p>
                "${escapeHTML(query)}"
                के लिए कोई समाचार उपलब्ध नहीं है।
            </p>
            <p>
                किसी दूसरे शब्द या विषय से खोजने का प्रयास करें।
            </p>
        </div>
        `;

}


/* ============================================================
   SEARCH ERROR UI
============================================================ */

function renderSearchError(
    message
) {

    const overlay =
        document.querySelector(
            ".search-overlay"
        );


    const results =
        overlay?.querySelector(
            ".search-results"
        );


    if (!results) {

        return;

    }


    results.innerHTML =
        `
        <div class="search-error">
            <div class="search-error-icon">
                ⚠
            </div>
            <h3>खोज पूरी नहीं हो सकी</h3>
            <p>
                ${escapeHTML(
                    message ||
                    "कृपया पुनः प्रयास करें।"
                )}
            </p>
            <button
                type="button"
                class="search-retry-button">
                पुनः प्रयास करें
            </button>
        </div>
        `;


    const retry =
        results.querySelector(
            ".search-retry-button"
        );


    if (retry) {

        retry.addEventListener(
            "click",
            () => {

                performSearch(
                    SearchState.query,
                    SearchState.page
                );

            }
        );

    }

}


/* ============================================================
   PERFORM SEARCH
============================================================ */

async function performSearch(
    query,
    page = 1
) {

    const validation =
        validateSearchQuery(
            query
        );


    if (
        !validation.valid
    ) {

        toastWarning(
            validation.message
        );

        return;

    }


    const cleanQuery =
        validation.query;


    SearchState.query =
        cleanQuery;

    SearchState.page =
        Number(page) || 1;

    SearchState.loading =
        true;


    openSearch(
        cleanQuery
    );


    const overlay =
        document.querySelector(
            ".search-overlay"
        );


    const input =
        overlay?.querySelector(
            ".search-input"
        );


    if (input) {

        input.value =
            cleanQuery;

    }


    renderSearchLoading();


    try {

        const response =
            await apiGet(
                API_ENDPOINTS.search,
                {

                    q:
                        cleanQuery,

                    page:
                        SearchState.page,

                    limit:
                        SEARCH_CONFIG.resultsPerPage

                },
                {

                    useCache:
                        false

                }
            );


        const results =
            normalizeNewsList(
                response
            );


        const pagination =
            normalizePagination(
                response
            );


        SearchState.results =
            results;

        SearchState.totalPages =
            pagination.totalPages;

        SearchState.loading =
            false;


        saveSearchHistory(
            cleanQuery
        );


        renderSearchResults(
            results,
            cleanQuery,
            pagination
        );


    } catch (error) {

        SearchState.loading =
            false;


        handleGlobalError(
            error,
            "Search"
        );


        renderSearchError(
            error.message
        );

    }

}


/* ============================================================
   SEARCH INPUT LIVE STATE
============================================================ */

function initializeSearchInput() {

    const input =
        document.querySelector(
            "#searchInput, .search-input"
        );


    if (!input) {

        return;

    }


    input.addEventListener(
        "input",
        debounce(
            event => {

                const value =
                    normalizeText(
                        event.target.value
                    );


                SearchState.query =
                    value;

            },
            SEARCH_CONFIG.debounceDelay
        )
    );


    input.addEventListener(
        "keydown",
        event => {

            if (
                event.key ===
                "Enter"
            ) {

                event.preventDefault();

                performSearch(
                    input.value,
                    1
                );

            }

        }
    );

}


/* ============================================================
   INITIALIZE SEARCH
============================================================ */

window.addEventListener(
    "awaaz:ready",
    () => {

        ensureSearchOverlay();

        initializeSearchInput();

    }
);


/* ============================================================
   EXPORT SEARCH API
============================================================ */

window.AwaazRajasthan.search = {

    open:
        openSearch,

    close:
        closeSearch,

    toggle:
        toggleSearch,

    perform:
        performSearch,

    clearHistory:
        clearSearchHistory,

    removeHistoryItem:
        removeSearchHistoryItem,

    getHistory:
        getSearchHistory

};


/* ============================================================
   END OF PART 5/30
============================================================ */
/* ============================================================
   AAWAAZ RAJASTHAN
   SCRIPT.JS — PART 6/30

   SEARCH RESULTS RENDERING
   SEARCH RESULT CARDS
   PAGINATION
   SEARCH RESULT INTERACTIONS
============================================================ */


/* ============================================================
   SEARCH RESULT IMAGE
============================================================ */

function getSearchResultImage(
    item
) {

    const image =
        item?.image ||
        item?.thumbnail ||
        item?.featuredImage ||
        "";


    if (!image) {

        return APP_CONFIG.imagePlaceholder;

    }


    return normalizeImageURL(
        image
    );

}


/* ============================================================
   SEARCH RESULT DATE
============================================================ */

function getSearchResultDate(
    item
) {

    const date =
        item?.publishedAt ||
        item?.publishDate ||
        item?.createdAt ||
        item?.date ||
        "";


    if (!date) {

        return "";

    }


    return formatDate(
        date
    );

}


/* ============================================================
   SEARCH RESULT CARD
============================================================ */

function createSearchResultCard(
    item,
    query = ""
) {

    const article =
        normalizeNewsItem(
            item
        );


    const card =
        createElement(
            "article",
            {

                className:
                    "search-result-card",

                attributes: {

                    tabindex:
                        "0"

                }

            }
        );


    const imageWrapper =
        createElement(
            "div",
            {

                className:
                    "search-result-image"

            }
        );


    const image =
        createElement(
            "img",
            {

                attributes: {

                    src:
                        getSearchResultImage(
                            article
                        ),

                    alt:
                        article.title,

                    loading:
                        "lazy",

                    decoding:
                        "async"

                }

            }
        );


    imageWrapper.appendChild(
        image
    );


    const content =
        createElement(
            "div",
            {

                className:
                    "search-result-content"

            }
        );


    if (
        article.category
    ) {

        const category =
            createElement(
                "span",
                {

                    className:
                        "search-result-category",

                    text:
                        article.category

                }
            );


        content.appendChild(
            category
        );

    }


    const title =
        createElement(
            "h3",
            {

                className:
                    "search-result-title"

            }
        );


    const link =
        createElement(
            "a",
            {

                text:
                    article.title,

                attributes: {

                    href:
                        buildNewsURL(
                            article
                        )

                }

            }
        );


    title.appendChild(
        link
    );


    content.appendChild(
        title
    );


    if (
        article.excerpt
    ) {

        const excerpt =
            createElement(
                "p",
                {

                    className:
                        "search-result-excerpt",

                    text:
                        truncateText(
                            article.excerpt,
                            150
                        )

                }
            );


        content.appendChild(
            excerpt
        );

    }


    const meta =
        createElement(
            "div",
            {

                className:
                    "search-result-meta"

            }
        );


    const date =
        getSearchResultDate(
            article
        );


    if (date) {

        const dateElement =
            createElement(
                "time",
                {

                    text:
                        date

                }
            );


        meta.appendChild(
            dateElement
        );

    }


    if (
        article.author ||
        article.authorName
    ) {

        const author =
            createElement(
                "span",
                {

                    text:
                        normalizeText(
                            article.author ||
                            article.authorName
                        )

                }
            );


        meta.appendChild(
            author
        );

    }


    if (
        meta.children.length
    ) {

        content.appendChild(
            meta
        );

    }


    card.appendChild(
        imageWrapper
    );

    card.appendChild(
        content
    );


    card.addEventListener(
        "keydown",
        event => {

            if (
                event.key !==
                    "Enter" &&
                event.key !==
                    " "
            ) {

                return;

            }


            event.preventDefault();

            link.click();

        }
    );


    return card;

}


/* ============================================================
   HIGHLIGHT SEARCH TERM
============================================================ */

function highlightSearchTerm(
    text,
    query
) {

    const source =
        normalizeText(
            text
        );


    const search =
        normalizeText(
            query
        );


    if (
        !source ||
        !search
    ) {

        return escapeHTML(
            source
        );

    }


    const escapedQuery =
        escapeRegExp(
            search
        );


    const regex =
        new RegExp(
            `(${escapedQuery})`,
            "gi"
        );


    return escapeHTML(
        source
    ).replace(
        regex,
        "<mark>$1</mark>"
    );

}


/* ============================================================
   CREATE HIGHLIGHTED SEARCH TITLE
============================================================ */

function createHighlightedTitle(
    item,
    query
) {

    const article =
        normalizeNewsItem(
            item
        );


    const title =
        createElement(
            "h3",
            {

                className:
                    "search-result-title"

            }
        );


    const link =
        createElement(
            "a",
            {

                attributes: {

                    href:
                        buildNewsURL(
                            article
                        )

                }

            }
        );


    link.innerHTML =
        highlightSearchTerm(
            article.title,
            query
        );


    title.appendChild(
        link
    );


    return title;

}


/* ============================================================
   SEARCH RESULT COUNT TEXT
============================================================ */

function getSearchResultCountText(
    total,
    query
) {

    const count =
        Number(total) || 0;


    if (
        count === 0
    ) {

        return `“${query}” के लिए कोई परिणाम नहीं मिला`;

    }


    if (
        count === 1
    ) {

        return `“${query}” के लिए 1 समाचार मिला`;

    }


    return `“${query}” के लिए ${count} समाचार मिले`;

}


/* ============================================================
   RENDER SEARCH RESULTS
============================================================ */

function renderSearchResults(
    results,
    query,
    pagination = {}
) {

    const overlay =
        document.querySelector(
            ".search-overlay"
        );


    if (!overlay) {

        return;

    }


    const container =
        overlay.querySelector(
            ".search-results"
        );


    if (!container) {

        return;

    }


    const list =
        Array.isArray(results)
            ? results
            : [];


    if (
        !list.length
    ) {

        renderSearchEmpty(
            query
        );

        return;

    }


    const fragment =
        document.createDocumentFragment();


    const header =
        createElement(
            "div",
            {

                className:
                    "search-results-header"

            }
        );


    const count =
        Number(
            pagination.total ||
            list.length
        );


    const countText =
        createElement(
            "div",
            {

                className:
                    "search-results-count",

                text:
                    getSearchResultCountText(
                        count,
                        query
                    )

            }
        );


    header.appendChild(
        countText
    );


    fragment.appendChild(
        header
    );


    const listContainer =
        createElement(
            "div",
            {

                className:
                    "search-result-list"

            }
        );


    list.forEach(
        item => {

            const card =
                createSearchResultCard(
                    item,
                    query
                );


            const title =
                card.querySelector(
                    ".search-result-title"
                );


            if (title) {

                const highlighted =
                    createHighlightedTitle(
                        item,
                        query
                    );


                title.replaceWith(
                    highlighted
                );

            }


            listContainer.appendChild(
                card
            );

        }
    );


    fragment.appendChild(
        listContainer
    );


    const totalPages =
        Number(
            pagination.totalPages ||
            SearchState.totalPages ||
            1
        );


    if (
        totalPages > 1
    ) {

        fragment.appendChild(
            createSearchPagination(
                Number(
                    pagination.page ||
                    SearchState.page ||
                    1
                ),
                totalPages
            )
        );

    }


    container.replaceChildren(
        fragment
    );

}


/* ============================================================
   SEARCH PAGINATION BUTTON
============================================================ */

function createSearchPaginationButton(
    label,
    page,
    options = {}
) {

    const button =
        createElement(
            "button",
            {

                className:
                    "search-pagination-button",

                text:
                    label,

                attributes: {

                    type:
                        "button",

                    "aria-label":
                        options.ariaLabel ||
                        `पेज ${page}`

                }

            }
        );


    if (
        options.active
    ) {

        button.classList.add(
            "active"
        );


        button.setAttribute(
            "aria-current",
            "page"
        );

    }


    if (
        options.disabled
    ) {

        button.disabled =
            true;

    }


    button.addEventListener(
        "click",
        () => {

            if (
                button.disabled
            ) {

                return;

            }


            performSearch(
                SearchState.query,
                page
            );

        }
    );


    return button;

}


/* ============================================================
   SEARCH PAGINATION
============================================================ */

function createSearchPagination(
    currentPage,
    totalPages
) {

    const wrapper =
        createElement(
            "nav",
            {

                className:
                    "search-pagination",

                attributes: {

                    "aria-label":
                        "खोज परिणाम पेज"

                }

            }
        );


    const previous =
        createSearchPaginationButton(
            "‹",
            Math.max(
                1,
                currentPage - 1
            ),
            {

                ariaLabel:
                    "पिछला पेज",

                disabled:
                    currentPage <= 1

            }
        );


    wrapper.appendChild(
        previous
    );


    const pages =
        buildPaginationPages(
            currentPage,
            totalPages
        );


    pages.forEach(
        page => {

            if (
                page ===
                "..."
            ) {

                const separator =
                    createElement(
                        "span",
                        {

                            className:
                                "search-pagination-ellipsis",

                            text:
                                "…"

                        }
                    );


                wrapper.appendChild(
                    separator
                );


                return;

            }


            wrapper.appendChild(
                createSearchPaginationButton(
                    String(page),
                    page,
                    {

                        active:
                            page ===
                            currentPage

                    }
                )
            );

        }
    );


    const next =
        createSearchPaginationButton(
            "›",
            Math.min(
                totalPages,
                currentPage + 1
            ),
            {

                ariaLabel:
                    "अगला पेज",

                disabled:
                    currentPage >=
                    totalPages

            }
        );


    wrapper.appendChild(
        next
    );


    return wrapper;

}


/* ============================================================
   BUILD PAGINATION PAGES
============================================================ */

function buildPaginationPages(
    currentPage,
    totalPages
) {

    const current =
        Number(currentPage) || 1;


    const total =
        Number(totalPages) || 1;


    if (
        total <= 7
    ) {

        return Array.from(
            {
                length:
                    total
            },
            (
                _,
                index
            ) =>
                index + 1
        );

    }


    const pages =
        [];


    pages.push(
        1
    );


    if (
        current > 4
    ) {

        pages.push(
            "..."
        );

    }


    const start =
        Math.max(
            2,
            current - 1
        );


    const end =
        Math.min(
            total - 1,
            current + 1
        );


    for (
        let page = start;
        page <= end;
        page++
    ) {

        pages.push(
            page
        );

    }


    if (
        current <
        total - 3
    ) {

        pages.push(
            "..."
        );

    }


    pages.push(
        total
    );


    return [
        ...new Set(
            pages
        )
    ];

}


/* ============================================================
   SEARCH RESULT CARD CLICK TRACKING
============================================================ */

document.addEventListener(
    "click",
    event => {

        const link =
            event.target.closest(
                ".search-result-card a"
            );


        if (!link) {

            return;

        }


        const card =
            link.closest(
                ".search-result-card"
            );


        if (!card) {

            return;

        }


        card.classList.add(
            "visited"
        );

    }
);


/* ============================================================
   SEARCH FORM INITIALIZATION
============================================================ */

function initializeSearchForms() {

    const forms =
        $$(
            "#searchForm, .search-form"
        );


    forms.forEach(
        form => {

            if (
                form.dataset.searchInitialized ===
                "true"
            ) {

                return;

            }


            form.dataset.searchInitialized =
                "true";


            form.addEventListener(
                "submit",
                event => {

                    event.preventDefault();


                    const input =
                        form.querySelector(
                            "input[name='q'], input[type='search'], .search-input"
                        );


                    if (!input) {

                        return;

                    }


                    performSearch(
                        input.value,
                        1
                    );

                }
            );

        }
    );

}


/* ============================================================
   SEARCH URL STATE
============================================================ */

function updateSearchURL(
    query,
    page = 1
) {

    if (
        !window.history ||
        !window.history.replaceState
    ) {

        return;

    }


    const url =
        new URL(
            window.location.href
        );


    if (
        query
    ) {

        url.searchParams.set(
            "q",
            query
        );

        if (
            Number(page) > 1
        ) {

            url.searchParams.set(
                "page",
                String(page)
            );

        } else {

            url.searchParams.delete(
                "page"
            );

        }

    } else {

        url.searchParams.delete(
            "q"
        );

        url.searchParams.delete(
            "page"
        );

    }


    window.history.replaceState(
        {},
        "",
        url
    );

}


/* ============================================================
   SEARCH STATE URL SYNC
============================================================ */

window.addEventListener(
    "awaaz:search",
    event => {

        const query =
            event.detail?.query ||
            "";


        const page =
            event.detail?.page ||
            1;


        updateSearchURL(
            query,
            page
        );

    }
);


/* ============================================================
   PATCH SEARCH URL AFTER SEARCH
============================================================ */

const originalPerformSearch =
    performSearch;


performSearch =
    async function(
        query,
        page = 1
    ) {

        await originalPerformSearch(
            query,
            page
        );


        updateSearchURL(
            SearchState.query,
            SearchState.page
        );


        window.dispatchEvent(
            new CustomEvent(
                "awaaz:search",
                {

                    detail: {

                        query:
                            SearchState.query,

                        page:
                            SearchState.page,

                        results:
                            SearchState.results

                    }

                }
            )
        );

    };


/* ============================================================
   INITIAL SEARCH FROM URL
   ============================================================ */
function initializeSearchFromURL() {

    const url =
        new URL(
            window.location.href
        );


    const query =
        normalizeText(
            url.searchParams.get(
                "q"
            ) || ""
        );


    const page =
        Number(
            url.searchParams.get(
                "page"
            ) || 1
        );


    if (
        query.length >=
        SEARCH_CONFIG.minQueryLength
    ) {

        setTimeout(
            () => {

                performSearch(
                    query,
                    Math.max(
                        1,
                        page
                    )
                );

            },
            250
        );

    }

}


/* ============================================================
   SEARCH INITIALIZATION
============================================================ */

window.addEventListener(
    "awaaz:ready",
    () => {

        initializeSearchForms();

        initializeSearchFromURL();

    }
);


/* ============================================================
   SEARCH GLOBAL EXPORT
============================================================ */

window.AwaazRajasthan.search = {

    ...(window.AwaazRajasthan.search || {}),

    renderResults:
        renderSearchResults,

    createCard:
        createSearchResultCard,

    createPagination:
        createSearchPagination,

    buildPages:
        buildPaginationPages,

    highlight:
        highlightSearchTerm

};


/* ============================================================
   END OF PART 6/30
============================================================ */
/* ============================================================
   AAWAAZ RAJASTHAN
   SCRIPT.JS — PART 7/30

   NEWS DATA ENGINE
   LATEST NEWS
   BREAKING NEWS
   TRENDING NEWS
   CATEGORY NEWS
============================================================ */


/* ============================================================
   NEWS STATE
============================================================ */

const NewsState = {

    latest:
        [],

    breaking:
        [],

    trending:
        [],

    category:
        [],

    featured:
        [],

    currentPage:
        1,

    totalPages:
        1,

    loading:
        false,

    lastUpdated:
        null

};


/* ============================================================
   NEWS CACHE
============================================================ */

if (
    !AppState.newsCache ||
    !(AppState.newsCache instanceof Map)
) {

    AppState.newsCache =
        new Map();

}


/* ============================================================
   NEWS CACHE KEY
============================================================ */

function getNewsCacheKey(
    type,
    params = {}
) {

    const sortedParams =
        Object.keys(
            params
        )
        .sort()
        .map(
            key =>
                `${key}=${params[key]}`
        )
        .join("&");


    return `${type}:${sortedParams}`;

}


/* ============================================================
   GET NEWS FROM CACHE
============================================================ */

function getNewsFromCache(
    key,
    ttl = API_CACHE_TTL.news
) {

    const cached =
        AppState.newsCache.get(
            key
        );


    if (!cached) {

        return null;

    }


    if (
        Date.now() -
        cached.timestamp >
        ttl
    ) {

        AppState.newsCache.delete(
            key
        );

        return null;

    }


    return cached.data;

}


/* ============================================================
   SAVE NEWS TO CACHE
============================================================ */

function saveNewsToCache(
    key,
    data
) {

    AppState.newsCache.set(
        key,
        {

            timestamp:
                Date.now(),

            data:
                data

        }
    );

}


/* ============================================================
   BUILD NEWS QUERY
============================================================ */

function buildNewsQuery(
    options = {}
) {

    const params = {

        page:
            Number(
                options.page || 1
            ),

        limit:
            Number(
                options.limit ||
                AppState.pageSize ||
                12
            )

    };


    if (
        options.category
    ) {

        params.category =
            options.category;

    }


    if (
        options.state
    ) {

        params.state =
            options.state;

    }


    if (
        options.district
    ) {

        params.district =
            options.district;

    }


    if (
        options.city
    ) {

        params.city =
            options.city;

    }


    if (
        options.tag
    ) {

        params.tag =
            options.tag;

    }


    if (
        options.sort
    ) {

        params.sort =
            options.sort;

    }


    if (
        options.order
    ) {

        params.order =
            options.order;

    }


    if (
        options.featured !==
        undefined
    ) {

        params.featured =
            options.featured;

    }


    return params;

}


/* ============================================================
   FETCH NEWS LIST
============================================================ */

async function fetchNewsList(
    options = {}
) {

    const params =
        buildNewsQuery(
            options
        );


    const cacheType =
        options.cacheType ||
        "news";


    const cacheKey =
        getNewsCacheKey(
            cacheType,
            params
        );


    const ttl =
        options.cacheTTL ||
        API_CACHE_TTL.news;


    if (
        options.useCache !==
        false
    ) {

        const cached =
            getNewsFromCache(
                cacheKey,
                ttl
            );


        if (
            cached
        ) {

            return cached;

        }

    }


    const response =
        await apiGet(
            API_ENDPOINTS.news,
            params,
            {

                useCache:
                    false

            }
        );


    const items =
        normalizeNewsList(
            response
        );


    const pagination =
        normalizePagination(
            response
        );


    const result = {

        items:
            items,

        pagination:
            pagination,

        raw:
            response

    };


    saveNewsToCache(
        cacheKey,
        result
    );


    return result;

}


/* ============================================================
   FETCH LATEST NEWS
============================================================ */

async function fetchLatestNews(
    options = {}
) {

    const result =
        await fetchNewsList(
            {

                ...options,

                sort:
                    options.sort ||
                    "publishedAt",

                order:
                    options.order ||
                    "desc",

                cacheType:
                    "latestNews",

                cacheTTL:
                    API_CACHE_TTL.latestNews

            }
        );


    NewsState.latest =
        result.items;


    NewsState.lastUpdated =
        new Date();


    return result;

}


/* ============================================================
   FETCH BREAKING NEWS
============================================================ */

async function fetchBreakingNews(
    options = {}
) {

    const params = {

        limit:
            Number(
                options.limit ||
                10
            )

    };


    const cacheKey =
        getNewsCacheKey(
            "breakingNews",
            params
        );


    const cached =
        getNewsFromCache(
            cacheKey,
            API_CACHE_TTL.breakingNews
        );


    if (
        cached
    ) {

        NewsState.breaking =
            cached.items;

        return cached;

    }


    let response;


    try {

        response =
            await apiGet(
                API_ENDPOINTS.breakingNews,
                params,
                {

                    useCache:
                        false

                }
            );

    } catch (error) {

        /*
         * कुछ backend versions में
         * breaking news अलग endpoint पर
         * उपलब्ध नहीं हो सकता।
         *
         * ऐसी स्थिति में latest news से
         * fallback किया जाएगा।
         */

        const fallback =
            await fetchLatestNews(
                {

                    limit:
                        params.limit,

                    useCache:
                        true

                }
            );


        const fallbackItems =
            fallback.items
                .filter(
                    item =>
                        item.isBreaking ===
                            true ||
                        item.breaking ===
                            true ||
                        item.isBreakingNews ===
                            true
                );


        const result = {

            items:
                fallbackItems,

            pagination:
                fallback.pagination,

            raw:
                fallback.raw

        };


        saveNewsToCache(
            cacheKey,
            result
        );


        NewsState.breaking =
            result.items;


        return result;

    }


    const items =
        normalizeNewsList(
            response
        );


    const pagination =
        normalizePagination(
            response
        );


    const result = {

        items:
            items,

        pagination:
            pagination,

        raw:
            response

    };


    saveNewsToCache(
        cacheKey,
        result
    );


    NewsState.breaking =
        items;


    return result;

}


/* ============================================================
   FETCH TRENDING NEWS
============================================================ */

async function fetchTrendingNews(
    options = {}
) {

    const params = {

        limit:
            Number(
                options.limit ||
                8
            )

    };


    const cacheKey =
        getNewsCacheKey(
            "trendingNews",
            params
        );


    const cached =
        getNewsFromCache(
            cacheKey,
            API_CACHE_TTL.trendingNews
        );


    if (
        cached
    ) {

        NewsState.trending =
            cached.items;

        return cached;

    }


    let response;


    try {

        response =
            await apiGet(
                API_ENDPOINTS.trendingNews,
                params,
                {

                    useCache:
                        false

                }
            );

    } catch (error) {

        /*
         * Trending endpoint unavailable होने पर
         * latest news को fallback बनाया जा रहा है।
         */

        const fallback =
            await fetchLatestNews(
                {

                    limit:
                        params.limit,

                    useCache:
                        true

                }
            );


        const fallbackItems =
            [...fallback.items]
                .sort(
                    (
                        first,
                        second
                    ) => {

                        const firstViews =
                            Number(
                                first.views ||
                                first.viewCount ||
                                0
                            );


                        const secondViews =
                            Number(
                                second.views ||
                                second.viewCount ||
                                0
                            );


                        return (
                            secondViews -
                            firstViews
                        );

                    }
                );


        const result = {

            items:
                fallbackItems.slice(
                    0,
                    params.limit
                ),

            pagination:
                fallback.pagination,

            raw:
                fallback.raw

        };


        saveNewsToCache(
            cacheKey,
            result
        );


        NewsState.trending =
            result.items;


        return result;

    }


    const items =
        normalizeNewsList(
            response
        );


    const pagination =
        normalizePagination(
            response
        );


    const result = {

        items:
            items,

        pagination:
            pagination,

        raw:
            response

    };


    saveNewsToCache(
        cacheKey,
        result
    );


    NewsState.trending =
        items;


    return result;

}


/* ============================================================
   FETCH FEATURED NEWS
============================================================ */

async function fetchFeaturedNews(
    options = {}
) {

    const result =
        await fetchNewsList(
            {

                ...options,

                featured:
                    true,

                limit:
                    options.limit ||
                    6,

                cacheType:
                    "featuredNews",

                cacheTTL:
                    API_CACHE_TTL.news

            }
        );


    NewsState.featured =
        result.items;


    return result;

}


/* ============================================================
   FETCH CATEGORY NEWS
============================================================ */

async function fetchCategoryNews(
    category,
    options = {}
) {

    const cleanCategory =
        normalizeText(
            category
        );


    if (
        !cleanCategory
    ) {

        return {

            items:
                [],

            pagination:
                normalizePagination(
                    {}
                ),

            raw:
                null

        };

    }


    const result =
        await fetchNewsList(
            {

                ...options,

                category:
                    cleanCategory,

                cacheType:
                    `category:${cleanCategory}`

            }
        );


    NewsState.category =
        result.items;


    NewsState.currentPage =
        result.pagination.page;


    NewsState.totalPages =
        result.pagination.totalPages;


    return result;

}


/* ============================================================
   LOAD NEWS BY CATEGORY
============================================================ */

async function loadNewsByCategory(
    category,
    page = 1,
    options = {}
) {

    const cleanCategory =
        normalizeText(
            category
        );


    if (
        !cleanCategory
    ) {

        return;

    }


    NewsState.loading =
        true;


    const target =
        options.target ||
        document.querySelector(
            "#newsGrid, .news-grid, .category-news-grid"
        );


    if (
        options.showLoading !==
        false
    ) {

        showLoading(
            "समाचार लोड हो रहे हैं..."
        );

    }


    try {

        const result =
            await fetchCategoryNews(
                cleanCategory,
                {

                    ...options,

                    page:
                        page

                }
            );


        NewsState.category =
            result.items;


        NewsState.currentPage =
            result.pagination.page;


        NewsState.totalPages =
            result.pagination.totalPages;


        setActiveCategory(
            cleanCategory
        );


        if (
            target &&
            typeof renderNewsGrid ===
                "function"
        ) {

            renderNewsGrid(
                result.items,
                target,
                {

                    category:
                        cleanCategory,

                    pagination:
                        result.pagination

                }
            );

        }


        window.dispatchEvent(
            new CustomEvent(
                "awaaz:news-loaded",
                {

                    detail: {

                        type:
                            "category",

                        category:
                            cleanCategory,

                        items:
                            result.items,

                        pagination:
                            result.pagination

                    }

                }
            )
        );


        return result;

    } catch (error) {

        handleGlobalError(
            error,
            "Category News"
        );


        throw error;

    } finally {

        NewsState.loading =
            false;


        if (
            options.showLoading !==
            false
        ) {

            hideLoading();

        }

    }

}


/* ============================================================
   LOAD LATEST NEWS
============================================================ */

async function loadLatestNews(
    options = {}
) {

    const target =
        options.target ||
        document.querySelector(
            "#latestNews, .latest-news-grid, .news-grid"
        );


    if (
        options.showLoading
    ) {

        showLoading(
            "ताज़ा समाचार लोड हो रहे हैं..."
        );

    }


    try {

        const result =
            await fetchLatestNews(
                options
            );


        if (
            target &&
            typeof renderNewsGrid ===
                "function"
        ) {

            renderNewsGrid(
                result.items,
                target,
                {

                    pagination:
                        result.pagination,

                    type:
                        "latest"

                }
            );

        }


        window.dispatchEvent(
            new CustomEvent(
                "awaaz:latest-news",
                {

                    detail:
                        result

                }
            )
        );


        return result;

    } finally {

        if (
            options.showLoading
        ) {

            hideLoading();

        }

    }

}


/* ============================================================
   LOAD BREAKING NEWS
============================================================ */

async function loadBreakingNews(
    options = {}
) {

    try {

        const result =
            await fetchBreakingNews(
                options
            );


        if (
            typeof renderBreakingNews ===
            "function"
        ) {

            renderBreakingNews(
                result.items
            );

        }


        window.dispatchEvent(
            new CustomEvent(
                "awaaz:breaking-news",
                {

                    detail:
                        result

                }
            )
        );


        return result;

    } catch (error) {

        handleGlobalError(
            error,
            "Breaking News"
        );


        throw error;

    }

}


/* ============================================================
   LOAD TRENDING NEWS
============================================================ */

async function loadTrendingNews(
    options = {}
) {

    try {

        const result =
            await fetchTrendingNews(
                options
            );


        if (
            typeof renderTrendingNews ===
            "function"
        ) {

            renderTrendingNews(
                result.items
            );

        }


        window.dispatchEvent(
            new CustomEvent(
                "awaaz:trending-news",
                {

                    detail:
                        result

                }
            )
        );


        return result;

    } catch (error) {

        handleGlobalError(
            error,
            "Trending News"
        );


        throw error;

    }

}


/* ============================================================
   REFRESH ALL NEWS DATA
============================================================ */

async function refreshAllNewsData(
    options = {}
) {

    clearAPICache(
        "/api/news"
    );


    AppState.newsCache.clear();


    const tasks = [

        fetchLatestNews(
            {

                limit:
                    options.latestLimit ||
                    12,

                useCache:
                    false

            }
        ),

        fetchBreakingNews(
            {

                limit:
                    options.breakingLimit ||
                    10

            }
        ),

        fetchTrendingNews(
            {

                limit:
                    options.trendingLimit ||
                    8

            }
        )

    ];


    const results =
        await Promise.allSettled(
            tasks
        );


    window.dispatchEvent(
        new CustomEvent(
            "awaaz:news-refreshed",
            {

                detail: {

                    results:
                        results,

                    timestamp:
                        new Date()

                }

            }
        )
    );


    return results;

}


/* ============================================================
   NEWS UPDATE EVENT
============================================================ */

window.addEventListener(
    "awaaz:news-update",
    event => {

        const item =
            event.detail?.item;


        if (!item) {

            return;

        }


        const normalized =
            normalizeNewsItem(
                item
            );


        if (
            normalized.id
        ) {

            NewsState.latest =
                [
                    normalized,
                    ...NewsState.latest
                ].slice(
                    0,
                    100
                );

        }


        window.dispatchEvent(
            new CustomEvent(
                "awaaz:data-updated",
                {

                    detail: {

                        type:
                            "news",

                        item:
                            normalized

                    }

                }
            )
        );

    }
);


/* ============================================================
   NEWS GLOBAL EXPORT
============================================================ */

window.AwaazRajasthan.news = {

    state:
        NewsState,

    fetch:
        fetchNewsList,

    fetchLatest:
        fetchLatestNews,

    fetchBreaking:
        fetchBreakingNews,

    fetchTrending:
        fetchTrendingNews,

    fetchFeatured:
        fetchFeaturedNews,

    fetchCategory:
        fetchCategoryNews,

    loadLatest:
        loadLatestNews,

    loadBreaking:
        loadBreakingNews,

    loadTrending:
        loadTrendingNews,

    loadCategory:
        loadNewsByCategory,

    refresh:
        refreshAllNewsData,

    clearCache:
        () => {

            AppState.newsCache.clear();

            clearAPICache(
                "/api/news"
            );

        }

};


/* ============================================================
   END OF PART 7/30
============================================================ */
/* ============================================================
   AAWAAZ RAJASTHAN
   SCRIPT.JS — PART 8/30

   NEWS CARD RENDERING
   NEWS GRID
   FEATURED NEWS
   LATEST NEWS UI
   NEWS IMAGE / META HELPERS
============================================================ */


/* ============================================================
   NEWS CARD CONFIGURATION
============================================================ */

const NEWS_CARD_CONFIG = {

    defaultImage:
        APP_CONFIG.imagePlaceholder,

    excerptLength:
        140,

    titleLength:
        110,

    gridSelector:
        "#newsGrid, .news-grid, .latest-news-grid"

};


/* ============================================================
   CREATE NEWS URL
============================================================ */

function buildNewsURL(
    article
) {

    if (
        !article
    ) {

        return "#";

    }


    const id =
        article.id ||
        article._id ||
        "";


    const slug =
        normalizeText(
            article.slug ||
            ""
        );


    if (
        slug
    ) {

        return `/news/${encodeURIComponent(
            slug
        )}`;

    }


    if (
        id
    ) {

        return `/news/${encodeURIComponent(
            String(id)
        )}`;

    }


    return "#";

}


/* ============================================================
   NEWS IMAGE URL
============================================================ */

function getNewsImage(
    article
) {

    const image =
        article?.image ||
        article?.imageUrl ||
        article?.thumbnail ||
        article?.featuredImage ||
        article?.coverImage ||
        article?.photo ||
        "";


    if (!image) {

        return NEWS_CARD_CONFIG.defaultImage;

    }


    return normalizeImageURL(
        image
    );

}


/* ============================================================
   NEWS CATEGORY
============================================================ */

function getNewsCategory(
    article
) {

    return normalizeText(
        article?.category ||
        article?.categoryName ||
        article?.section ||
        ""
    );

}


/* ============================================================
   NEWS AUTHOR
============================================================ */

function getNewsAuthor(
    article
) {

    return normalizeText(
        article?.authorName ||
        article?.author?.name ||
        article?.author ||
        ""
    );

}


/* ============================================================
   NEWS DATE
============================================================ */

function getNewsDate(
    article
) {

    const date =
        article?.publishedAt ||
        article?.publishDate ||
        article?.createdAt ||
        article?.date ||
        "";


    if (!date) {

        return "";

    }


    return formatDate(
        date
    );

}


/* ============================================================
   NEWS VIEW COUNT
============================================================ */

function getNewsViewCount(
    article
) {

    const views =
        Number(
            article?.views ||
            article?.viewCount ||
            article?.totalViews ||
            0
        );


    if (
        !Number.isFinite(views) ||
        views <= 0
    ) {

        return "";

    }


    return formatNumber(
        views
    );

}


/* ============================================================
   NEWS CARD
============================================================ */

function createNewsCard(
    item,
    options = {}
) {

    const article =
        normalizeNewsItem(
            item
        );


    const card =
        createElement(
            "article",
            {

                className:
                    options.className ||
                    "news-card",

                attributes: {

                    "data-news-id":
                        article.id || "",

                    tabindex:
                        options.keyboard === false
                            ? null
                            : "0"

                }

            }
        );


    if (
        article.isBreaking ||
        article.breaking ||
        article.isBreakingNews
    ) {

        card.classList.add(
            "breaking"
        );

    }


    if (
        article.featured ||
        article.isFeatured
    ) {

        card.classList.add(
            "featured"
        );

    }


    /* --------------------------------------------------------
       IMAGE
    -------------------------------------------------------- */

    const imageWrapper =
        createElement(
            "div",
            {

                className:
                    "news-card-image"

            }
        );


    const imageLink =
        createElement(
            "a",
            {

                attributes: {

                    href:
                        buildNewsURL(
                            article
                        ),

                    "aria-label":
                        article.title

                }

            }
        );


    const image =
        createElement(
            "img",
            {

                attributes: {

                    src:
                        getNewsImage(
                            article
                        ),

                    alt:
                        article.title,

                    loading:
                        options.priority
                            ? "eager"
                            : "lazy",

                    decoding:
                        "async"

                }

            }
        );


    imageLink.appendChild(
        image
    );


    imageWrapper.appendChild(
        imageLink
    );


    /* --------------------------------------------------------
       CATEGORY BADGE
    -------------------------------------------------------- */

    const category =
        getNewsCategory(
            article
        );


    if (category) {

        const badge =
            createElement(
                "span",
                {

                    className:
                        "news-card-category",

                    text:
                        category

                }
            );


        imageWrapper.appendChild(
            badge
        );

    }


    /* --------------------------------------------------------
       BREAKING BADGE
    -------------------------------------------------------- */

    if (
        article.isBreaking ||
        article.breaking ||
        article.isBreakingNews
    ) {

        const breakingBadge =
            createElement(
                "span",
                {

                    className:
                        "news-card-breaking",

                    text:
                        "ब्रेकिंग न्यूज़"

                }
            );


        imageWrapper.appendChild(
            breakingBadge
        );

    }


    card.appendChild(
        imageWrapper
    );


    /* --------------------------------------------------------
       CONTENT
    -------------------------------------------------------- */

    const content =
        createElement(
            "div",
            {

                className:
                    "news-card-content"

            }
        );


    /* --------------------------------------------------------
       TITLE
    -------------------------------------------------------- */

    const title =
        createElement(
            "h3",
            {

                className:
                    "news-card-title"

            }
        );


    const titleLink =
        createElement(
            "a",
            {

                text:
                    truncateText(
                        article.title,
                        NEWS_CARD_CONFIG.titleLength
                    ),

                attributes: {

                    href:
                        buildNewsURL(
                            article
                        )

                }

            }
        );


    title.appendChild(
        titleLink
    );


    content.appendChild(
        title
    );


    /* --------------------------------------------------------
       EXCERPT
    -------------------------------------------------------- */

    const excerpt =
        article.excerpt ||
        article.summary ||
        article.description ||
        "";


    if (
        excerpt &&
        options.showExcerpt !==
            false
    ) {

        const excerptElement =
            createElement(
                "p",
                {

                    className:
                        "news-card-excerpt",

                    text:
                        truncateText(
                            excerpt,
                            options.excerptLength ||
                            NEWS_CARD_CONFIG.excerptLength
                        )

                }
            );


        content.appendChild(
            excerptElement
        );

    }


    /* --------------------------------------------------------
       META
    -------------------------------------------------------- */

    const meta =
        createElement(
            "div",
            {

                className:
                    "news-card-meta"

            }
        );


    const date =
        getNewsDate(
            article
        );


    if (date) {

        const dateElement =
            createElement(
                "time",
                {

                    className:
                        "news-card-date",

                    text:
                        date,

                    attributes: {

                        datetime:
                            article.publishedAt ||
                            article.publishDate ||
                            article.createdAt ||
                            ""

                    }

                }
            );


        meta.appendChild(
            dateElement
        );

    }


    const author =
        getNewsAuthor(
            article
        );


    if (
        author &&
        options.showAuthor !==
            false
    ) {

        const authorElement =
            createElement(
                "span",
                {

                    className:
                        "news-card-author",

                    text:
                        author

                }
            );


        meta.appendChild(
            authorElement
        );

    }


    const views =
        getNewsViewCount(
            article
        );


    if (views) {

        const viewsElement =
            createElement(
                "span",
                {

                    className:
                        "news-card-views",

                    text:
                        `${views} views`

                }
            );


        meta.appendChild(
            viewsElement
        );

    }


    if (
        meta.children.length
    ) {

        content.appendChild(
            meta
        );

    }


    card.appendChild(
        content
    );


    /* --------------------------------------------------------
       CARD KEYBOARD ACCESS
    -------------------------------------------------------- */

    if (
        options.keyboard !==
        false
    ) {

        card.addEventListener(
            "keydown",
            event => {

                if (
                    event.key !==
                        "Enter" &&
                    event.key !==
                        " "
                ) {

                    return;

                }


                if (
                    event.target.closest(
                        "a, button"
                    )
                ) {

                    return;

                }


                event.preventDefault();

                titleLink.click();

            }
        );

    }


    return card;

}


/* ============================================================
   FEATURED NEWS CARD
============================================================ */

function createFeaturedNewsCard(
    item
) {

    return createNewsCard(
        item,
        {

            className:
                "news-card featured-news-card",

            priority:
                true,

            showExcerpt:
                true

        }
    );

}


/* ============================================================
   COMPACT NEWS CARD
============================================================ */

function createCompactNewsCard(
    item
) {

    return createNewsCard(
        item,
        {

            className:
                "news-card compact-news-card",

            showExcerpt:
                false,

            showAuthor:
                false,

            keyboard:
                false

        }
    );

}


/* ============================================================
   CREATE NEWS GRID
============================================================ */

function createNewsGrid(
    items,
    options = {}
) {

    const grid =
        createElement(
            "div",
            {

                className:
                    options.className ||
                    "news-grid"

            }
        );


    const list =
        Array.isArray(items)
            ? items
            : [];


    if (
        !list.length
    ) {

        const empty =
            createNewsEmptyState(
                options.emptyMessage ||
                "अभी कोई समाचार उपलब्ध नहीं है।"
            );


        grid.appendChild(
            empty
        );


        return grid;

    }


    const fragment =
        document.createDocumentFragment();


    list.forEach(
        (
            item,
            index
        ) => {

            const card =
                createNewsCard(
                    item,
                    {

                        priority:
                            index < 3,

                        showExcerpt:
                            options.showExcerpt !==
                                false,

                        showAuthor:
                            options.showAuthor !==
                                false

                    }
                );


            fragment.appendChild(
                card
            );

        }
    );


    grid.appendChild(
        fragment
    );


    return grid;

}


/* ============================================================
   RENDER NEWS GRID
============================================================ */

function renderNewsGrid(
    items,
    target,
    options = {}
) {

    if (
        typeof target ===
        "string"
    ) {

        target =
            document.querySelector(
                target
            );

    }


    if (!target) {

        return null;

    }


    const list =
        Array.isArray(items)
            ? items
            : [];


    target.classList.add(
        "news-grid-container"
    );


    const fragment =
        document.createDocumentFragment();


    if (
        !list.length
    ) {

        fragment.appendChild(
            createNewsEmptyState(
                options.emptyMessage ||
                "अभी कोई समाचार उपलब्ध नहीं है।"
            )
        );


        target.replaceChildren(
            fragment
        );


        return target;

    }


    list.forEach(
        (
            item,
            index
        ) => {

            const card =
                createNewsCard(
                    item,
                    {

                        priority:
                            index < 3,

                        showExcerpt:
                            options.showExcerpt !==
                                false,

                        showAuthor:
                            options.showAuthor !==
                                false

                    }
                );


            fragment.appendChild(
                card
            );

        }
    );


    target.replaceChildren(
        fragment
    );


    initializeLazyImages();


    return target;

}


/* ============================================================
   EMPTY NEWS STATE
============================================================ */

function createNewsEmptyState(
    message
) {

    const wrapper =
        createElement(
            "div",
            {

                className:
                    "news-empty-state"

            }
        );


    const icon =
        createElement(
            "div",
            {

                className:
                    "news-empty-icon",

                text:
                    "📰",

                attributes: {

                    "aria-hidden":
                        "true"

                }

            }
        );


    const title =
        createElement(
            "h3",
            {

                text:
                    "समाचार उपलब्ध नहीं है"

            }
        );


    const text =
        createElement(
            "p",
            {

                text:
                    message

            }
        );


    wrapper.appendChild(
        icon
    );

    wrapper.appendChild(
        title
    );

    wrapper.appendChild(
        text
    );


    return wrapper;

}


/* ============================================================
   NEWS LOADING SKELETON
============================================================ */

function createNewsSkeleton(
    count = 6
) {

    const fragment =
        document.createDocumentFragment();


    const total =
        Math.max(
            1,
            Number(count) || 6
        );


    for (
        let index = 0;
        index < total;
        index++
    ) {

        const card =
            createElement(
                "article",
                {

                    className:
                        "news-card news-skeleton",

                    attributes: {

                        "aria-hidden":
                            "true"

                    }

                }
            );


        const image =
            createElement(
                "div",
                {

                    className:
                        "skeleton-image"

                }
            );


        const content =
            createElement(
                "div",
                {

                    className:
                        "skeleton-content"

                }
            );


        const line1 =
            createElement(
                "div",
                {

                    className:
                        "skeleton-line skeleton-title"

                }
            );


        const line2 =
            createElement(
                "div",
                {

                    className:
                        "skeleton-line"

                }
            );


        const line3 =
            createElement(
                "div",
                {

                    className:
                        "skeleton-line skeleton-short"

                }
            );


        content.appendChild(
            line1
        );

        content.appendChild(
            line2
        );

        content.appendChild(
            line3
        );


        card.appendChild(
            image
        );

        card.appendChild(
            content
        );


        fragment.appendChild(
            card
        );

    }


    return fragment;

}


/* ============================================================
   RENDER NEWS SKELETON
============================================================ */

function renderNewsSkeleton(
    target,
    count = 6
) {

    if (
        typeof target ===
        "string"
    ) {

        target =
            document.querySelector(
                target
            );

    }


    if (!target) {

        return;

    }


    target.replaceChildren(
        createNewsSkeleton(
            count
        )
    );

}


/* ============================================================
   NEWS CARD SHARE BUTTON
============================================================ */

function addNewsCardShareButton(
    card,
    article
) {

    if (
        !card ||
        !article
    ) {

        return;

    }


    if (
        card.querySelector(
            ".news-card-share"
        )
    ) {

        return;

    }


    const shareButton =
        createElement(
            "button",
            {

                className:
                    "news-card-share",

                text:
                    "↗",

                attributes: {

                    type:
                        "button",

                    "aria-label":
                        "समाचार शेयर करें"

                }

            }
        );


    shareButton.addEventListener(
        "click",
        async event => {

            event.preventDefault();

            event.stopPropagation();


            if (
                typeof shareNews ===
                "function"
            ) {

                await shareNews(
                    article
                );

            }

        }
    );


    card.appendChild(
        shareButton
    );

}


/* ============================================================
   NEWS CARD BOOKMARK BUTTON
============================================================ */

function addNewsCardBookmarkButton(
    card,
    article
) {

    if (
        !card ||
        !article
    ) {

        return;

    }


    if (
        card.querySelector(
            ".news-card-bookmark"
        )
    ) {

        return;

    }


    const button =
        createElement(
            "button",
            {

                className:
                    "news-card-bookmark",

                text:
                    "♡",

                attributes: {

                    type:
                        "button",

                    "aria-label":
                        "समाचार सेव करें"

                }

            }
        );


    button.addEventListener(
        "click",
        event => {

            event.preventDefault();

            event.stopPropagation();


            if (
                typeof toggleBookmark ===
                "function"
            ) {

                toggleBookmark(
                    article
                );

            }

        }
    );


    card.appendChild(
        button
    );

}


/* ============================================================
   NEWS CARD ENHANCEMENT
============================================================ */

function enhanceNewsCards(
    container
) {

    if (
        typeof container ===
        "string"
    ) {

        container =
            document.querySelector(
                container
            );

    }


    if (!container) {

        return;

    }


    const cards =
        $$(
            ".news-card[data-news-id]",
            container
        );


    cards.forEach(
        card => {

            const id =
                card.dataset.newsId;


            if (!id) {

                return;

            }


            const article =
                [
                    ...NewsState.latest,
                    ...NewsState.category,
                    ...NewsState.trending,
                    ...NewsState.featured
                ].find(
                    item =>
                        String(
                            item.id
                        ) ===
                        String(id)
                );


            if (!article) {

                return;

            }


            if (
                window.innerWidth >=
                768
            ) {

                addNewsCardShareButton(
                    card,
                    article
                );

            }

        }
    );

}


/* ============================================================
   NEWS RENDER EVENT
============================================================ */

window.addEventListener(
    "awaaz:news-rendered",
    event => {

        const target =
            event.detail?.target;


        if (target) {

            enhanceNewsCards(
                target
            );

        }

    }
);


/* ============================================================
   NEWS UI EXPORT
============================================================ */

window.AwaazRajasthan.newsUI = {

    createCard:
        createNewsCard,

    createFeaturedCard:
        createFeaturedNewsCard,

    createCompactCard:
        createCompactNewsCard,

    createGrid:
        createNewsGrid,

    renderGrid:
        renderNewsGrid,

    createEmpty:
        createNewsEmptyState,

    createSkeleton:
        createNewsSkeleton,

    renderSkeleton:
        renderNewsSkeleton,

    enhanceCards:
        enhanceNewsCards,

    buildURL:
        buildNewsURL,

    getImage:
        getNewsImage,

    getDate:
        getNewsDate,

    getCategory:
        getNewsCategory

};


/* ============================================================
   END OF PART 8/30
============================================================ */
/* ============================================================
   AAWAAZ RAJASTHAN
   SCRIPT.JS — PART 9/30

   BREAKING NEWS TICKER
   BREAKING NEWS UI
   TICKER CONTROLS
   AUTO ROTATION
============================================================ */


/* ============================================================
   BREAKING NEWS STATE
============================================================ */

const BreakingNewsState = {

    items:
        [],

    currentIndex:
        0,

    timer:
        null,

    interval:
        5000,

    paused:
        false,

    initialized:
        false

};


/* ============================================================
   BREAKING NEWS ELEMENTS
============================================================ */

function getBreakingNewsElements() {

    return {

        containers:
            $$(
                "#breakingNews, .breaking-news, .breaking-news-bar"
            ),

        ticker:
            document.querySelector(
                "#breakingTicker, .breaking-ticker, .ticker-content"
            ),

        previous:
            document.querySelector(
                ".breaking-prev, #breakingPrev"
            ),

        next:
            document.querySelector(
                ".breaking-next, #breakingNext"
            ),

        pause:
            document.querySelector(
                ".breaking-pause, #breakingPause"
            )

    };

}


/* ============================================================
   CREATE BREAKING NEWS CONTAINER
============================================================ */

function ensureBreakingNewsContainer() {

    let container =
        document.querySelector(
            "#breakingNews"
        );


    if (container) {

        return container;

    }


    container =
        createElement(
            "section",
            {

                className:
                    "breaking-news-bar",

                attributes: {

                    id:
                        "breakingNews",

                    "aria-label":
                        "ब्रेकिंग न्यूज़"

                }

            }
        );


    const label =
        createElement(
            "div",
            {

                className:
                    "breaking-news-label",

                text:
                    "ब्रेकिंग न्यूज़"

            }
        );


    const viewport =
        createElement(
            "div",
            {

                className:
                    "breaking-news-viewport"

            }
        );


    const ticker =
        createElement(
            "div",
            {

                className:
                    "breaking-ticker",

                attributes: {

                    id:
                        "breakingTicker"

                }

            }
        );


    viewport.appendChild(
        ticker
    );


    const controls =
        createElement(
            "div",
            {

                className:
                    "breaking-news-controls"

            }
        );


    const previous =
        createElement(
            "button",
            {

                className:
                    "breaking-prev",

                text:
                    "‹",

                attributes: {

                    type:
                        "button",

                    id:
                        "breakingPrev",

                    "aria-label":
                        "पिछली ब्रेकिंग न्यूज़"

                }

            }
        );


    const pause =
        createElement(
            "button",
            {

                className:
                    "breaking-pause",

                text:
                    "Ⅱ",

                attributes: {

                    type:
                        "button",

                    id:
                        "breakingPause",

                    "aria-label":
                        "टिकर रोकें"

                }

            }
        );


    const next =
        createElement(
            "button",
            {

                className:
                    "breaking-next",

                text:
                    "›",

                attributes: {

                    type:
                        "button",

                    id:
                        "breakingNext",

                    "aria-label":
                        "अगली ब्रेकिंग न्यूज़"

                }

            }
        );


    controls.appendChild(
        previous
    );

    controls.appendChild(
        pause
    );

    controls.appendChild(
        next
    );


    container.appendChild(
        label
    );

    container.appendChild(
        viewport
    );

    container.appendChild(
        controls
    );


    const header =
        document.querySelector(
            "header"
        );


    if (
        header &&
        header.parentNode
    ) {

        header.parentNode.insertBefore(
            container,
            header.nextSibling
        );

    } else {

        document.body.prepend(
            container
        );

    }


    return container;

}


/* ============================================================
   NORMALIZE BREAKING NEWS ITEM
============================================================ */

function normalizeBreakingItem(
    item
) {

    if (
        typeof item ===
        "string"
    ) {

        return {

            id:
                item,

            title:
                item,

            url:
                "#"

        };

    }


    const article =
        normalizeNewsItem(
            item
        );


    return {

        ...article,

        title:
            normalizeText(
                article.title ||
                article.headline ||
                "ब्रेकिंग न्यूज़"
            ),

        url:
            buildNewsURL(
                article
            )

    };

}


/* ============================================================
   CREATE BREAKING NEWS ITEM
============================================================ */

function createBreakingNewsItem(
    item,
    index
) {

    const article =
        normalizeBreakingItem(
            item
        );


    const wrapper =
        createElement(
            "div",
            {

                className:
                    "breaking-ticker-item",

                attributes: {

                    "data-breaking-index":
                        String(index)

                }

            }
        );


    const link =
        createElement(
            "a",
            {

                attributes: {

                    href:
                        article.url ||

                        buildNewsURL(
                            article
                        ),

                    "aria-label":
                        article.title

                }

            }
        );


    const dot =
        createElement(
            "span",
            {

                className:
                    "breaking-dot",

                text:
                    "●",

                attributes: {

                    "aria-hidden":
                        "true"

                }

            }
        );


    const title =
        createElement(
            "span",
            {

                className:
                    "breaking-title",

                text:
                    article.title

            }
        );


    link.appendChild(
        dot
    );

    link.appendChild(
        title
    );


    wrapper.appendChild(
        link
    );


    return wrapper;

}


/* ============================================================
   RENDER BREAKING NEWS
============================================================ */

function renderBreakingNews(
    items
) {

    const list =
        Array.isArray(items)
            ? items
            : [];


    BreakingNewsState.items =
        list.map(
            normalizeBreakingItem
        );


    BreakingNewsState.currentIndex =
        0;


    const existing =
        getBreakingNewsElements();


    let container =
        existing.containers[0];


    if (!container) {

        container =
            ensureBreakingNewsContainer();

    }


    const ticker =
        container.querySelector(
            ".breaking-ticker, #breakingTicker"
        );


    if (!ticker) {

        return;

    }


    ticker.classList.remove(
        "ticker-running"
    );


    ticker.innerHTML =
        "";


    if (
        !BreakingNewsState.items.length
    ) {

        ticker.innerHTML =
            `
            <span class="breaking-empty">
                अभी कोई ब्रेकिंग न्यूज़ उपलब्ध नहीं है।
            </span>
            `;


        stopBreakingTicker();

        return;

    }


    const fragment =
        document.createDocumentFragment();


    BreakingNewsState.items.forEach(
        (
            item,
            index
        ) => {

            fragment.appendChild(
                createBreakingNewsItem(
                    item,
                    index
                )
            );

        }
    );


    ticker.appendChild(
        fragment
    );


    ticker.classList.add(
        "ticker-running"
    );


    initializeBreakingTickerControls(
        container
    );


    startBreakingTicker();


    window.dispatchEvent(
        new CustomEvent(
            "awaaz:breaking-rendered",
            {

                detail: {

                    items:
                        BreakingNewsState.items

                }

            }
        )
    );

}


/* ============================================================
   BREAKING TICKER START
============================================================ */

function startBreakingTicker() {

    stopBreakingTicker();


    if (
        BreakingNewsState.paused
    ) {

        return;

    }


    if (
        BreakingNewsState.items.length <=
        1
    ) {

        return;

    }


    BreakingNewsState.timer =
        window.setInterval(
            () => {

                showNextBreakingNews();

            },
            BreakingNewsState.interval
        );

}


/* ============================================================
   BREAKING TICKER STOP
============================================================ */

function stopBreakingTicker() {

    if (
        BreakingNewsState.timer
    ) {

        clearInterval(
            BreakingNewsState.timer
        );

    }


    BreakingNewsState.timer =
        null;

}


/* ============================================================
   SHOW BREAKING ITEM
============================================================ */

function showBreakingNews(
    index
) {

    const ticker =
        document.querySelector(
            ".breaking-ticker, #breakingTicker"
        );


    if (!ticker) {

        return;

    }


    const items =
        $$(
            ".breaking-ticker-item",
            ticker
        );


    if (!items.length) {

        return;

    }


    const total =
        items.length;


    let nextIndex =
        Number(index);


    if (
        !Number.isFinite(
            nextIndex
        )
    ) {

        nextIndex =
            0;

    }


    if (
        nextIndex < 0
    ) {

        nextIndex =
            total - 1;

    }


    if (
        nextIndex >= total
    ) {

        nextIndex =
            0;

    }


    items.forEach(
        (
            item,
            itemIndex
        ) => {

            item.classList.toggle(
                "active",
                itemIndex ===
                    nextIndex
            );

        }
    );


    BreakingNewsState.currentIndex =
        nextIndex;


    /*
     * CSS animation वाले ticker में
     * active class optional है।
     * दोनों modes साथ में काम कर सकते हैं।
     */

    ticker.style.setProperty(
        "--breaking-index",
        String(
            nextIndex
        )
    );

}


/* ============================================================
   NEXT BREAKING NEWS
============================================================ */

function showNextBreakingNews() {

    const total =
        BreakingNewsState.items.length;


    if (
        total <= 1
    ) {

        return;

    }


    showBreakingNews(
        BreakingNewsState.currentIndex +
        1
    );

}


/* ============================================================
   PREVIOUS BREAKING NEWS
============================================================ */

function showPreviousBreakingNews() {

    const total =
        BreakingNewsState.items.length;


    if (
        total <= 1
    ) {

        return;

    }


    showBreakingNews(
        BreakingNewsState.currentIndex -
        1
    );

}


/* ============================================================
   PAUSE / RESUME BREAKING NEWS
============================================================ */

function toggleBreakingTicker() {

    BreakingNewsState.paused =
        !BreakingNewsState.paused;


    const pauseButton =
        document.querySelector(
            "#breakingPause, .breaking-pause"
        );


    if (
        BreakingNewsState.paused
    ) {

        stopBreakingTicker();


        if (pauseButton) {

            pauseButton.textContent =
                "▶";

            pauseButton.setAttribute(
                "aria-label",
                "टिकर शुरू करें"
            );

        }

    } else {

        startBreakingTicker();


        if (pauseButton) {

            pauseButton.textContent =
                "Ⅱ";

            pauseButton.setAttribute(
                "aria-label",
                "टिकर रोकें"
            );

        }

    }

}


/* ============================================================
   BREAKING TICKER CONTROLS
============================================================ */

function initializeBreakingTickerControls(
    container
) {

    if (
        !container
    ) {

        return;

    }


    if (
        container.dataset.tickerInitialized ===
        "true"
    ) {

        return;

    }


    container.dataset.tickerInitialized =
        "true";


    const previous =
        container.querySelector(
            "#breakingPrev, .breaking-prev"
        );


    const next =
        container.querySelector(
            "#breakingNext, .breaking-next"
        );


    const pause =
        container.querySelector(
            "#breakingPause, .breaking-pause"
        );


    if (previous) {

        previous.addEventListener(
            "click",
            () => {

                showPreviousBreakingNews();

                if (
                    !BreakingNewsState.paused
                ) {

                    startBreakingTicker();

                }

            }
        );

    }


    if (next) {

        next.addEventListener(
            "click",
            () => {

                showNextBreakingNews();

                if (
                    !BreakingNewsState.paused
                ) {

                    startBreakingTicker();

                }

            }
        );

    }


    if (pause) {

        pause.addEventListener(
            "click",
            toggleBreakingTicker
        );

    }


    container.addEventListener(
        "mouseenter",
        () => {

            if (
                BreakingNewsState.paused
            ) {

                return;

            }

            stopBreakingTicker();

        }
    );


    container.addEventListener(
        "mouseleave",
        () => {

            if (
                BreakingNewsState.paused
            ) {

                return;

            }

            startBreakingTicker();

        }
    );


    container.addEventListener(
        "focusin",
        () => {

            if (
                BreakingNewsState.paused
            ) {

                return;

            }

            stopBreakingTicker();

        }
    );


    container.addEventListener(
        "focusout",
        event => {

            if (
                container.contains(
                    event.relatedTarget
                )
            ) {

                return;

            }


            if (
                BreakingNewsState.paused
            ) {

                return;

            }


            startBreakingTicker();

        }
    );

}


/* ============================================================
   TOUCH / SWIPE SUPPORT
============================================================ */

function initializeBreakingTouch() {

    const container =
        document.querySelector(
            "#breakingNews, .breaking-news-bar"
        );


    if (!container) {

        return;

    }


    let startX =
        0;

    let startY =
        0;


    container.addEventListener(
        "touchstart",
        event => {

            const touch =
                event.changedTouches?.[0];


            if (!touch) {

                return;

            }


            startX =
                touch.clientX;

            startY =
                touch.clientY;

        },
        {

            passive:
                true

        }
    );


    container.addEventListener(
        "touchend",
        event => {

            const touch =
                event.changedTouches?.[0];


            if (!touch) {

                return;

            }


            const deltaX =
                touch.clientX -
                startX;


            const deltaY =
                touch.clientY -
                startY;


            if (
                Math.abs(
                    deltaX
                ) <
                40
            ) {

                return;

            }


            if (
                Math.abs(
                    deltaX
                ) <
                Math.abs(
                    deltaY
                )
            ) {

                return;

            }


            if (
                deltaX < 0
            ) {

                showNextBreakingNews();

            } else {

                showPreviousBreakingNews();

            }


            if (
                !BreakingNewsState.paused
            ) {

                startBreakingTicker();

            }

        },
        {

            passive:
                true

        }
    );

}


/* ============================================================
   BREAKING NEWS DATA LOAD
============================================================ */

async function initializeBreakingNews() {

    try {

        const result =
            await loadBreakingNews(
                {

                    limit:
                        10

                }
            );


        BreakingNewsState.initialized =
            true;


        initializeBreakingTouch();


        return result;

    } catch (error) {

        console.error(
            "Breaking news initialization failed:",
            error
        );


        BreakingNewsState.initialized =
            true;

    }

}


/* ============================================================
   BREAKING NEWS EVENT LISTENER
============================================================ */

window.addEventListener(
    "awaaz:breaking-news",
    event => {

        const result =
            event.detail;


        if (
            result?.items
        ) {

            renderBreakingNews(
                result.items
            );

        }

    }
);


/* ============================================================
   BREAKING NEWS AUTO INITIALIZATION
============================================================ */

window.addEventListener(
    "awaaz:ready",
    () => {

        initializeBreakingNews();

    }
);


/* ============================================================
   VISIBILITY HANDLING
============================================================ */

document.addEventListener(
    "visibilitychange",
    () => {

        if (
            document.hidden
        ) {

            stopBreakingTicker();

        } else if (
            !BreakingNewsState.paused
        ) {

            startBreakingTicker();

        }

    }
);


/* ============================================================
   BREAKING NEWS GLOBAL EXPORT
============================================================ */

window.AwaazRajasthan.breakingNews = {

    state:
        BreakingNewsState,

    load:
        initializeBreakingNews,

    render:
        renderBreakingNews,

    start:
        startBreakingTicker,

    stop:
        stopBreakingTicker,

    next:
        showNextBreakingNews,

    previous:
        showPreviousBreakingNews,

    pause:
        toggleBreakingTicker

};


/* ============================================================
   END OF PART 9/30
============================================================ */
/* ============================================================
   AAWAAZ RAJASTHAN
   SCRIPT.JS — PART 10/30

   CATEGORY NAVIGATION
   CATEGORY MENU
   CATEGORY FILTER
   MOBILE CATEGORY SCROLLER
============================================================ */


/* ============================================================
   CATEGORY CONFIGURATION
============================================================ */

const CATEGORY_CONFIG = {

    defaultCategory:
        "सभी",

    storageKey:
        "awaaz_last_category",

    scrollBehavior:
        "smooth",

    categories: [

        {
            name:
                "राजस्थान",

            slug:
                "rajasthan"

        },

        {
            name:
                "जयपुर",

            slug:
                "jaipur"

        },

        {
            name:
                "जोधपुर",

            slug:
                "jodhpur"

        },

        {
            name:
                "उदयपुर",

            slug:
                "udaipur"

        },

        {
            name:
                "कोटा",

            slug:
                "kota"

        },

        {
            name:
                "अजमेर",

            slug:
                "ajmer"

        },

        {
            name:
                "बीकानेर",

            slug:
                "bikaner"

        },

        {
            name:
                "अलवर",

            slug:
                "alwar"

        },

        {
            name:
                "देश",

            slug:
                "desh"

        },

        {
            name:
                "दुनिया",

            slug:
                "duniya"

        },

        {
            name:
                "राजनीति",

            slug:
                "rajniti"

        },

        {
            name:
                "खेल",

            slug:
                "khel"

        },

        {
            name:
                "मनोरंजन",

            slug:
                "manoranjan"

        },

        {
            name:
                "बिजनेस",

            slug:
                "business"

        },

        {
            name:
                "शिक्षा",

            slug:
                "education"

        },

        {
            name:
                "लाइफस्टाइल",

            slug:
                "lifestyle"

        }

    ]

};


/* ============================================================
   CATEGORY STATE
============================================================ */

const CategoryState = {

    current:
        getStorage(
            CATEGORY_CONFIG.storageKey,
            CATEGORY_CONFIG.defaultCategory
        ),

    slug:
        "",

    loading:
        false,

    initialized:
        false

};


/* ============================================================
   NORMALIZE CATEGORY
============================================================ */

function normalizeCategory(
    category
) {

    if (
        !category
    ) {

        return {

            name:
                CATEGORY_CONFIG.defaultCategory,

            slug:
                ""

        };

    }


    const value =
        normalizeText(
            category
        );


    const matched =
        CATEGORY_CONFIG.categories.find(
            item =>
                item.name ===
                    value ||
                item.slug.toLowerCase() ===
                    value.toLowerCase()
        );


    if (
        matched
    ) {

        return {
            ...matched
        };

    }


    return {

        name:
            value,

        slug:
            slugify(
                value
            )

    };

}


/* ============================================================
   SAVE CURRENT CATEGORY
============================================================ */

function saveCurrentCategory(
    category
) {

    const normalized =
        normalizeCategory(
            category
        );


    CategoryState.current =
        normalized.name;

    CategoryState.slug =
        normalized.slug;


    setStorage(
        CATEGORY_CONFIG.storageKey,
        normalized.name
    );

}


/* ============================================================
   GET CATEGORY ELEMENTS
============================================================ */

function getCategoryElements() {

    return {

        nav:
            document.querySelector(
                ".category-nav, #categoryNav"
            ),

        list:
            document.querySelector(
                ".category-list, #categoryList"
            ),

        links:
            $$(
                ".category-link, .category-item a, [data-category]"
            ),

        mobileSelect:
            document.querySelector(
                "#categorySelect, .category-select"
            ),

        prev:
            document.querySelector(
                ".category-prev, #categoryPrev"
            ),

        next:
            document.querySelector(
                ".category-next, #categoryNext"
            )

    };

}


/* ============================================================
   CREATE CATEGORY NAVIGATION
============================================================ */

function ensureCategoryNavigation() {

    let nav =
        document.querySelector(
            "#categoryNav"
        );


    if (nav) {

        return nav;

    }


    nav =
        createElement(
            "nav",
            {

                className:
                    "category-nav",

                attributes: {

                    id:
                        "categoryNav",

                    "aria-label":
                        "समाचार श्रेणियां"

                }

            }
        );


    const wrapper =
        createElement(
            "div",
            {

                className:
                    "category-nav-wrapper"

            }
        );


    const list =
        createElement(
            "div",
            {

                className:
                    "category-list",

                attributes: {

                    id:
                        "categoryList"

                }

            }
        );


    CATEGORY_CONFIG.categories.forEach(
        category => {

            const button =
                createElement(
                    "button",
                    {

                        className:
                            "category-link",

                        text:
                            category.name,

                        attributes: {

                            type:
                                "button",

                            "data-category":
                                category.name,

                            "data-slug":
                                category.slug

                        }

                    }
                );


            list.appendChild(
                button
            );

        }
    );


    wrapper.appendChild(
        list
    );


    nav.appendChild(
        wrapper
    );


    const header =
        document.querySelector(
            "header"
        );


    if (
        header &&
        header.parentNode
    ) {

        header.parentNode.insertBefore(
            nav,
            header.nextSibling
        );

    } else {

        document.body.prepend(
            nav
        );

    }


    return nav;

}


/* ============================================================
   SET ACTIVE CATEGORY
============================================================ */

function setActiveCategory(
    category
) {

    const normalized =
        normalizeCategory(
            category
        );


    saveCurrentCategory(
        normalized.name
    );


    const elements =
        getCategoryElements();


    elements.links.forEach(
        link => {

            const linkCategory =
                normalizeText(
                    link.dataset.category ||
                    link.dataset.categoryName ||
                    link.textContent
                );


            const linkSlug =
                normalizeText(
                    link.dataset.slug ||
                    slugify(
                        linkCategory
                    )
                );


            const active =
                linkCategory ===
                    normalized.name ||
                linkSlug ===
                    normalized.slug;


            link.classList.toggle(
                "active",
                active
            );


            if (
                active
            ) {

                link.setAttribute(
                    "aria-current",
                    "page"
                );

            } else {

                link.removeAttribute(
                    "aria-current"
                );

            }

        }
    );


    if (
        elements.mobileSelect
    ) {

        const select =
            elements.mobileSelect;


        const matchingOption =
            [
                ...select.options
            ].find(
                option =>
                    option.dataset.slug ===
                        normalized.slug ||
                    normalizeText(
                        option.value
                    ) ===
                        normalized.name
            );


        if (
            matchingOption
        ) {

            select.value =
                matchingOption.value;

        }

    }


    scrollActiveCategoryIntoView();

}


/* ============================================================
   SCROLL ACTIVE CATEGORY INTO VIEW
============================================================ */

function scrollActiveCategoryIntoView() {

    const elements =
        getCategoryElements();


    const active =
        elements.list?.querySelector(
            ".category-link.active"
        );


    if (!active) {

        return;

    }


    const list =
        elements.list;


    if (
        !list
    ) {

        return;

    }


    const listRect =
        list.getBoundingClientRect();


    const itemRect =
        active.getBoundingClientRect();


    if (
        itemRect.left <
        listRect.left
    ) {

        list.scrollBy(
            {

                left:
                    itemRect.left -
                    listRect.left -
                    20,

                behavior:
                    CATEGORY_CONFIG.scrollBehavior

            }
        );

    } else if (
        itemRect.right >
        listRect.right
    ) {

        list.scrollBy(
            {

                left:
                    itemRect.right -
                    listRect.right +
                    20,

                behavior:
                    CATEGORY_CONFIG.scrollBehavior

            }
        );

    }

}


/* ============================================================
   CATEGORY NAVIGATION SCROLL
============================================================ */

function scrollCategoryNavigation(
    direction
) {

    const elements =
        getCategoryElements();


    const list =
        elements.list;


    if (!list) {

        return;

    }


    const amount =
        Math.max(
            160,
            Math.floor(
                list.clientWidth *
                0.7
            )
        );


    list.scrollBy(
        {

            left:
                direction *
                amount,

            behavior:
                CATEGORY_CONFIG.scrollBehavior

        }
    );

}


/* ============================================================
   CATEGORY LINK HANDLER
============================================================ */

async function handleCategoryClick(
    event
) {

    const link =
        event.currentTarget;


    if (!link) {

        return;

    }


    event.preventDefault();


    const category =
        normalizeText(
            link.dataset.category ||
            link.dataset.categoryName ||
            link.textContent
        );


    if (
        !category
    ) {

        return;

    }


    await selectCategory(
        category
    );

}


/* ============================================================
   SELECT CATEGORY
============================================================ */

async function selectCategory(
    category,
    options = {}
) {

    const normalized =
        normalizeCategory(
            category
        );


    saveCurrentCategory(
        normalized.name
    );


    setActiveCategory(
        normalized.name
    );


    CategoryState.loading =
        true;


    const target =
        options.target ||
        document.querySelector(
            "#newsGrid, .category-news-grid, .latest-news-grid"
        );


    if (
        target &&
        options.showLoading !== false
    ) {

        renderNewsSkeleton(
            target,
            options.skeletonCount ||
            6
        );

    }


    try {

        let result;


        if (
            !normalized.slug &&
            normalized.name ===
                CATEGORY_CONFIG.defaultCategory
        ) {

            result =
                await fetchLatestNews(
                    {

                        page:
                            options.page ||
                            1,

                        limit:
                            options.limit ||
                            12,

                        useCache:
                            options.useCache !==
                                false

                    }
                );

        } else {

            result =
                await fetchCategoryNews(
                    normalized.name,
                    {

                        page:
                            options.page ||
                            1,

                        limit:
                            options.limit ||
                            12,

                        useCache:
                            options.useCache !==
                                false

                    }
                );

        }


        if (
            target &&
            typeof renderNewsGrid ===
                "function"
        ) {

            renderNewsGrid(
                result.items,
                target,
                {

                    category:
                        normalized.name,

                    pagination:
                        result.pagination,

                    showExcerpt:
                        true,

                    showAuthor:
                        true

                }
            );

        }


        updateCategoryURL(
            normalized,
            result.pagination?.page ||
                1
        );


        window.dispatchEvent(
            new CustomEvent(
                "awaaz:category-selected",
                {

                    detail: {

                        category:
                            normalized.name,

                        slug:
                            normalized.slug,

                        result:
                            result

                    }

                }
            )
        );


        return result;

    } catch (error) {

        handleGlobalError(
            error,
            "Category"
        );


        if (
            target
        ) {

            renderNewsGrid(
                [],
                target,
                {

                    emptyMessage:
                        "समाचार लोड नहीं हो सके। कृपया पुनः प्रयास करें।"

                }
            );

        }


        throw error;

    } finally {

        CategoryState.loading =
            false;

    }

}


/* ============================================================
   CATEGORY URL
============================================================ */

function updateCategoryURL(
    category,
    page = 1
) {

    if (
        !window.history ||
        !window.history.replaceState
    ) {

        return;

    }


    const normalized =
        normalizeCategory(
            category
        );


    const url =
        new URL(
            window.location.href
        );


    if (
        normalized.slug
    ) {

        url.searchParams.set(
            "category",
            normalized.slug
        );

    } else {

        url.searchParams.delete(
            "category"
        );

    }


    if (
        Number(page) > 1
    ) {

        url.searchParams.set(
            "page",
            String(page)
        );

    } else {

        url.searchParams.delete(
            "page"
        );

    }


    window.history.replaceState(
        {},
        "",
        url
    );

}


/* ============================================================
   CATEGORY SELECT INITIALIZATION
============================================================ */

function initializeCategorySelect() {

    const select =
        document.querySelector(
            "#categorySelect, .category-select"
        );


    if (!select) {

        return;

    }


    if (
        select.dataset.initialized ===
        "true"
    ) {

        return;

    }


    select.dataset.initialized =
        "true";


    select.addEventListener(
        "change",
        event => {

            const value =
                event.target.value;


            selectCategory(
                value
            );

        }
    );

}


/* ============================================================
   CATEGORY LINKS INITIALIZATION
============================================================ */

function initializeCategoryLinks() {

    const elements =
        getCategoryElements();


    elements.links.forEach(
        link => {

            if (
                link.dataset.categoryInitialized ===
                "true"
            ) {

                return;

            }


            link.dataset.categoryInitialized =
                "true";


            link.addEventListener(
                "click",
                handleCategoryClick
            );

        }
    );

}


/* ============================================================
   CATEGORY CONTROLS INITIALIZATION
============================================================ */

function initializeCategoryControls() {

    const elements =
        getCategoryElements();


    if (
        elements.prev
    ) {

        elements.prev.addEventListener(
            "click",
            () => {

                scrollCategoryNavigation(
                    -1
                );

            }
        );

    }


    if (
        elements.next
    ) {

        elements.next.addEventListener(
            "click",
            () => {

                scrollCategoryNavigation(
                    1
                );

            }
        );

    }

}


/* ============================================================
   CATEGORY TOUCH DRAG
============================================================ */

function initializeCategoryTouch() {

    const elements =
        getCategoryElements();


    const list =
        elements.list;


    if (!list) {

        return;

    }


    if (
        list.dataset.touchInitialized ===
        "true"
    ) {

        return;

    }


    list.dataset.touchInitialized =
        "true";


    let startX =
        0;

    let startScroll =
        0;

    let dragging =
        false;


    list.addEventListener(
        "touchstart",
        event => {

            const touch =
                event.touches?.[0];


            if (!touch) {

                return;

            }


            startX =
                touch.clientX;

            startScroll =
                list.scrollLeft;

            dragging =
                true;

        },
        {

            passive:
                true

        }
    );


    list.addEventListener(
        "touchmove",
        event => {

            if (!dragging) {

                return;

            }


            const touch =
                event.touches?.[0];


            if (!touch) {

                return;

            }


            const distance =
                startX -
                touch.clientX;


            list.scrollLeft =
                startScroll +
                distance;

        },
        {

            passive:
                true

        }
    );


    list.addEventListener(
        "touchend",
        () => {

            dragging =
                false;

        },
        {

            passive:
                true

        }
    );

}


/* ============================================================
   CATEGORY URL INITIALIZATION
============================================================ */

function initializeCategoryFromURL() {

    const url =
        new URL(
            window.location.href
        );


    const category =
        normalizeText(
            url.searchParams.get(
                "category"
            ) ||
            ""
        );


    if (!category) {

        const saved =
            getStorage(
                CATEGORY_CONFIG.storageKey,
                CATEGORY_CONFIG.defaultCategory
            );


        setActiveCategory(
            saved
        );


        return;

    }


    const normalized =
        normalizeCategory(
            category
        );


    setActiveCategory(
        normalized.name
    );


    setTimeout(
        () => {

            selectCategory(
                normalized.name,
                {

                    page:
                        Number(
                            url.searchParams.get(
                                "page"
                            ) || 1
                        )

                }
            );

        },
        300
    );

}


/* ============================================================
   CATEGORY INITIALIZATION
============================================================ */

function initializeCategories() {

    ensureCategoryNavigation();

    initializeCategoryLinks();

    initializeCategorySelect();

    initializeCategoryControls();

    initializeCategoryTouch();

    initializeCategoryFromURL();


    CategoryState.initialized =
        true;

}


/* ============================================================
   CATEGORY EVENTS
============================================================ */

window.addEventListener(
    "awaaz:category-change",
    event => {

        const category =
            event.detail?.category;


        if (
            category
        ) {

            selectCategory(
                category
            );

        }

    }
);


/* ============================================================
   CATEGORY GLOBAL EXPORT
============================================================ */

window.AwaazRajasthan.categories = {

    state:
        CategoryState,

    config:
        CATEGORY_CONFIG,

    normalize:
        normalizeCategory,

    select:
        selectCategory,

    setActive:
        setActiveCategory,

    scroll:
        scrollCategoryNavigation,

    refresh:
        initializeCategories

};


/* ============================================================
   CATEGORY AUTO INITIALIZATION
============================================================ */

window.addEventListener(
    "awaaz:ready",
    () => {

        initializeCategories();

    }
);


/* ============================================================
   END OF PART 10/30
============================================================ */
/* ============================================================
   AAWAAZ RAJASTHAN
   SCRIPT.JS — PART 11/30

   SEARCH SYSTEM
   SEARCH INPUT
   SEARCH SUGGESTIONS
   SEARCH RESULTS
   DEBOUNCE
   MOBILE SEARCH
============================================================ */


/* ============================================================
   SEARCH CONFIGURATION
============================================================ */

const SEARCH_CONFIG = {

    minCharacters:
        2,

    debounceDelay:
        450,

    resultsLimit:
        12,

    suggestionLimit:
        6,

    storageKey:
        "awaaz_recent_searches",

    maxRecentSearches:
        8

};


/* ============================================================
   SEARCH STATE
============================================================ */

const SearchState = {

    query:
        "",

    results:
        [],

    suggestions:
        [],

    recent:
        getStorage(
            SEARCH_CONFIG.storageKey,
            []
        ),

    loading:
        false,

    searching:
        false,

    page:
        1,

    totalPages:
        1,

    initialized:
        false,

    debounceTimer:
        null

};


/* ============================================================
   NORMALIZE RECENT SEARCHES
============================================================ */

function normalizeRecentSearches() {

    if (
        !Array.isArray(
            SearchState.recent
        )
    ) {

        SearchState.recent =
            [];

    }


    SearchState.recent =
        SearchState.recent
            .map(
                item =>
                    normalizeText(
                        item
                    )
            )
            .filter(
                Boolean
            )
            .slice(
                0,
                SEARCH_CONFIG.maxRecentSearches
            );


    setStorage(
        SEARCH_CONFIG.storageKey,
        SearchState.recent
    );

}


/* ============================================================
   SAVE SEARCH QUERY
============================================================ */

function saveRecentSearch(
    query
) {

    const cleanQuery =
        normalizeText(
            query
        );


    if (
        cleanQuery.length <
        SEARCH_CONFIG.minCharacters
    ) {

        return;

    }


    SearchState.recent =
        SearchState.recent.filter(
            item =>
                item.toLowerCase() !==
                cleanQuery.toLowerCase()
        );


    SearchState.recent.unshift(
        cleanQuery
    );


    SearchState.recent =
        SearchState.recent.slice(
            0,
            SEARCH_CONFIG.maxRecentSearches
        );


    setStorage(
        SEARCH_CONFIG.storageKey,
        SearchState.recent
    );


    renderRecentSearches();

}


/* ============================================================
   REMOVE RECENT SEARCH
============================================================ */

function removeRecentSearch(
    query
) {

    const cleanQuery =
        normalizeText(
            query
        );


    SearchState.recent =
        SearchState.recent.filter(
            item =>
                item.toLowerCase() !==
                cleanQuery.toLowerCase()
        );


    setStorage(
        SEARCH_CONFIG.storageKey,
        SearchState.recent
    );


    renderRecentSearches();

}


/* ============================================================
   CLEAR RECENT SEARCHES
============================================================ */

function clearRecentSearches() {

    SearchState.recent =
        [];


    removeStorage(
        SEARCH_CONFIG.storageKey
    );


    renderRecentSearches();

}


/* ============================================================
   SEARCH ELEMENTS
============================================================ */

function getSearchElements() {

    return {

        input:
            document.querySelector(
                "#searchInput, .search-input"
            ),

        form:
            document.querySelector(
                "#searchForm, .search-form"
            ),

        button:
            document.querySelector(
                "#searchButton, .search-button"
            ),

        close:
            document.querySelector(
                "#searchClose, .search-close"
            ),

        overlay:
            document.querySelector(
                "#searchOverlay, .search-overlay"
            ),

        panel:
            document.querySelector(
                "#searchPanel, .search-panel"
            ),

        suggestions:
            document.querySelector(
                "#searchSuggestions, .search-suggestions"
            ),

        results:
            document.querySelector(
                "#searchResults, .search-results"
            ),

        clear:
            document.querySelector(
                "#searchClear, .search-clear"
            )

    };

}


/* ============================================================
   ENSURE SEARCH PANEL
============================================================ */

function ensureSearchPanel() {

    let overlay =
        document.querySelector(
            "#searchOverlay"
        );


    if (overlay) {

        return overlay;

    }


    overlay =
        createElement(
            "div",
            {

                className:
                    "search-overlay",

                attributes: {

                    id:
                        "searchOverlay",

                    "aria-hidden":
                        "true"

                }

            }
        );


    const panel =
        createElement(
            "div",
            {

                className:
                    "search-panel",

                attributes: {

                    id:
                        "searchPanel",

                    role:
                        "dialog",

                    "aria-modal":
                        "true",

                    "aria-label":
                        "समाचार खोजें"

                }

            }
        );


    const header =
        createElement(
            "div",
            {

                className:
                    "search-panel-header"

            }
        );


    const title =
        createElement(
            "h2",
            {

                text:
                    "समाचार खोजें"

            }
        );


    const close =
        createElement(
            "button",
            {

                className:
                    "search-close",

                text:
                    "×",

                attributes: {

                    type:
                        "button",

                    id:
                        "searchClose",

                    "aria-label":
                        "खोज बंद करें"

                }

            }
        );


    header.appendChild(
        title
    );

    header.appendChild(
        close
    );


    const form =
        createElement(
            "form",
            {

                className:
                    "search-form",

                attributes: {

                    id:
                        "searchForm"

                }

            }
        );


    const inputWrapper =
        createElement(
            "div",
            {

                className:
                    "search-input-wrapper"

            }
        );


    const input =
        createElement(
            "input",
            {

                className:
                    "search-input",

                attributes: {

                    id:
                        "searchInput",

                    type:
                        "search",

                    name:
                        "q",

                    placeholder:
                        "समाचार खोजें...",

                    autocomplete:
                        "off",

                    enterkeyhint:
                        "search",

                    "aria-label":
                        "समाचार खोजें"

                }

            }
        );


    const clear =
        createElement(
            "button",
            {

                className:
                    "search-clear",

                text:
                    "×",

                attributes: {

                    type:
                        "button",

                    id:
                        "searchClear",

                    "aria-label":
                        "खोज साफ करें"

                }

            }
        );


    const button =
        createElement(
            "button",
            {

                className:
                    "search-button",

                text:
                    "खोजें",

                attributes: {

                    type:
                        "submit",

                    id:
                        "searchButton"

                }

            }
        );


    inputWrapper.appendChild(
        input
    );

    inputWrapper.appendChild(
        clear
    );


    form.appendChild(
        inputWrapper
    );

    form.appendChild(
        button
    );


    const suggestions =
        createElement(
            "div",
            {

                className:
                    "search-suggestions",

                attributes: {

                    id:
                        "searchSuggestions",

                    role:
                        "listbox"

                }

            }
        );


    const results =
        createElement(
            "div",
            {

                className:
                    "search-results",

                attributes: {

                    id:
                        "searchResults"

                }

            }
        );


    panel.appendChild(
        header
    );

    panel.appendChild(
        form
    );

    panel.appendChild(
        suggestions
    );

    panel.appendChild(
        results
    );


    overlay.appendChild(
        panel
    );


    document.body.appendChild(
        overlay
    );


    return overlay;

}


/* ============================================================
   SEARCH SUGGESTION ITEM
============================================================ */

function createSearchSuggestion(
    text,
    options = {}
) {

    const item =
        createElement(
            "button",
            {

                className:
                    "search-suggestion",

                attributes: {

                    type:
                        "button",

                    role:
                        "option"

                }

            }
        );


    const icon =
        createElement(
            "span",
            {

                className:
                    "search-suggestion-icon",

                text:
                    options.recent
                        ? "◷"
                        : "⌕",

                attributes: {

                    "aria-hidden":
                        "true"

                }

            }
        );


    const label =
        createElement(
            "span",
            {

                className:
                    "search-suggestion-text",

                text:
                    text

            }
        );


    item.appendChild(
        icon
    );

    item.appendChild(
        label
    );


    item.addEventListener(
        "click",
        () => {

            const elements =
                getSearchElements();


            if (
                elements.input
            ) {

                elements.input.value =
                    text;

            }


            performSearch(
                text
            );

        }
    );


    return item;

}


/* ============================================================
   RENDER RECENT SEARCHES
============================================================ */

function renderRecentSearches() {

    const elements =
        getSearchElements();


    const container =
        elements.suggestions;


    if (!container) {

        return;

    }


    container.innerHTML =
        "";


    if (
        SearchState.query.length >=
        SEARCH_CONFIG.minCharacters
    ) {

        return;

    }


    if (
        !SearchState.recent.length
    ) {

        return;

    }


    const heading =
        createElement(
            "div",
            {

                className:
                    "search-suggestions-heading",

                text:
                    "हाल की खोज"

            }
        );


    container.appendChild(
        heading
    );


    SearchState.recent.forEach(
        query => {

            const row =
                createElement(
                    "div",
                    {

                        className:
                            "search-recent-row"

                    }
                );


            const button =
                createSearchSuggestion(
                    query,
                    {

                        recent:
                            true

                    }
                );


            const remove =
                createElement(
                    "button",
                    {

                        className:
                            "search-recent-remove",

                        text:
                            "×",

                        attributes: {

                            type:
                                "button",

                            "aria-label":
                                `${query} हटाएं`

                        }

                    }
                );


            remove.addEventListener(
                "click",
                event => {

                    event.stopPropagation();

                    removeRecentSearch(
                        query
                    );

                }
            );


            row.appendChild(
                button
            );

            row.appendChild(
                remove
            );


            container.appendChild(
                row
            );

        }
    );


    const clearAll =
        createElement(
            "button",
            {

                className:
                    "search-clear-all",

                text:
                    "हाल की सभी खोज हटाएं",

                attributes: {

                    type:
                        "button"

                }

            }
        );


    clearAll.addEventListener(
        "click",
        clearRecentSearches
    );


    container.appendChild(
        clearAll
    );

}


/* ============================================================
   LOCAL SUGGESTIONS
============================================================ */

function getLocalSearchSuggestions(
    query
) {

    const cleanQuery =
        normalizeText(
            query
        )
        .toLowerCase();


    if (
        cleanQuery.length <
        SEARCH_CONFIG.minCharacters
    ) {

        return [];

    }


    const allNews = [

        ...NewsState.latest,

        ...NewsState.trending,

        ...NewsState.featured,

        ...NewsState.category

    ];


    const unique =
        new Map();


    allNews.forEach(
        article => {

            const title =
                normalizeText(
                    article.title
                );


            if (
                !title
            ) {

                return;

            }


            if (
                title
                    .toLowerCase()
                    .includes(
                        cleanQuery
                    )
            ) {

                const key =
                    title.toLowerCase();


                if (
                    !unique.has(
                        key
                    )
                ) {

                    unique.set(
                        key,
                        title
                    );

                }

            }

        }
    );


    return [
        ...unique.values()
    ]
    .slice(
        0,
        SEARCH_CONFIG.suggestionLimit
    );

}


/* ============================================================
   RENDER SEARCH SUGGESTIONS
============================================================ */

function renderSearchSuggestions(
    suggestions
) {

    const elements =
        getSearchElements();


    const container =
        elements.suggestions;


    if (!container) {

        return;

    }


    container.innerHTML =
        "";


    const list =
        Array.isArray(
            suggestions
        )
            ? suggestions
            : [];


    if (
        !list.length
    ) {

        renderRecentSearches();

        return;

    }


    const heading =
        createElement(
            "div",
            {

                className:
                    "search-suggestions-heading",

                text:
                    "सुझाव"

            }
        );


    container.appendChild(
        heading
    );


    list.forEach(
        suggestion => {

            container.appendChild(
                createSearchSuggestion(
                    suggestion
                )
            );

        }
    );

}


/* ============================================================
   SEARCH INPUT
============================================================ */

function handleSearchInput(
    event
) {

    const query =
        normalizeText(
            event.target.value
        );


    SearchState.query =
        query;


    const elements =
        getSearchElements();


    if (
        elements.clear
    ) {

        elements.clear.classList.toggle(
            "visible",
            Boolean(
                query
            )
        );

    }


    if (
        SearchState.debounceTimer
    ) {

        clearTimeout(
            SearchState.debounceTimer
        );

    }


    if (
        query.length <
        SEARCH_CONFIG.minCharacters
    ) {

        SearchState.suggestions =
            [];


        renderRecentSearches();

        return;

    }


    const localSuggestions =
        getLocalSearchSuggestions(
            query
        );


    SearchState.suggestions =
        localSuggestions;


    renderSearchSuggestions(
        localSuggestions
    );


    SearchState.debounceTimer =
        setTimeout(
            () => {

                fetchSearchSuggestions(
                    query
                );

            },
            SEARCH_CONFIG.debounceDelay
        );

}


/* ============================================================
   FETCH SEARCH SUGGESTIONS
============================================================ */

async function fetchSearchSuggestions(
    query
) {

    const cleanQuery =
        normalizeText(
            query
        );


    if (
        cleanQuery.length <
        SEARCH_CONFIG.minCharacters
    ) {

        return [];

    }


    try {

        const response =
            await apiGet(
                API_ENDPOINTS.search,
                {

                    q:
                        cleanQuery,

                    limit:
                        SEARCH_CONFIG.suggestionLimit,

                    suggestions:
                        true

                },
                {

                    useCache:
                        true

                }
            );


        const suggestions =
            normalizeNewsList(
                response
            )
            .map(
                article =>
                    normalizeText(
                        article.title
                    )
            )
            .filter(
                Boolean
            )
            .slice(
                0,
                SEARCH_CONFIG.suggestionLimit
            );


        if (
            SearchState.query ===
            cleanQuery
        ) {

            SearchState.suggestions =
                suggestions;


            renderSearchSuggestions(
                suggestions
            );

        }


        return suggestions;

    } catch (error) {

        /*
         * Suggestion API fail होने पर
         * local suggestions पहले से उपलब्ध
         * रहती हैं।
         */

        return getLocalSearchSuggestions(
            cleanQuery
        );

    }

}


/* ============================================================
   FETCH SEARCH RESULTS
============================================================ */

async function fetchSearchResults(
    query,
    options = {}
) {

    const cleanQuery =
        normalizeText(
            query
        );


    if (
        cleanQuery.length <
        SEARCH_CONFIG.minCharacters
    ) {

        return {

            items:
                [],

            pagination:
                normalizePagination(
                    {}
                ),

            raw:
                null

        };

    }


    const params = {

        q:
            cleanQuery,

        page:
            Number(
                options.page ||
                1
            ),

        limit:
            Number(
                options.limit ||
                SEARCH_CONFIG.resultsLimit
            )

    };


    if (
        options.category
    ) {

        params.category =
            options.category;

    }


    const response =
        await apiGet(
            API_ENDPOINTS.search,
            params,
            {

                useCache:
                    options.useCache !==
                    false

            }
        );


    return {

        items:
            normalizeNewsList(
                response
            ),

        pagination:
            normalizePagination(
                response
            ),

        raw:
            response

    };

}


/* ============================================================
   RENDER SEARCH RESULTS
============================================================ */

function renderSearchResults(
    result,
    options = {}
) {

    const elements =
        getSearchElements();


    const container =
        options.target ||
        elements.results;


    if (!container) {

        return;

    }


    const items =
        Array.isArray(
            result?.items
        )
            ? result.items
            : [];


    container.innerHTML =
        "";


    if (
        items.length
    ) {

        const heading =
            createElement(
                "div",
                {

                    className:
                        "search-results-heading",

                    text:
                        `"${SearchState.query}" के परिणाम`

                }
            );


        container.appendChild(
            heading
        );


        const grid =
            createNewsGrid(
                items,
                {

                    className:
                        "search-results-grid",

                    showExcerpt:
                        true,

                    showAuthor:
                        true

                }
            );


        container.appendChild(
            grid
        );


        if (
            result.pagination &&
            result.pagination.totalPages >
            1
        ) {

            const pagination =
                createPagination(
                    result.pagination,
                    {

                        onPageChange:
                            page => {

                                performSearch(
                                    SearchState.query,
                                    {

                                        page:
                                            page

                                    }
                                );

                            }

                    }
                );


            if (
                pagination
            ) {

                container.appendChild(
                    pagination
                );

            }

        }

    } else {

        container.appendChild(
            createNewsEmptyState(
                `“${SearchState.query}” के लिए कोई समाचार नहीं मिला।`
            )
        );

    }


    initializeLazyImages();

}


/* ============================================================
   PERFORM SEARCH
============================================================ */

async function performSearch(
    query,
    options = {}
) {

    const cleanQuery =
        normalizeText(
            query
        );


    if (
        cleanQuery.length <
        SEARCH_CONFIG.minCharacters
    ) {

        showToast(
            `कम से कम ${SEARCH_CONFIG.minCharacters} अक्षर लिखें।`,
            "warning"
        );


        return null;

    }


    SearchState.query =
        cleanQuery;

    SearchState.page =
        Number(
            options.page ||
            1
        );

    SearchState.loading =
        true;

    SearchState.searching =
        true;


    saveRecentSearch(
        cleanQuery
    );


    const elements =
        getSearchElements();


    if (
        elements.suggestions
    ) {

        elements.suggestions.innerHTML =
            "";

    }


    if (
        elements.results
    ) {

        renderNewsSkeleton(
            elements.results,
            6
        );

    }


    try {

        const result =
            await fetchSearchResults(
                cleanQuery,
                {

                    ...options,

                    page:
                        SearchState.page

                }
            );


        SearchState.results =
            result.items;


        SearchState.page =
            result.pagination.page;


        SearchState.totalPages =
            result.pagination.totalPages;


        renderSearchResults(
            result
        );


        updateSearchURL(
            cleanQuery,
            SearchState.page
        );


        window.dispatchEvent(
            new CustomEvent(
                "awaaz:search-complete",
                {

                    detail: {

                        query:
                            cleanQuery,

                        result:
                            result

                    }

                }
            )
        );
          
        return result;

    } catch (error) {

        handleGlobalError(
            error,
            "Search"
        );


        if (
            elements.results
        ) {

            elements.results.innerHTML =
                "";


            elements.results.appendChild(
                createNewsEmptyState(
                    "खोज करते समय समस्या हुई। कृपया दोबारा प्रयास करें।"
                )
            );

        }


        return null;

    } finally {

        SearchState.loading =
            false;

        SearchState.searching =
            false;

    }

}


/* ============================================================
   SEARCH URL
============================================================ */

function updateSearchURL(
    query,
    page = 1
) {

    if (
        !window.history ||
        !window.history.replaceState
    ) {

        return;

    }


    const url =
        new URL(
            window.location.href
        );


    url.searchParams.set(
        "q",
        query
    );


    if (
        Number(page) > 1
    ) {

        url.searchParams.set(
            "page",
            String(page)
        );

    } else {

        url.searchParams.delete(
            "page"
        );

    }


    window.history.replaceState(
        {},
        "",
        url
    );

}


/* ============================================================
   OPEN SEARCH
============================================================ */

function openSearch(
    initialQuery = ""
) {

    const overlay =
        ensureSearchPanel();


    const elements =
        getSearchElements();


    if (!overlay) {

        return;

    }


    overlay.classList.add(
        "open"
    );


    overlay.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.classList.add(
        "search-open"
    );


    if (
        elements.input
    ) {

        elements.input.value =
            initialQuery ||
            "";


        SearchState.query =
            normalizeText(
                initialQuery
            );


        setTimeout(
            () => {

                elements.input.focus();

            },
            50
        );

    }


    renderRecentSearches();

}


/* ============================================================
   CLOSE SEARCH
============================================================ */

function closeSearch() {

    const overlay =
        document.querySelector(
            "#searchOverlay"
        );


    if (!overlay) {

        return;

    }


    overlay.classList.remove(
        "open"
    );


    overlay.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.classList.remove(
        "search-open"
    );

}


/* ============================================================
   CLEAR SEARCH INPUT
============================================================ */

function clearSearchInput() {

    const elements =
        getSearchElements();


    if (
        elements.input
    ) {

        elements.input.value =
            "";

        elements.input.focus();

    }


    SearchState.query =
        "";


    SearchState.suggestions =
        [];


    if (
        elements.clear
    ) {

        elements.clear.classList.remove(
            "visible"
        );

    }


    if (
        elements.results
    ) {

        elements.results.innerHTML =
            "";

    }


    renderRecentSearches();

}


/* ============================================================
   INITIALIZE SEARCH
============================================================ */

function initializeSearch() {

    ensureSearchPanel();


    const elements =
        getSearchElements();


    if (
        elements.form &&
        elements.form.dataset.initialized !==
            "true"
    ) {

        elements.form.dataset.initialized =
            "true";


        elements.form.addEventListener(
            "submit",
            event => {

                event.preventDefault();


                const query =
                    elements.input?.value ||
                    "";


                performSearch(
                    query
                );

            }
        );

    }


    if (
        elements.input &&
        elements.input.dataset.initialized !==
            "true"
    ) {

        elements.input.dataset.initialized =
            "true";


        elements.input.addEventListener(
            "input",
            handleSearchInput
        );

    }


    if (
        elements.clear
    ) {

        elements.clear.addEventListener(
            "click",
            clearSearchInput
        );

    }


    if (
        elements.close
    ) {

        elements.close.addEventListener(
            "click",
            closeSearch
        );

    }


    if (
        elements.overlay
    ) {

        elements.overlay.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    elements.overlay
                ) {

                    closeSearch();

                }

            }
        );

    }


    $$(".open-search, #openSearch, .search-trigger")
        .forEach(
            button => {

                if (
                    button.dataset.searchInitialized ===
                    "true"
                ) {

                    return;

                }


                button.dataset.searchInitialized =
                    "true";


                button.addEventListener(
                    "click",
                    event => {

                        event.preventDefault();

                        openSearch();

                    }
                );

            }
        );


    normalizeRecentSearches();


    SearchState.initialized =
        true;

}


/* ============================================================
   KEYBOARD SEARCH SHORTCUT
============================================================ */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "/" &&
            !isTypingInField(
                event.target
            )
        ) {

            event.preventDefault();

            openSearch();

        }


        if (
            event.key === "Escape"
        ) {

            closeSearch();

        }

    }
);


/* ============================================================
   SEARCH FROM URL
============================================================ */

function initializeSearchFromURL() {

    const url =
        new URL(
            window.location.href
        );


    const query =
        normalizeText(
            url.searchParams.get(
                "q"
            ) ||
            ""
        );


    if (
        query.length <
        SEARCH_CONFIG.minCharacters
    ) {

        return;

    }


    setTimeout(
        () => {

            openSearch(
                query
            );


            performSearch(
                query,
                {

                    page:
                        Number(
                            url.searchParams.get(
                                "page"
                            ) || 1
                        )

                }
            );

        },
        400
    );

}


/* ============================================================
   SEARCH EVENTS
============================================================ */

window.addEventListener(
    "awaaz:open-search",
    event => {

        openSearch(
            event.detail?.query ||
            ""
        );

    }
);


window.addEventListener(
    "awaaz:close-search",
    closeSearch
);


/* ============================================================
   SEARCH GLOBAL EXPORT
============================================================ */

window.AwaazRajasthan.search = {

    state:
        SearchState,

    open:
        openSearch,

    close:
        closeSearch,

    clear:
        clearSearchInput,

    search:
        performSearch,

    fetch:
        fetchSearchResults,

    suggestions:
        fetchSearchSuggestions,

    recent:
        {

            save:
                saveRecentSearch,

            remove:
                removeRecentSearch,

            clear:
                clearRecentSearches

        },

    initialize:
        initializeSearch

};


/* ============================================================
   SEARCH AUTO INITIALIZATION
============================================================ */

window.addEventListener(
    "awaaz:ready",
    () => {

        initializeSearch();

        initializeSearchFromURL();

    }
);


/* ============================================================
   END OF PART 11/30
============================================================ */
