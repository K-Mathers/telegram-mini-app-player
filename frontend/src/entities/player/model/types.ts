import type { ITrack } from "@/entities/track";
import type { PlayerStatus } from "@/shared/types/types";

export interface IPlayerState {
  currentTrack: ITrack | null;
  queue: ITrack[];
  status: PlayerStatus;
  progress: number;
  duration: number;
}
