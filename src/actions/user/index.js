import GLOBALS from "@constants";
const { ACTION_TYPE } = GLOBALS;

/**Action to set FCM token */
export const setFcmDeviceToken = token => {
  return {
    type: ACTION_TYPE.SET_FCM_DEVICE_TOKEN,
    payload: token,
  };
};