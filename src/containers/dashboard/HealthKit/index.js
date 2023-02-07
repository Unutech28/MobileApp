/* eslint-disable prettier/prettier */
// @ts-nocheck
import * as AppActions from '@actions';
import {navigatorPop, navigatorPush} from '@config/navigationOptions';
import GLOBALS from '@constants';
import React, {Component, lazy} from 'react';
import {RFValue} from 'react-native-responsive-fontsize';
import {
  StyleSheet,
  View,
  Text,
  Platform,
  Linking,
  Dimensions,
} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import AppleHealthKit, {
  HealthValue,
  HealthKitPermissions,
} from 'react-native-health';
import moment from 'moment';
import Styles from './styles';
import GoogleFit, {Scopes} from 'react-native-google-fit';
import {alertWithTwoBtnCancel, alertWithOneBtn} from '@helpers/common';
import {strings} from '@localization';
import {LineChart} from 'react-native-chart-kit';

// const { COLOR, STRINGS } = GLOBALS;
const {COLOR, MOODS_ARRAY, FONTS, PRODUCT_TYPE} = GLOBALS;
const {PRIMARY, DARK_GREEN, PRIMARY1, BUTTON_ORANGE} = COLOR;
const {REGULAR, BOLD, MEDIUM} = FONTS;
const Header = lazy(() => import('@components/common/Header'));
// const sleepChartConfig = {
//   backgroundColor: DARK_GREEN,
//   backgroundGradientFrom: PRIMARY1,
//   backgroundGradientTo: DARK_GREEN,
//   decimalPlaces: 1, // optional, defaults to 2dp
//   color: (opacity = 1) => `rgba(255, 255, 255, 0.6)`,
//   labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
//   style: {
//     borderRadius: 16,
//   },
//   propsForDots: {
//     r: '6',
//     strokeWidth: '2',
//     stroke: PRIMARY1,
//   },
//   fillShadowGradientOpacity: 0.5,
//   // propsForBackgroundLines: {
//   //   strokeDasharray: "", // solid background lines with no dashes
//   // },
// };

const PERMS = AppleHealthKit.Constants.Permissions;
let options = {
  permissions: {
    read: [PERMS.BodyTemperature],
    //read: [AppleHealthKit.Constants.Permissions.HeartRate],
    write: [],
  },
};

class HealthKit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bodyTempApple: '',
      bodyTempData: [0, 0, 0, 0, 0],
      dateArray: [],
    };
    if (Platform.OS === 'android') {
      // Linking.canOpenURL("com.google.android.apps.fitness&navigate=yes").then((canOpen) => {
      //   if (canOpen) {
      //     console.log('open google fit');
      //   } else {
      //     console.log('not open google fit ');
      //   }
      // });
      if (Platform.OS === 'android') {
        GoogleFit.checkIsAuthorized().then(() => {
          if (!GoogleFit.isAuthorized) {
            const options = {
              scopes: [
                Scopes.FITNESS_ACTIVITY_READ,
                Scopes.FITNESS_BODY_READ,
                Scopes.FITNESS_ACTIVITY_WRITE,
                Scopes.FITNESS_HEART_RATE_READ,
                Scopes.FITNESS_HEART_RATE_WRITE,
                Scopes.FITNESS_BLOOD_PRESSURE_READ,
                Scopes.FITNESS_BLOOD_PRESSURE_WRITE,
                Scopes.FITNESS_BLOOD_GLUCOSE_READ,
                Scopes.FITNESS_BLOOD_GLUCOSE_WRITE,
                Scopes.FITNESS_BODY_TEMPERATURE_READ,
              ],
            };


            GoogleFit.authorize(options)
              .then(authResult => {
                if (authResult.success) {
                  console.log('Success');
                  this.getBodyTemperature();
                  // dispatch("AUTH_SUCCESS");
                } else {
                  alertWithTwoBtnCancel(
                    'Google Fit not found',
                    '',
                    strings.profile.yes,
                    strings.profile.no,
                  ).then(res => {
                    if (!res) {
                      Linking.openURL(
                        'https://play.google.com/store/apps/details?id=com.google.android.apps.fitness&hl=en_IN&gl=US',
                      );
                    }
                  });
                  // alert("Google fit app not found")
                  console.log('fails==>', authResult);
                  // dispatch("AUTH_DENIED", authResult.message);
                }
              })
              .catch(() => {
                dispatch('AUTH_ERROR');
              });
          } else {
            console.log('Already authorized');
            this.getBodyTemperature();
          }
        });
      }
    } else if (Platform.OS === 'ios') {
      this.callAppleHealthKit();
    }
  }

  callAppleHealthKit() {
    AppleHealthKit.initHealthKit(options, error => {
      if (error) {
        console.log('[ERROR] Cannot grant permissions!', error);
      }

      let today = new Date();
      let selectedDate = moment(today).format('YYYY-MM-DD');
      let year = moment(selectedDate).format('YYYY');
      let month = moment(selectedDate).format('MM');
      let day = moment(selectedDate).format('DD');
      let startDate = new Date(year, month - 1, day - 6);
      let d = new Date(year, month - 1, day);
      // let d = new Date(2022, 5, 10);

      let TempArray;
      let dateArray;
      let options = {
        unit: 'fahrenheit', // optional; default 'celsius'
        startDate: startDate.toISOString(), // required
        // endDate: d.toISOString(), // optional; default now
        ascending: false, // optional; default false
        limit: 10, // optional; default no limit
      };

      AppleHealthKit.getBodyTemperatureSamples(options, (err, results) => {
        if (err) {
          return;
        }
        if (results !== undefined && results !== [] && results.length > 0) {
          let bodyTemp = results[0].value;

          TempArray = results?.map(item => {
            return item.value;
          });
          dateArray = results?.map(item => {
            return moment(item.endDate).format('MM/DD');
          });
          this.setState({
            bodyTempApple: bodyTemp,
            bodyTempData: TempArray,
            dateArray: dateArray,
          });
        }
      });
    });
  }

  //for android with googleFIt
  async getBodyTemperature() {
    let TempArray;
    let dateArray;
    let date = new Date();
    let lastDate = date.getDate() - 1;
    const opt = {
      startDate: '2022-06-01T00:00:17.971Z',
      // startDate: lastDate.toISOString(), // required ISO8601Timestamp
      endDate: new Date().toISOString(), // required ISO8601Timestamp
      bucketUnit: 'NANOSECOND', // optional - default "DAY". Valid values: "NANOSECOND" | "MICROSECOND" | "MILLISECOND" | "SECOND" | "MINUTE" | "HOUR" | "DAY"
      bucketInterval: 1, // optional - default 1.
    };
    const result = await GoogleFit.getBodyTemperatureSamples(opt);
    if (result.length > 0) {
      TempArray = result?.map(item => {
        return (item.value.toFixed(2) * 9) / 5 + 32;
      });
      dateArray = result?.map(item => {
        return moment(item.endDate).format('MM/DD');
      });
      this.setState({
        bodyTempApple: result[result.length - 1]?.value,
        bodyTempData: TempArray,
        dateArray: dateArray,
      });
    }
  }

  timeFrom = X => {
    var dates = [];
    for (let I = 0; I < 7; I++) {
      dates.push(
        moment(Date.now() - (X >= 0 ? I : I--) * 24 * 3600 * 1000).format(
          'MM/DD',
        ),
      );
    }
    return dates;
  };

  Graph = () => {
    return (
      <LineChart
        data={{
          labels:
            this.state.dateArray.length > 0
              ? this.state.dateArray.reverse()
              : this.timeFrom(7).reverse(),
          datasets: [
            {
              data: this.state.bodyTempData.reverse(),
            },
          ],
        }}
        width={Dimensions.get('window').width / 1.1} // from react-native
        height={Dimensions.get('window').height / 3.5}
        chartConfig={{
          backgroundColor: DARK_GREEN,
          backgroundGradientFrom: PRIMARY1,
          backgroundGradientTo: DARK_GREEN,
          decimalPlaces: 1, // optional, defaults to 2dp
          color: (opacity = 1) => `rgba(255, 255, 255, 0.6)`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: PRIMARY1,
          },
          fillShadowGradientOpacity: 0.5,
        }}
        bezier
        style={{
          marginTop: 8,
        }}
      />
    );
  };

  render() {
    let {componentId, loginData} = this.props;

    return (
      <View style={Styles.homeContainer}>
        <Header
          isLeftIcon={true}
          isRightIcon={false}
          onLeftIconClick={() => {
            navigatorPop({componentId});
          }}
          isLogout={false}
          isTitle={true}
          title={'Temperature History'}
          titleStyle={{
            fontSize: RFValue(22),
            paddingTop: RFValue(10),
          }}
        />
        <View style={{padding: 10, margin: 20}}>
          {Platform.OS == 'ios' ? (
            <View style={{alignItems: 'center', alignSelf: 'center'}}>
              <Text style={Styles.title}>
                Your Body Temperature from Apple health :{' '}
              </Text>
              {this.state.bodyTempApple !== '' ? (
                <View>{this.Graph()}</View>
              ) : (
                // <Text style={{ marginTop: 10, fontWeight: '400' }}> {this.state.bodyTempApple} fahrenheit</Text>
                <Text style={Styles.no_result}>
                  You have not added your body temperture in health app!
                </Text>
              )}
            </View>
          ) : (
            <View style={{alignItems: 'center', alignSelf: 'center'}}>
              <Text style={{fontWeight: 'bold'}}>
                Your Body Temperature from Google fit :{' '}
              </Text>
              {this.state.bodyTempApple !== '' ? (
                this.Graph()
              ) : (
                // <Text style={{ marginTop: 10, fontWeight: '400' }}> {this.state.bodyTempApple} celsius</Text>
                <Text style={Styles.no_result}>
                  You have not added your body temperture in health app!
                </Text>
              )}
            </View>
          )}
        </View>
      </View>
    );
  }
}
const mapStateToProps = ({authReducer}) => ({
  // loginData: authReducer.loginData,
});
const mapDispatchToProps = dispatch => ({
  AppActions: bindActionCreators(AppActions, dispatch),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HealthKit);
