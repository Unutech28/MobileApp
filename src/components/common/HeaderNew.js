// @ts-nocheck
import GLOBALS from '@constants';
import * as ICONS from '@images';
import React, {useState} from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  View,
  StatusBar,
  Alert,
} from 'react-native';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import SearchBar from '@components/common/searchBar';
const {FONTS, COLOR, STRINGS} = GLOBALS;
const isiOS = Platform.OS == 'ios';
import Ionicons from 'react-native-vector-icons/Ionicons';

function HeaderNew(props) {
  let {
    isLeftIcon = false,
    onLeftIconClick = () => {},
    isTitle = false,
    title = '',
    isRightIcon = false,
    onRightIconClick = () => {},
    findText = () => {},
    isMiddleIcon = false,
    isRightImage = false,
    isLogout = true,
    logoutApi = () => {},
  } = props;

  const [isHeader, setisHeader] = useState(true);
  const logoutAlert = () => {
    Alert.alert(
      'Are you sure you want to logout?',
      '',
      [
        {
          text: 'Yes',
          onPress: () => {
            logoutApi();
          },
        },
        {
          text: 'No',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
      ],
      {cancelable: false},
    );
  };
  return (
    <View>
      {isHeader ? (
        <View>
          <StatusBar barStyle="light-content" />

          <Image
            source={ICONS.Bg}
            resizeMode="stretch"
            style={{
              tintColor: COLOR.PRIMARY1,
              height: RFPercentage(18),
              width: '100%',
            }}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              alignItems: 'center',
              position: 'absolute',
              paddingTop: RFValue(10),
              flex: 1,
              width: '100%',
            }}>
            {isLeftIcon ? (
              <TouchableWithoutFeedback onPress={() => onLeftIconClick()}>
                <View
                  style={[
                    styles.section,
                    {
                      flex: 0.2,
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingTop: isiOS ? RFValue(15) : 5,
                      marginTop: isTitle ? RFValue(10) : null,
                    },
                  ]}>
                  <Image
                    source={ICONS.LeftArrow}
                    resizeMode="contain"
                    style={styles.capImage}
                  />
                </View>
              </TouchableWithoutFeedback>
            ) : (
              <View style={{flex: 0.2}} />
            )}

            {isMiddleIcon == true ? (
              <View
                style={{
                  flex: 0.8,
                  alignContent: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                }}>
                <Image
                  source={ICONS.Sandy}
                  resizeMode="contain"
                  style={[styles.rightLogo, {marginTop: RFValue(20)}]}
                />
                <Image
                  source={ICONS.StellaWhite}
                  resizeMode="contain"
                  style={styles.logoStyle}
                />

                <Image
                  source={ICONS.stellaNurse}
                  resizeMode="contain"
                  style={[styles.rightLogo, {marginTop: RFValue(20)}]}
                />
              </View>
            ) : null}

            {isTitle == true ? (
              <View
                style={{
                  flex: 0.8,
                  paddingTop: RFValue(30),
                  alignContent: 'center',
                }}>
                <View style={styles.capTitle}>
                  <Text style={styles.capTitleText}>{title}</Text>
                </View>
              </View>
            ) : null}
            {isRightIcon == true ? (
              <TouchableWithoutFeedback
                onPress={() => {
                  setisHeader(!isHeader), onRightIconClick();
                }}>
                <View
                  style={[
                    styles.rightIcon,
                    {justifyContent: 'center', paddingTop: isiOS ? 0 : 10},
                  ]}>
                  <Image
                    source={ICONS.findIcon}
                    resizeMode="contain"
                    style={styles.check}
                  />
                </View>
              </TouchableWithoutFeedback>
            ) : null}

            {isRightImage == true ? (
              <Image
                source={ICONS.stellaNurse}
                resizeMode="contain"
                style={styles.rightLogo}
              />
            ) : null}
            {isLogout == true ? (
              <TouchableOpacity
                onPress={() => logoutAlert()}
                style={{
                  paddingTop: RFValue(30),
                  flex: 0.2,
                  alignItems: 'center',
                }}>
                {/* <AntDesign
                  name={'setting'}
                  size={25}
                  color={'#FFF'}
                  style={styles.capImage}
                /> */}
                {/* <Feather
                  name={'settings'}
                  size={25}
                  color={'#FFF'}
                  style={styles.capImage}
                /> */}
                <Ionicons
                  name={'ios-settings-outline'}
                  size={25}
                  color={'#FFF'}
                  style={styles.capImage}
                />
              </TouchableOpacity>
            ) : (
              <View style={{flex: 0.2}} />
            )}
          </View>
        </View>
      ) : (
        <SearchBar
          // isLeftIcon={true}
          isTitle={true}
          isRightIcon={true}
          onLeftIconClick={() => onLeftIconClick()}
          onRightIconClick={() => (setisHeader(!isHeader), onRightIconClick())}
          title=""
          findText={findText}
          isSearchActive={isHeader == false}
        />
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: RFPercentage(15),
    width: '100%',
    tintColor: COLOR.PRIMARY1,
  },
  rowLong: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: RFPercentage(18),
  },
  section: {
    flex: 0.5,
    overflow: 'hidden',
    paddingLeft: RFPercentage(2.5),
  },
  capTitle: {
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: RFPercentage(isiOS ? 0.8 : 1.2),
    overflow: 'hidden',
  },
  capImage: {
    height: RFPercentage(isiOS ? 4 : 5),
    width: RFPercentage(isiOS ? 4 : 5),
    alignSelf: 'flex-start',
    tintColor: COLOR.WHITE,
  },
  logoStyle: {
    height: RFPercentage(isiOS ? 10 : 5),
    width: RFPercentage(isiOS ? 10 : 5),
    marginTop: RFValue(20),
  },
  capTitleText: {
    fontFamily: FONTS.CIRCULAR_BOLD,
    fontSize: RFValue(isiOS ? 22 : 23),
    color: COLOR.WHITE,
    alignSelf: 'flex-start',
  },
  capTitleLong: {
    fontFamily: FONTS.REGULAR,
    fontSize: RFValue(isiOS ? 22 : 23),
    color: COLOR.WHITE,
    textAlign: 'left',
  },
  capTitleTextLong: {
    fontFamily: FONTS.REGULAR,
    fontSize: RFValue(isiOS ? 16 : 17),
    color: COLOR.WHITE,
    textAlign: 'left',
  },
  details: {
    flex: 1,
    paddingHorizontal: 0,
    overflow: 'hidden',
  },
  detailsText: {
    fontFamily: FONTS.LIGHT,
    fontSize: RFValue(16),
    color: COLOR.GREY,
  },
  shiftStyle: {
    fontFamily: FONTS.REGULAR,
    fontSize: RFValue(20),
    color: COLOR.DARKGREY,
    justifyContent: 'center',
    marginVertical: RFPercentage(2.5),
  },
  check: {
    height: RFPercentage(isiOS ? 3.5 : 4),
    width: RFPercentage(isiOS ? 3.5 : 4),
    alignSelf: 'center',
    tintColor: COLOR.WHITE,
  },

  rightLogo: {
    height: RFPercentage(isiOS ? 6 : 4),
    width: RFPercentage(isiOS ? 6 : 4),
    alignSelf: 'center',
  },
  rightIcon: {
    flex: 1,
  },
});

export default (HeaderNew = React.memo(HeaderNew));
