import Loader from "@components/common/screenLoader";
import GLOBALS from "@constants";
import * as Images from "@images";
import React, {
  Component,
  lazy,
  useEffect,
  useCallback,
  useState,
} from "react";
import {
  FlatList,
  Image,
  Text,
  StyleSheet,
  View,
  Modal,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from "react-native";
import { RFValue, RFPercentage } from "react-native-responsive-fontsize";
import { strings } from "@localization";

import ButtonNew from "@components/common/buttonNew";
import moment from "moment";
import Feather from "react-native-vector-icons/Feather";
const Header = lazy(() => import("@components/common/Header"));
import EditModal from "@components/dashboard/modals/EditModal";
import { storeObj } from '@store/setup';


const { FONTS, COLOR } = GLOBALS;
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
    draftPost,
    isRefreshApi,
    getTextVisible,
    getDrftAnsJournal,
    editAnswer,
    journalAnswers,
    gotoback
  } = props;
  const [description, setDescription] = useState("");
  const [editText, setEditText] = useState("");
  const [disable, setDisableButton] = useState(false);
  const [isRefresh, setRefresh] = useState(false);
  const [numOfLines, setNumOfLines] = useState(2);
  const [isVisible, setIsVisible] = useState(false);

  const [showMore, setShowMore] = useState(false);
  // const [answers, setAnswers] = useState(storeObj.store.getState().journalReducer?.journalAnswers)
  const [answers, setAnswers] = useState(journalAnswers)

  const [textInputans, setTextInputans] = useState('')
  const [textInputDis, setTextInputDis] = useState('')
  const [answerId, setAnswerId] = useState(0)

  useEffect(() => {
    setisEdit()
  }, [])

  useEffect(() => {
  }, [journalAnswers, answers])

  const setisEdit = () => {
    let data = []
    answers.map((item) => {
      item.isEdit = false
    })
    let sort = answers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setAnswers(sort)
  }
  const onTextLayout = useCallback((e) => {
    setShowMore(e.nativeEvent.lines.length > numOfLines);
  }, []);

  const getCheckedPropertyCheckbox = (optionToCheck) => {
    if (optionToCheck && optionToCheck.status) {
      setDisableButton(true);
      return true;
    }
    if (selectedOptions) {
      return selectedOptions.some(
        (selectedOption) => selectedOption._id === optionToCheck._id
      );
    }
  };
  const getCheckedPropertyRadio = (optionToCheck) => {
    if (optionToCheck && optionToCheck.status) {
      setDisableButton(true);
      return true;
    }
    return selectedRadioOptions.some(
      (selectedOption) => selectedOption._id === optionToCheck._id
    );
  };
  const _onSaveClick = () => {
    if (isVisible === true) {
      setIsVisible(!isVisible);
    }
    // saveAssessmentText(textInputans, textInputDis)
    saveAssessmentQuestion();
    setDescription("");
    setRefresh(!isRefresh);
  };

  const onEditAnswer = () => {
    console.log("Edited data==>", editText);
    if (isVisible === true) {
      setIsVisible(!isVisible);
    }
    editAnswer(answerId, editText)
    setRefresh(!isRefresh);
  }

  const onChangeTextValue = (item, description) => {
    setDescription(description);
    saveAssessmentText(item, description);
    // setTextInputDis(description)
    // setTextInputans(item)
    //store text in reducer
    //call reducer action
    draftPost(item, description);
  };

  const onEditTextValue = (item, editText) => {
    console.log("item====>", item, editText);
    let arrray = answers
    arrray.map((answer) => {
      if (item._id == answer._id) {
        answer.textAns = editText

      }
    })
    console.log("item====>Array", arrray);
    setAnswers(arrray)
    setEditText(editText)
    setAnswerId(item._id)
    // item?.textAns = editText
    // allAssessmentsQuestions.map((e) => {
    //   console.log("here==>", e);
    //   if (e.questionType == "text") {
    //     let textAnsArray = [];
    //     textAnsArray = e.textAns;
    //     textAnsArray.forEach((element) => {
    //       if (element._id == item._id) {
    //         element.textAns = editText;
    //         setEditText(editText);
    //         saveAssessmentText(element, editText, true);
    //       } else {
    //         element.isEdit = !item.isEdit;
    //         setRefresh(!isRefresh);
    //       }
    //     });
    //   }
    // });
  };

  const callEditFunction = (item, data) => {
    item.isEdit = !item.isEdit;
    setIsVisible(!isVisible);
    setRefresh(!isRefresh);
  };

  return (
    <View
      style={{
        flexGrow: 1,
        paddingHorizontal: RFValue(16),
      }}
    >
      {assessmentQuestionsLoader ? (
        <Loader loaderColor={"#000"} />
      ) : allAssessmentsQuestions ? (
        <View style={{}}>
          <View style={{}}>
            {assessmentQuestionsLoader ? (
              <Loader />
            ) : (
              <View style={{}}>
                <FlatList
                  contentContainerStyle={{
                    marginBottom: RFValue(2.2),
                    marginTop: RFValue(8),
                  }}
                  extraData={isRefresh}
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
                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          {question.convertedUrl ? (
                            <Image
                              style={{
                                height: RFValue(15),
                                width: RFValue(15),
                                marginRight: 10,
                              }}
                              source={{
                                uri:
                                  GLOBALS.IMAGE_BASE_URL +
                                  question.convertedUrl,
                              }}
                            />
                          ) : null}
                          <Text style={styles.qusTextStyle}>
                            {question.question}
                          </Text>
                        </View>

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
                                  marginTop: RFValue(5),
                                  marginLeft: RFValue(-10),
                                }}
                              >
                                <TouchableOpacity
                                  disabled={disable}
                                  style={[
                                    styles.optionWrapper,
                                    // { marginBottom: RFValue(-21) },
                                  ]}
                                  onPress={() => {
                                    addToSelectedOptionsCheckbox(
                                      question,
                                      item
                                    );
                                  }}
                                >
                                  <Image
                                    source={
                                      getCheckedPropertyCheckbox(item)
                                        ? Images.Checked
                                        : Images.UnChecked
                                    }
                                    style={{
                                      width: RFValue(40),
                                      height: RFValue(40),
                                    }}
                                  />
                                  <Text
                                    style={[
                                      styles.optionStyle,
                                      { paddingTop: RFValue(13) },
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
                            contentContainerStyle={{
                              flex: 1,
                            }}
                            data={item.options}
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item) => item._id}
                            renderItem={({ item, index }) => (
                              <View style={{ marginTop: RFValue(5) }}>
                                <TouchableOpacity
                                  disabled={disable}
                                  style={styles.optionWrapper}
                                  onPress={() => {
                                    addToSelectedOptionsRadio(question, item);
                                  }}
                                >
                                  <Image
                                    source={
                                      item.selected
                                        ? Images.GreenCircle
                                        : Images.WhiteCircle
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

                        {item.questionType == "text" ? (
                          <View style={{ flex: 1 }}>
                            <TextInput
                              multiline
                              placeholder={strings.journal.Type_here}
                              disabled={disable}
                              value={
                                getDrftAnsJournal
                                  ? getDrftAnsJournal
                                  : description
                              }
                              style={{
                                marginTop: RFValue(13),
                                height: RFValue(180),
                                borderWidth: 1,
                                borderColor: COLOR.BORDER_COLOR,
                                padding: RFValue(16),
                                fontFamily: FONTS.REGULAR,
                                fontSize: RFValue(16),
                                borderRadius: RFPercentage(1),
                                backgroundColor: "#fff",
                                shadowColor: COLOR.SHADOW,
                                shadowOffset: { width: 0, height: 5 },
                                shadowOpacity: 0.2,
                                shadowRadius: 1,
                                elevation: 5,
                                textAlignVertical: "top",
                              }}
                              onChangeText={(description) => {
                                onChangeTextValue(item, description);
                              }}
                            />

                          </View>
                        ) : null}
                        <View style={{ flex: 0.15 }}>
                          {allAssessmentsQuestions.length > 0 && (
                            <View
                              style={{
                                justifyContent: "center",
                                marginTop: RFValue(5),
                              }}
                            >
                              <ButtonNew
                                text={strings.profile.save}
                                onBtnPress={() => _onSaveClick()}
                                isDisabled={
                                  selectedRadioOptions.length > 0 ||
                                    selectedOptions.length > 0
                                    ? false
                                    : description == "" &&
                                      editText == "" &&
                                      getDrftAnsJournal == undefined
                                      ? true
                                      : false
                                }
                                loader={saveAssessmentLoader}
                              />
                            </View>
                          )}
                        </View>


                        <View style={{ marginTop: RFValue(10) }} />
                        {question.questionType == "text" &&
                          answers &&
                          answers.length ? (
                          <View style={{ marginTop: RFValue(20) }}>
                            <Text
                              style={{
                                fontSize: RFValue(17),
                                fontFamily: FONTS.REGULAR,
                                fontWeight: "700",
                              }}
                            >
                              {strings.journal.Past_entries}:
                            </Text>
                            {answers.map((item) => (

                              <View style={styles.card}>
                                <View style={styles.imageContainer}>
                                  <Image
                                    source={Images.rectangle}
                                    style={styles.img}
                                    tintColor={COLOR.DARK_GREEN}
                                  />
                                </View>
                                <View
                                  style={{ flex: 0.55, padding: RFValue(12) }}
                                >
                                  <Text
                                    style={{
                                      fontSize: RFValue(12),
                                      fontWeight: "500",
                                      color: COLOR.LIGHT_BLACK,
                                      fontFamily: FONTS.REGULAR,
                                    }}
                                  >
                                    {moment(item.createdAt).format(
                                      "MM-DD-YYYY  HH:mm A"
                                    )}
                                  </Text>
                                  {item.isEdit ? (
                                    <EditModal
                                      modalVisible={isVisible}
                                      title={strings.journal.EditJournal}
                                      onHeaderLeftIconClick={() => {
                                        callEditFunction(item, item.textAns);
                                      }}
                                      value={item.textAns}
                                      // onSubmitEditing={() => _onSaveClick()}
                                      onChangeJournalText={(editText) => {
                                        onEditTextValue(item, editText);
                                      }}
                                      totalQuestions={allAssessmentsQuestions}
                                      onSaveClick={() => onEditAnswer()}
                                      isDisabled={
                                        selectedRadioOptions.length > 0 ||
                                          selectedOptions.length > 0
                                          ? false
                                          : description == "" &&
                                            editText == "" &&
                                            getDrftAnsJournal == undefined
                                            ? true
                                            : false
                                      }
                                      loader={saveAssessmentLoader}
                                    />
                                  ) : (
                                    <View>
                                      <Text
                                        numberOfLines={numOfLines}
                                        onTextLayout={onTextLayout}
                                        style={{
                                          paddingTop: RFValue(5),
                                          fontSize: RFValue(15),
                                          color: COLOR.LIGHT_BLACK,
                                          fontFamily: FONTS.REGULAR,
                                          fontWeight: "500",
                                        }}
                                      >
                                        {item.textAns.trim()}
                                      </Text>
                                      {item.textAns.length > 45 ? (
                                        <TouchableOpacity
                                          onPress={() =>
                                            callEditFunction(item, item.textAns)
                                          }
                                        >
                                          <Text style={styles.read}>
                                            {strings.journal.Read_more}
                                          </Text>
                                        </TouchableOpacity>
                                      ) : null}
                                    </View>
                                  )}
                                </View>
                                <View style={{ flex: 0.15 }}>
                                  <TouchableOpacity
                                    onPress={() =>
                                      callEditFunction(item, item.textAns)
                                    }
                                  >
                                    <Feather
                                      name="edit-2"
                                      color={
                                        item.isEdit ? COLOR.PRIMARY : "black"
                                      }
                                      size={24}
                                      style={{ padding: RFValue(5) }}
                                    />
                                  </TouchableOpacity>
                                </View>
                              </View>
                            ))}
                          </View>
                        ) : null}
                      </View>
                    );
                  }}
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
                        {strings.journal.NoQuestions}
                      </Text>
                    </View>
                  }
                />


              </View>
            )}
          </View>
        </View>
      ) : (
        <NoData />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: RFValue(13),
    backgroundColor: COLOR.WHITE,
    shadowColor: COLOR.SHADOW,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 5,
    borderRadius: RFPercentage(1),
    marginBottom: RFValue(8),
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    borderWidth: 1,
    borderColor: COLOR.BORDER_COLOR,
  },
  imageContainer: {
    flex: 0.3,
    borderRightWidth: 1,
    borderColor: COLOR.BORDER_COLOR,
  },
  img: {
    height: "100%",
    width: "100%",
    borderTopLeftRadius: RFPercentage(1),
    borderBottomLeftRadius: RFPercentage(1),
    // overflow: "hidden"
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
    paddingTop: RFValue(10),
  },
  radioButton: {
    flex: 0.15,
    height: RFValue(50),
  },
  qusTextStyle: {
    fontSize: RFValue(20),
    fontFamily: FONTS.BOLD,
    marginTop: RFValue(10),
    marginBottom: RFValue(2.2),
    marginLeft: RFValue(5),
    color: COLOR.SOFT_GRAY,
  },
  read: {
    color: COLOR.PRIMARY,
    fontFamily: FONTS.BOLD,
    fontSize: RFValue(15),
    paddingTop: RFValue(5),
  },
  modalContainer: {
    flex: 1,
    padding: RFValue(15),
  },
  cancelButtonStyle: {
    flex: 0.4,
  },
  saveButtonStyle: {
    flex: 0.4,
  },
  buttonText: {
    fontSize: RFValue(15),
    color: COLOR.WHITE,
    textTransform: "uppercase",
    fontFamily: FONTS.MEDIUM,
    textAlign: "center",
    fontWeight: "700",
  },
  inputStyle: {
    height: RFValue(450),
    width: "100%",
    borderWidth: RFValue(1),
    padding: RFValue(16),
    fontFamily: FONTS.REGULAR,
    fontSize: RFValue(16),
    borderColor: COLOR.GREY,
    borderRadius: RFValue(4),
  },
});

export default AssessmentDetail;
