import express from "express";
import isAuthenticated from "../middleware/isAuthenticated";
import {
  getCourseProgress,
  markAsCompleted,
  markAsinComplete,
  updateLectureProgress,
} from "../controllers/courseProgress.controller";
const Router = express.Router();
Router.get("/:courseId", isAuthenticated, getCourseProgress);
Router.post(
  "/:courseId/lecture/:lectureId/view",
  isAuthenticated,
  updateLectureProgress
);
Router.post("/:courseId/complete", isAuthenticated, markAsCompleted);
Router.post("/:courseId/incomplete", isAuthenticated, markAsinComplete);

export default Router;
