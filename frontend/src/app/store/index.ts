import { albumReducer } from "@/entities/album/model/slice";
import { trackReducer } from "@/entities/track/model/slice";
import { userReducer } from "@/entities/user";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    user: userReducer,
    album: albumReducer,
    track: trackReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
