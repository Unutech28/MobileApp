// @ts-nocheck
import GLOBALS from "@constants";
import React from "react";
import {
  Platform,
  StyleSheet,
  View,
  Dimensions,
  Image,
  Text,
  FlatList,
} from "react-native";
import { RFValue, RFPercentage } from "react-native-responsive-fontsize";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import IconBadge from "react-native-icon-badge";
import moment from "moment";
import momentZone from "moment-timezone";
import { LineChart } from "react-native-chart-kit";
import { strings } from "@localization";

const { COLOR, MOODS_ARRAY, FONTS, PRODUCT_TYPE } = GLOBALS;
const { PRIMARY, DARK_GREEN, PRIMARY1, BUTTON_ORANGE } = COLOR;
const { LIGHT, REGULAR } = FONTS;

const sleepChartConfig = {
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
    r: "6",
    strokeWidth: "2",
    stroke: PRIMARY1,
  },
  fillShadowGradientOpacity: 0.5,
  // propsForBackgroundLines: {
  //   strokeDasharray: "", // solid background lines with no dashes
  // },
};
let currentTimeZone = momentZone.tz.guess();

const chartConfig = {
  backgroundColor: COLOR.DARK_GREEN,
  backgroundGradientFrom: COLOR.PRIMARY1,
  backgroundGradientTo: COLOR.DARK_GREEN,
  decimalPlaces: 0, // optional, defaults to 2dp
  color: (opacity = 1) => `rgba(255, 255, 255, 0.6)`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: "6",
    strokeWidth: "2",
    stroke: COLOR.PRIMARY1,
  },
  fillShadowGradientOpacity: 0.5,
};

const chartConfigPoints = {
  backgroundColor: COLOR.PRIMARY1,
  backgroundGradientFrom: COLOR.PRIMARY1,
  backgroundGradientTo: COLOR.BACKGROUND_ORANGE,
  decimalPlaces: 0, // optional, defaults to 2dp
  color: (opacity = 1) => `rgba(255, 255, 255, 0.6)`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: "6",
    strokeWidth: "2",
    stroke: COLOR.PRIMARY1,
  },
};

function Reports(props) {
  let { getWeeklySummaryReportData } = props;
  let moodYAxis = [];
  let moodXAxis = [];

  let activityYAxis = [];
  let activityXAxis = [];

  let pointsYAxis = [];
  let pointsXAxis = [];

  let moodData = MOODS_ARRAY;

  const daysCheck = (arr = []) => {
    console.log("array>>>>", arr);
    let minDate = new Date();
    let temp = [];
    for (let i = 0; i < 7; i++) {
      temp.push(`${moment(minDate).subtract(i, "day").format("YYYY-MM-DD")}`);
    }
    let finalArray = temp.map((item, i) => {
      return (
        arr.find(
          (data) =>
            momentZone
              .tz(data.sleepdate, currentTimeZone)
              .format("YYYY-MM-DD") === item
        ) || {
          _id: i,
          hours: 0,
          minute: 0,
          sleepRate: 0,
          feelingRate: 0,
          sleepdate: item,
        }
      );
    });
    return finalArray;
  };

  const daysCheckWithMood = (arr = []) => {
    let minDate = new Date();
    let temp = [];

    console.log("moodArr", arr);

    for (let i = 0; i < 7; i++) {
      temp.push(`${moment(minDate).subtract(i, "day").format("YYYY-MM-DD")}`);
    }
    console.log("moodTemp", temp);

    let finalArray = temp.map((item, i) => {
      return (
        arr.find(
          (data) =>
            momentZone.tz(data.date, currentTimeZone).format("YYYY-MM-DD") ===
            item
        ) || {
          _id: i,
          moodavg: 0,
        }
      );
    });
    return finalArray;
  };

  const daysCheckWithActivity = (arr = []) => {
    let minDate = new Date();
    let temp = [];

    for (let i = 0; i < 7; i++) {
      temp.push(`${moment(minDate).subtract(i, "days").format("YYYY-MM-DD")}`);
    }

    let finalArray = temp.map((item, i) => {
      return (
        arr.find((data) => {
          return (
            momentZone.tz(data.date, currentTimeZone).format("YYYY-MM-DD") ===
            item
          );
        }) || {
          _id: i,
          total: 0,
          date: item,
        }
      );
    });
    return finalArray;
  };

  const daysCheckWithPoints = (arr = []) => {
    let minDate = new Date();
    let temp = [];

    for (let i = 0; i < 7; i++) {
      temp.push(`${moment(minDate).subtract(i, "days").format("YYYY-MM-DD")}`);
    }

    let finalArray = temp.map((item, i) => {
      return (
        arr.find((data) => {
          return (
            momentZone.tz(data.date, currentTimeZone).format("YYYY-MM-DD") ===
            item
          );
        }) || {
          _id: i,
          totalPoints: 0,
          date: item,
        }
      );
    });
    return finalArray;
  };

  //sleep
  let filterSleepGraph = [];
  getWeeklySummaryReportData?.sleepreport &&
    getWeeklySummaryReportData?.sleepreport?.map((ele) => {
      filterSleepGraph.push(ele.data[0]);
    });
  console.log("getWeeklySummaryReportData>>>", getWeeklySummaryReportData);
  console.log("sleep>>>", filterSleepGraph);

  let sleepHoursArray = [],
    sleepXAxis = [];
  if (filterSleepGraph.length > 0) {
    // let sleepData = daysCheckWithSleep(filterSleepGraph)
    let sleepData = getWeeklySummaryReportData?.sleepreport
      ? daysCheck(filterSleepGraph)
      : [];
    console.log("sleepDataCheck>>> ", sleepData);
    sleepHoursArray = sleepData?.length
      ? sleepData?.map((item) => {
          return (Number(item.hours) + Number(item.minute) / 60).toFixed(2);
        })
      : [];

    sleepXAxis = sleepData?.length
      ? sleepData?.map((item) => {
          return moment(item.sleepdate).format("MM/DD");
        })
      : [];
  }

  if (getWeeklySummaryReportData !== undefined) {
    //mood count
    getWeeklySummaryReportData?.moodreport?.forEach((element) => {
      moodData.forEach((e) => {
        if (e.id === element._id) {
          e.moodCountValue = element?.moodcount;
        }
      });
    });

    //mood graph
    let res =
      getWeeklySummaryReportData?.moodreport &&
      getWeeklySummaryReportData?.moodreport.length
        ? daysCheckWithMood(getWeeklySummaryReportData?.moodreport)
        : [];
    console.log("MoodDaysCheck>>> ", res);

    res.forEach((element) => {
      moodYAxis.push(Number(element?.moodavg ? element?.moodavg : "0.0"));
      moodXAxis.push(moment(element._id).format("MM/DD"));
    });

    //activity
    let activityData =
      getWeeklySummaryReportData?.activityreport &&
      getWeeklySummaryReportData?.activityreport.length
        ? daysCheckWithActivity(getWeeklySummaryReportData?.activityreport)
        : [];
    console.log("activityData>>> ", activityData);
    activityData.forEach((element) => {
      activityYAxis.push(Number(element.total));
      activityXAxis.push(moment(element.date).format("MM/DD"));
    });

    //points
    let pointsData =
      getWeeklySummaryReportData?.newPointsdata &&
      getWeeklySummaryReportData?.newPointsdata.length
        ? daysCheckWithPoints(getWeeklySummaryReportData.newPointsdata)
        : [];
    pointsData.forEach((element) => {
      pointsYAxis.push(Number(element.totalPoints));
      pointsXAxis.push(moment(element.date).format("MM/DD"));
    });
  }

  let activityData =
    getWeeklySummaryReportData !== undefined &&
    getWeeklySummaryReportData?.activityweekdata &&
    getWeeklySummaryReportData?.activityweekdata.length
      ? getWeeklySummaryReportData?.activityweekdata
          .filter((item) => item.activityTitle && item.img && item.total)
          .map((item) => {
            return {
              activityName: item.activityTitle || "",
              image: getWeeklySummaryReportData?.url + item.img,
              totalcount: item.total,
            };
          })
      : null;

  var timeFrom = (X) => {
    var dates = [];
    for (let I = 0; I < 7; I++) {
      dates.push(
        moment(Date.now() - (X >= 0 ? I : I--) * 24 * 3600 * 1000).format(
          "MM/DD"
        )
      );
    }
    return dates;
  };
  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Text style={styles.headerStyle}>
            {strings.reports.ReportDate}: {moment().format("MM/DD/YYYY")}
          </Text>

          {/* sleep */}
          <Text style={styles.blackBoldText}>
            {PRODUCT_TYPE == "CU002"
              ? strings.reports.baby_sleep
              : `${strings.reports.dailySleepTracker} : ${strings.reports.hoursDay}`}
          </Text>
          {sleepXAxis &&
          sleepXAxis.length &&
          sleepHoursArray &&
          sleepHoursArray.length ? (
            <LineChart
              data={{
                labels: sleepXAxis.reverse(),
                datasets: [
                  {
                    data: sleepHoursArray.reverse(),
                  },
                ],
              }}
              width={Dimensions.get("window").width} // from react-native
              height={Dimensions.get("window").height / 3.5}
              chartConfig={sleepChartConfig}
              bezier
              style={{
                marginTop: 8,
                borderRadius: 2,
              }}
              fromZero={true}
            />
          ) : (
            <LineChart
              data={{
                labels: timeFrom(7).reverse(),
                datasets: [
                  {
                    data: [0, 0, 0, 0, 0, 0, 0],
                  },
                ],
              }}
              width={Dimensions.get("window").width} // from react-native
              height={Dimensions.get("window").height / 3.5}
              chartConfig={sleepChartConfig}
              bezier
              style={{
                marginTop: 8,
              }}
              fromZero={true}
            />
          )}

          {/* mood graph */}
          <Text
            style={[
              styles.blackBoldText,
              {
                paddingBottom: RFValue(10),
                marginTop: RFValue(30),
              },
            ]}
          >
            {PRODUCT_TYPE == "CU002"
              ? strings.reports.baby_mood
              : strings.reports.AverageDailyMoodReport}
          </Text>
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
              width={Dimensions.get("window").width}
              height={Dimensions.get("window").height / 3.5}
              chartConfig={sleepChartConfig}
              bezier
              fromZero={true}
            />
          ) : (
            <LineChart
              data={{
                labels: timeFrom(7).reverse(),
                datasets: [
                  {
                    data: [0, 0, 0, 0, 0, 0, 0],
                  },
                ],
              }}
              width={Dimensions.get("window").width}
              height={Dimensions.get("window").height / 3.5}
              chartConfig={chartConfig}
              bezier
              fromZero={true}
            />
          )}

          {/* mood icons */}
          <Text style={styles.blackBoldText}>
            {PRODUCT_TYPE == "CU002"
              ? strings.reports.WeeklyMoodReport_baby
              : strings.reports.WeeklyMoodReport}
          </Text>

          {getWeeklySummaryReportData !== undefined &&
          getWeeklySummaryReportData?.moodweekdata &&
          getWeeklySummaryReportData?.moodweekdata?.length ? (
            <FlatList
              contentContainerStyle={{
                //flexGrow: 1,
                // marginBottom: RFPercentage(2.2),
                marginTop: RFValue(20),
                flexDirection: "row",
                justifyContent: "space-around",
              }}
              horizontal={true}
              data={getWeeklySummaryReportData?.moodweekdata}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => `${item._id}`}
              renderItem={({ item, index }) => (
                <View
                  key={index}
                  style={{
                    padding: Platform.OS == "android" ? RFValue(7) : 0,
                  }}
                >
                  {item.total ? (
                    <IconBadge
                      MainElement={
                        <Image
                          style={{
                            height: RFPercentage(6),
                            width: RFPercentage(6),
                            marginLeft: 10,
                            marginRight: 10,
                          }}
                          source={{
                            uri:
                              item.img !== undefined
                                ? getWeeklySummaryReportData?.url + item.img
                                : "",
                          }}
                        />
                      }
                      BadgeElement={
                        <Text
                          style={{
                            color: COLOR.WHITE,
                          }}
                        >
                          {item.total}
                        </Text>
                      }
                      IconBadgeStyle={styles.iconBadgeStyle}
                    />
                  ) : null}
                </View>
              )}
            />
          ) : (
            <Text style={styles.noRecord}>
              {strings.reports.NoRecordforthisweek}
            </Text>
          )}

          {/* activity graph */}
          <Text
            style={[
              styles.blackBoldText,
              {
                paddingBottom: RFValue(10),
              },
            ]}
          >
            {PRODUCT_TYPE == "CU002"
              ? strings.reports.diaper_report
              : strings.reports.DailyActivityReport}
          </Text>
          {activityXAxis &&
          activityXAxis.length &&
          activityYAxis &&
          activityYAxis.length ? (
            <LineChart
              data={{
                labels: activityXAxis.reverse(),
                datasets: [
                  {
                    data: activityYAxis.reverse(),
                  },
                ],
              }}
              width={Dimensions.get("window").width}
              height={Dimensions.get("window").height / 3.5}
              yAxisInterval={1}
              chartConfig={chartConfig}
              bezier
              fromZero={true}
            />
          ) : (
            <LineChart
              data={{
                labels: timeFrom(7).reverse(),
                datasets: [
                  {
                    data: [0, 0, 0, 0, 0, 0, 0],
                  },
                ],
              }}
              width={Dimensions.get("window").width}
              height={Dimensions.get("window").height / 3.5}
              yAxisInterval={1}
              chartConfig={chartConfig}
              bezier
              fromZero={true}
            />
          )}

          {/* activity icons */}
          <Text style={styles.blackBoldText}>
            {" "}
            {PRODUCT_TYPE == "CU002"
              ? strings.reports.weekly_diaper
              : strings.reports.WeeklyActivityReport}
          </Text>
          <FlatList
            contentContainerStyle={{
              flexGrow: 1,
              marginTop: RFValue(10),
            }}
            data={activityData}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => `${item._id}`}
            ListEmptyComponent={
              <Text style={styles.regularFont}>
                {strings.reports.NoRecordforthisweek}
              </Text>
            }
            numColumns={4}
            renderItem={({ item, index }) => (
              <View
                style={{
                  alignItems: "center",
                  margin: RFValue(5),
                  marginTop: RFValue(15),
                  width: "22%",
                }}
                key={index}
              >
                <IconBadge
                  MainElement={
                    <Image
                      style={{
                        height: RFPercentage(6),
                        width: RFPercentage(6),
                        marginLeft: 10,
                        marginRight: 10,
                      }}
                      source={{
                        uri: item.image,
                      }}
                    />
                  }
                  BadgeElement={
                    <Text
                      style={[
                        {
                          color: COLOR.WHITE,
                          fontWeight: "700",
                        },
                        styles.regularFont,
                      ]}
                    >
                      {item.totalcount}
                    </Text>
                  }
                  IconBadgeStyle={styles.iconBadgeStyle}
                  // Hidden={item.id == 0}
                />
                <Text
                  style={[
                    styles.regularFont,
                    {
                      marginTop: RFValue(10),
                      fontWeight: "600",
                    },
                  ]}
                >
                  {item.activityName}
                </Text>
              </View>
            )}
          />
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: COLOR.WHITE,
    paddingHorizontal: RFValue(10),
    marginTop: RFPercentage(3),
  },
  blackBoldText: {
    fontWeight: "600",
    marginTop: RFValue(30),
    fontSize: RFValue(15),
    color: "#313132",
    marginBottom: RFValue(2),
    fontFamily: REGULAR,
  },
  graphText: {
    fontSize: RFValue(12),
    marginBottom: RFValue(20),
    marginTop: RFValue(5),
  },
  headerStyle: {
    fontWeight: "bold",
    color: DARK_GREEN,
    fontSize: RFValue(22),
    fontFamily: LIGHT,
    fontWeight: "700",
  },
  iconBadgeStyle: {
    width: 25,
    height: 25,
    backgroundColor: DARK_GREEN,
    marginTop: -RFValue(8),
    shadowColor: "#ffff",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.46,
    shadowRadius: 10.14,
    elevation: 17,
  },
  noRecord: {
    fontSize: RFValue(15),
    color: COLOR.GREY,
    marginVertical: RFValue(5),
    fontFamily: REGULAR,
  },
  regularFont: {
    fontFamily: REGULAR,
  },
});

export default Reports = React.memo(Reports);
