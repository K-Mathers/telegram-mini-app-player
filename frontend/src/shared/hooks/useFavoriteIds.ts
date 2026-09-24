import { useSelector } from "react-redux";
import { selectFavorites } from "@/entities/favorites";
import { useMemo } from "react";

export const useFavoriteIds = () => {
  const favorites = useSelector(selectFavorites);

  const favoriteId = useMemo(
    () => new Set(favorites.map((el) => el.track_id)),
    [favorites],
  );

  return favoriteId;
};
