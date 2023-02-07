import { Alert } from "react-native";
import Toast from "react-native-simple-toast";
import NetInfo from "@react-native-community/netinfo";
import CryptoJS from "react-native-crypto-js";
import { SvgUri, SvgCssUri } from "react-native-svg";
import { Image } from "react-native";
import React from "react";
import { strings } from "@localization";
import { decode as atob, encode as btoa } from "base-64";
import GLOBALS from "@constants";
const { STRINGS } = GLOBALS;
import store, { storeObj } from "@store/setup";
const toast = (args) => Toast.show(args);
const isInternet = async () =>
  await NetInfo.isConnected.fetch().then((isConnected) => isConnected);

const accessToken = () => {
  if (storeObj.store.getState().authReducer.loginToken) {
    return storeObj.store.getState().authReducer.loginToken;
  } else {
    return null;
  }
};

const FcmToken = () => {
  if (storeObj.store.getState().authReducer.fcmDeviceToken) {
    return storeObj.store.getState().authReducer.fcmDeviceToken;
  } else {
    return null;
  }
};

const getIPAdreessData = () => {
  if (storeObj.store.getState().authReducer.deviceIpAddressInfo) {
    return storeObj.store.getState().authReducer.deviceIpAddressInfo;
  } else {
    return null;
  }
};

const userLanguage = () => {
  if (storeObj.store.getState().authReducer.language) {
    return storeObj.store.getState().authReducer.language;
  } else {
    return "en";
  }
};

{
  /* Common funtions  */
}

//let accessToken = () => storeObj.store.getState().authReducer.loginToken;

const logoutSessionExpired = (text) => {
  return Alert.alert("Curio", "Session Expired", [
    { text: "OK", onPress: () => console.log("hjjhbhnn") },
  ]);
};

const encryptRequest = (data) => {
  // return data;
  return {
    data: CryptoJS.AES.encrypt(
      JSON.stringify(data),
      STRINGS.HIPPA_KEY
    ).toString(),
  };
};

const decryptRequest = (data) => {
  //return data;
  let bytes = CryptoJS.AES.decrypt(data, STRINGS.HIPPA_KEY);
  let res = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  return res;
};

const alertWithTwoBtn = (title, message, btn1Text, btn2Text) => {
  return new Promise((resolve, reject) => {
    Alert.alert(
      title,
      message,
      [
        {
          text: btn1Text,
          onPress: () => resolve(false),
        },
        {
          text: btn2Text,
          onPress: () => resolve(true),
        },
      ],
      { cancelable: false }
    );
  });
};

const alertWithOneBtn = (title, message, btn1Text) => {
  return new Promise((resolve, reject) => {
    Alert.alert(
      title,
      message,
      [
        {
          text: btn1Text,
          onPress: () => resolve(false),
        },
      ],
      { cancelable: false }
    );
  });
};
const alertWithTwoBtnCancel = (title, message, btn1Text, btn2Text) => {
  return new Promise((resolve, reject) => {
    Alert.alert(
      title,
      message,
      [
        {
          text: btn1Text,
          onPress: () => resolve(false),
          style: "cancel",
        },
        {
          text: btn2Text,
          onPress: () => resolve(true),
        },
      ],
      { cancelable: false }
    );
  });
};

const getImageView = (url, width = 150, height = 150) => {
  if (url?.match(/.(svg)$/i)) {
    return <SvgCssUri width={width} height={height} uri={url} />;
  } else {
    return (
      <Image
        resizeMode="contain"
        source={{ uri: url }}
        style={{ width: width, height: height }}
      />
    );
  }
};

const getErrorCodeMsg = (code) => {
  return strings.RESPONSE_ERR[code.toString()];
};

const getYoutubeId = (url) => {
  var regExp =
    /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  var match = url?.match(regExp);
  if (match && match[2]?.length == 11) {
    return match[2];
  } else {
    return url;
  }
};
const checkIfDateIsNotToday = (givenDate) => {
  let dateFrom = new Date().setHours(0, 0, 0, 0); //Start of current day
  let dateTo = new Date().setHours(24, 0, 0, 0); //End of current day
  let dateCheck = givenDate;
  /**Check if given date is in between the current date range */
  if (dateCheck <= dateTo && dateCheck >= dateFrom) {
    return false;
  } else {
    return true;
  }
};
const themPrimaryColor = () => {
  if (
    storeObj.store.getState().programReducer.activeProgramDetail.primaryColor
  ) {
    return storeObj.store.getState().programReducer.activeProgramDetail
      .primaryColor;
  } else {
    return "#6545B2";
  }
};
const themSecondryColor = () => {
  if (
    storeObj.store.getState().programReducer.activeProgramDetail.secondaryColor
  ) {
    return storeObj.store.getState().programReducer.activeProgramDetail
      .secondaryColor;
  } else {
    return "#6545B2";
  }
};

export {
  toast,
  isInternet,
  accessToken,
  logoutSessionExpired,
  encryptRequest,
  decryptRequest,
  alertWithTwoBtn,
  alertWithOneBtn,
  alertWithTwoBtnCancel,
  getImageView,
  getErrorCodeMsg,
  userLanguage,
  getYoutubeId,
  checkIfDateIsNotToday,
  themPrimaryColor,
  themSecondryColor,
  FcmToken,
  getIPAdreessData,
};
