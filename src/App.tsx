import './App.css'
import React from "react";
import {Card, Col, ConfigProvider, Row, Space, theme} from "antd";
import AppLayout from "./components/layout/AppLayout.tsx";
import {Provider} from "react-redux";
import {store, useAppSelector} from "./redux/store.ts";
import CreateUserModal from "./components/modals/CreateUser";
import ProfileCard from "./components/app/Profile";
import PeerHelper from "./components/helpers/PeerHelper.tsx";
import ChatBox from "./components/app/Chatbox";
import PlayerCard from "./components/app/Player";

function AppContent() {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm
      }}
    >
      <PeerHelper/>
      <AppLayout>
        <Row gutter={8}>
          <Col xs={24} sm={24} md={16}>
            <PlayerCard/>
          </Col>
          <Col xs={24} sm={24} md={8}>
            <Space direction={'vertical'} style={{width: '100%'}}>
              <ProfileCard/>
              <ChatBox/>
            </Space>
          </Col>
        </Row>
      </AppLayout>
      <CreateUserModal/>
    </ConfigProvider>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent/>
    </Provider>
  )
}

export default App
