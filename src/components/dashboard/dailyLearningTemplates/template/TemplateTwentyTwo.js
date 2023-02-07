import tempStyle from "@components/dashboard/dailyLearningTemplates/globalTemplateStyle";
import GLOBALS from "@constants";
import * as ICONS from "@images";
import React, { useState, useRef, useEffect } from "react";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

import ButtonNew from "@components/common/buttonNew";
import DropDownPicker from "../../../../updatedNodeModules/react-native-dropdown-picker";
import DatePicker from "react-native-datepicker";
// import Icon from 'react-native-vector-icons/AntDesign';

import {
  checkHeaderData,
  showEmptyAlert,
  templateValidation,
} from "../utilities";
import Icon from "react-native-vector-icons/MaterialIcons";

import {
  //   Image,
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  ActivityIndicator,
  Linking,
  TextInput,
} from "react-native";
const { FONTS, COLOR } = GLOBALS;
import * as AppActions from "@actions";
import {
  ImageElement,
  ShowHtmlText,
  CardTitle,
  LikeElement,
} from "@components/dashboard/dailyLearningTemplates/templateElements";
import { useSelector, useDispatch } from "react-redux";

import IoniIcon from "react-native-vector-icons/Ionicons";

const { width, height } = Dimensions.get("window");
function TemplateTwentyTwo(props) {
  let { cardData, onCommentClick, onSubmit, cardState } = props;
  const [data, setData] = useState([]);
  const [temp, setTemp] = useState(0);
  const [userActionsData, setUserActionData] = useState(
    cardData?.action?.user_response
  );

  // let arrayData = Array.from(userActionsData);
  let arrayData;

  useEffect(() => {
    let array = [];
    let user_input_response = cardData?.action?.user_response
      ? cardData?.action?.user_response
      : [];
    if (
      cardData?.otherAttribute &&
      cardData?.otherAttribute?.options?.length > 0
    ) {
      cardData?.otherAttribute?.options.map((m) => {
        let matched_index = -1;
        matched_index = user_input_response.findIndex(
          (x) => x.header_id === m.header_id
        );
        array.push({
          ...m,
          value:
            matched_index > -1
              ? user_input_response[matched_index].value
              : addEmptyRow([]),
        });
      });
      setData(array);
      arrayData = array;
    }
    !cardData?.action?.user_response
      ? setTimeout(() => {
          getOtherTemplatesData();
        }, 300)
      : null;
  }, [cardData]);

  useEffect(() => {}, [temp]);

  const getOtherTemplatesData = async () => {
    const template19 = await dispatch(
      AppActions.getcardDataforTemplate22List(
        cardData?.otherAttribute?.supportNetworks
      )
    );

    const template22 = await dispatch(
      AppActions.getcardDataforTemplate22List(
        cardData?.otherAttribute?.supportNeeds
      )
    );

    let array = [];
    let array2 = [];

    template22.action.user_response.map((value, outerIndex) => {
      value.value.map((item, index) => {
        if (item.is_added) {
          array.push({
            answer: item.answer,
            is_added: true,
            order: index,
            type: "second",
            outer_index: outerIndex,
            inner_index: index,
            param: { value: item.answer ? item.answer : "", type: "first" },
            header: value.header,
          });
        }
      });
    });
    let userArray = [];
    template19.action.user_response.exercise_1.map((value, outerIndex) => {
      value.value.map((item, index) => {
        if (item.is_added) {
          userArray.push({
            answer: item.answer,
            is_added: true,
            order: index,
            type: "first",
            outer_index: outerIndex,
            inner_index: index,
            param: { value: item.answer ? item.answer : "", type: "first" },
            header: value.contentTitle,
          });
        }
      });
    });

    let final_array = [];
    userArray.map((first, index) => {
      let array = [{ ...first }];
      final_array.push(array);
    });
    array.map((second, index) => {
      final_array[index].push(second);
    });

    let userAction = arrayData;
    userAction.map((action, index) => {
      console.log("User action===>", action);
      final_array.map((item, index) => {
        console.log("item===>", item);
        if (item[0].header.trim() == action.header.trim()) {
          console.log("data from cards 19===>", item);
          // let array = [{ ...item }];
          action.value.push(item);
        }
      });
    });
    setData(userAction);

    setTemp(temp + 1);
  };

  const addDataRow = (item, index, header) => {};

  const addEmptyRow = (item, index, header) => {
    let dafaultInput = [];
    dafaultInput.push(
      {
        answer: "",
        is_added: false,
        type: "first",
        order: 0,
      },
      {
        answer: "",
        is_added: false,
        type: "second",
        order: 0,
      }
    );

    let result = item.concat(dafaultInput).reduce((r, a) => {
      r[a.order] = r[a.order] || [];
      r[a.order].push(a);
      return r;
    }, Object.create(null));
    let ary2D = Object.keys(result).map((key) => {
      return result[key];
    });
    return ary2D;
  };

  const dispatch = useDispatch();

  const onCommentPress = () => {
    dispatch(AppActions.setCommentsArray(cardData.usercomments));
    onCommentClick({ card_id: cardData._id });
  };

  const clickHandler = (type, inner_index, outer_index, param) => {
    switch (type) {
      case "add_row":
        {
          let current_answer = data[outer_index].value[inner_index];
          current_answer = current_answer.map((m, ind) => {
            return {
              ...m,
              is_added: true,
            };
          });
          let current_header_ans = Object.assign([], data[outer_index].value, {
            [inner_index]: current_answer,
          });
          current_header_ans.push([
            {
              answer: "",
              is_added: false,
              type: "first",
              order: current_answer[0].order + 1,
            },
            {
              answer: "",
              is_added: false,
              type: "second",
              order: current_answer[1].order + 1,
            },
          ]);
          dataModify(inner_index, outer_index, current_header_ans);
        }
        break;
      case "delete_row":
        let filter_data = data[outer_index].value.filter(
          (ele, ele_index) => ele_index != inner_index
        );
        filter_data = filter_data.map((m, ind) =>
          m.map((m1, index) => {
            return {
              ...m1,
              order: ind + 1,
            };
          })
        );
        dataModify(inner_index, outer_index, filter_data);
        break;
      case "input_change":
        let current_answer_arr = data[outer_index].value[inner_index];
        current_answer_arr = current_answer_arr.map((m, ind) => {
          return {
            ...m,
            answer:
              param.type == "first" && ind == 0
                ? param.value
                : param.type == "second" && ind == 1
                ? param.value
                : m.answer,
          };
        });
        let current_header_ans = Object.assign([], data[outer_index].value, {
          [inner_index]: current_answer_arr,
        });
        dataModify(inner_index, outer_index, current_header_ans);
        break;
      case "addValues":
        let current_answer = data[outer_index].value[inner_index];
        console.log("input====>", current_answer);
        current_answer = current_answer.map((m, ind) => {
          return {
            ...m,
            answer:
              param.type == "first" && ind == 0
                ? param.value
                : param.type == "second" && ind == 1
                ? param.value
                : m.answer,
            is_added: true,
          };
        });
        let current_header = Object.assign([], data[outer_index].value, {
          [inner_index]: current_answer,
        });
        current_header.push([
          {
            answer: "",
            is_added: false,
            type: "first",
            order: current_answer[0].order + 1,
          },
          {
            answer: "",
            is_added: false,
            type: "second",
            order: current_answer[1].order + 1,
          },
        ]);
        console.log("input2222====>", current_header);
        dataModify(inner_index, outer_index, current_header);
      default:
        break;
    }
  };
  /**Modify Final Array */
  const dataModify = (inner_index, outer_index, current_header_ans) => {
    let array = Array.from(data);
    let all_current_header_ans = Object.assign({}, array[outer_index], {
      value: current_header_ans,
    });
    let modifyHeader = Object.assign([], array, {
      [outer_index]: all_current_header_ans,
    });
    setData(modifyHeader);
  };

  const renderHeaderData = (item, index) => {
    return (
      <View style={styles.ToContainer}>
        <View style={[styles.headings, { backgroundColor: COLOR.CIRCLE_GRAY }]}>
          <Text style={styles.headingText}>{item.header}</Text>
          {item.headerDesc != "" && (
            <Text style={styles.headingDesc}> {item.headerDesc}</Text>
          )}
        </View>
        <View style={[styles.textinputContainer, { marginTop: RFValue(10) }]}>
          <View
            style={[
              styles.headings,
              { backgroundColor: COLOR.BUTTON_ORANGE, width: "33%" },
            ]}
          >
            <Text style={styles.headingText}>{item.leftHeading}</Text>
          </View>
          <View
            style={[
              styles.headings,
              { backgroundColor: COLOR.BUTTON_ORANGE, width: "65%" },
            ]}
          >
            <Text style={styles.headingText}>{item.rightHeading}</Text>
          </View>
        </View>

        {item.value.map((elem, i) => {
          return (
            <View style={[styles.textinputContainer]}>
              <View style={[styles.ToContainer, { width: "35%" }]}>
                <View style={styles.textInputStyle}>
                  <TextInput
                    editable={elem[0]?.is_added == false ? true : false}
                    placeholder={item.leftHeading}
                    style={[
                      tempStyle.queTextInputAreaStyle,
                      styles.inputBoxStyle,
                    ]}
                    value={elem[0]?.answer}
                    maxLength={2000}
                    selectionColor={"green"}
                    underlineColorAndroid={"transparent"}
                    placeholderTextColor={"gray"}
                    onChangeText={(text) => {
                      clickHandler("input_change", i, index, {
                        value: text,
                        type: "first",
                      });
                    }}
                    multiline={true}
                  />
                </View>
              </View>
              <View style={[styles.ToContainer, { width: "65%" }]}>
                <View style={styles.textInputStyle}>
                  <TextInput
                    editable={elem[1]?.is_added == false ? true : false}
                    style={[
                      tempStyle.queTextInputAreaStyle,
                      styles.inputBoxStyle,
                    ]}
                    placeholder={item.rightHeading}
                    value={elem[1]?.answer}
                    maxLength={2000}
                    selectionColor={"green"}
                    underlineColorAndroid={"transparent"}
                    placeholderTextColor={"gray"}
                    onChangeText={(text) => {
                      clickHandler("input_change", i, index, {
                        value: text,
                        type: "second",
                      });
                    }}
                    multiline={true}
                  />
                </View>
                {elem[0].is_added == false && elem[1].is_added == false ? (
                  <TouchableOpacity
                    onPress={() =>
                      elem[0].answer != "" && elem[1].answer != ""
                        ? clickHandler("add_row", i, index)
                        : null
                    }
                    style={styles.addButton}
                  >
                    <IoniIcon
                      name={"add-circle"}
                      size={RFValue(30)}
                      color={
                        elem[0].answer == "" || elem[1].answer == ""
                          ? COLOR.PRIMARY
                          : COLOR.DarkGray
                      }
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => {
                      clickHandler("delete_row", i, index);
                    }}
                    style={styles.removeButton}
                  >
                    <Icon name={"cancel"} size={25} color={COLOR.CINNABAR} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  /**On Save Button CLick */
  const onSaveHandler = () => {
    let isBlank = templateValidation(data, "multi_option");
    if (!isBlank) {
      let param = {
        cardId: cardData?._id,
        action: {
          user_response: data,
        },
        week: cardData.week,
        day: cardData.day,
      };
      onSubmit(param, cardData?.otherAttribute?.feedbackMessage);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <View style={{}}>
        {cardData?.title != "" && (
          <CardTitle
            style={tempStyle?.cardTitle}
            text={cardData?.title ? cardData.title : ""}
          />
        )}
        {/******************Render Card Description ************/}
        {cardData.description ? (
          <ShowHtmlText
            contentWidth={width}
            source={{
              html: cardData?.description ? cardData.description : "",
            }}
          />
        ) : null}
      </View>
      {data.map((item, index) => {
        return renderHeaderData(item, index);
      })}
      <View style={{ marginTop: RFValue(10), width: "100%" }}>
        <ButtonNew
          text={"save"}
          onBtnPress={() => {
            onSaveHandler();
          }}
        />
      </View>
      <LikeElement
        cardDetails={cardData}
        onLikeClick={(type) => {
          onSubmit({
            cardId: cardData?._id,
            action: { like: type },
            week: cardData.week,
            day: cardData.day,
          });
        }}
        onCommentClick={() => {
          onCommentPress();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingHorizontal: 10,

    margin: RFValue(10),
  },
  headingDesc: {
    fontSize: RFValue(10),
    fontFamily: FONTS.REGULAR,
    color: COLOR.WHITE,
    paddingTop: RFValue(5),
  },
  container: {
    backgroundColor: "white", //COLOR.BACKGROUND,
    flexGrow: 1,
  },
  headings: {
    width: "100%",
    minHeight: RFValue(35),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: RFValue(5),
    paddingHorizontal: RFValue(10),
    paddingVertical: RFValue(10),
  },
  ToContainer: {
    width: "100%",
    marginTop: RFValue(10),
    justifyContent: "center",
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
    backgroundColor: COLOR.BUTTON_ORANGE,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    left: RFValue(-10),
    borderColor: COLOR.WHITE,
    borderWidth: 2,
  },
  dropdownStyle: {
    width: "100%",
    borderWidth: 0,
    backgroundColor: COLOR.LightGrayTextinput,
  },
  dropDownTextStyle: {
    fontSize: 15,
    color: COLOR.CIRCLE_GRAY,
    fontFamily: FONTS.MEDIUM,
  },
  dropDownLableStyle: {
    fontFamily: FONTS.MEDIUM,
    color: COLOR.BLACK,
  },
  addButton: {
    position: "absolute",
    right: RFValue(-2),
  },
  text: {
    fontSize: RFValue(14),
    fontFamily: FONTS.MEDIUM,
    color: COLOR.CIRCLE_GRAY,
  },
  removeButton: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    right: 1,
    top: 3,
    zIndex: 1000,
  },
  headings2: {
    width: width / 1.1,
    marginHorizontal: 0,
    backgroundColor: COLOR.LightGrayTextinput,
    height: RFValue(45),
    alignItems: "flex-start",
    paddingHorizontal: RFValue(20),
  },
  textinputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    // marginTop: RFValue(10),
  },
  textInputStyle: {
    width: "95%",
    marginHorizontal: 0,
    backgroundColor: COLOR.LightGrayTextinput,
    height: RFValue(45),
    alignItems: "flex-start",
    paddingHorizontal: RFValue(10),
    justifyContent: "center",
  },
  inputBoxStyle: {
    backgroundColor: COLOR.LightGrayTextinput,
    borderWidth: 0,
    width: "100%",
    padding: 0,
    fontSize: 14,
  },
});
export default TemplateTwentyTwo = React.memo(TemplateTwentyTwo);
