
import { useSelector, useDispatch } from "react-redux";
import {
  selectCurrentTrack,
  selectPlayerStatus,
  selectProgress,
  selectDuration,
  audioEngine
} from "@/entities/player";
import { nextTrack, prevTrack } from "@/features/play-track";
import type { AppDispatch } from "@/app/store";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  ChevronDown,
  MoreHorizontal,
  Heart
} from "lucide-react";
import "./FullPlayer.css";
import { formatDuration } from "@/shared/lib/format/fortmatDuration";
import { ProgressBar } from "@/shared/ui/ProgressBar";

interface FullPlayerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FullPlayer = ({ isOpen, onClose }: FullPlayerProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const currentTrack = useSelector(selectCurrentTrack);
  const status = useSelector(selectPlayerStatus);
  const progress = useSelector(selectProgress);
  const duration = useSelector(selectDuration);
  if (!currentTrack) {
    return null;
  }

  const togglePlay = () => {
    if (status === "playing") {
      audioEngine.pause();
    } else {
      audioEngine.resume();
    }
  };

  return (
    <div className={`full-player-container ${isOpen ? 'open' : ''}`}>
      <div className="full-player-header">
        <button className="full-player-icon-btn" onClick={onClose}>
          <ChevronDown size={28} />
        </button>
        <span className="full-player-header-title">NOW PLAYING</span>
        <button className="full-player-icon-btn">
          <MoreHorizontal size={24} />
        </button>
      </div>

      <div className="full-player-artwork-container">
        <img
          src={currentTrack.cover_url || "/placeholder.jpg"}
          alt={currentTrack.title}
          className="full-player-artwork"
        />
      </div>

      <div className="full-player-info">
        <div className="full-player-text">
          <h2 className="full-player-title">{currentTrack.title}</h2>
          <p className="full-player-artist">Eminem</p>
        </div>
        <button className="full-player-icon-btn">
          <Heart size={24} />
        </button>
      </div>

      <div className="full-player-scrubber">
        <ProgressBar
          value={progress}
          max={duration}
          onChange={(newTime) => audioEngine.seek(newTime)}
          formatValue={formatDuration}
        />
      </div>

      <div className="full-player-controls">
        <button className="full-player-icon-btn secondary">
          <Shuffle size={20} />
        </button>
        <button className="full-player-icon-btn primary" onClick={() => dispatch(prevTrack)}>
          <SkipBack size={32} fill="currentColor" />
        </button>
        <button className="full-player-play-btn" onClick={togglePlay}>
          {status === "playing" ? (
            <Pause size={32} fill="currentColor" />
          ) : (
            <Play size={32} fill="currentColor" />
          )}
        </button>
        <button className="full-player-icon-btn primary" onClick={() => dispatch(nextTrack)}>
          <SkipForward size={32} fill="currentColor" />
        </button>
        <button className="full-player-icon-btn secondary">
          <Repeat size={20} />
        </button>
      </div>
    </div>
  );
};
