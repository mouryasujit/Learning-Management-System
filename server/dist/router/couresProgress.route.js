"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const isAuthenticated_1 = __importDefault(require("../middleware/isAuthenticated"));
const courseProgress_controller_1 = require("../controllers/courseProgress.controller");
const Router = express_1.default.Router();
Router.get("/:courseId", isAuthenticated_1.default, courseProgress_controller_1.getCourseProgress);
Router.post("/:courseId/lecture/:lectureId/view", isAuthenticated_1.default, courseProgress_controller_1.updateLectureProgress);
Router.post("/:courseId/complete", isAuthenticated_1.default, courseProgress_controller_1.markAsCompleted);
Router.post("/:courseId/incomplete", isAuthenticated_1.default, courseProgress_controller_1.markAsinComplete);
exports.default = Router;
