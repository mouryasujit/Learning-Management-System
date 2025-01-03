import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import LectureTab from "./LectureTab";

const EditLecture = () => {
  const params = useParams();
  const courseId = params.courseId;

  return (
    <div
      className="w-full flex flex-col items-start justify-start
    h-full pl-6 py-4 space-y-4  px-4 md:pl-4"
    >
      <div className=" w-full flex space-x-4 items-center">
        <Link to={`/admin/course/${courseId}/lecture`}>
          <Button size="icon" variant="outline" className="rounded-full">
            <ArrowLeft />
          </Button>
        </Link>
        <h3 className="font-bold text-xl">Update Your Lecture</h3>
      </div>
      <LectureTab />
    </div>
  );
};

export default EditLecture;
