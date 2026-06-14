import { Router } from "express";
import { 
  getEvents, addEvent, updateEvent, deleteEvent,
  getRestaurants, addRestaurant, updateRestaurant, deleteRestaurant,
  getLodgings, addLodging, updateLodging, deleteLodging,
  getSettings, updateSetting
} from "../controllers/miscController";
import { protect, restrictTo } from "../middlewares/auth";

const router = Router();

// ==========================================
// 📅 Eventos
// ==========================================
router.get("/events", getEvents);
router.post("/events", protect, restrictTo("admin"), addEvent);
router.put("/events/:id", protect, restrictTo("admin"), updateEvent);
router.delete("/events/:id", protect, restrictTo("admin"), deleteEvent);

// ==========================================
// 🍕 Restaurantes
// ==========================================
router.get("/restaurants", getRestaurants);
router.post("/restaurants", protect, restrictTo("admin"), addRestaurant);
router.put("/restaurants/:id", protect, restrictTo("admin"), updateRestaurant);
router.delete("/restaurants/:id", protect, restrictTo("admin"), deleteRestaurant);

// ==========================================
// 🏨 Hospedagens
// ==========================================
router.get("/lodgings", getLodgings);
router.post("/lodgings", protect, restrictTo("admin"), addLodging);
router.put("/lodgings/:id", protect, restrictTo("admin"), updateLodging);
router.delete("/lodgings/:id", protect, restrictTo("admin"), deleteLodging);

// ==========================================
// ⚙️ Configurações / Settings
// ==========================================
router.get("/settings/:key", getSettings);
router.put("/settings/:key", protect, restrictTo("admin"), updateSetting);

export default router;
