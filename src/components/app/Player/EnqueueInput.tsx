import React, {useState} from "react";
import {Button, Input} from "antd";
import styles from "./player.module.css";
import {useAppDispatch} from "../../../redux/store.ts";
import {enqueueTrack} from "../../../redux/actions/player.actions.ts";

export default function EnqueueInput() {
  const [url, setUrl] = useState('');
  const dispatch = useAppDispatch();

  const submit = () => {
    if (url.trim() === '') return;
    dispatch(enqueueTrack(url));
    setUrl('')
  }

  return <div className={styles.enqueueInputOuter}>
    <Input
      value={url}
      onChange={e => setUrl(e.target.value)}
      placeholder={'YouTube URL...'}
      onPressEnter={submit}
    />
    <Button onClick={submit}>
      Add
    </Button>
  </div>
}
