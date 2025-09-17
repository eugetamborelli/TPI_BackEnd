import express from "express";
import cors from "cors";
import routes from "./routes/index.js";

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api", routes);

export default app;
