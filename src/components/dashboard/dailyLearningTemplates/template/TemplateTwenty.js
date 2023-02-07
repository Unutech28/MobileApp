import tempStyle from "@components/dashboard/dailyLearningTemplates/globalTemplateStyle";
import GLOBALS from "@constants";
import React, { useState, useRef, useEffect } from "react";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import ButtonNew from "@components/common/buttonNew";
import DropDownPicker from "../../../../updatedNodeModules/react-native-dropdown-picker";
//import DatePicker from 'react-native-datepicker';
import DatePicker from "react-native-date-picker";
// import Icon from 'react-native-vector-icons/AntDesign';
import Icon from "react-native-vector-icons/MaterialIcons";
import { alertWithOneBtn } from "@helpers/common";
import {
  //   Image,
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Modal,
  Button,
} from "react-native";
const { FONTS, COLOR } = GLOBALS;
import * as AppActions from "@actions";
import {
  ShowHtmlText,
  CardTitle,
  LikeElement,
} from "@components/dashboard/dailyLearningTemplates/templateElements";
import Compass from "@components/dashboard/dailyLearningTemplates/modal/Compass.js";
import CustomPicker from "@components/dashboard/dailyLearningTemplates/modal/CustomPicker.js";
import { useSelector, useDispatch } from "react-redux";
import IoniIcon from "react-native-vector-icons/Ionicons";
import moment from "moment";
import { strings } from "@localization";
const { width, height } = Dimensions.get("window");
function TemplateTwenty(props) {
  let { cardData, onSubmit, onLikeClick, onCommentClick, onEdit } = props;

  /**Initialize header value */
  const [headerData, setHeaderData] = useState([]);
  /**Initialize bottom header value */
  const [bottomHeaderData, setBottomHeaderData] = useState([]);
  const [showPicker, togglePickerModal] = useState(false);
  const [showComapss, toggleCompassModal] = useState(false);

  const [drop_down_value, setValue] = useState("Select...");
  const [drop_down_value1, setValue1] = useState("Select...");
  const [dateIndex, setDateIndex] = useState(0);

  const [modal_data, setModalData] = useState({
    current_data: {},
    index: 1,
    selectedValue: "",
    item: [],
  });

  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();
  let datePickerRef = useRef();
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
    setDefaultInput();
    setDefaultDropDown();
  }, [cardData]);

  /**Initialize the top input header */
  const setDefaultInput = () => {
    let array = [];


    if (
      cardData?.otherAttribute &&
      cardData?.otherAttribute?.mainHeader?.length > 0
    ) {
      cardData?.otherAttribute?.mainHeader.map((m) => {
        array.push({
          ...m,
          answers:
            // matched_index > -1
            //   ? user_input_response[matched_index].answers
            //   :
            [

              {
                answer: "",
                is_added: false,


              },
            ],
        });
      });
      setHeaderData(array);
    }
  };

  /**Initilize array for bottom commitment data */
  const setDefaultDropDown = () => {

    if (
      cardData?.otherAttribute &&
      cardData?.otherAttribute?.mainHeader?.length > 0
    ) {
      let commitment_header = cardData?.otherAttribute?.mainHeader.filter(
        (item) => item.headerType != "valueHeader"
      );
      let commitment_data = [];
      commitment_header.length > 0 &&
        commitment_data.push({
          act: "",
          behave: "",
          date: "",
          order: 1,
          act_header: commitment_header[0]?.header_id,
          behave_header: commitment_header[1]?.header_id,
          is_added: false,
        });
      setBottomHeaderData(commitment_data);
    }

  };

  /**Show dynamic clor in header */
  const boxBackgroundColor = (order) => {
    if (order === 0) {
      return COLOR.CIRCLE_GRAY;
    } else {
      return COLOR.DARK_GREEN;
    }
  };
  /**Modify the answer key on text input change */
  const onTextValueChange = (value, inner_index, outer_index) => {
    let current_answer = headerData[outer_index].answers[inner_index];
    current_answer = Object.assign({}, current_answer, {
      answer: value,
    });
    let current_header_ans = Object.assign(
      [],
      headerData[outer_index].answers,
      {
        [inner_index]: current_answer,
      }
    );
    dataModify(inner_index, outer_index, current_header_ans);
  };

  /**Modify Final Array of top input header*/
  const dataModify = (inner_index, outer_index, current_header_ans) => {
    let array = Array.from(headerData);
    let all_current_header_ans = Object.assign({}, array[outer_index], {
      answers: current_header_ans,
    });
    let modifyHeader = Object.assign([], array, {
      [outer_index]: all_current_header_ans,
    });
    setHeaderData(modifyHeader);
  };

  /**Show Text input header Top header */
  const renderTopHeader = (item, index) => {
    return (
      item.headerType == "valueHeader" && (
        <View style={styles.ToContainer}>
          <View
            style={[
              styles.headings,
              { backgroundColor: boxBackgroundColor(index) },
            ]}
          >
            <Text style={styles.headingText}>{item.addHeader}</Text>
          </View>
          {item.answers.map((m, inner) => {
            return (
              <View style={{ marginTop: RFValue(10) }}>
                <TextInput
                  multiline={true}
                  placeholder={item.placeholder}
                  style={[
                    tempStyle.queTextInputAreaStyle,
                    {
                      backgroundColor: COLOR.LightGrayTextinput,
                      borderWidth: 0,
                    },
                  ]}
                  value={m.answer}
                  maxLength={2000}
                  selectionColor={"green"}
                  underlineColorAndroid={"transparent"}
                  placeholderTextColor={"gray"}
                  onChangeText={(text) => {
                    onTextValueChange(text, inner, index);
                  }}
                />
              </View>
            );
          })}
        </View>
      )
    );
  };

  /**Show commitment header data bottom header*/
  const renderBottomHeader = (item, index) => {
    return (
      item.header_type != "valueHeader" && (
        <View style={styles.ToContainer}>
          <View
            style={[
              styles.headings,
              {
                backgroundColor: COLOR.BUTTON_ORANGE,
                width: width / 1.1,
                height: RFValue(45),
              },

            ]}
          >
            <Text style={styles.headingText}> {item.addHeader}</Text>

            <View style={styles.circleView}>
              <Text style={styles.headingText}>{index + 1}</Text>
            </View>
          </View>
        </View>
      )
    );
  };

  /**Action handler for bottom commitment fileds */
  const commitmentClick = (type, data, index) => {
    switch (type) {
      case "text_input":
        let modified_obj = Object.assign({}, bottomHeaderData[index], {
          date: data,
        });
        setBottomHeaderData(
          Object.assign([], bottomHeaderData, {
            [index]: modified_obj,
          })
        );
        break;
      case "plus":
        let current_answer = bottomHeaderData[data];
        current_answer = Object.assign({}, current_answer, {
          is_added: true,
          act: drop_down_value,
          behave: drop_down_value1,
        });
        let current_header_ans = Object.assign([], bottomHeaderData, {
          [data]: current_answer,
        });
        let empty_obj = {
          act: "",
          behave: "",
          date: "",
          order: 1,
          act_header: bottomHeaderData[0].act_header,
          behave_header: bottomHeaderData[0].behave_header,
          is_added: false,
        };
        current_header_ans.push(empty_obj);
        setValue("Select...");
        setValue1("Select...");
        setBottomHeaderData(current_header_ans);
        break;
      case "delete_row":
        let filter_data = bottomHeaderData.filter(
          (ele, ele_index) => ele_index != index
        );
        filter_data = filter_data.map((item, index) => {
          return {
            ...item,
            order: index,
          };
        });
        setBottomHeaderData(filter_data);
        break;
      default:
        break;
    }
  };

  /**Show bottom commitment fields */
  const showBottomTextInput = () => {
    return bottomHeaderData.map((item, index) => {
      return (
        <>
          {index > 0 && (
            <View
              style={{
                height: 10,
                backgroundColor: COLOR.BUTTON_ORANGE,
                marginTop: 10,
              }}
            />
          )}

          <View style={[styles.ToContainer]}>
            <TouchableOpacity
              onPress={() => {
                if (item.is_added == false) {
                  setModalData({
                    current_data: item,
                    index: 1,
                    selectedValue: drop_down_value,
                    item: cardData?.otherAttribute.content1,
                  });
                  togglePickerModal(true);
                }
              }}
              style={[
                styles.headings,
                {
                  width: width / 1.1,
                  marginHorizontal: 0,
                  backgroundColor: COLOR.LightGrayTextinput,
                  height: RFValue(45),
                },
              ]}
            >
              <Text style={{ fontSize: 15, width: "90%" }}>
                {!item.is_added ? drop_down_value : item.act}
              </Text>

              <View
                style={[
                  styles.circleView,
                  { backgroundColor: COLOR.CIRCLE_GRAY },
                ]}
              >
                <Text style={styles.headingText}>{index + 1}</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={[styles.ToContainer]}>
            <TouchableOpacity
              onPress={() => {
                if (item.is_added == false) {
                  setModalData({
                    current_data: item,
                    index: 2,
                    selectedValue: drop_down_value1,
                    item: cardData?.otherAttribute.content2,
                  });
                  togglePickerModal(true);
                }
              }}
              style={[
                styles.headings,
                {
                  width: width / 1.1,
                  marginHorizontal: 0,
                  backgroundColor: COLOR.LightGrayTextinput,
                  height: RFValue(45),
                },
              ]}
            >
              <Text style={{ fontSize: 15, width: "90%" }}>
                {!item.is_added ? drop_down_value1 : item.behave}
              </Text>
              <View
                style={[
                  styles.circleView,
                  { backgroundColor: COLOR.CIRCLE_GRAY },
                ]}
              >
                <Text style={styles.headingText}>{index + 1}</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.ToContainer}>
            <View
              style={[
                styles.headings,
                {
                  width: width / 1.1,
                  marginHorizontal: 0,
                  backgroundColor: COLOR.LightGrayTextinput,
                  height: RFValue(45),
                  alignItems: "flex-start",
                  paddingHorizontal: RFValue(20),
                },
              ]}
            >
              <TouchableOpacity
                style={{ width: "100%" }}
                onPress={() => {
                  if (item.is_added == false) {
                    setDateIndex(index);
                    setOpen(true);
                  }
                }}
              >
                <Text>{item.date ? item.date : "dd/mm/yyy"}</Text>
              </TouchableOpacity>

              <View
                style={[
                  styles.circleView,
                  { backgroundColor: COLOR.CIRCLE_GRAY },
                ]}
              >
                <Text style={styles.headingText}>{index + 1}</Text>
              </View>
              {item.is_added == false ? (
                <TouchableOpacity
                  onPress={() => {
                    if (
                      item.date != "" &&
                      drop_down_value != "Select..." &&
                      drop_down_value1 != "Select..."
                    ) {
                      commitmentClick("plus", index);
                    }
                  }}
                  style={styles.addButton}
                >
                  <IoniIcon
                    name={"add-circle"}
                    size={RFValue(30)}
                    color={
                      item.date == "" ||
                      drop_down_value == "Select..." ||
                      drop_down_value1 == "Select..."
                        ? COLOR.PRIMARY
                        : COLOR.DarkGray
                    }
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => commitmentClick("delete_row", item, index)}
                  style={styles.removeButton}
                >
                  <Icon name={"cancel"} size={25} color={COLOR.CINNABAR} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </>
      );
    });
  };

  const onSaveHandler = () => {
    let final_bottom = bottomHeaderData.filter(
      (item) => item.is_added != false
    );
    let topHeaderValid = true;
    headerData
      .filter((item) => item.headerType == "valueHeader")
      .map((m) => {
        if (m.answers[0].answer == "") {
          topHeaderValid = false;
        }
      });
    if (final_bottom.length == 0 || !topHeaderValid) {
      alertWithOneBtn(strings.PERFORM_EXERCISE);
      return;
    }

    let submit_user_header = headerData.map((m) => {
      return {
        ...m,
        answers: m.headerType == "valueHeader" ? m.answers : bottomHeaderData,
      };
    });
    let user_input_response = cardData?.action?.user_response
      ? cardData?.action?.user_response
      : [];

    user_input_response.push(submit_user_header);
    let param = {
      cardId: cardData?._id,
      action: { user_response: user_input_response },
      week: cardData.week,
      day: cardData.day,
    };

    onEditData(user_input_response);
  };

  const onEditData = (data) => {
    let param = {
      cardId: cardData?._id,
      action: { user_response: data },
      week: cardData.week,
      day: cardData.day,
    };
    toggleCompassModal(false);
    onSubmit(param, cardData?.otherAttribute?.feedback);
  };

  return (
   
    <>
      <View
        style={{
          flex: 1,
          paddingHorizontal: 10,

          margin: RFValue(10),
        }}
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
        {headerData == undefined || headerData == [] ? "" :
        headerData.map((item, index) => {
          return renderTopHeader(item, index);
        })}
        {cardData?.otherAttribute && cardData?.otherAttribute?.heading && (
          <View style={styles.ToContainer}>
            <View
              style={[
                styles.headings,
                { backgroundColor: boxBackgroundColor(0) },
              ]}
            >
              <ShowHtmlText
                contentWidth={width}
                source={{
                  html: cardData?.otherAttribute?.heading,
                }}
              />
            </View>
          </View>
        )}
        <View />
        <View>
          {headerData
            .filter((item) => item.headerType != "valueHeader")
            .map((item, index) => {
              return renderBottomHeader(item, index);
            })}
        </View>
        <View>{showBottomTextInput()}</View>

        <View style={{ marginTop: RFValue(10), width: "100%" }}>
          <ButtonNew
            text={"save"}
            onBtnPress={() => {
              onSaveHandler();
            }}
          />
          <TouchableOpacity
            onPress={() => {
              toggleCompassModal(true);
            }}
            hitSlop={{ right: 10, left: 10, top: 10, bottom: 10 }}
          >
            <Text style={styles.footerText}>
              Click here to see areas of life
            </Text>
          </TouchableOpacity>
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

        <DatePicker
          mode={"date"}
          modal
          minimumDate={new Date()}
          open={open}
          date={date}
          onConfirm={(date) => {
            setOpen(false);
            setDate(date);
            commitmentClick(
              "text_input",
              moment(date).format("DD/MM/yyyy"),
              dateIndex
            );
          }}
          onCancel={() => {
            setOpen(false);
          }}
        />
        <Modal
          transparent
          visible={showPicker}
          onRequestClose={() => {
            togglePickerModal(false);
          }}
          animationType={"slide"}
        >
          <CustomPicker
            modal_data={modal_data}
            closeModal={() => {
              togglePickerModal(false);
            }}
            selectedValue={(data) => {
              togglePickerModal(false);
              modal_data.index == 1
                ? setValue(data.addContent)
                : setValue1(data.addContent);
            }}
          />
        </Modal>
      </View>
      <Modal
        transparent
        visible={showComapss}
        onRequestClose={() => {
          toggleCompassModal(false);
        }}
        animationType={"slide"}
      >
        <Compass
          modal_data={cardData?.action?.user_response}
          cardData={cardData}
          closeModal={() => {
            toggleCompassModal(false);
          }}
          pickerValue={modal_data}
          onSubmit={(data, index) => onEditData(data, index)}
        />
      </Modal>
      {/* */}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white", //COLOR.BACKGROUND,
    flexGrow: 1,
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
    right: RFValue(-10),
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

    right: RFValue(-10),
    zIndex: 1000,
    // backgroundColor: 'red',
    // height: RFValue(20),
    // width: RFValue(20),
    // borderRadius: RFValue(10),
  },
  footerText: {
    color: COLOR.BUTTON_ORANGE,
    fontSize: RFValue(20),
    fontFamily: FONTS.BOLD,
    paddingVertical: 20,
    textDecorationLine: "underline",
  },
});
export default (TemplateTwenty = React.memo(TemplateTwenty));
