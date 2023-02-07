import GLOBALS from "@constants";
import RestClient from "@helpers/RestClient";
import * as AppActions from "@actions";
import { Alert } from "react-native";
const { ACTION_TYPE, URL, STRINGS, NETWORK_STATUS } = GLOBALS;
const { SUCCESS, SESSION_ERROR } = NETWORK_STATUS

/**API to get playlist data for current week day, points */
export function getPlaylist(user_id) {
  return async (dispatch) => {
    dispatch({ type: ACTION_TYPE.GET_PLAYLIST_REQUEST });
    try {
      let json = await RestClient.postCall(URL.GET_PLAYLIST, {
        user_id: user_id,
      });
      if (json.code == SUCCESS) {
        dispatch({
          type: ACTION_TYPE.GET_PLAYLIST_SUCCESS,
          payload: json,
        });
      } else {
        if (json.code == SESSION_ERROR) {
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
        }
        dispatch({
          type: ACTION_TYPE.GET_PLAYLIST_FAIL,
        });
      }
    } catch (error) {
      dispatch({
        type: ACTION_TYPE.GET_PLAYLIST_FAIL,
      });
    }
  };
}

/**API to set tasks again **/
export function setTaskDone(payload) {
  return async (dispatch) => {
    dispatch({ type: ACTION_TYPE.CHANGE_PLAYLIST_STATUS_REQUEST });
    try {
      let json = await RestClient.postCall(URL.CHANGE_PLAYLIST_STATUS, payload);
      if (json.code == SUCCESS) {
        dispatch({
          type: ACTION_TYPE.CHANGE_PLAYLIST_STATUS_SUCCESS,
          payload: json.data,
        });
        dispatch(getPlaylist(payload.user_id));
      } else {
        dispatch({
          type: ACTION_TYPE.CHANGE_PLAYLIST_STATUS_FAIL,
          payload: json,
        });
      }
    } catch (error) {
      dispatch({
        type: ACTION_TYPE.CHANGE_PLAYLIST_STATUS_FAIL,
        payload: error,
      });
    }
  };
}
