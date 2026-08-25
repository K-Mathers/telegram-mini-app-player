import type { IAlbum } from "../model/types";
import "./AlbumCard.css";

interface IAlbumCardProps {
  album: IAlbum;
  onClick?: () => void;
}

export const AlbumCard = ({ album, onClick }: IAlbumCardProps) => {
  return (
    <div className="album-item" onClick={onClick}>
      <div className="cover-wrapper">
        <img
          src={album.cover_url || "not-cover"}
          alt={album.title}
          className="cover-image"
        />
      </div>
      <div className="album-info">
        <h2 className="album-title">{album.title}</h2>
        <p className="album-meta">
          {album.year} • {album.type}
        </p>
      </div>
    </div>
  );
};
