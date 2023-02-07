import React from 'react';
import { StatusBar } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { registerScreens } from './src/config/routes';
import { Provider } from 'react-redux';
import SplashScreen from 'react-native-splash-screen';
import Events from './src/helpers/registerEvents';
import setup, { storeObj } from './src/store/setup';
import { setJSExceptionHandler } from 'react-native-exception-handler';
import GLOBALS from './src/constants';
const { ACTION_TYPE, COLOR } = GLOBALS;
console.disableYellowBox = true;

/**show error alert when an exception occurs */
const handleError = (error, isFatal) => {
  console.log(error, isFatal);
  if (isFatal) {
    if (storeObj && Object.keys(storeObj).length != 0) {
      let { dispatch, getState } = storeObj.store;
      dispatch({ type: ACTION_TYPE.API_SUCCESS });
    }
    // alert(error);
  } else {
    if (storeObj && Object.keys(storeObj).length != 0) {
      let { dispatch, getState } = storeObj.store;
      dispatch({ type: ACTION_TYPE.API_SUCCESS });
    }
  }
};

/**Function TO CATCH GLOBAL exceptions */
setJSExceptionHandler((error, isFatal) => {
  console.log('caught global error', storeObj, isFatal);
  handleError(error, isFatal);
}, true);

Navigation.events().registerAppLaunchedListener(() => {
  <StatusBar backgroundColor={COLOR.WHITE} barStyle="dark-content" />;
  const store = setup();
  SplashScreen.hide();
  Events.RegisterComponentDidAppearListener(store);
  registerScreens(storeObj.store, Provider);
  Navigation.setRoot({
    root: {
      stack: {
        children: [
          {
            component: {
              name: 'Loader',
            },
          },
        ],
      },
    },
  });
});
