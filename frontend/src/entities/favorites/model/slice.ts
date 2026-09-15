import type { Status } from "@/shared/types/types";
import type { IFavorite } from "./types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { fetchFavorites } from "../api/favoritesApi";

interface IFavoriteState {
  favorites: IFavorite[];
  status: Status;
  error: string | null;
}

const initialState: IFavoriteState = {
  favorites: [],
  status: "idle",
  error: null,
};

const favoriteSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    addFavoriteLocal(state, action: PayloadAction<IFavorite>) {
      state.favorites.push(action.payload);
      state.status = "succeeded";
      state.error = null;
    },
    removeFavoriteLocal(state, action: PayloadAction<number>) {
      state.favorites = state.favorites.filter(
        (el) => el.track_id !== action.payload,
      );
      state.status = "succeeded";
      state.error = null;
    },
    reorderFavoriteLocal(state, action: PayloadAction<IFavorite[]>) {
      state.favorites = action.payload
      state.status = "succeeded"
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.favorites = action.payload;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Uknown error";
      })
  },
});

export const { addFavoriteLocal, removeFavoriteLocal, reorderFavoriteLocal } = favoriteSlice.actions;
export const favoriteReducer = favoriteSlice.reducer;
