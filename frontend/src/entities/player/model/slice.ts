import type { ITrack } from "@/entities/track";
import type { PlayerStatus } from "@/shared/types/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { IPlayerState } from "./types";

const initialState: IPlayerState = {
  currentTrack: null,
  queue: [],
  status: "idle",
  progress: 0,
  duration: 0,
};

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    setTrack(state, action: PayloadAction<{ track: ITrack; queue: ITrack[] }>) {
      state.currentTrack = action.payload.track;
      state.queue = action.payload.queue;
      state.status = "playing";
      state.progress = 0;
    },
    setStatus(state, action: PayloadAction<PlayerStatus>) {
      state.status = action.payload;
    },
    setProgress(state, action: PayloadAction<number>) {
      state.progress = action.payload;
    },
    setDuration(state, action: PayloadAction<number>) {
      state.duration = action.payload;
    },
  },
});

export const { setTrack, setStatus, setProgress, setDuration } =
  playerSlice.actions;
export const playerReducer = playerSlice.reducer;
