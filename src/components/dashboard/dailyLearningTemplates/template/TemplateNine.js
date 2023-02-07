import GLOBALS from "@constants";
import React, { useState, useEffect } from "react";
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Dimensions,
  Image,
  TextInput,
} from "react-native";
import { RFValue, RFPercentage } from "react-native-responsive-fontsize";
const { COLOR, STRINGS, FONTS } = GLOBALS;
import { strings } from "@localization";
import * as Images from "@images";
import {
  ImageElement,
  ShowHtmlText,
  CardTitle,
  LikeElement,
} from "@components/dashboard/dailyLearningTemplates/templateElements";
import { useSelector, useDispatch } from "react-redux";
const { DARK_GREEN, BUTTON_ORANGE, YELLOW, CIRCLE_GRAY, GREEN } = COLOR;
const { LIGHT, REGULAR } = FONTS;
import * as AppActions from "@actions";
import ButtonNew from "@components/common/buttonNew";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import tempStyle from "@components/dashboard/dailyLearningTemplates/globalTemplateStyle";
import { alertWithOneBtn } from "@helpers/common";
import { checkQuesInvalidd, showEmptyAlert } from "../utilities";

const generateDynamicColor = (order) => {
  if (order === 0) {
    return COLOR.PRIMARY;
  }
  if (order === 1) {
    return BUTTON_ORANGE;
  }
  if (order === 2) {
    return YELLOW;
  }
  if (order === 3) {
    return CIRCLE_GRAY;
  } else {
    return GREEN;
  }
};
let checkSum1 = 0;
let sum = 0;
let checkSum = 0;
function TemplateNine(props) {
  const {
    assessmentQuestionsLoader,
    saveAssessmentLoader,
    assessment_status,
    componentId,
  } = props;

  let {
    cardData,
    onSubmit,
    allAssessmentsQuestionData,
    onLikeClick,
    onCommentClick,
    user_language,
  } = props;
  const dispatch = useDispatch();

  const [selectedOptions, setselectedOptions] = useState([]);
  const [question_array, setQuestionArray] = useState(
    cardData?.action && cardData?.action?.user_response.length != 0
      ? cardData?.action?.user_response
      : allAssessmentsQuestionData
  );
  const [score, setScore] = useState(0);
  const [disable, setDisableButton] = useState(false);
  const { width, height } = Dimensions.get("window");
  const [requestPayload, setrequestPayload] = useState([]);
  const [questionObject, setQuestionObject] = useState({
    questionId: "",
    options: [],
    textAns: "",
    totalPointEarned: "",
  });
  const [inputText, setInputText] = useState("");
  const [inputTextIndex, setInputTextIndex] = useState("");
  const [msg, setMsg] = useState("");
  const [showFeedbackMsg, setShowFeedbackMsg] = useState(false);

  /**Get all assesment question */
  useEffect(() => {
    setQuestionArray(
      cardData?.action && cardData?.action?.user_response.length != 0
        ? cardData?.action?.user_response
        : allAssessmentsQuestionData
    );
    // getAssessmentsQuestions()
    calculatePoint();
  }, [props.allAssessmentsQuestionData, props.cardData]);

  useEffect(() => {
    // getAssessmentsQuestions()
    calculatePoint();
  }, [props.allAssessmentsQuestions]);

  /**Get Assessment Questions */
  const getAssessmentsQuestions = () => {
    dispatch(
      AppActions.getAssessmentsQuestions(
        cardData?.otherAttribute?.assessmentType,
        (res) => {
          console.log(res, "finddddd");
          let data = res.map((m) => {
            return {
              ...m,
              options: m.options.map((o) => {
                return {
                  ...o,
                  isChecked: false,
                };
              }),
            };
          });
          console.log(data, "data////");
          setQuestionArray(data);
        }
      )
    );
  };

  /**Get score result */
  const getScoreResult = (scorePoints) => {
    let result = "";
    cardData?.otherAttribute?.conditionalMessages?.map((res) => {
      if (res.condition == "0: 0-9" && scorePoints < 10) {
        result = stripHtml(res.message);
        setMsg(result);
      } else if (
        res.condition == "1: 10-16" &&
        scorePoints < 17 &&
        scorePoints > 9
      ) {
        result = stripHtml(res.message);
        setMsg(result);
      } else if (
        res.condition == "2: 17-21" &&
        scorePoints < 22 &&
        scorePoints >= 17
      ) {
        result = stripHtml(res.message);
        setMsg(result);
      } else if (res.condition == "3: >21" && scorePoints >= 22) {
        result = stripHtml(res.message);
        setMsg(result);
      }
    });

    setMsg(result);
    return result;
  };

  /**Remove HtML tags */
  const stripHtml = (html) => {
    const regex = /(<([^>]+)>)/gi;
    if (html !== undefined) {
      return html.replace(regex, "");
    } else {
      return html;
    }
  };

  /**Calculate points */
  const calculatePoint = () => {
    let selected_option = [];
    let point = 0;

    question_array?.map((ques) => {
      selected_option = ques.options.filter((opt) => {
        return opt.isChecked;
      });

      console.log(selected_option, "selected_option.....");
      if (selected_option.length > 0) {
        point += selected_option[0].optionPoint;
      }
      setScore(point);
    });

    console.log("final point", point);
    getScoreResult(point);
  };

  /**Handling of radio Click event **/
  const onItemClick = (array_index, option, type) => {
    if (type == "radio" && option.isChecked) {
      return;
    }
    let modify_option = question_array[array_index].options.map((o) => {
      if (option._id == o._id) {
        o.isChecked = !o.isChecked;
      } else {
        if (type == "radio") {
          o.isChecked = false;
        }
      }
      return o;
    });
    let all_question = [...question_array];
    let changed_question = { ...question_array[array_index] };

    changed_question = Object.assign({}, changed_question, {
      ansOptions: modify_option,
    });
    all_question = Object.assign([], all_question, {
      [array_index]: changed_question,
    });
    setQuestionArray(all_question);
    // if (
    //   question_array.length == 1 &&
    //   question_array[0].questionType == 'radio'
    // ) {
    //   _onSaveClick();

    // }
  };

  /**On Submit Data */
  const _onSaveClick = (question_array, inputText) => {
    if (inputText != "") {
      saveAssessmentText(question_array[inputTextIndex], inputText);
    }
    saveAssessmentQuestion();
  };

  /**Save assessmnet questions **/
  const saveAssessmentQuestion = () => {
    console.log(cardData, "cardData.....");
    if (checkQuesInvalidd(question_array)) {
      showEmptyAlert();
    } else {
      calculatePoint();

      setTimeout(() => {
        console.log(msg, "llll");
      }, 1000);
      console.log(msg);
      // return;

      let param = {
        cardId: cardData?._id,
        action: { user_response: question_array },
        week: cardData?.week,
        day: cardData?.day,
      };

      console.log(score, "score....");
      console.log(param, "param");
      // return false;
      let point = 0;

      // getScoreResult(score)

      for (let obj of question_array) {
        let answers = [];
        for (let ansOption of obj.options) {
          if (ansOption.isChecked) {
            answers.push(ansOption);
            point += ansOption.optionPoint;
          }
        }
      }
      setShowFeedbackMsg(true);
      onSubmit(param, getScoreResult(point));
      setShowFeedbackMsg(true);
      return;
    }
  };

  const onTextAnswerChange = (text, item, data, array_index) => {
    let modify_option = data.forEach((element) => {
      if (element._id == item._id) {
        element.answer = text;
        setInputText(text);
        setInputTextIndex(array_index);
      }
    });
    // setRefresh(!refresh);
    let all_question = [...data];
    let changed_question = { ...data[array_index] };

    changed_question = Object.assign({}, changed_question, {
      ansOptions: modify_option,
    });
    all_question = Object.assign([], all_question, {
      [array_index]: changed_question,
    });

    setQuestionArray(all_question);
  };

  /**Handling of text view Click event **/
  const saveAssessmentText = (question, description) => {
    let requestPayloadHaveThisQuestion = false;
    requestPayload.map((payloadQuestion) => {
      if (payloadQuestion.question_id === question._id) {
        requestPayloadHaveThisQuestion = true;
      }
    });
    if (!requestPayloadHaveThisQuestion) {
      requestPayload.push(questionObject);
      questionObject.questionId = question._id;

      questionObject.options.push({ optionPoint: "", optionValue: "" });

      questionObject.options.forEach((element) => {
        checkSum += element.optionPoint;
      });

      questionObject.totalPointEarned = checkSum;
      questionObject["textAns"] = description;
      setrequestPayload(requestPayload);
      setQuestionObject({
        questionId: "",
        options: [],
      });
    } else {
      requestPayload.map((item) => {
        if (item.question_id === question._id) {
          item["textAns"] = description;
        }
      });
    }
  };

  /**Handling of Check Box event **/
  const addToSelectedOptionsCheckbox = (question, option) => {
    let requestPayloadHaveThisQuestion = false;
    //check if question is already added to requestPayload else add one
    requestPayload.map((payloadQuestion) => {
      if (payloadQuestion.questionId === question._id) {
        requestPayloadHaveThisQuestion = true;
      }
    });
    let toggle = (selectedOptions) => selectedOptions._id === option._id;
    if (selectedOptions.some(toggle)) {
      _.remove(selectedOptions, (item) => {
        return item._id === option._id;
      });
      setrequestPayload(requestPayload);
    } else {
      if (requestPayloadHaveThisQuestion) {
        requestPayload.map((item) => {
          if (item.questionId === question._id) {
            option["selected"] = true;
            item.options.push({
              optionPoint: option.optionPoint,
              optionValue: option.optionValue,
            });
          }
        });
        questionObject.options.push({
          optionPoint: option.optionPoint,
          optionValue: option.optionValue,
        });
        questionObject.options.forEach((element) => {
          checkSum1 += element.optionPoint;
        });
        questionObject.questionId = question._id;
        questionObject.totalPointEarned = checkSum1;
        selectedOptions.push(option);
        setrequestPayload(requestPayload);
        setQuestionObject({
          questionId: "",
          options: [],
          textAns: "",
          totalPointEarned: "",
        });
      } else {
        requestPayload.push(questionObject);
        questionObject.questionId = question._id;
        option["selected"] = true;
        questionObject.options.push({
          optionPoint: option.optionPoint,
          optionValue: option.optionValue,
        });

        questionObject.options.forEach((element) => {
          checkSum1 += element.optionPoint;
        });
        questionObject.totalPointEarned = checkSum1;
        selectedOptions.push(option);
        setrequestPayload(requestPayload);
        setQuestionObject({
          questionId: "",
          options: [],
          textAns: "",
          totalPointEarned: "",
        });
      }
    }
  };

  return (
    <KeyboardAwareScrollView
      enableAutomaticScroll={Platform.OS === "ios" ? true : true}
      keyboardShouldPersistTaps={"handled"}
      enableOnAndroid={true}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{}}
      nestedScrollEnabled={true}
      extraScrollHeight={Platform.OS === "ios" ? 100 : 100}
    >
      <View style={[tempStyle.outerContainer]}>
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

        {question_array &&
          question_array.map((ques_data, array_index) => {
            return (
              <View style={styles.addMargin}>
                <Text
                  style={[
                    tempStyle.cardDescription,
                    tempStyle.quesFont,
                    { marginBottom: RFValue(5) },
                  ]}
                >
                  {ques_data.question}
                </Text>

                {ques_data.questionType == "radio" && (
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                    }}
                  >
                    {ques_data.options.map((option, index) => {
                      return (
                        <TouchableOpacity
                          onPress={() =>
                            onItemClick(array_index, option, "radio")
                          }
                          style={[
                            {
                              borderColor: generateDynamicColor(index),
                              backgroundColor: option.isChecked
                                ? generateDynamicColor(index)
                                : COLOR.LIGHT,
                            },
                            styles.innerOption,
                          ]}
                        >
                          <Text style={styles.optionsText}>
                            {option.optionValue}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
                {ques_data.questionType == "text" &&
                  (ques_data.textAns ? (
                    <Text
                      style={{
                        fontSize: RFValue(15),
                        color: COLOR.GREY,
                        fontFamily: FONTS.REGULAR,
                      }}
                    >
                      {ques_data.textAns}
                    </Text>
                  ) : (
                    <TextInput
                      multiline
                      placeholder={strings.journal.Type_here}
                      disabled={disable}
                      style={{
                        height: RFValue(82),
                        borderWidth: RFValue(1),
                        padding: RFValue(16),
                        fontFamily: FONTS.REGULAR,
                        fontSize: RFValue(14),
                        borderColor: DARK_GREEN,
                        borderRadius: RFValue(4),
                        marginTop: 10,
                      }}
                      selectionColor={DARK_GREEN}
                      value={
                        ques_data.answer != undefined && ques_data.answer != ""
                          ? ques_data.answer
                          : ""
                      }
                      onChangeText={(text) => {
                        onTextAnswerChange(
                          text,
                          ques_data,
                          question_array,
                          array_index
                        );
                        // onTextAnswerChange(text, array_index, ques_data)
                      }}
                    />
                  ))}
                {ques_data.questionType == "checkbox" && (
                  <View
                    style={{
                      display: "flex",
                    }}
                  >
                    {ques_data.options.map((item, index) => {
                      return (
                        <TouchableOpacity
                          style={{
                            flexDirection: "row",
                            paddingTop: 10,
                            paddingBottom: 10,
                          }}
                          onPress={() =>
                            assessment_status == "completed"
                              ? null
                              : onItemClick(array_index, item, "checkbox")
                          }
                          // onPress={() => {
                          //   assessment_status == 'completed'
                          //     ? null
                          //     : addToSelectedOptionsCheckbox(
                          //       ques_data,
                          //       item,
                          //     );
                          // }}
                        >
                          <Image
                            source={
                              // Images.UnChecked
                              item.isChecked ? Images.Checked : Images.UnChecked
                            }
                            style={{
                              width: RFValue(20),
                              height: RFValue(20),
                            }}
                          />
                          <Text
                            style={[
                              styles.optionStyle,
                              {
                                flex: 0.85,
                                paddingTop: RFValue(1),
                                paddingLeft: 0,
                              },
                            ]}
                          >
                            {item.optionValue}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </View>
            );
          })}

        {showFeedbackMsg && (
          <View
            style={{
              borderLeftWidth: score > 0 ? 2 : 0,
              padding: 10,
              borderColor: COLOR.YELLOW,
            }}
          >
            <ShowHtmlText
              contentWidth={width}
              source={{
                html: cardData?.action?.user_response ? msg : "",
              }}
            />
            {/* <Text
              style={[
                tempStyle.cardDescription,
                tempStyle.quesFont,
                { marginBottom: RFValue(5) },
              ]}>
              {cardData?.action?.user_response ? msg : ''}
            </Text> */}
          </View>
        )}

        {question_array && (
          <View style={tempStyle.submitContainer}>
            <ButtonNew
              text={strings.cards.submit}
              onBtnPress={() => _onSaveClick(question_array, inputText)}
            />
          </View>
        )}

        {/* <View style={{}}>
          {cardData?.card_title != '' && (
            <CardTitle
              style={tempStyle?.cardTitle}
              text={
                cardData?.card_title
                  ? cardData.card_title[user_language]
                    ? cardData.card_title[user_language]
                    : cardData.card_title['en']
                  : ''
              }
            />
          )}
          {cardData.description ? (
            <ShowHtmlText
              source={{
                html: cardData?.description
                  ? cardData.description[user_language]
                    ? cardData.description[user_language]
                    : cardData.description['en']
                  : '',
              }}
            />
          ) : null}
          {question_array.assessmentQuestions &&
            question_array.assessmentQuestions.map((ques_data, array_index) => {
              return (
                <View style={styles.addMargin}>
                  <Text
                    style={[
                      tempStyle.cardDescription,
                      tempStyle.quesFont,
                      { marginBottom: RFValue(5) },
                    ]}>
                    {ques_data.question}
                  </Text>

                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    {ques_data.options.map((option, index) => {
                      return (
                        <TouchableOpacity
                          onPress={() => onItemClick(array_index, option)}
                          style={[
                            {
                              borderColor: generateDynamicColor(index),
                              backgroundColor: option.isChecked
                                ? generateDynamicColor(index)
                                : COLOR.LIGHT,
                            },
                            styles.innerOption,
                          ]}>
                          <Text style={styles.optionsText}>
                            {option.optionValue}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                 
                  </View>
                </View>
              );
            })}

          <View
            style={{
              borderLeftWidth: score > 0 ? 2 : 0,
              padding: 10,
              borderColor: COLOR.YELLOW,
            }}>
            <Text
              style={[
                tempStyle.cardDescription,
                tempStyle.quesFont,
                { marginBottom: RFValue(5) },
              ]}>
              {getScoreResult(score)}
            </Text>
          </View>
        </View>
        <View style={tempStyle.submitContainer}>
          <ButtonNew
            text={strings.cards.submit}
            onBtnPress={() => _onSaveClick()}
          />
        </View> */}
      </View>
    </KeyboardAwareScrollView>
  );
}
export default TemplateNine = React.memo(TemplateNine);

const styles = {
  addMargin: {
    marginBottom: RFPercentage(3),
  },
  innerOption: {
    // flex: 0.4,
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderWidth: 2,
    borderRadius: 5,
    width: "23%",
    textAlignVertical: "center",
    justifyContent: "center",
  },
  optionGroup: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  optionsText: {
    fontSize: RFValue(12),
    fontFamily: FONTS.MEDIUM,
    color: COLOR.BLACK,
    textAlign: "center",
  },
  optionStyle: {
    flex: 0.85,
    fontSize: RFValue(15),
    fontWeight: "600",
    fontFamily: FONTS.SEMI_BOLD,
    color: COLOR.SOFT_GRAY,
    paddingTop: RFValue(1),
  },
};
