/* eslint-disable prettier/prettier */
import GLOBALS from "@constants";
import * as ICONS from "@images";
import React from "react";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import FAIcon from "react-native-vector-icons/FontAwesome";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import ShadowView from "../../../common/ShadowView";
import { strings } from "@localization";

const isiOS = Platform.OS == "ios";
const { FONTS, COLOR } = GLOBALS;
const { SHADOW, TEXT_ORANGE, GREY, DARK_GREEN } = COLOR;
const { LIGHT, BOLD } = FONTS;

function TotalPoints(props) {
  const { totalPoints } = props;
  return (
    <ShadowView style={{ marginHorizontal: RFValue(16) }}>
      <View style={cardStyle.mainView}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* <Image
            source={require('../../../../assets/images/star.png')}
            resizeMode="contain"
            style={cardStyle.capImage}
          /> */}
          <Text style={cardStyle.details}>{strings.points.TotalPoints}</Text>
        </View>
        <Text style={cardStyle.detailsText}>{totalPoints}</Text>
      </View>
    </ShadowView>
  );
}
const cardStyle = StyleSheet.create({
  container: {
    backgroundColor: COLOR.BACKGROUND,
    paddingHorizontal: RFValue(16),
    flexGrow: 1,
  },
  mainView: {
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: RFValue(8),
    //  marginBottom: RFValue(8),
    borderWidth: 1,
    borderColor: DARK_GREEN,
    paddingTop: RFValue(20),
    paddingBottom: RFValue(20),
  },
  details: {
    paddingLeft: 10,
    paddingHorizontal: 0,
    fontFamily: LIGHT,
    flexDirection: "row",
    color: "#0F243D",
    fontSize: RFValue(isiOS ? 16 : 17),
    fontWeight: "600",
  },
  detailsText: {
    fontFamily: BOLD,
    fontSize: RFValue(isiOS ? 36 : 25),
    color: DARK_GREEN,
    paddingTop: RFValue(1),
  },
  capImage: {
    height: RFPercentage(3),
    width: RFPercentage(3),
    alignSelf: "center",
  },
});
export default (TotalPoints = React.memo(TotalPoints));
