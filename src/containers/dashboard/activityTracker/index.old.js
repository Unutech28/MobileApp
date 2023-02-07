// @ts-nocheck
import * as AppActions from '@actions';
import { navigatorPop, navigatorPush } from '@config/navigationOptions';
import GLOBALS from '@constants';
import React, { Component, lazy } from 'react';
import { StyleSheet, View, AppState, Platform } from 'react-native';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
const { COLOR, STRINGS } = GLOBALS;
const ActivityTrackerComponent = lazy(() =>
  import('@components/dashboard/activityTracker'),
);
import Styles from './styles';
const Header = lazy(() => import('@components/common/Header'));
const ScheduleTab = lazy(() =>
  import('@components/dashboard/activityTracker/tab'),
);
import moment from 'moment';
import momentZone from 'moment-timezone';
import { strings } from '@localization';

let currentTimeZone = momentZone.tz.guess();

let otherResponse = [];
let timeArray = [
  {
    value: '10 minutes',
    id: 10,
    points: 0,
  },
  {
    value: '15 minutes',
    id: 15,
    points: 100,
  },
  {
    value: '20 minutes',
    id: 20,
    points: 0,
  },
  {
    value: '25 minutes',
    id: 25,
    points: 0,
  },
  {
    value: '30 minutes',
    id: 30,
    points: 200,
  },
  {
    value: '35 minutes',
    id: 35,
    points: 0,
  },
  {
    value: '40 minutes',
    id: 40,
    points: 0,
  },
  {
    value: '45 minutes',
    id: 45,
    points: 300,
  },
  {
    value: '50 minutes',
    id: 50,
    points: 0,
  },
  {
    value: '55 minutes',
    id: 55,
    points: 0,
  },
  {
    value: '60 minutes',
    id: 60,
    points: 400,
  },
  {
    value: '65 minutes',
    id: 65,
    points: 0,
  },
  {
    value: '70 minutes',
    id: 70,
    points: 0,
  },
  {
    value: '75 minutes',
    id: 75,
    points: 500,
  },
  {
    value: '80 minutes',
    id: 80,
    points: 0,
  },
  {
    value: '85 minutes',
    id: 85,
    points: 0,
  },
  {
    value: '90 minutes',
    id: 90,
    points: 600,
  },
  {
    value: '95 minutes',
    id: 95,
    points: 0,
  },
  {
    value: '100 minutes',
    id: 100,
    points: 0,
  },
  {
    value: '105 minutes',
    id: 105,
    points: 700,
  },
  {
    value: '110 minutes',
    id: 110,
    points: 0,
  },
  {
    value: '115 minutes',
    id: 115,
    points: 0,
  },
  {
    value: '120 minutes',
    id: 120,
    points: 800,
  },
  {
    value: '125 minutes',
    id: 125,
    points: 0,
  },
  {
    value: '130 minutes',
    id: 130,
    points: 0,
  },
  {
    value: '135 minutes',
    id: 135,
    points: 900,
  },
  {
    value: '140 minutes',
    id: 140,
    points: 0,
  },
  {
    value: '145 minutes',
    id: 145,
    points: 0,
  },
  {
    value: '150 minutes',
    id: 150,
    points: 1000,
  },
];

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
    this._callActivityTrackerAPI();
    this._startTime();
  }
  tabsType = [
    {
      title: strings.activity.Activities,
      id: 0,
    },
    {
      title: strings.activity.DailyActivities,
      id: 1,
    },
    // {
    //   title: STRINGS.SPORTS,
    //   id: 2
    // },
    // {
    //   title: STRINGS.CUSTOM,
    //   id: 2
    // },
  ];
  componentDidMount() {
    this.props.type == 'daily'
      ? this.setState({ activeTab: strings.activity.DailyActivities })
      : null;

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
      let { loginData, activeScreenStartTime } = this.props;
      let postData = {
        user_id: loginData['user']['_id'],
        group: 'Engagement',
        screen: 'activity_tracker',
        startTime: activeScreenStartTime,
        endTime: moment().format(),
        date: moment().format(),
      };
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

  _callActivityTrackerAPI() {
    let { loginData } = this.props;
    let postData = {
      hospital_id: loginData.user.hospital_id,
      patient_id: loginData.user._id,
      patientDate: moment().format(STRINGS.DATE_FORMAT_PATIENT),
      timeZone: currentTimeZone,
    };
    this.props.AppActions.getSelectedActivityTracker(postData);
    this.props.AppActions.getActivityTrackerApi(postData);
  }

  componentDidUpdate(prevProps, prevState) {
    let {
      loginData,
      getSelectedActivityTracker,
      getSaveOtherActivityData,
    } = this.props;
    if (getSaveOtherActivityData !== undefined) {
      if (getSaveOtherActivityData !== prevState.otherResponse) {
        otherResponse.push(getSaveOtherActivityData);
      }
    }
  }

  onSaveActivityClick = data => {
    let {
      loginData,
      componentId,
      getSelectedActivityTracker,
      activeScreenStartTime,
    } = this.props;
    let patientActivity = [];
    let id = '';
    if (
      getSelectedActivityTracker !== undefined &&
      getSelectedActivityTracker.activitypatchdata !== undefined &&
      getSelectedActivityTracker.activitypatchdata.length > 0
    ) {
      id = getSelectedActivityTracker.activitypatchdata[0]._id;
    }

    data.forEach(element => {
      let obj = {
        activity_id: element._id,
      };
      patientActivity.push(obj);
    });
    let postData = {
      hospital_id: loginData.user.hospital_id,
      user_id: loginData.user._id,
      patientactivity: patientActivity,
      _id: id,
      patientDate: moment().format(STRINGS.DATE_FORMAT_PATIENT),
      timeZone: currentTimeZone,
    };
    this.props.AppActions.saveOtherActivity(postData, componentId);
    if (this.props.onGoBack) {
      this.props.onGoBack();
    }
    this.setState({ isRefresh: !this.state.isRefresh });

    let postDataTracker = {
      user_id: loginData['user']['_id'],
      group: 'Engagement',
      screen: 'activity_tracker',
      startTime: activeScreenStartTime,
      endTime: moment().format(),
      date: moment().format(),
    };
    this.props.AppActions.addTimeTraker(postDataTracker);

    let activityData = {
      date: moment().format(),
      activityStatus: true,
    };
    this.props.AppActions.ActivityTrackerStatusComplete(activityData);
  };

  goToOtherActivity = () => {
    // alert('click')
    let {
      componentId,
      getActivityTrackerData,
      getSelectedActivityTracker,
    } = this.props;

    let AddPlesantActivityArray = [];
    let selectedListArray = [];
    let id = '';

    if (
      getSelectedActivityTracker !== undefined &&
      getSelectedActivityTracker.activitypatchdata !== undefined &&
      getSelectedActivityTracker.activitypatchdata.length > 0
    ) {
      id = getSelectedActivityTracker.activitypatchdata[0]._id;
    }

    if (
      getActivityTrackerData !== undefined &&
      getActivityTrackerData.iconlistdata !== undefined
    ) {
      AddPlesantActivityArray = getActivityTrackerData.iconlistdata.filter(
        x => x.category == 'Pleasant',
      );
      getActivityTrackerData.iconlistdata.forEach(element => {
        if (element.isChecked !== undefined && element.isChecked) {
          selectedListArray.push(element);
        }
      });
    }

    navigatorPush({
      componentId,
      screenName: 'AddOtherActivity',
      passProps: {
        AddPlesantActivityArray: AddPlesantActivityArray,
        updateId: id,
        selectedListArray: selectedListArray,
      },
    });
  };

  _setActiveAppointmentTab = tabName => {
    if (this.state.activeTab != tabName) {
      this.setState({ activeTab: tabName });
      // this.fetchTypeAppointment(tabName);
    }
  };

  onDeleteCustomActivity = id => {
    let { getSelectedActivityTracker } = this.props;
    let postData = {
      _id: id,
      is_deleted: true,
    };
    if (getSelectedActivityTracker.otheractivitypatchdata !== undefined) {
      let findIndex = getSelectedActivityTracker.otheractivitypatchdata.findIndex(
        x => x._id == id,
      );
      if (findIndex !== -1) {
        getSelectedActivityTracker.otheractivitypatchdata.splice(findIndex, 1);
      }
    }
    this.props.AppActions.deleteCustomActivity(postData);
  };

  _goBack() {
    let { componentId, loginData, activeScreenStartTime } = this.props;
    let postData = {
      user_id: loginData['user']['_id'],
      group: 'Engagement',
      screen: 'activity_tracker',
      startTime: activeScreenStartTime,
      endTime: moment().format(),
      date: moment().format(),
    };
    this.props.AppActions.addTimeTraker(postData);
    navigatorPop({ componentId });
  }

  _onLogoutClick() {
    let { loginData, activeScreenStartTime } = this.props;
    let postData = {
      user_id: loginData['user']['_id'],
      group: 'Engagement',
      screen: 'activity_tracker',
      startTime: activeScreenStartTime,
      endTime: moment().format(),
      date: moment().format(),
    };
    this.props.AppActions.addTimeTraker(postData);
    this.props.AppActions.logout(loginData['user']['_id']);
  }

  render() {
    let { getSelectedActivityTracker, loginData } = this.props;
    let { activeTab, isRefresh } = this.state;
    let { getActivityTrackerData } = this.props;
    let pleasentActivityArray, dailyActivityArray, addNewActivity;
    let newSelectedActivity = [];
    let newPlasentActivity = [];

    if (
      getActivityTrackerData !== undefined &&
      getActivityTrackerData.iconlistdata !== undefined
    ) {
      getActivityTrackerData.iconlistdata.forEach(element => {
        if (
          getSelectedActivityTracker !== undefined &&
          getSelectedActivityTracker.activitypatchdata !== undefined
        ) {
          getSelectedActivityTracker.activitypatchdata.forEach(x => {
            if (element._id == x.activity_id) {
              element.isChecked = true;
            }
          });
        }
      });

      let pleasentArray = getActivityTrackerData.iconlistdata.filter(
        x => x.category == 'Pleasant activities',
      );
      dailyActivityArray = getActivityTrackerData.iconlistdata.filter(
        x => x.category == 'Daily activities',
      );
      addNewActivity = getActivityTrackerData.iconlistdata.filter(
        x => x.category == 'Pleasant',
      );

      addNewActivity.forEach(element => {
        if (element.isChecked) {
          newSelectedActivity.push(element);
        }
        if (element.isPleasantActivity) {
          newPlasentActivity.push(element);
        }
      });
      pleasentActivityArray = pleasentArray.concat(newSelectedActivity);
      pleasentActivityArray = pleasentArray.concat(newPlasentActivity);
    }

    return (
      <View style={Styles.homeContainer}>
        <Header
          isLeftIcon={true}
          isRightIcon={false}
          onLeftIconClick={() => this._goBack()}
          isLogout={false}
          isTitle={true}
          title={strings.activity.ActivityTracker}
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
              pleasentActivityArray={pleasentActivityArray}
              dailyActivityArray={dailyActivityArray}
              goToOtherActivity={this.goToOtherActivity}
              timeArray={timeArray}
              otherActivityData={
                getSelectedActivityTracker !== undefined &&
                  getSelectedActivityTracker.otheractivitypatchdata !== undefined
                  ? getSelectedActivityTracker.otheractivitypatchdata
                  : []
              }
              activeTab={activeTab}
              onSaveActivityClick={this.onSaveActivityClick}
              getSelectedActivityTracker={getSelectedActivityTracker}
              onDeleteCustomActivity={this.onDeleteCustomActivity}
              getActivityTrackerData={
                getActivityTrackerData !== undefined &&
                  getActivityTrackerData.iconlistdata !== undefined
                  ? getActivityTrackerData.iconlistdata
                  : []
              }
              isRefreshData={isRefresh}
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
});
const mapDispatchToProps = dispatch => ({
  AppActions: bindActionCreators(AppActions, dispatch),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ActivityTracker);

