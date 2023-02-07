import ButtonNew from "@components/common/buttonNew";
import CustomButton from "@components/common/customButton";
import GLOBALS from "@constants";
import * as Images from "@images";
import { validatePassword } from "@utils/ValidationUtils";
import React, { useState, lazy, useEffect } from "react";
import Icon from "react-native-vector-icons/FontAwesome5";
import {
  Image,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  // TextInput,
  View,
  StatusBar,
  ImageBackground,
  Alert,
  Dimensions,
  ScrollView,
  FlatList,
  KeyboardAvoidingView,
  TouchableOpacity,
  Modal,
} from "react-native";
import { strings } from "@localization";
const PdfViewer = lazy(() => import("@components/dashboard/modals/PdfViewer"));
import styles from "./styles";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { RFValue, RFPercentage } from "react-native-responsive-fontsize";
const { FONTS, COLOR, STRINGS } = GLOBALS;
const {
  SIGNIN,
  SIGNUP,
  EMAILADDR,
  EMAILPASWD,
  EMAILHOLDER,
  EMAIL_ERROR,
  PASSWORD_ERROR,
  VALID_ERROR,
} = STRINGS;
const { PRIMARY, WHITE, GREY, DARKGREY } = COLOR;
import { TextInput } from "react-native-paper";
import Ionicons from "react-native-vector-icons/Ionicons";
import { alertWithOneBtn } from "@helpers/common";
import { WebView } from "react-native-webview";
import { useSelector } from "react-redux";


const Header = lazy(() => import("@components/common/Header"));

const isIOS = Platform.OS === "ios";
let window = Dimensions.get("window");
const PrivacyModal = (props) => {
  const [documentUrl, setDocumentUrl] = useState("");
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [getHelpResponse, setGetHelpResponse] = useState(props.getHelpResponse);
  const {
    policyData
  } = useSelector((state) => state.authReducer);

  const renderCard = (item, index) => {
    return (
      <TouchableOpacity
        onPress={() => {
          showPdf(item);
        }}
        style={styles.rowContainer}
      >
        <Image source={Images.rectangle} style={styles.greenContainer} />
        <Text style={styles.textStyleNotification}>{item.name}</Text>

        <Image
          source={Images.darkForward}
          resizeMode="contain"
          style={styles.arrowImage}
        />
      </TouchableOpacity>
    );
  };

  const showPdf = (item, type) => {
    setShowPdfModal(true);
    setDocumentUrl(item.url);
  };

  return (
    <View style={styles.container}>
      <Header
        isLeftIcon={true}
        isRightIcon={false}
        onLeftIconClick={() => {
          props.closeModal();
        }}
        isLogout={false}
        isTitle={true}
        title={strings.profile.Privacy}
        titleStyle={{ fontSize: RFValue(25), paddingTop: RFValue(10) }}
      />
      <View style={{ flex: 1 }}>
        <WebView
          originWhitelist={['*']}
          source={{ html: policyData?.desc }}
          style={{
            margin: RFValue(10),
            marginTop: RFValue(50),
            // maxHeight: height / 2,
            // zIndex: 100,
          }}
          startInLoadingState={true}
          allowsFullscreenVideo={true}
          javaScriptEnabled={true}
          scrollEnabled={false}
        />
      </View>
      {/* <ScrollView
        keyboardShouldPersistTaps="handled"
        style={styles.outerContainer}
      >
        <View
          style={{
            marginTop: 20,
            marginBottom: 20,
          }}
        >
          <View style={styles.ListView}>
            <FlatList
              style={{ marginTop: RFValue(10) }}
              data={
                getHelpResponse !== undefined ? getHelpResponse.document : []
              }
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => `${item._id}`}
              renderItem={({ item, index }) => renderCard(item, index, "doc")}
            />
          </View>
        </View>
      </ScrollView>
      <Modal
        transparent={true}
        visible={showPdfModal}
        onRequestClose={() => {
          setShowPdfModal(false);
        }}
      >
        <PdfViewer
          closeModal={() => {
            setShowPdfModal(false);
          }}
          url={documentUrl}
        />
      </Modal> */}
    </View>
  );
};


export default (SelectModal = PrivacyModal);
