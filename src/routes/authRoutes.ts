import { Router } from "express";
import register from "../controllers/registerController";
import login from "../controllers/loginController";
import refresh from "../controllers/refreshController";
import logout from "../controllers/logoutController";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/refresh", refresh);
router.post("/logout", logout);

export default router;
