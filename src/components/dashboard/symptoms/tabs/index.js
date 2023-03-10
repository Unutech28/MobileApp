// @ts-nocheck
import GLOBALS from '@constants';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  FlatList,
} from 'react-native';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import NoData from '@components/common/NoData';

const isiOS = Platform.OS == 'ios';
const { FONTS, COLOR, STRINGS } = GLOBALS;
const { TEXT_ORANGE, GREY, PRIMARY } = COLOR;
const { LIGHT, REGULAR } = FONTS;
function ScheduleTab(props) {
  let {
    setActiveTab,
    activeTab,
    badgeCount = '',
    tabList,
    customStyle = {},
    onPressTab = () => { },
  } = props;
  return (
    <View style={{ borderBottomWidth: 0.3, borderBottomColor: COLOR.BOREDER_GRAY }}>
      <FlatList
        horizontal
        contentContainerStyle={[styles.tabContainer, customStyle]}
        data={tabList}
        scrollEnabled={true}
        keyExtractor={item => `${item.id}`}
        showsVerticalScrollIndicator={true}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => (

          <TouchableOpacity key={index}
            onPress={() => setActiveTab(item.title)}
          >
            <View style={{ marginRight: RFValue(8) }}>
              <View style={styles.tab}>
                <Text
                  style={[
                    styles.tabTitle,
                    {
                      // color: activeTab == item.title ? TEXT_ORANGE : GREY,
                      color: activeTab == item.title ? GREY : GREY,
                    },
                  ]}>
                  {activeTab == item.title ? `${item.title}${badgeCount}` : item.title}
                </Text>
              </View>
              <View
                style={[
                  styles.horizontalRule,
                  {
                    borderBottomColor: activeTab == item.title ? PRIMARY : 'transparent',
                    borderBottomWidth: activeTab == item.title ? 4 : 1,
                  },
                ]}
              />
            </View>
          </TouchableOpacity>

        )}
        ListEmptyComponent={<NoData />}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-start',
    //marginBottom: RFPercentage(3),
    marginTop: RFPercentage(1),
   // paddingLeft: 5

  },
  tab: {
    borderBottomWidth: 0,
    marginHorizontal: 5,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  tabTitle: {
    alignSelf: 'center',
    fontFamily: LIGHT,
    fontSize: RFValue(15),
    paddingLeft: RFValue(5)
  },
  horizontalRule: {
    borderBottomColor: 'transparent',
    borderBottomWidth: 1,
    //marginHorizontal: RFPercentage(0),
    marginTop: RFPercentage(1),
  },
});
export default (ScheduleTab = React.memo(ScheduleTab));
