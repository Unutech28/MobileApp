import NoData from "@components/common/NoData";
import Loader from "@components/common/screenLoader";
import GLOBALS from "@constants";
import * as ICONS from "@images";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
  RefreshControl,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import ButtonBlue from "@components/common/buttonBlue";
import ButtonGreen from "@components/common/buttonGreen";
import ButtonOrange from "@components/common/buttonOrange";
//import Hyperlink from 'react-native-hyperlink'
import ViewPager from "@react-native-community/viewpager";
import { functions } from "lodash";

const isiOS = Platform.OS == "ios";
const { FONTS, COLOR, STRINGS } = GLOBALS;

function StepsHints(props) {
  let { data, nextStepClick, currentStep, viewPager } = props;

  const [step2Data, setSetep2Data] = useState();
  const [step3Data, setSetep3Data] = useState();
  const [step3Hints, setSetep3Hints] = useState();
  const [textValue, setTextValue] = useState("");
  const [setp4Value, setStep4Value] = useState("");
  // const [hintArray, setHintArray] = useState([]);
  const [refresh, setRefresh] = useState(false, "");
  // const [checked, setChecked] = useState([])
  const [isAnyCheckUpdated, setIsAnyCheckUpdated] = useState(false, "");
  let viewPagerArray = [];
  let hintArrayList = [];

  if (step2Data !== undefined) {
    step2Data.questions[0].ansOptions.forEach((element) => {
      if (element.isChecked) {
        hintArrayList.push(element);
      } else {
      }
    });
  }

  if (hintArrayList !== undefined && hintArrayList.length > 0) {
    for (var i = 0; i < hintArrayList.length; i++) {
      viewPagerArray.push(
        <View key={i} style={{ padding: 10 }}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={styles.hintText}>Hints</Text>
            <TouchableOpacity style={styles.plusBtn}>
              <Text
                style={{
                  color: COLOR.WHITE,
                  fontFamily: FONTS.CIRCULAR_MEDIUM,
                  fontSize: RFValue(16),
                }}
              >
                {"X"}
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.hintDesText}>{hintArrayList[i].name}</Text>
          <Text style={styles.hintDesText}>{hintArrayList[i].hint}</Text>
        </View>
      );
    }
  }

  const onTextAnswerChange = (dataLocal, text) => {
    setTextValue(text);
    dataLocal.questions[0].answer = text;
    setRefresh(!refresh);
  };

  const onNextStepClick = (dataChild, steps) => {
    //submit text data as well
    if (steps == 1) {
      setSetep2Data(dataChild);
      if (textValue == "" && data.questions[0].answer == undefined) {
        Alert.alert("Please enter your thoughts");
      } else {
        nextStepClick(data, 2, true);
      }
    } else if (steps == 2) {
      // setHintArray(checked)
      if (hintArrayList.length > 0) {
        setSetep3Data(dataChild);
        nextStepClick(data, 3, isAnyCheckUpdated);
        setIsAnyCheckUpdated(false);
      } else {
        Alert.alert("Please select at least one constructive thinking styles");
      }
    } else if (steps == 3) {
      setSetep3Hints(dataChild);
      nextStepClick(data, 4, false);
    } else if (steps == 4) {
      if (setp4Value !== "") {
        nextStepClick(data, 5, true);
      } else {
        alert("Please add answer.");
      }
    }
  };

  const onCheckBoxClick = (item, index) => {
    if (step2Data.questions != undefined && step2Data.questions.length > 0) {

      step2Data.questions[0].ansOptions.forEach((element) => {
        if (element._id == item._id) {
          if (hintArrayList.length < 3) {
            element.isChecked = !item.isChecked;

            setIsAnyCheckUpdated(true);
          } else {
            if (element.isChecked) {
              element.isChecked = !item.isChecked;

              setIsAnyCheckUpdated(true);
            } else {
              Alert.alert("You can select upto 3 distortions.");
            }
          }
        }
      });

      // if (!checked.includes(item)) {
      //   if (hintArrayList.length >= 3) {
      //     Alert.alert('You can select upto 3 distortions.xx')
      //   } else {
      //     setChecked([...checked, item])
      //   }
      // } else {
      //   setChecked([checked.filter(a => a !== item)])
      // }
      setRefresh(!refresh);
    }
  };

  const updateIsChecked = (ques) => {
    let isAnyChecked = false;

    if (ques.answer != undefined && ques.answer != null) {
      let answers = ques.answer.answers;
      let ansOptions = ques.ansOptions;

      for (let ansOption of ansOptions) {
        for (let answer of answers) {
          if (answer.optionId == ansOption._id) {
            ansOption.isChecked = true;
            isAnyChecked = true;
            break;
          }
        }
      }

      ques.answer = null;
    }

    if (hintArrayList.length == 0 && isAnyChecked) {
      setRefresh(!refresh);
    }
  };

  return (
    <View style={{ flexGrow: 1, backgroundColor: COLOR.WHITE }}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {data !== undefined && currentStep == 1 ? (
          <View>
            {data.questions !== undefined && data.questions.length > 0 ? (
              <View>
                <Text style={styles.blackBoldText}>
                  {data.questions[0].question}
                </Text>
                {data.questions[0].ansType === "textarea" ? (
                  <TextInput
                    style={{
                      height: RFValue(80),
                      borderColor: "rgba(119, 131, 143, 0.2)",
                      borderWidth: 1,
                      borderRadius: 8,
                      backgroundColor: COLOR.grey_300,
                      paddingLeft: 10,
                      width: "100%",
                      marginVertical: RFValue(20),
                      color: "dark" ? "black" : "black",
                    }}
                    value={
                      data.questions[0].answer != undefined
                        ? data.questions[0].answer.answer == undefined
                          ? data.questions[0].answer
                          : data.questions[0].answer.answer
                        : ""
                    }
                    maxLength={50}
                    underlineColorAndroid={"transparent"}
                    onChangeText={(text) => onTextAnswerChange(data, text)}
                  />
                ) : null}
              </View>
            ) : null}
            {data.childrens.length > 0 &&
            data.childrens[0].headingType == "button" ? (
              <ButtonGreen
                text={data.childrens[0].heading}
                onBtnPress={() => onNextStepClick(data.childrens[0], 1)}
              />
            ) : null}
          </View>
        ) : null}

        {data !== undefined && currentStep == 2 ? (
          <View>
            {step2Data.title !== undefined && step2Data.title !== "" ? (
              <Text style={styles.blueText}>{step2Data.title}</Text>
            ) : null}

            {step2Data.description !== "" ? (
              <Text style={styles.blackBoldText}>{step2Data.description}</Text>
            ) : null}

            {step2Data.stepDetail !== "" ? (
              <Text style={styles.stepText}>{step2Data.stepDetail.name}</Text>
            ) : null}

            {step2Data.stepDetail.description !== "" ? (
              <Text style={styles.blackBoldText}>
                {step2Data.stepDetail.description}
              </Text>
            ) : null}

            {step2Data.questions !== undefined && step2Data.questions.length > 0
              ? step2Data.questions.map((ques, cIndex) => {
                  updateIsChecked(ques);
                  return (
                    <View>
                      <Text style={styles.blackBoldText}>{ques.question}</Text>

                      {ques.ansType === "checkbox" &&
                      ques.ansOptions != undefined &&
                      ques.ansOptions.length > 0 ? (
                        <FlatList
                          contentContainerStyle={{ flex: 1 }}
                          data={ques.ansOptions}
                          showsVerticalScrollIndicator={false}
                          showsHorizontalScrollIndicator={false}
                          extraData={refresh}
                          keyExtractor={(item) => `${item._id}`}
                          listKey={(index) => "A" + index.toString()}
                          style={{ width: "100%", marginTop: RFValue(20) }}
                          renderItem={({ item, index }) => (
                            <TouchableOpacity
                              onPress={() => onCheckBoxClick(item, index)}
                              style={{
                                flex: 1,
                                flexDirection: "row",
                                marginTop: RFValue(10),
                                alignItems: "flex-start",
                                marginBottom: RFValue(10),
                              }}
                            >
                              <View
                                style={{
                                  flex: 0.15,
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                {item.image !== undefined &&
                                item.image !== null &&
                                item.image !== "" ? (
                                  <Image
                                    resizeMode="contain"
                                    style={{
                                      width: RFValue(25),
                                      height: RFValue(25),
                                      paddingRight: RFValue(5),
                                      marginBottom: RFValue(10),
                                    }}
                                    // source={{ uri: GLOBALS.IMAGE_BASE_URL + item.image }} />
                                    source={{ uri: item.image }}
                                  />
                                ) : null}
                                {item.isChecked ? (
                                  <Image
                                    source={ICONS.CheckedSquare}
                                    resizeMode="contain"
                                    style={styles.checkBoxImage}
                                  />
                                ) : (
                                  <Image
                                    source={ICONS.RectangleBlack}
                                    resizeMode="contain"
                                    style={styles.checkBoxImage}
                                  />
                                )}
                              </View>
                              <View
                                style={{ flex: 0.85, paddingRight: RFValue(5) }}
                              >
                                <Text style={styles.listBlackText}>
                                  {item.name}
                                </Text>
                                <Text style={styles.listDescriptionText}>
                                  {item.description}
                                </Text>
                              </View>
                            </TouchableOpacity>
                          )}
                        />
                      ) : null}
                    </View>
                  );
                })
              : null}

            {step2Data.childrens.length > 0 &&
            step2Data.childrens[0].headingType == "button" ? (
              <View style={{ marginTop: 20 }}>
                <ButtonGreen
                  text={step2Data.childrens[0].heading}
                  onBtnPress={() => onNextStepClick(step2Data.childrens[0], 2)}
                />
              </View>
            ) : null}
          </View>
        ) : null}

        {data !== undefined && currentStep == 3 ? (
          <View>
            {/* <Text>Step 3</Text> */}
            {step3Data.title !== undefined && step3Data.title !== "" ? (
              <Text style={styles.blueText}>{step3Data.title}</Text>
            ) : null}

            {step3Data.description !== "" ? (
              <Text style={styles.blackBoldText}>
                {
                  "Now let's practice an exercise to balance your thinking styles"
                }
              </Text>
            ) : null}
            {/* <Text style={styles.blackBoldText}>{step3Data.description}</Text> */}

            {step3Data.stepDetail !== "" ? (
              <Text style={styles.stepText}>{step3Data.stepDetail.name}</Text>
            ) : null}

            {step3Data.stepDetail.description !== "" ? (
              <Text style={styles.blackBoldText}>
                {step3Data.stepDetail.description}
              </Text>
            ) : null}

            {step3Data.childrens.length > 0 &&
            step3Data.childrens[0].headingType == "button" ? (
              <View style={{ marginTop: 20 }}>
                <ButtonGreen
                  text={step3Data.childrens[0].heading}
                  onBtnPress={() => onNextStepClick(step3Data.childrens[0], 3)}
                />
              </View>
            ) : null}
          </View>
        ) : null}

        {data !== undefined && currentStep == 4 ? (
          <View style={{ flex: 1 }}>
            <View style={{ flex: 0.6 }}>
              {step3Hints.questions !== undefined &&
              step3Hints.questions.length > 0 ? (
                <View>
                  <Text style={styles.blackBoldText}>
                    {step3Hints.questions[0].question}
                  </Text>
                  {step3Hints.questions[0].ansType === "textarea" ? (
                    <TextInput
                      style={{
                        height: RFValue(80),
                        borderColor: "rgba(119, 131, 143, 0.2)",
                        borderWidth: 1,
                        borderRadius: 8,
                        backgroundColor: COLOR.grey_300,
                        color: "black",
                        paddingLeft: 10,
                        width: "100%",
                        marginVertical: RFValue(20),
                      }}
                      value={
                        step3Hints.questions[0].answer != undefined
                          ? step3Hints.questions[0].answer.answer == undefined
                            ? step3Hints.questions[0].answer
                            : step3Hints.questions[0].answer.answer
                          : ""
                      }
                      maxLength={50}
                      underlineColorAndroid={"transparent"}
                      onChangeText={(text) => {
                        onTextAnswerChange(step3Hints, text);
                        setStep4Value(text);
                      }}
                    />
                  ) : null}

                  {setp4Value !== "" ? (
                    <ButtonGreen
                      text="Submit"
                      onBtnPress={() => onNextStepClick([], 4)}
                    />
                  ) : null}
                </View>
              ) : null}
            </View>

            <View
              style={{
                flex: 0.4,
                backgroundColor: COLOR.BACKGROUND_ORANGE,
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
              }}
            >
              {step3Hints.hasHints ? (
                <ViewPager
                  ref={viewPager}
                  scrollEnabled={true}
                  style={{ flex: 1, height: RFValue(150) }}
                  initialPage={0}
                  showPageIndicator={true}
                >
                  {viewPagerArray}
                </ViewPager>
              ) : null}
            </View>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOR.BACKGROUND,
    flexGrow: 1,
  },

  blueText: {
    fontSize: RFValue(22),
    fontFamily: FONTS.CIRCULAR_BOLD,
    color: COLOR.PRIMARY1,
  },
  blackBoldText: {
    fontSize: RFValue(20),
    fontFamily: FONTS.CIRCULAR_BOLD,
    color: COLOR.BLACK,
    marginTop: RFValue(20),
    textAlign: "center",
    // backgroundColor: 'red'
  },
  stepText: {
    fontSize: RFValue(30),
    fontFamily: FONTS.CIRCULAR_BOLD,
    color: COLOR.BLACK,
    alignSelf: "center",
    marginTop: RFValue(20),
    // backgroundColor: 'red'
  },
  listBlackText: {
    fontSize: RFValue(18),
    fontFamily: FONTS.CIRCULAR_MEDIUM,
    color: COLOR.BLACK,
  },
  listDescriptionText: {
    fontSize: RFValue(15),
    fontFamily: FONTS.CIRCULAR_MEDIUM,
    color: COLOR.GREY,
    marginTop: 5,
  },
  checkBoxImage: {
    height: RFValue(16),
    width: RFValue(16),
    // marginHorizontal: 8
  },
  hintText: {
    color: COLOR.WHITE,
    fontSize: RFValue(20),
    fontFamily: FONTS.CIRCULAR_MEDIUM,
  },
  plusBtn: {
    width: RFValue(20),
    height: RFValue(20),
  },
  hintDesText: {
    color: COLOR.WHITE,
    fontSize: RFValue(14),
    fontFamily: FONTS.CIRCULAR_MEDIUM,
    marginTop: 20,
  },
});

export default (StepsHints = React.memo(StepsHints));
