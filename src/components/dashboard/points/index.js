/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable module-resolver/use-alias */
// @ts-nocheck
import GLOBALS from "@constants";
import * as Images from "@images";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  FlatList,
  RefreshControl,
} from "react-native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import NoData from "@components/common/NoData";
import moment from "moment";
import momentZone from "moment-timezone";
import ShadowView from "@components/common/ShadowView";
import { strings } from "@localization";
import "moment/locale/es";
import "moment/locale/en-gb";

let currentTimeZone = momentZone.tz.guess();
const { FONTS, COLOR } = GLOBALS;
const { GREY, DARK_GREEN } = COLOR;
function Info(props) {
  const {
    pointsList,
    goToDetail,
    isRefreshingAppointmentList,
    onRefreshAppointmentList,
    activeTab,
  } = props;
  const [data, setData] = useState(
    activeTab === strings.points.Daily
      ? pointsList?.dailypoints
      : activeTab === strings.points.Monthly
      ? pointsList?.monthlypoints
      : pointsList?.weeklypoints
  );

  useEffect(() => {
    setData(
      activeTab === strings.points.Daily
        ? pointsList?.dailypoints
        : activeTab === strings.points.Monthly
        ? pointsList?.monthlypoints
        : pointsList?.weeklypoints
    );
  });
  useEffect(() => {}, [data]);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={{ marginBottom: RFValue(60) }}>
        {data?.length ? (
          <FlatList
            data={data}
            extraData={data}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => `${index}`}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshingAppointmentList}
                onRefresh={() => onRefreshAppointmentList(activeTab, true)}
              />
            }
            renderItem={({ item, index }) => (
              <View key={index} style={[styles.mainView, {}]}>
                <View style={{ flex: 0.6, justifyContent: "center" }}>
                  {activeTab === strings.points.Weekly ? (
                    <Text style={styles.title}>
                      {moment(new Date(item.startDate))
                        .locale(strings.APP_INFO.momentLanguage)
                        .format("Do")}{" "}
                      {"-"}{" "}
                      {moment(item.endDate)
                        .locale(strings.APP_INFO.momentLanguage)
                        .format("Do MMM, YYYY")}
                    </Text>
                  ) : null}
                  {activeTab === strings.points.Daily ? (
                    <Text style={styles.title}>
                      {momentZone
                        .tz(item.date, currentTimeZone)
                        .locale(strings.APP_INFO.momentLanguage)
                        .format("Do MMM, YYYY")}
                    </Text>
                  ) : null}
                  {activeTab === strings.points.Monthly ? (
                    <Text style={styles.title}>
                      {moment(item.startDate)
                        .locale(strings.APP_INFO.momentLanguage)
                        .format("Do")}{" "}
                      {"-"}{" "}
                      {moment(item.endMonth)
                        .locale(strings.APP_INFO.momentLanguage)
                        .format("Do MMM, YYYY")}
                    </Text>
                  ) : null}
                </View>

                <View
                  style={{
                    flex: 0.4,
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    alignItems: "center",
                  }}
                >
                  <View style={{}}>
                    <Image
                      source={Images.pointIcon}
                      resizeMode="contain"
                      style={styles.capImage}
                    />
                  </View>
                  <View style={{}}>
                    <Text style={styles.pointsNumber}>
                      {activeTab === strings.points.Weekly
                        ? item.PointEarned
                        : null}
                      {activeTab === strings.points.Daily
                        ? item.PointEarned
                        : null}
                      {activeTab === strings.points.Monthly
                        ? item.PointEarned
                        : null}
                    </Text>
                  </View>
                </View>
                {/* </ShadowView> */}
              </View>
            )}
            ListEmptyComponent={<NoData />}
          />
        ) : (
          <Text
            style={{
              color: GREY,
              fontFamily: FONTS.REGULAR,
              fontSize: RFValue(18),
              alignSelf: "center",
            }}
          >
            {strings.points.No_data_found}
          </Text>
        )}
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOR.BACKGROUND,
    paddingHorizontal: RFValue(16),
    flexGrow: 1,
    // marginBottom: RFValue(70)
  },
  mainView: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "white",
    padding: RFValue(16),
    borderRadius: RFValue(8),
    marginBottom: RFValue(8),
    borderWidth: 0.5,
    borderColor: "#6545B2",

    shadowColor: COLOR.PRIMARY,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.7,
    // shadowRadius: 6,
    // elevation: 17,
    shadowRadius: Platform.OS == "ios" ? 6 : 3,
    elevation: Platform.OS == "android" ? 3 : 17,
  },
  capImage: {
    height: RFPercentage(2),
    width: RFPercentage(3),
    alignSelf: "center",
  },
  title: {
    color: "#454D58",
    fontFamily: FONTS.REGULAR,
    fontSize: RFValue(15),
    fontWeight: "700",
  },
  pointsNumber: {
    color: DARK_GREEN,
    fontFamily: FONTS.REGULAR,
    paddingLeft: 10,
    fontSize: RFValue(16),
    fontWeight: "700",
    textAlign: "center",
  },
});
export default Info = React.memo(Info);
