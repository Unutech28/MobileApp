import React, { useState, useEffect } from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  Dimensions,
  Text,
  ActivityIndicator,
  Platform,
} from 'react-native';
import tempStyle from '@components/dashboard/dailyLearningTemplates/globalTemplateStyle';
import Video from 'react-native-video';
import { RFValue } from 'react-native-responsive-fontsize';
import GLOBALS from '@constants';
import Icon from 'react-native-vector-icons/Ionicons';
// import YouTube from 'react-native-youtube';
import { WebView } from 'react-native-webview';
import Orientation from 'react-native-orientation-locker';
const { width, height } = Dimensions.get('window');
const { STRINGS, COLOR, FONTS } = GLOBALS;
const { PRIMARY, WHITE, GREY } = COLOR;
function CustomVideoPlayer(props) {
  const { closeModal, url } = props;
  const [videoLoading, setVideoLoading] = useState(false);
  const [videoUrl, setUrl] = useState('');
  const [orientation, setOrientation] = useState(
    Orientation.getInitialOrientation(),
  );
  useEffect(() => {
    setUrl(url);
    Orientation.unlockAllOrientations();
    Dimensions.addEventListener('change', () => {
      Orientation.getOrientation(orientation => {
        setOrientation(orientation);
      });
    });
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        hitSlop={{ right: 20, left: 20, top: 20, bottom: 20 }}
        onPress={() => {
          if (this.player) {
            this.player.setNativeProps({ paused: true });
          }
          closeModal();
        }}
        style={
          orientation != 'PORTRAIT'
            ? styles.closeIcon
            : styles.closeIconPortarit
        }>
        <Icon name={'close'} size={50} color={WHITE} />
      </TouchableOpacity>
      <View style={styles.videoContainer}>
        {videoUrl != '' && (
          // <Video
          //   ref={ref => {
          //     this.player = ref;
          //   }}
          //   controls={true}
          //   resizeMode="contain"
          //   paused={false}
          //   style={[styles.backgroundVideo]}
          //   onEnd={() => {
          //     if (this.player) {
          //       this.player.setNativeProps({ paused: true });
          //     }
          //   }}
          //   onLoadStart={() => {
          //     setVideoLoading(true);
          //   }}
          //   onLoad={() => {
          //     setVideoLoading(false);
          //     if (this.player) {
          //       this.player.seek(0.5);
          //     }
          //   }}
          //   source={{ uri: videoUrl }}
          //   //   source={{ uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' }}
          //   // source={{ uri: 'https://dbstorageiqbcqbtqd7x7e.blob.core.windows.net/curio/upload/0.891059294785622--W1introvideo.mov?st=2022-06-28T07%3A29%3A59Z&se=2022-06-28T10%3A49%3A59Z&sp=r&sv=2018-03-28&sr=b&sig=rXONcauAoRqEV2z5Od7jZjqTtVjwKoGlItwgJrdn0Ms%3D' }}
          //   playInBackground={false}
          //   hideShutterView={true}
          //   poster={"https://stella-careportal.curio-dtx.com/upload/video-icon-thumbnail.jpg"}
          // />
          <Video
            ref={ref => {
              this.player = ref;
            }}
            onLoad={() => {
              setVideoLoading(false);
            }}
            onLoadStart={() => {
              setVideoLoading(true);
            }}
            source={{
              uri: videoUrl
            }}
            style={[styles.backgroundVideo]}
            onBuffer={buffer => { }}
            onError={error => { }}
            controls={true}
            paused={false}
            fullscreen={true}
            playInBackground={false}
            hideShutterView={true}
            poster={"https://stella-careportal.curio-dtx.com/upload/video-icon-thumbnail.jpg"}
          />
        )}
      </View>

      {videoLoading && (
        <View
          style={{
            position: 'absolute',
            bottom: height / 2,
            justifyContent: 'center',
            left: width / 2,
            alignItems: 'center',
            // height: 200,
            zIndex: 3,
          }}>
          <ActivityIndicator size={25} color={COLOR.WHITE} />
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0,0.8)',
  },
  closeIcon: {
    paddingLeft: 30,
    position: 'absolute',
    zIndex: 2,
    top: Platform.OS == 'ios' ? RFValue(20) : RFValue(20),
  },
  closeIconPortarit: {
    paddingLeft: 30,
    position: 'absolute',
    zIndex: 2,
    top: Platform.OS == 'ios' ? RFValue(40) : RFValue(20),
  },
  backgroundVideo: {
    borderRadius: 10,
    height: '100%',
    width: '100%',
    backgroundColor: COLOR.BLACK,
    zIndex: 1,
  },
  videoContainer: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default (CustomVideoPlayer = React.memo(CustomVideoPlayer));
