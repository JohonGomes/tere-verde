"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const miscController_1 = require("../controllers/miscController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
// ==========================================
// 📅 Eventos
// ==========================================
router.get("/events", miscController_1.getEvents);
router.post("/events", auth_1.protect, (0, auth_1.restrictTo)("admin"), miscController_1.addEvent);
router.put("/events/:id", auth_1.protect, (0, auth_1.restrictTo)("admin"), miscController_1.updateEvent);
router.delete("/events/:id", auth_1.protect, (0, auth_1.restrictTo)("admin"), miscController_1.deleteEvent);
// ==========================================
// 🍕 Restaurantes
// ==========================================
router.get("/restaurants", miscController_1.getRestaurants);
router.post("/restaurants", auth_1.protect, (0, auth_1.restrictTo)("admin"), miscController_1.addRestaurant);
router.put("/restaurants/:id", auth_1.protect, (0, auth_1.restrictTo)("admin"), miscController_1.updateRestaurant);
router.delete("/restaurants/:id", auth_1.protect, (0, auth_1.restrictTo)("admin"), miscController_1.deleteRestaurant);
// ==========================================
// 🏨 Hospedagens
// ==========================================
router.get("/lodgings", miscController_1.getLodgings);
router.post("/lodgings", auth_1.protect, (0, auth_1.restrictTo)("admin"), miscController_1.addLodging);
router.put("/lodgings/:id", auth_1.protect, (0, auth_1.restrictTo)("admin"), miscController_1.updateLodging);
router.delete("/lodgings/:id", auth_1.protect, (0, auth_1.restrictTo)("admin"), miscController_1.deleteLodging);
exports.default = router;
