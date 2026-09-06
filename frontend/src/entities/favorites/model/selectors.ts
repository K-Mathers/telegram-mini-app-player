import type { RootState } from "@/app/store";

export const favoriteTracks = (state: RootState) => state.favorites.favorites;
export const selectIsFavorite = (trackId: number) => (state: RootState) =>
  state.favorites.favorites.some((el) => el.track_id === trackId);
