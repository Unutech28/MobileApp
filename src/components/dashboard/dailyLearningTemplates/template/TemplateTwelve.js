import NoData from "@components/common/NoData";
import Loader from "@components/common/screenLoader";
import tempStyle from "@components/dashboard/dailyLearningTemplates/globalTemplateStyle";
import GLOBALS from "@constants";
import * as ICONS from "@images";
import * as Images from "@images";

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
  LayoutAnimation,
  UIManager,
  FlatList,
  Dimensions,
} from "react-native";
const { width, height } = Dimensions.get("window");
import * as AppActions from "@actions";
const isiOS = Platform.OS == "ios";
// import Icon from 'react-native-vector-icons/FontAwesome5';
import Icon from "react-native-vector-icons/MaterialIcons";

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

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

function TemplateTwelve(props) {
  let { cardData, onSubmit, onLikeClick, onCommentClick, userId } = props;
  const dispatch = useDispatch();
  const reducerData = useSelector((state) => {
    return state;
  });

  const progressStepsProp = {
    topOffset: 0,
    borderWidth: 5,
    completedProgressBarColor: COLOR.PRIMARY,
    marginBottom: 20,
    activeLabelColor: COLOR.WHITE,
    activeStepIconColor: COLOR.sea_Green_dark,
    activeStepNumColor: COLOR.WHITE,
    disabledStepNumColor: COLOR.BLACK,
  };
  const singleStepProps = {
    removeBtnRow: true,
  };
  const [positiveMessage, setPositiveMessage] = useState([]);
  const [negativeMessage, setNegativeMessage] = useState([]);
  const [differenceMessage, setDifferenceMessage] = useState([]);

  const [slugData, setSlug] = useState("");
  const [question_array, setQuestionArray] = useState([]);
  const [assessmentContentArr, setContent] = useState([]);
  // const [current_step, setCurrentStep] = useState(
  //   reducerData.cardsReducer.current_step_For12
  // );
  const [current_step, setCurrentStep] = useState(0);
  const [selected, setSelected] = useState("");
  useEffect(() => {
    if (
      cardData.otherAttribute &&
      cardData.otherAttribute.conditionalMessages
    ) {
      let all_msg = [...cardData.otherAttribute.conditionalMessages];
      let positive = all_msg
        .filter((item) => item.condition === "positive")
        .map((ele) => ele.message);
      setPositiveMessage(positive);
      let negative = all_msg
        .filter((item) => item.condition === "negative")
        .map((ele) => ele.message);
      setNegativeMessage(negative);
      let difference = all_msg
        .filter((item) => item.condition === "difference")
        .map((ele) => ele.message);
      setDifferenceMessage(difference);
    }
  }, [cardData]);
  const onbackPress = () => {
    setSelected("");
    setCurrentStep(current_step - 1);
    dispatch(AppActions.setCardStepFor12(current_step - 1));
  };

  useEffect(() => {
    /**Get user submitted response */
    let user_response = cardData?.action?.user_response
      ? cardData?.action?.user_response
      : [];

    if (cardData.otherAttribute) {
      setSlug(cardData.otherAttribute.assessmentContent);
      setContent(cardData.otherAttribute.assessmentContentArr);
    }
    if (cardData.otherAttribute?.questions) {
      let all_question = [...cardData.otherAttribute?.questions];
      all_question = all_question.map((ques, index) => {
        ques = Object.assign({}, ques, {
          answers: cardData.otherAttribute.assessmentContentArr,
        });
        return ques;
      });

      all_question = all_question?.map((ques, index) => {
        let matched_index = -1;
        matched_index = user_response.findIndex(
          (x) => x.ques_id === ques.ques_id
        );
        ques.answers =
          matched_index > -1
            ? user_response[matched_index].answers
            : ques?.answers?.map((answer, ans_ind) => {
                answer = Object.assign({}, answer, {
                  isSelected: false,
                });
                return answer;
              });
        return ques;
      });
      setQuestionArray(all_question);
    }
  }, [cardData]);

  const onButtonPress = (option) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    setTimeout(() => {
      if (current_step < question_array?.length - 1) {
        setCurrentStep(current_step + 1);
        dispatch(AppActions.setCardStepFor12(current_step + 1));
      }
    }, 300);
    let modify_option = question_array[current_step].answers.map((o) => {
      if (option.index == o.index) {
        o.isSelected = true;
      } else {
        o.isSelected = false;
      }
      return o;
    });

    let all_question = [...question_array];
    let changed_question = {
      ...question_array[current_step],
    };
    changed_question = Object.assign({}, changed_question, {
      answers: modify_option,
    });
    all_question = Object.assign([], all_question, {
      [current_step]: changed_question,
    });
    setQuestionArray(all_question);
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

  const filterData = (comparison_key) => {
    let filteredArray = question_array
      .filter((element) =>
        element.answers.some(
          (subElement) =>
            subElement.name === comparison_key && subElement.isSelected == true
        )
      )
      .map((element) => {
        let newElt = Object.assign({}, element); // copies element
        return newElt.answers.filter(
          (subElement) =>
            subElement.name === comparison_key && subElement.isSelected == true
        );
      });
    return filteredArray;
  };

  // add assessmentcontent array in answer array
  const getColor = (index) => {
    switch (index) {
      case 0:
        return COLOR.sea_Green_dark;
      case 1:
        return COLOR.BUTTON_ORANGE;
      case 2:
        return COLOR.YELLOW;
      default:
        return COLOR.PRIMARY;
    }
  };
  const _onSaveClick = () => {
    let param = {
      cardId: cardData?._id,
      action: {
        user_response: question_array,
      },
      week: cardData.week,
      day: cardData.day,
    };
    if (slugData == "Different,Similiar,I do not know") {
      let diff_select_values,
        similar_select_values,
        not_know_value = [];
      diff_select_values = filterData("Different");
      similar_select_values = filterData("Similiar");
      not_know_value = filterData("I do not know");
      let X1 = diff_select_values.length + not_know_value.length;
      let customMsg = `${strings.cards.CUSTOM_MSG4} ${X1} ${
        strings.cards.CUSTOM_MSG5
      }`;
      onSubmit(param, customMsg, false, true);
    }
    //  else if (slugData == "Never,Sometimes,Quite Often") {
    //   let customMsg1 = "";
    //   let customMsg2 = "";
    //   let z = "";
    //   let q = "";
    //   customMsg1 =
    //     "Your answers suggest that, in general, you can be assertive when you communicate with others. Assertive communication is essential to express your needs while showing respect and consideration for others. Keep it up!";
    //   customMsg2 = `Your answers suggest that, it is not always easy for you to be assertive  when communicate with others. Sometimes, you can use strategies that are more passive (choosing not to express your opinion, even if it makes you frustrated, or not asking for help) or more aggressive (choosing to respond more harshly or impulsively) to deal with the other's opinions. These strategies are not useful and end up generating conflict and dissatisfaction in your relationship with others. Try to communicate your needs more assertively!`;

    //   let onlyContentData = [];
    //   question_array.forEach((item) => {
    //     onlyContentData.push(
    //       ...item.answers.filter((m) => m.isSelected == true)
    //     );
    //   });
    //   let contentMessage = onlyContentData.map((item) => item.name);
    //   let y = contentMessage.filter((item, i) => i === 0 || i === 3);
    //   z = !y.includes("Never");

    //   let p = contentMessage.filter((item, i) => i === 1 || i === 2 || i === 4);

    //   q = !p.includes("Quite Often");
    //   let message = differenceMessage[0];
    //   onSubmit(param, message.replace(/<\/?[^>]+(>|$)/g, ""));

    //   // onSubmit(param, message.replace(/<\/?[^>]+(>|$)/g, ""));
    //   // if (z && q) {
    //   //   onSubmit(param, customMsg1, false, true);
    //   // } else {
    //   //   onSubmit(param, customMsg2, false, true);
    //   // }
    //   // if (week == 3 && day == 4) {
    //   //   if (z && q) {
    //   //     onSubmit(param, customMsg1);
    //   //   } else {
    //   //     onSubmit(param, customMsg2);
    //   //   }
    //   // } else {
    //   //   onSubmit(param, differenceMessage);
    //   // }
    // }
    else if (
      slugData == "Never,Sometimes,Oftentimes" ||
      slugData == "Never,Sometimes,Quite Often"
    ) {
      let onlyContentData = [];
      let z = "";
      question_array.forEach((item) => {
        onlyContentData.push(
          ...item.answers.filter((m) => m.isSelected == true)
        );
      });
      let contentMessage = onlyContentData.map((item) => item.name);
      z = contentMessage.every((val) => val == "Never");
      if (z) {
        let message = negativeMessage[0];
        onSubmit(param, message.replace(/<\/?[^>]+(>|$)/g, ""));
      } else {
        let message = positiveMessage[0];
        onSubmit(param, message.replace(/<\/?[^>]+(>|$)/g, ""));
      }
    } else {
      let agree_values,
        completely_agree_values = [];
      agree_values = filterData("Agree");
      completely_agree_values = filterData("Completely Agree");
      if (agree_values.length > 0 || completely_agree_values.length > 0) {
        let message = positiveMessage[0];
        onSubmit(param, message.replace(/<\/?[^>]+(>|$)/g, ""));
      } else {
        let message = negativeMessage[0];
        onSubmit(param, message.replace(/<\/?[^>]+(>|$)/g, ""));
      }
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

        <View style={styles.buttonView}>
          {assessmentContentArr?.map((item, index) => {
            return (
              <TouchableOpacity
                style={[
                  styles.buttonStyle,
                  index == 1
                    ? { backgroundColor: COLOR.BUTTON_ORANGE }
                    : index == 2
                    ? { backgroundColor: COLOR.YELLOW }
                    : {},
                ]}
              >
                <Text style={[styles.buttonText]}>{item.name}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ flex: 1 }}>
          {question_array.length > 0 && (
            <ProgressSteps activeStep={current_step} {...progressStepsProp}>
              {question_array.map((question, index) => {
                return (
                  <ProgressStep {...singleStepProps}>
                    <Text style={styles.text}>{question.questionName}</Text>
                    <View style={styles.buttonView}>
                      <FlatList
                        data={question?.answers}
                        keyExtractor={({ item, index }) => item + index}
                        contentContainerStyle={{
                          alignItems: "center",
                        }}
                        numColumns={3}
                        renderItem={({ item, index }) => {
                          return (
                            <TouchableOpacity
                              onPress={() => onButtonPress(item)}
                              style={[
                                styles.buttonStyleforAnswr,
                                {
                                  borderColor: getColor(index),
                                  backgroundColor: item?.isSelected
                                    ? getColor(index)
                                    : COLOR.WHITE,
                                  width: item?.isSelected
                                    ? RFValue(98)
                                    : RFValue(90),
                                  marginTop: RFValue(10),
                                },
                              ]}
                            >
                              <Text
                                style={[
                                  styles.buttonText,
                                  {
                                    color: item?.isSelected
                                      ? COLOR.WHITE
                                      : getColor(index),
                                  },
                                ]}
                              >
                                {item?.name}
                              </Text>
                            </TouchableOpacity>
                          );
                        }}
                      />
                    </View>
                  </ProgressStep>
                );
              })}
            </ProgressSteps>
          )}
        </View>

        <View style={[tempStyle.submitContainer, { flexDirection: "row" }]}>
          {current_step > 0 && (
            <TouchableOpacity
              onPress={() => onbackPress()}
              style={styles.previous}
            >
              <Text style={[styles.buttonText, { color: COLOR.DARK_GREEN }]}>
                {strings.cards.previous}
              </Text>
            </TouchableOpacity>
          )}

          {current_step == question_array.length - 1 && (
            <View style={{ flex: 1 }}>
              <ButtonNew
                text={strings.profile.save}
                onBtnPress={() => _onSaveClick()}
              />
            </View>
          )}
        </View>
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
    color: COLOR.WHITE,
    fontFamily: FONTS.MEDIUM,
    textAlign: "center",
  },
  stepDescription: {
    fontSize: 17,
    fontWeight: "400",
  },
  buttonStyle: {
    height: RFValue(40),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLOR.sea_Green_dark,
    width: RFValue(90),
    borderRadius: RFValue(12),
  },
  buttonView: {
    marginVertical: RFValue(20),
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  buttonStyleforAnswr: {
    height: RFValue(50),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    width: RFValue(92),
    borderRadius: RFValue(12),
    borderWidth: 1,
    marginRight: RFValue(10),
    // flexDirection: 'row',
  },
  iconStyle: {
    marginLeft: RFValue(2),
    position: "absolute",
    bottom: 0,
  },
  text: {
    fontSize: RFValue(15),
    color: COLOR.BLACK,
    fontFamily: FONTS.MEDIUM,
  },
});
export default (TemplateTwelve = React.memo(TemplateTwelve));
