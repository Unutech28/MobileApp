/* eslint-disable module-resolver/use-alias */
import GLOBALS from "@constants";
import { isNonNullExpression } from "typescript";
import { AsyncStorage } from "react-native";
let { STRINGS } = GLOBALS;
const INITIAL_STATE = {
  all_cards: {},
  isLoading: false,
  selected_day: 1,
  selected_week: 1,
  comments: [],
  current_step: 1,
  currentCard: {},
  likedCards: [],
  currentLikeIndex: 0,
  total_cards: 0,
  current_card: 0,
  current_step_For12: 0,
  cardsLimit: 20,
  total_currunt_cards: 0,
  Last_card_read: {},
  template22Card1Data: {},
  template22Card2Data: {},
};

const { ACTION_TYPE } = GLOBALS;
function cardsReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case ACTION_TYPE.SET_CARD_DATA:
      return {
        ...state,
        // all_cards: action.payload,
        ...action.payload,
      };
    case ACTION_TYPE.SET_LIKE_CARD_DATA:
      return {
        ...state,
        likedCards: action.payload,
        currentLikeIndex: 0,
      };
    case ACTION_TYPE.SET_LIKE_INDEX:
      return {
        ...state,
        currentLikeIndex: action.payload,
      };

    case ACTION_TYPE.SET_SELECTED_WEEK_DAY:
      return {
        ...state,
        selected_day: action.payload.selected_day,
        selected_week: action.payload.selected_week,
      };

    case ACTION_TYPE.SET_COMMENT_DATA:
      return {
        ...state,
        comments: action.payload.comments,
      };
    case ACTION_TYPE.UPDATE_STEP_QUES:
      return {
        ...state,
        current_step: action.payload,
      };
    case ACTION_TYPE.UPADTE_STEP_QUE_FOR_TEM_12:
      return {
        ...state,
        current_step_For12: action.payload,
      };

    case ACTION_TYPE.SET_CURRENT_CARD:
      return {
        ...state,
        currentCard: action.payload,
      };

    case ACTION_TYPE.SET_CARD_LIMIT:
      return {
        ...state,
        cardsLimit: action.payload,
      };
    case ACTION_TYPE.UPDATE_LIKE_CARD_DATA:
      return {
        ...state,
        likedCards: action.payload.likedCards,
        currentCard: action.payload.currentCard,
      };
    case ACTION_TYPE.SET_CARD_INDEX:
      return {
        ...state,
        total_cards: action.payload.total_cards,
        current_card: action.payload.current_card,
      };
    case ACTION_TYPE.SET_CURRUNT_CARD_INDEX:
      return {
        ...state,
        total_currunt_cards: action.payload,
      };
    case ACTION_TYPE.UPDATE_LEARNING_DATA:
      return {
        ...state,
        ...action.payload,
        // total_cards: action.payload.total_cards,
        // current_card: action.payload.current_card,
        // selected_day: action.payload.selected_day,
        // selected_week: action.payload.selected_week,
        // currentCard: action.payload.currentCard,
      };
    case ACTION_TYPE.SET_LAST_CARD_READT_DATA:
      return {
        ...state,
        Last_card_read: action.payload,
      };
    case ACTION_TYPE.SET_TEM22_CARD1:
      return {
        ...state,
        template22Card1Data: action.payload,
      };
    case ACTION_TYPE.SET_TEM22_CARD2:
      return {
        ...state,
        template22Card2Data: action.payload,
      };

    case ACTION_TYPE.RESET_CARDS:
      return {
        ...state,
        all_cards: {},
        isLoading: false,
        selected_day: 1,
        selected_week: 1,
        comments: [],
        current_step: 1,
        currentCard: {},
        likedCards: [],
        currentLikeIndex: 0,
        total_cards: 0,
        current_card: 0,
        cardsLimit: 10,
        total_currunt_cards: 0,
        Last_card_read: {},
      };

    default:
      return state;
  }
}
export default cardsReducer;
