import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {enqueueTrack} from "../actions/player.actions.ts";
import YouTube from "react-youtube";

export interface Track {
  id: string;
  title: string;
  picture: string;
  duration: number;
  source?: string;
  creationTime: number;
}

export interface PlayerState {
  queue: Track[];
  currentTrack?: string;
  currentTrackTime?: number;
  state: number;
}

const initialState: PlayerState = {
  queue: [],
  state: 0,
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
    },
    syncPlayer(state, action) {
      if (action.payload.currentTrack) state.currentTrack = action.payload.currentTrack;
      if (action.payload.currentTrackTime) state.currentTrackTime = action.payload.currentTrackTime;
      if (action.payload.state) state.state = action.payload.state;
    },
    updatePlayer(state, action) {
      state.state = action.payload;
    },
    moveToNextTrack(state) {
      state.currentTrackTime = 0;
      const currentIndex = state.queue.findIndex(t => t.id === state.currentTrack);
      if (currentIndex === state.queue.length - 1) {
        // end of queue, move to first
        state.currentTrack = state.queue[0].id;
      } else {
        state.currentTrack = state.queue[currentIndex + 1].id;
      }
    }
  },
  extraReducers: builder => {
    builder.addCase(enqueueTrack.fulfilled, (state, action) => {
      state.queue.push(action.payload);
      if (state.queue.length === 1) {
        state.currentTrack = action.payload.id;
        state.currentTrackTime = 0;
      }
    });
  }
});

export const {
  syncQueue,
  syncPlayer,
  moveToNextTrack,
  updatePlayer,
} = playerSlice.actions;

export default playerSlice.reducer;
