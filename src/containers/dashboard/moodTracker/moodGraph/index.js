import React, { Component, lazy } from "react";
import { Text, View, Dimensions, StyleSheet, Image } from "react-native";
const Header = lazy(() => import("@components/common/Header"));
import { RFValue, RFPercentage } from "react-native-responsive-fontsize";
import {
  navigatorPop,
  navigatorPush,
  navigatorPopTo,
} from "@config/navigationOptions";
import CustomButton from "@components/common/customButton";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as AppActions from "@actions/";
import GLOBALS from "@constants";
import moment from "moment";
import momentZone from "moment-timezone";
import { LineChart } from "react-native-chart-kit";
import * as Images from "@images";
import { strings } from "@localization";
import { string } from "prop-types";
import Styles from "../styles";
let currentTimeZone = momentZone.tz.guess();
const { COLOR, STRINGS, MOODS_ARRAY, FONTS, PRODUCT_TYPE } = GLOBALS;
const { WHITE } = COLOR;
const { REGULAR } = FONTS;
class MoodGraph extends Component {
  constructor(props) {
    super(props);
    this._getWeeklySummaryReportAPi();
  }

  _getWeeklySummaryReportAPi() {
    let { loginData } = this.props;
    let postData = {
      user_id: loginData["user"]["_id"],
      patientDate: moment().format(STRINGS.DATE_FORMAT_PATIENT),
      timeZone: currentTimeZone,
    };
    this.props.AppActions.getWeeklySummaryReport(postData);
  }
  _goBack() {
    let { componentId } = this.props;
    navigatorPop({ componentId });
  }

  render() {
    const { getWeeklySummaryReportData, componentId } = this.props;
    let moodData = MOODS_ARRAY;
    let moodYAxis = [];
    let moodXAxis = [];
    let x = [];
    let reverseDay = [];
    let final = [];
    const daysCheckWithMood = (arr = []) => {
      let minDate = new Date();
      let temp = [];

      for (let i = 0; i < 7; i++) {
        temp.push(`${moment(minDate).subtract(i, "day").format("YYYY-MM-DD")}`);
      }

      let finalArray = temp.map((item, i) => {
        let MoodType;

        return (
          arr.find(
            (data) =>
              momentZone.tz(data._id, currentTimeZone).format("YYYY-MM-DD") ===
              item
          ) || {
            _id: item,
            avgAmount: 0,
          }
        );
      });
      // final = finalArray;
      return finalArray;
    };
    if (getWeeklySummaryReportData !== undefined) {
      //mood count
      getWeeklySummaryReportData.moodcount.forEach((element) => {
        moodData.forEach((e) => {
          if (e.id === element._id) {
            e.moodCountValue = element.moodcount;
          }
        });
      });

      //mood graph
      let res =
        getWeeklySummaryReportData.newMooddataavg &&
        getWeeklySummaryReportData.newMooddataavg.length
          ? daysCheckWithMood(getWeeklySummaryReportData.newMooddataavg)
          : [];

      final = res;

      res.forEach((element) => {
        moodYAxis.push(Number(element.avgAmount));
        moodXAxis.push(moment(element._id).format("MM/DD"));
        let data = {
          day: moment(element._id).format("dddd")[0],
          // moodId: element.moodId,
          moodId: element?.data
            ? element?.data[element?.data.length - 1]?.mood
            : 12,
        };
        // x.push(moment(element._id).format("dddd")[0]);
        x.push(data);
      });
      reverseDay = x.reverse();
    }

    return (
      <View>
        <Header
          isLeftIcon={true}
          isRightIcon={false}
          onLeftIconClick={() => {
            this._goBack();
          }}
          isLogout={false}
          isTitle={true}
          title={strings.mood.MoodCheckIn}
          titleStyle={Styles.titleStyle}
        />
        <View>
          <View style={Styles.innerWrapper}>
            <Text style={Styles.text}>
              {PRODUCT_TYPE == "CU002"
                ? strings.mood.daysCU002
                : strings.mood.days}
            </Text>
            <View style={Styles.daysStyle}>
              {reverseDay.length
                ? reverseDay.map((item, i) => {
                    return (
                      <View>
                        <Text style={Styles.daysName}>{item.day}</Text>
                        {/* <Image
                          source={Images.GrayCircle}
                          // style={{ borderWidth: 1 }}
                        /> */}
                        <View
                          style={{
                            height: 30,
                            width: 30,
                            borderRadius: 15,
                            backgroundColor:
                              item.moodId == 1
                                ? "#E14C58"
                                : item.moodId == 2
                                ? "#F9834E"
                                : item.moodId == 3
                                ? "#E2BA39"
                                : item.moodId == 4
                                ? "#8FC16E"
                                : item.moodId == 5
                                ? "#60B561"
                                : "gray",
                          }}
                        />
                      </View>
                    );
                  })
                : null}
            </View>
          </View>

          <View style={Styles.graph}>
            {moodXAxis && moodXAxis.length && moodYAxis && moodYAxis.length ? (
              <LineChart
                data={{
                  labels: moodXAxis.reverse(),
                  datasets: [
                    {
                      data: moodYAxis.reverse(),
                    },
                  ],
                }}
                yAxisInterval={1}
                width={Dimensions.get("window").width}
                height={Dimensions.get("window").height / 3.5}
                chartConfig={{
                  backgroundColor: COLOR.PRIMARY1,
                  backgroundGradientFrom: COLOR.PRIMARY1,
                  backgroundGradientTo: COLOR.DARK_GREEN,
                  decimalPlaces: 1, // optional, defaults to 2dp
                  color: (opacity = 1) => `rgba(255, 255, 255, 0.6)`,
                  labelColor: (opacity = 1) =>
                    `rgba(255, 255, 255, ${opacity})`,

                  propsForDots: {
                    r: "6",
                    strokeWidth: "2",
                    stroke: COLOR.PRIMARY1,
                  },
                  fillShadowGradientOpacity: 0.5,
                }}
                bezier
                fromZero={true}
              />
            ) : null}
          </View>

          <View style={Styles.buttonWrapper}>
            <CustomButton
              text={strings.mood.finish}
              colors={[COLOR.DARK_GREEN, COLOR.DARK_GREEN]}
              // colors={["#6545B2", "#6545B2", "#6545B2"]}
              buttonText={{ color: WHITE }}
              onBtnPress={() => {
                this.props.extra_props && this.props.extra_props.goToComponent
                  ? navigatorPopTo(this.props.extra_props.goToComponent)
                  : navigatorPush({
                      componentId,
                      screenName: "Dashboard",
                    });
              }}
            />
          </View>
        </View>
      </View>
    );
  }
}
const mapStateToProps = ({ authReducer, dashboardReducer }) => ({
  loginData: authReducer.loginData,
  getWeeklySummaryReportData: dashboardReducer.getWeeklySummaryReports,
});
const mapDispatchToProps = (dispatch) => ({
  AppActions: bindActionCreators(AppActions, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(MoodGraph);
