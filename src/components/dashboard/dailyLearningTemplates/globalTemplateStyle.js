import { StyleSheet } from "react-native";
import GLOBALS from "@constants";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
const { FONTS, COLOR, STRINGS } = GLOBALS;
const { SOFT_GRAY } = COLOR;
const { REGULAR } = FONTS;
const tempStyle = StyleSheet.create({
  outerContainer: {
    flex: 1,
    paddingHorizontal: 10,
    justifyContent: "space-between",
    margin: RFValue(10),
    backgroundColor: COLOR.WHITE,
  },

  /**Cards Styling */
  cardTitle: {
    fontSize: RFValue(25),
    fontFamily: FONTS.MEDIUM,
    color: COLOR.BLACK,
    // marginTop: RFValue(25),
    marginBottom: RFValue(5),
    fontWeight: "700",
  },
  cardDescription: {
    fontSize: RFValue(15),
    fontFamily: FONTS.BOLD,
    color: COLOR.BLACK,
    marginBottom: RFValue(30),
  },
  cardImageContainer: {
    width: "100%",
    // height: RFValue(180),
    alignItems: "center",
    //justifyContent: 'center',
    //alignItems: 'center',
    borderRadius: RFValue(10),
    flex: 1,
    justifyContent: "center",
  },
  cardImage: {
    borderRadius: RFValue(10),
    width: "100%",
    // height: "100%",
    minHeight: RFValue(190),
    maxHeight: RFValue(200),
    borderRadius: RFValue(10),
  },
  /**Struggles Template 2 */
  cardsubTitle: {
    fontSize: RFValue(17),
    fontFamily: FONTS.MEDIUM,
    color: COLOR.BLACK,
    marginVertical: RFValue(10),
    fontWeight: "500",
  },
  titleMargin: {
    marginBottom: RFValue(15),
  },
  quesFont: {
    fontSize: RFValue(15),
    marginBottom: RFValue(20),
    fontWeight: "600",
  },
  queTextInputStyle: {
    fontSize: RFValue(13),
    fontFamily: FONTS.REGULAR,
    color: COLOR.BLACK,
    borderColor: COLOR.GREY,
    borderBottomWidth: 0.5,
    paddingBottom: 5,
    flex: 0.9,
    fontWeight: "500",
    textAlignVertical: "top",
  },
  queTextInputAreaStyle: {
    fontSize: RFValue(12),
    fontFamily: FONTS.REGULAR,
    color: COLOR.BLACK,
    borderColor: COLOR.GREY,
    borderWidth: 0.5,
    padding: 10,
    flex: 1,
    height: RFValue(80),
    borderRadius: RFValue(5),
    fontWeight: "500",
    textAlignVertical: "top",
    // paddingLeft: 10,
  },
  quesBullet: {
    alignSelf: "center",
    fontSize: RFValue(12),
    fontFamily: FONTS.LIGHT,
    color: COLOR.BLACK,
    flex: 0.09,
  },
  submitContainer: {
    flex: 1,
    justifyContent: "center",
    marginVertical: 20,
    // bottom: 0,
    // position: 'absolute'
  },
  /**Radio */
  radioButton: {
    height: RFValue(40),
  },
  radioOption: {
    //  flex: 0.9,
    fontSize: RFValue(13),
    fontFamily: FONTS.MEDIUM,
    color: COLOR.BLACK,
    fontWeight: "400",
    paddingBottom: 10,
  },
  radioOptionNew: {
    fontSize: RFValue(15),
    fontFamily: FONTS.MEDIUM,
    color: COLOR.BLACK,
    fontWeight: "700",
    paddingBottom: 10,
  },
  ansContainer: {
    backgroundColor: COLOR.DARK_GREEN,
    borderRadius: 10,
    padding: RFValue(12),
  },
  ansContent: {
    color: COLOR.WHITE,
    fontFamily: FONTS.MEDIUM,
    fontSize: RFValue(14),
  },
  /**Checkbox */
  checkButton: {
    //  flex: 0.15,
    // height: RFValue(40),
  },
  checkButtonNew: {
    // flex: 0.15,
    //  height: RFValue(40),
    // backgroundColor: "black"
  },
  optionImage: {
    height: RFValue(25),
    width: RFValue(30),
  },
  checkboxOption: {
    flex: 0.9,
    fontSize: RFValue(13),
    fontFamily: FONTS.MEDIUM,
    color: COLOR.BLACK,
    fontWeight: "400",
    paddingBottom: 7,
    paddingLeft: 5,
  },
  checkboxOptionNew: {
    // flex: 0.9,
    fontSize: RFValue(15),
    fontFamily: FONTS.MEDIUM,
    color: COLOR.BLACK,
    fontWeight: "700",
    paddingBottom: 7,
    // paddingLeft: 5,
  },
  /**Template 3 Expandable Contet */
  expandHeading: {
    fontSize: RFValue(17),
    fontFamily: FONTS.MEDIUM,
    color: COLOR.BLACK,
    paddingVertical: RFValue(12),
    fontWeight: "800",
    paddingRight: 20,
    width: "90%",
  },
  expandContainerInner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // paddingHorizontal: RFValue(10)
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: RFValue(10),
  },
  expandContainer: {
    borderWidth: 1,
    paddingHorizontal: RFValue(10),
    borderRadius: 5,
    borderColor: COLOR.DARK_GREEN,
    marginBottom: RFValue(20),
  },
  boxShadow: {
    backgroundColor: "white",
    shadowColor: COLOR.DARK_GREEN,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8.14,
    elevation: 10,
  },
  tFourSubHeading: {
    fontWeight: "700",
    fontSize: RFValue(20),
    fontFamily: REGULAR,
    color: SOFT_GRAY,
    marginBottom: RFValue(20),
    textTransform: "capitalize",
  },

  /**Video COntainer */
  backgroundVideo: {
    borderRadius: 10,
    height: RFValue(200),
    width: "100%",
    backgroundColor: COLOR.BLACK,
  },
  videoTitle: {
    fontFamily: REGULAR,
    color: SOFT_GRAY,
    fontSize: RFValue(18),
    fontWeight: "700",
    alignSelf: "flex-start",
    paddingBottom: 10,
  },
  youtubeView: {
    alignSelf: "stretch",
    height: 300,
    borderRadius: 10,
    marginVertical: RFValue(15),
    backgroundColor: "white",
  },
  audioElement: {
    height: 0,
    width: 0,
  },
});

export default tempStyle;
