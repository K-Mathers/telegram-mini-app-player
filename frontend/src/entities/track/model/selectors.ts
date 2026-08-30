import type { RootState } from "@/app/store";

export const selectAllTracks = (state: RootState) => state.track.allTracks;
export const selectAllTracksStatus = (state: RootState) => state.track.allTracksStatus;

export const selectTracks = (state: RootState) => state.track.tracks;
export const selectTrackStatus = (state: RootState) => state.track.status;
