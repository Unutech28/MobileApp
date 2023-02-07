import GLOBALS from '@constants';
const {COLOR} = GLOBALS;
import { RFValue, RFPercentage } from 'react-native-responsive-fontsize';
export default {
    homeContainer: {
        flex: 1,
        backgroundColor: COLOR.BACKGROUND,
      },
      title: {
        fontFamily: BOLD,
        fontSize: RFValue(18),
        color: COLOR.BLACK,
        marginVertical: RFValue(10),
        // textAlign: 'center',
      },
      no_result: {
        fontFamily: REGULAR,
        fontSize: RFValue(14),
        color: COLOR.BLACK,
        marginTop: RFValue(20),
        textAlign: 'center',
      },
}