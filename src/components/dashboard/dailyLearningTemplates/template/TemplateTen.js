import GLOBALS from '@constants';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as AppActions from '@actions';
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  TextInput,
  Image,
  Keyboard
} from 'react-native';
import tempStyle from '@components/dashboard/dailyLearningTemplates/globalTemplateStyle';
import { showEmptyAlert } from '../utilities';
import { RFValue } from 'react-native-responsive-fontsize';
const { COLOR, STRINGS, FONTS } = GLOBALS;
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
const { DARK_GREEN, WHITE, BLACK } = COLOR;
const { LIGHT, REGULAR } = FONTS;
import ButtonNew from '@components/common/buttonNew';
const { width, height } = Dimensions.get('window');

const panImage = {
  balance0:
    'https://mscuriostorage.blob.core.windows.net/allimages/app/balance0.898817b7.svg',
  balanceR1:
    'https://mscuriostorage.blob.core.windows.net/allimages/app/balanceR1.cfd8563a.svg',
  balanceR2:
    'https://mscuriostorage.blob.core.windows.net/allimages/app/balanceR2.69207d13.svg',
  balanceR3:
    'https://mscuriostorage.blob.core.windows.net/allimages/app/balanceR3.1a93a0e7.svg',
  balanceR4:
    'https://mscuriostorage.blob.core.windows.net/allimages/app/balanceR4.661598db.svg',
  balanceR5:
    'https://mscuriostorage.blob.core.windows.net/allimages/app/balanceR5.ee9c9711.svg',
  balanceR6:
    'https://mscuriostorage.blob.core.windows.net/allimages/app/balanceR6.5a52c810.svg',
  balanceR7:
    'https://mscuriostorage.blob.core.windows.net/allimages/app/balanceR7.1a555d33.svg',
  balanceL1:
    'https://mscuriostorage.blob.core.windows.net/allimages/app/balanceL1.5371c309.svg',
  balanceL2:
    'https://mscuriostorage.blob.core.windows.net/allimages/app/balanceL2.5640ed98.svg',
  balanceL3:
    'https://mscuriostorage.blob.core.windows.net/allimages/app/balanceL3.384dc028.svg',
  balanceL4:
    'https://mscuriostorage.blob.core.windows.net/allimages/app/balanceL4.48ca56c1.svg',
  balanceL5:
    'https://mscuriostorage.blob.core.windows.net/allimages/app/balanceL5.b748debb.svg',
  balanceL6:
    'https://mscuriostorage.blob.core.windows.net/allimages/app/balanceL6.695055e7.svg',
  balanceL7:
    'https://mscuriostorage.blob.core.windows.net/allimages/app/balanceL7.c099fa51.svg',
};

function TemplateTen(props) {
  let {
    cardData,
    onSubmit,
    onLikeClick,
    onCommentClick,
    user_language,
    userId,
  } = props;
  const dispatch = useDispatch();
  const [leftText, setLeftText] = useState('');
  const [RightText, setRightText] = useState('');

  const [leftInputs, setLeftItems] = useState([]);
  const [rightInputs, setRightItems] = useState([]);
  // const [rightInputs, setRightItems] = useState(cardData?.headers[1]?.answers);

  const [initial, setDefault] = useState(1);
  const [isLeftBalance, setIsLeftBalance] = useState(false);
  /**Set Pan image on data change */
  useEffect(() => {
    if (leftInputs.length === rightInputs.length) {
      setIsLeftBalance(false);
      setDefault(1);
    }
    if (leftInputs.length > rightInputs.length) {
      setDefault(leftInputs.length - rightInputs.length + 1);
      setIsLeftBalance(true);
    }
    if (rightInputs.length > leftInputs.length) {
      setDefault(rightInputs.length - leftInputs.length + 1);
      setIsLeftBalance(false);
    }
  }, [leftInputs, rightInputs]);

  useEffect(() => {
    if (cardData.action) {
      setLeftItems(cardData.action[0].answers)
      setRightItems(cardData.action[1].answers)
    } else {
      setLeftItems([])
      setRightItems([])
    }
  }, [cardData]);


  /**When item is added */
  const onItemAdded = direction => {
    switch (direction) {
      case 'left':
        let leftSelectedValues = [...leftInputs];
        leftSelectedValues.push({ answer: leftText });
        setLeftItems(leftSelectedValues);
        setLeftText('');
        break;
      case 'right':
        let SelectedValues = [...rightInputs];
        SelectedValues.push({ answer: RightText });
        setRightItems(SelectedValues);
        setRightText('');

      default:
        break;
    }
  };
  /** When added item removes from cross icon */
  const onItemRemove = (index, direction) => {
    switch (direction) {
      case 'left':
        let leftSelectedValues = [...leftInputs];
        leftSelectedValues.splice(index, 1);
        setLeftItems(leftSelectedValues);
        break;
      case 'right':
        let RightSelectedValues = [...rightInputs];
        RightSelectedValues.splice(index, 1);
        setRightItems(RightSelectedValues);
      default:
        break;
    }
  };

  /**Show dynamic pan image based on the items added */
  const imageRenderHandler = () => {
    if (initial === 1) {
      return panImage.balance0;
    } else {
      if (isLeftBalance) {
        if (initial === 2) {
          return panImage.balanceL1;
        }
        if (initial === 3) {
          return panImage.balanceL2;
        }
        if (initial === 4) {
          return panImage.balanceL3;
        }
        if (initial === 5) {
          return panImage.balanceL4;
        }
        if (initial === 6) {
          return panImage.balanceL5;
        }
        if (initial === 7) {
          return panImage.balanceL6;
        }
        if (initial === 8 || initial > 8) {
          return panImage.balanceL7;
        }
      } else {
        if (initial === 2) {
          return panImage.balanceR1;
        }
        if (initial === 3) {
          return panImage.balanceR2;
        }
        if (initial === 4) {
          return panImage.balanceR3;
        }
        if (initial === 5) {
          return panImage.balanceR4;
        }
        if (initial === 6) {
          return panImage.balanceR5;
        }
        if (initial === 7) {
          return panImage.balanceR6;
        }
        if (initial === 8 || initial > 8) {
          return panImage.balanceR7;
        }
      }
    }
  };

  /**On Save button click */
  const _onSaveClick = () => {
    Keyboard.dismiss()
    if (leftInputs == 0 && rightInputs == 0) {
      showEmptyAlert();
      return;
    }
    let headerData = [1, 2];
    headerData = headerData.map((item, index) => {
      item = Object.assign({}, item, {
        answers: index == 0 ? leftInputs : rightInputs,
      });
      return item;
    });
    let postData = {
      cardId: cardData._id,
      week: cardData.week,
      day: cardData.day,
      action: headerData
    };
    onSubmit(postData, cardData.otherAttribute.feedbackMessage);
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

  /** Show added list by user */
  const renderListItem = (item, index, direction) => {
    return (
      <View>
        <View style={[styles.panView2, { marginTop: RFValue(8) }]}>
          <Text style={styles.label}>
            {/* {item[user_language]
              ? item[user_language]
              : item?.answer[user_language]} */}
            {item.answer}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => onItemRemove(index, direction)}
          style={styles.removeButton}>
          <Icon name={'cancel'} size={22} color={COLOR.CINNABAR} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={[tempStyle.outerContainer, { paddingHorizontal: 5 }]}>
      <View style={{}}>
        <View style={{}}>
          {cardData?.card_title != '' && (
            <CardTitle
              style={tempStyle?.cardTitle}
              text={
                cardData?.title ? cardData?.title : ''
              }
            />
          )}
          {cardData.description ? (
            <ShowHtmlText
              contentWidth={width}
              source={{
                html: cardData?.description ?
                  cardData?.description
                  : '',
              }}
            />
          ) : null}
        </View>
        <View style={[styles.panPointView]}>
          <View style={[styles.panView]}>
            <FlatList
              data={leftInputs}
              nestedScrollEnabled={true}
              keyExtractor={({ item, index }) => {
                item + index;
              }}
              renderItem={({ item, index }) => {
                return renderListItem(item, index, 'left');
              }}
              contentContainerStyle={{}}
            />
          </View>
          <View style={[styles.panView]}>
            <FlatList
              data={rightInputs}
              nestedScrollEnabled={true}
              keyExtractor={({ item, index }) => {
                item + index;
              }}
              renderItem={({ item, index }) => {
                return renderListItem(item, index, 'right');
              }}
            />
          </View>
        </View>

        <View style={[styles.panPointView, { marginTop: RFValue(40) }]}>
          <View style={[styles.panView, {}]}>
            <TextInput
              multiline={true}
              numberOfLines={5}
              placeholder={
                cardData?.otherAttribute.firstAssessment ?
                  cardData?.otherAttribute.firstAssessment :
                  " "
              }
              style={[styles.queTextInputStyle, {}]}
              value={leftText}
              maxLength={2000}
              underlineColorAndroid={'transparent'}
              placeholderTextColor={COLOR.BLACK}
              onChangeText={text => {
                setLeftText(text);
              }}
            />
            <TouchableOpacity
              onPress={() => onItemAdded('left')}
              style={styles.addButton}>
              <IoniIcon
                name={'add-circle'}
                size={RFValue(30)}
                color={COLOR.DarkGray}
              />
            </TouchableOpacity>
          </View>

          <View style={[styles.panView]}>
            <TextInput
              multiline={true}
              placeholder={
                cardData?.otherAttribute.secondAssessment ?
                  cardData?.otherAttribute.secondAssessment :
                  ""
              }
              style={styles.queTextInputStyle}
              value={RightText}
              maxLength={2000}
              underlineColorAndroid={'transparent'}
              placeholderTextColor={COLOR.BLACK}
              onChangeText={text => {
                setRightText(text);
              }}
            />
            <TouchableOpacity
              onPress={() => onItemAdded('right')}
              style={styles.addButton}>
              <IoniIcon
                name={'add-circle'}
                size={RFValue(30)}
                color={COLOR.DarkGray}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.buttonView}>
          <SvgUri width="100%" uri={imageRenderHandler()} />
        </View>
      </View>
      <View style={tempStyle.submitContainer}>
        <ButtonNew
          text={strings.cards.submit}
          onBtnPress={() => _onSaveClick()}
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
export default (TemplateTen = React.memo(TemplateTen));

const styles = {
  buttonView: {
    marginTop: RFValue(10),
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: RFValue(25),
    fontFamily: FONTS.MEDIUM,
    color: COLOR.BLACK,
    marginTop: RFValue(25),
    marginBottom: RFValue(10),
    fontWeight: '700',
  },
  panPointView: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  panView: {
    width: '47%',
  },
  panView2: {
    width: '95%',
    borderColor: COLOR.GREY,
    borderWidth: 0.5,
    borderRadius: 5,
    padding: RFValue(10),
    backgroundColor: COLOR.INPUT_BG,
  },
  queTextInputStyle: {
    fontSize: RFValue(13),
    fontFamily: FONTS.REGULAR,
    color: COLOR.BLACK,
    borderColor: COLOR.GREY,
    borderWidth: 0.5,
    borderRadius: 5,
    paddingVertical: RFValue(10),
    paddingHorizontal: RFValue(10),
    backgroundColor: COLOR.INPUT_BG,
    height: RFValue(70),
  },
  image: {
    width: '100%',
    height: RFValue(190),
  },
  addButton: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: -20,
  },
  removeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 1,
    top: 3,
    zIndex: 1000,
  },
  label: {
    fontSize: RFValue(13),
    fontFamily: FONTS.REGULAR,
    color: COLOR.BLACK,
  },
};
