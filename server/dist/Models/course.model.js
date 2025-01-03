"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Course = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const courseSchema = new mongoose_1.default.Schema({
    courseTitle: {
        type: String,
        required: true,
    },
    subTitle: {
        type: String,
    },
    publicId: {
        type: String,
    },
    description: {
        type: String,
    },
    category: {
        type: String,
        required: true,
    },
    courseLevel: {
        type: String,
        enum: ["begineer", "intermediate", "advance"],
    },
    coursePrice: {
        type: Number,
    },
    courseThumbnail: {
        type: String,
    },
    enrolledStudents: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    lectures: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Lecture",
        },
    ],
    creator: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
    isPublished: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
exports.Course = mongoose_1.default.model("Course", courseSchema);
