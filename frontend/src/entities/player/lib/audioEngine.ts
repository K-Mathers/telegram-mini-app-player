const audio = new Audio();

export const audioEngine = {
  audio,
  play(url: string) {
    audio.src = url;
    audio.play();
  },
  pause() {
    audio.pause();
  },
  resume() {
    audio.play();
  },
  seek(time: number) {
    audio.currentTime = time;
  },
};
