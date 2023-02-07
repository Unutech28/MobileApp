import GLOBALS from "@constants";
import RestClient from "@helpers/RestClient";
import { Alert } from "react-native";
import * as AppActions from "@actions";
const { ACTION_TYPE, URL, STRINGS, NETWORK_STATUS } = GLOBALS;
const { SUCCESS, SESSION_ERROR } = NETWORK_STATUS

/**API to get reminders */
export function getReminders(user_id, date) {
  return async (dispatch) => {
    dispatch({ type: ACTION_TYPE.GET_REMINDER_REQUEST });
    try {
      let json = await RestClient.postCall(URL.GET_REMINDERS, {
        user_id: user_id,
        date: date,
      });
      if (json.code == SUCCESS) {
        dispatch({
          type: ACTION_TYPE.GET_REMINDER_SUCCESS,
          payload: json.data,
        });
      } else if (json.code == SESSION_ERROR) {
        Alert.alert(
          STRINGS.LOGOUT_TITLE,
          json.message,
          [
            {
              text: STRINGS.LOGOUT_OK,
              onPress: () => dispatch(AppActions.logout_session()),
            },
          ],
          { cancelable: false }
        );
      } else {
        dispatch({
          type: ACTION_TYPE.GET_REMINDER_FAIL,
          payload: json,
        });
      }
    } catch (error) {
      dispatch({
        type: ACTION_TYPE.GET_REMINDER_FAIL,
        payload: error,
      });
    }
  };
}
