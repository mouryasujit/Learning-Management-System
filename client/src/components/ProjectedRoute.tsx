/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "../app/store";
import { ReactNode } from "react";

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useSelector((store: RootState) => store.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return children;
};
export const AuthenticatedUser = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useSelector((store: RootState) => store.auth);
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return children;
};

export const AdminRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useSelector((store: RootState) => store.auth);
  const user: any = useSelector((store: RootState) => store.auth);
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (
    user?.user?.user?.role !== "instructor" ||
    user?.user?.payload?.role !== "instructor"
  ) {
    console.log(user?.user?.user?.role, user?.user?.payload?.role);
    return <Navigate to="/" />;
  }

  return children;
};
