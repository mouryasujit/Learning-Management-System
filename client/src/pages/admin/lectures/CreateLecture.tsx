import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import {
  useCreateLectureMutation,
  useGetCourseLectureQuery,
} from "@/features/api/courseApi";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import Lecture from "./lecture";
import { lectures } from "@/assets/Types/interfaces";

const CreateLecture = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [lectureTitle, setLectureTitle] = useState("");
  const courseId = params.courseId;
  const [createLecture, { isLoading, data, isSuccess, error }] =
    useCreateLectureMutation();

  const {
    data: lectureData,
    isLoading: lectureLoading,
    isSuccess: lectureSuccess,
    error: lectureError,
  } = useGetCourseLectureQuery(courseId);
  //---------------------------------------Handlers---------------------------------------------------------
  const onclickHandlers = async () => {
    await createLecture({ lectureTitle, courseId });
  };

  useEffect(() => {
    if (lectureError) {
      toast.error("cannot Fetch Lectures of this course");
    }
  }, [lectureSuccess, lectureError]);
  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Lecture created Successfully");
      setLectureTitle("");
    }
    if (error && "data" in error) {
      console.log(error.data);
      toast.error(
        (error.data as { message?: string })?.message ||
          "Something went Wrong Try Again"
      );
    }
  }, [error, isSuccess]);
  return (
    <div
      className="w-full flex flex-col items-start justify-start
     h-full py-4 space-y-4 px-4 md:px-0 md:pl-6 "
    >
      {(isLoading || lectureLoading) && <LoadingSpinner />}
      <div className="">
        <h3 className="font-bold text-xl">
          Lets Add Lecture, Here put Some basic Details for Lecture
        </h3>
        <p className="text-sm">Details include </p>
      </div>
      <div>
        <div className="flex justify-center items-center my-4 space-x-4 ">
          <Label>Lecture Name</Label>
          <Input
            type="text"
            name="lectureTitle"
            placeholder="Enter Lecture Name"
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
          />
        </div>

        <div className="flex justify-start space-x-4 my-4">
          <Button
            variant="outline"
            onClick={() => navigate(`/admin/course/${courseId}`)}
          >
            Back
          </Button>
          <Button className="" onClick={onclickHandlers}>
            Create Lecture
          </Button>
        </div>
        <div className="mt-10 w-full ">
          {lectureLoading ? (
            <p>Loading lectures...</p>
          ) : lectureError ? (
            <p>Failed to load lectures.</p>
          ) : lectureData?.payload?.lectures?.length === 0 ? (
            <p>No lectures availabe</p>
          ) : (
            <>
              {lectureData?.payload?.map((lecture: lectures, index: number) => (
                <Lecture key={lecture._id} lecture={lecture} index={index} />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateLecture;
