/* eslint-disable prettier/prettier */
/* eslint-disable module-resolver/use-alias */
import * as AppActions from "@actions";
import { ThemeContext } from "@hoc/withRedux";
import React, { Component, lazy } from "react";
import { StyleSheet, View } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
const TemplateFourComponent = lazy(() =>
  import("@components/dashboard/dailyLearningTemplates/template/templateFour")
);

class TemplateFour extends Component {

  static contextType = ThemeContext;
  VideoRef;

  render() {
    let {
      loginData,
      description,
      cardData,
      trackerClick,
      onLikeClick,
      onCommentClick,
      user_language,
      cardState
    } = this.props;
    return (
      <View style={Styles.homeContainer}>
        <TemplateFourComponent cardData={cardData}
        user_language={user_language}
          onCommentClick={onCommentClick}
          onLikeClick={onLikeClick}
          trackerClick={(type) => {
            trackerClick(type)
          }}
          cardState={cardState}
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
)(TemplateFour);

const Styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
  },
});
