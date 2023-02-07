/* eslint-disable react-native/no-inline-styles */
/* eslint-disable module-resolver/use-alias */
// @ts-nocheck
import GLOBALS from '@constants';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import { Switch } from 'react-native-paper';
import { RFC_2822 } from 'moment-timezone';

const { FONTS, COLOR } = GLOBALS;

function Reminders(props) {

  let { onSwitchClick, meditationValue, assessmentValue, appointmentValue } = props;
  const [medication, setMedication] = useState(meditationValue);
  const [assessment, setAssesment] = useState(assessmentValue);
  const [appointment, setAppointment] = useState(appointmentValue);

  const onClickMeditation = () => {
    setMedication(meditationValue);
    onSwitchClick(meditationValue, assessmentValue, appointmentValue, 1);
  };

  const onClickAssessment = () => {
    setAssesment(assessmentValue);
    onSwitchClick(meditationValue, assessmentValue, appointmentValue, 2);
  };

  const onClickAppointment = () => {
    setAppointment(appointmentValue);
    onSwitchClick(meditationValue, assessmentValue, appointmentValue, 3);
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingBottom: RFValue(16),
        }}>
        <Text
          style={{
            fontFamily: FONTS.REGULAR,
            color: COLOR.GREY,
            fontSize: 24,
          }}>
          Medication
        </Text>
        <Switch value={medication} onValueChange={onClickMeditation} />
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingBottom: RFValue(16),
        }}>
        <Text
          style={{
            fontFamily: FONTS.REGULAR,
            color: COLOR.GREY,
            fontSize: 24,
          }}>
          Assessment
        </Text>
        <Switch value={assessment} onValueChange={onClickAssessment} />
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingBottom: RFValue(16),
        }}>
        <Text
          style={{
            fontFamily: FONTS.REGULAR,
            color: COLOR.GREY,
            fontSize: 24,
          }}>
          Appointment
        </Text>
        <Switch value={appointment} onValueChange={onClickAppointment} />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOR.BACKGROUND,
    marginHorizontal: RFPercentage(2),
    paddingHorizontal: RFValue(8),
    flexGrow: 1,
  },
});
export default (Reminders = React.memo(Reminders));
