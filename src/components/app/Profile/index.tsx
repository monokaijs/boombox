import React from "react";
import {Button, Card, Divider, List, Tag, Typography} from "antd";
import styles from "./profile.module.css";
import {useAppSelector} from "../../../redux/store.ts";
import {LogoutOutlined} from "@ant-design/icons";
import ConnectForm from "../ConnectForm";

export default function ProfileCard() {
  const {profile, peers} = useAppSelector(state => state.app);
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
    </Card>
  )
}
