// @ts-nocheck
import * as AppActions from '@actions/';
import { navigatorPush, navigatorPop } from '@config/navigationOptions';
import GLOBALS from '@constants';
import React, { Component, lazy } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity,
  Platform,
} from 'react-native';
import { RFValue, RFPercentage } from 'react-native-responsive-fontsize';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
const { FONTS, COLOR, URL } = GLOBALS;
const Header = lazy(() => import('@components/common/Header'));
const isiOS = Platform.OS == 'ios';
import RestClient from '@helpers/RestClient';
import styles from './styles';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import { ratio, screenWidth } from "../../../utils/Styles";

const audioRecorderPlayer = new AudioRecorderPlayer();

class voiceRecording extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: '',
      isLoggingIn: false,
      recordSecs: 0,
      recordTime: "00:00:00",
      currentPositionSec: 0,
      currentDurationSec: 0,
      playTime: "00:00:00",
      duration: "00:00:00",
    };
    // audioRecorderPlayer = new AudioRecorderPlayer();
    audioRecorderPlayer.setSubscriptionDuration(0.09); // optional. Default is 0.1
  }

  onStatusPress = (e) => {
    const touchX = e.nativeEvent.locationX;
    const playWidth =
      (this.state.currentPositionSec / this.state.currentDurationSec) *
      (screenWidth - 56 * ratio);

    const currentPosition = Math.round(this.state.currentPositionSec);

    if (playWidth && playWidth < touchX) {
      const addSecs = Math.round(currentPosition + 1000);
      this.audioRecorderPlayer.seekToPlayer(addSecs);
    } else {
      const subSecs = Math.round(currentPosition - 1000);
      this.audioRecorderPlayer.seekToPlayer(subSecs);
    }
  };

  onStartRecord = async () => {
    // const result = await audioRecorderPlayer.startRecorder();

    const path = Platform.select({
      ios: 'hello.m4a',
      android: 'sdcard/hello.mp4', // should give extra dir name in android. Won't grant permission to the first level of dir.
    });
    const result = await audioRecorderPlayer.startRecorder(path);
    audioRecorderPlayer.addRecordBackListener((e) => {
      this.setState({
        recordSecs: e.current_position,
        recordTime: audioRecorderPlayer.mmssss(
          Math.floor(e.current_position),
        ),
      });
      return;
    });
  };

  onStopRecord = async () => {
    const result = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    this.setState({
      recordSecs: 0,
    });
    let formdata = new FormData()
    let file = {
      "uri": result,
      // "type": Platform.OS == 'ios' ? 'm4a' : 'mp3',
      // "name": Platform.OS == 'ios' ? 'hello.m4a' : 'hello.mp3'
      "type": Platform.OS == 'ios' ? 'audio/m4a' : 'audio/mp4',
      "name": Platform.OS == 'ios' ? 'sound.m4a' : 'sound.mp4',
    }
    formdata.append("data", file)
    //Call api to upload at server
    try {
      let json = await RestClient.postCall(URL.UPLOAD_VOICE_RECORDING, formdata);
    } catch (error) {
    }
  };

  onStartPlay = async () => {
    const path = Platform.select({
      ios: "hello.m4a",
      android: "sdcard/hello.mp4",
    });
    const msg = await audioRecorderPlayer.startPlayer(path);
    audioRecorderPlayer.setVolume(1.0);
    audioRecorderPlayer.addPlayBackListener((e) => {
      if (e.current_position === e.duration) {
        audioRecorderPlayer.stopPlayer();
      }
      this.setState({
        currentPositionSec: e.current_position,
        currentDurationSec: e.duration,
        playTime: audioRecorderPlayer.mmssss(Math.floor(e.current_position)),
        duration: audioRecorderPlayer.mmssss(Math.floor(e.duration)),
      });
      return;
    });
  };

  onPausePlay = async () => {
    await audioRecorderPlayer.pausePlayer();
  };

  onStopPlay = async () => {
    audioRecorderPlayer.stopPlayer();
    audioRecorderPlayer.removePlayBackListener();
  };

  render() {
    let { loginData, componentId } = this.props;
    let playWidth =
      (this.state.currentPositionSec / this.state.currentDurationSec) *
      (screenWidth - 56 * ratio);
    if (!playWidth) playWidth = 0;

    return (
      <View style={{ flex: 1, backgroundColor: COLOR.GREY }}>
        <Header
          isLeftIcon={true}
          isRightIcon={false}
          onLeftIconClick={() => { navigatorPop({ componentId }) }}
          isMiddleIcon={true}
        />
        <View style={{ flex: 0.9, alignItems: 'center' }}>
          <Text style={styles.titleTxt}>{'Audio Recorder Player'}</Text>
          <Text style={styles.txtRecordCounter}>{this.state.recordTime}</Text>

          <View style={styles.viewRecorder}>
            <View style={styles.recordBtnWrapper}>

              <TouchableOpacity
                style={{ padding: 8, borderWidth: 1, borderColor: '#FFF', margin: 5 }}
                onPress={() => this.onStartRecord()}>
                <Text style={{ fontSize: RFValue(20) }}>Record</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ padding: 8, borderWidth: 1, borderColor: '#FFF', margin: 5 }}
                onPress={() => this.onStopRecord()}>
                <Text style={{ fontSize: RFValue(20) }}>Stop</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.viewPlayer}>
              <TouchableOpacity
                style={styles.viewBarWrapper}
                onPress={this.onStatusPress}
              >
                <View style={styles.viewBar}>
                  <View style={[styles.viewBarPlay, { width: playWidth }]} />
                </View>
              </TouchableOpacity>
              <Text style={styles.txtCounter}>
                {this.state.playTime} / {this.state.duration}
              </Text>
              <View style={styles.playBtnWrapper}>
                <TouchableOpacity
                  style={{ padding: 8, borderWidth: 1, borderColor: '#FFF', margin: 5 }}
                  onPress={() => this.onStartPlay()}>
                  <Text style={{ fontSize: RFValue(20) }}>PLAY</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{ padding: 8, borderWidth: 1, borderColor: '#FFF', margin: 5 }}
                  onPress={() => this.onPausePlay()}>
                  <Text style={{ fontSize: RFValue(20) }}>PAUSE</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{ padding: 8, borderWidth: 1, borderColor: '#FFF', margin: 5 }}
                  onPress={() => this.onStopPlay()}>
                  <Text style={{ fontSize: RFValue(20) }}>STOP</Text>
                </TouchableOpacity>
              </View>
            </View>

          </View>

        </View>
      </View>
    );
  }
}
const mapStateToProps = ({ authReducer }) => ({
  loginData: authReducer.loginData,
});
const mapDispatchToProps = dispatch => ({
  AppActions: bindActionCreators(AppActions, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(voiceRecording);

