export function renderHome(req, res) {
  res.render("home", { title: "Cielito Adventures" });
}

export function renderUserDashboard(req, res) {
  res.render("userDashboard", { title: "Traveler Dashboard" });
}

export function renderAdminPreview(req, res) {
  res.locals.currentUser = {
    firstName: "Esme",
    lastName: "Sanchez",
    email: "admin@cielito.test",
    role: "admin"
  };

  res.render("admin/dashboard", {
    title: "Admin Dashboard",
    stats: {
      users: 1284,
      activePackages: 42,
      monthlyRevenue: 54200
    },
    bookings: [
      {
        first_name: "Elena",
        last_name: "Rodriguez",
        email: "elena.r@example.com",
        package_title: "Oaxaca Culinary Tour",
        duration_days: 7,
        category: "Boutique",
        status: "completed",
        travel_date: new Date("2023-10-24")
      },
      {
        first_name: "Marco",
        last_name: "Sanchez",
        email: "m.sanchez@cloud.com",
        package_title: "Tulum Beach Wellness",
        duration_days: 5,
        category: "Eco-Luxury",
        status: "confirmed",
        travel_date: new Date("2023-10-28")
      },
      {
        first_name: "Lucia",
        last_name: "Lopez",
        email: "lucia.l@mail.mx",
        package_title: "Chichen Itza Explorer",
        duration_days: 3,
        category: "Historical",
        status: "requested",
        travel_date: new Date("2023-11-02")
      }
    ]
  });
}
