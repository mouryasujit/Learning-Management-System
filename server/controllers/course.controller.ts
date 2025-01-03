import mongoose, { SortOrder } from "mongoose";
import { AuthenticatedRequest } from "../utils/Interfaces";
import { NextFunction, Response } from "express";
import sendError from "../utils/sendError";
import { Course } from "../Models/course.model";
import { sendSuccessMessage } from "../utils/sendSuccessMessage";
import {
  deleteMedia,
  deleteVideofromCLoudinary,
  uploadMedia,
} from "../utils/Cloudinary";
import { Lecture } from "../Models/lecture.model";
//-----------------------------------------------------create Course Handler---------------------------
export const createCourse = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { courseTitle, category } = await req.body;
    if (!courseTitle || !category) {
      sendError("Please Fill all the required Fields", 400);
    }
    const course = await Course.create({
      courseTitle,
      category,
      creator: req.id,
    });
    sendSuccessMessage(res, 201, "Course Created Successfully", course);
  } catch (error) {
    next(error);
  }
};
//----------------------------------------------------------Get all the courses of handler-----------------------------------
export const getCreatorCourses = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const UserId = req.id;
    let courses = await Course.find({ creator: UserId });
    if (!courses) {
      courses = [];
    }
    sendSuccessMessage(res, 200, "The courses are", courses);
  } catch (error) {
    next(error);
  }
};

//-----------------------------------------------------editCourse----------------------------------------------------------
export const editCourse = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const courseId = req.params.courseId;
    const {
      courseTitle,
      subTitle,
      description,
      category,
      courseLevel,
      coursePrice,
    } = req.body;
    const Thumbnail = req.file;
    let course = await Course.findById(courseId);
    if (!course) {
      sendError("Course Not Found", 404);
    }
    let courseThumbnail;
    if (Thumbnail) {
      if (course?.courseThumbnail) {
        const publicId =
          course.courseThumbnail.split("/").pop()?.split(".")[0] || "";
        await deleteMedia(publicId);
      }
      courseThumbnail = await uploadMedia(Thumbnail.path);
    }
    const updateData = {
      courseTitle,
      subTitle,
      description,
      category,
      courseLevel,
      coursePrice,
      courseThumbnail: courseThumbnail?.secure_url,
    };

    course = await Course.findByIdAndUpdate(courseId, updateData, {
      new: true,
    });
    sendSuccessMessage(res, 200, "Updated Course Successfully", course);
  } catch (error) {
    next(error);
  }
};

//----------------------------------------------Get Course By Id----------------------------------------------------

export const getCourseById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const courseId = req.params.courseId;
    const course = await Course.findById(courseId);
    if (!course) {
      sendError("Course Not Found", 404);
    }
    sendSuccessMessage(res, 200, "Course Found", course);
  } catch (error) {
    next(error);
  }
};

//-----------------------------------------------create lectures of particular course--------------------------
export const createLecture = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { lectureTitle } = req.body;
    const { courseId } = req.params;
    if (!lectureTitle || !courseId) {
      sendError("Lecture Title is required", 400);
    }
    const course = await Course.findById(courseId);
    if (!course) {
      sendError("Course Does not Exists", 404);
    }
    const lecture = await Lecture.create({ lectureTitle });
    course?.lectures.push(lecture._id);
    await course?.save();
    sendSuccessMessage(res, 201, "lecture created Successfully", lecture);
  } catch (error) {
    next(error);
  }
};
//---------------------------------------get particular course lectures by id-----------------------------------------------
export const getcourseLecturs = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId).populate("lectures");
    if (!course) {
      sendError("Course Not Found", 404);
    }
    const lecturs = course?.lectures;
    sendSuccessMessage(
      res,
      200,
      "Course Details inside lectures Fields",
      lecturs
    );
  } catch (error) {
    next(error);
  }
};

//---------------------------------------------------------Edit lecture-------------------------------------------
export const editLecture = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { lectureTitle, videoInfo, isPreviewFree } = req.body;
    const { courseId, lectureId } = req.params;
    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return sendError("No lecture Found!", 404);
    }
    if (lectureTitle) lecture.lectureTitle = lectureTitle;
    if (videoInfo?.videoUrl) lecture.videoUrl = videoInfo.videoUrl;
    if (videoInfo?.publicId) lecture.publicId = videoInfo.publicId;
    lecture.isPreviewFree = isPreviewFree;

    await lecture.save();

    // Ensure the course still has the lecture id if it was not aleardy added;
    const course = await Course.findById(courseId);
    if (course && !course.lectures.includes(lecture._id)) {
      course.lectures.push(lecture._id);
      await course.save();
    }
    sendSuccessMessage(res, 200, "Lecture Updated Successfully", lecture);
  } catch (error) {
    next(error);
  }
};

//------------------------------------------------remove Lecture ----------------------------
export const removeLecture = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { lectureId } = req.params;
    const lecture = await Lecture.findByIdAndDelete(lectureId);
    if (!lecture) {
      return sendError("Lecture Not found", 404);
    }
    if (lecture.publicId) {
      await deleteVideofromCLoudinary(lecture.publicId);
    }
    await Course.updateOne(
      { lectures: lectureId },
      { $pull: { lectures: lectureId } }
    );
    sendSuccessMessage(res, 200, "Lecture Removed Succesfully");
  } catch (error) {
    next(error);
  }
};

export const getLectureById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { lectureId } = req.params;
    const lecture = Lecture.findById(lectureId);
    if (!lecture) {
      sendError("Lecture Not Found", 404);
    }
    sendSuccessMessage(res, 200, "Lecture Found", lecture);
  } catch (error) {
    next(error);
  }
};

//--------------------------------------------toggleCoursePublish---------------------------------------
export const toggleCoursePublish = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { courseId } = req.params;
    const { publish } = req.query;
    const course = await Course.findById(courseId);
    if (!course) {
      return sendError("Course Not Found", 404);
    }
    if (course.lectures.length === 0) {
      return sendError("Please Add Lectures to Publish the Course", 400);
    }
    course.isPublished = publish === "true";
    course.save();
    console.log(publish);
    const publishStatus = publish === "true" ? "Published" : "Unpublished";
    sendSuccessMessage(res, 200, `Course ${publishStatus} Successfully`);
  } catch (error) {
    next(error);
  }
};

//=================================================Get Published Courses========================================
export const getPublishedCourses = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const courses = await Course.find({ isPublished: true }).populate({
      path: "creator",
      select: "name photoUrl",
    });
    sendSuccessMessage(res, 200, "Published Courses", courses);
  } catch (error) {
    next(error);
  }
};

//================================================Search Course By query=========================================
export const searchCourse = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      query = "",
      categories = [],
      sortByPrice = "",
    } = req.query as {
      query?: string;
      categories?: string[];
      sortByPrice?: string;
    };

    console.log(categories);

    // Create search query
    const searchCriteria: any = {
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
    const sortOptions: { [key: string]: SortOrder } = {};
    if (sortByPrice === "low") {
      sortOptions.coursePrice = 1; // Sort by price in ascending
    } else if (sortByPrice === "high") {
      sortOptions.coursePrice = -1; // Sort by price in descending
    }

    const courses = await Course.find(searchCriteria)
      .populate({ path: "creator", select: "name photoUrl" })
      .sort(sortOptions);

    sendSuccessMessage(res, 200, "Courses", courses);
  } catch (error) {
    next(error);
  }
};

//===================================================Remove Course===================================================

export const removeCourse = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId).populate("lectures");
    if (!course) {
      return sendError("Course Not Found", 404);
    }

    const courseThumbnailPublicId = course.courseThumbnail
      ?.split("/")
      .pop()
      ?.split(".")[0];
    if (courseThumbnailPublicId) {
      await deleteMedia(courseThumbnailPublicId);
    }

    await Promise.all(
      course.lectures.map(async (lectureId) => {
        const lecture = await Lecture.findByIdAndDelete(lectureId);
        if (!lecture) {
          throw new Error("Lecture Not Found");
        }
        if (lecture.publicId) {
          await deleteVideofromCLoudinary(lecture.publicId);
        }
      })
    );

    await Course.findByIdAndDelete(courseId);

    sendSuccessMessage(res, 200, "Course Deleted Successfully");
  } catch (error) {
    next(error);
  }
};
