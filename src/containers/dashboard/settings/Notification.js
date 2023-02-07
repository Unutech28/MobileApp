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
  Modal,
  Switch,
} from "react-native";
import { strings } from "@localization";
const PdfViewer = lazy(() => import("@components/dashboard/modals/PdfViewer"));

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { RFValue, RFPercentage } from "react-native-responsive-fontsize";
const { FONTS, COLOR, STRINGS, DARK_GREEN } = GLOBALS;
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
const { PRIMARY, WHITE, GREY, GREEN } = COLOR;
import { TextInput } from "react-native-paper";
import Ionicons from "react-native-vector-icons/Ionicons";
import { alertWithOneBtn } from "@helpers/common";
const Header = lazy(() => import("@components/common/Header"));
import styles from "./styles";
const isIOS = Platform.OS === "ios";
let window = Dimensions.get("window");
const NotificationModal = (props) => {
  let { settoggleNotification, user_data } = props;
  const info = [
    { id: 1, left: strings.notification.push_notification, right: "2.0.1" },
    { id: 2, left: strings.notification.email_notification, right: "124" },
    {
      id: 3,
      left: strings.notification.sms_notification,
      right: "Oct 19, 2021",
    },
  ];
  const [data, setData] = useState(info);
  const [isEnabled, setIsEnabled] = useState(
    user_data.push_notification ? true : false
  );
  const [isEnabledEmail, setIsEnabledEmail] = useState(
    user_data.email_notification ? true : false
  );
  const [isEnabledSms, setIsEnabledSms] = useState(
    user_data.sms_notification ? true : false
  );

  useEffect(() => {
    setIsEnabled(props.user_data.push_notification);
    setIsEnabledEmail(props.user_data.email_notification);
    setIsEnabledSms(props.user_data.sms_notification);
    // submitPressed(true)
    // setCurrentStep(props.currentStep.current_step);
    // setQuestionArray(props.cardData);
  }, [props.user_data]);
  const toggleNotification = (item) => {
    switch (item.id) {
      case 1: //Push Notification
        settoggleNotification({
          push_notification: !isEnabled,
          email_notification: user_data.email_notification,
          sms_notification: user_data.sms_notification,
        });
        break;
      case 2: //Email Notification
        settoggleNotification({
          email_notification: !isEnabledEmail,
          push_notification: user_data.push_notification,
          sms_notification: user_data.sms_notification,
        });
        break;
      case 3: //SMS Notification
        settoggleNotification({
          sms_notification: !isEnabledSms,
          push_notification: user_data.push_notification,
          email_notification: user_data.email_notification,
        });
        break;
      default:
        break;
    }
  };
  const renderItem = ({ item, index }) => {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: RFValue(30),
          // marginBottom: 15,
          // backgroundColor: "red",
        }}
      >
        <Text style={[styles.titleTextNotification, {}]}>{item.left}</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#6545B2" }}
          thumbColor={"#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => {
            item.left == "Push Notification"
              ? setIsEnabled(!isEnabled)
              : item.left == "Email Notification"
              ? setIsEnabledEmail(!isEnabledEmail)
              : setIsEnabledSms(!isEnabledSms);

            toggleNotification(item);
          }}
          value={
            item.left == "Push Notification"
              ? isEnabled
              : item.left == "Email Notification"
              ? isEnabledEmail
              : isEnabledSms
          }
        />
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
        title={strings.profile.Notification}
        titleStyle={{ fontSize: RFValue(25), paddingTop: RFValue(10) }}
      />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={styles.outerContainer}
      >
        <View
          style={{
            marginTop: RFValue(30),
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

export default SelectModal = NotificationModal;
