import { courses } from "@/assets/Types/interfaces";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
interface props {
  course: courses;
}
const SearchResult: React.FC<props> = ({ course }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between gap-4 items-start border-b border-gray-300 py-4">
      <Link
        to={`/course-detail/${course?._id}`}
        className="flex flex-col md:flex-row gap-4 w-full md:w-auto"
      >
        <img
          src={course?.courseThumbnail as string}
          alt=""
          className="h-32 w-full md:w-56 object-cover rounded-lg"
        />
        <div className="flex-flex-col space-y-2">
          <h2 className="font-bold text-lg md:text-xl">
            {course?.courseTitle}
          </h2>
          <p className="text-sm text-gray-600">{course?.subTitle}</p>
          <p className="text-sm text-gray-700">
            Instructor:{" "}
            <span className="text-blue-600 italic underline text-base">
              {course?.creator?.name}
            </span>{" "}
          </p>
          <Button className="w-fit mt-2 md:mt-0 h-8 rounded-2xl ">
            {course?.courseLevel}
          </Button>
        </div>
      </Link>
      <div className="font-bold text-lg md:text-xl  ">
        ₹{course?.coursePrice}
      </div>
    </div>
  );
};

export default SearchResult;
