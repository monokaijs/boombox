import {createAsyncThunk} from "@reduxjs/toolkit";
import {Track} from "../slices/player.slice.ts";
import YoutubeService from "../../services/youtube.service.ts";

export const prepareTrack = async (youtubeUrl: string) => {
  const youtubeId = YoutubeService.parseYtbLink(youtubeUrl);
  const info = await fetch(`https://ytb-video-finder.vercel.app/api/` + youtubeId).then(r => r.json());
  return {
    id: youtubeId as string,
    picture: `https://img.youtube.com/vi/${youtubeId}/default.jpg`,
    title: info.title,
    duration: parseInt(info.lengthSeconds),
    creationTime: new Date().getTime(),
  }
}

export const enqueueTrack = createAsyncThunk<Track, Track, any>('player/enqueue', async (track: Track, thunkAPI) => {
  return track;
});
