import GLOBALS from "@constants";
const { STRINGS, COLOR, FONTS } = GLOBALS;
import { Dimensions } from "react-native";
export default{
    homeContainer: {
        flex: 1,
        backgroundColor: COLOR.BACKGROUND,
        // backgroundColor: '#6EC592'
      },
      pdfMainView: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        marginTop: 10,
        marginBottom: 20,
      },
      pdfStyle: {
        flex: 1,
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
      },
}