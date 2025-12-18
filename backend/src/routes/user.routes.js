import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import { auth } from "../auth/auth.middleware.js";
import { role } from "../auth/role.middleware.js";

const router = Router();

router.get("/", auth, role("Admin"), UserController.getAll);
router.get("/soportes", auth, role("Admin"), UserController.getSoportes);
router.get("/:id", auth, role("Admin"), UserController.getById);
router.post("/", auth, role("Admin"), UserController.create);
router.put("/:id", auth, role("Admin"), UserController.update);
router.delete("/:id", auth, role("Admin"), UserController.delete);

export default router;
