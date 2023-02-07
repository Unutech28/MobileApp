// @ts-nocheck
import * as AppActions from "@actions/";
import React, { Component, lazy } from "react";
import {
  StyleSheet,
  View,
  Alert,
  Modal,
  Dimensions,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { navigatorPush, navigatorPop } from "@config/navigationOptions";
import GLOBALS from "@constants";
const { STRINGS, COLOR, FONTS } = GLOBALS;
import { RFValue, RFPercentage } from "react-native-responsive-fontsize";
const Header = lazy(() => import("@components/common/Header"));
import { Avatar } from "react-native-elements";
import EditIcon from "react-native-vector-icons/Feather";
import ModalView from "react-native-modal";
import Ionicons from "react-native-vector-icons/Ionicons";
import Icon from "react-native-vector-icons/MaterialIcons";
import { openCamera, openImagePicker } from "../../../utils/functions";
import { alertWithTwoBtnCancel, alertWithOneBtn } from "@helpers/common";
import Camera from "@components/dashboard/modals/Camera";
import SelectModal from "./SelectModal";
import AppInfoModal from "./AppInfoModal";
import PrivacyModal from "./PrivacyModal";
import Notification from "./Notification";
//import { PRODUCT_TYPE } from 'react-native-dotenv';
import Styles from "./styles";
const { width } = Dimensions.get("window");
const isiOS = Platform.OS == "ios";
import moment from "moment";
import { strings } from "@localization";

import DeviceInfo from "react-native-device-info";

{
  /* Profile and setting screen  */
}

class Settings extends Component {
  SETTINGS_TABS = [
    { id: 0, title: strings.profile.Account, logo: "person" },
    { id: 1, title: strings.profile.Notification, logo: "ios-notifications" },
    { id: 3, title: strings.profile.Privacy, logo: "security" },
    // { id: 5, title: strings.profile.Language, logo: 'md-earth' },
    { id: 6, title: strings.profile.info, logo: "information-outline" },
    { id: 7, title: strings.profile.logout, logo: "log-out-outline" },
  ];
  constructor(props) {
    super(props);
    this.state = {
      isProfilePictureModelVisible: false,
      showSelection: false,
      imageUrl: "",
      showAppInfo: false,
      showPrivacy: false,
      notification: false,
      modalVisible: true,
    };
    // this._fetchHelpAPI();
  }

  _fetchHelpAPI() {
    let { loginData } = this.props;
    this.props.AppActions.getHelp(loginData["user"]["_id"]);
    this.props.AppActions.getKeywords(loginData["user"]["_id"]);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  logout = () => {
    let { loginData } = this.props;
    alertWithTwoBtnCancel(
      strings.profile.logoutText,
      "",
      strings.profile.yes,
      strings.profile.no
    ).then((res) => {
      if (!res) {
        let data = {
          group: "login_logout",
          event: "logout",
          inTime: moment().format(),
          activityDate: moment().format(),
          outTime: moment().format(),
        };
        this.props.AppActions.addTimeTraker(data);
        this.props.AppActions.logout();
      }
    });
  };

  navigator = (item) => {
    switch (item.id) {
      case 0:
        let { componentId } = this.props;
        // alert('coming soon...')
        navigatorPush({
          componentId,
          screenName: "Account",
        });
        break;
      case 1:
        alert("coming soon...");

        // this.setState({ notification: true });
        break;
      case 3:
        this.setState({ showPrivacy: true });
        break;
      case 5:
        this.setState({ showSelection: true });
        break;
      case 6:
        this.setState({ showAppInfo: true });
        break;
      case 7:
        this.logout();
        break;
      default:
        break;
    }
  };

  goToChatbot = () => {
    alert("coming soon...");
    // let { componentId } = this.props;
    // this.props.AppActions.openChatBot({
    //   componentId: this.props.componentId,
    //   param: {
    //     answer: 'start',
    //     tracker: 'manual',
    //     user_id: this.props.loginData['user']['_id'],
    //   },
    // }).then(() => {
    //   navigatorPush({
    //     componentId,
    //     screenName: 'Chatbot',
    //   });
    // });
  };

  renderItems = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.navigator(item);
        }}
        style={[Styles.touchableStyle, Styles.boxShadow]}
      >
        {item.logo == "security" ? (
          <Icon name={item.logo} size={28} color={COLOR.DARK_GREEN} />
        ) : (
          <Ionicons name={item.logo} size={28} color={COLOR.DARK_GREEN} />
        )}
        <Text style={Styles.OptionStyle}>{item.title}</Text>
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
      </TouchableOpacity>
    );
  };

  getImageUrl = (url) => {
    this.setState({ imageUrl: url.uri });
  };

  uploadProfile = (image, data) => {
    let { loginData } = this.props;
    let formdata = new FormData();
    // formdata.append('usr_img', atob(data));
    // formdata.append('firstname', "vansh");
    formdata.append("usr_img", {
      // uri: `${image}`,
      uri: Platform.OS == "ios" ? image.replace("file://", "/") : image,
      name: image.substring(image.lastIndexOf("/") + 1),
      type: "image/jpg",
    });
    console.log("form DATA==>", formdata);
    this.props.AppActions.uploadProfileImage(formdata);
    this.setState({ modalVisible: false });
  };

  togglePush = (data) => {
    let { loginData } = this.props;
    data["user_id"] = loginData["user"]["_id"];
    this.props.AppActions.tooglePush(data);
  };
  deleteProfilePic = () => {
    // alert('hello');
    let { loginData } = this.props;
    let data = { user_id: loginData["user"]["_id"] };
    this.props.AppActions.removeProfileImage(data);
    this.setState({ modalVisible: false });
  };
  render() {
    let { componentId, loginData } = this.props;
    let {} = this.state;
    return (
      <View style={[Styles.homeContainer, { backgroundColor: COLOR.WHITE }]}>
        <View
          style={{
            flex: 1,
            // opacity: this.state.modalVisible === true ? 0.5 : 1,
          }}
        >
          <Header
            isLeftIcon={true}
            isRightIcon={false}
            onLeftIconClick={() => {
              navigatorPop({ componentId });
            }}
            isLogout={false}
            isTitle={true}
            title={strings.profile.header}
            titleStyle={{ fontSize: RFValue(28), paddingTop: RFValue(10) }}
          />
          <View
            style={{
              alignSelf: "center",
            }}
          >
            {loginData?.user?.img || this.state.imageUrl !== "" ? (
              <TouchableOpacity>
                <Image
                  source={{
                    uri: loginData?.user?.img
                      ? loginData?.user?.img
                      : this.state.imageUrl,
                  }}
                  resizeMode="cover"
                  style={{
                    width: RFValue(100),
                    height: RFValue(100),
                    borderRadius: RFValue(50),
                    marginTop: RFValue(20),
                    borderWidth: 7,
                    borderColor: COLOR.DARK_GREEN,
                  }}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{
                  width: RFValue(100),
                  height: RFValue(100),
                  borderRadius: RFValue(50),
                  marginTop: RFValue(20),
                  borderWidth: 7,
                  borderColor: COLOR.DARK_GREEN,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={Styles.textStyle}
                >{`${loginData?.profile?.firstname.charAt(
                  0
                )} ${loginData?.profile?.lastname.charAt(0)} `}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              testID="EditProfileButtonID"
              onPress={() => {
                this.setState({ isProfilePictureModelVisible: true });
              }}
              // onPress={() => this.setState({ modalVisible: true })}
              style={{
                width: RFValue(35),
                height: RFValue(35),
                borderRadius: RFValue(20),
                backgroundColor: "white",
                alignItems: "center",
                justifyContent: "center",
                position: "absolute",
                top: RFValue(80),
                left: RFValue(70),
                shadowOffset: { width: 1, height: RFValue(0.2) },
                shadowOpacity: 0.4,
                shadowColor: COLOR.DARK_GREEN,
                shadowRadius: Platform.OS == "ios" ? 11.14 : 3,
                elevation: Platform.OS == "android" ? 3 : 17,
              }}
            >
              <Icon name={"create"} size={25} color={COLOR.DARK_GREEN} />
            </TouchableOpacity>

            {/* <TouchableOpacity onPress={() => this.deleteProfilePic()}>
              <Text>Delete</Text>
            </TouchableOpacity> */}
          </View>
          {/* <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.modalVisible}
            style={{
              position: 'relative',
            }}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
              this.setState({ modalVisible: true });
            }}>
            <View
              style={{
                backgroundColor: 'white',
                borderWidth: 2,
                borderColor: 'white',
                position: 'absolute',
                width: '100%',
                height: '35%',
                borderTopLeftRadius: 15,
                borderTopRightRadius: 15,
                bottom: 0,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,

                elevation: 5,
              }}>
              <View
                style={{
                  alignSelf: 'center',
                  // borderWidth: 2,
                  // borderColor: 'red',
                  width: '90%',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }}>
                <TouchableOpacity
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: '#ECECEC',
                  }}
                  onPress={() => {
                    this.setState({ isProfilePictureModelVisible: true });
                  }}>
                  <Text
                    style={{
                      fontFamily: FONTS.REGULAR,
                      fontSize: RFValue(15),
                      color: COLOR.BLACK,
                      marginVertical: 15,
                      textAlign: 'center',
                    }}>
                    Upload Picture
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: '#ECECEC',
                  }}
                  onPress={() => this.deleteProfilePic()}>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontFamily: FONTS.REGULAR,
                      fontSize: RFValue(15),
                      color: COLOR.AvatarBLACK,
                      marginVertical: 20,
                    }}>
                    Delete
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.setState({ modalVisible: false })}
                  style={{
                    //borderWidth: 2,
                    // borderColor: 'red',
                    width: '100%',
                    alignSelf: 'center',
                    marginTop: 40,
                    paddingVertical: 10,
                    borderRadius: 10,
                    backgroundColor: COLOR.DARK_GREEN,
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontFamily: FONTS.REGULAR,
                      fontSize: RFValue(15),
                      color: 'white',
                    }}>
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal> */}
          <View
            style={{
              width: "100%",
              alignItems: "center",
              marginVertical: RFValue(20),
            }}
          >
            <Text
              style={Styles.text}
            >{`${loginData?.profile?.firstname} ${loginData?.profile?.lastname} `}</Text>
          </View>
          {/* <TouchableOpacity
            onPress={() => {
              this.goToChatbot();
             
            }}
            style={[Styles.touchableStyle, Styles.boxShadow]}>
            <Ionicons
              name={'chatbox-ellipses-outline'}
              size={28}
              color={COLOR.DARK_GREEN}
            />
            <Text style={Styles.OptionStyle}>
              {strings.chat.ChatWithStella}
            </Text>
            <Ionicons
              name={'chevron-forward'}
              color={COLOR.tabIcon}
              size={30}
              style={{
                position: 'absolute',
                right: 10,
                alignSelf: 'center',
              }}
            />
          </TouchableOpacity> */}
          <FlatList
            data={this.SETTINGS_TABS}
            keyExtractor={(item, index) => {
              return item.id.toString();
            }}
            contentContainerStyle={{}}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={this.renderItems}
          />
        </View>
        <Modal
          transparent
          visible={this.state.isProfilePictureModelVisible}
          animationType={"slide"}
          onRequestClose={() =>
            this.setState({ isProfilePictureModelVisible: false })
          }
        >
          <Camera
            onMediaSelect={(media, data) => {
              this.setState({ isProfilePictureModelVisible: false });
              this.uploadProfile(media, data);
            }}
            closeModal={() => {
              this.setState({ isProfilePictureModelVisible: false });
            }}
          />
        </Modal>

        <Modal
          transparent
          visible={this.state.showSelection}
          animationType={"slide"}
          onRequestClose={() => this.setState({ showSelection: false })}
        >
          <SelectModal
            closeModal={() => {
              this.setState({ showSelection: false });
            }}
          />
        </Modal>
        <Modal
          transparent
          visible={this.state.showAppInfo}
          animationType={"slide"}
          onRequestClose={() => this.setState({ showAppInfo: false })}
        >
          <AppInfoModal
            closeModal={() => {
              this.setState({ showAppInfo: false });
            }}
          />
        </Modal>

        <Modal
          transparent
          visible={this.state.showPrivacy}
          animationType={"slide"}
          onRequestClose={() => this.setState({ showPrivacy: false })}
        >
          <PrivacyModal
            closeModal={() => {
              this.setState({ showPrivacy: false });
            }}
            getHelpResponse={this.props?.getHelpResponse}
          />
        </Modal>
        <Modal
          transparent
          visible={this.state.notification}
          animationType={"slide"}
          onRequestClose={() => this.setState({ notification: false })}
        >
          <Notification
            user_data={this.props.user_data}
            settoggleNotification={(data) => {
              this.togglePush(data);
            }}
            closeModal={() => {
              this.setState({ notification: false });
            }}
          />
        </Modal>
      </View>
    );
  }
}
const mapStateToProps = ({ authReducer, dashboardReducer }) => ({
  loginData: authReducer.loginData,
  getHelpResponse: dashboardReducer.getHelpResponse,
  user_data: authReducer.loginData,
});
const mapDispatchToProps = (dispatch) => ({
  AppActions: bindActionCreators(AppActions, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(Settings);
