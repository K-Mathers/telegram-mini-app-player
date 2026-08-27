import { Outlet } from "react-router-dom";
import "./Layout.css";
import { BottomNav } from "@/widgets/bottom-nav/ui/BottomNav";
import { PlayerWidget } from "@/widgets/player";

interface ILayout {}

const Layout = ({}: ILayout) => {
  return (
    <div className="main">
      <main className="layout_content">
        <Outlet />
      </main>
      <PlayerWidget />
      <BottomNav />
    </div>
  );
};

export default Layout;
