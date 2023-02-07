/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable module-resolver/use-alias */
// @ts-nocheck
import GLOBALS from '@constants';
import * as Images from '@images';
import Theme from '@components/common/styles';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
const { FONTS, COLOR, STRINGS } = GLOBALS;
const { TAKEDOSE } = STRINGS;
import NoData from '@components/common/NoData';
import styles from '../styles';
function CBTCourses(props) {
  const { CBTList, openPdf } = props;
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}>
      <View style={{ padding: 10 }}>
        {/* <Text>Hi jhjjk</Text> */}
        <FlatList
          data={CBTList}
          scrollEnabled={false}
          keyExtractor={item => `${item.id}`}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              key={index}
              onPress={() => openPdf(item)}
              style={styles.mainView}>
              <View style={{ flex: 0.2 }}>
                <Image source={Images.Assessments} resizeMode="contain" />
              </View>
              <View style={{ flex: 0.8, justifyContent: 'center' }}>
                <Text>
                  {item.name}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<NoData />}
        />
      </View>
    </ScrollView>
  );
}

export default (CBTCourses = React.memo(CBTCourses));
