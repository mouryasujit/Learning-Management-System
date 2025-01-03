import { useGetUserQuery } from "@/features/api/authApi";
import Cards from "./Card";
import CourseSkeleton from "./CourseSkeleton";
import { courses } from "@/assets/Types/interfaces";

const MyLearning = () => {
  const courseArray = [1, 9, 9, 9, 9, 5, 5, 5, 5, 5, 3];
  const { isLoading, data } = useGetUserQuery({});
  const mylearning: courses[] = data?.payload?.courseEnrolled || [];
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-0 flex  ">
      <div className="mt-20 mx-auto w-full">
        <h1 className="font-bold text-2xl text-black-50">My Learning</h1>
        <div className="my-5">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <CourseSkeleton key={i} />
              ))}
            </div>
          ) : courseArray.length === 0 ? (
            "<p>You have not Enrolled in any course</p>"
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {mylearning.map((course: courses) => (
                <Cards key={course._id} course={course} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyLearning;
