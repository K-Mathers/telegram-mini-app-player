import { api } from "@/shared/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

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
