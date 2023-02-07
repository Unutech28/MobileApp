// @ts-nocheck
import * as AppActions from "@actions";
import { navigatorPop } from "@config/navigationOptions";
import GLOBALS from "@constants";
import _, { cloneDeep } from "lodash";
import React, { Component, lazy } from "react";
import { StyleSheet, View } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { RFValue, RFPercentage } from "react-native-responsive-fontsize";
const { COLOR } = GLOBALS;
const Header = lazy(() => import("@components/common/Header"));
const JournalDetailComponent = lazy(() =>
  import("@components/dashboard/journal/journalDetail")
);
import { strings } from "@localization";
import Styles from "../styles";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
class AssessmentDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOptions: [],
      selectedRadioOptions: [],
      requestPayload: [],
      questionObject: {
        // user_id: "",
        // journalId: "",
        questionId: "",
        options: [],
        // isRefreshApi: false,
      },
    };
    this.getJournalQuestions();
  }


  getJournalQuestions = () => {
    let { userId, journal_id } = this.props;
    let postData = {
      journalId: journal_id,
      // user_id: userId,
    };
    this.props.AppActions.getJournalQuestions(journal_id);
    this.props.AppActions.getJournalAnswrs(journal_id);
    this.setState({ isRefreshApi: true });
  };

  addToSelectedOptionsCheckbox = (question, option) => {
    let { selectedOptions, requestPayload, questionObject } = this.state;
    const { userId } = this.props;
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
            item.options.push(option);
          }
        });
        questionObject.options.push({ "optionPoint": question && question.options && question.options[0].optionPoint, "optionValue": question && question.options && question.options[0].optionValue });
        questionObject["textAns"] = '';
        questionObject["totalPointEarned"] = question.options[0].optionPoint;
        // questionObject.options.push(option);
        selectedOptions.push(option);
        this.setState({
          requestPayload: requestPayload,
          questionObject: {
            // user_id: "",
            // journalId: "",
            questionId: "",
            options: [],
          },
        });
      } else {
        requestPayload.push(questionObject);
        questionObject.questionId = question._id;
        // questionObject.user_id = userId;
        // questionObject.journalId = question.journalId;
        // option["selected"] = true;
        questionObject.options.push({ "optionPoint": question && question.options && question.options[0].optionPoint, "optionValue": question && question.options && question.options[0].optionValue });
        questionObject["textAns"] = '';
        questionObject["totalPointEarned"] = question.options[0].optionPoint;
        // questionObject.options.push(option);
        selectedOptions.push(option);
        this.setState({
          requestPayload: requestPayload,
          questionObject: {
            // user_id: "",
            // journalId: "",
            questionId: "",
            options: [],
          },
        });

      }
    }
  };

  addToSelectedOptionsRadio = (question, option) => {
    let { selectedRadioOptions, requestPayload, questionObject } = this.state;
    const { userId } = this.props;

    let requestPayloadHaveThisQuestion = false;
    //check if question is already added to requestPayload else add one
    requestPayload.map((payloadQuestion) => {
      if (payloadQuestion.question_id === question._id) {
        requestPayloadHaveThisQuestion = true;
      }
    });

    // if (requestPayloadHaveThisQuestion) {
    //   requestPayload.map((item) => {
    //     console.log("data==>Item", item);
    //     if (item.question_id === question._id) {
    //       item.options = [];
    //       option["selected"] = true;
    //       item.options.push(option);
    //     }
    //   });
    //   selectedRadioOptions = [];

    //   // questionObject.options.push(option);
    //   questionObject.options.push({ "optionPoint": question && question.options && question.options[0].optionPoint, "optionValue": question && question.options && question.options[0].optionValue });
    //   questionObject["textAns"] = '';
    //   questionObject["totalPointEarned"] = question.options[0].optionPoint;
    //   selectedRadioOptions.push(option);
    //   this.setState({
    //     requestPayload: requestPayload,
    //     selectedRadioOptions: selectedRadioOptions,
    //     questionObject: {
    //       // user_id: "",
    //       // journalId: "",
    //       questionId: "",
    //       options: [],
    //     },
    //   });
    // } else {
    requestPayload.push(questionObject);
    questionObject.questionId = question._id;
    // questionObject.user_id = userId;
    // questionObject.journalId = question.journalId;
    question?.options.map((item) => {
      if (item._id == option._id) {
        item["selected"] = true;
      } else if ((item._id != option._id)) {
        item["selected"] = false;
      }
    });
    // option["selected"] = true;
    if (option && option.optionPoint)
      option["optionPoint"] = option.optionPoint;
    option["optionValue"] = option.optionValue;
    // option["optionPoint"] = option.optionPoint;
    // questionObject.options.push(option);
    questionObject.options.push({ "optionPoint": question && question.options && question.options[0].optionPoint, "optionValue": question && question.options && question.options[0].optionValue });
    questionObject["textAns"] = '';
    questionObject["totalPointEarned"] = question.options[0].optionPoint;
    selectedRadioOptions.push(option);
    this.setState({
      requestPayload: requestPayload,
      questionObject: {
        // user_id: "",
        // journalId: "",
        questionId: "",
        options: [],
      },
    });
    // }
  };
  saveAssessmentQuestion = () => {
    const { requestPayload } = this.state;
    const { componentId } = this.props;
    let { userId, journal_id } = this.props;
    console.log("save==>", requestPayload);
    let array = []
    array.push(requestPayload)
    this.props.AppActions.saveJournalQuestion(
      array,
      //componentId,
      journal_id,
      userId
    );
    this.props.AppActions.draftJournalAnswerClear();
    this.setState({
      requestPayload: [],
    });
    // this.goback()
    setTimeout(() => { this.goback() }, 2000)
  };

  draftPostClick = (item, description) => {
    console.log("DRAFT===>", item, description);
    let postData = {
      item: item,
      description: description,
    };
    this.props.AppActions.draftJournalAnswer(postData);
  };

  saveAssessmentText = (question, description, editAnswer) => {
    let { requestPayload, questionObject } = this.state;
    const { userId } = this.props;
    let requestPayloadHaveThisQuestion = false;
    // requestPayload.map((payloadQuestion) => {
    //   if (payloadQuestion.question_id === question._id) {
    //     requestPayloadHaveThisQuestion = true;
    //   }
    // });


    // if (!requestPayloadHaveThisQuestion) {

    // requestPayload.push(questionObject);
    questionObject.questionId = question._id;
    delete questionObject["options"];
    // questionObject.user_id = userId;
    // questionObject.journalId = question.journalId;
    questionObject["options"] = question.options

    // questionObject["optionPoint"] =
    //   question && question.options && question.options[0].optionPoint;
    // questionObject["selected"] = true;
    questionObject["textAns"] = description;
    // questionObject["_id"] = editAnswer ? question._id : null;
    questionObject["totalPointEarned"] = question && question?.options && question?.options[0]?.optionPoint;

    this.setState({
      requestPayload: questionObject,
      questionObject: {
        user_id: "",
        // journal_id: "",
        questionId: "",
        options: [],
      },
    });
    // } else {
    //   requestPayload.map((item) => {
    //     if (item.question_id === question._id) {
    //       item["textAns"] = description;
    //     }
    //   });
    // }
  };

  editAnswer = (answerId, answer) => {
    let { journal_id } = this.props;
    this.props.AppActions.editJournalAnswrs(
      journal_id,
      answerId,
      answer
    );
    setTimeout(() => { this.goback() }, 2000)
    // this.goback()
  }

  goback = () => {
    const {
      componentId,
    } = this.props;
    navigatorPop({ componentId });
  }

  render() {
    const {
      componentId,
      allJournalQuestions,
      journalQuestionsLoader,
      journalName,
      saveJournalLoader,
      saveJournalRes,
      getTextVisible,
      loginData,
      getDrftAnswerJournal,
      answers
    } = this.props;
    const { selectedOptions, selectedRadioOptions } = this.state;
    let draftPostAnswer;
    if (getDrftAnswerJournal !== "" && getDrftAnswerJournal !== undefined) {
      allJournalQuestions.forEach((element) => {
        if (element._id == getDrftAnswerJournal.item._id) {
          draftPostAnswer = getDrftAnswerJournal.description;
          // this.saveAssessmentText(
          //   getDrftAnswerJournal.item,
          //   getDrftAnswerJournal.description
          // );
        }
      });
    }

    return (
      <View style={Styles.homeContainer}>
        <Header
          isLeftIcon={true}
          isRightIcon={false}
          onLeftIconClick={() => {
            navigatorPop({ componentId });
          }}
          isTitle={true}
          title={strings.tab3.journal}
          isLogout={false}
          titleStyle={{
            // fontSize: RFValue(28),
            paddingTop: RFValue(10),
          }}
        />

        <KeyboardAwareScrollView>
          <JournalDetailComponent
            allAssessmentsQuestions={allJournalQuestions}
            assessmentQuestionsLoader={journalQuestionsLoader}
            addToSelectedOptionsCheckbox={this.addToSelectedOptionsCheckbox}
            addToSelectedOptionsRadio={this.addToSelectedOptionsRadio}
            saveDescriptionText={this.saveDescriptionText}
            selectedOptions={selectedOptions}
            selectedRadioOptions={selectedRadioOptions}
            saveAssessmentLoader={saveJournalLoader}
            saveAssessmentText={this.saveAssessmentText}
            saveAssessmentQuestion={this.saveAssessmentQuestion}
            isRefreshApi={this.state.isRefreshApi}
            getTextVisible={getTextVisible}
            draftPost={this.draftPostClick}
            getDrftAnsJournal={draftPostAnswer}
            editAnswer={this.editAnswer}
            journalAnswers={answers}
            gotoback={this.goback}
          />
        </KeyboardAwareScrollView>
      </View>
    );
  }
}
const mapStateToProps = ({
  authReducer,
  journalReducer,
  dashboardReducer,
}) => ({
  userId: authReducer?.loginData?.user?._id,
  loginData: authReducer?.loginData,
  allJournalQuestions: journalReducer?.allJournalQuestions,
  journalQuestionsLoader: journalReducer?.journalQuestionsLoader,
  saveJournalLoader: journalReducer?.saveJournalLoader,
  saveJournalRes: journalReducer?.saveJournalRes,
  getTextVisible: journalReducer?.getTextVisible,
  getDrftAnswerJournal: dashboardReducer?.getDrftAnsJournal,
  answers: journalReducer?.journalAnswers
});
const mapDispatchToProps = (dispatch) => ({
  AppActions: bindActionCreators(AppActions, dispatch),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AssessmentDetail);

