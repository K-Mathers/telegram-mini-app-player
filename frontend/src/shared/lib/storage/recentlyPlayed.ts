import type { ITrack } from "@/entities/track";
import { limit_tracks } from "@/shared/config/constants";

const STORAGE_KEY = "recently-played";

export const addToRecentlyPlayed = (track: ITrack) => {
  const data = localStorage.getItem(STORAGE_KEY);
  const list: ITrack[] = data ? JSON.parse(data) : [];

  const filtered = list.filter((el) => el.id !== track.id);
  const updated = [track, ...filtered].slice(0, limit_tracks);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const getRecentlyPlayed = (): ITrack[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};
