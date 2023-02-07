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

import Camera from "@components/dashboard/modals/Camera";

import SelectModal from "./SelectModal";
import Personalization from "./Personalization";
import Provider from "./Provider";
import Theme from "@components/common/styles";
import * as Images from "@images";
const { width } = Dimensions.get("window");
const isiOS = Platform.OS == "ios";

import { strings } from "@localization";
const ACCOUNT_TABS = [
  { id: 0, title: strings.Account.provider },
  { id: 1, title: "Change Password" },
  // { id: 2, title: strings.Account.personalization },
];
class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isProfilePictureModelVisible: false,
      showSelection: false,
      imageUrl: "",
      showPersonalization: false,
      showProvider: false,
    };
  }

  navigator = (item) => {
    switch (item.id) {
      case 0:
        this.setState({ showProvider: true });
        break;
      case 1:
        this.setState({ showSelection: true });
        break;
      case 2:
        alert("coming soon..");
        // this.setState({ showPersonalization: true });
        break;
      default:
        break;
    }
  };

  renderItems = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.navigator(item);
        }}
        style={[Styles.touchableStyle, Styles.boxShadow]}
      >
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

  onUserKeySave = async (data) => {
    let { loginData } = this.props;
    const res = await this.props.AppActions.setKeywords(
      loginData["user"]["_id"],
      data
    );
  };

  render() {
    let { componentId, loginData } = this.props;
    let {} = this.state;

    return (
      <View style={Styles.homeContainer}>
        <View style={{ flex: 1 }}>
          <Header
            isLeftIcon={true}
            isRightIcon={false}
            onLeftIconClick={() => {
              navigatorPop({ componentId });
            }}
            isLogout={false}
            isTitle={true}
            title={strings.profile.Account}
            titleStyle={{ fontSize: RFValue(28), paddingTop: RFValue(10) }}
          />
          <FlatList
            data={ACCOUNT_TABS}
            contentContainerStyle={{}}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={this.renderItems}
          />
        </View>

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
            props={this.props}
          />
        </Modal>
        <Modal
          transparent
          visible={this.state.showPersonalization}
          animationType={"slide"}
          onRequestClose={() => this.setState({ showPersonalization: false })}
        >
          <Personalization
            closeModal={() => {
              this.setState({ showPersonalization: false });
            }}
            data={this.props.getKeywordResponse}
            saveKeys={this.onUserKeySave}
            userDetails={this.props.loginData.user}
          />
        </Modal>

        <Modal
          transparent
          visible={this.state.showProvider}
          animationType={"slide"}
          onRequestClose={() => this.setState({ showProvider: false })}
        >
          <Provider
            closeModal={() => {
              this.setState({ showProvider: false });
            }}
            userDetails={this.props.loginData.user}
          />
        </Modal>
      </View>
    );
  }
}
const mapStateToProps = ({ authReducer, dashboardReducer }) => ({
  loginData: authReducer.loginData,
  getKeywordResponse: dashboardReducer.getKeywordResponse,
});
const mapDispatchToProps = (dispatch) => ({
  AppActions: bindActionCreators(AppActions, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(Account);
const Styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    backgroundColor: COLOR.WHITE,
  },
  touchableStyle: {
    // backgroundColor: "red",
    paddingHorizontal: RFValue(16),
    paddingVertical: RFValue(12),
    // margin: RFValue(10),
    width: "90%",
    flexDirection: "row",
    borderWidth: 0.5,
    borderColor: COLOR.DARK_GREEN,
    borderRadius: 10,
    marginTop: RFValue(15),
    alignSelf: "center",
    // justifyContent: "center",
  },
  textStyle: {
    fontFamily: FONTS.BOLD,
    fontSize: RFValue(25),
    // color: COLOR.BORDER_LIGHT,
  },
  OptionStyle: {
    fontFamily: FONTS.REGULAR,
    fontSize: RFValue(15),
    color: COLOR.LIGHT_BLACK,
    alignSelf: "center",
    marginLeft: RFValue(15),
  },
  text: {
    fontFamily: FONTS.BOLD,
    fontSize: RFValue(22),
    color: COLOR.DARK_GREEN,
  },
  textEmail: {
    fontFamily: FONTS.REGULAR,
    fontWeight: "700",
    fontSize: RFValue(13),
    color: COLOR.DARK_GREEN,
    marginTop: RFValue(10),
  },
  boxShadow: {
    backgroundColor: "white",
    shadowColor: COLOR.PRIMARY,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.4,
    shadowRadius: 3.14,
    elevation: 2,
  },
  bottomModal: {
    //  justifyContent: "flex-end",
    // marginBottom: 40,
  },
});
