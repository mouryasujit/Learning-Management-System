export interface UserInterface {
  _id: string;
  name: string;
  email: string;
  password?: string;
  role: string;
  courseEnrolled: string[];
  photoUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface userFromSelector {
  message: string;
  payload: UserInterface;
  success: boolean;
}

export interface courses {
  key?: number;
  _id?: string;
  courseTitle: string;
  subTitle: string;
  category: string;
  description: string;
  courseLevel: string;
  coursePrice: number;
  courseThumbnail: string | File | null | undefined;
  creator?: creator;
}

export interface Datas {
  message: string;
  success: boolean;
}

export interface Errors {
  data: Datas;
}

export interface lectures {
  _id?: string;
  lectureTitle?: string;
  createdAt?: Date;
  updatedAt?: Date;
  isPreviewFree?: boolean;
  videoUrl?: string;
  publicId?: string;
}

export interface props extends lectures {
  lecture: lectures;
  courseId?: string;
  index: number;
}

export interface videoData {
  publicId?: string;
  videoUrl?: string;
}

export interface creator {
  name: string;
  photoUrl: string;
  _id: string;
}
