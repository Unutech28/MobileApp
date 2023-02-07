import ButtonNew from "@components/common/buttonNew";
import GLOBALS from "@constants";
import * as Images from "@images";
import React, { useState, lazy, useEffect } from "react";
import Icon from "react-native-vector-icons/FontAwesome5";
import {
  Image,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { alertWithOneBtn } from "@helpers/common";
import { strings } from "@localization";
import { shallowEqual, useSelector } from "react-redux";
import { RFValue, RFPercentage } from "react-native-responsive-fontsize";
const { FONTS, COLOR, STRINGS } = GLOBALS;
const { PRIMARY, WHITE, GREY, DARKGREY } = COLOR;
import { screenHeight } from "@utils/Styles";
const Header = lazy(() => import("@components/common/Header"));
const isIOS = Platform.OS === "ios";
const Personalization = (props) => {
  const reducerData = useSelector((state) => {
    return state.dashboardReducer;
  });
  //   let selectedArray = reducerData.getKeywordResponse.map((item, i) => {
  //     item.isSelected = false
  // return item
  //   });
  let selectedArray = [];
  const [selectedItems, setSelectedItems] = useState(selectedArray);
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [userKey, setUserKey] = useState([]);

  useEffect(() => {
    let keys = [...reducerData.getKeywordResponse];
    keys.map((item, i) => {
      item.isSelected = false;
      return item;
    });
    let words = Array.from(props.data);
    let key = Array.from(userKey);
    selectedArray = Array.from(selectedItems);
    words.map((item, i) => {
      props.userDetails.keywords.map((keys) => {
        if (keys.keyword == item.keyword) {
          {
            item.isSelected = true;
            selectedArray.push(keys.keyword);
            key.push({ _id: keys._id, keyword: keys.keyword });
          }
        }
      });
    });
    setData(keys);
    setSearchData(words);
    setSelectedItems(selectedArray);
    setUserKey(key);
  }, []);

  const onItemPress = (selectedItem, index) => {
    let array = Array.from(data);
    selectedArray = Array.from(selectedItems);
    let key = Array.from(userKey);

    array.map((item, i) => {
      if (i == index) {
        if (!item.isSelected) {
          selectedArray.push(selectedItem.keyword);
          key.push({ _id: selectedItem._id, keyword: selectedItem.keyword });
        } else {
          removeSelectedItem(selectedItem.keyword);
          removeKeyword(selectedItem.keyword);
        }
        item.isSelected = !item.isSelected;
      }
    });

    setData(array);
    setSelectedItems(selectedArray);
    setUserKey(key);
  };

  // for search data from array
  const onSearch = (searchText) => {
    setSearchText(searchText);
    let filteredData = searchData.filter(function (item) {
      let data = JSON.stringify(item);
      return data.toLowerCase().includes(searchText.toLowerCase());
    });
    setData(filteredData);
  };

  const removeSelectedItem = (itemName) => {
    selectedArray = Array.from(selectedItems);

    let index;
    selectedArray.map((item, i) => {
      if (item == itemName) {
        selectedArray.splice(i, 1);
      }
    });

    setSelectedItems(selectedArray);
  };

  const removeKeyword = (itemName) => {
    let key = Array.from(userKey);
    key.map((item, i) => {
      if (item.keyword == itemName) {
        key.splice(i, 1);
      }
    });
    setTimeout(() => {
      setUserKey(key);
    }, 100);
  };

  const removeCheckedItem = (itemName) => {
    let array = Array.from(data);

    array.map((item, i) => {
      if (item.keyword == itemName) {
        item.isSelected = !item.isSelected;
      }
    });

    setData(array);
    setSearchData(array);
  };

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          onItemPress(item, index);
        }}
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingBottom: RFValue(10),
        }}
      >
        {item.isSelected ? (
          <Image
            style={{ width: 20 }}
            resizeMode="contain"
            source={Images.Checked}
          />
        ) : (
          <Image
            style={{ width: 20 }}
            resizeMode="contain"
            source={Images.UnChecked}
          />
        )}

        <Text
          style={[
            styles.titleText,
            { marginBottom: RFValue(0), paddingLeft: RFValue(10) },
          ]}
        >
          {item.keyword}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Header
        isLeftIcon={true}
        isRightIcon={false}
        onLeftIconClick={() => {
          props.closeModal();
        }}
        isLogout={false}
        isTitle={true}
        title={strings.Account.personalization}
        titleStyle={{ fontSize: RFValue(25), paddingTop: RFValue(10) }}
      />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={styles.outerContainer}
        nestedScrollEnabled={true}
      >
        <View>
          <View style={styles.inputContainer}>
            <TextInput
              onChangeText={(text) => {
                onSearch(text);
              }}
              style={[styles.chatView, {}]}
              placeholder={strings.Account.search}
              placeholderTextColor={"#454D58"}
              value={searchText}
              selectionColor={COLOR.PRIMARY}
            />
            <Image
              source={Images.greenSearch}
              resizeMode="contain"
              style={{
                position: "absolute",
                right: 0,
                top: Platform.OS == "ios" ? RFValue(5) : RFValue(0),
                // zIndex: 10,
              }}
            />
          </View>
        </View>
        <View style={styles.ListView}>
          <FlatList
            data={data}
            nestedScrollEnabled={true}
            keyExtractor={(item, index) => {
              item + index.toString();
            }}
            renderItem={renderItem}
            ListEmptyComponent={() => {
              return (
                <View
                  style={{
                    width: "100%",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.titleText}>
                    {strings.points.No_data_found}
                  </Text>
                </View>
              );
            }}
          />
        </View>
        <View
          style={{
            marginTop: RFValue(20),
          }}
        >
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              width: "100%",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                width: "100%",
                alignItems: "center",
                // justifyContent: "center",
              }}
            >
              {selectedItems.map((item, i) => {
                return (
                  <View
                    style={{
                      alignItems: "center",
                      backgroundColor: "#6545B2",
                      margin: RFValue(5),
                      padding: RFValue(10),
                      borderRadius: RFValue(10),
                      flexDirection: "row",
                    }}
                  >
                    <Text style={styles.buttonText}>{item}</Text>
                    <TouchableOpacity
                      onPress={() => {
                        removeSelectedItem(item);
                        removeCheckedItem(item);
                        removeKeyword(item);
                      }}
                    >
                      <Icon
                        name={"times"}
                        size={20}
                        color={COLOR.WHITE}
                        style={{ marginLeft: RFValue(10) }}
                      />
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
        <View style={styles.submitContainer}>
          <ButtonNew
            text={strings.profile.save.toUpperCase()}
            onBtnPress={() => {
              if (
                userKey.length == 0 &&
                props.userDetails.keywords.length == 0
              ) {
                alertWithOneBtn(
                  strings.validation.Error,
                  strings.validation.EmptyPersonalization,
                  GLOBALS.STRINGS.LOGOUT_OK
                );
              } else {
                props.saveKeys(userKey);
                props.closeModal();
              }
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.WHITE,
  },
  outerContainer: {
    backgroundColor: WHITE,
    flex: 1,
    marginVertical: 20,
    paddingHorizontal: RFValue(20),
  },
  textContainer: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginTop: RFValue(32),
    marginLeft: RFValue(12),
  },
  heading: {
    fontFamily: FONTS.BOLD,
    fontSize: RFValue(40),
    fontWeight: "600",
    color: COLOR.SOFT_GRAY,
  },
  img: { width: RFPercentage(18), height: RFPercentage(6) },
  emailText: {
    color: DARKGREY,
    fontFamily: FONTS.REGULAR,
    ...(isIOS
      ? {
          fontSize: RFValue(17),
          marginTop: 8,
        }
      : {
          fontSize: RFValue(18),
          marginTop: 16,
        }),
  },
  emailInput: {
    fontFamily: FONTS.LIGHT,
    fontSize: RFValue(17),
    borderBottomWidth: 0.4,
    borderBottomColor: PRIMARY,
    padding: 0,
    ...(isIOS
      ? {
          marginTop: 10,
          borderBottomWidth: 0.4,
        }
      : {
          marginTop: 6,
          borderBottomWidth: 1,
        }),
    backgroundColor: "transparent",
    color: "dark" ? DARKGREY : DARKGREY,
  },
  helperText: {
    marginBottom: 20,
    color: COLOR.ERROR,
    marginTop: RFValue(8),
  },
  buttonText: {
    fontSize: RFValue(12),
    color: COLOR.WHITE,
    fontFamily: FONTS.BOLD,
  },
  bgView: {
    width: RFPercentage(56.5),
    height: RFPercentage(56),
    justifyContent: "center",
    alignItems: "center",
    padding: RFValue(24),
    resizeMode: "cover",
  },
  imageView: { flex: 0.3, justifyContent: "center" },
  capText: {
    fontFamily: FONTS.REGULAR,
    fontSize: RFValue(32),
    color: COLOR.WHITE,
  },
  longText: {
    fontFamily: FONTS.LIGHT,
    fontSize: RFValue(18),
    color: COLOR.WHITE,
  },
  secondViewStyle: {
    backgroundColor: "transparent",
    width: "100%",
    paddingHorizontal: RFValue(24),
    paddingVertical: RFValue(8),
  },
  imageStyle: {
    width: "100%",
    height: Platform.OS == "ios" ? RFPercentage(38) : RFPercentage(46),
    tintColor: COLOR.PRIMARY1,
  },
  forgotPassStyle: {
    marginBottom: 20,
    marginTop: RFValue(5),
    alignSelf: "flex-end",
  },

  submitContainer: {
    justifyContent: "center",
    marginVertical: 20,
  },
  titleText: {
    fontFamily: FONTS.REGULAR,
    fontSize: RFValue(18),
    color: COLOR.SOFT_GRAY,
  },

  chatView: {
    // marginBottom: RFPercentage(1.5),
    paddingLeft: RFValue(10),
    // height: RFPercentage(7),
    width: "80%",
    justifyContent: "space-between",
    // marginTop: RFPercentage(2.5),

    fontSize: RFValue(14),
    fontFamily: FONTS.MEDIUM,
    // backgroundColor: WHITE,
  },
  ListView: {
    borderColor: "#6545B261",
    borderWidth: 1,
    borderRadius: RFPercentage(1.5),
    marginTop: 10,
    shadowColor: PRIMARY,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.46,
    shadowRadius: 11.14,
    elevation: 17,
    backgroundColor: WHITE,
    padding: 10,
    height: screenHeight / 3,
  },
  inputContainer: {
    // flex: 1,
    // borderWidth: 1,
    // borderRadius: 8,
    // borderColor: COLOR.DARK_GREEN,
    backgroundColor: COLOR.WHITE,
    paddingHorizontal: 5,
    borderWidth: 2,
    shadowColor: PRIMARY,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.46,
    shadowRadius: 11.14,
    elevation: 17,
    borderColor: "#6545B261",
    borderRadius: RFPercentage(1.5),
    height: RFValue(50),
    justifyContent: "center",
  },
  commentInput: {
    height: RFValue(50),
    color: COLOR.BLACK,
    // fontSize: 17,
    fontFamily: FONTS.MEDIUM,
    // textAlignVertical: "top",
    backgroundColor: COLOR.WHITE,
  },
});

export default SelectModal = Personalization;
