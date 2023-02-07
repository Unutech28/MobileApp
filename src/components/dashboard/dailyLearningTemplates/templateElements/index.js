import React, { useState, lazy, useCallback, useEffect } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { strings } from "@localization";
import * as Images from "@images";
import { useSelector, useDispatch } from "react-redux";
import tempStyle from "@components/dashboard/dailyLearningTemplates/globalTemplateStyle";
import RenderHtml from "react-native-render-html";
import Icon from "react-native-vector-icons/Entypo";
import CommnetIcon from "react-native-vector-icons/FontAwesome";
import EditIcon from "react-native-vector-icons/Feather";
import * as Animatable from "react-native-animatable";
import GLOBALS from "@constants";
const { FONTS, COLOR, STRINGS } = GLOBALS;
import Video from "react-native-video";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import ImageBlurLoading from "../../../../updatedNodeModules/react-native-image-blur-loading";
import FastImage from "react-native-fast-image";
/**Element for Image Loading */
const ImageElement = (props) => {
  const [opacity, setOpacity] = useState(new Animated.Value(0));
  const [imageLoading, setLoading] = useState(props.isLoad);
  return (
    <FastImage
      style={[{}, props.style]}
      {...props}
      onLoadStart={(e) => {
        setLoading(true);
      }}
      fallback={true}
      onProgress={(e) => {
        setLoading(true);
      }}
      onLoadEnd={(e) => {
        setLoading(false);
      }}
    >
      {imageLoading && (
        <FastImage
          style={[{ height: "100%" }]}
          source={require("../../../../assets/images/Loading.webp")}
        />
      )}
    </FastImage>
  );
};

/**Element for HTML Text */
const ShowHtmlText = (props) => {
  const { currentCard } = useSelector((state) => state.cardsReducer);
  return (
    <View testID={currentCard?._id ? currentCard?._id : "123"} {...props.style}>
      <RenderHtml {...props} tagsStyles={htmlStyle} />
    </View>
  );
};

/**Card Title */
const CardTitle = (props) => {
  const [opacity, setOpacity] = useState(new Animated.Value(0));
  const { currentCard } = useSelector((state) => state.cardsReducer);
  const onLoad = () => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };
  return (
    <Animated.Text
      testID={currentCard?._id ? currentCard?._id : "123"}
      onLoad={onLoad()}
      {...props}
      style={[
        {
          // opacity: opacity,
          // transform: [
          //     {
          //         scale: opacity.interpolate({
          //             inputRange: [0, 1],
          //             outputRange: [0.85, 1],
          //         })
          //     }
          // ]
        },
        props.style,
      ]}
    >
      {props.text}
    </Animated.Text>
  );
};

const LikeElement = (props) => {
  let { onLikeClick, isComment, hasComment, onCommentClick, cardDetails } =
    props;

  const [isLiked, changeLikeStatus] = useState(
    cardDetails && cardDetails.action && cardDetails.action?.like
      ? cardDetails.action?.like
      : 0
  );

  useEffect(() => {
    changeLikeStatus(
      cardDetails && cardDetails.action && cardDetails.action?.like
        ? cardDetails.action?.like
        : 0
    );
  }, [props.cardDetails]);

  const [isCommented, changeCommentStatus] = useState(hasComment);

  const onLikePress = () => {
    changeLikeStatus(isLiked == 0 ? 1 : 0);
    onLikeClick(!isLiked);
  };

  const onCommentPress = () => {
    changeCommentStatus(isCommented == 0 ? 1 : 0);
    //  onLikeClick(!isLiked);
  };

  return (
    <View
      style={{
        padding: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {cardDetails.hasComment && (
        <TouchableOpacity
          style={styles.commnetContainer}
          onPress={() => onCommentClick()}
        >
          <Text
            style={[
              styles.commnetText,
              {
                color:
                  cardDetails.action &&
                  cardDetails.action.usercomments &&
                  cardDetails?.action?.usercomments.length > 0
                    ? COLOR.DARK_GREEN
                    : COLOR.SOFT_GRAY,
              },
            ]}
          >
            {strings.cards.comment}
          </Text>
          <CommnetIcon
            name={"commenting"}
            size={30}
            color={
              cardDetails.action &&
              cardDetails.action.usercomments &&
              cardDetails?.action?.usercomments.length > 0
                ? COLOR.DARK_GREEN
                : COLOR.SOFT_GRAY
            }
            style={[styles.commentIcon]}
          />
        </TouchableOpacity>
      )}
      {cardDetails?.otherAttribute?.hasreflect && (
        <TouchableOpacity
          style={styles.commnetContainer}
          onPress={() => onCommentClick()}
        >
          <Text
            style={[
              styles.commnetText,
              {
                color:
                  cardDetails?.action?.usercomments.length > 0 > 0
                    ? COLOR.DARK_GREEN
                    : COLOR.SOFT_GRAY,
              },
            ]}
          >
            {strings.cards.reflect}
          </Text>
          <EditIcon
            name={"edit-2"}
            size={28}
            color={
              cardDetails.usercomments.length > 0
                ? COLOR.DARK_GREEN
                : COLOR.SOFT_GRAY
            }
            style={[styles.commentIcon]}
          />
        </TouchableOpacity>
      )}
      {cardDetails.hasLike && (
        <TouchableOpacity style={styles.likeContainer}>
          <Animatable.View
            animation="pulse"
            easing="ease-out"
            iterationCount="infinite"
            style={{
              width: "40%",
              alignSelf: "flex-end",
            }}
          >
            <TouchableOpacity onPress={() => onLikePress()}>
              <Icon
                name={isLiked ? "heart" : "heart-outlined"}
                size={60}
                color={isLiked ? COLOR.like_red : COLOR.DARK_GREEN}
                style={[
                  styles.heartIcon,
                  { shadowColor: isLiked ? COLOR.like_red : COLOR.DARK_GREEN },
                ]}
              />
            </TouchableOpacity>
          </Animatable.View>
        </TouchableOpacity>
      )}
    </View>
  );
};

/**Element for Video Rending */
const ShowVideos = (props) => {
  let { videoFiles, user_language } = props;
  return (
    <FlatList
      data={videoFiles}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      renderItem={({ item, index }) => (
        <View style={[tempStyle.cardImageContainer, { marginBottom: 10 }]}>
          <Text style={[tempStyle.videoTitle]}>
            {item.caption[user_language]
              ? item.caption[user_language]
              : item.caption["en"]}
          </Text>

          {Platform.OS === "ios" ? (
            <Video
              // bufferConfig={{
              //   minBufferMs: 1500,
              //   maxBufferMs: 5000,
              //   bufferForPlaybackMs: 250,
              //   bufferForPlaybackAfterRebufferMs: 500
              // }}
              resizeMode="cover"
              paused={true}
              controls={true}
              style={[tempStyle.backgroundVideo]}
              source={{ uri: item.name }}
            />
          ) : (
            <Video
              resizeMode="contain"
              paused={true}
              playInBackground={false}
              playWhenInactive={false}
              controls={true}
              style={[tempStyle.backgroundVideo]}
              source={{ uri: item.name }}
            />
            // <VideoPlayer
            //     source={{ uri: "https://file-examples-com.github.io/uploads/2017/04/file_example_MP4_480_1_5MG.mp4" }}
            //     showOnStart={true}
            //     toggleResizeModeOnFullscreen={true}
            //     controlAnimationTiming={3000}
            //     doubleTapTime={130}
            //     controlTimeout={35000}
            //     scrubbing={0}
            //     seekColor={COLOR.BACKGROUND_ORANGE}
            //     style={{ backgroundColor: COLOR.PRIMARY1 }}
            //     tapAnywhereToPause={true}
            //     paused={true}
            // />
          )}
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  heartIcon: {
    alignSelf: "flex-end",
    shadowColor: COLOR.like_red,
    shadowOpacity: 0.5,
    shadowRadius: 10,
    // iOS
    shadowOffset: {
      width: 0, // These can't both be 0
      height: 1, // i.e. the shadow has to be offset in some way
    },
    // Android
    shadowOffset: {
      width: 0, // Same rules apply from above
      height: 1, // Can't both be 0
    },
  },
  likeContainer: {
    flex: 1,
    alignSelf: "center",
    justifyContent: "center",
    //  backgroundColor: 'red',

    // width: 10,
    //  bottom: 10
    // justifyContent: 'flex-end'
  },
  commnetContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(119, 131, 143, 0.2)",
    borderRadius: 25,
    padding: 10,
    justifyContent: "center",
    flex: 1,
  },
  commentIcon: {},
  commnetText: {
    fontSize: 17,
    fontFamily: FONTS.MEDIUM,
    color: COLOR.BLACK,
    fontWeight: "600",
    paddingRight: RFValue(10),
  },
});
const htmlStyle = {
  p: {
    // textAlign: 'justify',
    color: COLOR.BLACK,
  },
};
export { ImageElement, ShowHtmlText, CardTitle, LikeElement, ShowVideos };
