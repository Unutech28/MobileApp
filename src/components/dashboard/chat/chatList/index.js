import NoData from "@components/common/NoData";
import Loader from "@components/common/screenLoader";
import GLOBALS from "@constants";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from "react-native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import ViewMoreText from "react-native-view-more-text";
import { decode as atob, encode as btoa } from "base-64";
import moment from "moment";
import "moment/locale/es";
import { createFilter } from "react-native-search-filter";
import { strings } from "@localization";
import * as Images from "@images";
const isiOS = Platform.OS === "ios";
const { FONTS, COLOR } = GLOBALS;
const { PRIMARY, WHITE } = COLOR;
const KEYS_TO_FILTERS = ["toUserName"];
let TodayDate = new Date();
let date = TodayDate.getDate();
let month = TodayDate.getMonth();
let year = TodayDate.getFullYear();
let currentDate = month + 1 + "-" + date + "-" + year;
const renderViewMore = () => {
  return (
    <View>
      <Text />
    </View>
  );
};
const RenderTextUI = (item) => {
  let data = item.item;
  if (data.text !== "" && data.text != null) {
    return (
      <ViewMoreText
        numberOfLines={2}
        renderViewMore={renderViewMore}
        textStyle={{ textAlign: "left" }}
      >
        <Text style={styles.detailsText}>{data.text}</Text>
      </ViewMoreText>
    );
  } else {
    if (data.imageType === 1) {
      return (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginLeft: -RFValue(50),
          }}
        >
          <Icon
            name="image"
            size={20}
            color={COLOR.GREY}
            style={{ paddingTop: 2 }}
          />
          <Text style={styles.detailsText}>{"Photo"}</Text>
        </View>
      );
    } else {
      return (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FontAwesome name="file" size={16} color={COLOR.GREY} />
          <ViewMoreText
            numberOfLines={2}
            renderViewMore={renderViewMore}
            textStyle={{ textAlign: "left" }}
          >
            <Text style={styles.detailsText}>{data.imageName}</Text>
          </ViewMoreText>
        </View>
      );
    }
  }
};

const CardView = ({ item, goToChat }) => {
  let decryptData;
  try {
    if (item.lastMessage.data !== undefined && item.lastMessage.data != "") {
      decryptData = JSON.parse(
        decodeURIComponent(escape(atob(item.lastMessage.data)))
      );
    }
  } catch (error) {}

  return (
    <TouchableOpacity onPress={() => goToChat(item)} style={styles.row}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.image_path }}
          resizeMode="contain"
          style={styles.capImage}
        />
      </View>
      <View style={[styles.section]}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.capTitleText}>{item.toUserName}</Text>
            <View style={{ paddingTop: RFValue(5) }}>
              <RenderTextUI
                item={decryptData !== undefined ? decryptData : ""}
              />
            </View>
          </View>
          <Text
            style={[
              styles.detailsText,
              { fontWeight: "bold", opacity: 0.7, fontSize: RFValue(12) },
            ]}
          >
            {decryptData !== undefined
              ? moment(decryptData.createdAt).local().format("M-DD-YYYY") ===
                currentDate
                ? // ? "Today"
                  moment(decryptData.createdAt)
                    .local(strings.APP_INFO.momentLanguage)
                    .format("hh:mm A")
                : moment(decryptData.createdAt)
                    .local(strings.APP_INFO.momentLanguage)
                    .fromNow()
              : null}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

function ChatList(props) {
  let { data, teamLoader, onPressCard, goToChat, decryptChatKey } = props;
  const [searchText, setSearchText] = useState("");
  const [isSearchList, setisSearchList] = useState(false);
  const [newSortedList, setNewSortedList] = useState(data, "");
  const [autoFocusKeyboard, setAutoFocusKeyboard] = useState(false);
  const [isRefresh, setIsRefresh] = useState(false);

  const searchUpdated = (text) => {
    if (text != "") {
      const filteredList = data.filter(createFilter(text, KEYS_TO_FILTERS));
      setNewSortedList(filteredList);
      setSearchText(text);
      setisSearchList(true);
    } else {
      setSearchText("");
      setisSearchList(false);
      setNewSortedList(data);
    }
  };

  return (
    <View style={styles.container}>
      {teamLoader ? (
        <Loader />
      ) : data ? (
        <View style={[styles.scene]}>
          {data && data.length ? (
            <View>
              <TextInput
                onChangeText={(term) => {
                  searchUpdated(term);
                }}
                style={[styles.chatView, { zIndex: 1 }]}
                placeholder={!isSearchList ? strings.Account.search : null}
                placeholderTextColor={"#454D58"}
                underlineColorAndroid="transparent"
                value={searchText}
                autoFocus={autoFocusKeyboard}
              />
              <Image
                source={Images.greenSearch}
                resizeMode="contain"
                style={{
                  position: "absolute",
                  right: 0,
                  top: 24,
                  zIndex: 10,
                }}
              />
            </View>
          ) : null}

          <FlatList
            contentContainerStyle={{ flex: 1, marginTop: 10 }}
            data={isSearchList ? newSortedList : data}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => `${item._id}`}
            extraData={isRefresh}
            renderItem={({ item }) => (
              <CardView
                item={item}
                onClick={onPressCard}
                goToChat={goToChat}
                decryptChatKey={decryptChatKey}
              />
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
                  {strings?.chat?.noChat}
                </Text>
              </View>
            }
          />
        </View>
      ) : (
        <NoData />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    height: RFPercentage(8),
    width: RFPercentage(8),
    flex: 0.2,
    marginRight: 10,
  },
  capImage: {
    width: "100%",
    height: "100%",
  },
  scene: {
    flex: 1,
  },
  container: {
    backgroundColor: COLOR.BACKGROUND,
    marginHorizontal: RFPercentage(2),
    flexGrow: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: RFPercentage(isiOS ? 1.5 : 2),
    paddingBottom: RFValue(6),
    borderBottomWidth: 1,
    borderColor: "#6545B261",
  },
  section: {
    justifyContent: "center",
    flex: 1,
  },

  capTitleText: {
    fontFamily: FONTS.REGULAR,
    fontSize: RFValue(18),
    color: "#454D58",
    fontWeight: "bold",
  },
  detailsText: {
    fontFamily: FONTS.REGULAR,
    fontSize: RFValue(isiOS ? 14 : 15),
    color: "#454D58",
  },
  details: {
    paddingHorizontal: 0,
    flexDirection: "row",
  },

  chatView: {
    marginBottom: RFPercentage(isiOS ? 1.5 : 1.5),
    borderRadius: RFPercentage(1),
    paddingLeft: RFValue(10),
    height: RFPercentage(isiOS ? 7 : 7),
    width: "100%",
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: RFPercentage(2.5),
    borderColor: "#6545B261",
    borderWidth: 1,
    shadowColor: PRIMARY,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.46,
    shadowRadius: 11.14,
    elevation: 17,
    backgroundColor: WHITE,
  },
});
export default ChatList = React.memo(ChatList);
