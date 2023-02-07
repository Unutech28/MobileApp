// @ts-nocheck
import * as AppActions from '@actions/';
import React, { Component, lazy } from 'react';
import {
  StyleSheet,
  View,
  Alert,
  Modal,
  Dimensions,
  Text,
  TouchableOpacity,
  AppState,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { RFValue } from 'react-native-responsive-fontsize';
import { navigatorPush, navigatorPop } from '@config/navigationOptions';
import TabBar from '@components/common/tabBar';
import TabSwitcher, { TabPanel } from '@components/common/tabSwitcher';
const Dashboard = lazy(() => import('@components/dashboard'));
const Playlist = lazy(() => import('@containers/dashboard/playlist'));
const Reports = lazy(() => import('@containers/dashboard/reports'));
const { FONTS, COLOR, TABS } = GLOBALS;
// const Chat = lazy(() => import('@containers/dashboard/chat'));
const Chat = lazy(() => import('@containers/dashboard/chat/chatList'));
const Groups = lazy(() => import('@containers/dashboard/groups'));
const Help = lazy(() => import('@containers/dashboard/help'));
// const Journal = lazy(() => import('@containers/dashboard/journal'));
const Mood = lazy(() => import('@containers/dashboard/moodTracker'));
const Sleep = lazy(() => import('@containers/dashboard/sleepTrackerNew'));
const ActivityTracker = lazy(() =>
  import('@containers/dashboard/activityTracker'),
);
// const WeekInfoList = lazy(() => import("@containers/dashboard/weekInfoList"));
// const DailyLearning = lazy(() => import('@containers/dashboard/WeekInfoList'));
const Points = lazy(() => import('@containers/dashboard/points'));
import SocketIO from '../../utils/SocketIO';
//import AppleHealthKit from 'rn-apple-healthkit';
import messaging from '@react-native-firebase/messaging';
import GLOBALS from '@constants';
import { strings } from '@localization';
import AlertModal from '../../components/common/AlertModal';

const { STRINGS } = GLOBALS;
const Header = lazy(() => import('@components/common/Header'));

class DashBoard extends Component {
  lastMessageId = 0;
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      notificationData: [],
      appState: AppState.currentState,
      // lastMessageId: 0
    };
    this.socket = SocketIO.initialize();
    // this._setReminderData();
  }

  componentDidMount() {
    strings.setLanguage(this.props.authReducer.language);
    //api for app last seen
    let { loginData } = this.props;
    // let data = {
    //   user_id: loginData['user']['_id'],
    //   appStatus: 'open',
    // };
    // this.props.AppActions.updateUserLastSeen(data);

    AppState.addEventListener('change', this._handleAppStateChange);

    //Handle incoming video call
    this.socket.on('videonotification', msg => {
      this._openVideoCall(msg);
    });

    // Register background handler
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });

    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
    });

    // Check whether an initial notification is available
    // messaging()
    //   .getInitialNotification()
    //   .then(remoteMessage => {
    //     if (remoteMessage) {
    //       console.log(
    //         'Notification caused app to open from quit state:',
    //         remoteMessage.notification,
    //       );
    //     }
    //   });
    // messaging().onMessage(notification => {
    //   console.log('onMessage notification', JSON.stringify(notification));
    //   console.log('notification?.sentTime', notification?.data.messageId);
    //   let notifBodyTitle = notification.notification;
    //   let data = notification.data;
    //   setTimeout(() => {
    //     if (this.lastMessageId != notification?.sentTime) {
    //       this.lastMessageId = notification?.sentTime
    //       this.showAlert(data, notifBodyTitle);
    //     }
    //   }, 500)

    // });
  }

  componentWillUnmount() {
    // AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = nextAppState => {
    let data = [];
    let { loginData } = this.props;
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      data = {
        user_id: loginData['user']['_id'],
        appStatus: 'open',
      };
      this.props.AppActions.updateUserLastSeen(data);
    } else {
      data = {
        user_id: loginData['user']['_id'],
        appStatus: 'close',
      };
      if (Platform.OS == 'android') {
        this.props.AppActions.updateUserLastSeen(data);
      } else if (
        Platform.OS == 'ios' &&
        this.state.appState.match(/inactive|background/) !== null
      ) {
        //  debugger
        this.props.AppActions.updateUserLastSeen(data);
      }
    }
    this.setState({ appState: nextAppState });
  };

  _openVideoCall(data) {
    if (data) {
      let { componentId } = this.props;
      this.setState({ modalVisible: true, notificationData: data });
    }
  }

  _acceptCall(data) {
    let { componentId } = this.props;
    navigatorPush({
      componentId,
      screenName: 'Vidyo',
      passProps: {
        userName: data.data.patient_name,
        userId: data.data.patient_user_id,
        appointmentId: data.data.appointment_request_id,
        roomToken: '',
      },
    });
    this.setState({ modalVisible: false });
  }
  _declineCall(data) {
    let postData = {
      appointment_request_id: data.data.appointment_request_id,
    };
    this.props.AppActions.DeclineCall(postData);
    this.setState({ modalVisible: false });
  }

  showAlert = (data, message) => {
    Alert.alert(
      message.title,
      message.body,
      [
        {
          text: '',
          onPress: () => null, //null
        },
      ],
      { cancelable: false },
    );
  };

  //uncomment this code later commented by priyanka
  // _setReminderData() {
  //   let {loginData} = this.props;
  //   if (loginData.user.isNotificationAble) {
  //     this.props.AppActions.isEditReminder(true);
  //     //true
  //     this.props.AppActions.updateMedicationRem(true);
  //     this.props.AppActions.updateAssesmentRem(true);
  //     this.props.AppActions.updateAppointmentRem(true);
  //   } else {
  //     this.props.AppActions.isEditReminder(false);
  //     //false
  //     this.props.AppActions.updateMedicationRem(false);
  //     this.props.AppActions.updateAssesmentRem(false);
  //     this.props.AppActions.updateAppointmentRem(false);
  //   }
  // }
  _onPressTab = (index, item) => {
    let { componentId, playlistDynamicRes } = this.props;
    let currentWeek, currentday;
    if (playlistDynamicRes !== undefined && playlistDynamicRes !== null) {
      if (
        playlistDynamicRes.totalWeeks !== null &&
        playlistDynamicRes.totalWeeks !== undefined
      ) {
        if (playlistDynamicRes.week > playlistDynamicRes.totalWeeks) {
          currentWeek = playlistDynamicRes.totalWeeks;
          currentday = 7;
        } else {
          currentWeek = playlistDynamicRes.week;
          currentday = playlistDynamicRes.day;
        }
      } else {
        currentWeek = 1;
        currentday = 1;
      }
    } else {
      currentWeek = 1;
      currentday = 1;
    }

    if (item.id === 0) {
      navigatorPush({ componentId, screenName: 'Assessments', passProps: {} });
    } else if (item.id === 1) {
      navigatorPush({ componentId, screenName: 'CareTeam', passProps: {} });
    } else if (item.id === 2) {
      navigatorPush({ componentId, screenName: 'Symptoms', passProps: {} });
    } else if (item.id === 3) {
      // add apple health kit here and one msg
      // this.callAppleHealthKit()
    } else if (item.id === 4) {
      navigatorPush({ componentId, screenName: 'Journal', passProps: {} });
    } else if (item.id === 5) {
      navigatorPush({
        componentId,
        screenName: 'ProgramList',
        passProps: { week: currentWeek, day: currentday },
      });
    } else if (item.id === 6) {
      navigatorPush({ componentId, screenName: 'Settings', passProps: {} });
    } else if (item.id === 7) {
      navigatorPush({ componentId, screenName: 'Reports', passProps: {} });
    } else if (item.id === 8) {
      navigatorPush({ componentId, screenName: 'DailyTracker', passProps: {} });
    }
  };

  onModalItemPress = (type, assessment) => {
    let { componentId, playlistDynamicRes, loginData } = this.props;
    switch (type) {
      case 'sleep':
        navigatorPush({
          componentId,
          screenName: 'SleepTracker',
          passProps: {},
        });
        break;
      case 'activity':
        navigatorPush({
          componentId,
          screenName: 'ActivityTracker',
          passProps: {},
        });
        break;
      case 'mood':
        navigatorPush({
          componentId,
          screenName: 'MoodTracker',
          passProps: {},
        });
        break;
      case 'journal':
        navigatorPush({ componentId, screenName: 'Journal', passProps: {} });
        break;
      case 'learning':
        let postData = {
          week:
            playlistDynamicRes !== undefined && playlistDynamicRes !== null
              ? playlistDynamicRes.week
              : 2,
          day:
            playlistDynamicRes !== undefined && playlistDynamicRes !== null
              ? playlistDynamicRes.day
              : 3,
          user_id: loginData['user']['_id'],
          language: this.props.user_language,
        };
        this.props.AppActions.getCardsforDay(postData, 0, res => {
          navigatorPush({
            componentId,
            screenName: 'WeekInfoList',
            passProps: {
              week:
                playlistDynamicRes !== undefined && playlistDynamicRes !== null
                  ? playlistDynamicRes.week
                  : 1,
              day:
                playlistDynamicRes !== undefined && playlistDynamicRes !== null
                  ? playlistDynamicRes.day
                  : 1,
            },
          });
        });
        break;
      case 'assessment':
        const { _id, name, patient_assessment_id, status } = assessment;
        navigatorPush({
          componentId,
          screenName: 'AssessmentDetail',
          passProps: {
            assessment_id: _id,
            assessmentName: name,
            patientAssessmentId: patient_assessment_id,
            assessment_status: status,
          },
        });
        break;
      default:
        break;
    }
  };

  callAppleHealthKit() {
    // const PERMS = AppleHealthKit.Constants.Permissions;
    // let options = {
    //   permissions: {
    //     read: [
    //       PERMS.Steps,
    //       PERMS.SleepAnalysis,
    //       PERMS.HeartRate,
    //       PERMS.ActiveEnergyBurned,
    //       PERMS.DistanceCycling,
    //       PERMS.BloodPressureDiastolic,
    //       PERMS.BloodPressureSystolic,
    //     ],
    //     write: [
    //       PERMS.Steps,
    //       PERMS.SleepAnalysis,
    //       PERMS.HeartRate,
    //       PERMS.ActiveEnergyBurned,
    //       PERMS.DistanceCycling,
    //       PERMS.BloodPressureDiastolic,
    //       PERMS.BloodPressureSystolic,
    //     ],
    //   },
    // };
    // AppleHealthKit.initHealthKit(options, (err, results) => {
    //   if (err) {
    //     return;
    //   } else {
    //     Alert.alert('Apple health kit data sync successfully!');
    //   }
    //   // Height Example
    //   AppleHealthKit.getDateOfBirth(null, (err, results) => { });
    // });
  }
  _logout = () => {
    let { componentId, loginData } = this.props;
    Alert.alert(
      'Are you sure you want to logout?',
      '',
      [
        {
          text: 'Yes',
          onPress: () => this.props.AppActions.logout(loginData['user']['_id']),
        },
        {
          text: 'No',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
      ],
      { cancelable: false },
    );
  };

  onPopupOkayPress = () => {
    this.props.AppActions.togglePopup(false);
  };

  render() {
    let { isLoading, componentId, loginData } = this.props;
    let { notificationData } = this.state;
    let title, body;
    if (notificationData != '' && notificationData != undefined) {
      title = notificationData.notification.title;
      body = notificationData.notification.body;
    }
    return (
      <View style={Styles.homeContainer}>
        <TabSwitcher>
          <TabPanel whenActive={STRINGS.WALL}>
            <View
              style={{
                flex: 1,
                backgroundColor: COLOR.BACKGROUND,
              }}>
              <Header
                isLeftIcon={false}
                isRightIcon={false}
                isTitle={true}
                title={strings.resource.resources}
                isLogout={false}
                titleStyle={{
                  paddingTop: RFValue(10),
                }}
              />

              <Dashboard
                onPressTab={this._onPressTab}
                logout={this._logout}
                dashLoader={isLoading}
              />
            </View>
          </TabPanel>

          <TabPanel whenActive={STRINGS.PLAYLIST}>
            <Playlist componentId={componentId} />
          </TabPanel>

          <TabPanel whenActive={STRINGS.CHAT}>
            <Chat componentId={componentId} />
          </TabPanel>

          <TabPanel whenActive={STRINGS.HELP}>
            <Help componentId={componentId} />
          </TabPanel>
          <TabBar
            onModalItemPress={(type, assessment) => {
              this.onModalItemPress(type, assessment);
            }}
          />
        </TabSwitcher>

        {/* <Modal visible={this.state.modalVisible} transparent={false}>
          <View style={{ flex: 1, backgroundColor: "#FFF" }}>
            <View style={Styles.mainViewStyle}>
              <Text>
              
                {title} {""} {body}
              </Text>
              <View style={Styles.viewStyle}>
                <TouchableOpacity
                  style={Styles.acceptStyle}
                  onPress={() => this._acceptCall(notificationData)}
                >
                  <Text style={Styles.textStyle}>Accept</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={Styles.declineStyle}
                  onPress={() => this._declineCall(notificationData)}
                >
                  <Text style={Styles.textStyle}>Decline</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal> */}
        <AlertModal
          visible={this.props.popupStatus}
          //visible={true}
          description={strings.home.complete_learning}
          onYesPress={this.onPopupOkayPress}
        />
      </View>
    );
  }
}
const mapStateToProps = ({ authReducer, playlistReducer, dashboardReducer }) => ({
  isLoading: authReducer.isLoading,
  loginData: authReducer.loginData,
  playlistDynamicRes: playlistReducer.playlistDynamicRes,
  authReducer: authReducer,
  user_language: authReducer.language,
  popupStatus: dashboardReducer.isPopupShow,
});
const mapDispatchToProps = dispatch => ({
  AppActions: bindActionCreators(AppActions, dispatch),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DashBoard);
const Styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
  },
  acceptStyle: {
    padding: 10,
    backgroundColor: 'green',
    borderColor: 'green',
    borderWidth: 1,
    borderRadius: 20,
    margin: 5,
  },
  declineStyle: {
    padding: 10,
    backgroundColor: 'red',
    borderColor: 'red',
    borderWidth: 1,
    borderRadius: 20,
    margin: 5,
  },
  textStyle: { color: '#FFF', paddingLeft: 10, paddingRight: 10 },
  viewStyle: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  mainViewStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Dimensions.get('window').width / 1.5,
  },
});
