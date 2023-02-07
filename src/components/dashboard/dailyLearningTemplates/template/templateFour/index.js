import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import React, { useState, useEffect } from "react";
import tempStyle from '@components/dashboard/dailyLearningTemplates/globalTemplateStyle';
import Video from 'react-native-video';
import {
  ImageElement,
  ShowHtmlText,
  CardTitle,
  LikeElement,
} from '@components/dashboard/dailyLearningTemplates/templateElements';
import { RFValue } from 'react-native-responsive-fontsize';
import { strings } from '@localization';
import ShadowView from '../../../../common/ShadowView';
import GLOBALS from '@constants';
import * as Images from '@images';
import * as AppActions from '@actions';
import { useSelector, useDispatch } from 'react-redux';
import PlatGif from "@components/common/PlayGif";

const { COLOR, FONTS } = GLOBALS;
const { DARK_GREEN } = COLOR;
const { width, height } = Dimensions.get('window');
const TemplateFour = props => {
  let {
    cardData,
    trackerClick,
    onLikeClick,
    onCommentClick,
    user_language,
    cardState
  } = props;
  const dispatch = useDispatch();
  const [showPoster, setShowPoster] = useState(true);

  /** Set Base URL of media path starts */
  const [imageBaseURL, setImageBaseURL] = useState(
    cardState?.imgBp ? cardState.imgBp : ""
  );

  const [cardImg, setCardImg] = useState(null);

  useEffect(() => {

    if (cardData.img != null) {
      if (cardImg == null) {
        setCardImg(cardData.img);
      } else if (cardImg != null && cardImg[0].url != cardData.img[0].url) {
        setCardImg(cardData.img);
      }
    } else {
      setCardImg(null);
    }

  }, [cardData])
  const onTrackerClick = tracker => {
    trackerClick(tracker);
  };
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
    <View
      style={[
        tempStyle.outerContainer,
        Platform.OS == 'android'
          ? { minHeight: height / 1.2, backgroundColor: 'white' }
          : null,
      ]}>
      <View style={{ flex: 1 }}>
        <CardTitle
          text={
            cardData?.title
              ? cardData.title
              : ''
          }
          style={tempStyle.cardTitle}
        />
        {cardData.description == null ? (
          <Text style={tempStyle.tFourSubHeading}>{cardData.tracker}</Text>
        ) : null}

        {cardData.description ? (
          <ShowHtmlText
            source={{
              html: cardData?.description
                ? cardData.description
                : '',
            }}
          />
        ) : null}

        {typeof cardData?.otherAttribute?.tracker != 'string' ? (
          <FlatList
            data={cardData?.otherAttribute?.tracker}
            extraData={cardData?.tracker}
            keyExtractor={({ item, index }) => {
              item + index;
            }}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity onPress={() => onTrackerClick(item)}>
                  <ShadowView style={styles.shadowWrapper2}>
                    <Image
                      source={
                        item == 'mood'
                          ? Images.Mood
                          : item == 'activity' || item == 'pleasant'
                            ? Images.Activity
                            : Images.SleepNew
                      }
                      resizeMode="contain"
                      style={{ width: '17%' }}
                    />
                    <Text style={styles.trackerHeading}>
                      {item == 'mood'
                        ? strings.home.mood
                        : item == 'activity'
                          ? strings.home.activity
                          : item == 'pleasant'
                            ? strings.PLEASANT_ACTIVITY
                            : strings.home.sleep}
                    </Text>
                    <Image
                      source={Images.Forward}
                      resizeMode="contain"
                      style={styles.forwardArrow}
                    />
                  </ShadowView>
                </TouchableOpacity>
              );
            }}
          />
        ) : (
          <TouchableOpacity onPress={() => onTrackerClick(cardData.tracker)}>
            <ShadowView style={styles.shadowWrapper}>
              <Image
                source={
                  cardData.tracker == 'mood'
                    ? Images.Mood
                    : cardData.tracker == 'activity' ||
                      cardData.tracker == 'pleasant'
                      ? Images.Activity
                      : Images.SleepNew
                }
                resizeMode="contain"
                style={{ width: '17%' }}
              />
              <Text style={styles.trackerHeading}>
                {cardData.tracker == 'mood'
                  ? strings.home.mood
                  : cardData.tracker == 'activity' ||
                    cardData.tracker == 'pleasant'
                    ? strings.home.activity
                    : strings.home.sleep}
              </Text>
              <Image
                source={Images.Forward}
                resizeMode="contain"
                style={styles.forwardArrow}
              />
            </ShadowView>
          </TouchableOpacity>
        )}
      </View>

      {/**Show Gif on card */}
      {/******************Render Image with Caption ************/}
      {cardImg != null && cardData.img && cardData.img.length > 0 && (
        <View
          style={[
            tempStyle.cardImageContainer,
            { backgroundColor: "transparent", marginVertical: RFValue(10) },
          ]}
        >
          {cardData?.img[0]?.isGif ?
            <PlatGif
              url={`${imageBaseURL}${cardData.img[0].url}`}
              thumbnail={`${imageBaseURL}${cardData.img[0].thumbnail}`}
            />
            :

            <ImageElement
              resizeMethod="resize"
              source={{
                uri: `${imageBaseURL}${cardImg[0].url}`,
              }}
              resizeMode={"cover"}
              style={[
                tempStyle.cardImage,
                {
                  backgroundColor: 'red',
                  minHeight: 210,
                  //  overflow: "hidden",
                  backgroundColor: "transparent",
                },

              ]}
              isLoad={true}
            />}

        </View>
      )}

      <LikeElement
        cardDetails={cardData}
        onLikeClick={(type) => {
          onLikeClick({
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
};

const styles = StyleSheet.create({
  shadowWrapper: {
    borderWidth: 0.5,
    borderColor: DARK_GREEN,
    borderRadius: RFValue(10),
    flexDirection: 'row',
    paddingVertical: RFValue(10),
    marginTop: RFValue(40),
  },
  shadowWrapper2: {
    borderWidth: 0.5,
    borderColor: DARK_GREEN,
    borderRadius: RFValue(10),
    flexDirection: 'row',
    paddingVertical: RFValue(10),
    marginTop: RFValue(15),
  },
  trackerHeading: {
    width: '70%',
    fontFamily: FONTS.LIGHT,
    fontSize: RFValue(13),
    color: COLOR.LIGHT_BLACK,
    fontWeight: '600',
    alignSelf: 'center',
  },
  forwardArrow: {
    height: RFValue(14),
    tintColor: '#3E3E3F',
    width: '10%',
    alignSelf: 'center',
  },
});
export default TemplateFour;
