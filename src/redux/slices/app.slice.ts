import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {setAppProfile} from "../actions/app.actions.ts";
import {callPeer, requestVoicePermission, switchInputDevice, toggleMutePeer} from "../actions/voice.actions.ts";
import {MediaConnection} from "peerjs";

export interface Profile {
  status?: 'calling' | 'idle';
  name?: string;
  icon?: string;
  username?: string;
  connectionId: string;
  hasVoice?: string;
  voiceConnected?: boolean;
  voiceConnection?: MediaConnection;
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
    }).addCase(callPeer.pending, (state, action: any) => {
      console.log('call-peer', action);
      state.peers = state.peers.map(peer => {
        if (peer.username === action.meta.arg) {
          peer.voiceConnected = true;
        }
        return peer;
      });
    }).addCase(callPeer.fulfilled, (state, action) => {
      state.peers = state.peers.map(peer => {
        if (peer.username === action.payload.peerId) {
          peer.voiceConnection = action.payload.connection;
          peer.voiceConnected = true;
        }
        return peer;
      })
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
