// @ts-nocheck
import GLOBALS from '@constants';
import * as ICONS from '@images';
import React, { lazy, useState, useEffect } from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
  TouchableOpacity,
  View,
  ScrollView,
  Dimensions,
  StatusBar,
  Alert,
  Keyboard,
} from 'react-native';
import { strings } from '@localization';

import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import ButtonNew from '@components/common/buttonNew';
const Header = lazy(() => import('@components/common/Header'));
const { FONTS, COLOR } = GLOBALS;

function EditModal(props) {
  let {
    modalVisible = false,
    onSubmitEditing,
    value,
    title,
    onChangeJournalText,
    onSaveClick = () => { },
    onHeaderLeftIconClick = () => { },
    loader,
    isDisabled,
    disable,
    totalQuestions = [],
  } = props;
  //onChangeJournalText(value);


  const [text, setText] = useState(value)
  useEffect(() => {
    onChangeJournalText(value);
  }, []);

  useEffect(() => {
  }, [text]);
  return (
    <Modal
      onRequestClose={onHeaderLeftIconClick}
      visible={modalVisible}
      animationType="slide"
      transparent={false}>
      <Header
        isLeftIcon={true}
        isRightIcon={false}
        onLeftIconClick={onHeaderLeftIconClick}
        isTitle={true}
        title={title}
        isLogout={false}
        titleStyle={{
          paddingTop: RFValue(10),
        }}
      />
      <ScrollView
        style={styles.modalContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: RFValue(100) }}>
        <TextInput
          multiline
          disabled={disable}
          value={text}
          // returnKeyType={'done'}
          // onSubmitEditing={Keyboard.dismiss}
          style={styles.inputStyle}
          onChangeText={(text) => {
            onChangeJournalText(text)
            setText(text)
          }}
        />
        {/* {totalQuestions.length > 0 && ( */}
        <View
          style={{
            marginTop: RFValue(35),
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
          }}>
          <View
            style={{
              height: RFValue(45),
              width: RFValue(250),
              justifyContent: 'center',
              borderRadius: RFPercentage(1),
            }}>
            <ButtonNew
              text={strings.activity.save_txt}
              onBtnPress={onSaveClick}
              isDisabled={isDisabled}
              loader={loader}
            />
          </View>
        </View>
        {/* )} */}
      </ScrollView>
    </Modal>
  );
}
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    padding: RFValue(15),
  },
  inputStyle: {
    height: RFValue(250),
    width: '100%',
    borderWidth: RFValue(1),
    padding: RFValue(16),
    fontFamily: FONTS.REGULAR,
    fontSize: RFValue(16),
    borderColor: COLOR.GREY,
    borderRadius: RFValue(4),
    textAlignVertical: 'top',
  },
});

export default (EditModal = React.memo(EditModal));
