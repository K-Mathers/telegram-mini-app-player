import type { AppDispatch } from "@/app/store";
import "./page.css";
import { favoriteTracks } from "@/entities/favorites";
import {
  selectAllTracks,
  SortableTrackCard,
  type ITrack,
} from "@/entities/track";
import { Page, PageHeader } from "@/shared/ui/page";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { playTrack } from "@/features/play-track";
import { toggleFavorite } from "@/features/toggle-favorite/model/toggleFavorite";
import { PlayActionButtons } from "@/features/play-collection";
import { formatDuration } from "@/shared/lib/format/fortmatDuration";
import SortCollectionBtn from "@/features/sort-collection/ui/SortCollectionBtn";
import { DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { reorderFavorites } from "@/entities/favorites/api/favoritesApi";
import { reorderFavoriteLocal } from "@/entities/favorites/model/slice";
import { useSortedFavorites } from "@/features/sort-collection/model/useSortedFavorites";

export const PlaylistPage = () => {
  const favorites = useSelector(favoriteTracks);
  const allTracks = useSelector(selectAllTracks);
  const dispatch = useDispatch<AppDispatch>();

  const favoritesList = useSortedFavorites(favorites, allTracks);

  const totalDuration = useMemo(
    () =>
      formatDuration(
        favoritesList.reduce((acc, curr) => acc + (curr.duration_sec || 0), 0),
      ),
    [favoritesList],
  );

  const drugHandleEvent = (e: DragEndEvent) => {
    const { active, over } = e;

    if (over && active.id !== over.id) {
      const oldIndex = favorites.findIndex(
        (track) => track.track_id == active.id,
      );
      const newIndex = favorites.findIndex(
        (track) => track.track_id === over.id,
      );

      const newOrder = arrayMove([...favorites], oldIndex, newIndex);
      dispatch(reorderFavoriteLocal(newOrder));
      dispatch(reorderFavorites(newOrder.map((el) => el.track_id)));
    }
  };

  const tracksIds = useMemo(
    () => favoritesList.map((track) => track.id),
    [favoritesList],
  );

  return (
    <Page>
      <PageHeader title="Playlists" />

      <div className="playlist-subheader">
        <div className="playlist-btn">
          <SortCollectionBtn />
        </div>
        <h2 className="playlist-subheader-title">Liked Songs</h2>
        <p className="length-title">
          {favorites.length} tracks • {totalDuration}
        </p>
      </div>

      <PlayActionButtons tracks={favoritesList} />

      <div className="">
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={drugHandleEvent}
        >
          <SortableContext
            items={tracksIds}
            strategy={verticalListSortingStrategy}
          >
            {favoritesList.map((track, index) => (
              <SortableTrackCard
                key={track.id}
                track={track}
                index={index + 1}
                onToggleFavorite={() => dispatch(toggleFavorite(track))}
                onClick={() => dispatch(playTrack(track, favoritesList))}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </Page>
  );
};
