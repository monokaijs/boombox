import './App.css'
import {useEffect, useState} from "react";
import {Button, Card, ConfigProvider, Input, Layout, Space, theme, Typography} from "antd";
import AppLayout from "./components/layout/AppLayout.tsx";
import PeerService from "./services/peer.service.ts";

function App() {
  const [id, setId] = useState('');
  const [inputId, setInputId] = useState('');
  useEffect(() => {
    PeerService.initialize();
    PeerService.onConnection.addListener((conn) => {
      console.log('connection established');
    });
    setId(PeerService.id);
  }, []);

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm
      }}
    >
      <AppLayout>
        <Card>
          <Typography.Title level={3}>
            Connect
          </Typography.Title>
          <Typography.Paragraph>
            Connect to other peers...
          </Typography.Paragraph>
          <Space direction={'vertical'} size={'middle'}>
            <Space>
              <Input
                value={inputId}
                onChange={e => setInputId(e.target.value)}
                placeholder={'Member ID'}
              />
              <Button type={'primary'} onClick={() => {
                PeerService.connect(inputId);
              }}>
                Connect
              </Button>
            </Space>
            <div>
              <Typography.Text>
                Your Peer ID is: {id}
              </Typography.Text>
            </div>
          </Space>
        </Card>
      </AppLayout>
    </ConfigProvider>
  )
}

export default App
