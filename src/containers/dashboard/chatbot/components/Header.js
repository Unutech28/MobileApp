import React, { useState, lazy, useCallback, useEffect } from "react";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  TouchableWithoutFeedback,
} from "react-native";
import * as Images from "@images";
import { useSelector, useDispatch } from "react-redux";
import tempStyle from "@components/dashboard/dailyLearningTemplates/globalTemplateStyle";
import RenderHtml from "react-native-render-html";
import Icon from "react-native-vector-icons/Entypo";
import CommnetIcon from "react-native-vector-icons/FontAwesome";
import EditIcon from "react-native-vector-icons/Feather";
import * as Animatable from "react-native-animatable";
import GLOBALS from "@constants";
const { FONTS, COLOR, STRINGS } = GLOBALS;
import Video from "react-native-video";
import FastImage from "react-native-fast-image";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import LinearGradient from "react-native-linear-gradient";
const isiOS = Platform.OS == "ios";
let window = Dimensions.get("window");

const { PRIMARY, DARK_GREEN, WHITE, BACKGROUND, grayBlack, BLACK, grey_300 } =
  COLOR;
/**Element for Image Loading */
const Header = (props) => {
  let {
    isLeftIcon = false,
    onLeftIconClick = () => {},
    isTitle = false,
    topTitle = "",
    title = "",
    isMiddleIcon = false,
  } = props;
  return (
    <View style={{ backgroundColor: COLOR.WHITE }}>
      <StatusBar barStyle="light-content" backgroundColor={COLOR.PRIMARY1} />
      <LinearGradient
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.55, y: 1 }}
        // colors={[PRIMARY, DARK_GREEN,DARK_GREEN]}
        colors={["#6545B2", DARK_GREEN, DARK_GREEN]}
        style={{
          borderBottomLeftRadius: RFValue(35),
          borderBottomRightRadius: RFValue(35),
        }}
      >
        <View
          style={{
            height: isiOS ? window.height / 7 : window.height / 9,
            width: window.width,
          }}
        />
      </LinearGradient>
      <View
        style={{
          ...styles.leftIconStyle,
          paddingTop:
            isMiddleIcon === true
              ? RFValue(9)
              : isiOS
              ? RFValue(15)
              : RFValue(5),
        }}
      >
        {isLeftIcon ? (
          <TouchableWithoutFeedback onPress={() => onLeftIconClick()}>
            <View
              style={[
                styles.section,
                [
                  styles.leftIconInnerStyle,
                  { marginTop: isTitle ? RFValue(10) : null },
                ],
              ]}
            >
              <Image source={Images.Back} resizeMode="contain" />
            </View>
          </TouchableWithoutFeedback>
        ) : (
          <View style={{ flex: 0.2 }} />
        )}

        <View style={{ ...styles.titleWrapper }}>
          <View style={styles.capTitle}>
            <Text numberOfLines={1} style={styles.capTitleTextHeading}>
              {topTitle}
            </Text>
            <Text numberOfLines={1} style={{ ...styles.capTitleText }}>
              {title}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    flex: 0.5,
    overflow: "hidden",
    paddingLeft: RFPercentage(1),
  },
  capTitle: {
    justifyContent: "center",
    flex: 1,
    paddingHorizontal: RFPercentage(isiOS ? 0.8 : 1.2),
    overflow: "hidden",
  },
  capImage: {
    height: RFPercentage(isiOS ? 4 : 5),
    width: RFPercentage(isiOS ? 4 : 5),
    alignSelf: "flex-start",
    tintColor: "#FFF",
  },
  iconStyle: {
    height: RFValue(isiOS ? 45 : 45),
    width: RFValue(isiOS ? 140 : 140),
    marginTop: isiOS ? RFValue(36) : RFValue(15),
  },
  capTitleText: {
    fontFamily: FONTS.REGULAR,
    fontSize: RFValue(isiOS ? 23 : 23),
    color: COLOR.WHITE,
    fontWeight: "900",
  },
  capTitleTextHeading: {
    fontFamily: FONTS.REGULAR,
    fontSize: RFValue(isiOS ? 17 : 23),
    color: COLOR.WHITE,
    fontWeight: "500",
  },
  rightIcon: {
    flex: 1,
  },
  leftIconStyle: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    //alignItems: "center",
    position: "absolute",
    flex: 1,
    width: "100%",
  },
  leftIconInnerStyle: {
    flex: 0.2,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: isiOS ? RFValue(15) : RFValue(15),
  },
  middleView: {
    flex: 0.8,
    alignContent: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  titleWrapper: {
    flex: 1,
    paddingTop: isiOS ? RFValue(35) : RFValue(5),
    // alignContent: "center",
    //justifyContent: 'center'
  },
});

export { Header };
