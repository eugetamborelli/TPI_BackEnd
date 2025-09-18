
import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import healthRoutes from "./modules/health/health.routes.js";
import tareasRoutes from "./modules/tareas/tareas.routes.js";
import medicosRoutes from "./modules/medicos/medicos.router.js";

//>>>>>>> 0cd9857 (cambios en rutas que estaban mal enlazadas.)

const app = express();
const path = require('path');

app.use(cors());
app.use(express.json());

// Rutas

app.use("/api", routes);
//=======
app.use("/health", healthRoutes);
//<<<<<<< HEAD
app.use("tareas", tareasRoutes)
//>>>>>>> 4baf3c5 (add tarea module)
//=======
app.use("/tareas", tareasRoutes)
//>>>>>>> f238f4a (limpiando el codigo)

export default app;
