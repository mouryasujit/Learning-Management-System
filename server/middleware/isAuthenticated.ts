import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { customError } from "../utils/Interfaces";
import { AuthenticatedRequest } from "../utils/Interfaces";

const isAuthenticated = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token: string = req.cookies.token;
    if (!token) {
      const customError: customError = new Error("Please Login First");
      customError.statusCode = 401;
      throw customError;
    }

    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string
    );
    if (!decoded) {
      const customError: customError = new Error("Invalid Token");
      customError.statusCode = 401;
      throw customError;
    }

    req.id = decoded.userId;
    next();
  } catch (error) {
    next(error);
  }
};

export default isAuthenticated;
