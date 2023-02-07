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

const isiOS = Platform.OS == 'ios';
const { FONTS, COLOR, STRINGS } = GLOBALS;

var radioCurrentSelectedIndex = 0

function ReasonFeelBetter(props) {
  let {
    data,
    submitBtnClicked,
    isRefreshingAppointmentList,
    onRefreshAppointmentList,
    addToSelectedOptionsRadio,
  } = props;
  const [refresh, setRefresh] = useState(false, '');
  const [explain, setExplain] = useState('', '');
  const [radioItem, setRadioItem] = useState('', '');

  onRadioBtnClick = (index, item) => {
    radioCurrentSelectedIndex = index;
    setRadioItem(item.name)
    setRefresh(!refresh)
  }

  const onTextPlaceholderChange = (text, item) => {
    data.placeholders.forEach(element => {
      if (element._id == item._id) {
        element.answer = text
      }
    });
    setRefresh(!refresh)
  }

  return (
    <View style={{ flexGrow: 1, backgroundColor: COLOR.WHITE }}>
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        // extraScrollHeight={isIOS ? 0 : 80}
        style={styles.container}
      >
        <View>
          <Text style={{ fontSize: RFValue(24), color: COLOR.BLACK, fontFamily: FONTS.CIRCULAR_BOLD }}>{data.questions[0].question}</Text>
          <FlatList
            data={data.questions[0].ansOptions}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => `${item._id}`}
            extraData={refresh}
            renderItem={({ item, index }) => (
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                  style={{ flex: 0.1, justifyContent: 'center', padding: 10 }}
                  onPress={() => {
                    onRadioBtnClick(index, item);
                  }}>
                  <Image
                    source={
                      radioCurrentSelectedIndex == index ? ICONS.RadioCheckedBlack
                        : ICONS.RadioUnchecked
                    }
                    style={{ height: RFValue(20), width: RFValue(20) }}
                  />
                </TouchableOpacity>
                <View style={{ marginLeft: 10 }}>
                  <Text style={styles.reasonText}>{item.name}</Text>
                </View>

              </View>
            )}
          />
          {data.placeholders != undefined && radioItem == 'Others' ?
            <FlatList
              contentContainerStyle={{ flex: 1 }}
              data={data.placeholders}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => `${item._id}`}
              listKey={(index) => 'H' + index.toString()}
              style={{ width: '100%' }}
              renderItem={({ item, index }) => (
                <TextInput
                  style={{
                    height: RFValue(80),
                    borderColor: 'rgba(119, 131, 143, 0.2)',
                    borderWidth: 1,
                    borderRadius: 8,
                    backgroundColor: COLOR.grey_300,
                    paddingLeft: 10,
                    width: '100%',
                    marginTop: RFValue(20),
                    color: 'dark' ? 'black' : 'black'
                  }}
                  value={item.answer != undefined ? item.answer : item.value != undefined ? item.value.answer : ''}
                  placeholder={item.name}
                  placeholderTextColor={COLOR.BLACK}
                  maxLength={50}
                  underlineColorAndroid={'transparent'}
                  //onChangeText={explain => setExplain(explain)}
                  onChangeText={text => onTextPlaceholderChange(text, item)}
                />
              )}
            /> : null}

          {/* <TextInput
            style={{
              height: RFValue(80),
              borderColor: 'rgba(119, 131, 143, 0.2)',
              borderWidth: 1,
              borderRadius: 8,
              backgroundColor: 'rgba(119, 131, 143, 0.2)',
              paddingLeft: 10
            }}
            value={explain}
            placeholder={'Explain here...'}
            placeholderTextColor={COLOR.BLACK}
            maxLength={50}
            underlineColorAndroid={'transparent'}
            onChangeText={explain => setExplain(explain)}
          /> */}
          <ButtonBlue text='Submit' onBtnPress={() => submitBtnClicked(radioCurrentSelectedIndex)} />
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
    fontSize: RFValue(20),
    fontFamily: FONTS.CIRCULAR_MEDIUM,
    color: COLOR.BLACK,
    padding: 15
    // backgroundColor: 'red'
  },
});
export default ReasonFeelBetter = React.memo(ReasonFeelBetter);
