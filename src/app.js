
import express from "express";
import cors from "cors";
<<<<<<< HEAD

=======
//<<<<<<< HEAD
>>>>>>> 8f92813 (add tarea module)
import routes from "./routes/index.js";
//=======
import healthRoutes from "./modules/health/health.routes.js";
import tareasRoutes from "./modules/tareas/tareas.routes.js";
//>>>>>>> 4baf3c5 (add tarea module)

import healthRoutes from "./modules/health/health.routes.js";
import tareasRoutes from "./modules/tareas/tareas.routes.js";
import medicosRoutes from "./modules/medicos/medicos.router.js";


const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Rutas
//<<<<<<< HEAD
app.use("/api", routes);
<<<<<<< HEAD
app.use("/health", healthRoutes);
app.use("/tareas", tareasRoutes)
app.use("/api/medicos", medicosRoutes);
=======
//=======
app.use("/health", healthRoutes);
app.use("tareas", tareasRoutes)
//>>>>>>> 4baf3c5 (add tarea module)
>>>>>>> 8f92813 (add tarea module)

export default app;
