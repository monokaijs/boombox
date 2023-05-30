import React, {useEffect, useRef, useState} from "react";
import {
  Alert,
  Avatar,
  Button,
  Card,
  Form,
  Input,
  List,
  message,
  Select,
  Slider,
  Space,
  Tabs,
  Tooltip,
  Typography
} from "antd";
import {Comment} from '@ant-design/compatible'
import styles from './chat-box.module.css';
import {AudioMutedOutlined, AudioOutlined, SendOutlined, SoundOutlined} from "@ant-design/icons";
import {useAppDispatch, useAppSelector} from "../../../redux/store.ts";
import moment from "moment"
import PeerService from "../../../services/peer.service.ts";
import {addMessage, ChatMessage} from "../../../redux/slices/chat.slice.ts";
import {Profile} from "../../../redux/slices/app.slice.ts";
import {requestVoicePermission, switchInputDevice, toggleMutePeer} from "../../../redux/actions/voice.actions.ts";

export default function ChatBox() {
  const {peers, profile, voicePermitted, inputDeviceId} = useAppSelector(state => state.app);
  const {messages} = useAppSelector(state => state.chat);
  const [msg, setMsg] = useState('');
  const [inputDevices, setInputDevices] = useState<MediaDeviceInfo[]>([]);
  const dispatch = useAppDispatch();
  const bottomRef = useRef<any>(null);

  const submitMessage = () => {
    if (msg.trim() === '') return;
    const msgObject: ChatMessage = {
      author: profile as Profile,
      text: msg,
      time: new Date().getTime(),
    };
    dispatch(addMessage(msgObject));
    PeerService.sendAll(encodeURIComponent(JSON.stringify({
      action: 'message',
      data: msgObject,
    })));
    setMsg('');
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({behavior: 'smooth'});
  }, [messages]);

  const requestMicrophoneAccess = () => {
    dispatch(requestVoicePermission());
  }

  const switchDevice = (deviceId: string) => {
    dispatch(switchInputDevice(deviceId));
  }

  useEffect(() => {
    if (voicePermitted && navigator.mediaDevices) {
      // Enumerate the available devices
      navigator.mediaDevices.enumerateDevices()
        .then(function(devices) {
          // Filter the devices to only those that are audio input devices
          const audioInputDevices = devices.filter(device => device.kind === 'audioinput');
          // Log the list of audio input devices
          setInputDevices(audioInputDevices);
          if (audioInputDevices.length !== 0) {
            switchDevice(audioInputDevices[0].deviceId);
            const myProfile = {
              ...profile,
              hasVoice: true,
            }
            PeerService.sendAllEncoded({
              action: 'profile',
              data: myProfile,
            });
          }
        })
        .catch(function(err) {
          // Handle any errors that occur
          return message.error('Error enumerating devices.');
        });
    } else {
      return message.error('Media devices not supported.');
    }

  }, [voicePermitted]);

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
                    {item.hasVoice && (
                      <Button shape={'circle'} type={'text'} danger={item.muted}
                              onClick={() => dispatch(toggleMutePeer(item.connectionId))}>
                        {item.muted ?
                          <AudioMutedOutlined/>
                          : <AudioOutlined/>
                        }
                      </Button>
                    )}
                  </div>
                )}
              />
            </div>
            <div className={styles.commentAction}>
              <Select
                value={inputDeviceId}
                style={{width: 200}} onChange={(value) => switchDevice(value)}
              >
                {inputDevices.map(device => (
                  <Select.Option key={device.deviceId} value={device.deviceId}>
                    {device.label}
                  </Select.Option>
                ))}
              </Select>
              <div style={{display: 'flex', flexDirection: 'row'}}>
                <Button type={'text'} shape={'circle'} size={'large'}>
                  <SoundOutlined/>
                </Button>
                <Button type={'text'} shape={'circle'} size={'large'}>
                  <AudioOutlined/>
                </Button>
              </div>
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
                value={msg}
                onChange={e => setMsg(e.target.value)}
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
