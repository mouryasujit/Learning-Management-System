import { Loader } from "lucide-react";

const LoadingSpinner = () => {
  return (
    <div
      className="fixed inset-0 w-full h-full flex flex-col items-center justify-center bg-gray-50/90 backdrop-blur-sm z-[9999]"
      style={{ touchAction: "none", pointerEvents: "all" }}
    >
      <Loader className="animate-spin h-16 w-16 text-blue-600" />
      <p className="mt-4 text-lg font-semibold text-gray-700">Loading...</p>
    </div>
  );
};

export default LoadingSpinner;
