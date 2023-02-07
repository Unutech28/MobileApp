import AsyncStorage from "@react-native-async-storage/async-storage";
import array from "./array";
import thunk from "redux-thunk";
import promise from "./promise";
import * as reducers from "../reducers";
import whitelist from "./whitelist";
import { logger } from "redux-logger";
import { applyMiddleware, createStore, combineReducers, compose } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import { auth, dashboard, welcome } from "../config/";
import react, { useEffect, useState } from "react";
import Jailbreak from "react-native-jailbreak";
import AlertModal from "../components/common/AlertModal";
import { Alert, Platform } from "react-native";
import RNExitApp from "react-native-exit-app";
import GLOBALS from "@constants";
const { ACTION_TYPE } = GLOBALS;
import { strings } from "@localization";
import { alertWithOneBtn } from "@helpers/common";
//import { addListeners } from "@helpers/appListeners";
export const storeObj = {};
import Orientation from "react-native-orientation-locker";
import { InitiateNotification, checkPushPermission } from "@utils/Notification";
import * as Sentry from "@sentry/react-native";

const setup = () => {
  const { STRINGS } = GLOBALS;
  Sentry.init({
    dsn: "https://a0ecfda41b134b34aa7ac11d20de294b@o4503992809160704.ingest.sentry.io/4504365701857280",
    // dsn: "https://ad6b26055ff4422f93401b929b871bcf@o4504365735411712.ingest.sentry.io/4504365738950656",
    // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
    // We recommend adjusting this value in production.
    tracesSampleRate: 1.0,
  });
  InitiateNotification()
  Orientation.lockToPortrait();
  const isDev = global.isDebuggingInChrome || __DEV__;
  const middleware = [applyMiddleware(...[thunk, promise, array])];
  if (isDev) {
    middleware.push(applyMiddleware(logger));
  }
  const reducer = combineReducers(reducers);
  if (global.isDebuggingInChrome) {
    window.store = store;
  }

  const persistConfig = {
    key: "primary",
    storage: AsyncStorage,
    whitelist,
    // whitelist: ["authReducer", "dashboardReducer", "programReducer"],
    keyPrefix: "",
    timeout: null,
  };
  const persistedReducer = persistReducer(persistConfig, reducer);
  const store = createStore(persistedReducer, {}, compose(...middleware));
  // const alertModal = store.getState().dashboardReducer.isPopupShow
  persistStore(store, null, async () => {
    const result = await Jailbreak.check();
    if (result) {
      setTimeout(() => {
        alertWithOneBtn(
          strings.validation.SECURITY_ALERT,
          Platform.OS == "ios"
            ? strings.validation.SECURITY_ALERT_TEXT
            : strings.validation.SECURITY_ALERT_TEXT_ANDROID,
          GLOBALS.STRINGS.LOGOUT_OK
        ).then((res) => {
          // RNExitApp.exitApp();
        });
      }, 500);
    }
    store.dispatch({ type: ACTION_TYPE.API_SUCCESS });
    strings.setLanguage(store.getState().authReducer.language);
    if (store.getState().authReducer.currentScreen == 2) {
      // dashboard();
      store.dispatch(dashboard());
      //   auth();
    } else {
      // store.dispatch(auth());
      auth();
    }

    // if (store.getState().authReducer.currentScreen == 2) {
    //   dashboard();
    // } else if (store.getState().authReducer.currentScreen == 1) {
    //   welcome();
    // } else {
    //   auth();
    // }
  });
  storeObj.store = store;
  return store;
};
export default setup
// export default Sentry.wrap(setup);
