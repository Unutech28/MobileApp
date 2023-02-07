import { navigatorPush } from "@config/navigationOptions";
import { Alert } from "react-native";
import { alertWithOneBtn, getErrorCodeMsg } from "@helpers/common";
// import CodePush from "react-native-code-push";
import GLOBALS from "@constants";
import RestClient from "@helpers/RestClient";
import MSRestClient from "@helpers/MSRestClient";
import { toast } from "@helpers/common";
import { navigatorRoot } from "../../config/navigationOptions";
import * as AppActions from "@actions";
import FastImage from "react-native-fast-image";
import RNRestart from "react-native-restart";
import moment from "moment";

const {
  ACTION_TYPE,
  URL,
  STRINGS,
  NETWORK_STATUS,
  AUTH_MS_URL,
  USER_MS_URL,
  MS_Endpoints,
  MASTER_MS_URL,
  PRODUCT_MS_URL,
} = GLOBALS;
const { TRY_AGAIN, CHECK_NETWORK } = STRINGS;
const { SUCCESS, FAILURE, SESSION_ERROR, AUTH_ERROR } = NETWORK_STATUS;
import { strings } from "@localization";

/***Set User Language */
export const updateLanguage = (lang, reload = true) => {
  return async (dispatch) => {
    dispatch({
      type: ACTION_TYPE.SET_LANGUAGE,
      payload: lang,
    });
    strings.setLanguage(lang);
    if (reload) {
      setTimeout(() => {
        // CodePush.restartApp();
        RNRestart.Restart();
      }, 1000);
    }
  };
};

/**Error Handling */
export const handleResponseError = (data) => {
  let errorMsg = strings.CoustomAlert.server_is_not_reachable;
  return async (dispatch) => {
    dispatch({
      type: ACTION_TYPE.API_SUCCESS,
    });
    if (data && data.err && data.err.msg) {
      errorMsg = getErrorCodeMsg(data.err.msg)
        ? getErrorCodeMsg(data.err.msg)
        : data.err.msg;
    }
    alertWithOneBtn("", errorMsg, strings.CoustomAlert.ok).then((res) => {
      if (data.status == AUTH_ERROR) {
        dispatch(resetToLogin());
      }
    });
  };
};

/**Reset to Login Page */
export const resetToLogin = () => {
  return async (dispatch) => {
    dispatch({
      type: ACTION_TYPE.CLEAR_STATE,
    });
    dispatch({
      type: ACTION_TYPE.LOGOUT_SUCCESS,
    });
    dispatch({
      type: ACTION_TYPE.RESET_CARDS,
    });
    dispatch({
      type: ACTION_TYPE.API_SUCCESS,
    });
    navigatorRoot("SignIn");
    FastImage.clearMemoryCache().then((res) => {});
    FastImage.clearDiskCache().then((res) => {});
  };
};

/**API to login, clear cache taken by Fast image images */
export function login(
  email,
  password,
  timeZone,
  deviceInfo,
  is_remember,
  componentId
) {
  return async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPE.LOGIN_RESET });
    dispatch({ type: ACTION_TYPE.LOGIN_REQUEST });
    FastImage.clearMemoryCache().then((res) => {});
    FastImage.clearDiskCache().then((res) => {});
    let postData = {
      email: email,
      pass: password,
      // password: password,
      // deviceToken: getState().authReducer.fcmDeviceToken,
      // timeZone: timeZone,
      // deviceDetails: deviceInfo,
    };
    // postCallAxios postCall
    try {
      let json = await MSRestClient.postCall(
        AUTH_MS_URL + MS_Endpoints.LOGIN,
        postData
      );
      if (json.data?.status === 200) {
        let data = {
          group: "login_logout",
          event: "login",
          inTime: moment().format(),
          activityDate: moment().format(),
          outTime: null,
        };
        console.log("data>>", data);
        dispatch(AppActions.addTimeTraker(data));

        dispatch({
          type: ACTION_TYPE.SET_REMEMBER_ME,
          payload: {
            remember_password: password,
            is_remember: is_remember,
            remember_email: email,
          },
        });

        dispatch({
          type: ACTION_TYPE.LOGIN_SUCCESS,
          payload: json.data?.res,
        });
        dispatch({
          type: ACTION_TYPE.STORE_USER_DATA,
          payload: json.data?.res?.profile,
        });
        dispatch({
          type: ACTION_TYPE.LOGIN_TOKEN,
          payload: json.data?.res?.acesssToken,
        });
        /**If first time user then Welcome redirect else redirect to dasboard */
        if (json.data.res.isTempPass) {
          dispatch({
            type: ACTION_TYPE.CURRENT_SCREEN,
            payload: 0,
          });
          //   navigatorPush({ componentId, screenName: "UpdatePassword" });
          navigatorRoot("UpdatePassword", {
            openChat: true,
          });
        } else {
          dispatch({
            type: ACTION_TYPE.CURRENT_SCREEN,
            payload: 2,
          });
          navigatorRoot("Dashboard", {
            openChat: false,
          });
          // navigatorRoot("UpdatePassword", {
          //   openChat: true
          // });
          // navigatorRoot("WelcomeScreen");
        }
        dispatch(getPrivacyPolicyData());
        dispatch(getTermsConditionsData());
        dispatch(getIpAdressFromApi());
      } else {
        dispatch({
          type: ACTION_TYPE.LOGIN_FAIL,
        });
      }
    } catch (error) {
      dispatch(handleResponseError(error));
      dispatch({
        type: ACTION_TYPE.LOGIN_FAIL,
      });
    }
  };
}

/**API to reset user password */
export function setPassword(data, isTempPass) {
  return async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPE.LOGIN_REQUEST });
    try {
      let json = await MSRestClient.putCall(
        AUTH_MS_URL + MS_Endpoints.SET_PASSWORD,
        data
      );
      if (json.status === 200) {
        dispatch({
          type: ACTION_TYPE.LOGIN_TOKEN,
          payload: json?.res?.acesssToken,
        });
        if (isTempPass) {
          navigatorRoot("WelcomeScreen");
          // navigatorRoot("SignIn");
        }
      }
      dispatch({
        type: ACTION_TYPE.API_SUCCESS,
      });
    } catch (error) {
      dispatch({
        type: ACTION_TYPE.API_SUCCESS,
      });
      dispatch(handleResponseError(error));
    }
  };
}

/**API to forgot user password */
export function forgotPass(data) {
  return async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPE.LOGIN_REQUEST });
    try {
      let json = await MSRestClient.postCall(
        AUTH_MS_URL + MS_Endpoints.FORGOT_PASSWORD,
        data
      );
      console.log("Forfotpassword===>", json);

      if (json.status === 200) {
        alert("OTP has been sent to your email.");
        navigatorRoot("ResetPassword");
      }
      dispatch({
        type: ACTION_TYPE.API_SUCCESS,
      });
    } catch (error) {
      dispatch({
        type: ACTION_TYPE.API_SUCCESS,
      });
      dispatch(handleResponseError(error));
    }
  };
}

/**API to reset user password */
export function resetPassword(data) {
  return async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPE.LOGIN_REQUEST });
    try {
      let json = await MSRestClient.postCall(
        AUTH_MS_URL + MS_Endpoints.RESET_PASSWORD,
        data
      );
      console.log("resetPassword===>", json);
      if (json.status === 200) {
        navigatorRoot("SignIn");
      }
      dispatch({
        type: ACTION_TYPE.API_SUCCESS,
      });
    } catch (error) {
      dispatch({
        type: ACTION_TYPE.API_SUCCESS,
      });
      dispatch(handleResponseError(error));
    }
  };
}

/**API for logout */
export const logout = () => {
  return async (dispatch) => {
    dispatch({ type: ACTION_TYPE.SHOW_LOADER });
    try {
      let json = await MSRestClient.deleteCall(
        AUTH_MS_URL + MS_Endpoints.LOGOUT
      );
      dispatch(resetToLogin());
    } catch (error) {
      dispatch(resetToLogin());
      dispatch(handleResponseError(error));
    }
  };
};

/**API to get regirtration code of the user and Program details */
export function getWelcomeData() {
  return async (dispatch) => {
    dispatch({ type: ACTION_TYPE.WELCOME_DATA_REQUEST });
    try {
      let json = await MSRestClient.getCall(
        USER_MS_URL + MS_Endpoints.GET_WELCOME_API
      );
      if (json.status === 200) {
        dispatch({
          type: ACTION_TYPE.WELCOME_DATA_SUCCESS,
          payload: json.res,
        });
      } else {
        if (json.code == FAILURE) {
          toast(json.message);
        }
        dispatch({
          type: ACTION_TYPE.WELCOME_DATA_FAIL,
        });
      }
    } catch (error) {
      dispatch(handleResponseError(error));
      dispatch({
        type: ACTION_TYPE.WELCOME_DATA_FAIL,
        payload: error,
      });
    }
  };
}

/**Clear state and go to login */
export const logout_session = () => {
  return async (dispatch) => {
    dispatch({ type: ACTION_TYPE.CLEAR_STATE });
    dispatch({ type: ACTION_TYPE.LOGOUT_SUCCESS });
    navigatorRoot("SignIn");
  };
};

export const exitApplication = () => {
  return (dispatch) => {
    dispatch({ type: ACTION_TYPE.EXIT_APPLICATION });
  };
};

/**API to save user keywords for personalization */
export const setKeywords = (userId, data) => {
  if (userId !== null && userId !== undefined && userId !== "") {
    return async (dispatch) => {
      try {
        let json = await RestClient.postCall(URL.SET_KEYWORDS, {
          user_id: userId,
          keywords: data,
        });
        if (json.code == SUCCESS) {
          dispatch({
            type: ACTION_TYPE.STORE_USER_DATA,
            payload: json.data,
          });
          toast(json.message);
        } else {
          toast(json.message);
        }
      } catch (error) {
        dispatch({
          type: ACTION_TYPE.LOGOUT_FAIL,
        });
      }
    };
  } else {
    return async (dispatch) => {
      dispatch({ type: ACTION_TYPE.CLEAR_STATE });
      dispatch({ type: ACTION_TYPE.LOGOUT_SUCCESS });
      navigatorRoot("SignIn");
    };
  }
};

/**API to get Terms & Conditions details */
export function getTermsConditionsData() {
  console.log("getTermsConditionsData");
  return async (dispatch) => {
    dispatch({ type: ACTION_TYPE.TERMS_CONDITIONS_DATA_REQUEST });
    try {
      let json = await MSRestClient.getCall(
        MASTER_MS_URL + MS_Endpoints.GET_TERMS_CONDITIONS_DETAILS
      );
      if (json.status === 200) {
        dispatch({
          type: ACTION_TYPE.TERMS_CONDITIONS_DATA_SUCCESS,
          payload: json.res,
        });
      } else {
        if (json.code == FAILURE) {
          toast(json.message);
        }
        dispatch({
          type: ACTION_TYPE.TERMS_CONDITIONS_DATA_FAIL,
        });
      }
    } catch (error) {
      dispatch(handleResponseError(error));
      dispatch({
        type: ACTION_TYPE.TERMS_CONDITIONS_DATA_FAIL,
        payload: error,
      });
    }
  };
}

/**API to get Terms & Conditions details */
export function getHelpDocumentsData(data) {
  console.log("getHelpDocumentsData", MASTER_MS_URL + data);
  return async (dispatch) => {
    dispatch({ type: ACTION_TYPE.TERMS_CONDITIONS_DATA_REQUEST });
    try {
      let json = await MSRestClient.getCall(MASTER_MS_URL + data);
      console.log("data==>", json);
      if (json.status === 200) {
        return json.res;
      } else {
        if (json.code == FAILURE) {
          toast(json.message);
        }
        dispatch({
          type: ACTION_TYPE.TERMS_CONDITIONS_DATA_FAIL,
        });
      }
    } catch (error) {
      dispatch(handleResponseError(error));
      dispatch({
        type: ACTION_TYPE.TERMS_CONDITIONS_DATA_FAIL,
        payload: error,
      });
    }
  };
}

/**API to get Privacy Policy details */
export function getPrivacyPolicyData() {
  console.log("getPrivacyPolicyData");
  return async (dispatch) => {
    dispatch({ type: ACTION_TYPE.PRIVACY_POLICY_DATA_REQUEST });
    try {
      let json = await MSRestClient.getCall(
        MASTER_MS_URL + MS_Endpoints.GET_PRIVACY_POLICY_DETAILS
      );
      if (json.status === 200) {
        dispatch({
          type: ACTION_TYPE.PRIVACY_POLICY_DATA_SUCCESS,
          payload: json.res,
        });
      } else {
        if (json.code == FAILURE) {
          toast(json.message);
        }
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

export const getIpAdressFromApi = () => {
  return async (dispatch) => {
    let response = await fetch("https://ipinfo.io/json?token=a775e6c7385b2b");
    let json = await response.json();
    dispatch({
      type: ACTION_TYPE.SAVE_DEVICE_IP_ADRESS,
      payload: json,
    });
    console.log("get IP:--", json);
  };
};
