import ButtonNew from "@components/common/buttonNew";
import CustomButton from "@components/common/customButton";
import GLOBALS from "@constants";
import * as Images from "@images";
import { validatePassword } from "@utils/ValidationUtils";
import React, { useState, lazy, useEffect } from "react";
import Icon from "react-native-vector-icons/FontAwesome5";

import {
  Image,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  // TextInput,
  View,
  StatusBar,
  ImageBackground,
  Alert,
  Dimensions,
  ScrollView,
  FlatList,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import { strings } from "@localization";
import DeviceInfo from "react-native-device-info";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { RFValue, RFPercentage } from "react-native-responsive-fontsize";
const { FONTS, COLOR, STRINGS } = GLOBALS;
const {
  SIGNIN,
  SIGNUP,
  EMAILADDR,
  EMAILPASWD,
  EMAILHOLDER,
  EMAIL_ERROR,
  PASSWORD_ERROR,
  VALID_ERROR,
} = STRINGS;
const { PRIMARY, WHITE, GREY, DARKGREY } = COLOR;
import { TextInput } from "react-native-paper";
import Ionicons from "react-native-vector-icons/Ionicons";
import { alertWithOneBtn } from "@helpers/common";
const Header = lazy(() => import("@components/common/Header"));
import moment from "moment";
import "moment/locale/es";
import "moment/locale/en-gb";
import styles from "./styles";
const isIOS = Platform.OS === "ios";
let window = Dimensions.get("window");
const AppInfoModal = (props) => {
  let osBuild = DeviceInfo.getBuildNumber();
  let osVersion = DeviceInfo.getVersion();
  const info = [
    { id: 1, left: strings.appInfo.version, right: DeviceInfo.getVersion() },
    { id: 2, left: strings.appInfo.build, right: DeviceInfo.getBuildNumber() },
    {
      id: 3,
      left: strings.appInfo.lastUpdate,
      right: moment("2023-01-30")
        .locale(strings.APP_INFO.momentLanguage)
        .format("MMM DD, YYYY"),
    },
    {
      id: 4,
      left: strings.appInfo.offeredby,
      right: strings.APP_INFO.CurioDigital,
    },
    {
      id: 5,
      left: strings.appInfo.releasedOn,
      right: moment("2022-09-23")
        .locale(strings.APP_INFO.momentLanguage)
        .format("MMM DD, YYYY"),
    },
  ];
  const [data, setData] = useState(info);
  const renderItem = ({ item, index }) => {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: RFValue(15),
        }}
      >
        <Text style={[styles.titleText, {}]}>{item.left}</Text>
        <Text style={[styles.titleRightText]}>{item.right}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header
        isLeftIcon={true}
        isRightIcon={false}
        onLeftIconClick={() => {
          props.closeModal();
        }}
        isLogout={false}
        isTitle={true}
        title={strings.profile.info}
        titleStyle={{ fontSize: RFValue(25), paddingTop: RFValue(10) }}
      />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={styles.outerContainer}
      >
        <View
          style={{
            marginTop: 20,
            marginBottom: 20,
            paddingHorizontal: RFValue(24),
          }}
        >
          <View style={styles.ListView}>
            <FlatList
              data={data}
              keyExtractor={(item) => {
                item.id;
              }}
              renderItem={renderItem}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default SelectModal = AppInfoModal;
