import tempStyle from '@components/dashboard/dailyLearningTemplates/globalTemplateStyle';
import GLOBALS from '@constants';
import React, { useState, useRef, useEffect } from 'react';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import ButtonNew from '@components/common/buttonNew';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { alertWithOneBtn } from '@helpers/common';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  TextInput,
} from 'react-native';
const { FONTS, COLOR } = GLOBALS;
import * as AppActions from '@actions';
import {
  ImageElement,
  ShowHtmlText,
  CardTitle,
  LikeElement,
} from '@components/dashboard/dailyLearningTemplates/templateElements';
import { useSelector, useDispatch } from 'react-redux';
import IoniIcon from 'react-native-vector-icons/Ionicons';
import { strings } from '@localization';

const { width, height } = Dimensions.get('window');
function TemplateTwentyFour(props) {
  let { cardData, onSubmit, onLikeClick, onCommentClick, onEdit } = props;

  const [headers, setHeaders] = useState([]);
  const [bottomHeaderData, setBottomHeaderData] = useState([]);
  const dispatch = useDispatch();
  const onCommentPress = () => {
    dispatch(AppActions.setCommentsArray(cardData.usercomments));
    onCommentClick({ card_id: cardData._id });
  };
  useEffect(() => {
    let array = [];
    if (
      cardData?.otherAttribute &&
      cardData?.otherAttribute?.options?.length > 0
    ) {
      array = cardData?.otherAttribute?.options.map((item, index) => {
        return {
          ...item,
        };
      });
      initUserData();
    }
    setHeaders(array);

  }, []);

  const initUserData = () => {
    /**Init Empty Object */
    let empty_obj = {};
    let final_data = [];
    let user_input_response = cardData?.action?.user_response
      ? cardData?.action?.user_response
      : [];
    if (user_input_response.length == 0) {
      cardData?.otherAttribute?.options.map((m, ind) => {

        empty_obj = Object.assign({}, empty_obj, {
          [`col_id${ind}`]: m.header_id,
          [`col_val${ind}`]: '',
          is_added: false,
          order: 1
        });
      });
      final_data.push(empty_obj);
    } else {
      final_data = [...user_input_response]
    }

    setBottomHeaderData(final_data);
  };

  /**Modify the answer key on text input change */
  const onTextValueChange = (value, key, item) => {
    let current_obj = bottomHeaderData[item];
    current_obj = Object.assign({}, item, {
      ...current_obj,
      [key]: value,
    });
    let current_header_ans = Object.assign([], bottomHeaderData, {
      [item]: current_obj,
    });
    setBottomHeaderData(current_header_ans);
  };

  /**Add add or delete row clicked */
  const clickHandler = (type, index) => {
    switch (type) {
      case 'add_row':
        let current_answer = bottomHeaderData[index];
        current_answer = Object.assign({}, current_answer, {
          is_added: true,
        });
        let current_header_ans = Object.assign([], bottomHeaderData, {
          [index]: current_answer,
        });

        let empty_obj = {};
        cardData?.otherAttribute?.options.map((m, ind) => {
          empty_obj = Object.assign({}, empty_obj, {
            [`col_id${ind}`]: m.header_id,
            [`col_val${ind}`]: '',
            is_added: false,
            order: current_answer.order + 1,
          });
        });
        current_header_ans.push(empty_obj);

        setBottomHeaderData(current_header_ans);
        break;

      case 'delete_row':
        let filter_data = bottomHeaderData.filter(
          (ele, ele_index) => ele_index != index,
        );
        filter_data = filter_data.map((item, index) => {
          return {
            ...item,
            order: index + 1,
          };
        });
        setBottomHeaderData(filter_data);
        break;
      default:
        break;
    }
  };

  /**Show Top Header Heading */
  const renderTopHeader = (item, index) => {
    return (
      <View style={[styles.ToContainer]}>
        <View style={[styles.headings, styles.bottomStyle]}>
          <Text style={styles.headingText}>
            {item.header}
          </Text>
          <View style={styles.circleView}>
            <Text style={styles.headingText}>{index + 1}</Text>
          </View>
        </View>
      </View>
    );
  };

  /**Check if row blank */

  const checkIsBlank = item => {
    let isEmpty = Object.values(item).some(x => x === null || x === '');
    return isEmpty;
  };
  /**Show Input Options */
  const renderInputOption = (item, index) => {
    return (
      <>
        {index > 0 && (
          <View
            style={{
              height: 10,
              backgroundColor: COLOR.BUTTON_ORANGE,
              marginTop: 10,
            }}
          />
        )}
        {headers.map((elem, ind) => {
          return (
            <View style={styles.ToContainer}>
              <View style={[styles.headings, styles.textInput]}>
                <View
                  style={{
                    marginTop: RFValue(0),
                    width: '100%',
                    height: '100%',
                  }}>
                  <TextInput
                    editable={item.is_added == false ? true : false}
                    multiline={false}
                    placeholder={
                      elem.headerDesc
                    }
                    style={[
                      tempStyle.queTextInputAreaStyle,
                      {
                        backgroundColor: COLOR.LightGrayTextinput,
                        borderWidth: 0,
                      },
                    ]}
                    value={item['col_val' + ind.toString()]}
                    maxLength={2000}
                    selectionColor={'green'}
                    underlineColorAndroid={'transparent'}
                    placeholderTextColor={'gray'}
                    onChangeText={text => {
                      onTextValueChange(
                        text,
                        'col_val' + ind.toString(),
                        index,
                      );
                    }}
                  />
                </View>
                <View
                  style={[
                    styles.circleView,
                    { backgroundColor: COLOR.CIRCLE_GRAY },
                  ]}>
                  <Text style={styles.headingText}>{index + 1}</Text>
                </View>

                {item.is_added == false && ind == headers.length - 1 && (
                  <TouchableOpacity
                    onPress={() => {
                      if (!checkIsBlank(item)) {
                        clickHandler('add_row', index, item);
                      }
                    }}
                    style={styles.addButton}>
                    <IoniIcon
                      name={'add-circle'}
                      size={RFValue(30)}
                      color={
                        checkIsBlank(item) ? COLOR.PRIMARY : COLOR.DarkGray
                      }
                    />
                  </TouchableOpacity>
                )}
                {item.is_added == true && ind == headers.length - 1 && (
                  <TouchableOpacity
                    onPress={() => clickHandler('delete_row', index)}
                    style={styles.removeButton}>
                    <Icon name={'cancel'} size={25} color={COLOR.CINNABAR} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })}
      </>
    );
  };

  /**On Save Button CLick */
  const onSaveHandler = () => {
    let final_bottom = bottomHeaderData.filter(item => item.is_added != false);
    if (final_bottom.length == 0) {
      alertWithOneBtn(strings.PERFORM_EXERCISE);
      return;
    }

    let param = {
      cardId: cardData?._id,
      action: { user_response: bottomHeaderData },
      week: cardData.week,
      day: cardData.day,
    };
    onSubmit(param, cardData?.otherAttribute?.feedback)
  };

  return (
    <View style={styles.container}>
      <View style={{}}>
        {/******************Render Card Title ************/}
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
      <View>
        {headers?.map((item, index) => {
          return renderTopHeader(item, index);
        })}
      </View>
      <View>
        {bottomHeaderData?.map((item, index) => {
          return renderInputOption(item, index);
        })}
      </View>

      <View style={styles.button}>
        <ButtonNew text={'save'} onBtnPress={onSaveHandler} />
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,

    margin: RFValue(10),
  },
  headings: {
    width: '100%',
    height: RFValue(40),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RFValue(5),
    paddingHorizontal: RFValue(10),
  },
  ToContainer: {
    width: '100%',
    marginTop: RFValue(7),
    justifyContent: 'center',
  },
  headingText: {
    fontSize: RFValue(14),
    fontFamily: FONTS.SEMI_BOLD,
    color: COLOR.WHITE,
  },
  circleView: {
    height: RFValue(20),
    width: RFValue(20),
    borderRadius: RFValue(10),
    backgroundColor: COLOR.BUTTON_ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: RFValue(-10),
    borderColor: COLOR.WHITE,
    borderWidth: 2,
  },
  dropdownStyle: {
    width: '100%',
    borderWidth: 0,
    backgroundColor: COLOR.LightGrayTextinput,
  },
  dropDownTextStyle: {
    fontSize: 15,
    color: COLOR.CIRCLE_GRAY,
    fontFamily: FONTS.MEDIUM,
  },
  dropDownLableStyle: {
    fontFamily: FONTS.MEDIUM,
    color: COLOR.BLACK,
  },
  addButton: {
    position: 'absolute',
    right: RFValue(-10),
  },
  text: {
    fontSize: RFValue(14),
    fontFamily: FONTS.MEDIUM,
    color: COLOR.CIRCLE_GRAY,
  },
  removeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: -5,
    top: 0,
    zIndex: 2,
  },
  textInput: {
    width: width / 1.1,
    marginHorizontal: 0,
    backgroundColor: COLOR.LightGrayTextinput,
    height: RFValue(45),
    alignItems: 'flex-start',
  },
  button: { marginTop: RFValue(10), width: '100%' },
  valuesBox: {
    width: width / 1.1,
    marginHorizontal: 0,
    backgroundColor: COLOR.LightGrayTextinput,
    height: RFValue(45),
    alignItems: 'flex-start',
    paddingHorizontal: RFValue(20),
  },
  bottomStyle: {
    backgroundColor: COLOR.BUTTON_ORANGE,
    width: width / 1.1,
    height: RFValue(40),
    alignItems: 'flex-start',
    paddingHorizontal: RFValue(20),
  },
});
export default (TemplateTwentyFour = React.memo(TemplateTwentyFour));
