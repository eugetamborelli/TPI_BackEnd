import express from "express";
import cors from "cors";
import healthRoutes from "./modules/health/health.routes.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use("/health", healthRoutes);
app.use("/tareas", tareasRoutes)

export default app;
