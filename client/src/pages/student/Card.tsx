import { courses } from "@/assets/Types/interfaces";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
interface CardsProps {
  course: courses;
}
const Cards: React.FC<CardsProps> = ({ course }) => {
  return (
    <Link to={`/course-detail/${course._id}`}>
      <Card className="overflow-hidden rounded-lg dark:bg-gray-800 bg-white shadow-lg hover:shadow-2xl transform hover:scale:105 transition-all duration-300  ">
        <div className="relative">
          <img
            src={
              typeof course?.courseThumbnail === "string"
                ? course.courseThumbnail
                : "https://github.com/shadcn.png"
            }
            alt="Course"
            className="w-full h-36 object-cover rounded-t-lg"
          />
        </div>
        <CardContent className="px-5 py-4 space-y-3">
          <h1 className="hover:underline font-bold text-lg truncate">
            {course?.courseTitle}
          </h1>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={
                  course?.creator?.photoUrl || "https://github.com/shadcn.png"
                }
                alt="Course"
                className="w-8 h-8 object-cover rounded-full"
              />
              <h1 className="font-medium text-sm">{course?.creator?.name}</h1>
            </div>
            <span
              className={
                "bg-blue-600 text-white px-2 py-1 text-xs rounded-full"
              }
            >
              {course?.courseLevel?.toLocaleUpperCase()}
            </span>
          </div>
          <div className="text-lg font-bold">
            <span>₹ {course?.coursePrice}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default Cards;
