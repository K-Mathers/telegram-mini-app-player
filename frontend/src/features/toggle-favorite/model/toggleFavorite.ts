import type { AppDispatch, RootState } from "@/app/store";
import {
  addFavoriteLocal,
  addTrackToFavorites,
  removeFavoriteLocal,
  removeTrackFromFavorites,
} from "@/entities/favorites";
import type { ITrack } from "@/entities/track";

export const toggleFavorite =
  (track: ITrack) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    const { favorites } = getState().favorites;

    const existing = favorites.find((el) => el.track_id === track.id);
    if (existing) {
      dispatch(removeFavoriteLocal(track.id));

      try {
        await removeTrackFromFavorites(existing.id);
      } catch {
        dispatch(addFavoriteLocal(existing));
      }
    } else {
      const tempFavorite = {
        id: Date.now(),
        track_id: track.id,
        position: favorites.length,
        added_at: new Date().toISOString(),
        user_id: 0,
      };

      dispatch(addFavoriteLocal(tempFavorite));

      try {
        const data = await addTrackToFavorites(track.id);
        dispatch(removeFavoriteLocal(track.id));
        dispatch(addFavoriteLocal(data));
      } catch {
        dispatch(removeFavoriteLocal(track.id));
      }
    }
  };
