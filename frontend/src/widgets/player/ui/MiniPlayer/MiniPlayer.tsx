import { useSelector, useDispatch } from "react-redux";
import { selectCurrentTrack, selectPlayerStatus, selectProgress, selectDuration, audioEngine } from "@/entities/player";
import { nextTrack } from "@/features/play-track";
import type { AppDispatch } from "@/app/store";
import { Play, Pause, SkipForward } from "lucide-react";
import "./MiniPlayer.css";

interface MiniPlayerProps {
  onClick: () => void;
}

export const MiniPlayer = ({ onClick }: MiniPlayerProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const currentTrack = useSelector(selectCurrentTrack);
  const status = useSelector(selectPlayerStatus);
  const progress = useSelector(selectProgress);
  const duration = useSelector(selectDuration);

  if (!currentTrack) {
    return null;
  }

  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (status === "playing") {
      audioEngine.pause();
    } else {
      audioEngine.resume();
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(nextTrack);
  };

  return (
    <div className="mini-player-container" onClick={onClick}>
      <div className="mini-player-progress">
        <div
          className="mini-player-progress-bar"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="mini-player-content">
        <div className="mini-player-left">
          <img
            src={currentTrack.cover_url || "/placeholder.jpg"}
            alt={currentTrack.title}
            className="mini-player-cover"
          />
          <div className="mini-player-info">
            <span className="mini-player-title">{currentTrack.title}</span>
            <span className="mini-player-artist">Eminem</span>
          </div>
        </div>

        <div className="mini-player-controls">
          <button className="mini-player-btn" onClick={togglePlay}>
            {status === "playing" ? (
              <Pause size={24} fill="currentColor" />
            ) : (
              <Play size={24} fill="currentColor" />
            )}
          </button>
          <button className="mini-player-btn" onClick={handleNext}>
            <SkipForward size={24} fill="currentColor" />
          </button>
        </div>
      </div>
    </div>
  );
};
