import type { AppDispatch } from "@/app/store";
import "./page.css";
import { favoriteTracks } from "@/entities/favorites";
import { selectAllTracks, TrackCard, type ITrack } from "@/entities/track";
import { Page, PageHeader } from "@/shared/ui/page";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { playTrack } from "@/features/play-track";
import { toggleFavorite } from "@/features/toggle-favorite/model/toggleFavorite";
import { PlayActionButtons } from "@/features/play-collection";
import { formatDuration } from "@/shared/lib/format/fortmatDuration";
import SortCollectionBtn from "@/features/sort-collection/ui/SortCollectionBtn";
import { selectSortBy } from "@/features/sort-collection";

export const PlaylistPage = () => {
  const favorites = useSelector(favoriteTracks);
  const allTracks = useSelector(selectAllTracks);
  const filterTracks = useSelector(selectSortBy);
  const dispatch = useDispatch<AppDispatch>();

  const favoritesList = useMemo(() => {
    return [...favorites]
      .sort((a, b) => {
        if (filterTracks === "date") {
          return (
            new Date(b.added_at).getTime() - new Date(a.added_at).getTime()
          );
        } else if (filterTracks === "name") {
          const trackA = allTracks.find((t) => t.id === a.track_id);
          const trackB = allTracks.find((t) => t.id === b.track_id);
          return trackA?.title.localeCompare(trackB?.title || "") ?? 0
        }
        return 0;
      })
      .map((fav) => allTracks.find((track) => track.id === fav.track_id))
      .filter((el): el is ITrack => el !== undefined);
  }, [favorites, allTracks, filterTracks]);

  const totalDuration = useMemo(
    () =>
      formatDuration(
        favoritesList.reduce((acc, curr) => acc + (curr.duration_sec || 0), 0),
      ),
    [favoritesList],
  );

  return (
    <Page>
      <PageHeader title="Playlists" />

      <div className="playlist-subheader">
        {/* rework */}
        <div className="test-1">
          <SortCollectionBtn />
        </div>
        <h2 className="playlist-subheader-title">Liked Songs</h2>
        <p className="length-title">
          {favorites.length} tracks • {totalDuration}
        </p>
      </div>

      <PlayActionButtons tracks={favoritesList} />

      <div className="">
        {favoritesList.map((track, index) => (
          <TrackCard
            key={track.id}
            track={track}
            index={index + 1}
            isFavorite={true}
            variant="list"
            onToggleFavorite={() => dispatch(toggleFavorite(track))}
            onClick={() => dispatch(playTrack(track, favoritesList))}
          />
        ))}
      </div>
    </Page>
  );
};
