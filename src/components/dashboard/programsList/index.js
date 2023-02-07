// @ts-nocheck
import GLOBALS from "@constants";
import * as Images from "@images";
import Theme from "@components/common/styles";
import React, { lazy } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Platform,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
  StyleSheet,
} from "react-native";
import { useSelector } from "react-redux";
import { RFValue, RFPercentage } from "react-native-responsive-fontsize";
const { FONTS, COLOR } = GLOBALS;
const { width } = Dimensions.get("window");
const isiOS = Platform.OS == "ios";
const Header = lazy(() => import("@components/common/Header"));
const { GREY, DARK_GREEN } = COLOR;
import { strings } from "@localization";

function ProgramList(props) {
  // const { primary, secondary } = useSelector(state => {
  //   return state.authReducer
  //     ;
  // });
  let TABS = [
    { id: 0, title: "Program 1" },
    { id: 1, title: "Program 2" },
    { id: 3, title: "Program 3" },
    { id: 4, title: "Program 4" },
  ];
  const { onPressTab, programsListArray, logout } = props;
  return (
    <View style={styles.secondViewStyle}>
      <FlatList
        data={programsListArray}
        contentContainerStyle={{
          marginTop: RFPercentage(2),
          paddingBottom: RFPercentage(isiOS ? 1 : 13),
        }}
        // numColumns={2}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => {
              onPressTab(index, item);
            }}
            style={{
              borderWidth: 0.5,
              flexDirection: "row",
              marginTop: RFPercentage(1.2),
              width: "90%",
              marginLeft: "auto",
              marginRight: "auto",
              borderRadius: RFValue(7),
              borderColor: GREY,
              overflow: "hidden",
              backgroundColor: COLOR.WHITE,
            }}
          >
            <View
              style={{
                height: RFValue(65),
                width: RFValue(100),
                overflow: "hidden",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: COLOR.DARK_GREEN,
                // backgroundColor: primary
              }}
            >
              <Image
                source={item.logo}
                resizeMode={"contain"}
                style={{
                  height: RFValue(30),
                  width: RFValue(35),
                  overflow: "hidden",
                }}
              />
            </View>
            <Text style={styles.textStyle} allowFontScaling={false}>
              {item.name}
            </Text>

            <Image
              source={Images.darkForward}
              resizeMode="contain"
              style={{ alignSelf: "center" }}
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flex: 0.1,
    alignItems: "center",
    justifyContent: "center",
  },
  rightLogo: {
    height: RFPercentage(6),
    width: RFPercentage(6),
    alignSelf: "center",
  },
  logoStyle: {
    height: RFPercentage(12),
    width: RFPercentage(12),
    alignSelf: "center",
  },
  imageStyle: {
    tintColor: COLOR.PRIMARY1,
    height: Platform.OS == "ios" ? RFPercentage(31) : RFPercentage(46),
    width: "100%",
  },
  headerMainView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    paddingTop: RFValue(20),
  },
  headerImage: {
    flex: 0.9,
    alignContent: "center",
    justifyContent: "center",
    paddingTop: isiOS ? 50 : 55,
    flexDirection: "row",
    marginLeft: RFValue(40),
  },
  logoutStyle: {
    flex: 0.1,
    paddingTop: 50,
    marginRight: RFValue(20),
  },
  logoutImageStyle: {
    height: RFValue(20),
    width: RFValue(20),
    tintColor: "red",
  },
  secondViewStyle: {
    flex: 0.9,
    paddingBottom: RFValue(40),
    // backgroundColor: 'blue',
    height: "82%",
    width: "100%",
    // position: 'absolute',
    // bottom: 0,
    // paddingHorizontal: RFValue(24),
    // paddingVertical: RFValue(8),
  },
  touchableStyle: {
    backgroundColor: COLOR.WHITE,
    paddingHorizontal: RFValue(16),
    paddingVertical: RFValue(8),
    width: (width - 48) / 2.1,
    height: (width - 48) / 2.5,
  },
  textStyle: {
    alignSelf: "center",
    paddingLeft: RFValue(20),
    fontFamily: FONTS.MEDIUM,
    fontSize: RFValue(isiOS ? RFValue(14) : RFValue(16)),
    color: COLOR.LIGHT_BLACK,
    fontWeight: "500",
    flex: 0.9,
  },
});

export default (ProgramList = React.memo(ProgramList));
