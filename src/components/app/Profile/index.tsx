import React, {useState} from "react";
import {Alert, Button, Card, Divider, List, Modal, Tag, Typography} from "antd";
import styles from "./profile.module.css";
import {useAppSelector} from "../../../redux/store.ts";
import {LogoutOutlined} from "@ant-design/icons";
import ConnectForm from "../ConnectForm";

export default function ProfileCard() {
  const {profile, peers} = useAppSelector(state => state.app);
  const [peersModal, setPeersModal] = useState(false);
  return (
    <Card className={styles.profileOuter}>
      <div className={styles.nameRow}>
        <div className={styles.avatar}>
          {profile?.icon}
        </div>
        <div className={styles.userMetaInfo}>
          <Typography.Text className={styles.name}>
            {profile?.name}
          </Typography.Text>
          <Tag
            className={styles.username}
            onClick={() => {

            }}
          >
            {profile?.username}
          </Tag>
        </div>
        <div>
          <Button shape={'circle'}>
            <LogoutOutlined />
          </Button>
        </div>
      </div>
      <Divider/>
      <ConnectForm/>
      <Alert
        message={`${peers.length} peers connected`}
        action={
          <Button size="small" type="text" onClick={() => setPeersModal(true)}>
            See all
          </Button>
        }
      />
      <Modal
        open={peersModal}
        title={'Connected Peers'}
        onCancel={() => setPeersModal(false)}
      >
        <List
          dataSource={peers}
          renderItem={item => {
            return (
              <List.Item key={item.connectionId} className={styles.nameRow}>
                <div className={styles.avatar}>
                  {item?.icon}
                </div>
                <div className={styles.userMetaInfo}>
                  <Typography.Text className={styles.name}>
                    {item?.name}
                  </Typography.Text>
                  <Tag>
                    {item?.username}
                  </Tag>
                </div>
              </List.Item>
            )
          }}
        />
      </Modal>
    </Card>
  )
}
