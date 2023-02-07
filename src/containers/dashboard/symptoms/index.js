// @ts-nocheck
import * as AppActions from "@actions";
import AppointmentList from "@components/dashboard/symptoms/appointmentList";
import ScheduleTab from "@components/dashboard/symptoms/tabs";
import { navigatorPop, navigatorPush } from "@config/navigationOptions";
import GLOBALS from "@constants";
import moment from "moment";
import momentZone from "moment-timezone";
import React, { Component, lazy } from "react";
import { StyleSheet, View, PermissionsAndroid } from "react-native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
const { COLOR, STRINGS } = GLOBALS;
const SymptomsComponent = lazy(() => import("@components/dashboard/symptoms"));
import * as ICONS from "@images";
import { strings } from "@localization";

const Header = lazy(() => import("@components/common/Header"));
const tabData = [
  // { title: 'Schedule', id: 1 },
  { title: strings.Schedule.Appointment, id: 2 },
];
const tabsAppointmentType = [
  { title: strings.Schedule.BOOKED, id: 1 },
  { title: strings.Schedule.UPCOMING, id: 2 },
  { title: strings.Schedule.COMPLETED, id: 3 },
  { title: strings.Schedule.MISSED, id: 4 },
];

class Symptoms extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: strings.Schedule.Appointment,
      activeAppointmentTab: strings.Schedule.BOOKED,
      apiCall: 0,
      appointmetData: [],
      refresh: false,
      isMoodUpdate: true,
      moodList: [
        {
          id: 0,
          image: ICONS.VeryHappy,
          activeImage: ICONS.VeryHappyActive,
          isClickTrue: false,
        },
        {
          id: 1,
          image: ICONS.Happy,
          activeImage: ICONS.HappyActive,
          isClickTrue: false,
        },
        {
          id: 2,
          image: ICONS.Confused,
          activeImage: ICONS.ConfusedActive,
          isClickTrue: false,
        },
        {
          id: 3,
          image: ICONS.Sad,
          activeImage: ICONS.SadActive,
          isClickTrue: false,
        },
        {
          id: 4,
          image: ICONS.Angry,
          activeImage: ICONS.AngryActive,
          isClickTrue: false,
        },
      ],
    };
    // this._getAllAppointments();
    // this._getSymptomsMCQ(moment().toISOString());
    // this.fetchTypeAppointment();
    // this._fetchLegends(moment().format("YYYY-MM-DD"));
  }

  componentWillReceiveProps(nextProps) {
    let { componentId } = this.props;
    let data = this.state.appointmetData;
    if (this.state.apiCall === 1) {
      if (nextProps.isNotificationSuccess) {
        // let postDataGT = {
        //   "userName": data.patient_name,
        //   "userId": data.patient_user_id,
        //   "appointmentId": data.appointment_request_id,
        // }
        // this.props.AppActions.getVideoToken(postDataGT);
        // this.setState({ apiCall: 2 })
        navigatorPush({
          componentId,
          screenName: "Vidyo",
          passProps: {
            userName: data.patient_name,
            userId: data.patient_user_id,
            appointmentId: data.appointment_request_id,
            roomToken: "",
          },
        });
        this.setState({ apiCall: 0 });
      }
    }
    // if (this.state.apiCall === 2) {
    //   if (nextProps.isVideoCallTokenSuccess) {
    //     navigatorPush({
    //       componentId, screenName: 'Vidyo', passProps: {
    //         "userName": data.patient_name,
    //         "userId": data.patient_user_id,
    //         "appointmentId": data.appointment_request_id,
    //         roomToken: nextProps.videoCallTokenData
    //       }
    //     });
    //   }
    //   this.setState({ apiCall: 0 })
    // }
  }

  getFilterSize = (userArray, filterKey) => {
    let typeApptLength =
      userArray && userArray.filter((item) => item[filterKey]);
    return typeApptLength ? typeApptLength.length : null;
  };
  _getAllAppointments = () => {
    let { loginData } = this.props;
    this.props.AppActions.getAllAppointments(loginData["user"]["_id"]);
  };
  _getSymptomsMCQ = (userDate = moment().format("YYYY-MM-DD")) => {
    let { loginData } = this.props;
    this.props.AppActions.getSymptomsMCQ(loginData["user"]["_id"], userDate);
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

  _onPressAddSymptom = (symptomInput) => {
    this.setState({ isMoodUpdate: false });
    let { loginData, user_language } = this.props;
    this.props.AppActions.postAddSymptom({
      user_id: loginData["user"]["_id"],
      ...symptomInput,
    }, "", "", "", user_language);
  };
  fetchTypeAppointment = (
    itemType = strings.Schedule.BOOKED,
    isRefresh = false
  ) => {
    let { loginData } = this.props;
    this.props.AppActions.getAppointmentListByType({
      user_id: loginData["user"]["_id"],
      isRefresh,
      itemType,
    });
  };
  _fetchLegends = (date = moment().format("YYYY-MM-DD"), isRefresh = false) => {
    let { loginData } = this.props;
    this.props.AppActions.getCalendarSymptom({
      user_id: loginData["user"]["_id"],
      isRefresh,
      date,
    });
  };

  async requestLocationPermission() {
    const chckLocationPermission = PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );
    if (chckLocationPermission === PermissionsAndroid.RESULTS.GRANTED) {
    } else {
      try {
        const grantedCamera = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "Curio Camera Permission",
            message: "Curio  needs access to your camera ",
          }
        );

        const grantedMicrophone = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: "Curio  Microphone Permission",
            message: "Curio  needs access to your camera ",
          }
        );

        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Curio Location Permission",
            message: "Curio needs access to your location.",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          //alert("You've access for the location");
        } else if (grantedCamera === PermissionsAndroid.RESULTS.GRANTED) {
          //alert("You've access for the location");
        } else {
          //alert("You don't have access for the location");
        }
      } catch (err) {
        alert(err);
      }
    }
  }

  _goToVideoCall = (item) => {
    this.setState({ appointmetData: item });
    if (Platform.OS === "android") {
      try {
        this.requestLocationPermission();
      } catch (err) {
        console.warn(err);
      }
    }
    //Check call time API
    let { loginData, isCheckTimeSuccess } = this.props;
    let currentTimeZone = momentZone.tz.guess();
    let userTime = momentZone.tz(new Date(), currentTimeZone).format();

    if (loginData) {
      // Check Time api
      let postData = {
        patient_user_id: loginData["user"]["_id"],
        appointment_request_id: item.appointment_request_id,
        user_timezone: currentTimeZone,
        user_time: userTime,
      };
      // this.props.AppActions.checkCallTime(postData);
      // if (isCheckTimeSuccess) {
      //Notification API
      let postDataN = {
        appointment_request_id: item.appointment_request_id,
        patient_name: item.patient_name,
        caretaker_name: item.caretaker_name,
        hospital_user_id: item.hospital_user_id,
        caretaker_user_id: item.caretaker_user_id,
        patient_user_id: item.patient_user_id,
        appointment_time: item.appointment_time,
        appointment_date: item.appointment_date,
      };
      this.setState({ apiCall: 1 });
      this.props.AppActions.sendNotification(postDataN);
    }
  };

  render() {
    let {
      componentId,
      GetAllAppointmentData,
      isGetAllAppointmentLoading,
      isRefreshingAppointmentList,
      GetAllSymptomsData,
      isGetAllSymptomsLoading,
      isRefreshingSymptomsList,
      /* Type Appt */
      TypeAppointmentData,
      isTypeAppointmentLoading,
      isTypeAppointmentRefreshing,
      PostSymptomData,
      isPostSymptomLoading,
      /* Legend Symptom List */
      isGetLegendSymptomSuccess,
      GetLegendSymptomData,
      isGetLegendSymptomLoading,
      isGetLegendSymptomRefreshing,
      isGetLegendSymptomFail,

      loginData,
    } = this.props;
    let { activeTab, activeAppointmentTab } = this.state;
    let typeApptLength = this.getFilterSize(TypeAppointmentData, "date");

    //condition
    if (this.state.isMoodUpdate) {
      if (GetAllSymptomsData !== null) {
        let moodIndex;
        if (
          GetAllSymptomsData.data.length > 0 &&
          GetAllSymptomsData.data[0].mood !== undefined
        ) {
          moodIndex = GetAllSymptomsData.data[0].mood;
        }
        if (moodIndex !== undefined) {
          this.state.moodList.forEach((element) => {
            if (element.id == moodIndex) {
              element.isClickTrue = true;
            } else {
              element.isClickTrue = false;
            }
          });
        }
      }
    }

    return (
      <View style={Styles.homeContainer}>
        {/* <Header
          isLeftIcon={true}
          isTitle={true}
          onLeftIconClick={() => {
            navigatorPop({ componentId });
          }}
          title="Calendar"
        />
         <Header
          isLeftIcon={true}
          isRightIcon={false}
          onLeftIconClick={() => {
            navigatorPop({ componentId });
          }}
          isMiddleIcon={true}
          logoutApi={() => { this.props.AppActions.logout(loginData['user']['_id']); }}
        />
        */}

        <Header
          isLeftIcon={true}
          isRightIcon={false}
          onLeftIconClick={() => {
            navigatorPop({ componentId });
          }}
          isTitle={true}
          title={strings.resource.schedule}
          isLogout={false}
          titleStyle={{
            fontSize: RFValue(28),
            paddingTop: RFValue(10),
          }}
        />
        <View style={{ flex: 0.9 }}>
          <View style={{ marginTop: RFValue(10) }}>
            <ScheduleTab
              tabList={tabData}
              activeTab={activeTab}
              setActiveTab={this._setActiveTab}
            />
            {activeTab !== strings.resource.schedule && (
              <ScheduleTab
                customStyle={{
                  // justifyContent: 'center',
                  marginTop: RFPercentage(0.1),
                }}
                tabList={tabsAppointmentType}
                activeTab={activeAppointmentTab}
                badgeCount={typeApptLength ? ` (${typeApptLength})` : ""}
                setActiveTab={this._setActiveAppointmentTab}
              />
            )}
          </View>

          <View style={{ flex: 1 }}>
            {activeTab == strings.resource.schedule ? (
              <SymptomsComponent
                onPressAllAppointment={this._getAllAppointments}
                onPressGetMCQ={this._getSymptomsMCQ}
                appointmentData={GetAllAppointmentData}
                appointmentLoading={isGetAllAppointmentLoading}
                isRefreshingAppointmentList={isRefreshingAppointmentList}
                onRefreshAppointmentList={this._onRefreshAppointmentList}
                activeTab={activeTab}
                symptomsMCQ={{
                  GetAllSymptomsData,
                  isGetAllSymptomsLoading,
                  isRefreshingSymptomsList,
                  PostSymptomData,
                  isPostSymptomLoading,
                }}
                moodData={this.state.moodList}
                // appointmentInfo={}

                addSymptom={this._onPressAddSymptom}
                legendData={{
                  isGetLegendSymptomSuccess,
                  GetLegendSymptomData,
                  isGetLegendSymptomLoading,
                  isGetLegendSymptomRefreshing,
                  isGetLegendSymptomFail,
                }}
                onRefreshLegend={(date) => this._fetchLegends(date, true)}
                isRefresh={this.state.refresh}
              />
            ) : (
              <AppointmentList
                activeTab={activeAppointmentTab}
                appointmentLoader={isTypeAppointmentLoading}
                onRefreshAppointmentList={this.fetchTypeAppointment}
                appointmentData={TypeAppointmentData}
                isRefreshingAppointmentList={isTypeAppointmentRefreshing}
                goToVideoCall={this._goToVideoCall}
              />
            )}
          </View>
        </View>
      </View>
    );
  }
}

const mapStateToProps = ({ authReducer, dashboardReducer }) => ({
  /* Appointment List */
  isGetAllAppointmentLoading: dashboardReducer.isGetAllAppointmentLoading,
  GetAllAppointmentData: dashboardReducer.GetAllAppointmentData,
  isRefreshingAppointmentList: dashboardReducer.isRefreshingAppointmentList,
  /* Login */
  isLoggedIn: authReducer.isLoggedIn,
  loginData: authReducer.loginData,
  /* Schedule */
  isScheduleLoading: dashboardReducer.isScheduleLoading,
  isScheduleFail: dashboardReducer.isScheduleFail,
  ScheduleData: dashboardReducer.ScheduleData,
  /* Symptom QA list */
  GetAllSymptomsData: dashboardReducer.GetAllSymptomsData,
  isGetAllSymptomsLoading: dashboardReducer.isGetAllSymptomsLoading,
  isRefreshingSymptomsList: dashboardReducer.isRefreshingSymptomsList,
  /* Type Appt */
  TypeAppointmentData: dashboardReducer.TypeAppointmentData,
  isTypeAppointmentLoading: dashboardReducer.isTypeAppointmentLoading,
  isTypeAppointmentRefreshing: dashboardReducer.isTypeAppointmentRefreshing,
  /* Add symptom */
  PostSymptomData: dashboardReducer.PostSymptomData,
  isPostSymptomLoading: dashboardReducer.isPostSymptomLoading,
  /* Get Legend Symptom */
  isGetLegendSymptomSuccess: dashboardReducer.isGetLegendSymptomSuccess,
  GetLegendSymptomData: dashboardReducer.GetLegendSymptomData,
  isGetLegendSymptomLoading: dashboardReducer.isGetLegendSymptomLoading,
  isGetLegendSymptomRefreshing: dashboardReducer.isGetLegendSymptomRefreshing,
  isGetLegendSymptomFail: dashboardReducer.isGetLegendSymptomFail,

  /** Video Call Check Time */
  isCheckTimeSuccess: dashboardReducer.isCheckTimeSuccess,
  checkTimeData: dashboardReducer.checkTimeData,

  isCheckTimeSuccess: dashboardReducer.isCheckTimeSuccess,
  checkTimeData: dashboardReducer.checkTimeData,

  isNotificationSuccess: dashboardReducer.isNotificationSuccess,
  notificationData: dashboardReducer.notificationData,

  isVideoCallTokenSuccess: dashboardReducer.isVideoCallTokenSuccess,
  videoCallTokenData: dashboardReducer.videoCallTokenData,

  user_language: authReducer.language,
});
const mapDispatchToProps = (dispatch) => ({
  AppActions: bindActionCreators(AppActions, dispatch),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Symptoms);
const Styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    backgroundColor: COLOR.BACKGROUND,
  },
});
