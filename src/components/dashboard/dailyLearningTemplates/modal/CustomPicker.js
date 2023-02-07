import React, { useState, lazy, useEffect } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Image,
  FlatList,
} from "react-native";
import * as Images from "@images";
import { strings } from "@localization";
import { useSelector } from "react-redux";
import { RFValue } from "react-native-responsive-fontsize";
import Ionicons from "react-native-vector-icons/Ionicons";
import GLOBALS from "@constants";
import { screenHeight, screenWidth } from "@utils/Styles";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
const { FONTS, COLOR, STRINGS } = GLOBALS;
const { REGULAR } = FONTS;
const { SOFT_GRAY, DARK_GREEN, WHITE, BLACK } = COLOR;
const Header = lazy(() => import("@components/common/Header"));
const { height } = Dimensions.get("window");
const CustomPicker = (props) => {
  let { selectedValue, user_language, modal_data, closeModal } = props;
  const [list_data, setList] = useState([]);
  const reducerData = useSelector((state) => {
    return state.cardsReducer;
  });

  useEffect(() => {});

  return (
    <View style={styles.outer_container}>
      <View style={styles.container}>
        <Text style={styles.heading}>Please select</Text>
        <FlatList
          data={modal_data.item}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item._id}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => {
                selectedValue(item);
              }}
              style={styles.searchedTitleWrapper}
            >
              <Image
                source={
                  modal_data.selectedValue != item.addContent
                    ? Images.UnChecked
                    : Images.Checked
                }
                resizeMode="contain"
              />
              <Text style={styles.titleStyle}>{item.addContent}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
};

export default CustomPicker;

const styles = StyleSheet.create({
  outer_container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    padding: 20,
    borderRadius: 10,
  },

  container: {
    backgroundColor: "white",
    flex: 0.6,
    borderRadius: 10,
    //    justifyContent: 'center'
  },
  searchedTitleWrapper: {
    flexDirection: "row",
    marginVertical: 5,
    paddingHorizontal: RFValue(10),
    alignItems: "center",
  },
  titleStyle: {
    fontSize: RFValue(16),
    color: SOFT_GRAY,
    lineHeight: RFValue(38),
    flexWrap: "wrap",
    fontFamily: REGULAR,
    paddingHorizontal: RFValue(10),
    textAlignVertical: "center",
  },
  heading: {
    fontSize: RFValue(20),
    color: COLOR.DARK_GREEN,
    lineHeight: RFValue(38),
    flexWrap: "wrap",
    fontFamily: FONTS.BOLD,
    padding: 15,
  },
});
