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
const express_1 = __importDefault(require("express"));
const Multer_1 = __importDefault(require("../utils/Multer"));
const Cloudinary_1 = require("../utils/Cloudinary");
const sendError_1 = __importDefault(require("../utils/sendError"));
const sendSuccessMessage_1 = require("../utils/sendSuccessMessage");
const Router = express_1.default.Router();
Router.post("/uploads-video", Multer_1.default.single("file"), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.file) {
            try {
                const result = yield (0, Cloudinary_1.uploadMedia)(req === null || req === void 0 ? void 0 : req.file.path);
                (0, sendSuccessMessage_1.sendSuccessMessage)(res, 200, "File uplad Successful", result);
            }
            catch (error) {
                (0, sendError_1.default)("File couldn't be uploaded try again", 409);
            }
        }
        else {
            (0, sendError_1.default)("All fields are required", 400);
        }
    }
    catch (error) {
        next(error);
    }
}));
exports.default = Router;
