import { useHomeData } from "@/shared/hooks/useHomeData";
import { TrackCard, type ITrack } from "@/entities/track";
import { playTrack } from "@/features/play-track";
import { useDispatch } from "react-redux";
import "./page.css";
import type { AppDispatch } from "@/app/store";
import { Page, PageHeader } from "@/shared/ui/page";
import { toggleFavorite } from "@/features/toggle-favorite/model/toggleFavorite";
import { useFavoriteIds } from "@/shared/hooks/useFavoriteIds";
import SortCollectionBtn from "@/features/sort-collection/ui/SortCollectionBtn";
import { useSortedTracks } from "@/features/sort-collection/model/useSortedTracks";

export const HomePage = () => {
  const { recentlyPlayed, recommendation } = useHomeData();
  const dispatch = useDispatch<AppDispatch>();
  const favoriteIds = useFavoriteIds();
  const sortedTracks = useSortedTracks(recommendation);

  const handlePlayRecentlyPlayed = (track: ITrack) => {
    dispatch(playTrack(track, recentlyPlayed));
  };

  const handlePlayRecommendation = (track: ITrack) => {
    dispatch(playTrack(track, recommendation));
  };

  return (
    <Page>
      <PageHeader title="Home" />

      <div className="home-subheader">
        <h2 className="home-subheader-title">Recently Played</h2>
      </div>

      {recentlyPlayed.length === 0 ? (
        <div className="empty-state-card">
          <p>No recently played tracks yet.</p>
        </div>
      ) : (
        <div className="recently-played-scroll">
          {recentlyPlayed.map((track) => (
            <TrackCard
              key={track.id}
              track={track}
              variant="grid"
              isFavorite={favoriteIds.has(track.id)}
              onToggleFavorite={() => dispatch(toggleFavorite(track))}
              onClick={() => handlePlayRecentlyPlayed(track)}
            />
          ))}
        </div>
      )}

      <div className="home-subheader" style={{ marginTop: "24px" }}>
        <h2 className="home-subheader-title">Recommendations</h2>
        <SortCollectionBtn />
      </div>

      <div className="recommendations-list">
        {sortedTracks.map((track, index) => (
          <TrackCard
            key={track.id}
            track={track}
            index={index + 1}
            variant="list"
            isFavorite={favoriteIds.has(track.id)}
            onToggleFavorite={() => dispatch(toggleFavorite(track))}
            onClick={() => handlePlayRecommendation(track)}
          />
        ))}
      </div>
    </Page>
  );
};
