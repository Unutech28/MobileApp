// @ts-nocheck
import Button from '@components/common/button';
import GLOBALS from '@constants';
import * as ICONS from '@images';
import moment from 'moment';
import React, { useState, useEffect } from 'react';
import {
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  FlatList,
  View,
  Image,
  Alert,
} from 'react-native';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import { alertWithOneBtn } from '@helpers/common';
import { LocaleConfig } from 'react-native-calendars';
import * as ImgIcons from '@images';
import NoData from '@components/common/NoData';
import Loader from '@components/common/screenLoader';
import BottomUp from '@components/common/BottomUp';
import CustomButton from '@components/common/customButton';
import commonStyles from '../commonStyles';
import { strings } from '@localization';

const isiOS = Platform.OS == 'ios';
const { FONTS, COLOR, STRINGS, PRODUCT_TYPE } = GLOBALS;
const {
  DARK_GREEN,
} = COLOR;
const { LIGHT, REGULAR } = FONTS;
const width = Dimensions.get('window').width - RFPercentage(6);

function MoodTracker(props) {
  let {
    appointmentLoading,
    saveMood,
    moodData,
  } = props;

  const [isRefresh, setRefresh] = useState(false);
  const [moodId, setMoodId] = useState();
  const [selectedMoodData, setSelectedMoodData] = useState();

  console.log('moodData', moodData)
  onMoodClick = item => {
    setMoodId(item.id);
    setSelectedMoodData(item)
    moodData.forEach(element => {
      if (element.id == item.id) {
        element.isClickTrue = true;
      } else {
        element.isClickTrue = false;
      }
    });
  };

  return (
    <View style={{ flexGrow: 1 }}>
      {appointmentLoading ? (
        <Loader loaderColor={'#000'} />
      ) : (
        <View style={{ flexGrow: 1 }}>
          <ScrollView
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}>
            <View>
              <View>
                  <View>
                    <View
                      style={{
                        marginTop: RFPercentage(4),
                      }}>
                      <Text style={styles.heading}> {PRODUCT_TYPE == "CU002" ? strings.mood.titleCU002 : strings.mood.title}</Text>
                      <FlatList
                        contentContainerStyle={{
                          flexGrow: 1,
                          marginBottom: RFPercentage(2.2),
                        }}
                        data={moodData}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={item => `${item._id}`}
                        extraData={isRefresh}
                        renderItem={({ item, index }) => (
                          <TouchableWithoutFeedback
                            onPress={() => onMoodClick(item)}>
                            <View style={legendStyle.flexRow} key={index}>
                              {item.isClickTrue ? (
                                <Image
                                  style={{
                                    height: RFPercentage(6),
                                    width: RFPercentage(6),
                                  }}
                                  source={item.activeImage}
                                />
                              ) : (
                                <Image
                                  style={{
                                    height: RFPercentage(6),
                                    width: RFPercentage(6),
                                  }}
                                  source={item.image}
                                />
                              )}
                              <Text style={styles.moodName}>{item.name}</Text>
                            </View>
                          </TouchableWithoutFeedback>
                        )}
                        ListEmptyComponent={<NoData />}
                      />
                    </View>

                    <View
                      style={[
                        commonStyles.buttonWrapper,
                        styles.buttonWrapper,
                      ]}>
                      <CustomButton
                        text={strings.mood.next}
                        // loader={isPostSymptomLoading}
                        colors={
                          moodId !== undefined ||
                            moodData?.some(e => e.isClickTrue === true)
                            ? [
                              // COLOR.PRIMARY,
                              COLOR.DARK_GREEN,
                              COLOR.DARK_GREEN,
                            ]
                            : [COLOR.WHITE, COLOR.WHITE, COLOR.WHITE]
                        }
                        buttonStyle={{
                          borderWidth:
                            moodId !== undefined ||
                              moodData?.some(e => e.isClickTrue === true)
                              ? 0
                              : 3,
                          borderColor: DARK_GREEN,
                        }}
                        buttonText={{
                          color:
                            moodId !== undefined ||
                              moodData?.some(e => e.isClickTrue === true)
                              ? COLOR.WHITE
                              : COLOR.BLACK,
                        }}
                        onBtnPress={() => {
                          let selectedMoodId;
                          if (moodId !== undefined) {
                            selectedMoodId = moodId;
                          } else {
                            moodData.forEach(element => {
                              if (element.isClickTrue === true) {
                                selectedMoodId = element.id;
                              }
                            });
                          }
                          if (selectedMoodId !== undefined) {
                            saveMood({selectedMoodData});
                          } else {
                            Alert.alert(strings.mood.mood_validation);
                            alertWithOneBtn(
                              strings.mood.mood_validation,
                              '',
                              GLOBALS.STRINGS.LOGOUT_OK,
                            );
                          }
                        }}
                      />
                    </View>
                  </View>
              </View>
            </View>
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const legendStyle = StyleSheet.create({
  iconSize: 23,
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: RFValue(15),
  },
  center: { justifyContent: 'center' },
  icon: { alignSelf: 'center', marginRight: RFPercentage(1) },
  title: { fontSize: RFValue(14), alignSelf: 'center', fontFamily: LIGHT },
});

const styles = StyleSheet.create({
  container: {
    flexGrow: 1.2,
  },
  buttonWrapper: {
    marginTop: RFPercentage(5),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    marginBottom: RFPercentage(isiOS ? 1.5 : 2),
    borderRadius: RFPercentage(1.8),
    shadowColor: COLOR.SHADOW,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.6,
    shadowRadius: 1,
    padding: 1,
    elevation: 5,
  },
  heading: {
    fontSize: RFValue(20),
    fontFamily: REGULAR,
    fontWeight: 'bold',
    color: COLOR.SOFT_GRAY,
    marginBottom: RFPercentage(5),
  },
  moodName: {
    fontSize: RFValue(16),
    fontFamily: REGULAR,
    paddingLeft: RFValue(16),
    fontWeight: '600',
    color: COLOR.BLACK,
  },
});
export default (MoodTracker = React.memo(MoodTracker));