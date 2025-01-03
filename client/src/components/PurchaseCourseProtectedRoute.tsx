import { Navigate, useParams } from "react-router-dom";

import { ReactNode } from "react";
import { useGetCourseDetailswithPurchaseStatusQuery } from "@/features/api/purchaseApi";
import LoadingSpinner from "./ui/LoadingSpinner";

export const PurchaseCourseRoute = ({ children }: { children: ReactNode }) => {
    const params=useParams();
  const { courseId } = params;
//   console.log(courseId);
  const { data, isLoading } =
    useGetCourseDetailswithPurchaseStatusQuery({courseId});
  if (isLoading) {
    return <LoadingSpinner />;
  }
  console.log(data);
  return data?.payload.purchase ? (
    children
  ) : (
    <Navigate to={`/course-detail/${courseId}`} />
  );
};

export default PurchaseCourseRoute;
