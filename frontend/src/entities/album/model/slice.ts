import { createSlice } from "@reduxjs/toolkit";
import type { IAlbum } from "./types";
import { fetchAlbums } from "../api/albumApi";
import type { Status } from "@/shared/types/types";

interface IAlbumState {
  albums: IAlbum[];
  status: Status;
  error: string | null;
}

const initialState: IAlbumState = {
  albums: [],
  status: "idle",
  error: null,
};

const albumSlice = createSlice({
  name: "album",
  initialState,
  reducers: {
    clearAlbums(state) {
      state.albums = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAlbums.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAlbums.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.albums = action.payload;
      })
      .addCase(fetchAlbums.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Unknow error";
      });
  },
});

export const { clearAlbums } = albumSlice.actions;
export const albumReducer = albumSlice.reducer;
