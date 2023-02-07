/* eslint-disable prettier/prettier */
// @ts-nocheck
import * as AppActions from "@actions";
import { navigatorPop, navigatorPush } from "@config/navigationOptions";
import GLOBALS from "@constants";
import React, { Component, lazy } from "react";
import { StyleSheet, View, Text } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
const { COLOR, STRINGS } = GLOBALS;
const ScheduleTab = lazy(() => import("@components/dashboard/symptoms/tabs"));
const TotalPoints = lazy(() =>
  import("@components/dashboard/points/totalPoints")
);
import PointList from "@components/dashboard/points";
const Header = lazy(() => import("@components/common/Header"));
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import moment from "moment";
import momentZone from "moment-timezone";
import { strings } from "@localization";
import Styles from "./styles";
import ShadowView from "../../../components/common/ShadowView";
let currentTimeZone = momentZone.tz.guess();

const tabsAppointmentType = [
  { title: strings.points.Daily, id: 1 },
  { title: strings.points.Weekly, id: 2 },
  { title: strings.points.Monthly, id: 3 },
];

class Info extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeAppointmentTab: strings.points.Daily,
      pointListData: [],
      isTypeAppointmentRefreshing: false,
      totalPoints: "",
    };
    this._getDailyPoints();
  }

  _getDailyPoints() {
    this.props.AppActions.getPlayListPoints();
  }

  componentDidMount() { }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isPlaylistPointSuccess) {
      this.setState({
        pointListData: nextProps?.playlistPointData,
        isRefreshingAppointmentList: true,
        totalPoints: nextProps?.playlistPointData.totalPoint,
      });
    }
  }

  _setActiveAppointmentTab = (tabName) => {
    if (this.state.activeAppointmentTab != tabName) {
      this.setState({ activeAppointmentTab: tabName });
      this.fetchTypeAppointment(tabName);
    }
  };

  fetchTypeAppointment = (itemType, isRefresh = false) => {
    // let { loginData, isPlaylistPointSuccess, playlistPointData } = this.props;
    // let request;
    // if (itemType === strings.points.Daily) {
    //   request = "day";
    // } else if (itemType === strings.points.Weekly) {
    //   request = "week";
    // } else if (itemType === strings.points.Monthly) {
    //   request = "month";
    // }
    // let postData = {
    //   user_id: loginData["user"]["_id"],
    //   request_for: request,
    //   page: 0,
    //   limit: 0,
    //   patientDate: moment().format(STRINGS.DATE_FORMAT_PATIENT),
    //   timeZone: currentTimeZone,
    // };
    this.setState({ isRefreshingAppointmentList: true });
    // this.props.AppActions.getPlayListPoints(postData);
  };

  render() {
    let { componentId, playlistPointData } = this.props;
    let {
      activeTab,
      activeAppointmentTab,
      pointListData,
      isTypeAppointmentRefreshing,
    } = this.state;
    console.log("PlatListData==>", playlistPointData);
    return (
      <View style={Styles.homeContainer}>
        <Header
          isLeftIcon={true}
          isRightIcon={false}
          //isMiddleIcon={true}
          onLeftIconClick={() => {
            navigatorPop({ componentId });
          }}
          isLogout={false}
          isTitle={true}
          title={strings.home.points}
        />
        <View style={{ flex: 0.15 }}>
          <ScheduleTab
            customStyle={{
              // justifyContent: "center",
              marginTop: RFPercentage(5),
              //  marginLeft: RFPercentage(0),
            }}
            tabList={tabsAppointmentType}
            activeTab={activeAppointmentTab}
            setActiveTab={this._setActiveAppointmentTab}
            tabTitleStyle={{ fontSize: RFValue(16) }}
          />
        </View>
        <View style={{ flex: 0.2 }}>
          <TotalPoints totalPoints={this.state.totalPoints} />
        </View>

        <View style={{ flex: 0.7, marginTop: RFValue(30) }}>
          <PointList
            pointsList={playlistPointData}
            activeTab={activeAppointmentTab}
            onRefreshAppointmentList={this.fetchTypeAppointment}
            isRefreshingAppointmentList={isTypeAppointmentRefreshing}
          />
        </View>
      </View>
    );
  }
}
const mapStateToProps = ({ authReducer, dashboardReducer }) => ({
  loginData: authReducer.loginData,
  playlistPointData: dashboardReducer.playlistPointData,
  isPlaylistPointSuccess: dashboardReducer.isPlaylistPointSuccess,
});
const mapDispatchToProps = (dispatch) => ({
  AppActions: bindActionCreators(AppActions, dispatch),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Info);

