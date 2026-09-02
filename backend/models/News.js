"use strict";

const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "News title जरूरी है"],
            trim: true,
            minlength: 5,
            maxlength: 250
        },

        slug: {
            type: String,
            unique: true,
            sparse: true,
            trim: true,
            lowercase: true
        },

        summary: {
            type: String,
            trim: true,
            maxlength: 500,
            default: ""
        },

        content: {
            type: String,
            required: [true, "News content जरूरी है"],
            trim: true
        },

        image: {
            type: String,
            default: ""
        },

        category: {
            type: String,
            required: [true, "Category जरूरी है"],
            enum: [
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
            ],
            default: "राजस्थान"
        },

        district: {
            type: String,
            trim: true,
            default: ""
        },

        location: {
            type: String,
            trim: true,
            default: ""
        },

        author: {
            type: String,
            trim: true,
            default: "आवाज राजस्थान ब्यूरो"
        },

        authorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        tags: {
            type: [String],
            default: []
        },

        isBreaking: {
            type: Boolean,
            default: false
        },

        isTrending: {
            type: Boolean,
            default: false
        },

        isFeatured: {
            type: Boolean,
            default: false
        },

        isPublished: {
            type: Boolean,
            default: true
        },

        views: {
            type: Number,
            default: 0,
            min: 0
        },

        publishedAt: {
            type: Date,
            default: Date.now
        },

        scheduledAt: {
            type: Date,
            default: null
        },

        relatedNews: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "News"
            }
        ]
    },
    {
        timestamps: true
    }
);

/* =========================================================
   INDEXES
========================================================= */

newsSchema.index({
    createdAt: -1
});

newsSchema.index({
    category: 1,
    createdAt: -1
});

newsSchema.index({
    district: 1,
    createdAt: -1
});

newsSchema.index({
    isBreaking: 1,
    createdAt: -1
});

newsSchema.index({
    isTrending: 1,
    createdAt: -1
});

newsSchema.index({
    isPublished: 1,
    publishedAt: -1
});

/* =========================================================
   SEARCH INDEX
========================================================= */

newsSchema.index({
    title: "text",
    summary: "text",
    content: "text",
    tags: "text",
    district: "text",
    location: "text"
});

/* =========================================================
   AUTO SLUG
========================================================= */

newsSchema.pre("save", function (next) {
    if (
        this.isModified("title") &&
        (!this.slug || this.slug.trim() === "")
    ) {
        this.slug = this.title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");
    }

    next();
});

/* =========================================================
   CLEAN RESPONSE
========================================================= */

newsSchema.set("toJSON", {
    transform: function (doc, ret) {
        delete ret.__v;
        return ret;
    }
});

module.exports = mongoose.model(
    "News",
    newsSchema
);
