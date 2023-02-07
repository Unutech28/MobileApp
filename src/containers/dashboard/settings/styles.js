import GLOBALS from "@constants";
const { STRINGS, COLOR, FONTS } = GLOBALS;
const { PRIMARY, WHITE, GREY, DARKGREY } = COLOR;
import { RFValue, RFPercentage } from "react-native-responsive-fontsize";
export default {
  homeContainer: {
    flex: 1,
  },
  touchableStyle: {
    // backgroundColor: "red",
    paddingHorizontal: RFValue(16),
    paddingVertical: RFValue(8),
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
  titleText: {
    fontFamily: FONTS.REGULAR,
    fontSize: RFValue(17),
    color: COLOR.SOFT_GRAY,
  },
  titleRightText: {
    fontFamily: FONTS.BOLD,
    fontSize: RFValue(17),
    color: "black",
  },
  outerContainer: {
    backgroundColor: COLOR.WHITE,
    flexGrow: 1,
    //paddingHorizontal: RFValue(10),
    // marginTop: RFValue(20),
  },
  ListView: {
    borderColor: "#6545B261",
    borderRadius: RFPercentage(1.5),
    marginTop: 10,
    backgroundColor: COLOR.WHITE,
    padding: 5,
  },
  rowContainer: {
    borderWidth: 0.5,
    flexDirection: "row",
    marginTop: RFPercentage(1.2),
    width: "90%",
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: RFValue(7),
    borderColor: GREY,
    overflow: "hidden",
    backgroundColor: COLOR.WHITE,
  },

  container: {
    backgroundColor: COLOR.WHITE,
    paddingHorizontal: 30,
  },

  container: {
    flex: 1,
    backgroundColor: COLOR.WHITE,
  },

  titleTextNotification: {
    fontFamily: FONTS.BOLD,
    fontSize: RFValue(16),
  },
  greenContainer: {
    height: RFValue(65),
    width: RFValue(90),
    overflow: "hidden",
  },
  textStyleNotification: {
    alignSelf: "center",
    paddingLeft: RFValue(13),
    fontFamily: FONTS.MEDIUM,
    fontSize: RFValue(RFValue(13)),
    color: COLOR.LIGHT_BLACK,
    fontWeight: "500",
    flex: 0.8,
  },
  arrowImage: { alignSelf: "center", flex: 0.2 },
  innerContainer: {
    padding: RFValue(20),
  },
  titleTextModal: {
    fontFamily: FONTS.BOLD,
    fontSize: RFValue(22),
    color: COLOR.SOFT_GRAY,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: RFValue(20),
  },
  radioButton: {},
  submitContainer: {
    flex: 1,
    justifyContent: "center",
    marginVertical: 20,
    padding: RFValue(20),
  },
};
