"use strict";

const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "नाम जरूरी है"],
            trim: true,
            minlength: 2,
            maxlength: 100
        },

        email: {
            type: String,
            required: [true, "Email जरूरी है"],
            lowercase: true,
            trim: true,
            match: [
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                "Valid email address डालें"
            ]
        },

        mobile: {
            type: String,
            trim: true,
            default: "",
            match: [
                /^(\+91[\s-]?)?[6-9]\d{9}$/,
                "Valid mobile number डालें"
            ]
        },

        subject: {
            type: String,
            trim: true,
            maxlength: 200,
            default: ""
        },

        message: {
            type: String,
            required: [true, "Message जरूरी है"],
            trim: true,
            minlength: 5,
            maxlength: 3000
        },

        status: {
            type: String,
            enum: [
                "new",
                "read",
                "replied",
                "closed"
            ],
            default: "new"
        },

        reply: {
            type: String,
            trim: true,
            default: ""
        },

        repliedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

/* =========================================================
   INDEXES
========================================================= */

contactSchema.index({
    createdAt: -1
});

contactSchema.index({
    status: 1,
    createdAt: -1
});

contactSchema.index({
    email: 1
});

/* =========================================================
   CLEAN RESPONSE
========================================================= */

contactSchema.set("toJSON", {
    transform: function (doc, ret) {
        delete ret.__v;
        return ret;
    }
});

module.exports = mongoose.model(
    "Contact",
    contactSchema
);
