import { NextFunction, Request, Response } from "express";
import { User } from "../Models/user.model";
import bcrypt from "bcryptjs";
import { AuthenticatedRequest, customError } from "../utils/Interfaces";
import { sendSuccessMessage } from "../utils/sendSuccessMessage";
import { generateToken } from "../utils/generateToken";
import sendError from "../utils/sendError";
import { deleteMedia, uploadMedia } from "../utils/Cloudinary";

//------------------------------------------------REGISTER------------------------------------------------
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      sendError("Please Fill all input Fields", 400);
    }

    const user = await User.findOne({ email });
    if (user) {
      sendError("User Already Exists", 400);
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser =await  User.create({
      name,
      email,
      password: hashPassword,
      role,
    });
    console.log(newUser);
    sendSuccessMessage(res, 201, "User Created Succesfully");
  } catch (error) {
    next(error);
  }
};
//------------------------------------------------LOGIN------------------------------------------------
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      sendError("Please Fill all input Fields", 400);
    }
    const user = await User.findOne({ email });
    if (!user) {
      return sendError("Incorrect Email or Password", 404);
    }
    const hashPassword: string = user.password;
    const isPasswordCorrect: boolean = await bcrypt.compare(
      password,
      hashPassword
    );
    if (!isPasswordCorrect) {
      sendError("Incorrect Email or Password", 404);
    }
    const { password: userPassword, ...withoutPassword } = user.toObject();
    console.log(withoutPassword);

    generateToken(
      res,
      withoutPassword,
      `Hello user ${user.name} welcome Back 👋 `
    );
  } catch (error) {
    next(error);
  }
};
//------------------------------------------------LOGOUT------------------------------------------------

export const Logout = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    return res
      .status(200)
      .cookie("token", "", { maxAge: 0 })
      .json({ message: "Logout Successfully", success: true });
  } catch (error) {
    next(error);
  }
};

//------------------------------------------------GET USER PROFILE------------------------------------------------
export const getUserProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.id;
    const user = await User.findById(id)
      .select("-password")
      .populate("courseEnrolled");
    if (!user) {
      sendError("User Not Found", 404);
    }
    sendSuccessMessage(res, 200, "User Profile", user);
  } catch (error) {
    next(error);
  }
};

//------------------------------------------------UPDATE USER PROFILE------------------------------------------------
export const updateUserProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name } = req.body;
    const profilePhoto = req.file || "";
    const user = await User.findById(req.id);
    if (!user) {
      return sendError("User Not Found", 404);
    }
    if (user.photoUrl) {
      const publicId: string =
        user?.photoUrl.split("/").pop()?.split(".")[0] || "";
      await deleteMedia(publicId);
    }
    let cloudResponse;
    if (profilePhoto !== "") {
      cloudResponse = await uploadMedia(
        (profilePhoto as Express.Multer.File).path
      );
    }
    const photoUrl = cloudResponse?.secure_url || "";
    const updateData = { name, photoUrl };
    const updatedUser = await User.findByIdAndUpdate(req.id, updateData, {
      new: true,
    }).select("-password");
    sendSuccessMessage(res, 204, "UserUpdated Successfully", updatedUser);
  } catch (error) {
    next(error);
  }
};
