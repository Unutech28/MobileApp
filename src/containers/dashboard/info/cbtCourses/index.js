/* eslint-disable prettier/prettier */
// @ts-nocheck
import * as AppActions from '@actions';
import { navigatorPop, navigatorPush } from '@config/navigationOptions';
import GLOBALS from '@constants';
import React, { Component, lazy } from 'react';
import { StyleSheet, View, Dimensions, Text } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
const { COLOR } = GLOBALS;
const InfoComponent = lazy(() => import('@components/dashboard/info/cbtCourses'));
const Header = lazy(() => import('@components/common/Header'));
import Pdf from 'react-native-pdf';
import moment from 'moment';
import Styles from '../styles';
class Info extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPdf: false,
      source: '',
      courseName: '',
    };
  }
  componentDidMount() {
  }

  _goToDetail = (item) => {
    const source = { uri: item.url, cache: true };
    // const source = { uri: 'https://cpcontents.adobe.com/public/prime-player/index_7c719682f0dfa3e6f6eea326b32e347e_production.html?lo_id=course:1783393&access_token=003c74fe212fc3fa223c3eee8b2bf0da&hostName=captivateprime.adobe.com', cache: true };
    this.setState({ showPdf: true, source: source, courseName: item.name });
    //start time interval
    // get time current time
  }
  _backFromPdf() {
    this.setState({ showPdf: false });
    //Stop Time interval
  }

  render() {
    // const source = { uri: 'http://samples.leanpub.com/thereactnativebook-sample.pdf', cache: true };
    let { componentId } = this.props;
    return (
      <View style={Styles.homeContainer}>
        <Header
          isLeftIcon={true}
          isTitle={true}
          isRightIcon={false}
          onLeftIconClick={() => {
            !this.state.showPdf ? navigatorPop({ componentId }) :
              this._backFromPdf();
          }}
          title={this.state.showPdf ? this.state.courseName : "CBT Courses"}
        />
        {!this.state.showPdf ?
          <InfoComponent
            CBTList={this.props.CBTCoursesList}
            openPdf={this._goToDetail}
          />
          :
          <View
            style={Styles.pdfMainView}>
            <Pdf
              source={this.state.source}
              onLoadComplete={(numberOfPages, filePath) => {
              }}
              onPageChanged={(page, numberOfPages) => {
              }}
              onError={(error) => {
              }}
              onPressLink={(uri) => {
              }}
              style={Styles.pdfStyle} />
          </View>
        }

      </View>
    );
  }
}
const mapStateToProps = ({ authReducer, dashboardReducer }) =>
  ({
    loginData: authReducer.loginData,
    cbtCoursesData: dashboardReducer.cbtCoursesData,
    isCbtCourseSuccess: dashboardReducer.isCbtCourseSuccess,
  });
const mapDispatchToProps = dispatch => ({
  AppActions: bindActionCreators(AppActions, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(Info);

