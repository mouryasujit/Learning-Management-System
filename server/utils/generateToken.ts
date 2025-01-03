import jwt from "jsonwebtoken";
import { Response } from "express";
import { UserInterface } from "./Interfaces";
export const generateToken = async (
  res: Response,
  user: UserInterface,
  message: String
) => {
  const secret = process.env.JWT_SECRET_KEY || "";
  const token = await jwt.sign({ userId: user._id }, secret, {
    expiresIn: "1d",
  });
  return res
    .status(200)
    .cookie("token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    })
    .json({
      success: true,
      message,
      user,
    });
};
