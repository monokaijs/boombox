import React from "react";
import {Button, Card, Input, List, Tag} from "antd";
import styles from "./player.module.css";
import {DeleteOutlined, PlayCircleOutlined} from "@ant-design/icons";
import EnqueueInput from "./EnqueueInput.tsx";
import {useAppSelector} from "../../../redux/store.ts";
import moment from "moment";

export default function QueueCard() {
  const {queue} = useAppSelector(state => state.player);
  return <Card
    className={styles.queueCard}
    title={'Queue'}
    bodyStyle={{padding: 0}}
    extra={<>
      <EnqueueInput/>
    </>}
  >
    <List
      dataSource={queue}
      renderItem={item => (
        <List.Item className={styles.queueItem}>
          <img
            src={item.picture}
            className={styles.queueItemPicture}
          />
          <div className={styles.queueItemName}>
            <div>
              {item.title}
            </div>
            <Tag>
              {moment.utc(item.duration * 1000).format(
                item.duration > 3600 ? 'HH:mm:ss' : 'mm:ss'
              )}
            </Tag>
          </div>
          <div className={styles.controls}>
            <Button shape={'circle'} type={'text'} danger>
              <DeleteOutlined/>
            </Button>
            <Button shape={'circle'} type={'text'}>
              <PlayCircleOutlined/>
            </Button>
          </div>
        </List.Item>
      )}
    />
  </Card>
}
