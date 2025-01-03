import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  courseEnrolled?: string[];
  photoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Inital {
  user: User | null;
  isAuthenticated: boolean;
}
const initialState: Inital = {
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    isLoggedIn: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    isLoggedOut: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});
export const { isLoggedIn, isLoggedOut } = authSlice.actions;
export default authSlice.reducer;
