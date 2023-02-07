import tempStyle from '@components/dashboard/dailyLearningTemplates/globalTemplateStyle';
import GLOBALS from '@constants';
import React, { useState, useEffect } from 'react';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import ButtonNew from '@components/common/buttonNew';
import { checkHeaderData, showEmptyAlert, templateValidation } from '../utilities';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  TextInput,
} from 'react-native';
const { FONTS, COLOR } = GLOBALS;
import {
  ShowHtmlText,
  CardTitle,
  LikeElement,
} from '@components/dashboard/dailyLearningTemplates/templateElements';
import IoniIcon from 'react-native-vector-icons/Ionicons';
import { useSelector, useDispatch } from 'react-redux';
import * as AppActions from '@actions';

const { width, height } = Dimensions.get('window');

// Template for Support Network
function TemplateTwentyOne(props) {
  let { cardData, onCommentClick, onSubmit, cardState } = props;
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    let array = [];
    let user_input_response = cardData?.action?.user_response
      ? cardData?.action?.user_response
      : [];
    if (
      cardData?.otherAttribute &&
      cardData?.otherAttribute?.options?.length > 0
    ) {
      cardData?.otherAttribute?.options.map((m) => {
        let matched_index = -1;
        matched_index = user_input_response.findIndex(
          (x) => x.header_id === m.header_id
        );
        array.push({
          ...m,
          value:
            matched_index > -1
              ? user_input_response[matched_index].value
              : [
                {
                  answer: "",
                  is_added: false,
                },
              ],
        });
      });
      setData(array);
    }
  }, []);

  const onCommentPress = () => {
    dispatch(AppActions.setCommentsArray(cardData.usercomments));
    onCommentClick({ card_id: cardData._id });
  };

  /**Add dynamic color in header */
  const boxBackgroundColor = order => {
    if (order === 0) {
      return COLOR.DARK_GREEN;
    } else if (order === 1) {
      return COLOR.BUTTON_ORANGE;
    } else {
      return COLOR.CIRCLE_GRAY;
    }
  };
  /**Modify the answer key on text input change */
  const onTextValueChange = (value, inner_index, outer_index) => {
    let current_answer = data[outer_index].value[inner_index];
    current_answer = Object.assign({}, current_answer, {
      answer: value,
    });
    let current_header_ans = Object.assign([], data[outer_index].value, {
      [inner_index]: current_answer,
    });
    dataModify(inner_index, outer_index, current_header_ans);
  };
  /**Modify Final Array */
  const dataModify = (inner_index, outer_index, current_header_ans) => {
    let array = Array.from(data);
    let all_current_header_ans = Object.assign({}, array[outer_index], {
      value: current_header_ans,
    });
    let modifyHeader = Object.assign([], array, {
      [outer_index]: all_current_header_ans,
    });

    setData(modifyHeader);

  };

  /**Add add or delete row clicked */
  const clickHandler = (type, inner_index, outer_index) => {
    switch (type) {
      case 'add_row':
        let array = Array.from(data);
        let current_answer = array[outer_index].value[inner_index];
        current_answer = Object.assign({}, current_answer, {
          is_added: true,
        });
        let empty_obj = {
          answer: "",
          is_added: false,
        };
        let current_header_ans = Object.assign([], array[outer_index].value, {
          [inner_index]: current_answer,
        });
        current_header_ans.push(empty_obj);
        dataModify(inner_index, outer_index, current_header_ans);
        break;

      case 'delete_row':
        let filter_data = data[outer_index].value.filter(
          (ele, ele_index) => ele_index != inner_index
        );
        filter_data = filter_data.map((item, index) => {
          return {
            ...item,
          };
        });
        dataModify(inner_index, outer_index, filter_data);
        break;
      default:
        break;
    }
  };

  /**Render Header and input view */
  const renderHeaderView = (item, index) => {
    return (
      <View style={styles.ToContainer}>
        <View
          style={[
            styles.headings,
            { backgroundColor: boxBackgroundColor(index) },
          ]}>
          <Text style={styles.headingText}>
            {item.header}
          </Text>
        </View>
        {item?.value // .sort((a, b) => (a.order < b.order && 1) || -1)
          .map((value, i) => {
            return (
              <View style={styles.ToContainer}>
                <View
                  style={[
                    styles.headings,
                    {
                      width: '95%',
                      marginHorizontal: 0,
                      backgroundColor: COLOR.LightGrayTextinput,
                      height: RFValue(45),
                      alignItems: 'flex-start',
                      paddingHorizontal: RFValue(10),
                      justifyContent: 'center',
                    },
                  ]}>
                  <TextInput
                    editable={value.is_added == false ? true : false}
                    multiline={true}
                    style={[
                      tempStyle.queTextInputAreaStyle,
                      {
                        backgroundColor: COLOR.LightGrayTextinput,
                        borderWidth: 0,
                        width: '100%',
                        padding: 0,
                        fontSize: 15,
                      },
                    ]}
                    value={value.answer}
                    maxLength={2000}
                    selectionColor={'green'}
                    underlineColorAndroid={'transparent'}
                    placeholderTextColor={'gray'}
                    onChangeText={text => {
                      onTextValueChange(text, i, index);
                    }}
                  />
                </View>
                {value.is_added == false ? (
                  <TouchableOpacity
                    onPress={() =>
                      value.answer != ''
                        ? clickHandler('add_row', i, index)
                        : null
                    }
                    style={styles.addButton}>
                    <IoniIcon
                      name={"add-circle"}
                      size={RFValue(30)}
                      color={value.answer == "" ? COLOR.PRIMARY : COLOR.DarkGray}
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => clickHandler('delete_row', i, index)}
                    style={styles.removeButton}>
                    <Icon name={'cancel'} size={25} color={COLOR.CINNABAR} />
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
      </View>
    );
  };

  /**On Save Button CLick */
  const onSaveHandler = () => {
    let isBlank = templateValidation(data, "multi_option");
    if (!isBlank) {
      let param = {
        cardId: cardData?._id,
        action: {
          user_response: data,
        },
        week: cardData.week,
        day: cardData.day,
      };
      onSubmit(param, cardData?.otherAttribute?.feedbackMessage);

    }

  };
  return (
    <View style={styles.mainContainer}>
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
      {data.map((item, index) => {
        return renderHeaderView(item, index);
      })}

      <View style={{ marginTop: RFValue(10), width: '100%' }}>
        <ButtonNew
          text={'save'}
          onBtnPress={() => {
            onSaveHandler();
          }}
        />
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
  mainContainer: {
    flex: 1,
    paddingHorizontal: 10,
    // alignItems: 'center',
    margin: RFValue(10),
  },
  container: {
    backgroundColor: 'white', //COLOR.BACKGROUND,
    flexGrow: 1,
  },
  headings: {
    width: '100%',
    minHeight: RFValue(35),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RFValue(5),
    paddingHorizontal: RFValue(10),
    paddingVertical: RFValue(10),
  },
  ToContainer: {
    width: '100%',
    marginTop: RFValue(10),
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
    right: RFValue(-2),
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
    right: 1,
    top: 3,
    zIndex: 1000,
  },
  headings2: {
    width: width / 1.1,
    marginHorizontal: 0,
    backgroundColor: COLOR.LightGrayTextinput,
    height: RFValue(45),
    alignItems: 'flex-start',
    paddingHorizontal: RFValue(20),
  },
  textInputStyle: {
    width: '95%',
    marginHorizontal: 0,
    backgroundColor: COLOR.LightGrayTextinput,
    height: RFValue(45),
    alignItems: 'flex-start',
    paddingHorizontal: RFValue(10),
    justifyContent: 'center',
  },
});
export default (TemplateTwentyOne = React.memo(TemplateTwentyOne));

