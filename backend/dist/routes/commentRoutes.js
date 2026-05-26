"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const commentController_1 = require("../controllers/commentController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
// ==========================================
// 💬 Rotas de Comentários / Depoimentos
// ==========================================
router.get("/comments", commentController_1.getComments); // Admin vê todos, público vê Aprovados
router.post("/comments", auth_1.protect, commentController_1.addComment);
router.patch("/comments/moderate/:id", auth_1.protect, (0, auth_1.restrictTo)("admin"), commentController_1.moderateComment);
router.delete("/comments/:id", auth_1.protect, (0, auth_1.restrictTo)("admin"), commentController_1.deleteComment);
// ==========================================
// ⭐️ Rotas de Avaliações
// ==========================================
router.get("/reviews", commentController_1.getReviews);
router.post("/reviews", auth_1.protect, commentController_1.addReview);
exports.default = router;
