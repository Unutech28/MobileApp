import GLOBALS from "@constants";
import * as ICONS from "@images";
import * as Images from "@images";
import moment from "moment";
import React from "react";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  TouchableOpacity,
} from "react-native";
import FAIcon from "react-native-vector-icons/FontAwesome";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
const isiOS = Platform.OS == "ios";
const { FONTS, COLOR, STRINGS } = GLOBALS;
import { strings } from '@localization';

const {
  GREEN,
  WHITE,
  GREY,
  DARKGREY,
  LIGHT_BLACK,
  CERULEAN,
  SHADOW,
  BACKGROUND,
} = COLOR;
const { LIGHT, REGULAR } = FONTS;

function CardView(props) {
  let { item, id, goToVideoCall, activeTab } = props;
  const appointmentDate = item.appointment_date
    ? moment(item.appointment_date).format(STRINGS.DATE_FORMAT)
    : "NA";
  const appointmentTime = item.appointment_time
    ? moment(item.appointment_time).format("hh:mm A")
    : "NA";
  return (
    <TouchableWithoutFeedback onPress={() => { }}>
      <View style={cardStyle.row} key={id}>
        <View style={cardStyle.imageContainer}>
          <Image
            source={Images.rectangle}
            style={cardStyle.capImage}
          />
        </View>
        <View style={[cardStyle.section]}>
          <View style={cardStyle.details}>
            {activeTab === strings.Schedule.BOOKED ? (
              <Text style={cardStyle.detailsText}>
                {item.caretakername} {item.caretakerlastname}
              </Text>
            ) : null}
            {activeTab === strings.Schedule.COMPLETED || activeTab === strings.Schedule.MISSED ? (
              <Text style={cardStyle.detailsText}>{item.caretaker_name}</Text>
            ) : null}
            {activeTab === strings.Schedule.UPCOMING ? (
              <Text style={cardStyle.detailsText}>{item.caretaker_name}</Text>
            ) : null}
          </View>
          <View style={[cardStyle.capTitle]}>
            <View style={{ flexDirection: "row" }}>
              {activeTab === strings.Schedule.UPCOMING ? (
                <Text style={cardStyle.capTitleText}>{moment(appointmentDate).format(STRINGS.DATE_FORMAT)} {appointmentTime}
                </Text>
              ) : null}

              {activeTab === strings.Schedule.COMPLETED ||
                activeTab === strings.Schedule.MISSED ? (
                <Text style={cardStyle.capTitleText}>{moment(appointmentDate).format(STRINGS.DATE_FORMAT)} {appointmentTime}</Text>
              ) : null}

              {activeTab === strings.Schedule.BOOKED ? (
                item.selectedDate !== undefined &&
                  item.selectedDate.length > 0 ? (
                  <View>
                    {/* <Text style={cardStyle.capTitleText}>Date - </Text> */}
                    {item.selectedDate.map((e) => {
                      return (
                        <Text style={cardStyle.capTitleText}>
                          {" "}
                         {moment(e.date).format(STRINGS.DATE_FORMAT)}{" "}
                        </Text>
                      );
                    })}
                  </View>
                ) : (
                  <Text style={cardStyle.capTitleText}>{appointmentDate}</Text>
                )
              ) : null}

              {item.islive == true && (
                <FAIcon
                  name="circle"
                  size={10}
                  color={GREEN}
                  style={cardStyle.iconTop}
                />
              )}
            </View>
            {/* <Text style={cardStyle.capTitleText}>Time - {appointmentTime}</Text> */}
          </View>

          {/* <View style={cardStyle.details}>
            <Text style={cardStyle.detailsText}>ID - {item.patientnumber}</Text>
          </View> */}
          {activeTab === strings.Schedule.UPCOMING ? (
            <View style={{ flexDirection: "row", overflow: "hidden" }}>
              {/* <TouchableOpacity onPress={() => goToVideoCall(item)}>
                <Text style={[cardStyle.detailsText, cardStyle.online]}>
                  Video Call
                </Text>
              </TouchableOpacity> */}
            </View>
          ) : null}
        </View>
        {/* <View style={[{ flexDirection: 'row', justifyContent: 'center' }]}>
          <FAIcon
            size={20}
            name={item.isCompleted ? 'calendar' : 'calendar'}
            style={cardStyle.check}
          />
        </View> */}
      </View>
    </TouchableWithoutFeedback>
  );
}
const cardStyle = StyleSheet.create({
  row: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLOR.BORDER_COLOR,
    flexDirection: "row",
    backgroundColor: COLOR.WHITE,
    marginTop: RFValue(10),
    marginBottom: RFPercentage(isiOS ? 1.5 : 2),
    borderRadius: RFPercentage(1),
    marginHorizontal: RFValue(16)
  },
  imageContainer: {
    flex: 0.35,
    borderRightWidth: 1,
    borderColor: COLOR.BORDER_COLOR,
  },
  capImage: {
    height: "100%",
    width: "100%",
    overflow: "hidden",
    borderTopLeftRadius: RFPercentage(1),
    borderBottomLeftRadius: RFPercentage(1),
  },
  iconTop: { alignSelf: "flex-start" },
  bottomContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: RFPercentage(2),
  },
  bottomTitle: {
    fontFamily: LIGHT,
    fontSize: RFValue(15),
    color: CERULEAN,
  },
  scene: {
    flex: 1,
  },
  container: {
    backgroundColor: BACKGROUND,
    marginHorizontal: RFPercentage(2),
    paddingHorizontal: RFPercentage(0.5),
    flexGrow: 1,
  },
  section: {
    paddingVertical: RFValue(10),
    paddingLeft: RFValue(20),
    justifyContent: "center",
    flex: 0.65,
  },
  capTitle: {
    justifyContent: "center",
    justifyContent: "center",
    paddingHorizontal: 0,
    overflow: "hidden",
  },
  capTitleText: {
    fontFamily: REGULAR,
    fontSize: RFValue(12),
    fontWeight: "500",
    color: LIGHT_BLACK,
    justifyContent: "center",
  },
  details: {
    paddingHorizontal: 0,
    flexDirection: "row",
  },
  detailsText: {
    fontFamily: REGULAR,
    fontSize: RFValue(isiOS ? 15 : 16),
    color: LIGHT_BLACK,
    fontWeight: 'bold',
    paddingBottom: 5,
  },
  check: {
    alignSelf: "center",
    marginRight: RFPercentage(2),
  },
  online: {
    borderWidth: 1,
    paddingHorizontal: RFPercentage(2),
    backgroundColor: GREEN,
    color: WHITE,
    alignSelf: "center",
    borderColor: GREEN,
    borderRadius: 15,
    overflow: "hidden",
    fontSize: RFValue(isiOS ? 15 : 16),
    marginTop: 2,
  },
  online: {
    borderWidth: 1,
    paddingHorizontal: RFPercentage(2),
    backgroundColor: COLOR.GREEN,
    color: COLOR.WHITE,
    alignSelf: "center",
    borderColor: COLOR.GREEN,
    borderRadius: 15,
    overflow: "hidden",
    fontSize: RFValue(isiOS ? 15 : 16),
    marginTop: 2,
  },
  bookBtn: {
    backgroundColor: COLOR.BACKGROUND,
    color: COLOR.BLACK,
    borderColor: COLOR.BACKGROUND,
    marginLeft: RFPercentage(0.5),
    marginLeft: RFPercentage(1.5),
  },
});
export default (CardView = React.memo(CardView));
