import { useEffect } from "react";
import { Routing } from "../pages/routes";
import { authByTelegram, selectAuthStatus } from "@/entities/user";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "./store";
import Splash from "@/shared/ui/Splash/Splash";

interface Iapp {}

export const App = ({}: Iapp) => {
  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector(selectAuthStatus);

  useEffect(() => {
    const initData = window.Telegram.WebApp.initData;
    if (initData) {
      dispatch(authByTelegram(initData));
    }
  }, [dispatch]);

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
