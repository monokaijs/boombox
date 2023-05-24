import React, {useState} from "react";
import {Avatar, Button, Card, Form, Input, Space, Tooltip} from "antd";
import {Comment} from '@ant-design/compatible'
import styles from './chat-box.module.css';
import {SendOutlined} from "@ant-design/icons";

export default function ChatBox() {
  const [message, setMessage] = useState('');

  const submitMessage = () => {

  };

  return (
    <Card
      style={{width: 360}}
      bodyStyle={{height: 500, padding: 0, display: 'flex', flexDirection: 'column'}}
      title={'Live chat'}
    >
      <div className={styles.commentsList}>
        <Comment
          author={<a>Han Solo</a>}
          avatar={<Avatar src="https://joeschmoe.io/api/v1/random" alt="Han Solo"/>}
          content={
            <p>
              We supply a series of design principles, practical patterns and high quality design
              resources (Sketch and Axure), to help people create their product prototypes beautifully
              and efficiently.
            </p>
          }
          datetime={
            <Tooltip title="2016-11-22 11:22:33">
              <span>8 hours ago</span>
            </Tooltip>
          }
        />
      </div>
      <div className={styles.commentAction}>
        <Input
          value={message}
          onChange={e => setMessage(e.target.value)}
          className={styles.commentInput}
          placeholder={'Leave message...'}
        />
        <Button shape={'circle'} onClick={submitMessage}>
          <SendOutlined/>
        </Button>
      </div>
    </Card>
  )
}
