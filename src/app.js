
import express from "express";
import path from "path";
import cors from "cors";
import routes from "./routes/index.js";
import healthRoutes from "./modules/health/health.routes.js";
import tareasRoutes from "./modules/tareas/tareas.routes.js";
import medicosRoutes from "./modules/medicos/medicos.router.js";
import medicosRouter from "./routes/medicos.js";
import methodOverride from "method-override";

app.use("/", medicosRouter);

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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));


export default app;
