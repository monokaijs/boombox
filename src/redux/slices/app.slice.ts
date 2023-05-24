import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {setAppProfile} from "../actions/app.actions.ts";

export interface Profile {
  name: string;
  icon: string;
  username: string;
}

export interface AppState {
  appLoading: boolean,
  modals: {
    createAccount: boolean;
  },
  profile?: Profile;
}

const initialState: AppState = {
  appLoading: true,
  modals: {
    createAccount: true,
  }
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
  },
  extraReducers: builder => {
    builder.addCase(setAppProfile.fulfilled, (state, action) => {
      state.profile = action.payload;
    })
  }
});

export const {
} = appSlice.actions;

export default appSlice.reducer;
