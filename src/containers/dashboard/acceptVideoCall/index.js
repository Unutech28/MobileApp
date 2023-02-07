// @ts-nocheck
import * as AppActions from '@actions/';
import React, { Component, lazy } from 'react';
import { StyleSheet, View, Alert, Text, TouchableOpacity, Dimensions } from 'react-native';
const Header = lazy(() => import('@components/common/Header'));
import { navigatorPop, navigatorPush } from '@config/navigationOptions';
import Styles from './styles';
class AcceptVideoCall extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  // _declineCall(data) {
  //   let postData = {
  //     appointment_request_id: data.data.appointment_request_id
  //   }
  //   this.props.AppActions.DeclineCall(postData);
  // }

  _acceptCall(data) {
    let { componentId } = this.props;
    navigatorPush({
      componentId, screenName: 'Vidyo', passProps: {
        "userName": data.data.patient_name,
        "userId": data.data.patient_user_id,
        "appointmentId": data.data.appointment_request_id,
        roomToken: '',
      }
    });
  }

  render() {
    let { isLoading, componentId, notificationData } = this.props;
    return (
      <View style={Styles.homeContainer}>
        <Header
          // isLeftIcon={false}
          // isTitle={true}
          // onLeftIconClick={() => {
          //   navigatorPop({ componentId });
          // }}
          title="Sandy"
        />
        <View style={Styles.mainViewStyle}>
          <Text>
            {this.props.notificationData.notification.title}{' '}
            {this.props.notificationData.notification.body}
          </Text>
          <View style={Styles.viewStyle}>
            <TouchableOpacity
              style={Styles.acceptStyle}
              onPress={() => this._acceptCall(notificationData)}>
              <Text style={Styles.textStyle}>Accept</Text>
            </TouchableOpacity>

            <TouchableOpacity style={Styles.declineStyle}>
              <Text style={Styles.textStyle}>Decline</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

export default AcceptVideoCall;


