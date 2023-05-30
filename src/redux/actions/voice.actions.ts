import {createAsyncThunk} from "@reduxjs/toolkit";

export const toggleMutePeer = createAsyncThunk('voice/mute-peer', (connectionId: string) => {
  return connectionId;
});
