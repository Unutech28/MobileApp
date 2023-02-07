import React from "react";
import moment from "moment";
import { View } from "react-native";
import { Calendar } from "react-native-calendars";
import Icon from "react-native-vector-icons/FontAwesome5";
const CustomCalendar = ({ selectedDate, onDaySelected }) => {
  return (
    <Calendar
      // Initially visible month. Default = Date()
      style={{ height: 365 }}
      current={selectedDate}
      // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
      // minDate={"2020-05-10"}
      // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
      maxDate={moment()
        .subtract(1, "day")
        .format()}
      // Handler which gets executed on day press. Default = undefined
      onDayPress={onDaySelected}
      // Handler which gets executed on day long press. Default = undefined
      onDayLongPress={(day) => {}}
      // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
      monthFormat={"dd MMMM yyyy"}
      // Handler which gets executed when visible month changes in calendar. Default = undefined
      onMonthChange={(month) => {}}
      // Hide month navigation arrows. Default = false
      // hideArrows={true}
      // Replace default arrows with custom ones (direction can be 'left' or 'right')

      renderArrow={(direction) => {
        if (direction === "left") {
          return (
            <Icon
              name="chevron-left"
              size={23}
              color={"#000000"}
              style={{ alignSelf: "center" }}
            />
          );
        } else {
          return (
            <Icon
              name="chevron-right"
              size={23}
              color={"#000000"}
              style={{ alignSelf: "center" }}
            />
          );
        }
      }}
      // Do not show days of other months in month page. Default = false
      // hideExtraDays={true}
      // If hideArrows=false and hideExtraDays=false do not switch month when tapping on greyed out
      // day from another month that is visible in calendar page. Default = false
      // disableMonthChange={true}
      // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
      // firstDay={1}
      // Hide day names. Default = false
      //hideDayNames={true}
      // Show week numbers to the left. Default = false
      // showWeekNumbers={true}
      // Handler which gets executed when press arrow icon left. It receive a callback can go back month
      onPressArrowLeft={(subtractMonth) => subtractMonth()}
      // Handler which gets executed when press arrow icon right. It receive a callback can go next month
      onPressArrowRight={(addMonth) => addMonth()}
      // Disable left arrow. Default = false
      // disableArrowLeft={false}
      // Disable right arrow. Default = false
      //disableArrowRight={false}
      // Disable all touch events for disabled days. can be override with disableTouchEvent in markedDates
      // disableAllTouchEventsForDisabledDays={true}
      // Replace default month and year title with custom one. the function receive a date as parameter.
      //   renderHeader={(date) => {
      //     /*Return JSX*/
      //   }}
      // Enable the option to swipe between months. Default = false
      enableSwipeMonths={true}
    />
  );
};

export default CustomCalendar;
