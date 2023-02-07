import React from "react";
import {
  TouchableOpacity,
  View,
  StyleSheet,
  Dimensions,
  Text,
  ActivityIndicator,
  Platform,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import GLOBALS from "@constants";
import Icon from "react-native-vector-icons/Ionicons";
// import YouTube from "react-native-youtube";
import { WebView } from "react-native-webview";

const { width, height } = Dimensions.get("window");
const { STRINGS, COLOR, FONTS } = GLOBALS;
const { PRIMARY, WHITE, GREY } = COLOR;
function YoutubePlayer(props) {
  const { closeModal, url } = props;
  function LoadingIndicatorView() {
    // return <ActivityIndicator color="#009b88" size="large" />;
    return (
      <View
        style={{
          height: "100%",
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
        }}
      >
        <ActivityIndicator size="large" color="#009b88" />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View style={{ flex: 0.2, zIndex: 10 }}>
        <TouchableOpacity onPress={closeModal} style={styles.closeIcon}>
          <Icon name={"close"} size={40} color={WHITE} />
        </TouchableOpacity>
      </View>
      <View style={{ flex: 0.8 }}>
        {/* <YouTube
          videoId={"http://www.youtube.com/embed/" + url}
          fullscreen
          loop
          style={styles.youtubeView}
          resumePlayAndroid={false}
        /> */}
        <WebView
          // source={{
          //   uri:
          //     "http://www.youtube.com/embed/" +
          //     url +
          //     "?rel=0&autoplay=1&showinfo=0&controls=1&fullscreen=1&allowfullscreen='allowfullscreen'",
          // }}
          source={{
            uri:
              `http://www.youtube.com/embed/t7VAwBfJWYE?rel=0&autoplay=1&showinfo=0&controls=1&fullscreen=1&allowfullscreen='allowfullscreen'`,
          }}
          style={{
            margin: RFValue(10),
            marginTop: RFValue(50),
            maxHeight: height / 2,
            zIndex: 100,
          }}
          renderLoading={LoadingIndicatorView}
          startInLoadingState={true}
          allowsFullscreenVideo={true}
          javaScriptEnabled={true}
          scrollEnabled={false}
          startInLoadingState={true}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0,0.2)",
  },
  closeIcon: {
    paddingLeft: 20,
    position: "absolute",
    zIndex: 2,
    top: Platform.OS == "ios" ? RFValue(50) : RFValue(20),
  },
  youtubeView: {
    alignSelf: "stretch",
    height: height / 2,
    borderRadius: 10,
    margin: RFValue(10),
    marginTop: Platform.OS == "ios" ? RFValue(50) : RFValue(20),
  },
});

export default (YoutubePlayer = React.memo(YoutubePlayer));
