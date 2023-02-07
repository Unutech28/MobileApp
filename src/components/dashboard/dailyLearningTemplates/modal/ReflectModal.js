import React, { useState, lazy } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from "react-native";
import { strings } from "@localization";
import { useSelector } from "react-redux";
import { RFValue } from "react-native-responsive-fontsize";
import Ionicons from "react-native-vector-icons/Ionicons";
import GLOBALS from "@constants";
import { screenHeight, screenWidth } from "@utils/Styles";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
const { FONTS, COLOR, STRINGS } = GLOBALS;
const Header = lazy(() => import("@components/common/Header"));
const { height } = Dimensions.get("window");
const ReflectModal = (props) => {
  const reducerData = useSelector((state) => {
    return state.cardsReducer;
  });
  const [comment, setComment] = useState(
    reducerData.comments.length == 0 ? "" : reducerData.comments[0].comment
  );
  const [all_comments, setAllComments] = useState(reducerData.comments);
  const [reflect, setReflect] = useState(
    reducerData?.comments[all_comments?.length - 1]?.comment
  );

  /**To listen all the changes Cards Array Prop */
  let { closeModal, addComment } = props;

  const addCommentSend = () => {
    addComment(comment);
    // }
  };

  return (
    <KeyboardAwareScrollView
      enableAutomaticScroll={Platform.OS === "ios" ? true : false}
      keyboardShouldPersistTaps={"handled"}
      enableOnAndroid={true}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.7)" }}>
        <TouchableOpacity
          hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}
          onPress={() => closeModal()}
        >
          <Ionicons
            name={"close"}
            size={40}
            color={COLOR.WHITE}
            style={{
              padding: 15,
            }}
          />
        </TouchableOpacity>
        <View
          style={{
            height: "80%",
            width: "100%",
            padding: 20,
            backgroundColor: COLOR.WHITE,
            position: "absolute",
            bottom: RFValue(0),
          }}
        >
          <TouchableOpacity
            hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}
            onPress={() => {
              closeModal();
            }}
            style={styles.closeBar}
          />
          <Text style={styles.textHeading}>{strings.cards.reflect_title}</Text>
          <View style={{ flexDirection: "row", marginBottom: 25 }}>
            <TextInput
              multiline={true}
              placeholder={strings.cards.quote_mean}
              style={styles.textInputStyle}
              value={comment}
              maxLength={2000}
              selectionColor={"green"}
              underlineColorAndroid={"transparent"}
              onChangeText={(comment) => setComment(comment)}
            />
          </View>
          <View
            style={{
              position: "absolute",
              top: screenHeight / 2,
              width: "100%",
            }}
          >
            <TouchableOpacity
              onPress={() => addCommentSend()}
              disabled={comment.trim() == "" ? true : false}
              style={[
                styles.finishBtn,
                {
                  backgroundColor:
                    comment.trim() == "" ? "white" : COLOR.DARK_GREEN,
                },
              ]}
            >
              <Text
                style={[
                  styles.buttonText,
                  {
                    color: comment.trim() == "" ? "black" : "white",
                  },
                ]}
              >
                {strings.mood.finish}

              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default ReflectModal;

const styles = StyleSheet.create({
  outer_container: {
    padding: 10,
    height: screenHeight / 1.35,
  },

  container: {
    flex: 1,
    backgroundColor: COLOR.WHITE,
  },
  commnetText: {
    fontSize: 17,
    fontFamily: FONTS.MEDIUM,
    color: COLOR.BLACK,
    fontWeight: "600",
  },
  commentContainer: {
    padding: 15,
    borderRadius: 20,
    backgroundColor: COLOR.DARK_GREEN,
    marginVertical: 10,
  },
  blackText: {
    fontSize: 17,
    fontFamily: FONTS.MEDIUM,
    color: COLOR.WHITE,
    fontWeight: "700",
  },
  bottomContainer: {
    paddingHorizontal: 10,
    flexDirection: "row",
  },
  commentInput: {
    height: RFValue(60),
    borderColor: COLOR.DARK_GREEN,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: COLOR.WHITE,
    paddingLeft: 10,
    alignSelf: "center",
    flex: 1,
    color: COLOR.BLACK,
    fontSize: 17,
    fontFamily: FONTS.MEDIUM,
  },
  buttonText: {
    fontFamily: FONTS.MEDIUM,
    fontSize: RFValue(16),
    fontWeight: "700",
  },
  finishBtn: {
    height: RFValue(45),
    width: "30%",
    borderRadius: 10,
    borderColor: COLOR.DARK_GREEN,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginTop: RFValue(10),
    backgroundColor: COLOR.WHITE,
    fontFamily: FONTS.MEDIUM,
    alignSelf: "flex-end",
  },
  textHeading: {
    fontSize: RFValue(17),
    fontFamily: FONTS.MEDIUM,
    color: COLOR.BLACK,
    paddingVertical: RFValue(12),
    fontWeight: "800",
    paddingRight: 20,
    width: "90%",
    marginTop: RFValue(30),
  },
  closeBar: {
    height: 7,
    width: "30%",
    backgroundColor: "#BDBDBD",
    alignSelf: "center",
    borderRadius: 20,
  },
  textInputStyle: {
    fontSize: RFValue(12),
    fontFamily: FONTS.REGULAR,
    color: COLOR.BLACK,
    borderColor: COLOR.GREY,
    borderWidth: 0.5,
    padding: 10,
    flex: 1,
    height: RFValue(80),
    borderRadius: RFValue(5),
    fontWeight: "500",
    textAlignVertical: "top",
  },
});
