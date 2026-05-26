import { Router } from "express";
import { 
  getComments, addComment, moderateComment, deleteComment, getReviews, addReview 
} from "../controllers/commentController";
import { protect, restrictTo } from "../middlewares/auth";

const router = Router();

// ==========================================
// 💬 Rotas de Comentários / Depoimentos
// ==========================================
router.get("/comments", getComments); // Admin vê todos, público vê Aprovados
router.post("/comments", protect, addComment);
router.patch("/comments/moderate/:id", protect, restrictTo("admin"), moderateComment);
router.delete("/comments/:id", protect, restrictTo("admin"), deleteComment);

// ==========================================
// ⭐️ Rotas de Avaliações
// ==========================================
router.get("/reviews", getReviews);
router.post("/reviews", protect, addReview);

export default router;
