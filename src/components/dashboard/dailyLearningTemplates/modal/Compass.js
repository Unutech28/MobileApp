import React, { useState, lazy, useEffect, useRef } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Image,
  FlatList,
  LayoutAnimation,
  UIManager,
  Modal,
} from "react-native";
import ButtonNew from "@components/common/buttonNew";
import Icon from "react-native-vector-icons/MaterialIcons";
import tempStyle from "@components/dashboard/dailyLearningTemplates/globalTemplateStyle";
import {
  ShowHtmlText,
  CardTitle,
  LikeElement,
} from "@components/dashboard/dailyLearningTemplates/templateElements";
import moment from "moment";
import CustomPicker from "@components/dashboard/dailyLearningTemplates/modal/CustomPicker.js";
import DatePicker from "react-native-date-picker";

// import DatePicker from 'react-native-datepicker';

import IoniIcon from "react-native-vector-icons/Ionicons";
import Icon2 from "react-native-vector-icons/AntDesign";
import * as Images from "@images";
import { strings } from "@localization";
import { useSelector } from "react-redux";
import { RFValue } from "react-native-responsive-fontsize";
import Ionicons from "react-native-vector-icons/Ionicons";
import GLOBALS from "@constants";
import { screenHeight, screenWidth } from "@utils/Styles";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { alertWithOneBtn } from "@helpers/common";

const { FONTS, COLOR, STRINGS } = GLOBALS;
const { REGULAR } = FONTS;
const { SOFT_GRAY, DARK_GREEN, WHITE, BLACK } = COLOR;
const Header = lazy(() => import("@components/common/Header"));
const { width, height } = Dimensions.get("window");

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const Compass = (props) => {
  let {
    user_language,
    modal_data,
    closeModal,
    cardData,
    pickerValue,
    onSubmit,
  } = props;

  const [list_data, setList] = useState([]);
  /**Initialize bottom header value */
  const [bottomHeaderData, setBottomHeaderData] = useState([]);
  const [drop_down_value, setValue] = useState("Select...");
  const [drop_down_value1, setValue1] = useState("Select...");
  const [isShow, setIsShow] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showPicker, togglePickerModal] = useState(false);
  const [pickerData, setModalData] = useState(pickerValue);

  const [editedArrayIndex, setEditidArrayIndex] = useState(0);
  const [temp, setTemp] = useState(0);
  const [dateIndex, setDateIndex] = useState(0);
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  const reducerData = useSelector((state) => {
    return state.cardsReducer.currentCard;
  });
  let datePickerRef = useRef();

  useEffect(() => {
    setList(modal_data);
    setDefaultDropDown();
  }, []);
  useEffect(() => {}, [temp]);

  /**Initilize array for bottom commitment data */
  const setDefaultDropDown = () => {
    // setBottomHeaderData(modal_data);
    let commitment_header = [];
    modal_data.map((outer, outer_index) => {
      let commitment_data = [];
      let inner_commitment_header = outer.filter(
        (item) => item.headerType != "valueHeader"
      );
      inner_commitment_header[0]?.answers?.map((m, ind) => {
        commitment_data.push({
          act: inner_commitment_header[0].answers[ind].act,
          behave: inner_commitment_header[1].answers[ind].behave,
          date: inner_commitment_header[2].answers[ind].date,
          act_header: inner_commitment_header[0].answers[ind].act_header,
          behave_header: inner_commitment_header[1].answers[ind].behave_header,
          is_added: inner_commitment_header[0].answers[ind].is_added,
          type: "commitment",
          //  order: inner_commitment_header[0].answers[ind].order,
        });
      });
      commitment_header = Object.assign([], commitment_header, {
        [outer_index]: commitment_data,
      });
    });
    setBottomHeaderData(commitment_header);
  };

  /**Show dynamic clor in header */
  const boxBackgroundColor = (order) => {
    if (order === 0) {
      return COLOR.CIRCLE_GRAY;
    } else {
      return COLOR.DARK_GREEN;
    }
  };

  const toggleShowView = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (index == selectedIndex && isShow) {
      setIsShow(false);
    } else {
      setIsShow(true);
    }
  };

  /**Modify the answer key on text input change */
  const onTextValueChange = (value, inner_index, outer_index) => {
    let headerData = list_data;
    let current_answer = headerData[editedArrayIndex][inner_index].answers[0];
    current_answer = Object.assign({}, current_answer, {
      answer: value,
    });

    let current_header_ans = Object.assign(
      [],
      headerData[outer_index][inner_index].answers,
      {
        [0]: current_answer,
      }
    );
    dataModify(inner_index, outer_index, current_header_ans);
  };

  /**Modify Final Array of top input header*/
  const dataModify = (inner_index, outer_index, current_header_ans) => {
    let array = Array.from(list_data);
    let all_current_header_ans = Object.assign(
      {},
      array[outer_index][inner_index],
      {
        answers: current_header_ans,
      }
    );
    let modifyHeader = Object.assign([], array[outer_index], {
      [inner_index]: all_current_header_ans,
    });

    array[outer_index] = modifyHeader;
    setList(array);
    return;
    // setBottomHeaderData(array);
  };

  /**Action handler for bottom commitment fileds */
  const commitmentClick = (type, data, index, inner_index) => {
    switch (type) {
      case "text_input":
        {
          let modified_obj = Object.assign(
            {},
            bottomHeaderData[editedArrayIndex][index],
            {
              date: data,
            }
          );
          let data1 = Object.assign([], bottomHeaderData[editedArrayIndex], {
            [index]: modified_obj,
          });
          let final = Object.assign([], bottomHeaderData, {
            [editedArrayIndex]: data1,
          });
          setBottomHeaderData(final);
        }
        break;
      case "plus":
        let current_answer = bottomHeaderData[editedArrayIndex];

        current_answer = Object.assign({}, current_answer[data], {
          is_added: true,
          act: drop_down_value,
          behave: drop_down_value1,
          actContentIndex: editedArrayIndex + 1,
          behaveContentIndex: editedArrayIndex + 1,
          dateContentIndex: editedArrayIndex + 1,
        });

        let current_header_ans = Object.assign(
          [],
          bottomHeaderData[editedArrayIndex],
          {
            [data]: current_answer,
          }
        );
        let empty_obj = {
          act: "",
          behave: "",
          date: "",
          act_header: bottomHeaderData[editedArrayIndex][data].act_header,
          behave_header: bottomHeaderData[editedArrayIndex][data].behave_header,
          is_added: false,
        };
        current_header_ans.push(empty_obj);
        let finalData = Object.assign([], bottomHeaderData, {
          [editedArrayIndex]: current_header_ans,
        });
        setValue("Select...");
        setValue1("Select...");
        setTemp(temp + 1);
        setBottomHeaderData(finalData);
        break;
      case "delete_row":
        let filter_data = bottomHeaderData[editedArrayIndex].filter(
          (ele, ele_index) => ele_index != index
        );
        let array5 = bottomHeaderData;
        array5[editedArrayIndex] = filter_data;
        setTemp(temp + 1);
        setBottomHeaderData(array5);
        break;
      default:
        break;
    }
  };

  /**Show Text input header Top header */
  const renderTopHeader = (item, index, pIndex) => {
    return (
      item.headerType == "valueHeader" && (
        <View style={styles.ToContainer}>
          {index !== 0 && (
            <View
              style={[
                styles.headings,
                {
                  backgroundColor: boxBackgroundColor(index),
                  alignSelf: "center",
                },
              ]}
            >
              <Text style={styles.headingText}>{item.addHeader}</Text>
            </View>
          )}
          <View
            style={{
              marginTop: RFValue(10),
              width: "100%",
              alignItems: "center",
            }}
          >
            <TextInput
              multiline={true}
              placeholder={item.placeholder}
              style={[
                tempStyle.queTextInputAreaStyle,
                {
                  backgroundColor: COLOR.LightGrayTextinput,
                  borderWidth: 0,
                  height: RFValue(60),
                  width: "95%",
                },
              ]}
              value={item.answers[0]?.answer}
              maxLength={2000}
              selectionColor={"green"}
              underlineColorAndroid={"transparent"}
              placeholderTextColor={"gray"}
              onChangeText={(text) => {
                onTextValueChange(text, index, pIndex);
              }}
            />
          </View>
        </View>
      )
    );
  };
  /**Show commitment header data bottom header*/
  const renderBottomHeader = (item, index) => {
    return (
      item.headerType != "valueHeader" && (
        <View style={styles.ToContainer}>
          <View
            style={[
              styles.headings,
              {
                backgroundColor: COLOR.YELLOW,
                minHeight: RFValue(45),
                minWidth: "95%",
              },
            ]}
          >
            <Text style={styles.headingText}> {item.addHeader}</Text>
            <View style={styles.circleView}>
              <Text style={styles.headingText}>{index + 1}</Text>
            </View>
          </View>
        </View>
      )
    );
  };

  /**Show bottom commitment fields */
  const showBottomTextInput = (outer_index) => {
    return bottomHeaderData[outer_index]?.map((item, index) => {
      return (
        <View
          style={{
            width: "100%",
            alignItems: "center",
          }}
        >
          {index > 0 && (
            <View
              style={{
                height: 5,
                width: width / 1.2,
                backgroundColor: COLOR.YELLOW,
                marginTop: 10,
              }}
            />
          )}
          <View style={[styles.ToContainer]}>
            <TouchableOpacity
              onPress={() => {
                if (item.is_added == false) {
                  setModalData({
                    current_data: item,
                    index: 1,
                    selectedValue: drop_down_value,
                    item: cardData?.otherAttribute.content1,
                  });
                  togglePickerModal(true);
                }
              }}
              style={[
                styles.headings,
                {
                  marginHorizontal: 0,
                  backgroundColor: COLOR.LightGrayTextinput,
                  height: RFValue(45),
                  minWidth: "95%",
                  alignSelf: "center",
                },
              ]}
            >
              <Text
                style={{
                  fontSize: 15,
                  width: "90%",
                  alignSelf: "flex-start",
                  paddingLeft: 5,
                }}
              >
                {!item.is_added ? drop_down_value : item.act}
              </Text>
              <View
                style={[
                  styles.circleView,
                  { backgroundColor: COLOR.CIRCLE_GRAY },
                ]}
              >
                <Text style={styles.headingText}>{index + 1}</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={[styles.ToContainer]}>
            <TouchableOpacity
              onPress={() => {
                if (item.is_added == false) {
                  setModalData({
                    current_data: item,
                    index: 2,
                    selectedValue: drop_down_value1,
                    item: cardData?.otherAttribute.content2,
                  });
                  togglePickerModal(true);
                }
              }}
              style={[
                styles.headings,
                {
                  marginHorizontal: 0,
                  backgroundColor: COLOR.LightGrayTextinput,
                  height: RFValue(45),
                  minWidth: "95%",
                  alignSelf: "center",
                },
              ]}
            >
              <Text
                style={{
                  fontSize: 15,
                  width: "90%",
                  alignSelf: "flex-start",
                  paddingLeft: 5,
                }}
              >
                {!item.is_added ? drop_down_value1 : item.behave}
              </Text>
              <View
                style={[
                  styles.circleView,
                  { backgroundColor: COLOR.CIRCLE_GRAY },
                ]}
              >
                <Text style={styles.headingText}>{index + 1}</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.ToContainer}>
            <View
              style={[
                styles.headings,
                {
                  marginHorizontal: 0,
                  backgroundColor: COLOR.LightGrayTextinput,
                  height: RFValue(45),
                  alignItems: "flex-start",
                  paddingHorizontal: RFValue(20),
                  minWidth: "95%",
                },
              ]}
            >
              <TouchableOpacity
                style={{ width: "100%" }}
                onPress={() => {
                  if (item.is_added == false) {
                    setDateIndex(index);
                    setOpen(true);
                  }
                }}
              >
                <Text>{item.date ? item.date : "dd/mm/yyy"}</Text>
              </TouchableOpacity>

              <View
                style={[
                  styles.circleView,
                  { backgroundColor: COLOR.CIRCLE_GRAY, alignSelf: "center" },
                ]}
              >
                <Text style={styles.headingText}>{index + 1}</Text>
              </View>
              {item.is_added == false ? (
                <TouchableOpacity
                  onPress={() => {
                    if (
                      item.date != "" &&
                      drop_down_value != "" &&
                      drop_down_value1 != ""
                    ) {
                      commitmentClick("plus", index);
                    }
                  }}
                  style={styles.addButton}
                >
                  <IoniIcon
                    name={"add-circle"}
                    size={RFValue(30)}
                    color={
                      item.date == "" ||
                      drop_down_value == "" ||
                      drop_down_value1 == ""
                        ? COLOR.PRIMARY
                        : COLOR.DarkGray
                    }
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => commitmentClick("delete_row", item, index)}
                  style={styles.removeButton}
                >
                  <Icon name={"cancel"} size={25} color={COLOR.CINNABAR} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      );
    });
  };

  const onSaveHandler = () => {
    let final_bottom = bottomHeaderData[editedArrayIndex].filter(
      (item) => item.is_added != false
    );
    let topHeaderValid = true;
    list_data[editedArrayIndex]
      .filter((item) => item.headerType == "valueHeader")
      .map((m) => {
        if (m.answers[0].answer == "") {
          topHeaderValid = false;
        }
      });
    if (final_bottom.length == 0 || !topHeaderValid) {
      alertWithOneBtn(strings.PERFORM_EXERCISE);
      return;
    }
    let submit_user_header = list_data[editedArrayIndex].map((m) => {
      return {
        ...m,
        answers:
          m.headerType == "valueHeader"
            ? m.answers
            : bottomHeaderData[editedArrayIndex],
      };
    });
    let final_data = Object.assign([], list_data, {
      [editedArrayIndex]: submit_user_header,
    });
    onSubmit(final_data);
  };
  return (
    <View style={styles.outer_container}>
      <TouchableOpacity
        hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}
        onPress={() => closeModal()}
      >
        <Ionicons
          name={"close"}
          size={40}
          color={COLOR.CIRCLE_GRAY}
          style={{
            padding: 10,
            marginTop: 20,
          }}
        />
      </TouchableOpacity>
      <View style={styles.container}>
        <FlatList
          style={{ padding: 10 }}
          data={list_data}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => {
            return (
              <View
                style={{
                  marginTop: RFValue(20),
                  width: "100%",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setSelectedIndex(index);
                    toggleShowView(index);
                    setEditidArrayIndex(index);
                  }}
                  style={[
                    styles.headings,
                    { backgroundColor: COLOR.CIRCLE_GRAY },
                  ]}
                >
                  {isShow && editedArrayIndex == index ? (
                    <Text style={styles.headingText}> {item[0].addHeader}</Text>
                  ) : (
                    <Text style={styles.headingText}>
                      {" "}
                      {item[0].answers.length > 0
                        ? item[0].answers[0].answer
                        : ""}
                    </Text>
                  )}

                  <View
                    style={[
                      styles.circleView,
                      { backgroundColor: COLOR.CIRCLE_GRAY },
                    ]}
                  >
                    <Text style={styles.headingText}>{index + 1}</Text>
                  </View>
                  <View style={[styles.circleViewWithArrow]}>
                    {isShow && selectedIndex == index ? (
                      <Icon2 name={"up"} size={16} color={COLOR.BLACK} />
                    ) : (
                      <Icon2 name={"down"} size={16} color={COLOR.BLACK} />
                    )}
                  </View>
                </TouchableOpacity>
                {isShow &&
                  selectedIndex == index &&
                  item.map((item, i) => {
                    return renderTopHeader(item, i, index);
                  })}
                {isShow && selectedIndex == index && (
                  <>
                    <View style={styles.ToContainer}>
                      <View
                        style={[
                          styles.headings,
                          {
                            backgroundColor: boxBackgroundColor(0),
                            width: "95%",
                            alignSelf: "center",
                          },
                        ]}
                      >
                        <ShowHtmlText
                          contentWidth={width}
                          source={{
                            html: cardData?.otherAttribute?.heading,
                          }}
                        />
                      </View>
                    </View>
                    <View>
                      {item
                        .filter((item) => item.headerType == "commitmentHeader")
                        .map((inner_item, i) => {
                          return renderBottomHeader(inner_item, i, index);
                        })}
                    </View>
                    <View>
                      {bottomHeaderData != undefined
                        ? showBottomTextInput(index)
                        : null}
                    </View>
                    <View />

                    <View
                      style={{ marginVertical: RFValue(15), width: "100%" }}
                    >
                      <ButtonNew
                        text={"save"}
                        onBtnPress={() => {
                          onSaveHandler();
                        }}
                      />
                    </View>
                  </>
                )}
              </View>
            );
          }}
          ListEmptyComponent={() => {
            return (
              <View style={styles.emptyViewStyle}>
                <Text style={styles.emptyText}>No result found</Text>
              </View>
            );
          }}
        />
      </View>

      {showPicker && (
        <View
          style={{
            width: "100%",
            zindex: 100,
            position: "absolute",
            height: "100%",
          }}
        >
          <CustomPicker
            modal_data={pickerData}
            user_language={user_language}
            closeModal={() => {
              togglePickerModal(false);
            }}
            selectedValue={(data) => {
              togglePickerModal(false);
              pickerData.index == 1
                ? setValue(data.addContent)
                : setValue1(data.addContent);
            }}
          />
        </View>
      )}
      <DatePicker
        mode={"date"}
        modal
        minimumDate={new Date()}
        open={open}
        date={date}
        onConfirm={(date) => {
          setOpen(false);
          setDate(date);
          commitmentClick(
            "text_input",
            moment(date).format("DD/MM/yyyy"),
            dateIndex
          );
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />
    </View>
  );
};

export default Compass;

const styles = StyleSheet.create({
  outer_container: {
    flex: 1,
    // backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: "center",
    // padding: 10,
    borderRadius: 10,
    backgroundColor: COLOR.WHITE,
    zIndex: -100,
  },

  container: {
    flex: 1,
    borderRadius: 10,
    paddingHorizontal: 5,
    // paddingHorizontal: 5,
    //    justifyContent: 'center'
  },

  ToContainer: {
    width: "100%",
    marginTop: RFValue(10),
    justifyContent: "center",
    // alignItems: 'center',
  },
  headings: {
    width: "95%",
    minHeight: RFValue(35),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: RFValue(5),
    paddingHorizontal: RFValue(10),
  },
  headingText: {
    fontSize: RFValue(14),
    fontFamily: FONTS.SEMI_BOLD,
    color: COLOR.WHITE,
  },
  circleView: {
    height: RFValue(20),
    width: RFValue(20),
    borderRadius: RFValue(10),
    backgroundColor: COLOR.YELLOW,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    left: RFValue(-10),
    borderColor: COLOR.WHITE,
    borderWidth: 2,
    zIndex: 2000,
  },
  addButton: {
    position: "absolute",
    right: RFValue(-10),
  },
  removeButton: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",

    right: RFValue(-10),
    zIndex: 1000,
    // backgroundColor: 'red',
    // height: RFValue(20),
    // width: RFValue(20),
    // borderRadius: RFValue(10),
  },
  emptyText: {
    fontFamily: REGULAR,
    color: COLOR.BLACK,
    fontSize: RFValue(20),
  },
  emptyViewStyle: {
    width: "100%",
    alignItems: "center",
  },
  circleViewWithArrow: {
    height: RFValue(20),
    width: RFValue(20),
    borderRadius: RFValue(10),
    backgroundColor: COLOR.yellow,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    right: RFValue(5),
    top: RFValue(-5),
  },
});
