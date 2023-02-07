/* eslint-disable module-resolver/use-alias */
import * as AppActions from "@actions";
import GLOBALS from "@constants";
import { ThemeContext } from "@hoc/withRedux";
import React, { Component, lazy } from "react";
import { StyleSheet, View, Platform } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import DeviceInfo from "react-native-device-info";
import momentZone from "moment-timezone";
import { InitiateNotification } from "@utils/Notification";
import DropDownPicker from "../../../updatedNodeModules/react-native-dropdown-picker";
import { RFValue } from "react-native-responsive-fontsize";
let currentTimeZone = momentZone.tz.guess();
import { strings } from "@localization";
import styles from "./styles";
const {
  STRINGS: { CHECK_NETWORK },
  PRODUCT_TYPE,
  COLOR,
  FONTS,
} = GLOBALS;
const SignInComponent = lazy(() => import("@components/auth/signIn"));
const Header = lazy(() => import("@components/common/Header"));
const DropDown = lazy(() => import("@components/common/DropDown"));
class SignIn extends Component {
  static contextType = ThemeContext;
  constructor(props) {
    super(props);
    this.state = {
      deviceName: "",
      osVersion: "",
      open: false,
      value: "en",
      items: [],
    };
  }

  componentDidMount() {
    /**Initialize language props */
    strings.setLanguage(this.props.user_language);
    this.setState({
      value: this.props.user_language,
      items: [
        { label: strings.profile.english, value: "en" },
        { label: strings.profile.spanish, value: "es" },
        { label: strings.profile.German, value: "de" },
        { label: strings.profile.hindi, value: "hi" },
      ],
    });
    DeviceInfo.getDeviceName().then((deviceName) => {
      this.setState({
        deviceName: deviceName,
      });
    });

    Platform.OS == "android"
      ? DeviceInfo.getApiLevel().then((apiLevel) => {
          this.setState({
            osVersion: apiLevel,
          });
        })
      : this.setState({
          osVersion: DeviceInfo.getSystemVersion(),
        });

    // InitiateNotification();
  }

  /**On Login Button Click */
  _onPressLogin = async (email, password, is_remember) => {
    let timeZone = currentTimeZone;
    let deviceName = this.state.deviceName;
    let osVersion = this.state.osVersion;
    let deviceInformation = {
      deviceType: Platform.OS,
      deviceName:
        Platform.OS == "ios"
          ? deviceName
          : `${DeviceInfo.getBrand()} ${DeviceInfo.getDeviceId()}`,
      systemVersion: osVersion,
    };
    let { componentId } = this.props;
    this.props.AppActions.login(
      email,
      password,
      timeZone,
      deviceInformation,
      is_remember,
      componentId
    );
  };

  /**When click on language drop down */
  setValue = (callback) => {
    this.setState((state) => ({
      value: callback(state.value),
    }));
    this.props.AppActions.updateLanguage(callback(), false);
  };

  /**Hide Drop Down */
  hideDropDown = () => {
    this.setState({ open: false });
  };

  /**Drop Dwown Container */
  dropDownComponent = () => {
    return (
      <DropDown
        placeholder={"Language"}
        containerStyle={{ width: "40%" }}
        open={this.state.open}
        value={this.state.value}
        items={this.state.items}
        setOpen={(val) => this.setState({ open: val })}
        setValue={this.setValue}
        onChangeValue={(value) => {
          this.hideDropDown();
        }}
        onPress={(open) => {
          this.hideDropDown();
        }}
        textStyle={{
          fontSize: 19,
          fontFamily: FONTS.MEDIUM,
          color: COLOR.BLACK,
        }}
        labelStyle={{
          fontSize: 19,
          color: COLOR.DARK_GREEN,
          fontFamily: FONTS.BOLD,
        }}
        pickerStyle={{ borderColor: COLOR.DARK_GREEN, borderWidth: RFValue(2) }}
      />
    );
  };

  render() {
    let { componentId } = this.props;
    return (
      <View style={[styles.container, { backgroundColor: COLOR.WHITE }]}>
        <Header
          isLeftIcon={false}
          isRightIcon={false}
          isLogout={false}
          isMiddleIcon={PRODUCT_TYPE == "MSHS" ? false : true}
          isTitle={PRODUCT_TYPE == "MSHS" ? true : false}
          title={PRODUCT_TYPE == "MSHS" ? "CDT001" : ""}
        />
        {/* <View style={styles.dropContainer}>{this.dropDownComponent()}</View> */}
        <View>
          <SignInComponent
            onLogin={this._onPressLogin}
            onClick={this.hideDropDown}
            componentId={componentId}
            // isLoading={this.props.isLoading}
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = ({ authReducer }) => ({
  //isLoading: authReducer.isLoading,
  fcmToken: authReducer.fcmDeviceToken,
  user_language: authReducer.language,
});

const mapDispatchToProps = (dispatch) => ({
  AppActions: bindActionCreators(AppActions, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
