import GLOBALS from "@constants";
import * as Images from "@images";
import tempStyle from "@components/dashboard/dailyLearningTemplates/globalTemplateStyle";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { RFValue } from "react-native-responsive-fontsize";
import { strings } from "@localization";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import ButtonNew from "@components/common/buttonNew";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
const { FONTS, COLOR } = GLOBALS;

import * as AppActions from "@actions";
import {
  ImageElement,
  ShowHtmlText,
  CardTitle,
  LikeElement,
} from "@components/dashboard/dailyLearningTemplates/templateElements";
import PlatGif from "@components/common/PlayGif";

import { checkQuesInvalid, showEmptyAlert } from "../../utilities";
let window = Dimensions.get("window");
const windowHeight = Dimensions.get("window").height;
const { width, height } = Dimensions.get("window");
function TemplateTwo(props) {
  const videoPlayer = React.useRef();
  const dispatch = useDispatch();
  let { cardData, onCommentClick, onSubmit, cardState } = props;
  const [question_array, setQuestionArray] = useState([]);
  /** Set Base URL of media path starts */
  const [imageBaseURL, setImageBaseURL] = useState(
    cardState?.imgBp ? cardState.imgBp : ""
  );
  const [cardImg, setCardImg] = useState(null);
  useEffect(() => {
    let array = [];

    if (cardData.img != null) {
      if (cardImg == null) {
        setCardImg(cardData.img);
      } else if (cardImg != null && cardImg[0].url != cardData.img[0].url) {
        setCardImg(cardData.img);
      }
    }

    /**Get user submitted response */
    let user_response = cardData?.action?.user_response
      ? cardData?.action?.user_response
      : [];
    /*** Map user selected response and all options ***/
    if (
      cardData?.otherAttribute &&
      cardData?.otherAttribute?.questions?.length > 0
    ) {
      cardData?.otherAttribute?.questions.map((m) => {
        let matched_index = -1;
        matched_index = user_response.findIndex((x) => x.ques_id === m.ques_id);
        array.push({
          ...m,
          ansOptions: m.ansOptions.map((i, option_index) => ({
            ...i,
            answer:
              matched_index > -1
                ? user_response[matched_index].ansOptions[option_index]?.answer
                : m.isdisable == true
                  ? i.input
                  : "",
            isChecked:
              matched_index > -1
                ? user_response[matched_index].ansOptions[option_index]
                  ?.isChecked
                : false,
          })),
        });
      });
    }

    setQuestionArray(array);
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
  /**Handling of Check Box, radio Click event */
  const onItemClick = (array_index, option, type) => {
    if (type == "radio" && option.isChecked) {
      return;
    }
    let modify_option = question_array[array_index].ansOptions.map((o) => {
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
    let changed_question = { ...question_array[array_index] };

    changed_question = Object.assign({}, changed_question, {
      ansOptions: modify_option,
    });
    all_question = Object.assign([], all_question, {
      [array_index]: changed_question,
    });
    setQuestionArray(all_question);
    if (
      question_array.length == 1 &&
      question_array[0].questionType == 'radio'
    ) {
      _onSaveClick();

    }

    // if (
    //   question_array.add_questions.length == 1 &&
    //   question_array.add_questions[0].assessment_type == 'radio'
    // ) {
    //   _onSaveClick();
    // }
  };

  const _onSaveClick = () => {
    if (checkQuesInvalid(question_array)) {
      showEmptyAlert();
      return;
    } else {
      let param = {
        cardId: cardData?._id,
        action: { user_response: question_array },
        week: cardData.week,
        day: cardData.day,
      };
      onSubmit(param, cardData?.otherAttribute?.sendRes.trim());

    }
  };
  /**Get answer for the radio Button if saved */
  const getAnswer = (data) => {
    return data.ansOptions.map((m) => {
      if (
        m.isChecked &&
        m.ans.trim() != ""
      ) {
        return (
          <View style={[tempStyle.ansContainer]}>
            <Text style={[tempStyle.ansContent]}>{m.ans}</Text>
          </View>
        );
      }
    });
  };

  /***Handling Text Input */
  const onTextAnswerChange = (text, array_index, option) => {
    let modify_option = question_array[array_index].ansOptions.map((o) => {
      if (option.option_id == o.option_id) {
        o.answer = text;
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
  };

  return (
    <KeyboardAwareScrollView
      enableAutomaticScroll={true}
      keyboardShouldPersistTaps={"handled"}
      enableOnAndroid={true}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{}}
      nestedScrollEnabled={true}
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
          {question_array.map((ques_data, array_index) => {
            return ques_data.questionType == "textarea" ? (
              <View style={styles.addMargin}>
                <Text style={[tempStyle.cardDescription, tempStyle.quesFont]}>
                  {ques_data.questionName}
                </Text>
                <Text
                  style={[
                    tempStyle.cardDescription,
                    tempStyle.quesFont,
                    {
                      fontSize: RFValue(11),
                      fontWeight: "400",
                    },
                  ]}
                >
                  {ques_data.questionDesc}
                </Text>

                <View style={styles.answerContainer}>
                  {ques_data.ansOptions.map((option, index) => {
                    return (
                      <View style={{ flexDirection: "row", marginBottom: 25 }}>
                        <TextInput
                          multiline={true}
                          placeholder={option.input ? option.input : ""}
                          style={[
                            tempStyle.queTextInputAreaStyle,
                            {
                              fontSize: RFValue(13),
                              height: RFValue(100),
                              borderColor: ques_data.isdisable
                                ? COLOR.GREY
                                : "black",
                              color: ques_data.isdisable ? COLOR.GREY : "black",
                            },
                          ]}
                          value={option.answer}
                          maxLength={2000}
                          selectionColor={"green"}
                          underlineColorAndroid={"transparent"}
                          onChangeText={(text) =>
                            onTextAnswerChange(text, array_index, option)
                          }
                        />
                      </View>
                    );
                  })}
                </View>
              </View>
            ) : ques_data.questionType == "textinput" ? (
              <View style={styles.addMargin}>
                <Text style={[tempStyle.cardDescription, tempStyle.quesFont]}>
                  {ques_data.questionName}
                </Text>
                <Text
                  style={[
                    tempStyle.cardDescription,
                    tempStyle.quesFont,
                    {
                      fontSize: RFValue(11),
                      fontWeight: "400",
                    },
                  ]}
                >
                  {ques_data.questionDesc}
                </Text>
                <View style={styles.answerContainer}>
                  {ques_data.ansOptions.map((option, index) => {
                    return (
                      <View style={{ flexDirection: "row", marginBottom: 25 }}>
                        <Text style={tempStyle.quesBullet}>{index + 1}).</Text>
                        <TextInput
                          placeholder={option.input ? option.input : ""}
                          style={[tempStyle.queTextInputStyle]}
                          value={option.answer}
                          maxLength={2000}
                          multiline={true}
                          underlineColorAndroid={"transparent"}
                          onChangeText={(text) =>
                            onTextAnswerChange(text, array_index, option)
                          }
                        />
                      </View>
                    );
                  })}
                </View>
              </View>
            ) : ques_data.questionType == "radio" ? (
              <View style={styles.addMargin}>
                <Text style={[tempStyle.cardDescription, tempStyle.quesFont]}>
                  {ques_data.questionName}
                </Text>
                <Text
                  style={[
                    tempStyle.cardDescription,
                    tempStyle.quesFont,
                    {
                      fontSize: RFValue(11),
                      fontWeight: "400",
                    },
                  ]}
                >
                  {ques_data.questionDesc}
                </Text>
                <View style={styles.answerContainer}>
                  {ques_data.ansOptions.map((option, index) => {
                    return (
                      <TouchableOpacity
                        onPress={() =>
                          onItemClick(array_index, option, "radio")
                        }
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginBottom: 15,
                        }}
                      >
                        <View
                          style={{
                            flex: 0.15,
                            justifyContent: "center",
                          }}
                        >
                          {option.img && option.img != '' ? (
                            <Image
                              resizeMode="contain"
                              source={{
                                uri: `${imageBaseURL}${option.img}`,
                              }}
                              style={[tempStyle.optionImage, {}]}
                            />

                          ) : null}
                          <Image
                            resizeMode="contain"
                            source={
                              option.isChecked
                                ? Images.GreenCircle1
                                : Images.WhiteCircle1
                            }
                            style={tempStyle.radioButton}
                          />
                        </View>

                        <View style={{ flex: 1 }}>
                          <Text
                            style={[
                              tempStyle.radioOptionNew,
                              { paddingBottom: 0 },
                            ]}
                          >
                            {option.option}
                          </Text>

                          {option.desc != "" && (
                            <Text style={[styles.checkDesctiopn]}>
                              {option.desc}{" "}
                            </Text>
                          )}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                  {getAnswer(ques_data)}
                </View>
              </View>
            ) : ques_data.questionType == "checkbox" ? (
              <View style={styles.addMargin}>
                <Text style={[tempStyle.cardDescription, tempStyle.quesFont]}>
                  {ques_data.questionName}
                </Text>
                <Text
                  style={[
                    tempStyle.cardDescription,
                    tempStyle.quesFont,
                    {
                      fontSize: RFValue(11),
                      fontWeight: "400",
                    },
                  ]}
                >
                  {ques_data.questionDesc}
                </Text>
                <View style={styles.answerContainer}>
                  {ques_data.ansOptions.map((option, index) => {
                    return (
                      <TouchableOpacity
                        onPress={() =>
                          onItemClick(array_index, option, "checkbox")
                        }
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginBottom: 15,
                        }}
                      >
                        <View
                          style={{
                            flex: 0.15,
                            justifyContent: "center",
                          }}
                        >
                          {option.img && option.img != '' ? (
                            <Image
                              resizeMode="contain"
                              source={{
                                uri: `${imageBaseURL}${option.img}`,
                              }}
                              style={[tempStyle.optionImage, {}]}
                            />

                          ) : null}
                          <Image
                            resizeMode="contain"
                            source={
                              option.isChecked
                                ? Images.Checked
                                : Images.UnChecked
                            }
                            style={[tempStyle.checkButton, { width: 20 }]}
                          />
                        </View>

                        <View style={{ flex: 1 }}>
                          <Text
                            style={[
                              tempStyle.radioOptionNew,
                              { paddingBottom: 0 },
                            ]}
                          >
                            {option.option}
                          </Text>

                          {option.desc != "" && (
                            <Text style={[styles.checkDesctiopn]}>
                              {option.desc}{" "}
                            </Text>
                          )}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            ) : null;
          })}
        </View>
        {question_array.length == 1 &&
          question_array[0].questionType == 'radio'
          ? null : (
            <View style={tempStyle.submitContainer}>
              <ButtonNew
                text={strings.cards.submit}
                onBtnPress={() => _onSaveClick()}
              />
            </View>
          )
        }


        {/******************Render Image with Caption ************/}
        {cardImg != null && cardData.img && cardData.img.length > 0 && (
          <View
            style={[
              tempStyle.cardImageContainer,
              { backgroundColor: "transparent" },
            ]}
          >

            {
              cardData?.img[0]?.isGif ?
                <PlatGif
                  url={`${imageBaseURL}${cardData.img[0].url}`}
                  thumbnail={`${imageBaseURL}${cardData.img[0].thumbnail}`}
                />
                :
                <ImageElement
                  resizeMethod="resize"
                  source={{
                    uri: `${imageBaseURL}${cardImg[0].url}`,
                  }}
                  resizeMode={"cover"}
                  style={[
                    tempStyle.cardImage,
                    {
                      minHeight: 210,
                      overflow: "hidden",
                      backgroundColor: "transparent",
                    },
                  ]}
                  isLoad={true}
                />
            }

          </View>
        )}
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
          if (videoPlayer && videoPlayer.current) {
            videoPlayer.current.setNativeProps({ paused: true });
          }
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
});
export default (TemplateTwo = React.memo(TemplateTwo));
