import GLOBALS from "@constants";
import React, { useState, useEffect } from "react";
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Dimensions,
  Animated,
} from "react-native";
import { useDispatch } from "react-redux";
import { RFValue, RFPercentage } from "react-native-responsive-fontsize";
const { COLOR, STRINGS, FONTS } = GLOBALS;
import { Slider } from "react-native-elements";
import CustomButton from "../../../common/customButton";
import { strings } from "@localization";
import * as AppActions from "@actions";
import {
  ImageElement,
  ShowHtmlText,
  CardTitle,
  LikeElement,
} from "@components/dashboard/dailyLearningTemplates/templateElements";
import tempStyle from "@components/dashboard/dailyLearningTemplates/globalTemplateStyle";
const { width, height } = Dimensions.get("window");

const { DARK_GREEN, WHITE, BLACK } = COLOR;
const { LIGHT, REGULAR } = FONTS;

const SliderUI = ({
  setScale,
  getScale,
  maximumValue,
  minimumValue,
  isLabel,
  labelTextLeft,
  lebleTextRight,
}) => {
  const onSliderChange = (value) => {
    setScale(value);
  };
  return (
    <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
      <View style={{ flex: 0.2, marginRight: 5 }}>
        <Text style={styles.sliderValue}>
          {isLabel == "yes" ? labelTextLeft : minimumValue}
        </Text>
      </View>
      <View style={{ flex: 0.8, marginTop: RFValue(10) }}>
        <Slider
          value={getScale}
          onValueChange={(value) => onSliderChange(value)}
          maximumTrackTintColor={"#B1B1B1"}
          minimumTrackTintColor={DARK_GREEN}
          tintColor={DARK_GREEN}
          thumbTintColor={DARK_GREEN}
          minimumValue={minimumValue}
          maximumValue={maximumValue}
          thumbStyle={{
            height: RFValue(25),
            width: RFValue(25),
            borderRadius: RFValue(25),
            backgroundColor: WHITE,
            borderWidth: 10,
            borderColor: DARK_GREEN,
          }}
          thumbProps={{
            children: (
              <Text
                style={[
                  styles.sliderValue,
                  {
                    position: "absolute",
                    bottom: RFValue(20),
                    fontSize: RFValue(14),
                    width: RFValue(20),
                    right: RFValue(-3),
                  },
                ]}
              >
                {getScale !== undefined ? getScale?.toFixed(0) : null}
              </Text>
            ),
          }}
        />
      </View>
      <View style={{ flex: 0.2 }}>
        <Text style={styles.sliderValue}>
          {isLabel == "yes" ? lebleTextRight : maximumValue}
        </Text>
      </View>
    </View>
  );
};

function CommonTracker(props) {
  let { cardData, onSubmit, onLikeClick, onCommentClick, user_language } =
    props;
  const dispatch = useDispatch();
  const [data, setData] = useState([]);

  const setSleepScale = (index, key) => {
    console.log(index, key, "index, key...");
    let modify_option = data.map((item, i) => {
      if (i == index) {
        item.value = key;
      }
      return item;
    });
    setData(modify_option);
  };

  useEffect(() => {
    let array = [];
    /**Get user submitted response */
    let user_response = cardData?.action?.user_response
      ? cardData?.action?.user_response
      : [];

    if (
      cardData?.otherAttribute &&
      cardData?.otherAttribute?.options?.length > 0
    ) {
      cardData?.otherAttribute?.options.map((m) => {
        let matched_index = -1;
        matched_index = user_response.findIndex(
          (x) => x.tracker_id === m.tracker_id
        );
        array.push({
          title: m.trackerTitle,
          heading: m.trackerHeading,
          maximumValue: parseInt(m.maxValue),
          minimumValue: parseInt(m.minValue),
          value:
            matched_index > -1
              ? parseInt(user_response[matched_index].value)
              : parseInt(m.minValue),
          label: m.label,
          leftLabel: m.leftLabel,
          rightLabel: m.rightLabel,
          tracker_id: m.tracker_id,
        });
      });
    }
    setData(array);
  }, []);

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
  const onSaveTracker = () => {
    let param = {
      cardId: cardData?._id,
      action: { user_response: data },
      week: cardData.week,
      day: cardData.day,
    };
    onSubmit(param, cardData?.otherAttribute?.sendRes?.trim());
  };

  return (
    <ScrollView nestedScrollEnabled={true} style={styles.wrapper}>
      <View style={styles.outerBox}>
        <View style={{}}>
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

        <FlatList
          data={data}
          nestedScrollEnabled={true}
          keyExtractor={({ item, index }) => {
            item + index;
          }}
          contentContainerStyle={{ marginTop: RFValue(10) }}
          renderItem={({ item, index }) => {
            return (
              <View style={[styles.innerBox]}>
                <Text style={[styles.boxText, { color: "black" }]}>
                  {item.title}
                </Text>
                <Text style={[styles.boxText, { fontSize: RFValue(12) }]}>
                  {item.heading}
                </Text>
                <View style={styles.slider}>
                  <SliderUI
                    setScale={(val) => setSleepScale(index, val)}
                    getScale={
                      item.value != ""
                        ? parseInt(item.value)
                        : item.minimumValue
                    }
                    maximumValue={parseInt(item.maximumValue)}
                    minimumValue={parseInt(item.minimumValue)}
                    isLabel={item?.label}
                    labelTextLeft={item?.leftLabel}
                    lebleTextRight={item?.rightLabel}
                  />
                </View>
              </View>
            );
          }}
        />
        <View style={styles.buttonView}>
          <CustomButton
            text={strings.SleepTracker.add_tracking}
            colors={["#6545B2", "#6545B2", "#6545B2"]}
            onBtnPress={() => onSaveTracker()}
            buttonText={{ color: WHITE }}
          />
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
    </ScrollView>
  );
}
export default CommonTracker = React.memo(CommonTracker);

const styles = {
  wrapper: {
    flex: 1,
  },
  outerBox: {
    borderRadius: 20,
    marginBottom: 10,
    paddingHorizontal: RFValue(20),
    paddingBottom: RFValue(20),
    flex: 1,
  },
  innerBox: {
    backgroundColor: WHITE,
    padding: RFValue(10),
    marginVertical: RFValue(7),
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1.2,
    borderColor: DARK_GREEN,
    shadowColor: DARK_GREEN,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.46,
    shadowRadius: 11.14,
    elevation: 17,
  },
  boxText: {
    color: COLOR.DarkGray,
    fontWeight: "bold",
    fontSize: RFValue(16),
    textAlign: "center",
    fontFamily: REGULAR,
  },
  slider: {
    marginTop: RFValue(30),
    width: "100%",
    marginBottom: RFValue(20),
  },

  sliderValue: {
    textAlign: "center",
    fontSize: RFValue(15),
    fontWeight: "bold",
    fontFamily: REGULAR,
    color: COLOR.SliderColor,
  },
  buttonView: {
    marginTop: 20,
  },
  lbelValue: {
    fontSize: RFValue(10),
    fontWeight: "bold",
    fontFamily: REGULAR,
  },
  cardTitle: {
    fontSize: RFValue(25),
    fontFamily: FONTS.MEDIUM,
    color: COLOR.BLACK,
    marginTop: RFValue(25),
    marginBottom: RFValue(10),
    fontWeight: "700",
  },
};
