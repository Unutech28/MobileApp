/* eslint-disable prettier/prettier */
/* eslint-disable module-resolver/use-alias */
import GLOBALS from "@constants";
import * as AppActions from "@actions";
import { ThemeContext } from "@hoc/withRedux";
import React, { Component, lazy } from "react";
import { alertWithOneBtn } from "@helpers/common";
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
} from "react-native";
const { COLOR, FONTS, STRINGS } = GLOBALS;
import { strings } from "@localization";
import Styles from "./styles";
import { Slider } from "@miblanchard/react-native-slider";
import { RFValue } from "react-native-responsive-fontsize";
import { connect } from "react-redux";
import { navigatorPop, navigatorPush } from "@config/navigationOptions";
import { bindActionCreators } from "redux";
const Header = lazy(() => import("@components/common/Header"));
import moment from "moment";
import GestureRecognizer from "../../../updatedNodeModules/react-native-swipe-gestures";
const DailyLearningTemplateComponent = lazy(() =>
  import("@components/dashboard/dailyLearningTemplates")
);
const CommentModal = lazy(() =>
  import("@components/dashboard/dailyLearningTemplates/modal/Comment.js")
);
const ReflactModal = lazy(() =>
  import("@components/dashboard/dailyLearningTemplates/modal/ReflectModal.js")
);
// import HintModal from '@components/common/HintModal';

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

import TemplateThree from "@containers/dashboard/dailyLearningTemplates/template/templateThree";
import TemplateFour from "@containers/dashboard/dailyLearningTemplates/template/templateFour";
import TemplateSix from "@containers/dashboard/dailyLearningTemplates/template/TemplateSix";
// import TemplateSeven from '@containers/dashboard/dailyLearningTemplates/template/TemplateSeven';
import TemplateEight from "@containers/dashboard/dailyLearningTemplates/template/TemplateEight";
import TemplateNine from "@containers/dashboard/dailyLearningTemplates/template/TemplateNine";

const TemplateSeven = lazy(() =>
  import("@components/dashboard/dailyLearningTemplates/template/TemplateSeven")
);

const config = {
  velocityThreshold: 0.3,
  directionalOffsetThreshold: 80,
};
class SwipeCards extends Component {
  static contextType = ThemeContext;
  constructor(props) {
    super(props);
    this.state = {
      showCommentModal: false,
      releftModal: false,
      array: [1, 2, 3],
    };
    // temp = [];
  }
  componentDidMount() {
    // this.getMarkers();
  }

  /**When user click on submit in Template 10 assesment*/
  getCurrentCardData = (id) => {
    let postData = {
      user_id: this.props.loginData["user"]["_id"],
      language: this.props.user_language,
      card_id: id,
    };
    this.props.AppActions.getCurrentCardData(postData);
  };

  onSaveCommitment = (answerDetails, msg) => {
    let postData = {
      user_id: this.props.loginData["user"]["_id"],
      language: this.props.user_language,
      answerDetails,
    };
    this.props.AppActions.saveCommitment(postData);
    if (msg) {
      this.setState(
        {
          alert_desc: msg != "" ? msg : strings.cards.step_thanks,
        },
        () => {
          this.props.AppActions.togglePopup(true);
        }
      );
    }
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
  onCardLiked = (data) => {
    let postData = {
      user_id: this.props.loginData["user"]["_id"],
      hasUserLiked: true,
      ...data,
    };
    this.props.AppActions.likeCommentRatingApi(postData, "liked");
  };

  /**When user click on submit question in Template 2*/
  onAnswerSubmit = (answerDetails) => {
    let current_index = `${this.props.allDaysCards.selected_week}${this.props.allDaysCards.selected_day}`;
    let postData = {
      user_id: this.props.loginData["user"]["_id"],
      language: this.props.user_language,
      //content_id: this.props.allDaysCards.all_cards[current_index].content_id,
      ...answerDetails,
    };
    this.props.AppActions.addQueAnsDataApi(
      postData,
      false,
      this.props.componentId,
      "liked",
      this.props.user_language
    );
  };

  /**When user comment the card */
  onCommentClick = (data) => {
    this.setState({
      showCommentModal: true,
      card_id: data.card_id,
    });
  };
  /**When user comment the card */
  onCommentAdd = (comment) => {
    this.setState({ showCommentModal: false, releftModal: false, reflact: "" });
    let postData = {
      user_id: this.props.loginData["user"]["_id"],
      hasUserCommented: true,
      comment: comment,
      card_id: this.state.card_id,
    };
    this.props.AppActions.likeCommentRatingApi(postData, "liked");
  };
  /**When user click on Reflect the card */
  onReflectClick = (data) => {
    this.setState({
      releftModal: true,
      card_id: data.card_id,
    });
  };

  /**Render specific template based on Template number */
  renderSpecificTemplate = () => {
    switch (this.props.allDaysCards.currentCard?.template) {
      case 1:
        return (
          <TemplateOneComponent
            user_language={this.props.user_language}
            cardData={this.props.allDaysCards.currentCard}
            onCommentClick={(data) => this.onCommentClick(data)}
            onLikeClick={(data) => {
              this.onCardLiked(data);
            }}
          />
        );
      case 2:
        return (
          <TemplateTwoComponent
            user_language={this.props.user_language}
            onCommentClick={(data) => this.onCommentClick(data)}
            onLikeClick={(data) => {
              this.onCardLiked(data);
            }}
            onSubmit={(answerDetails) => {
              this.onAnswerSubmit(answerDetails);
            }}
            //  onSubmit={(answerDetails) => onAnswerSubmit(answerDetails)}
            cardData={this.props.allDaysCards.currentCard}
          />
        ); /**Ques and Card Card */
      case 3:
        return (
          <TemplateThree
            user_language={this.props.user_language}
            onCommentClick={(data) => this.onCommentClick(data)}
            onLikeClick={(data) => {
              this.onCardLiked(data);
            }}
            cardData={this.props.allDaysCards.currentCard}
          />
        ); /**Expandable Content Card */
      case 4:
        return (
          <TemplateFour
            user_language={this.props.user_language}
            onCommentClick={(data) => this.onCommentClick(data)}
            onLikeClick={(data) => {
              this.onCardLiked(data);
            }}
            trackerClick={(type) => {
              /**Tracker Card */
              this.onTrackerSelection(type);
            }}
            cardData={this.props.allDaysCards.currentCard}
          />
        ); /**Ques and Card Card */
      case 6:
        return (
          <TemplateSix
            user_language={this.props.user_language}
            trackerClick={(type) => {
              this.onTrackerSelection(type);
            }}
            cardData={this.props.allDaysCards.currentCard}
            onLikeClick={(data) => {
              this.onCardLiked(data);
            }}
            onCommentClick={(data) => this.onCommentClick(data)}
          />
        );
      case 7:
        return (
          <TemplateSeven
            user_language={this.props.user_language}
            onCommentClick={(data) => this.onCommentClick(data)}
            onLikeClick={(data) => {
              this.onCardLiked(data);
            }}
            onSubmit={(answerDetails) => {
              this.onAnswerSubmit(answerDetails);
            }}
            currentStep={this.props.allDaysCards}
            cardData={this.props.allDaysCards.currentCard}
          />
        );
      case 8:
        return (
          <TemplateEight
            user_language={this.props.user_language}
            onCommentClick={(data) => this.onReflectClick(data)}
            onLikeClick={(data) => {
              this.onCardLiked(data);
            }}
            cardData={this.props.allDaysCards.currentCard}
            user_id={this.props.loginData["user"]["_id"]}
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
            user_id={this.props.loginData["user"]["_id"]}
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
            onSubmit={(answerDetails, score) => {
              this.onAnswerSubmitAssement(answerDetails, score);
            }}
          />
        );
      /** Pan Balance */
      case 10:
        return (
          <TemplateTen
            user_language={this.props.user_language}
            userId={this.props.loginData["user"]["_id"]}
            cardData={this.props.allDaysCards.currentCard}
            onSubmit={(answerDetails, msg) => {
              this.onAnswerSubmitPanTemp(answerDetails, msg);
            }}
          />
        );
      /** 4 Text Input on Background Image */
      case 11:
        return (
          <TemplateEleven
            user_language={this.props.user_language}
            cardData={this.props.allDaysCards.currentCard}
            onSubmit={(answerDetails) => {
              this.onAnswerSubmit(answerDetails);
            }}
            onCommentClick={(data) => this.onCommentClick(data)}
            onLikeClick={(data) => {
              this.onCardLiked(data);
            }}
          />
        );
      /** Multi Step Questions */
      case 12:
        return (
          <TemplateTwelve
            user_language={this.props.user_language}
            cardData={this.props.allDaysCards.currentCard}
            onSubmit={(answerDetails) => {
              this.onAnswerSubmit(answerDetails, false, true);
            }}
            onCommentClick={(data) => this.onCommentClick(data)}
            onLikeClick={(data) => {
              this.onCardLiked(data);
            }}
          />
        );
      /**W3D2C4 of Mamalift App text input with heading in table */
      case 13:
        return (
          <TemplateThirteen
            user_language={this.props.user_language}
            cardData={this.props.allDaysCards.currentCard}
            onSubmit={(answerDetails) => {
              this.onAnswerSubmit(answerDetails);
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
            user_language={this.props.user_language}
            cardData={this.props.allDaysCards.currentCard}
            onSubmit={(answerDetails) => {
              this.addTrackerValueDataApi(answerDetails);
            }}
            onCommentClick={(data) => this.onCommentClick(data)}
            onLikeClick={(data) => {
              this.onCardLiked(data);
            }}
          />
        );
      /**Drag Drop Template */
      case 15:
        return (
          <DragDrop
            user_language={this.props.user_language}
            cardData={this.props.allDaysCards.currentCard}
            onSubmit={(answerDetails, msg) => {
              this.onAnswerSubmitPanTemp(answerDetails, msg);
            }}
            onCommentClick={(data) => this.onCommentClick(data)}
            onLikeClick={(data) => {
              this.onCardLiked(data);
            }}
          />
        );
      /**Multi Step Pregancy Comparison */
      case 16:
        return (
          <MutiStepPreg
            user_language={this.props.user_language}
            cardData={this.props.allDaysCards.currentCard}
            onSubmit={(answerDetails, msg) => {
              this.onAnswerSubmitPanTemp(answerDetails, msg);
            }}
            onCommentClick={(data) => this.onCommentClick(data)}
            onLikeClick={(data) => {
              this.onCardLiked(data);
            }}
          />
        );
      /**Thermometer Template */
      case 17:
        return (
          <ThermometerTemplate
            user_language={this.props.user_language}
            cardData={this.props.allDaysCards.currentCard}
            onSubmit={(answerDetails, msg) => {
              this.onAnswerSubmitPanTemp(answerDetails, msg);
            }}
            onCommentClick={(data) => this.onCommentClick(data)}
            onLikeClick={(data) => {
              this.onCardLiked(data);
            }}
          />
        );
      case 18:
        return (
          <TemplateEighteen
            user_language={this.props.user_language}
            cardData={this.props.allDaysCards.currentCard}
            onSubmit={(answerDetails) => {
              this.onAnswerSubmit(answerDetails);
            }}
            onCommentClick={(data) => this.onCommentClick(data)}
            onLikeClick={(data) => {
              this.onCardLiked(data);
            }}
          />
        );
      /**Social Support need with 2 exercise */
      case 19:
        return (
          <TemplateNineteen
            user_language={this.props.user_language}
            cardData={this.props.allDaysCards.currentCard}
            onSubmit={(answerDetails, msg) => {
              this.onAnswerSubmitPanTemp(answerDetails, msg);
            }}
            onCommentClick={(data) => this.onCommentClick(data)}
            onLikeClick={(data) => {
              this.onCardLiked(data);
            }}
          />
        );
      case 20:
        return (
          <TemplateTwenty
            user_language={this.props.user_language}
            cardData={this.props.allDaysCards.currentCard}
            onSubmit={(answerDetails) => {
              this.onSaveCommitment(answerDetails);
            }}
            onCommentClick={(data) => this.onCommentClick(data)}
            onLikeClick={(data) => {
              this.onCardLiked(data);
            }}
            onEdit={(data, index) => {
              this.onEditCommitment(data, index);
            }}
          />
        );
      /**Social Support Network W3D2C4 prevent */
      case 21:
        return (
          <TemplateTwentyOne
            user_language={this.props.user_language}
            cardData={this.props.allDaysCards.currentCard}
            onSubmit={(answerDetails, msg) => {
              this.onAnswerSubmitPanTemp(answerDetails, msg);
            }}
            onCommentClick={(data) => this.onCommentClick(data)}
            onLikeClick={(data) => {
              this.onCardLiked(data);
            }}
          />
        );

      /** Support Network List SOS */
      case 22:
        return (
          <TemplateTwentyTwo
            user_language={this.props.user_language}
            cardData={this.props.allDaysCards.currentCard}
            onSubmit={(answerDetails, msg) => {
              this.onAnswerSubmitPanTemp(answerDetails, msg);
            }}
            getData={(id) => this.getCurrentCardData(id)}
            onCommentClick={(data) => this.onCommentClick(data)}
            onLikeClick={(data) => {
              this.onCardLiked(data);
            }}
          />
        );
      case 23:
        return (
          <TemplateTwentyThree
            user_language={this.props.user_language}
            cardData={this.props.allDaysCards.currentCard}
            onSubmit={(answerDetails, msg) => {
              this.onAnswerSubmitPanTemp(answerDetails, msg);
            }}
            onCommentClick={(data) => this.onCommentClick(data)}
            onLikeClick={(data) => {
              this.onCardLiked(data);
            }}
          />
        );
      case 24:
        return (
          <TemplateTwentyFour
            user_language={this.props.user_language}
            cardData={this.props.allDaysCards.currentCard}
            onSubmit={(answerDetails, msg) => {
              this.onAnswerSubmitPanTemp(answerDetails, msg);
            }}
            onCommentClick={(data) => this.onCommentClick(data)}
            onLikeClick={(data) => {
              this.onCardLiked(data);
            }}
          />
        );
      /**W5D2C7 of prevent Header with subheading Help seeking plan */
      case 25:
        return (
          <TemplateTwentyFive
            user_language={this.props.user_language}
            cardData={this.props.allDaysCards.currentCard}
            onSubmit={(answerDetails, msg) => {
              this.onAnswerSubmitPanTemp(answerDetails, msg);
            }}
            onCommentClick={(data) => this.onCommentClick(data)}
            onLikeClick={(data) => {
              this.onCardLiked(data);
            }}
          />
        );
      default:
        return null;
        break;
    }
  };

  /**When user click on Tracker Activities Template 4*/
  onTrackerSelection = (type) => {
    const { componentId } = this.props;
    switch (type) {
      case "mood":
        navigatorPush({
          componentId,
          screenName: "MoodTracker",
          passProps: {
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
        });
        break;
      case "sleep":
        navigatorPush({
          componentId,
          screenName: "SleepTracker",
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

      default:
        break;
    }
  };

  /**On Swipe Event */
  onSwipeHandler = (type, data) => {
    switch (type) {
      case "right":
        if (this.props.allDaysCards.currentLikeIndex > 0) {
          this.props.AppActions.updateCurrentCard(
            this.props.allDaysCards.likedCards[
              this.props.allDaysCards.currentLikeIndex - 1
            ]
          );
          this.props.AppActions.updateLikeIndex(
            this.props.allDaysCards.currentLikeIndex - 1
          );
        }
        break;
      case "left":
        if (
          this.props.allDaysCards.currentLikeIndex <
          this.props.allDaysCards.likedCards.length - 1
        ) {
          this.props.AppActions.updateCurrentCard(
            this.props.allDaysCards.likedCards[
              this.props.allDaysCards.currentLikeIndex + 1
            ]
          );
          this.props.AppActions.updateLikeIndex(
            this.props.allDaysCards.currentLikeIndex + 1
          );
        } else {
          alertWithOneBtn(
            "",
            strings.cards.all_read,
            GLOBALS.STRINGS.LOGOUT_OK
          );
        }
        break;

      default:
        break;
    }
  };

  _goBack() {
    let { componentId } = this.props;
    navigatorPop({ componentId });
  }

  getMarkers = (length) => {
    let temp = [];
    for (let i = 0; i < this.props.allDaysCards.likedCards.length; i++) {
      // return <ProgressStep removeBtnRow="true" />;
      temp.push("1");
    }
    this.setState({ array: [1, 2, 3, 4, 5, 6, 7] });
  };

  /**When user click on submit in Template 10 assesment*/
  onAnswerSubmitPanTemp = (answerDetails, msg) => {
    let postData = {
      user_id: this.props.loginData["user"]["_id"],
      language: this.props.user_language,
      answerDetails,
    };
    this.props.AppActions.savePanData(postData, this.props.user_language);
    // this.setState(
    //   {
    //     alert_desc: msg != '' ? msg : strings.cards.step_thanks,
    //   },
    //   () => {
    //     this.props.AppActions.togglePopup(true);
    //   },
    // );
  };
  render() {
    let { title } = this.props;

    return (
      <View style={Styles.homeContainer}>
        <Header
          isTitle={true}
          isLeftIcon={true}
          isLogout={false}
          onLeftIconClick={() => this._goBack()}
          title={title}
          titleStyle={{
            fontSize: RFValue(28),
            paddingTop: RFValue(10),
          }}
        />
        <View style={Styles.outerContainer}>
          <View
            style={{
              flex: 0.06,
              marginTop: RFValue(10),
              marginHorizontal: RFValue(10),
              marginBottom: RFValue(12),
            }}
          >
            <View
              style={{
                marginTop: RFValue(7),
                // width: "80%",
                // alignItems: "center",
              }}
            >
              <Slider
                trackStyle={Styles.track}
                value={
                  this.props.allDaysCards.likedCards.length == 1
                    ? 1
                    : this.props.allDaysCards.currentLikeIndex
                }
                maximumTrackTintColor={COLOR.PRIMARY}
                minimumTrackTintColor={COLOR.DARK_GREEN}
                thumbStyle={Styles.thumb}
                maximumValue={this.props.allDaysCards.likedCards.length - 1}
                disabled={true}
                animateTransitions={true}
              />
              <View style={Styles.bubbleView}>
                {this.props.allDaysCards.likedCards?.map((m, i) => {
                  return <View style={Styles.bubbles} />;
                })}
              </View>
              {/* <ProgressSteps
                activeStep={this.props.allDaysCards.currentLikeIndex + 1}
                // activeStep={7}
                topOffset={10}
                progressBarColor={COLOR.progressBarColor}
                borderWidth={6}
                completedProgressBarColor={COLOR.PRIMARY}
                activeStepIconBorderColor={COLOR.PRIMARY}
                activeStepIconColor={COLOR.activeStepIconColor}
                disabledStepIconColor={COLOR.WHITE}
                completedStepIconColor={COLOR.WHITE}
              >
                {this.props.allDaysCards.likedCards?.map((m) => {
                  return <ProgressStep removeBtnRow="true" />;
                })}
              </ProgressSteps> */}
            </View>

            <View style={Styles.cardNumberStyle}>
              <Text style={Styles.CardNumberText}>
                {this.props.allDaysCards.currentLikeIndex +
                  1 +
                  "/" +
                  this.props.allDaysCards.likedCards.length}
              </Text>
            </View>
          </View>

          <View style={{ flex: 1 }}>
            {Platform.OS == "ios" ? (
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
            ) : (
              <ScrollView
                ref={(ref) => {}}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
                nestedScrollEnabled={true}
                style={{
                  flex: 1,
                }}
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

        {/**Modal Calling */}
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
        <Modal
          transparent
          visible={this.state.releftModal}
          animationType={"slide"}
          onRequestClose={() => {
            this.setState({ releftModal: false });
          }}
        >
          <ReflactModal
            addComment={(comment) => this.onCommentAdd(comment)}
            closeModal={() => {
              this.setState({ releftModal: false });
            }}
          />
        </Modal>
      </View>
    );
  }
}

const mapStateToProps = ({
  authReducer,
  dashboardReducer,
  playlistReducer,
  cardsReducer,
}) => ({
  getWeekDayData: dashboardReducer.getDailyCBTData,
  isLoggedIn: authReducer.isLoggedIn,
  loginData: authReducer.loginData,
  allDaysCards: cardsReducer,
  user_language: authReducer.language,
});

const mapDispatchToProps = (dispatch) => ({
  AppActions: bindActionCreators(AppActions, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(SwipeCards);
