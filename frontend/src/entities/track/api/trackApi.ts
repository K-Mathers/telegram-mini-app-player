import { createAsyncThunk } from "@reduxjs/toolkit";
import type { ITrack } from "../model/types";
import { api } from "@/shared/api/api";
import { handleAxiosError } from "@/shared/lib/api/handleAxiosError";

export const fetchAllTracks = createAsyncThunk<
  ITrack[],
  void,
  { rejectValue: string }
>("track/fetchAllTracks", async (_, { rejectWithValue }) => {
  try {
    return (await api.get<ITrack[]>("/tracks")).data;
  } catch (err) {
    return rejectWithValue(handleAxiosError(err));
  }
});

export const fetchAlbumTracks = createAsyncThunk<
  ITrack[],
  string,
  { rejectValue: string }
>("track/fetchAlbumTracks", async (id, { rejectWithValue }) => {
  try {
    return (await api.get<ITrack[]>(`/albums/${id}/tracks`)).data;
  } catch (err) {
    return rejectWithValue(handleAxiosError(err));
  }
});
