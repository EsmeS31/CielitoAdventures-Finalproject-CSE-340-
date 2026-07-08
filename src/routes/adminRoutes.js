import { Router } from "express";
import { body } from "express-validator";
import {
  flagReview,
  removeReview,
  renderBookings,
  renderDashboard,
  renderMessages,
  renderReviews,
  renderUsers,
  updateBooking,
  updateMessage,
  updateRole
} from "../controllers/adminController.js";
import { requireAuth, requireRole } from "../middleware/authMiddleware.js";
import {
  createAdminPackage,
  createAdminDestination,
  deleteAdminDestination,
  deleteAdminPackage,
  renderAdminDestinations,
  renderAdminPackages,
  renderEditDestination,
  renderEditPackage,
  renderNewDestination,
  renderNewPackage,
  updateAdminDestination,
  updateAdminPackage
} from "../controllers/packageController.js";

const router = Router();
const imageUrlValidator = body("imageUrl")
  .optional({ checkFalsy: true })
  .trim()
  .custom((value) => {
    if (value.startsWith("/")) return true;

    try {
      const url = new URL(value);
      return ["http:", "https:"].includes(url.protocol);
    } catch {
      throw new Error("Use a valid image URL or site image path.");
    }
  });

router.use(requireAuth, requireRole("admin", "agent"));
router.get("/", renderDashboard);
router.get("/destinations", renderAdminDestinations);
router.get("/destinations/new", requireRole("admin"), renderNewDestination);
router.post(
  "/destinations",
  requireRole("admin"),
  [
    body("name").trim().notEmpty().withMessage("Name is required.").escape(),
    body("region").trim().notEmpty().withMessage("Region is required.").escape(),
    body("description").trim().isLength({ min: 20 }).withMessage("Description must be at least 20 characters.").escape(),
    imageUrlValidator
  ],
  createAdminDestination
);
router.get("/destinations/:id/edit", requireRole("admin"), renderEditDestination);
router.post(
  "/destinations/:id",
  requireRole("admin"),
  [
    body("name").trim().notEmpty().withMessage("Name is required.").escape(),
    body("region").trim().notEmpty().withMessage("Region is required.").escape(),
    body("description").trim().isLength({ min: 20 }).withMessage("Description must be at least 20 characters.").escape(),
    imageUrlValidator
  ],
  updateAdminDestination
);
router.post("/destinations/:id/delete", requireRole("admin"), deleteAdminDestination);
router.get("/packages", renderAdminPackages);
router.get("/packages/new", requireRole("admin"), renderNewPackage);
router.post(
  "/packages",
  requireRole("admin"),
  [
    body("title").trim().notEmpty().withMessage("Title is required.").escape(),
    body("category").trim().notEmpty().withMessage("Category is required.").escape(),
    body("durationDays").isInt({ min: 1 }).withMessage("Duration must be at least 1 day."),
    body("price").isFloat({ min: 0 }).withMessage("Price must be 0 or greater."),
    body("description").trim().isLength({ min: 20 }).withMessage("Description must be at least 20 characters.").escape(),
    body("status").isIn(["draft", "active", "archived"]).withMessage("Use a valid package status.")
  ],
  createAdminPackage
);
router.get("/packages/:id/edit", requireRole("admin"), renderEditPackage);
router.post(
  "/packages/:id",
  requireRole("admin"),
  [
    body("title").trim().notEmpty().withMessage("Title is required.").escape(),
    body("category").trim().notEmpty().withMessage("Category is required.").escape(),
    body("durationDays").isInt({ min: 1 }).withMessage("Duration must be at least 1 day."),
    body("price").isFloat({ min: 0 }).withMessage("Price must be 0 or greater."),
    body("description").trim().isLength({ min: 20 }).withMessage("Description must be at least 20 characters.").escape(),
    body("status").isIn(["draft", "active", "archived"]).withMessage("Use a valid package status.")
  ],
  updateAdminPackage
);
router.post("/packages/:id/delete", requireRole("admin"), deleteAdminPackage);
router.get("/users", requireRole("admin"), renderUsers);
router.post(
  "/users/:id/role",
  requireRole("admin"),
  [body("role").isIn(["admin", "agent", "traveler"]).withMessage("Use a valid role.")],
  updateRole
);
router.get("/bookings", renderBookings);
router.post(
  "/bookings/:id/status",
  [body("status").isIn(["requested", "confirmed", "completed", "cancelled"]).withMessage("Use a valid booking status.")],
  updateBooking
);
router.get("/reviews", renderReviews);
router.post("/reviews/:id/flag", flagReview);
router.post("/reviews/:id/delete", requireRole("admin"), removeReview);
router.get("/messages", renderMessages);
router.post(
  "/messages/:id",
  [body("status").isIn(["received", "replied", "closed"]).withMessage("Use a valid message status.")],
  updateMessage
);

export default router;
