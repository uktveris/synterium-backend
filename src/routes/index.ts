import { Router } from "express";
import authRoutes from "./authRoutes";
import fileRoutes from "./fileRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/files", fileRoutes);

export default router;
