"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const isAuthenticated = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            const customError = new Error("Please Login First");
            customError.statusCode = 401;
            throw customError;
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
        if (!decoded) {
            const customError = new Error("Invalid Token");
            customError.statusCode = 401;
            throw customError;
        }
        req.id = decoded.userId;
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.default = isAuthenticated;
