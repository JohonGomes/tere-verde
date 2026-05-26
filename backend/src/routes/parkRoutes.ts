import { Router } from "express";
import { 
  getParks, buyTicket, getTickets, checkInTicket, addPark, updatePark, deletePark 
} from "../controllers/parkController";
import { protect, restrictTo } from "../middlewares/auth";

const router = Router();

// Públicos
router.get("/", getParks);

// Protegidos por autenticação
router.post("/tickets/buy", protect, buyTicket);
router.get("/tickets", protect, getTickets);
router.post("/tickets/check-in/:ticketId", protect, checkInTicket);

// Admin
router.post("/", protect, restrictTo("admin"), addPark);
router.put("/:id", protect, restrictTo("admin"), updatePark);
router.delete("/:id", protect, restrictTo("admin"), deletePark);

export default router;
