import React, {useState} from "react";
import {Button, Input, message} from "antd";
import styles from "./player.module.css";
import {useAppDispatch, useAppSelector} from "../../../redux/store.ts";
import {enqueueTrack, prepareTrack} from "../../../redux/actions/player.actions.ts";
import peerService from "../../../services/peer.service.ts";

export default function EnqueueInput() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const {profile} = useAppSelector(state => state.app);
  const {queue} = useAppSelector(state => state.player);

  const submit = async () => {
    if (url.trim() === '' || loading) return;
    setLoading(true);
    try {
      const track = await prepareTrack(url);
      if (queue.find(t => t.id === track.id)) {
        throw new Error("Track already in queue");
      }
      peerService.sendAll(encodeURIComponent(JSON.stringify({
        action: 'enqueue',
        data: {
          ...track,
          source: profile?.username
        },
      })));
      dispatch(enqueueTrack(track));
      setUrl('');
    } catch (e: any) {
      message.error(e.message || 'Failed to enqueue video');
    }
    setLoading(false);
  }

  return <div className={styles.enqueueInputOuter}>
    <Input
      value={url}
      disabled={loading}
      onChange={e => setUrl(e.target.value)}
      placeholder={'YouTube URL...'}
      onPressEnter={submit}
    />
    <Button onClick={submit} loading={loading}>
      Add
    </Button>
  </div>
}
