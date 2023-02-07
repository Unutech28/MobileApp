import { ratio, screenWidth } from "../../../utils/Styles";
import GLOBALS from '@constants';
import { RFValue, RFPercentage } from 'react-native-responsive-fontsize';
const { FONTS, COLOR, URL } = GLOBALS;

export default {
    capImage: {
        height: RFPercentage(isiOS ? 4 : 5),
        width: RFPercentage(isiOS ? 4 : 5),
        alignSelf: 'flex-start',
      },
      section: {
        flex: 0.2,
        overflow: 'hidden',
        paddingLeft: RFPercentage(2.5),
        justifyContent: 'center',
        paddingTop: isiOS ? 2 : 5,
      },
      buttonView: {
        flex: 1,
        margin: RFValue(24),
        width: '100%',
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        bottom: RFValue(24),
      },
      content: { flex: 1, backgroundColor: COLOR.PRIMARY, height: 350, borderRadius: 4, borderColor: 'rgba(0, 0, 0, 0.1)' },
    
      container: {
        flex: 1,
        backgroundColor: "#455A64",
        flexDirection: "column",
        alignItems: "center",
      },
      titleTxt: {
        marginTop: 100 * ratio,
        color: "white",
        fontSize: 28 * ratio,
      },
      viewRecorder: {
        marginTop: 40 * ratio,
        width: "100%",
        alignItems: "center",
      },
      recordBtnWrapper: {
        flexDirection: "row",
      },
      viewPlayer: {
        marginTop: 60 * ratio,
        alignSelf: "stretch",
        alignItems: "center",
      },
      viewBarWrapper: {
        marginTop: 28 * ratio,
        marginHorizontal: 28 * ratio,
        alignSelf: "stretch",
      },
      viewBar: {
        backgroundColor: "#ccc",
        height: 4 * ratio,
        alignSelf: "stretch",
      },
      viewBarPlay: {
        backgroundColor: "white",
        height: 4 * ratio,
        width: 0,
      },
      playStatusTxt: {
        marginTop: 8 * ratio,
        color: "#ccc",
      },
      playBtnWrapper: {
        flexDirection: "row",
        marginTop: 40 * ratio,
      },
      btn: {
        borderColor: "white",
        borderWidth: 1 * ratio,
      },
      txt: {
        color: "white",
        fontSize: 14 * ratio,
        marginHorizontal: 8 * ratio,
        marginVertical: 4 * ratio,
      },
      txtRecordCounter: {
        marginTop: 32 * ratio,
        color: "white",
        fontSize: 20 * ratio,
        textAlignVertical: "center",
        fontWeight: "200",
        fontFamily: "Helvetica Neue",
        letterSpacing: 3,
      },
      txtCounter: {
        marginTop: 12 * ratio,
        color: "white",
        fontSize: 20 * ratio,
        textAlignVertical: "center",
        fontWeight: "200",
        fontFamily: "Helvetica Neue",
        letterSpacing: 3,
      },
}