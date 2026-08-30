import { createSlice } from "@reduxjs/toolkit";
import type { ITrack } from "./types";
import { fetchAlbumTracks, fetchAllTracks } from "../api/trackApi";
import type { Status } from "@/shared/types/types";

interface ITrackState {
  tracks: ITrack[];
  status: Status;
  error: string | null;
  allTracks: ITrack[];
  allTracksStatus: Status;
  allTracksError: string | null;
}

const initialState: ITrackState = {
  tracks: [],
  status: "idle",
  error: null,
  allTracks: [],
  allTracksStatus: "idle",
  allTracksError: null,
};

const trackSlice = createSlice({
  name: "track",
  initialState,
  reducers: {
    clearTracks(state) {
      state.tracks = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAlbumTracks.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAlbumTracks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.tracks = action.payload;
      })
      .addCase(fetchAlbumTracks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Unknown error";
      })

      .addCase(fetchAllTracks.pending, (state) => {
        state.allTracksStatus = "loading";
        state.allTracksError = null;
      })
      .addCase(fetchAllTracks.fulfilled, (state, action) => {
        state.allTracksStatus = "succeeded";
        state.allTracks = action.payload;
      })
      .addCase(fetchAllTracks.rejected, (state, action) => {
        state.allTracksStatus = "failed";
        state.allTracksError = action.payload ?? "Unknown error";
      });
  },
});

export const { clearTracks } = trackSlice.actions;
export const trackReducer = trackSlice.reducer;
