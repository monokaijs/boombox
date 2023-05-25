import React from "react";
import {Card, Empty} from "antd";
import styles from './player.module.css';
import QueueCard from "./QueueCard.tsx";
import {useAppSelector} from "../../../redux/store.ts";

export default function PlayerCard() {
  const {queue} = useAppSelector(state => state.player);
  return (
    <div className={styles.card}>
      <div className={styles.playerWrapper}>
        {queue.length === 0 ? <Empty/> :
          <iframe
            width="100%" height="400" src={"https://www.youtube.com/embed/" + queue[0].id} title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className={styles.player}
          />
        }
      </div>
      <QueueCard/>
    </div>
  )
}
