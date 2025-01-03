import { courses } from "@/assets/Types/interfaces";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetCreatorCourseQuery } from "@/features/api/courseApi";
import { Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
interface extendedCourse extends courses{
  isPublished?:boolean,
}
const CourseTable = () => {
  const { data, isLoading } = useGetCreatorCourseQuery({});
  const navigate = useNavigate();

  return (
    <div
      className="w-full flex flex-col items-start justify-start
     h-full  py-4 space-y-4 px-4 md:px-0 md:pl-6"
    >
      {isLoading && <LoadingSpinner />}
      <Button
        onClick={() => {
          navigate("create");
        }}
      >
        Create Course
      </Button>
      <Table>
        <TableCaption>A List of your Recent Courses.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.payload?.map((course: extendedCourse) => (
            <TableRow key={course?._id}>
              <TableCell>{course?.coursePrice || "NA"}</TableCell>
              <TableCell>
                <Button
                  size="sm"
                  className="h-6"
                  variant={course?.isPublished ? "outline" : "default"}
                >
                  {course?.isPublished ? "Published" : "Draft"}
                </Button>
              </TableCell>
              <TableCell className="font-medium">
                {course?.courseTitle}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => navigate(`${course?._id}`)}
                >
                  <Edit />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CourseTable;
