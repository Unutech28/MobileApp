// @ts-nocheck
import * as AppActions from "@actions";
import { navigatorPop, navigatorPush } from "@config/navigationOptions";
import GLOBALS from "@constants";
import React, { Component, lazy } from "react";
import { StyleSheet, View, AppState, Platform } from "react-native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Styles from "./styles";
const { COLOR, STRINGS, PRODUCT_TYPE } = GLOBALS;

const ActivityTrackerComponent = lazy(() =>
  import("@components/dashboard/activityTracker")
);
const Header = lazy(() => import("@components/common/Header"));
const ScheduleTab = lazy(() =>
  import("@components/dashboard/activityTracker/tab")
);
import moment from "moment";
import momentZone from "moment-timezone";
import { strings } from "@localization";

let currentTimeZone = momentZone.tz.guess();

let otherResponse = [];

class ActivityTracker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refresh: false,
      activeTab: strings.activity.Activities,

      isRefresh: false,
      appState: AppState.currentState,

      // otherResponse: []
    };
    this._fetchActivityData();
    // this._callActivityTrackerAPI();
    this._startTime();
    console.log("activityData>>>>>", this.props.activityData);
  }

  _fetchActivityData = () => {
    this.props.AppActions.fetchAllTrackers(
      this.props.trackerId,
      this.props.trackerType
    );
  };

  tabsType =
    PRODUCT_TYPE != "CU002"
      ? [
          {
            title: strings.activity.Activities,
            id: 0,
          },
          {
            title: strings.activity.DailyActivities,
            id: 1,
          },
        ]
      : [
          {
            title: strings.activity.DailyActivities,
            id: 0,
          },
        ];
  componentDidMount() {
    AppState.addEventListener("change", this._handleAppStateChange);
  }

  componentWillUnmount() {
    // AppState.removeEventListener('change', this._handleAppStateChange);
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
        group: STRINGS.ENGAGEMENT,
        event: "activity_tracker",
        inTime: activeScreenStartTime,
        outTime: moment().format(),
        activityDate: moment().format(),
      };

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

  _callActivityTrackerAPI() {
    let { loginData } = this.props;
    let postData = {
      hospital_id: loginData.user.hospital_id,
      patient_id: loginData.user._id,
      patientDate: moment().format(STRINGS.DATE_FORMAT_PATIENT),
      timeZone: currentTimeZone,
    };

    this.props.AppActions.getActivityTrackerApi(postData);
    this.props.AppActions.getSelectedActivityTracker(postData);
  }

  onSubmitActivity = (activityData) => {
    let { componentId, activeScreenStartTime } = this.props;
    const timeStamp = moment().format();
    const currentDate = moment(timeStamp).format("YYYY-MM-DD");
    let postData = {
      date: currentDate,
      value: this.props.trackerType,
      trackerId: this.props.trackerId,
      data: activityData,
    };
    console.log("postData>>", postData);
    this.props.AppActions.saveTrackers(postData, componentId);
    let data = {
      group: STRINGS.ENGAGEMENT,
      event: "activity_tracker",
      inTime: activeScreenStartTime,
      outTime: moment().format(),
      activityDate: moment().format(),
    };
    this.props.AppActions.addTimeTraker(data);
  };

  goToOtherActivity = (data) => {
    // alert('click')
    let { componentId, getActivityTrackerData, getSelectedActivityTracker } =
      this.props;

    let AddPlesantActivityArray = [];
    let selectedListArray = [];
    let id = "";

    AddPlesantActivityArray = this.props.activityData?.filter(
      (x) => x.category == "Custom Activities"
    );
    navigatorPush({
      componentId,
      screenName: "AddOtherActivity",
      passProps: {
        AddPlesantActivityArray: AddPlesantActivityArray,
        updateId: id,
        // selectedListArray: selectedListArray,
        selectedListArray: data,
        trackerId: this.props.trackerId,
      },
    });
  };

  _setActiveAppointmentTab = (tabName) => {
    if (this.state.activeTab != tabName) {
      this.setState({ activeTab: tabName });
      // this.fetchTypeAppointment(tabName);
    }
  };

  _goBack() {
    let { componentId, loginData, activeScreenStartTime } = this.props;
    let postData = {
      group: STRINGS.ENGAGEMENT,
      event: "activity_tracker",
      inTime: activeScreenStartTime,
      outTime: moment().format(),
      activityDate: moment().format(),
    };
    this.props.AppActions.addTimeTraker(postData);
    navigatorPop({ componentId });
  }
  render() {
    const timeStamp = moment().format();
    const currentDate = moment(timeStamp).format("YYYY-MM-DD");
    let { activeTab } = this.state;
    let { activityData, getAllTrackersResponse } = this.props;
    console.log("activityTrcakerRes", getAllTrackersResponse, activityData);
    getAllTrackersResponse &&
      activityData?.map((ele) =>
        getAllTrackersResponse.map((trackersData) => {
          if (moment(trackersData.date).format("YYYY-MM-DD") == currentDate) {
            trackersData?.data?.map((item) => {
              if (ele._id == item._id) {
                ele.isChecked = true;
              } else {
                if (
                  moment(trackersData.date).format("YYYY-MM-DD") != currentDate
                ) {
                  ele.isChecked = false;
                }
              }
            });
          }
        })
      );
    console.log("@@@@@@@activityData@@@@@@@@@", activityData);

    return (
      <View style={Styles.homeContainer}>
        <Header
          isLeftIcon={true}
          isRightIcon={false}
          onLeftIconClick={() => this._goBack()}
          isLogout={false}
          isTitle={true}
          title={
            PRODUCT_TYPE == "CU002"
              ? strings.activity.ActivityTrackerCU002
              : strings.activity.ActivityTracker
          }
          titleStyle={{ fontSize: RFValue(28), paddingTop: RFValue(10) }}
        />
        <View style={{ flex: 1 }}>
          <View style={{ flex: 0.1, marginTop: RFPercentage(3) }}>
            <ScheduleTab
              tabList={this.tabsType}
              activeTab={activeTab}
              setActiveTab={this._setActiveAppointmentTab}
            />
          </View>

          <View style={{ flex: 0.9, paddingHorizontal: RFValue(15) }}>
            <ActivityTrackerComponent
              onSubmitActivity={this.onSubmitActivity}
              goToOtherActivity={this.goToOtherActivity}
              activeTab={activeTab}
              activityData={activityData}
              imageBaseUrl={this.props.imageBaseURL}
              getAllTrackersResponse={getAllTrackersResponse}
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
  getActivityTrackerData: dashboardReducer.getActivityTrackerData,
  getSaveOtherActivityData: dashboardReducer.getSaveOtherActivityData,
  getSelectedActivityTracker: dashboardReducer.getSelectedActivityTracker,
  getDeletCustomActivity: dashboardReducer.getDeletCustomActivity,
  activeScreenStartTime: dashboardReducer.getScreenStartTime,
  user_language: authReducer.language,
  getAllTrackersResponse: dashboardReducer.getActivityTrackersResponse,
});
const mapDispatchToProps = (dispatch) => ({
  AppActions: bindActionCreators(AppActions, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(ActivityTracker);
