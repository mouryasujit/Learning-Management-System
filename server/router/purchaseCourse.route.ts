import express from "express";
import {
  createCheckoutSession,
  getAllPurchasedCourses,
  getCourseDetailwithPurchaseStatus,
  stripeWebhook,
} from "../controllers/purchaseCourse.controller";
import isAuthenticated from "../middleware/isAuthenticated";

const Router = express.Router();

Router.post(
  "/checkout/create-checkout-session",
  isAuthenticated,
  createCheckoutSession
);
Router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);
Router.get(
  "/course/:courseId/detail-with-status",
  isAuthenticated,
  getCourseDetailwithPurchaseStatus
);
Router.get("/",isAuthenticated,getAllPurchasedCourses);

export default Router;

