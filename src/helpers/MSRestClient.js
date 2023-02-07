"use strict";

import NetInfo from "@react-native-community/netinfo";
import { create } from "apisauce";
import GLOBALS from "@constants";
import {
  accessToken,
  userLanguage,
  FcmToken,
  getIPAdreessData,
} from "@helpers/common";
const { BASE_URL, BASE_URL_VIDEO, NETWORK_STATUS } = GLOBALS;
import { encryptRequest, decryptRequest } from "@helpers/common";
import STRING from "../constants/Strings";
const { SUCCESS, SESSION_ERROR } = NETWORK_STATUS;
import DeviceInfo from "react-native-device-info";

import axios from "axios";

/**
 * Basic Auth Details
 * basic auth username = CurioMaster
   basic auth password = @in)*^he_(al%$me)52!~G
 */

var instance = axios.create({
  baseURL: BASE_URL,
  timeout: 10 * 1000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Cache-Control": "no-cache",
    Authorization: "Basic Q3VyaW9NYXN0ZXI6QGluKSpeaGVfKGFsJSRtZSk1MiF+Rw==", //Basic Auth changes CurioMaster
    ip: "",
    deviceToken: FcmToken(),
    timeZone: "",
    devicedetails: JSON.stringify({
      deviceType: DeviceInfo.getSystemName() ? DeviceInfo.getSystemName() : "",
      deviceName: DeviceInfo.getBrand() ? DeviceInfo.getBrand() : "",
      systemVersion: DeviceInfo.getModel() ? DeviceInfo.getModel() : "",
      ...getIPAdreessData(),
      // ip: ipAdreess,
    }),
    // 'accesstoken': accessToken(),
    lang: userLanguage(),
  },
});

const api = create({
  baseURL: BASE_URL, //TEST_API_URL
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Cache-Control": "no-cache",
    Authorization: "Basic Q3VyaW9NYXN0ZXI6QGluKSpeaGVfKGFsJSRtZSk1MiF+Rw==", //Basic Auth changes CurioMaster
    ip: "",
    deviceToken: "",
    timeZone: "",
    deviceDetails: "",
  },
  timeout: 10 * 1000 /* 1 second = 1000 ms */,
});

const setAuthToken = (token) => {
  if (token) {
    // Apply to every request
    instance.defaults.headers.common["accesstoken"] = token;
  } else {
    // Delete auth header
    delete instance.defaults.headers.common["accesstoken"];
  }
};

class MSRestClient {
  static isConnected() {
    return new Promise(function (fulfill, reject) {
      NetInfo.fetch().then((state) => {
        fulfill(true);
        if (state.isConnected) fulfill(state.isConnected);
        else {
          reject(state.isConnected);
        }
      });
    });
  }

  static getCall(url, token) {
    setAuthToken(url == "login" ? "" : accessToken());
    let context = this;

    return new Promise(function (fulfill, reject) {
      console.log("API call for  axios " + url);
      context
        .isConnected()
        .then(() => {
          instance
            .get(url)
            .then(function (response) {
              console.log("API call for  axios " + url, response);
              if (response.data.status === 200) {
                console.log(response, "Get Call", url);
                fulfill(response.data);
              }
            })
            .catch((error) => {
              console.log(error, "get error");
              reject({
                err: { errCode: error.response.data.err.msg },
                errCode: error.response.data.status,
              });
            });
        })
        .catch(function (error) {
          console.log("error from API>>>>>>>>>>>", error);
          reject({
            err: STRING.server_is_not_reachable,
            errCode: 404,
          });
        });
    });
  }

  static async postCall(url, params, token) {
    let context = this;
    setAuthToken(url == "login" ? "" : accessToken());
    return new Promise(function (fulfill, reject) {
      context
        .isConnected()
        .then(() => {
          console.log("API call for  axios " + url, JSON.stringify(params));
          instance
            .post(url, params)
            .then(function (response) {
              console.log(response, "res from API");
              if (response.data && response.data.status === 200) {
                fulfill(response);
              }
              reject(response.data);
            })
            .catch((error) => {
              console.log("Error===>", error);
              reject(error.response.data);
            });
        })
        .catch(function (error) {
          console.log("error from API>>>>>>>>>>>", error);
          reject({
            err: STRING.server_is_not_reachable,
            errCode: 404,
          });
        });
    });
  }

  static deleteCall(url) {
    setAuthToken(accessToken());
    // instance.setHeader('accesstoken', accessToken());
    let context = this;
    return new Promise(function (fulfill, reject) {
      context
        .isConnected()
        .then(() => {
          instance
            .delete(url)
            .then(function (response) {
              console.log("API call for delete" + url, response);
              if (response.data.status === 200) {
                console.log("response from API>>>>>>>>>>>", response.data.res);
                fulfill(response);
              }
              // reject(response.data);
            })
            .catch((error) => {
              reject({
                err: { errCode: error.response.data.err.msg },
                errCode: error.response.data.status,
              });
            });
        })
        .catch(function (error) {
          console.log("error from API>>>>>>>>>>>", error);
          reject({
            err: STRING.server_is_not_reachable,
            errCode: 404,
          });
        });
    });
  }

  static putCall(url, params) {
    setAuthToken(accessToken());
    // instance.setHeader('accessToken', accessToken());
    let context = this;
    return new Promise(function (fulfill, reject) {
      context
        .isConnected()
        .then(() => {
          console.log(
            "Put API call for Axios  " + url,
            JSON.stringify(params),
            accessToken()
          );
          instance
            .put(url, params)
            .then(function (response) {
              if (response.data && response.data.status === 200) {
                fulfill(response.data);
              }
              reject(response.data);
            })
            .catch((error) => {
              reject(error.response.data);
            });
        })
        .catch(function (error) {
          console.log("error from API>>>>>>>>>>>", error);
          reject({
            err: STRING.server_is_not_reachable,
            errCode: 404,
          });
        });
    });
  }

  static putCallFormData(url, params) {
    return new Promise(function (fulfill, reject) {
      axios({
        url: url,
        method: "PUT",
        data: params,
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
          Authorization:
            "Basic Q3VyaW9NYXN0ZXI6QGluKSpeaGVfKGFsJSRtZSk1MiF+Rw==",
          accesstoken: accessToken(),
          deviceDetails: {
            deviceType: DeviceInfo.getSystemName(),
            deviceName: DeviceInfo.getBrand(),
            systemVersion: DeviceInfo.getModel(),
          },
          deviceToken: FcmToken,
        },
      })
        .then(function (response) {
          if (response.data && response.data.status === 200) {
            fulfill(response.data);
          }
          reject(response.data);
        })
        .catch(function (error) {
          console.log("error from API>>>>>>>>>>>", error);
          reject({
            err: STRING.server_is_not_reachable,
            errCode: 404,
          });
        });
    });
  }
  static getCallOld(url, token) {
    api.setHeader("accesstoken", url == "login" ? "" : accessToken());
    api.setHeader("lang", userLanguage());
    let context = this;
    return new Promise(function (fulfill, reject) {
      context
        .isConnected()
        .then(() => {
          api.get(url).then((response) => {
            console.log("API call for get call" + url, response);
            if (response.data.status === 200) {
              console.log("response from API>>>>>>>>>>>", response.data.res);
              fulfill(response.data);
            }
            reject(response.data);
          });
        })
        .catch((error) => {
          reject({
            err: STRING.server_is_not_reachable,
            errCode: 404,
          });
        });
    });
  }

  static postCallOld(url, params, token) {
    let context = this;
    return new Promise(function (fulfill, reject) {
      context
        .isConnected()
        .then(() => {
          api.post(url, params).then((response) => {
            console.log("API call for " + url, JSON.stringify(params));
            console.log(response, "res from API");
            if (response.data && response.data.status === 200) {
              console.log("response from API>>>>>>>>>>>", response.data.res);
              fulfill(response);
            }
            reject(response.data);
          });
        })
        .catch((error) => {
          reject({
            err: STRING.server_is_not_reachable,
            errCode: 404,
          });
        });
    });
  }

  static deleteCallOld(url) {
    api.setHeader("accesstoken", accessToken());
    let context = this;
    return new Promise(function (fulfill, reject) {
      context
        .isConnected()
        .then(() => {
          api.delete(url).then((response) => {
            console.log("API call for delete" + url, response);
            if (response.data.status === 200) {
              console.log("response from API>>>>>>>>>>>", response.data.res);
              fulfill(response);
            }
            reject(response.data);
          });
        })
        .catch((error) => {
          reject({
            err: STRING.server_is_not_reachable,
            errCode: 404,
          });
        });
    });
  }

  static putCallOld(url, params) {
    api.setHeader("accessToken", accessToken());
    let context = this;
    return new Promise(function (fulfill, reject) {
      context
        .isConnected()
        .then(() => {
          api.put(url, params).then((response) => {
            console.log(
              "API call for " + url,
              JSON.stringify(params),
              response
            );
            if (response.data && response.data.status === 200) {
              fulfill(response.data);
            }
            reject(response.data);
          });
        })
        .catch((error) => {
          console.log("error from API>>>>>>>>>>>", error);
          reject({
            err: STRING.server_is_not_reachable,
            errCode: 404,
          });
        });
    });
  }
}

export default MSRestClient;
