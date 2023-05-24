import React from "react";
import {Button, Form, Input, Space} from "antd";
import styles from './connect-form.module.css';
import PeerService from "../../../services/peer.service.ts";

export default function ConnectForm() {
  const [form] = Form.useForm();
  const onFinish = (values: any) => {
    PeerService.connect(values.peerId)
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
              placeholder={'Other peer username...'}
            />
          </Form.Item>
          <Form.Item>
            <Button block type={'primary'} htmlType={'submit'}>
              Connect
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  )
}
