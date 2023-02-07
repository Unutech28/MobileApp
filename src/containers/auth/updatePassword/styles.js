import { RFValue, RFPercentage } from "react-native-responsive-fontsize";
import GLOBALS from "@constants";
const { FONTS, COLOR, STRINGS } = GLOBALS;
const { WHITE, GREY, DARKGREY, LIGHT_GRAY } = COLOR;
export default {
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
}