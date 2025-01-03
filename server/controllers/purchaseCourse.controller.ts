import Stripe from "stripe";
import { AuthenticatedRequest } from "../utils/Interfaces";
import { NextFunction, Response } from "express";
import { Course } from "../Models/course.model";
import sendError from "../utils/sendError";
import { CoursePurchase } from "../Models/purchaseCourse.model";
import { sendSuccessMessage } from "../utils/sendSuccessMessage";
import { Lecture } from "../Models/lecture.model";
import { User } from "../Models/user.model";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export const createCheckoutSession = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.id;
    if (!userId) {
      return sendError("User ID not found", 400);
    }
    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return sendError("Course not found", 404);
    }

    const newPurchase = new CoursePurchase({
      courseId,
      userId,
      amount: course?.coursePrice,
      status: "pending",
    });
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: course.courseTitle,
              images: [course.courseThumbnail ?? ""],
            },
            unit_amount: Math.round((course?.coursePrice ?? 0) * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/course-progress/${courseId}`,
      cancel_url: `${process.env.FRONTEND_URL}/course-detail/${courseId}`,
      metadata: {
        courseId: courseId.toString(),
        userId: userId.toString(),
      },
      shipping_address_collection: {
        allowed_countries: ["IN"],
      },
    });

    // Save the purchase record
    newPurchase.paymentId = session.id;
    await newPurchase.save();

    sendSuccessMessage(res, 200, "Session created successfully", session.url);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const stripeWebhook = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let event;

  try {
    const payloadString = JSON.stringify(req.body, null, 2);
    const secret = process.env.WEBHOOK_ENDPOINT_SECRET || "";

    const header = stripe.webhooks.generateTestHeaderString({
      payload: payloadString,
      secret,
    });

    event = stripe.webhooks.constructEvent(payloadString, header, secret);
  } catch (error: any) {
    console.error("Webhook error:", error.message);
    sendError(`Webhook error: ${error.message}`, 400);
  }

  // Handle the checkout session completed event
  if (event?.type === "checkout.session.completed") {
    console.log("check session complete is called");

    try {
      const session = event.data.object;

      const purchase: any = await CoursePurchase.findOne({
        paymentId: session.id,
      }).populate({ path: "courseId" });

      if (!purchase) {
        sendError("Purchase not found", 404);
      }

      if (session.amount_total) {
        purchase.amount = session.amount_total / 100;
      }
      purchase.status = "completed";

      // Make all lectures visible by setting `isPreviewFree` to true
      if (purchase.courseId && purchase.courseId.lectures.length > 0) {
        await Lecture.updateMany(
          { _id: { $in: purchase.courseId.lectures } },
          { $set: { isPreviewFree: true } }
        );
      }

      await purchase.save();

      // Update user's enrolledCourses
      await User.findByIdAndUpdate(
        purchase.userId,
        { $addToSet: { courseEnrolled: purchase.courseId._id } }, // Add course ID to enrolledCourses
        { new: true }
      );

      // Update course to add user ID to enrolledStudents
      await Course.findByIdAndUpdate(
        purchase.courseId._id,
        { $addToSet: { enrolledStudents: purchase.userId } }, // Add user ID to enrolledStudents
        { new: true }
      );
    } catch (error) {
      next(error);
    }
  }
  res.status(200).send();
};

export const getCourseDetailwithPurchaseStatus = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;
    if (!userId) {
      return sendError("User ID not found", 400);
    }
    const course = await Course.findById(courseId)
      .populate({ path: "creator" })
      .populate({ path: "lectures" });
    if (!course) {
      return sendError("Course not found", 404);
    }
    const purchase = await CoursePurchase.findOne({ courseId, userId });
    sendSuccessMessage(res, 200, "Course found", { course, purchase });
  } catch (error) {
    next(error);
  }
};

//=======================================================PurchasedCourse=============================

export const getAllPurchasedCourses = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.id;
    let purchasedCourse: any = await CoursePurchase.find({
      status: "completed",
    }).populate({
      path: "courseId",
    });
    console.log(purchasedCourse[0]?.courseId?.creator.toString());
    const filterPurchaseCourse = purchasedCourse.filter(
      (course: any) => course?.courseId?.creator?.toString() === userId
    );
    // console.log(filterPurchaseCourse, userId);

    sendSuccessMessage(res, 200, "Purchased Courses", filterPurchaseCourse);
  } catch (error) {
    next(error);
  }
};
