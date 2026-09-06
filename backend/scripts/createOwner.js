"use strict";

const dotenv = require("dotenv");
const connectDB = require("../config/db");
const AdminUser = require("../models/AdminUser");

dotenv.config();


// ========================================
// OWNER CONFIGURATION
// ========================================

const OWNER_ADMIN_ID =
    process.env.OWNER_ADMIN_ID || "OWNER-001";

const OWNER_NAME =
    process.env.OWNER_NAME || "Awaaz Rajasthan Owner";

const OWNER_EMAIL =
    process.env.OWNER_EMAIL;

const OWNER_PASSWORD =
    process.env.OWNER_PASSWORD;


// ========================================
// VALIDATION
// ========================================

function validateEnvironment() {
    if (!process.env.MONGODB_URI) {
        throw new Error(
            "MONGODB_URI .env में configured नहीं है।"
        );
    }

    if (!process.env.JWT_SECRET) {
        throw new Error(
            "JWT_SECRET .env में configured नहीं है।"
        );
    }

    if (!OWNER_EMAIL) {
        throw new Error(
            "OWNER_EMAIL .env में configured नहीं है।"
        );
    }

    if (!OWNER_PASSWORD) {
        throw new Error(
            "OWNER_PASSWORD .env में configured नहीं है।"
        );
    }

    if (OWNER_PASSWORD.length < 8) {
        throw new Error(
            "OWNER_PASSWORD कम से कम 8 characters का होना चाहिए।"
        );
    }
}


// ========================================
// CREATE OWNER
// ========================================

async function createOwner() {
    try {
        validateEnvironment();

        console.log("");
        console.log("==========================================");
        console.log("     AAWAAZ RAJASTHAN OWNER SETUP");
        console.log("==========================================");
        console.log("");

        // MongoDB connect
        await connectDB();

        // Existing owner check
        const existingOwner =
            await AdminUser.findOne({
                role: "owner"
            });

        if (existingOwner) {
            console.log(
                "❌ Owner account पहले से मौजूद है।"
            );

            console.log(
                `Owner ID: ${existingOwner.adminId}`
            );

            console.log(
                `Email: ${existingOwner.email}`
            );

            console.log("");
            console.log(
                "नया Owner बनाने की आवश्यकता नहीं है।"
            );

            process.exit(0);
        }


        // Same Admin ID check
        const existingId =
            await AdminUser.findOne({
                adminId: OWNER_ADMIN_ID.toUpperCase()
            });

        if (existingId) {
            throw new Error(
                `Admin ID ${OWNER_ADMIN_ID} पहले से मौजूद है।`
            );
        }


        // Same email check
        const existingEmail =
            await AdminUser.findOne({
                email: OWNER_EMAIL.trim().toLowerCase()
            });

        if (existingEmail) {
            throw new Error(
                `Email ${OWNER_EMAIL} पहले से मौजूद है।`
            );
        }


        // ========================================
        // CREATE OWNER
        // ========================================

        const owner = await AdminUser.create({
            adminId:
                OWNER_ADMIN_ID
                    .trim()
                    .toUpperCase(),

            name:
                OWNER_NAME
                    .trim(),

            email:
                OWNER_EMAIL
                    .trim()
                    .toLowerCase(),

            // AdminUser model का pre-save hook
            // password को automatically hash करेगा
            password:
                OWNER_PASSWORD,

            role: "owner",

            // Owner को permissions की जरूरत नहीं,
            // middleware role देखकर full access देगा
            permissions: [],

            active: true,

            lastLoginAt: null,

            tokenVersion: 0,

            createdBy: null
        });


        // ========================================
        // SUCCESS
        // ========================================

        console.log("");
        console.log("==========================================");
        console.log("       ✅ OWNER CREATED SUCCESSFULLY");
        console.log("==========================================");
        console.log("");

        console.log(
            `👑 Owner ID : ${owner.adminId}`
        );

        console.log(
            `👤 Name     : ${owner.name}`
        );

        console.log(
            `📧 Email    : ${owner.email}`
        );

        console.log(
            `🔐 Role     : ${owner.role}`
        );

        console.log(
            `🟢 Status   : ${
                owner.active
                    ? "Active"
                    : "Inactive"
            }`
        );

        console.log("");

        console.log(
            "अब Owner इस endpoint से login कर सकता है:"
        );

        console.log(
            "POST /api/admin/login"
        );

        console.log("");

        console.log(
            "⚠️ OWNER_PASSWORD को किसी के साथ share न करें।"
        );

        console.log("");

        process.exit(0);

    } catch (error) {

        console.error("");
        console.error(
            "❌ OWNER SETUP FAILED"
        );

        console.error(
            error.message
        );

        console.error("");

        process.exit(1);
    }
}


// ========================================
// RUN
// ========================================

createOwner();
