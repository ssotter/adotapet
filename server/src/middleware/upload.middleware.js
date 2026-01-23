import multer from "multer";

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const ok = file.mimetype?.startsWith("image/");
    if (!ok) return cb(new Error("Apenas imagens são permitidas"));
    cb(null, true);
  },
});
