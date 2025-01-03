"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const purchaseCourse_controller_1 = require("../controllers/purchaseCourse.controller");
const isAuthenticated_1 = __importDefault(require("../middleware/isAuthenticated"));
const Router = express_1.default.Router();
Router.post("/checkout/create-checkout-session", isAuthenticated_1.default, purchaseCourse_controller_1.createCheckoutSession);
Router.post("/webhook", express_1.default.raw({ type: "application/json" }), purchaseCourse_controller_1.stripeWebhook);
Router.get("/course/:courseId/detail-with-status", isAuthenticated_1.default, purchaseCourse_controller_1.getCourseDetailwithPurchaseStatus);
Router.get("/", isAuthenticated_1.default, purchaseCourse_controller_1.getAllPurchasedCourses);
exports.default = Router;
