import React, {useState} from "react";
import {Button, Form, Input, message, Space} from "antd";
import styles from './connect-form.module.css';
import PeerService from "../../../services/peer.service.ts";
import {useAppSelector} from "../../../redux/store.ts";

export default function ConnectForm() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const {peers} = useAppSelector(state => state.app);
  const onFinish = (values: any) => {
    setLoading(true);
    if (peers.find(x => x.username === values.peerId)) {
      setLoading(false);
      return message.error('Already connected to this peer');
    }
    PeerService.connect(values.peerId).then(() => {
      setLoading(false);
    }).catch(e => {
      message.error("Failed to connect.");
      setLoading(false);
    });
  }
  return (
    <div>
      <Form
        form={form}
        onFinish={onFinish}
      >
        <div className={styles.connectRow}>
          <Form.Item
            className={styles.inputWrapper}
            name={'peerId'}
          >
            <Input
              disabled={loading}
              placeholder={'Other peer username...'}
            />
          </Form.Item>
          <Form.Item>
            <Button block type={'primary'} htmlType={'submit'} loading={loading}>
              Connect
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  )
}
