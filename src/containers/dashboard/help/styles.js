import GLOBALS from '@constants';
import { Dimensions } from 'react-native';
const { STRINGS, SETTINGS_TABS, COLOR, FONTS } = GLOBALS;
const { GREY, DARK_GREEN } = COLOR;
import { RFValue, RFPercentage } from 'react-native-responsive-fontsize';
const { width, height } = Dimensions.get('window');
export default{
    homeContainer: {
        flex: 1,
      },
      youtubeView: {
        alignSelf: 'stretch',
        height: height / 2,
        borderRadius: 10,
        margin: RFValue(10),
        marginTop: RFValue(50),
      },
      forwordImage: { height: RFValue(16), width: RFValue(16) },
      pdfStyle: {
        padding: 20,
        flex: 1,
        height: Dimensions.get('window').height,
        shadowOffset: { width: 1, height: RFValue(0.2) },
        shadowOpacity: 0.4,
        shadowRadius: RFValue(8),
        shadowColor: COLOR.DARK_GREEN,
        borderRadius: RFValue(10),
      },
    
      /**Vide CSS */
      rowContainer: {
        borderWidth: 0.5,
        flexDirection: 'row',
        marginTop: RFPercentage(1.2),
        width: '90%',
        marginLeft: 'auto',
        marginRight: 'auto',
        borderRadius: RFValue(7),
        borderColor: GREY,
        overflow: 'hidden',
        backgroundColor: COLOR.WHITE,
      },
      greenContainer: {
        height: RFValue(65),
        width: RFValue(90),
        overflow: 'hidden',
        backgroundColor: COLOR.DARK_GREEN,
      },
      textStyle: {
        alignSelf: 'center',
        paddingLeft: RFValue(13),
        fontFamily: FONTS.MEDIUM,
        fontSize: RFValue(isiOS ? RFValue(13) : RFValue(16)),
        color: COLOR.LIGHT_BLACK,
        fontWeight: '500',
        flex: 0.8,
      },
      arrowImage: { alignSelf: 'center', flex: 0.2 },
}