"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoursePurchase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const purchaseCourseSchema = new mongoose_1.default.Schema({
    courseId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending',
    },
    paymentId: {
        type: String,
        required: true,
    }
}, { timestamps: true });
exports.CoursePurchase = mongoose_1.default.model('CoursePurchase', purchaseCourseSchema);
