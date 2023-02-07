import ButtonNew from "@components/common/buttonNew";
import CustomButton from "@components/common/customButton";
import GLOBALS from "@constants";
import * as Images from "@images";
import { validatePassword } from "@utils/ValidationUtils";
import React, { useState, lazy } from "react";
import Loader from "@components/common/loader";

import { TouchableOpacity, KeyboardAvoidingView } from "react-native";
import {
  Image,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  View,
  StatusBar,
  ImageBackground,
  Alert,
  Dimensions,
  ScrollView,
} from "react-native";
import { strings } from "@localization";
import { shallowEqual, useSelector, useDispatch } from "react-redux";
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

const Header = lazy(() => import("@components/common/Header"));

const isIOS = Platform.OS === "ios";
let window = Dimensions.get("window");

function SelectModal(props) {
  const { isLoading } = useSelector((state) => state.authReducer);
  let password_box = null;

  const [password, setPassword] = useState("");
  const [Newpassword, setNewPassword] = useState("");
  const [Confpassword, setConfPassword] = useState("");

  const [isBlur, setBlur] = useState(false);
  const [isShowError, setErrorShow] = useState(false);
  const [secureText, stSecureTextEntery] = useState(true);
  const [secureTextNew, stSecureTextEnteryNew] = useState(true);
  const [secureTextCon, stSecureTextEnteryCon] = useState(true);
  const [showLoader, setShowLoader] = useState(false);

  const validateField = () => {
    isBlur ? null : setBlur(true);
    Keyboard.dismiss();
    setErrorShow(true);
    if (
      password.trim() !== "" &&
      Newpassword.trim() !== "" &&
      Confpassword.trim() !== "" &&
      !shouldMarkError(Newpassword) &&
      !shouldMarkError(Confpassword) && Newpassword == Confpassword
    ) {
      onPasswordChange();
    } else {
      console.log("erro");
    }
    // onPasswordChange();
  };

  const shouldMarkError = (field) => {
    const hasError =
      // field == 'password' ? !validatePassword(password) : !validateEmail(email);
      !validatePassword(field);
    const shouldShow = isBlur;
    return hasError ? shouldShow : false;
  };

  const onPasswordChange = async () => {
    let { loginData } = props?.props;
    setShowLoader(true);
    let postData = {
      old_pass: password,
      new_pass: Newpassword
    }
    const res = await props.props.AppActions.setPassword(postData, false);
    console.log('res>>>>>>>>>>>>>>>>>>', res)
    // if (res.code == 200) {
    //   setTimeout(() => {
    //     props.closeModal();
    //   }, 500);
    // }
    if (!isLoading) {
      props.closeModal();
      setShowLoader(false);
    }
    // closeModal()
    // alertWithOneBtn(
    //   strings.profile.success,
    //   strings.profile.lang_success,
    //   GLOBALS.STRINGS.LOGOUT_OK
    // ).then((res) => {
    //   closeModal();
    //   CodePush.restartApp();
    // });
  };

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
        title={'Change Password'}
        titleStyle={{ fontSize: RFValue(25), paddingTop: RFValue(10) }}
      />
      <KeyboardAwareScrollView
        enableAutomaticScroll={true}
        keyboardShouldPersistTaps={"handled"}
        enableOnAndroid={true}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{}}
        nestedScrollEnabled={true}
        extraScrollHeight={100}
      >
        <View style={styles.outerContainer}>
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
          {/* <KeyboardAvoidingView behavior="padding"> */}
          {/* <ScrollView
        keyboardShouldPersistTaps="handled"
        style={styles.outerContainer}
      > */}
          <View
            style={{
              marginTop: 20,
              paddingHorizontal: RFValue(24),
            }}
          >
            <View>
              <View style={{ marginBottom: 25 }}>
                <Text style={styles.titleText}>
                  Current Password
                </Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={[
                      {
                        fontFamily: FONTS.LIGHT,
                        fontSize: RFValue(15),
                        // color: "dark" ? DARKGREY : DARKGREY,
                      },
                      styles.commentInput,
                      shouldMarkError(password) == false
                        ? {
                          marginBottom: 0,
                        }
                        : null,
                    ]}
                    right={
                      <TextInput.Icon
                        name="eye"
                        onPress={() => stSecureTextEntery(!secureText)}
                      />
                    }

                    value={password}
                    maxLength={20}
                    placeholder={strings.Account.currunt_password}

                    secureTextEntry={secureText}
                    onBlur={() => {
                      isBlur ? null : setBlur(true);
                    }}
                    underlineColorAndroid="transparent"
                    onChangeText={(password) => setPassword(password)}
                    onSubmitEditing={() => validateField()}
                    ref={(ref) => {
                      password_box = ref;
                    }}
                    returnKeyType={"done"}
                  />
                </View>
                {isShowError && password == "" && (
                  <Text style={styles.helperText}>
                    {GLOBALS.Strings.validation.passowrd_require}
                  </Text>
                )}
              </View>

              <View style={{ marginBottom: 25 }}>
                <Text style={styles.titleText}>
                  New Password
                </Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={[
                      {
                        fontFamily: FONTS.LIGHT,
                        fontSize: RFValue(15),

                        color: "dark" ? DARKGREY : DARKGREY,
                      },
                      styles.commentInput,
                      shouldMarkError(Newpassword) == false
                        ? {
                          marginBottom: 0,
                        }
                        : null,
                    ]}
                    theme={{
                      colors: {
                        primary: COLOR.PRIMARY,
                        placeholder: DARKGREY,
                      },
                    }}
                    right={
                      <TextInput.Icon
                        name="eye"
                        onPress={() => stSecureTextEnteryNew(!secureTextNew)}
                      />
                    }

                    value={Newpassword}
                    maxLength={20}
                    placeholder={strings.Account.new_password}
                    placeholderTextColor={GREY}
                    secureTextEntry={secureTextNew}
                    onBlur={() => {
                      isBlur ? null : setBlur(true);
                    }}
                    underlineColorAndroid="transparent"
                    onChangeText={(password) => setNewPassword(password)}
                    onSubmitEditing={() => validateField()}
                    ref={(ref) => {
                      password_box = ref;
                    }}
                    returnKeyType={"done"}
                  />
                </View>
                {isShowError && Newpassword == "" ? (
                  <Text style={styles.helperText}>
                    {GLOBALS.Strings.validation.passowrd_require}
                  </Text>
                ) : shouldMarkError(Newpassword) ? (
                  <Text style={styles.helperText}>{strings.validation.PASSWORD_ERROR}</Text>
                ) : null}
              </View>

              <View>
                <Text style={styles.titleText}>
                  Confirm New Password
                </Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={[
                      {
                        fontFamily: FONTS.LIGHT,
                        fontSize: RFValue(15),
                        color: "dark" ? DARKGREY : DARKGREY,
                      },
                      styles.commentInput,
                      shouldMarkError(Confpassword) == false
                        ? {
                          marginBottom: 0,
                        }
                        : null,
                    ]}
                    theme={{
                      colors: {
                        primary: COLOR.PRIMARY,
                        placeholder: DARKGREY,
                      },
                    }}
                    right={
                      <TextInput.Icon
                        name="eye"
                        onPress={() => stSecureTextEnteryCon(!secureTextCon)}
                      />
                    }
                    value={Confpassword}
                    maxLength={20}
                    placeholder={strings.Account.confirm_password}
                    placeholderTextColor={GREY}
                    secureTextEntry={secureTextCon}
                    onBlur={() => {
                      isBlur ? null : setBlur(true);
                    }}
                    underlineColorAndroid="transparent"
                    onChangeText={(password) => setConfPassword(password)}
                    onSubmitEditing={() => validateField()}
                    ref={(ref) => {
                      password_box = ref;
                    }}
                    returnKeyType={"done"}
                  />
                </View>
                {isShowError && Confpassword == "" ? (
                  <Text style={styles.helperText}>
                    {GLOBALS.Strings.validation.passowrd_require}
                  </Text>
                ) : shouldMarkError(Confpassword) ? (
                  <Text style={styles.helperText}>{strings.validation.PASSWORD_ERROR}</Text>
                ) : Newpassword != Confpassword ? (
                  <Text style={styles.helperText}>
                    {strings.login.pass_not_same}
                  </Text>
                ) : null}
              </View>
            </View>
            <View style={styles.submitContainer}>
              <ButtonNew
                text={'Change Password'.toUpperCase()}
                onBtnPress={() => {
                  validateField();
                }}
              />
            </View>
          </View>
          {/* </ScrollView> */}
          {/* </KeyboardAvoidingView> */}
          {/* </View> */}
        </View>
      </KeyboardAwareScrollView>
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
    //  marginBottom: 20,
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
    // height: "75%",
    // flex: 0.5,
    width: "100%",
    // position: "absolute",
    // bottom: 0,
    paddingHorizontal: RFValue(24),
    paddingVertical: RFValue(8),
  },
  imageStyle: {
    // width: RFPercentage(155),
    width: "100%",
    height: Platform.OS == "ios" ? RFPercentage(38) : RFPercentage(46),
    tintColor: COLOR.PRIMARY1,
  },
  forgotPassStyle: {
    marginBottom: 20,
    marginTop: RFValue(5),
    alignSelf: "flex-end",
    // alignItems: "flex-end",
    // justifyContent: "flex-end",
    // alignContent: "flex-end",
  },

  outerContainer: {
    backgroundColor: WHITE,
    flexGrow: 1,
    //  height: "100%",
    // flex: 1,
    //paddingHorizontal: RFValue(10),
    // marginTop: RFValue(20),
  },
  submitContainer: {
    // flex: 1,
    justifyContent: "center",
    marginVertical: 20,
    // padding: RFValue(20),
    // bottom: 0,
    // position: "absolute",
  },
  titleText: {
    fontFamily: FONTS.BOLD,
    fontSize: RFValue(20),
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
    color: COLOR.BLACK,
    // fontSize: 17,
    fontFamily: FONTS.MEDIUM,
    // textAlignVertical: "top",
    backgroundColor: COLOR.WHITE,
  },
});

export default (SelectModal = React.memo(SelectModal));
