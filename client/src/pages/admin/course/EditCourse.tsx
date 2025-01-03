import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import CourseTab from "./CourseTab";
// import { courses } from "@/assets/Types/interfaces";

const EditCourse = () => {
  return (
    <div
      className="w-full flex flex-col items-start justify-start
    h-full py-4 space-y-4 px-4 md:px-0 md:pl-6 "
    >
      <div className="w-full ">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-xl">
            Add Details information regarding Course
          </h3>
          <Link to="">
            <Button className="hover:bg-white hover:text-black transition-all duration-300">
              <Link to="lecture">Go to Lecture Upload Page</Link>
            </Button>
          </Link>
        </div>
        <CourseTab />
      </div>
    </div>
  );
};

export default EditCourse;
