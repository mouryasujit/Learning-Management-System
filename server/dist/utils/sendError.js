"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendError = (message, statusCode) => {
    const customError = new Error(message);
    customError.statusCode = statusCode;
    throw customError;
};
exports.default = sendError;
