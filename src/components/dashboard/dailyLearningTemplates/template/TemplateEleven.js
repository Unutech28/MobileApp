import GLOBALS from '@constants';
import React, { useState, useEffect } from 'react';
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Dimensions,
  Animated,
  TextInput,
  Image,
  ImageBackground,
  Platform,
} from 'react-native';
import tempStyle from '@components/dashboard/dailyLearningTemplates/globalTemplateStyle';
import { RFValue, RFPercentage } from 'react-native-responsive-fontsize';
const { COLOR, STRINGS, FONTS } = GLOBALS;
import { Slider } from 'react-native-elements';
import { LineChart } from 'react-native-chart-kit';
import CustomButton from '../../../common/customButton';
import { strings } from '@localization';
import {
  ImageElement,
  ShowHtmlText,
  CardTitle,
  LikeElement,
} from '@components/dashboard/dailyLearningTemplates/templateElements';
import { SvgUri } from 'react-native-svg';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IoniIcon from 'react-native-vector-icons/Ionicons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
const { width, height } = Dimensions.get('window');

import { checkQuesInvalid, showEmptyAlert, checkIfAllQuestionNotAnswered } from '../utilities';
const { DARK_GREEN, WHITE, BLACK } = COLOR;
const { LIGHT, REGULAR } = FONTS;
import ButtonNew from '@components/common/buttonNew';
import * as AppActions from '@actions';
import { useDispatch } from 'react-redux';

function TemplateEleven(props) {
  let { cardData, onSubmit, onLikeClick, onCommentClick, user_language } = props;
  const [question_array, setQuestionArray] = useState(cardData);
  const [data, setData] = useState(cardData)
  const [temp, setTemp] = useState(0)
  useEffect(() => {

  }, [temp, cardData]);
  useEffect(() => {
    setTemp(temp + 1);
    setUserData()
    setQuestionArray(cardData)
    setData(cardData)

  }, [cardData]);
  const dispatch = useDispatch();


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
    let array = data
    let modify_option = data.otherAttribute.questions[
      array_index
    ].ansOptions.map((item, i) => {
      item.answer = text;
    });
    setQuestionArray(data);
    setTemp(temp + 1)
  };

  /**On Save Click */
  const _onSaveClick = () => {
    if (checkIfAllQuestionNotAnswered(question_array)) {
      showEmptyAlert();
      return;
    }
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
      <View
        style={[
          tempStyle.outerContainer,
          { paddingHorizontal: 5, backgroundColor: 'white' },
        ]}>
        <View style={{}}>
          {cardData?.card_title != '' && (
            <CardTitle
              style={tempStyle?.cardTitle}
              text={
                cardData?.title
                  ? cardData?.title
                  : ''
              }
            />
          )}

          {cardData.description ? (
            <ShowHtmlText
              contentWidth={width}
              source={{
                html: cardData?.description
                  ? cardData?.description
                  : '',
              }}
            />
          ) : null}
        </View>
        <View style={{ flex: 1 }}>
          <ImageBackground
            source={require('../../../../assets/images/TemplateTen/slide150040a7.png')}
            style={{
              borderRadius: 15,
              width: '100%',
              height: Platform.OS == 'ios' ? '100%' : RFValue(220),
              marginTop: RFValue(10),
            }}
            resizeMode="stretch">
            <TextInput
              placeholder={
                question_array?.otherAttribute.questions[0]?.questionName
              }
              style={styles.queTextInputStyle}
              value={question_array?.otherAttribute.questions[0]?.ansOptions[0].answer}
              multiline={true}
              maxLength={1000}
              underlineColorAndroid={'transparent'}
              placeholderTextColor={COLOR.BLACK}
              onChangeText={text => {
                onTextAnswerChange(
                  text,
                  0,
                  question_array?.otherAttribute.questions[0]?.ansOptions[0],
                );
              }}
            />
            <TextInput
              placeholder={question_array?.otherAttribute.questions[1]?.questionName}
              style={styles.queTextInputStyle2}
              value={question_array?.otherAttribute.questions[1]?.ansOptions[0].answer}
              multiline={true}
              maxLength={1000}
              underlineColorAndroid={'transparent'}
              placeholderTextColor={COLOR.BLACK}
              onChangeText={text => {
                onTextAnswerChange(
                  text,
                  1,
                  question_array?.otherAttribute.questions[1]?.ansOptions[0],
                );
              }}
            />
            <TextInput
              placeholder={question_array?.otherAttribute.questions[2]?.questionName}
              style={styles.queTextInputStyle3}
              value={question_array?.otherAttribute.questions[2]?.ansOptions[0].answer}
              multiline={true}
              maxLength={1000}
              underlineColorAndroid={'transparent'}
              placeholderTextColor={COLOR.BLACK}
              onChangeText={text => {
                onTextAnswerChange(
                  text,
                  2,
                  question_array?.otherAttribute.questions[2]?.ansOptions[0],
                );
              }}
            />
            <TextInput
              placeholder={question_array?.otherAttribute.questions[3]?.questionName}
              style={styles.queTextInputStyle4}
              value={question_array?.otherAttribute.questions[3]?.ansOptions[0].answer}
              multiline={true}
              maxLength={1000}
              underlineColorAndroid={'transparent'}
              placeholderTextColor={COLOR.BLACK}
              onChangeText={text => {
                onTextAnswerChange(
                  text,
                  3,
                  question_array?.otherAttribute.questions[3]?.ansOptions[0],
                );
              }}
            />
          </ImageBackground>
        </View>

        <View style={[tempStyle.submitContainer, { flex: 0.1 }]}>
          <ButtonNew
            text={strings.cards.submit}
            onBtnPress={() => _onSaveClick()}
          />
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
      </View>
    </KeyboardAwareScrollView>
  );
}
export default (TemplateEleven = React.memo(TemplateEleven));

const styles = {
  buttonView: {
    marginTop: RFValue(20),
  },
  cardTitle: {
    fontSize: RFValue(25),
    fontFamily: FONTS.MEDIUM,
    color: COLOR.BLACK,
    marginTop: RFValue(25),
    marginBottom: RFValue(10),
    fontWeight: '700',
  },
  image: {
    width: '100%',
    height: RFValue(190),
  },
  queTextInputStyle: {
    fontSize: RFValue(10),
    fontFamily: FONTS.REGULAR,
    color: COLOR.BLACK,
    borderColor: COLOR.GREY,
    borderWidth: 0.5,
    borderRadius: 5,
    paddingVertical: RFValue(10),
    paddingHorizontal: RFValue(5),
    backgroundColor: COLOR.WHITE,
    position: 'absolute',
    right: RFValue(15),
    top: RFValue(5),
    height: RFValue(35),
    width: RFValue(105),
  },
  queTextInputStyle2: {
    fontSize: RFValue(10),
    fontFamily: FONTS.REGULAR,
    color: COLOR.BLACK,
    borderColor: COLOR.GREY,
    borderWidth: 0.5,
    borderRadius: 5,
    paddingVertical: RFValue(10),
    paddingHorizontal: RFValue(5),
    backgroundColor: COLOR.WHITE,
    position: 'absolute',
    right: RFValue(5),
    height: RFValue(35),
    width: RFValue(100),
    bottom: RFValue(2),
  },
  queTextInputStyle3: {
    fontSize: RFValue(10),
    fontFamily: FONTS.REGULAR,
    color: COLOR.BLACK,
    borderColor: COLOR.GREY,
    borderWidth: 0.5,
    borderRadius: 5,
    paddingVertical: RFValue(10),
    paddingHorizontal: RFValue(5),
    backgroundColor: COLOR.WHITE,
    position: 'absolute',
    height: RFValue(35),
    width: RFValue(100),
    left: RFValue(10),
    bottom: RFValue(2),
  },
  queTextInputStyle4: {
    fontSize: RFValue(10),
    fontFamily: FONTS.REGULAR,
    color: COLOR.BLACK,
    borderColor: COLOR.GREY,
    borderWidth: 0.5,
    borderRadius: 5,
    paddingVertical: RFValue(10),
    paddingHorizontal: RFValue(5),
    backgroundColor: COLOR.WHITE,
    position: 'absolute',
    height: RFValue(35),
    width: RFValue(100),
    bottom: '20%',
    alignSelf: 'center',
  },
};
