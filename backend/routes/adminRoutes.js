"use strict";

const express = require("express");

const {
  login,
  me,
  logout,
  changePassword,
  logoutAllSessions
} = require("../controllers/adminAuthController");

const {
  getAdmins,
  getAdmin,
  createAdmin,
  updateAdmin,
  updatePermissions,
  activateAdmin,
  deactivateAdmin,
  resetAdminPassword,
  deleteAdmin,
  getPermissions
} = require("../controllers/adminController");

const {
  adminProtect,
  ownerOnly
} = require("../middleware/adminMiddleware");

const router = express.Router();


// ========================================
// ADMIN / OWNER AUTHENTICATION
// ========================================

// Admin / Owner Login
// POST /api/admin/login
router.post("/login", login);


// Current Admin / Owner
// GET /api/admin/me
router.get("/me", adminProtect, me);


// Logout
// POST /api/admin/logout
router.post("/logout", adminProtect, logout);


// Change own password
// POST /api/admin/change-password
router.post(
  "/change-password",
  adminProtect,
  changePassword
);


// Logout all sessions
// POST /api/admin/logout-all
router.post(
  "/logout-all",
  adminProtect,
  logoutAllSessions
);



// ========================================
// ADMIN MANAGEMENT
// OWNER ONLY
// ========================================

// Get all Admins
// GET /api/admin/admins
router.get(
  "/admins",
  adminProtect,
  ownerOnly,
  getAdmins
);


// Get available permissions
// GET /api/admin/permissions
router.get(
  "/permissions",
  adminProtect,
  ownerOnly,
  getPermissions
);


// Get single Admin
// GET /api/admin/admins/:id
router.get(
  "/admins/:id",
  adminProtect,
  ownerOnly,
  getAdmin
);


// Create new Admin
// POST /api/admin/admins
router.post(
  "/admins",
  adminProtect,
  ownerOnly,
  createAdmin
);


// Update Admin
// PUT /api/admin/admins/:id
router.put(
  "/admins/:id",
  adminProtect,
  ownerOnly,
  updateAdmin
);


// Update Admin permissions
// PUT /api/admin/admins/:id/permissions
router.put(
  "/admins/:id/permissions",
  adminProtect,
  ownerOnly,
  updatePermissions
);


// Activate Admin
// PATCH /api/admin/admins/:id/activate
router.patch(
  "/admins/:id/activate",
  adminProtect,
  ownerOnly,
  activateAdmin
);


// Deactivate Admin
// PATCH /api/admin/admins/:id/deactivate
router.patch(
  "/admins/:id/deactivate",
  adminProtect,
  ownerOnly,
  deactivateAdmin
);


// Reset Admin password
// PUT /api/admin/admins/:id/password
router.put(
  "/admins/:id/password",
  adminProtect,
  ownerOnly,
  resetAdminPassword
);


// Delete Admin
// DELETE /api/admin/admins/:id
router.delete(
  "/admins/:id",
  adminProtect,
  ownerOnly,
  deleteAdmin
);


module.exports = router;
