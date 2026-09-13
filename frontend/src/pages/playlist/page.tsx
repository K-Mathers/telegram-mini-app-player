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

export const PlaylistPage = () => {
  const favorites = useSelector(favoriteTracks);
  const allTracks = useSelector(selectAllTracks);
  const dispatch = useDispatch<AppDispatch>();

  const favoritesList = useMemo(() => {
    return favorites
      .map((fav) => allTracks.find((track) => track.id === fav.track_id))
      .filter((el): el is ITrack => el !== undefined);
  }, [favorites, allTracks]);

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
