import { RFValue, RFPercentage } from "react-native-responsive-fontsize";
import GLOBALS from "@constants";
const { FONTS, COLOR, STRINGS } = GLOBALS;
const { WHITE, GREY, DARKGREY, LIGHT_GRAY } = COLOR;
export default {
  container: {
    flex: 1,
  },
  outerContainer: {
    backgroundColor: WHITE,
    paddingHorizontal: RFValue(10),
  },
  welcomeTitle: {
    fontFamily: FONTS.SEMI_BOLD,
    fontSize: RFValue(20),
    padding: RFValue(5),
    textAlign: 'center',
  },
  welcomeMsg: {
    fontFamily: FONTS.LIGHT,
    fontSize: RFValue(12),
    fontWeight: '400',
    color: '#313132',
    padding: RFValue(5),
  },
  submitContainer: {
    justifyContent: "center",
    marginVertical: 20,
  },
  fullScreen: {
    height: window.width / 1.2,
    width: '100%',
    borderRadius: RFValue(7),
    backgroundColor: COLOR.BACKGROUND,
    marginVertical: RFValue(5),
  },
  android: {
    height: window.width / 1,
    width: '95%',
    borderRadius: RFValue(7),
  },
}