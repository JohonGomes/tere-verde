"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const trailController_1 = require("../controllers/trailController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
// Públicos
router.get("/", trailController_1.getTrails);
router.get("/:id", trailController_1.getTrailDetails);
// Protegidos
router.post("/like/:id", auth_1.protect, trailController_1.toggleLikeTrail);
// Admin
router.post("/", auth_1.protect, (0, auth_1.restrictTo)("admin"), trailController_1.addTrail);
router.put("/:id", auth_1.protect, (0, auth_1.restrictTo)("admin"), trailController_1.updateTrail);
router.delete("/:id", auth_1.protect, (0, auth_1.restrictTo)("admin"), trailController_1.deleteTrail);
exports.default = router;
