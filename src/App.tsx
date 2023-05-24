import './App.css'
import React, {useEffect, useState} from "react";
import {Button, Card, ConfigProvider, Input, Layout, Space, theme, Typography} from "antd";
import AppLayout from "./components/layout/AppLayout.tsx";
import PeerService from "./services/peer.service.ts";
import {Provider} from "react-redux";
import {store, useAppSelector} from "./redux/store.ts";
import CreateUserModal from "./components/modals/CreateUser";
import Profile from "./components/app/Profile";

function AppContent() {
  const {profile} = useAppSelector(state => state.app);
  useEffect(() => {
    PeerService.disconnect();
    if (profile && profile.username) {
      PeerService.initialize(profile.username);
    }
  }, [profile?.username]);
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm
      }}
    >
      <AppLayout>
        <Profile/>
      </AppLayout>
      <CreateUserModal/>
    </ConfigProvider>
  );
}

function App() {
  // const [id, setId] = useState('');
  // const [inputId, setInputId] = useState('');
  // useEffect(() => {
  //   PeerService.initialize();
  //   PeerService.onConnection.addListener((conn) => {
  //     console.log('connection established');
  //   });
  //   setId(PeerService.id);
  // }, []);

  return (
    <Provider store={store}>
      <AppContent/>
    </Provider>
  )
}

export default App
