import React, {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../redux/store.ts";
import {callPeer} from "../../redux/actions/voice.actions.ts";
import PeerService from "../../services/peer.service.ts";

export default function VoiceHelper() {
  const {peers, voicePermitted, inputDeviceId} = useAppSelector(state => state.app);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (voicePermitted) {
      for (let peer of peers) {
        console.log(peer);
        if (!peer.voiceConnected && peer.username) {
          // connect to peer now
          dispatch(callPeer(peer.username as string));
        }
      }
    }
  }, [voicePermitted, peers]);

  useEffect(() => {
    PeerService.onCall.addListener(async call => {
      console.log('call.peer', call.peer);
      const stream = await navigator.mediaDevices.getUserMedia({audio: {deviceId: inputDeviceId}});
      call.answer(stream);

      call.on('stream', (stream) => {
        let audio = document.createElement('audio');
        audio.id = 'call-' + call.peer;
        audio.autoplay = true;
        audio.srcObject = stream;
        document.body.appendChild(audio);
      });
    });
  }, []);

  return <></>
}
