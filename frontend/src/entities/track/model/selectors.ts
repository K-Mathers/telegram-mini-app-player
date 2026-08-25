import type { RootState } from "@/app/store";

export const selectTracks = (state: RootState) => state.track.tracks;
export const selectTrackStatus = (state: RootState) => state.track.status;
