import tempStyle from "@components/dashboard/dailyLearningTemplates/globalTemplateStyle";
import GLOBALS from "@constants";
import React, { useState, useRef, useEffect } from "react";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import ButtonNew from "@components/common/buttonNew";
import { strings } from "@localization";
import Icon from "react-native-vector-icons/MaterialIcons";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  TextInput,
} from "react-native";
const { FONTS, COLOR } = GLOBALS;
import * as AppActions from "@actions";
import {
  ShowHtmlText,
  CardTitle,
  LikeElement,
} from "@components/dashboard/dailyLearningTemplates/templateElements";
// import Ico from 'react-native-vector-icons/FontAwesome5';
import { useSelector, useDispatch } from "react-redux";
import IoniIcon from "react-native-vector-icons/Ionicons";
import { templateValidation, showEmptyAlert } from "../utilities";
const { width, height } = Dimensions.get("window");
import { alertWithOneBtn } from "@helpers/common";
function TemplateNineteen(props) {
  let { cardData, onCommentClick, onSubmit, cardState } = props;
  const [exercise1, setExercise1] = useState([]);
  const [question_array, setQuestionArray] = useState([]);
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    let array = [];
    let array1 = [];

    /**Get user submitted response */
    let user_response = cardData?.action?.user_response
      ? cardData?.action?.user_response?.exercise_2
      : [];

    let user_input_response = cardData?.action?.user_response
      ? cardData?.action?.user_response?.exercise_1
      : [];

    if (
      cardData?.otherAttribute &&
      cardData?.otherAttribute?.contents?.length > 0
    ) {
      cardData?.otherAttribute?.contents.map((m) => {
        let matched_index = -1;
        matched_index = user_input_response.findIndex(
          (x) => x.content_id === m.content_id
        );
        array1.push({
          ...m,
          value:
            matched_index > -1
              ? user_input_response[matched_index].value
              : [
                  {
                    answer: "",
                    is_added: false,
                  },
                ],
        });
      });
      setExercise1(array1);
    }
    if (
      cardData?.otherAttribute &&
      cardData?.otherAttribute?.questions?.length > 0
    ) {
      cardData?.otherAttribute?.questions.map((m) => {
        let matched_index = -1;
        matched_index = user_response.findIndex(
          (x) => x.question_id === m.question_id
        );
        array.push({
          ...m,
          answer: matched_index > -1 ? user_response[matched_index].answer : "",
          textBox:
            matched_index > -1
              ? user_response[matched_index]?.textBox
                ? user_response[matched_index]?.textBox
                : ""
              : "",
        });
      });
      setQuestionArray(array);
    }
  }, [cardData]);

  /**Commet handling */
  const onCommentPress = () => {
    dispatch(
      AppActions.setCommentsArray(
        cardData?.action?.usercomments?.length > 0
          ? cardData?.action?.usercomments
          : []
      )
    );
    onCommentClick({
      card_id: cardData?._id,
      week: cardData.week,
      day: cardData.day,
    });
  };
  const boxBackgroundColor = (order) => {
    if (order === 0) {
      return COLOR.DARK_GREEN;
    } else if (order === 1) {
      return COLOR.BUTTON_ORANGE;
    } else {
      return COLOR.CIRCLE_GRAY;
    }
  };

  /**Modify the answer key on text input change */
  const onTextValueChange = (value, inner_index, outer_index) => {
    let current_answer = exercise1[outer_index].value[inner_index];
    current_answer = Object.assign({}, current_answer, {
      answer: value,
    });
    let current_header_ans = Object.assign([], exercise1[outer_index].value, {
      [inner_index]: current_answer,
    });
    dataModify(inner_index, outer_index, current_header_ans);
  };

  /**Modify Final Array */
  const dataModify = (inner_index, outer_index, current_header_ans) => {
    let array = Array.from(exercise1);
    let all_current_header_ans = Object.assign({}, array[outer_index], {
      value: current_header_ans,
    });
    let modifyHeader = Object.assign([], array, {
      [outer_index]: all_current_header_ans,
    });
    setExercise1(modifyHeader);
  };

  const clickHandler = (type, inner_index, outer_index) => {
    switch (type) {
      case "add_row":
        let array = Array.from(exercise1);
        let current_answer = array[outer_index].value[inner_index];
        current_answer = Object.assign({}, current_answer, {
          is_added: true,
        });
        let empty_obj = {
          answer: "",
          is_added: false,
        };
        let current_header_ans = Object.assign([], array[outer_index].value, {
          [inner_index]: current_answer,
        });
        current_header_ans.push(empty_obj);
        dataModify(inner_index, outer_index, current_header_ans);
        break;

      case "delete_row":
        let filter_data = exercise1[outer_index].value.filter(
          (ele, ele_index) => ele_index != inner_index
        );
        filter_data = filter_data.map((item, index) => {
          return {
            ...item,
          };
        });
        dataModify(inner_index, outer_index, filter_data);
        break;
      default:
        break;
    }
  };

  const renderHeaderView = (item, index) => {
    return (
      <View style={styles.ToContainer}>
        <View
          style={[
            styles.headings,
            { backgroundColor: boxBackgroundColor(index) },
          ]}
        >
          <Text style={styles.headingText}>{item.contentTitle}</Text>
          <View>
            <Text
              style={[
                styles.headingText,
                {
                  marginTop: RFValue(10),
                  fontSize: RFValue(12),
                },
              ]}
            >
              {item.contentDescription}
            </Text>
          </View>
        </View>
        {item?.value.map((value, i) => {
          return (
            <View style={styles.ToContainer}>
              <View
                style={[
                  styles.headings,
                  {
                    width: "95%",
                    marginHorizontal: 0,
                    backgroundColor: COLOR.LightGrayTextinput,
                    height: RFValue(45),
                    alignItems: "flex-start",
                    paddingHorizontal: RFValue(10),
                    justifyContent: "center",
                  },
                ]}
              >
                <TextInput
                  editable={value.is_added == false ? true : false}
                  multiline={true}
                  style={[
                    tempStyle.queTextInputAreaStyle,
                    {
                      backgroundColor: COLOR.LightGrayTextinput,
                      borderWidth: 0,
                      width: "100%",
                      padding: 0,
                      fontSize: 15,
                    },
                  ]}
                  value={value.answer}
                  maxLength={2000}
                  selectionColor={"green"}
                  underlineColorAndroid={"transparent"}
                  placeholderTextColor={"gray"}
                  onChangeText={(text) => {
                    onTextValueChange(text, i, index);
                  }}
                />
              </View>
              {value.is_added == false ? (
                <TouchableOpacity
                  onPress={() =>
                    value.answer != ""
                      ? clickHandler("add_row", i, index)
                      : null
                  }
                  style={styles.addButton}
                >
                  <IoniIcon
                    name={"add-circle"}
                    size={RFValue(30)}
                    color={value.answer == "" ? COLOR.PRIMARY : COLOR.DarkGray}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => clickHandler("delete_row", i, index)}
                  style={styles.removeButton}
                >
                  <Icon name={"cancel"} size={25} color={COLOR.CINNABAR} />
                </TouchableOpacity>
              )}
            </View>
          );
        })}
      </View>
    );
  };

  /**Checkox Exercise click handler */
  const onSelectAnswer = (text, array_index, obj, isTextArea = false) => {
    let modify_obj = question_array.map((m, inner_index) => {
      return {
        ...m,
        ...(!isTextArea
          ? { answer: inner_index == array_index ? text : m.answer }
          : { textBox: inner_index == array_index ? text : "" }),
      };
    });
    setQuestionArray(modify_obj);
  };

  /**UI for bottom check box exercise */
  const renderBottomView = (item, index) => {
    return (
      <View>
        <View style={styles.bottomView}>
          <Text style={{ width: "65%", color: COLOR.BLACK }}>
            {item.addQues}
          </Text>
          <View style={styles.checkbottuonView}>
            <TouchableOpacity
              onPress={() => onSelectAnswer("yes", index, item)}
              style={[
                styles.checkButton,
                {
                  backgroundColor:
                    item.answer == "yes"
                      ? COLOR.BUTTON_ORANGE
                      : COLOR.BORDER_COLOR,
                },
              ]}
            >
              <IoniIcon
                name={"checkmark"}
                size={RFValue(25)}
                color={COLOR.WHITE}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onSelectAnswer("no", index, item)}
              style={[
                styles.checkButton,
                {
                  backgroundColor:
                    item.answer == "no"
                      ? COLOR.BUTTON_ORANGE
                      : COLOR.BORDER_COLOR,
                },
              ]}
            >
              <IoniIcon name={"close"} size={RFValue(25)} color={COLOR.WHITE} />
            </TouchableOpacity>
          </View>
        </View>
        {item.answer == "yes" && item.showTextArea == true && (
          <View
            style={[
              styles.headings,
              {
                width: "95%",
                marginVertical: RFValue(5),
                backgroundColor: COLOR.LightGrayTextinput,
                height: RFValue(50),
                alignItems: "flex-start",
                paddingHorizontal: RFValue(10),
                justifyContent: "center",
              },
            ]}
          >
            <TextInput
              multiline={true}
              style={[
                tempStyle.queTextInputAreaStyle,
                {
                  backgroundColor: COLOR.LightGrayTextinput,
                  borderWidth: 0,
                  width: "100%",
                  padding: 0,
                  fontSize: 15,
                },
              ]}
              value={item.textBox}
              maxLength={2000}
              selectionColor={"green"}
              underlineColorAndroid={"transparent"}
              placeholderTextColor={"gray"}
              onChangeText={(text) => {
                onSelectAnswer(text, index, item, true);
              }}
            />
          </View>
        )}
      </View>
    );
  };

  /**On Save Button CLick */
  const onSaveHandler = () => {
    let isBlank = templateValidation(exercise1, "multi_option");
    let isUnSelect = templateValidation(question_array, "single_radio");
    if (!isBlank && !isUnSelect) {
      let param = {
        cardId: cardData?._id,
        action: {
          user_response: {
            exercise_1: exercise1,
            exercise_2: question_array,
          },
        },
        week: cardData.week,
        day: cardData.day,
      };
      let message = "";
      console.log("Templates====>", message);
      let atleast_yes = question_array.some((option) => option.answer == "yes");

      let res = question_array.reduce(function (question_array, v) {
        question_array[v.answer] = (question_array[v.answer] || 0) + 1;
        return question_array;
      }, {});

      let noToAtleastOne = cardData.otherAttribute?.conditionalMessages.filter(
        (m) => m.condition.toLowerCase() == "noToAtleastOne".toLowerCase()
      )[0]?.message;

      let yesToAtleastOne = cardData.otherAttribute?.conditionalMessages.filter(
        (m) => m.condition.toLowerCase() == "yesToAtleastOne".toLowerCase()
      )[0]?.message;

      let yesToAll = cardData.otherAttribute?.conditionalMessages.filter(
        (m) => m.condition.toLowerCase() == "yesToAll".toLowerCase()
      )[0]?.message;
      let noToAll = cardData.otherAttribute?.conditionalMessages.filter(
        (m) => m.condition.toLowerCase() == "noToAll".toLowerCase()
      )[0]?.message;

      if (cardData.otherAttribute?.conditionalMessages?.length > 0) {
        if (noToAtleastOne && noToAtleastOne != "" && res?.no >= 1) {
          message = noToAtleastOne != "" ? noToAtleastOne : noToAll;
          // message = cardData.otherAttribute?.conditionalMessages.filter(
          //   (m) => m.condition.toLowerCase() == "noToAtleastOne".toLowerCase()
          // )[0]?.message;
        } else if (yesToAtleastOne && yesToAtleastOne != "" && res?.yes >= 1) {
          message = yesToAtleastOne != "" ? yesToAtleastOne : yesToAll;
          // message = cardData.otherAttribute?.conditionalMessages.filter(
          //   (m) => m.condition.toLowerCase() == "yesToAtleastOne".toLowerCase()
          // )[0]?.message;
        } else if (yesToAll && yesToAll != "" && !res?.no && res?.yes >= 2) {
          message = yesToAll != "" ? yesToAll : yesToAtleastOne;
          // message = cardData.otherAttribute?.conditionalMessages.filter(
          //   (m) => m.condition.toLowerCase() == "yesToAll".toLowerCase()
          // )[0]?.message;
        } else {
          message = noToAll != "" ? noToAll : noToAtleastOne;
          // message = cardData.otherAttribute?.conditionalMessages.filter(
          //   (m) => m.condition.toLowerCase() == "noToAll".toLowerCase()
          // )[0]?.message;
        }
      }
      onSubmit(param, message?.replace(/<\/?[^>]+(>|$)/g, ""));
    }
  };
  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 10,
        margin: RFValue(10),
      }}
    >
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
      {exercise1.map((item, index) => {
        return renderHeaderView(item, index);
      })}
      <View style={{ marginTop: RFValue(20) }}>
        {cardData?.otherAttribute &&
        cardData?.otherAttribute?.descriptiontwo ? (
          <ShowHtmlText
            source={{
              html: cardData?.otherAttribute?.descriptiontwo,
            }}
          />
        ) : null}
      </View>
      <View style={{ marginTop: RFValue(20) }}>
        {question_array.map((item, index) => {
          return renderBottomView(item, index);
        })}
      </View>
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
    position: "absolute",
    right: 5,
    top: 0,
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
  checkButton: {
    alignItems: "center",
    justifyContent: "center",
    height: RFValue(30),
    width: RFValue(30),
    borderRadius: RFValue(15),
    backgroundColor: COLOR.BORDER_COLOR,
    marginHorizontal: RFValue(10),
  },
  checkbottuonView: {
    flexDirection: "row",
  },
  bottomView: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: RFValue(10),
  },
});
export default TemplateNineteen = React.memo(TemplateNineteen);
