
import GLOBALS from '@constants';
const {COLOR} = GLOBALS;
export default{
    homeContainer: {
        flex: 1,
        backgroundColor: COLOR.BACKGROUND,
      },
      titleStyle: {
        fontSize: RFValue(28),
        paddingTop: RFValue(10),
      },
      innerWrapper: {
        paddingHorizontal: RFValue(20),
        marginTop: RFPercentage(4),
      },
      text: {
        fontSize: RFValue(20),
        fontFamily: REGULAR,
        fontWeight: 'bold',
        color: '#313132',
        marginBottom: RFPercentage(2),
      },
      daysStyle: {
        flexDirection: 'row',
        display: 'flex',
        justifyContent: 'space-around',
      },
      daysName: {
        fontSize: RFValue(18),
        fontWeight: '700',
        lineHeight: RFValue(50),
        alignSelf: 'center',
      },
      buttonWrapper: {
        width: '40%',
        alignSelf: 'flex-end',
        marginTop: RFPercentage(15),
        marginRight: RFValue(20),
      },
      graph: {
        marginTop: RFPercentage(5),
        overflow: 'hidden',
        width: '93%',
        marginLeft: 'auto',
        marginRight: 'auto',
      },
}