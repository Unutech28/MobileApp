// @ts-nocheck
import * as AppActions from '@actions';
import GLOBALS from '@constants';
import React, {Component, lazy} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
const {COLOR} = GLOBALS;
const PlaylistComponent = lazy(() => import('@components/dashboard/playlist'));
class Groups extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <View style={Styles.homeContainer}>
        <Text>Under Development</Text>
      </View>
    );
  }
}

const mapStateToProps = ({authReducer}) => ({loginData: authReducer.loginData});
const mapDispatchToProps = dispatch => ({
  AppActions: bindActionCreators(AppActions, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(Groups);

