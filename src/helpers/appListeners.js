import { AppState } from 'react-native';
/**Funcation to handle app state event */
const _handleAppStateChange = (nextAppState) => {

};
export const addListeners = () => {
  AppState.addEventListener('change', _handleAppStateChange);
};

