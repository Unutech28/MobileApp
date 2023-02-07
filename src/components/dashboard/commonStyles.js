import { StyleSheet } from "react-native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
const commonStyles = StyleSheet.create({
  buttonWrapper: {
    flex: 0.12,
    width: RFPercentage(15),
    alignSelf: "flex-end",
  },
});

export default commonStyles;
