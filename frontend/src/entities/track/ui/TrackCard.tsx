import type { ITrack } from "../model/types";
import { MoreVertical } from "lucide-react";
import "./TrackCard.css";
import { formatDuration } from "@/shared/lib/format/fortmatDuration";
import FavoriteBtn from "@/features/toggle-favorite/ui/FavoriteBtn/FavoriteBtn";
import { useSelector } from "react-redux";
import { selectCurrentTrack } from "@/entities/player";

interface ITrackCard {
  track: ITrack;
  index?: number;
  variant?: "grid" | "list";
  onClick: () => void;
  onToggleFavorite?: () => void;
  isFavorite?: boolean;
  dragListeners?: Record<string, unknown>;
}

export const TrackCard = ({
  track,
  index,
  variant = "list",
  onClick,
  onToggleFavorite,
  isFavorite,
  dragListeners,
}: ITrackCard) => {
  const currentTrack = useSelector(selectCurrentTrack);

  if (variant === "grid") {
    return (
      <div className="track-card-grid" onClick={onClick}>
        <div className="track-card-cover-wrapper">
          {track.cover_url ? (
            <img
              src={track.cover_url}
              alt={track.title}
              className="track-card-cover"
            />
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
    <div
      className={`track-item ${currentTrack?.id === track.id ? "track-item-active" : ""}`}
      onClick={onClick}
    >
      {index !== undefined && (
        <div className="track-index">
          {currentTrack?.id === track.id ? (
            <div className="equalizer">
              <div className="equalizer-bar" />
              <div className="equalizer-bar" />
              <div className="equalizer-bar" />
            </div>
          ) : (
            index
          )}
        </div>
      )}

      {track.cover_url ? (
        <img
          src={track.cover_url}
          alt={track.title}
          className="track-list-cover"
        />
      ) : (
        <div className="track-list-cover-placeholder"></div>
      )}

      <div className="track-info">
        <h3 className="track-title">{track.title}</h3>
        <p className="track-artist">Eminem</p>
        <p className="track-duration">
          {track.duration_sec ? (
            <span>{formatDuration(track.duration_sec)}</span>
          ) : null}
        </p>
      </div>

      <div className="track-right">
        {onToggleFavorite && (
          <FavoriteBtn
            onClick={onToggleFavorite}
            isFavorite={isFavorite ?? false}
          />
        )}

        <button
          className={`track-more-btn${dragListeners ? " track-more-btn--drag" : ""}`}
          onClick={(e) => e.stopPropagation()}
          {...(dragListeners ?? {})}
        >
          <MoreVertical size={16} />
        </button>
      </div>
    </div>
  );
};
