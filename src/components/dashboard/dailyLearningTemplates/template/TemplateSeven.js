import NoData from "@components/common/NoData";
import Loader from "@components/common/screenLoader";
import tempStyle from "@components/dashboard/dailyLearningTemplates/globalTemplateStyle";
import GLOBALS from "@constants";
import * as ICONS from "@images";
import * as Images from "@images";
import Swiper from "react-native-swiper";

import React, { useState, lazy, useCallback, useEffect } from "react";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity,
  TextInput,
} from "react-native";
import * as AppActions from "@actions";
const isiOS = Platform.OS == "ios";
import Icon from "react-native-vector-icons/FontAwesome5";
const { FONTS, COLOR, STRINGS } = GLOBALS;
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
// import Voice from '@react-native-voice/voice';
// import {
//   ImageElement,
//   ShowHtmlText,
//   CardTitle,
// } from "@components/dashboard/dailyLearningTemplates/templateElements";
import {
  ProgressSteps,
  ProgressStep,
} from "../../../../updatedNodeModules/react-native-steps";
//import { ProgressSteps, ProgressStep } from "../../../../updatedNodeModules/react-native-progress-steps";
import ButtonNew from "@components/common/buttonNew";
import Button from "@components/common/button";
import {
  ImageElement,
  ShowHtmlText,
  CardTitle,
  LikeElement,
} from "@components/dashboard/dailyLearningTemplates/templateElements";

import { strings } from "@localization";
import {
  checkIfAllQuestionNotAnswered,
  showEmptyAlert,
  checkNextDayUnlocked,
  showAlert,
  checkIfSingleQuestionNotAnswered,
} from "../utilities";
import { useSelector, useDispatch } from "react-redux";
function TemplateSeven(props) {
  let {
    cardData,
    onSubmit,
    onLikeClick,
    onCommentClick,
    currentStep,
    cardState,
  } = props;
  const dispatch = useDispatch();
  const reducerData = useSelector((state) => {
    return state;
  });

  const progressStepsProp = {
    topOffset: 0,
    borderWidth: 5,
    completedProgressBarColor: COLOR.DARK_GREEN,
    marginBottom: 20,
    activeLabelColor: COLOR.WHITE,
    activeStepIconColor: COLOR.DARK_GREEN,
    activeStepNumColor: COLOR.WHITE,
    disabledStepNumColor: COLOR.BLACK,
  };
  const singleStepProps = {
    removeBtnRow: true,
  };
  const ques_data = [];
  const [question_array, setQuestionArray] = useState([]);
  // const [current_step, setCurrentStep] = useState(
  //   reducerData.cardsReducer.current_step
  // );
  const [current_step, setCurrentStep] = useState(0);
  const [hints, setHints] = useState([]);
  const [temp, setTemp] = useState(0);
  const [imageBaseURL, setImageBaseURL] = useState(
    cardState?.imgBp ? cardState.imgBp : ""
  );
  useEffect(() => {

  }, [])
  useEffect(() => {
    setQuestionArray([]);
    setHints([]);
    /**Get user submitted response */
    let user_response = cardData?.action?.user_response
      ? cardData?.action?.user_response
      : [];
    // let user_response = []
    if (cardData.otherAttribute && cardData.otherAttribute?.questions) {
      let all_question = [...cardData.otherAttribute?.questions];
      all_question = all_question.map((ques, index) => {
        let matched_index = -1;
        matched_index = user_response.findIndex(
          (x) => x.ques_id === ques.ques_id
        );
        return {
          ...ques,
          ansOptions:
            matched_index > -1
              ? user_response[matched_index].ansOptions
              : ques.ansOptions.map((i) => {
                return ques.questionType == "textarea" ||
                  ques.questionType == "textinput"
                  ? {
                    ...i,
                    answer: "",
                  }
                  : {
                    ...i,
                    isChecked: false,
                  };
              }),
        };
      });

      setQuestionArray(all_question);
    }
  }, [cardData]);

  useEffect(() => {
    setHintsFromArray();
  }, [question_array]);

  /**Create array for Hints */
  const setHintsFromArray = () => {
    let array = [];
    question_array.map((question_array, index) => {
      if (question_array.questionType == "checkbox") {
        question_array?.ansOptions.map((item) => {
          if (item?.isChecked == true) {
            if (item?.hint !== "" && item?.hint != undefined) {
              array.push(item?.hint);
            }
          }
        });
        return;
      }
    });
    setHints(array);
  };

  const removeHint = (value) => {
    let array = Array.from(hints);
    let index;
    // const index = array.indexOf(value[user_language])
    array.map((item, i) => {
      if (item == value) {
        index = i;
      }
    });
    index > -1 ? array.splice(index, 1) : null;
    setHints(array);
  };
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
  /***Handling Text Input */
  const onTextAnswerChange = (text, array_index, option) => {
    let modify_option = question_array[current_step].ansOptions.map((o) => {
      if (option.option_id == o.option_id) {
        o.answer = text;
      }
      return o;
    });
    let all_question = [...question_array];
    let changed_question = {
      ...question_array[current_step],
    };
    changed_question = Object.assign({}, changed_question, {
      ansOptions: modify_option,
    });
    all_question = Object.assign([], all_question, {
      [current_step]: changed_question,
    });
    setQuestionArray(all_question);
  };

  /**Handling of Check Box, radio Click event */
  const onItemClick = (array_index, option, type) => {
    let checked_count = question_array[current_step].ansOptions.reduce(
      (a, v) => (v.isChecked === true ? a + 1 : a),
      0
    );
    if (checked_count > 2 && option.isChecked == false) {
      showAlert(strings.SELECT_UPTO_3_OPTIONS);
      return;
    }
    let modify_option = question_array[current_step].ansOptions.map((o) => {
      if (option.option_id == o.option_id) {
        o.isChecked = !o.isChecked;
      } else {
        if (type == "radio") {
          o.isChecked = false;
        }
      }
      return o;
    });

    let all_question = [...question_array];
    let changed_question = {
      ...question_array[current_step],
    };

    changed_question = Object.assign({}, changed_question, {
      ansOptions: modify_option,
    });
    all_question = Object.assign([], all_question, {
      [current_step]: changed_question,
    });
    setQuestionArray(all_question);
    return;
  };
  /**On Submit Data */
  const _onSaveClick = () => {
    if (checkIfSingleQuestionNotAnswered(question_array[current_step])) {
      showEmptyAlert();
      return;
    }
    if (current_step < question_array.length - 1) {
      dispatch(AppActions.setCardStep(current_step + 1));
      setCurrentStep(current_step + 1);
    } else {
      let param = {
        cardId: cardData?._id,
        action: {
          user_response: question_array,
        },
        week: cardData.week,
        day: cardData.day,
      };
      onSubmit(
        param,
        cardData.otherAttribute?.sendRes ? cardData.otherAttribute?.sendRes : ""
      );
    }
  };
  return (
    <KeyboardAwareScrollView
      enableAutomaticScroll={Platform.OS === "ios" ? true : true}
      keyboardShouldPersistTaps={"handled"}
      enableOnAndroid={true}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flex: 1 }}
      extraScrollHeight={100}
    >
      <View style={[tempStyle.outerContainer]}>
        {cardData?.title != "" && (
          <CardTitle
            style={tempStyle?.cardTitle}
            text={cardData?.title ? cardData.title : ""}
          />
        )}
        {question_array.length > 0 && (
          <ProgressSteps activeStep={current_step} {...progressStepsProp}>
            {question_array.map((question_array, index) => {
              return (
                <ProgressStep {...singleStepProps}>
                  <View style={{}}>
                    {question_array.questionType == "textarea" ||
                      question_array.questionType == "textinput" ? (
                      <View style={styles.addMargin}>
                        <Text
                          style={[
                            tempStyle.cardDescription,
                            tempStyle.quesFont,
                            styles.stepDescription,
                          ]}
                        >
                          {question_array.questionDesc}
                        </Text>
                        <Text
                          style={[
                            tempStyle.cardDescription,
                            tempStyle.quesFont,
                          ]}
                        >
                          {question_array.questionName}
                        </Text>
                        <View style={styles.answerContainer}>
                          {question_array.ansOptions.map((option, index) => {
                            return (
                              <View
                                style={{
                                  flexDirection: "row",
                                  marginBottom: 25,
                                }}
                              >
                                <TextInput
                                  multiline={true}
                                  placeholder={option.input}
                                  style={tempStyle.queTextInputAreaStyle}
                                  value={option.answer}
                                  maxLength={2000}
                                  selectionColor={"green"}
                                  underlineColorAndroid={"transparent"}
                                  onChangeText={(text) => {
                                    onTextAnswerChange(text, index, option);
                                  }}
                                />
                              </View>
                            );
                          })}
                        </View>
                      </View>
                    ) : question_array.questionType == "radio" ? (
                      <View style={styles.addMargin}>
                        <Text
                          style={[
                            tempStyle.cardDescription,
                            tempStyle.quesFont,
                            styles.stepDescription,
                          ]}
                        >
                          {question_array.questionDesc}
                        </Text>
                        <Text
                          style={[
                            tempStyle.cardDescription,
                            tempStyle.quesFont,
                          ]}
                        >
                          {question_array.questionName}
                        </Text>
                        <View style={styles.answerContainer}>
                          {question_array.ansOptions.map(
                            (option, option_index) => {
                              return (
                                <TouchableOpacity
                                  onPress={() => {
                                    onItemClick(option_index, option, "radio");
                                  }}
                                  style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    marginBottom: 15,
                                  }}
                                >
                                  <View
                                    style={{
                                      flex: 0.15,
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                  >
                                    {option.img && option.img != "" ? (
                                      <Image
                                        resizeMode="contain"
                                        source={{
                                          uri: `${imageBaseURL}${option.img}`,
                                        }}
                                        style={[tempStyle.optionImage, {}]}
                                      />
                                    ) : null}
                                    <Image
                                      resizeMode="cover"
                                      source={
                                        option.isChecked
                                          ? Images.GreenCircle
                                          : Images.WhiteCircle
                                      }
                                      style={tempStyle.radioButton}
                                    />
                                  </View>

                                  <View style={{ flex: 0.9 }}>
                                    <Text style={[tempStyle.radioOptionNew]}>
                                      {option.option}
                                    </Text>
                                    {option.description != "" && (
                                      <Text style={[styles.checkDesctiopn]}>
                                        {option.desc}
                                      </Text>
                                    )}
                                  </View>
                                </TouchableOpacity>
                              );
                            }
                          )}
                        </View>
                      </View>
                    ) : question_array.questionType == "checkbox" ? (
                      <View style={styles.addMargin}>
                        <Text
                          style={[
                            tempStyle.cardDescription,
                            tempStyle.quesFont,
                            styles.stepDescription,
                          ]}
                        >
                          {question_array.questionDesc}
                        </Text>
                        <Text
                          style={[
                            tempStyle.cardDescription,
                            tempStyle.quesFont,
                          ]}
                        >
                          {question_array.questionName}
                        </Text>
                        <View style={styles.answerContainer}>
                          {question_array.ansOptions.map(
                            (option, option_index) => {
                              return (
                                <TouchableOpacity
                                  onPress={() => {
                                    onItemClick(
                                      option_index,
                                      option,
                                      "checkbox"
                                    );
                                    let array = Array.from(hints);
                                    if (option.isChecked) {
                                      if (option.hint != "") {
                                        array.push(option.hint);
                                        setHints(array);
                                      }
                                    } else {
                                      if (option.hint != "") {
                                        removeHint(option.hint);
                                      }
                                    }
                                  }}
                                  style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    marginBottom: 15,
                                  }}
                                >
                                  <View
                                    style={{
                                      flex: 0.15,
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                  >
                                    {option.img && option.img != "" ? (
                                      <Image
                                        resizeMode="contain"
                                        source={{
                                          uri: `${imageBaseURL}${option.img}`,
                                        }}
                                        style={[tempStyle.optionImage, {}]}
                                      />
                                    ) : null}
                                    <Image
                                      resizeMode="cover"
                                      source={
                                        option.isChecked
                                          ? Images.Checked
                                          : Images.UnChecked
                                      }
                                      style={tempStyle.checkButton}
                                    />
                                  </View>

                                  <View style={{ flex: 0.9 }}>
                                    <Text style={[tempStyle.radioOptionNew]}>
                                      {option.option}
                                      { }
                                    </Text>
                                    {option.description != "" && (
                                      <Text style={[styles.checkDesctiopn]}>
                                        {option.desc}
                                      </Text>
                                    )}
                                  </View>
                                </TouchableOpacity>
                              );
                            }
                          )}
                        </View>
                      </View>
                    ) : null}
                  </View>
                  <View
                    style={[
                      tempStyle.submitContainer,
                      { flexDirection: "row", marginTop: RFValue(1) },
                    ]}
                  >
                    {current_step > 0 && (
                      <TouchableOpacity
                        onPress={() => {
                          setCurrentStep(current_step - 1);
                          dispatch(AppActions.setCardStep(current_step - 1));
                          //   setQuestionArray(question_array)
                        }}
                        style={styles.previous}
                      >
                        <Text style={styles.buttonText}>
                          {strings.cards.previous}
                        </Text>
                      </TouchableOpacity>
                    )}
                    <View style={{ flex: 1 }}>
                      <ButtonNew
                        text={strings.cards.submit}
                        onBtnPress={() => _onSaveClick()}
                      />
                    </View>
                  </View>
                  {current_step == 2 && hints.length > 0 && (
                    <View style={styles.SwiperView}>
                      <Swiper
                        autoplay={true}
                        style={styles.wrapper}
                        showsPagination={true}
                        activeDotColor={COLOR.DARK_GREEN}
                        showsButtons={false}
                      >
                        {hints?.map((item) => {
                          return <Text style={styles.SwiperText}>{item}</Text>;
                        })}
                      </Swiper>
                    </View>
                  )}
                </ProgressStep>
              );
            })}
          </ProgressSteps>
        )}

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
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  addMargin: {
    marginBottom: 10,
  },
  checkboxTitle: {
    fontSize: RFValue(16),
    fontWeight: "600",
    marginBottom: RFValue(20),
  },
  checkDesctiopn: {
    fontFamily: FONTS.MEDIUM,
    color: COLOR.SOFT_GRAY,
    fontWeight: "400",
    fontSize: RFValue(13),
  },
  buttonTextStyle: {
    color: COLOR.PRIMARY,
    fontFamily: FONTS.BOLD,
  },
  previous: {
    flex: 1,
    marginHorizontal: 5,
    height: RFValue(45),
    width: "100%",
    borderRadius: RFValue(5),
    alignItems: "center",
    justifyContent: "center",
    marginTop: RFValue(10),
    borderColor: COLOR.DARK_GREEN,
    borderWidth: 1,
    //  backgroundColor: isDisabled ? GREY : PRIMARY,
  },
  buttonText: {
    fontSize: RFValue(15),
    color: COLOR.DARK_GREEN,
    textTransform: "uppercase",
    fontFamily: FONTS.MEDIUM,
    textAlign: "center",
  },
  stepDescription: {
    fontSize: 17,
    fontWeight: "400",
  },
  wrapper: {
    height: RFValue(100),
    padding: RFValue(10),
  },
  SwiperView: {
    marginTop: RFValue(5),
    backgroundColor: COLOR.BACKGROUND_ORANGE,

    borderRadius: RFValue(5),
    // height: RFValue(50),
  },
  SwiperText: {
    color: COLOR.WHITE,
    fontFamily: FONTS.BOLD,
    fontSize: RFValue(16),
  },
});
export default (TemplateSeven = React.memo(TemplateSeven));
