import express, { Express } from "express";
import isAuthenticated from "../middleware/isAuthenticated";
import uploads from "../utils/Multer";
import {
  createCourse,
  createLecture,
  editCourse,
  editLecture,
  getCourseById,
  getcourseLecturs,
  getCreatorCourses,
  getLectureById,
  getPublishedCourses,
  removeCourse,
  removeLecture,
  searchCourse,
  toggleCoursePublish,
} from "../controllers/course.controller";

const Router = express.Router();

Router.post("/", isAuthenticated, createCourse);
Router.get("/", isAuthenticated, getCreatorCourses);
Router.get("/search", isAuthenticated, searchCourse);
Router.get("/publishedcourses", getPublishedCourses);
Router.delete("/remove-course/:courseId",isAuthenticated,removeCourse);
Router.put(
  "/:courseId",
  isAuthenticated,
  uploads.single("courseThumbnail"),
  editCourse
);
Router.get("/lecture/:lectureId", isAuthenticated, getLectureById);
Router.get("/:courseId", isAuthenticated, getCourseById);
Router.post("/:courseId/lecture", isAuthenticated, createLecture);
Router.get("/:courseId/lecture", isAuthenticated, getcourseLecturs);
Router.post("/:courseId/lecture/:lectureId", isAuthenticated, editLecture);
Router.delete("/lecture/:lectureId", isAuthenticated, removeLecture);
Router.patch("/:courseId", isAuthenticated, toggleCoursePublish);
export default Router;
