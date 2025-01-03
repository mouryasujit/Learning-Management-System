import { useGetPublisedCoursesQuery } from "@/features/api/courseApi";
import Cards from "./Card";
import CourseSkeleton from "./CourseSkeleton";
import { courses } from "@/assets/Types/interfaces";

const Courses = () => {
  const { data, isLoading } = useGetPublisedCoursesQuery({});
  return (
    <div className="bg-gray-50 mt-10 dark:bg-[#0A0A0A] px-4 md:px-0 ">
      <div className="max-w-7xl mx-auto">
        <h1 className="font-bold text-3xl text-center mb-10">Our Courses</h1>

        <div className="grid gird-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6  ">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <CourseSkeleton key={i} />
              ))
            : data?.payload.map((course: courses, i: number) => (
                <Cards key={i} course={course} />
              ))}
        </div>
      </div>
    </div>
  );
};

export default Courses;
