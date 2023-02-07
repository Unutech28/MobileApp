import {
  navigatorPush,
  navigatorPop,
  navigatorPopRoot,
  navigatorRoot,
} from "@config/navigationOptions";
import GLOBALS from "@constants";
import { Alert } from "react-native";
import RestClient from "@helpers/RestClient";
import MSRestClient from "@helpers/MSRestClient";
import { toast } from "@helpers/common";
import * as AppActions from "@actions";
import CryptoJS from "react-native-crypto-js";
import momentZone from "moment-timezone";
import moment from "moment";
import Toast from "react-native-simple-toast";
import { getSingleCardData } from "../../actions/cards";
import {
  getTermsConditionsData,
  getPrivacyPolicyData,
} from "../../actions/auth";

const {
  COLOR,
  ACTION_TYPE,
  URL,
  STRINGS,
  NETWORK_STATUS,
  USER_MS_URL,
  MS_Endpoints,
  MASTER_MS_URL,
  PRODUCT_MS_URL,
} = GLOBALS;
const { TRY_AGAIN, CHECK_NETWORK } = STRINGS;
import { strings } from "@localization";
const { SUCCESS, FAILURE, SESSION_ERROR } = NETWORK_STATUS;

/***Set Selected Program */
export const setSelectedProgram = (data) => {
  return async (dispatch) => {
    dispatch({
      type: ACTION_TYPE.SET_SELECTED_PROGRAM,
      payload: data,
    });
  };
};

export function getProgramsList() {
  return async (dispatch) => {
    dispatch({ type: ACTION_TYPE.PROGRAMS_LIST_REQUEST });
    try {
      let json = await MSRestClient.getCall(
        MASTER_MS_URL + MS_Endpoints.PROGRAMS_LIST
      );
      if (json.status === 200) {
        dispatch({
          type: ACTION_TYPE.PROGRAMS_LIST_SUCCESS,
          payload: json.res,
        });
      }
    } catch (error) {
      // dispatch(handleResponseError(error));
    }
  };
}

/**API to get Last card read details */
export function getLastCardReadData() {
  return async (dispatch) => {
    dispatch({ type: ACTION_TYPE.PRIVACY_POLICY_DATA_REQUEST });
    try {
      let json = await MSRestClient.getCall(
        PRODUCT_MS_URL + URL.GET_LAST_CARD_READT_DATA
      );
      if (json.status === 200) {
        dispatch({
          type: ACTION_TYPE.SET_LAST_CARD_READT_DATA,
          payload: json.res,
        });
      } else {
        dispatch({
          type: ACTION_TYPE.PRIVACY_POLICY_DATA_FAIL,
        });
      }
    } catch (error) {
      dispatch(handleResponseError(error));
      dispatch({
        type: ACTION_TYPE.PRIVACY_POLICY_DATA_FAIL,
        payload: error,
      });
    }
  };
}

export function getHospitaDetails(data) {
  return async (dispatch) => {
    dispatch({ type: ACTION_TYPE.PROGRAMS_LIST_REQUEST });
    try {
      let json = await MSRestClient.getCall(
        MASTER_MS_URL + MS_Endpoints.HOSPITAL_DETAILS + data?.regCode
      );
      if (json.status === 200) {
        dispatch({
          type: ACTION_TYPE.GET_ACTIVE_PROGRAM_SUCCESS,
          payload: json.res,
        });
      }
    } catch (error) {
      // dispatch(handleResponseError(error));
    }
  };
}

export function getProgramTrack(data, cb) {
  console.log("data===>data===>", data);

  return async (dispatch) => {
    dispatch({ type: ACTION_TYPE.PROGRAMS_LIST_REQUEST });

    try {
      // let json = await MSRestClient.getCall(PRODUCT_MS_URL + MS_Endpoints.PROGRAM_TRACK + data);
      // let json = await MSRestClient.getCall(MASTER_MS_URL + MS_Endpoints.PROGRAM);
      let json = await MSRestClient.getCall(
        MASTER_MS_URL + MS_Endpoints.GET_ACTIVE_PRGRAM + data
      );
      console.log("program track====>", json);
      let theme = {
        primary: json?.res?.primaryColor ? json?.res?.primaryColor : "#6545B2",
        secondary: json?.res?.secondaryColor
          ? json?.res?.secondaryColor
          : "#6545B2",
      };
      COLOR.DARK_GREEN = json?.res?.primaryColor
        ? json?.res?.primaryColor
        : "#6545B2";
      if (json?.res?.secondaryColor) {
        GLOBALS.COLOR.activeStepIconColor = json?.res?.secondaryColor;
        GLOBALS.COLOR.progressBarColor = json?.res?.secondaryColor;
        GLOBALS.COLOR.PRIMARY = json?.res?.secondaryColor;
      }

      if (json.status === 200) {
        dispatch({
          type: ACTION_TYPE.ACTIVE_PROGRAM_TIME_STAMP,
          payload: new Date(),
        });
        dispatch({
          type: ACTION_TYPE.GET_ACTIVE_PROGRAM_SUCCESS,
          payload: json.res,
        });
        dispatch({
          type: ACTION_TYPE.SET_THEME,
          payload: { ...theme },
        });
        if (cb) {
          cb();
        }
      }
      dispatch(getLastCardReadData());
      dispatch(getPrivacyPolicyData());
      dispatch(getTermsConditionsData());
      // dispatch(getProgramStageStatus());
    } catch (error) {
      // dispatch(handleResponseError(error));
    }
  };
}

export function getProgramStageStatus(data, cb) {
  console.log("data===>Stagedata===>");

  return async (dispatch, getState) => {
    let programName = getState().programReducer.activeProgramDetail.name
      ? getState().programReducer.activeProgramDetail.name
      : "fertilift";
    let componentId = getState().componentStats.componentStats.componentId;
    try {
      let json = await MSRestClient.getCall(
        USER_MS_URL + MS_Endpoints.GET_CURRUNT_STAGE + programName.toLowerCase()
      );
      if (json.status === 200) {
        if (json?.res?.openChatbot) {
          console.log("here===>Chatbot call from getca;;;=====>");
          //for open chat bot
          // dispatch(
          //   AppActions.manageChatbot({}, "fertilift", false, componentId, false)
          // );
        } else {
          if (json?.res?.event?.stage) {
            dispatch({
              type: ACTION_TYPE.SET_ACTIVE_STAGE,
              payload: json?.res?.event ? json?.res?.event.stage : 1,
            });
          }
        }
      }
      dispatch(getUserStageStatus());
    } catch (error) {
      // dispatch(handleResponseError(error));
    }
  };
}
export function getUserStageStatus() {
  return async (dispatch, getState) => {
    try {
      let json = await MSRestClient.getCall(
        PRODUCT_MS_URL + MS_Endpoints.PROGRAM_STAGE_TRACK
      );
      console.log("User Stages===>", json);
      if (json.status === 200) {
        dispatch({
          type: ACTION_TYPE.SET_USER_READ_STAGES,
          payload: json.res.userStage.length > 0 ? json.res.userStage : ["0"],
        });
      }
    } catch (error) {}
  };
}

export function setCardProgramTrack(data, cb) {
  console.log("data===>data===>", data);

  return async (dispatch) => {
    // dispatch({ type: ACTION_TYPE.PROGRAMS_LIST_REQUEST });
    dispatch({
      type: ACTION_TYPE.SET_ACTIVE_STAGE,
      payload: data.stage ? data.stage : 1,
    });
    try {
      let json = await MSRestClient.postCall(
        PRODUCT_MS_URL + MS_Endpoints.PROGRAM_TRACK,
        data
      );
      console.log(json, "json....");
    } catch (error) {
      // dispatch(handleResponseError(error));
    }
  };
}

export function getAllTrackersList() {
  return async (dispatch) => {
    dispatch({ type: ACTION_TYPE.GET_ALL_TRACKERS_LIST_REQUEST });
    try {
      let json = await MSRestClient.getCall(
        MASTER_MS_URL + MS_Endpoints.GET_ALL_TRACKERS_LIST
      );
      if (json.status === 200) {
        dispatch({
          type: ACTION_TYPE.GET_ALL_TRACKERS_LIST_SUCCESS,
          payload: json.res,
        });
      } else {
        if (json.code == FAILURE) {
          toast(json.message);
        }
        dispatch({
          type: ACTION_TYPE.GET_ALL_TRACKERS_LIST_FAIL,
        });
      }
    } catch (error) {
      // dispatch(handleResponseError(error));
      dispatch({
        type: ACTION_TYPE.GET_ALL_TRACKERS_LIST_FAIL,
        payload: error,
      });
    }
  };
}

//save trackers
export function saveTrackers(postData, componentId) {
  return async (dispatch) => {
    dispatch({ type: ACTION_TYPE.SAVE_TRACKERS_REQUEST });
    try {
      let json = await MSRestClient.postCall(
        MASTER_MS_URL + MS_Endpoints.GET_ALL_TRACKERS_LIST,
        postData
      );
      if (json.status === 200) {
        dispatch({
          type: ACTION_TYPE.SAVE_TRACKERS_SUCCESS,
          payload: json.res ? json.res : {},
        });
        console.log("resopnse message", json.data.res.msg);
        if (postData.value == "activity") {
          toast("Your activities have been saved.");
        } else if (postData.value == "mood") {
          toast("Your mood have been saved.");
        } else if (postData.value == "sleep") {
          toast("Your sleep has been saved.");
        } else {
          toast(json?.data?.res?.msg);
        }
        // toast(json.data.res.msg);
        // navigatorPop({ componentId });
        // navigatorPush("Dashboard");
        navigatorRoot("Dashboard");
        dispatch(fetchAllTrackers(postData.trackerId, postData.value));
        dispatch(getAllTrackersList());
      } else {
        if (json.code == FAILURE) {
          toast(json.message);
        }
        dispatch({
          type: ACTION_TYPE.SAVE_TRACKERS_FAIL,
        });
      }
    } catch (error) {
      // dispatch(handleResponseError(error));
      dispatch({
        type: ACTION_TYPE.GET_ALL_TRACKERS_LIST_FAIL,
        payload: error,
      });
    }
  };
}

//fetch all filled trackers
export function fetchAllTrackers(trackerId, trackerType) {
  return async (dispatch) => {
    dispatch({ type: ACTION_TYPE.FETCH_ALL_TRACKERS_REQUEST });
    try {
      let json = await MSRestClient.getCall(
        MASTER_MS_URL + MS_Endpoints.FETCH_ALL_TRACKERS + trackerId
      );
      if (json.status === 200) {
        if (trackerType == "sleep") {
          dispatch({
            type: ACTION_TYPE.FETCH_SLEEP_TRACKERS_SUCCESS,
            payload: json.res,
          });
        } else if (trackerType == "mood") {
          dispatch({
            type: ACTION_TYPE.FETCH_ALL_TRACKERS_SUCCESS,
            payload: json.res,
          });
        } else if (trackerType == "activity") {
          dispatch({
            type: ACTION_TYPE.FETCH_ACTIVITY_TRACKERS_SUCCESS,
            payload: json.res,
          });
        }
      } else {
        if (json.code == FAILURE) {
          toast(json.message);
        }
        dispatch({
          type: ACTION_TYPE.FETCH_ALL_TRACKERS_FAIL,
        });
      }
    } catch (error) {
      // dispatch(handleResponseError(error));
      dispatch({
        type: ACTION_TYPE.FETCH_ALL_TRACKERS_FAIL,
        payload: error,
      });
    }
  };
}

//fetch users weekly reports
export function getUserWeeklyReports() {
  return async (dispatch) => {
    dispatch({ type: ACTION_TYPE.FETCH_ALL_REPORTS_REQUEST });
    try {
      let json = await MSRestClient.getCall(
        MASTER_MS_URL + MS_Endpoints.FETCH_USER_REPORTS
      );
      if (json.status === 200) {
        dispatch({
          type: ACTION_TYPE.FETCH_ALL_REPORTS_SUCCESS,
          payload: json.res,
        });
      } else {
        if (json.code == FAILURE) {
          toast(json.message);
        }
        dispatch({
          type: ACTION_TYPE.FETCH_ALL_REPORTS_FAIL,
        });
      }
    } catch (error) {
      // dispatch(handleResponseError(error));
      dispatch({
        type: ACTION_TYPE.FETCH_ALL_REPORTS_FAIL,
        payload: error,
      });
    }
  };
}

//add time tracking
export function addTimeTraker(postData) {
  return async (dispatch) => {
    dispatch({ type: ACTION_TYPE.ADD_TIME_TRACKER_REQUEST });
    try {
      let json = await MSRestClient.postCall(
        USER_MS_URL + MS_Endpoints.ADD_TIME_TRACKER_API,
        postData
      );
      if (json.status === 200) {
        dispatch({
          type: ACTION_TYPE.ADD_TIME_TRACKER_SUCCESS,
          payload: json.res,
        });
      } else {
        if (json.code == FAILURE) {
          toast(json.message);
        }
        dispatch({
          type: ACTION_TYPE.ADD_TIME_TRACKER_FAIL,
        });
      }
    } catch (error) {
      // dispatch(handleResponseError(error));
      dispatch({
        type: ACTION_TYPE.ADD_TIME_TRACKER_FAIL,
        payload: error,
      });
    }
  };
}

// user last seen
export function updateUserLastSeen(postData) {
  return async (dispatch) => {
    dispatch({ type: ACTION_TYPE.UPDATE_LAST_SEEN_REQUEST });
    try {
      let json = await MSRestClient.putCall(
        USER_MS_URL + MS_Endpoints.USER_LAST_SEEN,
        postData
      );
      if (json.status === 200) {
        dispatch({
          type: ACTION_TYPE.UPDATE_LAST_SEEN_SUCCESS,
          payload: json.res,
        });
      } else {
        if (json.code == FAILURE) {
          toast(json.message);
        }
        dispatch({
          type: ACTION_TYPE.UPDATE_LAST_SEEN_FAIL,
        });
      }
    } catch (error) {
      // dispatch(handleResponseError(error));
      dispatch({
        type: ACTION_TYPE.UPDATE_LAST_SEEN_FAIL,
        payload: error,
      });
    }
  };
}
// API for save cards data
export function addQueAnsDataApi(
  data,
  isLogout,
  componentId,
  type = "learning",
  userLanguage,
  cardId
) {
  return async (dispatch, getState) => {
    let prgId = getState().programReducer?.selectedProgram?._id
      ? getState().programReducer.selectedProgram._id
      : getState().authReducer.loginData.profile?.activatedProg._id;
    console.log("here==>", { ...data, progId: prgId });
    dispatch({ type: ACTION_TYPE.LOGIN_REQUEST });
    try {
      let json = await MSRestClient.postCall(
        PRODUCT_MS_URL + MS_Endpoints.CARD_ACTION,
        JSON.stringify(data)
      );
      dispatch(getSingleCardData(cardId));
      dispatch({ type: ACTION_TYPE.API_SUCCESS });
      dispatch({ type: ACTION_TYPE.API_SUCCESS });
    } catch (error) {
      dispatch({ type: ACTION_TYPE.API_SUCCESS });
      dispatch({
        type: ACTION_TYPE.ADD_QUE_ANS_FAIL,
        payload: error,
      });
    }
  };
}

/* ------ GET getPlayListPoints --------*/
export function getPlayListPoints(data) {
  return async (dispatch) => {
    dispatch({ type: ACTION_TYPE.FETCH_ALL_REPORTS_REQUEST });
    try {
      let json = await MSRestClient.getCall(
        USER_MS_URL + MS_Endpoints.FETCH_POINTS
      );
      console.log("points===>", json);
      if (json.status === 200) {
        dispatch({
          type: ACTION_TYPE.GET_PLAYLIST_POINTS_SUCCESS,
          payload: json.res,
        });
      } else {
        dispatch({
          type: ACTION_TYPE.GET_PLAYLIST_POINTS_FAIL,
          payload: json,
        });
      }
    } catch (error) {
      dispatch({
        type: ACTION_TYPE.GET_PLAYLIST_POINTS_FAIL,
        payload: error,
      });
    }
  };
}

// getActiveScreenTime
export function getScreenStartTime(data) {
  return async (dispatch) => {
    dispatch({
      type: ACTION_TYPE.GET_SCREEN_START_TIME,
      payload: data,
    });
  };
}

/*****API to get all keywords data */
export function getKeywords(data) {
  return async (dispatch) => {
    try {
      let postData = {
        data: CryptoJS.AES.encrypt(
          JSON.stringify(data),
          STRINGS.HIPPA_KEY
        ).toString(),
      };
      let json = await RestClient.getCall(URL.GET_KEYWORDS, postData);

      if (json.code == SUCCESS) {
        dispatch({
          type: ACTION_TYPE.GET_KEYWORD_SUCCESS,
          payload: json.data,
        });
        return json.data;
      }
    } catch (error) {
      alert(error);
    }
  };
}

/**Toggle value of pop up to show or not */
export function togglePopup(status) {
  return async (dispatch) => {
    dispatch({
      type: ACTION_TYPE.POPUP_STATUS,
      payload: status,
    });
  };
}

export function uploadProfileImage(data) {
  console.log("image data==>", data);

  return async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPE.LOGIN_REQUEST });
    try {
      let json = await MSRestClient.putCallFormData(
        USER_MS_URL + MS_Endpoints.USER_UPADYE,
        data
      );
      console.log("Upload Image===>", json);
      if (json.status === 200) {
        dispatch({
          type: ACTION_TYPE.STORE_USER_DATA,
          payload: json?.res?.profile,
        });
      }
      dispatch({
        type: ACTION_TYPE.API_SUCCESS,
      });
    } catch (error) {
      console.log("image data Error==>", error);
      dispatch({
        type: ACTION_TYPE.API_SUCCESS,
      });
      // dispatch(handleResponseError(error));
    }
  };
}

//draftJournalAnswer
export function draftJournalAnswer(data) {
  return async (dispatch) => {
    try {
      dispatch({
        type: ACTION_TYPE.DRAFT_JOURNAL_ANSWER_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: ACTION_TYPE.DRAFT_JOURNAL_ANSWER_FAIL,
        payload: error,
      });
    }
  };
}

//draftJournalAnswer clear
export function draftJournalAnswerClear() {
  return async (dispatch) => {
    try {
      dispatch({
        type: ACTION_TYPE.DRAFT_JOURNAL_ANSWER_CLEAR,
        payload: "",
      });
    } catch (error) {
      dispatch({
        type: ACTION_TYPE.DRAFT_JOURNAL_ANSWER_CLEAR_FAIL,
        payload: error,
      });
    }
  };
}

/*****Action to clear the dasboard data*/
export function clearDashboardReducer() {
  return async (dispatch) => {
    try {
      dispatch({
        type: ACTION_TYPE.CLEAR_DASHBOARD_REDUCER,
        payload: json.data,
      });
    } catch (error) {
      dispatch({
        type: ACTION_TYPE.CLEAR_DASHBOARD_REDUCER_FAIL,
        payload: error,
      });
    }
  };
}

/* ------ GET getPlayListPoints --------*/
export function getHelp(data) {
  return async (dispatch) => {
    dispatch({ type: ACTION_TYPE.FETCH_ALL_REPORTS_REQUEST });
    try {
      let json = await MSRestClient.getCall(
        MASTER_MS_URL + MS_Endpoints.FETCH_HELP_LIST
      );
      console.log("points===>", json);
      if (json.status === 200) {
        dispatch({
          type: ACTION_TYPE.GET_HELP_SUCCESS,
          payload: json.res,
        });
      } else {
        dispatch({
          type: ACTION_TYPE.GET_PLAYLIST_POINTS_FAIL,
          payload: json,
        });
      }
    } catch (error) {
      dispatch({
        type: ACTION_TYPE.GET_PLAYLIST_POINTS_FAIL,
        payload: error,
      });
    }
  };
}

/* ------ Save FCM token--------*/
export function saveFcmToken(data) {
  return async (dispatch) => {
    dispatch({
      type: ACTION_TYPE.SET_FCM_DEVICE_TOKEN,
      payload: data,
    });
  };
}
