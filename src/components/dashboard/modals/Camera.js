import React, { Component, lazy } from "react";
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Linking,
  Vibration,
  Platform,
} from "react-native";
const Header = lazy(() => import("@components/common/Header"));
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as AppAction from "@actions";
import { RNCamera } from "react-native-camera";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as Images from "@images";
import { RFValue, RFPercentage } from "react-native-responsive-fontsize";
import GLOBALS from "@constants";
// import { openCamera, openImagePicker } from "../../../utils/functions";
import { openCamera, openImagePicker } from "../../../utils/functions";
import { strings } from "@localization";

const { STRINGS, SETTINGS_TABS, COLOR, FONTS } = GLOBALS;
var interval;
class Camera extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cameraType: "back",
      flash_type: true,
      mediaData: null,
      mediaType: "image",
      address: "",
      timerValue: 0,
      recordingStarted: false,
      showPause: true,
      modalVisible: false,
      note_txt: "",
      base64: ''
    };
  }
  navigator = (type) => {
    // return;
    switch (type) {
      case "toggle_camera":
        this.state.cameraType == "back"
          ? this.setState({ cameraType: "front" })
          : this.setState({ cameraType: "back" });
        break;
      case "toggle_flash":
        this.state.flash_type == true
          ? this.setState({ flash_type: true })
          : this.setState({ flash_type: true });
        break;
      case "back":
        this.props.closeModal();
        break;
      case "take_picture":
        if (this.camera) {
          if (this.state.mediaData == null) {
            const options = { quality: 0.3, base64: true };
            this.camera.takePictureAsync(options).then((data) => {

              this.setState({ mediaData: data.uri, base64: data.response.data });
            });
          }
        }
        if (this.state.mediaData != null) {
          this.props.onMediaSelect(this.state.mediaData, this.state.base64);
        }
        break;

        break;
      default:
        break;
    }
  };

  captureMedia = () => {
    this.navigator("take_picture");
  };

  getImageUrl = (url, file) => {
    console.log("file==>", url);
    this.setState({ mediaData: url.uri, base64: url.response.data });
  };

  getUnauthorizeView = () => {
    return (
      <View style={styles.permissionContainer}>
        <TouchableOpacity
          onPress={() => {
            Linking.openSettings();
            this.navigator("back");
          }}
        >
          <Text style={styles.permissionText}>
            {strings.camera.unablePermission + " "}
            <Text style={styles.permissionTextBold}>
              {" "}
              {strings.camera.clickHere}{" "}
            </Text>{" "}
            {strings.camera.to}
            {strings.camera.enableSetting}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  afterSelectHeader = () => {
    return (
      <View style={styles.retaKeView}>
        <Text
          onPress={() => this.setState({ mediaData: null, timerValue: 0 })}
          style={styles.retakeViewText}
        >
          {strings.camera.retake}
        </Text>
        <Text
          // onPress={() => this.navigator("back")}
          style={styles.retakeViewTextTitle}
        >
          {strings.camera.setProfilePhoto}
        </Text>
        <Text
          onPress={() => this.navigator("back")}
          style={styles.retakeViewText}
        >
          {strings.camera.cancel}
        </Text>
      </View>
    );
  };

  afterImageSelection = () => {
    return (
      <View style={[styles.footerContainer, { flex: 1 }]}>
        {this.state.mediaType == "image" && (
          <Image
            source={{ uri: this.state.mediaData }}
            style={{ flex: 1 }}
            resizeMethod={"resize"}
          />
        )}
        <View style={{ alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => {
              this.captureMedia();
            }}
            style={[styles.capture]}
          >
            <Image
              style={styles.camera_capture}
              resizeMode={"contain"}
              source={Images.camera_send}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  render() {
    return (
      <View style={styles.container}>
        {this.state.mediaData == null ? (
          <View style={[styles.headerBar]}>
            <TouchableOpacity
              style={[styles.back_btn, {}]}
              onPress={() => {
                this.props.closeModal();
              }}
            >
              <Ionicons name="chevron-back" color={COLOR.WHITE} size={40} />
            </TouchableOpacity>

            <View style={styles.titleView}>
              <Text
                style={[
                  styles.headerText,
                  {
                    color: COLOR.WHITE,
                  },
                ]}
              >
                {strings.camera.uploadProfile}
              </Text>
            </View>
            <View style={{ flex: 0.2 }} />
          </View>
        ) : (
          // />
          this.afterSelectHeader()
        )}
        {this.state.mediaData ? (
          this.afterImageSelection()
        ) : (
          <View
            style={{ flex: 1, backgroundColor: 'black' }}
          >

            <View style={styles.preview}>
              <View style={styles.footerContainer}>
                <View
                  style={{
                    flex: 0,
                    // flexDirection: "row",
                    justifyContent: "space-around",
                    width: "100%",
                  }}
                >
                  {this.state.mediaData == null && (
                    <TouchableOpacity
                      onPress={() => {
                        openImagePicker(this.getImageUrl);
                        // this.navigator("gallery")
                      }}
                      style={styles.toggleCamera}
                    >
                      {/* <Image
                          style={styles.camera_options}
                          resizeMode={'contain'}
                          source={Images.flash}></Image> */}
                      <Ionicons
                        name="image"
                        color={COLOR.WHITE}
                        size={60}
                      />
                    </TouchableOpacity>
                  )}
                  {this.state.mediaData == null && (
                    <TouchableOpacity
                      onPress={() => {
                        openCamera(this.getImageUrl);
                        // this.navigator("gallery")
                      }}
                      style={styles.toggleCamera}
                    >
                      {/* <Image
                          style={styles.camera_options}
                          resizeMode={'contain'}
                          source={Images.flash}></Image> */}
                      <Ionicons
                        name="camera"
                        color={COLOR.WHITE}
                        size={60}
                      />
                    </TouchableOpacity>
                  )}

                  {/* <TouchableOpacity
                  onPress={() => {
                    this.captureMedia();
                  }}
                  style={[styles.capture]}
                >
                  {this.state.mediaData != null ? (
                    <Image
                      style={styles.camera_capture}
                      resizeMode={"contain"}
                      source={Images.camera_send}
                    />
                  ) : (
                    <Image
                      style={styles.camera_capture}
                      resizeMode={"contain"}
                      source={Images.camera_capture}
                    />
                  )}
                </TouchableOpacity> */}

                  {/* {this.state.mediaData == null && (
                  <TouchableOpacity
                    onPress={() => {
                      // this.navigator("toggle_camera");
                    }}
                    style={styles.toggleCamera}
                  >
                    <Image
                      style={styles.camera_options}
                      resizeMode={"contain"}
                      source={Images.camera_flip}
                    />
                  </TouchableOpacity>
                )} */}
                </View>
              </View>
            </View>

          </View>
        )}
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  // app: state.app,
  // user: state.user,
  // patient_list: state.patient.patient_list,
  // aide: state.aide,
  // schedule: state.schedule,
});

const mapDispatchToProps = (dispatch) => ({
  AppAction: bindActionCreators(AppAction, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Camera);

const PendingView = () => (
  <View style={styles.permissionContainer}>
    <TouchableOpacity
      onPress={() => {
        Linking.openSettings();
        this.navigator("back");
      }}
    >
      <Text style={styles.permissionText}>{strings.camera.initializing}</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // flexDirection: 'column',
  },
  preview: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  capture: {
    flex: 0,
    borderRadius: RFValue(38),
    height: RFValue(76),
    width: RFValue(76),
    justifyContent: "center",
    alignItems: "center",
    margin: RFValue(20),
  },
  toggleCamera: {
    justifyContent: "center",
    alignItems: "center",
    flex: 0,
    height: RFValue(55),
    width: RFValue(55),
    margin: RFValue(20),
  },

  locationText: {
    color: "#ffffff",
    paddingLeft: RFValue(5),
    textAlign: "center",
    marginHorizontal: 5,
  },
  retaKeView: {
    backgroundColor: COLOR.BLACK,
    width: "100%",
    //  height: RFValue(50),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    zIndex: 3,
    paddingTop: RFValue(50),
  },
  retakeViewText: {
    color: COLOR.WHITE,
    fontFamily: FONTS.MEDIUM,
    fontSize: RFValue(12),
  },
  retakeViewTextTitle: {
    color: COLOR.WHITE,
    fontFamily: FONTS.MEDIUM,
    fontWeight: "700",
    fontSize: RFValue(15),
  },
  timerText: {
    color: "#ffffff",
    textAlign: "center",
  },

  /**Camera Footer Styling **/
  camera_options: {
    height: RFValue(25),
    width: RFValue(25),
  },
  camera_capture: {
    height: RFValue(70),
    width: RFValue(70),
  },
  footerContainer: { backgroundColor: "black", paddingVertical: RFValue(10) },

  /**Permission Styes */
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: RFValue(10),
  },
  permissionText: {
    color: COLOR.WHITE,
    fontFamily: FONTS.REGULAR,
    fontSize: RFValue(12),
    textAlign: "center",
  },
  permissionTextBold: {
    fontFamily: FONTS.BOLD,
    textDecorationLine: "underline",
  },

  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    zIndex: 2,
    backgroundColor: "black",
    paddingTop: RFValue(40),
  },
  back_btn: {
    paddingHorizontal: RFValue(10),
    paddingVertical: RFValue(5),
    backgroundColor: "transparent",
  },
  headerText: {
    color: COLOR.WHITE,
    fontFamily: FONTS.MEDIUM,
    fontSize: RFValue(19),
  },
  titleView: {
    alignItems: "center",
    flex: 1,
  },
});
