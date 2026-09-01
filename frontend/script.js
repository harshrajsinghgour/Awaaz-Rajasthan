/* =========================================================
   AAWAZ RAJASTHAN
   MAIN JAVASCRIPT
   ========================================================= */

"use strict";


/* =========================================================
   01. DOM READY
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

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

});


/* =========================================================
   02. SPLASH SCREEN
   ========================================================= */

function initSplashScreen() {

    const splash = document.querySelector(".splash-container");

    if (!splash) return;

    setTimeout(function () {
        splash.classList.add("hide");

        setTimeout(function () {
            splash.style.display = "none";
        }, 600);

    }, 1800);
}


/* =========================================================
   03. SCREEN / PAGE SWITCHING
   ========================================================= */

function initNavigation() {

    const navItems = document.querySelectorAll(
        ".nav-item, .mob-nav-item"
    );

    navItems.forEach(function (item) {

        item.addEventListener("click", function (event) {

            event.preventDefault();

            const target =
                item.dataset.screen ||
                item.getAttribute("data-target") ||
                item.getAttribute("href");

            if (!target) return;

            showScreen(target);

            updateActiveNavigation(target);

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        });

    });


    /*
     * Logo click = Home
     */

    const logoButtons = document.querySelectorAll(
        ".logo-area, .logo-button"
    );

    logoButtons.forEach(function (logo) {

        logo.addEventListener("click", function () {

            showScreen("home-screen");
            updateActiveNavigation("home-screen");

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        });

    });


    /*
     * See More buttons
     */

    document.querySelectorAll(".see-more").forEach(function (button) {

        button.addEventListener("click", function (event) {

            event.preventDefault();

            const target =
                button.dataset.screen ||
                button.getAttribute("data-target");

            if (target) {
                showScreen(target);
                updateActiveNavigation(target);
            }

        });

    });


    /*
     * Breadcrumb Home
     */

    document.querySelectorAll(".breadcrumb a").forEach(function (link) {

        link.addEventListener("click", function (event) {

            event.preventDefault();

            showScreen("home-screen");
            updateActiveNavigation("home-screen");

        });

    });

}


/*
 * Main screen function
 */

function showScreen(screenId) {

    let id = screenId;

    if (typeof id !== "string") return;

    /*
     * Remove # if href="#home-screen"
     */

    if (id.startsWith("#")) {
        id = id.substring(1);
    }

    /*
     * Convert common names
     */

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
        contact: "contact-screen"
    };

    if (aliases[id]) {
        id = aliases[id];
    }


    const screens = document.querySelectorAll(".page-screen");

    if (!screens.length) return;

    let targetScreen = document.getElementById(id);

    /*
     * If screen does not exist, do nothing
     */

    if (!targetScreen) return;


    screens.forEach(function (screen) {
        screen.classList.remove("active-screen");
    });


    targetScreen.classList.add("active-screen");


    /*
     * Update browser hash without jumping
     */

    if (history.replaceState) {

        history.replaceState(
            null,
            "",
            "#" + id
        );

    }

}


/*
 * Active navigation update
 */

function updateActiveNavigation(screenId) {

    if (screenId.startsWith("#")) {
        screenId = screenId.substring(1);
    }

    const navItems = document.querySelectorAll(
        ".nav-item, .mob-nav-item"
    );

    navItems.forEach(function (item) {

        const target =
            item.dataset.screen ||
            item.getAttribute("data-target") ||
            item.getAttribute("href");

        if (!target) return;

        const cleanTarget =
            target.replace("#", "");

        const isActive =
            cleanTarget === screenId ||
            (
                screenId === "home-screen" &&
                cleanTarget === "home-screen"
            );

        item.classList.toggle(
            "active",
            isActive
        );

    });

}


/* =========================================================
   04. INITIAL SCREEN FROM URL
   ========================================================= */

(function initInitialScreen() {

    window.addEventListener("load", function () {

        const hash =
            window.location.hash.replace("#", "");

        if (hash && document.getElementById(hash)) {

            showScreen(hash);
            updateActiveNavigation(hash);

        } else {

            showScreen("home-screen");
            updateActiveNavigation("home-screen");

        }

    });

})();


/* =========================================================
   05. SEARCH
   ========================================================= */

function initSearch() {

    const searchBox =
        document.querySelector(".search-box");

    if (!searchBox) return;

    const input =
        searchBox.querySelector("input");

    const button =
        searchBox.querySelector("button");

    if (!input) return;


    function performSearch() {

        const query =
            input.value.trim().toLowerCase();

        if (!query) {

            showToast(
                "कृपया कुछ खोजें",
                "warning"
            );

            input.focus();

            return;
        }


        const searchableItems =
            document.querySelectorAll(
                ".news-card-horizontal, " +
                ".feed-card, " +
                ".video-card, " +
                ".trending-list li, " +
                ".recent-list li, " +
                ".district-item"
            );


        let found = 0;


        searchableItems.forEach(function (item) {

            const text =
                item.innerText.toLowerCase();

            if (text.includes(query)) {

                item.style.display = "";

                found++;

                /*
                 * Highlight search result
                 */

                item.classList.add(
                    "search-result-found"
                );

            } else {

                item.classList.remove(
                    "search-result-found"
                );

            }

        });


        /*
         * Show latest screen
         */

        const latest =
            document.getElementById(
                "latest-screen"
            );

        if (latest) {

            showScreen("latest-screen");

            updateActiveNavigation(
                "latest-screen"
            );

        }


        if (found > 0) {

            showToast(
                found + " परिणाम मिले",
                "success"
            );

        } else {

            showToast(
                "कोई समाचार नहीं मिला",
                "warning"
            );

        }

    }


    if (button) {

        button.addEventListener(
            "click",
            performSearch
        );

    }


    input.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                event.preventDefault();

                performSearch();

            }

        }
    );

}


/* =========================================================
   06. LOGIN
   ========================================================= */

function initLogin() {

    const loginButtons =
        document.querySelectorAll(
            ".btn-login, [data-login]"
        );


    loginButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                openLoginModal();

            }
        );

    });

}


/*
 * Login modal
 */

function openLoginModal() {

    let modal =
        document.getElementById(
            "loginModal"
        );


    /*
     * Create modal if HTML does not have one
     */

    if (!modal) {

        modal =
            document.createElement("div");

        modal.id = "loginModal";

        modal.innerHTML = `
            <div class="login-overlay">
                <div class="login-modal">

                    <button
                        class="login-close"
                        aria-label="Close">
                        &times;
                    </button>

                    <h2>लॉगिन करें</h2>

                    <p>
                        Aawaz Rajasthan में आपका स्वागत है।
                    </p>

                    <form id="loginForm">

                        <input
                            type="text"
                            id="loginMobile"
                            placeholder="मोबाइल नंबर"
                            inputmode="numeric"
                            maxlength="10"
                            required
                        >

                        <input
                            type="password"
                            id="loginPassword"
                            placeholder="पासवर्ड"
                            required
                        >

                        <button
                            type="submit"
                            class="btn-main">
                            लॉगिन
                        </button>

                    </form>

                </div>
            </div>
        `;

        document.body.appendChild(modal);


        /*
         * Modal styles
         */

        const style =
            document.createElement("style");

        style.textContent = `
            #loginModal {
                position: fixed;
                inset: 0;
                z-index: 10000;
            }

            .login-overlay {
                width: 100%;
                height: 100%;

                display: flex;
                align-items: center;
                justify-content: center;

                padding: 20px;

                background: rgba(0,0,0,.65);
            }

            .login-modal {
                width: min(100%, 390px);

                position: relative;

                padding: 28px;

                background: #fff;

                border-radius: 12px;

                box-shadow: 0 20px 60px rgba(0,0,0,.3);
            }

            .login-modal h2 {
                margin-bottom: 5px;
            }

            .login-modal p {
                margin-bottom: 18px;
                color: #777;
                font-size: 13px;
            }

            .login-modal form {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }

            .login-modal input {
                width: 100%;
                padding: 12px;

                border: 1px solid #ddd;
                border-radius: 6px;

                outline: none;
            }

            .login-modal input:focus {
                border-color: #c8102e;
            }

            .login-close {
                position: absolute;

                top: 8px;
                right: 10px;

                width: 34px;
                height: 34px;

                border: 0;
                background: transparent;

                font-size: 28px;
                color: #777;
            }
        `;

        document.head.appendChild(style);


        /*
         * Close
         */

        modal.querySelector(
            ".login-close"
        ).addEventListener(
            "click",
            closeLoginModal
        );


        /*
         * Login form
         */

        const form =
            modal.querySelector("#loginForm");

        form.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                const mobile =
                    document.getElementById(
                        "loginMobile"
                    ).value.trim();

                const password =
                    document.getElementById(
                        "loginPassword"
                    ).value.trim();


                if (!/^[0-9]{10}$/.test(mobile)) {

                    showToast(
                        "सही 10 अंकों का मोबाइल नंबर डालें",
                        "warning"
                    );

                    return;
                }


                if (password.length < 4) {

                    showToast(
                        "पासवर्ड सही से दर्ज करें",
                        "warning"
                    );

                    return;
                }


                /*
                 * Demo login
                 */

                localStorage.setItem(
                    "aawaz_logged_in",
                    "true"
                );

                localStorage.setItem(
                    "aawaz_user_mobile",
                    mobile
                );


                closeLoginModal();


                showToast(
                    "लॉगिन सफल हुआ",
                    "success"
                );


                updateLoginButton();

            }
        );

    }


    modal.style.display = "block";

}


function closeLoginModal() {

    const modal =
        document.getElementById(
            "loginModal"
        );

    if (modal) {
        modal.style.display = "none";
    }

}


/*
 * Login button state
 */

function updateLoginButton() {

    const loggedIn =
        localStorage.getItem(
            "aawaz_logged_in"
        ) === "true";


    document.querySelectorAll(
        ".btn-login"
    ).forEach(function (button) {

        if (loggedIn) {

            button.textContent =
                "प्रोफाइल";

        } else {

            button.textContent =
                "लॉगिन";

        }

    });

}


/* =========================================================
   07. SOCIAL SHARING
   ========================================================= */

function initSocialSharing() {

    /*
     * WhatsApp
     */

    document.querySelectorAll(
        ".share-icon.wa"
    ).forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const title =
                    getArticleTitle();

                const url =
                    window.location.href;

                const text =
                    encodeURIComponent(
                        title + "\n" + url
                    );

                window.open(
                    "https://wa.me/?text=" + text,
                    "_blank",
                    "noopener,noreferrer"
                );

            }
        );

    });


    /*
     * Facebook
     */

    document.querySelectorAll(
        ".share-icon.fb"
    ).forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const url =
                    encodeURIComponent(
                        window.location.href
                    );

                window.open(
                    "https://www.facebook.com/sharer/sharer.php?u=" + url,
                    "_blank",
                    "noopener,noreferrer"
                );

            }
        );

    });


    /*
     * X / Twitter
     */

    document.querySelectorAll(
        ".share-icon.tw"
    ).forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const title =
                    getArticleTitle();

                const url =
                    window.location.href;

                const text =
                    encodeURIComponent(
                        title
                    );

                window.open(
                    "https://twitter.com/intent/tweet?text=" +
                    text +
                    "&url=" +
                    encodeURIComponent(url),
                    "_blank",
                    "noopener,noreferrer"
                );

            }
        );

    });


    /*
     * Copy link
     */

    document.querySelectorAll(
        ".copy-link"
    ).forEach(function (button) {

        button.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                copyCurrentLink();

            }
        );

    });

}


function getArticleTitle() {

    const title =
        document.querySelector(
            ".article-main-title"
        );

    if (title) {
        return title.innerText.trim();
    }

    return document.title;
}


function copyCurrentLink() {

    const url =
        window.location.href;


    if (
        navigator.clipboard &&
        navigator.clipboard.writeText
    ) {

        navigator.clipboard.writeText(url)
            .then(function () {

                showToast(
                    "लिंक कॉपी हो गया",
                    "success"
                );

            })
            .catch(function () {

                fallbackCopy(url);

            });

    } else {

        fallbackCopy(url);

    }

}


function fallbackCopy(text) {

    const textarea =
        document.createElement("textarea");

    textarea.value = text;

    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";

    document.body.appendChild(
        textarea
    );

    textarea.select();

    try {

        document.execCommand("copy");

        showToast(
            "लिंक कॉपी हो गया",
            "success"
        );

    } catch (error) {

        showToast(
            "लिंक कॉपी नहीं हो सका",
            "warning"
        );

    }

    document.body.removeChild(
        textarea
    );

}


/* =========================================================
   08. LIVE TV
   ========================================================= */

function initLiveTV() {

    const playButtons =
        document.querySelectorAll(
            ".tv-play-btn"
        );


    playButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const player =
                    button.closest(
                        ".tv-player"
                    );

                if (!player) return;


                /*
                 * If iframe already exists
                 */

                const iframe =
                    player.querySelector(
                        "iframe"
                    );

                if (iframe) {

                    iframe.style.display =
                        "block";

                    button.style.display =
                        "none";

                   return;

                }


                /*
                 * Demo live player
                 */

                const image =
                    player.querySelector(
                        "img"
                    );

                if (image) {
                    image.style.display =
                        "none";
                }


                button.style.display =
                    "none";


                const message =
                    document.createElement(
                        "div"
                    );

                message.style.cssText = `
                    position:absolute;
                    inset:0;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    flex-direction:column;
                    gap:8px;
                    background:#000;
                    color:#fff;
                    text-align:center;
                    padding:20px;
                `;

                message.innerHTML = `
                    <i class="fa-solid fa-tower-broadcast"
                       style="font-size:35px;"></i>

                    <strong>LIVE TV</strong>

                    <span style="font-size:12px;color:#bbb;">
                        Live stream player यहाँ connect होगा।
                    </span>
                `;

                player.appendChild(
                    message
                );


                showToast(
                    "Live TV शुरू हो गया",
                    "success"
                );

            }
        );

    });


    /*
     * LIVE navigation
     */

    document.querySelectorAll(
        "[data-live]"
    ).forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                showScreen("live-screen");
                updateActiveNavigation(
                    "live-screen"
                );

            }
        );

    });

}


/* =========================================================
   09. LIVE BLOG AUTO UPDATE
   ========================================================= */

function initLiveBlog() {

    const updateElements =
        document.querySelectorAll(
            ".auto-update-text"
        );


    if (!updateElements.length) return;


    setInterval(function () {

        const now =
            new Date();


        const time =
            now.toLocaleTimeString(
                "hi-IN",
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            );


        updateElements.forEach(
            function (element) {

                element.innerHTML =
                    '<i class="fa-solid fa-circle"></i> ' +
                    "अपडेटेड " +
                    time;

            }
        );

    }, 60000);

}

initLiveBlog();


/* =========================================================
   10. E-PAPER
   ========================================================= */

function initEPaper() {

    const dateInput =
        document.querySelector(
            ".epaper-date-picker input"
        );


    if (dateInput) {

        /*
         * Set today's date if empty
         */

        if (!dateInput.value) {

            const today =
                new Date();

            dateInput.value =
                today.toISOString()
                    .split("T")[0];

        }


        dateInput.addEventListener(
            "change",
            function () {

                updateEPaperDate(
                    dateInput.value
                );

            }
        );

    }


    /*
     * Print
     */

    document.querySelectorAll(
        "[data-epaper-print], .epaper-print"
    ).forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                printEPaper();

            }
        );

    });


    /*
     * Download
     */

    document.querySelectorAll(
        "[data-epaper-download], .epaper-download"
    ).forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                downloadEPaper();

            }
        );

    });

}


function updateEPaperDate(value) {

    if (!value) return;


    const date =
        new Date(value + "T00:00:00");


    const formatted =
        date.toLocaleDateString(
            "hi-IN",
            {
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );


    document.querySelectorAll(
        ".epaper-current-date"
    ).forEach(function (element) {

        element.textContent =
            formatted;

    });


    showToast(
        "ई-पेपर की तारीख अपडेट हुई",
        "success"
    );

}


function printEPaper() {

    const epaper =
        document.querySelector(
            ".epaper-page-content"
        );


    if (!epaper) {

        window.print();

        return;

    }


    window.print();

}


function downloadEPaper() {

    /*
     * If actual PDF URL exists in HTML
     */

    const downloadButton =
        document.querySelector(
            "[data-pdf-url]"
        );


    if (
        downloadButton &&
        downloadButton.dataset.pdfUrl
    ) {

        const link =
            document.createElement("a");

        link.href =
            downloadButton.dataset.pdfUrl;

        link.download =
            "aawaz-rajasthan-e-paper.pdf";

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        return;

    }


    /*
     * Otherwise print dialog
     */

    showToast(
        "PDF बनाने के लिए Print → Save as PDF चुनें",
        "success"
    );

    setTimeout(function () {

        window.print();

    }, 500);

}


/* =========================================================
   11. FORMS
   ========================================================= */

function initForms() {

    /*
     * Comment form
     */

    const commentForms =
        document.querySelectorAll(
            ".comment-form"
        );


    commentForms.forEach(function (form) {

        form.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                const inputs =
                    form.querySelectorAll(
                        "input, textarea"
                    );


                let valid = true;


                inputs.forEach(function (input) {

                    if (
                        input.hasAttribute(
                            "required"
                        ) &&
                        !input.value.trim()
                    ) {

                        valid = false;

                        input.focus();

                    }

                });


                if (!valid) {

                    showToast(
                        "कृपया सभी जरूरी जानकारी भरें",
                        "warning"
                    );

                    return;

                }


                /*
                 * Demo submission
                 */

                showToast(
                    "आपकी जानकारी सफलतापूर्वक भेज दी गई",
                    "success"
                );


                form.reset();

            }
        );

    });


    /*
     * Generic contact forms
     */

    document.querySelectorAll(
        "form[data-form='contact']"
    ).forEach(function (form) {

        form.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                showToast(
                    "आपका संदेश भेज दिया गया",
                    "success"
                );

                form.reset();

            }
        );

    });

}


/* =========================================================
   12. CATEGORY FILTER BUTTONS
   ========================================================= */

function initCategoryFilters() {

    const buttons =
        document.querySelectorAll(
            ".pill-btn"
        );


    buttons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                buttons.forEach(
                    function (item) {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add(
                    "active"
                );


                const category =
                    button.dataset.category ||
                    button.innerText.trim();


                filterNews(category);

            }
        );

    });

}


function filterNews(category) {

    const cards =
        document.querySelectorAll(
            ".feed-card, .news-card-horizontal"
        );


    if (!cards.length) return;


    const normalized =
        category.toLowerCase();


    cards.forEach(function (card) {

        const text =
            card.innerText.toLowerCase();


        if (
            normalized === "सभी" ||
            normalized === "all" ||
            text.includes(normalized)
        ) {

            card.style.display = "";

        } else {

            /*
             * Keep cards visible in demo mode
             * when category data isn't present.
             */

            card.style.display = "";

        }

    });

}


initCategoryFilters();


/* =========================================================
   13. NEWS CARD CLICK
   ========================================================= */

function initNewsCards() {

    const cards =
        document.querySelectorAll(
            ".news-card-horizontal, " +
            ".feed-card, " +
            ".hero-card"
        );


    cards.forEach(function (card) {

        card.addEventListener(
            "click",
            function (event) {

                /*
                 * Don't interfere with links/buttons
                 */

                if (
                    event.target.closest("a") ||
                    event.target.closest("button")
                ) {
                    return;
                }


                const article =
                    document.getElementById(
                        "article-screen"
                    );


                if (!article) return;


                /*
                 * Copy card title to article
                 */

                const cardTitle =
                    card.querySelector(
                        "h2, h3, h4"
                    );


                const articleTitle =
                    article.querySelector(
                        ".article-main-title"
                    );


                if (
                    cardTitle &&
                    articleTitle
                ) {

                    articleTitle.textContent =
                        cardTitle.textContent;

                }


                showScreen(
                    "article-screen"
                );

                updateActiveNavigation(
                    "article-screen"
                );

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }
        );

    });

}

initNewsCards();


/* =========================================================
   14. TRENDING / RECENT ITEMS
   ========================================================= */

function initSidebarItems() {

    document.querySelectorAll(
        ".recent-list li, .trending-list li"
    ).forEach(function (item) {

        item.addEventListener(
            "click",
            function () {

                const article =
                    document.getElementById(
                        "article-screen"
                    );

                if (!article) return;


                const title =
                    item.querySelector(
                        "p"
                    );


                const articleTitle =
                    article.querySelector(
                        ".article-main-title"
                    );


                if (
                    title &&
                    articleTitle
                ) {

                    articleTitle.textContent =
                        title.textContent;

                }


                showScreen(
                    "article-screen"
                );

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }
        );

    });

}

initSidebarItems();


/* =========================================================
   15. GENERAL BUTTONS
   ========================================================= */

function initGeneralButtons() {

    /*
     * Back buttons
     */

    document.querySelectorAll(
        "[data-back], .btn-back"
    ).forEach(function (button) {

        button.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                showScreen("home-screen");
                updateActiveNavigation(
                    "home-screen"
                );

            }
        );

    });


    /*
     * Share button
     */

    document.querySelectorAll(
        "[data-share]"
    ).forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                shareCurrentPage();

            }
        );

    });


    /*
     * Contact button
     */

    document.querySelectorAll(
        "[data-contact]"
    ).forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                showScreen(
                    "contact-screen"
                );

                updateActiveNavigation(
                    "contact-screen"
                );

            }
        );

    });

}


/* =========================================================
   16. NATIVE SHARE
   ========================================================= */

function shareCurrentPage() {

    const title =
        getArticleTitle();

    const url =
        window.location.href;


    if (navigator.share) {

        navigator.share({

            title: title,

            text: title,

            url: url

        }).catch(function () {
            /*
             * User cancelled share
             */
        });

    } else {

        copyCurrentLink();

    }

}


/* =========================================================
   17. TOAST NOTIFICATION
   ========================================================= */

function showToast(
    message,
    type = "success"
) {

    let container =
        document.getElementById(
            "toastContainer"
        );


    if (!container) {

        container =
            document.createElement("div");

        container.id =
            "toastContainer";


        container.style.cssText = `
            position:fixed;
            right:20px;
            bottom:25px;
            z-index:20000;

            display:flex;
            flex-direction:column;
            gap:8px;

            max-width:calc(100% - 40px);
        `;


        document.body.appendChild(
            container
        );

    }


    const toast =
        document.createElement("div");


    let background =
        "#168a45";


    if (type === "warning") {
        background = "#e49b17";
    }


    if (type === "error") {
        background = "#c8102e";
    }


    toast.style.cssText = `
        padding:11px 15px;

        background:${background};
        color:#fff;

        border-radius:7px;

        box-shadow:0 6px 25px rgba(0,0,0,.2);

        font-size:13px;
        font-weight:700;

        animation:toastIn .25s ease;
    `;


    toast.textContent =
        message;


    container.appendChild(
        toast
    );


    setTimeout(function () {

        toast.style.opacity = "0";

        toast.style.transform =
            "translateY(8px)";

        toast.style.transition =
            ".25s ease";


        setTimeout(function () {

            toast.remove();

        }, 250);

    }, 2800);

}


/* Toast animation */

(function addToastAnimation() {

    const style =
        document.createElement("style");

    style.textContent = `
        @keyframes toastIn {
            from {
                opacity:0;
                transform:translateY(8px);
            }

            to {
                opacity:1;
                transform:translateY(0);
            }
        }

        .search-result-found {
            outline:2px solid rgba(200,16,46,.25);
        }
    `;

    document.head.appendChild(style);

})();


/* =========================================================
   18. MOBILE NAVIGATION
   ========================================================= */

function initMobileNavigation() {

    const mobileNav =
        document.querySelector(
            ".mobile-bottom-nav"
        );


    if (!mobileNav) return;


    const buttons =
        mobileNav.querySelectorAll(
            ".mob-nav-item"
        );


    buttons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                buttons.forEach(
                    function (item) {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add(
                    "active"
                );

            }
        );

    });

}


/* =========================================================
   19. KEYBOARD SHORTCUTS
   ========================================================= */

function initKeyboardShortcuts() {

    document.addEventListener(
        "keydown",
        function (event) {

            /*
             * Escape = close modal
             */

            if (event.key === "Escape") {

                closeLoginModal();

            }


            /*
             * Ctrl + K = Search
             */

            if (
                (event.ctrlKey ||
                 event.metaKey) &&
                event.key.toLowerCase() === "k"
            ) {

                event.preventDefault();

                const search =
                    document.querySelector(
                        ".search-box input"
                    );

                if (search) {
                    search.focus();
                }

            }

        }
    );

}


/* =========================================================
   20. LOGGED-IN STATE
   ========================================================= */

updateLoginButton();


/* =========================================================
   21. BROWSER BACK / FORWARD
   ========================================================= */

window.addEventListener(
    "popstate",
    function () {

        const hash =
            window.location.hash
                .replace("#", "");


        if (
            hash &&
            document.getElementById(hash)
        ) {

            showScreen(hash);

            updateActiveNavigation(
                hash
            );

        } else {

            showScreen(
                "home-screen"
            );

            updateActiveNavigation(
                "home-screen"
            );

        }

    }
);


/* =========================================================
   22. AUTO CURRENT YEAR
   ========================================================= */

document.querySelectorAll(
    "[data-current-year]"
).forEach(function (element) {

    element.textContent =
        new Date().getFullYear();

});


/* =========================================================
   23. PREVENT EMPTY LINKS
   =================================
