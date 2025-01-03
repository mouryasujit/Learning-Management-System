import { Button } from "@/components/ui/button";
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
import { useCreateCourseMutation } from "@/features/api/courseApi";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AddCourse = () => {
  //----------------------------------------States------------------------------------------------------------------
  const navigate = useNavigate();
  const [createCourse, { isLoading, error, isSuccess }] =
    useCreateCourseMutation({});
  const [courseTitle, setcourseTitle] = useState("");
  const [category, setCategory] = useState("");
  //-------------------------------------------------change Handlers---------------------------------------------------
  const onvalueChangleHandler = (e: string) => {
    setCategory(e);
  };

  const onCreateHandler = async () => {
    try {
      await createCourse({ courseTitle, category });
    } catch (error) {
      console.log(error);
    }
  };
  //------------------------------------------------------Toast Messages for displaying success or errors---------------
  useEffect(() => {
    if (isSuccess) {
      toast.success("Course Created Successfully");
      navigate("/admin/course");
    }
    if (error) {
      if (error && "data" in error) {
        console.log(error.data);
        toast.error(
          (error.data as { message?: string })?.message ||
            "Something went Wrong Try Again"
        );
      }
    }
  }, [error, isSuccess]);
  return (
    <div
      className="w-full flex flex-col items-start justify-start
     h-full  py-4 space-y-4 px-4 md:px-0 md:pl-6 "
    >
      {isLoading && <LoadingSpinner />}
      <div className="">
        <h3 className="font-bold text-xl">
          Lets AddCourse,Here put Some basic Details for course
        </h3>
        <p className="text-sm">Details include </p>
      </div>
      <div>
        <div className="flex justify-center items-center my-4 space-x-4">
          <Label>Course Name</Label>
          <Input
            type="text"
            name="courseTitle"
            placeholder="Enter Course Name"
            value={courseTitle}
            onChange={(e) => setcourseTitle(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-4 ">
          <Label>Course Name</Label>
          <Select onValueChange={onvalueChangleHandler}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Category</SelectLabel>
                <SelectItem value="Next JS">Next JS</SelectItem>
                <SelectItem value="Data Science">Data Science</SelectItem>
                <SelectItem value="Frontend Development">
                  Frontend Development
                </SelectItem>
                <SelectItem value="Fullstack Development">
                  Fullstack Development
                </SelectItem>
                <SelectItem value="MERN Stack Development">
                  MERN Stack Development
                </SelectItem>
                <SelectItem value="Javascript">Javascript</SelectItem>
                <SelectItem value="Python">Python</SelectItem>
                <SelectItem value="Docker">Docker</SelectItem>
                <SelectItem value="MongoDB">MongoDB</SelectItem>
                <SelectItem value="HTML">HTML</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-start space-x-4 my-4">
          <Button variant="outline" onClick={() => navigate("/admin/course")}>
            Back
          </Button>
          <Button className="" onClick={onCreateHandler}>
            Create
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddCourse;
