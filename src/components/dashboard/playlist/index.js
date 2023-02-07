// @ts-nocheck
import Loader from "@components/common/loader";
import GLOBALS from "@constants";
import * as Images from "@images";
import moment from "moment";
import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  StyleSheet,
  Alert,
  ImageBackground,
  Animated,
  Dimensions,
  Platform,
  AppState,
} from "react-native";
import { RFValue, RFPercentage } from "react-native-responsive-fontsize";
const { FONTS, COLOR, STRINGS } = GLOBALS;
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Entypo from "react-native-vector-icons/Entypo";
const isiOS = Platform.OS == "ios";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Avatar } from "react-native-elements";
import ModalView from "react-native-modal";
import CustomCalendar from "../../common/CustomCalendar";
import { Slider } from "@miblanchard/react-native-slider";
import Faded from "./Faded";
import { navigatorRoot } from "@config/navigationOptions";
import { Navigation } from "react-native-navigation";
import store, { storeObj } from "@store/setup";

const { PRODUCT_TYPE } = GLOBALS;

import { customCrash } from "@utils/Crashlytics";
import {
  ProgressSteps,
  ProgressStep,
} from "../../../updatedNodeModules/react-native-progress-steps";
import {
  navigatorPop,
  navigatorPush,
  navigatorListners,
} from "@config/navigationOptions";
const HEIGHT = RFPercentage(28);
const { width, height } = Dimensions.get("window");
import { strings } from "@localization";
import { string } from "prop-types";
let datesWhitelist = [
  {
    start: moment().subtract(6, "days"),
    end: moment().add(1, "days"), // total 4 days enabled
  },
];

let days = [1, 2, 3, 4, 5, 6, 7];

const SliderUI = ({
  setScale,
  getScale,
  isEditUI,
  minTrackColor,
  maxTrackColor,
  maxValue,
  thumbTintColor,
}) => {
  const onSliderChange = (value) => {
    setScale(value);
  };
  return (
    <View>
      <Slider
        style={{ height: 20 }}
        value={getScale}
        maximumTrackTintColor={maxTrackColor}
        minimumTrackTintColor={minTrackColor}
        tintColor={COLOR.BUTTON_ORANGE}
        thumbTintColor={thumbTintColor}
        minimumValue={1}
        maximumValue={maxValue}
        disabled={true}
        thumbStyle={{ height: 0, width: 0 }}
      />
    </View>
  );
};

const ListUIView = ({
  name,
  onClick,
  type,
  status,
  currentWeekDay,
  isCheckedStatus,
  totalWeeksToShow,
}) => {
  return (
    <View>
      <TouchableOpacity
        onPress={() => onClick()}
        style={[
          Styles.touchableStyle,
          Styles.boxShadow,
          { borderColor: COLOR.DARK_GREEN },
        ]}
      >
        <View style={Styles.viewStyle}>
          {type === "Mood" ? (
            <Image
              source={Images.Mood}
              resizeMode="contain"
              style={{ width: 20 }}
            />
          ) : null}
          {type === "Daily" ? (
            <Entypo name="open-book" size={24} color={COLOR.PRIMARY1} />
          ) : null}
          {type === "Sleep" ? (
            <Image
              source={Images.SleepNew}
              resizeMode="contain"
              style={{ width: 20 }}
            />
          ) : null}
          {type === "Activity" ? (
            <Image
              source={PRODUCT_TYPE == "CU002" ? Images.diaper : Images.Activity}
              style={{ width: 20 }}
              resizeMode="contain"
            />
          ) : null}
          {type === "Care" ? (
            <MaterialIcons name="child-care" size={24} color={COLOR.PRIMARY1} />
          ) : null}
          {type === "baby" || type === "diaper" || type === "baby_mood" ? (
            <Image source={Images.Activity} resizeMode="contain" />
          ) : null}
          {type == "Chatbot" ? (
            <Ionicons
              name={"chatbox-ellipses-outline"}
              size={28}
              // color={COLOR.PRIMARY1}
            />
          ) : null}
        </View>
        <View
          style={{
            flex: 0.95,
            paddingHorizontal: RFValue(8),
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={[Styles.textStyle, { color: COLOR.BLACK }]}
            allowFontScaling={false}
          >
            {name}
          </Text>
        </View>
        {isCheckedStatus ? (
          <MaterialIcons
            name="check-circle"
            size={24}
            color={COLOR.DARK_GREEN}
          />
        ) : (
          <Image
            source={Images.Forward}
            resizeMode="contain"
            style={Styles.forwordImage}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

const ListUIViewDynamic = ({ data, onClick }) => {
  return (
    <View>
      <TouchableOpacity
        onPress={() => onClick(data)}
        style={[
          Styles.touchableStyle,
          Styles.boxShadow,
          { borderColor: COLOR.DARK_GREEN },
        ]}
      >
        <View style={Styles.viewStyle}>
          {/* mood */}
          {data?.tracker?.value === "mood" ? (
            <Image
              source={Images.Mood}
              resizeMode="contain"
              style={{ width: 20 }}
            />
          ) : null}

          {/* {type === "Daily" ? (
            <Entypo name="open-book" size={24} color={COLOR.PRIMARY1} />
          ) : null} */}

          {/* sleep */}
          {data?.tracker?.value === "sleep" ? (
            <Image
              source={Images.SleepNew}
              resizeMode="contain"
              style={{ width: 20 }}
            />
          ) : null}

          {/* temp */}
          {data?.tracker?.value === "temperature" ? (
            <Image
              source={Images.Activity}
              resizeMode="contain"
              style={{ width: 20 }}
            />
          ) : null}

          {/* weight */}
          {data?.tracker?.value === "weight" ? (
            <Image
              source={Images.Activity}
              resizeMode="contain"
              style={{ width: 20 }}
            />
          ) : null}

          {/* activity */}
          {data?.tracker?.value === "activity" ? (
            <Image
              source={PRODUCT_TYPE == "CU002" ? Images.diaper : Images.Activity}
              style={{ width: 20 }}
              resizeMode="contain"
            />
          ) : null}
        </View>
        <View
          style={{
            flex: 0.95,
            paddingHorizontal: RFValue(8),
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={Styles.textStyle} allowFontScaling={false}>
            {data?.tracker?.name}
          </Text>
        </View>
        {data?.tracker?.isTaken ? (
          <MaterialIcons
            name="check-circle"
            size={24}
            color={COLOR.DARK_GREEN}
            nativeID={"NativeCheckMarkId" + data?.tracker?.value}
            testID={"TestCheckMarkId" + data?.tracker?.value}
          />
        ) : (
          <Image
            source={Images.Forward}
            resizeMode="contain"
            style={Styles.forwordImage}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

const RenderAttachmentModal = ({ setProfilePictureModel, goToGallery }) => {
  return (
    <View style={Styles.content}>
      <View style={Styles.attRowStyle}>
        <TouchableOpacity
          //onPress={() => setProfilePictureModel(false)}
          style={{ alignItems: "center" }}
        >
          <Ionicons
            name="ios-camera"
            size={64}
            color={"#416CA2"}
            style={{ paddingRight: 10 }}
          />
          <Text>Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            goToGallery();
            // setProfilePictureModel(false)
          }}
          style={{ alignItems: "center" }}
        >
          <Ionicons
            name="ios-image"
            size={56}
            color={"#e040fb"}
            style={{ paddingRight: 10 }}
          />
          <Text>Gallery</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

function Playlist(props, { navigation }) {
  const {
    allTrackersDynamic,
    getActiveProgramsDetails,
    firstName,
    onTrackersClick,
    goToDailyCBT,
    playlistDynamicLoader,
    playlistDynamicRes,
    getMoodStatus,
    getActivityStatus,
    getSleepStatus,
    totalWeeksToShow,
    goToGallery,
    profileUrl,
    profileModel,
    onPointsClick,
    onSettingOpen,
    isPreviousCardRead,
    isPrevSleepTrackerDone,
    goToChatBot,
    getAllTeckersList,
    points,
  } = props;

  const current_day =
    playlistDynamicRes && playlistDynamicRes.dailyLearningPointedDay
      ? parseInt(playlistDynamicRes.dailyLearningPointedDay) - 1
      : 0;

  const day_point =
    points && points.dailypoints && points.dailypoints.length > 0
      ? points.dailypoints[0].PointEarned
      : 0;
  const week_point =
    points && points.weeklypoints && points.weeklypoints.length > 0
      ? points.weeklypoints[0].PointEarned
      : 0;
  const month_point =
    points && points.monthlypoints && points.monthlypoints.length > 0
      ? points.monthlypoints[0].PointEarned
      : 0;

  const [isProfilePictureModelVisible, setProfilePictureModel] = useState(
    profileModel ? false : null
  );
  const [visibleCalendarModal, setVisibleCalendarModal] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState(moment().format());
  const Programs = storeObj.store.getState().programReducer;

  const [stages, setStages] = useState([1, 2, 3, 4]);

  useEffect(() => {}, [COLOR.DARK_GREEN]);

  useEffect(() => {
    let i;
    let array = [];
    for (i = 1; i <= Programs?.activeProgramDetail?.stage; i++) {
      array.push(i);
    }
    setStages(array);
    console.log("Stages===>", stages, days);
  }, []);

  let maxPointValue = 500;
  if (isPreviousCardRead && isPrevSleepTrackerDone) {
    maxPointValue = 650;
  } else if (isPreviousCardRead) {
    maxPointValue = 600;
  } else if (isPrevSleepTrackerDone) {
    maxPointValue = 550;
  } else {
    maxPointValue = 500;
  }
  return (
    <View style={{ flex: 1, backgroundColor: COLOR.WHITE }}>
      <View
        style={[Styles.firstViewStyle, { backgroundColor: COLOR.DARK_GREEN }]}
      >
        <View style={[Styles.nameViewStyle]}>
          <Text numberOfLines={1} style={[Styles.nameStyle]}>
            {strings.home.hi} {firstName}
          </Text>
          <View testID={"UserProfileId"} style={{ alignSelf: "auto" }}>
            <Avatar
              titleStyle={{ fontSize: RFValue(18), fontFamily: FONTS.BOLD }}
              source={
                profileUrl
                  ? { uri: profileUrl }
                  : {
                      uri: "https://mscuriostorage.blob.core.windows.net/allimages/content/image/thumbnail_1663684956222_ob",
                    }
              }
              // source={{
              //   uri:
              //     "https://mscuriostorage.blob.core.windows.net/allimages/content/image/thumbnail_1663684956222_ob",
              // }}
              size="medium"
              rounded
              onPress={onSettingOpen}
            />
          </View>
        </View>

        <View style={Styles.weekViewStyle}>
          <Text style={Styles.weekText}>
            {""}
            {getActiveProgramsDetails && getActiveProgramsDetails?.currentWeek
              ? `${strings.home.week} ${getActiveProgramsDetails.currentWeek}`
              : ""}
          </Text>
          <View style={{ flex: 1, marginBottom: 0 }}>
            {Programs?.activeProgramDetail?.stage ? (
              <ProgressSteps
                activeStep={Programs?.ActiveStage - 1}
                // activeStep={2}
                topOffset={10}
                progressBarColor={COLOR.orangeactiveStepIconColor}
                borderWidth={6}
                completedProgressBarColor={COLOR.BUTTON_ORANGE}
                activeStepIconBorderColor={COLOR.activeStepIconBorderColor}
                // activeStepIconColor={COLOR.activeStepIconColor}
                activeStepIconColor={COLOR.orangeactiveStepIconColor}
                disabledStepIconColor={COLOR.WHITE}
                completedStepIconColor={COLOR.WHITE}
              >
                {days.map((m) => {
                  return <ProgressStep removeBtnRow="true" />;
                })}
              </ProgressSteps>
            ) : (
              <ProgressSteps
                activeStep={getActiveProgramsDetails?.currentDay}
                // activeStep={2}
                topOffset={10}
                progressBarColor={COLOR.orangeactiveStepIconColor}
                borderWidth={6}
                completedProgressBarColor={COLOR.BUTTON_ORANGE}
                activeStepIconBorderColor={COLOR.activeStepIconBorderColor}
                // activeStepIconColor={COLOR.activeStepIconColor}
                activeStepIconColor={COLOR.orangeactiveStepIconColor}
                disabledStepIconColor={COLOR.WHITE}
                completedStepIconColor={COLOR.WHITE}
              >
                {days.map((m) => {
                  return <ProgressStep removeBtnRow="true" />;
                })}
              </ProgressSteps>
            )}
          </View>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => goToDailyCBT()}
        style={Styles.dailyLearningImageStyle}
      >
        <ImageBackground
          resizeMode="contain"
          style={[Styles.imageBackgroundStyle]}
          source={Images.daily_learning}
        >
          <View style={Styles.fadedContainer}>
            <View style={Styles.fadingInnerContainer}>
              <Text style={Styles.dailyLearningText} allowFontScaling={false}>
                {PRODUCT_TYPE == "FERTI"
                  ? strings.home.todays_learning
                  : strings.home.learning_heading}
              </Text>
              <Text
                style={Styles.dailyLearningSubText}
                allowFontScaling={false}
              >
                {strings.home.learning_desc}
              </Text>
            </View>
          </View>
        </ImageBackground>

        {/* <View style={Styles.fadedContainer}>

          <View style={Styles.fadingInnerContainer}>
            <Text style={Styles.dailyLearningText}>
              {GLOBALS.Strings.playlist.learning_heading}
            </Text>
            <Text style={Styles.dailyLearningSubText}>
              {GLOBALS.Strings.playlist.learning_desc}
            </Text>
          </View>

        </View> */}
      </TouchableOpacity>

      <View style={Styles.trackersView}>
        <View>
          <View style={{ height: "100%", paddingTop: RFValue(5) }}>
            {playlistDynamicLoader ? (
              <Loader loaderColor={COLOR.GREY} />
            ) : (
              <ScrollView
                showsVerticalScrollIndicator={false}
                style={{ paddingBottom: 20, marginBottom: RFValue(90) }}
              >
                <View>
                  {/* <ListUIView
                    name={strings.chat.ChatWithStella}
                    onClick={goToChatBot}
                    type={"Chatbot"}
                  /> */}

                  {allTrackersDynamic &&
                    allTrackersDynamic?.map((item) => {
                      return (
                        <ListUIViewDynamic
                          data={item}
                          onClick={onTrackersClick}
                        />
                      );
                    })}
                </View>

                {/* Points UI START *********** */}
                <TouchableOpacity
                  onPress={() => {
                    onPointsClick();
                  }}
                  style={[
                    Styles.pointsView,
                    Styles.boxShadow,
                    { borderColor: COLOR.DARK_GREEN },
                  ]}
                >
                  <Text style={Styles.textStyle}>{strings.home.points}</Text>
                  <View style={[Styles.pointsInnerView]}>
                    <View style={{ flex: 0.3 }}>
                      <Text style={[Styles.textStyle, Styles.smallText]}>
                        {strings.home.day}
                      </Text>
                      <SliderUI
                        getScale={day_point}
                        isEditUI={false}
                        minTrackColor={COLOR.BUTTON_ORANGE}
                        maxValue={400}
                        maxTrackColor={
                          day_point > 400 ? COLOR.BUTTON_ORANGE : "lightgray"
                        }
                        thumbTintColor={"transparent"}
                      />
                    </View>
                    <View style={{ flex: 0.3 }}>
                      <Text style={[Styles.textStyle, Styles.smallText]}>
                        {strings.home.week}
                      </Text>
                      <SliderUI
                        getScale={week_point}
                        isEditUI={false}
                        minTrackColor={COLOR.DARK_GREEN}
                        maxValue={2800}
                        maxTrackColor={
                          week_point > 2800 ? COLOR.DARK_GREEN : "lightgray"
                        }
                        thumbTintColor={"transparent"}
                      />
                    </View>
                    <View style={{ flex: 0.3 }}>
                      <Text style={[Styles.textStyle, Styles.smallText]}>
                        {strings.home.month}
                      </Text>
                      <SliderUI
                        getScale={month_point}
                        isEditUI={false}
                        minTrackColor={COLOR.ORANGE}
                        maxValue={12000}
                        maxTrackColor={
                          month_point > 12000 ? COLOR.ORANGE : "lightgray"
                        }
                        thumbTintColor={"transparent"}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
                {/* Points UI END ************* */}

                {/* Empty check */}
                {!playlistDynamicRes?.length == 0 ? (
                  <Text
                    style={{
                      fontFamily: FONTS.REGULAR,
                      fontSize: RFValue(14),
                      alignSelf: "center",
                      color: COLOR.GREY,
                    }}
                  >
                    No program assigned yet
                  </Text>
                ) : null}
              </ScrollView>
            )}
          </View>
        </View>
      </View>

      <ModalView
        isVisible={profileModel ? false : isProfilePictureModelVisible}
        onSwipeComplete={() => setProfilePictureModel(false)}
        swipeDirection={["up", "left", "right", "down"]}
        style={Styles.bottomModal}
        onBackdropPress={() => setProfilePictureModel(false)}
      >
        <RenderAttachmentModal
          setProfilePictureModel={setProfilePictureModel}
          goToGallery={goToGallery}
        />
      </ModalView>

      <ModalView
        isVisible={visibleCalendarModal}
        onSwipeComplete={() => setVisibleCalendarModal(false)}
        swipeDirection={["up", "left", "right", "down"]}
        style={Styles.calendarModal}
        onBackdropPress={() => {
          setVisibleCalendarModal(false);
        }}
      >
        <CustomCalendar
          selectedDate={selectedDate}
          onDaySelected={(day) => {
            setSelectedDate(day);
          }}
        />
      </ModalView>
    </View>
  );
}
export default Playlist = React.memo(Playlist);

const Styles = StyleSheet.create({
  boxShadow: {
    backgroundColor: "white",
    // shadowColor: COLOR.PRIMARY,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 3.14,
    elevation: 2,
  },
  touchableStyle: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: RFValue(10),
    borderColor: COLOR.DARK_GREEN,
    borderRadius: RFValue(10),
    borderWidth: 0.5,
  },
  viewStyle: {
    // borderWidth: RFValue(1),
    borderColor: "#E9E9E9",
    padding: RFValue(8),
    borderRadius: RFValue(8),
    justifyContent: "center",
    alignItems: "center",
  },
  textStyle: {
    fontFamily: FONTS.REGULAR,
    fontSize: RFValue(15),
    color: COLOR.BLACK,
    fontWeight: "400",
  },
  forwordImage: {
    height: RFValue(14),
    width: RFValue(14),
    tintColor: "#3E3E3F",
  },
  imageBackgroundStyle: {
    width: "100%",
    height: Platform.OS == "ios" ? RFPercentage(30) : RFPercentage(35),
    elevation: 20,
    // alignItems: "center",
    // justifyContent: "center",
    // borderRadius: 52,
    // borderTopLeftRadius: 1110,
    // borderTopRightRadius: 110,
  },
  bottomModal: { justifyContent: "flex-end", marginBottom: 40 },
  calendarModal: {
    justifyContent: "center",
    marginBottom: 40,
  },
  content: {
    flex: 0.3,
    backgroundColor: COLOR.WHITE,
    borderRadius: 4,
    justifyContent: "center",
  },
  attRowStyle: {
    margin: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  firstViewStyle: {
    flex: 0.35,
    borderBottomLeftRadius: RFValue(30),
    borderBottomRightRadius: RFValue(30),
    borderBottomWidth: 1,
    borderColor: COLOR.DARK_GREEN,
    backgroundColor: COLOR.DARK_GREEN,
    width: "100%",
    height: "28%",
  },
  nameViewStyle: {
    flex: 0.2,
    marginTop: Platform.OS == "ios" ? RFValue(65) : RFValue(15),
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: RFValue(20),
  },
  nameStyle: {
    fontFamily: FONTS.REGULAR,
    fontSize: RFValue(28),
    fontWeight: "600",
    color: COLOR.WHITE,
    width: "80%",
  },
  weekViewStyle: {
    flex: 1,
    marginTop: RFValue(5),
    paddingHorizontal: RFValue(20),
    justifyContent: "flex-start",
  },
  weekText: {
    color: COLOR.WHITE,
    fontSize: RFValue(18),
    fontWeight: "700",
    fontFamily: FONTS.REGULAR,
  },
  dailyLearningImageStyle: {
    flex: 0.25,
    alignItems: "center",
    marginTop:
      Platform.OS == "ios"
        ? height > 690
          ? -RFValue(130)
          : -RFValue(100)
        : height > 690
        ? -RFValue(140)
        : -RFValue(100),
    justifyContent: "center",
    shadowOffset: {
      width: 0,
      height: 15,
    },
    shadowOpacity: 0.4,
    shadowRadius: 10.65,
    elevation: Platform.OS == "android" ? 3 : 8,
    shadowColor: COLOR.PRIMARY,
    alignSelf: "center",
    width: RFPercentage(45),
    borderRadius: 15,
  },

  dailyLearningView: {
    position: "absolute",
    justifyContent: "flex-end",
    height: RFPercentage(28),
    width: RFPercentage(45),
    bottom: 0,
  },
  dailyLearningText: {
    fontFamily: FONTS.BOLD,
    fontSize: RFValue(20),
    paddingTop: RFValue(10),
    // fontWeight: "700",
    color: "black",
    paddingHorizontal: 20,
    paddingLeft: 20,
  },
  dailyLearningSubText: {
    fontFamily: FONTS.REGULAR,
    fontSize: RFValue(15),
    paddingTop: RFValue(5),
    color: "black",
    fontWeight: "400",
    paddingHorizontal: 20,
    paddingLeft: 20,
  },
  trackersView: {
    flex: 0.4,
    paddingHorizontal: RFValue(20),
  },
  pointsView: {
    padding: RFValue(8),
    borderColor: COLOR.DARK_GREEN,
    borderRadius: RFValue(10),
    borderWidth: 1,
  },
  pointsInnerView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: RFValue(4),
  },
  smallText: {
    fontSize: RFValue(9),
  },

  coverOverlayContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    justifyContent: "space-between",
  },
  text: {
    color: "#FFF",
  },
  logo: {
    backgroundColor: "#056ecf",
    height: HEIGHT,
    width: "100%",
  },
  fadedContainer: {
    flex: 1,
    position: "absolute",
    bottom: 15,
    left: 0,
    right: 0,
  },
  fadingInnerContainer: { padding: 10, justifyContent: "space-between" },
});
