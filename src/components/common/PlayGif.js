import React, { useEffect, useState } from "react";
import { View, Text, Platform, ActivityIndicator } from "react-native";
import Video from "react-native-video";
import GLOBALS from "@constants";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { WebView } from "react-native-webview";

const { COLOR } = GLOBALS;

const Gif = ({ url, thumbnail }) => {
  const [videoUrl, setVideoUrl] = useState(url);
  const [videoThumbnail, setVideoThumbnail] = useState(thumbnail);
  const [imageLoading, setLoading] = useState(true);

  useEffect(() => {
    console.log("data===>", thumbnail);
    setVideoUrl(url ? url : "");
    setVideoThumbnail(thumbnail ? thumbnail : "");
  }, [url, thumbnail]);
  const iframeHtml = `<iframe src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" frameborder="0" width="200" height="200" style="height:200px;width:200px;"></iframe>`;
  const head = `<style>body{margin:0}</style><meta name="viewport" content="width=device-width, initial-scale=1">`;
  const html = `<!DOCTYPE html><html><head>${head}</head><body>${iframeHtml}</body></html>`;
  return (
    <Video
      repeat={true}
      // resizeMode="cover"
      resizeMode="contain"
      paused={false}
      source={{
        uri: videoUrl,
        initOptions: ["--codec=avcodec"],
      }}
      poster={videoThumbnail}
      playInBackground={false}
      playWhenInactive={false}
      pictureInPicture={true}
      onLoad={() => setLoading(false)}
      style={[
        {
          // backgroundColor: 'transparent',
          minHeight: 200,
          borderRadius: 10,
          // height: RFValue(0),
          width: "100%",
          backgroundColor: COLOR.WHITE,
        },
      ]}
      onError={(err) => console.log("Video errororr", err)}
    />
  );
};

export default Gif;
