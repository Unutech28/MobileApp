// @ts-nocheck
import * as AppActions from "@actions";
import GLOBALS from "@constants";
import React, { Component, lazy } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Linking,
  Alert,
  AppState,
} from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
const { COLOR, STRINGS } = GLOBALS;
import moment from "moment";
import { Navigation } from "react-native-navigation";
import {
  navigatorPop,
  navigatorPush,
  navigatorListners,
} from "@config/navigationOptions";
import Pdf from "react-native-pdf";
import { Platform } from "react-native";
const Header = lazy(() => import("@components/common/Header"));
const PlaylistComponent = lazy(() => import("@components/dashboard/playlist"));
import momentZone from "moment-timezone";
let currentTimeZone = momentZone.tz.guess();
import ImagePicker from "react-native-image-crop-picker";
import {
  alertWithTwoBtnCancel,
  alertWithOneBtn,
  checkIfDateIsNotToday,
} from "@helpers/common";
import AlertModal from "../../../components/common/AlertModal";
import { checkPreviousCardUnread } from "@components/dashboard/dailyLearningTemplates/utilities";
import { strings } from "@localization";

class Playlist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPdf: false,
      source: "",
      showWebView: false,
      appState: AppState.currentState,
      profileModel: false,
      temp: 0,
    };
    // this._getPlaylist();
    // this.getAssessments();
    // this.getSleepData();
    // this.getLastSeen('open');
    // this.goToSleepTracker = this.goToSleepTracker.bind(this);
    this._startTime();
    this._getActiveWeekDay();
    this._getAllTeckersList();
  }

  componentDidMount() {
    console.log("componentDidMount===>222");
    this._getActiveWeekDay();
    this._getAllTeckersList();
    setTimeout(() => {
      this.props.AppActions.getProgramStageStatus();
    }, 1500);
    this.setState({ temp: this.state.temp + 1 });

    AppState.addEventListener("change", this._handleAppStateChange);
  }

  componentWillUnmount() {
    console.log("componentWillUnmount");
  }
  _getAllTeckersList() {
    console.log("_getAllTeckersList() Api call===>");
    this.props.AppActions.getAllTrackersList();
    this.props.AppActions.getPlayListPoints();
    this.props.AppActions.getHelp();
  }
  _getActiveWeekDay() {
    console.log(this.props, "llllll");
    let { loginData, activeProgramTimeStamp } = this.props;
    this.props.AppActions.getProgramTrack(
      loginData?.profile?.activatedProg?._id
    );

    // if (this.props?.customProps.openChat) {
    //   this.goToChatBot()
    // }
  }

  getSleepData() {
    let { loginData } = this.props;
    let today = new Date();
    let postData = {
      user_id: loginData["user"]["_id"],
      sleepdate: moment(today)
        .subtract(1, "days")
        .format(STRINGS.DATE_FORMAT_PATIENT),
      patientDate: moment().format(STRINGS.DATE_FORMAT_PATIENT),
      timeZone: currentTimeZone,
    };
    this.props.AppActions.getSleepTraker(postData);
  }

  getLastSeen(status) {
    let data = {
      lastSeen: moment().format(),
    };
    this.props.AppActions.updateUserLastSeen(data);
  }

  _handleAppStateChange = (nextAppState) => {
    console.log("_handleAppStateChange");
    console.log(nextAppState, "nextAppState.....", this.state.appState);
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      console.log("API hit... if.");
      // this.getLastSeen("open");
      this._startTime();
    } else {
      console.log("API hit....");
      let postData = {
        group: STRINGS.ENGAGEMENT,
        event: "Playlist",
        inTime: this.props.activeScreenStartTime,
        outTime: moment().format(),
        activityDate: moment().format(),
      };
      if (Platform.OS == "android") {
        this.props.AppActions.addTimeTraker(postData);
        this.getLastSeen("close");
      } else if (
        Platform.OS == "ios" &&
        this.state.appState.match(/inactive|background/) !== null
      ) {
        this.props.AppActions.addTimeTraker(postData);
        this.getLastSeen("close");
      }
    }
    this.setState({ appState: nextAppState });
  };
  componentWillReceiveProps() {
    console.log("componentWillReceiveProps");
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.temp !== nextState.temp) {
      return true;
    }
    return true;
  }
  componentDidUpdate(prevProps, prevState) {
    console.log("componentDidUpdate");
    if (
      this.props.isMoodSave !== null &&
      this.props.isMoodSave !== prevProps.isMoodSave
    ) {
      this._getAllTeckersList();
    }

    if (
      this.props.isSleepSave !== undefined &&
      this.props.isSleepSave !== prevProps.isSleepSave
    ) {
      this._getAllTeckersList();
    }

    if (
      this.props.isActivitySave !== undefined &&
      this.props.isActivitySave !== prevProps.isActivitySave
    ) {
      this._getAllTeckersList();
    }

    if (
      this.props.isDailyLearning !== undefined &&
      this.props.isDailyLearning !== prevProps.isDailyLearning
    ) {
      this._getPlaylist();
    }

    if (
      this.props.isCareConcernSave !== undefined &&
      this.props.isCareConcernSave !== prevProps.isCareConcernSave
    ) {
      this._getPlaylist();
    }
  }

  _getSymptomsMCQ = (userDate = moment().format("YYYY-MM-DD")) => {
    // let { loginData } = this.props;
    // this.props.AppActions.getSymptomsMCQ(loginData['user']['_id'], userDate);
  };

  getAssessments = () => {
    // let { loginData } = this.props;
    // let searchText = '';
    // this.props.AppActions.getAssessments(loginData.user._id, searchText);
  };

  _startTime() {
    this.props.AppActions.getScreenStartTime(moment().format());
  }

  _getPlaylist = () => {
    // const { loginData } = this.props;
    // let postData = {
    //   user_id: loginData.user._id,
    //   patientDate: moment().format(STRINGS.DATE_FORMAT_PATIENT),
    //   timeZone: currentTimeZone,
    // };
    // this.props.AppActions.getPlaylistDynamic(postData);
  };
  getPlaylistData = () => {
    // const { loginData } = this.props;
    // this.props.AppActions.getPlaylist(loginData.user._id);
  };
  setTaskToDone = (course_id) => {
    // const { loginData } = this.props;
    // const payload = {
    //   user_id: loginData.user._id,
    //   course_id: course_id,
    //   course_status: true,
    // };
    // this.props.AppActions.setTaskDone(payload);
  };

  goToDailyTracker = () => {
    const { componentId, GetAllSymptomsData } = this.props;
    navigatorPush({
      componentId,
      screenName: "DailyTracker",
    });
  };

  onTrackersClick = (data) => {
    console.log("onClickdata", data);
    const { componentId } = this.props;
    if (data?.tracker?.value == "mood") {
      navigatorPush({
        componentId,
        screenName: "MoodTracker",
        passProps: {
          moodData: data?.subtrackers,
          trackerId: data?.tracker?._id,
          trackerType: data?.tracker?.value,
        },
      });
    } else if (data?.tracker?.value == "activity") {
      navigatorPush({
        componentId,
        screenName: "ActivityTracker",
        passProps: {
          trackerId: data?.tracker?._id,
          activityData: data?.subtrackers,
          imageBaseURL: data?.baseurl,
          trackerType: data?.tracker?.value,
        },
      });
    } else if (data?.tracker?.value == "sleep") {
      // sleep
      navigatorPush({
        componentId,
        screenName: "SleepTracker",
        passProps: {
          trackerId: data?.tracker?._id,
          trackerType: data?.tracker?.value,
          // onGoBack: () => {
          //   this._getPlaylist();
          // },
        },
      });
    } else if (data?.tracker?.value == "temperature") {
      // temp
      // navigatorPush({
      //   componentId,
      //   screenName: "HealthKit",
      //   passProps: {
      //     trackerId: data?.tracker?._id
      //   },
      // });
    } else if (data?.tracker?.value == "weight") {
      // weight
      // navigatorPush({
      //   componentId,
      //   screenName: "ActivityTracker",
      //   passProps: {
      //     trackerId: data?.tracker?._id
      //   },
      // });
    }
  };

  goToChatBot = () => {
    let { componentId, authReducer } = this.props;
    // authReducer.loginData.isTempPass == true &&

    this.props.AppActions.manageChatbot(
      {},
      "fertilift",
      false,
      componentId,
      false
    ).then(() => {
      console.log("hit....");
      // navigatorPush({
      //   componentId,
      //   screenName: "Chatbot",
      // });
    });
    // this.props.AppActions.openChatBot({
    //   componentId: this.props.componentId,
    //   param: {
    //     answer: "start",
    //     tracker: "manual",
    //     user_id: this.props.loginData["user"]["_id"],
    //   },
    // }).then(() => {
    //   navigatorPush({
    //     componentId,
    //     screenName: "Chatbot",
    //   });
    // });
  };

  goToBodyTemperature = () => {
    let { componentId } = this.props;
    navigatorPush({
      componentId,
      screenName: "HealthKit",
    });
  };

  goToSleepTracker = () => {
    const { componentId } = this.props;
    navigatorPush({
      componentId,
      screenName: "SleepTracker",
      passProps: {
        onGoBack: () => {
          this._getPlaylist();
        },
      },
    });
  };

  _goToDetail = (item) => {
    const source = { uri: item, cache: true };
    this.setState({ showPdf: true, source: source });
  };

  _goToVoiceRecording = () => {
    const { componentId } = this.props;
    navigatorPush({
      componentId,
      screenName: "VoiceRecording",
    });
  };

  _openVideo = (item) => {
    let openUrlStatic =
      "https://cpcontents.adobe.com/public/prime-player/index_7c719682f0dfa3e6f6eea326b32e347e_production.html?lo_id=course:1783393&access_token=003c74fe212fc3fa223c3eee8b2bf0da&hostName=captivateprime.adobe.com";
    let { componentId } = this.props;
    navigatorPush({
      componentId,
      screenName: "FuildPlayer",
      passProps: { videoLinl: item },
    });
  };

  async openURL(url) {
    await Linking.openURL(url);
  }

  _backFromPdf() {
    this.setState({ showPdf: false });
    //Stop Time interval
  }
  onPopupOkayPress = () => {
    this.props.AppActions.togglePopup(false);
  };

  goToDailyCBT = () => {
    const {
      componentId,
      playlistDynamicRes,
      GetAllSymptomsData,
      loginData,
      activeProgramsDetails,
      selectedProgram,
      programReducer,
    } = this.props;
    // alert("coming soon...");
    if (
      activeProgramsDetails &&
      activeProgramsDetails.currentWeek > activeProgramsDetails.totalWeek
    ) {
      this.props.AppActions.togglePopup(true);
      return;
    }

    // let postData = {
    //   week:
    //   activeProgramsDetails !== undefined && activeProgramsDetails !== null
    //       ? activeProgramsDetails.currentWeek
    //       : 2,
    //   day:
    //   activeProgramsDetails !== undefined && activeProgramsDetails !== null
    //       ? activeProgramsDetails.currentDay
    //       : 3,
    //   // user_id: loginData['user']['_id'],
    //   // language: this.props.user_language,
    // };

    // this.props.AppActions.getCardsforDay(postData, 0, res => {
    //   navigatorPush({
    //     componentId,
    //     screenName: 'WeekInfoList',
    //     passProps: {
    //       // week: 1,
    //       // "day": 2,
    //       week:
    //       activeProgramsDetails !== undefined && activeProgramsDetails !== null
    //           ? activeProgramsDetails.currentWeek
    //           : 1,
    //       day:
    //       activeProgramsDetails !== undefined && activeProgramsDetails !== null
    //           ? activeProgramsDetails.currentDay
    //           : 1,
    //       onGoBack: () => {
    //         this._getPlaylist();
    //       },
    //     },
    //   });

    //   this.props.AppActions.markCardRead({
    //     user_id: loginData['user']['_id'],
    //     week: currentWeek.dailyLearningPointedWeek,
    //     day: currentWeek.dailyLearningPointedDay,
    //     card_number: this.props.currentCard.card_number,
    //     card_id: this.props.currentCard._id,
    //   });
    // });

    // return;

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
      stage: activeProgramsDetails.stage ? activeProgramsDetails.stage : null,
      // stageDay: parseInt(selectedProgram?.currentStage) ? parseInt(selectedProgram?.currentStage) : 1
      stageDay: parseInt(programReducer?.ActiveStage)
        ? parseInt(programReducer?.ActiveStage)
        : 1,
    };
    console.log(data, "data......");
    this.props.AppActions.setCardLimit(20);
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
            : programReducer?.activeCurrentWeek,
          day: activeProgramsDetails?.currentDay
            ? activeProgramsDetails?.currentDay
            : programReducer?.activeCurrentDay,
          type: "Home",
        },
      });
    });
  };

  goToActivityTracker = () => {
    const { componentId } = this.props;
    navigatorPush({
      componentId,
      screenName: "ActivityTracker",
      passProps: {
        onGoBack: () => {
          this._getPlaylist();
        },
      },
    });
  };

  goToDiaper = () => {
    const { componentId } = this.props;
    navigatorPush({
      componentId,
      screenName: "SleepTracker",
      passProps: {
        data: {
          type: "diaper",
          title: "Diaper Tracking",
          heading: "How many diapers did you change in the last 24 hours?",
          graph_heading: "Daily Diaper Tracker: Hours/Day",
        },
        onGoBack: () => {
          this._getPlaylist();
        },
      },
    });
  };
  goToBabySleep = () => {
    const { componentId } = this.props;
    navigatorPush({
      componentId,
      screenName: "SleepTracker",
      passProps: {
        data: {
          type: "diaper",
          title: "Sleep Tracking",
          heading:
            "How many hours did your baby sleep today/in the last day including naps?",
          graph_heading: "Daily Sleep Tracker: Hours/Day",
        },
        onGoBack: () => {
          this._getPlaylist();
        },
      },
    });
  };
  onPressAssessment = (assessment) => {
    const { componentId } = this.props;
    const { _id, name, patient_assessment_id } = assessment;
    navigatorPush({
      componentId,
      screenName: "AssessmentDetail",
      passProps: {
        assessment_id: _id,
        assessmentName: name,
        patientAssessmentId: patient_assessment_id,
        screen: "playlist",
      },
    });
  };

  requestCameraPermission = () => {
    const granted = PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    } else {
    }
    return granted;
  };

  _openGallery = () => {
    if (Platform.OS === "android") {
      if (this.requestCameraPermission()) {
        this.openGallery();
      } else {
        this.requestCameraPermission();
      }
    } else {
      this.openGallery();
    }
  };

  openGallery = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      mediaType: "photo",
      compressImageQuality: 0.8,
      cropping: true,
    }).then((res) => {
      this.setState({ profileUrl: res.path, profileModel: true });

      // this._uploadImage(res, "image")
      // this.setState({ isModelVisible: 0 })
    });
  };

  goToPointsScreen = () => {
    let { componentId } = this.props;
    navigatorPush({
      componentId,
      screenName: "Points",
    });
  };

  goToSettings = () => {
    let { componentId } = this.props;
    navigatorPush({
      componentId,
      screenName: "Settings",
    });
  };

  _setProfileModel = () => {
    this.setState({ profileModel: false });
  };

  render() {
    const {
      getAllTrackers,
      activeProgramsDetails,
      userProfile,
      myPlaylist,
      playlistLoader,

      playlistDynamicLoader,
      playlistDynamicRes,

      allAssessments,
      assessmentLoader,
      getDailyLearningStatus,
      getMoodStatus,
      getActivityStatus,
      getSleepStatus,
      loginData,
      programReducer,
      allPoints,
    } = this.props;
    let firstName,
      profile,
      lastName = "";
    if (userProfile) {
      firstName = userProfile.firstname;
      profile = userProfile.img;
    }

    return (
      <View style={Styles.homeContainer}>
        {this.state.showPdf ? (
          <Header
            isLeftIcon={true}
            isTitle={true}
            isRightIcon={false}
            onLeftIconClick={() => {
              this._backFromPdf();
            }}
            title={this.state.webViewUrl ? "Postpartum CBT" : "CBT Courses"}
          />
        ) : null}

        {!this.state.showPdf ? (
          <PlaylistComponent
            getActiveProgramsDetails={activeProgramsDetails}
            myPlaylist={myPlaylist !== undefined ? myPlaylist : []}
            playlistDynamicRes={
              playlistDynamicRes !== undefined ? playlistDynamicRes : []
            }
            firstName={firstName}
            lastName={lastName}
            playlistLoader={playlistLoader}
            playlistDynamicLoader={playlistDynamicLoader}
            setTaskToDone={this.setTaskToDone}
            goToDailyTrackerScreen={this.goToDailyTracker}
            goToSleepTracker={this.goToSleepTracker}
            goToChatBot={this.goToChatBot}
            goToBodyTemperature={this.goToBodyTemperature}
            openPdf={this._goToDetail}
            openVideo={this._openVideo}
            goToDailyCBT={this.goToDailyCBT}
            goToActivityTracker={this.goToActivityTracker}
            goToDiaper={this.goToDiaper}
            goToBabySleep={this.goToBabySleep}
            allAssessments={allAssessments}
            assessmentLoader={assessmentLoader}
            onPressAssessment={this.onPressAssessment}
            getDailyLearningStatus={getDailyLearningStatus}
            getMoodStatus={getMoodStatus}
            getActivityStatus={getActivityStatus}
            getSleepStatus={getSleepStatus}
            goToVoiceRecording={this._goToVoiceRecording}
            totalWeeksToShow={
              playlistDynamicRes !== undefined
                ? playlistDynamicRes.totalWeeks !== null
                  ? playlistDynamicRes.totalWeeks
                  : 1
                : 1
            }
            profileModel={this.state.profileModel}
            setProfileModel={this._setProfileModel}
            goToGallery={this._openGallery}
            profileUrl={profile}
            //profileUrl={this.props.profileUrl}
            onPointsClick={this.goToPointsScreen}
            onSettingOpen={() => this.goToSettings()}
            allTrackersDynamic={getAllTrackers}
            onTrackersClick={this.onTrackersClick}
            getAllTeckersList={this._getAllTeckersList}
            points={allPoints}
          />
        ) : (
          <View style={Styles.pdfMainView}>
            <Pdf
              source={this.state.source}
              onLoadComplete={(numberOfPages, filePath) => {}}
              onPageChanged={(page, numberOfPages) => {}}
              onError={(error) => {}}
              onPressLink={(uri) => {}}
              style={Styles.pdfStyle}
            />
          </View>
        )}
        {/* <AlertModal
          visible={this.props.popupStatus}
          //visible={true}
          description={strings.home.complete_learning}
          onYesPress={this.onPopupOkayPress}
        /> */}
      </View>
    );
  }
}
const mapStateToProps = ({
  authReducer,
  programReducer,
  playlistReducer,
  dashboardReducer,
  assessmentsReducer,
  cardsReducer,
}) => ({
  loginData: authReducer.loginData,
  userProfile: authReducer.loginData?.user,
  activeProgramsDetails: programReducer?.activeProgramDetail,
  activeProgramTimeStamp: programReducer?.getActiveProgramTimeStamp,
  getAllTrackers: dashboardReducer.getAllTrackers,
  selectedProgram: programReducer.selectedProgram,
  refeshAPI: dashboardReducer.isActivitySave,
  activeScreenStartTime: dashboardReducer.getScreenStartTime,
  programReducer: programReducer,
  allPoints: dashboardReducer.playlistPointData,
  authReducer: authReducer,
});
const mapDispatchToProps = (dispatch) => ({
  AppActions: bindActionCreators(AppActions, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(Playlist);
const Styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    // backgroundColor: '#6EC592'
  },
  pdfMainView: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  pdfStyle: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
