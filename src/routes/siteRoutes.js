import { Router } from "express";
import {
  renderAdminPreview,
  renderHome,
  renderUserDashboard
} from "../controllers/siteController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", renderHome);
router.get("/dashboard", requireAuth, renderUserDashboard);

if (process.env.NODE_ENV !== "production") {
  router.get("/preview/admin", renderAdminPreview);
}

export default router;
