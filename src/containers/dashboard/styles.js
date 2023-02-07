import { Dimensions } from "react-native"

export default{
    homeContainer: {
        flex: 1,
      },
      acceptStyle: {
        padding: 10,
        backgroundColor: 'green',
        borderColor: 'green',
        borderWidth: 1,
        borderRadius: 20,
        margin: 5,
      },
      declineStyle: {
        padding: 10,
        backgroundColor: 'red',
        borderColor: 'red',
        borderWidth: 1,
        borderRadius: 20,
        margin: 5,
      },
      textStyle: { color: '#FFF', paddingLeft: 10, paddingRight: 10 },
      viewStyle: {
        marginTop: 30,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
      },
      mainViewStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: Dimensions.get('window').width / 1.5,
      },
}