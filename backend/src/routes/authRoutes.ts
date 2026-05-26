import { Router } from "express";
import { register, login, getProfile, updateProfile } from "../controllers/authController";
import { protect } from "../middlewares/auth";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", protect, getProfile);
router.put("/profile/update", protect, updateProfile);

export default router;
