/* eslint-disable module-resolver/use-alias */
import GLOBALS from '@constants';
import { truncate } from 'lodash';
import { act } from 'react-test-renderer';
// import * as AppActions from '@actions';

const KeywordResponse = {
  getKeywordResponse: null,
};
const PopupStatus = {
  isPopupShow: false,
};
// const removeProfilePic = {
//   removeProfileImage: false,
// };
const GetPlaylistPoints = {
  programsList: [],
  isPlaylistPointSuccess: false,
  playlistPointData: null,
};
const HospitalInfo = {
  hospitalDetails: ''
}
const TrackersInfo = {
  getAllTrackers: '',
}

const TrackersResponse = {
  getAllTrackersResponse1: null,
  // isMoodSave: null
}
const SleepTrackersResponse = {
  getSleepTrackersResponse: null,
  // isSleepSave: null,
}
const ActivityTrackersResponse = {
  getActivityTrackersResponse: null,
  // isActivitySave: null
}
const WeeklyReports = {
  getAllUserReports: null
}
const GetScreenStartTime = {
  getScreenStartTime: null
}

const GetAllSymptoms = {
  /* Get All Symptoms */
  isGetAllSymptomsSuccess: false,
  GetAllSymptomsData: null,
};

const GetDrftAnsJournal = {
  getDraftAnsJournal: '',
};

const HelpResponse = {
  getHelpResponse: null,
}
const INITIAL_STATE = {
  ...TrackersInfo,
  ...TrackersResponse,
  ...SleepTrackersResponse,
  ...ActivityTrackersResponse,
  ...WeeklyReports,
  ...HospitalInfo,
  ...GetAllSymptoms,
  ...PopupStatus,
  // ...removeProfilePic,
  ...GetPlaylistPoints,
  ...GetDrftAnsJournal,
  ...HelpResponse,
  ...GetScreenStartTime,
};
const { ACTION_TYPE } = GLOBALS;
function dashboardReducer(state = INITIAL_STATE, action) {
  switch (action.type) {

    // case ACTION_TYPE.PROGRAMS_LIST_SUCCESS:
    //   return Object.assign({}, state, {
    //     ...GetPlaylistPoints,
    //     programsList: action?.payload
    //     ,
    //   });

    case ACTION_TYPE.GET_ALL_TRACKERS_LIST_SUCCESS:
      return Object.assign({}, state, {
        ...TrackersInfo,
        getAllTrackers: action?.payload,
      });

    case ACTION_TYPE.FETCH_SLEEP_TRACKERS_SUCCESS:
      return Object.assign({}, state, {
        ...SleepTrackersResponse,
        getSleepTrackersResponse: action?.payload,
        // isSleepSave: true,
      });

    case ACTION_TYPE.FETCH_ACTIVITY_TRACKERS_SUCCESS:
      return Object.assign({}, state, {
        ...ActivityTrackersResponse,
        getActivityTrackersResponse: action?.payload,
        // isActivitySave:  true,
      });


    case ACTION_TYPE.FETCH_ALL_TRACKERS_SUCCESS:
      return Object.assign({}, state, {
        ...TrackersResponse,
        getAllTrackersResponse1: action?.payload,
        // isMoodSave: true,
      });

    case ACTION_TYPE.FETCH_ALL_REPORTS_SUCCESS:
      return Object.assign({}, state, {
        ...WeeklyReports,
        getAllUserReports: action?.payload
        ,
      });

    case ACTION_TYPE.GET_SCREEN_START_TIME:
      return Object.assign({}, state, {
        ...GetScreenStartTime,
        getScreenStartTime: action.payload,
      });
    case ACTION_TYPE.HOSPITAL_INFO_SUCCESS:
      return Object.assign({}, state, {
        ...HospitalInfo,
        hospitalDetails: action?.payload
        ,
      });

    case ACTION_TYPE.GET_KEYWORD_SUCCESS:
      return Object.assign({}, state, {
        ...GetPlaylistPoints,
        programsList: action?.payload?.res
        ,
      });

    case ACTION_TYPE.LOGOUT_SUCCESS:
      return Object.assign({}, state, {
        INITIAL_STATE,
      });

    case ACTION_TYPE.POPUP_STATUS:
      return Object.assign({}, state, {
        ...PopupStatus,
        isPopupShow: action.payload,
      });
    // case ACTION_TYPE.REMOVE_PROFILE_IMAGE_SUCCESS:
    //   return Object.assign({}, state, {
    //     ...removeProfilePic,
    //     removeProfileImage: action.payload,
    //   });

    case ACTION_TYPE.GET_ALL_SYMPTOMS_SUCCESS:
      return Object.assign({}, state, {
        ...GetAllSymptoms,
        isGetAllSymptomsSuccess: true,
        GetAllSymptomsData: action.payload,
      });

    case ACTION_TYPE.DRAFT_JOURNAL_ANSWER_SUCCESS:
      return Object.assign({}, state, {
        ...GetDrftAnsJournal,
        getDrftAnsJournal: action.payload,
      });
    case ACTION_TYPE.DRAFT_JOURNAL_ANSWER_CLEAR:
      return Object.assign({}, state, {
        ...GetDrftAnsJournal,
        getDrftAnsJournal: '',
      });

    case ACTION_TYPE.GET_PLAYLIST_POINTS_SUCCESS:
      return Object.assign({}, state, {
        ...GetPlaylistPoints,
        isPlaylistPointSuccess: true,
        playlistPointData: action.payload,
      });

    case ACTION_TYPE.GET_HELP_SUCCESS:
      return Object.assign({}, state, {
        ...HelpResponse,
        getHelpResponse: action.payload,
      });


    //  //daily learning
    //  case ACTION_TYPE.PLAYLIST_DAILY_LEARNING_STATUS_COMPLETE:
    //   return Object.assign({}, state, {
    //     ...DailyLearningStatus,
    //     getDailyLearningStatus: action.payload,
    //   });

    // //mood tracker
    // case ACTION_TYPE.PLAYLIST_MOOD_STATUS_COMPLETE:
    //   return Object.assign({}, state, {
    //     ...MoodStatus,
    //     getMoodStatus: action.payload,
    //   });

    //activity tracker
    // case ACTION_TYPE.PLAYLIST_ACTIVITY_STATUS_COMPLETE:
    //   return Object.assign({}, state, {
    //     ...ActivityStatus,
    //     getActivityStatus: action.payload,
    //   });

    // //sleep tracker
    // case ACTION_TYPE.PLAYLIST_SLEEP_STATUS_COMPLETE:
    //   return Object.assign({}, state, {
    //     ...SleepStatus,
    //     getSleepStatus: action.payload,
    //   });

    // //GET_WEEKLY_SUMMARY_REPORT_SUCCESS
    // case ACTION_TYPE.GET_WEEKLY_SUMMARY_REPORT_SUCCESS:
    //   return Object.assign({}, state, {
    //     ...WeeklySummaryReport,
    //     getWeeklySummaryReports: action.payload,
    //   });

    // case ACTION_TYPE.GET_HELP_SUCCESS:
    //   return Object.assign({}, state, {
    //     ...HelpResponse,
    //     getHelpResponse: action.payload,
    //   });

    // case ACTION_TYPE.SEARCH_TEXT:
    //   return Object.assign({}, state, {
    //     searchActive: true,
    //     searchData: action.payload.filteredList,
    //     searchInput: action.payload.inputText,
    //   });
    // case ACTION_TYPE.SEARCH_TEXT_INACTIVE:
    //   return Object.assign({}, state, {
    //     ...SearchBar,
    //   });
    /*  --------- Next Dose ------------ */
    // case ACTION_TYPE.NEXTDOSE_RESET:
    //   return Object.assign({}, state, {
    //     ...NextDose,
    //   });
    // case ACTION_TYPE.NEXTDOSE_REQUEST:
    //   return Object.assign({}, state, {
    //     isDoseLoading: true,
    //   });
    // case ACTION_TYPE.NEXTDOSE_SUCCESS:
    //   return Object.assign({}, state, {
    //     ...NextDose,
    //     isNextDoseSuccess: true,
    //     nextDoseData: action.payload,
    //   });
    // case ACTION_TYPE.NEXTDOSE_FAIL:
    //   return Object.assign({}, state, {
    //     ...NextDose,
    //     isNextDoseFail: true,
    //   });
    /* REFRESH NEXT DOSE */
    // case ACTION_TYPE.REFRESH_NEXTDOSE_REQUEST:
    //   return Object.assign({}, state, {
    //     isDoseRefreshing: true,
    //   });
    // case ACTION_TYPE.REFRESH_NEXTDOSE_SUCCESS:
    //   return Object.assign({}, state, {
    //     isDoseRefreshing: false,
    //     nextDoseData: action.payload,
    //   });
    // case ACTION_TYPE.REFRESH_NEXTDOSE_FAIL:
    //   return Object.assign({}, state, {
    //     isDoseRefreshing: false,
    //     nextDoseData: null,
    //   });
    /*  --------- ADD Schedule ------------ */

    // case ACTION_TYPE.SCHEDULE_REQUEST:
    //   return Object.assign({}, state, {
    //     isScheduleLoading: true,
    //   });
    // case ACTION_TYPE.SCHEDULE_SUCCESS:
    //   return Object.assign({}, state, {
    //     ...ScheduleAdd,
    //     isScheduleSuccess: true,
    //     ScheduleData: action.payload,
    //   });
    // case ACTION_TYPE.SCHEDULE_FAIL:
    //   return Object.assign({}, state, {
    //     ...ScheduleAdd,
    //     isScheduleFail: true,
    //   });
    // case ACTION_TYPE.SCHEDULE_RESET /* Reset */:
    //   return Object.assign({}, state, {
    //     ...ScheduleAdd,
    //   });

    /*  --------- GET care Team list------------ */

    // case ACTION_TYPE.GET_CARETEAM_REQUEST:
    //   return Object.assign({}, state, {
    //     isGetCareTeamLoading: true,
    //   });
    // case ACTION_TYPE.GET_CARETEAM_SUCCESS:
    //   return Object.assign({}, state, {
    //     ...GetCareTeam,
    //     isGetCareTeamSuccess: true,
    //     GetCareTeamData: action.payload,
    //   });
    // case ACTION_TYPE.GET_CARETEAM_FAIL:
    //   return Object.assign({}, state, {
    //     ...GetCareTeam,
    //     isGetCareTeamFail: true,
    //   });

    // case ACTION_TYPE.GET_CARETEAM_REFRESH_REQUEST:
    //   return Object.assign({}, state, {
    //     isCareTeamRefreshing: true,
    //   });
    // case ACTION_TYPE.GET_CARETEAM_REFRESH_SUCCESS:
    //   return Object.assign({}, state, {
    //     isCareTeamRefreshing: false,
    //     GetCareTeamData: action.payload,
    //   });
    // case ACTION_TYPE.GET_CARETEAM_REFRESH_FAIL:
    //   return Object.assign({}, state, {
    //     isCareTeamRefreshing: false,
    //   });
    // case ACTION_TYPE.GET_CARETEAM_RESET /* Reset */:
    //   return Object.assign({}, state, {
    //     ...GetCareTeam,
    //   });
    /*  --------- GET Appointment list------------ */

    // case ACTION_TYPE.GET_ALL_APPOINTMENT_REQUEST:
    //   return Object.assign({}, state, {
    //     isGetAllAppointmentLoading: true,
    //   });
    // case ACTION_TYPE.GET_ALL_APPOINTMENT_SUCCESS:
    //   return Object.assign({}, state, {
    //     ...GetAllAppointment,
    //     isGetAllAppointmentSuccess: true,
    //     GetAllAppointmentData: action.payload,
    //   });
    // case ACTION_TYPE.GET_ALL_APPOINTMENT_FAIL:
    //   return Object.assign({}, state, {
    //     ...GetAllAppointment,
    //     isGetAllAppointmentFail: true,
    //   });

    // case ACTION_TYPE.GET_REFRESH_APPOINTMENT_REQUEST:
    //   return Object.assign({}, state, {
    //     isRefreshingAppointmentList: true,
    //   });
    // case ACTION_TYPE.GET_REFRESH_APPOINTMENT_SUCCESS:
    //   return Object.assign({}, state, {
    //     isRefreshingAppointmentList: false,
    //     GetAllAppointmentData: action.payload,
    //   });
    // case ACTION_TYPE.GET_REFRESH_APPOINTMENT_FAIL:
    //   return Object.assign({}, state, {
    //     isRefreshingAppointmentList: false,
    //   });

    // case ACTION_TYPE.GET_ALL_APPOINTMENT_RESET /* Reset */:
    //   return Object.assign({}, state, {
    //     ...GetAllAppointment,
    //   });

    /*  --------- GET Symptoms list------------ */

    // case ACTION_TYPE.GET_ALL_SYMPTOMS_REQUEST:
    //   return Object.assign({}, state, {
    //     isGetAllSymptomsLoading: true,
    //   });

    // case ACTION_TYPE.GET_ALL_SYMPTOMS_FAIL:
    //   return Object.assign({}, state, {
    //     ...GetAllSymptoms,
    //     isGetAllSymptomsFail: true,
    //   });

    // case ACTION_TYPE.GET_REFRESH_ALL_SYMPTOMS_REQUEST:
    //   return Object.assign({}, state, {
    //     isRefreshingSymptomsList: true,
    //   });
    // case ACTION_TYPE.GET_REFRESH_ALL_SYMPTOMS_SUCCESS:
    //   return Object.assign({}, state, {
    //     isRefreshingSymptomsList: false,
    //     GetAllSymptomsData: action.payload,
    //   });
    // case ACTION_TYPE.GET_REFRESH_ALL_SYMPTOMS_FAIL:
    //   return Object.assign({}, state, {
    //     isRefreshingSymptomsList: false,
    //   });

    // case ACTION_TYPE.GET_ALL_SYMPTOMS_RESET /* Reset */:
    //   return Object.assign({}, state, {
    //     ...GetAllSymptoms,
    //   });
    /*  --------- GET Type Appointment LIST ------------ */

    // case ACTION_TYPE.GET_TYPE_APPOINTMENT_REQUEST:
    //   return Object.assign({}, state, {
    //     isTypeAppointmentLoading: true,
    //   });
    // case ACTION_TYPE.GET_TYPE_APPOINTMENT_SUCCESS:
    //   return Object.assign({}, state, {
    //     ...TypeAppointment,
    //     isTypeAppointmentSuccess: true,
    //     TypeAppointmentData: action.payload,
    //   });
    // case ACTION_TYPE.GET_TYPE_APPOINTMENT_FAIL:
    //   return Object.assign({}, state, {
    //     ...TypeAppointment,
    //     isTypeAppointmentFail: true,
    //   });

    // case ACTION_TYPE.GET_TYPE_APPOINTMENT_REFRESH_REQUEST:
    //   return Object.assign({}, state, {
    //     isTypeAppointmentRefreshing: true,
    //   });
    // case ACTION_TYPE.GET_TYPE_APPOINTMENT_REFRESH_SUCCESS:
    //   return Object.assign({}, state, {
    //     isTypeAppointmentRefreshing: false,
    //     TypeAppointmentData: action.payload,
    //   });
    // case ACTION_TYPE.GET_TYPE_APPOINTMENT_REFRESH_FAIL:
    //   return Object.assign({}, state, {
    //     isTypeAppointmentRefreshing: false,
    //   });
    // case ACTION_TYPE.GET_TYPE_APPOINTMENT_RESET /* Reset */:
    //   return Object.assign({}, state, {
    //     ...TypeAppointment,
    //   });
    /*  --------- GET Hospital Session ------------ */

    // case ACTION_TYPE.GET_HOSPITAL_TIME_REQUEST:
    //   return Object.assign({}, state, {
    //     isHospitalTimeLoading: true,
    //   });
    // case ACTION_TYPE.GET_HOSPITAL_TIME_SUCCESS:
    //   return Object.assign({}, state, {
    //     ...HospitalTime,
    //     isHospitalTimeSuccess: true,
    //     HospitalTimeData: action.payload,
    //   });
    // case ACTION_TYPE.GET_HOSPITAL_TIME_FAIL:
    //   return Object.assign({}, state, {
    //     ...HospitalTime,
    //     isHospitalTimeFail: true,
    //   });

    // case ACTION_TYPE.GET_HOSPITAL_TIME_REFRESH_REQUEST:
    //   return Object.assign({}, state, {
    //     isHospitalTimeRefreshing: true,
    //   });
    // case ACTION_TYPE.GET_HOSPITAL_TIME_REFRESH_SUCCESS:
    //   return Object.assign({}, state, {
    //     isHospitalTimeRefreshing: false,
    //     HospitalTimeData: action.payload,
    //   });
    // case ACTION_TYPE.GET_HOSPITAL_TIME_REFRESH_FAIL:
    //   return Object.assign({}, state, {
    //     isHospitalTimeRefreshing: false,
    //   });
    // case ACTION_TYPE.GET_HOSPITAL_TIME_RESET /* Reset */:
    //   return Object.assign({}, state, {
    //     ...HospitalTime,
    //   });

    /*  --------- ADD Symptom ------------ */

    // case ACTION_TYPE.POST_SYMPTOM_REQUEST:
    //   return Object.assign({}, state, {
    //     isPostSymptomLoading: true,
    //   });
    // case ACTION_TYPE.POST_SYMPTOM_SUCCESS:
    //   return Object.assign({}, state, {
    //     ...PostAddSymptom,
    //     isPostSymptomSuccess: true,
    //     PostSymptomData: action.payload,
    //     isMoodSave: true,
    //   });

    // case ACTION_TYPE.GET_ALL_CARE_CONCERNS_SUCCESS:
    //   return Object.assign({}, state, {
    //     ...CareConcerns,
    //     getCareConcernData: action.payload,
    //     isCareConcernSave: true,
    //   });

    // case ACTION_TYPE.UPDATE_SLEEP_DATA_SUCCESS:
    //   return Object.assign({}, state, {
    //     ...AddSleepRecord,
    //     isSleepSave: true,
    //     getSleepData: action.payload,
    //   });

    // case ACTION_TYPE.POST_SYMPTOM_FAIL:
    //   return Object.assign({}, state, {
    //     ...PostAddSymptom,
    //     isPostSymptomFail: true,
    //   });
    // case ACTION_TYPE.POST_SYMPTOM_RESET /* Reset */:
    //   return Object.assign({}, state, {
    //     ...PostAddSymptom,
    //   });
    /*  --------- GET Legend Symptom Date list ------------ */

    // case ACTION_TYPE.GET_LEGEND_SYMPTOM_REQUEST:
    //   return Object.assign({}, state, {
    //     isGetLegendSymptomLoading: true,
    //   });
    // case ACTION_TYPE.GET_LEGEND_SYMPTOM_SUCCESS:
    //   return Object.assign({}, state, {
    //     ...GetLegendSymptom,
    //     isGetLegendSymptomSuccess: true,
    //     GetLegendSymptomData: action.payload,
    //   });
    // case ACTION_TYPE.GET_LEGEND_SYMPTOM_FAIL:
    //   return Object.assign({}, state, {
    //     ...GetLegendSymptom,
    //     isGetLegendSymptomFail: true,
    //   });

    // case ACTION_TYPE.GET_LEGEND_SYMPTOM_REFRESH_REQUEST:
    //   return Object.assign({}, state, {
    //     isGetLegendSymptomRefreshing: true,
    //   });
    // case ACTION_TYPE.GET_LEGEND_SYMPTOM_REFRESH_SUCCESS:
    //   return Object.assign({}, state, {
    //     isGetLegendSymptomRefreshing: false,
    //     GetLegendSymptomData: action.payload,
    //   });
    // case ACTION_TYPE.GET_LEGEND_SYMPTOM_REFRESH_FAIL:
    //   return Object.assign({}, state, {
    //     isGetLegendSymptomRefreshing: false,
    //   });
    // case ACTION_TYPE.GET_LEGEND_SYMPTOM_RESET /* Reset */:
    //   return Object.assign({}, state, {
    //     ...GetLegendSymptom,
    //   });

    /*  --------- Video call check Time ------------ */
    // case ACTION_TYPE.CHECK_APPOINTMENT_TIME_SUCCESS:
    //   return Object.assign({}, state, {
    //     ...GetCheckTime,
    //     isCheckTimeSuccess: true,
    //     checkTimeData: action.payload,
    //   });

    // case ACTION_TYPE.SEND_VIDEO_CALL_NOTIFICATION_SUCCESS:
    //   return Object.assign({}, state, {
    //     ...SendVideoCallNotification,
    //     isNotificationSuccess: true,
    //     notificationData: action.payload,
    //   });

    // case ACTION_TYPE.GET_VIDEO_TOKEN_SUCCESS:
    //   return Object.assign({}, state, {
    //     ...GenrateToken,
    //     isVideoCallTokenSuccess: true,
    //     videoCallTokenData: action.payload,
    //   });

    // REMINDER_UPDATE_SUCCESS
    // case ACTION_TYPE.REMINDER_UPDATE_SUCCESS:
    //   return Object.assign({}, state, {
    //     ...ReminderUpdate,
    //     isReminderSuccess: true,
    //     reminderUpdateData: action.payload,
    //   });

    // case ACTION_TYPE.REMINDER_UPDATE_MEDITATION:
    //   return Object.assign({}, state, {
    //     ...ReminderMedittationUpdate,
    //     reminderUpdateMedittaion: action.payload,
    //   });

    // case ACTION_TYPE.REMINDER_UPDATE_ASSESSMENT:
    //   return Object.assign({}, state, {
    //     ...ReminderUpdateAssessment,
    //     reminderUpdateAssessment: action.payload,
    //   });

    // case ACTION_TYPE.REMINDER_UPDATE_APPOINTMENT:
    //   return Object.assign({}, state, {
    //     ...ReminderUpdateAppointment,
    //     reminderUpdateAppointment: action.payload,
    //   });

    // case ACTION_TYPE.GET_CBT_DETAILS_SUCCESS:
    //   return Object.assign({}, state, {
    //     ...GetCBTDetails,
    //     isCbtCourseSuccess: true,
    //     cbtCoursesData: action.payload,
    //   });

    // case ACTION_TYPE.GET_CBT_CATELOG_SUCCESS:
    //   return Object.assign({}, state, {
    //     ...GetCBTCateLog,
    //     isCbtCateLogSuccess: true,
    //     cbtCateLogData: action.payload,
    //   });

    // case ACTION_TYPE.GET_PLAYLIST_POINTS_SUCCESS:
    //   return Object.assign({}, state, {
    //     ...GetPlaylistPoints,
    //     isPlaylistPointSuccess: true,
    //     playlistPointData: action.payload,
    //   });

    // case ACTION_TYPE.GET_DECLINE_CALL_SUCCESS:
    //   return Object.assign({}, state, {
    //     ...DeclineVideoCall,
    //     isDeclineVideoCallSuccess: true,
    //     declineVideoCallData: action.payload,
    //   });

    // case ACTION_TYPE.GET_CHAT_LIST_SUCCESS:
    //   return Object.assign({}, state, {
    //     ...GetAllChatList,
    //     isChatListSuccess: true,
    //     chatListData: action.payload,
    //   });

    // case ACTION_TYPE.GET_SLEEP_DATA_SUCCESS:
    //   return Object.assign({}, state, {
    //     ...GetSleepData,
    //     isSleepSuccess: true,
    //     getSleeptData: action.payload,
    //   });

    // case ACTION_TYPE.GET_SLEEP_DATA_FAIL:
    //   return Object.assign({}, state, {
    //     ...GetSleepData,
    //     isSleepSuccess: false,
    //     getSleeptData: null,
    //   });

    // case ACTION_TYPE.SET_PLAYLIST_SCREEN_TIMER:
    //   return Object.assign({}, state, {
    //     ...SetScreenTimer,
    //     setPlaylistScreenTimer: action.payload,
    //   });

    // case ACTION_TYPE.GET_DAILY_CBT_SUCCESS:
    //   return Object.assign({}, state, {
    //     ...GetDailyCBTData,
    //     getDailyCBTData: action.payload,
    //     // isDailyLearning: true,
    //   });
    // case ACTION_TYPE.UPDATE_LIKE_COMMENT_RATING_SUCCESS:
    //   return Object.assign({}, state, {
    //     ...GetLikeCommentRatingData,
    //     getLikeCommentRatingData: action.payload,
    //   });
    // case ACTION_TYPE.ADD_QUE_ANS_SUCCESS:
    //   return Object.assign({}, state, {
    //     ...GetAddQueAnsData,
    //     getAddQueAnsData: action.payload,
    //   });
    // case ACTION_TYPE.ADD_INPUT_DATA_SUCCESS:
    //   return Object.assign({}, state, {
    //     ...GetAddInputData,
    //     getAddInputData: action.payload,
    //   });

    // case ACTION_TYPE.GET_ACTIVITY_TRACKER_SUCCESS:
    //   return Object.assign({}, state, {
    //     ...GetActivityTracker,
    //     getActivityTrackerData: action.payload,
    //   });

    // case ACTION_TYPE.SAVE_OTHER_ACTIVITY_SUCCESS:
    //   return Object.assign({}, state, {
    //     ...GetSaveOtherActivity,
    //     getSaveOtherActivityData: action.payload,
    //     isActivitySave: true,
    //   });

    // case ACTION_TYPE.GET_SELECTED_ACTIVITY_TRACKER_SUCCESS:
    //   return Object.assign({}, state, {
    //     ...GetSelectedActivityTracker,
    //     getSelectedActivityTracker: action.payload,
    //   });

    // case ACTION_TYPE.DELETE_CUSTOM_ACTIVITY_SUCCESS:
    //   return Object.assign({}, state, {
    //     ...DeleteCustomActivity,
    //     getDeletCustomActivity: action.payload,
    //   });



    // case ACTION_TYPE.REFRESH_CHAT_LIST:
    //   return Object.assign({}, state, {
    //     ...ChatlistUpdate,
    //     isChatlistUpdate: action.payload,
    //   });

    // case ACTION_TYPE.UPDATE_PTIENT_WEEK_DAY_SUCCESS:
    //   return Object.assign({}, state, {
    //     ...GetGreenCheck,
    //     isDailyLearning: true,
    //     getGreenCheckData: action.payload,
    //     // isChatlistUpdate: action.payload,
    //   });


    default:
      return state;
  }
}
export default dashboardReducer;
