import GLOBALS from "@constants";
const { STRINGS, COLOR, FONTS } = GLOBALS;
import { RFValue } from "react-native-responsive-fontsize";
export default {
  homeContainer: {
    flex: 1,
    backgroundColor: COLOR.WHITE,
  },
  outerContainer: {
    flex: 1,
    marginBottom: 0,
  },
  /**SliderStyling */
  thumb: {
    width: Platform.OS == "android" ? RFValue(33) : 35,
    height: Platform.OS == "android" ? RFValue(33) : 35,
    borderRadius: 20,
    backgroundColor: COLOR.DARK_GREEN,
    borderColor: COLOR.LIGHT_SHADOW_GREEN,
    // borderColor: '#d2eaea',
    borderWidth: 6,
    shadowColor: COLOR.PRIMARY,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    shadowOpacity: 0.35,
  },
  track: {
    height: 5,
    marginHorizontal: RFValue(10),
    borderRadius: 4,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 1,
    shadowOpacity: 0.15,
    zIndex: 200,
  },
  cardNumberStyle: {
    // position: "absolute",
    right: RFValue(10),
    // top: RFValue(12),
  },
  CardNumberText: {
    color: COLOR.DARK_GREEN,
    fontFamily: FONTS.BOLD,
  },
  sectionName: {
    color: COLOR.DARK_GREEN,
    fontSize: RFValue(20),
    fontFamily: FONTS.MEDIUM,
    marginLeft: RFValue(5),
    // marginTop: RFValue(25),
    // marginBottom: RFValue(10),
    fontWeight: "700",
  },
  bubbles: {
    // backgroundColor: 'rgba(73, 166, 148,1)',
    backgroundColor: COLOR.DARK_GREEN,
    height: Platform.OS == "android" ? RFValue(4) : RFValue(3.5),
    width: Platform.OS == "android" ? RFValue(4) : RFValue(3.5),
    borderRadius: RFValue(5),
    opacity: 8,
  },
  bubbleView: {
    position: "absolute",
    top: Platform.OS == "android" ? RFValue(15) : "45%",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: RFValue(10),
  },
};
