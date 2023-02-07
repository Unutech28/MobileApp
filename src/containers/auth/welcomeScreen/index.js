import ButtonNew from "@components/common/buttonNew";
import * as AppActions from "@actions";
import GLOBALS from "@constants";
import React, { lazy, useEffect, useState } from "react";
import { strings } from "@localization";
import { navigatorRoot } from "@config/navigationOptions";
import { WebView } from "react-native-webview";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
const { FONTS, COLOR, PRODUCT_TYPE } = GLOBALS;
const { WHITE } = COLOR;
const Header = lazy(() => import("@components/common/Header"));

import { getYoutubeId, userLanguage } from "@helpers/common";
let window = Dimensions.get("window");
import { useSelector, useDispatch } from "react-redux";

function WelcomeScreen(props) {
  const { getWelcomeData } = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(AppActions.getWelcomeData());
    console.log(
      "URl====>",
      `http://www.youtube.com/embed/${getYoutubeId(
        getWelcomeData?.video
      )}?cc_lang_pref=${userLanguage()}&cc_load_policy=1`
    );
  }, []);

  const closeVideo = () => {
    // setPausedVideo(true);
    setTimeout(() => {
      navigatorRoot("Dashboard", {
        openChat: true,
      });
    }, 500);
  };

  return (
    <View style={styles.container}>
      <Header
        isLeftIcon={false}
        isRightIcon={false}
        isLogout={false}
        isMiddleIcon={true}
        isTitle={false}
        title={""}
      />
      {/* <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1, height: '100%' }}
      > */}
      <View style={styles.outerContainer}>
        <View style={{ width: "100%", alignItems: "center" }}>
          <Text style={styles.welcomeTitle}>
            {/* {strings.login.welcome_title} {PRODUCT_TYPE} */}
            {strings.login.welcome_title} {" FertiLift"}
          </Text>
          <Text style={styles.welcomeMsg}>{getWelcomeData?.content}</Text>
        </View>
        {/* <WebView
          nestedScrollEnabled={true}
          scrollEnabled={true}
          showsVerticalScrollIndicator={true}
          showsHorizontalScrollIndicator={true}
          style={Platform.OS == 'ios' ? styles.fullScreen : styles.android}
          originWhitelist={['*']}
          allowsInlineMediaPlayback={true}
          source={{
            uri:
              `http://www.youtube.com/embed/${getYoutubeId(getWelcomeData?.video)}?cc_lang_pref=${userLanguage()}&cc_load_policy=1`,
          }}

        /> */}
        <View style={styles.submitContainer}>
          <ButtonNew
            text={strings.login.welcome_continue}
            onBtnPress={() => {
              closeVideo();
            }}
          />
        </View>
      </View>
      {/* </ScrollView> */}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.WHITE,
  },
  outerContainer: {
    backgroundColor: WHITE,
    paddingHorizontal: RFValue(10),
    height: "80%",
  },
  welcomeTitle: {
    fontFamily: FONTS.SEMI_BOLD,
    fontSize: RFValue(20),
    padding: RFValue(5),
    textAlign: "center",
  },
  welcomeMsg: {
    fontFamily: FONTS.LIGHT,
    fontSize: RFValue(12),
    fontWeight: "400",
    color: "#313132",
    padding: RFValue(5),
  },
  submitContainer: {
    justifyContent: "center",
    marginVertical: 20,
  },
  fullScreen: {
    height: window.width / 1.2,
    // width: '80%',
    borderRadius: RFValue(7),
    backgroundColor: COLOR.BACKGROUND,
    marginVertical: RFValue(5),
  },
  android: {
    height: window.width / 1,
    width: "95%",
    borderRadius: RFValue(7),
  },
});

export default WelcomeScreen = React.memo(WelcomeScreen);
