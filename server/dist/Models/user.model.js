"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["instructor", "student"],
        default: "student",
    },
    courseEnrolled: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Course",
        },
    ],
    photoUrl: {
        type: String,
        default: "",
    },
}, { timestamps: true });
exports.User = mongoose_1.default.model("User", userSchema);
