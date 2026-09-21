import { useMemo } from "react";
import { useSelector } from "react-redux";
import { selectSortBy } from "./slice";
import type { IFavorite } from "@/entities/favorites";
import type { ITrack } from "@/entities/track";

export function useSortedFavorites(
  favorites: IFavorite[],
  allTracks: ITrack[],
) {
  const sortBy = useSelector(selectSortBy);

  return useMemo(() => {
    return [...favorites]
      .sort((a, b) => {
        if (sortBy === "date") {
          return (
            new Date(b.added_at).getTime() - new Date(a.added_at).getTime()
          );
        } else if (sortBy === "name") {
          const trackA = allTracks.find((t) => t.id === a.track_id);
          const trackB = allTracks.find((t) => t.id === b.track_id);
          return trackA?.title.localeCompare(trackB?.title || "") ?? 0;
        }
        return 0;
      })
      .map((fav) => allTracks.find((track) => track.id === fav.track_id))
      .filter((el): el is ITrack => el !== undefined);
  }, [sortBy, favorites, allTracks]);
}
