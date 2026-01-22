import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import neighborhoodsRoutes from "./routes/neighborhoods.routes.js";
import authRoutes from "./routes/auth.routes.js";
import meRoutes from "./routes/me.routes.js";
import petPostsRoutes from "./routes/pet-posts.routes.js";
import petPhotosRoutes from "./routes/pet-photos.routes.js";

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (req, res) => {
  res.json({ status: "ok", project: "AdotaPet API" });
});

app.use("/neighborhoods", neighborhoodsRoutes);
app.use("/auth", authRoutes);
app.use("/me", meRoutes);
app.use("/posts", petPostsRoutes);
app.use("/", petPhotosRoutes);

// Middleware de erro global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Erro interno do servidor" });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 API AdotaPet rodando em http://localhost:${PORT}`);
});
