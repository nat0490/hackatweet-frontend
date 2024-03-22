import React from 'react';
import "../styles/globals.css";
import Head from "next/head";

import { Provider } from "react-redux";
import { persistStore, persistReducer } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import storage from "redux-persist/lib/storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
//import { hashtags, users, theme, likes } from '../reducers';
import users from "../reducers/user";
import hashtags from "../reducers/hashtags";
import theme from "../reducers/theme";
import likes from "../reducers/likes";
import showComment from '../reducers/showComment';
import notifications from '../reducers/notifications';

const reducers = combineReducers({ users, hashtags, theme, likes, showComment, notifications });
const persistConfig = { 
  key: "filters", 
  storage,
  blacklist: ["showComment"],
};

const store = configureStore({
  reducer: persistReducer(persistConfig, reducers),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ 
      serializableCheck: false 
    }),
});

const persistor = persistStore(store);

function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Head>
          <title>Flowst</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <Component {...pageProps} />
      </PersistGate>
    </Provider>
  );
}

export default App;
