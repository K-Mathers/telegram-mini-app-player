import { useEffect } from "react";
import { Routing } from "../pages/routes";
import { authByTelegram, selectAuthStatus } from "@/entities/user";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "./store";

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
    return <div>Загрузка...</div>;
  }

  if (status == "failed") {
    return <div>Не удалось загрузить</div>;
  }

  return (
    <div className="app">
      <Routing />
    </div>
  );
};
