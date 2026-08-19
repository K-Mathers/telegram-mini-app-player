import type { RootState } from "@/app/store";

export const selectUser = (state: RootState) => state.user.user;
export const selectAuthStatus = (state: RootState) => state.user.status;
export const selectIsAuth = (state: RootState) => Boolean(state.user.token);
