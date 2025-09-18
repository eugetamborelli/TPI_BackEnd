
import express from "express";
import cors from "cors";

import routes from "./routes/index.js";

import healthRoutes from "./modules/health/health.routes.js";
import tareasRoutes from "./modules/tareas/tareas.routes.js";
import medicosRoutes from "./routes/medicos.router.js";


const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api", routes);
app.use("/health", healthRoutes);
app.use("/tareas", tareasRoutes)
app.use("/api/medicos", medicosRoutes);

export default app;
