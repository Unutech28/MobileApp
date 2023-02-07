// @ts-nocheck
import * as AppActions from '@actions';
import {navigatorPop, navigatorPush} from '@config/navigationOptions';
import GLOBALS from '@constants';
import moment from 'moment';
import React, {Component, lazy} from 'react';
import {StyleSheet, View} from 'react-native';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
const {COLOR} = GLOBALS;
const NotJustYouComponent = lazy(() =>
  import('@components/dashboard/selectWeek/notJustYou'),
);
import * as ICONS from '@images';
const Header = lazy(() => import('@components/common/Header'));
//import { PRODUCT_TYPE } from 'react-native-dotenv';
import Styles from '../styles';

class NotJustYou extends Component {
  constructor(props) {
    super(props);
    this.state = {
      apiCall: 0,
      notJustYouData: [
        {
          _id: 0,
          name: '1 in 3 women have post-partum blues.',
        },
        {
          _id: 1,
          name: 'Post Partum Depression (PPD) is difficult.',
        },
        {
          _id: 2,
          name: "It's curable if taken care of early.",
        },
        {
          _id: 3,
          name: 'Stella is here to help',
        },
      ],
      refresh: false,
    };
  }

  _onPressAddSymptom = symptomInput => {
    this.setState({isMoodUpdate: false});
    let {loginData, user_language} = this.props;
    this.props.AppActions.postAddSymptom({
      user_id: loginData['user']['_id'],
      ...symptomInput,
    }, "", "", "", user_language);
  };

  render() {
    let {
      componentId,
      GetAllSymptomsData,
      isGetAllSymptomsLoading,
      isRefreshingSymptomsList,
      /* Type Appt */
      PostSymptomData,
      isPostSymptomLoading,
    } = this.props;

    return (
      <View style={Styles.homeContainer}>
        {/* <Header
          isLeftIcon={true}
          isTitle={true}
          onLeftIconClick={() => {
            navigatorPop({ componentId });
          }}
          title="Not Just You"
        /> */}
        <Header
          isLeftIcon={true}
          isRightIcon={false}
          onLeftIconClick={() => {
            navigatorPop({componentId});
          }}
          isMiddleIcon={true}
        />
        <View style={{flex: 0.9, paddingHorizontal: RFValue(16)}}>
          <View style={{flex: 1}}>
            <NotJustYouComponent
              notJustYouData={this.props.data}
              addSymptom={this._onPressAddSymptom}
              isRefresh={this.state.refresh}
            />
          </View>
        </View>
      </View>
    );
  }
}

const mapStateToProps = ({authReducer, dashboardReducer}) => ({
  /* Login */
  isLoggedIn: authReducer.isLoggedIn,
  loginData: authReducer.loginData,
  /* Symptom QA list */
  GetAllSymptomsData: dashboardReducer.GetAllSymptomsData,
  isGetAllSymptomsLoading: dashboardReducer.isGetAllSymptomsLoading,
  isRefreshingSymptomsList: dashboardReducer.isRefreshingSymptomsList,
  user_language: authReducer.language,
});
const mapDispatchToProps = dispatch => ({
  AppActions: bindActionCreators(AppActions, dispatch),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NotJustYou);

