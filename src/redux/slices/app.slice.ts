import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {setAppProfile} from "../actions/app.actions.ts";
import {requestVoicePermission, toggleMutePeer} from "../actions/voice.actions.ts";

export interface Profile {
  name?: string;
  icon?: string;
  username?: string;
  connectionId: string;
  hasVoice?: string;
  muted?: boolean;
}

export interface AppState {
  appLoading: boolean,
  mode: 'idle' | 'host' | 'peer',
  modals: {
    createAccount: boolean;
  },
  profile?: Profile;
  peers: Profile[];
  voicePermitted: boolean;
}

const initialState: AppState = {
  appLoading: true,
  mode: 'idle',
  modals: {
    createAccount: true,
  },
  peers: [],
  voicePermitted: false
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    signOutProfile(state) {
      state.profile = undefined;
    },
    addPeer(state, action: PayloadAction<string>) {
      const peerId = action.payload;
      if (!state.peers.find(peer => peer.username === peerId)) {
        state.peers.push({
          connectionId: peerId
        });
      }
    },
    updatePeerProfile(state, action: PayloadAction<{profile: Profile, connectionId: string}>) {
      const profile = action.payload.profile;
      state.peers = state.peers.map(peer => {
        if (peer.connectionId === action.payload.connectionId) {
          peer.icon = profile.icon;
          peer.name = profile.name;
          peer.username = profile.username;
        }
        return peer;
      });
    },
    removePeer(state, action: PayloadAction<string>) {
      state.peers = state.peers.filter(peer => {
        return peer.connectionId !== action.payload;
      });
    }
  },
  extraReducers: builder => {
    builder.addCase(setAppProfile.fulfilled, (state, action) => {
      state.profile = action.payload;
    }).addCase(toggleMutePeer.fulfilled, (state, action) => {
      state.peers = state.peers.map(peer => {
        if (peer.connectionId === action.payload) {
          peer.muted = !peer.muted;
        }
        return peer;
      })
    }).addCase(requestVoicePermission.fulfilled, (state, action) => {
      state.voicePermitted = true;
    });
  }
});

export const {
  addPeer,
  updatePeerProfile,
  removePeer,
  signOutProfile,
} = appSlice.actions;

export default appSlice.reducer;
