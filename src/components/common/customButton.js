// @ts-nocheck
import Loader from "@components/common/loader";
import GLOBALS from "@constants";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { RFValue } from "react-native-responsive-fontsize";

const { FONTS, COLOR } = GLOBALS;
const { PRIMARY, WHITE, GREY, DARK_GREEN, BLACK } = COLOR;
export default (CustomButton = React.memo((props) => {
  let { text, loader, isDisabled, buttonStyle, buttonText, colors } = props;
  return (
    <TouchableOpacity
      disabled={loader || isDisabled}
      onPress={() => props.onBtnPress()}
    >
      <LinearGradient
        start={{ x: 0.55, y: 0 }}
        end={{ x: 0.55, y: 1 }}
        colors={colors}
        style={{
          ...buttonStyle,
          height: RFValue(40),
          width: "100%",
          borderRadius: RFValue(10),
          alignItems: "center",
          justifyContent: "center",
          //marginTop: RFValue(10),
        }}
      >
        {loader ? (
          <Loader />
        ) : (
          <Text style={{ ...styles.buttonText, ...buttonText }}>{text}</Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}));
const styles = StyleSheet.create({
  buttonText: {
    fontSize: RFValue(16),
    color: BLACK,
    textTransform: "uppercase",
    fontFamily: FONTS.REGULAR,
    fontWeight: "700",
    textAlign: "center",

  },
});
