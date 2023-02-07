/* eslint-disable prettier/prettier */
/* eslint-disable module-resolver/use-alias */
import * as AppActions from '@actions';
import {ThemeContext} from '@hoc/withRedux';
import React, {Component, lazy} from 'react';
import {StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
const TemplateNineComponent = lazy(() =>
  import('@components/dashboard/dailyLearningTemplates/template/TemplateNine'),
);

class TemplateNine extends Component {
  constructor(props) {
    super(props);
    this.state = {
    
    };
    this.getAssessments();
  }
  
  static contextType = ThemeContext;
  VideoRef;

  getAssessments = () => {
    this.props.AppActions.getAssessmentsQuestions(this.props.cardData?.otherAttribute?.assessmentType);
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.assessmentQuestionsLoader !== null &&
      this.props.assessmentQuestionsLoader !== prevProps.assessmentQuestionsLoader
    ) {
      // this.getAssessments();
    }
  }

  render() {
    let {
      cardData,
      user_language,
      onSubmit,
      allAssessmentsQuestions
    } = this.props;
    return (
      <View style={Styles.homeContainer}>
        <TemplateNineComponent
          cardData={cardData}
          allAssessmentsQuestionData={allAssessmentsQuestions}
          user_language={user_language}
          onSubmit={(answerDetails, score) => onSubmit(answerDetails, score)}
        />
      </View>
    );
  }
}

const mapStateToProps = ({authReducer,assessmentsReducer }) => ({
  loginData: authReducer.loginData,
  allAssessmentsQuestions: assessmentsReducer.allAssessmentsQuestions,
  assessmentQuestionsLoader: assessmentsReducer.assessmentQuestionsLoader,
});

const mapDispatchToProps = dispatch => ({
  AppActions: bindActionCreators(AppActions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TemplateNine);

const Styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
  },
});
