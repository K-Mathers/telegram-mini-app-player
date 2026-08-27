import type { AppDispatch, RootState } from "@/app/store";
import { audioEngine, setStatus, setTrack } from "@/entities/player";
import type { ITrack } from "@/entities/track";

const shiftTrack = (
  dispatch: AppDispatch,
  getState: () => RootState,
  direction: 1 | -1,
) => {
  const { currentTrack, queue } = getState().player;
  if (!currentTrack || queue.length === 0) return;

  const currentIndex = queue.findIndex((t) => t.id === currentTrack.id);
  const next = queue[currentIndex + direction];

  if (!next) {
    dispatch(setStatus("idle"));
    return;
  }

  audioEngine.play(next.audio_url || "");
  dispatch(setTrack({ track: next, queue }));
};

export const playTrack =
  (track: ITrack, queue: ITrack[]) => (dispatch: AppDispatch) => {
    audioEngine.play(track.audio_url || "");
    dispatch(setTrack({ track, queue }));
  };

export const nextTrack = (dispatch: AppDispatch, getState: () => RootState) =>
  shiftTrack(dispatch, getState, 1);

export const prevTrack = (dispatch: AppDispatch, getState: () => RootState) =>
  shiftTrack(dispatch, getState, -1);
