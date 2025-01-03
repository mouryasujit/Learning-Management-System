import { useCreateCheckoutSessionMutation } from "@/features/api/purchaseApi";
import { Button } from "./ui/button";
import { useEffect } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface BuyCourseButtonProps {
  courseId: string;
}
const BuyCourseButton: React.FC<BuyCourseButtonProps> = ({ courseId }) => {
  const [createCheckoutSession, { isLoading, error, data, isSuccess }] =
    useCreateCheckoutSessionMutation({});
  const purchaseCourseHandler = async () => {
    // purchaseApi.useCreateCheckoutSessionMutation({courseId});
    await createCheckoutSession({ courseId });
  };
  useEffect(() => {
    if (isSuccess) {
      if (data?.payload) window.location.href = data.payload;
    }
    if (error) toast.error("Failed to create session");
  }, [error, isSuccess, data]);
  return (
    <Button
      className="w-full"
      onClick={purchaseCourseHandler}
      disabled={isLoading}
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap-2">
          <Loader2 className="animate-spin" size={20} />
          <p className="font-bold text-base">Processing ...</p>
        </div>
      ) : (
        "Purchase Course"
      )}
    </Button>
  );
};

export default BuyCourseButton;
