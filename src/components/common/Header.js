// @ts-nocheck
import GLOBALS from "@constants";
import * as ICONS from "@images";
import React, { useState } from "react";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  View,
  Dimensions,
  StatusBar,
  Alert,
} from "react-native";
import { useSelector } from "react-redux";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import Ionicons from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";
import * as Images from "@images";

const { FONTS, COLOR, PRODUCT_TYPE } = GLOBALS;
const isiOS = Platform.OS == "ios";
let window = Dimensions.get("window");
function Header(props) {
  // const { primary, secondary } = useSelector(state => {
  //   return state.authReducer
  //     ;
  // });
  let {
    isLeftIcon = false,
    onLeftIconClick = () => {},
    isTitle = false,
    title = "",
    isRightIcon = false,
    onRightIconClick = () => {},
    findText = () => {},
    isMiddleIcon = false,
    isRightImage = false,
    isLogout = true,
    logoutApi = () => {},
    titleStyle,
    titleWrapperStyle,
    primary = COLOR.DARK_GREEN,
  } = props;
  const [isHeader, setisHeader] = useState(true);
  const logoutAlert = () => {
    Alert.alert(
      "Are you sure you want to logout?",
      "",
      [
        {
          text: "Yes",
          onPress: () => {
            logoutApi();
          },
        },
        {
          text: "No",
          onPress: () => {},
          style: "cancel",
        },
      ],
      { cancelable: false }
    );
  };
  return (
    <View style={{ backgroundColor: COLOR.WHITE }}>
      <StatusBar barStyle="light-content" backgroundColor={COLOR.PRIMARY1} />
      <LinearGradient
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.55, y: 1 }}
        colors={[primary, primary, primary]}
        // colors={['#672B7F', COLOR.DARK_GREEN, COLOR.DARK_GREEN]}
        style={{
          borderBottomLeftRadius: RFValue(35),
          borderBottomRightRadius: RFValue(35),
        }}
      >
        <View
          style={{
            minHeight: isiOS ? window.height / 7 : window.height / 9,
            width: window.width,
            // height: 200,
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
          backgroundColor: primary,
          borderBottomLeftRadius: RFValue(35),
          borderBottomRightRadius: RFValue(35),
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

        {isMiddleIcon === true ? (
          <View
            style={{
              ...styles.middleView,
            }}
          >
            {PRODUCT_TYPE == "FERTI" ? (
              <Image
                source={ICONS.fertiLogo}
                resizeMode="cover"
                style={styles.iconStyleFerti}
              />
            ) : PRODUCT_TYPE == "MSHS" ? (
              <Text
                style={{
                  marginTop: isiOS ? RFValue(36) : RFValue(15),
                  fontSize: 30,
                  color: "white",
                }}
              >
                CDT001
              </Text>
            ) : PRODUCT_TYPE == "Mamalift" ? (
              <Image
                source={ICONS.MamaLiftWhiteLogo}
                resizeMode="contain"
                style={styles.iconStyle}
              />
            ) : (
              <Image
                source={ICONS.StellaWhite}
                resizeMode="contain"
                style={styles.iconStyle}
              />
            )}
          </View>
        ) : null}

        {isTitle === true ? (
          <View style={{ ...styles.titleWrapper, ...titleWrapperStyle }}>
            <View style={styles.capTitle}>
              <Text
                // numberOfLines={1}
                style={{ ...styles.capTitleText, ...titleStyle }}
              >
                {title}
              </Text>
            </View>
          </View>
        ) : null}

        {isLogout === true ? (
          <TouchableOpacity
            onPress={() => logoutAlert()}
            style={{
              paddingTop: RFValue(30),
              flex: 0.2,
              alignItems: "center",
            }}
          >
            <Ionicons
              name={"ios-settings-outline"}
              size={25}
              color={"#FFF"}
              style={styles.capImage}
            />
          </TouchableOpacity>
        ) : (
          <View style={{ flex: 0.2 }} />
        )}
      </View>
    </View>
  );
}
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
    tintColor: COLOR.WHITE,
  },
  iconStyle: {
    height: RFValue(isiOS ? 45 : 45),
    width: RFValue(isiOS ? 140 : 140),
    marginTop: isiOS ? RFValue(36) : RFValue(15),
  },
  iconStyleFerti: {
    height: RFValue(isiOS ? 45 : 45),
    width: RFValue(isiOS ? 200 : 140),
    marginTop: isiOS ? RFValue(36) : RFValue(15),
  },
  capTitleText: {
    fontFamily: FONTS.REGULAR,
    fontSize: RFValue(isiOS ? 27 : 23),
    color: COLOR.WHITE,
    textAlign: "center",
    fontWeight: "600",
  },
  rightIcon: {
    flex: 1,
  },
  leftIconStyle: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    position: "absolute",
    // paddingTop: isMiddleIcon === true ? RFValue(10) : RFValue(15),
    flex: 1,
    width: "100%",
    // height: 120,
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
    flex: 0.8,
    paddingTop: isiOS ? RFValue(30) : RFValue(5),
    alignContent: "center",
  },
});

export default Header = React.memo(Header);
