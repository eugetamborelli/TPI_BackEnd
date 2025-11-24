import dotenv from "dotenv";
import app from "./app.js";
import "./databases/database.js";


dotenv.config();

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/api/`);
});
