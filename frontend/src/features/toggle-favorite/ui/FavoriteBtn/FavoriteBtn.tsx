import { Heart } from "lucide-react";
import "./FavoriteBtn.css";

interface IFavoriteBtn {
  isFavorite: boolean;
  onClick: () => void;
}

const FavoriteBtn = ({ isFavorite, onClick }: IFavoriteBtn) => {
  return (
    <button
      className="track-more-btn"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <Heart size={24} fill={isFavorite ? "currentColor" : "none"} />
    </button>
  );
};

export default FavoriteBtn;
