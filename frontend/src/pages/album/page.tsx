import type { AppDispatch, RootState } from "@/app/store";
import { selectAlbumById } from "@/entities/album/model/selectors";
import {
  fetchAlbumTracks,
  selectTracks,
  selectTrackStatus,
  TrackCard,
} from "@/entities/track";
import Splash from "@/shared/ui/Splash/Splash";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MoreHorizontal, Play, Shuffle } from "lucide-react";
import "./page.css";

import { playTrack } from "@/features/play-track/model/playerNavigation";

interface Ipage {}

export const AlbumDetailPage = ({}: Ipage) => {
  const { albumId } = useParams<{ albumId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const album = useSelector((state: RootState) =>
    albumId ? selectAlbumById(state, Number(albumId)) : undefined,
  );
  const tracks = useSelector(selectTracks);
  const status = useSelector(selectTrackStatus);

  useEffect(() => {
    if (albumId) {
      dispatch(fetchAlbumTracks(albumId));
    }
  }, [albumId, dispatch]);

  if (status == "loading" || status == "idle") {
    return <Splash />;
  }

  if (status == "failed") {
    return <div>Failed</div>;
  }

  return (
    <div className="album-detail-page">
      <header className="album-detail-header">
        <button className="album-detail-icon-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={24} />
        </button>
        <button className="album-detail-icon-btn">
          <MoreHorizontal size={24} />
        </button>
      </header>

      <div className="album-hero">
        <img
          src={album?.cover_url || "not-cover"}
          alt={album?.title}
          className="album-hero-cover"
        />
        <h1 className="album-hero-title">{album?.title}</h1>
        <p className="album-hero-meta">{tracks.length} Tracks</p>
      </div>

      <div className="album-actions">
        <button className="album-btn-play">
          <Play size={20} fill="currentColor" /> Play All
        </button>
        <button className="album-btn-shuffle">
          <Shuffle size={20} /> Shuffle
        </button>
      </div>

      <div className="album-tracks-list">
        {tracks.map((track, index) => (
          <TrackCard
            key={track.id}
            index={index + 1}
            track={track}
            onClick={() => dispatch(playTrack(track, tracks))}
          />
        ))}
      </div>

    </div>
  );
};
