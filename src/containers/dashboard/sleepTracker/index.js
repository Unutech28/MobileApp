// @ts-nocheck
import * as AppActions from "@actions";
import AppointmentList from "@components/dashboard/symptoms/appointmentList";
import ScheduleTab from "@components/dashboard/symptoms/tabs";
import { navigatorPop, navigatorPush } from "@config/navigationOptions";
import GLOBALS from "@constants";
import moment from "moment";
import React, { Component, lazy } from "react";
import {
  StyleSheet,
  View,
  PermissionsAndroid,
  Text,
  TextInput,
  Platform,
  Alert,
  AppState,
  Platform,
  BackHandler,
} from "react-native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
const { COLOR, FONTS, STRINGS } = GLOBALS;
const SymptomsComponent = lazy(() =>
  import("@components/dashboard/dailyTracker")
);
import * as ICONS from "@images";
import Styles from "./styles";
const { LIGHT, REGULAR } = FONTS;
import { toast } from "@helpers/common";
import Button from "@components/common/button";
//import AppleHealthKit from "rn-apple-healthkit";
import GoogleFit, { Scopes } from "react-native-google-fit";
import CalendarStrip from "react-native-calendar-strip";
import CircularSlider from "react-native-circular-slider";
import TimerText from "./TimerText";
import Svg, { G, Path } from "react-native-svg";
import momentZone from "moment-timezone";
let currentTimeZone = momentZone.tz.guess();

const WAKE_ICON = (
  <G>
    <Path
      d="M2,12.9h1.7h3h2.7h3H14c0.4,0,0.7-0.3,0.7-0.7c0-0.4-0.3-0.7-0.7-0.7c-0.9,0-1.7-0.7-1.7-1.7v-4
      c0-2.1-1.5-3.8-3.4-4.2C9,1.6,9,1.4,9,1.3c0-0.5-0.4-1-1-1c-0.5,0-1,0.4-1,1c0,0.2,0,0.3,0.1,0.4c-2,0.4-3.4,2.1-3.4,4.2v4
      c0,0.9-0.7,1.7-1.7,1.7c-0.4,0-0.7,0.3-0.7,0.7C1.3,12.6,1.6,12.9,2,12.9z"
    />
    <Path d="M8,15.7c1.1,0,2.1-0.9,2.1-2.1H5.9C5.9,14.8,6.9,15.7,8,15.7z" />
  </G>
);

const BEDTIME_ICON = (
  <G>
    <Path
      d="M11.7,10.5c-3.6,0-6.4-2.9-6.4-6.4c0-0.7,0.1-1.4,0.4-2.1C3.1,2.9,1.2,5.3,1.2,8.1c0,3.6,2.9,6.4,6.4,6.4
      c2.8,0,5.2-1.8,6.1-4.4C13.1,10.4,12.4,10.5,11.7,10.5z"
    />
    <Path d="M8,7.6l2-2.5H8V4.4H11v0.6L9,7.6h2v0.7H8V7.6z" />
    <Path d="M11.7,5.4l1.5-1.9h-1.4V3h2.2v0.5l-1.5,1.9h1.5v0.5h-2.2V5.4z" />
    <Path d="M9.4,3l1.1-1.4h-1V1.3H11v0.4L9.9,3H11v0.4H9.4V3z" />
  </G>
);

// const PERMS =
//   Platform.OS == "ios" ? AppleHealthKit.Constants.Permissions : "android";
// let options = {
//   permissions: {
//     read: [
//       PERMS.Steps,
//       PERMS.SleepAnalysis,
//       PERMS.HeartRate,
//       PERMS.ActiveEnergyBurned,
//       PERMS.DistanceCycling,
//       PERMS.BloodPressureDiastolic,
//       PERMS.BloodPressureSystolic,
//     ],
//     write: [
//       PERMS.Steps,
//       PERMS.SleepAnalysis,
//       PERMS.HeartRate,
//       PERMS.ActiveEnergyBurned,
//       PERMS.DistanceCycling,
//       PERMS.BloodPressureDiastolic,
//       PERMS.BloodPressureSystolic,
//     ],
//   },
// };
let year;
let month;
let day;
let today = new Date();

const Header = lazy(() => import("@components/common/Header"));
let datesWhitelist = [
  {
    start: moment().subtract(1, "days"),
    end: moment().add(1, "days"), // total 4 days enabled
  },
];
let datesBlacklist = [moment().add(1, "days")]; // 1 day disabled

function calculateMinutesFromAngle(angle) {
  return Math.round(angle / ((2 * Math.PI) / (24 * 12))) * 5;
}

function calculateTimeFromAngle(angle) {
  const minutes = calculateMinutesFromAngle(angle);
  const h = Math.floor(minutes / 60);
  const m = minutes - h * 60;
  return { h, m };
}

function roundAngleToFives(angle) {
  const fiveMinuteAngle = (2 * Math.PI) / 144;

  return Math.round(angle / fiveMinuteAngle) * fiveMinuteAngle;
}

function padMinutes(min) {
  if (`${min}`.length < 2) {
    return `0${min}`;
  }
  return min;
}

class SleepTracker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: "Schedule",
      sleepHr: "0",
      sleepMin: "0",
      stepCount: 0,

      startAngle: (Math.PI * 8) / 4.58,
      angleLength: (Math.PI * 7) / 9.3,

      getStartAngle: (Math.PI * 8) / 4.58,
      getAngleLength: (Math.PI * 7) / 9.3,
      sleepId: "",
      isupdate: false,
      appState: AppState.currentState,
    };
    let subscriptionToAppState;
    // this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this._startTime();
    this.getSleepData();
    // if (Platform.OS === "android") {
    //   GoogleFit.checkIsAuthorized();
    //   this.googleFitInit();
    // }
  }

  componentDidMount() {
    // BackHandler.addEventListener(
    //   "hardwareBackPress",
    //   this.handleBackButtonClick
    // );
    if (Platform.OS == "ios")
      this.subscriptionToAppState = AppState.addEventListener(
        "change",
        this._handleAppStateChange
      );
  }

  // componentWillUnmount() {
  //   BackHandler.removeEventListener(
  //     "hardwareBackPress",
  //     this.handleBackButtonClick
  //   );
  // }

  // handleBackButtonClick() {
  //   alert("hii");
  //   this._goBack();
  //   return true;
  // }

  // componentWillUnmount() {
  //   if (Platform.OS == 'ios')

  //     // AppState.removeEventListener('change', this._handleAppStateChange);
  // }
  // componentWillUnmount() {
  //   console.log("sleep tracker");
  //   // // AppState.removeEventListener('change', this._handleAppStateChange);
  //   this.subscriptionToAppState.remove();
  // }

  _handleAppStateChange = (nextAppState) => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      this._startTime();
    } else {
      let { loginData, activeScreenStartTime } = this.props;
      let postData = {
        user_id: loginData["user"]["_id"],
        group: "Patient reported outcomes",
        screen: "sleep_tracker",
        startTime: activeScreenStartTime,
        endTime: moment().format(),
        date: moment().format(),
      };
      if (Platform.OS == "android") {
        this.props.AppActions.addTimeTraker(postData);
      } else if (
        Platform.OS == "ios" &&
        this.state.appState.match(/inactive|background/) !== null
      ) {
        this.props.AppActions.addTimeTraker(postData);
      }
    }
    this.setState({ appState: nextAppState });
  };

  _startTime() {
    this.props.AppActions.getScreenStartTime(moment().format());
  }

  getSleepData() {
    let { loginData } = this.props;

    let postData = {
      user_id: loginData["user"]["_id"],
      sleepdate: moment(today).subtract(1, "days").format(),
      patientDate: moment().format(STRINGS.DATE_FORMAT_PATIENT),
      timeZone: currentTimeZone,
    };
    this.props.AppActions.getSleepTraker(postData);
  }

  componentWillMount() {
    if (Platform.OS === "ios") {
      this.appleHealtKitInit(moment(today).format("YYYY-MM-DD"));
    }
  }

  // componentDidUpdate() {
  //   let { getSleepDataRes } = this.props;
  //   if (getSleepDataRes !== null && getSleepDataRes !== undefined) {
  //     this.setState({
  //       startAngle: getSleepDataRes.startAngle,
  //       angleLength: getSleepDataRes.angleLength
  //     })
  //   }
  // }

  googleFitInit() {
    const options = {
      scopes: [
        Scopes.FITNESS_ACTIVITY_READ_WRITE,
        Scopes.FITNESS_BODY_READ_WRITE,
      ],
    };
    GoogleFit.authorize(options)
      .then((authResult) => {
        if (authResult.success) {
          // dispatch("AUTH_SUCCESS");
        } else {
          // dispatch("AUTH_DENIED", authResult.message);
        }
      })
      .catch(() => {
        // dispatch("AUTH_ERROR");
      });
  }

  // componentDidUpdate(prevProps, prevState) {
  //   if (this.props.getSleepDataRes !== prevProps.getSleepDataRes) {
  //     if (this.props.getSleepDataRes !== null && this.props.getSleepDataRes !== undefined) {
  //       this.setState({
  //         startAngle: this.props.getSleepDataRes.startAngle,
  //         angleLength: this.props.getSleepDataRes.angleLength
  //       })
  //     }
  //   }
  // }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.getSleepDataRes !== prevState.responseData) {
      if (
        nextProps.getSleepDataRes !== null &&
        nextProps.getSleepDataRes !== undefined
      ) {
        return {
          getStartAngle: nextProps.getSleepDataRes.startAngle,
          getAngleLength: nextProps.getSleepDataRes.angleLength,
          isLoading: false,
        };
      }
    }
  }
  appleHealtKitInit(selectedDate) {
    // // let selectedDate = moment(today).add(this.state.dayCount, 'day').format('YYYY-MM-DD');
    // year = moment(selectedDate).format("YYYY");
    // month = moment(selectedDate).format("MM");
    // day = moment(selectedDate).format("DD");
    // AppleHealthKit.initHealthKit(options, (err, results) => {
    //   if (err) {
    //     return;
    //   }
    //   // this.getSleepSamples();
    //   // this.getStepCount();
    //   let d = new Date(year, month - 1, day);
    //   let optionStep = {
    //     date: d.toISOString(),
    //   };
    //   AppleHealthKit.getStepCount(optionStep, (err, value) => {
    //     if (value !== undefined) {
    //       this.setState({ stepCount: value.value });
    //     }
    //   });
    //   // let optionSleep = {
    //   //   startDate: (new Date(year, month - 1, day)).toISOString(), // required
    //   //   endDate: (new Date(year, month - 1, parseInt(day) + 1)).toISOString(), // optional; default now
    //   //   limit: 10, // optional; default no limit
    //   // };
    //   let optionSleep = {
    //     startDate: new Date(year, month - 1, day).toISOString(), // required
    //     endDate: new Date().toISOString(), // optional; default now
    //     limit: 10, // optional; default no limit
    //   };
    //   AppleHealthKit.getSleepSamples(optionSleep, (error, value) => {
    //     if (error) {
    //       return;
    //     }
    //     if (value !== [] && value.length > 0) {
    //       let findInBed = value.find((x) => x.value === "INBED");
    //       let findASleep = value.find((x) => x.value === "ASLEEP");
    //       var __startTime, __endTime, __duration, __hours, __minutes;
    //       if (findASleep !== undefined) {
    //         __startTime = moment(findASleep.startDate).format();
    //         __endTime = moment(findASleep.endDate).format();
    //         __duration = moment.duration(moment(__endTime).diff(__startTime));
    //         __hours = parseInt(__duration.asHours());
    //         __minutes = __duration.minutes();
    //         this.setState({ sleepHr: __hours, sleepMin: __minutes });
    //       } else if (findInBed !== undefined) {
    //         __startTime = moment(findASleep.startDate).format();
    //         __endTime = moment(findASleep.endDate).format();
    //         __duration = moment.duration(moment(__endTime).diff(__startTime));
    //         __hours = parseInt(__duration.asHours());
    //         __minutes = __duration.minutes();
    //         this.setState({ sleepHr: __hours, sleepMin: __minutes });
    //       }
    //     } else {
    //       this.setState({ sleepHr: "0", sleepMin: "0" });
    //     }
    //   });
    // });
  }

  onTimeUpdate = (fromTimeInMinutes, minutesLong) => {
    this.setState({ minutesLong });
  };

  onUpdate = ({ startAngle, angleLength }) => {
    this.setState({
      isupdate: true,
      startAngle: roundAngleToFives(startAngle),
      angleLength: roundAngleToFives(angleLength),
    });
  };

  onSaveClick(
    bedtimeH,
    bedtimeM,
    waketimeH,
    waketimeM,
    hours,
    minute,
    splitSleepArray
  ) {
    //validation sleep hrours not more than 20hrs
    let { loginData, getSleepDataRes, componentId, activeScreenStartTime } =
      this.props;
    let lastBedTimeH, lastBedTimeM, lastWeakTimeH, lastWeakTimeM;
    let todayDate, yestrdayDate;
    if (getSleepDataRes !== null && getSleepDataRes !== undefined) {
      lastBedTimeH = Number(getSleepDataRes.bedtime.split(":")[0]);
      lastBedTimeM = Number(getSleepDataRes.bedtime.split(":")[1]);
      lastWeakTimeH = Number(getSleepDataRes.waketime.split(":")[0]);
      lastWeakTimeM = Number(getSleepDataRes.waketime.split(":")[1]);
    } else {
      todayDate = moment().format("YYYY-MM-DD");
      yestrdayDate = moment(today).subtract(1, "days").format("YYYY-MM-DD");
    }

    let totalHours;
    let totalMinutes;
    if (splitSleepArray.length > 0) {
      totalHours = Number(splitSleepArray[0]) + Number(hours);
      totalMinutes = Number(splitSleepArray[1]) + Number(minute);
      totalHours = totalHours + totalMinutes / 60;
    } else {
      totalHours = Number(hours) + Number(minute) / 60;
    }

    if (totalHours > 20) {
      // Sleep time cannot be more than 20 hours. Please verify."
      Alert.alert("Sleep time cannot be more than 20 hours. Please verify.");
    } else if (bedtimeH == lastBedTimeH && waketimeH == lastWeakTimeH) {
      Alert.alert("Sleep time cannot be same.");
    } else if (bedtimeH === waketimeH && bedtimeM === waketimeM) {
      Alert.alert("Bed time and wakeup time cannot be same");
    } else {
      let yestrdayDate = moment(today).subtract(1, "days").format();
      const { startAngle, angleLength } = this.state;
      let bedTime = bedtimeH + ":" + bedtimeM;
      let wakeTime = waketimeH + ":" + waketimeM;
      let _id = "";
      if (
        getSleepDataRes !== null &&
        getSleepDataRes !== undefined &&
        getSleepDataRes.length > 0
      ) {
        _id = getSleepDataRes._id;
      }
      let postData = {
        bedtime: bedTime,
        waketime: wakeTime,
        startAngle: startAngle,
        angleLength: angleLength,
        user_id: loginData["user"]["_id"],
        createdAt: yestrdayDate,
        hours: hours,
        minute: minute,
        patientDate: moment().format(STRINGS.DATE_FORMAT_PATIENT),
        timeZone: currentTimeZone,
      };
      // this.props.AppActions.updateSleepTraker(postData, componentId);

      let postDataAddTimeTracker = {
        user_id: loginData["user"]["_id"],
        group: "Patient reported outcomes",
        screen: "sleep_tracker",
        startTime: activeScreenStartTime,
        endTime: moment().format(),
        date: moment().format(),
      };
      console.log("datatrack====>", postData);
      // console.log("data====>",postDataAddTimeTracker);
      // this.props.AppActions.addTimeTraker(postDataAddTimeTracker);
    }

    // else if (bedtimeH >= lastBedTimeH ||
    //   bedtimeH < lastWeakTimeH ||
    //   waketimeH > lastBedTimeH ||
    //   waketimeH < lastWeakTimeH) {
    //   Alert.alert('Please verfiy your selected time, you already selected time between.')
    // }
    // else if (
    //   getSleepDataRes !== null &&
    //   (bedtimeH >= currentTimeH || waketimeH >= currentTimeH)
    // ) {
    //   Alert.alert("You can not add future time");
    //   //&& waketimeM > currentTimeM
    //   //todayDate < yestrdayDate
    // }
  }

  _goBack() {
    let { componentId, loginData, activeScreenStartTime } = this.props;
    let postData = {
      user_id: loginData["user"]["_id"],
      group: "Patient reported outcomes",
      screen: "sleep_tracker",
      startTime: activeScreenStartTime,
      endTime: moment().format(),
      date: moment().format(),
    };
    this.props.AppActions.addTimeTraker(postData);
    navigatorPop({ componentId });
  }

  _onLogoutClick() {
    let { loginData, activeScreenStartTime } = this.props;
    let postData = {
      user_id: loginData["user"]["_id"],
      group: "Patient reported outcomes",
      screen: "sleep_tracker",
      startTime: activeScreenStartTime,
      endTime: moment().format(),
      date: moment().format(),
    };
    this.props.AppActions.addTimeTraker(postData);
    this.props.AppActions.logout(loginData["user"]["_id"]);
  }

  render() {
    let {
      componentId,
      GetAllSymptomsData,
      isPostSymptomLoading,
      getSleepDataRes,
      loginData,
      /* Legend Symptom List */
    } = this.props;
    let { activeTab, activeAppointmentTab } = this.state;

    let splitSleepArray = [];
    if (getSleepDataRes !== null && getSleepDataRes !== undefined) {
      splitSleepArray = getSleepDataRes.totalhourskey.split(":");
    }

    const { startAngle, angleLength, getStartAngle, getAngleLength, isupdate } =
      this.state;
    const bedtime = isupdate
      ? calculateTimeFromAngle(startAngle)
      : calculateTimeFromAngle(getStartAngle);
    const waketime = isupdate
      ? calculateTimeFromAngle((startAngle + angleLength) % (2 * Math.PI))
      : calculateTimeFromAngle(
          (getStartAngle + getAngleLength) % (2 * Math.PI)
        );

    let minutesLong = calculateMinutesFromAngle(angleLength);
    const getHours = Math.floor(minutesLong / 60);
    const getMinutes = minutesLong - getHours * 60;

    return (
      <View style={Styles.homeContainer}>
        {/* <Header
          isLeftIcon={true}
          isTitle={true}
          onLeftIconClick={() => {
            this._goBack()
          }}
          title="Sleep Tracker"
        /> */}
        <Header
          isLeftIcon={true}
          isRightIcon={false}
          onLeftIconClick={() => {
            this._goBack();
          }}
          isMiddleIcon={true}
          logoutApi={() => {
            this._onLogoutClick();
          }}
        />
        <View style={{ flex: 0.9, paddingHorizontal: RFValue(16) }}>
          <View style={{ flex: 0.9 }}>
            <View
              style={{
                height: RFValue(50),
                paddingTop: 20,
                paddingBottom: 10,
                borderWidth: 1,
                borderColor: "white",
                backgroundColor: "white",
                paddingLeft: 10,
              }}
            >
              <Text
                style={{
                  color: COLOR.PRIMARY,
                  fontSize: RFValue(16),
                  fontWeight: "bold",
                }}
              >
                {moment(new Date())
                  .subtract(1, "days")
                  .format("ddd, MMM DD, YYYY")}
              </Text>
            </View>

            <View style={Styles.timeContainer}>
              <View style={Styles.time}>
                <View style={Styles.timeHeader}>
                  <Svg height={16} width={16}>
                    <G fill="#ff9800">{BEDTIME_ICON}</G>
                  </Svg>
                  <Text style={Styles.bedtimeText}>Bed time</Text>
                </View>
                <Text style={Styles.timeValue}>
                  {bedtime.h}:{padMinutes(bedtime.m)}
                </Text>
              </View>
              <View style={Styles.time}>
                <View style={Styles.timeHeader}>
                  <Svg height={16} width={16}>
                    <G fill="#ff9800">{WAKE_ICON}</G>
                  </Svg>
                  <Text style={Styles.wakeText}>Wakeup time</Text>
                </View>
                <Text style={Styles.timeValue}>
                  {waketime.h}:{padMinutes(waketime.m)}
                </Text>
              </View>
            </View>

            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                marginTop: RFValue(20),
              }}
            >
              <TimerText
                style={Styles.sleepTimeContainer}
                minutesLong={calculateMinutesFromAngle(
                  isupdate ? angleLength : getAngleLength
                )}
              />
              <CircularSlider
                startAngle={isupdate ? startAngle : getStartAngle}
                angleLength={isupdate ? angleLength : getAngleLength}
                onUpdate={this.onUpdate}
                segments={5}
                strokeWidth={RFValue(30)}
                radius={RFValue(120)}
                gradientColorFrom="#ff9800"
                gradientColorTo="#ffcf00"
                showClockFace
                clockFaceColor="#9d9d9d"
                bgCircleColor={COLOR.SECONDARY}
                stopIcon={
                  <G scale="1.1" transform={{ translate: "-8, -8" }}>
                    {WAKE_ICON}
                  </G>
                }
                startIcon={
                  <G scale="1.1" transform={{ translate: "-8, -8" }}>
                    {BEDTIME_ICON}
                  </G>
                }
              />
            </View>

            {splitSleepArray.length ? (
              <Text style={Styles.totalHrStyle}>
                Your total sleep time: {splitSleepArray[0]}
                {"hr"} {splitSleepArray[1]}
                {"min"}
              </Text>
            ) : null}
          </View>
          <View style={{ flex: 0.1, marginTop: RFValue(20) }}>
            {this.state.sleepHrs !== "" ? (
              <Button
                text={"SAVE"}
                loader={isPostSymptomLoading}
                onBtnPress={() => {
                  this.onSaveClick(
                    bedtime.h,
                    padMinutes(bedtime.m),
                    waketime.h,
                    padMinutes(waketime.m),
                    getHours,
                    getMinutes,
                    splitSleepArray
                  );
                }}
              />
            ) : null}
          </View>
        </View>
      </View>
    );
  }
}

const mapStateToProps = ({ authReducer, dashboardReducer }) => ({
  /* Login */
  isLoggedIn: authReducer.isLoggedIn,
  loginData: authReducer.loginData,
  getSleepDataRes: dashboardReducer.getSleeptData,
  activeScreenStartTime: dashboardReducer.getScreenStartTime,
});
const mapDispatchToProps = (dispatch) => ({
  AppActions: bindActionCreators(AppActions, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(SleepTracker);
