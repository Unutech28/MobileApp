import NoData from '@components/common/NoData';
import Loader from '@components/common/screenLoader';
import GLOBALS from '@constants';
import * as ICONS from '@images';
import React, { useState, lazy, useReducer, useEffect } from 'react';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import { ratio, screenWidth } from '../../../utils/Styles';
// import RenderHtml from 'react-native-render-html';
import {
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  StatusBarIOS,
  NativeModules,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
const isiOS = Platform.OS == 'ios';
const { FONTS, COLOR, STRINGS } = GLOBALS;
const Header = lazy(() => import('@components/common/Header'));
const { StatusBarManager } = NativeModules;
const { width, height } = Dimensions.get('window');
let window = Dimensions.get('window');
import { shallowEqual, useSelector } from 'react-redux';
// import { Slider } from '@miblanchard/react-native-slider'
import { Slider } from '@miblanchard/react-native-slider'

// import GestureRecognizer, {
//   swipeDirections,
// } from "react-native-swipe-gestures";
import GestureRecognizer, {
  swipeDirections,
} from '../../../updatedNodeModules/react-native-swipe-gestures';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  checkIfAllQuestionNotAnswered,
  showEmptyAlert,
  checkNextDayUnlocked,
  showAlert,
} from './utilities';
const days = [1, 2, 3, 34];

function DailyLearningTemplates(props) {
  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 280,
    gestureIsClickThreshold: 20
  };
  let {
    templateApiRes,
    templateUI,
    onDayComplete,
    getSpecificaDayCard,
    updateCurrentCardCount,
  } = props;
  /** To Get Data from Reducer */
  const reducerData = useSelector(state => {
    return state;
  });
  /**To listen all the changes Cards Array Prop */
  useEffect(() => {
    setTemplateApiRes(props.templateApiRes);
    setTotalCard(props.templateApiRes.cards.length);
    setCardNo(1);
    setSubCardOnBasisOfIndexData(
      props.templateApiRes.cards.length > 0
        ? props.templateApiRes.cards[0]
        : [],
    );
  }, [props.templateApiRes]);

  /**Manage Card Counts */
  const [cardNo, setCardNo] = useState(1);
  // setTemplateApiRes(reducerData.cardsReducer.currentCard.cards[0])
  // const [templateApiResponse, setTemplateApiRes] = useState(reducerData.cardsReducer.currentCard.cards[0]);
  const [templateApiResponse, setTemplateApiRes] = useState(templateApiRes);
  const [total_card, setTotalCard] = useState(
    templateApiRes !== undefined && templateApiRes.cards !== undefined
      ? templateApiRes.cards.length
      : 1,
  );
  /**Set Single Card Data */
  const [subCardOnBasisOfIndexData, setSubCardOnBasisOfIndexData] = useState(
    templateApiRes !== undefined && templateApiRes.cards !== undefined
      ? templateApiRes.cards[0]
      : [],

    // templateApiRes !== undefined && templateApiRes.cards !== undefined
    //   ? reducerData.cardsReducer.currentCard.cards[0]
    //   : []
  );

  const GenerateUI = ({ cardData }) => {
    return templateUI(cardData);
  };

  /*Function  changing for card components */
  const subCardNextPrev = (index, data) => {
    setTemplateNumber(index);
    setSubCardOnBasisOfIndexData(data);
  };

  const onSwipeHandler = (direction, data) => {
    switch (direction) {
      case 'left':
        if (templateApiRes.cards[cardNo - 1]?.templateNumber == 2) {
          if (checkIfAllQuestionNotAnswered(templateApiRes.cards[cardNo - 1])) {
            showEmptyAlert();
            return;
          }
        }
        if (total_card > cardNo) {
          setCardNo(cardNo + 1);

          setSubCardOnBasisOfIndexData(templateApiRes.cards[cardNo + 1 - 1]);
          // updateCurrentCardCount({
          //   day: templateApiRes.cards[cardNo + 1 - 1].day,
          //   week: templateApiRes.cards[cardNo + 1 - 1].week
          // })
          if (cardNo == total_card - 1 && total_card > 1) {
            onDayComplete(true);
          }
          if (cardNo == total_card - 2 && total_card > 1) {
            onDayComplete(false);
          }
        }
        if (cardNo == total_card) {
          let new_day_week = checkNextDayUnlocked(
            reducerData.cardsReducer.selected_week,
            reducerData.cardsReducer.selected_day,
            reducerData.playlistReducer.playlistDynamicRes.week,
            reducerData.playlistReducer.playlistDynamicRes.day,
            reducerData.playlistReducer.playlistDynamicRes.totalWeekDays,
          );
          if (new_day_week != null) {
            getSpecificaDayCard(new_day_week);
          } else {
            showAlert('Next content is not unlocked yet');
          }

          //const { isDashboardModal } = useSelector((state) => state.common);
        }

        break;
      case 'right':
        if (cardNo > 1 && cardNo <= total_card) {
          setCardNo(cardNo - 1);
          setSubCardOnBasisOfIndexData(templateApiRes.cards[cardNo - 1 - 1]);
        }
        if (cardNo == 1) {
          /**Same week day changes */
          if (templateApiRes.cards[cardNo - 1].day > 1) {
            getSpecificaDayCard({
              new_week: templateApiRes.cards[cardNo - 1].week,
              new_day: templateApiRes.cards[cardNo - 1].day - 1,
            });
          }
          /**Same day week changes */
          if (templateApiRes.cards[cardNo - 1].day == 1) {
            if (templateApiRes.cards[cardNo - 1].week > 1) {
              getSpecificaDayCard({
                new_week: templateApiRes.cards[cardNo - 1].week - 1,
                new_day: 1,
              });
            } else {
            }
          }
          // if (templateApiRes.cards[cardNo - 1].week > 1) {
          //   getSpecificaDayCard({
          //     new_week: templateApiRes.cards[cardNo - 1].week - 1,
          //     new_day: 1
          //   }, false)

          // }
        }
        break;

      default:
        break;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.scene}>
        <View style={{ flex: 0.05, marginTop: RFValue(8) }}>
          <Slider
            trackStyle={styles.track}
            value={cardNo}
            maximumTrackTintColor={COLOR.progressBarColor}
            minimumTrackTintColor={COLOR.PRIMARY}
            thumbStyle={styles.thumb}
            maximumValue={total_card}
            disabled={true}
            animateTransitions={true}
          />
          {/* <View style={styles.bubbleView}>
            {templateApiRes?.cards?.map((m, i) => {
              return <View style={styles.bubbles} />;
            })}
          </View> */}
        </View>
        <View style={{ flex: 1 }}>
          {subCardOnBasisOfIndexData != undefined ? (
            isiOS ? (
              <GestureRecognizer
                onSwipeLeft={state => onSwipeHandler('left', state)}
                onSwipeRight={state => onSwipeHandler('right', state)}
                onDayComplete={() => onDayComplete(true)}
                config={config}
                bounces={true}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
                nestedScrollEnabled={true}
                style={{
                  flex: 1,
                  // backgroundColor: "red",
                }}>
                {/* ******** ************************** Cards Render UI Start********************** */}

                <GenerateUI cardData={subCardOnBasisOfIndexData} />

                {/* ******** ************************** Cards Render UI End********************** */}
              </GestureRecognizer>
            ) : (
              <ScrollView
                ref={ref => {
                  // scrollView = ref;
                }}
                // onContentSizeChange={() => scrollView.scrollTo(0)}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
                nestedScrollEnabled={true}
                style={{
                  flex: 1,
                }}>
                <GestureRecognizer
                  onSwipeLeft={state => onSwipeHandler('left', state)}
                  onSwipeRight={state => onSwipeHandler('right', state)}
                  onDayComplete={() => onDayComplete(true)}
                  config={config}
                  bounces={true}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ flexGrow: 1 }}
                  style={{
                    flex: 1,
                  }}>
                  {/* ******** ************************** Cards Render UI Start********************** */}

                  <GenerateUI cardData={subCardOnBasisOfIndexData} />

                  {/* ******** ************************** Cards Render UI End********************** */}
                </GestureRecognizer>
              </ScrollView>
            )
          ) : null}
        </View>
        {/* Cards UI End*/}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white', //COLOR.BACKGROUND,
    flexGrow: 1,
  },
  scene: {
    flex: 1,
    //  padding: RFValue(10),
  },
  daysView: {
    borderRadius: 30,
    borderWidth: 2,
    height: RFValue(30),
    width: RFValue(30),
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerCircleView: {
    borderRadius: 30,
    borderWidth: 2,
    height: RFValue(20),
    width: RFValue(20),
    backgroundColor: COLOR.PRIMARY,
    borderColor: COLOR.PRIMARY,
  },
  lineView: {
    width: 30,
    height: 2,
  },
  cardsViewStyle: {
    borderRadius: 30,
    borderWidth: 2,
    height: 30,
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /**SliderStyling */
  thumb: {
    width: Platform.OS == 'android' ? RFValue(35) : 40,
    height: Platform.OS == 'android' ? RFValue(35) : 40,
    borderRadius: 20,
    backgroundColor: COLOR.PRIMARY,
    borderColor: COLOR.LIGHT_SHADOW_GREEN,
    borderWidth: 8,
    shadowColor: COLOR.PRIMARY,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    shadowOpacity: 0.35,
  },
  track: {
    height: 5,
    marginHorizontal: RFValue(10),
    borderRadius: 4,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 1,
    shadowOpacity: 0.15,
  },
  bubbles: {
    backgroundColor: COLOR.PRIMARY,
    height: Platform.OS == 'android' ? RFValue(4) : RFValue(5),
    width: Platform.OS == 'android' ? RFValue(4) : RFValue(5),
    // borderRadius: RFValue(3),
  },
  bubbleView: {
    position: 'absolute',
    top: Platform.OS == 'android' ? RFValue(18) : RFValue(14),
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    //paddingLeft: RFValue(40),
    marginHorizontal: RFValue(10),
  },
});
export default (DailyLearningTemplates = React.memo(DailyLearningTemplates));
