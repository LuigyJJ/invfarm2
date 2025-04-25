import express from "express";
import cors from "cors"
import categoriasRoutes from "./routes/categorias.routes.js";

const app = express();

app.set("port",5000)

app.use(express.json());
app.use(cors());

app.use("/api/categorias", categoriasRoutes)


export default app;