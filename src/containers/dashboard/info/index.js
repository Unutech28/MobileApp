/* eslint-disable prettier/prettier */
// @ts-nocheck
import * as AppActions from '@actions';
import { navigatorPop, navigatorPush } from '@config/navigationOptions';
import GLOBALS from '@constants';
import React, { Component, lazy } from 'react';
import { StyleSheet, View, Text, Linking, TouchableOpacity } from 'react-native';
import { connect, AppState } from 'react-redux';
import { bindActionCreators } from 'redux';
const { COLOR } = GLOBALS;
const InfoComponent = lazy(() => import('@components/dashboard/info'));
const Header = lazy(() => import('@components/common/Header'));
import Loader from '@components/common/screenLoader';
import moment from 'moment';
import { RFValue } from 'react-native-responsive-fontsize';
// import Video from 'react-native-video';
import Styles from './styles';
class Info extends Component {
  constructor(props) {
    super(props);
    this.state = {
      getCBTData: [],
      isLaoding: true,
      apiCall: 0,
      appState: '',
      // appState: AppState.currentState !== undefined ? AppState.currentState : ''
    };

    this.setState({ isLaoding: true })
    this._getCBT();
  }

  _getCBT() {
    this.props.AppActions.getCBT();
  }
  componentDidMount() {
    this.props.AppActions.getScreenStartTime(moment().format())
  }
 
  _handleAppStateChange = (nextAppState) => {
    this.setState({ appState: nextAppState });
  }

  componentWillReceiveProps(nextProps) {
    let { componentId } = this.props;
    if (nextProps.isCbtCateLogSuccess) {
      this.setState({
        isLaoding: false,
        getCBTData: nextProps.cbtCateLogData
      })
    }

    if (this.state.apiCall === 1) {
      if (nextProps.isCbtCourseSuccess) {
        this.setState({ apiCall: 0 })
        navigatorPush({
          componentId, screenName: 'CbtCourses', passProps: {
            "CBTCoursesList": nextProps.cbtCoursesData
          }
        });
      }
    }
  }

  _goToDetail = (item) => {
    let postData = {
      "courseId": item.courseId,
      "courseInstance": item.courseInstance,
    }
    this.setState({ apiCall: 1 })
    this.props.AppActions.getCBTDetail(postData);
  }

  _goBack() {
    let { componentId, loginData, activeScreenStartTime } = this.props;
    navigatorPop({ componentId });
  }

  render() {
    let { componentId } = this.props;
    let { getCBTData } = this.state;
    return (
      <View style={Styles.homeContainer}>
        <Header
          isLeftIcon={true}
          isTitle={true}
          isRightIcon={false}
          onLeftIconClick={() => this._goBack()}
          title="CBT"
        />
        <InfoComponent
          CBTList={getCBTData}
          goToDetail={this._goToDetail}
          isLoading={this.state.isLaoding}
        />
      </View>
    );
  }
}
const mapStateToProps = ({ authReducer, dashboardReducer }) =>
({
  loginData: authReducer.loginData,
  cbtCoursesData: dashboardReducer.cbtCoursesData,
  isCbtCourseSuccess: dashboardReducer.isCbtCourseSuccess,
  isCbtCateLogSuccess: dashboardReducer.isCbtCateLogSuccess,
  cbtCateLogData: dashboardReducer.cbtCateLogData,
  activeScreenStartTime: dashboardReducer.getScreenStartTime
});
const mapDispatchToProps = dispatch => ({
  AppActions: bindActionCreators(AppActions, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(Info);

