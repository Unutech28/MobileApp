import React from "react";
import GLOBALS from "@constants";
import { View, StyleSheet } from "react-native";
const { COLOR } = GLOBALS;
const { PRIMARY, WHITE } = COLOR;
const ShadowView = (props) => {
  const { style } = props;
  return <View style={{ ...styles.wrapper, ...style }}>{props.children}</View>;
};
export default ShadowView;
const styles = StyleSheet.create({
  wrapper: {
    shadowColor: PRIMARY,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.46,
    shadowRadius: Platform.OS == "ios" ? 11.14 : 3,
    elevation: Platform.OS == "android" ? 0 : 17,
  },
});
