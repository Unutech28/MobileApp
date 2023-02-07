import NoData from '@components/common/NoData';
import Loader from '@components/common/screenLoader';
import GLOBALS from '@constants';
import * as ICONS from '@images';
import React, { useState } from 'react';
import {
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
  RefreshControl,
  TouchableOpacity,
  ScrollView,
  TextInput
} from 'react-native';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ButtonBlue from '@components/common/buttonBlue';
import ButtonGreen from '@components/common/buttonGreen';


const isiOS = Platform.OS == 'ios';
const { FONTS, COLOR, STRINGS } = GLOBALS;

function StellaTracker(props) {
  let {
    data,
    submitBtnClicked,
    isRefreshingAppointmentList,
    onRefreshAppointmentList,
    addToSelectedOptionsRadio,
    raesonData
  } = props;
  const [refresh, setRefresh] = useState(false, '');
  const [explain, setExplain] = useState('', '');

  // onRadioBtnClick = (index) => {
  //   raesonData.forEach(element => {
  //     if (element._id == index) {
  //       element.isExpanded = true
  //     } else {
  //       element.isExpanded = false
  //     };
  //   });
  //   setRefresh(!refresh)
  // }

  const onTextAnswerChange = (text, item) => {
    raesonData.questions.forEach(element => {
      if (element._id == item._id) {
        element.answer = text
      }
    });
    setRefresh(!refresh)
  }

  return (
    <View style={{ flexGrow: 1, backgroundColor: COLOR.red, }}>
      <KeyboardAwareScrollView
        style={styles.container}
      // showsVerticalScrollIndicator={false}
      >
        <View>
          <Image
            source={
              ICONS.NurseComb
            }
            resizeMode='contain'
            style={{ alignSelf: 'center' }}
          />
          <FlatList
            data={raesonData.questions}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => `${item._id}`}
            extraData={refresh}
            // style={{backgroundColor:'red'}}
            renderItem={({ item, index }) => (
              <View style={{ backgroundColor: COLOR.PRIMARY1, marginVertical: 8, borderRadius: RFValue(8), padding: 10 }}>
                <Text style={styles.reasonText}>{item.question}</Text>
                <TextInput
                  style={{
                    height: RFValue(80),
                    borderColor: COLOR.WHITE,
                    borderWidth: 1,
                    borderRadius: RFValue(4),
                    paddingLeft: RFValue(10),
                    marginTop: RFValue(10),
                    color: 'dark' ? COLOR.WHITE : COLOR.WHITE
                  }}
                  value={item.answer != undefined ? item.answer.answer != undefined ? item.answer.answer : item.answer : ''}
                  placeholder={'Write here...'}
                  placeholderTextColor={COLOR.WHITE}
                  maxLength={50}
                  underlineColorAndroid={'transparent'}
                  onChangeText={text => onTextAnswerChange(text, item)}
                />
              </View>
            )}
          />
          <ButtonGreen text='Submit' onBtnPress={() => submitBtnClicked(raesonData)} />
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    backgroundColor: COLOR.BACKGROUND,
    flexGrow: 1,
  },
  scene: {
    flex: 1,
    padding: ""
  },
  expandableVw: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: "center",
    // backgroundColor: 'red',
    margin: 10,
  },
  plusBtn: {
    width: RFValue(20),
    height: RFValue(20),
    justifyContent: 'center',
    alignItems: 'center'
  },
  blackBoldText: {
    fontSize: RFValue(22),
    fontFamily: FONTS.BOLD,
    color: COLOR.BLACK,
    marginTop: RFValue(20),
    // backgroundColor: 'red'
  },
  blackText: {
    fontSize: RFValue(16),
    fontFamily: FONTS.MEDIUM,
    color: COLOR.BLACK,
    // backgroundColor: 'red'
  },

  reasonText: {
    fontSize: RFValue(18),
    fontFamily: FONTS.CIRCULAR_BOLD,
    color: COLOR.WHITE,
    // padding: 15
    // backgroundColor: 'red'
  },
});
export default StellaTracker = React.memo(StellaTracker);
