import { useEffect } from "react";
import { Routing } from "../pages/routes";
import { authByTelegram, selectAuthStatus } from "@/entities/user";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "./store";
import Splash from "@/shared/ui/Splash/Splash";
import { selectCurrentTrack } from "@/entities/player";
import { addToRecentlyPlayed } from "@/shared/lib/storage/recentlyPlayed";
import { fetchFavorites } from "@/entities/favorites";

interface Iapp {}

export const App = ({}: Iapp) => {
  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector(selectAuthStatus);
  const currentTrack = useSelector(selectCurrentTrack);

  useEffect(() => {
    if (currentTrack) {
      addToRecentlyPlayed(currentTrack);
    }
  }, [currentTrack]);

  // after test delete
  useEffect(() => {
    const initData = window.Telegram?.WebApp?.initData;
    dispatch(authByTelegram(initData));
  }, [dispatch]);

  useEffect(() => {
    if (status === "succeeded") {
      dispatch(fetchFavorites());
    }
  }, [status, dispatch]);

  if (status == "loading" || status == "idle") {
    return <Splash />;
  }

  if (status == "failed") {
    return <div>Failed</div>;
  }

  return (
    <div className="app">
      <Routing />
    </div>
  );
};
