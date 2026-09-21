import { useMemo } from "react";
import { useSelector } from "react-redux";
import { selectSortBy } from "./slice";

export function useSortedTracks<T extends { id: number; title: string }>(
  tracks: T[],
): T[] {
  const sortBy = useSelector(selectSortBy);

  return useMemo(() => {
    return [...tracks].sort((a, b) => {
      if (sortBy === "date") {
        return b.id - a.id;
      }
      if (sortBy === "name") {
        return a.title.localeCompare(b.title || "") ?? 0;
      }
      return 0;
    });
  }, [sortBy, tracks]);
}
