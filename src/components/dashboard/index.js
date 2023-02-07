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
import { RFValue, RFPercentage } from "react-native-responsive-fontsize";
const { FONTS, COLOR } = GLOBALS;
const { width } = Dimensions.get("window");
const isiOS = Platform.OS == "ios";
const Header = lazy(() => import("@components/common/Header"));
const { GREY, DARK_GREEN } = COLOR;
import { strings } from "@localization";
import { useSelector } from "react-redux";
function Dashboard(props) {
  // const { primary, secondary } = useSelector(state => {
  //   return state.authReducer
  //     ;
  // });
  let TABS = [
    { id: 0, title: strings.resource.assessment, logo: Images.assessment },
    // { id: 1, title: strings.resource.care_team, logo: Images.care_team },

    { id: 4, title: strings.tab3.journal, logo: Images.journal_resource },
    { id: 5, title: strings.resource.my_learning, logo: Images.my_learning },
    // { id: 6, title: 'Settings', logo: Images.Info },
    { id: 7, title: strings.resource.report, logo: Images.report_resource },
    // { id: 2, title: strings.resource.schedule, logo: Images.schedule_resource },
    { id: 8, title: strings.resource.concern, logo: Images.care_concern },
    // { id: 8, title: "VoiceRecording", logo: Images.Schedule },
    // { id: 3, title: 'Sync Data \n(coming soon)', logo: Images.Sync },
  ];
  const { onPressTab, logout } = props;
  return (
    // <View
    //   style={styles.container}>

    <View style={styles.secondViewStyle}>
      <FlatList
        data={TABS}
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
                //  backgroundColor: primary
                backgroundColor: COLOR.DARK_GREEN,
              }}
            >
              {/* <ImageBackground
              source={Images.rectangle}
              resizeMode="cover"
              style={{
                height: RFValue(65),
                width: RFValue(100),
                overflow: "hidden",
                justifyContent: "center",
                alignItems: "center",
              }}
            > */}
              <Image
                source={item.logo}
                resizeMode={"contain"}
                style={{
                  height: RFValue(30),
                  width: RFValue(35),
                  overflow: "hidden",
                }}
              />
              {/* </ImageBackground> */}
            </View>
            <Text style={styles.textStyle} allowFontScaling={false}>
              {item.title}
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
    height: RFPercentage(isiOS ? 6 : 6),
    width: RFPercentage(isiOS ? 6 : 6),
    alignSelf: "center",
  },
  logoStyle: {
    height: RFPercentage(isiOS ? 12 : 12),
    width: RFPercentage(isiOS ? 12 : 12),
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

export default Dashboard = React.memo(Dashboard);
