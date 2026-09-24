import { ALbumsPage } from "./albums/page";
import { Route, Routes } from "react-router-dom";
import { PlaylistPage } from "./playlist/page";
import { MorePage } from "./more/page";
import { HomePage } from "./home/page";
import Layout from "@/widgets/Layout/ui/Layout";
import { AlbumDetailPage } from "./album/page";

export const Routing = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/playlists" element={<PlaylistPage />} />
        <Route path="/albums" element={<ALbumsPage />} />
        <Route path="/albums/:albumId" element={<AlbumDetailPage />} />
        <Route path="/more" element={<MorePage />} />
      </Route>
    </Routes>
  );
};
