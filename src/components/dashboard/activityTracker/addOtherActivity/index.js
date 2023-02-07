// @ts-nocheck
import CustomButton from "@components/common/customButton";
import GLOBALS from "@constants";
import React, { useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  FlatList,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  NativeModules,
} from "react-native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import * as Images from "@images";
import { createFilter } from "react-native-search-filter";
import commonStyles from "./../../commonStyles";
import { strings } from "@localization";
const KEYS_TO_FILTERS = ["activityTitle"];
const isiOS = Platform.OS === "ios";
const { FONTS, COLOR } = GLOBALS;
const { REGULAR } = FONTS;
const { StatusBarManager } = NativeModules;
const { SOFT_GRAY, DARK_GREEN, WHITE, BLACK } = COLOR;
const CardView = ({ item, refresh, setRefresh }) => {
  const _onCheckActivity = () => {
    item.isCheck = !item.isCheck;
    setRefresh(!refresh);
  };
  return (
    <TouchableOpacity
      style={styles.searchedTitleWrapper}
      onPress={() => _onCheckActivity()}
    >
      <Image
        style={{ width: 20 }}
        source={item.isCheck ? Images.Checked : Images.UnChecked}
        resizeMode="contain"
      />
      <Text style={styles.titleStyle}>{item.activityTitle}</Text>
    </TouchableOpacity>
  );
};

function AddOtherActivity(props) {
  let { addOtherActivity, addActivityArray } = props;
  const [searchText, setSearchText] = useState("");
  const [isSearchList, setisSearchList] = useState(false);
  const [newSortedList, setNewSortedList] = useState([], "");
  const [refresh, setRefresh] = useState(false);
  const [statusBarHeight, setstatusBarHeight] = useState("", "");
  let checkedArray = [];

  if (Platform.OS === "ios") {
    StatusBarManager.getHeight((statusBarFrameData) => {
      setstatusBarHeight(statusBarFrameData.height);
    });
    // StatusBarIOS.addListener('statusBarFrameWillChange', statusBarData => {
    //   setstatusBarHeight(statusBarData.frame.height);
    // });
  }

  const onSaveClick = () => {
    //add validation here
    addOtherActivity(checkedArray);
  };

  if (newSortedList.length > 0) {
    newSortedList.forEach((element) => {
      if (element.isCheck) {
        checkedArray.push(element);
      }
    });
  }

  const searchUpdated = (text) => {
    if (text != "") {
      const filteredList = addActivityArray.filter(
        createFilter(text, KEYS_TO_FILTERS)
      );
      setNewSortedList(filteredList);
      setSearchText(text);
      setisSearchList(true);
      setRefresh(!refresh);
    } else {
      newSortedList.forEach((element) => {
        element.isCheck = false;
      });
      setSearchText("");
      setisSearchList(false);
      setNewSortedList([]);
      setRefresh(!refresh);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 0.9 }}>
        <View style={{ paddingHorizontal: RFValue(16) }}>
          <Text style={styles.heading}>
            {strings.activity.other_activity_title}
          </Text>
          <TextInput
            style={[styles.searchInput, { color: BLACK }]}
            placeholder={
              !isSearchList ? strings.activity.search_place_holder : null
            }
            placeholderTextColor={SOFT_GRAY}
            underlineColorAndroid="transparent"
            maxLength={50}
            value={searchText}
            onChangeText={(term) => {
              searchUpdated(term);
            }}
          />
        </View>

        <View style={styles.flatListWrapper}>
          <FlatList
            data={isSearchList ? newSortedList : []}
            contentContainerStyle={{
              paddingBottom: RFPercentage(isiOS ? 1 : 10),
              marginTop: RFValue(10),
            }}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            extraData={refresh}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <CardView item={item} refresh={refresh} setRefresh={setRefresh} />
            )}
          />
        </View>
      </View>
      <View style={[commonStyles.buttonWrapper, styles.buttonWrapper]}>
        {checkedArray.length > 0 ? (
          <CustomButton
            text={strings.activity.save_txt}
            colors={[DARK_GREEN, DARK_GREEN]}
            onBtnPress={() => onSaveClick()}
            buttonText={{ color: WHITE }}
          />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBackground: {
    height: RFValue(40),
    width: RFValue(40),
    justifyContent: "center",
    alignItems: "center",
  },
  titleStyle: {
    fontSize: RFValue(16),
    color: SOFT_GRAY,
    lineHeight: RFValue(25),
    flexWrap: "wrap",
    fontFamily: REGULAR,
    paddingLeft: 10,
    //  paddingTop: 1,
  },
  heading: {
    color: SOFT_GRAY,
    fontSize: RFValue(20),
    fontFamily: REGULAR,
    fontWeight: "700",
    marginTop: RFPercentage(3),
  },
  searchInput: {
    marginTop: RFValue(20),
    height: RFValue(50),
    backgroundColor: WHITE,
    paddingLeft: RFValue(10),
    borderColor: DARK_GREEN,
    borderRadius: RFValue(8),
    borderWidth: 1,
    fontSize: RFValue(15),
    fontFamily: REGULAR,
  },
  buttonWrapper: {
    marginRight: RFValue(16),
  },
  buttonStyle: { borderWidth: 4, borderColor: DARK_GREEN },
  flatListWrapper: { flex: 1, marginTop: RFValue(10) },
  searchedTitle: { height: RFValue(50), width: RFValue(50) },
  searchedTitleWrapper: {
    flexDirection: "row",
    paddingHorizontal: RFValue(20),
    paddingVertical: RFValue(3),
  },
});
export default AddOtherActivity = React.memo(AddOtherActivity);
