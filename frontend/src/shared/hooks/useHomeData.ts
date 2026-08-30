import type { AppDispatch } from "@/app/store";
import {
  fetchAllTracks,
  selectAllTracks,
  selectAllTracksStatus,
  type ITrack,
} from "@/entities/track";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRecentlyPlayed } from "../lib/storage/recentlyPlayed";
import { getRecommendations } from "../lib/recommendations/getRecommendations";

export const useHomeData = () => {
  const dispatch = useDispatch<AppDispatch>();
  const readAllTracks = useSelector(selectAllTracks);
  const status = useSelector(selectAllTracksStatus);

  const [recentlyPlayed, setRecentlyPlayed] = useState<ITrack[]>([]);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchAllTracks());
    }
  }, [dispatch, status]);

  useEffect(() => {
    const localData = getRecentlyPlayed();
    setRecentlyPlayed(localData);
  }, []);

  const recommendation = useMemo(() => {
    if (readAllTracks.length === 0) return [];

    return getRecommendations(readAllTracks, recentlyPlayed);
  }, [readAllTracks, recentlyPlayed]);

  return {
    readAllTracks,
    recommendation,
    recentlyPlayed,
    status,
  };
};
