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

  // local start (not used ngrok & Telegram)
  //  1. backend/.env → DEBUG=True
  //  2. Run: uvicorn main_api:app --reload
  //  3. Run: npm run dev (из папки frontend/)
  //  Login will be auto dev_test_user (id=999999999)
  //  window.Telegram?.WebApp?.initData = undefined → back ignore if DEBUG=True

  // Prod (Telegram Mini App):
  // initData fill Telegram auto
  useEffect(() => {
    const initData = window.Telegram?.WebApp?.initData;
    dispatch(authByTelegram(initData));
  }, [dispatch]);

  // Listen event from api.ts when a 401 response
  // Applies only in production (expired token).
  // In local dev with DEBUG=True, block is never called.

  useEffect(() => {
    const handleAuthExpired = () => {
      const initData = window.Telegram?.WebApp?.initData;
      dispatch(authByTelegram(initData));
    };
    window.addEventListener("auth:expired", handleAuthExpired);
    return () => window.removeEventListener("auth:expired", handleAuthExpired);
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
