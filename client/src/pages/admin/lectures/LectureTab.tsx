import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { videoData } from "@/assets/Types/interfaces";
import { Progress } from "@/components/ui/progress";
import {
  useEditLectureMutation,
  useRemoveLectureMutation,
} from "@/features/api/courseApi";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const LectureTab = () => {
  const [lectureTitle, setTitle] = useState<string | "">();
  const [uploadVideo, setuploadVideo] = useState<videoData | null>();
  const [isFree, setisFree] = useState<boolean>(false);
  const [mediaProgress, setMediaProgress] = useState<boolean>(false);
  const [uploadProgress, setuploadProgress] = useState<number>(0);
  const [btnDisable, setbtnDisable] = useState<boolean>(false);
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { lecture } = location.state || {};
  const { courseId, lectureId } = params;
  const [editLecture, { error, data, isLoading, isSuccess }] =
    useEditLectureMutation({});

  const [
    removeLecture,
    {
      error: RemoveLectureError,
      isLoading: RemoveLectureLoading,
      isSuccess: removeLectureSuccess,
    },
  ] = useRemoveLectureMutation({});
  //----------------------------------------------change Handlers-----------------------------------------
  const fileChangeHandlers = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (file) {
        const formdata = new FormData();
        formdata.append("file", file);
        setMediaProgress(true);
        setbtnDisable(true);
        try {
          const res = await axios.post(
            "https://learning-management-system-lnbk.onrender.com/api/v1/media/uploads-video",
            formdata,
            {
              onUploadProgress: ({ loaded, total }) => {
                if (total) {
                  setuploadProgress(Math.round((loaded * 100) / total));
                }
              },
            }
          );
          if (res?.data?.success) {
            setuploadVideo({
              videoUrl: res?.data?.payload?.url,
              publicId: res?.data?.payload?.public_id,
            });
            setbtnDisable(false);
            toast.success("Video Uploaded Successfully");
          }
        } catch (error) {
          console.log(error);
          toast.error("Could not Upload File Try again");
        } finally {
          setMediaProgress(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const editLectureHandler = async () => {
    // console.log(lectureTitle, uploadVideo, isFree, courseId, lectureId);
    try {
      await editLecture({
        lectureTitle,
        videoInfo: uploadVideo,
        isPreviewFree: isFree,
        courseId,
        lectureId,
      });
    } catch (error) {
      toast.error("Something went wrong Try again");
      console.log(error);
    }
  };
  useEffect(() => {
    if (removeLectureSuccess) {
      toast.success("Lecture Deleted Successfully");
      navigate(`/admin/course/${courseId}/lecture`);
    }
    if (RemoveLectureError) {
      toast.error("Something went wrong Try Again");
    }
  }, [removeLectureSuccess, RemoveLectureError]);
  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message);
      navigate(`/admin/course/${courseId}/lecture`);
    }
    if (error) {
      if (error && "data" in error) {
        console.log(error?.data);
        toast.error(
          (error?.data as { message?: string })?.message ||
            "Something went Wrong Try Again"
        );
      }
    }
  }, [isSuccess, error]);

  useEffect(() => {
    if (lecture) {
      setTitle(lecture.lectureTitle);
      if (lecture?.isPreviewFree) {
        setisFree(lecture.isPreviewFree);
      }
      if (lecture?.videoUrl) {
        setuploadVideo({
          videoUrl: lecture?.videoUrl,
          publicId: lecture?.publicId,
        });
      }
    }
  }, [lecture]);
  return (
    <Card className="w-full">
      {(isLoading || RemoveLectureLoading) && <LoadingSpinner />}
      <CardHeader className="flex justify-between md:flex-row ">
        <div className="space-y-2">
          <CardTitle>Edit Lecture</CardTitle>
          <CardDescription>
            Make Changes to Content Then Click Save Changes
          </CardDescription>
        </div>
        <div>
          <Button
            variant="destructive"
            onClick={() => removeLecture(lectureId)}
          >
            Remove Lecture
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Title</Label>
          <Input
            type="text"
            placeholder="Enter the card Title"
            value={lectureTitle}
            required
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        {(lecture?.videoUrl || uploadVideo?.videoUrl) && (
          <div className="space-y-4">
            <Label>Current Lecture:</Label>
            <video
              src={
                uploadVideo?.videoUrl
                  ? uploadVideo?.videoUrl
                  : lecture?.videoUrl
              }
              controls
              width="400"
            />
          </div>
        )}
        <div>
          <Label>
            Video <span className="text-red-700">*</span>{" "}
          </Label>
          <Input
            type="file"
            accept="video/*"
            placeholder="Enter the card Title"
            required
            className="w-fit"
            onChange={fileChangeHandlers}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="aurplane" checked={isFree} onCheckedChange={setisFree} />
          <Label htmlFor="aurplane">Is This Video Free</Label>
        </div>
        {mediaProgress && (
          <div className="my-4">
            <Progress value={uploadProgress} />
            <p>{uploadProgress}% Uploaded</p>
          </div>
        )}
        <div className="space-x-2">
          <Button variant="outline">Cancel</Button>
          <Button disabled={btnDisable} onClick={editLectureHandler}>
            {btnDisable === true ? "Please Wait" : "Save Changes"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LectureTab;
