import { useState } from "react";
import { MiniPlayer } from "./MiniPlayer/MiniPlayer";
import { FullPlayer } from "./FullPlayer/FullPlayer";
import { usePlayerSync } from "@/shared/hooks/usePlayerSync";

export const PlayerWidget = () => {
  const [isFullPlayerOpen, setIsFullPlayerOpen] = useState(false);
  usePlayerSync();
  return (
    <>
      <MiniPlayer onClick={() => setIsFullPlayerOpen(true)} />
      <FullPlayer
        isOpen={isFullPlayerOpen}
        onClose={() => setIsFullPlayerOpen(false)}
      />
    </>
  );
};
