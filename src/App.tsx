import './App.css'
import React, {useEffect, useState} from "react";
import {Button, Card, ConfigProvider, Input, Layout, Space, theme, Typography} from "antd";
import AppLayout from "./components/layout/AppLayout.tsx";
import PeerService from "./services/peer.service.ts";
import {Provider} from "react-redux";
import {store, useAppDispatch, useAppSelector} from "./redux/store.ts";
import CreateUserModal from "./components/modals/CreateUser";
import ProfileCard from "./components/app/Profile";
import {addPeer, Profile, removePeer, updatePeerProfile} from "./redux/slices/app.slice.ts";
import PeerHelper from "./components/helpers/PeerHelper.tsx";

function AppContent() {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm
      }}
    >
      <PeerHelper/>
      <AppLayout>
        <ProfileCard/>
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
