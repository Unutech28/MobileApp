import GLOBALS from "@constants";
import { Alert } from "react-native";
import RestClient from "@helpers/RestClient";
import * as AppActions from "@actions";
import NetInfo from "@react-native-community/netinfo";
import Strings from "../../constants/Strings";
import { alertWithOneBtn } from "@helpers/common";
import { strings } from "@localization";
import {
  navigatorPush,
  navigatorPop,
  navigatorPopRoot,
} from "@config/navigationOptions";
const {
  ACTION_TYPE,
  URL,
  STRINGS,
  NETWORK_STATUS,
  PRODUCT_MS_URL,
  MS_Endpoints,
} = GLOBALS;
const { SUCCESS, SESSION_ERROR } = NETWORK_STATUS;
import { checkNextDayUnlocked } from "@components/dashboard/dailyLearningTemplates/utilities";
import { toast } from "@helpers/common";
import MSRestClient from "@helpers/MSRestClient";

/**API to get Cards  List */
export function getCardsList(data, card_index = 0, cb, section = "") {
  console.log("data Stages==>", data);
  return async (dispatch, getState) => {
    let limit = getState().cardsReducer.cardsLimit;
    let LastCardRead = getState().cardsReducer.Last_card_read;
    if (data?.stageDay == parseInt(LastCardRead?.stage)) {
      limit = limit + parseInt(LastCardRead?.cardNumber);
      card_index = parseInt(LastCardRead?.cardNumber);
    }
    dispatch({ type: ACTION_TYPE.LOGIN_REQUEST });
    try {
      let query_string = data?.careConcern
        ? data?.careConcern
        : !data.stage
        ? `?week=${data.week}&day=${data.day}`
        : data.stageDay
        ? `?stage=${data.stageDay}&section=${section}`
        : `?stage=${data.day}&section=${section}`;
      let json = await MSRestClient.getCall(
        `${PRODUCT_MS_URL}${MS_Endpoints.CARD_LIST}${data.programId}${query_string}&sort_val=cardNumber&sort_dir=1&limit=${limit}`
      );
      // let json = await MSRestClient.getCall(
      //   `${PRODUCT_MS_URL}${MS_Endpoints.CARD_LIST}638da961303e0d003eca9e86?careConcerns=1`
      // );
      let current_cards_data = getState().cardsReducer.all_cards;
      if (json.status === SUCCESS) {
        if (json.res.data.length == 0) {
          alert(strings.Content_not_available);
          dispatch({
            type: ACTION_TYPE.API_SUCCESS,
          });
          return;
        }
        let array_index = `${data.week}${data.day}`;
        current_cards_data = Object.assign({}, current_cards_data, {
          [array_index]: json.res.data,
        });
        console.log("get card ress===>", json.res);
        /**Action to set all cards data cards */
        dispatch({
          type: ACTION_TYPE.SET_CARD_DATA,
          payload: {
            all_cards: current_cards_data,
            imgBp: json.res.imgBp,
            thumbnailBp: json.res.thumbnailBp,
            videoBp: json.res.videoBp,
            audioBp: json.res.audioBp,
          },
        });
        //  }
        /**Action to set all cards data cards */
        // dispatch({
        //   type: ACTION_TYPE.SET_CARD_DATA,
        //   // payload: current_cards_data,
        //   payload: {
        //     all_cards: current_cards_data,
        //     imgBp: json.res.imgBp,
        //   },
        // });
        /**Action to set selected current week day data cards, current index */

        if (json.res.data.length > card_index) {
          dispatch({
            type: ACTION_TYPE.SET_CURRENT_CARD,
            payload: json.res.data[card_index],
          });
          dispatch({
            type: ACTION_TYPE.SET_CARD_INDEX,
            payload: {
              total_cards: json.res.data.length - 1,
              current_card: card_index,
            },
          });
        } else {
          dispatch({
            type: ACTION_TYPE.SET_CURRENT_CARD,
            payload: json.res.data[0],
          });
          dispatch({
            type: ACTION_TYPE.SET_CARD_INDEX,
            payload: {
              total_cards: json.res.data.length - 1,
              current_card: 0,
            },
          });
        }
        dispatch({
          type: ACTION_TYPE.SET_SELECTED_WEEK_DAY,
          payload: { selected_day: data.day, selected_week: data.week },
        });

        dispatch({
          type: ACTION_TYPE.SET_CURRUNT_CARD_INDEX,
          payload: json.res?.total,
        });
        cb(json.res.data);
      }

      dispatch({
        type: ACTION_TYPE.API_SUCCESS,
      });
    } catch (error) {
      console.log("Error===>", error);
      dispatch({
        type: ACTION_TYPE.API_SUCCESS,
      });
      dispatch(AppActions.handleResponseError(error));
    }
  };
}

// get card for  pagination

export function getCardsListAccrodingtoLimit(data, card_index = 0, cb) {
  console.log("data Stages==>", data);
  return async (dispatch, getState) => {
    let limit = getState().cardsReducer.cardsLimit;
    let curruntCardNumber = getState().cardsReducer.current_card;
    console.log("dvndsfbvvansh===>", curruntCardNumber);
    dispatch({ type: ACTION_TYPE.LOGIN_REQUEST });
    try {
      let query_string = data?.careConcern
        ? data?.careConcern
        : !data.stage
        ? `?week=${data.week}&day=${data.day}`
        : data.stageDay
        ? `?stage=${data.stageDay}`
        : `?stage=${data.day}`;
      let json = await MSRestClient.getCall(
        `${PRODUCT_MS_URL}${MS_Endpoints.CARD_LIST}${data.programId}${query_string}&sort_val=cardNumber&sort_dir=1&limit=${limit}`
      );

      let current_cards_data = getState().cardsReducer.all_cards;
      // let curruntCardNumber = getState().cardsReducer.currentCard.current_card;
      if (json.status === SUCCESS) {
        let array_index = `${data.week}${data.day}`;
        current_cards_data = Object.assign({}, current_cards_data, {
          [array_index]: json.res.data,
        });
        console.log("get card ress===>", json.res, curruntCardNumber);
        /**Action to set all cards data cards */
        dispatch({
          type: ACTION_TYPE.SET_CARD_DATA,
          payload: {
            all_cards: current_cards_data,
            imgBp: json.res.imgBp,
            thumbnailBp: json.res.thumbnailBp,
            videoBp: json.res.videoBp,
            audioBp: json.res.audioBp,
          },
        });
        /**Action to set selected current week day data cards, current index */
        dispatch({
          type: ACTION_TYPE.SET_SELECTED_WEEK_DAY,
          payload: { selected_day: data.day, selected_week: data.week },
        });
        dispatch({
          type: ACTION_TYPE.SET_CURRENT_CARD,
          payload: json.res.data[curruntCardNumber + 1],
        });
        dispatch({
          type: ACTION_TYPE.SET_CARD_INDEX,
          payload: {
            total_cards: json.res.data.length - 1,
            current_card: curruntCardNumber + 1,
          },
        });
        cb(json.res.data);
      }

      dispatch({
        type: ACTION_TYPE.API_SUCCESS,
      });
    } catch (error) {
      console.log("Error===>", error);
      dispatch({
        type: ACTION_TYPE.API_SUCCESS,
      });
      dispatch(AppActions.handleResponseError(error));
    }
  };
}

export function getLikeCardsList(cb) {
  // console.log("data Stages==>", data);
  return async (dispatch, getState) => {
    let ProgId = getState().programReducer.selectedProgram._id;
    dispatch({ type: ACTION_TYPE.LOGIN_REQUEST });
    try {
      let json = await MSRestClient.getCall(
        `${PRODUCT_MS_URL}${MS_Endpoints.LIKE_CARDS}${ProgId}`
      );
      dispatch({
        type: ACTION_TYPE.API_SUCCESS,
      });
      if (json.status === SUCCESS) {
        console.log("get card ress===>", json.res);
        /**Action to set all cards data cards */

        if (json.res.length == 0) {
          cb(false);
          alertWithOneBtn(
            "",
            strings.cards.no_like_card,
            GLOBALS.STRINGS.LOGOUT_OK
          );
        } else {
          cb(true);
          dispatch({
            type: ACTION_TYPE.SET_LIKE_CARD_DATA,
            payload: json.res,
          });
          dispatch({
            type: ACTION_TYPE.SET_CURRENT_CARD,
            payload: json.res[0],
          });
          // dispatch({
          //   type: ACTION_TYPE.SET_CURRENT_CARD,
          //   payload: json.res[0],
          // });
        }
      }

      dispatch({
        type: ACTION_TYPE.API_SUCCESS,
      });
    } catch (error) {
      console.log("Error===>", error);
      dispatch({
        type: ACTION_TYPE.API_SUCCESS,
      });
      dispatch(AppActions.handleResponseError(error));
    }
  };
}

export function getcardDataforTemplate22List(cardId, cardNumber) {
  return async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPE.LOGIN_REQUEST });
    try {
      let json = await MSRestClient.getCall(
        `${PRODUCT_MS_URL}${URL.GET_CARD_DATA}${cardId}`
      );
      dispatch({
        type: ACTION_TYPE.API_SUCCESS,
      });
      if (json.status === SUCCESS) {
        console.log("get card ress===>", json.res);
        /**Action to set all cards data cards */
        return json.res;
      }
    } catch (error) {
      console.log("Error===>", error);
      dispatch({
        type: ACTION_TYPE.API_SUCCESS,
      });
      dispatch(AppActions.handleResponseError(error));
    }
  };
}

/**Perform action on card like add comment, like, save question */
export function userActionCard(data, msg = "", type = "learning") {
  return async (dispatch, getState) => {
    let prgId = getState().programReducer?.activeProgramDetail._id
      ? getState().programReducer?.activeProgramDetail._id
      : getState().authReducer.loginData.profile?.activatedProg._id;
    // console.log("here==>2222", { ...data, progId: prgId });
    dispatch({ type: ACTION_TYPE.SHOW_LOADER });
    try {
      let json = await MSRestClient.postCall(
        `${PRODUCT_MS_URL}${MS_Endpoints.CARD_ACTION}`,
        { ...data, progId: prgId }
      );
      dispatch(getSingleCardData(data.cardId));
      dispatch({ type: ACTION_TYPE.API_SUCCESS });
      // toast(json.data.res.msg)
      if (msg) {
        // toast(msg);
      }
    } catch (error) {
      dispatch({ type: ACTION_TYPE.API_SUCCESS });
    }
  };
}

//** set card limit for get cards  */
export function setCardLimit(limit) {
  console.log("here lomit===>", limit);
  return async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPE.SET_CARD_LIMIT, payload: limit });
  };
}

/**Get detail of one card  */
export function getSingleCardData(card_id, type = "learning") {
  return async (dispatch, getState) => {
    try {
      let json = await MSRestClient.getCall(
        `${PRODUCT_MS_URL}${MS_Endpoints.CART_DATA}${card_id}`
      );
      if (type == "learning" && json.res) {
        dispatch(updateCardState(json.res));
      }
      dispatch({ type: ACTION_TYPE.API_SUCCESS });
    } catch (error) {
      dispatch({ type: ACTION_TYPE.API_SUCCESS });
    }
  };
}

/**Function to update current card and  all cards array with modified card object in reducer */
export function updateCardState(modifiedCard) {
  return async (dispatch, getState) => {
    let allCardsData = getState().cardsReducer.all_cards;
    let getSpecificaDayCardData =
      getState().cardsReducer.all_cards[
        `${getState().cardsReducer.selected_week}${
          getState().cardsReducer.selected_day
        }`
      ];
    let all_dayCards = getSpecificaDayCardData;
    let changedIndexId = all_dayCards.findIndex(
      (x) => x._id === modifiedCard._id
    );
    all_dayCards = Object.assign([], all_dayCards, {
      [changedIndexId]: modifiedCard,
    });

    allCardsData = Object.assign(allCardsData, {
      [`${getState().cardsReducer.selected_week}${
        getState().cardsReducer.selected_day
      }`]: all_dayCards,
    });
    dispatch({
      type: ACTION_TYPE.SET_CARD_DATA,
      payload: {
        all_cards: allCardsData,
      },
    });
    dispatch({
      type: ACTION_TYPE.SET_CURRENT_CARD,
      payload: modifiedCard,
    });
  };
}

/**Updated the selected week day whose cards user are seeing */
export function updateSelectedWeekDay(data) {
  return async (dispatch) => {
    dispatch({
      type: ACTION_TYPE.SET_SELECTED_WEEK_DAY,
      payload: { selected_day: data.day, selected_week: data.week },
    });
  };
}

/**Set step count for Multi step question card */
export function setCardStep(step) {
  return async (dispatch) => {
    dispatch({
      type: ACTION_TYPE.UPDATE_STEP_QUES,
      payload: step,
    });
  };
}

/**Set step count for Multi step question card for templatw 12*/
export function setCardStepFor12(step) {
  return async (dispatch) => {
    dispatch({
      type: ACTION_TYPE.UPADTE_STEP_QUE_FOR_TEM_12,
      payload: step,
    });
  };
}

/**Set data current card data of selected week day */
export function setCurrentCard(data) {
  return async (dispatch) => {
    dispatch({
      type: ACTION_TYPE.SET_CURRENT_CARD,
      payload: data,
    });
  };
}

/**Show comments data of the specific card */
export function setCommentsArray(data) {
  return async (dispatch) => {
    dispatch({
      type: ACTION_TYPE.SET_COMMENT_DATA,
      payload: { comments: data },
    });
  };
}

/**Like Card Actions */
export function updateLikeIndex(index) {
  return async (dispatch) => {
    dispatch({
      type: ACTION_TYPE.SET_LIKE_INDEX,
      payload: index,
    });
  };
}

/**Update user current card */
export function updateCurrentCard(data) {
  return async (dispatch) => {
    dispatch({
      type: ACTION_TYPE.SET_CURRENT_CARD,
      payload: data,
    });
  };
}

/**Check if internet is connected */
async function isConnected() {
  await NetInfo.isConnected.fetch().then((isConnected) => {
    if (isConnected) {
    } else {
      alert(Strings.server_is_not_reachable);
      return;
    }
  });
}
/**On swipe call API for new day data and update state management */
export function chageSwipeCardData(data = {}) {
  return async (dispatch, getState) => {
    let postData = { ...data };
    dispatch(
      getCardsListAccrodingtoLimit(postData, 0, (res) => {
        if (res.length == 0) {
          alert(strings.Content_not_available);
          return;
        }
        let current_cards_data = getState().cardsReducer.all_cards;
        let array_index = `${getState().cardsReducer.selected_week}${
          getState().cardsReducer.selected_day
        }`;
        dispatch({
          type: ACTION_TYPE.UPDATE_LEARNING_DATA,
          payload: {
            total_cards: getState().cardsReducer.total_cards,
            current_card: getState().cardsReducer.current_card,
            selected_day: getState().cardsReducer.selected_day,
            selected_week: getState().cardsReducer.selected_week,
            currentCard:
              current_cards_data[array_index][
                getState().cardsReducer.current_card
              ],
            currentStage: getState().cardsReducer.currentCard.stage,
          },
        });
      })
    );
  };
}
/**Check if second last card readed on last last readed. Handle card swiping
 * If second last then we are unlocking else we are hitting points API
 */
export function changeCardData(type = "next", componentId, isChatBot, cb) {
  console.log("gererererere ");
  return async (dispatch, getState) => {
    let total_days = getState().programReducer.selectedProgram?.totalDays;
    let programName = getState().programReducer.selectedProgram?.name;
    let totalCard = getState().cardsReducer.total_cards - 5;
    let crrrentCard = getState().cardsReducer.current_card;
    let crrrentStage = getState().cardsReducer.currentCard.stage;
    let limit = getState().cardsReducer.cardsLimit;
    dispatch(markDayComplete(programName, componentId));

    /**Check if cards  exist in current day*/
    if (totalCard == crrrentCard && type === "next") {
      dispatch(setCardLimit(limit + 20));
      let data = crrrentStage
        ? {
            programId: getState().programReducer.selectedProgram?._id
              ? getState().programReducer.selectedProgram._id
              : getState().authReducer.loginData?.profile?.activatedProg._id,
            week: null,
            day: null,
            stage: crrrentStage ? crrrentStage : null,
            stageDay: crrrentStage ? crrrentStage : 1,
            // stageDay: parseInt(getState().programReducer?.ActiveStage)
            //   ? parseInt(getState().programReducer?.ActiveStage)
            //   : 1,
          }
        : {
            programId: getState().programReducer.selectedProgram?._id
              ? getState().programReducer.selectedProgram._id
              : getState().authReducer.loginData?.profile?.activatedProg._id,
            week: parseInt(
              getState().programReducer.activeProgramDetail?.currentWeek
                ? getState().programReducer.activeProgramDetail?.currentWeek
                : null
            ),
            day: parseInt(
              getState().programReducer.activeProgramDetail?.currentDay
                ? getState().programReducer.activeProgramDetail?.currentDay
                : null
            ),
            stage: crrrentStage ? crrrentStage : null,
            stageDay: crrrentStage ? crrrentStage : 1,
          };
      dispatch(chageSwipeCardData(data));
    }
    if (
      getState().cardsReducer.total_cards >
        getState().cardsReducer.current_card &&
      type == "next"
    ) {
      let current_cards_data = getState().cardsReducer.all_cards;
      let array_index = `${getState().cardsReducer.selected_week}${
        getState().cardsReducer.selected_day
      }`;
      dispatch({
        type: ACTION_TYPE.UPDATE_LEARNING_DATA,
        payload: {
          current_card: getState().cardsReducer.current_card + 1,
          currentCard:
            current_cards_data[array_index][
              getState().cardsReducer.current_card + 1
            ],
        },
      });

      dispatch(markDayComplete(programName, componentId));
      /**Call function to mark read the card which loads */
    } else if (getState().cardsReducer.current_card > 0 && type == "back") {
      /**When use swipe back inbetween exisitng day week cards */
      let current_cards_data = getState().cardsReducer.all_cards;
      let array_index = `${getState().cardsReducer.selected_week}${
        getState().cardsReducer.selected_day
      }`;

      dispatch({
        type: ACTION_TYPE.UPDATE_LEARNING_DATA,
        payload: {
          current_card: getState().cardsReducer.current_card - 1,
          currentCard:
            current_cards_data[array_index][
              getState().cardsReducer.current_card - 1
            ],
        },
      });
    } else if (getState().cardsReducer.current_card == 0 && type == "back") {
      /**On swipe back on card 0 */
      /***If current day is greater than 1 then user swipe back then keep week and reduce day ***/
      if (getState().cardsReducer.selected_day > 1) {
        let current_cards_data = getState().cardsReducer.all_cards;
        let array_index = `${getState().cardsReducer.selected_week}${
          getState().cardsReducer.selected_day - 1
        }`;
        if (current_cards_data[array_index] == undefined) {
          let postData = {
            week: getState().cardsReducer.selected_week,
            day: getState().cardsReducer.selected_day - 1,
            stage: getState().programReducer.selectedProgram.stage,
            programId: getState().programReducer.selectedProgram._id,
          };
          dispatch(chageSwipeCardData(postData));
        } else {
          dispatch({
            type: ACTION_TYPE.UPDATE_LEARNING_DATA,
            payload: {
              total_cards: current_cards_data[array_index].length - 1,
              current_card: 0,
              selected_day: getState().cardsReducer.selected_day - 1,
              currentCard:
                current_cards_data[array_index].cards[
                  getState().cardsReducer.current_card
                ],
            },
          });
        }
      } else if (
        /***If current day is  1 then user swipe back change to previous week set week to -1 and day to 7***/
        getState().cardsReducer.selected_day == 1 &&
        getState().cardsReducer.selected_week > 1
      ) {
        if (getState().cardsReducer.selected_week > 1) {
          let current_cards_data = getState().cardsReducer.all_cards;
          let array_index = `${
            getState().cardsReducer.selected_week - 1
          }${total_days}`;
          if (current_cards_data[array_index] == undefined) {
            let postData = {
              week: getState().cardsReducer.selected_week - 1,
              day: total_days,
              stage: getState().programReducer.selectedProgram.stage,
              programId: getState().programReducer.selectedProgram._id,
            };
            dispatch(chageSwipeCardData(postData));
          } else {
            dispatch({
              type: ACTION_TYPE.UPDATE_LEARNING_DATA,
              payload: {
                total_cards: current_cards_data[array_index].cards.length - 1,
                current_card: 0,
                selected_day: total_days,
                selected_week: getState().cardsReducer.selected_week - 1,
                currentCard:
                  current_cards_data[array_index].cards[
                    getState().cardsReducer.current_card
                  ],
              },
            });
          }
        }
      }
    } else if (
      getState().cardsReducer.total_cards ==
        getState().cardsReducer.current_card &&
      type == "next"
    ) {
      console.log("last card===>");

      // isChatBot &&
      dispatch(
        AppActions.manageChatbot({}, "fertilift", false, componentId, false)
      );

      let new_day_week = checkNextDayUnlocked(
        getState().cardsReducer.selected_week,
        getState().cardsReducer.selected_day,
        getState().programReducer.selectedProgram.totalWeeks,
        getState().programReducer.selectedProgram.totalDays,
        total_days
      );
      if (new_day_week != null) {
        let postData = {
          week: new_day_week.new_week,
          day: new_day_week.new_day,
          stage: getState().programReducer.selectedProgram.stage,
          programId: getState().programReducer.selectedProgram._id,
        };
        // dispatch(chageSwipeCardData(postData));
      } else {
        // dispatch({
        //   type: ACTION_TYPE.POPUP_STATUS,
        //   payload: true,
        // });
      }
    }
  };
}

/**API to get cards for a day  */
export function getCardsforDay(data, card_index = 0, cb) {
  isConnected();
  return async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPE.LOGIN_REQUEST });
    try {
      let json = await RestClient.postCall(URL.GET_WEEK_DAY_DATE, data);
      let current_cards_data = getState().cardsReducer.all_cards;
      if (json.code == SUCCESS) {
        let array_index = `${data.week}${data.day}`;
        if (
          current_cards_data[array_index] == null ||
          current_cards_data[array_index] == undefined
        ) {
          current_cards_data = Object.assign({}, current_cards_data, {
            [array_index]: json.data,
          });
          /**Action to set all cards data cards */
          dispatch({
            type: ACTION_TYPE.SET_CARD_DATA,
            payload: current_cards_data,
          });
        }
        current_cards_data = Object.assign({}, current_cards_data, {
          [array_index]: json.data,
        });
        /**Action to set selected current week day data cards, current index */
        dispatch({
          type: ACTION_TYPE.SET_SELECTED_WEEK_DAY,
          payload: { selected_day: data.day, selected_week: data.week },
        });
        dispatch({
          type: ACTION_TYPE.SET_CURRENT_CARD,
          payload: json.data.cards[card_index],
        });
        dispatch({
          type: ACTION_TYPE.SET_CARD_INDEX,
          payload: {
            total_cards: json.data.cards.length - 1,
            current_card: card_index,
          },
        });

        cb();
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
          type: ACTION_TYPE.GET_DAILY_CBT_FAIL,
          payload: json,
        });
      }
      dispatch({ type: ACTION_TYPE.API_SUCCESS });
    } catch (error) {
      dispatch({ type: ACTION_TYPE.API_SUCCESS });
    }
  };
}

/**API to like the selected card*/
export function getLikedCards(data, cb) {
  return async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPE.LOGIN_REQUEST });
    try {
      let json = await RestClient.postCall(URL.LIKED_CARDS, data);
      if (json.code == SUCCESS) {
        dispatch({
          type: ACTION_TYPE.SET_LIKE_CARD_DATA,
          payload: json.data,
        });
        if (json.data.length == 0) {
          cb(false);
          alertWithOneBtn(
            "",
            strings.cards.no_like_card,
            GLOBALS.STRINGS.LOGOUT_OK
          );
        } else {
          dispatch({
            type: ACTION_TYPE.SET_CURRENT_CARD,
            payload: json.data[0],
          });
          cb(true);
        }
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

/**API to get all suggested learning cards */
export function getSuggestedLearningCards(data, cb) {
  return async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPE.LOGIN_REQUEST });
    try {
      let json = await RestClient.postCall(URL.GET_SUGGESTED_CARDS, data);
      let current_cards_data = getState().cardsReducer.all_cards;
      if (json.code == SUCCESS) {
        dispatch({
          type: ACTION_TYPE.SET_LIKE_CARD_DATA,
          payload: json.data,
        });
        if (json.data.length == 0) {
          cb(false);
          alertWithOneBtn(
            "",
            strings.cards.no_suggested,
            GLOBALS.STRINGS.LOGOUT_OK
          );
        } else {
          dispatch({
            type: ACTION_TYPE.SET_CURRENT_CARD,
            payload: json.data[0],
          });
          cb(true);
        }
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

/**API to Mark Card Read to track which cards has been read by the user */
export function markCardRead(data) {
  return async (dispatch, getState) => {
    try {
      let json = await RestClient.postCall(URL.CARD_READ, data);
      if (json.code == SUCCESS) {
      } else if (json.code == SESSION_ERROR) {
      } else {
      }
    } catch (error) {
      console.log(error);
    }
  };
}

// /**API to get all care concern learning cards */
// export function getCareConcernLearningCards(data, cb) {
//   return async (dispatch, getState) => {
//     dispatch({ type: ACTION_TYPE.LOGIN_REQUEST });
//     try {
//       let json = await RestClient.postCall(URL.GET_CARE_CONCERN_DATA, data);
//       let current_cards_data = getState().cardsReducer.all_cards;
//       if (json.code == SUCCESS) {
//         dispatch({
//           type: ACTION_TYPE.SET_LIKE_CARD_DATA,
//           payload: json.data,
//         });
//         if (json.data.length == 0) {
//           cb(false);
//           alertWithOneBtn(
//             '',
//             // strings.cards.no_suggested,
//             "No cards found",
//             GLOBALS.STRINGS.LOGOUT_OK,
//           );
//         } else {
//           dispatch({
//             type: ACTION_TYPE.SET_CURRENT_CARD,
//             payload: json.data[0],
//           });
//           cb(true);
//         }
//       } else if (json.code == SESSION_ERROR) {
//         Alert.alert(
//           STRINGS.LOGOUT_TITLE,
//           json.message,
//           [
//             {
//               text: STRINGS.LOGOUT_OK,
//               onPress: () => dispatch(AppActions.logout_session()),
//             },
//           ],
//           { cancelable: false },
//         );
//       } else {
//       }
//       dispatch({ type: ACTION_TYPE.API_SUCCESS });
//     } catch (error) {
//       dispatch({ type: ACTION_TYPE.API_SUCCESS });
//     }
//   };
// }

/**API to get all care concern learning cards */
export function getCareConcernLearningCards(data, cb) {
  return async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPE.LOGIN_REQUEST });
    try {
      let json = await RestClient.postCall(URL.GET_WEEK_DAY_DATE, data);
      if (json.code == SUCCESS) {
        dispatch({
          type: ACTION_TYPE.SET_LIKE_CARD_DATA,
          payload: json.data.cards,
        });
        if (json.data.length == 0) {
          cb(false);
          alertWithOneBtn(
            "",
            // strings.cards.no_suggested,
            "No cards found",
            GLOBALS.STRINGS.LOGOUT_OK
          );
        } else {
          dispatch({
            type: ACTION_TYPE.SET_CURRENT_CARD,
            payload: json.data.cards[0],
          });
          cb(true);
        }
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

export function savePanData(data, userLanguage) {
  return async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPE.LOGIN_REQUEST });
    try {
      let json = await RestClient.postCall(URL.SAVE_PAN_TEMPALTE_DATA, data);
      if (json.code == SUCCESS) {
        // json.message ? toast(json.message) : null;

        // json.data?.feedback_message[data?.language] !== ''
        //   ? toast(json.data?.feedback_message[data?.language])
        //   : json.message
        //   ? toast(json.message)
        //   : null;
        let allCardsData = getState().cardsReducer.all_cards;
        let getSpecificaDayCardData =
          getState().cardsReducer.all_cards[
            `${getState().cardsReducer.selected_week}${
              getState().cardsReducer.selected_day
            }`
          ];
        let all_dayCards = getSpecificaDayCardData.cards;
        let changedIndexId = all_dayCards.findIndex(
          (x) => x._id === json.data._id
        );
        all_dayCards = Object.assign([], all_dayCards, {
          [changedIndexId]: json.data,
        });
        getSpecificaDayCardData = Object.assign(getSpecificaDayCardData, {
          cards: all_dayCards,
        });
        allCardsData = Object.assign(allCardsData, {
          [`${getState().cardsReducer.selected_week}${
            getState().cardsReducer.selected_day
          }`]: getSpecificaDayCardData,
        });

        dispatch({
          type: ACTION_TYPE.SET_CARD_DATA,
          payload: allCardsData,
        });
        dispatch({
          type: ACTION_TYPE.SET_CURRENT_CARD,
          payload: json.data,
        });
      } else if (json.code == SESSION_ERROR) {
        Alert.alert(
          STRINGS.LOGOUT_TITLE,
          // json.message[userLanguage] ? json.message[userLanguage] : json.message['en'],
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

export function saveCommitment(data) {
  return async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPE.LOGIN_REQUEST });
    try {
      let json = await RestClient.postCall(URL.SAVE_COMMITMENT, data);
      if (json.code == SUCCESS) {
        json.message ? toast(json.message) : null;
        // json.data?.feedback_message[data?.language] !== ''
        //   ? toast(json.data?.feedback_message[data?.language])
        //   : json.message
        //   ? toast(json.message)
        //   : null;
        let allCardsData = getState().cardsReducer.all_cards;
        let getSpecificaDayCardData =
          getState().cardsReducer.all_cards[
            `${getState().cardsReducer.selected_week}${
              getState().cardsReducer.selected_day
            }`
          ];
        let all_dayCards = getSpecificaDayCardData.cards;
        let changedIndexId = all_dayCards.findIndex(
          (x) => x._id === json.data._id
        );
        all_dayCards = Object.assign([], all_dayCards, {
          [changedIndexId]: json.data,
        });
        getSpecificaDayCardData = Object.assign(getSpecificaDayCardData, {
          cards: all_dayCards,
        });
        allCardsData = Object.assign(allCardsData, {
          [`${getState().cardsReducer.selected_week}${
            getState().cardsReducer.selected_day
          }`]: getSpecificaDayCardData,
        });

        dispatch({
          type: ACTION_TYPE.SET_CARD_DATA,
          payload: allCardsData,
        });
        dispatch({
          type: ACTION_TYPE.SET_CURRENT_CARD,
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
      }
      dispatch({ type: ACTION_TYPE.API_SUCCESS });
    } catch (error) {
      dispatch({ type: ACTION_TYPE.API_SUCCESS });
    }
  };
}

/**Get Current Card Data */
export function getCurrentCardData(data) {
  return async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPE.LOGIN_REQUEST });
    try {
      let json = await RestClient.postCall(URL.GET_CARD_DATA, data);
      if (json.code == SUCCESS) {
        let allCardsData = getState().cardsReducer.all_cards;
        let getSpecificaDayCardData =
          getState().cardsReducer.all_cards[
            `${getState().cardsReducer.selected_week}${
              getState().cardsReducer.selected_day
            }`
          ];
        let all_dayCards = getSpecificaDayCardData.cards;
        let changedIndexId = all_dayCards.findIndex(
          (x) => x._id === json.data._id
        );
        all_dayCards = Object.assign([], all_dayCards, {
          [changedIndexId]: json.data,
        });
        getSpecificaDayCardData = Object.assign(getSpecificaDayCardData, {
          cards: all_dayCards,
        });
        allCardsData = Object.assign(allCardsData, {
          [`${getState().cardsReducer.selected_week}${
            getState().cardsReducer.selected_day
          }`]: getSpecificaDayCardData,
        });

        dispatch({
          type: ACTION_TYPE.SET_CARD_DATA,
          payload: allCardsData,
        });
        dispatch({
          type: ACTION_TYPE.SET_CURRENT_CARD,
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
      }
      dispatch({ type: ACTION_TYPE.API_SUCCESS });
    } catch (error) {
      dispatch({ type: ACTION_TYPE.API_SUCCESS });
    }
  };
}

/**API to integrate Mark day complete */
export function markDayComplete(data, componentId) {
  let param;

  return async (dispatch, getState) => {
    console.log(getState().programReducer.selectedProgram);
    let current_card = getState().cardsReducer.current_card;
    let total_card = getState().cardsReducer.total_cards;
    let stage = getState().programReducer.selectedProgram.stage;
    let curruntStage = getState().programReducer.selectedProgram.currentStage;
    let totalStage = getState().programReducer.selectedProgram.stage;
    let totalWeeks = getState().programReducer.selectedProgram.totalWeeks;
    let curruntWeek = getState().programReducer.selectedProgram.currentWeek;
    if (current_card == total_card) {
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
        param = {
          progId: getState().programReducer.activeProgramDetail._id,
          totalStage: stage,
          currentStage: getState().cardsReducer.currentCard.stage,
          progName: getState().programReducer.activeProgramDetail.name,
          currentStageName: getState().programReducer.selectedProgram.name,
          stageName: getState().programReducer.activeProgramDetail.stageName,
        };
        console.log("matches...", param);
      }
      try {
        if (current_card == total_card) {
          // console.log("API call==>----", PRODUCT_MS_URL + MS_Endpoints.PROGRAM_TRACK + data, param);
          // let json = await MSRestClient.postCall(
          //   PRODUCT_MS_URL + MS_Endpoints.PROGRAM_TRACK,
          //   param
          // );
          // console.log("Program Trrack Status..", json);
        }
      } catch (error) {
        console.log("Program Track Error..", error);
      }
    }
  };
}
