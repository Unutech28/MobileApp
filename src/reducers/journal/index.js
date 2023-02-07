/* eslint-disable module-resolver/use-alias */
import GLOBALS from "@constants";

const INITIAL_STATE = {
  allJournals: [],
  allJournalQuestions: [],
  journalLoader: false,
  journalQuestionsLoader: false,
  saveJournalLoader: false,
  saveJournalRes: [],
  getTextVisible: false,
  journalAnswers: []
};
const { ACTION_TYPE } = GLOBALS;
function journalReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case ACTION_TYPE.GET_JOURNAL_REQUEST:
      return Object.assign({}, state, {
        journalLoader: true,
      });
    case ACTION_TYPE.GET_JOURNAL_SUCCESS:
      return Object.assign({}, state, {
        journalLoader: false,
        allJournals: action.payload,
      });
    case ACTION_TYPE.GET_JOURNAL_FAIL:
      return Object.assign({}, state, {
        journalLoader: false,
        allJournals: [],
      });

    case ACTION_TYPE.GET_JOURNAL_QUESTIONS_REQUEST:
      return Object.assign({}, state, {
        journalQuestionsLoader: true,
      });
    case ACTION_TYPE.GET_JOURNAL_QUESTIONS_SUCCESS:
      return Object.assign({}, state, {
        journalQuestionsLoader: false,
        allJournalQuestions: action.payload,
      });
    case ACTION_TYPE.GET_JOURNAL_QUESTIONS_FAIL:
      return Object.assign({}, state, {
        journalQuestionsLoader: false,
        allJournalQuestions: [],
      });

    case ACTION_TYPE.SAVE_JOURNAL_QUESTIONS_REQUEST:
      return Object.assign({}, state, {
        saveJournalLoader: true,
      });
    case ACTION_TYPE.SAVE_JOURNAL_QUESTIONS_SUCCESS:
      return Object.assign({}, state, {
        saveJournalLoader: false,
      });

    case ACTION_TYPE.SET_TEXT_VISIBLE:
      return Object.assign({}, state, {
        getTextVisible: action.payload,
      });

    case ACTION_TYPE.SAVE_JOURNAL_QUESTIONS_FAIL:
      return Object.assign({}, state, {
        saveJournalLoader: false,
      });

    case ACTION_TYPE.GET_JOURNAL_QUESTIONS_REQUEST:
      return Object.assign({}, state, {
        journalQuestionsLoader: true,
      });
    case ACTION_TYPE.GET_JOURNAL_ANSWER_SUCCESS:
      return Object.assign({}, state, {
        journalQuestionsLoader: false,
        journalAnswers: action.payload,
      });
    case ACTION_TYPE.GET_JOURNAL_QUESTIONS_FAIL:
      return Object.assign({}, state, {
        journalQuestionsLoader: false,
        allJournalQuestions: [],
      });

    default:
      return state;
  }
}
export default journalReducer;
