/* eslint-disable prettier/prettier */
/* eslint-disable module-resolver/use-alias */
// @ts-nocheck
import * as AppActions from '@actions';
import GLOBALS from '@constants';
import React, { Component, lazy } from 'react';
import {
  Alert,
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  Image,
  Modal,
  Linking,
  AppState,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { navigatorPop } from '@config/navigationOptions';
const Header = lazy(() => import('@components/common/Header'));
import ImagePicker from 'react-native-image-crop-picker';
import DocumentPicker from 'react-native-document-picker';
const ChatComponent = lazy(() => import('@components/dashboard/chat'));
import ImageViewer from 'react-native-image-zoom-viewer';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import moment from 'moment';
import {
  Bubble,
  Composer,
  Day,
  GiftedChat,
  InputToolbar,
  LoadEarlier,
  Send,
  Time,
  MessageImage,
  Message,
  MessageText,
} from 'react-native-gifted-chat';
import ModalView from 'react-native-modal';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import { Icon } from 'react-native-elements';
import SocketIO from '../../../utils/SocketIO';
import RestClient from '@helpers/RestClient';
import {
  convertToGiftedJSON,
  convertToGiftedObject,
} from '../../../utils/ChatUtils';
import { Colors } from 'react-native/Libraries/NewAppScreen';
const { ACTION_TYPE, URL, STRINGS, COLOR, FONTS } = GLOBALS;
import { strings } from '@localization';
const newDate = new Date();
// var CryptoJS = require("crypto-js");
import CryptoJS from 'react-native-crypto-js';
import { RFValue } from 'react-native-responsive-fontsize';
import { ActivityIndicator } from 'react-native';
import { decode as atob, encode as btoa } from 'base-64';
import * as Images from '../../../assets/images';
const { DARK_GREEN, WHITE, BACKGROUND } = COLOR;
class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      roomId: '',
      isModelVisible: 0,
      showImageViewer: false,
      isLoading: true,
      appState: AppState.currentState,
    };
    this.socket = SocketIO.initialize();
    this.yourRef = React.createRef();
    this._startTime();
  }

  _startTime() {
    this.props.AppActions.getScreenStartTime(moment().format());
  }

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);

    let { loginData } = this.props;
    let decryptKey;
    if (
      loginData.decryptChatKey !== undefined &&
      loginData.decryptChatKey !== null
    ) {
      decryptKey = loginData.decryptChatKey;
    } else {
      // decryptKey = STRINGS.DECRYPT_KEY;
    }

    let connectMessage = {
      user1_name: this.props.loginUserName,
      user1_id: this.props.loginUserId,
      user2_id: this.props.senderId,
      user2_name: this.props.senderName,
    };
    this.socket.emit('join', connectMessage);
    this.socket.on('room Id', roomId => {
      this.setState({ roomId: roomId });

      this.setState({ isLoading: false });
    });

    this.socket.on('chat History', chatHistory => {
      try {
        if (chatHistory !== null) {
          let ciphertext = chatHistory.message;
          let chatArray = [];
          ciphertext.forEach(element => {
            //let bytes = JSON.parse(atob(element.data));
            let bytes = JSON.parse(
              decodeURIComponent(escape(atob(element.data))),
            );

            chatArray.push(bytes);
          });

          this.setState({ messages: chatArray, isLoading: false });
        } else {
          this.setState({ isLoading: false });
        }
      } catch (err) {
        this.setState({ isLoading: false });
      }
    });
    this.onReceive();
  }

  componentWillUnmount() {
    let { loginData } = this.props;
    let postData = {
      user_id: loginData['user']['_id'],
    };
    this.props.AppActions.getChatList(postData);
    // AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = nextAppState => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      this._startTime();
    } else {
      let { loginData, activeScreenStartTime } = this.props;
      let postData = {
        user_id: loginData['user']['_id'],
        group: 'Interventions',
        screen: 'chat',
        startTime: activeScreenStartTime,
        endTime: moment().format(),
        date: moment().format(),
      };
      if (Platform.OS == 'android') {
        this.props.AppActions.addTimeTraker(postData);
      } else if (
        Platform.OS == 'ios' &&
        this.state.appState.match(/inactive|background/) !== null
      ) {
        this.props.AppActions.addTimeTraker(postData);
      }
    }
    this.setState({ appState: nextAppState });
  };

  onReceive() {
    let { loginData } = this.props;
    let decryptKey;
    if (
      loginData.decryptChatKey !== undefined &&
      loginData.decryptChatKey !== null
    ) {
      decryptKey = loginData.decryptChatKey;
    } else {
      // decryptKey = STRINGS.DECRYPT_KEY;
    }
    this.socket.on('new message', newMessage => {
      let decryptMessage = JSON.parse(
        decodeURIComponent(escape(atob(newMessage))),
      );

      var joined = this.state.messages.concat(decryptMessage);
      this.setState({ messages: joined });
    });
  }

  appendMessages(messages, image, imageName, imageType) {
    let { loginData } = this.props;
    let decryptKey;
    if (
      loginData.decryptChatKey !== undefined &&
      loginData.decryptChatKey !== null
    ) {
      decryptKey = loginData.decryptChatKey;
    } else {
      // decryptKey = STRINGS.DECRYPT_KEY;
    }

    let date;
    if (messages[0].createdAt !== '' && messages[0].createdAt != undefined) {
      date = messages[0].createdAt;
    } else {
      date = new Date();
    }

    let chatMessage = {
      _id: this.props.loginUserId,
      text: messages[0].text,
      roomId: this.state.roomId,
      user: {
        _id: 1,
        name: this.props.senderName,
      },
      createdAt: date,
      type: 'mobile',
      image: image,
      imageType: imageType,
      imageName: imageName,
    };

    //bto Encode
    //atob Decode
    let sendMessage = {
      // data: CryptoJS.AES.encrypt(JSON.stringify(chatMessage), decryptKey).toString(),CryptoJS
      // data: btoa(JSON.stringify(chatMessage)),
      data: btoa(unescape(encodeURIComponent(JSON.stringify(chatMessage)))),
      roomId: this.state.roomId,
    };


    this.socket.emit('message', sendMessage);
  }

  renderInputToolbar = props => {
    return (
      <InputToolbar
        {...props}
        ///containerStyle={Styles.inputContainer}
        primaryStyle={Styles.inputPrimary}
        containerStyle={{ borderTopWidth: 0, backgroundColor: BACKGROUND }}
      />
    );
  };

  renderDay = props => {
    return <Day {...props} textStyle={{ color: 'grey', fontSize: 13 }} />;
  };
  renderComposer = props => {
    return (
      <Composer
        {...props}
        textInputStyle={Styles.composerText}
        placeholderTextColor={'grey'}
      />
    );
  };
  renderTime = props => {
    return (
      <Time
        {...props}
        timeTextStyle={{
          left: Styles.timeTextLeft,
          right: Styles.timeTextRight,
        }}
      />
    );
  };

  renderMessageText = props => (
    <MessageText
      {...props}
      textStyle={{
        left: {
          color: '#000',
          fontWeight: 'bold',
          fontSize: RFValue(12),
          fontFamily: FONTS.REGULAR,
        },
        right: {
          color: '#fff',
          fontWeight: 'bold',
          fontSize: RFValue(12),
          fontFamily: FONTS.REGULAR,
        },
      }}
      containerStyle={{
        left: {
          backgroundColor: WHITE,
          borderRadius: RFValue(25),
          paddingHorizontal: RFValue(15),
          paddingVertical: RFValue(7),
          shadowColor: DARK_GREEN,
          shadowOffset: {
            width: 0,
            height: 8,
          },

          shadowOpacity: 0.46,
          shadowRadius: 10.14,
          elevation: 14,
          borderWidth: 0.5,
          borderColor: DARK_GREEN,
        },

        right: {
          backgroundColor: DARK_GREEN,
          borderRadius: RFValue(25),
          paddingHorizontal: RFValue(15),
          paddingVertical: RFValue(7),
          shadowColor: DARK_GREEN,
          shadowOffset: {
            width: 0,
            height: 8,
          },
          shadowOpacity: 0.46,
          shadowRadius: 10.14,
          elevation: 14,
        },
      }}
    />
  );
  renderBubble = props => (
    <View>
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: BACKGROUND,
            paddingBottom: 5,
          },
          right: {
            backgroundColor: BACKGROUND,
            paddingBottom: 5,
          },
        }}
      />
    </View>
  );

  onImageClick() {
    alert('click');
  }

  openImageViewer(images) {
    // let image = GLOBALS.IMAGE_BASE_URL + images
    let image = [
      {
        url: GLOBALS.IMAGE_BASE_URL + images,
      },
    ];
    this.setState({
      imageUrls: image,
      showImageViewer: true,
    });
  }

  async _showDocument(url) {
    let openUrl = GLOBALS.IMAGE_BASE_URL + url;

    await Linking.openURL(openUrl);
  }

  renderMessageImage(props) {
    if (props.currentMessage.imageType === 1) {
      return (
        <TouchableOpacity
          onPress={() => {
            this.openImageViewer(props.currentMessage.image);
          }}>
          <Image
            source={{
              uri: GLOBALS.IMAGE_BASE_URL + props.currentMessage.image,
            }}
            style={Styles.image}
          />
        </TouchableOpacity>
      );
    } else {
      if (props.currentMessage.user._id === 1) {
        return (
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              padding: 10,
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
            onPress={() => this._showDocument(props.currentMessage.image)}>
            {props.currentMessage.imageType == 2 ? (
              <AntDesign name="pdffile1" size={30} color={COLOR.WHITE} />
            ) : (
              <FontAwesome name="file" size={30} color={COLOR.WHITE} />
            )}
            <Text
              style={{
                alignSelf: 'center',
                textAlign: 'left',
                alignContent: 'center',
                color: '#FFF',
              }}>
              {props.currentMessage.imageName}
            </Text>
          </TouchableOpacity>
        );
      } else {
        return (
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              padding: 10,
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
            onPress={() => this._showDocument(props.currentMessage.image)}>
            {props.currentMessage.imageType == 2 ? (
              <AntDesign name="pdffile1" size={30} color={COLOR.CINNABAR} />
            ) : (
              <FontAwesome name="file" size={30} color={COLOR.GREY} />
            )}
            <Text
              style={{
                alignSelf: 'center',
                textAlign: 'left',
                alignContent: 'center',
              }}>
              {props.currentMessage.imageName}
            </Text>
          </TouchableOpacity>
        );
      }
    }
  }

  renderSend = props => {
    return (
      <Send
        {...props}
        containerStyle={Styles.sendContainer}
        children={<FontAwesome name="send" size={15} color={COLOR.WHITE} />}
      />
    );
  };

  renderLoadEarlier = props => {
    return <LoadEarlier {...props} textStyle={Styles.loadEarlierText} />;
  };

  renderCustomActions(props) {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
        }}>
        <TouchableOpacity>
          <View style={{ margin: 5, paddingLeft: 8 }}>
            <Ionicons
              name="ios-attach"
              size={30}
              color={COLOR.GREY}
              // style={Styles.attachmentStyle}
              onPress={() => this.setState({ isModelVisible: 1 })}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  renderAttachmentModal() {
    return (
      <View style={Styles.content}>
        <View style={Styles.attRowStyle}>
          <TouchableOpacity
            onPress={() => this.openDocument()}
            style={{ alignItems: 'center' }}>
            <Ionicons
              name="ios-document"
              size={56}
              color={'#416CA2'}
              style={{ paddingRight: 10 }}
            />
            <Text>{strings?.chat?.Document}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              if (Platform.OS === 'android') {
                if (this.requestCameraPermission()) {
                  this.openGallery();
                } else {
                  this.requestCameraPermission();
                }
              } else {
                this.openGallery();
              }
            }}
            style={{ alignItems: 'center' }}>
            <Ionicons
              name="ios-image"
              size={56}
              color={'#e040fb'}
              style={{ paddingRight: 10 }}
            />
            <Text>{strings?.chat?.Gallery}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  requestCameraPermission() {
    const granted = PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    } else {
    }
    return granted;
  }

  openGallery() {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      mediaType: 'photo',
      compressImageQuality: 0.8,
      cropping: true,
    }).then(res => {
      this._uploadImage(res, 'image');
      this.setState({ isModelVisible: 0 });
    });
  }

  async openDocument() {
    // Pick a single file
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });

      this._uploadImage(res, 'document');
      this.setState({ isModelVisible: 0 });
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        this.setState({ isModelVisible: 0 });
        Alert.alert('Canceled');
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        Alert.alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  }

  async _uploadDocument(res) {
    // res.uri,
    // res.type, // mime type
    // res.name,
    // res.size
  }
  async _uploadImage(res, type) {
    const data = new FormData();

    let userObj = {
      _id: 2,
      name: 'Clint',
    };
    let imageType;
    if (type === 'image') {
      let file = {
        uri: res.path,
        type: res.mime, // or photo.type
        name: res.path.replace(/^.*[\\\/]/, ''),
      };
      data.append('file', file);
      imageType = 1;
    } else {
      let file = {
        uri: res.uri,
        type: res.type, // or photo.type
        name: res.name,
      };
      data.append('file', file);
      imageType = 2;
    }

    data.append('_id', this.props.loginUserId);
    data.append('roomId', this.state.roomId);
    data.append('user', JSON.stringify(userObj));

    try {
      let json = await RestClient.postCall(URL.UPLOAD_IMAGE, data);
      let imagePath = json.data.url;
      let imageName = json.data.imageName;
      let messages = [{ text: '' }];
      this.appendMessages(messages, imagePath, imageName, imageType);
    } catch (error) { }
  }

  _goBack() {
    const { componentId, loginData, activeScreenStartTime } = this.props;

    if (this.props.screenType == 'chatList') {
      this.props.AppActions.refreshChatlist(true);
    }
    let postData = {
      user_id: loginData['user']['_id'],
      group: 'Interventions',
      screen: 'chat',
      startTime: activeScreenStartTime,
      endTime: moment().format(),
      date: moment().format(),
    };
    this.props.AppActions.addTimeTraker(postData);
    navigatorPop({ componentId });
  }

  render() {
    const { componentId } = this.props;
    const { messages, isModelVisible, isLoading } = this.state;
    return (
      <View style={Styles.homeContainer}>
        <Header
          isLeftIcon={true}
          isTitle={true}
          onLeftIconClick={() => {
            this._goBack();
          }}
          title={this.props.senderName}
          isLogout={false}
          titleStyle={{
            paddingTop: RFValue(10),
          }}
        />
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <View style={{ flex: 0.9 }}>
            <GiftedChat
              ref={this.yourRef}
              messages={messages}
              onSend={messages => this.appendMessages(messages, '', '', '')}
              listViewProps={{
                initialNumToRender: 20,
              }}
              renderAvatar={null}
              isAnimated={false}
              keyboardShouldPersistTaps={'never'}
              placeholder={strings.WRITE_MSG}
              renderDay={this.renderDay}
              renderBubble={this.renderBubble}
              renderMessageText={this.renderMessageText}
              renderMessageImage={this.renderMessageImage.bind(this)}
              textInputProps={{
                autoCapitalize: 'none',
                keyboardAppearance: 'dark',
                autoCorrect: false,
                keyboardType: 'default',
              }}
              renderInputToolbar={this.renderInputToolbar}
              renderComposer={this.renderComposer}
              renderTime={this.renderTime}
              renderSend={this.renderSend}
              renderLoadEarlier={this.renderLoadEarlier}
              onPressAvatar={console.log()}
              bottomOffset={26}
              // isCustomViewBottom={true}
              alignTop={true}
              alwaysShowSend
              scrollToBottom={true}
              user={{
                _id: 1,
                name: 'Priyanka',
              }}
              // renderActions={() => {
              //   return (
              //     <View style={{ margin: 5, paddingLeft: 8 }}>
              //       <Ionicons
              //         name="ios-attach"
              //         size={30}
              //         color={COLOR.GREY}
              //         onPress={() => this.setState({ isModelVisible: 1 })}
              //       />
              //     </View>
              //   );
              // }}
              inverted={false}
            />
          </View>
        )}
        {isLoading ? null : (
          <View style={Styles.noteWrapper}>
            <Text
              style={{
                fontSize: RFValue(12),
                color: 'red',
                fontFamily: FONTS.REGULAR,
              }}>
              {strings?.chat?.Note}
            </Text>
          </View>
        )}

        <ModalView
          isVisible={isModelVisible === 1}
          onSwipeComplete={() => this.setState({ isModelVisible: 0 })}
          swipeDirection={['up', 'left', 'right', 'down']}
          style={Styles.bottomModal}
          onBackdropPress={() => this.setState({ isModelVisible: 0 })}>
          {this.renderAttachmentModal()}
        </ModalView>

        <Modal visible={this.state.showImageViewer} transparent={true}>
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              onPress={() => this.setState({ showImageViewer: false })}
              style={{
                marginTop: 10,
                padding: 20,
                position: 'absolute',
                zIndex: 2,
                right: Dimensions.get('window').width / 8,
              }}>
              <Text style={{ color: '#FFF' }}>{strings?.chat?.Close}</Text>
            </TouchableOpacity>
            <ImageViewer imageUrls={this.state.imageUrls} />
          </View>
        </Modal>
      </View>
    );
  }
}

const mapStateToProps = ({ authReducer, dashboardReducer }) => ({
  loginData: authReducer.loginData,
  activeScreenStartTime: dashboardReducer.getScreenStartTime,
});
const mapDispatchToProps = dispatch => ({
  AppActions: bindActionCreators(AppActions, dispatch),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Chat);

const Styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    backgroundColor: COLOR.BACKGROUND,
  },
  attachmentStyle: {
    right: Dimensions.get('window').width / 6,
    position: 'absolute',
    zIndex: 2,
  },
  bottomModal: { justifyContent: 'flex-end', marginBottom: 40 },
  content: {
    flex: 0.3,
    backgroundColor: '#FFFF',
    borderRadius: 4,
    justifyContent: 'center',
  },
  attRowStyle: {
    margin: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  sendContainer: {
    width: 35,
    height: 35,
    borderRadius: 17,
    backgroundColor: DARK_GREEN,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: RFValue(10),
    marginBottom: RFValue(4),
  },
  inputContainer: {
    //minHeight: Dimensions.get("window").height / 9.5,
    //borderTopWidth: 2,
    ///borderColor: "#616161",
    // alignItems: "center",
    // borderWidth: 1,
    // borderColor: DARK_GREEN,
    // width: "95%",
    // marginLeft: "auto",
    // marginRight: "auto",
    // borderWidth: 1,
    backgroundColor: BACKGROUND,
    // borderColor: BACKGROUND,
    // marginTop: RFValue(10),
  },
  inputPrimary: {
    backgroundColor: WHITE,
    marginHorizontal: 16,
    padding: RFValue(3),
    borderWidth: 0.5,
    borderColor: DARK_GREEN,
    borderRadius: RFValue(5),
    shadowColor: DARK_GREEN,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.46,
    shadowRadius: 10.14,
    elevation: 14,
  },
  composerText: {
    color: 'black',
    fontSize: 14,
  },
  timeTextLeft: {
    color: 'gray',
    fontSize: 10,
  },
  timeTextRight: {
    color: 'gray',
    fontSize: 10,
  },
  loadEarlierText: {
    color: 'white',
    fontSize: 12,
  },
  bubbleRightText: {
    color: 'black',
    fontSize: 14,
    alignItems: 'center',
    marginTop: 5,
  },
  image: {
    width: 150,
    height: 100,
    borderRadius: 13,
    margin: 3,
    resizeMode: 'cover',
  },
  noteWrapper: {
    flex: 0.1,
    alignItems: 'center',
    justifyContent: 'center',

    paddingHorizontal: RFValue(12),
  },
});
