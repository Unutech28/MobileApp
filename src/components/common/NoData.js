// @ts-nocheck
import GLOBALS from '@constants';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
const { FONTS, COLOR } = GLOBALS;
const { GREY } = COLOR;

// show empty text message
export default NoData = React.memo(props => {
  let { emptyTextMessage } = props;
  emptyTextMessage = emptyTextMessage ? emptyTextMessage : 'No data found';
  return (
    <View
      style={{
        flex: 1,
        borderRadius: RFValue(5),
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      {<Text style={styles.buttonText}>{emptyTextMessage}</Text>}
    </View>
  );
});
const styles = StyleSheet.create({
  buttonText: {
    fontSize: RFValue(15),
    color: GREY,
    textTransform: 'uppercase',
    fontFamily: FONTS.REGULAR,
    textAlign: 'center',
  },
});
