export {
  addTrackToFavorites,
  fetchFavorites,
  removeTrackFromFavorites,
} from "./api/favoritesApi";
export type { IFavorite } from "./model/types";
export { favoriteTracks } from "./model/selectors";
export {
  favoriteReducer,
  addFavoriteLocal,
  removeFavoriteLocal,
} from "./model/slice";
