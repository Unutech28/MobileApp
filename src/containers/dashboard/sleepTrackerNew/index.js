import * as AppActions from '@actions';
import SleepTrackerUI from '@components/dashboard/sleepTracker';
import { navigatorPop } from '@config/navigationOptions';
import GLOBALS from '@constants';
import moment from 'moment';
import React, { Component, lazy } from 'react';
import { StyleSheet, View, Platform, AppState } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
const { COLOR, STRINGS, PRODUCT_TYPE } = GLOBALS;
//import AppleHealthKit from "rn-apple-healthkit";
import GoogleFit, { Scopes } from 'react-native-google-fit';
import momentZone from 'moment-timezone';
import { strings } from '@localization';
import Styles from './styles'
let currentTimeZone = momentZone.tz.guess();
const timeStamp = moment().format();
const currentDate = moment(timeStamp).format('YYYY-MM-DD');

const Header = lazy(() => import('@components/common/Header'));

class SleepTrackerNew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 'Schedule',
      sleepHr: '0',
      sleepMin: '0',
      stepCount: 0,
      sleepId: '',
      isupdate: false,
      appState: AppState.currentState,
    };
    this._startTime();
    this._fetchActivityData()
    // if (Platform.OS === "android") {
    //   GoogleFit.checkIsAuthorized();
    //   this.googleFitInit();
    // }
  }
  _fetchActivityData = () => {
    this.props.AppActions.fetchAllTrackers(this.props.trackerId, this.props.trackerType)
  }

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentWillUnmount() {
    // AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = nextAppState => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      this._startTime();
    } else {
      let { activeScreenStartTime } = this.props;
      let postData = {
        group : STRINGS.PATIENT_REPORTED_OUTCOMES,
        event : "sleep_tracker",
        inTime : activeScreenStartTime,
        outTime : moment().format(),
        activityDate : moment().format(),
      }
      if (Platform.OS == 'android') {
        this.props.AppActions.addTimeTraker(postData);
      } else if (
        Platform.OS == 'ios' &&
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

  getSleepData = sleepDate => {
    // let {loginData} = this.props;
    // let postData = {
    //   user_id: loginData['user']['_id'],
    //   sleepdate: sleepDate,
    //   patientDate: moment().format(STRINGS.DATE_FORMAT_PATIENT),
    //   timeZone: currentTimeZone,
    // };
    // this.props.AppActions.getSleepTraker(postData);
  };

  onSaveClick = (sleepData, selectedDate) => {
    let { componentId } = this.props;
    let postData = {
      date: selectedDate,
      trackerId: this.props.trackerId,
      value: this.props.trackerType,
      data: [sleepData],
    };
    console.log('postData', JSON.stringify(postData))
    this.props.AppActions.saveTrackers(postData, componentId);
    let data = {
      group : STRINGS.PATIENT_REPORTED_OUTCOMES,
      event : "sleep_tracker",
      inTime : activeScreenStartTime,
      outTime : moment().format(),
      activityDate : moment().format(),
    }
    this.props.AppActions.addTimeTraker(data);
  };

  _goBack() {
    let { componentId, loginData, activeScreenStartTime } = this.props;
    let postData = {
      group : STRINGS.PATIENT_REPORTED_OUTCOMES,
      event : "sleep_tracker",
      inTime : activeScreenStartTime,
      outTime : moment().format(),
      activityDate : moment().format(),
    }
    this.props.AppActions.addTimeTraker(postData);
    navigatorPop({ componentId });
  }

  render() {
    let { getAllTrackersResponse } = this.props;
    console.log('getAllTrackersResponseSleep>>>>', getAllTrackersResponse)

    return (
      <View style={Styles.homeContainer}>
        <Header
          isLeftIcon={true}
          isRightIcon={false}
          onLeftIconClick={() => {
            this._goBack();
          }}
          isLogout={false}
          isTitle={true}
          title={
            PRODUCT_TYPE == 'CU002'
              ? strings.SleepTracker.SleepTracker
              : strings.SleepTracker.SleepTracker
          }
          titleStyle={{ fontSize: RFValue(28), paddingTop: RFValue(10) }}
        />
        <View style={{ flex: 1 }}>
          <SleepTrackerUI
            // getSleepTrackerData={getSleepDataRes}
            getSleepTrackerData={getAllTrackersResponse}
            saveSleepTrackerAPI={this.onSaveClick}
            getSleepTrackerAPI={this.getSleepData}
            data={this.props.data}
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = ({ authReducer, dashboardReducer }) => ({
  /* Login */
  isLoggedIn: authReducer.isLoggedIn,
  loginData: authReducer.loginData,
  getSleepDataRes: dashboardReducer.getSleeptData,
  activeScreenStartTime: dashboardReducer.getScreenStartTime,
  user_language: authReducer.language,
  getAllTrackersResponse: dashboardReducer.getSleepTrackersResponse,
});
const mapDispatchToProps = dispatch => ({
  AppActions: bindActionCreators(AppActions, dispatch),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SleepTrackerNew);

