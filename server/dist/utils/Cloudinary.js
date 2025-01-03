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
exports.deleteVideofromCLoudinary = exports.deleteMedia = exports.uploadMedia = void 0;
const cloudinary_1 = require("cloudinary");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({});
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLODINARY_API_SECRET,
});
const uploadMedia = (file) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uploadResponse = yield cloudinary_1.v2.uploader.upload(file, {
            resource_type: "auto",
        });
        return uploadResponse;
    }
    catch (error) {
        console.log(error);
    }
});
exports.uploadMedia = uploadMedia;
const deleteMedia = (publicId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleteResponse = yield cloudinary_1.v2.uploader.destroy(publicId);
        return deleteResponse;
    }
    catch (error) {
        console.log(error);
    }
});
exports.deleteMedia = deleteMedia;
const deleteVideofromCLoudinary = (publicId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleteResponse = yield cloudinary_1.v2.uploader.destroy(publicId, {
            resource_type: "video",
        });
        return deleteResponse;
    }
    catch (error) {
        console.log(error);
    }
});
exports.deleteVideofromCLoudinary = deleteVideofromCLoudinary;
