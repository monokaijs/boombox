import React, {useState} from "react";
import {Button, Form, Input, Modal} from "antd";
import {useAppDispatch, useAppSelector} from "../../../redux/store.ts";
import styles from "./create-user.module.css";
import EmojiPicker from "emoji-picker-react";
import {setAppProfile} from "../../../redux/actions/app.actions.ts";

export default function CreateUserModal() {
  const {profile} = useAppSelector(state => state.app);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState('😊');
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();

  const onFinish = (values: any) => {
    dispatch(setAppProfile({
      ...values,
      icon: selectedEmoji
    }));
  }

  return <Modal
    title={'Join Boombox'}
    open={!profile}
    footer={null}
  >
    <Form
      layout={'vertical'}
      form={form}
      onFinish={onFinish}
    >
      <div className={styles.withAvatarRow}>
        <a className={styles.avatarPicker} onClick={e => {
          e.preventDefault();
          setShowEmojiPicker(!showEmojiPicker);
        }}>
          {selectedEmoji}
        </a>
        <Form.Item
          name={'name'}
          label={'Your name'}
          className={styles.userInputWrapper}
        >
          <Input placeholder={'John Doe'}/>
        </Form.Item>
      </div>
      {showEmojiPicker && (
        <EmojiPicker
          theme={'dark' as any}
          width={'100%'}
          onEmojiClick={(emoji) => {
            setSelectedEmoji(emoji.emoji);
            setShowEmojiPicker(false);
          }}
        />
      )}
      <Form.Item style={{marginBottom: 8, marginTop: 8, display: 'flex', justifyContent: 'flex-end'}}>
        <Button type={'primary'} htmlType={'submit'}>
          Finish
        </Button>
      </Form.Item>
    </Form>
  </Modal>
}
