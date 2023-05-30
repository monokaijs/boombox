import {createAsyncThunk} from "@reduxjs/toolkit";

export const toggleMutePeer = createAsyncThunk('app/mute-peer', (connectionId: string) => {
  return connectionId;
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

export const switchInputDevice = createAsyncThunk('app/switch-voice-input', (deviceId: string) => {

  return deviceId;
});
