/* eslint-disable prettier/prettier */
/* eslint-disable module-resolver/use-alias */
import GLOBALS from '@constants';
import { ThemeContext } from '@hoc/withRedux';
import React, { Component, lazy } from 'react';
import { StyleSheet, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { navigatorPop, navigatorPush } from '@config/navigationOptions';
const { COLOR } = GLOBALS;
const Header = lazy(() => import('@components/common/Header'));
import { WebView } from 'react-native-webview';
import Styles from '../styles';
class FuildPlayer extends Component {
  static contextType = ThemeContext;
  constructor(props) {
    super(props);
    this.state = {
      refresh: false,
    };
  }

  render() {
    let {
      componentId,
      videoLinl
    } = this.props;
    return (
      <View style={Styles.homeContainer}>
        <Header
          isLeftIcon={true}
          isTitle={true}
          isRightIcon={false}
          onLeftIconClick={() => {
            navigatorPop({ componentId });
          }}
          title='Postpartum CBT'
        />
        <View style={{ flex: 0.9, paddingHorizontal: RFValue(1) }}>
          <WebView source={{ uri: videoLinl }} style={{ borderTopLeftRadius: 10, borderTopRightRadius: 10 }} />
        </View>
      </View>
    );
  }
}

export default FuildPlayer;

