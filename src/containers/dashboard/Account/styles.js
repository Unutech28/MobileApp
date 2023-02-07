import GLOBALS from "@constants";
import Platform from "react-native";
const { STRINGS, COLOR, FONTS } = GLOBALS;
const { PRIMARY, WHITE, GREY, DARKGREY } = COLOR;
import { RFValue, RFPercentage } from "react-native-responsive-fontsize";
const isiOS = Platform.OS == "ios";
export default {
  homeContainer: {
    flex: 1,
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
  container: {
    flex: 1,
    backgroundColor: COLOR.WHITE,
  },
  outerContainer: {
    backgroundColor: WHITE,
    flex: 1,
    marginVertical: 20,
    paddingHorizontal: RFValue(20),
  },
  textContainer: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginTop: RFValue(32),
    marginLeft: RFValue(12),
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
    fontSize: RFValue(12),
    color: COLOR.WHITE,
    fontFamily: FONTS.BOLD,
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

  submitContainer: {
    justifyContent: "center",
    marginVertical: 20,
  },
  titleText: {
    fontFamily: FONTS.REGULAR,
    fontSize: RFValue(18),
    color: COLOR.SOFT_GRAY,
  },

  chatView: {
    // marginBottom: RFPercentage(1.5),
    paddingLeft: RFValue(10),
    // height: RFPercentage(7),
    width: "80%",
    justifyContent: "space-between",
    // marginTop: RFPercentage(2.5),

    fontSize: RFValue(14),
    fontFamily: FONTS.MEDIUM,
    // backgroundColor: WHITE,
  },
  ListView: {
    borderColor: "#6545B261",
    borderWidth: 1,
    borderRadius: RFPercentage(1.5),
    marginTop: 10,
    shadowColor: PRIMARY,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.46,
    shadowRadius: 11.14,
    elevation: 17,
    backgroundColor: WHITE,
    padding: 10,
    height: screenHeight / 3,
  },
  inputContainer: {
    // flex: 1,
    // borderWidth: 1,
    // borderRadius: 8,
    // borderColor: COLOR.DARK_GREEN,
    backgroundColor: COLOR.WHITE,
    paddingHorizontal: 5,
    borderWidth: 2,
    shadowColor: PRIMARY,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.46,
    shadowRadius: 11.14,
    elevation: 17,
    borderColor: "#6545B261",
    borderRadius: RFPercentage(1.5),
    height: RFValue(50),
    justifyContent: "center",
  },
  commentInput: {
    height: RFValue(50),
    color: COLOR.BLACK,
    // fontSize: 17,
    fontFamily: FONTS.MEDIUM,
    // textAlignVertical: "top",
    backgroundColor: COLOR.WHITE,
  },
  outerContainerProvider: {
    backgroundColor: WHITE,
    flexGrow: 1,
    height: "100%",
  },
  titleTextProvider: {
    fontFamily: FONTS.BOLD,
    fontSize: RFValue(22),
    color: COLOR.SOFT_GRAY,
  },

  inputContainerProvider: {
    // flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    // borderColor: COLOR.DARK_GREEN,
    backgroundColor: COLOR.WHITE,
    paddingHorizontal: 5,
  },
  commentInputProvider: {
    height: RFValue(50),
    color: "dark" ? DARKGREY : DARKGREY,
    // fontSize: 17,
    fontFamily: FONTS.MEDIUM,
    // textAlignVertical: "top",
    backgroundColor: COLOR.WHITE,
  },
  helperTextModal: {
    //  marginBottom: 20,
    color: COLOR.ERROR,
    marginTop: RFValue(8),
  },
};
