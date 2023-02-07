import NoData from "@components/common/NoData";
import Loader from "@components/common/screenLoader";
import GLOBALS from "@constants";
import * as ICONS from "@images";
import React, { useState, lazy, useCallback } from "react";
import IonIcon from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Video from "react-native-video";
import VideoPlayer from "react-native-video-controls";
import ImageZoom from "react-native-image-pan-zoom";
import { ratio, screenWidth } from "../../../utils/Styles";
// import YouTube from "react-native-youtube";
import RenderHtml from "react-native-render-html";
import {
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  NativeModules,
  Dimensions,
  Slider,
  ImageBackground,
  AsyncStorage,
  ActivityIndicator,
  Linking,
  useWindowDimensions,
} from "react-native";
// import {
//   auth,
//   remote,
//   ApiConfig,
//   ApiScope,
//   SpotifyRemoteApi,
//   PlayerState,
//   RepeatMode,
//   ContentItem,
//   auth as SpotifyAuth,
//   remote as SpotifyRemote,
// } from "react-native-spotify-remote";
// import Spotify from "../../common/spotify";

import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import ButtonBlue from "@components/common/buttonBlue";
import ButtonGreen from "@components/common/buttonGreen";
import ButtonOrange from "@components/common/buttonOrange";
import { AirbnbRating } from "react-native-ratings";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import GestureRecognizer, {
  swipeDirections,
} from "react-native-swipe-gestures";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { createFalse } from "typescript";
import { Alert } from "react-native";
const isiOS = Platform.OS == "ios";
const { FONTS, COLOR, STRINGS } = GLOBALS;
const Header = lazy(() => import("@components/common/Header"));
const { StatusBarManager } = NativeModules;
const { width, height } = Dimensions.get("window");

var radioCurrentSelectedIndex = 0;
let window = Dimensions.get("window");

function pad(n, width, z = 0) {
  n = n + "";
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

const minutesAndSeconds = (position) => [
  pad(Math.floor(position / 60), 2),
  pad(position % 60, 2),
];

const CommonCardView = ({
  item,
  index,
  goToNotAlone,
  goToBuildCircleTrust,
  linkClicked,
  week,
  day,
  contentLinkClicked,
  submitBtnClicked,
  submitquestionAnswerData,
  submitInputData,
  setIsRefresh,
  isRefresh,
  playAudio,
  stopAudio,
  isPlayingAudio,
  setDuration,
  setTime,
  seek,
  onBack,
  onForward,
  trackLength,
  onSlidingStart,
  currentPosition,
  setRefOfAudio,
  setRefOfVideo,
  screenType,
  pausedVideo,
  setPausedVideo,
  startSpeechToText,
  stopSpeechToText,
  speechResultValue,
  recordTime,
  startRecord,
  onStopRecord,
  playWidth,
  playTime,
  recordDuration,
  onStartPlayRecording,
  onPausePlayRecording,
  onStopPlayRecording,
  goToPleasantActivityScreen,
  goToMoodTrackerScreen,
  goToSleepTrackerScreen,
  goToFeedbackScreen,

  voiceResults,
}) => {
  const { user } = item;

  return (
    <CardViewFirst
      data={item}
      day={item.day}
      week={item.week}
      contentLinkClicked={contentLinkClicked}
      submitBtnClicked={submitBtnClicked}
      index={index}
      setIsRefresh={setIsRefresh}
      isRefresh={isRefresh}
      submitquestionAnswerData={submitquestionAnswerData}
      submitInputData={submitInputData}
      playAudio={playAudio}
      stopAudio={stopAudio}
      isPlayingAudio={isPlayingAudio}
      setDuration={setDuration}
      setTime={setTime}
      seek={seek}
      onBack={onBack}
      onForward={onForward}
      trackLength={trackLength}
      onSlidingStart={onSlidingStart}
      currentPosition={currentPosition}
      setRefOfAudio={setRefOfAudio}
      setRefOfVideo={setRefOfVideo}
      cardIndex={index}
      screenType={screenType}
      goToBuildCircleTrust={goToBuildCircleTrust}
      startSpeechToText={startSpeechToText}
      stopSpeechToText={stopSpeechToText}
      speechResultValue={speechResultValue}
      recordTime={recordTime}
      startRecord={startRecord}
      onStopRecord={onStopRecord}
      playWidth={playWidth}
      playTime={playTime}
      recordDuration={recordDuration}
      onStartPlayRecording={onStartPlayRecording}
      onPausePlayRecording={onPausePlayRecording}
      onStopPlayRecording={onStopPlayRecording}
      goToPleasantActivityScreen={goToPleasantActivityScreen}
      goToMoodTrackerScreen={goToMoodTrackerScreen}
      goToSleepTrackerScreen={goToSleepTrackerScreen}
      goToFeedbackScreen={goToFeedbackScreen}
      voiceResults={voiceResults}
    />
  );
};

const CardViewFirst = ({
  data,
  contentLinkClicked,
  day,
  week,
  submitBtnClicked,
  index,
  setIsRefresh,
  isRefresh,
  submitquestionAnswerData,
  submitInputData,
  playAudio,
  stopAudio,
  isPlayingAudio,
  setDuration,
  setTime,
  seek,
  onBack,
  onForward,
  trackLength,
  onSlidingStart,
  currentPosition,
  setRefOfAudio,
  setRefOfVideo,
  cardIndex,
  screenType,
  goToBuildCircleTrust,
  startSpeechToText,
  stopSpeechToText,
  speechResultValue,
  recordTime,
  startRecord,
  onStopRecord,
  playWidth,
  playTime,
  recordDuration,
  onStartPlayRecording,
  onPausePlayRecording,
  onStopPlayRecording,
  goToPleasantActivityScreen,
  goToMoodTrackerScreen,
  goToSleepTrackerScreen,
  goToFeedbackScreen,
  voiceResults,
}) => {
  // let url = GLOBALS.IMAGE_BASE_URL + data.image;
  let url = data.image;
  let voiceToTextArray = [];
  const [refresh, setRefresh] = useState(false, "");
  const [explain, setExplain] = useState("", "");
  const [like, setLike] = useState(
    data.like != undefined ? Boolean(data.like) : false,
    ""
  );
  const [comment, setComment] = useState("", "");
  const [rating, setRating] = useState(
    data.rating != undefined ? data.rating : 0,
    ""
  );
  const [showComment, setShowComment] = useState(false, "");
  const [statusBarHeight, setstatusBarHeight] = useState("", "");
  const elapsed = minutesAndSeconds(currentPosition);
  const remaining = minutesAndSeconds(trackLength - currentPosition);
  const [searchText, setSearchText] = useState("");
  const [isPlaceHolder, setPlaceholder] = useState(false);
  const [checkAns, setCheckAns] = useState([]);
  const [isCardClick, setCardClick] = useState(false, "");
  const [isSpeechToTextClick, setSpeechToTextClick] = useState(true, "");
  const [isVoiceRecordClick, setVoiceRecordClick] = useState(true, "");
  const [isShowPlayUI, setShowVoiceRecordUI] = useState(false, "");
  const [isTriviaQue, setTriviaQue] = useState(false, "");
  const [isSpeechResultValue, setSpeechResultValue] =
    useState(speechResultValue);
  const [ready, setReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [clickedId, setClickedId] = useState("");
  const [isPlaceholderShow, setPlaceholderShow] = useState(true);
  const [voiceQuestionsOldAns, setVoiceQuestionsOldAns] = useState([]);
  const [voiceQueExpandOldAns, setVoiceQueExpandOldAns] = useState([]);
  const [voicQuePlaceholderAns, setVoicePlaceholderOldAns] = useState("");

  //
  if (Platform.OS === "ios") {
    StatusBarManager.getHeight((statusBarFrameData) => {
      setstatusBarHeight(statusBarFrameData.height);
    });
    // StatusBarIOS.addListener("statusBarFrameWillChange", (statusBarData) => {
    //   setstatusBarHeight(statusBarData.frame.height);
    // });
  }

  const onExpandClick = (index, item, dataLocal) => {
    dataLocal.expandableContents.forEach((element) => {
      if (element._id == item._id) {
        element.isExpanded = true;
      } else {
        element.isExpanded = false;
      }
    });
    setIsRefresh(!isRefresh);
  };

  const onCrossClick = (index, item, dataLocal) => {
    dataLocal.expandableContents.forEach((element) => {
      if (element._id == item._id) {
        element.isExpanded = false;
      }
    });
    setIsRefresh(!isRefresh);
  };

  const onRadioBtnClick = (index, item, item2, dataLocal) => {
    dataLocal.questions.forEach((element) => {
      if (element._id == item._id) {
        element.answer = item.ansOptions[index].name;
      }
    });
    setRefresh(!refresh);
  };

  const yesNoBtnClicked = (text, item, dataLocal, cardId) => {
    dataLocal.questions.forEach((element) => {
      if (element._id == item._id) {
        element.answer = text;
        if (text == "yes") {
          element.usefulInfo = true;
        } else {
          element.usefulInfo = false;
        }
      }
    });
    setRefresh(!refresh);
    submitquestionAnswerData(dataLocal, cardId);
  };

  const onTextPlaceholderChange = (text, item, dataLocal) => {
    dataLocal.placeholders.forEach((element) => {
      if (element._id == item._id) {
        element.answer = text;
      }
    });
    setRefresh(!refresh);
  };

  const onOtherTextPlaceholderChange = (text, item, dataLocal) => {
    // item.otherAnswer = text;
    dataLocal.questions.forEach((element) => {
      if (element._id == item._id) {
        element.others_answer = text;
      }
    });
    setRefresh(!refresh);
  };

  const onOtherCheckedPlaceholderChange = (text, item, dataLocal) => {
    dataLocal.questions.forEach((element) => {
      if (element.ansType == "checkbox" && element.ansOptions !== undefined) {
        element.ansOptions.forEach((ele) => {
          if (ele._id == item._id) {
            ele.others_answer = text;
          }
        });
      }
    });
    setRefresh(!refresh);
  };

  const onExpandableTextPlaceholderChange = (text, item, index, dataLocal) => {
    dataLocal.expandableContents[index].placeholders.forEach((element) => {
      if (element._id == item._id) {
        element.answer = text;
      }
    });
    setRefresh(!refresh);
  };

  const onExpandableVoicePlaceholderChange = (text, item, index, dataLocal) => {
    if (dataLocal.expandableContents !== undefined) {
      dataLocal.expandableContents[index].voiceTotext.forEach((element) => {
        if (element._id == item._id) {
          if (text !== "") {
            element.answer = text;
            let obj = {
              _id: item._id,
              ans: text,
            };
            setVoiceQueExpandOldAns((oldArray) => [...oldArray, obj]);
          } else {
            element.answer = " ";
          }
        }
      });
      setRefresh(!refresh);
    }
  };

  likeBtnClicked = (index, item) => {
    if (item.like == 0) {
      item.like = 1;
    } else {
      item.like = 0;
    }
    setIsRefresh(!isRefresh);
    submitBtnClicked(item.like, null, null, item._id);
  };

  ratingChanged = (ratingVal, item) => {
    item.rating = ratingVal;
    submitBtnClicked(null, null, ratingVal, item._id);
    setIsRefresh(!isRefresh);
  };

  addComment = () => {
    if (comment != "") {
      let commentsArr = data.usercomments;
      commentsArr.push({ comment: comment });
      data.usercomments = commentsArr;
      submitBtnClicked(null, comment, null, data._id);
      setShowComment(!showComment);
      setComment("");
    }
  };

  const onCheckBoxClick = (item, index, ques) => {
    ques.ansOptions.forEach((element) => {
      if (element._id == item._id) {
        element.isChecked = !item.isChecked;
      }
      // if (item.isChecked) {
      //   setCheckAns([...checkAns, {
      //     optionId: item._id,
      //     value: item.name
      //   }])
      // }
    });
    setRefresh(!refresh);
  };

  const updateIsChecked = (ques) => {
    if (ques.answer != undefined && ques.answer != null) {
      let answers = ques.answer.answers;
      let ansOptions = ques.ansOptions;
      let othersAnswer = ques.answer.other_answer;

      for (let ansOption of ansOptions) {
        for (let answer of answers) {
          if (answer.optionId == ansOption._id) {
            ansOption.isChecked = true;
            ansOption.isShowAns = true;
            if (answer.value == "Others") {
              ansOption.others_answer = othersAnswer;
            }
            break;
          }
        }
      }
      ques.answer = null;
    }
  };

  const updateIsRadioChecked = (item) => {
    if (
      item.answer != undefined &&
      item.answer != null &&
      item.ansType == "radio"
    ) {
      item.ansOptions.forEach((element) => {
        if (element.name == item.answer.answer || element.isRadio) {
          element.isRadioAnsShow = true;
        } else {
          element.isRadioAnsShow = false;
        }
      });
    }
  };

  const onTextAnswerChange = (text, item, dataLocal) => {
    dataLocal.questions.forEach((element) => {
      if (element._id == item._id) {
        element.answer = text;
      }
    });
    setRefresh(!refresh);
  };

  const onVoiceTextAnswerChange = (text, item, dataLocal) => {
    dataLocal.questions.forEach((element) => {
      if (element._id == item._id) {
        if (text !== "") {
          element.voiceAnswer = text;
          let obj = {
            _id: item._id,
            ans: text,
          };
          setVoiceQuestionsOldAns((oldArray) => [...oldArray, obj]);
          setPlaceholderShow(false);
        } else {
          element.voiceAnswer = " ";
          setPlaceholderShow(true);
        }
      }
    });
    setRefresh(!refresh);
  };

  // questions array speech to text
  const updateQuestionVoice = (item, dataLocal) => {
    if (item.isSpeechToTextQuestion) {
      dataLocal.questions.forEach((element) => {
        if (element._id == item._id) {
          if (element.answer !== undefined && element.answer.answer !== "") {
            element.oldAns = element.answer.answer;
            if (voiceQuestionsOldAns.length > 0) {
              voiceQuestionsOldAns.map((m) => {
                if (m._id == item._id) {
                  element.voiceAnswer = m.ans;
                } else {
                  element.voiceAnswer =
                    element.oldAns + " " + speechResultValue;
                }
              });
            } else {
              element.voiceAnswer = element.oldAns + " " + speechResultValue;
            }
          } else {
            element.voiceAnswer = speechResultValue;
          }
        }
      });
    }
  };
  // questions array speech to text start
  const onStartSpeechToTextQuestion = (item, dataLocal) => {
    setClickedId(item._id);
    let speechFilter = dataLocal.questions.filter(
      (e) => e.isSpeechToTextQuestion
    );

    if (speechFilter !== undefined && speechFilter.length == 0) {
      dataLocal.questions.forEach((element) => {
        if (element._id == item._id) {
          startSpeechToText();
          element.isSpeechToTextQuestion = true;
        }
      });
    } else {
      dataLocal.questions.forEach((element) => {
        if (element.isSpeechToTextQuestion) {
          onStopSpeechToTextQuestion(element, dataLocal, true);
        }
      });
      setIsLoading(true);
      setTimeout(() => {
        dataLocal.questions.forEach((element) => {
          if (element._id == item._id) {
            startSpeechToText();
            element.isSpeechToTextQuestion = true;
          } else {
            element.isSpeechToTextQuestion = false;
            setIsLoading(false);
          }
        });
      }, 1000);
    }
    setRefresh(!refresh);
  };
  // questions array speech to text stop
  const onStopSpeechToTextQuestion = (item, dataLocal, value) => {
    dataLocal.questions.forEach((element) => {
      if (element._id == item._id) {
        if (element.answer !== undefined && element.answer.answer !== "") {
          element.oldAns = element.answer.answer;
          if (voiceQuestionsOldAns.length > 0) {
            voiceQuestionsOldAns.map((m) => {
              if (m._id == item._id) {
                element.voiceAnswer = m.ans + " " + speechResultValue;
                element.voiceTextValue = m.ans + " " + speechResultValue;
              } else {
                element.voiceAnswer = element.oldAns + " " + speechResultValue;
                element.voiceTextValue =
                  element.oldAns + " " + speechResultValue;
              }
            });
          } else {
            element.voiceAnswer = element.oldAns + " " + speechResultValue;
            element.voiceTextValue = element.oldAns + " " + speechResultValue;
          }
          let obj = {
            _id: item._id,
            ans: element.voiceTextValue,
          };
          setVoiceQuestionsOldAns((oldArray) => [...oldArray, obj]);
        } else {
          element.voiceAnswer = speechResultValue;
          element.voiceTextValue = speechResultValue;
        }
        stopSpeechToText();
        if (!value) {
          element.isSpeechToTextQuestion = false;
        }
      }
    });
    setRefresh(!refresh);
  };

  const updateExpandVoice = (item, dataLocal) => {
    if (item.isSpeechToTextQuestion) {
      dataLocal.expandableContents.forEach((element) => {
        element.voiceTotext.forEach((e) => {
          if (e._id == item._id) {
            if (e.value !== undefined) {
              if (voiceQueExpandOldAns.length > 0) {
                voiceQueExpandOldAns.map((m) => {
                  if (m._id == item._id) {
                    element.answer = m.ans;
                  } else {
                    element.answer = e.value.answer + " " + speechResultValue;
                  }
                });
              } else {
                e.answer = e.value.answer + " " + speechResultValue;
              }
            } else {
              e.answer = speechResultValue;
            }
          } else {
            // e.answer = speechResultValue;
          }
        });
      });
    }
  };

  const onStartSpeechToTextExpand = (item, dataLocal) => {
    setClickedId(item._id);
    dataLocal.expandableContents.forEach((ele) => {
      let speechFilter = ele.voiceTotext.filter(
        (e) => e.isSpeechToTextQuestion
      );

      if (speechFilter !== undefined && speechFilter.length == 0) {
        ele.voiceTotext.forEach((element) => {
          if (element._id == item._id) {
            startSpeechToText();
            element.isSpeechToTextQuestion = true;
          }
        });
      } else {
        ele.voiceTotext.forEach((element) => {
          if (element.isSpeechToTextQuestion) {
            onStopSpeechToTextExpand(element, dataLocal, true);
          }
        });
        setIsLoading(true);
        setTimeout(() => {
          ele.voiceTotext.forEach((element) => {
            if (element._id == item._id) {
              setVoiceQueExpandOldAns([]);
              startSpeechToText();
              element.isSpeechToTextQuestion = true;
            } else {
              element.isSpeechToTextQuestion = false;
              setIsLoading(false);
            }
          });
        }, 1000);
      }
    });
    setRefresh(!refresh);
  };

  const onStopSpeechToTextExpand = (item, dataLocal, value) => {
    dataLocal.expandableContents.forEach((ele) => {
      ele.voiceTotext.forEach((element) => {
        if (element._id == item._id) {
          if (element.value !== undefined) {
            if (voiceQueExpandOldAns.length > 0) {
              voiceQueExpandOldAns.map((m) => {
                if (m._id == item._id) {
                  element.answer = m.ans + " " + speechResultValue;
                  element.voiceTextValue = m.ans + " " + speechResultValue;
                } else {
                  element.answer =
                    element.value.answer + " " + speechResultValue;
                  element.voiceTextValue =
                    element.value.answer + " " + speechResultValue;
                }
              });
            } else {
              element.answer = element.value.answer + " " + speechResultValue;
              element.voiceTextValue =
                element.value.answer + " " + speechResultValue;
            }
          } else {
            element.answer = speechResultValue;
            element.voiceTextValue = speechResultValue;
          }
          let obj = {
            _id: item._id,
            ans: element.voiceTextValue,
          };
          setVoiceQueExpandOldAns((oldArray) => [...oldArray, obj]);
          setRefresh(!refresh);
          stopSpeechToText();
          if (!value) {
            element.isSpeechToTextQuestion = false;
          }
        }
      });
    });
    setRefresh(!refresh);
  };

  const onVoiceTextPlaceholderChange = (text, item, dataLocal) => {
    dataLocal.voiceTotext.forEach((element) => {
      if (element._id == item._id) {
        if (text !== "") {
          element.answer = text;
          let obj = {
            _id: item._id,
            ans: text,
          };
          setVoicePlaceholderOldAns((oldArray) => [...oldArray, obj]);
        } else {
          element.answer = " ";
        }
      }
    });
    setRefresh(!refresh);
  };

  const updatePlaceholderVoice = (item, dataLocal) => {
    if (item.isSpeechToTextQuestion) {
      dataLocal.voiceTotext.forEach((element) => {
        if (element._id == item._id) {
          if (element.value !== undefined) {
            if (voicQuePlaceholderAns.length > 0) {
              voicQuePlaceholderAns.map((m) => {
                if (m._id == item._id) {
                  element.answer = m.ans;
                } else {
                  element.answer =
                    element.value.answer + " " + speechResultValue;
                }
              });
            } else {
              element.answer = element.value.answer + " " + speechResultValue;
            }
          } else {
            element.answer = speechResultValue;
          }
        } else {
          // element.answer = speechResultValue;
        }
      });
    }
  };

  const onStartSpeechToTextPlaceholder = (item, dataLocal) => {
    setClickedId(item._id);
    let speechFilter = dataLocal.voiceTotext.filter(
      (e) => e.isSpeechToTextQuestion
    );

    if (speechFilter !== undefined && speechFilter.length == 0) {
      dataLocal.voiceTotext.forEach((element) => {
        if (element._id == item._id) {
          startSpeechToText();
          element.isSpeechToTextQuestion = true;
        }
      });
    } else {
      dataLocal.voiceTotext.forEach((element) => {
        if (element.isSpeechToTextQuestion) {
          onStopSpeechToTextPlaceholder(element, dataLocal, true);
        }
      });
      setIsLoading(true);
      setTimeout(() => {
        dataLocal.voiceTotext.forEach((element) => {
          if (element._id == item._id) {
            startSpeechToText();
            element.isSpeechToTextQuestion = true;
          } else {
            element.isSpeechToTextQuestion = false;
            setIsLoading(false);
          }
        });
      }, 1000);
    }
    setRefresh(!refresh);
  };

  const onStopSpeechToTextPlaceholder = (item, dataLocal, value) => {
    dataLocal.voiceTotext.forEach((element) => {
      if (element._id == item._id) {
        if (element.value !== undefined) {
          if (voicQuePlaceholderAns.length > 0) {
            voicQuePlaceholderAns.map((m) => {
              if (m._id == item._id) {
                element.answer = m.ans + " " + speechResultValue;
                element.voiceTextValue = m.ans + " " + speechResultValue;
              } else {
                element.answer = element.value.answer + " " + speechResultValue;
                element.voiceTextValue =
                  element.value.answer + " " + speechResultValue;
              }
            });
          } else {
            element.answer = element.value.answer + " " + speechResultValue;
            element.voiceTextValue =
              element.value.answer + " " + speechResultValue;
          }
        } else {
          element.answer = speechResultValue;
          element.voiceTextValue = speechResultValue;
        }

        let obj = {
          _id: item._id,
          ans: element.voiceTextValue,
        };
        setVoicePlaceholderOldAns((oldArray) => [...oldArray, obj]);
        stopSpeechToText();
        if (!value) {
          element.isSpeechToTextQuestion = false;
        }
      }
    });
    setRefresh(!refresh);
  };

  const onStopSpeechToText = (item, dataLocal) => {
    stopSpeechToText();
    setSpeechToTextClick(true);
    // onStopVoiceRecord()
    // dataLocal.questions.forEach(element => {
    //   if (element._id == item._id) {
    //     stopSpeechToText()
    //     setSpeechToTextClick(true)
    //     element.isSpeechToTextClick = false;
    //     // element.voiceAnswer = speechResultValue;
    //   }
    // });
    // setRefresh(!refresh)
    //
  };
  const onStartVoiceRecord = () => {
    startRecord();
    setVoiceRecordClick(false);
  };
  const onStopVoiceRecord = () => {
    onStopRecord();
    setVoiceRecordClick(true);
    setShowVoiceRecordUI(true);
  };
  const spotifyPlaylist =
    data.Spotifylink &&
    data.Spotifylink.map((item) => {
      return item.name;
    });

  const { widthHTML } = useWindowDimensions();
  const sourceHypertext = {
    html: `
    <html>
      <head>
        <base href="#"></base>
      </head>
      <body style="margin: 10px;">
        <header>
          <nav>
            <strong>Mobile testing..</strong>
            <a href="https://dev.azure.com/CurioDigitalTx/DigitalTx/_workitems/edit/1241/">hyperlink test</a>
          </nav>
        </header>
      </body>
    </html>`,
  };

  const dynamicDescriptionText = {
    html: data.hyperlink_description,
  };
  const tagsStyles = {
    body: {
      // whiteSpace: 'normal',
      fontSize: RFValue(16),
      fontFamily: FONTS.CIRCULAR_MEDIUM,
      color: COLOR.BLACK,
      marginTop: RFValue(20),
      textAlign: "left",
      alignSelf: "flex-start",
      fontWeight: "600",
    },
  };

  function onPress(event, href) {
    if (href.includes("about:///")) {
      let htmlString = href.replace(/%20/g, " ");
      let splitString = htmlString.split("about:///");
      Alert.alert(`${splitString[1]}`);
    } else {
      Linking.openURL(href);
    }
  }

  const renderersProps = {
    a: {
      onPress: onPress,
    },
  };

  const htmlStyle = {
    p: {},
  };

  return (
    <View style={styles.cardVw}>
      {screenType !== "careConcerns" ? (
        data.currentWeek !== undefined && data.currentDay !== undefined ? (
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <Text style={styles.weekDay}>Week {data.currentWeek}</Text>
            <Text style={styles.weekDay}>Day {data.currentDay}</Text>
          </View>
        ) : null
      ) : null}
      <Modal
        animated={true}
        // transparent={true}
        visible={showComment}
      >
        <KeyboardAvoidingView
          behavior="padding"
          keyboardVerticalOffset={
            Platform.OS === "android" ? -200 : statusBarHeight + 44
          }
          style={{
            height: "100%",
            width: "100%",
            flexDirection: "column",
            justifyContent: "flex-start",
          }}
          enabled
        >
          <View style={{ backgroundColor: "white", flex: 1 }}>
            <Header
              isLeftIcon={true}
              isTitle={true}
              isRightIcon={false}
              onLeftIconClick={() => {
                setShowComment(!showComment);
              }}
              title={"Comment"}
            />
            {data.usercomments != undefined && data.usercomments.length > 0 ? (
              <FlatList
                // contentContainerStyle={{ flex: 1 }}
                data={
                  data.usercomments != undefined
                    ? data.usercomments
                    : [{ coment: "A" }, { comment: "B" }]
                }
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => `${item._id}`}
                // style={{ backgroundColor: 'green' }}
                renderItem={({ item, index }) =>
                  item.comment != null && item.comment != "" ? (
                    <View
                      style={{
                        paddingHorizontal: 16,
                      }}
                    >
                      <Text
                        style={[
                          styles.blackText,
                          {
                            borderColor: "rgba(119, 131, 143, 0.2)",
                            borderWidth: 1,
                            borderRadius: 8,
                            backgroundColor: "rgba(119, 131, 143, 0.2)",
                            padding: 8,
                            //flex: 1,
                          },
                        ]}
                      >
                        {item.comment}
                      </Text>
                    </View>
                  ) : null
                }
              />
            ) : (
              <Text
                style={[
                  styles.blackText,
                  {
                    color: COLOR.GREY,
                    textAlign: "center",
                    padding: 8,
                    //flex: 1,
                    //height:'100%'
                  },
                ]}
              >
                No Comments
              </Text>
            )}
            <View
              style={{
                position: "absolute",
                bottom: 8,
                width: "100%",
                padding: 16,
                alignItems: "center",
                flexDirection: "row",
                //backgroundColor: 'red'
              }}
            >
              <TextInput
                style={{
                  height: RFValue(60),
                  borderColor: COLOR.PRIMARY1,
                  borderWidth: 1,
                  borderRadius: 8,
                  backgroundColor: COLOR.WHITE,
                  paddingLeft: 10,
                  alignSelf: "center",
                  flex: 1,
                  color: "dark" ? COLOR.GREY : COLOR.GREY,
                }}
                value={comment}
                placeholder="Comment..."
                placeholderTextColor={COLOR.GREY}
                maxLength={5000}
                multiline={true}
                returnKeyType="go"
                underlineColorAndroid={"transparent"}
                onChangeText={(comment) => setComment(comment)}
              />
              <TouchableOpacity
                style={{ height: 60, justifyContent: "center" }}
                onPress={() => addComment()}
              >
                <MaterialCommunityIcons
                  name={"send"}
                  size={27}
                  color={COLOR.PRIMARY1}
                  style={{
                    paddingHorizontal: 8,
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {data.title !== null && data.title !== "" ? (
        <Text style={styles.blueText}>{data.title}</Text>
      ) : null}

      {data.videoFiles != undefined && data.videoFiles.length > 0 ? (
        <FlatList
          contentContainerStyle={{ flex: 1 }}
          data={data.videoFiles}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => `${item._id}`}
          listKey={(index) => "L" + index.toString()}
          style={{ width: "100%", marginTop: 8 }}
          renderItem={({ item, index }) =>
            item.isTop ? (
              <View style={{ marginVertical: 8 }}>
                {Platform.OS === "ios" ? (
                  <Video
                    source={{ uri: item.name }}
                    //GLOBALS.IMAGE_BASE_URL +
                    // source={{
                    //   uri: (item.name).replace(
                    //     / /g,
                    //     "%20"
                    //   ),
                    //   type: "mp4",
                    // }} // Can be a URL or a local file.
                    ref={(ref) => {
                      setRefOfVideo(ref);
                    }}
                    // Store reference
                    paused={true}
                    controls={true}
                    style={styles.backgroundVideo}
                    // showOnStart={true}
                    // style={styles.fullScreen}
                  />
                ) : (
                  <VideoPlayer
                    // source={{
                    //   uri: (GLOBALS.IMAGE_BASE_URL + item.name).replace(
                    //     / /g,
                    //     "%20"
                    //   ),
                    //   type: "mp4",
                    // }}
                    source={{ uri: item.name }}
                    showOnStart={true}
                    toggleResizeModeOnFullscreen={true}
                    controlAnimationTiming={3000}
                    doubleTapTime={130}
                    controlTimeout={35000}
                    scrubbing={0}
                    seekColor={COLOR.BACKGROUND_ORANGE}
                    style={{ backgroundColor: COLOR.PRIMARY1 }}
                    tapAnywhereToPause={true}
                    paused={true}
                  />
                )}
                <Text
                  style={{
                    paddingTop: RFValue(10),
                    fontSize: RFValue(14),
                    fontFamily: FONTS.CIRCULAR_MEDIUM,
                  }}
                >
                  {item.caption}
                </Text>
              </View>
            ) : null
          }
        />
      ) : null}

      {data.innercards !== null &&
      data.innercards !== undefined &&
      data.innercards.length > 0 ? (
        <View>
          <TouchableOpacity
            onPress={() =>
              data.innercards[0].cardExpand ? setCardClick(!isCardClick) : null
            }
            style={styles.cardTouchableStyle}
          >
            {/*  GLOBALS.IMAGE_BASE_URL + */}
            <ImageBackground
              source={
                data.innercards[0].backgroundimage !== null
                  ? {
                      uri: data.innercards[0].backgroundimage,
                    }
                  : null
              }
              imageStyle={{ borderRadius: 10, borderColor: "transparent" }}
              resizeMode={"stretch"}
              style={[
                styles.imageBackgroundStyle,
                {
                  height:
                    data.innercards[0].cardtype == "small"
                      ? RFPercentage(25)
                      : data.innercards[0].cardtype == "medium"
                      ? RFPercentage(37)
                      : data.innercards[0].cardtype == "large"
                      ? RFPercentage(50)
                      : null,
                },
              ]}
            />

            <View
              style={[
                styles.imageViewStyle,
                {
                  height:
                    data.innercards[0].cardtype == "small"
                      ? RFPercentage(25)
                      : data.innercards[0].cardtype == "medium"
                      ? RFPercentage(37)
                      : data.innercards[0].cardtype == "large"
                      ? RFPercentage(50)
                      : null,
                },
              ]}
            >
              {data.innercards[0].carddivider ? (
                <View style={{ flex: 0.5 }} />
              ) : null}
              <View
                style={[
                  styles.textViewStyle,
                  {
                    flex: data.innercards[0].carddivider ? 0.5 : 1,
                    backgroundColor:
                      data.innercards[0].backgroundimage == null ||
                      data.innercards[0].backgroundimage == ""
                        ? data.innercards[0].bchex
                        : data.innercards[0].carddivider
                        ? data.innercards[0].bchex
                        : null,
                    opacity: data.innercards[0].carddivider ? 0.8 : null,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.imageTextStyle,
                    {
                      fontWeight: data.innercards[0].innerfonttitleweight,
                      fontSize: RFValue(
                        Number(data.innercards[0].innerfonttitlesize)
                      ),
                      color: data.innercards[0].bchex3,
                      textAlign: "center",
                      padding: RFValue(10),
                    },
                  ]}
                >
                  {data.innercards[0].inner_title}
                </Text>
                {data.innercards[0].cardExpand ? (
                  <FontAwesome
                    name={"angle-down"}
                    color={"#FFF"}
                    size={RFValue(32)}
                  />
                ) : null}
              </View>
            </View>
          </TouchableOpacity>

          {isCardClick ? (
            <View style={styles.descriptionViewStyle}>
              {data.innercards[0].inner_header !== undefined ? (
                <Text
                  style={{
                    fontSize: RFValue(
                      Number(data.innercards[0].innerfontheadersize)
                    ),
                    fontFamily: FONTS.REGULAR,
                    fontWeight: data.innercards[0].innerfontheaderweight,
                    alignSelf: "center",
                    paddingTop: 10,
                    color: data.innercards[0].bchex4,
                  }}
                >
                  {data.innercards[0].inner_header}
                </Text>
              ) : null}
              <Text
                style={[
                  styles.blackText,
                  {
                    alignSelf: "flex-start",
                    fontSize: Number(data.innercards[0].innerdescriptionsize),
                    fontWeight: data.innercards[0].innerdescriptionweight,
                    color: data.innercards[0].bchex2,
                    textAlign: "left",
                  },
                ]}
              >
                {data.innercards[0].inner_description}
              </Text>
            </View>
          ) : null}
        </View>
      ) : null}

      {data.image != null && data.image !== "" ? (
        data.currentWeek !== undefined &&
        data.currentDay !== undefined &&
        data.currentWeek == 1 &&
        data.currentDay == 3 ? (
          <View style={styles.imageContainer}>
            <ImageZoom
              cropWidth={RFPercentage(60)}
              cropHeight={RFPercentage(80)}
              imageWidth={RFPercentage(40)}
              imageHeight={RFPercentage(80)}
            >
              <Image
                // source={ICONS.NurseRed}
                resizeMode="contain"
                style={{
                  marginTop: RFValue(30),
                  height: RFPercentage(60),
                  width: RFPercentage(40),
                }}
                source={{ uri: url }}
              />
            </ImageZoom>
          </View>
        ) : (
          <View style={styles.imageContainer}>
            <ImageZoom
              cropWidth={RFPercentage(50)}
              cropHeight={RFPercentage(34)}
              imageWidth={RFPercentage(45)}
              imageHeight={RFPercentage(34)}
            >
              <Image
                resizeMode="contain"
                style={styles.nurseImage}
                source={{ uri: url }}
              />
            </ImageZoom>
          </View>
        )
      ) : null}

      {data.description !== null ? (
        <Text style={[styles.blackText, { alignSelf: "flex-start" }]}>
          {data.description}
        </Text>
      ) : null}

      {data.hyperlink_description !== null ? (
        <View>
          <RenderHtml
            contentWidth={widthHTML}
            // source={sourceHypertext}
            source={dynamicDescriptionText}
            tagsStyles={tagsStyles}
            renderersProps={renderersProps}
            tagsStyles={htmlStyle}
          />
        </View>
      ) : null}

      {data.questions != undefined && data.questions.length > 0
        ? data.questions.map((element) => {
            if (element.ansType == "checkbox") {
              return (
                <Text style={styles.checkBoxText}>
                  {data.questions[0].question}
                </Text>
              );
            }
          })
        : null}

      {data.hasStep ? (
        <View>
          <Text style={styles.stepTitle}>{data.stepDetail.name}</Text>
          <Text style={styles.stepDetails}>{data.stepDetail.description}</Text>
        </View>
      ) : null}

      {data.hasExpandable && data.expandableContents.length > 0 ? (
        <View>
          <FlatList
            data={data.expandableContents}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            listKey={(index) => "D" + index.toString()}
            extraData={refresh}
            style={{ width: "100%", marginTop: RFValue(20) }}
            //  contentContainerStyle={{flex: 1}}
            renderItem={({ item, index }) => (
              <View style={{ marginVertical: 10 }}>
                <View
                  style={
                    item.isExpanded
                      ? {
                          backgroundColor: COLOR.PRIMARY1,
                          borderRadius: RFValue(8),
                          padding: RFValue(10),
                        }
                      : styles.roundedBtnView
                  }
                >
                  <View style={[styles.expandableVw]}>
                    <View style={{ width: "95%" }}>
                      <Text
                        style={[
                          styles.blackText,
                          item.isExpanded
                            ? { color: "white" }
                            : { color: COLOR.BLACK },
                          { marginTop: 0 },
                        ]}
                      >
                        {item.title}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: "5%",
                        padding: 5,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {item.isExpanded ? (
                        <TouchableOpacity
                          style={styles.plusBtn}
                          onPress={() => onCrossClick(index, item, data)}
                        >
                          <Text
                            style={[
                              styles.blackText,
                              { marginTop: 0, color: "white" },
                            ]}
                          >
                            {"X"}
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          style={[
                            styles.plusBtn,
                            { alignItems: "center", justifyContent: "center" },
                          ]}
                          onPress={() => onExpandClick(index, item, data)}
                        >
                          <Text
                            style={[
                              styles.blackText,
                              {
                                marginTop: -RFValue(4),
                                fontSize: RFValue(20),
                                textAlign: "center",
                              },
                            ]}
                          >
                            {"+"}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                  {item.isExpanded ? (
                    <Text
                      style={[
                        styles.blackText,
                        {
                          marginTop: RFValue(10),
                          color: COLOR.WHITE,
                          padding: 10,
                        },
                      ]}
                    >
                      {item.description}
                    </Text>
                  ) : null}

                  {item.isExpanded &&
                  item.placeholders != undefined &&
                  item.placeholders.length > 0 ? (
                    <View>
                      <FlatList
                        contentContainerStyle={{ flex: 1 }}
                        data={item.placeholders}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => `${item._id}`}
                        listKey={(index) => "K" + index.toString()}
                        style={{ width: "100%" }}
                        renderItem={({ item }) => (
                          <TextInput
                            style={{
                              height: RFValue(80),
                              borderColor: "rgba(119, 131, 143, 0.2)",
                              borderWidth: 1,
                              borderRadius: 8,
                              backgroundColor: COLOR.WHITE,
                              paddingLeft: 10,
                              width: "95%",
                              alignSelf: "center",
                              margin: 10,
                              marginTop: RFValue(20),
                              color: "dark" ? COLOR.GREY : COLOR.GREY,
                            }}
                            value={
                              item.answer != undefined
                                ? item.answer
                                : item.value !== undefined
                                ? item.value.answer
                                : ""
                            }
                            placeholder={item.name}
                            placeholderTextColor={COLOR.BLACK}
                            maxLength={5000}
                            multiline={true}
                            underlineColorAndroid={"transparent"}
                            //onChangeText={explain => setExplain(explain)}
                            onChangeText={(text) =>
                              onExpandableTextPlaceholderChange(
                                text,
                                item,
                                index,
                                data
                              )
                            }
                          />
                        )}
                      />
                      {/* {item.isExpanded &&
                        item.placeholders != undefined &&
                        item.placeholders.length > 0 ? (
                        <View style={{ margin: RFValue(10) }}>
                          <ButtonGreen
                            text="Submit"
                            onBtnPress={() =>
                              submitInputData(data, data._id, item, "expand")
                            }
                          />
                        </View>
                      ) : null} */}
                    </View>
                  ) : null}

                  {item.isExpanded &&
                  item.voiceTotext != undefined &&
                  item.voiceTotext.length > 0 ? (
                    <FlatList
                      contentContainerStyle={{ flex: 1 }}
                      data={item.voiceTotext}
                      showsVerticalScrollIndicator={false}
                      showsHorizontalScrollIndicator={false}
                      keyExtractor={(item) => `${item._id}`}
                      listKey={(index) => "W" + index.toString()}
                      style={{ width: "100%" }}
                      renderItem={({ item }) => (
                        <View>
                          {updateExpandVoice(item, data)}
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                              alignItems: "center",
                              width: "95%",
                            }}
                          >
                            <TextInput
                              style={styles.expandVoiceTextStyle}
                              value={
                                item.answer != undefined
                                  ? item.answer
                                  : item.voiceTextValue != undefined &&
                                    item.voiceTextValue != ""
                                  ? item.voiceTextValue
                                  : item.value != undefined
                                  ? item.value.answer
                                  : ""
                              }
                              placeholder={item.name}
                              placeholderTextColor={COLOR.BLACK}
                              // numberOfLines={5}
                              multiline={true}
                              maxLength={5000}
                              underlineColorAndroid={"transparent"}
                              onChangeText={(text) =>
                                onExpandableVoicePlaceholderChange(
                                  text,
                                  item,
                                  index,
                                  data
                                )
                              }
                            />
                            {!item.isSpeechToTextQuestion ? (
                              isLoading && item._id == clickedId ? (
                                <ActivityIndicator size="large" />
                              ) : (
                                <TouchableOpacity
                                  onPress={() => {
                                    onStartSpeechToTextExpand(item, data);
                                  }}
                                  style={{ paddingLeft: 10 }}
                                >
                                  <FontAwesome
                                    name={"microphone"}
                                    size={30}
                                    color={COLOR.PRIMARY}
                                  />
                                </TouchableOpacity>
                              )
                            ) : (
                              <TouchableOpacity
                                onPress={() => {
                                  onStopSpeechToTextExpand(item, data);
                                }}
                                style={{ paddingLeft: 10 }}
                              >
                                <FontAwesome
                                  name={"microphone"}
                                  size={30}
                                  color={COLOR.CINNABAR}
                                />
                              </TouchableOpacity>
                            )}
                            {/* {isSpeechToTextClick ?
                            <TouchableOpacity
                              onPress={() => { onStartSpeechToText(item, data) }}
                              style={{ paddingLeft: 10 }}>
                              <FontAwesome name={'microphone'} size={30} color={COLOR.PRIMARY} />
                            </TouchableOpacity>
                            :
                            <TouchableOpacity
                              onPress={() => { onStopSpeechToText(item, data) }}
                              style={{ paddingLeft: 10 }}>
                              <FontAwesome name={'microphone'} size={30} color={COLOR.CINNABAR} />
                            </TouchableOpacity>
                          } */}
                          </View>
                        </View>
                      )}
                    />
                  ) : null}

                  {(item.isExpanded &&
                    item.voiceTotext != undefined &&
                    item.voiceTotext.length > 0) ||
                  (item.isExpanded &&
                    item.placeholders != undefined &&
                    item.placeholders.length > 0) ? (
                    <View style={{ margin: RFValue(10) }}>
                      <ButtonGreen
                        text="Submit"
                        onBtnPress={() =>
                          submitInputData(data, data._id, item, "expand")
                        }
                      />
                    </View>
                  ) : null}
                </View>
              </View>
            )}
          />
        </View>
      ) : null}

      {/* copy of expandable + sign */}
      {/* {data.hasExpandable && data.expandableContents.length > 0 ? (
        <View>
          {data.expandableContents.map((item, index) => {
            return (
              <View style={{ backgroundColor: item.isExpanded ? COLOR.PRIMARY1 : "green" }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: RFValue(10), padding: RFValue(10) }}>
                  <View style={{ width: '90%' }}>
                    <Text
                      style={[
                        styles.blackText,
                        item.isExpanded
                          ? { color: "white" }
                          : { color: COLOR.BLACK },
                        { marginTop: 0 },
                      ]}
                    >
                      {item.title}
                    </Text>
                  </View>

                  <View style={{ width: '10%', padding: 5, alignItems: 'center', justifyContent: 'center' }}>
                    <TouchableOpacity
                      style={[styles.plusBtn, { alignItems: 'center', justifyContent: 'center' }]}
                      onPress={() => onExpandClick(index, item, data)}
                    >
                      <Text
                        style={[
                          styles.blackText,
                          { marginTop: -RFValue(4), fontSize: RFValue(20), textAlign: 'center' },
                        ]}
                      >
                        {"+"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )
          })}
        </View>
      ) : null
      } */}
      {/* copy end  */}

      {data.listType != undefined &&
      data.listType == "horizontal-list" &&
      data.listData !== undefined &&
      data.listData.length > 0 ? (
        <FlatList
          contentContainerStyle={{
            alignItems: "center",
            justifyContent: "center",
          }}
          horizontal
          data={data.listData}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => `${item._id}`}
          listKey={(index) => "X" + index.toString()}
          // style={{ padding: 30 }}
          renderItem={({ item, index }) => (
            <View
              style={{
                marginRight: 10,
                backgroundColor: "rgba(0, 0, 0, 0.1)",
                padding: 10,
                marginTop: 20,
                width: width / 1.2,
              }}
            >
              <Text style={styles.swaipeLinkText}>{item.name}</Text>
              <Text style={styles.swaipeDescText}>{item.description}</Text>
            </View>
          )}
        />
      ) : null}

      {data.listType != undefined &&
      data.listType == "vertical-list" &&
      data.listData != undefined &&
      data.listData.length > 0 ? (
        <FlatList
          contentContainerStyle={{ flex: 1 }}
          data={data.listData}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => `${item._id}`}
          listKey={(index) => "J" + index.toString()}
          style={{ width: "100%" }}
          renderItem={({ item, index }) => (
            <View style={{ marginTop: RFValue(10), flexDirection: "row" }}>
              {item.image !== undefined &&
              item.image !== null &&
              item.image !== "" ? (
                <Image
                  resizeMode="contain"
                  style={{
                    width: RFValue(30),
                    height: RFValue(30),
                    paddingRight: RFValue(5),
                  }}
                  // GLOBALS.IMAGE_BASE_URL +
                  source={{ uri: item.image }}
                />
              ) : null}
              <View style={{ paddingLeft: RFValue(5) }}>
                <Text style={styles.listBlackText}>{item.name}</Text>
                <Text style={styles.listDescriptionText}>
                  {item.description}
                </Text>
              </View>
            </View>
          )}
        />
      ) : null}
      {data.questions != undefined && data.questions.length > 0
        ? data.questions.map((ques, cIndex) => {
            if (
              ques.ansType == "checkbox" &&
              ques.ansOptions != undefined &&
              ques.ansOptions.length > 0
            ) {
              updateIsChecked(ques);
              return (
                <View>
                  <FlatList
                    contentContainerStyle={{ flex: 1 }}
                    data={ques.ansOptions}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => `${item._id}`}
                    listKey={(index) => "M" + index.toString()}
                    style={{ width: "100%" }}
                    renderItem={({ item, index }) => (
                      <View>
                        <TouchableOpacity
                          onPress={() => onCheckBoxClick(item, index, ques)}
                          style={{
                            flexDirection: "row",
                            marginTop: RFValue(10),
                            alignItems: "flex-start",
                            paddingLeft: RFValue(10),
                          }}
                        >
                          <View
                            style={{
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            {item.image !== undefined &&
                            item.image !== null &&
                            item.image !== "" ? (
                              <Image
                                resizeMode="contain"
                                style={{
                                  width: RFValue(30),
                                  height: RFValue(30),
                                  paddingRight: RFValue(5),
                                  marginBottom: RFValue(10),
                                }}
                                // GLOBALS.IMAGE_BASE_URL +
                                source={{
                                  uri: item.image,
                                }}
                              />
                            ) : null}
                            <Image
                              source={
                                item.isChecked
                                  ? ICONS.CheckedSquare
                                  : ICONS.RectangleBlack
                              }
                              resizeMode="contain"
                              style={styles.checkBoxImage}
                            />
                          </View>
                          <View style={{ paddingHorizontal: 10 }}>
                            <Text style={styles.listBlackText}>
                              {item.name}
                            </Text>
                            <Text style={styles.listDescriptionText}>
                              {item.description}
                            </Text>
                          </View>
                        </TouchableOpacity>

                        {item.name == "Others" && item.isChecked ? (
                          <View>
                            <TextInput
                              style={{
                                height: RFValue(80),
                                borderColor: "rgba(119, 131, 143, 0.2)",
                                borderWidth: 1,
                                borderRadius: 8,
                                backgroundColor: COLOR.grey_300,
                                paddingLeft: 10,
                                width: "95%",
                                alignSelf: "center",
                                margin: 10,
                                marginTop: RFValue(20),
                                color: "dark" ? COLOR.GREY : COLOR.GREY,
                              }}
                              value={
                                item.others_answer !== undefined
                                  ? item.others_answer
                                  : ""
                              }
                              placeholder={item.name}
                              placeholderTextColor={COLOR.BLACK}
                              maxLength={5000}
                              multiline={true}
                              underlineColorAndroid={"transparent"}
                              onChangeText={(text) =>
                                onOtherCheckedPlaceholderChange(
                                  text,
                                  item,
                                  data
                                )
                              }
                            />
                          </View>
                        ) : null}
                      </View>
                    )}
                  />
                </View>
              );
            }
          })
        : null}

      {data.listType != undefined &&
      (data.listType == "link" || data.listType == "list") &&
      data.listData != undefined &&
      data.listData.length > 0 ? (
        <FlatList
          contentContainerStyle={{ flex: 1 }}
          data={data.listData}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => `${item._id}`}
          listKey={(index) => "J" + index.toString()}
          style={{ width: "100%" }}
          renderItem={({ item, index }) =>
            item.headingType == "button" ? (
              <ButtonGreen
                text={item.heading}
                onBtnPress={() =>
                  contentLinkClicked(
                    item,
                    data._id,
                    data.hasStep,
                    index,
                    cardIndex
                  )
                }
              />
            ) : (
              <View style={styles.linkVw}>
                <View style={styles.imageContainer}>
                  <Image
                    source={
                      data.listType == "link"
                        ? ICONS.OrangeTick
                        : ICONS.GreenDots
                    }
                    resizeMode="contain"
                    style={styles.heartImage}
                  />
                </View>
                <Text
                  style={[
                    styles.linkText,
                    data.listType == "list" ? { color: "black" } : null,
                  ]}
                >
                  {item.name}
                </Text>
              </View>
            )
          }
        />
      ) : null}

      {data.contents != undefined && data.contents.length > 0 ? (
        <FlatList
          contentContainerStyle={{ flex: 1, backgroundColor: "red" }}
          style={{ backgroundColor: "blue" }}
          data={data.contents}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => `${item._id}`}
          listKey={(index) => "F" + index.toString()}
          style={{ width: "100%" }}
          renderItem={({ item, index }) => (
            <LinkUIRender
              item={item}
              contentLinkClicked={contentLinkClicked}
              goToBuildCircleTrust={goToBuildCircleTrust}
              data={data}
              index={index}
              cardIndex={cardIndex}
            />
          )}
        />
      ) : null}

      {data.trackerElement !== undefined &&
      data.trackerElement.length > 0 &&
      data.trackerElement[0].moodtracker !== undefined &&
      data.trackerElement[0].moodtracker ? (
        <Text
          onPress={() => goToMoodTrackerScreen()}
          style={[
            styles.linkText,
            { alignSelf: "flex-start", marginTop: RFValue(15) },
          ]}
        >
          Click here for the Mood tracker
        </Text>
      ) : null}

      {data.trackerElement !== undefined &&
      data.trackerElement.length > 0 &&
      data.trackerElement[0].sleeptracker !== undefined &&
      data.trackerElement[0].sleeptracker ? (
        <Text
          onPress={() => goToSleepTrackerScreen()}
          style={[
            styles.linkText,
            { alignSelf: "flex-start", marginTop: RFValue(15) },
          ]}
        >
          Click here for the Sleep tracker
        </Text>
      ) : null}

      {data.trackerElement !== undefined &&
      data.trackerElement.length > 0 &&
      data.trackerElement[0].actvitytracker !== undefined &&
      data.trackerElement[0].actvitytracker ? (
        <Text
          onPress={() => goToPleasantActivityScreen()}
          style={[
            styles.linkText,
            { alignSelf: "flex-start", marginTop: RFValue(15) },
          ]}
        >
          Click here for the Activity trackers
        </Text>
      ) : null}

      {data.questions != undefined && data.questions.length > 0 ? (
        <FlatList
          contentContainerStyle={{ flex: 1 }}
          data={data.questions}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          listKey={(index) => "E" + index.toString()}
          extraData={refresh}
          style={{ width: "100%", marginTop: RFValue(20) }}
          renderItem={({ item, index }) =>
            item.ansType == "textarea" ? (
              <View>
                <Text
                  style={[
                    styles.blackText,
                    { marginTop: RFValue(0), alignSelf: "flex-start" },
                  ]}
                >
                  {item.question}
                </Text>
                <TextInput
                  style={{
                    height: RFValue(80),
                    borderColor: "rgba(119, 131, 143, 0.2)",
                    borderWidth: 1,
                    borderRadius: 8,
                    backgroundColor: COLOR.grey_300,
                    paddingLeft: 10,
                    width: "90%",
                    marginVertical: RFValue(20),
                    color: "dark" ? COLOR.GREY : COLOR.GREY,
                  }}
                  value={
                    item.answer != undefined
                      ? item.answer.answer == undefined
                        ? item.answer
                        : item.answer.answer
                      : ""
                  }
                  placeholder={data.placeholder}
                  // placeholderTextColor={COLOR.BLACK}
                  maxLength={5000}
                  multiline={true}
                  underlineColorAndroid={"transparent"}
                  onChangeText={(text) => onTextAnswerChange(text, item, data)}
                />
              </View>
            ) : item.ansType == "voice" ? (
              <View>
                {updateQuestionVoice(item, data)}
                <Text
                  style={[
                    styles.blackText,
                    { marginTop: RFValue(0), alignSelf: "flex-start" },
                  ]}
                >
                  {item.question}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  {/* {speechResultValue} */}
                  <TextInput
                    style={[
                      styles.voiceTextStyle,
                      { marginVertical: RFValue(20) },
                    ]}
                    value={
                      item.voiceAnswer !== undefined && item.voiceAnswer != ""
                        ? item.voiceAnswer
                        : item.voiceTextValue != undefined &&
                          item.voiceTextValue != ""
                        ? item.voiceTextValue
                        : item.answer !== undefined &&
                          item.answer.answer !== undefined &&
                          item.answer.answer !== ""
                        ? item.answer.answer
                        : ""
                    }
                    placeholder={
                      "Please click on mic icon to journal your thought here."
                    }
                    placeholderTextColor={COLOR.WHITE}
                    maxLength={5000}
                    selectionColor={COLOR.WHITE}
                    multiline={true}
                    underlineColorAndroid={"transparent"}
                    onChangeText={(text) =>
                      onVoiceTextAnswerChange(text, item, data)
                    }
                  />

                  {!item.isSpeechToTextQuestion ? (
                    isLoading && item._id == clickedId ? (
                      <ActivityIndicator size="large" />
                    ) : (
                      <TouchableOpacity
                        onPress={() => {
                          onStartSpeechToTextQuestion(item, data);
                        }}
                        style={{ paddingLeft: 10 }}
                      >
                        <FontAwesome
                          name={"microphone"}
                          size={30}
                          color={COLOR.PRIMARY}
                        />
                      </TouchableOpacity>
                    )
                  ) : (
                    <TouchableOpacity
                      onPress={() => {
                        onStopSpeechToTextQuestion(item, data);
                      }}
                      style={{ paddingLeft: 10 }}
                    >
                      <FontAwesome
                        name={"microphone"}
                        size={30}
                        color={COLOR.CINNABAR}
                      />
                    </TouchableOpacity>
                  )}
                </View>

                {/* recording UI */}
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  {isShowPlayUI ? (
                    <View style={styles.viewRecorder}>
                      <View style={styles.viewPlayer}>
                        <Text style={styles.txtRecordCounter}>
                          {recordTime}
                        </Text>
                        <TouchableOpacity
                          style={styles.viewBarWrapper}
                          // onPress={this.onStatusPress}
                        >
                          <View style={styles.viewBar}>
                            <View
                              style={[styles.viewBarPlay, { width: playWidth }]}
                            />
                          </View>
                        </TouchableOpacity>
                        <Text style={styles.txtCounter}>
                          {playTime} / {recordDuration}
                        </Text>
                        <View style={styles.playBtnWrapper}>
                          <TouchableOpacity
                            style={{
                              padding: 8,
                              borderWidth: 1,
                              borderColor: "#FFF",
                              margin: 5,
                            }}
                            onPress={() => onStartPlayRecording()}
                          >
                            <FontAwesome
                              name={"play-circle"}
                              size={30}
                              color={COLOR.PRIMARY}
                            />
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={{
                              padding: 8,
                              borderWidth: 1,
                              borderColor: "#FFF",
                              margin: 5,
                            }}
                            onPress={() => onPausePlayRecording()}
                          >
                            <FontAwesome
                              name={"pause-circle"}
                              size={30}
                              color={COLOR.TEXT_ORANGE}
                            />
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={{
                              padding: 8,
                              borderWidth: 1,
                              borderColor: "#FFF",
                              margin: 5,
                            }}
                            onPress={() => onStopPlayRecording()}
                          >
                            <FontAwesome
                              name={"stop-circle"}
                              size={30}
                              color={COLOR.CINNABAR}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  ) : null}
                </View>
              </View>
            ) : item.ansType == "radio" ? (
              <View>
                {updateIsRadioChecked(item)}
                <Text
                  style={[
                    styles.blackText,
                    { marginTop: RFValue(0), alignSelf: "flex-start" },
                  ]}
                >
                  {item.question}
                </Text>
                <FlatList
                  data={item.ansOptions}
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item) => `${item._id}`}
                  listKey={(index) => "G" + index.toString()}
                  extraData={refresh}
                  style={{ marginBottom: RFValue(10) }}
                  renderItem={({ item2, index }) => (
                    <View style={{ flexDirection: "row" }}>
                      <TouchableOpacity
                        style={{
                          flex: 0.1,
                          justifyContent: "center",
                          padding: 10,
                        }}
                        onPress={() => {
                          onRadioBtnClick(index, item, item2, data);
                        }}
                      >
                        <Image
                          source={
                            item.answer != undefined &&
                            (item.answer.answer != undefined
                              ? item.answer.answer ==
                                item.ansOptions[index].name
                              : item.answer == item.ansOptions[index].name)
                              ? ICONS.RadioCheckedBlack
                              : ICONS.RadioUnchecked
                          }
                          style={{ height: RFValue(20), width: RFValue(20) }}
                        />
                        {/*  
                            inside image source
                            item.answer != undefined
                                  && (item.answer.answer != undefined ?
                                    item.answer.answer == item.ansOptions[index].name
                                    : item.answer == item.ansOptions[index].name) ? ICONS.RadioCheckedBlack
                                  : ICONS.RadioUnchecked */}
                      </TouchableOpacity>
                      <View style={{ marginLeft: 10 }}>
                        <Text
                          style={[styles.reasonText, { fontSize: RFValue(16) }]}
                        >
                          {item.ansOptions[index].name}
                        </Text>
                      </View>
                    </View>
                  )}
                />

                {item.ansType == "radio"
                  ? item.ansOptions.map((ques, cIndex) => {
                      return ques.isRadioAnsShow ? (
                        <View
                          style={{
                            backgroundColor: COLOR.BOX_GRAY,
                            padding: RFValue(5),
                            marginBottom: RFValue(10),
                          }}
                        >
                          <Text
                            style={{
                              fontSize: RFValue(14),
                              fontFamily: FONTS.REGULAR,
                              color: COLOR.BLACK,
                            }}
                          >
                            {ques.answer}
                          </Text>
                        </View>
                      ) : null;
                    })
                  : null}
                {/* {
                    data.questions !== undefined &&
                      data.questions.length > 0 &&
                      data.questions[0].ansOptions !== undefined &&
                      data.questions[0].ansOptions.length > 0 &&
                      data.questions[0].ansType == "radio"
                      ? data.questions[0].ansOptions.map((ques, cIndex) => {
                        return (
                          <View>
                            {ques.isRadioAnsShow ? (
                              <Text
                                style={{
                                  fontSize: RFValue(14),
                                  fontFamily: FONTS.REGULAR,
                                  paddingTop: RFValue(20),
                                  color: COLOR.BLACK,
                                }}
                              >
                                {ques.answer}
                              </Text>
                            ) : null}
                          </View>
                        );
                      })
                      : null
                  } */}
                {(item.answer != undefined && item.answer == "Others") ||
                (item.answer != undefined &&
                  item.answer.answer != undefined &&
                  item.answer.answer == "Others") ? (
                  <TextInput
                    style={{
                      height: RFValue(80),
                      borderColor: "rgba(119, 131, 143, 0.2)",
                      borderWidth: 1,
                      borderRadius: 8,
                      backgroundColor: COLOR.grey_300,
                      paddingLeft: 10,
                      width: "100%",
                      marginTop: RFValue(20),
                      color: "dark" ? COLOR.GREY : COLOR.GREY,
                    }}
                    value={
                      item.answer != undefined &&
                      item.answer.other_answer !== undefined &&
                      item.answer.other_answer !== null
                        ? item.answer.other_answer
                        : item.answer.others_answer
                    }
                    placeholder={"Explain here.."}
                    placeholderTextColor={COLOR.BLACK}
                    maxLength={5000}
                    multiline={true}
                    underlineColorAndroid={"transparent"}
                    //onChangeText={explain => setExplain(explain)}
                    onChangeText={(text) =>
                      onOtherTextPlaceholderChange(text, item, data)
                    }
                  />
                ) : null}
              </View>
            ) : item.ansType == "yes/no" ? (
              <View style={{ flex: 1, width: "100%" }}>
                <Text
                  style={[
                    styles.blackText,
                    { marginTop: RFValue(0), alignSelf: "flex-start" },
                  ]}
                >
                  {item.question}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{ flex: 1, marginRight: RFValue(10) }}>
                    <ButtonBlue
                      text="YES"
                      onBtnPress={() =>
                        yesNoBtnClicked("yes", item, data, data._id)
                      }
                    />
                  </View>
                  <View style={{ flex: 1, marginLeft: RFValue(10) }}>
                    <ButtonOrange
                      text="NO"
                      onBtnPress={() =>
                        yesNoBtnClicked("no", item, data, data._id)
                      }
                    />
                  </View>
                </View>
              </View>
            ) : null
          }
        />
      ) : null}

      {/*    {/*   */}
      {data.questions != undefined &&
      data.questions.length > 0 &&
      data.questions[0].ansType != "yes/no" ? (
        <View style={{ width: "100%", marginTop: RFValue(20) }}>
          <ButtonGreen
            text="Submit"
            onBtnPress={() => submitquestionAnswerData(data, data._id)}
          />
        </View>
      ) : null}
      {data.questions !== undefined &&
      data.questions.length > 0 &&
      data.questions[0].ansOptions !== undefined &&
      data.questions[0].ansOptions.length > 0 &&
      data.questions[0].ansType == "checkbox"
        ? data.questions[0].ansOptions.map((ques, cIndex) => {
            return (
              <View>
                {ques.isChecked || ques.checkboxAnsShow ? (
                  <Text
                    style={{
                      fontSize: RFValue(14),
                      fontFamily: FONTS.REGULAR,
                      paddingTop: RFValue(20),
                      color: COLOR.BLACK,
                    }}
                  >
                    {ques.answer}
                  </Text>
                ) : null}
              </View>
            );
          })
        : null}
      {/* 
      {
        data.questions !== undefined &&
          data.questions.length > 0 &&
          data.questions[0].ansOptions !== undefined &&
          data.questions[0].ansOptions.length > 0 &&
          data.questions[0].ansType == "radio"
          ? data.questions[0].ansOptions.map((ques, cIndex) => {
            return (
              <View>
                {ques.isRadioAnsShow ? (
                  <Text
                    style={{
                      fontSize: RFValue(14),
                      fontFamily: FONTS.REGULAR,
                      paddingTop: RFValue(20),
                      color: COLOR.BLACK,
                    }}
                  >
                    {ques.answer}
                  </Text>
                ) : null}
              </View>
            );
          })
          : null
      } */}

      {data.voiceTotext != undefined && data.voiceTotext.length > 0 ? (
        <FlatList
          contentContainerStyle={{ flex: 1 }}
          data={data.voiceTotext}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => `${item._id}`}
          listKey={(index) => "V" + index.toString()}
          extraData={refresh}
          style={{ width: "100%" }}
          renderItem={({ item, index }) => (
            <View>
              {updatePlaceholderVoice(item, data)}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  // backgroundColor: 'red'
                }}
              >
                <TextInput
                  style={styles.voiceTextStyle}
                  value={
                    item.answer != undefined
                      ? item.answer
                      : item.voiceTextValue != undefined &&
                        item.voiceTextValue != ""
                      ? item.voiceTextValue
                      : item.value != undefined
                      ? item.value.answer
                      : ""
                  }
                  placeholder={item.name}
                  placeholderTextColor={COLOR.WHITE}
                  maxLength={5000}
                  multiline={true}
                  underlineColorAndroid={"transparent"}
                  onChangeText={(text) => {
                    return onVoiceTextPlaceholderChange(text, item, data);
                  }}
                />
                {!item.isSpeechToTextQuestion ? (
                  isLoading && item._id == clickedId ? (
                    <ActivityIndicator size="large" />
                  ) : (
                    <TouchableOpacity
                      onPress={() => {
                        onStartSpeechToTextPlaceholder(item, data);
                      }}
                      style={{ paddingLeft: 10 }}
                    >
                      <FontAwesome
                        name={"microphone"}
                        size={30}
                        color={COLOR.PRIMARY}
                      />
                    </TouchableOpacity>
                  )
                ) : (
                  <TouchableOpacity
                    onPress={() => {
                      onStopSpeechToTextPlaceholder(item, data);
                    }}
                    style={{ paddingLeft: 10 }}
                  >
                    <FontAwesome
                      name={"microphone"}
                      size={30}
                      color={COLOR.CINNABAR}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        />
      ) : null}

      {data.placeholders != undefined && data.placeholders.length > 0 ? (
        <FlatList
          contentContainerStyle={{ flex: 1 }}
          data={data.placeholders}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => `${item._id}`}
          listKey={(index) => "H" + index.toString()}
          style={{ width: "100%" }}
          renderItem={({ item, index }) => (
            <View>
              <TextInput
                style={{
                  height: RFValue(80),
                  borderColor: "rgba(119, 131, 143, 0.2)",
                  borderWidth: 1,
                  borderRadius: 8,
                  backgroundColor: COLOR.grey_300,
                  // backgroundColor: 'rgba(119, 131, 143, 0.2)',
                  paddingLeft: 10,
                  width: "100%",
                  marginTop: RFValue(20),
                  color: "dark" ? COLOR.GREY : COLOR.GREY,
                }}
                value={
                  item.answer != undefined
                    ? item.answer
                    : item.value != undefined
                    ? item.value.answer
                    : ""
                }
                placeholder={item.name}
                placeholderTextColor={COLOR.BLACK}
                maxLength={5000}
                multiline={true}
                underlineColorAndroid={"transparent"}
                //onChangeText={explain => setExplain(explain)}
                onChangeText={(text) =>
                  onTextPlaceholderChange(text, item, data)
                }
              />
            </View>
          )}
        />
      ) : null}
      {data.feedbackOfWeek ? (
        <TouchableOpacity
          style={{ width: "100%" }}
          onPress={() => goToFeedbackScreen()}
        >
          <Text style={[styles.linkText, { marginTop: RFValue(20) }]}>
            Click here to add feedback for the week
          </Text>
        </TouchableOpacity>
      ) : null}

      {(data.placeholders != undefined && data.placeholders.length > 0) ||
      (data.voiceTotext != undefined && data.voiceTotext.length > 0) ? (
        <ButtonGreen
          text="Submit"
          onBtnPress={() => submitInputData(data, data._id)}
        />
      ) : null}

      {data.audioFiles != undefined && data.audioFiles.length > 0 ? (
        <FlatList
          contentContainerStyle={{ flex: 1 }}
          data={data.audioFiles}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => `${item._id}`}
          listKey={(index) => "I" + index.toString()}
          style={{ width: "100%" }}
          renderItem={({ item, index }) => (
            <View>
              <Video
                // source={{ uri: GLOBALS.IMAGE_BASE_URL + item.name }} // Can be a URL or a local file.
                source={{ uri: item.name }} // Can be a URL or a local file.
                ref={(input) => {}}
                playInBackground={true}
                playWhenInactive={true}
                paused={!isPlayingAudio} // Pauses playback entirely.
                resizeMode="cover" // Fill the whole screen at aspect ratio.
                repeat={true} // Repeat forever.
                onLoad={setDuration.bind(this)}
                onProgress={setTime.bind(this)} // Callback every ~250ms with currentTime
                style={styles.audioElement}
                audioOnly={true}
              />

              <Slider
                maximumValue={Math.max(trackLength, 1, currentPosition + 1)}
                onSlidingStart={() => stopAudio()}
                onSlidingComplete={seek.bind(this)}
                value={currentPosition}
                minimumTrackTintColor={COLOR.PRIMARY1}
                maximumTrackTintColor="#E9E9E9"
                thumbStyle={styles.thumb}
                trackStyle={styles.track}
              />
              <View style={{ flexDirection: "row" }}>
                <Text style={[styles.text, { color: "black" }]}>
                  {elapsed[0] + ":" + elapsed[1]}
                </Text>
                <View style={{ flex: 1 }} />
                <Text style={[styles.text, { color: "black" }]}>
                  {trackLength > 1 && "-" + remaining[0] + ":" + remaining[1]}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <TouchableOpacity onPress={() => onBack()}>
                  <Image style={{ tintColor: "grey" }} source={ICONS.Rewind} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ alignItems: "center", marginHorizontal: 10 }}
                  onPress={() => playAudio(item)}
                >
                  <Image
                    source={isPlayingAudio ? ICONS.Pause : ICONS.Play}
                    resizeMode="contain"
                    style={styles.heartImage}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onForward()} disabled={false}>
                  <Image
                    style={{ tintColor: "grey" }}
                    source={ICONS.ForwardPlay}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      ) : null}
      {data.videoFiles != undefined && data.videoFiles.length > 0 ? (
        <FlatList
          contentContainerStyle={{ flex: 1 }}
          data={data.videoFiles}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => `${item._id}`}
          listKey={(index) => "L" + index.toString()}
          style={{ width: "100%", marginTop: 8 }}
          renderItem={({ item, index }) =>
            !item.isTop ? (
              <View style={{ marginVertical: 8 }}>
                {Platform.OS === "ios" ? (
                  <Video
                    // source={{
                    //   uri: (GLOBALS.IMAGE_BASE_URL + item.name).replace(
                    //     / /g,
                    //     "%20"
                    //   ),
                    //   type: "mp4",
                    // }} // Can be a URL or a local file.
                    source={{ uri: item.name }}
                    ref={(ref) => {
                      setRefOfVideo(ref);
                    }} // Store reference
                    paused={true}
                    controls={true}
                    style={styles.backgroundVideo}
                    // style={styles.fullScreen}
                  />
                ) : (
                  <VideoPlayer
                    // source={{
                    //   uri: (GLOBALS.IMAGE_BASE_URL + item.name).replace(
                    //     / /g,
                    //     "%20"
                    //   ),
                    //   type: "mp4",
                    // }}
                    source={{ uri: item.name }}
                    showOnStart={true}
                    toggleResizeModeOnFullscreen={true}
                    controlAnimationTiming={3000}
                    doubleTapTime={130}
                    controlTimeout={35000}
                    scrubbing={0}
                    seekColor={COLOR.BACKGROUND_ORANGE}
                    style={{ backgroundColor: COLOR.PRIMARY1 }}
                    tapAnywhereToPause={true}
                    paused={true}
                  />
                )}
                <Text
                  style={{
                    paddingTop: RFValue(10),
                    fontSize: RFValue(14),
                    fontFamily: FONTS.CIRCULAR_MEDIUM,
                  }}
                >
                  {item.caption}
                </Text>
              </View>
            ) : null
          }
        />
      ) : null}

      {/* {data.Youtubelink && data.Youtubelink.length
        ? data.Youtubelink.map((item) => {
            return (
              <YouTube
                videoId={item.name}
                fullscreen
                onReady={(e) => setReady(item.name)}
                style={styles.youtubeView}
              />
            );
          })
        : null} */}

      {data.isLikeComment ? (
        <View style={styles.likeCommentVw}>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center" }}
              onPress={() => likeBtnClicked(index, data)}
            >
              <Image
                // source={data.like !== undefined && data.like == 0 ? ICONS.BlackHeart : ICONS.Heart}
                source={ICONS.Heart}
                resizeMode="contain"
                style={{
                  tintColor:
                    data.like !== undefined && data.like == 0
                      ? "black"
                      : COLOR.BACKGROUND_ORANGE,
                  height: RFValue(20),
                  width: RFValue(20),
                  marginHorizontal: 8,
                }}
              />
              <Text
                style={[
                  styles.blackText,
                  { marginTop: 0, fontSize: RFValue(14) },
                ]}
              >
                Like
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                marginLeft: RFValue(16),
                flexDirection: "row",
                alignItems: "center",
              }}
              onPress={() => setShowComment(!showComment)}
            >
              <Image
                source={ICONS.Comment}
                resizeMode="contain"
                style={[
                  {
                    height: RFValue(25),
                    width: RFValue(25),
                    marginHorizontal: 8,
                  },
                  { marginLeft: RFValue(10) },
                  data.usercomments.length > 0 ? { tintColor: "green" } : null,
                ]}
              />
              <Text
                style={[
                  styles.blackText,
                  { marginTop: 0, fontSize: RFValue(14) },
                ]}
              >
                Comment
              </Text>
            </TouchableOpacity>
          </View>
          <AirbnbRating
            defaultRating={data.rating}
            showRating={false}
            onFinishRating={(ratingVal) => ratingChanged(ratingVal, data)}
            size={16}
          />
        </View>
      ) : null}
      {/* {showComment ? <TextInput
        style={{
          height: RFValue(60),
          borderColor: COLOR.PRIMARY1,
          borderWidth: 1,
          borderRadius: 8,
          backgroundColor: COLOR.WHITE,
          paddingLeft: 10,
          width: '100%',
          marginTop: RFValue(20),
          marginBottom: RFValue(20)
        }}
        value={comment}
        placeholder='Comment...'
        placeholderTextColor={COLOR.GREY}
        maxLength={50}
        underlineColorAndroid={'transparent'}
        onChangeText={comment => setComment(comment)}
      /> : null}
      <ButtonBlue text='SUBMIT' onBtnPress={() => submitBtnClicked(like ? 1 : 0, comment, rating, data._id)} /> */}
      {/* <View style={styles.likeCommentVw}>
          <Image
            source={ICONS.Heart}
            resizeMode="contain"
            style={styles.heartImage}
          />
          <Text style={[styles.blackText, { marginTop: 0, fontSize: RFValue(14) }]}>Comment</Text>
        </View> */}
    </View>
  );
};

const LinkVw = ({ item, index, linkClicked }) => {
  const { user } = item;
  return (
    <TouchableOpacity
      style={styles.linkVw}
      onPress={() => linkClicked(item, index)}
    >
      <View style={styles.imageContainer}>
        <Image
          source={ICONS.OrangeTick}
          resizeMode="contain"
          style={styles.heartImage}
        />
      </View>
      <Text style={styles.linkText}>{item.heading}</Text>
    </TouchableOpacity>
  );
};

const LinkUIRender = ({
  item,
  contentLinkClicked,
  goToBuildCircleTrust,
  data,
  index,
  cardIndex,
}) => {
  if (item.headingType == "button") {
    return (
      <ButtonGreen
        text={item.heading}
        onBtnPress={() =>
          contentLinkClicked(item, data._id, data.hasStep, index, cardIndex)
        }
      />
    );
  }
  return (
    <TouchableOpacity
      style={styles.linkVw}
      onPress={() =>
        item.heading == "Click to build your Circle of Trust"
          ? goToBuildCircleTrust(item)
          : contentLinkClicked(item, data._id, data.hasStep, index, cardIndex)
      }
    >
      {item.headingType == "link" ? (
        <View style={styles.imageContainer}>
          <Image
            source={ICONS.OrangeTick}
            resizeMode="contain"
            style={styles.heartImage}
          />
        </View>
      ) : null}

      {item.headingType == "Rounded Button" ? (
        <View style={styles.roundedBtnView}>
          <View style={{ flex: 0.95 }}>
            <Text
              style={{
                fontSize: RFValue(14),
                alignSelf: "flex-start",
                fontFamily: FONTS.LIGHT,
              }}
            >
              {item.heading}
            </Text>
          </View>
          <View style={{ flex: 0.05 }}>
            <Image
              source={ICONS.Forward}
              resizeMode="contain"
              style={{ width: RFValue(12), height: RFValue(12) }}
            />
          </View>
        </View>
      ) : null}
      <Text style={styles.linkText}>{item.heading}</Text>
    </TouchableOpacity>
  );
};

function WeekInfoList(props) {
  let {
    loginData,
    data,
    teamLoader,
    goToNotAlone,
    goToBuildCircleTrust,
    linkClicked,
    contentLinkClicked,
    week,
    day,
    submitBtnClicked,
    submitquestionAnswerData,
    submitInputData,
    loadMore,
    updatePatientWeekDayAPI,
    refreshing,
    onRefreshClick,
    isCalledAPI,
    playAudio,
    stopAudio,
    isPlayingAudio,
    setDuration,
    setTime,
    seek,
    onBack,
    onForward,
    trackLength,
    onSlidingStart,
    currentPosition,
    setRefOfAudio,
    setRefOfVideo,
    onSwipeRight,

    screenType,
    startSpeechToText,
    stopSpeechToText,
    speechResultValue,
    recordTime,
    startRecord,
    onStopRecord,
    playWidth,
    playTime,
    recordDuration,
    onStartPlayRecording,
    onPausePlayRecording,
    onStopPlayRecording,
    goToPleasantActivityScreen,
    goToMoodTrackerScreen,
    goToSleepTrackerScreen,
    voiceResults,
    goToFeedbackScreen,

    isUpdateWeekDatAPI,
    isUpdateGreenCheckAPI,

    currentWeek,
    currentDay,
    totalWeeksToShow,
    cardsLength,
  } = props;

  const [isRefresh, setIsRefresh] = useState(false);
  const [pausedVideo, setPausedVideo] = useState(true);
  const [cards, setCards] = useState(cardsLength);

  const isCloseToBottom = (nativeEvent) => {
    let { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
    const paddingToBottom = 20; // how far from the bottom
    let value1 = layoutMeasurement.height + contentOffset.y;
    let value2 = contentSize.height - paddingToBottom;
    let isVAlue2GreaterThanLayout = value2 > layoutMeasurement.height;
    let value1GreterthanValue2 = value1 >= value2;
    let isClose = isVAlue2GreaterThanLayout && value1GreterthanValue2;
    return isClose;
  };

  const _onViewableItemsChanged = useCallback(({ viewableItems, changed }) => {
    if (week == currentWeek && day == currentDay) {
      if (viewableItems.length > 0) {
        let totalCards = viewableItems[0].item.totalCards;
        if (totalCards > 2) {
          let index = totalCards - 2;
          if (viewableItems[0].index == index) {
            //call api
            if (!isUpdateWeekDatAPI) {
              updatePatientWeekDayAPI();
            }
            // updatePatientWeekDayAPI()
          }
        } else if (totalCards > 0 && totalCards <= 2) {
          updatePatientWeekDayAPI();
        }
      }
    }
  }, []);

  const _viewabilityConfig = {
    //HFT critical content not moving if cards having less content. 27th may 2021
    itemVisiblePercentThreshold: 5,
  };

  return (
    <KeyboardAvoidingView
      enableOnAndroid={true}
      showsVerticalScrollIndicator={false}
      extraScrollHeight={Platform.OS == "ios" ? 80 : 80}
      behavior="padding"
      style={{ flex: 1 }}
    >
      {teamLoader ? (
        <Loader />
      ) : data ? (
        <View style={[styles.scene]}>
          <FlatList
            data={data}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => `${item._id}`}
            extraData={isRefresh}
            renderItem={({ item, index }) => (
              <View>
                <CommonCardView
                  item={item}
                  index={index}
                  goToNotAlone={goToNotAlone}
                  goToBuildCircleTrust={goToBuildCircleTrust}
                  linkClicked={linkClicked}
                  contentLinkClicked={contentLinkClicked}
                  submitBtnClicked={submitBtnClicked}
                  submitquestionAnswerData={submitquestionAnswerData}
                  submitInputData={submitInputData}
                  week={week}
                  day={day}
                  setIsRefresh={setIsRefresh}
                  isRefresh={isRefresh}
                  playAudio={playAudio}
                  stopAudio={stopAudio}
                  isPlayingAudio={isPlayingAudio}
                  setDuration={setDuration}
                  setTime={setTime}
                  seek={seek}
                  onBack={onBack}
                  onForward={onForward}
                  trackLength={trackLength}
                  onSlidingStart={onSlidingStart}
                  currentPosition={currentPosition}
                  setRefOfAudio={setRefOfAudio}
                  setRefOfVideo={setRefOfVideo}
                  screenType={screenType}
                  pausedVideo={pausedVideo}
                  setPausedVideo={setPausedVideo}
                  startSpeechToText={startSpeechToText}
                  stopSpeechToText={stopSpeechToText}
                  speechResultValue={speechResultValue}
                  recordTime={recordTime}
                  startRecord={startRecord}
                  onStopRecord={onStopRecord}
                  playWidth={playWidth}
                  playTime={playTime}
                  recordDuration={recordDuration}
                  onStartPlayRecording={onStartPlayRecording}
                  onPausePlayRecording={onPausePlayRecording}
                  onStopPlayRecording={onStopPlayRecording}
                  goToPleasantActivityScreen={goToPleasantActivityScreen}
                  goToMoodTrackerScreen={goToMoodTrackerScreen}
                  goToSleepTrackerScreen={goToSleepTrackerScreen}
                  goToFeedbackScreen={goToFeedbackScreen}
                  voiceResults={voiceResults}
                />
              </View>
            )}
            onRefresh={() =>
              screenType == "careConcerns" ? null : onRefreshClick()
            }
            refreshing={screenType == "careConcerns" ? false : refreshing}
            onEndReachedThreshold={0.2}
            // onViewableItemsChanged={_onViewableItemsChanged}
            // viewabilityConfig={_viewabilityConfig}
            onScroll={({ nativeEvent }) => {
              let totalCards;
              if (data) {
                totalCards =
                  data[0].totalCards !== undefined ? data[0].totalCards : 0;
              }
              if (week == currentWeek && day == currentDay) {
                if (!isUpdateWeekDatAPI) {
                  updatePatientWeekDayAPI();
                }
                if (totalCards !== undefined && totalCards > 1) {
                  if (isCloseToBottom(nativeEvent) && !isUpdateGreenCheckAPI) {
                    updatePatientWeekDayAPI(true);
                  }
                } else {
                  updatePatientWeekDayAPI(true);
                }
              }
              if (
                (week == totalWeeksToShow && day == 7) ||
                (week == currentWeek && day == currentDay) ||
                // && loginData["user"]["_id"] != "5f1e54764944c0115c681828"
                screenType == "careConcerns"
              ) {
              } else {
                if (
                  isCalledAPI == false &&
                  isCloseToBottom(nativeEvent) &&
                  refreshing == false
                ) {
                  loadMore();
                }
              }
            }}
          />
          {/* </GestureRecognizer> */}
        </View>
      ) : (
        <NoData />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white", //COLOR.BACKGROUND,
    flexGrow: 1,
  },
  scene: {
    flex: 1,
  },
  cardVw: {
    backgroundColor: "white",
    alignItems: "center",
    padding: RFValue(16),
    paddingBottom: RFValue(20),
    shadowColor: COLOR.SHADOW,
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 5,
    borderTopLeftRadius: RFValue(30),
    borderTopRightRadius: RFValue(30),
    borderColor: "white",
    borderWidth: 1,
    marginTop: 10,
  },
  weekDay: {
    fontSize: RFValue(14),
    fontFamily: FONTS.CIRCULAR_MEDIUM,
    width: RFValue(70),
    height: RFValue(30),
    backgroundColor: "rgba(119, 131, 143, 0.2)",
    color: "#77838F",
    textAlign: "center",
    lineHeight: RFValue(30),
    margin: 8,
  },
  blueText: {
    fontSize: RFValue(20),
    fontFamily: FONTS.CIRCULAR_BOLD,
    color: COLOR.PRIMARY1,
    textAlign: "center",
    marginTop: RFValue(30),
    width: "80%",
  },
  blackText: {
    fontSize: RFValue(16),
    fontFamily: FONTS.CIRCULAR_MEDIUM,
    color: COLOR.BLACK,
    marginTop: RFValue(20),
    textAlign: "left",
  },
  checkBoxText: {
    fontSize: RFValue(20),
    fontFamily: FONTS.CIRCULAR_BOLD,
    color: COLOR.PRIMARY1,
    marginTop: RFValue(20),
    paddingBottom: RFValue(10),
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "white",
    marginBottom: RFPercentage(isiOS ? 1.5 : 2),
    borderRadius: RFPercentage(1.8),
    shadowColor: COLOR.SHADOW,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.6,
    shadowRadius: 1,
    padding: 1,
    elevation: 5,
    height: RFPercentage(isiOS ? 14 : 16),
  },
  imageContainer: { justifyContent: "center", marginHorizontal: 10 },
  nurseImage: {
    marginTop: RFValue(30),
    width: RFPercentage(45),
    height: RFPercentage(30),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: RFValue(10),
    borderColor: "transparent",
  },
  textInputVw: {
    marginTop: RFValue(20),
    backgroundColor: "rgba(119, 131, 143, 0.2)",
    width: "100%",
    height: RFValue(60),
    borderRadius: RFValue(20),
    padding: RFValue(8),
  },
  likeCommentVw: {
    marginTop: RFValue(20),
    backgroundColor: "rgba(119, 131, 143, 0.2)",
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: RFValue(40),
    borderRadius: RFValue(20),
    padding: RFValue(8),
    justifyContent: "space-between",
  },
  heartImage: {
    height: RFValue(20),
    width: RFValue(20),
    marginHorizontal: 8,
    // padding: RFValue(10),
    // backgroundColor: 'red'
  },
  checkBoxImage: {
    height: RFValue(20),
    width: RFValue(20),
    // marginHorizontal: 8
  },
  linkVw: {
    flexDirection: "row",
    width: "100%",
    //backgroundColor :'red',
    marginTop: RFValue(16),
    alignItems: "center",
  },
  linkText: {
    flex: 1,
    fontSize: RFValue(16),
    fontFamily: FONTS.CIRCULAR_MEDIUM,
    color: COLOR.BACKGROUND_ORANGE,
  },
  expandableVw: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    //  backgroundColor: 'red',
    margin: 10,
  },
  plusBtn: {
    width: RFValue(20),
    height: RFValue(20),
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor:'green'
  },
  reasonText: {
    fontSize: RFValue(20),
    fontFamily: FONTS.CIRCULAR_MEDIUM,
    color: COLOR.BLACK,
    padding: 15,
    // backgroundColor: 'red'
  },
  track: {
    height: 2,
    borderRadius: 1,
  },
  swaipeLinkText: {
    flex: 1,
    fontSize: RFValue(16),
    fontFamily: FONTS.CIRCULAR_MEDIUM,
    color: COLOR.BLACK,
  },
  thumb: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLOR.PRIMARY1,
  },
  swaipeDescText: {
    // flex: 1,
    fontSize: RFValue(16),
    fontFamily: FONTS.CIRCULAR_MEDIUM,
    color: COLOR.BLACK,
    marginTop: 10,
    alignSelf: "center",
  },
  audioElement: {
    height: 0,
    width: 0,
  },
  listBlackText: {
    fontSize: RFValue(16),
    fontFamily: FONTS.CIRCULAR_MEDIUM,
    color: COLOR.BLACK,
    // fontSize: RFValue(16),
    // fontFamily: FONTS.CIRCULAR_MEDIUM,
    // color: COLOR.BLACK,
    // marginTop: RFValue(20),
    // textAlign: 'left'
  },
  backgroundVideo: {
    //backgroundColor:'green',
    height: 200,
    width: "100%",
    // position: 'absolute',
    // top: 0,
    // left: 10,
    // bottom: 0,
    // right: 10,
  },
  fullScreen: {
    height: window.width / 0.8,
    width: window.width / 0.8,
  },
  listDescriptionText: {
    fontSize: RFValue(15),
    fontFamily: FONTS.CIRCULAR_MEDIUM,
    color: COLOR.GREY,
    marginTop: 5,
    paddingRight: RFValue(20),
    textAlign: "left",
  },
  stepTitle: {
    fontSize: RFValue(24),
    fontFamily: FONTS.CIRCULAR_MEDIUM,
    color: COLOR.BLACK,
    alignSelf: "center",
    paddingTop: RFValue(20),
  },
  stepDetails: {
    fontSize: RFValue(18),
    fontFamily: FONTS.CIRCULAR_MEDIUM,
    color: COLOR.BLACK,
    textAlign: "center",
    paddingTop: RFValue(10),
  },
  imageBackgroundStyle: {
    // opacity: 0.9,
    width: RFPercentage(45),
    alignItems: "center",
    justifyContent: "center",
  },
  imageViewStyle: {
    position: "absolute",
    // backgroundColor: 'rgba(52, 52, 52, 0.5)',
    width: RFPercentage(45),
    // borderWidth: 0.5,
    borderRadius: 10,
    borderColor: "transparent",
    flex: 1,
    flexDirection: "row",
  },
  textViewStyle: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    // borderTopLeftRadius: 10,
    // borderTopRightRadius: 10,
  },
  imageTextStyle: {
    color: COLOR.WHITE,
    fontSize: RFValue(16),
    fontFamily: FONTS.REGULAR,
    fontWeight: "bold",
  },
  descriptionViewStyle: {
    width: RFPercentage(45),
    // borderColor: COLOR.BORDER_LIGHT,
    // borderWidth: 1,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    opacity: 0.9,
    padding: RFValue(8),
  },
  cardTouchableStyle: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: RFValue(24),
  },
  viewRecorder: {
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  recordBtnWrapper: {
    flexDirection: "row",
  },
  viewPlayer: {
    marginTop: RFValue(10),
    alignSelf: "stretch",
    alignItems: "center",
  },
  viewBarWrapper: {
    marginTop: RFValue(10),
    marginHorizontal: 20 * ratio,
    alignSelf: "stretch",
  },
  viewBar: {
    backgroundColor: COLOR.TEXT_ORANGE,
    height: 4 * ratio,
    alignSelf: "stretch",
  },
  viewBarPlay: {
    backgroundColor: COLOR.PRIMARY1,
    height: 4 * ratio,
    width: 0,
  },
  playStatusTxt: {
    marginTop: 8 * ratio,
    color: "orange",
  },
  playBtnWrapper: {
    flexDirection: "row",
    marginTop: RFValue(10),
  },
  btn: {
    borderColor: "yellow",
    borderWidth: 1 * ratio,
  },
  txt: {
    color: "black",
    fontSize: 14 * ratio,
    marginHorizontal: 8 * ratio,
    marginVertical: 4 * ratio,
  },
  txtRecordCounter: {
    marginTop: RFValue(10),
    color: "black",
    fontSize: RFValue(20),
    fontFamily: FONTS.REGULAR,
    letterSpacing: 3,
  },
  txtCounter: {
    marginTop: RFValue(20),
    color: "black",
    fontSize: 20 * ratio,
    textAlignVertical: "center",
    fontWeight: "300",
    fontFamily: "Helvetica Neue",
    letterSpacing: 3,
  },
  voiceTextStyle: {
    height: RFValue(80),
    borderColor: COLOR.PRIMARY1,
    borderWidth: 1,
    borderRadius: RFValue(8),
    backgroundColor: COLOR.PRIMARY1,
    paddingLeft: RFValue(10),
    width: "90%",
    marginTop: RFValue(20),
    color: "dark" ? COLOR.WHITE : COLOR.WHITE,
    textAlign: "left",
    alignSelf: "center",
    padding: RFValue(5),
  },
  expandVoiceTextStyle: {
    height: RFValue(80),
    borderColor: COLOR.WHITE,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: COLOR.WHITE,
    paddingLeft: 10,
    width: "85%",
    margin: 10,
    marginTop: RFValue(20),
    color: "dark" ? COLOR.BLACK : COLOR.BLACK,
  },
  youtubeView: {
    alignSelf: "stretch",
    height: 300,
    borderRadius: 10,
    marginTop: RFValue(15),
  },
  roundedBtnView: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: COLOR.LIGHT_GRAY,
    shadowColor: COLOR.SHADOW,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    padding: RFValue(10),
    elevation: 5,
    borderRadius: RFValue(8),
    marginBottom: RFValue(8),
    alignItems: "center",
  },
});
export default WeekInfoList = React.memo(WeekInfoList);
