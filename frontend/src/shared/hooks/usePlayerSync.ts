import type { AppDispatch } from "@/app/store";
import { audioEngine } from "@/entities/player/lib/audioEngine";
import { setDuration, setProgress, setStatus } from "@/entities/player/model/slice";
import { nextTrack } from "@/features/play-track/model/playerNavigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export const usePlayerSync = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const handleTimeUpdate = () =>
      dispatch(setProgress(audioEngine.audio.currentTime));
    const handleLoadedMeta = () =>
      dispatch(setDuration(audioEngine.audio.duration));
    const handleEnded = () => dispatch(nextTrack);
    const handlePlay = () => dispatch(setStatus("playing"));
    const handlePause = () => dispatch(setStatus("paused"));

    audioEngine.audio.addEventListener("timeupdate", handleTimeUpdate);
    audioEngine.audio.addEventListener("loadedmetadata", handleLoadedMeta);
    audioEngine.audio.addEventListener("ended", handleEnded);
    audioEngine.audio.addEventListener("play", handlePlay);
    audioEngine.audio.addEventListener("pause", handlePause);

    return () => {
      audioEngine.audio.removeEventListener("timeupdate", handleTimeUpdate);
      audioEngine.audio.removeEventListener("loadedmetadata", handleLoadedMeta);
      audioEngine.audio.removeEventListener("ended", handleEnded);
      audioEngine.audio.removeEventListener("play", handlePlay);
      audioEngine.audio.removeEventListener("pause", handlePause);
    };
  }, [dispatch]);
};
