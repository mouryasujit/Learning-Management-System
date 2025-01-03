"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const isAuthenticated_1 = __importDefault(require("../middleware/isAuthenticated"));
const Multer_1 = __importDefault(require("../utils/Multer"));
const Router = express_1.default.Router();
Router.post("/register", user_controller_1.register);
Router.post("/login", user_controller_1.login);
Router.get("/profile", isAuthenticated_1.default, user_controller_1.getUserProfile);
Router.get("/logout", user_controller_1.Logout);
Router.put("/profile/update", isAuthenticated_1.default, Multer_1.default.single("profilePhoto"), user_controller_1.updateUserProfile);
exports.default = Router;
