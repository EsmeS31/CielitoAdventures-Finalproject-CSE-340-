import express from "express";
import session from "express-session";
import pgSession from "connect-pg-simple";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { pool } from "./db/pool.js";
import { attachViewLocals } from "./middleware/viewLocals.js";
import { notFound, errorHandler } from "./middleware/errorHandlers.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import siteRoutes from "./routes/siteRoutes.js";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PgSession = pgSession(session);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

app.use(helmet({ contentSecurityPolicy: false }));
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

app.use(
  session({
    store: new PgSession({
      pool,
      tableName: "session"
    }),
    name: "cielito.sid",
    secret: process.env.SESSION_SECRET ?? "dev-secret-change-me",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24
    }
  })
);

app.use(attachViewLocals);

app.use("/", siteRoutes);
app.use("/", authRoutes);
app.use("/admin", adminRoutes);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT ?? 3000;

app.listen(port, () => {
  console.log(`Cielito Adventures running at http://localhost:${port}`);
});
