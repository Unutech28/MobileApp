// @ts-nocheck
import * as AppActions from '@actions';
import GLOBALS from '@constants';
import React, { Component, lazy } from 'react';
import { navigatorPop } from '@config/navigationOptions';
import Styles from './styles'
import { StyleSheet, View, Text } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

const { COLOR } = GLOBALS;
const Header = lazy(() => import('@components/common/Header'));
const RemindersComponent = lazy(() =>
  import('@components/dashboard/reminders'),
);
class Reminders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShow: true
    };
    this._getReminder();
  }

  _getReminder() {
    let { loginData } = this.props;

    if (loginData.user.isNotificationAble) {
      //true
      this.props.AppActions.updateMedicationRem(true);
      this.props.AppActions.updateAssesmentRem(true);
      this.props.AppActions.updateAppointmentRem(true);
    } else {
      //false
      this.props.AppActions.updateMedicationRem(false);
      this.props.AppActions.updateAssesmentRem(false);
      this.props.AppActions.updateAppointmentRem(false);
    }
  }

  _onSwitchClick = (medication, assessment, appointment, type) => {
    if (type === 1) {
      this.props.AppActions.updateMedicationRem(medication);
    } else if (type === 2) {
      this.props.AppActions.updateAssesmentRem(assessment);
    } else if (type === 3) {
      this.props.AppActions.updateAppointmentRem(appointment);
    }
    let { userId } = this.props;
    let postData = {
      isAssessmentNotification: assessment,
      user_id: userId,
      isAppointmentNotification: appointment,
      isMedicationNotification: medication,
    };
    this.props.AppActions.updateReminder(postData);
  }

  toggleShow = () => {
    this.setState({ isShow: !this.state.isShow });
  };

  render() {
    const {
      componentId,
      reminderUpdateMedittaion,
      reminderUpdateAssesment,
      reminderUpdateAppointment,
    } = this.props;
    return (
      <View style={Styles.homeContainer}>
        {/* <Header
          isLeftIcon={true}
          isTitle={true}
          onLeftIconClick={() => {
            navigatorPop({ componentId });
          }}
          title="Reminders"
        /> */}
        <Header
          isLeftIcon={true}
          isRightIcon={false}
          onLeftIconClick={() => {
            navigatorPop({ componentId });
          }}
          isMiddleIcon={true}
        />
        <RemindersComponent
          meditationValue={reminderUpdateMedittaion}
          assessmentValue={reminderUpdateAssesment}
          appointmentValue={reminderUpdateAppointment}
          onSwitchClick={this._onSwitchClick}
        />
      </View>
    );
  }
}
const mapStateToProps = ({ authReducer, dashboardReducer }) => ({
  userId: authReducer.loginData.user._id,
  loginData: authReducer.loginData,
  reminderUpdateMedittaion: dashboardReducer.reminderUpdateMedittaion,
  reminderUpdateAssesment: dashboardReducer.reminderUpdateAssessment,
  reminderUpdateAppointment: dashboardReducer.reminderUpdateAppointment,
});
const mapDispatchToProps = dispatch => ({
  AppActions: bindActionCreators(AppActions, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(Reminders);
