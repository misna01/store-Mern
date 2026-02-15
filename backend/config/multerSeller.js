// import multer from "multer";

// const storage = multer.memoryStorage();

// export const uploadSellerDocs = multer({ storage }).fields([
//   { name: "panCard", maxCount: 1 },
//   { name: "gstCertificate", maxCount: 1 },
//   { name: "brandCertificate", maxCount: 1 },
//   { name: "addressProof", maxCount: 1 }
// ]);
import multer from "multer";

const storage = multer.memoryStorage();

export const uploadSellerDocs = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }
}).fields([
  { name: "panCard", maxCount: 1 },
  { name: "gstCertificate", maxCount: 1 },
  { name: "brandCertificate", maxCount: 1 },
  { name: "addressProof", maxCount: 1 }
]);
