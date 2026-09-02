"use strict";

const Contact = require("../models/Contact");


// ========================================
// CREATE CONTACT MESSAGE
// POST /api/contact
// Public
// ========================================

exports.createContact = async (req, res, next) => {
  try {
    const {
      name,
      email,
      mobile,
      subject,
      message
    } = req.body;

    // Required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "नाम, email और message जरूरी हैं"
      });
    }

    const cleanName = String(name).trim();
    const cleanEmail = String(email).trim().toLowerCase();
    const cleanMobile = String(mobile || "").trim();
    const cleanSubject = String(subject || "").trim();
    const cleanMessage = String(message).trim();

    // Basic validation
    if (cleanName.length < 2) {
      return res.status(400).json({
        success: false,
        message: "नाम सही तरीके से दर्ज करें"
      });
    }

    if (cleanMessage.length < 5) {
      return res.status(400).json({
        success: false,
        message: "Message कम से कम 5 characters का होना चाहिए"
      });
    }

    // Contact save
    const contact = await Contact.create({
      name: cleanName,
      email: cleanEmail,
      mobile: cleanMobile,
      subject: cleanSubject,
      message: cleanMessage,
      status: "new"
    });

    return res.status(201).json({
      success: true,
      message: "आपका संदेश सफलतापूर्वक भेज दिया गया है।",
      contact: {
        id: contact._id,
        name: contact.name,
        email: contact.email,
        subject: contact.subject,
        status: contact.status,
        createdAt: contact.createdAt
      }
    });

  } catch (error) {
    next(error);
  }
};


// ========================================
// GET ALL CONTACT MESSAGES
// GET /api/contact
// Admin Only
// ========================================

exports.getContacts = async (req, res, next) => {
  try {
    const {
      status,
      page = 1,
      limit = 20
    } = req.query;

    const currentPage = Math.max(
      parseInt(page, 10) || 1,
      1
    );

    const perPage = Math.min(
      Math.max(parseInt(limit, 10) || 20, 1),
      100
    );

    const filter = {};

    // Status filter
    if (
      status &&
      ["new", "read", "replied", "closed"].includes(status)
    ) {
      filter.status = status;
    }

    const skip = (currentPage - 1) * perPage;

    const [contacts, total] = await Promise.all([
      Contact.find(filter)
        .sort({
          createdAt: -1
        })
        .skip(skip)
        .limit(perPage)
        .lean(),

      Contact.countDocuments(filter)
    ]);

    return res.status(200).json({
      success: true,
      count: contacts.length,
      total,
      page: currentPage,
      limit: perPage,
      totalPages: Math.ceil(total / perPage),
      contacts
    });

  } catch (error) {
    next(error);
  }
};


// ========================================
// GET SINGLE CONTACT
// GET /api/contact/:id
// Admin Only
// ========================================

exports.getContactById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findById(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact message नहीं मिला"
      });
    }

    // अगर पहली बार खोला गया है तो read करें
    if (contact.status === "new") {
      contact.status = "read";
      await contact.save();
    }

    return res.status(200).json({
      success: true,
      contact
    });

  } catch (error) {
    next(error);
  }
};


// ========================================
// UPDATE CONTACT STATUS
// PATCH /api/contact/:id
// Admin Only
// ========================================

exports.updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;

    const {
      status,
      reply
    } = req.body;

    const contact = await Contact.findById(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact message नहीं मिला"
      });
    }

    // Status validation
    if (
      status !== undefined &&
      !["new", "read", "replied", "closed"].includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid contact status"
      });
    }

    if (status !== undefined) {
      contact.status = status;
    }

    // Reply
    if (reply !== undefined) {
      contact.reply = String(reply).trim();

      if (contact.reply) {
        contact.status = "replied";
        contact.repliedAt = new Date();
      }
    }

    await contact.save();

    return res.status(200).json({
      success: true,
      message: "Contact message successfully update हुआ",
      contact
    });

  } catch (error) {
    next(error);
  }
};


// ========================================
// DELETE CONTACT
// DELETE /api/contact/:id
// Admin Only
// ========================================

exports.deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findById(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact message नहीं मिला"
      });
    }

    await Contact.deleteOne({
      _id: id
    });

    return res.status(200).json({
      success: true,
      message: "Contact message delete हो गया"
    });

  } catch (error) {
    next(error);
  }
};
