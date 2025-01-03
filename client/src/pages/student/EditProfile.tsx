import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogDescription } from "@radix-ui/react-dialog";
import Cards from "./Card";
import { useGetUserQuery, useUpdateUserMutation } from "@/features/api/authApi";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { courses } from "@/assets/Types/interfaces";

const EditProfile = () => {
  const { data, isLoading, error, refetch } = useGetUserQuery({});
  const [profilePhoto, setprofilePhoto] = useState<File | null>(null);
  const [name, setname] = useState(data?.payload?.name || "");
  const [
    updateUser,
    {
      data: updatedData,
      isLoading: updateDataLoading,
      error: updatedDataError,
      isSuccess,
    },
  ] = useUpdateUserMutation({});
  // console.log(data?.payload);
  const payload = data?.payload;
  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file: File | null = e.target.files?.[0] || null;
    if (file) {
      setprofilePhoto(file);
    }
  };
  const updateUserHandle = async () => {
    // console.log(name, profilePhoto);
    const formData = new FormData();
    formData.append("name", name);
    if (profilePhoto) {
      formData.append("profilePhoto", profilePhoto);
    }
    await updateUser(formData);
  };

  useEffect(() => {
    if (data) {
      setname(data.payload.name);
    }
  }, [data]);
  useEffect(() => {
    if (isSuccess) {
      toast.success(updatedData?.message || "User Updated Successfully");
      refetch();
    }

    if (updatedDataError && "data" in updatedDataError) {
      console.log(updatedDataError.data);
      toast.error(
        (updatedDataError.data as { message?: string })?.message ||
          "Something went Wrong Try Again"
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updatedDataError, updatedData, isLoading]);
  return (
    <div className="max-w-7xl mx-auto h-[100vh] flex items-start px-4 md:px-0">
      {(isLoading || updateDataLoading) && <LoadingSpinner />}
      {error && toast.error("Error fetching user data please Refesh")}
      <div className="h-full mt-20 w-full">
        <h2 className="font-bold text-2xl text-center md:text-left">Profile</h2>
        <div className="flex flex-col md:flex-row md:justify-start items-center justify-center  md:items-center gap-8 my-5">
          <div className="flex flex-col items-center">
            <img
              src={payload?.photoUrl || "https://github.com/shadcn.png"}
              alt="profileImage"
              className="h-24 w-24 md:h-32 md:w-32 mb-4 rounded-full"
            />
          </div>
          <div className="">
            <div className="mb-2 ">
              <h1 className="font-semibold text-gray-900 dark:text-gray-100 ">
                Name:
                <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                  {payload?.name}
                </span>
              </h1>
            </div>
            <div className="mb-2">
              <h1 className="font-semibold text-gray-900 dark:text-gray-100 ">
                Email:
                <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                  {payload?.email}
                </span>
              </h1>
            </div>
            <div className="mb-2">
              <h1 className="font-semibold text-gray-900 dark:text-gray-100 ">
                Role:
                <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                  {payload?.role.toUpperCase()}
                </span>
              </h1>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-blue-500 text-white px-4 py-2 rounded-md">
                  Edit Profile
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                  <DialogDescription>
                    Make Changes then click save changes when you're done
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label>Name</Label>
                    <Input
                      type="text"
                      placeholder="Name"
                      value={name}
                      onChange={(e) => setname(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label>Profile</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      className="col-span-3"
                      onChange={(e) => onChangeHandler(e)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    disabled={updateDataLoading}
                    onClick={updateUserHandle}
                  >
                    Save Changes
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className=" overflow-x-hidden max-w-7xl">
          <h3 className="font-medium text-lg my-4">
            Courses You are Enrolled In
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 sm:grid-cols-2 gap-8">
            {payload?.courseEnrolled.length > 0 ? (
              payload?.courseEnrolled.map((course:courses) => (
                <Cards key={course._id} course={course} />
              ))
            ) : (
              <p>You are currently not enrolled in any courses</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
