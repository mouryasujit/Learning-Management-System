import { ChartNoAxesColumn, SquareLibrary } from "lucide-react";
import { Link, Outlet } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="flex max-w-7xl mx-auto">
      <div className="hidden lg:block w-[250px] sm:w-[300px] space-y-6 border border-gray-300 dark:border-gray-700 bg-[#f0f0f0] dark:bg-[#0A0A0A] sticky top-0 h-screen pt-16 ">
        <div className="space-y-6 pl-2 pt-4 ">
          <Link to="/admin/dashboard" className="flex items-center gap-2">
            <ChartNoAxesColumn size={22} />
            <h3>Dashboard</h3>
          </Link>
          <Link to="/admin/course" className="flex items-center gap-2">
            <SquareLibrary size={22} />
            <h3>Course</h3>
          </Link>
        </div>
      </div>
      <div className="flex-1 pt-16 ">
        <Outlet />
      </div>
    </div>
  );
};

export default Sidebar;
