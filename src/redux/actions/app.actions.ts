import {createAsyncThunk} from "@reduxjs/toolkit";
import {Profile} from "../slices/app.slice.ts";
import slugify from "slugify";

export const setAppProfile = createAsyncThunk('app/set-profile', (profile: Profile) => {
  const randomNumber = ~~(Math.random() * 99999);
  return {
    ...profile,
    username: slugify(profile.name as string) + '-' + randomNumber
  }
});
