import tempStyle from "@components/dashboard/dailyLearningTemplates/globalTemplateStyle";
import GLOBALS from "@constants";
import * as ICONS from "@images";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import React, { useState, useEffect } from "react";
import ButtonNew from "@components/common/buttonNew";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
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
  Keyboard,
} from "react-native";
import { Slider } from "@miblanchard/react-native-slider";
const { FONTS, COLOR } = GLOBALS;
import * as AppActions from "@actions";
// import convertToProxyURL from 'react-native-video-cache';
import {
  ImageElement,
  ShowHtmlText,
  CardTitle,
  LikeElement,
} from "@components/dashboard/dailyLearningTemplates/templateElements";
import Icon from "react-native-vector-icons/AntDesign";
import { useSelector, useDispatch } from "react-redux";
import { SvgUri, SvgCssUri } from "react-native-svg";
import { checkQuesInvalid, showEmptyAlert } from "../utilities";
import { getImageView } from "../../../../helpers/common";

const { width, height } = Dimensions.get("window");

//Template with a image and textInput
function TemplateTwentythree(props) {
  let { cardData, onCommentClick, onSubmit, cardState } = props;
  const [question_array, setQuestionArray] = useState([]);
  const [cardImg, setCardImg] = useState(null);
  /** Set Base URL of media path starts */
  const [imageBaseURL, setImageBaseURL] = useState(
    cardState?.imgBp ? cardState.imgBp : ""
  );
  const dispatch = useDispatch();

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

      onSubmit(param, cardData?.otherAttribute?.feedbackMessage?.trim());
    }
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
        </View>

        <View
          style={{
            width: "100%",
            alignItems: "center",
            marginTop: RFValue(15),
          }}
        >
          {cardImg != null && cardData.img && cardData.img.length > 0
            ? getImageView(`${imageBaseURL}${cardImg[0].url}`)
            : getImageView(
                "https://mamalift-uat.curio-dtx.com/upload/0.47199342596470784--stella.svg",
                120,
                120
              )}
        </View>
        <View style={{ marginTop: RFValue(10), width: "100%" }}>
          {question_array.map((ques_data, array_index) => {
            return (
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
            );
          })}
        </View>
        <View style={{ marginTop: RFValue(10), width: "100%" }}>
          <ButtonNew
            text={
              cardData?.otherAttribute?.buttonText
                ? cardData?.otherAttribute?.buttonText
                : "save"
            }
            onBtnPress={() => {
              _onSaveClick();
            }}
          />
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
  container: {
    backgroundColor: "white", //COLOR.BACKGROUND,
    flexGrow: 1,
  },
  cardImageContainer: {
    width: "100%",
    alignItems: "center",
    borderRadius: RFValue(10),
    justifyContent: "center",
  },
  cardImage: {
    borderRadius: RFValue(10),
    width: "100%",
    minHeight: RFValue(190),
    maxHeight: RFValue(200),
    borderRadius: RFValue(10),
  },
  cardImageforFreeSize: {
    borderRadius: RFValue(10),
    width: "100%",
    height: "100%",
    borderRadius: RFValue(10),
  },
});
export default TemplateTwentythree = React.memo(TemplateTwentythree);
