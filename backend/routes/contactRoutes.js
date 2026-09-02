"use strict";

const express = require("express");

const {
  createContact,
  getContacts,
  getContactById,
  updateContact,
  deleteContact
} = require("../controllers/contactController");

const {
  protect,
  authorize
} = require("../middleware/authMiddleware");

const router = express.Router();


// ========================================
// PUBLIC ROUTE
// ========================================

// Contact Form Submit
// POST /api/contact
router.post(
  "/",
  createContact
);


// ========================================
// ADMIN ROUTES
// ========================================

// सभी Contact Messages
// GET /api/contact
router.get(
  "/",
  protect,
  authorize("admin"),
  getContacts
);


// Single Contact Message
// GET /api/contact/:id
router.get(
  "/:id",
  protect,
  authorize("admin"),
  getContactById
);


// Contact Status / Reply Update
// PATCH /api/contact/:id
router.patch(
  "/:id",
  protect,
  authorize("admin"),
  updateContact
);


// Contact Delete
// DELETE /api/contact/:id
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteContact
);


module.exports = router;
