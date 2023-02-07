// @ts-nocheck
import * as AppActions from "@actions/";
import React, { Component, lazy } from "react";
import {
  StyleSheet,
  View,
  Alert,
  Modal,
  Dimensions,
  Text,
  TouchableOpacity,
  AppState,
} from "react-native";
import Styles from "./styles";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { RFValue } from "react-native-responsive-fontsize";
import { navigatorPush, navigatorPop } from "@config/navigationOptions";
import TabBar from "@components/common/tabBar";
import TabSwitcher, { TabPanel } from "@components/common/tabSwitcher";
const Dashboard = lazy(() => import("@components/dashboard"));
const Playlist = lazy(() => import("@containers/dashboard/playlist"));
const Reports = lazy(() => import("@containers/dashboard/reports"));
const { FONTS, COLOR, TABS } = GLOBALS;
// const Chat = lazy(() => import('@containers/dashboard/chat'));
const Chat = lazy(() => import("@containers/dashboard/chat/chatList"));
const Groups = lazy(() => import("@containers/dashboard/groups"));
const Help = lazy(() => import("@containers/dashboard/help"));
// const Journal = lazy(() => import('@containers/dashboard/journal'));
const Mood = lazy(() => import("@containers/dashboard/moodTracker"));
const Sleep = lazy(() => import("@containers/dashboard/sleepTrackerNew"));
const ActivityTracker = lazy(() =>
  import("@containers/dashboard/activityTracker")
);
import moment from "moment";
// const WeekInfoList = lazy(() => import("@containers/dashboard/weekInfoList"));
// const DailyLearning = lazy(() => import('@containers/dashboard/WeekInfoList'));
const Points = lazy(() => import("@containers/dashboard/points"));
import SocketIO from "../../utils/SocketIO";
//import AppleHealthKit from 'rn-apple-healthkit';
import messaging from "@react-native-firebase/messaging";
import GLOBALS from "@constants";
import { strings } from "@localization";
import AlertModal from "../../components/common/AlertModal";

const { STRINGS, PRODUCT_MS_URL } = GLOBALS;
const Header = lazy(() => import("@components/common/Header"));
class DashBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      notificationData: [],
      appState: AppState.currentState,
    };
    this._startTime();
    //  this.socket = SocketIO.initialize();
  }

  _startTime() {
    this.props.AppActions.getScreenStartTime(moment().format());
  }
  componentDidMount() {
    if (this.props.openChat) {
      let { loginData, authReducer } = this.props;

      this.props.AppActions.getProgramTrack(
        loginData?.profile?.activatedProg?._id,
        (res) => {
          console.log(res, "res.......");
          // authReducer.loginData.isTempPass == true &&
          //   this.props.AppActions.manageChatbot(
          //     {},
          //     "fertilift",
          //     false,
          //     this.props.componentId,
          //     false
          //   ).then(() => {
          //     console.log("hit....");
          //   });
        }
      );
      // this.props.AppActions.getProgramStageStatus();
    }
    this.getFCMToken();
    AppState.addEventListener("change", this._handleAppStateChange);
    // strings.setLanguage(this.props.user_language);

    // // Register background handler
    // messaging().setBackgroundMessageHandler(async remoteMessage => {
    //   console.log('Message handled in the background!', remoteMessage);
    // });

    // messaging().onNotificationOpenedApp(remoteMessage => {
    //   console.log(
    //     'Notification caused app to open from background state:',
    //     remoteMessage.notification,
    //   );
    // });
  }

  async getFCMToken() {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      console.log("fcmToken===>", fcmToken);
      this.props.AppActions.saveFcmToken(fcmToken);
    }
  }
  componentWillUnmount() {
    // // AppState.removeEventListener('change', this._handleAppStateChange);
  }
  _handleAppStateChange = (nextAppState) => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      // data = {
      //   user_id: loginData['user']['_id'],
      //   appStatus: 'open',
      // };
      // this.props.AppActions.updateUserLastSeen(data);
    } else {
      data = {
        lastSeen: moment().format(),
      };
      if (Platform.OS == "android") {
        this.props.AppActions.addTimeTraker(data);
      } else if (
        Platform.OS == "ios" &&
        this.state.appState.match(/inactive|background/) !== null
      ) {
        //  debugger
        this.props.AppActions.addTimeTraker(data);
      }
    }
    this.setState({ appState: nextAppState });
  };
  onPopupOkayPress = () => {
    this.props.AppActions.togglePopup(false);
  };

  _onPressTab = (index, item) => {
    let { componentId, playlistDynamicRes } = this.props;
    let currentWeek, currentday;
    if (playlistDynamicRes !== undefined && playlistDynamicRes !== null) {
      if (
        playlistDynamicRes.totalWeeks !== null &&
        playlistDynamicRes.totalWeeks !== undefined
      ) {
        if (playlistDynamicRes.week > playlistDynamicRes.totalWeeks) {
          currentWeek = playlistDynamicRes.totalWeeks;
          currentday = 7;
        } else {
          currentWeek = playlistDynamicRes.week;
          currentday = playlistDynamicRes.day;
        }
      } else {
        currentWeek = 1;
        currentday = 1;
      }
    } else {
      currentWeek = 1;
      currentday = 1;
    }

    if (item.id === 0) {
      navigatorPush({ componentId, screenName: "Assessments", passProps: {} });
    } else if (item.id === 1) {
      navigatorPush({ componentId, screenName: "CareTeam", passProps: {} });
    } else if (item.id === 2) {
      navigatorPush({ componentId, screenName: "Symptoms", passProps: {} });
    } else if (item.id === 3) {
      // add apple health kit here and one msg
      // this.callAppleHealthKit()
    } else if (item.id === 4) {
      navigatorPush({ componentId, screenName: "Journal", passProps: {} });
    } else if (item.id === 5) {
      navigatorPush({
        componentId,
        screenName: "ProgramList",
        passProps: { week: currentWeek, day: currentday },
      });
    } else if (item.id === 6) {
      navigatorPush({ componentId, screenName: "Settings", passProps: {} });
    } else if (item.id === 7) {
      navigatorPush({ componentId, screenName: "Reports", passProps: {} });
    } else if (item.id === 8) {
      navigatorPush({ componentId, screenName: "DailyTracker", passProps: {} });
    }
  };
  onModalItemPress = (type, assessment, data) => {
    let {
      componentId,
      playlistDynamicRes,
      loginData,
      activeProgramsDetails,
      selectedProgram,
      programReducer,
    } = this.props;
    console.log("data comes ===>", data);
    let mood = {
      moodData: data?.subtrackers,
      trackerId: data?.tracker?._id,
      trackerType: data?.tracker?.value,
    };
    let activity = {
      trackerId: data?.tracker?._id,
      activityData: data?.subtrackers,
      imageBaseURL: data?.baseurl,
      trackerType: data?.tracker?.value,
    };
    let sleep = {
      trackerId: data?.tracker?._id,
      trackerType: data?.tracker?.value,
    };
    switch (type) {
      case "sleep":
        navigatorPush({
          componentId,
          screenName: "SleepTracker",
          passProps: sleep,
        });
        break;
      case "activity":
        navigatorPush({
          componentId,
          screenName: "ActivityTracker",
          passProps: activity,
        });
        break;
      case "mood":
        console.log("mood Press===>", mood);
        navigatorPush({
          componentId,
          screenName: "MoodTracker",
          passProps: mood,
        });
        break;
      case "journal":
        navigatorPush({ componentId, screenName: "Journal", passProps: {} });
        break;
      case "learning":
        // let postData = {
        //   week:
        //     playlistDynamicRes !== undefined && playlistDynamicRes !== null
        //       ? playlistDynamicRes.week
        //       : 2,
        //   day:
        //     playlistDynamicRes !== undefined && playlistDynamicRes !== null
        //       ? playlistDynamicRes.day
        //       : 3,
        //   // user_id: loginData['user']['_id'],
        //   // language: this.props.user_language,
        // };
        // this.props.AppActions.getCardsforDay(postData, 0, res => {
        //   navigatorPush({
        //     componentId,
        //     screenName: 'WeekInfoList',
        //     passProps: {
        //       week:
        //         playlistDynamicRes !== undefined && playlistDynamicRes !== null
        //           ? playlistDynamicRes.week
        //           : 1,
        //       day:
        //         playlistDynamicRes !== undefined && playlistDynamicRes !== null
        //           ? playlistDynamicRes.day
        //           : 1,
        //     },
        //   });
        // });
        // let data = {
        //   programId: loginData?.profile?.activatedProg._id,
        //   week: parseInt(
        //     activeProgramsDetails?.currentWeek
        //       ? activeProgramsDetails?.currentWeek
        //       : null
        //   ),
        //   day: parseInt(
        //     activeProgramsDetails?.currentDay
        //       ? activeProgramsDetails?.currentDay
        //       : null
        //   ),
        //   stage: activeProgramsDetails.stage
        //     ? activeProgramsDetails.stage
        //     : null,
        //   stageDay: parseInt(programReducer?.ActiveStage)
        //     ? parseInt(programReducer?.ActiveStage)
        //     : 1,
        // };
        let data = {
          programId: loginData?.profile?.activatedProg._id,
          week: parseInt(
            activeProgramsDetails?.currentWeek
              ? activeProgramsDetails?.currentWeek
              : programReducer?.activeCurrentWeek
          ),
          day: parseInt(
            activeProgramsDetails?.currentDay
              ? activeProgramsDetails?.currentDay
              : programReducer?.activeCurrentDay
          ),
          stage: activeProgramsDetails.stage
            ? activeProgramsDetails.stage
            : null,
          // stageDay: parseInt(selectedProgram?.currentStage) ? parseInt(selectedProgram?.currentStage) : 1
          stageDay: parseInt(programReducer?.ActiveStage)
            ? parseInt(programReducer?.ActiveStage)
            : 1,
        };
        console.log(data, "data......");
        this.props.AppActions.getCardsList(data, 0, (res) => {
          console.log(
            "res......",
            activeProgramsDetails?.currentWeek
              ? activeProgramsDetails?.currentWeek
              : null
          );
          if (res.length == 0) {
            alert(strings.Content_not_available);
            return;
          }
          navigatorPush({
            componentId,
            screenName: "WeekInfoList",
            passProps: {
              week: activeProgramsDetails?.currentWeek
                ? activeProgramsDetails?.currentWeek
                : null,
              day: activeProgramsDetails?.currentDay
                ? activeProgramsDetails?.currentDay
                : null,
            },
          });
        });
        break;
      case "assessment":
        const { _id, name, patient_assessment_id, status } = assessment;
        navigatorPush({
          componentId,
          screenName: "AssessmentDetail",
          passProps: {
            assessment_id: _id,
            assessmentName: name,
            patientAssessmentId: patient_assessment_id,
            assessment_status: status,
          },
        });
        break;
      default:
        break;
    }
  };

  render() {
    let { componentId, isLoading } = this.props;
    return (
      <View style={Styles.homeContainer}>
        <TabSwitcher>
          <TabPanel whenActive={STRINGS.WALL}>
            <View
              style={{
                flex: 1,
                backgroundColor: COLOR.BACKGROUND,
              }}
            >
              <Header
                isLeftIcon={false}
                isRightIcon={false}
                isTitle={true}
                title={strings.resource.resources}
                isLogout={false}
                titleStyle={{
                  paddingTop: RFValue(10),
                }}
                //   primary={this.props.themeData.primary}
              />
              <Dashboard
                onPressTab={this._onPressTab}
                logout={this._logout}
                dashLoader={isLoading}
              />
            </View>
          </TabPanel>
          <TabPanel whenActive={STRINGS.PLAYLIST}>
            <Playlist componentId={componentId} customProps={this.props} />
          </TabPanel>

          <TabPanel whenActive={STRINGS.CHAT}>
            <Chat componentId={componentId} />
          </TabPanel>

          <TabPanel whenActive={STRINGS.HELP}>
            <Help componentId={componentId} />
          </TabPanel>

          <TabBar
            onModalItemPress={(type, assessment, data) => {
              this.onModalItemPress(type, assessment, data);
            }}
          />
        </TabSwitcher>
        <AlertModal
          visible={this.props.popupStatus}
          description={strings.home.complete_learning}
          onYesPress={this.onPopupOkayPress}
        />
      </View>
    );
  }
}
const mapStateToProps = ({
  authReducer,
  playlistReducer,
  dashboardReducer,
  programReducer,
}) => ({
  isLoading: authReducer.isLoading,
  loginData: authReducer.loginData,
  user_language: authReducer.language,
  popupStatus: dashboardReducer.isPopupShow,
  activeProgramsDetails: programReducer.activeProgramDetail,
  programReducer: programReducer,
  authReducer: authReducer,
  activeScreenStartTime: dashboardReducer.getScreenStartTime,
});
const mapDispatchToProps = (dispatch) => ({
  AppActions: bindActionCreators(AppActions, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(DashBoard);
