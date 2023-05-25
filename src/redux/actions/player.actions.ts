import {createAsyncThunk} from "@reduxjs/toolkit";
import YoutubeService from "../../services/youtube.service.ts";
import {Track} from "../slices/player.slice.ts";

export const enqueueTrack = createAsyncThunk<Track, string, any>('player/enqueue', async (youtubeUrl: string) => {
  const youtubeId = YoutubeService.parseYtbLink(youtubeUrl);
  const info = await fetch(`https://downloader.freemake.com/api/videoinfo/` + youtubeId).then(r => r.json());
  return {
    id: youtubeId as string,
    picture: `https://img.youtube.com/vi/${youtubeId}/default.jpg`,
    title: info.metaInfo.title,
    duration: info.metaInfo.duration
  }
});
