"use strict";

const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const AdminUser = require("../models/AdminUser");


// ========================================
// AVAILABLE PERMISSIONS
// ========================================

const PERMISSIONS = [
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


// ========================================
// HELPER
// ========================================

function cleanPermissions(permissions) {
  if (!Array.isArray(permissions)) {
    return [];
  }

  return [
    ...new Set(
      permissions.filter((permission) =>
        PERMISSIONS.includes(permission)
      )
    )
  ];
}


function publicAdmin(admin) {
  return {
    id: admin._id,
    adminId: admin.adminId,
    name: admin.name,
    email: admin.email,
    role: admin.role,
    permissions:
      admin.role === "owner"
        ? ["*"]
        : admin.permissions || [],
    active: admin.active,
    lastLoginAt: admin.lastLoginAt,
    createdAt: admin.createdAt,
    updatedAt: admin.updatedAt
  };
}


// ========================================
// GET ALL ADMINS
// GET /api/admin/admins
// OWNER ONLY
// ========================================

exports.getAdmins = async (req, res, next) => {
  try {
    const admins = await AdminUser.find({
      role: "admin"
    })
      .select("-password -tokenVersion")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: admins.length,
      admins: admins.map(publicAdmin)
    });
  } catch (error) {
    next(error);
  }
};


// ========================================
// GET SINGLE ADMIN
// GET /api/admin/admins/:id
// OWNER ONLY
// ========================================

exports.getAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid admin ID"
      });
    }

    const admin = await AdminUser.findOne({
      _id: id,
      role: "admin"
    }).select("-password -tokenVersion");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found"
      });
    }

    return res.json({
      success: true,
      admin: publicAdmin(admin)
    });
  } catch (error) {
    next(error);
  }
};


// ========================================
// CREATE ADMIN
// POST /api/admin/admins
// OWNER ONLY
// ========================================

exports.createAdmin = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      permissions
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email and password are required"
      });
    }

    const cleanName = String(name).trim();
    const cleanEmail = String(email).trim().toLowerCase();
    const cleanPassword = String(password);

    if (cleanName.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Name must be at least 2 characters"
      });
    }

    if (cleanPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message:
          "Admin password must be at least 8 characters"
      });
    }

    // Email duplicate check
    const existingEmail = await AdminUser.findOne({
      email: cleanEmail
    });

    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: "An admin with this email already exists"
      });
    }

    // Admin ID generate
    const adminId = await generateAdminId();

    const admin = await AdminUser.create({
      adminId,
      name: cleanName,
      email: cleanEmail,
      password: cleanPassword,
      role: "admin",
      permissions: cleanPermissions(permissions),
      active: true,
      createdBy: req.admin._id
    });

    return res.status(201).json({
      success: true,
      message: "Admin created successfully",
      admin: publicAdmin(admin)
    });
  } catch (error) {
    // Duplicate key race condition
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "Admin ID or email already exists"
      });
    }

    next(error);
  }
};


// ========================================
// GENERATE ADMIN ID
// Example: ADM-001
// ========================================

async function generateAdminId() {
  for (let attempt = 0; attempt < 10; attempt++) {
    const count = await AdminUser.countDocuments({
      role: "admin"
    });

    const number =
      count + 1 + attempt;

    const adminId =
      `ADM-${String(number).padStart(3, "0")}`;

    const exists = await AdminUser.exists({
      adminId
    });

    if (!exists) {
      return adminId;
    }
  }

  // Fallback
  return `ADM-${Date.now()}`;
}


// ========================================
// UPDATE ADMIN
// PUT /api/admin/admins/:id
// OWNER ONLY
// ========================================

exports.updateAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid admin ID"
      });
    }

    const admin = await AdminUser.findOne({
      _id: id,
      role: "admin"
    }).select("+password");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found"
      });
    }

    const {
      name,
      email,
      permissions,
      active
    } = req.body;

    // Name
    if (name !== undefined) {
      const cleanName = String(name).trim();

      if (cleanName.length < 2) {
        return res.status(400).json({
          success: false,
          message: "Name must be at least 2 characters"
        });
      }

      admin.name = cleanName;
    }

    // Email
    if (email !== undefined) {
      const cleanEmail =
        String(email).trim().toLowerCase();

      const emailExists = await AdminUser.findOne({
        email: cleanEmail,
        _id: { $ne: admin._id }
      });

      if (emailExists) {
        return res.status(409).json({
          success: false,
          message:
            "Another admin already uses this email"
        });
      }

      admin.email = cleanEmail;
    }

    // Permissions
    if (permissions !== undefined) {
      admin.permissions =
        cleanPermissions(permissions);
    }

    // Active / inactive
    if (active !== undefined) {
      admin.active = Boolean(active);

      // Account deactivate होने पर
      // पुराने tokens invalidate
      if (!admin.active) {
        admin.tokenVersion += 1;
      }
    }

    await admin.save();

    return res.json({
      success: true,
      message: "Admin updated successfully",
      admin: publicAdmin(admin)
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email already exists"
      });
    }

    next(error);
  }
};


// ========================================
// UPDATE ADMIN PERMISSIONS
// PUT /api/admin/admins/:id/permissions
// OWNER ONLY
// ========================================

exports.updatePermissions = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { permissions } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid admin ID"
      });
    }

    if (!Array.isArray(permissions)) {
      return res.status(400).json({
        success: false,
        message: "Permissions must be an array"
      });
    }

    const admin = await AdminUser.findOne({
      _id: id,
      role: "admin"
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found"
      });
    }

    admin.permissions =
      cleanPermissions(permissions);

    await admin.save();

    return res.json({
      success: true,
      message:
        "Admin permissions updated successfully",
      admin: publicAdmin(admin)
    });
  } catch (error) {
    next(error);
  }
};


// ========================================
// ACTIVATE ADMIN
// PATCH /api/admin/admins/:id/activate
// OWNER ONLY
// ========================================

exports.activateAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid admin ID"
      });
    }

    const admin = await AdminUser.findOne({
      _id: id,
      role: "admin"
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found"
      });
    }

    admin.active = true;

    await admin.save();

    return res.json({
      success: true,
      message: "Admin activated successfully",
      admin: publicAdmin(admin)
    });
  } catch (error) {
    next(error);
  }
};


// ========================================
// DEACTIVATE ADMIN
// PATCH /api/admin/admins/:id/deactivate
// OWNER ONLY
// ========================================

exports.deactivateAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid admin ID"
      });
    }

    const admin = await AdminUser.findOne({
      _id: id,
      role: "admin"
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found"
      });
    }

    admin.active = false;

    // सभी पुराने sessions invalidate
    admin.tokenVersion += 1;

    await admin.save();

    return res.json({
      success: true,
      message: "Admin deactivated successfully",
      admin: publicAdmin(admin)
    });
  } catch (error) {
    next(error);
  }
};


// ========================================
// RESET ADMIN PASSWORD
// PUT /api/admin/admins/:id/password
// OWNER ONLY
// ========================================

exports.resetAdminPassword = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid admin ID"
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "New password is required"
      });
    }

    const newPassword = String(password);

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 8 characters"
      });
    }

    const admin = await AdminUser.findOne({
      _id: id,
      role: "admin"
    }).select("+password");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found"
      });
    }

    // Model pre-save hook password hash करेगा
    admin.password = newPassword;

    // पुराने sessions invalidate
    admin.tokenVersion += 1;

    await admin.save();

    return res.json({
      success: true,
      message:
        "Admin password reset successfully"
    });
  } catch (error) {
    next(error);
  }
};


// ========================================
// DELETE ADMIN
// DELETE /api/admin/admins/:id
// OWNER ONLY
// ========================================

exports.deleteAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid admin ID"
      });
    }

    const admin = await AdminUser.findOne({
      _id: id,
      role: "admin"
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found"
      });
    }

    // Safety check:
    // Owner account कभी delete नहीं होगा
    if (admin.role === "owner") {
      return res.status(403).json({
        success: false,
        message: "Owner account cannot be deleted"
      });
    }

    await AdminUser.deleteOne({
      _id: admin._id
    });

    return res.json({
      success: true,
      message: "Admin deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};


// ========================================
// GET AVAILABLE PERMISSIONS
// GET /api/admin/permissions
// OWNER ONLY
// ========================================

exports.getPermissions = async (
  req,
  res,
  next
) => {
  try {
    return res.json({
      success: true,
      permissions: PERMISSIONS
    });
  } catch (error) {
    next(error);
  }
};


// ========================================
// EXPORT PERMISSIONS
// ========================================

exports.PERMISSIONS = PERMISSIONS;
