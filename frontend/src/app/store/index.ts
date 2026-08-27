import { albumReducer } from "@/entities/album/model/slice";
import { playerReducer } from "@/entities/player/model/slice";
import { trackReducer } from "@/entities/track/model/slice";
import { userReducer } from "@/entities/user";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    user: userReducer,
    album: albumReducer,
    track: trackReducer,
    player: playerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
