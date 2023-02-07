// @ts-nocheck
import Button from "@components/common/button";
import Loader from "@components/common/screenLoader";
import GLOBALS from "@constants";
import * as ICONS from "@images";
import { useSelector } from 'react-redux';

import moment from "moment";
import React, { useState, useCallback, useEffect } from "react";
import {
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  FlatList,
  Text,
  TouchableWithoutFeedback,
  View,
  TextInput,
  Image,
} from "react-native";
import { CalendarList, LocaleConfig, Calendar } from "react-native-calendars";
import DatePicker from "react-native-datepicker";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import MaterailIcon from "react-native-vector-icons/MaterialCommunityIcons";
import NoData from "@components/common/NoData";
import { strings } from '@localization';
import 'moment/locale/es';

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

LocaleConfig.locales["es"] = {
  monthNames: [
    "enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ],
  monthNamesShort: [
    "enero ",
    "feb.",
    "marzo",
    "abr.",
    "mayo",
    "jun.",
    "jul.",
    "agosto",
    "sept.",
    "oct.",
    "nov.",
    "dic.",
  ],
  dayNames: ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"],
  dayNamesShort: ["S", "L", "M", "C", "J", "V", "S"],
  today: "Este Dia",
};

// LocaleConfig.defaultLocale = "en";
// LocaleConfig.defaultLocale = language
const isiOS = Platform.OS == "ios";
const { FONTS, COLOR, STRINGS } = GLOBALS;
const {
  TAKEDOSE,
  BOOK_APPT,
  VIDEOCALL,
  CONTACTS,
  MYLIST,
  WHOLE_TEAM,
} = STRINGS;
const {
  GREEN,
  WHITE,
  BLACK,
  ERROR,
  CALENDAR_DISABLE,
  TEXT_ORANGE,
  TRANSPARENT,
  GREY,
  PRIMARY,
} = COLOR;
const { LIGHT, REGULAR } = FONTS;
const width = Dimensions.get("window").width - RFPercentage(4);

const getMaxDate = (d) => {
  var fm = moment(d).add(1, "M");
  var fmEnd = moment(fm).endOf("month");
  var newDate =
    d.date() != fm.date() && fm.isSame(fmEnd.format("YYYY-MM-DD"))
      ? fm.add(1, "d")
      : fm;
  return moment(newDate).format("YYYY-MM-DD");
};

const getMaxDateNew = (d) => {
  var fm = moment(d).add(1, "M");
  var fmEnd = moment(fm).endOf("month");
  return moment(fmEnd).format("YYYY-MM-DD");
};

const maxDate = getMaxDateNew(moment());
const getNewDate = (date = "1990-01-01", days = 0) => {
  return moment(date)
    .add(days, "d")
    .format("YYYY-MM-DD");
};
const calendarTheme = {
  backgroundColor: WHITE,
  calendarBackground: WHITE,
  arrowColor: "orange",
  disabledArrowColor: "#d9e1e8",
  monthTextColor: BLACK,
  textDayFontFamily: REGULAR,
  textMonthFontFamily: REGULAR,
  textDayHeaderFontFamily: REGULAR,
  textDayFontSize: RFValue(16),
  textMonthFontSize: RFValue(19),
  textDayHeaderFontSize: RFValue(17),
  arrowColor: "black",
  // selectedDayColor:"#7300e6",
  // selectedDayTextColor:"red",
  "stylesheet.calendar.header": {
    week: {
      marginTop: 5,
      flexDirection: "row",
      justifyContent: "space-between",
    },
  },
};

const MCQ = React.memo((props) => {
  let {
    mcqList,
    title,
    loader,
    setChecked = () => { },
    inputText,
    setInput,
  } = props;
  return (
    <View>
      {loader ? (
        <Loader loaderColor={"#000"} />
      ) : (
        mcqList &&
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
              renderItem={({ item, index }) => {
                return (
                  <View>
                    <TouchableWithoutFeedback
                      onPress={() => setChecked(item._id)}
                    >
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
                    {item.title == "Regular Appointment" && item.checked ? (
                      <TextInput
                        style={{
                          fontFamily: FONTS.LIGHT,
                          fontSize: RFValue(17),
                          borderBottomWidth: 0.4,
                          borderBottomColor: PRIMARY,
                          marginHorizontal: 10,
                          marginVertical: 10,
                          padding: 0,
                          backgroundColor: TRANSPARENT,
                        }}
                        value={inputText}
                        placeholderTextColor={GREY}
                        maxLength={100}
                        keyboardType="email-address"
                        underlineColorAndroid={"transparent"}
                        onChangeText={(text) => setInput(text)}
                        onSubmitEditing={() => { }}
                        placeholder={"Symptoms"}
                      />
                    ) : null}
                  </View>
                );
              }}
              ListEmptyComponent={<NoData />}
            />
          </View>
        )
      )}
    </View>
  );
});
let getList = (userData, userJson) => {
  let newData = userData;
  newData =
    newData && userJson
      ? newData
        .map((item) => {
          let obj = Object.assign({}, item);
          obj.checked = false;
          obj.isActive = false;
          if (obj.title == "Morning" && userJson.isMorning) {
            obj.isActive = true;
            obj.isMorning = true;
            obj.morningstarttime = userJson.morningstarttime;
            obj.morningendtime = userJson.morningendtime;
            obj.title = `${obj.title} - ${moment(
              userJson.morningstarttime
            ).format("hh:mm A")} to ${moment(userJson.morningendtime).format(
              "hh:mm A"
            )}`;
          } else if (obj.title == "Afternoon" && userJson.isAfternoon) {
            obj.isActive = true;
            obj.isAfternoon = true;
            obj.afternoonstarttime = userJson.afternoonstarttime;
            obj.afternoonendtime = userJson.afternoonendtime;
            obj.title = `${obj.title} - ${moment(
              userJson.afternoonstarttime
            ).format("hh:mm A")} to ${moment(
              userJson.afternoonendtime
            ).format("hh:mm A")}`;
          } else if (obj.title == "Evening" && userJson.isEvening) {
            obj.isActive = true;
            obj.isEvening = true;
            obj.eveningstarttime = userJson.eveningstarttime;
            obj.eveningendtime = userJson.eveningendtime;
            obj.title = `${obj.title} - ${moment(
              userJson.eveningstarttime
            ).format("hh:mm A")} to ${moment(userJson.eveningendtime).format(
              "hh:mm A"
            )}`;
          }

          return obj;
        })
        .filter((item) => item.isActive)
      : null;
  return newData;
};
const getTime = (time, selectedDate) => {
  let cDate = selectedDate,
    argsTime = moment(time, "hh:mm A");
  cDate = moment(cDate).set({
    hour: argsTime.get("hour"),
    minute: argsTime.get("minute"),
    second: 0,
  });
  return cDate.toISOString();
};
const validateForm = (items = null) => {
  return items && items.filter((item) => item.checked).length > 0;
};

const userData = {
  shift: [
    { checked: false, _id: 1, title: "Morning" },
    { checked: false, _id: 3, title: "Afternoon" },
    { checked: false, _id: 2, title: "Evening" },
  ],
  session: [
    {
      checked: false,
      _id: 1,
      title: "Regular Appointment",
      sessionType: "normal",
    },
    {
      checked: false,
      _id: 3,
      title: "1 on 1 Session",
      sessionType: "onetoone",
    },
    {
      checked: false,
      _id: 2,
      title: "Group Session",
      sessionType: "groupsession",
    },
  ],
};

function Schedule(props) {
  const timeStamp = moment().format();
  const currentDate = getNewDate(timeStamp, 5);
  const rangeMinDate = getNewDate(timeStamp, 1);
  const rangeMaxDate = getNewDate(timeStamp, 1 + 5);
  const currentHour = moment(timeStamp).format("hh:mm A");
  const nextHour = moment(timeStamp)
    .add(30, "m")
    .format("hh:mm A");
  const [startTime, setStartTime] = useState(currentHour);
  const [endTime, setEndTime] = useState(nextHour);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isValidTime, setisValidTime] = useState(true);
  const [rangeShift, setrangeShift] = useState(null);
  // const [_markedDates, setrangeShift] = useState(null);
  const [session, setSession] = useState(userData.session);
  const [feedInput, setFeedInput] = useState("");
  const isValidRange = validateForm(rangeShift);
  const isValidSession = validateForm(session);
  const { language } = useSelector(state => state.authReducer);
  LocaleConfig.defaultLocale = language
  // const [selectedDate, setSelectedDate] = useState('');

  let {
    bookScheduleProp: { isScheduleLoading },
    onPressBook,
    appointmentData,
    onDaySelect,
    _markedDates,
    selectedArray,
    hospitalData: {
      HospitalTimeData,
      isHospitalTimeRefreshing,
      isHospitalTimeLoading,
    },
  } = props;
  let length = Object.keys(selectedArray).length;
  appointmentData =
    Array.isArray(appointmentData) && appointmentData.length > 0
      ? appointmentData
      : undefined;
  useEffect(() => {
    setrangeShift(getList(userData.shift, HospitalTimeData));
  }, [HospitalTimeData]);

  // calcTime = () => { };

  const dayRender = ({ date, state }) => {
    let isValidRange =
      date.dateString >= rangeMinDate && rangeMaxDate > date.dateString;
    let rangeColor = isValidRange ? TEXT_ORANGE : TRANSPARENT;

    return (
      <View>
        <Text
          style={[
            styles.dayText,
            {
              color: isValidRange ? BLACK : CALENDAR_DISABLE,
              backgroundColor: rangeColor,
              borderColor: rangeColor,
            },
          ]}
        >
          {date.day}
        </Text>
      </View>
    );
  };

  let changeChecked = useCallback(
    (idx, arrayList, setData, isRadio = false) => {
      let items = JSON.parse(JSON.stringify(arrayList));
      items = items.map((e) => {
        let o = Object.assign({}, e);
        if (o["_id"] == idx) {
          o.checked = !o.checked;
        } else {
          if (isRadio) {
            o.checked = false;
          }
        }
        return o;
      });
      setData(items);
    },
    []
  );

  let submitForm = () => {
    let filteredData = [];
    if (rangeShift !== null) {
      filteredData = rangeShift.filter((item) => item.checked);
    } else {
      filteredData = [];
    }
    let sessionArr = session.filter((item) => item.checked);
    let range = Object.assign({}, ...filteredData);
    range = Object.assign(range, ...sessionArr);
    onPressBook({
      ...range,
      date: rangeMinDate,
      note: feedInput,
      starttime: rangeMinDate,
      endtime: rangeMaxDate,
      selectedDate: selectedArray,
    });
  };

  const _onDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View>
        {/* {isScheduleLoading ? (
          <Loader loaderColor={'#000'} />
        ) : ( */}
        <View>
          <CalendarList
            style={{
              width,
              overflow: "hidden",
              marginBottom: RFPercentage(2.2),
            }}
            calendarHeight={RFPercentage(isiOS ? 55 : 55 + 7)}
            horizontal={true}
            pagingEnabled={true}
            calendarWidth={width}
            markingType={"custom"}
            theme={calendarTheme}
            // dayComponent={dayRender}
            current={currentDate}
            minDate={currentDate}
            maxDate={maxDate}
            pastScrollRange={1}
            futureScrollRange={1}
            onDayLongPress={(day) => { }}
            markedDates={_markedDates}
            onDayPress={(day) => {
              onDaySelect(day);
            }}
            //  {moment(item.dates).locale(strings.APP_INFO.momentLanguage).format('MMM')}
            monthFormat={"MMM yyyy"}
            onMonthChange={(month) => { }}
            hideArrows={false}
            renderArrow={(direction) => {
              if (direction === "left") {
                return <Text>{strings.cards.previous}</Text>;
              } else {
                return <Text>{strings.mood.next}</Text>;
              }
            }}
            hideExtraDays={true}
            firstDay={1}
            onPressArrowLeft={(substractMonth) => substractMonth()}
            onPressArrowRight={(addMonth) => addMonth()}
            disableArrowLeft={false}
            disableArrowRight={false}
          />

          <View>
            <MCQ
              loader={1 == 2}
              title={strings.SELECT_AVAILABLE_SLOT}
              mcqList={rangeShift}
              setChecked={(idx) =>
                changeChecked(idx, rangeShift, setrangeShift)
              }
            />
            <MCQ
              loader={1 == 2}
              title={strings.SELECT_SESSION}
              mcqList={session}
              inputText={feedInput}
              setInput={setFeedInput}
              setChecked={(idx) =>
                changeChecked(idx, session, setSession, true)
              }
            />

            {length > 0 && isValidSession ? (
              <View style={{ marginBottom: RFPercentage(5) }}>
                <View>
                  <Button
                    loader={isScheduleLoading}
                    text={BOOK_APPT}
                    onBtnPress={() => submitForm()}
                  />
                </View>
              </View>
            ) : null}
          </View>

          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              margin: RFValue(5),
              marginTop: RFValue(5),
              marginBottom: RFValue(5),
            }}
          >
            <Text
              style={{
                fontSize: RFValue(14),
                color: "red",
                fontFamily: FONTS.REGULAR,
              }}
            >
              {strings.APPOINTMENT_NOTES}
            </Text>
          </View>
        </View>
        {/* )} */}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOR.BACKGROUND,
    marginHorizontal: RFPercentage(2),
    // paddingHorizontal: RFPercentage(0.5),
    flexGrow: 1,
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
    backgroundColor: TRANSPARENT,
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
  /* TABS */
  tab: {
    borderBottomWidth: 0,
    paddingHorizontal: 5,
    overflow: "hidden",
    flexDirection: "row",
  },
  horizontalRule: {
    borderBottomColor: TRANSPARENT,
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
    marginTop: RFPercentage(1),
  },
  dayText: {
    textAlign: "center",
    borderWidth: 1.5,
    // borderRadius: 10,
    padding: 0,
    width: RFPercentage(6),
    height: RFPercentage(6),
    padding: RFPercentage(6 / 5),
    fontFamily: REGULAR,
    fontSize: RFValue(17),
    alignItems: "center",
    alignSelf: "center",
  },
});

const legendStyle = StyleSheet.create({
  iconSize: 23,
  flexRow: { flexDirection: "row" },
  center: { justifyContent: "center" },
  icon: { alignSelf: "center", marginRight: RFPercentage(1) },
  title: { fontSize: RFValue(16), alignSelf: "center", fontFamily: LIGHT },
});
export default (Schedule = React.memo(Schedule));
