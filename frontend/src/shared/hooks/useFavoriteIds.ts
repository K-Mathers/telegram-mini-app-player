import { useSelector } from "react-redux";
import { favoriteTracks } from "@/entities/favorites";
import { useMemo } from "react";

export const useFavoriteIds = () => {
  const favorites = useSelector(favoriteTracks);

  const favoriteId = useMemo(
    () => new Set(favorites.map((el) => el.track_id)),
    [favorites],
  );

  return favoriteId;
};
