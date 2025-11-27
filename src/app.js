import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import methodOverride from "method-override";
import cors from "cors";
import routes from "./routes/index.js";
import { formatDateDDMMYYYY } from './common/utils/date.utils.js';

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

// Middleware para formato de fecha
app.use((req, res, next) => {
    res.locals.formatDate = formatDateDDMMYYYY;
    next();
});

// Middleware para formatear legajo (001, 002, 010…)
app.use((req, res, next) => {
    res.locals.formatLegajo = (num) => {
        if (!num) return "";
        return String(num).padStart(3, "0");
    };
    next();
});

// Rutas
app.use("/", routes);

// Middleware 404
app.use((req, res, next) => {
    res.status(404).send("Lo sentimos, no encontramos esa página.");
});

// Middleware de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('¡Algo salió mal en el servidor!');
});

export default app;
