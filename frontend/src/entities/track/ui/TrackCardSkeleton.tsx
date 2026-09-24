import Skeleton from "@/shared/ui/Skeleton/Skeleton";
import "./TrackCard.css";

export const TrackCardSkeleton = () => {
  return (
    <div className="track-item" style={{ pointerEvents: "none" }}>
      <div className="track-index">
        <Skeleton width="16px" height="16px" />
      </div>

      <div style={{ marginRight: "12px" }}>
        <Skeleton width="48px" height="48px" borderRadius="8px" />
      </div>

      <div className="track-info" style={{ gap: "8px", flex: 1 }}>
        <Skeleton width="60%" height="16px" />
        <Skeleton width="40%" height="12px" />
      </div>

      <div className="track-right">
        <Skeleton width="24px" height="24px" borderRadius="50%" />
      </div>
    </div>
  );
};
