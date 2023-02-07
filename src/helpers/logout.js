// @ts-nocheck
import * as AppActions from '@actions';
import React, { Component, lazy } from 'react';
import { Alert } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';


class Playlist extends Component {
  constructor(props) {
    super(props);

  }

  _logout = () => {
    let { componentId, loginData } = this.props;
    Alert.alert(
      'Are you sure you want to logout?',
      '',
      [
        {
          text: 'Yes',
          onPress: () => { this.props.AppActions.logout(loginData['user']['_id']) }
        },
        {
          text: 'No',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        },
      ],
      { cancelable: false }
    );
  };


}
const mapStateToProps = ({ authReducer }) => ({
  loginData: authReducer.loginData,

});
const mapDispatchToProps = dispatch => ({
  AppActions: bindActionCreators(AppActions, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(Playlist);
