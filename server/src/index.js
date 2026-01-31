import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import neighborhoodsRoutes from "./routes/neighborhoods.routes.js";
import authRoutes from "./routes/auth.routes.js";
import petPostsRoutes from "./routes/pet-posts.routes.js";
import petPhotosRoutes from "./routes/pet-photos.routes.js";
import visitRequestsRoutes from "./routes/visit-requests.routes.js";
import usersRoutes from "./routes/users.routes.js";
import favoritesRoutes from "./routes/favorites.routes.js";

dotenv.config();

const app = express();

// Importante quando roda atrás de ALB / proxy (AWS)
app.set("trust proxy", 1);

// Helmet ok, mas desabilitamos CSP aqui porque pode atrapalhar front/preview
// (você pode reativar depois com uma policy bem definida)
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// ✅ CORS configurado (sem achismo)
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:4173", // vite preview
  "http://adotapet-tcc-frontend-prod.s3-website.us-east-2.amazonaws.com",
];

app.use(
  cors({
    origin: (origin, cb) => {
      // Permite chamadas sem Origin (ex.: curl, health checks)
      if (!origin) return cb(null, true);

      // Normaliza removendo barra final
      const normalized = origin.replace(/\/$/, "");

      if (allowedOrigins.includes(normalized)) return cb(null, true);

      return cb(
        new Error(`CORS bloqueado para a origem: ${origin}`)
      );
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false, // seu auth é Bearer token (não cookie), então pode ficar false
    maxAge: 86400,
  })
);

app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (req, res) => {
  res.json({ status: "ok", project: "AdotaPet API" });
});

app.use("/neighborhoods", neighborhoodsRoutes);
app.use("/auth", authRoutes);
app.use("/posts", petPostsRoutes);
app.use("/", petPhotosRoutes);
app.use("/", visitRequestsRoutes);
app.use("/", favoritesRoutes);
app.use(usersRoutes);

// Middleware de erro global
app.use((err, req, res, next) => {
  console.error(err);

  // Erro de CORS (retorna 403 com mensagem clara)
  if (String(err?.message || "").startsWith("CORS bloqueado")) {
    return res.status(403).json({
      error: { message: err.message, code: "CORS_BLOCKED" },
    });
  }

  // Erros conhecidos (multer)
  if (err?.name === "MulterError") {
    return res.status(400).json({
      error: { message: err.message, code: "UPLOAD_ERROR" },
    });
  }

  return res.status(500).json({
    error: { message: "Erro interno do servidor", code: "INTERNAL_ERROR" },
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  // Em AWS o log de localhost é meio enganoso, mas ok
  console.log(`🚀 API AdotaPet rodando na porta ${PORT}`);
});
