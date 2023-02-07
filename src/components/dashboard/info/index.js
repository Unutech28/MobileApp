/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable module-resolver/use-alias */
// @ts-nocheck
import GLOBALS from "@constants";
import * as Images from "@images";
import Theme from "@components/common/styles";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Linking,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
const { FONTS, COLOR, STRINGS } = GLOBALS;
const { TAKEDOSE } = STRINGS;
import NoData from "@components/common/NoData";
import Loader from "@components/common/screenLoader";
import styles from "./styles";
function Info(props) {
  const { CBTList, goToDetail, isLoading, onVideoClick } = props;
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View>
        <FlatList
          data={CBTList}
          scrollEnabled={false}
          keyExtractor={(item) => `${item.id}`}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              key={index}
              onPress={() => goToDetail(item)}
              style={styles.mainView}
            >
              <View style={{ flex: 0.2 }}>
                <Image source={Images.Assessments} resizeMode="contain" />
              </View>
              <View style={{ flex: 0.8, justifyContent: "center" }}>
                <Text>{item.courceName}</Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={isLoading ? <Loader /> : <NoData />}
        />
      </View>
    </ScrollView>
  );
}

export default (Info = React.memo(Info));
