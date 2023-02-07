// @ts-nocheck
import * as AppActions from '@actions';
import { navigatorPop, navigatorPush } from '@config/navigationOptions';
import GLOBALS from '@constants';
import moment from 'moment';
import React, { Component, lazy } from 'react';
import { StyleSheet, View } from 'react-native';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
const { COLOR } = GLOBALS;
const CircleOfTrust = lazy(() => import('@components/dashboard/selectWeek/circleOfTrust'));
import * as ICONS from '@images';
const Header = lazy(() => import('@components/common/Header'));
import Styles from '../styles';
class CircleOFTrust extends Component {
  constructor(props) {
    super(props);
    this.state = {
      apiCall: 0,
      refresh: false,
      isCreateCircle: false,
      circleOfTrustInnerData: '',
      apiCalling: false,
      responseData: {}
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.apiCalling) {
      if (this.props.QuesAnsData !== undefined) {
        if (this.props.QuesAnsData !== prevState.responseData) {
          this.updateData()
          this.setState({
            responseData: this.props.QuesAnsData,
            apiCalling: false,
          })
        }
      }
    }
  }

  _onPressAddSymptom = symptomInput => {
    this.setState({ isMoodUpdate: false })
    let { loginData, user_language } = this.props;
    this.props.AppActions.postAddSymptom({
      user_id: loginData['user']['_id'],
      ...symptomInput,
    }, "", "", "", user_language);
  };

  goToCreateCircleClick = (data) => {
    // alert('circle click')
    this.setState({
      isCreateCircle: true,
      circleOfTrustInnerData: data
    })
  }
  // onSubmitClick = () => {
  //   let { componentId } = this.props;
  //   navigatorPop({ componentId })
  // }

  onSubmitClick = () => {
    // let data = this.state.circleOfTrustInnerData
    let data = this.props.data.childrens[0]
    let { loginData } = this.props;
    let postData = {
      user_id: loginData['user']['_id'],
      card_id: this.props.cardId,
      content_id: data._id,
    }
    let questionDetails = []
    var answerId = ''
    if (data.questions.length)
      for (let obj of data.questions) {
        let detail = {
          question: obj.question,
          answer: obj.answer != undefined ? obj.answer.answer != undefined ? obj.answer.answer : obj.answer : '',
          questionId: obj._id
        }
        questionDetails.push(detail)
        if (obj.answerId != undefined) {
          answerId = obj.answerId
        }
      }
    postData["questiondetailslist"] = questionDetails
    if (answerId != '') {
      postData["_id"] = answerId
    }
    this.setState({ apiCalling: true })

    this.props.AppActions.addQueAnsDataApi(postData, '', '', '', this.props.user_language)
  }

  updateData = () => {
    let {
      index,
      updateDataa,
      data,
      componentId
    } = this.props;


    // for (let obj of data.childrens[0].questions) {
    //   // let answer = {
    //   //   answer: obj.answer == undefined ? '' : obj.answer.answer != undefined ? obj.answer.answer : obj.answer,
    //   //   answers: [],
    //   //   question: obj.question,
    //   //   questionId: obj._id,
    //   //   _id: this.props.QuesAnsData._id,
    //   // }

    //   if (obj.answerId == undefined) {
    //     obj.answerId = this.props.QuesAnsData._id
    //   }
    // }


    // updateData(index, data)
    navigatorPop({ componentId });
  }

  render() {
    let {
      componentId,
      QuesAnsData,
      loginData
    } = this.props;
    let { isCreateCircle, circleOfTrustInnerData, responseData } = this.state;
  

    return (
      <View style={Styles.homeContainer}>

        <View style={{ flex: 0.2 }}>
          <Header
            isLeftIcon={true}
            isRightIcon={false}
            onLeftIconClick={() => {
              !isCreateCircle ? navigatorPop({ componentId })
                :
                this.setState({ isCreateCircle: false })
            }}
            isMiddleIcon={true}
            logoutApi={() => { this.props.AppActions.logout(loginData['user']['_id']); }}
          />
        </View>
        <View style={{ flex: 0.8, backgroundColor: 'white', marginBottom: RFValue(50) }}>
          <CircleOfTrust
            isRefresh={this.state.refresh}
            isCreateCircle={isCreateCircle}
            goToCreateCircleClick={this.goToCreateCircleClick}
            data={this.props.data}
            // circleOfTrustInnerData={circleOfTrustInnerData}
            circleOfTrustInnerData={this.props.data.childrens.length > 0 ?
              this.props.data.childrens[0] : null}
            QuesAnsDataAfterSave={QuesAnsData !== undefined ? QuesAnsData : ''}
            // circleOfTrustInnerData={QuesAnsData QuesAnsData :
            //   this.props.data.childrens !== undefined
            //     && this.props.data.childrens.length > 0 ?
            //     this.props.data.childrens[0] : null}
            submitClick={this.onSubmitClick}
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = ({ authReducer, dashboardReducer }) => ({
  /* Login */
  isLoggedIn: authReducer.isLoggedIn,
  loginData: authReducer.loginData,
  /* Symptom QA list */
  GetAllSymptomsData: dashboardReducer.GetAllSymptomsData,
  isGetAllSymptomsLoading: dashboardReducer.isGetAllSymptomsLoading,
  isRefreshingSymptomsList: dashboardReducer.isRefreshingSymptomsList,
  QuesAnsData: dashboardReducer.getAddQueAnsData,
  user_language: authReducer.language,
});
const mapDispatchToProps = dispatch => ({
  AppActions: bindActionCreators(AppActions, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(CircleOFTrust);
