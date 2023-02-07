import React from "react";
import { StyleSheet, View, Animated, Dimensions } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import GLOBALS from "@constants";

const { COLOR } = GLOBALS;
/**COmponent with Bottom Up Animation */
export default (BottomUp = (props) => {
  let { showModal = false, RenderView = () => null } = props;
  let animation = new Animated.Value(0);
  handleOpen = () => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };
  handleClose = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };
  const screenHeight = Dimensions.get("window").height;

  const backdrop = {
    transform: [
      {
        translateY: animation.interpolate({
          inputRange: [0, 0.01],
          outputRange: [screenHeight, 0],
          extrapolate: "clamp",
        }),
      },
    ],
    opacity: animation.interpolate({
      inputRange: [0.01, 0.5],
      outputRange: [0, 1],
      extrapolate: "clamp",
    }),
  };

  const slideUp = {
    transform: [
      {
        translateY: animation.interpolate({
          inputRange: [0.01, 1],
          outputRange: [0, -1 * screenHeight],
          extrapolate: "clamp",
        }),
      },
    ],
  };
  showModal == true ? this.handleOpen() : this.handleClose();
  return (
    <View style={styles.container}>
      <Animated.View style={[StyleSheet.absoluteFill, styles.cover, backdrop]}>
        <View style={[styles.sheet]}>
          <Animated.View style={[styles.popup, slideUp]}>
            <RenderView />
          </Animated.View>
        </View>
      </Animated.View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  cover: {
    backgroundColor: "transparent",
  },
  sheet: {
    position: "absolute",
    top: Dimensions.get("window").height,
    left: 0,
    right: 0,
    height: "100%",
    justifyContent: "flex-end",
  },
  popup: {
    backgroundColor: COLOR.WHITE,
    borderTopLeftRadius: RFPercentage(5),
    borderTopRightRadius: RFPercentage(5),
    alignItems: "center",
    justifyContent: "flex-start",
    minHeight: RFPercentage(55),
  },
});
