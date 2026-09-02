import type { RootState } from "@/app/store";

export const favoriteTracks = (state: RootState) => state.favorites.favorites;
