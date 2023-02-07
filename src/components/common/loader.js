// @ts-nocheck
import React from "react";
import { ActivityIndicator, View } from "react-native";
import GLOBALS from "../../constants";
const { COLOR } = GLOBALS;
export default (Loader = (props) => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ActivityIndicator
        size="large"
        color={COLOR.DARK_GREEN}
      />
    </View>
  );
});
