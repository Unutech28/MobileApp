import tempStyle from "@components/dashboard/dailyLearningTemplates/globalTemplateStyle";
import GLOBALS from "@constants";
import * as ICONS from "@images";
import React, { useState, useEffect } from "react";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { WebView } from "react-native-webview";
import ButtonNew from "@components/common/buttonNew";
import FastImage from "react-native-fast-image";
import {
  alertWithTwoBtn,
  alertWithOneBtn,
  userLanguage,
} from "@helpers/common";

import {
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  ActivityIndicator,
  Linking,
  ScrollView,
} from "react-native";
import { Slider } from "@miblanchard/react-native-slider";
const { FONTS, COLOR } = GLOBALS;
import * as AppActions from "@actions";
// import convertToProxyURL from "react-native-video-cache";
import { strings } from "@localization";
import {
  ImageElement,
  ShowHtmlText,
  CardTitle,
  LikeElement,
} from "@components/dashboard/dailyLearningTemplates/templateElements";
import Icon from "react-native-vector-icons/AntDesign";
import Video from "react-native-video";
import { useSelector, useDispatch } from "react-redux";
// import YouTube from "react-native-youtube";
import { getYoutubeId, minutesAndSeconds } from "../../utilities";
import PlatGif from "@components/common/PlayGif";
const { width, height } = Dimensions.get("window");
function TemplateOne(props) {
  let {
    cardData,
    onLikeClick,
    onCommentClick,
    user_language,
    showFullScreenVideo,
    cardState,
  } = props;
  const [freeSizeImg, setFreeSize] = useState(false);
  const [imageCaption, setCaption] = useState("");
  const [imagePosition, setPosition] = useState("bottom");

  /** Set Base URL of media path starts */
  const [imageBaseURL, setImageBaseURL] = useState(
    cardState?.imgBp ? cardState.imgBp : ""
  );
  const [thumbBaseURL, setThumbBaseURL] = useState(
    cardState?.thumbnailBp ? cardState.thumbnailBp : ""
  );
  const [videoBaseURL, setVideoBaseURL] = useState(
    cardState?.videoBp ? cardState.videoBp : ""
  );
  const [audioBaseURL, setAudioBaseURL] = useState(
    cardState?.audioBp
      ? cardState.audioBp
      : "https://mscuriostorage.blob.core.windows.net/allimages/content/audio/"
  );
  /** ...Set Base URL of media path ends.... */
  const [currentPosition, setCurrentPosition] = useState(0);
  const [totalLength, setTotalLength] = useState(1);
  const [isPlayingAudio, togglePlayAudio] = useState(false);
  const [isPlayingVideo, togglePlayVideo] = useState(true);
  const [videoLoading, setVideoLoading] = useState(false);

  const [cardVideo, setCardVideo] = useState([]);
  const [showPoster, setShowPoster] = useState(true);

  const [cardImg, setCardImg] = useState(null);
  const [cardAudio, setCardAudio] = useState([]);
  const [cardGif, setCardGif] = useState(null);

  const elapsed = minutesAndSeconds(currentPosition);
  const remaining = minutesAndSeconds(totalLength - currentPosition);
  const audioPlayer = React.useRef();
  const videoPlayer = React.useRef();
  const dispatch = useDispatch();
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

  useEffect(() => {
    /**Manage FreeSize, Image caption and position */
    if (cardData.otherAttribute) {
      cardData.otherAttribute.freeSizeImg
        ? setFreeSize(cardData.otherAttribute.freeSizeImg)
        : setFreeSize(false);
      cardData.otherAttribute.imageCaption
        ? setCaption(cardData.otherAttribute.imageCaption)
        : setCaption("");
      cardData.otherAttribute.imagePosition
        ? setPosition(cardData.otherAttribute.imagePosition)
        : setPosition("bottom");
    }
    // setShowPoster(true);

    /**Card Image Handling of Rerendring */
    if (cardData.img != null) {
      if (cardImg == null) {
        setCardImg(cardData.img);
      } else if (cardImg != null && cardImg[0].url != cardData.img[0].url) {
        setCardImg(cardData.img);
      }
    } else {
      setCardImg(null);
    }
    console.log(cardData.otherAttribute.imageCaption, imageCaption);
  }, [cardData]);
  const setDuration = (data) => {
    setTotalLength(Math.floor(data?.duration));
  };

  const setTime = (data) => {
    setCurrentPosition(Math.floor(data?.currentTime));
    if (totalLength == Math.floor(data?.currentTime)) {
      togglePlayAudio(false);
    }
  };

  const handleControl = (type) => {
    switch (type) {
      case "play":
        togglePlayAudio(!isPlayingAudio);
        if (totalLength == currentPosition) {
          audioPlayer.current.seek(0);
        }
        break;
      case "rewind_back":
        if (
          audioPlayer.current != undefined &&
          currentPosition < 10 &&
          isPlayingAudio
        ) {
          audioPlayer.current && audioPlayer.current.seek(0);
          togglePlayAudio(false);
          setTimeout(() => {
            setCurrentPosition(0);
            togglePlayAudio(true);
          }, 100);
        } else {
          if (audioPlayer.current != undefined) {
            audioPlayer.current.seek(currentPosition - 10);
            setCurrentPosition(currentPosition - 10);
          }
        }
        break;
      case "rewind_forward":
        if (audioPlayer.current != undefined && isPlayingAudio) {
          audioPlayer.current && audioPlayer.current.seek(currentPosition + 10);
          togglePlayAudio(false);
          setTimeout(() => {
            setCurrentPosition(currentPosition + 10);
            togglePlayAudio(true);
          }, 100);
        }
        break;

      default:
        break;
    }
  };

  const seek = (time) => {
    time = Math.round(time);
    audioPlayer.current && audioPlayer.current.seek(time);
    setCurrentPosition(time);
    togglePlayAudio(true);
  };
  return (
    <View
      style={[
        tempStyle.outerContainer,
        cardData.webUrl ? { paddingHorizontal: 0 } : null,
        { minHeight: height / 1.2, backgroundColor: "white" },
      ]}
    >
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

      {/******************Render Video ************/}
      {cardData.video?.length > 0 ? (
        <View
          style={[
            //  tempStyle.cardImageContainer,
            { backgroundColor: "transparent" },
          ]}
        >
          <ImageElement
            resizeMethod="resize"
            source={{
              uri: `${thumbBaseURL}${cardData.video[0]?.thumbnail}`,
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
                showFullScreenVideo(`${videoBaseURL}${cardData.video[0]?.url}`)
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
      ) : null}

      {/*Componet for Audio player* */}
      {cardData.audio && cardData.audio.length > 0 && (
        <View style={[tempStyle.cardImageContainer, {}]}>
          <Video
            ref={(ref) => (audioPlayer.current = ref)}
            audioOnly={true}
            style={tempStyle.audioElement}
            playInBackground={true}
            playWhenInactive={true}
            ignoreSilentSwitch={"ignore"}
            paused={!isPlayingAudio}
            resizeMode="cover" // Fill the whole screen at aspect ratio.
            repeat={false} // Repeat forever.
            onLoad={setDuration.bind(this)}
            onProgress={setTime.bind(this)} // Callback every ~250ms with currentTime
            source={{
              uri: `${audioBaseURL}${cardData.audio[0].url}`,
            }}
          />

          <View style={{ width: "100%" }}>
            <Slider
              onSlidingStart={() => togglePlayAudio(false)}
              onSlidingComplete={seek.bind(this)}
              trackStyle={styles.track}
              value={currentPosition}
              maximumTrackTintColor={COLOR.progressBarColor}
              minimumTrackTintColor={COLOR.PRIMARY}
              thumbStyle={styles.thumb}
              maximumValue={Math.max(totalLength, 1, currentPosition + 1)}
              animateTransitions={true}
              useNativeDriver={true}
            />
            <View style={styles.audioCOntaine}>
              <Text style={[styles.audioTime]}>
                {elapsed[0] + ":" + elapsed[1]}
              </Text>

              <Text style={[styles.audioTime]}>
                {totalLength > 1 && "-" + remaining[0] + ":" + remaining[1]}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 5,
              }}
            >
              <TouchableOpacity
                disabled={
                  parseInt(elapsed[0]) >= 1 || parseInt(elapsed[1]) >= 10
                    ? false
                    : true
                }
                onPress={() => {
                  handleControl("rewind_back");
                  console.log(parseInt(elapsed[0]));
                }}
              >
                <Image
                  resizeMode="cover"
                  style={{
                    tintColor:
                      parseInt(elapsed[0]) >= 1 || parseInt(elapsed[1]) >= 10
                        ? "black"
                        : "grey",
                    height: 30,
                    width: 30,
                  }}
                  source={ICONS.Rewind}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{ alignItems: "center", marginHorizontal: 30 }}
                onPress={() => handleControl("play")}
              >
                <Icon
                  size={30}
                  name={isPlayingAudio ? "pausecircle" : "play"}
                  resizeMode="contain"
                  style={styles.heartImage}
                />
              </TouchableOpacity>
              <TouchableOpacity
                disabled={
                  parseInt(remaining[0]) > 1 || parseInt(remaining[1]) > 10
                    ? false
                    : true
                }
                onPress={() => handleControl("rewind_forward")}
                // disabled={false}
              >
                <Image
                  resizeMode="cover"
                  style={{
                    tintColor:
                      parseInt(remaining[0]) > 1 || parseInt(remaining[1]) > 10
                        ? "black"
                        : "grey",
                    height: 30,
                    width: 30,
                  }}
                  source={ICONS.ForwardPlay}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/******************Render Image with Caption ************/}
      {cardImg != null && cardData.img && cardData.img.length > 0 && (
        <View
          style={[
            // tempStyle.cardImageContainer,
            { backgroundColor: "transparent", matginTop: RFValue(10) },
          ]}
        >
          {cardData?.img[0]?.isGif ? (
            <PlatGif
              url={`${imageBaseURL}${cardData.img[0].url}`}
              thumbnail={`${imageBaseURL}${cardData.img[0].thumbnail}`}
            />
          ) : (
            <ImageElement
              resizeMethod="resize"
              source={{
                uri: `${imageBaseURL}${cardImg[0].url}`,
              }}
              resizeMode={"contain"}
              style={[
                // freeSizeImg ? styles.cardImageforFreeSize : tempStyle.cardImage,
                tempStyle.cardImage,
                {
                  minHeight: 210,
                  overflow: "hidden",
                  backgroundColor: "transparent",
                },
                imagePosition == "middle" ? { height: "40%" } : {},
              ]}
              isLoad={true}
            />
          )}
          {imageCaption ? (
            <ShowHtmlText
              contentWidth={width}
              source={{
                html: imageCaption ? imageCaption : "",
              }}
            />
          ) : null}
        </View>
      )}

      {/*Componet for Youtube player* */}
      {cardData?.ytLink && cardData?.ytLink?.length > 0 ? (
        <View>
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
                  (res) => {}
                );
              }
            }}
          />
        </View>
      ) : // <WebView
      //   nestedScrollEnabled={true}
      //   startInLoadingState={true}
      //   showsVerticalScrollIndicator={true}
      //   showsHorizontalScrollIndicator={true}
      //   //allowsFullscreenVideo={true}
      //   androidHardwareAccelerationDisabled={true}
      //   javaScriptEnabled={true}
      //   scrollEnabled={false}
      //   originWhitelist={["*"]}
      //   allowsInlineMediaPlayback={true}
      //   // style={[
      //   //   tempStyle.youtubeView,
      //   //   { zIndex: 100, opacity: 0.99, overflow: "hidden" },
      //   // ]}
      //   style={{
      //     zIndex: 100,
      //     height: height / 1.5,
      //     borderRadius: 6,
      //     backgroundColor: COLOR.LIGHT_SHADOW_GREEN,
      //     opacity: 0.99,
      //     overflow: "hidden",
      //   }}
      //   // source={{
      //   //   uri: `http://www.youtube.com/embed/${getYoutubeId(
      //   //     cardData?.ytLink
      //   //   )}?cc_lang_pref=${userLanguage()}&cc_load_policy=1`,
      //   // }}
      //   source={{ uri: cardData.webUrl }}
      // />
      null}

      {/*Component for Bottom Note* */}
      {cardData.bottom_note ? (
        <ShowHtmlText
          contentWidth={width}
          source={{
            html: cardData?.bottom_note ? cardData.bottom_note : "",
          }}
        />
      ) : null}

      {/******************Render Web URL ************/}
      {cardData.webUrl && cardData.webUrl != null ? (
        <WebView
          nestedScrollEnabled={true}
          scrollEnabled={true}
          showsVerticalScrollIndicator={true}
          showsHorizontalScrollIndicator={true}
          style={{
            zIndex: 100,
            height: height / 1.5,
            borderRadius: 6,
            backgroundColor: COLOR.LIGHT_SHADOW_GREEN,
            opacity: 0.99,
            overflow: "hidden",
          }}
          originWhitelist={["*"]}
          allowsInlineMediaPlayback={true}
          source={{ uri: cardData.webUrl }}
          onError={(err) => {
            if (err) {
              alertWithOneBtn("", strings.home.networkAlert, "").then(
                (res) => {}
              );
            }
          }}
        />
      ) : null}

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
          if (videoPlayer && videoPlayer.current) {
            videoPlayer.current.setNativeProps({ paused: true });
          }
          onCommentPress();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white", //COLOR.BACKGROUND,
    flexGrow: 1,
  },
  scene: {
    flex: 1,
    padding: RFValue(10),
  },
  blueText: {
    fontSize: RFValue(20),
    fontFamily: FONTS.CIRCULAR_BOLD,
    color: COLOR.PRIMARY1,
    textAlign: "center",
    marginTop: RFValue(30),
    width: "80%",
  },
  blackText: {
    fontSize: RFValue(16),
    fontFamily: FONTS.CIRCULAR_MEDIUM,
    color: COLOR.BLACK,
    marginTop: RFValue(20),
    textAlign: "left",
  },
  cardTouchableStyle: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: RFValue(24),
  },
  imageBackgroundStyle: {
    width: RFPercentage(45),
    alignItems: "center",
    justifyContent: "center",
  },
  imageViewStyle: {
    position: "absolute",
    width: RFPercentage(45),
    borderRadius: 10,
    borderColor: "transparent",
    flex: 1,
    flexDirection: "row",
  },
  textViewStyle: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  imageTextStyle: {
    color: COLOR.WHITE,
    fontSize: RFValue(16),
    fontFamily: FONTS.REGULAR,
    fontWeight: "bold",
  },
  descriptionViewStyle: {
    width: RFPercentage(45),
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    opacity: 0.9,
    padding: RFValue(8),
  },
  backgroundVideo: {
    height: 200,
    width: "100%",
  },
  likeCommentVw: {
    marginTop: RFValue(20),
    backgroundColor: "rgba(119, 131, 143, 0.2)",
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: RFValue(40),
    borderRadius: RFValue(20),
    padding: RFValue(8),
    justifyContent: "space-between",
  },
  thumb: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLOR.WHITE,
    borderColor: COLOR.LIGHT_SHADOW_GREEN,
    borderWidth: 2,
    shadowColor: COLOR.PRIMARY,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    shadowOpacity: 0.35,
  },
  track: {
    height: 5,
    marginHorizontal: 5,
    borderRadius: 4,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 1,
    shadowOpacity: 0.15,
  },
  audioTime: {
    color: COLOR.BLACK,
    fontSize: RFValue(14),
    fontFamily: FONTS.REGULAR,
    fontWeight: "bold",
  },
  audioCOntaine: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  cardImageContainer: {
    width: "100%",
    // height: RFValue(180),
    alignItems: "center",
    //justifyContent: 'center',
    //alignItems: 'center',
    borderRadius: RFValue(10),
    //  flex: 1,
    justifyContent: "center",
  },
  cardImage: {
    borderRadius: RFValue(10),
    width: "100%",
    // height: "100%",
    minHeight: RFValue(190),
    maxHeight: RFValue(200),
    borderRadius: RFValue(10),
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
export default TemplateOne = React.memo(TemplateOne);
