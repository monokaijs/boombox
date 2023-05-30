import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {setAppProfile} from "../actions/app.actions.ts";
import {requestVoicePermission, switchInputDevice, toggleMutePeer} from "../actions/voice.actions.ts";

export interface Profile {
  name?: string;
  icon?: string;
  username?: string;
  connectionId: string;
  hasVoice?: string;
  voiceConnected?: boolean;
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
  inputDeviceId?: string;
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
          if (profile.icon) peer.icon = profile.icon;
          if (profile.name) peer.name = profile.name;
          if (profile.username) peer.username = profile.username;
          if (profile.hasVoice) peer.hasVoice = profile.hasVoice;
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
    }).addCase(switchInputDevice.fulfilled, (state, action) => {
      state.inputDeviceId = action.payload;
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
