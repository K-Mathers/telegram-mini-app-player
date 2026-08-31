import React from "react";
import { Play, Shuffle } from "lucide-react";
import { Button } from "@/shared/ui/button";
import styles from "./PlayActionButtons.module.css";
import { useDispatch } from "react-redux";
import { playTrack } from "@/features/play-track";
import type { AppDispatch } from "@/app/store";
import type { ITrack } from "@/entities/track";

interface PlayActionButtonsProps {
  tracks: ITrack[];
  collectionId?: string | number;
}

export const PlayActionButtons = ({
  tracks,
  collectionId,
}: PlayActionButtonsProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const handlePlayAll = () => {
    if (tracks.length > 0) {
      dispatch(playTrack(tracks[0], tracks));
    }
  };

  const handleShuffle = () => {
    if (tracks.length > 0) {
      const randomIndex = Math.floor(Math.random() * tracks.length);
      dispatch(playTrack(tracks[randomIndex], tracks));
    }
  };

  return (
    <div className={styles.container}>
      <Button
        variant="primary"
        icon={<Play size={20} fill="currentColor" />}
        onClick={handlePlayAll}
      >
        Play All
      </Button>
      <Button
        variant="secondary"
        icon={<Shuffle size={20} />}
        onClick={handleShuffle}
      >
        Shuffle
      </Button>
    </div>
  );
};
