/* eslint-disable react-hooks/exhaustive-deps */
import { lectures } from "@/assets/Types/interfaces";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import {
  useCompleteCourseMutation,
  useGetCourseProgressQuery,
  useInCompleteCourseMutation,
  useUpdateLectureProgressMutation,
} from "@/features/api/courseProgressApi";
import { CheckCircle, CheckCircle2, CirclePlay } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
interface progs {
  lectureId?: string;
  viewed?: boolean;
}
const CourseProgress = () => {
  const params = useParams();
  const courseId = params.courseId;
  const { data, isLoading, refetch, isSuccess } =
    useGetCourseProgressQuery(courseId);

  const [updateLectureProgress] = useUpdateLectureProgressMutation({});
  const [
    completeCourse,
    {
      data: markCompleteData,
      isSuccess: completedSuccess,
      isLoading: completedLoading,
    },
  ] = useCompleteCourseMutation({});
  const [
    inCompleteCourse,
    {
      data: markInCompleteData,
      isSuccess: inCompletedSuccess,
      isLoading: inCompletedLoading,
    },
  ] = useInCompleteCourseMutation({});

  const [currentLecture, setCurrentLecture] = useState<lectures>();

  // console.log(data);

  // initialze the first lecture if not exist
  const initialLecture =
    currentLecture ||
    (data?.payload?.courseDetails?.lectures &&
      data?.payload?.courseDetails?.lectures[0]);

  const isLectureCompleted = (lectureId: string) => {
    return data?.payload?.progress.some(
      (prog: progs) => prog?.lectureId === lectureId && prog?.viewed
    );
  };

  const handleLectureProgress = async (lectureId: string) => {
    await updateLectureProgress({ courseId, lectureId });
    refetch();
  };
  // Handle select a specific lecture to watch
  const handleSelectLecture = (lecture: lectures) => {
    setCurrentLecture(lecture);
    handleLectureProgress(lecture?._id as string);
  };

  const handleCompleteCourse = async () => {
    await completeCourse(courseId);
    refetch();
  };
  const handleInCompleteCourse = async () => {
    await inCompleteCourse(courseId);
    refetch();
  };

  useEffect(() => {
    if (data?.payload) {
      setCurrentLecture(
        data?.payload?.courseDetails?.lectures &&
          data?.payload?.courseDetails?.lectures[0]
      );
    }
  }, [data, isSuccess]);
  useEffect(() => {
    // console.log(markCompleteData);

    if (completedSuccess) {
      refetch();
      toast.success(markCompleteData?.message);
    }
    if (inCompletedSuccess) {
      refetch();
      toast.success(markInCompleteData?.message);
    }
  }, [completedSuccess, inCompletedSuccess]);
  return (
    <>
      {isSuccess == true && (
        <div className="max-w-7xl mx-auto py-20 px-4 md:px-0">
          {/* Display course name  */}
          {(isLoading || inCompletedLoading || completedLoading) && (
            <LoadingSpinner />
          )}
          <div className="flex justify-between mb-4">
            <h1 className="text-2xl font-bold">
              {data?.payload?.courseDetails?.courseTitle}
            </h1>
            <Button
              onClick={
                data?.payload?.completed
                  ? handleInCompleteCourse
                  : handleCompleteCourse
              }
              variant={data?.payload?.completed ? "outline" : "default"}
            >
              {data?.payload?.completed ? (
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />{" "}
                  <span>Completed</span>{" "}
                </div>
              ) : (
                "Mark as completed"
              )}
            </Button>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Video section  */}
            <div className="flex-1 md:w-3/5 h-fit rounded-lg shadow-lg p-4">
              <div>
                <video
                  src={currentLecture?.videoUrl || initialLecture?.videoUrl}
                  controls
                  className="w-full h-auto md:rounded-lg"
                  onPlay={() =>
                    handleLectureProgress(
                      currentLecture?._id || initialLecture?._id
                    )
                  }
                />
              </div>
              {/* Display current watching lecture title */}
              <div className="mt-2 ">
                <h3 className="font-medium text-lg">
                  {`Lecture ${
                    data?.payload?.courseDetails.lectures.findIndex(
                      (lec: lectures) =>
                        lec._id === (currentLecture?._id || initialLecture?._id)
                    ) + 1
                  } : ${
                    currentLecture?.lectureTitle || initialLecture?.lectureTitle
                  }`}
                </h3>
              </div>
            </div>
            {/* Lecture Sidebar  */}
            <div className="flex flex-col w-full md:w-2/5 border-t md:border-t-0 md:border-l border-gray-200 md:pl-4 pt-4 md:pt-0">
              <h2 className="font-semibold text-xl mb-4">Course Lecture</h2>
              <div className="flex-1 overflow-y-auto">
                {data?.payload?.courseDetails?.lectures.map(
                  (lecture: lectures) => (
                    <Card
                      key={lecture._id}
                      className={`mb-3 hover:cursor-pointer transition transform ${
                        lecture._id === currentLecture?._id
                          ? "bg-gray-200 dark:dark:bg-gray-800"
                          : ""
                      } `}
                      onClick={() => handleSelectLecture(lecture)}
                    >
                      <CardContent className="flex items-center justify-between p-4">
                        <div className="flex items-center">
                          {isLectureCompleted(lecture?._id as string) ? (
                            <CheckCircle2
                              size={24}
                              className="text-green-500 mr-2"
                            />
                          ) : (
                            <CirclePlay
                              size={24}
                              className="text-gray-500 mr-2"
                            />
                          )}
                          <div>
                            <CardTitle className="text-lg font-medium">
                              {lecture?.lectureTitle}
                            </CardTitle>
                          </div>
                        </div>
                        {isLectureCompleted(lecture?._id as string) && (
                          <Button
                            variant={"outline"}
                            className="bg-green-200 text-green-600"
                          >
                            Completed
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CourseProgress;
