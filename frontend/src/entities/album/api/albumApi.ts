import { createAsyncThunk } from "@reduxjs/toolkit";
import type { IAlbum } from "../model/types";
import { api } from "@/shared/api/api";
import axios from "axios";

export const fetchAlbums = createAsyncThunk<
  IAlbum[],
  void,
  { rejectValue: string }
>("album/fetchAlbums", async (_, { rejectWithValue }) => {
  try {
    return (await api.get<IAlbum[]>("/albums")).data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(err.response?.data.message ?? "Failed");
    }
    return rejectWithValue("Unknown error");
  }
});
