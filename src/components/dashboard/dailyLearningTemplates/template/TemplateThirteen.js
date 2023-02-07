import NoData from '@components/common/NoData';
import Loader from '@components/common/screenLoader';
import tempStyle from '@components/dashboard/dailyLearningTemplates/globalTemplateStyle';
import GLOBALS from '@constants';
import * as ICONS from '@images';
import * as Images from '@images';

import React, { useState, lazy, useCallback, useEffect } from 'react';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
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
} from 'react-native';
import * as AppActions from '@actions';
const isiOS = Platform.OS == 'ios';
// import Icon from 'react-native-vector-icons/FontAwesome5';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { FONTS, COLOR, STRINGS } = GLOBALS;
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
// import Voice from '@react-native-voice/voice';
// import {
//   ImageElement,
//   ShowHtmlText,
//   CardTitle,
// } from "@components/dashboard/dailyLearningTemplates/templateElements";
import {
  ProgressSteps,
  ProgressStep,
} from '../../../../updatedNodeModules/react-native-steps';
//import { ProgressSteps, ProgressStep } from "../../../../updatedNodeModules/react-native-progress-steps";
import ButtonNew from '@components/common/buttonNew';
import Button from '@components/common/button';
import {
  ImageElement,
  ShowHtmlText,
  CardTitle,
  LikeElement,
} from '@components/dashboard/dailyLearningTemplates/templateElements';

import { strings } from '@localization';
import {
  checkIfAllQuestionNotAnswered,
  showEmptyAlert,
  checkNextDayUnlocked,
  showAlert,
  checkIfSingleQuestionNotAnswered,
  checkQuesInvalid,
} from '../utilities';
import { useSelector, useDispatch } from 'react-redux';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

function TemplateThirteen(props) {
  let {
    cardData,
    onSubmit,
    onLikeClick,
    onCommentClick,
    currentStep,
    user_language,
  } = props;
  const dispatch = useDispatch();
  const [question_array, setQuestionArray] = useState(cardData);
  const [temp, setTemp] = useState(0)
  const [data, setData] = useState(cardData)


  useEffect(() => {

  }, [question_array, temp, cardData]);
  useEffect(() => {
    setTemp(temp + 1);
    setUserData()
    setQuestionArray(cardData)

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

  const setUserData = () => {
    let array = cardData
    if (cardData.action) {
      Object.entries(cardData.action).map((item) => {
        array.otherAttribute.questions.map((value, i) => {
          if (item[1].ques_id == value.ques_id) {
            value.ansOptions = item[1].ansOptions
          }
        })
      })
      setQuestionArray(array)
    }
    setTemp(temp + 1)
  }

  /***Handling Text Input */
  const onTextAnswerChange = (text, array_index, option) => {
    let array = data
    let modify_option = data.otherAttribute.questions[
      array_index
    ].ansOptions.map((item, i) => {
      item.answer = text;
    });
    setQuestionArray(data);
    setTemp(temp + 1)
  };

  const _onSaveClick = () => {
    // if (checkIfAllQuestionNotAnswered(question_array)) {
    //   showEmptyAlert();
    //   return;
    // }
    let postData = {
      cardId: question_array._id,
      week: question_array.week,
      day: question_array.day,
      action: question_array.otherAttribute.questions
    };
    onSubmit(postData, question_array.otherAttribute.questionResponse);
  };

  return (
    <KeyboardAwareScrollView
      enableAutomaticScroll={Platform.OS === 'ios' ? true : true}
      keyboardShouldPersistTaps={'handled'}
      enableOnAndroid={true}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flex: 1 }}
      extraScrollHeight={100}>
      <View style={[tempStyle.outerContainer]}>
        <View style={{}}>
          {cardData?.title != '' && (
            <CardTitle
              style={tempStyle?.cardTitle}
              text={
                cardData?.title
                  ? cardData.title
                  : ''
              }
            />
          )}

          {cardData.description ? (
            <ShowHtmlText
              source={{
                html: cardData?.description
                  ? cardData.description
                  : '',
              }}
            />
          ) : null}
        </View>
        <View style={{ marginTop: RFValue(20) }}>
          <View style={[styles.quesContainer, { marginBottom: RFValue(15) }]}>
            <View style={[styles.quesHeading, { flex: 0.4 }]}>
              <View>
                <Text numberOfLines={3} style={styles.headingTitle}>
                  {question_array?.otherAttribute.firstAssessmentHeading}
                </Text>
              </View>
            </View>

            <View style={[styles.quesHeading, { flex: 0.6 }]}>
              <View>
                <Text numberOfLines={3} style={styles.headingTitle}>
                  {question_array?.otherAttribute.secondAssessmentHeading}
                </Text>
              </View>
            </View>
          </View>
          {question_array?.otherAttribute?.questions?.map((ques_data, array_index) => {
            return (
              <View style={styles.quesContainer}>
                <View style={[styles.quesHeading, { flex: 0.4 }]}>
                  <View>
                    <Text numberOfLines={4} style={styles.headingTitle}>
                      {ques_data?.questionName}
                    </Text>
                    <Text numberOfLines={4} style={styles.headingDesc}>
                      {ques_data?.questionDesc}
                    </Text>
                  </View>
                </View>
                <View style={{ flex: 0.6 }}>
                  <TextInput
                    selectionColor={COLOR.GREY}
                    placeholder={ques_data?.ansOptions[0]?.TxtArea}
                    style={styles.queTextInputStyle}
                    value={ques_data?.ansOptions[0]?.answer}
                    multiline={true}
                    numberOfLines={10}
                    underlineColorAndroid={'transparent'}
                    placeholderTextColor={COLOR.BLACK}
                    onChangeText={text => {
                      onTextAnswerChange(text, array_index, ques_data);
                    }}
                  />
                </View>
              </View>
            );
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
        isComment={true}
        onCommentClick={() => onCommentPress()}
        onLikeClick={type => {
          onLikeClick({
            cardId: cardData?._id,
            action: { like: type },
            week: cardData.week,
            day: cardData.day,
          });
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
    fontWeight: '600',
    marginBottom: RFValue(20),
  },
  checkDesctiopn: {
    fontFamily: FONTS.MEDIUM,
    color: COLOR.SOFT_GRAY,
    fontWeight: '400',
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
    width: '100%',
    borderRadius: RFValue(5),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: RFValue(10),
    borderColor: COLOR.DARK_GREEN,
    borderWidth: 1,
    //  backgroundColor: isDisabled ? GREY : PRIMARY,
  },
  buttonText: {
    fontSize: RFValue(15),
    color: COLOR.WHITE,
    fontFamily: FONTS.MEDIUM,
    textAlign: 'center',
  },
  stepDescription: {
    fontSize: 17,
    fontWeight: '400',
  },
  buttonStyle: {
    height: RFValue(40),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLOR.sea_Green_dark,
    width: RFValue(90),
    borderRadius: RFValue(12),
  },
  buttonView: {
    marginVertical: RFValue(20),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonStyleforAnswr: {
    height: RFValue(50),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    width: RFValue(92),
    borderRadius: RFValue(12),
    borderWidth: 1,
    // flexDirection: 'row',
  },
  iconStyle: {
    marginLeft: RFValue(2),
    position: 'absolute',
    bottom: 0,
  },
  text: {
    fontSize: RFValue(15),
    color: COLOR.BLACK,
    fontFamily: FONTS.MEDIUM,
    textAlign: 'justify',
  },

  queTextInputStyle: {
    fontSize: RFValue(12),
    fontFamily: FONTS.REGULAR,
    color: COLOR.BLACK,
    borderColor: COLOR.GREY,
    borderWidth: 0.5,
    borderRadius: 5,
    paddingVertical: RFValue(0),
    paddingHorizontal: RFValue(5),
    backgroundColor: 'rgb(241, 243, 250)',
    height: RFValue(70),
    width: '100%',
    textAlignVertical: 'top',
    paddingTop: RFValue(5),
  },

  quesContainer: { flexDirection: 'row', marginBottom: RFValue(10) },
  quesHeading: {
    flex: 0.4,
    backgroundColor: 'rgb(242, 200, 66)',
    borderRadius: RFValue(5),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: RFValue(5),
  },
  headingTitle: {
    fontFamily: FONTS.BOLD,
    color: 'white',
    fontSize: RFValue(15),
    padding: RFValue(5),
    paddingVertical: RFValue(10),
    textAlign: 'center',
  },
  headingDesc: {
    fontFamily: FONTS.REGULAR,
    color: 'white',
    fontSize: RFValue(12),

    textAlign: 'center',
  }
});
export default (TemplateThirteen = React.memo(TemplateThirteen));
