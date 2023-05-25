import React, {useEffect, useRef, useState} from "react";
import {Card, Empty} from "antd";
import styles from './player.module.css';
import QueueCard from "./QueueCard.tsx";
import {store, useAppDispatch, useAppSelector} from "../../../redux/store.ts";
import YouTube, {YouTubePlayer} from 'react-youtube';
import {moveToNextTrack, syncPlayer} from "../../../redux/slices/player.slice.ts";
import PeerService from "../../../services/peer.service.ts";

export default function PlayerCard() {
  const {queue, currentTrack, currentTrackTime, state} = useAppSelector(state => state.player);
  const {peers} = useAppSelector(state => state.app);
  const player = useRef<YouTubePlayer>(null);
  const [lastInteract, setLastInteract] = useState(new Date().getTime());
  const [playerReady, setPlayerReady] = useState(false);
  const [ready, setReady] = useState(false);

  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log('new state', state);
    if (state === YouTube.PlayerState.PLAYING) {
      player.current?.internalPlayer.playVideo();
    } else if (state === YouTube.PlayerState.PAUSED) {
      player.current?.internalPlayer.pauseVideo();
    }
  }, [state]);

  useEffect(() => {
    if (peers.length === 0) setReady(true);
  }, [peers]);

  useEffect(() => {
    PeerService.onData.addListener(async (data, conn) => {
      const parsedData = JSON.parse(decodeURIComponent(data));
      if (parsedData.action === 'sync-player' && parsedData.data.timestamp > lastInteract && ready) {
        setReady(true);
        const trackTime = await player.current?.internalPlayer.getCurrentTime();
        const timeDiff = Math.abs(parsedData.data.currentTrackTime as number - trackTime);
        if (timeDiff > 5) {
          player.current?.internalPlayer.seekTo(parsedData.data.currentTrackTime);
        }
      }
    });
  }, []);

  useEffect(() => {
    player.current?.internalPlayer.seekTo(currentTrackTime || 0);
  }, [playerReady]);

  return (
    <div className={styles.card}>
      <div className={styles.playerWrapper}>
        {queue.length === 0 ? <Empty/> :
          <YouTube
            ref={player}
            videoId={currentTrack}
            opts={{
              height: '400',
              width: '100%',
              playerVars: {
                autoplay: 1,
              },
            }}
            onReady={(event) => {
              console.log('on-ready', event);
              setPlayerReady(true);
            }}
            onPlay={event => {
              console.log('on-play', event);
              setLastInteract(new Date().getTime())
            }}
            onStateChange={async event => {
              const state = event.data;

              if (state === YouTube.PlayerState.PLAYING || state === YouTube.PlayerState.PAUSED) {
                const timestamp = new Date().getTime();
                if (timestamp - lastInteract < 500) return;
                const trackTime = await event.target.getCurrentTime();
                // send to other clients
                PeerService.sendAll(encodeURIComponent(JSON.stringify({
                  action: 'sync-player',
                  data: {
                    currentTrack,
                    currentTrackTime: trackTime,
                    state,
                    timestamp,
                  },
                })));
                console.log('send-sync');
                setLastInteract(timestamp);
              }
            }}
            onEnd={(event) => {
              dispatch(moveToNextTrack())
            }}
          />
        }
      </div>
      <QueueCard/>
    </div>
  )
}
