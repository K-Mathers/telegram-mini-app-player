import Skeleton from "@/shared/ui/Skeleton/Skeleton";
import "./AlbumCard.css";

export const AlbumCardSkeleton = () => {
  return (
    <div className="album-item" style={{ pointerEvents: "none" }}>
      <div className="cover-wrapper">
        <Skeleton width="100%" height="100%" borderRadius="6px" />
      </div>

      <div className="album-info" style={{ flex: 1, gap: "8px" }}>
        <Skeleton width="70%" height="16px" />
        <Skeleton width="40%" height="13px" />
      </div>
    </div>
  );
};
