import type { ITrack } from "../model/types";
import { MoreVertical } from "lucide-react";
import "./TrackCard.css";
import { formatDuration } from "@/shared/lib/format/fortmatDuration";

interface ITrackCard {
  track: ITrack;
  index: number;
  onClick: () => void;
}

export const TrackCard = ({ track, index, onClick }: ITrackCard) => {
  return (
    <div className="track-item" onClick={onClick}>
      <div className="track-index">{index}</div>

      <div className="track-info">
        <h3 className="track-title">{track.title}</h3>
        <p className="track-artist">Eminem</p>
      </div>

      <div className="track-right">
        <span>{formatDuration(track.duration_sec || 0)}</span>
        <button className="track-more-btn">
          <MoreVertical size={16} />
        </button>
      </div>
    </div>
  );
};
