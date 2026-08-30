import type { ITrack } from "../model/types";
import { MoreVertical } from "lucide-react";
import "./TrackCard.css";
import { formatDuration } from "@/shared/lib/format/fortmatDuration";

interface ITrackCard {
  track: ITrack;
  index?: number;
  variant?: "grid" | "list";
  onClick: () => void;
  onToggleFavorite?: () => void;
  isFavorite?: boolean;
}

export const TrackCard = ({ track, index, variant = "list", onClick, onToggleFavorite, isFavorite }: ITrackCard) => {
  if (variant === "grid") {
    return (
      <div className="track-card-grid" onClick={onClick}>
        <div className="track-card-cover-wrapper">
          {track.cover_url ? (
            <img src={track.cover_url} alt={track.title} className="track-card-cover" />
          ) : (
            <div className="track-card-cover-placeholder"></div>
          )}
        </div>
        <div className="track-card-info">
          <h3 className="track-card-title">{track.title}</h3>
          <p className="track-card-artist">Eminem</p>
        </div>
      </div>
    );
  }

  return (
    <div className="track-item" onClick={onClick}>
      {index !== undefined && <div className="track-index">{index}</div>}

      {track.cover_url ? (
        <img src={track.cover_url} alt={track.title} className="track-list-cover" />
      ) : (
        <div className="track-list-cover-placeholder"></div>
      )}

      <div className="track-info">
        <h3 className="track-title">{track.title}</h3>
        <p className="track-artist">Eminem</p>
      </div>

      <div className="track-right">
        {track.duration_sec ? <span>{formatDuration(track.duration_sec)}</span> : null}
        <button className="track-more-btn" onClick={(e) => { e.stopPropagation(); }}>
          <MoreVertical size={16} />
        </button>
      </div>
    </div>
  );
};
