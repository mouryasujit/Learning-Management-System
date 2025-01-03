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
exports.removeCourse = exports.searchCourse = exports.getPublishedCourses = exports.toggleCoursePublish = exports.getLectureById = exports.removeLecture = exports.editLecture = exports.getcourseLecturs = exports.createLecture = exports.getCourseById = exports.editCourse = exports.getCreatorCourses = exports.createCourse = void 0;
const sendError_1 = __importDefault(require("../utils/sendError"));
const course_model_1 = require("../Models/course.model");
const sendSuccessMessage_1 = require("../utils/sendSuccessMessage");
const Cloudinary_1 = require("../utils/Cloudinary");
const lecture_model_1 = require("../Models/lecture.model");
//-----------------------------------------------------create Course Handler---------------------------
const createCourse = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { courseTitle, category } = yield req.body;
        if (!courseTitle || !category) {
            (0, sendError_1.default)("Please Fill all the required Fields", 400);
        }
        const course = yield course_model_1.Course.create({
            courseTitle,
            category,
            creator: req.id,
        });
        (0, sendSuccessMessage_1.sendSuccessMessage)(res, 201, "Course Created Successfully", course);
    }
    catch (error) {
        next(error);
    }
});
exports.createCourse = createCourse;
//----------------------------------------------------------Get all the courses of handler-----------------------------------
const getCreatorCourses = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const UserId = req.id;
        let courses = yield course_model_1.Course.find({ creator: UserId });
        if (!courses) {
            courses = [];
        }
        (0, sendSuccessMessage_1.sendSuccessMessage)(res, 200, "The courses are", courses);
    }
    catch (error) {
        next(error);
    }
});
exports.getCreatorCourses = getCreatorCourses;
//-----------------------------------------------------editCourse----------------------------------------------------------
const editCourse = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const courseId = req.params.courseId;
        const { courseTitle, subTitle, description, category, courseLevel, coursePrice, } = req.body;
        const Thumbnail = req.file;
        let course = yield course_model_1.Course.findById(courseId);
        if (!course) {
            (0, sendError_1.default)("Course Not Found", 404);
        }
        let courseThumbnail;
        if (Thumbnail) {
            if (course === null || course === void 0 ? void 0 : course.courseThumbnail) {
                const publicId = ((_a = course.courseThumbnail.split("/").pop()) === null || _a === void 0 ? void 0 : _a.split(".")[0]) || "";
                yield (0, Cloudinary_1.deleteMedia)(publicId);
            }
            courseThumbnail = yield (0, Cloudinary_1.uploadMedia)(Thumbnail.path);
        }
        const updateData = {
            courseTitle,
            subTitle,
            description,
            category,
            courseLevel,
            coursePrice,
            courseThumbnail: courseThumbnail === null || courseThumbnail === void 0 ? void 0 : courseThumbnail.secure_url,
        };
        course = yield course_model_1.Course.findByIdAndUpdate(courseId, updateData, {
            new: true,
        });
        (0, sendSuccessMessage_1.sendSuccessMessage)(res, 200, "Updated Course Successfully", course);
    }
    catch (error) {
        next(error);
    }
});
exports.editCourse = editCourse;
//----------------------------------------------Get Course By Id----------------------------------------------------
const getCourseById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courseId = req.params.courseId;
        const course = yield course_model_1.Course.findById(courseId);
        if (!course) {
            (0, sendError_1.default)("Course Not Found", 404);
        }
        (0, sendSuccessMessage_1.sendSuccessMessage)(res, 200, "Course Found", course);
    }
    catch (error) {
        next(error);
    }
});
exports.getCourseById = getCourseById;
//-----------------------------------------------create lectures of particular course--------------------------
const createLecture = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { lectureTitle } = req.body;
        const { courseId } = req.params;
        if (!lectureTitle || !courseId) {
            (0, sendError_1.default)("Lecture Title is required", 400);
        }
        const course = yield course_model_1.Course.findById(courseId);
        if (!course) {
            (0, sendError_1.default)("Course Does not Exists", 404);
        }
        const lecture = yield lecture_model_1.Lecture.create({ lectureTitle });
        course === null || course === void 0 ? void 0 : course.lectures.push(lecture._id);
        yield (course === null || course === void 0 ? void 0 : course.save());
        (0, sendSuccessMessage_1.sendSuccessMessage)(res, 201, "lecture created Successfully", lecture);
    }
    catch (error) {
        next(error);
    }
});
exports.createLecture = createLecture;
//---------------------------------------get particular course lectures by id-----------------------------------------------
const getcourseLecturs = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { courseId } = req.params;
        const course = yield course_model_1.Course.findById(courseId).populate("lectures");
        if (!course) {
            (0, sendError_1.default)("Course Not Found", 404);
        }
        const lecturs = course === null || course === void 0 ? void 0 : course.lectures;
        (0, sendSuccessMessage_1.sendSuccessMessage)(res, 200, "Course Details inside lectures Fields", lecturs);
    }
    catch (error) {
        next(error);
    }
});
exports.getcourseLecturs = getcourseLecturs;
//---------------------------------------------------------Edit lecture-------------------------------------------
const editLecture = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { lectureTitle, videoInfo, isPreviewFree } = req.body;
        const { courseId, lectureId } = req.params;
        const lecture = yield lecture_model_1.Lecture.findById(lectureId);
        if (!lecture) {
            return (0, sendError_1.default)("No lecture Found!", 404);
        }
        if (lectureTitle)
            lecture.lectureTitle = lectureTitle;
        if (videoInfo === null || videoInfo === void 0 ? void 0 : videoInfo.videoUrl)
            lecture.videoUrl = videoInfo.videoUrl;
        if (videoInfo === null || videoInfo === void 0 ? void 0 : videoInfo.publicId)
            lecture.publicId = videoInfo.publicId;
        lecture.isPreviewFree = isPreviewFree;
        yield lecture.save();
        // Ensure the course still has the lecture id if it was not aleardy added;
        const course = yield course_model_1.Course.findById(courseId);
        if (course && !course.lectures.includes(lecture._id)) {
            course.lectures.push(lecture._id);
            yield course.save();
        }
        (0, sendSuccessMessage_1.sendSuccessMessage)(res, 200, "Lecture Updated Successfully", lecture);
    }
    catch (error) {
        next(error);
    }
});
exports.editLecture = editLecture;
//------------------------------------------------remove Lecture ----------------------------
const removeLecture = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { lectureId } = req.params;
        const lecture = yield lecture_model_1.Lecture.findByIdAndDelete(lectureId);
        if (!lecture) {
            return (0, sendError_1.default)("Lecture Not found", 404);
        }
        if (lecture.publicId) {
            yield (0, Cloudinary_1.deleteVideofromCLoudinary)(lecture.publicId);
        }
        yield course_model_1.Course.updateOne({ lectures: lectureId }, { $pull: { lectures: lectureId } });
        (0, sendSuccessMessage_1.sendSuccessMessage)(res, 200, "Lecture Removed Succesfully");
    }
    catch (error) {
        next(error);
    }
});
exports.removeLecture = removeLecture;
const getLectureById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { lectureId } = req.params;
        const lecture = lecture_model_1.Lecture.findById(lectureId);
        if (!lecture) {
            (0, sendError_1.default)("Lecture Not Found", 404);
        }
        (0, sendSuccessMessage_1.sendSuccessMessage)(res, 200, "Lecture Found", lecture);
    }
    catch (error) {
        next(error);
    }
});
exports.getLectureById = getLectureById;
//--------------------------------------------toggleCoursePublish---------------------------------------
const toggleCoursePublish = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { courseId } = req.params;
        const { publish } = req.query;
        const course = yield course_model_1.Course.findById(courseId);
        if (!course) {
            return (0, sendError_1.default)("Course Not Found", 404);
        }
        if (course.lectures.length === 0) {
            return (0, sendError_1.default)("Please Add Lectures to Publish the Course", 400);
        }
        course.isPublished = publish === "true";
        course.save();
        console.log(publish);
        const publishStatus = publish === "true" ? "Published" : "Unpublished";
        (0, sendSuccessMessage_1.sendSuccessMessage)(res, 200, `Course ${publishStatus} Successfully`);
    }
    catch (error) {
        next(error);
    }
});
exports.toggleCoursePublish = toggleCoursePublish;
//=================================================Get Published Courses========================================
const getPublishedCourses = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courses = yield course_model_1.Course.find({ isPublished: true }).populate({
            path: "creator",
            select: "name photoUrl",
        });
        (0, sendSuccessMessage_1.sendSuccessMessage)(res, 200, "Published Courses", courses);
    }
    catch (error) {
        next(error);
    }
});
exports.getPublishedCourses = getPublishedCourses;
//================================================Search Course By query=========================================
const searchCourse = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { query = "", categories = [], sortByPrice = "", } = req.query;
        console.log(categories);
        // Create search query
        const searchCriteria = {
            isPublished: true,
            $or: [
                { courseTitle: { $regex: query, $options: "i" } },
                { subTitle: { $regex: query, $options: "i" } },
                { category: { $regex: query, $options: "i" } },
            ],
        };
        // If categories are selected
        if (categories.length > 0) {
            searchCriteria.category = { $in: categories };
        }
        // Define sorting order
        const sortOptions = {};
        if (sortByPrice === "low") {
            sortOptions.coursePrice = 1; // Sort by price in ascending
        }
        else if (sortByPrice === "high") {
            sortOptions.coursePrice = -1; // Sort by price in descending
        }
        const courses = yield course_model_1.Course.find(searchCriteria)
            .populate({ path: "creator", select: "name photoUrl" })
            .sort(sortOptions);
        (0, sendSuccessMessage_1.sendSuccessMessage)(res, 200, "Courses", courses);
    }
    catch (error) {
        next(error);
    }
});
exports.searchCourse = searchCourse;
//===================================================Remove Course===================================================
const removeCourse = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { courseId } = req.params;
        const course = yield course_model_1.Course.findById(courseId).populate("lectures");
        if (!course) {
            return (0, sendError_1.default)("Course Not Found", 404);
        }
        const courseThumbnailPublicId = (_b = (_a = course.courseThumbnail) === null || _a === void 0 ? void 0 : _a.split("/").pop()) === null || _b === void 0 ? void 0 : _b.split(".")[0];
        if (courseThumbnailPublicId) {
            yield (0, Cloudinary_1.deleteMedia)(courseThumbnailPublicId);
        }
        yield Promise.all(course.lectures.map((lectureId) => __awaiter(void 0, void 0, void 0, function* () {
            const lecture = yield lecture_model_1.Lecture.findByIdAndDelete(lectureId);
            if (!lecture) {
                throw new Error("Lecture Not Found");
            }
            if (lecture.publicId) {
                yield (0, Cloudinary_1.deleteVideofromCLoudinary)(lecture.publicId);
            }
        })));
        yield course_model_1.Course.findByIdAndDelete(courseId);
        (0, sendSuccessMessage_1.sendSuccessMessage)(res, 200, "Course Deleted Successfully");
    }
    catch (error) {
        next(error);
    }
});
exports.removeCourse = removeCourse;
