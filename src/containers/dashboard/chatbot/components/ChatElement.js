import React, { useState, lazy, useCallback, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
const { PRODUCT_TYPE } = GLOBALS;
import * as Images from "@images";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import GLOBALS from "@constants";
const { COLOR } = GLOBALS;
import { RFValue } from "react-native-responsive-fontsize";
import moment from "moment";
import globalStyles from "../styles";
import { Bubble, Composer, Send, MessageText } from "react-native-gifted-chat";
import { ListView } from "./";
/**Element for Image Loading */
const RenderMessageText = (props) => {
  let {} = props;
  return (
    <MessageText
      {...props}
      textStyle={{
        left: globalStyles.leftChatText,
        right: globalStyles.rightChatText,
      }}
      containerStyle={{
        left: {},

        right: {},
      }}
    />
  );
};

const RenderBubble = (props) => {
  let {} = props;
  return (
    <View sty={{ backgroundColor: "red" }}>
      <Bubble
        {...props}
        wrapperStyle={{
          left: [globalStyles.containerLeft, globalStyles.boxShadow],
          right: [globalStyles.containerRight],
        }}
      />
    </View>
  );
};

const RenderComposer = (props) => {
  let {} = props;
  return (
    <Composer
      {...props}
      textInputStyle={globalStyles.composerText}
      placeholderTextColor={COLOR.placeholder_gray}
      selectionColor={COLOR.THEME}
    />
  );
};

const RenderSend = (props) => {
  let {} = props;
  return (
    <Send
      {...props}
      containerStyle={globalStyles.sendContainer}
      children={
        <Ionicons
          style={{}}
          name="send"
          size={RFValue(25)}
          color={COLOR.DARK_GREEN}
        />
      }
    />
  );
};

const RenderQuickReply = (props) => {
  let {} = props;
  return (
    <>
      {props.currentMessage.suggestions.length > 0 && (
        <ListView
          title={props.currentMessage.type}
          type={props.currentMessage.type}
          // title={'Article'}
          // type={'article'}
          suggestions={props.currentMessage.suggestions}
          onItemSelect={(item) => props.onItemSelect(item)}
          // onPres={() => this.setState({ShowArticalSongs: true})}
          //     data={info => this.setState({data: info})}
        />
      )}

      {props.currentMessage.quickReplies?.values.length > 0 && (
        <View style={globalStyles.bottomContainer1}>
          <FlatList
            data={props.currentMessage.quickReplies.values}
            keyExtractor={(item, index) => String(index)}
            numColumns={2}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    if (props.currentMessage.type == "redirect-innner-screen") {
                      props.onRedirect(item);
                    } else {
                      let chatObj = {
                        ansId: item.id,
                        ans: item.value,
                        question: props.currentMessage.text,
                        queId: 1,
                        // queId: props.currentMessage.queId
                        _id: props.currentMessage._id + 1,
                        text: item.value,
                        createdAt: moment().format(),
                        user: { _id: 1 },
                        // sessionId: props.currentMessage.sessionId,
                        // context: props.currentMessage.context,
                        // week: item.week,
                        // day: item.day,
                      };
                      props.onQuickReply(chatObj);
                    }
                  }}
                  style={[
                    globalStyles.touchableStyle,
                    globalStyles.boxShadow,
                    {
                      borderWidth: 1,
                      alignItems: "center",
                      justifyContent: "center",
                    },
                  ]}
                >
                  <View style={{ alignSelf: "center" }}>
                    {/* {PRODUCT_TYPE == 'FERTI' ? (
                      <MaterialIcons
                        name={item.icon}
                        size={30}
                        color={item.color}
                      />
                    ) : ( */}
                    {/* <Image
                      style={{ width: '100%', height: 30 }}
                      source={{
                        uri: `${GLOBALS.IMAGE_BASE_URL}${item.icon}`,
                      }}
                      resizeMode="contain"
                    /> */}
                    {/* // )} */}
                    {/* */}
                  </View>
                  <Text numberOfLines={3} style={[globalStyles.btnText, {}]}>
                    {item.value}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      )}
    </>
  );
};
const styles = StyleSheet.create({});

export {
  RenderMessageText,
  RenderBubble,
  RenderComposer,
  RenderSend,
  RenderQuickReply,
};
