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
exports.getAllPurchasedCourses = exports.getCourseDetailwithPurchaseStatus = exports.stripeWebhook = exports.createCheckoutSession = void 0;
const stripe_1 = __importDefault(require("stripe"));
const course_model_1 = require("../Models/course.model");
const sendError_1 = __importDefault(require("../utils/sendError"));
const purchaseCourse_model_1 = require("../Models/purchaseCourse.model");
const sendSuccessMessage_1 = require("../utils/sendSuccessMessage");
const lecture_model_1 = require("../Models/lecture.model");
const user_model_1 = require("../Models/user.model");
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
const createCheckoutSession = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const userId = req.id;
        if (!userId) {
            return (0, sendError_1.default)("User ID not found", 400);
        }
        const { courseId } = req.body;
        const course = yield course_model_1.Course.findById(courseId);
        if (!course) {
            return (0, sendError_1.default)("Course not found", 404);
        }
        const newPurchase = new purchaseCourse_model_1.CoursePurchase({
            courseId,
            userId,
            amount: course === null || course === void 0 ? void 0 : course.coursePrice,
            status: "pending",
        });
        const session = yield stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: course.courseTitle,
                            images: [(_a = course.courseThumbnail) !== null && _a !== void 0 ? _a : ""],
                        },
                        unit_amount: Math.round(((_b = course === null || course === void 0 ? void 0 : course.coursePrice) !== null && _b !== void 0 ? _b : 0) * 100),
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `https://learning-management-system-client.onrender.com/course-progress/${courseId}`,
            cancel_url: `https://learning-management-system-client.onrender.com//course-detail/${courseId}`,
            metadata: {
                courseId: courseId.toString(),
                userId: userId.toString(),
            },
            shipping_address_collection: {
                allowed_countries: ["IN"],
            },
        });
        // Save the purchase record
        newPurchase.paymentId = session.id;
        yield newPurchase.save();
        (0, sendSuccessMessage_1.sendSuccessMessage)(res, 200, "Session created successfully", session.url);
    }
    catch (error) {
        console.error(error);
        next(error);
    }
});
exports.createCheckoutSession = createCheckoutSession;
const stripeWebhook = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let event;
    try {
        const payloadString = JSON.stringify(req.body, null, 2);
        const secret = process.env.WEBHOOK_ENDPOINT_SECRET || "";
        const header = stripe.webhooks.generateTestHeaderString({
            payload: payloadString,
            secret,
        });
        event = stripe.webhooks.constructEvent(payloadString, header, secret);
    }
    catch (error) {
        console.error("Webhook error:", error.message);
        (0, sendError_1.default)(`Webhook error: ${error.message}`, 400);
    }
    // Handle the checkout session completed event
    if ((event === null || event === void 0 ? void 0 : event.type) === "checkout.session.completed") {
        console.log("check session complete is called");
        try {
            const session = event.data.object;
            const purchase = yield purchaseCourse_model_1.CoursePurchase.findOne({
                paymentId: session.id,
            }).populate({ path: "courseId" });
            if (!purchase) {
                (0, sendError_1.default)("Purchase not found", 404);
            }
            if (session.amount_total) {
                purchase.amount = session.amount_total / 100;
            }
            purchase.status = "completed";
            // Make all lectures visible by setting `isPreviewFree` to true
            if (purchase.courseId && purchase.courseId.lectures.length > 0) {
                yield lecture_model_1.Lecture.updateMany({ _id: { $in: purchase.courseId.lectures } }, { $set: { isPreviewFree: true } });
            }
            yield purchase.save();
            // Update user's enrolledCourses
            yield user_model_1.User.findByIdAndUpdate(purchase.userId, { $addToSet: { courseEnrolled: purchase.courseId._id } }, // Add course ID to enrolledCourses
            { new: true });
            // Update course to add user ID to enrolledStudents
            yield course_model_1.Course.findByIdAndUpdate(purchase.courseId._id, { $addToSet: { enrolledStudents: purchase.userId } }, // Add user ID to enrolledStudents
            { new: true });
        }
        catch (error) {
            next(error);
        }
    }
    res.status(200).send();
});
exports.stripeWebhook = stripeWebhook;
const getCourseDetailwithPurchaseStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { courseId } = req.params;
        const userId = req.id;
        if (!userId) {
            return (0, sendError_1.default)("User ID not found", 400);
        }
        const course = yield course_model_1.Course.findById(courseId)
            .populate({ path: "creator" })
            .populate({ path: "lectures" });
        if (!course) {
            return (0, sendError_1.default)("Course not found", 404);
        }
        const purchase = yield purchaseCourse_model_1.CoursePurchase.findOne({ courseId, userId });
        (0, sendSuccessMessage_1.sendSuccessMessage)(res, 200, "Course found", { course, purchase });
    }
    catch (error) {
        next(error);
    }
});
exports.getCourseDetailwithPurchaseStatus = getCourseDetailwithPurchaseStatus;
//=======================================================PurchasedCourse=============================
const getAllPurchasedCourses = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const userId = req.id;
        let purchasedCourse = yield purchaseCourse_model_1.CoursePurchase.find({
            status: "completed",
        }).populate({
            path: "courseId",
        });
        console.log((_b = (_a = purchasedCourse[0]) === null || _a === void 0 ? void 0 : _a.courseId) === null || _b === void 0 ? void 0 : _b.creator.toString());
        const filterPurchaseCourse = purchasedCourse.filter((course) => { var _a, _b; return ((_b = (_a = course === null || course === void 0 ? void 0 : course.courseId) === null || _a === void 0 ? void 0 : _a.creator) === null || _b === void 0 ? void 0 : _b.toString()) === userId; });
        // console.log(filterPurchaseCourse, userId);
        (0, sendSuccessMessage_1.sendSuccessMessage)(res, 200, "Purchased Courses", filterPurchaseCourse);
    }
    catch (error) {
        next(error);
    }
});
exports.getAllPurchasedCourses = getAllPurchasedCourses;
