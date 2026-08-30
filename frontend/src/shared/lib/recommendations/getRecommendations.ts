import type { ITrack } from "@/entities/track";
import { limit_tracks } from "@/shared/config/constants";

export const getRecommendations = (
  allTracks: ITrack[],
  recentlyPlayed: ITrack[],
): ITrack[] => {
  const recentAlbumsId = new Set(recentlyPlayed.map((el) => el.album_id));
  const recentlyTracksId = new Set(recentlyPlayed.map((el) => el.id));
  const recommendedTrack: ITrack[] = [];
  const recommendedId = new Set();

  for (const track of allTracks) {
    if (recentAlbumsId.has(track.album_id) && !recentlyTracksId.has(track.id)) {
      recommendedTrack.push(track);
      recommendedId.add(track.id);
    }
  }

  if (recommendedTrack.length >= limit_tracks) {
    return recommendedTrack.slice(0, limit_tracks);
  }

  const different_tracks = allTracks.filter(
    (el) => !recentlyTracksId.has(el.id) && !recommendedId.has(el.id),
  );

  const random_tracks = different_tracks.sort(() => Math.random() - 0.5);

  return [...recommendedTrack, ...random_tracks].slice(0, limit_tracks);
};
