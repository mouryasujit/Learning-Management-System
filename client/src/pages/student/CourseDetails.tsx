import BuyCourseButton from "@/components/BuyCourseButton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { SelectSeparator } from "@/components/ui/select";
import { useGetCourseDetailswithPurchaseStatusQuery } from "@/features/api/purchaseApi";
import { BadgeInfo, LockIcon, PlayCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import { lectures } from "@/assets/Types/interfaces";

const CourseDetails = () => {
  const navigate = useNavigate();
  const params = useParams();
  const courseId = params.courseId as string;

  const { data, isLoading } = useGetCourseDetailswithPurchaseStatusQuery({
    courseId,
  });

  const { course, purchase } = data?.payload ?? {};
  return (
    <div className="max-w-7xl mx-auto py-16 px-4 md:px-4 ">
      {isLoading && <LoadingSpinner />}
      <div className="bg-[#2D2F32] text-white py-8 rounded-md shadow-md px-4 md:px-4">
        <div className="flex flex-col gap-2">
          <h1 className="font-bold text-2xl">{course?.courseTitle}</h1>
          <p className="text-base">{course?.subTitle}</p>
          <p>
            Created By{" "}
            <span className="text-[#C0C4FC] underline italic">
              {course?.creator?.name}
            </span>
          </p>
          <p className="flex items-center gap-2">
            <BadgeInfo size={16} />{" "}
            <span>last Updated At {course?.updatedAt.split("T")[0]}</span>
          </p>
          <p>Students Enrolled {course?.enrolledStudents?.length}</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto my-5 px-8 flex flex-col md:flex-row justify-between gap-4">
        <div className="w-full lg:w-1/2 space-y-5 ">
          <h1 className="font-bold text-xl">Description</h1>
          <p
            className="text-sm"
            dangerouslySetInnerHTML={{ __html: course?.description }}
          />
          <Card>
            <CardHeader>
              <CardTitle>Course Title</CardTitle>
              <CardDescription>4 Lectures</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {course?.lectures.map((lecture: lectures, idx: number) => (
                <div key={idx} className="flex items-center gap-3 text-sm">
                  <span>
                    {(lecture?.isPreviewFree &&
                      purchase?.status === "completed") ||
                    idx === 0 ? (
                      <PlayCircle size={14} />
                    ) : (
                      <LockIcon size={14} />
                    )}
                  </span>
                  <p>{lecture?.lectureTitle}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        <div className="w-full lg:w-1/3 space-y-5">
          <Card>
            <CardContent className="p-4 flex flex-col">
              <div className="w-full aspect-video mb-4">
                <ReactPlayer
                  width={"100%"}
                  height={"100%"}
                  url={course?.lectures[0].videoUrl}
                  controls
                />
              </div>
              <h2>{course?.lectures[0].lectureTitle}</h2>
              <SelectSeparator className="my-2" />
              <h2 className="text-lg md:text-xl font-semibold">
                {" "}
                {course?.CoursePrice}
              </h2>
            </CardContent>
            <CardFooter className="flex justify-center py-2 px-4">
              {purchase?.status === "completed" ? (
                <Button
                  className="w-full"
                  onClick={() => navigate(`/course-progress/${courseId}`)}
                >
                  Continue Course
                </Button>
              ) : (
                <BuyCourseButton courseId={courseId} />
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
