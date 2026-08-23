import { Outlet } from "react-router-dom";
import "./Layout.css";
import { BottomNav } from "@/widgets/bottom-nav/ui/BottomNav";

interface ILayout {}

const Layout = ({}: ILayout) => {
  return (
    <div className="main">
      <main className="layout_content">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};

export default Layout;
