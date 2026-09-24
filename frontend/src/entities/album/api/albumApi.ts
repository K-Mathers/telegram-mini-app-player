import { createAsyncThunk } from "@reduxjs/toolkit";
import type { IAlbum } from "../model/types";
import { api } from "@/shared/api/api";
import { handleAxiosError } from "@/shared/lib/api/handleAxiosError";

export const fetchAlbums = createAsyncThunk<
  IAlbum[],
  void,
  { rejectValue: string }
>("album/fetchAlbums", async (_, { rejectWithValue }) => {
  try {
    return (await api.get<IAlbum[]>("/albums")).data;
  } catch (err) {
    return rejectWithValue(handleAxiosError(err));
  }
});
