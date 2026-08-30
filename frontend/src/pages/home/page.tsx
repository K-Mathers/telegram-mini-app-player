import { useHomeData } from "@/shared/hooks/useHomeData";
import { TrackCard, type ITrack } from "@/entities/track";
import { playTrack } from "@/features/play-track";
import { useDispatch } from "react-redux";
import { ListFilter } from "lucide-react";
import "./page.css";
import type { AppDispatch } from "@/app/store";

export const HomePage = () => {
  const { recentlyPlayed, recommendation, status } = useHomeData();
  const dispatch = useDispatch<AppDispatch>();

  const handlePlayRecentlyPlayed = (track: ITrack) => {
    dispatch(playTrack(track, recentlyPlayed));
  };

  const handlePlayRecommendation = (track: ITrack) => {
    dispatch(playTrack(track, recommendation));
  };

  return (
    <div className="home-page">
      <header className="home-header">
        <h1 className="home-header-text">Home</h1>
      </header>

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
              onClick={() => handlePlayRecentlyPlayed(track)}
            />
          ))}
        </div>
      )}

      <div className="home-subheader" style={{ marginTop: "24px" }}>
        <h2 className="home-subheader-title">Recommendations</h2>
        <button className="home-filter-btn">
          <ListFilter size={16} />
        </button>
      </div>

      <div className="recommendations-list">
        {recommendation.map((track, index) => (
          <TrackCard
            key={track.id}
            track={track}
            index={index + 1}
            variant="list"
            onClick={() => handlePlayRecommendation(track)}
          />
        ))}
      </div>
    </div>
  );
};
