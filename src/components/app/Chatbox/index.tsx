import React, {useEffect, useRef, useState} from "react";
import {Alert, Avatar, Button, Card, Form, Input, List, Slider, Space, Tabs, Tooltip, Typography} from "antd";
import {Comment} from '@ant-design/compatible'
import styles from './chat-box.module.css';
import {AudioMutedOutlined, AudioOutlined, SendOutlined, SoundOutlined} from "@ant-design/icons";
import {useAppDispatch, useAppSelector} from "../../../redux/store.ts";
import moment from "moment"
import PeerService from "../../../services/peer.service.ts";
import {addMessage, ChatMessage} from "../../../redux/slices/chat.slice.ts";
import {Profile} from "../../../redux/slices/app.slice.ts";
import {toggleMutePeer} from "../../../redux/actions/voice.actions.ts";

export default function ChatBox() {
  const {peers, profile, voicePermitted} = useAppSelector(state => state.app);
  const {messages} = useAppSelector(state => state.chat);
  const [message, setMessage] = useState('');
  const dispatch = useAppDispatch();
  const bottomRef = useRef<any>(null);

  const submitMessage = () => {
    if (message.trim() === '') return;
    const msgObject: ChatMessage = {
      author: profile as Profile,
      text: message,
      time: new Date().getTime(),
    };
    dispatch(addMessage(msgObject));
    PeerService.sendAll(encodeURIComponent(JSON.stringify({
      action: 'message',
      data: msgObject,
    })));
    setMessage('');
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({behavior: 'smooth'});
  }, [messages]);

  const requestMicrophoneAccess = () => {
    // @ts-ignore
    navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

    // @ts-ignore
    navigator.getUserMedia({video: false, audio: true}, function success(localAudioStream) {
      // Do something with audio stream
    }, function error(err: any) {
      // handle error
    });
  }

  return (
    <Card
      className={'communication-card'}
      bodyStyle={{height: 554, padding: 0, display: 'flex', flexDirection: 'column'}}
    >
      <Tabs
        rootClassName={styles.tabsOuter}
        tabBarStyle={{padding: '0 16px'}}
        items={[{
          key: '0',
          label: 'Voice',
          children: <>
            <div
              className={styles.commentsList}
            >
              {!voicePermitted && (
                <Alert
                  type={'warning'}
                  message={'Voice is not permitted, you cannot talk until allow this website to access your microphone.'}
                  action={[
                    <Button onClick={requestMicrophoneAccess}>
                      Fix
                    </Button>
                  ]}
                />
              )}
              <List
                dataSource={peers}
                renderItem={item => (
                  <div className={styles.peerItem} key={item.connectionId}>
                    <Typography.Text>
                      {item.name}
                    </Typography.Text>
                    <Button shape={'circle'} type={'text'} danger={item.muted}
                            onClick={() => dispatch(toggleMutePeer(item.connectionId))}>
                      {item.muted ?
                        <AudioMutedOutlined/>
                        : <AudioOutlined/>
                      }
                    </Button>
                  </div>
                )}
              />
            </div>
            <div className={styles.commentAction}>
              <div style={{flex: 1}}>
                <Slider/>
              </div>
              <Button type={'text'} shape={'circle'} size={'large'}>
                <SoundOutlined/>
              </Button>
              <Button type={'text'} shape={'circle'} size={'large'}>
                <AudioOutlined/>
              </Button>
            </div>
          </>
        }, {
          key: '1',
          label: 'Chat',
          children: <>
            <div
              className={styles.commentsList}
            >
              <List
                dataSource={messages}
                renderItem={message => (
                  <Comment
                    author={<a>{message.author.name} ({message.author.username})</a>}
                    avatar={<Avatar icon={message.author.icon}/>}
                    content={
                      <p>
                        {message.text}
                      </p>
                    }
                    datetime={
                      <Tooltip title={moment(message.time).format()}>
                        <span>{moment(message.time).fromNow()}</span>
                      </Tooltip>
                    }
                  />
                )}
              />
              <div ref={bottomRef}/>
            </div>
            <div className={styles.commentAction}>
              <Input
                value={message}
                onChange={e => setMessage(e.target.value)}
                className={styles.commentInput}
                placeholder={'Leave message...'}
                onPressEnter={e => {
                  e.preventDefault();
                  submitMessage();
                }}
              />
              <Button shape={'circle'} onClick={submitMessage}>
                <SendOutlined/>
              </Button>
            </div>
          </>
        }]}
      />
    </Card>
  )
}
