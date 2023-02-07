import { navigatorPop, navigatorPush, } from "@config/navigationOptions";
import GLOBALS from "@constants";
import RestClient from "@helpers/RestClient";
import { toast } from "@helpers/common";
import * as AppActions from "@actions";
import { Alert } from "react-native";
const { ACTION_TYPE, URL, STRINGS, NETWORK_STATUS, MS_Endpoints, MASTER_MS_URL, USER_MS_URL } = GLOBALS;
const { SUCCESS, SESSION_ERROR } = NETWORK_STATUS
import MSRestClient from '@helpers/MSRestClient';

/**API to get all assesments */
export function getAssessments() {
  return async (dispatch) => {
    dispatch({ type: ACTION_TYPE.GET_ASSESSMENTS_REQUEST });
    try {
      let json = await MSRestClient.getCall(MASTER_MS_URL + MS_Endpoints.GET_ASSESSMENTS);
      if (json.status == SUCCESS) {
        dispatch({
          type: ACTION_TYPE.GET_ASSESSMENTS_SUCCESS,
          payload: json.res,
        });
      } else {
        if (json.status === SESSION_ERROR) {
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
          return;
        }
        dispatch({
          type: ACTION_TYPE.GET_ASSESSMENTS_FAIL,
          payload: json,
        });
      }
    } catch (error) {
      dispatch({
        type: ACTION_TYPE.GET_ASSESSMENTS_FAIL,
        payload: error,
      });
    }
  };
}

/**API to get all assesments  question*/
export function getAssessmentsQuestions(assessment_id, cb) {
  return async (dispatch) => {
    dispatch({ type: ACTION_TYPE.GET_ASSESSMENTS_QUESTIONS_REQUEST });

    try {
      let json = await MSRestClient.getCall(MASTER_MS_URL + MS_Endpoints.GET_ASSESSMENTS_DETAILS + assessment_id);
      if (json.status == SUCCESS) {
        if (cb) {
          cb(json.res)
        }
        dispatch({
          type: ACTION_TYPE.GET_ASSESSMENTS_QUESTIONS_SUCCESS,
          payload: json.res,
        });

      } else {
        if (json.status === SESSION_ERROR) {
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
          return;
        }
        dispatch({
          type: ACTION_TYPE.GET_ASSESSMENTS_QUESTIONS_FAIL,
          payload: json,
        });
      }
    } catch (error) {
      dispatch({
        type: ACTION_TYPE.GET_ASSESSMENTS_QUESTIONS_FAIL,
        payload: error,
      });
    }
  };
}

/**API to view all assesments  question*/
export function viewAssessmentsQuestions(assessment_id) {
  return async (dispatch) => {
    dispatch({ type: ACTION_TYPE.VIEW_ASSESSMENTS_QUESTIONS_REQUEST });

    try {


      let json = await MSRestClient.getCall(USER_MS_URL + MS_Endpoints.VIEW_ASSESSMENTS_DETAILS + assessment_id);

      // if (json.status == SUCCESS) {
      //   dispatch({
      //     type: ACTION_TYPE.VIEW_ASSESSMENTS_QUESTIONS_SUCCESS,
      //     payload: json.res,
      //   });
      // } else {
      //   if (json.status === SESSION_ERROR) {
      //     Alert.alert(
      //       STRINGS.LOGOUT_TITLE,
      //       json.message,
      //       [
      //         {
      //           text: STRINGS.LOGOUT_OK,
      //           onPress: () => dispatch(AppActions.logout_session()),
      //         },
      //       ],
      //       { cancelable: false }
      //     );
      //     return;
      //   }
      //   dispatch({
      //     type: ACTION_TYPE.VIEW_ASSESSMENTS_QUESTIONS_FAIL,
      //     payload: json,
      //   });
      // }
    } catch (error) {
      dispatch({
        type: ACTION_TYPE.VIEW_ASSESSMENTS_QUESTIONS_FAIL,
        payload: error,
      });
    }
  };
}

/**API to get save assesments */
export function saveAssessmentQuestion(requestBody, assessmentId, componentId) {
  return async (dispatch) => {
    dispatch({ type: ACTION_TYPE.SAVE_ASSESSMENTS_QUESTIONS_REQUEST });
    const body = {
      useranswer: requestBody,
      // assessmentId: assessmentId
    }
    try {

      let json = await MSRestClient.postCall(USER_MS_URL + MS_Endpoints.SAVE_USER_ASSESSMENTS + assessmentId, body);
      if (json.status == 200) {
        dispatch(getAssessments());
        navigatorPop({ componentId });
        // navigatorPush({ componentId, screenName: 'Assessments', passProps: {} });
        dispatch({ type: ACTION_TYPE.SAVE_ASSESSMENTS_QUESTIONS_SUCCESS, payload: "Success" });

        // toast(json.message[userLanguage] ? json.message[userLanguage] : json.message["en"]);
        // toast(json.message);
      } else {
        if (json.status === SESSION_ERROR) {
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
          return;
        }
        dispatch({ type: ACTION_TYPE.SAVE_ASSESSMENTS_QUESTIONS_FAIL, payload: "Fail" });
      }
    } catch (error) {
      dispatch({ type: ACTION_TYPE.SAVE_ASSESSMENTS_QUESTIONS_FAIL, payload: "Fail" });
    }
  };
}
