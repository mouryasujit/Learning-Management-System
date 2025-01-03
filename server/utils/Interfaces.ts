import { Types } from "mongoose";
import { Request } from "express";

// Custom Error Interface
export interface customError extends Error {
  statusCode?: number;
}

// Success Response Interface
export interface SuccessResponse {
  success: boolean;
  message: string;
  payload?: any; // Optional payload
}

// User Interface
export interface UserInterface {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  role: string;
  courseEnrolled: Types.ObjectId[];
  photoUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

//extended request interface
export interface AuthenticatedRequest extends Request {
  id?: string;
}
export interface courses {
  _id: Types.ObjectId;
  courseTitle: string;
  category: string;
  enrolledStudents: string[];
  creator: Types.ObjectId;
  isPublished: boolean;
  lectures: string[];
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  courseLevel: string;
  coursePrice: number;
  courseThumbnail: string;
  description: string;
  subTitle: string;
  userId?: string;
}
export interface coursesTypes {
  _id: Types.ObjectId;
  courseId: courses;
}
