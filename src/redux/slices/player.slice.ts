import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {enqueueTrack} from "../actions/player.actions.ts";

export interface Track {
  id: string;
  title: string;
  picture: string;
  duration: number;
}

export interface PlayerState {
  queue: Track[]
}

const initialState: PlayerState = {
  queue: []
};

export const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
  },
  extraReducers: builder => {
    builder.addCase(enqueueTrack.fulfilled, (state, action) => {
      state.queue.push(action.payload);
    });
  }
});

export const {
} = playerSlice.actions;

export default playerSlice.reducer;
