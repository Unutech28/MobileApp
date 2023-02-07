// @ts-nocheck
import Loader from "@components/common/loader";
import GLOBALS from "@constants";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { RFValue, RFPercentage } from "react-native-responsive-fontsize";
const { FONTS, COLOR } = GLOBALS;
const { PRIMARY, WHITE, GREY } = COLOR;
//const activeColor = ['#6545B2', COLOR.DARK_GREEN];
const activeColor = [COLOR.DARK_GREEN, COLOR.DARK_GREEN];
const inactiveColor = ["#676767", "#676767"];
export default ButtonNew = React.memo((props) => {
  let { text, loader, isDisabled } = props;
  return (
    <TouchableOpacity
      disabled={loader || isDisabled}
      onPress={() => props.onBtnPress()}
    >
      <LinearGradient
        start={{ x: 0.55, y: 0 }}
        end={{ x: 0.55, y: 1 }}
        colors={
          isDisabled ? inactiveColor : [COLOR.DARK_GREEN, COLOR.DARK_GREEN]
        }
        style={{
          height: RFValue(45),
          width: "100%",
          borderRadius: RFPercentage(1),
          alignItems: "center",
          justifyContent: "center",
          marginTop: RFValue(10),
        }}
      >
        {loader ? <Loader /> : <Text style={styles.buttonText}>{text}</Text>}
      </LinearGradient>
    </TouchableOpacity>
  );
});
const styles = StyleSheet.create({
  buttonText: {
    fontSize: RFValue(15),
    color: WHITE,
    textTransform: "uppercase",
    fontFamily: FONTS.MEDIUM,
    textAlign: "center",
    fontWeight: "500",
  },
});
