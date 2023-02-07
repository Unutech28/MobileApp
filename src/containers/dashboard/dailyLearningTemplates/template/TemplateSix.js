/* eslint-disable prettier/prettier */
/* eslint-disable module-resolver/use-alias */
import GLOBALS from '@constants';
import * as AppActions from '@actions';
import React, { useState, lazy, useCallback, useEffect } from 'react';

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Platform, Dimensions
} from 'react-native';
const { FONTS, STRINGS, COLOR } = GLOBALS;
import { strings } from '@localization';
import { RFValue } from 'react-native-responsive-fontsize';
import { WebView } from 'react-native-webview';

import { connect, useSelector, useDispatch } from 'react-redux';
import tempStyle from '@components/dashboard/dailyLearningTemplates/globalTemplateStyle';
import Icon from 'react-native-vector-icons/AntDesign';
import ButtonBlue from '@components/common/buttonBlue';
import {
  ImageElement,
  ShowHtmlText,
  CardTitle,
  LikeElement,
} from '@components/dashboard/dailyLearningTemplates/templateElements';
import {
  userLanguage,
} from "@helpers/common";
import {
  getYoutubeId,
} from '@components/dashboard/dailyLearningTemplates/utilities';
import PlatGif from "@components/common/PlayGif";


function TemplateSix(props) {
  let {
    cardData,
    onSubmit,
    onCommentClick,
    cardState,
    showFullScreenVideo
  } = props;
  const { width, height } = Dimensions.get("window");
  const dispatch = useDispatch();
  const [question_array, setQuestionArray] = useState([]);
  const [freeSizeImg, setFreeSize] = useState(false);
  const videoPlayer = React.useRef();
  const [cardImg, setCardImg] = useState(null);
  const [imageBaseURL, setImageBaseURL] = useState(
    cardState?.imgBp ? cardState.imgBp : ""
  );
  const [videoBaseURL, setVideoBaseURL] = useState(
    cardState?.videoBp ? cardState.videoBp : ""
  );
  const [thumbBaseURL, setThumbBaseURL] = useState(
    cardState?.thumbnailBp ? cardState.thumbnailBp : ""
  );
  useEffect(() => {
    if (cardData.otherAttribute) {
      cardData.otherAttribute.freeSizeImg
        ? setFreeSize(cardData.otherAttribute.freeSizeImg)
        : setFreeSize(false);
    }
    let array = [];

    if (cardData.img != null) {
      if (cardImg == null) {
        setCardImg(cardData.img);
      } else if (cardImg != null && cardImg[0].url != cardData.img[0].url) {
        setCardImg(cardData.img);
      }

    }

    /**Get user submitted response */
    let user_response = cardData?.action?.user_response
      ? cardData?.action?.user_response
      : [];
    /*** Map user selected response and all options ***/
    if (
      cardData?.otherAttribute &&
      cardData?.otherAttribute?.questions?.length > 0
    ) {
      cardData?.otherAttribute?.questions.map((m) => {
        let matched_index = -1;
        matched_index = user_response.findIndex((x) => x.question_id === m.question_id);
        array.push({
          ...m,
          answer: matched_index > -1 ? user_response[matched_index].answer : ''
        });
      });
    }

    setQuestionArray(array);
  }, [cardData]);

  const yesNoBtnClicked = (text, array_index, obj) => {
    let modify_obj = question_array.map((m, inner_index) => {
      return (
        {
          ...m,
          answer: inner_index == array_index ? text : m.answer
        }
      )
    });
    setQuestionArray(modify_obj);

    let param = {
      cardId: cardData?._id,
      action: { user_response: modify_obj },
      week: cardData.week,
      day: cardData.day,
    };
    onSubmit(param, text == 'yes' ? obj.addYesRes?.trim() : obj.addNoRes?.trim());
  }

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
    <View style={[tempStyle.outerContainer, { flex: 1 }]}>
      <View style={{ flex: 1 }}>
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
      {/*Componet for Youtube player* */}
      {cardData?.ytLink && cardData?.ytLink?.length > 0 ? (
        <WebView
          nestedScrollEnabled={true}
          scrollEnabled={true}
          showsVerticalScrollIndicator={true}
          showsHorizontalScrollIndicator={true}
          style={[
            tempStyle.youtubeView,
            { zIndex: 100, opacity: 0.99, overflow: "hidden" },
          ]}
          originWhitelist={["*"]}
          allowsInlineMediaPlayback={true}
          source={{
            uri: `http://www.youtube.com/embed/${getYoutubeId(
              cardData?.ytLink
            )}?cc_lang_pref=${userLanguage()}&cc_load_policy=1`,
          }}
          onError={(err) => {
            if (err) {
              alertWithOneBtn("", strings.home.networkAlert, "").then(
                (res) => { }
              );
            }
          }}
        />
      ) :
        null}
      {/******************Render Video ************/}
      {cardData?.otherAttribute && cardData?.otherAttribute?.videos && cardData?.otherAttribute?.videos?.length > 0 ? (
        cardData.otherAttribute.videos.map(video => {
          return (
            <View
              style={[
                { paddingVertical: RFValue(10) },
              ]}
            >
              <Text>{video.videoTitle}</Text>
              <ImageElement
                resizeMethod="resize"
                source={{
                  uri: `${thumbBaseURL}${video?.thumbnail}`,
                }}
                resizeMode={"cover"}
                style={[
                  tempStyle.cardImage,
                  {
                    marginTop: RFValue(10),
                    minHeight: 200,
                    overflow: "hidden",
                    backgroundColor: COLOR.BLACK,
                  },
                ]}
                isLoad={true}
              />
              <View
                style={{
                  position: "absolute",
                  justifyContent: "center",
                  alignItems: "center",
                  bottom: Platform.OS == "android" ? 30 : "40%",
                  right: Platform.OS == "android" ? 30 : "45%",
                }}
              >
                <TouchableOpacity
                  onPress={() =>
                    showFullScreenVideo(`${videoBaseURL}${video.video}`)
                  }
                >
                  <Icon
                    color={COLOR.BOREDER_GRAY}
                    size={50}
                    name={"play"}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            </View>
          )
        })

      ) : null}
      {/******************Render Image with Caption ************/}
      {cardImg != null && cardData.img && cardData.img.length > 0 && (
        <View
          style={[
            tempStyle.cardImageContainer,
            { backgroundColor: "transparent" },
          ]}
        >
          {
            cardData?.img[0]?.isGif ?
              <PlatGif
                url={`${imageBaseURL}${cardData.img[0].url}`}
                thumbnail={`${imageBaseURL}${cardData.img[0].thumbnail}`}
              />
              :
              <ImageElement
                resizeMode={freeSizeImg ? "contain" : "cover"}
                source={{
                  uri: `${imageBaseURL}${cardImg[0].url}`,
                }}

                style={[
                  freeSizeImg ? styles.cardImageforFreeSize : tempStyle.cardImage,
                  {
                    minHeight: 210,
                    overflow: "hidden",
                    backgroundColor: "transparent",
                  },

                ]}
                isLoad={true}
              />
          }


        </View>
      )}

      {question_array.map((ques_data, array_index) => {
        return (
          <View style={{ width: '100%', marginVertical: RFValue(10), }}>
            <Text
              style={[
                styles.blackText,
                { marginTop: RFValue(0), alignSelf: 'flex-start' },
              ]}>
              {ques_data.addQues
              }
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View style={{ flex: 1, marginRight: RFValue(10) }}>
                <ButtonBlue
                  txtColor={
                    ques_data?.answer == 'no'
                      ? COLOR.SOFT_GRAY
                      : ques_data?.answer == 'yes'
                        ? COLOR.WHITE
                        : COLOR.SOFT_GRAY
                  }
                  customColor={
                    ques_data?.answer == 'no'
                      ? COLOR.WHITE
                      : ques_data?.answer == 'yes'
                        ? COLOR.DARK_GREEN
                        : COLOR.WHITE
                  }
                  text={strings.cards.yes}
                  customStyle={{
                    borderWidth: 1,
                    borderColor: COLOR.DARK_GREEN,
                  }}
                  onBtnPress={() => yesNoBtnClicked('yes', array_index, ques_data)}
                />
              </View>
              <View style={{ flex: 1, marginLeft: RFValue(10) }}>
                <ButtonBlue
                  customStyle={{
                    borderWidth: 1,
                    borderColor: COLOR.DARK_GREEN,
                  }}
                  customColor={
                    ques_data?.answer == 'no' ? COLOR.DARK_GREEN : COLOR.WHITE
                  }
                  txtColor={
                    ques_data?.answer == 'no' ? COLOR.WHITE : COLOR.SOFT_GRAY
                  }
                  text={strings.cards.no}
                  onBtnPress={() => yesNoBtnClicked('no', array_index, ques_data)}
                />
              </View>
            </View>
          </View>
        )
      })}

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
          if (videoPlayer && videoPlayer.current) {
            videoPlayer.current.setNativeProps({ paused: true });
          }
          onCommentPress();
        }}
      />
    </View>
  );
}
export default (TemplateSix = React.memo(TemplateSix));

const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
  },
  roundedBtnView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLOR.LIGHT_GRAY,
    shadowColor: COLOR.SHADOW,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    padding: RFValue(10),
    elevation: 5,
    borderRadius: RFValue(15),
    marginBottom: RFValue(15),
    alignItems: 'center',
  },
  expandableVw: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    //  backgroundColor: 'red',
    margin: 10,
  },
  linkText: {
    flex: 1,
    fontSize: RFValue(17),
    fontFamily: FONTS.CIRCULAR_MEDIUM,
    color: COLOR.BACKGROUND_ORANGE,
  },
  linkVw: {
    flexDirection: 'row',
    width: '100%',
    //backgroundColor :'red',
    marginBottom: RFValue(16),
    alignItems: 'center',
  },
  imageContainer: { justifyContent: 'center', marginHorizontal: 15 },
  roundBtnText: {
    fontSize: RFValue(16),
    alignSelf: 'flex-start',
    fontFamily: FONTS.MEDIUM,
    paddingVertical: 8,
    color: COLOR.SOFT_GRAY,
    fontWeight: '700',
  },
  checkDesctiopn: {
    fontFamily: FONTS.MEDIUM,
    color: COLOR.SOFT_GRAY,
    fontWeight: '400',
    fontSize: RFValue(13),
  },
  checkImage: {
    marginRight: 4,
  },
  blackText: {
    fontSize: RFValue(16),
    fontFamily: FONTS.CIRCULAR_MEDIUM,
    color: COLOR.BLACK,
    marginTop: RFValue(20),
    textAlign: 'left',
  },
  shadowWrapper: {
    borderWidth: 0.5,
    borderColor: COLOR.DARK_GREEN,
    borderRadius: RFValue(10),
    flexDirection: 'row',
    paddingVertical: RFValue(10),
    //  marginTop: RFValue(40),
  },
  forwardArrow: {
    height: RFValue(14),
    tintColor: '#3E3E3F',
    width: '10%',
    alignSelf: 'center',
  },
  trackerHeading: {
    width: '70%',
    fontFamily: FONTS.LIGHT,
    fontSize: RFValue(13),
    color: COLOR.LIGHT_BLACK,
    fontWeight: '600',
    alignSelf: 'center',
  },
  cardImageforFreeSize: {
    borderRadius: RFValue(10),
    width: "100%",
    height: "100%",
    // minHeight: RFValue(190),
    // maxHeight: RFValue(200),

    borderRadius: RFValue(10),
  },
});
