// @ts-nocheck
import * as AppActions from "@actions/";
import ButtonNew from "@components/common/buttonNew";
import { navigatorPush, navigatorPop } from "@config/navigationOptions";
import GLOBALS from "@constants";
import * as Images from "@images";
import React, { Component, lazy } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  Image,
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  Linking,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import moment from "moment";
import { RFValue, RFPercentage } from "react-native-responsive-fontsize";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import DropDownPicker from "../../../updatedNodeModules/react-native-dropdown-picker";
import { strings } from "@localization";
import momentZone from "moment-timezone";
let currentTimeZone = momentZone.tz.guess();
import styles from "./styles";
const { FONTS, COLOR, STRINGS } = GLOBALS;
const Header = lazy(() => import("@components/common/Header"));
const ScheduleTab = lazy(() => import("@components/dashboard/symptoms/tabs"));
import { checkPreviousUnread } from "@components/dashboard/dailyLearningTemplates/utilities";
const isiOS = Platform.OS == "ios";
const tabsLearingType = [
  // { title: strings.resource.ByDate, id: 1 },
  { title: "Stages", id: 1 },
  // { title: strings.resource.suggested, id: 2 },
  { title: strings.resource.Liked, id: 3 },
];

let weekDataDynamic = [];
const DayView = ({
  item,
  onClick,
  selectedDay,
  selectedWeek,
  currentWeekDay,
  stage,
}) => {
  let currentDay, currentWeek;
  if (currentWeekDay !== undefined) {
    currentDay = currentWeekDay.day;
    currentWeek = currentWeekDay.week;
  }

  //currentDay
  if (selectedWeek >= currentWeek && item > currentDay) {
    return (
      <View
        style={[
          styles.dayTouchable,
          { backgroundColor: COLOR.LIGHT_SHADOW_GREEN },
        ]}
      >
        <Text style={[styles.dayText1, { color: COLOR.WHITE }]}>
          {" "}
          {stage ? strings.home.stage : strings.home.day}
        </Text>
        <View
          style={[
            styles.dayViewStyle,
            { backgroundColor: COLOR.LIGHT_SHADOW_GREEN },
          ]}
        >
          <Text style={[styles.dayText, { color: COLOR.DARK_GREEN }]}>
            {item}
          </Text>
        </View>
      </View>
    );
  } else if (selectedWeek > currentWeek) {
    return (
      <View
        style={[
          styles.dayTouchable,
          { backgroundColor: COLOR.LIGHT_SHADOW_GREEN },
        ]}
      >
        <Text style={[styles.dayText1, { color: COLOR.WHITE }]}>
          {stage ? strings.home.stage : strings.home.day}
        </Text>
        <View
          style={[
            styles.dayViewStyle,
            { backgroundColor: COLOR.LIGHT_SHADOW_GREEN },
          ]}
        >
          <Text style={[styles.dayText, { color: COLOR.DARK_GREEN }]}>
            {item}
          </Text>
        </View>
      </View>
    );
  } else {
    return (
      <TouchableOpacity
        style={[
          styles.dayTouchable,
          { backgroundColor: selectedDay == item ? COLOR.DARK_GREEN : "white" },
        ]}
        onPress={() => onClick(item)}
      >
        <Text
          style={[
            styles.dayText1,
            { color: selectedDay == item ? "white" : COLOR.DARK_GREEN },
          ]}
        >
          {stage ? strings.home.stage : strings.home.day}
        </Text>
        <View
          style={[
            styles.dayViewStyle,
            {
              backgroundColor:
                selectedDay == item ? COLOR.WHITE : COLOR.DARK_GREEN,
            },
          ]}
        >
          <Text style={[styles.dayText]}>{item}</Text>
        </View>
      </TouchableOpacity>
    );
  }
};

class SelectWeek extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDay: 1,
      selectedWeek: 1,
      // activeLearningTab: strings.resource.ByDate,
      activeLearningTab: "Stages",
      weekDataDynamic: [],
      dayDataDynamic: [],
      open: false,
      value: `${strings.resource.Week} ${this.props.week}`,
      prgName: "",
      stage: null,
      stageName: [],
      currentStage: 1,
      activeStage: false,
      //  themeData: this.props.themeData
    };

    this.setValue = this.setValue.bind(this);
  }

  componentDidMount() {
    this._setDynamicWeeks();
    this._setDynamicDays();
    this.setState({
      selectedDay: this.props.selectedProgram.stage
        ? 1
        : this.props.selectedProgram.currentday,
      selectedWeek: this.props.selectedProgram.stage
        ? 1
        : this.props.selectedProgram.currentWeek,
      value: `${strings.resource.Week} ${this.props.selectedProgram.currentWeek}`,
      prgName: this.props.selectedProgram.name,
      stage: this.props.selectedProgram.stage,
      stageName: this.props.selectedProgram.stageName,
      currentStage: this.props.programReducer.ActiveStage,
      // currentStage: this.props.selectedProgram.stage,
      // currentStage: this.props.selectedProgram.currentStage,
    });
    this.setActiveStages();
  }

  setActiveStages = (data, index) => {
    // this.setState({
    //   activeLearningTab: this.state.stage ? "Stages" : strings.resource.ByDate,
    // });

    // this.props.programReducer.UserStages.map((activeStage) => {
    //   console.log("get data==>", activeStage, index);
    //   if (parseInt(activeStage) == index) {
    //     console.log("here ");
    //     this.setState({ activeStage: true });
    //     return true;
    //   } else {
    //     this.setState({ activeStage: true });
    //     return false;
    //   }
    // });
    data?.map((stage, index) => {
      this.props.programReducer.UserStages.map((activeStage) => {
        if (parseInt(activeStage) - 1 == index) {
          stage.active = true;
        }
      });
    });
  };

  hideDropDown = () => {
    this.setState({ open: false });
  };

  _setActiveLearningTab = (tabName) => {
    let { componentId } = this.props;
    this.hideDropDown();
    if (this.state.activeLearningTab != tabName) {
      this.setState({ activeLearningTab: tabName });
    }
    switch (tabName) {
      case strings.resource.Liked:
        // this.props.AppActions.getLikeCardsList();
        // navigatorPush({
        //   componentId,
        //   screenName: "SwipeCards",
        //   passProps: {
        //     title: strings.cards.liked_cards,
        //   },
        // });
        // this.setState({ activeLearningTab: strings.resource.ByDate });
        this.props.AppActions.getLikeCardsList((res) => {
          // alert("hiiii");
          if (res) {
            navigatorPush({
              componentId,
              screenName: "SwipeCards",
              passProps: {
                title: strings.cards.liked_cards,
              },
            });
          }
          // this.setState({
          //   activeLearningTab:  strings.resource.ByDate,
          // });
          this.setState({
            activeLearningTab: "Stages",
          });
        });
        break;

      case strings.resource.suggested:
        // postData["keyword_ids"] = ["61725021defd450d698ea7fb", "617f830ddefd450d69965cac"]
        this.props.AppActions.getSuggestedLearningCards(postData, (res) => {
          if (res) {
            navigatorPush({
              componentId,
              screenName: "SwipeCards",
              passProps: {
                title: strings.cards.suggested_cards,
              },
            });
          }
          this.setState({
            activeLearningTab: strings.resource.ByDate,
          });
          this.setState({
            activeLearningTab: "Stages",
          });
        });
        break;
      default:
        break;
    }
  };

  _setDynamicWeeks() {
    let { selectedProgram } = this.props;
    if (
      selectedProgram !== undefined &&
      selectedProgram.totalWeeks !== null &&
      selectedProgram.totalWeeks !== undefined
    ) {
      weekDataDynamic = [];
      for (var i = 1; i <= selectedProgram.totalWeeks; i++) {
        weekDataDynamic.push({
          value: strings.resource.Week + " " + i,
          label: strings.resource.Week + " " + i,
        });
        this.setState({
          weekDataDynamic: [...weekDataDynamic],
        });
      }
    }
  }

  _setDynamicDays() {
    let { selectedProgram } = this.props;
    let days = selectedProgram.stage
      ? selectedProgram.stage
      : selectedProgram?.totalDays;
    let DataDynamic = [];
    for (var i = 1; i <= days; i++) {
      DataDynamic.push({
        value: i,
        label: i,
      });
      this.setState({
        dayDataDynamic: [...DataDynamic],
      });
    }
  }

  _onProceedClick1 = (stageName = "", stagedata) => {
    console.log("stage data==>", stagedata, this.props.selectedProgram.stage);
    let { componentId } = this.props;
    let data = {
      programId: this.props.selectedProgram._id,
      week: parseInt(this.state.selectedWeek),
      day: parseInt(this.state.selectedDay),
      stage: this.props.selectedProgram.stage,
    };
    console.log("data==>", data);
    this.props.AppActions.setCardLimit(20);
    this.props.AppActions.getCardsList(data, 0, (res) => {
      if (res.length == 0) {
        alert(strings.Content_not_available);
        return;
      }
      navigatorPush({
        componentId,
        screenName: "WeekInfoList",
        passProps: {
          week: this.state.selectedWeek,
          day: this.state.selectedDay,
          stageName: stageName,
        },
      });
    });
  };
  _onProceedClick = () => {
    let { componentId } = this.props;
    this.hideDropDown();
    let isPrevious_Read = checkPreviousUnread(
      parseInt(this.state.selectedWeek),
      parseInt(this.state.selectedDay),
      this.props.playlistDynamicRes.dailyLearningPointedWeek,
      this.props.playlistDynamicRes.dailyLearningPointedDay
    );
    if (isPrevious_Read) {
      let postData = {
        week: parseInt(this.state.selectedWeek),
        day: parseInt(this.state.selectedDay),
        user_id: this.props.loginData["user"]["_id"],
        language: this.props.user_language,
      };
      this.props.AppActions.getCardsforDay(postData, 0, (res) => {
        navigatorPush({
          componentId,
          screenName: "WeekInfoList",
          passProps: {
            week: this.state.selectedWeek,
            day: this.state.selectedDay,
            onGoBack: () => {
              this._getPlaylist();
            },
          },
        });
        this.props.AppActions.markCardRead({
          user_id: this.props.loginData["user"]["_id"],
          week: this.state.selectedWeek,
          day: this.state.selectedDay,
          card_number: this.props.currentCard.card_number,
          card_id: this.props.currentCard._id,
        });
      });
    }
  };

  daySelected = (day) => {
    this.hideDropDown();

    this.setState({ selectedDay: day });
  };

  onWeekChange(text) {
    this.setState({
      selectedWeek: text.replace(strings.resource.Week + " ", ""),
    });
  }

  setValue = (callback) => {
    this.setState((state) => ({
      value: callback(state.value),
      selectedWeek: callback(state.value).replace(
        strings.resource.Week + " ",
        ""
      ),
    }));

    // this.setState({ selectedWeek: text.replace("Week ", "") });
  };

  render() {
    let { loginData, componentId, playlistDynamicRes } = this.props;
    let currentWeek, currentDay;
    if (playlistDynamicRes !== undefined) {
      currentDay = playlistDynamicRes.day;
      currentWeek = playlistDynamicRes.week;
    }
    return (
      <View style={{ flex: 1, zIndex: 1, backgroundColor: COLOR.WHITE }}>
        <Header
          isLeftIcon={true}
          isRightIcon={false}
          onLeftIconClick={() => {
            navigatorPop({ componentId });
          }}
          isTitle={true}
          //    title={strings.resource.my_learning}
          title={this.state.prgName}
          isLogout={false}
          titleStyle={{
            //fontSize: RFValue(28),
            paddingTop: RFValue(10),
          }}
          // primary={this.props.themeData.primary}
        />
        <View style={{ marginTop: RFValue(15) }}>
          <ScheduleTab
            customStyle={{
              marginTop: RFValue(15),
            }}
            tabList={tabsLearingType}
            activeTab={this.state.activeLearningTab}
            setActiveTab={this._setActiveLearningTab}
            tabTitleStyle={{ fontSize: RFValue(16) }}
          />
        </View>
        <View style={styles.logoView}>
          <Image
            source={Images.stellaWave}
            resizeMode="contain"
            style={styles.logoStyle}
          />
        </View>

        {this.state.stage && this.state.stageName && (
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ marginBottom: RFValue(20) }}
          >
            {this.state.stageName.map((element, index) => {
              let active = this.setActiveStages(
                this.state.stageName,
                index + 1
              );
              return (
                <TouchableOpacity
                  onPress={() => {
                    if (!element.active) {
                      this.setState({ selectedDay: index + 1 }, () => {
                        if (
                          element?.section &&
                          element?.sectionName.length > 0
                        ) {
                          navigatorPush({
                            componentId,
                            screenName: "SelectSection",
                            passProps: {
                              stage: element,
                              selectedCurruntStage: index + 1,
                            },
                          });
                        } else {
                          this._onProceedClick1(element.name, element);
                        }

                        //
                      });
                    }
                  }}
                  style={[
                    styles.stageContainer,
                    {
                      backgroundColor: element.active
                        ? // ? this.state.themeData.primary
                          COLOR.DARK_GREEN
                        : COLOR.LIGHT_SHADOW_GREEN,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.stageText,
                      {
                        color: element.active ? COLOR.WHITE : COLOR.blackGray,
                      },
                    ]}
                  >
                    {`${element.name}`}
                  </Text>
                  {element.active && (
                    <Ionicons
                      name={"chevron-forward"}
                      color={COLOR.tabIcon}
                      size={30}
                      style={{
                        position: "absolute",
                        right: 10,
                        alignSelf: "center",
                      }}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}

        {!this.state.stage && (
          <DropDownPicker
            placeholder={strings.resource.SelectWeek}
            theme="LIGHT"
            style={styles.dropDownStyleNew}
            containerStyle={[
              {
                width: "90%",
                alignSelf: "center",
              },
            ]}
            textStyle={{
              fontSize: 15,
              color: COLOR.DARK_GREEN,
              fontFamily: FONTS.MEDIUM,
            }}
            labelStyle={{
              fontFamily: FONTS.MEDIUM,
              color: COLOR.BLACK,
            }}
            dropDownDirection="TOP"
            open={this.state.open}
            value={this.state.value}
            items={this.state.weekDataDynamic}
            setOpen={() => this.setState({ open: true })}
            onPress={(open) => {
              if (!open) {
                setTimeout(() => {
                  this.hideDropDown();
                }, 500);
              }
            }}
            setValue={this.setValue}
            onChangeValue={(value) => {
              this.setState({
                open: false,
              });
            }}
          />
        )}

        {!this.state.stage && (
          <>
            {/* Day desgin */}
            <View style={styles.dayView}>
              {this.state.dayDataDynamic.map((element) => {
                return (
                  <DayView
                    item={element.value}
                    onClick={this.daySelected}
                    selectedDay={this.state.selectedDay}
                    selectedWeek={this.state.selectedWeek}
                    stage={this.props.selectedProgram.stage}
                    currentWeekDay={{
                      //  day: 4,
                      day: this.props.selectedProgram.stage
                        ? this.props.selectedProgram.stage
                        : this.props.selectedProgram.currentday,
                      week: this.props.selectedProgram.currentWeek,
                    }}
                  />
                );
              })}
            </View>
            <View style={styles.buttonView}>
              <ButtonNew
                text={strings.resource.proceed}
                // onBtnPress={this._onProceedClick}
                onBtnPress={this._onProceedClick1}
                isDisabled={
                  this.state.selectedWeek > currentWeek ? true : false
                }
              />
            </View>
          </>
        )}

        {/* <Loading></Loading> */}
      </View>
    );
  }
}
const mapStateToProps = ({
  authReducer,
  playlistReducer,
  cardsReducer,
  programReducer,
}) => ({
  loginData: authReducer.loginData,
  playlistDynamicRes: playlistReducer.playlistDynamicRes,
  currentCard: cardsReducer.currentCard,
  user_language: authReducer.language,
  selectedProgram: programReducer.selectedProgram,
  programReducer: programReducer,
  // themeData: authReducer
});
const mapDispatchToProps = (dispatch) => ({
  AppActions: bindActionCreators(AppActions, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(SelectWeek);
