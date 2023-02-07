// @ts-nocheck
import * as AppActions from "@actions/";
import React, { Component, lazy } from "react";
import { StyleSheet, View } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { navigatorPush, navigatorPop } from "@config/navigationOptions";
import GLOBALS from "@constants";
import { RFValue } from "react-native-responsive-fontsize";
import ReportComponent from "@components/dashboard/reports";
import moment from "moment";
import momentZone from "moment-timezone";
import { strings } from "@localization";
import Styles from "./styles";
const Header = lazy(() => import("@components/common/Header"));
let currentTimeZone = momentZone.tz.guess();
const { STRINGS, COLOR } = GLOBALS;

class Reports extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.fetchReports();
    // this._getWeeklySummaryReportAPi();
  }
  fetchReports() {
    this.props.AppActions.getUserWeeklyReports();
  }

  _getWeeklySummaryReportAPi() {
    let { loginData } = this.props;
    let postData = {
      user_id: loginData["user"]["_id"],
      patientDate: moment().format(STRINGS.DATE_FORMAT_PATIENT),
      timeZone: currentTimeZone,
    };
    this.props.AppActions.getWeeklySummaryReport(postData);
  }

  onPressTab(index, item) {
    let { componentId } = this.props;
    if (index === 0) {
      navigatorPush({ componentId, screenName: "NextDosage", passProps: {} });
    } else if (item.id === 1) {
      navigatorPush({ componentId, screenName: "Reminders", passProps: {} });
    } else if (item.id === 2) {
      // navigatorPush({ componentId, screenName: 'Symptoms', passProps: {} });
    }
  }

  render() {
    let { componentId, getWeeklySummaryReportData, getAllUserReports } = this.props;
    console.log('getAllUserReports', getAllUserReports)
    return (
      <View style={[Styles.homeContainer, { backgroundColor: COLOR.WHITE }]}>
        {this.props?.isNoHeaderShow ? null : (
          <Header
            isLeftIcon={true}
            isRightIcon={false}
            onLeftIconClick={() => {
              navigatorPop({ componentId });
            }}
            isLogout={false}
            isTitle={true}
            title={strings.reports.Reports}
            titleStyle={{ fontSize: RFValue(28), paddingTop: RFValue(10) }}
          />
        )}
        <ReportComponent
          getWeeklySummaryReportData={getAllUserReports}
        />
      </View>
    );
  }
}
const mapStateToProps = ({ authReducer, dashboardReducer }) => ({
  loginData: authReducer.loginData,
  getWeeklySummaryReportData: dashboardReducer.getWeeklySummaryReports,
  getAllUserReports: dashboardReducer.getAllUserReports
});
const mapDispatchToProps = (dispatch) => ({
  AppActions: bindActionCreators(AppActions, dispatch),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Reports);

