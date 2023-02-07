"use strict";

import NetInfo from "@react-native-community/netinfo";
import { create } from "apisauce";
import GLOBALS from "@constants";
import { accessToken } from "@helpers/common";
import Strings from "../constants/Strings";
const { BASE_URL_VIDEO,NETWORK_STATUS } = GLOBALS;
const { SUCCESS, SESSION_ERROR } = NETWORK_STATUS

const api = create({
  baseURL: BASE_URL_VIDEO, //TEST_API_URL
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Cache-Control": "no-cache",
    Authorization: accessToken(),
  },
  timeout: 10 * 1000 /* 1 second = 1000 ms */,
});

class RestClient {
  static isConnected() {
    return new Promise(function(fulfill, reject) {
      NetInfo.isConnected.fetch().then((isConnected) => {
        if (isConnected) fulfill(isConnected);
        else {
          reject(isConnected);
        }
      });
    });
  }

  static getCall(url, token) {
    api.setHeader("Authorization", url == "login" ? "" : accessToken());
    let context = this;
    return new Promise(function(fulfill, reject) {
      context
        .isConnected()
        .then(() => {
          api.get(BASE_URL_VIDEO + url).then((response) => {

            if (response.status === SUCCESS) {
              fulfill(response.data);
            }
            reject(response);
          });
        })
        .catch((error) => {
          fulfill({
            message: Strings.server_is_not_reachable,
          });
        });
    });
  }

  static postCallVideo(url, params, token) {
    api.setHeader("Authorization", accessToken());
    let context = this;
    return new Promise(function(fulfill, reject) {
      context
        .isConnected()
        .then(() => {
          api.post(BASE_URL_VIDEO + url, params).then((response) => {
            if (response.status === SUCCESS) {
              fulfill(response.data);
            }
            reject(response);
          });
        })
        .catch((error) => {
          fulfill({
            message: Strings.server_is_not_reachable,
          });
        });
    });
  }

  static postCall(url, params, token) {
    api.setHeader("Authorization", accessToken());
    let context = this;
    return new Promise(function(fulfill, reject) {
      context
        .isConnected()
        .then(() => {
          api.post(BASE_URL_VIDEO + url, params).then((response) => {
            if (response.status === SUCCESS) {
              fulfill(response.data);
            }
            reject(response);
          });
        })
        .catch((error) => {
          fulfill({
            message: Strings.server_is_not_reachable,
          });
        });
    });
  }

  static putCall(url, params) {
    let context = this;
    return new Promise(function(fulfill, reject) {
      context
        .isConnected()
        .then(() => {
          api.put(`https://reqres.in/api` + url, params).then((response) => {
            if (response.status === SUCCESS) {
              fulfill(response.data);
            }
            reject(response);
          });
        })
        .catch((error) => {
          fulfill({
            message: Strings.server_is_not_reachable,
          });
        });
    });
  }

  static patchCall(url, params) {
    let context = this;
    return new Promise(function(fulfill, reject) {
      context
        .isConnected()
        .then(() => {
          api.put(`https://reqres.in/api` + url, params).then((response) => {
            if (response.status === SUCCESS) {
              fulfill(response.data);
            }
            reject(response);
          });
        })
        .catch((error) => {
          fulfill({
            message: Strings.server_is_not_reachable,
          });
        });
    });
  }
}

export default RestClient;
