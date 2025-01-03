import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { customError } from "./utils/Interfaces";
import cookieparser from "cookie-parser";

//apis Import
import UserRoute from "./router/user.Route";
import courseRoute from "./router/course.Route";
import mediaRoute from "./router/media.route";
import purchaseRoute from "./router/purchaseCourse.route";
import courseProgressRouter from "./router/couresProgress.route";

dotenv.config();

const app: Express = express();

app.use(
  cors({
    origin: [
      "https://lmsclient-rho.vercel.app",
      "https://learning-management-system-client.onrender.com",
    ], // Allow this specific origin
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "X-CSRF-Token",
      "X-Requested-With",
      "Accept",
      "Accept-Version",
      "Content-Length",
      "Content-MD5",
      "Content-Type",
      "Date",
      "X-Api-Version",
    ],
    credentials: true, // Allow cookies if needed
  })
);
app.use(express.json());
app.use(cookieparser());
app.use(express.urlencoded({ extended: true }));

const uri: string =
  process.env.MONGODB_URI || "mongodb://localhost:27017/your-app";

(async () => {
  try {
    await mongoose.connect(uri);
    console.log("Connected to the database");
  } catch (error) {
    console.error(error);
  }
})();
//apis definition

app.use("/api/v1/media", mediaRoute);
app.use("/api/v1/user", UserRoute);
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/purchase", purchaseRoute);
app.use("/api/v1/progress", courseProgressRouter);
app.use("/", (req, res) => {
  res.status(200).send("Server is running!");
});
app.use((err: customError, req: Request, res: Response, next: NextFunction) => {
  console.log("inside index.js", err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || "something went Wrong",
    success: false,
  });
});
const PORT: string | number = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});

// export default app;
