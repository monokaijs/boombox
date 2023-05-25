import './App.css'
import React from "react";
import {Card, ConfigProvider, Space, theme} from "antd";
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
        <div style={{flex: 1}}>
          <PlayerCard/>
        </div>
        <Space direction={'vertical'}>
          <ProfileCard/>
          <ChatBox/>
        </Space>
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
