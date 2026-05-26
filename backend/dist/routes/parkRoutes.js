"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const parkController_1 = require("../controllers/parkController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
// Públicos
router.get("/", parkController_1.getParks);
// Protegidos por autenticação
router.post("/tickets/buy", auth_1.protect, parkController_1.buyTicket);
router.get("/tickets", auth_1.protect, parkController_1.getTickets);
router.post("/tickets/check-in/:ticketId", auth_1.protect, parkController_1.checkInTicket);
// Admin
router.post("/", auth_1.protect, (0, auth_1.restrictTo)("admin"), parkController_1.addPark);
router.put("/:id", auth_1.protect, (0, auth_1.restrictTo)("admin"), parkController_1.updatePark);
router.delete("/:id", auth_1.protect, (0, auth_1.restrictTo)("admin"), parkController_1.deletePark);
exports.default = router;
