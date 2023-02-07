import { StyleSheet, View } from 'react-native';
import GLOBALS from '@constants';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
const { FONTS, COLOR, STRINGS } = GLOBALS;
const { REGULAR } = FONTS;
const globalStyles = StyleSheet.create({
  homeContainer: {
    flex: 1,
  },
  botLoadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botLoadingTitle: {
    fontFamily: REGULAR,
    fontSize: RFValue(17),
    color: COLOR.blackGray,
    marginTop: RFValue(20),
  },
  /**ChatBox Container */
  boxShadow: {
    backgroundColor: 'white',
    shadowColor: COLOR.chatShadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8.14,
    elevation: 10,
  },
  containerLeft: {
    backgroundColor: COLOR.WHITE,
    padding: 5,
    borderBottomStartRadius: 1,
    marginLeft: RFValue(10),
  },
  leftChatText: {
    color: COLOR.chatText,
    fontSize: RFValue(13),
    fontFamily: FONTS.SEMI_BOLD,
  },
  containerRight: {
    backgroundColor: COLOR.DARK_GREEN,
    padding: 5,
    borderBottomEndRadius: 1,
    marginVertical: RFValue(5),
    //  marginRight:RFValue(10)
  },
  rightChatText: {
    color: COLOR.WHITE,
    fontSize: RFValue(13),
    fontFamily: FONTS.SEMI_BOLD,
  },
  composerText: {
    color: COLOR.BLACK,
    fontSize: RFValue(15),
    paddingStart: RFValue(5),
    lineHeight: RFValue(15),
    fontFamily: FONTS.MEDIUM,
    textAlignVertical: 'top',
    overflow: 'scroll',
  },
  inputPrimary: { maxHeight: RFValue(100), flexWrap: 'wrap' },
  sendContainer: {
    margin: 5,
  },

  bottomContainer: {
    position: 'absolute',
    bottom: 100,
    left: RFValue(8),
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    backgroundColor: 'white',
    //  maxHeight:RFValue(300)
  },
  touchableStyle: {
    width: '43%',
    flexDirection: 'row',
    paddingHorizontal: RFValue(10),
    paddingLeft: RFPercentage(1),
    borderWidth: 0.2,
    borderColor: COLOR.DARK_GREEN,
    borderRadius: 10,
    margin: RFValue(5),
    minHeight: RFValue(40),
    // alignItems: 'flex-start',
    alignItems: 'center',
    //flexWrap: 'wrap',
    //justifyContent: 'space-between',
  },
  boxShadow: {
    backgroundColor: 'white',
    shadowColor: COLOR.PRIMARY,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.14,
    elevation: 2,
  },
  btnText: {
    color: COLOR.btn_text,
    fontSize: RFValue(13),
    fontFamily: FONTS.MEDIUM,
    marginLeft: RFValue(3),
  },
  quickReplyContainer: {},
});

export default globalStyles;