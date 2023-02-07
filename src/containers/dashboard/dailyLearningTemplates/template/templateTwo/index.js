/* eslint-disable prettier/prettier */
/* eslint-disable module-resolver/use-alias */
import GLOBALS from "@constants";
import * as AppActions from "@actions";
import { ThemeContext } from "@hoc/withRedux";
import React, { Component, lazy } from "react";
import { StyleSheet, View, Text, AsyncStorage, AppState } from "react-native";
const { FONTS, STRINGS } = GLOBALS;
import { RFValue } from "react-native-responsive-fontsize";
import { connect } from "react-redux";
import { navigatorPop, navigatorPush } from "@config/navigationOptions";
import { bindActionCreators } from "redux";
const TemplateTwoComponent = lazy(() =>
  import("@components/dashboard/dailyLearningTemplates/template/templateTwo")
);

class TemplateTwo extends Component {
  static contextType = ThemeContext;

  render() {
    let { cardData, onAnswerSubmit, onLikeClick, onCommentClick } = this.props;
    return (
      <View style={Styles.homeContainer}>
        <TemplateTwoComponent
          onCommentClick={onCommentClick}
          onLikeClick={onLikeClick}
          cardData={cardData}
          onSubmit={(answerDetails) => onAnswerSubmit(answerDetails)}
        />
      </View>
    );
  }
}

const mapStateToProps = ({ authReducer }) => ({
  loginData: authReducer.loginData,
});

const mapDispatchToProps = (dispatch) => ({
  AppActions: bindActionCreators(AppActions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TemplateTwo);

const Styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
  },
});
