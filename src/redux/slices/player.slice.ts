import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface PlayerState {
}

const initialState: PlayerState = {
};

export const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
  },
  extraReducers: builder => {
  }
});

export const {
} = playerSlice.actions;

export default playerSlice.reducer;
