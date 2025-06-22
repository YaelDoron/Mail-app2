const multer = require("multer");
const path = require("path");

// Define custom storage configuration for uploaded files
const storage = multer.diskStorage({
  // Set the destination folder for storing uploaded files
  destination: (req, file, cb) => {
    cb(null, "uploads/"); 
  },
  // Customize the filename to avoid name collisions
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${Date.now()}${ext}`);
  },
});
// Create the multer middleware using the storage configuration
const upload = multer({ storage });

module.exports = upload;
