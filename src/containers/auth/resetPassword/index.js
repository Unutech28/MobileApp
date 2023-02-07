import ButtonNew from "@components/common/buttonNew";
import * as AppActions from "@actions";
import GLOBALS from "@constants";
import Constants from "@constants";
import { validatePassword } from "@utils/ValidationUtils";
import React, { useState, lazy } from "react";
import Loader from "@components/common/loader";
import { navigatorPush } from "@config/navigationOptions";
import Icon from "react-native-vector-icons/FontAwesome";
import { TouchableOpacity, KeyboardAvoidingView } from "react-native";
import Pdf from "react-native-pdf";
import {
  Keyboard,
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
} from "react-native";
import { strings } from "@localization";
import { RFValue, RFPercentage } from "react-native-responsive-fontsize";
const { FONTS, COLOR, STRINGS } = GLOBALS;
const { WHITE, GREY, DARKGREY, LIGHT_GRAY } = COLOR;
import { TextInput } from "react-native-paper";
import { alertWithOneBtn } from "@helpers/common";
const Header = lazy(() => import("@components/common/Header"));
import { useDispatch, useSelector } from "react-redux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { WebView } from "react-native-webview";


function ResetPassword(props) {
  const dispatch = useDispatch();
  const [currentPass, setCurrentPassword] = useState("");
  const [Newpassword, setNewPassword] = useState("");
  const [Confpassword, setConfPassword] = useState("");
  const [isBlur, setBlur] = useState(false);
  const [isShowError, setErrorShow] = useState(false);

  const [secureTextOld, stSecureTextEnteryOld] = useState(true);
  const [secureTextNew, stSecureTextEnteryNew] = useState(true);
  const [secureTextCon, stSecureTextEnteryCon] = useState(true);
  const [isCheckTC, setisCheckTC] = useState(false);
  const [isPdfShow, setPdf] = useState(false);
  const [isAcknowledgeShow, setAck] = useState(false);
  const {
    policyData,
    termsData

  } = useSelector((state) => state.authReducer);

  /**Validation check on button click */
  const validateField = () => {
    if (!isBlur) {
      setBlur(true);
    }
    Keyboard.dismiss();
    setErrorShow(true);
    if (checkButtonEnability()) {
      alertWithOneBtn("", "Please resolve all errors", Constants.Strings.ok_text);
    }
    else {
      onPasswordChange();
    }
  };

  /**Validation handling */
  const shouldMarkError = (field) => {
    const hasError = !validatePassword(field);
    const shouldShow = isBlur;
    return hasError ? shouldShow : false;
  };

  /** On Password Change */
  const onPasswordChange = async () => {
    let postdata = {
      tkn: currentPass,
      new_pass: Newpassword,
    };
    dispatch(AppActions.resetPassword(postdata, true));
  };

  /**Set Button Enability */
  const checkButtonEnability = () => {
    /**Check if inputs blank, fileds not match, patern not match */
    if (
      currentPass == "" ||
      Newpassword == "" ||
      Confpassword == "" ||
      shouldMarkError(Newpassword) ||
      shouldMarkError(Confpassword) ||
      Newpassword != Confpassword
    ) {
      return true;
    }
    return false;
  };

  /**Set Terms Document */
  const setTermsDocument = () => {
    return (
      <View style={{ flex: 1 }}>
        <Header
          isLeftIcon={true}
          isRightIcon={false}
          onLeftIconClick={() => {
            setPdf(false);
          }}
          isTitle={true}
          title={strings.login.terms}
          isLogout={false}
          titleStyle={{
            fontSize: RFValue(22),
            paddingTop: RFValue(10),
          }}
        />
        {/* <View
          style={{
            backgroundColor: LIGHT_GRAY,
            flex: 1,
          }}
        >
          <Pdf
            source={{
              uri:
                "https://mamalift.curiodigitaltx.com/upload/MamaLift_Terms_of_Use.pdf",
            }}
            onLoadComplete={(numberOfPages, filePath) => { }}
            onPageChanged={(page, numberOfPages) => { }}
            onError={(error) => { }}
            onPressLink={(uri) => {
              Linking.openURL(uri);
            }}
            style={styles.pdfStyle}
          />
        </View> */}
        <View style={{ flex: 1 }}>
          <WebView
            originWhitelist={['*']}
            source={{ html: termsData?.desc }}
            style={{
              margin: RFValue(10),
              marginTop: RFValue(50),
              // maxHeight: height / 2,
              // zIndex: 100,
            }}
            startInLoadingState={true}
            allowsFullscreenVideo={true}
            javaScriptEnabled={true}
            scrollEnabled={false}
          />
        </View>
      </View>
    );
  };

  /**Set Privacy Document */
  const setPrivacy = () => {
    return (
      <View style={{ flex: 1 }}>
        <Header
          isLeftIcon={true}
          isRightIcon={false}
          onLeftIconClick={() => {
            setAck(false);
          }}
          isTitle={true}
          title={strings.login.privacy}
          isLogout={false}
          titleStyle={{ fontSize: RFValue(22), paddingTop: RFValue(10) }}
        />

        <View style={{ flex: 1 }}>
          <WebView
            originWhitelist={['*']}
            source={{ html: policyData?.desc }}
            style={{
              margin: RFValue(10),
              marginTop: RFValue(50),
              // maxHeight: height / 2,
              // zIndex: 100,
            }}
            startInLoadingState={true}
            allowsFullscreenVideo={true}
            javaScriptEnabled={true}
            scrollEnabled={false}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {isPdfShow ? (
        setTermsDocument()
      ) : isAcknowledgeShow ? (
        setPrivacy()
      ) : (
        <View>
          <Header
            isLeftIcon={false}
            isRightIcon={false}
            isLogout={false}
            isTitle={true}
            title={"Reset Password"}
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
            {/* <KeyboardAvoidingView behavior="padding"> */}
            {/* <ScrollView
              keyboardShouldPersistTaps="handled"
              style={styles.outerContainer}
            > */}
            <View
              style={{
                flexGrow: 1,
                marginTop: RFValue(24),
                paddingHorizontal: RFValue(24),
              }}
            >
              <View>
                <View style={{ marginBottom: 25 }}>
                  <Text style={styles.titleText}>OTP</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={[
                        styles.inputStyle,
                        styles.commentInput,
                        shouldMarkError(currentPass) == false
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
                          onPress={() =>
                            stSecureTextEnteryOld(!secureTextOld)
                          }
                        />
                      }
                      value={currentPass}
                      maxLength={20}
                      placeholder={strings.Account.currunt_password}
                      placeholderTextColor={GREY}
                      secureTextEntry={secureTextOld}
                      onBlur={() => {
                        if (!isBlur) {
                          setBlur(true);
                        }
                      }}
                      underlineColorAndroid="transparent"
                      onChangeText={(password) =>
                        setCurrentPassword(password)
                      }
                      onSubmitEditing={() => validateField()}
                      ref={(ref) => {
                        password_box = ref;
                      }}
                      returnKeyType={"done"}
                    />
                  </View>
                  {isShowError && currentPass == "" ? (
                    <Text style={styles.helperText}>
                      {strings.login.passowrd_require}
                    </Text>
                  ) : null}
                </View>
                <View style={{ marginBottom: 25 }}>
                  <Text style={styles.titleText}>New Password</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={[
                        styles.inputStyle,
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
                          onPress={() =>
                            stSecureTextEnteryNew(!secureTextNew)
                          }
                        />
                      }
                      value={Newpassword}
                      maxLength={20}
                      placeholder={strings.Account.new_password}
                      placeholderTextColor={GREY}
                      secureTextEntry={secureTextNew}
                      onBlur={() => {
                        if (!isBlur) {
                          setBlur(true);
                        }
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
                      {strings.login.passowrd_require}
                    </Text>
                  ) : shouldMarkError(Newpassword) ? (
                    <Text style={styles.helperText}>
                      {strings.validation.PASSWORD_ERROR}
                    </Text>
                  ) : null}
                </View>

                <View>
                  <Text style={styles.titleText}>Confirm New Password</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={[
                        styles.inputStyle,
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
                          onPress={() =>
                            stSecureTextEnteryCon(!secureTextCon)
                          }
                        />
                      }
                      value={Confpassword}
                      maxLength={20}
                      placeholder={strings.Account.confirm_password}
                      placeholderTextColor={GREY}
                      secureTextEntry={secureTextCon}
                      onBlur={() => {
                        if (!isBlur) {
                          setBlur(true);
                        }
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
                      {strings.login.cp_require}
                    </Text>
                  ) : shouldMarkError(Confpassword) ? (
                    <Text style={styles.helperText}>
                      {strings.validation.PASSWORD_ERROR}
                    </Text>
                  ) : Newpassword != Confpassword ? (
                    <Text style={styles.helperText}>
                      {strings.login.pass_not_same}
                    </Text>
                  ) : null}
                </View>
              </View>
              <View style={styles.submitContainer}>
                <ButtonNew
                  isDisabled={checkButtonEnability()}
                  text={"Change Password"}
                  onBtnPress={() => {
                    console.log("propes==>", props);
                    validateField();
                  }}
                />
              </View>
            </View>
            {/* </ScrollView> */}
            {/* </KeyboardAvoidingView> */}
          </KeyboardAwareScrollView>
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  helperText: {
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
    fontSize: RFValue(18),
    color: COLOR.SOFT_GRAY,
  },
  container: {
    flex: 1,
    backgroundColor: COLOR.WHITE,
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: COLOR.WHITE,
    paddingHorizontal: 5,
    marginTop: RFValue(4),
  },
  commentInput: {
    height: RFValue(50),
    color: COLOR.BLACK,
    backgroundColor: COLOR.WHITE,
  },
  loaderContainer: {
    flex: 1,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
    zIndex: 1000,
  },
  inputStyle: {
    fontFamily: FONTS.LIGHT,
    fontSize: RFValue(15),
    color: DARKGREY,
  },
  pdfStyle: {
    padding: 20,
    flex: 1,
    height: Dimensions.get("window").height,
    shadowOffset: { width: 1, height: RFValue(0.2) },
    shadowOpacity: 0.4,
    shadowRadius: RFValue(8),
    shadowColor: COLOR.DARK_GREEN,
    borderRadius: RFValue(10),
  },
});

export default (ResetPassword = React.memo(ResetPassword));