import express, { Express } from "express";
import {
  login,
  register,
  getUserProfile,
  Logout,
  updateUserProfile,
} from "../controllers/user.controller";
import isAuthenticated from "../middleware/isAuthenticated";
import uploads from "../utils/Multer";

const Router = express.Router();

Router.post("/register", register);
Router.post("/login", login);
Router.get("/profile", isAuthenticated, getUserProfile);
Router.get("/logout", Logout as any);
Router.put(
  "/profile/update",
  isAuthenticated,
  uploads.single("profilePhoto"),
  updateUserProfile
);

export default Router;
