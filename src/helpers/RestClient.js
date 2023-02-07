'use strict';

import NetInfo from '@react-native-community/netinfo';
import { create } from 'apisauce';
import GLOBALS from '@constants';
import { accessToken } from '@helpers/common';
const { BASE_URL, BASE_URL_VIDEO, NETWORK_STATUS } = GLOBALS;
import { encryptRequest, decryptRequest } from '@helpers/common';
import STRING from '../constants/Strings';
const { SUCCESS, SESSION_ERROR } = NETWORK_STATUS;

const api = create({
  baseURL: BASE_URL, //TEST_API_URL
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    // Authorization: accessToken(),
    Authorization: 'Basic Y3VyaW9UcmVhdDokJSNjdXJpb0Jhc2ljQXV0aFBhc3MjJA==', //hippa changes
    accesstoken: accessToken(), //hippa changes

  },
  timeout: 10 * 1000 /* 1 second = 1000 ms */,
});

class RestClient {
  static isConnected() {
    return new Promise(function (fulfill, reject) {
      NetInfo.fetch().then(state => {
        fulfill(true);
        if (state.isConnected) fulfill(state.isConnected);
        else {
          reject(state.isConnected);
        }
      });
      // NetInfo.isConnected.fetch().then((isConnected) => {
      //   if (isConnected) fulfill(isConnected);
      //   else {
      //     reject(isConnected);
      //   }
      // });
    });
  }

  static getCall(url, token) {
    api.setHeader('accesstoken', url == 'login' ? '' : accessToken());
    let context = this;
    return new Promise(function (fulfill, reject) {
      context
        .isConnected()
        .then(() => {

          api.get(BASE_URL + url).then((response) => {
            console.log(
              'API call for get call ' + BASE_URL + url, response
            );
            if (response.status === SUCCESS) {
              fulfill(decryptRequest(response.data));
            }
            reject(response);
          });
        })
        .catch(error => {
          fulfill({
            message: STRING.server_is_not_reachable,
          });
        });
    });
  }

  static postCallVideo(url, params, token) {
    api.setHeader('accesstoken', accessToken());
    let context = this;
    return new Promise(function (fulfill, reject) {
      context
        .isConnected()
        .then(() => {
          api.post(BASE_URL_VIDEO + url, params).then(response => {
            console.log(BASE_URL_VIDEO + url, JSON.stringify(params), "API.....")
            if (response.status === 200) {
              fulfill(response.data);
            }
            reject(response);
          });
        })
        .catch(error => {
          fulfill({
            message: STRING.server_is_not_reachable,
          });
        });
    });
  }

  static postCallFormData(url, params, token) {
    api.setHeader('accesstoken', accessToken());
    let context = this;
    try {
      return new Promise(function (fulfill, reject) {
        context
          .isConnected()
          .then(() => {
            api.post(BASE_URL + url, params).then(response => {
              console.log(BASE_URL + url, params, "BASE_URL + url, params", response)
              if (response.status === SUCCESS) {
                fulfill(decryptRequest(response.data));
              }
              reject(response);
            });
          })
          .catch(error => {
            fulfill({
              message: STRING.server_is_not_reachable,
            });
          });
      });
    } catch (err) {
      console.log("error", err);
    }
  }

  static postCall(url, params, token) {
    api.setHeader('accesstoken', accessToken());
    let context = this;
    return new Promise(function (fulfill, reject) {
      context
        .isConnected()
        .then(() => {
          api.post(BASE_URL + url, encryptRequest(params)).then(response => {

            console.log(
              'API call for ' + BASE_URL + url,
              encryptRequest(params),
              JSON.stringify(params),
            );
            console.log(response, "res from API")
            if (response.status === 200) {
              console.log('response from API', decryptRequest(response.data));
              fulfill(decryptRequest(response.data));
            }
            reject(response);
          });
        })
        .catch(error => {
          fulfill({
            message: STRING.server_is_not_reachable,
          });
        });
    });
  }

  static putCall(url, params) {
    let context = this;
    return new Promise(function (fulfill, reject) {
      context
        .isConnected()
        .then(() => {
          api.put(`https://reqres.in/api` + url, params).then(response => {
            if (response.status === SUCCESS) {
              fulfill(response.data);
            }
            reject(response);
          });
        })
        .catch(error => {
          fulfill({
            message: STRING.server_is_not_reachable,
          });
        });
    });
  }

  static patchCall(url, params) {
    let context = this;
    return new Promise(function (fulfill, reject) {
      context
        .isConnected()
        .then(() => {
          api.put(`https://reqres.in/api` + url, params).then(response => {
            if (response.status === SUCCESS) {
              fulfill(response.data);
            }
            reject(response);
          });
        })
        .catch(error => {
          fulfill({
            message: STRING.server_is_not_reachable,
          });
        });
    });
  }
}

export default RestClient;
