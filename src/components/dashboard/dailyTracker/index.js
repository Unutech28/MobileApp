// @ts-nocheck
import Button from "@components/common/button";
import GLOBALS from "@constants";
import * as Images from "@images";
import moment from "moment";
import React, { useCallback, useState, useEffect, lazy } from "react";
const Header = lazy(() => import("@components/common/Header"));
import {
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  FlatList,
  View,
  RefreshControl,
  Image,
  TouchableOpacity,
} from "react-native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import Icon from "react-native-vector-icons/FontAwesome";
import MaterailIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { CalendarList, LocaleConfig } from "react-native-calendars";
import * as ImgIcons from "@images";
import CardView from "@components/dashboard/symptoms/cardView";
import NoData from "@components/common/NoData";
import Loader from "@components/common/screenLoader";
import BottomUp from "@components/common/BottomUp";

LocaleConfig.defaultLocale = "en";
const isiOS = Platform.OS == "ios";
const { FONTS, COLOR, STRINGS } = GLOBALS;
// const { TAKEDOSE, BOOK_APPT, VIDEOCALL, CONTACTS, MYLIST, WHOLE_TEAM, } = STRINGS;
const {
  GREEN,
  CINNABAR,
  WHITE,
  BLACK,
  CALENDAR_DISABLE,
  TEXT_ORANGE,
  PRIMARY,
  GREY,
  TABLET,
  BORDER_LIGHT,
  DARKGREY,
  TRANSPARENT,
  SHADOW,
  DARK_GREEN,
} = COLOR;
const { LIGHT, REGULAR } = FONTS;

const width = Dimensions.get("window").width - RFPercentage(6);
const getMaxDate = (d) => {
  var fm = moment(d).add(3, "M");
  var fmEnd = moment(fm).endOf("month");
  var newDate =
    d.date() != fm.date() && fm.isSame(fmEnd.format("YYYY-MM-DD"))
      ? fm.add(1, "d")
      : fm;
  return moment(newDate).endOf("month").format("YYYY-MM-DD");
};
const maxDate = getMaxDate(moment());

const calendarTheme = {
  backgroundColor: WHITE,
  calendarBackground: WHITE,
  monthTextColor: BLACK,
  textDayFontFamily: REGULAR,
  textMonthFontFamily: REGULAR,
  textDayHeaderFontFamily: REGULAR,
  textDayFontSize: RFValue(16),
  textMonthFontSize: RFValue(19),
  textDayHeaderFontSize: RFValue(17),
};

const ShowDetails = ({ array = undefined, dateString = null }) => {
  if (array && dateString) {
    return array
      ? array
          .filter((data) => data.date != undefined && data.date == dateString)
          .map((item, index) => <CardView item={item} id={index} />)
      : null;
  } else {
    return null;
  }
};
const MCQ = (props) => {
  let {
    mcqList,
    title,
    loader,
    setChecked = () => {},
    onCareConcernClick,
  } = props;
  return (
    <View>
      {loader ? (
        <Loader loaderColor={"#000"} />
      ) : (
        mcqList?.length > 0 && (
          <View>
            <Text
              style={{
                fontSize: RFValue(18),
                fontFamily: REGULAR,
                marginBottom: RFPercentage(2.2),
              }}
            >
              {title}
            </Text>
            <FlatList
              contentContainerStyle={{
                flexGrow: 1,
                marginBottom: RFPercentage(2.2),
              }}
              data={mcqList}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => `${item._id}`}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  onPress={() => onCareConcernClick(item, index)}
                  style={styles.rowContainer}
                >
                  <View
                    style={[
                      styles.greenContainer,
                      { backgroundColor: DARK_GREEN },
                    ]}
                  />
                  <Text style={styles.textStyle}>{item.name}</Text>

                  <Image
                    source={Images.darkForward}
                    resizeMode="contain"
                    style={styles.arrowImage}
                  />
                </TouchableOpacity>
                // <TouchableWithoutFeedback
                //   onPress={() => onCareConcernClick(item, index)}
                // >
                //   <View style={legendStyle.mainView} key={index}>
                //     <Text style={[legendStyle.title]}>{item.title}</Text>
                //     <Image
                //       source={ImgIcons.Forward}
                //       resizeMode="contain"
                //       style={{ width: RFValue(12), height: RFValue(12) }}
                //     />
                //   </View>
                // </TouchableWithoutFeedback>
              )}
              ListEmptyComponent={<NoData />}
            />
          </View>
        )
      )}
    </View>
  );
};

let getList = (userData, listKey, idKey) => {
  if (userData && userData["list"].length > 0 && userData["data"].length >= 0) {
    let newData = [...userData["list"][0][listKey]];
    let UserCheckedIds =
      userData["data"].length > 0 ? userData["data"][0][idKey] : null;
    newData = newData
      ? newData.map((item) => {
          let obj = Object.assign({}, item);
          obj.checked = false;
          if (UserCheckedIds && UserCheckedIds.includes(item["_id"])) {
            obj.checked = true;
          }
          return obj;
        })
      : null;
    return newData;
  }
  return null;
};

let getDateList = (array) => {
  const isArray = (d, listKey, dateKey) =>
    d && d[listKey] && d[listKey][dateKey].length > 0
      ? d[listKey][dateKey]
      : null;
  if (array) {
    let newArray = [];
    if (isArray(array, "free", "freeDate")) {
      let tmp = isArray(array, "free", "freeDate").map((item) => {
        return { date: moment(item).format("YYYY-MM-DD"), color: GREY };
      });
      newArray.push(...tmp);
    }
    if (isArray(array, "symptomFree", "symptomFreeDate")) {
      let tmp = isArray(array, "symptomFree", "symptomFreeDate").map((item) => {
        return { date: moment(item).format("YYYY-MM-DD"), color: GREEN };
      });
      newArray.push(...tmp);
    }
    if (isArray(array, "low", "lowRiskDate")) {
      let tmp = isArray(array, "low", "lowRiskDate").map((item) => {
        return { date: moment(item).format("YYYY-MM-DD"), color: PRIMARY };
      });
      newArray.push(...tmp);
    }
    if (isArray(array, "medium", "mediumRiskDate")) {
      let tmp = isArray(array, "medium", "mediumRiskDate").map((item) => {
        return { date: moment(item).format("YYYY-MM-DD"), color: TEXT_ORANGE };
      });
      newArray.push(...tmp);
    }
    if (isArray(array, "high", "highRiskDate")) {
      let tmp = isArray(array, "high", "highRiskDate").map((item) => {
        return { date: moment(item).format("YYYY-MM-DD"), color: CINNABAR };
      });
      newArray.push(...tmp);
    }
    if (newArray.length > 0) {
    } else {
      newArray = null;
    }
    return newArray;
  }
  return null;
};

const getCheckedItem = (d = []) => {
  return d.filter((item) => item.checked).map((item) => item["_id"]);
};
const isValidInput = (arr1, arr2) => {
  return (
    arr1 &&
    // arr2 &&
    arr1.filter((item) => item.checked).length > 0
    // &&
    // arr2.filter(item => item.checked).length > 0
  );
};
function DailyTracker(props) {
  let {
    appointmentData,
    appointmentLoading,
    onPressGetMCQ,
    isRefreshingAppointmentList,
    onRefreshAppointmentList,
    addSymptom,
    symptomsMCQ: {
      GetAllSymptomsData,
      isGetAllSymptomsLoading,
      isPostSymptomLoading,
      loginData,
      activeProgramsDetails,
    },
    onRefreshLegend,
    onCareConcernClick,
    onRefresh,
  } = props;

  const timeStamp = moment().format();
  const currentDate = moment(timeStamp).format("YYYY-MM-DD");
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [symptomChecked, setSymptomChecked] = useState(null);
  const [sideEffectChecked, setSideEffectChecked] = useState(null);
  const [showModal, setshowModal] = useState(false);
  const [careConcernList, setCareConcernList] = useState(
    activeProgramsDetails?.careConcernsName
  );
  useEffect(() => {
    setSymptomChecked(
      getList(GetAllSymptomsData, "symptomsList", "symptoms_id")
    );
    setSideEffectChecked(
      getList(GetAllSymptomsData, "sideeffectList", "sideeffect_id")
    );
    console.log("=====>careConcern", careConcernList);
  }, [GetAllSymptomsData]);

  appointmentData =
    appointmentData && appointmentData.length > 0 ? appointmentData : undefined;

  let changeChecked = useCallback((idx, arrayList, setData) => {
    let items = JSON.parse(JSON.stringify(arrayList));
    items = items.map((e) => {
      let o = Object.assign({}, e);
      if (o["_id"] == idx) {
        o.checked = !o.checked;
      }
      return o;
    });
    setData(items);
  }, []);

  return (
    <View style={{ flexGrow: 1 }}>
      {appointmentLoading ? (
        <Loader loaderColor={"#000"} />
      ) : (
        <View style={{ flexGrow: 1 }}>
          <ScrollView
            showsVerticalScrollIndicator={true}
            refreshControl={
              <RefreshControl
                refreshing={false}
                onRefresh={
                  () => onRefresh()
                  // selectedDate !== currentDate && setSelectedDate(currentDate),
                  // onRefreshAppointmentList(),
                  // onRefreshLegend(),
                  // onPressGetMCQ()
                }
              />
            }
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
          >
            <View>
              <View>
                {selectedDate && (
                  <View>
                    <MCQ
                      loader={isGetAllSymptomsLoading}
                      // title={'Are you having any symptoms?'}
                      mcqList={careConcernList}
                      setChecked={(idx) =>
                        changeChecked(idx, symptomChecked, setSymptomChecked)
                      }
                      onCareConcernClick={onCareConcernClick}
                    />
                    {isValidInput(symptomChecked, sideEffectChecked) && (
                      <Button
                        text={"SAVE"}
                        loader={isPostSymptomLoading}
                        onBtnPress={() => {
                          addSymptom({
                            date: selectedDate,
                            responseid: [
                              ...getCheckedItem(symptomChecked),
                              ...getCheckedItem(sideEffectChecked),
                            ],
                          });
                        }}
                      />
                    )}
                  </View>
                )}
              </View>
            </View>
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const legendStyle = StyleSheet.create({
  iconSize: 23,
  flexRow: { flexDirection: "row" },
  mainView: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "white",
    shadowColor: COLOR.SHADOW,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    padding: RFValue(10),
    elevation: 5,
    borderRadius: RFValue(8),
    marginBottom: RFValue(8),
  },
  center: { justifyContent: "center" },
  icon: { alignSelf: "center", marginRight: RFPercentage(1) },
  title: { fontSize: RFValue(14), alignSelf: "center", fontFamily: LIGHT },
});
const styles = StyleSheet.create({
  container: {
    // backgroundColor: COLOR.BACKGROUND,
    // marginHorizontal: RFPercentage(0),
    // paddingHorizontal: RFPercentage(0.5),
    flexGrow: 1.2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "white",
    marginBottom: RFPercentage(isiOS ? 1.5 : 2),
    borderRadius: RFPercentage(1.8),
    shadowColor: COLOR.SHADOW,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.6,
    shadowRadius: 1,
    padding: 1,
    elevation: 5,
  },
  section: {
    flex: 1,
    height: RFPercentage(isiOS ? 11 : 12.2),
    overflow: "hidden",
    backgroundColor: "transparent",
  },
  capTitle: {
    justifyContent: "center",
    flex: 1,
    paddingHorizontal: 0,
    overflow: "hidden",
  },
  capImage: {
    height: RFPercentage(7),
    width: RFPercentage(7),
    alignSelf: "center",
  },
  capTitleText: {
    fontFamily: FONTS.REGULAR,
    fontSize: RFValue(20),
    color: COLOR.DARKGREY,
    justifyContent: "center",
  },
  details: {
    flex: 1,
    paddingHorizontal: 0,
    overflow: "hidden",
  },
  detailsText: {
    fontFamily: FONTS.LIGHT,
    fontSize: RFValue(isiOS ? 16 : 17),
    color: COLOR.GREY,
  },
  shiftStyle: {
    fontFamily: FONTS.REGULAR,
    fontSize: RFValue(20),
    color: COLOR.DARKGREY,
    justifyContent: "center",
    marginTop: RFPercentage(isiOS ? 2 : 2),
    marginBottom: RFPercentage(isiOS ? 1.2 : 2),
  },
  check: {
    height: RFPercentage(5),
    width: RFPercentage(5),
    alignSelf: "center",
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: RFPercentage(1),
  },
  timeIconContainer: { flexDirection: "row", marginHorizontal: 10 },
  timeIcon: { alignSelf: "center", justifyContent: "center" },
  timeDisplay: {
    fontSize: RFValue(15),
    justifyContent: "flex-end",
    alignSelf: "center",
  },
  tab: {
    borderBottomWidth: 0,
    paddingHorizontal: 5,
    overflow: "hidden",
    flexDirection: "row",
  },
  horizontalRule: {
    borderBottomColor: "transparent",
    borderBottomWidth: 1,
    marginHorizontal: RFPercentage(1),
    marginTop: RFPercentage(1),
  },
  tabTitle: {
    alignSelf: "center",
    fontFamily: FONTS.LIGHT,
    fontSize: RFValue(14),
  },
  timePickerTitle: {
    alignSelf: "center",
    fontFamily: FONTS.LIGHT,
    fontSize: RFValue(15),
    marginRight: RFPercentage(1),
  },
  tabContainer: {
    flexDirection: "row",
    height: RFPercentage(4),
    justifyContent: "flex-start",
    marginBottom: RFPercentage(3),
    marginTop: RFPercentage(0),
  },
  calendarDay: {
    textAlign: "center",
    borderWidth: 1.5,
    borderRadius: 10,
    padding: 0,
    width: RFPercentage(5),
    height: RFPercentage(5),
    padding: RFPercentage(5 / 10),
    borderRadius: RFPercentage(5 / 2),
    fontFamily: REGULAR,
    fontSize: RFValue(17),
    alignItems: "center",
    alignSelf: "center",
  },
  calendarContainer: {
    width,
    // overflow: 'hidden',
    borderRadius: RFPercentage(2),
    borderWidth: 1,
    borderColor: "transparent",
    elevation: 4,
    marginBottom: RFPercentage(2.5),
    shadowColor: "green",
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
  },

  /**Vide CSS */
  rowContainer: {
    borderWidth: 0.5,
    flexDirection: "row",
    marginTop: RFPercentage(1.2),
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: RFValue(7),
    borderColor: GREY,
    overflow: "hidden",
    backgroundColor: COLOR.WHITE,
  },
  greenContainer: {
    height: RFValue(65),
    width: RFValue(90),
    overflow: "hidden",
  },
  textStyle: {
    alignSelf: "center",
    paddingLeft: RFValue(13),
    fontFamily: FONTS.MEDIUM,
    fontSize: RFValue(isiOS ? RFValue(13) : RFValue(16)),
    color: COLOR.LIGHT_BLACK,
    fontWeight: "500",
    flex: 0.8,
  },
  arrowImage: { alignSelf: "center", flex: 0.2 },
});

export default DailyTracker = React.memo(DailyTracker);
