import { Router } from "express";
import { 
  getTrails, getTrailDetails, toggleLikeTrail, addTrail, updateTrail, deleteTrail 
} from "../controllers/trailController";
import { protect, restrictTo } from "../middlewares/auth";

const router = Router();

// Públicos
router.get("/", getTrails);
router.get("/:id", getTrailDetails);

// Protegidos
router.post("/like/:id", protect, toggleLikeTrail);

// Admin
router.post("/", protect, restrictTo("admin"), addTrail);
router.put("/:id", protect, restrictTo("admin"), updateTrail);
router.delete("/:id", protect, restrictTo("admin"), deleteTrail);

export default router;
