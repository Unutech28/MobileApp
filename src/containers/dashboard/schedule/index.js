// @ts-nocheck
import GLOBALS from '@constants';
import * as AppActions from '@actions';
import React, { Component, lazy } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { navigatorPop, navigatorPush } from '@config/navigationOptions';
const { COLOR } = GLOBALS;
const ScheduleComponent = lazy(() => import('@components/dashboard/schedule'));
const Header = lazy(() => import('@components/common/Header'));
import { strings } from "@localization";

import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import moment from 'moment';
let slectedDateArray = [];

class Schedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _markedDates: [],
      selectedArray: []
    };
    this._getHospitalTiming();
  }

  _getHospitalTiming = () => {
    let { loginData } = this.props;
    this.props.AppActions.getHospitalTime({ 'hospital_id': loginData['user']['hospital_id'] });
  };
  _onPressBook = (selectedData = '') => {
    let { caretakerID, loginData, componentId } = this.props;
    selectedData == ''
      ? alert('Error occured')
      : this.props.AppActions.postAppointmentSchedule({
        caretaker_id: caretakerID,
        user_id: loginData['user']['_id'],
        ...selectedData,
      }, componentId);
  };

  onDaySelect = (day) => {
    const { selectedArray } = this.state;
    let length = Object.keys(selectedArray).length
    let sDate = moment(day.dateString).format('YYYY-MM-DD')
    let filterDateMatched = selectedArray.find(e => e.date == sDate)

    //if selected date match with array then allow them to diselect
    if (length > 5 && filterDateMatched == undefined) {
      Alert.alert('You can not select more than 6 days')
    } else {
      const _format = 'YYYY-MM-DD'
      const _selectedDay = moment(day.dateString).format(_format);
      let selected = true;
      if (this.state._markedDates[_selectedDay]) {
        selected = !this.state._markedDates[_selectedDay].selected;
      }
      const updatedMarkedDates = { ...this.state._markedDates, ...{ [_selectedDay]: { selected } } }
      this.setState({ _markedDates: updatedMarkedDates });

      if (!selectedArray.some(e => e.date == sDate)) {
        selectedArray.push({ date: _selectedDay, selected });
      } else {
        let findIndex = selectedArray.findIndex(a => a.date == sDate)
        selectedArray.splice(findIndex, 1)
      }
    }
  }

  render() {
    let {
      componentId,
      isScheduleLoading,
      isScheduleFail,
      ScheduleData,
      HospitalTimeData,
      isHospitalTimeLoading,
      isHospitalTimeRefreshing,
      loginData
    } = this.props;
    return (
      <View style={Styles.homeContainer}>
        {/* <Header
          isLeftIcon={true}
          isTitle={true}
          onLeftIconClick={() => {
            navigatorPop({ componentId });
          }}
          title="Schedule"
        /> */}
        <Header
          isLeftIcon={true}
          isTitle={true}
          title={strings.tab3.appointment}
          onLeftIconClick={() => {
            navigatorPop({ componentId });
          }}
          isLogout={false}
          isMiddleIcon={false}
          titleStyle={{
            // fontSize: RFValue(28),
            paddingTop: RFValue(10),
          }}
        />

        <ScheduleComponent
          onPressBook={this._onPressBook}
          bookScheduleProp={{ isScheduleLoading, isScheduleFail, ScheduleData }}
          hospitalData={{
            HospitalTimeData,
            isHospitalTimeRefreshing,
            isHospitalTimeLoading,
          }}
          onDaySelect={this.onDaySelect}
          _markedDates={this.state._markedDates}
          selectedArray={this.state.selectedArray}
        />
      </View>
    );
  }
}

const mapStateToProps = ({ authReducer, dashboardReducer }) => ({
  loginData: authReducer.loginData,
  /* ADD Schedule */
  isScheduleLoading: dashboardReducer.isScheduleLoading,
  isScheduleFail: dashboardReducer.isScheduleFail,
  ScheduleData: dashboardReducer.ScheduleData,
  /* Get hospital time */
  HospitalTimeData: dashboardReducer.HospitalTimeData,
  isHospitalTimeLoading: dashboardReducer.isHospitalTimeLoading,
  isHospitalTimeRefreshing: dashboardReducer.isHospitalTimeRefreshing,
});
const mapDispatchToProps = dispatch => ({
  AppActions: bindActionCreators(AppActions, dispatch),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Schedule);
const Styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    backgroundColor: COLOR.BACKGROUND,
  },
});
