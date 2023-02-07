import tempStyle from '@components/dashboard/dailyLearningTemplates/globalTemplateStyle';
import GLOBALS from '@constants';
import * as ICONS from '@images';
import React, { useState, useEffect } from 'react';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';

import ButtonNew from '@components/common/buttonNew';
import {
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
  Image,
  FlatList,
} from 'react-native';
import { Slider } from '@miblanchard/react-native-slider'
import { alertWithOneBtn } from '@helpers/common';
const { FONTS, COLOR } = GLOBALS;
import * as AppActions from '@actions';
// import convertToProxyURL from 'react-native-video-cache';
import {
  ImageElement,
  ShowHtmlText,
  CardTitle,
  LikeElement,
} from '@components/dashboard/dailyLearningTemplates/templateElements';
import Icon from 'react-native-vector-icons/AntDesign';
import { useSelector, useDispatch } from 'react-redux';
import { SvgUri, SvgCssUri } from 'react-native-svg';
import { strings } from '@localization';

const { width, height } = Dimensions.get('window');

// Thermometer View Template

function ThermometerTemplate(props) {
  let { cardData, onSubmit, onLikeClick, onCommentClick, user_language } = props;
  const dispatch = useDispatch();

  const [data, setData] = useState(cardData?.otherAttribute?.assessment);
  const [cardId, setCardId] = useState(cardData?._id);
  const [week, setWeek] = useState(cardData?.week);
  const [day, setDay] = useState(cardData?.day);

  useEffect(() => {
    if (cardData.action) {
      let array = [];
      cardData?.otherAttribute?.assessment?.map(item => {
        cardData?.action?.termoAnsList?.map(t => {
          if (item.assessment_id == t._id) {
            array.push({
              ...item,
              position:
                t.answers?.length > 0
                  ? t.answers[0].answer
                    ? parseInt(t.answers[0].answer)
                    : 0
                  : 0,
            });
          }
        })
      });
      setData(array);
    } else {
      let array = [];
      cardData?.otherAttribute?.assessment?.map(item => {
        array.push({
          ...item,
          position:
            item.answers?.length > 0
              ? item.answers[0].answer
                ? parseInt(item.answers[0].answer)
                : 0
              : 0,
        });
      });
      setData(array);
    }

  }, []);

  const info = [
    { info: 'I felt this emotion very intensely' },
    { info: 'I felt this emotion with moderate intensity' },
    { info: 'I felt this emotion with little intensity' },
  ];

  const thermometerBox = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const dynamicBgColor = val => {
    if (val >= 0 && val < 3) {
      return COLOR.LIGHT_GREEN;
    }
    if (val >= 3 && val < 6) {
      return COLOR.LIGHT_YELLOW;
    }
    if (val >= 6 && val < 8) {
      return COLOR.LIGHT_ORANGE;
    }
    if (val >= 8 && val <= 10) {
      return COLOR.LIGHT_PINK;
    }
  };
  /*
here we generate small boxes inside the thermometer dynamic height generate boxes
*/
  const dynamicHeight = val => {
    if (val === 1) {
      return RFValue(70);
    }
    if (val === 2) {
      return RFValue(92);
    }
    if (val === 3) {
      return RFValue(114);
    }
    if (val === 4) {
      return RFValue(136);
    }
    if (val === 5) {
      return RFValue(158);
    }
    if (val === 6) {
      return RFValue(180);
    }
    if (val === 7) {
      return RFValue(202);
    }
    if (val === 8) {
      return RFValue(224);
    }
    if (val === 9) {
      return RFValue(246);
    }
    if (val === 10) {
      return RFValue(268);
    }
    if (val === 11) {
      return RFValue(278);
    }
  };

  /*
  on plus handler dynamic color set
  */
  const activeDynamicColor = val => {
    if (val >= 0 && val < 3) {
      return COLOR.DARK_GREEN;
    }
    if (val >= 3 && val < 6) {
      return COLOR.YELLOW;
    }
    if (val >= 6 && val < 8) {
      return COLOR.BUTTON_ORANGE;
    }
    if (val >= 8 && val <= 10) {
      return COLOR.DARK_RED;
    }
  };

  const getBoxColor = val => {
    switch (val) {
      case 0:
        return COLOR.DARK_RED;
      case 1:
        return COLOR.BUTTON_ORANGE;
      case 2:
        return COLOR.DARK_GREEN;
    }
  };

  //funtion for increases thermometer

  const onPlusPress = item => {
    let array = Array.from(data);
    array.map(value => {
      if (value.assessment_id === item.assessment_id) {
        if (value.position <= 10) value.position = value.position + 1;
      }
    });
    setData(array);
  };

  //funtion for decrease thermometer
  const onMinusPress = item => {
    let array = Array.from(data);
    array.map(value => {
      if (value.assessment_id === item.assessment_id) {
        if (value.position > 0) value.position = value.position - 1;
      }
    });
    setData(array);
  };

  const thermometerView = ({ item, index }) => {
    return (
      <View style={{ alignItems: 'center' }}>
        <View style={styles.headingStyle}>
          {/* {item.header && ( */}
          <ShowHtmlText
            source={{
              html: item.name
            }}
          />
          {/* )} */}
        </View>
        <Image
          source={require('../../../../assets/images/thermometer/emptyMeter.png')}
          resizeMode="stretch"
          style={styles.emptyMeteStyle}
        />
        <Image
          source={require('../../../../assets/images/thermometer/greenbottom.png')}
          resizeMode="stretch"
          style={styles.greenBottomStyle}
        />
        {thermometerBox.map((value, i) => {
          return (
            <View
              style={{
                ...styles.shades,
                backgroundColor:
                  item?.position >= value
                    ? activeDynamicColor(i)
                    : dynamicBgColor(i),
                bottom: dynamicHeight(value),
              }}
            />
          );
        })}
        <TouchableOpacity
          hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
          onPress={() => onPlusPress(item)}
          style={styles.plusButton}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity
          hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
          onPress={() => onMinusPress(item)}
          style={styles.minusButton}>
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const clickHandler = type => {
    switch (type) {
      case 'save':
        let termoAnsData = {
          card_id: cardId,
        };;
        let all_not_filled = data.every(v => v.position <= 0);
        if (all_not_filled) {
          alertWithOneBtn(strings.PERFORM_EXERCISE);
        } else {
          let submit_user_header = data.map(m => {
            return {
              _id: m.assessment_id,
              answers: [{ answer: m.position }],
            };
          });
          termoAnsData['termoAnsList'] = submit_user_header;
          let postData = {
            cardId: cardId,
            week: week,
            day: day,
            action: termoAnsData
          };
          onSubmit(postData, cardData?.otherAttribute?.feedbackMessage);
        }
        // return;
        break;

      default:
        break;
    }
  };

  /**Commet handling */
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
  return (
    <View style={styles.container}>
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
      {cardData?.otherAttribute?.assessment && (
        <FlatList
          //  data={cardData.headers}
          data={data}
          extraData={data}
          numColumns={2}
          keyExtractor={(item, index) => item.text}
          renderItem={(item, index) => thermometerView(item, index)}
          columnWrapperStyle={{
            justifyContent: 'space-between',
            marginVertical: RFValue(20),
            paddingHorizontal: RFValue(30),
          }}
        />
      )}

      {info.map((item, index) => {
        return (
          <View style={styles.infoView}>
            <View
              style={[styles.boxView, { backgroundColor: getBoxColor(index) }]}
            />
            <Text style={[styles.infoText, { color: getBoxColor(index) }]}>
              {item?.info}
            </Text>
          </View>
        );
      })}

      <View style={{ marginTop: RFValue(10) }}>
        <ButtonNew
          text={'save'}
          onBtnPress={() => {
            clickHandler('save');
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
  container: {
    flex: 1,
    paddingHorizontal: 10,
    margin: RFValue(10),
  },
  shades: {
    width: RFValue(11),
    height: RFValue(16),
    position: 'absolute',
  },
  emptyMeteStyle: {
    width: RFValue(50),
    height: RFValue(300),
  },
  greenBottomStyle: {
    position: 'absolute',
    bottom: RFValue(10),
    width: RFValue(30),
    height: RFValue(58),
  },
  buttonText: {
    fontSize: RFValue(30),
    fontWeight: 'bold',
    color: COLOR.blackGray,
  },
  headingStyle: {
    //  height: RFValue(30),
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: COLOR.CIRCLE_GRAY,
    width: RFValue(90),
    marginBottom: RFValue(10),
  },
  plusButton: {
    position: 'absolute',
    left: RFValue(70),
    top: RFValue(50),
  },
  minusButton: {
    position: 'absolute',
    left: RFValue(75),
    bottom: RFValue(10),
  },
  headingText: {
    fontFamily: FONTS.BOLD,
    color: COLOR.WHITE,
  },
  infoView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: RFValue(10),
  },
  boxView: {
    height: RFValue(20),
    width: RFValue(20),
    backgroundColor: 'red',
    borderRadius: RFValue(5),
  },
  infoText: {
    fontFamily: FONTS.BOLD,
    color: COLOR.BLACK,
    marginLeft: RFValue(10),
  },
});
export default (ThermometerTemplate = React.memo(ThermometerTemplate));
