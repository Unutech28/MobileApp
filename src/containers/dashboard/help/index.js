// @ts-nocheck
import * as AppActions from '@actions/';
import React, { Component, lazy } from 'react';
import {
  StyleSheet,
  View,
  Alert,
  Modal,
  Dimensions,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { navigatorPush, navigatorPop } from '@config/navigationOptions';
import GLOBALS from '@constants';
const { STRINGS, SETTINGS_TABS, COLOR, FONTS } = GLOBALS;
import { RFValue, RFPercentage } from 'react-native-responsive-fontsize';
const Header = lazy(() => import('@components/common/Header'));
const YoutubePlayer = lazy(() =>
  import('@components/dashboard/modals/YoutubePlayer'),
);
const PdfViewer = lazy(() => import('@components/dashboard/modals/PdfViewer'));
import Theme from '@components/common/styles';
import * as Images from '@images';
// import ReportComponent from '@components/reports'
const ScheduleTab = lazy(() => import('@components/dashboard/symptoms/tabs'));
// import YouTube from 'react-native-youtube';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
const { width, height } = Dimensions.get('window');
const isiOS = Platform.OS == 'ios';
import Pdf from 'react-native-pdf';
const { GREY, DARK_GREEN } = COLOR;
import { WebView } from 'react-native-webview';
import RenderHtml from "react-native-render-html";

// import styles from './styles';

import { strings } from '@localization';

class Help extends Component {
  tabs = [{ title: strings.tab3.video, id: 1 }, { title: strings.tab3.doc, id: 1 }];
  constructor(props) {
    super(props);
    this.state = {
      activeHelpTab: 'Video',
      documentUrl: '',
      showModal: false,
      showPdfModal: false,
    };
    this._fetchHelpAPI();
  }

  _fetchHelpAPI() {
    // let { loginData } = this.props;
    this.props.AppActions.getHelp();
  }

  _setActiveHelpTab = tabName => {
    if (this.state.activeHelpTab != tabName) {
      this.setState({ activeHelpTab: tabName });
    }
    // this.fetchTypeAppointment(tabName);
  };

  showPdf(item, type) {
    if (type == 'video') {
      this.setState({
        documentUrl: item.video,
        showModal: true,
      });
    } else {
      this.setState({
        documentUrl: item.type,
        showPdfModal: true,
      });
    }
  }

  renderCard = (item, index, type) => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.showPdf(item, type);
        }}
        style={styles.rowContainer}>
        {/* <Image source={Images.rectangle} style={styles.greenContainer} /> */}
        <View style={styles.greenContainer} />
        <Text style={styles.textStyle}>{item?.name}</Text>

        <Image
          source={Images.darkForward}
          resizeMode="contain"
          style={styles.arrowImage}
        />
      </TouchableOpacity>
    );
  };
  renderCardDocs = (item, index, type) => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.showPdf(item, type);
        }}
        style={styles.rowContainer}>
        {/* <Image source={Images.rectangle} style={styles.greenContainer} /> */}
        <View style={styles.greenContainer} />
        {/* <Text style={styles.textStyle}>{item.name ? item.name : item.desc}</Text> */}
        <View style={{ marginLeft: 10 }}>
          <RenderHtml
            contentWidth={"100%"}
            source={{ html: item.type }}
          // tagsStyles={styles.textStyle}
          // renderersProps={renderersProps}
          // tagsStyles={styles.textStyle}
          />
        </View>

        <Image
          source={Images.darkForward}
          resizeMode="contain"
          style={[styles.arrowImage, { position: 'absolute', right: 10 }]}
        />
      </TouchableOpacity>
    );
  };




  render() {
    let { componentId, getHelpResponse, loginData } = this.props;
    let { activeHelpTab } = this.state;
    return (
      <View style={styles.homeContainer}>
        <Header
          isLeftIcon={false}
          isTitle={true}
          title={strings.tab.help}
          isLogout={false}
          titleStyle={{
            //  fontSize: RFValue(28),
            paddingTop: RFValue(10),
          }}
        />
        <View style={{ flex: 0.85 }}>
          <View style={{}}>
            <ScheduleTab
              customStyle={{
                marginTop: RFValue(30),
              }}
              tabList={this.tabs}
              activeTab={activeHelpTab}
              setActiveTab={this._setActiveHelpTab}
            />
          </View>
          <View style={{ flex: 1, marginTop: 10 }}>
            {activeHelpTab === strings.tab3.video ? (
              <FlatList
                style={{ marginTop: RFValue(10) }}
                data={
                  getHelpResponse !== undefined ? getHelpResponse?.videos : []
                }
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                keyExtractor={item => `${item._id}`}
                renderItem={({ item, index }) =>
                  this.renderCard(item, index, 'video')
                }
              />
            ) : null}

            {activeHelpTab === strings.tab3.doc ? (
              <FlatList
                style={{ marginTop: RFValue(10) }}
                data={
                  getHelpResponse !== undefined ? getHelpResponse?.help : []
                }
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                keyExtractor={item => `${item._id}`}
                renderItem={({ item, index }) =>
                  this.renderCardDocs(item, index, 'doc')
                }
              />
            ) : null}
          </View>
        </View>

        <Modal
          transparent={true}
          visible={this.state.showModal}
          onRequestClose={() => {
            this.setState({ showModal: false });
          }}>
          <YoutubePlayer
            closeModal={() => {
              this.setState({ showModal: false });
            }}
            url={this.state.documentUrl}
          />
        </Modal>

        <Modal
          transparent={true}
          visible={this.state.showPdfModal}
          onRequestClose={() => {
            this.setState({ showPdfModal: false });
          }}>
          {/* <WebView
            originWhitelist={['*']}
            source={{ html: "<p>vansh</p>" }}
            style={{
              margin: RFValue(10),
              marginTop: RFValue(50),
              maxHeight: RFValue(300)
              // maxHeight: height / 2,
              // zIndex: 100,
            }}
            startInLoadingState={true}
            allowsFullscreenVideo={true}
            javaScriptEnabled={true}
            scrollEnabled={false}
          /> */}
          <PdfViewer
            closeModal={() => {
              this.setState({ showPdfModal: false });
            }}
            url={this.state.documentUrl}
            type={this.state.documentUrl}
          />
        </Modal>
      </View>
    );
  }
}
const mapStateToProps = ({ authReducer, dashboardReducer }) => ({
  loginData: authReducer.loginData,
  getHelpResponse: dashboardReducer.getHelpResponse,
});
const mapDispatchToProps = dispatch => ({
  AppActions: bindActionCreators(AppActions, dispatch),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Help);
const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    backgroundColor: COLOR.WHITE
  },
  youtubeView: {
    alignSelf: 'stretch',
    height: height / 2,
    borderRadius: 10,
    margin: RFValue(10),
    marginTop: RFValue(50),
  },
  forwordImage: { height: RFValue(16), width: RFValue(16) },
  pdfStyle: {
    padding: 20,
    flex: 1,
    height: Dimensions.get('window').height,
    shadowOffset: { width: 1, height: RFValue(0.2) },
    shadowOpacity: 0.4,
    shadowRadius: RFValue(8),
    shadowColor: COLOR.DARK_GREEN,
    borderRadius: RFValue(10),
  },

  /**Vide CSS */
  rowContainer: {
    borderWidth: 0.5,
    flexDirection: 'row',
    marginTop: RFPercentage(1.2),
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: RFValue(7),
    borderColor: GREY,
    overflow: 'hidden',
    backgroundColor: COLOR.WHITE,
  },
  greenContainer: {
    height: RFValue(65),
    width: RFValue(90),
    overflow: 'hidden',
    backgroundColor: COLOR.DARK_GREEN,
  },
  textStyle: {
    alignSelf: 'center',
    paddingLeft: RFValue(13),
    fontFamily: FONTS.MEDIUM,
    fontSize: RFValue(isiOS ? RFValue(13) : RFValue(16)),
    color: COLOR.LIGHT_BLACK,
    fontWeight: '500',
    flex: 0.8,
  },
  arrowImage: { alignSelf: 'center', flex: 0.2 },
})
