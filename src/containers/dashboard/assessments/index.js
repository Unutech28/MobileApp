// @ts-nocheck
import * as AppActions from "@actions";
import { navigatorPop, navigatorPush } from "@config/navigationOptions";
import GLOBALS from "@constants";
import React, { Component, lazy } from "react";
import { StyleSheet, View, AppState, Platform } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import moment from "moment";
import { RFValue } from "react-native-responsive-fontsize";
import { strings } from "@localization";
import Styles from "./styles";

const { COLOR, STRINGS } = GLOBALS;
const Header = lazy(() => import("@components/common/Header"));
const AssessmentComponent = lazy(() =>
  import("@components/dashboard/assessments")
);
class Assessments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appState: AppState.currentState,
      temp: 0,
    };
    this.getAssessments();

    this._startTime();
  }

  _startTime() {
    this.props.AppActions.getScreenStartTime(moment().format());
  }

  componentDidMount() {
    this.getAssessments();
    this.setState({ temp: this.state.temp + 1 });
    AppState.addEventListener("change", this._handleAppStateChange);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.temp !== nextState.temp) {
      return true;
    }
    return true;
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
        event: "Assessment",
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

  getAssessments = () => {
    this.props.AppActions.getAssessments();
  };
  onPressAssessment = (assessment) => {
    const { componentId } = this.props;
    const { _id, name, patient_assessment_id, status } = assessment;
    navigatorPush({
      componentId,
      screenName: "AssessmentDetail",
      passProps: {
        assessment_id: _id,
        assessmentName: name,
        // patientAssessmentId: patient_assessment_id,
        // assessment_status: status,
      },
    });
  };

  _goBack() {
    let { componentId, activeScreenStartTime } = this.props;
    let postData = {
      group: STRINGS.PATIENT_REPORTED_OUTCOMES,
      event: "Assessment",
      inTime: activeScreenStartTime,
      outTime: moment().format(),
      activityDate: moment().format(),
    };
    this.props.AppActions.addTimeTraker(postData);
    navigatorPop({ componentId });
  }

  render() {
    const { componentId, allAssessments, assessmentLoader, loginData } =
      this.props;
    console.log("allAssessments", allAssessments);
    return (
      <View style={Styles.homeContainer}>
        <Header
          isLeftIcon={true}
          isRightIcon={false}
          onLeftIconClick={() => {
            this._goBack();
          }}
          isTitle={true}
          title={strings.resource.assessment}
          isLogout={false}
          titleStyle={{
            // fontSize: RFValue(28),
            paddingTop: RFValue(10),
          }}
        />
        <AssessmentComponent
          allAssessments={allAssessments}
          assessmentLoader={assessmentLoader}
          onPressAssessment={this.onPressAssessment}
        />
      </View>
    );
  }
}
const mapStateToProps = ({
  authReducer,
  assessmentsReducer,
  dashboardReducer,
}) => ({
  loginData: authReducer.loginData,
  // userId: authReducer.loginData.user._id,
  allAssessments: assessmentsReducer.allAssessments,
  assessmentLoader: assessmentsReducer.assessmentLoader,
  activeScreenStartTime: dashboardReducer.getScreenStartTime,
  refreshAssessmenetList: assessmentsReducer.refreshAssessmenetList,
  saveAssessmentStatus: assessmentsReducer.saveAssessmentStatus,
});
const mapDispatchToProps = (dispatch) => ({
  AppActions: bindActionCreators(AppActions, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(Assessments);
