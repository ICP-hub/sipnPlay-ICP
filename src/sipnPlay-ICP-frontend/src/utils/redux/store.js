import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // default: localStorage
import userReducer from './userSlice';

const persistConfig = {
  key: 'root',
  storage,
};

// const rootReducer = combineReducers({
//   user: userReducer,
// })
const persistedReducer = persistReducer(persistConfig, userReducer);


export var store = configureStore({
  reducer: {
    user: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/FLUSH', 'persist/PAUSE', 'persist/REGISTER'],
        ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
        ignoredPaths: ['user'],
      },
    }),
});

export const persistor = persistStore(store);

window.store = store;
