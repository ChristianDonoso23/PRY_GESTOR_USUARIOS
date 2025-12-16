import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("API de Gestión de Usuarios funcionando");
});

app.use("/users", userRoutes);

export default app;
