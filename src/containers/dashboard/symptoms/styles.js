import GLOBALS from '@constants';
import { Dimensions } from 'react-native';
import { RFValue, RFPercentage } from 'react-native-responsive-fontsize';
const { FONTS, COLOR, URL } = GLOBALS;
const window = Dimensions.get('window');

export default {
    homeContainer: {
        flex: 1,
        backgroundColor: COLOR.BACKGROUND,
      }, 
      form: {
        padding: '2%',
        marginTop: '8%',
        marginLeft: '4%',
        width: '92%',
        height: 350,
        backgroundColor: 'rgba(0, 0, 0, 0.35)',
        position: 'absolute',
        borderRadius: 7,
      },
      input: {
        marginTop: '2%',
        padding: '2%',
        paddingTop: '5%',
        paddingBottom: '1%',
        borderBottomWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.25)',
        color: 'rgba(255, 255, 255, 0.5)',
      },
      title: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: '5%',
        marginBottom: '5%',
        color: 'rgba(255, 255, 255, 0.4)',
      },

      banner: {
        position: 'absolute',
        width: '100%',
        backgroundColor: 'rgba(40, 40, 40, 0.5)',
        // backgroundColor: 'red',
        marginTop: 20
      },
      body: {
        height: '100%',
        width: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        paddingTop: 0
      },
      footer: {
        position: 'absolute',
        marginTop: scrHeight - 210,
        width: '100%',
      },
      frame: {
        marginTop: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgb(20, 20, 20)',
        zIndex: -1,
      },
      message: {
        textAlign: 'center',
        color: '#FFF',
      },
      titleBarImage: {
        height: 60,
        width: window.width,
        backgroundColor: 'red'
      },
      titleBarView: {
        paddingTop: 5,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: "row",
        // marginTop: 5,
        flex: 1
      },
      backButtonStyle: {
        paddingLeft: 5,
        paddingRight: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5,
        flex: 0.1
      },
    
      HeaderTitleText: {
        textAlign: 'center',
        alignSelf: 'center',
        color: '#FFFF',
        fontSize: 18,
        flex: 0.8,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 40,
        marginBottom: 5,
      },
    
    
    
      homeContainerInd: {
        flex: 1,
        backgroundColor: COLOR.BACKGROUND,
        zIndex: 1,
      },

      wrapper: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
      },
      toolbar: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        height: 50,
      },
      toolbarLeft: {
        paddingLeft: 10,
        width: '30%',
      },
      toolbarCenter: {
        width: '40%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      },
      toolbarRight: {
        paddingRight: 10,
        width: '30%',
        flexDirection: 'row',
        justifyContent: 'flex-end',
      },
      toolbarButton: {
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 5,
        marginRight: 5,
        width: 50,
        height: 50,
        borderRadius: 20,
      },
      buttonImage: {
        width: 23,
        height: 23,
      },
      text: {
        fontSize: 12,
        color: 'rgba(60, 60, 60, 0.25)',
        marginTop: '85%',
      },
      arrowHelperButton: {
        backgroundColor: 'rgba(0, 0, 0, 0.15)',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 20,
        width: 40,
        height: 20,
        borderRadius: 20,
      },
      arrowHelperImage: {
        width: 16,
        height: 12,
        opacity: 0.3,
        marginTop: 20,
        marginBottom: 20,
      },
}