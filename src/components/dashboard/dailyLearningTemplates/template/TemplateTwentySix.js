import tempStyle from "@components/dashboard/dailyLearningTemplates/globalTemplateStyle";
import GLOBALS from "@constants";
import * as ICONS from "@images";
import React, { useState, useEffect } from "react";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { WebView } from "react-native-webview";
import ButtonNew from "@components/common/buttonNew";
import FastImage from "react-native-fast-image";
import { alertWithTwoBtn, alertWithOneBtn } from "@helpers/common";
import IoniIcon from "react-native-vector-icons/Ionicons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
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
  Keyboard,
  LayoutAnimation,
  FlatList,
  TextInput,
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

import { useSelector, useDispatch } from "react-redux";
const { width, height } = Dimensions.get("window");
import Icon from "react-native-vector-icons/FontAwesome5";
function TemplateTwentySix(props) {
  let { cardData, onCommentClick, onSubmit } = props;
  const [options, setOptions] = useState([]);
  const [temp, setTemp] = useState(0);
  const [search_txt, setSearch] = useState("");
  const dispatch = useDispatch();
  const videoPlayer = React.useRef();
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
    /***Customise Option Data ****/
    let array = [];

    /**Get user submitted response */
    let user_response = cardData?.action?.user_response
      ? cardData?.action?.user_response
      : [];

    let userInputOptions = user_response.filter((x) => x.type == "other");

    /*** Map user selected response and all options ***/
    if (
      cardData?.otherAttribute &&
      cardData?.otherAttribute?.options?.length > 0
    ) {
      cardData?.otherAttribute?.options.map((m, index) => {
        let matched_index = -1;
        matched_index = user_response.findIndex(
          (x) => x.content_id === m.content_id
        );

        array.push({
          ...m,
          header_id:
            matched_index > -1 ? user_response[matched_index].header_id : "",
          assessment_data:
            matched_index > -1
              ? user_response[matched_index].assessment_data
              : "",
        });
      });
    }
    Array.prototype.push.apply(array, userInputOptions);

    setOptions(array);
  }, [cardData]);

  /*****Toggle plus cross icon of each option****/
  const toggleOptions = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTemp(temp + 1);
    let data = options;
    data.map((item, i) => {
      if (i == index) {
        item.selected = !item?.selected;
      } else {
        item.selected = false;
      }
    });
    setOptions(data);
  };

  /**Show color box for selecting option */
  const RenderBox = (i, item, colorIndex) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setAnswer(i, item, colorIndex);
        }}
        style={[
          styles.colorBox,
          { backgroundColor: boxBackgroundColor(colorIndex) },
        ]}
      />
    );
  };

  /** Render Options in List */
  const OptionsComp = (item, i) => {
    return (
      <View
        style={[
          styles.options,
          {
            borderColor: boxBackgroundColor(item.header_id),
            borderWidth: item.header_id !== "" ? 3 : 0,
          },
        ]}
      >
        <Text style={styles.optionText}>{item?.contentData}</Text>
        <View style={styles.buttonView}>
          <TouchableOpacity
            hitSlop={{ right: 10, left: 10, top: 10, bottom: 10 }}
            onPress={() => toggleOptions(i)}
          >
            <Icon name={"plus"} size={20} color={COLOR.DARK_GREEN} />
          </TouchableOpacity>
        </View>
        {item?.selected && (
          <View style={[styles.optionsColor]}>
            <View style={{ flexDirection: "row" }}>
              <FlatList
                data={cardData?.otherAttribute?.contents}
                keyExtractor={(index) => index}
                renderItem={({ value, index }) => {
                  return (
                    <>
                      {RenderBox(index, item, index)}
                      {cardData?.otherAttribute?.contents &&
                        cardData?.otherAttribute?.contents.length == 1 && (
                          <TouchableOpacity
                            onPress={() => {
                              removeSelected(item);
                            }}
                            style={[
                              styles.colorBox,
                              {
                                borderWidth: 1,
                                backgroundColor: "transparent",
                              },
                            ]}
                          />
                        )}
                    </>
                  );
                }}
                horizontal={true}
                contentContainerStyle={{ marginRight: RFValue(35) }}
              />
            </View>

            <View style={styles.buttonView}>
              <TouchableOpacity
                hitSlop={{ right: 10, left: 10, top: 10, bottom: 10 }}
                onPress={() => toggleOptions(i)}
              >
                <Icon name={"times"} size={20} color={COLOR.BLACK} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  };
  const boxBackgroundColor = (order) => {
    if (order === 0) {
      return COLOR.YELLOW;
    }
    if (order === 1) {
      return COLOR.DARK_GREEN;
    }
    if (order === 2) {
      return COLOR.BUTTON_ORANGE;
    }
    if (order === 3) {
      return COLOR.CIRCLE_GRAY;
    }
  };
  /**To show dynamic headers view  */
  const getDynamicHeaders = (item, order) => {
    return (
      <View
        style={[
          styles.headings,
          { backgroundColor: boxBackgroundColor(order) },
        ]}
      >
        <ShowHtmlText
          source={{
            html: item.assessmentBox,
          }}
        />
      </View>
    );
  };

  /**Set answer by clicking on color.. */
  const setAnswer = (index, value, colorIndex) => {
    /**Add corresonding header value to selected option */
    let header_id = cardData?.otherAttribute.contents[colorIndex].assesment_id;
    let selected_option_index = options?.findIndex(
      (x) => x.content_id === value.content_id
    );
    let modified_option = Object.assign([], options, {
      [selected_option_index]: {
        ...value,
        header_id: colorIndex,
        selected: false,
        assessment_data: cardData?.otherAttribute.contents[colorIndex],
        assessment_id: header_id,
      },
    });
    setOptions(modified_option);
  };

  const onItemAdded = () => {
    Keyboard.dismiss();
    let header_id = cardData?.otherAttribute.contents[0].assesment_id;
    let array = [...options];
    array.push({
      header_id: 0,
      selected: false,
      assessment_data: cardData?.otherAttribute.contents[0],
      assessment_id: header_id,
      contentData: search_txt,
      content_id: header_id,
      type: "other",
    });
    setOptions(array);
    setSearch("");
    let param = {
      cardId: cardData?._id,
      action: { user_response: options },
      week: cardData.week,
      day: cardData.day,
    };
  };

  /**Remove selected value.. */
  const removeSelected = (value) => {
    let selected_option_index = options?.findIndex(
      (x) => x.content_id === value.content_id
    );
    let modified_option = Object.assign([], options, {
      [selected_option_index]: {
        ...value,
        header_id: "",
        selected: false,
        assessment_data: "",
      },
    });
    setOptions(modified_option);
  };

  const _onSaveClick = () => {
    let checkSomeselected = options.some((v) => v.assessment_data != "");
    if (checkSomeselected) {
      let param = {
        cardId: cardData?._id,
        action: { user_response: options },
        week: cardData.week,
        day: cardData.day,
      };
      onSubmit(param, cardData?.otherAttribute?.feedbackMessage.trim());
    } else {
      alertWithOneBtn(strings.cards.validation_perform);
    }
  };
  return (
    <KeyboardAwareScrollView
      enableAutomaticScroll={true}
      keyboardShouldPersistTaps={"handled"}
      enableOnAndroid={true}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{}}
      nestedScrollEnabled={true}
      extraScrollHeight={100}
    >
      <View style={[tempStyle.outerContainer]}>
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
        <View style={styles.headingView}>
          {cardData?.otherAttribute?.contents?.map((item, index) => {
            return getDynamicHeaders(item, index);
          })}
        </View>

        {cardData?.otherAttribute?.contents &&
          cardData?.otherAttribute?.contents.length == 1 && (
            <View style={[styles.panPointView, {}]}>
              <View style={[styles.panView]}>
                <TextInput
                  placeholder={"Type your nurturing activity here... "}
                  style={[styles.queTextInputStyle, {}]}
                  value={search_txt}
                  maxLength={2000}
                  underlineColorAndroid={"transparent"}
                  placeholderTextColor={COLOR.BLACK}
                  onChangeText={(text) => {
                    setSearch(text);
                  }}
                />
              </View>
              <View>
                <TouchableOpacity
                  disabled={search_txt.trim() == "" ? true : false}
                  onPress={() => onItemAdded()}
                  style={styles.addButton}
                >
                  <IoniIcon
                    name={"add-circle"}
                    size={RFValue(30)}
                    color={
                      search_txt.trim() == "" ? COLOR.PRIMARY : COLOR.DarkGray
                    }
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}

        <View>
          {options.map((item, index) => {
            return OptionsComp(item, index);
          })}
        </View>

        <View style={tempStyle.submitContainer}>
          <ButtonNew
            text={strings.cards.submit}
            onBtnPress={() => _onSaveClick()}
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
          if (videoPlayer && videoPlayer.current) {
            videoPlayer.current.setNativeProps({ paused: true });
          }
          onCommentPress();
        }}
      />
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white", //COLOR.BACKGROUND,
    flexGrow: 1,
  },
  headingView: {
    marginVertical: RFValue(10),
  },
  headings: {
    minHeight: RFValue(40),
    justifyContent: "center",
    paddingHorizontal: 10,
    margin: RFValue(5),
    borderRadius: RFValue(5),
  },
  options: {
    minHeight: RFValue(35),
    justifyContent: "center",
    paddingLeft: 10,
    margin: RFValue(5),
    borderRadius: RFValue(5),
    backgroundColor: "#F1F3FA",
  },
  optionText: {
    fontSize: RFValue(13),
    fontFamily: FONTS.BOLD,
    color: COLOR.BLACK,
    width: "90%",
  },
  optionsColor: {
    height: RFValue(33),
    justifyContent: "center",
    borderRadius: RFValue(5),
    position: "absolute",
    right: RFValue(0),
    zIndex: 1000,
  },
  colorBox: {
    height: RFValue(25),
    width: RFValue(25),
    marginHorizontal: 3,
    borderRadius: RFValue(5),
  },
  buttonView: {
    position: "absolute",
    right: RFValue(0),
    backgroundColor: "#CBCCD1",
    height: RFValue(33),
    width: RFValue(30),
    alignItems: "center",
    justifyContent: "center",
    borderBottomRightRadius: RFValue(5),
    borderTopRightRadius: RFValue(5),
  },
  queTextInputStyle: {
    fontSize: RFValue(13),
    fontFamily: FONTS.REGULAR,
    color: COLOR.BLACK,
    borderColor: COLOR.GREY,
    borderWidth: 0.5,
    borderRadius: 5,
    paddingVertical: RFValue(8),
    paddingHorizontal: RFValue(10),
    backgroundColor: COLOR.INPUT_BG,
  },
  addButton: {
    position: "absolute",
    alignSelf: "center",
    bottom: 0,
    zIndex: 2,
    right: RFValue(-5),
  },
  panPointView: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    marginBottom: RFValue(15),
    margin: RFValue(5),
  },
  panView: {
    width: "97%",
  },
});
export default TemplateTwentySix = React.memo(TemplateTwentySix);
