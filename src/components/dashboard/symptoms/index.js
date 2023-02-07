// @ts-nocheck
import Button from "@components/common/button";
import GLOBALS from "@constants";
import * as ICONS from "@images";
import moment from "moment";
import React, { useCallback, useState, useEffect } from "react";
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
} from "react-native";
import { decode as atob, encode as btoa } from "base-64";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import Icon from "react-native-vector-icons/FontAwesome";
import MaterailIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { CalendarList, LocaleConfig } from "react-native-calendars";
import * as ImgIcons from "@images";
import CardView from "@components/dashboard/symptoms/cardView";
import NoData from "@components/common/NoData";
import Loader from "@components/common/screenLoader";
import BottomUp from "@components/common/BottomUp";
import { strings } from "@localization";

LocaleConfig.locales["en"] = {
  monthNames: [
    "January",
    "Febraury",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  monthNamesShort: [
    "Jan ",
    "Feb ",
    "Mar ",
    "Apr ",
    "May ",
    "Jun ",
    "Jul ",
    "Aug ",
    "Sept ",
    "Oct ",
    "Nov ",
    "Dec ",
  ],
  dayNames: ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"],
  dayNamesShort: ["S", "M", "T", "W", "T", "F", "S"],
  today: "Today",
};
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
  return moment(newDate)
    .endOf("month")
    .format("YYYY-MM-DD");
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

let moodList = [
  {
    id: 0,
    image: ICONS.VeryHappy,
    activeImage: ICONS.VeryHappyActive,
    isClickTrue: false,
  },
  {
    id: 1,
    image: ICONS.Happy,
    activeImage: ICONS.HappyActive,
    isClickTrue: false,
  },
  {
    id: 2,
    image: ICONS.Confused,
    activeImage: ICONS.ConfusedActive,
    isClickTrue: true,
  },
  { id: 3, image: ICONS.Sad, activeImage: ICONS.SadActive, isClickTrue: false },
  {
    id: 4,
    image: ICONS.Angry,
    activeImage: ICONS.AngryActive,
    isClickTrue: false,
  },
];

Legends = React.memo(() => {
  return (
    <View>
      <View style={legendStyle.flexRow}>
        <View style={legendStyle.center}>
          <View style={legendStyle.flexRow}>
            <Icon
              name="circle"
              size={legendStyle.iconSize}
              color={GREEN}
              style={legendStyle.icon}
            />
            <Text style={legendStyle.title}>
              {strings.Schedule.SymptomsFreeDay2}
            </Text>
          </View>
          <View style={legendStyle.flexRow}>
            <Icon
              name="circle"
              size={legendStyle.iconSize}
              color={PRIMARY}
              style={legendStyle.icon}
            />
            <Text style={legendStyle.title}>
              {strings.Schedule.Mildcanfunction12}
            </Text>
          </View>
          <View style={legendStyle.flexRow}>
            <Icon
              name="circle"
              size={legendStyle.iconSize}
              color={TEXT_ORANGE}
              style={legendStyle.icon}
            />
            <Text style={legendStyle.title}>
              {strings.Schedule.Moderateslowed3}
            </Text>
          </View>
          <View style={legendStyle.flexRow}>
            <Icon
              name="circle"
              size={legendStyle.iconSize}
              color={GREY}
              style={legendStyle.icon}
            />
            <Text style={legendStyle.title}>{strings.Schedule.EmptyDays8}</Text>
          </View>
        </View>

        {/* <View style={[legendStyle.center, { paddingLeft: RFPercentage(2) }]}>
          <View style={legendStyle.flexRow}>
            <Icon
              name="circle"
              size={legendStyle.iconSize}
              color={TEXT_ORANGE}
              style={legendStyle.icon}
            />
            <Text style={legendStyle.title}>Moderate slowed (3 Days)</Text>
          </View>
          <View style={legendStyle.flexRow}>
            <Icon
              name="circle"
              size={legendStyle.iconSize}
              color={GREY}
              style={legendStyle.icon}
            />
            <Text style={legendStyle.title}>Empty Days (8 DAYS)</Text>
          </View>
        </View>
       */}
      </View>

      <View style={legendStyle.center}>
        <View style={legendStyle.flexRow}>
          <Icon
            name="circle"
            size={legendStyle.iconSize}
            color={TABLET}
            style={legendStyle.icon}
          />
          <Text style={legendStyle.title}>{strings.Schedule.Appointment}</Text>
        </View>
      </View>
      <View
        style={{
          height: 0.3,
          backgroundColor: BORDER_LIGHT,
          marginVertical: RFPercentage(2.2),
        }}
      />
    </View>
  );
});
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
  let { mcqList, title, loader, setChecked = () => {} } = props;
  return (
    <View>
      {loader ? (
        <Loader loaderColor={"#000"} />
      ) : (
        mcqList.length > 0 && (
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
                <TouchableWithoutFeedback onPress={() => setChecked(item._id)}>
                  <View style={legendStyle.flexRow} key={index}>
                    <MaterailIcon
                      name={item.checked ? "checkbox-marked" : "square"}
                      size={27}
                      color={item.checked ? GREEN : WHITE}
                      style={[legendStyle.icon, { width: RFPercentage(3) }]}
                    />
                    <Text style={[legendStyle.title]}>{item.title}</Text>
                  </View>
                </TouchableWithoutFeedback>
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
    arr2 &&
    arr1.filter((item) => item.checked).length > 0 &&
    arr2.filter((item) => item.checked).length > 0
  );
};
function Symptoms(props) {
  let {
    appointmentData,
    appointmentLoading,
    activeTab,
    onPressGetMCQ,
    isRefreshingAppointmentList,
    onRefreshAppointmentList,
    addSymptom,
    moodData,
    symptomsMCQ: {
      GetAllSymptomsData,
      isGetAllSymptomsLoading,
      isRefreshingSymptomsList,
      PostSymptomData,
      isPostSymptomLoading,
    },
    legendData: {
      isGetLegendSymptomSuccess,
      GetLegendSymptomData,
      isGetLegendSymptomLoading,
      isGetLegendSymptomRefreshing,
      isGetLegendSymptomFail,
    },
    onRefreshLegend,
  } = props;

  const timeStamp = moment().format();
  const currentDate = moment(timeStamp).format("YYYY-MM-DD");
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [showDetails, setshowDetails] = useState(false);
  const [symptomChecked, setSymptomChecked] = useState(null);
  const [sideEffectChecked, setSideEffectChecked] = useState(null);
  const [showModal, setshowModal] = useState(false);
  const [isMCQClick, setisMCQClick] = useState(false);
  const [isMonthChange, setisMonthChange] = useState(currentDate);
  const [legendList, setlegendList] = useState(null);
  const [isRefresh, setRefresh] = useState(false);
  const [moodId, setMoodId] = useState();

  useEffect(() => {
    setSymptomChecked(
      getList(GetAllSymptomsData, "symptomsList", "symptoms_id")
    );
    setSideEffectChecked(
      getList(GetAllSymptomsData, "sideeffectList", "sideeffect_id")
    );
  }, [GetAllSymptomsData]);


  let appointmentInfo = [];
  if (GetLegendSymptomData !== null) {
    if (
      GetLegendSymptomData.appointmentInfo !== undefined &&
      GetLegendSymptomData.appointmentInfo.length > 0
    ) {
      appointmentInfo = GetLegendSymptomData.appointmentInfo;
    }
  }

  useEffect(() => {
    setlegendList(getDateList(GetLegendSymptomData));
  }, [GetLegendSymptomData]);

  appointmentData =
    appointmentData && appointmentData.length > 0 ? appointmentData : undefined;

  let markedDate =
    Array.isArray(appointmentData) && appointmentData.length > 0
      ? appointmentData
          .filter((data) => data.date != undefined)
          .map((item) => item.date)
      : undefined;

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

  const _onDayPress = useCallback(
    (day) => {
      markedDate && markedDate.includes(day)
        ? showDetails != true && setshowDetails(true)
        : showDetails != false && setshowDetails(false);
      if (day == currentDate) {
        setSelectedDate(day);
        onPressGetMCQ(day);
      } else if (day == selectedDate) {
        setSelectedDate(null);
      } else if (day != selectedDate) {
        setSelectedDate(day), onPressGetMCQ(day);
      }
    },
    [selectedDate, showDetails]
  );

  const dayRender = React.memo(({ date, state }) => {
    let setColor = { borderColor: TRANSPARENT };
    if (new Date(currentDate) <= new Date(date.dateString)) {
      if (
        legendList &&
        legendList.length > 0 &&
        legendList.filter((item) => item.date == date.dateString).length > 0
      ) {
        let dateArray = legendList.filter(
          (item, index) => item.date == date.dateString
        );
        if (dateArray.length > 0) {
          let itemJson = Object.assign({}, ...dateArray);
          setColor = { borderColor: itemJson.color };
        }
      } else if (
        markedDate &&
        markedDate.includes(date.dateString) &&
        markedDate.includes(currentDate) == false
      ) {
        setColor = { borderColor: TABLET };
      } else if (selectedDate == date.dateString) {
        setColor = { borderColor: CINNABAR };
      } else if (currentDate == date.dateString) {
        setColor = { borderColor: TRANSPARENT };
      } else {
        setColor = { borderColor: TRANSPARENT };
      }
    }

    return (
      <TouchableWithoutFeedback
        key={date.dateString}
        onPress={() =>
          state !== "disabled" ? _onDayPress(date.dateString, state) : {}
        }
      >
        <View
          style={[
            styles.calendarDay,
            {
              backgroundColor:
                date.dateString == currentDate ? CINNABAR : TRANSPARENT,
              ...setColor,
            },
          ]}
        >
          <Text
            style={{
              fontFamily: REGULAR,
              color:
                state === "disabled"
                  ? CALENDAR_DISABLE
                  : date.dateString == currentDate
                  ? WHITE
                  : BLACK,
              fontSize: RFValue(17),
            }}
          >
            {date.day}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    );
  });
  onMoodClick = (id) => {
    setMoodId(id);

    moodData.forEach((element) => {
      if (element.id == id) {
        element.isClickTrue = true;
      } else {
        element.isClickTrue = false;
      }
    });
  };

  return (
    <View style={{ flexGrow: 1 }}>
      {appointmentLoading ? (
        <Loader loaderColor={"#000"} />
      ) : (
        <View style={{ flexGrow: 1 }}>
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={isRefreshingAppointmentList}
                onRefresh={() => (
                  selectedDate !== currentDate && setSelectedDate(currentDate),
                  onRefreshAppointmentList(),
                  onRefreshLegend(),
                  onPressGetMCQ()
                )}
              />
            }
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
          >
            {activeTab === "Schedule" && (
              <View style={{}}>
                <CalendarList
                  style={styles.calendarContainer}
                  calendarHeight={RFPercentage(isiOS ? 53 : 53 + 7)}
                  horizontal={true}
                  pagingEnabled={true}
                  calendarWidth={width}
                  markingType={"custom"}
                  markedDates={{}}
                  theme={calendarTheme}
                  dayComponent={dayRender}
                  current={currentDate}
                  minDate={currentDate}
                  maxDate={maxDate}
                  pastScrollRange={1}
                  futureScrollRange={3}
                  onDayLongPress={(day) => {}}
                  monthFormat={"MMM yyyy"}
                  hideArrows={true}
                  renderArrow={(direction) =>
                    direction === "left" ? (
                      <View>
                        <ICONS.RightArrow />
                      </View>
                    ) : (
                      <View>
                        <ICONS.RightArrow />
                      </View>
                    )
                  }
                  hideExtraDays={true}
                  firstDay={1}
                  onPressArrowLeft={(substractMonth) => substractMonth()}
                  onPressArrowRight={(addMonth) => addMonth()}
                  disableArrowLeft={false}
                  disableArrowRight={false}
                />
                <Legends />
                {showDetails && (
                  <ShowDetails
                    array={appointmentData}
                    dateString={selectedDate}
                  />
                )}
                <View>
                  {appointmentInfo !== undefined && appointmentInfo !== null ? (
                    <Text
                      style={{
                        fontSize: RFValue(18),
                        fontFamily: REGULAR,
                        marginBottom: RFPercentage(2.2),
                      }}
                    >
                      {strings.Schedule.Todaysappointment}
                    </Text>
                  ) : null}

                  {appointmentInfo !== undefined && appointmentInfo !== null ? (
                    <FlatList
                      contentContainerStyle={{
                        flexGrow: 1,
                        marginBottom: RFPercentage(2.2),
                      }}
                      data={appointmentInfo}
                      showsVerticalScrollIndicator={false}
                      showsHorizontalScrollIndicator={false}
                      keyExtractor={(item) => `${item._id}`}
                      extraData={isRefresh}
                      renderItem={({ item, index }) => (
                        <View
                          style={{
                            backgroundColor: "white",
                            marginBottom: RFPercentage(isiOS ? 1.5 : 2),
                            borderRadius: RFPercentage(1.8),
                            shadowColor: SHADOW,
                            shadowOffset: { width: 0, height: 5 },
                            shadowOpacity: 0.6,
                            shadowRadius: 1,
                            padding: RFValue(12),
                            elevation: 5,
                          }}
                          key={index}
                        >
                          <View style={[styles.capTitle]}>
                            {/* <Text style={styles.capTitleText}>
                                    Date : {moment(item.appointment_date).format('DD-MM-YYYY')}
                                  </Text> */}
                            <Text style={styles.capTitleText}>
                              {strings.Schedule.Time}{" "}
                              {moment(item.appointment_start_time).format(
                                "HH:MM a"
                              )}{" "}
                              -{" "}
                              {moment(item.appointment_end_time).format(
                                "HH:MM a"
                              )}
                            </Text>
                            <View style={styles.details}>
                              <Text style={styles.detailsText}>
                                {strings.Schedule.CareTaker}{" "}
                                {item.caretaker_name}
                              </Text>
                            </View>
                          </View>
                        </View>
                      )}
                      ListEmptyComponent={<NoData />}
                    />
                  ) : null}
                </View>
              </View>
            )}
          </ScrollView>
          <View style={bottomSheet.container}>
            <BottomUp
              showModal={showModal}
              RenderView={() => {
                return (
                  <View style={bottomSheet.viewContainer}>
                    <Image
                      source={ImgIcons.CheckLarge}
                      resizeMode="contain"
                      style={bottomSheet.img}
                    />
                    <Text style={bottomSheet.title}>
                      {strings.Schedule.Wegotthefeedback}
                    </Text>
                    <Text style={bottomSheet.subTitle}>
                      {strings.Schedule.text}
                    </Text>
                    <View style={bottomSheet.button}>
                      <Button
                        text={strings.Schedule.Gotomyplaylist}
                        onBtnPress={() => {
                          setshowModal(!showModal);
                          // onPressFeedback();
                        }}
                      />
                    </View>
                  </View>
                );
              }}
            />
          </View>
        </View>
      )}
    </View>
  );
}

const legendStyle = StyleSheet.create({
  iconSize: 23,
  flexRow: { flexDirection: "row", marginTop: RFValue(5) },
  center: { justifyContent: "center" },
  icon: { alignSelf: "center", marginRight: RFPercentage(1) },
  title: {
    fontSize: RFValue(14),
    alignSelf: "center",
    fontFamily: LIGHT,
    textAlign: "center",
  },
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
});
const bottomSheet = StyleSheet.create({
  container: { justifyContent: "flex-end", position: "relative" },
  viewContainer: {
    alignSelf: "center",
    marginTop: RFPercentage(4),
    marginHorizontal: RFPercentage(2),
  },
  img: {
    justifyContent: "flex-start",
    alignSelf: "center",
    height: RFPercentage(11.4),
    marginBottom: RFPercentage(3),
    width: RFPercentage(11.4),
  },
  title: {
    fontSize: RFValue(28),
    fontFamily: REGULAR,
    marginBottom: RFPercentage(0.5),
    color: DARKGREY,
  },
  subTitle: {
    fontSize: RFValue(19),
    fontFamily: LIGHT,
    marginBottom: RFPercentage(1.2),
    color: GREY,
  },
  button: { alignItems: "center" },

  apptView: {
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    backgroundColor: "white",
    marginBottom: RFPercentage(isiOS ? 1.5 : 2),
    borderRadius: RFPercentage(1.8),
    shadowColor: SHADOW,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.6,
    shadowRadius: 1,
    paddingVertical: RFValue(12),
    elevation: 5,
    // height: RFPercentage(isiOS ? 14 : 16),
  },
});
export default (Symptoms = React.memo(Symptoms));
