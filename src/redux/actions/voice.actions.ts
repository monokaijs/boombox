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

export const switchInputDevice = createAsyncThunk('app/switch-voice-input', async (deviceId: string) => {
  if (navigator.mediaDevices) {
    // Enumerate the available devices
    const devices = await navigator.mediaDevices.enumerateDevices();
    const stream = await navigator.mediaDevices.getUserMedia({audio: {deviceId: deviceId}});
  } else {
    return Promise.reject('Media devices not supported.');
  }
  return deviceId;
});
