import type { RootState } from "@/app/store";

export const selectCurrentTrack = (state: RootState) =>
  state.player.currentTrack;
export const selectPlayerStatus = (state: RootState) => state.player.status;
export const selectProgress = (state: RootState) =>
  state.player.progress;
export const selectDuration = (state: RootState) => state.player.duration