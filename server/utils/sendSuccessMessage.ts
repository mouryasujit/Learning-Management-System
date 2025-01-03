//message,success
import { Response } from "express";
import { SuccessResponse } from "./Interfaces";
export const sendSuccessMessage = (
  res: Response,
  statusCode: number,
  message: string,
  payload?: any
) => {
  const responseBody: SuccessResponse = {
    success: true,
    message: message,
  };

  if (payload) {
    responseBody.payload = payload;
  }
  return res.status(statusCode).json(responseBody);
};
