import {
  check,
  PERMISSIONS,
  RESULTS,
  openSettings,
  request,
} from "react-native-permissions";
import { Platform, Alert } from "react-native";

export function checkCamera(callBack) {
  check(
    Platform.OS == "android"
      ? PERMISSIONS.ANDROID.CAMERA
      : PERMISSIONS.IOS.CAMERA
  ).then((result) => {
    switch (result) {
      case RESULTS.DENIED:
        request(
          Platform.OS == "android"
            ? PERMISSIONS.ANDROID.CAMERA
            : PERMISSIONS.IOS.CAMERA
        ).then((result) => {
          if (result == "granted") {
            callBack(true);
          }
        });
        break;
      case RESULTS.GRANTED:
        callBack(true);
        break;
      case RESULTS.BLOCKED:
        showPermissionsBlocked("camera");
        break;
    }
  });
}

export function checkGallery(callBack) {
  check(
    Platform.OS == "android"
      ? PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE
      : PERMISSIONS.IOS.PHOTO_LIBRARY
  )
    .then((result) => {
      switch (result) {
        case RESULTS.DENIED:
          request(
            Platform.OS == "android"
              ? PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE
              : PERMISSIONS.IOS.PHOTO_LIBRARY
          ).then((result) => {
            if (result == "granted") {
              callBack(true);
            }
            else if (result == "limited") {
              callBack(true);
            }
            // else {
            //   showPermissionsBlocked("storage or gallery");
            // }
          });
          break;
        case RESULTS.GRANTED:
          callBack(true);
          break;
        case RESULTS.LIMITED:
          callBack(true);
          break;
        case RESULTS.BLOCKED:
          showPermissionsBlocked("storage or gallery");
          break;
        default:
          showPermissionsBlocked("storage or gallery");
      }
    })
    .catch((err) => {
      console.log("err", err);
    });
}

export function showPermissionsBlocked(type) {
  Alert.alert(
    "Permission Blocked",
    "Please grant " + type + " permission from app settings",
    [
      { text: "Cancel", onPress: () => console.log("OK Pressed") },
      {
        text: "Settings",
        onPress: () => {
          openSettings().catch(() => console.warn("cannot open settings"));
        },
      },
    ],
    { cancelable: false }
  );
}
