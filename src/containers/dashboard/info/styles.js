import GLOBALS from '@constants';
const { STRINGS, SETTINGS_TABS, COLOR, FONTS } = GLOBALS;
import { Dimensions } from 'react-native';
import { RFValue, RFPercentage } from 'react-native-responsive-fontsize';
export default {
    homeContainer: {
        flex: 1,
        backgroundColor: COLOR.BACKGROUND,
      },
      mainView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        shadowColor: COLOR.SHADOW,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
        padding: RFValue(16),
        elevation: 5,
        borderRadius: RFValue(8),
        marginBottom: RFValue(8),
      },
      backgroundVideo: {
        // position: 'absolute',
        // top: 0,
        // left: 0,
        // bottom: 0,
        // right: 0,
        width: 300,
        height: 150,
        backgroundColor: 'blue',
    
      },
      pdfMainView: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 25,
      },
      pdfStyle: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
      },
}