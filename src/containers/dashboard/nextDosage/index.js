// @ts-nocheck
import * as AppActions from '@actions';
import { navigatorPop } from '@config/navigationOptions';
import GLOBALS from '@constants';
import React, { Component, lazy } from 'react';
import { StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Styles from './styles';
const { COLOR } = GLOBALS;
let defaultSearch = {
  inputText: '',
  data: null,
  keyToSearch: '', isActive: false,
}
const NextDosageComponent = lazy(() =>
  import('@components/dashboard/nextDosage'),
);
const Header = lazy(() => import('@components/common/Header'));
class NextDosage extends Component {
  constructor(props) {
    super(props);
    this.isHeader = true;
  }
  componentDidMount() {
    let { loginData } = this.props;
    this.props.AppActions.getNextDose({ user_id: loginData['user']['_id'] });
  }
  _refreshDose = () => {
    let { loginData } = this.props;
    this.props.AppActions.getNextDose({
      user_id: loginData['user']['_id'],
      isRefresh: true,
    });
  };
  _toggleSearch = () => {
    this.isHeader = !this.isHeader;
  };
  _findText = (userProps = defaultSearch) => {
    let { nextDoseData } = this.props;
    this.props.AppActions.postSearchData({
      ...userProps,
      keyToSearch: 'medicineName',
      data: nextDoseData,
    });
  };

  render() {
    let {
      componentId,
      nextDoseData,
      isDoseLoading,
      isDoseRefreshing,
      searchData,
      searchInput, searchActive,
    } = this.props;

    return (
      <View style={Styles.homeContainer}>
        {/* <Header
          isLeftIcon={true}
          isTitle={true}
          isRightIcon={true}
          onLeftIconClick={() => {
            navigatorPop({ componentId });
          }}
          onRightIconClick={this._findText}
          findText={this._findText}
          title="Next Dose"
        /> */}
        <Header
          isLeftIcon={true}
          isRightIcon={false}
          onLeftIconClick={() => {
            navigatorPop({ componentId });
          }}
          isMiddleIcon={true}
        />
        <NextDosageComponent
          data={nextDoseData}
          searchText={searchInput}
          searchActive={searchActive}
          searchFiltered={searchData}
          doseLoader={isDoseLoading}
          isDoseRefreshing={isDoseRefreshing}
          onRefreshDoseList={this._refreshDose}
        />
      </View>
    );
  }
}

const mapStateToProps = ({ authReducer, dashboardReducer }) => ({
  isNextDoseSuccess: dashboardReducer.isNextDoseSuccess,
  isNextDoseFail: dashboardReducer.isNextDoseFail,
  nextDoseData: dashboardReducer.nextDoseData,
  isDoseLoading: dashboardReducer.isDoseLoading,
  isDoseRefreshing: dashboardReducer.isDoseRefreshing,

  searchData: dashboardReducer.searchData,
  searchInput: dashboardReducer.searchInput,
  searchActive: dashboardReducer.searchActive,

  isLoggedIn: authReducer.isLoggedIn,
  loginData: authReducer.loginData,
});
const mapDispatchToProps = dispatch => ({
  AppActions: bindActionCreators(AppActions, dispatch),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NextDosage);
