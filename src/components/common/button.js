// @ts-nocheck
import Loader from '@components/common/loader';
import GLOBALS from '@constants';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
const { FONTS, COLOR } = GLOBALS;
const { PRIMARY, WHITE, GREY, DARK_GREEN } = COLOR;

// common Button 
export default (Button = React.memo(props => {
  let { text, loader, isDisabled } = props;
  return (
    <TouchableOpacity
      style={{
        height: RFValue(45),
        width: '100%',
        borderRadius: RFValue(5),
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: RFValue(10),
        backgroundColor: isDisabled ? GREY : DARK_GREEN,
      }}
      disabled={loader || isDisabled}
      onPress={() => props.onBtnPress()}>
      {loader ? <Loader /> : <Text style={styles.buttonText}>{text}</Text>}
    </TouchableOpacity>
  );
}));
const styles = StyleSheet.create({
  buttonText: {
    fontSize: RFValue(15),
    color: WHITE,
    textTransform: 'uppercase',
    fontFamily: FONTS.MEDIUM,
    textAlign: 'center',
  },
});
