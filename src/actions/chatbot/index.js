import {
  navigatorPush,
  navigatorPop,
  navigatorPopRoot,
} from "@config/navigationOptions";
import GLOBALS from "@constants";
import { Alert } from "react-native";
import RestClient from "@helpers/RestClient";
import { toast } from "@helpers/common";
import * as AppActions from "@actions";
import CryptoJS from "react-native-crypto-js";
import momentZone from "moment-timezone";
import moment from "moment";
import * as Images from "@images";
const {
  ACTION_TYPE,
  URL,
  STRINGS,
  NETWORK_STATUS,
  USER_MS_URL,
  MS_Endpoints,
  PRODUCT_MS_URL,
} = GLOBALS;

const { TRY_AGAIN, CHECK_NETWORK } = STRINGS;
const { SUCCESS, FAILURE, SESSION_ERROR } = NETWORK_STATUS;
import MSRestClient from "@helpers/MSRestClient";
import DeviceInfo from "react-native-device-info";
import { getIPAdreessData } from "@helpers/common";

/**Set Chat array */
export function chatArray(msg) {
  return async (dispatch) => {
    dispatch({
      type: ACTION_TYPE.BOT_MESSAGES,
      payload: msg,
    });
  };
}
/**Check bot status when tracker added */
export function checkBotStatus(data) {
  return async (dispatch, getState) => {
    try {
      let json = await RestClient.postCall(URL.CHAT_BOT_STATUS, data.param);
      if (json.code == SUCCESS) {
        dispatch({
          type: ACTION_TYPE.BOT_STATUS,
          payload: json.data,
        });
        if (json.data.chatBotOpen == true) {
          dispatch(
            openChatBot(
              {
                componentId: data.componentId,
                param: {
                  user_id: data.param.user_id,
                  tracker: json.data.tracker,
                  answer: "start",
                },
              },
              "open_chat"
            )
          );
        } else {
          if (
            data.param.tracker == "sleep" ||
            data.param.tracker == "activity"
          ) {
            navigatorPop({ componentId: data.componentId });
          }
        }
        // let loginData = getState().authReducer.loginData;
        // loginData = Object.assign({}, loginData, {
        //   user: json.data,
        // });
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
      }
      dispatch({ type: ACTION_TYPE.API_SUCCESS });
    } catch (error) {
      dispatch({ type: ACTION_TYPE.API_SUCCESS });
    }
  };
}

/**Check bot status when tracker added */
export function openChatBot(data, type) {
  return async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPE.LOGIN_REQUEST });
    try {
      let json = await RestClient.postCall(URL.CHAT_BOT_OPEN, data.param);
      if (json.code == SUCCESS) {
        Promise.resolve(
          dispatch({
            type: ACTION_TYPE.BOT_WELCOME,
            payload: json.data,
          })
        );

        console.log("enter iffff11", data, type);
        if (type == "open_chat") {
          console.log("enter iffff", data);

          navigatorPush({
            componentId: data.componentId,
            screenName: "Chatbot",
          });
        }

        // let loginData = getState().authReducer.loginData;
        // loginData = Object.assign({}, loginData, {
        //   user: json.data,
        // });
        // dispatch({
        //   type: ACTION_TYPE.LOGIN_SUCCESS,
        //   payload: loginData,
        // });
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
      }
      dispatch({ type: ACTION_TYPE.API_SUCCESS });
    } catch (error) {
      dispatch({ type: ACTION_TYPE.API_SUCCESS });
    }
  };
}

/**API for managing chatbot */
export function manageChatbot(
  data,
  prgName = "fertilift",
  showLoader = true,
  componentId,
  insideChat = true
) {
  console.log("here===>Chatbot call=====>");
  return async (dispatch, getState) => {
    if (showLoader) {
      dispatch({ type: ACTION_TYPE.LOGIN_REQUEST });
    }
    try {
      let activeProgData = getState().programReducer.activeProgramDetail;
      prgName = activeProgData.name.toLowerCase();
      let json = await MSRestClient.postCall(
        `${USER_MS_URL}${MS_Endpoints.CHATBOT}${prgName}`,
        data
      );
      if (json.data.status == SUCCESS) {
        /**Check if Chatbot has question and calling outside */
        if (!insideChat) {
          console.log("out side chat");
          /**Move to chatbot screen */
          if (json.data.res && json.data?.res.question) {
            Promise.resolve(
              dispatch({
                type: ACTION_TYPE.BOT_WELCOME,
                payload: json.data.res,
              })
            );
            navigatorPush({
              componentId: componentId,
              screenName: "Chatbot",
            });
          }
        }
        /**Check if Chatbot has no question and calling inside */
        if (insideChat) {
          console.log("inside side chat");
          if (
            json.data.res &&
            json.data?.res?.event &&
            Object.keys(json.data?.res?.event).length != 0
          ) {
            dispatch(switchToCardsFromBot(json.data?.res?.event, componentId));
            Promise.resolve(
              dispatch({
                type: ACTION_TYPE.BOT_WELCOME,
                payload: {},
              })
            );
          } else {
            Promise.resolve(
              dispatch({
                type: ACTION_TYPE.BOT_WELCOME,
                payload: json.data.res,
              })
            );
            // navigatorPush({
            //     componentId: componentId,
            //     screenName: "Chatbot",
            // })
          }

          // try {
          //     let json = await MSRestClient.postCall(
          //         `${USER_MS_URL}${MS_Endpoints.CHATBOT}${prgName}`,
          //         data
          //     );
          //     console.log("manageChatbot...", json, data);
          //     if (json.data.status == SUCCESS) {
          //         Promise.resolve(
          //             dispatch({
          //                 type: ACTION_TYPE.BOT_WELCOME,
          //                 payload: json.data.res,
          //             })
          //         );
          //         /**Check if Chatbot is calling outside from cards or dashboard*/
          //         if (!insideChat) {
          //             /**Move to chatbot screen if no event is there*/
          //             if (
          //                 json.data.res &&
          //                 json.data?.res?.event &&
          //                 Object.keys(json.data?.res?.event).length === 0
          //             ) {
          //                 navigatorPush({
          //                     componentId: componentId,
          //                     screenName: "Chatbot",
          //                 });
          //             }
          //         }
          //         /**Check if Chatbot has no question and calling inside */
          //         if (insideChat) {
          //             if (json.data.res && json.data?.res?.event) {
          //                 navigatorPop({ componentId: componentId });
          //             }
          //         }

          //         /**Check if Chatbot has to close question */
          //         // if (json.data.res && json.data?.res?.event) {
          //         //     if (json.data.res.event.isEnd == true) {
          //         //         navigatorPop({ componentId: componentId });
          //         //     }
          //         // }

          //         // navigatorPush({
          //         //     componentId: componentId,
          //         //     screenName: "Chatbot",
          //         // })
          //         // if (json.data.res && json.data?.res?.event) {
          //         //     if (json.data.res.event.isEnd == true) {
          //         //         navigatorPush({
          //         //             componentId: componentId,
          //         //             screenName: "Chatbot",
          //         //         })
          //         //     }
          //         // }
          //     }
          //     dispatch({ type: ACTION_TYPE.API_SUCCESS });
          // } catch (error) {
          //     console.log('Program Track Error..', error)
          //     dispatch({ type: ACTION_TYPE.API_SUCCESS });
          // }
        }
        let stage = getState().programReducer.selectedProgram.stage;
        if (stage == null) {
          param = {
            progId: getState().programReducer.selectedProgram._id,
            currentWeek: getState().cardsReducer.currentCard.week,
            currentDay: getState().cardsReducer.currentCard.day,
            totalWeek: getState().programReducer.selectedProgram.totalWeeks,
            totalDay: getState().programReducer.selectedProgram.totalDays,
            progName: getState().programReducer.activeProgramDetail.name,
          };
        } else if (
          getState().programReducer.selectedProgram._id ==
          getState().programReducer.selectedProgram._id
          // getState().programReducer.activeProgramDetail.progId
        ) {
          /**Active and current program matches */
          // param = {
          //     progId: getState().programReducer.activeProgramDetail.progId,
          //     totalStage: stage,
          //     currentStage: getState().cardsReducer.currentCard.stage,
          //     progName: getState().programReducer.activeProgramDetail.progName,
          //     currentStageName: getState().programReducer.selectedProgram.name,
          //     stageName: getState().programReducer.activeProgramDetail.stageName,
          // };
          param = {
            progId: getState().programReducer.activeProgramDetail._id,
            userId: getState().authReducer.loginData.profile._id,
            cardId: getState().cardsReducer.currentCard._id,
            progName: getState().programReducer.activeProgramDetail.name,
            cardTitle: getState().cardsReducer.currentCard.title,
            cardNumber: getState().cardsReducer.currentCard.cardNumber,
            isAction: getState().cardsReducer.currentCard?.action
              ? true
              : false,
            day: !getState().cardsReducer.currentCard.stage
              ? getState().cardsReducer.currentCard.selected_day
              : null,
            week: !getState().cardsReducer.currentCard.stage
              ? getState().cardsReducer.currentCard.selected_week
              : null,
            stage: getState().cardsReducer.currentCard.stage,
            progType: getState().programReducer.activeProgramDetail.progType,
            section: "",
            isLastCard: true,
            cardReadOn: new Date(),
            deviceDetails: {
              deviceType: DeviceInfo.getSystemName(),
              deviceName: DeviceInfo.getBrand(),
              systemVersion: DeviceInfo.getModel(),
              ...getIPAdreessData(),
            },
          };
          console.log("matches2222...", param);
        }
        try {
          // console.log(
          //   "API call==>----222",
          //   PRODUCT_MS_URL + MS_Endpoints.PROGRAM_TRACK,
          //   param
          // );
          // let json = await MSRestClient.postCall(
          //   PRODUCT_MS_URL + MS_Endpoints.PROGRAM_TRACK,
          //   param
          // );

          console.log("Program Trrack Status..222", json);
        } catch (error) {
          console.log("Program Track Error..", error);
        }
        dispatch({ type: ACTION_TYPE.API_SUCCESS });
      }
    } catch (error) {
      dispatch({ type: ACTION_TYPE.API_SUCCESS });
    }
  };
}

export function switchToCardsFromBot(param, componentId) {
  return async (dispatch, getState) => {
    let activeProgData = getState().programReducer.activeProgramDetail;
    let stage = getState().programReducer.ActiveStage;
    let curruntStage = getState().cardsReducer.currentCard.stage;
    console.log(param, componentId, "param, componentId", activeProgData);
    let data = {
      programId: activeProgData._id,
      week: parseInt(param.stage),
      day: parseInt(param.stage),
      // stage: param.stage,
      stage: parseInt(param.stage),
      stageDay: parseInt(param.stage),
    };
    dispatch({
      type: ACTION_TYPE.SET_ACTIVE_STAGE,
      payload: param.stage,
    });

    // let pass_param = {
    //     progId: activeProgData.progId,
    //     totalStage: getState().programReducer.activeProgramDetail.totalStage,
    //     currentStage: param.stage,
    //     progName: getState().programReducer.activeProgramDetail.progName,
    //     stageName: getState().programReducer.activeProgramDetail.stageName
    // };
    const params = {
      progId: getState().programReducer.activeProgramDetail._id,
      userId: getState().authReducer.loginData.profile._id,
      cardId: getState().cardsReducer.currentCard._id,
      progName: getState().programReducer.activeProgramDetail.name,
      cardTitle: getState().cardsReducer.currentCard.title,
      cardNumber: getState().cardsReducer.currentCard.cardNumber,
      isAction: getState().cardsReducer.currentCard?.action ? true : false,
      day: !getState().cardsReducer.currentCard.stage
        ? getState().cardsReducer.currentCard.selected_day
        : null,
      week: !getState().cardsReducer.currentCard.stage
        ? getState().cardsReducer.currentCard.selected_week
        : null,
      stage: getState().cardsReducer.currentCard.stage,
      progType: getState().programReducer.activeProgramDetail.progType,
      section: "",
      isLastCard: true,
      cardReadOn: new Date(),
      deviceDetails: {
        deviceType: DeviceInfo.getSystemName(),
        deviceName: DeviceInfo.getBrand(),
        systemVersion: DeviceInfo.getModel(),
        ...getIPAdreessData(),
      },
    };
    /**Update the current stage  from Bot in program track*/
    // dispatch(postProgramTrack(params))
    dispatch(
      AppActions.getCardsList(data, 0, (res) => {
        if (res.length == 0) {
          alert(strings.Content_not_available);
          return;
        }
        navigatorPush({
          componentId,
          screenName: "WeekInfoList",
          passProps: {
            week: parseInt(param.stage),
            day: parseInt(param.stage),
            stageName:
              // activeProgData.stageName[parseInt(curruntStage) - 1].name,
              activeProgData.stageName[curruntStage ? curruntStage - 1 : 1]
                .name,
            type: "chatBot",
          },
        });
      })
    );
  };
}

/**Track the Program Status */
export function postProgramTrack(param, componentId) {
  return async (dispatch, getState) => {
    console.log(param, "param..............");
    try {
      let json = await MSRestClient.postCall(
        PRODUCT_MS_URL + MS_Endpoints.PROGRAM_TRACK,
        param
      );
      console.log("Program Trrack Status..", json);
    } catch (error) {
      console.log("Program Track Error..", error);
    }
  };
}
