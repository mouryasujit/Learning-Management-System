"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSuccessMessage = void 0;
const sendSuccessMessage = (res, statusCode, message, payload) => {
    const responseBody = {
        success: true,
        message: message,
    };
    if (payload) {
        responseBody.payload = payload;
    }
    return res.status(statusCode).json(responseBody);
};
exports.sendSuccessMessage = sendSuccessMessage;
