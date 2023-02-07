// @ts-nocheck
import * as AppActions from "@actions";
import { navigatorPop } from "@config/navigationOptions";
import GLOBALS from "@constants";
import _, { cloneDeep } from "lodash";
import React, { Component, lazy } from "react";
import { StyleSheet, View, Alert, AppState, Platform } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import moment from "moment";
import { RFValue } from "react-native-responsive-fontsize";
import { strings } from "@localization";
import { alertWithOneBtn } from "@helpers/common";
let sum = 0
let checkSum = 0
let checkSum1 = 0

const { COLOR, STRINGS } = GLOBALS;
const Header = lazy(() => import("@components/common/Header"));
const AssessmentDetailComponent = lazy(() =>
  import("@components/dashboard/assessments/assessmentDetail")
);
import Styles from "../styles";


class AssessmentDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOptions: [],
      selectedRadioOptions: [],
      selectedRadioOptionsCopy: [],
      requestPayload: [],
      questionObject: {
        // user_id: "",
        // assessment_id: "",
        questionId: "",
        // patient_assessment_id: "",
        options: [],
        textAns: '',
        totalPointEarned: ''
      },
      appState: AppState.currentState,
    };
    this.getAssessmentsQuestions();

    if (this.props.screen == "playlist") {
      this._startTime();
    }
  }

  _startTime() {
    this.props.AppActions.getScreenStartTime(moment().format());
  }

  componentDidMount() {
    if (this.props.screen == "playlist") {
      AppState.addEventListener("change", this._handleAppStateChange);
    }
  }

  componentWillUnmount() {
    // AppState.removeEventListener("change", this._handleAppStateChange);
  }



  _handleAppStateChange = (nextAppState) => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      this._startTime();
    } else {
      let { activeScreenStartTime } = this.props;
      let postData = {
        group: STRINGS.PATIENT_REPORTED_OUTCOMES,
        event: "Assessment",
        inTime: activeScreenStartTime,
        outTime: moment().format(),
        activityDate: moment().format(),
      }
      if (Platform.OS == "android") {
        this.props.AppActions.addTimeTraker(postData);
      } else if (
        Platform.OS == "ios" &&
        this.state.appState.match(/inactive|background/) !== null
      ) {
        this.props.AppActions.addTimeTraker(postData);
      }
    }
    this.setState({ appState: nextAppState });
  };

  getAssessmentsQuestions = () => {
    let { userId, assessment_id, patientAssessmentId } = this.props;
    this.props.AppActions.getAssessmentsQuestions(assessment_id
      // userId,
      // assessment_id,
      // patientAssessmentId
    );
  };
  addToSelectedOptionsCheckbox = (question, option) => {
    let { selectedOptions, requestPayload, questionObject } = this.state;
    const { userId, patientAssessmentId } = this.props;
    let requestPayloadHaveThisQuestion = false;
    //check if question is already added to requestPayload else add one
    requestPayload.map((payloadQuestion) => {
      if (payloadQuestion.question_id === question._id) {
        requestPayloadHaveThisQuestion = true;
      }
    });
    let toggle = (selectedOptions) => selectedOptions._id === option._id;
    if (selectedOptions.some(toggle)) {
      _.remove(selectedOptions, (item) => {
        return item._id === option._id;
      });
      this.setState({
        requestPayload: requestPayload,
      });
    } else {
      if (requestPayloadHaveThisQuestion) {
        requestPayload.map((item) => {
          if (item.question_id === question._id) {
            option["selected"] = true;
            item.options.push({ "optionPoint": option.optionPoint, "optionValue": option.optionValue });
          }
        });
        questionObject.options.push({ "optionPoint": option.optionPoint, "optionValue": option.optionValue });
        questionObject.options.forEach(element => {
          checkSum1 += element.optionPoint;
        });
        questionObject.totalPointEarned = checkSum1;
        selectedOptions.push(option);

        this.setState({
          requestPayload: requestPayload,
          questionObject: {
            questionId: "",
            options: [],
            textAns: '',
            totalPointEarned: '',
          },
        });
      } else {
        requestPayload.push(questionObject);
        questionObject.questionId = question._id;
        // questionObject.user_id = userId;
        option["selected"] = true;
        questionObject.options.push({ "optionPoint": option.optionPoint, "optionValue": option.optionValue });

        questionObject.options.forEach(element => {
          checkSum1 += element.optionPoint;
        });
        questionObject.totalPointEarned = checkSum1;
        selectedOptions.push(option);
        this.setState({
          requestPayload: requestPayload,
          questionObject: {
            questionId: "",
            options: [],
            textAns: '',
            totalPointEarned: '',
          },
        });
      }
    }
  };

  addToSelectedOptionsRadioOld = (question, option) => {
    let { selectedRadioOptions, requestPayload, questionObject } = this.state;
    const { userId } = this.props;

    let requestPayloadHaveThisQuestion = false;
    //check if question is already added to requestPayload else add one
    requestPayload.map((payloadQuestion) => {
      if (payloadQuestion.question_id === question._id) {
        requestPayloadHaveThisQuestion = true;
      }
    });
    requestPayload.push(questionObject);
    questionObject.questionId = question._id;

    question?.options.map((item) => {
      if (item._id == option._id) {
        item["selected"] = true;
      } else if ((item._id != option._id)) {
        item["selected"] = false;
      }
    });

    if (option && option.optionPoint)
      option["optionPoint"] = option.optionPoint;
    option["optionValue"] = option.optionValue;
    questionObject.options.push({
      "optionPoint": question && question.options && question.options[0].optionPoint,
      "optionValue": question && question.options && question.options[0].optionValue
    });
    questionObject["textAns"] = '';
    questionObject["totalPointEarned"] = question.options[0].optionPoint;
    selectedRadioOptions.push(option);
    this.setState({
      requestPayload: requestPayload,
      questionObject: {
        questionId: "",
        options: [],
      },
    });
  };

  addToSelectedOptionsRadio = (question, option) => {

    let { selectedRadioOptions, selectedRadioOptionsCopy, requestPayload, questionObject } = this.state;
    const { userId, patientAssessmentId } = this.props;
    let requestPayloadHaveThisQuestion = false;
    //check if question is already added to requestPayload else add one
    requestPayload?.map((payloadQuestion) => {
      if (payloadQuestion.question_id === question._id) {
        requestPayloadHaveThisQuestion = true;
      }
    });
    question?.options.map((item) => { item.queId = question._id })
    console.log('question', question)
    question?.options.map((item) => {
      if (item._id == option._id) {
        item["selected"] = true;
        item["questionId"] = question._id;
        requestPayload.push(questionObject);
        questionObject.questionId = question._id;

        if (option && option.optionPoint)
          option["optionPoint"] = option.optionPoint;
        option["optionValue"] = option.optionValue;

        questionObject.options.push({ "optionPoint": option.optionPoint, "optionValue": option.optionValue });
        questionObject.options.forEach(element => {
          sum = element.optionPoint;
        });

        questionObject.totalPointEarned = sum;

        if (selectedRadioOptions.length > 0) {
          console.log('option>>>>', option)
          selectedRadioOptions.map(e => {
            if (e.questionId == option.questionId) {
              selectedRadioOptions.splice(0, selectedRadioOptions.length);
              selectedRadioOptions.push(option);
            }
            selectedRadioOptions.push(option);
          })
          // selectedRadioOptions.map(e => {
          //   if(e.questionId == question._id){
          //     let filterData = selectedRadioOptions.findIndex(f => f.questionId == e.questionId)      
          //     selectedRadioOptions.splice(0, filterData);
          //   }
          //   selectedRadioOptions.push(option);
          // } )        
        } else {
          selectedRadioOptions.push(option);
        }

        let notSelectedIndex = selectedRadioOptions.findIndex(index => !index.selected)
        selectedRadioOptions.splice(0, notSelectedIndex);

        selectedRadioOptions.splice(0, selectedRadioOptionsCopy.findIndex(index => !index.selected));
        console.log('selectedRadioOptionsCopy', selectedRadioOptionsCopy)

        selectedRadioOptionsCopy.push(option)

        if (requestPayload.length > 1) {
          console.log("requestPayload1111", requestPayload);
          requestPayload.splice(0, 1)
          console.log("requestPayload222", requestPayload);
        }
        this.setState({
          requestPayload: requestPayload,
          questionObject: {
            questionId: "",
            options: [],
            textAns: '',
            totalPointEarned: '',
          },
        });
      } else if ((item._id != option._id)) {
        item["selected"] = false;
      }
    });
  };

  saveAssessmentQuestion = () => {
    const { requestPayload, questionObject } = this.state;
    const { componentId, userLanguage, } = this.props;
    if (requestPayload !== undefined && requestPayload.length) {
      console.log("payload", requestPayload);
      this.props.AppActions.saveAssessmentQuestion(requestPayload, this.props.assessment_id, componentId);
    } else {
      alertWithOneBtn("Please fill atleast one questions answer.");
    }
  };

  saveAssessmentText = (question, description) => {
    console.log("text description ==>", question);
    let { requestPayload, questionObject } = this.state;
    const { userId, patientAssessmentId } = this.props;
    let requestPayloadHaveThisQuestion = false;
    requestPayload?.map((payloadQuestion) => {
      if (payloadQuestion.question_id === question._id) {
        requestPayloadHaveThisQuestion = true;
      }
    });
    if (!requestPayloadHaveThisQuestion) {
      requestPayload.push(questionObject);
      questionObject.questionId = question._id;



      questionObject.options.push({ "optionPoint": question && question.options && question.options[0]?.optionPoint, "optionValue": question && question.options && question.options[0]?.optionValue });

      questionObject.options.forEach(element => {
        checkSum += element?.optionPoint;
      });

      // questionObject.totalPointEarned = checkSum;
      questionObject.totalPointEarned = question.textPoint

      // questionObject["selected"] = true;
      questionObject["textAns"] = description;
      // requestPayload = questionObject
      this.setState({
        requestPayload: requestPayload,
        questionObject: {
          // user_id: "",
          // assessment_id: "",
          questionId: "",
          // patient_assessment_id: "",
          options: [],
        },
      });
      console.log("text data ==>", requestPayload);
    } else {
      requestPayload.map((item) => {
        if (item.question_id === question._id) {
          item["textAns"] = description;
        }
      });
    }
  };

  _goBack() {
    const { componentId, screen, userId, activeScreenStartTime } = this.props;
    if (screen == "playlist") {
      let postData = {
        group: STRINGS.PATIENT_REPORTED_OUTCOMES,
        event: "Assessment",
        inTime: activeScreenStartTime,
        outTime: moment().format(),
        activityDate: moment().format(),
      }
      this.props.AppActions.addTimeTraker(postData);
      navigatorPop({ componentId });
    } else {
      navigatorPop({ componentId });
    }
  }
  render() {
    const {
      componentId,
      allAssessmentsQuestions,
      assessmentQuestionsLoader,
      assessmentName,
      saveAssessmentLoader,
      assessment_status,
    } = this.props;
    const { selectedOptions, selectedRadioOptions } = this.state;
    return (
      <View style={Styles.homeContainer}>
        <Header
          title={assessmentName}
          isLeftIcon={true}
          isRightIcon={false}
          onLeftIconClick={() => {
            this._goBack();
          }}
          isTitle={true}
          isLogout={false}
          titleStyle={{
            //fontSize: RFValue(24),
            paddingTop: RFValue(10),
            // paddingTop:
            //   String(assessmentName).length <= 15 ? RFValue(10) : RFValue(0),
          }}
          titleWrapperStyle={{
            paddingTop:
              String(assessmentName).length <= 15 ? RFValue(30) : RFValue(23),
          }}
        />

        <AssessmentDetailComponent
          allAssessmentsQuestions={allAssessmentsQuestions}
          assessmentQuestionsLoader={assessmentQuestionsLoader}
          addToSelectedOptionsCheckbox={this.addToSelectedOptionsCheckbox}
          addToSelectedOptionsRadio={this.addToSelectedOptionsRadio}
          saveDescriptionText={this.saveDescriptionText}
          selectedOptions={selectedOptions}
          selectedRadioOptions={selectedRadioOptions}
          saveAssessmentLoader={saveAssessmentLoader}
          saveAssessmentText={this.saveAssessmentText}
          saveAssessmentQuestion={this.saveAssessmentQuestion}
          assessment_status={assessment_status}
        />
      </View>
    );
  }
}
const mapStateToProps = ({
  authReducer,
  assessmentsReducer,
  dashboardReducer,
}) => (

  {
    userId: authReducer?.loginData?.user?._id,
    allAssessmentsQuestions: assessmentsReducer?.allAssessmentsQuestions,
    assessmentQuestionsLoader: assessmentsReducer?.assessmentQuestionsLoader,
    saveAssessmentLoader: assessmentsReducer?.saveAssessmentLoader,
    allAssessments: assessmentsReducer?.allAssessments,
    activeScreenStartTime: dashboardReducer?.getScreenStartTime,
    userLanguage: authReducer?.loginData?.user?.language
  });
const mapDispatchToProps = (dispatch) => ({
  AppActions: bindActionCreators(AppActions, dispatch),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AssessmentDetail);

