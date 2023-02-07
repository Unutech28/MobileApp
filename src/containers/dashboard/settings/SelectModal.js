// @ts-nocheck
import * as AppActions from '@actions/';
import React, { Component, lazy } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import GLOBALS from '@constants';
const { COLOR, FONTS } = GLOBALS;
import { RFValue } from 'react-native-responsive-fontsize';
const Header = lazy(() => import('@components/common/Header'));
import * as Images from '@images';
import ButtonNew from '@components/common/buttonNew';
import { strings } from '@localization';
import { alertWithOneBtn } from '@helpers/common';
import Styles from './styles';
class SelectModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      language: [],
      selected_language: 'en'
    };
  }

  /**Initalize state variable */
  componentDidMount() {
    this.setState({
      selected_language: this.props.user_language,
      language: [
        { label: strings.profile.english, value: 'en' },
        { label: strings.profile.spanish, value: 'es' },
        { label: strings.profile.German, value: 'de' },
        { label: strings.profile.hindi, value: 'hi' }]
    })
  }

  /**Handle clik event when click on language and save button */
  clickHandler = (type, data) => {
    switch (type) {
      case "item_click":
        this.setState({
          selected_language: data.value
        })
        break;
      case "save":
        strings.setLanguage(this.state.selected_language);
        alertWithOneBtn(
          strings.profile.success,
          strings.profile.lang_success,
          GLOBALS.STRINGS.LOGOUT_OK,
        ).then(res => {
          setTimeout(() => {
            closeModal();
          }, 300);
          this.props.AppActions.updateLanguage(this.state.selected_language)
        });
        break;

      default:
        break;
    }
  }

  render() {
    let { closeModal } = this.props;
    let { } = this.state;

    return (
      <View style={Styles.container}>
        <Header
          isLeftIcon={true}
          isRightIcon={false}
          onLeftIconClick={() => {
            closeModal();
          }}
          isLogout={false}
          isTitle={true}
          title={strings.profile.Language}
          titleStyle={{ fontSize: RFValue(28), paddingTop: RFValue(10) }}
        />
        <View style={Styles.innerContainer}>
          {this.state.language.map((item, index) => {
            return (
              <TouchableOpacity
                onPress={() => this.clickHandler('item_click', item)}
                style={Styles.itemContainer}>
                <Text style={Styles.titleTextModal}>{item.label}</Text>
                <Image
                  resizeMode="contain"
                  source={
                    item.value == this.state.selected_language ? Images.GreenCircle1 : Images.WhiteCircle1
                  }
                  style={Styles.radioButton}
                />
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={Styles.submitContainer}>
          <ButtonNew
            text={strings.profile.save.toUpperCase()}
            onBtnPress={() => this.clickHandler('save')}
          />
        </View>
      </View>
    );
  }
}
const mapStateToProps = ({ authReducer }) => ({
  user_language: authReducer.language,
});
const mapDispatchToProps = dispatch => ({
  AppActions: bindActionCreators(AppActions, dispatch),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SelectModal);

