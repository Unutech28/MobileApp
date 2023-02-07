// @ts-nocheck
import GLOBALS from "@constants";
import * as ICONS from "@images";
import React, { useState } from "react";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  TextInput,
  View,
} from "react-native";
import { getStatusBarHeight } from "react-native-iphone-x-helper";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import FAIcon from "react-native-vector-icons/FontAwesome";
const { FONTS, COLOR, STRINGS } = GLOBALS;
const { PRIMARY, WHITE, GREY, DARKGREY } = COLOR;
const isiOS = Platform.OS == "ios";
function SearchBar(props) {
  let {
    isLeftIcon = false,
    onLeftIconClick = () => { },
    isTitle = false,
    isRightIcon = false,
    findText,
    onRightIconClick = () => { },
    isSearchActive = false,
  } = props;
  const [searchText, setsearchText] = useState("");
  let userProp = {
    inputText: "",
    data: null,
    keyToSearch: "",
    isActive: isSearchActive,
  };
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {isLeftIcon == true ? (
          <TouchableWithoutFeedback onPress={() => onLeftIconClick()}>
            <View
              style={[
                styles.section,
                { justifyContent: "center", paddingTop: isiOS ? 2 : 5 },
              ]}
            >
              <Image
                source={ICONS.LeftArrow}
                resizeMode="contain"
                style={styles.capImage}
              />
            </View>
          </TouchableWithoutFeedback>
        ) : null}
        {isTitle == true ? (
          <View style={[styles.section, { flex: 3 }]}>
            <View style={styles.capTitle}>
              <TextInput
                style={{
                  fontFamily: FONTS.LIGHT,
                  fontSize: RFValue(17),
                  borderBottomWidth: 1,
                }}
                editable={true}
                value={searchText}
                textAlignVertical={"center"}
                maxLength={50}
                textAlign={"center"}
                placeholder={""}
                placeholderTextColor={GREY}
                onBlur={() => { }}
                underlineColorAndroid={"transparent"}
                onChangeText={(title) => (
                  setsearchText(title),
                  findText({ ...userProp, inputText: title })
                )}
                onSubmitEditing={() =>
                  findText({ ...userProp, inputText: searchText })
                }
              />
            </View>
          </View>
        ) : null}
        {isRightIcon == true ? (
          <TouchableWithoutFeedback onPress={() => onRightIconClick()}>
            <View
              style={[
                styles.rightIcon,
                { justifyContent: "center", paddingTop: isiOS ? 0 : 10 },
              ]}
            >
              <FAIcon
                name="close"
                size={25}
                color={DARKGREY}
                style={{ alignSelf: "center", marginRight: RFPercentage(1) }}
              />
            </View>
          </TouchableWithoutFeedback>
        ) : null}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    marginLeft: RFPercentage(2.5),
    marginTop: isiOS ? getStatusBarHeight() : 0,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: RFPercentage(11),
  },
  section: {
    flex: 0.5,
    overflow: "hidden",
  },
  capTitle: {
    justifyContent: "center",
    flex: 1,
    paddingHorizontal: RFPercentage(isiOS ? 0.8 : 1.2),
    overflow: "hidden",
  },
  capImage: {
    height: RFPercentage(isiOS ? 4 : 5),
    width: RFPercentage(isiOS ? 4 : 5),
    alignSelf: "flex-start",
  },
  capTitleText: {
    fontFamily: FONTS.REGULAR,
    fontSize: RFValue(isiOS ? 22 : 23),
    color: COLOR.GREY,
    alignSelf: "flex-start",
  },
  details: {
    flex: 1,
    paddingHorizontal: 0,
    overflow: "hidden",
  },
  detailsText: {
    fontFamily: FONTS.LIGHT,
    fontSize: RFValue(16),
    color: COLOR.GREY,
  },
  shiftStyle: {
    fontFamily: FONTS.REGULAR,
    fontSize: RFValue(20),
    color: COLOR.DARKGREY,
    justifyContent: "center",
    marginVertical: RFPercentage(2.5),
  },
  check: {
    height: RFPercentage(isiOS ? 3.5 : 4),
    width: RFPercentage(isiOS ? 3.5 : 4),
    alignSelf: "center",
  },
  rightIcon: {
    flex: 1
  },
});
export default (SearchBar = React.memo(SearchBar));
