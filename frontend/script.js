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
/* ============================================================
   AAWAAZ RAJASTHAN
   SCRIPT.JS — PART 12/30

   PAGINATION SYSTEM
   PAGE BUTTONS
   PREVIOUS / NEXT
   MOBILE PAGINATION
   URL SYNCHRONIZATION
============================================================ */


/* ============================================================
   PAGINATION CONFIGURATION
============================================================ */

const PAGINATION_CONFIG = {

    maxVisiblePages:
        5,

    mobileVisiblePages:
        3,

    scrollToTop:
        true,

    scrollOffset:
        80

};


/* ============================================================
   PAGINATION STATE
============================================================ */

const PaginationState = {

    page:
        1,

    totalPages:
        1,

    totalItems:
        0,

    limit:
        AppState.pageSize ||
        12,

    initialized:
        false

};


/* ============================================================
   NORMALIZE PAGINATION
============================================================ */

function normalizePageData(
    data = {}
) {

    const pagination =
        data.pagination ||
        data.meta?.pagination ||
        data.meta ||
        data;


    const page =
        Number(
            pagination?.page ||
            pagination?.currentPage ||
            1
        );


    const totalPages =
        Number(
            pagination?.totalPages ||
            pagination?.pages ||
            1
        );


    const totalItems =
        Number(
            pagination?.totalItems ||
            pagination?.total ||
            pagination?.count ||
            0
        );


    const limit =
        Number(
            pagination?.limit ||
            pagination?.pageSize ||
            AppState.pageSize ||
            12
        );


    return {

        page:
            Math.max(
                1,
                page
            ),

        totalPages:
            Math.max(
                1,
                totalPages
            ),

        totalItems:
            Math.max(
                0,
                totalItems
            ),

        limit:
            Math.max(
                1,
                limit
            )

    };

}


/* ============================================================
   CALCULATE PAGE RANGE
============================================================ */

function getPageRange(
    currentPage,
    totalPages,
    maxPages = PAGINATION_CONFIG.maxVisiblePages
) {

    const current =
        Math.max(
            1,
            Number(
                currentPage
            ) || 1
        );


    const total =
        Math.max(
            1,
            Number(
                totalPages
            ) || 1
        );


    const maximum =
        Math.max(
            3,
            Number(
                maxPages
            ) ||
            PAGINATION_CONFIG.maxVisiblePages
        );


    if (
        total <= maximum
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
        new Set();


    pages.add(
        1
    );


    pages.add(
        total
    );


    const half =
        Math.floor(
            (maximum - 2) / 2
        );


    let start =
        current -
        half;


    let end =
        current +
        half;


    if (
        start < 2
    ) {

        start =
            2;

        end =
            start +
            maximum -
            3;

    }


    if (
        end >
        total - 1
    ) {

        end =
            total - 1;

        start =
            end -
            maximum +
            3;

    }


    for (
        let page = start;
        page <= end;
        page++
    ) {

        if (
            page > 1 &&
            page < total
        ) {

            pages.add(
                page
            );

        }

    }


    const sorted =
        [
            ...pages
        ]
        .sort(
            (
                first,
                second
            ) =>
                first -
                second
        );


    const output =
        [];


    let previous =
        null;


    sorted.forEach(
        page => {

            if (
                previous !==
                    null &&
                page -
                    previous >
                    1
            ) {

                output.push(
                    "ellipsis"
                );

            }


            output.push(
                page
            );


            previous =
                page;

        }
    );


    return output;

}


/* ============================================================
   CREATE PAGINATION BUTTON
============================================================ */

function createPaginationButton(
    label,
    page,
    options = {}
) {

    const button =
        createElement(
            "button",
            {

                className:
                    `pagination-button ${
                        options.className ||
                        ""
                    }`.trim(),

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

        button.setAttribute(
            "aria-disabled",
            "true"
        );

    }


    if (
        !options.disabled &&
        typeof options.onClick ===
            "function"
    ) {

        button.addEventListener(
            "click",
            () => {

                options.onClick(
                    page
                );

            }
        );

    }


    return button;

}


/* ============================================================
   CREATE PAGINATION
============================================================ */

function createPagination(
    pagination,
    options = {}
) {

    const data =
        normalizePageData(
            pagination
        );


    if (
        data.totalPages <= 1
    ) {

        return null;

    }


    const wrapper =
        createElement(
            "nav",
            {

                className:
                    options.className ||
                    "pagination",

                attributes: {

                    "aria-label":
                        "समाचार पृष्ठ नेविगेशन"

                }

            }
        );


    const inner =
        createElement(
            "div",
            {

                className:
                    "pagination-inner"

            }
        );


    const onPageChange =
        typeof options.onPageChange ===
            "function"
            ? options.onPageChange
            : page =>
                changePage(
                    page,
                    options
                );


    /* --------------------------------------------------------
       PREVIOUS
    -------------------------------------------------------- */

    const previous =
        createPaginationButton(
            "‹",
            data.page - 1,
            {

                className:
                    "pagination-prev",

                ariaLabel:
                    "पिछला पेज",

                disabled:
                    data.page <= 1,

                onClick:
                    onPageChange

            }
        );


    inner.appendChild(
        previous
    );


    /* --------------------------------------------------------
       PAGE NUMBERS
    -------------------------------------------------------- */

    const range =
        getPageRange(
            data.page,
            data.totalPages,
            options.maxVisiblePages ||
            (
                window.innerWidth <= 600
                    ? PAGINATION_CONFIG.mobileVisiblePages
                    : PAGINATION_CONFIG.maxVisiblePages
            )
        );


    range.forEach(
        page => {

            if (
                page ===
                "ellipsis"
            ) {

                const ellipsis =
                    createElement(
                        "span",
                        {

                            className:
                                "pagination-ellipsis",

                            text:
                                "…",

                            attributes: {

                                "aria-hidden":
                                    "true"

                            }

                        }
                    );


                inner.appendChild(
                    ellipsis
                );


                return;

            }


            inner.appendChild(
                createPaginationButton(
                    String(page),
                    page,
                    {

                        active:
                            page ===
                            data.page,

                        ariaLabel:
                            `पेज ${page}`,

                        onClick:
                            onPageChange

                    }
                )
            );

        }
    );


    /* --------------------------------------------------------
       NEXT
    -------------------------------------------------------- */

    const next =
        createPaginationButton(
            "›",
            data.page + 1,
            {

                className:
                    "pagination-next",

                ariaLabel:
                    "अगला पेज",

                disabled:
                    data.page >=
                    data.totalPages,

                onClick:
                    onPageChange

            }
        );


    inner.appendChild(
        next
    );


    wrapper.appendChild(
        inner
    );


    /* --------------------------------------------------------
       PAGE INFORMATION
    -------------------------------------------------------- */

    if (
        options.showInfo !==
        false
    ) {

        const info =
            createElement(
                "div",
                {

                    className:
                        "pagination-info",

                    text:
                        `पेज ${data.page} / ${data.totalPages}`

                }
            );


        wrapper.appendChild(
            info
        );

    }


    return wrapper;

}


/* ============================================================
   RENDER PAGINATION
============================================================ */

function renderPagination(
    pagination,
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


    const data =
        normalizePageData(
            pagination
        );


    PaginationState.page =
        data.page;


    PaginationState.totalPages =
        data.totalPages;


    PaginationState.totalItems =
        data.totalItems;


    PaginationState.limit =
        data.limit;


    const paginationElement =
        createPagination(
            data,
            options
        );


    target.replaceChildren();


    if (
        paginationElement
    ) {

        target.appendChild(
            paginationElement
        );

    }


    return paginationElement;

}


/* ============================================================
   GET CURRENT PAGE FROM URL
============================================================ */

function getPageFromURL(
    fallback = 1
) {

    const url =
        new URL(
            window.location.href
        );


    const page =
        Number(
            url.searchParams.get(
                "page"
            )
        );


    if (
        !Number.isInteger(
            page
        ) ||
        page < 1
    ) {

        return fallback;

    }


    return page;

}


/* ============================================================
   UPDATE PAGE URL
============================================================ */

function updatePageURL(
    page,
    options = {}
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


    const cleanPage =
        Math.max(
            1,
            Number(
                page
            ) || 1
        );


    if (
        cleanPage > 1
    ) {

        url.searchParams.set(
            "page",
            String(
                cleanPage
            )
        );

    } else {

        url.searchParams.delete(
            "page"
        );

    }


    if (
        options.category
    ) {

        const normalized =
            normalizeCategory(
                options.category
            );


        if (
            normalized.slug
        ) {

            url.searchParams.set(
                "category",
                normalized.slug
            );

        }

    }


    if (
        options.query
    ) {

        url.searchParams.set(
            "q",
            options.query
        );

    }


    window.history.replaceState(
        {},
        "",
        url
    );

}


/* ============================================================
   SCROLL TO NEWS CONTENT
============================================================ */

function scrollToNewsContent(
    target,
    options = {}
) {

    if (
        options.scrollToTop ===
        false
    ) {

        return;

    }


    if (
        typeof target ===
        "string"
    ) {

        target =
            document.querySelector(
                target
            );

    }


    const fallback =
        document.querySelector(
            "#newsGrid, .news-grid, main"
        );


    const element =
        target ||
        fallback;


    if (!element) {

        window.scrollTo(
            {

                top:
                    0,

                behavior:
                    "smooth"

            }
        );


        return;

    }


    const offset =
        Number(
            options.scrollOffset ??
            PAGINATION_CONFIG.scrollOffset
        );


    const top =
        element.getBoundingClientRect().top +
        window.scrollY -
        offset;


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
   CHANGE PAGE
============================================================ */

async function changePage(
    page,
    options = {}
) {

    const targetPage =
        Math.max(
            1,
            Number(
                page
            ) || 1
        );


    const currentPage =
        Number(
            PaginationState.page
        ) || 1;


    if (
        targetPage ===
        currentPage &&
        !options.force
    ) {

        return null;

    }


    if (
        PaginationState.totalPages &&
        targetPage >
        PaginationState.totalPages
    ) {

        return null;

    }


    const type =
        options.type ||
        detectPaginationContext();


    PaginationState.page =
        targetPage;


    if (
        options.showLoading !==
        false
    ) {

        const target =
            options.target ||
            document.querySelector(
                "#newsGrid, .news-grid, .search-results"
            );


        if (
            target
        ) {

            renderNewsSkeleton(
                target,
                options.skeletonCount ||
                6
            );

        }

    }


    let result;


    try {

        switch (
            type
        ) {

            case "search":

                result =
                    await performSearch(
                        options.query ||
                        SearchState.query,
                        {

                            ...options,

                            page:
                                targetPage

                        }
                    );

                break;


            case "category":

                result =
                    await loadNewsByCategory(
                        options.category ||
                        CategoryState.current,
                        targetPage,
                        options
                    );

                break;


            case "latest":

                result =
                    await loadLatestNews(
                        {

                            ...options,

                            page:
                                targetPage

                        }
                    );

                break;


            default:

                result =
                    await loadLatestNews(
                        {

                            ...options,

                            page:
                                targetPage

                        }
                    );

                break;

        }


        updatePageURL(
            targetPage,
            {

                category:
                    options.category ||
                    (
                        type ===
                        "category"
                            ? CategoryState.current
                            : null
                    ),

                query:
                    options.query ||
                    (
                        type ===
                        "search"
                            ? SearchState.query
                            : null
                    )

            }
        );


        if (
            options.scroll !==
            false
        ) {

            scrollToNewsContent(
                options.scrollTarget ||
                options.target,
                options
            );

        }


        window.dispatchEvent(
            new CustomEvent(
                "awaaz:page-changed",
                {

                    detail: {

                        page:
                            targetPage,

                        type:
                            type,

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
            "Pagination"
        );


        return null;

    }

}


/* ============================================================
   DETECT PAGINATION CONTEXT
============================================================ */

function detectPaginationContext() {

    if (
        SearchState.searching ||
        SearchState.query
    ) {

        return "search";

    }


    if (
        CategoryState.current &&
        CategoryState.current !==
            CATEGORY_CONFIG.defaultCategory
    ) {

        return "category";

    }


    return "latest";

}


/* ============================================================
   PAGINATION CLICK DELEGATION
============================================================ */

function initializePaginationDelegation() {

    document.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    ".pagination-button"
                );


            if (!button) {

                return;

            }


            if (
                button.disabled
            ) {

                return;

            }


            if (
                button.dataset.paginationBound ===
                "true"
            ) {

                return;

            }


            /*
             * createPagination में listener पहले से
             * मौजूद हो सकता है। यह delegation केवल
             * manually बने pagination buttons के लिए है।
             */

            const pagination =
                button.closest(
                    ".pagination"
                );


            if (
                !pagination
            ) {

                return;

            }


            if (
                button.closest(
                    "[data-pagination-custom]"
                )
            ) {

                return;

            }

        }
    );

}


/* ============================================================
   PAGINATION RESIZE
============================================================ */

let paginationResizeTimer =
    null;


window.addEventListener(
    "resize",
    () => {

        if (
            paginationResizeTimer
        ) {

            clearTimeout(
                paginationResizeTimer
            );

        }


        paginationResizeTimer =
            setTimeout(
                () => {

                    const pagination =
                        document.querySelector(
                            ".pagination"
                        );


                    if (
                        !pagination
                    ) {

                        return;

                    }


                    /*
                     * केवल visual range को refresh
                     * करने की आवश्यकता होने पर caller
                     * renderPagination() कर सकता है।
                     */

                    pagination.classList.toggle(
                        "pagination-mobile",
                        window.innerWidth <=
                            600
                    );

                },
                150
            );

    }
);


/* ============================================================
   PAGINATION INITIALIZATION
============================================================ */

function initializePagination() {

    initializePaginationDelegation();


    PaginationState.page =
        getPageFromURL(
            1
        );


    PaginationState.initialized =
        true;

}


/* ============================================================
   PAGINATION GLOBAL EXPORT
============================================================ */

window.AwaazRajasthan.pagination = {

    state:
        PaginationState,

    normalize:
        normalizePageData,

    range:
        getPageRange,

    create:
        createPagination,

    render:
        renderPagination,

    change:
        changePage,

    current:
        getPageFromURL,

    updateURL:
        updatePageURL,

    scrollToNews:
        scrollToNewsContent,

    initialize:
        initializePagination

};


/* ============================================================
   PAGINATION AUTO INITIALIZATION
============================================================ */

window.addEventListener(
    "awaaz:ready",
    () => {

        initializePagination();

    }
);


/* ============================================================
   END OF PART 12/30
============================================================ */
/* ============================================================
   AAWAAZ RAJASTHAN
   SCRIPT.JS — PART 13/30

   NEWS CARD INTERACTION
   ARTICLE OPEN
   ARTICLE CLICK TRACKING
   SHARE BUTTONS
   BOOKMARK / SAVE NEWS
   READING TIME
============================================================ */


/* ============================================================
   ARTICLE INTERACTION CONFIG
============================================================ */

const ARTICLE_INTERACTION_CONFIG = {

    storageKey:
        "awaaz_saved_news",

    maxSaved:
        100,

    shareTitle:
        "आवाज़ राजस्थान",

    defaultShareText:
        "आवाज़ राजस्थान पर यह खबर पढ़ें।"

};


/* ============================================================
   ARTICLE INTERACTION STATE
============================================================ */

const ArticleInteractionState = {

    saved:
        getStorage(
            ARTICLE_INTERACTION_CONFIG.storageKey,
            []
        ),

    initialized:
        false

};


/* ============================================================
   NORMALIZE SAVED NEWS
============================================================ */

function normalizeSavedNews() {

    if (
        !Array.isArray(
            ArticleInteractionState.saved
        )
    ) {

        ArticleInteractionState.saved =
            [];

    }


    ArticleInteractionState.saved =
        ArticleInteractionState.saved
            .filter(
                item =>
                    item &&
                    (
                        item.id ||
                        item._id ||
                        item.slug
                    )
            )
            .slice(
                0,
                ARTICLE_INTERACTION_CONFIG.maxSaved
            );


    setStorage(
        ARTICLE_INTERACTION_CONFIG.storageKey,
        ArticleInteractionState.saved
    );

}


/* ============================================================
   GET ARTICLE ID
============================================================ */

function getArticleId(
    article
) {

    if (!article) {

        return "";

    }


    return String(
        article.id ||
        article._id ||
        article.slug ||
        ""
    );

}


/* ============================================================
   GET ARTICLE URL
============================================================ */

function getArticleURL(
    article
) {

    if (!article) {

        return window.location.href;

    }


    if (
        article.url
    ) {

        return article.url;

    }


    const slug =
        article.slug ||
        article.id ||
        article._id;


    if (
        slug
    ) {

        return new URL(
            `/news/${encodeURIComponent(slug)}`,
            window.location.origin
        ).href;

    }


    return window.location.href;

}


/* ============================================================
   IS NEWS SAVED
============================================================ */

function isNewsSaved(
    article
) {

    const id =
        getArticleId(
            article
        );


    if (!id) {

        return false;

    }


    return ArticleInteractionState.saved.some(
        item =>
            getArticleId(
                item
            ) ===
            id
    );

}


/* ============================================================
   SAVE NEWS
============================================================ */

function saveNews(
    article
) {

    if (!article) {

        return false;

    }


    const id =
        getArticleId(
            article
        );


    if (!id) {

        return false;

    }


    if (
        isNewsSaved(
            article
        )
    ) {

        return true;

    }


    ArticleInteractionState.saved.unshift(
        {

            id:
                id,

            _id:
                article._id ||
                article.id,

            slug:
                article.slug ||
                "",

            title:
                article.title ||
                "",

            image:
                getArticleImage(
                    article
                ),

            category:
                article.category ||
                "",

            savedAt:
                new Date().toISOString()

        }
    );


    ArticleInteractionState.saved =
        ArticleInteractionState.saved.slice(
            0,
            ARTICLE_INTERACTION_CONFIG.maxSaved
        );


    setStorage(
        ARTICLE_INTERACTION_CONFIG.storageKey,
        ArticleInteractionState.saved
    );


    updateSaveButtons(
        id,
        true
    );


    showToast(
        "खबर सेव कर ली गई है।",
        "success"
    );


    window.dispatchEvent(
        new CustomEvent(
            "awaaz:news-saved",
            {

                detail: {

                    article:
                        article

                }

            }
        )
    );


    return true;

}


/* ============================================================
   REMOVE SAVED NEWS
============================================================ */

function removeSavedNews(
    article
) {

    const id =
        getArticleId(
            article
        );


    if (!id) {

        return false;

    }


    ArticleInteractionState.saved =
        ArticleInteractionState.saved.filter(
            item =>
                getArticleId(
                    item
                ) !==
                id
        );


    setStorage(
        ARTICLE_INTERACTION_CONFIG.storageKey,
        ArticleInteractionState.saved
    );


    updateSaveButtons(
        id,
        false
    );


    showToast(
        "सेव की गई खबर हटा दी गई है।",
        "info"
    );


    window.dispatchEvent(
        new CustomEvent(
            "awaaz:news-unsaved",
            {

                detail: {

                    article:
                        article

                }

            }
        )
    );


    return true;

}


/* ============================================================
   TOGGLE SAVE NEWS
============================================================ */

function toggleSaveNews(
    article
) {

    if (
        isNewsSaved(
            article
        )
    ) {

        return removeSavedNews(
            article
        );

    }


    return saveNews(
        article
    );

}


/* ============================================================
   UPDATE SAVE BUTTONS
============================================================ */

function updateSaveButtons(
    articleId,
    saved
) {

    if (!articleId) {

        return;

    }


    $$(
        `[data-save-news="${CSS.escape(
            String(articleId)
        )}"]`
    )
    .forEach(
        button => {

            button.classList.toggle(
                "saved",
                saved
            );


            button.setAttribute(
                "aria-pressed",
                saved
                    ? "true"
                    : "false"
            );


            const label =
                saved
                    ? "सेव की गई खबर से हटाएं"
                    : "खबर सेव करें";


            button.setAttribute(
                "aria-label",
                label
            );


            const text =
                button.querySelector(
                    ".save-text"
                );


            if (
                text
            ) {

                text.textContent =
                    saved
                        ? "सेव्ड"
                        : "सेव करें";

            }

        }
    );

}


/* ============================================================
   GET ARTICLE FROM DOM
============================================================ */

function getArticleFromElement(
    element
) {

    if (!element) {

        return null;

    }


    const json =
        element.dataset.article;


    if (
        json
    ) {

        try {

            return JSON.parse(
                json
            );

        } catch (
            error
        ) {

            /*
             * Invalid JSON होने पर नीचे
             * DOM data से article बनाया जाएगा।
             */

        }

    }


    const id =
        element.dataset.id ||
        element.dataset.newsId ||
        element.dataset.articleId;


    const slug =
        element.dataset.slug ||
        "";


    const titleElement =
        element.querySelector(
            ".news-title, .article-title, h2, h3, h4"
        );


    const imageElement =
        element.querySelector(
            "img"
        );


    const title =
        normalizeText(
            element.dataset.title ||
            titleElement?.textContent ||
            ""
        );


    const image =
        imageElement?.currentSrc ||
        imageElement?.src ||
        "";


    if (
        !id &&
        !slug &&
        !title
    ) {

        return null;

    }


    return {

        id:
            id || slug,

        _id:
            id || slug,

        slug:
            slug,

        title:
            title,

        image:
            image

    };

}


/* ============================================================
   ARTICLE CLICK
============================================================ */

function handleArticleClick(
    event
) {

    const link =
        event.currentTarget;


    if (!link) {

        return;

    }


    const article =
        getArticleFromElement(
            link.closest(
                "[data-news-id], [data-article-id], [data-article], .news-card, .article-card"
            )
        );


    if (
        article
    ) {

        trackArticleOpen(
            article
        );

    }

}


/* ============================================================
   TRACK ARTICLE OPEN
============================================================ */

async function trackArticleOpen(
    article
) {

    const id =
        getArticleId(
            article
        );


    if (!id) {

        return;

    }


    window.dispatchEvent(
        new CustomEvent(
            "awaaz:article-open",
            {

                detail: {

                    article:
                        article

                }

            }
        )
    );


    /*
     * Analytics endpoint available होने पर
     * request भेजें।
     */

    if (
        typeof apiPost !==
        "function"
    ) {

        return;

    }


    try {

        await apiPost(
            `${API_ENDPOINTS.news}/${encodeURIComponent(id)}/view`,
            {

                source:
                    "website",

                path:
                    window.location.pathname

            },
            {

                silent:
                    true

            }
        );

    } catch (
        error
    ) {

        /*
         * Analytics fail होने से user experience
         * प्रभावित नहीं होना चाहिए।
         */

    }

}


/* ============================================================
   CREATE SHARE DATA
============================================================ */

function createShareData(
    article
) {

    const title =
        normalizeText(
            article?.title ||
            ARTICLE_INTERACTION_CONFIG.shareTitle
        );


    const url =
        getArticleURL(
            article
        );


    return {

        title:
            title,

        text:
            article?.excerpt ||
            ARTICLE_INTERACTION_CONFIG.defaultShareText,

        url:
            url

    };

}


/* ============================================================
   NATIVE SHARE
============================================================ */

async function shareNews(
    article
) {

    if (!article) {

        return false;

    }


    const data =
        createShareData(
            article
        );


    try {

        if (
            navigator.share
        ) {

            await navigator.share(
                {

                    title:
                        data.title,

                    text:
                        data.text,

                    url:
                        data.url

                }
            );


            trackShare(
                article,
                "native"
            );


            return true;

        }


        return openShareFallback(
            article
        );

    } catch (
        error
    ) {

        /*
         * User ने share dialog cancel किया हो
         * तो error message नहीं दिखाना है।
         */

        if (
            error?.name ===
            "AbortError"
        ) {

            return false;

        }


        return false;

    }

}


/* ============================================================
   SHARE FALLBACK
============================================================ */

function openShareFallback(
    article
) {

    const data =
        createShareData(
            article
        );


    const encodedURL =
        encodeURIComponent(
            data.url
        );


    const encodedText =
        encodeURIComponent(
            `${data.title} - ${data.url}`
        );


    const encodedWhatsApp =
        encodeURIComponent(
            `${data.title}\n${data.url}`
        );


    const html =
        `

        <div class="share-menu">

            <button
                type="button"
                data-share-type="whatsapp"
            >
                WhatsApp
            </button>

            <button
                type="button"
                data-share-type="facebook"
            >
                Facebook
            </button>

            <button
                type="button"
                data-share-type="x"
            >
                X
            </button>

            <button
                type="button"
                data-share-type="copy"
            >
                लिंक कॉपी करें
            </button>

        </div>

        `;


    const existing =
        document.querySelector(
            ".share-menu-overlay"
        );


    if (
        existing
    ) {

        existing.remove();

    }


    const overlay =
        createElement(
            "div",
            {

                className:
                    "share-menu-overlay"

            }
        );


    const panel =
        createElement(
            "div",
            {

                className:
                    "share-menu-panel"

            }
        );


    const title =
        createElement(
            "h3",
            {

                text:
                    "खबर शेयर करें"

            }
        );


    const options =
        createElement(
            "div",
            {

                className:
                    "share-menu-options"

            }
        );


    const buttons = [

        {

            label:
                "WhatsApp",

            type:
                "whatsapp"

        },

        {

            label:
                "Facebook",

            type:
                "facebook"

        },

        {

            label:
                "X",

            type:
                "x"

        },

        {

            label:
                "लिंक कॉपी करें",

            type:
                "copy"

        }

    ];


    buttons.forEach(
        item => {

            const button =
                createElement(
                    "button",
                    {

                        className:
                            "share-option",

                        text:
                            item.label,

                        attributes: {

                            type:
                                "button"

                        }

                    }
                );


            button.addEventListener(
                "click",
                async () => {

                    if (
                        item.type ===
                        "whatsapp"
                    ) {

                        openExternalURL(
                            `https://wa.me/?text=${encodedWhatsApp}`
                        );

                    }


                    if (
                        item.type ===
                        "facebook"
                    ) {

                        openExternalURL(
                            `https://www.facebook.com/sharer/sharer.php?u=${encodedURL}`
                        );

                    }


                    if (
                        item.type ===
                        "x"
                    ) {

                        openExternalURL(
                            `https://twitter.com/intent/tweet?text=${encodedText}`
                        );

                    }


                    if (
                        item.type ===
                        "copy"
                    ) {

                        await copyToClipboard(
                            data.url
                        );


                        showToast(
                            "खबर का लिंक कॉपी हो गया।",
                            "success"
                        );

                    }


                    trackShare(
                        article,
                        item.type
                    );


                    overlay.remove();

                }
            );


            options.appendChild(
                button
            );

        }
    );


    const close =
        createElement(
            "button",
            {

                className:
                    "share-menu-close",

                text:
                    "बंद करें",

                attributes: {

                    type:
                        "button"

                }

            }
        );


    close.addEventListener(
        "click",
        () => {

            overlay.remove();

        }
    );


    panel.appendChild(
        title
    );

    panel.appendChild(
        options
    );

    panel.appendChild(
        close
    );


    overlay.appendChild(
        panel
    );


    overlay.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                overlay
            ) {

                overlay.remove();

            }

        }
    );


    document.body.appendChild(
        overlay
    );


    return true;

}


/* ============================================================
   TRACK SHARE
============================================================ */

async function trackShare(
    article,
    method
) {

    window.dispatchEvent(
        new CustomEvent(
            "awaaz:article-shared",
            {

                detail: {

                    article:
                        article,

                    method:
                        method

                }

            }
        )
    );


    if (
        typeof apiPost !==
        "function"
    ) {

        return;

    }


    const id =
        getArticleId(
            article
        );


    if (!id) {

        return;

    }


    try {

        await apiPost(
            `${API_ENDPOINTS.news}/${encodeURIComponent(id)}/share`,
            {

                method:
                    method

            },
            {

                silent:
                    true

            }
        );

    } catch (
        error
    ) {

        /*
         * Share analytics failure ignored.
         */

    }

}


/* ============================================================
   COPY ARTICLE LINK
============================================================ */

async function copyArticleLink(
    article
) {

    const url =
        getArticleURL(
            article
        );


    const copied =
        await copyToClipboard(
            url
        );


    if (
        copied
    ) {

        showToast(
            "खबर का लिंक कॉपी हो गया।",
           "success"
        );


        trackShare(
            article,
            "copy"
        );

    }


    return copied;

}


/* ============================================================
   READING TIME
============================================================ */

function calculateReadingTime(
    content,
    wordsPerMinute = 180
) {

    const text =
        normalizeText(
            content
        );


    if (!text) {

        return 1;

    }


    const words =
        text
            .split(
                /\s+/
            )
            .filter(
                Boolean
            )
            .length;


    return Math.max(
        1,
        Math.ceil(
            words /
            wordsPerMinute
        )
    );

}


/* ============================================================
   FORMAT READING TIME
============================================================ */

function formatReadingTime(
    minutes
) {

    const value =
        Math.max(
            1,
            Number(
                minutes
            ) || 1
        );


    return `${value} मिनट पढ़ने का समय`;

}


/* ============================================================
   UPDATE READING TIME ELEMENTS
============================================================ */

function updateReadingTime(
    article,
    target
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


    const content =
        article?.content ||
        article?.body ||
        article?.description ||
        article?.excerpt ||
        "";


    const minutes =
        calculateReadingTime(
            content
        );


    target.textContent =
        formatReadingTime(
            minutes
        );


    target.dataset.minutes =
        String(
            minutes
        );

}


/* ============================================================
   ARTICLE ACTION DELEGATION
============================================================ */

function initializeArticleActions() {

    document.addEventListener(
        "click",
        event => {

            const saveButton =
                event.target.closest(
                    "[data-save-news]"
                );


            if (
                saveButton
            ) {

                event.preventDefault();

                event.stopPropagation();


                const article =
                    getArticleFromElement(
                        saveButton.closest(
                            "[data-news-id], [data-article-id], [data-article], .news-card, .article-card"
                        )
                    );


                if (
                    article
                ) {

                    toggleSaveNews(
                        article
                    );

                }


                return;

            }


            const shareButton =
                event.target.closest(
                    "[data-share-news]"
                );


            if (
                shareButton
            ) {

                event.preventDefault();

                event.stopPropagation();


                const article =
                    getArticleFromElement(
                        shareButton.closest(
                            "[data-news-id], [data-article-id], [data-article], .news-card, .article-card"
                        )
                    );


                if (
                    article
                ) {

                    shareNews(
                        article
                    );

                }


                return;

            }


            const copyButton =
                event.target.closest(
                    "[data-copy-news]"
                );


            if (
                copyButton
            ) {

                event.preventDefault();

                event.stopPropagation();


                const article =
                    getArticleFromElement(
                        copyButton.closest(
                            "[data-news-id], [data-article-id], [data-article], .news-card, .article-card"
                        )
                    );


                if (
                    article
                ) {

                    copyArticleLink(
                        article
                    );

                }

            }

        }
    );

}


/* ============================================================
   INITIALIZE ARTICLE CARDS
============================================================ */

function initializeArticleCards() {

    const cards =
        $$(
            "[data-news-id], [data-article-id], [data-article], .news-card, .article-card"
        );


    cards.forEach(
        card => {

            const article =
                getArticleFromElement(
                    card
                );


            if (
                !article
            ) {

                return;

            }


            const id =
                getArticleId(
                    article
                );


            if (
                id
            ) {

                updateSaveButtons(
                    id,
                    isNewsSaved(
                        article
                    )
                );

            }


            const links =
                card.querySelectorAll(
                    "a[href]"
                );


            links.forEach(
                link => {

                    if (
                        link.dataset.articleClickInitialized ===
                        "true"
                    ) {

                        return;

                    }


                    link.dataset.articleClickInitialized =
                        "true";


                    link.addEventListener(
                        "click",
                        () => {

                            trackArticleOpen(
                                article
                            );

                        }
                    );

                }
            );

        }
    );

}


/* ============================================================
   INITIALIZE ARTICLE INTERACTION
============================================================ */

function initializeArticleInteraction() {

    normalizeSavedNews();

    initializeArticleActions();

    initializeArticleCards();


    ArticleInteractionState.initialized =
        true;

}


/* ============================================================
   ARTICLE INTERACTION GLOBAL EXPORT
============================================================ */

window.AwaazRajasthan.articleInteraction = {

    state:
        ArticleInteractionState,

    getId:
        getArticleId,

    getURL:
        getArticleURL,

    save:
        saveNews,

    remove:
        removeSavedNews,

    toggle:
        toggleSaveNews,

    isSaved:
        isNewsSaved,

    share:
        shareNews,

    copy:
        copyArticleLink,

    readingTime:
        calculateReadingTime,

    formatReadingTime:
        formatReadingTime,

    initialize:
        initializeArticleInteraction

};


/* ============================================================
   AUTO INITIALIZATION
============================================================ */

window.addEventListener(
    "awaaz:ready",
    () => {

        initializeArticleInteraction();

    }
);


/* ============================================================
   END OF PART 13/30
============================================================ */
/* ============================================================
   AAWAAZ RAJASTHAN
   SCRIPT.JS — PART 14/30

   BOOKMARK / SAVED NEWS PAGE
   SAVED NEWS LIST
   REMOVE SAVED NEWS
   CLEAR SAVED NEWS
   SAVED NEWS COUNTER
   EMPTY STATE
============================================================ */


/* ============================================================
   SAVED NEWS CONFIGURATION
============================================================ */

const SAVED_NEWS_CONFIG = {

    containerSelectors: [
        "#savedNews",
        "#savedNewsGrid",
        ".saved-news-grid",
        ".bookmarked-news"
    ],

    counterSelectors: [
        "#savedNewsCount",
        ".saved-news-count",
        "[data-saved-count]"
    ],

    emptyMessage:
        "अभी तक आपने कोई खबर सेव नहीं की है।",

    pageSize:
        12

};


/* ============================================================
   SAVED NEWS STATE
============================================================ */

const SavedNewsState = {

    page:
        1,

    initialized:
        false

};


/* ============================================================
   GET SAVED NEWS
============================================================ */

function getSavedNews() {

    if (
        !Array.isArray(
            ArticleInteractionState.saved
        )
    ) {

        ArticleInteractionState.saved =
            [];

    }


    return [
        ...ArticleInteractionState.saved
    ];

}


/* ============================================================
   GET SAVED NEWS COUNT
============================================================ */

function getSavedNewsCount() {

    return getSavedNews().length;

}


/* ============================================================
   UPDATE SAVED NEWS COUNTER
============================================================ */

function updateSavedNewsCounter() {

    const count =
        getSavedNewsCount();


    SAVED_NEWS_CONFIG.counterSelectors
        .forEach(
            selector => {

                $$(selector)
                    .forEach(
                        element => {

                            element.textContent =
                                String(
                                    count
                                );


                            element.dataset.count =
                                String(
                                    count
                                );


                            element.classList.toggle(
                                "has-items",
                                count > 0
                            );

                        }
                    );

            }
        );


    $$(
        "[data-saved-news-count]"
    )
    .forEach(
        element => {

            element.textContent =
                String(
                    count
                );

        }
    );

}


/* ============================================================
   FIND SAVED NEWS CONTAINER
============================================================ */

function getSavedNewsContainer() {

    for (
        const selector of
        SAVED_NEWS_CONFIG.containerSelectors
    ) {

        const element =
            document.querySelector(
                selector
            );


        if (
            element
        ) {

            return element;

        }

    }


    return null;

}


/* ============================================================
   CREATE SAVED NEWS CARD
============================================================ */

function createSavedNewsCard(
    article
) {

    if (
        typeof createNewsCard ===
        "function"
    ) {

        const card =
            createNewsCard(
                article,
                {

                    showExcerpt:
                        true,

                    showAuthor:
                        true,

                    saved:
                        true

                }
            );


        if (
            card
        ) {

            return card;

        }

    }


    const card =
        createElement(
            "article",
            {

                className:
                    "news-card saved-news-card"

            }
        );


    const image =
        getArticleImage(
            article
        );


    if (
        image
    ) {

        const imageWrapper =
            createElement(
                "div",
                {

                    className:
                        "news-card-image"

                }
            );


        const img =
            createElement(
                "img",
                {

                    attributes: {

                        src:
                            image,

                        alt:
                            article.title ||
                            "समाचार",

                        loading:
                            "lazy"

                    }

                }
            );


        imageWrapper.appendChild(
            img
        );


        card.appendChild(
            imageWrapper
        );

    }


    const content =
        createElement(
            "div",
            {

                className:
                    "news-card-content"

            }
        );


    const title =
        createElement(
            "h3",
            {

                className:
                    "news-title",

                text:
                    article.title ||
                    "समाचार"

            }
        );


    content.appendChild(
        title
    );


    if (
        article.excerpt
    ) {

        content.appendChild(
            createElement(
                "p",
                {

                    className:
                        "news-excerpt",

                    text:
                        article.excerpt

                }
            )
        );

    }


    const actions =
        createElement(
            "div",
            {

                className:
                    "news-card-actions"

            }
        );


    const openButton =
        createElement(
            "button",
            {

                className:
                    "saved-open-button",

                text:
                    "खबर पढ़ें",

                attributes: {

                    type:
                        "button"

                }

            }
        );


    const removeButton =
        createElement(
            "button",
            {

                className:
                    "saved-remove-button",

                text:
                    "हटाएं",

                attributes: {

                    type:
                        "button",

                    "data-remove-saved":
                        getArticleId(
                            article
                        )

                }

            }
        );


    openButton.addEventListener(
        "click",
        () => {

            openArticle(
                article
            );

        }
    );


    removeButton.addEventListener(
        "click",
        () => {

            removeSavedNews(
                article
            );


            renderSavedNews();

        }
    );


    actions.appendChild(
        openButton
    );

    actions.appendChild(
        removeButton
    );


    content.appendChild(
        actions
    );


    card.appendChild(
        content
    );


    return card;

}


/* ============================================================
   CREATE SAVED NEWS EMPTY STATE
============================================================ */

function createSavedNewsEmptyState() {

    const wrapper =
        createElement(
            "div",
            {

                className:
                    "saved-news-empty"

            }
        );


    const icon =
        createElement(
            "div",
            {

                className:
                    "saved-news-empty-icon",

                text:
                    "☆",

                attributes: {

                    "aria-hidden":
                        "true"

                }

            }
        );


    const title =
        createElement(
            "h2",
            {

                text:
                    "सेव की गई कोई खबर नहीं"

            }
        );


    const message =
        createElement(
            "p",
            {

                text:
                    SAVED_NEWS_CONFIG.emptyMessage

            }
        );


    const button =
        createElement(
            "button",
            {

                className:
                    "saved-news-home-button",

                text:
                    "खबरें देखें",

                attributes: {

                    type:
                        "button"

                }

            }
        );


    button.addEventListener(
        "click",
        () => {

            if (
                typeof navigateToHome ===
                "function"
            ) {

                navigateToHome();

                return;

            }


            window.location.href =
                "/";

        }
    );


    wrapper.appendChild(
        icon
    );

    wrapper.appendChild(
        title
    );

    wrapper.appendChild(
        message
    );

    wrapper.appendChild(
        button
    );


    return wrapper;

}


/* ============================================================
   RENDER SAVED NEWS
============================================================ */

function renderSavedNews(
    target = null
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


    const container =
        target ||
        getSavedNewsContainer();


    updateSavedNewsCounter();


    if (!container) {

        return null;

    }


    const saved =
        getSavedNews();


    container.innerHTML =
        "";


    if (
        !saved.length
    ) {

        container.appendChild(
            createSavedNewsEmptyState()
        );


        return container;

    }


    const header =
        createElement(
            "div",
            {

                className:
                    "saved-news-header"

            }
        );


    const title =
        createElement(
            "h2",
            {

                text:
                    "सेव की गई खबरें"

            }
        );


    const clearButton =
        createElement(
            "button",
            {

                className:
                    "saved-clear-all",

                text:
                    "सभी हटाएं",

                attributes: {

                    type:
                        "button"

                }

            }
        );


    clearButton.addEventListener(
        "click",
        () => {

            clearAllSavedNews(
                {

                    rerender:
                        true

                }
            );

        }
    );


    header.appendChild(
        title
    );


    header.appendChild(
        clearButton
    );


    container.appendChild(
        header
    );


    const grid =
        createElement(
            "div",
            {

                className:
                    "saved-news-grid"

            }
        );


    saved.forEach(
        article => {

            const card =
                createSavedNewsCard(
                    article
                );


            if (
                card
            ) {

                grid.appendChild(
                    card
                );

            }

        }
    );


    container.appendChild(
        grid
    );


    initializeLazyImages();


    return container;

}


/* ============================================================
   CLEAR ALL SAVED NEWS
============================================================ */

function clearAllSavedNews(
    options = {}
) {

    const count =
        getSavedNewsCount();


    if (
        count === 0
    ) {

        return false;

    }


    if (
        options.confirm !== false
    ) {

        const confirmed =
            window.confirm(
                "क्या आप सभी सेव की गई खबरें हटाना चाहते हैं?"
            );


        if (
            !confirmed
        ) {

            return false;

        }

    }


    ArticleInteractionState.saved =
        [];


    removeStorage(
        ARTICLE_INTERACTION_CONFIG.storageKey
    );


    updateSavedNewsCounter();


    if (
        options.rerender !==
        false
    ) {

        renderSavedNews();

    }


    showToast(
        "सभी सेव की गई खबरें हटा दी गई हैं।",
        "success"
    );


    window.dispatchEvent(
        new CustomEvent(
            "awaaz:saved-news-cleared"
        )
    );


    return true;

}


/* ============================================================
   REMOVE SAVED NEWS BY ID
============================================================ */

function removeSavedNewsById(
    id,
    options = {}
) {

    const cleanId =
        String(
            id ||
            ""
        );


    if (!cleanId) {

        return false;

    }


    const article =
        getSavedNews().find(
            item =>
                getArticleId(
                    item
                ) ===
                cleanId
        );


    if (!article) {

        return false;

    }


    const result =
        removeSavedNews(
            article
        );


    updateSavedNewsCounter();


    if (
        options.rerender !==
        false
    ) {

        renderSavedNews();

    }


    return result;

}


/* ============================================================
   OPEN SAVED ARTICLE
============================================================ */

function openSavedArticle(
    article
) {

    if (!article) {

        return false;

    }


    openArticle(
        article
    );


    return true;

}


/* ============================================================
   OPEN ARTICLE
============================================================ */

function openArticle(
    article
) {

    if (!article) {

        return false;

    }


    trackArticleOpen(
        article
    );


    const url =
        getArticleURL(
            article
        );


    if (
        !url
    ) {

        return false;

    }


    /*
     * अगर URL current page का है तो
     * उसी page पर navigation करें।
     */

    if (
        url.startsWith(
            window.location.origin
        )
    ) {

        window.location.href =
            url;

    } else {

        window.location.href =
            url;

    }


    return true;

}


/* ============================================================
   SAVED NEWS DELEGATION
============================================================ */

function initializeSavedNewsDelegation() {

    document.addEventListener(
        "click",
        event => {

            const removeButton =
                event.target.closest(
                    "[data-remove-saved]"
                );


            if (
                removeButton
            ) {

                event.preventDefault();


                const id =
                    removeButton.dataset.removeSaved;


                removeSavedNewsById(
                    id
                );


                return;

            }


            const saveButton =
                event.target.closest(
                    "[data-save-news]"
                );


            if (
                saveButton
            ) {

                setTimeout(
                    () => {

                        updateSavedNewsCounter();

                    },
                    0
                );

            }

        }
    );

}


/* ============================================================
   SAVED NEWS PAGE DETECTION
============================================================ */

function isSavedNewsPage() {

    const path =
        window.location.pathname
            .toLowerCase();


    return (
        path ===
            "/saved" ||
        path ===
            "/saved-news" ||
        path.includes(
            "/bookmarks"
        )
    );

}


/* ============================================================
   INITIALIZE SAVED NEWS PAGE
============================================================ */

function initializeSavedNewsPage() {

    normalizeSavedNews();

    updateSavedNewsCounter();

    initializeSavedNewsDelegation();


    if (
        isSavedNewsPage()
    ) {

        renderSavedNews();

    }


    SavedNewsState.initialized =
        true;

}


/* ============================================================
   SAVED NEWS EVENT LISTENERS
============================================================ */

window.addEventListener(
    "awaaz:news-saved",
    event => {

        updateSavedNewsCounter();


        if (
            isSavedNewsPage()
        ) {

            renderSavedNews();

        }

    }
);


window.addEventListener(
    "awaaz:news-unsaved",
    event => {

        updateSavedNewsCounter();


        if (
            isSavedNewsPage()
        ) {

            renderSavedNews();

        }

    }
);


window.addEventListener(
    "awaaz:saved-news-cleared",
    () => {

        updateSavedNewsCounter();

    }
);


/* ============================================================
   SAVED NEWS GLOBAL EXPORT
============================================================ */

window.AwaazRajasthan.savedNews = {

    state:
        SavedNewsState,

    get:
        getSavedNews,

    count:
        getSavedNewsCount,

    render:
        renderSavedNews,

    remove:
        removeSavedNewsById,

    clear:
        clearAllSavedNews,

    open:
        openSavedArticle,

    isPage:
        isSavedNewsPage,

    initialize:
        initializeSavedNewsPage

};


/* ============================================================
   AUTO INITIALIZATION
============================================================ */

window.addEventListener(
    "awaaz:ready",
    () => {

        initializeSavedNewsPage();

    }
);


/* ============================================================
   END OF PART 14/30
============================================================ */
/* ============================================================
   AAWAAZ RAJASTHAN
   SCRIPT.JS — PART 15/30

   ARTICLE DETAIL SYSTEM
   ARTICLE PAGE LOADING
   NEWS DETAIL API
   RELATED NEWS
   ARTICLE META
   ARTICLE CONTENT
   404 / ERROR STATE
============================================================ */


/* ============================================================
   ARTICLE DETAIL CONFIG
============================================================ */

const ARTICLE_DETAIL_CONFIG = {

    containerSelectors: [
        "#articleDetail",
        "#articlePage",
        ".article-detail",
        ".single-article"
    ],

    relatedSelectors: [
        "#relatedNews",
        ".related-news",
        ".related-news-grid"
    ],

    defaultTitle:
        "आवाज़ राजस्थान",

    defaultDescription:
        "राजस्थान की ताज़ा और महत्वपूर्ण खबरें पढ़ें।",

    relatedLimit:
        6

};


/* ============================================================
   ARTICLE DETAIL STATE
============================================================ */

const ArticleDetailState = {

    article:
        null,

    slug:
        "",

    loading:
        false,

    loaded:
        false,

    error:
        null,

    initialized:
        false

};


/* ============================================================
   GET ARTICLE SLUG FROM URL
============================================================ */

function getArticleSlugFromURL() {

    const url =
        new URL(
            window.location.href
        );


    const params =
        url.searchParams;


    const querySlug =
        params.get(
            "slug"
        );


    if (
        querySlug
    ) {

        return decodeURIComponent(
            querySlug
        );

    }


    const path =
        window.location.pathname
            .replace(
                /\/+/g,
                "/"
            )
            .replace(
                /^\/|\/$/g,
                ""
            );


    const parts =
        path.split(
            "/"
        );


    const articleIndex =
        parts.findIndex(
            part =>
                [
                    "news",
                    "article",
                    "story"
                ].includes(
                    part.toLowerCase()
                )
        );


    if (
        articleIndex !==
        -1 &&
        parts[articleIndex + 1]
    ) {

        return decodeURIComponent(
            parts[articleIndex + 1]
        );

    }


    /*
     * अगर direct slug URL हो:
     * /some-news-slug
     */

    if (
        parts.length === 1 &&
        parts[0]
    ) {

        const reserved =
            [
                "admin",
                "login",
                "search",
                "saved",
                "saved-news",
                "category",
                "about",
                "contact",
                "privacy",
                "terms"
            ];


        if (
            !reserved.includes(
                parts[0].toLowerCase()
            )
        ) {

            return decodeURIComponent(
                parts[0]
            );

        }

    }


    return "";

}


/* ============================================================
   FIND ARTICLE DETAIL CONTAINER
============================================================ */

function getArticleDetailContainer() {

    for (
        const selector of
        ARTICLE_DETAIL_CONFIG.containerSelectors
    ) {

        const element =
            document.querySelector(
                selector
            );


        if (
            element
        ) {

            return element;

        }

    }


    return null;

}


/* ============================================================
   GET ARTICLE BY ID / SLUG
============================================================ */

async function fetchArticleDetail(
    identifier
) {

    const value =
        String(
            identifier ||
            ""
        ).trim();


    if (!value) {

        throw new Error(
            "Article identifier missing"
        );

    }


    if (
        typeof apiGet !==
        "function"
    ) {

        throw new Error(
            "API GET function unavailable"
        );

    }


    let response;


    /*
     * पहले slug endpoint.
     */

    try {

        response =
            await apiGet(
                `${API_ENDPOINTS.news}/slug/${encodeURIComponent(value)}`
            );

    } catch (
        firstError
    ) {

        /*
         * अगर slug endpoint available नहीं है,
         * तो ID endpoint try करें।
         */

        response =
            await apiGet(
                `${API_ENDPOINTS.news}/${encodeURIComponent(value)}`
            );

    }


    const article =
        response?.data?.article ||
        response?.article ||
        response?.data ||
        response;


    if (
        article?.article
    ) {

        return article.article;

    }


    if (
        !article ||
        typeof article !==
            "object"
    ) {

        throw new Error(
            "Article not found"
        );

    }


    return article;

}


/* ============================================================
   SHOW ARTICLE LOADING
============================================================ */

function showArticleLoading(
    container
) {

    if (
        !container
    ) {

        return;

    }


    container.innerHTML =
        `

        <div class="article-loading">

            <div class="article-loading-image skeleton"></div>

            <div class="article-loading-content">

                <div class="skeleton skeleton-line skeleton-small"></div>

                <div class="skeleton skeleton-line"></div>

                <div class="skeleton skeleton-line"></div>

                <div class="skeleton skeleton-line skeleton-medium"></div>

                <div class="article-loading-body">

                    <div class="skeleton skeleton-line"></div>
                    <div class="skeleton skeleton-line"></div>
                    <div class="skeleton skeleton-line"></div>
                    <div class="skeleton skeleton-line"></div>

                </div>

            </div>

        </div>

        `;

}


/* ============================================================
   CREATE ARTICLE ERROR
============================================================ */

function createArticleErrorState(
    message =
        "यह खबर उपलब्ध नहीं है।"
) {

    const wrapper =
        createElement(
            "div",
            {

                className:
                    "article-error-state"

            }
        );


    const icon =
        createElement(
            "div",
            {

                className:
                    "article-error-icon",

                text:
                    "!"

            }
        );


    const title =
        createElement(
            "h1",
            {

                text:
                    "खबर नहीं मिली"

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


    const back =
        createElement(
            "button",
            {

                className:
                    "article-error-back",

                text:
                    "वापस जाएं",

                attributes: {

                    type:
                        "button"

                }

            }
        );


    back.addEventListener(
        "click",
        () => {

            if (
                window.history.length >
                1
            ) {

                window.history.back();

            } else {

                window.location.href =
                    "/";

            }

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

    wrapper.appendChild(
        back
    );


    return wrapper;

}


/* ============================================================
   GET ARTICLE CATEGORY NAME
============================================================ */

function getArticleCategoryName(
    article
) {

    if (
        typeof article?.category ===
        "string"
    ) {

        return article.category;

    }


    if (
        article?.category?.name
    ) {

        return article.category.name;

    }


    if (
        article?.category?.title
    ) {

        return article.category.title;

    }


    if (
        article?.categoryName
    ) {

        return article.categoryName;

    }


    return "राजस्थान";

}


/* ============================================================
   GET ARTICLE AUTHOR
============================================================ */

function getArticleAuthor(
    article
) {

    if (
        typeof article?.author ===
        "string"
    ) {

        return article.author;

    }


    if (
        article?.author?.name
    ) {

        return article.author.name;

    }


    if (
        article?.author?.fullName
    ) {

        return article.author.fullName;

    }


    if (
        article?.createdBy?.name
    ) {

        return article.createdBy.name;

    }


    return "आवाज़ राजस्थान";

}


/* ============================================================
   FORMAT ARTICLE DATE
============================================================ */

function formatArticleDate(
    date
) {

    if (!date) {

        return "";

    }


    const parsed =
        new Date(
            date
        );


    if (
        Number.isNaN(
            parsed.getTime()
        )
    ) {

        return String(
            date
        );

    }


    try {

        return new Intl.DateTimeFormat(
            "hi-IN",
            {

                day:
                    "2-digit",

                month:
                    "long",

                year:
                    "numeric",

                hour:
                    "2-digit",

                minute:
                    "2-digit"

            }
        ).format(
            parsed
        );

    } catch (
        error
    ) {

        return parsed.toLocaleString(
            "hi-IN"
        );

    }

}


/* ============================================================
   GET ARTICLE DATE
============================================================ */

function getArticleDate(
    article
) {

    return (
        article?.publishedAt ||
        article?.publishedDate ||
        article?.createdAt ||
        article?.date ||
        ""
    );

}


/* ============================================================
   GET ARTICLE CONTENT
============================================================ */

function getArticleContent(
    article
) {

    return (
        article?.content ||
        article?.body ||
        article?.articleContent ||
        article?.description ||
        article?.details ||
        ""
    );

}


/* ============================================================
   SANITIZE ARTICLE HTML
============================================================ */

function sanitizeArticleHTML(
    html
) {

    if (
        !html
    ) {

        return "";

    }


    const temp =
        document.createElement(
            "div"
        );


    temp.innerHTML =
        String(
            html
        );


    /*
     * Unsafe elements remove करें।
     */

    temp.querySelectorAll(
        "script, iframe, object, embed, style, link, meta"
    )
    .forEach(
        element =>
            element.remove()
    );


    /*
     * Event-handler attributes remove करें।
     */

    temp.querySelectorAll(
        "*"
    )
    .forEach(
        element => {

            [...element.attributes]
                .forEach(
                    attribute => {

                        if (
                            attribute.name
                                .toLowerCase()
                                .startsWith(
                                    "on"
                                )
                        ) {

                            element.removeAttribute(
                                attribute.name
                            );

                        }

                    }
                );

        }
    );


    return temp.innerHTML;

}


/* ============================================================
   CREATE ARTICLE DETAIL
============================================================ */

function createArticleDetail(
    article
) {

    const wrapper =
        createElement(
            "article",
            {

                className:
                    "article-detail-content",

                attributes: {

                    "data-article-id":
                        getArticleId(
                            article
                        )

                }

            }
        );


    const category =
        createElement(
            "div",
            {

                className:
                    "article-category",

                text:
                    getArticleCategoryName(
                        article
                    )

            }
        );


    const title =
        createElement(
            "h1",
            {

                className:
                    "article-detail-title",

                text:
                    article.title ||
                    "समाचार"

            }
        );


    const excerptText =
        article.excerpt ||
        article.summary ||
        article.shortDescription ||
        "";


    const excerpt =
        excerptText
            ? createElement(
                "p",
                {

                    className:
                        "article-detail-excerpt",

                    text:
                        normalizeText(
                            excerptText
                        )

                }
            )
            : null;


    const meta =
        createElement(
            "div",
            {

                className:
                    "article-detail-meta"

            }
        );


    const author =
        createElement(
            "span",
            {

                className:
                    "article-author",

                text:
                    `✍ ${getArticleAuthor(article)}`

            }
        );


    const date =
        createElement(
            "span",
            {

                className:
                    "article-date",

                text:
                    formatArticleDate(
                        getArticleDate(
                            article
                        )
                    )

            }
        );


    meta.appendChild(
        author
    );


    if (
        date.textContent
    ) {

        meta.appendChild(
            date
        );

    }


    const image =
        getArticleImage(
            article
        );


    let heroImage =
        null;


    if (
        image
    ) {

        const imageWrapper =
            createElement(
                "figure",
                {

                    className:
                        "article-hero-image"

                }
            );


        heroImage =
            createElement(
                "img",
                {

                    attributes: {

                        src:
                            image,

                        alt:
                            article.title ||
                            "समाचार",

                        loading:
                            "eager",

                        decoding:
                            "async"

                    }

                }
            );


        imageWrapper.appendChild(
            heroImage
        );


        if (
            article.imageCaption ||
            article.caption
        ) {

            imageWrapper.appendChild(
                createElement(
                    "figcaption",
                    {

                        text:
                            article.imageCaption ||
                            article.caption

                    }
                )
            );

        }


        wrapper.appendChild(
            category
        );

        wrapper.appendChild(
            title
        );


        if (
            excerpt
        ) {

            wrapper.appendChild(
                excerpt
            );

        }


        wrapper.appendChild(
            meta
        );

        wrapper.appendChild(
            imageWrapper
        );

    } else {

        wrapper.appendChild(
            category
        );

        wrapper.appendChild(
            title
        );


        if (
            excerpt
        ) {

            wrapper.appendChild(
                excerpt
            );

        }


        wrapper.appendChild(
            meta
        );

    }


    /* --------------------------------------------------------
       ACTION BAR
    -------------------------------------------------------- */

    const actionBar =
        createElement(
            "div",
            {

                className:
                    "article-action-bar"

            }
        );


    const articleId =
        getArticleId(
            article
        );


    const saveButton =
        createElement(
            "button",
            {

                className:
                    "article-action-button",

                text:
                    isNewsSaved(
                        article
                    )
                        ? "सेव्ड"
                        : "सेव करें",

                attributes: {

                    type:
                        "button",

                    "data-save-news":
                        articleId,

                    "aria-pressed":
                        isNewsSaved(
                            article
                        )
                            ? "true"
                            : "false",

                    "aria-label":
                        "खबर सेव करें"

                }

            }
        );


    const shareButton =
        createElement(
            "button",
            {

                className:
                    "article-action-button",

                text:
                    "शेयर करें",

                attributes: {

                    type:
                        "button",

                    "data-share-news":
                        articleId,

                    "aria-label":
                        "खबर शेयर करें"

                }

            }
        );


    actionBar.appendChild(
        saveButton
    );


    actionBar.appendChild(
        shareButton
    );


    wrapper.appendChild(
        actionBar
    );


    /* --------------------------------------------------------
       ARTICLE BODY
    -------------------------------------------------------- */

    const content =
        getArticleContent(
            article
        );


    const body =
        createElement(
            "div",
            {

                className:
                    "article-body"

            }
        );


    if (
        content
    ) {

        body.innerHTML =
            sanitizeArticleHTML(
                content
            );

    } else {

        body.appendChild(
            createElement(
                "p",
                {

                    text:
                        "इस खबर की विस्तृत जानकारी जल्द उपलब्ध होगी।"

                }
            )
        );

    }


    wrapper.appendChild(
        body
    );


    /* --------------------------------------------------------
       TAGS
    -------------------------------------------------------- */

    const tags =
        Array.isArray(
            article.tags
        )
            ? article.tags
            : [];


    if (
        tags.length
    ) {

        const tagWrapper =
            createElement(
                "div",
                {

                    className:
                        "article-tags"

                }
            );


        tags.forEach(
            tag => {

                const value =
                    typeof tag ===
                        "string"
                        ? tag
                        : tag?.name ||
                          tag?.title ||
                          "";


                if (!value) {

                    return;

                }


                tagWrapper.appendChild(
                    createElement(
                        "span",
                        {

                            className:
                                "article-tag",

                            text:
                                `#${value}`

                        }
                    )
                );

            }
        );


        wrapper.appendChild(
            tagWrapper
        );

    }


    return wrapper;

}


/* ============================================================
   RENDER ARTICLE DETAIL
============================================================ */

function renderArticleDetail(
    article,
    container = null
) {

    const target =
        container ||
        getArticleDetailContainer();


    if (!target) {

        return null;

    }


    target.replaceChildren();


    if (
        !article
    ) {

        target.appendChild(
            createArticleErrorState()
        );


        return target;

    }


    const detail =
        createArticleDetail(
            article
        );


    target.appendChild(
        detail
    );


    updateArticleSEO(
        article
    );


    updateReadingTime(
        article,
        target.querySelector(
            ".article-reading-time"
        )
    );


    initializeLazyImages();


    return target;

}


/* ============================================================
   LOAD RELATED NEWS
============================================================ */

async function loadRelatedNews(
    article,
    options = {}
) {

    if (
        !article ||
        typeof apiGet !==
            "function"
    ) {

        return [];

    }


    const category =
        getArticleCategoryName(
            article
        );


    const currentId =
        getArticleId(
            article
        );


    try {

        const query =
            new URLSearchParams();


        query.set(
            "limit",
            String(
                options.limit ||
                ARTICLE_DETAIL_CONFIG.relatedLimit
            )
        );


        if (
            category
        ) {

            query.set(
                "category",
                category
            );

        }


        const response =
            await apiGet(
                `${API_ENDPOINTS.news}?${query.toString()}`
            );


        const items =
            response?.data?.news ||
            response?.news ||
            response?.data ||
            response?.results ||
            [];


        if (
            !Array.isArray(
                items
            )
        ) {

            return [];

        }


        return items.filter(
            item =>
                getArticleId(
                    item
                ) !==
                currentId
        );

    } catch (
        error
    ) {

        return [];

    }

}


/* ============================================================
   RENDER RELATED NEWS
============================================================ */

async function renderRelatedNews(
    article,
    target = null,
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

        target =
            document.querySelector(
                ARTICLE_DETAIL_CONFIG.relatedSelectors.join(
                    ","
                )
            );

    }


    if (!target) {

        return [];

    }


    const related =
        await loadRelatedNews(
            article,
            options
        );


    target.replaceChildren();


    if (
        !related.length
    ) {

        target.style.display =
            "none";


        return [];

    }


    target.style.display =
        "";


    related.forEach(
        item => {

            let card = null;


            if (
                typeof createNewsCard ===
                "function"
            ) {

                card =
                    createNewsCard(
                        item,
                        {

                            showExcerpt:
                                false,

                            showAuthor:
                                false

                        }
                    );

            }


            if (
                !card
            ) {

                card =
                    createSavedNewsCard(
                        item
                    );

            }


            if (
                card
            ) {

                target.appendChild(
                    card
                );

            }

        }
    );


    initializeArticleCards();

    initializeLazyImages();


    return related;

}


/* ============================================================
   UPDATE ARTICLE SEO
============================================================ */

function updateArticleSEO(
    article
) {

    if (!article) {

        return;

    }


    const title =
        normalizeText(
            article.seoTitle ||
            article.title ||
            ARTICLE_DETAIL_CONFIG.defaultTitle
        );


    const description =
        normalizeText(
            article.seoDescription ||
            article.excerpt ||
            article.summary ||
            ARTICLE_DETAIL_CONFIG.defaultDescription
        );


    document.title =
        `${title} | आवाज़ राजस्थान`;


    let descriptionTag =
        document.querySelector(
            'meta[name="description"]'
        );


    if (
        !descriptionTag
    ) {

        descriptionTag =
            document.createElement(
                "meta"
            );


        descriptionTag.name =
            "description";


        document.head.appendChild(
            descriptionTag
        );

    }


    descriptionTag.setAttribute(
        "content",
        description
    );


    const canonical =
        getArticleURL(
            article
        );


    let canonicalTag =
        document.querySelector(
            'link[rel="canonical"]'
        );


    if (
        !canonicalTag
    ) {

        canonicalTag =
            document.createElement(
                "link"
            );


        canonicalTag.rel =
            "canonical";


        document.head.appendChild(
            canonicalTag
        );

    }


    canonicalTag.href =
        canonical;

}


/* ============================================================
   LOAD ARTICLE PAGE
============================================================ */

async function loadArticlePage(
    identifier = null,
    options = {}
) {

    const slug =
        identifier ||
        getArticleSlugFromURL();


    const container =
        options.container ||
        getArticleDetailContainer();


    if (
        !slug
    ) {

        if (
            container
        ) {

            container.replaceChildren(
                createArticleErrorState(
                    "खबर का लिंक सही नहीं है।"
                )
            );

        }


        return null;

    }


    ArticleDetailState.slug =
        slug;


    ArticleDetailState.loading =
        true;


    ArticleDetailState.error =
        null;


    if (
        container
    ) {

        showArticleLoading(
            container
        );

    }


    try {

        const article =
            await fetchArticleDetail(
                slug
            );


        ArticleDetailState.article =
            article;


        ArticleDetailState.loaded =
            true;


        renderArticleDetail(
            article,
            container
        );


        renderRelatedNews(
            article,
            options.relatedContainer
        );


        trackArticleOpen(
            article
        );


        return article;

    } catch (
        error
    ) {

        ArticleDetailState.error =
            error;


        ArticleDetailState.loaded =
            false;


        if (
            container
        ) {

            container.replaceChildren(
                createArticleErrorState(
                    "यह खबर उपलब्ध नहीं है या हटाई जा चुकी है।"
                )
            );

        }


        return null;

    } finally {

        ArticleDetailState.loading =
            false;

    }

}


/* ============================================================
   ARTICLE PAGE DETECTION
============================================================ */

function isArticleDetailPage() {

    const path =
        window.location.pathname
            .toLowerCase();


    if (
        path.startsWith(
            "/news/"
        )
    ) {

        return true;

    }


    if (
        path.startsWith(
            "/article/"
        )
    ) {

        return true;

    }


    if (
        path.startsWith(
            "/story/"
        )
    ) {

        return true;

    }


    return !!getArticleDetailContainer();

}


/* ============================================================
   ARTICLE DETAIL INITIALIZATION
============================================================ */

function initializeArticleDetail() {

    if (
        ArticleDetailState.initialized
    ) {

        return;

    }


    ArticleDetailState.initialized =
        true;


    if (
        isArticleDetailPage()
    ) {

        loadArticlePage();

    }

}


/* ============================================================
   ARTICLE DETAIL GLOBAL EXPORT
============================================================ */

window.AwaazRajasthan.articleDetail = {

    state:
        ArticleDetailState,

    getSlug:
        getArticleSlugFromURL,

    fetch:
        fetchArticleDetail,

    render:
        renderArticleDetail,

    load:
        loadArticlePage,

    related:
        loadRelatedNews,

    renderRelated:
        renderRelatedNews,

    isPage:
        isArticleDetailPage,

    initialize:
        initializeArticleDetail

};


/* ============================================================
   AUTO INITIALIZATION
============================================================ */

window.addEventListener(
    "awaaz:ready",
    () => {

        initializeArticleDetail();

    }
);


/* ============================================================
   END OF PART 15/30
============================================================ */
/* ============================================================
   AAWAAZ RAJASTHAN
   SCRIPT.JS — PART 16/30

   SEARCH SYSTEM
   SEARCH INPUT
   SEARCH API
   SEARCH RESULTS
   SEARCH HISTORY
   SEARCH SUGGESTIONS
   DEBOUNCE
   MOBILE SEARCH
============================================================ */


/* ============================================================
   SEARCH CONFIGURATION
============================================================ */

const SEARCH_CONFIG = {

    minQueryLength:
        2,

    debounceDelay:
        400,

    resultsLimit:
        12,

    historyKey:
        "awaaz_search_history",

    maxHistory:
        8,

    inputSelectors: [
        "#searchInput",
        "#headerSearchInput",
        ".search-input",
        "[data-search-input]"
    ],

    resultSelectors: [
        "#searchResults",
        ".search-results",
        "#newsGrid"
    ]

};


/* ============================================================
   SEARCH STATE
============================================================ */

const SearchState = {

    query:
        "",

    results:
        [],

    total:
        0,

    page:
        1,

    totalPages:
        1,

    loading:
        false,

    searching:
        false,

    initialized:
        false,

    debounceTimer:
        null,

    requestId:
        0,

    history:
        getStorage(
            SEARCH_CONFIG.historyKey,
            []
        )

};


/* ============================================================
   NORMALIZE SEARCH HISTORY
============================================================ */

function normalizeSearchHistory() {

    if (
        !Array.isArray(
            SearchState.history
        )
    ) {

        SearchState.history =
            [];

    }


    SearchState.history =
        SearchState.history
            .map(
                item =>
                    normalizeText(
                        item
                    )
            )
            .filter(
                item =>
                    item.length >=
                    SEARCH_CONFIG.minQueryLength
            )
            .filter(
                (
                    item,
                    index,
                    array
                ) =>
                    array.indexOf(
                        item
                    ) ===
                    index
            )
            .slice(
                0,
                SEARCH_CONFIG.maxHistory
            );


    setStorage(
        SEARCH_CONFIG.historyKey,
        SearchState.history
    );

}


/* ============================================================
   ADD SEARCH HISTORY
============================================================ */

function addSearchHistory(
    query
) {

    const value =
        normalizeText(
            query
        );


    if (
        value.length <
        SEARCH_CONFIG.minQueryLength
    ) {

        return;

    }


    SearchState.history =
        SearchState.history.filter(
            item =>
                item.toLowerCase() !==
                value.toLowerCase()
        );


    SearchState.history.unshift(
        value
    );


    SearchState.history =
        SearchState.history.slice(
            0,
            SEARCH_CONFIG.maxHistory
        );


    setStorage(
        SEARCH_CONFIG.historyKey,
        SearchState.history
    );

}


/* ============================================================
   REMOVE SEARCH HISTORY ITEM
============================================================ */

function removeSearchHistoryItem(
    query
) {

    const value =
        normalizeText(
            query
        );


    SearchState.history =
        SearchState.history.filter(
            item =>
                item.toLowerCase() !==
                value.toLowerCase()
        );


    setStorage(
        SEARCH_CONFIG.historyKey,
        SearchState.history
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


    showToast(
        "सर्च हिस्ट्री साफ कर दी गई है।",
        "success"
    );

}


/* ============================================================
   GET SEARCH INPUTS
============================================================ */

function getSearchInputs() {

    const selectors =
        SEARCH_CONFIG.inputSelectors;


    const inputs =
        [];


    selectors.forEach(
        selector => {

            $$(selector)
                .forEach(
                    input => {

                        if (
                            !inputs.includes(
                                input
                            )
                        ) {

                            inputs.push(
                                input
                            );

                        }

                    }
                );

        }
    );


    return inputs;

}


/* ============================================================
   SET SEARCH INPUT VALUE
============================================================ */

function setSearchInputValue(
    value
) {

    getSearchInputs()
        .forEach(
            input => {

                input.value =
                    value || "";

            }
        );

}


/* ============================================================
   GET SEARCH RESULT CONTAINER
============================================================ */

function getSearchResultContainer() {

    for (
        const selector of
        SEARCH_CONFIG.resultSelectors
    ) {

        const element =
            document.querySelector(
                selector
            );


        if (
            element
        ) {

            return element;

        }

    }


    return null;

}


/* ============================================================
   VALIDATE SEARCH QUERY
============================================================ */

function validateSearchQuery(
    query
) {

    const value =
        normalizeText(
            query
        );


    return {

        valid:
            value.length >=
            SEARCH_CONFIG.minQueryLength,

        value:
            value

    };

}


/* ============================================================
   BUILD SEARCH URL
============================================================ */

function buildSearchURL(
    query,
    page = 1
) {

    const url =
        new URL(
            window.location.href
        );


    url.pathname =
        "/search";


    url.searchParams.set(
        "q",
        query
    );


    if (
        page > 1
    ) {

        url.searchParams.set(
            "page",
            String(
                page
            )
        );

    } else {

        url.searchParams.delete(
            "page"
        );

    }


    return url;

}


/* ============================================================
   UPDATE SEARCH URL
============================================================ */

function updateSearchURL(
    query,
    page = 1
) {

    if (
        !window.history ||
        !window.history.pushState
    ) {

        return;

    }


    const url =
        buildSearchURL(
            query,
            page
        );


    window.history.pushState(
        {

            search:
                query,

            page:
                page

        },
        "",
        url
    );

}


/* ============================================================
   GET SEARCH FROM URL
============================================================ */

function getSearchParamsFromURL() {

    const url =
        new URL(
            window.location.href
        );


    return {

        query:
            normalizeText(
                url.searchParams.get(
                    "q"
                ) ||
                ""
            ),

        page:
            Math.max(
                1,
                Number(
                    url.searchParams.get(
                        "page"
                    )
                ) || 1
            )

    };

}


/* ============================================================
   SEARCH API
============================================================ */

async function searchNewsAPI(
    query,
    page = 1,
    options = {}
) {

    const validation =
        validateSearchQuery(
            query
        );


    if (
        !validation.valid
    ) {

        return {

            news:
                [],

            total:
                0,

            page:
                1,

            totalPages:
                1

        };

    }


    if (
        typeof apiGet !==
        "function"
    ) {

        throw new Error(
            "API GET function unavailable"
        );

    }


    const params =
        new URLSearchParams();


    params.set(
        "search",
        validation.value
    );


    params.set(
        "q",
        validation.value
    );


    params.set(
        "page",
        String(
            page
        )
    );


    params.set(
        "limit",
        String(
            options.limit ||
            SEARCH_CONFIG.resultsLimit
        )
    );


    if (
        options.category
    ) {

        params.set(
            "category",
            options.category
        );

    }


    if (
        options.sort
    ) {

        params.set(
            "sort",
            options.sort
        );

    }


    const response =
        await apiGet(
            `${API_ENDPOINTS.news}?${params.toString()}`
        );


    const data =
        response?.data ||
        response;


    const news =
        data?.news ||
        data?.articles ||
        data?.results ||
        [];


    const pagination =
        normalizePageData(
            data?.pagination ||
            data?.meta ||
            data
        );


    return {

        news:
            Array.isArray(
                news
            )
                ? news
                : [],

        total:
            pagination.totalItems,

        page:
            pagination.page,

        totalPages:
            pagination.totalPages,

        limit:
            pagination.limit

    };

}


/* ============================================================
   RENDER SEARCH SKELETON
============================================================ */

function renderSearchLoading(
    container,
    count = 6
) {

    if (
        !container
    ) {

        return;

    }


    container.innerHTML =
        "";


    const fragment =
        document.createDocumentFragment();


    for (
        let index = 0;
        index < count;
        index++
    ) {

        const card =
            createElement(
                "div",
                {

                    className:
                        "news-card search-loading-card"

                }
            );


        card.innerHTML =
            `

            <div class="skeleton search-skeleton-image"></div>

            <div class="search-skeleton-content">

                <div class="skeleton skeleton-line skeleton-small"></div>

                <div class="skeleton skeleton-line"></div>

                <div class="skeleton skeleton-line"></div>

                <div class="skeleton skeleton-line skeleton-medium"></div>

            </div>

            `;


        fragment.appendChild(
            card
        );

    }


    container.appendChild(
        fragment
    );

}


/* ============================================================
   CREATE SEARCH RESULT CARD
============================================================ */

function createSearchResultCard(
    article
) {

    if (
        typeof createNewsCard ===
        "function"
    ) {

        return createNewsCard(
            article,
            {

                showExcerpt:
                    true,

                showAuthor:
                    true

            }
        );

    }


    const card =
        createElement(
            "article",
            {

                className:
                    "news-card search-result-card",

                attributes: {

                    "data-news-id":
                        getArticleId(
                            article
                        )

                }

            }
        );


    const image =
        getArticleImage(
            article
        );


    if (
        image
    ) {

        const imageWrapper =
            createElement(
                "div",
                {

                    className:
                        "news-card-image"

                }
            );


        imageWrapper.appendChild(
            createElement(
                "img",
                {

                    attributes: {

                        src:
                            image,

                        alt:
                            article.title ||
                            "समाचार",

                        loading:
                            "lazy"

                    }

                }
            )
        );


        card.appendChild(
            imageWrapper
        );

    }


    const content =
        createElement(
            "div",
            {

                className:
                    "news-card-content"

            }
        );


    const category =
        createElement(
            "span",
            {

                className:
                    "news-category",

                text:
                    getArticleCategoryName(
                        article
                    )

            }
        );


    const title =
        createElement(
            "h3",
            {

                className:
                    "news-title",

                text:
                    article.title ||
                    "समाचार"

            }
        );


    content.appendChild(
        category
    );


    content.appendChild(
        title
    );


    if (
        article.excerpt
    ) {

        content.appendChild(
            createElement(
                "p",
                {

                    className:
                        "news-excerpt",

                    text:
                        normalizeText(
                            article.excerpt
                        )

                }
            )
        );

    }


    card.appendChild(
        content
    );


    card.addEventListener(
        "click",
        () => {

            openArticle(
                article
            );

        }
    );


    return card;

}


/* ============================================================
   RENDER SEARCH RESULTS
============================================================ */

function renderSearchResults(
    result,
    container = null
) {

    const target =
        container ||
        getSearchResultContainer();


    if (
        !target
    ) {

        return;

    }


    target.innerHTML =
        "";


    const news =
        result?.news ||
        [];


    if (
        !news.length
    ) {

        target.appendChild(
            createSearchEmptyState(
                SearchState.query
            )
        );


        return;

    }


    const fragment =
        document.createDocumentFragment();


    news.forEach(
        article => {

            const card =
                createSearchResultCard(
                    article
                );


            if (
                card
            ) {

                fragment.appendChild(
                    card
                );

            }

        }
    );


    target.appendChild(
        fragment
    );


    initializeArticleCards();

    initializeLazyImages();


    renderSearchPagination(
        result
    );

}


/* ============================================================
   SEARCH EMPTY STATE
============================================================ */

function createSearchEmptyState(
    query = ""
) {

    const wrapper =
        createElement(
            "div",
            {

                className:
                    "search-empty-state"

            }
        );


    const icon =
        createElement(
            "div",
            {

                className:
                    "search-empty-icon",

                text:
                    "⌕",

                attributes: {

                    "aria-hidden":
                        "true"

                }

            }
        );


    const title =
        createElement(
            "h2",
            {

                text:
                    "कोई खबर नहीं मिली"

            }
        );


    const message =
        createElement(
            "p",
            {

                text:
                    query
                        ? `"${query}" के लिए कोई परिणाम नहीं मिला।`
                        : "कृपया कोई शब्द लिखकर खोजें।"

            }
        );


    wrapper.appendChild(
        icon
    );


    wrapper.appendChild(
        title
    );


    wrapper.appendChild(
        message
    );


    return wrapper;

}


/* ============================================================
   SEARCH HEADER
============================================================ */

function renderSearchHeader(
    query,
    total
) {

    const headers =
        $$(
            "[data-search-heading], .search-heading"
        );


    headers.forEach(
        heading => {

            if (
                query
            ) {

                heading.textContent =
                    `"${query}" के खोज परिणाम`;

            } else {

                heading.textContent =
                    "खबर खोजें";

            }

        }
    );


    $$(
        "[data-search-total], .search-total"
    )
    .forEach(
        element => {

            element.textContent =
                total
                    ? `${total} खबरें मिलीं`
                    : "";

        }
    );

}


/* ============================================================
   SEARCH PAGINATION
============================================================ */

function renderSearchPagination(
    result
) {

    const containers =
        $$(
            "#searchPagination, .search-pagination, [data-search-pagination]"
        );


    if (
        !containers.length
    ) {

        return;

    }


    containers.forEach(
        container => {

            renderPagination(
                {

                    page:
                        result.page,

                    totalPages:
                        result.totalPages,

                    totalItems:
                        result.total,

                    limit:
                        result.limit

                },
                container,
                {

                    type:
                        "search",

                    query:
                        SearchState.query,

                    onPageChange:
                        page =>
                            performSearch(
                                SearchState.query,
                                {

                                    page:
                                        page,

                                    updateURL:
                                        true

                                }
                            )

                }
            );

        }
    );

}


/* ============================================================
   PERFORM SEARCH
============================================================ */

async function performSearch(
    query,
    options = {}
) {

    const validation =
        validateSearchQuery(
            query
        );


    if (
        !validation.valid
    ) {

        SearchState.query =
            validation.value;


        SearchState.results =
            [];


        SearchState.total =
            0;


        SearchState.page =
            1;


        renderSearchHeader(
            "",
            0
        );


        const container =
            options.container ||
            getSearchResultContainer();


        if (
            container
        ) {

            container.replaceChildren();

        }


        return null;

    }


    const cleanQuery =
        validation.value;


    const page =
        Math.max(
            1,
            Number(
                options.page
            ) || 1
        );


    const requestId =
        ++SearchState.requestId;


    SearchState.query =
        cleanQuery;


    SearchState.page =
        page;


    SearchState.loading =
        true;


    SearchState.searching =
        true;


    const container =
        options.container ||
        getSearchResultContainer();


    if (
        options.loading !==
        false &&
        container
    ) {

        renderSearchLoading(
            container
        );

    }


    try {

        const result =
            await searchNewsAPI(
                cleanQuery,
                page,
                options
            );


        /*
         * पुराने request का response ignore करें।
         */

        if (
            requestId !==
            SearchState.requestId
        ) {

            return null;

        }


        SearchState.results =
            result.news;


        SearchState.total =
            result.total;


        SearchState.page =
            result.page;


        SearchState.totalPages =
            result.totalPages;


        renderSearchHeader(
            cleanQuery,
            result.total
        );


        renderSearchResults(
            result,
            container
        );


        if (
            options.addHistory !==
            false
        ) {

            addSearchHistory(
                cleanQuery
            );

        }


        if (
            options.updateURL !==
            false
        ) {

            updateSearchURL(
                cleanQuery,
                page
            );

        }


        return result;

    } catch (
        error
    ) {

        if (
            requestId !==
            SearchState.requestId
        ) {

            return null;

        }


        SearchState.results =
            [];


        SearchState.total =
            0;


        if (
            container
        ) {

            container.replaceChildren(
                createArticleErrorState(
                    "सर्च करते समय समस्या हुई। कृपया दोबारा प्रयास करें।"
                )
            );

        }


        handleGlobalError(
            error,
            "Search"
        );


        return null;

    } finally {

        if (
            requestId ===
            SearchState.requestId
        ) {

            SearchState.loading =
                false;

        }

    }

}


/* ============================================================
   DEBOUNCED SEARCH
============================================================ */

function debounceSearch(
    query
) {

    if (
        SearchState.debounceTimer
    ) {

        clearTimeout(
            SearchState.debounceTimer
        );

    }


    SearchState.debounceTimer =
        setTimeout(
            () => {

                const validation =
                    validateSearchQuery(
                        query
                    );


                if (
                    validation.valid
                ) {

                    performSearch(
                        validation.value,
                        {

                            updateURL:
                                false

                        }
                    );

                }

            },
            SEARCH_CONFIG.debounceDelay
        );

}


/* ============================================================
   RENDER SEARCH HISTORY
============================================================ */

function renderSearchHistory(
    target = null
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


    const container =
        target ||
        document.querySelector(
            "#searchHistory, .search-history, [data-search-history]"
        );


    if (
        !container
    ) {

        return;

    }


    container.innerHTML =
        "";


    normalizeSearchHistory();


    if (
        !SearchState.history.length
    ) {

        container.hidden =
            true;


        return;

    }


    container.hidden =
        false;


    const heading =
        createElement(
            "div",
            {

                className:
                    "search-history-heading"

            }
        );


    heading.appendChild(
        createElement(
            "span",
            {

                text:
                    "हाल की खोज"

            }
        )
    );


    const clear =
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


    clear.addEventListener(
        "click",
        clearSearchHistory
    );


    heading.appendChild(
        clear
    );


    container.appendChild(
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


    SearchState.history.forEach(
        item => {

            const row =
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
                            item,

                        attributes: {

                            type:
                                "button"

                        }

                    }
                );


            searchButton.addEventListener(
                "click",
                () => {

                    setSearchInputValue(
                        item
                    );


                    performSearch(
                        item
                    );

                }
            );


            const remove =
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
                                `"${item}" हटाएं`

                        }

                    }
                );


            remove.addEventListener(
                "click",
                () => {

                    removeSearchHistoryItem(
                        item
                    );

                }
            );


            row.appendChild(
                searchButton
            );


            row.appendChild(
                remove
            );


            list.appendChild(
                row
            );

        }
    );


    container.appendChild(
        list
    );

}


/* ============================================================
   SEARCH SUGGESTIONS
============================================================ */

function renderSearchSuggestions(
    query,
    target = null
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


    const container =
        target ||
        document.querySelector(
            "#searchSuggestions, .search-suggestions, [data-search-suggestions]"
        );


    if (
        !container
    ) {

        return;

    }


    const validation =
        validateSearchQuery(
            query
        );


    if (
        !validation.valid
    ) {

        container.innerHTML =
            "";


        container.hidden =
            true;


        return;

    }


    const suggestions =
        SearchState.history
            .filter(
                item =>
                    item.toLowerCase().includes(
                        validation.value.toLowerCase()
                    )
            )
            .slice(
                0,
                5
            );


    container.innerHTML =
        "";


    if (
        !suggestions.length
    ) {

        container.hidden =
            true;


        return;

    }


    container.hidden =
        false;


    suggestions.forEach(
        suggestion => {

            const button =
                createElement(
                    "button",
                    {

                        className:
                            "search-suggestion",

                        text:
                            suggestion,

                        attributes: {

                            type:
                                "button"

                        }

                    }
                );


            button.addEventListener(
                "click",
                () => {

                    setSearchInputValue(
                        suggestion
                    );


                    container.hidden =
                        true;


                    performSearch(
                        suggestion
                    );

                }
            );


            container.appendChild(
                button
            );

        }
    );

}


/* ============================================================
   SEARCH FORM HANDLER
============================================================ */

               function handleSearchSubmit(
    event
) {

    event.preventDefault();


    const form =
        event.currentTarget;


    const input =
        form.querySelector(
            "input"
        );


    const query =
        input?.value ||
        "";


    const validation =
        validateSearchQuery(
            query
        );


    if (
        !validation.valid
    ) {

        showToast(
            `कम से कम ${SEARCH_CONFIG.minQueryLength} अक्षर लिखें।`,
            "warning"
        );


        input?.focus();


        return;

    }


    performSearch(
        validation.value,
        {

            page:
                1,

            updateURL:
                true

        }
    );

}


/* ============================================================
   SEARCH INPUT HANDLER
============================================================ */

function handleSearchInput(
    event
) {

    const value =
        event.target.value;


    setSearchInputValue(
        value
    );


    renderSearchSuggestions(
        value
    );


    if (
        normalizeText(
            value
        ).length >=
        SEARCH_CONFIG.minQueryLength
    ) {

        debounceSearch(
            value
        );

    }

}


/* ============================================================
   SEARCH KEYBOARD HANDLER
============================================================ */

function handleSearchKeydown(
    event
) {

    if (
        event.key ===
        "Escape"
    ) {

        event.target.value =
            "";


        renderSearchSuggestions(
            ""
        );


        if (
            SearchState.debounceTimer
        ) {

            clearTimeout(
                SearchState.debounceTimer
            );

        }

    }


    if (
        event.key ===
        "Enter"
    ) {

        event.preventDefault();


        const query =
            event.target.value;


        performSearch(
            query,
            {

                page:
                    1,

                updateURL:
                    true

            }
        );

    }

}


/* ============================================================
   INITIALIZE SEARCH FORMS
============================================================ */

function initializeSearchForms() {

    const forms =
        $$(
            "form[data-search-form], .search-form, #searchForm"
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
                handleSearchSubmit
            );


            const input =
                form.querySelector(
                    "input"
                );


            if (
                input
            ) {

                input.addEventListener(
                    "input",
                    handleSearchInput
                );


                input.addEventListener(
                    "keydown",
                    handleSearchKeydown
                );

            }

        }
    );


    getSearchInputs()
        .forEach(
            input => {

                if (
                    input.dataset.searchInitialized ===
                    "true"
                ) {

                    return;

                }


                input.dataset.searchInitialized =
                    "true";


                input.addEventListener(
                    "input",
                    handleSearchInput
                );


                input.addEventListener(
                    "keydown",
                    handleSearchKeydown
                );

            }
        );

}


/* ============================================================
   INITIALIZE SEARCH PAGE
============================================================ */

async function initializeSearchPage() {

    normalizeSearchHistory();

    initializeSearchForms();

    renderSearchHistory();


    const params =
        getSearchParamsFromURL();


    if (
        params.query
    ) {

        setSearchInputValue(
            params.query
        );


        if (
            document.querySelector(
                "#searchResults, .search-results"
            )
        ) {

            await performSearch(
                params.query,
                {

                    page:
                        params.page,

                    updateURL:
                        false,

                    addHistory:
                        false

                }
            );

        }

    }


    SearchState.initialized =
        true;

}


/* ============================================================
   SEARCH PAGE DETECTION
============================================================ */

function isSearchPage() {

    const path =
        window.location.pathname
            .toLowerCase();


    return (
        path ===
            "/search" ||
        path.startsWith(
            "/search/"
        ) ||
        !!document.querySelector(
            "#searchResults"
        )
    );

}


/* ============================================================
   SEARCH POPSTATE
============================================================ */

window.addEventListener(
    "popstate",
    () => {

        if (
            !isSearchPage()
        ) {

            return;

        }


        const params =
            getSearchParamsFromURL();


        setSearchInputValue(
            params.query
        );


        if (
            params.query
        ) {

            performSearch(
                params.query,
                {

                    page:
                        params.page,

                    updateURL:
                        false,

                    addHistory:
                        false

                }
            );

        }

    }
);


/* ============================================================
   SEARCH GLOBAL EXPORT
============================================================ */

window.AwaazRajasthan.search = {

    state:
        SearchState,

    validate:
        validateSearchQuery,

    api:
        searchNewsAPI,

    search:
        performSearch,

    debounce:
        debounceSearch,

    history:
        {

            get:
                () =>
                    [
                        ...SearchState.history
                    ],

            add:
                addSearchHistory,

            remove:
                removeSearchHistoryItem,

            clear:
                clearSearchHistory,

            render:
                renderSearchHistory

        },

    suggestions:
        renderSearchSuggestions,

    initialize:
        initializeSearchPage

};


/* ============================================================
   AUTO INITIALIZATION
============================================================ */

window.addEventListener(
    "awaaz:ready",
    () => {

        initializeSearchPage();

    }
);


/* ============================================================
   END OF PART 16/30
============================================================ */
/* ============================================================
   AAWAAZ RAJASTHAN
   SCRIPT.JS — PART 17/30

   CATEGORY / DISTRICT NEWS SYSTEM
   CATEGORY FILTER
   DISTRICT FILTER
   NEWS LIST
   FILTER STATE
   SORTING
   LOAD MORE
   CATEGORY PAGE
============================================================ */


/* ============================================================
   CATEGORY CONFIGURATION
============================================================ */

const CATEGORY_CONFIG = {

    defaultLimit:
        12,

    maxLimit:
        48,

    categorySelectors: [
        "[data-category]",
        ".category-item",
        ".category-link"
    ],

    districtSelectors: [
        "[data-district]",
        ".district-item",
        ".district-link"
    ],

    resultSelectors: [
        "#categoryNews",
        "#categoryNewsGrid",
        ".category-news-grid",
        ".district-news-grid",
        ".filtered-news-grid"
    ]

};


/* ============================================================
   CATEGORY STATE
============================================================ */

const CategoryState = {

    category:
        "",

    district:
        "",

    search:
        "",

    sort:
        "latest",

    page:
        1,

    limit:
        CATEGORY_CONFIG.defaultLimit,

    total:
        0,

    totalPages:
        1,

    results:
        [],

    loading:
        false,

    initialized:
        false

};


/* ============================================================
   GET CATEGORY FROM URL
============================================================ */

function getCategoryFromURL() {

    const url =
        new URL(
            window.location.href
        );


    return normalizeText(
        url.searchParams.get(
            "category"
        ) ||
        ""
    );

}


/* ============================================================
   GET DISTRICT FROM URL
============================================================ */

function getDistrictFromURL() {

    const url =
        new URL(
            window.location.href
        );


    return normalizeText(
        url.searchParams.get(
            "district"
        ) ||
        ""
    );

}


/* ============================================================
   GET SORT FROM URL
============================================================ */

function getCategorySortFromURL() {

    const url =
        new URL(
            window.location.href
        );


    return normalizeText(
        url.searchParams.get(
            "sort"
        ) ||
        "latest"
    );

}


/* ============================================================
   GET CATEGORY PAGE
============================================================ */

function getCategoryPageFromURL() {

    const url =
        new URL(
            window.location.href
        );


    return Math.max(
        1,
        Number(
            url.searchParams.get(
                "page"
            )
        ) || 1
    );

}


/* ============================================================
   UPDATE CATEGORY URL
============================================================ */

function updateCategoryURL(
    options = {}
) {

    if (
        !window.history ||
        !window.history.pushState
    ) {

        return;

    }


    const url =
        new URL(
            window.location.href
        );


    if (
        CategoryState.category
    ) {

        url.searchParams.set(
            "category",
            CategoryState.category
        );

    } else {

        url.searchParams.delete(
            "category"
        );

    }


    if (
        CategoryState.district
    ) {

        url.searchParams.set(
            "district",
            CategoryState.district
        );

    } else {

        url.searchParams.delete(
            "district"
        );

    }


    if (
        CategoryState.sort &&
        CategoryState.sort !==
            "latest"
    ) {

        url.searchParams.set(
            "sort",
            CategoryState.sort
        );

    } else {

        url.searchParams.delete(
            "sort"
        );

    }


    if (
        CategoryState.page > 1
    ) {

        url.searchParams.set(
            "page",
            String(
                CategoryState.page
            )
        );

    } else {

        url.searchParams.delete(
            "page"
        );

    }


    window.history.pushState(
        {

            category:
                CategoryState.category,

            district:
                CategoryState.district,

            page:
                CategoryState.page,

            sort:
                CategoryState.sort

        },
        "",
        url
    );

}


/* ============================================================
   GET CATEGORY RESULT CONTAINER
============================================================ */

function getCategoryResultContainer() {

    for (
        const selector of
        CATEGORY_CONFIG.resultSelectors
    ) {

        const element =
            document.querySelector(
                selector
            );


        if (
            element
        ) {

            return element;

        }

    }


    return null;

}


/* ============================================================
   BUILD CATEGORY API QUERY
============================================================ */

function buildCategoryQuery(
    options = {}
) {

    const params =
        new URLSearchParams();


    const category =
        options.category ??
        CategoryState.category;


    const district =
        options.district ??
        CategoryState.district;


    const sort =
        options.sort ??
        CategoryState.sort;


    const page =
        options.page ??
        CategoryState.page;


    const limit =
        options.limit ??
        CategoryState.limit;


    if (
        category
    ) {

        params.set(
            "category",
            category
        );

    }


    if (
        district
    ) {

        params.set(
            "district",
            district
        );

    }


    if (
        sort
    ) {

        params.set(
            "sort",
            sort
        );

    }


    params.set(
        "page",
        String(
            page
        )
    );


    params.set(
        "limit",
        String(
            Math.min(
                CATEGORY_CONFIG.maxLimit,
                Math.max(
                    1,
                    Number(
                        limit
                    ) || CATEGORY_CONFIG.defaultLimit
                )
            )
        )
    );


    return params;

}


/* ============================================================
   FETCH CATEGORY NEWS
============================================================ */

async function fetchCategoryNews(
    options = {}
) {

    if (
        typeof apiGet !==
        "function"
    ) {

        throw new Error(
            "API GET function unavailable"
        );

    }


    const params =
        buildCategoryQuery(
            options
        );


    const response =
        await apiGet(
            `${API_ENDPOINTS.news}?${params.toString()}`
        );


    const data =
        response?.data ||
        response;


    const news =
        data?.news ||
        data?.articles ||
        data?.results ||
        [];


    const pagination =
        normalizePageData(
            data?.pagination ||
            data?.meta ||
            data
        );


    return {

        news:
            Array.isArray(
                news
            )
                ? news
                : [],

        total:
            pagination.totalItems,

        page:
            pagination.page,

        totalPages:
            pagination.totalPages,

        limit:
            pagination.limit

    };

}


/* ============================================================
   CREATE CATEGORY SKELETON
============================================================ */

function createCategorySkeleton(
    count = 6
) {

    const fragment =
        document.createDocumentFragment();


    for (
        let i = 0;
        i < count;
        i++
    ) {

        const card =
            createElement(
                "article",
                {

                    className:
                        "news-card category-skeleton-card"

                }
            );


        card.innerHTML =
            `

            <div class="skeleton category-skeleton-image"></div>

            <div class="category-skeleton-content">

                <div class="skeleton skeleton-line skeleton-small"></div>

                <div class="skeleton skeleton-line"></div>

                <div class="skeleton skeleton-line"></div>

                <div class="skeleton skeleton-line skeleton-medium"></div>

            </div>

            `;


        fragment.appendChild(
            card
        );

    }


    return fragment;

}


/* ============================================================
   RENDER CATEGORY LOADING
============================================================ */

function renderCategoryLoading(
    container
) {

    if (
        !container
    ) {

        return;

    }


    container.innerHTML =
        "";


    container.appendChild(
        createCategorySkeleton()
    );

}


/* ============================================================
   CREATE CATEGORY NEWS CARD
============================================================ */

function createCategoryNewsCard(
    article
) {

    if (
        typeof createNewsCard ===
        "function"
    ) {

        return createNewsCard(
            article,
            {

                showExcerpt:
                    true,

                showAuthor:
                    true,

                showSave:
                    true

            }
        );

    }


    const card =
        createElement(
            "article",
            {

                className:
                    "news-card category-news-card",

                attributes: {

                    "data-news-id":
                        getArticleId(
                            article
                        )

                }

            }
        );


    const image =
        getArticleImage(
            article
        );


    if (
        image
    ) {

        const imageWrapper =
            createElement(
                "div",
                {

                    className:
                        "news-card-image"

                }
            );


        imageWrapper.appendChild(
            createElement(
                "img",
                {

                    attributes: {

                        src:
                            image,

                        alt:
                            article.title ||
                            "समाचार",

                        loading:
                            "lazy"

                    }

                }
            )
        );


        card.appendChild(
            imageWrapper
        );

    }


    const content =
        createElement(
            "div",
            {

                className:
                    "news-card-content"

            }
        );


    const category =
        createElement(
            "span",
            {

                className:
                    "news-category",

                text:
                    article.category?.name ||
                    article.category ||
                    "राजस्थान"

            }
        );


    const title =
        createElement(
            "h3",
            {

                className:
                    "news-title",

                text:
                    article.title ||
                    "समाचार"

            }
        );


    content.appendChild(
        category
    );


    content.appendChild(
        title
    );


    if (
        article.excerpt
    ) {

        content.appendChild(
            createElement(
                "p",
                {

                    className:
                        "news-excerpt",

                    text:
                        normalizeText(
                            article.excerpt
                        )

                }
            )
        );

    }


    card.appendChild(
        content
    );


    card.addEventListener(
        "click",
        event => {

            if (
                event.target.closest(
                    "button, a"
                )
            ) {

                return;

            }


            openArticle(
                article
            );

        }
    );


    return card;

}


/* ============================================================
   RENDER CATEGORY RESULTS
============================================================ */

function renderCategoryResults(
    result,
    container = null
) {

    const target =
        container ||
        getCategoryResultContainer();


    if (
        !target
    ) {

        return;

    }


    target.innerHTML =
        "";


    const news =
        result?.news ||
        [];


    if (
        !news.length
    ) {

        target.appendChild(
            createCategoryEmptyState()
        );


        renderCategoryPagination(
            result
        );


        return;

    }


    const fragment =
        document.createDocumentFragment();


    news.forEach(
        article => {

            const card =
                createCategoryNewsCard(
                    article
                );


            if (
                card
            ) {

                fragment.appendChild(
                    card
                );

            }

        }
    );


    target.appendChild(
        fragment
    );


    initializeArticleCards();

    initializeLazyImages();


    renderCategoryPagination(
        result
    );

}


/* ============================================================
   CATEGORY EMPTY STATE
============================================================ */

function createCategoryEmptyState() {

    const wrapper =
        createElement(
            "div",
            {

                className:
                    "category-empty-state"

            }
        );


    const icon =
        createElement(
            "div",
            {

                className:
                    "category-empty-icon",

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
            "h2",
            {

                text:
                    "कोई खबर नहीं मिली"

            }
        );


    let message =
        "इस फिल्टर के लिए अभी कोई खबर उपलब्ध नहीं है।";


    if (
        CategoryState.district
    ) {

        message =
            `${CategoryState.district} से जुड़ी कोई खबर नहीं मिली।`;

    } else if (
        CategoryState.category
    ) {

        message =
            `${CategoryState.category} श्रेणी में अभी कोई खबर नहीं मिली।`;

    }


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
   RENDER CATEGORY PAGINATION
============================================================ */

function renderCategoryPagination(
    result
) {

    const containers =
        $$(
            "#categoryPagination, .category-pagination, [data-category-pagination]"
        );


    if (
        !containers.length
    ) {

        return;

    }


    containers.forEach(
        container => {

            renderPagination(
                {

                    page:
                        result?.page ||
                        1,

                    totalPages:
                        result?.totalPages ||
                        1,

                    totalItems:
                        result?.total ||
                        0,

                    limit:
                        result?.limit ||
                        CategoryState.limit

                },
                container,
                {

                    type:
                        "category",

                    onPageChange:
                        page =>
                            loadCategoryNews(
                                {

                                    page:
                                        page,

                                    updateURL:
                                        true

                                }
                            )

                }
            );

        }
    );

}


/* ============================================================
   UPDATE CATEGORY HEADING
============================================================ */

function updateCategoryHeading() {

    const headings =
        $$(
            "[data-category-heading], .category-heading"
        );


    let headingText =
        "राजस्थान की ताज़ा खबरें";


    if (
        CategoryState.district
    ) {

        headingText =
            `${CategoryState.district} की खबरें`;

    } else if (
        CategoryState.category
    ) {

        headingText =
            `${CategoryState.category} की खबरें`;

    }


    headings.forEach(
        heading => {

            heading.textContent =
                headingText;

        }
    );


    $$(
        "[data-category-total], .category-total"
    )
    .forEach(
        element => {

            element.textContent =
                CategoryState.total
                    ? `${CategoryState.total} खबरें`
                    : "";

        }
    );

}


/* ============================================================
   UPDATE ACTIVE CATEGORY
============================================================ */

function updateActiveCategory() {

    $$(
        "[data-category], .category-item, .category-link"
    )
    .forEach(
        element => {

            const value =
                normalizeText(
                    element.dataset.category ||
                    element.getAttribute(
                        "data-category"
                    ) ||
                    element.textContent ||
                    ""
                );


            const active =
                !!CategoryState.category &&
                value.toLowerCase() ===
                    CategoryState.category.toLowerCase();


            element.classList.toggle(
                "active",
                active
            );


            if (
                active
            ) {

                element.setAttribute(
                    "aria-current",
                    "page"
                );

            } else {

                element.removeAttribute(
                    "aria-current"
                );

            }

        }
    );

}


/* ============================================================
   UPDATE ACTIVE DISTRICT
============================================================ */

function updateActiveDistrict() {

    $$(
        "[data-district], .district-item, .district-link"
    )
    .forEach(
        element => {

            const value =
                normalizeText(
                    element.dataset.district ||
                    element.getAttribute(
                        "data-district"
                    ) ||
                    element.textContent ||
                    ""
                );


            const active =
                !!CategoryState.district &&
                value.toLowerCase() ===
                    CategoryState.district.toLowerCase();


            element.classList.toggle(
                "active",
                active
            );


            if (
                active
            ) {

                element.setAttribute(
                    "aria-current",
                    "page"
                );

            } else {

                element.removeAttribute(
                    "aria-current"
                );

            }

        }
    );

}


/* ============================================================
   LOAD CATEGORY NEWS
============================================================ */

async function loadCategoryNews(
    options = {}
) {

    if (
        options.category !==
        undefined
    ) {

        CategoryState.category =
            normalizeText(
                options.category
            );

    }


    if (
        options.district !==
        undefined
    ) {

        CategoryState.district =
            normalizeText(
                options.district
            );

    }


    if (
        options.sort !==
        undefined
    ) {

        CategoryState.sort =
            normalizeText(
                options.sort
            ) ||
            "latest";

    }


    if (
        options.page !==
        undefined
    ) {

        CategoryState.page =
            Math.max(
                1,
                Number(
                    options.page
                ) || 1
            );

    } else if (
        options.resetPage !==
        false
    ) {

        CategoryState.page =
            1;

    }


    if (
        options.limit !==
        undefined
    ) {

        CategoryState.limit =
            Math.min(
                CATEGORY_CONFIG.maxLimit,
                Math.max(
                    1,
                    Number(
                        options.limit
                    ) ||
                    CATEGORY_CONFIG.defaultLimit
                )
            );

    }


    const container =
        options.container ||
        getCategoryResultContainer();


    CategoryState.loading =
        true;


    updateCategoryHeading();

    updateActiveCategory();

    updateActiveDistrict();


    if (
        container &&
        options.loading !==
            false
    ) {

        renderCategoryLoading(
            container
        );

    }


    try {

        const result =
            await fetchCategoryNews(
                {

                    category:
                        CategoryState.category,

                    district:
                        CategoryState.district,

                    sort:
                        CategoryState.sort,

                    page:
                        CategoryState.page,

                    limit:
                        CategoryState.limit

                }
            );


        CategoryState.results =
            result.news;


        CategoryState.total =
            result.total;


        CategoryState.page =
            result.page;


        CategoryState.totalPages =
            result.totalPages;


        CategoryState.limit =
            result.limit;


        renderCategoryResults(
            result,
            container
        );


        updateCategoryHeading();


        if (
            options.updateURL !==
            false
        ) {

            updateCategoryURL();

        }


        return result;

    } catch (
        error
    ) {

        if (
            container
        ) {

            container.innerHTML =
                "";


            container.appendChild(
                createArticleErrorState(
                    "खबरें लोड नहीं हो सकीं। कृपया दोबारा प्रयास करें।"
                )
            );

        }


        handleGlobalError(
            error,
            "Category News"
        );


        return null;

    } finally {

        CategoryState.loading =
            false;

    }

}


/* ============================================================
   SELECT CATEGORY
============================================================ */

function selectCategory(
    category,
    options = {}
) {

    CategoryState.category =
        normalizeText(
            category
        );


    CategoryState.district =
        options.keepDistrict
            ? CategoryState.district
            : "";


    CategoryState.page =
        1;


    return loadCategoryNews(
        {

            category:
                CategoryState.category,

            district:
                CategoryState.district,

            page:
                1,

            updateURL:
                options.updateURL !==
                    false

        }
    );

}


/* ============================================================
   SELECT DISTRICT
============================================================ */

function selectDistrict(
    district,
    options = {}
) {

    CategoryState.district =
        normalizeText(
            district
        );


    CategoryState.page =
        1;


    return loadCategoryNews(
        {

            district:
                CategoryState.district,

            page:
                1,

            updateURL:
                options.updateURL !==
                    false

        }
    );

}


/* ============================================================
   CLEAR CATEGORY FILTERS
============================================================ */

function clearCategoryFilters(
    options = {}
) {

    CategoryState.category =
        "";

    CategoryState.district =
        "";

    CategoryState.sort =
        "latest";

    CategoryState.page =
        1;


    return loadCategoryNews(
        {

            page:
                1,

            updateURL:
                options.updateURL !==
                    false

        }
    );

}


/* ============================================================
   CATEGORY CLICK DELEGATION
============================================================ */

function initializeCategoryDelegation() {

    document.addEventListener(
        "click",
        event => {

            const categoryElement =
                event.target.closest(
                    "[data-category]"
                );


            if (
                categoryElement
            ) {

                event.preventDefault();


                const category =
                    normalizeText(
                        categoryElement.dataset.category
                    );


                if (
                    category
                ) {

                    selectCategory(
                        category
                    );

                }


                return;

            }


            const districtElement =
                event.target.closest(
                    "[data-district]"
                );


            if (
                districtElement
            ) {

                event.preventDefault();


                const district =
                    normalizeText(
                        districtElement.dataset.district
                    );


                if (
                    district
                ) {

                    selectDistrict(
                        district
                    );

                }

            }

        }
    );

}


/* ============================================================
   CATEGORY SORT HANDLER
============================================================ */

function initializeCategorySort() {

    const selects =
        $$(
            "#categorySort, [data-category-sort], .category-sort"
        );


    selects.forEach(
        select => {

            if (
                select.dataset.categorySortInitialized ===
                "true"
            ) {

                return;

            }


            select.dataset.categorySortInitialized =
                "true";


            select.value =
                CategoryState.sort;


            select.addEventListener(
                "change",
                () => {

                    CategoryState.sort =
                        normalizeText(
                            select.value
                        ) ||
                        "latest";


                    CategoryState.page =
                        1;


                    loadCategoryNews(
                        {

                            sort:
                                CategoryState.sort,

                            page:
                                1,

                            updateURL:
                                true

                        }
                    );

                }
            );

        }
    );

}


/* ============================================================
   CATEGORY PAGE INITIALIZATION
============================================================ */

async function initializeCategoryPage() {

    const category =
        getCategoryFromURL();


    const district =
        getDistrictFromURL();


    const sort =
        getCategorySortFromURL();


    const page =
        getCategoryPageFromURL();


    CategoryState.category =
        category;


    CategoryState.district =
        district;


    CategoryState.sort =
        sort ||
        "latest";


    CategoryState.page =
        page;


    initializeCategoryDelegation();

    initializeCategorySort();


    updateActiveCategory();

    updateActiveDistrict();


    if (
        isCategoryPage()
    ) {

        await loadCategoryNews(
            {

                page:
                    page,

                updateURL:
                    false

            }
        );

    }


    CategoryState.initialized =
        true;

}


/* ============================================================
   CATEGORY PAGE DETECTION
============================================================ */

function isCategoryPage() {

    const path =
        window.location.pathname
            .toLowerCase();


    return (
        path.startsWith(
            "/category"
        ) ||
        path.startsWith(
            "/district"
        ) ||
        !!document.querySelector(
            "#categoryNews, #categoryNewsGrid"
        )
    );

}


/* ============================================================
   CATEGORY POPSTATE
============================================================ */

window.addEventListener(
    "popstate",
    () => {

        if (
            !isCategoryPage()
        ) {

            return;

        }


        CategoryState.category =
            getCategoryFromURL();


        CategoryState.district =
            getDistrictFromURL();


        CategoryState.sort =
            getCategorySortFromURL();


        CategoryState.page =
            getCategoryPageFromURL();


        loadCategoryNews(
            {

                category:
                    CategoryState.category,

                district:
                    CategoryState.district,

                sort:
                    CategoryState.sort,

                page:
                    CategoryState.page,

                updateURL:
                    false

            }
        );

    }
);


/* ============================================================
   CATEGORY GLOBAL EXPORT
============================================================ */

window.AwaazRajasthan.category = {

    state:
        CategoryState,

    getCategory:
        getCategoryFromURL,

    getDistrict:
        getDistrictFromURL,

    fetch:
        fetchCategoryNews,

    load:
        loadCategoryNews,

    select:
        selectCategory,

    district:
        selectDistrict,

    clear:
        clearCategoryFilters,

    initialize:
        initializeCategoryPage

};


/* ============================================================
   AUTO INITIALIZATION
============================================================ */

window.addEventListener(
    "awaaz:ready",
    () => {

        initializeCategoryPage();

    }
);


/* ============================================================
   END OF PART 17/30
============================================================ */
/* ============================================================
   AAWAAZ RAJASTHAN
   SCRIPT.JS — PART 18/30

   DISTRICT SYSTEM
   RAJASTHAN DISTRICTS
   DISTRICT MENU
   DISTRICT SEARCH
   DISTRICT FILTER
   DISTRICT NEWS
   MOBILE DISTRICT DRAWER
============================================================ */


/* ============================================================
   RAJASTHAN DISTRICTS
============================================================ */

const RAJASTHAN_DISTRICTS = [

    "अजमेर",
    "अलवर",
    "बालोतरा",
    "बांसवाड़ा",
    "बारां",
    "बाड़मेर",
    "ब्यावर",
    "भरतपुर",
    "भीलवाड़ा",
    "बीकानेर",
    "बूंदी",
    "चित्तौड़गढ़",
    "चूरू",
    "दौसा",
    "डीग",
    "धौलपुर",
    "डीडवाना-कुचामन",
    "दूदू",
    "डूंगरपुर",
    "हनुमानगढ़",
    "जयपुर",
    "जैसलमेर",
    "जालौर",
    "झालावाड़",
    "झुंझुनूं",
    "जोधपुर",
    "करौली",
    "केकड़ी",
    "खैरथल-तिजारा",
    "कोटा",
    "कोटपूतली-बहरोड़",
    "नागौर",
    "नीमकाथाना",
    "पाली",
    "फलोदी",
    "प्रतापगढ़",
    "राजसमंद",
    "सलूंबर",
    "सवाई माधोपुर",
    "शाहपुरा",
    "श्रीगंगानगर",
    "सीकर",
    "सिरोही",
    "टोंक",
    "उदयपुर"
];


/* ============================================================
   DISTRICT STATE
============================================================ */

const DistrictState = {

    districts:
        [...RAJASTHAN_DISTRICTS],

    filteredDistricts:
        [...RAJASTHAN_DISTRICTS],

    selected:
        CategoryState?.district ||
        "",

    search:
        "",

    menuOpen:
        false,

    drawerOpen:
        false,

    initialized:
        false

};


/* ============================================================
   NORMALIZE DISTRICT NAME
============================================================ */

function normalizeDistrictName(
    district
) {

    return normalizeText(
        district
    );

}


/* ============================================================
   FIND DISTRICT
============================================================ */

function findDistrict(
    district
) {

    const value =
        normalizeDistrictName(
            district
        );


    if (
        !value
    ) {

        return "";

    }


    return DistrictState.districts.find(
        item =>
            item.toLowerCase() ===
            value.toLowerCase()
    ) || value;

}


/* ============================================================
   FILTER DISTRICTS
============================================================ */

function filterDistricts(
    query = ""
) {

    const value =
        normalizeDistrictName(
            query
        );


    DistrictState.search =
        value;


    if (
        !value
    ) {

        DistrictState.filteredDistricts =
            [...DistrictState.districts];

        return DistrictState.filteredDistricts;

    }


    DistrictState.filteredDistricts =
        DistrictState.districts.filter(
            district =>
                district
                    .toLowerCase()
                    .includes(
                        value.toLowerCase()
                    )
        );


    return DistrictState.filteredDistricts;

}


/* ============================================================
   GET DISTRICT CONTAINERS
============================================================ */

function getDistrictContainers() {

    return $$(
        "#districtList, " +
        ".district-list, " +
        "[data-district-list]"
    );

}


/* ============================================================
   CREATE DISTRICT ITEM
============================================================ */

function createDistrictItem(
    district
) {

    const button =
        createElement(
            "button",
            {

                className:
                    "district-menu-item",

                text:
                    district,

                attributes: {

                    type:
                        "button",

                    "data-district":
                        district

                }

            }
        );


    const active =
        DistrictState.selected &&
        DistrictState.selected.toLowerCase() ===
            district.toLowerCase();


    if (
        active
    ) {

        button.classList.add(
            "active"
        );


        button.setAttribute(
            "aria-current",
            "page"
        );

    }


    button.addEventListener(
        "click",
        event => {

            event.preventDefault();


            selectDistrictFromMenu(
                district
            );

        }
    );


    return button;

}


/* ============================================================
   RENDER DISTRICT LIST
============================================================ */

function renderDistrictList(
    target = null
) {

    const containers =
        target
            ? [
                typeof target === "string"
                    ? document.querySelector(target)
                    : target
            ]
            : getDistrictContainers();


    containers
        .filter(Boolean)
        .forEach(
            container => {

                container.innerHTML =
                    "";


                const districts =
                    DistrictState.filteredDistricts;


                if (
                    !districts.length
                ) {

                    const empty =
                        createElement(
                            "div",
                            {

                                className:
                                    "district-empty",

                                text:
                                    "जिला नहीं मिला।"

                            }
                        );


                    container.appendChild(
                        empty
                    );


                    return;

                }


                const fragment =
                    document.createDocumentFragment();


                districts.forEach(
                    district => {

                        fragment.appendChild(
                            createDistrictItem(
                                district
                            )
                        );

                    }
                );


                container.appendChild(
                    fragment
                );

            }
        );

}


/* ============================================================
   INITIALIZE DISTRICT SEARCH
============================================================ */

function initializeDistrictSearch() {

    const inputs =
        $$(
            "#districtSearch, " +
            ".district-search-input, " +
            "[data-district-search]"
        );


    inputs.forEach(
        input => {

            if (
                input.dataset.districtSearchInitialized ===
                "true"
            ) {

                return;

            }


            input.dataset.districtSearchInitialized =
                "true";


            input.addEventListener(
                "input",
                event => {

                    filterDistricts(
                        event.target.value
                    );


                    renderDistrictList();

                }
            );


            input.addEventListener(
                "keydown",
                event => {

                    if (
                        event.key ===
                        "Escape"
                    ) {

                        input.value =
                            "";


                        filterDistricts(
                            ""
                        );


                        renderDistrictList();

                    }

                }
            );

        }
    );

}


/* ============================================================
   SELECT DISTRICT FROM MENU
============================================================ */

async function selectDistrictFromMenu(
    district
) {

    const selected =
        findDistrict(
            district
        );


    if (
        !selected
    ) {

        return;

    }


    DistrictState.selected =
        selected;


    CategoryState.district =
        selected;


    CategoryState.page =
        1;


    updateDistrictActiveState();


    closeDistrictDrawer();


    closeDistrictMenu();


    try {

        await loadCategoryNews(
            {

                district:
                    selected,

                page:
                    1,

                updateURL:
                    true

            }
        );

    } catch (
        error
    ) {

        handleGlobalError(
            error,
            "District Selection"
        );

    }


    scrollToCategoryResults();

}


/* ============================================================
   CLEAR DISTRICT SELECTION
============================================================ */

async function clearDistrictSelection() {

    DistrictState.selected =
        "";


    CategoryState.district =
        "";


    CategoryState.page =
        1;


    updateDistrictActiveState();


    try {

        await loadCategoryNews(
            {

                district:
                    "",

                page:
                    1,

                updateURL:
                    true

            }
        );

    } catch (
        error
    ) {

        handleGlobalError(
            error,
            "District Clear"
        );

    }

}


/* ============================================================
   UPDATE DISTRICT ACTIVE STATE
============================================================ */

function updateDistrictActiveState() {

    $$(
        "[data-district], " +
        ".district-menu-item, " +
        ".district-item"
    )
    .forEach(
        element => {

            const district =
                normalizeDistrictName(
                    element.dataset.district ||
                    element.getAttribute(
                        "data-district"
                    ) ||
                    element.textContent
                );


            const active =
                !!DistrictState.selected &&
                district.toLowerCase() ===
                    DistrictState.selected.toLowerCase();


            element.classList.toggle(
                "active",
                active
            );


            if (
                active
            ) {

                element.setAttribute(
                    "aria-current",
                    "page"
                );

            } else {

                element.removeAttribute(
                    "aria-current"
                );

            }

        }
    );


    $$(
        "[data-selected-district], " +
        ".selected-district, " +
        "#selectedDistrict"
    )
    .forEach(
        element => {

            element.textContent =
                DistrictState.selected ||
                "सभी जिले";

        }
    );

}


/* ============================================================
   DISTRICT MENU
============================================================ */

function openDistrictMenu() {

    DistrictState.menuOpen =
        true;


    $$(
        ".district-menu, " +
        "#districtMenu, " +
        "[data-district-menu]"
    )
    .forEach(
        menu => {

            menu.classList.add(
                "open"
            );


            menu.removeAttribute(
                "hidden"
            );


            menu.setAttribute(
                "aria-hidden",
                "false"
            );

        }
    );


    $$(
        "[data-district-menu-toggle], " +
        "#districtMenuToggle"
    )
    .forEach(
        button => {

            button.setAttribute(
                "aria-expanded",
                "true"
            );

        }
    );


    renderDistrictList();

}


/* ============================================================
   CLOSE DISTRICT MENU
============================================================ */

function closeDistrictMenu() {

    DistrictState.menuOpen =
        false;


    $$(
        ".district-menu, " +
        "#districtMenu, " +
        "[data-district-menu]"
    )
    .forEach(
        menu => {

            menu.classList.remove(
                "open"
            );


            menu.setAttribute(
                "aria-hidden",
                "true"
            );

        }
    );


    $$(
        "[data-district-menu-toggle], " +
        "#districtMenuToggle"
    )
    .forEach(
        button => {

            button.setAttribute(
                "aria-expanded",
                "false"
            );

        }
    );

}


/* ============================================================
   TOGGLE DISTRICT MENU
============================================================ */

function toggleDistrictMenu() {

    if (
        DistrictState.menuOpen
    ) {

        closeDistrictMenu();

    } else {

        openDistrictMenu();

    }

}


/* ============================================================
   DISTRICT DRAWER
============================================================ */

function openDistrictDrawer() {

    DistrictState.drawerOpen =
        true;


    $$(
        ".district-drawer, " +
        "#districtDrawer, " +
        "[data-district-drawer]"
    )
    .forEach(
        drawer => {

            drawer.classList.add(
                "open"
            );


            drawer.removeAttribute(
                "hidden"
            );


            drawer.setAttribute(
                "aria-hidden",
                "false"
            );

        }
    );


    $$(
        ".district-drawer-overlay, " +
        "#districtDrawerOverlay, " +
        "[data-district-overlay]"
    )
    .forEach(
        overlay => {

            overlay.classList.add(
                "visible"
            );


            overlay.removeAttribute(
                "hidden"
            );

        }
    );


    document.body.classList.add(
        "district-drawer-open"
    );


    renderDistrictList();

}


/* ============================================================
   CLOSE DISTRICT DRAWER
============================================================ */

function closeDistrictDrawer() {

    DistrictState.drawerOpen =
        false;


    $$(
        ".district-drawer, " +
        "#districtDrawer, " +
        "[data-district-drawer]"
    )
    .forEach(
        drawer => {

            drawer.classList.remove(
                "open"
            );


            drawer.setAttribute(
                "aria-hidden",
                "true"
            );

        }
    );


    $$(
        ".district-drawer-overlay, " +
        "#districtDrawerOverlay, " +
        "[data-district-overlay]"
    )
    .forEach(
        overlay => {

            overlay.classList.remove(
                "visible"
            );

        }
    );


    document.body.classList.remove(
        "district-drawer-open"
    );

}


/* ============================================================
   TOGGLE DISTRICT DRAWER
============================================================ */

function toggleDistrictDrawer() {

    if (
        DistrictState.drawerOpen
    ) {

        closeDistrictDrawer();

    } else {

        openDistrictDrawer();

    }

}


/* ============================================================
   DISTRICT EVENTS
============================================================ */

function initializeDistrictEvents() {

    document.addEventListener(
        "click",
        event => {

            const menuToggle =
                event.target.closest(
                    "[data-district-menu-toggle], #districtMenuToggle"
                );


            if (
                menuToggle
            ) {

                event.preventDefault();

                toggleDistrictMenu();

                return;

            }


            const drawerToggle =
                event.target.closest(
                    "[data-district-drawer-toggle], #districtDrawerToggle"
                );


            if (
                drawerToggle
            ) {

                event.preventDefault();

                toggleDistrictDrawer();

                return;

            }


            const closeButton =
                event.target.closest(
                    "[data-district-close], #districtDrawerClose"
                );


            if (
                closeButton
            ) {

                event.preventDefault();

                closeDistrictDrawer();

                closeDistrictMenu();

                return;

            }


            const overlay =
                event.target.closest(
                    ".district-drawer-overlay, " +
                    "#districtDrawerOverlay, " +
                    "[data-district-overlay]"
                );


            if (
                overlay
            ) {

                closeDistrictDrawer();

            }

        }
    );


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key !==
                "Escape"
            ) {

                return;

            }


            if (
                DistrictState.drawerOpen
            ) {

                closeDistrictDrawer();

            }


            if (
                DistrictState.menuOpen
            ) {

                closeDistrictMenu();

            }

        }
    );

}


/* ============================================================
   SCROLL TO CATEGORY RESULTS
============================================================ */

function scrollToCategoryResults() {

    const target =
        getCategoryResultContainer();


    if (
        !target
    ) {

        return;

    }


    const rect =
        target.getBoundingClientRect();


    const top =
        window.scrollY +
        rect.top -
        90;


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
   DISTRICT URL INITIALIZATION
============================================================ */

function initializeDistrictFromURL() {

    const district =
        getDistrictFromURL();


    if (
        district
    ) {

        DistrictState.selected =
            findDistrict(
                district
            );

    } else {

        DistrictState.selected =
            "";

    }


    updateDistrictActiveState();

}


/* ============================================================
   DISTRICT DROPDOWN VALUE
============================================================ */

function initializeDistrictSelects() {

    const selects =
        $$(
            "#districtSelect, " +
            "[data-district-select], " +
            ".district-select"
        );


    selects.forEach(
        select => {

            if (
                select.dataset.districtSelectInitialized ===
                "true"
            ) {

                return;

            }


            select.dataset.districtSelectInitialized =
                "true";


            const current =
                DistrictState.selected;


            if (
                current
            ) {

                select.value =
                    current;

            }


            select.addEventListener(
                "change",
                () => {

                    const value =
                        normalizeDistrictName(
                            select.value
                        );


                    if (
                        value
                    ) {

                        selectDistrictFromMenu(
                            value
                        );

                    } else {

                        clearDistrictSelection();

                    }

                }
            );

        }
    );

}


/* ============================================================
   DISTRICT INITIALIZATION
============================================================ */

function initializeDistrictSystem() {

    if (
        DistrictState.initialized
    ) {

        return;

    }


    initializeDistrictFromURL();

    initializeDistrictSearch();

    initializeDistrictEvents();

    initializeDistrictSelects();

    filterDistricts(
        ""
    );

    renderDistrictList();

    updateDistrictActiveState();


    DistrictState.initialized =
        true;

}


/* ============================================================
   DISTRICT GLOBAL EXPORT
============================================================ */

window.AwaazRajasthan.district = {

    state:
        DistrictState,

    all:
        () =>
            [
                ...DistrictState.districts
            ],

    find:
        findDistrict,

    filter:
        filterDistricts,

    render:
        renderDistrictList,

    select:
        selectDistrictFromMenu,

    clear:
        clearDistrictSelection,

    open:
        openDistrictDrawer,

    close:
        closeDistrictDrawer,

    toggle:
        toggleDistrictDrawer,

    initialize:
        initializeDistrictSystem

};


/* ============================================================
   AUTO INITIALIZATION
============================================================ */

window.addEventListener(
    "awaaz:ready",
    () => {

        initializeDistrictSystem();

    }
);


/* ============================================================
   END OF PART 18/30
============================================================ */
/* ============================================================
   AAWAAZ RAJASTHAN
   SCRIPT.JS — PART 19/30

   NEWS DETAILS SYSTEM
   ARTICLE PAGE
   ARTICLE LOADING
   RELATED NEWS
   SHARE SYSTEM
   BOOKMARK
   PRINT
   READING PROGRESS
============================================================ */


/* ============================================================
   ARTICLE STATE
============================================================ */

const ArticleState = {

    id:
        "",

    article:
        null,

    related:
        [],

    loading:
        false,

    relatedLoading:
        false,

    initialized:
        false,

    progress:
        0

};


/* ============================================================
   GET ARTICLE ID FROM URL
============================================================ */

function getArticleIdFromURL() {

    const url =
        new URL(
            window.location.href
        );


    const params =
        url.searchParams;


    const candidates = [

        params.get(
            "id"
        ),

        params.get(
            "newsId"
        ),

        params.get(
            "articleId"
        )

    ];


    for (
        const candidate of
        candidates
    ) {

        const value =
            normalizeText(
                candidate ||
                ""
            );


        if (
            value
        ) {

            return value;

        }

    }


    const path =
        window.location.pathname
            .split("/")
            .filter(Boolean);


    if (
        path.length
    ) {

        const last =
            path[path.length - 1];


        if (
            last &&
            ![
                "news",
                "article",
                "details"
            ].includes(
                last.toLowerCase()
            )
        ) {

            return decodeURIComponent(
                last
            );

        }

    }


    return "";

}


/* ============================================================
   GET ARTICLE RESULT CONTAINER
============================================================ */

function getArticleContainer() {

    const selectors = [

        "#articlePage",

        "#articleDetails",

        "#newsArticle",

        ".article-page",

        ".article-details",

        "[data-article-page]"

    ];


    for (
        const selector of
        selectors
    ) {

        const element =
            document.querySelector(
                selector
            );


        if (
            element
        ) {

            return element;

        }

    }


    return null;

}


/* ============================================================
   GET RELATED NEWS CONTAINER
============================================================ */

function getRelatedNewsContainer() {

    const selectors = [

        "#relatedNews",

        "#relatedNewsGrid",

        ".related-news-grid",

        ".related-news",

        "[data-related-news]"

    ];


    for (
        const selector of
        selectors
    ) {

        const element =
            document.querySelector(
                selector
            );


        if (
            element
        ) {

            return element;

        }

    }


    return null;

}


/* ============================================================
   ARTICLE API
============================================================ */

async function fetchArticleById(
    id
) {

    const articleId =
        normalizeText(
            id
        );


    if (
        !articleId
    ) {

        throw new Error(
            "Article ID missing"
        );

    }


    if (
        typeof apiGet !==
        "function"
    ) {

        throw new Error(
            "API GET function unavailable"
        );

    }


    const response =
        await apiGet(
            `${API_ENDPOINTS.news}/${encodeURIComponent(articleId)}`
        );


    const data =
        response?.data ||
        response;


    const article =
        data?.news ||
        data?.article ||
        data;


    if (
        !article ||
        typeof article !==
            "object"
    ) {

        throw new Error(
            "Article not found"
        );

    }


    return article;

}


/* ============================================================
   ARTICLE SKELETON
============================================================ */

function renderArticleSkeleton(
    container
) {

    if (
        !container
    ) {

        return;

    }


    container.innerHTML =
        `

        <div class="article-skeleton">

            <div class="skeleton article-skeleton-category"></div>

            <div class="skeleton article-skeleton-title"></div>

            <div class="skeleton article-skeleton-title"></div>

            <div class="skeleton article-skeleton-meta"></div>

            <div class="skeleton article-skeleton-image"></div>

            <div class="article-skeleton-body">

                <div class="skeleton skeleton-line"></div>

                <div class="skeleton skeleton-line"></div>

                <div class="skeleton skeleton-line"></div>

                <div class="skeleton skeleton-line"></div>

                <div class="skeleton skeleton-line skeleton-medium"></div>

            </div>

        </div>

        `;

}


/* ============================================================
   ARTICLE IMAGE
============================================================ */

function getArticleHeroImage(
    article
) {

    return (
        article?.image ||
        article?.imageUrl ||
        article?.featuredImage ||
        article?.thumbnail ||
        article?.coverImage ||
        article?.media?.url ||
        ""
    );

}


/* ============================================================
   ARTICLE CONTENT
============================================================ */

function getArticleContent(
    article
) {

    return (
        article?.content ||
        article?.body ||
        article?.description ||
        article?.excerpt ||
        ""
    );

}


/* ============================================================
   FORMAT ARTICLE CONTENT
============================================================ */

function formatArticleContent(
    content
) {

    if (
        !content
    ) {

        return "";

    }


    const value =
        String(
            content
        );


    /*
     * यदि backend पहले से HTML भेज रहा है
     * तो उसे सुरक्षित तरीके से render करें।
     */

    if (
        /<\/?[a-z][\s\S]*>/i.test(
            value
        )
    ) {

        return sanitizeHTML(
            value
        );

    }


    return value
        .split(
            /\n{2,}/
        )
        .map(
            paragraph =>
                `<p>${escapeHTML(
                    paragraph
                        .trim()
                )}</p>`
        )
        .join(
            ""
        );

}


/* ============================================================
   ARTICLE META
============================================================ */

function getArticleDate(
    article
) {

    return (
        article?.publishedAt ||
        article?.publishDate ||
        article?.createdAt ||
        article?.date ||
        ""
    );

}


/* ============================================================
   RENDER ARTICLE
============================================================ */

function renderArticle(
    article,
    container = null
) {

    const target =
        container ||
        getArticleContainer();


    if (
        !target ||
        !article
    ) {

        return;

    }


    const title =
        article.title ||
        article.headline ||
        "समाचार";


    const category =
        getArticleCategoryName(
            article
        ) ||
        "राजस्थान";


    const image =
        getArticleHeroImage(
            article
        );


    const content =
        getArticleContent(
            article
        );


    const date =
        getArticleDate(
            article
        );


    const author =
        article.author?.name ||
        article.authorName ||
        article.author ||
        "आवाज़ राजस्थान";


    const location =
        article.location ||
        article.district ||
        "";


    target.innerHTML =
        `

        <article
            class="article-detail"
            data-article-id="${escapeHTML(
                getArticleId(article)
            )}"
        >

            <header class="article-header">

                <div class="article-category">
                    ${escapeHTML(category)}
                </div>

                <h1 class="article-title">
                    ${escapeHTML(title)}
                </h1>

                ${
                    article.subtitle
                        ? `
                            <p class="article-subtitle">
                                ${escapeHTML(
                                    article.subtitle
                                )}
                            </p>
                          `
                        : ""
                }

                <div class="article-meta">

                    ${
                        date
                            ? `
                                <time datetime="${escapeHTML(
                                    date
                                )}">
                                    ${escapeHTML(
                                        formatDate(
                                            date
                                        )
                                    )}
                                </time>
                              `
                            : ""
                    }

                    <span class="article-author">
                        ${escapeHTML(author)}
                    </span>

                    ${
                        location
                            ? `
                                <span class="article-location">
                                    ${escapeHTML(
                                        location
                                    )}
                                </span>
                              `
                            : ""
                    }

                </div>

            </header>


            ${
                image
                    ? `
                        <figure class="article-hero">

                            <img
                                src="${escapeHTML(image)}"
                                alt="${escapeHTML(title)}"
                                loading="eager"
                            >

                        </figure>
                      `
                    : ""
            }


            <div class="article-actions">

                <button
                    type="button"
                    class="article-action-btn"
                    data-article-share
                    aria-label="खबर शेयर करें"
                >
                    <span aria-hidden="true">↗</span>
                    <span>शेयर</span>
                </button>


                <button
                    type="button"
                    class="article-action-btn"
                    data-article-bookmark
                    aria-label="खबर सेव करें"
                >
                    <span aria-hidden="true">🔖</span>
                    <span>सेव</span>
                </button>


                <button
                    type="button"
                    class="article-action-btn"
                    data-article-print
                    aria-label="खबर प्रिंट करें"
                >
                    <span aria-hidden="true">🖨</span>
                    <span>प्रिंट</span>
                </button>

            </div>


            <div class="article-content">

                ${formatArticleContent(content)}

            </div>


            ${
                article.tags?.length
                    ? `
                        <div class="article-tags">

                            ${article.tags
                                .map(
                                    tag =>
                                        `
                                        <button
                                            type="button"
                                            data-tag="${escapeHTML(
                                                tag
                                            )}"
                                        >
                                            #${escapeHTML(
                                                tag
                                            )}
                                        </button>
                                        `
                                )
                                .join("")}

                        </div>
                      `
                    : ""
            }

        </article>

        `;


    initializeArticleActions(
        article
    );


    initializeLazyImages();


    updateDocumentTitle(
        title
    );


    updateArticleMetaTags(
        article
    );

}


/* ============================================================
   LOAD ARTICLE
============================================================ */

async function loadArticle(
    id = null,
    options = {}
) {

    const articleId =
        normalizeText(
            id ||
            ArticleState.id ||
            getArticleIdFromURL()
        );


    if (
        !articleId
    ) {

        return null;

    }


    const container =
        options.container ||
        getArticleContainer();


    ArticleState.id =
        articleId;


    ArticleState.loading =
        true;


    if (
        container &&
        options.loading !==
            false
    ) {

        renderArticleSkeleton(
            container
        );

    }


    try {

        const article =
            await fetchArticleById(
                articleId
            );


        ArticleState.article =
            article;


        renderArticle(
            article,
            container
        );


        if (
            options.loadRelated !==
            false
        ) {

            await loadRelatedNews(
                article,
                options
            );

        }


        initializeReadingProgress();


        return article;

    } catch (
        error
    ) {

        if (
            container
        ) {

            container.innerHTML =
                "";


            container.appendChild(
                createArticleErrorState(
                    "खबर लोड नहीं हो सकी। कृपया दोबारा प्रयास करें।"
                )
            );

        }


        handleGlobalError(
            error,
            "Article"
        );


        return null;

    } finally {

        ArticleState.loading =
            false;

    }

}


/* ============================================================
   RELATED NEWS API
============================================================ */

async function fetchRelatedNews(
    article
) {

    if (
        typeof apiGet !==
        "function"
    ) {

        throw new Error(
            "API GET function unavailable"
        );

    }


    const category =
        article?.category?.slug ||
        article?.category?.name ||
        article?.category ||
        "";


    const articleId =
        getArticleId(
            article
        );


    const params =
        new URLSearchParams();


    params.set(
        "limit",
        "6"
    );


    if (
        category
    ) {

        params.set(
            "category",
            category
        );

    }


    const response =
        await apiGet(
            `${API_ENDPOINTS.news}?${params.toString()}`
        );


    const data =
        response?.data ||
        response;


    const news =
        data?.news ||
        data?.articles ||
        data?.results ||
        [];


    return Array.isArray(
        news
    )
        ? news.filter(
            item =>
                getArticleId(
                    item
                ) !==
                articleId
        )
        : [];

}


/* ============================================================
   RELATED NEWS SKELETON
============================================================ */

function renderRelatedSkeleton(
    container,
    count = 4
) {

    if (
        !container
    ) {

        return;

    }


    container.innerHTML =
        "";


    for (
        let i = 0;
        i < count;
        i++
    ) {

        const card =
            createElement(
                "div",
                {

                    className:
                        "related-skeleton"

                }
            );


        card.innerHTML =
            `

            <div class="skeleton related-skeleton-image"></div>

            <div class="skeleton skeleton-line"></div>

            <div class="skeleton skeleton-line skeleton-medium"></div>

            `;


        container.appendChild(
            card
        );

    }

}


/* ============================================================
   LOAD RELATED NEWS
============================================================ */

async function loadRelatedNews(
    article,
    options = {}
) {

    const container =
        options.relatedContainer ||
        getRelatedNewsContainer();


    if (
        !article ||
        !container
    ) {

        return [];

    }


    ArticleState.relatedLoading =
        true;


    renderRelatedSkeleton(
        container
    );


    try {

        const related =
            await fetchRelatedNews(
                article
            );


        ArticleState.related =
            related;


        renderRelatedNews(
            related,
            container
        );


        return related;

    } catch (
        error
    ) {

        ArticleState.related =
            [];


        container.innerHTML =
            "";


        return [];

    } finally {

        ArticleState.relatedLoading =
            false;

    }

}


/* ============================================================
   RENDER RELATED NEWS
============================================================ */

function renderRelatedNews(
    articles,
    container = null
) {

    const target =
        container ||
        getRelatedNewsContainer();


    if (
        !target
    ) {

        return;

    }


    target.innerHTML =
        "";


    if (
        !Array.isArray(
            articles
        ) ||
        !articles.length
    ) {

        target.appendChild(
            createElement(
                "p",
                {

                    className:
                        "related-news-empty",

                    text:
                        "संबंधित खबरें उपलब्ध नहीं हैं।"

                }
            )
        );


        return;

    }


    const fragment =
        document.createDocumentFragment();


    articles.forEach(
        article => {

            const card =
                createSearchResultCard(
                    article
                );


            if (
                card
            ) {

                card.classList.add(
                    "related-news-card"
                );


                fragment.appendChild(
                    card
                );

            }

        }
    );


    target.appendChild(
        fragment
    );


    initializeArticleCards();

    initializeLazyImages();

}


/* ============================================================
   ARTICLE SHARE DATA
============================================================ */

