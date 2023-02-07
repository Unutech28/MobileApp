import NoData from "@components/common/NoData";
import Loader from "@components/common/screenLoader";
import GLOBALS from "@constants";
import * as ICONS from "@images";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
  RefreshControl,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  TextInput,
  NativeModules,
  StatusBarIOS,
  Dimensions,
} from "react-native";
const { StatusBarManager } = NativeModules;
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import ButtonBlue from "@components/common/buttonBlue";
import ButtonGreen from "@components/common/buttonGreen";
import ButtonOrange from "@components/common/buttonOrange";
//import Hyperlink from 'react-native-hyperlink'
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import moment, { min } from "moment";
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from "react-native-chart-kit";
import IconBadge from "react-native-icon-badge";
const isiOS = Platform.OS == "ios";
const { FONTS, COLOR, STRINGS } = GLOBALS;

const chartConfig = {
  backgroundColor: COLOR.PRIMARY1,
  backgroundGradientFrom: COLOR.PRIMARY1,
  backgroundGradientTo: COLOR.PRIMARY,
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
  // propsForBackgroundLines: {
  //   strokeDasharray: "" // solid background lines with no dashes
  // }
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
  // fillShadowGradientOpacity: 0.5,
  // propsForBackgroundLines: {
  //   strokeDasharray: "" // solid background lines with no dashes
  // }
};

const data = {
  labels: ["Test1", "Test2"],
  legend: ["L1", "L2", "L3"],
  data: [
    [60, 60, 60],
    [30, 30, 60],
  ],
  barColors: ["#dfe4ea", "#ced6e0", "#a4b0be"],
};

const ExpandabledView = ({ item, index, onExpandClick }) => {
  const { title, isExpanded } = item;
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View style={styles.expandableVw}>
        <Text
          style={[styles.blackText, isExpanded ? { color: "white" } : null]}
        >
          {item.title}
        </Text>
        <TouchableOpacity
          style={styles.plusBtn}
          onPress={() =>
            // expandBtnClicked(index)
            onExpandClick(index)
          }
        >
          <Text
            style={[styles.blackText, isExpanded ? { color: "white" } : null]}
          >
            {isExpanded ? "X" : "+"}
          </Text>
        </TouchableOpacity>
      </View>
      {isExpanded ? (
        <Text
          style={[styles.blackText, { marginTop: RFValue(20), color: "white" }]}
        >
          Motherhood should be full of bliss and joy. Many women struggle with
          experiencing joy and bonding within the first one month. Many new
          mothers have high expectation and are set in their ways. There is no
          such thing as "perfect motherhood" So, it is important to be flexible.
          Worry and rumination specially seen few weeks prior to delivery and
          postdelivery. Example, worry about lactation, caring of newborn.
        </Text>
      ) : null}
    </View>
  );
};

function CommonStruggles(props) {
  let {
    data,
    expandBtnClicked,
    isRefreshingAppointmentList,
    onRefreshAppointmentList,
    submitInputData,
    moodData,
    getWeeklySummaryReportData,
  } = props;

  const [isContact, setContact] = useState(true);
  const [isTextInputValue, setTextInputValue] = useState(true);
  const [isExpandedHook, setExpandedValue] = useState();
  const [refresh, setRefresh] = useState(false, "");
  const [statusBarHeight, setstatusBarHeight] = useState("", "");
  let sleepHoursArray = [];
  let sleepXAxis = [];
  let moodYAxis = [];
  let moodXAxis = [];

  let allMoodYAxis = [];
  let allMoodXAxis = [];

  let activityYAxis = [];
  let activityXAxis = [];
  let stackBarData = {
    labels: ["Test1", "Test2"],
    legend: ["L1", "L2", "L3"],
    data: [
      [60, 60, 60],
      [30, 30, 60],
    ],
    barColors: [COLOR.PRIMARY1, COLOR.PRIMARY, COLOR.TEXT_ORANGE],
  };

  if (Platform.OS === "ios") {
    StatusBarManager.getHeight((statusBarFrameData) => {
      setstatusBarHeight(statusBarFrameData.height);
    });
    // StatusBarIOS.addListener('statusBarFrameWillChange', (statusBarData) => {
    //   setstatusBarHeight(statusBarData.frame.height)
    // });
  }

  onExpandClick = (index, item) => {
    data.expandableContents.forEach((element) => {
      if (element._id == item._id) {
        element.isExpanded = true;
      } else {
        element.isExpanded = false;
      }
    });
    setRefresh(!refresh);
  };

  onCrossClick = (index, item) => {
    data.expandableContents.forEach((element) => {
      if (element._id == item._id) {
        element.isExpanded = false;
      }
    });
    setRefresh(!refresh);
  };

  const onQuesTextAnswerChange = (text, item) => {
    setTextInputValue(false);
    if (data.questions && data.questions.length) {
      data.questions.forEach((element) => {
        if (element._id == item._id) {
          element.answer = text;
          // element.value = null
        }
      });
    }
    setRefresh(!refresh);
  };
  const onTextAnswerChange = (text, item) => {
    data.textInputs.forEach((element) => {
      if (element._id == item._id) {
        element.answer = text;
        element.value = null;
      }
    });
    setRefresh(!refresh);
  };

  if (getWeeklySummaryReportData !== undefined) {
    getWeeklySummaryReportData.getactvityresponselistdata.forEach((element) => {
      if (element.title == "Walk") {
        element.count = 2;
      } else if (element.title == "Exercise") {
        element.count = 1;
      } else if (element.title == "Friends") {
        element.count = 1;
      } else if (element.title == "Shopping") {
        element.count = 1;
      } else if (element.title == "Bathing") {
        element.count = 1;
      } else if (element.title == "Dressing") {
        element.count = 5;
      } else if (element.title == "Toileting") {
        element.count = 5;
      } else if (element.title == "Eating") {
        element.count = 3;
      } else {
        element.count = 1;
      }
    });

    getWeeklySummaryReportData.sleeptrackerdata.forEach((element) => {
      sleepHoursArray.push(Number(element.hours));
      let sleepDate = moment(element.sleepdate).format("MM/DD");
      sleepXAxis.push(sleepDate);
    });

    getWeeklySummaryReportData.mooddataavg.forEach((element) => {
      moodYAxis.push(Number(element.moodavg));
      moodXAxis.push(moment(element.date).format("MM/DD"));
      // allMoodYAxis
    });
    getWeeklySummaryReportData.moodtrackerdata.forEach((element) => {
      allMoodYAxis.push(Number(element.mood));
      allMoodXAxis.push(moment(element.date).format("MM/DD"));
      // allMoodYAxis
    });
    getWeeklySummaryReportData.moodcount.forEach((element) => {
      moodData.forEach((e) => {
        if (e.id == element._id) {
          e.moodCountValue = element.moodcount;
        }
      });
    });
    getWeeklySummaryReportData.activitytackercount.forEach((element) => {
      activityYAxis.push(Number(element.activitiescount));
      activityXAxis.push(moment(element.createdAt).format("MM/DD"));
    });
  }

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        showsVerticalScrollIndicator={false}
      >
        <View>
          {data.title !== "" ? (
            <Text style={styles.blackBoldText}>{data.title}</Text>
          ) : null}
          {data.image ? (
            <Image
              // source={{ uri: GLOBALS.IMAGE_BASE_URL + data.image }}
              source={{ uri: data.image }}
              resizeMode="contain"
              style={{
                marginTop: 25,
                marginBottom: 40,
                alignSelf: "center",
                width: RFPercentage(40),
                height: RFPercentage(30),
                borderRadius: RFValue(10),
                borderColor: "transparant",
              }}
            />
          ) : null}

          {data.hasExpandable ? (
            <FlatList
              data={data.expandableContents}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => `${item._id}`}
              extraData={refresh}
              renderItem={({ item, index }) => (
                <View
                  style={{
                    flex: 1,
                    backgroundColor: item.isExpanded ? COLOR.PRIMARY1 : "white",
                  }}
                >
                  <View style={[styles.expandableVw]}>
                    <Text
                      style={[
                        styles.blackText,
                        item.isExpanded
                          ? { color: "white" }
                          : { color: COLOR.BLACK },
                      ]}
                    >
                      {item.title}
                    </Text>
                    <View style={{ alignSelf: "center", padding: 5 }}>
                      {item.isExpanded ? (
                        <TouchableOpacity
                          style={styles.plusBtn}
                          onPress={() => onCrossClick(index, item)}
                        >
                          <Text style={[styles.blackText, { color: "white" }]}>
                            {"X"}
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          style={styles.plusBtn}
                          onPress={() => onExpandClick(index, item)}
                        >
                          <Text
                            style={[
                              styles.blackText,
                              { fontSize: RFValue(20) },
                            ]}
                          >
                            {"+"}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                  {item.isExpanded ? (
                    <Text
                      style={[
                        styles.blackText,
                        {
                          marginTop: RFValue(20),
                          color: COLOR.WHITE,
                          padding: 10,
                        },
                      ]}
                    >
                      {item.description}
                    </Text>
                  ) : null}
                </View>
              )}
            />
          ) : null}

          <View style={{ marginTop: 20 }}>
            {data.description !== null ? (
              <Text
                style={{
                  fontSize: RFValue(16),
                  fontFamily: FONTS.CIRCULAR_MEDIUM,
                  color: COLOR.BLACK,
                  marginBottom: RFValue(10),
                }}
              >
                {data.description}
              </Text>
            ) : null}
          </View>

          {data.questions !== undefined && data.questions.length > 0 ? (
            <FlatList
              data={data.questions}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => `${item._id}`}
              listKey={(index) => "c" + index.toString()}
              extraData={refresh}
              renderItem={({ item, index }) =>
                item.ansType == "textarea" ? (
                  <View style={{ marginVertical: RFValue(10), padding: 8 }}>
                    <Text>{item.question}</Text>
                    <TextInput
                      style={styles.queTextInputStyle}
                      value={
                        item.answer != undefined
                          ? item.answer.answer != undefined
                            ? item.answer.answer
                            : item.answer
                          : ""
                      }
                      maxLength={2000}
                      multiline={true}
                      underlineColorAndroid={"transparent"}
                      onChangeText={(text) =>
                        onQuesTextAnswerChange(text, item)
                      }
                    />
                  </View>
                ) : null
              }
            />
          ) : null}

          {data.textInputs != undefined ? (
            <FlatList
              data={data.textInputs}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => `${item._id}`}
              listKey={(index) => "A" + index.toString()}
              extraData={refresh}
              renderItem={({ item, index }) => (
                <View
                  style={{
                    flex: 1,
                    marginVertical: RFValue(10),
                    borderBottomColor: "#DADADA",
                    borderBottomWidth: 1.0,
                    flexDirection: "row",
                    padding: 8,
                  }}
                >
                  <Text>{item.name}</Text>
                  <TextInput
                    style={{
                      paddingLeft: 10,
                      flex: 1,
                      color: "dark" ? "black" : "black",
                    }}
                    value={
                      item.value != undefined
                        ? item.value.answer
                        : item.answer != undefined
                        ? item.answer
                        : ""
                    }
                    maxLength={50}
                    underlineColorAndroid={"transparent"}
                    onChangeText={(text) => onTextAnswerChange(text, item)}
                  />
                </View>
              )}
            />
          ) : null}

          {data.listType != undefined &&
          data.listType == "vertical-list" &&
          data.listData != undefined &&
          data.listData.length > 0 ? (
            <FlatList
              contentContainerStyle={{ flex: 1 }}
              data={data.listData}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => `${item._id}`}
              listKey={(index) => "J" + index.toString()}
              style={{ width: "100%" }}
              renderItem={({ item, index }) => (
                <View style={{ margin: RFValue(10) }}>
                  <Text style={styles.listBlackText}>{item.name}</Text>
                  <Text style={styles.listDescriptionText}>
                    {item.description}
                  </Text>
                </View>
              )}
            />
          ) : null}

          {(data.textInputs !== undefined && data.textInputs.length > 0) ||
          (data.questions !== undefined && data.questions.length > 0) ? (
            <ButtonGreen
              text="SUBMIT"
              onBtnPress={() => submitInputData(data)}
            />
          ) : null}
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOR.BACKGROUND,
    flexGrow: 1,
  },
  scene: {
    flex: 1,
    padding: "",
  },
  expandableVw: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // backgroundColor: 'red',
    margin: 10,
  },
  plusBtn: {
    width: RFValue(20),
    height: RFValue(20),
    justifyContent: "center",
    alignItems: "center",
  },
  blackBoldText: {
    fontSize: RFValue(22),
    fontFamily: FONTS.CIRCULAR_BOLD,
    color: COLOR.BLACK,
    marginTop: RFValue(20),
    // backgroundColor: 'red'
  },
  blackText: {
    fontSize: RFValue(16),
    fontFamily: FONTS.CIRCULAR_MEDIUM,
    color: COLOR.BLACK,
    // backgroundColor: 'red'
  },
  listBlackText: {
    fontSize: RFValue(18),
    fontFamily: FONTS.CIRCULAR_MEDIUM,
    color: COLOR.WHITE,
    backgroundColor: COLOR.PRIMARY1,
    padding: RFValue(10),
  },
  listDescriptionText: {
    fontSize: RFValue(15),
    fontFamily: FONTS.CIRCULAR_MEDIUM,
    color: COLOR.BLACK,
    paddingTop: RFValue(10),
    backgroundColor: "#C2DDF2",
    padding: RFValue(10),
  },
  graphText: {
    fontSize: RFValue(16),
    fontFamily: FONTS.CIRCULAR,
    color: COLOR.BLACK,
    marginTop: RFValue(10),
    marginBottom: RFValue(10),
    // backgroundColor: 'red'
  },
  queTextInputStyle: {
    marginTop: 10,
    paddingLeft: 10,
    color: "dark" ? "black" : "black",
    borderColor: "gray",
    borderWidth: 1,
    height: RFValue(60),
  },
});
export default CommonStruggles = React.memo(CommonStruggles);
