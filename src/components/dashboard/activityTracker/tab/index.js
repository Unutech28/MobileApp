// @ts-nocheck
import GLOBALS from "@constants";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  FlatList,
} from "react-native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import NoData from "@components/common/NoData";

const { FONTS, COLOR } = GLOBALS;
const {  DARK_GREEN, Tab_GREY } = COLOR;
const {  REGULAR } = FONTS;
function ScheduleTab(props) {
  let {
    setActiveTab,
    activeTab,
    badgeCount = "",
    tabList,
    customStyle = {},
    onPressTab = () => { },
  } = props;
  return (
    <View
      style={{
        borderBottomWidth: 0.3,
        borderBottomColor: COLOR.BOREDER_GRAY,
      }}
    >
      <FlatList
        horizontal
        contentContainerStyle={[styles.tabContainer, customStyle]}
        data={tabList}
        scrollEnabled={true}
        keyExtractor={(item) => `${item.id}`}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            key={index}
            onPress={() => setActiveTab(item.title)}
          >
            <View style={[styles.tab]}>
              <Text style={[styles.tabTitle]}>
                {activeTab === item.title
                  ? `${item.title}${badgeCount}`
                  : item.title}
              </Text>
              <View
                style={[
                  styles.horizontalRule,
                  {
                    borderBottomColor:
                      activeTab === item.title
                        ? DARK_GREEN
                        : COLOR.BOREDER_GRAY,
                    borderBottomWidth: activeTab === item.title ? 4 : 0,
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
    flexDirection: "row",
    flex: 1,
    justifyContent: "flex-start",
    marginTop: RFPercentage(1),
  },
  tab: {
    width: "100%",
    overflow: "hidden",
  },
  tabTitle: {
    fontFamily: REGULAR,
    fontSize: RFValue(15),
    paddingHorizontal: RFValue(10),
    color: Tab_GREY,
    fontWeight: "400",
  },
  horizontalRule: {
    marginTop: RFPercentage(1),
  },
});
export default (ScheduleTab = React.memo(ScheduleTab));
