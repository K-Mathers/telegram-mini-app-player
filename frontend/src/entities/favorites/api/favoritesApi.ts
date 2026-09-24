import { createAsyncThunk } from "@reduxjs/toolkit";
import type { IFavorite } from "../model/types";
import { api } from "@/shared/api/api";
import { handleAxiosError } from "@/shared/lib/api/handleAxiosError";

export const fetchFavorites = createAsyncThunk<
  IFavorite[],
  void,
  { rejectValue: string }
>("playlist/fetchFavorites", async (_, { rejectWithValue }) => {
  try {
    return (await api.get<IFavorite[]>("/playlists")).data;
  } catch (err) {
    return rejectWithValue(handleAxiosError(err));
  }
});

export const addTrackToFavorites = async (trackId: number) => {
  const { data } = await api.post("/playlists/add-track", {
    track_id: trackId,
  });
  return data;
};

export const removeTrackFromFavorites = async (favoriteId: number) => {
  await api.delete(`/playlists/${favoriteId}/remove-track`);
};

export const reorderFavorites = createAsyncThunk<
  IFavorite[],
  number[],
  { rejectValue: string }
>("playlist/reorderFavorites", async (trackIds, { rejectWithValue }) => {
  try {
    return (
      await api.put<IFavorite[]>("/playlists/reorder", { track_ids: trackIds })
    ).data;
  } catch (err) {
    return rejectWithValue(handleAxiosError(err));
  }
});
