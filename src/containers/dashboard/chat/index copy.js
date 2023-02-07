/* eslint-disable prettier/prettier */
/* eslint-disable module-resolver/use-alias */
// @ts-nocheck
import * as AppActions from '@actions';
import GLOBALS from '@constants';
import React, { Component, lazy } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { navigatorPop } from '@config/navigationOptions';
const Header = lazy(() => import('@components/common/Header'));
const ChatComponent = lazy(() => import('@components/dashboard/chat'));
import { GiftedChat } from 'react-native-gifted-chat';
import SocketIO from '../../../utils/SocketIO';
const { COLOR } = GLOBALS;
const newDate = new Date();

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      roomId: '',
      isModelVisible: 0,
    };
    this.socket = SocketIO.initialize();
  }
  componentDidMount() {
    // this.socket = io('https://careportal.curio-dtx.com/');
    let connectMessage = {
      user1_name: 'Jhon',
      user1_id: this.props.loginUserId,
      user2_id: this.props.senderId,
      user2_name: this.props.senderName,
    };
    this.socket.emit('join', connectMessage);

    this.socket.on('chat History', chatHistory => {
      if (chatHistory !== null) {
        let message = chatHistory.message;
        this.setState({ messages: message });
      }
    });

    this.socket.on('room Id', roomId => {
      this.setState({ roomId: roomId });
    });

    this.socket.on('new message', newMessage => {
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, newMessage),
      }));
    });
  }

  appendMessages = messages => {
    let chatMessage = {
      _id: this.props.loginUserId,
      text: messages[0].text,
      roomId: this.state.roomId,
      user: {
        _id: 1,
        name: this.props.senderName,
      },
    };
    this.socket.emit('message', chatMessage);
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, chatMessage),
    }));


  };
  render() {
    const { componentId } = this.props;
    const { messages, isModelVisible } = this.state;
    return (
      <View style={Styles.homeContainer}>
        <Header
          isLeftIcon={true}
          isTitle={true}
          onLeftIconClick={() => {
            navigatorPop({ componentId });
          }}
          title={this.props.senderName}
        />
        <ChatComponent
          messages={messages}
          appendMessages={this.appendMessages}
          modalClick={() => {
            this.setState({ isModelVisible: 1 })
          }}
          closeModalClick={() => {
            this.setState({ isModelVisible: 0 })
          }}
          isModelVisible={isModelVisible}
        />
      </View>
    );
  }
}

const mapStateToProps = ({ authReducer }) => ({ loginData: authReducer.loginData });
const mapDispatchToProps = dispatch => ({
  AppActions: bindActionCreators(AppActions, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(Chat);
const Styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    backgroundColor: COLOR.BACKGROUND,
  },
});
