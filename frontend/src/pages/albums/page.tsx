import type { AppDispatch } from "@/app/store";
import {
  AlbumCard,
  fetchAlbums,
  selectAlbums,
  selectAlbumStatus,
} from "@/entities/album";
import Splash from "@/shared/ui/Splash/Splash";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./page.css";
import { Page, PageHeader } from "@/shared/ui/page";
import SortCollectionBtn from "@/features/sort-collection/ui/SortCollectionBtn";
import { useSortedTracks } from "@/features/sort-collection/model/useSortedTracks";

interface Ipage {}

export const ALbumsPage = ({}: Ipage) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const albums = useSelector(selectAlbums);
  const status = useSelector(selectAlbumStatus);
  const sortedAlbums = useSortedTracks(albums);

  useEffect(() => {
    dispatch(fetchAlbums());
  }, [dispatch]);

  if (status == "loading" || status == "idle") {
    return <Splash />;
  }

  if (status == "failed") {
    return <div>Failed</div>;
  }

  return (
    <Page>
      <PageHeader title="Albums" />

      <div className="line"></div>
      <div className="albums-subheader">
        <SortCollectionBtn />
        <h2 className="albums-subheader-title">Discography</h2>
      </div>

      <div className="albums-list">
        {sortedAlbums.map((album) => (
          <AlbumCard
            key={album.id}
            album={album}
            onClick={() => navigate(`/albums/${album.id}`)}
          />
        ))}
      </div>
    </Page>
  );
};
