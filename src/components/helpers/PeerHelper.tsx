import React, {useEffect} from "react";
import {store, useAppDispatch, useAppSelector} from "../../redux/store.ts";
import PeerService from "../../services/peer.service.ts";
import {addPeer, Profile, removePeer, updatePeerProfile} from "../../redux/slices/app.slice.ts";

export default function PeerHelper() {
  const {profile, peers} = useAppSelector(state => state.app);
  const dispatch = useAppDispatch();

  useEffect(() => {
    PeerService.disconnect();
    if (profile && profile.username) {
      PeerService.initialize(profile.username);
      PeerService.onConnection.addListener(conn => {
        console.log('conn', conn);
        dispatch(addPeer(conn.connectionId));
        conn.send(encodeURIComponent(JSON.stringify({
          action: 'profile',
          data: profile
        })));
        conn.send(encodeURIComponent(JSON.stringify({
          action: 'peers',
          data: store.getState().app.peers
        })));
      });
      PeerService.onData.addListener((data, conn) => {
        const parsedData = JSON.parse(decodeURIComponent(data));
        console.log('data', parsedData);
        switch (parsedData.action) {
          case 'profile':
            dispatch(updatePeerProfile({
              profile: parsedData.data,
              connectionId: conn.connectionId
            }));
            break;
          case 'peers':
            const connectedPeers = store.getState().app.peers || [];
            const peersList = parsedData.data;
            peersList.forEach((peer: Profile) => {
              if (!peer || !peer.username) return;
              if (!connectedPeers.find((p: Profile) => p.username === peer.username)) {
                PeerService.connect(peer.username);
              }
            });
            break;
        }
      });
      PeerService.onClose.addListener(conn => {
        dispatch(removePeer(conn.connectionId))
      });
    }
    return () => {
      PeerService.disconnect();
    }
  }, [profile?.username]);

  useEffect(() => {
    if (peers.length !== 0) console.log('peers', peers);
  }, [peers]);

  return <></>
}
