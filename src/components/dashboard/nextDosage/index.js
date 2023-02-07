// @ts-nocheck
import Loader from '@components/common/screenLoader';
import GLOBALS from '@constants';
import * as ICONS from '@images';
import React, { useState } from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  FlatList,
  RefreshControl,
} from 'react-native';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import NoData from '@components/common/NoData';
const isiOS = Platform.OS == 'ios';
const { FONTS, COLOR, STRINGS } = GLOBALS;
const { TAKEDOSE } = STRINGS;

const DoseView = ({ item, id }) => {
  let labelTab = '',
    iconMed = '';
  switch (item.medType) {
    case 'tab':
      iconMed = ICONS.YellowCapsule;
      labelTab = 'Tablet';
      break;
    case 'syrup':
      iconMed = ICONS.PurpleCapsule;
      labelTab = 'Syrup';
      break;
    default:
      iconMed = ICONS.Capsule;
      labelTab = 'Capsule';
      break;
  }
  let subTitle = `1 ${labelTab}`;
  return (
    <TouchableWithoutFeedback onPress={() => { }} key={id}>
      <View style={styles.row}>
        <View style={[styles.section, { justifyContent: 'center' }]}>
          <Image
            source={iconMed}
            resizeMode="contain"
            style={styles.capImage}
          />
        </View>
        <View style={[styles.section, { flex: 3 }]}>
          <View style={styles.capTitle}>
            <Text style={styles.capTitleText}>{item.medicineName}</Text>
          </View>
          <View style={styles.details}>
            <Text style={styles.detailsText}>{subTitle}</Text>
          </View>
        </View>
        <View style={[styles.section, { justifyContent: 'center' }]}>
          <Image
            source={ICONS.CheckCircle}
            resizeMode="contain"
            style={styles.check}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};
let MedicineList = React.memo(({ shiftLabel = '', shiftData }) => {
  return (
    <View>
      <Text style={styles.shiftStyle}>{shiftLabel}</Text>
      <FlatList
        contentContainerStyle={{
          flexGrow: 1,
          marginBottom: RFPercentage(2.2),
        }}
        data={shiftData}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => <DoseView item={item} />}
        ListEmptyComponent={<NoData />}
      />
    </View>
  );
});
const RenderDose = React.memo(({ data, onRefresh, isDoseRefreshing }) => {
  if (data.length <= 0) {
    return <NoData />;
  }
  let counter = 1;
  let Morning = [],
    Evening = [],
    Afternoon = [];

  for (let i = 0; i < data.length; i++) {
    let item = data[i];
    if (item.isMorning) {
      Morning.push(item);
    }
    if (item.isAfternoon) {
      Afternoon.push(item);
    }
    if (item.isEvening) {
      Evening.push(item);
    }
  }
  let finalShift = [];
  return (
    <View>
      <Text
        style={{
          fontFamily: FONTS.LIGHT,
          fontSize: RFValue(isiOS ? 28 : 30),
          color: COLOR.TEXT_ORANGE,
          justifyContent: 'center',
        }}>
        {TAKEDOSE}
      </Text>
      {Morning.length >= 1 && (
        <MedicineList
          shiftData={Morning}
          shiftLabel={'Morning'}
          onRefresh={onRefresh}
          isDoseRefreshing={isDoseRefreshing}
        />
      )}
      {Afternoon.length >= 1 && (
        <MedicineList
          shiftData={Afternoon}
          shiftLabel={'Afternoon'}
          onRefresh={onRefresh}
          isDoseRefreshing={isDoseRefreshing}
        />
      )}
      {Evening.length >= 1 && (
        <MedicineList
          shiftData={Evening}
          shiftLabel={'Evening'}
          onRefresh={onRefresh}
          isDoseRefreshing={isDoseRefreshing}
        />
      )}
    </View>
  );
});
function NextDosage(props) {
  let {
    data,
    doseLoader,
    onRefreshDoseList,
    isDoseRefreshing,
    searchText,
    searchFiltered,
    searchActive,
  } = props;
  let doseData = Array.isArray(data)
    ? searchActive
      ? searchFiltered
      : data
    : null;
  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={isDoseRefreshing}
          onRefresh={() => onRefreshDoseList()}
        />
      }
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}>
      {doseLoader ? (
        <Loader loaderColor={'#000'} />
      ) : (
          <View style={{ flex: 1 }}>
            {doseData && (
              <RenderDose
                data={doseData}
                isDoseRefreshing={isDoseRefreshing}
                onRefresh={onRefreshDoseList}
              />
            )}
          </View>
        )}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOR.BACKGROUND,
    marginHorizontal: RFPercentage(2),
    paddingHorizontal: RFPercentage(0.5),
    flexGrow: 1,
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
  section: {
    flex: 1,
    height: RFPercentage(isiOS ? 11 : 12.2),
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  capTitle: {
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: 0,
    overflow: 'hidden',
  },
  capImage: {
    height: RFPercentage(7),
    width: RFPercentage(7),
    alignSelf: 'center',
  },
  capTitleText: {
    fontFamily: FONTS.REGULAR,
    fontSize: RFValue(20),
    color: COLOR.DARKGREY,
    justifyContent: 'center',
  },
  details: {
    flex: 1,
    paddingHorizontal: 0,
    overflow: 'hidden',
  },
  detailsText: {
    fontFamily: FONTS.LIGHT,
    fontSize: RFValue(isiOS ? 16 : 17),
    color: COLOR.GREY,
  },
  shiftStyle: {
    fontFamily: FONTS.REGULAR,
    fontSize: RFValue(20),
    color: COLOR.DARKGREY,
    justifyContent: 'center',
    marginTop: RFPercentage(isiOS ? 2 : 2),
    marginBottom: RFPercentage(isiOS ? 1.2 : 2),
  },
  check: { height: RFPercentage(5), width: RFPercentage(5), alignSelf: 'center' },
});
export default NextDosage = React.memo(NextDosage);
