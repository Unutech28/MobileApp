// @ts-nocheck
import Loader from "@components/common/screenLoader";
import GLOBALS from "@constants";
import * as Images from "@images";
import React, { useState, useEffect } from "react";
import { RFValue } from "react-native-responsive-fontsize";
import NoData from "@components/common/NoData";
import ShadowView from "../../../components/common/ShadowView";
import { strings } from "@localization";

import {
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
const { FONTS, COLOR } = GLOBALS;
const { DARK_GREEN } = COLOR;
let val = []
function Assessments(props) {
  const [filterArray, setFilterArray] = useState([])



  const { onPressAssessment, allAssessments, assessmentLoader } = props;
  useEffect(() => {
    val = allAssessments.filter((item) => item.isTaken === false)
    setFilterArray(val)
  }, [allAssessments])


  useEffect(() => {
    console.log("assisments===>", allAssessments);
  }, [allAssessments])
  const CardView = ({ item, onClick }) => {
    return (
      <TouchableOpacity
        onPress={() => onClick(item)}
      >
        {item?.isTaken == false &&
          <ShadowView style={styles.shadowView}>
            <Text style={styles.assessmentName}>{item.name}</Text>

            {item.status === "completed" ? (
              <Image
                source={Images.RadioChecked}
                resizeMode="contain"
                style={styles.checkedImage}
              />
            ) : (
              <Image
                source={Images.darkForward}
                resizeMode="contain"
                style={styles.forwardArrow}
              />
            )}
          </ShadowView>
        }
      </TouchableOpacity>
    );
  };
  return (
    <ScrollView style={styles.scrollView}>
      <Text style={styles.subHeading}>
        {strings.assessment.SelectAsessmentType}
      </Text>
      {assessmentLoader ? (
        <Loader />
      ) : (
        <FlatList
          contentContainerStyle={styles.contentContainerStyle}
          data={filterArray}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <CardView item={item} onClick={onPressAssessment} />
          )}
          ListEmptyComponent={
            <NoData emptyTextMessage={strings.assessment.No_assessments} />
          }
        />
      )}
    </ScrollView>
  );
}

export default (Assessments = React.memo(Assessments));
const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: COLOR.BACKGROUND,
    flex: 1,
  },
  subHeading: {
    fontFamily: FONTS.REGULAR,
    fontSize: RFValue(24),
    color: DARK_GREEN,
    fontWeight: "bold",
    lineHeight: RFValue(34),
    paddingTop: RFValue(20),
    paddingBottom: RFValue(40),
    paddingHorizontal: RFValue(16),
  },
  contentContainerStyle: {
    flex: 1,
    paddingVertical: RFValue(0),
    marginBottom: RFValue(30),
  },
  assessmentName: {
    fontSize: RFValue(15),
    color: COLOR.LIGHT_BLACK,
    fontFamily: FONTS.BOLD,
  },
  shadowView: {
    borderWidth: 0.5,
    borderColor: DARK_GREEN,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: RFValue(15),
    borderRadius: RFValue(10),
    marginBottom: RFValue(10),
    width: "90%",
    marginLeft: "auto",
    marginRight: "auto",
  },
  checkedImage: { height: RFValue(32), width: RFValue(32) },
  forwardArrow: { alignSelf: "center" },
});
