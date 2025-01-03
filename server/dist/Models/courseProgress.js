"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseProgress = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const lectureProgressSchema = new mongoose_1.default.Schema({
    lectureId: { type: String },
    viewed: { type: Boolean },
});
const courseProgressSchema = new mongoose_1.default.Schema({
    userId: { type: String },
    courseId: { type: String },
    completed: { type: Boolean },
    lectureProgress: [lectureProgressSchema],
});
exports.CourseProgress = mongoose_1.default.model("CourseProgress", courseProgressSchema);
