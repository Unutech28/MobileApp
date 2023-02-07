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
const { STRINGS, SETTINGS_TABS, COLOR, FONTS } = GLOBALS;
import { RFValue, RFPercentage } from "react-native-responsive-fontsize";
const Header = lazy(() => import("@components/common/Header"));
import Theme from "@components/common/styles";
import * as Images from "@images";
const { width } = Dimensions.get("window");
const isiOS = Platform.OS == "ios";

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onPressTab(index, item) {
    let { componentId } = this.props;
    if (index === 0) {
      navigatorPush({ componentId, screenName: "NextDosage", passProps: {} });
    } else if (item.id === 1) {
      navigatorPush({ componentId, screenName: "Reminders", passProps: {} });
    } else if (item.id === 2) {
      // navigatorPush({ componentId, screenName: 'Symptoms', passProps: {} });
    }
  }

  render() {
    let { componentId, loginData } = this.props;
    let { } = this.state;

    return (
      <View style={Styles.homeContainer}>
        <Header
          isLeftIcon={true}
          isRightIcon={false}
          onLeftIconClick={() => {
            navigatorPop({ componentId });
          }}
          isMiddleIcon={true}
          isLogout={true}
          logoutApi={() => {
            this.props.AppActions.logout(loginData["user"]["_id"]);
          }}
        />
        <FlatList
          // style={{ marginBottom: 20 }}
          data={SETTINGS_TABS}
          contentContainerStyle={{
            alignItems: "center",
            paddingBottom: RFPercentage(isiOS ? 1 : 13),
          }}
          // numColumns={2}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => {
                this.onPressTab(index, item);
              }}
              style={[Theme.cardStyle, Styles.touchableStyle]}
            >
              <View
                style={{
                  flex: 0.2,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  source={item.logo}
                  resizeMode="contain"
                  style={
                    item.title == "Journal"
                      ? {
                        tintColor: COLOR.PRIMARY1,
                        width: RFValue(25),
                        height: RFValue(25),
                      }
                      : null
                  }
                />
              </View>
              <Text style={Styles.textStyle}>{item.title}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }
}
const mapStateToProps = ({ authReducer }) => ({
  loginData: authReducer.loginData,
});
const mapDispatchToProps = (dispatch) => ({
  AppActions: bindActionCreators(AppActions, dispatch),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings);
const Styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
  },
  touchableStyle: {
    backgroundColor: COLOR.WHITE,
    paddingHorizontal: RFValue(16),
    paddingVertical: RFValue(8),
    margin: RFValue(10),
    width: width / 1.2,
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  textStyle: {
    flex: 0.8,
    alignSelf: "center",
    // fontFamily: FONTS.REGULAR,
    fontFamily: FONTS.SF_DISPLAY_REGULAR,
    fontSize: RFValue(isiOS ? 16 : 18),
    color: COLOR.BORDER_LIGHT,
    paddingLeft: RFValue(20),
  },
});
