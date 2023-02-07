// @ts-nocheck

import GLOBALS from "@constants";

import moment from "moment";
import React, { useState, useEffect } from "react";
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Dimensions,
  Animated,
  Alert,
} from "react-native";
import { RFValue, RFPercentage } from "react-native-responsive-fontsize";
const { COLOR, STRINGS, FONTS, PRODUCT_TYPE } = GLOBALS;

import momentZone from "moment-timezone";
import hoursJson from "./hoursJson";
import minutesJson from "./minutesJson";
import { Slider } from "react-native-elements";
import { LineChart } from "react-native-chart-kit";
import CustomButton from "../../common/customButton";
import { strings } from "@localization";

import "moment/locale/es";
import "moment/locale/en-gb";

const { DARK_GREEN, WHITE, BLACK } = COLOR;
const { LIGHT, REGULAR } = FONTS;

const LineGraphUI = ({ xAxis, yAxis, label }) => {
  const sleepChartConfig = {
    backgroundColor: COLOR.PRIMARY1,
    backgroundGradientFrom: COLOR.PRIMARY1,
    backgroundGradientTo: COLOR.PRIMARY,
    decimalPlaces: 1, // optional, defaults to 2dp
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

  return (
    <View style={{ alignSelf: "center" }}>
      <Text style={styles.graphTitle}>{label}</Text>
      {xAxis && xAxis.length && yAxis && yAxis.length ? (
        <LineChart
          data={{
            labels: xAxis,
            datasets: [
              {
                data: yAxis,
              },
            ],
          }}
          width={Dimensions.get("window").width / 1.12}
          height={Dimensions.get("window").height / 3.8}
          style={{ marginTop: RFValue(10) }}
          chartConfig={sleepChartConfig}
          bezier
          // fromZero={true}
        />
      ) : null}
    </View>
  );
};

const SliderUI = ({ setScale, getScale, isEditUI }) => {
  const onSliderChange = (value) => {
    setScale(value);
  };
  return (
    <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
      <View style={{ flex: 0.9 }}>
        <Slider
          value={getScale}
          onValueChange={(value) => (!isEditUI ? onSliderChange(value) : null)}
          maximumTrackTintColor={"#B1B1B1"}
          minimumTrackTintColor={DARK_GREEN}
          tintColor={DARK_GREEN}
          thumbTintColor={DARK_GREEN}
          minimumValue={1}
          maximumValue={10}
          thumbStyle={{
            height: RFValue(25),
            width: RFValue(25),
            borderRadius: RFValue(25),
            backgroundColor: WHITE,
            borderWidth: 10,
            borderColor: DARK_GREEN,
          }}
          thumbProps={{
            Component: Animated.Image,
            source: {
              uri: "https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg",
            },
          }}
        />
      </View>
      {/* .toFixed(0) */}
      <View style={{ flex: 0.1 }}>
        <Text style={styles.sliderValue}>
          {getScale !== undefined ? getScale.toFixed(0) : null}
        </Text>
      </View>
    </View>
  );
};

function SleepTracker(props) {
  const { getSleepTrackerData, saveSleepTrackerAPI, getSleepTrackerAPI, data } =
    props;
  const [sleepHoursXaxis, setSleepHoursXaxis] = useState([]);
  const [sleepHoursYaxis, setSleepHoursYaxis] = useState([]);
  const [sleeQualityYaxis, setSleepQualityYaxis] = useState([]);
  const [sleepEnergyYaxis, setSleepEnergyYaxis] = useState([]);
  const [dateArray, setDateArray] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [hoursValue, setHoursValue] = useState(Number("00"));
  const [minutesValue, setMinutesValue] = useState(Number("00"));
  const [showHoursArray, setShowHoursArray] = useState(false);
  const [showMinutesArray, setShowMinutesArray] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    moment(new Date()).format("YYYY-MM-DD")
  );
  const [sleepScale, setSleepScale] = useState();
  const [energeticScale, setEnergeticScale] = useState();
  const [isEditUI, setIsEditUI] = useState(false);
  const [temp, setTemp] = useState(0);
  let currentTimeZone = momentZone.tz.guess();

  useEffect(() => {
    var dateArrayList = [];
    for (var i = 6; i >= 0; i--) {
      dateArrayList.push({
        dates: moment().subtract(i, "days").format("YYYY-MM-DD"),
        selectedItem: false,
        _id: i,
        isEditTracker: false,
      });

      if (dateArrayList.length) {
        dateArrayList.map((ele) => {
          if (ele.dates === moment(new Date()).format("YYYY-MM-DD")) {
            ele.selectedItem = true;
          }
          if (
            ele.dates === moment().subtract(0, "days").format("YYYY-MM-DD") ||
            ele.dates === moment().subtract(1, "days").format("YYYY-MM-DD") ||
            ele.dates === moment().subtract(2, "days").format("YYYY-MM-DD")
          ) {
            ele.isEditTracker = true;
          }
        });
      }

      setDateArray([...dateArrayList]);
    }
  }, []);

  useEffect(() => {}, [temp]);

  useEffect(() => {
    setSleepData(selectedDate);

    console.log("getSleepTrackerDataComponent", getSleepTrackerData);
    let filterSleepGraph = [];
    getSleepTrackerData &&
      getSleepTrackerData?.map((ele) => {
        filterSleepGraph.push(ele.data[0]);
      });

    let sleepDataArray = getSleepTrackerData ? daysCheck(filterSleepGraph) : [];

    // set all sleep XAxis
    let sleepHoursXAxis = sleepDataArray.length
      ? sleepDataArray.map((item) => {
          return moment(item.sleepdate).format("MM/DD");
        })
      : [getSleepTrackerData];
    setSleepHoursXaxis(sleepHoursXAxis.reverse());

    // Sleep Hours
    let sleepHoursYAxis = sleepDataArray.length
      ? sleepDataArray.map((item) => {
          if (item.hours == 0 && item.minute == 0) {
            return Number(item.hours);
          }
          return (Number(item.hours) + Number(item.minute) / 60).toFixed(2);
          // return Number(item.hours);
        })
      : [];
    setSleepHoursYaxis(sleepHoursYAxis.reverse());

    //Sleep Quality
    let sleepQualityYAxis = sleepDataArray.length
      ? sleepDataArray.map((item) => {
          return item.sleepRate !== undefined ? item.sleepRate : null;
        })
      : [];
    setSleepQualityYaxis(sleepQualityYAxis.reverse());

    //Sleep Energy
    let sleepEnergyYAxis = sleepDataArray.length
      ? sleepDataArray.map((item) => {
          return item.feelingRate !== undefined ? item.feelingRate : null;
        })
      : [];
    setSleepEnergyYaxis(sleepEnergyYAxis.reverse());

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getSleepTrackerData]);

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

  const onHoursPlus = () => {
    if (hoursValue < 24) {
      setHoursValue(Number(hoursValue) + 1);
    } else {
      setHoursValue(0 + 1);
    }
    if (hoursValue == 24) {
      setMinutesValue(0);
    }
  };

  const onHoursMinus = () => {
    if (hoursValue > 1) {
      setHoursValue(Number(hoursValue) - 1);
    } else {
      setHoursValue(25 - 1);
    }
    if (hoursValue == 24) {
      setMinutesValue(0);
    }
  };

  const onMinutePlus = () => {
    if (hoursValue !== 24 && minutesValue < 45) {
      setMinutesValue(Number(minutesValue) + 15);
    } else {
      setMinutesValue(0);
    }
  };

  const onMinuteMinus = () => {
    if (hoursValue !== 24) {
      if (minutesValue > 0) {
        setMinutesValue(Number(minutesValue) - 15);
      } else {
        // setMinutesValue(59)
        setMinutesValue(60 - 15);
      }
    }
  };

  const onSaveSleepTracker = () => {
    if (hoursValue === 0) {
      // eslint-disable-next-line no-alert
      // alert('Please fill Sleep Hours');
      Alert.alert(
        "",
        strings.PLEASE_FILL_SLEEP,
        [
          {
            text: "OK",
            onPress: () => {},
          },
        ],
        { cancelable: false }
      );
    } else {
      let postData = {
        hours: hoursValue,
        minute: minutesValue,
        sleepdate: selectedDate,
        sleepRate: sleepScale !== undefined ? sleepScale.toFixed(0) : 0, //.toFixed(0)
        feelingRate:
          energeticScale !== undefined ? energeticScale.toFixed(0) : 0, //.toFixed(0)
        patientDate: moment().format(STRINGS.DATE_FORMAT_PATIENT),
        timeZone: currentTimeZone,
      };
      saveSleepTrackerAPI(postData, selectedDate);
      // dispatch(AppActions.saveSleepTracker(postData, postDataGetAPI));
    }
  };

  const onDateClick = (item) => {
    setSleepData(item.dates);
    dateArray.map((ele) => {
      if (ele._id === item._id) {
        ele.selectedItem = true;
      } else {
        ele.selectedItem = false;
      }

      if (ele.dates === item.dates) {
        if (ele.isEditTracker) {
          setIsEditUI(false);
        } else {
          setIsEditUI(true);
        }
      }
    });
    getSleepTrackerAPI(item.dates);
    // getSleepTrackerAPI(item.dates);
    setSelectedDate(item.dates);
    setTemp(temp + 1);
    setRefresh(!refresh);
  };

  const setSleepData = (date) => {
    if (
      getSleepTrackerData &&
      getSleepTrackerData !== null &&
      getSleepTrackerData.length > 0
    ) {
      let selcetedSleepData = getSleepTrackerData.find(
        (ele) => moment(ele.date).format("YYYY-MM-DD") == date
      );
      if (selcetedSleepData !== undefined) {
        let data = selcetedSleepData.data[0];
        setHoursValue(data.hours);
        setMinutesValue(data.minute);
        setSleepScale(Number(data.sleepRate));
        setEnergeticScale(Number(data.feelingRate));
      } else {
        setHoursValue(0);
        setMinutesValue(0);
        setEnergeticScale(0);
        setSleepScale(0);
      }
    }
    setTemp(temp + 1);
  };

  return (
    <ScrollView style={styles.wrapper}>
      <View
        style={{
          marginTop: RFPercentage(3),
          paddingBottom: RFValue(15),
        }}
      >
        <Text style={styles.date}>{strings.SleepTracker.select_date}</Text>
        {/* Date strip UI */}
        <View
          style={[
            styles.dateWrapper,
            selectedDate ===
              moment().subtract(0, "days").format("YYYY-MM-DD") ||
            selectedDate ===
              moment().subtract(1, "days").format("YYYY-MM-DD") ||
            selectedDate === moment().subtract(2, "days").format("YYYY-MM-DD")
              ? {}
              : { shadowColor: COLOR.DARKGREY },
          ]}
        >
          <FlatList
            data={dateArray}
            contentContainerStyle={[
              styles.contentContainerStyle,
              selectedDate ===
                moment().subtract(0, "days").format("YYYY-MM-DD") ||
              selectedDate ===
                moment().subtract(1, "days").format("YYYY-MM-DD") ||
              selectedDate === moment().subtract(2, "days").format("YYYY-MM-DD")
                ? {}
                : { shadowColor: COLOR.DARKGREY, borderColor: COLOR.DARKGREY },
            ]}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item._id}
            extraData={refresh}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => onDateClick(item)}
                style={styles.dateView}
              >
                <View
                  style={[
                    {
                      backgroundColor: item.selectedItem ? DARK_GREEN : WHITE,
                    },
                    styles.dateViewStyle,
                  ]}
                >
                  <Text
                    style={[
                      styles.dayText,
                      { color: item.selectedItem ? WHITE : BLACK },
                    ]}
                  >
                    {moment(item.dates).format("DD")}
                  </Text>
                  <Text
                    style={[
                      styles.monthText,
                      { color: item.selectedItem ? WHITE : BLACK },
                    ]}
                  >
                    {moment(item.dates)
                      .locale(strings.APP_INFO.momentLanguage)
                      .format("MMM")}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>

      <View style={styles.outerBox}>
        {/* sleep hours UI */}
        <View
          style={[
            styles.innerBox,
            selectedDate ===
              moment().subtract(0, "days").format("YYYY-MM-DD") ||
            selectedDate ===
              moment().subtract(1, "days").format("YYYY-MM-DD") ||
            selectedDate === moment().subtract(2, "days").format("YYYY-MM-DD")
              ? {}
              : { shadowColor: COLOR.DARKGREY, borderColor: COLOR.DARKGREY },
          ]}
        >
          <Text style={styles.boxText}>
            {PRODUCT_TYPE == "CU002"
              ? strings.SleepTracker.sleep_hoursCU002
              : strings.SleepTracker.sleep_hours}{" "}
          </Text>

          <View style={styles.sleepHoursOuterView}>
            <View style={styles.sleepHrsView}>
              {!showHoursArray ? (
                <View style={{ alignItems: "center" }}>
                  <TouchableOpacity
                    onPress={() => (!isEditUI ? onHoursPlus() : null)}
                  >
                    <Text style={styles.arrow}>▲</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => (!isEditUI ? setShowHoursArray(true) : null)}
                  >
                    <Text style={styles.timeText}>
                      {hoursValue !== undefined ? hoursValue : "00"} {"h"}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => (!isEditUI ? onHoursMinus() : null)}
                  >
                    <Text style={styles.arrow}>▼</Text>
                  </TouchableOpacity>
                </View>
              ) : !isEditUI ? (
                <View style={{ width: 50, height: 350 }}>
                  <FlatList
                    data={hoursJson}
                    contentContainerStyle={styles.flStyles}
                    showsVerticalScrollIndicator={false}
                    nestedScrollEnabled={true}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() => {
                          setHoursValue(item.hours);
                          setShowHoursArray(false);
                        }}
                        style={styles.timeTbStyle}
                      >
                        <Text style={{ color: COLOR.GREY }}>{item.hours}</Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              ) : null}
            </View>

            <View style={styles.colonStyle}>
              <Text style={{ fontSize: RFValue(28), fontWeight: "bold" }}>
                :
              </Text>
            </View>

            <View style={styles.sleepHrsView}>
              {!showMinutesArray ? (
                <View style={{ alignItems: "center" }}>
                  <TouchableOpacity
                    onPress={() => (!isEditUI ? onMinutePlus() : null)}
                  >
                    <Text style={styles.arrow}>▲</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() =>
                      !isEditUI
                        ? hoursValue == 24
                          ? null
                          : setShowMinutesArray(true)
                        : null
                    }
                  >
                    <Text style={styles.timeText}>
                      {minutesValue !== undefined
                        ? hoursValue === 24
                          ? "00"
                          : minutesValue == 0
                          ? minutesValue + "0"
                          : minutesValue
                        : "00"}{" "}
                      {"m"}
                    </Text>
                    {/* <Text style={styles.timeText}>
                      {minutesValue !== undefined
                        ? hoursValue === 24
                          ? "00"
                          :minutesValue
                        : "00"}{" "}
                      {"m"}
                    </Text> */}
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => (!isEditUI ? onMinuteMinus() : null)}
                  >
                    <Text style={styles.arrow}>▼</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View
                  style={
                    {
                      // width: 50,
                      // height: 350,
                    }
                  }
                >
                  <FlatList
                    data={minutesJson}
                    contentContainerStyle={styles.flStyles}
                    showsVerticalScrollIndicator={false}
                    nestedScrollEnabled={true}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.timeTbStyle}
                        onPress={() => {
                          setShowMinutesArray(false);
                          item.minutes == "00"
                            ? setMinutesValue("0")
                            : setMinutesValue(item.minutes);
                        }}
                      >
                        <Text style={{ color: COLOR.GREY }}>
                          {item.minutes}
                        </Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              )}
            </View>
          </View>
        </View>

        {
          // PRODUCT_TYPE !== "CU002" &&
          /**  sleep Scale UI * */
          <>
            <View
              style={[
                styles.innerBox,
                selectedDate ===
                  moment().subtract(0, "days").format("YYYY-MM-DD") ||
                selectedDate ===
                  moment().subtract(1, "days").format("YYYY-MM-DD") ||
                selectedDate ===
                  moment().subtract(2, "days").format("YYYY-MM-DD")
                  ? {}
                  : {
                      shadowColor: COLOR.DARKGREY,
                      borderColor: COLOR.DARKGREY,
                    },
              ]}
            >
              <Text style={styles.boxText}>
                {PRODUCT_TYPE == "CU002"
                  ? strings.SleepTracker.energetic_scaleCU002
                  : strings.SleepTracker.sleep_scale}
              </Text>
              <View style={styles.slider}>
                <SliderUI
                  setScale={setSleepScale}
                  getScale={sleepScale}
                  isEditUI={isEditUI}
                />
              </View>
            </View>
            {/* energy Scale UI */}
            <View
              style={[
                styles.innerBox,
                selectedDate ===
                  moment().subtract(0, "days").format("YYYY-MM-DD") ||
                selectedDate ===
                  moment().subtract(1, "days").format("YYYY-MM-DD") ||
                selectedDate ===
                  moment().subtract(2, "days").format("YYYY-MM-DD")
                  ? {}
                  : {
                      shadowColor: COLOR.DARKGREY,
                      borderColor: COLOR.DARKGREY,
                    },
              ]}
            >
              <Text style={styles.boxText}>
                {PRODUCT_TYPE == "CU002"
                  ? strings.SleepTracker.sleep_scaleCU002
                  : strings.SleepTracker.energetic_scale}
              </Text>
              <View style={styles.slider}>
                <SliderUI
                  setScale={setEnergeticScale}
                  getScale={energeticScale}
                  isEditUI={isEditUI}
                />
              </View>
            </View>
          </>
        }

        {/* <View
          style={[
            styles.innerBox,
            selectedDate ===
              moment()
                .subtract(0, 'days')
                .format('YYYY-MM-DD') ||
              selectedDate ===
              moment()
                .subtract(1, 'days')
                .format('YYYY-MM-DD') ||
              selectedDate ===
              moment()
                .subtract(2, 'days')
                .format('YYYY-MM-DD')
              ? {}
              : { shadowColor: COLOR.DARKGREY, borderColor: COLOR.DARKGREY },
          ]}>
          <Text style={styles.boxText}>{strings.SleepTracker.sleep_scale}</Text>
          <View style={styles.slider}>
            <SliderUI
              setScale={setSleepScale}
              getScale={sleepScale}
              isEditUI={isEditUI}
            />
          </View>
        </View> */}

        {/* energy Scale UI */}
        {/* <View
          style={[
            styles.innerBox,
            selectedDate ===
              moment()
                .subtract(0, 'days')
                .format('YYYY-MM-DD') ||
              selectedDate ===
              moment()
                .subtract(1, 'days')
                .format('YYYY-MM-DD') ||
              selectedDate ===
              moment()
                .subtract(2, 'days')
                .format('YYYY-MM-DD')
              ? {}
              : { shadowColor: COLOR.DARKGREY, borderColor: COLOR.DARKGREY },
          ]}>
          <Text style={styles.boxText}>
            {strings.SleepTracker.energetic_scale}
          </Text>
          <View style={styles.slider}>
            <SliderUI
              setScale={setEnergeticScale}
              getScale={energeticScale}
              isEditUI={isEditUI}
            />
          </View>
        </View> */}

        {/* Button UI */}
        {selectedDate === moment().subtract(0, "days").format("YYYY-MM-DD") ||
        selectedDate === moment().subtract(1, "days").format("YYYY-MM-DD") ||
        selectedDate === moment().subtract(2, "days").format("YYYY-MM-DD") ? (
          <CustomButton
            text={strings.SleepTracker.add_tracking}
            // colors={['#6545B2', '#6545B2', '#6545B2']}
            colors={[DARK_GREEN, DARK_GREEN]}
            onBtnPress={() => onSaveSleepTracker()}
            buttonText={{ color: WHITE }}
          />
        ) : null}
      </View>

      <Text style={styles.subTitle}> {strings.SleepTracker.history}</Text>
      <View style={[styles.outerBox, { marginBottom: 40 }]}>
        <View style={styles.graphTitle}>
          <LineGraphUI
            xAxis={sleepHoursXaxis}
            yAxis={sleepHoursYaxis}
            label={
              PRODUCT_TYPE == "CU002"
                ? strings.SleepTracker.Sleep_hours_day_baby
                : strings.SleepTracker.Sleep_hours_day
            }
          />
        </View>
        {
          // PRODUCT_TYPE !== "CU002" &&
          <View style={styles.graphTitle}>
            <LineGraphUI
              xAxis={sleepHoursXaxis}
              yAxis={sleeQualityYaxis}
              label={
                PRODUCT_TYPE == "CU002"
                  ? strings.SleepTracker.Sleep_Quality_baby
                  : strings.SleepTracker.Sleep_Quality
              }
            />
          </View>
        }
        {
          // PRODUCT_TYPE !== "CU002" &&
          <View style={styles.graphTitle}>
            <LineGraphUI
              xAxis={sleepHoursXaxis}
              yAxis={sleepEnergyYaxis}
              label={
                PRODUCT_TYPE == "CU002"
                  ? strings.SleepTracker.Energy_weekly_baby
                  : strings.SleepTracker.Energy_weekly
              }
            />
          </View>
        }
      </View>
    </ScrollView>
  );
}
export default SleepTracker = React.memo(SleepTracker);

const styles = {
  wrapper: {
    flex: 1,
    // margin: RFValue(5)
  },
  dateWrapper: {
    marginTop: RFValue(10),
    shadowColor: DARK_GREEN,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.46,
    shadowRadius: 11.14,
    elevation: 17,
  },
  contentContainerStyle: {
    flexDirection: "row",
    alignSelf: "center",
    borderRadius: RFValue(5),
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: DARK_GREEN,
  },
  date: {
    fontSize: RFValue(15),
    fontWeight: "600",
    color: COLOR.SLEEP_HEADING,
    paddingHorizontal: RFValue(20),
    fontFamily: REGULAR,
  },
  subTitle: {
    marginTop: 20,
    marginBottom: 10,
    fontSize: RFValue(16),
    fontWeight: "bold",
    paddingHorizontal: RFValue(20),
  },
  outerBox: {
    // backgroundColor: COLOR.BOX_GRAY,
    borderRadius: 20,
    // padding: RFValue(10),
    //  marginTop: RFValue(10),
    marginBottom: 10,
    paddingHorizontal: RFValue(20),
    paddingBottom: RFValue(20),
  },
  innerBox: {
    backgroundColor: WHITE,
    padding: 20,
    // margin: 10,
    marginVertical: RFValue(7),
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1.2,
    borderColor: DARK_GREEN,
    shadowColor: DARK_GREEN,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.46,
    shadowRadius: 11.14,
    elevation: 17,
  },
  boxText: {
    color: "#57576D",
    fontWeight: "bold",
    fontSize: RFValue(16),
    textAlign: "center",
    fontFamily: REGULAR,
  },
  dateView: {
    paddingHorizontal: RFValue(7),
    paddingVertical: RFValue(3),
    //borderWidth: 1,
  },
  dayText: {
    fontSize: RFValue(13),
    fontWeight: "700",
    fontFamily: REGULAR,
  },
  monthText: {
    fontSize: RFValue(10.4),
    color: "#1C2037",
    fontWeight: "500",
    fontFamily: REGULAR,
  },
  dateViewStyle: {
    padding: RFValue(6),
    alignItems: "center",
    borderRadius: RFValue(5),
  },
  sleepHoursOuterView: {
    flex: 1,
    flexDirection: "row",
    marginTop: 10,
    alignItems: "center",
    paddingTop: RFValue(20),
    paddingBottom: RFValue(20),
  },
  sleepHrsView: {
    flex: 0.45,
    backgroundColor: "white",
    // paddingTop: RFValue(10),
    // paddingBottom: RFValue(10),
    // borderWidth: 1,
  },
  flStyles: {
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    //   borderWidth: 1,
  },
  timeTbStyle: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  colonStyle: {
    flex: 0.1,
    marginLeft: 20,
    marginRight: 20,
    alignItems: "center",
  },
  btnStyle: {
    backgroundColor: COLOR.BUTTON_ORANGE,
    alignItems: "center",
    padding: 15,
    width: Dimensions.get("window").width / 1.2,
    alignSelf: "center",
    borderRadius: 10,
    marginTop: 20,
  },
  graphOuterView: {
    alignSelf: "center",
  },
  graphTitle: {
    marginTop: 10,
  },
  slider: {
    marginTop: RFValue(30),
    width: RFValue(250),
    marginBottom: RFValue(20),
  },
  timeText: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: RFValue(27),
    fontWeight: "bold",
    fontFamily: REGULAR,
    //border: 1,
  },
  arrow: { color: "#C4C4CB", fontSize: RFValue(16) },
  sliderValue: {
    textAlign: "right",
    fontSize: RFValue(20),
    fontWeight: "bold",
    fontFamily: REGULAR,
    color: "#1C2037",
  },
  graphTitle: {
    fontSize: RFValue(18),
    textAlign: "left",
    marginTop: 15,
    fontWeight: "bold",
    fontFamily: REGULAR,
  },
};
