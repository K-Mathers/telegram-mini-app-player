import type { AppDispatch } from "@/app/store";
import {
  AlbumCard,
  fetchAlbums,
  selectAlbums,
  selectAlbumStatus,
} from "@/entities/album";
import Splash from "@/shared/ui/Splash/Splash";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./page.css";
import { Page, PageHeader } from "@/shared/ui/page";
import SortCollectionBtn from "@/features/sort-collection/ui/SortCollectionBtn";
import { selectSortBy } from "@/features/sort-collection";

interface Ipage {}

export const ALbumsPage = ({}: Ipage) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const albums = useSelector(selectAlbums);
  const status = useSelector(selectAlbumStatus);
  const filterTracks = useSelector(selectSortBy);

  useEffect(() => {
    dispatch(fetchAlbums());
  }, [dispatch]);

  const albumList = useMemo(() => {
    return [...albums].sort((a, b) => {
      if (filterTracks === "date") {
        return new Date(b.year).getTime() - new Date(a.year).getTime();
      }
      if (filterTracks === "name") {
        return a.title.localeCompare(b.title || "") ?? 0;
      }
      return 0;
    });
  }, [filterTracks, albums]);

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
        {albumList.map((album) => (
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
