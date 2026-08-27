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
} from "./model/selectors";
export type { IPlayerState } from "./model/types";
