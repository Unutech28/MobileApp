/* eslint-disable module-resolver/use-alias */
import GLOBALS from '@constants';

const INITIAL_STATE = {
  allAssessments: [],
  allAssessmentsQuestions: [],
  assessmentLoader: false,
  assessmentQuestionsLoader: false,
  saveAssessmentLoader: false,
  refreshAssessmenetList: false,
  saveAssessmentStatus: '',
  viewAssessmentQuestionsLoader: false,
  viewAssessmentQuestionsLoader: false,
  viewAllAssessmentsQuestions: []
};
const { ACTION_TYPE } = GLOBALS;
function assessmentsReducer(state = INITIAL_STATE, action) {
  if (action !== undefined) { 
    switch (action.type) {
      case ACTION_TYPE.GET_ASSESSMENTS_REQUEST:
        return Object.assign({}, state, {
          assessmentLoader: true,
        });
      case ACTION_TYPE.GET_ASSESSMENTS_SUCCESS:
        return Object.assign({}, state, {
          assessmentLoader: false,
          allAssessments: action.payload,
          refreshAssessmenetList: false
        });
      case ACTION_TYPE.GET_ASSESSMENTS_FAIL:
        return Object.assign({}, state, {
          assessmentLoader: false,
          allAssessments: [],
        });

      case ACTION_TYPE.GET_ASSESSMENTS_QUESTIONS_REQUEST:
        return Object.assign({}, state, {
          assessmentQuestionsLoader: true,
        });
      case ACTION_TYPE.GET_ASSESSMENTS_QUESTIONS_SUCCESS:
        return Object.assign({}, state, {
          assessmentQuestionsLoader: false,
          allAssessmentsQuestions: action.payload,
        });
      case ACTION_TYPE.GET_ASSESSMENTS_QUESTIONS_FAIL:
        return Object.assign({}, state, {
          assessmentQuestionsLoader: false,
          allAssessmentsQuestions: [],
        });

        case ACTION_TYPE.VIEW_ASSESSMENTS_QUESTIONS_REQUEST:
          return Object.assign({}, state, {
            viewAssessmentQuestionsLoader: true,
          });
        case ACTION_TYPE.VIEW_ASSESSMENTS_QUESTIONS_SUCCESS:
          return Object.assign({}, state, {
            viewAssessmentQuestionsLoader: false,
            viewAllAssessmentsQuestions: action.payload,
          });
        case ACTION_TYPE.VIEW_ASSESSMENTS_QUESTIONS_FAIL:
          return Object.assign({}, state, {
            viewAssessmentQuestionsLoader: false,
            viewAllAssessmentsQuestions: [],
          });

      case ACTION_TYPE.SAVE_ASSESSMENTS_QUESTIONS_REQUEST:
        return Object.assign({}, state, {
          saveAssessmentLoader: true,
        });
      case ACTION_TYPE.SAVE_ASSESSMENTS_QUESTIONS_SUCCESS:
        return Object.assign({}, state, {
          saveAssessmentLoader: false,
          refreshAssessmenetList: true,
          saveAssessmentStatus: action.payload
        });
      case ACTION_TYPE.SAVE_ASSESSMENTS_QUESTIONS_FAIL:
        return Object.assign({}, state, {
          saveAssessmentLoader: false,
          saveAssessmentStatus: ''
        });
      default:
        return state;
    }
  }
}
export default assessmentsReducer;
