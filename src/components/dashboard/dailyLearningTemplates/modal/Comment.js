import React, { useState, lazy, useCallback, useEffect } from "react";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  FlatList,
  View,
  Animated,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import { shallowEqual, useSelector } from "react-redux";
import { RFValue } from "react-native-responsive-fontsize";
import RenderHtml from "react-native-render-html";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import CommnetIcon from "react-native-vector-icons/FontAwesome";
import * as Animatable from "react-native-animatable";
import GLOBALS from "@constants";
import { screenHeight, screenWidth } from "@utils/Styles";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
const { FONTS, COLOR, STRINGS } = GLOBALS;
import { strings } from "@localization";
const Header = lazy(() => import("@components/common/Header"));
const CommentModal = (props) => {
  const flatListRef = React.useRef();
  const reducerData = useSelector((state) => {
    return state.cardsReducer;
  });
  const [comment, setComment] = useState("", "");
  const [all_comments, setAllComments] = useState(reducerData.comments);

  /**To listen all the changes Cards Array Prop */
  let { closeModal, addComment } = props;

  const addCommentSend = () => {
    //  let updatedComment = [...all_comments];
    let updatedComment = [...all_comments, { "comment": comment }]

    addComment(updatedComment);
  };

  return (
    <View style={styles.container}>
      <Header
        isLeftIcon={true}
        isRightIcon={false}
        onLeftIconClick={() => {
          closeModal();
        }}
        isTitle={true}
        title={strings.cards.comment + "s"}
        isLogout={false}
        titleStyle={{
          paddingTop: RFValue(10),
        }}
      />
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === "android" ? -200 : -90}
        style={{
          height: "100%",
          width: "100%",
          flexDirection: "column",
          justifyContent: "flex-start",
          padding: 10,
        }}
        enabled
      >
        <View style={{ flex: 0.87 }}>
          <View style={styles.outer_container}>
            <FlatList
              ref={flatListRef}
              data={all_comments}
              contentContainerStyle={{}}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => `${item._id}`}
              renderItem={({ item, index }) => (
                <View style={styles.commentContainer}>
                  <Text style={[styles.blackText]}>{item.comment}</Text>
                </View>
              )}
            />
          </View>
          <View style={styles.bottomContainer}>
            <View style={styles.inputContainer}>
              <TextInput
                onFocus={() => {
                  // setTimeout(() => {
                  //   flatListRef.current.scrollToIndex({ animated: true, index: 1 })
                  // }, 1000);
                }}
                style={[
                  {
                    color: "dark" ? COLOR.GREY : COLOR.GREY,
                  },
                  styles.commentInput,
                  { padding: 5 },
                ]}
                value={comment}
                placeholder={strings.cards.comment + "..."}
                placeholderTextColor={COLOR.GREY}
                maxLength={5000}
                multiline={true}
                returnKeyType="go"
                underlineColorAndroid={"transparent"}
                onChangeText={(comment) => setComment(comment)}
              />
            </View>

            {comment != "" && (
              <TouchableOpacity
                onPress={() => addCommentSend()}
                style={{ justifyContent: "center" }}
              >
                <FontAwesome
                  name={"send"}
                  size={27}
                  color={COLOR.DARK_GREEN}
                  style={{
                    paddingHorizontal: 8,
                  }}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default CommentModal;

const styles = StyleSheet.create({
  outer_container: {
    padding: 5,
    flex: 0.8,
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
    position: "absolute",
    bottom: 28,
    width: "100%",
    padding: 10,
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: COLOR.WHITE,
  },
  commentInput: {
    height: RFValue(60),
    color: COLOR.BLACK,
    fontSize: 17,
    fontFamily: FONTS.MEDIUM,
    textAlignVertical: "top",
  },
  inputContainer: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: COLOR.DARK_GREEN,
    backgroundColor: COLOR.WHITE,
    padding: 5,
  },
});
