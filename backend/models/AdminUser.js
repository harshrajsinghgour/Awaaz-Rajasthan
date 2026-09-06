"use strict";

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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

const adminUserSchema = new mongoose.Schema(
  {
    // ==============================
    // ADMIN ID
    // Example:
    // OWNER-001
    // ADM-001
    // ==============================
    adminId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      minlength: 3,
      maxlength: 30
    },

    // ==============================
    // NAME
    // ==============================
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80
    },

    // ==============================
    // EMAIL
    // ==============================
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 150
    },

    // ==============================
    // PASSWORD
    // Password database me plain text
    // me kabhi store nahi hoga
    // ==============================
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false
    },

    // ==============================
    // ROLE
    // OWNER = Full Control
    // ADMIN = Permission Based Control
    // ==============================
    role: {
      type: String,
      enum: ["owner", "admin"],
      default: "admin",
      required: true
    },

    // ==============================
    // ADMIN PERMISSIONS
    // Owner ko backend me automatically
    // full access diya ja sakta hai.
    // ==============================
    permissions: {
      type: [
        {
          type: String,
          enum: ADMIN_PERMISSIONS
        }
      ],
      default: []
    },

    // ==============================
    // ACCOUNT STATUS
    // ==============================
    active: {
      type: Boolean,
      default: true
    },

    // ==============================
    // LAST LOGIN
    // ==============================
    lastLoginAt: {
      type: Date,
      default: null
    },

    // ==============================
    // PASSWORD CHANGED DATE
    // ==============================
    passwordChangedAt: {
      type: Date,
      default: null
    },

    // ==============================
    // TOKEN VERSION
    // Admin ko logout-all / force logout
    // karne ke liye useful
    // ==============================
    tokenVersion: {
      type: Number,
      default: 0
    },

    // ==============================
    // ACCOUNT CREATED BY
    // Owner ke liye null ho sakta hai.
    // Admin ko Owner create karega.
    // ==============================
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdminUser",
      default: null
    }
  },
  {
    timestamps: true
  }
);


// ========================================
// PASSWORD HASHING
// ========================================

adminUserSchema.pre("save", async function (next) {
  try {
    // Password change nahi hua to dobara hash mat karo
    if (!this.isModified("password")) {
      return next();
    }

    this.password = await bcrypt.hash(this.password, 12);

    this.passwordChangedAt = new Date();

    next();
  } catch (error) {
    next(error);
  }
});


// ========================================
// PASSWORD COMPARE
// ========================================

adminUserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};


// ========================================
// PERMISSION CHECK
// ========================================

adminUserSchema.methods.hasPermission = function (permission) {
  // Owner ko complete access
  if (this.role === "owner") {
    return true;
  }

  return this.permissions.includes(permission);
};


// ========================================
// SAFE JSON RESPONSE
// Password kabhi response me nahi jayega
// ========================================

adminUserSchema.methods.toJSON = function () {
  const user = this.toObject();

  delete user.password;
  delete user.tokenVersion;

  return user;
};


// ========================================
// INDEXES
// ========================================

adminUserSchema.index({ adminId: 1 }, { unique: true });
adminUserSchema.index({ email: 1 }, { unique: true });
adminUserSchema.index({ role: 1 });
adminUserSchema.index({ active: 1 });


module.exports = mongoose.model("AdminUser", adminUserSchema);

// Permissions ko doosri files me use karne ke liye export
module.exports.ADMIN_PERMISSIONS = ADMIN_PERMISSIONS;
