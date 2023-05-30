import {createAsyncThunk} from "@reduxjs/toolkit";
import PeerService from "../../services/peer.service.ts";
import {RootState} from "../store.ts";
import {Profile} from "../slices/app.slice.ts";

export const toggleMutePeer = createAsyncThunk('app/mute-peer', (peer: Profile, thunkAPI) => {
  const state = thunkAPI.getState() as RootState;
  const audio = document.body.querySelector('#call-' + peer.username) as HTMLAudioElement;
  audio.muted = !state.app.peers.find(x => x.connectionId == peer.connectionId)?.muted;
  return peer.connectionId;
});

export const requestVoicePermission = createAsyncThunk('app/request-voice', () => {
  return new Promise((resolve, reject) => {
    // @ts-ignore
    navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

    // @ts-ignore
    navigator.getUserMedia({video: false, audio: true}, function success(localAudioStream) {
      resolve(localAudioStream);
    }, function error(err: any) {
      // handle error
      reject();
    });
  })
});

export const switchInputDevice = createAsyncThunk('app/switch-voice-input', async (deviceId: string, thunkAPI) => {
  const localStream = await navigator.mediaDevices.getUserMedia({audio: true, video: false});
  const state = thunkAPI.getState() as RootState;
  if (navigator.mediaDevices) {
    // Enumerate the available devices
    const stream = await navigator.mediaDevices.getUserMedia({audio: {deviceId: deviceId}});
    // Get the audio track from the new stream
    const newAudioTrack = stream.getAudioTracks()[0];
    // Get the existing audio track from the local stream
    const existingAudioTrack = localStream.getAudioTracks()[0];
    // Replace the existing audio track with the new audio track
    localStream.removeTrack(existingAudioTrack);
    localStream.addTrack(newAudioTrack);
    // Get the updated local stream with the new audio track
    const updatedLocalStream = localStream.clone();
    // Update the call with the updated local stream
    for (let peer of state.app.peers) {
      peer.voiceConnection?.peerConnection.getSenders().forEach(function(sender) {
        if (sender.track?.kind === 'audio') {
          sender.replaceTrack(newAudioTrack);
        }
      });
    }

  } else {
    return Promise.reject('Media devices not supported.');
  }
  return deviceId;
});

export const callPeer = createAsyncThunk('app/connect-peer', async (peerId: string, thunkAPI) => {
  const state = thunkAPI.getState() as RootState;
  const stream = await navigator.mediaDevices.getUserMedia({audio: {deviceId: state.app.inputDeviceId}});
  console.log('calling peer', peerId);
  return {
    connection: PeerService.client.call(peerId, stream),
    peerId,
  }
});
