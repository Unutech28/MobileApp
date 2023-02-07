import ButtonNew from "@components/common/buttonNew";
import CustomButton from "@components/common/customButton";
import GLOBALS from "@constants";
import * as Images from "@images";
import { validatePassword } from "@utils/ValidationUtils";
import React, { useState, lazy, useEffect } from "react";
import Loader from "@components/common/loader";
import { TouchableOpacity, KeyboardAvoidingView } from "react-native";
import {
  Image,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  // TextInput,
  View,
  StatusBar,
  ImageBackground,
  Alert,
  Dimensions,
  ScrollView,
} from "react-native";
import { strings } from "@localization";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { RFValue, RFPercentage } from "react-native-responsive-fontsize";
const { FONTS, COLOR, STRINGS } = GLOBALS;
const {
  SIGNIN,
  SIGNUP,
  EMAILADDR,
  EMAILPASWD,
  EMAILHOLDER,
  EMAIL_ERROR,
  PASSWORD_ERROR,
  VALID_ERROR,
} = STRINGS;
const { PRIMARY, WHITE, GREY, DARKGREY } = COLOR;
import { TextInput } from "react-native-paper";
import Ionicons from "react-native-vector-icons/Ionicons";
import { alertWithOneBtn } from "@helpers/common";
import * as AppActions from "@actions";
import { shallowEqual, useSelector, useDispatch } from "react-redux";
const Header = lazy(() => import("@components/common/Header"));

const isIOS = Platform.OS === "ios";
let window = Dimensions.get("window");

function ProviderModal(props) {
  const { loginData } = useSelector((state) => state.authReducer);
  const { hospitalDetails } = useSelector((state) => state.dashboardReducer);

  const [showLoader, setShowLoader] = useState(false);
  const hospitalData = useSelector((state) => {
    return state.authReducer.loginData.user;
  });
  const dispatch = useDispatch();

  useEffect(() => {}, []);

  return (
    <View style={styles.container}>
      <Header
        isLeftIcon={true}
        isRightIcon={false}
        onLeftIconClick={() => {
          props.closeModal();
        }}
        isLogout={false}
        isTitle={true}
        title={strings.Account.provider}
        titleStyle={{ fontSize: RFValue(25), paddingTop: RFValue(10) }}
      />
      {showLoader && (
        <View
          style={{
            flex: 1,
            position: "absolute",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "100%",
            zIndex: 1000,
          }}
        >
          <Loader />
        </View>
      )}
      <KeyboardAvoidingView behavior="padding">
        <ScrollView
          keyboardShouldPersistTaps="handled"
          style={styles.outerContainer}
        >
          <View
            style={{
              marginTop: 20,
              marginBottom: 20,
              paddingHorizontal: RFValue(24),
            }}
          >
            <View>
              {/* <Text style={styles.titleText}>
                {strings.Account.providerName}
              </Text>
              <TextInput
                style={[
                  {
                    fontFamily: FONTS.LIGHT,
                    fontSize: RFValue(15),
                    marginBottom: 30,
                    color: "dark" ? DARKGREY : DARKGREY,
                    backgroundColor: "lightgray",
                  },
                ]}
                theme={{
                  colors: {
                    primary: COLOR.PRIMARY,
                    placeholder: DARKGREY,
                  },
                }}
                mode={"outlined"}
                maxLength={20}
                placeholder={strings.Account.providerName}
                placeholderTextColor={GREY}
                underlineColorAndroid="transparent"
                editable={false}
                returnKeyType={"done"}
              /> */}

              {/* <Text style={styles.titleText}>{strings.Account.providerId}</Text>
              <TextInput
                style={[
                  {
                    fontFamily: FONTS.LIGHT,
                    fontSize: RFValue(15),
                    color: "dark" ? DARKGREY : DARKGREY,
                    marginBottom: 30,
                    backgroundColor: "lightgray",
                  },
                ]}
                theme={{
                  colors: {
                    primary: COLOR.PRIMARY,
                    placeholder: DARKGREY,
                  },
                }}
                mode={"outlined"}
                maxLength={20}
                editable={false}
                placeholder={strings.Account.providerId}
                placeholderTextColor={GREY}
                underlineColorAndroid="transparent"
                returnKeyType={"done"}
              /> */}

              <Text style={styles.titleText}>
                {/* {strings.Account.hospitalName} */}
                {"Organisation Name"}
              </Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[
                    {
                      fontFamily: FONTS.LIGHT,
                      fontSize: RFValue(15),
                      backgroundColor: "lightgray",
                      color: "dark" ? DARKGREY : DARKGREY,
                      marginBottom: 0,
                    },
                    styles.commentInput,
                  ]}
                  theme={{
                    colors: {
                      primary: COLOR.PRIMARY,
                      placeholder: DARKGREY,
                    },
                  }}
                  value={
                    loginData?.profile?.orgName
                      ? loginData?.profile?.orgName
                      : ""
                  }
                  // mode={"outlined"}
                  maxLength={20}
                  placeholder={strings.Account.hospitalName}
                  placeholderTextColor={GREY}
                  underlineColorAndroid="transparent"
                  returnKeyType={"done"}
                  editable={false}
                />
              </View>

              <Text style={styles.titleText}>{strings.Account.hospitalId}</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[
                    {
                      fontFamily: FONTS.LIGHT,
                      fontSize: RFValue(15),
                      backgroundColor: "lightgray",
                      color: "dark" ? DARKGREY : DARKGREY,
                      marginBottom: 0,
                    },
                    styles.commentInput,
                  ]}
                  theme={{
                    colors: {
                      primary: COLOR.PRIMARY,
                      placeholder: DARKGREY,
                    },
                  }}
                  value={
                    loginData?.profile?.regCode
                      ? loginData?.profile?.regCode
                      : ""
                  }
                  // mode={"outlined"}
                  maxLength={20}
                  placeholder={strings.Account.hospitalId}
                  placeholderTextColor={GREY}
                  underlineColorAndroid="transparent"
                  editable={false}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: WHITE,
    paddingHorizontal: 30,
  },
  textContainer: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginTop: RFValue(32),
    marginLeft: RFValue(12),
    // paddingBottom: RFValue(35)
  },
  heading: {
    fontFamily: FONTS.BOLD,
    fontSize: RFValue(40),
    fontWeight: "600",
    color: COLOR.SOFT_GRAY,
  },
  img: { width: RFPercentage(18), height: RFPercentage(6) },
  emailText: {
    color: DARKGREY,
    fontFamily: FONTS.REGULAR,
    ...(isIOS
      ? {
          fontSize: RFValue(17),
          marginTop: 8,
        }
      : {
          fontSize: RFValue(18),
          marginTop: 16,
        }),
  },
  emailInput: {
    fontFamily: FONTS.LIGHT,
    fontSize: RFValue(17),
    borderBottomWidth: 0.4,
    borderBottomColor: PRIMARY,
    padding: 0,
    ...(isIOS
      ? {
          marginTop: 10,
          borderBottomWidth: 0.4,
        }
      : {
          marginTop: 6,
          borderBottomWidth: 1,
        }),
    backgroundColor: "transparent",
    color: "dark" ? DARKGREY : DARKGREY,
  },
  helperText: {
    marginBottom: 20,
    color: COLOR.ERROR,
    marginTop: RFValue(8),
  },
  buttonText: {
    fontSize: RFValue(14),
    color: COLOR.SOFT_GRAY,
    textTransform: "uppercase",
    fontFamily: FONTS.BOLD,
    textAlign: "center",
  },
  bgView: {
    width: RFPercentage(56.5),
    height: RFPercentage(56),
    justifyContent: "center",
    alignItems: "center",
    padding: RFValue(24),
    resizeMode: "cover",
  },
  imageView: { flex: 0.3, justifyContent: "center" },
  capText: {
    fontFamily: FONTS.REGULAR,
    fontSize: RFValue(32),
    color: COLOR.WHITE,
  },
  longText: {
    fontFamily: FONTS.LIGHT,
    fontSize: RFValue(18),
    color: COLOR.WHITE,
  },
  secondViewStyle: {
    backgroundColor: "transparent",
    width: "100%",
    paddingHorizontal: RFValue(24),
    paddingVertical: RFValue(8),
  },
  imageStyle: {
    width: "100%",
    height: Platform.OS == "ios" ? RFPercentage(38) : RFPercentage(46),
    tintColor: COLOR.PRIMARY1,
  },
  forgotPassStyle: {
    marginBottom: 20,
    marginTop: RFValue(5),
    alignSelf: "flex-end",
  },

  outerContainer: {
    backgroundColor: WHITE,
    flexGrow: 1,
    height: "100%",
  },
  submitContainer: {
    justifyContent: "center",
    marginVertical: 20,
  },
  titleText: {
    fontFamily: FONTS.BOLD,
    fontSize: RFValue(22),
    color: COLOR.SOFT_GRAY,
  },
  container: {
    flex: 1,
    backgroundColor: COLOR.WHITE,
  },
  inputContainer: {
    // flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    // borderColor: COLOR.DARK_GREEN,
    backgroundColor: COLOR.WHITE,
    paddingHorizontal: 5,
  },
  commentInput: {
    height: RFValue(50),
    color: "dark" ? DARKGREY : DARKGREY,
    // fontSize: 17,
    fontFamily: FONTS.MEDIUM,
    // textAlignVertical: "top",
    backgroundColor: COLOR.WHITE,
  },
});

export default ProviderModal = React.memo(ProviderModal);
