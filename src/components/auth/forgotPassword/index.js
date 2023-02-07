// @ts-nocheck
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ButtonNew from "@components/common/buttonNew";
import GLOBALS from "@constants";
import { validateEmail, validatePassword } from "@utils/ValidationUtils";
import { TouchableOpacity, KeyboardAvoidingView } from "react-native";
import {
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  View,
  ScrollView,
} from "react-native";
import { RFValue, RFPercentage } from "react-native-responsive-fontsize";
const { FONTS, COLOR, STRINGS, PRODUCT_TYPE } = GLOBALS;
const { PRIMARY, WHITE, GREY, DARKGREY } = COLOR;
import { TextInput } from "react-native-paper";
import { strings } from "@localization";

const isIOS = Platform.OS === "ios";

function ForgotPassword(props) {
  let password_box = null;
  const {
    is_remember = false,
    remember_password = "",
    remember_email = "",
  } = useSelector((state) => state.authReducer);

  /**Initialize state variables */
  const [email, setEmail] = useState("");
  const [isBlur, setBlur] = useState(false);
  const [isShowError, setErrorShow] = useState(false);

  const { onLogin, isLoading } = props;

  /***Validate Email and Password */
  const validateField = () => {
    // onClick();
    isBlur ? null : setBlur(true);
    Keyboard.dismiss();
    setErrorShow(true);
    let isValidEmail = validateEmail(email);
    if (isValidEmail == true) {
      onLogin(email);
    }
  };

  /**Verify and set error messages*/
  const shouldMarkError = (field) => {
    const hasError = !validateEmail(email);
    const shouldShow = isBlur;
    return hasError ? shouldShow : false;
  };

  return (
    <KeyboardAvoidingView behavior="padding">
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={styles.outerContainer}
      >
        <View style={styles.inner_container}>
          <View style={styles.textContainer}>
            <Text style={styles.heading}>{strings.login.forgotPassword}</Text>
          </View>
          <View>
            <TextInput
              style={[
                styles.input_style,
                shouldMarkError("email") == false ? { marginBottom: 30 } : null,
              ]}
              theme={{
                colors: {
                  primary: COLOR.DARK_GREEN,
                  placeholder: DARKGREY,
                },
              }}
              mode={"outlined"}
              label={strings.login.email_label}
              value={email}
              placeholder={`${strings.login.email_label}...`}
              placeholderTextColor={GREY}
              maxLength={50}
              onBlur={() => {
                isBlur ? null : setBlur(true);
              }}
              keyboardType="email-address"
              underlineColorAndroid={"transparent"}
              onChangeText={(email) => setEmail(email)}
              onSubmitEditing={() => {
                password_box.focus();
              }}
              returnKeyType={"next"}
              autoCapitalize="none"
            />

            {/**Show email validation message */}
            {shouldMarkError("email") ? (
              <Text style={styles.helperText}>{strings.login.EMAIL_ERROR}</Text>
            ) : null}
          </View>
          <View
            style={{
              marginTop: Platform.OS == "ios" ? "30%" : "20%",
              flexDirection: "row",
              justifyContent: "flex-end",
              paddingVertical: RFValue(8),
            }}
          >
            <View style={{ flex: 0.45 }}>
              {email.trim() !== "" && validateEmail(email) ? (
                <ButtonNew
                  text={strings.cards.submit}
                  onBtnPress={() => validateField()}
                  //loader={isLoading == true}
                />
              ) : (
                <View style={styles.disableBtn}>
                  <Text style={styles.buttonText}>{strings.cards.submit}</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: WHITE,
    paddingHorizontal: 30,
  },
  inner_container: {
    marginTop: isIOS ? 35 : 30,
    marginBottom: 10,
    paddingHorizontal: RFValue(24),
  },
  textContainer: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginVertical: RFValue(20),
  },
  heading: {
    fontFamily: FONTS.BOLD,
    fontSize: RFValue(30),
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
    marginTop: RFValue(15),
    alignSelf: "flex-end",
    width: "60%",
  },
  forgotPassText: {
    color: COLOR.DARK_GREEN,
    fontWeight: "700",
    fontSize: RFValue(14),
    fontFamily: FONTS.LIGHT,
    textAlign: "right",
  },

  outerContainer: {
    backgroundColor: WHITE,
    flexGrow: 1,
    marginTop: RFValue(20),
  },
  remember_me_text: {
    fontSize: RFValue(13),
    color: COLOR.SOFT_GRAY,
    fontFamily: FONTS.REGULAR,
  },
  input_style: {
    fontFamily: FONTS.LIGHT,
    fontSize: RFValue(15),
    marginTop: isIOS ? 10 : 6,
    color: DARKGREY,
  },
  checkBoxContainer: {
    backgroundColor: COLOR.TRANSPARENT,
    borderWidth: 0,
    padding: 0,
    marginTop: 15,
  },
  disableBtn: {
    height: RFValue(45),
    width: "100%",
    borderRadius: RFPercentage(1),
    borderColor: COLOR.DARK_GREEN,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginTop: RFValue(10),
    backgroundColor: COLOR.WHITE,
  },
});

export default ForgotPassword = React.memo(ForgotPassword);
