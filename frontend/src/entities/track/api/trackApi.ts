import { createAsyncThunk } from "@reduxjs/toolkit";
import type { ITrack } from "../model/types";
import { api } from "@/shared/api/api";
import axios from "axios";

export const fetchAlbumTracks = createAsyncThunk<
  ITrack[],
  string,
  { rejectValue: string }
>("track/fetchAlbumTracks", async (id, { rejectWithValue }) => {
  try {
    return (await api.get<ITrack[]>(`api/v1/albums/${id}/tracks`)).data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(err.response?.data.message ?? "Failed");
    }
    return rejectWithValue("Unknown error");
  }
});
