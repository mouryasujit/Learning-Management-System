"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lecture = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const lectureSchema = new mongoose_1.default.Schema({
    lectureTitle: {
        type: String,
        required: true,
    },
    videoUrl: { type: String },
    publicId: { type: String },
    isPreviewFree: { type: Boolean },
}, { timestamps: true });
exports.Lecture = mongoose_1.default.model("Lecture", lectureSchema);
