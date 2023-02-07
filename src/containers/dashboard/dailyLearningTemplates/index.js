/* eslint-disable prettier/prettier */
/* eslint-disable module-resolver/use-alias */
import GLOBALS from "@constants";
import * as AppActions from "@actions";
import { ThemeContext } from "@hoc/withRedux";
import React, { Component, lazy } from "react";
import {
  StyleSheet,
  View,
  Text,
  AsyncStorage,
  AppState,
  Modal,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
  ScrollView,
  Dimensions,
} from "react-native";
const { COLOR, FONTS, STRINGS } = GLOBALS;
import Styles from "./styles";
import { strings } from "@localization";
const CustomVideoPlayer = lazy(() =>
  import("@components/dashboard/modals/CustomVideoPlayer")
);
import { Slider } from "@miblanchard/react-native-slider";
import { RFValue } from "react-native-responsive-fontsize";
import { connect } from "react-redux";
import {
  navigatorPop,
  navigatorPush,
  navigatorRoot,
} from "@config/navigationOptions";
import { bindActionCreators } from "redux";
import DeviceInfo from "react-native-device-info";

const Header = lazy(() => import("@components/common/Header"));
import moment from "moment";
import GestureRecognizer from "../../../updatedNodeModules/react-native-swipe-gestures";
import {
  accessToken,
  userLanguage,
  FcmToken,
  getIPAdreessData,
} from "@helpers/common";
import { CardTitle } from "@components/dashboard/dailyLearningTemplates/templateElements";

const DailyLearningTemplateComponent = lazy(() =>
  import("@components/dashboard/dailyLearningTemplates")
);
const CommentModal = lazy(() =>
  import("@components/dashboard/dailyLearningTemplates/modal/Comment.js")
);
const ReflactModal = lazy(() =>
  import("@components/dashboard/dailyLearningTemplates/modal/ReflectModal.js")
);
// import HintModal from "@components/common/HintModal";
const HintModal = lazy(() => import("@components/common/HintModal"));
const TemplateOneComponent = lazy(() =>
  import("@components/dashboard/dailyLearningTemplates/template/templateOne")
);
const TemplateTwoComponent = lazy(() =>
  import("@components/dashboard/dailyLearningTemplates/template/templateTwo")
);
const TemplateFourteen = lazy(() =>
  import(
    "@components/dashboard/dailyLearningTemplates/template/TemplateFourteen"
  )
);

const TemplateFive = lazy(() =>
  import("@components/dashboard/dailyLearningTemplates/template/TemplateFive")
);
const TemplateTen = lazy(() =>
  import("@components/dashboard/dailyLearningTemplates/template/TemplateTen")
);
const TemplateEleven = lazy(() =>
  import("@components/dashboard/dailyLearningTemplates/template/TemplateEleven")
);

const TemplateTwelve = lazy(() =>
  import("@components/dashboard/dailyLearningTemplates/template/TemplateTwelve")
);
const TemplateThirteen = lazy(() =>
  import(
    "@components/dashboard/dailyLearningTemplates/template/TemplateThirteen"
  )
);
const DragDrop = lazy(() =>
  import("@components/dashboard/dailyLearningTemplates/template/DragDrop")
);

const TemplateNineteen1 = lazy(() =>
  import(
    "@components/dashboard/dailyLearningTemplates/template/TemplateNineteen1"
  )
);

const TemplateTwenty = lazy(() =>
  import("@components/dashboard/dailyLearningTemplates/template/TemplateTwenty")
);

const MutiStepPreg = lazy(() =>
  import("@components/dashboard/dailyLearningTemplates/template/MutiStepPreg")
);

const TemplateEighteen = lazy(() =>
  import(
    "@components/dashboard/dailyLearningTemplates/template/TemplateEighteen"
  )
);
const ThermometerTemplate = lazy(() =>
  import(
    "@components/dashboard/dailyLearningTemplates/template/ThermometerTemplate"
  )
);

const TemplateNineteen = lazy(() =>
  import(
    "@components/dashboard/dailyLearningTemplates/template/TemplateNineteen"
  )
);

const TemplateTwentyOne = lazy(() =>
  import(
    "@components/dashboard/dailyLearningTemplates/template/TemplateTwentyOne"
  )
);

const TemplateTwentyTwo = lazy(() =>
  import(
    "@components/dashboard/dailyLearningTemplates/template/TemplateTwentyTwo"
  )
);

const TemplateTwentyFive = lazy(() =>
  import(
    "@components/dashboard/dailyLearningTemplates/template/TemplateTwentyFive"
  )
);

const TemplateTwentyFour = lazy(() =>
  import(
    "@components/dashboard/dailyLearningTemplates/template/TemplateTwentyFour"
  )
);

const TemplateTwentyThree = lazy(() =>
  import(
    "@components/dashboard/dailyLearningTemplates/template/TemplateTwentyThree"
  )
);

const TemplateTwentySix = lazy(() =>
  import(
    "@components/dashboard/dailyLearningTemplates/template/TemplateTwentySix"
  )
);
import TemplateThree from "@containers/dashboard/dailyLearningTemplates/template/templateThree";
import TemplateFour from "@containers/dashboard/dailyLearningTemplates/template/templateFour";
import TemplateSix from "@containers/dashboard/dailyLearningTemplates/template/TemplateSix";
// import TemplateSeven from '@containers/dashboard/dailyLearningTemplates/template/TemplateSeven';
import TemplateEight from "@containers/dashboard/dailyLearningTemplates/template/TemplateEight";
import TemplateNine from "@containers/dashboard/dailyLearningTemplates/template/TemplateNine";

const TemplateSeven = lazy(() =>
  import("@components/dashboard/dailyLearningTemplates/template/TemplateSeven")
);

import {
  checkIfAllQuestionNotAnswered,
  showEmptyAlert,
  checkQuesInvalidAssement,
  checkHeaderData,
} from "@components/dashboard/dailyLearningTemplates/utilities";

import momentZone from "moment-timezone";
import AlertModal from "../../../components/common/AlertModal";
import Orientation from "react-native-orientation-locker";

const windowHeight = Dimensions.get("window").height;

const config = {
  velocityThreshold: 0.5,
  directionalOffsetThreshold: 80,
  gestureIsClickThreshold: 20,
};
class WeekInfoList extends Component {
  static contextType = ThemeContext;
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      loadingMore: false,
      responseData: [],
      cardsData: {},
      apiCalling: false,
      day: this.props.day,
      dayUpdate: this.props.day,
      previousDay: this.props.day,
      week: this.props.week,
      weekUpdate: this.props.week,
      previousWeek: this.props.week,
      showHint: true,
      showCommentModal: false,
      releftModal: false,
      reflact: "",
      templatesData: [],
      appState: AppState.currentState,
      alert_desc: "",
      showPopUp: false,
      showVideoModal: false,
      videoURL: "",
      stageName: this.props.stageName ? this.props.stageName : "",
    };
    let scrollViewRef;

    this._startTime();
    console.log(this.props, "props.....");
  }

  _startTime() {
    this.props.AppActions.getScreenStartTime(moment().format());
  }

  componentDidMount() {
    console.log(
      "this.props.allDaysCards=========",
      this.props.allDaysCards,
      this.props
    );
    this.setCardsArray(
      this.props.allDaysCards.selected_week,
      this.props.allDaysCards.selected_day
    );
    // this.scrollViewRef.scrollTo({ x: 0, y: 0 });
    // this.setState({
    //   stageName: this.props.selectedProgram?.stageName[this.props.allDaysCards.currentCard?.stage - 1].name,
    // });
    this.props.AppActions.markDayComplete({}, this.props.componentId);
    AppState.addEventListener("change", this._handleAppStateChange);
  }

  _handleAppStateChange = (nextAppState) => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      this._startTime();
    } else {
      let { activeScreenStartTime } = this.props;
      let postData = {
        group: "Interventions",
        event: "Daily Learning",
        inTime: activeScreenStartTime,
        outTime: moment().format(),
        activityDate: moment().format(),
      };
      if (Platform.OS == "android") {
        this.props.AppActions.addTimeTraker(postData);
      } else if (
        Platform.OS == "ios" &&
        this.state.appState.match(/inactive|background/) !== null
      ) {
        this.props.AppActions.addTimeTraker(postData);
      }
    }
    this.setState({ appState: nextAppState });
  };

  _goBack() {
    let { componentId, type, activeScreenStartTime } = this.props;
    console.log("data Propes===>", this.props);
    console.log("data Propes type===>", type);
    if (type == "chatBot") {
      navigatorRoot("Dashboard");
    } else {
      navigatorPop({ componentId });
    }
    let postData = {
      group: "Interventions",
      event: "Daily Learning",
      inTime: activeScreenStartTime,
      outTime: moment().format(),
      activityDate: moment().format(),
    };
    this.props.AppActions.addTimeTraker(postData);
    this.props.AppActions.getLastCardReadData();
  }
  shouldComponentUpdate(nextProps, nextState) {
    // alert("hiiii");
    console.log(
      "data==>Currunt card ====>",
      this.props.allDaysCards.currentCard
    );
    // if (this.state.temp !== nextState.temp) {
    //   return true;
    // }
    // console.log("this.props.playlistReducer", this.props.selectedProgram?.stageName[this.props.allDaysCards.currentCard?.stage - 1].name);

    return true;
  }

  /**Set Selected Week Cards Data */

  setCardsArray = (week, day) => {
    let index = `${week}${day}`;
    this.setState({
      cardsData: this.props.allDaysCards.all_cards[index],
    });
    console.log(index, "index..", this.props);
    if (this.props.allDaysCards.all_cards[index].length == 1) {
      /**Unlock next content and add points second last false for unlock*/
      // this._updateWeekDayAPI(false);
      // this._updateWeekDayAPI(true);
    }
    if (this.props.allDaysCards.all_cards[index].length == 2) {
      /**Unlock next content and add points second last false for unlock*/
      // this._updateWeekDayAPI(false);
    }
  };

  _callGetWeekDayApi(week, day, apiCall) {
    let { loginData } = this.props;
    this.setState({ apiCall: apiCall });
    let postData = {
      week: Number(week),
      day: Number(day),
      user_id: loginData["user"]["_id"],
    };
    this.setState({ apiCalling: !this.state.apiCalling });
    this.props.AppActions.dailyCBTApi(postData);
  }

  /**When user click on Tracker Activities Template 4*/
  onTrackerSelection = (type) => {
    const { componentId, trackers } = this.props;
    let mood = {
      moodData: trackers[2]?.subtrackers,
      trackerId: trackers[2]?.tracker?._id,
      trackerType: trackers[2]?.tracker?.value,
    };
    let activity = {
      trackerId: trackers[1]?.tracker?._id,
      activityData: trackers[1]?.subtrackers,
      imageBaseURL: trackers[1]?.baseurl,
      trackerType: trackers[1]?.tracker?.value,
    };
    let sleep = {
      trackerId: trackers[0]?.tracker?._id,
      trackerType: trackers[0]?.tracker?.value,
    };
    trackers?.map((item) => {
      if (item.tracker.value == "activity") {
        activity = {
          trackerId: item?.tracker?._id,
          activityData: item?.subtrackers,
          imageBaseURL: item?.baseurl,
          trackerType: item?.tracker?.value,
        };
      } else if (item.tracker.value == "mood") {
        mood = {
          moodData: item?.subtrackers,
          trackerId: item?.tracker?._id,
          trackerType: item?.tracker?.value,
        };
      } else {
        sleep = {
          trackerId: item?.tracker?._id,
          trackerType: item?.tracker?.value,
        };
      }
    });

    console.log("mood==>", mood);
    switch (type) {
      case "mood":
        navigatorPush({
          componentId,
          screenName: "MoodTracker",
          passProps: {
            ...mood,
            type: "daily",
            extra_props: {
              from: "Learning",
              goToComponent: this.props.componentId,
            },
          },
        });
        break;
      case "activity":
        navigatorPush({
          componentId,
          screenName: "ActivityTracker",
          passProps: { ...activity, type: "daily" },
        });
        break;
      case "pleasant":
        navigatorPush({
          componentId,
          screenName: "ActivityTracker",
        });
        break;
      case "sleep":
        navigatorPush({
          componentId,
          screenName: "SleepTracker",
          passProps: { ...sleep, type: "daily" },
        });
        break;
      case "reports":
        navigatorPush({
          componentId,
          screenName: "Reports",
        });
        break;
      case "assessment":
        navigatorPush({
          componentId,
          screenName: "Assessments",
          passProps: {},
        });
        break;
      case "pleasant":
        navigatorPush({
          componentId,
          screenName: "ActivityTracker",
          // passProps: { type: "daily" }
        });
        break;
      default:
        break;
    }
  };

  /**When user click on submit question in Template 2*/
  onAnswerSubmit = (answerDetails, isMultiStep = false, showAlert = false) => {
    let current_index = `${this.props.allDaysCards.selected_week}${this.props.allDaysCards.selected_day}`;
    let postData = {
      // user_id: this.props.loginData["user"]["_id"],
      // language: this.props.user_language,
      // content_id: this.props.allDaysCards.all_cards[current_index].content_id,
      progId: this.props.selectedProgram._id,
      ...answerDetails,
    };
    console.log("API_Calling_1111", this.props.allDaysCards?.currentCard);
    this.props.AppActions.addQueAnsDataApi(
      postData,
      false,
      this.props.componentId,
      "learning",
      this.props.user_language,
      this.props.allDaysCards?.currentCard._id
    );
    if (isMultiStep) {
      if (this.props.allDaysCards.current_step == 3) {
        this.setState(
          {
            alert_desc: strings.cards.step_thanks,
          },
          () => {
            this.setState({
              showPopUp: true,
            });
            //  this.props.AppActions.togglePopup(true);
          }
        );
      }
    }
    if (showAlert) {
      this.props.allDaysCards?.currentCard?.question_response[
        this.props.user_language
      ] !== "" &&
        this.setState(
          {
            alert_desc:
              this.props.allDaysCards?.currentCard?.question_response[
                this.props.user_language
              ] !== ""
                ? this.props.allDaysCards?.currentCard?.question_response[
                    this.props.user_language
                  ]
                : strings.cards.step_thanks,
          },
          () => {
            this.setState({
              showPopUp: true,
            });
            // this.props.AppActions.togglePopup(true);
          }
        );
    }
  };

  //API Call for template 14
  addTrackerValueDataApi = (answerDetails) => {
    let postData = {
      user_id: this.props.loginData["user"]["_id"],
      language: this.props.user_language,
      ...answerDetails,
    };

    this.props.AppActions.addTrackerValueDataApi(
      postData,
      false,
      this.props.componentId,
      "learning",
      (res) => {}
    );
  };

  /**When user click on submit question in Template 9 assesment*/
  onAnswerSubmitAssement = (answerDetails, score) => {
    let postData = {
      user_id: this.props.loginData["user"]["_id"],
      language: this.props.user_language,
      ...answerDetails,
    };
    this.props.AppActions.addQueAnsDataAssesmentApi(
      postData,
      false,
      this.props.componentId,
      "learning",
      (res) => {
        this.setState(
          {
            alert_desc: score,
          },
          () => {
            //  this.props.AppActions.togglePopup(true);
            this.setState({
              showPopUp: true,
            });
          }
        );
      },
      this.props.user_language
    );
  };

  /**When user click on submit in Template 10 assesment*/
  onAnswerSubmitPanTemp = (answerDetails, msg) => {
    let postData = {
      user_id: this.props.loginData["user"]["_id"],
      language: this.props.user_language,
      answerDetails,
    };
    this.props.AppActions.savePanData(postData, this.props.user_language);
    if (msg) {
      this.setState(
        {
          alert_desc: msg != "" ? msg : strings.cards.step_thanks,
        },
        () => {
          //  this.props.AppActions.togglePopup(true);
          this.setState({
            showPopUp: true,
          });
        }
      );
    }
  };

  /**When user click on submit in Template 10 assesment*/
  getCurrentCardData = (id) => {
    let postData = {
      user_id: this.props.loginData["user"]["_id"],
      language: this.props.user_language,
      card_id: id,
    };
    this.props.AppActions.getCurrentCardData(postData);
  };

  onEditCommitment = (answerDetails, index, msg) => {
    let postData = {
      user_id: this.props.loginData["user"]["_id"],
      language: this.props.user_language,
      type: "editListing",
      contentIndex: index,
      answerDetails,
    };
    this.props.AppActions.saveCommitment(postData);
  };

  /**When user liked the card */
  onUserActionPerform = (
    data,
    msg = "",
    isMultiStep = false,
    showCustomPopUp = false
  ) => {
    let param = {};
    if (this.props.selectedProgram.stage == null) {
      param = {
        progId: this.props.selectedProgram._id,
        ...data,
      };
    } else {
      param = {
        ...data,
        progId: this.props.selectedProgram._id,
        stage: this.props.allDaysCards.currentCard.stage,
      };
      delete param["week"];
      delete param["day"];
    }
    if (isMultiStep) {
      if (this.props.allDaysCards.current_step == 3) {
        this.setState(
          {
            alert_desc: strings.cards.step_thanks,
          },
          () => {
            this.setState({
              showPopUp: true,
            });
            //  this.props.AppActions.togglePopup(true);
          }
        );
      }
    }

    if (showCustomPopUp && msg !== "") {
      this.showCustomAlert({ alert_desc: msg });
      this.props.AppActions.userActionCard(param, "", "learning");
    } else {
      this.props.AppActions.userActionCard(param, msg, "learning");
    }
  };

  showCustomAlert = (param) => {
    this.setState(
      {
        alert_desc: param.alert_desc,
      },
      () => {
        this.setState({
          showPopUp: true,
        });
      }
    );
  };

  /**When user liked the card */
  onCardLiked = (data) => {
    let param = {};
    if (this.props.selectedProgram.stage == null) {
      param = {
        progId: this.props.selectedProgram._id,
        ...data,
      };
    } else {
      param = {
        ...data,
        progId: this.props.selectedProgram._id,
        stage: this.props.allDaysCards.currentCard.stage,
      };
      delete param["week"];
      delete param["day"];
    }
    console.log("like program ID===>", param);
    this.props.AppActions.userActionCard(param);
  };
  /**When user comment the card */
  onCommentAdd = (comment) => {
    this.setState({ showCommentModal: false, releftModal: false, reflact: "" });
    let postData = {
      progId: this.props.selectedProgram._id,
      action: { usercomments: comment },
      day: this.props.allDaysCards.currentCard.day,
      week: this.props.allDaysCards.currentCard.week,
      cardId: this.props.allDaysCards.currentCard._id,
    };
    if (this.props.selectedProgram.stage != null) {
      postData = {
        ...postData,
        progId: this.props.selectedProgram._id,
        stage: this.props.allDaysCards.currentCard.stage,
      };
      delete postData["week"];
      delete postData["day"];
    }
    console.log(`postData`, postData);
    setTimeout(() => {
      this.props.AppActions.userActionCard(postData);
    }, 500);
  };

  onCommentClick = (data) => {
    this.setState({
      showCommentModal: true,
      card_id: data.card_id,
    });
  };
  onReflectClick = (data) => {
    this.setState({
      releftModal: true,
      card_id: data.card_id,
    });
  };

  _updateWeekDayAPI = (allCardsRead) => {
    // let { loginData } = this.props;
    // let postData;
    // if (allCardsRead) {
    //   postData = {
    //     user_id: loginData['user']['_id'],
    //     allCardsReaded: allCardsRead,
    //     patientDate: moment().format(STRINGS.DATE_FORMAT_PATIENT),
    //     timeZone: currentTimeZone,
    //     day: this.props.allDaysCards.selected_day,
    //     week: this.props.allDaysCards.selected_week,
    //     isCurrentWeekDay:
    //       checkNextDayUnlocked(
    //         this.props.allDaysCards.selected_week,
    //         this.props.allDaysCards.selected_day,
    //         this.props.playlistReducer.playlistDynamicRes.week,
    //         this.props.playlistReducer.playlistDynamicRes.day,
    //         this.props.playlistReducer.playlistDynamicRes.totalWeekDays,
    //       ) == null
    //         ? true
    //         : false,
    //     isPointedCardReaded:
    //       checkNextDayUnlocked(
    //         this.props.allDaysCards.selected_week,
    //         this.props.allDaysCards.selected_day,
    //         this.props.playlistReducer.playlistDynamicRes
    //           .dailyLearningPointedWeek,
    //         this.props.playlistReducer.playlistDynamicRes
    //           .dailyLearningPointedDay,
    //         this.props.playlistReducer.playlistDynamicRes.totalWeekDays,
    //       ) == null
    //         ? true
    //         : false,
    //   };
    // } else {
    //   postData = {
    //     user_id: loginData['user']['_id'],
    //   };
    //   this.setState({ isUpdateWeekDatAPI: true });
    // }
    // this.props.AppActions.updatePatientWeekDay(postData, allCardsRead);
  };

  getSpecificaDayCard = (data) => {
    let postData = {
      week: data.new_week,
      day: data.new_day,
      // user_id: this.props.loginData["user"]["_id"],
      language: this.props.user_language,
    };
    this.props.AppActions.getCardsforDay(postData, 0, (res) => {
      this.setCardsArray(data.new_week, data.new_day);
    });
  };

  updateCurrentCardCount = (data) => {
    this.props.AppActions.updateSelectedWeekDay({
      day: data.day,
      week: data.week,
    });
  };

  /**On Swipe Event */
  onSwipeHandler = (type, data) => {
    console.log("on swipe", type, this.props.allDaysCards.currentCard);
    switch (type) {
      case "right":
        this.props.AppActions.changeCardData("back", this.props.componentId);
        break;
      case "left":
        if (
          this.props.allDaysCards.currentCard?.template == 2 ||
          this.props.allDaysCards.currentCard?.template == 9 ||
          this.props.allDaysCards.currentCard?.template == 9 ||
          this.props.allDaysCards.currentCard?.template == 11 ||
          this.props.allDaysCards.currentCard?.template == 13 ||
          this.props.allDaysCards.currentCard?.template == 15 ||
          this.props.allDaysCards.currentCard?.template == 16 ||
          this.props.allDaysCards.currentCard?.template == 17 ||
          this.props.allDaysCards.currentCard?.template == 18 ||
          this.props.allDaysCards.currentCard?.template == 19 ||
          this.props.allDaysCards.currentCard?.template == 21 ||
          this.props.allDaysCards.currentCard?.template == 23 ||
          this.props.allDaysCards.currentCard?.template == 25 ||
          this.props.allDaysCards.currentCard?.template == 24 ||
          this.props.allDaysCards.currentCard?.template == 10 ||
          this.props.allDaysCards.currentCard?.template == 7
          // this.props.allDaysCards.currentCard?.template == 22
        ) {
          // if (
          //   this.props.allDaysCards.currentCard?.template == 2 ||
          //     this.props.allDaysCards.currentCard?.template == 11 ||
          //     this.props.allDaysCards.currentCard?.template == 13 ||
          //     this.props.allDaysCards.currentCard?.template == 18 ||
          //     this.props.allDaysCards.currentCard?.template == 7
          //     ?
          //     checkHeaderData(this.props.allDaysCards.currentCard)
          //     // checkIfAllQuestionNotAnswered(
          //     //   this.props.allDaysCards.currentCard
          //     // )
          //     : this.props.allDaysCards.currentCard?.template == 15 ||
          //       this.props.allDaysCards.currentCard?.template == 16 ||
          //       this.props.allDaysCards.currentCard?.template == 17 ||
          //       this.props.allDaysCards.currentCard?.template == 19 ||
          //       this.props.allDaysCards.currentCard?.template == 21 ||
          //       this.props.allDaysCards.currentCard?.template == 23 ||
          //       this.props.allDaysCards.currentCard?.template == 24 ||
          //       this.props.allDaysCards.currentCard?.template == 25
          //       ? checkHeaderData(this.props.allDaysCards.currentCard)
          //       : checkHeaderData(this.props.allDaysCards.currentCard)
          //   // checkQuesInvalidAssement(this.props.allDaysCards.currentCard)
          // ) {
          //   showEmptyAlert();
          //   return;
          // }
          if (
            checkHeaderData(this.props.allDaysCards.currentCard)
            // false
          ) {
            showEmptyAlert();
            return;
          }
          const params = {
            progId: this.props.activeProgram._id,
            userId: this.props.loginData.profile._id,
            cardId: this.props.allDaysCards.currentCard._id,
            progName: this.props.activeProgram.name,
            cardTitle: this.props.allDaysCards.currentCard.title,
            cardNumber: this.props.allDaysCards.currentCard.cardNumber,
            isAction: this.props.allDaysCards.currentCard?.action
              ? true
              : false,
            day: !this.props.allDaysCards.currentCard.stage
              ? this.props.allDaysCards.currentCard.selected_day
              : null,
            week: !this.props.allDaysCards.currentCard.stage
              ? this.props.allDaysCards.currentCard.selected_week
              : null,
            stage: this.props.allDaysCards.currentCard.stage,
            section: this.props.allDaysCards.currentCard?.section,
            progType: this.props.activeProgram.progType,
            isLastCard:
              this.props.allDaysCards.total_cards ==
              this.props.allDaysCards.current_card
                ? true
                : false,
            cardReadOn: new Date(),
            deviceDetails: {
              deviceType: DeviceInfo.getSystemName(),
              deviceName: DeviceInfo.getBrand(),
              systemVersion: DeviceInfo.getModel(),
              ...getIPAdreessData(),
            },
          };
          let isChat;
          console.log("card data=====>", params);
          this.props.type == "chatBot" || this.props.type == "Home"
            ? this.props.AppActions.setCardProgramTrack(params)
            : null;
          {
            isChat =
              this.props.type == "chatBot" || this.props.type == "Home"
                ? true
                : false;
          }
          this.props.AppActions.changeCardData(
            "next",
            this.props.componentId,
            isChat,
            (res) => {
              console.log("changeCardData============>", res);
              if (res == "unlock") {
                this._updateWeekDayAPI(true);
                setTimeout(() => {
                  this._updateWeekDayAPI(false);
                }, 500);
              }
            }
          );
          this.props.AppActions.getLastCardReadData();
        } else {
          console.log("card swife===>", this.props.allDaysCards.currentCard);
          const params = {
            progId: this.props.activeProgram._id,
            userId: this.props.loginData.profile._id,
            cardId: this.props.allDaysCards.currentCard._id,
            progName: this.props.activeProgram.name,
            cardTitle: this.props.allDaysCards.currentCard.title,
            cardNumber: this.props.allDaysCards.currentCard.cardNumber,
            isAction: this.props.allDaysCards.currentCard?.action
              ? true
              : false,
            day: !this.props.allDaysCards.currentCard.stage
              ? this.props.allDaysCards.currentCard.selected_day
              : null,
            week: !this.props.allDaysCards.currentCard.stage
              ? this.props.allDaysCards.currentCard.selected_week
              : null,
            stage: this.props.allDaysCards.currentCard.stage,
            section: this.props.allDaysCards.currentCard.section,
            progType: this.props.activeProgram.progType,
            section: this.props.allDaysCards.currentCard?.section,
            isLastCard:
              this.props.allDaysCards.total_cards ==
              this.props.allDaysCards.current_card
                ? true
                : false,
            cardReadOn: new Date(),
            deviceDetails: {
              deviceType: DeviceInfo.getSystemName(),
              deviceName: DeviceInfo.getBrand(),
              systemVersion: DeviceInfo.getModel(),
              ...getIPAdreessData(),
            },
          };
          console.log("card data=====>", params);
          this.props.type == "chatBot" || this.props.type == "Home"
            ? this.props.AppActions.setCardProgramTrack(params)
            : null;

          this.props.AppActions.changeCardData(
            "next",
            this.props.componentId,
            (res) => {
              if (res == "unlock") {
                console.log("here rrrrr===>");
                //    this._updateWeekDayAPI(true);
                setTimeout(() => {
                  //  this._updateWeekDayAPI(false);
                }, 500);
              }
            }
          );
          this.props.AppActions.getLastCardReadData();
        }
        break;
      default:
        break;
    }
  };

  onFeedbackClick = (postData) => {
    postData["user_id"] = this.props.loginData["user"]["_id"];
    this.props.AppActions.addQueAnsDataApi(
      postData,
      false,
      this.props.componentId,
      "learning",
      this.props.user_language
    );
  };

  onPopupOkayPress = () => {
    this.props.AppActions.togglePopup(false);
    this.setState({
      showPopUp: false,
    });
    this.setState({
      alert_desc: "",
    });
  };
  /**Render specific template based on Template number */
  renderSpecificTemplate = () => {
    console.log(
      "reached there===>",
      this.props.allDaysCards.currentCard?.template
    );
    switch (this.props.allDaysCards.currentCard?.template) {
      /**Simple Title Description with Image */
      case 1:
        return (
          <TemplateOneComponent
            user_language={this.props.user_language}
            cardData={this.props.allDaysCards.currentCard}
            cardState={this.props.allDaysCards}
            onCommentClick={(data) => this.onCommentClick(data)}
            onLikeClick={(data) => {
              this.onCardLiked(data);
            }}
            setRef={(ref) => {
              ref.presentFullscreenPlayer();
            }}
            showFullScreenVideo={(video) => {
              setTimeout(() => {
                this.setState({
                  showVideoModal: true,
                  videoURL: video,
                });
              }, Orientation.unlockAllOrientations());
            }}
          />
        );
      /**Ques and Card Card */
      case 2:
        return (
          <TemplateTwoComponent
            onCommentClick={(data) => this.onCommentClick(data)}
            cardState={this.props.allDaysCards}
            onLikeClick={(data) => {
              this.onCardLiked(data);
            }}
            onSubmit={(answerDetails, msg) => {
              this.onUserActionPerform(answerDetails, msg, false, true);
            }}
            cardData={this.props.allDaysCards.currentCard}
          />
        );
      /**Expandable Content Card */
      case 3:
        return (
          <TemplateThree
            user_language={this.props.user_language}
            onCommentClick={(data) => this.onCommentClick(data)}
            cardState={this.props.allDaysCards}
            onLikeClick={(data) => {
              this.onCardLiked(data);
            }}
            cardData={this.props.allDaysCards.currentCard}
          />
        );
      /**Trackers Card */
      case 4:
        return (
          <TemplateFour
            user_language={this.props.user_language}
            cardState={this.props.allDaysCards}
            onSubmit={(answerDetails, msg = "") => {
              this.onUserActionPerform(answerDetails, msg, false, true);
            }}
            onLikeClick={(data) => {
              this.onCardLiked(data);
            }}
            onCommentClick={(data) => this.onCommentClick(data)}
            trackerClick={(type) => {
              this.onTrackerSelection(type);
            }}
            cardData={this.props.allDaysCards.currentCard}
          />
        );
      /**Thought Journal Alternative thoughts and behaviour */
      case 5:
        return (
          <TemplateFive
            onSubmit={(answerDetails, msg = "") => {
              this.onUserActionPerform(answerDetails, msg, false, true);
            }}
            cardState={this.props.allDaysCards}
            onCommentClick={(data) => this.onCommentClick(data)}
            cardData={this.props.allDaysCards.currentCard}
            setRef={(ref) => {
              ref.presentFullscreenPlayer();
            }}
            showFullScreenVideo={(video) => {
              setTimeout(() => {
                this.setState({
                  showVideoModal: true,
                  videoURL: video,
                });
              }, Orientation.unlockAllOrientations());
            }}
          />
        );
      /**Yes no button format */
      case 6:
        return (
          <TemplateSix
            cardState={this.props.allDaysCards}
            onSubmit={(answerDetails, msg = "") => {
              this.onUserActionPerform(answerDetails, msg, false, true);
            }}
            onCommentClick={(data) => this.onCommentClick(data)}
            cardData={this.props.allDaysCards.currentCard}
            showFullScreenVideo={(video) => {
              console.log(video, "video....");
              setTimeout(() => {
                this.setState({
                  showVideoModal: true,
                  videoURL: video,
                });
              }, Orientation.unlockAllOrientations());
            }}
          />
        );
      /**Multi Step Card */
      case 7:
        return (
          <TemplateSeven
            user_language={this.props.user_language}
            onCommentClick={(data) => this.onCommentClick(data)}
            onLikeClick={(data) => {
              this.onCardLiked(data);
            }}
            cardState={this.props.allDaysCards}
            cardData={this.props.allDaysCards.currentCard}
            currentStep={this.props.allDaysCards}
            onSubmit={(answerDetails, msg) => {
              this.onUserActionPerform(answerDetails, msg, false, true);
            }}
          />
        );
      /**Quotes Card */
      case 8:
        return (
          <TemplateEight
            user_language={this.props.user_language}
            onCommentClick={(data) => this.onReflectClick(data)}
            onLikeClick={(data) => {
              this.onCardLiked(data);
            }}
            cardData={this.props.allDaysCards.currentCard}
          />
        );
      /** EPDS assesment */
      case 9:
        return (
          <TemplateNine
            user_language={this.props.user_language}
            cardData={this.props.allDaysCards.currentCard}
            onCommentClick={(data) => this.onCommentClick(data)}
            onLikeClick={(data) => {
              this.onCardLiked(data);
            }}
            onSubmit={(answerDetails, msg) => {
              // this.onAnswerSubmitAssement(answerDetails, score);
              this.onUserActionPerform(answerDetails);
            }}
          />
        );
      /** Pan Balance */
      case 10:
        return (
          <TemplateTen
            onCommentClick={(data) => this.onCommentClick(data)}
            cardState={this.props.allDaysCards}
            onLikeClick={(data) => {
              this.onCardLiked(data);
            }}
            onSubmit={(answerDetails, msg = "") => {
              this.onUserActionPerform(answerDetails, msg, false, true);
            }}
            cardData={this.props.allDaysCards.currentCard}
          />
        );
      /**  Text Input on Background Image */
      case 11:
        return (
          <TemplateEleven
            user_language={this.props.user_language}
            cardData={this.props.allDaysCards.currentCard}
            onSubmit={(answerDetails, msg) => {
              this.onUserActionPerform(answerDetails, msg, false, true);
            }}
            onCommentClick={(data) => this.onCommentClick(data)}
            onLikeClick={(data) => {
              this.onCardLiked(data);
            }}
          />
        );
      /*** Multi Step Questions */
      case 12:
        return (
          <TemplateTwelve
            onCommentClick={(data) => this.onCommentClick(data)}
            cardState={this.props.allDaysCards}
            onLikeClick={(data) => {
              this.onCardLiked(data);
            }}
            onSubmit={(
              answerDetails,
              msg = "",
              multistep = false,
              customMsg = true
            ) => {
              this.onUserActionPerform(
                answerDetails,
                msg,
                multistep,
                customMsg
              );
            }}
            cardData={this.props.allDaysCards.currentCard}
          />
        );
      /**W3D2C4 of Mamalift App text input with heading in table */
      case 13:
        return (
          <TemplateThirteen
            user_language={this.props.user_language}
            cardData={this.props.allDaysCards.currentCard}
            onSubmit={(answerDetails, msg) => {
              this.onUserActionPerform(answerDetails, msg, false, true);
            }}
            onCommentClick={(data) => this.onCommentClick(data)}
            onLikeClick={(data) => {
              this.onCardLiked(data);
            }}
          />
        );
      /**Common range slider like question */
      case 14:
        return (
          <TemplateFourteen
            onCommentClick={(data) => this.onCommentClick(data)}
            cardState={this.props.allDaysCards}
            onLikeClick={(data) => {
              this.onCardLiked(data);
            }}
            onSubmit={(answerDetails, msg = "") => {
              this.onUserActionPerform(answerDetails, msg, false, true);
            }}
            cardData={this.props.allDaysCards.currentCard}
          />
        );
      /**Drag Drop Template */
      case 15:
        return (
          <TemplateTwentySix
            onCommentClick={(data) => this.onCommentClick(data)}
            cardState={this.props.allDaysCards}
            onLikeClick={(data) => {
              this.onCardLiked(data);
            }}
            onSubmit={(answerDetails, msg = "") => {
              this.onUserActionPerform(answerDetails, msg, false, true);
            }}
            cardData={this.props.allDaysCards.currentCard}
          />
        );
      /**Multi Step Pregancy Comparison */
      case 16:
        return (
          <MutiStepPreg
            onCommentClick={(data) => this.onCommentClick(data)}
            cardState={this.props.allDaysCards}
            onLikeClick={(data) => {
              this.onCardLiked(data);
            }}
            onSubmit={(answerDetails, msg = "") => {
              this.onUserActionPerform(answerDetails, msg, false, true);
            }}
            cardData={this.props.allDaysCards.currentCard}
          />
        );
      /**Thermometer Template */
      case 17:
        return (
          <ThermometerTemplate
            onCommentClick={(data) => this.onCommentClick(data)}
            cardState={this.props.allDaysCards}
            onLikeClick={(data) => {
              this.onCardLiked(data);
            }}
            onSubmit={(answerDetails, msg = "") => {
              this.onUserActionPerform(answerDetails, msg, false, true);
            }}
            cardData={this.props.allDaysCards.currentCard}
          />
        );
      /** Text Input with image. What did i do */
      case 18:
        return (
          <TemplateEighteen
            onCommentClick={(data) => this.onCommentClick(data)}
            cardState={this.props.allDaysCards}
            onLikeClick={(data) => {
              this.onCardLiked(data);
            }}
            onSubmit={(answerDetails, msg = "") => {
              this.onUserActionPerform(answerDetails, msg, false, true);
            }}
            cardData={this.props.allDaysCards.currentCard}
          />
        );
      /**Social Support need with 2 exercise */
      case 19:
        return (
          <TemplateNineteen
            onCommentClick={(data) => this.onCommentClick(data)}
            cardState={this.props.allDaysCards}
            onLikeClick={(data) => {
              this.onCardLiked(data);
            }}
            onSubmit={(answerDetails, msg = "") => {
              this.onUserActionPerform(answerDetails, msg, false, true);
            }}
            cardData={this.props.allDaysCards.currentCard}
          />
        );
      /** Value compass */
      case 20:
        return (
          <TemplateTwenty
            onCommentClick={(data) => this.onCommentClick(data)}
            cardState={this.props.allDaysCards}
            onLikeClick={(data) => {
              this.onCardLiked(data);
            }}
            onSubmit={(answerDetails, msg = "") => {
              this.onUserActionPerform(answerDetails, msg, false, true);
            }}
            cardData={this.props.allDaysCards.currentCard}
            onEdit={(data, index) => {
              this.onEditCommitment(data, index);
            }}
          />
        );
      /**Social Support Network W3D2C4 prevent */
      case 21:
        return (
          <TemplateTwentyOne
            onCommentClick={(data) => this.onCommentClick(data)}
            cardState={this.props.allDaysCards}
            onLikeClick={(data) => {
              this.onCardLiked(data);
            }}
            onSubmit={(answerDetails, msg = "") => {
              this.onUserActionPerform(answerDetails, msg, false, true);
            }}
            cardData={this.props.allDaysCards.currentCard}
          />
        );

      /** Support Network List SOS */
      case 22:
        return (
          <TemplateTwentyTwo
            onCommentClick={(data) => this.onCommentClick(data)}
            cardState={this.props.allDaysCards}
            onLikeClick={(data) => {
              this.onCardLiked(data);
            }}
            onSubmit={(answerDetails, msg = "") => {
              this.onUserActionPerform(answerDetails, msg, false, true);
            }}
            cardData={this.props.allDaysCards.currentCard}
          />
        );
      case 23:
        return (
          <TemplateTwentyThree
            onCommentClick={(data) => this.onCommentClick(data)}
            cardState={this.props.allDaysCards}
            onLikeClick={(data) => {
              this.onCardLiked(data);
            }}
            onSubmit={(answerDetails, msg = "") => {
              this.onUserActionPerform(answerDetails, msg, false, true);
            }}
            cardData={this.props.allDaysCards.currentCard}
          />
        );
      case 24:
        return (
          <TemplateTwentyFour
            onCommentClick={(data) => this.onCommentClick(data)}
            cardState={this.props.allDaysCards}
            onLikeClick={(data) => {
              this.onCardLiked(data);
            }}
            onSubmit={(answerDetails, msg = "") => {
              this.onUserActionPerform(answerDetails, msg, false, true);
            }}
            cardData={this.props.allDaysCards.currentCard}
          />
        );
      /**W5D2C7 of prevent Header with subheading Help seeking plan */
      case 25:
        return (
          <TemplateTwentyFive
            onCommentClick={(data) => this.onCommentClick(data)}
            cardState={this.props.allDaysCards}
            onLikeClick={(data) => {
              this.onCardLiked(data);
            }}
            onSubmit={(answerDetails, msg = "") => {
              this.onUserActionPerform(answerDetails, msg, false, true);
            }}
            cardData={this.props.allDaysCards.currentCard}
          />
        );
      default:
        return null;
        break;
    }
  };

  render() {
    let { loginData, week, day, screenType, getWeekDayData } = this.props;
    let currentWeek = week !== undefined ? week : 1;
    let currentDay = day !== undefined ? day : 1;
    let dynamicTitle = "Week " + currentWeek + "  Day " + currentDay;

    console.log("data==>", this.props.allDaysCards);
    console.log("CareConsern==>", this.props);

    return (
      <View style={Styles.homeContainer}>
        {screenType == "careConcerns" ? (
          <Header
            isLeftIcon={true}
            onLeftIconClick={() => this._goBack()}
            isLogout={false}
            isTitle={true}
            title={
              this.props.screen_title
                ? this.props.screen_title
                : "Care Concerns"
            }
            titleStyle={{
              fontSize: RFValue(20),
              paddingTop: RFValue(10),
            }}
          />
        ) : (
          <Header
            isLeftIcon={true}
            onLeftIconClick={() => this._goBack()}
            isTitle={true}
            isLogout={false}
            title={
              this.props.allDaysCards?.currentCard?.stage &&
              this.props.activeProgram?.stageName
                ? this.props.activeProgram?.stageName[
                    this.props.allDaysCards?.currentCard?.stage > 0
                      ? this.props.allDaysCards?.currentCard?.stage - 1
                      : 1
                  ]?.name
                : `${strings.resource.Week} ${this.props.allDaysCards.selected_week} ${strings.home.day} ${this.props.allDaysCards.selected_day}`
            }
            titleStyle={{
              fontSize: RFValue(28),
              paddingTop: RFValue(10),
            }}
            // primary={this.props.themeData.primary}
          />
        )}

        <View style={Styles.outerContainer}>
          <View
            style={{
              flex: !this.props.allDaysCards.currentCard?.stage ? 0.06 : 0,
              marginTop: !this.props.allDaysCards.currentCard?.stage
                ? RFValue(10)
                : 0,
              marginHorizontal: RFValue(10),
              marginBottom: !this.props.allDaysCards.currentCard?.stage
                ? RFValue(12)
                : 0,
            }}
          >
            {this.props.allDaysCards.currentCard
              ? !this.props.allDaysCards.currentCard?.stage && (
                  <View style={{ marginTop: RFValue(8) }}>
                    <Slider
                      trackStyle={Styles.track}
                      value={
                        this.props.allDaysCards.total_cards == 0
                          ? this.props.allDaysCards.current_card + 1
                          : this.props.allDaysCards.current_card
                      }
                      maximumTrackTintColor={COLOR.PRIMARY}
                      minimumTrackTintColor={COLOR.DARK_GREEN}
                      thumbStyle={Styles.thumb}
                      maximumValue={this.props.allDaysCards.total_cards}
                      disabled={true}
                      animateTransitions={true}
                      useNativeDriver={true}
                    />
                    <View style={Styles.bubbleView}>
                      {[...Array(this.props.allDaysCards.total_cards + 1)].map(
                        (e, i) => (
                          <View style={Styles.bubbles} />
                        )
                      )}
                    </View>
                  </View>
                )
              : alert(strings.Content_not_available)}
            {this.props.allDaysCards.currentCard?.stage && (
              <View
                style={[
                  Styles.cardNumberStyle,
                  {
                    width: "100%",
                    marginTop: RFValue(2),
                    flexDirection: "row",
                    zIndex: 1000,
                    // position: "absolute",
                    top: RFValue(11),
                    backgroundColor: "transparent",
                  },
                ]}
              >
                <Text
                  style={[Styles.CardNumberText, { marginLeft: RFValue(6) }]}
                >
                  {this.props.allDaysCards.current_card + 1}
                </Text>
                {this.props.allDaysCards?.currentCard?.section && (
                  <Text style={[Styles.sectionName]}>
                    {this.props.allDaysCards?.currentCard?.section}
                  </Text>
                )}
                <Text
                  style={[
                    Styles.CardNumberText,
                    { position: "absolute", right: RFValue(5) },
                  ]}
                >
                  {this.props.allDaysCards.total_currunt_cards + 1}
                </Text>
              </View>
            )}

            {
              !this.props.allDaysCards.currentCard?.stage && (
                <View style={Styles.cardNumberStyle}>
                  <Text style={Styles.CardNumberText}>
                    {this.props.allDaysCards.current_card +
                      1 +
                      "/" +
                      (this.props.allDaysCards.total_cards + 1)}
                  </Text>
                </View>
              )
              // (
              //   <View style={{ width: "100%", marginLeft: 10 }}>
              //     <Text style={Styles.sectionName}>
              //       {this.props.allDaysCards?.currentCard?.section}
              //     </Text>
              //   </View>
              // )
            }
          </View>

          <View style={{ flex: 1 }}>
            {Platform.OS == "ios" ? (
              <ScrollView
                ref={(ref) => {
                  this.scrollView = ref;
                }}
                onContentSizeChange={() => this.scrollView.scrollTo(0)}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  flexGrow: 1,

                  // flex: 1,
                }}
                nestedScrollEnabled={true}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
                style={{ zIndex: 10 }}
                bounces={true}
              >
                <GestureRecognizer
                  onSwipeLeft={(state) => this.onSwipeHandler("left", state)}
                  onSwipeRight={(state) => this.onSwipeHandler("right", state)}
                  config={config}
                  bounces={true}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ flexGrow: 1 }}
                  nestedScrollEnabled={true}
                  keyboardShouldPersistTaps="always"
                  keyboardDismissMode="on-drag"
                  style={{ zIndex: 10 }}
                >
                  {this.renderSpecificTemplate()}
                </GestureRecognizer>
              </ScrollView>
            ) : (
              <ScrollView
                ref={(ref) => {
                  this.scrollView = ref;
                }}
                onContentSizeChange={() => this.scrollView.scrollTo(0)}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
                nestedScrollEnabled={true}
                keyboardShouldPersistTaps="always"
                keyboardDismissMode="on-drag"
                style={{
                  zIndex: 10,
                  // marginBottom: 30,
                }}
                bounces={true}
              >
                <GestureRecognizer
                  onSwipeLeft={(state) => this.onSwipeHandler("left", state)}
                  onSwipeRight={(state) => this.onSwipeHandler("right", state)}
                  config={config}
                  bounces={true}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ flexGrow: 1 }}
                  nestedScrollEnabled={true}
                  style={{}}
                >
                  {this.renderSpecificTemplate()}
                </GestureRecognizer>
              </ScrollView>
            )}
          </View>
        </View>

        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.showHint}
          onRequestClose={() => {
            // Alert.alert("Modal has been closed.");
            // this.setModalVisible(!modalVisible);
            this.setState({ showHint: false });
          }}
        >
          <HintModal
            closeModal={() => {
              this.setState({ showHint: false });
            }}
          />
        </Modal>
        <Modal
          transparent
          visible={this.state.showVideoModal}
          onRequestClose={() => {
            this.setState({ showVideoModal: false });
            setTimeout(() => {
              Orientation.lockToPortrait();
            }, 1500);
          }}
          supportedOrientations={[
            "landscape-left",
            "portrait",
            "landscape-right",
          ]}
          animationType={"slide"}
        >
          <CustomVideoPlayer
            closeModal={() => {
              this.setState({ showVideoModal: false });
              setTimeout(() => {
                Orientation.lockToPortrait();
              }, 1500);
            }}
            url={this.state.videoURL}
          />
        </Modal>

        <Modal
          transparent={true}
          visible={this.state.showCommentModal}
          onRequestClose={() => {
            this.setState({ showCommentModal: false });
          }}
        >
          <CommentModal
            addComment={(comment) => this.onCommentAdd(comment)}
            closeModal={() => {
              this.setState({ showCommentModal: false });
            }}
          />
        </Modal>
        <AlertModal
          visible={this.state.showPopUp}
          description={this.state.alert_desc}
          onYesPress={this.onPopupOkayPress}
        />
      </View>
    );
  }
}

const mapStateToProps = ({
  authReducer,
  dashboardReducer,
  playlistReducer,
  cardsReducer,
  programReducer,
}) => ({
  getWeekDayData: dashboardReducer.getDailyCBTData,
  isLoggedIn: authReducer.isLoggedIn,
  loginData: authReducer.loginData,
  allDaysCards: cardsReducer,
  playlistReducer: playlistReducer,
  popupStatus: dashboardReducer.isPopupShow,
  user_language: authReducer.language,
  selectedProgram: programReducer.selectedProgram,
  activeProgram: programReducer.activeProgramDetail,
  trackers: dashboardReducer.getAllTrackers,
  activeScreenStartTime: dashboardReducer.getScreenStartTime,

  //themeData: authReducer
});

const mapDispatchToProps = (dispatch) => ({
  AppActions: bindActionCreators(AppActions, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(WeekInfoList);
