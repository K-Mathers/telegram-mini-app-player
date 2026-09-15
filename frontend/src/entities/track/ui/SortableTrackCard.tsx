import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TrackCard } from "./TrackCard";
import type { ITrack } from "../model/types";
import "./SortableTrackCard.css";

interface ISortableTrackCard {
  track: ITrack;
  index: number;
  onToggleFavorite: () => void;
  onClick: () => void;
}

export const SortableTrackCard = ({
  track,
  index,
  onToggleFavorite,
  onClick,
}: ISortableTrackCard) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: track.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={isDragging ? "sortable-track-wrapper--dragging" : ""}
    >
      <TrackCard
        track={track}
        index={index}
        isFavorite={true}
        variant="list"
        onToggleFavorite={onToggleFavorite}
        onClick={onClick}
        dragListeners={listeners}
      />
    </div>
  );
};
