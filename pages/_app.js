import "../styles/globals.css";
import Head from "next/head";

import { Provider } from "react-redux";
import { persistStore, persistReducer } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import storage from "redux-persist/lib/storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import users from "../reducers/user";
import hashtags from "../reducers/hashtags";

const reducers = combineReducers({ users, hashtags });
const persistConfig = { key: "hackaTweet", storage };

const store = configureStore({
  reducer: persistReducer(persistConfig, reducers),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

const persistor = persistStore(store);

function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Head>
          <title>HackaTweet</title>
        </Head>
        <Component {...pageProps} />
      </PersistGate>
    </Provider>
  );
}

export default App;
