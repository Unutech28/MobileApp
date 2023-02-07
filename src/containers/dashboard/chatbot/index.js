import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import * as AppActions from "@actions";
import * as Images from "@images";
import globalStyles from "./styles";
import { Header } from "./components/Header";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { navigatorPop, navigatorPush } from "@config/navigationOptions";
import { GiftedChat, InputToolbar } from "react-native-gifted-chat";
import QuickReplies from "react-native-gifted-chat/lib/QuickReplies";
import ShowArticalSongs from "./components/ShowArticalSongs";
import {
  RenderMessageText,
  RenderBubble,
  RenderComposer,
  RenderSend,
  ListView,
  RenderQuickReply,
} from "./components";
import Ionicons from "react-native-vector-icons/Ionicons";
import moment from "moment";
import GLOBALS from "@constants";
const { PRODUCT_TYPE } = GLOBALS;
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { strings } from "@localization";
//import { PRODUCT_TYPE } from 'react-native-dotenv';

const { ACTION_TYPE, URL, STRINGS, COLOR, FONTS } = GLOBALS;
const { DARK_GREEN, WHITE, BACKGROUND } = COLOR;
class Chatbot extends Component {
  constructor(props) {
    super(props);
    this.giftedChatRef = React.createRef();
    // this.giftedChatRef = React.useRef();
    this.state = {
      showLoadingBot: true,
      messages: [
        // {
        //   _id: 0,
        //   text: 'Welcome to Fertilift! What do you want to ask Stella today',
        //   createdAt: moment().format(),
        //   user: {
        //     avatar: Images.bot_avatar,
        //   },
        //   quickReplies: {
        //     keepIt: true,
        //     type: 'radio',
        //     values: [
        //       {
        //         title: 'Intro to Fertilift',
        //         icon: 'family-restroom',
        //         color: COLOR.DARK_GREEN,
        //         week: 1,
        //         day: 1,
        //       },
        //       {
        //         title: 'Taking care of Yourself',
        //         icon: 'pregnant-woman',
        //         color: COLOR.YELLOW,
        //         week: 1,
        //         day: 2,
        //       },
        //       {
        //         title: 'Difficult Emotions',
        //         icon: 'mood-bad',
        //         color: COLOR.ORANGE,
        //         week: 1,
        //         day: 3,
        //       },
        //       {
        //         title: 'Starting IVF Journey',
        //         icon: 'track-changes',
        //         color: COLOR.sea_Green_dark,
        //         week: 1,
        //         day: 4,
        //       },
        //       {
        //         title: 'IVF Treatments',
        //         icon: 'medical-services',
        //         color: COLOR.DARK_RED,
        //         week: 1,
        //         day: 5,
        //       },
        //     ],
        //   },
        //   suggestion_type: '',
        //   suggestions: [],
        //   type: '',
        // },
      ],
      showBottom: false,
      ShowArticalSongs: false,
      showListData: false,
      data: [],
      listData: {
        title: "Article",
        type: "article",
      },
    };
  }
  /**Check to show bottom option */
  checkShowBottomOption = () => {
    // let {bot_welcome_data, bot_status} = this.props.botData;
    // if (bot_welcome_data.options && bot_welcome_data.options.length > 0) {
    //   this.setState({
    //     buttonsData: bot_welcome_data.options,
    //     showBottom: true,
    //   });
    // }
  };
  /**Set Bot response in array */
  addBotMessage = () => {
    console.log("add message...");
    let { bot_welcome_data, bot_status } = this.props.botData;
    console.log(bot_welcome_data, "bot_welcome_data.....");
    let chatArray = this.state.messages;
    if (Object.keys(bot_welcome_data).length != 0) {
      console.log(bot_welcome_data, "bot_welcome_data.....");
      chatArray.push({
        _id: this.state.messages.length + 1,
        queId: bot_welcome_data.queId,
        text: bot_welcome_data.question,
        createdAt: moment().format(),
        user: {
          avatar: Images.bot_avatar,
        },
        quickReplies: {
          type: "radio", // or 'checkbox',
          keepIt: true,
          values: bot_welcome_data.options,
        },
        suggestion_type: bot_welcome_data.suggestion_type
          ? bot_welcome_data.suggestion_type
          : "",
        suggestions: bot_welcome_data.suggestions
          ? bot_welcome_data.suggestions
          : [],
        type: bot_welcome_data.type ? bot_welcome_data.type : "",
      });
    }

    this.setState({ messages: chatArray });
    if (this.giftedChatRef && this.giftedChatRef._messageContainerRef) {
      setTimeout(() => {
        this.giftedChatRef?._messageContainerRef.current?._listRef?._scrollRef?.scrollToEnd();
      }, 1000);
    }
  };

  /**Set Bot */
  componentDidMount() {
    //  if (PRODUCT_TYPE != 'FERTI') {
    this.addBotMessage();
    //}
    setTimeout(() => {
      this.setState({ showLoadingBot: false });
    }, 1000);
  }

  componentWillReceiveProps(nextProps) {}

  /**Show Static Loading UI */
  showStellaLoadingUI = () => {
    return (
      <View style={globalStyles.botLoadingContainer}>
        <Image source={Images.botLoading} />
        <Text style={globalStyles.botLoadingTitle}>Stella is Loading</Text>
        <View />
      </View>
    );
  };

  /**Add user selected message in state variable aaray */
  addUserMessage = (msgObj) => {
    let chatArray = this.state.messages;
    chatArray.push(msgObj);
    this.setState({ messages: chatArray });
    let msg_data = {
      ansId: msgObj.ansId,
      ans: msgObj.ans,
      question: msgObj.question,
      queId: msgObj.queId,
    };

    this.props.AppActions.manageChatbot(
      msg_data,
      undefined,
      undefined,
      this.props.componentId
    ).then(() => {
      console.log("hit....");

      this.addBotMessage();
      // navigatorPush({
      //   componentId,
      //   screenName: "Chatbot",
      // });
    });
    return;
    if (PRODUCT_TYPE == "FERTI") {
      let chatArray = this.state.messages;
      chatArray.push(msgObj);
      this.setState({ messages: chatArray });
      let { componentId } = this.props;
      let postData = {
        week: msgObj.week,
        day: msgObj.day,
        user_id: this.props.loginData["user"]["_id"],
        language: this.props.user_language,
      };
      this.props.AppActions.getCardsforDay(postData, 0, (res) => {
        navigatorPush({
          componentId,
          screenName: "WeekInfoList",
          passProps: {
            week: msgObj.week,
            day: msgObj.day,
            screenType: "careConcerns",
            screen_title: msgObj.text,
            onGoBack: () => {
              // this._getPlaylist();
            },
          },
        });
      });
    }

    // return;
    // let chatArray = this.state.messages;
    // chatArray.push(msgObj);
    // this.setState({ messages: chatArray });
    // let params = {
    //   answer: msgObj.text,
    //   tracker: this.props.botData?.bot_status?.tracker,
    //   user_id: this.props.loginData['user']['_id'],
    // };
    // this.props.AppActions.openChatBot({
    //   componentId: this.props.componentId,
    //   param: params,
    // }).then(() => {
    //   this.addBotMessage();
    // });
  };

  appendMessages(messages, type, imageName, imageType) {
    let chatArray = this.state.messages;
    let chatObj = {
      // _id: Math.random(),
      _id: this.state.messages.length + 1,
      text: messages[0].text,
      createdAt: moment().format(),
      user: { _id: 1 },
    };
    chatArray.push(chatObj);
    // GiftedChat.append(previousArr, this,state.)
    this.setState({ messages: chatArray });

    // if (type == 'clear') {
    //   this.setState({
    //     showBottom: false,
    //     ShowArticalSongs: false,
    //     showListData: false,
    //   });
    // }
    let params = {
      answer: messages[0].text,
      tracker: this.props.botData?.bot_status?.tracker,
      user_id: this.props.loginData["user"]["_id"],
    };
    this.props.AppActions.openChatBot({
      componentId: this.props.componentId,
      param: params,
    }).then(() => {
      this.addBotMessage();
    });
    //  this.giftedChatRef._messageContainerRef.current?._listRef?._scrollRef?.scrollToEnd();
    // setTimeout(() => {
    //   // this.giftedChatRef.current.props.scrollToBottom(true);
    //   this.giftedChatRef._messageContainerRef.current?._listRef?._scrollRef?.scrollToEnd()
    //   // this.giftedChat.scrollToBottom();
    // }, 1000);
  }

  onIntrestSelected = (type) => {
    let msgObj = [
      {
        createdAt: moment().format(),
        text: type.title,
        user: { _id: 1 },
        //_id: Math.random(),
        _id: this.state.messages.length + 1,
      },
    ];
    this.appendMessages(msgObj);
    switch (type.id) {
      case 1:
        let msgObj = [
          {
            createdAt: moment().format(),
            text: "Here are the some articles which make you feel good",
            user: { _id: 2, avatar: Images.bot_avatar },
          },
        ];
        this.appendMessages(msgObj);
        this.setState({
          showListData: true,
          listData: {
            title: "Article",
            type: "article",
          },
        });
        break;
      case 2:
        msgObj = [
          {
            createdAt: moment().format(),
            text: "Here are your some favorite music which make you feel good",
            user: { _id: 2, avatar: Images.bot_avatar },
          },
        ];
        this.appendMessages(msgObj);
        this.setState({
          showListData: true,
          listData: {
            title: "Favorite Music Playlist",
            type: "music",
          },
        });
        break;

      default:
        break;
    }
  };

  onBackPress = () => {
    this.setState({ ShowArticalSongs: false });
  };

  redirectTo = (type) => {
    let { componentId } = this.props;
    switch (type) {
      case "Fill Assessments":
        navigatorPush({
          componentId,
          screenName: "Assessments",
          passProps: {},
        });
        break;
      case "Add Journals":
        navigatorPush({ componentId, screenName: "Journal", passProps: {} });
        break;
      case "Reset Password":
        navigatorPush({
          componentId,
          screenName: "SelectModal",
          passProps: { isPage: true },
        });
        break;
      default:
        break;
    }
  };

  render() {
    const { componentId } = this.props;
    const { messages } = this.state;
    return (
      <View style={{ flex: 1 }}>
        {this.state.showLoadingBot && this.showStellaLoadingUI()}
        {!this.state.showLoadingBot && (
          <View style={{ flex: 1 }}>
            <View>
              <Header
                onLeftIconClick={() => {
                  navigatorPop({ componentId });
                }}
                topTitle={strings?.chatBot?.toptitle}
                title={strings?.chatBot?.title}
                isMiddleIcon={true}
                isLeftIcon={true}
                isTitle={true}
              />
            </View>
            <View style={{ flex: 1 }}>
              <GiftedChat
                scrollToBottom={true}
                ref={(ref) => {
                  this.giftedChatRef = ref;
                  // ref?._messageContainerRef.current?._listRef?._scrollRef?.scrollToEnd()
                }}
                user={{
                  _id: 1,
                }}
                messages={messages}
                listViewProps={{
                  initialNumToRender: 20,
                }}
                quickReplyStyle={[
                  globalStyles.touchableStyle,
                  globalStyles.boxShadow,
                ]}
                isAnimated={false}
                keyboardShouldPersistTaps={"never"}
                placeholder={strings?.chatBot?.talk}
                inverted={false}
                renderBubble={this.renderBubble}
                renderMessageText={this.renderMessageText}
                renderComposer={this.renderComposer}
                // renderInputToolbar={this.renderInputToolbar}
                renderQuickReplies={this.renderQuickReply}
                renderSend={this.renderSend}
                textInputProps={{
                  autoCapitalize: "none",
                  keyboardAppearance: "dark",
                  autoCorrect: false,
                  selectionColor: COLOR.BLACK,
                }}
                renderAvatarOnTop={true}
                minComposerHeight={0}
                maxComposerHeight={0}
                minInputToolbarHeight={0}
                renderInputToolbar={() => null}
                onSend={(messages) => {
                  this.appendMessages(messages, "clear", "", "");
                }}
              />
              {/* {this.state.showBottom ? this.showBottomOptions() : null}
              {this.state.showListData && (
                <ListView
                  title={this.state.listData?.title}
                  type={this.state.listData?.type}
                  onPres={() => this.setState({ShowArticalSongs: true})}
                  data={info => this.setState({data: info})}
                />
              )} */}
            </View>
          </View>
        )}

        <Modal
          visible={this.state.ShowArticalSongs}
          animationType={"slide"}
          onRequestClose={() => this.setState({ ShowArticalSongs: false })}
        >
          <ShowArticalSongs
            onBackPress={this.onBackPress}
            item={this.state.data}
            // type={this.state.listData?.type}
          />
        </Modal>
      </View>
    );
  }

  renderMessageText = (props) => <RenderMessageText {...props} />;

  /**Chat message container custom UI */
  renderBubble = (props) => {
    return <RenderBubble {...props} />;
  };

  /**Custom style to be passed to the <TextInput> */
  renderComposer = (props) => {
    return <RenderComposer {...props} />;
  };

  /* Custom message composer container*/
  renderInputToolbar = (props) => {
    return <InputToolbar {...props} primaryStyle={globalStyles.inputPrimary} />;
  };

  /**Custom send button; you can pass children to the original  */
  renderSend = (props) => {
    this.giftedChatRef._messageContainerRef.current?._listRef?._scrollRef?.scrollToEnd();
    return <RenderSend {...props} />;
  };

  /**Quick Reply custom UI */
  renderQuickReply = (props) => {
    // this.giftedChatRef._messageContainerRef.current?._listRef?._scrollRef?.scrollToEnd()
    return (
      <RenderQuickReply
        {...props}
        onQuickReply={(data) => {
          this.addUserMessage(data);
        }}
        onRedirect={(data) => {
          this.redirectTo(data.title);
        }}
        onItemSelect={(data) => {
          this.setState({
            data: data,
            type: data.type,
            ShowArticalSongs: true,
          });
        }}
      />
    );
  };
}

const mapStateToProps = ({
  authReducer,
  dashboardReducer,
  playlistReducer,
  cardsReducer,
  botReducer,
}) => ({
  getWeekDayData: dashboardReducer.getDailyCBTData,
  isLoggedIn: authReducer.isLoggedIn,
  loginData: authReducer.loginData,
  allDaysCards: cardsReducer,
  botData: botReducer,
  user_language: authReducer.language,
});
const mapDispatchToProps = (dispatch) => ({
  AppActions: bindActionCreators(AppActions, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(Chatbot);

const styles = StyleSheet.create({});
