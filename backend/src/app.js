import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";
import ticketRoutes from "./routes/ticket.routes.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("API funcionando");
});

app.use("/users", userRoutes);
app.use("/tickets", ticketRoutes);
app.use("/auth", authRoutes);


export default app;
