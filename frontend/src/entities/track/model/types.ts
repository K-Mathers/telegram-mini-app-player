export interface ITrack {
  title: string;
  album_id: number;
  duration_sec: number;
  audio_url: string | null;
  cover_url: string | null;
  tags: string[];
  id: number;
}
