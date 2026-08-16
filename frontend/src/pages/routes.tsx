import { ALbumsPage } from "./albums/page";
import { Route, Routes } from "react-router-dom";
import { PlaylistPage } from "./playlist/page";
import { MorePage } from "./more/page";
import { HomePage } from "./home/page";

interface Iindex {}

export const Routing = ({}: Iindex) => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/albums" element={<ALbumsPage />} />
      <Route path="/playlist" element={<PlaylistPage />} />
      <Route path="/more" element={<MorePage />} />
    </Routes>
  );
};
