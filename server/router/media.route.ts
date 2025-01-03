import express, { NextFunction, Response } from "express";
import uploads from "../utils/Multer";
import { uploadMedia } from "../utils/Cloudinary";
import { AuthenticatedRequest } from "../utils/Interfaces";
import sendError from "../utils/sendError";
import { sendSuccessMessage } from "../utils/sendSuccessMessage";

const Router = express.Router();
Router.post(
  "/uploads-video",
  uploads.single("file"),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (req.file) {
        try {
          const result = await uploadMedia(req?.file.path);
          sendSuccessMessage(res, 200, "File uplad Successful", result);
        } catch (error) {
          sendError("File couldn't be uploaded try again", 409);
        }
      } else {
        sendError("All fields are required", 400);
      }
    } catch (error) {
      next(error);
    }
  }
);

export default Router;