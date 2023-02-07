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
  StyleSheet,
  LayoutAnimation,
  Platform,
} from 'react-native';
import { RFValue, RFPercentage } from 'react-native-responsive-fontsize';
import * as AppActions from '@actions';
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
import Icon from 'react-native-vector-icons/FontAwesome5';
import { alertWithOneBtn } from '@helpers/common';

const { DARK_GREEN, BUTTON_ORANGE, YELLOW, CIRCLE_GRAY, GREEN } = COLOR;
const { LIGHT, REGULAR } = FONTS;

import ButtonNew from '@components/common/buttonNew';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import tempStyle from '@components/dashboard/dailyLearningTemplates/globalTemplateStyle';
import { checkQuesInvalidAssement, showEmptyAlert } from '../utilities';
import { useSelector, useDispatch } from 'react-redux';
function DragDrop(props) {
  let { cardData, onSubmit, onLikeClick, onCommentClick, user_language } = props;
  const dispatch = useDispatch();
  const [options, setOptions] = useState(cardData?.optionsData);
  const [temp, setTemp] = useState(0);

  const [headersId, setHeadersId] = useState([0, 1, 2, 3]);
  const [headers, setHeaders] = useState(
    cardData.headers ? cardData.headers : [],
  );

  useEffect(() => { }, [options, temp]);
  useEffect(() => {
    getHeadersId();
    setOption();
  }, []);

  const setOption = () => {
    let array = [];
    cardData?.otherAttribute?.optionsData?.map(item => {
      /**Check if the option is already selected in any header */
      let optionExistInHeader = cardData?.headers?.find(header =>
        //  header.selectedContents.includes(item._id)
        header.selectedContents?.find(o => o == item._id),
      );
      //  console.log(headers, optionExistInHeader, "optionnnn")
      array.push({
        ...item,
        selected: false,
        answer: null,
        header_id: optionExistInHeader ? optionExistInHeader._id : '',
        header_data: optionExistInHeader ? optionExistInHeader : '',
      });
    });
    // setOptions(array);
  };

  const getHeadersId = () => {
    let array = [];
    {
      cardData.headers
        ? cardData.headers.map((item, index) => {
          array.push(item._id);
        })
        : null;
    }
    setHeadersId(array);
  };

  const boxBackgroundColor = order => {
    if (order == headersId[0]) {
      return COLOR.DARK_GREEN;
    }
    if (order == headersId[1]) {
      return YELLOW;
    }
    if (order == headersId[2]) {
      return BUTTON_ORANGE;
    }
    if (order == headersId[3]) {
      return CIRCLE_GRAY;
    }
  };

  /**To show dynamic headers view  */
  const getDynamicHeaders = (item, order) => {
    return (
      <View
        style={[
          styles.headings,
          { backgroundColor: boxBackgroundColor(item._id) },
        ]}>
        <ShowHtmlText
          source={{
            html: item.header[user_language],
          }}
        />
      </View>
    );
  };

  const RenderBox = (i, item, colorIndex) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setAnswer(i, item, colorIndex);
        }}
        style={[
          styles.colorBox,
          { backgroundColor: boxBackgroundColor(headersId[colorIndex]) },
        ]}
      />
    );
  };

  const toggleOptions = index => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTemp(temp + 1);
    let data = options;
    data.map((item, i) => {
      if (i == index) {
        item.selected = !item?.selected;
      } else {
        item.selected = false;
      }
    });
    setOptions(data);
  };

  const checkAllOptions = index => {
    let data = true;
    data = options.every(option => option.header_id == '');
    // options.map((item, i) => {
    //   if (item.header_data == '') {
    //     console.log('data==>', item);
    //     data = true;
    //   }
    // });
    return data;
  };

  const setAnswer = (index, value, colorIndex) => {
    /**Add corresonding header value to selected option */
    let header_id = cardData.headers[colorIndex]._id;
    let selected_option_index = options?.findIndex(x => x._id === value._id);
    let modified_option = Object.assign([], options, {
      [selected_option_index]: {
        ...value,
        header_id: header_id,
        selected: false,
        header_data: cardData.headers[colorIndex],
      },
    });
    setOptions(modified_option);
  };

  const OptionsComp = (item, i) => {
    return (
      <View
        style={[
          styles.options,
          {
            borderColor: boxBackgroundColor(item?.header_id),
            borderWidth: item?.header_id || item?.header_id != '' ? 1 : 0,
          },
        ]}>
        <Text style={styles.optionText}>
          {item?.data[user_language]
            ? item?.data[user_language]
            : item?.data['en']}
        </Text>
        <View style={styles.buttonView}>
          <TouchableOpacity
            hitSlop={{ right: 10, left: 10, top: 10, bottom: 10 }}
            onPress={() => toggleOptions(i)}>
            <Icon name={'plus'} size={20} color={COLOR.BLACK} />
          </TouchableOpacity>
        </View>
        {item?.selected && (
          <View style={[styles.optionsColor]}>
            <View style={{ flexDirection: 'row' }}>
              <FlatList
                data={[1, 2, 3, 4]}
                keyExtractor={({ index }) => {
                  index;
                }}
                renderItem={({ value, index }) => {
                  return RenderBox(index, item, index);
                }}
                horizontal={true}
                contentContainerStyle={{ marginRight: RFValue(35) }}
              />
            </View>

            <View style={styles.buttonView}>
              <TouchableOpacity
                hitSlop={{ right: 10, left: 10, top: 10, bottom: 10 }}
                onPress={() => toggleOptions(i)}>
                <Icon name={'times'} size={20} color={COLOR.BLACK} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  };
  /**On Save button click */
  const _onSaveClick = () => {
    let isNotComplete = checkAllOptions();
    if (isNotComplete) {
      alertWithOneBtn(strings.PERFORM_EXERCISE);
    } else {
      let selected_options = options.filter(x => x.header_id != '');
      let result = [];
      result = selected_options.reduce((r, a) => {
        r[a.header_id] = r[a.header_id] || [];
        r[a.header_id].push(a);
        return r;
      }, Object.create(null));

      let submit_user_header = headers.map(m => {
        return {
          _id: m._id,
          content_id: m.content_id,
          card_id: m.card_id,
          assessment_content_id: result[m._id]
            ? result[m._id].map(m => m._id)
            : [],
        };
      });
      let customMsg = '';

      let greenCount =
        submit_user_header[0] && submit_user_header[0].length == 0
          ? 0
          : submit_user_header[0].assessment_content_id.length;
      let yellowCount =
        submit_user_header[1] && submit_user_header[1].length == 0
          ? 0
          : submit_user_header[1].assessment_content_id.length;
      let orangeCount =
        submit_user_header[2] && submit_user_header[2].length == 0
          ? 0
          : submit_user_header[2].assessment_content_id.length;
      let purpleCount =
        submit_user_header[3] && submit_user_header[3].length == 0
          ? 0
          : submit_user_header[3].assessment_content_id.length;
      let X1 = yellowCount + orangeCount + purpleCount;
      let X2 = yellowCount + orangeCount;
      customMsg = strings.AFTER_BIRTH;

      onSubmit(submit_user_header, customMsg);
    }
  };
  const onCommentPress = () => {
    dispatch(AppActions.setCommentsArray(cardData.usercomments));
    onCommentClick({ card_id: cardData._id });
  };
  return (
    <KeyboardAwareScrollView
      enableAutomaticScroll={Platform.OS === 'ios' ? true : true}
      keyboardShouldPersistTaps={'handled'}
      enableOnAndroid={true}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{}}
      nestedScrollEnabled={true}
      extraScrollHeight={Platform.OS === 'ios' ? 100 : 100}>
      <View style={[tempStyle.outerContainer]}>
        <View style={{}}>
          {cardData?.card_title != '' && (
            <CardTitle
              style={tempStyle?.cardTitle}
              text={
                cardData?.card_title
                  ? cardData.card_title[user_language]
                    ? cardData.card_title[user_language]
                    : cardData.card_title['en']
                  : ''
              }
            />
          )}
          {cardData.description ? (
            <ShowHtmlText
              source={{
                html: cardData?.description
                  ? cardData.description[user_language]
                    ? cardData.description[user_language]
                    : cardData.description['en']
                  : '',
              }}
            />
          ) : null}
        </View>
        <View style={styles.headingView}>
          {headers.map((item, index) => {
            return getDynamicHeaders(item, index);
          })}
        </View>
        <View>
          {options.map((item, index) => {
            return OptionsComp(item, index);
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
        onCommentClick={() => onCommentPress()}
        onLikeClick={type => {
          onLikeClick({
            card_id: cardData._id,
            like: type,
          });
        }}
      />
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  headings: {
    minHeight: RFValue(40),
    justifyContent: 'center',
    paddingHorizontal: 10,
    margin: RFValue(5),
    borderRadius: RFValue(5),
  },
  headingText: {
    fontSize: RFValue(14),
    fontFamily: FONTS.BOLD,
    color: COLOR.WHITE,
  },
  headingView: {
    marginVertical: RFValue(10),
  },
  options: {
    height: RFValue(35),
    justifyContent: 'center',
    paddingLeft: 10,
    margin: RFValue(5),
    borderRadius: RFValue(5),
    backgroundColor: '#F1F3FA',
  },
  optionText: {
    fontSize: RFValue(14),
    fontFamily: FONTS.BOLD,
    color: COLOR.BLACK,
  },
  buttonView: {
    position: 'absolute',
    right: RFValue(0),
    backgroundColor: '#CBCCD1',
    height: RFValue(33),
    width: RFValue(30),
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomRightRadius: RFValue(5),
    borderTopRightRadius: RFValue(5),
  },
  optionsColor: {
    height: RFValue(33),
    justifyContent: 'center',
    borderRadius: RFValue(5),
    position: 'absolute',
    right: RFValue(0),
    zIndex: 1000,
  },
  colorBox: {
    height: RFValue(25),
    width: RFValue(25),
    marginHorizontal: 3,
    borderRadius: RFValue(5),
  },
});

export default (DragDrop = React.memo(DragDrop));
