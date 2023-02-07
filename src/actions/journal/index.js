import GLOBALS from "@constants";
import RestClient from "@helpers/RestClient";
import { toast } from "@helpers/common";
import { Alert } from "react-native";
import * as AppActions from "@actions";
import { strings } from '@localization';
const { ACTION_TYPE, URL, STRINGS, NETWORK_STATUS, MASTER_MS_URL, MS_Endpoints, USER_MS_URL } = GLOBALS;
const { SUCCESS, SESSION_ERROR } = NETWORK_STATUS
import MSRestClient from '@helpers/MSRestClient';

/***API to get all assined journals to a patient */
export function getJournal(data) {
  return async (dispatch) => {
    dispatch({ type: ACTION_TYPE.GET_JOURNAL_REQUEST });
    try {
      let json = await MSRestClient.getCall(MASTER_MS_URL + MS_Endpoints.GET_JOURNAL);

      if (json.status == SUCCESS) {
        dispatch({
          type: ACTION_TYPE.GET_JOURNAL_SUCCESS,
          payload: json.res,
        });
      } else {
        if (json.status == SESSION_ERROR) {
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
          type: ACTION_TYPE.GET_JOURNAL_FAIL,
          payload: json,
        });
      }
    } catch (error) {
      dispatch({
        type: ACTION_TYPE.GET_JOURNAL_FAIL,
        payload: error,
      });
    }
  };
}
/*****API to get question of speific journals****/
export function getJournalQuestions(journalId) {
  return async (dispatch) => {
    dispatch({ type: ACTION_TYPE.GET_JOURNAL_QUESTIONS_REQUEST });
    try {
      let json = await MSRestClient.getCall(MASTER_MS_URL + MS_Endpoints.GET_JOURNAL_QUESTIONS + journalId);
      if (json.status == SUCCESS) {
        dispatch({
          type: ACTION_TYPE.GET_JOURNAL_QUESTIONS_SUCCESS,
          payload: json.res,
        });
        dispatch({
          type: ACTION_TYPE.SET_TEXT_VISIBLE,
          payload: false,
        });
      } else {
        if (json.status == SESSION_ERROR) {
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
          type: ACTION_TYPE.GET_JOURNAL_QUESTIONS_FAIL,
          payload: json,
        });
      }
    } catch (error) {
      dispatch({
        type: ACTION_TYPE.GET_JOURNAL_QUESTIONS_FAIL,
        payload: error,
      });
    }
  };
}


/*****API to get answers of speific journals****/
export function getJournalAnswrs(journalId) {
  return async (dispatch) => {
    dispatch({ type: ACTION_TYPE.GET_JOURNAL_QUESTIONS_REQUEST });
    try {
      let json = await MSRestClient.getCall(USER_MS_URL + MS_Endpoints.GET_JOURNAL_VIEW_QUESTIONS + journalId);
      if (json.status == SUCCESS) {
        dispatch({
          type: ACTION_TYPE.GET_JOURNAL_ANSWER_SUCCESS,
          payload: json.res,
        });
        dispatch({
          type: ACTION_TYPE.SET_TEXT_VISIBLE,
          payload: false,
        });
      } else {
        if (json.status == SESSION_ERROR) {
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
          type: ACTION_TYPE.GET_JOURNAL_QUESTIONS_FAIL,
          payload: json,
        });
      }
    } catch (error) {
      dispatch({
        type: ACTION_TYPE.GET_JOURNAL_QUESTIONS_FAIL,
        payload: error,
      });
    }
  };
}

/*****API to Edit answers of speific journals****/
export function editJournalAnswrs(journalId, answerId, answer) {
  const body = {
    "textAns": answer,
  }
  return async (dispatch) => {
    dispatch({ type: ACTION_TYPE.SAVE_JOURNAL_QUESTIONS_REQUEST });
    try {
      let json = await MSRestClient.putCall(USER_MS_URL + MS_Endpoints.GET_JOURNAL_VIEW_QUESTIONS + "ans/" + journalId + "/" + answerId, body);
      if (json.status == SUCCESS) {

        dispatch({
          type: ACTION_TYPE.SAVE_JOURNAL_QUESTIONS_SUCCESS,
        });
        this.getJournalAnswrs(journalId);
      } else {
        if (json.status == SESSION_ERROR) {
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
          type: ACTION_TYPE.GET_JOURNAL_QUESTIONS_FAIL,
          payload: json,
        });
      }
    } catch (error) {
      dispatch({
        type: ACTION_TYPE.GET_JOURNAL_QUESTIONS_FAIL,
        payload: error,
      });
    }
  };
}




/**API for saving journals */
export function saveJournalQuestion(
  requestBody,
  journal_id,
  userId
) {
  return async (dispatch) => {
    dispatch({ type: ACTION_TYPE.SAVE_JOURNAL_QUESTIONS_REQUEST });
    const body = {
      useranswer: requestBody,
    }
    try {
      // let json = await RestClient.postCall(
      //   URL.SAVE_JOURNAL_QUESTIONS,
      //   requestBody
      // );
      let json = await MSRestClient.postCall(USER_MS_URL + MS_Endpoints.SAVE_JOURNAL_QUESTIONS + journal_id, body);
      if (json.status == SUCCESS) {
        let postData = {
          journal_id: journal_id,
          user_id: userId,
        };
        // this.getJournalQuestions(postData);
        this.getJournalQuestions(journal_id);
        this.getJournalAnswrs(journal_id);

        dispatch({
          type: ACTION_TYPE.SAVE_JOURNAL_QUESTIONS_SUCCESS,
        });
        dispatch({
          type: ACTION_TYPE.SET_TEXT_VISIBLE,
          payload: true,
        });
        toast(strings.JOURNAL_POPUP);
      } else {
        if (json.status == SESSION_ERROR) {
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
        dispatch({ type: ACTION_TYPE.SAVE_JOURNAL_QUESTIONS_FAIL });
      }
    } catch (error) {
      dispatch({ type: ACTION_TYPE.SAVE_JOURNAL_QUESTIONS_FAIL });
    }
  };
}
