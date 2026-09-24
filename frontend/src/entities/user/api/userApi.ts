import { api } from "@/shared/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { handleAxiosError } from "@/shared/lib/api/handleAxiosError";

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
    const { data } = await api.post<IAuthResponse>("/auth/verify", {
      initData,
    });
    localStorage.setItem("token", data.access_token);
    return data;
  } catch (err) {
    return rejectWithValue(handleAxiosError(err, "Auth failed"));
  }
});
