// @ts-nocheck
import * as AppActions from "@actions/";
import React, { Component, lazy } from "react";
import { StyleSheet, View, Dimensions, AppState } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { RFValue } from "react-native-responsive-fontsize";
import { navigatorPush, navigatorPop } from "@config/navigationOptions";
const ProgramsList = lazy(() => import("@components/dashboard/programsList"));
import GLOBALS from "@constants";
import { strings } from "@localization";
const { STRINGS, COLOR } = GLOBALS;

const Header = lazy(() => import('@components/common/Header'));
import { checkIfDateIsNotToday } from '@helpers/common';
import Styles from './styles';

class ProgramList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      programslist: [],
    };
  }

  /**Get Program Listing */
  componentDidMount() {
    if (
      checkIfDateIsNotToday(
        this.props.programReducer.lastUpdate &&
        this.props.programsListData.length == 0
      )
    ) {
      this.props.AppActions.getProgramsList();
    } else {

    }
  }

  /**On Program Item Press */
  _onPressTab = (index, item) => {
    let { componentId } = this.props;
    console.log(item, "item.......");
    this.props.AppActions.setSelectedProgram({
      currentday: item.stage ? item.stage : item.currentday,
      currentWeek: item.stage ? 1 : item.currentWeek,
      totalWeeks: item.stage ? 1 : item.week,
      totalDays: item.stage ? item.stage : item.day,
      name: item.name,
      _id: item._id,
      stage: item.stage,
      stageName: item.stage ? item.stageName : [],
      currentStage: item.stage ? item.currentStage : 1,
    });
    navigatorPush({
      componentId,
      screenName: "SelectWeek",
    });
  };

  render() {
    let { isLoading, componentId, programsListData } = this.props;
    let { notificationData } = this.state;
    let title, body;
    if (notificationData != "" && notificationData != undefined) {
      title = notificationData.notification.title;
      body = notificationData.notification.body;
    }

    return (
      <View style={Styles.homeContainer}>
        <View
          style={{
            flex: 1,
            backgroundColor: COLOR.BACKGROUND,
          }}
        >
          <Header
            isLeftIcon={true}
            isRightIcon={false}
            isTitle={true}
            onLeftIconClick={() => {
              navigatorPop({ componentId });
            }}
            title={strings.cards.program}
            isLogout={false}
            titleStyle={{
              paddingTop: RFValue(10),
            }}
          //    primary={this.props.themeData.primary}
          />
          <ProgramsList
            programsListArray={programsListData}
            onPressTab={this._onPressTab}
            logout={this._logout}
            dashLoader={isLoading}
          />
        </View>
      </View>
    );
  }
}
const mapStateToProps = ({
  authReducer,
  playlistReducer,
  dashboardReducer,
  programReducer,
}) => ({
  isLoading: authReducer.isLoading,
  playlistDynamicRes: playlistReducer.playlistDynamicRes,
  programsListData: programReducer.programsList,
  programReducer: programReducer,
  // themeData: authReducer
});
const mapDispatchToProps = (dispatch) => ({
  AppActions: bindActionCreators(AppActions, dispatch),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProgramList);
