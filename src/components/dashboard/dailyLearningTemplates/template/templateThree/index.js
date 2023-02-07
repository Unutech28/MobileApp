import tempStyle from "@components/dashboard/dailyLearningTemplates/globalTemplateStyle";
import GLOBALS from "@constants";
import Icon from "react-native-vector-icons/FontAwesome5";
import React, { useEffect, useState } from "react";
import { RFValue } from "react-native-responsive-fontsize";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  UIManager,
  LayoutAnimation,
} from "react-native";
const { COLOR } = GLOBALS;
import {
  ImageElement,
  ShowHtmlText,
  CardTitle,
  LikeElement,
} from "@components/dashboard/dailyLearningTemplates/templateElements";
import PlatGif from "@components/common/PlayGif";

import * as AppActions from "@actions";
import { useSelector, useDispatch } from "react-redux";
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

function TemplateThree(props) {
  let { cardData, onLikeClick, onCommentClick, user_language, cardState } = props;
  const [cardDetails, updateCardData] = useState(cardData);
  const [imageBaseURL, setImageBaseURL] = useState(
    cardState?.imgBp ? cardState.imgBp : ""
  );
  const dispatch = useDispatch();

  // useEffect(state => {
  //   cardData?.otherAttribute?.options?.map(ele => {
  //     ele.isExpand = true;
  //   })
  // }, []);
  useEffect(() => {
    updateCardData(cardData)

  }, [cardData, cardDetails]);

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
  /**Handling of Check Box, radio Click event */
  const onItemClick = (array_index, option) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    //cardDetails.otherAttribute?.options?
    let modify_option = cardDetails?.otherAttribute?.questions?.map((o) => {
      if (option.ques_id == o.ques_id) {
        o.isExpand = !o.isExpand;
      } else {
        o.isExpand = false;
      }
      return o;
    });

    let final_data = Object.assign({}, cardDetails, {
      options: modify_option,
    });

    updateCardData({
      ...final_data,
    });
  };

  return (
    <View style={[tempStyle.outerContainer]}>
      <View style={{}}>
        <CardTitle
          style={tempStyle.cardTitle}
          // text={cardDetails.card_title ? cardDetails.card_title["en"] : "Motherhood"}
          text={cardData?.title ? cardData.title : ""}
        />
        {cardDetails.description ? (
          <ShowHtmlText
            style={styles.description}
            source={{
              // html: cardDetails.description["en"],
              html: cardData?.description ? cardData.description : "",
            }}
          />
        ) : null}

        <View>
          {cardDetails?.otherAttribute &&
            cardDetails.otherAttribute?.questions?.map((item, index) => {
              return (
                <View
                  style={[
                    tempStyle.expandContainer,
                    tempStyle.boxShadow,
                    {
                      backgroundColor: item.isExpand
                        ? COLOR.DARK_GREEN
                        : COLOR.WHITE,
                    },
                  ]}
                >
                  <TouchableOpacity
                    onPress={() => {
                      onItemClick(index, item);
                    }}
                    style={[tempStyle.expandContainerInner]}
                  >
                    <Text
                      style={[
                        tempStyle.expandHeading,
                        { color: item.isExpand ? COLOR.WHITE : COLOR.BLACK },
                      ]}
                    >
                      {item.questionTitle}
                    </Text>
                    <Icon
                      name={!item.isExpand ? "chevron-down" : "chevron-up"}
                      size={20}
                      color={item.isExpand ? COLOR.WHITE : COLOR.CIRCLE_GRAY}
                      style={{ alignSelf: "center" }}
                    />
                  </TouchableOpacity>
                  {item.isExpand && (
                    <View>
                      <ShowHtmlText
                        style={[tempStyle.cardDescription, tempStyle.quesFont]}
                        source={{
                          html: item.questionDesc,
                        }}
                      />
                    </View>
                  )}
                </View>
              );
            })}
        </View>
      </View>

      <View style={tempStyle.cardImageContainer}>
        {cardData.img && cardData.img.length > 0 ? (


          cardData?.img[0]?.isGif ?
            <PlatGif
              url={`${imageBaseURL}${cardData.img[0].url}`}
              thumbnail={`${imageBaseURL}${cardData.img[0].thumbnail}`}
            />
            :

            <ImageElement
              //  source={{ uri: cardDetails.image }}
              source={{
                uri: `${imageBaseURL}${cardData.img[0].url
                  }`,
              }}
              resizeMode="cover"
              style={tempStyle.cardImage}
            />
        ) : null}
      </View>
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
}

const styles = StyleSheet.create({
  description: {
    marginBottom: RFValue(30),
  },
});
export default (TemplateThree = React.memo(TemplateThree));
