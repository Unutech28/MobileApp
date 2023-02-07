// @ts-nocheck
import CustomButton from "@components/common/customButton";
import GLOBALS from "@constants";
import * as ICONS from "@images";
import React, { useState, lazy, useReducer, useEffect } from "react";
import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  FlatList,
  View,
  Alert,
  Image,
  TouchableOpacity,
} from "react-native";

import { alertWithOneBtn } from "@helpers/common";
import { useSelector } from "react-redux";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Avatar } from "react-native-elements";
import commonStyles from "../commonStyles";
import { strings } from "@localization";
import FastImage from "react-native-fast-image";
import { array } from "prop-types";
const isiOS = Platform.OS === "ios";
const { FONTS, COLOR, PRODUCT_TYPE } = GLOBALS;
const { CIRCULAR_BOLD, REGULAR } = FONTS;
const { width } = Dimensions.get("window");
const { SOFT_GRAY, BLACK, WHITE, DARK_GREEN } = COLOR;
const ActivityView = ({
  item,
  goToOtherActivity,
  onActivitySelected,
  imageBaseURL,
}) => {
  /**Item to open add activity when click on this */
  console.log("activity Item>>>", item);
  if (item.plusImage) {
    return (
      <TouchableOpacity
        style={styles.plusBtnStyle}
        onPress={() => goToOtherActivity()}
      >
        <View style={styles.addIcon}>
          <Text
            style={{
              fontSize: RFValue(30),
            }}
          >
            +
          </Text>
        </View>
        <Text style={styles.titleStyle}>{strings.activity.Add}</Text>
        <Text style={styles.titleStyle}>{strings.activity.Activity}</Text>
      </TouchableOpacity>
    );
  }
  console.log("image>>>", item.img);
  return (
    <TouchableOpacity
      style={styles.mainViewStyle}
      onPress={() => {
        onActivitySelected(item);
      }}
      activeOpacity={1}
    >
      <View
        style={[
          styles.imageWrapper,
          {
            borderWidth: item.isChecked ? 0 : 1,
            backgroundColor: item.isChecked ? DARK_GREEN : COLOR.WHITE,
          },
        ]}
      >
        {item.img !== undefined ? (
          <FastImage
            style={[
              styles.itemImage,
              {
                tintColor: item.isChecked ? COLOR.WHITE : COLOR.BLACK,
              },
            ]}
            source={{
              uri: imageBaseURL + item.img,
              priority: FastImage.priority.high,
            }}
            resizeMode={FastImage.resizeMode.contain}
          />
        ) : null}
      </View>
      <Text style={styles.titleStyle}>{item.activityTitle}</Text>
    </TouchableOpacity>
  );
};

function ActivityTracker(props) {
  let {
    getActivityTrackerData,
    pleasentActivityArray,
    dailyActivityArray,
    otherArray,
    goToOtherActivity,
    activeTab,
    onSaveActivityClick,
    getSelectedActivityTracker,
    isRefreshData,
    onSubmitActivity,
    activityData,
    imageBaseUrl,
    getAllTrackersResponse,
  } = props;

  const [isRefresh, setIsRefresh] = useState(isRefreshData);
  const [isModalVisible, setModal] = useState(false);
  const [selectedActivityName, setSelectedActivity] = useState("");
  const [selectedModaTime, setSelectedActivityTime] = useState("");
  const [isDeleteUI, setDeleteUI] = useState(false);

  const selectedTrackers = useSelector((state) => {
    return state.dashboardReducer.getSelectedActivityTracker;
  });
  const allTrackers = useSelector((state) => {
    return state.dashboardReducer.getActivityTrackerData;
  });

  const [updatedTrackerData, setUpdatedTracker] = useState(activityData);
  const [pleasentActivity, setPleaseentActivity] = useState([]);
  const [dailyActivities, setDailyActivity] = useState([]);
  const [otherActivity2, setOtherActivity] = useState([]);
  console.log("activityDataComponent>>>", activityData);

  useEffect(() => {
    if (activityData && activityData !== undefined) {
      activityData?.map((e) => {
        e.isChecked = false;
      });
      let otherActivity = activityData?.filter(
        (f) => f.category == "Custom Activities"
      );
      console.log("coustom other activity===>", otherActivity);
      setOtherActivity(otherActivity);

      let DailyActivity = activityData?.filter(
        (f) => f.category == "Daily Activities"
      );
      console.log("DailyActivity", DailyActivity);
      setDailyActivity(DailyActivity);
      let pleseantActivity = activityData?.filter(
        (f) => f.category == "Pleasant Activities"
      );

      // let customSelectedActivity = otherActivity?.filter((f) => {
      //   console.log("data==--==--->", f);
      //   !f.isChecked;
      // });
      let array2 = [];
      setTimeout(() => {
        otherActivity.map((item) => {
          if (item.isChecked == true) {
            array2.push(item);
          }
        });
        let otherActivityClicked = otherActivity?.filter((f) => f.isChecked);

        let selectedPleasentActivity = pleseantActivity.concat(array2);
        console.log("customSelectedActivity", array2);
        console.log("pleseantActivity", pleseantActivity);
        setPleaseentActivity(selectedPleasentActivity);
      }, 500);
    }

    // addOtherActivity();
  }, [updatedTrackerData, activityData]);

  const addOtherActivity = () => {
    let pleseantActivity = activityData?.filter(
      (f) => f.category == "Pleasant Activities"
    );

    let otherActivityClicked = activityData?.filter(
      (f) => f.category == "Custom Activities" && f.isChecked == true
    );

    let selectedPleasentActivity =
      pleseantActivity.concat(otherActivityClicked);
    console.log("customSelectedActivity", otherActivityClicked);
    setPleaseentActivity(selectedPleasentActivity);
  };

  useEffect(() => {}, []);
  // useEffect(() => {
  //   if (allTrackers != undefined && allTrackers?.iconlistdata?.length > 0 ||
  //     allTrackers?.otheractivitylistdata?.length > 0) {
  //     let output = allTrackers?.iconlistdata?.map(e =>
  //       selectedTrackers?.activitypatchdata?.some(
  //         ({ activity_id }) => activity_id == e._id,
  //       )
  //         ? { ...e, isChecked: true }
  //         : { ...e, isChecked: false },
  //     );
  //     setUpdatedTracker(output);

  //     let otherData = allTrackers?.iconlistdata?.filter(x =>
  //       selectedTrackers?.activitypatchdata?.some(
  //         ({ activity_id }) => activity_id == x._id && x.category == 'Pleasant',
  //       ),
  //     );
  //     let tempData = otherData?.map(e => {
  //       e.isChecked = true;
  //       return e;
  //     });
  //     setOtherActivity(tempData);
  //   }
  // }, [selectedTrackers, allTrackers]);

  /**On activity Click */
  const onActivitySelected = (item) => {
    // let output = updatedTrackerData.map(e => {
    //   e._id == item._id ? (e.isChecked = !e.isChecked) : e.isChecked;
    //   return e;
    // });
    // setUpdatedTracker(output)

    if (item.category == "Pleasant Activities") {
      let output = pleasentActivity.map((e) => {
        e._id == item._id ? (e.isChecked = !e.isChecked) : e.isChecked;
        return e;
      });
      setPleaseentActivity(output);
    }

    if (item.category == "Daily Activities") {
      let output = dailyActivities.map((e) => {
        e._id == item._id ? (e.isChecked = !e.isChecked) : e.isChecked;
        return e;
      });
      setDailyActivity(output);
    }

    if (item.category == "Custom Activities") {
      let output = otherActivity2.map((e) => {
        e._id == item._id ? (e.isChecked = !e.isChecked) : e.isChecked;
        return e;
      });
      setOtherActivity(output);
    }
  };

  const onOtherActivitySelected = () => {
    let selected_data = updatedTrackerData.filter((x) => x.isChecked == true);
    goToOtherActivity(selected_data);
  };

  const onProceedClick = () => {
    let selectedPleasentActivity = pleasentActivity.filter(
      (x) => x.isChecked == true
    );
    let selectedDailyActivity = dailyActivities.filter(
      (x) => x.isChecked == true
    );
    let patientActivity = selectedPleasentActivity.concat(
      selectedDailyActivity
    );
    onSubmitActivity(patientActivity);
  };

  return (
    <View style={{ flexGrow: 1 }}>
      <View style={{ flex: 1 }}>
        <View style={{ flex: 0.82 }}>
          <Text style={legendStyle.heading}>
            {PRODUCT_TYPE == "CU002"
              ? strings.activity.activity_titleCU002
              : strings.activity.activity_title}
          </Text>
          {activeTab === strings.activity.Activities ? (
            <FlatList
              contentContainerStyle={{
                paddingBottom: RFPercentage(isiOS ? 1 : 10),
              }}
              // data={[
              //   ...updatedTrackerData
              //     .filter(x => x.category == 'Pleasant activities')
              //     .concat(...otherActivity),
              //   { plusImage: true },
              // ]}
              data={[...pleasentActivity, { plusImage: true }]}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => `${item._id}`}
              numColumns={4}
              extraData={isRefresh}
              renderItem={({ item, index }) => (
                <ActivityView
                  goToOtherActivity={onOtherActivitySelected}
                  item={item}
                  onActivitySelected={(item) => onActivitySelected(item)}
                  imageBaseURL={imageBaseUrl}
                />
              )}
            />
          ) : null}

          {activeTab === strings.activity.DailyActivities ? (
            <FlatList
              contentContainerStyle={{
                paddingBottom: RFPercentage(isiOS ? 1 : 10),
              }}
              // data={[
              //   ...updatedTrackerData?.filter(
              //     x => x.category == 'Daily activities',
              //   ),
              // ]}
              data={dailyActivities}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => `${item._id}`}
              numColumns={4}
              extraData={isRefresh}
              renderItem={({ item, index }) => (
                <ActivityView
                  item={item}
                  onActivitySelected={(item) => onActivitySelected(item)}
                  imageBaseURL={imageBaseUrl}
                />
              )}
            />
          ) : null}
        </View>
        <View style={commonStyles.buttonWrapper}>
          {updatedTrackerData?.some((el) => el.isChecked === true) ? (
            <CustomButton
              text={strings.activity.save_txt}
              // colors={['#6545B2', '#6545B2', '#6545B2']}
              colors={[DARK_GREEN, DARK_GREEN]}
              onBtnPress={() => onProceedClick()}
              buttonText={{ color: WHITE }}
            />
          ) : (
            <CustomButton
              text={strings.activity.save_txt}
              colors={["#ffff", "#ffff", "#ffff"]}
              onBtnPress={() => {
                alertWithOneBtn(
                  "",
                  strings.validation.select_activity,
                  GLOBALS.STRINGS.LOGOUT_OK
                );
              }}
              buttonStyle={legendStyle.buttonStyle}
              buttonText={{ color: BLACK }}
            />
          )}
        </View>
      </View>
    </View>
  );
}

const legendStyle = StyleSheet.create({
  buttonStyle: {
    borderWidth: 3,
    borderColor: DARK_GREEN,
    backgroundColor: WHITE,
  },

  heading: {
    color: SOFT_GRAY,
    fontSize: RFValue(22),
    fontFamily: CIRCULAR_BOLD,
    paddingBottom: RFValue(20),
    fontWeight: "700",
  },

  // buttonWrapper: {
  //   flex: 0.12,

  //   width: RFPercentage(15),
  //   alignSelf: "flex-end",
  // },
});
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  mainViewStyle: {
    width: width / 4.4,
    marginTop: RFValue(15),
    alignItems: "center",
  },
  titleStyle: {
    fontFamily: FONTS.CIRCULAR_MEDIUM,
    fontSize: RFValue(15),
    color: SOFT_GRAY,
    marginTop: RFValue(5),
    textAlign: "center",
    alignItems: "center",
    fontWeight: "600",
  },
  plusBtnStyle: {
    paddingBottom: RFValue(15),
    marginTop: RFValue(20),
    paddingLeft: RFValue(10),
    alignItems: "center",
  },
  addIcon: {
    width: RFValue(50),
    height: RFValue(50),
    borderRadius: RFValue(50),
    borderWidth: 1,
    borderColor: DARK_GREEN,
    backgroundColor: COLOR.WHITE,
    tintColor: COLOR.BLACK,
    shadowColor: COLOR.WHITE,
    shadowOffset: {
      width: 0,
      height: 8,
    },

    shadowOpacity: 0.46,
    shadowRadius: 11.14,
    elevation: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  itemImage: {
    width: "70%",
    height: "70%",
  },
  imageWrapper: {
    width: RFValue(50),
    height: RFValue(50),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: RFValue(50),
    shadowColor: COLOR.WHITE,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.46,
    borderColor: DARK_GREEN,
    shadowRadius: 11.14,
    elevation: 17,
  },
  buttonText: {
    fontFamily: REGULAR,
    fontWeight: "700",
  },
});
export default ActivityTracker = React.memo(ActivityTracker);
