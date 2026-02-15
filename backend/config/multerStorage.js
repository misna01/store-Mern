import multer from "multer";

// Store uploaded file in memory (we'll upload it to Cloudinary later)
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

export default upload;
