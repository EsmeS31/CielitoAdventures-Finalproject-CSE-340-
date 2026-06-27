import { Router } from "express";
import { renderDashboard } from "../controllers/adminController.js";
import { requireAuth, requireRole } from "../middleware/authMiddleware.js";

const router = Router();

router.use(requireAuth, requireRole("admin", "agent"));
router.get("/", renderDashboard);

export default router;
