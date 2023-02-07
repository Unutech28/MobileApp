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
const TemplateSevenComponent = lazy(() =>
  import("@components/dashboard/dailyLearningTemplates/template/TemplateEight")
);

class TemplateEight extends Component {
  static contextType = ThemeContext;
  VideoRef;

  setRefOfVideo = (ref) => {
    this.VideoRef = ref;
  };

  submitBtnClicked = (like, comment, rating, card_id) => {
    let { loginData } = this.props;
    let postData = {
      user_id: loginData["user"]["_id"],
      card_id: card_id,
    };

    if (like != null) {
      postData["like"] = like;
      postData["hasUserLiked"] = true;
    } else if (comment != null) {
      postData["comment"] = comment;
      postData["hasUserCommented"] = true;
    } else if (rating != null) {
      postData["rating"] = rating;
      postData["hasUserRated"] = true;
    }
    this.props.AppActions.likeCommentRatingApi(postData);
  };

  render() {
    let {
      cardData,
      onAnswerSubmit,
      onLikeClick,
      onCommentClick,
      user_id,
      user_language
    } = this.props;

    return (
      <View style={Styles.homeContainer}>
        <TemplateSevenComponent
        user_language={user_language}
          onCommentClick={onCommentClick}
          onLikeClick={onLikeClick}
          cardData={cardData}
          onSubmit={(answerDetails) => onAnswerSubmit(answerDetails)}
          user_id={user_id}
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
)(TemplateEight);

const Styles = StyleSheet.create({
  homeContainer: {
    flex: 1,

  },
});
