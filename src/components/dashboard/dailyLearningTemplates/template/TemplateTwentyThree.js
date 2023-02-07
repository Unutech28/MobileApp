import tempStyle from "@components/dashboard/dailyLearningTemplates/globalTemplateStyle";
import GLOBALS from "@constants";
import React, { useState, useRef, useEffect } from "react";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import ButtonNew from "@components/common/buttonNew";
import Icon from "react-native-vector-icons/FontAwesome5";
import { alertWithOneBtn } from "@helpers/common";
import { strings } from "@localization";

import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
const { FONTS, COLOR } = GLOBALS;
import * as AppActions from "@actions";
import {
  ShowHtmlText,
  CardTitle,
  LikeElement,
} from "@components/dashboard/dailyLearningTemplates/templateElements";
import { useDispatch } from "react-redux";
import { SvgCssUri } from "react-native-svg";

const { width, height } = Dimensions.get("window");
function TemplateTwentyThree(props) {
  let { cardData, onSubmit, onLikeClick, onCommentClick } = props;

  const [options, setOptions] = useState(cardData?.otherAttribute?.headers);
  const [headersId, setHeadersId] = useState([0, 1, 2, 3]);
  const [headers, setHeaders] = useState(
    cardData.headers ? cardData.headers : []
  );

  const [temp, setTemp] = useState(0);
  const [showIcon, setShowIcon] = useState(false);

  const videoPlayer = React.useRef();
  const dispatch = useDispatch();
  let datePickerRef = useRef;
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
  const [topHeaders, setTopHeaders] = useState([]);

  useEffect(() => {
    getHeadersId();
    setOption();
  }, [cardData]);
  const setOption = () => {
    let user_input_response = cardData?.action?.user_response
      ? cardData?.action?.user_response
      : [];
    let array = [];
    cardData?.otherAttribute?.headers?.map((item) => {
      /**Check if the option is already selected in any header */
      let id = "";

      item.ansOptions.map((m) => {
        let matched_index = -1;
        matched_index = user_input_response.findIndex(
          (x) => x.content_id === m.content_id
        );
        array.push({
          ...m,
          assessment_header_id: item.header_id,
          selected: false,
          answer: null,
          header_id:
            matched_index > -1
              ? user_input_response[matched_index].header_id
              : "",
          header_data:
            matched_index > -1
              ? user_input_response[matched_index].header_data
              : { header_id: "" },
        });
        //
      });
    });

    setShowIcon(true);
    setOptions(array);
  };

  const getHeadersId = () => {
    let array = [];
    let headers = [];
    let TopHeader = [];
    {
      cardData?.otherAttribute?.headers
        ? cardData?.otherAttribute?.headers.map((item, index) => {
            if (item.headerType == "StrategiesHeader") {
              array.push(item.header_id);
              headers.push(item);
            } else {
              TopHeader.push(item);
            }
          })
        : null;
    }
    setHeadersId(array);
    setHeaders(headers);
    setTopHeaders(TopHeader);
  };

  const boxBackgroundColor = (order) => {
    if (order == headersId[0]) {
      return COLOR.DARK_GREEN;
    }
    if (order == headersId[1]) {
      return COLOR.BUTTON_ORANGE;
    } else {
      return COLOR.LightGrayTextinput;
    }
  };

  const rederData = (item, index) => {
    return (
      <View style={styles.ToContainer}>
        <View style={[styles.headings, { backgroundColor: COLOR.CIRCLE_GRAY }]}>
          <Text style={styles.headingText}>{item.header}</Text>
        </View>
        <View style={{ marginTop: RFValue(10) }}>
          <TextInput
            multiline={true}
            placeholder={item.headerPlaceholder}
            style={[
              tempStyle.queTextInputAreaStyle,
              { backgroundColor: COLOR.LightGrayTextinput, borderWidth: 0 },
            ]}
            value={""}
            maxLength={2000}
            selectionColor={"green"}
            underlineColorAndroid={"transparent"}
            placeholderTextColor={"gray"}
            editable={false}
            // onChangeText={text => onTextAnswerChange(text, index, item)}
          />
        </View>
      </View>
    );
  };

  const OptionsComp = (item, i) => {
    return (
      <View
        style={[
          styles.options,
          {
            paddingVertical: 5,
            borderColor: boxBackgroundColor(item?.header_data?.header_id),
            borderWidth:
              item?.header_data || item?.header_data?.header_id != "" ? 1.5 : 0,
          },
        ]}
      >
        <Text style={styles.optionText}>{item?.contentDesc}</Text>
        <View style={styles.buttonView}>
          <TouchableOpacity
            hitSlop={{ right: 10, left: 10, top: 10, bottom: 10 }}
            onPress={() => toggleOptions(i)}
          >
            <Icon name={"plus"} size={20} color={COLOR.BLACK} />
          </TouchableOpacity>
        </View>
        {item?.selected && (
          <View style={[styles.optionsColor]}>
            <View style={{ flexDirection: "row" }}>
              <FlatList
                data={[1, 2]}
                keyExtractor={({ index }) => {
                  index;
                }}
                renderItem={({ value, index }) => {
                  return RenderBox(item.header_id, item, index);
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
        {showIcon ? (
          // item?.header_data?._id == headers[1]._id ? (
          item?.header_data?.header_id !== "" &&
          item?.header_data?.header_id != item.assessment_header_id ? (
            <View style={styles.buttonViewYesNo}>
              <TouchableOpacity
                hitSlop={{ right: 10, left: 10, top: 10, bottom: 10 }}
                onPress={() => {}}
              >
                <Icon name={"times"} size={10} color={COLOR.like_red} />
              </TouchableOpacity>
            </View>
          ) : item?.header_data?.header_id !== "" ? (
            <View
              style={[
                styles.buttonViewYesNo,
                { borderColor: COLOR.DARK_GREEN },
              ]}
            >
              <TouchableOpacity
                hitSlop={{ right: 10, left: 10, top: 10, bottom: 10 }}
                onPress={() => {}}
              >
                <Icon name={"check"} size={10} color={COLOR.DARK_GREEN} />
              </TouchableOpacity>
            </View>
          ) : null
        ) : null}
      </View>
    );
  };

  const RenderBox = (i, item, colorIndex) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setAnswer(i, item, colorIndex);
        }}
        style={[
          styles.colorBox,
          { backgroundColor: boxBackgroundColor(headersId[colorIndex]) },
        ]}
      />
    );
  };

  const setAnswer = (id, value, colorIndex) => {
    /**Add corresonding header value to selected option */
    let header_id = id;
    let selected_option_index = options?.findIndex(
      (x) => x.content_id === value.content_id
    );

    let modified_option = Object.assign([], options, {
      [selected_option_index]: {
        ...value,
        header_id: headers[colorIndex].header_id,
        selected: false,
        header_data: headers[colorIndex],
      },
    });
    setOptions(modified_option);
    setShowIcon(false);
  };

  const toggleOptions = (index) => {
    // LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
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

  /**To show dynamic headers view  */
  const getDynamicHeaders = (item, order) => {
    return (
      <View
        style={[
          styles.headings2,
          { backgroundColor: boxBackgroundColor(item.header_id) },
        ]}
      >
        <Text style={[styles.headingText]}>{item.header}</Text>
        {/* <ShowHtmlText
          source={{
            html: item.header[user_language],
          }}
        /> */}
      </View>
    );
  };
  const checkAllOptions = (index) => {
    let data = true;
    data = options.every((option) => option.header_data?.header_id == "");
    return data;
  };

  const onSavePress = () => {
    let isNotComplete = checkAllOptions();
    if (isNotComplete) {
      alertWithOneBtn(strings.PERFORM_EXERCISE);
    } else {
      setShowIcon(true);
      let param = {
        cardId: cardData?._id,
        action: {
          user_response: options,
        },
        week: cardData.week,
        day: cardData.day,
      };
      onSubmit(param, cardData?.otherAttribute?.feedback);
      setShowIcon(true);
      return;
      let selected_options = options.filter((x) => x.header_data?._id != "");
      let result = [];
      result = selected_options.reduce((r, a) => {
        r[a.header_data?._id] = r[a.header_data?._id] || [];
        r[a.header_data?._id].push(a);
        return r;
      }, Object.create(null));
      let submit_user_header = headers.map((m) => {
        return {
          _id: m._id,
          content_id: m.content_id,
          card_id: m.card_id,
          assessment_content_id: result[m._id]
            ? result[m._id].map((m) => m._id)
            : [],
        };
      });

      onSubmit(submit_user_header, cardData?.feedback_message[user_language]);
      setShowIcon(true);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{}}>
        {cardData?.title != "" && (
          <CardTitle
            style={tempStyle?.cardTitle}
            text={cardData?.title ? cardData.title : ""}
          />
        )}

        {cardData.description ? (
          <ShowHtmlText
            contentWidth={width}
            source={{
              html: cardData?.description ? cardData.description : "",
            }}
          />
        ) : null}
      </View>

      <View style={styles.imageView}>
        <SvgCssUri
          width={100}
          height={100}
          uri="https://mamalift-qa.curio-dtx.com/upload/0.47199342596470784--stella.svg"
        />
      </View>

      {/* <View style={styles.ToContainer}>
        <View
          style={[
            styles.headings,
            { backgroundColor: COLOR.BUTTON_ORANGE, alignItems: "flex-start" },
          ]}
        >
          <Text style={styles.headingText}>
            {"I’m planning to talk to my partner about…"}
          </Text>
        </View>
      </View> */}
      {topHeaders.map((item, index) => {
        return rederData(item, index);
      })}
      <View style={styles.headingView}>
        {headers.map((item, index) => {
          return getDynamicHeaders(item, index);
        })}
      </View>
      <View>
        {options.map((item, index) => {
          return OptionsComp(item, index);
        })}
      </View>
      <View style={styles.button}>
        <ButtonNew text={"save"} onBtnPress={onSavePress} />
      </View>
      {/* 

     
      */}
      {/* 
      {cardData.headers.filter(x => x.header_type != 'questions').length >
        0 && (
          <View style={styles.button}>
            <ButtonNew text={'save'} onBtnPress={onSavePress} />
          </View>
        )} */}

      <LikeElement
        cardDetails={cardData}
        isComment={true}
        onCommentClick={() => onCommentPress()}
        onLikeClick={(type) => {
          onLikeClick({
            cardId: cardData?._id,
            action: { like: type },
            week: cardData.week,
            day: cardData.day,
          });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,

    margin: RFValue(10),
  },
  headings: {
    width: "100%",
    minHeight: RFValue(35),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: RFValue(5),
    paddingHorizontal: RFValue(10),
  },
  ToContainer: {
    width: "100%",
    marginTop: RFValue(10),
    justifyContent: "center",
  },
  headingText: {
    fontSize: RFValue(14),
    fontFamily: FONTS.SEMI_BOLD,
    color: COLOR.WHITE,
  },
  circleView: {
    height: RFValue(20),
    width: RFValue(20),
    borderRadius: RFValue(10),
    backgroundColor: COLOR.BUTTON_ORANGE,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    left: RFValue(-10),
    borderColor: COLOR.WHITE,
    borderWidth: 2,
  },
  dropdownStyle: {
    width: "100%",
    borderWidth: 0,
    backgroundColor: COLOR.LightGrayTextinput,
  },
  dropDownTextStyle: {
    fontSize: 15,
    color: COLOR.CIRCLE_GRAY,
    fontFamily: FONTS.MEDIUM,
  },
  dropDownLableStyle: {
    fontFamily: FONTS.MEDIUM,
    color: COLOR.BLACK,
  },
  addButton: {
    position: "absolute",
    right: RFValue(10),
  },
  text: {
    fontSize: RFValue(14),
    fontFamily: FONTS.MEDIUM,
    color: COLOR.CIRCLE_GRAY,
  },
  removeButton: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    right: 1,
    top: 3,
    zIndex: 1000,
  },
  button: {
    marginTop: RFValue(10),
    width: "100%",
  },
  imageView: {
    width: "100%",
    alignItems: "center",
    marginTop: RFValue(20),
  },
  options: {
    minHeight: RFValue(35),
    justifyContent: "center",
    paddingLeft: 10,
    margin: RFValue(5),
    borderRadius: RFValue(5),
    backgroundColor: "#F1F3FA",
    paddingRight: RFValue(28),
  },
  optionText: {
    fontSize: RFValue(13),
    fontFamily: FONTS.SEMI_BOLD,
    color: COLOR.BLACK,
    // width: '50%',
  },
  buttonView: {
    position: "absolute",
    right: RFValue(0),
    backgroundColor: "#CBCCD1",
    height: "100%",
    width: RFValue(30),
    alignItems: "center",
    justifyContent: "center",
    borderBottomRightRadius: RFValue(5),
    borderTopRightRadius: RFValue(5),
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
  headingView: {
    marginVertical: RFValue(10),
    width: "100%",
  },
  headings2: {
    minHeight: RFValue(40),
    justifyContent: "center",
    paddingHorizontal: 10,
    margin: RFValue(5),
    borderRadius: RFValue(5),
    width: "100%",
  },
  headingText: {
    fontSize: RFValue(14),
    fontFamily: FONTS.BOLD,
    color: COLOR.WHITE,
    // width: '100%',
  },
  buttonViewYesNo: {
    position: "absolute",
    right: RFValue(0),
    backgroundColor: COLOR.WHITE,
    height: RFValue(18),
    width: RFValue(18),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: RFValue(9),
    borderColor: COLOR.like_red,
    borderWidth: 1,
    top: RFValue(-10),
  },
});
export default TemplateTwentyThree = React.memo(TemplateTwentyThree);
