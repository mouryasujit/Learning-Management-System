"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAsinComplete = exports.markAsCompleted = exports.updateLectureProgress = exports.getCourseProgress = void 0;
const courseProgress_1 = require("../Models/courseProgress");
const course_model_1 = require("../Models/course.model");
const sendError_1 = __importDefault(require("../utils/sendError"));
const sendSuccessMessage_1 = require("../utils/sendSuccessMessage");
const getCourseProgress = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { courseId } = req.params;
        const userId = req.id;
        let courseProgress = yield courseProgress_1.CourseProgress.findOne({
            userId,
            courseId,
        }).populate("courseId");
        const courseDetails = yield course_model_1.Course.findById(courseId).populate("lectures");
        if (!courseDetails) {
            (0, sendError_1.default)("Course not found", 404);
        }
        if (!courseProgress) {
            const data = { courseDetails, progress: [], completed: false };
            (0, sendSuccessMessage_1.sendSuccessMessage)(res, 200, "course Progess", data);
        }
        const data = {
            courseDetails,
            progress: courseProgress === null || courseProgress === void 0 ? void 0 : courseProgress.lectureProgress,
            completed: courseProgress === null || courseProgress === void 0 ? void 0 : courseProgress.completed,
        };
        (0, sendSuccessMessage_1.sendSuccessMessage)(res, 200, "course Progess", data);
    }
    catch (error) {
        next(error);
    }
});
exports.getCourseProgress = getCourseProgress;
const updateLectureProgress = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { courseId, lectureId } = req.params;
        const userId = req.id;
        let courseProgress = yield courseProgress_1.CourseProgress.findOne({
            userId,
            courseId,
        });
        if (!courseProgress) {
            courseProgress = new courseProgress_1.CourseProgress({
                userId,
                courseId,
                completed: false,
                lectureProgress: [],
            });
        }
        const lectureIndex = courseProgress.lectureProgress.findIndex((lecture) => lecture.lectureId === lectureId);
        if (lectureIndex === -1) {
            courseProgress.lectureProgress.push({
                lectureId,
                viewed: true,
            });
        }
        else {
            courseProgress.lectureProgress[lectureIndex].viewed = true;
        }
        yield courseProgress.save();
        const lectureProgressLength = courseProgress.lectureProgress.filter((lecture) => lecture.viewed).length;
        const courseDetails = yield course_model_1.Course.findById(courseId);
        if (!courseDetails) {
            return (0, sendError_1.default)("Course not found", 404);
        }
        if (lectureProgressLength === courseDetails.lectures.length) {
            courseProgress.completed = true;
            yield courseProgress.save();
        }
        (0, sendSuccessMessage_1.sendSuccessMessage)(res, 200, "Lecture Progress updated", courseProgress);
    }
    catch (error) {
        next(error);
    }
});
exports.updateLectureProgress = updateLectureProgress;
const markAsCompleted = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { courseId } = req.params;
        const userId = req.id;
        const courseProgress = yield courseProgress_1.CourseProgress.findOne({ userId, courseId });
        if (!courseProgress) {
            return (0, sendError_1.default)("Course not found", 404);
        }
        courseProgress.lectureProgress.map((lecture) => (lecture.viewed = true));
        courseProgress.completed = true;
        courseProgress.save();
        (0, sendSuccessMessage_1.sendSuccessMessage)(res, 200, "Course marked as completed", courseProgress);
    }
    catch (error) {
        next(error);
    }
});
exports.markAsCompleted = markAsCompleted;
const markAsinComplete = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { courseId } = req.params;
        const userId = req.id;
        const courseProgress = yield courseProgress_1.CourseProgress.findOne({ userId, courseId });
        if (!courseProgress) {
            return (0, sendError_1.default)("Course not found", 404);
        }
        courseProgress.lectureProgress.map((lecture) => (lecture.viewed = false));
        courseProgress.completed = false;
        courseProgress.save();
        (0, sendSuccessMessage_1.sendSuccessMessage)(res, 200, "Course marked as In completed successfull", courseProgress);
    }
    catch (error) {
        next(error);
    }
});
exports.markAsinComplete = markAsinComplete;
