import tempStyle from "@components/dashboard/dailyLearningTemplates/globalTemplateStyle";
import GLOBALS from "@constants";
import * as ICONS from "@images";
import React, { useState, useEffect } from "react";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { WebView } from "react-native-webview";
import ButtonNew from "@components/common/buttonNew";
import FastImage from "react-native-fast-image";
import { alertWithTwoBtn, alertWithOneBtn } from "@helpers/common";
import IoniIcon from "react-native-vector-icons/Ionicons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  ActivityIndicator,
  Keyboard,
  LayoutAnimation,
  FlatList,
  TextInput,
} from "react-native";
// import Slider from "react-native-slider";
import { checkQuesInvalid, showEmptyAlert } from "../utilities";
const { FONTS, COLOR } = GLOBALS;
import * as AppActions from "@actions";
// import convertToProxyURL from "react-native-video-cache";
import { strings } from "@localization";
import {
  ImageElement,
  ShowHtmlText,
  CardTitle,
  LikeElement,
} from "@components/dashboard/dailyLearningTemplates/templateElements";

import { useSelector, useDispatch } from "react-redux";
const { width, height } = Dimensions.get("window");
import Icon from "react-native-vector-icons/FontAwesome5";
function TemplateFive(props) {
  let { cardData, onCommentClick, onSubmit } = props;
  const [question_array, setQuestionArray] = useState([]);
  const videoPlayer = React.useRef();
  const dispatch = useDispatch();
  useEffect(() => {
    let array = [];
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
          })),
        });
      });
    }

    setQuestionArray(array);
  }, [cardData]);

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
      return COLOR.YELLOW;
    }
    if (order === 1) {
      return COLOR.BUTTON_ORANGE;
    }
    if (order === 2) {
      return COLOR.DARK_GREEN;
    }
    if (order === 3) {
      return COLOR.CIRCLE_GRAY;
    }
  };
  /***Handling Text Input */
  const onTextAnswerChange = (text, array_index, option) => {
    let modify_option = question_array[array_index].ansOptions.map((o) => {
      if (option._id == o._id) {
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
              <View
                style={[{ flexDirection: "row", marginVertical: RFValue(5) }]}
              >
                <View
                  style={[
                    styles.leftContainer,
                    {
                      backgroundColor: boxBackgroundColor(array_index),
                    },
                  ]}
                >
                  <Text
                    style={[tempStyle.cardDescription, { marginBottom: 0 }]}
                  >
                    {ques_data.questionName}
                  </Text>
                </View>

                <View style={{ flex: 1 }}>
                  {ques_data.ansOptions.map((option, index) => {
                    return (
                      <View style={{ flexDirection: "column" }}>
                        <TextInput
                          editable={!ques_data.isdisable}
                          multiline={true}
                          placeholder={option.input ? option.input : ""}
                          placeholderTextColor={COLOR.GREY}
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
            ) : null;
          })}
        </View>
        <View style={tempStyle.submitContainer}>
          <ButtonNew
            text={strings.cards.submit}
            onBtnPress={() => _onSaveClick()}
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
    //marginBottom: 10,
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
  leftContainer: {
    flex: 0.4,
    justifyContent: "center",
    alignItems: "center",
    marginRight: RFValue(5),
    borderRadius: RFValue(5),
    padding: RFValue(5),
  },
});
export default TemplateFive = React.memo(TemplateFive);
