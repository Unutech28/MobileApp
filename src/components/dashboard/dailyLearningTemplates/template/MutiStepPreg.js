import tempStyle from '@components/dashboard/dailyLearningTemplates/globalTemplateStyle';
import GLOBALS from '@constants';
import * as ICONS from '@images';
import React, { useState, useRef, useEffect } from 'react';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';

import ButtonNew from '@components/common/buttonNew';
import DropDownPicker from '../../../../updatedNodeModules/react-native-dropdown-picker';
import DatePicker from 'react-native-datepicker';
import { alertWithOneBtn } from '@helpers/common';

// import Icon from 'react-native-vector-icons/AntDesign';

import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { strings } from '@localization';
import {
  //   Image,
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  ActivityIndicator,
  Linking,
  TextInput,
  FlatList,
  LayoutAnimation,
  UIManager,
} from 'react-native';
import { Slider } from '@miblanchard/react-native-slider'
const { FONTS, COLOR } = GLOBALS;
import * as AppActions from '@actions';
// import convertToProxyURL from 'react-native-video-cache';
import {
  ImageElement,
  ShowHtmlText,
  CardTitle,
  LikeElement,
} from '@components/dashboard/dailyLearningTemplates/templateElements';
// import Ico from 'react-native-vector-icons/FontAwesome5';
import { useSelector, useDispatch } from 'react-redux';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width, height } = Dimensions.get('window');
function MutiStepPreg(props) {
  let { cardData, onSubmit, onLikeClick, onCommentClick, user_language } = props;
  const dispatch = useDispatch();

  const [duringPregnancy, setDuringPregnancy] = useState([]);
  const [afterBirth, setAfterBirth] = useState([]);
  const [index, setIndex] = useState(0);
  let temp_data = [];

  useEffect(() => {

    let array = [];
    if (
      cardData?.otherAttribute &&
      cardData?.otherAttribute?.contents?.length > 0 && cardData?.otherAttribute?.headers?.length > 0
    ) {
      // cardData?.otherAttribute?.headers.map(m => {
      //   array.push({
      //     ...m,
      //     contents: cardData?.otherAttribute?.contents.map(item => {
      //       return {
      //         ...item,
      //         is_selected: false
      //       }
      //     })
      //   })
      // })


      setOption()
    }
    return;

    if (
      cardData?.headers[0]?.selectedContents.length > 0 ||
      cardData?.headers[1]?.selectedContents.length > 0
    ) {
      setIndex(2);
      setTimeout(() => {
        onCompare();
      }, 300);
    } else {
      setIndex(0);
    }
  }, []);
  useEffect(() => {
  }, [index]);

  // const setOption = () => {
  //   temp_data = cardData?.headerscontents?.map(item => {
  //     /**Check if the option is already selected in any header */
  //     let duringPregheader = cardData?.headers[0]?.selectedContents;
  //     let afterBithheader = cardData?.headers[1]?.selectedContents;
  //     return {
  //       ...item,
  //       text: item.description[user_language],
  //       isSelected: false,
  //       isMatched: false,
  //       isSelectedDP: duringPregheader?.some(s => s._id == item._id),
  //       isSelectedAb: afterBithheader?.some(s => s._id == item._id),
  //     };
  //   });
  //   setDuringPregnancy(temp_data);
  // };
  const setOption = () => {
    let user_response = cardData?.action?.user_response
      ? cardData?.action?.user_response
      : [];
    let temp_data = cardData?.otherAttribute?.contents.map(item => {
      /**Check if the option is already selected in any header */
      let duringPregheader = user_response.length > 0 ? user_response[0].selectedContents : [];
      let afterBithheader = user_response.length > 0 ? user_response[1].selectedContents : [];
      return {
        ...item,
        isSelected: false,
        isMatched: false,
        isSelectedDP: duringPregheader?.some(s => s.content_id == item.content_id),
        isSelectedAb: afterBithheader?.some(s => s.content_id == item.content_id),
      };
    });
    setDuringPregnancy(temp_data);
  };
  const resetOption = () => {
    let temp_data = [];
    temp_data = cardData?.otherAttribute?.contents.map(item => {
      return {
        ...item,
        isSelected: false,
        isMatched: false,
        isSelectedDP: false,
        isSelectedAb: false,
      };
    });
    setDuringPregnancy(temp_data);
  };

  const rederItems = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          onItemPress(item);
        }}
        style={[
          styles.itemsStyle,
          {

            backgroundColor: item.isSelectedDP ? COLOR.DARK_GREEN : COLOR.WHITE,
            width: item.isSelectedDP ? '48%' : '46%',
          },
        ]}>
        <Text>{item?.contentDesc}</Text>
      </TouchableOpacity>
    );
  };
  const rederItems2 = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          onItemPress2(item);
        }}
        style={[
          styles.itemsStyle,
          {
            backgroundColor: item.isSelectedAb
              ? COLOR.BUTTON_ORANGE
              : COLOR.WHITE,
            width: item.isSelectedAb ? '48%' : '46%',
          },
        ]}>
        <Text>{item?.contentDesc}</Text>
      </TouchableOpacity>
    );
  };
  const renderData = ({ item, index }) => {
    if (item.isSelectedAb) {
      return (
        <TouchableOpacity
          onPress={() => {
          }}
          style={[
            styles.itemsStyle,
            {
              backgroundColor: item.isSelectedAb
                ? COLOR.BUTTON_ORANGE
                : COLOR.WHITE,
            },
          ]}>
          <Text>{item?.contentDesc}</Text>
        </TouchableOpacity>
      );
    }
    if (item.isMatched) {
      return (
        <LinearGradient
          colors={[COLOR.DARK_GREEN, COLOR.BUTTON_ORANGE]}
          style={[
            styles.itemsStyle,
            {
              backgroundColor: item.isSelected
                ? COLOR.BUTTON_ORANGE
                : COLOR.WHITE,
            },
          ]}>
          <Text>{item?.contentDesc}</Text>
        </LinearGradient>
      );
    }
    if (item.isSelectedDP) {
      return (
        <TouchableOpacity
          onPress={() => {
            // onItemPress(item);
          }}
          style={[
            styles.itemsStyle,
            {
              backgroundColor: item.isSelectedDP
                ? COLOR.DARK_GREEN
                : COLOR.WHITE,
            },
          ]}>
          <Text>{item?.contentDesc}</Text>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          onPress={() => {
            // onItemPress(item);
          }}
          style={[styles.itemsStyle, { backgroundColor: COLOR.WHITE }]}>
          <Text>{item?.contentDesc}</Text>
        </TouchableOpacity>
      );
    }
  };

  const onItemPress = item => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    let array = Array.from(duringPregnancy);
    array.map((data, index) => {
      if (item.content_id == data.content_id) {
        data.isSelectedDP = !data.isSelectedDP;
      }
    });
    setDuringPregnancy(array);
  };

  const onItemPress2 = item => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    let array = Array.from(duringPregnancy);
    array.map((data, index) => {
      if (item.content_id == data.content_id) {
        data.isSelectedAb = !data.isSelectedAb;
      }
    });
    setAfterBirth(array);
  };
  const checkDuringPregnancyTask = () => {
    let isempty = true;
    duringPregnancy.map((data, index) => {
      if (data.isSelectedDP) {
        isempty = false;
      }
    });
    return isempty;
  };
  const checkAfterBirthTask = () => {
    let isempty = true;
    duringPregnancy.map((data, index) => {
      if (data.isSelectedAb) {
        isempty = false;
      }
    });
    return isempty;
  };

  const clickHandle = type => {
    switch (type) {
      case 'next':
        let isEmpty = checkDuringPregnancyTask();
        if (isEmpty) {
          alertWithOneBtn(strings.PERFORM_EXERCISE);
        } else {
          setIndex(index + 1);
        }

        break;
      /**Do again press. Reset to start state */
      case 'reset':
        setIndex(0);
        resetOption();
        break;

      default:
        break;
    }
  };

  const onCompare = () => {
    let data =
      duringPregnancy.length > 0
        ? Array.from(duringPregnancy)
        : Array.from(temp_data);
    data.map(item => {
      if (item.isSelectedAb && item.isSelectedDP) {
        item.isMatched = true;
        item.isSelectedAb = false;
        item.isSelectedDP = false;
      }
    });
    setDuringPregnancy(data);
    // index < 2 && setIndex(index + 1);
  };

  /**On save button press */
  const onSave = () => {
    /**Separate data selected for During pregancy and after birth */
    let duringPregData = duringPregnancy.filter(
      item => item.isSelectedDP || item.isMatched,
    );
    let afterBirthData = duringPregnancy.filter(
      item => item.isSelectedAb || item.isMatched,
    );
    let submit_user_header = cardData?.otherAttribute?.headers.map((m, index) => {
      return {
        ...m,
        selectedContents:
          index == 0
            ? [...duringPregData]
            : [...afterBirthData]
      };
    });
    let param = {
      cardId: cardData?._id,
      action: { user_response: submit_user_header },
      week: cardData.week,
      day: cardData.day,
    };
    onSubmit(param, cardData?.otherAttribute?.feedbackMessage.trim());
    // onSubmit(submit_user_header, '');
  };

  const boxBackgroundColor = (order) => {
    if (order === 0) {
      return COLOR.DARK_GREEN;
    }
    if (order === 1) {
      return COLOR.BUTTON_ORANGE;
    }
    if (order === 2) {
      return COLOR.YELLOW;
    }
    if (order === 3) {
      return COLOR.CIRCLE_GRAY;
    }
  };
  const onCommentPress = () => {
    dispatch(AppActions.setCommentsArray(cardData.usercomments));
    onCommentClick({ card_id: cardData._id });
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
      <View style={styles.mainView}>
        <View>
          <Text style={styles.comparisonTextHeading}>
            {index < 2 ? cardData?.otherAttribute?.headers[index].headerDesc : 'Both'}
          </Text>
          {cardData?.otherAttribute?.headers && cardData?.otherAttribute?.headers.map((item, index) => {
            return (
              <View style={styles.comparisonView}>
                <View
                  style={[
                    styles.comparisonBoxStyle,
                    { backgroundColor: boxBackgroundColor(index) },
                  ]}
                />
                <Text style={styles.comparisonTextStyle}> {item.headerDesc}</Text>
              </View>
            )
          })}
          <View style={styles.comparisonView}>
            <LinearGradient
              colors={[COLOR.DARK_GREEN, COLOR.BUTTON_ORANGE]}
              style={[
                styles.comparisonBoxStyle,
                { backgroundColor: COLOR.DARK_GREEN },
              ]}
            />
            <Text style={styles.comparisonTextStyle}>Both</Text>
          </View>
        </View>
        <View>
          <FlatList
            data={duringPregnancy}
            extraData={duringPregnancy}
            numColumns={2}
            keyExtractor={(item, index) => item.text}
            renderItem={
              index == 0 ? rederItems : index == 1 ? rederItems2 : renderData
            }
            columnWrapperStyle={{
              justifyContent: 'space-between',
              marginTop: RFValue(10),
            }}
          />
        </View>
        <View
          style={[
            styles.buttonView,
            { justifyContent: index < 2 ? 'flex-end' : 'space-between' },
          ]}>
          {index > 1 && (
            <TouchableOpacity
              style={styles.DoButtonStyle}
              onPress={() => clickHandle('reset')}>
              <Text style={styles.buttonText}>{'Do Again'}</Text>
            </TouchableOpacity>
          )}
          <View style={{ width: '50%', alignSelf: 'flex-end' }}>
            {index == 0 ? (
              <ButtonNew
                text={'Next Step'}
                onBtnPress={() => clickHandle('next')}
              />
            ) : index < 2 ? (
              <ButtonNew
                text={'Compare'}
                onBtnPress={() => {
                  let isEmpty = checkAfterBirthTask();
                  if (isEmpty) {
                    alertWithOneBtn(strings.PERFORM_EXERCISE);
                  } else {
                    setIndex(index + 1);
                    onCompare();
                  }
                }}
              />
            ) : (
              <ButtonNew text={'save'} onBtnPress={onSave} />
            )}
          </View>

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
    // alignItems: 'center',
    margin: RFValue(10),
  },
  comparisonBoxStyle: {
    height: RFValue(20),
    width: RFValue(20),
    borderRadius: RFValue(5),
    marginRight: RFValue(10),
  },
  comparisonView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: RFValue(10),
  },
  comparisonTextStyle: {
    fontFamily: FONTS.MEDIUM,
    color: COLOR.BLACK,
  },
  mainView: {
    backgroundColor: COLOR.LIGHT_GRAY,
    padding: RFValue(20),
  },
  comparisonTextHeading: {
    fontFamily: FONTS.BOLD,
    color: COLOR.BLACK,
    fontSize: RFValue(14),
  },
  itemsStyle: {
    backgroundColor: COLOR.WHITE,
    alignItems: 'center',
    justifyContent: 'center',
    width: '47%',
    height: RFValue(40),
    borderRadius: RFValue(5),
  },
  buttonView: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: FONTS.BOLD,
    color: COLOR.DARK_GREEN,
    // marginLeft: RFValue(20),
    fontSize: RFValue(18),
  },
  titleStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  DoButtonStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLOR.DARK_GREEN,
    padding: RFValue(10),
    borderRadius: RFValue(5),
    alignSelf: 'flex-end',
    width: '40%',
  },
});
export default (MutiStepPreg = React.memo(MutiStepPreg));
