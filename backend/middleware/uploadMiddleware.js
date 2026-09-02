"use strict";

const multer = require("multer");
const path = require("path");
const fs = require("fs");


// ========================================
// UPLOAD DIRECTORY
// ========================================

const uploadDir = path.join(__dirname, "..", "uploads");

// Folder मौजूद नहीं है तो बना दें
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {
    recursive: true
  });
}


// ========================================
// STORAGE
// ========================================

const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {

    const extension = path.extname(file.originalname)
      .toLowerCase();

    const uniqueName =
      `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;

    cb(null, uniqueName);
  }

});


// ========================================
// FILE FILTER
// ========================================

const fileFilter = (req, file, cb) => {

  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/jpg"
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "केवल JPG, JPEG, PNG और WEBP images upload की जा सकती हैं।"
      ),
      false
    );
  }
};


// ========================================
// MULTER CONFIGURATION
// ========================================

const upload = multer({

  storage,

  fileFilter,

  limits: {
    // Maximum image size = 5 MB
    fileSize: 5 * 1024 * 1024,

    // एक request में maximum 1 file
    files: 1
  }

});


// ========================================
// EXPORT
// ========================================

module.exports = upload;
