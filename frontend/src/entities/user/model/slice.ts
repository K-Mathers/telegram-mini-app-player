import { api } from "@/shared/api/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

type Status = "idle" | "loading" | "succeeded" | "failed";

interface IState {
  user: string | null;
  token: string | null;
  status: Status;
  error: string | null;
}

interface IAuthResponse {
  access_token: string;
  token_type: string;
}

export const authByTelegram = createAsyncThunk<
  IAuthResponse,
  string,
  { rejectValue: string }
>("user/authByTelegram", async (initData, { rejectWithValue }) => {
  try {
    const { data } = await api.post<IAuthResponse>("api/v1/auth/verify", {
      initData,
    });
    localStorage.setItem("token", data.access_token);
    return data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(err.response?.data?.message ?? "Auth failed");
    }
    return rejectWithValue("Unknown error");
  }
});

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
