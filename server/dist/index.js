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
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
//apis Import
const user_Route_1 = __importDefault(require("./router/user.Route"));
const course_Route_1 = __importDefault(require("./router/course.Route"));
const media_route_1 = __importDefault(require("./router/media.route"));
const purchaseCourse_route_1 = __importDefault(require("./router/purchaseCourse.route"));
const couresProgress_route_1 = __importDefault(require("./router/couresProgress.route"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "https://lmsclient-rho.vercel.app", // Allow this specific origin
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
        "X-CSRF-Token",
        "X-Requested-With",
        "Accept",
        "Accept-Version",
        "Content-Length",
        "Content-MD5",
        "Content-Type",
        "Date",
        "X-Api-Version",
    ],
    credentials: true, // Allow cookies if needed
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/your-app";
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(uri);
        console.log("Connected to the database");
    }
    catch (error) {
        console.error(error);
    }
}))();
//apis definition
app.use("/api/v1/media", media_route_1.default);
app.use("/api/v1/user", user_Route_1.default);
app.use("/api/v1/course", course_Route_1.default);
app.use("/api/v1/purchase", purchaseCourse_route_1.default);
app.use("/api/v1/progress", couresProgress_route_1.default);
app.use("/", (req, res) => {
    res.status(200).send("Server is running!");
});
app.use((err, req, res, next) => {
    console.log("inside index.js", err.stack);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        message: err.message || "something went Wrong",
        success: false,
    });
});
const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on PORT: ${PORT}`);
// });
exports.default = app;
