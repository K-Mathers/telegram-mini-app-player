export { audioEngine } from "./lib/audioEngine";
export {
  setTrack,
  setStatus,
  setProgress,
  setDuration,
  playerReducer,
} from "./model/slice";
export {
  selectCurrentTrack,
  selectPlayerStatus,
  selectProgress,
  selectDuration,
  selectQueue,
} from "./model/selectors";
export type { IPlayerState } from "./model/types";
