import Loader from "@components/common/screenLoader";
import tempStyle from "@components/dashboard/dailyLearningTemplates/globalTemplateStyle";
import GLOBALS from "@constants";
import * as Images from "@images";
import React, { useState, lazy, useCallback, useEffect } from "react";
const { FONTS, COLOR, STRINGS } = GLOBALS;
import { RFValue } from "react-native-responsive-fontsize";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Dimensions,
} from "react-native";
import * as AppActions from "@actions";
import {
  CardTitle,
  LikeElement,
} from "@components/dashboard/dailyLearningTemplates/templateElements";
import { useSelector, useDispatch } from "react-redux";
const { height } = Dimensions.get("window");
function TemplateEight(props) {
  let { cardData, onLikeClick, onCommentClick, user_language } = props;
  const dispatch = useDispatch();
  const reducerData = useSelector((state) => {
    return state;
  });
  const [showLoader, setShowLoader] = useState(true);
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
    <ImageBackground
      source={Images.template_banner}
      resizeMode="cover"
      style={{
        flex: 1,
        height: Platform.OS == "ios" ? "100%" : height / 1.3,
        marginTop: Platform.OS == "ios" ? RFValue(10) : RFValue(25),
      }}
      onLoad={() => setShowLoader(false)}
    >
      <View style={{ flex: 1, marginTop: 20 }}>
        {showLoader ? (
          <Loader />
        ) : (
          <>
            <View style={[tempStyle.outerContainer, { backgroundColor: "transparent" }]}>
              <View>
                <CardTitle
                  style={[
                    tempStyle.cardTitle,
                    tempStyle.titleMargin,
                    { color: "white" },
                  ]}
                  text={cardData?.title ?
                    cardData.title : ''}
                />
                <Text style={styles.quoteText}>{cardData?.otherAttribute?.quotes}</Text>
              </View>
            </View>

            <View style={{ padding: 10 }}>
              {/* <LikeElement
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
              /> */}
            </View>
          </>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  buttonTextStyle: {
    color: COLOR.PRIMARY,
    fontFamily: FONTS.BOLD,
  },
  previous: {
    flex: 1,
    marginHorizontal: 5,
    height: RFValue(45),
    width: "100%",
    borderRadius: RFValue(5),
    alignItems: "center",
    justifyContent: "center",
    marginTop: RFValue(10),
    borderColor: COLOR.DARK_GREEN,
    borderWidth: 1,
    //  backgroundColor: isDisabled ? GREY : PRIMARY,
  },
  buttonText: {
    fontSize: RFValue(14),
    color: COLOR.SOFT_GRAY,
    textTransform: "uppercase",
    fontFamily: FONTS.BOLD,
    textAlign: "center",
  },

  quoteText: {
    fontFamily: FONTS.LIGHT,
    fontWeight: "500",
    fontSize: 23,
    marginTop: "8%",
    color: COLOR.WHITE,

  },
});
export default (TemplateEight = React.memo(TemplateEight));
