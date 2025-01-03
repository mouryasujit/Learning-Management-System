import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { isLoggedIn, isLoggedOut } from "../authSlice";
// import { register } from "module";

const USER_API = "https://learning-management-system-o8hqfp329-mouryasujits-projects.vercel.app/api/v1/user/";
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: USER_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (inputData) => ({
        url: "register",
        method: "POST",
        body: inputData,
      }),
    }),
    loginUser: builder.mutation({
      query: (inputData) => ({
        url: "login",
        method: "POST",
        body: inputData,
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(isLoggedIn(result.data));
        } catch (error) {
          console.log(error);
        }
      },
    }),
    logoutUser: builder.mutation({
      query: () => ({
        url: "logout",
        method: "GET",
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(isLoggedOut());
          console.log(result);
        } catch (error) {
          console.log(error);
        }
      },
    }),
    getUser: builder.query({
      query: () => ({ url: "profile", method: "GET" }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(isLoggedIn(result.data));
        } catch (error) {
          console.log(error);
        }
      },
    }),
    updateUser: builder.mutation({
      query: (formData) => ({
        url: "profile/update",
        method: "PUT",
        body: formData,
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useGetUserQuery,
  useUpdateUserMutation,
  useLogoutUserMutation,
} = authApi;
