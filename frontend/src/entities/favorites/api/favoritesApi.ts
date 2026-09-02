import { createAsyncThunk } from "@reduxjs/toolkit";
import type { IFavorite } from "../model/types";
import { api } from "@/shared/api/api";
import axios from "axios";

export const fetchFavorites = createAsyncThunk<
  IFavorite[],
  void,
  { rejectValue: string }
>("playlist/fetchFavorites", async (_, { rejectWithValue }) => {
  try {
    return (await api.get<IFavorite[]>("/playlists")).data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(err.response?.data.message ?? "Failed");
    }
    return rejectWithValue("Unknown error");
  }
});

export const addTrackToFavorites = async (trackId: number) => {
  const { data } = await api.post("/playlists/add-track", {
    track_id: trackId,
  });
  return data;
};

export const removeTrackFromFavorites = async (favoriteId: number) => {
  await api.delete(`/playlist/${favoriteId}/remove-track`);
};
