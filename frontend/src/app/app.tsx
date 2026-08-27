import { useEffect } from "react";
import { Routing } from "../pages/routes";
import { authByTelegram, selectAuthStatus } from "@/entities/user";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "./store";
import Splash from "@/shared/ui/Splash/Splash";

interface Iapp { }

export const App = ({ }: Iapp) => {
  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector(selectAuthStatus);

  // after test delete
  useEffect(() => {
    const initData = window.Telegram?.WebApp?.initData;
    if (initData) {
      dispatch(authByTelegram(initData));
    } else {
      dispatch({
        type: "user/authByTelegram/fulfilled",
        payload: { access_token: "mock", token_type: "Bearer" },
      });
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
