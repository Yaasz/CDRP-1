const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure temporary uploads directory exists
// Files will be temporarily stored here before being uploaded to Cloudinary
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage - this is only temporary storage
// All files will be uploaded to Cloudinary and then deleted from local storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Temporary local storage before Cloudinary upload
  },
  filename: (req, file, cb) => {
    // Create a unique filename for temporary storage
    const cleanFileName = file.originalname.replace(/[^a-zA-Z0-9.]/g, "_");
    cb(null, `${Date.now()}_${cleanFileName}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB file size limit
  },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|mp4|mov|avi/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(
        new Error(
          "Only images and videos (jpeg, jpg, png, mp4, mov, avi) are allowed!"
        )
      );
    }
  },
});

module.exports = upload;
