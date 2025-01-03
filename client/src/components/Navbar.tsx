/* eslint-disable @typescript-eslint/no-explicit-any */
import { School, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Button } from "./ui/button";
// import { Link, useNavigate } from "react-router-dom";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import DarkMode from "./DarkMode";
import { Link, useNavigate } from "react-router-dom";
import { useLogoutUserMutation } from "@/features/api/authApi";
import { useEffect } from "react";
import { toast } from "sonner";
import LoadingSpinner from "./ui/LoadingSpinner";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";

const Navbar = () => {
  //--------------------------------------------------------States----------------------------------------
  const user: any = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [logoutUser, { isSuccess, isError, isLoading }] =
    useLogoutUserMutation();

  //------------------------------------------------------Handlers-------------------------------
  const logoutHandler = async () => {
    await logoutUser({});
    navigate("/login");
  };

  //-----------------------------------------------------displaying messages-------------------------------------
  useEffect(() => {
    if (isSuccess) {
      toast.success("Logout Successful");
    }
    if (isError) {
      toast.error("SOmething went Wrong Try again");
    }
  }, [isSuccess, isError]);
  return (
    <div className="h-16 dark:bg-[#0A0A0A] bg-white border-b dark:border-b-gray-800 fixed left-0 right-0 z-50 duration-300  flex justify-center items-center px-4">
      {isLoading && <LoadingSpinner />}
      <div className="max-w-7xl flex justify-between items-center w-full">
        <div className="flex items-center gap-3">
          <Link to="/">
            <School size={"30"} />
          </Link>
          <h1 className="hidden md:block font-extrabold text-2xl">
            <Link to="/">E-Learning</Link>
          </h1>
        </div>
        <div className="flex items-center gap-8">
          {user?.user !== null ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <img
                  src={
                    user?.user?.user?.photoUrl ||
                    user?.user?.payload?.photoUrl ||
                    "https://github.com/shadcn.png"
                  }
                  alt=""
                  className="h-8 w-8 rounded-md shadow-lg hover:scale-105 transition-all duration-300"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Link to="my-learnings">My learning</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="profile">My Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logoutHandler}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                {(user?.user?.user?.role === "instructor" ||
                  user?.user?.payload?.role ==="instructor") && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Link to="/admin/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Link to="/admin/course">Create Course</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline">
                <Link to="login">Login</Link>
              </Button>
              <Button variant="outline" className="bg-black text-white">
                <Link to="login">Signup</Link>
              </Button>
              {/* <Button onClick={() => navigate("/login")}>Signup</Button> */}
            </div>
          )}
          <DarkMode />
        </div>
      </div>
      <div className="flex md:hidden items-center justify-between px-4 h-full">
        <MobileNavbar user={user} />
      </div>
    </div>
  );
};

export default Navbar;

const MobileNavbar = ({ user }: any) => {
  const navigate = useNavigate();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          className="rounded-full hover:bg-gray-200"
          variant="outline"
        >
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader className="flex flex-row items-center justify-between mt-2">
          <SheetTitle>
            {" "}
            {/* <Link to="/">E-Learning</Link> */}
            E-Learning
          </SheetTitle>
          <DarkMode />
        </SheetHeader>
        <Separator className="mr-2" />
        {(user?.user?.user?.name !== undefined || user?.user?.payload?.name !==undefined)? (
          <nav className="flex flex-col space-y-4">
            <Link to="my-learnings">My learning</Link>
            <Link to="profile">My Profile</Link>
            <p>Log out</p>
          </nav>
        ) : (
          <Button>
            <Link to="login">Login</Link>
          </Button>
        )}
        {(user?.user?.user?.role === "instructor" ||
          user?.user?.payload?.role==="instructor") && (
          <SheetFooter>
            <SheetClose className="flex flex-col space-y-4 w-full">
              <Button
                onClick={() => navigate("/admin/dashboard")}
                className="w-full"
              >
                Dashboard
              </Button>
              <Button
                onClick={() => navigate("/admin/course")}
                className="w-full"
              >
                Create Course
              </Button>
            </SheetClose>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};
