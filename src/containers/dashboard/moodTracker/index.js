// @ts-nocheck
import * as AppActions from "@actions";
import { navigatorPop, navigatorPopTo } from "@config/navigationOptions";
import GLOBALS from "@constants";
import moment from "moment";
import React, { Component, lazy } from "react";
import { StyleSheet, View, AppState, Platform } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
const { COLOR, STRINGS } = GLOBALS;
const MoodComponent = lazy(() =>
  import("@components/dashboard/moodTracker")
);
import * as ICONS from "@images";
const Header = lazy(() => import("@components/common/Header"));
import momentZone from "moment-timezone";
let currentTimeZone = momentZone.tz.guess();
import { strings } from "@localization";

const timeStamp = moment().format();
const currentDate = moment(timeStamp).format('YYYY-MM-DD');

class MoodTracker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: "Schedule",
      activeAppointmentTab: "Upcoming",
      apiCall: 0,
      appointmetData: [],
      refresh: false,
      isMoodUpdate: true,
      prevMoodId: "",
      appState: AppState.currentState,
    };
    // this._getSymptomsMCQ(moment().toISOString());
    // this._startTime();
    this._fetchActivityData()
  }

  componentDidMount() {
    AppState.addEventListener("change", this._handleAppStateChange);
  }

  componentWillUnmount() {
    // AppState.removeEventListener("change", this._handleAppStateChange);
  }

  _handleAppStateChange = (nextAppState) => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      this._startTime();
    } else {
      let { activeScreenStartTime } = this.props;
      let postData = {
        group: STRINGS.PATIENT_REPORTED_OUTCOMES,
        event: "mood_tracker",
        inTime: activeScreenStartTime,
        outTime: moment().format(),
        activityDate: moment().format(),
      }
      if (Platform.OS == "android") {
        this.props.AppActions.addTimeTraker(postData);
      } else if (
        Platform.OS == "ios" &&
        this.state.appState.match(/inactive|background/) !== null
      ) {
        this.props.AppActions.addTimeTraker(postData);
      }
    }
    this.setState({ appState: nextAppState });
  };

  _startTime() {
    this.props.AppActions.getScreenStartTime(moment().format());
  }

  _fetchActivityData = () => {
    this.props.AppActions.fetchAllTrackers(this.props.trackerId, this.props.trackerType)
  }
  getFilterSize = (userArray, filterKey) => {
    let typeApptLength =
      userArray && userArray.filter((item) => item[filterKey]);
    return typeApptLength ? typeApptLength.length : null;
  };

  _getSymptomsMCQ = (userDate = moment().format("YYYY-MM-DD")) => {
    let { loginData } = this.props;
    let patientDate = moment().format(STRINGS.DATE_FORMAT_PATIENT);
    let timeZone = currentTimeZone;
    this.props.AppActions.getSymptomsMCQ(
      loginData["user"]["_id"],
      userDate,
      false,
      patientDate,
      timeZone
    );
  };

  _onRefreshAppointmentList = () => {
    let { loginData } = this.props;
    this.props.AppActions.getRefreshAppointmentList(loginData["user"]["_id"]);
  };
  _setActiveTab = (tabName) => {
    this.setState({ activeTab: tabName });
  };
  _setActiveAppointmentTab = (tabName) => {
    if (this.state.activeAppointmentTab != tabName) {
      this.setState({ activeAppointmentTab: tabName });
      this.fetchTypeAppointment(tabName);
    }
  };

  saveMood = (moodInput) => {
    // alert('Upcoming soon....')
    let { getAllTrackersResponse, componentId, activeScreenStartTime } = this.props;
    let todaysData;
    if (getAllTrackersResponse && getAllTrackersResponse !== null) {
      todaysData = getAllTrackersResponse?.filter(ele => moment(ele.date).format('YYYY-MM-DD') == currentDate)
    }

    console.log('todaysData>>>>', todaysData)
    if (todaysData !== undefined && todaysData.length > 0) {
      todaysData[0].data.push({
        value: moodInput?.selectedMoodData?.id,
        name: moodInput?.selectedMoodData?.name,
        tracker: moodInput?.selectedMoodData?.category,
        subtrackerId: moodInput?.selectedMoodData?._id
      })
      console.log('todaysData_11111>>>>', todaysData[0])

      this.props.AppActions.saveTrackers(todaysData[0], componentId);
    } else {
      let postData = {
        date: currentDate,
        trackerId: moodInput?.selectedMoodData?.trackerId,
        value: this.props.trackerType,
        data: [{
          value: moodInput?.selectedMoodData?.id,
          name: moodInput?.selectedMoodData?.name,
          tracker: moodInput?.selectedMoodData?.category,
          subtrackerId: moodInput?.selectedMoodData?._id,
          img: moodInput?.selectedMoodData?.img
        }]
      }
      console.log('postData', postData)
      this.props.AppActions.saveTrackers(postData, componentId);
    }

    let data = {
      group: STRINGS.PATIENT_REPORTED_OUTCOMES,
      event: "mood_tracker",
      inTime: activeScreenStartTime,
      outTime: moment().format(),
      activityDate: moment().format(),
    }
    this.props.AppActions.addTimeTraker(data);
  };

  _goBack() {
    let { componentId, activeScreenStartTime } = this.props;
    let postData = {
      group: STRINGS.PATIENT_REPORTED_OUTCOMES,
      event: "mood_tracker",
      inTime: activeScreenStartTime,
      outTime: moment().format(),
      activityDate: moment().format(),
    }
    this.props.AppActions.addTimeTraker(postData);
    navigatorPop({ componentId });
  }

  render() {
    let {
      moodData, //moodData is comming from previous screen props
      GetAllSymptomsData,
      isGetAllSymptomsLoading,
      isRefreshingSymptomsList,
      /* Type Appt */
      TypeAppointmentData,
      PostSymptomData,
      isPostSymptomLoading,
      getAllTrackersResponse
      /* Legend Symptom List */
    } = this.props;
    console.log('getAllTrackersResponse', getAllTrackersResponse)
    let savedDataArray;
    if (getAllTrackersResponse && getAllTrackersResponse !== null) {
      let todaysData = getAllTrackersResponse?.filter(ele => moment(ele.date).format('YYYY-MM-DD') == currentDate)
      if (todaysData[0]?.data !== undefined && todaysData[0]?.data.length > 0) {
        savedDataArray = todaysData[0].data[todaysData[0].data.length - 1];
      }
    }

    moodData !== undefined && moodData?.forEach(element => {
      if (element.id == 5) {
        element.image = ICONS.VeryHappy,
          element.activeImage = ICONS.VeryHappyActive
      } else if (element.id == 4) {
        element.image = ICONS.Happy,
          element.activeImage = ICONS.HappyActive
      } else if (element.id == 3) {
        element.image = ICONS.Confused,
          element.activeImage = ICONS.ConfusedActive
      } else if (element.id == 2) {
        element.image = ICONS.Sad,
          element.activeImage = ICONS.SadActive
      } else if (element.id == 1) {
        element.image = ICONS.Angry,
          element.activeImage = ICONS.AngryActive
      }
      if (element._id == savedDataArray?.subtrackerId) {
        element.isClickTrue = true
      } else {
        element.isClickTrue = false;
      }
    })


    // console.log('moodArray>>>>>', moodData)
    //condition
    // if (this.state.isMoodUpdate) {
    //   if (GetAllSymptomsData !== null) {
    //     let moodIndex;
    //     if (
    //       GetAllSymptomsData.data.length > 0 &&
    //       GetAllSymptomsData.data[0].mood !== undefined
    //     ) {
    //       moodIndex = GetAllSymptomsData.data[0].mood;
    //     }
    //     // this.setState({ prevMoodId: moodIndex })
    //     if (moodIndex !== undefined) {
    //       moodList.forEach((element) => {
    //         if (element.id == moodIndex) {
    //           element.isClickTrue = true;
    //         } else {
    //           element.isClickTrue = false;
    //         }
    //       });
    //     } else {
    //       moodList.forEach((element) => {
    //         element.isClickTrue = false;
    //       });
    //     }
    //   }
    // }
    return (
      <View style={Styles.homeContainer}>
        <Header
          isLeftIcon={true}
          isRightIcon={false}
          onLeftIconClick={() => {
            this._goBack();
          }}
          // isMiddleIcon={true}
          isLogout={false}
          isTitle={true}
          title={strings.mood.MoodCheckIn}
          titleStyle={{
            fontSize: RFValue(28),
            paddingTop: RFValue(10),
          }}
        // logoutApi={() => { this._onLogoutClick() }}
        />

        <View style={{ flex: 0.9, paddingHorizontal: RFValue(20) }}>
          <View style={{ flex: 1 }}>
            <MoodComponent
              symptomsMCQ={{
                GetAllSymptomsData,
                isGetAllSymptomsLoading,
                isRefreshingSymptomsList,
                PostSymptomData,
                isPostSymptomLoading,
              }}
              saveMood={this.saveMood}
              moodData={moodData}
              isRefresh={this.state.refresh}
            />
          </View>
        </View>
      </View>
    );
  }
}

const mapStateToProps = ({ authReducer, dashboardReducer }) => ({
  /* Login */
  isLoggedIn: authReducer.isLoggedIn,
  loginData: authReducer.loginData,
  /* Symptom QA list */
  GetAllSymptomsData: dashboardReducer.GetAllSymptomsData,
  isGetAllSymptomsLoading: dashboardReducer.isGetAllSymptomsLoading,
  isRefreshingSymptomsList: dashboardReducer.isRefreshingSymptomsList,

  activeScreenStartTime: dashboardReducer.getScreenStartTime,
  user_language: authReducer.language,
  getAllTrackersResponse: dashboardReducer.getAllTrackersResponse1,


});
const mapDispatchToProps = (dispatch) => ({
  AppActions: bindActionCreators(AppActions, dispatch),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MoodTracker);
const Styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    backgroundColor: COLOR.BACKGROUND,
  },
});
