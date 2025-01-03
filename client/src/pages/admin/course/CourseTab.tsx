/* eslint-disable react-hooks/exhaustive-deps */
import { courses } from "@/assets/Types/interfaces";
import RichTextEditor from "@/components/RichTextEditor";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useEditCourseMutation,
  useGetSingleCourseQuery,
  usePublishCourseMutation,
  useRemoveCourseMutation,
} from "@/features/api/courseApi";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const CourseTab = () => {
  //------------------------------------------states------------------------------------------------------
  const [previewFile, setpreviewFile] = useState<string | null | File>();
  const [input, setInput] = useState<courses>({
    courseTitle: "",
    subTitle: "",
    description: "",
    category: "",
    courseLevel: "",
    coursePrice: 0,
    courseThumbnail: null,
  });

  const navigate = useNavigate();
  const params = useParams();
  const courseId = params.courseId;
  const [editCourse, { isLoading, isSuccess, error, data }] =
    useEditCourseMutation({});
  const [
    removeCourse,
    {
      isSuccess: RemoveCourseSuccess,
      isLoading: RemoveCourseLoading,
      error: RemoveCourseError,
    },
  ] = useRemoveCourseMutation({});
  const {
    isLoading: isSingleCourseLoading,
    data: isSingleCourseData,
    refetch,
  } = useGetSingleCourseQuery(courseId, { refetchOnMountOrArgChange: true });

  const [publishCourse, { data: publishCourseData, error: isPublisedError }] =
    usePublishCourseMutation({});
  //---------------changle handlers----------------------------------------------------------------------
  const onvalueChangleHandler = (value: string) => {
    setInput({ ...input, category: value });
  };
  const onvalueChangleHandler2 = (value: string) => {
    setInput({ ...input, courseLevel: value });
  };
  const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };
  //-----------------------------------------File reader or Image Preview Function---------------------------
  const setFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput({ ...input, courseThumbnail: file });
      setpreviewFile(file);
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        if (fileReader.result) {
          setpreviewFile(fileReader.result?.toString());
        }
      };
      fileReader.readAsDataURL(file);
    }
  };

  //-------------------------------------------------------------------------------

  //------------------------------------------------Api calls for updating-----------------------
  const updateCourseHandler = async () => {
    const formData = new FormData();
    Object.entries(input).forEach(([key, value]) => {
      formData.append(key, value);
    });
    await editCourse({ formData, courseId });
  };

  const puslishStatusHandler = async (action: boolean) => {
    try {
      const res = await publishCourse({ courseId, action });
      if (res?.data) {
        refetch();
        toast.success(
          publishCourseData?.message || "Course Updated Successfully"
        );
        navigate(`/admin/course`);
      }
    } catch (error) {
      if (error && typeof error === "object" && "data" in error) {
        console.log("This is the error we got", error);
        toast.error(
          (error.data as { message?: string })?.message ||
            "Something went Wrong Try Again"
        );
      }
    }
  };

  const RemoveCourseHandler = async () => {
    await removeCourse({ courseId });
  };
  //-----------------------------------useEffects for everything-------------------------------
  useEffect(() => {
    // console.log(isSingleCourseData);
    if (isSingleCourseData) {
      const course = isSingleCourseData?.payload;

      setInput({
        courseTitle: course.courseTitle,
        subTitle: course.subTitle,
        description: course.description,
        category: course.category,
        courseLevel: course.courseLevel,
        coursePrice: course.coursePrice,
        courseThumbnail: "",
      });
    }
  }, [courseId, isSingleCourseData]);

  useEffect(() => {
    if (RemoveCourseSuccess) {
      toast.success("Course Removed Successfully");

      navigate("/admin/course");
    }
    if (RemoveCourseError) {
      if (
        RemoveCourseError &&
        typeof RemoveCourseError === "object" &&
        "data" in RemoveCourseError
      ) {
        console.log("This is the error we got", error);
        toast.error(
          (RemoveCourseError.data as { message?: string })?.message ||
            "Something went Wrong Try Again"
        );
      }
    }
  }, [RemoveCourseSuccess, RemoveCourseError]);
  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Course Updated SUccessfully");
    }
    if (error && "data" in error) {
      console.log(error.data);
      toast.error(
        (error.data as { message?: string })?.message ||
          "Something went Wrong Try Again"
      );
    }
  }, [isSuccess, error]);

  useEffect(() => {
    if (isPublisedError && "data" in isPublisedError) {
      toast.error(
        (isPublisedError.data as { message?: string })?.message ||
          "Cannot Publish course Try Again"
      );
    }
  }, [isPublisedError]);
  return (
    <Card className="px-4 md:px-0">
      {(isLoading || isSingleCourseLoading || RemoveCourseLoading) && (
        <LoadingSpinner />
      )}
      <CardHeader className="flex flex-col justify-between md:flex-row ">
        <div>
          <CardTitle>Basic Information About Course</CardTitle>
          <CardDescription>
            Makes Changes to you courses here. Click Save When you're Done
          </CardDescription>
        </div>
        <div className="space-x-4">
          <Button
            variant="outline"
            disabled={isSingleCourseData?.payload?.lectures?.length === 0}
            onClick={() =>
              puslishStatusHandler(!isSingleCourseData?.payload?.isPublished)
            }
          >
            {isSingleCourseData?.payload?.isPublished ? "UnPublish" : "Publish"}
          </Button>
          <Button onClick={RemoveCourseHandler}>Remove Course</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label>Course Title</Label>
            <Input
              type="text"
              name="courseTitle"
              value={input.courseTitle}
              onChange={changeEventHandler}
              placeholder="Ex. Fullstack Development"
            />
          </div>
          <div>
            <Label>Sub Title</Label>
            <Input
              type="text"
              name="subTitle"
              placeholder="Ex.Become a Fullstack Developer in 2 Months"
              value={input.subTitle}
              onChange={changeEventHandler}
            />
          </div>
          <div>
            <Label>Description</Label>
            <RichTextEditor input={input} setInput={setInput} />
          </div>
          <div className="flex flex-col space-x-2 md:flex-row ">
            <div>
              <Label>Category</Label>
              <Select onValueChange={onvalueChangleHandler}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Categorys</SelectLabel>
                    <SelectItem value="Nextjs">Next Js</SelectItem>
                    <SelectItem value="Mern-Stack-Development">
                      MERN Stack Development
                    </SelectItem>
                    <SelectItem value="Full-stack-Develepment">
                      Full stack Development
                    </SelectItem>
                    <SelectItem value="HTML">HTML</SelectItem>
                    <SelectItem value="Css-Complete">CSS Complete</SelectItem>
                    <SelectItem value="Backend-Complete">
                      Backend Complete
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Course Level</Label>
              <Select onValueChange={onvalueChangleHandler2}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Course Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Course Level</SelectLabel>
                    <SelectItem value="begineer">Begineer</SelectItem>
                    <SelectItem value="advance">Advance</SelectItem>
                    <SelectItem value="intermediate">intermediate</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Price</Label>
              <Input
                type="number"
                name="coursePrice"
                placeholder="₹"
                value={input.coursePrice}
                onChange={changeEventHandler}
              />
            </div>
          </div>
          <div>
            <Label>Course Thumbnail</Label>
            <Input
              type="file"
              name="courseThumbnail"
              placeholder="₹"
              accept="image/*"
              onChange={setFile}
            />
            {previewFile ? (
              <img
                src={typeof previewFile === "string" ? previewFile : undefined}
                className="w-64 my-2"
                alt="Image Preview"
              />
            ) : isSingleCourseData?.payload?.courseThumbnail ? (
              <img
                src={isSingleCourseData?.payload?.courseThumbnail}
                className="w-64 my-2"
                alt="Image Preview"
              />
            ) : (
              <p className="font-bold my-4">No File Selected</p>
            )}
          </div>
          <div className="flex space-x-2 pt-2">
            <Button variant="outline" onClick={() => navigate("/admin/course")}>
              Cancel
            </Button>
            <Button onClick={updateCourseHandler}>Save Changes</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseTab;
