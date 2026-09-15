"use strict";

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");
const fs = require("fs");

const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Connect MongoDB
connectDB();

const app = express();

/* =========================================================
   BASIC CONFIG
========================================================= */

const PORT = process.env.PORT || 5000;

const FRONTEND_URL = process.env.FRONTEND_URL || "*";

/* =========================================================
   REQUIRED FOLDERS
========================================================= */

const uploadsPath = path.join(__dirname, "uploads");
const epaperPath = path.join(__dirname, "epapers");

if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
}

if (!fs.existsSync(epaperPath)) {
    fs.mkdirSync(epaperPath, { recursive: true });
}

/* =========================================================
   SECURITY
========================================================= */

app.disable("x-powered-by");

app.use(
    helmet({
        crossOriginResourcePolicy: {
            policy: "cross-origin"
        }
    })
);

/* =========================================================
   CORS
========================================================= */

app.use(
    cors({
        origin: FRONTEND_URL,
        credentials: true,
        methods: [
            "GET",
            "POST",
            "PUT",
            "PATCH",
            "DELETE",
            "OPTIONS"
        ],
        allowedHeaders: [
            "Content-Type",
            "Authorization"
        ]
    })
);

/* =========================================================
   RATE LIMIT
========================================================= */

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message:
            "बहुत अधिक requests भेजी गई हैं। कृपया कुछ देर बाद प्रयास करें।"
    }
});

app.use("/api", apiLimiter);

/* =========================================================
   BODY PARSER
========================================================= */

app.use(
    express.json({
        limit: "2mb"
    })
);

app.use(
    express.urlencoded({
        extended: true,
        limit: "2mb"
    })
);

/* =========================================================
   STATIC FILES
========================================================= */

// News images
app.use(
    "/uploads",
    express.static(uploadsPath)
);

// E-paper files
app.use(
    "/epapers",
    express.static(epaperPath)
);

/* =========================================================
   HEALTH CHECK
========================================================= */

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "आवाज राजस्थान Backend API चल रहा है",
        name: "Awaaz Rajasthan",
        version: "1.0.0",
        status: "online"
    });
});

app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "API is healthy",
        service: "Awaaz Rajasthan Backend",
        timestamp: new Date().toISOString()
    });
});

/* =========================================================
   API ROUTES
========================================================= */

/* ========================================================
   PUBLIC AUTHENTICATION
======================================================== */

app.use(
    "/api/auth",
    require("./routes/authRoutes")
);


/* ========================================================
   ADMIN / OWNER AUTHENTICATION & MANAGEMENT
======================================================== */

// अलग AdminUser system
//
// Login:
// POST /api/admin/login
//
// Current admin:
// GET /api/admin/me
//
// Admin management:
// /api/admin/admins
//
// Owner और Admin permissions backend पर
// adminMiddleware.js द्वारा verify होंगी.

const adminRoutesPath = path.join(
    __dirname,
    "routes",
    "adminRoutes.js"
);

if (fs.existsSync(adminRoutesPath)) {
    app.use(
        "/api/admin",
        require("./routes/adminRoutes")
    );
}


/* ========================================================
   OWNER AD SETTINGS
======================================================== */

// Owner-only Ad Settings
//
// GET:
// /api/admin/ad-settings
//
// PUT:
// /api/admin/ad-settings
//
// Security:
// adminProtect + ownerOnly
//
// Normal Admin:
// ❌ Access denied
//
// Public:
// ❌ Access denied

const adSettingsRoutesPath = path.join(
    __dirname,
    "routes",
    "adSettingsRoutes.js"
);

if (fs.existsSync(adSettingsRoutesPath)) {
    app.use(
        "/api/admin/ad-settings",
        require("./routes/adSettingsRoutes")
    );
}


/* ========================================================
   NEWS
======================================================== */

app.use(
    "/api/news",
    require("./routes/newsRoutes")
);


/* ========================================================
   CONTACT
======================================================== */

// अगर contactRoutes.js मौजूद है तो इसे use किया जाएगा

const contactRoutesPath = path.join(
    __dirname,
    "routes",
    "contactRoutes.js"
);

if (fs.existsSync(contactRoutesPath)) {
    app.use(
        "/api/contact",
        require("./routes/contactRoutes")
    );
}


/* ========================================================
   SITE FEATURES
======================================================== */

// Live TV, Live Blog और E-paper जैसी
// frontend/site services के लिए route support

const siteRoutesPath = path.join(
    __dirname,
    "routes",
    "siteRoutes.js"
);

if (fs.existsSync(siteRoutesPath)) {
    app.use(
        "/api/site",
        require("./routes/siteRoutes")
    );
}


/* ========================================================
   PUBLIC ADVERTISEMENT SYSTEM
======================================================== */

// Public Advertisement API
//
// GET:
// /api/ads
//
// Optional:
//
// /api/ads?position=home_top
// /api/ads?position=sidebar
// /api/ads?device=mobile
// /api/ads?device=desktop
//
// Impression:
//
// POST /api/ads/:id/impression
//
// Click:
//
// POST /api/ads/:id/click
//
// IMPORTANT:
//
// Public users can ONLY:
// - View active ads
// - Record impressions
// - Record clicks
//
// Public users CANNOT:
// - Create ads
// - Update ads
// - Toggle ads
// - Delete ads
//
// Owner-only Ad Management:
//
// /api/admin/ads
//
// Owner-only Ad Settings:
//
// /api/admin/ad-settings

const adRoutesPath = path.join(
    __dirname,
    "routes",
    "adRoutes.js"
);

if (fs.existsSync(adRoutesPath)) {
    app.use(
        "/api/ads",
        require("./routes/adRoutes")
    );
}


/* =========================================================
   404 HANDLER
========================================================= */

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "API route नहीं मिला",
        path: req.originalUrl
    });
});


/* =========================================================
   GLOBAL ERROR HANDLER
========================================================= */

app.use((err, req, res, next) => {
    console.error("SERVER ERROR:", err);

    // Multer file upload error
    if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
            success: false,
            message: "File बहुत बड़ी है।"
        });
    }

    // Validation error
    if (err.name === "ValidationError") {
        return res.status(400).json({
            success: false,
            message: "Invalid data",
            errors: Object.values(err.errors).map(
                (error) => error.message
            )
        });
    }

    // MongoDB invalid ObjectId
    if (err.name === "CastError") {
        return res.status(400).json({
            success: false,
            message: "Invalid ID"
        });
    }

    res.status(err.status || 500).json({
        success: false,
        message:
            err.message ||
            "Internal Server Error"
    });
});


/* =========================================================
   START SERVER
========================================================= */

const server = app.listen(PORT, () => {
    console.log("");
    console.log("==========================================");
    console.log("       आवाज राजस्थान BACKEND");
    console.log("==========================================");

    console.log(
        `🚀 Server: http://localhost:${PORT}`
    );

    console.log(
        `📰 News API: http://localhost:${PORT}/api/news`
    );

    console.log(
        `🔐 Auth API: http://localhost:${PORT}/api/auth`
    );

    console.log(
        `👑 Admin API: http://localhost:${PORT}/api/admin`
    );

    console.log(
        `📢 Public Ads API: http://localhost:${PORT}/api/ads`
    );

    console.log(
        `👑 Owner Ads API: http://localhost:${PORT}/api/admin/ads`
    );

    console.log(
        `⚙️ Owner Ad Settings: http://localhost:${PORT}/api/admin/ad-settings`
    );

    console.log(
        `❤️ Health: http://localhost:${PORT}/api/health`
    );

    console.log("==========================================");
    console.log("");
});


/* =========================================================
   SERVER ERROR HANDLING
========================================================= */

server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
        console.error(
            `❌ Port ${PORT} पहले से इस्तेमाल हो रहा है।`
        );
    } else {
        console.error(
            "❌ Server Error:",
            error
        );
    }

    process.exit(1);
});


/* =========================================================
   GRACEFUL SHUTDOWN
========================================================= */

const shutdown = (signal) => {
    console.log(`\n${signal} received.`);

    server.close(() => {
        console.log("HTTP server बंद हो गया।");
        process.exit(0);
    });
};

process.on("SIGINT", () => {
    shutdown("SIGINT");
});

process.on("SIGTERM", () => {
    shutdown("SIGTERM");
});


/* =========================================================
   EXPORT APP
========================================================= */

module.exports = app;
