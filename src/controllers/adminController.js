import { getAdminOverview } from "../models/adminModel.js";

export async function renderDashboard(req, res, next) {
  try {
    const overview = await getAdminOverview();
    res.render("admin/dashboard", {
      title: "Admin Dashboard",
      ...overview
    });
  } catch (error) {
    next(error);
  }
}
