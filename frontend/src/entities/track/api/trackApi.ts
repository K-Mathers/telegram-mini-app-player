import { createAsyncThunk } from "@reduxjs/toolkit";
import type { ITrack } from "../model/types";
import { api } from "@/shared/api/api";
import axios from "axios";

export const fetchAllTracks = createAsyncThunk<
  ITrack[],
  void,
  { rejectValue: string }
>("track/fetchAllTracks", async (_, { rejectWithValue }) => {
  try {
    return (await api.get<ITrack[]>("/tracks")).data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(err.response?.data.message ?? "Failed");
    }
    return rejectWithValue("Unknown error");
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
    if (axios.isAxiosError(err)) {
      return rejectWithValue(err.response?.data.message ?? "Failed");
    }
    return rejectWithValue("Unknown error");
  }
});
