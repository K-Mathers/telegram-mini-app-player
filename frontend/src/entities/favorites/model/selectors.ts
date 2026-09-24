import type { RootState } from "@/app/store";

export const selectFavorites = (state: RootState) => state.favorites.favorites;
export const selectIsFavorite = (trackId: number) => (state: RootState) =>
  state.favorites.favorites.some((el) => el.track_id === trackId);
