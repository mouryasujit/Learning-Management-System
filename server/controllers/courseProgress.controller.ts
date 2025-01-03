import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../utils/Interfaces";
import { CourseProgress } from "../Models/courseProgress";
import { Course } from "../Models/course.model";
import sendError from "../utils/sendError";
import { sendSuccessMessage } from "../utils/sendSuccessMessage";

export const getCourseProgress = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { courseId } = req.params;
    const userId = req.id;
    let courseProgress = await CourseProgress.findOne({
      userId,
      courseId,
    }).populate("courseId");
    const courseDetails = await Course.findById(courseId).populate("lectures");
    if (!courseDetails) {
      sendError("Course not found", 404);
    }

    if (!courseProgress) {
      const data = { courseDetails, progress: [], completed: false };
      sendSuccessMessage(res, 200, "course Progess", data);
    }
    const data = {
      courseDetails,
      progress: courseProgress?.lectureProgress,
      completed: courseProgress?.completed,
    };
    sendSuccessMessage(res, 200, "course Progess", data);
  } catch (error) {
    next(error);
  }
};

export const updateLectureProgress = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { courseId, lectureId } = req.params;
    const userId = req.id;
    let courseProgress = await CourseProgress.findOne({
      userId,
      courseId,
    });
    if (!courseProgress) {
      courseProgress = new CourseProgress({
        userId,
        courseId,
        completed: false,
        lectureProgress: [],
      });
    }
    const lectureIndex = courseProgress.lectureProgress.findIndex(
      (lecture) => lecture.lectureId === lectureId
    );
    if (lectureIndex === -1) {
      courseProgress.lectureProgress.push({
        lectureId,
        viewed: true,
      });
    } else {
      courseProgress.lectureProgress[lectureIndex].viewed = true;
    }
    await courseProgress.save();
    const lectureProgressLength = courseProgress.lectureProgress.filter(
      (lecture) => lecture.viewed
    ).length;
    const courseDetails = await Course.findById(courseId);
    if (!courseDetails) {
      return sendError("Course not found", 404);
    }
    if (lectureProgressLength === courseDetails.lectures.length) {
      courseProgress.completed = true;
      await courseProgress.save();
    }
    sendSuccessMessage(res, 200, "Lecture Progress updated", courseProgress);
  } catch (error) {
    next(error);
  }
};

export const markAsCompleted = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;
    const courseProgress = await CourseProgress.findOne({ userId, courseId });
    if (!courseProgress) {
      return sendError("Course not found", 404);
    }
    courseProgress.lectureProgress.map((lecture) => (lecture.viewed = true));
    courseProgress.completed = true;
    courseProgress.save();
    sendSuccessMessage(res, 200, "Course marked as completed", courseProgress);
  } catch (error) {
    next(error);
  }
};
export const markAsinComplete = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { courseId } = req.params;
    const userId = req.id;
    const courseProgress = await CourseProgress.findOne({ userId, courseId });
    if (!courseProgress) {
      return sendError("Course not found", 404);
    }
    courseProgress.lectureProgress.map((lecture) => (lecture.viewed = false));
    courseProgress.completed = false;
    courseProgress.save();
    sendSuccessMessage(
      res,
      200,
      "Course marked as In completed successfull",
      courseProgress
    );
  } catch (error) {
    next(error);
  }
};
