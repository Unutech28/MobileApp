// @ts-nocheck
import Button from "@components/common/button";
import GLOBALS from "@constants";
import * as ICONS from "@images";
import moment from "moment";
import React, { useCallback, useState, useEffect } from "react";
import {
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  FlatList,
  View,
  RefreshControl,
  Image,
  ImageBackground,
  TextInput,
} from "react-native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
const isiOS = Platform.OS == "ios";
const { FONTS, COLOR, STRINGS } = GLOBALS;
const { WHITE } = COLOR;
import ButtonBlue from "@components/common/buttonBlue";
import { element } from "prop-types";
const { LIGHT, REGULAR, CIRCULAR_MEDIUM, CIRCULAR_BOLD } = FONTS;

function CircleOfTrust(props) {
  let {
    goToCreateCircleClick,
    isCreateCircle,
    data,
    circleOfTrustInnerData,
    submitClick,
    QuesAnsDataAfterSave,
  } = props;

  const [isButton, setButton] = useState(false, "");
  const [refresh, setRefresh] = useState(false, "");

  const onTextAnswerChange = (text, item) => {
    if (circleOfTrustInnerData.questions !== undefined) {
      circleOfTrustInnerData.questions.forEach((element) => {
        if (element._id == item._id) {
          element.answer = text;
          // element.textAnswer = text
        }
      });
      setButton(true);
      setRefresh(!refresh);
    }
  };

  const onTextAnswerChangeCircle = (text, item) => {
    if (circleOfTrustInnerData.questiondetailslist !== undefined) {
      circleOfTrustInnerData.questiondetailslist.forEach((element) => {
        if (element._id == item._id) {
          element.answer = text;
          // element.textAnswer = text
        }
      });
      setButton(true);
      setRefresh(!refresh);
    }

    if (circleOfTrustInnerData.questions !== undefined) {
      circleOfTrustInnerData.questions.forEach((element) => {
        if (element._id == item._id) {
          element.answer = text;
        }
      });
      setButton(true);
      setRefresh(!refresh);
    }
  };

  const submitButtonClick = () => {
    submitClick();
  };

  return isCreateCircle ? (
    <ImageBackground
      style={{ flexGrow: 1 }}
      // source={ICONS.CreateCircle}
      // source={{ uri: GLOBALS.IMAGE_BASE_URL + data.image }}
      source={{ uri: data.image }}
      resizeMode="contain"
    >
      <View
        style={{ flexGrow: 1, justifyContent: "center", alignItems: "center" }}
      >
        <TouchableWithoutFeedback
          onPress={() =>
            goToCreateCircleClick(
              data.childrens !== undefined && data.childrens.length > 0
                ? data.childrens[0]
                : null
            )
          }
        >
          <Text
            style={{
              color: "#F05A28",
              fontSize: RFValue(34),
              fontFamily: CIRCULAR_MEDIUM,
              paddingBottom: RFValue(20),
              textAlign: "center",
              alignSelf: "center",
              padding: RFValue(32),
            }}
          >
            {data.title}
          </Text>
        </TouchableWithoutFeedback>
      </View>
    </ImageBackground>
  ) : (
    <KeyboardAwareScrollView style={{ backgroundColor: WHITE }}>
      <Text
        style={{
          color: "#111111",
          fontSize: RFValue(24),
          fontFamily: CIRCULAR_BOLD,
          paddingBottom: RFValue(20),
          alignSelf: "center",
          paddingTop: 20,
        }}
      >
        {circleOfTrustInnerData.heading}
      </Text>

      <Text style={{ alignSelf: "center", fontSize: 20 }}>1</Text>
      <Image
        source={ICONS.CircleOfTrust}
        // source={{ uri: GLOBALS.IMAGE_BASE_URL + circleOfTrustInnerData.image }}
        resizeMode="contain"
        style={{ alignSelf: "center" }}
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: -RFValue(80),
        }}
      >
        <Text style={styles.text}>3</Text>
        <Text style={{ fontSize: 20, paddingRight: 25 }}>2</Text>
      </View>

      <View style={{ marginTop: RFValue(70) }} />
      {circleOfTrustInnerData.questions != undefined &&
      circleOfTrustInnerData.questions.length > 0
        ? circleOfTrustInnerData.questions.map((ques, cIndex) => {
           
            if (
              QuesAnsDataAfterSave !== undefined &&
              QuesAnsDataAfterSave.questiondetailslist !== undefined
            ) {
              QuesAnsDataAfterSave.questiondetailslist.map((value) => {
                if (
                  ques.answer !== undefined &&
                  ques.answer.questionId !== undefined
                ) {
                  if (ques.answer.questionId == value.questionId) {
                    ques.answer.answer = value.answer;
                  }
                }
              });
            }

            if (ques.ansType == "text") {
              return (
                <View style={{ marginTop: RFValue(10) }}>
                  <Text style={styles.textStyle}>{ques.question}</Text>
                  <TextInput
                    style={styles.textInput}
                    value={
                      ques.answer != undefined
                        ? ques.answer.answer != undefined
                          ? ques.answer.answer
                          : ques.answer
                        : ""
                    }
                    // placeholder={ques.question}
                    placeholderTextColor={COLOR.BLACK}
                    maxLength={50}
                    underlineColorAndroid={"transparent"}
                    onChangeText={(text) => onTextAnswerChange(text, ques)}
                  />
                </View>
              );
            }
          })
        : null}

      {circleOfTrustInnerData.questiondetailslist != undefined &&
      circleOfTrustInnerData.questiondetailslist.length > 0
        ? circleOfTrustInnerData.questiondetailslist.map((ques, cIndex) => {
            return (
              <View style={{ marginTop: RFValue(10) }}>
                <Text style={styles.textStyle}>{ques.question}</Text>
                <TextInput
                  style={styles.textInput}
                  // value={ques.answer != undefined ? ques.answer : ''}
                  value={
                    ques.answer != undefined
                      ? ques.answer.answer != undefined
                        ? ques.answer.answer
                        : ques.answer
                      : ""
                  }
                  placeholderTextColor={COLOR.BLACK}
                  maxLength={50}
                  underlineColorAndroid={"transparent"}
                  onChangeText={(text) => onTextAnswerChangeCircle(text, ques)}
                />
              </View>
            );
          })
        : null}

      {/* {isButton ? */}
      <View style={{ margin: RFValue(15) }}>
        <ButtonBlue text={"Submit"} onBtnPress={() => submitButtonClick()} />
      </View>
      {/* : null} */}
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1.2,
  },
  textStyle: {
    color: "#111111",
    fontSize: RFValue(18),
    fontFamily: CIRCULAR_MEDIUM,
    paddingTop: 5,
    marginLeft: 20,
  },
  textInput: {
    height: RFValue(50),
    borderColor: "rgba(119, 131, 143, 0.2)",
    borderWidth: 1,
    borderRadius: 8,
    // backgroundColor: 'rgba(119, 131, 143, 0.2)',
    width: "90%",
    margin: RFValue(15),
    // marginLeft: RFValue(10),
    color: "#111111",
    fontSize: RFValue(16),
    fontFamily: CIRCULAR_MEDIUM,
    paddingLeft: 20,
  },
  text: { fontSize: 20, paddingLeft: 25 },
});
export default (CircleOfTrust = React.memo(CircleOfTrust));
