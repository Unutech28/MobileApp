import { Alert, Text } from "react-native";
import { openSettings } from "react-native-permissions";
import React, { useRef, useState } from "react";
import { checkCamera, checkGallery } from "./PermissionsHandler";
import ImagePicker from "react-native-image-crop-picker";


// funtions for set permissions or check permissions 

export function showPermissionsBlocked() {
  Alert.alert(
    "Permissions Blocked",
    "Please grant permissions from app settings",
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

export function openImagePicker(callback) {
  // Open Image Library:
  checkGallery((isGranted) => {
    if (isGranted) {
      setTimeout(() => {
        ImagePicker.openPicker({
          width: 300,
          height: 300,
          mediaType: "photo",
          cropping: true,
          includeBase64: true,
        }).then((response) => {
          console.log("Image res===>", response);
          let source = { uri: response.path, response };
          let arr = response.path.split("/");
          let fileName = arr[arr.length - 1];
          callback(source, fileName);
        }, err => {
        });
      }, 500);
    } else {
      showPermissionsBlocked("storage or gallery");
    }
  });
}

export function openCamera(callback) {
  // Launch Camera:
  checkCamera((isGranted) => {
    if (isGranted) {
      setTimeout(() => {
        ImagePicker.openCamera({
          width: 300,
          height: 300,
          mediaType: "photo",
          cropping: true,
          includeBase64: true,
        }).then((response) => {
          let source = { uri: response.path, response };
          let arr = response.path.split("/");
          let fileName = arr[arr.length - 1];
          callback(source, fileName);
        });
      }, 500);
    }
  });
}
