// @ts-nocheck
import * as AppActions from "@actions";
import { navigatorPop, navigatorPush } from "@config/navigationOptions";
import GLOBALS from "@constants";
import moment from "moment";
import React, { Component, lazy } from "react";
import { StyleSheet, View, Text } from "react-native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
const { COLOR, STRINGS } = GLOBALS;
const SymptomsComponent = lazy(() =>
  import("@components/dashboard/dailyTracker")
);
import * as ICONS from "@images";
const Header = lazy(() => import("@components/common/Header"));
import momentZone from "moment-timezone";
import { alertWithOneBtn } from "@helpers/common";
import { strings } from "@localization";
import Styles from "./styles";
let currentTimeZone = momentZone.tz.guess();
const ScheduleTab = lazy(() => import("@components/dashboard/symptoms/tabs"));
let tabs = [
  { title: strings.careConcerns.General, id: 1 },
  { title: strings.careConcerns.Suggested, id: 2 },
];
class DailyTracker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: strings.careConcerns.General,
      activeAppointmentTab: strings.careConcerns.Upcoming,
      apiCall: 0,
      appointmetData: [],
      refresh: false,
      prevMoodId: "",
    };
    // this._getSymptomsMCQ(moment().toISOString());
    //this._getCareConcerns()
  }

  // _getCareConcerns() {
  //   let { loginData } = this.props;
  //   let postData = {
  //     user_id: loginData['user']['_id'],
  //     patientDate: moment().format(STRINGS.DATE_FORMAT_PATIENT),
  //     timeZone: currentTimeZone
  //   }
  //   this.props.AppActions.getCareConcerns(postData);
  // }

  _getSymptomsMCQ = (userDate = moment().format("YYYY-MM-DD")) => {
    let { loginData } = this.props;
    let patientDate = moment().format(STRINGS.DATE_FORMAT_PATIENT);
    let timeZone = currentTimeZone;
    this.props.AppActions.getSymptomsMCQ(
      loginData["user"]["_id"],
      userDate,
      "",
      patientDate,
      timeZone
    );
  };

  _onPressAddSymptom = (symptomInput) => {
    this.setState({ isMoodUpdate: false });
    let { loginData, user_language } = this.props;
    this.props.AppActions.postAddSymptom(
      {
        user_id: loginData["user"]["_id"],
        ...symptomInput,
      },
      "",
      "",
      "",
      user_language
    );
  };

  _goToDailyCBT(week, day, data) {
    let postData = {
      user_id: this.props.loginData["user"]["_id"],
      type: data.title,
      week: week != "" ? week : 9,
      day: day != "" ? day : 1,
      language: this.props.user_language,
    };
    this.props.AppActions.getCareConcernLearningCards(postData, (res) => {
      let { componentId } = this.props;
      if (res) {
        navigatorPush({
          componentId,
          screenName: "SwipeCards",
          passProps: {
            title: data.title,
          },
        });
      }
    });
  }

  onCareConcernClick = (item, index) => {
    // alert("Comming soon...")
    let { loginData, activeProgramsDetails, componentId } = this.props;
    // this._goToDailyCBT(Number(item.week), Number(item.day), item);
    let data = {
      // programId: item._id,
      programId: loginData?.profile?.activatedProg._id,
      careConcern: "?careConcerns=1",
    };
    this.props.AppActions.getCardsList(data, 0, (res) => {
      console.log("care concern API res......", res);
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
          screenType: "careConcerns",
        },
      });
    });
  };
  /**Tab Click Handler */
  _setActiveHelpTab = (tabName) => {
    if (this.state.activeTab != tabName) {
      this.setState({ activeTab: tabName });
    }
  };

  render() {
    let {
      componentId,
      GetAllSymptomsData,
      isGetAllSymptomsLoading,
      isRefreshingSymptomsList,
      /* Type Appt */
      PostSymptomData,
      isPostSymptomLoading,
      loginData,
      activeProgramsDetails,
    } = this.props;
    let showCBTData;

    if (
      GetAllSymptomsData !== null &&
      GetAllSymptomsData !== undefined &&
      GetAllSymptomsData.data !== null
    ) {
      let selectedArray = GetAllSymptomsData.data;
      let findResult = selectedArray.filter(
        (x) => x.symptoms_id[0] == "5ed78cde7f5cac5b5c5742ca"
      );
      if (findResult.length > 0) {
        showCBTData = true;
      }
    }
    let { activeTab } = this.state;

    return (
      <View style={Styles.homeContainer}>
        <Header
          isLeftIcon={true}
          isRightIcon={false}
          onLeftIconClick={() => {
            navigatorPop({ componentId });
          }}
          isTitle={true}
          title={strings.resource.concern}
          isLogout={false}
          titleStyle={{
            paddingTop: RFValue(10),
          }}
        />
        {/* <View style={{}}>
          <ScheduleTab
            customStyle={{
              marginTop: RFValue(30),
            }}
            tabList={tabs}
            activeTab={activeTab}
            setActiveTab={this._setActiveHelpTab}
          />
        </View> */}
        <View style={{ flex: 0.9, paddingHorizontal: RFValue(16) }}>
          <View style={{ flex: 1 }}>
            <SymptomsComponent
              symptomsMCQ={{
                GetAllSymptomsData,
                isGetAllSymptomsLoading,
                isRefreshingSymptomsList,
                PostSymptomData,
                isPostSymptomLoading,
                loginData,
                activeProgramsDetails,
              }}
              addSymptom={this._onPressAddSymptom}
              isRefresh={this.state.refresh}
              showCBTData={showCBTData}
              onCareConcernClick={this.onCareConcernClick}
              onRefresh={() => {
                this._getSymptomsMCQ(moment().toISOString());
              }}
            />
          </View>
        </View>
      </View>
    );
  }
}

const mapStateToProps = ({
  authReducer,
  dashboardReducer,
  programReducer,
}) => ({
  /* Login */
  isLoggedIn: authReducer.isLoggedIn,
  loginData: authReducer.loginData,
  user_language: authReducer.language,
  /* Symptom QA list */
  GetAllSymptomsData: dashboardReducer.GetAllSymptomsData,
  isGetAllSymptomsLoading: dashboardReducer.isGetAllSymptomsLoading,
  isRefreshingSymptomsList: dashboardReducer.isRefreshingSymptomsList,

  getCareConcernData: dashboardReducer.getCareConcernData,
  activeProgramsDetails: programReducer.activeProgramDetail,
});
const mapDispatchToProps = (dispatch) => ({
  AppActions: bindActionCreators(AppActions, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(DailyTracker);
