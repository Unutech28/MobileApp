import GLOBALS from "@constants";
import RestClient from "@helpers/RestClient";
import { Alert } from "react-native";
import * as AppActions from "@actions";
const { ACTION_TYPE, URL, STRINGS, NETWORK_STATUS } = GLOBALS;
const { SUCCESS, SESSION_ERROR } = NETWORK_STATUS

/**API to get video toekn */
export function getVideoToken(requestBody) {
  return async (dispatch) => {
    dispatch({ type: ACTION_TYPE.GET_VIDEO_TOKEN_REQUEST });
    try {
      let json = await RestClient.postCall(URL.GET_VIDEO_TOKEN, requestBody);
      if (json.code == SUCCESS) {
        dispatch({ type: ACTION_TYPE.GET_VIDEO_TOKEN_SUCCESS, payload: json });
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
        dispatch({ type: ACTION_TYPE.GET_VIDEO_TOKEN_FAIL });
      }
    } catch (error) {
      dispatch({ type: ACTION_TYPE.GET_VIDEO_TOKEN_FAIL });
    }
  };
}
