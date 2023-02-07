import GLOBALS from "@constants";
const { STRINGS, COLOR, FONTS } = GLOBALS;
import { RFValue } from 'react-native-responsive-fontsize'
export default {
    homeContainer: {
        flex: 1,
        backgroundColor: COLOR.BACKGROUND,
      },
    
      container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0D0D0D',
      },
      bedtimeText: {
        color: '#ff9800',
        marginLeft: 3,
        fontSize: 16,
      },
      wakeText: {
        color: '#ff9800',
        marginLeft: 3,
        fontSize: 16,
      },
      timeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // marginBottom: RFValue(5),
        marginTop: RFValue(10),
      },
      time: {
        alignItems: 'center',
        flex: 1,
      },
      timeHeader: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      timeValue: {
        color: 'black',
        fontSize: RFValue(24),
        fontWeight: '300',
      },
      sleepTimeContainer: {
        flex: 1,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
      totalHrStyle: {
        marginTop: RFValue(20),
        textAlign: 'center',
        fontSize: RFValue(16),
        fontFamily: FONTS.REGULAR,
      },
      timerContainer: {
        justifyContent: 'center',
        alignItems: 'flex-end',
        flexDirection: 'row',
      },
      timeText: {
        color: 'black',
        fontSize: 24,
        fontWeight: "300",
      },
      span: {
        marginLeft: 10,
      },
      text: {
        color: 'black',
        fontSize: 12,
        fontWeight: "300",
        marginBottom: 5,
      },
}