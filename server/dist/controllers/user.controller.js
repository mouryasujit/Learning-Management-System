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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserProfile = exports.getUserProfile = exports.Logout = exports.login = exports.register = void 0;
const user_model_1 = require("../Models/user.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const sendSuccessMessage_1 = require("../utils/sendSuccessMessage");
const generateToken_1 = require("../utils/generateToken");
const sendError_1 = __importDefault(require("../utils/sendError"));
const Cloudinary_1 = require("../utils/Cloudinary");
//------------------------------------------------REGISTER------------------------------------------------
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password) {
            (0, sendError_1.default)("Please Fill all input Fields", 400);
        }
        const user = yield user_model_1.User.findOne({ email });
        if (user) {
            (0, sendError_1.default)("User Already Exists", 400);
        }
        const hashPassword = yield bcryptjs_1.default.hash(password, 10);
        const newUser = yield user_model_1.User.create({
            name,
            email,
            password: hashPassword,
            role,
        });
        console.log(newUser);
        (0, sendSuccessMessage_1.sendSuccessMessage)(res, 201, "User Created Succesfully");
    }
    catch (error) {
        next(error);
    }
});
exports.register = register;
//------------------------------------------------LOGIN------------------------------------------------
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            (0, sendError_1.default)("Please Fill all input Fields", 400);
        }
        const user = yield user_model_1.User.findOne({ email });
        if (!user) {
            return (0, sendError_1.default)("Incorrect Email or Password", 404);
        }
        const hashPassword = user.password;
        const isPasswordCorrect = yield bcryptjs_1.default.compare(password, hashPassword);
        if (!isPasswordCorrect) {
            (0, sendError_1.default)("Incorrect Email or Password", 404);
        }
        const _a = user.toObject(), { password: userPassword } = _a, withoutPassword = __rest(_a, ["password"]);
        console.log(withoutPassword);
        (0, generateToken_1.generateToken)(res, withoutPassword, `Hello user ${user.name} welcome Back 👋 `);
    }
    catch (error) {
        next(error);
    }
});
exports.login = login;
//------------------------------------------------LOGOUT------------------------------------------------
const Logout = (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return res
            .status(200)
            .cookie("token", "", { maxAge: 0 })
            .json({ message: "Logout Successfully", success: true });
    }
    catch (error) {
        next(error);
    }
});
exports.Logout = Logout;
//------------------------------------------------GET USER PROFILE------------------------------------------------
const getUserProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.id;
        const user = yield user_model_1.User.findById(id)
            .select("-password")
            .populate("courseEnrolled");
        if (!user) {
            (0, sendError_1.default)("User Not Found", 404);
        }
        (0, sendSuccessMessage_1.sendSuccessMessage)(res, 200, "User Profile", user);
    }
    catch (error) {
        next(error);
    }
});
exports.getUserProfile = getUserProfile;
//------------------------------------------------UPDATE USER PROFILE------------------------------------------------
const updateUserProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { name } = req.body;
        const profilePhoto = req.file || "";
        const user = yield user_model_1.User.findById(req.id);
        if (!user) {
            return (0, sendError_1.default)("User Not Found", 404);
        }
        if (user.photoUrl) {
            const publicId = ((_a = user === null || user === void 0 ? void 0 : user.photoUrl.split("/").pop()) === null || _a === void 0 ? void 0 : _a.split(".")[0]) || "";
            yield (0, Cloudinary_1.deleteMedia)(publicId);
        }
        let cloudResponse;
        if (profilePhoto !== "") {
            cloudResponse = yield (0, Cloudinary_1.uploadMedia)(profilePhoto.path);
        }
        const photoUrl = (cloudResponse === null || cloudResponse === void 0 ? void 0 : cloudResponse.secure_url) || "";
        const updateData = { name, photoUrl };
        const updatedUser = yield user_model_1.User.findByIdAndUpdate(req.id, updateData, {
            new: true,
        }).select("-password");
        (0, sendSuccessMessage_1.sendSuccessMessage)(res, 204, "UserUpdated Successfully", updatedUser);
    }
    catch (error) {
        next(error);
    }
});
exports.updateUserProfile = updateUserProfile;
