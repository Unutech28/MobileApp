import NoData from "@components/common/NoData";
import Loader from "@components/common/screenLoader";
import GLOBALS from "@constants";
import * as ICONS from "@images";
import * as Images from "@images";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
} from "react-native";
import { strings } from "@localization";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
const isiOS = Platform.OS == "ios";
const { FONTS, COLOR } = GLOBALS;

const CardView = ({ item, onClick, goToChat }) => {
  const { user } = item;
  return (
    <View style={styles.row}>
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: user.image_path,
          }}
          resizeMode="contain"
          style={styles.capImage}
        />
      </View>
      <View style={[styles.section]}>
        <View>
          <View style={{ flexDirection: "row", paddingTop: 2 }}>
            <Text style={styles.capTitleText}>
              {user !== undefined ? user.firstName : ""}
            </Text>
          </View>
          <View style={styles.details}>
            <Text style={styles.detailsText}>{user.profession}</Text>
          </View>
        </View>

        {user.islive ? (
          <View
            style={{
              flexDirection: "row",
              overflow: "hidden",
            }}
          >
            <TouchableOpacity onPress={() => goToChat(user)}>
              <Image
                resizeMode={"contain"}
                source={Images.chatIcon}
                style={{ height: 35, width: 30 }}
              />
            </TouchableOpacity>
            {
              <TouchableOpacity
                onPress={() => onClick(user["_id"])}
                style={{ marginLeft: RFValue(15) }}
              >
                <Image
                  resizeMode={"contain"}
                  source={Images.chatIcon}
                  style={{ height: 35, width: 30 }}
                  source={Images.appointmentIcon}
                />
              </TouchableOpacity>
            }
          </View>
        ) : null}
      </View>
    </View>
  );
};

function CareTeam(props) {
  let {
    data,
    teamLoader,
    onPressCard,
    onRefreshCareList,
    isCareTeamRefreshing,
    goToChat,
  } = props;

  return (
    <View style={styles.container}>
      {teamLoader ? (
        <Loader />
      ) : data ? (
        <View style={[styles.scene]}>
          <View style={styles.tabContainer}>
          </View>
          <View style={{ marginTop: RFValue(0) }}>
            <FlatList
              contentContainerStyle={{ marginBottom: RFValue(40) }}
              data={data}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => `${item._id}`}
              refreshControl={
                <RefreshControl
                  refreshing={isCareTeamRefreshing}
                  onRefresh={() => onRefreshCareList()}
                />
              }
              renderItem={({ item }) => (
                <CardView
                  item={item}
                  onClick={onPressCard}
                  goToChat={goToChat}
                />
              )}
              ListEmptyComponent={
                <View style={styles.centerAlign}>
                  <Text style={styles.defaut_txt}>
                    {strings.careTeam.no_text}
                  </Text>
                </View>
              }
            />
          </View>
        </View>
      ) : (
        <NoData />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    flex: 0.33,
    margin: -5,
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: 1,
    borderColor: COLOR.BORDER_COLOR,
  },
  iconTop: { alignSelf: "flex-start" },
  bottomContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: RFPercentage(2),
  },
  bottomTitle: {
    fontFamily: FONTS.LIGHT,
    fontSize: RFValue(15),
    color: COLOR.CERULEAN,
  },
  scene: {
    flex: 1,
  },
  container: {
    backgroundColor: COLOR.BACKGROUND,
    marginHorizontal: RFPercentage(2),
    paddingHorizontal: RFPercentage(0.5),
    flexGrow: 1,
    // marginBottom: RFValue(40)
  },
  row: {
    flex: 1,
    flexDirection: "row",
    height: RFValue(90),
    // justifyContent: "space-between",
    backgroundColor: COLOR.WHITE,
    marginBottom: RFPercentage(isiOS ? 1.5 : 2),
    borderRadius: RFPercentage(1),
    shadowColor: COLOR.SHADOW,
    shadowOffset: { width: 0, height: 5 },
    // shadowOpacity: 0.6,
    // shadowRadius: 1,
    padding: RFValue(5),
    elevation: 5,
    borderWidth: 0.5,
    borderColor: COLOR.BORDER_COLOR,
    //  height: RFPercentage(isiOS ? 14 : 16),
  },
  section: {
    //  marginHorizontal: 10,
    marginLeft: RFValue(20),
    justifyContent: "space-between",
    flex: 0.67,
    paddingVertical: RFValue(2),
  },
  capTitle: {
    justifyContent: "center",
    justifyContent: "center",
    paddingHorizontal: 0,
    overflow: "hidden",
  },
  capImage: {
    height: "100%",
    width: "100%",
    alignSelf: "center",
  },
  capTitleText: {
    fontFamily: FONTS.REGULAR,
    fontSize: RFValue(15),
    color: COLOR.LIGHT_BLACK,
    justifyContent: "center",
    fontWeight: "500",
  },
  details: {
    flexDirection: "row",
    marginTop: RFValue(5),
    // overflow: 'hidden',
  },
  detailsText: {
    fontFamily: FONTS.LIGHT,
    fontSize: RFValue(isiOS ? 12 : 11),
    color: COLOR.LIGHT_BLACK,
    fontFamily: FONTS.REGULAR,
    fontWeight: "500",
    opacity: 0.7,
  },
  check: {
    height: RFPercentage(2),
    width: RFPercentage(2),
    alignSelf: "center",
    marginRight: RFPercentage(2),
  },
  online: {
    borderWidth: 1,
    paddingHorizontal: RFPercentage(2),
    backgroundColor: COLOR.PRIMARY,
    color: COLOR.WHITE,
    alignSelf: "center",
    borderColor: COLOR.PRIMARY,
    borderRadius: RFValue(10),
    overflow: "hidden",
    fontSize: RFValue(isiOS ? 15 : 16),
    marginTop: 2,
    padding: RFValue(3),
  },
  bookBtn: {
    backgroundColor: COLOR.SECONDARY,
    color: COLOR.WHITE,
    borderColor: COLOR.BACKGROUND,
    marginLeft: RFPercentage(0.5),
    marginLeft: RFPercentage(1.5),
  },
  tab: {
    borderBottomWidth: 0,
    marginTop: RFPercentage(2.5),
    paddingHorizontal: 5,
    overflow: "hidden",
    flexDirection: "row",
  },
  horizontalRule: {
    borderBottomColor: "transparent",
    borderBottomWidth: 2,
    marginHorizontal: RFPercentage(1),
    marginTop: RFPercentage(1),
  },
  tabTitle: {
    alignSelf: "center",
    fontFamily: FONTS.LIGHT,
    fontSize: RFValue(15),
  },
  tabContainer: {
    flexDirection: "row",
    height: RFPercentage(4),
    justifyContent: "flex-start",
    // marginBottom: RFPercentage(3),
    //marginTop: RFPercentage(1),
    //  flex: 0.05,
  },
  defaut_txt: {
    fontSize: RFValue(17),
    color: COLOR.GREY,
    fontFamily: FONTS.REGULAR,
    fontWeight: "500",
  },
  centerAlign: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
export default (CareTeam = React.memo(CareTeam));
