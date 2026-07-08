import { Router } from "express";
import { body } from "express-validator";
import {
  deleteTravelerReview,
  renderBookingDetail,
  renderTravelerDashboard,
  updateTravelerReview
} from "../controllers/dashboardController.js";
import { renderContact, submitContact } from "../controllers/contactController.js";
import { renderAdminPreview, renderHome } from "../controllers/siteController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import {
  renderPackageDetail,
  renderPackageList,
  requestBooking,
  submitReview
} from "../controllers/packageController.js";

const router = Router();

router.get("/", renderHome);
router.get("/packages", renderPackageList);
router.get("/packages/:id", renderPackageDetail);
router.post(
  "/packages/:id/book",
  requireAuth,
  [
    body("travelDate").isISO8601().withMessage("Choose a valid travel date."),
    body("partySize").isInt({ min: 1, max: 20 }).withMessage("Party size must be 1 to 20.")
  ],
  requestBooking
);
router.post(
  "/packages/:id/reviews",
  requireAuth,
  [
    body("rating").isInt({ min: 1, max: 5 }).withMessage("Rating must be between 1 and 5."),
    body("comment").trim().isLength({ min: 8 }).withMessage("Review must be at least 8 characters.").escape()
  ],
  submitReview
);
router.get("/contact", renderContact);
router.post(
  "/contact",
  [
    body("name").trim().notEmpty().withMessage("Name is required.").escape(),
    body("email").trim().isEmail().withMessage("Use a valid email.").normalizeEmail(),
    body("subject").trim().notEmpty().withMessage("Subject is required.").escape(),
    body("message").trim().isLength({ min: 10 }).withMessage("Message must be at least 10 characters.").escape()
  ],
  submitContact
);
router.get("/dashboard", requireAuth, renderTravelerDashboard);
router.get("/dashboard/bookings/:id", requireAuth, renderBookingDetail);
router.post(
  "/dashboard/reviews/:id",
  requireAuth,
  [
    body("rating").isInt({ min: 1, max: 5 }).withMessage("Rating must be between 1 and 5."),
    body("comment").trim().isLength({ min: 8 }).withMessage("Review must be at least 8 characters.").escape()
  ],
  updateTravelerReview
);
router.post("/dashboard/reviews/:id/delete", requireAuth, deleteTravelerReview);

if (process.env.NODE_ENV !== "production") {
  router.get("/preview/admin", renderAdminPreview);
}

export default router;
