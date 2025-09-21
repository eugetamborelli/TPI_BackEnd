import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import methodOverride from "method-override";
import cors from "cors";
import routes from "./routes/index.js";

const app = express();

// Configuración de __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de vistas
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Rutas
app.use("/", routes);

export default app;
