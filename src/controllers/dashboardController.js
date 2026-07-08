import {
  getBookingForUser,
  getBookingHistory,
  listBookingsForUser
} from "../models/bookingModel.js";
import { validationResult } from "express-validator";
import { deleteOwnReview, listReviewsForUser, updateOwnReview } from "../models/reviewModel.js";

export async function renderTravelerDashboard(req, res, next) {
  try {
    const [bookings, reviews] = await Promise.all([
      listBookingsForUser(req.session.user.id),
      listReviewsForUser(req.session.user.id)
    ]);

    res.render("userDashboard", {
      title: "Traveler Dashboard",
      bookings,
      reviews
    });
  } catch (error) {
    next(error);
  }
}

export async function renderBookingDetail(req, res, next) {
  try {
    const [booking, history] = await Promise.all([
      getBookingForUser(req.params.id, req.session.user.id),
      getBookingHistory(req.params.id)
    ]);

    if (!booking) {
      const error = new Error("Booking not found.");
      error.status = 404;
      throw error;
    }

    res.render("bookings/detail", { title: "Booking Status", booking, history });
  } catch (error) {
    next(error);
  }
}

export async function deleteTravelerReview(req, res, next) {
  try {
    await deleteOwnReview(req.params.id, req.session.user.id);
    req.session.flash = { type: "success", message: "Review deleted." };
    return res.redirect("/dashboard");
  } catch (error) {
    next(error);
  }
}

export async function updateTravelerReview(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    req.session.flash = { type: "error", message: errors.array()[0].msg };
    return res.redirect("/dashboard");
  }

  try {
    const review = await updateOwnReview(req.params.id, req.session.user.id, {
      rating: req.body.rating,
      comment: req.body.comment
    });

    if (!review) {
      const error = new Error("Review not found.");
      error.status = 404;
      throw error;
    }

    req.session.flash = { type: "success", message: "Review updated." };
    return res.redirect("/dashboard");
  } catch (error) {
    next(error);
  }
}
