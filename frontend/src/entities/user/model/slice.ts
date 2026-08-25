import type { Status } from "@/shared/types/types";
import { createSlice } from "@reduxjs/toolkit";
import { authByTelegram } from "../api/userApi";
interface IState {
  user: string | null;
  token: string | null;
  status: Status;
  error: string | null;
}

const initialState: IState = {
  user: null,
  token: localStorage.getItem("token"),
  status: "idle",
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout(state) {
      ((state.user = null),
        (state.token = null),
        localStorage.removeItem("token"));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(authByTelegram.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(authByTelegram.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload.access_token;
      })
      .addCase(authByTelegram.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Unknow error";
      });
  },
});

export const { logout } = userSlice.actions;
export const userReducer = userSlice.reducer;
