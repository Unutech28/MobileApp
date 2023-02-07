// @ts-nocheck
import * as AppActions from "@actions";
import { navigatorPop, navigatorPush } from "@config/navigationOptions";
import GLOBALS from "@constants";
import React, { Component, lazy } from "react";
import { StyleSheet, View, AppState } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { strings } from "@localization";
import Styles from "./styles";
import moment from "moment";

const { COLOR, STRINGS } = GLOBALS;

const Header = lazy(() => import("@components/common/Header"));
const JournalComponent = lazy(() => import("@components/dashboard/journal"));

class Journal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appState: AppState.currentState,
    };
    this.getJournal();
    this._startTime();
  }

  _startTime() {
    this.props.AppActions.getScreenStartTime(moment().format());
  }

  componentDidMount() {
    AppState.addEventListener("change", this._handleAppStateChange);
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
        event: "Journal",
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

  getJournal = () => {
    let { loginData } = this.props;
    let searchText = "";
    let postData = {
      user_id: loginData?.user?._id,
    };
    this.props.AppActions.getJournal();
  };
  onPressAssessment = (assessment) => {
    const { componentId } = this.props;
    const { _id, name } = assessment;
    navigatorPush({
      componentId,
      screenName: "JournalDetail",
      passProps: { journal_id: _id, journalName: name },
    });
  };

  render() {
    const { componentId, allJournals, journalLoader, loginData } = this.props;
    return (
      <View style={Styles.homeContainer}>
        {/* <Header
          isLeftIcon={true}
          isTitle={true}
          onLeftIconClick={() => {
            navigatorPop({ componentId });
          }}
          title="Journal"
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
            let { componentId, activeScreenStartTime } = this.props;
            let postData = {
              group: STRINGS.ENGAGEMENT,
              event: "Journal",
              inTime: activeScreenStartTime,
              outTime: moment().format(),
              activityDate: moment().format(),
            };
            this.props.AppActions.addTimeTraker(postData);
            navigatorPop({ componentId });
          }}
          isTitle={true}
          title={strings.tab3.journal}
          isLogout={false}
          titleStyle={{
            // fontSize: RFValue(28),
            paddingTop: RFValue(10),
          }}
        />
        <JournalComponent
          allAssessments={allJournals}
          assessmentLoader={journalLoader}
          onPressAssessment={this.onPressAssessment}
        />
      </View>
    );
  }
}
const mapStateToProps = ({
  authReducer,
  dashboardReducer,
  journalReducer,
}) => ({
  // userId: authReducer.loginData.user._id,
  loginData: authReducer?.loginData,
  allJournals: journalReducer?.allJournals,
  journalLoader: journalReducer?.journalLoader,
  activeScreenStartTime: dashboardReducer.getScreenStartTime,
});
const mapDispatchToProps = (dispatch) => ({
  AppActions: bindActionCreators(AppActions, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(Journal);
