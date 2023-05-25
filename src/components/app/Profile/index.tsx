import React, {useState} from "react";
import {Alert, Button, Card, Divider, List, Modal, Tag, Tooltip, Typography} from "antd";
import styles from "./profile.module.css";
import {useAppDispatch, useAppSelector} from "../../../redux/store.ts";
import {LogoutOutlined} from "@ant-design/icons";
import ConnectForm from "../ConnectForm";
import {signOutProfile} from "../../../redux/slices/app.slice.ts";
import PeerService from "../../../services/peer.service.ts";

export default function ProfileCard() {
  const {profile, peers} = useAppSelector(state => state.app);
  const [peersModal, setPeersModal] = useState(false);
  const dispatch = useAppDispatch();
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
          <Tooltip
            trigger={'click'}
            title={'Copied!'}
          >
            <Tag
              style={{cursor: 'pointer'}}
              className={styles.username}
              onClick={() => {
                navigator.clipboard.writeText(profile?.username as string).then(() => null);
              }}
            >
              {profile?.username}
            </Tag>
          </Tooltip>
        </div>
        <div>
          <Button shape={'circle'} onClick={() => {
            PeerService.disconnect();
            dispatch(signOutProfile());
          }}>
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
