import type { RootState } from "@/app/store";

export const selectAlbums = (state: RootState) => state.album.albums
export const selectAlbumStatus = (state: RootState) => state.album.status