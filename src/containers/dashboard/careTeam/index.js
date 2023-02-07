/* eslint-disable prettier/prettier */
/* eslint-disable module-resolver/use-alias */
import GLOBALS from "@constants";
import * as AppActions from "@actions";
import { ThemeContext } from "@hoc/withRedux";
import React, { Component, lazy } from "react";
import { StyleSheet, View } from "react-native";
import { connect } from "react-redux";
import moment from "moment";
import momentZone from "moment-timezone";
import { RFValue } from "react-native-responsive-fontsize";
import { navigatorPop, navigatorPush } from "@config/navigationOptions";
import { bindActionCreators } from "redux";
import { strings } from "@localization";
import Styles from "./styles";
const { COLOR } = GLOBALS;
const Header = lazy(() => import("@components/common/Header"));
const CareTeamComponent = lazy(() => import("@components/dashboard/careTeam"));
const ScheduleTab = lazy(() => import("@components/dashboard/symptoms/tabs"));

const tabsAppointmentType = [{ title: strings.careTeam.Contacts, id: 1 }];

class CareTeam extends Component {
  static contextType = ThemeContext;
  constructor(props) {
    super(props);
    this.state = {
      activeAppointmentTab: strings.careTeam.Contacts,
    };
  }

  _setActiveAppointmentTab = (tabName) => {
    if (this.state.activeAppointmentTab != tabName) {
      this.setState({ activeAppointmentTab: tabName });
      this.fetchTypeAppointment(tabName);
    }
  };

  componentDidMount() {
    let { loginData } = this.props;
    // loginData && this.props.AppActions.getCareTeam(loginData["user"]["_id"]);
  }
  scheduleAppointment = (caretakerID) => {
    let { componentId } = this.props;
    caretakerID == ""
      ? null
      : navigatorPush({
          componentId,
          screenName: "Schedule",
          passProps: { caretakerID },
        });
  };
  onRefreshCareList = () => {
    let { loginData } = this.props;
    loginData &&
      this.props.AppActions.getRefreshedCareTeam(loginData["user"]["_id"]);
  };

  _goToChat = (item) => {
    let { componentId, loginData } = this.props;
    navigatorPush({
      componentId,
      screenName: "Chat",
      passProps: {
        loginUserId: loginData["user"]["_id"],
        loginUserName: loginData.user.firstName,
        senderId: item._id,
        senderName: item.firstName,
      },
    });
  };

  render() {
    let {
      GetCareTeamData,
      isGetCareTeamLoading,
      componentId,
      isCareTeamRefreshing,
      loginData,
    } = this.props;
    return (
      <View style={Styles.homeContainer}>
        {/* <Header
          isLeftIcon={true}
          isTitle={true}
          isRightIcon={false}
          onLeftIconClick={() => {
            navigatorPop({ componentId });
          }}
          title={'My Care Team'}
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
          title={strings.careTeam.MyCareTeam}
          isLogout={false}
          titleStyle={{
            // fontSize: RFValue(28),
            paddingTop: RFValue(10),
          }}
        />

        <View style={{ flex: 1, marginTop: RFValue(20) }}>
          <ScheduleTab
            customStyle={{
              // justifyContent: "center",
              marginTop: RFValue(15),
              // flex: 1,
              //  marginLeft: RFPercentage(0),
            }}
            tabList={tabsAppointmentType}
            activeTab={this.state.activeAppointmentTab}
            setActiveTab={this._setActiveAppointmentTab}
            tabTitleStyle={{ fontSize: RFValue(16) }}
          />
          <CareTeamComponent
            data={GetCareTeamData}
            teamLoader={isGetCareTeamLoading}
            onPressCard={this.scheduleAppointment}
            onRefreshCareList={this.onRefreshCareList}
            // goToVideoCall={this._goToVideoCall}
            goToChat={this._goToChat}
            isCareTeamRefreshing={isCareTeamRefreshing}
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = ({ authReducer, dashboardReducer }) => ({
  isLoggedIn: authReducer.isLoggedIn,
  loginData: authReducer.loginData,
  GetCareTeamData: dashboardReducer.GetCareTeamData,
  isGetCareTeamLoading: dashboardReducer.isGetCareTeamLoading,
  isCareTeamRefreshing: dashboardReducer.isCareTeamRefreshing,
});

const mapDispatchToProps = (dispatch) => ({
  AppActions: bindActionCreators(AppActions, dispatch),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CareTeam);
