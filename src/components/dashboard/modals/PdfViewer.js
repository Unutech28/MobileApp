import React, { useEffect, useState } from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  Dimensions,
  Text,
  ActivityIndicator,
  Platform,
  Linking,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import GLOBALS from '@constants';
import Icon from 'react-native-vector-icons/Ionicons';
import Pdf from 'react-native-pdf';
import { WebView } from "react-native-webview";
import * as AppActions from "@actions";
import { useSelector, useDispatch } from 'react-redux';


const { width, height } = Dimensions.get('window');
const { STRINGS, COLOR, FONTS } = GLOBALS;
const { PRIMARY, WHITE, GREY } = COLOR;
function PdfViewer(props) {
  const { closeModal, url, type } = props;
  const [data, setData] = useState(url)
  const dispatch = useDispatch();

  useEffect(() => {
    if (type) {
      getData()
    }
  }, [url])


  const getData = async () => {
    console.log("here==>", type);
    const res = await dispatch(AppActions.getHelpDocumentsData("help-center/" + type))
    console.log("yyttyy", res);

    setData(res.desc)
  }
  return (
    <View style={styles.container}>
      <View style={{ flex: 0.14 }}>
        <TouchableOpacity onPress={closeModal} style={styles.closeIcon}>
          <Icon name={'close'} size={40} color={WHITE} />
        </TouchableOpacity>
      </View>
      <View style={{ flex: 0.9 }}>
        <WebView
          originWhitelist={['*']}
          source={{ html: data }}
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
        {/* <Pdf
          source={{ uri: url }}
          //   source={{
          //     uri:
          //       "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
          //   }}
          onLoadComplete={(numberOfPages, filePath) => { }}
          onPageChanged={(page, numberOfPages) => { }}
          onError={error => { }}
          onPressLink={uri => {
            // alert("hiii")
            Linking.openURL(uri);
          }}
          style={styles.pdfStyle}
        /> */}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0,0.8)',
  },
  closeIcon: {
    paddingLeft: 20,
    position: 'absolute',
    zIndex: 2,
    top: Platform.OS == 'ios' ? RFValue(50) : RFValue(20),
  },
  pdfStyle: {
    padding: 20,
    flex: 1,
    height: '100%',
    width: '100%',
    shadowOffset: { width: 1, height: RFValue(0.2) },
    shadowOpacity: 0.4,
    shadowRadius: RFValue(8),
    shadowColor: COLOR.DARK_GREEN,
    borderRadius: RFValue(10),
  },
});

export default (PdfViewer = React.memo(PdfViewer));
