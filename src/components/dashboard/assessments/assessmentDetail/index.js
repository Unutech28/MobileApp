// @ts-nocheck
import Loader from "@components/common/screenLoader";
import GLOBALS from "@constants";
import * as Images from "@images";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import CustomButton from "@components/common/customButton";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { strings } from "@localization";

const { FONTS, COLOR } = GLOBALS;
const { DARK_GREEN, WHITE } = COLOR;
function AssessmentDetail(props) {
  const {
    allAssessmentsQuestions,
    selectedRadioOptions,
    addToSelectedOptionsRadio,
    addToSelectedOptionsCheckbox,
    assessmentQuestionsLoader,
    saveAssessmentQuestion,
    selectedOptions,
    saveAssessmentLoader,
    saveAssessmentText,
    assessment_status,
  } = props;
  const [description, setDescription] = useState("");
  const [disable, setDisableButton] = useState(false);
  const [isDisable, setButtonDisable] = useState(false);
  const [refresh, setRefresh] = useState(false, "");
  const [text, setText] = useState("");
  const [item, setItem] = useState([]);
  const [isText, setIsText] = useState(false);

  const getCheckedPropertyCheckbox = (optionToCheck) => {
    if (optionToCheck && optionToCheck.status) {
      setDisableButton(true);
      return true;
    } else {
      setDisableButton(false);
    }
    if (selectedOptions) {
      return selectedOptions.some(
        (selectedOption) => selectedOption._id === optionToCheck._id
      );
    }
  };
  const getCheckedPropertyRadio = (optionToCheck) => {
    console.log("optionToCheck", optionToCheck);
    console.log("selectedRadioOptions", selectedRadioOptions);
    if (optionToCheck && optionToCheck.status) {
      setDisableButton(true);
      return true;
    }
    let xyz = selectedRadioOptions.some(
      (selectedOption) => selectedOption._id === optionToCheck._id
    );

    return selectedRadioOptions.some(
      (selectedOption) => selectedOption._id === optionToCheck._id
    );
  };

  const onTextAnswerChange = (text, item, data) => {
    data.forEach((element) => {
      if (element._id == item._id) {
        console.log("here==>", element.answer, text);
        element.answer = text;
        setItem(item);
        setText(text);
        // saveAssessmentText(item, text);
      }
      text !== "" ? setIsText(true) : null;
    });
    setRefresh(!refresh);
  };

  const onSavePress = () => {
    isText && saveAssessmentText(item, text);
    saveAssessmentQuestion();
  };

  return (
    <KeyboardAwareScrollView
      enableOnAndroid={true}
      style={{
        backgroundColor: COLOR.BACKGROUND,
        paddingHorizontal: RFValue(16),
      }}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      {assessmentQuestionsLoader ? (
        <Loader loaderColor={"#000"} />
      ) : allAssessmentsQuestions ? (
        <View style={{ flex: 1 }}>
          {assessmentQuestionsLoader ? (
            <Loader />
          ) : (
            <FlatList
              contentContainerStyle={{
                flexGrow: 1,
                marginBottom: RFValue(2.2),
                marginTop: RFValue(8),
              }}
              extraData={refresh}
              data={allAssessmentsQuestions}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item._id}
              renderItem={({ item, index }) => {
                let question = item;
                return (
                  <View
                    style={{
                      paddingBottom: RFValue(10),
                    }}
                  >
                    <Text style={styles.question}>{question.question}</Text>
                    {question.questionType == "checkbox" && (
                      <FlatList
                        contentContainerStyle={{
                          flex: 1,
                        }}
                        data={question.options}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item, index }) => (
                          <View
                            style={{
                              paddingTop: 10,
                              paddingBottom: 10,
                              //  marginTop: RFValue(5),
                              //   marginLeft: RFValue(-10),
                            }}
                          >
                            <TouchableOpacity
                              disabled={disable}
                              style={[
                                styles.optionWrapperCheckbox,
                                { marginBottom: RFValue(1) },
                              ]}
                              onPress={() => {
                                // addToSelectedOptionsCheckbox(
                                //   question,
                                //   item,
                                // )
                                assessment_status == "completed"
                                  ? null
                                  : addToSelectedOptionsCheckbox(
                                      question,
                                      item
                                    );
                              }}
                            >
                              <View
                                style={{ flex: 0.15, alignItems: "center" }}
                              >
                                <Image
                                  source={
                                    getCheckedPropertyCheckbox(item)
                                      ? Images.Checked
                                      : Images.UnChecked
                                  }
                                  style={{
                                    width: RFValue(20),
                                    height: RFValue(20),
                                  }}
                                />
                              </View>

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
                          </View>
                        )}
                        ListEmptyComponent={
                          <View
                            style={{
                              flex: 1,
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Text
                              style={{
                                fontSize: RFValue(15),
                                color: COLOR.GREY,
                                fontFamily: FONTS.REGULAR,
                              }}
                            >
                              {strings.journal.No_options}
                            </Text>
                          </View>
                        }
                      />
                    )}
                    {item.questionType == "radio" && (
                      <FlatList
                        // contentContainerStyle={{
                        //   flex: 1,
                        // }}
                        data={item.options}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item, index }) => (
                          <View
                            style={{
                              paddingTop: 10,
                              paddingBottom: 10,
                            }}
                          >
                            <TouchableOpacity
                              disabled={disable}
                              style={styles.optionWrapper}
                              onPress={() => {
                                // addToSelectedOptionsRadio(question, item);
                                assessment_status == "completed"
                                  ? null
                                  : addToSelectedOptionsRadio(question, item);
                              }}
                            >
                              <Image
                                resizeMode="contain"
                                source={
                                  getCheckedPropertyRadio(item)
                                    ? Images.GreenCircle1
                                    : Images.WhiteCircle1
                                }
                                style={styles.radioButton}
                              />
                              <Text style={styles.optionStyle}>
                                {item.optionValue}
                              </Text>
                            </TouchableOpacity>
                          </View>
                        )}
                        ListEmptyComponent={
                          <View
                            style={{
                              flex: 1,
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Text
                              style={{
                                fontSize: RFValue(15),
                                color: COLOR.GREY,
                                fontFamily: FONTS.REGULAR,
                              }}
                            >
                              {strings.journal.No_options}
                            </Text>
                          </View>
                        }
                      />
                    )}
                    {item.questionType == "text" &&
                      (item.textAns ? (
                        <Text
                          style={{
                            fontSize: RFValue(15),
                            color: COLOR.GREY,
                            fontFamily: FONTS.REGULAR,
                          }}
                        >
                          {item.textAns}
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
                            item.answer != undefined && item.answer != ""
                              ? item.answer
                              : ""
                          }
                          onChangeText={(text) => {
                            onTextAnswerChange(
                              text,
                              item,
                              allAssessmentsQuestions
                            );
                          }}
                        />
                      ))}
                  </View>
                );
              }}
              ListFooterComponent={
                allAssessmentsQuestions.length > 0 && (
                  <View style={styles.buttonWrapper}>
                    <CustomButton
                      text={strings.activity.save_txt}
                      onBtnPress={onSavePress}
                      isDisabled={disable}
                      colors={[DARK_GREEN, DARK_GREEN]}
                      //  colors={["#6545B2", "#6545B2", "#6545B2"]}
                      loader={saveAssessmentLoader}
                      buttonStyle={{
                        backgroundColor: DARK_GREEN,
                        borderRadius: 10,
                      }}
                      buttonText={{ color: WHITE }}
                    />
                    {/* {assessment_status != 'completed' && (
                      <CustomButton
                        text={strings.activity.save_txt}
                        onBtnPress={saveAssessmentQuestion}
                        isDisabled={disable}
                        colors={[DARK_GREEN, DARK_GREEN]}
                        //  colors={["#6545B2", "#6545B2", "#6545B2"]}
                        loader={saveAssessmentLoader}
                        buttonStyle={{
                          backgroundColor: DARK_GREEN,
                          borderRadius: 10,
                        }}
                        buttonText={{color: WHITE}}
                      />
                    )} */}
                  </View>
                )
              }
              ListEmptyComponent={
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: RFValue(15),
                      color: COLOR.GREY,
                      fontFamily: FONTS.REGULAR,
                    }}
                  >
                    No questions are available
                  </Text>
                </View>
              }
            />
          )}
        </View>
      ) : (
        <NoData />
      )}
    </KeyboardAwareScrollView>
  );
}

export default AssessmentDetail;
const styles = StyleSheet.create({
  question: {
    fontSize: RFValue(20),
    fontFamily: FONTS.BOLD,
    marginTop: RFValue(10),
    marginBottom: RFValue(2.2),
    marginLeft: RFValue(5),
    color: COLOR.SOFT_GRAY,
  },
  optionWrapperCheckbox: {
    flex: 1,
    flexDirection: "row",
  },
  optionWrapper: {
    flex: 1,
    flexDirection: "row",
    marginBottom: RFValue(-10),
  },
  optionStyle: {
    flex: 0.85,
    fontSize: RFValue(15),
    fontWeight: "600",
    fontFamily: FONTS.SEMI_BOLD,
    color: COLOR.SOFT_GRAY,
    paddingTop: RFValue(1),
  },
  radioButton: {
    flex: 0.15,
    height: RFValue(20),
    //  backgroundColor: 'red',
  },
});
