// @ts-nocheck
import Button from '@components/common/button';
import GLOBALS from '@constants';
import * as ICONS from '@images';
import moment from 'moment';
import React, { useCallback, useState, useEffect } from 'react';
import {
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  FlatList,
  View,
  RefreshControl,
  Image,
  TouchableOpacity,
} from 'react-native';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterailIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { CalendarList, LocaleConfig } from 'react-native-calendars';
import * as ImgIcons from '@images';
import CardView from '@components/dashboard/symptoms/cardView';
import NoData from '@components/common/NoData';
import Loader from '@components/common/screenLoader';
import BottomUp from '@components/common/BottomUp';
import ppdSymptoms from '../../../../containers/dashboard/weekInfoList/ppdSymptoms';

LocaleConfig.defaultLocale = 'en';
const isiOS = Platform.OS == 'ios';
const { FONTS, COLOR, STRINGS } = GLOBALS;
// const { TAKEDOSE, BOOK_APPT, VIDEOCALL, CONTACTS, MYLIST, WHOLE_TEAM, } = STRINGS;
const {
  GREEN,
  CINNABAR,
  WHITE,
  BLACK,
  CALENDAR_DISABLE,
  TEXT_ORANGE,
  PRIMARY,
  GREY,
  TABLET,
  BORDER_LIGHT,
  DARKGREY,
  TRANSPARENT,
  SHADOW
} = COLOR;
const { LIGHT, REGULAR, BOLD, EXTRA_LIGHT, SEMI_BOLD, MEDIUM, CIRCULAR_MEDIUM, CIRCULAR_BOLD } = FONTS;

const width = Dimensions.get('window').width - RFPercentage(6);
const getMaxDate = d => {
  var fm = moment(d).add(3, 'M');
  var fmEnd = moment(fm).endOf('month');
  var newDate =
    d.date() != fm.date() && fm.isSame(fmEnd.format('YYYY-MM-DD'))
      ? fm.add(1, 'd')
      : fm;
  return moment(newDate)
    .endOf('month')
    .format('YYYY-MM-DD');
};

function PpdSymptoms(props) {
  let {
    data,
    smallText,
    longText,
    isMore,
    moreClick
  } = props;
  return (
    <View style={{ flexGrow: 1 }}>
      <View style={{ flexGrow: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={true}
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}>
          <View>
            <Text style={legendStyle.heading}>{data.title}</Text>
            {isMore ?
              <Text style={legendStyle.title}>{data.description}</Text>
              :
              <Text style={legendStyle.title}>{data.shortDescription}</Text>
            }
            {!isMore ?
              <TouchableOpacity
                onPress={() => moreClick()}>
                <Text style={[legendStyle.title, { color: COLOR.TEXT_ORANGE }]}>More about symptoms of PPD +</Text>
              </TouchableOpacity>
              :
              <TouchableOpacity
                onPress={() => moreClick()}>
                <Text style={[legendStyle.title, { color: COLOR.TEXT_ORANGE }]}>Less Text-</Text>
              </TouchableOpacity>}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const legendStyle = StyleSheet.create({
  iconSize: 23,
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
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
  center: { justifyContent: 'center' },
  icon: { alignSelf: 'center', marginRight: RFPercentage(1) },
  title: {
    fontSize: RFValue(18),
    color: '#111111',
    fontFamily: CIRCULAR_MEDIUM,
    paddingBottom: RFValue(20)
  },
  heading: {
    color: COLOR.BLACK,
    fontSize: RFValue(24),
    fontFamily: CIRCULAR_BOLD,
    paddingBottom: RFValue(20)
  }
});
const styles = StyleSheet.create({
  container: {
    flexGrow: 1.2,
  },
});
export default PpdSymptoms = React.memo(PpdSymptoms);
//const { LIGHT, REGULAR, BOLD, EXTRA_LIGHT, SEMI_BOLD, MEDIUM, NEW_BOLD } = FONTS;