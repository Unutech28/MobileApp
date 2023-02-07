import React, { Component, lazy } from 'react';
import {
  Dimensions,
  StyleSheet,
  Animated,
  Keyboard,
  AppState,
  Text,
  View,
  Platform,
  Alert,
  BackHandler
} from 'react-native';
import moment from 'moment';
import styles from '../styles';
import * as AppActions from '@actions';
import { navigatorPop, navigatorPush } from '@config/navigationOptions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import GLOBALS from '@constants';
const { COLOR } = GLOBALS;
// const Header = lazy(() => import('@components/common/Header'));

const window = Dimensions.get('window');
import Icon2 from 'react-native-vector-icons/Ionicons'
import Toolbar from './toolBar';
import EntranceForm from './entranceForm';
import VidyoConnectorView from './vidyoConnectorView';

const { height: scrHeight } = Dimensions.get('screen');

class Vidyo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      /* Toolbar props */
      callButtonState: false,
      cameraButtonState: false,
      microphoneButtonState: false,
      connectionStatus: 'Waiting for expert to join...',
      clientVersion: '',
      /* Entrance form */
      host: 'prod.vidyo.io',
      token: '',
      displayName: this.props.userName,
      resourceId: this.props.appointmentId,

      connectorMode: 'VIDYO_CONNECTORMODE_Foreground',

      isEntranceFormHidden: false,
      isToolbarHidden: false,
      keyboardDidShow: false,

      toolbarBounceValue: new Animated.Value(0),
      eFormBounceValue: new Animated.Value(0),

      connected: false,
      onceConnected: false,
      backPressed: false,
      onceJoined: false,
      appState: AppState.currentState,

      isJoined: false,
    };

    this._getVideoCallToken();
    this._startTime()
  }

  _startTime() {
    this.props.AppActions.getScreenStartTime(moment().format())
  }

  _getVideoCallToken() {
    let postDataGT = {
      "userName": this.props.userName,
      "userId": this.props.userId,
      "appointmentId": this.props.appointmentId,
    }
    this.props.AppActions.getVideoToken(postDataGT);
  }

  componentDidMount() {
    setTimeout(() => {
      this._cameraButtonPressHandler();
    }, 1000);
    AppState.addEventListener('change', this._handleAppStateChange);
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow,
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide,
    );

    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      this.onBackPress();
      return true;
    });
    setTimeout(() => {
      this._cameraButtonPressHandler();
    }, 2000);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isVideoCallTokenSuccess) {
      this.setState({ token: nextProps.videoCallTokenData.token })
      this._callButtonPressHandler();
    }
  }

  componentWillUnmount() {
    // AppState.removeEventListener('change', this._handleAppStateChange);
    this.clearTimer();
    this.clearCallTimer();
    this.backHandler.remove();
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  onConnect = payload => {
    const { status, reason } = payload;
    this.setState(
      {
        // connectionStatus: reason,
        connectionStatus: "Waiting for expert to join...",//reason,
        callButtonState: !!status,
        connected: !!status,
      },
      () => {
        // this._toggleEntranceForm(!!status);
        this._toggleToolbar(!!status);
        // When user calls
        if (this.state.connected) {
          this.clearCallTimer();
          if (this.state.isJoined) {
            this.setState({ connectionStatus: "Consultation in progress..." })
          } else {
            try {
              if (this.timerHandle) {
                // Exception?
                return;
              }
              this.timerHandle = setTimeout(() => {
                this.vidyoConnector.disconnect()
                this.setState({
                  connectionStatus: "Not answering call",
                  isLoading: false
                })
                // this.notifyExpertOfMisscall()
              }, 60000);
            } catch (e) {
              console.error(e.message);
            }
          }
        } else {
          // alert("gone in else");
        }
      },
    );
  };

  clearTimer = () => {
    // Is our timer running?
    if (this.timerHandle) {
      // Yes, clear it
      clearTimeout(this.timerHandle);
      this.timerHandle = 0;
    }
  };
  clearCallTimer = () => {
    // Is our timer running?
    if (this.callTimerHandle) {
      // Yes, clear it
      clearTimeout(this.callTimerHandle);
      this.callTimerHandle = 0;
    }
  };
  onDisconnect = payload => {
    this.setState(
      {
        connected: false,
        connectionStatus: payload.reason,
        callButtonState: false,
        isJoined: false
      },
      () => {
        this._toggleEntranceForm(false);
        this._toggleToolbar(false);
      },
    );
  };

  onParticipantJoined = payload => {
    this.setState({
      //  connectionStatus: payload.participant.name + ' joined',
      connectionStatus: "Consultation in progress...",//payload.participant.name + ' joined',
      isJoined: true,
      onceJoined: true
    });
  };

  onParticipantLeft = payload => {
    this.setState({ connectionStatus: payload.participant.name + ' left', isJoined: false });
  };

  _toggleConnect() {
    if (this.state.connected) {
      this.vidyoConnector.disconnect();
    } else {
      let { host, token, displayName, resourceId } = this.state;
      this.vidyoConnector.connect(host, token, displayName, resourceId);
    }
  }

  _inputTextChanged = event => {
    switch (event.target) {
      case 'host':
        this.setState({ host: event.text });
        break;
      case 'token':
        this.setState({ token: event.text });
        break;
      case 'resourceId':
        this.setState({ resourceId: event.text });
        break;
      case 'displayName':
        this.setState({ displayName: event.text });
        break;
    }
  };

  _toolbarTogglePressHandler = event => {
    this._toggleToolbar(!this.state.isToolbarHidden);
  };

  _callButtonPressHandler = event => {
    this.setState(
      {
        callButtonState: !this.state.callButtonState,
      },
      () => {
        this._toggleConnect();
      },
    );

    try {
      if (this.callTimerHandle) {
        // Exception?
        return;
      }
      this.callTimerHandle = setTimeout(() => {
        if (!this.state.connected) {
          this.setState({
            callButtonState: false,
            connectionStatus: 'Unable to connect please try again later...',

          })
          this.vidyoConnector.disconnect();
        }
      }, 90000)
    } catch (e) {
      console.error(e.message);
    }
  };

  _cameraButtonPressHandler = event => {
    this.setState({ cameraButtonState: !this.state.cameraButtonState });
  };

  _microphoneButtonPressHandler = event => {
    this.setState({ microphoneButtonState: !this.state.microphoneButtonState });
  };

  _keyboardDidShow = () => {
    this.setState({ keyboardDidShow: true });
  };

  _keyboardDidHide = () => {
    this.setState({ keyboardDidShow: false });
  };

  _handleAppStateChange = nextAppState => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      this.setState({ connectorMode: 'VIDYO_CONNECTORMODE_Foreground' });
    } else if (nextAppState === 'background') {
      this.setState({ connectorMode: 'VIDYO_CONNECTORMODE_Background' });
    }
    this.setState({ appState: nextAppState });
  };

  _toggleEntranceForm = (hidden = true) => {
    const { eFormBounceValue, isEntranceFormHidden } = this.state;
    if (isEntranceFormHidden === hidden) {
      return;
    }
    Animated.spring(eFormBounceValue, {
      toValue: !isEntranceFormHidden ? -400 : 0,
      velocity: 2,
      tension: 1,
      friction: 4,
    }).start();
    this.setState({ isEntranceFormHidden: hidden });
  };

  _toggleToolbar = (hidden = true) => {
    const { toolbarBounceValue, isToolbarHidden } = this.state;
    if (isToolbarHidden === hidden) {
      return;
    }
    Animated.spring(toolbarBounceValue, {
      toValue: isToolbarHidden ? 0 : 70,
      velocity: 3,
      tension: 1,
      friction: 8,
    }).start();
    this.setState({ isToolbarHidden: hidden });
  };

  _resetToggles = hiddern => {
    this.setState(
      {
        isToolbarHidden: hiddern,
        isEntranceFormHidden: hiddern,
      },
      () => {
        this._toggleEntranceForm();
        this._toggleToolbar();
      },
    );
  };


  onBackPress() {
    Alert.alert('',
      'Are you sure you want to exit the consultation room?',
      [
        {
          text: 'Yes', onPress: () => {
            this._cameraButtonPressHandler()
            if (Platform.OS === 'ios') {
              if (this.state.connected) {
                this.setState({ isLoading: true })
                this.vidyoConnector.disconnect();
              }
            } else {
              this.vidyoConnector.disconnect();
            }
            this.onConfirm()
          }
        },
        { text: 'No', onPress: () => null }
      ],
      { cancelable: true }
    )
  }

  onConfirm() {
    let { componentId, loginData, activeScreenStartTime } = this.props;

    let postData = {
      user_id: loginData['user']['_id'],
      group: "Interventions",
      screen: "video-cal",
      startTime: activeScreenStartTime,
      endTime: moment().format(),
      date: moment().format(),
    }
    this.props.AppActions.addTimeTraker(postData);

    if (Platform.OS === 'android') {
      this.setState({ backPressed: true })
      navigatorPop({ componentId });
      // navigatorPush({
      //   componentId, screenName: 'Symptoms', passProps: {}
      // })
    } else {
      navigatorPop({ componentId });
      // navigatorPush({
      //   componentId, screenName: 'Schedule', passProps: {}
      // })
    }
  }

  renderTitleBar() {
    return (
      <View style={styles.homeContainerInd}>
        {/* <Header
          isLeftIcon={true}
          isTitle={true}
          isRightIcon={false}
          onLeftIconClick={() => {
            this.onBackPress()
          }}
          title="Video"
        /> */}
        {/* <InfoComponent /> */}
      </View>
    );
  }

  render() {
    let { isVideoCallTokenSuccess, videoCallTokenData } = this.props;
    return (
      <View style={{ flex: 1 }}>
        {this.renderTitleBar()}
        <View style={styles.body}>
          <VidyoConnectorView
            ref={ref => (this.vidyoConnector = ref)}
            style={styles.frame}
            viewStyle="ViewStyleDefault"
            remoteParticipants={8}
            logFileFilter="warning all@VidyoConnector info@VidyoClient"
            logFileName=""
            userData={0}
            cameraPrivacy={this.state.cameraButtonState}
            microphonePrivacy={this.state.microphoneButtonState}
            mode={this.state.connectorMode}
            onConnect={this.onConnect}
            onDisconnect={this.onDisconnect}
            onParticipantJoined={this.onParticipantJoined}
            onParticipantLeft={this.onParticipantLeft}
          />
          <View style={styles.banner}>
            <Text style={styles.message}>
              {this.state.keyboardDidShow ? '' : this.state.connectionStatus}
            </Text>
          </View>
        </View>
        <Animated.View
          style={[
            styles.footer,
            { transform: [{ translateY: this.state.toolbarBounceValue }] },
          ]}>
          <View style={{ marginTop: 10 }}>
            <Toolbar
              callButtonState={this.state.callButtonState}
              cameraButtonState={this.state.cameraButtonState}
              microphoneButtonState={this.state.microphoneButtonState}
              clientVersion={this.state.clientVersion}
              isToolbarHidden={
                this.state.isToolbarHidden || this.state.keyboardDidShow
              }
              togglePressHandler={this._toolbarTogglePressHandler}
              callButtonPressHandler={this._callButtonPressHandler}
              cameraButtonPressHandler={this._cameraButtonPressHandler}
              microphoneButtonPressHandler={this._microphoneButtonPressHandler}
            />
          </View>
        </Animated.View>
      </View>
    );
  }
}



const mapStateToProps = ({ authReducer, dashboardReducer }) => ({
  isVideoCallTokenSuccess: dashboardReducer.isVideoCallTokenSuccess,
  videoCallTokenData: dashboardReducer.videoCallTokenData,
  activeScreenStartTime: dashboardReducer.getScreenStartTime,
  loginData: authReducer.loginData,
});
const mapDispatchToProps = dispatch => ({
  AppActions: bindActionCreators(AppActions, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(Vidyo);
