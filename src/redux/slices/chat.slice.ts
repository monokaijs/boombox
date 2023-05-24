import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Profile} from "./app.slice.ts";

export interface ChatMessage {
  author: Profile;
  text: string;
  time: number;
}

export interface ChatState {
  messages: ChatMessage[]
}

const initialState: ChatState = {
  messages: [],
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage(state, action: PayloadAction<ChatMessage>) {
      state.messages.push(action.payload);
    }
  },
  extraReducers: builder => {
  }
});

export const {
  addMessage
} = chatSlice.actions;

export default chatSlice.reducer;
