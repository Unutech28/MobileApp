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
  ScrollView
} from 'react-native';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import ButtonBlue from '@components/common/buttonBlue';
import ButtonGreen from '@components/common/buttonGreen';
import ButtonOrange from '@components/common/buttonOrange';

const isiOS = Platform.OS == 'ios';
const { FONTS, COLOR, STRINGS } = GLOBALS;

function AboutStella(props) {
  let {
    data,
    teamLoader,
    showMorePpdInfo,
  } = props;
  const [isContact, setContact] = useState(true);
  return (
    <View style={{ flexGrow: 1 }}>
      <View style={{ flexGrow: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={true}
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}>
          <View>
            <Text style={styles.blackBoldText}>{data.title}</Text>
            <Text style={styles.blackText}>{data.description}</Text>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  blackBoldText: {
    fontSize: RFValue(22),
    fontFamily: FONTS.CIRCULAR_BOLD,
    color: COLOR.BLACK,
    marginTop: RFValue(20),
    // backgroundColor: 'red'
  },
  blackText: {
    fontSize: RFValue(16),
    fontFamily: FONTS.CIRCULAR_MEDIUM,
    color: COLOR.BLACK,
    marginTop: RFValue(20),
    // backgroundColor: 'red'
  },
  orangeText: {
    marginTop: RFValue(30),
    fontSize: RFValue(16),
    fontFamily: FONTS.CIRCULAR_MEDIUM,
    color: COLOR.BACKGROUND_ORANGE,
  }
});
export default AboutStella = React.memo(AboutStella);
