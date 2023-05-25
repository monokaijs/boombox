import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {enqueueTrack} from "../actions/player.actions.ts";

export interface Track {
  id: string;
  title: string;
  picture: string;
  duration: number;
  source?: string;
  creationTime: number;
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
    syncQueue(state, action: PayloadAction<Track[]>) {
      action.payload.forEach(track => {
        if (!state.queue.find(x => x.id === track.id)) {
          state.queue.push(track);
        }
      });
      state.queue = state.queue.sort((a, b) => {
        return a.creationTime - b.creationTime;
      })
    }
  },
  extraReducers: builder => {
    builder.addCase(enqueueTrack.fulfilled, (state, action) => {
      state.queue.push(action.payload);
    });
  }
});

export const {
  syncQueue
} = playerSlice.actions;

export default playerSlice.reducer;
