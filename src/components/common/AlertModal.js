import React from "react";
import { View, Text, Modal, StyleSheet, TouchableOpacity } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import GLOBALS from "@constants";
import { strings } from "@localization";
import RenderHtml from "react-native-render-html";

const { FONTS, COLOR } = GLOBALS;
/**Show custom alert modal */
const AlertModal = ({ text, onYesPress, visible, description = "" }) => {
  console.log("here bbbb====>", description);
  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onYesPress}
      transparent
    >
      <View style={styles.mainContainer}>
        <View style={styles.alertStyle}>
          {description != "" && (
            <RenderHtml
              contentWidth={"100%"}
              source={{
                html:
                  description == "" ? strings.CoustomAlert.msg : description,
              }}
            />
            // <Text style={[styles.text, { fontSize: RFValue(15) }]}>
            //   {description == "" ? strings.CoustomAlert.msg : description}
            // </Text>
          )}

          <View style={styles.btnView}>
            <TouchableOpacity
              style={styles.btn}
              onPress={onYesPress}
              hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}
            >
              <Text
                style={[
                  styles.text,
                  {
                    color: COLOR.WHITE,
                  },
                ]}
              >
                {strings.CoustomAlert.ok}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(25,25,25,0.5)",
  },
  alertStyle: {
    backgroundColor: COLOR.WHITE,
    width: "85%",
    minHeight: "20%",
    borderRadius: RFValue(20),
    alignItems: "center",
    justifyContent: "center",
    padding: RFValue(20),
    shadowColor: COLOR.PRIMARY,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.4,
    shadowRadius: 3.14,
    elevation: 2,
    borderColor: COLOR.PRIMARY,
    borderWidth: 2,
  },
  btnView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: RFValue(35),
  },
  text: {
    fontFamily: FONTS.BOLD,
    color: COLOR.BLACK,
    fontSize: RFValue(15),
  },
  btn: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    backgroundColor: COLOR.DARK_GREEN,
    height: RFValue(40),
    borderRadius: RFValue(10),
  },
});

export default AlertModal;
