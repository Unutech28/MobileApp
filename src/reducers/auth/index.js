/* eslint-disable module-resolver/use-alias */
import GLOBALS from "@constants";
let { STRINGS } = GLOBALS;

const GetWelcomeData = {
  isWelcomSuccess: false,
  getWelcomeData: null,
};

const INITIAL_STATE = {
  isLoggedIn: false,
  currentScreen: 0,
  isLoading: false,
  loginData: null,
  fcmDeviceToken: "null",
  loginToken: null,
  language: "en",
  is_remember: false,
  remember_password: "",
  remember_email: "",
  isTermsLoading: false,
  termsData: null,
  isPolicyLoading: false,
  policyData: null,
  primary: "#6545B2",
  deviceIpAddressInfo: {},
  isChatbot: true,
};
const { ACTION_TYPE } = GLOBALS;
function authReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case ACTION_TYPE.SET_FCM_DEVICE_TOKEN:
      return Object.assign({}, state, {
        fcmDeviceToken: action.payload,
      });
    case ACTION_TYPE.SAVE_DEVICE_IP_ADRESS:
      return Object.assign({}, state, {
        deviceIpAddressInfo: action.payload,
      });
    case ACTION_TYPE.SET_LANGUAGE:
      return Object.assign({}, state, {
        language: action.payload,
      });
    case ACTION_TYPE.LOGIN_REQUEST:
      return Object.assign({}, state, {
        isLoading: true,
      });
    case ACTION_TYPE.SHOW_LOADER:
      return Object.assign({}, state, {
        isLoading: true,
      });
    case ACTION_TYPE.API_SUCCESS:
      return Object.assign({}, state, {
        isLoading: false,
      });

    case ACTION_TYPE.LOGIN_RESET /* RESET LOGIN */:
      return Object.assign({}, state, {
        isLoading: false,
        isLoggedIn: false,
        loginData: null,
        loginToken: null,
        currentScreen: 0,
      });

    case ACTION_TYPE.LOGIN_SUCCESS:
      return Object.assign({}, state, {
        isLoading: false,
        isLoggedIn: false,
        loginData: action.payload,
        loginToken: action.payload.token,
        // currentScreen: 2,
      });
    case ACTION_TYPE.LOGIN_TOKEN:
      return Object.assign({}, state, {
        loginToken: action.payload,
      });

    case ACTION_TYPE.CURRENT_SCREEN:
      return Object.assign({}, state, {
        currentScreen: action.payload,
      });

    case ACTION_TYPE.EXIT_APPLICATION:
      return Object.assign({}, state, {
        isLoggedIn: false,
        isExitApp: true,
      });

    //

    case ACTION_TYPE.LOGIN_FAIL:
      return Object.assign({}, state, {
        isLoading: false,
        isLoggedIn: false,
        loginData: null,
        loginToken: null,
        currentScreen: 0,
      });

    case ACTION_TYPE.LOGOUT:
      return Object.assign({}, state, {
        isLoggedIn: false,
        // loginData: null,
        isLoading: false,
        currentScreen: 0,
      });

    case ACTION_TYPE.WELCOME_DATA_SUCCESS:
      return Object.assign({}, state, {
        ...GetWelcomeData,
        isWelcomSuccess: true,
        getWelcomeData: action.payload,
        isLoggedIn: false,
        currentScreen: 2,
      });

    case ACTION_TYPE.WELCOME_DATA_FAIL:
      return Object.assign({}, state, {
        getWelcomeData: action.payload,
        currentScreen: 2,
      });

    // case ACTION_TYPE.LOGOUT:
    //   return Object.assign({}, state, {
    //     INITIAL_STATE
    //   })

    case ACTION_TYPE.CLEAR_STATE:
      return Object.assign({}, state, {
        isLoggedIn: false,
        currentScreen: 0,
        isLoading: false,
        loginData: null,
        fcmDeviceToken: "null",
        loginToken: null,
        isTermsLoading: false,
        termsData: null,
        isPolicyLoading: false,
        policyData: null,
        primary: "#6545B2",
      });
    case ACTION_TYPE.STORE_USER_DATA:
      return Object.assign({}, state, {
        loginData: { ...state.loginData, user: action.payload },
      });
    case ACTION_TYPE.SET_REMEMBER_ME:
      return Object.assign({}, state, {
        is_remember: action.payload.is_remember,
        remember_password: action.payload.remember_password,
        remember_email: action.payload.remember_email,
      });

    case ACTION_TYPE.TERMS_CONDITIONS_DATA_REQUEST:
      return Object.assign({}, state, {
        isTermsLoading: true,
      });

    case ACTION_TYPE.TERMS_CONDITIONS_DATA_SUCCESS:
      return Object.assign({}, state, {
        isTermsLoading: false,
        termsData: action.payload,
      });

    case ACTION_TYPE.TERMS_CONDITIONS_DATA_FAIL:
      return Object.assign({}, state, {
        isTermsLoading: false,
        termsData: null,
      });

    case ACTION_TYPE.PRIVACY_POLICY_DATA_REQUEST:
      return Object.assign({}, state, {
        isPolicyLoading: true,
      });

    case ACTION_TYPE.PRIVACY_POLICY_DATA_SUCCESS:
      return Object.assign({}, state, {
        isPolicyLoading: false,
        policyData: action.payload,
      });

    case ACTION_TYPE.PRIVACY_POLICY_DATA_FAIL:
      return Object.assign({}, state, {
        isPolicyLoading: false,
        policyData: null,
      });
    case ACTION_TYPE.SET_THEME:
      return Object.assign({}, state, {
        ...action.payload,
      });
    case ACTION_TYPE.SET_CHATBOT_STATUS:
      return Object.assign({}, state, {
        isChatbot: action.payload,
      });

    default:
      return state;
  }
}
export default authReducer;
