import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification from "react-native-push-notification";
import messaging from "@react-native-firebase/messaging";
import { Alert, Linking, Platform } from "react-native";
import { storeObj } from "../store/setup";
import { alertWithTwoBtn, alertWithOneBtn } from "@helpers/common";
import Constants from "@constants";
import GLOBALS from "@constants";
import { setFcmDeviceToken } from "@actions/user";
// import { setFcmDeviceToken } from '../actions/user/index';

// Handel pushnotifications

const {
  STRINGS: { CHECK_NETWORK },
} = GLOBALS;

export default (PushNotificationInit = () => {
  PushNotification.configure({
    // (optional) Called when Token is generated (iOS and Android)
    onRegister: function(token) {
      console.log("TOKEN:", token);
    },
    onNotification: function(notification) {
      console.log("NOTIFICATION:", notification);
      notification.finish(PushNotificationIOS.FetchResult.NoData);
    },
    onRegistrationError: function(notification) {
      console.log("onRegistrationError:", notification);
      notification.finish(PushNotificationIOS.FetchResult.NoData);
    },

    // IOS ONLY (optional): default: all - Permissions to register.
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },
    popInitialNotification: true,
    requestPermissions: true,
  });
});

export const BackgroundNotificationManager = (response) => {
  Platform.OS == "ios" && PushNotification.setApplicationIconBadgeNumber(0);
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    if (response) response(true);
  });

  messaging().onMessage(async (remoteMessage) => {
    console.log(
      "***********NEW_MESSAGE************",
      JSON.stringify(remoteMessage)
    );
    if (response) response(true);
    alertWithOneBtn(
      remoteMessage.notification.title,
      remoteMessage.notification.body,
      ""
    ).then((res) => {});
  });

  messaging().onNotificationOpenedApp((remoteMessage) => {
    console.log(
      "***********NOTIFICATION_OPENED_APP_FROM_BACKGROUND_STATE**********",
      remoteMessage.notification
    );
  });
};

export const GetBadgeNumber = async (response) => {
  PushNotification.getApplicationIconBadgeNumber((notificationBadge) => {
    console.log("NOTIFICATION_BADGE", response(notificationBadges));
  });
};

export const checkPushPermission = () => {
  return new Promise((resolve, reject) => {
    messaging()
      .requestPermission()
      .then((authStatus) => {
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        let { dispatch, getState } = storeObj.store;
        if (enabled) {
          console.log(
            getState().authReducer.fcmDeviceToken,
            "token fetching.."
          );
          if (getState().authReducer.fcmDeviceToken == null) {
            // InitiateNotification();
            setTimeout(() => {
              resolve(true);
            }, 1000);
          } else {
            resolve(true);
          }
        } else {
          alertWithTwoBtn(
            Constants.Strings.permission_text.permission_decline,
            Constants.Strings.permission_text.allow_text,
            Constants.Strings.permission_text.not_allow,
            Constants.Strings.permission_text.allow
          ).then((res) => {
            if (res) {
              Linking.openURL("app-settings:");
            }
          });
          resolve(false);
        }
      });
  });
};

export const InitiateNotification = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    // messaging()
    //   .getToken()
    //   .then((token) => {
    //     let { dispatch, getState } = storeObj.store;
    //     console.log("***********NOTI_AUTH_STATUS************", token);
    //     // storeItem("DEVICE_TOKEN",token)
    //     // Alert.alert("token",token)
    //     dispatch(setFcmDeviceToken(token));
    //   });
    // messaging().onTokenRefresh((token) => {
    //   console.log("messaging.onTokenRefresh", token);
    // });
  } else {
    // alertWithTwoBtn(Constants.Strings.permission_text.permission_decline, Constants.Strings.permission_text.allow_text, Constants.Strings.permission_text.not_allow, Constants.Strings.permission_text.allow).then(res => {
    //   if (res) {
    //     Linking.openURL('app-settings:')
    //   }
    // })
  }
  messaging()
    .getInitialNotification()
    .then((remoteMessage) => {
      console.log(
        "***********NOTIFICATION_OPENED_APP_FROM_QUIT_STATE************",
        remoteMessage
      );
    });

  messaging().onMessage((notification) => {
    console.log("onMessage notification", JSON.stringify(notification));
    console.log("notification?.sentTime", notification?.data.messageId);
    let notifBodyTitle = notification.notification;
    let data = notification.data;
    // setTimeout(() => {
    // if (this.lastMessageId != notification?.sentTime) {
    // this.lastMessageId = notification?.sentTime
    // this.showAlert(data, notifBodyTitle);
    alertWithOneBtn(
      notification.notification.title,
      notification.notification.body,
      ""
    ).then((res) => {});
    // }
    // }, 500)
  });

  PushNotification.createChannel(
    {
      channelId: "451561405074", // (required)
      channelName: "defaultChannel", // (required)
      channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
      soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
      importance: 4, // (optional) default: 4. Int value of the Android notification importance
      vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
      playSound: true,
    },
    (created) => console.log("***********CHANNEL_CREATED************", created) // (optional) callback returns whether the channel was created, false means it already existed.
  );
};
