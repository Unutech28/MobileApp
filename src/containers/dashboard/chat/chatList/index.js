/* eslint-disable module-resolver/use-alias */
/* eslint-disable prettier/prettier */
import * as AppActions from "@actions";
import GLOBALS from "@constants";
const { ACTION_TYPE, URL, STRINGS } = GLOBALS;
import React, { Component, lazy } from "react";
import { StyleSheet, View, Text } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { navigatorPop, navigatorPush } from "@config/navigationOptions";
import { RFValue } from "react-native-responsive-fontsize";
const { COLOR } = GLOBALS;
import { strings } from '@localization';
const Header = lazy(() => import("@components/common/Header"));
const ChatListComponent = lazy(() =>
  import("../../../../components/dashboard/chat/chatList")
);

class ChatList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.isChatlistUpdate != prevProps.isChatlistUpdate) {
      let { loginData } = this.props;
      let postData = {
        user_id: loginData["user"]["_id"],
      };
      this.props.AppActions.getChatList(postData);
      this.props.AppActions.refreshChatlist(false);
    }
  }

  componentDidMount() {
    // let { loginData } = this.props;
    // let postData = {
    //   user_id: loginData["user"]["_id"],
    // };
    // this.props.AppActions.getChatList(postData);
  }

  goToChat = (item) => {
    // goToChat(item) {
    let { componentId, loginData } = this.props;
    navigatorPush({
      componentId,
      screenName: "Chat",
      passProps: {
        loginUserId: loginData["user"]["_id"],
        loginUserName: loginData.user.firstName,
        senderId: item.toUserId,
        senderName: item.toUserName,
        screenType: "chatList",
      },
    });
  };

  render() {
    let { chatListData, loginData, componentId } = this.props;
    let decryptKey;
    if (
      loginData.decryptChatKey !== undefined &&
      loginData.decryptChatKey !== null
    ) {
      decryptKey = loginData.decryptChatKey;
    } else {
      // decryptKey = STRINGS.DECRYPT_KEY;
    }
    return (
      <View style={Styles.homeContainer}>
        <Header
          isLeftIcon={false}
          isRightIcon={false}
          onLeftIconClick={() => {
            navigatorPop({ componentId });
          }}
          isTitle={true}
          title={strings.tab.chat}
          isLogout={false}
          titleStyle={{
            paddingTop: RFValue(10),
          }}
        />
        <ChatListComponent
          data={chatListData}
          goToChat={this.goToChat}
          decryptChatKey={decryptKey}
        />
      </View>
    );
  }
}

const mapStateToProps = ({ authReducer, dashboardReducer }) => ({
  loginData: authReducer.loginData,
  chatListData: dashboardReducer.chatListData,
  isChatlistUpdate: dashboardReducer.isChatlistUpdate,
});
const mapDispatchToProps = (dispatch) => ({
  AppActions: bindActionCreators(AppActions, dispatch),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatList);
const Styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    backgroundColor: COLOR.BACKGROUND,
  },
});
