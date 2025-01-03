import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config({});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLODINARY_API_SECRET,
});

export const uploadMedia = async (file: string) => {
  try {
    const uploadResponse = await cloudinary.uploader.upload(file, {
      resource_type: "auto",
    });
    return uploadResponse;
  } catch (error) {
    console.log(error);
  }
};

export const deleteMedia = async (publicId: string) => {
  try {
    const deleteResponse = await cloudinary.uploader.destroy(publicId);
    return deleteResponse;
  } catch (error) {
    console.log(error);
  }
};
export const deleteVideofromCLoudinary = async (publicId: string) => {
  try {
    const deleteResponse = await cloudinary.uploader.destroy(publicId, {
      resource_type: "video",
    });
    return deleteResponse;
  } catch (error) {
    console.log(error);
  }
};
