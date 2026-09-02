"use strict";

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name जरूरी है"],
            trim: true,
            minlength: 2,
            maxlength: 100
        },

        email: {
            type: String,
            required: [true, "Email जरूरी है"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                "Valid email address डालें"
            ]
        },

        password: {
            type: String,
            required: [true, "Password जरूरी है"],
            minlength: 6,
            select: false
        },

        role: {
            type: String,
            enum: [
                "admin",
                "editor",
                "reporter"
            ],
            default: "reporter"
        },

        avatar: {
            type: String,
            default: ""
        },

        phone: {
            type: String,
            trim: true,
            default: ""
        },

        isActive: {
            type: Boolean,
            default: true
        },

        lastLogin: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

/* =========================================================
   PASSWORD HASH
========================================================= */

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(12);

        this.password = await bcrypt.hash(
            this.password,
            salt
        );

        next();
    } catch (error) {
        next(error);
    }
});

/* =========================================================
   PASSWORD CHECK
========================================================= */

userSchema.methods.comparePassword = async function (
    enteredPassword
) {
    return bcrypt.compare(
        enteredPassword,
        this.password
    );
};

/* =========================================================
   HIDE SENSITIVE DATA
========================================================= */

userSchema.set("toJSON", {
    transform: function (doc, ret) {
        delete ret.password;
        delete ret.__v;

        return ret;
    }
});

module.exports = mongoose.model(
    "User",
    userSchema
);
