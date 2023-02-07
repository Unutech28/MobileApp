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
import { useSelector } from "react-redux";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Avatar } from "react-native-elements";
import commonStyles from "../commonStyles";
import { strings } from "@localization";
import FastImage from "react-native-fast-image";
const isiOS = Platform.OS === "ios";
const { FONTS, COLOR } = GLOBALS;
const { CIRCULAR_BOLD, REGULAR } = FONTS;
const { width } = Dimensions.get("window");
const { SOFT_GRAY, BLACK, WHITE, DARK_GREEN } = COLOR;
const ActivityView = ({
  item,
  type,
  goToOtherActivity,
  setSelectedActivity,
  selectedTabArray,
}) => {
  const [isImageClick, setImageClick] = useState(false);
  const [checked, setChecked] = useState([]);

  const onSelectActivity = (title, item) => {
    setImageClick(!isImageClick);
    setSelectedActivity(title);
    selectedTabArray.forEach((element) => {
      if (element._id === item._id) {
        element.isChecked = !item.isChecked;
      }
    });

    if (!checked.includes(item)) {
      setChecked([...checked, item]);
    } else {
      setChecked([checked.filter((a) => a !== item)]);
    }
  };

  if (type === "Other") {
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

    return item.title !== null ? (
      <View style={styles.mainViewStyle}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            alignSelf: "center",
          }}
        >
          <View>
            <Avatar
              source={ICONS.WhiteHeart}
              size="medium"
              rounded
              containerStyle={{
                backgroundColor: COLOR.PRIMARY,
                borderColor: COLOR.PRIMARY,
                padding: RFValue(5),
              }}
              avatarStyle={{ tintColor: COLOR.BACKGROUND_ORANGE }}
              accessory={{
                style: { backgroundColor: COLOR.TEXT_ORANGE, borderRadius: 20 },
              }}
              style={{ tintColor: "#ffff" }}
            />
            <Text style={styles.titleStyle}>{item.title}</Text>
          </View>
        </View>
      </View>
    ) : null;
  } else {
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
    return (
      <TouchableOpacity
        style={styles.mainViewStyle}
        onPress={() => {
          onSelectActivity(item.title, item);
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
          {/* <Image
            source={{ uri: item.image }}
            resizeMode="contain"
            style={[
              styles.itemImage,
              {
                tintColor: item.isChecked ? COLOR.WHITE : COLOR.BLACK,
              },
            ]}
          /> */}
          <FastImage
            style={[
              styles.itemImage,
              {
                tintColor: item.isChecked ? COLOR.WHITE : COLOR.BLACK,
              },
            ]}
            source={{
              uri: item.image,
              //   headers: { Authorization: 'someAuthToken' },
              priority: FastImage.priority.high,
            }}
            resizeMode={FastImage.resizeMode.contain}
          />
        </View>

        <Text style={styles.titleStyle}>{item.title}</Text>
      </TouchableOpacity>
    );
  }
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
  } = props;

  const selectedTrackers = useSelector((state) => {
    return state.dashboardReducer.getSelectedActivityTracker;
  });

  const [isRefresh, setIsRefresh] = useState(isRefreshData);
  const [isModalVisible, setModal] = useState(false);
  const [selectedActivityName, setSelectedActivity] = useState("");
  const [selectedModaTime, setSelectedActivityTime] = useState("");
  const [isDeleteUI, setDeleteUI] = useState(false);

  const [newPleasentArray, setPlesantActivity] = useState(
    pleasentActivityArray
  );

  //   useEffect(() => {
  //     let output = newPleasentArray.map(e => selectedTrackers.activitypatchdata.some(({ activity_id }) => activity_id == e._id) ? ({ ...e, isChecked:true}) : { ...e, isChecked:false});

  // //setPlesantActivity(output);
  // pleasentActivityArray=output;
  //    }, [selectedTrackers]);
  let selectedListArray = [];

  // if (getActivityTrackerData !== undefined) {
  //   getActivityTrackerData.forEach(element => {
  //     if (element.isChecked !== undefined && element.isChecked) {
  //       selectedListArray.push(element);
  //     }
  //   });
  // }
  if (getActivityTrackerData !== undefined) {
    getActivityTrackerData.forEach((element) => {
      if (element.isChecked !== undefined && element.isChecked) {
        selectedListArray.push(element);
      }
    });
  }

  let arrayData = [];
  arrayData.push(otherArray);

  const onProceedClick = () => {
    if (selectedListArray.length > 0) {
      onSaveActivityClick(selectedListArray);
    } else {
      Alert.alert(strings.activity.alertText);
    }
  };

  return (
    <View style={{ flexGrow: 1 }}>
      <View style={{ flex: 1 }}>
        <View style={{ flex: 0.82 }}>
          <Text style={legendStyle.heading}>
            {strings.activity.activity_title}
          </Text>

          {activeTab === strings.activity.Activities &&
          pleasentActivityArray !== undefined &&
          pleasentActivityArray.length > 0 ? (
            <FlatList
              contentContainerStyle={{
                paddingBottom: RFPercentage(isiOS ? 1 : 10),
              }}
              // data={getActivityTrackerData}
              data={[...pleasentActivityArray, { plusImage: true }]}
              //data={[...newPleasentArray, {plusImage: true}]}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => `${item._id}`}
              numColumns={4}
              extraData={isRefresh}
              renderItem={({ item, index }) => (
                <ActivityView
                  item={item}
                  setModal={setModal}
                  setSelectedActivity={setSelectedActivity}
                  selectedTabArray={pleasentActivityArray}
                  setDeleteUI={setDeleteUI}
                  setSelectedActivityTime={setSelectedActivityTime}
                  getSelectedActivityTracker={getSelectedActivityTracker}
                  goToOtherActivity={goToOtherActivity}
                />
              )}
            />
          ) : null}

          {activeTab === strings.activity.DailyActivities &&
          dailyActivityArray !== undefined &&
          dailyActivityArray.length > 0 ? (
            <FlatList
              contentContainerStyle={{
                alignItems: "center",
                paddingBottom: RFPercentage(isiOS ? 1 : 13),
              }}
              data={dailyActivityArray}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => `${item._id}`}
              numColumns={3}
              extraData={isRefresh}
              renderItem={({ item, index }) => (
                <ActivityView
                  item={item}
                  setModal={setModal}
                  setSelectedActivity={setSelectedActivity}
                  selectedTabArray={dailyActivityArray}
                  setDeleteUI={setDeleteUI}
                  setSelectedActivityTime={setSelectedActivityTime}
                  getSelectedActivityTracker={getSelectedActivityTracker}
                />
              )}
            />
          ) : null}
        </View>
        <View style={commonStyles.buttonWrapper}>
          {selectedListArray.length ? (
            <CustomButton
              text={strings.activity.save_txt}
              colors={["#6545B2", "#6545B2", "#6545B2"]}
              onBtnPress={() => onProceedClick()}
              buttonText={{ color: WHITE }}
            />
          ) : (
            <CustomButton
              text={strings.activity.save_txt}
              colors={["#ffff", "#ffff", "#ffff"]}
              onBtnPress={() => onProceedClick()}
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
