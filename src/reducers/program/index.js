/* eslint-disable module-resolver/use-alias */
import GLOBALS from "@constants";
import { isNonNullExpression } from "typescript";
import { AsyncStorage } from "react-native";
let { STRINGS } = GLOBALS;

const getActivePrograms = {
  activeProgramDetail: "",
  getActiveProgramTimeStamp: "",
};

const INITIAL_STATE = {
  programsList: [],
  activeTotalWeek: 1,
  activeTotalDay: 1,
  activeCurrentWeek: 1,
  activeCurrentDay: 1,
  lastUpdate: new Date(),
  selectedProgram: {},
  ...getActivePrograms,
  ActiveStage: 1,
  UserStages: [],
};

const { ACTION_TYPE } = GLOBALS;
function programReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case ACTION_TYPE.PROGRAMS_LIST_SUCCESS:
      return Object.assign({}, state, {
        programsList: action?.payload.program,
      });
    case ACTION_TYPE.SET_SELECTED_PROGRAM:
      return Object.assign({}, state, {
        selectedProgram: action?.payload,
      });
    case ACTION_TYPE.GET_ACTIVE_PROGRAM_SUCCESS:
      return Object.assign({}, state, {
        ...getActivePrograms,
        activeProgramDetail: action?.payload,
      });
    case ACTION_TYPE.ACTIVE_PROGRAM_TIME_STAMP:
      return Object.assign({}, state, {
        ...getActivePrograms,
        getActiveProgramTimeStamp: action?.payload,
      });
    case ACTION_TYPE.SET_ACTIVE_STAGE:
      return Object.assign({}, state, {
        ActiveStage: action?.payload,
      });
    case ACTION_TYPE.SET_USER_READ_STAGES:
      return Object.assign({}, state, {
        UserStages: action?.payload,
      });
    default:
      return state;
  }
}
export default programReducer;
