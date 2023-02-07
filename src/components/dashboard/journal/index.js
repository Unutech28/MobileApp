/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
// @ts-nocheck
import Loader from "@components/common/screenLoader";
import GLOBALS from "@constants";
import * as Images from "@images";
import React from "react";
import {
  FlatList,
  Image,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { strings } from "@localization";
import { RFValue, RFPercentage } from "react-native-responsive-fontsize";
const isiOS = Platform.OS == "ios";
const { FONTS, COLOR } = GLOBALS;
function Journal(props) {
  const { onPressAssessment, allAssessments, assessmentLoader } = props;
  const CardView = ({ item, onClick }) => {
    return (
      <TouchableOpacity onPress={() => onClick(item)} style={styles.card}>
        <View style={styles.imageContainer}>
          <View
            // source={Images.rectangle}
            style={[styles.img, { backgroundColor: COLOR.DARK_GREEN }]}
            // tintColor={COLOR.DARK_GREEN}
            // tintColor="red"
          />
        </View>
        <View style={styles.textViewStyle}>
          <Text style={styles.textStyle}>{item?.name}</Text>
        </View>
        <View style={styles.viewStyle}>
          {item?.status === "Completed" && (
            <Image
              source={Images.GreenCircle}
              resizeMode="contain"
              style={{ height: RFValue(32), width: RFValue(32) }}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <ScrollView
      style={{
        backgroundColor: COLOR.BACKGROUND,
        flex: 1,
      }}
    >
      <Text
        style={{
          fontFamily: FONTS.REGULAR,
          fontSize: RFValue(24),
          color: COLOR.DARK_GREEN,
          fontWeight: "bold",
          lineHeight: RFValue(34),
          paddingTop: RFValue(20),
          paddingBottom: RFValue(20),
          paddingHorizontal: RFValue(16),
        }}
      >
        {strings.journal.title}
      </Text>
      {assessmentLoader ? (
        <Loader />
      ) : (
        <FlatList
          contentContainerStyle={{ flex: 1, paddingVertical: RFValue(8) }}
          data={allAssessments}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => item + index}
          renderItem={({ item }) => (
            <CardView item={item} onClick={onPressAssessment} />
          )}
          ListEmptyComponent={
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: RFValue(15),
                  color: COLOR.GREY,
                  fontFamily: FONTS.REGULAR,
                }}
              >
                {strings.journal.default}
              </Text>
            </View>
          }
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    height: RFValue(85),
    backgroundColor: COLOR.WHITE,
    marginBottom: RFPercentage(isiOS ? 1.5 : 2),
    borderRadius: RFPercentage(1),
    shadowColor: COLOR.SHADOW,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
    borderWidth: 1,
    borderColor: COLOR.BORDER_COLOR,
    overflow: "hidden",
    width: "90%",
    marginLeft: "auto",
    marginRight: "auto",
  },
  imageContainer: {
    flex: 0.33,
    borderRightWidth: 1,
    borderColor: COLOR.BORDER_COLOR,
  },
  img: {
    height: "100%",
    width: "100%",
    borderTopLeftRadius: RFPercentage(1),
    borderBottomLeftRadius: RFPercentage(1),
    overflow: "hidden",
  },
  textViewStyle: {
    flex: 0.57,
    justifyContent: "center",
  },
  textStyle: {
    fontFamily: FONTS.MEDIUM,
    justifyContent: "center",
    marginLeft: RFValue(20),
    fontWeight: "500",
    fontSize: RFValue(isiOS ? 15 : 16),
    color: COLOR.LIGHT_BLACK,
  },
  viewStyle: {
    flex: 0.1,
    justifyContent: "center",
  },
});

export default Journal = React.memo(Journal);
