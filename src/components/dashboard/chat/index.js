/* eslint-disable prettier/prettier */
// @ts-nocheck
import GLOBALS from "@constants";
import React from "react";
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { GiftedChat, Send } from "react-native-gifted-chat";
import Ionicons from "react-native-vector-icons/Ionicons";
const { FONTS, COLOR } = GLOBALS;
import Modal from "react-native-modal";
import { strings } from "@localization";
const CardView = ({}) => {
  return (
    <View style={styles.content}>
      <View style={styles.attRowStyle}>
        <TouchableOpacity style={{ alignItems: "center" }}>
          <Ionicons
            name="ios-document"
            size={72}
            color={"#416CA2"}
            style={{ paddingRight: 10 }}
          />
          <Text>{strings?.chat?.Document}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ alignItems: "center" }}>
          <Ionicons
            name="ios-image"
            size={72}
            color={"#e040fb"}
            style={{ paddingRight: 10 }}
          />
            <Text>{strings?.chat?.Gallery}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

function Chat(props) {
  let {
    messages,
    appendMessages,
    isModelVisible,
    closeModalClick,
    modalClick,
  } = props;
  const onSend = (messages = []) => {
    appendMessages(messages);
  };
  return (
    <View style={styles.container}>
      <View style={styles.mainContainer}>
        <GiftedChat
          messages={messages}
          onSend={(messages) => onSend(messages)}
          user={{
            _id: 1,
          }}
          renderActions={() => {
            return (
              <Ionicons
                name="ios-attach"
                size={30}
                color={"red"}
                style={styles.attachmentStyle}
                onPress={modalClick}
              />
            );
          }}
        />
        <Modal
          isVisible={isModelVisible === 1}
          onSwipeComplete={closeModalClick}
          swipeDirection={["up", "left", "right", "down"]}
          style={styles.bottomModal}
          onBackdropPress={closeModalClick}
        >
          <CardView />
        </Modal>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    height: "90%",
    backgroundColor: COLOR.WHITE,
    borderRadius: RFValue(8),
    overflow: "hidden",
  },
  container: {
    backgroundColor: COLOR.BACKGROUND,
    marginHorizontal: RFPercentage(2),
    paddingHorizontal: RFPercentage(0.5),
    flexGrow: 1,
  },
  attachmentStyle: {
    right: Dimensions.get("window").width / 6,
    position: "absolute",
    zIndex: 2,
  },
  bottomModal: { justifyContent: "flex-end", marginBottom: 40 },
  content: {
    flex: 0.3,
    backgroundColor: COLOR.WHITE,
    borderRadius: 4,
    justifyContent: "center",
  },
  attRowStyle: {
    margin: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
});
export default (Chat = React.memo(Chat));
