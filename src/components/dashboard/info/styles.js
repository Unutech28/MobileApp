import GLOBALS from "@constants";
const { FONTS, COLOR, STRINGS } = GLOBALS;

export default {
    container: {
        backgroundColor: COLOR.BACKGROUND,
        paddingHorizontal: RFValue(16),
        flexGrow: 1,
      },
      mainView: {
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "white",
        shadowColor: COLOR.SHADOW,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
        padding: RFValue(16),
        elevation: 5,
        borderRadius: RFValue(8),
        marginBottom: RFValue(8),
      },
}