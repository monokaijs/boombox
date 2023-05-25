import {combineReducers, configureStore} from '@reduxjs/toolkit';
import {persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER} from 'redux-persist';
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import storage from 'redux-persist/lib/storage'
import {appSlice, AppState} from "./slices/app.slice.ts";
import {playerSlice, PlayerState} from "./slices/player.slice.ts";
import {chatSlice, ChatState} from "./slices/chat.slice.ts";

const rootPersistConfig = {
  key: 'root',
  storage,
  blacklist: ['app', 'player', 'chat'],
  stateReconciler: autoMergeLevel2,
};
const appPersistConfig = {
  key: 'app',
  storage,
  blacklist: ['appLoading', 'peers'],
  stateReconciler: autoMergeLevel2,
};

const persistedReducer = persistReducer<any>(rootPersistConfig, combineReducers({
  app: persistReducer<any>(appPersistConfig, appSlice.reducer),
  player: playerSlice.reducer,
  chat: chatSlice.reducer,
}));


export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
});

export type RootState = {
  app: AppState,
  player: PlayerState,
  chat: ChatState,
};
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const persistor = persistStore(store);
